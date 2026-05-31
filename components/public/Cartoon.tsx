import Image from "next/image";
import { cartoons, type CartoonKey } from "@/lib/cartoons";
import { cn } from "@/lib/utils";

interface CartoonProps {
  /** Key from the cartoon registry (lib/cartoons.ts) */
  name: CartoonKey;
  /** Rendered width in px (height derives from intrinsic ratio) */
  width?: number;
  className?: string;
  /** Add a gentle floating bob (decorative use) */
  float?: boolean;
  /** Mark purely decorative — hides from assistive tech and empties alt */
  decorative?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders one of Zev's transparent spot-illustration cartoons. Sizes from the
 * registry's intrinsic ratio so layout never shifts. Decorative by default for
 * accents; pass `decorative={false}` when the cartoon carries meaning.
 */
export function Cartoon({
  name,
  width = 240,
  className,
  float = false,
  decorative = true,
  priority = false,
  sizes,
}: CartoonProps) {
  const meta = cartoons[name];
  const height = Math.round((meta.height / meta.width) * width);

  return (
    <Image
      src={`/cartoons/${meta.file}`}
      alt={decorative ? "" : meta.alt}
      aria-hidden={decorative || undefined}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={cn("select-none pointer-events-none", float && "float-soft", className)}
      draggable={false}
    />
  );
}
