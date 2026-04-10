import { NextRequest } from "next/server";

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
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
