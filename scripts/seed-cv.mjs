// One-off: populate cv_entries + publications from Zev's real CV.
// Run from project root: node scripts/seed-cv.mjs
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

const publications = [
  {
    title:
      "Postoperative outcomes among patients evaluated via telemedicine-based preoperative consultations for inguinal hernia care",
    authors: "Felix Z, Salgado-Garza G, Porter CG, Nouboussi N, O'Connor AL, Bazarian A, Nikolian VC",
    journal: "Hernia",
    year: 2024,
    volume: "28(6)",
    pages: "2151-2157",
    doi: "10.1007/s10029-024-03095-9",
    url: "https://doi.org/10.1007/s10029-024-03095-9",
    pub_type: "article",
    position: 0,
  },
  {
    title:
      "Short-Term Outcomes of Transabdominal Preperitoneal Ventral Hernia Repair With Rectus Aponeuroplasty (TAPP-RA) for the Management of Incisional Hernias",
    authors: "Bosley ME, Felix Z, Salgado-Garza G, Lansing S, Nikolian VC",
    journal: "Journal of Abdominal Wall Surgery",
    year: 2024,
    volume: "3",
    pages: "13195",
    doi: "10.3389/jaws.2024.13195",
    url: "https://doi.org/10.3389/jaws.2024.13195",
    pub_type: "article",
    position: 1,
  },
];

const E = (category, title, institution, location, start_date, end_date, description, url, position) => ({
  category, title, institution, location, start_date, end_date, description: description || null, url: url || null, position,
});

