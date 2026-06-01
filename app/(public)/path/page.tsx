import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";
import { Cartoon } from "@/components/public/Cartoon";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "path",
    path: "/path",
    fallbackTitle: "From Film to Family Medicine",
    fallbackDescription:
      "A nonlinear path to Family Medicine, in order: film school, Digital Detox and Camp Grounded, a post-bac pivot, osteopathic medical school, a surgical year, and the place where the pieces fit.",
  });
}

export default async function PathPage() {
  const c = await getPageContent("path");
  const f = (key: string, fallback: string) => field(c, key, fallback);

  const timeline = [
    {
      period: f("t1.period", "2008–2012"),
      title: f("t1.title", "University of Southern California"),
      body: f("t1.body", "Studied business and cinematic arts. I was fascinated by stories: why people make the decisions they do, and how communities form."),
    },
    {
      period: f("t2.period", "2012–2013"),
      title: f("t2.title", "Digital Detox"),
      body: f("t2.body", "Joined my brother Levi in building one of the earliest digital-wellness movements, designing its brand and website."),
    },
    {
      period: f("t3.period", "2013–2018"),
      title: f("t3.title", "Camp Grounded"),
      body: f("t3.body", "Co-founded and helped run a screen-free summer camp for adults. Years of campfires, and the question that still guides me: what matters to you?"),
    },
    {
      period: f("t4.period", "2018"),
      title: f("t4.title", "Kunming, China"),
      body: f("t4.body", "A three-month Shaolin Kung Fu and meditation intensive. A long detour that turned out to be part of the path."),
    },
    {
      period: f("t5.period", "2018–2020"),
      title: f("t5.title", "Mills College"),
      body: f("t5.body", "Returned to school for a post-baccalaureate pre-medical program. A deliberate pivot toward medicine, made after years of noticing what I cared about most."),
    },
    {
      period: f("t6.period", "2021–2025"),
      title: f("t6.title", "Touro University California"),
      body: f("t6.body", "Doctor of Osteopathic Medicine. Drawn to osteopathic medicine for its insistence that the body, mind, and context of a life are inseparable from health."),
    },
    {
      period: f("t7.period", "2025–2026"),
      title: f("t7.title", "UCSF East Bay"),
      body: f("t7.body", "A preliminary year in general surgery. Urgency, discipline, teamwork, and how to think clearly when things get complicated fast."),
    },
    {
      period: f("t8.period", "Now"),
      title: f("t8.title", "Family Medicine"),
      body: f("t8.body", "Continuity, relationships, and helping people before they arrive in crisis. The place where all the pieces finally fit."),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "My Path")}
        heading={f("hero.heading", "From Film to Family Medicine")}
        collage={{ cartoon: "walking", blobVariant: 2, blobClass: "text-primary/10", doodle: "path", doodleClass: "text-accent" }}
      >
        <p>
          {f("hero.lead", "The route was not a straight line, and I am glad it was not. Each detour taught me something I now use as a physician. Here it is, in order.")}
        </p>
      </PageHero>

      {/* Hero band (renders only if assigned) */}
      <PlacedParallax area="path.hero" height="lg" />

      {/* Timeline */}
      <section className="relative section-y container-content overflow-x-clip">
        <Cartoon
          name="hiking-walking"
          width={180}
          float
          decorative
          className="hidden xl:block absolute right-4 top-40 w-[160px] h-auto sticker"
        />
        <Doodle name="path" size={120} className="hidden xl:block absolute right-10 top-12 text-fun-tangerine/60" />
        <div className="max-w-2xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" aria-hidden />

            <ol className="space-y-10">
              {timeline.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <li className="relative pl-14 sm:pl-16">
                    {/* Dot */}
                    <div
                      className="absolute left-2.5 sm:left-4 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"
                      aria-hidden
                    />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-1">
                      {item.period}
                    </p>
                    <h2 className="font-serif text-2xl font-semibold text-text-base mb-2">
                      {item.title}
                    </h2>
                    <p className="text-text-muted leading-relaxed">{item.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="path" />
    </>
  );
}
