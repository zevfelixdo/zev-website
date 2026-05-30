import { getPlacement } from "@/lib/placements";
import { SmartImage } from "@/components/public/SmartImage";

interface PlacedImageProps {
  /** Named area, e.g. "home.hero", "unplugged.gallery". Admin assigns media to it. */
  area: string;
  /** Default aspect ratio if the placement does not specify one. */
  aspect?: string;
  rounded?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Renders the admin-assigned image for a named area, with focal point, fit,
 * caption/credit, and optional mobile-specific framing. Renders nothing when
 * no visible image is assigned, so pages stay clean until an admin fills it.
 */
export async function PlacedImage({
  area,
  aspect = "16/9",
  rounded = true,
  priority = false,
  sizes = "100vw",
  className,
}: PlacedImageProps) {
  const placement = await getPlacement(area);
  if (!placement || !placement.media) return null;

  const m = placement.media;
  const fx = placement.focal_x;
  const fy = placement.focal_y;
  const mx = placement.focal_x_mobile;
  const my = placement.focal_y_mobile;
  const hasMobileFocal = mx !== null && my !== null && (mx !== fx || my !== fy);
  const cls = `placed-${area.replace(/[^a-z0-9]+/gi, "-")}`;

  return (
    <>
      {hasMobileFocal && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@media (max-width:640px){.${cls} img{object-position:${mx}% ${my}% !important}}`,
          }}
        />
      )}
      <SmartImage
        src={m.public_url}
        alt={placement.alt_override ?? m.alt_text}
        focalX={fx}
        focalY={fy}
        fit={placement.fit}
        aspect={placement.aspect ?? aspect}
        rounded={rounded}
        priority={priority}
        sizes={sizes}
        className={[cls, className].filter(Boolean).join(" ")}
        caption={placement.caption}
        credit={placement.credit ?? m.credit}
      />
    </>
  );
}
