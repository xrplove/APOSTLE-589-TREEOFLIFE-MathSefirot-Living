/**
 * Idiomas soportados por la herramienta. El inglés es el idioma por defecto;
 * el usuario puede cambiar a hebreo (RTL) o español. Todo el contenido —interfaz
 * y datos esotéricos— está traducido a estos tres idiomas.
 */

export type Locale = "en" | "he" | "es";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Locale[] = ["en", "he", "es"];

/** Idiomas que se escriben de derecha a izquierda. */
export const RTL_LOCALES: Locale[] = ["he"];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/** Etiqueta nativa de cada idioma para el selector. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  es: "Español",
};

/** Código BCP-47 para `Intl` (fechas, etc.). */
export const LOCALE_BCP47: Record<Locale, string> = {
  en: "en-US",
  he: "he-IL",
  es: "es-ES",
};
