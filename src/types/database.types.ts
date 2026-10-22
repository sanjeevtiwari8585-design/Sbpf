export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          cooldown_minutes: number
          created_at: string
          enabled: boolean
          entity_type: string
          event_type: string
          id: number
          priority: number
          rule_key: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          cooldown_minutes?: number
          created_at?: string
          enabled?: boolean
          entity_type: string
          event_type: string
          id?: number
          priority?: number
          rule_key: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          cooldown_minutes?: number
          created_at?: string
          enabled?: boolean
          entity_type?: string
          event_type?: string
          id?: number
          priority?: number
          rule_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      automation_runs: {
        Row: {
          completed_at: string | null
          entity_id: number | null
          entity_type: string
          error_message: string | null
          event_type: string
          id: number
          result: Json
          rule_id: number | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          entity_id?: number | null
          entity_type: string
          error_message?: string | null
          event_type: string
          id?: number
          result?: Json
          rule_id?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          entity_id?: number | null
          entity_type?: string
          error_message?: string | null
          event_type?: string
          id?: number
          result?: Json
          rule_id?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      branding_assets: {
        Row: {
          asset_content: string
          asset_key: string
          asset_type: string
          created_at: string
          id: number
          is_active: boolean
          mime_type: string
          public_path: string | null
          updated_at: string
          version: number
        }
        Insert: {
          asset_content: string
          asset_key: string
          asset_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          mime_type?: string
          public_path?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          asset_content?: string
          asset_key?: string
          asset_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          mime_type?: string
          public_path?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      campaign_categories: {
        Row: {
          campaign_id: number
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          campaign_id: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          campaign_id?: number
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_categories_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_content: {
        Row: {
          campaign_id: number
          category_id: number
          content: string | null
          created_at: string
          id: number
          image_url: string | null
          is_active: boolean
          slug: string
          sort_order: number
          source_url: string | null
          summary: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          campaign_id: number
          category_id: number
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          is_active?: boolean
          slug: string
          sort_order?: number
          source_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          campaign_id?: number
          category_id?: number
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          is_active?: boolean
          slug?: string
          sort_order?: number
          source_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_content_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "campaign_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_member_access: {
        Row: {
          campaign_id: number
          created_at: string
          granted_by: string | null
          id: number
          is_active: boolean
          member_id: number
          user_id: string
        }
        Insert: {
          campaign_id: number
          created_at?: string
          granted_by?: string | null
          id?: number
          is_active?: boolean
          member_id: number
          user_id: string
        }
        Update: {
          campaign_id?: number
          created_at?: string
          granted_by?: string | null
          id?: number
          is_active?: boolean
          member_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_member_access_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_member_access_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      child_development_request_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          new_status: string
          note: string | null
          old_status: string | null
          request_id: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_status: string
          note?: string | null
          old_status?: string | null
          request_id: number
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_status?: string
          note?: string | null
          old_status?: string | null
          request_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "child_development_request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "child_development_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      child_development_requests: {
        Row: {
          admin_note: string | null
          alternate_phone: string | null
          assigned_to: string | null
          child_age_years: number | null
          child_dob: string | null
          child_gender: string | null
          child_name: string
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string
          guardian_name: string
          guardian_relation: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          need_category: string
          outcome_note: string | null
          pincode: string | null
          referral_contact: string | null
          referral_organization: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_or_anganwadi: string | null
          service_code: string
          service_id: number
          short_need: string
          state: string
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          alternate_phone?: string | null
          assigned_to?: string | null
          child_age_years?: number | null
          child_dob?: string | null
          child_gender?: string | null
          child_name: string
          consent_to_contact?: boolean
          contact_phone: string
          created_at?: string
          details?: string | null
          district: string
          guardian_name: string
          guardian_relation?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          need_category: string
          outcome_note?: string | null
          pincode?: string | null
          referral_contact?: string | null
          referral_organization?: string | null
          request_number: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_or_anganwadi?: string | null
          service_code: string
          service_id: number
          short_need: string
          state: string
          status?: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          alternate_phone?: string | null
          assigned_to?: string | null
          child_age_years?: number | null
          child_dob?: string | null
          child_gender?: string | null
          child_name?: string
          consent_to_contact?: boolean
          contact_phone?: string
          created_at?: string
          details?: string | null
          district?: string
          guardian_name?: string
          guardian_relation?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          need_category?: string
          outcome_note?: string | null
          pincode?: string | null
          referral_contact?: string | null
          referral_organization?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_or_anganwadi?: string | null
          service_code?: string
          service_id?: number
          short_need?: string
          state?: string
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_development_requests_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_development_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "child_development_services"
            referencedColumns: ["id"]
          },
        ]
      }
      child_development_services: {
        Row: {
          application_url: string | null
          availability_note: string | null
          availability_status: string
          category: string
          created_at: string
          delivery_mode: string
          display_order: number
          eligibility: string | null
          full_description: string | null
          id: number
          is_active: boolean
          official_source_url: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category?: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code?: string
          service_name?: string
          service_name_hi?: string
          short_description?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          admin_remark: string | null
          complaint_number: string
          created_at: string | null
          description: string | null
          document_url: string | null
          id: number
          location: string | null
          photo_url: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_remark?: string | null
          complaint_number: string
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          id?: number
          location?: string | null
          photo_url?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_remark?: string | null
          complaint_number?: string
          created_at?: string | null
          description?: string | null
          document_url?: string | null
          id?: number
          location?: string | null
          photo_url?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          payment_status: string | null
          receipt_number: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          payment_status?: string | null
          receipt_number?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          payment_status?: string | null
          receipt_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      e_library_exam_papers: {
        Row: {
          category_id: number
          created_at: string
          exam_year: number
          external_url: string | null
          id: number
          is_published: boolean
          paper_status: string
          paper_title: string
          paper_type: string
          source_url: string | null
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          category_id: number
          created_at?: string
          exam_year: number
          external_url?: string | null
          id?: number
          is_published?: boolean
          paper_status?: string
          paper_title: string
          paper_type?: string
          source_url?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          exam_year?: number
          external_url?: string | null
          id?: number
          is_published?: boolean
          paper_status?: string
          paper_title?: string
          paper_type?: string
          source_url?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "e_library_exam_papers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "education_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      education_career_guides: {
        Row: {
          after_10th: string
          after_12th: string
          category_id: number
          eligibility: string
          how_to_apply: string
          id: number
          is_published: boolean
          official_url: string | null
          overview: string
          preparation_plan: string
          sources: Json
          syllabus_url: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          after_10th?: string
          after_12th?: string
          category_id: number
          eligibility?: string
          how_to_apply?: string
          id?: number
          is_published?: boolean
          official_url?: string | null
          overview?: string
          preparation_plan?: string
          sources?: Json
          syllabus_url?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          after_10th?: string
          after_12th?: string
          category_id?: number
          eligibility?: string
          how_to_apply?: string
          id?: number
          is_published?: boolean
          official_url?: string | null
          overview?: string
          preparation_plan?: string
          sources?: Json
          syllabus_url?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_career_guides_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "education_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      education_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      education_colleges: {
        Row: {
          academic_session: string | null
          account_holder_name: string | null
          account_number: string | null
          address: string
          bank_branch: string | null
          bank_name: string | null
          bank_verified: boolean
          contact_designation: string | null
          contact_email: string | null
          contact_mobile: string | null
          contact_person: string | null
          course_name: string | null
          created_at: string
          district: string | null
          id: number
          ifsc_code: string | null
          is_active: boolean
          name: string
          pincode: string | null
          state: string | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          academic_session?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          address: string
          bank_branch?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          contact_designation?: string | null
          contact_email?: string | null
          contact_mobile?: string | null
          contact_person?: string | null
          course_name?: string | null
          created_at?: string
          district?: string | null
          id?: number
          ifsc_code?: string | null
          is_active?: boolean
          name: string
          pincode?: string | null
          state?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          academic_session?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          address?: string
          bank_branch?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          contact_designation?: string | null
          contact_email?: string | null
          contact_mobile?: string | null
          contact_person?: string | null
          course_name?: string | null
          created_at?: string
          district?: string | null
          id?: number
          ifsc_code?: string | null
          is_active?: boolean
          name?: string
          pincode?: string | null
          state?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      education_content: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean
          link_label: string | null
          link_url: string | null
          section: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          section: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          section?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      education_directory_profiles: {
        Row: {
          biography: string | null
          city: string | null
          class_details: Json
          country: string
          created_at: string
          display_name: string
          district: string | null
          experience_years: number | null
          free_access_note: string | null
          free_access_type: string
          free_class_url: string | null
          headline: string | null
          id: number
          institution_name: string | null
          is_featured: boolean
          is_public: boolean
          is_sbpf_verified: boolean
          languages: string[]
          linked_teacher_id: number | null
          member_row_id: number | null
          official_logo_url: string | null
          owner_user_id: string | null
          profile_photo_url: string | null
          profile_type: string
          public_contact_url: string | null
          qualification: string | null
          source_name: string | null
          source_url: string | null
          source_verified_at: string | null
          state: string | null
          status: string
          subjects: string[]
          teaching_mode: string
          updated_at: string
          website_url: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          biography?: string | null
          city?: string | null
          class_details?: Json
          country?: string
          created_at?: string
          display_name: string
          district?: string | null
          experience_years?: number | null
          free_access_note?: string | null
          free_access_type?: string
          free_class_url?: string | null
          headline?: string | null
          id?: number
          institution_name?: string | null
          is_featured?: boolean
          is_public?: boolean
          is_sbpf_verified?: boolean
          languages?: string[]
          linked_teacher_id?: number | null
          member_row_id?: number | null
          official_logo_url?: string | null
          owner_user_id?: string | null
          profile_photo_url?: string | null
          profile_type?: string
          public_contact_url?: string | null
          qualification?: string | null
          source_name?: string | null
          source_url?: string | null
          source_verified_at?: string | null
          state?: string | null
          status?: string
          subjects?: string[]
          teaching_mode?: string
          updated_at?: string
          website_url?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          biography?: string | null
          city?: string | null
          class_details?: Json
          country?: string
          created_at?: string
          display_name?: string
          district?: string | null
          experience_years?: number | null
          free_access_note?: string | null
          free_access_type?: string
          free_class_url?: string | null
          headline?: string | null
          id?: number
          institution_name?: string | null
          is_featured?: boolean
          is_public?: boolean
          is_sbpf_verified?: boolean
          languages?: string[]
          linked_teacher_id?: number | null
          member_row_id?: number | null
          official_logo_url?: string | null
          owner_user_id?: string | null
          profile_photo_url?: string | null
          profile_type?: string
          public_contact_url?: string | null
          qualification?: string | null
          source_name?: string | null
          source_url?: string | null
          source_verified_at?: string | null
          state?: string | null
          status?: string
          subjects?: string[]
          teaching_mode?: string
          updated_at?: string
          website_url?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_directory_profiles_linked_teacher_id_fkey"
            columns: ["linked_teacher_id"]
            isOneToOne: false
            referencedRelation: "education_teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_directory_profiles_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      education_enrollments: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          student_member_id: number | null
          student_user_id: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          student_member_id?: number | null
          student_user_id?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          student_member_id?: number | null
          student_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_enrollments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "education_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      education_member_workflows: {
        Row: {
          admin_note: string | null
          created_at: string
          document_paths: string[]
          id: number
          member_id: string
          member_row_id: number
          payload: Json
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          work_area: string
          workflow_type: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          document_paths?: string[]
          id?: number
          member_id: string
          member_row_id: number
          payload?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          work_area: string
          workflow_type: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          document_paths?: string[]
          id?: number
          member_id?: string
          member_row_id?: number
          payload?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          work_area?: string
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_member_workflows_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      education_resource_access: {
        Row: {
          accessed_at: string
          id: number
          resource_id: number
          user_id: string
        }
        Insert: {
          accessed_at?: string
          id?: number
          resource_id: number
          user_id: string
        }
        Update: {
          accessed_at?: string
          id?: number
          resource_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_resource_access_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "education_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      education_resources: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          district: string | null
          id: number
          is_downloadable: boolean
          job_type: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_score: number | null
          moderation_status: string
          published_at: string | null
          resource_path: string | null
          resource_type: string
          resource_url: string | null
          state: string | null
          status: string
          submitted_by: string | null
          teacher_id: number | null
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: number
          is_downloadable?: boolean
          job_type?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_score?: number | null
          moderation_status?: string
          published_at?: string | null
          resource_path?: string | null
          resource_type: string
          resource_url?: string | null
          state?: string | null
          status?: string
          submitted_by?: string | null
          teacher_id?: number | null
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: number
          is_downloadable?: boolean
          job_type?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_score?: number | null
          moderation_status?: string
          published_at?: string | null
          resource_path?: string | null
          resource_type?: string
          resource_url?: string | null
          state?: string | null
          status?: string
          submitted_by?: string | null
          teacher_id?: number | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "education_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_resources_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "education_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      education_scholarships: {
        Row: {
          academic_session: string | null
          application_end: string | null
          application_start: string | null
          created_at: string
          description: string | null
          eligibility: string | null
          id: number
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          academic_session?: string | null
          application_end?: string | null
          application_start?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          id?: number
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          academic_session?: string | null
          application_end?: string | null
          application_start?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          id?: number
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      education_teachers: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bio: string | null
          city: string | null
          created_at: string
          experience_years: number | null
          free_class_url: string | null
          free_classes_available: boolean
          full_name: string
          id: number
          institution_name: string | null
          is_featured: boolean
          is_public: boolean
          languages: string[]
          member_id: number | null
          member_verified_at: string | null
          profile_photo_url: string | null
          public_contact_url: string | null
          qualification: string | null
          source_url: string | null
          state: string | null
          status: string
          subject_categories: string[]
          teaching_mode: string
          updated_at: string
          user_id: string | null
          website_url: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          experience_years?: number | null
          free_class_url?: string | null
          free_classes_available?: boolean
          full_name: string
          id?: number
          institution_name?: string | null
          is_featured?: boolean
          is_public?: boolean
          languages?: string[]
          member_id?: number | null
          member_verified_at?: string | null
          profile_photo_url?: string | null
          public_contact_url?: string | null
          qualification?: string | null
          source_url?: string | null
          state?: string | null
          status?: string
          subject_categories?: string[]
          teaching_mode?: string
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          experience_years?: number | null
          free_class_url?: string | null
          free_classes_available?: boolean
          full_name?: string
          id?: number
          institution_name?: string | null
          is_featured?: boolean
          is_public?: boolean
          languages?: string[]
          member_id?: number | null
          member_verified_at?: string | null
          profile_photo_url?: string | null
          public_contact_url?: string | null
          qualification?: string | null
          source_url?: string | null
          state?: string | null
          status?: string
          subject_categories?: string[]
          teaching_mode?: string
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: []
      }
      education_workflow_reviews: {
        Row: {
          decision: string
          id: number
          note: string | null
          reviewed_at: string
          reviewed_by: string
          workflow_id: number
        }
        Insert: {
          decision: string
          id?: number
          note?: string | null
          reviewed_at?: string
          reviewed_by: string
          workflow_id: number
        }
        Update: {
          decision?: string
          id?: number
          note?: string | null
          reviewed_at?: string
          reviewed_by?: string
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_workflow_reviews_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "education_member_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_opportunities: {
        Row: {
          application_url: string | null
          category: string | null
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          job_type: string | null
          last_date: string | null
          location: string | null
          organization: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          job_type?: string | null
          last_date?: string | null
          location?: string | null
          organization?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          job_type?: string | null
          last_date?: string | null
          location?: string | null
          organization?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      employment_skill_services: {
        Row: {
          application_url: string | null
          availability_note: string | null
          availability_status: string
          category: string
          created_at: string
          delivery_mode: string
          display_order: number
          eligibility: string | null
          full_description: string | null
          id: number
          is_active: boolean
          official_source_url: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category?: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code?: string
          service_name?: string
          service_name_hi?: string
          short_description?: string
          updated_at?: string
        }
        Relationships: []
      }
      ems_attendance: {
        Row: {
          attendance_date: string
          created_at: string
          id: string
          marked_by: string | null
          remarks: string | null
          school_id: string
          status: string
          student_id: string
        }
        Insert: {
          attendance_date?: string
          created_at?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          school_id: string
          status: string
          student_id: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          school_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "ems_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          event_type: string
          id: string
          is_published: boolean
          school_id: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          id?: string
          is_published?: boolean
          school_id: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          id?: string
          is_published?: boolean
          school_id?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_fee_records: {
        Row: {
          amount_due: number
          amount_paid: number
          created_at: string
          created_by: string | null
          due_date: string | null
          fee_type: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          receipt_number: string | null
          school_id: string
          status: string
          student_id: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          fee_type?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id: string
          status?: string
          student_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          fee_type?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_fee_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_fee_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "ems_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_salary_records: {
        Row: {
          allowances: number
          base_salary: number
          created_at: string
          deductions: number
          id: string
          net_salary: number | null
          notes: string | null
          paid_amount: number
          paid_at: string | null
          payment_reference: string | null
          processed_by: string | null
          salary_month: string
          school_id: string
          status: string
          teacher_id: string
        }
        Insert: {
          allowances?: number
          base_salary?: number
          created_at?: string
          deductions?: number
          id?: string
          net_salary?: number | null
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          salary_month: string
          school_id: string
          status?: string
          teacher_id: string
        }
        Update: {
          allowances?: number
          base_salary?: number
          created_at?: string
          deductions?: number
          id?: string
          net_salary?: number | null
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          salary_month?: string
          school_id?: string
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_salary_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_salary_records_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "ems_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_school_domains: {
        Row: {
          created_at: string
          domain_status: string
          id: string
          root_domain: string
          school_id: string
          subdomain: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain_status?: string
          id?: string
          root_domain?: string
          school_id: string
          subdomain: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain_status?: string
          id?: string
          root_domain?: string
          school_id?: string
          subdomain?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ems_school_domains_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_school_facilities: {
        Row: {
          configuration: Json
          created_at: string
          display_order: number
          facility_key: string
          facility_name: string
          id: string
          is_enabled: boolean
          school_id: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          display_order?: number
          facility_key: string
          facility_name: string
          id?: string
          is_enabled?: boolean
          school_id: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          display_order?: number
          facility_key?: string
          facility_name?: string
          id?: string
          is_enabled?: boolean
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_school_facilities_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_school_portal_settings: {
        Row: {
          domain_status: string
          enabled_modules: Json
          generated_at: string
          homepage_config: Json
          logo_url: string | null
          portal_status: string
          portal_title: string
          school_id: string
          tagline: string | null
          theme_config: Json
          updated_at: string
        }
        Insert: {
          domain_status?: string
          enabled_modules?: Json
          generated_at?: string
          homepage_config?: Json
          logo_url?: string | null
          portal_status?: string
          portal_title: string
          school_id: string
          tagline?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Update: {
          domain_status?: string
          enabled_modules?: Json
          generated_at?: string
          homepage_config?: Json
          logo_url?: string | null
          portal_status?: string
          portal_title?: string
          school_id?: string
          tagline?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_school_portal_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_school_users: {
        Row: {
          created_at: string
          id: string
          member_row_id: number | null
          role: string
          school_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_row_id?: number | null
          role: string
          school_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          member_row_id?: number | null
          role?: string
          school_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_school_users_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_school_users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_schools: {
        Row: {
          academic_session: string | null
          address: string | null
          affiliation_number: string | null
          created_at: string
          created_by: string
          district: string | null
          email: string | null
          facilities: Json
          id: string
          owner_member_row_id: number | null
          phone: string | null
          pincode: string | null
          principal_name: string | null
          school_code: string
          school_logo_path: string | null
          school_logo_url: string | null
          school_motto: string | null
          school_name: string
          school_name_local: string | null
          state: string | null
          status: string
          updated_at: string
          website_description: string | null
          website_published_at: string | null
          website_status: string
          website_theme: Json
        }
        Insert: {
          academic_session?: string | null
          address?: string | null
          affiliation_number?: string | null
          created_at?: string
          created_by?: string
          district?: string | null
          email?: string | null
          facilities?: Json
          id?: string
          owner_member_row_id?: number | null
          phone?: string | null
          pincode?: string | null
          principal_name?: string | null
          school_code?: string
          school_logo_path?: string | null
          school_logo_url?: string | null
          school_motto?: string | null
          school_name: string
          school_name_local?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          website_description?: string | null
          website_published_at?: string | null
          website_status?: string
          website_theme?: Json
        }
        Update: {
          academic_session?: string | null
          address?: string | null
          affiliation_number?: string | null
          created_at?: string
          created_by?: string
          district?: string | null
          email?: string | null
          facilities?: Json
          id?: string
          owner_member_row_id?: number | null
          phone?: string | null
          pincode?: string | null
          principal_name?: string | null
          school_code?: string
          school_logo_path?: string | null
          school_logo_url?: string | null
          school_motto?: string | null
          school_name?: string
          school_name_local?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          website_description?: string | null
          website_published_at?: string | null
          website_status?: string
          website_theme?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ems_schools_owner_member_row_id_fkey"
            columns: ["owner_member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_student_certificates: {
        Row: {
          academic_session: string | null
          certificate_number: string
          certificate_type: string
          created_at: string
          description: string | null
          id: string
          issue_date: string
          issued_by: string | null
          issued_by_name: string | null
          school_id: string
          status: string
          student_id: string
          title: string
          updated_at: string
          verification_token: string
        }
        Insert: {
          academic_session?: string | null
          certificate_number: string
          certificate_type: string
          created_at?: string
          description?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          issued_by_name?: string | null
          school_id: string
          status?: string
          student_id: string
          title: string
          updated_at?: string
          verification_token?: string
        }
        Update: {
          academic_session?: string | null
          certificate_number?: string
          certificate_type?: string
          created_at?: string
          description?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          issued_by_name?: string | null
          school_id?: string
          status?: string
          student_id?: string
          title?: string
          updated_at?: string
          verification_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_student_certificates_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_student_certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "ems_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_student_id_cards: {
        Row: {
          card_number: string
          card_status: string
          created_at: string
          id: string
          issued_at: string | null
          issued_by: string | null
          school_id: string
          student_id: string
          updated_at: string
          valid_until: string | null
          verification_token: string
        }
        Insert: {
          card_number: string
          card_status?: string
          created_at?: string
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          school_id: string
          student_id: string
          updated_at?: string
          valid_until?: string | null
          verification_token?: string
        }
        Update: {
          card_number?: string
          card_status?: string
          created_at?: string
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          school_id?: string
          student_id?: string
          updated_at?: string
          valid_until?: string | null
          verification_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_student_id_cards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_student_id_cards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "ems_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_student_report_card_subjects: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          marks_obtained: number
          maximum_marks: number
          passing_marks: number
          remarks: string | null
          report_card_id: string
          subject_name: string
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          marks_obtained: number
          maximum_marks: number
          passing_marks?: number
          remarks?: string | null
          report_card_id: string
          subject_name: string
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          marks_obtained?: number
          maximum_marks?: number
          passing_marks?: number
          remarks?: string | null
          report_card_id?: string
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_student_report_card_subjects_report_card_id_fkey"
            columns: ["report_card_id"]
            isOneToOne: false
            referencedRelation: "ems_student_report_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_student_report_cards: {
        Row: {
          academic_session: string
          attendance_percentage: number | null
          created_at: string
          created_by: string | null
          exam_name: string
          grade: string | null
          id: string
          percentage: number
          principal_remarks: string | null
          publication_status: string
          published_at: string | null
          published_by: string | null
          report_number: string
          result: string
          school_id: string
          student_id: string
          teacher_remarks: string | null
          term_name: string | null
          total_marks_obtained: number
          total_max_marks: number
          updated_at: string
        }
        Insert: {
          academic_session: string
          attendance_percentage?: number | null
          created_at?: string
          created_by?: string | null
          exam_name: string
          grade?: string | null
          id?: string
          percentage?: number
          principal_remarks?: string | null
          publication_status?: string
          published_at?: string | null
          published_by?: string | null
          report_number: string
          result?: string
          school_id: string
          student_id: string
          teacher_remarks?: string | null
          term_name?: string | null
          total_marks_obtained?: number
          total_max_marks?: number
          updated_at?: string
        }
        Update: {
          academic_session?: string
          attendance_percentage?: number | null
          created_at?: string
          created_by?: string | null
          exam_name?: string
          grade?: string | null
          id?: string
          percentage?: number
          principal_remarks?: string | null
          publication_status?: string
          published_at?: string | null
          published_by?: string | null
          report_number?: string
          result?: string
          school_id?: string
          student_id?: string
          teacher_remarks?: string | null
          term_name?: string | null
          total_marks_obtained?: number
          total_max_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ems_student_report_cards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_student_report_cards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "ems_students"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_students: {
        Row: {
          address: string | null
          class_name: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string
          gender: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          member_row_id: number | null
          registration_expires_at: string | null
          registration_fee: number
          registration_paid_at: string | null
          registration_status: string
          roll_number: string | null
          school_id: string
          section: string | null
          student_code: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          member_row_id?: number | null
          registration_expires_at?: string | null
          registration_fee?: number
          registration_paid_at?: string | null
          registration_status?: string
          roll_number?: string | null
          school_id: string
          section?: string | null
          student_code: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          member_row_id?: number | null
          registration_expires_at?: string | null
          registration_fee?: number
          registration_paid_at?: string | null
          registration_status?: string
          roll_number?: string | null
          school_id?: string
          section?: string | null
          student_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ems_students_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ems_teachers: {
        Row: {
          created_at: string
          designation: string | null
          email: string | null
          employment_status: string
          full_name: string
          id: string
          joining_date: string | null
          member_row_id: number | null
          phone: string | null
          salary_amount: number
          school_id: string
          subject: string | null
          teacher_code: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          designation?: string | null
          email?: string | null
          employment_status?: string
          full_name: string
          id?: string
          joining_date?: string | null
          member_row_id?: number | null
          phone?: string | null
          salary_amount?: number
          school_id: string
          subject?: string | null
          teacher_code: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          designation?: string | null
          email?: string | null
          employment_status?: string
          full_name?: string
          id?: string
          joining_date?: string | null
          member_row_id?: number | null
          phone?: string | null
          salary_amount?: number
          school_id?: string
          subject?: string | null
          teacher_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ems_teachers_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ems_teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_areas: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      government_links: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          title: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          title: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          application_process: string | null
          benefits: Json
          category: string | null
          created_at: string | null
          description: string | null
          eligibility: Json
          id: number
          image_url: string | null
          last_source_sync_at: string | null
          last_verified_at: string | null
          ministry_department: string | null
          name: string
          official_url: string | null
          published: boolean | null
          region_code: string | null
          required_documents: Json
          scheme_code: string | null
          scope: string
          search_text: string | null
          source_name: string | null
          source_url: string | null
          sub_category: string | null
          sync_hash: string | null
          sync_status: string
          updated_at: string
        }
        Insert: {
          application_process?: string | null
          benefits?: Json
          category?: string | null
          created_at?: string | null
          description?: string | null
          eligibility?: Json
          id?: number
          image_url?: string | null
          last_source_sync_at?: string | null
          last_verified_at?: string | null
          ministry_department?: string | null
          name: string
          official_url?: string | null
          published?: boolean | null
          region_code?: string | null
          required_documents?: Json
          scheme_code?: string | null
          scope?: string
          search_text?: string | null
          source_name?: string | null
          source_url?: string | null
          sub_category?: string | null
          sync_hash?: string | null
          sync_status?: string
          updated_at?: string
        }
        Update: {
          application_process?: string | null
          benefits?: Json
          category?: string | null
          created_at?: string | null
          description?: string | null
          eligibility?: Json
          id?: number
          image_url?: string | null
          last_source_sync_at?: string | null
          last_verified_at?: string | null
          ministry_department?: string | null
          name?: string
          official_url?: string | null
          published?: boolean | null
          region_code?: string | null
          required_documents?: Json
          scheme_code?: string | null
          scope?: string
          search_text?: string | null
          source_name?: string | null
          source_url?: string | null
          sub_category?: string | null
          sync_hash?: string | null
          sync_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_service_request_history: {
        Row: {
          changed_at: string
          changed_by: string
          id: number
          new_status: string
          note: string | null
          old_status: string | null
          request_id: number
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: number
          new_status: string
          note?: string | null
          old_status?: string | null
          request_id: number
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: number
          new_status?: string
          note?: string | null
          old_status?: string | null
          request_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_service_request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "health_service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      health_service_requests: {
        Row: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          assigned_to: string | null
          beneficiary_name: string
          beneficiary_relation: string
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          emergency_flag: boolean
          gender: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          preferred_date: string | null
          preferred_time: string | null
          referral_contact: string | null
          referral_provider: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          assigned_to?: string | null
          beneficiary_name: string
          beneficiary_relation?: string
          consent_to_contact?: boolean
          contact_phone: string
          created_at?: string
          details?: string | null
          district?: string | null
          emergency_flag?: boolean
          gender?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_contact_method?: string
          preferred_date?: string | null
          preferred_time?: string | null
          referral_contact?: string | null
          referral_provider?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code: string
          service_id?: number | null
          service_name: string
          short_need: string
          state?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          assigned_to?: string | null
          beneficiary_name?: string
          beneficiary_relation?: string
          consent_to_contact?: boolean
          contact_phone?: string
          created_at?: string
          details?: string | null
          district?: string | null
          emergency_flag?: boolean
          gender?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_contact_method?: string
          preferred_date?: string | null
          preferred_time?: string | null
          referral_contact?: string | null
          referral_provider?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code?: string
          service_id?: number | null
          service_name?: string
          short_need?: string
          state?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_service_requests_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "health_services"
            referencedColumns: ["id"]
          },
        ]
      }
      health_services: {
        Row: {
          availability_note: string
          availability_status: string
          category: string
          created_at: string
          delivery_mode: string
          display_order: number
          eligibility: string
          external_url: string | null
          full_description: string
          id: number
          is_active: boolean
          is_emergency_service: boolean
          public_contact_email: string | null
          public_contact_name: string | null
          public_contact_phone: string | null
          requires_member_login: boolean
          service_area_districts: string[]
          service_area_states: string[]
          service_code: string
          service_name: string
          short_description: string
          updated_at: string
        }
        Insert: {
          availability_note?: string
          availability_status?: string
          category: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string
          external_url?: string | null
          full_description?: string
          id?: number
          is_active?: boolean
          is_emergency_service?: boolean
          public_contact_email?: string | null
          public_contact_name?: string | null
          public_contact_phone?: string | null
          requires_member_login?: boolean
          service_area_districts?: string[]
          service_area_states?: string[]
          service_code: string
          service_name: string
          short_description?: string
          updated_at?: string
        }
        Update: {
          availability_note?: string
          availability_status?: string
          category?: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string
          external_url?: string | null
          full_description?: string
          id?: number
          is_active?: boolean
          is_emergency_service?: boolean
          public_contact_email?: string | null
          public_contact_name?: string | null
          public_contact_phone?: string | null
          requires_member_login?: boolean
          service_area_districts?: string[]
          service_area_states?: string[]
          service_code?: string
          service_name?: string
          short_description?: string
          updated_at?: string
        }
        Relationships: []
      }
      hms_admissions: {
        Row: {
          admission_number: string
          admitted_at: string
          attending_doctor_id: string | null
          bed_id: string | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          discharged_at: string | null
          hospital_id: string
          id: string
          notes: string | null
          patient_id: string
          status: string
        }
        Insert: {
          admission_number?: string
          admitted_at?: string
          attending_doctor_id?: string | null
          bed_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          discharged_at?: string | null
          hospital_id: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
        }
        Update: {
          admission_number?: string
          admitted_at?: string
          attending_doctor_id?: string | null
          bed_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          discharged_at?: string | null
          hospital_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_admissions_attending_doctor_id_fkey"
            columns: ["attending_doctor_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_admissions_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "hms_beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_admissions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_admissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_appointments: {
        Row: {
          appointment_at: string
          appointment_number: string
          appointment_type: string
          created_at: string
          created_by: string | null
          doctor_staff_id: string | null
          hospital_id: string
          id: string
          notes: string | null
          patient_id: string
          reason: string | null
          status: string
        }
        Insert: {
          appointment_at: string
          appointment_number?: string
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          doctor_staff_id?: string | null
          hospital_id: string
          id?: string
          notes?: string | null
          patient_id: string
          reason?: string | null
          status?: string
        }
        Update: {
          appointment_at?: string
          appointment_number?: string
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          doctor_staff_id?: string | null
          hospital_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_appointments_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          hospital_id: string
          id: number
          summary: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          hospital_id: string
          id?: never
          summary?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          hospital_id?: string
          id?: never
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_audit_log_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_beds: {
        Row: {
          bed_code: string
          bed_type: string
          created_at: string
          daily_rate: number
          hospital_id: string
          id: string
          notes: string | null
          status: string
          ward_name: string
        }
        Insert: {
          bed_code: string
          bed_type?: string
          created_at?: string
          daily_rate?: number
          hospital_id: string
          id?: string
          notes?: string | null
          status?: string
          ward_name: string
        }
        Update: {
          bed_code?: string
          bed_type?: string
          created_at?: string
          daily_rate?: number
          hospital_id?: string
          id?: string
          notes?: string | null
          status?: string
          ward_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_beds_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_bill_items: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          description: string
          hospital_id: string
          id: string
          item_type: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount?: number
          bill_id: string
          created_at?: string
          description: string
          hospital_id: string
          id?: string
          item_type?: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          description?: string
          hospital_id?: string
          id?: string
          item_type?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hms_bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "hms_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_bill_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_bills: {
        Row: {
          bill_date: string
          bill_number: string
          created_at: string
          created_by: string | null
          discount: number
          hospital_id: string
          id: string
          notes: string | null
          paid_amount: number
          patient_id: string | null
          payment_mode: string | null
          payment_reference: string | null
          registration_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
        }
        Insert: {
          bill_date?: string
          bill_number?: string
          created_at?: string
          created_by?: string | null
          discount?: number
          hospital_id: string
          id?: string
          notes?: string | null
          paid_amount?: number
          patient_id?: string | null
          payment_mode?: string | null
          payment_reference?: string | null
          registration_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
        }
        Update: {
          bill_date?: string
          bill_number?: string
          created_at?: string
          created_by?: string | null
          discount?: number
          hospital_id?: string
          id?: string
          notes?: string | null
          paid_amount?: number
          patient_id?: string | null
          payment_mode?: string | null
          payment_reference?: string | null
          registration_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "hms_bills_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_bills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_bills_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "hms_patient_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_clinical_records: {
        Row: {
          admission_id: string | null
          appointment_id: string | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          doctor_staff_id: string | null
          hospital_id: string
          id: string
          patient_id: string
          prescription: Json
          private_notes: string | null
          record_type: string
          recorded_at: string
          symptoms: string | null
          treatment_plan: string | null
          vitals: Json
        }
        Insert: {
          admission_id?: string | null
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_staff_id?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          prescription?: Json
          private_notes?: string | null
          record_type?: string
          recorded_at?: string
          symptoms?: string | null
          treatment_plan?: string | null
          vitals?: Json
        }
        Update: {
          admission_id?: string | null
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_staff_id?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          prescription?: Json
          private_notes?: string | null
          record_type?: string
          recorded_at?: string
          symptoms?: string | null
          treatment_plan?: string | null
          vitals?: Json
        }
        Relationships: [
          {
            foreignKeyName: "hms_clinical_records_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "hms_admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_clinical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "hms_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_clinical_records_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_clinical_records_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_clinical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_diagnostic_order_items: {
        Row: {
          completed_at: string | null
          created_at: string
          diagnostic_order_id: string
          hospital_id: string
          id: string
          instructions: string | null
          line_number: number
          reference_range: string | null
          result_flag: string | null
          result_notes: string | null
          result_unit: string | null
          result_value: string | null
          specimen: string | null
          status: string
          test_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          diagnostic_order_id: string
          hospital_id: string
          id?: string
          instructions?: string | null
          line_number?: number
          reference_range?: string | null
          result_flag?: string | null
          result_notes?: string | null
          result_unit?: string | null
          result_value?: string | null
          specimen?: string | null
          status?: string
          test_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          diagnostic_order_id?: string
          hospital_id?: string
          id?: string
          instructions?: string | null
          line_number?: number
          reference_range?: string | null
          result_flag?: string | null
          result_notes?: string | null
          result_unit?: string | null
          result_value?: string | null
          specimen?: string | null
          status?: string
          test_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_diagnostic_order_items_diagnostic_order_id_fkey"
            columns: ["diagnostic_order_id"]
            isOneToOne: false
            referencedRelation: "hms_diagnostic_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_diagnostic_order_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_diagnostic_orders: {
        Row: {
          clinical_notes: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          encounter_id: string
          hospital_id: string
          id: string
          order_number: string
          ordered_at: string
          ordered_by_staff_id: string | null
          patient_id: string
          priority: string
          status: string
        }
        Insert: {
          clinical_notes?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          encounter_id: string
          hospital_id: string
          id?: string
          order_number?: string
          ordered_at?: string
          ordered_by_staff_id?: string | null
          patient_id: string
          priority?: string
          status?: string
        }
        Update: {
          clinical_notes?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          encounter_id?: string
          hospital_id?: string
          id?: string
          order_number?: string
          ordered_at?: string
          ordered_by_staff_id?: string | null
          patient_id?: string
          priority?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_diagnostic_orders_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_diagnostic_orders_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_diagnostic_orders_ordered_by_staff_id_fkey"
            columns: ["ordered_by_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_diagnostic_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_discharge_summaries: {
        Row: {
          activity_advice: string | null
          admission_diagnosis: string | null
          admission_id: string
          admitted_at: string
          advice_on_discharge: string | null
          approved_at: string | null
          attending_doctor_id: string | null
          condition_at_discharge: string | null
          created_at: string
          diet_advice: string | null
          discharge_medications: Json
          discharge_notes: string | null
          discharge_number: string
          discharge_type: string
          discharged_at: string
          doctor_name_snapshot: string | null
          doctor_registration_number: string | null
          final_diagnosis: string
          follow_up_at: string | null
          follow_up_department: string | null
          hospital_course: string | null
          hospital_id: string
          id: string
          patient_id: string
          pending_reports: string | null
          prepared_by: string | null
          procedures_performed: string | null
          referred_to: string | null
          significant_findings: string | null
          status: string
          updated_at: string
          warning_signs: string | null
          wound_care_advice: string | null
        }
        Insert: {
          activity_advice?: string | null
          admission_diagnosis?: string | null
          admission_id: string
          admitted_at: string
          advice_on_discharge?: string | null
          approved_at?: string | null
          attending_doctor_id?: string | null
          condition_at_discharge?: string | null
          created_at?: string
          diet_advice?: string | null
          discharge_medications?: Json
          discharge_notes?: string | null
          discharge_number?: string
          discharge_type?: string
          discharged_at?: string
          doctor_name_snapshot?: string | null
          doctor_registration_number?: string | null
          final_diagnosis: string
          follow_up_at?: string | null
          follow_up_department?: string | null
          hospital_course?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          pending_reports?: string | null
          prepared_by?: string | null
          procedures_performed?: string | null
          referred_to?: string | null
          significant_findings?: string | null
          status?: string
          updated_at?: string
          warning_signs?: string | null
          wound_care_advice?: string | null
        }
        Update: {
          activity_advice?: string | null
          admission_diagnosis?: string | null
          admission_id?: string
          admitted_at?: string
          advice_on_discharge?: string | null
          approved_at?: string | null
          attending_doctor_id?: string | null
          condition_at_discharge?: string | null
          created_at?: string
          diet_advice?: string | null
          discharge_medications?: Json
          discharge_notes?: string | null
          discharge_number?: string
          discharge_type?: string
          discharged_at?: string
          doctor_name_snapshot?: string | null
          doctor_registration_number?: string | null
          final_diagnosis?: string
          follow_up_at?: string | null
          follow_up_department?: string | null
          hospital_course?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          pending_reports?: string | null
          prepared_by?: string | null
          procedures_performed?: string | null
          referred_to?: string | null
          significant_findings?: string | null
          status?: string
          updated_at?: string
          warning_signs?: string | null
          wound_care_advice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_discharge_summaries_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: true
            referencedRelation: "hms_admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_discharge_summaries_attending_doctor_id_fkey"
            columns: ["attending_doctor_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_discharge_summaries_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_discharge_summaries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_encounter_vitals: {
        Row: {
          age_years: number | null
          blood_glucose: number | null
          bp_diastolic: number | null
          bp_systolic: number | null
          consciousness: string | null
          created_at: string
          encounter_id: string
          height_cm: number | null
          hospital_id: string
          id: string
          notes: string | null
          pain_score: number | null
          patient_id: string
          pulse_bpm: number | null
          recorded_at: string
          recorded_by: string | null
          respiratory_rate: number | null
          spo2_percent: number | null
          temperature_c: number | null
          weight_kg: number | null
        }
        Insert: {
          age_years?: number | null
          blood_glucose?: number | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          consciousness?: string | null
          created_at?: string
          encounter_id: string
          height_cm?: number | null
          hospital_id: string
          id?: string
          notes?: string | null
          pain_score?: number | null
          patient_id: string
          pulse_bpm?: number | null
          recorded_at?: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          spo2_percent?: number | null
          temperature_c?: number | null
          weight_kg?: number | null
        }
        Update: {
          age_years?: number | null
          blood_glucose?: number | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          consciousness?: string | null
          created_at?: string
          encounter_id?: string
          height_cm?: number | null
          hospital_id?: string
          id?: string
          notes?: string | null
          pain_score?: number | null
          patient_id?: string
          pulse_bpm?: number | null
          recorded_at?: string
          recorded_by?: string | null
          respiratory_rate?: number | null
          spo2_percent?: number | null
          temperature_c?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_encounter_vitals_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounter_vitals_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounter_vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_encounters: {
        Row: {
          admission_id: string | null
          appointment_id: string | null
          arrived_at: string
          assigned_doctor_id: string | null
          called_at: string | null
          chief_complaint: string | null
          completed_at: string | null
          consultation_started_at: string | null
          created_at: string
          created_by: string | null
          department: string | null
          encounter_number: string
          encounter_type: string
          hospital_id: string
          id: string
          patient_id: string
          priority: string
          status: string
          token_id: string | null
          updated_at: string
        }
        Insert: {
          admission_id?: string | null
          appointment_id?: string | null
          arrived_at?: string
          assigned_doctor_id?: string | null
          called_at?: string | null
          chief_complaint?: string | null
          completed_at?: string | null
          consultation_started_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          encounter_number?: string
          encounter_type: string
          hospital_id: string
          id?: string
          patient_id: string
          priority?: string
          status?: string
          token_id?: string | null
          updated_at?: string
        }
        Update: {
          admission_id?: string | null
          appointment_id?: string | null
          arrived_at?: string
          assigned_doctor_id?: string | null
          called_at?: string | null
          chief_complaint?: string | null
          completed_at?: string | null
          consultation_started_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          encounter_number?: string
          encounter_type?: string
          hospital_id?: string
          id?: string
          patient_id?: string
          priority?: string
          status?: string
          token_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_encounters_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "hms_admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounters_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "hms_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounters_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounters_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounters_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_encounters_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "hms_queue_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_hospital_domains: {
        Row: {
          created_at: string
          dns_verified_at: string | null
          domain_status: string
          hospital_id: string
          id: string
          is_primary: boolean
          root_domain: string
          ssl_status: string
          subdomain: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dns_verified_at?: string | null
          domain_status?: string
          hospital_id: string
          id?: string
          is_primary?: boolean
          root_domain?: string
          ssl_status?: string
          subdomain: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dns_verified_at?: string | null
          domain_status?: string
          hospital_id?: string
          id?: string
          is_primary?: boolean
          root_domain?: string
          ssl_status?: string
          subdomain?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_hospital_domains_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_hospital_facilities: {
        Row: {
          configuration: Json
          created_at: string
          display_order: number
          facility_key: string
          facility_name: string
          hospital_id: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          display_order?: number
          facility_key: string
          facility_name: string
          hospital_id: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          display_order?: number
          facility_key?: string
          facility_name?: string
          hospital_id?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_hospital_facilities_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_hospital_portal_settings: {
        Row: {
          domain_status: string
          enabled_modules: Json
          generated_at: string
          homepage_config: Json
          hospital_id: string
          logo_url: string | null
          portal_status: string
          portal_title: string
          tagline: string | null
          theme_config: Json
          updated_at: string
        }
        Insert: {
          domain_status?: string
          enabled_modules?: Json
          generated_at?: string
          homepage_config?: Json
          hospital_id: string
          logo_url?: string | null
          portal_status?: string
          portal_title: string
          tagline?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Update: {
          domain_status?: string
          enabled_modules?: Json
          generated_at?: string
          homepage_config?: Json
          hospital_id?: string
          logo_url?: string | null
          portal_status?: string
          portal_title?: string
          tagline?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_hospital_portal_settings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: true
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_hospital_users: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          role: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_hospital_users_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_hospitals: {
        Row: {
          address: string | null
          created_at: string
          created_by: string
          district: string | null
          email: string | null
          emergency_phone: string | null
          facilities: Json
          hospital_code: string | null
          hospital_name: string
          hospital_type: string
          id: string
          logo_path: string | null
          logo_url: string | null
          phone: string | null
          pincode: string | null
          portal_domain: string | null
          portal_enabled: boolean
          portal_slug: string | null
          registration_fee: number
          registration_fee_status: string
          registration_number: string | null
          state: string
          status: string
          updated_at: string
          website_description: string | null
          website_published_at: string | null
          website_status: string
          website_theme: Json
          working_hours: Json
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string
          district?: string | null
          email?: string | null
          emergency_phone?: string | null
          facilities?: Json
          hospital_code?: string | null
          hospital_name: string
          hospital_type?: string
          id?: string
          logo_path?: string | null
          logo_url?: string | null
          phone?: string | null
          pincode?: string | null
          portal_domain?: string | null
          portal_enabled?: boolean
          portal_slug?: string | null
          registration_fee?: number
          registration_fee_status?: string
          registration_number?: string | null
          state?: string
          status?: string
          updated_at?: string
          website_description?: string | null
          website_published_at?: string | null
          website_status?: string
          website_theme?: Json
          working_hours?: Json
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string
          district?: string | null
          email?: string | null
          emergency_phone?: string | null
          facilities?: Json
          hospital_code?: string | null
          hospital_name?: string
          hospital_type?: string
          id?: string
          logo_path?: string | null
          logo_url?: string | null
          phone?: string | null
          pincode?: string | null
          portal_domain?: string | null
          portal_enabled?: boolean
          portal_slug?: string | null
          registration_fee?: number
          registration_fee_status?: string
          registration_number?: string | null
          state?: string
          status?: string
          updated_at?: string
          website_description?: string | null
          website_published_at?: string | null
          website_status?: string
          website_theme?: Json
          working_hours?: Json
        }
        Relationships: []
      }
      hms_inventory_transactions: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          item_id: string
          note: string | null
          performed_by: string | null
          quantity: number
          reference_number: string | null
          transaction_type: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          item_id: string
          note?: string | null
          performed_by?: string | null
          quantity: number
          reference_number?: string | null
          transaction_type: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          item_id?: string
          note?: string | null
          performed_by?: string | null
          quantity?: number
          reference_number?: string | null
          transaction_type?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hms_inventory_transactions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "hms_medical_items"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_medical_items: {
        Row: {
          batch_number: string | null
          category: string | null
          created_at: string
          expiry_date: string | null
          hospital_id: string
          id: string
          item_code: string
          item_name: string
          manufacturer: string | null
          purchase_price: number
          quantity: number
          reorder_level: number
          sale_price: number
          supplier_name: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          hospital_id: string
          id?: string
          item_code: string
          item_name: string
          manufacturer?: string | null
          purchase_price?: number
          quantity?: number
          reorder_level?: number
          sale_price?: number
          supplier_name?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          category?: string | null
          created_at?: string
          expiry_date?: string | null
          hospital_id?: string
          id?: string
          item_code?: string
          item_name?: string
          manufacturer?: string | null
          purchase_price?: number
          quantity?: number
          reorder_level?: number
          sale_price?: number
          supplier_name?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_medical_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_medication_administrations: {
        Row: {
          administered_at: string | null
          administered_by_staff_id: string | null
          created_at: string
          created_by: string | null
          dose: string | null
          encounter_id: string | null
          hospital_id: string
          id: string
          medicine_name: string
          notes: string | null
          patient_id: string
          prescription_item_id: string | null
          quantity: number
          reason: string | null
          route: string | null
          scheduled_at: string | null
          status: string
          total_cost: number
          unit_price: number
        }
        Insert: {
          administered_at?: string | null
          administered_by_staff_id?: string | null
          created_at?: string
          created_by?: string | null
          dose?: string | null
          encounter_id?: string | null
          hospital_id: string
          id?: string
          medicine_name: string
          notes?: string | null
          patient_id: string
          prescription_item_id?: string | null
          quantity?: number
          reason?: string | null
          route?: string | null
          scheduled_at?: string | null
          status?: string
          total_cost?: number
          unit_price?: number
        }
        Update: {
          administered_at?: string | null
          administered_by_staff_id?: string | null
          created_at?: string
          created_by?: string | null
          dose?: string | null
          encounter_id?: string | null
          hospital_id?: string
          id?: string
          medicine_name?: string
          notes?: string | null
          patient_id?: string
          prescription_item_id?: string | null
          quantity?: number
          reason?: string | null
          route?: string | null
          scheduled_at?: string | null
          status?: string
          total_cost?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hms_medication_administrations_administered_by_staff_id_fkey"
            columns: ["administered_by_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_medication_administrations_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_medication_administrations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_medication_administrations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_medication_administrations_prescription_item_id_fkey"
            columns: ["prescription_item_id"]
            isOneToOne: false
            referencedRelation: "hms_prescription_items"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_opd_visits: {
        Row: {
          allergies: string | null
          appointment_id: string | null
          chief_complaint: string | null
          consultation_fee: number
          created_at: string
          created_by: string | null
          department: string | null
          disposition: string
          doctor_staff_id: string | null
          examination_findings: string | null
          final_diagnosis: string | null
          follow_up_at: string | null
          history_of_present_illness: string | null
          hospital_id: string
          id: string
          investigations: Json
          medical_history: string | null
          notes: string | null
          opd_number: string
          patient_id: string
          prescription: Json
          provisional_diagnosis: string | null
          referral_notes: string | null
          registration_fee: number
          status: string
          symptoms: string | null
          treatment_advice: string | null
          updated_at: string
          visit_at: string
          vitals: Json
        }
        Insert: {
          allergies?: string | null
          appointment_id?: string | null
          chief_complaint?: string | null
          consultation_fee?: number
          created_at?: string
          created_by?: string | null
          department?: string | null
          disposition?: string
          doctor_staff_id?: string | null
          examination_findings?: string | null
          final_diagnosis?: string | null
          follow_up_at?: string | null
          history_of_present_illness?: string | null
          hospital_id: string
          id?: string
          investigations?: Json
          medical_history?: string | null
          notes?: string | null
          opd_number?: string
          patient_id: string
          prescription?: Json
          provisional_diagnosis?: string | null
          referral_notes?: string | null
          registration_fee?: number
          status?: string
          symptoms?: string | null
          treatment_advice?: string | null
          updated_at?: string
          visit_at?: string
          vitals?: Json
        }
        Update: {
          allergies?: string | null
          appointment_id?: string | null
          chief_complaint?: string | null
          consultation_fee?: number
          created_at?: string
          created_by?: string | null
          department?: string | null
          disposition?: string
          doctor_staff_id?: string | null
          examination_findings?: string | null
          final_diagnosis?: string | null
          follow_up_at?: string | null
          history_of_present_illness?: string | null
          hospital_id?: string
          id?: string
          investigations?: Json
          medical_history?: string | null
          notes?: string | null
          opd_number?: string
          patient_id?: string
          prescription?: Json
          provisional_diagnosis?: string | null
          referral_notes?: string | null
          registration_fee?: number
          status?: string
          symptoms?: string | null
          treatment_advice?: string | null
          updated_at?: string
          visit_at?: string
          vitals?: Json
        }
        Relationships: [
          {
            foreignKeyName: "hms_opd_visits_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "hms_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_opd_visits_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_opd_visits_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_opd_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_patient_medication_logs: {
        Row: {
          created_at: string
          dose: string | null
          hospital_id: string
          id: string
          logged_by_auth_user_id: string
          medication_name: string
          notes: string | null
          patient_id: string
          price_paid: number
          quantity: number
          reason: string | null
          route: string | null
          scheduled_at: string | null
          taken_at: string | null
          taken_status: string
        }
        Insert: {
          created_at?: string
          dose?: string | null
          hospital_id: string
          id?: string
          logged_by_auth_user_id: string
          medication_name: string
          notes?: string | null
          patient_id: string
          price_paid?: number
          quantity?: number
          reason?: string | null
          route?: string | null
          scheduled_at?: string | null
          taken_at?: string | null
          taken_status?: string
        }
        Update: {
          created_at?: string
          dose?: string | null
          hospital_id?: string
          id?: string
          logged_by_auth_user_id?: string
          medication_name?: string
          notes?: string | null
          patient_id?: string
          price_paid?: number
          quantity?: number
          reason?: string | null
          route?: string | null
          scheduled_at?: string | null
          taken_at?: string | null
          taken_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_patient_medication_logs_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_patient_medication_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_patient_registrations: {
        Row: {
          created_at: string
          created_by: string | null
          fee_status: string
          hospital_id: string
          id: string
          patient_id: string
          registration_date: string
          registration_fee: number
          registration_number: string
          registration_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fee_status?: string
          hospital_id: string
          id?: string
          patient_id: string
          registration_date?: string
          registration_fee?: number
          registration_number?: string
          registration_type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fee_status?: string
          hospital_id?: string
          id?: string
          patient_id?: string
          registration_date?: string
          registration_fee?: number
          registration_number?: string
          registration_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_patient_registrations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_patient_registrations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_patient_users: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          linked_by: string | null
          patient_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          linked_by?: string | null
          patient_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          linked_by?: string | null
          patient_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_patient_users_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_patient_users_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_patients: {
        Row: {
          address: string | null
          blood_group: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          full_name: string
          gender: string | null
          hospital_id: string
          id: string
          patient_code: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name: string
          gender?: string | null
          hospital_id: string
          id?: string
          patient_code?: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name?: string
          gender?: string | null
          hospital_id?: string
          id?: string
          patient_code?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_patients_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_payments: {
        Row: {
          amount: number
          bill_id: string | null
          created_at: string
          hospital_id: string
          id: string
          notes: string | null
          patient_id: string | null
          payment_mode: string
          payment_number: string
          received_at: string
          received_by: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          bill_id?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          payment_mode: string
          payment_number?: string
          received_at?: string
          received_by?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          payment_mode?: string
          payment_number?: string
          received_at?: string
          received_by?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "hms_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_payments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_prescription_items: {
        Row: {
          created_at: string
          dosage: string | null
          duration_unit: string | null
          duration_value: number | null
          frequency: string | null
          hospital_id: string
          id: string
          instructions: string | null
          is_prn: boolean
          line_number: number
          medicine_name: string
          prescription_id: string
          quantity: number | null
          route: string | null
          strength: string | null
          timing: string | null
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          duration_unit?: string | null
          duration_value?: number | null
          frequency?: string | null
          hospital_id: string
          id?: string
          instructions?: string | null
          is_prn?: boolean
          line_number?: number
          medicine_name: string
          prescription_id: string
          quantity?: number | null
          route?: string | null
          strength?: string | null
          timing?: string | null
        }
        Update: {
          created_at?: string
          dosage?: string | null
          duration_unit?: string | null
          duration_value?: number | null
          frequency?: string | null
          hospital_id?: string
          id?: string
          instructions?: string | null
          is_prn?: boolean
          line_number?: number
          medicine_name?: string
          prescription_id?: string
          quantity?: number | null
          route?: string | null
          strength?: string | null
          timing?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_prescription_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "hms_prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_prescriptions: {
        Row: {
          advice: string | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          doctor_staff_id: string
          encounter_id: string
          follow_up_at: string | null
          hospital_id: string
          id: string
          patient_id: string
          prescription_number: string
          signed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          advice?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_staff_id: string
          encounter_id: string
          follow_up_at?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          prescription_number?: string
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          advice?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_staff_id?: string
          encounter_id?: string
          follow_up_at?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          prescription_number?: string
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_prescriptions_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_prescriptions_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_prescriptions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_procedure_order_items: {
        Row: {
          created_at: string
          dose: string | null
          hospital_id: string
          id: string
          instructions: string | null
          item_name: string
          line_number: number
          procedure_order_id: string
          quantity: number | null
          route: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          dose?: string | null
          hospital_id: string
          id?: string
          instructions?: string | null
          item_name: string
          line_number?: number
          procedure_order_id: string
          quantity?: number | null
          route?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          dose?: string | null
          hospital_id?: string
          id?: string
          instructions?: string | null
          item_name?: string
          line_number?: number
          procedure_order_id?: string
          quantity?: number | null
          route?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hms_procedure_order_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_procedure_order_items_procedure_order_id_fkey"
            columns: ["procedure_order_id"]
            isOneToOne: false
            referencedRelation: "hms_procedure_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_procedure_orders: {
        Row: {
          administered_at: string | null
          administered_by: string | null
          clinical_indication: string | null
          consent_recorded: boolean
          created_at: string
          created_by: string | null
          dose: string | null
          encounter_id: string
          expiry_date: string | null
          hospital_id: string
          id: string
          lot_number: string | null
          manufacturer: string | null
          notes: string | null
          order_number: string
          ordered_at: string
          ordered_by_staff_id: string | null
          patient_id: string
          procedure_type: string
          reaction_notes: string | null
          route: string | null
          site: string | null
          status: string
        }
        Insert: {
          administered_at?: string | null
          administered_by?: string | null
          clinical_indication?: string | null
          consent_recorded?: boolean
          created_at?: string
          created_by?: string | null
          dose?: string | null
          encounter_id: string
          expiry_date?: string | null
          hospital_id: string
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          notes?: string | null
          order_number?: string
          ordered_at?: string
          ordered_by_staff_id?: string | null
          patient_id: string
          procedure_type: string
          reaction_notes?: string | null
          route?: string | null
          site?: string | null
          status?: string
        }
        Update: {
          administered_at?: string | null
          administered_by?: string | null
          clinical_indication?: string | null
          consent_recorded?: boolean
          created_at?: string
          created_by?: string | null
          dose?: string | null
          encounter_id?: string
          expiry_date?: string | null
          hospital_id?: string
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          notes?: string | null
          order_number?: string
          ordered_at?: string
          ordered_by_staff_id?: string | null
          patient_id?: string
          procedure_type?: string
          reaction_notes?: string | null
          route?: string | null
          site?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_procedure_orders_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_procedure_orders_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_procedure_orders_ordered_by_staff_id_fkey"
            columns: ["ordered_by_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_procedure_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_queue_tokens: {
        Row: {
          called_at: string | null
          completed_at: string | null
          created_at: string
          department: string | null
          doctor_staff_id: string | null
          encounter_id: string
          encounter_type: string
          hospital_id: string
          id: string
          issued_at: string
          issued_by: string | null
          patient_id: string
          status: string
          token_date: string
          token_label: string
          token_number: number
        }
        Insert: {
          called_at?: string | null
          completed_at?: string | null
          created_at?: string
          department?: string | null
          doctor_staff_id?: string | null
          encounter_id: string
          encounter_type: string
          hospital_id: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          patient_id: string
          status?: string
          token_date?: string
          token_label: string
          token_number: number
        }
        Update: {
          called_at?: string | null
          completed_at?: string | null
          created_at?: string
          department?: string | null
          doctor_staff_id?: string | null
          encounter_id?: string
          encounter_type?: string
          hospital_id?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          patient_id?: string
          status?: string
          token_date?: string
          token_label?: string
          token_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "hms_queue_tokens_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_queue_tokens_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: true
            referencedRelation: "hms_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_queue_tokens_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_queue_tokens_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_staff: {
        Row: {
          auth_user_id: string | null
          base_salary: number
          created_at: string
          department: string | null
          email: string | null
          employment_status: string
          full_name: string
          hospital_id: string
          id: string
          joining_date: string | null
          phone: string | null
          role_title: string
          sbpf_member_id: string | null
          staff_code: string
        }
        Insert: {
          auth_user_id?: string | null
          base_salary?: number
          created_at?: string
          department?: string | null
          email?: string | null
          employment_status?: string
          full_name: string
          hospital_id: string
          id?: string
          joining_date?: string | null
          phone?: string | null
          role_title: string
          sbpf_member_id?: string | null
          staff_code: string
        }
        Update: {
          auth_user_id?: string | null
          base_salary?: number
          created_at?: string
          department?: string | null
          email?: string | null
          employment_status?: string
          full_name?: string
          hospital_id?: string
          id?: string
          joining_date?: string | null
          phone?: string | null
          role_title?: string
          sbpf_member_id?: string | null
          staff_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_staff_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_staff_sbpf_member_id_fkey"
            columns: ["sbpf_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_id"]
          },
        ]
      }
      hms_staff_attendance: {
        Row: {
          attendance_date: string
          check_in: string | null
          check_out: string | null
          created_at: string
          hospital_id: string
          id: string
          marked_by: string | null
          note: string | null
          staff_id: string
          status: string
        }
        Insert: {
          attendance_date?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          marked_by?: string | null
          note?: string | null
          staff_id: string
          status?: string
        }
        Update: {
          attendance_date?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          marked_by?: string | null
          note?: string | null
          staff_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_staff_attendance_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_staff_leaves: {
        Row: {
          created_at: string
          end_date: string
          hospital_id: string
          id: string
          leave_type: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          staff_id: string
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string
          end_date: string
          hospital_id: string
          id?: string
          leave_type?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          staff_id: string
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          hospital_id?: string
          id?: string
          leave_type?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          staff_id?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_staff_leaves_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_staff_leaves_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_staff_letters: {
        Row: {
          content: string | null
          created_at: string
          designation: string | null
          hospital_id: string
          id: string
          issue_date: string
          issued_by: string | null
          joining_date: string | null
          last_working_date: string | null
          letter_number: string | null
          letter_type: string
          staff_id: string
          status: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          designation?: string | null
          hospital_id: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          joining_date?: string | null
          last_working_date?: string | null
          letter_number?: string | null
          letter_type: string
          staff_id: string
          status?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          designation?: string | null
          hospital_id?: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          joining_date?: string | null
          last_working_date?: string | null
          letter_number?: string | null
          letter_type?: string
          staff_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_staff_letters_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_staff_letters_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_staff_salary: {
        Row: {
          allowances: number
          base_salary: number
          created_at: string
          deductions: number
          hospital_id: string
          id: string
          net_salary: number | null
          notes: string | null
          paid_amount: number
          paid_at: string | null
          payment_reference: string | null
          processed_by: string | null
          salary_month: string
          staff_id: string
          status: string
        }
        Insert: {
          allowances?: number
          base_salary?: number
          created_at?: string
          deductions?: number
          hospital_id: string
          id?: string
          net_salary?: number | null
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          salary_month: string
          staff_id: string
          status?: string
        }
        Update: {
          allowances?: number
          base_salary?: number
          created_at?: string
          deductions?: number
          hospital_id?: string
          id?: string
          net_salary?: number | null
          notes?: string | null
          paid_amount?: number
          paid_at?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          salary_month?: string
          staff_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_staff_salary_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_staff_salary_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_teleconsultation_messages: {
        Row: {
          consultation_id: string
          created_at: string
          id: string
          message_text: string
          sender_auth_user_id: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          id?: string
          message_text: string
          sender_auth_user_id: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          id?: string
          message_text?: string
          sender_auth_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_teleconsultation_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "hms_teleconsultations"
            referencedColumns: ["id"]
          },
        ]
      }
      hms_teleconsultations: {
        Row: {
          channel: string
          created_at: string
          created_by: string
          doctor_staff_id: string
          ended_at: string | null
          hospital_id: string
          id: string
          join_url: string | null
          patient_consent_at: string | null
          patient_id: string
          reason: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          created_by: string
          doctor_staff_id: string
          ended_at?: string | null
          hospital_id: string
          id?: string
          join_url?: string | null
          patient_consent_at?: string | null
          patient_id: string
          reason?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string
          created_by?: string
          doctor_staff_id?: string
          ended_at?: string | null
          hospital_id?: string
          id?: string
          join_url?: string | null
          patient_consent_at?: string | null
          patient_id?: string
          reason?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hms_teleconsultations_doctor_staff_id_fkey"
            columns: ["doctor_staff_id"]
            isOneToOne: false
            referencedRelation: "hms_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_teleconsultations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hms_teleconsultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "hms_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      india_state_ut_directory: {
        Row: {
          code: string
          display_order: number
          is_active: boolean
          name_en: string
          name_hi: string
          region_type: string
        }
        Insert: {
          code: string
          display_order: number
          is_active?: boolean
          name_en: string
          name_hi: string
          region_type: string
        }
        Update: {
          code?: string
          display_order?: number
          is_active?: boolean
          name_en?: string
          name_hi?: string
          region_type?: string
        }
        Relationships: []
      }
      media_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media_download_assets: {
        Row: {
          asset_type: string
          created_at: string
          duration_seconds: number | null
          file_name: string
          format: string
          id: string
          job_id: string
          metadata: Json
          mime_type: string
          quality: string
          resolution: string | null
          size_bytes: number | null
          status: string
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_type: string
          created_at?: string
          duration_seconds?: number | null
          file_name: string
          format: string
          id?: string
          job_id: string
          metadata?: Json
          mime_type: string
          quality?: string
          resolution?: string | null
          size_bytes?: number | null
          status?: string
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          duration_seconds?: number | null
          file_name?: string
          format?: string
          id?: string
          job_id?: string
          metadata?: Json
          mime_type?: string
          quality?: string
          resolution?: string | null
          size_bytes?: number | null
          status?: string
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_download_assets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "media_download_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      media_download_jobs: {
        Row: {
          available_formats: Json
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          id: string
          media_type: string
          metadata: Json
          output_audio_url: string | null
          output_file_name: string | null
          output_mime_type: string | null
          output_size_bytes: number | null
          output_storage_path: string | null
          output_video_url: string | null
          processor_job_id: string | null
          quality: string
          rights_confirmed: boolean
          source_platform: string | null
          source_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          available_formats?: Json
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          media_type: string
          metadata?: Json
          output_audio_url?: string | null
          output_file_name?: string | null
          output_mime_type?: string | null
          output_size_bytes?: number | null
          output_storage_path?: string | null
          output_video_url?: string | null
          processor_job_id?: string | null
          quality?: string
          rights_confirmed?: boolean
          source_platform?: string | null
          source_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          available_formats?: Json
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          media_type?: string
          metadata?: Json
          output_audio_url?: string | null
          output_file_name?: string | null
          output_mime_type?: string | null
          output_size_bytes?: number | null
          output_storage_path?: string | null
          output_video_url?: string | null
          processor_job_id?: string | null
          quality?: string
          rights_confirmed?: boolean
          source_platform?: string | null
          source_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_journalists: {
        Row: {
          created_at: string
          designation: string | null
          district: string | null
          email: string | null
          full_name: string
          id: number
          mobile: string | null
          profile_photo_url: string | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          designation?: string | null
          district?: string | null
          email?: string | null
          full_name: string
          id?: number
          mobile?: string | null
          profile_photo_url?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          designation?: string | null
          district?: string | null
          email?: string | null
          full_name?: string
          id?: number
          mobile?: string | null
          profile_photo_url?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_posts: {
        Row: {
          author_id: string | null
          category_id: number | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: number
          journalist_id: number | null
          media_type: string
          media_url: string | null
          published_at: string | null
          review_reason: string | null
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          sort_order: number
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: number | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: number
          journalist_id?: number | null
          media_type?: string
          media_url?: string | null
          published_at?: string | null
          review_reason?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: number | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: number
          journalist_id?: number | null
          media_type?: string
          media_url?: string | null
          published_at?: string | null
          review_reason?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          sort_order?: number
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "media_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_posts_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "media_journalists"
            referencedColumns: ["id"]
          },
        ]
      }
      member_certificates: {
        Row: {
          certificate_number: string
          certificate_status: string
          certificate_type: string
          created_at: string
          id: number
          issued_at: string | null
          member_id: string
          revoked_at: string | null
          user_id: string
          verification_token: string
        }
        Insert: {
          certificate_number: string
          certificate_status?: string
          certificate_type?: string
          created_at?: string
          id?: number
          issued_at?: string | null
          member_id: string
          revoked_at?: string | null
          user_id: string
          verification_token?: string
        }
        Update: {
          certificate_number?: string
          certificate_status?: string
          certificate_type?: string
          created_at?: string
          id?: number
          issued_at?: string | null
          member_id?: string
          revoked_at?: string | null
          user_id?: string
          verification_token?: string
        }
        Relationships: []
      }
      member_family_documents: {
        Row: {
          consent_confirmed: boolean
          created_at: string
          created_by: string
          document_category: string
          document_label: string
          expiry_date: string | null
          family_id: number
          family_member_id: number | null
          file_size_bytes: number | null
          id: number
          issue_date: string | null
          mime_type: string | null
          storage_path: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string
          document_category: string
          document_label: string
          expiry_date?: string | null
          family_id: number
          family_member_id?: number | null
          file_size_bytes?: number | null
          id?: number
          issue_date?: string | null
          mime_type?: string | null
          storage_path: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string
          document_category?: string
          document_label?: string
          expiry_date?: string | null
          family_id?: number
          family_member_id?: number | null
          file_size_bytes?: number | null
          id?: number
          issue_date?: string | null
          mime_type?: string | null
          storage_path?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_family_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_family_documents_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_family_education: {
        Row: {
          board_or_university: string | null
          class_or_course: string | null
          completion_year: number | null
          created_at: string
          created_by: string
          currently_studying: boolean
          education_level: string | null
          enrollment_year: number | null
          family_id: number
          family_member_id: number
          id: number
          institution_name: string | null
          institution_type: string | null
          result_or_grade: string | null
          scholarship_details: string | null
          scholarship_needed: boolean
          skill_training: string | null
          stream_or_subject: string | null
          supporting_document_path: string | null
          updated_at: string
        }
        Insert: {
          board_or_university?: string | null
          class_or_course?: string | null
          completion_year?: number | null
          created_at?: string
          created_by?: string
          currently_studying?: boolean
          education_level?: string | null
          enrollment_year?: number | null
          family_id: number
          family_member_id: number
          id?: number
          institution_name?: string | null
          institution_type?: string | null
          result_or_grade?: string | null
          scholarship_details?: string | null
          scholarship_needed?: boolean
          skill_training?: string | null
          stream_or_subject?: string | null
          supporting_document_path?: string | null
          updated_at?: string
        }
        Update: {
          board_or_university?: string | null
          class_or_course?: string | null
          completion_year?: number | null
          created_at?: string
          created_by?: string
          currently_studying?: boolean
          education_level?: string | null
          enrollment_year?: number | null
          family_id?: number
          family_member_id?: number
          id?: number
          institution_name?: string | null
          institution_type?: string | null
          result_or_grade?: string | null
          scholarship_details?: string | null
          scholarship_needed?: boolean
          skill_training?: string | null
          stream_or_subject?: string | null
          supporting_document_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_family_education_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_family_education_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_family_income_work: {
        Row: {
          annual_income: number | null
          created_at: string
          created_by: string
          employer_or_business: string | null
          employment_status: string | null
          family_id: number
          family_member_id: number | null
          id: number
          income_document_path: string | null
          income_source: string | null
          job_seeking: boolean
          monthly_income: number | null
          occupation: string | null
          record_from: string | null
          record_to: string | null
          record_type: string
          self_employment_support_needed: boolean
          skills: string[] | null
          training_or_certification: string | null
          updated_at: string
          work_experience_details: string | null
          work_experience_years: number | null
        }
        Insert: {
          annual_income?: number | null
          created_at?: string
          created_by?: string
          employer_or_business?: string | null
          employment_status?: string | null
          family_id: number
          family_member_id?: number | null
          id?: number
          income_document_path?: string | null
          income_source?: string | null
          job_seeking?: boolean
          monthly_income?: number | null
          occupation?: string | null
          record_from?: string | null
          record_to?: string | null
          record_type?: string
          self_employment_support_needed?: boolean
          skills?: string[] | null
          training_or_certification?: string | null
          updated_at?: string
          work_experience_details?: string | null
          work_experience_years?: number | null
        }
        Update: {
          annual_income?: number | null
          created_at?: string
          created_by?: string
          employer_or_business?: string | null
          employment_status?: string | null
          family_id?: number
          family_member_id?: number | null
          id?: number
          income_document_path?: string | null
          income_source?: string | null
          job_seeking?: boolean
          monthly_income?: number | null
          occupation?: string | null
          record_from?: string | null
          record_to?: string | null
          record_type?: string
          self_employment_support_needed?: boolean
          skills?: string[] | null
          training_or_certification?: string | null
          updated_at?: string
          work_experience_details?: string | null
          work_experience_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_family_income_work_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_family_income_work_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_family_medical: {
        Row: {
          allergy_notes: string | null
          condition_or_need: string | null
          consent_confirmed: boolean
          created_at: string
          created_by: string
          disability_support: boolean
          disability_type: string | null
          document_path: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          family_id: number
          family_member_id: number
          id: number
          insurance_type: string | null
          insurance_valid_until: string | null
          ongoing_treatment: boolean
          preferred_facility: string | null
          record_type: string
          treatment_notes: string | null
          updated_at: string
        }
        Insert: {
          allergy_notes?: string | null
          condition_or_need?: string | null
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string
          disability_support?: boolean
          disability_type?: string | null
          document_path?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_id: number
          family_member_id: number
          id?: number
          insurance_type?: string | null
          insurance_valid_until?: string | null
          ongoing_treatment?: boolean
          preferred_facility?: string | null
          record_type?: string
          treatment_notes?: string | null
          updated_at?: string
        }
        Update: {
          allergy_notes?: string | null
          condition_or_need?: string | null
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string
          disability_support?: boolean
          disability_type?: string | null
          document_path?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_id?: number
          family_member_id?: number
          id?: number
          insurance_type?: string | null
          insurance_valid_until?: string | null
          ongoing_treatment?: boolean
          preferred_facility?: string | null
          record_type?: string
          treatment_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_family_medical_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_family_medical_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_login_attempts: {
        Row: {
          attempted_at: string
          id: number
          identifier_hash: string
          ip_hash: string
        }
        Insert: {
          attempted_at?: string
          id?: number
          identifier_hash: string
          ip_hash: string
        }
        Update: {
          attempted_at?: string
          id?: number
          identifier_hash?: string
          ip_hash?: string
        }
        Relationships: []
      }
      member_pariwar_members: {
        Row: {
          created_at: string
          current_class_course: string | null
          disability_support_notes: string | null
          dob: string | null
          education: string | null
          education_data_consent: boolean
          education_status: string | null
          employment_status: string | null
          family_id: number
          full_name: string
          gender: string | null
          has_disability: boolean
          health_data_consent: boolean
          health_support_notes: string | null
          highest_qualification: string | null
          id: number
          income_source: string | null
          institution_district: string | null
          institution_name: string | null
          is_dependent: boolean
          is_student: boolean
          linked_member_row_id: number | null
          marital_status: string | null
          member_row_id: number | null
          mobile: string | null
          monthly_income: number | null
          occupation: string | null
          relation_to_head: string
          skills: string[] | null
        }
        Insert: {
          created_at?: string
          current_class_course?: string | null
          disability_support_notes?: string | null
          dob?: string | null
          education?: string | null
          education_data_consent?: boolean
          education_status?: string | null
          employment_status?: string | null
          family_id: number
          full_name: string
          gender?: string | null
          has_disability?: boolean
          health_data_consent?: boolean
          health_support_notes?: string | null
          highest_qualification?: string | null
          id?: number
          income_source?: string | null
          institution_district?: string | null
          institution_name?: string | null
          is_dependent?: boolean
          is_student?: boolean
          linked_member_row_id?: number | null
          marital_status?: string | null
          member_row_id?: number | null
          mobile?: string | null
          monthly_income?: number | null
          occupation?: string | null
          relation_to_head: string
          skills?: string[] | null
        }
        Update: {
          created_at?: string
          current_class_course?: string | null
          disability_support_notes?: string | null
          dob?: string | null
          education?: string | null
          education_data_consent?: boolean
          education_status?: string | null
          employment_status?: string | null
          family_id?: number
          full_name?: string
          gender?: string | null
          has_disability?: boolean
          health_data_consent?: boolean
          health_support_notes?: string | null
          highest_qualification?: string | null
          id?: number
          income_source?: string | null
          institution_district?: string | null
          institution_name?: string | null
          is_dependent?: boolean
          is_student?: boolean
          linked_member_row_id?: number | null
          marital_status?: string | null
          member_row_id?: number | null
          mobile?: string | null
          monthly_income?: number | null
          occupation?: string | null
          relation_to_head?: string
          skills?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "member_pariwar_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "member_pariwar_register"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_pariwar_members_linked_member_row_id_fkey"
            columns: ["linked_member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_pariwar_members_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_pariwar_register: {
        Row: {
          accuracy_confirmed: boolean
          address: string | null
          admin_review_note: string | null
          annual_income: number | null
          consent_education_data: boolean
          consent_health_data: boolean
          consent_income_data: boolean
          consent_scheme_matching: boolean
          created_at: string
          created_by: string
          district: string | null
          education_support_needed: boolean
          employment_status: string | null
          family_code: string | null
          family_name: string
          family_needs: string[]
          family_size: number | null
          head_member_row_id: number
          housing_status: string | null
          id: number
          land_ownership: string | null
          livelihood_support_needed: boolean
          livelihood_type: string | null
          medical_support_needed: boolean
          member_row_id: number | null
          mobile: string | null
          notes: string | null
          pincode: string | null
          ration_card_type: string | null
          scheme_assistance_consent: boolean
          social_category: string | null
          state: string
          status: string
          submitted_at: string | null
          updated_at: string
          village_or_ward: string | null
        }
        Insert: {
          accuracy_confirmed?: boolean
          address?: string | null
          admin_review_note?: string | null
          annual_income?: number | null
          consent_education_data?: boolean
          consent_health_data?: boolean
          consent_income_data?: boolean
          consent_scheme_matching?: boolean
          created_at?: string
          created_by?: string
          district?: string | null
          education_support_needed?: boolean
          employment_status?: string | null
          family_code?: string | null
          family_name: string
          family_needs?: string[]
          family_size?: number | null
          head_member_row_id: number
          housing_status?: string | null
          id?: number
          land_ownership?: string | null
          livelihood_support_needed?: boolean
          livelihood_type?: string | null
          medical_support_needed?: boolean
          member_row_id?: number | null
          mobile?: string | null
          notes?: string | null
          pincode?: string | null
          ration_card_type?: string | null
          scheme_assistance_consent?: boolean
          social_category?: string | null
          state?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          village_or_ward?: string | null
        }
        Update: {
          accuracy_confirmed?: boolean
          address?: string | null
          admin_review_note?: string | null
          annual_income?: number | null
          consent_education_data?: boolean
          consent_health_data?: boolean
          consent_income_data?: boolean
          consent_scheme_matching?: boolean
          created_at?: string
          created_by?: string
          district?: string | null
          education_support_needed?: boolean
          employment_status?: string | null
          family_code?: string | null
          family_name?: string
          family_needs?: string[]
          family_size?: number | null
          head_member_row_id?: number
          housing_status?: string | null
          id?: number
          land_ownership?: string | null
          livelihood_support_needed?: boolean
          livelihood_type?: string | null
          medical_support_needed?: boolean
          member_row_id?: number | null
          mobile?: string | null
          notes?: string | null
          pincode?: string | null
          ration_card_type?: string | null
          scheme_assistance_consent?: boolean
          social_category?: string | null
          state?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
          village_or_ward?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_pariwar_register_head_member_row_id_fkey"
            columns: ["head_member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_pariwar_register_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_public_links: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          membership_id: number
          public_token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          membership_id: number
          public_token?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          membership_id?: number
          public_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_public_links_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: true
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      member_signup_popup_templates: {
        Row: {
          close_label: string
          continue_label: string
          intro_hi: string
          is_active: boolean
          login_id_label: string
          member_id_label: string
          password_label: string
          security_note_hi: string
          template_key: string
          title_hi: string
          updated_at: string
        }
        Insert: {
          close_label?: string
          continue_label?: string
          intro_hi?: string
          is_active?: boolean
          login_id_label?: string
          member_id_label?: string
          password_label?: string
          security_note_hi?: string
          template_key: string
          title_hi?: string
          updated_at?: string
        }
        Update: {
          close_label?: string
          continue_label?: string
          intro_hi?: string
          is_active?: boolean
          login_id_label?: string
          member_id_label?: string
          password_label?: string
          security_note_hi?: string
          template_key?: string
          title_hi?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        Insert: {
          aadhaar_document_path?: string | null
          aadhaar_number?: string | null
          address?: string | null
          country?: string
          created_at?: string | null
          designation?: string | null
          district?: string | null
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name: string
          gender?: string | null
          id?: number
          kyc_rejection_reason?: string | null
          kyc_status?: string
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          member_id?: string | null
          membership_end_date?: string | null
          membership_fee?: number
          membership_start_date?: string | null
          membership_status?: string | null
          mobile: string
          pan_document_path?: string | null
          pan_number?: string | null
          payment_status?: string
          pincode?: string | null
          profile_completed?: boolean
          profile_completed_at?: string | null
          profile_photo_path?: string | null
          qr_token?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          referred_by_code?: string | null
          state?: string | null
          status?: string | null
          user_id?: string | null
          verification_token?: string | null
          verification_url?: string | null
          work_area_id?: number | null
        }
        Update: {
          aadhaar_document_path?: string | null
          aadhaar_number?: string | null
          address?: string | null
          country?: string
          created_at?: string | null
          designation?: string | null
          district?: string | null
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: number
          kyc_rejection_reason?: string | null
          kyc_status?: string
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          member_id?: string | null
          membership_end_date?: string | null
          membership_fee?: number
          membership_start_date?: string | null
          membership_status?: string | null
          mobile?: string
          pan_document_path?: string | null
          pan_number?: string | null
          payment_status?: string
          pincode?: string | null
          profile_completed?: boolean
          profile_completed_at?: string | null
          profile_photo_path?: string | null
          qr_token?: string | null
          referral_code?: string | null
          referral_link?: string | null
          referred_by?: string | null
          referred_by_code?: string | null
          state?: string | null
          status?: string | null
          user_id?: string | null
          verification_token?: string | null
          verification_url?: string | null
          work_area_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "members_work_area_id_fkey"
            columns: ["work_area_id"]
            isOneToOne: false
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      Members: {
        Row: {
          address: string | null
          created_at: string
          district: string | null
          dob: string | null
          email: string | null
          expiry_date: string | null
          father_name: string | null
          gender: string | null
          id: number
          id_proof_url: string | null
          member_status: string | null
          membership_date: string | null
          membership_no: string | null
          membership_type: string | null
          mobile: string | null
          name: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          photo_url: string | null
          pincode: string | null
          referral_code: string | null
          state: string | null
          verification_token: string
          village_city: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          email?: string | null
          expiry_date?: string | null
          father_name?: string | null
          gender?: string | null
          id?: number
          id_proof_url?: string | null
          member_status?: string | null
          membership_date?: string | null
          membership_no?: string | null
          membership_type?: string | null
          mobile?: string | null
          name?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          photo_url?: string | null
          pincode?: string | null
          referral_code?: string | null
          state?: string | null
          verification_token?: string
          village_city?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          district?: string | null
          dob?: string | null
          email?: string | null
          expiry_date?: string | null
          father_name?: string | null
          gender?: string | null
          id?: number
          id_proof_url?: string | null
          member_status?: string | null
          membership_date?: string | null
          membership_no?: string | null
          membership_type?: string | null
          mobile?: string | null
          name?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          photo_url?: string | null
          pincode?: string | null
          referral_code?: string | null
          state?: string | null
          verification_token?: string
          village_city?: string | null
        }
        Relationships: []
      }
      membership_payments: {
        Row: {
          amount: number
          billing_interval: string | null
          created_at: string
          currency: string
          gateway: string
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: number
          member_id: string
          order_id: string
          paid_at: string | null
          plan_code: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          billing_interval?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: number
          member_id: string
          order_id: string
          paid_at?: string | null
          plan_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_interval?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: number
          member_id?: string
          order_id?: string
          paid_at?: string | null
          plan_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_payments_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["code"]
          },
        ]
      }
      membership_plans: {
        Row: {
          amount: number
          autopay_supported: boolean
          billing_interval: string
          code: string
          created_at: string
          duration_days: number
          gateway: string
          interval_count: number
          is_active: boolean
          name: string
          public_visible: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          autopay_supported?: boolean
          billing_interval: string
          code: string
          created_at?: string
          duration_days: number
          gateway?: string
          interval_count?: number
          is_active?: boolean
          name: string
          public_visible?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          autopay_supported?: boolean
          billing_interval?: string
          code?: string
          created_at?: string
          duration_days?: number
          gateway?: string
          interval_count?: number
          is_active?: boolean
          name?: string
          public_visible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          amount: number | null
          billing_interval: string | null
          created_at: string | null
          expiry_date: string | null
          id: number
          membership_number: string | null
          pincode: string | null
          plan_code: string | null
          public_enabled: boolean
          public_token: string | null
          start_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          billing_interval?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          membership_number?: string | null
          pincode?: string | null
          plan_code?: string | null
          public_enabled?: boolean
          public_token?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          billing_interval?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          membership_number?: string | null
          pincode?: string | null
          plan_code?: string | null
          public_enabled?: boolean
          public_token?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: number
          image_url: string | null
          published: boolean | null
          title: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          published?: boolean | null
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          published?: boolean | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prarthana_departments: {
        Row: {
          created_at: string
          department_code: string
          description_hi: string
          id: number
          is_active: boolean
          name_en: string
          name_hi: string
          scope: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_code: string
          description_hi?: string
          id?: number
          is_active?: boolean
          name_en: string
          name_hi: string
          scope?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_code?: string
          description_hi?: string
          id?: number
          is_active?: boolean
          name_en?: string
          name_hi?: string
          scope?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      prarthana_districts: {
        Row: {
          created_at: string
          district_code: string
          id: number
          is_active: boolean
          last_verified_at: string | null
          name_en: string
          name_hi: string
          source_url: string | null
          state_code: string
        }
        Insert: {
          created_at?: string
          district_code: string
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          name_en: string
          name_hi: string
          source_url?: string | null
          state_code: string
        }
        Update: {
          created_at?: string
          district_code?: string
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          name_en?: string
          name_hi?: string
          source_url?: string | null
          state_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "prarthana_districts_state_code_fkey"
            columns: ["state_code"]
            isOneToOne: false
            referencedRelation: "prarthana_states"
            referencedColumns: ["state_code"]
          },
        ]
      }
      prarthana_states: {
        Row: {
          created_at: string
          is_active: boolean
          name_en: string
          name_hi: string
          region_type: string
          state_code: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          name_en: string
          name_hi: string
          region_type?: string
          state_code: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          name_en?: string
          name_hi?: string
          region_type?: string
          state_code?: string
        }
        Relationships: []
      }
      prarthana_templates: {
        Row: {
          approved_for_public: boolean
          attachment_suggestions: Json
          body_template: string
          category: string
          closing_template: string
          created_at: string
          department_id: number | null
          disclaimer_hi: string
          id: number
          instructions_hi: string
          is_active: boolean
          jurisdiction_scope: string
          logo_asset_key: string
          placeholders: Json
          recipient_template: string
          subject_template: string
          template_key: string
          title_en: string
          title_hi: string
          updated_at: string
          version: number
        }
        Insert: {
          approved_for_public?: boolean
          attachment_suggestions?: Json
          body_template: string
          category: string
          closing_template?: string
          created_at?: string
          department_id?: number | null
          disclaimer_hi?: string
          id?: number
          instructions_hi?: string
          is_active?: boolean
          jurisdiction_scope?: string
          logo_asset_key?: string
          placeholders?: Json
          recipient_template?: string
          subject_template: string
          template_key: string
          title_en: string
          title_hi: string
          updated_at?: string
          version?: number
        }
        Update: {
          approved_for_public?: boolean
          attachment_suggestions?: Json
          body_template?: string
          category?: string
          closing_template?: string
          created_at?: string
          department_id?: number | null
          disclaimer_hi?: string
          id?: number
          instructions_hi?: string
          is_active?: boolean
          jurisdiction_scope?: string
          logo_asset_key?: string
          placeholders?: Json
          recipient_template?: string
          subject_template?: string
          template_key?: string
          title_en?: string
          title_hi?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prarthana_templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "prarthana_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          district: string | null
          email: string | null
          full_name: string | null
          id: string
          mobile: string | null
          pincode: string | null
          role: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          mobile?: string | null
          pincode?: string | null
          role?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          mobile?: string | null
          pincode?: string | null
          role?: string | null
          state?: string | null
        }
        Relationships: []
      }
      samvad_actions: {
        Row: {
          action_date: string
          action_type: string
          attachment_url: string | null
          complaint_id: number
          created_at: string
          created_by: string | null
          department_name: string | null
          details: string | null
          id: number
          office_name: string | null
          officer_id: number | null
          officer_name: string | null
          reference_no: string | null
          summary: string
        }
        Insert: {
          action_date?: string
          action_type: string
          attachment_url?: string | null
          complaint_id: number
          created_at?: string
          created_by?: string | null
          department_name?: string | null
          details?: string | null
          id?: number
          office_name?: string | null
          officer_id?: number | null
          officer_name?: string | null
          reference_no?: string | null
          summary: string
        }
        Update: {
          action_date?: string
          action_type?: string
          attachment_url?: string | null
          complaint_id?: number
          created_at?: string
          created_by?: string | null
          department_name?: string | null
          details?: string | null
          id?: number
          office_name?: string | null
          officer_id?: number | null
          officer_name?: string | null
          reference_no?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "samvad_actions_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "samvad_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_actions_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "samvad_officers"
            referencedColumns: ["id"]
          },
        ]
      }
      samvad_complaints: {
        Row: {
          assigned_at: string | null
          assigned_officer_id: number | null
          category: string | null
          citizen_address: string | null
          citizen_email: string | null
          citizen_mobile: string | null
          citizen_name: string
          citizen_reference_token: string
          complaint_no: string
          created_at: string
          current_level: string | null
          current_officer_id: number | null
          department_name: string | null
          department_office: string | null
          description: string
          escalation_at: string | null
          escalation_reason: string | null
          government_officer_name: string | null
          id: number
          last_action_at: string | null
          member_id: number | null
          pincode: string | null
          region_id: number
          resolution_summary: string | null
          source: string
          status: string
          subject: string
          updated_at: string
          urgency: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_officer_id?: number | null
          category?: string | null
          citizen_address?: string | null
          citizen_email?: string | null
          citizen_mobile?: string | null
          citizen_name: string
          citizen_reference_token?: string
          complaint_no?: string
          created_at?: string
          current_level?: string | null
          current_officer_id?: number | null
          department_name?: string | null
          department_office?: string | null
          description: string
          escalation_at?: string | null
          escalation_reason?: string | null
          government_officer_name?: string | null
          id?: number
          last_action_at?: string | null
          member_id?: number | null
          pincode?: string | null
          region_id: number
          resolution_summary?: string | null
          source?: string
          status?: string
          subject: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_officer_id?: number | null
          category?: string | null
          citizen_address?: string | null
          citizen_email?: string | null
          citizen_mobile?: string | null
          citizen_name?: string
          citizen_reference_token?: string
          complaint_no?: string
          created_at?: string
          current_level?: string | null
          current_officer_id?: number | null
          department_name?: string | null
          department_office?: string | null
          description?: string
          escalation_at?: string | null
          escalation_reason?: string | null
          government_officer_name?: string | null
          id?: number
          last_action_at?: string | null
          member_id?: number | null
          pincode?: string | null
          region_id?: number
          resolution_summary?: string | null
          source?: string
          status?: string
          subject?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "samvad_complaints_assigned_officer_id_fkey"
            columns: ["assigned_officer_id"]
            isOneToOne: false
            referencedRelation: "samvad_officers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_complaints_current_officer_id_fkey"
            columns: ["current_officer_id"]
            isOneToOne: false
            referencedRelation: "samvad_officers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_complaints_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_complaints_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "samvad_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      samvad_officers: {
        Row: {
          appointed_at: string
          designation: string
          email: string | null
          full_name: string
          id: number
          is_active: boolean
          member_id: number | null
          mobile: string | null
          notes: string | null
          pincode: string | null
          region_id: number
          removed_at: string | null
          role_type: string | null
          user_id: string
        }
        Insert: {
          appointed_at?: string
          designation?: string
          email?: string | null
          full_name: string
          id?: number
          is_active?: boolean
          member_id?: number | null
          mobile?: string | null
          notes?: string | null
          pincode?: string | null
          region_id: number
          removed_at?: string | null
          role_type?: string | null
          user_id: string
        }
        Update: {
          appointed_at?: string
          designation?: string
          email?: string | null
          full_name?: string
          id?: number
          is_active?: boolean
          member_id?: number | null
          mobile?: string | null
          notes?: string | null
          pincode?: string | null
          region_id?: number
          removed_at?: string | null
          role_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "samvad_officers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_officers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "samvad_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      samvad_pincodes: {
        Row: {
          created_at: string
          district: string | null
          id: number
          is_active: boolean
          pincode: string
          post_office: string | null
          region_id: number | null
          source: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: number
          is_active?: boolean
          pincode: string
          post_office?: string | null
          region_id?: number | null
          source?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: number
          is_active?: boolean
          pincode?: string
          post_office?: string | null
          region_id?: number | null
          source?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "samvad_pincodes_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "samvad_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      samvad_regions: {
        Row: {
          code: string | null
          created_at: string
          id: number
          is_active: boolean
          level: string
          name: string
          parent_id: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          level: string
          name: string
          parent_id?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          level?: string
          name?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "samvad_regions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "samvad_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      samvad_transfer_history: {
        Row: {
          complaint_id: number
          created_at: string
          from_level: string | null
          from_officer_id: number | null
          id: number
          reason: string
          to_level: string
          to_officer_id: number | null
          transferred_by: string | null
        }
        Insert: {
          complaint_id: number
          created_at?: string
          from_level?: string | null
          from_officer_id?: number | null
          id?: number
          reason: string
          to_level: string
          to_officer_id?: number | null
          transferred_by?: string | null
        }
        Update: {
          complaint_id?: number
          created_at?: string
          from_level?: string | null
          from_officer_id?: number | null
          id?: number
          reason?: string
          to_level?: string
          to_officer_id?: number | null
          transferred_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "samvad_transfer_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "samvad_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_transfer_history_from_officer_id_fkey"
            columns: ["from_officer_id"]
            isOneToOne: false
            referencedRelation: "samvad_officers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samvad_transfer_history_to_officer_id_fkey"
            columns: ["to_officer_id"]
            isOneToOne: false
            referencedRelation: "samvad_officers"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_ai_knowledge: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          source_table: string | null
          source_type: string
          title: string
          topic: string
          updated_at: string
          verified_at: string | null
          visibility: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          source_table?: string | null
          source_type?: string
          title: string
          topic: string
          updated_at?: string
          verified_at?: string | null
          visibility?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          source_table?: string | null
          source_type?: string
          title?: string
          topic?: string
          updated_at?: string
          verified_at?: string | null
          visibility?: string
        }
        Relationships: []
      }
      sbpf_ai_studio_projects: {
        Row: {
          created_at: string
          description: string
          display_name: string
          features: Json
          id: string
          project_key: string
          prototype_version: string
          security_notes: string
          source_file: string
          source_repository: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_name: string
          features?: Json
          id?: string
          project_key: string
          prototype_version?: string
          security_notes?: string
          source_file: string
          source_repository: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_name?: string
          features?: Json
          id?: string
          project_key?: string
          prototype_version?: string
          security_notes?: string
          source_file?: string
          source_repository?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_ai_video_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          language: string
          scenes: Json
          script_json: Json
          settings: Json
          status: string
          story_text: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          video_provider: string
          video_url: string | null
          voice_name: string
          voice_provider: string
          voiceover_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          language?: string
          scenes?: Json
          script_json?: Json
          settings?: Json
          status?: string
          story_text: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id: string
          video_provider?: string
          video_url?: string | null
          voice_name?: string
          voice_provider?: string
          voiceover_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          language?: string
          scenes?: Json
          script_json?: Json
          settings?: Json
          status?: string
          story_text?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_provider?: string
          video_url?: string | null
          voice_name?: string
          voice_provider?: string
          voiceover_url?: string | null
        }
        Relationships: []
      }
      sbpf_app_registry: {
        Row: {
          app_key: string
          app_name: string
          base_url: string | null
          config: Json
          created_at: string
          id: number
          last_seen_at: string | null
          platform: string
          status: string
          updated_at: string
        }
        Insert: {
          app_key: string
          app_name: string
          base_url?: string | null
          config?: Json
          created_at?: string
          id?: number
          last_seen_at?: string | null
          platform?: string
          status?: string
          updated_at?: string
        }
        Update: {
          app_key?: string
          app_name?: string
          base_url?: string | null
          config?: Json
          created_at?: string
          id?: number
          last_seen_at?: string | null
          platform?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_appointment_documents: {
        Row: {
          appointing_authority: string | null
          appointment_date: string | null
          appointment_id: string
          appointment_location: string | null
          created_at: string
          designation: string | null
          email: string | null
          id: number
          interviewer: string | null
          member_id: string | null
          member_name: string
          poster_file_name: string | null
          qr_target_url: string
          role: string | null
          status: string
          website_url: string
          work_area: string | null
        }
        Insert: {
          appointing_authority?: string | null
          appointment_date?: string | null
          appointment_id: string
          appointment_location?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: number
          interviewer?: string | null
          member_id?: string | null
          member_name: string
          poster_file_name?: string | null
          qr_target_url: string
          role?: string | null
          status?: string
          website_url: string
          work_area?: string | null
        }
        Update: {
          appointing_authority?: string | null
          appointment_date?: string | null
          appointment_id?: string
          appointment_location?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: number
          interviewer?: string | null
          member_id?: string | null
          member_name?: string
          poster_file_name?: string | null
          qr_target_url?: string
          role?: string | null
          status?: string
          website_url?: string
          work_area?: string | null
        }
        Relationships: []
      }
      sbpf_appointment_verifications: {
        Row: {
          appointing_authority: string | null
          appointment_date: string | null
          created_at: string
          designation: string | null
          document_url: string | null
          email: string | null
          full_name: string
          id: number
          interviewer: string | null
          logo_url: string | null
          member_id: string
          photo_url: string | null
          public_slug: string
          role: string
          status: string
          updated_at: string
          website: string | null
          work_area: string | null
        }
        Insert: {
          appointing_authority?: string | null
          appointment_date?: string | null
          created_at?: string
          designation?: string | null
          document_url?: string | null
          email?: string | null
          full_name: string
          id?: number
          interviewer?: string | null
          logo_url?: string | null
          member_id: string
          photo_url?: string | null
          public_slug: string
          role: string
          status?: string
          updated_at?: string
          website?: string | null
          work_area?: string | null
        }
        Update: {
          appointing_authority?: string | null
          appointment_date?: string | null
          created_at?: string
          designation?: string | null
          document_url?: string | null
          email?: string | null
          full_name?: string
          id?: number
          interviewer?: string | null
          logo_url?: string | null
          member_id?: string
          photo_url?: string | null
          public_slug?: string
          role?: string
          status?: string
          updated_at?: string
          website?: string | null
          work_area?: string | null
        }
        Relationships: []
      }
      sbpf_audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: number
          metadata: Json
          module_key: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          module_key?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          module_key?: string | null
        }
        Relationships: []
      }
      sbpf_brand_settings: {
        Row: {
          accent_color: string
          id: number
          logo_asset_key: string
          organization_name: string
          organization_name_en: string
          primary_color: string
          secondary_color: string
          updated_at: string
          updated_by: string | null
          verification_base_url: string | null
        }
        Insert: {
          accent_color?: string
          id?: number
          logo_asset_key?: string
          organization_name?: string
          organization_name_en?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
          verification_base_url?: string | null
        }
        Update: {
          accent_color?: string
          id?: number
          logo_asset_key?: string
          organization_name?: string
          organization_name_en?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
          verification_base_url?: string | null
        }
        Relationships: []
      }
      sbpf_button_settings: {
        Row: {
          action_type: string
          action_value: string | null
          button_key: string
          created_at: string
          icon: string | null
          id: number
          is_active: boolean
          label_en: string | null
          label_hi: string
          sort_order: number
          updated_at: string
          variant: string
        }
        Insert: {
          action_type?: string
          action_value?: string | null
          button_key: string
          created_at?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label_en?: string | null
          label_hi: string
          sort_order?: number
          updated_at?: string
          variant?: string
        }
        Update: {
          action_type?: string
          action_value?: string | null
          button_key?: string
          created_at?: string
          icon?: string | null
          id?: number
          is_active?: boolean
          label_en?: string | null
          label_hi?: string
          sort_order?: number
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      sbpf_committee_members: {
        Row: {
          appointed_at: string
          created_at: string
          id: number
          member_profile_id: string | null
          position_key: string
          position_no: number
          status: string
          unit_id: number
          user_id: string | null
        }
        Insert: {
          appointed_at?: string
          created_at?: string
          id?: number
          member_profile_id?: string | null
          position_key: string
          position_no: number
          status?: string
          unit_id: number
          user_id?: string | null
        }
        Update: {
          appointed_at?: string
          created_at?: string
          id?: number
          member_profile_id?: string | null
          position_key?: string
          position_no?: number
          status?: string
          unit_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_committee_members_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sbpf_committee_members_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_committee_members_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "sbpf_organization_units"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_datagov_resources: {
        Row: {
          api_available: boolean | null
          api_required: boolean
          catalog_url: string
          created_at: string
          enabled: boolean
          id: number
          last_checked_at: string | null
          last_error: string | null
          last_success_at: string | null
          resource_key: string
          resource_name: string
          resource_url: string | null
          sync_frequency_hours: number
          updated_at: string
        }
        Insert: {
          api_available?: boolean | null
          api_required?: boolean
          catalog_url: string
          created_at?: string
          enabled?: boolean
          id?: number
          last_checked_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          resource_key: string
          resource_name: string
          resource_url?: string | null
          sync_frequency_hours?: number
          updated_at?: string
        }
        Update: {
          api_available?: boolean | null
          api_required?: boolean
          catalog_url?: string
          created_at?: string
          enabled?: boolean
          id?: number
          last_checked_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          resource_key?: string
          resource_name?: string
          resource_url?: string | null
          sync_frequency_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_document_delivery_log: {
        Row: {
          channel: string
          completed_at: string | null
          created_at: string
          document_id: string
          error_message: string | null
          id: string
          provider_message_id: string | null
          recipient_email: string | null
          requested_by: string | null
          status: string
        }
        Insert: {
          channel: string
          completed_at?: string | null
          created_at?: string
          document_id: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email?: string | null
          requested_by?: string | null
          status?: string
        }
        Update: {
          channel?: string
          completed_at?: string | null
          created_at?: string
          document_id?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email?: string | null
          requested_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_document_delivery_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "sbpf_generated_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_document_templates: {
        Row: {
          asset_reference: string | null
          created_at: string
          id: number
          is_active: boolean
          language: string
          page_size: string
          template_category: string
          template_config: Json
          template_key: string
          template_name: string
          updated_at: string
          version: number
        }
        Insert: {
          asset_reference?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          language?: string
          page_size?: string
          template_category: string
          template_config?: Json
          template_key: string
          template_name: string
          updated_at?: string
          version?: number
        }
        Update: {
          asset_reference?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          language?: string
          page_size?: string
          template_category?: string
          template_config?: Json
          template_key?: string
          template_name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      sbpf_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event_key: string
          id: number
          module_key: string | null
          payload: Json
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_key: string
          id?: number
          module_key?: string | null
          payload?: Json
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_key?: string
          id?: number
          module_key?: string | null
          payload?: Json
        }
        Relationships: []
      }
      sbpf_external_api_config: {
        Row: {
          base_url: string
          created_at: string
          enabled: boolean
          id: number
          provider: string
          secret_name: string | null
          updated_at: string
        }
        Insert: {
          base_url: string
          created_at?: string
          enabled?: boolean
          id?: number
          provider: string
          secret_name?: string | null
          updated_at?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          enabled?: boolean
          id?: number
          provider?: string
          secret_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_feature_flags: {
        Row: {
          config: Json
          description: string | null
          enabled: boolean
          flag_key: string
          id: number
          rollout_percent: number
          updated_at: string
        }
        Insert: {
          config?: Json
          description?: string | null
          enabled?: boolean
          flag_key: string
          id?: number
          rollout_percent?: number
          updated_at?: string
        }
        Update: {
          config?: Json
          description?: string | null
          enabled?: boolean
          flag_key?: string
          id?: number
          rollout_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_footer_config: {
        Row: {
          config_data: Json
          config_key: string
          created_at: string
          is_active: boolean
          notes: string | null
          updated_at: string
          version: number
        }
        Insert: {
          config_data?: Json
          config_key: string
          created_at?: string
          is_active?: boolean
          notes?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          config_data?: Json
          config_key?: string
          created_at?: string
          is_active?: boolean
          notes?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      sbpf_generated_documents: {
        Row: {
          created_at: string
          data_snapshot: Json
          document_number: string | null
          file_path: string | null
          generated_at: string
          generated_by: string | null
          hospital_id: string | null
          id: string
          output_format: string
          school_id: string | null
          source_record_id: string
          source_table: string
          source_updated_at: string | null
          status: string
          template_id: string | null
          template_key: string
          tenant_type: string
        }
        Insert: {
          created_at?: string
          data_snapshot?: Json
          document_number?: string | null
          file_path?: string | null
          generated_at?: string
          generated_by?: string | null
          hospital_id?: string | null
          id?: string
          output_format?: string
          school_id?: string | null
          source_record_id: string
          source_table: string
          source_updated_at?: string | null
          status?: string
          template_id?: string | null
          template_key: string
          tenant_type: string
        }
        Update: {
          created_at?: string
          data_snapshot?: Json
          document_number?: string | null
          file_path?: string | null
          generated_at?: string
          generated_by?: string | null
          hospital_id?: string | null
          id?: string
          output_format?: string
          school_id?: string | null
          source_record_id?: string
          source_table?: string
          source_updated_at?: string | null
          status?: string
          template_id?: string | null
          template_key?: string
          tenant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_generated_documents_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_generated_documents_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_generated_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "sbpf_tenant_document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_government_directory_settings: {
        Row: {
          is_active: boolean
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          is_active?: boolean
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          is_active?: boolean
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_government_directory_sources: {
        Row: {
          created_at: string
          district_name: string | null
          government_level: string
          id: string
          is_active: boolean
          last_attempt_at: string | null
          last_error: string | null
          last_status: string
          last_success_at: string | null
          source_name: string
          source_type: string
          source_url: string
          state_name: string | null
          update_frequency_hours: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_name?: string | null
          government_level: string
          id?: string
          is_active?: boolean
          last_attempt_at?: string | null
          last_error?: string | null
          last_status?: string
          last_success_at?: string | null
          source_name: string
          source_type?: string
          source_url: string
          state_name?: string | null
          update_frequency_hours?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_name?: string | null
          government_level?: string
          id?: string
          is_active?: boolean
          last_attempt_at?: string | null
          last_error?: string | null
          last_status?: string
          last_success_at?: string | null
          source_name?: string
          source_type?: string
          source_url?: string
          state_name?: string | null
          update_frequency_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_government_directory_sync_runs: {
        Row: {
          details: Json
          error_summary: string | null
          finished_at: string | null
          id: string
          records_added: number
          records_marked_stale: number
          records_updated: number
          sources_checked: number
          started_at: string
          status: string
          trigger_type: string
        }
        Insert: {
          details?: Json
          error_summary?: string | null
          finished_at?: string | null
          id?: string
          records_added?: number
          records_marked_stale?: number
          records_updated?: number
          sources_checked?: number
          started_at?: string
          status?: string
          trigger_type?: string
        }
        Update: {
          details?: Json
          error_summary?: string | null
          finished_at?: string | null
          id?: string
          records_added?: number
          records_marked_stale?: number
          records_updated?: number
          sources_checked?: number
          started_at?: string
          status?: string
          trigger_type?: string
        }
        Relationships: []
      }
      sbpf_government_districts: {
        Row: {
          created_at: string
          district_name: string
          district_name_local: string | null
          id: number
          is_active: boolean
          last_verified_at: string | null
          lgd_code: string
          pincode: string | null
          pincode_office_name: string | null
          pincode_source_url: string | null
          region_code: string
          source_name: string
          source_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_name: string
          district_name_local?: string | null
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          lgd_code: string
          pincode?: string | null
          pincode_office_name?: string | null
          pincode_source_url?: string | null
          region_code: string
          source_name?: string
          source_url?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_name?: string
          district_name_local?: string | null
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          lgd_code?: string
          pincode?: string | null
          pincode_office_name?: string | null
          pincode_source_url?: string | null
          region_code?: string
          source_name?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_government_districts_region_code_fkey"
            columns: ["region_code"]
            isOneToOne: false
            referencedRelation: "sbpf_government_regions"
            referencedColumns: ["code"]
          },
        ]
      }
      sbpf_government_officials: {
        Row: {
          country_code: string
          created_at: string
          designation: string
          district_code: string | null
          district_name: string | null
          email: string | null
          government_level: string
          id: string
          last_verified_at: string | null
          next_review_at: string | null
          notes: string | null
          office_address: string | null
          office_name: string
          official_name: string | null
          official_website: string | null
          phone_mobile: string | null
          phone_office: string | null
          record_status: string
          source_checked_at: string | null
          source_hash: string | null
          source_name: string
          source_url: string
          state_code: string | null
          state_name: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          designation: string
          district_code?: string | null
          district_name?: string | null
          email?: string | null
          government_level: string
          id?: string
          last_verified_at?: string | null
          next_review_at?: string | null
          notes?: string | null
          office_address?: string | null
          office_name: string
          official_name?: string | null
          official_website?: string | null
          phone_mobile?: string | null
          phone_office?: string | null
          record_status?: string
          source_checked_at?: string | null
          source_hash?: string | null
          source_name: string
          source_url: string
          state_code?: string | null
          state_name?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          designation?: string
          district_code?: string | null
          district_name?: string | null
          email?: string | null
          government_level?: string
          id?: string
          last_verified_at?: string | null
          next_review_at?: string | null
          notes?: string | null
          office_address?: string | null
          office_name?: string
          official_name?: string | null
          official_website?: string | null
          phone_mobile?: string | null
          phone_office?: string | null
          record_status?: string
          source_checked_at?: string | null
          source_hash?: string | null
          source_name?: string
          source_url?: string
          state_code?: string | null
          state_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_government_regions: {
        Row: {
          code: string
          created_at: string
          id: number
          is_active: boolean
          name: string
          region_type: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          region_type: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          region_type?: string
        }
        Relationships: []
      }
      sbpf_integrations: {
        Row: {
          config: Json
          created_at: string
          id: number
          integration_key: string
          provider: string
          purpose: string | null
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: number
          integration_key: string
          provider: string
          purpose?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: number
          integration_key?: string
          provider?: string
          purpose?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_languages: {
        Row: {
          code: string
          created_at: string
          id: number
          is_active: boolean
          name_en: string
          name_hi: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          is_active?: boolean
          name_en: string
          name_hi: string
          sort_order?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name_en?: string
          name_hi?: string
          sort_order?: number
        }
        Relationships: []
      }
      sbpf_member_referral_rewards: {
        Row: {
          earned_at: string
          id: string
          level_number: number
          member_row_id: number
          qualified_members: number
          reward_title: string
          status: string
        }
        Insert: {
          earned_at?: string
          id?: string
          level_number: number
          member_row_id: number
          qualified_members: number
          reward_title: string
          status?: string
        }
        Update: {
          earned_at?: string
          id?: string
          level_number?: number
          member_row_id?: number
          qualified_members?: number
          reward_title?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_member_referral_rewards_level_number_fkey"
            columns: ["level_number"]
            isOneToOne: false
            referencedRelation: "sbpf_referral_level_rules"
            referencedColumns: ["level_number"]
          },
          {
            foreignKeyName: "sbpf_member_referral_rewards_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_modules: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          module_key: string
          module_type: string
          name: string
          route: string | null
          updated_at: string
          version: number
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          module_key: string
          module_type?: string
          name: string
          route?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          module_key?: string
          module_type?: string
          name?: string
          route?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      sbpf_organization_units: {
        Row: {
          code: string | null
          created_at: string
          id: number
          is_active: boolean
          level: string
          name_en: string | null
          name_hi: string
          parent_id: number | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          level: string
          name_en?: string | null
          name_hi: string
          parent_id?: number | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          level?: string
          name_en?: string | null
          name_hi?: string
          parent_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_organization_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sbpf_organization_units"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_policies: {
        Row: {
          content_en: string
          content_hi: string
          created_at: string
          effective_date: string
          id: number
          is_active: boolean
          policy_key: string
          title_en: string
          title_hi: string
          updated_at: string
          version: string
        }
        Insert: {
          content_en: string
          content_hi: string
          created_at?: string
          effective_date?: string
          id?: number
          is_active?: boolean
          policy_key: string
          title_en: string
          title_hi: string
          updated_at?: string
          version?: string
        }
        Update: {
          content_en?: string
          content_hi?: string
          created_at?: string
          effective_date?: string
          id?: number
          is_active?: boolean
          policy_key?: string
          title_en?: string
          title_hi?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      sbpf_poster_catalog: {
        Row: {
          asset_key: string | null
          campaign_key: string | null
          created_at: string
          design_description: string | null
          id: number
          is_active: boolean
          poster_key: string
          poster_type: string
          public_path: string | null
          region_code: string | null
          scope_type: string
          source_status: string
          title: string
          updated_at: string
        }
        Insert: {
          asset_key?: string | null
          campaign_key?: string | null
          created_at?: string
          design_description?: string | null
          id?: number
          is_active?: boolean
          poster_key: string
          poster_type?: string
          public_path?: string | null
          region_code?: string | null
          scope_type?: string
          source_status?: string
          title: string
          updated_at?: string
        }
        Update: {
          asset_key?: string | null
          campaign_key?: string | null
          created_at?: string
          design_description?: string | null
          id?: number
          is_active?: boolean
          poster_key?: string
          poster_type?: string
          public_path?: string | null
          region_code?: string | null
          scope_type?: string
          source_status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_referral_level_rules: {
        Row: {
          enabled: boolean
          level_number: number
          level_title: string
          required_active_members: number
          reward_description: string
          reward_title: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          level_number: number
          level_title: string
          required_active_members: number
          reward_description: string
          reward_title: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          level_number?: number
          level_title?: string
          required_active_members?: number
          reward_description?: string
          reward_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_regional_posters: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          is_default: boolean
          poster_key: string
          region_code: string
          region_name: string
          region_type: string
          usage_slot: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          is_default?: boolean
          poster_key: string
          region_code: string
          region_name: string
          region_type?: string
          usage_slot?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          is_default?: boolean
          poster_key?: string
          region_code?: string
          region_name?: string
          region_type?: string
          usage_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_regional_posters_poster_key_fkey"
            columns: ["poster_key"]
            isOneToOne: false
            referencedRelation: "sbpf_poster_catalog"
            referencedColumns: ["poster_key"]
          },
        ]
      }
      sbpf_scheme_categories: {
        Row: {
          created_at: string
          description: string | null
          focus_area_id: number
          id: number
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          focus_area_id: number
          id?: number
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          focus_area_id?: number
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_scheme_categories_focus_area_id_fkey"
            columns: ["focus_area_id"]
            isOneToOne: false
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_scheme_districts: {
        Row: {
          created_at: string
          district_lgd_code: string
          is_primary: boolean
          scheme_id: number
        }
        Insert: {
          created_at?: string
          district_lgd_code: string
          is_primary?: boolean
          scheme_id: number
        }
        Update: {
          created_at?: string
          district_lgd_code?: string
          is_primary?: boolean
          scheme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_scheme_districts_district_lgd_code_fkey"
            columns: ["district_lgd_code"]
            isOneToOne: false
            referencedRelation: "sbpf_government_districts"
            referencedColumns: ["lgd_code"]
          },
          {
            foreignKeyName: "sbpf_scheme_districts_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_scheme_focus_areas: {
        Row: {
          created_at: string
          focus_area_id: number
          is_primary: boolean
          relevance: number
          scheme_id: number
        }
        Insert: {
          created_at?: string
          focus_area_id: number
          is_primary?: boolean
          relevance?: number
          scheme_id: number
        }
        Update: {
          created_at?: string
          focus_area_id?: number
          is_primary?: boolean
          relevance?: number
          scheme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_scheme_focus_areas_focus_area_id_fkey"
            columns: ["focus_area_id"]
            isOneToOne: false
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_scheme_focus_areas_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_scheme_sources: {
        Row: {
          created_at: string
          enabled: boolean
          id: number
          last_checked_at: string | null
          last_error: string | null
          last_success_at: string | null
          region_code: string
          source_name: string
          source_type: string
          source_url: string
          sync_frequency_hours: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: number
          last_checked_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          region_code: string
          source_name: string
          source_type?: string
          source_url: string
          sync_frequency_hours?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: number
          last_checked_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          region_code?: string
          source_name?: string
          source_type?: string
          source_url?: string
          sync_frequency_hours?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_scheme_sources_region_code_fkey"
            columns: ["region_code"]
            isOneToOne: false
            referencedRelation: "sbpf_government_regions"
            referencedColumns: ["code"]
          },
        ]
      }
      sbpf_scheme_sync_runs: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: number
          records_created: number
          records_deactivated: number
          records_seen: number
          records_updated: number
          result: Json
          source_id: number
          started_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: number
          records_created?: number
          records_deactivated?: number
          records_seen?: number
          records_updated?: number
          result?: Json
          source_id: number
          started_at?: string
          status?: string
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: number
          records_created?: number
          records_deactivated?: number
          records_seen?: number
          records_updated?: number
          result?: Json
          source_id?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_scheme_sync_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sbpf_scheme_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: []
      }
      sbpf_social_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: number
          parent_comment_id: number | null
          post_id: number
          status: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          post_id: number
          status?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          post_id?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: number
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: number
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: number
        }
        Relationships: []
      }
      sbpf_social_hashtags: {
        Row: {
          created_at: string
          id: number
          tag: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag: string
        }
        Update: {
          created_at?: string
          id?: number
          tag?: string
        }
        Relationships: []
      }
      sbpf_social_message_members: {
        Row: {
          joined_at: string
          last_read_at: string | null
          thread_id: number
          user_id: string
        }
        Insert: {
          joined_at?: string
          last_read_at?: string | null
          thread_id: number
          user_id: string
        }
        Update: {
          joined_at?: string
          last_read_at?: string | null
          thread_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_message_members_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_message_threads: {
        Row: {
          created_at: string
          created_by: string
          id: number
          thread_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          thread_type?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          thread_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_social_messages: {
        Row: {
          body: string | null
          created_at: string
          id: number
          is_deleted: boolean
          media_type: string | null
          media_url: string | null
          reply_to_id: number | null
          sender_id: string
          thread_id: number
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean
          media_type?: string | null
          media_url?: string | null
          reply_to_id?: number | null
          sender_id: string
          thread_id: number
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean
          media_type?: string | null
          media_url?: string | null
          reply_to_id?: number | null
          sender_id?: string
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_social_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_notification_preferences: {
        Row: {
          comments: boolean
          follows: boolean
          likes: boolean
          mentions: boolean
          messages: boolean
          system: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          comments?: boolean
          follows?: boolean
          likes?: boolean
          mentions?: boolean
          messages?: boolean
          system?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          comments?: boolean
          follows?: boolean
          likes?: boolean
          mentions?: boolean
          messages?: boolean
          system?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sbpf_social_notifications: {
        Row: {
          actor_id: string | null
          comment_id: number | null
          created_at: string
          id: number
          is_read: boolean
          message: string | null
          notification_type: string
          post_id: number | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          comment_id?: number | null
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string | null
          notification_type: string
          post_id?: number | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          comment_id?: number | null
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string | null
          notification_type?: string
          post_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_social_notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_post_hashtags: {
        Row: {
          hashtag_id: number
          post_id: number
        }
        Insert: {
          hashtag_id: number
          post_id: number
        }
        Update: {
          hashtag_id?: number
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_post_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_social_post_hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_posts: {
        Row: {
          author_id: string
          caption: string | null
          comments_count: number
          comments_enabled: boolean
          content: string | null
          created_at: string
          duration_seconds: number | null
          hashtags: string[] | null
          id: number
          location_name: string | null
          media: Json
          mentions: string[] | null
          post_type: string
          reactions_count: number
          reactions_enabled: boolean
          saves_count: number
          share_count: number
          status: string
          thumbnail_url: string | null
          updated_at: string
          views_count: number
          visibility: string
          work_area_id: number | null
        }
        Insert: {
          author_id: string
          caption?: string | null
          comments_count?: number
          comments_enabled?: boolean
          content?: string | null
          created_at?: string
          duration_seconds?: number | null
          hashtags?: string[] | null
          id?: number
          location_name?: string | null
          media?: Json
          mentions?: string[] | null
          post_type?: string
          reactions_count?: number
          reactions_enabled?: boolean
          saves_count?: number
          share_count?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          views_count?: number
          visibility?: string
          work_area_id?: number | null
        }
        Update: {
          author_id?: string
          caption?: string | null
          comments_count?: number
          comments_enabled?: boolean
          content?: string | null
          created_at?: string
          duration_seconds?: number | null
          hashtags?: string[] | null
          id?: number
          location_name?: string | null
          media?: Json
          mentions?: string[] | null
          post_type?: string
          reactions_count?: number
          reactions_enabled?: boolean
          saves_count?: number
          share_count?: number
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          views_count?: number
          visibility?: string
          work_area_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_posts_work_area_id_fkey"
            columns: ["work_area_id"]
            isOneToOne: false
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          display_name: string | null
          followers_count: number
          following_count: number
          is_private: boolean
          is_verified: boolean
          posts_count: number
          updated_at: string
          user_id: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number
          following_count?: number
          is_private?: boolean
          is_verified?: boolean
          posts_count?: number
          updated_at?: string
          user_id: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number
          following_count?: number
          is_private?: boolean
          is_verified?: boolean
          posts_count?: number
          updated_at?: string
          user_id?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sbpf_social_reactions: {
        Row: {
          created_at: string
          id: number
          post_id: number
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_reports: {
        Row: {
          comment_id: number | null
          created_at: string
          details: string | null
          id: number
          post_id: number | null
          reason: string
          reported_user_id: string | null
          reporter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          details?: string | null
          id?: number
          post_id?: number | null
          reason: string
          reported_user_id?: string | null
          reporter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          details?: string | null
          id?: number
          post_id?: number | null
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_social_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_saves: {
        Row: {
          created_at: string
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_stories: {
        Row: {
          author_id: string
          caption: string | null
          created_at: string
          expires_at: string
          id: number
          media_type: string
          media_url: string | null
          status: string
        }
        Insert: {
          author_id: string
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: number
          media_type?: string
          media_url?: string | null
          status?: string
        }
        Update: {
          author_id?: string
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: number
          media_type?: string
          media_url?: string | null
          status?: string
        }
        Relationships: []
      }
      sbpf_social_story_views: {
        Row: {
          story_id: number
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          story_id: number
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          story_id?: number
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_social_views: {
        Row: {
          post_id: number
          user_id: string
          viewed_at: string
        }
        Insert: {
          post_id: number
          user_id: string
          viewed_at?: string
        }
        Update: {
          post_id?: number
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_social_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "sbpf_social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_sync_secrets: {
        Row: {
          name: string
          secret: string
          updated_at: string
        }
        Insert: {
          name: string
          secret: string
          updated_at?: string
        }
        Update: {
          name?: string
          secret?: string
          updated_at?: string
        }
        Relationships: []
      }
      sbpf_team_admin_audit: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          details: Json
          id: number
          target_member_row_id: number | null
          team_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          id?: number
          target_member_row_id?: number | null
          team_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          id?: number
          target_member_row_id?: number | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_team_admin_audit_target_member_row_id_fkey"
            columns: ["target_member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_admin_audit_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sbpf_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_team_member_activities: {
        Row: {
          activity_date: string
          created_at: string
          description: string
          evidence_urls: string[]
          id: string
          impact_category: string
          impact_summary: string | null
          location_label: string | null
          member_profile_id: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          team_id: string
          team_member_id: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_date?: string
          created_at?: string
          description: string
          evidence_urls?: string[]
          id?: string
          impact_category: string
          impact_summary?: string | null
          location_label?: string | null
          member_profile_id: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          team_id: string
          team_member_id: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          created_at?: string
          description?: string
          evidence_urls?: string[]
          id?: string
          impact_category?: string
          impact_summary?: string | null
          location_label?: string | null
          member_profile_id?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          team_id?: string
          team_member_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_team_member_activities_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sbpf_team_member_activities_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_member_activities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sbpf_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_member_activities_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "sbpf_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_team_members: {
        Row: {
          assigned_by: string | null
          country_snapshot: string | null
          district_snapshot: string | null
          id: string
          joined_at: string
          member_id_snapshot: string | null
          member_name_snapshot: string | null
          member_profile_id: string
          member_row_id: number | null
          pincode_snapshot: string | null
          state_snapshot: string | null
          status: string
          team_id: string
          team_role: string
        }
        Insert: {
          assigned_by?: string | null
          country_snapshot?: string | null
          district_snapshot?: string | null
          id?: string
          joined_at?: string
          member_id_snapshot?: string | null
          member_name_snapshot?: string | null
          member_profile_id: string
          member_row_id?: number | null
          pincode_snapshot?: string | null
          state_snapshot?: string | null
          status?: string
          team_id: string
          team_role?: string
        }
        Update: {
          assigned_by?: string | null
          country_snapshot?: string | null
          district_snapshot?: string | null
          id?: string
          joined_at?: string
          member_id_snapshot?: string | null
          member_name_snapshot?: string | null
          member_profile_id?: string
          member_row_id?: number | null
          pincode_snapshot?: string | null
          state_snapshot?: string | null
          status?: string
          team_id?: string
          team_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_team_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sbpf_team_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_members_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sbpf_team_members_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_members_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sbpf_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_teams: {
        Row: {
          country: string
          created_at: string
          created_by: string
          created_by_member_row_id: number | null
          description: string | null
          district: string | null
          id: string
          name: string
          pincode: string | null
          state: string | null
          status: string
          team_capacity: number
          team_code: string
          team_type: string
          updated_at: string
          work_area: string
        }
        Insert: {
          country?: string
          created_at?: string
          created_by?: string
          created_by_member_row_id?: number | null
          description?: string | null
          district?: string | null
          id?: string
          name: string
          pincode?: string | null
          state?: string | null
          status?: string
          team_capacity?: number
          team_code?: string
          team_type: string
          updated_at?: string
          work_area: string
        }
        Update: {
          country?: string
          created_at?: string
          created_by?: string
          created_by_member_row_id?: number | null
          description?: string | null
          district?: string | null
          id?: string
          name?: string
          pincode?: string | null
          state?: string | null
          status?: string
          team_capacity?: number
          team_code?: string
          team_type?: string
          updated_at?: string
          work_area?: string
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "sbpf_teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_teams_created_by_member_row_id_fkey"
            columns: ["created_by_member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_tenant_document_templates: {
        Row: {
          created_at: string
          hospital_id: string | null
          id: string
          language: string
          page_size: string
          requires_human_review: boolean
          school_id: string | null
          status: string
          template_category: string
          template_config: Json
          template_key: string
          template_name: string
          tenant_type: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          language?: string
          page_size?: string
          requires_human_review?: boolean
          school_id?: string | null
          status?: string
          template_category: string
          template_config?: Json
          template_key: string
          template_name: string
          tenant_type: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          language?: string
          page_size?: string
          requires_human_review?: boolean
          school_id?: string | null
          status?: string
          template_category?: string
          template_config?: Json
          template_key?: string
          template_name?: string
          tenant_type?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_tenant_document_templates_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hms_hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_tenant_document_templates_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "ems_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      sbpf_work_area_branding: {
        Row: {
          accent_color: string
          display_name: string
          id: number
          is_active: boolean
          logo_asset_key: string
          primary_color: string
          secondary_color: string
          updated_at: string
          updated_by: string | null
          work_area_id: number
        }
        Insert: {
          accent_color?: string
          display_name: string
          id?: number
          is_active?: boolean
          logo_asset_key?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
          work_area_id: number
        }
        Update: {
          accent_color?: string
          display_name?: string
          id?: number
          is_active?: boolean
          logo_asset_key?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
          work_area_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_work_area_branding_work_area_id_fkey"
            columns: ["work_area_id"]
            isOneToOne: true
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_application_documents: {
        Row: {
          application_id: number
          created_at: string
          document_type: string
          file_url: string | null
          id: number
          remark: string | null
          verification_status: string
        }
        Insert: {
          application_id: number
          created_at?: string
          document_type: string
          file_url?: string | null
          id?: number
          remark?: string | null
          verification_status?: string
        }
        Update: {
          application_id?: number
          created_at?: string
          document_type?: string
          file_url?: string | null
          id?: number
          remark?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "scholarship_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_applications: {
        Row: {
          academic_session: string | null
          address: string | null
          admin_remark: string | null
          administrative_registration_fee: number
          admission_status: string | null
          applicant_note: string | null
          application_no: string
          application_type: string
          approved_at: string | null
          approved_fee_support: number | null
          college_id: number | null
          course_name: string | null
          created_at: string
          declaration_accepted: boolean
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          gender: string | null
          id: number
          institution_name: string | null
          mobile: string | null
          mother_name: string | null
          pincode: string | null
          project_beneficiaries: number | null
          project_budget: number | null
          project_category: string | null
          project_impact: string | null
          project_problem: string | null
          project_solution: string | null
          project_timeline: string | null
          project_title: string | null
          requested_fee_support: number
          requested_scholarship_name: string | null
          scholarship_id: number | null
          state: string | null
          status: string
          student_name: string
          student_name_english: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          academic_session?: string | null
          address?: string | null
          admin_remark?: string | null
          administrative_registration_fee?: number
          admission_status?: string | null
          applicant_note?: string | null
          application_no?: string
          application_type?: string
          approved_at?: string | null
          approved_fee_support?: number | null
          college_id?: number | null
          course_name?: string | null
          created_at?: string
          declaration_accepted?: boolean
          district?: string | null
          dob?: string | null
          email?: string | null
          father_name?: string | null
          gender?: string | null
          id?: number
          institution_name?: string | null
          mobile?: string | null
          mother_name?: string | null
          pincode?: string | null
          project_beneficiaries?: number | null
          project_budget?: number | null
          project_category?: string | null
          project_impact?: string | null
          project_problem?: string | null
          project_solution?: string | null
          project_timeline?: string | null
          project_title?: string | null
          requested_fee_support?: number
          requested_scholarship_name?: string | null
          scholarship_id?: number | null
          state?: string | null
          status?: string
          student_name: string
          student_name_english?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          academic_session?: string | null
          address?: string | null
          admin_remark?: string | null
          administrative_registration_fee?: number
          admission_status?: string | null
          applicant_note?: string | null
          application_no?: string
          application_type?: string
          approved_at?: string | null
          approved_fee_support?: number | null
          college_id?: number | null
          course_name?: string | null
          created_at?: string
          declaration_accepted?: boolean
          district?: string | null
          dob?: string | null
          email?: string | null
          father_name?: string | null
          gender?: string | null
          id?: number
          institution_name?: string | null
          mobile?: string | null
          mother_name?: string | null
          pincode?: string | null
          project_beneficiaries?: number | null
          project_budget?: number | null
          project_category?: string | null
          project_impact?: string | null
          project_problem?: string | null
          project_solution?: string | null
          project_timeline?: string | null
          project_title?: string | null
          requested_fee_support?: number
          requested_scholarship_name?: string | null
          scholarship_id?: number | null
          state?: string | null
          status?: string
          student_name?: string
          student_name_english?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_applications_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "education_colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarship_applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "education_scholarships"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_fund_payments: {
        Row: {
          amount: number
          application_id: number
          college_id: number | null
          created_at: string
          id: number
          payer_name: string
          payment_date: string | null
          payment_method: string | null
          payment_purpose: string
          payment_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          application_id: number
          college_id?: number | null
          created_at?: string
          id?: number
          payer_name?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_purpose?: string
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          application_id?: number
          college_id?: number | null
          created_at?: string
          id?: number
          payer_name?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_purpose?: string
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_fund_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "scholarship_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarship_fund_payments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "education_colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      seva_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string
          assigned_by: string | null
          completed_at: string | null
          created_at: string
          id: number
          notes: string | null
          request_id: number
          status: string
          volunteer_id: number
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          request_id: number
          status?: string
          volunteer_id: number
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          request_id?: number
          status?: string
          volunteer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "seva_assignments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "seva_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seva_assignments_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      seva_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      seva_feedback: {
        Row: {
          created_at: string
          feedback: string | null
          id: number
          rating: number | null
          request_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: number
          rating?: number | null
          request_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: number
          rating?: number | null
          request_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seva_feedback_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "seva_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      seva_request_updates: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          note: string
          request_id: number
          status: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          note: string
          request_id: number
          status?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          note?: string
          request_id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seva_request_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "seva_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      seva_requests: {
        Row: {
          address: string | null
          admin_remark: string | null
          assigned_at: string | null
          assigned_volunteer_id: number | null
          category_id: number | null
          completed_at: string | null
          created_at: string
          description: string
          district: string | null
          id: number
          pincode: string | null
          request_no: string
          resolution_summary: string | null
          state: string | null
          status: string
          tehsil: string | null
          title: string
          updated_at: string
          urgency: string
          user_id: string
          verified_at: string | null
          village_city: string | null
        }
        Insert: {
          address?: string | null
          admin_remark?: string | null
          assigned_at?: string | null
          assigned_volunteer_id?: number | null
          category_id?: number | null
          completed_at?: string | null
          created_at?: string
          description: string
          district?: string | null
          id?: number
          pincode?: string | null
          request_no?: string
          resolution_summary?: string | null
          state?: string | null
          status?: string
          tehsil?: string | null
          title: string
          updated_at?: string
          urgency?: string
          user_id: string
          verified_at?: string | null
          village_city?: string | null
        }
        Update: {
          address?: string | null
          admin_remark?: string | null
          assigned_at?: string | null
          assigned_volunteer_id?: number | null
          category_id?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string
          district?: string | null
          id?: number
          pincode?: string | null
          request_no?: string
          resolution_summary?: string | null
          state?: string | null
          status?: string
          tehsil?: string | null
          title?: string
          updated_at?: string
          urgency?: string
          user_id?: string
          verified_at?: string | null
          village_city?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seva_requests_assigned_volunteer_id_fkey"
            columns: ["assigned_volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seva_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "seva_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      seva_rulebook: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string
          created_at: string
          effective_date: string | null
          id: number
          status: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content: string
          created_at?: string
          effective_date?: string | null
          id?: number
          status?: string
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          created_at?: string
          effective_date?: string | null
          id?: number
          status?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      swarnim_book_channels: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      swarnim_book_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swarnim_book_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "swarnim_book_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      swarnim_book_creator_earnings: {
        Row: {
          channel_id: number
          created_at: string
          id: number
          metric: string
          period_end: string | null
          period_start: string | null
          reward_paise: number
          status: string
          units_count: number
          user_id: string
        }
        Insert: {
          channel_id: number
          created_at?: string
          id?: number
          metric: string
          period_end?: string | null
          period_start?: string | null
          reward_paise?: number
          status?: string
          units_count?: number
          user_id: string
        }
        Update: {
          channel_id?: number
          created_at?: string
          id?: number
          metric?: string
          period_end?: string | null
          period_start?: string | null
          reward_paise?: number
          status?: string
          units_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swarnim_book_creator_earnings_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "swarnim_book_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      swarnim_book_creator_wallet: {
        Row: {
          balance_paise: number
          lifetime_earned_paise: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_paise?: number
          lifetime_earned_paise?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_paise?: number
          lifetime_earned_paise?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      swarnim_book_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      swarnim_book_likes: {
        Row: {
          created_at: string
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swarnim_book_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "swarnim_book_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      swarnim_book_monetization_rules: {
        Row: {
          active: boolean
          created_at: string
          id: number
          metric: string
          reward_paise: number
          units: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          metric: string
          reward_paise: number
          units: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          metric?: string
          reward_paise?: number
          units?: number
        }
        Relationships: []
      }
      swarnim_book_posts: {
        Row: {
          content: string | null
          created_at: string
          id: number
          media_type: string | null
          media_url: string | null
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      swarnim_book_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      swarnim_csc_portals: {
        Row: {
          access_type: string
          created_at: string
          id: number
          is_active: boolean
          jurisdiction: string
          login_url: string | null
          official_domain_verified: boolean
          official_owner: string | null
          portal_name: string
          portal_url: string
          service_category: string
          sort_order: number
          state_name: string | null
          updated_at: string
          verification_note: string | null
        }
        Insert: {
          access_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          jurisdiction?: string
          login_url?: string | null
          official_domain_verified?: boolean
          official_owner?: string | null
          portal_name: string
          portal_url: string
          service_category: string
          sort_order?: number
          state_name?: string | null
          updated_at?: string
          verification_note?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string
          id?: number
          is_active?: boolean
          jurisdiction?: string
          login_url?: string | null
          official_domain_verified?: boolean
          official_owner?: string | null
          portal_name?: string
          portal_url?: string
          service_category?: string
          sort_order?: number
          state_name?: string | null
          updated_at?: string
          verification_note?: string | null
        }
        Relationships: []
      }
      swarnim_csc_services: {
        Row: {
          authorization_required: boolean
          availability_note: string
          category: string
          created_at: string
          description: string
          id: number
          is_active: boolean
          login_required: boolean
          portal_url: string | null
          service_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          authorization_required?: boolean
          availability_note?: string
          category: string
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          login_required?: boolean
          portal_url?: string | null
          service_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          authorization_required?: boolean
          availability_note?: string
          category?: string
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          login_required?: boolean
          portal_url?: string | null
          service_name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      swarnim_video_editor_projects: {
        Row: {
          created_at: string
          id: string
          output_file_name: string | null
          project_name: string
          settings: Json
          source_file_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          output_file_name?: string | null
          project_name?: string
          settings?: Json
          source_file_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          output_file_name?: string | null
          project_name?: string
          settings?: Json
          source_file_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          published: boolean | null
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          published?: boolean | null
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          area: string | null
          created_at: string | null
          district: string | null
          id: number
          skills: string | null
          status: string | null
          user_id: string | null
          volunteer_number: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          district?: string | null
          id?: number
          skills?: string | null
          status?: string | null
          user_id?: string | null
          volunteer_number?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string | null
          district?: string | null
          id?: number
          skills?: string | null
          status?: string | null
          user_id?: string | null
          volunteer_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "my_app_roles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "volunteers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      women_empowerment_government_schemes: {
        Row: {
          application_link_label: string
          application_process: string | null
          application_url: string | null
          benefits: string | null
          category: string
          created_at: string
          eligibility: string | null
          government_level: string
          id: number
          is_active: boolean
          is_women_focused: boolean
          last_verified_at: string | null
          ministry_department: string | null
          office_contact_email: string | null
          office_contact_phone: string | null
          office_logo_url: string | null
          office_name: string | null
          official_source_url: string | null
          poster_alt_text: string | null
          required_documents: string[]
          scheme_code: string
          scheme_name: string
          scheme_name_hi: string | null
          scheme_poster_url: string | null
          scheme_status: string
          short_description: string | null
          source_id: number | null
          source_name: string
          source_verified: boolean
          state_ut: string | null
          state_ut_code: string | null
          target_beneficiaries: string[]
          updated_at: string
        }
        Insert: {
          application_link_label?: string
          application_process?: string | null
          application_url?: string | null
          benefits?: string | null
          category?: string
          created_at?: string
          eligibility?: string | null
          government_level: string
          id?: number
          is_active?: boolean
          is_women_focused?: boolean
          last_verified_at?: string | null
          ministry_department?: string | null
          office_contact_email?: string | null
          office_contact_phone?: string | null
          office_logo_url?: string | null
          office_name?: string | null
          official_source_url?: string | null
          poster_alt_text?: string | null
          required_documents?: string[]
          scheme_code: string
          scheme_name: string
          scheme_name_hi?: string | null
          scheme_poster_url?: string | null
          scheme_status?: string
          short_description?: string | null
          source_id?: number | null
          source_name?: string
          source_verified?: boolean
          state_ut?: string | null
          state_ut_code?: string | null
          target_beneficiaries?: string[]
          updated_at?: string
        }
        Update: {
          application_link_label?: string
          application_process?: string | null
          application_url?: string | null
          benefits?: string | null
          category?: string
          created_at?: string
          eligibility?: string | null
          government_level?: string
          id?: number
          is_active?: boolean
          is_women_focused?: boolean
          last_verified_at?: string | null
          ministry_department?: string | null
          office_contact_email?: string | null
          office_contact_phone?: string | null
          office_logo_url?: string | null
          office_name?: string | null
          official_source_url?: string | null
          poster_alt_text?: string | null
          required_documents?: string[]
          scheme_code?: string
          scheme_name?: string
          scheme_name_hi?: string | null
          scheme_poster_url?: string | null
          scheme_status?: string
          short_description?: string | null
          source_id?: number | null
          source_name?: string
          source_verified?: boolean
          state_ut?: string | null
          state_ut_code?: string | null
          target_beneficiaries?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "women_empowerment_government_schemes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "women_empowerment_scheme_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "women_empowerment_government_schemes_state_ut_code_fkey"
            columns: ["state_ut_code"]
            isOneToOne: false
            referencedRelation: "india_state_ut_directory"
            referencedColumns: ["code"]
          },
        ]
      }
      women_empowerment_request_history: {
        Row: {
          changed_at: string
          changed_by: string
          id: number
          new_status: string
          note: string | null
          old_status: string | null
          request_id: number
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: number
          new_status: string
          note?: string | null
          old_status?: string | null
          request_id: number
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: number
          new_status?: string
          note?: string | null
          old_status?: string | null
          request_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "women_empowerment_request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "women_empowerment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      women_empowerment_requests: {
        Row: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          applicant_name: string
          assigned_to: string | null
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          referral_contact: string | null
          referral_organization: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          applicant_name: string
          assigned_to?: string | null
          consent_to_contact?: boolean
          contact_phone: string
          created_at?: string
          details?: string | null
          district?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_contact_method?: string
          referral_contact?: string | null
          referral_organization?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code: string
          service_id?: number | null
          service_name: string
          short_need: string
          state?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          applicant_name?: string
          assigned_to?: string | null
          consent_to_contact?: boolean
          contact_phone?: string
          created_at?: string
          details?: string | null
          district?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_contact_method?: string
          referral_contact?: string | null
          referral_organization?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code?: string
          service_id?: number | null
          service_name?: string
          short_need?: string
          state?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "women_empowerment_requests_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "women_empowerment_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "women_empowerment_services"
            referencedColumns: ["id"]
          },
        ]
      }
      women_empowerment_scheme_import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          data_license_or_terms: string | null
          error_summary: string | null
          id: number
          records_inserted: number
          records_seen: number
          records_skipped: number
          records_updated: number
          scope_description: string
          source_name: string
          source_url: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_license_or_terms?: string | null
          error_summary?: string | null
          id?: number
          records_inserted?: number
          records_seen?: number
          records_skipped?: number
          records_updated?: number
          scope_description: string
          source_name: string
          source_url: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          data_license_or_terms?: string | null
          error_summary?: string | null
          id?: number
          records_inserted?: number
          records_seen?: number
          records_skipped?: number
          records_updated?: number
          scope_description?: string
          source_name?: string
          source_url?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      women_empowerment_scheme_media: {
        Row: {
          alt_text: string
          created_at: string
          id: number
          is_active: boolean
          media_type: string
          media_url: string | null
          scheme_id: number
          source_url: string | null
          storage_path: string | null
          updated_at: string
          uploaded_by: string | null
          verification_status: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          id?: number
          is_active?: boolean
          media_type: string
          media_url?: string | null
          scheme_id: number
          source_url?: string | null
          storage_path?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verification_status?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: number
          is_active?: boolean
          media_type?: string
          media_url?: string | null
          scheme_id?: number
          source_url?: string | null
          storage_path?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "women_empowerment_scheme_media_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "women_empowerment_government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      women_empowerment_scheme_sources: {
        Row: {
          created_at: string
          government_level: string
          id: number
          is_active: boolean
          last_verified_at: string | null
          notes: string | null
          office_logo_storage_path: string | null
          office_logo_url: string | null
          office_name: string
          official_contact_email: string | null
          official_contact_phone: string | null
          poster_template_url: string | null
          scheme_listing_url: string
          source_code: string
          source_portal_name: string
          source_portal_url: string
          state_ut_code: string | null
          state_ut_name_hi: string | null
          updated_at: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          government_level: string
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          notes?: string | null
          office_logo_storage_path?: string | null
          office_logo_url?: string | null
          office_name: string
          official_contact_email?: string | null
          official_contact_phone?: string | null
          poster_template_url?: string | null
          scheme_listing_url?: string
          source_code: string
          source_portal_name: string
          source_portal_url: string
          state_ut_code?: string | null
          state_ut_name_hi?: string | null
          updated_at?: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          government_level?: string
          id?: number
          is_active?: boolean
          last_verified_at?: string | null
          notes?: string | null
          office_logo_storage_path?: string | null
          office_logo_url?: string | null
          office_name?: string
          official_contact_email?: string | null
          official_contact_phone?: string | null
          poster_template_url?: string | null
          scheme_listing_url?: string
          source_code?: string
          source_portal_name?: string
          source_portal_url?: string
          state_ut_code?: string | null
          state_ut_name_hi?: string | null
          updated_at?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "women_empowerment_scheme_sources_state_ut_code_fkey"
            columns: ["state_ut_code"]
            isOneToOne: false
            referencedRelation: "india_state_ut_directory"
            referencedColumns: ["code"]
          },
        ]
      }
      women_empowerment_services: {
        Row: {
          availability_note: string
          availability_status: string
          category: string
          created_at: string
          delivery_mode: string
          display_order: number
          eligibility: string
          external_url: string | null
          full_description: string
          id: number
          is_active: boolean
          public_contact_email: string | null
          public_contact_name: string | null
          public_contact_phone: string | null
          service_area_districts: string[]
          service_area_states: string[]
          service_code: string
          service_name: string
          short_description: string
          updated_at: string
        }
        Insert: {
          availability_note?: string
          availability_status?: string
          category: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string
          external_url?: string | null
          full_description?: string
          id?: number
          is_active?: boolean
          public_contact_email?: string | null
          public_contact_name?: string | null
          public_contact_phone?: string | null
          service_area_districts?: string[]
          service_area_states?: string[]
          service_code: string
          service_name: string
          short_description?: string
          updated_at?: string
        }
        Update: {
          availability_note?: string
          availability_status?: string
          category?: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string
          external_url?: string | null
          full_description?: string
          id?: number
          is_active?: boolean
          public_contact_email?: string | null
          public_contact_name?: string | null
          public_contact_phone?: string | null
          service_area_districts?: string[]
          service_area_states?: string[]
          service_code?: string
          service_name?: string
          short_description?: string
          updated_at?: string
        }
        Relationships: []
      }
      work_area_content: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean
          link_label: string | null
          link_url: string | null
          sort_order: number
          title: string
          updated_at: string
          work_area: string
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          work_area: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          work_area?: string
        }
        Relationships: []
      }
      work_area_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          description: string | null
          district: string | null
          id: number
          member_id: number | null
          request_type: string
          state: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
          work_area: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: number
          member_id?: number | null
          request_type?: string
          state?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
          work_area: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: number
          member_id?: number | null
          request_type?: string
          state?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
          work_area?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_area_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_empowerment_request_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          new_status: string
          note: string | null
          old_status: string | null
          request_id: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_status: string
          note?: string | null
          old_status?: string | null
          request_id: number
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_status?: string
          note?: string | null
          old_status?: string | null
          request_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "youth_empowerment_request_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "youth_empowerment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_empowerment_requests: {
        Row: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          applicant_name: string
          assigned_to: string | null
          category: string
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string
          education_level: string | null
          email: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_mode: string | null
          referral_contact: string | null
          referral_organization: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number
          short_need: string
          state: string
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          applicant_name: string
          assigned_to?: string | null
          category: string
          consent_to_contact?: boolean
          contact_phone: string
          created_at?: string
          details?: string | null
          district: string
          education_level?: string | null
          email?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_mode?: string | null
          referral_contact?: string | null
          referral_organization?: string | null
          request_number: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code: string
          service_id: number
          short_need: string
          state: string
          status?: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          age_years?: number | null
          alternate_phone?: string | null
          applicant_name?: string
          assigned_to?: string | null
          category?: string
          consent_to_contact?: boolean
          contact_phone?: string
          created_at?: string
          details?: string | null
          district?: string
          education_level?: string | null
          email?: string | null
          id?: number
          member_id?: string | null
          member_row_id?: number | null
          outcome_note?: string | null
          pincode?: string | null
          preferred_mode?: string | null
          referral_contact?: string | null
          referral_organization?: string | null
          request_number?: string
          request_type?: string
          resolved_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_code?: string
          service_id?: number
          short_need?: string
          state?: string
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_empowerment_requests_member_row_id_fkey"
            columns: ["member_row_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_empowerment_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "youth_empowerment_services"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_empowerment_services: {
        Row: {
          application_url: string | null
          availability_note: string | null
          availability_status: string
          category: string
          created_at: string
          delivery_mode: string
          display_order: number
          eligibility: string | null
          full_description: string | null
          id: number
          is_active: boolean
          official_source_url: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code: string
          service_name: string
          service_name_hi: string
          short_description: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          availability_note?: string | null
          availability_status?: string
          category?: string
          created_at?: string
          delivery_mode?: string
          display_order?: number
          eligibility?: string | null
          full_description?: string | null
          id?: number
          is_active?: boolean
          official_source_url?: string | null
          service_code?: string
          service_name?: string
          service_name_hi?: string
          short_description?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      my_app_roles: {
        Row: {
          is_admin: boolean | null
          is_journalist: boolean | null
          is_member: boolean | null
          journalist_approved: boolean | null
          journalist_id: number | null
          journalist_status: string | null
          membership_status: string | null
          user_id: string | null
        }
        Insert: {
          is_admin?: never
          is_journalist?: never
          is_member?: never
          journalist_approved?: never
          journalist_id?: never
          journalist_status?: never
          membership_status?: never
          user_id?: string | null
        }
        Update: {
          is_admin?: never
          is_journalist?: never
          is_member?: never
          journalist_approved?: never
          journalist_id?: never
          journalist_status?: never
          membership_status?: never
          user_id?: string | null
        }
        Relationships: []
      }
      sbpf_active_buttons: {
        Row: {
          action_type: string | null
          action_value: string | null
          button_key: string | null
          icon: string | null
          id: number | null
          label_en: string | null
          label_hi: string | null
          sort_order: number | null
          variant: string | null
        }
        Insert: {
          action_type?: string | null
          action_value?: string | null
          button_key?: string | null
          icon?: string | null
          id?: number | null
          label_en?: string | null
          label_hi?: string | null
          sort_order?: number | null
          variant?: string | null
        }
        Update: {
          action_type?: string | null
          action_value?: string | null
          button_key?: string | null
          icon?: string | null
          id?: number | null
          label_en?: string | null
          label_hi?: string | null
          sort_order?: number | null
          variant?: string | null
        }
        Relationships: []
      }
      sbpf_active_languages: {
        Row: {
          code: string | null
          id: number | null
          name_en: string | null
          name_hi: string | null
          sort_order: number | null
        }
        Insert: {
          code?: string | null
          id?: number | null
          name_en?: string | null
          name_hi?: string | null
          sort_order?: number | null
        }
        Update: {
          code?: string | null
          id?: number | null
          name_en?: string | null
          name_hi?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      sbpf_active_policies: {
        Row: {
          content_en: string | null
          content_hi: string | null
          effective_date: string | null
          id: number | null
          policy_key: string | null
          title_en: string | null
          title_hi: string | null
          version: string | null
        }
        Insert: {
          content_en?: string | null
          content_hi?: string | null
          effective_date?: string | null
          id?: number | null
          policy_key?: string | null
          title_en?: string | null
          title_hi?: string | null
          version?: string | null
        }
        Update: {
          content_en?: string | null
          content_hi?: string | null
          effective_date?: string | null
          id?: number | null
          policy_key?: string | null
          title_en?: string | null
          title_hi?: string | null
          version?: string | null
        }
        Relationships: []
      }
      sbpf_public_team_member_activities: {
        Row: {
          activity_date: string | null
          created_at: string | null
          description: string | null
          district: string | null
          id: string | null
          impact_category: string | null
          impact_summary: string | null
          location_label: string | null
          member_id: string | null
          member_name: string | null
          state: string | null
          team_id: string | null
          team_member_id: string | null
          team_name: string | null
          team_type: string | null
          title: string | null
          work_area: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sbpf_team_member_activities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sbpf_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbpf_team_member_activities_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "sbpf_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_approve_membership: {
        Args: { p_member_id: number }
        Returns: boolean
      }
      admin_assign_samvad_officer: {
        Args: {
          p_designation: string
          p_email: string
          p_full_name: string
          p_member_id: number
          p_mobile: string
          p_notes?: string
          p_region_id: number
          p_user_id: string
        }
        Returns: number
      }
      admin_campaign_access: {
        Args: { p_campaign_id: number }
        Returns: {
          access_id: number
          created_at: string
          email: string
          full_name: string
          is_active: boolean
          member_db_id: number
          member_id: string
        }[]
      }
      admin_certificate_list: {
        Args: { p_status?: string }
        Returns: {
          certificate_number: string
          certificate_status: string
          created_at: string
          full_name: string
          id: number
          issued_at: string
          member_id: string
          revoked_at: string
        }[]
      }
      admin_child_development_summary: {
        Args: never
        Returns: {
          high_or_urgent: number
          need_more_info: number
          referred: number
          resolved: number
          submitted: number
          total_requests: number
          under_review: number
        }[]
      }
      admin_education_workflow_summary: { Args: never; Returns: Json }
      admin_get_member_360: { Args: { p_member_id: number }; Returns: Json }
      admin_grant_campaign_access: {
        Args: { p_campaign_id: number; p_member_id: number }
        Returns: boolean
      }
      admin_health_service_summary: { Args: never; Returns: Json }
      admin_issue_member_certificate: {
        Args: { p_member_id: number }
        Returns: boolean
      }
      admin_kyc_document_paths: {
        Args: { p_member_id: number }
        Returns: {
          aadhaar_document_path: string
          member_id: string
          pan_document_path: string
        }[]
      }
      admin_kyc_list: {
        Args: { p_status?: string }
        Returns: {
          aadhaar_uploaded: boolean
          full_name: string
          id: number
          kyc_rejection_reason: string
          kyc_status: string
          kyc_submitted_at: string
          kyc_verified_at: string
          member_id: string
          mobile: string
          pan_uploaded: boolean
        }[]
      }
      admin_list_child_development_requests: {
        Args: { p_limit?: number; p_status?: string }
        Returns: {
          admin_note: string
          child_age_years: number
          child_name: string
          contact_phone: string
          created_at: string
          details: string
          district: string
          guardian_name: string
          id: number
          member_id: string
          need_category: string
          referral_contact: string
          referral_organization: string
          request_number: string
          request_type: string
          service_code: string
          service_name_hi: string
          short_need: string
          state: string
          status: string
          urgency: string
          user_id: string
        }[]
      }
      admin_list_education_applications: {
        Args: never
        Returns: {
          academic_session: string
          admin_remark: string
          applicant_note: string
          application_no: string
          application_type: string
          approved_at: string
          approved_fee_support: number
          course_name: string
          created_at: string
          district: string
          documents: Json
          email: string
          id: number
          institution_name: string
          mobile: string
          project_beneficiaries: number
          project_budget: number
          project_category: string
          project_impact: string
          project_problem: string
          project_solution: string
          project_timeline: string
          project_title: string
          requested_fee_support: number
          requested_scholarship_name: string
          state: string
          status: string
          student_name: string
          submitted_at: string
        }[]
      }
      admin_list_education_workflow_reviews: {
        Args: { p_workflow_id: number }
        Returns: {
          decision: string
          id: number
          note: string | null
          reviewed_at: string
          reviewed_by: string
          workflow_id: number
        }[]
        SetofOptions: {
          from: "*"
          to: "education_workflow_reviews"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_education_workflows: {
        Args: never
        Returns: {
          admin_note: string | null
          created_at: string
          document_paths: string[]
          id: number
          member_id: string
          member_row_id: number
          payload: Json
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          work_area: string
          workflow_type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "education_member_workflows"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_health_service_requests: {
        Args: { p_limit?: number; p_status?: string }
        Returns: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          assigned_to: string | null
          beneficiary_name: string
          beneficiary_relation: string
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          emergency_flag: boolean
          gender: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          preferred_date: string | null
          preferred_time: string | null
          referral_contact: string | null
          referral_provider: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "health_service_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_member_pariwar: {
        Args: never
        Returns: {
          annual_income: number
          created_at: string
          district: string
          family_code: string
          family_name: string
          family_needs: string[]
          head_name: string
          housing_status: string
          id: number
          land_ownership: string
          livelihood_type: string
          member_count: number
          member_id: string
          mobile: string
          notes: string
          people: Json
          pincode: string
          ration_card_type: string
          social_category: string
          state: string
          status: string
        }[]
      }
      admin_list_members: {
        Args: { p_status?: string }
        Returns: {
          created_at: string
          district: string
          full_name: string
          id: number
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          mobile: string
          referral_code: string
          referred_by_code: string
          state: string
          status: string
        }[]
      }
      admin_list_women_empowerment_requests: {
        Args: { p_limit?: number; p_status?: string }
        Returns: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          applicant_name: string
          assigned_to: string | null
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          referral_contact: string | null
          referral_organization: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "women_empowerment_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_youth_empowerment_requests: {
        Args: { p_limit?: number; p_status?: string }
        Returns: {
          admin_note: string
          age_years: number
          applicant_name: string
          category: string
          contact_phone: string
          created_at: string
          details: string
          district: string
          education_level: string
          id: number
          member_id: string
          referral_contact: string
          referral_organization: string
          request_number: string
          request_type: string
          service_code: string
          service_name_hi: string
          short_need: string
          state: string
          status: string
          urgency: string
          user_id: string
        }[]
      }
      admin_referral_report: {
        Args: never
        Returns: {
          active_direct_referrals: number
          direct_referrals: number
          full_name: string
          member_id: string
          referral_code: string
          total_network: number
        }[]
      }
      admin_reject_kyc: {
        Args: { p_member_id: number; p_reason: string }
        Returns: boolean
      }
      admin_remove_samvad_officer: { Args: { p_id: number }; Returns: boolean }
      admin_review_child_development_request: {
        Args: {
          p_admin_note?: string
          p_new_status: string
          p_outcome_note?: string
          p_referral_contact?: string
          p_referral_organization?: string
          p_request_id: number
        }
        Returns: {
          request_id: number
          request_number: string
          status: string
        }[]
      }
      admin_review_education_application: {
        Args: {
          p_application_id: number
          p_approved_amount?: number
          p_decision: string
          p_note?: string
        }
        Returns: {
          admin_remark: string
          application_no: string
          approved_at: string
          approved_fee_support: number
          id: number
          status: string
        }[]
      }
      admin_review_education_workflow: {
        Args: { p_decision: string; p_note?: string; p_workflow_id: number }
        Returns: Json
      }
      admin_review_health_service_request: {
        Args: {
          p_admin_note?: string
          p_new_status: string
          p_outcome_note?: string
          p_referral_contact?: string
          p_referral_provider?: string
          p_request_id: number
        }
        Returns: Json
      }
      admin_review_member_pariwar: {
        Args: { p_decision: string; p_family_id: number; p_note?: string }
        Returns: Json
      }
      admin_review_women_empowerment_request: {
        Args: {
          p_admin_note?: string
          p_new_status: string
          p_outcome_note?: string
          p_referral_contact?: string
          p_referral_organization?: string
          p_request_id: number
        }
        Returns: Json
      }
      admin_review_youth_empowerment_request: {
        Args: {
          p_admin_note?: string
          p_new_status: string
          p_outcome_note?: string
          p_referral_contact?: string
          p_referral_organization?: string
          p_request_id: number
        }
        Returns: {
          request_id: number
          request_number: string
          status: string
        }[]
      }
      admin_revoke_campaign_access: {
        Args: { p_campaign_id: number; p_member_id: number }
        Returns: boolean
      }
      admin_revoke_member_certificate: {
        Args: { p_certificate_id: number }
        Returns: boolean
      }
      admin_samvad_complaints: {
        Args: { p_officer_id?: number; p_region_id?: number; p_status?: string }
        Returns: {
          assigned_officer: string
          assigned_officer_id: number
          category: string
          citizen_mobile: string
          citizen_name: string
          complaint_no: string
          created_at: string
          department_name: string
          department_office: string
          id: number
          last_action_at: string
          region_level: string
          region_name: string
          status: string
          subject: string
          updated_at: string
          urgency: string
        }[]
      }
      admin_samvad_officers: {
        Args: never
        Returns: {
          appointed_at: string
          designation: string
          email: string
          full_name: string
          id: number
          is_active: boolean
          member_db_id: number
          mobile: string
          notes: string
          region_id: number
          region_level: string
          region_name: string
          user_id: string
        }[]
      }
      admin_samvad_regions: {
        Args: never
        Returns: {
          code: string
          id: number
          is_active: boolean
          level: string
          name: string
          officer_count: number
          parent_id: number
          parent_name: string
        }[]
      }
      admin_samvad_update_complaint: {
        Args: {
          p_action_summary?: string
          p_action_type?: string
          p_department_name?: string
          p_department_office?: string
          p_government_officer_name?: string
          p_id: number
          p_officer_id?: number
          p_reference_no?: string
          p_resolution_summary?: string
          p_status: string
        }
        Returns: boolean
      }
      admin_search_members: {
        Args: { p_search?: string; p_status?: string }
        Returns: {
          created_at: string
          district: string
          email: string
          full_name: string
          id: number
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          mobile: string
          payment_status: string
          referral_code: string
          referred_by_code: string
          state: string
          status: string
        }[]
      }
      admin_set_payment_status: {
        Args: { p_member_id: number; p_payment_status: string }
        Returns: boolean
      }
      admin_suspend_member: { Args: { p_member_id: number }; Returns: boolean }
      admin_transfer_samvad_complaint: {
        Args: {
          p_complaint_id: number
          p_reason: string
          p_to_officer_id: number
        }
        Returns: Json
      }
      admin_update_complaint: {
        Args: { p_id: number; p_remark?: string; p_status: string }
        Returns: undefined
      }
      admin_update_donation: {
        Args: { p_id: number; p_receipt?: string; p_status: string }
        Returns: undefined
      }
      admin_update_volunteer: {
        Args: { p_id: number; p_status: string }
        Returns: undefined
      }
      admin_verify_kyc: { Args: { p_member_id: number }; Returns: boolean }
      admin_women_empowerment_summary: { Args: never; Returns: Json }
      admin_youth_empowerment_summary: {
        Args: never
        Returns: {
          high_or_urgent: number
          need_more_info: number
          referred: number
          resolved: number
          submitted: number
          total_requests: number
          under_review: number
        }[]
      }
      build_member_verification_url: {
        Args: { p_base_url: string; p_token: string }
        Returns: string
      }
      build_referral_link: {
        Args: { p_base_url: string; p_code: string }
        Returns: string
      }
      check_referral_code: { Args: { p_code: string }; Returns: boolean }
      child_development_my_requests: {
        Args: never
        Returns: {
          admin_note: string
          child_name: string
          created_at: string
          district: string
          id: number
          need_category: string
          outcome_note: string
          referral_organization: string
          request_number: string
          request_type: string
          service_name_hi: string
          state: string
          status: string
          updated_at: string
        }[]
      }
      child_development_request_submit: {
        Args: {
          p_alternate_phone: string
          p_child_age_years: number
          p_child_dob: string
          p_child_gender: string
          p_child_name: string
          p_consent_to_contact: boolean
          p_contact_phone: string
          p_details: string
          p_district: string
          p_guardian_name: string
          p_guardian_relation: string
          p_member_id?: string
          p_need_category: string
          p_pincode: string
          p_request_type: string
          p_school_or_anganwadi: string
          p_service_code: string
          p_short_need: string
          p_state: string
          p_urgency: string
        }
        Returns: {
          request_id: number
          request_number: string
          status: string
        }[]
      }
      complete_member_profile: {
        Args: never
        Returns: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_my_member_profile: { Args: never; Returns: boolean }
      create_membership_payment_order:
        | {
            Args: never
            Returns: {
              amount: number
              currency: string
              gateway: string
              order_id: string
              status: string
            }[]
          }
        | {
            Args: { p_plan_code: string }
            Returns: {
              amount: number
              autopay_enabled: boolean
              billing_interval: string
              currency: string
              gateway: string
              order_id: string
              plan_code: string
              status: string
            }[]
          }
      education_workflow_my_list: {
        Args: never
        Returns: {
          admin_note: string | null
          created_at: string
          document_paths: string[]
          id: number
          member_id: string
          member_row_id: number
          payload: Json
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          work_area: string
          workflow_type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "education_member_workflows"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      education_workflow_submit: {
        Args: {
          p_document_paths?: string[]
          p_member_id: string
          p_payload?: Json
          p_title: string
          p_workflow_type: string
        }
        Returns: Json
      }
      ems_admin_link_member: {
        Args: {
          p_class_name?: string
          p_designation?: string
          p_member_id: string
          p_role: string
          p_roll_number?: string
          p_salary_amount?: number
          p_school_id: string
          p_section?: string
          p_subject?: string
        }
        Returns: Json
      }
      ems_can_access_school: { Args: { p_school_id: string }; Returns: boolean }
      ems_can_manage_school: { Args: { p_school_id: string }; Returns: boolean }
      ems_get_public_school_portal: {
        Args: { p_subdomain: string }
        Returns: Json
      }
      ems_make_school_slug: { Args: { p_name: string }; Returns: string }
      ems_school_code_prefix: { Args: { p_name: string }; Returns: string }
      ems_teacher_class_roster: {
        Args: { p_school_id: string }
        Returns: {
          class_name: string
          full_name: string
          roll_number: string
          section: string
          student_code: string
          student_id: string
        }[]
      }
      ems_verify_student_certificate: {
        Args: { p_token: string }
        Returns: Json
      }
      ems_verify_student_id_card: { Args: { p_token: string }; Returns: Json }
      find_samvad_officer_by_pincode: {
        Args: { p_pincode: string }
        Returns: {
          officer_id: number
          officer_level: string
          officer_name: string
          pincode: string
          region_id: number
        }[]
      }
      generate_member_referral_code: { Args: never; Returns: string }
      get_my_certificate: {
        Args: never
        Returns: {
          certificate_number: string
          certificate_status: string
          full_name: string
          issued_at: string
          member_id: string
          verification_token: string
        }[]
      }
      get_my_family_scheme_candidates: {
        Args: { p_family_id: number }
        Returns: {
          benefits: Json
          category: string
          description: string
          eligibility: Json
          eligibility_review_required: boolean
          last_verified_at: string
          match_reason: string
          official_url: string
          region_code: string
          required_documents: Json
          scheme_id: number
          scheme_name: string
          scope: string
          source_name: string
          source_url: string
        }[]
      }
      get_my_kyc_status: {
        Args: never
        Returns: {
          aadhaar_uploaded: boolean
          kyc_rejection_reason: string
          kyc_status: string
          kyc_submitted_at: string
          kyc_verified_at: string
          pan_uploaded: boolean
        }[]
      }
      get_my_member_dashboard: {
        Args: never
        Returns: {
          email: string
          full_name: string
          member_id: string
          membership_fee: number
          membership_status: string
          mobile: string
          payment_status: string
          profile_completed: boolean
          profile_completed_at: string
          referral_code: string
          referral_count: number
          referral_link: string
          status: string
          verification_url: string
        }[]
      }
      get_my_member_id_card: {
        Args: never
        Returns: {
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          payment_status: string
          qr_token: string
          referral_code: string
          status: string
        }[]
      }
      get_my_member_id_card_url: { Args: never; Returns: string }
      get_my_member_id_card_v2: {
        Args: never
        Returns: {
          country: string
          designation: string
          district: string
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          payment_status: string
          pincode: string
          qr_token: string
          referral_code: string
          state: string
          status: string
          work_area_id: number
          work_area_name: string
        }[]
      }
      get_my_member_profile: {
        Args: never
        Returns: {
          address: string
          district: string
          email: string
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          mobile: string
          payment_status: string
          referral_code: string
          state: string
          status: string
        }[]
      }
      get_my_member_profile_v2: {
        Args: never
        Returns: {
          address: string
          country: string
          designation: string
          district: string
          email: string
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          mobile: string
          payment_status: string
          pincode: string
          state: string
          status: string
          work_area_id: number
          work_area_name: string
        }[]
      }
      get_my_membership_payment: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          currency: string
          gateway: string
          order_id: string
          paid_at: string
          status: string
        }[]
      }
      get_my_pincode: { Args: never; Returns: string }
      get_my_public_member_link: {
        Args: { p_base_url?: string }
        Returns: string
      }
      get_my_referral_dashboard: {
        Args: never
        Returns: {
          referral_code: string
          referral_link: string
          referred_active_count: number
          referred_member_count: number
        }[]
      }
      get_my_referral_tree: {
        Args: never
        Returns: {
          created_at: string
          full_name: string
          level: number
          member_id: string
          membership_status: string
          status: string
        }[]
      }
      get_my_referred_members: {
        Args: never
        Returns: {
          created_at: string
          full_name: string
          member_id: string
          membership_status: string
          status: string
        }[]
      }
      get_my_samvad_actions: {
        Args: { p_complaint_id: number }
        Returns: {
          action_date: string
          action_type: string
          created_at: string
          department_name: string
          details: string
          id: number
          office_name: string
          officer_name: string
          reference_no: string
          summary: string
        }[]
      }
      get_my_samvad_complaints: {
        Args: never
        Returns: {
          assigned_at: string
          assigned_officer_id: number
          category: string
          citizen_address: string
          citizen_mobile: string
          citizen_name: string
          complaint_no: string
          created_at: string
          department_name: string
          department_office: string
          government_officer_name: string
          id: number
          last_action_at: string
          region_id: number
          resolution_summary: string
          status: string
          subject: string
          updated_at: string
          urgency: string
        }[]
      }
      get_my_teacher_profile: {
        Args: never
        Returns: {
          approved_at: string | null
          approved_by: string | null
          bio: string | null
          city: string | null
          created_at: string
          experience_years: number | null
          free_class_url: string | null
          free_classes_available: boolean
          full_name: string
          id: number
          institution_name: string | null
          is_featured: boolean
          is_public: boolean
          languages: string[]
          member_id: number | null
          member_verified_at: string | null
          profile_photo_url: string | null
          public_contact_url: string | null
          qualification: string | null
          source_url: string | null
          state: string | null
          status: string
          subject_categories: string[]
          teaching_mode: string
          updated_at: string
          user_id: string | null
          website_url: string | null
          youtube_channel_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "education_teachers"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_my_teacher_resources: {
        Args: never
        Returns: {
          category_name: string
          created_at: string
          description: string
          district: string
          id: number
          is_downloadable: boolean
          job_type: string
          resource_type: string
          resource_url: string
          state: string
          status: string
          title: string
          youtube_url: string
        }[]
      }
      get_public_member: {
        Args: { p_token: string }
        Returns: {
          district: string
          member_id: string
          member_name: string
          membership_expiry: string
          membership_start: string
          membership_status: string
          pincode: string
          public_enabled: boolean
          state: string
        }[]
      }
      get_public_work_area_schemes: {
        Args: { p_region_code?: string; p_work_area_id: number }
        Returns: {
          application_process: string
          benefits: Json
          category: string
          description: string
          eligibility: Json
          last_verified_at: string
          ministry_department: string
          official_url: string
          region_code: string
          required_documents: Json
          scheme_id: number
          scheme_name: string
          scope: string
          source_name: string
          source_url: string
          sub_category: string
        }[]
      }
      get_referral_member_id: { Args: { p_code: string }; Returns: string }
      get_samvad_complaint: {
        Args: { p_complaint_no: string; p_tracking_token: string }
        Returns: {
          assigned_officer: string
          complaint_no: string
          created_at: string
          department_name: string
          last_action_at: string
          region_name: string
          resolution_summary: string
          status: string
          subject: string
        }[]
      }
      get_sbpf_brand_config: {
        Args: { p_work_area_id?: number }
        Returns: Json
      }
      health_service_my_requests: {
        Args: never
        Returns: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          assigned_to: string | null
          beneficiary_name: string
          beneficiary_relation: string
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          emergency_flag: boolean
          gender: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          preferred_date: string | null
          preferred_time: string | null
          referral_contact: string | null
          referral_provider: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "health_service_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      health_service_request_submit: {
        Args: {
          p_age_years: number
          p_alternate_phone: string
          p_beneficiary_name: string
          p_beneficiary_relation: string
          p_consent_to_contact: boolean
          p_contact_phone: string
          p_details: string
          p_district: string
          p_emergency_flag: boolean
          p_gender: string
          p_member_id?: string
          p_pincode: string
          p_preferred_contact_method: string
          p_preferred_date: string
          p_preferred_time: string
          p_request_type: string
          p_service_code: string
          p_short_need: string
          p_state: string
          p_urgency: string
        }
        Returns: Json
      }
      hms_create_diagnostic_order: {
        Args: {
          p_clinical_notes?: string
          p_encounter_type?: string
          p_hospital_id: string
          p_patient_id: string
          p_priority?: string
          p_test_name: string
        }
        Returns: {
          diagnostic_order_id: string
          encounter_id: string
          encounter_number: string
          order_number: string
          test_item_id: string
        }[]
      }
      hms_get_public_hospital_portal: {
        Args: { p_subdomain: string }
        Returns: Json
      }
      hms_issue_queue_token: {
        Args: {
          p_chief_complaint?: string
          p_department?: string
          p_doctor_staff_id?: string
          p_encounter_type: string
          p_hospital_id: string
          p_patient_id: string
          p_priority?: string
        }
        Returns: {
          encounter_id: string
          encounter_number: string
          token_id: string
          token_label: string
        }[]
      }
      hms_lookup_patient_by_token: {
        Args: {
          p_hospital_id: string
          p_token_date?: string
          p_token_label: string
        }
        Returns: {
          age_years: number
          blood_group: string
          bp_diastolic: number
          bp_systolic: number
          chief_complaint: string
          date_of_birth: string
          department: string
          doctor_name: string
          doctor_staff_id: string
          encounter_id: string
          encounter_number: string
          encounter_status: string
          encounter_type: string
          gender: string
          patient_code: string
          patient_id: string
          patient_name: string
          phone: string
          pulse_bpm: number
          respiratory_rate: number
          spo2_percent: number
          temperature_c: number
          token_label: string
          vitals_recorded_at: string
          weight_kg: number
        }[]
      }
      hms_make_portal_slug: { Args: { p_name: string }; Returns: string }
      hms_patient_can_access: {
        Args: { p_hospital_id: string; p_patient_id: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_sbpf_admin: { Args: never; Returns: boolean }
      is_valid_referral_code: { Args: { p_code: string }; Returns: boolean }
      member_family_can_access: {
        Args: { p_family_id: number }
        Returns: boolean
      }
      officer_transfer_samvad_complaint: {
        Args: {
          p_complaint_id: number
          p_reason: string
          p_to_officer_id: number
        }
        Returns: Json
      }
      refresh_expired_memberships: { Args: never; Returns: number }
      register_member: {
        Args: {
          p_full_name: string
          p_mobile: string
          p_referral_code?: string
        }
        Returns: {
          full_name: string
          member_id: string
          referral_code: string
          status: string
        }[]
      }
      register_my_member: {
        Args: {
          p_address: string
          p_district: string
          p_full_name: string
          p_mobile: string
          p_referral_code?: string
          p_state?: string
        }
        Returns: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      register_my_pariwar: {
        Args: { p_family: Json; p_members?: Json }
        Returns: Json
      }
      request_membership_renewal: { Args: never; Returns: boolean }
      route_samvad_by_pincode: {
        Args: { p_pincode: string }
        Returns: {
          officer_id: number
          officer_level: string
          officer_name: string
          region_id: number
        }[]
      }
      run_sbpf_automation_engine: { Args: never; Returns: Json }
      samvad_assign_officer: { Args: { p_region_id: number }; Returns: number }
      save_member_step2: {
        Args: { p_dob: string; p_father_name: string; p_gender: string }
        Returns: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      save_member_step3: {
        Args: {
          p_address: string
          p_district: string
          p_pincode: string
          p_state: string
        }
        Returns: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      save_my_profile_photo: {
        Args: { p_path: string }
        Returns: {
          aadhaar_document_path: string | null
          aadhaar_number: string | null
          address: string | null
          country: string
          created_at: string | null
          designation: string | null
          district: string | null
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: number
          kyc_rejection_reason: string | null
          kyc_status: string
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          member_id: string | null
          membership_end_date: string | null
          membership_fee: number
          membership_start_date: string | null
          membership_status: string | null
          mobile: string
          pan_document_path: string | null
          pan_number: string | null
          payment_status: string
          pincode: string | null
          profile_completed: boolean
          profile_completed_at: string | null
          profile_photo_path: string | null
          qr_token: string | null
          referral_code: string | null
          referral_link: string | null
          referred_by: string | null
          referred_by_code: string | null
          state: string | null
          status: string | null
          user_id: string | null
          verification_token: string | null
          verification_url: string | null
          work_area_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      sbpf_admin_add_member_to_team: {
        Args: {
          p_member_row_id: number
          p_team_id: string
          p_team_role?: string
        }
        Returns: Json
      }
      sbpf_admin_list_teams: { Args: never; Returns: Json }
      sbpf_admin_referral_report: { Args: never; Returns: Json }
      sbpf_admin_remove_member_from_team: {
        Args: { p_member_row_id: number; p_team_id: string }
        Returns: boolean
      }
      sbpf_admin_review_team: {
        Args: { p_decision: string; p_note?: string; p_team_id: string }
        Returns: Json
      }
      sbpf_admin_review_team_member: {
        Args: {
          p_member_row_id: number
          p_status: string
          p_team_id: string
          p_team_role?: string
        }
        Returns: boolean
      }
      sbpf_admin_set_team_status: {
        Args: { p_status: string; p_team_id: string }
        Returns: boolean
      }
      sbpf_admin_team_report: { Args: never; Returns: Json }
      sbpf_admin_update_team: {
        Args: {
          p_country: string
          p_description?: string
          p_district: string
          p_name: string
          p_pincode: string
          p_state: string
          p_team_id: string
          p_work_area: string
        }
        Returns: boolean
      }
      sbpf_can_view_team: { Args: { p_team_id: string }; Returns: boolean }
      sbpf_create_team: {
        Args: {
          p_description?: string
          p_district?: string
          p_name: string
          p_pincode?: string
          p_state?: string
          p_team_type: string
          p_work_area: string
        }
        Returns: Json
      }
      sbpf_get_my_referral_dashboard: { Args: never; Returns: Json }
      sbpf_government_directory_maintenance: { Args: never; Returns: Json }
      sbpf_invoke_scheme_sync: { Args: never; Returns: undefined }
      sbpf_is_eligible_member: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      sbpf_join_team: { Args: { p_team_code: string }; Returns: Json }
      sbpf_my_teams: { Args: never; Returns: Json }
      sbpf_queue_due_scheme_syncs: { Args: never; Returns: number }
      set_referral_from_code: {
        Args: { p_code: string; p_member_id: number }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      submit_my_kyc_documents: {
        Args: { p_aadhaar_document_path: string; p_pan_document_path: string }
        Returns: boolean
      }
      submit_samvad_complaint: {
        Args: {
          p_category: string
          p_citizen_address: string
          p_citizen_email: string
          p_citizen_mobile: string
          p_citizen_name: string
          p_description: string
          p_pincode?: string
          p_region_id: number
          p_source?: string
          p_subject: string
          p_urgency: string
        }
        Returns: Json
      }
      submit_scholarship_application: {
        Args: { p_application_id: number }
        Returns: {
          application_no: string
          id: number
          status: string
          submitted_at: string
        }[]
      }
      submit_work_area_request: {
        Args: {
          p_description?: string
          p_district?: string
          p_request_type: string
          p_state?: string
          p_subject: string
          p_work_area: string
        }
        Returns: number
      }
      teacher_attach_education_resource_path: {
        Args: { p_resource_id: number; p_resource_path: string }
        Returns: boolean
      }
      teacher_submit_education_resource: {
        Args: {
          p_category_id: number
          p_description?: string
          p_district?: string
          p_is_downloadable?: boolean
          p_job_type?: string
          p_resource_type?: string
          p_resource_url?: string
          p_state?: string
          p_teacher_id: number
          p_title: string
          p_youtube_url?: string
        }
        Returns: number
      }
      update_my_member_profile: {
        Args: {
          p_address: string
          p_district: string
          p_full_name: string
          p_mobile: string
          p_state?: string
        }
        Returns: boolean
      }
      update_my_member_profile_v2: {
        Args: {
          p_address: string
          p_country: string
          p_designation: string
          p_district: string
          p_full_name: string
          p_mobile: string
          p_pincode: string
          p_state: string
          p_work_area_id: number
        }
        Returns: boolean
      }
      update_my_pincode: { Args: { p_pincode: string }; Returns: string }
      verify_education_member_id: {
        Args: { p_member_id: string }
        Returns: Json
      }
      verify_elibrary_member: {
        Args: { p_member_id: string }
        Returns: boolean
      }
      verify_member: {
        Args: { token: string }
        Returns: {
          expiry_date: string
          member_name: string
          membership_date: string
          membership_id: string
          photo_url: string
          status: string
        }[]
      }
      verify_member_certificate: {
        Args: { p_token: string }
        Returns: {
          certificate_number: string
          certificate_status: string
          full_name: string
          issued_at: string
          member_id: string
        }[]
      }
      verify_member_qr: {
        Args: { p_token: string }
        Returns: {
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          status: string
        }[]
      }
      verify_member_qr_code: {
        Args: { p_qr_token: string }
        Returns: {
          full_name: string
          member_id: string
          membership_end_date: string
          membership_start_date: string
          membership_status: string
          status: string
        }[]
      }
      women_empowerment_list_schemes: {
        Args: {
          p_category?: string
          p_government_level?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_state_ut_code?: string
        }
        Returns: {
          application_process: string
          application_url: string
          benefits: string
          category: string
          eligibility: string
          government_level: string
          id: number
          last_verified_at: string
          ministry_department: string
          office_logo_url: string
          office_name: string
          official_source_url: string
          required_documents: string[]
          scheme_code: string
          scheme_name: string
          scheme_name_hi: string
          scheme_poster_url: string
          scheme_status: string
          short_description: string
          source_verified: boolean
          state_ut: string
          state_ut_code: string
        }[]
      }
      women_empowerment_my_requests: {
        Args: never
        Returns: {
          admin_note: string | null
          age_years: number | null
          alternate_phone: string | null
          applicant_name: string
          assigned_to: string | null
          consent_to_contact: boolean
          contact_phone: string
          created_at: string
          details: string | null
          district: string | null
          id: number
          member_id: string | null
          member_row_id: number | null
          outcome_note: string | null
          pincode: string | null
          preferred_contact_method: string
          referral_contact: string | null
          referral_organization: string | null
          request_number: string
          request_type: string
          resolved_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_code: string
          service_id: number | null
          service_name: string
          short_need: string
          state: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "women_empowerment_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      women_empowerment_request_submit: {
        Args: {
          p_age_years: number
          p_alternate_phone: string
          p_applicant_name: string
          p_consent_to_contact: boolean
          p_contact_phone: string
          p_details: string
          p_district: string
          p_member_id?: string
          p_pincode: string
          p_preferred_contact_method: string
          p_request_type: string
          p_service_code: string
          p_short_need: string
          p_state: string
          p_urgency: string
        }
        Returns: Json
      }
      youth_empowerment_my_requests: {
        Args: never
        Returns: {
          admin_note: string
          category: string
          created_at: string
          district: string
          id: number
          outcome_note: string
          referral_organization: string
          request_number: string
          request_type: string
          service_name_hi: string
          short_need: string
          state: string
          status: string
          updated_at: string
        }[]
      }
      youth_empowerment_request_submit: {
        Args: {
          p_age_years: number
          p_alternate_phone: string
          p_applicant_name: string
          p_category: string
          p_consent_to_contact: boolean
          p_contact_phone: string
          p_details: string
          p_district: string
          p_education_level: string
          p_email: string
          p_member_id?: string
          p_pincode: string
          p_preferred_mode: string
          p_request_type: string
          p_service_code: string
          p_short_need: string
          p_state: string
          p_urgency: string
        }
        Returns: {
          request_id: number
          request_number: string
          status: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
