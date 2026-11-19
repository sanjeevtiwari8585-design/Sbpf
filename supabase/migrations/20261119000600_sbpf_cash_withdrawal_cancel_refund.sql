-- SBPF admin cancellation and safe Coin reversal for cash withdrawals.
-- Pending: no Coin debit has occurred. Approved: debit exists and is reversed atomically.
begin;

drop index if exists public.sbpf_one_pending_cash_withdrawal_per_member;
create unique index sbpf_one_open_cash_withdrawal_per_member
  on public.sbpf_reward_redemptions(member_profile_id)
  where status in ('pending','approved') and withdrawal_tier_inr is not null;

create or replace function public.sbpf_guard_cash_redemption_status()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if new.status is distinct from old.status then
    if old.status='pending' and new.status not in ('approved','rejected','cancelled') then
      raise exception 'INVALID_CASH_REDEMPTION_TRANSITION';
    end if;
    if old.status='approved' and new.status not in ('paid','cancelled') then
      raise exception 'INVALID_CASH_REDEMPTION_TRANSITION';
    end if;
    if old.status in ('paid','rejected','cancelled') then
      raise exception 'CASH_REDEMPTION_ALREADY_FINAL';
    end if;
    if new.status='paid' then
      if old.status<>'approved' or new.paid_at is null or nullif(btrim(new.payout_reference),'') is null then
        raise exception 'CASH_REDEMPTION_MUST_BE_APPROVED_AND_HAVE_PAYMENT_REFERENCE';
      end if;
      if not exists(select 1 from public.sbpf_reward_wallet_ledger l
        where l.member_profile_id=new.member_profile_id and l.entry_type='redemption'
          and l.reference_id=new.id and l.points_delta=-new.points_requested) then
        raise exception 'CASH_REDEMPTION_COINS_NOT_DEBITED';
      end if;
    end if;
    if new.status='cancelled' and old.status='approved' then
      if not exists(select 1 from public.sbpf_reward_wallet_ledger l
        where l.member_profile_id=new.member_profile_id and l.entry_type='redemption'
          and l.reference_id=new.id and l.points_delta=-new.points_requested) then
        raise exception 'CASH_REDEMPTION_COINS_NOT_DEBITED';
      end if;
    end if;
  end if;
  return new;
end;
$$;

alter table public.sbpf_reward_wallet_ledger
  drop constraint if exists sbpf_reward_wallet_ledger_entry_type_check;
alter table public.sbpf_reward_wallet_ledger
  add constraint sbpf_reward_wallet_ledger_entry_type_check
  check (entry_type = any (array[
    'task_reward','admin_adjustment','redemption','reversal','spin_reward',
    'transfer_debit','transfer_credit','product_redemption','watch_video_reward'
  ]));

create or replace function public.sbpf_rewards_on_redemption_paid()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_balance bigint; v_reserved bigint;
begin
  if new.status='approved' and old.status is distinct from 'approved' then
    perform pg_advisory_xact_lock(hashtextextended(new.member_profile_id::text,0));
    select coalesce(sum(points_delta),0)::bigint into v_balance
      from public.sbpf_reward_wallet_ledger where member_profile_id=new.member_profile_id;
    select
      coalesce((select sum(points_requested) from public.sbpf_reward_redemptions
        where member_profile_id=new.member_profile_id and status in ('pending','approved') and id<>new.id),0)
      + coalesce((select sum(amount) from public.sbpf_reward_wallet_transfers
        where sender_profile_id=new.member_profile_id and status='pending'),0)
      + coalesce((select sum(coins_cost) from public.sbpf_reward_product_orders
        where member_profile_id=new.member_profile_id and status='pending'),0)
      into v_reserved;
    if v_balance-v_reserved<new.points_requested then raise exception 'INSUFFICIENT_AVAILABLE_COINS_AT_APPROVAL'; end if;
    insert into public.sbpf_reward_wallet_ledger
      (member_profile_id,entry_type,reference_id,points_delta,description,created_by)
    values(new.member_profile_id,'redemption',new.id,-new.points_requested,
      'SBPF Coins redeemed after Admin approval',(select auth.uid()))
    on conflict(entry_type,reference_id) do nothing;
  end if;

  if new.status='cancelled' and old.status='approved' then
    perform pg_advisory_xact_lock(hashtextextended(new.member_profile_id::text,0));
    insert into public.sbpf_reward_wallet_ledger
      (member_profile_id,entry_type,reference_id,points_delta,description,created_by)
    values(new.member_profile_id,'reversal',new.id,new.points_requested,
      'SBPF Coins returned after Admin cancelled approved withdrawal',(select auth.uid()))
    on conflict(entry_type,reference_id) do nothing;
  end if;
  return new;
end;
$$;

create or replace function public.sbpf_admin_cancel_cash_withdrawal(
  p_redemption_id uuid,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare v_row public.sbpf_reward_redemptions%rowtype; v_main boolean;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  select exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin')
    into v_main;
  if not v_main and not exists(select 1 from public.sbpf_cash_withdrawal_approvers a
      where a.user_id=auth.uid() and a.is_active) then
    raise exception 'MAIN_ADMIN_OR_DELEGATE_ONLY';
  end if;
  if p_reason is null or length(btrim(p_reason))<5 then raise exception 'CANCELLATION_REASON_REQUIRED'; end if;

  select * into v_row from public.sbpf_reward_redemptions where id=p_redemption_id for update;
  if not found or v_row.withdrawal_tier_inr is null then raise exception 'WITHDRAWAL_NOT_FOUND'; end if;
  if v_row.status not in ('pending','approved') then raise exception 'WITHDRAWAL_NOT_CANCELLABLE'; end if;

  update public.sbpf_reward_redemptions
    set status='cancelled', cancelled_by=auth.uid(), cancelled_at=now(),
        cancellation_reason=btrim(p_reason), admin_note=btrim(p_reason)
    where id=p_redemption_id;

  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(p_redemption_id,auth.uid(),'admin_cancel',
    jsonb_build_object('status',v_row.status,'coins_debited',v_row.status='approved'),
    jsonb_build_object('status','cancelled','coin_refund',case when v_row.status='approved' then v_row.points_requested else 0 end,
      'cancelled_at',now()),btrim(p_reason));

  return jsonb_build_object('success',true,'status','cancelled',
    'coins_refunded',case when v_row.status='approved' then v_row.points_requested else 0 end);
end;
$$;

revoke all on function public.sbpf_admin_cancel_cash_withdrawal(uuid,text) from public,anon;
grant execute on function public.sbpf_admin_cancel_cash_withdrawal(uuid,text) to authenticated;

commit;
