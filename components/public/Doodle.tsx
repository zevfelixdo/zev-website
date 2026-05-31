import { cn } from "@/lib/utils";

export type DoodleName =
  | "sparkle"
  | "star"
  | "squiggle"
  | "arrow"
  | "circle"
  | "underline"
  | "loops"
  | "path"
  | "sun"
  | "heart";

/**
 * Hand-drawn SVG accents in currentColor. Decorative only (aria-hidden).
 * Set the colour with a text-* class and size with `size` (px). Stroke doodles
 * scale their stroke with the box; `sparkle`/`star`/`heart`/`sun` are filled.
 */
export function Doodle({
  name,
  size = 40,
  className,
  strokeWidth = 6,
  float = false,
  stretch = false,
}: {
  name: DoodleName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  float?: boolean;
  /** Fill the parent box (width/height from className) instead of a fixed square — for circling/underlining text */
  stretch?: boolean;
}) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={stretch ? undefined : size}
      height={stretch ? undefined : size}
      preserveAspectRatio={stretch ? "none" : undefined}
      aria-hidden="true"
      className={cn("pointer-events-none select-none overflow-visible", float && "float-soft", className)}
    >
      {name === "sparkle" && (
        <path d="M50 6 C55 36 64 45 94 50 C64 55 55 64 50 94 C45 64 36 55 6 50 C36 45 45 36 50 6 Z" fill="currentColor" />
      )}
      {name === "star" && (
        <path d="M50 8 L60 38 L92 40 L66 60 L75 92 L50 72 L25 92 L34 60 L8 40 L40 38 Z" fill="currentColor" />
      )}
      {name === "heart" && (
        <path d="M50 84 C18 60 10 40 22 26 C32 14 46 18 50 32 C54 18 68 14 78 26 C90 40 82 60 50 84 Z" fill="currentColor" />
      )}
      {name === "sun" && (
        <g {...stroke}>
          <circle cx="50" cy="50" r="20" />
          <path d="M50 6 V18 M50 82 V94 M6 50 H18 M82 50 H94 M19 19 L27 27 M73 73 L81 81 M81 19 L73 27 M27 73 L19 81" />
        </g>
      )}
      {name === "squiggle" && <path d="M5 55 Q18 30 32 52 T60 52 T88 50" {...stroke} />}
      {name === "underline" && <path d="M6 60 C28 78 72 78 95 55" {...stroke} />}
      {name === "loops" && (
        <path d="M5 62 C16 30 28 30 38 60 C48 90 58 90 68 60 C78 30 88 38 95 56" {...stroke} />
      )}
      {name === "circle" && (
        <path d="M74 24 C95 36 90 72 58 81 C24 90 8 62 21 36 C31 17 60 12 80 28" {...stroke} />
      )}
      {name === "arrow" && (
        <g {...stroke}>
          <path d="M8 24 C40 12 72 30 86 68" />
          <path d="M86 68 L66 62 M86 68 L78 48" />
        </g>
      )}
      {name === "path" && (
        <path d="M6 84 C30 24 70 24 94 84" {...stroke} strokeDasharray="0.1 14" />
      )}
    </svg>
  );
}
