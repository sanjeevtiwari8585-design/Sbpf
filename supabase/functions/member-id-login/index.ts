import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo";
const allowedOrigins = new Set(["https://sanjeevtiwari8585-design.github.io", "https://www.swarnimbharat.club", "https://swarnimbharat.club", "https://swarnimbharatclub.in", "https://www.swarnimbharatclub.in"]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://sanjeevtiwari8585-design.github.io",
  "Vary": "Origin",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
});
const json = (body: unknown, status = 200, origin: string | null = null) => new Response(JSON.stringify(body), { status, headers: cors(origin) });

async function retryFutureJwt<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  let result = await operation();
  for (let attempt = 0; attempt < retries && (result as any)?.error?.code === "PGRST303"; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    result = await operation();
  }
  return result;
}

async function hash(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "अनुरोध स्वीकार नहीं हुआ।" }, 405, origin);
  let memberId = "", password = "";
  try { const body = await req.json(); memberId = String(body?.member_id ?? "").trim().toUpperCase(); password = String(body?.password ?? ""); }
  catch { return json({ error: "Member ID और पासवर्ड भरें।" }, 400, origin); }
  if (!memberId || !password || memberId.length > 80 || password.length > 256) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 400, origin);
  const ip = (req.headers.get("x-forwarded-for") ?? req.headers.get("cf-connecting-ip") ?? "unknown").split(",")[0].trim().slice(0, 100);
  const ipHash = await hash(ip), idHash = await hash(memberId);
  if (!URL || !SERVICE) {
    console.error("member-id-login configuration missing", { hasUrl: Boolean(URL), hasServiceRoleKey: Boolean(SERVICE) });
    return json({ error: "लॉगिन सेवा का सर्वर कॉन्फ़िगरेशन अधूरा है। एडमिन से संपर्क करें।" }, 503, origin);
  }
  let admin;
  try {
    admin = createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (e) {
    console.error("member-id-login admin client initialization failed", String(e));
    return json({ error: "लॉगिन सेवा अभी उपलब्ध नहीं है। एडमिन से संपर्क करें।" }, 503, origin);
  }
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const [ipAttempts, idAttempts] = await Promise.all([
    retryFutureJwt(() => admin.from("member_login_attempts").select("id").eq("ip_hash", ipHash).gte("attempted_at", since).limit(8)),
    retryFutureJwt(() => admin.from("member_login_attempts").select("id").eq("identifier_hash", idHash).gte("attempted_at", since).limit(5)),
  ]);
  if (ipAttempts.error || idAttempts.error) {
    console.error("member-id-login rate-limit query failed", {
      ipError: ipAttempts.error ? { message: ipAttempts.error.message, code: ipAttempts.error.code, details: ipAttempts.error.details, hint: ipAttempts.error.hint } : null,
      idError: idAttempts.error ? { message: idAttempts.error.message, code: idAttempts.error.code, details: idAttempts.error.details, hint: idAttempts.error.hint } : null
    });
    return json({ error: "लॉगिन सेवा अभी उपलब्ध नहीं है। कुछ देर बाद प्रयास करें।" }, 503, origin);
  }
  if ((ipAttempts.data?.length ?? 0) >= 8 || (idAttempts.data?.length ?? 0) >= 5) return json({ error: "बहुत बार प्रयास हुआ है। 15 मिनट बाद फिर प्रयास करें।" }, 429, origin);
  const recorded = await retryFutureJwt(() => admin.from("member_login_attempts").insert({ ip_hash: ipHash, identifier_hash: idHash }));
  if (recorded.error) {
    console.error("member-id-login attempt recording failed", recorded.error.message);
    return json({ error: "लॉगिन सेवा अभी उपलब्ध नहीं है।" }, 503, origin);
  }
  try {
    const { data: member, error: memberError } = await retryFutureJwt(() => admin.from("members").select("user_id").eq("member_id", memberId).not("user_id", "is", null).maybeSingle());
    if (memberError || !member?.user_id) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401, origin);
    const { data: authData, error: authError } = await admin.auth.admin.getUserById(member.user_id);
    const email = authData?.user?.email;
    if (authError || !email) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401);
    const publicClient = createClient(URL, PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await publicClient.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) return json({ error: "Member ID या पासवर्ड सही नहीं है।" }, 401);
    await Promise.all([retryFutureJwt(() => admin.from("member_login_attempts").delete().eq("ip_hash", ipHash).eq("identifier_hash", idHash)), retryFutureJwt(() => admin.from("member_login_attempts").delete().lt("attempted_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()))]);
    return json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, expires_in: data.session.expires_in, token_type: data.session.token_type, user: { id: data.user.id, email: data.user.email } }, 200, origin);
  } catch (e) {
    console.error("member-id-login unexpected failure", String(e));
    return json({ error: "लॉगिन अभी पूरा नहीं हो पाया। कुछ देर बाद प्रयास करें।" }, 500, origin);
  }
});
