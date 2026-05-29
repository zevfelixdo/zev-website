import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import Image from "next/image";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "About Zev",
  description:
    "California background, USC education, osteopathic training, surgery, family medicine, and a dog named Maisy.",
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
            About Zev
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Physician, climber, tinkerer, and occasional cook. Trying to do meaningful work
            and stay present while doing it.
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
                I grew up in California and ended up at the University of Southern California, where I
                studied business and found myself spending more and more time in the documentary film
                program. I was drawn to stories — to what makes people the way they are, and why
                communities become what they become.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={80}>
              <p>
                For a while, I thought that meant film. It turned out it meant medicine.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={120}>
              <p>
                After USC, I did a post-baccalaureate pre-medical program and eventually enrolled in
                osteopathic medical school. Osteopathic medicine appealed to me because of its
                emphasis on the whole person — the idea that the body, mind, and context of a person's
                life are inseparable from their health. That framing felt right.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={160}>
              <p>
                I trained in surgery and spent time in burn surgery, acute care surgery, and
                ICU/trauma settings. Surgery is technically demanding, fast, and unambiguous in a
                certain way — you either fixed the problem or you did not. I respect that. But over
                time I found myself more drawn to the parts of care that happen before the operating
                room, and after. The conversations. The prevention. The continuity.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={200}>
              <p>
                I am currently training in family medicine, which I think of as the most complete
                version of the kind of physician I want to be. Whole-person care. Prevention.
                Behavioral health. Long-term relationships with patients and communities.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={240}>
              <p>
                In between, I co-founded a company called Digital Detox and helped run Camp Grounded —
                a summer camp for adults built around disconnecting from devices and reconnecting with
                people, creativity, and nature. My brother and I built it together. He died several
                years ago, and that experience shaped me in ways that are still becoming clear.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={280}>
              <p>
                Outside of medicine and work, I rock climb — trad and top rope, mostly in Yosemite
                and the Sierra. I cook, make things, and spend time outside whenever possible. I have a
                dog named Maisy who is the most sensible member of my household.
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
                  <li>USC — Business &amp; Documentary Film</li>
                  <li>Osteopathic medical training (DO)</li>
                  <li>General surgery residency</li>
                  <li>Burn &amp; acute care surgery</li>
                  <li>Family medicine (current)</li>
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
