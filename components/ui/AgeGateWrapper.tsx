"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgeGate from "@/components/ui/AgeGate";
import { isAdultGenre, isAgeVerified } from "@/lib/adult-config";

interface AgeGateWrapperProps {
  genreSlug: string;
  genreTitle: string;
  children: React.ReactNode;
}

export default function AgeGateWrapper({
  genreSlug,
  genreTitle,
  children,
}: AgeGateWrapperProps) {
  const [showGate, setShowGate] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAdultGenre(genreSlug)) {
      if (isAgeVerified()) {
        setVerified(true);
      } else {
        setShowGate(true);
      }
    } else {
      setVerified(true);
    }
  }, [genreSlug]);

  if (showGate) {
    return (
      <AgeGate
        genreTitle={genreTitle}
        onVerified={() => {
          setShowGate(false);
          setVerified(true);
        }}
        onCancel={() => {
          router.push("/genre");
        }}
      />
    );
  }

  if (!verified) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-[var(--text-muted)]">Memuat...</p>
      </div>
    );
  }

  return <>{children}</>;
}
