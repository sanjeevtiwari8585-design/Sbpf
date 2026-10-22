import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({error:"Unauthorized"}), {status:401});
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global:{headers:{Authorization:authHeader}}
    });
    const {data:{user}} = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({error:"Unauthorized"}), {status:401});

    const {post_id} = await req.json();
    const {data:post,error} = await supabase.from("media_posts")
      .select("id,title,content,media_type,media_url,thumbnail_url,category_id,status,journalist_id")
      .eq("id",post_id).single();
    if (error || !post) return new Response(JSON.stringify({error:"Post not found"}),{status:404});

    const {data:j} = await supabase.from("media_journalists")
      .select("id,status").eq("id",post.journalist_id).eq("user_id",user.id).single();
    if (!j || j.status !== "approved") return new Response(JSON.stringify({error:"Approved journalist access required"}),{status:403});

    const reasons:string[]=[];
    if (!post.title?.trim()) reasons.push("Title is required");
    if (!post.category_id) reasons.push("Category is required");

    if (post.media_type === "video") {
      if (!post.media_url?.trim()) reasons.push("Video URL is required");
      if (!post.thumbnail_url?.trim()) reasons.push("Thumbnail is required");
    } else if (post.media_type === "photo") {
      if (!post.media_url?.trim()) reasons.push("Photo URL is required");
    } else if (post.media_type === "news" || post.media_type === "article") {
      if (!post.content?.trim()) reasons.push("Content is required");
    } else if (post.media_type === "social") {
      if (!post.content?.trim() && !post.media_url?.trim()) reasons.push("Post text or media URL is required");
    }

    const autoApproved = reasons.length === 0;
    const review_status = autoApproved ? "auto_approved" : "auto_rejected";
    const update:any = {
      review_status,
      review_reason: reasons.length ? reasons.join("; ") : "Automatic checks passed",
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (autoApproved) {
      update.status="published";
      update.published_at=new Date().toISOString();
    } else {
      update.status="rejected";
    }

    const {error:updateError}=await supabase.from("media_posts").update(update).eq("id",post.id);
    if(updateError) return new Response(JSON.stringify({error:updateError.message}),{status:400});

    return new Response(JSON.stringify({success:true,media_type:post.media_type,review_status,status:update.status,reasons}),{headers:{"Content-Type":"application/json"}});
  } catch(e) {
    return new Response(JSON.stringify({error:String(e)}),{status:500});
  }
});