"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxProps {
  src: string;
  alt?: string;
  /** Section height. */
  height?: "sm" | "md" | "lg";
  heading?: string;
  subheading?: string;
  /** 0–100 vertical focal point. */
  focalY?: number;
  /** Parallax strength (0 = none, ~0.3 = subtle). */
  speed?: number;
  /** Dark scrim for text legibility. */
  overlay?: boolean;
}

const heightClass = { sm: "h-[40vh] min-h-[280px]", md: "h-[60vh] min-h-[360px]", lg: "h-[80vh] min-h-[440px]" };

/**
 * Full-bleed parallax band: the background image drifts slower than the page as
 * you scroll. Disabled (static) under prefers-reduced-motion. Optional centered
 * heading sits over a dark scrim so text stays legible.
 */
export function Parallax({
  src,
  alt = "",
  height = "md",
  heading,
  subheading,
  focalY = 50,
  speed = 0.25,
  overlay = true,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const fromCenter = r.top + r.height / 2 - window.innerHeight / 2;
      setOffset(-fromCenter * speed);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <section ref={ref} className={`relative w-full overflow-hidden bg-surface-alt ${heightClass[height]}`}>
      {/* Overscan so the drifting image never reveals an edge */}
      <div className="absolute inset-x-0 -top-[25%] -bottom-[25%] will-change-transform" style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: `50% ${focalY}%` }} loading="lazy" />
      </div>

      {overlay && (heading || subheading) && <div className="absolute inset-0 bg-black/40" aria-hidden />}

      {(heading || subheading) && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {heading && <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white drop-shadow mb-3 max-w-3xl">{heading}</h2>}
          {subheading && <p className="text-white/90 text-lg max-w-xl drop-shadow">{subheading}</p>}
        </div>
      )}
    </section>
  );
}
