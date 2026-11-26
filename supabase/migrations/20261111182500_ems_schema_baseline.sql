-- SBPF EMS schema baseline
-- Local reconstruction only. Do not apply to Production directly.

CREATE TABLE public.ems_schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_code text NOT NULL UNIQUE DEFAULT upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10)),
    school_name text NOT NULL,
    school_name_local text,
    email text,
    phone text,
    address text,
    district text,
    state text DEFAULT 'Uttar Pradesh',
    pincode text,
    created_by uuid NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','active','suspended','closed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    owner_member_row_id bigint
        REFERENCES public.members(id) ON DELETE RESTRICT,
    school_logo_url text,
    school_logo_path text,
    school_motto text,
    affiliation_number text,
    principal_name text,
    academic_session text,
    website_description text,
    website_theme jsonb NOT NULL DEFAULT
        '{"accent":"#d4a72c","preset":"school-classic","primary":"#173b67"}'::jsonb,
    facilities jsonb NOT NULL DEFAULT '{}'::jsonb,
    website_status text NOT NULL DEFAULT 'draft'
        CHECK (website_status IN ('draft','review','published','suspended')),
    website_published_at timestamptz
);

CREATE TABLE public.ems_school_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    user_id uuid NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL
        CHECK (role IN ('school_admin','principal','teacher','student','accountant','staff')),
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('invited','active','suspended')),
    created_at timestamptz NOT NULL DEFAULT now(),
    member_row_id bigint
        REFERENCES public.members(id) ON DELETE RESTRICT,
    CONSTRAINT ems_school_users_school_user_key UNIQUE (school_id,user_id)
);

CREATE TABLE public.ems_students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    student_code text NOT NULL,
    full_name text NOT NULL,
    date_of_birth date,
    gender text,
    class_name text,
    section text,
    roll_number text,
    guardian_name text,
    guardian_phone text,
    address text,
    registration_fee numeric NOT NULL DEFAULT 365
        CHECK (registration_fee = 365),
    registration_status text NOT NULL DEFAULT 'pending'
        CHECK (registration_status IN ('pending','active','expired','suspended')),
    registration_paid_at timestamptz,
    registration_expires_at date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    member_row_id bigint
        REFERENCES public.members(id) ON DELETE RESTRICT,
    CONSTRAINT ems_students_school_code_key UNIQUE (school_id,student_code),
    CONSTRAINT ems_students_school_class_roll_key
        UNIQUE (school_id,class_name,section,roll_number)
);

CREATE TABLE public.ems_teachers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    teacher_code text NOT NULL,
    full_name text NOT NULL,
    phone text,
    email text,
    subject text,
    designation text,
    joining_date date,
    salary_amount numeric NOT NULL DEFAULT 0 CHECK (salary_amount >= 0),
    employment_status text NOT NULL DEFAULT 'active'
        CHECK (employment_status IN ('active','on_leave','resigned','terminated')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    member_row_id bigint
        REFERENCES public.members(id) ON DELETE RESTRICT,
    CONSTRAINT ems_teachers_school_code_key UNIQUE (school_id,teacher_code)
);

CREATE UNIQUE INDEX ems_school_users_school_member_uidx
ON public.ems_school_users(school_id,member_row_id)
WHERE member_row_id IS NOT NULL;

CREATE UNIQUE INDEX ems_students_school_member_uidx
ON public.ems_students(school_id,member_row_id)
WHERE member_row_id IS NOT NULL;

CREATE UNIQUE INDEX ems_teachers_school_member_uidx
ON public.ems_teachers(school_id,member_row_id)
WHERE member_row_id IS NOT NULL;

CREATE INDEX ems_schools_created_by_idx
ON public.ems_schools(created_by);

CREATE INDEX ems_schools_owner_member_idx
ON public.ems_schools(owner_member_row_id);

CREATE INDEX ems_school_users_member_row_id_idx
ON public.ems_school_users(member_row_id);

CREATE INDEX ems_school_users_user_school_idx
ON public.ems_school_users(user_id,school_id);

CREATE INDEX ems_students_member_row_id_idx
ON public.ems_students(member_row_id);

CREATE INDEX ems_students_school_class_idx
ON public.ems_students(school_id,class_name,section);

CREATE INDEX ems_students_user_id_idx
ON public.ems_students(user_id);

CREATE INDEX ems_teachers_member_row_id_idx
ON public.ems_teachers(member_row_id);

CREATE INDEX ems_teachers_user_id_idx
ON public.ems_teachers(user_id);

-- EMS: School domains, facilities and portal settings

