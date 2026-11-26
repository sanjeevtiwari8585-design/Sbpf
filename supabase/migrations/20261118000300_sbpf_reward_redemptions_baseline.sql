-- SBPF local Reward Redemptions baseline
-- Reconstructed from read-only Production schema inspection.
-- Local development only; do not apply this file to Production.

begin;

create table public.sbpf_reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  member_profile_id uuid not null references auth.users(id) on delete restrict,
  points_requested integer not null check (points_requested > 0),
  amount_inr numeric,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','paid','cancelled')),
  payout_method text
    check (payout_method is null or payout_method in ('upi','bank_transfer','other')),
  payout_reference text,
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint sbpf_reward_redemptions_paid_check
    check (status <> 'paid' or (paid_at is not null and payout_reference is not null))
);

create index sbpf_reward_redemptions_member_idx
  on public.sbpf_reward_redemptions(member_profile_id, created_at desc);

create index sbpf_reward_redemptions_review_idx
  on public.sbpf_reward_redemptions(status, created_at);

create index sbpf_reward_redemptions_reviewed_by_idx
  on public.sbpf_reward_redemptions(reviewed_by);

alter table public.sbpf_reward_redemptions enable row level security;

create policy sbpf_reward_redemptions_read_own_admin
  on public.sbpf_reward_redemptions for select to authenticated
  using (member_profile_id = (select auth.uid()) or public.is_admin());

create policy sbpf_reward_redemptions_admin_update
  on public.sbpf_reward_redemptions for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

revoke all on public.sbpf_reward_redemptions from anon;
grant select on public.sbpf_reward_redemptions to authenticated;
grant all on public.sbpf_reward_redemptions to service_role;

commit;
