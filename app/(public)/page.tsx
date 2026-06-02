import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedGallery } from "@/components/public/PlacedGallery";
import { ExploreIndex, type ExploreItem } from "@/components/public/ExploreIndex";
import { RevealHeading } from "@/components/public/RevealHeading";
import { Reveal } from "@/components/public/Reveal";
import { Marquee } from "@/components/public/Marquee";
import { MagneticButton } from "@/components/public/MagneticButton";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";
import { CountUp } from "@/components/public/CountUp";
import { BikeEasterEgg } from "@/components/public/BikeEasterEgg";
import { getPlacements } from "@/lib/placements";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

// Per-page SEO sourced from the admin (Pages → Home → title/description),
// falling back to the bespoke homepage values so nothing regresses if unset.
// absoluteTitle keeps the full title (skips the "%s | Zev Felix" template).
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "home",
    path: "",
    absoluteTitle: true,
    fallbackTitle: "Zev Felix: Medicine, Creativity, Community, and the Art of Staying Human",
    fallbackDescription:
      "Family Medicine resident, former Camp Grounded co-founder, climber, and maker. A lifelong student of how people heal, connect, and build meaningful lives.",
  });
}

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

// Camp Grounded press (the strongest, most-defining proof — surfaced on the homepage).
const press = [
  { outlet: "The New York Times", url: "https://www.nytimes.com/2013/07/07/fashion/a-trip-to-camp-to-break-a-tech-addiction.html" },
  { outlet: "Forbes", url: "https://www.forbes.com/sites/ellenhuet/2014/06/20/camp-grounded-digital-detox/" },
  { outlet: "The New Yorker", url: "https://www.newyorker.com/tech/annals-of-technology/into-the-woods-and-away-from-technology" },
  { outlet: "CBS News", url: "https://www.cbsnews.com/news/camp-grounded-digital-detox-summer-camp-for-grown-ups/" },
];

