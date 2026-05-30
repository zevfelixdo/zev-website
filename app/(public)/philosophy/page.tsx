import { DynamicSections } from "@/components/public/DynamicSections";
import { HeroWithPortrait } from "@/components/public/HeroWithPortrait";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "What Matters To You?",
  description:
    "One of the most important questions in medicine is also one of the simplest. Not what's the matter with you. What matters to you. The answer changes everything.",
  alternates: { canonical: `${BASE}/philosophy` },
};

export default function PhilosophyPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <HeroWithPortrait area="philosophy.portrait">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Philosophy of Care
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            What Matters To You?
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            One of the most important questions in medicine is also one of the simplest.
          </p>
        </HeroWithPortrait>
      </section>

      <div className="border-t border-border" />

      {/* Opening */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-4 font-serif text-2xl text-text-base leading-snug">
          <p>What matters to you?</p>
          <p className="text-text-muted">Not what&#8217;s the matter with you.</p>
          <p>What matters to you.</p>
        </div>
      </section>

      {/* Narrative */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
            <p className="font-serif text-xl text-text-base">The answer changes everything.</p>
            <p>
              A treatment plan that works on paper but doesn&#8217;t fit someone&#8217;s life is
              rarely a good plan. A recommendation that ignores family responsibilities, finances,
              culture, values, or personal goals often fails before it starts.
            </p>
            <p className="font-serif text-xl text-text-base">
              Health doesn&#8217;t happen in isolation. It happens within the context of a life.
            </p>
          </div>
        </div>
      </section>

      {/* Goal */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
          <p>
            My goal as a physician is not to create perfect patients. It&#8217;s to help people make
            meaningful progress.
          </p>
          <div className="space-y-1 text-lg text-text-base">
            <p>Sometimes that means medication.</p>
            <p>Sometimes it means a procedure.</p>
            <p>
              Sometimes it means sleep, movement, connection, therapy, nutrition, boundaries,
              community, or a difficult conversation.
            </p>
            <p>Usually it&#8217;s some combination of all of them.</p>
          </div>
          <p>
            The most effective healthcare I&#8217;ve seen is rarely the most complicated. It&#8217;s
            the care that meets people where they are and helps them move forward from there.
          </p>
        </div>
      </section>
      <DynamicSections pageSlug="philosophy" />
    </>
  );
}
