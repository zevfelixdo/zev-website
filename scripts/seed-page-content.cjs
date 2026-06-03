/**
 * Seed the current page COPY (the f("key","fallback") values baked into each
 * public page) into site_settings under key `page:<slug>`, so the admin Page
 * editor ("Page text content") shows the live text pre-filled and editable.
 *
 * Seeded value === code fallback, so field() returns the same string and the
 * rendered pages are byte-identical (no visible change). Reversible: delete the
 * page:* rows to fall back to code again.
 *
 * Uses the TypeScript parser to read string-literal args exactly (handles curly
 * quotes, escapes, embedded newlines for one-per-line list fields).
 *
 * Run:  node scripts/seed-page-content.cjs          (writes)
 *       DRY=1 node scripts/seed-page-content.cjs     (preview only)
 */
const ts = require("typescript");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const sb = createClient(url, key);
const DRY = process.env.DRY === "1";

const PAGES = {
  home: "app/(public)/page.tsx",
  about: "app/(public)/about/page.tsx",
  medicine: "app/(public)/medicine/page.tsx",
  balance: "app/(public)/balance/page.tsx",
  technology: "app/(public)/technology/page.tsx",
  philosophy: "app/(public)/philosophy/page.tsx",
  outdoors: "app/(public)/outdoors/page.tsx",
  work: "app/(public)/work/page.tsx",
  unplugged: "app/(public)/unplugged/page.tsx",
  path: "app/(public)/path/page.tsx",
  cv: "app/(public)/cv/page.tsx",
  contact: "app/(public)/contact/page.tsx",
  writing: "app/(public)/writing/page.tsx",
};

function extract(file) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = {};
  const skipped = [];
  const lit = (n) =>
    n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
  (function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "f" &&
      node.arguments.length === 2
    ) {
      const k = lit(node.arguments[0]);
      if (k != null) {
        const v = lit(node.arguments[1]);
        if (v != null) {
          if (out[k] !== undefined && out[k] !== v) skipped.push(`${k} (dup conflict)`);
          out[k] = v;
        } else {
          skipped.push(`${k} (non-literal fallback)`);
        }
      }
    }
    ts.forEachChild(node, visit);
  })(sf);
  return { out, skipped };
}

(async () => {
  let grand = 0;
  for (const [slug, file] of Object.entries(PAGES)) {
    if (!fs.existsSync(file)) {
      console.log(`!! MISSING ${file}`);
      continue;
    }
    const { out, skipped } = extract(file);
    const n = Object.keys(out).length;
    grand += n;
    let res = "";
    if (!DRY) {
      const { error } = await sb.from("site_settings").upsert({ key: `page:${slug}`, value: out });
      res = error ? `  DB-ERROR ${error.message}` : "  ✓ seeded";
    }
    console.log(
      `${slug.padEnd(11)} ${String(n).padStart(3)} fields${res}${
        skipped.length ? `  ⚠ skipped: ${skipped.join("; ")}` : ""
      }`
    );
  }
  console.log(
    `\n${DRY ? "[DRY RUN] would seed" : "SEEDED"} ${grand} fields total across ${Object.keys(PAGES).length} pages`
  );
  if (DRY) {
    const s = extract(PAGES.home).out;
    console.log("\nSAMPLE (home) — exact values that will be stored:");
    ["hero.eyebrow", "hero.heading", "story.lead", "facts.l1"].forEach((k) =>
      console.log(`  ${k} = ${JSON.stringify((s[k] || "(none)").slice(0, 90))}`)
    );
  }
})();
