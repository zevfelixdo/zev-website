import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">404</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base mb-4">
        Page not found
      </h1>
      <p className="text-text-muted max-w-md mb-8 leading-relaxed">
        We could not find what you were looking for. Try searching, or go back home.
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
