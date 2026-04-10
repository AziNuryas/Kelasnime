import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "otakudesu.blog" },
      { protocol: "https", hostname: "anichin.cafe" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i3.wp.com" },
      { protocol: "https", hostname: "cdn.samehadaku.tv" },
      { protocol: "https", hostname: "samehadaku.email" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "cdn.anilist.co" },
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "oploverz.top" },
      { protocol: "https", hostname: "animasu.cc" },
      { protocol: "https", hostname: "kusonime.com" },
      { protocol: "https", hostname: "anoboy.media" },
    ],
  },
};

export default nextConfig;
