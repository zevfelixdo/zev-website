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
      group: "A few true things (stat labels)",
      fields: [
        { key: "facts.eyebrow", label: "Eyebrow", type: "text" },
        { key: "facts.l1", label: "Stat 1 label", type: "text" },
        { key: "facts.l2", label: "Stat 2 label", type: "text" },
        { key: "facts.l3", label: "Stat 3 label", type: "text" },
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
      group: "Explore",
      fields: [{ key: "explore.heading", label: "Heading", type: "textarea" }],
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
