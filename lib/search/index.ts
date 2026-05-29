import { createClient } from "@/lib/supabase/server";
import type { SearchResult } from "@/types/database";

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const supabase = createClient();
  const sanitized = query.trim().slice(0, 200);

  const { data, error } = await supabase
    .from("search_index")
    .select("id, content_type, content_id, title, excerpt, url, tags, updated_at")
    .eq("is_public", true)
    .textSearch("search_vector", sanitized, {
      type: "websearch",
      config: "english",
    })
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Search error:", error.message);
    return [];
  }

  return (data ?? []) as SearchResult[];
}

// Called from admin API routes to rebuild the search index for a record
export async function upsertSearchEntry(entry: {
  contentType: string;
  contentId: string;
  title: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  url: string;
  isPublic?: boolean;
}): Promise<void> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  await supabase.from("search_index").upsert(
    {
      content_type: entry.contentType,
      content_id: entry.contentId,
      title: entry.title,
      excerpt: entry.excerpt ?? null,
      body: entry.body ?? null,
      tags: entry.tags ?? [],
      url: entry.url,
      is_public: entry.isPublic ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "content_type,content_id" }
  );
}

export async function removeSearchEntry(contentType: string, contentId: string): Promise<void> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  await supabase
    .from("search_index")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId);
}
