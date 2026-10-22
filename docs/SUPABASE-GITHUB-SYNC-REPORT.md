# SBPF Supabase → GitHub live sync report

Generated: 2026-10-22  
Existing Supabase project: `dxowhzghrdghfzoggorx`  
Backup branch: `supabase-live-sync-2026-10-22`

## Transferred to GitHub
- **219 public tables** inventoried in `docs/supabase-live-inventory.json`, including RLS enabled state and approximate row counts.
- Generated database TypeScript definitions in `src/types/database.types.ts`.
- **32 live Edge Function source files** are now represented under `supabase/functions/<name>/index.ts`. Existing function files were retained; the missing live function sources were copied after checking for obvious embedded token formats.
- **234 applied migrations** recorded in `supabase/migrations/live-migration-manifest.json`.

## Important gap — database migration history
The repository still contains only **3 migration SQL files**, while the live project records **234 applied migrations**. The live migration names are recorded, but the other 231 SQL migration bodies have not yet been recovered/reconstructed. The JSON manifest and generated types are metadata/type snapshots, **not a full database backup** and cannot recreate the production database on their own.

## Safety and deployment
This work is on the separate branch `supabase-live-sync-2026-10-22`, not `main`, so it does not add another GitHub Pages deployment to the existing queue. The existing Supabase project remains the production source of truth; no new project/database was created and no production schema/data was changed. No user rows, KYC documents, patient records, payment records, or service-role keys were exported.

## Remaining reconciliation tasks
1. Recover/reconstruct the missing migration SQL in chronological order and validate against the live schema.
2. Capture/review storage policies, RLS policies, triggers, views, SQL functions, extensions and scheduled jobs in a non-sensitive schema-only snapshot.
3. Run non-destructive type/build checks before proposing a merge to `main`.
