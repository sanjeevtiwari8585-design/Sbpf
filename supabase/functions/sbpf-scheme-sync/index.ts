import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const u = Deno.env.get("SUPABASE_URL")!;
const k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(u, k);
const out = (x: unknown, s = 200) =>
  new Response(JSON.stringify(x), { status: s, headers: { "Content-Type": "application/json" } });

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return out({ ok: false, error: "POST required" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* empty body is allowed only with secret header */ }

  const supplied = req.headers.get("x-sbpf-cron-secret") || String(b.cron_secret ?? "");
  const { data: secretRow } = await db.from("sbpf_sync_secrets")
    .select("secret").eq("name", "scheme_sync").maybeSingle();
  if (!secretRow?.secret || supplied !== secretRow.secret) {
    return out({ ok: false, error: "Unauthorized" }, 401);
  }

  const { data: sources, error } = await db.from("sbpf_scheme_sources")
    .select("id,region_code,source_name,source_url,source_type")
    .eq("enabled", true);
  if (error) return out({ ok: false, error: error.message }, 500);

  const results: unknown[] = [];
  for (const source of sources ?? []) {
    const startedAt = new Date().toISOString();
    try {
      const response = await fetch(source.source_url, {
        headers: { "User-Agent": "SBPF-Scheme-Sync/2.0 (+official-source-monitor)" },
        redirect: "follow",
        signal: AbortSignal.timeout(25000),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const body = await response.text();
      if (!response.ok) throw new Error("HTTP " + response.status);

      const hash = await sha256(body);
      if (!contentType.toLowerCase().includes("application/json")) {
        const { data: previous } = await db.from("sbpf_scheme_sync_runs")
          .select("result").eq("source_id", source.id)
          .order("started_at", { ascending: false }).limit(1).maybeSingle();
        const previousHash = previous?.result && typeof previous.result === "object"
          ? (previous.result as Record<string, unknown>).content_sha256
          : null;
        const changed = typeof previousHash === "string" && previousHash !== hash;
        const status = "partial";
        const message = changed
          ? "Official page content changed; admin review required. No scheme records were auto-edited."
          : "HTML source monitored; no structured JSON/API feed available, so scheme records were not auto-edited.";
        await db.from("sbpf_scheme_sync_runs").insert({
          source_id: source.id,
          started_at: startedAt,
          finished_at: new Date().toISOString(),
          status,
          error_message: message,
          records_seen: 0,
          records_created: 0,
          records_updated: 0,
          result: {
            http_status: response.status,
            content_type: contentType,
            bytes: body.length,
            content_sha256: hash,
            change_detected: changed,
            review_required: changed,
            mode: "official_page_monitor",
          },
        });
        await db.from("sbpf_scheme_sources").update({
          last_checked_at: new Date().toISOString(),
          last_error: changed ? "Official page changed; admin review required." : "HTML page monitored; structured API/feed needed for automatic record updates.",
        }).eq("id", source.id);
        results.push({ source: source.source_name, status: changed ? "change_detected_review_required" : "monitored_no_api", changed });
        continue;
      }

      let payload: any;
      try { payload = JSON.parse(body); } catch { throw new Error("Invalid JSON response"); }
      const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
      if (!Array.isArray(rows)) throw new Error("JSON feed has no array data field");
      let created = 0, updated = 0, failed = 0;
      for (const item of rows) {
        const name = String(item.name ?? item.scheme_name ?? item.title ?? "").trim();
        if (!name) continue;
        const code = String(item.scheme_code ?? item.code ?? "").trim() || null;
        const row: Record<string, unknown> = {
          scheme_code: code,
          name,
          description: String(item.description ?? item.details ?? ""),
          official_url: String(item.official_url ?? item.application_url ?? item.url ?? source.source_url),
          category: String(item.category ?? ""),
          scope: source.region_code === "IN-CENTRAL" ? "central" : "state",
          region_code: source.region_code,
          ministry_department: String(item.ministry_department ?? item.ministry ?? item.department ?? ""),
          sub_category: String(item.sub_category ?? ""),
          eligibility: item.eligibility ?? {},
          benefits: item.benefits ?? {},
          required_documents: item.required_documents ?? item.documents ?? [],
          application_process: String(item.application_process ?? ""),
          source_name: source.source_name,
          source_url: source.source_url,
          published: true,
          sync_status: "success",
          last_verified_at: new Date().toISOString(),
          last_source_sync_at: new Date().toISOString(),
          sync_hash: hash,
        };
        const lookup = code
          ? db.from("government_schemes").select("id").eq("scheme_code", code).maybeSingle()
          : db.from("government_schemes").select("id").eq("name", name).eq("region_code", source.region_code).maybeSingle();
        const found = await lookup;
        if (found.error) { failed++; continue; }
        const write = found.data
          ? await db.from("government_schemes").update(row).eq("id", found.data.id)
          : await db.from("government_schemes").insert(row);
        if (write.error) { failed++; continue; }
        if (found.data) updated++; else created++;
      }
      const status = failed ? (created + updated ? "partial" : "failed") : "success";
      await db.from("sbpf_scheme_sync_runs").insert({
        source_id: source.id, started_at: startedAt, finished_at: new Date().toISOString(),
        status, records_seen: rows.length, records_created: created, records_updated: updated,
        error_message: failed ? String(failed) + " records failed validation/write; inspect source schema." : null,
        result: { content_type: contentType, content_sha256: hash, failed_records: failed, mode: "json_api_sync" },
      });
      await db.from("sbpf_scheme_sources").update({
        last_checked_at: new Date().toISOString(),
        last_success_at: status === "success" ? new Date().toISOString() : undefined,
        last_error: failed ? String(failed) + " records could not be saved." : null,
      }).eq("id", source.id);
      results.push({ source: source.source_name, status, seen: rows.length, created, updated, failed });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await db.from("sbpf_scheme_sync_runs").insert({
        source_id: source.id, started_at: startedAt, finished_at: new Date().toISOString(),
        status: "failed", error_message: message,
      });
      await db.from("sbpf_scheme_sources").update({
        last_checked_at: new Date().toISOString(), last_error: message,
      }).eq("id", source.id);
      results.push({ source: source.source_name, status: "failed", error: message });
    }
  }
  return out({ ok: true, mode: "daily_official_source_monitor_and_json_sync", results });
});