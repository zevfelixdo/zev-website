import { DynamicSections } from "@/components/public/DynamicSections";
import { HeroWithPortrait } from "@/components/public/HeroWithPortrait";
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
      {/* Hero */}
      <section className="section-y container-content">
        <HeroWithPortrait area="medicine.portrait">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Family Medicine
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Why Family Medicine?
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Family Medicine wasn&#8217;t a backup plan. It was the answer to a question that took
            years to formulate.
          </p>
        </HeroWithPortrait>
      </section>

      <div className="border-t border-border" />

      {/* Two movements */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              Drawn to complexity
            </h2>
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
          </div>
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              The space before crisis
            </h2>
            <p>
              The longer I trained, the more interested I became in the space before crisis. The
              years before diabetes. The months before burnout. The habits, relationships,
              environments, and daily decisions that quietly shape health over decades.
            </p>
            <p>Family Medicine allows me to care for the whole picture.</p>
          </div>
        </div>
      </section>

      {/* The whole picture */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-4 font-serif text-2xl text-text-base leading-snug">
            <p>A sore knee and the person attached to it.</p>
            <p>High blood pressure and the life producing it.</p>
            <p>A diagnosis and the family trying to navigate it.</p>
          </div>
        </div>
      </section>

      {/* Breadth + closing */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-lg text-text-base leading-relaxed">
          <p>
            I love the breadth of Family Medicine. One visit might involve preventive care. The next
            a procedure. The next behavioral health. The next a conversation about grief, sleep,
            stress, parenting, or aging.
          </p>
          <p className="font-serif text-xl">
            No two days look exactly alike because no two lives look exactly alike.
          </p>
          <p>
            Family Medicine allows me to combine everything that first drew me toward medicine:
            relationships, problem-solving, communication, prevention, hands-on care, systems
            thinking, and helping people build healthier lives that actually fit the realities of
            being human.
          </p>
        </div>
      </section>
      <DynamicSections pageSlug="medicine" />
    </>
  );
}
