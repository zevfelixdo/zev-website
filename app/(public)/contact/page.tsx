import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";
import { ContactForm } from "@/components/public/ContactForm";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";
import { Mail, Linkedin } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "contact",
    path: "/contact",
    fallbackTitle: "Contact",
    fallbackDescription:
      "Send a message, subscribe to the newsletter, or ask how to support my work.",
  });
}

export default async function ContactPage() {
  const c = await getPageContent("contact");
  const f = (key: string, fallback: string) => field(c, key, fallback);

  // Direct-contact details from Settings -> Footer (email appears once it's filled in).
  const sb = createPublicClient();
  const { data: footerData } = await sb
    .from("site_settings")
    .select("value")
    .eq("key", "footer")
    .maybeSingle();
  const footer = (footerData?.value ?? {}) as { email?: string; social?: { linkedin?: string } };
  const email = footer.email?.trim() || "";
  const linkedin = footer.social?.linkedin?.trim() || "";

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "Contact")}
        heading={f("hero.heading", "Get in touch")}
        collage={{ photoArea: "contact.portrait", cartoon: "scrubs-front", blobVariant: 2, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          {f("hero.lead", "Whether you have a question, want to collaborate, or just want to say hello, I would love to hear from you.")}
        </p>
      </PageHero>

      <div className="border-t border-border" />

      {/* Forms */}
      <section className="relative section-y container-content overflow-x-clip">
        <Doodle name="loops" size={90} strokeWidth={4} className="hidden lg:block absolute right-[6%] top-10 text-fun-sky/60" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
          <Reveal>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-text-base mb-6">
                {f("msg.heading", "Send a message")}
              </h2>
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-text-base mb-2">
                {f("news.heading", "Join the newsletter")}
              </h2>
              <p className="text-text-muted mb-6 text-sm leading-relaxed">
                {f("news.blurb", "Occasional thoughts on medicine, technology, the outdoors, and living well. No spam, ever. Unsubscribe any time.")}
              </p>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>

        {(email || linkedin) && (
          <div className="mt-14 pt-8 border-t border-border max-w-4xl flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="font-semibold uppercase tracking-wider text-text-muted">Or reach me directly</span>
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                <Mail size={15} aria-hidden="true" /> {email}
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                <Linkedin size={15} aria-hidden="true" /> LinkedIn
              </a>
            )}
          </div>
        )}
      </section>
      <DynamicSections pageSlug="contact" />
    </>
  );
}
