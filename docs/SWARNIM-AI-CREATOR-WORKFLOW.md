# Swarnim AI Studio ↔ Swarnim Creator workflow

## GitHub Pages
- AI Studio: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-ai-studio.html
- Creator / authorized media download: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-creator.html
- Repository: https://github.com/sanjeevtiwari8585-design/Sbpf

## User workflow
1. Open Swarnim AI Studio and enter the story/topic.
2. Select style, aspect ratio, Hindi voice settings, captions and duration (30–300 seconds).
3. Review/edit the script and test device Hindi speech synthesis.
4. Current limitation: this static prototype generates a script/storyboard preview only. It does not render a real video file yet.
5. Once a real video-render backend returns a completed, authorized MP4/WebM URL, open Swarnim Creator and paste that direct media URL to open/download it.
6. Do not bypass YouTube/social platform restrictions or DRM; use the creator's own export or an authorized API.

## Backend integration required for true end-to-end generation
- Authenticate through the existing Supabase Auth project; never put service-role/provider secrets in browser code.
- Add a server-side Edge Function or trusted backend endpoint that validates the signed-in user, validates prompt/settings, creates a video job, and stores job status.
- Persist project/job metadata in a dedicated table with owner-scoped RLS; do not repurpose or weaken existing SBPF/member policies.
- The backend calls a selected video provider and a Hindi TTS provider, polls job status, stitches segments when provider limits require it, and stores the final MP4 in a private Supabase Storage bucket.
- Return a short-lived signed download URL only to the owning authenticated user. Creator should receive that URL only after the job is completed.
- Add quotas, size/time limits, cleanup/retention, failure states, and clear provider cost disclosures.
- Test signup/login, authorization, 30/60/180/300-second jobs, Hindi voiceover, captions, download on Android/desktop, and failure/retry before declaring production-ready.

## Deployment and safety
- Both HTML pages are in the existing main branch of the public Sbpf repository. GitHub Pages is the current static delivery path.
- Floot code editing was unavailable at the last fresh check because the daily build-action limit was reached. This GitHub commit does not edit or publish the separate Floot project.
- A 300-second setting in the UI is not proof the chosen AI video provider supports a single five-minute render. Actual render/download remains pending backend/provider integration and end-to-end testing.
- Never commit API keys, Supabase service-role keys, SMTP credentials, or payment secrets.
