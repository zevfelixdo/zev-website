"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealHeadingProps {
  /** The heading text. Split into words; each word rides up from a clip mask. */
  text: string;
  className?: string;
  /** "mount" animates immediately (above the fold); "scroll" waits for view. */
  trigger?: "mount" | "scroll";
  /** Per-word stagger in ms */
  stagger?: number;
  /** Initial delay before the first word in ms */
  delay?: number;
}

/**
 * Kinetic headline: each word slides up from behind an overflow mask, staggered.
 * Spaces are rendered between word wrappers so the line still wraps naturally.
 * The whole phrase is exposed to assistive tech via aria-label; the animated
 * word spans are aria-hidden. Reduced-motion users see it resolved instantly.
 */
export function RevealHeading({ text, className, trigger = "scroll", stagger = 48, delay = 0 }: RevealHeadingProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    if (trigger === "mount") {
      // next frame so the initial (hidden) state paints first
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={cn("inline", className)} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="kin-line" aria-hidden="true">
            <span
              className="kin-word"
              style={{ transform: shown ? "translateY(0)" : undefined, transitionDelay: `${delay + i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
