import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: corsHeaders });

function makeScenes(story: string, aspectRatio: "16:9" | "9:16" | "1:1") {
  const sentences = story.replace(/\s+/g, " ").split(/(?<=[।!?])\s*/).map(s => s.trim()).filter(Boolean);
  const parts = sentences.length ? sentences : [story.trim()];
  const count = Math.min(8, parts.length);
  const groups: string[][] = Array.from({ length: count }, () => []);
  parts.forEach((sentence, i) => groups[Math.min(count - 1, Math.floor(i * count / parts.length))].push(sentence));
  const framing = aspectRatio === "16:9"
    ? "Horizontal widescreen 16:9 cinematic composition, landscape framing, subjects and important action arranged across the frame, safe margins for subtitles"
    : aspectRatio === "1:1"
    ? "Square 1:1 cinematic composition, balanced centered framing, subjects and important action arranged clearly within a square frame, safe margins for subtitles"
    : "Vertical portrait 9:16 cinematic composition, portrait framing, subjects centered with safe margins for subtitles";
  return groups.map((items, i) => {
    const narration = items.join(" ");
    return {
      scene_number: i + 1,
      duration_seconds: 6,
      narration,
      caption: narration.length > 90 ? narration.slice(0, 87) + "…" : narration,
      aspect_ratio: aspectRatio,
      visual_prompt: framing + ", realistic Indian setting, warm natural light, authentic Indian people and clothing, emotionally expressive, detailed cinematic film still. Scene action: " + narration + ". No text in image, no watermark.",
      transition: i === 0 ? "fade_in" : "cross_dissolve"
    };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  let body: { title?: string; story_text?: string; aspect_ratio?: string; captions?: boolean; preview_only?: boolean };
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const story = typeof body.story_text === "string" ? body.story_text.trim() : "";
  if (story.length < 20 || story.length > 18000) return json({ error: "story_length_invalid", message: "Story must be 20 to 18000 characters." }, 400);

  const aspectRatio: "16:9" | "9:16" | "1:1" = body.aspect_ratio === "16:9" ? "16:9" : body.aspect_ratio === "1:1" ? "1:1" : "9:16";
  const scenes = makeScenes(story, aspectRatio);
  const title = (typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Swarnim AI Story").slice(0, 160);
  const storyboard = {
    title, language: "hi-IN", scene_count: scenes.length,
    estimated_duration_seconds: scenes.reduce((n, s) => n + s.duration_seconds, 0),
    scenes, captions_enabled: body.captions !== false, aspect_ratio: aspectRatio
  };

  if (body.preview_only === true) {
    return json({ success: true, mode: "preview_only", saved_to_database: false, storyboard, next_step: "Sign in to Swarnim AI Studio to save this storyboard as a video job." });
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return json({ error: "auth_required", message: "Sign in to Swarnim AI Studio to save this storyboard." }, 401);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!supabaseUrl || !publicKey) return json({ error: "supabase_environment_missing" }, 500);
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: publicKey, Authorization: authorization } });
  if (!userResponse.ok) return json({ error: "auth_required", message: "Your login session is not valid; please sign in again." }, 401);
  const user = await userResponse.json();
  if (!user?.id) return json({ error: "auth_required" }, 401);

  const row = {
    user_id: user.id, title, story_text: story, language: "hi-IN",
    voice_provider: "ttsfree", voice_name: "Divya", video_provider: "template-renderer",
    status: "script_ready", scenes,
    script_json: { ...storyboard, workflow: ["storyboard_ready", "voiceover", "visuals", "captions", "render"] },
    settings: { music: false, captions: body.captions !== false, resolution: "720p", aspect_ratio: aspectRatio },
    updated_at: new Date().toISOString()
  };
  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/sbpf_ai_video_jobs`, {
    method: "POST",
    headers: { apikey: publicKey, Authorization: authorization, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(row)
  });
  const resultText = await insertResponse.text();
  if (!insertResponse.ok) return json({ error: "job_create_failed", details: resultText.slice(0, 1200) }, 502);
  let rows: any;
  try { rows = JSON.parse(resultText); } catch { return json({ error: "invalid_database_response" }, 502); }
  const job = Array.isArray(rows) ? rows[0] : rows;
  return json({ success: true, mode: "saved", job_id: job?.id, status: "script_ready", storyboard, next_step: "Generate and save voiceover, then render visuals and captions. This endpoint creates the storyboard; it does not render the final video yet." }, 201);
});