// One-off: assign curated photos to named site areas + project cards.
// Re-runnable (upsert by area). Run: node scripts/seed-placements.mjs
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

// area -> { file, fit, fx, fy, alt, caption }
const placements = {
  "home.feature": { file: "ZevFelixDO-50.jpg", fx: 50, fy: 50, alt: "A Sierra Nevada alpine lake" },
  "outdoors.hero": { file: "ZevFelixDO-44.jpg", fx: 50, fy: 50, alt: "Yosemite Valley" },
  "outdoors.climbing": { file: "ZevFelixDO-56.jpg", fx: 50, fy: 40, alt: "Rock climbing" },
  "outdoors.maisy": { file: "ZevFelixDO-30.jpg", fx: 45, fy: 45, alt: "Maisy, a rescue dog, among California poppies" },
  "unplugged.hero": { file: "ZevFelixDO-2.jpg", fx: 50, fy: 45, alt: "Campers at Camp Grounded in the redwoods" },
  "unplugged.camp1": { file: "ZevFelixDO-5.jpg", fx: 50, fy: 38, alt: "A playful moment at Camp Grounded" },
  "unplugged.camp2": { file: "ZevFelixDO-8.jpg", fx: 50, fy: 40, alt: "Campers gathered at Camp Grounded" },
  "unplugged.camp3": { file: "ZevFelixDO-9.jpg", fx: 50, fy: 45, alt: "Camp Grounded in the redwoods" },
};

// project slug -> photo
const projectImages = {
  "camp-grounded": "ZevFelixDO-2.jpg",
  "digital-detox": "ZevFelixDO-5.jpg",
};

// Resolve all needed media by name
const names = [...new Set([...Object.values(placements).map((p) => p.file), ...Object.values(projectImages)])];
const { data: media, error: mErr } = await sb.from("media").select("id, name").in("name", names);
if (mErr) throw mErr;
const idByName = Object.fromEntries(media.map((m) => [m.name, m.id]));

// Upsert placements
for (const [area, p] of Object.entries(placements)) {
  const media_id = idByName[p.file];
  if (!media_id) {
    console.warn("missing media for", area, p.file);
    continue;
  }
  const { error } = await sb.from("image_placements").upsert(
    {
      area,
      media_id,
      fit: "cover",
      focal_x: p.fx,
      focal_y: p.fy,
      alt_override: p.alt ?? null,
      caption: p.caption ?? null,
      is_visible: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "area" }
  );
  console.log(area, "->", p.file, error ? "ERR " + error.message : "ok");
}

// Project card images
for (const [slug, file] of Object.entries(projectImages)) {
  const image_id = idByName[file];
  if (!image_id) continue;
  const { error } = await sb.from("projects").update({ image_id }).eq("slug", slug);
  console.log("project", slug, "->", file, error ? "ERR " + error.message : "ok");
}

console.log("Done.");
