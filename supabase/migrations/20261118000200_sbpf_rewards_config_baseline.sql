-- SBPF local Reward Zone configuration baseline
begin;

create table if not exists public.sbpf_rewards_config (
  id smallint primary key default 1,
  coin_per_inr integer not null default 100,
  currency_code text not null default 'INR',
  manual_payout boolean not null default true,
  verified_members_only boolean not null default true,
  rewards_enabled boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  constraint sbpf_rewards_config_id_check check (id = 1),
  constraint sbpf_rewards_config_coin_per_inr_check check (coin_per_inr > 0),
  constraint sbpf_rewards_config_currency_code_check check (currency_code = 'INR')
);

create index if not exists sbpf_rewards_config_updated_by_idx
on public.sbpf_rewards_config(updated_by);

insert into public.sbpf_rewards_config
  (id, coin_per_inr, currency_code, manual_payout, verified_members_only, rewards_enabled)
values
  (1, 100, 'INR', true, true, false)
on conflict (id) do nothing;

alter table public.sbpf_rewards_config enable row level security;

create policy sbpf_rewards_config_read_authenticated
on public.sbpf_rewards_config for select to authenticated using (true);

create policy sbpf_rewards_config_admin_insert
on public.sbpf_rewards_config for insert to authenticated
with check (public.is_admin());

create policy sbpf_rewards_config_admin_update
on public.sbpf_rewards_config for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy sbpf_rewards_config_admin_delete
on public.sbpf_rewards_config for delete to authenticated
using (public.is_admin());

revoke all on public.sbpf_rewards_config from anon;
grant select on public.sbpf_rewards_config to authenticated;
grant all on public.sbpf_rewards_config to service_role;

commit;
