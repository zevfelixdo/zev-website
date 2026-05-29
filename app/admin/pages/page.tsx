import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import type { Page } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Edit2, Globe, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getPages(): Promise<Page[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("pages").select("*").order("created_at");
  return (data ?? []) as Page[];
}

export default async function AdminPagesListPage() {
  await requireAdmin();
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">Pages</h1>
          <p className="text-text-muted mt-1">Edit page content, sections, and metadata.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-text-base truncate">{page.title}</p>
                {page.is_system && (
                  <Badge variant="info" size="sm">System</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>/{page.slug}</span>
                <span>·</span>
                <span>Updated {formatDate(page.updated_at, { month: "short", day: "numeric" })}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge variant={page.status === "published" ? "success" : "warning"}>
                {page.status === "published" ? (
                  <><Globe size={10} className="mr-1 inline" />Published</>
                ) : (
                  <><EyeOff size={10} className="mr-1 inline" />Draft</>
                )}
              </Badge>
              <Button as="link" href={`/admin/pages/${page.id}`} size="sm" variant="outline">
                <Edit2 size={14} />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
