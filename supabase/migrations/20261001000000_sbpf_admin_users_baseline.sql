-- SBPF baseline required by later migrations that call public.is_admin().
-- Reconstructed from read-only schema inspection of the existing Production project.
-- This migration creates schema objects only; it does not seed admin users.

begin;

create table if not exists public.admin_users (
  user_id uuid not null,
  role text not null default 'admin'::text,
  created_at timestamp with time zone not null default now(),
  constraint admin_users_pkey primary key (user_id),
  constraint admin_users_role_check
    check (role = any (array['admin'::text, 'super_admin'::text])),
  constraint admin_users_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade
);

alter table public.admin_users enable row level security;

drop policy if exists admin_users_self_select on public.admin_users;
create policy admin_users_self_select
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$function$;

commit;
