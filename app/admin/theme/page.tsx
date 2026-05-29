import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Theme } from "@/types/database";
import { ThemeEditorClient } from "@/components/admin/ThemeEditor";

async function getThemes(): Promise<Theme[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("themes").select("*").order("created_at");
  return (data ?? []) as Theme[];
}

export default async function AdminThemePage() {
  await requireAdmin();
  const themes = await getThemes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">Theme Editor</h1>
        <p className="text-text-muted mt-1">
          Change colors, typography, and layout. Changes apply site-wide instantly.
        </p>
      </div>
      <ThemeEditorClient themes={themes} />
    </div>
  );
}
