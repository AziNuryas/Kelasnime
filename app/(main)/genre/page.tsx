import { Metadata } from "next";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ADULT_GENRE_IDS } from "@/lib/adult-config";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, GenreListData } from "@/types/anime";

export const metadata: Metadata = {
  title: "Daftar Genre",
  description: "Jelajahi anime berdasarkan genre favorit kamu.",
};

export default async function GenrePage() {
  let genres: { title: string; genreId: string }[] = [];

  try {
    const res = await fetchAPI<APIResponse<GenreListData>>("/genre", 86400);
    genres = res.data?.genreList || [];
  } catch {
    // Empty state
  }

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          🎭 Daftar Genre
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Temukan anime berdasarkan genre kesukaanmu.
        </p>
      </div>

      {genres.length > 0 ? (
        <div className="flex flex-wrap gap-3 stagger-children">
          {genres.map((genre) => {
            const isAdult = ADULT_GENRE_IDS.includes(genre.genreId.toLowerCase());
            return (
              <Link key={genre.genreId} href={`/genre/${genre.genreId}`}>
                <Badge
                  variant={isAdult ? "default" : "genre"}
                  className={`text-sm px-5 py-2.5 hover:scale-105 transition-transform ${
                    isAdult
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      : ""
                  }`}
                >
                  {isAdult && "🔞 "}
                  {genre.title}
                </Badge>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">🎭</p>
          <p>Tidak dapat memuat daftar genre.</p>
        </div>
      )}
    </div>
  );
}
