import { NextResponse } from "next/server";
import { geocodeCity } from "@/lib/astrology/geocode";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim();
  const lang = params.get("lang") ?? undefined;
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  try {
    const results = await geocodeCity(q, lang);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("/api/geocode error", err);
    return NextResponse.json({ error: "Geocoding no disponible." }, { status: 502 });
  }
}