CREATE TABLE public.ems_school_domains (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL UNIQUE
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    subdomain text NOT NULL UNIQUE
        CHECK (subdomain ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
    domain_status text NOT NULL DEFAULT 'pending'
        CHECK (domain_status IN ('pending','configured','verified','disabled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    verified_at timestamptz,
    root_domain text NOT NULL DEFAULT 'sbpfseva.floot.app'
);

CREATE UNIQUE INDEX ems_school_domains_lower_subdomain_uidx
ON public.ems_school_domains(lower(subdomain));

CREATE UNIQUE INDEX ems_school_domains_lower_root_uidx
ON public.ems_school_domains(lower(subdomain),lower(root_domain));

CREATE INDEX ems_school_domains_school_id_idx
ON public.ems_school_domains(school_id);

CREATE TABLE public.ems_school_facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    facility_key text NOT NULL,
    facility_name text NOT NULL,
    is_enabled boolean NOT NULL DEFAULT false,
    configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
    display_order integer NOT NULL DEFAULT 100,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ems_school_facilities_school_key
        UNIQUE (school_id,facility_key)
);

CREATE INDEX ems_school_facilities_enabled_idx
ON public.ems_school_facilities(school_id,is_enabled);

CREATE TABLE public.ems_school_portal_settings (
    school_id uuid PRIMARY KEY
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    portal_title text NOT NULL,
    tagline text,
    logo_url text,
    theme_config jsonb NOT NULL DEFAULT '{}'::jsonb,
    homepage_config jsonb NOT NULL DEFAULT '{}'::jsonb,
    enabled_modules jsonb NOT NULL DEFAULT '[]'::jsonb,
    portal_status text NOT NULL DEFAULT 'draft'
        CHECK (portal_status IN ('draft','review','published','suspended')),
    domain_status text NOT NULL DEFAULT 'pending'
        CHECK (domain_status IN ('pending','provisioning','active','failed','suspended')),
    generated_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- EMS: Attendance and events

CREATE TABLE public.ems_attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    student_id uuid NOT NULL
        REFERENCES public.ems_students(id) ON DELETE CASCADE,
    attendance_date date NOT NULL DEFAULT CURRENT_DATE,
    status text NOT NULL
        CHECK (status IN ('present','absent','late','half_day','leave')),
    remarks text,
    marked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ems_attendance_student_date_key
        UNIQUE (student_id,attendance_date)
);

CREATE INDEX ems_attendance_marked_by_idx
ON public.ems_attendance(marked_by);

CREATE INDEX ems_attendance_school_date_idx
ON public.ems_attendance(school_id,attendance_date);

CREATE TABLE public.ems_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    event_type text NOT NULL DEFAULT 'event'
        CHECK (event_type IN ('event','holiday','exam','notice')),
    starts_at timestamptz,
    ends_at timestamptz,
    is_published boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ems_events_created_by_idx
ON public.ems_events(created_by);

CREATE INDEX ems_events_school_starts_idx
ON public.ems_events(school_id,starts_at);

-- EMS: Fee records

CREATE TABLE public.ems_fee_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    student_id uuid NOT NULL
        REFERENCES public.ems_students(id) ON DELETE CASCADE,
    fee_type text NOT NULL DEFAULT 'tuition',
    amount_due numeric NOT NULL CHECK (amount_due >= 0),
    amount_paid numeric NOT NULL DEFAULT 0
        CHECK (amount_paid >= 0 AND amount_paid <= amount_due),
    due_date date,
    paid_at timestamptz,
    payment_method text,
    receipt_number text,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','partial','paid','waived','cancelled')),
    notes text,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ems_fee_records_created_by_idx
ON public.ems_fee_records(created_by);

CREATE INDEX ems_fee_records_student_idx
ON public.ems_fee_records(student_id);

CREATE INDEX ems_fee_records_school_status_due_idx
ON public.ems_fee_records(school_id,status,due_date);

-- EMS: Salary records

CREATE TABLE public.ems_salary_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    teacher_id uuid NOT NULL
        REFERENCES public.ems_teachers(id) ON DELETE CASCADE,
    salary_month date NOT NULL,
    base_salary numeric NOT NULL DEFAULT 0 CHECK (base_salary >= 0),
    allowances numeric NOT NULL DEFAULT 0 CHECK (allowances >= 0),
    deductions numeric NOT NULL DEFAULT 0
        CHECK (deductions >= 0 AND deductions <= base_salary + allowances),
    net_salary numeric,
    paid_amount numeric NOT NULL DEFAULT 0
        CHECK (paid_amount >= 0 AND paid_amount <= base_salary + allowances - deductions),
    paid_at timestamptz,
    payment_reference text,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','partial','paid','cancelled')),
    notes text,
    processed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ems_salary_teacher_month_key UNIQUE (teacher_id,salary_month)
);

CREATE INDEX ems_salary_records_processed_by_idx
ON public.ems_salary_records(processed_by);

CREATE INDEX ems_salary_records_school_month_idx
ON public.ems_salary_records(school_id,salary_month);


-- EMS: Student certificates

CREATE TABLE public.ems_student_certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    student_id uuid NOT NULL
        REFERENCES public.ems_students(id) ON DELETE CASCADE,
    certificate_number text NOT NULL UNIQUE,
    verification_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    certificate_type text NOT NULL
        CHECK (certificate_type IN ('bonafide','character','transfer','completion','achievement','other')),
    title text NOT NULL,
    description text,
    issue_date date NOT NULL DEFAULT CURRENT_DATE,
    academic_session text,
    issued_by_name text,
    status text NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','issued','revoked')),
    issued_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ems_student_certificates_issued_by_idx
ON public.ems_student_certificates(issued_by);

CREATE INDEX ems_student_certificates_school_idx
ON public.ems_student_certificates(school_id);

CREATE INDEX ems_student_certificates_student_status_idx
ON public.ems_student_certificates(student_id,status);

-- EMS: Student ID cards

CREATE TABLE public.ems_student_id_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    student_id uuid NOT NULL UNIQUE
        REFERENCES public.ems_students(id) ON DELETE CASCADE,
    card_number text NOT NULL UNIQUE,
    verification_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    card_status text NOT NULL DEFAULT 'pending'
        CHECK (card_status IN ('pending','active','suspended','revoked','expired')),
    issued_at timestamptz,
    valid_until date,
    issued_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ems_student_id_cards_issued_by_idx
ON public.ems_student_id_cards(issued_by);

CREATE INDEX ems_student_id_cards_school_status_idx
ON public.ems_student_id_cards(school_id,card_status);

-- EMS: Student report cards

CREATE TABLE public.ems_student_report_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL
        REFERENCES public.ems_schools(id) ON DELETE CASCADE,
    student_id uuid NOT NULL
        REFERENCES public.ems_students(id) ON DELETE CASCADE,
    academic_session text NOT NULL,
    exam_name text NOT NULL,
    term_name text,
    report_number text NOT NULL UNIQUE,
    total_max_marks numeric NOT NULL DEFAULT 0 CHECK (total_max_marks >= 0),
    total_marks_obtained numeric NOT NULL DEFAULT 0 CHECK (total_marks_obtained >= 0),
    percentage numeric NOT NULL DEFAULT 0 CHECK (percentage BETWEEN 0 AND 100),
    grade text,
    result text NOT NULL DEFAULT 'draft'
        CHECK (result IN ('draft','pass','fail','needs_review')),
    attendance_percentage numeric
        CHECK (attendance_percentage BETWEEN 0 AND 100),
    teacher_remarks text,
    principal_remarks text,
    publication_status text NOT NULL DEFAULT 'draft'
        CHECK (publication_status IN ('draft','published','withdrawn')),
    published_at timestamptz,
    published_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ems_report_card_school_student_session_exam_term_key
        UNIQUE (school_id,student_id,academic_session,exam_name,term_name)
);

