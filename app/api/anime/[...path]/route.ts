import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // Paksa endpoint ini agar selalu jadi dynamic (tidak dicache satupun)
export const fetchCache = 'force-no-store';

const BASE = process.env.ANIME_API_BASE || "https://www.sankavollerei.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const search = request.nextUrl.search;
  const url = `${BASE}/anime/${pathStr}${search}`;

  try {
    const res = await fetch(url, {
      cache: "no-store", // Pastikan fetch proxy juga tidak dicache
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent": "KelasNime/1.0",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    return Response.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate", // Hapus max-age yang bikin nyangkut
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Kesalahan tidak diketahui";

    return Response.json(
      {
        status: "error",
        message: `Gagal mengambil data: ${message}`,
        ok: false,
        data: null,
      },
      { status: 502 }
    );
  }
}
