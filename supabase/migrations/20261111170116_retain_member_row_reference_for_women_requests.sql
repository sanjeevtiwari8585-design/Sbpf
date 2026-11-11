-- Preserve the internal member-row reference required by the women request audit trail.
-- Verification remains bound to the authenticated swarnimbharat.club account.
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

  select u.phone into v_phone from auth.users u
  where u.id = v_user_id and u.phone_confirmed_at is not null;
  if v_phone is null then
    return jsonb_build_object('verified', false, 'reason', 'phone_otp_required');
  end if;

  v_digits := regexp_replace(v_phone, '[^0-9]', '', 'g');
  if length(v_digits) = 12 and left(v_digits, 2) = '91' then
    v_digits := right(v_digits, 10);
  end if;

  select m.* into v_member from public.members m
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
