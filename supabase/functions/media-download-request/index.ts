import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedMediaTypes = new Set(["video", "audio", "both"]);
const allowedQualities = new Set(["best_available", "1080p", "720p", "480p", "audio_high"]);
const socialHosts = new Set([
  "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
  "instagram.com", "www.instagram.com",
  "facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch",
  "tiktok.com", "www.tiktok.com", "vm.tiktok.com",
  "x.com", "www.x.com", "twitter.com", "www.twitter.com",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Sign in is required." }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return new Response(JSON.stringify({ error: "Server configuration is incomplete." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Valid sign-in required." }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Request body must be JSON." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rawUrl = typeof body.source_url === "string" ? body.source_url.trim() : "";
  const mediaType = typeof body.media_type === "string" ? body.media_type : "both";
  const quality = typeof body.quality === "string" ? body.quality : "best_available";
  const rightsConfirmed = body.rights_confirmed === true;

  let parsed: URL;
  try { parsed = new URL(rawUrl); } catch {
    return new Response(JSON.stringify({ error: "Paste a valid https:// or http:// link." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password) {
    return new Response(JSON.stringify({ error: "Only standard public web URLs are accepted." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!allowedMediaTypes.has(mediaType) || !allowedQualities.has(quality)) {
    return new Response(JSON.stringify({ error: "Unsupported media type or quality option." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!rightsConfirmed) {
    return new Response(JSON.stringify({ error: "Confirm you own the media or have permission to download it." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const host = parsed.hostname.toLowerCase();
  const isSocialLink = [...socialHosts].some((domain) => host === domain || host.endsWith("." + domain));
  const status = isSocialLink ? "unsupported" : "queued";
  const note = isSocialLink
    ? "This social platform needs an authorized provider/API adapter before automated downloading can run."
    : "Request saved. A compatible download processor must be configured to fetch and prepare this media.";

  const { data, error } = await supabase.from("media_download_jobs").insert({
    user_id: user.id,
    source_url: parsed.toString(),
    source_platform: host,
    media_type: mediaType,
    quality,
    status,
    rights_confirmed: true,
    error_message: note,
  }).select("id, source_url, source_platform, media_type, quality, status, error_message, created_at").single();

  if (error) {
    return new Response(JSON.stringify({ error: "Could not save request.", detail: error.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    job: data,
    message: note,
    download_ready: false,
    next_step: "Connect an authorized media provider/processor, then expose a download button that saves the returned file to the user's device.",
  }), { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});