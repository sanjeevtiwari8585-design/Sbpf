# SBPF Seva

Swarnim Bharat Parivar Foundation — public site and member portal using GitHub Pages for static web delivery and the existing Supabase project for authentication, data, RLS policies, RPCs, Storage, and Edge Functions.

## Current public routes

- Home page: https://sanjeevtiwari8585-design.github.io/Sbpf/
- Member entry: https://sanjeevtiwari8585-design.github.io/Sbpf/member.html
- Member panel: https://sanjeevtiwari8585-design.github.io/Sbpf/member-panel.html
- Admin family review: https://sanjeevtiwari8585-design.github.io/Sbpf/admin-family.html
- Work-area admin: https://sanjeevtiwari8585-design.github.io/Sbpf/admin-work-areas.html (focus areas, published content, member request review, and work-area branding using Supabase RLS).
- Campaign details and public content: https://sanjeevtiwari8585-design.github.io/Sbpf/campaign.html?slug=swarnim-jan-jagran (open any campaign from the home page to see its detail page)
- Campaign 09 — SwarnimBook: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-book.html (social posts, media links, profiles, likes, comments, follows using existing `swarnim_book_*` tables and RLS).
- Campaign 10 — Swarnim Media / SMLive News: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-media/ (existing news, articles, videos, photos and journalist dashboard module).
- Five-level promotion matrix: https://sanjeevtiwari8585-design.github.io/Sbpf/promotion-plan.html (uses the existing server-side `sbpf_get_my_referral_dashboard` RPC for authenticated member eligibility, network counts, and digital reward records).

The admin family route is not protected by a hidden URL; its actual data access and review operations are guarded by Supabase RPCs that require an authenticated admin.

## Current integrated workflows

- Public home page loads active work areas from `public.focus_areas` and active Swarnim campaigns from `public.campaigns`, with static fallback content if the public API cannot load.
- Member registration follows the existing Step 1 flow: a user authenticates through Supabase Auth, then `register_my_member` validates the required profile fields and creates a pending member record. Do not revoke this RPC or disable signup without changing the approved member onboarding model. OTP/email delivery and real-account signup still require end-to-end verification.
- Member profile editing uses `update_my_member_profile_v2`; additional member fields are read only for the authenticated owner under the existing `members_select_own` RLS policy.
- Family register uses the existing `register_my_pariwar` RPC and the existing family tables. Family records are owner-scoped. Existing family records remain read-only in the current UI until a safe edit path preserves related education, income, health, and document rows.
- Potential government-scheme matching uses `get_my_family_scheme_candidates` only after explicit scheme, income-use, and accuracy consent. Matching is indicative only; it is not a government eligibility decision.
- KYC uploads use the existing `kyc-upload` Edge Function. Accepted files are JPG/PNG/PDF up to 5 MB; submission is not the same as verification.
- Digital ID and issued certificate pages use existing authenticated Supabase Edge Functions.
- Admin family review uses `admin_list_member_pariwar` and `admin_review_member_pariwar`, which enforce the server-side `is_admin()` check.
- Referral links are generated on the member's current site path so they continue to work under the GitHub Pages `/Sbpf/` subpath; after the custom domain is configured and verified, test and update the final base URL.
- The promotion matrix uses the existing secure RPC rather than enumerating `members` in the browser, because the existing member RLS policy only permits reading one's own member row.

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

GitHub Actions validates inline JavaScript syntax, required pages, promotion RPC wiring, and selected Supabase enum values. These checks do not prove authenticated reads/writes against Supabase. Test school-admin, hospital-admin, journalist, member and SBPF-admin workflows with authorized accounts before merging. Netlify's PR deploy preview is not production; `main` and GitHub Pages production remain unchanged until the PR is reviewed and merged.


- HMS diagnostic creation uses `hms_create_diagnostic_order`, an atomic server-side RPC that validates hospital role and patient scope, creates the required encounter, then creates the diagnostic order and test item together. Migration: `supabase/migrations/20261010130000_hms_secure_diagnostic_order_workflow.sql`.
