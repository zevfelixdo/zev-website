"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { stripHtml, slugify } from "@/lib/utils";
import { ArrowLeft, Save, Eye, EyeOff, Star, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

function calcReadingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("posts").select("*").eq("id", id).single();
    if (!data) { router.push("/admin/writing"); return; }
    const p = data as Post;
    setPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt ?? "");
    setBody(p.body ?? "");
    setTags(p.tags.join(", "));
    setCoverImageUrl(p.cover_image_url ?? "");
    setIsFeatured(p.is_featured);
  }, [id, router, supabase]);

  useEffect(() => { load(); }, [load]);

  const save = async (opts?: { publish?: boolean; unpublish?: boolean }) => {
    if (!post) return;
    setSaving(true);
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const readingTime = body ? calcReadingTime(body) : null;
    const updates: Partial<Post> & Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      body: body || null,
      cover_image_url: coverImageUrl.trim() || null,
      tags: tagArr,
      reading_time_minutes: readingTime,
      is_featured: isFeatured,
    };
    if (opts?.publish) {
      updates.status = "published";
      updates.published_at = post.published_at ?? new Date().toISOString();
    }
    if (opts?.unpublish) {
      updates.status = "draft";
    }
    const { error } = await supabase.from("posts").update(updates).eq("id", post.id);
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success(opts?.publish ? "Published!" : opts?.unpublish ? "Unpublished" : "Saved");
      setDirty(false);
      load();
      // Keep search index in sync — non-blocking, never fails the save
      fetch("/api/admin/reindex-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      }).catch(() => {/* silent */});
    }
    setSaving(false);
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isPublished = post.status === "published";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/admin/writing"
          className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-semibold text-text-base">Edit post</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Status: <span className={isPublished ? "text-green-600 font-medium" : ""}>{post.status}</span>
            {post.reading_time_minutes && ` · ${post.reading_time_minutes} min read`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-xs text-text-muted">Unsaved changes</span>
          )}
          <Button variant="outline" onClick={() => save()} loading={saving}>
            <Save size={14} className="mr-1" /> Save draft
          </Button>
          {!isPublished ? (
            <Button onClick={() => save({ publish: true })} loading={saving}>
              <Eye size={14} className="mr-1" /> Publish
            </Button>
          ) : (
            <Button variant="outline" onClick={() => save({ unpublish: true })} loading={saving}>
              <EyeOff size={14} className="mr-1" /> Unpublish
            </Button>
          )}
          {/* Preview (always available) */}
          <a
            href={`/admin/writing/${post.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-sm text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
            title="Preview post"
          >
            <Eye size={14} />
            Preview
          </a>
          {/* View live (published only) */}
          {isPublished && (
            <a
              href={`/writing/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded border border-border text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors"
              title="View live post"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <Input
        label="Title"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setDirty(true); if (!post.slug || post.slug === slugify(post.title)) setSlug(slugify(e.target.value)); }}
        placeholder="Post title"
        className="text-xl font-serif"
      />

      {/* Slug */}
      <Input
        label="Slug"
        value={slug}
        onChange={(e) => { setSlug(e.target.value); setDirty(true); }}
        helper={`Public URL: /writing/${slug}`}
        placeholder="post-slug"
      />

      {/* Excerpt */}
      <div>
        <label className="text-sm font-medium text-text-base mb-1.5 block">
          Excerpt <span className="text-text-muted font-normal">(shown in post list)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => { setExcerpt(e.target.value); setDirty(true); }}
          rows={3}
          placeholder="A short summary of this post..."
          className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="text-sm font-medium text-text-base mb-1.5 block">Cover image</label>
        <ImagePicker
          value={coverImageUrl}
          onChange={(url) => { setCoverImageUrl(url); setDirty(true); }}
          placeholder="Pick from library or paste URL"
        />
      </div>

      {/* Tags + featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => { setTags(e.target.value); setDirty(true); }}
          placeholder="medicine, technology, outdoors"
        />
        <div className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            id="featured"
            checked={isFeatured}
            onChange={(e) => { setIsFeatured(e.target.checked); setDirty(true); }}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="featured" className="text-sm text-text-base flex items-center gap-1.5">
            <Star size={14} className="text-yellow-500" />
            Featured post (shown prominently on /writing)
          </label>
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="text-sm font-medium text-text-base mb-1.5 block">Body</label>
        <RichTextEditor
          content={body}
          onChange={(html) => { setBody(html); setDirty(true); }}
        />
      </div>

      {/* Bottom save */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => save()} loading={saving}>
          <Save size={14} className="mr-1" /> Save draft
        </Button>
        {!isPublished ? (
          <Button onClick={() => save({ publish: true })} loading={saving}>
            <Eye size={14} className="mr-1" /> Publish
          </Button>
        ) : (
          <Button variant="outline" onClick={() => save({ unpublish: true })} loading={saving}>
            <EyeOff size={14} className="mr-1" /> Unpublish
          </Button>
        )}
      </div>
    </div>
  );
}
