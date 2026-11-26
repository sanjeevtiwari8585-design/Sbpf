-- Server-authoritative Admin review for Reward Zone task submissions.
-- Staged only; no production execution or existing submission changes.

begin;

create or replace function public.sbpf_admin_review_reward_submission(
  p_submission_id uuid,
  p_decision text,
  p_note text default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor uuid := auth.uid();
  v_submission public.sbpf_reward_submissions%rowtype;
  v_task public.sbpf_reward_tasks%rowtype;
  v_points integer;
begin
  if v_actor is null or not public.is_admin() then
    raise exception 'ADMIN_ONLY';
  end if;
  if p_submission_id is null or p_decision not in ('approved','rejected') then
    raise exception 'INVALID_REVIEW_REQUEST';
  end if;
  if p_decision='rejected' and coalesce(length(btrim(p_note)),0)<5 then
    raise exception 'REJECTION_REASON_REQUIRED';
  end if;

  select * into v_submission
  from public.sbpf_reward_submissions
  where id=p_submission_id
  for update;
  if not found then raise exception 'SUBMISSION_NOT_FOUND'; end if;
  if v_submission.status<>'pending' then raise exception 'SUBMISSION_NOT_PENDING'; end if;

  select * into v_task
  from public.sbpf_reward_tasks
  where id=v_submission.task_id
  for share;
  if not found then raise exception 'TASK_NOT_FOUND'; end if;

  if p_decision='approved' then
    if v_task.status <> 'published' then
      raise exception 'TASK_NOT_ACTIVE';
    end if;
    if v_task.points_reward is null or v_task.points_reward<=0 then
      raise exception 'TASK_REWARD_NOT_CONFIGURED';
    end if;
    v_points:=v_task.points_reward;
  else
    v_points:=0;
  end if;

  update public.sbpf_reward_submissions
  set status=p_decision,
      points_awarded=v_points,
      reviewed_by=v_actor,
      reviewed_at=now(),
      review_note=nullif(btrim(p_note),'')
  where id=p_submission_id;

  insert into public.sbpf_audit_log
    (action,module_key,actor_user_id,entity_type,entity_id,metadata)
  values
    ('reward_submission_'||p_decision,'rewards_zone',v_actor,
     'sbpf_reward_submission',p_submission_id::text,
     jsonb_build_object(
       'member_profile_id',v_submission.member_profile_id,
       'task_id',v_submission.task_id,
       'previous_status',v_submission.status,
       'new_status',p_decision,
       'points_awarded',v_points,
       'review_note',nullif(btrim(p_note),'')
     ));

  return jsonb_build_object(
    'success',true,'submission_id',p_submission_id,
    'status',p_decision,'points_awarded',v_points,
    'reviewed_by',v_actor
  );
end;
$function$;

revoke all on function public.sbpf_admin_review_reward_submission(uuid,text,text) from public,anon;
grant execute on function public.sbpf_admin_review_reward_submission(uuid,text,text) to authenticated;

-- Client-side direct updates must not bypass the server-authoritative review RPC.
revoke update on public.sbpf_reward_submissions from anon,authenticated;

commit;
