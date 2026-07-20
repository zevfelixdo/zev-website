import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedParallax } from "@/components/public/PlacedParallax";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "outdoors",
    path: "/outdoors",
    fallbackTitle: "The Things That Keep Me Grounded",
    fallbackDescription:
      "Making things, rock climbing, a rescue dog named Maisy, and wilderness medicine: the life outside the hospital that makes the work inside it possible.",
  });
}

export default async function OutdoorsPage() {
  const c = await getPageContent("outdoors");
  const f = (key: string, fallback: string) => field(c, key, fallback);
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "Outside the Hospital")}
        heading={f("hero.heading", "The Things That Keep Me Grounded")}
        collage={{ cartoon: "outdoor-back", blobVariant: 2, blobClass: "text-primary/10", doodle: "sun", doodleClass: "text-accent" }}
      >
        <p>
          {f("hero.lead", "When people hear “doctor,” they often imagine someone who spends all day thinking about medicine. I like medicine. I spend plenty of time thinking about it. But I don’t think a good life can be built from a single interest.")}
        </p>
      </PageHero>

      {/* Big scenic band — floating quote (editable in admin → Page text content) */}
      <PlacedParallax
        area="outdoors.hero"
        height="lg"
        heading={f("parallax.quote", "Out here, what matters gets very clear.")}
        subheading={f("parallax.caption", "Yosemite Valley")}
      />

      {/* Making things */}
      <CollageRow
        heading={f("make.heading", "Making things")}
        collage={{ cartoon: "maisy-running", blobVariant: 3, blobClass: "text-accent/10", doodle: "sparkle" }}
      >
        <p>
          {f("make.p1", "Outside the hospital, you’ll usually find me making something. Sometimes it’s a loaf of bread. Sometimes it’s fresh pasta. Sometimes it’s a woodworking project that takes three times longer than expected because I convinced myself I could build it without reading the instructions.")}
        </p>
        <p>
          {f("make.p2", "I love understanding how things work. Furniture. Gardens. Knitting patterns. Human bodies. They’re all systems with their own logic and constraints.")}
        </p>
      </CollageRow>

      {/* Climbing */}
      <CollageRow
        heading={f("climb.heading", "Climbing")}
        mirror
        collage={{ photoArea: "outdoors.climbing", cartoon: "sports", blobVariant: 1, blobClass: "text-primary/10", doodle: "star", doodleClass: "text-accent" }}
      >
        <p>
          {f("climb.p1", "I also spend as much time as possible outside. Rock climbing has shaped how I think in ways I didn’t expect when I first walked into a climbing gym in Oakland more than a decade ago.")}
        </p>
        <p>
          {f("climb.p2", "Climbing rewards preparation, patience, communication, trust, and humility. Yosemite remains one of my favorite places in the world because it strips away distractions and makes your priorities very clear.")}
        </p>
        <div className="font-serif text-xl text-text-base leading-relaxed border-l-2 border-accent pl-5">
          {lines(f("climb.list", "Pay attention.\nTrust your partner.\nStay present.\nTake the next step.")).map((it, i) => (
            <p key={i}>{it}</p>
          ))}
        </div>
      </CollageRow>

      {/* Maisy */}
      <CollageRow
        heading={f("maisy.heading", "Maisy")}
        collage={{ photoArea: "outdoors.maisy", cartoon: "maisy-standing", blobVariant: 2, blobClass: "text-accent/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          {f("maisy.p1", "My rescue dog Maisy helps reinforce similar lessons. She spent the first years of her life as a street dog in Taiwan and arrived with understandable concerns about trusting humans.")}
        </p>
        <p>
          {f("maisy.p2", "Earning that trust required patience, consistency, and letting progress happen on her timeline rather than mine.")}
        </p>
      </CollageRow>

      {/* Reflection */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="squiggle" size={90} strokeWidth={4} className="absolute right-[10%] top-10 text-fun-coral/60" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-4 text-text-base leading-relaxed">
            <Reveal>
              <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
                {f("refl.quote", "Medicine turns out to work much the same way.")}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lg">
                {f("refl.p1", "Health is rarely built in dramatic moments. More often it’s built through small, repeated actions practiced over time. The same is true for friendships. Relationships. Communities. And most worthwhile things in life.")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Wilderness */}
      <CollageRow
        eyebrow={f("wild.eyebrow", "Wilderness")}
        heading={f("wild.heading", "Learning what matters when resources don’t exist")}
        mirror
        collage={{ cartoon: "hiking-walking", blobVariant: 3, blobClass: "text-primary/10", doodle: "path", doodleClass: "text-accent" }}
      >
        <p>
          {f("wild.p1", "At 2 a.m. in the mountains of Colorado, our team received coordinates for a simulated plane crash. We had radios, headlamps, basic medical equipment, and whatever we could carry on our backs.")}
        </p>
        <div className="font-serif text-xl text-text-base leading-relaxed border-l-2 border-accent pl-5">
          {lines(f("wild.list", "No CT scanner.\nNo trauma bay.\nNo consultant down the hall.\nNo convenient backup plan.")).map((it, i) => (
            <p key={i}>{it}</p>
          ))}
        </div>
        <p>{f("wild.p2", "Just terrain, weather, teamwork, and judgment.")}</p>
        <p>
          {f("wild.p3", "Wilderness medicine fascinated me because it removes the illusion that more equipment automatically creates better decisions. In austere environments, preparation matters. Communication matters. Adaptability matters. Leadership matters.")}
        </p>
        <p>
          {f("wild.p4", "The principles aren’t all that different from everyday life. Things rarely go according to plan. Resources are limited. Uncertainty is unavoidable. People still need help.")}
        </p>
        <p>
          {f("wild.p5", "Those experiences reinforced something I value deeply: expertise matters, but resourcefulness matters too. The ability to stay calm, think clearly, adapt, and work with what’s available often determines success far more than perfect conditions ever will.")}
        </p>
      </CollageRow>

      <DynamicSections pageSlug="outdoors" />
    </>
  );
}
