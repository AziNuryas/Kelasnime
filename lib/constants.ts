// ─── Site Config ──────────────────────────────────────────────────────────────

export const SITE_NAME = "KelasNime";
export const SITE_DESCRIPTION =
  "Nonton anime sub Indo gratis, streaming dan download anime terlengkap dari berbagai sumber.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kelasnime.vercel.app";

// ─── Navigation Items ────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/completed", label: "Tamat" },
  { href: "/movie", label: "Movie" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/genre", label: "Genre" },
  { href: "/donghua", label: "Donghua" },
] as const;

// ─── Day Configuration ───────────────────────────────────────────────────────

export const DAYS_ID = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

export const DAY_MAP_EN: Record<string, string> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

export function getTodayID(): string {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  return days[new Date().getDay()];
}

// ─── Platform Configs ────────────────────────────────────────────────────────

export const PLATFORMS = {
  otakudesu: {
    id: "otakudesu",
    label: "Otakudesu",
    color: "#3B82F6",
    bgClass: "bg-blue-500",
  },
  samehadaku: {
    id: "samehadaku",
    label: "Samehadaku",
    color: "#8B5CF6",
    bgClass: "bg-purple-500",
  },
  oploverz: {
    id: "oploverz",
    label: "Oploverz",
    color: "#6366F1",
    bgClass: "bg-indigo-500",
  },
  anoboy: {
    id: "anoboy",
    label: "Anoboy",
    color: "#EC4899",
    bgClass: "bg-pink-500",
  },
  donghua: {
    id: "donghua",
    label: "Donghua",
    color: "#F59E0B",
    bgClass: "bg-amber-500",
  },
  animasu: {
    id: "animasu",
    label: "Animasu",
    color: "#10B981",
    bgClass: "bg-emerald-500",
  },
  kusonime: {
    id: "kusonime",
    label: "Kusonime",
    color: "#F97316",
    bgClass: "bg-orange-500",
  },
} as const;

// ─── Schedule Sources ────────────────────────────────────────────────────────

export const SCHEDULE_SOURCES = [
  {
    id: "otakudesu",
    label: "Otakudesu",
    endpoint: "/schedule",
    bgClass: "bg-blue-500",
  },
  {
    id: "samehadaku",
    label: "Samehadaku",
    endpoint: "/samehadaku/schedule",
    bgClass: "bg-purple-500",
  },
  {
    id: "oploverz",
    label: "Oploverz",
    endpoint: "/oploverz/schedule",
    bgClass: "bg-indigo-500",
  },
] as const;

// ─── Search Sources ──────────────────────────────────────────────────────────

export const SEARCH_SOURCES = [
  {
    id: "otakudesu",
    label: "Otakudesu",
    endpoint: (q: string) => `/search/${encodeURIComponent(q)}`,
    bgClass: "bg-blue-500",
  },
  {
    id: "samehadaku",
    label: "Samehadaku",
    endpoint: (q: string) =>
      `/samehadaku/search?q=${encodeURIComponent(q)}`,
    bgClass: "bg-purple-500",
  },
  {
    id: "anoboy",
    label: "Anoboy",
    endpoint: (q: string) =>
      `/anoboy/search/${encodeURIComponent(q)}`,
    bgClass: "bg-pink-500",
  },
] as const;

// ─── Genre Popular (for homepage quick access) ───────────────────────────────

export const POPULAR_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Mystery",
  "Horror",
  "Shounen",
] as const;
