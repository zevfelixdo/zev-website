import { DynamicSections } from "@/components/public/DynamicSections";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "philosophy",
    path: "/philosophy",
    fallbackTitle: "What Matters To You?",
    fallbackDescription:
      "One of the most important questions in medicine is also one of the simplest. Not what's the matter with you. What matters to you. The answer changes everything.",
  });
}

export default async function PhilosophyPage() {
  const c = await getPageContent("philosophy");
  const f = (key: string, fallback: string) => field(c, key, fallback);
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "Philosophy of Care")}
        heading={f("hero.heading", "What Matters To You?")}
        collage={{ photoArea: "philosophy.portrait", cartoon: "talking-to-nurse", blobVariant: 2, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>{f("hero.lead", "One of the most important questions in medicine is also one of the simplest.")}</p>
      </PageHero>

      {/* Opening */}
      <CollageRow
        mirror
        collage={{ photoArea: "philosophy.opening", cartoon: "wrapping-ace", blobVariant: 1, blobClass: "text-accent/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <div className="space-y-4 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          <p>
            <span className="relative inline-block">
              {f("open.phrase", "What matters to you?")}
              <Doodle name="underline" stretch strokeWidth={3} className="absolute -bottom-2 left-0 h-3 w-full text-accent/70" />
            </span>
          </p>
          <p className="text-text-muted">{f("open.line2", "Not what’s the matter with you.")}</p>
          <p>{f("open.line3", "What matters to you.")}</p>
        </div>
      </CollageRow>

      {/* Narrative */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="star" size={26} className="absolute right-[12%] top-12 text-fun-coral/60" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-5 text-lg text-text-base leading-relaxed">
            <Reveal><p className="font-serif text-2xl text-text-base">{f("narr.q1", "The answer changes everything.")}</p></Reveal>
            <Reveal delay={90}>
              <p>
                {f("narr.p1", "A treatment plan that works on paper but doesn’t fit someone’s life is rarely a good plan. A recommendation that ignores family responsibilities, finances, culture, values, or personal goals often fails before it starts.")}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="font-serif text-2xl text-text-base leading-snug">
                {f("narr.q2", "Health doesn’t happen in isolation. It happens within the context of a life.")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Goal */}
      <CollageRow
        collage={{ photoArea: "philosophy.goal", cartoon: "lunging", blobVariant: 3, blobClass: "text-primary/10", doodle: "loops", doodleClass: "text-accent" }}
      >
        <p>
          {f("goal.p1", "My goal as a physician is not to create perfect patients. It’s to help people make meaningful progress.")}
        </p>
        <div className="space-y-1 text-lg text-text-base">
          {lines(f("goal.list", "Sometimes that means medication.\nSometimes it means a procedure.\nSometimes it means sleep, movement, connection, therapy, nutrition, boundaries, community, or a difficult conversation.\nUsually it’s some combination of all of them.")).map((it, i) => (
            <p key={i}>{it}</p>
          ))}
        </div>
        <p>
          {f("goal.p2", "The most effective healthcare I’ve seen is rarely the most complicated. It’s the care that meets people where they are and helps them move forward from there.")}
        </p>
      </CollageRow>

      <DynamicSections pageSlug="philosophy" />
    </>
  );
}
