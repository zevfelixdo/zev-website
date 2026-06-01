// Seed per-page SEO: make each content page's `pages` row hold the title/
// description that the page currently uses, so lib/seo.ts buildPageMetadata
// (used by each page's generateMetadata) drives SEO from the admin without
// regressing. Reads the values straight from the page files (the fallbackTitle/
// fallbackDescription in generateMetadata) so the row always matches the page.
// Existing rows are updated; balance/technology/philosophy rows are created.
// Re-runnable. Run: node scripts/seed-pages-seo.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const slugs = ["balance", "technology", "philosophy", "outdoors", "work", "unplugged", "path", "cv", "contact"];

const lit = (src, key) => {
  const m = src.match(new RegExp(`${key}:\\s*("(?:[^"\\\\]|\\\\.)*")`));
  return m ? JSON.parse(m[1]) : null;
};

const { data: existing } = await sb.from("pages").select("slug");
const have = new Set((existing ?? []).map((r) => r.slug));

for (const slug of slugs) {
  const src = readFileSync(join(repo, "app", "(public)", slug, "page.tsx"), "utf8");
  const title = lit(src, "fallbackTitle");
  const description = lit(src, "fallbackDescription");
  if (!title || !description) {
    console.log(`SKIP ${slug}: could not parse title/description`);
    continue;
  }
  if (have.has(slug)) {
    const { error } = await sb.from("pages").update({ title, description }).eq("slug", slug);
    console.log(error ? `ERR ${slug}: ${error.message}` : `updated  ${slug} -> ${title}`);
  } else {
    const { error } = await sb
      .from("pages")
      .insert({ slug, title, description, status: "published", is_system: true });
    console.log(error ? `ERR ${slug}: ${error.message}` : `inserted ${slug} -> ${title}`);
  }
}
console.log("done");
