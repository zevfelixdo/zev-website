"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Edit2, Globe, EyeOff, Plus, Copy, Trash2 } from "lucide-react";
import type { Page } from "@/types/database";

export function PagesManager({ initialPages }: { initialPages: Page[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  const uniqueSlug = async (base: string) => {
    let s = base || "page";
    let n = 1;
    // ensure uniqueness against current list + db
    while (pages.some((p) => p.slug === s)) s = `${base}-${++n}`;
    const { data } = await supabase.from("pages").select("id").eq("slug", s).maybeSingle();
    if (data) s = `${base}-${Date.now().toString().slice(-4)}`;
    return s;
  };

  const createPage = async () => {
    if (!title.trim()) return toast.error("Give the page a title");
    setBusy(true);
    try {
      const s = await uniqueSlug(slug.trim() || slugify(title));
      const { data, error } = await supabase
        .from("pages")
        .insert({ title: title.trim(), slug: s, status: "draft", is_system: false })
        .select()
        .single();
      if (error) throw error;
      toast.success("Page created");
      router.push(`/admin/pages/${data.id}`);
    } catch (e) {
      toast.error("Could not create page (slug may already exist)");
      setBusy(false);
    }
  };

  const duplicatePage = async (page: Page) => {
    setBusy(true);
    try {
      const s = await uniqueSlug(`${page.slug}-copy`);
      const { data: newPage, error } = await supabase
        .from("pages")
        .insert({ title: `${page.title} (Copy)`, slug: s, description: page.description, status: "draft", is_system: false })
        .select()
        .single();
      if (error) throw error;
      // copy sections
      const { data: sections } = await supabase
        .from("page_sections")
        .select("type, position, content, is_visible")
        .eq("page_id", page.id)
        .order("position");
      if (sections && sections.length) {
        await supabase.from("page_sections").insert(
          sections.map((sec) => ({ ...sec, page_id: newPage.id }))
        );
      }
      setPages((ps) => [...ps, newPage as Page]);
      toast.success("Page duplicated as a draft");
    } catch (e) {
      toast.error("Could not duplicate page");
    } finally {
      setBusy(false);
    }
  };

  const deletePage = async (page: Page) => {
    if (page.is_system) return toast.error("System pages cannot be deleted");
    if (!confirm(`Delete "${page.title}" and all its sections? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("pages").delete().eq("id", page.id);
      if (error) throw error;
      setPages((ps) => ps.filter((p) => p.id !== page.id));
      toast.success("Page deleted");
    } catch (e) {
      toast.error("Could not delete page");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">Pages</h1>
          <p className="text-text-muted mt-1">Create, duplicate, edit, publish, or remove pages and their sections.</p>
        </div>
        <Button onClick={() => setCreating((v) => !v)}><Plus size={15} /> New page</Button>
      </div>

      {creating && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold text-text-base text-sm">Create a new page</h2>
          <Input label="Title" value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} placeholder="e.g. Speaking" />
          <Input label="URL slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} helper={`Page will live at /${slug || "…"}`} />
          <div className="flex gap-2">
            <Button onClick={createPage} loading={busy}>Create &amp; edit</Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-text-base truncate">{page.title}</p>
                {page.is_system && <Badge variant="info" size="sm">System</Badge>}
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>/{page.slug}</span>
                <span>·</span>
                <span>Updated {formatDate(page.updated_at, { month: "short", day: "numeric" })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={page.status === "published" ? "success" : "warning"}>
                {page.status === "published" ? (<><Globe size={10} className="mr-1 inline" />Published</>) : (<><EyeOff size={10} className="mr-1 inline" />Draft</>)}
              </Badge>
              <Button as="link" href={`/admin/pages/${page.id}`} size="sm" variant="outline"><Edit2 size={14} /> Edit</Button>
              <button onClick={() => duplicatePage(page)} disabled={busy} className="p-2 rounded text-text-muted hover:text-text-base hover:bg-surface-alt transition-colors disabled:opacity-40" title="Duplicate page" aria-label="Duplicate page">
                <Copy size={15} />
              </button>
              <button onClick={() => deletePage(page)} disabled={busy || page.is_system} className="p-2 rounded text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30" title={page.is_system ? "System pages can't be deleted" : "Delete page"} aria-label="Delete page">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
