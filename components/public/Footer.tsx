import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import { Linkedin, Instagram, Mail, Rss } from "lucide-react";
import { FooterNewsletter } from "@/components/public/FooterNewsletter";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";
import { Cartoon } from "@/components/public/Cartoon";

interface FooterProps {
  settings?: SiteSettings["footer"];
}

const defaultSettings: SiteSettings["footer"] = {
  tagline: "Physician. Climber. Builder.",
  email: "",
  social: { twitter: "", linkedin: "", instagram: "" },
  copyright: "Zev Felix",
};

export function Footer({ settings = defaultSettings }: FooterProps) {
  const year = new Date().getFullYear();
  const s = settings;

  return (
    <footer className="relative border-t border-border bg-surface-alt mt-auto overflow-hidden">
      {/* playful accents */}
      <Blob variant={2} float className="pointer-events-none absolute -left-12 -bottom-20 h-72 w-72 text-fun-sky/15 blur-[2px]" />
      <Doodle name="sparkle" size={26} float className="pointer-events-none absolute right-[7%] top-10 hidden text-fun-coral/70 sm:block" />
      <Doodle name="star" size={18} className="pointer-events-none absolute left-[42%] top-16 hidden text-fun-tangerine/60 lg:block" />

      {/* friendly cartoon peeking in (large screens) */}
      <Cartoon
        name="petting-maisy"
        width={210}
        decorative
        className="pointer-events-none absolute -bottom-3 right-6 hidden w-[180px] h-auto sticker xl:block"
      />

      <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Branding */}
          <div className="max-w-xs">
            <p className="relative inline-block font-serif text-xl font-semibold text-text-base mb-2">
              Zev Felix
              <Doodle name="underline" stretch strokeWidth={3} className="absolute -bottom-1.5 left-0 h-2.5 w-full text-fun-tangerine/70" />
            </p>
            <p className="text-sm text-text-muted leading-relaxed">{s.tagline}</p>
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="mt-3 flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Mail size={14} />
                {s.email}
              </a>
            )}
          </div>

          {/* Quick links */}
          <nav className="flex flex-col sm:flex-row gap-8" aria-label="Footer navigation">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Pages
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "About", href: "/about" },
                  { label: "Family Medicine", href: "/medicine" },
                  { label: "Balance", href: "/balance" },
                  { label: "Technology", href: "/technology" },
                  { label: "Philosophy", href: "/philosophy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-anim text-sm text-text-muted hover:text-text-base transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                More
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Outdoors", href: "/outdoors" },
                  { label: "Projects", href: "/work" },
                  { label: "CV", href: "/cv" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-anim text-sm text-text-muted hover:text-text-base transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Newsletter + Social */}
          <div className="space-y-6">
            <FooterNewsletter />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Connect
              </p>
              <div className="flex flex-wrap gap-1">
                {s.social.linkedin && (
                  <a
                    href={s.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn (opens in new tab)"
                    className="p-2 rounded text-text-muted hover:text-primary hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Linkedin size={18} aria-hidden="true" />
                  </a>
                )}
                {s.social.instagram && (
                  <a
                    href={s.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram (opens in new tab)"
                    className="p-2 rounded text-text-muted hover:text-primary hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Instagram size={18} aria-hidden="true" />
                  </a>
                )}
                <a
                  href="/feed.xml"
                  aria-label="RSS feed"
                  className="p-2 rounded text-text-muted hover:text-primary hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Rss size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <p>© {year} {s.copyright}. All rights reserved.</p>
          <p>
            Made with care, Next.js &amp; Supabase ·{" "}
            <Link href="/search" className="hover:text-text-base transition-colors">
              Search
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