const entries = [
  // Clinical training
  E("training", "Preliminary Surgery Resident (PGY-1)", "UCSF East Bay (Highland / Alameda Health)", "Oakland, CA", "Jun 2025", null, "Current.", null, 0),

  // Education
  E("education", "Doctor of Osteopathic Medicine (DO)", "Touro University California, College of Osteopathic Medicine (TUCOM)", "Vallejo, CA", "2021", "2025", null, null, 0),
  E("education", "Post-Baccalaureate Pre-Medical Certificate", "Mills College", "Oakland, CA", "2018", "2020", "GPA 4.00.", null, 1),
  E("education", "B.S., Business Administration (Cinematic Arts emphasis)", "University of Southern California", "Los Angeles, CA", "2008", "2012", "Minor: Web Technologies & Applications. GPA 3.60. International enrichment: Chulalongkorn University, Bangkok (2010); Learning About International Commerce, Hong Kong (2009).", null, 2),

  // Experience
  E("experience", "Co-Founder & Creative Director (Business & Marketing)", "Camp Grounded — Summer Camp for Adults", "Oakland, CA", "2013", "2018", "Built nationally recognized, screen-free retreats promoting presence, community, and well-being. Directed 200+ staff and volunteers to deliver 17 camps and 12 events for 3,000+ attendees across the U.S.", null, 0),
  E("experience", "Graphic Designer & Web Developer", "Digital Detox", "Oakland, CA", "2012", "2013", "Relaunched the company website and brand assets; produced marketing materials for statewide events.", null, 1),
  E("experience", "Medical Assistant", "Weiwei Xu, MD — Urology", "Castro Valley, CA", "2020", "2021", "Supported urologic procedures and patient education; implemented COVID-19 safety protocols; streamlined scheduling, documentation, and specimen handling.", null, 2),
  E("experience", "Founder & Owner", "Pink Buffalo T-Shirt Co.", "Fresno, CA", "2005", "2010", null, null, 3),
  E("experience", "Selected Internships (Film & Media)", "Sony Pictures, Anisa Productions (America's Next Top Model), Chromatic Films, Lucent Dossier, Project Comet", "Los Angeles / Santa Monica, CA", "2010", "2011", null, null, 4),
  E("experience", "Health Coach Volunteer", "Lifelong Medical Care — Trust Clinic", "Oakland, CA", "2019", "2020", "Assisted with social-determinants-of-health navigation (housing), care access, and weekly food-pantry operations.", null, 5),
  E("experience", "COVID-19 Testing Volunteer", "Umoja Health & Unidos en Salud", "Oakland, CA", "2020", "2021", "Provided free testing and resource access for underserved communities.", null, 6),
  E("experience", "Sexual Health Education Facilitator", "Touro Med Teaches Sex Ed — Berkeley Youth Alternatives", "Berkeley, CA", "2022", "2023", "Delivered comprehensive, age-appropriate sexual health education.", null, 7),

  // Leadership
  E("leadership", "Vice President of Communications, COMSEC", "Touro University California (TUCOM)", null, "2022", "2023", "Partnered with faculty and administration to streamline school-wide communications; led projects to enhance academic resources, study-space technology, and library facilities.", null, 0),
  E("leadership", "Admissions Interviewer & Student Panelist", "Touro University California (TUCOM)", null, "2021", "2024", "Interviewed applicants and served on Q&A panels on academics, rotations, and campus culture.", null, 1),
  E("leadership", "Board Member, Anesthesia Club", "Touro University California (TUCOM)", null, "2022", "2023", "Organized hands-on airway/intubation workshops; coordinated faculty and guest speakers.", null, 2),
  E("leadership", "Board Member, GOAT Club (Go Outdoors at Touro)", "Touro University California (TUCOM)", null, "2022", "2023", "Led wellness-focused outdoor activities (intro to climbing, hikes, bonfires) to build community and support mental health.", null, 3),
  E("leadership", "Co-Leader, Post-Bac Pre-Medical Club", "Mills College", null, "2018", "2020", null, null, 4),
  E("leadership", "Student Leadership", "University of Southern California", null, "2008", "2012", "Business of Cinematic Arts Network (Advisor & Webmaster); Freshman Mentor; Marshall Career Advantage Program; Ski & Snowboard Team; Building Government (Elected Floor Rep).", null, 5),

  // Presentations — invited
  E("presentations", "What Wolves, Children, and Great Wilderness Medical Providers Have in Common", "Breckwild", "Breckenridge, CO", "May 2025", null, "Invited talk.", null, 0),
  E("presentations", "Digital Detox: Unplug and Reimagine Your Life", "Esalen Institute", "Big Sur, CA", "Feb 2019", null, "Invited workshop.", "https://www.esalen.org/faculty/zev-felix", 1),
  E("presentations", "Digital Detox: Unplug and Reimagine Your Life", "Esalen Institute", "Big Sur, CA", "Feb 2018", null, "Invited workshop.", "https://www.esalen.org/faculty/zev-felix", 2),
  // Presentations — clinical/academic (selected)
  E("presentations", "Starling's Law of Capillary Water Movement (Basic Science Presentation)", "UCSF East Bay Grand Rounds", null, "2025", null, null, null, 3),
  E("presentations", "The Sternal Brace: a novel osteopathic diagnostic screening tool to rule out cardiac chest pain in the ED (Journal Club)", "Live Oak Medicine", null, "2024", null, null, null, 4),
  E("presentations", "Autonomic Nervous System & Treatment of the Acutely Ill Hospitalized Patient: An Osteopathic Approach with OMM", "Live Oak Medicine", null, "2024", null, null, null, 5),
  E("presentations", "An 81-year-old male with Toxic Epidermal Necrolysis (Case Study)", "NorthBay Medical Center", "Fairfield, CA", "2024", null, null, null, 6),
  E("presentations", "Identifying Acute Compartment Syndrome: A Brief Overview for the Surgical Patient", "NorthBay Medical Center", "Fairfield, CA", "2024", null, null, null, 7),
  E("presentations", "Obesity & Metabolic and Bariatric Surgery (MBS): Indications and Overview", "NorthBay Medical Center", "Fairfield, CA", "2024", null, null, null, 8),
  E("presentations", "The Crucial Role of RSV Vaccine in Pregnancy", "NorthBay Medical Center", "Fairfield, CA", "2023", null, null, null, 9),

  // Awards
  E("awards", "Alpha Lambda Delta Honor Society", "University of Southern California", null, "2008", "2012", null, null, 0),

  // Other
  E("other", "Interests", null, null, null, null, "Traditional outdoor rock climbing, wilderness medicine, swimming, gardening, baking, cooking and hot-sauce making, and community building. Shaolin Kung Fu & meditation intensive (Kunming, China) — 3-month training in 2018. Euclid Manor co-housing community contributor (event production & engagement) — 6 years.", null, 0),
];

// Replace existing data
for (const tbl of ["cv_entries", "publications"]) {
  const { error } = await supabase.from(tbl).delete().not("id", "is", null);
  if (error) throw new Error(`${tbl} delete: ${error.message}`);
}

const { error: e1 } = await supabase.from("publications").insert(publications);
if (e1) throw new Error(`publications insert: ${e1.message}`);
const { error: e2 } = await supabase.from("cv_entries").insert(entries);
if (e2) throw new Error(`cv_entries insert: ${e2.message}`);

console.log(`Inserted ${publications.length} publications and ${entries.length} CV entries.`);
