import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Medicine",
  description:
    "Surgery, trauma, burn care, and the case for whole-person family medicine. A physician's honest account of transition.",
  alternates: { canonical: `${BASE}/medicine` },
};

const pillars = [
  {
    title: "Whole-person care",
    body: "Family medicine sees the person, not just the problem. Every appointment is an opportunity to understand context — what someone's life looks like, what is making things harder, what is being overlooked.",
  },
  {
    title: "Prevention",
    body: "The most effective interventions often happen before the emergency. Helping someone understand their risk, change a behavior, or catch something early is some of the most important work in medicine.",
  },
  {
    title: "Continuity",
    body: "Knowing a patient over time — across years, across life changes, across diagnoses — changes everything about the quality of care. Trust is the most underappreciated clinical tool.",
  },
  {
    title: "Behavioral health",
    body: "Mental health and physical health are not separate systems. Family medicine is one of the best-positioned specialties to address both in the same relationship.",
  },
  {
    title: "Sustainable practice",
    body: "Physician burnout is a crisis. I think about how to practice medicine in a way that is sustainable over a career — for my own sake, and because burned-out physicians cannot give their best care.",
  },
];

export default function MedicinePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Medicine
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            A physician in progress
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            I trained in surgery. I am entering family medicine. That transition is not a
            contradiction — it is the most honest path toward the kind of physician I want to be.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Surgery section */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              What surgery gave me
            </h2>
            <p>
              Surgical training is genuinely hard. Not in the way people romanticize — not
              glamorously hard — but technically and emotionally demanding in ways that require
              sustained effort over years. I was grateful for every part of it.
            </p>
            <p>
              Surgery taught me to think clearly under pressure. To work efficiently with my hands.
              To make decisions in real time with incomplete information. To communicate
              precisely in high-stakes situations. To stay calm when things go wrong.
            </p>
            <p>
              I spent time in burn surgery, which is some of the most complex, multidisciplinary
              care in medicine — patients with severe injuries requiring weeks of intensive
              management across surgery, medicine, physical therapy, nutrition, psychiatry, and
              social work. It changed how I think about teams, systems, and what it means to truly
              care for someone.
            </p>
            <p>
              I also spent time in acute care surgery and the ICU. Trauma cases. Emergencies.
              People in the worst moments of their lives. This work demanded presence — full
              attention, every time.
            </p>
          </div>
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              Why family medicine
            </h2>
            <p>
              The transition to family medicine was not a failure or a retreat. It was a choice made
              from a position of clarity — after enough clinical experience to understand what I was
              choosing and what I was moving toward.
            </p>
            <p>
              I was increasingly drawn to the parts of care that happen before the operating room,
              and after. The conversations. The prevention. The long-term relationships. The
              management of chronic illness in the context of someone's actual life.
            </p>
            <p>
              I was drawn to continuity — to the idea of knowing a patient not as a case but as a
              person, over years. Surgery often means you meet someone in a crisis, fix what you
              can fix, and send them along. That has enormous value. But I wanted the other part too.
            </p>
            <p>
              Family medicine is, to me, the most complete version of what medicine can be: deeply
              human, technically demanding, and built on the premise that health is shaped by the
              whole context of a person's life.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-10">
            What I care about in medicine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="bg-surface border border-border rounded-lg p-6 shadow-card">
                <h3 className="font-serif text-lg font-semibold text-text-base mb-3">{p.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing thought */}
      <section className="section-y container-content">
        <blockquote className="border-l-4 border-accent pl-6 max-w-2xl">
          <p className="text-xl font-serif italic text-text-base leading-relaxed mb-3">
            "The good physician treats the disease; the great physician treats the patient who has
            the disease."
          </p>
          <cite className="text-sm text-text-muted not-italic">— William Osler</cite>
        </blockquote>
      </section>
      <DynamicSections pageSlug="medicine" />
    </>
  );
}
