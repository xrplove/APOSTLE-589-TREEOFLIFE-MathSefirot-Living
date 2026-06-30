/**
 * Cálculo de aspectos astrológicos entre planetas y su proyección sobre el
 * Árbol: cada aspecto se dibuja como una línea entre las dos Sefirot implicadas.
 *   - Fluidez (sextil, trígono) → tonos verde/azul (talentos)
 *   - Tensión (cuadratura, oposición) → rojo (conflictos internos)
 *   - Conjunción → dorado (energías fundidas / intensificadas)
 */

import type { Planet } from "./dignities";
import { SEFIRA_BY_PLANET } from "../sefirot/tree";

export type Harmony = "fluido" | "tension" | "neutro";

export interface AspectType {
  name: string;
  angle: number;
  harmony: Harmony;
  color: string;
  glyph: string;
}

export const ASPECT_TYPES: AspectType[] = [
  { name: "Conjunción", angle: 0, harmony: "neutro", color: "#f5d76e", glyph: "☌" },
  { name: "Sextil", angle: 60, harmony: "fluido", color: "#5bd1c4", glyph: "✶" },
  { name: "Cuadratura", angle: 90, harmony: "tension", color: "#e0625b", glyph: "□" },
  { name: "Trígono", angle: 120, harmony: "fluido", color: "#5be07a", glyph: "△" },
  { name: "Oposición", angle: 180, harmony: "tension", color: "#e0857a", glyph: "☍" },
];

export const DEFAULT_ORB = 6;

export interface Aspect {
  aPlanet: Planet;
  bPlanet: Planet;
  aId: string; // sefirá A
  bId: string; // sefirá B
  type: string;
  harmony: Harmony;
  color: string;
  glyph: string;
  /** Separación real respecto al ángulo exacto del aspecto (grados). */
  orb: number;
  /** 0-1: 1 = exacto, 0 = en el límite del orbe. Controla grosor/opacidad. */
  strength: number;
}

function separation(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export interface PlanetLon {
  planet: Planet;
  lon: number;
}

export function computeAspects(planets: PlanetLon[], orb: number = DEFAULT_ORB): Aspect[] {
  const out: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const sep = separation(planets[i].lon, planets[j].lon);
      let best: { t: AspectType; diff: number } | null = null;
      for (const t of ASPECT_TYPES) {
        const diff = Math.abs(sep - t.angle);
        if (diff <= orb && (!best || diff < best.diff)) best = { t, diff };
      }
      if (!best) continue;
      out.push({
        aPlanet: planets[i].planet,
        bPlanet: planets[j].planet,
        aId: SEFIRA_BY_PLANET[planets[i].planet].id,
        bId: SEFIRA_BY_PLANET[planets[j].planet].id,
        type: best.t.name,
        harmony: best.t.harmony,
        color: best.t.color,
        glyph: best.t.glyph,
        orb: Number(best.diff.toFixed(1)),
        strength: 1 - best.diff / orb,
      });
    }
  }
  // más exactos primero
  return out.sort((x, y) => y.strength - x.strength);
}
