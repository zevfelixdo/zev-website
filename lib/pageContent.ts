/**
 * Field-level page content binding (CMS migration POC).
 *
 * Lets an existing, bespoke-designed page keep its exact layout/components while
 * sourcing its editable TEXT from the database, so a non-technical admin can edit
 * the copy without touching code or losing the design. Values live in the
 * `site_settings` table under key `page:<slug>` (zero migration). Every field has
 * a hardcoded fallback in the page, so a missing/empty value never breaks or
 * changes the design.
 *
 * To extend to another page: add a schema entry below + read fields on that page
 * with the `field()` helper. The admin Page editor renders the schema automatically.
 */

export type ContentFieldType = "text" | "textarea" | "richtext";
export interface ContentField {
  key: string;
  label: string;
  type: ContentFieldType;
}
export interface ContentGroup {
  group: string;
  fields: ContentField[];
}

export const PAGE_CONTENT_SCHEMA: Record<string, ContentGroup[]> = {
  home: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow / tagline", type: "text" },
        { key: "hero.heading", label: "Headline", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
        { key: "hero.intro", label: "Intro paragraph", type: "textarea" },
        { key: "hero.cta1", label: "Primary button label", type: "text" },
        { key: "hero.cta2", label: "Secondary button label", type: "text" },
      ],
    },
    {
      group: "Marquee (scrolling phrases)",
      fields: [{ key: "threads", label: "Phrases (one per line)", type: "textarea" }],
    },
    {
      group: "The short version",
      fields: [
        { key: "story.eyebrow", label: "Eyebrow", type: "text" },
        { key: "story.lead", label: "Path summary (large)", type: "textarea" },
        { key: "story.body", label: "Supporting line", type: "textarea" },
        { key: "story.cta", label: "Button label", type: "text" },
        { key: "story.presslabel", label: "Press label", type: "text" },
        { key: "press", label: "Press links (one per line: Outlet | URL)", type: "textarea" },
      ],
    },
    {
      group: "A few true things (stats)",
      fields: [
        { key: "facts.eyebrow", label: "Eyebrow", type: "text" },
        { key: "facts.v1", label: "Stat 1 number (e.g. 3,000+)", type: "text" },
        { key: "facts.l1", label: "Stat 1 label", type: "text" },
        { key: "facts.v2", label: "Stat 2 number", type: "text" },
        { key: "facts.l2", label: "Stat 2 label", type: "text" },
        { key: "facts.v3", label: "Stat 3 number", type: "text" },
        { key: "facts.l3", label: "Stat 3 label", type: "text" },
        { key: "facts.v4", label: "Stat 4 number", type: "text" },
        { key: "facts.l4", label: "Stat 4 label", type: "text" },
      ],
    },
    {
      group: "01 — Introduction",
      fields: [
        { key: "intro.p1", label: "Paragraph 1 (large)", type: "textarea" },
        { key: "intro.p2", label: "Paragraph 2", type: "textarea" },
      ],
    },
    {
      group: "Question band (green)",
      fields: [
        { key: "band.eyebrow", label: "Eyebrow", type: "text" },
        { key: "band.l1", label: "Line 1", type: "text" },
        { key: "band.l2", label: "Line 2 (large)", type: "text" },
        { key: "band.close", label: "Closing line", type: "textarea" },
      ],
    },
    {
      group: "Glimpses",
      fields: [
        { key: "glimpses.heading", label: "Heading", type: "text" },
        { key: "glimpses.index", label: "Section index", type: "text" },
      ],
    },
    {
      group: "Explore — section heading",
      fields: [{ key: "explore.heading", label: "Heading", type: "textarea" }],
    },
    {
      group: "Explore — cards",
      fields: [
        { key: "explore.about.title", label: "Card 1 — title", type: "text" },
        { key: "explore.about.desc", label: "Card 1 — description", type: "textarea" },
        { key: "explore.medicine.title", label: "Card 2 — title", type: "text" },
        { key: "explore.medicine.desc", label: "Card 2 — description", type: "textarea" },
        { key: "explore.balance.title", label: "Card 3 — title", type: "text" },
        { key: "explore.balance.desc", label: "Card 3 — description", type: "textarea" },
        { key: "explore.technology.title", label: "Card 4 — title", type: "text" },
        { key: "explore.technology.desc", label: "Card 4 — description", type: "textarea" },
        { key: "explore.outdoors.title", label: "Card 5 — title", type: "text" },
        { key: "explore.outdoors.desc", label: "Card 5 — description", type: "textarea" },
        { key: "explore.projects.title", label: "Card 6 — title", type: "text" },
        { key: "explore.projects.desc", label: "Card 6 — description", type: "textarea" },
        { key: "explore.philosophy.title", label: "Card 7 — title", type: "text" },
        { key: "explore.philosophy.desc", label: "Card 7 — description", type: "textarea" },
        { key: "explore.writing.title", label: "Card 8 — title", type: "text" },
        { key: "explore.writing.desc", label: "Card 8 — description", type: "textarea" },
      ],
    },
    {
      group: "Closing — Stay a while",
      fields: [
        { key: "close.eyebrow", label: "Eyebrow", type: "text" },
        { key: "close.heading", label: "Heading", type: "text" },
        { key: "close.p", label: "Paragraph", type: "textarea" },
        { key: "close.cta1", label: "Primary button label", type: "text" },
        { key: "close.cta2", label: "Secondary button label", type: "text" },
        { key: "close.search", label: "Search prompt", type: "text" },
      ],
    },
  ],
  balance: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Narrative",
      fields: [
        { key: "narr.p1", label: "Paragraph 1", type: "textarea" },
        { key: "narr.p2", label: "Paragraph 2", type: "textarea" },
        { key: "narr.p3", label: "Paragraph 3", type: "textarea" },
        { key: "narr.quote", label: "Pull-quote", type: "textarea" },
        { key: "narr.principles", label: "Principles list (one per line)", type: "textarea" },
        { key: "narr.p4", label: "Paragraph 4", type: "textarea" },
        { key: "narr.whys", label: "Why list (one per line)", type: "textarea" },
        { key: "narr.p5", label: "Closing line", type: "text" },
      ],
    },
    {
      group: "Closing",
      fields: [
        { key: "close.l1", label: "Line 1", type: "text" },
        { key: "close.l2", label: "Line 2", type: "textarea" },
      ],
    },
  ],
  technology: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Narrative",
      fields: [
        { key: "narr.quote1", label: "Pull-quote 1", type: "textarea" },
        { key: "narr.p1", label: "Paragraph 1", type: "textarea" },
        { key: "narr.p2", label: "Paragraph 2", type: "textarea" },
        { key: "narr.p3", label: "Paragraph 3", type: "textarea" },
        { key: "narr.benefits", label: "Benefits list (one per line)", type: "textarea" },
        { key: "narr.quote2", label: "Pull-quote 2", type: "textarea" },
        { key: "narr.p4", label: "Paragraph 4", type: "textarea" },
      ],
    },
    {
      group: "Closing question",
      fields: [
        { key: "close.p1", label: "Lead-in", type: "textarea" },
        { key: "close.phrase", label: "Highlighted question", type: "text" },
        { key: "close.p2", label: "Paragraph", type: "textarea" },
        { key: "close.p3", label: "Closing line", type: "textarea" },
      ],
    },
  ],
  philosophy: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Opening",
      fields: [
        { key: "open.phrase", label: "Highlighted question", type: "text" },
        { key: "open.line2", label: "Line 2 (muted)", type: "text" },
        { key: "open.line3", label: "Line 3", type: "text" },
      ],
    },
    {
      group: "Narrative",
      fields: [
        { key: "narr.q1", label: "Pull-quote 1", type: "textarea" },
        { key: "narr.p1", label: "Paragraph", type: "textarea" },
        { key: "narr.q2", label: "Pull-quote 2", type: "textarea" },
      ],
    },
    {
      group: "Goal",
      fields: [
        { key: "goal.p1", label: "Paragraph 1", type: "textarea" },
        { key: "goal.list", label: "List (one per line)", type: "textarea" },
        { key: "goal.p2", label: "Closing paragraph", type: "textarea" },
      ],
    },
  ],
  outdoors: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Parallax band (Yosemite)",
      fields: [
        { key: "parallax.quote", label: "Floating quote", type: "textarea" },
        { key: "parallax.caption", label: "Caption / attribution", type: "text" },
      ],
    },
    {
      group: "Making things",
      fields: [
        { key: "make.heading", label: "Heading", type: "text" },
        { key: "make.p1", label: "Paragraph 1", type: "textarea" },
        { key: "make.p2", label: "Paragraph 2", type: "textarea" },
      ],
    },
    {
      group: "Climbing",
      fields: [
        { key: "climb.heading", label: "Heading", type: "text" },
        { key: "climb.p1", label: "Paragraph 1", type: "textarea" },
        { key: "climb.p2", label: "Paragraph 2", type: "textarea" },
        { key: "climb.list", label: "Climbing list (one per line)", type: "textarea" },
      ],
    },
    {
      group: "Maisy",
      fields: [
        { key: "maisy.heading", label: "Heading", type: "text" },
        { key: "maisy.p1", label: "Paragraph 1", type: "textarea" },
        { key: "maisy.p2", label: "Paragraph 2", type: "textarea" },
      ],
    },
    {
      group: "Reflection",
      fields: [
        { key: "refl.quote", label: "Pull-quote", type: "textarea" },
        { key: "refl.p1", label: "Paragraph", type: "textarea" },
      ],
    },
    {
      group: "Wilderness",
      fields: [
        { key: "wild.eyebrow", label: "Eyebrow", type: "text" },
        { key: "wild.heading", label: "Heading", type: "text" },
        { key: "wild.p1", label: "Paragraph 1", type: "textarea" },
        { key: "wild.list", label: "List (one per line)", type: "textarea" },
        { key: "wild.p2", label: "Paragraph 2", type: "textarea" },
        { key: "wild.p3", label: "Paragraph 3", type: "textarea" },
        { key: "wild.p4", label: "Paragraph 4", type: "textarea" },
        { key: "wild.p5", label: "Paragraph 5", type: "textarea" },
      ],
    },
  ],
  path: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Timeline (8 entries)",
      fields: [
        { key: "t1.period", label: "1 — Period", type: "text" },
        { key: "t1.title", label: "1 — Title", type: "text" },
        { key: "t1.body", label: "1 — Body", type: "textarea" },
        { key: "t2.period", label: "2 — Period", type: "text" },
        { key: "t2.title", label: "2 — Title", type: "text" },
        { key: "t2.body", label: "2 — Body", type: "textarea" },
        { key: "t3.period", label: "3 — Period", type: "text" },
        { key: "t3.title", label: "3 — Title", type: "text" },
        { key: "t3.body", label: "3 — Body", type: "textarea" },
        { key: "t4.period", label: "4 — Period", type: "text" },
        { key: "t4.title", label: "4 — Title", type: "text" },
        { key: "t4.body", label: "4 — Body", type: "textarea" },
        { key: "t5.period", label: "5 — Period", type: "text" },
        { key: "t5.title", label: "5 — Title", type: "text" },
        { key: "t5.body", label: "5 — Body", type: "textarea" },
        { key: "t6.period", label: "6 — Period", type: "text" },
        { key: "t6.title", label: "6 — Title", type: "text" },
        { key: "t6.body", label: "6 — Body", type: "textarea" },
        { key: "t7.period", label: "7 — Period", type: "text" },
        { key: "t7.title", label: "7 — Title", type: "text" },
        { key: "t7.body", label: "7 — Body", type: "textarea" },
        { key: "t8.period", label: "8 — Period", type: "text" },
        { key: "t8.title", label: "8 — Title", type: "text" },
        { key: "t8.body", label: "8 — Body", type: "textarea" },
      ],
    },
  ],
  work: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Narrative",
      fields: [
        { key: "narr.p1", label: "Paragraph 1", type: "textarea" },
        { key: "narr.p2", label: "Paragraph 2", type: "textarea" },
        { key: "narr.quote1", label: "Pull-quote 1", type: "textarea" },
        { key: "narr.questions", label: "Questions list (one per line)", type: "textarea" },
        { key: "narr.p3", label: "Paragraph 3", type: "textarea" },
        { key: "narr.quote2", label: "Pull-quote 2", type: "textarea" },
      ],
    },
    {
      group: "Projects section",
      fields: [
        { key: "proj.heading", label: "Heading", type: "text" },
        { key: "proj.empty", label: "Empty state", type: "text" },
      ],
    },
  ],
  unplugged: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "The origin",
      fields: [
        { key: "origin.p1", label: "Paragraph 1", type: "textarea" },
        { key: "origin.p2", label: "Paragraph 2", type: "textarea" },
        { key: "origin.p3", label: "Paragraph 3", type: "textarea" },
      ],
    },
    {
      group: "Around the fire",
      fields: [
        { key: "fire.quote", label: "Pull-quote", type: "textarea" },
        { key: "fire.p1", label: "Paragraph 1", type: "textarea" },
        { key: "fire.p2", label: "Paragraph 2", type: "textarea" },
        { key: "fire.p3", label: "Paragraph 3", type: "textarea" },
        { key: "fire.qLead", label: "Question lead-in", type: "text" },
        { key: "fire.qLink", label: "Question link text", type: "text" },
      ],
    },
    {
      group: "My brother Levi (reverent)",
      fields: [
        { key: "levi.heading", label: "Heading", type: "text" },
        { key: "levi.p1", label: "Paragraph 1", type: "textarea" },
        { key: "levi.p2", label: "Paragraph 2 (before link)", type: "textarea" },
        { key: "levi.p2link", label: "Paragraph 2 link text", type: "text" },
        { key: "levi.p3", label: "Paragraph 3 (before link)", type: "textarea" },
        { key: "levi.p3link", label: "Paragraph 3 link text", type: "text" },
        { key: "levi.p4", label: "Paragraph 4", type: "textarea" },
      ],
    },
    {
      group: "What this has to do with medicine",
      fields: [
        { key: "med.heading", label: "Heading", type: "text" },
        { key: "med.p1a", label: "Paragraph 1 (start)", type: "textarea" },
        { key: "med.p1italic", label: "Paragraph 1 italic phrase", type: "text" },
        { key: "med.p1b", label: "Paragraph 1 (middle)", type: "textarea" },
        { key: "med.p1link", label: "Paragraph 1 link text", type: "text" },
        { key: "med.p2", label: "Paragraph 2", type: "textarea" },
        { key: "med.p3a", label: "Paragraph 3 (start)", type: "textarea" },
        { key: "med.p3link", label: "Paragraph 3 link text", type: "text" },
        { key: "med.p3b", label: "Paragraph 3 (end)", type: "text" },
      ],
    },
    {
      group: "Section headings",
      fields: [
        { key: "gallery.heading", label: "Gallery heading", type: "text" },
        { key: "press.heading", label: "Press heading", type: "text" },
        { key: "press", label: "Press links (one per line: Outlet | URL)", type: "textarea" },
      ],
    },
  ],
  contact: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Forms",
      fields: [
        { key: "msg.heading", label: "Message form heading", type: "text" },
        { key: "news.heading", label: "Newsletter heading", type: "text" },
        { key: "news.blurb", label: "Newsletter blurb", type: "textarea" },
      ],
    },
  ],
  cv: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
  ],
  writing: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
        { key: "hero.rss", label: "RSS link label", type: "text" },
      ],
    },
    {
      group: "Empty state",
      fields: [{ key: "empty", label: "No-posts message", type: "text" }],
    },
  ],
  about: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Chapter 01 — Curiosity",
      fields: [
        { key: "c1.label", label: "Section label", type: "text" },
        { key: "c1.p1", label: "Paragraph 1", type: "textarea" },
        { key: "c1.p2", label: "Paragraph 2", type: "textarea" },
      ],
    },
    {
      group: "Chapter 02 — Camp Grounded",
      fields: [
        { key: "c2.label", label: "Section label", type: "text" },
        { key: "c2.p1", label: "Paragraph 1", type: "textarea" },
        { key: "c2.quote", label: "Pull-quote", type: "textarea" },
        { key: "c2.p2", label: "Paragraph 2", type: "textarea" },
        { key: "c2.leadIn", label: "Question lead-in", type: "textarea" },
        { key: "c2.phrase", label: "Highlighted question", type: "text" },
      ],
    },
    {
      group: "Chapter 03 — Levi",
      fields: [
        { key: "c3.label", label: "Section label", type: "text" },
        { key: "c3.p1", label: "Paragraph 1", type: "textarea" },
        { key: "c3.p2", label: "Paragraph 2", type: "textarea" },
        { key: "c3.quote", label: "Pull-quote", type: "textarea" },
      ],
    },
    {
      group: "Chapter 04 — Surgery",
      fields: [
        { key: "c4.label", label: "Section label", type: "text" },
        { key: "c4.p1", label: "Paragraph 1", type: "textarea" },
        { key: "c4.p2", label: "Paragraph 2", type: "textarea" },
      ],
    },
    {
      group: "Chapter 05 — Family Medicine",
      fields: [
        { key: "c5.label", label: "Section label", type: "text" },
        { key: "c5.line", label: "Closing line", type: "textarea" },
      ],
    },
    {
      group: "Facts band (one item per line)",
      fields: [
        { key: "facts.background", label: "Background", type: "textarea" },
        { key: "facts.interests", label: "Interests", type: "textarea" },
        { key: "facts.values", label: "Values", type: "textarea" },
      ],
    },
  ],
  medicine: [
    {
      group: "Hero",
      fields: [
        { key: "hero.eyebrow", label: "Eyebrow", type: "text" },
        { key: "hero.heading", label: "Heading", type: "text" },
        { key: "hero.lead", label: "Lead paragraph", type: "textarea" },
      ],
    },
    {
      group: "Chapter 1 — Drawn to complexity",
      fields: [
        { key: "c1.heading", label: "Heading", type: "text" },
        { key: "c1.p1", label: "Paragraph 1", type: "textarea" },
        { key: "c1.p2", label: "Paragraph 2", type: "textarea" },
        { key: "c1.p3", label: "Paragraph 3", type: "textarea" },
      ],
    },
    {
      group: "Chapter 2 — The space before crisis",
      fields: [
        { key: "c2.heading", label: "Heading", type: "text" },
        { key: "c2.p1", label: "Paragraph", type: "textarea" },
        { key: "c2.quote", label: "Pull-quote", type: "textarea" },
      ],
    },
    {
      group: "The whole picture (green band)",
      fields: [
        { key: "band.l1", label: "Line 1", type: "text" },
        { key: "band.l2", label: "Line 2", type: "text" },
        { key: "band.l3", label: "Line 3", type: "text" },
      ],
    },
    {
      group: "Closing",
      fields: [
        { key: "close.p1", label: "Paragraph", type: "textarea" },
        { key: "close.quote", label: "Pull-quote", type: "textarea" },
        { key: "close.p2", label: "Paragraph", type: "textarea" },
      ],
    },
  ],
};

export type PageContent = Record<string, string>;

/** Pick a field with a hardcoded fallback (preserves design/content when unset). */
export function field(content: PageContent, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.trim() ? v : fallback;
}
