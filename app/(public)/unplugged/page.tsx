import Link from "next/link";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Putting Down the Phone",
  description:
    "Before medicine, I helped build Digital Detox and Camp Grounded with my brother Levi: screen-free retreats where adults set down their phones and remembered how to be present.",
  alternates: { canonical: `${BASE}/unplugged` },
};

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
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Camp Grounded &amp; Digital Detox
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Putting Down the Phone
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Imagine a circle of adults gathered under towering redwoods, their phones locked away,
            their attention fully present. For five years, that was my work.
          </p>
        </div>
      </section>

      {/* Hero image (renders only if assigned) */}
      <section className="container-content">
        <PlacedImage area="unplugged.hero" aspect="3/2" priority sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      <div className="border-t border-border mt-12" />

      {/* The origin */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
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
        </div>
      </section>

      {/* Around the fire */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
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
            <div className="font-serif text-xl text-text-base leading-snug border-l-4 border-accent pl-5">
              <p>
                It started with one question:{" "}
                <Link href="/philosophy" className="text-primary underline underline-offset-2 hover:opacity-80">
                  What matters to you?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Levi */}
      <section className="section-y container-content">
        <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
          <h2 className="font-serif text-3xl font-semibold text-text-base">My brother Levi</h2>
          <p>None of this would have existed without my brother Levi.</p>
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
          <p>
            Building something joyful and deeply human alongside him, and later walking with him
            through his illness, changed what I notice about people, presence, and care. It is a
            large part of why I became a doctor.
          </p>
        </div>
      </section>

      {/* What it has to do with medicine */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <div className="max-w-2xl space-y-5 text-text-base leading-relaxed">
            <h2 className="font-serif text-3xl font-semibold text-text-base">
              What this has to do with medicine
            </h2>
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
          </div>
        </div>
      </section>

      {/* Scenes from camp (each tile renders only if assigned) */}
      <section className="section-y container-content">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <PlacedImage area="unplugged.camp1" aspect="1/1" sizes="(min-width:640px) 33vw, 50vw" />
          <PlacedImage area="unplugged.camp2" aspect="1/1" sizes="(min-width:640px) 33vw, 50vw" />
          <PlacedImage area="unplugged.camp3" aspect="1/1" sizes="(min-width:640px) 33vw, 100vw" className="col-span-2 sm:col-span-1" />
        </div>
      </section>

      {/* Press */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-text-base mb-6">
            Camp Grounded in the press
          </h2>
          <ul className="space-y-3">
            {press.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:opacity-80 transition-opacity underline underline-offset-2"
                >
                  {p.outlet}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <DynamicSections pageSlug="unplugged" />
    </>
  );
}