CREATE UNIQUE INDEX ems_report_cards_term_coalesce_uidx
ON public.ems_student_report_cards
(school_id,student_id,academic_session,exam_name,COALESCE(term_name,''));

CREATE INDEX ems_report_cards_school_publication_idx
ON public.ems_student_report_cards(school_id,publication_status);

CREATE INDEX ems_report_cards_student_session_idx
ON public.ems_student_report_cards(student_id,academic_session);

CREATE INDEX ems_report_cards_created_by_idx
ON public.ems_student_report_cards(created_by);

CREATE INDEX ems_report_cards_published_by_idx
ON public.ems_student_report_cards(published_by);

-- EMS: Report card subject marks

CREATE TABLE public.ems_student_report_card_subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_card_id uuid NOT NULL
        REFERENCES public.ems_student_report_cards(id) ON DELETE CASCADE,
    subject_name text NOT NULL,
    maximum_marks numeric NOT NULL CHECK (maximum_marks > 0),
    marks_obtained numeric NOT NULL
        CHECK (marks_obtained >= 0 AND marks_obtained <= maximum_marks),
    passing_marks numeric NOT NULL DEFAULT 0 CHECK (passing_marks >= 0),
    grade text,
    remarks text,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ems_report_subject_unique
        UNIQUE (report_card_id,subject_name)
);

CREATE INDEX ems_report_subjects_report_card_idx
ON public.ems_student_report_card_subjects(report_card_id);


-- EMS FUNCTIONS: Code generation and access control

