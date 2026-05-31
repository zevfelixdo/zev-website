import type { ReactNode } from "react";
import { Reveal } from "@/components/public/Reveal";
import { AboutCollage } from "@/components/public/AboutCollage";
import type { CollageSpec } from "@/components/public/PageHero";
import { cn } from "@/lib/utils";

export type { CollageSpec };

/**
 * A chapter row: narrative text beside a layered collage cluster. `mirror`
 * places the collage on the left (text right) on desktop; text always comes
 * first in the DOM so mobile reads text-then-image. Reveals on scroll.
 */
export function CollageRow({
  index,
  eyebrow,
  heading,
  children,
  collage,
  mirror = false,
  tinted = false,
  className,
}: {
  index?: string;
  eyebrow?: string;
  heading?: ReactNode;
  children: ReactNode;
  collage: CollageSpec;
  mirror?: boolean;
  /** Full-bleed surface-alt band */
  tinted?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("section-y overflow-x-clip", tinted && "bg-surface-alt", className)}>
      <div className="container-content grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className={cn(mirror && "lg:order-2")}>
          {index && (
            <Reveal>
              <p className="section-index mb-5">{index}</p>
            </Reveal>
          )}
          {eyebrow && (
            <Reveal>
              <p className="eyebrow mb-4">{eyebrow}</p>
            </Reveal>
          )}
          {heading && (
            <Reveal>
              <h2 className="font-serif text-display-sm text-text-base leading-tight mb-6">{heading}</h2>
            </Reveal>
          )}
          <div className="space-y-5 text-lg text-text-base leading-relaxed">{children}</div>
        </div>
        <Reveal className={cn(mirror && "lg:order-1")}>
          <AboutCollage {...collage} mirror={mirror} />
        </Reveal>
      </div>
    </section>
  );
}
