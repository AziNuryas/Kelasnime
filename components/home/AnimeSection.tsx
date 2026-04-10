import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AnimeCard from "@/components/ui/AnimeCard";
import { extractSlug } from "@/lib/utils";

interface AnimeSectionProps {
  title: string;
  linkHref?: string;
  linkLabel?: string;
  items: {
    title: string;
    poster: string;
    href: string;
    episodes?: number | string | null;
    score?: string;
    status?: string;
    releaseDay?: string;
    latestReleaseDate?: string;
    animeId?: string;
  }[];
  scroll?: boolean;
}

export default function AnimeSection({
  title,
  linkHref,
  linkLabel = "Lihat Semua",
  items,
  scroll = false,
}: AnimeSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6">
      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {linkHref && (
          <Link href={linkHref} className="section-link">
            {linkLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Grid or Scroll */}
      {scroll ? (
        <div className="scroll-track">
          {items.map((anime, i) => {
            const slug = anime.animeId || extractSlug(anime.href);
            return (
              <AnimeCard
                key={`${slug}-${i}`}
                title={anime.title}
                poster={anime.poster}
                href={`/anime/${slug}`}
                episodes={anime.episodes}
                score={anime.score}
                status={anime.status}
                releaseDay={anime.releaseDay}
                latestReleaseDate={anime.latestReleaseDate}
                className="w-[150px] sm:w-[170px] md:w-[185px]"
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
          {items.map((anime, i) => {
            const slug = anime.animeId || extractSlug(anime.href);
            return (
              <AnimeCard
                key={`${slug}-${i}`}
                title={anime.title}
                poster={anime.poster}
                href={`/anime/${slug}`}
                episodes={anime.episodes}
                score={anime.score}
                status={anime.status}
                releaseDay={anime.releaseDay}
                latestReleaseDate={anime.latestReleaseDate}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
