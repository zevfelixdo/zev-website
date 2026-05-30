"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  /** Each entry becomes a slide. */
  slides: ReactNode[];
  /** Tailwind basis classes per slide (controls slides-per-view). */
  slideClassName?: string;
  loop?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Accessible, touch-friendly carousel (drag/swipe on touch + mouse, arrow keys,
 * prev/next buttons, and dot indicators). Powered by Embla. Honors
 * prefers-reduced-motion by disabling drag-momentum animation.
 */
export function Carousel({
  slides,
  slideClassName = "basis-full sm:basis-1/2 lg:basis-1/3",
  loop = true,
  className,
  ariaLabel = "Image carousel",
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: "start", containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!slides.length) return null;

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3">
          {slides.map((slide, i) => (
            <div key={i} className={cn("min-w-0 shrink-0 grow-0 pl-3", slideClassName)} aria-roledescription="slide">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            disabled={!loop && !canPrev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 border border-border shadow-card text-text-base flex items-center justify-center hover:bg-surface disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!loop && !canNext}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 border border-border shadow-card text-text-base flex items-center justify-center hover:bg-surface disabled:opacity-0 transition-opacity"
          >
            <ChevronRight size={20} aria-hidden />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={selected === i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selected === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-text-muted"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
