/**
 * Cálculo de posiciones planetarias geocéntricas (longitud eclíptica tropical
 * de la fecha) usando astronomy-engine. Sin dependencias nativas.
 */

import * as Astronomy from "astronomy-engine";
import { SIGNS, type Planet, type Sign } from "./dignities";

const BODY_MAP: Record<Planet, Astronomy.Body> = {
  Sol: Astronomy.Body.Sun,
  Luna: Astronomy.Body.Moon,
  Mercurio: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Marte: Astronomy.Body.Mars,
  Júpiter: Astronomy.Body.Jupiter,
  Saturno: Astronomy.Body.Saturn,
  Urano: Astronomy.Body.Uranus,
  Neptuno: Astronomy.Body.Neptune,
  Plutón: Astronomy.Body.Pluto,
};

export interface PlanetPosition {
  planet: Planet;
  /** Longitud eclíptica tropical 0-360°. */
  lon: number;
  sign: Sign;
  /** Grado dentro del signo, 0-29. */
  degInSign: number;
}

const norm360 = (x: number) => ((x % 360) + 360) % 360;

/** Longitud eclíptica (0-360) → signo + grado dentro del signo. */
export function lonToSign(lon: number): { sign: Sign; degInSign: number } {
  const l = norm360(lon);
  const idx = Math.floor(l / 30) % 12;
  return { sign: SIGNS[idx], degInSign: l - idx * 30 };
}

/** Longitud eclíptica geocéntrica de fecha (true equinox of date) de un planeta. */
function geoEclipticLon(planet: Planet, date: Date): number {
  if (planet === "Luna") {
    // EclipticGeoMoon ya devuelve coordenadas eclípticas de la fecha.
    return norm360(Astronomy.EclipticGeoMoon(date).lon);
  }
  // Vector equatorial J2000 → frame eclíptico verdadero de la fecha (ECT).
  // La longitud se toma directa del vector (atan2): Astronomy.Ecliptic() asume
  // entrada EQJ y reaplicaría la oblicuidad J2000, duplicando la transformación.
  const eqj = Astronomy.GeoVector(BODY_MAP[planet], date, true);
  const ect = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(date), eqj);
  return norm360((Math.atan2(ect.y, ect.x) * 180) / Math.PI);
}

export function computePlanets(dateUtc: Date): PlanetPosition[] {
  return (Object.keys(BODY_MAP) as Planet[]).map((planet) => {
    const lon = geoEclipticLon(planet, dateUtc);
    const { sign, degInSign } = lonToSign(lon);
    return { planet, lon, sign, degInSign };
  });
}

/** Oblicuidad media de la eclíptica (grados) — Laskar/Meeus, suficiente para signos. */
function meanObliquity(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  return (
    23.4392911111 -
    (46.815 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600
  );
}

const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;

export interface Ascendant {
  lon: number;
  sign: Sign;
  degInSign: number;
}

/**
 * Ascendente: punto de la eclíptica que asciende por el horizonte este.
 * Fórmula estándar (Wikipedia "Ascendant"): a partir del Tiempo Sidéreo Local.
 * lonEast en grados (este positivo), lat en grados.
 */
export function computeAscendant(dateUtc: Date, lat: number, lonEast: number): Ascendant {
  const gstHours = Astronomy.SiderealTime(dateUtc); // tiempo sidéreo de Greenwich, horas
  const lstDeg = norm360((gstHours + lonEast / 15) * 15); // RAMC en grados
  const eps = meanObliquity(dateUtc);

  const ramc = d2r(lstDeg);
  const e = d2r(eps);
  const phi = d2r(lat);

  let asc = r2d(
    Math.atan2(
      Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(e) + Math.tan(phi) * Math.sin(e)),
    ),
  );
  asc = norm360(asc);
  const { sign, degInSign } = lonToSign(asc);
  return { lon: asc, sign, degInSign };
}
