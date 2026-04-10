"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Play,
  Monitor,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchClient } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import type {
  EpisodeDetail,
  StreamQuality,
  DownloadQuality,
  EpisodeItem,
} from "@/types/anime";

interface EpisodePlayerProps {
  episode: EpisodeDetail;
}

export default function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const [streamUrl, setStreamUrl] = useState(episode.defaultStreamingUrl);
  const [activeQuality, setActiveQuality] = useState(0);
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const qualities = episode.server?.qualities || [];
  const downloads = episode.downloadUrl?.qualities || [];
  const episodeList = episode.info?.episodeList || [];

  // Set initial server
  useEffect(() => {
    if (qualities.length > 0 && qualities[0].serverList.length > 0) {
      setActiveServer(qualities[0].serverList[0].serverId);
    }
  }, [qualities]);

  const handleServerClick = useCallback(
    async (serverId: string, qualityIdx: number) => {
      setLoading(true);
      setActiveQuality(qualityIdx);
      setActiveServer(serverId);

      try {
        const res = await fetchClient<{ data: { url: string } }>(
          `/server/${serverId}`
        );
        if (res.data?.url) {
          setStreamUrl(res.data.url);
        }
      } catch {
        // Keep current URL on error
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main Column */}
      <div className="space-y-5">
        {/* Video Player */}
        <div className="relative aspect-video-16-9 rounded-xl overflow-hidden bg-black border border-[var(--border-default)]">
          {loading && (
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
          )}
          {streamUrl ? (
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
              <div className="text-center space-y-3">
                <Monitor className="w-12 h-12 mx-auto opacity-50" />
                <p>Pilih server untuk memulai streaming</p>
              </div>
            </div>
          )}
        </div>

        {/* Episode Title + Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] flex-1 min-w-0">
            {episode.title}
          </h1>
          <div className="flex gap-2 flex-shrink-0">
            {episode.hasPrevEpisode && episode.prevEpisode && (
              <Link
                href={`/episode/${episode.prevEpisode.episodeId}`}
                className="btn-ghost text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Link>
            )}
            {episode.hasNextEpisode && episode.nextEpisode && (
              <Link
                href={`/episode/${episode.nextEpisode.episodeId}`}
                className="btn-accent text-xs"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Server Selector */}
        {qualities.length > 0 && (
          <div className="glass-card p-4 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              Pilih Server
            </h2>

            {/* Quality Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {qualities.map((q, idx) => (
                <button
                  key={q.title}
                  onClick={() => {
                    setActiveQuality(idx);
                    if (q.serverList.length > 0) {
                      handleServerClick(q.serverList[0].serverId, idx);
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    idx === activeQuality
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {q.title}
                </button>
              ))}
            </div>

            {/* Server Buttons */}
            <div className="flex flex-wrap gap-2">
              {qualities[activeQuality]?.serverList.map((server) => (
                <button
                  key={server.serverId}
                  onClick={() =>
                    handleServerClick(server.serverId, activeQuality)
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize",
                    activeServer === server.serverId
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-purple-500/30 hover:text-purple-400"
                  )}
                >
                  {server.title.trim()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        {episode.info && (
          <div className="flex flex-wrap gap-3 text-xs">
            {episode.info.type && (
              <Badge variant="quality">📺 {episode.info.type}</Badge>
            )}
            {episode.info.duration && (
              <Badge variant="quality">⏱️ {episode.info.duration}</Badge>
            )}
            {episode.info.encoder && (
              <Badge variant="quality">🎬 {episode.info.encoder}</Badge>
            )}
            {episode.releaseTime && (
              <Badge variant="quality">🕐 {episode.releaseTime}</Badge>
            )}
          </div>
        )}

        {/* Download Section */}
        {downloads.length > 0 && (
          <div className="glass-card overflow-hidden">
            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Download Episode
              </span>
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-transform",
                  showDownloads && "rotate-90"
                )}
              />
            </button>

            {showDownloads && (
              <div className="p-4 border-t border-[var(--border-default)] space-y-4 animate-slide-down">
                {downloads.map((quality) => (
                  <div key={quality.title}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="quality" className="text-[10px]">
                        {quality.title}
                      </Badge>
                      <span className="text-xs text-[var(--text-muted)]">
                        {quality.size}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quality.urls.map((link) => (
                        <a
                          key={link.title}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                        >
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar — Episode List */}
      <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto glass-card p-4 space-y-2 rounded-xl">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Play className="w-4 h-4 text-cyan-400" />
          Daftar Episode
        </h3>

        {episodeList.length > 0 ? (
          <div className="space-y-1">
            {[...episodeList].sort((a, b) => a.eps - b.eps).map((ep) => {
              const isCurrent = ep.episodeId === episode.title
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <Link
                  key={ep.episodeId}
                  href={`/episode/${ep.episodeId}`}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-xs transition-all",
                    isCurrent
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {ep.title || `Episode ${ep.eps}`}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] text-center py-4">
            Tidak ada daftar episode
          </p>
        )}

        {/* Link to anime detail */}
        {episode.animeId && (
          <Link
            href={`/anime/${episode.animeId}`}
            className="block mt-3 text-center text-xs text-cyan-400 hover:underline"
          >
            Lihat Detail Anime →
          </Link>
        )}
      </div>
    </div>
  );
}
