import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const C={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const j=(b:unknown,s=200)=>new Response(JSON.stringify(b),{status:s,headers:{...C,"Content-Type":"application/json"}});
async function hash(v:string){const d=await crypto.subtle.digest("SHA-512",new TextEncoder().encode(v));return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,"0")).join("");}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:C}); if(req.method!=="POST")return j({error:"POST required"},405);
 const key=Deno.env.get("PAYU_KEY"),salt=Deno.env.get("PAYU_SALT"),url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!key||!salt)return j({error:"Missing PAYU_KEY/PAYU_SALT Supabase secrets"},503);
 if(!url||!anon||!service)return j({error:"Missing Supabase server configuration"},503);
 const auth=req.headers.get("Authorization");if(!auth?.startsWith("Bearer "))return j({error:"Sign in required"},401);
 const ur=await fetch(url+"/auth/v1/user",{headers:{apikey:anon,Authorization:auth}});if(!ur.ok)return j({error:"Invalid session"},401);
 const u=await ur.json(); if(!u.id||!u.email)return j({error:"Signed-in account needs email"},400);
 const prof=await fetch(url+"/rest/v1/members?user_id=eq."+encodeURIComponent(u.id)+"&select=member_id,full_name,mobile&limit=1",{headers:{apikey:service,Authorization:"Bearer "+service}});
 if(!prof.ok)return j({error:"Could not load member profile"},502);const rows=await prof.json();if(!rows.length)return j({error:"Complete Step 1 member registration before paying"},409);
 const m=rows[0];const txnid="SBPF"+crypto.randomUUID().replaceAll("-","").slice(0,20);const amount="365.00";const productinfo="SBPF Annual Membership Test";const first=String(m.full_name||"SBPF Member").slice(0,60);const phone=String(m.mobile||"").replace(/[^0-9]/g,"").slice(0,15);const udf1=String(u.id),udf2="annual",udf3="",udf4="",udf5="";
 const ins=await fetch(url+"/rest/v1/membership_payments",{method:"POST",headers:{apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({user_id:u.id,member_id:String(m.member_id),order_id:txnid,amount:365,currency:"INR",gateway:"payu",status:"pending",plan_code:"annual",billing_interval:"yearly"})});
 if(!ins.ok)return j({error:"Could not create pending payment record",details:(await ins.text()).slice(0,250)},502);
 const h=await hash([key,txnid,amount,productinfo,first,u.email,udf1,udf2,udf3,udf4,udf5,"","","","","",salt].join("|"));
 const cb=url+"/functions/v1/payu-response";return j({mode:"test",action:"https://test.payu.in/_payment",method:"POST",txnid,amount,currency:"INR",fields:{key,txnid,amount,productinfo,firstname:first,email:u.email,phone,udf1,udf2,udf3,udf4,udf5,surl:cb,furl:cb,hash:h},note:"Test mode only; membership activates only after response hash and PayU server verification."});
});