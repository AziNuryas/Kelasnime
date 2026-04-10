import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Download } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { fetchAPI } from "@/lib/api";

interface DonghuaEpisode {
  title: string;
  streaming_url?: string;
  download_urls?: {
    quality: string;
    size: string;
    urls: { title: string; url: string }[];
  }[];
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
    const res = await fetchAPI<{ data: DonghuaEpisode }>(
      `/donghua/episode/${slug}`,
      0
    );
    episode = res.data;
  } catch {
    // Error state
  }

  if (!episode) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">📺</p>
        <h1 className="text-2xl font-bold mb-2">Episode Tidak Ditemukan</h1>
        <Link href="/donghua" className="btn-accent mt-4 inline-flex">
          Kembali ke Donghua
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
        {episode.title}
      </h1>

      {/* Video Player */}
      {episode.streaming_url && (
        <div className="aspect-video-16-9 rounded-xl overflow-hidden bg-black border border-[var(--border-default)]">
          <iframe
            src={episode.streaming_url}
            className="w-full h-full"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Downloads */}
      {episode.download_urls && episode.download_urls.length > 0 && (
        <div className="glass-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            Download Episode
          </h2>
          {episode.download_urls.map((quality) => (
            <div key={quality.quality}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="quality">{quality.quality}</Badge>
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
  );
}
