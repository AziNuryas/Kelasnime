import { Metadata } from "next";
import Link from "next/link";
import AnimeCard from "@/components/ui/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, Anime, Pagination as PaginationType } from "@/types/anime";

export const metadata: Metadata = {
  title: "Anime Movie",
  description:
    "Nonton anime movie sub Indo terlengkap. Koleksi film anime Jepang dengan subtitle Indonesia.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function MoviePage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");

  let animeList: Anime[] = [];
  let pagination: PaginationType | null = null;

  // Fetching movies from the genre "movie" endpoint
  try {
    const res = await fetchAPI<APIResponse<{ animeList: Anime[] }>>(
      `/genre/movie?page=${page}`,
      120
    );
    animeList = res.data?.animeList || [];
    pagination = res.pagination;
  } catch {
    // Try fallback — completed list filtered for movies tends to have movie-type entries
  }

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          🎬 Anime Movie
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Koleksi lengkap film anime Jepang subtitle Indonesia.
        </p>
      </div>

      {/* Featured banner */}
      <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-cyan-900/40 border border-[var(--border-default)] p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
            🎬
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Film Anime Pilihan
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Dari Studio Ghibli hingga Makoto Shinkai
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Action", slug: "action", emoji: "⚔️" },
            { label: "Romance", slug: "romance", emoji: "💕" },
            { label: "Fantasy", slug: "fantasy", emoji: "🧙" },
            { label: "Sci-Fi", slug: "sci-fi", emoji: "🚀" },
            { label: "Drama", slug: "drama", emoji: "🎭" },
            { label: "Comedy", slug: "comedy", emoji: "😂" },
          ].map((g) => (
            <Link
              key={g.slug}
              href={`/genre/${g.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/30 transition-all"
            >
              {g.emoji} {g.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
          {animeList.map((anime, i) => (
            <AnimeCard
              key={`${anime.animeId}-${i}`}
              title={anime.title}
              poster={anime.poster}
              href={`/anime/${anime.animeId}`}
              episodes={anime.episodes}
              score={anime.score}
              status={anime.status}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-lg font-semibold mb-2">Anime Movie</p>
          <p className="text-sm mb-6">
            Cari film anime favoritmu menggunakan fitur pencarian!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/search" className="btn-accent">
              🔍 Cari Anime Movie
            </Link>
            <Link href="/genre" className="btn-ghost">
              🎭 Jelajahi Genre
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          basePath="/movie"
        />
      )}
    </div>
  );
}
