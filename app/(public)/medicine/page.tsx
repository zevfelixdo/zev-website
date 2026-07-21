import type { Metadata } from "next";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

// Per-page SEO sourced from the admin (Pages → Medicine → title/description),
// falling back to the original values so nothing regresses if unset.
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "medicine",
    path: "/medicine",
    fallbackTitle: "Why Family Medicine?",
    fallbackDescription:
      "Family Medicine wasn’t a backup plan. It was the answer to a question that took years to formulate, about the space before crisis and caring for the whole picture.",
  });
}

export default async function MedicinePage() {
  // Editable copy from the admin (Pages → Medicine → Page text content).
  // Every field falls back to the original text, so the design is unchanged
  // until an admin edits it.
  const c = await getPageContent("medicine");
  const f = (key: string, fallback: string) => field(c, key, fallback);

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "Family Medicine")}
        heading={f("hero.heading", "Why Family Medicine?")}
        collage={{ photoArea: "medicine.portrait", cartoon: "treating-person", blobVariant: 1, doodle: "sparkle" }}
      >
        <p>
          {f("hero.lead", "Family Medicine wasn’t a backup plan. It was the answer to a question that took years to formulate.")}
        </p>
      </PageHero>

      {/* Drawn to complexity */}
      <CollageRow
        heading={f("c1.heading", "Drawn to complexity")}
        mirror
        collage={{ cartoon: "xray", blobVariant: 2, doodle: "star" }}
      >
        <p>
          {f("c1.p1", "During medical school and surgical training, I was drawn to complexity. Trauma. Critical care. Burn surgery. Procedures. The moments when teams come together under pressure to solve difficult problems.")}
        </p>
        <p>{f("c1.p2", "I still love those things.")}</p>
        <p>
          {f("c1.p3", "But the moments I carried home were usually different. A patient finally ready to quit smoking. A family trying to understand a difficult diagnosis. A conversation that changed the trajectory of someone’s health long before they ever needed an operation.")}
        </p>
      </CollageRow>

      {/* The space before crisis */}
      <CollageRow
        heading={f("c2.heading", "The space before crisis")}
        collage={{ cartoon: "older-gentleman", blobVariant: 3, doodle: "heart" }}
      >
        <p>
          {f("c2.p1", "The longer I trained, the more interested I became in the space before crisis. The years before diabetes. The months before burnout. The habits, relationships, environments, and daily decisions that quietly shape health over decades.")}
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          {f("c2.quote", "Family Medicine allows me to care for the whole picture.")}
        </p>
      </CollageRow>

      {/* The whole picture */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="sparkle" size={34} float className="absolute right-[12%] top-10 text-fun-sun" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-4 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
            <Reveal><p>{f("band.l1", "A sore knee and the person attached to it.")}</p></Reveal>
            <Reveal delay={90}><p>{f("band.l2", "High blood pressure and the life producing it.")}</p></Reveal>
            <Reveal delay={180}><p>{f("band.l3", "A diagnosis and the family trying to navigate it.")}</p></Reveal>
          </div>
        </div>
      </section>

      {/* Breadth + closing */}
      <CollageRow
        mirror
        collage={{ cartoon: "talking-to-kid", blobVariant: 1, doodle: "loops" }}
      >
        <p>
          {f("close.p1", "I love the breadth of Family Medicine. One visit might involve preventive care. The next a procedure. The next behavioral health. The next a conversation about grief, sleep, stress, parenting, or aging.")}
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          {f("close.quote", "No two days look exactly alike because no two lives look exactly alike.")}
        </p>
        <p>
          {f("close.p2", "Family Medicine allows me to combine everything that first drew me toward medicine: relationships, problem-solving, communication, prevention, hands-on care, systems thinking, and helping people build healthier lives that actually fit the realities of being human.")}
        </p>
      </CollageRow>

      <DynamicSections pageSlug="medicine" />
    </>
  );
}
