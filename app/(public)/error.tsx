"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
        Something went wrong
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text-base mb-4">
        This page hit an error
      </h1>
      <p className="text-text-muted max-w-md mb-8 leading-relaxed">
        Sorry about that. You can try refreshing, or go back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button as="link" href="/" variant="outline">
          Go home
        </Button>
      </div>
    </div>
  );
}
