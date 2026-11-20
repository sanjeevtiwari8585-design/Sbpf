-- SBPF Reward Zone static contract checks.
-- Run ONLY after applying the staged migrations to a disposable SBPF sandbox.
-- This script is read-only and does not create or mutate production data.

do $$
declare
  v_count integer;
  v_total integer;
  v_values integer[];
  v_spin_def text;
  v_queue_def text;
  v_request_def text;
begin
  if to_regclass('public.sbpf_spin_prize_options') is null then
    raise exception 'MISSING_TABLE_sbpf_spin_prize_options';
  end if;
  if to_regclass('public.sbpf_member_spin_permissions') is null then
    raise exception 'MISSING_TABLE_sbpf_member_spin_permissions';
  end if;
  if to_regclass('public.sbpf_cash_withdrawal_audit') is null then
    raise exception 'MISSING_TABLE_sbpf_cash_withdrawal_audit';
  end if;

  select count(*), coalesce(sum(probability_basis_points),0),
         array_agg(prize_coins order by prize_coins)
    into v_count,v_total,v_values
  from public.sbpf_spin_prize_options;

  if v_count <> 4 then raise exception 'SPIN_PRIZE_COUNT_EXPECTED_4_GOT_%',v_count; end if;
  if v_total <> 10000 then raise exception 'SPIN_ODDS_EXPECTED_10000_BPS_GOT_%',v_total; end if;
  if v_values <> array[10,40,50,100] then
    raise exception 'SPIN_PRIZE_VALUES_DO_NOT_MATCH_APPROVED_SET';
  end if;
  if exists(select 1 from public.sbpf_spin_prize_options where probability_basis_points<>2500) then
    raise exception 'SPIN_ODDS_MUST_BE_25_PERCENT_EACH';
  end if;


  select pg_get_functiondef('public.sbpf_spin_wheel(smallint)'::regprocedure) into v_spin_def;
  if position('24 hours' in lower(v_spin_def))=0 then
    raise exception 'SPIN_FUNCTION_DOES_NOT_ENFORCE_24_HOUR_COOLDOWN';
  end if;
  if position('sbpf_member_spin_permissions' in lower(v_spin_def))=0 then
    raise exception 'SPIN_FUNCTION_DOES_NOT_CHECK_MEMBER_PERMISSION';
  end if;

  select pg_get_functiondef('public.sbpf_finance_cash_withdrawal_queue()'::regprocedure) into v_queue_def;
  if position('fee_payment_status' in lower(v_queue_def))=0
     or position('finance_reviewed_at' in lower(v_queue_def))=0 then
    raise exception 'FINANCE_QUEUE_FILTERS_MISSING';
  end if;
  if position('bank_account_ciphertext' in lower(v_queue_def))>0 then
    raise exception 'FINANCE_QUEUE_MUST_NOT_RETURN_BANK_CIPHERTEXT';
  end if;

  select pg_get_functiondef('public.sbpf_request_fixed_cash_withdrawal(integer,text,text,text,text)'::regprocedure)
    into v_request_def;
  if position('500,1000,5000,10000' in replace(lower(v_request_def),' ',''))=0 then
    raise exception 'FIXED_WITHDRAWAL_TIER_ALLOWLIST_MISSING';
  end if;
  if position('p_bank_account_ciphertext' in lower(v_request_def))=0 then
    raise exception 'ENCRYPTED_BANK_ACCOUNT_INPUT_MISSING';
  end if;

  if to_regclass('public.sbpf_member_login_credentials') is null then
    raise exception 'MISSING_TABLE_sbpf_member_login_credentials';
  end if;
  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='sbpf_member_login_credentials' and c.relrowsecurity
  ) then raise exception 'MEMBER_LOGIN_CREDENTIALS_RLS_NOT_ENABLED'; end if;
  if has_table_privilege('anon','public.sbpf_member_login_credentials','SELECT')
     or has_table_privilege('authenticated','public.sbpf_member_login_credentials','SELECT')
     or has_table_privilege('anon','public.sbpf_member_login_credentials','INSERT')
     or has_table_privilege('authenticated','public.sbpf_member_login_credentials','INSERT') then
    raise exception 'MEMBER_LOGIN_CREDENTIALS_EXPOSED_TO_CLIENT_ROLES';
  end if;

  select pg_get_functiondef('public.sbpf_member_login_pin_check(text,text,text,text,text)'::regprocedure)
    into v_request_def;
  if position('service_role_only' in lower(v_request_def))=0
     or position('extensions.crypt' in lower(v_request_def))=0
     or position('for update' in lower(v_request_def))=0
     or position('15 minutes' in lower(v_request_def))=0 then
    raise exception 'MEMBER_PIN_LOGIN_SECURITY_CONTRACT_MISSING';
  end if;
  if has_function_privilege('anon','public.sbpf_member_login_pin_check(text,text,text,text,text)','EXECUTE')
     or has_function_privilege('authenticated','public.sbpf_member_login_pin_check(text,text,text,text,text)','EXECUTE') then
    raise exception 'MEMBER_PIN_CHECK_RPC_EXPOSED_TO_CLIENT_ROLES';
  end if;

  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='sbpf_reward_redemptions'
      and t.tgname='sbpf_guard_cash_redemption_status' and not t.tgisinternal
  ) then raise exception 'CASH_REDEMPTION_STATUS_GUARD_TRIGGER_MISSING'; end if;
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='sbpf_reward_redemptions'
      and t.tgname='sbpf_rewards_on_redemption_paid' and not t.tgisinternal
  ) then raise exception 'CASH_REDEMPTION_COIN_HANDLER_TRIGGER_MISSING'; end if;

  raise notice 'SBPF Reward Zone static contract checks passed. Behavioral/auth/RLS tests are still required.';
end $$;
