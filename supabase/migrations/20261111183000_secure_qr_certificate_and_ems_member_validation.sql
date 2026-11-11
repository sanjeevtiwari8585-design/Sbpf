create or replace function public.verify_member_certificate(p_token uuid)
returns table(certificate_number text,member_id text,full_name text,certificate_status text,issued_at timestamptz)
language sql stable security definer set search_path to ''
as $$
 select c.certificate_number,c.member_id,m.full_name,c.certificate_status,c.issued_at
 from public.member_certificates c join public.members m on m.member_id=c.member_id
 where c.verification_token=p_token and c.certificate_status='issued'
 and coalesce(m.status,'')='active' and coalesce(m.membership_status,'')='active' and coalesce(m.payment_status,'')='paid'
 and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
 and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date) limit 1;
$$;
create or replace function public.verify_member_qr(p_token uuid)
returns table(member_id text,full_name text,membership_status text,membership_start_date date,membership_end_date date,status text)
language sql stable security definer set search_path to ''
as $$
 select m.member_id,m.full_name,m.membership_status,m.membership_start_date,m.membership_end_date,coalesce(m.status,'inactive')
 from public.members m where m.verification_token=p_token and coalesce(m.status,'')='active' and coalesce(m.membership_status,'')='active' and coalesce(m.payment_status,'')='paid'
 and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
 and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date) limit 1;
$$;
create or replace function public.verify_member_qr_code(p_qr_token text)
returns table(member_id text,full_name text,membership_status text,membership_start_date date,membership_end_date date,status text)
language sql stable security definer set search_path to ''
as $$
 select m.member_id,m.full_name,m.membership_status,m.membership_start_date,m.membership_end_date,coalesce(m.status,'inactive')
 from public.members m where m.qr_token=nullif(btrim(p_qr_token),'') and coalesce(m.status,'')='active' and coalesce(m.membership_status,'')='active' and coalesce(m.payment_status,'')='paid'
 and (m.membership_start_date is null or m.membership_start_date <= (now() at time zone 'Asia/Kolkata')::date)
 and (m.membership_end_date is null or m.membership_end_date >= (now() at time zone 'Asia/Kolkata')::date) limit 1;
$$;
create or replace function public.ems_admin_link_member(p_school_id uuid,p_member_id text,p_role text,p_class_name text default null,p_section text default null,p_roll_number text default null,p_subject text default null,p_designation text default null,p_salary_amount numeric default 0)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare v_member public.members%rowtype; v_school public.ems_schools%rowtype; v_student_id uuid; v_teacher_id uuid; v_code text;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_role not in ('school_admin','principal','teacher','student','accountant','staff') then raise exception 'Invalid EMS role'; end if;
 if not public.ems_can_manage_school(p_school_id) then raise exception 'You do not have permission to manage this school'; end if;
 select * into v_school from public.ems_schools where id=p_school_id;
 if not found then raise exception 'School not found'; end if;
 select * into v_member from public.members where upper(trim(member_id))=upper(trim(p_member_id));
 if not found or v_member.user_id is null then raise exception 'Valid SBPF Member ID linked to a login is required'; end if;
 if coalesce(v_member.status,'')<>'active' or coalesce(v_member.membership_status,'')<>'active' or coalesce(v_member.payment_status,'')<>'paid'
 or (v_member.membership_start_date is not null and v_member.membership_start_date>(now() at time zone 'Asia/Kolkata')::date)
 or (v_member.membership_end_date is not null and v_member.membership_end_date<(now() at time zone 'Asia/Kolkata')::date)
 then raise exception 'Active paid swarnimbharat.club membership is required'; end if;
 insert into public.ems_school_users(school_id,user_id,member_row_id,role,status) values(p_school_id,v_member.user_id,v_member.id,p_role,'active')
 on conflict(school_id,user_id) do update set member_row_id=excluded.member_row_id,role=excluded.role,status='active';
 if p_role='student' then
  v_code:='STU-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.ems_students(school_id,user_id,member_row_id,student_code,full_name,guardian_phone,class_name,section,roll_number,registration_fee,registration_status)
  values(p_school_id,v_member.user_id,v_member.id,v_code,v_member.full_name,v_member.mobile,nullif(trim(p_class_name),''),nullif(trim(p_section),''),nullif(trim(p_roll_number),''),365,'pending')
  on conflict(school_id,member_row_id) where member_row_id is not null do update set class_name=coalesce(nullif(trim(p_class_name),''),public.ems_students.class_name),section=coalesce(nullif(trim(p_section),''),public.ems_students.section),roll_number=coalesce(nullif(trim(p_roll_number),''),public.ems_students.roll_number),updated_at=now() returning id into v_student_id;
 elsif p_role='teacher' then
  v_code:='TCH-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.ems_teachers(school_id,user_id,member_row_id,teacher_code,full_name,phone,email,subject,designation,salary_amount)
  values(p_school_id,v_member.user_id,v_member.id,v_code,v_member.full_name,v_member.mobile,v_member.email,nullif(trim(p_subject),''),nullif(trim(p_designation),''),greatest(coalesce(p_salary_amount,0),0))
  on conflict(school_id,member_row_id) where member_row_id is not null do update set subject=coalesce(nullif(trim(p_subject),''),public.ems_teachers.subject),designation=coalesce(nullif(trim(p_designation),''),public.ems_teachers.designation),updated_at=now() returning id into v_teacher_id;
 end if;
 return jsonb_build_object('success',true,'school_id',p_school_id,'member_id',v_member.member_id,'role',p_role,'student_id',v_student_id,'teacher_id',v_teacher_id);
end; $$;