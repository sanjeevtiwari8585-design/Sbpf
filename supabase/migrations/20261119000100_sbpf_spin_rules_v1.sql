-- SBPF Reward Zone spin rules v1
-- Staged on a development branch only. Do not apply to production without review.
-- Existing spin rows and wallet ledger entries are preserved.

begin;

create table if not exists public.sbpf_spin_prize_options (
  prize_coins integer primary key check (prize_coins > 0),
  probability_basis_points integer not null check (probability_basis_points between 0 and 10000),
  updated_by uuid null references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into public.sbpf_spin_prize_options(prize_coins, probability_basis_points)
values
  (10,600),(20,600),(30,600),(40,600),(50,600),
  (100,1675),(200,1675),(300,1675),(500,1675),
  (1000,100),(2000,100),(5000,100)
on conflict (prize_coins) do nothing;

create table if not exists public.sbpf_member_spin_permissions (
  member_row_id bigint primary key references public.members(id) on delete cascade,
  spin_enabled boolean not null default true,
  reason text null,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.sbpf_spin_admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id),
  action text not null check (action in ('prizes_updated','member_spin_enabled','member_spin_disabled')),
  member_row_id bigint null references public.members(id),
  before_state jsonb not null default '{}'::jsonb,
  after_state jsonb not null default '{}'::jsonb,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.sbpf_spin_prize_options enable row level security;
alter table public.sbpf_member_spin_permissions enable row level security;
alter table public.sbpf_spin_admin_audit enable row level security;

drop policy if exists sbpf_spin_prizes_authenticated_read on public.sbpf_spin_prize_options;
create policy sbpf_spin_prizes_authenticated_read
  on public.sbpf_spin_prize_options for select to authenticated using (true);

drop policy if exists sbpf_spin_permission_admin_read on public.sbpf_member_spin_permissions;
create policy sbpf_spin_permission_admin_read
  on public.sbpf_member_spin_permissions for select to authenticated using (public.is_admin());

drop policy if exists sbpf_spin_audit_admin_read on public.sbpf_spin_admin_audit;
create policy sbpf_spin_audit_admin_read
  on public.sbpf_spin_admin_audit for select to authenticated using (public.is_admin());

revoke insert, update, delete on public.sbpf_spin_prize_options from anon, authenticated;
revoke insert, update, delete on public.sbpf_member_spin_permissions from anon, authenticated;
revoke insert, update, delete on public.sbpf_spin_admin_audit from anon, authenticated;
grant select on public.sbpf_spin_prize_options to authenticated;
grant select on public.sbpf_member_spin_permissions to authenticated;
grant select on public.sbpf_spin_admin_audit to authenticated;

-- Remove the obsolete legacy prize allow-list while preserving all historical rows.
do $$
declare c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid='public.sbpf_reward_spins'::regclass
      and contype='c'
      and pg_get_constraintdef(oid) ilike '%prize_coins%'
  loop
    execute format('alter table public.sbpf_reward_spins drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.sbpf_reward_spins
  add constraint sbpf_reward_spins_prize_coins_positive check (prize_coins > 0);

create or replace function public.sbpf_admin_save_spin_prizes(p_prizes jsonb, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_total integer;
  v_count integer;
  v_before jsonb;
  v_after jsonb;
begin
  if v_uid is null or not public.is_admin() then raise exception 'ADMIN_REQUIRED'; end if;
  if coalesce(length(trim(p_reason)),0) < 5 then raise exception 'REASON_REQUIRED'; end if;
  if jsonb_typeof(p_prizes) <> 'array' then raise exception 'PRIZES_MUST_BE_ARRAY'; end if;

  select count(*), coalesce(sum((x->>'probability_basis_points')::integer),0)
    into v_count, v_total
  from jsonb_array_elements(p_prizes) x;

  if v_count <> 12 or v_total <> 10000 then
    raise exception 'EXACTLY_12_PRIZES_AND_100_PERCENT_REQUIRED';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_prizes) x
    where (x->>'prize_coins')::integer <= 0
       or (x->>'probability_basis_points')::integer < 0
       or (x->>'probability_basis_points')::integer > 10000
  ) then raise exception 'INVALID_PRIZE_VALUE_OR_PROBABILITY'; end if;
  if (select count(distinct (x->>'prize_coins')::integer) from jsonb_array_elements(p_prizes) x) <> 12
  then raise exception 'PRIZE_VALUES_MUST_BE_UNIQUE'; end if;

  select coalesce(jsonb_agg(jsonb_build_object('prize_coins',prize_coins,'probability_basis_points',probability_basis_points) order by prize_coins),'[]'::jsonb)
    into v_before from public.sbpf_spin_prize_options;

  delete from public.sbpf_spin_prize_options;
  insert into public.sbpf_spin_prize_options(prize_coins,probability_basis_points,updated_by,updated_at)
  select (x->>'prize_coins')::integer,(x->>'probability_basis_points')::integer,v_uid,now()
  from jsonb_array_elements(p_prizes) x;

  select jsonb_agg(jsonb_build_object('prize_coins',prize_coins,'probability_basis_points',probability_basis_points) order by prize_coins)
    into v_after from public.sbpf_spin_prize_options;

  insert into public.sbpf_spin_admin_audit(actor_user_id,action,before_state,after_state,reason)
  values(v_uid,'prizes_updated',v_before,coalesce(v_after,'[]'::jsonb),trim(p_reason));

  return jsonb_build_object('success',true,'total_probability_basis_points',10000,'prizes',v_after);
end;
$function$;

create or replace function public.sbpf_admin_set_member_spin_permission(
  p_member_row_id bigint, p_enabled boolean, p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_before jsonb := '{}'::jsonb;
  v_after jsonb;
begin
  if v_uid is null or not public.is_admin() then raise exception 'ADMIN_REQUIRED'; end if;
  if p_member_row_id is null or p_enabled is null then raise exception 'MEMBER_AND_STATUS_REQUIRED'; end if;
  if coalesce(length(trim(p_reason)),0) < 5 then raise exception 'REASON_REQUIRED'; end if;

  select jsonb_build_object('spin_enabled',spin_enabled,'reason',reason)
    into v_before from public.sbpf_member_spin_permissions
    where member_row_id=p_member_row_id;

  insert into public.sbpf_member_spin_permissions(member_row_id,spin_enabled,reason,updated_by,updated_at)
  values(p_member_row_id,p_enabled,trim(p_reason),v_uid,now())
  on conflict(member_row_id) do update
    set spin_enabled=excluded.spin_enabled,reason=excluded.reason,updated_by=excluded.updated_by,updated_at=now();

  v_after := jsonb_build_object('spin_enabled',p_enabled,'reason',trim(p_reason));
  insert into public.sbpf_spin_admin_audit(actor_user_id,action,member_row_id,before_state,after_state,reason)
  values(v_uid,case when p_enabled then 'member_spin_enabled' else 'member_spin_disabled' end,
    p_member_row_id,coalesce(v_before,'{}'::jsonb),v_after,trim(p_reason));

  return jsonb_build_object('success',true,'member_row_id',p_member_row_id,'spin_enabled',p_enabled);
end;
$function$;

create or replace function public.sbpf_spin_wheel(p_wheel_no smallint default 1)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_member public.members%rowtype;
  v_wallet public.sbpf_reward_wallets%rowtype;
  v_last timestamptz;
  v_prize integer;
  v_roll integer;
  v_spin_id uuid;
  v_now timestamptz := now();
  v_next timestamptz;
begin
  if v_uid is null then raise exception 'LOGIN_REQUIRED'; end if;
  if p_wheel_no <> 1 then raise exception 'INVALID_WHEEL'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 20261119));

  select * into v_member from public.members m
  where m.user_id=v_uid and m.status='active' and m.membership_status='active'
    and m.payment_status='paid' and m.kyc_status='verified'
    and m.membership_end_date>=current_date
  limit 1;
  if not found then raise exception 'VERIFIED_ACTIVE_MEMBER_REQUIRED'; end if;

  if not exists (
    select 1 from public.member_annual_verifications av
    where av.member_row_id=v_member.id
      and av.verification_year=extract(year from current_date)::integer
      and av.status='verified' and av.valid_until>=current_date
  ) then raise exception 'ANNUAL_VERIFICATION_REQUIRED'; end if;

  if not exists (
    select 1 from public.member_service_access sa
    where sa.member_row_id=v_member.id and sa.service_code='rewards_zone'
      and sa.access_status='active' and (sa.expires_at is null or sa.expires_at>v_now)
  ) then raise exception 'REWARDS_ZONE_ACCESS_REQUIRED'; end if;

  if exists (
    select 1 from public.sbpf_member_spin_permissions sp
    where sp.member_row_id=v_member.id and sp.spin_enabled=false
  ) then raise exception 'MEMBER_SPIN_DISABLED_BY_ADMIN'; end if;

  select * into v_wallet from public.sbpf_reward_wallets w
  where w.member_profile_id=v_uid for update;
  if not found or v_wallet.wallet_status<>'active' or v_wallet.pin_hash is null then
    raise exception 'ACTIVE_WALLET_WITH_PIN_REQUIRED';
  end if;

  select max(s.created_at) into v_last
  from public.sbpf_reward_spins s
  where s.member_profile_id=v_uid;
  if v_last is not null and v_last > v_now-interval '3 hours' then
    raise exception 'SPIN_COOLDOWN_ACTIVE';
  end if;

  if not exists (select 1 from public.sbpf_spin_prize_options where probability_basis_points>0)
     or (select coalesce(sum(probability_basis_points),0) from public.sbpf_spin_prize_options) <> 10000
     or (select count(*) from public.sbpf_spin_prize_options) <> 12 then
    raise exception 'SPIN_PRIZE_CONFIGURATION_INVALID';
  end if;

  v_roll := floor(random()*10000)::integer;
  select prize_coins into v_prize
  from (
    select prize_coins,
      sum(probability_basis_points) over(order by prize_coins) as upper_bound
    from public.sbpf_spin_prize_options
  ) prize_ranges
  where v_roll < upper_bound
  order by upper_bound
  limit 1;

  if v_prize is null then raise exception 'SPIN_PRIZE_DRAW_FAILED'; end if;

  insert into public.sbpf_reward_spins(member_profile_id,member_row_id,prize_coins,wheel_number)
  values(v_uid,v_member.id,v_prize,1) returning id into v_spin_id;

  insert into public.sbpf_reward_wallet_ledger(member_profile_id,entry_type,reference_id,points_delta,description,created_by)
  values(v_uid,'spin_reward',v_spin_id,v_prize,'SBPF Spin Wheel reward: '||v_prize||' Coin',v_uid);

  v_next := v_now + interval '3 hours';
  return jsonb_build_object('success',true,'spin_id',v_spin_id,'wheel_number',1,
    'prize_coins',v_prize,'next_spin_at',v_next,'cooldown_seconds',10800);
end;
$function$;

revoke all on function public.sbpf_admin_save_spin_prizes(jsonb,text) from public, anon;
revoke all on function public.sbpf_admin_set_member_spin_permission(bigint,boolean,text) from public, anon;
revoke all on function public.sbpf_spin_wheel(smallint) from public, anon;
grant execute on function public.sbpf_admin_save_spin_prizes(jsonb,text) to authenticated;
grant execute on function public.sbpf_admin_set_member_spin_permission(bigint,boolean,text) to authenticated;
grant execute on function public.sbpf_spin_wheel(smallint) to authenticated;

commit;
