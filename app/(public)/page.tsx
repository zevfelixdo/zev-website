import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedGallery } from "@/components/public/PlacedGallery";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { ExploreIndex, type ExploreItem } from "@/components/public/ExploreIndex";
import { RevealHeading } from "@/components/public/RevealHeading";
import { Reveal } from "@/components/public/Reveal";
import { Marquee } from "@/components/public/Marquee";
import { MagneticButton } from "@/components/public/MagneticButton";
import { ParallaxView } from "@/components/public/ParallaxView";
import { Cartoon } from "@/components/public/Cartoon";
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

const threads = [
  "Family Medicine",
  "Camp Grounded",
  "Wilderness Medicine",
  "Documentary Storytelling",
  "Digital Detox",
  "Rock Climbing",
  "Staying Human",
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
        <div className="container-content grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center min-h-[86vh] py-16 lg:py-20">
          <div>
            <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>
              Physician · Storyteller · Builder
            </p>
            <h1 className="font-serif text-display text-text-base mt-6 mb-7">
              <RevealHeading text="Medicine, Storytelling, and the Art of Staying Human" trigger="mount" stagger={55} delay={120} />
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl rise" style={{ animationDelay: "620ms" }}>
              I&#8217;m Zev Felix, a Family Medicine resident, former Camp Grounded co-founder,
              climber, maker, and lifelong student of how people heal, connect, and build meaningful
              lives.
            </p>
            <p className="text-base text-text-muted/90 leading-relaxed max-w-xl mt-4 rise" style={{ animationDelay: "720ms" }}>
              My path here has wound through documentary storytelling, digital detox retreats,
              wilderness medicine, surgery, community-building, and more than a few campfires.
              Family Medicine is where those threads finally came together.
            </p>
            <div className="flex flex-wrap gap-3 mt-9 rise" style={{ animationDelay: "820ms" }}>
              <MagneticButton>
                <Button as="link" href="/about" size="lg">Read my story</Button>
              </MagneticButton>
              <Button as="link" href="/work" size="lg" variant="outline">See my work</Button>
            </div>
          </div>

          {heroImg && (
            <ParallaxView speed={0.05} className="rise" >
              <div className="hover-zoom relative w-full aspect-[4/5] lg:aspect-auto lg:h-[78vh] rounded-lg overflow-hidden bg-surface-alt shadow-card">
                <Image
                  src={heroImg.public_url}
                  alt={hero?.alt_override ?? heroImg.alt_text ?? "Zev Felix"}
                  fill
                  priority
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: `${hero?.focal_x ?? 50}% ${hero?.focal_y ?? 50}%` }}
                />
                <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-surface/85 backdrop-blur px-3 py-1.5 text-xs font-medium tracking-wide text-text-base shadow-card">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  Family Medicine resident
                </span>
              </div>
            </ParallaxView>
          )}
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-text-muted">
          <span className="text-[0.68rem] uppercase tracking-[0.24em]">Scroll</span>
          <ChevronDown size={18} className="scroll-cue" aria-hidden="true" />
        </div>
      </section>

      {/* ── Threads marquee ──────────────────────────────── */}
      <div className="full-bleed border-y border-border bg-surface-alt/50 py-5 sm:py-6">
        <Marquee
          items={threads}
          duration={40}
          itemClassName="font-serif italic text-2xl sm:text-3xl text-text-base/80"
        />
      </div>

      {/* ── 01 Introduction ──────────────────────────────── */}
      <section className="section-y container-content relative">
        <Cartoon
          name="walking"
          width={190}
          float
          decorative
          className="hidden xl:block absolute right-2 top-[44%] -translate-y-1/2 w-[170px] h-auto"
        />
        <div className="grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-16">
          <p className="section-index lg:pt-3 whitespace-nowrap">01 — Introduction</p>
          <div className="max-w-2xl space-y-6">
            <Reveal>
              <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
                Before medicine, I helped build a summer camp where adults handed over their phones,
                left their job titles behind, and spent weekends rediscovering how to be present.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lg text-text-muted leading-relaxed">
                Years later, after caring for my brother through glioblastoma, training in osteopathic
                medicine, spending long nights in trauma bays and operating rooms, and learning
                firsthand both the power and limits of modern healthcare, I found myself drawn toward a
                different kind of question.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Pull-quote band (deep green) ─────────────────── */}
      <section className="relative overflow-hidden bg-primary text-surface section-y">
        {/* soft warm glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[28rem] w-[44rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgb(var(--color-accent)), transparent)" }}
          aria-hidden="true"
        />
        <div className="container-content max-w-3xl text-center relative">
          <Reveal variant="rule-draw" className="mx-auto mb-8 h-px w-16 bg-surface/40" />
          <p className="eyebrow !text-surface/60 mb-8">The question that guides everything</p>
          <p className="font-serif text-display-sm italic leading-tight text-surface/75">
            <RevealHeading text="Not just: how do we treat disease?" stagger={32} />
          </p>
          <p className="font-serif text-display leading-tight mt-3">
            <RevealHeading text="How do we help people live well?" stagger={42} />
          </p>
          <Reveal delay={150}>
            <p className="text-surface/75 text-lg mt-10">That question still guides everything I do.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Glimpses ─────────────────────────────────────── */}
      <section className="section-y container-content">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-display-sm text-text-base">A few glimpses</h2>
            <p className="section-index hidden sm:block">In &amp; out of the white coat</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <PlacedGallery
            areas={["home.glimpse1", "home.glimpse2", "home.glimpse3"]}
            layout="grid"
            columns={3}
            caption="Tap any photo to view it full-screen."
          />
        </Reveal>
      </section>

      {/* ── 02 Explore ───────────────────────────────────── */}
      <section className="section-y container-content">
        <Reveal>
          <div className="grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-16 mb-12">
            <p className="section-index lg:pt-3 whitespace-nowrap">02 — Explore</p>
            <h2 className="font-serif text-display-sm text-text-base max-w-2xl">
              Wander through the threads that make up a life, and a way of practicing.
            </h2>
          </div>
        </Reveal>
        <ExploreIndex items={items} />
      </section>

      {/* ── Feature (parallax, renders only if assigned) ── */}
      <PlacedParallax area="home.feature" height="lg" />

      {/* ── Closing: stay a while ────────────────────────── */}
      <section className="section-y container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface-alt px-6 sm:px-12 py-14 sm:py-16">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
              <div>
                <p className="eyebrow mb-5">Stay a while</p>
                <h2 className="font-serif text-display-sm text-text-base leading-tight">
                  Wander, read, or reach out.
                </h2>
                <p className="text-lg text-text-muted leading-relaxed mt-5 max-w-md">
                  This site is a slow walk through the threads of a life in medicine. If something
                  here resonates, I&#8217;d love to hear from you.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <MagneticButton>
                    <Button as="link" href="/contact" size="lg">Get in touch</Button>
                  </MagneticButton>
                  <Button as="link" href="/writing" size="lg" variant="outline">Read the writing</Button>
                </div>

                <div className="mt-10 pt-8 border-t border-border max-w-md">
                  <h3 className="font-serif text-lg text-text-base mb-3">Looking for something?</h3>
                  <SearchBar variant="compact" />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <Cartoon
                  name="laying-with-maisy"
                  width={460}
                  float
                  decorative
                  sizes="(min-width:1024px) 36vw, 70vw"
                  className="w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[440px] h-auto"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <DynamicSections pageSlug="home" />
    </>
  );
}
