import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export interface SeoDefaults {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
}

const FALLBACK: SeoDefaults = {
  defaultTitle: "Zev Felix",
  titleTemplate: "%s | Zev Felix",
  defaultDescription:
    "Physician, outdoor enthusiast, and builder. Exploring medicine, technology, and what it means to live well.",
  ogImage: "",
};

const isAbsoluteUrl = (s?: string | null) => !!s && /^https?:\/\//i.test(s.trim());

/** Site-wide SEO defaults from the admin (site_settings.seo), with safe fallbacks. */
export async function getSeoDefaults(): Promise<SeoDefaults> {
  try {
    const sb = createClient();
    const { data } = await sb.from("site_settings").select("value").eq("key", "seo").single();
    const v = (data?.value ?? {}) as Partial<SeoDefaults>;
    return {
      defaultTitle: v.defaultTitle?.trim() || FALLBACK.defaultTitle,
      titleTemplate: v.titleTemplate?.trim() || FALLBACK.titleTemplate,
      defaultDescription: v.defaultDescription?.trim() || FALLBACK.defaultDescription,
      ogImage: v.ogImage?.trim() || "",
    };
  } catch {
    return FALLBACK;
  }
}

/**
 * Per-page metadata sourced from the admin: the `pages` row (title / description /
 * og_image) layered over the site SEO defaults, with hardcoded fallbacks so a
 * missing/empty value never regresses SEO. Use in a page's generateMetadata().
 */
export async function buildPageMetadata(opts: {
  slug: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  /** Bypass the root layout's "%s | Zev Felix" title template (use for the home page). */
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  let pageTitle = opts.fallbackTitle;
  let pageDesc = opts.fallbackDescription;
  let ogImage = "";

  try {
    const sb = createClient();
    const { data } = await sb
      .from("pages")
      .select("title, description, og_image")
      .eq("slug", opts.slug)
      .maybeSingle();
    if (data) {
      if (data.title?.trim()) pageTitle = data.title.trim();
      if (data.description?.trim()) pageDesc = data.description.trim();
      if (isAbsoluteUrl(data.og_image)) ogImage = data.og_image!.trim();
    }
  } catch {
    /* fall back to provided values */
  }

  const canonical = `${BASE}${opts.path}`;
  return {
    title: opts.absoluteTitle ? { absolute: pageTitle } : pageTitle,
    description: pageDesc,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
