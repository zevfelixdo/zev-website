"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Media } from "@/types/database";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isImageMimeType, formatBytes } from "@/lib/utils";
import { Image, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImagePicker({ value, onChange, placeholder, className }: ImagePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://…"}
          className="flex-1 rounded border border-border bg-surface px-3 py-2.5 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex-shrink-0"
        >
          <Image size={14} className="mr-1.5" />
          Browse
        </Button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded border border-border text-text-muted hover:text-red-500 hover:border-red-300 transition-colors"
            aria-label="Clear image"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Preview */}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="h-28 w-auto rounded border border-border object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}

      {open && (
        <MediaPickerModal
          onSelect={(url) => { onChange(url); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setItems((data ?? []).filter((m: Media) => isImageMimeType(m.mime_type)) as Media[]);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = query
    ? items.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          (m.alt_text ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <Modal open onClose={onClose} title="Pick image from library" size="xl">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or alt text…"
            className="w-full pl-8 pr-3 py-2 rounded border border-border bg-surface text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* Grid */}
        <div className="h-[420px] overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-alt animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-text-muted text-sm">
              {query ? "No images match your search." : "No images uploaded yet."}
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((media) => (
                <button
                  key={media.id}
                  type="button"
                  onClick={() => setSelected(selected === media.public_url ? "" : media.public_url)}
                  onDoubleClick={() => onSelect(media.public_url)}
                  className={cn(
                    "group relative aspect-square rounded overflow-hidden border-2 transition-all",
                    selected === media.public_url
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  )}
                  title={media.alt_text ?? media.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.public_url}
                    alt={media.alt_text ?? media.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selected === media.public_url && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatBytes(media.size_bytes)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            {selected ? "Image selected. Double-click to insert quickly." : "Select an image, then click Insert."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
            >
              Insert
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
