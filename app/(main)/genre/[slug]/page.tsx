import { Metadata } from "next";
import AnimeCard from "@/components/ui/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import AgeGateWrapper from "@/components/ui/AgeGateWrapper";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, Anime, Pagination as PaginationType } from "@/types/anime";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const genreTitle = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  return {
    title: `Genre ${genreTitle}`,
    description: `Daftar anime genre ${genreTitle} terlengkap sub Indo.`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");

  const genreTitle = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  let animeList: Anime[] = [];
  let pagination: PaginationType | null = null;

  try {
    const res = await fetchAPI<APIResponse<{ animeList: Anime[] }>>(
      `/genre/${slug}?page=${page}`,
      300
    );
    animeList = res.data?.animeList || [];
    pagination = res.pagination;
  } catch {
    // Empty state
  }

  return (
    <AgeGateWrapper genreSlug={slug} genreTitle={genreTitle}>
      <div className="section-container py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            🎭 Genre: {genreTitle}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Anime dengan genre {genreTitle}.
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
                status={anime.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-muted)]">
            <p className="text-4xl mb-4">😔</p>
            <p>Tidak ditemukan anime untuk genre ini.</p>
          </div>
        )}

        {pagination && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            basePath={`/genre/${slug}`}
          />
        )}
      </div>
    </AgeGateWrapper>
  );
}
