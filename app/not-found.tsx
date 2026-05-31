import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Playful collage cluster */}
      <div className="relative mb-8 h-56 w-56">
        <Blob variant={2} float className="absolute -inset-[14%] h-[128%] w-[128%] text-fun-leaf/30" />
        <Blob variant={1} float className="absolute -right-[6%] bottom-0 h-[55%] w-[55%] text-fun-sky/25 blur-[1px]" />
        <Doodle name="sparkle" size={34} float className="absolute right-2 top-0 z-20 text-fun-coral" />
        <Doodle name="star" size={20} className="absolute bottom-6 left-0 z-20 text-fun-tangerine" />
        <div className="absolute inset-0 z-10 flex items-end justify-center">
          <Cartoon name="hiking-standing" width={170} decorative float className="h-auto w-[150px] sticker" />
        </div>
      </div>

      <p className="eyebrow mb-4">404</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base mb-4">
        Looks like you wandered off the trail
      </h1>
      <p className="text-text-muted max-w-md mb-8 leading-relaxed">
        We could not find what you were looking for. Try searching, or head back home.
      </p>
      <div className="w-full max-w-sm mb-8">
        <SearchBar variant="compact" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button as="link" href="/" variant="primary">
          Go home
        </Button>
        <Button as="link" href="/contact" variant="outline">
          Contact me
        </Button>
      </div>
    </div>
  );
}
