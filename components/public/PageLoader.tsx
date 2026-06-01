import { Cartoon } from "@/components/public/Cartoon";
import { Doodle } from "@/components/public/Doodle";

/**
 * Friendly, on-brand loading state: a bobbing "walking" Zev (on the way!) with
 * a doodle and a quiet label. Used by route loading.tsx files.
 */
export function PageLoader({ label = "One moment" }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
      <div className="relative">
        <Doodle name="loops" size={72} strokeWidth={4} className="absolute -top-9 left-1/2 -translate-x-1/2 text-fun-tangerine/50" />
        <Cartoon name="walking" width={150} float decorative className="w-[130px] h-auto sticker" />
      </div>
      <p className="eyebrow">{label}</p>
    </div>
  );
}
