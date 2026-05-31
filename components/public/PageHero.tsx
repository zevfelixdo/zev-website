import type { ReactNode } from "react";
import { RevealHeading } from "@/components/public/RevealHeading";
import { Reveal } from "@/components/public/Reveal";
import { Doodle, type DoodleName } from "@/components/public/Doodle";
import { AboutCollage } from "@/components/public/AboutCollage";
import type { CartoonKey } from "@/lib/cartoons";
import type { Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export interface CollageSpec {
  photoArea?: string;
  cartoon: CartoonKey;
  mirror?: boolean;
  blobVariant?: 1 | 2 | 3;
  doodle?: DoodleName;
  /** Force a colour tone; otherwise auto-picked per cluster. */
  tone?: Tone;
  /** @deprecated ignored — colours come from `tone` now */
  blobClass?: string;
  /** @deprecated ignored — colours come from `tone` now */
  doodleClass?: string;
}

/**
 * Standard editorial hero across pages: eyebrow + kinetic headline + lead, with
 * an optional layered collage cluster (photo polaroid + cartoon + blob + doodles)
 * on the right. Keeps the same on-load motion as the homepage/About heroes.
 */
export function PageHero({
  eyebrow,
  heading,
  children,
  collage,
  underDoodle = "loops",
  minH = "min-h-[62vh]",
}: {
  eyebrow: string;
  heading: string;
  children: ReactNode;
  collage?: CollageSpec;
  underDoodle?: DoodleName | null;
  minH?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className={cn("container-content grid gap-12 lg:gap-16 items-center py-16 lg:py-20", minH, collage && "lg:grid-cols-[1.05fr_0.95fr]")}>
        <div>
          <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>{eyebrow}</p>
          <h1 className="font-serif text-display text-text-base mt-6 mb-7">
            <RevealHeading text={heading} trigger="mount" stagger={55} delay={120} />
          </h1>
          <div className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl rise space-y-4" style={{ animationDelay: "520ms" }}>
            {children}
          </div>
          {underDoodle && (
            <Doodle name={underDoodle} size={120} strokeWidth={4} className="hidden sm:block text-accent/60 mt-8 rise" />
          )}
        </div>
        {collage && (
          <Reveal>
            <AboutCollage priority {...collage} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
