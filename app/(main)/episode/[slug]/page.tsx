import { Metadata } from "next";
import Link from "next/link";
import EpisodePlayer from "@/components/anime/EpisodePlayer";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, EpisodeDetail } from "@/types/anime";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchAPI<APIResponse<EpisodeDetail>>(
      `/episode/${slug}`,
      120
    );
    return {
      title: res.data.title,
      description: `Streaming ${res.data.title} subtitle Indonesia gratis.`,
    };
  } catch {
    return { title: "Nonton Episode" };
  }
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;

  let episode: EpisodeDetail | null = null;
  try {
    const res = await fetchAPI<APIResponse<EpisodeDetail>>(
      `/episode/${slug}`,
      120
    );
    episode = res.data;
  } catch {
    // Will show error state
  }

  if (!episode) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">📺</p>
        <h1 className="text-2xl font-bold mb-2">Episode Tidak Ditemukan</h1>
        <p className="text-[var(--text-muted)] mb-6">
          Episode ini tidak tersedia atau sedang bermasalah.
        </p>
        <Link href="/" className="btn-accent">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-6">
      <EpisodePlayer episode={episode} />
    </div>
  );
}
