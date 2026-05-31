"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop — lower is faster */
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  /** Character/glyph rendered between items */
  separator?: string;
}

/**
 * Seamless scrolling marquee. The track holds two identical copies of the
 * content and slides exactly one copy-width, so the loop is gapless. Pauses on
 * hover; freezes entirely under prefers-reduced-motion (see globals.css).
 * Decorative — hidden from assistive tech.
 */
export function Marquee({
  items,
  duration = 42,
  reverse = false,
  className,
  itemClassName,
  separator = "✳",
}: MarqueeProps) {
  const Copy = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className={cn("whitespace-nowrap", itemClassName)}>{it}</span>
          <span className="mx-6 text-accent/70 sm:mx-9" aria-hidden="true">
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn("marquee", className)}
      data-reverse={reverse ? "true" : undefined}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {Copy}
        {Copy}
      </div>
    </div>
  );
}
