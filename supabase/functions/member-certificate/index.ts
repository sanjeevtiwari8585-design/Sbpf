Deno.serve(async(req)=>{
try{
 const u="https://dxowhzghrdghfzoggorx.supabase.co";
 const key=Deno.env.get("SUPABASE_ANON_KEY")||Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
 if(!key)return new Response("Server configuration error",{status:500});
 const url=new URL(req.url);
 let token=(req.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"").trim();
 if(!token) token=url.searchParams.get("access_token")||"";
 if(!token)return new Response("Unauthorized",{status:401});
 const ah={apikey:key,Authorization:"Bearer "+token};
 const ur=await fetch(u+"/auth/v1/user",{headers:ah});
 if(!ur.ok)return new Response("Unauthorized",{status:401});
 const rr=await fetch(u+"/rest/v1/rpc/get_my_certificate",{method:"POST",headers:{...ah,"Content-Type":"application/json"},body:"{}"});
 if(!rr.ok)return new Response("Unable to load certificate",{status:500});
 const d=await rr.json(),m=d?.[0];
 if(!m||m.certificate_status!=="issued")return new Response("Certificate not issued yet",{status:404});
 const br=await fetch(u+"/rest/v1/branding_assets?asset_key=eq.sbpf-logo&is_active=eq.true&select=asset_content&limit=1",{headers:ah});
 let logo=""; if(br.ok){const b=await br.json(); logo=b?.[0]?.asset_content||"";}
 if(logo) logo="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(logo);
 const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const verify=u+"/functions/v1/verify-certificate?token="+encodeURIComponent(m.verification_token);
 const html='<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SBPF Certificate</title><style>body{margin:0;background:#eef2f6;font-family:Georgia,serif;color:#17243a}.cert{width:min(92vw,900px);margin:30px auto;background:#fff;border:8px solid #c9a227;border-radius:18px;padding:42px;box-sizing:border-box;text-align:center;box-shadow:0 12px 35px #0002}.logo{width:125px;height:125px;object-fit:contain;margin:0 auto 8px}.org{font-family:Arial;font-size:28px;font-weight:bold;color:#08264b}.sub{font-family:Arial;color:#666;margin-top:6px}.title{font-size:42px;color:#9a7410;margin:28px 0 20px}.name{font-size:34px;font-weight:bold;border-bottom:2px solid #c9a227;display:inline-block;padding:0 35px 8px}.text{font-size:18px;line-height:1.7;margin:25px auto;max-width:700px}.meta{font-family:Arial;display:flex;justify-content:space-between;gap:20px;margin-top:45px}.qr{margin-top:28px}.qr img{width:150px;height:150px}.print{text-align:center;margin:18px}button{padding:12px 24px;background:#0b416d;color:#fff;border:0;border-radius:9px;font-weight:bold}@media print{body{background:#fff}.cert{margin:0;width:100%;box-shadow:none}.print{display:none}}@media(max-width:600px){.cert{padding:24px}.meta{display:block}.meta>div{margin:12px 0}.title{font-size:34px}.name{font-size:27px}}</style></head><body><div class="cert"><img class="logo" src="'+logo+'" alt="SBPF logo"><div class="org">स्वर्णिम भारत परिवार फाउंडेशन</div><div class="sub">SWARNIM BHARAT PARIVAR FOUNDATION</div><div class="title">प्रमाण पत्र</div><div class="text">यह प्रमाणित किया जाता है कि</div><div class="name">'+esc(m.full_name)+'</div><div class="text">SBPF के सदस्य के रूप में पंजीकृत हैं।<br>यह प्रमाण पत्र सदस्यता सत्यापन के लिए जारी किया गया है।</div><div class="meta"><div><b>Certificate No.</b><br>'+esc(m.certificate_number)+'</div><div><b>Member ID</b><br>'+esc(m.member_id)+'</div><div><b>Issue Date</b><br>'+esc(m.issued_at||"")+'</div></div><div class="qr"><img src="https://quickchart.io/qr?text='+encodeURIComponent(verify)+'&size=200"><div>Scan to Verify Certificate</div></div></div><div class="print"><button onclick="window.print()">Print / Save as PDF</button></div></body></html>';
 return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}});
}catch(e){return new Response("Server error",{status:500})}});