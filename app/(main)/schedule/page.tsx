"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { DAYS_ID, getTodayID } from "@/lib/constants";
import { AnimeGridSkeleton } from "@/components/ui/Skeleton";
import { fetchClient } from "@/lib/api";

interface ScheduleAnime {
  title: string;
  animeId?: string;
  href?: string;
  poster?: string;
}

interface ScheduleDay {
  day: string;
  animeList?: ScheduleAnime[];
}

function ScheduleContent() {
  const [activeDay, setActiveDay] = useState(getTodayID());
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchClient<{ data?: { days?: ScheduleDay[] } | ScheduleDay[] }>("/schedule");
        const data = res.data;
        const days = Array.isArray(data) ? data : data?.days || [];
        setSchedule(days);
      } catch {
        setSchedule([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const currentDayAnime =
    schedule.find(
      (d) =>
        d.day?.toLowerCase() === activeDay.toLowerCase() ||
        d.day?.toLowerCase().includes(activeDay.toLowerCase())
    )?.animeList || [];

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <Calendar className="w-7 h-7 text-cyan-400" />
          Jadwal Mingguan
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Jadwal rilis anime setiap hari.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scroll-track">
        {DAYS_ID.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
              day === activeDay
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:text-[var(--text-primary)] hover:border-cyan-500/30"
            )}
          >
            {day}
            {day === getTodayID() && (
              <span className="ml-1.5 text-[10px] opacity-70">Hari ini</span>
            )}
          </button>
        ))}
      </div>

      {/* Anime List */}
      {loading ? (
        <AnimeGridSkeleton count={10} />
      ) : currentDayAnime.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
          {currentDayAnime.map((anime, i) => {
            const slug =
              anime.animeId || anime.href?.split("/").pop() || "";
            return (
              <Link
                key={`${slug}-${i}`}
                href={`/anime/${slug}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 hover:bg-[var(--bg-card-hover)] transition-all group"
              >
                {anime.poster && (
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {anime.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">📅</p>
          <p>Tidak ada anime yang dijadwalkan untuk hari {activeDay}.</p>
        </div>
      )}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="section-container py-8">
          <AnimeGridSkeleton count={10} />
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
