import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import AnimeSection from "@/components/home/AnimeSection";
import { AnimeGridSkeleton, HeroSkeleton } from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import { fetchAPI } from "@/lib/api";
import { POPULAR_GENRES } from "@/lib/constants";
import { genreToSlug } from "@/lib/utils";
import type { APIResponse, HomeData, DonghuaHomeData } from "@/types/anime";

export default async function HomePage() {
  // Parallel fetch: homepage + donghua data
  const [homeResult, donghuaResult] = await Promise.allSettled([
    fetchAPI<APIResponse<HomeData>>("/home", 60),
    fetchAPI<DonghuaHomeData>("/donghua/home/1", 120),
  ]);

  const homeData =
    homeResult.status === "fulfilled" ? homeResult.value.data : null;
  const donghuaData =
    donghuaResult.status === "fulfilled" ? donghuaResult.value : null;

  const ongoingList = homeData?.ongoing?.animeList || [];
  const completedList = homeData?.completed?.animeList || [];
  const donghuaList = donghuaData?.latest_release || [];

  // Build hero slides from ongoing anime with good posters
  const heroSlides = ongoingList.slice(0, 5).map((a) => ({
    title: a.title,
    poster: a.poster,
    href: `/anime/${a.animeId || a.href.split("/").pop()}`,
    score: a.score,
    status: a.status || "Ongoing",
    genreList: a.genreList,
    episodes: a.episodes,
  }));

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="section-container pt-4">
        <Suspense fallback={<HeroSkeleton />}>
          {heroSlides.length > 0 ? (
            <HeroSlider items={heroSlides} />
          ) : (
            <HeroSkeleton />
          )}
        </Suspense>
      </section>

      {/* Sedang Tayang */}
      <section className="section-container">
        <Suspense fallback={<AnimeGridSkeleton count={5} />}>
          <AnimeSection
            title="🔥 Sedang Tayang"
            linkHref="/ongoing"
            items={ongoingList.slice(0, 10).map((a) => ({
              ...a,
              href: a.href || `/anime/anime/${a.animeId}`,
              status: a.status || "Ongoing",
            }))}
            scroll
          />
        </Suspense>
      </section>

      {/* Baru Tamat */}
      <section className="section-container">
        <Suspense fallback={<AnimeGridSkeleton count={5} />}>
          <AnimeSection
            title="✅ Baru Tamat"
            linkHref="/completed"
            items={completedList.slice(0, 10).map((a) => ({
              ...a,
              href: a.href || `/anime/anime/${a.animeId}`,
              status: a.status || "Completed",
            }))}
            scroll
          />
        </Suspense>
      </section>

      {/* Donghua Terbaru */}
      {donghuaList.length > 0 && (
        <section className="section-container">
          <AnimeSection
            title="🐉 Donghua Terbaru"
            linkHref="/donghua"
            items={donghuaList.slice(0, 10).map((d) => ({
              title: d.title,
              poster: d.poster,
              href: `/donghua/${d.slug}`,
              status: d.status,
              episodes: d.current_episode,
              animeId: d.slug,
            }))}
            scroll
          />
        </section>
      )}

      {/* Genre Quick Access */}
      <section className="section-container py-6">
        <div className="section-header">
          <h2 className="section-title">🎭 Jelajahi Genre</h2>
          <Link href="/genre" className="section-link">
            Semua Genre
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {POPULAR_GENRES.map((genre) => (
            <Link key={genre} href={`/genre/${genreToSlug(genre)}`}>
              <Badge variant="genre" className="text-xs px-4 py-2">
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
