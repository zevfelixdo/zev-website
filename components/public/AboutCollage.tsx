import { PlacedImage } from "@/components/public/PlacedImage";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle, type DoodleName } from "@/components/public/Doodle";
import { ParallaxView } from "@/components/public/ParallaxView";
import type { CartoonKey } from "@/lib/cartoons";
import { cn } from "@/lib/utils";

/**
 * Layered scrapbook cluster for the About chapters: an organic blob in back, a
 * tilted polaroid of a real photo (parallax, straightens on hover), a cartoon
 * sticker in front (faster parallax), and a couple of hand-drawn doodles.
 * `mirror` flips the arrangement so chapters can alternate sides. Server
 * component, so the async <PlacedImage> resolves normally.
 */
export function AboutCollage({
  photoArea,
  cartoon,
  mirror = false,
  blobClass = "text-primary/10",
  blobVariant = 1,
  doodle = "sparkle",
  doodleClass = "text-accent",
}: {
  photoArea: string;
  cartoon: CartoonKey;
  mirror?: boolean;
  blobClass?: string;
  blobVariant?: 1 | 2 | 3;
  doodle?: DoodleName;
  doodleClass?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-[4/5]">
      {/* organic blob, behind everything */}
      <Blob
        variant={blobVariant}
        float
        className={cn("absolute -inset-[10%] h-[120%] w-[120%]", blobClass)}
      />

      {/* doodles */}
      <Doodle name={doodle} size={40} float className={cn("absolute -top-3 z-20", doodleClass, mirror ? "left-4" : "right-4")} />
      <Doodle name="star" size={22} className={cn("absolute bottom-6 z-20 text-primary/50", mirror ? "right-2" : "left-2")} />

      {/* polaroid of a real photo */}
      <ParallaxView
        speed={0.05}
        className={cn("absolute top-0 z-10 w-[64%]", mirror ? "right-1" : "left-1")}
      >
        <div className={cn("polaroid group transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:!rotate-0", mirror ? "rotate-3" : "-rotate-3")}>
          <span className={cn("tape -top-3 rotate-2", mirror ? "right-6" : "left-6")} aria-hidden="true" />
          <PlacedImage area={photoArea} aspect="1/1" rounded={false} sizes="(min-width:1024px) 20vw, 55vw" />
        </div>
      </ParallaxView>

      {/* cartoon sticker, front layer, faster parallax */}
      <ParallaxView
        speed={0.13}
        className={cn("absolute bottom-0 z-20 w-[58%]", mirror ? "left-0" : "right-0")}
      >
        <Cartoon name={cartoon} width={320} decorative float className="h-auto w-full sticker" />
      </ParallaxView>
    </div>
  );
}
