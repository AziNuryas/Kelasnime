import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "KelasNime — Nonton Anime Sub Indo Gratis Terlengkap",
    template: "%s | KelasNime",
  },
  description:
    "Nonton anime subtitle Indonesia gratis, streaming dan download anime terlengkap dari Otakudesu, Samehadaku, dan 10+ sumber populer lainnya.",
  keywords: [
    "nonton anime",
    "anime sub indo",
    "streaming anime",
    "download anime",
    "anime terbaru",
    "anime ongoing",
    "donghua sub indo",
    "KelasNime",
  ],
  authors: [{ name: "KelasNime" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "KelasNime",
    title: "KelasNime — Nonton Anime Sub Indo Gratis Terlengkap",
    description:
      "Streaming dan download anime subtitle Indonesia dari 12+ sumber populer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} dark`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
