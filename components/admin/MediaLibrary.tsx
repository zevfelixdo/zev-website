"use client";

import { useState, useRef, useCallback } from "react";
import type { Media } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatBytes, isImageMimeType, isVideoMimeType, isPdfMimeType, validateFile, formatDate } from "@/lib/utils";
import { Upload, Trash2, Edit2, Search, Image, FileVideo, FileText, File } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function MediaIcon({ mimeType }: { mimeType: string }) {
  if (isImageMimeType(mimeType)) return <Image size={20} className="text-purple-500" />;
  if (isVideoMimeType(mimeType)) return <FileVideo size={20} className="text-blue-500" />;
  if (isPdfMimeType(mimeType)) return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-text-muted" />;
}

interface UploadModalProps {
  onUploaded: (media: Media) => void;
  onClose: () => void;
}

function UploadModal({ onUploaded, onClose }: UploadModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("alt_text", altText);
      formData.set("caption", caption);
      formData.set("tags", tags);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      toast.success("File uploaded");
      onUploaded(json.media as Media);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surface-alt"
        )}
      >
        <Upload size={24} className="mx-auto mb-2 text-text-muted" />
        {file ? (
          <p className="text-sm font-medium text-text-base">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-text-base">Drop file here or click to browse</p>
            <p className="text-xs text-text-muted mt-1">Images (10 MB), Videos (200 MB), PDFs (50 MB)</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept="image/*,video/*,application/pdf,.doc,.docx"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Input label="Alt text" value={altText} onChange={(e) => setAltText(e.target.value)} helper="Describe the image for accessibility" />
      <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
      <Input label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} helper="Comma-separated: climbing, medicine, portrait" />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} loading={uploading} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
}

interface MediaLibraryClientProps {
  initialMedia: Media[];
}

export function MediaLibraryClient({ initialMedia }: MediaLibraryClientProps) {
  const [media, setMedia] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);

  const supabase = createClient();

  const filtered = media.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.alt_text ?? "").toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUploaded = useCallback((newMedia: Media) => {
    setMedia((prev) => [newMedia, ...prev]);
  }, []);

  const handleDelete = async (id: string) => {
    const item = media.find((m) => m.id === id);
    if (!item) return;

    // Delete from storage
    await supabase.storage.from("media").remove([item.file_path]);
    // Delete from DB
    await supabase.from("media").delete().eq("id", id);

    setMedia((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    toast.success("File deleted");
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Search media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 border border-border rounded bg-surface text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload size={15} /> Upload file
        </Button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Upload size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">{search ? "No results" : "No files uploaded yet."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-surface border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => setSelected(item)}
            >
              {isImageMimeType(item.mime_type) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.public_url}
                  alt={item.alt_text ?? item.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-surface-alt">
                  <MediaIcon mimeType={item.mime_type} />
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium text-text-base truncate">{item.name}</p>
                <p className="text-xs text-text-muted">{formatBytes(item.size_bytes)}</p>
              </div>
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload file" size="md">
        <UploadModal onUploaded={handleUploaded} onClose={() => setUploadOpen(false)} />
      </Modal>

      {/* Media detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Media details" size="lg">
        {selected && (
          <div className="p-6 space-y-4">
            {isImageMimeType(selected.mime_type) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.public_url} alt={selected.alt_text ?? selected.name} className="w-full rounded-lg max-h-64 object-contain bg-surface-alt" />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-text-muted text-xs mb-0.5">Name</p><p className="text-text-base font-medium break-all">{selected.name}</p></div>
              <div><p className="text-text-muted text-xs mb-0.5">Size</p><p className="text-text-base">{formatBytes(selected.size_bytes)}</p></div>
              <div><p className="text-text-muted text-xs mb-0.5">Type</p><p className="text-text-base">{selected.mime_type}</p></div>
              <div><p className="text-text-muted text-xs mb-0.5">Uploaded</p><p className="text-text-base">{formatDate(selected.created_at, { month: "short", day: "numeric", year: "numeric" })}</p></div>
            </div>
            {selected.alt_text && <div><p className="text-text-muted text-xs mb-0.5">Alt text</p><p className="text-text-base text-sm">{selected.alt_text}</p></div>}
            {selected.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            )}
            <div>
              <p className="text-text-muted text-xs mb-1">Public URL</p>
              <input
                readOnly
                value={selected.public_url}
                className="w-full text-xs border border-border rounded px-2 py-1.5 bg-surface-alt text-text-muted font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete file?" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-text-muted">This action cannot be undone. The file will be permanently removed from storage and the database.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
