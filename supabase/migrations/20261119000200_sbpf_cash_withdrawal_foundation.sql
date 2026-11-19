-- SBPF Cash Withdrawal schema foundation (staged only)
-- Do not apply to production until approval and legal/payment-provider review.
-- This migration intentionally does NOT enable payout execution or alter existing RPC behavior.

begin;

alter table public.sbpf_reward_redemptions
  add column if not exists withdrawal_tier_inr integer,
  add column if not exists fee_percent numeric(5,2),
  add column if not exists fee_amount_inr numeric(12,2),
  add column if not exists net_amount_inr numeric(12,2),
  add column if not exists bank_account_last4 text,
  add column if not exists bank_ifsc text,
  add column if not exists bank_account_ciphertext text,
  add column if not exists fee_payment_status text not null default 'not_applicable',
  add column if not exists fee_payment_reference text,
  add column if not exists fee_payment_attempts smallint not null default 0,
  add column if not exists finance_reviewed_by uuid references auth.users(id),
  add column if not exists finance_reviewed_at timestamptz,
  add column if not exists finance_note text,
  add column if not exists final_approved_by uuid references auth.users(id),
  add column if not exists final_approved_at timestamptz,
  add column if not exists cancelled_by uuid references auth.users(id),
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text,
  add column if not exists bank_transaction_id text,
  add column if not exists payment_date timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='sbpf_redemption_withdrawal_tier_check') then
    alter table public.sbpf_reward_redemptions
      add constraint sbpf_redemption_withdrawal_tier_check
      check (withdrawal_tier_inr is null or withdrawal_tier_inr in (500,1000,5000,10000));
  end if;
  if not exists (select 1 from pg_constraint where conname='sbpf_redemption_fee_percent_check') then
    alter table public.sbpf_reward_redemptions
      add constraint sbpf_redemption_fee_percent_check
      check (fee_percent is null or fee_percent in (30,20,10,5));
  end if;
  if not exists (select 1 from pg_constraint where conname='sbpf_redemption_fee_attempts_check') then
    alter table public.sbpf_reward_redemptions
      add constraint sbpf_redemption_fee_attempts_check
      check (fee_payment_attempts between 0 and 3);
  end if;
  if not exists (select 1 from pg_constraint where conname='sbpf_redemption_fee_status_check') then
    alter table public.sbpf_reward_redemptions
      add constraint sbpf_redemption_fee_status_check
      check (fee_payment_status in ('not_applicable','pending','paid','failed','manual_review'));
  end if;
end $$;

create table if not exists public.sbpf_cash_withdrawal_finance_team (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  appointed_by uuid not null references auth.users(id),
  appointed_at timestamptz not null default now(),
  removed_by uuid references auth.users(id),
  removed_at timestamptz,
  removal_reason text
);

create table if not exists public.sbpf_cash_withdrawal_audit (
  id uuid primary key default gen_random_uuid(),
  redemption_id uuid not null references public.sbpf_reward_redemptions(id),
  actor_user_id uuid not null references auth.users(id),
  action text not null,
  before_state jsonb not null default '{}'::jsonb,
  after_state jsonb not null default '{}'::jsonb,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.sbpf_cash_withdrawal_finance_team enable row level security;
alter table public.sbpf_cash_withdrawal_audit enable row level security;

drop policy if exists sbpf_cash_finance_team_admin_read on public.sbpf_cash_withdrawal_finance_team;
create policy sbpf_cash_finance_team_admin_read
  on public.sbpf_cash_withdrawal_finance_team for select to authenticated using (public.is_admin());

drop policy if exists sbpf_cash_audit_admin_read on public.sbpf_cash_withdrawal_audit;
create policy sbpf_cash_audit_admin_read
  on public.sbpf_cash_withdrawal_audit for select to authenticated using (public.is_admin());

revoke all on public.sbpf_cash_withdrawal_finance_team from anon, authenticated;
revoke all on public.sbpf_cash_withdrawal_audit from anon, authenticated;
grant select on public.sbpf_cash_withdrawal_finance_team to authenticated;
grant select on public.sbpf_cash_withdrawal_audit to authenticated;

commit;
