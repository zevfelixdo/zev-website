import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Unplugged",
  description:
    "Co-founding Digital Detox and Camp Grounded with my brother. Running summer camps for adults built around disconnecting from devices and reconnecting with people.",
  alternates: { canonical: `${BASE}/unplugged` },
};

export default function UnpluggedPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Unplugged
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Digital Detox &amp; Camp Grounded
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            My brother and I started a company to help people put down their phones and reconnect
            with themselves, each other, and the world around them. What we discovered changed how
            I think about everything.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Origin */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">The origin</h2>
            <p>
              My brother Levi and I started Digital Detox in 2012 with a simple premise: most
              people know that they are spending too much time on their devices, and most of them
              feel helpless to change it. We wanted to create a space where they could.
            </p>
            <p>
              Camp Grounded was our flagship program — a weekend summer camp for adults, held in
              the California redwoods. No phones. No laptops. No last names. No job titles. Just
              people, food, music, games, creativity, and time.
            </p>
            <p>
              We ran the camps for several years and served thousands of people — entrepreneurs,
              therapists, teachers, nurses, parents, artists. What they had in common was a quiet
              sense that something important had gotten buried under the noise of their connected
              lives, and a hope that a few days without it might help them find it again.
            </p>
            <p>
              For most of them, it did.
            </p>
          </div>
          <div className="space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">What we learned</h2>
            <p>
              Running those camps was one of the most educational experiences of my life. Not
              because of what we taught — but because of what people showed us when they finally
              slowed down.
            </p>
            <p>
              People are desperate for permission to rest. Permission to be silly. Permission to
              talk to a stranger without an agenda. Permission to feel something fully, without
              photographing it first.
            </p>
            <p>
              That lesson — about what people are actually hungry for — has never left me. It is
              embedded in how I approach medicine. Every patient who walks into a room carries
              their version of that hunger.
            </p>
            <p>
              Presence is not a luxury. It is the whole point.
            </p>
          </div>
        </div>
      </section>

      {/* Loss & meaning */}
      <section className="section-y bg-surface-alt">
        <div className="container-content max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-6">
            My brother
          </h2>
          <div className="space-y-5 text-text-base leading-relaxed">
            <p>
              Levi became ill, and he died. I am not going to say more than that here, because
              some things do not compress well into a website.
            </p>
            <p>
              What I will say is that his illness and death changed my understanding of medicine —
              specifically of what it means to receive care, what it means to give it, and what it
              means to be with someone in the parts of life that are not going to get better.
            </p>
            <p>
              I was a medical student and then a surgical resident while he was sick. The experience
              of being a caregiver to someone I loved, while also learning to be a physician, gave
              me a kind of double vision I would not trade for anything. I saw medicine from both
              sides of the bed, and I understood — more viscerally than any textbook could teach —
              what it costs to be a patient, and what it means to have a physician who actually
              shows up.
            </p>
            <p>
              Grief changed what I want from my work. It made me less interested in speed and more
              interested in depth. Less interested in procedures and more interested in people. It
              pushed me, eventually, toward family medicine — not away from something, but toward
              something.
            </p>
          </div>
        </div>
      </section>

      {/* Connection to medicine */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-6">
            What this has to do with medicine
          </h2>
          <div className="space-y-5 text-text-base leading-relaxed">
            <p>
              Technology is not going anywhere. Neither is the human need for connection. These two
              facts are in some tension with each other, and that tension shows up in medicine
              constantly: physicians staring at screens during appointments, patients who Google
              their symptoms before they call, electronic health records that were designed for
              billing rather than communication.
            </p>
            <p>
              I think about this a lot. I think about how to use technology in medicine as a tool
              rather than a substitute. How to make the most of a fifteen-minute appointment. How to
              be present when presence is what someone actually needs.
            </p>
            <p>
              Running Camp Grounded taught me that the hunger for human connection is enormous and
              underserved. That is not a political statement — it is a clinical finding, and a
              personal one.
            </p>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="unplugged" />
    </>
  );
}
