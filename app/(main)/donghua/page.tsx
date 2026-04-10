import { Metadata } from "next";
import Link from "next/link";
import AnimeCard from "@/components/ui/AnimeCard";
import { fetchAPI } from "@/lib/api";
import type { DonghuaHomeData, DonghuaItem } from "@/types/anime";

export const metadata: Metadata = {
  title: "Donghua",
  description: "Nonton donghua (anime China) subtitle Indonesia terlengkap.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function DonghuaPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");

  let latest: DonghuaItem[] = [];
  let completed: DonghuaItem[] = [];

  try {
    const res = await fetchAPI<DonghuaHomeData>(`/donghua/home/${page}`, 120);
    latest = res.latest_release || [];
    completed = res.completed_donghua || [];
  } catch {
    // Empty state
  }

  return (
    <div className="section-container py-8 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          🐉 Donghua
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Nonton donghua (anime China) subtitle Indonesia.
        </p>
      </div>

      {/* Latest Release */}
      {latest.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Rilis Terbaru</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
            {latest.map((d, i) => (
              <AnimeCard
                key={`${d.slug}-${i}`}
                title={d.title}
                poster={d.poster}
                href={`/donghua/${d.slug}`}
                status={d.status}
                episodes={d.current_episode}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Donghua Tamat</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
            {completed.map((d, i) => (
              <AnimeCard
                key={`completed-${d.slug}-${i}`}
                title={d.title}
                poster={d.poster}
                href={`/donghua/${d.slug}`}
                status="Completed"
              />
            ))}
          </div>
        </section>
      )}

      {latest.length === 0 && completed.length === 0 && (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">🐉</p>
          <p>Tidak ada data donghua tersedia.</p>
        </div>
      )}

      {/* Simple pagination */}
      <div className="flex justify-center gap-3">
        {page > 1 && (
          <Link href={`/donghua?page=${page - 1}`} className="btn-ghost">
            ← Sebelumnya
          </Link>
        )}
        <Link href={`/donghua?page=${page + 1}`} className="btn-accent">
          Berikutnya →
        </Link>
      </div>
    </div>
  );
}
