"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Filter } from "lucide-react";
import AnimeCard from "@/components/ui/AnimeCard";
import { AnimeGridSkeleton } from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import { fetchClient } from "@/lib/api";
import { SEARCH_SOURCES } from "@/lib/constants";

interface SearchResult {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  status?: string;
  score?: string;
  source: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);

    // Parallel fetch from multiple sources
    const fetches = SEARCH_SOURCES.map(async (source) => {
      try {
        const res = await fetchClient<{ data?: { animeList?: SearchResult[] }; data_anime?: SearchResult[] }>(
          source.endpoint(q)
        );
        const list = res.data?.animeList || (res as { data_anime?: SearchResult[] }).data_anime || [];
        return list.map((item: SearchResult) => ({
          ...item,
          source: source.id,
          animeId: item.animeId || item.href?.split("/").pop() || "",
        }));
      } catch {
        return [];
      }
    });

    const allResults = await Promise.all(fetches);
    const flat = allResults.flat();

    // Deduplicate by title (lowercase, trimmed)
    const seen = new Set<string>();
    const unique = flat.filter((item) => {
      const key = item.title?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setResults(unique);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState({}, "", url.toString());
  };

  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((r) => r.source === activeFilter);

  const sourceCounts = SEARCH_SOURCES.reduce(
    (acc, s) => {
      acc[s.id] = results.filter((r) => r.source === s.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          🔍 Pencarian
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Cari anime dari berbagai sumber sekaligus.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik judul anime..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
          )}
        </div>
      </form>

      {/* Filters */}
      {results.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`badge text-xs px-4 py-2 cursor-pointer transition-all ${
              activeFilter === "all"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:text-[var(--text-primary)]"
            }`}
          >
            Semua ({results.length})
          </button>
          {SEARCH_SOURCES.map((source) => (
            <button
              key={source.id}
              onClick={() => setActiveFilter(source.id)}
              className={`badge text-xs px-4 py-2 cursor-pointer transition-all ${
                activeFilter === source.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:text-[var(--text-primary)]"
              }`}
            >
              {source.label} ({sourceCounts[source.id] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <AnimeGridSkeleton count={10} />
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
          {filteredResults.map((anime, i) => (
            <div key={`${anime.animeId}-${i}`} className="relative">
              <AnimeCard
                title={anime.title}
                poster={anime.poster}
                href={`/anime/${anime.animeId}`}
                score={anime.score}
                status={anime.status}
              />
              {/* Source Badge */}
              <span
                className={`absolute bottom-14 left-2 badge text-[9px] text-white ${
                  SEARCH_SOURCES.find((s) => s.id === anime.source)?.bgClass ||
                  "bg-zinc-500"
                }`}
              >
                {anime.source}
              </span>
            </div>
          ))}
        </div>
      ) : searched && !loading ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">🔍</p>
          <p>
            Tidak ditemukan hasil untuk &quot;{initialQuery || query}&quot;
          </p>
          <p className="text-xs mt-2">Coba kata kunci yang berbeda.</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="section-container py-8">
          <AnimeGridSkeleton count={10} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
