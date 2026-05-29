import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { sanitizePostHtml } from "@/lib/sanitize";
import { Clock, ArrowLeft, Tag, AlertTriangle } from "lucide-react";

interface Props {
  params: { id: string };
}

export default async function PostPreviewPage({ params }: Props) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*, cover_image:cover_image_id(*)")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const post = data as unknown as Post;
  const coverUrl =
    (post.cover_image as unknown as { public_url: string } | null)?.public_url ??
    post.cover_image_url;
  const safeBody = post.body ? sanitizePostHtml(post.body) : null;

  return (
    <>
      {/* Draft notice banner */}
      {post.status !== "published" && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3 text-sm text-amber-800">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>
            <strong>Draft preview</strong> — this post is not publicly visible yet.{" "}
            <Link href={`/admin/writing/${post.id}`} className="underline hover:opacity-80">
              Back to editor
            </Link>
          </span>
        </div>
      )}

      {/* Back to editor */}
      <div className="container-content pt-8">
        <Link
          href={`/admin/writing/${post.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base transition-colors"
        >
          <ArrowLeft size={14} />
          Back to editor
        </Link>
      </div>

      <article className="container-content py-10 max-w-3xl">
        {coverUrl && (
          <div className="relative w-full h-72 sm:h-96 rounded-lg overflow-hidden mb-10">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted pb-8 border-b border-border mb-10">
          {post.published_at && (
            <time dateTime={post.published_at}>
              {formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}
            </time>
          )}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.reading_time_minutes} min read
            </span>
          )}
        </div>

        {safeBody ? (
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: safeBody }} />
        ) : (
          <p className="text-text-muted italic">No content yet.</p>
        )}
      </article>
    </>
  );
}
