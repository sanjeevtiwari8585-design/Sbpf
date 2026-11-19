-- Keep already-reviewed requests out of the Finance work queue.
-- Prevent repeat Finance decisions; Main Admin handles final approval/rejection.
begin;
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
    and not exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin') then
    raise exception 'FINANCE_TEAM_ONLY';
  end if;
  return query
    select r.id,coalesce(m.full_name,'SBPF सदस्य'),coalesce(m.member_id,''),
      r.withdrawal_tier_inr,r.points_requested,r.fee_percent,r.fee_amount_inr,r.net_amount_inr,
      r.fee_payment_status,r.fee_payment_attempts,r.bank_account_last4,r.bank_ifsc,r.status,r.created_at
    from public.sbpf_reward_redemptions r
    left join public.members m on m.user_id=r.member_profile_id
    where r.withdrawal_tier_inr is not null and r.status='pending'
      and r.finance_reviewed_at is null
    order by r.created_at asc;
end;
$$;
revoke all on function public.sbpf_finance_cash_withdrawal_queue() from public,anon;
grant execute on function public.sbpf_finance_cash_withdrawal_queue() to authenticated;
commit;
