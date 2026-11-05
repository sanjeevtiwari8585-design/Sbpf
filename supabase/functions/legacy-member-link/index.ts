import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
  "access-control-allow-origin": "https://swarnimbharatclub.in",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "vary": "origin",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });
const clean = (v: unknown, max = 80) => typeof v === "string" ? v.trim().slice(0, max) : "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Login required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const legacyBase = Deno.env.get("LEGACY_MEMBER_API_URL")?.replace(/\/$/, "");
  const legacyKey = Deno.env.get("LEGACY_MEMBER_API_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: "Portal authentication is not configured" }, 503);
  if (!legacyBase || !legacyKey) return json({ error: "Legacy member API is not connected yet", code: "LEGACY_API_NOT_CONFIGURED" }, 503);

  const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } });
  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData.user) return json({ error: "Session expired. Please sign in again." }, 401);
  const userId = authData.user.id;

  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const action = clean(input.action, 24);
  const memberId = clean(input.member_id, 64);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$/.test(memberId)) return json({ error: "Valid Member ID is required" }, 400);
  if (!["start_otp", "verify_otp"].includes(action)) return json({ error: "Unsupported action" }, 400);

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: ownMember, error: ownError } = await admin.from("members")
    .select("id,member_id,user_id").eq("user_id", userId).maybeSingle();
  if (ownError) return json({ error: "Could not check your current member account" }, 503);
  if (!ownMember) return json({ error: "पहले नए पोर्टल पर अपना सदस्य खाता पूरा करें। फिर पुराने Member ID को लिंक करें।" }, 409);

  const { data: existingLink, error: linkReadError } = await admin.from("legacy_member_links")
    .select("legacy_member_id,legacy_membership_status,otp_verified_at")
    .eq("user_id", userId).maybeSingle();
  if (linkReadError) return json({ error: "Link status is temporarily unavailable" }, 503);
  if (existingLink?.legacy_member_id === memberId && existingLink?.otp_verified_at) {
    return json({ linked: true, already_linked: true, legacy_membership_status: existingLink.legacy_membership_status });
  }
  if (existingLink && existingLink.legacy_member_id !== memberId) {
    return json({ error: "इस खाते से पहले ही दूसरा पुराना Member ID लिंक है। सहायता टीम से संपर्क करें।" }, 409);
  }

  const endpoint = action === "start_otp" ? "/api/v1/member/otp/start" : "/api/v1/member/otp/verify";
  const payload = action === "start_otp"
    ? { member_id: memberId }
    : { member_id: memberId, otp: clean(input.otp, 10) };
  if (action === "verify_otp" && !/^\d{4,8}$/.test(String(payload.otp || ""))) return json({ error: "OTP must contain 4 to 8 digits" }, 400);

  let legacyResponse: Response;
  try {
    legacyResponse = await fetch(legacyBase + endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": legacyKey, "accept": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return json({ error: "पुराना पोर्टल अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।", code: "LEGACY_API_UNAVAILABLE" }, 502);
  }
  if (legacyResponse.status === 401 || legacyResponse.status === 403) return json({ error: "Legacy API authentication failed" }, 502);
  if (legacyResponse.status === 404) return json({ error: "यह पुराना Member ID नहीं मिला।" }, 404);
  if (legacyResponse.status === 429) return json({ error: "बहुत अधिक प्रयास हुए हैं। कुछ समय बाद पुनः प्रयास करें।" }, 429);
  if (!legacyResponse.ok) return json({ error: action === "start_otp" ? "OTP भेजा नहीं जा सका।" : "OTP सत्यापन नहीं हो सका।" }, 502);

  let legacy: Record<string, unknown>;
  try { legacy = await legacyResponse.json(); } catch { return json({ error: "Legacy API returned an invalid response" }, 502); }

  if (action === "start_otp") {
    if (legacy.otp_sent !== true) return json({ error: "पुराने पोर्टल ने OTP भेजने की पुष्टि नहीं की।" }, 502);
    return json({ otp_sent: true, mobile_masked: clean(legacy.mobile_masked, 32), message: "पुराने पोर्टल पर पंजीकृत मोबाइल पर OTP भेजा गया है।" });
  }

  if (legacy.verified !== true || clean(legacy.legacy_member_id, 64) !== memberId) {
    return json({ error: "OTP गलत है या सदस्य पहचान सत्यापित नहीं हुई।" }, 400);
  }
  const membershipStatus = clean(legacy.membership_status, 24).toLowerCase();
  const allowedStatuses = ["active", "expired", "suspended", "pending"];
  if (!allowedStatuses.includes(membershipStatus)) return json({ error: "Legacy API membership status is invalid" }, 502);

  const { data: conflicting, error: conflictError } = await admin.from("legacy_member_links")
    .select("user_id").eq("legacy_member_id", memberId).maybeSingle();
  if (conflictError) return json({ error: "Could not verify whether this legacy ID is already linked" }, 503);
  if (conflicting && conflicting.user_id !== userId) return json({ error: "यह पुराना Member ID पहले ही दूसरे खाते से लिंक है। सहायता के लिए संपर्क करें।" }, 409);

  const { error: upsertError } = await admin.from("legacy_member_links").upsert({
    user_id: userId,
    member_row_id: ownMember.id,
    legacy_member_id: memberId,
    legacy_membership_status: membershipStatus,
    legacy_kyc_status: clean(legacy.kyc_status, 24).toLowerCase() || "unknown",
    legacy_member_name: clean(legacy.full_name, 120) || null,
    legacy_mobile_masked: clean(legacy.mobile_masked, 32) || null,
    otp_verified_at: new Date().toISOString(),
    last_checked_at: new Date().toISOString(),
    link_status: "linked",
  }, { onConflict: "user_id" });
  if (upsertError) return json({ error: "सत्यापन सफल हुआ, लेकिन लिंक सुरक्षित नहीं हो सका। सहायता टीम से संपर्क करें।" }, 503);

  return json({
    linked: true,
    legacy_member_id: memberId,
    full_name: clean(legacy.full_name, 120),
    mobile_masked: clean(legacy.mobile_masked, 32),
    membership_status: membershipStatus,
    kyc_status: clean(legacy.kyc_status, 24),
    note: "पुराने पोर्टल का लिंक सफल है। नए पोर्टल की KYC, वार्षिक सत्यापन और सुरक्षा जाँच अलग से लागू रहेंगी।",
  });
});
