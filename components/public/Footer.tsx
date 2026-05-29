import Link from "next/link";
import type { SiteSettings } from "@/types/database";
import { Twitter, Linkedin, Instagram, Mail, Rss } from "lucide-react";
import { FooterNewsletter } from "@/components/public/FooterNewsletter";

interface FooterProps {
  settings?: SiteSettings["footer"];
}

const defaultSettings: SiteSettings["footer"] = {
  tagline: "Physician. Climber. Builder.",
  email: "hello@zevfelix.com",
  social: { twitter: "", linkedin: "", instagram: "" },
  copyright: "Zev Felix",
};

export function Footer({ settings = defaultSettings }: FooterProps) {
  const year = new Date().getFullYear();
  const s = settings;

  return (
    <footer className="border-t border-border bg-surface-alt mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Branding */}
          <div className="max-w-xs">
            <p className="font-serif text-xl font-semibold text-text-base mb-2">Zev Felix</p>
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
                      className="text-sm text-text-muted hover:text-text-base transition-colors"
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
                  { label: "Writing", href: "/writing" },
                  { label: "CV", href: "/cv" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-base transition-colors"
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
                {s.social.twitter && (
                  <a
                    href={s.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter (opens in new tab)"
                    className="p-2 rounded text-text-muted hover:text-primary hover:bg-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Twitter size={18} aria-hidden="true" />
                  </a>
                )}
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
            Built with Next.js &amp; Supabase ·{" "}
            <Link href="/search" className="hover:text-text-base transition-colors">
              Search
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
