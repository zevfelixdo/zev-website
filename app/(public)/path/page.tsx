import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";
import { Cartoon } from "@/components/public/Cartoon";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "From Film to Family Medicine",
  description:
    "A nonlinear path to Family Medicine, in order: film school, Digital Detox and Camp Grounded, a post-bac pivot, osteopathic medical school, a surgical year, and the place where the pieces fit.",
  alternates: { canonical: `${BASE}/path` },
};

const timeline = [
  {
    period: "2008–2012",
    title: "University of Southern California",
    body: "Studied business and cinematic arts. I was fascinated by stories: why people make the decisions they do, and how communities form.",
  },
  {
    period: "2012–2013",
    title: "Digital Detox",
    body: "Joined my brother Levi in building one of the earliest digital-wellness movements, designing its brand and website.",
  },
  {
    period: "2013–2018",
    title: "Camp Grounded",
    body: "Co-founded and helped run a screen-free summer camp for adults. Years of campfires, and the question that still guides me: what matters to you?",
  },
  {
    period: "2018",
    title: "Kunming, China",
    body: "A three-month Shaolin Kung Fu and meditation intensive. A long detour that turned out to be part of the path.",
  },
  {
    period: "2018–2020",
    title: "Mills College",
    body: "Returned to school for a post-baccalaureate pre-medical program. A deliberate pivot toward medicine, made after years of noticing what I cared about most.",
  },
  {
    period: "2021–2025",
    title: "Touro University California",
    body: "Doctor of Osteopathic Medicine. Drawn to osteopathic medicine for its insistence that the body, mind, and context of a life are inseparable from health.",
  },
  {
    period: "2025–2026",
    title: "UCSF East Bay",
    body: "A preliminary year in general surgery. Urgency, discipline, teamwork, and how to think clearly when things get complicated fast.",
  },
  {
    period: "Now",
    title: "Family Medicine",
    body: "Continuity, relationships, and helping people before they arrive in crisis. The place where all the pieces finally fit.",
  },
];

export default function PathPage() {
  return (
    <>
      <PageHero
        eyebrow="My Path"
        heading="From Film to Family Medicine"
        collage={{ cartoon: "walking", blobVariant: 2, blobClass: "text-primary/10", doodle: "path", doodleClass: "text-accent" }}
      >
        <p>
          The route was not a straight line, and I am glad it was not. Each detour taught me
          something I now use as a physician. Here it is, in order.
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
