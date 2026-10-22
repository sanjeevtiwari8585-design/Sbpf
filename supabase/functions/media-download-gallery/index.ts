import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return json({ error: "GET required" }, 405);

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return json({ error: "Sign in required." }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) return json({ error: "Server configuration is incomplete." }, 500);

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: "Valid sign-in required." }, 401);

  const { data: jobs, error: jobsError } = await supabase
    .from("media_download_jobs")
    .select("id,source_url,source_platform,media_type,quality,status,error_message,created_at,completed_at,available_formats")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (jobsError) return json({ error: "Could not load your download history." }, 400);

  const { data: assets, error: assetsError } = await supabase
    .from("media_download_assets")
    .select("id,job_id,asset_type,format,quality,resolution,size_bytes,duration_seconds,storage_path,file_name,mime_type,status,metadata,created_at")
    .eq("user_id", user.id)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(200);
  if (assetsError) return json({ error: "Could not load your gallery." }, 400);

  const gallery = [];
  for (const asset of assets ?? []) {
    const { data: signed, error } = await supabase.storage
      .from("swarnim-video-exports")
      .createSignedUrl(asset.storage_path, 600);
    gallery.push({
      ...asset,
      download_url: error ? null : signed?.signedUrl ?? null,
      download_url_expires_in: 600,
    });
  }

  return json({
    success: true,
    jobs: jobs ?? [],
    gallery,
    message: "Private gallery loaded. Download links expire after 10 minutes.",
  });
});