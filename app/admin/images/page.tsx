import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Media, ImagePlacement } from "@/types/database";
import { PLACEMENT_AREAS } from "@/lib/areas";
import { ImagePlacements } from "@/components/admin/ImagePlacements";

export default async function AdminImagePlacementsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [placementsRes, imagesRes] = await Promise.all([
    supabase.from("image_placements").select("*, media:media_id(*)"),
    supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const placements = (placementsRes.data ?? []) as unknown as ImagePlacement[];
  const images = (imagesRes.data ?? []) as Media[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">Image Placements</h1>
        <p className="text-text-muted mt-1">
          Assign an image from the <span className="font-medium text-text-base">Media Library</span> to each
          spot on the site. Set its framing for desktop and mobile, fit, caption, and visibility. Upload
          files in Media first; changes here go live without touching code.
        </p>
      </div>
      <ImagePlacements areas={PLACEMENT_AREAS} initialPlacements={placements} images={images} />
    </div>
  );
}
