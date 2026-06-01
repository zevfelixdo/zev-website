"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { ArrowUp, ArrowDown, Trash2, Plus, Save, ExternalLink, GripVertical } from "lucide-react";
import type { NavItem } from "@/types/database";

type Row = Pick<NavItem, "id" | "label" | "href" | "is_external" | "position"> & { _new?: boolean };

export default function AdminNavigationPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleted, setDeleted] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("nav_items")
      .select("id, label, href, is_external, position")
      .is("parent_id", null)
      .order("position")
      .then(({ data }) => {
        setRows((data ?? []) as Row[]);
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (id: string, field: keyof Row, value: string | boolean) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    setRows((rs) => {
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const addRow = () =>
    setRows((rs) => [
      ...rs,
      { id: `new-${Date.now()}`, label: "New link", href: "/", is_external: false, position: rs.length, _new: true },
    ]);

  const removeRow = (id: string) => {
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (!id.startsWith("new-")) setDeleted((d) => [...d, id]);
  };

  const save = async () => {
    setSaving(true);
    try {
      // Deletes
      if (deleted.length) {
        await supabase.from("nav_items").delete().in("id", deleted);
      }
      // Upserts with fresh positions
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const payload = { label: r.label.trim() || "Untitled", href: r.href.trim() || "/", is_external: r.is_external, position: i, updated_at: new Date().toISOString() };
        if (r._new || r.id.startsWith("new-")) {
          await supabase.from("nav_items").insert(payload);
        } else {
          await supabase.from("nav_items").update(payload).eq("id", r.id);
        }
      }
      setDeleted([]);
      // reload to get real ids
      const { data } = await supabase
        .from("nav_items")
        .select("id, label, href, is_external, position")
        .is("parent_id", null)
        .order("position");
      setRows((data ?? []) as Row[]);
      toast.success("Navigation saved. It updates on the site within a minute.");
    } catch (e) {
      toast.error("Failed to save navigation");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="text-text-muted text-sm p-4">Loading…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">Navigation Menu</h1>
          <p className="text-text-muted mt-1">
            The links in the top header. Drag order with the arrows, edit labels and destinations, then save.
          </p>
        </div>
        <Button onClick={save} loading={saving}><Save size={15} /> Save menu</Button>
      </div>

      <div className="bg-surface border border-border rounded-lg divide-y divide-border">
        {rows.length === 0 && (
          <p className="p-6 text-sm text-text-muted">No menu items yet. Add your first link below.</p>
        )}
        {rows.map((r, i) => (
          <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex sm:flex-col gap-1 sm:pt-6">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded text-text-muted hover:text-text-base disabled:opacity-30" aria-label="Move up"><ArrowUp size={16} /></button>
              <span className="hidden sm:block text-text-muted self-center"><GripVertical size={14} /></span>
              <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="p-1 rounded text-text-muted hover:text-text-base disabled:opacity-30" aria-label="Move down"><ArrowDown size={16} /></button>
            </div>
            <div className="flex-1 min-w-0">
              <Input label="Label" value={r.label} onChange={(e) => update(r.id, "label", e.target.value)} />
            </div>
            <div className="flex-1 min-w-0">
              <Input label="Link (e.g. /about or https://…)" value={r.href} onChange={(e) => update(r.id, "href", e.target.value)} />
            </div>
            <label className="flex items-center gap-1.5 text-xs text-text-base whitespace-nowrap pb-2.5">
              <input type="checkbox" checked={r.is_external} onChange={(e) => update(r.id, "is_external", e.target.checked)} className="w-4 h-4 accent-primary" />
              <ExternalLink size={12} /> New tab
            </label>
            <button onClick={() => removeRow(r.id)} className="p-2 rounded text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors pb-2.5" aria-label="Delete item">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addRow}><Plus size={15} /> Add menu item</Button>

      <p className="text-xs text-text-muted">
        Tip: internal links start with <code className="font-mono">/</code> (like <code className="font-mono">/about</code>). External links start with <code className="font-mono">https://</code> and should open in a new tab.
      </p>
    </div>
  );
}
