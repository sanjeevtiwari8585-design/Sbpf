Deno.serve(() => {
  const html = `<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SBPF Member Profile</title><script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>*{box-sizing:border-box}body{font-family:system-ui,Arial;background:#f2f5f9;margin:0;color:#182235}.wrap{max-width:760px;margin:auto;padding:18px}.head,.panel{background:#fff;border-radius:18px;padding:20px;margin-bottom:16px;box-shadow:0 6px 24px #0000000c}.head{background:linear-gradient(120deg,#12345b,#13805b);color:#fff;border-bottom:4px solid #d4a72c}.head h1{margin:0 0 8px;color:#f4ce65;font-size:22px}.sub{font-size:13px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}label{display:block;font-size:12px;font-weight:700;color:#566176}input,select{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #ccd5df;border-radius:10px;background:white;font-size:15px}button{width:100%;padding:13px;margin-top:16px;border:0;border-radius:10px;background:#12345b;color:#fff;font-weight:800;font-size:15px}.msg{margin-top:12px;padding:12px;border-radius:10px;background:#f5f7fa;white-space:pre-wrap}.muted{color:#657185;font-size:12px}@media(max-width:560px){.grid{grid-template-columns:1fr}.wrap{padding:12px}.head,.panel{padding:16px}}</style></head><body><main class="wrap"><header class="head"><h1>स्वर्णिम भारत परिवार फाउंडेशन</h1><div class="sub">SBPF सदस्य प्रोफ़ाइल • कार्यक्षेत्र और ID कार्ड विवरण</div></header><section id="box" class="panel">लोड हो रहा है…</section></main>
<script>
const client=supabase.createClient("https://dxowhzghrdghfzoggorx.supabase.co","sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo");
const box=document.getElementById("box");
const field=(label,id,placeholder,type="text")=>{const l=document.createElement("label");l.textContent=label;const i=document.createElement("input");i.id=id;i.placeholder=placeholder||"";i.type=type;l.appendChild(i);return l};
const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v??""};
const get=id=>document.getElementById(id)?.value?.trim()||"";
async function init(){
 const session=(await client.auth.getSession()).data.session;
 if(!session){box.textContent="पहले SBPF Seva में लॉगिन करें, फिर इस पेज को खोलें।";return}
 const [profile,areas]=await Promise.all([
  client.rpc("get_my_member_profile_v2"),
  client.from("focus_areas").select("id,name").eq("is_active",true).order("name")
 ]);
 if(profile.error||!profile.data?.length){box.textContent=profile.error?.message||"इस लॉगिन से जुड़ा सदस्य रिकॉर्ड नहीं मिला।";return}
 if(areas.error){box.textContent="कार्यक्षेत्र लोड नहीं हो पाए। कृपया बाद में पुनः प्रयास करें।";return}
 const m=profile.data[0];
 box.innerHTML="<h2>मेरी सदस्य जानकारी</h2><p class='muted'>Member ID: <b id='mid'></b></p><div class='grid' id='form'></div><label style='margin-top:12px'>चुना हुआ कार्यक्षेत्र<select id='area'><option value=''>कार्य क्षेत्र चुनें</option></select></label><button id='save'>प्रोफ़ाइल सेव करें</button><div id='msg' class='msg' role='status'></div><p class='muted'>सदस्यता और भुगतान की स्थिति केवल अधिकृत एडमिन बदल सकते हैं।</p>";
 document.getElementById("mid").textContent=m.member_id||"";
 const form=document.getElementById("form");
 const defs=[
  ["पूरा नाम","name","नाम लिखें"],["मोबाइल नंबर","mobile","10 अंकों का मोबाइल"],["पद / Designation","designation","जैसे स्वयंसेवक"],
  ["देश","country","India"],["राज्य","state","राज्य"],["जिला","district","जिला"],["पिनकोड","pincode","पिनकोड"],["पता","address","पूरा पता"]
 ];
 for(const [label,id,ph] of defs){const f=field(label,id,ph);form.appendChild(f)}
 const area=document.getElementById("area");
 for(const a of areas.data||[]){const opt=document.createElement("option");opt.value=String(a.id);opt.textContent=a.name;area.appendChild(opt)}
 set("name",m.full_name);set("mobile",m.mobile);set("designation",m.designation);set("country",m.country||"India");set("state",m.state);set("district",m.district);set("pincode",m.pincode);set("address",m.address);
 area.value=m.work_area_id?String(m.work_area_id):"";
 document.getElementById("save").onclick=save;
}
async function save(){
 const btn=document.getElementById("save"),msg=document.getElementById("msg");
 btn.disabled=true;btn.textContent="सेव हो रहा है…";msg.textContent="";
 const area=get("area");
 const r=await client.rpc("update_my_member_profile_v2",{
  p_full_name:get("name"),p_mobile:get("mobile"),p_address:get("address"),
  p_country:get("country"),p_state:get("state"),p_district:get("district"),
  p_pincode:get("pincode"),p_designation:get("designation"),
  p_work_area_id:area?Number(area):null
 });
 msg.textContent=r.error?("सेव नहीं हुआ: "+r.error.message):"प्रोफ़ाइल सेव हो गई। ID कार्ड में कार्यक्षेत्र और पद अगली बार खोलने पर अपडेट दिखेंगे।";
 btn.disabled=false;btn.textContent="प्रोफ़ाइल सेव करें";
}
init();
</script></body></html>`;
  return new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
});