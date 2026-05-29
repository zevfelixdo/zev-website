import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { createClient } from "@/lib/supabase/server";
import { defaultThemeConfig } from "@/lib/theme";
import type { ThemeConfig } from "@/types/database";
import { Toaster } from "react-hot-toast";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import { SkipLink } from "@/components/public/SkipLink";
import { BackToTop } from "@/components/public/BackToTop";

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
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: {
    default: "Zev Felix",
    template: "%s | Zev Felix",
  },
  description:
    "Physician, outdoor enthusiast, and builder. Exploring medicine, technology, and what it means to live well.",
  metadataBase: new URL(BASE),
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    siteName: "Zev Felix",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@zevfelix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

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
  url: BASE,
  jobTitle: "Family Medicine Physician",
  description:
    "Family medicine physician in training, former surgical resident, co-founder of Digital Detox and Camp Grounded.",
  sameAs: [
    "https://linkedin.com/in/zevfelix",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <SkipLink />
        <ThemeProvider config={theme}>
          {children}
          <BackToTop />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
