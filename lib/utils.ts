import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function isImageMimeType(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isVideoMimeType(mime: string): boolean {
  return mime.startsWith("video/");
}

export function isPdfMimeType(mime: string): boolean {
  return mime === "application/pdf";
}

// Validate file before upload
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
export const ALLOWED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
export const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB
export const MAX_DOC_SIZE = 50 * 1024 * 1024;    // 50 MB

export function validateFile(file: File): string | null {
  const allAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allAllowed.includes(file.type)) {
    return `File type "${file.type}" is not allowed.`;
  }
  if (isImageMimeType(file.type) && file.size > MAX_IMAGE_SIZE) {
    return `Image files must be under 10 MB.`;
  }
  if (isVideoMimeType(file.type) && file.size > MAX_VIDEO_SIZE) {
    return `Video files must be under 200 MB.`;
  }
  if (isPdfMimeType(file.type) && file.size > MAX_DOC_SIZE) {
    return `Document files must be under 50 MB.`;
  }
  return null;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
