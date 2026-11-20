-- Authorized final approvers for SBPF cash withdrawals.
-- Main Admin can appoint/revoke delegated approvers; no production execution here.
begin;

create table if not exists public.sbpf_cash_withdrawal_approvers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  appointed_by uuid not null references auth.users(id),
  appointed_at timestamptz not null default now(),
  revoked_by uuid references auth.users(id),
  revoked_at timestamptz,
  revocation_reason text
);

alter table public.sbpf_cash_withdrawal_approvers enable row level security;
revoke all on public.sbpf_cash_withdrawal_approvers from anon, authenticated;
grant select on public.sbpf_cash_withdrawal_approvers to authenticated;

drop policy if exists sbpf_cash_approvers_admin_read on public.sbpf_cash_withdrawal_approvers;
create policy sbpf_cash_approvers_admin_read
  on public.sbpf_cash_withdrawal_approvers
  for select to authenticated
  using (public.is_admin());

create or replace function public.sbpf_admin_set_cash_withdrawal_approver(
  p_user_id uuid,
  p_enabled boolean,
  p_reason text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'MAIN_ADMIN_ONLY';
  end if;
  if p_user_id is null or p_enabled is null then
    raise exception 'INVALID_APPROVER';
  end if;
  if p_reason is null or length(btrim(p_reason)) < 5 then
    raise exception 'REASON_REQUIRED';
  end if;

  if p_enabled then
    insert into public.sbpf_cash_withdrawal_approvers(user_id,is_active,appointed_by,appointed_at,revoked_by,revoked_at,revocation_reason)
    values(p_user_id,true,auth.uid(),now(),null,null,null)
    on conflict(user_id) do update
      set is_active=true, appointed_by=auth.uid(), appointed_at=now(),
          revoked_by=null, revoked_at=null, revocation_reason=null;
  else
    update public.sbpf_cash_withdrawal_approvers
      set is_active=false, revoked_by=auth.uid(), revoked_at=now(), revocation_reason=btrim(p_reason)
      where user_id=p_user_id;
  end if;

  return jsonb_build_object('success',true,'user_id',p_user_id,'enabled',p_enabled);
end;
$$;

revoke all on function public.sbpf_admin_set_cash_withdrawal_approver(uuid,boolean,text) from public, anon;
grant execute on function public.sbpf_admin_set_cash_withdrawal_approver(uuid,boolean,text) to authenticated;

commit;
