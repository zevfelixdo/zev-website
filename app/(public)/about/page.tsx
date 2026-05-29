import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import Image from "next/image";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "The Long Way Here",
  description:
    "How Zev Felix found his way to Family Medicine: through film school, Camp Grounded and Digital Detox, his brother Levi, surgery, and a rescue dog from Taiwan.",
  alternates: { canonical: `${BASE}/about` },
};

async function getProfilePhotoUrl(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "profile_photo_url")
      .single();
    return (data?.value as string) ?? null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const profilePhotoUrl = await getProfilePhotoUrl();

  return (
    <>
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            About
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            The Long Way Here
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            The first thing most people want to know about a doctor is where they trained.
            That&#8217;s fair. The more interesting question is how they ended up there in the
            first place.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Bio */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6 text-text-base leading-relaxed">
            <ScrollReveal variant="fade">
              <p className="text-lg">
                My path to Family Medicine has taken me through film school, startup culture,
                Chinese martial arts training, adult summer camps, surgery, wilderness medicine,
                woodworking shops, climbing walls, and one very patient rescue dog from Taiwan.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={80}>
              <p>
                At USC, I studied business and cinematic arts because I was fascinated by stories.
                Not fictional stories so much as real ones. Why people make the decisions they do.
                How communities form. How identity gets built.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={120}>
              <p>
                After college, those interests led me somewhere unexpected. Together with my brother
                Levi and a group of remarkably creative friends, I helped build Camp Grounded and
                Digital Detox, device-free retreats where adults stepped away from phones, work
                identities, and constant connectivity for a few days.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={160}>
              <p className="font-serif text-xl text-text-base">
                The idea sounds simple. The results were not.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={200}>
              <p>
                People arrived exhausted. By the end of the weekend they were singing around
                campfires, making things with their hands, having difficult conversations,
                reconnecting with old dreams, and remembering parts of themselves that had been
                buried beneath calendars, deadlines, and notifications.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={240}>
              <p>
                Long before I entered medicine, I found myself captivated by a question that would
                follow me for years: <em>What helps people feel alive?</em>
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={280}>
              <p>
                That question became far more personal when my brother Levi was diagnosed with
                glioblastoma. Watching him move through surgeries, treatments, setbacks, difficult
                conversations, and eventually hospice changed what I noticed about healthcare.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={320}>
              <p>
                I paid attention to the physicians who could explain complicated things clearly. The
                nurses who knew when to speak and when to sit quietly. The small acts of competence
                that created trust. The moments of presence that helped families carry impossible
                situations.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={360}>
              <p className="font-serif text-xl text-text-base">
                Medicine stopped being an abstract profession. It became deeply human.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={400}>
              <p>
                Years later, I entered osteopathic medical school and eventually completed a
                preliminary year in General Surgery at UCSF East Bay in Oakland. Surgery taught me
                urgency, discipline, teamwork, and how to function when things become complicated
                very quickly.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={440}>
              <p>
                It also clarified what I wanted most. I wanted continuity. I wanted relationships. I
                wanted to help people before they arrived in crisis.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={480}>
              <p>
                Family Medicine felt less like changing directions and more like finally arriving at
                the place where all the pieces belonged.
              </p>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile photo */}
            {profilePhotoUrl && (
              <ScrollReveal variant="scale">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border shadow-card">
                  <Image
                    src={profilePhotoUrl}
                    alt="Zev Felix"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                    priority
                  />
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal variant="slide-up" delay={100}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Background
                </p>
                <ul className="space-y-2 text-sm text-text-base">
                  <li>California raised</li>
                  <li>USC (Business &amp; Cinematic Arts)</li>
                  <li>Osteopathic medical school (DO)</li>
                  <li>Preliminary year, General Surgery (UCSF East Bay)</li>
                  <li>Family Medicine resident (current)</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-up" delay={160}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Interests
                </p>
                <ul className="space-y-2 text-sm text-text-base">
                  <li>Rock climbing (trad, top rope)</li>
                  <li>Yosemite &amp; the Sierra Nevada</li>
                  <li>Wilderness medicine</li>
                  <li>Cooking</li>
                  <li>Making things</li>
                  <li>Technology &amp; health</li>
                  <li>Maisy (dog)</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-up" delay={220}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Values
                </p>
                <ul className="space-y-2 text-sm text-text-base">
                  <li>Presence over performance</li>
                  <li>Connection over productivity</li>
                  <li>Honesty in medicine and in life</li>
                  <li>Humility in practice</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <DynamicSections pageSlug="about" />
    </>
  );
}
