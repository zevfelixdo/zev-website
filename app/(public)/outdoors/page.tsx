import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Outdoors & Wilderness",
  description:
    "Rock climbing, trad climbing, Yosemite, wilderness medicine, and the lessons the mountains teach.",
  alternates: { canonical: `${BASE}/outdoors` },
};

const lessons = [
  {
    title: "Risk assessment",
    body: "In climbing and in medicine, you are constantly assessing risk: What are the hazards? What is the probability? What is the consequence? How prepared am I to manage it? Outdoors, this is life-or-death. In medicine, it often is too.",
  },
  {
    title: "Preparation and improvisation",
    body: "The backcountry rewards people who prepare well and punishes those who do not. But it also requires real-time problem solving when things do not go as planned. The same is true in clinical care.",
  },
  {
    title: "Team communication",
    body: "A climbing team communicates constantly — checking conditions, confirming plans, calling out hazards. In medicine, clear team communication is one of the most important safety behaviors. Both require speaking up when something is wrong.",
  },
  {
    title: "Humility",
    body: "The mountains will make you humble, one way or another. The best climbers know what they do not know. The best physicians do too.",
  },
  {
    title: "Calm under pressure",
    body: "When something goes wrong on a route, panic is not an option. You breathe, assess, and move deliberately. That capacity — to stay regulated in a crisis — is one of the most transferable things I have learned outdoors.",
  },
];

export default function OutdoorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Outdoors &amp; Wilderness
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            What the mountains teach
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Rock climbing, wilderness medicine, and the kind of problem-solving that only happens
            when you are far from a cell signal and the weather is changing.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Climbing */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">Climbing</h2>
            <p>
              I started climbing in California and have been at it for years. I climb trad and top
              rope — mostly in Yosemite, the Sierra Nevada, and around the California ranges. Yosemite
              in particular is a place I return to again and again. It is humbling and clarifying in
              equal measure.
            </p>
            <p>
              Trad climbing involves placing your own protection as you ascend — the gear you clip
              into is the gear you placed yourself, on the way up. There is a particular quality of
              attention this requires. You are not just moving through space; you are reading it
              continuously, making decisions about risk and consequence with every placement.
            </p>
            <p>
              I climb because it demands full presence. There is no multitasking on a trad route. It
              is one of the few activities in modern life where I am completely in the moment —
              not because I am trying to be, but because the alternative is unacceptable.
            </p>
          </div>
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              Wilderness medicine
            </h2>
            <p>
              Wilderness medicine is the practice of providing medical care in remote or austere
              environments — far from hospitals, definitive care, and reliable supplies. It requires
              the same clinical reasoning as conventional medicine, but with drastically fewer
              resources and the additional challenge of evacuation and environmental factors.
            </p>
            <p>
              I have studied wilderness medicine formally and apply those skills in the field. The
              discipline has made me a better physician — not because the specific skills transfer
              directly to clinical settings, but because the mindset does.
            </p>
            <p>
              In the wilderness, you cannot order a CT scan. You cannot call a consultant. You have
              to reason carefully from the information available, make a decision, and take
              responsibility for it. That process of disciplined clinical reasoning is the same one
              I practice every day in medicine, in a different context.
            </p>
          </div>
        </div>
      </section>

      {/* Lessons grid */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-10">
            What outdoor experience teaches about medicine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((l) => (
              <div key={l.title} className="bg-surface border border-border rounded-lg p-6 shadow-card">
                <h3 className="font-serif text-lg font-semibold text-text-base mb-3">{l.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yosemite section */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-5">Yosemite</h2>
          <div className="space-y-4 text-text-base leading-relaxed">
            <p>
              There is something specific about Yosemite that draws climbers back over and over. It
              is not just the scale — though the scale is extraordinary. It is the granite. The
              quality of friction. The particular way the light moves across the valley in the late
              afternoon.
            </p>
            <p>
              I have camped there in all seasons. I have climbed when the weather was cooperative
              and bailed when it was not. I have spent evenings in Camp 4 talking with strangers who
              became friends. I have made mistakes I learned from and a few good decisions I was
              proud of.
            </p>
            <p>
              Yosemite is where I feel most like myself. It is a good place to return to when
              medicine gets loud or demanding or confusing. The valley does not care about any of
              that, and somehow that is exactly what I need.
            </p>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="outdoors" />
    </>
  );
}
