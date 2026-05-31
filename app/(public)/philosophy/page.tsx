import { DynamicSections } from "@/components/public/DynamicSections";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
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
      <PageHero
        eyebrow="Philosophy of Care"
        heading="What Matters To You?"
        collage={{ photoArea: "philosophy.portrait", cartoon: "talking-to-nurse", blobVariant: 2, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>One of the most important questions in medicine is also one of the simplest.</p>
      </PageHero>

      {/* Opening */}
      <CollageRow
        mirror
        collage={{ photoArea: "philosophy.opening", cartoon: "older-gentleman", blobVariant: 1, blobClass: "text-accent/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <div className="space-y-4 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          <p>
            <span className="relative inline-block">
              What matters to you?
              <Doodle name="underline" stretch strokeWidth={3} className="absolute -bottom-2 left-0 h-3 w-full text-accent/70" />
            </span>
          </p>
          <p className="text-text-muted">Not what&#8217;s the matter with you.</p>
          <p>What matters to you.</p>
        </div>
      </CollageRow>

      {/* Narrative */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="star" size={26} className="absolute right-[12%] top-12 text-primary/20" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-5 text-lg text-text-base leading-relaxed">
            <Reveal><p className="font-serif text-2xl text-text-base">The answer changes everything.</p></Reveal>
            <Reveal delay={90}>
              <p>
                A treatment plan that works on paper but doesn&#8217;t fit someone&#8217;s life is
                rarely a good plan. A recommendation that ignores family responsibilities, finances,
                culture, values, or personal goals often fails before it starts.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="font-serif text-2xl text-text-base leading-snug">
                Health doesn&#8217;t happen in isolation. It happens within the context of a life.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Goal */}
      <CollageRow
        collage={{ photoArea: "philosophy.goal", cartoon: "treating-person", blobVariant: 3, blobClass: "text-primary/10", doodle: "loops", doodleClass: "text-accent" }}
      >
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
      </CollageRow>

      <DynamicSections pageSlug="philosophy" />
    </>
  );
}
