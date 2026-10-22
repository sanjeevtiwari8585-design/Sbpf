import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: corsHeaders });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const apiKey = Deno.env.get("TTSFREE_API_KEY");
  if (!apiKey) return json({
    error: "voice_provider_not_configured",
    message: "Add TTSFREE_API_KEY in Supabase Edge Function Secrets.",
    setup_url: "https://supabase.com/dashboard/project/dxowhzghrdghfzoggorx/functions/secrets"
  }, 503);

  let body: { text?: string; speaker?: string; emotion?: string; rate?: number; save_to_storage?: boolean; job_id?: string };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 18000) {
    return json({ error: "text_required", message: "Text must be between 1 and 18000 characters." }, 400);
  }

  const allowedSpeakers = new Set(["Divya", "Rohit", "Anjali"]);
  const speaker = allowedSpeakers.has(body.speaker ?? "") ? body.speaker! : "Divya";
  const rate = typeof body.rate === "number" && body.rate >= 0.7 && body.rate <= 1.3 ? body.rate : 1.0;
  const emotion = typeof body.emotion === "string" ? body.emotion.slice(0, 30) : "Neutral";

  try {
    const providerResponse = await fetch("https://ttsfree.in/api/tts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "audio/wav, audio/*, application/octet-stream, application/json",
      },
      body: JSON.stringify({ text, language: "Hindi", speaker, emotion, pitch: 1.0, rate }),
    });

    if (!providerResponse.ok) {
      const details = (await providerResponse.text()).slice(0, 1200);
      return json({ error: "voice_provider_error", provider_status: providerResponse.status, details }, 502);
    }

    const contentType = (providerResponse.headers.get("content-type") ?? "audio/wav").split(";")[0].trim();
    if (contentType.includes("application/json")) {
      const payload = await providerResponse.json();
      return json({ error: "unexpected_provider_response", provider_response: payload }, 502);
    }

    const audio = await providerResponse.arrayBuffer();
    if (audio.byteLength === 0) return json({ error: "empty_audio" }, 502);

    if (body.save_to_storage === true) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
      const authorization = req.headers.get("Authorization") ?? "";
      if (!supabaseUrl || !publicKey || !authorization.startsWith("Bearer ")) {
        return json({ error: "user_auth_required", message: "Sign in to Swarnim AI Studio before saving voiceover." }, 401);
      }

      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: publicKey, Authorization: authorization },
      });
      if (!userResponse.ok) return json({ error: "user_auth_required", message: "Valid signed-in user session required to save audio." }, 401);
      const user = await userResponse.json();
      if (!user?.id) return json({ error: "user_auth_required" }, 401);

      const extension = contentType.includes("mpeg") || contentType.includes("mp3") ? "mp3"
        : contentType.includes("ogg") ? "ogg"
        : contentType.includes("webm") ? "webm" : "wav";
      const objectPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/swarnim-voiceovers/${objectPath}`, {
        method: "POST",
        headers: {
          apikey: publicKey,
          Authorization: authorization,
          "Content-Type": contentType,
          "x-upsert": "false",
        },
        body: audio,
      });
      if (!uploadResponse.ok) {
        const details = (await uploadResponse.text()).slice(0, 1000);
        return json({ error: "audio_storage_failed", details }, 502);
      }

      let signedUrl: string | null = null;
      const signResponse = await fetch(`${supabaseUrl}/storage/v1/object/sign/swarnim-voiceovers/${objectPath}`, {
        method: "POST",
        headers: { apikey: publicKey, Authorization: authorization, "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn: 3600 }),
      });
      if (signResponse.ok) {
        const signed = await signResponse.json();
        const signedPath = signed.signedURL ?? signed.signedUrl;
        if (signedPath) signedUrl = signedPath.startsWith("http") ? signedPath : `${supabaseUrl}/storage/v1${signedPath.startsWith("/") ? "" : "/"}${signedPath}`;
      }

      if (body.job_id) {
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/sbpf_ai_video_jobs?id=eq.${encodeURIComponent(body.job_id)}&user_id=eq.${encodeURIComponent(user.id)}`, {
          method: "PATCH",
          headers: {
            apikey: publicKey,
            Authorization: authorization,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ voiceover_url: `storage://swarnim-voiceovers/${objectPath}`, voice_provider: "ttsfree", voice_name: speaker, status: "voice_ready", error_message: null, updated_at: new Date().toISOString() }),
        });
        if (!updateResponse.ok) {
          const details = (await updateResponse.text()).slice(0, 1000);
          return json({ error: "job_update_failed", audio_path: objectPath, details }, 502);
        }
        const updated = await updateResponse.json();
        if (!Array.isArray(updated) || updated.length === 0) {
          return json({ error: "job_not_found_or_not_owned", audio_path: objectPath }, 404);
        }
      }

      return json({
        success: true,
        provider: "TTSFree",
        audio_saved: true,
        bucket: "swarnim-voiceovers",
        audio_path: objectPath,
        signed_url: signedUrl,
        signed_url_expires_in: 3600,
        job_id: body.job_id ?? null,
        message: "Hindi voiceover generated and saved to private Supabase Storage.",
      });
    }

    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Length": String(audio.byteLength),
        "Content-Disposition": 'attachment; filename="swarnim-hindi-voiceover.wav"',
        "Cache-Control": "no-store",
        "X-Voice-Provider": "TTSFree",
      },
    });
  } catch (error) {
    return json({ error: "voiceover_request_failed", message: error instanceof Error ? error.message : "Unknown provider error" }, 502);
  }
});