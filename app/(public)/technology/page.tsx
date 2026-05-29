import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Technology Should Serve People",
  description:
    "Not anti-technology, but deeply interested in it. Healthcare is not fundamentally a technology problem. It's a human problem, and the best tools create more connection, not less.",
  alternates: { canonical: `${BASE}/technology` },
};

export default function TechnologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Technology
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Technology Should Serve People
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            I grew up alongside the internet. I built websites before I became a physician. I helped
            create one of the earliest digital detox movements. I conduct research involving
            telemedicine. I use AI tools regularly.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Narrative */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
          <p className="font-serif text-2xl text-text-base leading-snug">
            In other words, I am not anti-technology. I am deeply interested in technology.
          </p>
          <p>
            I am simply skeptical of technologies that quietly become substitutes for the things they
            were supposed to support.
          </p>
          <p>
            My brother Levi used to talk about reclaiming language from the tech industry. He
            wasn&#8217;t opposed to innovation. He believed powerful tools should be built with
            responsibility and intention.
          </p>
          <p>That idea continues to influence how I think about healthcare.</p>
          <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-4 border-accent pl-5">
            <p>Technology can improve access.</p>
            <p>It can reduce barriers.</p>
            <p>It can connect patients to care that would otherwise be unavailable.</p>
            <p>
              It can save time, reduce friction, and help people receive support when and where they
              need it.
            </p>
          </div>
          <p className="font-serif text-2xl text-text-base leading-snug">
            But healthcare is not fundamentally a technology problem. It is a human problem.
          </p>
          <p>
            The best tools make it easier for clinicians to listen. They make it easier for patients
            to understand. They create more connection, not less.
          </p>
        </div>
      </section>

      {/* Closing question */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
            <p>
              My interest in medicine, telemedicine, digital wellness, and emerging technologies all
              comes back to a simple question:
            </p>
            <p className="font-serif text-2xl text-text-base leading-snug">
              Does this help people live better lives?
            </p>
            <p>
              If the answer is yes, I&#8217;m interested. If it creates more noise than value,
              I&#8217;m not.
            </p>
            <p>
              The future of healthcare will involve technology. I just hope it remains deeply human.
            </p>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="technology" />
    </>
  );
}
