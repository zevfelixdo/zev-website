import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImageFit = "cover" | "contain" | "fill" | "original";

export interface SmartImageProps {
  /** Public image URL. If missing/empty, a clean fallback box renders instead. */
  src?: string | null;
  alt?: string | null;
  /** Focal point as percentages (0-100). Controls object-position for cover/fill. */
  focalX?: number | null;
  focalY?: number | null;
  /** How the image fills its box. */
  fit?: ImageFit;
  /** CSS aspect-ratio for the box, e.g. "16/9", "1/1", "4/5". Ignored for "original". */
  aspect?: string;
  rounded?: boolean;
  priority?: boolean;
  /** Responsive sizes hint for next/image. */
  sizes?: string;
  className?: string;
  caption?: string | null;
  credit?: string | null;
}

/**
 * Responsive, accessible image with focal-point framing and graceful fallback.
 * Use for heroes, feature images, cards, and section images.
 */
export function SmartImage({
  src,
  alt,
  focalX = 50,
  focalY = 50,
  fit = "cover",
  aspect = "16/10",
  rounded = true,
  priority = false,
  sizes = "100vw",
  className,
  caption,
  credit,
}: SmartImageProps) {
  // Graceful fallback: a calm placeholder box, never a broken image.
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn("w-full bg-surface-alt", rounded && "rounded-lg", className)}
        style={{ aspectRatio: aspect }}
      />
    );
  }

  const objectFit = fit === "original" ? "contain" : fit;
  const fx = Math.min(100, Math.max(0, focalX ?? 50));
  const fy = Math.min(100, Math.max(0, focalY ?? 50));

  const frame = (
    <div
      className={cn("relative w-full overflow-hidden bg-surface-alt", rounded && "rounded-lg", className)}
      style={{ aspectRatio: fit === "original" ? undefined : aspect }}
    >
      <Image
        src={src}
        alt={alt ?? ""}
        fill={fit !== "original"}
        width={fit === "original" ? 1600 : undefined}
        height={fit === "original" ? 1067 : undefined}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={fit === "original" ? "w-full h-auto" : undefined}
        style={{ objectFit, objectPosition: `${fx}% ${fy}%` }}
      />
    </div>
  );

  if (caption || credit) {
    return (
      <figure className="space-y-2">
        {frame}
        <figcaption className="text-xs text-text-muted leading-relaxed">
          {caption}
          {credit && (
            <span className="opacity-70">
              {caption ? " · " : ""}
              {credit}
            </span>
          )}
        </figcaption>
      </figure>
    );
  }

  return frame;
}
