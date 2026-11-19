-- Enforce Finance Team family conflict-of-interest using the existing Swarnim Pariwar model.
-- Staged only; do not apply to production before disposable sandbox tests.
begin;

create or replace function public.sbpf_finance_review_cash_withdrawal(
  p_redemption_id uuid,
  p_decision text,
  p_note text default null
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
  v_row public.sbpf_reward_redemptions%rowtype;
  v_reviewer_is_main_admin boolean;
  v_reviewer_member_id bigint;
  v_requester_member_id bigint;
  v_conflict boolean := false;
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;

  select exists(select 1 from public.admin_users a where a.user_id=auth.uid() and a.role='admin')
    into v_reviewer_is_main_admin;
  if not exists(select 1 from public.sbpf_cash_withdrawal_finance_team f where f.user_id=auth.uid() and f.is_active)
     and not v_reviewer_is_main_admin then
    raise exception 'FINANCE_TEAM_ONLY';
  end if;
  if p_decision not in ('recommend','reject') then raise exception 'INVALID_FINANCE_DECISION'; end if;
  if p_decision='reject' and (p_note is null or length(btrim(p_note))<5) then raise exception 'REASON_REQUIRED'; end if;

  select * into v_row from public.sbpf_reward_redemptions where id=p_redemption_id for update;
  if not found then raise exception 'WITHDRAWAL_NOT_FOUND'; end if;
  if v_row.withdrawal_tier_inr is null then raise exception 'NOT_A_FIXED_TIER_WITHDRAWAL'; end if;
  if v_row.status<>'pending' then raise exception 'WITHDRAWAL_NOT_PENDING'; end if;
  if v_row.fee_payment_status<>'paid' then raise exception 'FEE_NOT_CONFIRMED'; end if;

  select m.id into v_reviewer_member_id from public.members m where m.user_id=auth.uid() limit 1;
  select m.id into v_requester_member_id from public.members m where m.user_id=v_row.member_profile_id limit 1;
  if v_row.member_profile_id=auth.uid() then raise exception 'SELF_REVIEW_FORBIDDEN'; end if;

  -- Finance officers cannot review withdrawals belonging to their own registered family.
  -- Main Admin is the independent escalation authority for a Finance officer's own/family request.
  if not v_reviewer_is_main_admin and v_reviewer_member_id is not null and v_requester_member_id is not null then
    with reviewer_families as (
      select f.id
      from public.member_pariwar_register f
      where f.created_by=auth.uid()
         or f.member_row_id=v_reviewer_member_id
         or f.head_member_row_id=v_reviewer_member_id
         or exists (
           select 1 from public.member_pariwar_members fm
           where fm.family_id=f.id
             and (fm.linked_member_row_id=v_reviewer_member_id or fm.member_row_id=v_reviewer_member_id)
         )
    ),
    requester_families as (
      select f.id
      from public.member_pariwar_register f
      where f.created_by=v_row.member_profile_id
         or f.member_row_id=v_requester_member_id
         or f.head_member_row_id=v_requester_member_id
         or exists (
           select 1 from public.member_pariwar_members fm
           where fm.family_id=f.id
             and (fm.linked_member_row_id=v_requester_member_id or fm.member_row_id=v_requester_member_id)
         )
    )
    select exists(
      select 1 from reviewer_families rf join requester_families qf on qf.id=rf.id
    ) into v_conflict;
    if v_conflict then raise exception 'FINANCE_FAMILY_CONFLICT_MAIN_ADMIN_ONLY'; end if;
  end if;

  update public.sbpf_reward_redemptions
    set finance_decision=p_decision, finance_reviewed_by=auth.uid(), finance_reviewed_at=now(),
        finance_note=case when p_decision='reject' then btrim(p_note) else 'Finance review recommended' end
    where id=p_redemption_id;

  insert into public.sbpf_cash_withdrawal_audit(redemption_id,actor_user_id,action,before_state,after_state,reason)
  values(p_redemption_id,auth.uid(),'finance_'||p_decision,
    jsonb_build_object('status',v_row.status,'fee_payment_status',v_row.fee_payment_status),
    jsonb_build_object('finance_reviewed_at',now(),'finance_decision',p_decision),
    coalesce(nullif(btrim(p_note),''),'Finance review completed'));

  return jsonb_build_object('success',true,'finance_decision',p_decision,'final_approval_pending',true);
end;
$$;

revoke all on function public.sbpf_finance_review_cash_withdrawal(uuid,text,text) from public,anon;
grant execute on function public.sbpf_finance_review_cash_withdrawal(uuid,text,text) to authenticated;
commit;
