import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParam?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParam = "page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}${queryParam}=${page}`;
  };

  // Generate page numbers to show
  const pages: (number | "...")[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="btn-ghost px-3 py-2 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      ) : (
        <span className="px-3 py-2 text-xs text-[var(--text-muted)] opacity-40 cursor-not-allowed flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </span>
      )}

      {/* Pages */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-muted)]"
          >
            ⋯
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page as number)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
              page === currentPage
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            )}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="btn-ghost px-3 py-2 text-xs"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="px-3 py-2 text-xs text-[var(--text-muted)] opacity-40 cursor-not-allowed flex items-center gap-1">
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
