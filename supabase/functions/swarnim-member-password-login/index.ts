import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
  try {
    const body = await req.json();
    const memberId = String(body.member_id ?? "").trim().toUpperCase();
    const password = String(body.password ?? "");
    if (!memberId || password.length < 8 || memberId.length > 80) {
      return Response.json({ error: "Member ID या पासवर्ड गलत है।" }, { status: 400, headers: cors });
    }
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!url || !serviceKey || !anonKey) {
      return Response.json({ error: "Login सेवा अभी कॉन्फ़िगर नहीं है।" }, { status: 503, headers: cors });
    }
    const memberResponse = await fetch(
      url + "/rest/v1/members?select=member_id,email,user_id&member_id=eq." + encodeURIComponent(memberId) + "&limit=1",
      { headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey } }
    );
    if (!memberResponse.ok) throw new Error("lookup failed");
    const members = await memberResponse.json();
    const member = Array.isArray(members) ? members[0] : null;
    if (!member?.email || !member?.user_id) {
      return Response.json({ error: "Member ID या पासवर्ड गलत है। पहले सदस्य पंजीकरण/खाता लिंक कराएँ।" }, { status: 401, headers: cors });
    }
    const authResponse = await fetch(url + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: member.email, password })
    });
    const auth = await authResponse.json();
    if (!authResponse.ok || !auth.access_token || auth.user?.id !== member.user_id) {
      return Response.json({ error: "Member ID या पासवर्ड गलत है। यदि पासवर्ड सेट नहीं किया है तो पहले खाते का पासवर्ड सेट करें।" }, { status: 401, headers: cors });
    }
    return Response.json(auth, { status: 200, headers: cors });
  } catch {
    return Response.json({ error: "लॉगिन पूरा नहीं हो सका। कुछ देर बाद पुनः प्रयास करें।" }, { status: 500, headers: cors });
  }
});