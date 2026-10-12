# Swarnim AI Studio ↔ Swarnim Creator workflow

## GitHub Pages
- AI Studio: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-ai-studio.html
- Creator / authorized media download: https://sanjeevtiwari8585-design.github.io/Sbpf/swarnim-creator.html
- Repository: https://github.com/sanjeevtiwari8585-design/Sbpf

## User workflow
1. Open Swarnim AI Studio and enter the story/topic.
2. Select style, aspect ratio, Hindi voice settings, captions and duration (30–300 seconds).
3. Review/edit the script and test device Hindi speech synthesis.
4. Select “स्टोरी + हिंदी वॉइसओवर सेव करें” and wait for the signed audio URL. The TTS provider secret must already be configured server-side.
5. Select “वीडियो रेंडर + डाउनलोड” to render an animated branded WebM locally in the browser, with the saved Hindi audio and optional captions. Small exports (up to 50 MB) are also attempted in the user's private Supabase Storage folder and linked to the video job.
6. This is a motion-graphics renderer, not a photorealistic AI video model. MP4 export and generated moving footage are not included in this local renderer. If cloud saving fails, the downloaded WebM remains available.
6. Do not bypass YouTube/social platform restrictions or DRM; use the creator's own export or an authorized API.

## Current rendering boundary and next improvements
- Authenticate through the existing Supabase Auth project; never put service-role/provider secrets in browser code.
- The current browser renderer uses the existing authenticated story/voiceover workflow, draws animated branded scenes on a canvas, and records the canvas plus Hindi audio as WebM. It does not call an external AI video provider.
- The video job table and private `swarnim-video-exports` bucket are used for ownership-scoped records and optional cloud copies. The browser upload is limited to 50 MB; the app falls back to the local download if cloud saving fails.
- Next-stage improvements: server-side rendering for larger jobs, true generated scene footage, MP4/H.264 export, retry/resume, quotas and cleanup/retention.
- Never put service-role/provider secrets in browser code; provider credentials remain in Supabase Edge Function Secrets.
- Add quotas, size/time limits, cleanup/retention, failure states, and clear provider cost disclosures.
- Test signup/login, authorization, 30/60/180/300-second jobs, Hindi voiceover, captions, download on Android/desktop, and failure/retry before declaring production-ready.

## Deployment and safety
- Both HTML pages are in the existing main branch of the public Sbpf repository. GitHub Pages is the current static delivery path.
- Floot code editing was unavailable at the last fresh check because the daily build-action limit was reached. This GitHub commit does not edit or publish the separate Floot project.
- The browser WebM renderer has been added to the repository, but end-to-end generation, cloud upload and Android/device compatibility still require a real authenticated test. A 300-second selection does not guarantee every phone can render a five-minute file without memory or performance issues.
- Never commit API keys, Supabase service-role keys, SMTP credentials, or payment secrets.
