import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "The Things That Keep Me Grounded",
  description:
    "Making things, rock climbing, a rescue dog named Maisy, and wilderness medicine: the life outside the hospital that makes the work inside it possible.",
  alternates: { canonical: `${BASE}/outdoors` },
};

export default function OutdoorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Outside the Hospital
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            The Things That Keep Me Grounded
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            When people hear &#8220;doctor,&#8221; they often imagine someone who spends all day
            thinking about medicine. I like medicine. I spend plenty of time thinking about it. But I
            don&#8217;t think a good life can be built from a single interest.
          </p>
        </div>
      </section>

      {/* Hero image (only renders if an admin has assigned one) */}
      <section className="container-content">
        <PlacedImage area="outdoors.hero" aspect="16/9" priority sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      <div className="border-t border-border mt-12" />

      {/* Making things */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
          <h2 className="font-serif text-3xl font-semibold text-text-base">Making things</h2>
          <p>
            Outside the hospital, you&#8217;ll usually find me making something. Sometimes it&#8217;s
            a loaf of bread. Sometimes it&#8217;s fresh pasta. Sometimes it&#8217;s a woodworking
            project that takes three times longer than expected because I convinced myself I could
            build it without reading the instructions.
          </p>
          <p>
            I love understanding how things work. Furniture. Gardens. Knitting patterns. Human
            bodies. They&#8217;re all systems with their own logic and constraints.
          </p>
        </div>
      </section>

      {/* Climbing & Maisy */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">Climbing</h2>
            <p>
              I also spend as much time as possible outside. Rock climbing has shaped how I think in
              ways I didn&#8217;t expect when I first walked into a climbing gym in Oakland more than
              a decade ago.
            </p>
            <p>
              Climbing rewards preparation, patience, communication, trust, and humility. Yosemite
              remains one of my favorite places in the world because it strips away distractions and
              makes your priorities very clear.
            </p>
            <div className="font-serif text-xl text-text-base leading-relaxed border-l-4 border-accent pl-5">
              <p>Pay attention.</p>
              <p>Trust your partner.</p>
              <p>Stay present.</p>
              <p>Take the next step.</p>
            </div>
            <PlacedImage area="outdoors.climbing" aspect="4/5" sizes="(min-width:1024px) 44vw, 100vw" />
          </div>
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">Maisy</h2>
            <p>
              My rescue dog Maisy helps reinforce similar lessons. She spent the first years of her
              life as a street dog in Taiwan and arrived with understandable concerns about trusting
              humans.
            </p>
            <p>
              Earning that trust required patience, consistency, and letting progress happen on her
              timeline rather than mine.
            </p>
            <PlacedImage area="outdoors.maisy" aspect="4/5" sizes="(min-width:1024px) 44vw, 100vw" />
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-4 text-text-base leading-relaxed">
            <p className="font-serif text-2xl text-text-base leading-snug">
              Medicine turns out to work much the same way.
            </p>
            <p>
              Health is rarely built in dramatic moments. More often it&#8217;s built through small,
              repeated actions practiced over time. The same is true for friendships. Relationships.
              Communities. And most worthwhile things in life.
            </p>
          </div>
        </div>
      </section>

      {/* Wilderness */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Wilderness
          </p>
          <h2 className="font-serif text-4xl font-semibold text-text-base leading-tight mb-6">
            Learning what matters when resources don&#8217;t exist
          </h2>
          <div className="space-y-5 text-text-base leading-relaxed">
            <p>
              At 2 a.m. in the mountains of Colorado, our team received coordinates for a simulated
              plane crash. We had radios, headlamps, basic medical equipment, and whatever we could
              carry on our backs.
            </p>
            <div className="font-serif text-xl text-text-base leading-relaxed border-l-4 border-accent pl-5">
              <p>No CT scanner.</p>
              <p>No trauma bay.</p>
              <p>No consultant down the hall.</p>
              <p>No convenient backup plan.</p>
            </div>
            <p>Just terrain, weather, teamwork, and judgment.</p>
            <p>
              Wilderness medicine fascinated me because it removes the illusion that more equipment
              automatically creates better decisions. In austere environments, preparation matters.
              Communication matters. Adaptability matters. Leadership matters.
            </p>
            <p>
              The principles aren&#8217;t all that different from everyday life. Things rarely go
              according to plan. Resources are limited. Uncertainty is unavoidable. People still need
              help.
            </p>
            <p>
              Those experiences reinforced something I value deeply: expertise matters, but
              resourcefulness matters too. The ability to stay calm, think clearly, adapt, and work
              with what&#8217;s available often determines success far more than perfect conditions
              ever will.
            </p>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="outdoors" />
    </>
  );
}
