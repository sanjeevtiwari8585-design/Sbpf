# SBPF Reward Zone — Safe Release Runbook

Date: 2026-11-19  
Branch: `reward-zone-rules-180`  
PR: #30 — draft, not merged  
Production Supabase project: `dxowhzghrdghfzoggorx`

## Release policy

- Existing SBPF Supabase project remains the only source of truth.
- Do not create or use the separate Bharat Awas Developers project for SBPF.
- Do not merge PR #30, apply migrations, or deploy the Reward Zone until the release gates below pass and the owner explicitly approves production changes.
- Never use real member, wallet, Coin, bank, or payment data in tests.
- Do not store plaintext bank account numbers, wallet PINs, service-role keys, or private encryption keys in GitHub or browser code.

## Verified state on 2026-11-19

- The connected SBPF Supabase account lists project `dxowhzghrdghfzoggorx`.
- A second connected Supabase account lists `nirtsbovpqdajabzizij`, identified separately as Bharat Awas Developers; it is not an SBPF sandbox.
- Read-only query of `supabase_migrations.schema_migrations` found existing versions `20261119085123` and `20261119085334`; it did not find the staged Reward Zone versions `20261119000100` through `20261119000900`.
- Therefore the nine staged Reward Zone migrations have not been applied to the SBPF database.
- PR #30 is open, draft, mergeable, and not merged. It targets `main`.
- No deployment or production wallet/payment mutation was performed as part of this verification.

## Mandatory release gates

### 1. Disposable database

Provision a disposable non-production Supabase project from a current schema snapshot. Use synthetic member identities, synthetic wallets, fake bank ciphertext, and no live payment rails. Confirm the project ref before running any SQL. Do not treat the separate Bharat Awas Developers project as disposable test infrastructure.

### 2. Migration validation

Run migrations `20261119000100` through `20261119000900` sequentially in the disposable database only. Stop on the first error. Verify:

- Legacy redemption records remain readable and unchanged.
- Spin prize constraint supports exactly the configured 12 prize values.
- Prize probability totals equal 10,000 basis points.
- Cooldown is three hours, with no daily cap and no carry-forward.
- Spin reward, history, and ledger credit are atomic.
- Fixed withdrawal tiers and fees are exact.
- One open withdrawal request is enforced across pending and approved states.
- Finance queue only exposes paid-fee, unreviewed pending requests and masked bank data.
- Finance self-review and registered-family conflicts are rejected.
- Main Admin final authority and payout marking rules are enforced.
- Approved cancellation produces exactly one reversal; pending cancellation produces no debit/refund.
- Paid, rejected, and cancelled requests cannot be reopened.
- Existing wallet balances and historical ledger rows are unchanged by migration application.

### 3. Security review

Review every new SECURITY DEFINER function for:
- fixed and safe search_path;
- explicit authentication checks;
- server-side role checks;
- member ownership checks;
- least-privilege EXECUTE grants;
- no browser/service-role secret exposure;
- no full bank account number or ciphertext in Finance queue responses.

The live Security Advisor baseline also reports existing project-wide findings: four RLS-enabled tables without policies, one SECURITY DEFINER view, pg_trgm in public, 12 anon-executable and 172 authenticated-executable SECURITY DEFINER functions, and leaked-password protection disabled. These are not attributed to this branch. Triage them individually; do not apply blanket grants/revokes.

### 4. Bank encryption and payout controls

Before enabling bank entry:
- implement browser-side public-key encryption with an audited WebCrypto design;
- keep the private key outside GitHub, frontend code, and exposed database tables;
- document authorized key holders, offline backup/recovery, rotation, revocation, and incident response;
- test with fake ciphertext only.

Fee collection gateway, payout integration, receipts, and notifications are not connected. Manual fee-status recording is not proof of a payment. Do not claim a request is paid without a verified bank transaction reference and payment date.

### 5. Frontend QA

Test member, Main Admin, Finance Team, and unauthorized sessions separately:
- member code/PIN login and logout;
- one active device/session policy;
- member-only balance, ledger, and history visibility;
- blocked-member behavior;
- spin cooldown and result history;
- Finance queue and no-repeat-review behavior;
- final approval, rejection, cancellation, and paid display;
- mobile and desktop layouts;
- Hindi/English language persistence;
- no test-only bypass or hardcoded credentials in production build.

### 6. Production release sequence

Only after all disposable-database tests and security review pass:
1. Publish test results and reviewed migration diff in the PR.
2. Obtain explicit owner approval for production migration.
3. Take and verify a production backup/restore point.
4. Apply migrations sequentially to the existing SBPF project only.
5. Run post-migration schema, RLS, advisor, and wallet-ledger integrity checks.
6. Obtain separate explicit approval to merge PR #30.
7. Merge to `main`, verify GitHub Pages workflow and custom-domain deployment.
8. Smoke-test `https://swarnimbharatclub.in/` and Rewards Zone with authorized test accounts.
9. Keep cash withdrawal disabled until encryption, gateway/payout, notification, receipt, legal, tax, and compliance gates are complete.

## Current blockers

- No disposable SBPF sandbox project is currently connected.
- The nine staged migrations have not been executed in any sandbox.
- Bank public-key encryption/private-key custody is not implemented.
- Payment gateway, bank payout, notifications, and receipts are not connected.
- No end-to-end authenticated UI test has been completed.\n- Current Rewards entry gate still hard-codes the single test member ID `SBPF2026000050`; it is not a production member login. The existing `member-id-login` Edge Function authenticates with Member ID + account password, which does not match the approved Member ID + 4-digit PIN login rule. Do not open the page to all members until this mismatch is resolved with a reviewed authentication design.\n- Added `supabase/tests/reward_zone_static_contract.sql`; run it only after migrations are applied to a disposable sandbox. It checks static prize, odds, cooldown, Finance queue, and fixed-tier contracts; it does not replace behavioral/auth/RLS tests.

This runbook is a release control document, not evidence that the listed tests have passed.
