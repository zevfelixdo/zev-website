import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/public";
import type { Post } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, Tag } from "lucide-react";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { sanitizePostHtml } from "@/lib/sanitize";
import { ShareButtons } from "@/components/public/ShareButtons";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { RelatedPosts } from "@/components/public/RelatedPosts";
import { RevealHeading } from "@/components/public/RevealHeading";
import { Doodle } from "@/components/public/Doodle";

export const revalidate = 300; // re-fetch at most every 5 minutes

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("*, cover_image:cover_image_id(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return data as unknown as Post | null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(post: Post): Promise<Post[]> {
  if (!post.tags?.length) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, published_at, reading_time_minutes, tags, cover_image_url")
      .eq("status", "published")
      .neq("id", post.id)
      .overlaps("tags", post.tags)
      .order("published_at", { ascending: false })
      .limit(3);
    return (data ?? []) as unknown as Post[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Not found" };

  const coverUrl =
    (post.cover_image as unknown as { public_url: string } | null)?.public_url ??
    post.cover_image_url;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `${BASE}/writing/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
      images: coverUrl ? [{ url: coverUrl }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const [related] = await Promise.all([getRelatedPosts(post)]);

  const coverUrl =
    (post.cover_image as unknown as { public_url: string } | null)?.public_url ??
    post.cover_image_url;

  const safeBody = post.body ? sanitizePostHtml(post.body) : null;
  const postUrl = `${BASE}/writing/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "Zev Felix",
      url: BASE,
    },
    image: coverUrl,
    url: `${BASE}/writing/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading progress bar — fixed at top */}
      <ReadingProgress />

      {/* Back link */}
      <div className="container-content pt-8">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base transition-colors"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>
      </div>

      {/* Hero */}
      <article className="relative container-content py-10 max-w-3xl overflow-x-clip" id="article-body">
        <Doodle name="sparkle" size={30} float className="hidden xl:block absolute right-2 top-12 text-fun-coral" />
        {/* Cover image */}
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

        {/* Tags — link to filtered writing list */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/writing?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
              >
                <Tag size={10} />
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base leading-tight mb-5">
          <RevealHeading text={post.title} trigger="mount" stagger={38} />
        </h1>

        {/* Meta */}
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

        {/* Body — sanitized HTML */}
        {safeBody ? (
          <ScrollReveal>
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />
          </ScrollReveal>
        ) : (
          <p className="text-text-muted italic">No content yet.</p>
        )}

        {/* Share + back */}
        <div className="mt-16 pt-8 border-t border-border space-y-6">
          <ShareButtons url={postUrl} title={post.title} />
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
          >
            <ArrowLeft size={14} />
            Back to all posts
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <RelatedPosts posts={related} />
        </div>
      )}
    </>
  );
}
