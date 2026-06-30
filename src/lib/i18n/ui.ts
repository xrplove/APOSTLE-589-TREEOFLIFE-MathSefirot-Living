/**
 * Cadenas de la INTERFAZ (chrome de la app), traducidas a inglés / hebreo /
 * español. Las cadenas con partes variables se construyen en `format.ts`.
 */

import type { Locale } from "./locales";

type Tri = Record<Locale, string>;

export const UI: Record<string, Tri> = {
  // Cabeceras de panel
  gematriaByColumn: { en: "Gematria by column", he: "גימטריה לפי עמודה", es: "Gematría por columna" },
  fourWorlds: { en: "The 4 Worlds", he: "ארבעת העולמות", es: "Los 4 Mundos" },
  worldsSubtitle: {
    en: "The dimension of reality where you operate most naturally.",
    he: "מימד המציאות שבו אתה פועל בטבעיות רבה ביותר.",
    es: "Dimensión de la realidad donde operas con más naturalidad.",
  },
  aspects: { en: "Aspects", he: "היבטים", es: "Aspectos" },
  operatingFrequency: { en: "Operating Frequency", he: "תדר הפעולה", es: "Frecuencia de Operación" },
  weaponAndWound: { en: "The Weapon and the Wound", he: "הנשק והפצע", es: "El Arma y la Herida" },
  globesByHierarchy: { en: "Globes by hierarchy", he: "ספירות לפי היררכיה", es: "Globos por jerarquía" },
  transitsToday: { en: "Transits today", he: "מעברים היום", es: "Tránsitos hoy" },

  // Formulario
  birthData: { en: "Birth data", he: "נתוני לידה", es: "Datos de nacimiento" },
  fullName: { en: "Full name", he: "שם מלא", es: "Nombre completo" },
  namePlaceholder: {
    en: "First and last name (or in Hebrew)",
    he: "שם פרטי ומשפחה (או בעברית)",
    es: "Nombre y apellidos (o en hebreo)",
  },
  dateLabel: { en: "Date", he: "תאריך", es: "Fecha" },
  localTime: { en: "Local time", he: "שעה מקומית", es: "Hora local" },
  place: { en: "Place", he: "מקום", es: "Lugar" },
  cityPlaceholder: { en: "City…", he: "עיר…", es: "Ciudad…" },
  search: { en: "Search", he: "חיפוש", es: "Buscar" },
  generateSefirot: { en: "Generate Sefirot", he: "צור ספירות", es: "Generar Sefirot" },
  calculating: { en: "Calculating…", he: "מחשב…", es: "Calculando…" },

  // Botones / controles del lienzo
  currentSituation: { en: "Current situation", he: "מצב נוכחי", es: "Situación actual" },
  currentSituationTitle: {
    en: "Overlay today's planetary transits",
    he: "הצג את מעברי כוכבי הלכת של היום",
    es: "Superponer los tránsitos planetarios de hoy",
  },
  showAllLit: { en: "Show all lit", he: "הצג הכל מואר", es: "Ver todo iluminado" },
  pressGearPrompt: {
    en: "Press ⚙ to enter your data.",
    he: "לחץ ⚙ כדי להזין את הנתונים שלך.",
    es: "Pulsa ⚙ para introducir tus datos.",
  },
  orbWord: { en: "orb", he: "אורב", es: "orbe" },
  orbStrict: { en: "orb 3° strict", he: "אורב 3° מדויק", es: "orbe 3° estricto" },
  orbClassic: { en: "orb 6° classic", he: "אורב 6° קלאסי", es: "orbe 6° clásico" },
  orbWide: { en: "orb 8° wide", he: "אורב 8° רחב", es: "orbe 8° amplio" },

  // Etiquetas cortas
  master: { en: "master", he: "מאסטר", es: "maestro" },
  asc: { en: "Asc", he: "אופק", es: "Asc" },
  language: { en: "Language", he: "שפה", es: "Idioma" },
  sum: { en: "sum", he: "סכום", es: "suma" },

  // Intro de la lista de globos (las partes coloreadas van entre medias)
  hierIntroPrefix: { en: "From 100% to 10%: your ", he: "מ-100% ל-10%: ", es: "Del 100% al 10%: tus " },
  hierMasterTools: { en: "master tools", he: "כלי המאסטר", es: "herramientas maestras" },
  hierMid: { en: " flow effortlessly; the ", he: " שלך זורמים ללא מאמץ; ", es: " fluyen sin esfuerzo; los " },
  hierWorkPoints: { en: "work points", he: "נקודות העבודה", es: "puntos de trabajo" },
  hierSuffix: { en: " call for awareness.", he: " דורשות מודעות.", es: " piden conciencia." },

  // Ayuda del panel de tránsitos
  transitsHelp: {
    en: "Cyan ring = intensity of the transiting planet. Δ = difference from your natal chart.",
    he: "טבעת תכלת = עוצמת כוכב הלכת במעבר. Δ = ההפרש ממפת הלידה שלך.",
    es: "Anillo cian = intensidad del planeta en tránsito. Δ = diferencia respecto a tu carta natal.",
  },

  // Filas de detalle del globo
  hierarchy: { en: "Hierarchy", he: "היררכיה", es: "Jerarquía" },
  role: { en: "Role", he: "תפקיד", es: "Rol" },
  character: { en: "Character", he: "אופי", es: "Carácter" },
  decanate: { en: "Decanate", he: "דקאנט", es: "Decanato" },
  blend: { en: "Blend", he: "תמהיל", es: "Mezcla" },

  // Niveles de dignidad (tier)
  tierMaster: { en: "Master tool", he: "כלי מאסטר", es: "Herramienta maestra" },
  tierMasterHint: { en: "Flows effortlessly", he: "זורם ללא מאמץ", es: "Fluye sin esfuerzo" },
  tierLearning: { en: "In learning", he: "בלמידה", es: "En aprendizaje" },
  tierLearningHint: { en: "Neutral, peregrine energy", he: "אנרגיה נייטרלית, נודדת", es: "Energía neutra, peregrina" },
  tierWork: { en: "Work point", he: "נקודת עבודה", es: "Punto de trabajo" },
  tierWorkHint: { en: "Requires greater awareness", he: "דורש מודעות רבה יותר", es: "Requiere mayor conciencia" },

  // Diagnóstico Arma/Herida
  weapon: { en: "Weapon", he: "נשק", es: "Arma" },
  wound: { en: "Wound", he: "פצע", es: "Herida" },

  // Errores
  selectPlace: { en: "Select a place of birth.", he: "בחר מקום לידה.", es: "Selecciona un lugar de nacimiento." },
  calcError: { en: "Could not calculate.", he: "החישוב נכשל.", es: "Error al calcular." },

  // Metadatos / título
  appTitle: {
    en: "MathSefirot · Natal Chart Console",
    he: "MathSefirot · קונסולת מפה אסטרולוגית",
    es: "MathSefirot · Consola de Carta Astral",
  },
  appDescription: {
    en: "Projection of the natal chart onto the Tree of Life",
    he: "היטל המפה האסטרולוגית על עץ החיים",
    es: "Proyección de la carta astral sobre el Árbol de la Vida",
  },
};
