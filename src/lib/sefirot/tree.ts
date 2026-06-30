/**
 * Definición del Árbol de la Vida (10 Sefirot + 22 senderos) y la correspondencia
 * planeta ↔ Sefirá según la tradición de la Golden Dawn, adaptada al esquema
 * Alma (pilar derecho) / Cuerpo (pilar izquierdo) / Psique (pilar medio).
 *
 * Las 10 Sefirot mapean 1:1 con los 10 planetas, así que la intensidad de
 * expresión de cada planeta en la carta natal "carga" su Sefirá correspondiente.
 */

import type { Planet } from "../astrology/dignities";

export type Pillar = "Alma" | "Cuerpo" | "Psique";

export interface SefiraDef {
  id: string;
  hebreo: string;
  nombre: string;
  glifo: string; // símbolo del planeta
  planeta: Planet;
  pilar: Pillar;
  rol: string; // función dentro del esquema Alma/Cuerpo/Psique
  /** Posición en el viewBox 1000x1300. */
  x: number;
  y: number;
}

/**
 * Correspondencia Golden Dawn (adaptada):
 *  Kéter←Neptuno (océano/fuente)  ·  Maljut←Plutón (reino material, lo ctónico)
 * El resto sigue la atribución clásica.
 */
export const SEFIROT: SefiraDef[] = [
  {
    id: "keter", hebreo: "כֶּתֶר", nombre: "Kéter", glifo: "♆", planeta: "Neptuno",
    pilar: "Psique", x: 500, y: 90,
    rol: "Corona · Voluntad y esencia del Ser, por encima de la distinción cuerpo/alma.",
  },
  {
    id: "chokmah", hebreo: "חָכְמָה", nombre: "Jojmá", glifo: "♅", planeta: "Urano",
    pilar: "Alma", x: 760, y: 230,
    rol: "Sabiduría · Semilla, intuición, destello de inspiración del alma.",
  },
  {
    id: "binah", hebreo: "בִּינָה", nombre: "Biná", glifo: "♄", planeta: "Saturno",
    pilar: "Cuerpo", x: 240, y: 230,
    rol: "Entendimiento · Estructura mental que da forma y límite al pensamiento.",
  },
  {
    id: "chesed", hebreo: "חֶסֶד", nombre: "Jésed", glifo: "♃", planeta: "Júpiter",
    pilar: "Alma", x: 760, y: 510,
    rol: "Bondad · Impulso de dar, energía emocional expansiva del alma.",
  },
  {
    id: "geburah", hebreo: "גְּבוּרָה", nombre: "Gevurá", glifo: "♂", planeta: "Marte",
    pilar: "Cuerpo", x: 240, y: 510,
    rol: "Severidad · Disciplina y límites: el cuerpo que restringe y sostiene.",
  },
  {
    id: "tiferet", hebreo: "תִּפְאֶרֶת", nombre: "Tiféret", glifo: "☉", planeta: "Sol",
    pilar: "Psique", x: 500, y: 640,
    rol: "Belleza · Corazón de la psique; donde alma y cuerpo se reconcilian.",
  },
  {
    id: "netzach", hebreo: "נֶצַח", nombre: "Netsaj", glifo: "♀", planeta: "Venus",
    pilar: "Alma", x: 760, y: 850,
    rol: "Victoria · Fuerza de voluntad y persistencia que empuja a la meta.",
  },
  {
    id: "hod", hebreo: "הוֹד", nombre: "Hod", glifo: "☿", planeta: "Mercurio",
    pilar: "Cuerpo", x: 240, y: 850,
    rol: "Gloria · Reconocer límites; ajustar la estructura al mundo material.",
  },
  {
    id: "yesod", hebreo: "יְסוֹד", nombre: "Yesod", glifo: "☽", planeta: "Luna",
    pilar: "Psique", x: 500, y: 1000,
    rol: "Fundamento · Subconsciente y puente; filtra antes de manifestar.",
  },
  {
    id: "malkut", hebreo: "מַלְכוּת", nombre: "Maljut", glifo: "♇", planeta: "Plutón",
    pilar: "Psique", x: 500, y: 1200,
    rol: "Reino · Cuerpo físico ya manifestado; la psique hecha materia.",
  },
];

/** Los 22 senderos clásicos (Árbol de Kircher), por id de Sefirá. */
export const PATHS: [string, string][] = [
  ["keter", "chokmah"], ["keter", "binah"], ["keter", "tiferet"],
  ["chokmah", "binah"], ["chokmah", "tiferet"], ["chokmah", "chesed"],
  ["binah", "tiferet"], ["binah", "geburah"],
  ["chesed", "geburah"], ["chesed", "tiferet"], ["chesed", "netzach"],
  ["geburah", "tiferet"], ["geburah", "hod"],
  ["tiferet", "netzach"], ["tiferet", "hod"], ["tiferet", "yesod"],
  ["netzach", "hod"], ["netzach", "yesod"], ["netzach", "malkut"],
  ["hod", "yesod"], ["hod", "malkut"],
  ["yesod", "malkut"],
];

export const PILLAR_COLOR: Record<Pillar, string> = {
  Alma: "#e0a84e", // dorado cálido — fuerza vital / derecha
  Cuerpo: "#4e86e0", // azul frío — estructura / izquierda
  Psique: "#a86ee0", // violeta — eje central / consciencia
};

export const SEFIRA_BY_PLANET: Record<Planet, SefiraDef> = SEFIROT.reduce(
  (acc, s) => ({ ...acc, [s.planeta]: s }),
  {} as Record<Planet, SefiraDef>,
);

/**
 * Los cuatro mundos cabalísticos. Indican en qué dimensión de la realidad
 * opera el usuario con mayor naturalidad (según la carga de sus Sefirot).
 */
export interface WorldDef {
  id: string;
  nombre: string; // hebreo
  traduccion: string; // castellano
  dimension: string; // mental / emocional / etc.
  color: string;
  sefiraIds: string[];
}

export const WORLDS: WorldDef[] = [
  {
    id: "atziluth", nombre: "Atziluth", traduccion: "Emanación",
    dimension: "Espiritual · voluntad", color: "#e8d36a",
    sefiraIds: ["keter", "chokmah", "binah"],
  },
  {
    id: "briah", nombre: "Briah", traduccion: "Creación",
    dimension: "Mental · intelecto", color: "#6ad7ff",
    sefiraIds: ["chesed", "geburah", "tiferet"],
  },
  {
    id: "yetzirah", nombre: "Yetzirah", traduccion: "Formación",
    dimension: "Emocional · creativa", color: "#a86ee0",
    sefiraIds: ["netzach", "hod", "yesod"],
  },
  {
    id: "assiah", nombre: "Assiah", traduccion: "Acción",
    dimension: "Físico · material", color: "#e0857a",
    sefiraIds: ["malkut"],
  },
];
