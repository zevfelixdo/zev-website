import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { NewsletterForm } from "@/components/public/NewsletterForm";

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
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Contact
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Whether you have a question, want to collaborate, or just want to say hello — I would
            love to hear from you.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Forms */}
      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-text-base mb-6">
              Send a message
            </h2>
            <ContactForm />
          </div>
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
        </div>
      </section>
      <DynamicSections pageSlug="contact" />
    </>
  );
}
