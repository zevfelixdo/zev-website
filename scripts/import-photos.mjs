// One-off: import the photo set into the Supabase `media` bucket + `media` table.
// Idempotent: skips any image whose `name` already exists in the table.
// Run from project root: node scripts/import-photos.mjs "/abs/path/to/images"
import { readFileSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const SRC = process.argv[2] || "/Users/zevfelix/Documents/images for website";

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

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Existing names to avoid duplicates
const { data: existing, error: exErr } = await supabase.from("media").select("name");
if (exErr) throw exErr;
const have = new Set((existing ?? []).map((m) => m.name));

let added = 0,
  skipped = 0;
for (const fname of files) {
  if (have.has(fname)) {
    skipped++;
    continue;
  }
  const buf = readFileSync(join(SRC, fname));
  const meta = await sharp(buf).metadata();
  const ext = extname(fname).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  const filePath = `uploads/${slugify(basename(fname, extname(fname)))}-${randomUUID().slice(0, 8)}.${ext}`;

  const { error: upErr } = await supabase.storage.from("media").upload(filePath, buf, {
    contentType: mime,
    upsert: false,
  });
  if (upErr) {
    console.error("upload failed", fname, upErr.message);
    continue;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(filePath);

  const { error: dbErr } = await supabase.from("media").insert({
    name: fname,
    file_path: filePath,
    public_url: publicUrl,
    mime_type: mime,
    size_bytes: buf.length,
    width: meta.width ?? null,
    height: meta.height ?? null,
    alt_text: "Zev Felix",
    tags: ["zev", "portrait", "photoshoot"],
  });
  if (dbErr) {
    console.error("db insert failed", fname, dbErr.message);
    continue;
  }
  added++;
  process.stdout.write(`\rImported ${added} (${meta.width}x${meta.height})  `);
}
console.log(`\nDone. Added ${added}, skipped ${skipped} (already present).`);
