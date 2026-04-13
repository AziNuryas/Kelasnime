/**
 * Centralized API fetch helper for KelasNime
 *
 * Server Components: use fetchAPI() — fetches directly from Sanka API (server-to-server)
 * Client Components: use fetchClient() — fetches through our /api/anime proxy
 */

const API_BASE = process.env.ANIME_API_BASE || "https://www.sankavollerei.com";

/**
 * Server-side fetch — used in Server Components and API routes
 * Fetches directly from Sanka Vollerei API (Dynamic/No-cache)
 */
export async function fetchAPI<T>(
  path: string,
  revalidate?: number // parameter ini dibiarkan untuk backward compability tapi tidak dipakai
): Promise<T> {
  const url = `${API_BASE}/anime${path}`;

  const res = await fetch(url, {
    cache: "no-store", // ⬅️ Ini kuncinya: paksa ambil data real-time
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "KelasNime/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText} — ${url}`);
  }

  const json = await res.json();
  return json;
}

/**
 * Client-side fetch — used in "use client" components
 * Goes through our /api/anime/[...path] proxy to avoid CORS
 */
export async function fetchClient<T>(path: string): Promise<T> {
  const res = await fetch(`/api/anime${path}`);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

/**
 * Parallel fetch multiple endpoints — returns results even if some fail
 * Useful for homepage (multiple sections) and search (multiple platforms)
 */
export async function fetchParallel<T>(
  paths: { path: string; revalidate?: number }[]
): Promise<(T | null)[]> {
  const results = await Promise.allSettled(
    paths.map(({ path, revalidate }) => fetchAPI<T>(path, revalidate))
  );

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : null
  );
}
