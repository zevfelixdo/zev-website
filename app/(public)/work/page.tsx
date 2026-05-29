import { DynamicSections } from "@/components/public/DynamicSections";
import type { Metadata } from "next";

export const revalidate = 60;
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/public/ScrollReveal";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

export const metadata: Metadata = {
  title: "Work & Projects",
  description:
    "Medical projects, writing, web apps, technology and healthcare tools, and creative projects.",
  alternates: { canonical: `${BASE}/work` },
};

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
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Work &amp; Projects
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-text-base leading-tight mb-6">
            Things I have built
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Medical projects, writing, web tools, and creative work. Some are finished. Some are
            ongoing. Some are just ideas.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Projects grid */}
      <section className="section-y container-content">
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
      </section>
      <DynamicSections pageSlug="work" />
    </>
  );
}
