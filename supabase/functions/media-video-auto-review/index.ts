import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({error:"Unauthorized"}), {status:401});

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({error:"Unauthorized"}), {status:401});

    const { post_id } = await req.json();
    if (!post_id) return new Response(JSON.stringify({error:"post_id is required"}), {status:400});

    const { data: post, error: fetchError } = await supabase
      .from("media_posts")
      .select("id,title,content,media_type,media_url,thumbnail_url,category_id,status,journalist_id")
      .eq("id", post_id)
      .single();

    if (fetchError || !post) return new Response(JSON.stringify({error:"Video not found"}), {status:404});
    if (post.media_type !== "video") return new Response(JSON.stringify({error:"Only video posts are supported"}), {status:400});

    const { data: journalist } = await supabase
      .from("media_journalists")
      .select("id,status")
      .eq("id", post.journalist_id)
      .eq("user_id", user.id)
      .single();

    if (!journalist || journalist.status !== "approved") {
      return new Response(JSON.stringify({error:"Approved journalist access required"}), {status:403});
    }

    const reasons: string[] = [];
    if (!post.title?.trim()) reasons.push("Title is required");
    if (!post.media_url?.trim()) reasons.push("Video URL is required");
    if (!post.thumbnail_url?.trim()) reasons.push("Thumbnail is required");
    if (!post.category_id) reasons.push("Category is required");

    const status = reasons.length === 0 ? "published" : "rejected";
    const update: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString()
    };
    if (status === "published") update.published_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("media_posts")
      .update(update)
      .eq("id", post.id);

    if (updateError) return new Response(JSON.stringify({error:updateError.message}), {status:400});

    return new Response(JSON.stringify({
      success:true,
      post_id:post.id,
      auto_review: status === "published" ? "approved" : "rejected",
      status,
      reasons
    }), {headers:{"Content-Type":"application/json"}});
  } catch (e) {
    return new Response(JSON.stringify({error:String(e)}), {status:500});
  }
});