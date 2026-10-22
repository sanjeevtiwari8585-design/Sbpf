import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const headers = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; frame-ancestors 'none'",
};
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]!));

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET") return new Response("GET required", { status: 405, headers });
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  if (!token) {
    return new Response("<!doctype html><html lang='hi'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>SBPF सत्यापन</title><h1>SBPF सदस्य सत्यापन</h1><p>सत्यापन कोड नहीं मिला। कृपया ID कार्ड का QR कोड दोबारा स्कैन करें।</p></html>", { status: 400, headers });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("verify_member_qr_code", { p_qr_token: token });
  if (error) {
    return new Response("<!doctype html><html lang='hi'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>SBPF सत्यापन</title><h1>अभी सत्यापन नहीं हो सका</h1><p>कृपया कुछ देर बाद पुनः प्रयास करें।</p></html>", { status: 503, headers });
  }
  const member = data?.[0];
  if (!member) {
    return new Response("<!doctype html><html lang='hi'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>SBPF सत्यापन</title><main><h1>सदस्य नहीं मिला</h1><p>यह QR कोड मान्य नहीं है या रद्द किया जा चुका है।</p></main></html>", { status: 404, headers });
  }
  const { data: brand } = await supabase.from("sbpf_brand_settings")
    .select("organization_name,organization_name_en,primary_color,secondary_color,accent_color")
    .eq("id", 1).maybeSingle();
  const color = (v: unknown, fallback: string) => /^#[0-9a-fA-F]{6}$/.test(String(v ?? "")) ? String(v) : fallback;
  const primary = color(brand?.primary_color, "#12345b");
  const gold = color(brand?.secondary_color, "#d4a72c");
  const accent = color(brand?.accent_color, "#13805b");
  const endDate = member.membership_end_date ? String(member.membership_end_date) : "";
  const expired = !!endDate && endDate < new Date().toISOString().slice(0, 10);
  const active = String(member.status ?? "").toLowerCase() === "active"
    && String(member.membership_status ?? "").toLowerCase() === "active" && !expired;
  const suspended = String(member.status ?? "").toLowerCase() === "suspended";
  const statusText = active ? "सक्रिय सदस्य" : (expired ? "समय-सीमा समाप्त" : (suspended ? "निलंबित" : "सदस्यता सक्रिय नहीं"));
  const statusColor = active ? accent : "#b42318";
  const organization = brand?.organization_name ?? "स्वर्णिम भारत परिवार फाउंडेशन";
  const organizationEn = brand?.organization_name_en ?? "Swarnim Bharat Parivar Foundation";
  const payload = { verified: true, member: {
    member_id: member.member_id, full_name: member.full_name,
    membership_status: member.membership_status, status: member.status,
    membership_start_date: member.membership_start_date, membership_end_date: member.membership_end_date,
    verification_status: statusText, active,
  }};
  if (url.searchParams.get("format") === "json") {
    return new Response(JSON.stringify(payload), { headers: { ...headers, "content-type": "application/json; charset=utf-8" } });
  }
  const html = `<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SBPF सदस्य सत्यापन</title>
<style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f2f5f9;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#172033;padding:22px}.card{max-width:620px;margin:24px auto;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 12px 38px #15223818}.head{background:${primary};color:white;padding:25px 22px;text-align:center;border-bottom:5px solid ${gold}}.mark{margin:0 auto 12px;width:62px;height:62px;border:2px solid ${gold};border-radius:50%;display:grid;place-items:center;font-weight:900;color:${gold};font-size:20px}h1{font-size:21px;margin:0 0 5px}.en{font-size:12px;opacity:.9}.content{padding:24px}.pill{display:inline-block;padding:8px 14px;border-radius:99px;background:${statusColor}15;color:${statusColor};font-weight:800;margin-bottom:18px}.row{padding:13px 0;border-bottom:1px solid #e7ebf0}.label{font-size:11px;letter-spacing:.04em;color:#687386}.value{font-size:16px;font-weight:700;margin-top:4px;overflow-wrap:anywhere}.note{margin-top:20px;background:#f5f7fa;padding:13px;border-radius:12px;font-size:12px;color:#566176;line-height:1.6}.foot{text-align:center;padding:15px;color:#687386;font-size:11px}</style></head><body><main class="card"><header class="head"><div class="mark">SBPF</div><h1>${esc(organization)}</h1><div class="en">${esc(organizationEn)}</div><div style="margin-top:12px;font-size:12px">डिजिटल सदस्य पहचान सत्यापन</div></header><section class="content"><div class="pill">${esc(statusText)}</div><div class="row"><div class="label">MEMBER ID / सदस्य आईडी</div><div class="value">${esc(member.member_id)}</div></div><div class="row"><div class="label">MEMBER NAME / सदस्य का नाम</div><div class="value">${esc(member.full_name)}</div></div><div class="row"><div class="label">MEMBERSHIP / सदस्यता</div><div class="value">${esc(member.membership_status)}</div></div><div class="row"><div class="label">VALID FROM / मान्य तिथि</div><div class="value">${esc(member.membership_start_date || "उपलब्ध नहीं")}</div></div><div class="row"><div class="label">VALID UNTIL / वैधता समाप्ति</div><div class="value">${esc(member.membership_end_date || "निर्धारित नहीं")}</div></div><div class="note">यह पेज SBPF के रिकॉर्ड से QR कोड सत्यापित करता है। निजी पहचान दस्तावेज़ या पूरा मोबाइल नंबर प्रदर्शित नहीं किया जाता।</div></section><footer class="foot">© Swarnim Bharat Parivar Foundation • Secure QR Verification</footer></main></body></html>`;
  return new Response(html, { status: 200, headers });
});