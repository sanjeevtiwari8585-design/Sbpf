-- SBPF Finance Team appointment and restricted Finance review queue.
-- Member bank ciphertext is never returned by the queue RPC.
begin;

create or replace function public.sbpf_admin_set_cash_withdrawal_finance_member(
  p_user_id uuid,
  p_enabled boolean,
  p_reason text
) returns jsonb
language plpgsql security definer set search_path=''
as $$
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'MAIN_ADMIN_ONLY'; end if;
  if p_user_id is null or p_enabled is null then raise exception 'INVALID_FINANCE_MEMBER'; end if;
  if p_reason is null or length(btrim(p_reason))<5 then raise exception 'REASON_REQUIRED'; end if;
  if p_enabled then
    insert into public.sbpf_cash_withdrawal_finance_team(user_id,is_active,appointed_by,appointed_at,removed_by,removed_at,removal_reason)
    values(p_user_id,true,auth.uid(),now(),null,null,null)
    on conflict(user_id) do update set is_active=true,appointed_by=auth.uid(),appointed_at=now(),
      removed_by=null,removed_at=null,removal_reason=null;
  else
    update public.sbpf_cash_withdrawal_finance_team
      set is_active=false,removed_by=auth.uid(),removed_at=now(),removal_reason=btrim(p_reason)
      where user_id=p_user_id;
  end if;
  return jsonb_build_object('success',true,'user_id',p_user_id,'enabled',p_enabled);
end;
$$;

create or replace function public.sbpf_finance_cash_withdrawal_queue()
returns table(
  id uuid, member_name text, member_code text, tier_inr integer,
  points_requested integer, fee_percent numeric, fee_amount_inr numeric,
  net_amount_inr numeric, fee_payment_status text, fee_payment_attempts smallint,
  bank_account_last4 text, bank_ifsc text, status text, created_at timestamptz
)
language plpgsql security definer set search_path=''
as $$
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  if not exists(select 1 from public.sbpf_cash_withdrawal_finance_team f where f.user_id=auth.uid() and f.is_active)
    and not public.is_admin() then raise exception 'FINANCE_TEAM_ONLY'; end if;
  return query
    select r.id,coalesce(m.full_name,'SBPF सदस्य'),coalesce(m.member_id,''),
      r.withdrawal_tier_inr,r.points_requested,r.fee_percent,r.fee_amount_inr,r.net_amount_inr,
      r.fee_payment_status,r.fee_payment_attempts,r.bank_account_last4,r.bank_ifsc,r.status,r.created_at
    from public.sbpf_reward_redemptions r
    left join public.members m on m.user_id=r.member_profile_id
    where r.withdrawal_tier_inr is not null and r.status='pending'
    order by r.created_at asc;
end;
$$;

revoke all on function public.sbpf_admin_set_cash_withdrawal_finance_member(uuid,boolean,text) from public,anon;
revoke all on function public.sbpf_finance_cash_withdrawal_queue() from public,anon;
grant execute on function public.sbpf_admin_set_cash_withdrawal_finance_member(uuid,boolean,text) to authenticated;
grant execute on function public.sbpf_finance_cash_withdrawal_queue() to authenticated;
commit;
