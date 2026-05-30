import type { ReactNode } from "react";
import { getPlacement } from "@/lib/placements";
import { SmartImage } from "@/components/public/SmartImage";

/**
 * Body section: text beside an image. If no image is assigned to `area`, the
 * text renders full-width (max-w-2xl) exactly as before — fully graceful.
 */
export async function TextImageRow({
  area,
  imageSide = "right",
  aspect = "4/5",
  children,
}: {
  area: string;
  imageSide?: "left" | "right";
  aspect?: string;
  children: ReactNode;
}) {
  const p = await getPlacement(area);

  if (!p || !p.media) {
    return <div className="max-w-2xl">{children}</div>;
  }

  const m = p.media;
  const image = (
    <div className="max-w-[320px] mx-auto w-full lg:max-w-none">
      <SmartImage
        src={m.public_url}
        alt={p.alt_override ?? m.alt_text}
        focalX={p.focal_x}
        focalY={p.focal_y}
        fit={p.fit}
        aspect={p.aspect ?? aspect}
        sizes="(min-width:1024px) 360px, 320px"
        className="border border-border shadow-card"
        caption={p.caption}
        credit={p.credit ?? m.credit}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-8 lg:gap-12 items-center">
      {imageSide === "left" ? (
        <>
          <div className="lg:order-2">{children}</div>
          <div className="lg:order-1">{image}</div>
        </>
      ) : (
        <>
          <div>{children}</div>
          {image}
        </>
      )}
    </div>
  );
}
