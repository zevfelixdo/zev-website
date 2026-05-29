import type { Metadata } from "next";
import { searchContent } from "@/lib/search";
import { SearchBar } from "@/components/public/SearchBar";
import { ContactForm } from "@/components/public/ContactForm";
import Link from "next/link";
import { FileText, Briefcase, GraduationCap, BookOpen } from "lucide-react";
import type { SearchResult } from "@/types/database";

export const metadata: Metadata = {
  title: "Search",
  description: "Search all content on this site.",
};

const typeIcons: Record<string, React.ElementType> = {
  page: FileText,
  project: Briefcase,
  cv_entry: GraduationCap,
  publication: BookOpen,
};

const typeLabels: Record<string, string> = {
  page: "Page",
  project: "Project",
  cv_entry: "CV",
  publication: "Publication",
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const results: SearchResult[] = query ? await searchContent(query) : [];
  const hasResults = results.length > 0;

  return (
    <>
      {/* Search hero */}
      <section className="section-y container-content">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base mb-6">
            {query ? `Results for "${query}"` : "Search the site"}
          </h1>
          <SearchBar initialQuery={query} variant="hero" />
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Results or no-results */}
      <section className="section-y container-content">
        {!query && (
          <p className="text-text-muted">Type something above to search all pages, projects, and writing on this site.</p>
        )}

        {query && !hasResults && (
          <div className="max-w-2xl space-y-8">
            <div>
              <p className="text-lg font-medium text-text-base mb-2">
                We could not find anything for &ldquo;{query}&rdquo;.
              </p>
              <p className="text-text-muted leading-relaxed">
                Try a different search term, or browse the navigation above. If you are looking for
                something specific and cannot find it, feel free to get in touch directly.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-text-base mb-5">
                Send a message
              </h2>
              <ContactForm />
            </div>
          </div>
        )}

        {hasResults && (
          <div className="max-w-2xl">
            <p className="text-sm text-text-muted mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <ul className="divide-y divide-border">
              {results.map((result) => {
                const Icon = typeIcons[result.content_type] ?? FileText;
                return (
                  <li key={result.id} className="py-5">
                    <Link
                      href={result.url}
                      className="group flex items-start gap-4"
                    >
                      <span className="mt-1 p-2 rounded bg-surface-alt text-text-muted group-hover:text-primary group-hover:bg-primary/8 transition-colors flex-shrink-0">
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                          {typeLabels[result.content_type] ?? result.content_type}
                        </p>
                        <h2 className="font-serif text-lg font-semibold text-text-base group-hover:text-primary transition-colors mb-1">
                          {result.title}
                        </h2>
                        {result.excerpt && (
                          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                            {result.excerpt}
                          </p>
                        )}
                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {result.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-muted border border-border"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
