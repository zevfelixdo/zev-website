"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  caption?: string;
}

const colClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export function ImageGallery({ images, columns = 3, caption }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const open = (i: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(i);
  };

  const close = useCallback(() => {
    setLightboxIndex(null);
    // Restore focus to the thumbnail that opened the lightbox
    const opener = previousFocusRef.current;
    requestAnimationFrame(() => opener?.focus());
  }, []);

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  const next = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  // Focus close button when lightbox opens
  useEffect(() => {
    if (lightboxIndex !== null) {
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
  }, [lightboxIndex !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard handler for lightbox
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

  return (
    <>
      <figure>
        <div className={`grid ${colClasses[columns]} gap-3`} role="list">
          {images.map((img, i) => (
            <button
              key={i}
              ref={(el) => { triggerRefs.current[i] = el; }}
              onClick={() => open(i)}
              className="relative overflow-hidden rounded-lg aspect-square bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
              aria-label={`View image: ${img.alt || `Image ${i + 1} of ${images.length}`}`}
              role="listitem"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
        {caption && (
          <figcaption className="text-xs text-center text-text-muted mt-2">{caption}</figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${currentImage.alt || `Image ${lightboxIndex + 1} of ${images.length}`}`}
        >
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={close}
            aria-hidden="true"
          />

          {/* Close */}
          <button
            ref={closeButtonRef}
            onClick={close}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close image viewer"
          >
            <X size={22} aria-hidden="true" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
          )}

          {/* Image + caption */}
          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
            {currentImage.caption && (
              <p className="text-sm text-white/70 text-center">{currentImage.caption}</p>
            )}
            {/* Counter announced to screen readers when image changes */}
            <p
              className="text-xs text-white/40"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sr-only">Image </span>
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