CREATE OR REPLACE FUNCTION public.ems_school_code_prefix(p_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO ''
AS $function$
DECLARE
    v_ascii text;
    v_hash text;
BEGIN
    v_ascii := left(regexp_replace(upper(coalesce(p_name,'')), '[^A-Z0-9]', '', 'g'), 5);
    IF nullif(v_ascii,'') IS NOT NULL THEN
        RETURN v_ascii;
    END IF;
    v_hash := upper(substr(md5(lower(trim(coalesce(p_name,'')))),1,4));
    RETURN 'SCH' || v_hash;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ems_make_school_slug(p_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO ''
AS $function$
DECLARE
    v_slug text;
BEGIN
    v_slug := lower(trim(both '-' from regexp_replace(coalesce(p_name,''),'[^a-zA-Z0-9]+','-','g')));
    v_slug := trim(both '-' from left(v_slug,45));
    IF v_slug = '' THEN
        v_slug := 'school';
    END IF;
    RETURN v_slug;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ems_can_access_school(p_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT coalesce((SELECT public.is_admin()), false)
    OR EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = p_school_id
          AND s.created_by = (SELECT auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.ems_school_users su
        WHERE su.school_id = p_school_id
          AND su.user_id = (SELECT auth.uid())
          AND su.status = 'active'
          AND su.role IN ('school_admin','principal','accountant')
    );
$function$;

CREATE OR REPLACE FUNCTION public.ems_can_manage_school(p_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
    SELECT coalesce((SELECT public.is_admin()), false)
    OR EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = p_school_id
          AND s.created_by = (SELECT auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.ems_school_users su
        WHERE su.school_id = p_school_id
          AND su.user_id = (SELECT auth.uid())
          AND su.status = 'active'
          AND su.role IN ('school_admin','principal')
    );
$function$;

CREATE OR REPLACE FUNCTION public.ems_assign_school_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_prefix text;
    v_code text;
BEGIN
    IF tg_op = 'INSERT' OR nullif(trim(new.school_code),'') IS NULL THEN
        v_prefix := public.ems_school_code_prefix(new.school_name);
        LOOP
            v_code := v_prefix || '-' || upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.ems_schools s
                WHERE s.school_code = v_code
                  AND s.id IS DISTINCT FROM new.id
            );
        END LOOP;
        new.school_code := v_code;
    END IF;
    RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ems_assign_student_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_school_code text;
    v_code text;
BEGIN
    IF tg_op = 'INSERT' OR nullif(trim(new.student_code),'') IS NULL THEN
        SELECT s.school_code INTO v_school_code
        FROM public.ems_schools s
        WHERE s.id = new.school_id;

        IF v_school_code IS NULL THEN
            RAISE EXCEPTION 'School not found for student';
        END IF;

        LOOP
            v_code := v_school_code || '-STU-' || to_char(current_date,'YYYY') || '-' ||
                      upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.ems_students st
                WHERE st.student_code = v_code
                  AND st.id IS DISTINCT FROM new.id
            );
        END LOOP;
        new.student_code := v_code;
    END IF;
    RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ems_assign_report_and_certificate_numbers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_school_code text;
    v_number text;
BEGIN
    SELECT s.school_code INTO v_school_code
    FROM public.ems_schools s
    WHERE s.id = new.school_id;

    IF v_school_code IS NULL THEN
        RAISE EXCEPTION 'School not found';
    END IF;

    IF tg_table_name = 'ems_student_report_cards' THEN
        IF nullif(trim(new.report_number),'') IS NULL THEN
            LOOP
                v_number := v_school_code || '-RPT-' || to_char(current_date,'YYYY') || '-' ||
                            upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
                EXIT WHEN NOT EXISTS (
                    SELECT 1 FROM public.ems_student_report_cards x
                    WHERE x.report_number = v_number
                );
            END LOOP;
            new.report_number := v_number;
        END IF;
    ELSIF tg_table_name = 'ems_student_certificates' THEN
        IF nullif(trim(new.certificate_number),'') IS NULL THEN
            LOOP
                v_number := v_school_code || '-CERT-' || to_char(current_date,'YYYY') || '-' ||
                            upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
                EXIT WHEN NOT EXISTS (
                    SELECT 1 FROM public.ems_student_certificates x
                    WHERE x.certificate_number = v_number
                );
            END LOOP;
            new.certificate_number := v_number;
        END IF;
    END IF;

    RETURN new;
END;
$function$;


-- EMS FUNCTION: Synchronize EMS records with SBPF members

CREATE OR REPLACE FUNCTION public.ems_sync_sbpf_member_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_member_row_id bigint;
    v_user_id uuid;
BEGIN
    IF tg_table_name = 'ems_schools' THEN
        v_user_id := new.created_by;

        IF new.owner_member_row_id IS NULL THEN
            SELECT m.id INTO v_member_row_id
            FROM public.members m
            WHERE m.user_id = v_user_id
            LIMIT 1;

            IF v_member_row_id IS NULL THEN
                RAISE EXCEPTION 'This SBPF login is not linked to a Member ID yet';
            END IF;

            new.owner_member_row_id := v_member_row_id;

        ELSIF NOT EXISTS (
            SELECT 1 FROM public.members m
            WHERE m.id = new.owner_member_row_id
              AND m.user_id = v_user_id
        ) THEN
            RAISE EXCEPTION 'School owner must be linked to their own SBPF member account';
        END IF;

    ELSE
        v_user_id := new.user_id;

        IF v_user_id IS NOT NULL THEN
            SELECT m.id INTO v_member_row_id
            FROM public.members m
            WHERE m.user_id = v_user_id
            LIMIT 1;

            IF new.member_row_id IS NULL THEN
                new.member_row_id := v_member_row_id;

            ELSIF NOT EXISTS (
                SELECT 1 FROM public.members m
                WHERE m.id = new.member_row_id
                  AND m.user_id = v_user_id
            ) THEN
                RAISE EXCEPTION 'EMS role must be linked to the matching SBPF member account';
            END IF;

        ELSIF new.member_row_id IS NOT NULL THEN
            IF NOT EXISTS (
                SELECT 1 FROM public.members m
                WHERE m.id = new.member_row_id
            ) THEN
                RAISE EXCEPTION 'SBPF member record not found';
            END IF;
        END IF;
    END IF;

    RETURN new;
END;
$function$;

-- EMS FUNCTION: Create student ID card automatically

CREATE OR REPLACE FUNCTION public.ems_create_student_id_card()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.ems_student_id_cards
        (school_id,student_id,card_number,card_status)
    VALUES
        (new.school_id,new.id,new.student_code,'pending')
    ON CONFLICT (student_id) DO NOTHING;

    RETURN new;
END;
$function$;

-- EMS FUNCTION: Recalculate report card marks and result

CREATE OR REPLACE FUNCTION public.ems_recalculate_report_card()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_report_id uuid;
    v_max numeric(10,2);
    v_obtained numeric(10,2);
    v_percentage numeric(5,2);
    v_failed boolean;
BEGIN
    IF tg_op = 'DELETE' THEN
        v_report_id := old.report_card_id;
    ELSE
        v_report_id := new.report_card_id;
    END IF;

    SELECT
        coalesce(sum(maximum_marks),0),
        coalesce(sum(marks_obtained),0),
        coalesce(bool_or(marks_obtained < passing_marks),false)
    INTO v_max,v_obtained,v_failed
    FROM public.ems_student_report_card_subjects
    WHERE report_card_id = v_report_id;

    v_percentage := CASE
        WHEN v_max > 0 THEN round((v_obtained/v_max)*100,2)
        ELSE 0
    END;

    UPDATE public.ems_student_report_cards
    SET
        total_max_marks = v_max,
        total_marks_obtained = v_obtained,
        percentage = v_percentage,
        grade = CASE
            WHEN v_max = 0 THEN NULL
            WHEN v_percentage >= 90 THEN 'A+'
            WHEN v_percentage >= 80 THEN 'A'
            WHEN v_percentage >= 70 THEN 'B+'
            WHEN v_percentage >= 60 THEN 'B'
            WHEN v_percentage >= 50 THEN 'C'
            WHEN v_percentage >= 33 THEN 'D'
            ELSE 'E'
        END,
        result = CASE
            WHEN v_max = 0 THEN 'draft'
            WHEN v_failed OR v_percentage < 33 THEN 'fail'
            ELSE 'pass'
        END,
        updated_at = now()
    WHERE id = v_report_id
      AND publication_status = 'draft';

    IF tg_op = 'DELETE' THEN
        RETURN old;
    ELSE
        RETURN new;
    END IF;
END;
$function$;

-- EMS FUNCTION: Synchronize school portal branding

CREATE OR REPLACE FUNCTION public.ems_sync_school_portal_branding()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.ems_school_portal_settings
    SET
        portal_title = new.school_name,
        tagline = coalesce(new.school_motto,'Welcome to '||new.school_name),
        logo_url = new.school_logo_url,
        theme_config = coalesce(new.website_theme,'{}'::jsonb),
        homepage_config = jsonb_build_object(
            'sections',jsonb_build_array('hero','about','facilities','academics','notices','contact'),
            'address',new.address,
            'phone',new.phone,
            'email',new.email,
            'school_name',new.school_name,
            'description',new.website_description
        ),
        updated_at = now()
    WHERE school_id = new.id;

    RETURN new;
END;
$function$;


-- EMS FUNCTION: Generate school portal, domain and facilities

CREATE OR REPLACE FUNCTION public.ems_generate_school_setup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_base text;
    v_slug text;
    v_suffix integer := 1;
BEGIN
    v_base := public.ems_make_school_slug(new.school_name);
    v_slug := v_base;

    WHILE EXISTS (
        SELECT 1
        FROM public.ems_school_domains d
        WHERE lower(d.subdomain) = lower(v_slug)
          AND d.school_id IS DISTINCT FROM new.id
    ) LOOP
        v_suffix := v_suffix + 1;
        v_slug := left(v_base,40) || '-' || v_suffix::text;
    END LOOP;

    INSERT INTO public.ems_school_domains
        (school_id,subdomain,domain_status)
    VALUES
        (new.id,v_slug,'pending')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.ems_school_portal_settings
        (school_id,portal_title,tagline,logo_url,theme_config,
         homepage_config,enabled_modules,portal_status,domain_status)
    VALUES (
        new.id,
        new.school_name,
        coalesce(new.school_motto,'Welcome to '||new.school_name),
        new.school_logo_url,
        coalesce(new.website_theme,'{}'::jsonb),
        jsonb_build_object(
            'sections',jsonb_build_array('hero','about','facilities','academics','notices','contact'),
            'address',new.address,
            'phone',new.phone,
            'email',new.email,
            'school_name',new.school_name
        ),
        jsonb_build_array(
            'student_admission','student_id_card','report_card',
            'certificates','attendance','fees','teacher_portal','notices'
        ),
        'draft',
        'pending'
    )
    ON CONFLICT (school_id) DO UPDATE
    SET
        portal_title = excluded.portal_title,
        logo_url = excluded.logo_url,
        theme_config = excluded.theme_config,
        updated_at = now();

    INSERT INTO public.ems_school_facilities
        (school_id,facility_key,facility_name,is_enabled,display_order)
    VALUES
        (new.id,'library','Library',false,10),
        (new.id,'transport','School Transport',false,20),
        (new.id,'computer_lab','Computer Lab',false,30),
        (new.id,'science_lab','Science Laboratory',false,40),
        (new.id,'sports','Sports Ground',false,50),
        (new.id,'smart_class','Smart Classes',false,60),
        (new.id,'hostel','Hostel',false,70),
        (new.id,'canteen','Canteen',false,80),
        (new.id,'medical_room','Medical Room',false,90),
        (new.id,'scholarships','Scholarship Information',false,100)
    ON CONFLICT (school_id,facility_key) DO NOTHING;

    -- Shared EMS/HMS table: insert school templates only when it exists.
    IF to_regclass('public.sbpf_tenant_document_templates') IS NOT NULL THEN
        EXECUTE $templates$
            INSERT INTO public.sbpf_tenant_document_templates
                (tenant_type,school_id,template_key,template_name,
                 template_category,template_config)
            VALUES
            ('school',$1,'student_id_card','Student ID Card','id_card',
             '{"fields":["school_logo","school_name","student_photo","student_name","student_code","class_name","section","roll_number","guardian_name","emergency_phone","qr_verification"],"orientation":"landscape","print":"A4-card"}'::jsonb),
            ('school',$1,'report_card','Student Report Card','academic',
             '{"fields":["school_logo","school_name","student_name","student_code","class_name","academic_session","subjects","marks","percentage","grade","attendance","teacher_remarks","principal_signature"]}'::jsonb),
            ('school',$1,'bonafide_certificate','Bonafide Certificate','certificate',
             '{"fields":["school_logo","school_name","certificate_number","student_name","class_name","academic_session","issue_date","principal_signature"]}'::jsonb),
            ('school',$1,'transfer_certificate','Transfer Certificate','certificate',
             '{"fields":["school_logo","school_name","certificate_number","student_name","guardian_name","admission_date","last_class","conduct","issue_date","principal_signature"]}'::jsonb),
            ('school',$1,'privacy_policy','School Privacy Policy','legal_policy',
             '{"status":"draft","sections":["data_collected","purpose","parental_consent","retention","access_control","contact"],"legal_review_required":true}'::jsonb),
            ('school',$1,'terms_and_conditions','School Portal Terms','legal_policy',
             '{"status":"draft","sections":["portal_use","accounts","fees","acceptable_use","disclaimer","contact"],"legal_review_required":true}'::jsonb),
            ('school',$1,'parent_consent','Parent/Guardian Consent Form','consent',
             '{"status":"draft","fields":["student_name","guardian_name","consent_purpose","consent_given","signed_at"],"legal_review_required":true}'::jsonb)
            ON CONFLICT DO NOTHING
        $templates$ USING new.id;
    END IF;

    RETURN new;
END;
$function$;


-- EMS TRIGGERS

DROP TRIGGER IF EXISTS ems_assign_school_code_before_write ON public.ems_schools;
CREATE TRIGGER ems_assign_school_code_before_write
BEFORE INSERT OR UPDATE ON public.ems_schools
FOR EACH ROW EXECUTE FUNCTION public.ems_assign_school_code();

DROP TRIGGER IF EXISTS ems_generate_school_setup_after_insert ON public.ems_schools;
CREATE TRIGGER ems_generate_school_setup_after_insert
AFTER INSERT ON public.ems_schools
FOR EACH ROW EXECUTE FUNCTION public.ems_generate_school_setup();

DROP TRIGGER IF EXISTS ems_schools_sync_sbpf_member ON public.ems_schools;
CREATE TRIGGER ems_schools_sync_sbpf_member
BEFORE INSERT OR UPDATE ON public.ems_schools
FOR EACH ROW EXECUTE FUNCTION public.ems_sync_sbpf_member_link();

DROP TRIGGER IF EXISTS ems_sync_school_portal_branding_after_update ON public.ems_schools;
CREATE TRIGGER ems_sync_school_portal_branding_after_update
AFTER UPDATE ON public.ems_schools
FOR EACH ROW EXECUTE FUNCTION public.ems_sync_school_portal_branding();

DROP TRIGGER IF EXISTS ems_school_users_sync_sbpf_member ON public.ems_school_users;
CREATE TRIGGER ems_school_users_sync_sbpf_member
BEFORE INSERT OR UPDATE ON public.ems_school_users
FOR EACH ROW EXECUTE FUNCTION public.ems_sync_sbpf_member_link();

DROP TRIGGER IF EXISTS ems_students_sync_sbpf_member ON public.ems_students;
CREATE TRIGGER ems_students_sync_sbpf_member
BEFORE INSERT OR UPDATE ON public.ems_students
FOR EACH ROW EXECUTE FUNCTION public.ems_sync_sbpf_member_link();

DROP TRIGGER IF EXISTS ems_assign_student_code_before_write ON public.ems_students;
CREATE TRIGGER ems_assign_student_code_before_write
BEFORE INSERT OR UPDATE ON public.ems_students
FOR EACH ROW EXECUTE FUNCTION public.ems_assign_student_code();

DROP TRIGGER IF EXISTS ems_create_student_id_card_after_insert ON public.ems_students;
CREATE TRIGGER ems_create_student_id_card_after_insert
AFTER INSERT ON public.ems_students
FOR EACH ROW EXECUTE FUNCTION public.ems_create_student_id_card();

DROP TRIGGER IF EXISTS ems_teachers_sync_sbpf_member ON public.ems_teachers;
CREATE TRIGGER ems_teachers_sync_sbpf_member
BEFORE INSERT OR UPDATE ON public.ems_teachers
FOR EACH ROW EXECUTE FUNCTION public.ems_sync_sbpf_member_link();

DROP TRIGGER IF EXISTS ems_student_certificates_assign_number ON public.ems_student_certificates;
CREATE TRIGGER ems_student_certificates_assign_number
BEFORE INSERT ON public.ems_student_certificates
FOR EACH ROW EXECUTE FUNCTION public.ems_assign_report_and_certificate_numbers();

DROP TRIGGER IF EXISTS ems_student_report_cards_assign_number ON public.ems_student_report_cards;
CREATE TRIGGER ems_student_report_cards_assign_number
BEFORE INSERT ON public.ems_student_report_cards
FOR EACH ROW EXECUTE FUNCTION public.ems_assign_report_and_certificate_numbers();

DROP TRIGGER IF EXISTS ems_recalculate_report_card_after_subject_change ON public.ems_student_report_card_subjects;
CREATE TRIGGER ems_recalculate_report_card_after_subject_change
AFTER INSERT OR UPDATE OR DELETE ON public.ems_student_report_card_subjects
FOR EACH ROW EXECUTE FUNCTION public.ems_recalculate_report_card();


-- EMS RLS: Enable row-level security

ALTER TABLE public.ems_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_school_domains ENABLE ROW LEVEL SECURITY;

-- EMS RLS: Schools

CREATE POLICY ems_schools_insert_owner
ON public.ems_schools
FOR INSERT TO authenticated
WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY ems_schools_select_accessible
ON public.ems_schools
FOR SELECT TO authenticated
USING (
    created_by = (SELECT auth.uid())
    OR public.ems_can_access_school(id)
);

CREATE POLICY ems_schools_update_owner
ON public.ems_schools
FOR UPDATE TO authenticated
USING (created_by = (SELECT auth.uid()))
WITH CHECK (created_by = (SELECT auth.uid()));

-- EMS RLS: School users

CREATE POLICY ems_school_users_owner_manage
ON public.ems_school_users
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = ems_school_users.school_id
          AND s.created_by = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = ems_school_users.school_id
          AND s.created_by = (SELECT auth.uid())
    )
);

