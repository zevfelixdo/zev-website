import { createClient } from "@/lib/supabase/server";
import type { ImagePlacement } from "@/types/database";

/**
 * Fetch a single image placement (joined with its media) for a named area.
 * Returns null if unset, hidden, missing media, or if the table does not exist
 * yet (pre-migration). Always fails gracefully so pages never break.
 */
export async function getPlacement(area: string): Promise<ImagePlacement | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("image_placements")
      .select("*, media:media_id(*)")
      .eq("area", area)
      .eq("is_visible", true)
      .maybeSingle();
    if (error || !data) return null;
    const placement = data as unknown as ImagePlacement;
    if (!placement.media || placement.media.is_hidden) return null;
    return placement;
  } catch {
    return null;
  }
}

/** Fetch multiple placements at once, keyed by area. */
export async function getPlacements(areas: string[]): Promise<Record<string, ImagePlacement>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("image_placements")
      .select("*, media:media_id(*)")
      .in("area", areas)
      .eq("is_visible", true);
    if (error || !data) return {};
    const out: Record<string, ImagePlacement> = {};
    for (const row of data as unknown as ImagePlacement[]) {
      if (row.media && !row.media.is_hidden) out[row.area] = row;
    }
    return out;
  } catch {
    return {};
  }
}
