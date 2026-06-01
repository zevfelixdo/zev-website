import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/database";
import { DynamicSections } from "@/components/public/DynamicSections";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Clock, Rss, X } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes on medicine, technology, the outdoors, and living well.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com"}/writing`,
    types: { "application/rss+xml": "/feed.xml" },
  },
};

const PAGE_SIZE = 12;

async function getPosts(tag?: string, page = 1): Promise<{ posts: Post[]; total: number; allTags: string[] }> {
  try {
    const supabase = createClient();
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("posts")
      .select("*, cover_image:cover_image_id(*)", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    const { data, count } = await query.range(from, to);

    // Get all unique tags from all published posts for the filter UI
    const { data: tagData } = await supabase
      .from("posts")
      .select("tags")
      .eq("status", "published");

    const allTags = Array.from(
      new Set((tagData ?? []).flatMap((p: { tags: string[] }) => p.tags))
    ).sort();

    return {
      posts: (data ?? []) as unknown as Post[],
      total: count ?? 0,
      allTags,
    };
  } catch {
    return { posts: [], total: 0, allTags: [] };
  }
}

interface Props {
  searchParams: { tag?: string; page?: string };
}

export default async function WritingPage({ searchParams }: Props) {
  const activeTag = searchParams.tag ?? undefined;
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const { posts, total, allTags } = await getPosts(activeTag, page);
  const c = await getPageContent("writing");
  const f = (key: string, fallback: string) => field(c, key, fallback);

  const featured = activeTag ? [] : posts.filter((p) => p.is_featured);
  const rest = activeTag ? posts : posts.filter((p) => !p.is_featured);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      {/* Hero */}
      <PageHero
        eyebrow={f("hero.eyebrow", "Writing")}
        heading={f("hero.heading", "Essays & notes")}
        minH="min-h-[50vh]"
        underDoodle={null}
        collage={{ cartoon: "sitting", blobVariant: 1, doodle: "sparkle" }}
      >
        <p>
          {f("hero.lead", "Occasional thoughts on medicine, technology, the outdoors, and what it means to live well. Written when I have something worth saying.")}
        </p>
        <a
          href="/feed.xml"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
          aria-label="RSS feed"
        >
          <Rss size={16} />
          {f("hero.rss", "RSS feed")}
        </a>
      </PageHero>

      <div className="border-t border-border" />

      <section className="relative section-y container-content overflow-x-clip">
        <Doodle name="loops" size={80} strokeWidth={4} className="hidden lg:block absolute right-[6%] top-12 text-fun-sky/50" />
        {/* Tag filter bar */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mr-1">
              Filter:
            </span>
            {allTags.map((tag) => {
              const isActive = tag === activeTag;
              return (
                <Link
                  key={tag}
                  href={isActive ? "/writing" : `/writing?tag=${encodeURIComponent(tag)}`}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-text-muted hover:border-primary/40 hover:text-text-base"
                  }`}
                >
                  {tag}
                  {isActive && <X size={10} />}
                </Link>
              );
            })}
          </div>
        )}

        {/* Active tag label */}
        {activeTag && (
          <p className="text-sm text-text-muted mb-8 max-w-3xl">
            Showing{" "}
            <span className="font-medium text-text-base">{total}</span>{" "}
            {total === 1 ? "post" : "posts"} tagged{" "}
            <span className="font-medium text-text-base">"{activeTag}"</span>
          </p>
        )}

        {posts.length === 0 ? (
          <p className="text-text-muted">
            {activeTag ? `No posts tagged "${activeTag}" yet.` : f("empty", "Essays and notes coming soon.")}
          </p>
        ) : (
          <div className="max-w-3xl">
            {/* Featured posts (only on unfiltered first page) */}
            {featured.length > 0 && (
              <div className="mb-14">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-6">
                  Featured
                </p>
                <div className="space-y-8">
                  {featured.map((post) => (
                    <PostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-6">
                    All posts
                  </p>
                )}
                <div className="divide-y divide-border">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                {page > 1 ? (
                  <Link
                    href={`/writing?${activeTag ? `tag=${encodeURIComponent(activeTag)}&` : ""}page=${page - 1}`}
                    className="text-sm text-primary font-medium hover:opacity-80 transition-opacity"
                  >
                    ← Newer
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-muted">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    href={`/writing?${activeTag ? `tag=${encodeURIComponent(activeTag)}&` : ""}page=${page + 1}`}
                    className="text-sm text-primary font-medium hover:opacity-80 transition-opacity"
                  >
                    Older →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <DynamicSections pageSlug="writing" />
    </>
  );
}

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const coverUrl =
    (post.cover_image as unknown as { public_url: string } | null)?.public_url ??
    post.cover_image_url;

  if (featured) {
    return (
      <Link
        href={`/writing/${post.slug}`}
        className="group block bg-surface border border-border rounded-lg overflow-hidden hover:shadow-dropdown hover:border-primary/30 transition-all duration-200"
      >
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={post.title}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-6">
          <PostMeta post={post} />
          <h2 className="font-serif text-2xl font-semibold text-text-base mt-3 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
          )}
          <p className="mt-4 text-sm text-primary font-medium group-hover:opacity-80 transition-opacity">
            Read more →
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex gap-6 py-7 items-start hover:opacity-80 transition-opacity"
    >
      {coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={post.title}
          className="w-24 h-24 object-cover rounded-md flex-shrink-0 hidden sm:block"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        <PostMeta post={post} />
        <h2 className="font-serif text-xl font-semibold text-text-base mt-2 mb-1.5 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
      {post.published_at && (
        <time dateTime={post.published_at}>
          {formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}
        </time>
      )}
      {post.reading_time_minutes && (
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {post.reading_time_minutes} min read
        </span>
      )}
      {post.tags.slice(0, 3).map((tag) => (
        <Badge key={tag} variant="default">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
