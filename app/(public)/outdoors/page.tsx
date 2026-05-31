import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
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
      <PageHero
        eyebrow="Outside the Hospital"
        heading="The Things That Keep Me Grounded"
        collage={{ cartoon: "hiking-standing", blobVariant: 2, blobClass: "text-primary/10", doodle: "sun", doodleClass: "text-accent" }}
      >
        <p>
          When people hear &#8220;doctor,&#8221; they often imagine someone who spends all day
          thinking about medicine. I like medicine. I spend plenty of time thinking about it. But I
          don&#8217;t think a good life can be built from a single interest.
        </p>
      </PageHero>

      {/* Big scenic band */}
      <PlacedParallax area="outdoors.hero" height="lg" />

      {/* Making things */}
      <CollageRow
        heading="Making things"
        collage={{ cartoon: "plant", blobVariant: 3, blobClass: "text-accent/10", doodle: "sparkle" }}
      >
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
      </CollageRow>

      {/* Climbing */}
      <CollageRow
        heading="Climbing"
        mirror
        collage={{ photoArea: "outdoors.climbing", cartoon: "sports", blobVariant: 1, blobClass: "text-primary/10", doodle: "star", doodleClass: "text-accent" }}
      >
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
        <div className="font-serif text-xl text-text-base leading-relaxed border-l-2 border-accent pl-5">
          <p>Pay attention.</p>
          <p>Trust your partner.</p>
          <p>Stay present.</p>
          <p>Take the next step.</p>
        </div>
      </CollageRow>

      {/* Maisy */}
      <CollageRow
        heading="Maisy"
        collage={{ photoArea: "outdoors.maisy", cartoon: "petting-maisy", blobVariant: 2, blobClass: "text-accent/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          My rescue dog Maisy helps reinforce similar lessons. She spent the first years of her
          life as a street dog in Taiwan and arrived with understandable concerns about trusting
          humans.
        </p>
        <p>
          Earning that trust required patience, consistency, and letting progress happen on her
          timeline rather than mine.
        </p>
      </CollageRow>

      {/* Reflection */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="squiggle" size={90} strokeWidth={4} className="absolute right-[10%] top-10 text-fun-coral/60" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-4 text-text-base leading-relaxed">
            <Reveal>
              <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
                Medicine turns out to work much the same way.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lg">
                Health is rarely built in dramatic moments. More often it&#8217;s built through small,
                repeated actions practiced over time. The same is true for friendships. Relationships.
                Communities. And most worthwhile things in life.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Wilderness */}
      <CollageRow
        eyebrow="Wilderness"
        heading={<>Learning what matters when resources don&#8217;t exist</>}
        mirror
        collage={{ cartoon: "hiking-walking", blobVariant: 3, blobClass: "text-primary/10", doodle: "path", doodleClass: "text-accent" }}
      >
        <p>
          At 2 a.m. in the mountains of Colorado, our team received coordinates for a simulated
          plane crash. We had radios, headlamps, basic medical equipment, and whatever we could
          carry on our backs.
        </p>
        <div className="font-serif text-xl text-text-base leading-relaxed border-l-2 border-accent pl-5">
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
      </CollageRow>

      <DynamicSections pageSlug="outdoors" />
    </>
  );
}
