-- SwarnimBook: enforce the same complete SBPF verification used by the member portal.
create or replace function private.sbpf_user_fully_verified(p_user_id uuid)
returns boolean
language plpgsql stable security definer
set search_path = public, auth, private, pg_temp
as $$
declare
  v_member public.members%rowtype;
  v_email_ok boolean := false;
  v_phone_ok boolean := false;
  v_annual_status text := 'pending';
  v_annual_until date;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  if p_user_id is null then return false; end if;
  select * into v_member from public.members where user_id=p_user_id limit 1;
  if v_member.id is null then return false; end if;
  select (u.email_confirmed_at is not null),
         (u.phone_confirmed_at is not null and
          right(regexp_replace(coalesce(u.phone,''),'[^0-9]','','g'),10)=
          right(regexp_replace(coalesce(v_member.mobile,''),'[^0-9]','','g'),10))
    into v_email_ok,v_phone_ok
  from auth.users u where u.id=p_user_id;
  select a.status,a.valid_until into v_annual_status,v_annual_until
  from public.member_annual_verifications a
  where a.member_row_id=v_member.id
    and a.verification_year=extract(year from (now() at time zone 'Asia/Kolkata'))::integer
  order by a.updated_at desc limit 1;
  return coalesce(v_email_ok,false) and coalesce(v_phone_ok,false)
    and lower(coalesce(v_member.kyc_status,''))='verified'
    and lower(coalesce(v_member.status,''))='active'
    and lower(coalesce(v_member.membership_status,''))='active'
    and (v_member.membership_start_date is null or v_member.membership_start_date<=v_today)
    and (v_member.membership_end_date is null or v_member.membership_end_date>=v_today)
    and lower(coalesce(v_annual_status,''))='verified'
    and (v_annual_until is null or v_annual_until>=v_today);
end;
$$;

create or replace function public.sbpf_social_list_active_members()
returns table(user_id uuid, display_name text, username text)
language sql stable security definer
set search_path = public, private, pg_temp
as $$
  select m.user_id, coalesce(nullif(s.display_name,''),m.full_name,'SBPF सदस्य'),s.username
  from public.members m
  left join public.sbpf_social_profiles s on s.user_id=m.user_id
  where auth.uid() is not null
    and private.sbpf_user_fully_verified(auth.uid())
    and m.user_id<>auth.uid()
    and private.sbpf_user_fully_verified(m.user_id)
  order by coalesce(nullif(s.display_name,''),m.full_name,'SBPF सदस्य');
$$;
revoke all on function public.sbpf_social_list_active_members() from public, anon;
grant execute on function public.sbpf_social_list_active_members() to authenticated;

create or replace function public.sbpf_social_start_direct_thread(p_recipient_id uuid)
returns bigint
language plpgsql security definer
set search_path = public, private, pg_temp
as $$
declare v_user_id uuid := auth.uid(); v_thread_id bigint;
begin
  if v_user_id is null then raise exception 'सदस्य लॉगिन आवश्यक है'; end if;
  if p_recipient_id is null or p_recipient_id=v_user_id then raise exception 'किसी दूसरे सदस्य को चुनें'; end if;
  if not private.sbpf_user_fully_verified(v_user_id) or not private.sbpf_user_fully_verified(p_recipient_id) then
    raise exception 'निजी चैट केवल पूरी तरह सत्यापित SBPF सदस्यों के लिए उपलब्ध है';
  end if;
  if exists(select 1 from public.sbpf_social_blocks b where (b.blocker_id=v_user_id and b.blocked_id=p_recipient_id) or (b.blocker_id=p_recipient_id and b.blocked_id=v_user_id)) then
    raise exception 'इस सदस्य के साथ चैट उपलब्ध नहीं है';
  end if;
  select t.id into v_thread_id from public.sbpf_social_message_threads t
  join public.sbpf_social_message_members a on a.thread_id=t.id and a.user_id=v_user_id
  join public.sbpf_social_message_members b on b.thread_id=t.id and b.user_id=p_recipient_id
  where t.thread_type='direct' order by t.updated_at desc limit 1;
  if v_thread_id is not null then return v_thread_id; end if;
  insert into public.sbpf_social_message_threads(thread_type,created_by) values('direct',v_user_id) returning id into v_thread_id;
  insert into public.sbpf_social_message_members(thread_id,user_id) values(v_thread_id,v_user_id),(v_thread_id,p_recipient_id);
  return v_thread_id;
end;
$$;
revoke all on function public.sbpf_social_start_direct_thread(uuid) from public, anon;
grant execute on function public.sbpf_social_start_direct_thread(uuid) to authenticated;