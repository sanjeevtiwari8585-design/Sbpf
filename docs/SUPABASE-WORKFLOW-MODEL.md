# SBPF website + Supabase workflow model

Generated: 2026-10-11. Supabase project ref: `dxowhzghrdghfzoggorx`.

## Files in this repository
- `app-model.html` — responsive public-facing app model. It attempts read-only requests for active campaigns and published government schemes through Supabase REST using the publishable key. If RLS/API access denies a request, it displays fallback campaign copy and an honest unavailable status.
- `index.html` — existing home page; preserved.
- `member.html`, `member-panel.html` and other existing routes — preserved. Public model links to the existing member entry; it does not add public self-signup.
- `.github/workflows/pages.yml` — existing push-to-main GitHub Pages workflow with inline-JS and local-link checks. Preserved.
- `supabase/functions/sbpf-ai-chat/index.ts` — source archive for deployed SBPF AI chat function.
- `docs/supabase-schema-inventory.json` — safe schema metadata only (selected table names, approximate row counts, RLS flags). It is not a database backup.

## Data and workflows mapped from the existing backend

| Area | Tables / data families observed | Intended workflow |
|---|---|---|
| Organization homepage | `campaigns`, `focus_areas`, `branding_assets`, `sbpf_brand_settings`, `sbpf_work_area_branding` | Load active/public organization content and brand assets; never hardcode member-private data into the public page. |
| Membership | `profiles`, `members`, `memberships`, membership payments/certificates/referral rules | Admin creates member account (no public self-signup) → member login → profile completion → KYC submission → admin review → ID/certificate → payment verification where configured. Each step must be checked against the real function/RLS rules before being described as operational. |
| Eight campaigns | `campaigns`, `campaign_categories`, `campaign_content`, `campaign_member_access` | Admin manages campaign/categories/content → approved/public content displayed → protected campaign tools require authenticated, authorized members. |
| Education / Gurukulam | education categories, content, resources, teachers, enrollments, resource access, scholarship data | Teacher/admin creates content → review/approval → publish → students view allowed resources; student records and application documents remain private. |
| Jan Samvad / complaints | `samvad_regions`, `samvad_officers`, `samvad_complaints`, `samvad_actions`, `samvad_transfer_history`, `samvad_pincodes`, plus general complaints | Submit complaint → region/pincode routing where configured → authorized officer actions → status/history/escalation. Current row counts show several operational tables empty; routing must not be claimed live until tested. |
| Seva requests | `seva_categories`, `seva_requests`, `seva_assignments`, `seva_request_updates`, `seva_feedback`, `seva_rulebook` | Request intake → assignment → update/status → feedback; enforce requester/officer/admin access in RLS and server functions. |
| Government schemes | `government_schemes`, `sbpf_scheme_categories`, `sbpf_scheme_focus_areas`, `sbpf_scheme_sources`, sync metadata | Source/sync → verify freshness → publish approved scheme → show public record with official source link. Do not imply all records are current without verification. |
| Government directory | `sbpf_government_regions`, district/directory records and source/sync settings | Maintain sourced records → review freshness → publish verified public contact data only. |
| Media / community | `news`, `videos`, media categories/posts, campaign/work-area content and social families | Author/admin review → publish → public read; private messages, reports, member profiles and moderation/audit data are not public. |
| EMS | `ems_*` families | School setup → authorized school users → student/teacher records → attendance/fees/events; tenant and role boundaries required. |
| HMS | `hms_*` families | Hospital setup → authorized staff → appointments/encounters/clinical records/billing; sensitive medical and billing data must never be public. |
| Teams / referrals | `sbpf_teams`, team membership/activities, referral rules/rewards | Admin creates teams/assigns members → activity tracking → referral calculation/review; protect member details and admin audit trails. |
| Automation | `automation_rules`, `automation_runs`, feature flags/events/integrations | Rule enabled → trigger/schedule → run → result/error log. A rule row alone does not prove a cron/trigger is working; test each live run. |
| AI support | `sbpf_ai_knowledge` plus active public campaign/work-area/scheme/directory data | Question → public knowledge/context retrieval → AI answer; no private member, KYC, patient, payment, or admin data. OpenAI key stays in server-side secrets only. |

## Edge Function inventory previously observed as ACTIVE
Names include: `verify-member`, `member-id-card`, `member-dashboard`, `member-registration`, `admin-panel`, `kyc-upload`, `admin-kyc-panel`, `member-profile`, `member-certificate`, `verify-certificate`, `admin-logo-upload`, `admin-member-detail`, `admin-members-v5`, `admin-education`, `teacher-dashboard`, `sbpf-portal`, `swarnim-samvad`, `admin-login`, `media-video-auto-review`, `media-auto-review`, `sbpf-scheme-sync`, `payu-create-checkout`, `payu-response`, `payu-verify-payment`, and `sbpf-ai-chat`.

“ACTIVE” means the Edge Function deployment exists; it does not certify the whole user workflow, permissions, payment callback, secrets, or frontend integration. Audit functions/RLS before production claims.

## Security and scope constraints
- Repository is public. Never commit database row exports, names/mobile/email/address of members, KYC or family documents, patient/medical data, salaries, payment transaction data, secrets, private API credentials, or Supabase service-role keys.
- A Supabase publishable/anon key is intended for client-side use, but data access still depends on RLS. The app model uses only the publishable key and requests public fields.
- Keep membership fee off the public website.
- Do not remove existing website or member-panel features while adding the model.
- Keep the existing `CNAME` for `swarnimbharatclub.in` unchanged.
- Do not call this a full backup or full live integration. This commit adds a model and architecture map; it does not migrate the database itself.

## Validation checklist
1. Open `/Sbpf/app-model.html` after the GitHub Pages workflow completes.
2. Confirm the model reports successful Supabase public-data loading, or inspect browser/network errors and table RLS policies.
3. Check all campaign and scheme cards on mobile and desktop.
4. Test login, KYC, membership ID/certificate, payment callbacks, complaints, education, EMS/HMS and admin flows using test accounts only.
5. Verify GitHub Actions status and deployed Pages URL before announcing production readiness.
