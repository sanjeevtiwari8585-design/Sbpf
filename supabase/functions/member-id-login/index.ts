import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
async function hash(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "अनुरोध स्वीकार नहीं हुआ।" }, 405);
  let memberId = "", password = "";
  try { const body = await req.json(); memberId = String(body?.member_id ?? "").trim().toUpperCase(); password = String(body?.password ?? ""); }
  catch { return json({ error: "Member ID और पासवर्ड भरें।" }, 400); }
  if (!memberId || !password || memberId.length > 80 || password.length > 256) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 400);
  const ip = (req.headers.get("x-forwarded-for") ?? req.headers.get("cf-connecting-ip") ?? "unknown").split(",")[0].trim().slice(0, 100);
  const ipHash = await hash(ip), idHash = await hash(memberId);
  const admin = createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const [ipAttempts, idAttempts] = await Promise.all([
    admin.from("member_login_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("attempted_at", since),
    admin.from("member_login_attempts").select("id", { count: "exact", head: true }).eq("identifier_hash", idHash).gte("attempted_at", since),
  ]);
  if (ipAttempts.error || idAttempts.error) return json({ error: "लॉगिन सेवा अभी उपलब्ध नहीं है। कुछ देर बाद प्रयास करें।" }, 503);
  if ((ipAttempts.count ?? 0) >= 8 || (idAttempts.count ?? 0) >= 5) return json({ error: "बहुत बार प्रयास हुआ है। 15 मिनट बाद फिर प्रयास करें।" }, 429);
  const recorded = await admin.from("member_login_attempts").insert({ ip_hash: ipHash, identifier_hash: idHash });
  if (recorded.error) return json({ error: "लॉगिन सेवा अभी उपलब्ध नहीं है।" }, 503);
  try {
    const { data: member, error: memberError } = await admin.from("members").select("user_id").eq("member_id", memberId).not("user_id", "is", null).maybeSingle();
    if (memberError || !member?.user_id) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401);
    const { data: authData, error: authError } = await admin.auth.admin.getUserById(member.user_id);
    const email = authData?.user?.email;
    if (authError || !email) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401);
    const publicClient = createClient(URL, PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await publicClient.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401);
    await admin.from("member_login_attempts").delete().lt("attempted_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    return json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, expires_in: data.session.expires_in, token_type: data.session.token_type, user: { id: data.user.id, email: data.user.email } });
  } catch { return json({ error: "लॉगिन अभी पूरा नहीं हो पाया। कुछ देर बाद प्रयास करें।" }, 500); }
});
