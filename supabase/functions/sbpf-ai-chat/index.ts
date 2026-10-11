import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: cors });
  try {
    const body = await req.json();
    const question = typeof body?.message === "string" ? body.message.trim() : "";
    if (!question || question.length > 2000) return new Response(JSON.stringify({ error: "message आवश्यक है (अधिकतम 2000 अक्षर)।" }), { status: 400, headers: cors });

    const url = Deno.env.get("SUPABASE_URL");
    const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!url || !anon) return new Response(JSON.stringify({ error: "Supabase runtime configuration missing." }), { status: 503, headers: cors });

    const db = createClient(url, anon, { auth: { persistSession: false } });
    const [kb, campaigns, areas, schemes, officials] = await Promise.all([
      db.from("sbpf_ai_knowledge").select("topic,title,content,source_table").eq("is_active", true).eq("visibility", "public").limit(80),
      db.from("campaigns").select("name,slug,description,is_active").eq("is_active", true).limit(30),
      db.from("focus_areas").select("name,slug,description,is_active").eq("is_active", true).limit(30),
      db.from("government_schemes").select("name,description,official_url,category,scope,region_code,eligibility,benefits,required_documents,application_process,source_name,source_url,last_verified_at,sync_status").eq("published", true).limit(30),
      db.from("sbpf_government_officials").select("government_level,state_name,district_name,office_name,designation,official_name,phone_office,email,office_address,official_website,source_url,last_verified_at,record_status").eq("record_status", "verified").limit(30)
    ]);
    const kbRows = kb.data ?? [];
    const publicData = [
      ...(campaigns.data ?? []).map((x:any)=>({type:"campaign",...x})),
      ...(areas.data ?? []).map((x:any)=>({type:"work_area",...x})),
      ...(schemes.data ?? []).map((x:any)=>({type:"government_scheme",...x})),
      ...(officials.data ?? []).map((x:any)=>({type:"verified_official_directory",...x}))
    ];
    const context = [
      ...kbRows.map((d:any)=>`[${d.topic}] ${d.title}: ${d.content}`),
      ...publicData.map((d:any)=>JSON.stringify(d))
    ].join("\n").slice(0, 26000);

    const matches = kbRows.filter((d:any) => (question.toLowerCase().split(/\s+/).some((w:string)=>w.length>2 && (d.title+" "+d.content+" "+d.topic).toLowerCase().includes(w))));
    if (!openaiKey) {
      const records = publicData.filter((d:any) => JSON.stringify(d).toLowerCase().includes(question.toLowerCase())).slice(0,5);
      const answer = records.length
        ? "Supabase में मिले मिलान वाले सार्वजनिक रिकॉर्ड:\n" + records.map((d:any)=>JSON.stringify(d)).join("\n")
        : matches.length
          ? matches.slice(0,4).map((d:any)=>d.title+": "+d.content).join("\n\n")
          : "नमस्ते! मैं SBPF साथी हूँ। मैंने SBPF के सार्वजनिक ज्ञान-संग्रह और उपलब्ध सार्वजनिक अभियानों, कार्यक्षेत्रों, प्रकाशित योजनाओं तथा सत्यापित अधिकारी निर्देशिका से जुड़ने का प्रयास किया। प्राकृतिक भाषा में व्यापक AI उत्तर चालू करने के लिए सर्वर पर OPENAI_API_KEY जोड़ना बाकी है। आपकी पूछी बात के लिए अभी पर्याप्त सत्यापित मिलान नहीं मिला; कृपया विषय या जिला स्पष्ट लिखें।";
      return new Response(JSON.stringify({answer,setup_required:true,knowledge_count:kbRows.length,live_public_sources:["campaigns","focus_areas","government_schemes","sbpf_government_officials"],sources:matches.map((d:any)=>d.title)}),{status:200,headers:cors});
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{"Authorization":`Bearer ${openaiKey}`,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:Deno.env.get("SBPF_AI_MODEL") || "gpt-4o-mini",
        temperature:0.2,
        messages:[
          {role:"system",content:`आप SBPF साथी AI हैं। सरल हिंदी/Hinglish में सदस्य की मदद करें। दिए गए live Supabase public data और curated knowledge का उपयोग करें। आठों अभियान, कार्यक्षेत्र, सदस्यता, शिक्षा, सरकारी योजनाओं, सत्यापित सरकारी संपर्क, शिकायत/सेवा सहायता के प्रश्नों का स्पष्ट उत्तर दें। निजी सदस्य रिकॉर्ड, KYC, फोन/email, payment credentials, API keys, secrets, admin-only data न उजागर करें। संदर्भ से बाहर की जानकारी या live status न गढ़ें। scheme eligibility/application rules को source data से ही बताएं और official URL दें। कोई database write/action न करें। यदि जानकारी नहीं है तो साफ कहें और अगला सुरक्षित कदम सुझाएँ।\nSUPABASE LIVE PUBLIC CONTEXT:\n${context}`},
          {role:"user",content:question}
        ]
      })
    });
    const result = await response.json();
    if (!response.ok) return new Response(JSON.stringify({error:"AI provider request failed.",provider_status:response.status}),{status:502,headers:cors});
    const answer = result?.choices?.[0]?.message?.content;
    if (typeof answer !== "string") return new Response(JSON.stringify({error:"AI उत्तर प्राप्त नहीं हुआ।"}),{status:502,headers:cors});
    return new Response(JSON.stringify({answer,setup_required:false,knowledge_count:kbRows.length,live_public_sources:["campaigns","focus_areas","government_schemes","sbpf_government_officials"],sources:matches.map((d:any)=>d.title)}),{status:200,headers:cors});
  } catch {
    return new Response(JSON.stringify({error:"अनुरोध पढ़ने में समस्या हुई। कृपया दोबारा प्रयास करें।"}),{status:400,headers:cors});
  }
});