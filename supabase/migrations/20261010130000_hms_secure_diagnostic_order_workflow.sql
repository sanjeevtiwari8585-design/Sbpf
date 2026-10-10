create or replace function public.hms_create_diagnostic_order(
  p_hospital_id uuid,
  p_patient_id uuid,
  p_test_name text,
  p_priority text default 'routine',
  p_clinical_notes text default null,
  p_encounter_type text default 'OPD'
)
returns table (
  diagnostic_order_id uuid,
  encounter_id uuid,
  encounter_number text,
  order_number text,
  test_item_id uuid
)
language plpgsql
security definer
set search_path = public, hms_private, pg_temp
as $function$
declare
  v_encounter_id uuid;
  v_encounter_number text;
  v_order_id uuid;
  v_order_number text;
  v_item_id uuid;
  v_staff_id uuid;
  v_encounter_priority text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not hms_private.hms_has_access(
    p_hospital_id,
    array['hospital_admin','admin','doctor']::text[]
  ) then
    raise exception 'Not authorized to create a diagnostic order for this hospital';
  end if;

  if p_priority not in ('routine','urgent','stat') then
    raise exception 'Invalid diagnostic priority';
  end if;

  if p_encounter_type not in ('OPD','IPD','EMERGENCY') then
    raise exception 'Invalid encounter type';
  end if;

  if nullif(btrim(p_test_name), '') is null then
    raise exception 'Test name is required';
  end if;

  if not exists (
    select 1 from public.hms_patients p
    where p.id = p_patient_id and p.hospital_id = p_hospital_id
  ) then
    raise exception 'Patient does not belong to this hospital';
  end if;

  select s.id into v_staff_id
  from public.hms_staff s
  where s.hospital_id = p_hospital_id
    and s.auth_user_id = auth.uid()
    and s.employment_status = 'active'
  order by s.created_at desc
  limit 1;

  v_encounter_priority := case p_priority
    when 'routine' then 'normal'
    when 'urgent' then 'urgent'
    else 'critical'
  end;

  insert into public.hms_encounters (
    hospital_id, patient_id, encounter_type, assigned_doctor_id,
    department, chief_complaint, priority, created_by
  )
  values (
    p_hospital_id, p_patient_id, p_encounter_type, v_staff_id,
    'Laboratory', nullif(btrim(p_clinical_notes), ''),
    v_encounter_priority, auth.uid()
  )
  returning id, hms_encounters.encounter_number
  into v_encounter_id, v_encounter_number;

  insert into public.hms_diagnostic_orders (
    hospital_id, encounter_id, patient_id, ordered_by_staff_id,
    priority, clinical_notes, status, created_by
  )
  values (
    p_hospital_id, v_encounter_id, p_patient_id, v_staff_id,
    p_priority, nullif(btrim(p_clinical_notes), ''),
    'ordered', auth.uid()
  )
  returning id, hms_diagnostic_orders.order_number
  into v_order_id, v_order_number;

  insert into public.hms_diagnostic_order_items (
    hospital_id, diagnostic_order_id, line_number, test_name, status
  )
  values (p_hospital_id, v_order_id, 1, btrim(p_test_name), 'ordered')
  returning id into v_item_id;

  return query select v_order_id, v_encounter_id, v_encounter_number, v_order_number, v_item_id;
end;
$function$;

revoke all on function public.hms_create_diagnostic_order(uuid,uuid,text,text,text,text) from public, anon;
grant execute on function public.hms_create_diagnostic_order(uuid,uuid,text,text,text,text) to authenticated;
