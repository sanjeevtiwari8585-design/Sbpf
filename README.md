# SBPF Seva

Swarnim Bharat Parivar Foundation — public site and member portal using GitHub Pages for static web delivery and the existing Supabase project for authentication, data, RLS policies, RPCs, Storage, and Edge Functions.

## Current public routes

- Home page: https://sanjeevtiwari8585-design.github.io/Sbpf/
- Member entry: https://sanjeevtiwari8585-design.github.io/Sbpf/member.html
- Member panel: https://sanjeevtiwari8585-design.github.io/Sbpf/member-panel.html
- Admin family review: https://sanjeevtiwari8585-design.github.io/Sbpf/admin-family.html
- Campaign details and public content: https://sanjeevtiwari8585-design.github.io/Sbpf/campaign.html?slug=swarnim-jan-jagran (open any campaign from the home page to see its detail page)
- Campaign 09 — SwarnimBook: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-book.html (social posts, media links, profiles, likes, comments, follows using existing `swarnim_book_*` tables and RLS).
- Campaign 10 — Swarnim Media / SMLive News: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-media/ (existing news, articles, videos, photos and journalist dashboard module).

The admin family route is not protected by a hidden URL; its actual data access and review operations are guarded by Supabase RPCs that require an authenticated admin.

## Current integrated workflows

- Public home page loads active work areas from `public.focus_areas` and active Swarnim campaigns from `public.campaigns`, with static fallback content if the public API cannot load.
- Member account creation starts through Supabase Auth signup and uses existing `register_my_member` RPC metadata after the user authenticates. Member login uses email and password.
- Member profile editing uses `update_my_member_profile_v2`; additional member fields are read only for the authenticated owner under the existing `members_select_own` RLS policy.
- Family register uses the existing `register_my_pariwar` RPC and the existing family tables. Family records are owner-scoped. Existing family records remain read-only in the current UI until a safe edit path preserves related education, income, health, and document rows.
- Potential government-scheme matching uses `get_my_family_scheme_candidates` only after explicit scheme, income-use, and accuracy consent. Matching is indicative only; it is not a government eligibility decision.
- KYC uploads use the existing `kyc-upload` Edge Function. Accepted files are JPG/PNG/PDF up to 5 MB; submission is not the same as verification.
- Digital ID and issued certificate pages use existing authenticated Supabase Edge Functions.
- Admin family review uses `admin_list_member_pariwar` and `admin_review_member_pariwar`, which enforce the server-side `is_admin()` check.
- Referral links use the current GitHub Pages member route. After the domain is configured and verified, update the referral base URL to the final custom domain.

## Deployment and checks

The GitHub Actions workflow at `.github/workflows/pages.yml` publishes the repository using GitHub Pages. Before publishing, it extracts inline JavaScript blocks from HTML pages and runs `node --check` on each block. A failed syntax check prevents that deployment from proceeding.

## Important operational blockers

- The complete Floot source export and all Floot-hosted binary assets have **not** been fully migrated into this repository. This repository is the GitHub-hosted implementation currently being built against the existing Supabase backend.
- Email OTP/signup may fail until the sender domain is verified in Resend and Supabase Auth SMTP settings are corrected. Previous logs showed an unverified sender-domain error.
- WhatsApp OTP has not been verified; a previous Twilio log reported an invalid Content SID.
- A live sign-in with a real member/admin account, a real KYC file upload, certificate issuance, payment confirmation, and custom-domain DNS/TLS have not been end-to-end tested from a user's browser in this workflow.
- `swarnimbharatclub.in` is not configured as the live GitHub Pages custom domain yet. Do not add the final domain configuration until its DNS target can be set at the active DNS provider.
- Do not commit Supabase service-role keys, OTP secrets, SMTP credentials, or payment gateway secrets. The static frontend must use only the public publishable key; server-side secrets remain in Supabase Edge Function secrets.

## Supabase data safety

No tables were recreated and no existing member or family data was deleted during these frontend changes. Use the existing RLS policies and RPCs; do not expose family, KYC, income, health, or identity-document data on public pages.


## EMS workflow (feature branch)

The EMS interface is being built against the existing Supabase EMS tables and RLS policies. No schema reset or existing data migration is part of this frontend change.

- `ems.html` — school registration, SBPF Member ID linking for student/teacher/school roles, attendance, fee records, and school events.
- `ems-academics.html` — report-card drafts, student ID-card records, certificate records, and teacher salary records.
- `ems-hms-admin.html` — separate read-only EMS/HMS administration overview.
- All pages use the existing Supabase project and public publishable key; the logged-in user's access token is sent with requests. The database's RLS policies remain the access-control boundary.
- The member-link form uses the existing `ems_admin_link_member` RPC rather than creating an unrelated member identity.
- Student ID and certificate verification tokens are generated by the existing database defaults, not in frontend JavaScript.

### Verification status

GitHub Actions syntax validation passed for the EMS pages on the feature branch. This validates inline JavaScript syntax and expected files only; it does not prove a successful authenticated workflow against Supabase. Test school-admin and SBPF-admin permissions with authorized accounts before merging. No change has been deployed from this feature branch.
