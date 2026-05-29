"use client";

import { useState } from "react";
import type { CvEntry, Publication } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "education", label: "Education" },
  { value: "training", label: "Clinical Training" },
  { value: "experience", label: "Experience" },
  { value: "leadership", label: "Leadership" },
  { value: "research", label: "Research" },
  { value: "publications", label: "Publications" },
  { value: "presentations", label: "Presentations" },
  { value: "awards", label: "Awards & Honors" },
  { value: "other", label: "Other" },
];

const PUB_TYPE_OPTIONS = [
  { value: "article", label: "Journal Article" },
  { value: "chapter", label: "Book Chapter" },
  { value: "presentation", label: "Presentation" },
  { value: "poster", label: "Poster" },
  { value: "other", label: "Other" },
];

function emptyEntry(): Partial<CvEntry> {
  return { category: "education", title: "", institution: "", start_date: "", end_date: "", is_published: true };
}

function emptyPub(): Partial<Publication> {
  return { pub_type: "article", title: "", authors: "", journal: "", year: new Date().getFullYear(), is_published: true };
}

interface CvEditorProps {
  initialEntries: CvEntry[];
  initialPublications: Publication[];
}

export function CvEditor({ initialEntries, initialPublications }: CvEditorProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [pubs, setPubs] = useState(initialPublications);
  const [editEntry, setEditEntry] = useState<Partial<CvEntry> | null>(null);
  const [editPub, setEditPub] = useState<Partial<Publication> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"cv" | "pubs">("cv");

  const supabase = createClient();

  const saveEntry = async () => {
    if (!editEntry) return;
    setSaving(true);
    try {
      if (editEntry.id) {
        const { data, error } = await supabase
          .from("cv_entries").update(editEntry).eq("id", editEntry.id).select().single();
        if (error) throw error;
        setEntries((e) => e.map((x) => (x.id === data.id ? data as CvEntry : x)));
      } else {
        const { data, error } = await supabase
          .from("cv_entries").insert({ ...editEntry, position: entries.length }).select().single();
        if (error) throw error;
        setEntries((e) => [...e, data as CvEntry]);
      }
      setEditEntry(null);
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("cv_entries").delete().eq("id", id);
    setEntries((e) => e.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const savePub = async () => {
    if (!editPub) return;
    setSaving(true);
    try {
      if (editPub.id) {
        const { data, error } = await supabase
          .from("publications").update(editPub).eq("id", editPub.id).select().single();
        if (error) throw error;
        setPubs((p) => p.map((x) => (x.id === data.id ? data as Publication : x)));
      } else {
        const { data, error } = await supabase
          .from("publications").insert({ ...editPub, position: pubs.length }).select().single();
        if (error) throw error;
        setPubs((p) => [...p, data as Publication]);
      }
      setEditPub(null);
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const deletePub = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    await supabase.from("publications").delete().eq("id", id);
    setPubs((p) => p.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  // Group entries by category
  const grouped = CATEGORY_OPTIONS.reduce<Record<string, CvEntry[]>>((acc, cat) => {
    const items = entries.filter((e) => e.category === cat.value);
    if (items.length > 0) acc[cat.value] = items;
    return acc;
  }, {});

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[{ id: "cv" as const, label: "CV Entries" }, { id: "pubs" as const, label: "Publications" }].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === id ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-base"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CV Entries */}
      {tab === "cv" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setEditEntry(emptyEntry())}>
              <Plus size={14} /> Add entry
            </Button>
          </div>

          {Object.entries(grouped).map(([cat, items]) => {
            const catLabel = CATEGORY_OPTIONS.find((c) => c.value === cat)?.label ?? cat;
            return (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 px-1">{catLabel}</h3>
                <div className="bg-surface border border-border rounded-lg divide-y divide-border">
                  {items.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-4 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-base text-sm">{entry.title}</p>
                        {entry.institution && <p className="text-xs text-text-muted">{entry.institution}{entry.location ? ` · ${entry.location}` : ""}</p>}
                        {entry.start_date && <p className="text-xs text-text-muted">{entry.start_date}{entry.end_date ? ` — ${entry.end_date}` : " — Present"}</p>}
                        {!entry.is_published && <Badge variant="warning" size="sm" className="mt-1">Hidden</Badge>}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => setEditEntry(entry)}>
                          <Edit2 size={13} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {entries.length === 0 && (
            <p className="text-center text-text-muted text-sm py-12">No CV entries. Add one above.</p>
          )}
        </div>
      )}

      {/* Publications */}
      {tab === "pubs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setEditPub(emptyPub())}>
              <Plus size={14} /> Add publication
            </Button>
          </div>

          {pubs.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-12">No publications.</p>
          ) : (
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              {pubs.map((pub) => (
                <div key={pub.id} className="flex items-start gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-base text-sm">{pub.title}</p>
                    {pub.journal && <p className="text-xs text-text-muted italic">{pub.journal}{pub.year ? ` (${pub.year})` : ""}</p>}
                    {pub.authors && <p className="text-xs text-text-muted">{pub.authors}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setEditPub(pub)}>
                      <Edit2 size={13} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePub(pub.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Entry modal */}
      <Modal open={!!editEntry} onClose={() => setEditEntry(null)} title={editEntry?.id ? "Edit entry" : "Add entry"} size="lg">
        {editEntry && (
          <div className="p-6 space-y-4">
            <Select label="Category" options={CATEGORY_OPTIONS} value={editEntry.category ?? "education"} onChange={(e) => setEditEntry((x) => ({ ...x!, category: e.target.value as CvEntry["category"] }))} />
            <Input label="Title" required value={editEntry.title ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, title: e.target.value }))} />
            <Input label="Institution / Organization" value={editEntry.institution ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, institution: e.target.value }))} />
            <Input label="Location" value={editEntry.location ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, location: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start date" placeholder="2020 or Aug 2020" value={editEntry.start_date ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, start_date: e.target.value }))} />
              <Input label="End date" placeholder="2022 or Present" value={editEntry.end_date ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, end_date: e.target.value || null }))} />
            </div>
            <Textarea label="Description" value={editEntry.description ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, description: e.target.value }))} rows={3} />
            <Input label="URL" type="url" value={editEntry.url ?? ""} onChange={(e) => setEditEntry((x) => ({ ...x!, url: e.target.value || null }))} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="entry_pub" checked={editEntry.is_published ?? true} onChange={(e) => setEditEntry((x) => ({ ...x!, is_published: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="entry_pub" className="text-sm text-text-base">Visible on site</label>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border">
              <Button variant="ghost" onClick={() => setEditEntry(null)}>Cancel</Button>
              <Button onClick={saveEntry} loading={saving}>Save</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Publication modal */}
      <Modal open={!!editPub} onClose={() => setEditPub(null)} title={editPub?.id ? "Edit publication" : "Add publication"} size="lg">
        {editPub && (
          <div className="p-6 space-y-4">
            <Select label="Type" options={PUB_TYPE_OPTIONS} value={editPub.pub_type ?? "article"} onChange={(e) => setEditPub((x) => ({ ...x!, pub_type: e.target.value as Publication["pub_type"] }))} />
            <Input label="Title" required value={editPub.title ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, title: e.target.value }))} />
            <Input label="Authors" value={editPub.authors ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, authors: e.target.value }))} />
            <Input label="Journal / Venue" value={editPub.journal ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, journal: e.target.value }))} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Year" type="number" value={editPub.year?.toString() ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, year: parseInt(e.target.value) || null }))} />
              <Input label="Volume" value={editPub.volume ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, volume: e.target.value }))} />
              <Input label="Pages" value={editPub.pages ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, pages: e.target.value }))} />
            </div>
            <Input label="DOI" value={editPub.doi ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, doi: e.target.value }))} />
            <Input label="URL" type="url" value={editPub.url ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, url: e.target.value || null }))} />
            <Textarea label="Abstract" value={editPub.abstract ?? ""} onChange={(e) => setEditPub((x) => ({ ...x!, abstract: e.target.value }))} rows={3} />
            <div className="flex gap-3 justify-end pt-2 border-t border-border">
              <Button variant="ghost" onClick={() => setEditPub(null)}>Cancel</Button>
              <Button onClick={savePub} loading={saving}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
