import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Post } from "@/types/database";
import { stripHtml } from "@/lib/utils";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const posts: Post[] = (data ?? []) as Post[];

  const items = posts
    .map((post) => {
      const url = `${BASE}/writing/${post.slug}`;
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : "";
      const excerpt = post.excerpt ?? (post.body ? stripHtml(post.body).slice(0, 280) : "");
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      ${post.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zev Felix — Writing</title>
    <link>${BASE}/writing</link>
    <description>Essays and notes on medicine, technology, the outdoors, and living well.</description>
    <language>en-us</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
