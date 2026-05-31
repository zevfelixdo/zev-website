/**
 * Bright, playful colour "tones" for decorative shapes + doodles. Each tone
 * maps to a primary blob colour, a complementary second blob, a doodle "ink"
 * colour, and a contrasting star colour — all from the `fun` palette in
 * tailwind.config.ts. Tones are picked deterministically from a seed string so
 * collages vary across the page without any randomness (SSR-safe).
 *
 * NOTE: the class strings are spelled out literally here so Tailwind's JIT
 * generates them (lib/ is included in tailwind content).
 */
export const TONES = ["sky", "leaf", "sun", "tangerine", "coral"] as const;
export type Tone = (typeof TONES)[number];

export const toneBlob: Record<Tone, string> = {
  sky: "text-fun-sky/25",
  leaf: "text-fun-leaf/25",
  sun: "text-fun-sun/40",
  tangerine: "text-fun-tangerine/25",
  coral: "text-fun-coral/25",
};

export const toneBlob2: Record<Tone, string> = {
  sky: "text-fun-leaf/20",
  leaf: "text-fun-sky/20",
  sun: "text-fun-tangerine/25",
  tangerine: "text-fun-sun/30",
  coral: "text-fun-sky/20",
};

export const toneInk: Record<Tone, string> = {
  sky: "text-fun-sky",
  leaf: "text-fun-leaf",
  sun: "text-fun-tangerine",
  tangerine: "text-fun-tangerine",
  coral: "text-fun-coral",
};

export const toneStar: Record<Tone, string> = {
  sky: "text-fun-tangerine",
  leaf: "text-fun-sun",
  sun: "text-fun-leaf",
  tangerine: "text-fun-sky",
  coral: "text-fun-sun",
};

/** Deterministic tone from a seed string. */
export function pickTone(seed: string): Tone {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

/** A different, complementary tone (two steps around the wheel). */
export function otherTone(t: Tone): Tone {
  return TONES[(TONES.indexOf(t) + 2) % TONES.length];
}
