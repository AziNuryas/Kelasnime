import { Metadata } from "next";
import Link from "next/link";
import { Star, Calendar, Clock, Film, Tv, Globe } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import Badge from "@/components/ui/Badge";

interface DonghuaGenre {
  name: string;
  slug: string;
  href: string;
  anichinUrl: string;
}

interface DonghuaEpisodeItem {
  episode: string;
  slug: string;
  href: string;
  anichinUrl: string;
}

interface DonghuaDetail {
  title: string;
  alter_title?: string;
  poster: string;
  status: string;
  type: string;
  rating?: string;
  studio?: string;
  network?: string;
  released?: string;
  duration?: string;
  episodes_count?: string;
  season?: string;
  country?: string;
  released_on?: string;
  updated_on?: string;
  synopsis?: string;
  genres?: DonghuaGenre[];
  episodes_list?: DonghuaEpisodeItem[];
  // fallback fields in case API changes
  description?: string;
  [key: string]: any;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchAPI<DonghuaDetail>(`/donghua/detail/${slug}`, 300);
    const title = res.title || "Donghua Detail";
    return {
      title,
      description: `Nonton ${title} subtitle Indonesia.`,
    };
  } catch {
    return { title: "Donghua Detail" };
  }
}

export default async function DonghuaDetailPage({ params }: Props) {
  const { slug } = await params;

  let donghua: DonghuaDetail | null = null;
  try {
    const res = await fetchAPI<DonghuaDetail>(`/donghua/detail/${slug}`, 300);
    // API returns flat response (no data wrapper)
    if (res.title) {
      donghua = res;
    } else if ((res as any).data?.title) {
      donghua = (res as any).data;
    }
  } catch {
    // Detail failed — maybe this slug is actually an episode slug
    // Try the episode endpoint to confirm
    try {
      const epRes = await fetchAPI<any>(`/donghua/episode/${slug}`, 0);
      if (epRes.episode || epRes.data?.episode) {
        // It IS an episode slug - redirect user to the correct page
        const { redirect } = await import("next/navigation");
        redirect(`/donghua/episode/${slug}`);
      }
    } catch {
      // Both failed, show not found
    }
  }

  if (!donghua) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">🐉</p>
        <h1 className="text-2xl font-bold mb-2">Donghua Tidak Ditemukan</h1>
        <p className="text-[var(--text-muted)] mb-6">
          Data donghua ini tidak tersedia atau sedang bermasalah.
        </p>
        <Link href="/donghua" className="btn-accent mt-4 inline-flex">
          Kembali ke Donghua
        </Link>
      </div>
    );
  }

  // Get synopsis text
  const synopsisText =
    typeof donghua.synopsis === "string" ? donghua.synopsis :
    typeof donghua.description === "string" ? donghua.description :
    Array.isArray(donghua.synopsis) ? donghua.synopsis.join("\n") :
    null;

  return (
    <div className="pb-10">
      {/* Hero Banner */}
      <div className="relative h-[280px] sm:h-[340px] overflow-hidden">
        <img
          src={donghua.poster}
          alt={donghua.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="section-container -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-[160px] sm:w-[200px] mx-auto md:mx-0">
            <img
              src={donghua.poster}
              alt={donghua.title}
              className="w-full rounded-xl shadow-elevated border-2 border-[var(--border-default)]"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
              {donghua.title}
            </h1>

            {donghua.alter_title && (
              <p className="text-sm text-[var(--text-muted)]">
                {donghua.alter_title}
              </p>
            )}

            {/* Score + Status */}
            <div className="flex flex-wrap items-center gap-3">
              {donghua.rating && donghua.rating !== "N/A" && (
                <span className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                  <Star className="w-5 h-5 fill-amber-400" />
                  {donghua.rating}
                </span>
              )}
              <Badge variant="status" className="bg-amber-500">Donghua</Badge>
              {donghua.status && (
                <Badge
                  variant="status"
                  className={donghua.status === "Ongoing" ? "bg-emerald-500" : "bg-blue-500"}
                >
                  {donghua.status === "Ongoing" ? "Sedang Tayang" : donghua.status}
                </Badge>
              )}
            </div>

            {/* Genres */}
            {donghua.genres && donghua.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {donghua.genres.map((g) => (
                  <Badge key={g.slug} variant="genre">{g.name}</Badge>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[
                { icon: Tv, label: "Tipe", value: donghua.type },
                { icon: Film, label: "Studio", value: donghua.studio },
                { icon: Clock, label: "Durasi", value: donghua.duration },
                { icon: Calendar, label: "Rilis", value: donghua.released_on || donghua.released },
                { icon: Globe, label: "Negara", value: donghua.country },
                { icon: Tv, label: "Episode", value: donghua.episodes_count ? `${donghua.episodes_count} eps` : undefined },
              ].map(
                (item) =>
                  item.value && (
                    <div
                      key={item.label}
                      className="glass-card p-3 flex items-center gap-2.5"
                    >
                      <item.icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Synopsis */}
        {synopsisText && (
          <div className="mt-8 glass-card p-6">
            <h2 className="text-lg font-bold mb-3 text-[var(--text-primary)]">
              📖 Sinopsis
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {synopsisText}
            </p>
          </div>
        )}

        {/* Episode List */}
        {donghua.episodes_list && donghua.episodes_list.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
              📺 Daftar Episode ({donghua.episodes_list.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {donghua.episodes_list.map((ep, i) => (
                <Link
                  key={`${ep.slug}-${i}`}
                  href={`/donghua/episode/${ep.slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 hover:bg-[var(--bg-card-hover)] transition-all text-sm text-[var(--text-secondary)] hover:text-cyan-400"
                >
                  {ep.episode}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
