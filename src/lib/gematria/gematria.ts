/**
 * Sistema de Gematría.
 *
 * Cifrados hebreos portados de yellis/Gematria (C#):
 *   - Absoluto (Mispar Hechrachi)
 *   - Absoluto Alternativo (finales sofit 500-900)
 *   - Ordinal (Mispar Siduri)
 *   - Reducido (Mispar Katan)
 *
 * Añadidos para este experimento:
 *   - Cifrado latino (ordinal A=1..Z=26 y pitagórico 1-9) para nombres en español.
 *   - Camino de vida a partir de la fecha de nacimiento.
 *
 * Puente con el Árbol: todo número reduce a 1-10 = una Sefirá
 * (Kéter=1 … Maljut=10), la numeración cabalística clásica.
 */

export type HebrewMethod = "absoluto" | "absolutoAlt" | "ordinal" | "reducido";
export type LatinMethod = "ordinal" | "pitagorico";

// --- Hebreo: valor absoluto (Mispar Hechrachi) ---
const HEB_ABSOLUTE: Record<string, number> = {
  א: 1, ב: 2, ג: 3, ד: 4, ה: 5, ו: 6, ז: 7, ח: 8, ט: 9,
  י: 10, כ: 20, ל: 30, מ: 40, נ: 50, ס: 60, ע: 70, פ: 80, צ: 90,
  ק: 100, ר: 200, ש: 300, ת: 400,
  // finales (sofit) — en absoluto valen igual que su forma estándar
  ך: 20, ם: 40, ן: 50, ף: 80, ץ: 90,
};

// finales en el cifrado alternativo: 500-900
const HEB_SOFIT_ALT: Record<string, number> = { ך: 500, ם: 600, ן: 700, ף: 800, ץ: 900 };

// orden para el cifrado ordinal (1..22, finales 23..27)
const HEB_ORDER = "אבגדהוזחטיכלמנסעפצקרשת".split("");
const HEB_SOFIT_ORDER: Record<string, number> = { ך: 23, ם: 24, ן: 25, ף: 26, ץ: 27 };

function reduceDigits(n: number): number {
  // suma de dígitos eliminando ceros (Mispar Katan)
  let s = 0;
  for (const ch of String(n)) s += Number(ch);
  return s > 9 ? reduceDigits(s) : s;
}

export function gematriaHebrew(text: string, method: HebrewMethod = "absoluto"): number {
  let total = 0;
  for (const ch of text) {
    if (method === "ordinal") {
      const idx = HEB_ORDER.indexOf(ch);
      if (idx >= 0) total += idx + 1;
      else if (HEB_SOFIT_ORDER[ch]) total += HEB_SOFIT_ORDER[ch];
      continue;
    }
    let v = HEB_ABSOLUTE[ch] ?? 0;
    if (method === "absolutoAlt" && HEB_SOFIT_ALT[ch]) v = HEB_SOFIT_ALT[ch];
    if (method === "reducido" && v) v = reduceDigits(v);
    total += v;
  }
  return total;
}

// --- Latino / español ---
const PYTHAGOREAN: Record<string, number> = {
  A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

/** Normaliza: mayúsculas, sin tildes, Ñ→N, solo A-Z. */
function normalizeLatin(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/Ñ/g, "N")
    .replace(/[^A-Z]/g, "");
}

export function gematriaLatin(text: string, method: LatinMethod = "ordinal"): number {
  const clean = normalizeLatin(text);
  let total = 0;
  for (const ch of clean) {
    total += method === "pitagorico" ? PYTHAGOREAN[ch] ?? 0 : ch.charCodeAt(0) - 64;
  }
  return total;
}

/** ¿El texto contiene caracteres hebreos? */
export function isHebrew(text: string): boolean {
  return /\p{Script=Hebrew}/u.test(text);
}

// --- Reducciones ---

