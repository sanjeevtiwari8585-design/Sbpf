-- Secure direct-message thread creation for active SBPF members.
create or replace function public.sbpf_social_start_direct_thread(p_recipient_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_thread_id bigint;
begin
  if v_user_id is null then raise exception 'सदस्य लॉगिन आवश्यक है'; end if;
  if p_recipient_id is null or p_recipient_id = v_user_id then raise exception 'किसी दूसरे सदस्य को चुनें'; end if;
  if not exists (select 1 from public.members m where m.user_id=v_user_id and m.member_id is not null and coalesce(m.status,'active')='active')
     or not exists (select 1 from public.members m where m.user_id=p_recipient_id and m.member_id is not null and coalesce(m.status,'active')='active') then
    raise exception 'केवल सक्रिय SBPF सदस्य निजी चैट शुरू कर सकते हैं';
  end if;
  if exists (select 1 from public.sbpf_social_blocks b where (b.blocker_id=v_user_id and b.blocked_id=p_recipient_id) or (b.blocker_id=p_recipient_id and b.blocked_id=v_user_id)) then
    raise exception 'इस सदस्य के साथ चैट उपलब्ध नहीं है';
  end if;
  select t.id into v_thread_id
  from public.sbpf_social_message_threads t
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
