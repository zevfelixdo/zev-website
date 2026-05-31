import type { Metadata } from "next";
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
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";
import { getPlacements } from "@/lib/placements";

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
  const cardMap = await getPlacements(exploreItems.map((i) => i.area));

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
      {/* ── Hero — a playful, type-forward scene ─────────── */}
      <section className="relative overflow-hidden">
        <div className="container-content relative flex flex-col items-center justify-center text-center min-h-[90vh] py-20 lg:py-24">
          {/* bright background shapes */}
          <Blob variant={1} float className="absolute -top-[4%] -left-[12%] h-[48%] w-[48%] text-fun-sky/25 blur-[2px]" />
          <Blob variant={3} float className="absolute top-[6%] -right-[12%] h-[44%] w-[44%] text-fun-sun/30 blur-[2px]" />
          <Blob variant={2} float className="absolute bottom-[2%] left-[26%] h-[46%] w-[46%] text-fun-coral/15 blur-[2px]" />

          {/* scattered doodles (corners, clear of the centered text) */}
          <Doodle name="sparkle" size={42} float className="absolute left-[8%] top-[15%] text-fun-coral" />
          <Doodle name="sun" size={46} float className="absolute right-[9%] top-[17%] text-fun-tangerine" />
          <Doodle name="star" size={26} className="absolute left-[14%] bottom-[24%] text-fun-sky" />
          <Doodle name="loops" size={84} strokeWidth={4} className="hidden sm:block absolute right-[12%] bottom-[26%] text-fun-leaf/70" />

          {/* side cartoons framing the headline (wide screens only) */}
          <Cartoon name="drinking-coffee" width={210} float decorative className="hidden xl:block absolute left-0 bottom-[10%] w-[180px] h-auto sticker" />
          <Cartoon name="hiking-standing" width={200} float decorative className="hidden xl:block absolute right-0 bottom-[9%] w-[172px] h-auto sticker" />

          {/* center text */}
          <div className="relative z-10 max-w-3xl">
            <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>
              Physician · Storyteller · Builder
            </p>
            <h1 className="font-serif text-display text-text-base mt-5 mb-6">
              <RevealHeading text="Medicine, Storytelling, and the Art of Staying Human" trigger="mount" stagger={55} delay={120} />
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto rise" style={{ animationDelay: "620ms" }}>
              I&#8217;m Zev Felix, a Family Medicine resident, former Camp Grounded co-founder,
              climber, maker, and lifelong student of how people heal, connect, and build meaningful
              lives.
            </p>
            <p className="text-base text-text-muted/90 leading-relaxed max-w-2xl mx-auto mt-4 rise" style={{ animationDelay: "720ms" }}>
              My path here has wound through documentary storytelling, digital detox retreats,
              wilderness medicine, surgery, community-building, and more than a few campfires.
              Family Medicine is where those threads finally came together.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center rise" style={{ animationDelay: "820ms" }}>
              <MagneticButton>
                <Button as="link" href="/about" size="lg">Read my story</Button>
              </MagneticButton>
              <Button as="link" href="/work" size="lg" variant="outline">See my work</Button>
            </div>
          </div>

          {/* the star of the scene — Zev biking with Maisy */}
          <div className="relative z-10 mt-10 rise" style={{ animationDelay: "900ms" }}>
            <Doodle name="path" size={120} className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[125%] text-fun-tangerine/45" />
            <Cartoon
              name="bike-w-maisy"
              width={380}
              priority
              decorative
              float
              className="relative w-[270px] sm:w-[330px] lg:w-[380px] h-auto"
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-text-muted">
          <span className="text-[0.68rem] uppercase tracking-[0.24em]">Scroll</span>
          <ChevronDown size={18} className="scroll-cue" aria-hidden="true" />
        </div>
      </section>

      {/* ── Threads marquee ──────────────────────────────── */}
      <div className="overflow-x-clip">
        <div className="full-bleed border-y border-border bg-surface-alt/50 py-5 sm:py-6">
          <Marquee
            items={threads}
            duration={40}
            itemClassName="font-serif italic text-2xl sm:text-3xl text-text-base/80"
          />
        </div>
      </div>

      {/* ── 01 Introduction ──────────────────────────────── */}
      <section className="section-y container-content relative overflow-x-clip">
        <Blob variant={3} float className="hidden xl:block absolute right-0 top-[44%] -translate-y-1/2 z-0 h-[280px] w-[280px] text-fun-leaf/25 blur-[1px]" />
        <Doodle name="sparkle" size={30} float className="hidden xl:block absolute right-40 top-[26%] z-20 text-fun-tangerine" />
        <Cartoon
          name="walking"
          width={190}
          float
          decorative
          className="hidden xl:block absolute right-2 top-[44%] -translate-y-1/2 z-10 w-[170px] h-auto sticker"
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
        <Doodle name="sparkle" size={34} float className="absolute left-[9%] top-14 text-fun-sun/80" />
        <Doodle name="star" size={26} className="absolute right-[11%] bottom-14 text-fun-coral/80" />
        <Doodle name="loops" size={70} strokeWidth={4} className="hidden sm:block absolute right-[14%] top-16 text-fun-sky/50" />
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
            <h2 className="font-serif text-display-sm text-text-base">
              <span className="relative inline-block">
                A few glimpses
                <Doodle name="underline" stretch strokeWidth={3} className="absolute -bottom-2 left-0 h-3 w-full text-fun-tangerine/70" />
              </span>
            </h2>
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
      <section className="relative section-y container-content overflow-x-clip">
        <Doodle name="star" size={26} float className="hidden lg:block absolute right-6 top-16 text-fun-sky" />
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

              <div className="relative flex justify-center lg:justify-end">
                <Blob variant={2} float className="absolute inset-0 m-auto h-[112%] w-[112%] text-fun-sky/25 blur-[1px]" />
                <Blob variant={1} float className="absolute right-2 bottom-2 h-[55%] w-[55%] text-fun-sun/30 blur-[1px]" />
                <Doodle name="heart" size={28} float className="absolute right-6 top-1 z-20 text-fun-coral" />
                <Doodle name="sparkle" size={22} float className="absolute left-6 bottom-8 z-20 text-fun-tangerine" />
                <Cartoon
                  name="laying-with-maisy"
                  width={460}
                  float
                  decorative
                  sizes="(min-width:1024px) 36vw, 70vw"
                  className="relative z-10 w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[440px] h-auto"
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
