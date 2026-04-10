import Link from "next/link";
import { Home, Search, Tv } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-[120px] sm:text-[160px] font-black gradient-text leading-none select-none animate-float">
            404
          </h1>
          <div className="absolute inset-0 bg-accent-gradient opacity-10 blur-3xl rounded-full" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan. Mungkin link-nya salah?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-accent">
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
          <Link href="/ongoing" className="btn-ghost">
            <Tv className="w-4 h-4" />
            Anime Ongoing
          </Link>
          <Link href="/search" className="btn-ghost">
            <Search className="w-4 h-4" />
            Cari Anime
          </Link>
        </div>
      </div>
    </div>
  );
}
