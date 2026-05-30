import { getPlacements } from "@/lib/placements";
import { ImageGallery, type GalleryLayout } from "@/components/public/ImageGallery";

/**
 * Renders an interactive gallery (grid / masonry / carousel + lightbox) from a
 * set of named placement areas. Renders nothing until at least one is assigned.
 */
export async function PlacedGallery({
  areas,
  layout = "grid",
  columns = 3,
  caption,
}: {
  areas: string[];
  layout?: GalleryLayout;
  columns?: 2 | 3 | 4;
  caption?: string;
}) {
  const map = await getPlacements(areas);
  const images = areas
    .map((a) => map[a])
    .filter((p) => p && p.media)
    .map((p) => ({
      url: p.media!.public_url,
      alt: p.alt_override ?? p.media!.alt_text ?? "",
      caption: p.caption ?? undefined,
    }));

  if (!images.length) return null;
  return <ImageGallery images={images} layout={layout} columns={columns} caption={caption} />;
}
