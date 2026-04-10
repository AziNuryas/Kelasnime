import { Metadata } from "next";
import Link from "next/link";
import { Star, Play, Download, Calendar, Clock, Film, Tv, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { fetchAPI } from "@/lib/api";
import { formatScore, extractSlug } from "@/lib/utils";
import type { APIResponse, AnimeDetail } from "@/types/anime";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchAPI<APIResponse<AnimeDetail>>(`/anime/${slug}`, 300);
    return {
      title: res.data.title,
      description: `Nonton ${res.data.title} subtitle Indonesia. ${res.data.type} - ${res.data.status}`,
    };
  } catch {
    return { title: "Detail Anime" };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params;

  let anime: AnimeDetail | null = null;
  try {
    const res = await fetchAPI<APIResponse<AnimeDetail>>(`/anime/${slug}`, 300);
    anime = res.data;
  } catch {
    // Will show error state
  }

  if (!anime) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">😵</p>
        <h1 className="text-2xl font-bold mb-2">Anime Tidak Ditemukan</h1>
        <p className="text-[var(--text-muted)] mb-6">
          Data anime ini tidak tersedia atau sedang bermasalah.
        </p>
        <Link href="/" className="btn-accent">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const scoreText = formatScore(anime.score);

  return (
    <div className="pb-10">
      {/* Hero Banner */}
      <div className="relative h-[320px] sm:h-[380px] md:h-[420px] overflow-hidden">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="section-container -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-[160px] sm:w-[200px] mx-auto md:mx-0">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full rounded-xl shadow-elevated border-2 border-[var(--border-default)]"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
              {anime.title}
            </h1>

            {anime.japanese && (
              <p className="text-sm text-[var(--text-muted)]">
                {anime.japanese}
              </p>
            )}

            {/* Score + Status */}
            <div className="flex flex-wrap items-center gap-3">
              {scoreText && (
                <span className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                  <Star className="w-5 h-5 fill-amber-400" />
                  {scoreText}
                </span>
              )}
              {anime.status && (
                <Badge
                  variant="status"
                  className={
                    anime.status === "Ongoing"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }
                >
                  {anime.status === "Ongoing" ? "Sedang Tayang" : anime.status}
                </Badge>
              )}
              <Badge variant="quality">{anime.type}</Badge>
            </div>

            {/* Genres */}
            {anime.genreList && anime.genreList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genreList.map((g) => (
                  <Link key={g.genreId} href={`/genre/${g.genreId}`}>
                    <Badge variant="genre">{g.title}</Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[
                { icon: Tv, label: "Tipe", value: anime.type },
                { icon: Film, label: "Studio", value: anime.studios },
                {
                  icon: Play,
                  label: "Episode",
                  value: anime.episodes ? `${anime.episodes} eps` : "?",
                },
                { icon: Clock, label: "Durasi", value: anime.duration },
                { icon: Calendar, label: "Tayang", value: anime.aired },
                { icon: Users, label: "Produser", value: anime.producers },
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
        {anime.synopsis?.paragraphs && anime.synopsis.paragraphs.length > 0 && (
          <div className="mt-8 glass-card p-6">
            <h2 className="text-lg font-bold mb-3 text-[var(--text-primary)]">
              📖 Sinopsis
            </h2>
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
              {anime.synopsis.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Episode List */}
        {anime.episodeList && anime.episodeList.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
              📺 Daftar Episode ({anime.episodeList.length})
            </h2>
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {[...anime.episodeList]
                .sort((a, b) => a.eps - b.eps)
                .map((ep) => (
                  <Link
                    key={ep.episodeId}
                    href={`/episode/${ep.episodeId}`}
                    className="flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-cyan-500/15 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  >
                    Ep {ep.eps}
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Batch Download */}
        {anime.batch && (
          <div className="mt-8">
            <Link
              href={`/batch/${extractSlug(anime.batch)}`}
              className="btn-accent w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Download Batch
            </Link>
          </div>
        )}

        {/* Recommended */}
        {anime.recommendedAnimeList &&
          anime.recommendedAnimeList.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                💡 Rekomendasi
              </h2>
              <div className="scroll-track">
                {anime.recommendedAnimeList.map((rec, i) => (
                  <Link
                    key={`${rec.animeId}-${i}`}
                    href={`/anime/${rec.animeId}`}
                    className="flex-shrink-0 w-[130px] group"
                  >
                    <div className="anime-card">
                      <img
                        src={rec.poster}
                        alt={rec.title}
                        className="w-full aspect-poster object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs font-medium text-[var(--text-secondary)] mt-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {rec.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
