"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Page, PageSection, SectionType } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "./RichTextEditor";
import { ImagePicker } from "./ImagePicker";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Save,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "intro_text", label: "Intro Text" },
  { value: "rich_text", label: "Rich Text" },
  { value: "nav_cards", label: "Navigation Cards" },
  { value: "image_text", label: "Image + Text" },
  { value: "quote", label: "Quote" },
  { value: "callout", label: "Callout Box" },
  { value: "gallery", label: "Gallery (grid / masonry / carousel)" },
  { value: "parallax", label: "Parallax Banner" },
  { value: "video", label: "Video (upload or YouTube/Vimeo)" },
  { value: "timeline", label: "Timeline" },
  { value: "cards", label: "Cards Grid" },
  { value: "faq", label: "FAQ (expandable)" },
  { value: "testimonials", label: "Testimonials" },
  { value: "divider", label: "Divider" },
];

// Field types for the generic repeatable-items editor
type ItemField = { key: string; label: string; type?: "text" | "textarea" | "image" | "rich" };

function ItemsEditor({
  content,
  onChange,
  fields,
  itemsKey = "items",
  addLabel = "Add item",
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
  fields: ItemField[];
  itemsKey?: string;
  addLabel?: string;
}) {
  const items: Record<string, string>[] = Array.isArray(content[itemsKey])
    ? (content[itemsKey] as Record<string, string>[])
    : [];
  const setItems = (next: Record<string, string>[]) => onChange({ ...content, [itemsKey]: next });
  const add = () => setItems([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  const upd = (i: number, key: string, value: string) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-surface-alt">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">Item {i + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1.5 text-text-muted hover:text-text-base disabled:opacity-30" aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="px-1.5 text-text-muted hover:text-text-base disabled:opacity-30" aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700 ml-1">Remove</button>
            </div>
          </div>
          {fields.map((f) =>
            f.type === "textarea" ? (
              <div key={f.key}>
                <label className="text-sm font-medium text-text-base mb-1.5 block">{f.label}</label>
                <textarea value={it[f.key] ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} rows={2} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ) : f.type === "image" ? (
              <div key={f.key}>
                <label className="text-sm font-medium text-text-base mb-1.5 block">{f.label}</label>
                <ImagePicker value={it[f.key] ?? ""} onChange={(url) => upd(i, f.key, url)} placeholder="Pick from library or paste URL" />
              </div>
            ) : f.type === "rich" ? (
              <div key={f.key}>
                <label className="text-sm font-medium text-text-base mb-1.5 block">{f.label}</label>
                <RichTextEditor content={it[f.key] ?? ""} onChange={(html) => upd(i, f.key, html)} />
              </div>
            ) : (
              <Input key={f.key} label={f.label} value={it[f.key] ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} />
            )
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-primary hover:opacity-80 font-medium">+ {addLabel}</button>
    </div>
  );
}

interface SortableSectionProps {
  section: PageSection;
  onUpdate: (id: string, content: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (id: string, visible: boolean) => void;
}

function SortableSection({ section, onUpdate, onDelete, onToggleVisible }: SortableSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const content = section.content as Record<string, unknown>;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-surface border border-border rounded-lg overflow-hidden",
        !section.is_visible && "opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-alt border-b border-border">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text-base"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted flex-1">
          {section.type.replace(/_/g, " ")}
        </span>
        <button
          onClick={() => onToggleVisible(section.id, !section.is_visible)}
          className="p-1.5 rounded text-text-muted hover:text-text-base hover:bg-surface transition-colors"
          aria-label={section.is_visible ? "Hide section" : "Show section"}
        >
          {section.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-1.5 rounded text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Delete section"
        >
          <Trash2 size={15} />
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 rounded text-text-muted hover:text-text-base hover:bg-surface transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Content editor */}
      {expanded && (
        <div className="p-4 space-y-4">
          <SectionContentEditor
            type={section.type}
            content={content}
            onChange={(updated) => onUpdate(section.id, updated)}
          />
        </div>
      )}
    </div>
  );
}

interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

function GalleryEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const images: GalleryImage[] = Array.isArray(content.images)
    ? (content.images as GalleryImage[])
    : [];
  const columns = (content.columns as number) ?? 3;

  const setImages = (next: GalleryImage[]) => onChange({ ...content, images: next });

  const addImage = () =>
    setImages([...images, { url: "", alt: "", caption: "" }]);

  const removeImage = (i: number) =>
    setImages(images.filter((_, idx) => idx !== i));

  const updateImage = (i: number, field: keyof GalleryImage, value: string) => {
    const next = images.map((img, idx) =>
      idx === i ? { ...img, [field]: value } : img
    );
    setImages(next);
  };

  const galleryLayout = (content.layout as string) ?? "grid";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm font-medium text-text-base mb-1.5 block">Layout</label>
          <select
            value={galleryLayout}
            onChange={(e) => onChange({ ...content, layout: e.target.value })}
            className="w-44 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="grid">Grid (square tiles)</option>
            <option value="masonry">Masonry (varied heights)</option>
            <option value="carousel">Carousel (swipeable)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-text-base mb-1.5 block">Columns</label>
          <select
            value={columns}
            onChange={(e) => onChange({ ...content, columns: parseInt(e.target.value) })}
            className="w-32 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
          </select>
        </div>
      </div>
      <p className="text-xs text-text-muted">Click any image on the site to open it full-screen (lightbox). Carousels and the lightbox support swipe on touch devices.</p>

      <div className="space-y-3">
        {images.map((img, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-surface-alt">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-muted">Image {i + 1}</span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-text-base mb-1.5 block">Image</label>
              <ImagePicker value={img.url} onChange={(url) => updateImage(i, "url", url)} placeholder="Pick from library or paste URL" />
            </div>
            <Input
              label="Alt text"
              value={img.alt}
              onChange={(e) => updateImage(i, "alt", e.target.value)}
            />
            <Input
              label="Caption (optional)"
              value={img.caption}
              onChange={(e) => updateImage(i, "caption", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="text-sm text-primary hover:opacity-80 font-medium"
      >
        + Add image
      </button>
    </div>
  );
}

function SectionContentEditor({
  type,
  content,
  onChange,
}: {
  type: SectionType;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  switch (type) {
    case "hero":
      return (
        <div className="space-y-3">
          <Input label="Heading" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Subheading</label>
            <textarea value={(content.subheading as string) ?? ""} onChange={(e) => set("subheading", e.target.value)} rows={3} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Background image</label>
            <ImagePicker value={(content.backgroundImageUrl as string) ?? ""} onChange={(url) => set("backgroundImageUrl", url)} placeholder="Pick from library or paste URL" />
            <p className="text-xs text-text-muted mt-1">Leave blank for solid-color hero.</p>
          </div>
          <Input label="Background video URL (.mp4)" placeholder="https://…supabase.co/storage/…" value={(content.backgroundVideoUrl as string) ?? ""} onChange={(e) => set("backgroundVideoUrl", e.target.value)} helper="Self-hosted .mp4 or .webm — will autoplay muted on loop." />
          <Input label="Overlay opacity" type="number" placeholder="0.4" value={(content.overlayOpacity as string) ?? ""} onChange={(e) => set("overlayOpacity", parseFloat(e.target.value) || 0.4)} helper="0 = transparent, 1 = full black. Only applies when background media is set." />
          <Input label="CTA label" value={(content.ctaLabel as string) ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} />
          <Input label="CTA link" value={(content.ctaHref as string) ?? ""} onChange={(e) => set("ctaHref", e.target.value)} />
          <Input label="Secondary CTA label" value={(content.ctaSecondaryLabel as string) ?? ""} onChange={(e) => set("ctaSecondaryLabel", e.target.value)} />
          <Input label="Secondary CTA link" value={(content.ctaSecondaryHref as string) ?? ""} onChange={(e) => set("ctaSecondaryHref", e.target.value)} />
        </div>
      );
    case "rich_text":
    case "intro_text":
      return (
        <div>
          <label className="text-sm font-medium text-text-base mb-1.5 block">Content</label>
          <RichTextEditor
            content={(content.html as string) ?? (content.text as string) ?? ""}
            onChange={(html) => set("html", html)}
          />
        </div>
      );
    case "image_text":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Image</label>
            <ImagePicker value={(content.imageUrl as string) ?? ""} onChange={(url) => set("imageUrl", url)} placeholder="Pick from library or paste URL" />
          </div>
          <Input label="Image alt text" value={(content.imageAlt as string) ?? ""} onChange={(e) => set("imageAlt", e.target.value)} />
          <Input label="Image caption" value={(content.caption as string) ?? ""} onChange={(e) => set("caption", e.target.value)} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="imageRight" checked={!!(content.imageRight as boolean)} onChange={(e) => set("imageRight", e.target.checked)} className="w-4 h-4 accent-primary" />
            <label htmlFor="imageRight" className="text-sm text-text-base">Image on the right (text on left)</label>
          </div>
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Body text</label>
            <RichTextEditor content={(content.html as string) ?? ""} onChange={(html) => set("html", html)} />
          </div>
        </div>
      );
    case "gallery":
      return (
        <GalleryEditor content={content} onChange={onChange} />
      );
    case "parallax":
      return (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Background image</label>
            <ImagePicker value={(content.imageUrl as string) ?? ""} onChange={(url) => set("imageUrl", url)} placeholder="Pick a wide landscape from the library" />
          </div>
          <Input label="Alt text" value={(content.alt as string) ?? ""} onChange={(e) => set("alt", e.target.value)} helper="Describe the image; leave blank if purely decorative" />
          <Input label="Heading (optional, shown over the image)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <Input label="Subheading (optional)" value={(content.subheading as string) ?? ""} onChange={(e) => set("subheading", e.target.value)} />
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-text-base mb-1.5 block">Height</label>
              <select value={(content.height as string) ?? "md"} onChange={(e) => set("height", e.target.value)} className="w-36 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="sm">Short</option>
                <option value="md">Medium</option>
                <option value="lg">Tall</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-base mb-1.5 block">Vertical focal ({(content.focalY as number) ?? 50}%)</label>
              <input type="range" min={0} max={100} value={(content.focalY as number) ?? 50} onChange={(e) => set("focalY", parseInt(e.target.value))} className="w-40 accent-primary mt-3" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-text-base cursor-pointer">
            <input type="checkbox" checked={content.overlay !== false} onChange={(e) => set("overlay", e.target.checked)} className="rounded border-border" />
            Darken image for text legibility
          </label>
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <Input label="Subheading (optional)" value={(content.subheading as string) ?? ""} onChange={(e) => set("subheading", e.target.value)} />
          <Input
            label="Video URL"
            placeholder="YouTube URL, Vimeo URL, or direct .mp4/.webm URL"
            value={(content.url as string) ?? ""}
            onChange={(e) => set("url", e.target.value)}
            helper="Supports YouTube, Vimeo, or self-hosted video from Media Library"
          />
          <Input
            label="Poster / thumbnail image URL"
            placeholder="https://…"
            value={(content.poster as string) ?? ""}
            onChange={(e) => set("poster", e.target.value)}
            helper="Shown before the video plays (for self-hosted and YouTube)"
          />
          <Input label="Caption" value={(content.caption as string) ?? ""} onChange={(e) => set("caption", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Aspect ratio</label>
            <select value={(content.aspectRatio as string) ?? "16/9"} onChange={(e) => set("aspectRatio", e.target.value)} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="16/9">16:9 (widescreen)</option>
              <option value="4/3">4:3 (standard)</option>
              <option value="1/1">1:1 (square)</option>
              <option value="9/16">9:16 (portrait/vertical)</option>
            </select>
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Quote text</label>
            <textarea value={(content.text as string) ?? ""} onChange={(e) => set("text", e.target.value)} rows={3} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <Input label="Attribution" value={(content.cite as string) ?? ""} onChange={(e) => set("cite", e.target.value)} />
        </div>
      );
    case "callout":
      return (
        <div className="space-y-3">
          <Input label="Title" value={(content.title as string) ?? ""} onChange={(e) => set("title", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Body</label>
            <textarea value={(content.body as string) ?? ""} onChange={(e) => set("body", e.target.value)} rows={3} className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>
      );
    case "nav_cards":
      return (
        <ItemsEditor
          content={content}
          onChange={onChange}
          itemsKey="cards"
          addLabel="Add card"
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Link (e.g. /about)" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
        />
      );
    case "timeline":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <ItemsEditor
            content={content}
            onChange={onChange}
            itemsKey="items"
            addLabel="Add timeline entry"
            fields={[
              { key: "period", label: "Period (e.g. 2018–2020)" },
              { key: "title", label: "Title" },
              { key: "body", label: "Description", type: "textarea" },
            ]}
          />
        </div>
      );
    case "cards":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Columns</label>
            <select value={(content.columns as number) ?? 3} onChange={(e) => set("columns", parseInt(e.target.value))} className="w-32 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary">
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <ItemsEditor
            content={content}
            onChange={onChange}
            itemsKey="cards"
            addLabel="Add card"
            fields={[
              { key: "title", label: "Title" },
              { key: "body", label: "Body", type: "textarea" },
              { key: "imageUrl", label: "Image (optional)", type: "image" },
            ]}
          />
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <ItemsEditor
            content={content}
            onChange={onChange}
            itemsKey="items"
            addLabel="Add question"
            fields={[
              { key: "question", label: "Question" },
              { key: "answer", label: "Answer", type: "rich" },
            ]}
          />
        </div>
      );
    case "testimonials":
      return (
        <div className="space-y-3">
          <Input label="Heading (optional)" value={(content.heading as string) ?? ""} onChange={(e) => set("heading", e.target.value)} />
          <div>
            <label className="text-sm font-medium text-text-base mb-1.5 block">Columns</label>
            <select value={(content.columns as number) ?? 2} onChange={(e) => set("columns", parseInt(e.target.value))} className="w-32 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <ItemsEditor
            content={content}
            onChange={onChange}
            itemsKey="items"
            addLabel="Add testimonial"
            fields={[
              { key: "quote", label: "Quote", type: "textarea" },
              { key: "name", label: "Name" },
              { key: "role", label: "Role / context (optional)" },
            ]}
          />
        </div>
      );
    default:
      return null;
  }
}

interface PageEditorProps {
  page: Page;
  sections: PageSection[];
}

export function PageEditor({ page: initialPage, sections: initialSections }: PageEditorProps) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  const supabase = createClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        position: i,
      }));
      setSections(reordered);

      // Persist positions
      await Promise.all(
        reordered.map((s) =>
          supabase.from("page_sections").update({ position: s.position }).eq("id", s.id)
        )
      );
    },
    [sections, supabase]
  );

  const handleSectionUpdate = useCallback(
    async (id: string, content: Record<string, unknown>) => {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, content: content as PageSection["content"] } : s))
      );
      await supabase.from("page_sections").update({ content }).eq("id", id);
    },
    [supabase]
  );

  const handleSectionDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this section?")) return;
      setSections((prev) => prev.filter((s) => s.id !== id));
      await supabase.from("page_sections").delete().eq("id", id);
      toast.success("Section deleted");
    },
    [supabase]
  );

  const handleToggleVisible = useCallback(
    async (id: string, visible: boolean) => {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_visible: visible } : s))
      );
      await supabase.from("page_sections").update({ is_visible: visible }).eq("id", id);
    },
    [supabase]
  );

  const handleAddSection = async (type: SectionType) => {
    const newSection = {
      page_id: page.id,
      type,
      position: sections.length,
      content: {},
      is_visible: true,
    };
    const { data, error } = await supabase
      .from("page_sections")
      .insert(newSection)
      .select()
      .single();
    if (error) {
      toast.error("Failed to add section");
      return;
    }
    setSections((prev) => [...prev, data as PageSection]);
    setShowAddSection(false);
    toast.success("Section added");
  };

  const handleSavePageMeta = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("pages")
      .update({
        title: page.title,
        description: page.description,
        status: page.status,
      })
      .eq("id", page.id);
    setSaving(false);
    if (error) toast.error("Failed to save");
    else toast.success("Page saved");
  };

  const handlePublish = async () => {
    const newStatus = page.status === "published" ? "draft" : "published";
    const updates: Partial<Page> = { status: newStatus };
    if (newStatus === "published") updates.published_at = new Date().toISOString();
    const { error } = await supabase.from("pages").update(updates).eq("id", page.id);
    if (error) toast.error("Failed to update status");
    else {
      setPage((p) => ({ ...p, ...updates }));
      toast.success(newStatus === "published" ? "Page published" : "Page set to draft");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base mb-3 transition-colors"
          >
            <ArrowLeft size={15} /> Pages
          </Link>
          <h1 className="font-serif text-2xl font-semibold text-text-base">{page.title}</h1>
          <p className="text-sm text-text-muted mt-0.5">/{page.slug}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            {page.status === "published" ? (
              <><EyeOff size={14} /> Set to Draft</>
            ) : (
              <><Globe size={14} /> Publish</>
            )}
          </Button>
          <Button size="sm" onClick={handleSavePageMeta} loading={saving}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>

      {/* Page metadata */}
      <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-text-base text-sm">Page metadata</h2>
        <Input
          label="Page title"
          value={page.title}
          onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))}
        />
        <div>
          <label className="text-sm font-medium text-text-base mb-1.5 block">Description / meta</label>
          <textarea
            value={page.description ?? ""}
            onChange={(e) => setPage((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-text-base">Content sections</h2>
          <Button size="sm" variant="outline" onClick={() => setShowAddSection((v) => !v)}>
            <Plus size={14} /> Add section
          </Button>
        </div>

        {/* Add section panel */}
        {showAddSection && (
          <div className="mb-4 p-4 bg-surface border border-border rounded-lg">
            <p className="text-sm font-medium text-text-base mb-3">Choose a section type</p>
            <div className="flex flex-wrap gap-2">
              {SECTION_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleAddSection(value)}
                  className="px-3 py-1.5 text-sm border border-border rounded hover:border-primary hover:text-primary transition-colors bg-surface"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {sections.length === 0 && (
          <div className="text-center py-12 text-text-muted border-2 border-dashed border-border rounded-lg">
            <p className="text-sm">No sections yet. Add one above.</p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  onUpdate={handleSectionUpdate}
                  onDelete={handleSectionDelete}
                  onToggleVisible={handleToggleVisible}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
