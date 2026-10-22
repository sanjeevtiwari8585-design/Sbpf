import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const C={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
async function sha(v:string){const d=await crypto.subtle.digest("SHA-512",new TextEncoder().encode(v));return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,"0")).join("");}
function eq(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
function page(t:string,s=200){return new Response("<!doctype html><meta name='viewport' content='width=device-width'><title>SBPF PayU Test</title><main style='font:16px system-ui;max-width:640px;margin:40px auto;padding:20px'><h2>SBPF PayU Test</h2><p>"+t+"</p><p>Test mode only.</p></main>",{status:s,headers:{...C,"Content-Type":"text/html; charset=utf-8"}});}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:C});if(req.method!=="POST")return page("PayU callback requires POST.",405);
 const key=Deno.env.get("PAYU_KEY"),salt=Deno.env.get("PAYU_SALT"),url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!key||!salt||!url||!service)return page("Server secrets are incomplete. No membership was activated.",503);
 try{
  const p=new URLSearchParams(await req.text());const g=(k:string)=>p.get(k)||"";
  const txnid=g("txnid"),status=g("status").toLowerCase(),responseHash=g("hash").toLowerCase(),amount=g("amount"),product=g("productinfo"),first=g("firstname"),email=g("email"),udf1=g("udf1"),udf2=g("udf2"),udf3=g("udf3"),udf4=g("udf4"),udf5=g("udf5");
  if(!/^SBPF[a-f0-9]{20}$/i.test(txnid))return page("Invalid order ID. No membership was activated.",400);
  const reverse=[salt,status,"","","","", "",udf5,udf4,udf3,udf2,udf1,email,first,product,amount,txnid,key].join("|");
  if(!responseHash||!eq(responseHash,await sha(reverse))||amount!=="365.00"&&amount!=="365.0"&&amount!=="365"||udf2!=="annual")return page("Response hash, amount, or plan check failed. No membership was activated.",400);
  const get=await fetch(url+"/rest/v1/membership_payments?order_id=eq."+encodeURIComponent(txnid)+"&select=user_id,member_id,amount,status&limit=1",{headers:{apikey:service,Authorization:"Bearer "+service}});
  if(!get.ok)return page("Could not locate the payment order. No membership was activated.",502);const orders=await get.json();if(!orders.length)return page("Unknown order. No membership was activated.",404);const order=orders[0];
  if(Number(order.amount)!==365||String(order.user_id)!==udf1)return page("Order ownership or amount mismatch. No membership was activated.",400);
  if(order.status==="paid")return page("This payment was already recorded. No duplicate activation was performed.");
  const verifyHash=await sha([key,"verify_payment",txnid,salt].join("|"));
  const verify=await fetch("https://test.payu.in/merchant/postservice.php?form=2",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({key,command:"verify_payment",var1:txnid,hash:verifyHash})});
  if(!verify.ok)return page("PayU server verification is unavailable. Payment remains pending.",502);
  const vd=await verify.json();const det=vd?.transaction_details?.[txnid];const vstatus=String(det?.status||"").toLowerCase();const vamount=Number(det?.amt??det?.amount??0);const success=Number(vd?.status)===1&&vstatus==="success"&&vamount===365&&String(det?.udf1||"")===udf1;
  if(!success){await fetch(url+"/rest/v1/membership_payments?order_id=eq."+encodeURIComponent(txnid)+"&status=eq.pending",{method:"PATCH",headers:{apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"},body:JSON.stringify({status:status==="failure"?"failed":"pending",gateway_response:{callback_status:status,verification_status:vstatus},updated_at:new Date().toISOString()})});return page("PayU has not verified a successful ₹365 transaction. Membership remains inactive.");}
  const paid=await fetch(url+"/rest/v1/membership_payments?order_id=eq."+encodeURIComponent(txnid)+"&status=eq.pending",{method:"PATCH",headers:{apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({status:"paid",gateway:"payu",gateway_transaction_id:String(det?.mihpayid||det?.payuMoneyId||txnid),gateway_response:{verified:true,txnid,amount:365,status:vstatus},paid_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
  if(!paid.ok)return page("Payment verified but recording failed; contact administrator before retrying.",502);const changed=await paid.json();if(!changed.length)return page("Payment was already processed or order changed. No duplicate activation.");
  const now=new Date();const start=now.toISOString().slice(0,10);const expiry=new Date(now.getTime());expiry.setUTCFullYear(expiry.getUTCFullYear()+1);const end=expiry.toISOString().slice(0,10);
  await fetch(url+"/rest/v1/members?user_id=eq."+encodeURIComponent(udf1),{method:"PATCH",headers:{apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"},body:JSON.stringify({payment_status:"paid",membership_status:"active",membership_start_date:start,membership_end_date:end})});
  const existing=await fetch(url+"/rest/v1/memberships?user_id=eq."+encodeURIComponent(udf1)+"&select=id&limit=1",{headers:{apikey:service,Authorization:"Bearer "+service}});
  if(existing.ok){const ms=await existing.json();if(ms.length){await fetch(url+"/rest/v1/memberships?id=eq."+ms[0].id,{method:"PATCH",headers:{apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"},body:JSON.stringify({amount:365,status:"active",start_date:start,expiry_date:end,plan_code:"annual",billing_interval:"yearly"})});}}
  return page("PayU server verification succeeded. ₹365 test payment recorded and membership updated for this test environment.");
 }catch{return page("Could not process the callback safely. Membership has not been confirmed.",400);}
});