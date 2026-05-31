import { DynamicSections } from "@/components/public/DynamicSections";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Why Family Medicine?",
  description:
    "Family Medicine wasn't a backup plan. It was the answer to a question that took years to formulate, about the space before crisis and caring for the whole picture.",
  alternates: { canonical: `${BASE}/medicine` },
};

export default function MedicinePage() {
  return (
    <>
      <PageHero
        eyebrow="Family Medicine"
        heading="Why Family Medicine?"
        collage={{ photoArea: "medicine.portrait", cartoon: "treating-person", blobVariant: 1, blobClass: "text-primary/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <p>
          Family Medicine wasn&#8217;t a backup plan. It was the answer to a question that took
          years to formulate.
        </p>
      </PageHero>

      {/* Drawn to complexity */}
      <CollageRow
        heading="Drawn to complexity"
        mirror
        collage={{ cartoon: "scrubbing", blobVariant: 2, blobClass: "text-primary/10", doodle: "star", doodleClass: "text-accent" }}
      >
        <p>
          During medical school and surgical training, I was drawn to complexity. Trauma.
          Critical care. Burn surgery. Procedures. The moments when teams come together under
          pressure to solve difficult problems.
        </p>
        <p>I still love those things.</p>
        <p>
          But the moments I carried home were usually different. A patient finally ready to quit
          smoking. A family trying to understand a difficult diagnosis. A conversation that
          changed the trajectory of someone&#8217;s health long before they ever needed an
          operation.
        </p>
      </CollageRow>

      {/* The space before crisis */}
      <CollageRow
        heading="The space before crisis"
        collage={{ cartoon: "older-gentleman", blobVariant: 3, blobClass: "text-accent/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          The longer I trained, the more interested I became in the space before crisis. The
          years before diabetes. The months before burnout. The habits, relationships,
          environments, and daily decisions that quietly shape health over decades.
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          Family Medicine allows me to care for the whole picture.
        </p>
      </CollageRow>

      {/* The whole picture */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="sparkle" size={34} float className="absolute right-[12%] top-10 text-fun-sun" />
        <div className="container-content relative">
          <div className="max-w-2xl space-y-4 font-serif text-2xl sm:text-3xl text-text-base leading-snug">
            <Reveal><p>A sore knee and the person attached to it.</p></Reveal>
            <Reveal delay={90}><p>High blood pressure and the life producing it.</p></Reveal>
            <Reveal delay={180}><p>A diagnosis and the family trying to navigate it.</p></Reveal>
          </div>
        </div>
      </section>

      {/* Breadth + closing */}
      <CollageRow
        mirror
        collage={{ cartoon: "talking-to-kid", blobVariant: 1, blobClass: "text-primary/10", doodle: "loops", doodleClass: "text-accent" }}
      >
        <p>
          I love the breadth of Family Medicine. One visit might involve preventive care. The next
          a procedure. The next behavioral health. The next a conversation about grief, sleep,
          stress, parenting, or aging.
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          No two days look exactly alike because no two lives look exactly alike.
        </p>
        <p>
          Family Medicine allows me to combine everything that first drew me toward medicine:
          relationships, problem-solving, communication, prevention, hands-on care, systems
          thinking, and helping people build healthier lives that actually fit the realities of
          being human.
        </p>
      </CollageRow>

      <DynamicSections pageSlug="medicine" />
    </>
  );
}
