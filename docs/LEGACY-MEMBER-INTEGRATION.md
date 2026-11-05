# Legacy member linking integration

This integration links an authenticated member account on `swarnimbharatclub.in` to a verified Member ID from the legacy `swarnimbharat.club` portal. It does not copy family, income, health, identity-document, Aadhaar, PAN, or payment records.

## Supabase Edge Function

Deploy `supabase/functions/legacy-member-link/index.ts` as `legacy-member-link` with JWT verification enabled.

Required server-side function secrets:
- `LEGACY_MEMBER_API_URL`: HTTPS base URL of the legacy API (no trailing slash).
- `LEGACY_MEMBER_API_KEY`: dedicated server-to-server credential issued by the legacy developer.

Existing Supabase runtime secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are also required. Never place these values in browser code, GitHub, or screenshots.

## Legacy developer API contract

Both routes must require `x-api-key` and accept JSON POST bodies.

### Start OTP
`POST /api/v1/member/otp/start`

Request: `{ "member_id": "SBPF..." }`

Success: `{ "otp_sent": true, "mobile_masked": "******1234" }`

The OTP must be sent by the legacy system to its already-registered mobile. Do not return the full number.

### Verify OTP
`POST /api/v1/member/otp/verify`

Request: `{ "member_id": "SBPF...", "otp": "123456" }`

Success:
```json
{
  "verified": true,
  "legacy_member_id": "SBPF...",
  "full_name": "Synthetic Test Member",
  "mobile_masked": "******1234",
  "membership_status": "active",
  "kyc_status": "verified"
}
```

Allowed membership statuses: `active`, `expired`, `suspended`, `pending`. Use 404 for unknown ID and 429 for rate limiting. OTP expiry, attempt limits, replay prevention, and delivery are the legacy server's responsibility.

## Frontend invocation

Call the function with the signed-in user's access token:
- `{ "action": "start_otp", "member_id": "..." }`
- `{ "action": "verify_otp", "member_id": "...", "otp": "..." }`

The function refuses to link unless the current authenticated user already has their own row in `public.members`. A legacy ID can be linked to only one current account. It stores only a minimal mapping and masked contact details.

## Family register

After a successful link, continue to use the current portal's existing `register_my_pariwar(p_family, p_members)` RPC and family tables. This link does not bypass current-site KYC, annual verification, RLS, or admin review. The current family-register UI and RPC remain the source of truth for the new portal's family records.

## Not production-ready until
1. Apply migration `20261105090000_legacy_member_links.sql` to the existing project `dxowhzghrdghfzoggorx`.
2. Deploy the Edge Function with JWT verification enabled.
3. Set both legacy API secrets in Supabase Function Secrets.
4. Legacy developer implements the exact HTTPS API contract above.
5. Add a member-panel UI for start OTP / enter OTP / show link status, then test using synthetic member IDs and authorized accounts.
