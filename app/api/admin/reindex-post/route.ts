import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertSearchEntry, removeSearchEntry } from "@/lib/search";

/**
 * Called by the post editor after a successful save/publish/unpublish.
 * Keeps the search_index table in sync with posts.
 *
 * POST /api/admin/reindex-post
 * Body: { postId: string }
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, body, tags, status, updated_at")
      .eq("id", postId)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status === "published") {
      await upsertSearchEntry({
        contentType: "post",
        contentId: post.id,
        title: post.title,
        excerpt: post.excerpt ?? undefined,
        body: post.body ?? undefined,
        tags: post.tags ?? [],
        url: `/writing/${post.slug}`,
        isPublic: true,
      });
    } else {
      // Draft or unpublished — remove from public search
      await removeSearchEntry("post", post.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reindex post error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
