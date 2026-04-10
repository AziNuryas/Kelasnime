import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

function FooterLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
      <defs>
        <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#footerGrad)" opacity="0.15" />
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="url(#footerGrad)" strokeWidth="1.5" fill="none" />
      <path d="M12 8L12 24L26 16Z" fill="url(#footerGrad)" opacity="0.9" />
      <path d="M8 7L8 25M8 16L18 7M8 16L18 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="mt-10 pt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} KelasNime. Dibuat untuk edukasi dan
            hiburan.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            KelasNime tidak menyimpan file apapun di server kami.
          </p>
        </div>
      </div>
    </footer>
  );
}
