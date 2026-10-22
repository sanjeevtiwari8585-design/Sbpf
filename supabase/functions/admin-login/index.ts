import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const html = `<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SBPF Admin Login</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
body{font-family:Arial,sans-serif;background:#f3f7fb;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
.box{background:#fff;padding:25px;border-radius:14px;box-shadow:0 4px 20px #0002;width:min(90%,380px)}
h2{color:#082f56}input{width:100%;box-sizing:border-box;padding:12px;margin:7px 0;border:1px solid #ccd7e2;border-radius:8px}
button{width:100%;padding:12px;margin-top:10px;border:0;border-radius:8px;background:#0b4d7d;color:white;font-weight:bold}
.err{color:#c82333;margin-top:10px}
</style>
</head>
<body>
<div class="box">
<h2>स्वर्णिम भारत परिवार फाउंडेशन</h2>
<p>Admin Login</p>
<input id="email" type="email" placeholder="Admin Email" autocomplete="username">
<input id="pass" type="password" placeholder="Password" autocomplete="current-password">
<button id="btn">Login</button>
<div id="msg"></div>
</div>
<script>
const U="https://dxowhzghrdghfzoggorx.supabase.co";
const sb=supabase.createClient(U,"sb_publishable_Papyb2MMv6Sr3V3QMjVSNQ_3GWXCiCo");
document.getElementById("btn").onclick=async()=>{
 const msg=document.getElementById("msg"), email=document.getElementById("email"), pass=document.getElementById("pass");
 msg.className=""; msg.textContent="Login हो रहा है...";
 const r=await sb.auth.signInWithPassword({email:email.value.trim(),password:pass.value});
 if(r.error){msg.className="err";msg.textContent=r.error.message;return}
 const a=await sb.rpc("is_admin");
 if(a.error||a.data!==true){await sb.auth.signOut();msg.className="err";msg.textContent="यह account Admin नहीं है";return}
 location.href=U+"/functions/v1/admin-panel";
};
</script>
</body>
</html>`;

Deno.serve(() => new Response(html, {
  status: 200,
  headers: new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff"
  })
}));