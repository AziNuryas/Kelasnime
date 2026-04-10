/**
 * Adult content configuration
 * Separated from client components to work in both Server and Client Components
 */

// Genre IDs yang memerlukan verifikasi umur 18+
export const ADULT_GENRE_IDS: string[] = [
  "ecchi",
  "harem",
  "josei",
  "shoujo-ai",
];

export function isAdultGenre(genreId: string): boolean {
  return ADULT_GENRE_IDS.includes(genreId.toLowerCase());
}

export function isAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("age_verified_18") === "true";
}

export function setAgeVerified(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("age_verified_18", "true");
  }
}