CREATE POLICY ems_school_users_select_accessible
ON public.ems_school_users
FOR SELECT TO authenticated
USING (
    user_id = (SELECT auth.uid())
    OR public.ems_can_access_school(school_id)
);

-- EMS RLS: Students

CREATE POLICY ems_students_school_access
ON public.ems_students
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR user_id = (SELECT auth.uid())
);

CREATE POLICY ems_students_school_manage
ON public.ems_students
FOR ALL TO authenticated
USING (public.ems_can_access_school(school_id))
WITH CHECK (public.ems_can_access_school(school_id));

-- EMS RLS: Teachers

CREATE POLICY ems_teachers_school_access
ON public.ems_teachers
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR user_id = (SELECT auth.uid())
);

CREATE POLICY ems_teachers_school_manage
ON public.ems_teachers
FOR ALL TO authenticated
USING (public.ems_can_access_school(school_id))
WITH CHECK (public.ems_can_access_school(school_id));

-- EMS RLS: School domains

CREATE POLICY ems_school_domains_owner_manage
ON public.ems_school_domains
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = ems_school_domains.school_id
          AND s.created_by = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ems_schools s
        WHERE s.id = ems_school_domains.school_id
          AND s.created_by = (SELECT auth.uid())
    )
);

CREATE POLICY ems_school_domains_school_access
ON public.ems_school_domains
FOR SELECT TO authenticated
USING (public.ems_can_access_school(school_id));


