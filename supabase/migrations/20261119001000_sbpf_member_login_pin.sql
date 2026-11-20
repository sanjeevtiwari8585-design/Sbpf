-- SBPF member-code + 4-digit PIN authentication for Rewards Zone.
-- Staged only. Apply only to a disposable sandbox after review.
create table if not exists public.sbpf_member_login_credentials (
  member_row_id bigint primary key references public.members(id) on delete cascade,
  pin_hash text,
  failed_attempts integer not null default 0 check (failed_attempts between 0 and 5),
  locked_until timestamptz,
  pin_set_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.sbpf_member_login_credentials enable row level security;
revoke all on public.sbpf_member_login_credentials from anon, authenticated;
grant select, insert, update, delete on public.sbpf_member_login_credentials to service_role;

create or replace function public.sbpf_member_login_pin_check(
  p_member_id text,
  p_mobile text,
  p_full_name text,
  p_pin text,
  p_confirm_pin text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_member public.members%rowtype;
  v_credential public.sbpf_member_login_credentials%rowtype;
  v_mobile text;
  v_input_mobile text;
  v_name text;
  v_input_name text;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_year integer := extract(year from (now() at time zone 'Asia/Kolkata'))::integer;
begin
  if coalesce(current_setting('request.jwt.claim.role', true),'') <> 'service_role' then
    raise exception 'SERVICE_ROLE_ONLY';
  end if;
  if nullif(btrim(p_member_id),'') is null or length(p_member_id)>40
     or p_pin !~ '^[0-9]{4}$' or p_confirm_pin !~ '^[0-9]{4}$' then
    raise exception 'INVALID_LOGIN_INPUT';
  end if;
  v_input_mobile := right(regexp_replace(coalesce(p_mobile,''),'[^0-9]','','g'),10);
  v_input_name := lower(regexp_replace(btrim(coalesce(p_full_name,'')),'\s+',' ','g'));
  if length(v_input_mobile)<>10 or length(v_input_name)<2 or length(v_input_name)>120 then
    raise exception 'INVALID_IDENTITY_DETAILS';
  end if;

  select * into v_member from public.members m
  where upper(btrim(m.member_id))=upper(btrim(p_member_id))
  limit 1;
  if not found or v_member.user_id is null then
    return jsonb_build_object('success',false,'error','MEMBER_DETAILS_NOT_MATCHED');
  end if;

  v_mobile := right(regexp_replace(coalesce(v_member.mobile,''),'[^0-9]','','g'),10);
  v_name := lower(regexp_replace(btrim(coalesce(v_member.full_name,'')),'\s+',' ','g'));
  if v_mobile<>v_input_mobile or v_name<>v_input_name then
    return jsonb_build_object('success',false,'error','MEMBER_DETAILS_NOT_MATCHED');
  end if;

  if lower(coalesce(v_member.status,''))<>'active'
     or lower(coalesce(v_member.membership_status,''))<>'active'
     or lower(coalesce(v_member.payment_status,''))<>'paid'
     or lower(coalesce(v_member.kyc_status,''))<>'verified'
     or (v_member.membership_start_date is not null and v_member.membership_start_date>v_today)
     or (v_member.membership_end_date is not null and v_member.membership_end_date<v_today) then
    return jsonb_build_object('success',false,'error','ACTIVE_VERIFIED_MEMBERSHIP_REQUIRED');
  end if;

  if not exists (
    select 1 from public.member_annual_verifications av
    where av.member_row_id=v_member.id and av.verification_year=v_year
      and av.status='verified' and (av.valid_until is null or av.valid_until>=v_today)
  ) then
    return jsonb_build_object('success',false,'error','ANNUAL_VERIFICATION_REQUIRED');
  end if;

  if not exists (
    select 1 from public.member_service_access sa
    where sa.member_row_id=v_member.id and sa.service_code='rewards_zone'
      and sa.access_status='active' and (sa.expires_at is null or sa.expires_at>now())
  ) then
    return jsonb_build_object('success',false,'error','REWARDS_ZONE_ACCESS_REQUIRED');
  end if;

  insert into public.sbpf_member_login_credentials(member_row_id)
  values(v_member.id) on conflict(member_row_id) do nothing;
  select * into v_credential from public.sbpf_member_login_credentials
  where member_row_id=v_member.id for update;

  if v_credential.locked_until is not null and v_credential.locked_until>now() then
    return jsonb_build_object('success',false,'error','LOGIN_PIN_LOCKED','retry_after',v_credential.locked_until);
  end if;

  if v_credential.pin_hash is null then
    if p_pin<>p_confirm_pin then
      return jsonb_build_object('success',false,'error','PIN_CONFIRMATION_MISMATCH');
    end if;
    update public.sbpf_member_login_credentials
    set pin_hash=extensions.crypt(p_pin,extensions.gen_salt('bf',12)),
        pin_set_at=now(),failed_attempts=0,locked_until=null,updated_at=now()
    where member_row_id=v_member.id;
    return jsonb_build_object('success',true,'user_id',v_member.user_id,'member_id',v_member.member_id,'pin_created',true);
  end if;

  if extensions.crypt(p_pin,v_credential.pin_hash)=v_credential.pin_hash then
    update public.sbpf_member_login_credentials
    set failed_attempts=0,locked_until=null,updated_at=now()
    where member_row_id=v_member.id;
    return jsonb_build_object('success',true,'user_id',v_member.user_id,'member_id',v_member.member_id,'pin_created',false);
  end if;

  update public.sbpf_member_login_credentials
  set failed_attempts=least(failed_attempts+1,5),
      locked_until=case when failed_attempts+1>=5 then now()+interval '15 minutes' else null end,
      updated_at=now()
  where member_row_id=v_member.id;
  return jsonb_build_object('success',false,'error','INVALID_LOGIN_PIN');
end;
$function$;

revoke all on function public.sbpf_member_login_pin_check(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.sbpf_member_login_pin_check(text,text,text,text,text) to service_role;
