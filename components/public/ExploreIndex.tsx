"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ExploreItem {
  label: string;
  href: string;
  description: string;
  imageUrl?: string | null;
  focalX?: number;
  focalY?: number;
}

/**
 * Editorial index of site sections. On desktop it's a typographic list with a
 * single preview image that cross-fades (with a gentle zoom-settle) to whichever
 * row is hovered/focused — keyboard-accessible, focus drives the image too. An
 * arrow slides in and the title shifts on hover. On mobile it falls back to clean
 * stacked image cards. Images are decorative (alt=""); the link text carries meaning.
 */
export function ExploreIndex({ items }: { items: ExploreItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <>
      {/* Desktop: list + sticky cross-fading preview */}
      <div className="hidden lg:grid grid-cols-[1fr_minmax(0,420px)] gap-14 items-start">
        <ul className="border-t border-border">
          {items.map((it, i) => (
            <li key={it.href} className="border-b border-border">
              <Link
                href={it.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-5 py-6"
              >
                <span className="section-index pt-1 self-start transition-colors group-hover:text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-serif text-3xl xl:text-[2.6rem] leading-tight text-text-base transition-all duration-300 group-hover:text-primary group-hover:translate-x-2">
                    {it.label}
                  </span>
                  <ArrowUpRight
                    className="text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    size={26}
                    aria-hidden="true"
                  />
                </span>
                <span className="max-w-[15rem] text-sm text-text-muted text-right opacity-50 transition-opacity duration-300 group-hover:opacity-100">
                  {it.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="sticky top-28 aspect-[4/5] rounded-lg overflow-hidden bg-surface-alt shadow-card">
          {items.map((it, i) =>
            it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={it.href}
                src={it.imageUrl}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  objectPosition: `${it.focalX ?? 50}% ${it.focalY ?? 50}%`,
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "scale(1)" : "scale(1.06)",
                }}
              />
            ) : null
          )}

          {/* Caption overlay reflecting the active row */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/55 via-black/15 to-transparent">
            <div className="flex items-end justify-between gap-3">
              <span className="font-serif text-2xl text-white leading-none">{current?.label}</span>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked image cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {items.map((it, i) => (
          <Link
            key={it.href}
            href={it.href}
            className="group block overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-dropdown"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-alt">
              {it.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ objectPosition: `${it.focalX ?? 50}% ${it.focalY ?? 50}%` }}
                />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-baseline gap-3">
                  <span className="section-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-xl text-text-base transition-colors group-hover:text-primary">{it.label}</span>
                </span>
                <ArrowUpRight className="text-primary opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={20} aria-hidden="true" />
              </div>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{it.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
