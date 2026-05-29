"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, slugify } from "@/lib/utils";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminWritingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createPost = async () => {
    const title = prompt("Post title:");
    if (!title?.trim()) return;
    const slug = slugify(title);
    const { data, error } = await supabase
      .from("posts")
      .insert({ title: title.trim(), slug })
      .select()
      .single();
    if (error) {
      toast.error("Failed to create post");
      return;
    }
    toast.success("Post created");
    window.location.href = `/admin/writing/${data.id}`;
  };

  const reindex = (postId: string) => {
    fetch("/api/admin/reindex-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {/* silent */});
  };

  const togglePublish = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("posts")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) {
      toast.error("Failed to update post");
      return;
    }
    toast.success(newStatus === "published" ? "Post published" : "Post unpublished");
    reindex(post.id);
    load();
  };

  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      toast.error("Failed to delete post");
      return;
    }
    toast.success("Post deleted");
    // Remove from search index
    fetch("/api/admin/reindex-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    }).catch(() => {/* silent */});
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">Writing</h1>
          <p className="text-text-muted mt-1">
            {posts.filter((p) => p.status === "published").length} published ·{" "}
            {posts.filter((p) => p.status === "draft").length} drafts
          </p>
        </div>
        <Button onClick={createPost}>
          <Plus size={16} className="mr-1" /> New post
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-alt animate-pulse rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="mb-4">No posts yet.</p>
          <Button onClick={createPost}>Create your first post</Button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-text-base truncate">{post.title}</p>
                  <Badge variant={post.status === "published" ? "success" : "default"}>
                    {post.status}
                  </Badge>
                  {post.is_featured && <Badge variant="info">Featured</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-text-muted">
                  <span>/{post.slug}</span>
                  {post.published_at && (
                    <span>
                      Published {formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                  {post.reading_time_minutes && <span>{post.reading_time_minutes} min read</span>}
                  {post.tags.length > 0 && <span>{post.tags.join(", ")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {post.status === "published" && (
                  <a
                    href={`/writing/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
                    title="View post"
                  >
                    <Eye size={16} />
                  </a>
                )}
                <button
                  onClick={() => togglePublish(post)}
                  className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
                  title={post.status === "published" ? "Unpublish" : "Publish"}
                >
                  {post.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Link
                  href={`/admin/writing/${post.id}`}
                  className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => deletePost(post)}
                  className="p-2 rounded text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
