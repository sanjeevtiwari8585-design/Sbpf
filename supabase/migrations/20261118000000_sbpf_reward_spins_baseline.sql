-- Reconstructed SBPF reward spins baseline
-- Source: read-only Production schema inspection.
-- Local Docker validation only. Never apply to Production.

CREATE TABLE IF NOT EXISTS public.sbpf_reward_spins (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    member_profile_id uuid NOT NULL,
    member_row_id bigint NOT NULL,
    prize_coins integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    wheel_number smallint NOT NULL DEFAULT 1,

    CONSTRAINT sbpf_reward_spins_pkey PRIMARY KEY (id),
    CONSTRAINT sbpf_reward_spins_member_profile_id_fkey
        FOREIGN KEY (member_profile_id)
        REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT sbpf_reward_spins_member_row_id_fkey
        FOREIGN KEY (member_row_id)
        REFERENCES public.members(id) ON DELETE RESTRICT,
    CONSTRAINT sbpf_reward_spins_prize_coins_check
        CHECK (prize_coins IN (11, 21, 51, 101, 251, 551, 1100, 2100, 5100, 11000, 21000, 51000)),
    CONSTRAINT sbpf_reward_spins_wheel_number_check
        CHECK (wheel_number >= 1 AND wheel_number <= 3)
);

CREATE INDEX IF NOT EXISTS sbpf_reward_spins_member_created_idx
ON public.sbpf_reward_spins (member_profile_id, created_at DESC);

ALTER TABLE public.sbpf_reward_spins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own spin history"
ON public.sbpf_reward_spins
FOR SELECT TO authenticated
USING (member_profile_id = (SELECT auth.uid()));

GRANT ALL PRIVILEGES ON TABLE public.sbpf_reward_spins
TO anon, authenticated, service_role;
