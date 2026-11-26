import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const allowedOrigins = new Set([
  "https://swarnimbharatclub.in",
  "https://www.swarnimbharatclub.in",
  "https://swarnimbharat.club",
  "https://www.swarnimbharat.club",
  "https://sanjeevtiwari8585-design.github.io",
]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://swarnimbharatclub.in",
  "Vary": "Origin",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
});
const reply = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), { status, headers: cors(origin) });

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return reply({ error: "METHOD_NOT_ALLOWED" }, 405, origin);
  if (!url || !serviceKey || !anonKey) return reply({ error: "LOGIN_SERVICE_UNAVAILABLE" }, 503, origin);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply({ error: "INVALID_REQUEST" }, 400, origin); }
  const memberId = String(body.member_id ?? "").trim().toUpperCase();
  const mobile = String(body.mobile ?? "").trim();
  const fullName = String(body.full_name ?? "").trim();
  const pin = String(body.pin ?? "");
  const confirmPin = body.confirm_pin == null ? "" : String(body.confirm_pin);
  if (!/^[A-Z0-9-]{6,40}$/.test(memberId) || !/^\d{10,13}$/.test(mobile.replace(/\D/g, ""))
      || fullName.length < 2 || fullName.length > 120 || !/^\d{4}$/.test(pin)
      || (confirmPin !== "" && !/^\d{4}$/.test(confirmPin))) {
    return reply({ error: "कृपया Member ID, मोबाइल, नाम और 4 अंकों का PIN सही दर्ज करें।" }, 400, origin);
  }

  try {
    const ip = (req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim().slice(0,100);
    const [ipHash, idHash] = await Promise.all([sha256(ip), sha256(memberId)]);
    const publicClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: limit, error: limitError } = await publicClient.rpc("sbpf_check_member_verify_rate_limit", {
      p_ip_hash: ipHash, p_identifier_hash: idHash,
    });
    if (limitError || !limit) return reply({ error: "LOGIN_SERVICE_UNAVAILABLE" }, 503, origin);
    if (limit.allowed !== true) return reply({ error: "कई प्रयास हुए हैं। 15 मिनट बाद पुनः प्रयास करें।" }, 429, origin);

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authResult, error: pinError } = await admin.rpc("sbpf_member_login_pin_check", {
      p_member_id: memberId, p_mobile: mobile, p_full_name: fullName,
      p_pin: pin, p_confirm_pin: confirmPin || null,
    });
    if (pinError || !authResult) return reply({ error: "LOGIN_SERVICE_UNAVAILABLE" }, 503, origin);
    if (authResult.success !== true) {
      const messages: Record<string,string> = {
        MEMBER_DETAILS_NOT_MATCHED: "Member ID, मोबाइल और नाम Admin रिकॉर्ड से मेल नहीं खाते।",
        ACTIVE_VERIFIED_MEMBERSHIP_REQUIRED: "सदस्यता सक्रिय और सत्यापित होना आवश्यक है।",
        ANNUAL_VERIFICATION_REQUIRED: "इस वर्ष का वार्षिक सत्यापन पूरा नहीं है।",
        REWARDS_ZONE_ACCESS_REQUIRED: "Admin ने Rewards Zone अनुमति सक्रिय नहीं की है।",
        PIN_CONFIRMATION_MISMATCH: "दोनों PIN एक जैसे नहीं हैं।",
        INVALID_LOGIN_PIN: "PIN सही नहीं है।",
        LOGIN_PIN_LOCKED: "कई गलत प्रयास हुए हैं। 15 मिनट बाद पुनः प्रयास करें।",
      };
      if (authResult.error === "PIN_CONFIRMATION_REQUIRED") {
        return reply({ code: "PIN_CONFIRMATION_REQUIRED", error: "पहली बार प्रवेश के लिए PIN की पुष्टि आवश्यक है।" }, 409, origin);
      }
      return reply({ error: messages[authResult.error] ?? "प्रवेश सत्यापित नहीं हुआ।" }, 403, origin);
    }

    const { data: authUser, error: userError } = await admin.auth.admin.getUserById(authResult.user_id);
    if (userError || !authUser.user?.email) return reply({ error: "सदस्य का लॉगिन खाता Admin से लिंक नहीं है।" }, 403, origin);

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink", email: authUser.user.email,
    });
    const tokenHash = link?.properties?.hashed_token;
    if (linkError || !tokenHash) return reply({ error: "सुरक्षित लॉगिन सत्र नहीं बन सका।" }, 503, origin);

    const { data: session, error: sessionError } = await publicClient.auth.verifyOtp({
      token_hash: tokenHash, type: "magiclink",
    });
    if (sessionError || !session.session || session.user?.id !== authResult.user_id) {
      return reply({ error: "लॉगिन सत्र सत्यापित नहीं हो सका।" }, 503, origin);
    }
    return reply({
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      expires_in: session.session.expires_in,
      token_type: session.session.token_type,
      user: { id: session.user.id },
      member_id: authResult.member_id,
      pin_created: authResult.pin_created,
    }, 200, origin);
  } catch {
    return reply({ error: "लॉगिन सेवा में अस्थायी समस्या है। कृपया बाद में प्रयास करें।" }, 503, origin);
  }
});
