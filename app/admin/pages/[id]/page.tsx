import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import type { Page, PageSection } from "@/types/database";
import { PageEditor } from "@/components/admin/PageEditor";

async function getPageWithSections(id: string) {
  const supabase = createAdminClient();
  const [pageRes, sectionsRes] = await Promise.all([
    supabase.from("pages").select("*").eq("id", id).single(),
    supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", id)
      .order("position"),
  ]);
  if (pageRes.error || !pageRes.data) return null;
  return {
    page: pageRes.data as Page,
    sections: (sectionsRes.data ?? []) as PageSection[],
  };
}

export default async function AdminPageEditorPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const result = await getPageWithSections(params.id);
  if (!result) notFound();

  return <PageEditor page={result.page} sections={result.sections} />;
}