-- EMS RLS: Enable remaining tables

ALTER TABLE public.ems_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_school_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_school_portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_student_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_student_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_student_report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ems_student_report_card_subjects ENABLE ROW LEVEL SECURITY;

-- Attendance policies

CREATE POLICY ems_attendance_school_manage
ON public.ems_attendance
FOR ALL TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_school_users su
        WHERE su.school_id = ems_attendance.school_id
          AND su.user_id = (SELECT auth.uid())
          AND su.status = 'active'
          AND su.role = 'teacher'
    )
)
WITH CHECK (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_school_users su
        WHERE su.school_id = ems_attendance.school_id
          AND su.user_id = (SELECT auth.uid())
          AND su.status = 'active'
          AND su.role = 'teacher'
    )
);

CREATE POLICY ems_attendance_school_select
ON public.ems_attendance
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_students st
        WHERE st.id = ems_attendance.student_id
          AND st.user_id = (SELECT auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.ems_school_users su
        WHERE su.school_id = ems_attendance.school_id
          AND su.user_id = (SELECT auth.uid())
          AND su.status = 'active'
          AND su.role = 'teacher'
    )
);

-- Events policies

CREATE POLICY ems_events_school_manage
ON public.ems_events
FOR ALL TO authenticated
USING (public.ems_can_access_school(school_id))
WITH CHECK (public.ems_can_access_school(school_id));

