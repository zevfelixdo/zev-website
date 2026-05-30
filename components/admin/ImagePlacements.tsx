"use client";

import { useState, useRef, useMemo } from "react";
import type { Media, ImagePlacement, ImageFit } from "@/types/database";
import type { AreaDef } from "@/lib/areas";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { cn, isImageMimeType } from "@/lib/utils";
import { ImageOff, Search } from "lucide-react";
import toast from "react-hot-toast";

const clampPct = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
const FITS: ImageFit[] = ["cover", "contain", "fill", "original"];

interface Props {
  areas: AreaDef[];
  initialPlacements: ImagePlacement[];
  images: Media[];
}

export function ImagePlacements({ areas, initialPlacements, images }: Props) {
  const [placements, setPlacements] = useState<Record<string, ImagePlacement>>(
    Object.fromEntries(initialPlacements.map((p) => [p.area, p]))
  );
  const [editing, setEditing] = useState<AreaDef | null>(null);
  const mediaById = useMemo(() => Object.fromEntries(images.map((m) => [m.id, m])), [images]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {areas.map((a) => {
          const p = placements[a.area];
          const media = p?.media_id ? mediaById[p.media_id] : null;
          const assigned = !!media && (p?.is_visible ?? true);
          return (
            <button
              key={a.area}
              type="button"
              onClick={() => setEditing(a)}
              className="text-left bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors"
            >
              <div className="relative w-full bg-surface-alt" style={{ aspectRatio: a.aspect }}>
                {media ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.public_url}
                    alt={p?.alt_override ?? media.alt_text ?? ""}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: `${p?.focal_x ?? 50}% ${p?.focal_y ?? 50}%`, opacity: assigned ? 1 : 0.4 }}
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                    <ImageOff size={22} />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-base truncate">{a.label}</p>
                  {!media ? (
                    <Badge>Empty</Badge>
                  ) : assigned ? (
                    <Badge variant="success">Set</Badge>
                  ) : (
                    <Badge variant="warning">Hidden</Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">{a.page} · {a.aspect}</p>
              </div>
            </button>
          );
        })}
      </div>

      {editing && (
        <PlacementEditor
          area={editing}
          placement={placements[editing.area]}
          images={images}
          onClose={() => setEditing(null)}
          onSaved={(p) => {
            setPlacements((prev) => ({ ...prev, [p.area]: p }));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function FocalStage({
  src,
  aspect,
  fit,
  fx,
  fy,
  onSet,
  maxWidth,
}: {
  src: string;
  aspect: string;
  fit: ImageFit;
  fx: number;
  fy: number;
  onSet: (x: number, y: number) => void;
  maxWidth?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        const r = ref.current!.getBoundingClientRect();
        onSet(clampPct(((e.clientX - r.left) / r.width) * 100), clampPct(((e.clientY - r.top) / r.height) * 100));
      }}
      className="relative block w-full rounded-lg overflow-hidden border border-border bg-surface-alt cursor-crosshair"
      style={{ aspectRatio: aspect, maxWidth }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-full h-full"
        style={{ objectFit: fit === "original" ? "contain" : fit, objectPosition: `${fx}% ${fy}%` }}
      />
      <span
        className="absolute w-5 h-5 rounded-full border-2 border-white bg-primary/70 ring-2 ring-primary -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${fx}%`, top: `${fy}%` }}
        aria-hidden
      />
    </button>
  );
}

function PlacementEditor({
  area,
  placement,
  images,
  onClose,
  onSaved,
}: {
  area: AreaDef;
  placement?: ImagePlacement;
  images: Media[];
  onClose: () => void;
  onSaved: (p: ImagePlacement) => void;
}) {
  const supabase = createClient();
  const [mediaId, setMediaId] = useState<string | null>(placement?.media_id ?? null);
  const [fit, setFit] = useState<ImageFit>(placement?.fit ?? "cover");
  const [fx, setFx] = useState(placement?.focal_x ?? 50);
  const [fy, setFy] = useState(placement?.focal_y ?? 50);
  const [useMobile, setUseMobile] = useState(placement?.focal_x_mobile != null);
  const [mfx, setMfx] = useState(placement?.focal_x_mobile ?? 50);
  const [mfy, setMfy] = useState(placement?.focal_y_mobile ?? 50);
  const [alt, setAlt] = useState(placement?.alt_override ?? "");
  const [caption, setCaption] = useState(placement?.caption ?? "");
  const [credit, setCredit] = useState(placement?.credit ?? "");
  const [visible, setVisible] = useState(placement?.is_visible ?? true);
  const [pickerOpen, setPickerOpen] = useState(!placement?.media_id);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const media = images.find((m) => m.id === mediaId) ?? null;
  const filtered = query
    ? images.filter((m) => (m.name + " " + (m.alt_text ?? "") + " " + m.tags.join(" ")).toLowerCase().includes(query.toLowerCase()))
    : images;

  const save = async (clear = false) => {
    setSaving(true);
    const row = {
      area: area.area,
      media_id: clear ? null : mediaId,
      fit,
      focal_x: fx,
      focal_y: fy,
      focal_x_mobile: useMobile ? mfx : null,
      focal_y_mobile: useMobile ? mfy : null,
      alt_override: alt || null,
      caption: caption || null,
      credit: credit || null,
      is_visible: clear ? false : visible,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("image_placements")
      .upsert(row, { onConflict: "area" })
      .select("*, media:media_id(*)")
      .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(clear ? "Image removed from this spot" : "Placement saved");
    onSaved(data as unknown as ImagePlacement);
  };

  return (
    <Modal open onClose={onClose} title={area.label} size="xl">
      <div className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
        <p className="text-xs text-text-muted">
          {area.page} · recommended {area.aspect}
          {area.note ? ` · ${area.note}` : ""}
        </p>

        {/* Chosen image + previews */}
        {media ? (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
            <div>
              <p className="text-xs font-medium text-text-muted mb-1.5">
                Desktop framing <span className="opacity-70">(click to set focal point)</span>
              </p>
              <FocalStage src={media.public_url} aspect={area.aspect} fit={fit} fx={fx} fy={fy} onSet={(x, y) => { setFx(x); setFy(y); }} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted mb-1.5">
                {useMobile ? "Mobile framing" : "Mobile preview"}
              </p>
              <FocalStage
                src={media.public_url}
                aspect={area.aspect}
                fit={fit}
                fx={useMobile ? mfx : fx}
                fy={useMobile ? mfy : fy}
                onSet={(x, y) => { if (useMobile) { setMfx(x); setMfy(y); } }}
                maxWidth={170}
              />
              <label className="flex items-center gap-2 text-xs text-text-base mt-2 cursor-pointer">
                <input type="checkbox" checked={useMobile} onChange={(e) => setUseMobile(e.target.checked)} className="rounded border-border" />
                Separate mobile focal point
              </label>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted">No image selected for this spot.</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setPickerOpen((v) => !v)}>
            {media ? "Change image" : "Choose image"}
          </Button>
          {media && (
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value as ImageFit)}
              className="rounded border border-border bg-surface px-3 py-2 text-sm text-text-base"
              aria-label="Image fit"
            >
              {FITS.map((f) => <option key={f} value={f}>fit: {f}</option>)}
            </select>
          )}
        </div>

        {/* Library picker */}
        {pickerOpen && (
          <div className="border border-border rounded-lg p-3 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search images…"
                className="w-full pl-8 pr-3 py-2 rounded border border-border bg-surface text-sm"
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {filtered.filter((m) => isImageMimeType(m.mime_type) && !m.is_hidden).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setMediaId(m.id); setFx(m.focal_x ?? 50); setFy(m.focal_y ?? 50); setPickerOpen(false); }}
                  className={cn(
                    "relative aspect-square rounded overflow-hidden border-2 transition-colors",
                    mediaId === m.id ? "border-primary" : "border-transparent hover:border-primary/40"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.public_url} alt={m.alt_text ?? m.name} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        {media && (
          <>
            <Input label="Alt text (overrides the image default)" value={alt} onChange={(e) => setAlt(e.target.value)} helper="Describe the image in this context" />
            <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <Input label="Credit" value={credit} onChange={(e) => setCredit(e.target.value)} />
            <label className="flex items-center gap-2.5 text-sm text-text-base cursor-pointer">
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="rounded border-border" />
              Show on the site
            </label>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border">
          {placement?.media_id ? (
            <Button variant="ghost" onClick={() => save(true)} disabled={saving}>Remove from this spot</Button>
          ) : <span />}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={() => save(false)} loading={saving} disabled={!mediaId}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
