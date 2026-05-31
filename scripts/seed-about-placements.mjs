// One-off: assign curated photos to the About-page collage areas.
// Re-runnable (upsert by area). Run: node scripts/seed-about-placements.mjs
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

const placements = {
  "about.curiosity": { file: "ZevFelixDO-64.jpg", fx: 50, fy: 45, alt: "A temple in China, from a season of martial arts training" },
  "about.camp": { file: "ZevFelixDO-2.jpg", fx: 50, fy: 45, alt: "The Camp Grounded community in the redwoods" },
  "about.surgery": { file: "ZevFelixDO-33.jpg", fx: 50, fy: 28, alt: "Zev Felix with a stethoscope" },
  "about.family": { file: "ZevFelixDO-61.jpg", fx: 50, fy: 32, alt: "Zev Felix" },
  "about.maisy": { file: "ZevFelixDO-30.jpg", fx: 45, fy: 45, alt: "Maisy, a rescue dog, among California poppies" },
};

const names = [...new Set(Object.values(placements).map((p) => p.file))];
const { data: media, error: mErr } = await sb.from("media").select("id, name").in("name", names);
if (mErr) throw mErr;
const idByName = Object.fromEntries(media.map((m) => [m.name, m.id]));

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

console.log("Done.");
