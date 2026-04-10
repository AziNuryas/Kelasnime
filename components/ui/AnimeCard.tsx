"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { cn, isValidPoster, formatScore, getStatusColor } from "@/lib/utils";

interface AnimeCardProps {
  title: string;
  poster: string;
  href: string;
  episodes?: number | string | null;
  score?: string;
  status?: string;
  releaseDay?: string;
  latestReleaseDate?: string;
  className?: string;
}

export default function AnimeCard({
  title,
  poster,
  href,
  episodes,
  score,
  status,
  releaseDay,
  latestReleaseDate,
  className,
}: AnimeCardProps) {
  const [imgError, setImgError] = useState(false);
  const formattedScore = formatScore(score);

  return (
    <Link href={href} className={cn("block group", className)}>
      <div className="anime-card">
        {/* Poster */}
        <div className="relative aspect-poster overflow-hidden">
          {!imgError && isValidPoster(poster) ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 to-purple-900/40 flex items-center justify-center">
              <span className="text-4xl opacity-50">🎬</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="anime-card-overlay">
            <div className="w-full space-y-2">
              <button className="w-full btn-accent text-xs py-2">
                <Play className="w-3.5 h-3.5" />
                Tonton
              </button>
            </div>
          </div>

          {/* Status Badge */}
          {status && (
            <span
              className={cn(
                "absolute top-2 left-2 badge text-white text-[10px]",
                getStatusColor(status)
              )}
            >
              {status === "Ongoing" ? "Tayang" : status === "Completed" ? "Tamat" : status}
            </span>
          )}

          {/* Score Badge */}
          {formattedScore && (
            <span className="absolute top-2 right-2 badge bg-black/60 text-amber-400 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
              {formattedScore}
            </span>
          )}

          {/* Episode Count */}
          {episodes && (
            <span className="absolute bottom-2 right-2 badge bg-black/70 text-white backdrop-blur-sm text-[10px]">
              {episodes} Eps
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors min-h-[2.5rem]">
            {title}
          </h3>

          {(releaseDay || latestReleaseDate) && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {releaseDay && releaseDay !== "None" && (
                <span>{releaseDay}</span>
              )}
              {latestReleaseDate && (
                <span className="text-cyan-400/80">{latestReleaseDate}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
