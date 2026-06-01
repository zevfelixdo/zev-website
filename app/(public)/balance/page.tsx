import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "balance",
    path: "/balance",
    fallbackTitle: "Balance Is Not the Opposite of Ambition",
    fallbackDescription:
      "Why balance isn't something you earn after working hard. It's what allows people to sustain excellence, survive difficult seasons, and keep showing up for what matters.",
  });
}

export default function BalancePage() {
  return (
    <>
      <PageHero
        eyebrow="Balance"
        heading="Balance Is Not the Opposite of Ambition"
        collage={{ cartoon: "drinking-coffee", blobVariant: 2, blobClass: "text-primary/10", doodle: "sun", doodleClass: "text-accent" }}
      >
        <p>
          For a long time, I thought balance was something you earned after working hard. Now I
          think it&#8217;s something you build first.
        </p>
      </PageHero>

      {/* Hero band (renders only if assigned) */}
      <section className="container-content">
        <PlacedImage area="balance.hero" aspect="16/9" priority sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      {/* Narrative */}
      <CollageRow
        mirror
        collage={{ cartoon: "plant", blobVariant: 3, blobClass: "text-accent/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
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
        <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-2 border-accent pl-5">
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
      </CollageRow>

      {/* Closing */}
      <CollageRow
        tinted
        collage={{ photoArea: "balance.side", cartoon: "laying-with-maisy", blobVariant: 1, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <div className="space-y-3 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          <p>The goal isn&#8217;t perfection.</p>
          <p>
            The goal is building a life that works well enough to keep showing up for the things
            that matter.
          </p>
        </div>
      </CollageRow>

      <DynamicSections pageSlug="balance" />
    </>
  );
}
