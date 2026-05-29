import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CvEntry, Publication } from "@/types/database";
import { CvEditor } from "@/components/admin/CvEditor";

async function getCvData() {
  const supabase = createAdminClient();
  const [cvRes, pubRes] = await Promise.all([
    supabase.from("cv_entries").select("*").order("category").order("position"),
    supabase.from("publications").select("*").order("year", { ascending: false }).order("position"),
  ]);
  return {
    entries: (cvRes.data ?? []) as CvEntry[],
    publications: (pubRes.data ?? []) as Publication[],
  };
}

export default async function AdminCvPage() {
  await requireAdmin();
  const { entries, publications } = await getCvData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">CV &amp; Publications</h1>
        <p className="text-text-muted mt-1">Manage education, training, experience, and publications.</p>
      </div>
      <CvEditor initialEntries={entries} initialPublications={publications} />
    </div>
  );
}
