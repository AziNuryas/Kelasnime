import { Metadata } from "next";
import AnimeCard from "@/components/ui/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, Anime, Pagination as PaginationType } from "@/types/anime";

export const metadata: Metadata = {
  title: "Anime Ongoing",
  description: "Daftar anime yang sedang tayang dan diperbarui setiap minggu.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function OngoingPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  let animeList: Anime[] = [];
  let pagination: PaginationType | null = null;

  try {
    const res = await fetchAPI<APIResponse<{ animeList: Anime[] }>>(
      `/ongoing-anime?page=${page}`,
      60
    );
    animeList = res.data?.animeList || [];
    pagination = res.pagination;
  } catch {
    // Silently handle — show empty state
  }

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          🔥 Anime Ongoing
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Anime yang sedang tayang dan diperbarui setiap minggu.
        </p>
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
              status="Ongoing"
              releaseDay={anime.releaseDay}
              latestReleaseDate={anime.latestReleaseDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">😔</p>
          <p>Tidak ada data anime ongoing.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          basePath="/ongoing"
        />
      )}
    </div>
  );
}
