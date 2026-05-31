"use client";

import { useState } from "react";
import Link from "next/link";

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
 * single preview image that cross-fades to whichever row is hovered/focused
 * (keyboard-accessible — focus updates the image too). On mobile it falls back
 * to clean stacked image cards. Images are decorative (alt=""); the link text
 * carries the meaning.
 */
export function ExploreIndex({ items }: { items: ExploreItem[] }) {
  const [active, setActive] = useState(0);
  const withImg = items.filter((i) => i.imageUrl);

  return (
    <>
      {/* Desktop: list + sticky cross-fading preview */}
      <div className="hidden lg:grid grid-cols-[1fr_minmax(0,400px)] gap-14 items-start">
        <ul className="border-t border-border">
          {items.map((it, i) => (
            <li key={it.href} className="border-b border-border">
              <Link
                href={it.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-5 py-6"
              >
                <span className="section-index pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-3xl xl:text-[2.5rem] leading-tight text-text-base transition-colors group-hover:text-primary">
                  {it.label}
                </span>
                <span className="max-w-[16rem] text-sm text-text-muted text-right opacity-60 transition-opacity group-hover:opacity-100">
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
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-smooth"
                style={{ objectPosition: `${it.focalX ?? 50}% ${it.focalY ?? 50}%`, opacity: active === i ? 1 : 0 }}
              />
            ) : null
          )}
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
              <div className="flex items-baseline gap-3">
                <span className="section-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-xl text-text-base transition-colors group-hover:text-primary">{it.label}</span>
              </div>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{it.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {withImg.length === 0 && null}
    </>
  );
}
