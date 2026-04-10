import { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { fetchAPI } from "@/lib/api";
import type { APIResponse, BatchData } from "@/types/anime";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchAPI<APIResponse<BatchData>>(`/batch/${slug}`, 300);
    return {
      title: `Download Batch - ${res.data.title}`,
      description: `Download batch ${res.data.title} subtitle Indonesia semua episode.`,
    };
  } catch {
    return { title: "Download Batch" };
  }
}

export default async function BatchPage({ params }: Props) {
  const { slug } = await params;

  let batch: BatchData | null = null;
  try {
    const res = await fetchAPI<APIResponse<BatchData>>(`/batch/${slug}`, 300);
    batch = res.data;
  } catch {
    // Error state
  }

  if (!batch) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">📦</p>
        <h1 className="text-2xl font-bold mb-2">Batch Tidak Ditemukan</h1>
        <Link href="/" className="btn-accent mt-4 inline-flex">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const qualities = batch.downloadUrl?.qualities || [];

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {batch.poster && (
          <div className="flex-shrink-0 w-[160px] mx-auto md:mx-0">
            <img
              src={batch.poster}
              alt={batch.title}
              className="w-full rounded-xl shadow-elevated"
            />
          </div>
        )}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            📦 Download Batch
          </h1>
          <h2 className="text-lg text-[var(--text-secondary)]">
            {batch.title}
          </h2>
          {batch.japanese && (
            <p className="text-sm text-[var(--text-muted)]">
              {batch.japanese}
            </p>
          )}
          <div className="flex gap-2">
            {batch.score && (
              <Badge variant="quality">⭐ {batch.score}</Badge>
            )}
            {batch.status && (
              <Badge
                variant="status"
                className={
                  batch.status === "Ongoing"
                    ? "bg-emerald-500"
                    : "bg-blue-500"
                }
              >
                {batch.status}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Download Table */}
      {qualities.length > 0 ? (
        <div className="space-y-6">
          {qualities.map((quality) => (
            <div key={quality.title} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {quality.title}
                </h3>
                <span className="text-sm text-[var(--text-muted)]">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                  >
                    {link.title}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p>Tidak ada link download batch tersedia.</p>
        </div>
      )}
    </div>
  );
}
