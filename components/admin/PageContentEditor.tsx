"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PAGE_CONTENT_SCHEMA, type PageContent } from "@/lib/pageContent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "./RichTextEditor";
import toast from "react-hot-toast";
import { Save, FileText } from "lucide-react";

/**
 * Edits the bound text content of a page (CMS migration). Shown inside the page
 * editor for any page that has a content schema (lib/pageContent.ts). Saves to
 * site_settings under key `page:<slug>`. The public page reads these with
 * hardcoded fallbacks, so clearing a field restores the original copy.
 */
export function PageContentEditor({ slug }: { slug: string }) {
  const schema = PAGE_CONTENT_SCHEMA[slug];
  const supabase = createClient();
  const [values, setValues] = useState<PageContent>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!schema) return;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", `page:${slug}`)
      .maybeSingle()
      .then(({ data }) => {
        setValues((data?.value as PageContent) ?? {});
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!schema) return null;

  const set = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({ key: `page:${slug}`, value: values });
      if (error) throw error;
      toast.success("Page content saved. Live within a minute.");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h2 className="font-semibold text-text-base text-base">Page text content</h2>
        </div>
        <Button size="sm" onClick={save} loading={saving} disabled={!loaded}>
          <Save size={14} /> Save text
        </Button>
      </div>
      <p className="text-xs text-text-muted -mt-2">
        The actual words shown on this page (headings, paragraphs, lists), separate from the SEO
        title/description above. Edit any field; leave it blank to restore the original. The design
        stays the same, and changes go live within about a minute.
      </p>

      {!loaded ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="space-y-6">
          {schema.map((grp) => (
            <div key={grp.group} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted border-b border-border pb-1.5">
                {grp.group}
              </p>
              {grp.fields.map((f) =>
                f.type === "richtext" ? (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-text-base mb-1.5 block">{f.label}</label>
                    <RichTextEditor content={values[f.key] ?? ""} onChange={(html) => set(f.key, html)} />
                  </div>
                ) : f.type === "textarea" ? (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-text-base mb-1.5 block">{f.label}</label>
                    <textarea
                      value={values[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      rows={3}
                      className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ) : (
                  <Input key={f.key} label={f.label} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
