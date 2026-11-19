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

  if v_count <> 12 then raise exception 'SPIN_PRIZE_COUNT_EXPECTED_12_GOT_%',v_count; end if;
  if v_total <> 10000 then raise exception 'SPIN_ODDS_EXPECTED_10000_BPS_GOT_%',v_total; end if;
  if v_values <> array[10,20,30,40,50,100,200,300,500,1000,2000,5000] then
    raise exception 'SPIN_PRIZE_VALUES_DO_NOT_MATCH_APPROVED_SET';
  end if;

  if not exists (
    select 1 from public.sbpf_spin_prize_options
    where prize_coins between 10 and 50
    having sum(probability_basis_points)=3000
  ) then raise exception 'SPIN_SMALL_PRIZE_GROUP_MUST_BE_30_PERCENT'; end if;
  if not exists (
    select 1 from public.sbpf_spin_prize_options
    where prize_coins between 100 and 500
    having sum(probability_basis_points)=6700
  ) then raise exception 'SPIN_MID_PRIZE_GROUP_MUST_BE_67_PERCENT'; end if;
  if not exists (
    select 1 from public.sbpf_spin_prize_options
    where prize_coins between 1000 and 5000
    having sum(probability_basis_points)=300
  ) then raise exception 'SPIN_HIGH_PRIZE_GROUP_MUST_BE_3_PERCENT'; end if;

  select pg_get_functiondef('public.sbpf_spin_wheel(smallint)'::regprocedure) into v_spin_def;
  if position('3 hours' in lower(v_spin_def))=0 then
    raise exception 'SPIN_FUNCTION_DOES_NOT_ENFORCE_THREE_HOUR_COOLDOWN';
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

  raise notice 'SBPF Reward Zone static contract checks passed. Behavioral/auth/RLS tests are still required.';
end $$;
