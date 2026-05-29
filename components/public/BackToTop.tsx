"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollUp}
      aria-label="Back to top"
      data-noprint
      className={cn(
        "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface border border-border shadow-dropdown text-text-muted hover:text-primary hover:border-primary/30 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
