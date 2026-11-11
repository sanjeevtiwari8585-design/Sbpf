-- Canonical SBPF identity: Member IDs issued by swarnimbharat.club.
-- All verification uses the existing public.members record and the same Supabase Auth user.
-- No new membership table, ID series, or project is created.

create or replace function public.women_empowerment_verify_member_id(p_member_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_phone text;
  v_digits text;
  v_member public.members%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('verified', false, 'reason', 'login_required');
  end if;
  if nullif(trim(p_member_id), '') is null or length(trim(p_member_id)) > 80 then
    return jsonb_build_object('verified', false, 'reason', 'member_id_or_membership_not_valid');
  end if;

  select u.phone into v_phone
  from auth.users u
  where u.id = v_user_id and u.phone_confirmed_at is not null;
  if v_phone is null then
    return jsonb_build_object('verified', false, 'reason', 'phone_otp_required');
  end if;

  v_digits := regexp_replace(v_phone, '[^0-9]', '', 'g');
  if length(v_digits) = 12 and left(v_digits, 2) = '91' then
    v_digits := right(v_digits, 10);
  end if;

  select m.* into v_member
  from public.members m
  where upper(trim(coalesce(m.member_id, ''))) = upper(trim(p_member_id))
    and m.user_id = v_user_id
    and right(regexp_replace(coalesce(m.mobile, ''), '[^0-9]', '', 'g'), 10) = right(v_digits, 10)
    and lower(coalesce(m.status, '')) = 'active'
    and lower(coalesce(m.membership_status, '')) = 'active'
    and lower(coalesce(m.payment_status, '')) = 'paid'
    and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
    and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date)
  limit 1;

  if not found then
    return jsonb_build_object('verified', false, 'reason', 'member_id_or_membership_not_valid');
  end if;

  return jsonb_build_object(
    'verified', true,
    'member_id', v_member.member_id,
    'member_name', v_member.full_name,
    'member_row_id', v_member.id,
    'membership_source', 'swarnimbharat.club_members'
  );
end;
$$;

revoke all on function public.women_empowerment_verify_member_id(text) from public, anon;
grant execute on function public.women_empowerment_verify_member_id(text) to authenticated;

create or replace function public.get_my_member_verification_status()
returns table(
  member_id text,
  email_verified boolean,
  mobile_verified boolean,
  kyc_status text,
  payment_verified boolean,
  membership_active boolean,
  membership_start_date date,
  membership_end_date date,
  annual_verification_status text,
  annual_valid_until date,
  fully_verified boolean
)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
declare
  uid uuid := auth.uid();
  m public.members%rowtype;
  email_ok boolean := false;
  phone_ok boolean := false;
  payment_ok boolean := false;
  annual_status text := 'pending';
  annual_until date := null;
  member_ok boolean := false;
  today_ist date := (now() at time zone 'Asia/Kolkata')::date;
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;

  select * into m from public.members where user_id = uid limit 1;
  if m.id is null then
    raise exception 'Member record not found';
  end if;

  select
    (u.email_confirmed_at is not null),
    (u.phone_confirmed_at is not null
      and right(regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g'), 10)
        = right(regexp_replace(coalesce(m.mobile, ''), '[^0-9]', '', 'g'), 10))
  into email_ok, phone_ok
  from auth.users u where u.id = uid;

  select exists (
    select 1
    from public.membership_payments p
    where p.user_id = uid
      and p.member_id = m.member_id
      and lower(coalesce(p.status, '')) in ('paid', 'success', 'completed', 'captured', 'verified')
      and coalesce(p.amount, 0) >= coalesce(m.membership_fee, 365)
  ) or lower(coalesce(m.payment_status, '')) = 'paid'
  into payment_ok;

  select a.status, a.valid_until
    into annual_status, annual_until
  from public.member_annual_verifications a
  where a.member_row_id = m.id
    and a.verification_year = extract(year from (now() at time zone 'Asia/Kolkata'))::integer
  order by a.updated_at desc
  limit 1;
  annual_status := coalesce(annual_status, 'pending');

  member_ok := lower(coalesce(m.status, '')) = 'active'
    and lower(coalesce(m.membership_status, '')) = 'active'
    and (m.membership_start_date is null or m.membership_start_date <= today_ist)
    and (m.membership_end_date is null or m.membership_end_date >= today_ist);

  return query
  select
    m.member_id,
    coalesce(email_ok, false),
    coalesce(phone_ok, false),
    coalesce(m.kyc_status, 'pending'),
    coalesce(payment_ok, false),
    coalesce(member_ok, false),
    m.membership_start_date,
    m.membership_end_date,
    coalesce(annual_status, 'pending'),
    annual_until,
    coalesce(email_ok, false)
      and coalesce(phone_ok, false)
      and lower(coalesce(m.kyc_status, '')) = 'verified'
      and coalesce(payment_ok, false)
      and coalesce(member_ok, false)
      and lower(coalesce(annual_status, '')) = 'verified'
      and (annual_until is null or annual_until >= today_ist);
end;
$$;
