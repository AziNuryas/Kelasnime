import { Metadata } from "next";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import Badge from "@/components/ui/Badge";

interface DonghuaDetail {
  title: string;
  poster: string;
  status: string;
  type: string;
  synopsis?: string;
  episodeList?: {
    title: string;
    slug: string;
    href: string;
  }[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetchAPI<{ data: DonghuaDetail }>(`/donghua/detail/${slug}`, 300);
    return {
      title: res.data?.title || "Donghua Detail",
      description: `Nonton ${res.data?.title} subtitle Indonesia.`,
    };
  } catch {
    return { title: "Donghua Detail" };
  }
}

export default async function DonghuaDetailPage({ params }: Props) {
  const { slug } = await params;

  let donghua: DonghuaDetail | null = null;
  try {
    const res = await fetchAPI<{ data: DonghuaDetail }>(`/donghua/detail/${slug}`, 300);
    donghua = res.data;
  } catch {
    // Error state
  }

  if (!donghua) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-6xl mb-4">🐉</p>
        <h1 className="text-2xl font-bold mb-2">Donghua Tidak Ditemukan</h1>
        <Link href="/donghua" className="btn-accent mt-4 inline-flex">
          Kembali ke Donghua
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 w-[180px] mx-auto md:mx-0">
          <img
            src={donghua.poster}
            alt={donghua.title}
            className="w-full rounded-xl shadow-elevated"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {donghua.title}
          </h1>

          <div className="flex gap-2">
            <Badge variant="status" className="bg-amber-500">Donghua</Badge>
            {donghua.status && (
              <Badge variant="status" className={donghua.status === "Ongoing" ? "bg-emerald-500" : "bg-blue-500"}>
                {donghua.status}
              </Badge>
            )}
          </div>

          {donghua.synopsis && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {donghua.synopsis}
            </p>
          )}
        </div>
      </div>

      {/* Episode List */}
      {donghua.episodeList && donghua.episodeList.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
            📺 Daftar Episode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {donghua.episodeList.map((ep, i) => (
              <Link
                key={`${ep.slug}-${i}`}
                href={`/donghua/episode/${ep.slug}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 hover:bg-[var(--bg-card-hover)] transition-all text-sm text-[var(--text-secondary)] hover:text-cyan-400"
              >
                {ep.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
