import { Metadata } from "next";
import AnimeCard from "@/components/ui/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, Anime, Pagination as PaginationType } from "@/types/anime";

export const metadata: Metadata = {
  title: "Anime Tamat",
  description: "Daftar anime yang sudah selesai tayang lengkap.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CompletedPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  let animeList: Anime[] = [];
  let pagination: PaginationType | null = null;

  try {
    const res = await fetchAPI<APIResponse<{ animeList: Anime[] }>>(
      `/complete-anime?page=${page}`,
      120
    );
    animeList = res.data?.animeList || [];
    pagination = res.pagination;
  } catch {
    // Silently handle
  }

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          ✅ Anime Tamat
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Daftar anime yang sudah selesai tayang.
        </p>
      </div>

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
              status="Completed"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">😔</p>
          <p>Tidak ada data anime tamat.</p>
        </div>
      )}

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          basePath="/completed"
        />
      )}
    </div>
  );
}
