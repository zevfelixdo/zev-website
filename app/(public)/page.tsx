import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, Mountain, Heart, PenLine, Scale, Cpu, Hammer, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { DynamicSections } from "@/components/public/DynamicSections";
import { PlacedImage } from "@/components/public/PlacedImage";
import { HeroWithPortrait } from "@/components/public/HeroWithPortrait";
import { SmartImage } from "@/components/public/SmartImage";
import { getPlacements } from "@/lib/placements";
import { ScrollReveal } from "@/components/public/ScrollReveal";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "Zev Felix: Medicine, Storytelling, and the Art of Staying Human",
  description:
    "Family Medicine resident, former Camp Grounded co-founder, climber, and maker. A lifelong student of how people heal, connect, and build meaningful lives.",
  alternates: { canonical: BASE },
};

const navCards = [
  {
    label: "About",
    href: "/about",
    icon: Heart,
    area: "home.card.about",
    description: "The long way to Family Medicine: film, camp, surgery, and a dog from Taiwan.",
  },
  {
    label: "Family Medicine",
    href: "/medicine",
    icon: Stethoscope,
    area: "home.card.medicine",
    description: "Why I chose it, and what it means to care for the space before crisis.",
  },
  {
    label: "Balance",
    href: "/balance",
    icon: Scale,
    area: "home.card.balance",
    description: "Why balance is not the opposite of ambition.",
  },
  {
    label: "Technology",
    href: "/technology",
    icon: Cpu,
    area: "home.card.technology",
    description: "Why the best tools create more connection, not less.",
  },
  {
    label: "Outside the Hospital",
    href: "/outdoors",
    icon: Mountain,
    area: "home.card.outdoors",
    description: "Making things, climbing, Maisy, and wilderness medicine.",
  },
  {
    label: "Projects",
    href: "/work",
    icon: Hammer,
    area: "home.card.projects",
    description: "Camp Grounded, Digital Detox, and building things that bring people together.",
  },
  {
    label: "Philosophy of Care",
    href: "/philosophy",
    icon: Compass,
    area: "home.card.philosophy",
    description: "What matters to you? The question that changes everything.",
  },
  {
    label: "Writing",
    href: "/writing",
    icon: PenLine,
    area: "home.card.writing",
    description: "Essays and notes on medicine, technology, and living well.",
  },
];

export default async function HomePage() {
  const cardImages = await getPlacements(navCards.map((c) => c.area));
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <HeroWithPortrait area="home.portrait">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Physician · Storyteller · Builder
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-text-base leading-tight mb-6">
            Medicine, Storytelling, and the Art of Staying Human
          </h1>
          <p className="text-xl text-text-muted leading-relaxed mb-4 max-w-2xl">
            I&#8217;m Zev Felix, a Family Medicine resident, former Camp Grounded co-founder,
            climber, maker, and lifelong student of how people heal, connect, and build meaningful
            lives.
          </p>
          <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-2xl">
            My path here has wound through documentary storytelling, digital detox retreats,
            wilderness medicine, surgery, community-building, and more than a few campfires. Family
            Medicine is where those threads finally came together.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="link" href="/about" size="lg">
              Learn more about me
            </Button>
            <Button as="link" href="/work" size="lg" variant="outline">
              See my work
            </Button>
          </div>
        </HeroWithPortrait>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Intro paragraph */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <p className="text-lg text-text-base leading-relaxed">
            Before medicine, I helped build a summer camp where adults handed over their phones,
            left their job titles behind, and spent weekends rediscovering how to be present.
          </p>
          <p className="text-lg text-text-muted leading-relaxed mt-4">
            Years later, after caring for my brother through glioblastoma, training in osteopathic
            medicine, spending long nights in trauma bays and operating rooms, and learning
            firsthand both the power and limits of modern healthcare, I found myself drawn toward a
            different kind of question:
          </p>
          <p className="font-serif text-2xl text-text-base leading-snug mt-6">
            Not just <em>how do we treat disease?</em>
            <br />
            <em>How do we help people live well?</em>
          </p>
          <p className="text-lg text-text-muted leading-relaxed mt-6">
            That question still guides everything I do.
          </p>
        </div>
      </section>

      {/* Feature band (renders only if assigned) */}
      <section className="container-content">
        <PlacedImage area="home.feature" aspect="21/9" sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      {/* Navigation cards */}
      <section className="section-y bg-surface-alt mt-16">
        <div className="container-content">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-8">
            Explore the site
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navCards.map(({ label, href, icon: Icon, description, area }, i) => {
              const cover = cardImages[area];
              return (
              <ScrollReveal key={href} delay={i * 60} variant="slide-up">
              <Link
                href={href}
                className="group flex flex-col bg-surface border border-border rounded-lg shadow-card hover:shadow-dropdown hover:border-primary/30 transition-all duration-200 h-full overflow-hidden"
              >
                {cover?.media && (
                  <SmartImage
                    src={cover.media.public_url}
                    alt={cover.alt_override ?? cover.media.alt_text}
                    focalX={cover.focal_x}
                    focalY={cover.focal_y}
                    fit={cover.fit}
                    aspect="16/10"
                    rounded={false}
                    sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                  />
                )}
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded bg-primary/8 text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="font-serif font-semibold text-text-base group-hover:text-primary transition-colors">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{description}</p>
                </div>
              </Link>
              </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick search */}
      <section className="section-y container-content">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-3">
            Looking for something?
          </h2>
          <p className="text-text-muted mb-6">
            Search across all pages, projects, and writing on this site.
          </p>
          <SearchBar variant="compact" />
        </div>
      </section>

      {/* Admin-added sections (images, videos, galleries, etc.) */}
      <DynamicSections pageSlug="home" />
    </>
  );
}
