"use client";

import { useRef, useState } from "react";
import { Cartoon } from "@/components/public/Cartoon";
import { Doodle } from "@/components/public/Doodle";
import { cn } from "@/lib/utils";

/**
 * The hero bike-with-Maisy cartoon, but clickable: tap it and Zev pops a little
 * wheelie and rides. A quiet easter egg — discoverable because the bike is the
 * most clickable-looking thing on the page. No-op under reduced motion.
 */
export function BikeEasterEgg() {
  const [riding, setRiding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = () => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (riding) return;
    setRiding(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRiding(false), 1300);
  };

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Take Maisy for a spin"
      className="relative block cursor-pointer border-0 bg-transparent p-0"
    >
      <Cartoon
        name="bike-w-maisy"
        width={380}
        priority
        decorative
        float={!riding}
        className={cn("relative w-[270px] sm:w-[330px] lg:w-[380px] h-auto", riding && "bike-ride")}
      />
      {riding && (
        <>
          <Doodle name="sparkle" size={30} className="pointer-events-none absolute -top-1 right-4 text-fun-coral" />
          <Doodle name="star" size={20} className="pointer-events-none absolute top-6 -right-1 text-fun-sun" />
        </>
      )}
    </button>
  );
}
