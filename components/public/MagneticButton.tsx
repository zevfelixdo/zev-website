"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1) */
  strength?: number;
}

/**
 * Wraps an interactive element so it drifts toward the cursor while hovered,
 * then springs back on leave. Fine-pointer only — on touch/coarse pointers it
 * stays put and the wrapped element behaves normally.
 */
export function MagneticButton({ children, className, strength = 0.4 }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn("inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform", className)}
    >
      {children}
    </span>
  );
}
