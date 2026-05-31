"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxViewProps {
  children: ReactNode;
  /** Positive = drifts up as you scroll past. Keep small (0.04–0.12). */
  speed?: number;
  className?: string;
}

/**
 * Gentle foreground parallax. Translates the element vertically in proportion
 * to its distance from the viewport center, throttled with rAF. No-op under
 * prefers-reduced-motion. Keep `speed` small so the element never reveals gaps.
 */
export function ParallaxView({ children, speed = 0.08, className }: ParallaxViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