CREATE POLICY ems_events_select_accessible
ON public.ems_events
FOR SELECT TO authenticated
USING (
    is_published
    OR public.ems_can_access_school(school_id)
);

-- Fee policies

CREATE POLICY ems_fee_school_manage
ON public.ems_fee_records
FOR ALL TO authenticated
USING (public.ems_can_access_school(school_id))
WITH CHECK (public.ems_can_access_school(school_id));

CREATE POLICY ems_fee_school_select
ON public.ems_fee_records
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_students st
        WHERE st.id = ems_fee_records.student_id
          AND st.user_id = (SELECT auth.uid())
    )
);

-- Salary policies

CREATE POLICY ems_salary_school_manage
ON public.ems_salary_records
FOR ALL TO authenticated
USING (public.ems_can_access_school(school_id))
WITH CHECK (public.ems_can_access_school(school_id));

CREATE POLICY ems_salary_school_select
ON public.ems_salary_records
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_teachers t
        WHERE t.id = ems_salary_records.teacher_id
          AND t.user_id = (SELECT auth.uid())
    )
);

-- School facilities policies

CREATE POLICY ems_school_facilities_manage
ON public.ems_school_facilities
FOR ALL TO authenticated
USING (public.ems_can_manage_school(school_id))
WITH CHECK (public.ems_can_manage_school(school_id));

CREATE POLICY ems_school_facilities_read
ON public.ems_school_facilities
FOR SELECT TO authenticated
USING (public.ems_can_access_school(school_id));

-- School portal policies

CREATE POLICY ems_school_portal_settings_manage
ON public.ems_school_portal_settings
FOR ALL TO authenticated
USING (public.ems_can_manage_school(school_id))
WITH CHECK (public.ems_can_manage_school(school_id));

CREATE POLICY ems_school_portal_settings_read
ON public.ems_school_portal_settings
FOR SELECT TO authenticated
USING (public.ems_can_access_school(school_id));


-- EMS RLS: Student certificates

CREATE POLICY ems_certificates_school_manage
ON public.ems_student_certificates
FOR ALL TO authenticated
USING (public.ems_can_manage_school(school_id))
WITH CHECK (public.ems_can_manage_school(school_id));

CREATE POLICY ems_certificates_school_or_student_read
ON public.ems_student_certificates
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR (
        status = 'issued'
        AND EXISTS (
            SELECT 1 FROM public.ems_students st
            WHERE st.id = ems_student_certificates.student_id
              AND st.user_id = (SELECT auth.uid())
        )
    )
);

-- EMS RLS: Student ID cards

CREATE POLICY ems_id_cards_school_manage
ON public.ems_student_id_cards
FOR ALL TO authenticated
USING (public.ems_can_manage_school(school_id))
WITH CHECK (public.ems_can_manage_school(school_id));

CREATE POLICY ems_id_cards_school_or_student_read
ON public.ems_student_id_cards
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR EXISTS (
        SELECT 1 FROM public.ems_students st
        WHERE st.id = ems_student_id_cards.student_id
          AND st.user_id = (SELECT auth.uid())
    )
);

-- EMS RLS: Student report cards

CREATE POLICY ems_report_cards_school_manage
ON public.ems_student_report_cards
FOR ALL TO authenticated
USING (public.ems_can_manage_school(school_id))
WITH CHECK (public.ems_can_manage_school(school_id));

CREATE POLICY ems_report_cards_school_or_student_read
ON public.ems_student_report_cards
FOR SELECT TO authenticated
USING (
    public.ems_can_access_school(school_id)
    OR (
        publication_status = 'published'
        AND EXISTS (
            SELECT 1 FROM public.ems_students st
            WHERE st.id = ems_student_report_cards.student_id
              AND st.user_id = (SELECT auth.uid())
        )
    )
);

-- EMS RLS: Report card subjects

CREATE POLICY ems_report_subjects_school_manage
ON public.ems_student_report_card_subjects
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ems_student_report_cards rc
        WHERE rc.id = ems_student_report_card_subjects.report_card_id
          AND public.ems_can_manage_school(rc.school_id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ems_student_report_cards rc
        WHERE rc.id = ems_student_report_card_subjects.report_card_id
          AND public.ems_can_manage_school(rc.school_id)
    )
);

CREATE POLICY ems_report_subjects_school_or_student_read
ON public.ems_student_report_card_subjects
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.ems_student_report_cards rc
        JOIN public.ems_students st ON st.id = rc.student_id
        WHERE rc.id = ems_student_report_card_subjects.report_card_id
          AND (
              public.ems_can_access_school(rc.school_id)
              OR (
                  rc.publication_status = 'published'
                  AND st.user_id = (SELECT auth.uid())
              )
          )
    )
);


