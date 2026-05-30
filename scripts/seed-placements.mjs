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
  // Portraits
  "home.portrait": { file: "ZevFelixDO-35.jpg", fx: 50, fy: 30, alt: "Zev Felix" },
  "about.profile": { file: "ZevFelixDO.jpg", fx: 50, fy: 35, alt: "Zev Felix" },
  "medicine.portrait": { file: "ZevFelixDO-33.jpg", fx: 50, fy: 30, alt: "Zev Felix, Family Medicine resident" },
  "technology.portrait": { file: "ZevFelixDO-34.jpg", fx: 50, fy: 30, alt: "Zev Felix" },
  "philosophy.portrait": { file: "ZevFelixDO-61.jpg", fx: 50, fy: 35, alt: "Zev Felix" },
  "cv.portrait": { file: "ZevFelixDO-38.jpg", fx: 50, fy: 30, alt: "Zev Felix" },
  "contact.portrait": { file: "ZevFelixDO-62.jpg", fx: 50, fy: 35, alt: "Zev Felix" },
  // Landscapes / scenes
  "home.feature": { file: "ZevFelixDO-50.jpg", fx: 50, fy: 50, alt: "A Sierra Nevada alpine lake" },
  "balance.hero": { file: "ZevFelixDO-48.jpg", fx: 50, fy: 50, alt: "A quiet mountain landscape at dusk" },
  "path.hero": { file: "ZevFelixDO-64.jpg", fx: 50, fy: 50, alt: "A temple in China, from a season of martial arts training" },
  "work.hero": { file: "ZevFelixDO-26.jpg", fx: 50, fy: 45, alt: "A community gathering" },
  "outdoors.hero": { file: "ZevFelixDO-44.jpg", fx: 50, fy: 50, alt: "Yosemite Valley" },
  "outdoors.climbing": { file: "ZevFelixDO-56.jpg", fx: 50, fy: 40, alt: "Rock climbing in Yosemite" },
  "outdoors.maisy": { file: "ZevFelixDO-30.jpg", fx: 45, fy: 45, alt: "Maisy, a rescue dog, among California poppies" },
  // Home glimpses gallery
  "home.glimpse1": { file: "ZevFelixDO-46.jpg", fx: 50, fy: 40, alt: "Zev Felix climbing in Yosemite" },
  "home.glimpse2": { file: "ZevFelixDO-14.jpg", fx: 50, fy: 35, alt: "Maisy, a rescue dog" },
  "home.glimpse3": { file: "ZevFelixDO-66.jpg", fx: 50, fy: 45, alt: "Friends gathered around a table" },
  // Body side-images
  "balance.side": { file: "ZevFelixDO-28.jpg", fx: 50, fy: 40, alt: "Resting with friends on a winter mountain trip" },
  "technology.side": { file: "ZevFelixDO-69.jpg", fx: 50, fy: 45, alt: "People gathered around a meal" },
  "philosophy.opening": { file: "ZevFelixDO-57.jpg", fx: 50, fy: 45, alt: "Looking out over Yosemite Valley" },
  "philosophy.goal": { file: "ZevFelixDO-20.jpg", fx: 50, fy: 40, alt: "Outdoors with a friend" },
  // Home "Explore the site" card covers
  "home.card.about": { file: "ZevFelixDO.jpg", fx: 50, fy: 30, alt: "Zev Felix" },
  "home.card.medicine": { file: "ZevFelixDO-33.jpg", fx: 50, fy: 28, alt: "Zev Felix with a stethoscope" },
  "home.card.balance": { file: "ZevFelixDO-45.jpg", fx: 50, fy: 50, alt: "A mountain landscape" },
  "home.card.technology": { file: "ZevFelixDO-34.jpg", fx: 50, fy: 28, alt: "Zev Felix" },
  "home.card.outdoors": { file: "ZevFelixDO-56.jpg", fx: 50, fy: 35, alt: "Rock climbing in Yosemite" },
  "home.card.projects": { file: "ZevFelixDO-2.jpg", fx: 50, fy: 45, alt: "The Camp Grounded community" },
  "home.card.philosophy": { file: "ZevFelixDO-62.jpg", fx: 50, fy: 35, alt: "Zev Felix" },
  "home.card.writing": { file: "ZevFelixDO-47.jpg", fx: 50, fy: 50, alt: "Yosemite Valley" },
  // Camp grid
  "unplugged.hero": { file: "ZevFelixDO-2.jpg", fx: 50, fy: 45, alt: "Campers at Camp Grounded in the redwoods" },
  "unplugged.camp1": { file: "ZevFelixDO-5.jpg", fx: 50, fy: 38, alt: "A playful moment at Camp Grounded" },
  "unplugged.camp2": { file: "ZevFelixDO-8.jpg", fx: 50, fy: 40, alt: "Campers gathered at Camp Grounded" },
  "unplugged.camp3": { file: "ZevFelixDO-6.jpg", fx: 50, fy: 45, alt: "Campers relaxing on a couch in the redwoods at Camp Grounded" },
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
