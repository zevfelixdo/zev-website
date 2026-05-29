"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialQuery?: string;
  variant?: "hero" | "compact";
  className?: string;
}

export function SearchBar({ initialQuery = "", variant = "compact", className }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (variant === "hero") {
      inputRef.current?.focus();
    }
  }, [variant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <div className="relative flex items-center">
        <Search
          size={variant === "hero" ? 20 : 16}
          className="absolute left-3.5 text-text-muted pointer-events-none"
        />
        <input
          id="site-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          autoComplete="off"
          className={cn(
            "w-full border border-border bg-surface text-text-base placeholder:text-text-muted rounded",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            variant === "hero"
              ? "pl-12 pr-4 py-4 text-lg"
              : "pl-9 pr-8 py-2.5 text-sm min-h-[44px]"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 p-1 text-text-muted hover:text-text-base transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
