"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "zev-color-scheme";

// Set both data-theme attribute (for CSS custom property overrides) and the
// "dark" class (for Tailwind dark: utilities) so both systems work in sync.
function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  root.classList.toggle("dark", isDark);
}

// Dark mode overrides injected as a <style> block.
// These replace the warm-earth light palette with a rich dark one while
// keeping all the CSS custom property names the same so every component
// just works automatically.
const DARK_CSS = `
  :root[data-theme="dark"] {
    --color-surface:     20 18 15;
    --color-surface-alt: 28 25 20;
    --color-text-base:   235 228 218;
    --color-text-muted:  155 145 130;
    --color-border:      55 50 42;
    --color-muted:       90 82 70;
    --color-primary:     120 180 140;
    --color-secondary:   150 130 100;
    --color-accent:      200 140 70;
  }
`;

export function DarkModeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    applyTheme(isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  if (!mounted) {
    return <div className={cn("w-9 h-9", className)} aria-hidden />;
  }

  return (
    <>
      {/* Inject dark CSS vars globally once */}
      <style>{DARK_CSS}</style>
      <button
        onClick={toggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors",
          className
        )}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </>
  );
}
