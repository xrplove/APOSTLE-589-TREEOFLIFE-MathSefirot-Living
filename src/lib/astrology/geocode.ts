/**
 * Geocoding de ciudades vía Open-Meteo (gratuito, sin API key) y conversión
 * de hora civil local del lugar de nacimiento a UTC (con DST histórico vía Intl).
 */

export interface GeoResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export async function geocodeCity(query: string, language = "en"): Promise<GeoResult[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  // Open-Meteo soporta estos idiomas para los nombres de lugar.
  url.searchParams.set("language", ["en", "es"].includes(language) ? language : "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Geocoding falló: ${res.status}`);
  const data = await res.json();
  if (!data.results) return [];

  return data.results.map(
    (r: {
      name: string;
      country: string;
      admin1?: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }) => ({
      name: r.name,
      country: r.country,
      admin1: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    }),
  );
}

/** Offset (ms) de una zona IANA respecto a UTC en un instante dado: local - utc. */
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(new Date(utcMs));
  const map: Record<string, number> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = Number(p.value);
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return asUtc - utcMs;
}

/**
 * Convierte una hora civil local (componentes "naive") de una zona IANA a un
 * instante UTC. Doble pasada para resolver correctamente el offset/DST.
 */
export function localToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const off1 = tzOffsetMs(guess, timeZone);
  const off2 = tzOffsetMs(guess - off1, timeZone);
  return new Date(guess - off2);
}
