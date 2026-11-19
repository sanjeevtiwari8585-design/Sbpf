-- Fixed-tier member request RPC. Bank account is accepted only as ciphertext from a trusted
-- client-side encryption flow; plaintext account numbers must never be sent to this RPC.
begin;

create unique index if not exists sbpf_one_pending_cash_withdrawal_per_member
  on public.sbpf_reward_redemptions(member_profile_id)
  where status='pending' and withdrawal_tier_inr is not null;

create or replace function public.sbpf_request_fixed_cash_withdrawal(
  p_tier_inr integer,
  p_bank_account_ciphertext text,
  p_bank_account_last4 text,
  p_bank_ifsc text,
  p_wallet_pin text
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
  v_uid uuid:=auth.uid();
  v_member public.members%rowtype;
  v_wallet public.sbpf_reward_wallets%rowtype;
  v_rate integer;
  v_fee_pct numeric(5,2);
  v_fee numeric(12,2);
  v_net numeric(12,2);
  v_points integer;
  v_balance bigint;
  v_reserved bigint;
  v_id uuid;
begin
  if v_uid is null then raise exception 'LOGIN_REQUIRED'; end if;
  if p_tier_inr is null or p_tier_inr not in (500,1000,5000,10000) then raise exception 'INVALID_WITHDRAWAL_TIER'; end if;
  if p_bank_account_ciphertext is null or length(p_bank_account_ciphertext)<24 then raise exception 'ENCRYPTED_BANK_ACCOUNT_REQUIRED'; end if;
  if p_bank_account_last4 !~ '^[0-9]{4}$' then raise exception 'INVALID_BANK_ACCOUNT_LAST4'; end if;
  if p_bank_ifsc !~ '^[A-Z]{4}0[A-Z0-9]{6}$' then raise exception 'INVALID_IFSC'; end if;
  if p_wallet_pin !~ '^[0-9]{4}$' then raise exception 'INVALID_WALLET_PIN_FORMAT'; end if;

  select * into v_member from public.members
   where user_id=v_uid and status='active' and membership_status='active'
     and payment_status='paid' and kyc_status='verified'
     and membership_end_date>=current_date limit 1;
  if not found then raise exception 'VERIFIED_ACTIVE_MEMBER_REQUIRED'; end if;
  if not exists(select 1 from public.member_annual_verifications
    where member_row_id=v_member.id and verification_year=extract(year from current_date)::integer
      and status='verified' and valid_until>=current_date) then raise exception 'ANNUAL_VERIFICATION_REQUIRED'; end if;
  if not exists(select 1 from public.member_service_access
    where member_row_id=v_member.id and service_code='rewards_zone'
      and access_status='active' and (expires_at is null or expires_at>now())) then
    raise exception 'REWARDS_ZONE_ACCESS_REQUIRED';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text,0));
  if exists(select 1 from public.sbpf_reward_redemptions
    where member_profile_id=v_uid and status='pending' and withdrawal_tier_inr is not null) then
    raise exception 'PENDING_WITHDRAWAL_ALREADY_EXISTS';
  end if;

  select * into v_wallet from public.sbpf_reward_wallets where member_profile_id=v_uid for update;
  if not found or v_wallet.wallet_status<>'active' or v_wallet.pin_hash is null then
    raise exception 'ACTIVE_PINNED_WALLET_REQUIRED';
  end if;
  if v_wallet.pin_locked_until is not null and v_wallet.pin_locked_until>now() then
    raise exception 'WALLET_PIN_LOCKED';
  end if;
  if extensions.crypt(p_wallet_pin,v_wallet.pin_hash)<>v_wallet.pin_hash then
    update public.sbpf_reward_wallets
      set failed_pin_attempts=failed_pin_attempts+1,
          pin_locked_until=case when failed_pin_attempts+1>=3 then now()+interval '30 minutes' else pin_locked_until end,
          updated_at=now()
      where member_profile_id=v_uid;
    return jsonb_build_object('success',false,'error','INVALID_WALLET_PIN',\n      'attempts_remaining',greatest(0,3-(select failed_pin_attempts from public.sbpf_reward_wallets where member_profile_id=v_uid)),\n      'locked_until',(select pin_locked_until from public.sbpf_reward_wallets where member_profile_id=v_uid));
  end if;
  update public.sbpf_reward_wallets set failed_pin_attempts=0,pin_locked_until=null,updated_at=now()
    where member_profile_id=v_uid;

  select coin_per_inr into v_rate from public.sbpf_rewards_config where id=1;
  if v_rate is null or v_rate<=0 then raise exception 'COIN_VALUE_NOT_CONFIGURED'; end if;
  v_fee_pct:=case p_tier_inr when 500 then 30 when 1000 then 20 when 5000 then 10 when 10000 then 5 end;
  v_fee:=round(p_tier_inr*v_fee_pct/100,2);
  v_net:=p_tier_inr-v_fee;
  v_points:=p_tier_inr*v_rate;

  select coalesce(sum(points_delta),0)::bigint into v_balance
    from public.sbpf_reward_wallet_ledger where member_profile_id=v_uid;
  select coalesce((select sum(points_requested) from public.sbpf_reward_redemptions
      where member_profile_id=v_uid and status in ('pending','approved')),0)
    + coalesce((select sum(amount) from public.sbpf_reward_wallet_transfers
      where sender_profile_id=v_uid and status='pending'),0)
    + coalesce((select sum(coins_cost) from public.sbpf_reward_product_orders
      where member_profile_id=v_uid and status='pending'),0)
    into v_reserved;
  if v_balance-v_reserved<v_points then raise exception 'INSUFFICIENT_AVAILABLE_COINS'; end if;

  insert into public.sbpf_reward_redemptions(
    member_profile_id,points_requested,amount_inr,payout_method,
    withdrawal_tier_inr,fee_percent,fee_amount_inr,net_amount_inr,
    bank_account_ciphertext,bank_account_last4,bank_ifsc,fee_payment_status
  ) values (
    v_uid,v_points,v_net,'bank_transfer',
    p_tier_inr,v_fee_pct,v_fee,v_net,
    p_bank_account_ciphertext,p_bank_account_last4,p_bank_ifsc,'pending'
  ) returning id into v_id;

  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(v_id,v_uid,'member_request','{}'::jsonb,
    jsonb_build_object('tier_inr',p_tier_inr,'fee_inr',v_fee,'net_inr',v_net,'coin_reserved',v_points,'bank_last4',p_bank_account_last4,'ifsc',p_bank_ifsc),
    'Member submitted fixed-tier withdrawal request');

  return jsonb_build_object('success',true,'redemption_id',v_id,'status','pending',
    'gross_inr',p_tier_inr,'fee_percent',v_fee_pct,'fee_inr',v_fee,'net_inr',v_net,
    'coins_reserved',v_points,'fee_payment_status','pending');
end;
$$;

revoke all on function public.sbpf_request_fixed_cash_withdrawal(integer,text,text,text,text) from public,anon;
grant execute on function public.sbpf_request_fixed_cash_withdrawal(integer,text,text,text,text) to authenticated;

commit;
