-- SBPF cash withdrawal workflow RPCs. Staged in development branch; no production execution.
-- Fee collection/payout are deliberately external integrations and are not executed here.
begin;

-- Finance reviewer can review only; Main Admin/delegated approver makes final decision.
create or replace function public.sbpf_finance_review_cash_withdrawal(
  p_redemption_id uuid,
  p_decision text,
  p_note text default null
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare v_row public.sbpf_reward_redemptions%rowtype; v_member_user uuid;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  if not exists(select 1 from public.sbpf_cash_withdrawal_finance_team f where f.user_id=auth.uid() and f.is_active)
     and not exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin') then
    raise exception 'FINANCE_TEAM_ONLY';
  end if;
  if p_decision not in ('recommend','reject') then raise exception 'INVALID_FINANCE_DECISION'; end if;
  if p_decision='reject' and (p_note is null or length(btrim(p_note))<5) then raise exception 'REASON_REQUIRED'; end if;

  select * into v_row from public.sbpf_reward_redemptions where id=p_redemption_id for update;
  if not found then raise exception 'WITHDRAWAL_NOT_FOUND'; end if;
  if v_row.withdrawal_tier_inr is null then raise exception 'NOT_A_FIXED_TIER_WITHDRAWAL'; end if;
  if v_row.status<>'pending' then raise exception 'WITHDRAWAL_NOT_PENDING'; end if;
  if v_row.fee_payment_status<>'paid' then raise exception 'FEE_NOT_CONFIRMED'; end if;

  select user_id into v_member_user from public.members where user_id=v_row.member_profile_id limit 1;
  if v_member_user=auth.uid() then raise exception 'SELF_REVIEW_FORBIDDEN'; end if;
  if exists(select 1 from public.sbpf_cash_withdrawal_finance_team f where f.user_id=auth.uid() and f.is_active)
     and exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin') then
    -- Admin may review as Main Admin, but finance team review is still recorded distinctly.
    null;
  end if;

  update public.sbpf_reward_redemptions
    set finance_decision=p_decision, finance_reviewed_by=auth.uid(), finance_reviewed_at=now(),
        finance_note=case when p_decision='reject' then btrim(p_note) else 'Finance review recommended' end
    where id=p_redemption_id;

  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(p_redemption_id,auth.uid(),'finance_'||p_decision,
    jsonb_build_object('status',v_row.status,'fee_payment_status',v_row.fee_payment_status),
    jsonb_build_object('finance_reviewed_at',now(),'finance_decision',p_decision),
    coalesce(nullif(btrim(p_note),''),'Finance review completed'));

  return jsonb_build_object('success',true,'finance_decision',p_decision,'final_approval_pending',true);
end;
$$;

create or replace function public.sbpf_final_review_cash_withdrawal(
  p_redemption_id uuid,
  p_decision text,
  p_note text default null,
  p_bank_transaction_id text default null
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare v_row public.sbpf_reward_redemptions%rowtype; v_actor_is_main boolean;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  select exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin')
    into v_actor_is_main;
  if not v_actor_is_main and not exists(
    select 1 from public.sbpf_cash_withdrawal_approvers a where a.user_id=auth.uid() and a.is_active
  ) then raise exception 'FINAL_APPROVER_ONLY'; end if;
  if p_decision not in ('approve','reject','mark_paid') then raise exception 'INVALID_FINAL_DECISION'; end if;
  if p_decision='reject' and (p_note is null or length(btrim(p_note))<5) then raise exception 'REJECTION_REASON_REQUIRED'; end if;

  select * into v_row from public.sbpf_reward_redemptions where id=p_redemption_id for update;
  if not found then raise exception 'WITHDRAWAL_NOT_FOUND'; end if;
  if v_row.withdrawal_tier_inr is null then raise exception 'NOT_A_FIXED_TIER_WITHDRAWAL'; end if;

  if p_decision in ('approve','reject') then
    if v_row.status<>'pending' then raise exception 'WITHDRAWAL_NOT_PENDING'; end if;
    if v_row.fee_payment_status<>'paid' then raise exception 'FEE_NOT_CONFIRMED'; end if;
    if v_row.finance_reviewed_at is null or v_row.finance_decision is null then raise exception 'FINANCE_REVIEW_REQUIRED'; end if;
    if p_decision='approve' and v_row.finance_decision<>'recommend' then raise exception 'FINANCE_DID_NOT_RECOMMEND_APPROVAL'; end if;
    if p_decision='approve' then
      update public.sbpf_reward_redemptions
        set status='approved', final_approved_by=auth.uid(), final_approved_at=now(),
            reviewed_by=auth.uid(), reviewed_at=now(), admin_note=nullif(btrim(p_note),'')
        where id=p_redemption_id;
    else
      update public.sbpf_reward_redemptions
        set status='rejected', final_approved_by=auth.uid(), final_approved_at=now(),
            reviewed_by=auth.uid(), reviewed_at=now(), admin_note=btrim(p_note)
        where id=p_redemption_id;
    end if;
  elsif p_decision='mark_paid' then
    if not v_actor_is_main then raise exception 'MAIN_ADMIN_ONLY_FOR_PAYOUT_CONFIRMATION'; end if;
    if v_row.status<>'approved' then raise exception 'WITHDRAWAL_NOT_APPROVED'; end if;
    if p_bank_transaction_id is null or length(btrim(p_bank_transaction_id))<4 then raise exception 'BANK_TRANSACTION_ID_REQUIRED'; end if;
    update public.sbpf_reward_redemptions
      set status='paid', payout_reference=btrim(p_bank_transaction_id),
          bank_transaction_id=btrim(p_bank_transaction_id), payment_date=now(), paid_at=now()
      where id=p_redemption_id;
  end if;

  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(p_redemption_id,auth.uid(),'final_'||p_decision,
    jsonb_build_object('status',v_row.status),
    jsonb_build_object('status',(select status from public.sbpf_reward_redemptions where id=p_redemption_id)),
    coalesce(nullif(btrim(p_note),''),p_decision));

  return jsonb_build_object('success',true,'status',(select status from public.sbpf_reward_redemptions where id=p_redemption_id));
end;
$$;

-- Record verified fee-gateway callbacks or manual finance reconciliation.
-- Only Main Admin may call this authenticated RPC; production gateway should call through trusted server.
create or replace function public.sbpf_admin_record_withdrawal_fee(
  p_redemption_id uuid,
  p_payment_status text,
  p_payment_reference text,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare v_row public.sbpf_reward_redemptions%rowtype; v_attempts smallint;
begin
  if auth.uid() is null or not exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin') then
    raise exception 'MAIN_ADMIN_ONLY';
  end if;
  if p_payment_status not in ('paid','failed') then raise exception 'INVALID_FEE_STATUS'; end if;
  if p_reason is null or length(btrim(p_reason))<5 then raise exception 'REASON_REQUIRED'; end if;
  select * into v_row from public.sbpf_reward_redemptions where id=p_redemption_id for update;
  if not found or v_row.withdrawal_tier_inr is null then raise exception 'WITHDRAWAL_NOT_FOUND'; end if;
  if v_row.status<>'pending' then raise exception 'WITHDRAWAL_NOT_PENDING'; end if;
  v_attempts:=least(3,v_row.fee_payment_attempts+1);
  update public.sbpf_reward_redemptions
    set fee_payment_status=case when p_payment_status='paid' then 'paid'
      when v_attempts>=3 then 'manual_review' else 'pending' end,
      fee_payment_reference=nullif(btrim(p_payment_reference),''),
      fee_payment_attempts=v_attempts
    where id=p_redemption_id;
  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(p_redemption_id,auth.uid(),'fee_'||p_payment_status,
    jsonb_build_object('fee_payment_status',v_row.fee_payment_status,'attempts',v_row.fee_payment_attempts),
    jsonb_build_object('fee_payment_status',(select fee_payment_status from public.sbpf_reward_redemptions where id=p_redemption_id),
      'attempts',v_attempts,'reference',p_payment_reference),btrim(p_reason));
  return jsonb_build_object('success',true,'fee_payment_status',
    (select fee_payment_status from public.sbpf_reward_redemptions where id=p_redemption_id),
    'attempts',v_attempts);
end;
$$;

revoke all on function public.sbpf_finance_review_cash_withdrawal(uuid,text,text) from public,anon;
revoke all on function public.sbpf_final_review_cash_withdrawal(uuid,text,text,text) from public,anon;
revoke all on function public.sbpf_admin_record_withdrawal_fee(uuid,text,text,text) from public,anon;
grant execute on function public.sbpf_finance_review_cash_withdrawal(uuid,text,text) to authenticated;
grant execute on function public.sbpf_final_review_cash_withdrawal(uuid,text,text,text) to authenticated;
grant execute on function public.sbpf_admin_record_withdrawal_fee(uuid,text,text,text) to authenticated;

commit;
