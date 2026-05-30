import type { ReactNode } from "react";
import { getPlacement } from "@/lib/placements";
import { SmartImage } from "@/components/public/SmartImage";

/**
 * Wraps hero text. If an image is assigned to `area`, renders a two-column
 * hero (text + portrait) on desktop, stacked on mobile. If nothing is
 * assigned, renders the text exactly as before (full width) — fully graceful.
 */
export async function HeroWithPortrait({
  area,
  children,
}: {
  area: string;
  children: ReactNode;
}) {
  const p = await getPlacement(area);

  if (!p || !p.media) {
    return <div className="max-w-3xl">{children}</div>;
  }

  const m = p.media;
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-12 lg:items-center">
      <div className="max-w-3xl">{children}</div>
      <div className="max-w-[280px] mx-auto w-full lg:max-w-none">
        <SmartImage
          src={m.public_url}
          alt={p.alt_override ?? m.alt_text}
          focalX={p.focal_x}
          focalY={p.focal_y}
          fit={p.fit}
          aspect={p.aspect ?? "4/5"}
          priority
          sizes="(min-width:1024px) 320px, 280px"
          className="border border-border shadow-card"
          caption={p.caption}
          credit={p.credit ?? m.credit}
        />
      </div>
    </div>
  );
}
