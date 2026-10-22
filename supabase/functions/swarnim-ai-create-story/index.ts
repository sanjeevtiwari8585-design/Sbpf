import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return json({ error: "auth_required", message: "Sign in to Swarnim AI Studio before creating and saving a story." }, 401);

  let body: { title?: string; story_text?: string; aspect_ratio?: string; captions?: boolean; generate_voiceover?: boolean; speaker?: string; voice_speed?: number; voice_emotion?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }

  const story = typeof body.story_text === "string" ? body.story_text.trim() : "";
  if (story.length < 20 || story.length > 18000) return json({ error: "story_length_invalid", message: "Story must be 20 to 18000 characters." }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!supabaseUrl || !publicKey) return json({ error: "supabase_environment_missing" }, 500);

  const baseHeaders = { apikey: publicKey, Authorization: authorization, "Content-Type": "application/json" };
  const storyboardResponse = await fetch(`${supabaseUrl}/functions/v1/swarnim-ai-storyboard`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      title: body.title ?? "Swarnim AI Story",
      story_text: story,
      aspect_ratio: body.aspect_ratio === "16:9" ? "16:9" : "9:16",
      captions: body.captions !== false,
      preview_only: false
    })
  });
  const storyboardText = await storyboardResponse.text();
  let storyboard: any;
  try { storyboard = JSON.parse(storyboardText); } catch { return json({ error: "storyboard_invalid_response", details: storyboardText.slice(0, 500) }, 502); }
  if (!storyboardResponse.ok || !storyboard.success) return json({ error: "storyboard_failed", details: storyboard }, storyboardResponse.status || 502);

  if (body.generate_voiceover === false) {
    return json({ success: true, status: "script_ready", job_id: storyboard.job_id, storyboard: storyboard.storyboard, voiceover: "skipped", message: "Story and storyboard saved. Voiceover was skipped by request." }, 201);
  }

  const voiceResponse = await fetch(`${supabaseUrl}/functions/v1/swarnim-ai-voiceover`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      text: story,
      speaker: body.speaker ?? "Divya",
      emotion: body.voice_emotion === "Neutral" ? "Neutral" : "Confident",
      rate: typeof body.voice_speed === "number" && body.voice_speed >= 0.7 && body.voice_speed <= 1.3 ? body.voice_speed : 1.0,
      save_to_storage: true,
      job_id: storyboard.job_id
    })
  });
  const voiceText = await voiceResponse.text();
  let voice: any;
  try { voice = JSON.parse(voiceText); } catch { voice = { raw_response: voiceText.slice(0, 300) }; }

  if (!voiceResponse.ok || !voice.success) {
    return json({
      success: false,
      status: "script_ready",
      job_id: storyboard.job_id,
      storyboard: storyboard.storyboard,
      voiceover_error: voice,
      message: "Storyboard saved, but voiceover generation/storage did not complete. The job remains available to retry."
    }, 207);
  }

  return json({
    success: true,
    status: "voice_ready",
    job_id: storyboard.job_id,
    storyboard: storyboard.storyboard,
    voiceover: {
      provider: voice.provider,
      audio_saved: voice.audio_saved,
      audio_path: voice.audio_path,
      signed_url: voice.signed_url,
      signed_url_expires_in: voice.signed_url_expires_in
    },
    video_status: "not_rendered",
    message: "Story and voiceover saved. Visual generation and final video rendering are the next step."
  }, 201);
});