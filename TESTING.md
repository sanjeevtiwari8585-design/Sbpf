# SBPF Testing Checklist

Use this checklist against the deployed test site and the existing Supabase project. Do not use real Aadhaar/PAN documents, real payments, or real family/medical data during testing.

## 1. Deployment and public site
- [ ] Homepage loads on desktop and mobile.
- [ ] SBPF logo and active work-area/campaign banners load.
- [ ] Navigation, footer links, member entry links, and page refresh work.
- [ ] No broken local links, missing assets, or JavaScript console errors.
- [ ] HTTPS and custom domain certificate work.

## 2. Authentication and member onboarding
- [ ] New test account can register and confirmation email arrives.
- [ ] Wrong password and unconfirmed email show a safe, understandable error.
- [ ] Login, logout, session refresh, and password reset work.
- [ ] Step 1 can create/login to an account without forcing payment.
- [ ] Member ID and referral code are created once and are unique.
- [ ] Duplicate registration does not create duplicate member records.
- [ ] A member cannot read or edit another member's profile.

## 3. Member profile, KYC, and family register
- [ ] Profile details save and reload correctly.
- [ ] Work area selection persists.
- [ ] KYC upload accepts allowed file types/sizes and rejects invalid files.
- [ ] Uploaded documents are not publicly accessible.
- [ ] A member can see only their own KYC status and family register.
- [ ] Family register can be saved, edited, and submitted for review.
- [ ] Admin-only KYC/family decisions reject non-admin users.

## 4. Membership, payments, ID card, and certificates
- [ ] Public website does not display membership fees.
- [ ] Payment flow is tested in gateway test mode only; never mark payment paid manually.
- [ ] Failed, pending, duplicate, and successful payment callbacks are handled safely.
- [ ] Membership activation requires verified payment and authorized admin action.
- [ ] QR/ID verification returns only intended public fields and correct active/suspended/expired status.
- [ ] Certificate issue requires eligibility; revoked certificates fail verification.
- [ ] QR tokens, verification tokens, payment secrets, and private document paths are not exposed in public pages/logs.

## 5. Admin, education, campaigns, and services
- [ ] Non-admin users cannot use admin RPCs or admin write actions directly.
- [ ] Admin members, referrals, KYC, payments, campaign access, and complaint views load.
- [ ] Teacher upload/approval flow works; students see only published/authorized material.
- [ ] All eight campaigns and active work areas load from Supabase.
- [ ] Swarnim Samvad complaint submission, tracking token, assignment, and escalation work.
- [ ] EMS school/student/teacher roles are isolated from other schools.
- [ ] HMS patient/clinical records are isolated to authorized hospital staff.
- [ ] Scheme sync requires its secret and only imports approved JSON feeds.

## 6. Database and security
- [ ] All public tables have RLS enabled.
- [ ] RLS policies enforce per-user and role-level access.
- [ ] SECURITY DEFINER functions verify authorization inside the database function.
- [ ] Service-role keys exist only in server-side secrets, never in HTML/client JavaScript.
- [ ] Supabase Auth leaked-password protection and email rate limits are reviewed.
- [ ] Supabase security/performance advisors are reviewed after changes.

## Test accounts and evidence
Create dedicated synthetic test accounts for member, teacher, admin, and (if applicable) separate school/hospital roles. Record pass/fail, date, browser/device, and a redacted error message. Never put passwords, OTPs, API secrets, access tokens, or real identity documents in screenshots/issues.

## Exit criteria
The project is ready for pilot testing only when all critical flows pass, all unauthorized-access tests fail safely, deployment checks pass, and the remaining non-critical warnings are documented. This checklist is not itself proof that each flow has passed.
