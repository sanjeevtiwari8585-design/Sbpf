-- Harden every Admin wallet-adjustment entry point.
-- Staged only: apply to a disposable sandbox after schema baseline is available.
-- No wallet or ledger rows are changed by creating/replacing these functions.

begin;

create or replace function public.sbpf_admin_adjust_reward_wallet(
  p_member_profile_id uuid,
  p_points_delta integer,
  p_description text,
  p_request_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_wallet public.sbpf_reward_wallets%rowtype;
  v_member_exists boolean;
  v_balance bigint;
  v_reserved bigint;
  v_entry_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'ADMIN_ONLY';
  end if;
  if p_member_profile_id is null or p_points_delta is null or p_points_delta = 0 then
    raise exception 'INVALID_ADJUSTMENT';
  end if;
  if p_description is null or length(btrim(p_description)) < 5 then
    raise exception 'DESCRIPTION_REQUIRED';
  end if;
  if p_request_id is null then
    raise exception 'REQUEST_ID_REQUIRED';
  end if;

  -- Serialize against the member-ID entry point and other adjustment requests.
  perform pg_advisory_xact_lock(hashtextextended(p_member_profile_id::text, 0));

  if exists (
    select 1 from public.sbpf_reward_wallet_ledger
    where entry_type='admin_adjustment' and reference_id=p_request_id
  ) then
    raise exception 'DUPLICATE_REQUEST_ID';
  end if;

  select exists(select 1 from public.members where user_id=p_member_profile_id)
    into v_member_exists;
  if not v_member_exists then
    raise exception 'MEMBER_NOT_FOUND';
  end if;

  select * into v_wallet
  from public.sbpf_reward_wallets
  where member_profile_id=p_member_profile_id
  for update;
  if not found then
    raise exception 'WALLET_NOT_CREATED_BY_MEMBER';
  end if;
  if v_wallet.wallet_status <> 'active' then
    raise exception 'WALLET_NOT_ACTIVE';
  end if;

  select coalesce(sum(points_delta),0)::bigint
    into v_balance
  from public.sbpf_reward_wallet_ledger
  where member_profile_id=p_member_profile_id;

  select
    coalesce((select sum(amount) from public.sbpf_reward_wallet_transfers
      where sender_profile_id=p_member_profile_id and status='pending'),0)
    + coalesce((select sum(points_requested) from public.sbpf_reward_redemptions
      where member_profile_id=p_member_profile_id and status='pending'),0)
    + coalesce((select sum(coins_cost) from public.sbpf_reward_product_orders
      where member_profile_id=p_member_profile_id and status='pending'),0)
    into v_reserved;

  if p_points_delta < 0 and v_balance-v_reserved < abs(p_points_delta)::bigint then
    raise exception 'ADJUSTMENT_EXCEEDS_AVAILABLE_COIN_BALANCE';
  end if;

  insert into public.sbpf_reward_wallet_ledger
    (member_profile_id,entry_type,reference_id,points_delta,description,created_by)
  values
    (p_member_profile_id,'admin_adjustment',p_request_id,p_points_delta,
     btrim(p_description),auth.uid())
  returning id into v_entry_id;

  select coalesce(sum(points_delta),0)::bigint
    into v_balance
  from public.sbpf_reward_wallet_ledger
  where member_profile_id=p_member_profile_id;

  return jsonb_build_object(
    'success',true,'entry_id',v_entry_id,
    'member_profile_id',p_member_profile_id,
    'points_delta',p_points_delta,'balance_after',v_balance,
    'reserved_balance',v_reserved,'available_balance',v_balance-v_reserved
  );
exception
  when unique_violation then
    raise exception 'DUPLICATE_REQUEST_ID';
end;
$function$;

-- Keep the Member ID endpoint as a thin, validated wrapper over the same
-- canonical wallet-locked adjustment implementation.
create or replace function public.sbpf_admin_adjust_reward_wallet_by_member_id(
  p_member_id text,
  p_points_delta integer,
  p_description text,
  p_request_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_member public.members%rowtype;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'ADMIN_ONLY';
  end if;
  if p_member_id is null or p_points_delta is null or p_points_delta=0 then
    raise exception 'INVALID_ADJUSTMENT';
  end if;
  if p_description is null or length(btrim(p_description))<5 then
    raise exception 'DESCRIPTION_REQUIRED';
  end if;
  if p_request_id is null then
    raise exception 'REQUEST_ID_REQUIRED';
  end if;

  select * into v_member
  from public.members
  where member_id=btrim(p_member_id)
  limit 1;
  if not found or v_member.user_id is null then
    raise exception 'MEMBER_NOT_FOUND_OR_NO_WALLET_ACCOUNT';
  end if;

  return public.sbpf_admin_adjust_reward_wallet(
    v_member.user_id,p_points_delta,btrim(p_description),p_request_id
  );
end;
$function$;

revoke all on function public.sbpf_admin_adjust_reward_wallet(uuid,integer,text,uuid) from public,anon;
revoke all on function public.sbpf_admin_adjust_reward_wallet_by_member_id(text,integer,text,uuid) from public,anon;
grant execute on function public.sbpf_admin_adjust_reward_wallet(uuid,integer,text,uuid) to authenticated;
grant execute on function public.sbpf_admin_adjust_reward_wallet_by_member_id(text,integer,text,uuid) to authenticated;

commit;
