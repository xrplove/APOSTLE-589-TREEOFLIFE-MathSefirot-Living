/**
 * Orquestador: datos de nacimiento → carta natal → perfiles planetarios →
 * proyección sobre el Árbol de la Vida.
 */

import { computeAspects, DEFAULT_ORB, type Aspect } from "./astrology/aspects";
import { computeAscendant, computePlanets, type Ascendant } from "./astrology/ephemeris";
import { localToUtc } from "./astrology/geocode";
import { obtenerPerfil, type PlanetProfile } from "./astrology/profile";
import { reduceToDigit, ROOT_MEANINGS, type RootMeaning } from "../lib/gematria/gematria";
import { PILLAR_COLOR, SEFIRA_BY_PLANET, SEFIROT, type Pillar, type SefiraDef } from "./sefirot/tree";

export interface ChartInput {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  latitude: number;
  longitude: number;
  timezone: string; // IANA
  placeName?: string;
  orb?: number; // tolerancia de aspectos en grados (por defecto 6)
}

export interface SefiraResult {
  sefira: SefiraDef;
  profile: PlanetProfile;
  lon: number;
}

export interface PillarSummary {
  pillar: Pillar;
  /** Nombre kabalístico del pilar según su función. */
  funcion: string;
  color: string;
  /** Media de intensidades de las Sefirot del pilar (0-100). */
  carga: number;
  /** Suma de intensidades de las Sefirot del pilar. */
  total: number;
  sefirot: string[];
}

/**
 * Síntesis del Árbol: combina los tres pilares en la "Frecuencia de Operación".
 *  - Expansión (derecho/Alma): Jojmá + Jésed + Netsaj → potencial de crecimiento.
 *  - Restricción (izquierdo/Cuerpo): Biná + Gevurá + Hod → estructura y disciplina.
 *  - Equilibrio (central/Psique): Kéter + Tiféret + Yesod + Maljut → conciencia y materia.
 */
export interface TreeSynthesis {
  expansion: number;
  restriccion: number;
  equilibrio: number;
  total: number;
  /** Dígito 1-9: la Frecuencia de Operación del Árbol. */
  frecuencia: number;
  meaning: RootMeaning;
}

export interface ChartResult {
  utcISO: string;
  place?: string;
  ascendant: Ascendant;
  sefirot: SefiraResult[];
  pillars: PillarSummary[];
  synthesis: TreeSynthesis;
  aspects: Aspect[];
  orb: number;
}

const PILLAR_FUNCION: Record<Pillar, string> = {
  Alma: "Expansión",
  Cuerpo: "Restricción",
  Psique: "Equilibrio",
};

export interface TransitSefira {
  sefiraId: string;
  planet: string;
  signo: string;
  grado: number;
  intensidad: number;
  lon: number;
}

/**
 * Tránsitos: posición e intensidad de los planetas en una fecha dada (por
 * defecto, ahora), mapeados a sus Sefirot. Independiente del lugar de nacimiento.
 */
export function computeTransits(at: Date = new Date()): TransitSefira[] {
  return computePlanets(at).map((pos) => {
    const sefira = SEFIRA_BY_PLANET[pos.planet];
    const profile = obtenerPerfil(pos.planet, pos.sign, pos.degInSign);
    return {
      sefiraId: sefira.id,
      planet: pos.planet,
      signo: pos.sign,
      grado: pos.degInSign,
      intensidad: profile.intensidad,
      lon: pos.lon,
    };
  });
}

export function buildNatalSefirot(input: ChartInput): ChartResult {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [h, mi] = input.time.split(":").map(Number);
  const utc = localToUtc(y, mo, d, h, mi, input.timezone);

  const positions = computePlanets(utc);
  const ascendant = computeAscendant(utc, input.latitude, input.longitude);
  const orb = input.orb ?? DEFAULT_ORB;
  const aspects = computeAspects(
    positions.map((p) => ({ planet: p.planet, lon: p.lon })),
    orb,
  );

  // Cada planeta carga su Sefirá; preservamos el orden canónico del árbol.
  const byId = new Map<string, SefiraResult>();
  for (const pos of positions) {
    const sefira = SEFIRA_BY_PLANET[pos.planet];
    const profile = obtenerPerfil(pos.planet, pos.sign, pos.degInSign);
    byId.set(sefira.id, { sefira, profile, lon: pos.lon });
  }
  const sefirot = SEFIROT.map((s) => byId.get(s.id)!).filter(Boolean);

  const pillars: PillarSummary[] = (["Alma", "Cuerpo", "Psique"] as Pillar[]).map((pillar) => {
    const items = sefirot.filter((r) => r.sefira.pilar === pillar);
    const total = items.reduce((sum, r) => sum + r.profile.intensidad, 0);
    return {
      pillar,
      funcion: PILLAR_FUNCION[pillar],
      color: PILLAR_COLOR[pillar],
      carga: Math.round(total / (items.length || 1)),
      total,
      sefirot: items.map((r) => r.sefira.nombre),
    };
  });

  const byPillar = (p: Pillar) => pillars.find((x) => x.pillar === p)!.total;
  const expansion = byPillar("Alma");
  const restriccion = byPillar("Cuerpo");
  const equilibrio = byPillar("Psique");
  const totalSum = expansion + restriccion + equilibrio;
  const frecuencia = reduceToDigit(totalSum);
  const synthesis: TreeSynthesis = {
    expansion,
    restriccion,
    equilibrio,
    total: totalSum,
    frecuencia,
    meaning: ROOT_MEANINGS[frecuencia],
  };

  return {
    utcISO: utc.toISOString(),
    place: input.placeName,
    ascendant,
    sefirot,
    pillars,
    synthesis,
    aspects,
    orb,
  };
}
