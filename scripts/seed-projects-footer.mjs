// One-off: seed projects + update footer settings (social links).
// Run from project root: node scripts/seed-projects-footer.mjs
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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const projects = [
  {
    title: "Camp Grounded",
    slug: "camp-grounded",
    description:
      "A nationally recognized, screen-free summer camp for adults. As co-founder and creative director, I helped deliver 17 camps and 12 events for 3,000+ attendees — building spaces for presence, play, and real connection.",
    status: "completed",
    tags: ["Community", "Digital Wellness"],
    external_url: "https://www.newyorker.com/tech/annals-of-technology/into-the-woods-and-away-from-technology",
    position: 0,
    is_published: true,
  },
  {
    title: "Digital Detox",
    slug: "digital-detox",
    description:
      "One of the earliest digital-wellness movements. I designed brand and web assets and helped grow device-free retreats encouraging people to reconnect with themselves and each other.",
    status: "completed",
    tags: ["Digital Wellness", "Brand & Web"],
    external_url: null,
    position: 1,
    is_published: true,
  },
  {
    title: "Telemedicine & Hernia Outcomes Research",
    slug: "telemedicine-hernia-research",
    description:
      "Co-authored research on postoperative outcomes for patients evaluated through telemedicine-based preoperative consultations, and on novel ventral hernia repair techniques.",
    status: "completed",
    tags: ["Research", "Telemedicine"],
    external_url: "https://doi.org/10.1007/s10029-024-03095-9",
    position: 2,
    is_published: true,
  },
  {
    title: "zevfelix.com",
    slug: "personal-website",
    description:
      "This site — a Next.js and Supabase personal website with a custom CMS for writing, projects, pages, and a newsletter. Designed and built by me.",
    status: "active",
    tags: ["Web", "Next.js"],
    external_url: null,
    position: 3,
    is_published: true,
  },
];

const footer = {
  tagline: "Physician · Storyteller · Builder.",
  email: "",
  social: {
    twitter: "",
    linkedin: "https://www.linkedin.com/in/zev-felix-09b94a13",
    instagram: "",
  },
  copyright: "Zev Felix",
};

// Replace projects
const { error: delErr } = await supabase.from("projects").delete().not("id", "is", null);
if (delErr) throw new Error(`projects delete: ${delErr.message}`);
const { error: insErr } = await supabase.from("projects").insert(projects);
if (insErr) throw new Error(`projects insert: ${insErr.message}`);

// Upsert footer settings
const { error: fErr } = await supabase
  .from("site_settings")
  .upsert({ key: "footer", value: footer }, { onConflict: "key" });
if (fErr) throw new Error(`footer update: ${fErr.message}`);

console.log(`Inserted ${projects.length} projects and updated footer settings.`);
