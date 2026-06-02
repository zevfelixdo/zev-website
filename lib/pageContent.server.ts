import { createPublicClient } from "@/lib/supabase/public";
import type { PageContent } from "@/lib/pageContent";

/** Read the saved content map for a page (server). Returns {} if none. */
export async function getPageContent(slug: string): Promise<PageContent> {
  try {
    const sb = createPublicClient();
    const { data } = await sb
      .from("site_settings")
      .select("value")
      .eq("key", `page:${slug}`)
      .maybeSingle();
    return ((data?.value as PageContent) ?? {}) as PageContent;
  } catch {
    return {};
  }
}
