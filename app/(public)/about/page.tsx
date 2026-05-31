import type { Metadata } from "next";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import { Reveal } from "@/components/public/Reveal";
import { RevealHeading } from "@/components/public/RevealHeading";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";
import { ParallaxView } from "@/components/public/ParallaxView";
import { AboutCollage } from "@/components/public/AboutCollage";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "The Long Way Here",
  description:
    "How Zev Felix found his way to Family Medicine: through film school, Camp Grounded and Digital Detox, his brother Levi, surgery, and a rescue dog from Taiwan.",
  alternates: { canonical: `${BASE}/about` },
};

export default async function AboutPage() {
  return (
    <>
      {/* ── Hero — layered collage ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container-content grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center min-h-[80vh] py-16 lg:py-20">
          <div className="relative">
            <p className="eyebrow rise" style={{ animationDelay: "40ms" }}>About</p>
            <h1 className="font-serif text-display text-text-base mt-6 mb-7">
              <RevealHeading text="The Long Way Here" trigger="mount" stagger={70} delay={120} />
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl rise" style={{ animationDelay: "520ms" }}>
              The first thing most people want to know about a doctor is where they trained.
              That&#8217;s fair. The more interesting question is how they ended up there in the
              first place.
            </p>
            <Doodle name="loops" size={120} className="hidden sm:block text-accent/60 mt-8 rise" strokeWidth={4} />
          </div>

          {/* collage cluster */}
          <div className="relative mx-auto w-full max-w-[460px] aspect-square lg:aspect-[5/6]">
            <Blob variant={2} float className="absolute -inset-[12%] h-[124%] w-[124%] text-fun-sky/30 blur-[1px]" />
            <Blob variant={1} float className="absolute -left-[8%] top-[6%] h-[55%] w-[55%] text-fun-tangerine/25 blur-[1px]" />
            <Doodle name="sparkle" size={40} float className="absolute right-3 top-1 z-30 text-fun-coral" />
            <Doodle name="star" size={22} className="absolute bottom-12 left-0 z-30 text-fun-tangerine" />
            <Doodle name="sun" size={26} float className="absolute right-8 bottom-16 z-30 text-fun-sun" />

            <ParallaxView speed={0.05} className="absolute right-1 top-1 z-10 w-[63%]">
              <div className="polaroid -rotate-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:!rotate-0">
                <span className="tape left-8 -top-3 rotate-2" aria-hidden="true" />
                <PlacedImage area="about.profile" aspect="4/5" rounded={false} priority sizes="(min-width:1024px) 24vw, 60vw" />
              </div>
            </ParallaxView>

            <ParallaxView speed={0.13} className="absolute bottom-0 left-0 z-20 w-[56%]">
              <Cartoon name="walking" width={320} priority decorative float className="h-auto w-full sticker" />
            </ParallaxView>
          </div>
        </div>
      </section>

      {/* ── 01 Curiosity ─────────────────────────────────── */}
      <section className="section-y container-content border-t border-border overflow-x-clip">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal><p className="section-index mb-6">01 — Curiosity</p></Reveal>
            <div className="space-y-6 text-lg text-text-base leading-relaxed">
              <Reveal>
                <p>
                  My path to Family Medicine has taken me through film school, startup culture,
                  Chinese martial arts training, adult summer camps, surgery, wilderness medicine,
                  woodworking shops, climbing walls, and one very patient rescue dog from Taiwan.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p>
                  At USC, I studied business and cinematic arts because I was fascinated by stories.
                  Not fictional stories so much as real ones. Why people make the decisions they do.
                  How communities form. How identity gets built.
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal>
            <AboutCollage photoArea="about.curiosity" cartoon="hiking-walking" blobClass="text-accent/10" blobVariant={1} doodle="sun" doodleClass="text-accent" />
          </Reveal>
        </div>
      </section>

      {/* ── 02 Camp Grounded ─────────────────────────────── */}
      <section className="section-y container-content overflow-x-clip">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-2">
            <Reveal><p className="section-index mb-6">02 — Camp Grounded</p></Reveal>
            <div className="space-y-6 text-lg text-text-base leading-relaxed">
              <Reveal>
                <p>
                  After college, those interests led me somewhere unexpected. Together with my brother
                  Levi and a group of remarkably creative friends, I helped build Camp Grounded and
                  Digital Detox, device-free retreats where adults stepped away from phones, work
                  identities, and constant connectivity for a few days.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
                  The idea sounds simple. The results were not.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  People arrived exhausted. By the end of the weekend they were singing around
                  campfires, making things with their hands, having difficult conversations,
                  reconnecting with old dreams, and remembering parts of themselves that had been
                  buried beneath calendars, deadlines, and notifications.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p>
                  Long before I entered medicine, I found myself captivated by a question that would
                  follow me for years:{" "}
                  <span className="relative inline-block font-serif italic">
                    What helps people feel alive?
                    <Doodle name="circle" stretch strokeWidth={2} className="absolute -left-3 -top-2 h-[150%] w-[calc(100%+1.5rem)] text-accent/70" />
                  </span>
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal className="lg:order-1">
            <AboutCollage photoArea="about.camp" cartoon="high-five" mirror blobClass="text-primary/10" blobVariant={3} doodle="heart" doodleClass="text-accent" />
          </Reveal>
        </div>
      </section>

      {/* ── 03 Levi (reverent, cartoon-free) ─────────────── */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="star" size={26} className="absolute right-[12%] top-10 text-primary/20" />
        <div className="container-content max-w-2xl relative">
          <Reveal><p className="section-index mb-6">03 — Levi</p></Reveal>
          <div className="space-y-6 text-lg text-text-base leading-relaxed">
            <Reveal>
              <p>
                That question became far more personal when my brother Levi was diagnosed with
                glioblastoma. Watching him move through surgeries, treatments, setbacks, difficult
                conversations, and eventually hospice changed what I noticed about healthcare.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                I paid attention to the physicians who could explain complicated things clearly. The
                nurses who knew when to speak and when to sit quietly. The small acts of competence
                that created trust. The moments of presence that helped families carry impossible
                situations.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug border-l-2 border-accent pl-6">
                Medicine stopped being an abstract profession. It became deeply human.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 Surgery ───────────────────────────────────── */}
      <section className="section-y container-content overflow-x-clip">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal><p className="section-index mb-6">04 — Surgery</p></Reveal>
            <div className="space-y-6 text-lg text-text-base leading-relaxed">
              <Reveal>
                <p>
                  Years later, I entered osteopathic medical school and eventually completed a
                  preliminary year in General Surgery at UCSF East Bay in Oakland. Surgery taught me
                  urgency, discipline, teamwork, and how to function when things become complicated
                  very quickly.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p>
                  It also clarified what I wanted most. I wanted continuity. I wanted relationships. I
                  wanted to help people before they arrived in crisis.
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal>
            <AboutCollage photoArea="about.surgery" cartoon="scrubbing" blobClass="text-primary/10" blobVariant={2} doodle="sparkle" doodleClass="text-accent" />
          </Reveal>
        </div>
      </section>

      {/* ── 05 Family Medicine ───────────────────────────── */}
      <section className="section-y container-content overflow-x-clip">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-2">
            <Reveal><p className="section-index mb-6">05 — Family Medicine</p></Reveal>
            <Reveal delay={80}>
              <p className="font-serif text-display-sm text-text-base leading-tight">
                Family Medicine felt less like changing directions and more like finally arriving at
                the place where all the pieces belonged.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <Doodle name="arrow" size={84} className="text-accent/70 mt-6 -scale-x-100" strokeWidth={5} />
            </Reveal>
          </div>
          <Reveal className="lg:order-1">
            <AboutCollage photoArea="about.family" cartoon="talking-to-kid" mirror blobClass="text-accent/10" blobVariant={1} doodle="heart" doodleClass="text-accent" />
          </Reveal>
        </div>
      </section>

      {/* ── Facts band ───────────────────────────────────── */}
      <section className="relative bg-primary text-surface section-y overflow-hidden">
        <Doodle name="sparkle" size={30} float className="absolute left-[6%] top-10 text-surface/30" />
        <div className="container-content relative">
          <div className="grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-10 lg:gap-12 items-start">
            <Reveal>
              <p className="eyebrow !text-surface/60 mb-4">Background</p>
              <ul className="space-y-2 text-surface/90">
                <li>California raised</li>
                <li>USC (Business &amp; Cinematic Arts)</li>
                <li>Osteopathic medical school (DO)</li>
                <li>Preliminary year, General Surgery (UCSF East Bay)</li>
                <li>Family Medicine resident (current)</li>
              </ul>
            </Reveal>
            <Reveal delay={80}>
              <p className="eyebrow !text-surface/60 mb-4">Interests</p>
              <ul className="space-y-2 text-surface/90">
                <li>Rock climbing (trad, top rope)</li>
                <li>Yosemite &amp; the Sierra Nevada</li>
                <li>Wilderness medicine</li>
                <li>Cooking</li>
                <li>Making things</li>
                <li>Technology &amp; health</li>
                <li>Maisy (dog)</li>
              </ul>
            </Reveal>
            <Reveal delay={160}>
              <p className="eyebrow !text-surface/60 mb-4">Values</p>
              <ul className="space-y-2 text-surface/90">
                <li>Presence over performance</li>
                <li>Connection over productivity</li>
                <li>Honesty in medicine and in life</li>
                <li>Humility in practice</li>
              </ul>
            </Reveal>
            <div className="hidden lg:block relative self-end">
              <Cartoon name="petting-maisy" width={250} float decorative className="h-auto w-[230px] sticker" />
              <Doodle name="heart" size={22} float className="absolute -top-2 right-6 text-accent" />
            </div>
          </div>
        </div>
      </section>

      <DynamicSections pageSlug="about" />
    </>
  );
}
