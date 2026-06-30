import { NextResponse } from "next/server";
import { buildNatalSefirot, type ChartInput } from "@/lib/chart";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChartInput>;

    if (!body.date || !body.time || body.latitude == null || body.longitude == null || !body.timezone) {
      return NextResponse.json(
        { error: "Faltan datos: date, time, latitude, longitude, timezone." },
        { status: 400 },
      );
    }

    const result = buildNatalSefirot({
      date: body.date,
      time: body.time,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      timezone: body.timezone,
      placeName: body.placeName,
      orb: body.orb != null ? Number(body.orb) : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/chart error", err);
    return NextResponse.json({ error: "No se pudo calcular la carta." }, { status: 500 });
  }
}
