"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-base border border-border rounded px-4 py-2 hover:bg-surface-alt transition-colors print:hidden"
      aria-label="Print CV"
    >
      <Printer size={15} />
      Print / Save as PDF
    </button>
  );
}
