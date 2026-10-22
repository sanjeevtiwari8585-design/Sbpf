# SBPF Supabase → GitHub live sync report

Generated: 2026-10-22  
Existing Supabase project: `dxowhzghrdghfzoggorx`  
Backup branch: `supabase-live-sync-2026-10-22`

## Captured from the live project
- **219 public tables** inventoried; table names, RLS enabled state and approximate row counts recorded in `docs/supabase-live-inventory.json`.
- **32 active Edge Functions** inventoried with names, versions and JWT verification settings.
- **234 applied migrations** recorded in `supabase/migrations/live-migration-manifest.json`.
- Generated TypeScript database definitions written to `src/types/database.types.ts` (439,906 characters).

## Critical reconciliation gap
The repository currently contains **3 SQL migration files**, while the live project records **234 applied migrations**. The missing migration source must be reconstructed/recovered before GitHub can serve as a reproducible database rebuild. The current inventory and manifest are documentation/type snapshots, **not a full database backup** and must not be applied to production as migrations.

## Scope and safety
This sync exports schema metadata and generated TypeScript types only. It does not export user rows, member/KYC documents, patient/medical records, payment records, authentication secrets, API secrets, or service-role keys. The existing Supabase project remains the production source of truth; no new project/database was created or modified.

## Next reconciliation tasks
1. Recover/reconstruct the 231 missing migration SQL files in chronological order and validate against the live schema.
2. Back up Edge Function source code into `supabase/functions/<name>/index.ts` after scanning for embedded credentials.
3. Reconcile storage bucket policies, RLS policies, triggers, views, RPCs, and scheduled jobs against source control.
4. Run non-destructive type/build checks before any production deployment.
