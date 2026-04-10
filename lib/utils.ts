import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx — handles conflicts intelligently */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format episode number for display */
export function formatEpisode(eps: number | string | null | undefined): string {
  if (eps === null || eps === undefined) return "?";
  return String(eps);
}

/** Extract slug from href path like /anime/anime/slug → slug */
export function extractSlug(href: string): string {
  return href.split("/").filter(Boolean).pop() || "";
}

/** Truncate text with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/** Format date string for display */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "None") return "-";
  return dateStr;
}

/** Generate score display (e.g., "8.54" → "⭐ 8.54") */
export function formatScore(score: string | undefined): string {
  if (!score || score === "N/A" || score === "0") return "";
  // Some scores may contain non-numeric text like "Fall 2025"
  const num = parseFloat(score);
  if (isNaN(num)) return "";
  return num.toFixed(2);
}

/** Convert genre title to slug for URL (e.g., "Slice of Life" → "slice-of-life") */
export function genreToSlug(genreTitle: string): string {
  return genreTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Delay helper for debounce */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Check if a poster URL is valid and not empty */
export function isValidPoster(url: string | undefined | null): boolean {
  return !!url && url.length > 0 && url !== "null" && url !== "undefined";
}

/** Get status badge color class */
export function getStatusColor(status: string): string {
  const s = status?.toLowerCase() || "";
  if (s === "ongoing" || s === "sedang tayang") return "bg-emerald-500";
  if (s === "completed" || s === "tamat") return "bg-blue-500";
  return "bg-zinc-500";
}
