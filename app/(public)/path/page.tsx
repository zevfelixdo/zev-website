import { DynamicSections } from "@/components/public/DynamicSections";
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
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            My Path
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            From Film to Family Medicine
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            The route was not a straight line, and I am glad it was not. Each detour taught me
            something I now use as a physician. Here it is, in order.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Timeline */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" aria-hidden />

            <ol className="space-y-10">
              {timeline.map((item, i) => (
                <li key={i} className="relative pl-14 sm:pl-16">
                  {/* Dot */}
                  <div
                    className="absolute left-2.5 sm:left-4 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface"
                    aria-hidden
                  />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    {item.period}
                  </p>
                  <h2 className="font-serif text-xl font-semibold text-text-base mb-2">
                    {item.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="path" />
    </>
  );
}
