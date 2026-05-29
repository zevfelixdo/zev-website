// One-off: replace nav_items with the reshaped site navigation.
// Run from project root: node scripts/update-nav.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Load env from .env.local
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars");

const supabase = createClient(url, key, { auth: { persistSession: false } });

const items = [
  { label: "About", href: "/about", position: 0 },
  { label: "Family Medicine", href: "/medicine", position: 1 },
  { label: "Balance", href: "/balance", position: 2 },
  { label: "Technology", href: "/technology", position: 3 },
  { label: "Outdoors", href: "/outdoors", position: 4 },
  { label: "Projects", href: "/work", position: 5 },
  { label: "Philosophy", href: "/philosophy", position: 6 },
  { label: "Writing", href: "/writing", position: 7 },
  { label: "CV", href: "/cv", position: 8 },
  { label: "Contact", href: "/contact", position: 9 },
];

// Show current state
const { data: before, error: beforeErr } = await supabase
  .from("nav_items")
  .select("label, href, position")
  .order("position");
if (beforeErr) throw beforeErr;
console.log("BEFORE:", before.map((i) => i.label).join(", "));

// Delete all existing rows
const { error: delErr } = await supabase
  .from("nav_items")
  .delete()
  .not("id", "is", null);
if (delErr) throw delErr;

// Insert new nav
const { error: insErr } = await supabase.from("nav_items").insert(items);
if (insErr) throw insErr;

const { data: after, error: afterErr } = await supabase
  .from("nav_items")
  .select("label, href, position")
  .order("position");
if (afterErr) throw afterErr;
console.log("AFTER: ", after.map((i) => `${i.label} (${i.href})`).join(", "));
console.log("Done.");
