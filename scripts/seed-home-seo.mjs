// One-off: seed the `home` pages row to the homepage's bespoke title/description
// so per-page SEO (lib/seo.ts buildPageMetadata) doesn't regress when the home
// page switches from a hardcoded `metadata` export to `generateMetadata`.
// The row already exists with placeholder values ("Home" / "Physician, builder…").
// Re-runnable (update by slug). Run: node scripts/seed-home-seo.mjs
import { readFileSync } from "node:fs";
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

const title = "Zev Felix: Medicine, Creativity, Community, and the Art of Staying Human";
const description =
  "Family Medicine resident, former Camp Grounded co-founder, climber, and maker. A lifelong student of how people heal, connect, and build meaningful lives.";

const { data, error } = await sb
  .from("pages")
  .update({ title, description })
  .eq("slug", "home")
  .select("slug, title, description");

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}
console.log("Updated home pages row:", JSON.stringify(data, null, 2));
