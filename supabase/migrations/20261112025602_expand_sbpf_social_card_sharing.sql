-- Expand the existing SBPF card-share event table for all public card surfaces.
-- Existing share records are retained; no member or post data is modified.
alter table public.sbpf_card_social_shares
  drop constraint if exists sbpf_card_social_shares_card_type_check;

alter table public.sbpf_card_social_shares
  add constraint sbpf_card_social_shares_card_type_check
  check (card_type = any (array[
    'campaign',
    'focus_area',
    'campaign_content',
    'media_post',
    'swarnim_book_post'
  ]::text[]));

drop policy if exists "Public can record SBPF card share events"
  on public.sbpf_card_social_shares;

create policy "Public can record SBPF card share events"
on public.sbpf_card_social_shares
for insert
to anon, authenticated
with check (
  card_type = any (array[
    'campaign',
    'focus_area',
    'campaign_content',
    'media_post',
    'swarnim_book_post'
  ]::text[])
  and length(card_slug) between 1 and 120
  and length(card_title) between 1 and 240
  and platform = any (array[
    'share_sheet',
    'whatsapp',
    'facebook',
    'copy_link',
    'image_share',
    'text_share',
    'whatsapp_text',
    'whatsapp_fallback',
    'instagram',
    'telegram',
    'x'
  ]::text[])
);

create index if not exists sbpf_card_social_shares_created_at_idx
  on public.sbpf_card_social_shares (created_at desc);

create index if not exists sbpf_card_social_shares_card_lookup_idx
  on public.sbpf_card_social_shares (card_type, card_slug, created_at desc);
