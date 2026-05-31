import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedGallery } from "@/components/public/PlacedGallery";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { ExploreIndex, type ExploreItem } from "@/components/public/ExploreIndex";
import { getPlacement, getPlacements } from "@/lib/placements";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "Zev Felix: Medicine, Storytelling, and the Art of Staying Human",
  description:
    "Family Medicine resident, former Camp Grounded co-founder, climber, and maker. A lifelong student of how people heal, connect, and build meaningful lives.",
  alternates: { canonical: BASE },
};

const exploreItems = [
  { label: "About", href: "/about", area: "home.card.about", description: "The long way to Family Medicine: film, camp, surgery, and a dog from Taiwan." },
  { label: "Family Medicine", href: "/medicine", area: "home.card.medicine", description: "Why I chose it, and caring for the space before crisis." },
  { label: "Balance", href: "/balance", area: "home.card.balance", description: "Why balance is not the opposite of ambition." },
  { label: "Technology", href: "/technology", area: "home.card.technology", description: "Why the best tools create more connection, not less." },
  { label: "Outside the Hospital", href: "/outdoors", area: "home.card.outdoors", description: "Making things, climbing, Maisy, and wilderness medicine." },
  { label: "Projects", href: "/work", area: "home.card.projects", description: "Camp Grounded, Digital Detox, and building things that bring people together." },
  { label: "Philosophy of Care", href: "/philosophy", area: "home.card.philosophy", description: "What matters to you? The question that changes everything." },
  { label: "Writing", href: "/writing", area: "home.card.writing", description: "Essays and notes on medicine, technology, and living well." },
];

export default async function HomePage() {
  const [hero, cardMap] = await Promise.all([
    getPlacement("home.portrait"),
    getPlacements(exploreItems.map((i) => i.area)),
  ]);
  const heroImg = hero?.media ?? null;

  const items: ExploreItem[] = exploreItems.map((it) => {
    const p = cardMap[it.area];
    return {
      label: it.label,
      href: it.href,
      description: it.description,
      imageUrl: p?.media?.public_url ?? null,
      focalX: p?.focal_x ?? 50,
      focalY: p?.focal_y ?? 50,
    };
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container-content grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center min-h-[78vh] py-14 lg:py-20">
          <div>
            <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>
              Physician · Storyteller · Builder
            </p>
            <h1 className="font-serif text-display text-text-base mt-6 mb-7 rise" style={{ animationDelay: "120ms" }}>
              Medicine, Storytelling, and the Art of Staying Human
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl rise" style={{ animationDelay: "200ms" }}>
              I&#8217;m Zev Felix, a Family Medicine resident, former Camp Grounded co-founder,
              climber, maker, and lifelong student of how people heal, connect, and build meaningful
              lives.
            </p>
            <p className="text-base text-text-muted/90 leading-relaxed max-w-xl mt-4 rise" style={{ animationDelay: "240ms" }}>
              My path here has wound through documentary storytelling, digital detox retreats,
              wilderness medicine, surgery, community-building, and more than a few campfires.
              Family Medicine is where those threads finally came together.
            </p>
            <div className="flex flex-wrap gap-3 mt-9 rise" style={{ animationDelay: "300ms" }}>
              <Button as="link" href="/about" size="lg">Read my story</Button>
              <Button as="link" href="/work" size="lg" variant="outline">See my work</Button>
            </div>
          </div>

          {heroImg && (
            <div className="rise" style={{ animationDelay: "160ms" }}>
              <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[78vh] rounded-lg overflow-hidden bg-surface-alt shadow-card">
                <Image
                  src={heroImg.public_url}
                  alt={hero?.alt_override ?? heroImg.alt_text ?? "Zev Felix"}
                  fill
                  priority
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: `${hero?.focal_x ?? 50}% ${hero?.focal_y ?? 50}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 01 Introduction ──────────────────────────────── */}
      <section className="section-y container-content">
        <div className="grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-16">
          <p className="section-index lg:pt-3 whitespace-nowrap">01 — Introduction</p>
          <div className="max-w-2xl space-y-6">
            <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
              Before medicine, I helped build a summer camp where adults handed over their phones,
              left their job titles behind, and spent weekends rediscovering how to be present.
            </p>
            <p className="text-lg text-text-muted leading-relaxed">
              Years later, after caring for my brother through glioblastoma, training in osteopathic
              medicine, spending long nights in trauma bays and operating rooms, and learning
              firsthand both the power and limits of modern healthcare, I found myself drawn toward a
              different kind of question.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pull-quote band (deep green) ─────────────────── */}
      <section className="bg-primary text-surface section-y">
        <div className="container-content max-w-3xl text-center">
          <p className="eyebrow !text-surface/60 mb-8">The question that guides everything</p>
          <p className="font-serif text-display-sm leading-tight">
            Not just <em>how do we treat disease?</em>
          </p>
          <p className="font-serif text-display-sm leading-tight mt-2">
            <em>How do we help people live well?</em>
          </p>
          <p className="text-surface/75 text-lg mt-10">That question still guides everything I do.</p>
        </div>
      </section>

      {/* ── Glimpses ─────────────────────────────────────── */}
      <section className="section-y container-content">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-serif text-display-sm text-text-base">A few glimpses</h2>
          <p className="section-index hidden sm:block">In &amp; out of the white coat</p>
        </div>
        <PlacedGallery
          areas={["home.glimpse1", "home.glimpse2", "home.glimpse3"]}
          layout="grid"
          columns={3}
          caption="Tap any photo to view it full-screen."
        />
      </section>

      {/* ── 02 Explore ───────────────────────────────────── */}
      <section className="section-y container-content">
        <div className="grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-16 mb-12">
          <p className="section-index lg:pt-3 whitespace-nowrap">02 — Explore</p>
          <h2 className="font-serif text-display-sm text-text-base max-w-2xl">
            Wander through the threads that make up a life, and a way of practicing.
          </h2>
        </div>
        <ExploreIndex items={items} />
      </section>

      {/* ── Feature (parallax, renders only if assigned) ── */}
      <PlacedParallax area="home.feature" height="lg" />

      {/* ── Search ───────────────────────────────────────── */}
      <section className="section-y container-content">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-3">Looking for something?</h2>
          <p className="text-text-muted mb-6">Search across all pages, projects, and writing on this site.</p>
          <SearchBar variant="compact" />
        </div>
      </section>

      <DynamicSections pageSlug="home" />
    </>
  );
}
