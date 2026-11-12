-- Add first-class share analytics support for approved BVS marketplace cards.
-- The card-share table stores only public card metadata and the selected share method.
alter table public.sbpf_card_social_shares
  drop constraint if exists sbpf_card_social_shares_card_type_check;

alter table public.sbpf_card_social_shares
  add constraint sbpf_card_social_shares_card_type_check
  check (card_type = any (array[
    'campaign'::text,
    'focus_area'::text,
    'campaign_content'::text,
    'media_post'::text,
    'swarnim_book_post'::text,
    'bvs_listing'::text
  ]));

drop policy if exists "Public can record SBPF card share events"
  on public.sbpf_card_social_shares;

create policy "Public can record SBPF card share events"
on public.sbpf_card_social_shares
for insert
to anon, authenticated
with check (
  card_type = any (array[
    'campaign'::text,
    'focus_area'::text,
    'campaign_content'::text,
    'media_post'::text,
    'swarnim_book_post'::text,
    'bvs_listing'::text
  ])
  and length(card_slug) between 1 and 120
  and length(card_title) between 1 and 240
  and platform = any (array[
    'share_sheet'::text,
    'whatsapp'::text,
    'facebook'::text,
    'copy_link'::text,
    'image_share'::text,
    'text_share'::text,
    'whatsapp_text'::text,
    'whatsapp_fallback'::text,
    'instagram'::text,
    'telegram'::text,
    'x'::text
  ])
);
