import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { PlacedImage } from "@/components/public/PlacedImage";
import { PageHero } from "@/components/public/PageHero";
import { CollageRow } from "@/components/public/CollageRow";
import { Reveal } from "@/components/public/Reveal";
import { Doodle } from "@/components/public/Doodle";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "work",
    path: "/work",
    fallbackTitle: "Building Things That Bring People Together",
    fallbackDescription:
      "Camp Grounded, Digital Detox, telemedicine research, medical education, community health, and technology projects. All versions of the same question: how do we make things work better for humans?",
  });
}

const statusLabel: Record<Project["status"], string> = {
  active: "Active",
  completed: "Completed",
  idea: "Idea",
  archived: "Archived",
};

const statusVariant: Record<Project["status"], "success" | "info" | "warning" | "default"> = {
  active: "success",
  completed: "info",
  idea: "warning",
  archived: "default",
};

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, image:image_id(*)")
      .eq("is_published", true)
      .order("position");
    return (data ?? []) as unknown as Project[];
  } catch {
    return [];
  }
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Projects"
        heading="Building Things That Bring People Together"
        collage={{ cartoon: "high-five", blobVariant: 1, blobClass: "text-primary/10", doodle: "star", doodleClass: "text-accent" }}
      >
        <p>
          I&#8217;ve spent much of my life building things. Some of those things are tangible:
          furniture, websites, events, community spaces. Some are harder to see: experiences,
          conversations, relationships, communities.
        </p>
      </PageHero>

      {/* Hero band (renders only if assigned) */}
      <section className="container-content">
        <PlacedImage area="work.hero" aspect="3/2" priority sizes="(min-width:1280px) 1100px, 100vw" />
      </section>

      {/* Narrative */}
      <CollageRow
        mirror
        collage={{ cartoon: "teaching", blobVariant: 2, blobClass: "text-accent/10", doodle: "sparkle", doodleClass: "text-accent" }}
      >
        <p>
          Before medicine, I helped create Camp Grounded and Digital Detox, organizations built
          around helping people reconnect with themselves and each other in an increasingly
          connected world.
        </p>
        <p>
          Since entering healthcare, I&#8217;ve continued exploring similar questions through
          telemedicine research, medical education, community health initiatives, and technology
          projects.
        </p>
        <p className="font-serif text-2xl text-text-base leading-snug">
          The specific projects change. The underlying interest stays remarkably consistent.
        </p>
        <div className="space-y-2 font-serif text-xl text-text-base leading-snug border-l-2 border-accent pl-5">
          <p>How do we help people connect?</p>
          <p>How do we reduce unnecessary barriers?</p>
          <p>
            How do we design systems that support human flourishing rather than simply efficiency?
          </p>
        </div>
        <p>
          Whether I&#8217;m building a website, designing a presentation, conducting research,
          organizing an event, or caring for patients, I&#8217;m usually trying to solve some
          version of the same problem.
        </p>
        <p className="font-serif text-2xl sm:text-3xl text-text-base leading-snug">
          How do we make things work better for humans?
        </p>
      </CollageRow>

      {/* Projects grid */}
      <section className="relative bg-surface-alt section-y overflow-hidden">
        <Doodle name="loops" size={90} strokeWidth={4} className="absolute right-[8%] top-10 text-fun-leaf/60" />
        <div className="container-content relative">
          <Reveal>
            <h2 className="font-serif text-display-sm text-text-base mb-10">Selected work</h2>
          </Reveal>
          {projects.length === 0 ? (
            <p className="text-text-muted">Projects coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 60} variant="slide-up">
                  <article
                    id={project.slug}
                    className="group flex flex-col bg-surface border border-border rounded-lg shadow-card overflow-hidden h-full hover:shadow-dropdown hover:border-primary/20 transition-all duration-200"
                  >
                    {/* Image */}
                    {project.image ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={(project.image as unknown as { public_url: string }).public_url}
                          alt={(project.image as unknown as { alt_text?: string }).alt_text ?? project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-surface-alt flex items-center justify-center text-text-muted text-3xl font-serif select-none">
                        {project.title[0]}
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-6">
                      {/* Tags & status */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant={statusVariant[project.status] ?? "default"}>
                          {statusLabel[project.status]}
                        </Badge>
                        {project.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>

                      <h2 className="font-serif text-xl font-semibold text-text-base mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-sm text-text-muted leading-relaxed flex-1">
                          {project.description}
                        </p>
                      )}

                      {project.external_url && (
                        <a
                          href={project.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
                        >
                          View project <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <DynamicSections pageSlug="work" />
    </>
  );
}
