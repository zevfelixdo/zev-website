import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { field } from "@/lib/pageContent";
import { getPageContent } from "@/lib/pageContent.server";

export const revalidate = 60;
import { createPublicClient } from "@/lib/supabase/public";
import type { CvEntry, Publication } from "@/types/database";
import { ExternalLink } from "lucide-react";
import { PrintButton } from "@/components/public/PrintButton";
import { PageHero } from "@/components/public/PageHero";
import { Reveal } from "@/components/public/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "cv",
    path: "/cv",
    fallbackTitle: "CV / Background",
    fallbackDescription:
      "Education, clinical training, publications, presentations, research, and leadership.",
  });
}

const CATEGORY_LABELS: Record<CvEntry["category"], string> = {
  education: "Education",
  training: "Clinical Training",
  experience: "Experience",
  publications: "Publications",
  presentations: "Presentations",
  research: "Research",
  leadership: "Leadership",
  awards: "Awards & Honors",
  other: "Other",
};

const CATEGORY_ORDER: CvEntry["category"][] = [
  "education",
  "training",
  "experience",
  "leadership",
  "research",
  "publications",
  "presentations",
  "awards",
  "other",
];

async function getCvData() {
  try {
    const supabase = createPublicClient();
    const [cvRes, pubRes] = await Promise.all([
      supabase
        .from("cv_entries")
        .select("*")
        .eq("is_published", true)
        .order("category")
        .order("position"),
      supabase
        .from("publications")
        .select("*")
        .eq("is_published", true)
        .order("year", { ascending: false })
        .order("position"),
    ]);
    return {
      entries: (cvRes.data ?? []) as CvEntry[],
      publications: (pubRes.data ?? []) as Publication[],
    };
  } catch {
    return { entries: [], publications: [] };
  }
}

export default async function CvPage() {
  const { entries, publications } = await getCvData();
  const c = await getPageContent("cv");
  const f = (key: string, fallback: string) => field(c, key, fallback);

  const grouped = CATEGORY_ORDER.reduce<Record<string, CvEntry[]>>((acc, cat) => {
    const items = entries.filter((e) => e.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow={f("hero.eyebrow", "CV / Background")}
        heading={f("hero.heading", "Curriculum Vitae")}
        collage={{ photoArea: "cv.portrait", cartoon: "standing", blobVariant: 1, blobClass: "text-primary/10", doodle: "sparkle", doodleClass: "text-accent" }}
        underDoodle={null}
      >
        <p>
          {f("hero.lead", "Education, training, leadership, publications, and the other things that do not fit neatly on a page but end up there anyway.")}
        </p>
        <PrintButton />
      </PageHero>

      <div className="border-t border-border" />

      {/* CV sections */}
      <section className="section-y container-content">
        <div className="max-w-3xl space-y-12">
          {Object.entries(grouped).map(([cat, items], gi) => (
            <Reveal key={cat} delay={gi * 40}>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-text-base mb-6 pb-2 border-b border-border">
                  {CATEGORY_LABELS[cat as CvEntry["category"]]}
                </h2>
                <ul className="space-y-6">
                  {items.map((entry) => (
                    <li key={entry.id} className="flex gap-6">
                      {/* Date column */}
                      <div className="w-28 flex-shrink-0 text-sm text-text-muted text-right pt-0.5">
                        {entry.start_date && (
                          <>
                            {entry.start_date}
                            {entry.end_date || entry.end_date === null ? (
                              <span>
                                {" "}&ndash;{" "}
                                {entry.end_date ?? "Present"}
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <p className="font-semibold text-text-base">
                          {entry.url ? (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors inline-flex items-center gap-1"
                            >
                              {entry.title} <ExternalLink size={12} />
                            </a>
                          ) : (
                            entry.title
                          )}
                        </p>
                        {entry.institution && (
                          <p className="text-sm text-text-muted mt-0.5">
                            {entry.institution}
                            {entry.location && ` · ${entry.location}`}
                          </p>
                        )}
                        {entry.description && (
                          <p className="text-sm text-text-muted mt-1 leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Publications */}
          {publications.length > 0 && (
            <Reveal>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-text-base mb-6 pb-2 border-b border-border">
                  Publications
                </h2>
                <ul className="space-y-5">
                  {publications.map((pub) => (
                    <li key={pub.id} className="text-sm text-text-base leading-relaxed">
                      {pub.authors && <span className="text-text-muted">{pub.authors}. </span>}
                      <span className="font-medium">
                        {pub.url ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:opacity-80 transition-opacity"
                          >
                            {pub.title}
                          </a>
                        ) : (
                          pub.title
                        )}
                      </span>
                      {pub.journal && <span className="text-text-muted italic"> {pub.journal}</span>}
                      {pub.year && <span className="text-text-muted"> ({pub.year})</span>}
                      {pub.volume && <span className="text-text-muted">; {pub.volume}</span>}
                      {pub.pages && <span className="text-text-muted">: {pub.pages}</span>}
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary hover:opacity-80 transition-opacity"
                        >
                          DOI
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>
      <DynamicSections pageSlug="cv" />
    </>
  );
}
