import { getPlacement } from "@/lib/placements";
import { Parallax } from "@/components/public/Parallax";

/**
 * Renders a parallax banner from a named placement area, so the image stays
 * admin-editable. Renders nothing until assigned.
 */
export async function PlacedParallax({
  area,
  heading,
  subheading,
  height = "md",
}: {
  area: string;
  heading?: string;
  subheading?: string;
  height?: "sm" | "md" | "lg";
}) {
  const p = await getPlacement(area);
  if (!p || !p.media) return null;
  return (
    <Parallax
      src={p.media.public_url}
      alt={p.alt_override ?? p.media.alt_text ?? ""}
      focalY={p.focal_y}
      heading={heading}
      subheading={subheading}
      height={height}
      overlay={Boolean(heading || subheading)}
    />
  );
}
