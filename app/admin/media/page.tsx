import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Media } from "@/types/database";
import { MediaLibraryClient } from "@/components/admin/MediaLibrary";

async function getMedia(): Promise<Media[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as Media[];
}

export default async function AdminMediaPage() {
  await requireAdmin();
  const media = await getMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">Media Library</h1>
        <p className="text-text-muted mt-1">Upload and manage images, videos, and documents.</p>
      </div>
      <MediaLibraryClient initialMedia={media} />
    </div>
  );
}
