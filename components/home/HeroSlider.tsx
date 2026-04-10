"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { cn, isValidPoster, formatScore } from "@/lib/utils";

interface SlideItem {
  title: string;
  poster: string;
  href: string;
  score?: string;
  status?: string;
  genreList?: { title: string }[];
  episodes?: number | null;
}

interface HeroSliderProps {
  items: SlideItem[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slides = items.slice(0, 5);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const scoreText = formatScore(slide.score);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden group">
      {/* Background Image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          {isValidPoster(s.poster) ? (
            <img
              src={s.poster}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50" />
          )}
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 space-y-4">
        {/* Genres */}
        {slide.genreList && slide.genreList.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {slide.genreList.slice(0, 4).map((g) => (
              <span
                key={g.title}
                className="badge badge-accent text-[10px]"
              >
                {g.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl animate-fade-in-up line-clamp-2">
          {slide.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-zinc-300 animate-fade-in">
          {scoreText && (
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              {scoreText}
            </span>
          )}
          {slide.status && (
            <span className={cn(
              "badge text-[10px] text-white",
              slide.status === "Ongoing" ? "bg-emerald-500" : "bg-blue-500"
            )}>
              {slide.status === "Ongoing" ? "Sedang Tayang" : slide.status}
            </span>
          )}
          {slide.episodes && (
            <span>{slide.episodes} Episode</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-3 animate-fade-in-up">
          <Link href={slide.href} className="btn-accent">
            <Play className="w-4 h-4" />
            Tonton Sekarang
          </Link>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        aria-label="Berikutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 sm:right-8 md:right-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current
                ? "w-6 bg-cyan-400"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
