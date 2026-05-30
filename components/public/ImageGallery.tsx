"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel } from "./Carousel";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export type GalleryLayout = "grid" | "masonry" | "carousel";

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  layout?: GalleryLayout;
  caption?: string;
}

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

const masonryCols = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
  4: "columns-2 sm:columns-3 lg:columns-4",
};

const carouselBasis = {
  2: "basis-full sm:basis-1/2",
  3: "basis-4/5 sm:basis-1/2 lg:basis-1/3",
  4: "basis-4/5 sm:basis-1/3 lg:basis-1/4",
};

export function ImageGallery({ images, columns = 3, layout = "grid", caption }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const open = (i: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(i);
  };

  const close = useCallback(() => {
    setLightboxIndex(null);
    const opener = previousFocusRef.current;
    requestAnimationFrame(() => opener?.focus());
  }, []);

  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex !== null) requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [lightboxIndex !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  if (!images.length) return null;

  const Thumb = ({ img, i, square }: { img: GalleryImage; i: number; square?: boolean }) => (
    <button
      onClick={() => open(i)}
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group w-full",
        square && "aspect-square"
      )}
      aria-label={`View image: ${img.alt || `Image ${i + 1} of ${images.length}`}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.alt}
        loading="lazy"
        className={cn(
          "object-cover group-hover:scale-105 transition-transform duration-300",
          square ? "w-full h-full" : "w-full h-auto"
        )}
      />
    </button>
  );

  return (
    <>
      <figure>
        {layout === "grid" && (
          <div className={`grid ${gridCols[columns]} gap-3`} role="list">
            {images.map((img, i) => (
              <div key={i} role="listitem">
                <Thumb img={img} i={i} square />
              </div>
            ))}
          </div>
        )}

        {layout === "masonry" && (
          <div className={`${masonryCols[columns]} gap-3`}>
            {images.map((img, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <Thumb img={img} i={i} />
              </div>
            ))}
          </div>
        )}

        {layout === "carousel" && (
          <Carousel
            slideClassName={carouselBasis[columns]}
            slides={images.map((img, i) => (
              <div key={i} className="aspect-[4/3]">
                <Thumb img={img} i={i} square />
              </div>
            ))}
          />
        )}

        {caption && <figcaption className="text-xs text-center text-text-muted mt-3">{caption}</figcaption>}
      </figure>

      {/* Lightbox */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${currentImage.alt || `Image ${lightboxIndex + 1} of ${images.length}`}`}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 45) (dx > 0 ? prev : next)();
            touchStartX.current = null;
          }}
        >
          <div className="absolute inset-0" onClick={close} aria-hidden="true" />

          <button
            ref={closeButtonRef}
            onClick={close}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close image viewer"
          >
            <X size={22} aria-hidden="true" />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
          )}

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3 relative z-10" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentImage.url} alt={currentImage.alt} className="max-w-full max-h-[80vh] object-contain rounded" />
            {currentImage.caption && <p className="text-sm text-white/70 text-center">{currentImage.caption}</p>}
            <p className="text-xs text-white/40" aria-live="polite" aria-atomic="true">
              <span className="sr-only">Image </span>
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
