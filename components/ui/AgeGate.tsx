"use client";

import { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { setAgeVerified } from "@/lib/adult-config";

// Re-export for convenience
export { ADULT_GENRE_IDS, isAdultGenre, isAgeVerified } from "@/lib/adult-config";

interface AgeGateProps {
  genreTitle: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function AgeGate({ genreTitle, onVerified, onCancel }: AgeGateProps) {
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (isNaN(year) || birthYear.length !== 4) {
      setError("Masukkan tahun lahir yang valid (contoh: 2000)");
      return;
    }

    if (age < 18) {
      setError("Kamu harus berusia minimal 18 tahun untuk mengakses konten ini.");
      return;
    }

    if (age > 100) {
      setError("Tahun lahir tidak valid.");
      return;
    }

    setAgeVerified();
    onVerified();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-card p-8 space-y-6 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Verifikasi Umur
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Konten genre <span className="font-semibold text-red-400">{genreTitle}</span> memiliki 
            materi yang hanya ditujukan untuk pengguna berusia <span className="font-semibold text-[var(--text-primary)]">18 tahun ke atas</span>.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Masukkan Tahun Lahir
          </label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => {
              setBirthYear(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="contoh: 2000"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] text-center text-lg font-semibold tracking-widest placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
            min="1920"
            max={new Date().getFullYear()}
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-400 text-center animate-fade-in">
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-ghost py-3"
          >
            Kembali
          </button>
          <button
            onClick={handleVerify}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-md shadow-red-500/20"
          >
            Verifikasi
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
          Dengan mengklik &quot;Verifikasi&quot;, kamu menyatakan bahwa kamu berusia 
          18 tahun ke atas dan bertanggung jawab atas konten yang kamu akses.
        </p>
      </div>
    </div>
  );
}
