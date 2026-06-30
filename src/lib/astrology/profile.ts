/**
 * Cálculo del perfil de un planeta: intensidad de expresión + mezcla de decanato.
 * Equivalente tipado de CalculadoraAstral.obtenerPerfil().
 */

import {
  DATOS_ASTROS,
  INTENSIDADES,
  TRIPLICIDADES,
  type Dignity,
  type Planet,
  type Sign,
} from "./dignities";

export interface PlanetProfile {
  astro: Planet;
  signo: Sign;
  grado: number;
  descripcion: string;
  dignidad: Dignity;
  /** Intensidad de expresión del planeta, 0-100. Este es el % que alimenta la Sefirá. */
  intensidad: number;
  decanato: 1 | 2 | 3;
  decanatoLabel: string;
  /** Signo del mismo elemento que matiza el decanato (null en el 1er decanato). */
  tonoExtra: Sign | null;
  porcentajePuro: number;
  porcentajeMezcla: number;
  mezcla: string;
  interpretacion: string;
}

export function obtenerPerfil(astro: Planet, signo: Sign, grado: number): PlanetProfile {
  const g = Math.max(0, Math.min(29, Math.floor(grado)));
  const datos = DATOS_ASTROS[astro][signo];
  const intensidad = INTENSIDADES[datos.dignidad];

  let decanato: 1 | 2 | 3;
  let decanatoLabel: string;
  let tonoExtra: Sign | null;
  let porcentajePuro: number;
  let porcentajeMezcla: number;

  if (g <= 9) {
    decanato = 1;
    decanatoLabel = "1.er Decanato (0°-9°)";
    tonoExtra = null;
    porcentajePuro = 100;
    porcentajeMezcla = 0;
  } else if (g <= 19) {
    decanato = 2;
    decanatoLabel = "2.º Decanato (10°-19°)";
    tonoExtra = TRIPLICIDADES[signo][1];
    porcentajePuro = 70;
    porcentajeMezcla = 30;
  } else {
    decanato = 3;
    decanatoLabel = "3.er Decanato (20°-29°)";
    tonoExtra = TRIPLICIDADES[signo][2];
    porcentajePuro = 50;
    porcentajeMezcla = 50;
  }

  const mezcla =
    porcentajePuro === 100
      ? `100% energía de ${signo}`
      : `${porcentajePuro}% energía de ${signo} + ${porcentajeMezcla}% matizada de ${tonoExtra}`;

  const cualidad = datos.desc.toLowerCase().replace(/\.$/, "");
  const interpretacion =
    `Este planeta opera al ${intensidad}% de su capacidad natural (${datos.dignidad}). ` +
    `En el grado ${g}, la persona muestra una cualidad ${cualidad} con una energía ` +
    (porcentajePuro === 100
      ? `puramente de ${signo}.`
      : `que combina la base de ${signo} con un tinte de ${tonoExtra}.`);

  return {
    astro,
    signo,
    grado: g,
    descripcion: datos.desc,
    dignidad: datos.dignidad,
    intensidad,
    decanato,
    decanatoLabel,
    tonoExtra,
    porcentajePuro,
    porcentajeMezcla,
    mezcla,
    interpretacion,
  };
}
