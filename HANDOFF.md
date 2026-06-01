# Zev Felix Website — Project Handoff / Status

_Last updated: 2026-06-01. This doc is the single source of truth for resuming work. Read it top to bottom._

---

## TL;DR

- **What it is:** Personal/professional site for **Zev Felix, DO** (Family Medicine resident). Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Postgres/Auth/Storage) + TipTap. Deployed on Vercel.
- **Live:** https://zev-website.vercel.app · **Admin:** https://zev-website.vercel.app/admin · **GitHub:** github.com/zevfelixdo/zev-website
- **Local:** `/Users/zevfelix/zev-website`
- **State:** A large **playful redesign + CMS/admin upgrade is complete and on `main`** (now `77c3856`). `main` and `redesign` are identical and pushed. Homepage text is CMS-bound and per-page SEO is wired site-wide (see CMS section).
- **⚠️ Deploy lag (2026-06-01):** Production now serves **`443a5b3`** (full redesign + CMS + "Zev Felix, DO" wordmark + new hero — confirmed live). Two newer commits — `d37c624` (homepage CMS binding) + `77c3856` (site-wide per-page SEO) — are on `main` but **not yet deployed**: Vercel's free-tier **daily build limit** is hit again (latest commit status = failure → build-rate-limit). They deploy together via the scheduled job below (it builds current `main`) or a manual redeploy once the window resets.

---

## How to deploy (important)

GitHub→Vercel auto-deploys on push to `main`. We hit the **Hobby daily build cap** ("retry in 24h").

- **Auto:** a macOS `launchd` one-shot (`~/Library/LaunchAgents/com.zevfelix.redeploy.plist` + `~/.zev-redeploy.sh`) fires **2026-06-01 21:38**, POSTs the Vercel **deploy hook**, verifies the live site, logs to `~/.zev-redeploy.log`, and self-removes.
- **Manual (anytime after the window resets):** `curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_7hozez5xKgNEppXoY5AmJvClLHLG/VZFjgPFzWD"` OR Vercel dashboard → Deployments → Redeploy.
- **Cancel the scheduled job:** `launchctl bootout gui/$(id -u)/com.zevfelix.redeploy && rm ~/Library/LaunchAgents/com.zevfelix.redeploy.plist`
- **Roll back production:** Vercel dashboard → Deployments → Instant Rollback (or `git reset --hard v1-baseline && git push -f origin main`). Tag `v1-baseline` = the old pre-redesign design.

**Branch workflow:** edit on `redesign`, then `git checkout main && git merge --ff-only redesign && git push origin main`. Keep them in sync. End commits with the Claude co-author trailer.

**Verify a change:** `npm run typecheck` then `npm run build` (must show ✓, 44 routes). Run the dev server via the preview tool (`.claude/launch.json` → "web", autoPort). NOTE: the dev server gets flaky after many edits (next/image + CSS go stale) — **restart it for a clean view**; not a production issue.

---

## The redesign (design language)

Warm editorial + **playful "childlike wonder"** collage: kinetic type, organic blobs, hand-drawn doodles, the cartoons, bright fun colors, film grain. Reduced-motion-safe + no-JS-safe throughout. Works light + dark (tokens swap via `data-theme`).

**Reusable components (`components/public/`):**
- Motion: `RevealHeading` (kinetic word reveal, trigger mount|scroll), `Reveal` (scroll reveal; `variant="reveal"|"rule-draw"`), `Marquee`, `MagneticButton`, `ParallaxView`, `CountUp`.
- Decorative: `Doodle` (hand-drawn SVG: sparkle/star/heart/sun/squiggle/underline/loops/circle/arrow/path; `stretch` to circle/underline text), `Blob` (3 organic shapes, currentColor), `Cartoon` (renders `/cartoons/*`), `AboutCollage` (layered cluster: photo polaroid + cartoon + 2 blobs + doodles, auto colour `tone`), `PageHero` (kinetic hero + optional collage), `CollageRow` (alternating text+collage chapter; `mirror`, `tinted`), `BikeEasterEgg` (click hero bike → wheelie), `PageLoader`.
- `globals.css` adds: `.kin-*`, `.reveal`/`.is-in`, `.rule-draw`, `.marquee`, `.scroll-cue`, `.float-soft`, `.grain-overlay`, `.polaroid`, `.tape`, `.sticker`, `.bike-ride`.
- **Fun palette:** `tailwind.config.ts` `fun.{sky,leaf,sun,tangerine,coral}`. `lib/tones.ts` = deterministic per-cluster colour tones (used by AboutCollage). Use `text-fun-*` (valid Tailwind opacities only: /10 /20 /25 etc., NOT /8 /12).

**Cartoons:** 27 transparent PNGs in `public/cartoons/` (originals on `~/Desktop/zev-cartoons` had white bgs; knocked out via sharp flood-fill). Registry + alt/size in `lib/cartoons.ts`. To add: drop PNG in public/cartoons (knock out white bg), add a key to the registry.

**Every public page + 404** uses this system. Page heroes are type-forward; the homepage hero is a "cast" of cartoons (Zev biking with Maisy is the centerpiece) — **not** a big headshot.

