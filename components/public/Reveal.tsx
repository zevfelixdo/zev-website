"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children?: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Re-hide when scrolled out of view (default: false — reveal once) */
  repeat?: boolean;
  /** How much of the element must be visible before it reveals (0–1) */
  amount?: number;
  /** Base effect class — "reveal" (default) or "rule-draw" */
  variant?: "reveal" | "rule-draw";
}

/**
 * Scroll-reveal wrapper. The child markup carries the `.reveal` class (hidden
 * by default in CSS); this toggles `.is-in` when the element scrolls into view.
 * Reduced-motion users and no-JS users see content immediately (see globals.css
 * + the <noscript> fallback in the root layout). Uses a single IntersectionObserver.
 */
export function Reveal({ children, className, delay = 0, repeat = false, amount = 0.15, variant = "reveal" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          if (!repeat) io.disconnect();
        } else if (repeat) {
          el.classList.remove("is-in");
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [repeat, amount]);

  return (
    <div ref={ref} className={cn(variant, className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
