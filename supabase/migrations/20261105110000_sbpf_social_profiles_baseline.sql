-- Reconstructed SBPF social profiles baseline
-- Based on read-only Production schema inspection.
-- Local Docker validation only. Do not apply to Production.

CREATE TABLE public.sbpf_social_profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    display_name text,
    bio text,
    avatar_url text,
    cover_url text,
    website_url text,
    is_verified boolean NOT NULL DEFAULT false,
    is_private boolean NOT NULL DEFAULT false,
    followers_count bigint NOT NULL DEFAULT 0,
    following_count bigint NOT NULL DEFAULT 0,
    posts_count bigint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sbpf_social_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_profile_public_select
ON public.sbpf_social_profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY social_profile_self_insert
ON public.sbpf_social_profiles
FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY social_profile_self_update
ON public.sbpf_social_profiles
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sbpf_social_profiles TO authenticated;
GRANT ALL ON public.sbpf_social_profiles TO service_role;
