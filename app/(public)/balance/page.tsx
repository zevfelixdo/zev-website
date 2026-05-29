import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Balance Is Not the Opposite of Ambition",
  description:
    "Why balance isn't something you earn after working hard — it's what allows people to sustain excellence, survive difficult seasons, and keep showing up for what matters.",
  alternates: { canonical: `${BASE}/balance` },
};

export default function BalancePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Balance
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Balance Is Not the Opposite of Ambition
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            For a long time, I thought balance was something you earned after working hard. Now I
            think it&#8217;s something you build first.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Narrative */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
          <p>
            At Camp Grounded, I watched people arrive carrying the same invisible weight. Their
            calendars were full. Their inboxes were overflowing. Their careers were moving forward.
            By most external measures, things were going well.
          </p>
          <p>
            Yet many of them were exhausted. Not because they lacked discipline. Because they had
            designed lives that left no room for recovery.
          </p>
          <p>
            Medicine eventually showed me the same thing. Some of the most capable, dedicated, and
            impressive people I&#8217;ve ever met were also carrying enormous stress, responsibility,
            and pressure. During my surgical training, I saw the beauty of intense commitment. I also
            saw the cost when there is no room for sleep, movement, creativity, relationships,
            laughter, or rest.
          </p>
          <p className="font-serif text-2xl text-text-base leading-snug">
            Balance is often mistaken for lowering standards. I think it&#8217;s the opposite.
          </p>
          <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-4 border-accent pl-5">
            <p>Balance is what allows people to sustain excellence.</p>
            <p>It&#8217;s what allows relationships to survive difficult seasons.</p>
            <p>It&#8217;s what allows meaningful work to continue over decades rather than years.</p>
          </div>
          <p>
            For me, balance isn&#8217;t about escaping responsibility. It&#8217;s about creating a
            life sturdy enough to hold responsibility without collapsing under it.
          </p>
          <div className="space-y-1 text-lg text-text-base">
            <p>It&#8217;s why I climb.</p>
            <p>Why I cook.</p>
            <p>Why I make things with my hands.</p>
            <p>Why I spend time outdoors.</p>
            <p>Why I chose Family Medicine.</p>
          </div>
          <p>And it&#8217;s a principle I bring into patient care every day.</p>
        </div>
      </section>

      {/* Closing */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-3 font-serif text-2xl text-text-base leading-snug">
            <p>The goal isn&#8217;t perfection.</p>
            <p>
              The goal is building a life that works well enough to keep showing up for the things
              that matter.
            </p>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="balance" />
    </>
  );
}
