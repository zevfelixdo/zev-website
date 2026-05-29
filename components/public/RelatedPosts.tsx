import Link from "next/link";
import { Clock } from "lucide-react";
import type { Post } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container-content py-14 max-w-3xl">
      <h2 className="font-serif text-xl font-semibold text-text-base mb-8">
        Related reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/writing/${post.slug}`}
            className="group flex flex-col gap-3 p-5 bg-surface border border-border rounded-lg hover:shadow-dropdown hover:border-primary/30 transition-all duration-200"
          >
            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-32 object-cover rounded-md"
                loading="lazy"
              />
            )}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}
                </time>
              )}
              {post.reading_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {post.reading_time_minutes} min
                </span>
              )}
            </div>
            <h3 className="font-serif font-semibold text-text-base group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
