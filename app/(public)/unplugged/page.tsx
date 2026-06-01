import Link from "next/link";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import { PlacedGallery } from "@/components/public/PlacedGallery";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "unplugged",
    path: "/unplugged",
    fallbackTitle: "Putting Down the Phone",
    fallbackDescription:
      "Before medicine, I helped build Digital Detox and Camp Grounded with my brother Levi: screen-free retreats where adults set down their phones and remembered how to be present.",
  });
}

const press = [
  { outlet: "The New York Times", url: "https://www.nytimes.com/2013/07/07/fashion/a-trip-to-camp-to-break-a-tech-addiction.html" },
  { outlet: "The New Yorker", url: "https://www.newyorker.com/tech/annals-of-technology/into-the-woods-and-away-from-technology" },
  { outlet: "Forbes", url: "https://www.forbes.com/sites/ellenhuet/2014/06/20/camp-grounded-digital-detox/" },
  { outlet: "CBS News", url: "https://www.cbsnews.com/news/camp-grounded-digital-detox-summer-camp-for-grown-ups/" },
  { outlet: "Al Jazeera", url: "https://www.aljazeera.com/video/al-jazeera-correspondent/2014/11/7/camp-grounded-an-analogue-adventure" },
  { outlet: "TechCrunch", url: "https://techcrunch.com/2019/11/21/camp-grounded-returns/" },
];

export default function UnpluggedPage() {
  return (
    <>
      <PageHero
        eyebrow="Camp Grounded & Digital Detox"
        heading="Putting Down the Phone"
        collage={{ cartoon: "high-five", blobVariant: 1, blobClass: "text-primary/10", doodle: "star", doodleClass: "text-accent" }}
      >
        <p>
          Imagine a circle of adults gathered under towering redwoods, their phones locked away,
          their attention fully present. For five years, that was my work.
        </p>
      </PageHero>

      {/* Hero image (renders only if assigned) */}
      <section className="container-content">
        <PlacedImage area="unplugged.hero" aspect="3/2" priority sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      {/* The origin */}
      <CollageRow
        mirror
        collage={{ cartoon: "sitting", blobVariant: 2, blobClass: "text-accent/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <p>
          Before I ever set foot in a hospital, I helped build Digital Detox and Camp Grounded
          alongside my brother Levi and a group of remarkably creative friends.
        </p>
        <p>
          Camp Grounded was a summer camp for adults. No phones. No screens. No work talk. No last
          names or job titles. For a few days at a time, a few hundred people set all of it down in
          the redwoods of Northern California and remembered how to be present.
        </p>
        <p>
          Over those years, our small team delivered 17 camps and 12 events for more than 3,000
          people across the country.
        </p>
      </CollageRow>

      {/* Around the fire */}
      <CollageRow
        tinted
        collage={{ cartoon: "teaching", blobVariant: 3, blobClass: "text-primary/10", doodle: "sun", doodleClass: "text-accent" }}
      >
        <p className="font-serif text-2xl text-text-base leading-snug">
          The idea sounds simple. What happened was not.
        </p>
        <p>
          People arrived carrying the same invisible weight: full calendars, overflowing inboxes,
          careers moving forward, and a quiet exhaustion underneath it all.
        </p>
        <p>
          Around the fire, they spoke openly about loneliness, burnout, and hope. They made
          things with their hands. They sang. They slept. They reconnected with parts of
          themselves that had been buried beneath notifications.
        </p>
        <p>
          I found myself listening closely, noticing what mattered most to each person, and
          helping them shape small habits that actually stuck.
        </p>
        <div className="font-serif text-xl text-text-base leading-snug border-l-2 border-accent pl-5">
          <p>
            It started with one question:{" "}
            <Link href="/philosophy" className="text-primary underline underline-offset-2 hover:opacity-80">
              What matters to you?
            </Link>
          </p>
        </div>
      </CollageRow>

      {/* Levi — reverent, cartoon-free */}
      <section className="relative section-y container-content overflow-hidden">
        <Doodle name="star" size={24} className="absolute right-[14%] top-10 text-fun-sky/50" />
        <div className="max-w-2xl space-y-5 text-lg text-text-base leading-relaxed relative">
          <Reveal><h2 className="font-serif text-display-sm text-text-base">My brother Levi</h2></Reveal>
          <Reveal delay={80}><p>None of this would have existed without my brother Levi.</p></Reveal>
          <Reveal delay={120}>
            <p>
              Levi believed technology should be built with intention. He used to talk about
              reclaiming language from the tech industry: not rejecting innovation, but insisting that
              powerful tools serve people rather than the other way around. That idea still shapes how
              I think about{" "}
              <Link href="/technology" className="text-primary underline underline-offset-2 hover:opacity-80">
                technology in medicine
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p>
              He was diagnosed with glioblastoma, and he died in 2017.{" "}
              <a
                href="https://www.nytimes.com/2017/01/12/us/obituary-levi-felix-digital-detox.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                The New York Times wrote his obituary.
              </a>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p>
              Building something joyful and deeply human alongside him, and later walking with him
              through his illness, changed what I notice about people, presence, and care. It is a
              large part of why I became a doctor.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What this has to do with medicine */}
      <CollageRow
        tinted
        mirror
        heading="What this has to do with medicine"
        collage={{ cartoon: "talking-to-nurse", blobVariant: 1, blobClass: "text-accent/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          That practice, beginning with{" "}
          <span className="italic">What matters to you?</span> and building from there, became the
          foundation of the{" "}
          <Link href="/medicine" className="text-primary underline underline-offset-2 hover:opacity-80">
            physician I want to be
          </Link>
          .
        </p>
        <p>
          I still believe a good prescription can include play, social connection, time outdoors,
          and a healthier relationship with screens, right alongside medication and procedures.
        </p>
        <p>
          In a world of constant connectivity, I want to help people protect their attention,
          their mood, and their relationships. Not with guilt, and not with all-or-nothing rules,
          but with small, sustainable steps. It is the same{" "}
          <Link href="/balance" className="text-primary underline underline-offset-2 hover:opacity-80">
            balance
          </Link>{" "}
          I try to build into my own life.
        </p>
      </CollageRow>

      {/* Scenes from camp — interactive masonry gallery with lightbox */}
      <section className="section-y container-content">
        <Reveal>
          <h2 className="font-serif text-display-sm text-text-base mb-6">Scenes from camp</h2>
        </Reveal>
        <Reveal delay={80}>
          <PlacedGallery
            areas={["unplugged.camp1", "unplugged.camp2", "unplugged.camp3"]}
            layout="masonry"
            columns={3}
            caption="Tap any photo to view it full-screen."
          />
        </Reveal>
      </section>

      {/* Press */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-serif text-display-sm text-text-base mb-6">
              Camp Grounded in the press
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <ul className="space-y-3">
              {press.map((p) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-anim text-primary hover:opacity-80 transition-opacity"
                  >
                    {p.outlet}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <DynamicSections pageSlug="unplugged" />
    </>
  );
}
