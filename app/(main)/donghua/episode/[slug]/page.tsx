import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Download } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { fetchAPI } from "@/lib/api";

interface DonghuaEpisode {
  episode: string;
  streaming?: {
    main_url?: { url: string; name: string };
    servers?: { name: string; url: string }[];
  };
  download_url?: Record<string, Record<string, string>>;
  // Allow any other fields from API
  [key: string]: any;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Nonton episode donghua subtitle Indonesia.",
  };
}

export default async function DonghuaEpisodePage({ params }: Props) {
  const { slug } = await params;

  let episode: DonghuaEpisode | null = null;
  try {
    const res = await fetchAPI<DonghuaEpisode>(
      `/donghua/episode/${slug}`,
      0
    );
    // API returns flat response (no data wrapper) - same as detail
    if (res.episode) {
      episode = res;
    } else if ((res as any).data?.episode) {
      episode = (res as any).data;
    }
  } catch {
    // Error state
  }

  if (!episode) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">📺</p>
        <h1 className="text-2xl font-bold mb-2">Episode Tidak Ditemukan</h1>
        <p className="text-[var(--text-muted)] mb-6">
          Episode ini tidak tersedia atau sedang bermasalah.
        </p>
        <Link href="/donghua" className="btn-accent mt-4 inline-flex">
          Kembali ke Donghua
        </Link>
      </div>
    );
  }

  // Find streaming URL - try multiple possible locations
  const streamUrl =
    episode.streaming?.main_url?.url ||
    episode.streaming_url ||
    episode.default_streaming_url ||
    null;

  // Find server list
  const serverList = episode.streaming?.servers || [];

  return (
    <div className="section-container py-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
        {episode.episode}
      </h1>

      {/* Video Player */}
      {streamUrl && (
        <div className="aspect-video rounded-xl overflow-hidden bg-black border border-[var(--border-default)]">
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Alternative Servers */}
      {serverList.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            🖥️ Server Lain
          </h2>
          <div className="flex flex-wrap gap-2">
            {serverList.map((srv, i) => (
              <button
                key={`${srv.name}-${i}`}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                {srv.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Downloads */}
      {episode.download_url && typeof episode.download_url === 'object' && Object.keys(episode.download_url).length > 0 && (
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            Download Episode
          </h2>
          {Object.entries(episode.download_url).map(([quality, links]) => {
            // Handle both object and array formats
            if (typeof links === 'object' && links !== null && !Array.isArray(links)) {
              return (
                <div key={quality}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="quality">{quality.replace('download_url_', '').toUpperCase()}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(links).map(([server, url]) => (
                      <a
                        key={server}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                      >
                        {server}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
