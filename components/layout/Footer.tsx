import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

function FooterLogo() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="footerHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Hexagon Background */}
      <path d="M50 5 L88.97 27.5 L88.97 72.5 L50 95 L11.03 72.5 L11.03 27.5 Z" fill="url(#footerHexGrad)" fillOpacity="0.15" stroke="url(#footerHexGrad)" strokeWidth="6" strokeLinejoin="round" />
      {/* Hexagon Inner Stroke */}
      <path d="M50 15 L80.31 32.5 L80.31 67.5 L50 85 L19.69 67.5 L19.69 32.5 Z" stroke="url(#footerHexGrad)" strokeWidth="2" strokeLinejoin="round" opacity="0.5" />
      {/* Play Button */}
      <path d="M42 35 L42 65 L68 50 Z" fill="url(#footerHexGrad)" />
    </svg>
  );
}

export default function Footer() {
  const platformList = Object.values(PLATFORMS);

  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <FooterLogo />
              <span className="text-lg font-bold gradient-text">KelasNime</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Nonton anime sub Indo gratis, streaming dan download dari berbagai
              sumber terpercaya.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/ongoing", label: "Anime Ongoing" },
                { href: "/completed", label: "Anime Tamat" },
                { href: "/movie", label: "Anime Movie" },
                { href: "/schedule", label: "Jadwal Mingguan" },
                { href: "/genre", label: "Daftar Genre" },
                { href: "/donghua", label: "Donghua" },
                { href: "/search", label: "Pencarian" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Sumber Data
            </h3>
            <div className="flex flex-wrap gap-2">
              {platformList.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border-default)] text-[var(--text-secondary)]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              Data disediakan oleh{" "}
              <a
                href="https://sankavollerei.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
              >
                Sanka Vollerei API
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[var(--border-default)] flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-xs text-[var(--text-muted)] space-y-1.5 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} KelasNime. Dibuat untuk edukasi dan hiburan.
            </p>
            <p>
              Dikembangkan oleh{" "}
              <a
                href="https://azinuryas.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
              >
                AziDev (Portofolio)
              </a>
              .
            </p>
          </div>
          <div className="text-xs text-[var(--text-muted)] space-y-1.5 text-center md:text-right">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Terima kasih untuk API dari{" "}
              <a
                href="https://sankavollerei.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center transition-colors"
              >
                Sanka Vollerei
              </a>
              {" "}dan Dev-nya! 🎉
            </p>
            <p>
              KelasNime tidak menyimpan file apapun di server kami.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
