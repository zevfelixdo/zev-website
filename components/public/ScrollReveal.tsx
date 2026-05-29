"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Animation variant */
  variant?: "fade" | "slide-up" | "slide-right" | "scale";
  /** Delay in ms */
  delay?: number;
  /** Root margin — how far before the element enters the viewport to trigger */
  rootMargin?: string;
  /** Whether to animate only once (default: true) */
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  variant = "slide-up",
  delay = 0,
  rootMargin = "-60px 0px",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Set initial hidden state
    el.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;
    el.style.opacity = "0";
    el.style.willChange = "opacity, transform";

    switch (variant) {
      case "slide-up":
        el.style.transform = "translateY(24px)";
        break;
      case "slide-right":
        el.style.transform = "translateX(-24px)";
        break;
      case "scale":
        el.style.transform = "scale(0.95)";
        break;
      case "fade":
      default:
        el.style.transform = "none";
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) translateX(0) scale(1)";
          el.style.willChange = "auto";
          if (once) observer.disconnect();
        } else if (!once) {
          el.style.opacity = "0";
          switch (variant) {
            case "slide-up":    el.style.transform = "translateY(24px)"; break;
            case "slide-right": el.style.transform = "translateX(-24px)"; break;
            case "scale":       el.style.transform = "scale(0.95)"; break;
            default:            el.style.transform = "none";
          }
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once, rootMargin, variant]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

/** Convenience: stagger a list of children with incrementing delays */
export function ScrollRevealList({
  children,
  stagger = 80,
  className,
  itemClassName,
  variant = "slide-up",
}: {
  children: ReactNode[];
  stagger?: number;
  className?: string;
  itemClassName?: string;
  variant?: ScrollRevealProps["variant"];
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal key={i} delay={i * stagger} variant={variant} className={itemClassName}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