---

## CMS / Admin

**Robust admin exists** at `/admin` (Supabase auth + `user_roles`; middleware-protected). Data model = 17 tables (pages, page_sections, media, image_placements, projects, cv_entries, publications, posts, nav_items, themes, site_settings, newsletter_*, contact_submissions, audit_logs, search_index).

**Editable today via GUI (no code):**
- Blog/writing (TipTap WYSIWYG), Media library (images/SVG/PDF/video/docs + focal point + crop + alt/caption/credit/tags/visibility), Image placements (named slots), Projects, CV + Publications, Theme, Newsletter, Settings (footer/SEO/profile), Audit log.
- **NEW admin tools (this engagement):** `/admin/navigation` (nav menu GUI; was SQL-only), Pages **create/duplicate/delete** in `/admin/pages`, page-builder **FAQ + Testimonials** block types + finished cards/nav_cards/timeline editors.

**⚠️ The big architectural fact:** most public page **copy is hardcoded** in `app/(public)/**/page.tsx`. The block CMS (`page_sections`) only **appends** sections at the bottom of pages via `DynamicSections`.

**CMS content-binding (migration in progress):** to make a hardcoded page's text editable WITHOUT changing its design, we bind each text field to the DB:
- `lib/pageContent.ts` = `PAGE_CONTENT_SCHEMA` (per-slug field list) + `field()` helper (client-safe). `lib/pageContent.server.ts` = `getPageContent(slug)` (reads `site_settings` key `page:<slug>`). Admin edits via the **`PageContentEditor`** panel inside the page editor (shown for any slug with a schema).
- **Bound so far: `/medicine`, `/about`, and `/` (home)** (full text + per-page SEO). Pattern to migrate another page: add a `PAGE_CONTENT_SCHEMA` entry + make the page `async` + replace strings with `f("key", "exact fallback")`. (Home also added a `buildPageMetadata({ absoluteTitle })` option so its bespoke title skips the `%s | Zev Felix` template.) Long-term cleaner home = a dedicated `page_content` table (needs a Supabase migration).

**SEO controls (wired site-wide):** `lib/seo.ts`. Root layout default title/description ← Settings→SEO (`getSeoDefaults`, safe fallbacks). Per-page SEO ← `pages` row via `buildPageMetadata`, now applied on **every content page** (home, medicine, about, balance, technology, philosophy, outdoors, work, unplugged, path, cv, contact) via `generateMetadata`. Each `pages` row was seeded to the page's current title/description (also the in-code fallback) so nothing regressed; `scripts/seed-pages-seo.mjs` re-seeds them (parsing values straight from the page files) and `scripts/seed-home-seo.mjs` seeds home. balance/technology/philosophy `pages` rows were CREATED (none existed).

---

## Recommended next steps
1. ~~Bind the Home page text~~ **DONE** (`d37c624`): home text + per-page SEO are CMS-bound (and the bespoke title is now `absolute`).
2. ~~Per-page SEO sweep + create balance/technology/philosophy rows~~ **DONE** (`77c3856`): every content page uses `generateMetadata → buildPageMetadata`; rows seeded via `scripts/seed-pages-seo.mjs`.
3. **Bind more page TEXT** (optional, same `f()` + `PAGE_CONTENT_SCHEMA` pattern as home/medicine/about) for the still-hardcoded pages: outdoors, work, philosophy, balance, technology, unplugged, path, cv, contact, writing. Each page's copy currently lives in its `page.tsx`.
4. **3 draft blog posts** are seeded (status=draft) awaiting review/publish at `/admin/writing`.
5. Longer-term: dedicated `page_content` table; reusable content blocks; granular editor vs admin roles; multi-site = add a `site_id` column + scope queries/RLS.

---

## Credentials & gotchas
- **Supabase project:** `jmcxmzaycayzlxjauyrw` (URL `https://jmcxmzaycayzlxjauyrw.supabase.co`). Anon `sb_publishable_…xVZoCC`, service `sb_secret_…oJ93ls` (in `.env.local`). **NO DDL access** via API — schema changes need Zev to paste SQL in the Supabase SQL editor.
- **Admin login:** `zevfelix@gmail.com`. The documented password `ZevAdmin2025` **no longer works** (looks rotated). Reset in Supabase Auth if needed.
- **Vercel:** project `prj_7hozez5xKgNEppXoY5AmJvClLHLG`, team `team_dETiFfQNV24ezp9AiTEmKoGw`. Deploy hook URL above.
- **Content rules:** NO em dashes (use colons/commas/periods; en dash only for date ranges). Voice = warm, reflective, short declarative sentences. Keep all of Zev's copy intact.
- **Scripts** (`scripts/`, run with `node`): `seed-placements.mjs`, `seed-about-placements.mjs`, `seed-draft-posts.mjs`, `seed-home-seo.mjs`, `seed-pages-seo.mjs` — patterns for seeding via service role.
- **Still open:** buy custom domain `zevfelix.com` (then update Vercel domain + NEXT_PUBLIC_SITE_URL + Supabase site URL); rotate admin password.
