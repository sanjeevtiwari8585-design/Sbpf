# SBPF Media Download Worker

Container API for the SBPF Supabase media-download queue. Uses yt-dlp + FFmpeg, uploads outputs to the private `swarnim-video-exports` Supabase Storage bucket, and records assets in `public.media_download_assets`.

## Important status

This repository folder is deployment-ready source code, not a live deployed service. The worker cannot process jobs until it is deployed to a host that permits the intended media-processing use and its environment variables are configured. Do not deploy to a platform whose acceptable-use rules prohibit this workload.

## Endpoints

- `GET /health`: non-secret health/configuration status.
- `POST /process/{job_id}`: process an existing job. Requires header `X-Worker-Token`. The worker reads the URL from the database; it does not accept an arbitrary URL in the API request.

The worker requires `rights_confirmed=true` on the job. Use it only for media you own or have permission to download. It does not intentionally bypass DRM, paywalls, or access controls.

## Required environment variables

Configure these in the hosting dashboard's secret/environment settings, never in Git:

- `SUPABASE_URL`: project URL for the SBPF Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY`: service-role secret. Treat as highly sensitive; it bypasses RLS.
- `WORKER_TOKEN`: long random secret shared only with the trusted caller.
- `SUPABASE_STORAGE_BUCKET`: defaults to `swarnim-video-exports`.
- `MAX_DOWNLOAD_BYTES`: defaults to 50 MiB to match the current bucket cap.
- `DOWNLOAD_TIMEOUT_SECONDS`: defaults to 900 seconds.

## Build

Build with Docker from this directory. The container installs FFmpeg and yt-dlp. Keep yt-dlp updated and review platform acceptable-use rules before deploying.

## Integration still required

The Supabase request Edge Function must be configured with the worker URL and worker token to dispatch new queued jobs. Those secrets must be configured through the Supabase dashboard/secret manager; they must never be added to source code. The gallery Edge Function can then provide signed URLs for ready assets.
