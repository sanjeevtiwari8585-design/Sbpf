-- Reconstructed SBPF card share baseline
-- Based on read-only Production schema inspection.
-- Local Docker validation only. Do not apply to Production.

CREATE TABLE public.sbpf_card_social_shares (
    id bigint NOT NULL,
    card_type text NOT NULL,
    card_slug text NOT NULL,
    card_title text NOT NULL,
    platform text NOT NULL DEFAULT 'share_sheet',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT sbpf_card_social_shares_pkey PRIMARY KEY (id)
);

ALTER TABLE public.sbpf_card_social_shares ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES ON TABLE public.sbpf_card_social_shares
TO anon, authenticated, service_role;
