-- Require the canonical swarnimbharat.club Member ID and confirmed registered-phone OTP
-- for education verification, e-library access, and youth empowerment requests.
-- No new membership database or ID namespace is introduced.

create or replace function public.verify_education_member_id(p_member_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_phone text;
  v_member public.members%rowtype;
begin
  if v_user is null then
    return jsonb_build_object('verified', false, 'reason', 'login_required');
  end if;
  select u.phone into v_phone from auth.users u
  where u.id = v_user and u.phone_confirmed_at is not null;
  if v_phone is null then
    return jsonb_build_object('verified', false, 'reason', 'phone_otp_required');
  end if;
  select * into v_member from public.members m
  where m.user_id = v_user
    and upper(trim(coalesce(m.member_id, ''))) = upper(trim(coalesce(p_member_id, '')))
    and right(regexp_replace(coalesce(m.mobile, ''), '[^0-9]', '', 'g'), 10)
      = right(regexp_replace(v_phone, '[^0-9]', '', 'g'), 10)
    and lower(coalesce(m.status, '')) = 'active'
    and lower(coalesce(m.membership_status, '')) = 'active'
    and lower(coalesce(m.payment_status, '')) = 'paid'
    and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
    and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date)
  limit 1;
  if not found then
    return jsonb_build_object('verified', false, 'reason', 'member_id_or_membership_not_valid');
  end if;
  return jsonb_build_object('verified', true, 'member_row_id', v_member.id, 'member_id', v_member.member_id);
end;
$$;
revoke all on function public.verify_education_member_id(text) from public, anon;
grant execute on function public.verify_education_member_id(text) to authenticated;

create or replace function public.verify_elibrary_member(p_member_id text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1
    from public.members m
    join auth.users u on u.id = m.user_id
    where auth.uid() is not null
      and u.id = auth.uid()
      and u.phone_confirmed_at is not null
      and right(regexp_replace(coalesce(u.phone, ''), '[^0-9]', '', 'g'), 10)
        = right(regexp_replace(coalesce(m.mobile, ''), '[^0-9]', '', 'g'), 10)
      and upper(trim(coalesce(m.member_id, ''))) = upper(trim(coalesce(p_member_id, '')))
      and lower(coalesce(m.status, '')) = 'active'
      and lower(coalesce(m.membership_status, '')) = 'active'
      and lower(coalesce(m.payment_status, '')) = 'paid'
      and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
      and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date)
  );
$$;
revoke all on function public.verify_elibrary_member(text) from public, anon;
grant execute on function public.verify_elibrary_member(text) to authenticated;

create or replace function public.youth_empowerment_request_submit(
  p_service_code text, p_request_type text, p_applicant_name text, p_age_years integer,
  p_education_level text, p_contact_phone text, p_alternate_phone text, p_email text,
  p_state text, p_district text, p_pincode text, p_category text, p_short_need text,
  p_details text, p_preferred_mode text, p_urgency text, p_consent_to_contact boolean,
  p_member_id text default null
)
returns table(request_id bigint, request_number text, status text)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_phone text;
  v_service public.youth_empowerment_services%rowtype;
  v_member public.members%rowtype;
  v_id bigint;
  v_number text;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if nullif(trim(coalesce(p_member_id, '')), '') is null then
    raise exception 'swarnimbharat.club की Member ID आवश्यक है।';
  end if;
  if p_consent_to_contact is distinct from true then raise exception 'Consent to contact is required'; end if;
  if coalesce(trim(p_applicant_name), '') = '' or coalesce(trim(p_contact_phone), '') = ''
     or coalesce(trim(p_state), '') = '' or coalesce(trim(p_district), '') = ''
     or coalesce(trim(p_category), '') = '' or coalesce(trim(p_short_need), '') = ''
  then raise exception 'Required fields are missing'; end if;
  if p_age_years is not null and (p_age_years < 13 or p_age_years > 35) then raise exception 'Age must be between 13 and 35 for this youth program'; end if;
  if p_pincode is not null and p_pincode !~ '^[0-9]{6}$' then raise exception 'Pincode must contain 6 digits'; end if;
  if p_urgency not in ('low','normal','high','urgent') then raise exception 'Invalid urgency'; end if;
  if p_request_type not in ('information','assistance','referral','enrollment','volunteer') then raise exception 'Invalid request type'; end if;
  if p_preferred_mode is not null and p_preferred_mode not in ('online','offline','either') then raise exception 'Invalid preferred mode'; end if;

  select u.phone into v_phone from auth.users u
  where u.id = v_user and u.phone_confirmed_at is not null;
  if v_phone is null then raise exception 'पहले पंजीकृत मोबाइल OTP सत्यापित करें।'; end if;

  select * into v_member from public.members m
  where m.user_id = v_user
    and upper(trim(coalesce(m.member_id, ''))) = upper(trim(p_member_id))
    and right(regexp_replace(coalesce(m.mobile, ''), '[^0-9]', '', 'g'), 10)
      = right(regexp_replace(v_phone, '[^0-9]', '', 'g'), 10)
    and lower(coalesce(m.status, '')) = 'active'
    and lower(coalesce(m.membership_status, '')) = 'active'
    and lower(coalesce(m.payment_status, '')) = 'paid'
    and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
    and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date)
  limit 1;
  if not found then raise exception 'Member ID सत्यापन विफल: सक्रिय और भुगतान-वैध क्लब सदस्यता आवश्यक है।'; end if;

  select * into v_service from public.youth_empowerment_services
  where service_code = p_service_code and is_active = true
    and availability_status not in ('paused','coming_soon') limit 1;
  if not found then raise exception 'Service unavailable'; end if;

  v_number := 'YUV-' || to_char(now(), 'YYYYMM') || '-' ||
    lpad(nextval('public.youth_empowerment_request_number_seq')::text, 6, '0');
  insert into public.youth_empowerment_requests(
    request_number,user_id,member_row_id,member_id,service_id,service_code,request_type,
    applicant_name,age_years,education_level,contact_phone,alternate_phone,email,state,district,
    pincode,category,short_need,details,preferred_mode,urgency,consent_to_contact
  ) values (
    v_number,v_user,v_member.id,v_member.member_id,v_service.id,v_service.service_code,p_request_type,
    trim(p_applicant_name),p_age_years,nullif(trim(p_education_level),''),trim(p_contact_phone),
    nullif(trim(p_alternate_phone),''),nullif(trim(p_email),''),trim(p_state),trim(p_district),
    nullif(trim(p_pincode),''),trim(p_category),trim(p_short_need),p_details,p_preferred_mode,p_urgency,true
  )
  returning id,youth_empowerment_requests.request_number into v_id,v_number;

  insert into public.youth_empowerment_request_history(request_id,old_status,new_status,note,changed_by)
  values(v_id,null,'submitted','swarnimbharat.club Member ID और मोबाइल OTP सत्यापित',v_user);
  return query select v_id,v_number,'submitted'::text;
end;
$$;
revoke all on function public.youth_empowerment_request_submit(text,text,text,integer,text,text,text,text,text,text,text,text,text,text,text,text,boolean,text) from public, anon;
grant execute on function public.youth_empowerment_request_submit(text,text,text,integer,text,text,text,text,text,text,text,text,text,text,text,text,boolean,text) to authenticated;
