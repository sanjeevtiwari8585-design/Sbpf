import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "vary": "origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});
function toBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  try {
    const base = Deno.env.get("SUPABASE_URL") || "https://dxowhzghrdghfzoggorx.supabase.co";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!serviceKey || !token) return json({ error: "Unauthorized" }, 401);

    const userResponse = await fetch(base + "/auth/v1/user", {
      headers: { apikey: serviceKey, Authorization: "Bearer " + token },
    });
    if (!userResponse.ok) return json({ error: "Invalid login session" }, 401);
    const user = await userResponse.json();
    const uid = user?.id;
    if (!uid) return json({ error: "Invalid login session" }, 401);

    const adminResponse = await fetch(base + "/rest/v1/admin_users?user_id=eq." + encodeURIComponent(uid) + "&select=user_id&limit=1", {
      headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey },
    });
    if (!adminResponse.ok || !(await adminResponse.json()).length) return json({ error: "Admin access required" }, 403);

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "Logo file required" }, 400);
    if (file.size > 2 * 1024 * 1024) return json({ error: "Logo must be 2 MB or smaller" }, 400);
    const allowed: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    if (!allowed[file.type]) return json({ error: "Only JPG, PNG or WEBP files are allowed" }, 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const path = "sbpf-logo." + allowed[file.type];
    const upload = await fetch(base + "/storage/v1/object/sbpf-assets/" + path, {
      method: "POST",
      headers: {
        apikey: serviceKey, Authorization: "Bearer " + serviceKey,
        "Content-Type": file.type, "x-upsert": "true",
      },
      body: bytes,
    });
    if (!upload.ok) return json({ error: "Logo storage upload failed" }, 502);
    const publicUrl = base + "/storage/v1/object/public/sbpf-assets/" + path;
    const asset = {
      asset_key: "sbpf-logo",
      asset_type: "image",
      mime_type: file.type,
      asset_content: toBase64(bytes),
      public_path: publicUrl,
      version: 1,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    const upsert = await fetch(base + "/rest/v1/branding_assets?on_conflict=asset_key", {
      method: "POST",
      headers: {
        apikey: serviceKey, Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(asset),
    });
    if (!upsert.ok) return json({ error: "Logo uploaded but brand record could not be updated" }, 502);

    const brandUpdate = await fetch(base + "/rest/v1/sbpf_brand_settings?id=eq.1", {
      method: "PATCH",
      headers: {
        apikey: serviceKey, Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json", Prefer: "return=minimal",
      },
      body: JSON.stringify({ logo_asset_key: "sbpf-logo", updated_at: new Date().toISOString(), updated_by: uid }),
    });
    if (!brandUpdate.ok) return json({ error: "Logo uploaded but global brand settings could not be updated" }, 502);
    return json({ success: true, asset_key: "sbpf-logo", url: publicUrl, message: "SBPF logo saved to the shared branding record" });
  } catch {
    return json({ error: "Server error while uploading logo" }, 500);
  }
});