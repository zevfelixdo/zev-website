"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import type { Media } from "@/types/database";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ASPECTS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
];

export function CropModal({
  media,
  onClose,
  onCreated,
}: {
  media: Media;
  onClose: () => void;
  onCreated: (m: Media) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => setPixels(areaPixels), []);

  const save = async () => {
    if (!pixels) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: media.id, crop: pixels }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Crop failed");
      toast.success("Cropped copy added to library");
      onCreated(json.media as Media);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Crop failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Crop & resize" size="xl">
      <div className="p-4 sm:p-6 space-y-4">
        <p className="text-xs text-text-muted">
          Drag to reposition, scroll or use the slider to zoom. Saves a new cropped copy to the
          library (your original is untouched).
        </p>

        {/* Crop stage */}
        <div className="relative w-full h-[55vh] max-h-[460px] rounded-lg overflow-hidden bg-black">
          <Cropper
            image={media.public_url}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition
          />
        </div>

        {/* Aspect presets */}
        <div className="flex flex-wrap gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => setAspect(a.value)}
              className={cn(
                "px-3 py-1.5 rounded text-sm border transition-colors min-h-[40px]",
                aspect === a.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-muted hover:text-text-base"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted w-12">Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
            aria-label="Zoom"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={saving} disabled={!pixels}>Save cropped copy</Button>
        </div>
      </div>
    </Modal>
  );
}
