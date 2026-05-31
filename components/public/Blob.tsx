import { cn } from "@/lib/utils";

/**
 * Soft organic background shape. Decorative only — place it absolutely behind
 * content (e.g. behind a photo or cartoon) to add depth and warmth. Colour comes
 * from a text-* class (fills with currentColor); opacity/blur via className.
 */
export function Blob({
  variant = 1,
  className,
  float = false,
}: {
  variant?: 1 | 2 | 3;
  className?: string;
  float?: boolean;
}) {
  const paths = {
    1: "M53.2,-62.4C66.6,-52.4,73.9,-34.2,75.8,-16.3C77.7,1.6,74.2,19.2,65.3,33.6C56.4,48,42.1,59.2,26,65.9C9.9,72.6,-8,74.8,-24.7,70.3C-41.4,65.8,-56.9,54.6,-65.9,39.7C-74.9,24.8,-77.4,6.2,-73.6,-10.6C-69.8,-27.4,-59.7,-42.4,-46.4,-52.6C-33.1,-62.8,-16.5,-68.2,1.7,-70.3C19.9,-72.4,39.8,-72.3,53.2,-62.4Z",
    2: "M44.8,-58.3C57.4,-49.1,66.2,-34.6,69.6,-18.9C73,-3.2,71,13.7,63.3,27.7C55.6,41.7,42.2,52.8,27.2,60.1C12.2,67.4,-4.4,70.9,-20.6,67.3C-36.8,63.7,-52.6,53,-61.8,38.5C-71,24,-73.6,5.7,-70.1,-11.1C-66.6,-27.9,-57,-43.2,-44,-52.6C-31,-62,-15.5,-65.5,0.8,-66.6C17.1,-67.7,34.2,-67.4,44.8,-58.3Z",
    3: "M39.6,-51.5C53.4,-44.6,68.1,-35.4,72.6,-22.6C77.1,-9.8,71.4,6.6,63.4,21.1C55.4,35.6,45.1,48.2,31.9,57.1C18.7,66,2.6,71.2,-13.9,69.9C-30.4,68.6,-47.3,60.8,-57.8,47.8C-68.3,34.8,-72.4,16.7,-71.3,-1C-70.2,-18.7,-63.9,-36,-52,-43.9C-40.1,-51.8,-22.6,-50.3,-7.4,-49.3C7.8,-48.3,25.8,-58.4,39.6,-51.5Z",
  };
  return (
    <svg
      viewBox="-90 -90 180 180"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", float && "float-soft", className)}
    >
      <path d={paths[variant]} fill="currentColor" />
    </svg>
  );
}
