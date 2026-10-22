import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
async function sha512(value: string) {
  const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  const key = Deno.env.get("PAYU_KEY");
  const salt = Deno.env.get("PAYU_SALT");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!key || !salt) return json({ error: "PayU test credentials missing; configure PAYU_KEY and PAYU_SALT." }, 503);
  if (!supabaseUrl || !anonKey) return json({ error: "Supabase auth configuration missing." }, 503);
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return json({ error: "Sign in required." }, 401);
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: auth } });
  if (!userRes.ok) return json({ error: "Invalid or expired session." }, 401);
  const user = await userRes.json();
  const body = await req.json().catch(() => ({}));
  const txnid = String(body.txnid ?? "").trim();
  if (!/^SBPF[a-f0-9]{20}$/i.test(txnid)) return json({ error: "Invalid SBPF test transaction ID." }, 400);
  const command = "verify_payment";
  const hash = await sha512([key, command, txnid, salt].join("|"));
  const form = new URLSearchParams({ key, command, var1: txnid, hash });
  try {
    const response = await fetch("https://test.payu.in/merchant/postservice.php?form=2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await response.json();
    const details = data?.transaction_details?.[txnid];
    const status = String(details?.status ?? "").toLowerCase();
    const amount = Number(details?.amt ?? details?.amount ?? 0);
    const txnUserId = String(details?.udf1 ?? "");
    const valid = response.ok && Number(data?.status) === 1 && status === "success" && amount === 365 && txnUserId === String(user.id);
    return json({
      verified: valid,
      mode: "test",
      txnid,
      status: valid ? "success" : (status || "not_found_or_not_successful"),
      amount: Number.isFinite(amount) ? amount : null,
      membership_activated: false,
      note: valid ? "PayU test transaction reconciled. This endpoint intentionally does not activate membership; a persisted order and idempotent database update must be implemented first." : "PayU did not confirm a matching successful ₹365 transaction for this signed-in user.",
    }, response.ok ? 200 : 502);
  } catch {
    return json({ error: "PayU test verification request failed." }, 502);
  }
});