/** Reducción teosófica a 1-9, preservando números maestros 11/22/33. */
export function reduceRoot(n: number): number {
  let x = Math.abs(n);
  while (x > 9 && x !== 11 && x !== 22 && x !== 33) {
    x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

/** Reducción total a un solo dígito 1-9 (sin preservar maestros). */
export function reduceToDigit(n: number): number {
  let x = Math.abs(Math.round(n));
  while (x > 9) x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  return x;
}

/** Reducción a 1-10 → Sefirá resonante (Kéter=1 … Maljut=10). */
export function reduceToSefiraNumber(n: number): number {
  const m = ((Math.abs(n) - 1) % 10) + 1;
  return m;
}

/** Numeración cabalística clásica: número → id de Sefirá. */
export const NUM_TO_SEFIRA_ID: Record<number, string> = {
  1: "keter", 2: "chokmah", 3: "binah", 4: "chesed", 5: "geburah",
  6: "tiferet", 7: "netzach", 8: "hod", 9: "yesod", 10: "malkut",
};

// --- Simbolismo de los números raíz ---

export interface RootMeaning {
  titulo: string;
  palabras: string; // palabras clave
  significado: string;
  maestro?: boolean;
}

export const ROOT_MEANINGS: Record<number, RootMeaning> = {
  1: {
    titulo: "El Líder",
    palabras: "iniciativa · independencia · voluntad",
    significado:
      "Energía de comienzo y autoafirmación. Empuje para iniciar, liderar y abrir camino en solitario.",
  },
  2: {
    titulo: "El Mediador",
    palabras: "cooperación · sensibilidad · equilibrio",
    significado:
      "Energía de la dualidad y la relación. Diplomacia, escucha y búsqueda de armonía entre opuestos.",
  },
  3: {
    titulo: "El Comunicador",
    palabras: "expresión · creatividad · alegría",
    significado:
      "Energía expansiva y social. Talento para crear, expresar y contagiar entusiasmo.",
  },
  4: {
    titulo: "El Constructor",
    palabras: "orden · estabilidad · disciplina",
    significado:
      "Energía de estructura y método. Construye con paciencia bases sólidas y duraderas.",
  },
  5: {
    titulo: "El Aventurero",
    palabras: "libertad · cambio · versatilidad",
    significado:
      "Energía de movimiento y experiencia. Curiosidad, adaptabilidad y necesidad de libertad.",
  },
  6: {
    titulo: "El Protector",
    palabras: "amor · responsabilidad · servicio",
    significado:
      "Energía de cuidado y armonía. Vínculo, hogar y entrega hacia los demás.",
  },
  7: {
    titulo: "El Místico",
    palabras: "introspección · análisis · sabiduría",
    significado:
      "Energía de búsqueda interior. Reflexión, espiritualidad y comprensión profunda.",
  },
  8: {
    titulo: "El Ejecutivo",
    palabras: "poder · ambición · materia",
    significado:
      "Energía de manifestación material. Capacidad de organizar, dirigir y prosperar.",
  },
  9: {
    titulo: "El Humanitario",
    palabras: "compasión · idealismo · cierre",
    significado:
      "Energía de culminación y entrega universal. Cierra ciclos al servicio de un bien mayor.",
  },
  11: {
    titulo: "El Visionario (maestro)",
    palabras: "intuición · inspiración · iluminación",
    significado:
      "El 2 elevado a maestro: intuición y sensibilidad amplificadas hacia la inspiración espiritual.",
    maestro: true,
  },
  22: {
    titulo: "El Gran Constructor (maestro)",
    palabras: "visión · realización · legado",
    significado:
      "El 4 elevado a maestro: capacidad de materializar grandes visiones con impacto duradero.",
    maestro: true,
  },
  33: {
    titulo: "El Sanador (maestro)",
    palabras: "amor incondicional · servicio · guía",
    significado:
      "El 6 elevado a maestro: entrega y servicio compasivo desde el amor más elevado.",
    maestro: true,
  },
};

export function rootMeaning(root: number): RootMeaning {
  return ROOT_MEANINGS[root] ?? ROOT_MEANINGS[reduceRoot(root)];
}

// --- Cálculos de alto nivel ---

export interface GematriaValue {
  raw: number; // valor total del cifrado
  root: number; // reducción teosófica (1-9 o maestro 11/22/33)
  sefiraNumber: number; // 1-10
  sefiraId: string;
  method: string;
}

export function nameGematria(name: string): GematriaValue {
  const hebrew = isHebrew(name);
  const raw = hebrew ? gematriaHebrew(name, "absoluto") : gematriaLatin(name, "ordinal");
  const sefiraNumber = reduceToSefiraNumber(raw);
  return {
    raw,
    root: reduceRoot(raw),
    sefiraNumber,
    sefiraId: NUM_TO_SEFIRA_ID[sefiraNumber],
    method: hebrew ? "Hebreo absoluto (Mispar Hechrachi)" : "Latino ordinal (A=1…Z=26)",
  };
}

/** Camino de vida: reduce mes, día y año por separado y suma (método estándar). */
export function lifePath(dateISO: string): GematriaValue {
  const [y, m, d] = dateISO.split("-").map(Number);
  const sum = reduceRoot(reduceRoot(y) + reduceRoot(m) + reduceRoot(d));
  const raw = y + m + d;
  const sefiraNumber = reduceToSefiraNumber(sum);
  return {
    raw,
    root: sum,
    sefiraNumber,
    sefiraId: NUM_TO_SEFIRA_ID[sefiraNumber],
    method: "Camino de vida (reducción por componentes)",
  };
}

// --- Proyección a los tres pilares ---
//
// El Nombre = esencia del alma (atemporal, talentos) → pilar derecho (Alma).
// La Fecha  = anclaje físico de la encarnación, puerta a Maljut → pilar izquierdo (Cuerpo).
// La Psique = suma reducida de ambos → pilar central (cómo el alma conduce su vehículo).

export type GematriaPillar = "Alma" | "Cuerpo" | "Psique";

export interface PillarGematria {
  pillar: GematriaPillar;
  fuente: string; // "Nombre", "Fecha", "Síntesis"
  raw?: number; // valor bruto del cifrado (nombre/fecha)
  root: number; // número simbólico de la columna (1-9 o maestro)
  meaning: RootMeaning;
  glosa: string; // lectura esotérica de la columna
  formula?: string; // cómo se obtiene (para la columna central)
}

const GLOSA: Record<GematriaPillar, string> = {
  Alma:
    "El nombre: la esencia atemporal del alma. Tus talentos innatos y la forma en que te muestras al mundo — el «cómo», tu vehículo y tus herramientas.",
  Cuerpo:
    "La fecha: el anclaje físico de esta encarnación. El camino y las lecciones que la vida te pone delante — el «qué», la puerta a Maljut (el Reino).",
  Psique:
    "La síntesis: cómo tu alma conduce su vehículo por el camino. Eje central que reconcilia esencia y materia.",
};

export interface GematriaResult {
  name: GematriaValue;
  date: GematriaValue;
  pillars: { alma: PillarGematria; cuerpo: PillarGematria; psique: PillarGematria };
}

export function computeGematria(name: string, dateISO: string): GematriaResult {
  const nameG = nameGematria(name);
  const dateG = lifePath(dateISO);
  const psiqueRoot = reduceRoot(nameG.root + dateG.root);

  const alma: PillarGematria = {
    pillar: "Alma",
    fuente: "Nombre",
    raw: nameG.raw,
    root: nameG.root,
    meaning: rootMeaning(nameG.root),
    glosa: GLOSA.Alma,
  };
  const cuerpo: PillarGematria = {
    pillar: "Cuerpo",
    fuente: "Fecha",
    raw: dateG.raw,
    root: dateG.root,
    meaning: rootMeaning(dateG.root),
    glosa: GLOSA.Cuerpo,
  };
  const psique: PillarGematria = {
    pillar: "Psique",
    fuente: "Síntesis",
    root: psiqueRoot,
    meaning: rootMeaning(psiqueRoot),
    glosa: GLOSA.Psique,
    formula: `${nameG.root} (alma) + ${dateG.root} (cuerpo) → ${psiqueRoot}`,
  };

  return { name: nameG, date: dateG, pillars: { alma, cuerpo, psique } };
}