-- EMS FUNCTION: Public school portal data

CREATE OR REPLACE FUNCTION public.ems_get_public_school_portal(p_subdomain text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v jsonb;
BEGIN
    SELECT jsonb_build_object(
        'type','school',
        'school_id',s.id,
        'school_name',s.school_name,
        'school_name_local',s.school_name_local,
        'school_code',s.school_code,
        'logo_url',s.school_logo_url,
        'address',s.address,
        'district',s.district,
        'state',s.state,
        'pincode',s.pincode,
        'phone',s.phone,
        'email',s.email,
        'website_description',s.website_description,
        'school_motto',s.school_motto,
        'principal_name',s.principal_name,
        'affiliation_number',s.affiliation_number,
        'academic_session',s.academic_session,
        'theme',s.website_theme,
        'facilities',coalesce((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'key',f.facility_key,
                    'name',f.facility_name,
                    'configuration',f.configuration
                ) ORDER BY f.display_order
            )
            FROM public.ems_school_facilities f
            WHERE f.school_id=s.id AND f.is_enabled
        ),'[]'::jsonb),
        'modules',ps.enabled_modules,
        'portal_status',ps.portal_status
    ) INTO v
    FROM public.ems_school_domains d
    JOIN public.ems_schools s ON s.id=d.school_id
    JOIN public.ems_school_portal_settings ps ON ps.school_id=s.id
    WHERE lower(d.subdomain)=lower(trim(p_subdomain))
      AND d.domain_status='active'
      AND ps.portal_status='published'
      AND s.website_status='published'
    LIMIT 1;

    RETURN coalesce(
        v,
        jsonb_build_object(
            'found',false,
            'message','School portal is not published or domain is not active'
        )
    );
END;
$function$;

-- EMS FUNCTION: Teacher class roster

CREATE OR REPLACE FUNCTION public.ems_teacher_class_roster(p_school_id uuid)
RETURNS TABLE(
    student_id uuid,
    student_code text,
    full_name text,
    class_name text,
    section text,
    roll_number text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.ems_school_users su
        WHERE su.school_id=p_school_id
          AND su.user_id=(SELECT auth.uid())
          AND su.status='active'
          AND su.role='teacher'
    ) AND NOT public.ems_can_manage_school(p_school_id) THEN
        RAISE EXCEPTION 'Teacher or school administrator access required';
    END IF;

    RETURN QUERY
    SELECT st.id,st.student_code,st.full_name,
           st.class_name,st.section,st.roll_number
    FROM public.ems_students st
    WHERE st.school_id=p_school_id
    ORDER BY st.class_name,st.section,st.roll_number,st.full_name;
END;
$function$;

-- EMS FUNCTION: Verify student certificate

CREATE OR REPLACE FUNCTION public.ems_verify_student_certificate(p_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v jsonb;
BEGIN
    SELECT jsonb_build_object(
        'valid',(c.status='issued'),
        'status',c.status,
        'certificate_number',c.certificate_number,
        'certificate_type',c.certificate_type,
        'title',c.title,
        'issue_date',c.issue_date,
        'academic_session',c.academic_session,
        'school_name',s.school_name,
        'school_name_local',s.school_name_local,
        'school_logo_url',s.school_logo_url,
        'student_name',st.full_name,
        'student_code',st.student_code
    ) INTO v
    FROM public.ems_student_certificates c
    JOIN public.ems_schools s ON s.id=c.school_id
    JOIN public.ems_students st ON st.id=c.student_id
    WHERE c.verification_token=p_token
    LIMIT 1;

    RETURN coalesce(v,jsonb_build_object('valid',false,'status','not_found'));
END;
$function$;

-- EMS FUNCTION: Verify student ID card

CREATE OR REPLACE FUNCTION public.ems_verify_student_id_card(p_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v jsonb;
BEGIN
    SELECT jsonb_build_object(
        'valid',(
            c.card_status='active'
            AND (c.valid_until IS NULL OR c.valid_until>=current_date)
        ),
        'card_status',CASE
            WHEN c.card_status='active'
             AND c.valid_until IS NOT NULL
             AND c.valid_until<current_date
            THEN 'expired'
            ELSE c.card_status
        END,
        'school_name',s.school_name,
        'school_name_local',s.school_name_local,
        'school_code',s.school_code,
        'school_logo_url',s.school_logo_url,
        'student_name',st.full_name,
        'student_code',st.student_code,
        'class_name',st.class_name,
        'section',st.section,
        'academic_session',s.academic_session,
        'issued_at',c.issued_at,
        'valid_until',c.valid_until
    ) INTO v
    FROM public.ems_student_id_cards c
    JOIN public.ems_schools s ON s.id=c.school_id
    JOIN public.ems_students st ON st.id=c.student_id
    WHERE c.verification_token=p_token
    LIMIT 1;

    RETURN coalesce(v,jsonb_build_object('valid',false,'card_status','not_found'));
END;
$function$;


-- EMS FUNCTION PERMISSIONS: Match Production ACLs
-- Local migration only. Preserve postgres and service_role access.

REVOKE ALL ON FUNCTION public.ems_school_code_prefix(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_make_school_slug(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_can_access_school(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_can_manage_school(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_assign_school_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_assign_student_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_assign_report_and_certificate_numbers() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_sync_sbpf_member_link() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_create_student_id_card() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_recalculate_report_card() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_sync_school_portal_branding() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_generate_school_setup() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_get_public_school_portal(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_teacher_class_roster(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_verify_student_certificate(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ems_verify_student_id_card(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.ems_can_access_school(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ems_can_manage_school(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ems_teacher_class_roster(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.ems_get_public_school_portal(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ems_verify_student_certificate(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ems_verify_student_id_card(uuid) TO anon, authenticated;
