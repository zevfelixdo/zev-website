import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Page } from "@/types/database";
import { PagesManager } from "@/components/admin/PagesManager";

async function getPages(): Promise<Page[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("pages").select("*").order("created_at");
  return (data ?? []) as Page[];
}

export default async function AdminPagesListPage() {
  await requireAdmin();
  const pages = await getPages();

  return <PagesManager initialPages={pages} />;
}
