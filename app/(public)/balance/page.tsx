import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

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

export default async function BalancePage() {
  const c = await getPageContent("balance");
  const f = (key: string, fallback: string) => field(c, key, fallback);
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "Balance")}
        heading={f("hero.heading", "Balance Is Not the Opposite of Ambition")}
        collage={{ cartoon: "maisy-trotting", blobVariant: 2, blobClass: "text-primary/10", doodle: "sun", doodleClass: "text-accent" }}
      >
        <p>
          {f("hero.lead", "For a long time, I thought balance was something you earned after working hard. Now I think it’s something you build first.")}
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
          {f("narr.p1", "At Camp Grounded, I watched people arrive carrying the same invisible weight. Their calendars were full. Their inboxes were overflowing. Their careers were moving forward. By most external measures, things were going well.")}
        </p>
        <p>
          {f("narr.p2", "Yet many of them were exhausted. Not because they lacked discipline. Because they had designed lives that left no room for recovery.")}
        </p>
        <p>
          {f("narr.p3", "Medicine eventually showed me the same thing. Some of the most capable, dedicated, and impressive people I’ve ever met were also carrying enormous stress, responsibility, and pressure. During my surgical training, I saw the beauty of intense commitment. I also saw the cost when there is no room for sleep, movement, creativity, relationships, laughter, or rest.")}
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          {f("narr.quote", "Balance is often mistaken for lowering standards. I think it’s the opposite.")}
        </p>
        <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-2 border-accent pl-5">
          {lines(f("narr.principles", "Balance is what allows people to sustain excellence.\nIt’s what allows relationships to survive difficult seasons.\nIt’s what allows meaningful work to continue over decades rather than years.")).map((it, i) => (
            <p key={i}>{it}</p>
          ))}
        </div>
        <p>
          {f("narr.p4", "For me, balance isn’t about escaping responsibility. It’s about creating a life sturdy enough to hold responsibility without collapsing under it.")}
        </p>
        <div className="space-y-1 text-lg text-text-base">
          {lines(f("narr.whys", "It’s why I climb.\nWhy I cook.\nWhy I make things with my hands.\nWhy I spend time outdoors.\nWhy I chose Family Medicine.")).map((it, i) => (
            <p key={i}>{it}</p>
          ))}
        </div>
        <p>{f("narr.p5", "And it’s a principle I bring into patient care every day.")}</p>
      </CollageRow>

      {/* Closing */}
      <CollageRow
        tinted
        collage={{ photoArea: "balance.side", cartoon: "laying-with-maisy", blobVariant: 1, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <div className="space-y-3 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          <p>{f("close.l1", "The goal isn’t perfection.")}</p>
          <p>
            {f("close.l2", "The goal is building a life that works well enough to keep showing up for the things that matter.")}
          </p>
        </div>
      </CollageRow>

      <DynamicSections pageSlug="balance" />
    </>
  );
}
