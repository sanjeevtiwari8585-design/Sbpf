import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const html=`<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SBPF Member 360</title><script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script><style>body{margin:0;font-family:Arial,"Noto Sans Devanagari",sans-serif;background:#f3f7fb;color:#172033}.wrap{max-width:1200px;margin:auto;padding:18px}.head{background:#082f56;color:#fff;padding:18px;border-radius:14px}.head h1{margin:0;color:#f5c64b}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{background:#fff;border-radius:12px;padding:16px;box-shadow:0 4px 15px #0001}.card h2{color:#0b4d7d;margin-top:0}.row{padding:8px 0;border-bottom:1px solid #edf0f3}.label{color:#667085;font-size:12px}.value{font-weight:bold}.wide{grid-column:1/-1}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #e5ebf0;text-align:left;font-size:13px}th{background:#eef3f7}.err{padding:14px;background:#ffe9ec;color:#9d1c2b;border-radius:10px}@media(max-width:800px){.grid{grid-template-columns:1fr}}</style></head><body><div class="wrap"><div class="head"><h1>स्वर्णिम भारत परिवार फाउंडेशन</h1><div>Member 360° — Admin Detail</div></div><div id="app">लोड हो रहा है...</div></div><script>
const sb=supabase.createClient("https://dxowhzghrdghfzoggorx.supabase.co","sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo");
const esc=v=>String(v==null?"":v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rows=(o,ks)=>ks.map(k=>'<div class="row"><div class="label">'+esc(k)+'</div><div class="value">'+esc(o[k])+'</div></div>').join("");
async function run(){
 const id=new URLSearchParams(location.search).get("member_id");
 if(!id){app.innerHTML='<div class="err">member_id आवश्यक है।</div>';return}
 const s=await sb.auth.getSession();
 if(!s.data.session){app.innerHTML='<div class="err">पहले Admin Panel में login करें। इसी browser में यह पेज खोलें।</div>';return}
 const adm=await sb.rpc("is_admin");
 if(adm.error||adm.data!==true){app.innerHTML='<div class="err">यह account Admin नहीं है।</div>';return}
 const r=await sb.rpc("admin_get_member_360",{p_member_id:Number(id)});
 if(r.error){app.innerHTML='<div class="err">'+esc(r.error.message)+'</div>';return}
 const x=r.data,m=x.member;
 let h='<div class="grid">';
 h+='<div class="card wide"><h2>Member Profile</h2>'+rows(m,["member_id","full_name","mobile","email","address","district","state","created_at"])+'</div>';
 h+='<div class="card"><h2>Membership</h2>'+rows(m,["membership_status","status","payment_status","membership_start_date","membership_end_date"])+'</div>';
 h+='<div class="card"><h2>Referral</h2>'+rows(m,["referral_code","referred_by","referred_by_code","referral_link"])+'</div>';
 h+='<div class="card"><h2>KYC</h2>'+rows(m,["kyc_status","kyc_submitted_at","kyc_verified_at","kyc_rejection_reason"])+'<div class="row"><span class="label">Aadhaar document</span><div class="value">'+(m.aadhaar_document_path?"Available":"Not available")+'</div></div><div class="row"><span class="label">PAN document</span><div class="value">'+(m.pan_document_path?"Available":"Not available")+'</div></div></div>';
 h+='<div class="card wide"><h2>Payment History</h2><table><tr><th>Order</th><th>Amount</th><th>Gateway</th><th>Status</th><th>Created</th><th>Paid</th></tr>';
 h+=(x.payments||[]).map(p=>'<tr><td>'+esc(p.order_id)+'</td><td>₹'+esc(p.amount)+'</td><td>'+esc(p.gateway)+'</td><td>'+esc(p.status)+'</td><td>'+esc(p.created_at)+'</td><td>'+esc(p.paid_at)+'</td></tr>').join("")||'<tr><td colspan="6">कोई payment नहीं</td></tr>';
 h+='</table></div><div class="card wide"><h2>Certificates</h2><table><tr><th>Number</th><th>Type</th><th>Status</th><th>Issued</th><th>Revoked</th></tr>';
 h+=(x.certificates||[]).map(c=>'<tr><td>'+esc(c.certificate_number)+'</td><td>'+esc(c.certificate_type)+'</td><td>'+esc(c.certificate_status)+'</td><td>'+esc(c.issued_at)+'</td><td>'+esc(c.revoked_at)+'</td></tr>').join("")||'<tr><td colspan="5">कोई certificate नहीं</td></tr>';
 h+='</table></div><div class="card wide"><h2>Direct Referrals ('+(x.direct_referrals||[]).length+')</h2><table><tr><th>Member ID</th><th>Name</th><th>Mobile</th><th>Membership</th><th>Status</th></tr>';
 h+=(x.direct_referrals||[]).map(q=>'<tr><td>'+esc(q.member_id)+'</td><td>'+esc(q.full_name)+'</td><td>'+esc(q.mobile)+'</td><td>'+esc(q.membership_status)+'</td><td>'+esc(q.status)+'</td></tr>').join("")||'<tr><td colspan="5">कोई direct referral नहीं</td></tr>';
 h+='</table></div></div>';app.innerHTML=h;
}
run();
</script></body></html>`;
Deno.serve(()=>new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}}));