export default async function HomePage() {
  const cardMap = await getPlacements(exploreItems.map((i) => i.area));

  // Editable copy from the admin (Pages → Home → Page text content). Every field
  // falls back to the original text, so the design is unchanged until an admin edits it.
  const c = await getPageContent("home");
  const f = (key: string, fallback: string) => field(c, key, fallback);

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

          {/* side cartoons framing the headline (wide screens only) — hover to meet each side of me */}
          <div className="group hidden xl:block absolute left-0 bottom-[10%] z-10">
            <Cartoon name="drinking-coffee" width={210} decorative className="w-[180px] h-auto sticker transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:-rotate-3" />
            <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary text-white text-xs font-medium px-3 py-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-3 shadow-card">Off the clock</span>
          </div>
          <div className="group hidden xl:block absolute right-0 bottom-[9%] z-10">
            <Cartoon name="hiking-standing" width={200} decorative className="w-[172px] h-auto sticker transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:rotate-3" />
            <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary text-white text-xs font-medium px-3 py-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-3 shadow-card">Wilderness medicine</span>
          </div>

          {/* center text */}
          <div className="relative z-10 max-w-3xl">
            <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>
              {f("hero.eyebrow", "Physician, Community Builder, Designer, and Creative Problem Solver")}
            </p>
            <h1 className="font-serif text-display text-text-base mt-5 mb-6">
              <RevealHeading text={f("hero.heading", "Medicine, Creativity, Community, and the Art of Staying Human")} trigger="mount" stagger={48} delay={120} />
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto rise" style={{ animationDelay: "620ms" }}>
              {f("hero.lead", "I’m Zev Felix, a Family Medicine resident who came to medicine the long way: film school, then co-founding Camp Grounded, then a year in surgery, and finally Family Medicine. I still build things, and I think a lot about how people stay human.")}
            </p>
            <p className="text-base text-text-muted/90 leading-relaxed max-w-2xl mx-auto mt-4 rise" style={{ animationDelay: "720ms" }}>
              {f("hero.intro", "The settings kept changing: film sets, summer camps, startup projects, mountain trails, operating rooms. The question never did: what helps people live healthier, more connected, and more meaningful lives?")}
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center rise" style={{ animationDelay: "820ms" }}>
              <MagneticButton>
                <Button as="link" href="/about" size="lg">{f("hero.cta1", "Read my story")}</Button>
              </MagneticButton>
              <Button as="link" href="/work" size="lg" variant="outline">{f("hero.cta2", "See my work")}</Button>
            </div>
          </div>

          {/* the star of the scene — Zev biking with Maisy (click me!) */}
          <div className="group relative z-10 mt-10 rise" style={{ animationDelay: "900ms" }}>
            <Doodle name="path" size={120} className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[125%] text-fun-tangerine/45" />
            <span className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary text-white text-xs font-medium px-3 py-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-2 shadow-card z-20">Maisy &amp; the trail</span>
            <BikeEasterEgg />
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

      {/* ── The short version (path + press) ─────────────── */}
      <section className="relative section-y container-content overflow-x-clip">
        <Doodle name="loops" size={70} strokeWidth={4} className="hidden lg:block absolute right-[7%] top-10 text-fun-leaf/60" />
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-6">The short version</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
              A long, winding path to Family Medicine: film school, then co-founding Camp Grounded and Digital Detox, then a year in surgery, and finally the work where all the pieces fit.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-lg text-text-muted leading-relaxed mt-6 max-w-2xl">
              Before medicine, my brother Levi and I built device-free retreats that brought thousands of people back to presence, and to each other.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Camp Grounded in the press</span>
              {press.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-anim text-sm text-primary hover:opacity-80 transition-opacity"
                >
                  {p.outlet}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9">
              <Button as="link" href="/unplugged" variant="outline">Read the full story</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── A few true things (count-up) ─────────────────── */}
      <section className="relative section-y container-content overflow-x-clip">
        <Blob variant={1} float className="absolute -left-[5%] top-1/2 -translate-y-1/2 h-[55%] w-[28%] text-fun-sky/15 blur-[2px]" />
        <Blob variant={3} float className="absolute -right-[5%] top-1/2 -translate-y-1/2 h-[55%] w-[28%] text-fun-sun/20 blur-[2px]" />
        <Doodle name="sparkle" size={28} float className="hidden sm:block absolute right-[10%] top-8 text-fun-coral" />
        <Doodle name="star" size={22} className="hidden sm:block absolute left-[10%] bottom-8 text-fun-tangerine" />
        <Reveal>
          <p className="eyebrow text-center mb-12">{f("facts.eyebrow", "A few true things")}</p>
        </Reveal>
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 text-center">
          {[
            { v: 3000, suffix: "+", label: f("facts.l1", "people who set their phones down at Camp Grounded") },
            { v: 17, suffix: "", label: f("facts.l2", "device-free camps, run with a small team") },
            { v: 10, suffix: "+", label: f("facts.l3", "years since my first day in a climbing gym") },
            { v: 1, suffix: "", label: f("facts.l4", "very good rescue dog, named Maisy") },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="font-serif text-display-sm text-primary leading-none">
                <CountUp value={s.v} suffix={s.suffix} />
              </p>
              <p className="text-sm text-text-muted mt-3 max-w-[14rem] mx-auto leading-relaxed">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

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
                {f("intro.p1", "Before medicine, I helped build a summer camp where adults handed over their phones, left their job titles behind, and spent weekends rediscovering how to be present.")}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lg text-text-muted leading-relaxed">
                {f("intro.p2", "Years later, after caring for my brother through glioblastoma, training in osteopathic medicine, spending long nights in trauma bays and operating rooms, and learning firsthand both the power and limits of modern healthcare, I found myself drawn toward a different kind of question.")}
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
          <p className="eyebrow !text-surface/60 mb-8">{f("band.eyebrow", "The question that guides everything")}</p>
          <p className="font-serif text-display-sm italic leading-tight text-surface/75">
            <RevealHeading text={f("band.l1", "Not just: how do we treat disease?")} stagger={32} />
          </p>
          <p className="font-serif text-display leading-tight mt-3">
            <RevealHeading text={f("band.l2", "How do we help people live well?")} stagger={42} />
          </p>
          <Reveal delay={150}>
            <p className="text-surface/75 text-lg mt-10">{f("band.close", "That question still guides everything I do.")}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Glimpses ─────────────────────────────────────── */}
      <section className="section-y container-content">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-display-sm text-text-base">
              <span className="relative inline-block">
                {f("glimpses.heading", "A few glimpses")}
                <Doodle name="underline" stretch strokeWidth={3} className="absolute -bottom-2 left-0 h-3 w-full text-fun-tangerine/70" />
              </span>
            </h2>
            <p className="section-index hidden sm:block">{f("glimpses.index", "In & out of the white coat")}</p>
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
              {f("explore.heading", "Wander through the threads that make up a life, and a way of practicing.")}
            </h2>
          </div>
        </Reveal>
        <ExploreIndex items={items} />
      </section>

      {/* ── Closing: stay a while ────────────────────────── */}
      <section className="section-y container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface-alt px-6 sm:px-12 py-14 sm:py-16">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
              <div>
                <p className="eyebrow mb-5">{f("close.eyebrow", "Stay a while")}</p>
                <h2 className="font-serif text-display-sm text-text-base leading-tight">
                  {f("close.heading", "Wander, read, or reach out.")}
                </h2>
                <p className="text-lg text-text-muted leading-relaxed mt-5 max-w-md">
                  {f("close.p", "This site is a slow walk through the threads of a life in medicine. If something here resonates, I’d love to hear from you.")}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <MagneticButton>
                    <Button as="link" href="/contact" size="lg">{f("close.cta1", "Get in touch")}</Button>
                  </MagneticButton>
                  <Button as="link" href="/writing" size="lg" variant="outline">{f("close.cta2", "Read the writing")}</Button>
                </div>

                <div className="mt-10 pt-8 border-t border-border max-w-md">
                  <h3 className="font-serif text-lg text-text-base mb-3">{f("close.search", "Looking for something?")}</h3>
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
