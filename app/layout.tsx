import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { createClient } from "@/lib/supabase/server";
import { defaultThemeConfig } from "@/lib/theme";
import type { ThemeConfig } from "@/types/database";
import { Toaster } from "react-hot-toast";
import { Inter, Lora } from "next/font/google";
import { SkipLink } from "@/components/public/SkipLink";
import { BackToTop } from "@/components/public/BackToTop";
import { getSeoDefaults } from "@/lib/seo";

// ── next/font — self-hosted on Vercel, no external round-trip ────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

// Site-wide metadata defaults, sourced from the admin (Settings → SEO defaults)
// with safe fallbacks. Per-page metadata still overrides these.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoDefaults();
  return {
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate.includes("%s") ? seo.titleTemplate : `%s | ${seo.defaultTitle}`,
    },
    description: seo.defaultDescription,
    metadataBase: new URL(BASE),
    alternates: { canonical: BASE },
    openGraph: {
      type: "website",
      siteName: seo.defaultTitle,
      locale: "en_US",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

async function getActiveTheme(): Promise<ThemeConfig> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("themes")
      .select("config")
      .eq("is_active", true)
      .single();
    return (data?.config as ThemeConfig) ?? defaultThemeConfig;
  } catch {
    return defaultThemeConfig;
  }
}

// Person JSON-LD for the whole site
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zev Felix",
  givenName: "Zev",
  familyName: "Felix",
  honorificSuffix: "DO",
  url: BASE,
  jobTitle: "Family Medicine Resident Physician",
  description:
    "Family Medicine resident physician, former surgical resident, and co-founder of Camp Grounded and Digital Detox. Writes about medicine, technology, the outdoors, and how people stay human.",
  knowsAbout: [
    "Family Medicine",
    "Preventive Medicine",
    "Osteopathic Medicine",
    "Wilderness Medicine",
    "Digital Wellness",
    "Community Building",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Southern California" },
    { "@type": "CollegeOrUniversity", name: "Mills College" },
    {
      "@type": "CollegeOrUniversity",
      name: "Touro University California College of Osteopathic Medicine",
    },
    { "@type": "MedicalOrganization", name: "UCSF East Bay (General Surgery, preliminary year)" },
  ],
  sameAs: ["https://www.linkedin.com/in/zev-felix-09b94a13"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* No-JS safety: scroll-reveal / kinetic content must never stay hidden */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.kin-word{transform:none!important}.rule-draw{transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex flex-col min-h-screen">
        <SkipLink />
        <ThemeProvider config={theme}>
          {children}
          <BackToTop />
          <Toaster position="bottom-right" />
        </ThemeProvider>
        {/* Subtle film grain over the whole page for editorial warmth */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
