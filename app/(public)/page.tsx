import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Stethoscope, Mountain, Zap, Heart, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/public/SearchBar";
import { DynamicSections } from "@/components/public/DynamicSections";
import { ScrollReveal } from "@/components/public/ScrollReveal";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "Zev Felix — Physician, Climber, Builder",
  description:
    "Family medicine physician in training. Surgical background. Co-founder of Digital Detox. Interested in balance, human connection, technology, and the outdoors.",
  alternates: { canonical: BASE },
};

const navCards = [
  {
    label: "About Zev",
    href: "/about",
    icon: Heart,
    description: "Who I am, where I came from, and what I care about.",
  },
  {
    label: "My Path",
    href: "/path",
    icon: ArrowRight,
    description: "From film school to family medicine — the nonlinear version.",
  },
  {
    label: "Unplugged",
    href: "/unplugged",
    icon: Zap,
    description: "Co-founding Digital Detox and building Camp Grounded.",
  },
  {
    label: "Medicine",
    href: "/medicine",
    icon: Stethoscope,
    description: "Surgery, trauma, and why family medicine makes sense.",
  },
  {
    label: "Outdoors",
    href: "/outdoors",
    icon: Mountain,
    description: "Climbing, wilderness medicine, and what the mountains teach.",
  },
  {
    label: "Writing",
    href: "/writing",
    icon: PenLine,
    description: "Essays and notes on medicine, technology, and living well.",
  },
  {
    label: "Work",
    href: "/work",
    icon: ArrowRight,
    description: "Projects and tools I have built or contributed to.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Physician · Climber · Builder
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-text-base leading-tight mb-6">
            Zev Felix
          </h1>
          <p className="text-xl text-text-muted leading-relaxed mb-8 max-w-2xl">
            Family medicine physician in training. Former surgical resident. Co-founder of Digital
            Detox and Camp Grounded. Drawn to balance, human connection, technology, and the
            outdoors.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="link" href="/about" size="lg">
              Learn more about me
            </Button>
            <Button as="link" href="/work" size="lg" variant="outline">
              See my work
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Intro paragraph */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <p className="text-lg text-text-base leading-relaxed">
            I am a physician entering family medicine after training in surgery and trauma. Before
            medicine, I helped co-found{" "}
            <Link href="/unplugged" className="text-primary underline underline-offset-2 hover:opacity-80">
              Digital Detox
            </Link>{" "}
            and run Camp Grounded — a summer camp for adults designed around putting down devices and
            reconnecting with what matters. These two paths, one clinical and one deeply human, are
            not as different as they sound.
          </p>
          <p className="text-lg text-text-muted leading-relaxed mt-4">
            I believe good medicine is about paying attention — to the whole person, not just the
            symptom. I believe technology should serve life, not replace it. And I believe that the
            outdoors has a way of clarifying what is actually important.
          </p>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="section-y bg-surface-alt">
        <div className="container-content">
          <h2 className="font-serif text-2xl font-semibold text-text-base mb-8">
            Explore the site
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navCards.map(({ label, href, icon: Icon, description }, i) => (
              <ScrollReveal key={href} delay={i * 60} variant="slide-up">
              <Link
                href={href}
                className="group flex flex-col gap-3 p-6 bg-surface border border-border rounded-lg shadow-card hover:shadow-dropdown hover:border-primary/30 transition-all duration-200 h-full"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded bg-primary/8 text-primary">
                    <Icon size={18} />
                  </span>
                  <span className="font-serif font-semibold text-text-base group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{description}</p>
              </Link>
              </ScrollReveal>
            ))}
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
