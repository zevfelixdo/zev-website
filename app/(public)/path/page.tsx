import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "My Path",
  description:
    "From documentary film and business school to medicine, surgery, and family medicine. A nonlinear journey.",
  alternates: { canonical: `${BASE}/path` },
};

const timeline = [
  {
    period: "2006–2010",
    title: "USC — Business & Documentary Film",
    body: "I enrolled at USC thinking I wanted to work in business. I ended up spending most of my time in the documentary film program. I was drawn to stories, systems, and people — not spreadsheets.",
  },
  {
    period: "2010–2012",
    title: "Digital Detox & Camp Grounded",
    body: "My brother and I started Digital Detox, eventually building Camp Grounded — a summer camp for adults designed around unplugging. This work taught me about community, presence, and what people are actually hungry for when they slow down.",
  },
  {
    period: "2011–2013",
    title: "Post-Baccalaureate Pre-Medical Studies",
    body: "After several years of working in the start-up and nonprofit world, I returned to school to complete the science prerequisites for medicine. It was a deliberate pivot — not impulsive — made after years of noticing that what I cared most about was people's health and how they moved through the world.",
  },
  {
    period: "2013–2017",
    title: "Osteopathic Medical School (DO)",
    body: "I chose osteopathic medicine in part because of its philosophy: that the body, mind, and social context of a person's life are inseparable from their health. It felt like the most honest version of what medicine could be.",
  },
  {
    period: "2017–2022",
    title: "General Surgery Residency",
    body: "Five years of surgical training, including time in burn surgery, acute care surgery, and ICU/trauma. This work is fast, technically demanding, and requires clear thinking under pressure. I am grateful for every bit of it.",
  },
  {
    period: "2022–Present",
    title: "Family Medicine",
    body: "After surgery, I made the deliberate choice to transition into family medicine. Not as a retreat — as a direction. I want to know patients over time. I want to care for the whole person. I want to be part of the communities I serve.",
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
            From Reel to Real
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            I began at USC exploring documentary film and business, drawn to stories and systems.
            Over time, I realized I did not want to stay behind the camera or work at a distance
            from the people and communities I cared about. That search for more direct human
            connection helped move me toward medicine.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Narrative */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-6 text-text-base leading-relaxed">
          <p className="text-lg">
            My path into medicine was not straight, and I am glad it was not. The detours — film,
            business, entrepreneurship, camp — gave me a different lens for understanding people and
            what they actually need from a doctor.
          </p>
          <p>
            In documentary film, you learn to listen. You learn that the most important moments are
            usually the quiet ones, the pauses, the things people almost say. That skill — being
            present enough to notice — turns out to be one of the most important things a physician
            can develop.
          </p>
          <p>
            Running Camp Grounded, we put a few thousand adults through a structured experience of
            disconnection: no phones, no last names, no job titles. What happened in that space was
            remarkable. People remembered how to play. They cried. They said things to strangers
            they had never said to their closest friends. They slept. They came back year after year.
          </p>
          <p>
            That experience radicalized me, in a quiet way, about the role of connection and
            presence in health. And when my brother became ill, it became personal in a way I had
            not anticipated. Grief is a different kind of education.
          </p>
          <p>
            I came to medicine late by some measures. I think the waiting was part of it. I needed
            to live some life before I could understand what I was trying to help people hold on to.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-10">
            The long way around
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" aria-hidden />

            <ol className="space-y-10">
              {timeline.map((item, i) => (
                <li key={i} className="relative pl-14 sm:pl-16">
                  {/* Dot */}
                  <div
                    className="absolute left-2.5 sm:left-4 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-alt"
                    aria-hidden
                  />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    {item.period}
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-text-base mb-2">
                    {item.title}
                  </h3>
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
