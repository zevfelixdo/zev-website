"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { Project } from "@/types/database";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "idea", label: "Idea" },
  { value: "archived", label: "Archived" },
];

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "default"> = {
  active: "success",
  completed: "info",
  idea: "warning",
  archived: "default",
};

function emptyProject(): Partial<Project> {
  return { title: "", slug: "", description: "", status: "active", tags: [], is_published: false };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!editProject) return;
    setSaving(true);
    try {
      const isNew = !editProject.id;
      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects?id=${editProject.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProject),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (isNew) {
        setProjects((p) => [...p, data.project]);
      } else {
        setProjects((p) => p.map((x) => (x.id === data.project.id ? data.project : x)));
      }
      setEditProject(null);
      toast.success(isNew ? "Project created" : "Project saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((p) => p.filter((x) => x.id !== id));
      setDeleteId(null);
      toast.success("Project deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-base">Projects</h1>
          <p className="text-text-muted mt-1">Manage your portfolio and work.</p>
        </div>
        <Button onClick={() => setEditProject(emptyProject())}>
          <Plus size={15} /> New project
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-text-muted border-2 border-dashed border-border rounded-lg">
          <p className="text-sm mb-3">No projects yet.</p>
          <Button size="sm" onClick={() => setEditProject(emptyProject())}>Add first project</Button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-text-base truncate">{p.title}</p>
                  <Badge variant={STATUS_VARIANT[p.status] ?? "default"}>
                    {p.status}
                  </Badge>
                  {!p.is_published && <Badge variant="warning">Draft</Badge>}
                </div>
                {p.description && (
                  <p className="text-sm text-text-muted truncate">{p.description}</p>
                )}
                {p.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-1">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs text-text-muted border border-border rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.external_url && (
                  <a href={p.external_url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-text-base transition-colors">
                    <ExternalLink size={15} />
                  </a>
                )}
                <Button size="sm" variant="outline" onClick={() => setEditProject(p)}>
                  <Edit2 size={14} /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/create modal */}
      <Modal
        open={!!editProject}
        onClose={() => setEditProject(null)}
        title={editProject?.id ? "Edit project" : "New project"}
        size="lg"
      >
        {editProject && (
          <div className="p-6 space-y-4">
            <Input
              label="Title"
              required
              value={editProject.title ?? ""}
              onChange={(e) => setEditProject((p) => ({ ...p!, title: e.target.value }))}
            />
            <Input
              label="Slug"
              required
              value={editProject.slug ?? ""}
              onChange={(e) => setEditProject((p) => ({ ...p!, slug: e.target.value }))}
              helper="URL-friendly identifier: my-project"
            />
            <Textarea
              label="Description"
              value={editProject.description ?? ""}
              onChange={(e) => setEditProject((p) => ({ ...p!, description: e.target.value }))}
              rows={3}
            />
            <Input
              label="External URL"
              type="url"
              value={editProject.external_url ?? ""}
              onChange={(e) => setEditProject((p) => ({ ...p!, external_url: e.target.value || null }))}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={editProject.status ?? "active"}
              onChange={(e) => setEditProject((p) => ({ ...p!, status: e.target.value as Project["status"] }))}
            />
            <Input
              label="Tags"
              value={(editProject.tags ?? []).join(", ")}
              onChange={(e) =>
                setEditProject((p) => ({
                  ...p!,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                }))
              }
              helper="Comma-separated"
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={editProject.is_published ?? false}
                onChange={(e) => setEditProject((p) => ({ ...p!, is_published: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="is_published" className="text-sm text-text-base">
                Published (visible on site)
              </label>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-border">
              <Button variant="ghost" onClick={() => setEditProject(null)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save project</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete project?" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-text-muted">This will permanently delete the project and remove it from the search index.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
