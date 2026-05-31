import { DynamicSections } from "@/components/public/DynamicSections";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Technology Should Serve People",
  description:
    "Not anti-technology, but deeply interested in it. Healthcare is not fundamentally a technology problem. It's a human problem, and the best tools create more connection, not less.",
  alternates: { canonical: `${BASE}/technology` },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        heading="Technology Should Serve People"
        collage={{ photoArea: "technology.portrait", cartoon: "laptop", blobVariant: 1, blobClass: "text-primary/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <p>
          I grew up alongside the internet. I built websites before I became a physician. I helped
          create one of the earliest digital detox movements. I conduct research involving
          telemedicine. I use AI tools regularly.
        </p>
      </PageHero>

      {/* Narrative */}
      <CollageRow
        mirror
        collage={{ cartoon: "sitting-w-laptop", blobVariant: 2, blobClass: "text-accent/10", doodle: "star", doodleClass: "text-accent" }}
      >
        <p className="font-serif text-2xl text-text-base leading-snug">
          In other words, I am not anti-technology. I am deeply interested in technology.
        </p>
        <p>
          I am simply skeptical of technologies that quietly become substitutes for the things they
          were supposed to support.
        </p>
        <p>
          My brother Levi used to talk about reclaiming language from the tech industry. He
          wasn&#8217;t opposed to innovation. He believed powerful tools should be built with
          responsibility and intention.
        </p>
        <p>That idea continues to influence how I think about healthcare.</p>
        <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-2 border-accent pl-5">
          <p>Technology can improve access.</p>
          <p>It can reduce barriers.</p>
          <p>It can connect patients to care that would otherwise be unavailable.</p>
          <p>
            It can save time, reduce friction, and help people receive support when and where they
            need it.
          </p>
        </div>
        <p className="font-serif text-2xl text-text-base leading-snug">
          But healthcare is not fundamentally a technology problem. It is a human problem.
        </p>
        <p>
          The best tools make it easier for clinicians to listen. They make it easier for patients
          to understand. They create more connection, not less.
        </p>
      </CollageRow>

      {/* Closing question */}
      <CollageRow
        tinted
        collage={{ photoArea: "technology.side", cartoon: "ultrasound", blobVariant: 3, blobClass: "text-primary/10", doodle: "loops", doodleClass: "text-accent" }}
      >
        <p>
          My interest in medicine, telemedicine, digital wellness, and emerging technologies all
          comes back to a simple question:
        </p>
        <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          <span className="relative inline-block">
            Does this help people live better lives?
            <Doodle name="underline" stretch strokeWidth={2} className="absolute -bottom-2 left-0 h-3 w-full text-accent/70" />
          </span>
        </p>
        <p>
          If the answer is yes, I&#8217;m interested. If it creates more noise than value,
          I&#8217;m not.
        </p>
        <p>
          The future of healthcare will involve technology. I just hope it remains deeply human.
        </p>
      </CollageRow>

      <DynamicSections pageSlug="technology" />
    </>
  );
}
