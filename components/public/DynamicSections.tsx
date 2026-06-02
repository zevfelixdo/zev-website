import { createPublicClient } from "@/lib/supabase/public";
import type { PageSection } from "@/types/database";
import { SectionList } from "./SectionRenderer";

interface DynamicSectionsProps {
  pageSlug: string;
}

async function getSections(slug: string): Promise<PageSection[]> {
  try {
    const supabase = createPublicClient();
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!page) return [];

    const { data: sections } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", page.id)
      .eq("is_visible", true)
      .order("position");

    return (sections ?? []) as PageSection[];
  } catch {
    return [];
  }
}

// Renders any CMS sections added to a page via the admin editor.
// Each public page calls this at the bottom — admin-added sections
// (images, videos, galleries, rich text, etc.) appear here.
export async function DynamicSections({ pageSlug }: DynamicSectionsProps) {
  const sections = await getSections(pageSlug);
  if (sections.length === 0) return null;

  return <SectionList sections={sections} />;
}
