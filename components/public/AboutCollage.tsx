import { PlacedImage } from "@/components/public/PlacedImage";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle, type DoodleName } from "@/components/public/Doodle";
import { ParallaxView } from "@/components/public/ParallaxView";
import type { CartoonKey } from "@/lib/cartoons";
import { TONES, toneBlob, toneBlob2, toneInk, toneStar, pickTone, otherTone, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Layered scrapbook cluster: two overlapping organic blobs (bright, varied
 * colours from the `fun` palette), a tilted polaroid of a real photo (parallax,
 * straightens on hover), a cartoon sticker in front, and hand-drawn doodles.
 * Colours come from an auto-picked `tone` so clusters vary across a page; pass
 * `tone` to force one. `mirror` flips the arrangement so rows alternate sides.
 */
export function AboutCollage({
  photoArea,
  cartoon,
  mirror = false,
  blobVariant = 1,
  doodle = "sparkle",
  tone,
  priority = false,
}: {
  photoArea?: string;
  cartoon: CartoonKey;
  mirror?: boolean;
  blobVariant?: 1 | 2 | 3;
  doodle?: DoodleName;
  /** Force a colour tone; otherwise picked deterministically per cluster. */
  tone?: Tone;
  priority?: boolean;
  /** @deprecated colours now come from `tone`; accepted for back-compat but ignored */
  blobClass?: string;
  /** @deprecated colours now come from `tone`; accepted for back-compat but ignored */
  doodleClass?: string;
}) {
  const t: Tone = tone ?? pickTone(cartoon + (photoArea ?? "") + (mirror ? "m" : ""));
  const t2 = otherTone(t);
  const blobVariant2 = ((blobVariant % 3) + 1) as 1 | 2 | 3;

  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-[4/5]">
      {/* two overlapping organic blobs for colourful depth */}
      <Blob variant={blobVariant} float className={cn("absolute -inset-[10%] h-[120%] w-[120%]", toneBlob[t])} />
      <Blob
        variant={blobVariant2}
        float
        className={cn("absolute h-[72%] w-[72%] blur-[1px]", toneBlob2[t2], mirror ? "-right-[6%] bottom-0" : "-left-[6%] top-0")}
      />

      {/* doodles */}
      <Doodle name={doodle} size={42} float className={cn("absolute -top-3 z-20", toneInk[t], mirror ? "left-4" : "right-4")} />
      <Doodle name="star" size={24} className={cn("absolute bottom-6 z-20", toneStar[t], mirror ? "right-2" : "left-2")} />
      <Doodle name="sparkle" size={16} float className={cn("absolute z-20", toneInk[t2], mirror ? "right-10 top-6" : "left-10 top-6")} />

      {photoArea ? (
        <>
          {/* polaroid of a real photo */}
          <ParallaxView speed={0.05} className={cn("absolute top-0 z-10 w-[64%]", mirror ? "right-1" : "left-1")}>
            <div className={cn("polaroid group transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:!rotate-0", mirror ? "rotate-3" : "-rotate-3")}>
              <span className={cn("tape -top-3 rotate-2", mirror ? "right-6" : "left-6")} aria-hidden="true" />
              <PlacedImage area={photoArea} aspect="1/1" rounded={false} priority={priority} sizes="(min-width:1024px) 20vw, 55vw" />
            </div>
          </ParallaxView>

          {/* cartoon sticker, front layer, faster parallax */}
          <ParallaxView speed={0.13} className={cn("absolute bottom-0 z-20 w-[58%]", mirror ? "left-0" : "right-0")}>
            <Cartoon name={cartoon} width={320} priority={priority} decorative float className="h-auto w-full sticker" />
          </ParallaxView>
        </>
      ) : (
        /* cartoon-only cluster (no photo) — centered, larger */
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Cartoon name={cartoon} width={360} priority={priority} decorative float className="h-auto w-[78%] sticker" />
        </div>
      )}
    </div>
  );
}

// kept for any external imports
export { TONES };
