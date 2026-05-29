import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // lastModified for static pages: approximate launch date — update when you significantly revise a page
  const siteLastModified = new Date("2025-01-01");

  const staticPages = [
    { url: BASE, lastModified: siteLastModified, priority: 1.0, changeFrequency: "monthly" as const },
    { url: `${BASE}/about`, lastModified: siteLastModified, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/writing`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/path`, lastModified: siteLastModified, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/unplugged`, lastModified: siteLastModified, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/medicine`, lastModified: siteLastModified, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/outdoors`, lastModified: siteLastModified, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/work`, lastModified: siteLastModified, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE}/cv`, lastModified: siteLastModified, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE}/contact`, lastModified: siteLastModified, priority: 0.5, changeFrequency: "yearly" as const },
  ];

  // Add published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const postEntries = (posts ?? []).map((p) => ({
    url: `${BASE}/writing/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  // Add published project slugs
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("is_published", true);

  const projectEntries = (projects ?? []).map((p) => ({
    url: `${BASE}/work#${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...postEntries, ...projectEntries];
}
