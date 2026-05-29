import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Unplugged",
  description: "Digital Detox and Camp Grounded.",
  alternates: { canonical: `${BASE}/unplugged` },
};

export default function UnpluggedPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Unplugged
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Unplugged
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">More on this soon.</p>
        </div>
      </section>
      <DynamicSections pageSlug="unplugged" />
    </>
  );
}
