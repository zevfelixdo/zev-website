// Seed 3 starter blog posts as DRAFTS (status='draft') for Zev to review,
// edit, and publish from /admin/writing. Re-runnable: skips slugs that exist.
// Run: node scripts/seed-draft-posts.mjs
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

const posts = [
  {
    title: "What Climbing Taught Me About Medicine",
    slug: "what-climbing-taught-me-about-medicine",
    tags: ["Medicine", "Outdoors"],
    reading_time_minutes: 3,
    excerpt:
      "Pay attention. Trust your partner. Stay present. Take the next step. The rules of the wall turn out to be the rules of the clinic.",
    body: `<p>I started climbing in a gym in Oakland more than a decade ago. I was not very good. I am still working on it.</p>
<p>What kept me coming back was not the exercise. It was the way climbing forces you to be honest. The wall does not care about your job title or your plans for the weekend. It asks one thing: can you make the next move, right now, with what you have?</p>
<p>Over the years I noticed the lessons did not stay at the gym. They followed me into the hospital.</p>
<h2>Pay attention</h2>
<p>Good climbing begins with looking. Where are the holds. Where is your weight. What is your partner doing. Medicine begins the same way. Most of what matters in a visit is available to anyone willing to slow down and notice it.</p>
<h2>Trust your partner</h2>
<p>You do not climb hard routes alone. Someone is holding your rope. In the clinic, the patient is holding something too: their story, their worries, their sense of what a good life looks like. The work only goes well when that trust runs both directions.</p>
<h2>Stay present, take the next step</h2>
<p>The wall punishes you for thinking three moves ahead and forgetting the one in front of you. So does a hard conversation. You cannot fix a whole life in fifteen minutes. You can take the next honest step together, and then the one after that.</p>
<blockquote>Health is rarely built in dramatic moments. It is built through small, repeated actions practiced over time.</blockquote>
<p>That is true on granite. It is true in the exam room. It is true for most things worth doing.</p>`,
  },
  {
    title: "Balance Is Not a Reward You Earn Later",
    slug: "balance-is-not-a-reward",
    tags: ["Balance"],
    reading_time_minutes: 3,
    excerpt: "For years I thought rest was something you earned after the hard work. I had it backwards.",
    body: `<p>For a long time I believed balance was a prize. Work hard enough, long enough, and eventually you would earn the right to rest.</p>
<p>I had it backwards.</p>
<p>At Camp Grounded I watched hundreds of capable people arrive exhausted. Their calendars were full. Their careers were moving. By every external measure they were doing well. And many of them were running on empty, not because they lacked discipline, but because they had built lives with no room for recovery.</p>
<p>Surgical training showed me the same thing from the inside. I saw the beauty of intense commitment. I also saw what happens when there is no space for sleep, movement, friendship, or rest.</p>
<h2>A sturdier kind of ambition</h2>
<p>Balance gets mistaken for lowering your standards. I think it is the opposite. Balance is what lets people sustain excellence. It is what lets relationships survive hard seasons. It is what lets good work continue over decades instead of years.</p>
<p>It is not about escaping responsibility. It is about building a life sturdy enough to carry responsibility without collapsing under it.</p>
<blockquote>The goal is not perfection. The goal is a life that works well enough to keep showing up for the things that matter.</blockquote>
<p>That is the principle I try to live by. It is also the one I bring into the exam room, every day.</p>`,
  },
  {
    title: "What Matters to You?",
    slug: "what-matters-to-you",
    tags: ["Philosophy", "Medicine"],
    reading_time_minutes: 3,
    excerpt:
      "One of the most important questions in medicine is also one of the simplest. Not what is the matter with you. What matters to you.",
    body: `<p>One of the most important questions in medicine is also one of the simplest.</p>
<p>Not what is the matter with you.</p>
<p>What matters to you.</p>
<p>It is a small change in wording. It changes almost everything that follows.</p>
<p>A treatment plan that works on paper but does not fit a person's life is rarely a good plan. A recommendation that ignores someone's family, finances, culture, or goals usually fails before it begins. Health does not happen in isolation. It happens inside the context of a life.</p>
<h2>Where the question came from</h2>
<p>I first learned to ask it long before medical school, around campfires at Camp Grounded, listening to people describe what they had quietly set aside to keep up with everything else. The question cut through the noise every time.</p>
<p>Later, walking with my brother Levi through a serious illness, I saw how much it mattered when a clinician took the time to understand the person in front of them, not just the chart.</p>
<h2>What it looks like in practice</h2>
<p>My goal is not to create perfect patients. It is to help people make meaningful progress from wherever they actually are.</p>
<p>Sometimes that means medication. Sometimes a procedure. Often it means sleep, movement, connection, or a hard conversation. Usually it is some combination of all of them.</p>
<blockquote>The most effective care I have seen is rarely the most complicated. It is the care that meets people where they are and helps them move forward.</blockquote>
<p>So that is where I try to start. With a question, and then with listening.</p>`,
  },
];

const now = new Date().toISOString();
for (const p of posts) {
  const { data: existing } = await sb.from("posts").select("id").eq("slug", p.slug).maybeSingle();
  if (existing) {
    console.log("skip (exists):", p.slug);
    continue;
  }
  const { error } = await sb.from("posts").insert({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    tags: p.tags,
    reading_time_minutes: p.reading_time_minutes,
    status: "draft",
    is_featured: false,
    published_at: null,
    created_at: now,
    updated_at: now,
  });
  console.log(p.slug, "->", error ? "ERR " + error.message : "inserted as DRAFT");
}
console.log("Done. Review at /admin/writing, then publish.");
