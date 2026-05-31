import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a message, subscribe to the newsletter, or ask how to support my work.",
  alternates: { canonical: `${BASE}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        heading="Get in touch"
        collage={{ photoArea: "contact.portrait", cartoon: "drinking-coffee", blobVariant: 2, blobClass: "text-primary/10", doodle: "heart", doodleClass: "text-accent" }}
      >
        <p>
          Whether you have a question, want to collaborate, or just want to say hello, I would
          love to hear from you.
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
                Send a message
              </h2>
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-text-base mb-2">
                Join the newsletter
              </h2>
              <p className="text-text-muted mb-6 text-sm leading-relaxed">
                Occasional thoughts on medicine, technology, the outdoors, and living well. No spam,
                ever. Unsubscribe any time.
              </p>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
      <DynamicSections pageSlug="contact" />
    </>
  );
}
