import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });

    const base = Deno.env.get("SUPABASE_URL") || "https://dxowhzghrdghfzoggorx.supabase.co";
    const key = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    if (!key) return new Response("Server configuration error", { status: 500 });
    const headers = { apikey: key, Authorization: auth, "Content-Type": "application/json" };

    const res = await fetch(base + "/rest/v1/rpc/get_my_member_id_card_v2", {
      method: "POST", headers, body: "{}",
    });
    if (!res.ok) return new Response("Unable to load member card", { status: 500 });
    const rows = await res.json();
    const m = Array.isArray(rows) ? rows[0] : rows;
    if (!m) return new Response("Member profile not found", { status: 404 });

    const esc = (s: unknown) => String(s ?? "—").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]!));

    let brand: any = {};
    const brandRes = await fetch(base + "/rest/v1/sbpf_brand_settings?id=eq.1&select=organization_name,organization_name_en,logo_asset_key,primary_color,secondary_color,accent_color&limit=1", { headers });
    if (brandRes.ok) brand = (await brandRes.json())?.[0] || {};
    let areaTheme: any = {};
    if (m.work_area_id) {
      const themeRes = await fetch(base + "/rest/v1/sbpf_work_area_branding?work_area_id=eq." + encodeURIComponent(String(m.work_area_id)) + "&is_active=eq.true&select=display_name,logo_asset_key,primary_color,secondary_color,accent_color&limit=1", { headers });
      if (themeRes.ok) areaTheme = (await themeRes.json())?.[0] || {};
    }
    const validColor = (v: unknown, fallback: string) => /^#[0-9a-fA-F]{6}$/.test(String(v ?? "")) ? String(v) : fallback;
    const primary = validColor(areaTheme.primary_color || brand.primary_color, "#12345b");
    const gold = validColor(areaTheme.secondary_color || brand.secondary_color, "#d4a72c");
    const accent = validColor(areaTheme.accent_color || brand.accent_color, "#13805b");
    const org = brand.organization_name || "स्वर्णिम भारत परिवार फाउंडेशन";
    const orgEn = brand.organization_name_en || "Swarnim Bharat Parivar Foundation";

    const assetKey = areaTheme.logo_asset_key || brand.logo_asset_key || "sbpf-logo";
    const logoRes = await fetch(base + "/rest/v1/branding_assets?asset_key=eq." + encodeURIComponent(assetKey) + "&is_active=eq.true&select=asset_content,mime_type&limit=1", { headers });
    let logo = "";
    if (logoRes.ok) {
      const asset = (await logoRes.json())?.[0];
      if (asset?.asset_content && String(asset.mime_type || "").includes("svg")) {
        logo = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(asset.asset_content);
      } else if (asset?.asset_content && String(asset.mime_type || "").startsWith("image/")) {
        logo = "data:" + asset.mime_type + ";base64," + asset.asset_content;
      }
    }
    const verifyUrl = base + "/functions/v1/verify-member?token=" + encodeURIComponent(m.qr_token);
    const fields = [
      ["MEMBER ID / सदस्य आईडी", m.member_id],
      ["NAME / नाम", m.full_name],
      ["DESIGNATION / पद", m.designation || "निर्धारित नहीं"],
      ["WORK AREA / कार्यक्षेत्र", m.work_area_name || "निर्धारित नहीं"],
      ["COUNTRY / देश", m.country || "India"],
      ["STATE / राज्य", m.state || "निर्धारित नहीं"],
      ["DISTRICT / जिला", m.district || "निर्धारित नहीं"],
      ["PINCODE / पिनकोड", m.pincode || "निर्धारित नहीं"],
      ["MEMBERSHIP / सदस्यता", m.membership_status],
      ["STATUS / स्थिति", m.status],
      ["VALID UNTIL / वैधता", m.membership_end_date || "निर्धारित नहीं"],
    ];
    const cards = fields.map(([label, value]) => '<div class="field"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value) + '</div></div>').join("");
    const html = '<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SBPF Member ID Card</title><style>*{box-sizing:border-box}body{margin:0;background:#eef2f6;font-family:Arial,sans-serif;color:#152238}.card{width:min(94vw,850px);margin:24px auto;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 12px 35px #0002}.top{background:linear-gradient(120deg,' + primary + ',' + accent + ');color:#fff;padding:22px 26px;display:flex;align-items:center;gap:18px;border-bottom:5px solid ' + gold + '}.logo{width:82px;height:82px;object-fit:contain;background:#fff;border-radius:14px;padding:4px}.mark{width:82px;height:82px;display:grid;place-items:center;background:#fff;color:' + primary + ';border-radius:14px;font-weight:900;font-size:20px}.title h1{margin:0;color:' + gold + ';font-size:23px}.title div{font-size:12px;margin-top:5px}.work{display:inline-block;margin-top:8px;padding:5px 9px;border:1px solid #ffffff80;border-radius:20px;font-size:12px}.body{padding:24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.field{background:#f6f8fb;padding:12px;border-radius:11px;min-width:0}.label{font-size:10px;color:#667;margin-bottom:5px}.value{font-size:14px;font-weight:700;overflow-wrap:anywhere}.qr{text-align:center;margin-top:20px}.qr img{width:180px;height:180px}.verify{font-size:12px;color:#356;margin-top:6px}.print{margin:20px;text-align:center}button{padding:12px 22px;border:0;border-radius:9px;background:' + primary + ';color:#fff;font-weight:bold}@media print{body{background:#fff}.card{box-shadow:none;margin:0;width:100%}.print{display:none}}@media(max-width:580px){.grid{grid-template-columns:1fr}.top{padding:16px}.logo,.mark{width:64px;height:64px}.title h1{font-size:18px}.body{padding:16px}}</style></head><body><div class="card"><header class="top">' + (logo ? '<img class="logo" src="' + logo + '" alt="SBPF logo">' : '<div class="mark">SBPF</div>') + '<div class="title"><h1>' + esc(org) + '</h1><div>' + esc(orgEn) + ' • DIGITAL MEMBER ID</div><div class="work">' + esc(m.work_area_name || "SBPF Member") + '</div></div></header><section class="body"><div class="grid">' + cards + '</div><div class="qr"><img alt="QR verification code" src="https://quickchart.io/qr?text=' + encodeURIComponent(verifyUrl) + '&size=220"><div class="verify">SCAN TO VERIFY MEMBERSHIP</div></div></section></div><div class="print"><button onclick="window.print()">Print / Save as PDF</button></div></body></html>';
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  } catch (_) {
    return new Response("Server error", { status: 500 });
  }
});