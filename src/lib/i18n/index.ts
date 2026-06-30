/**
 * Punto de entrada del sistema de i18n. Expone `makeT(locale)`, que devuelve un
 * traductor `t` con todas las cadenas de interfaz y de datos resueltas al idioma
 * activo, además de los constructores de frases compuestas.
 */

import type { Dignity, Planet, Sign } from "../astrology/dignities";
import type { Pillar } from "../sefirot/tree";
import { DESC_TEXT } from "./descriptions";
import { type Locale } from "./locales";
import {
  ASPECT_NAMES,
  DIGNITY_NAMES,
  GEMATRIA_GLOSS,
  GEMATRIA_SOURCE,
  HARMONY_NAMES,
  PILLAR_FUNCTION,
  PILLAR_NAMES,
  PLANET_NAMES,
  ROOT_TEXT,
  SEFIRA_TEXT,
  SIGN_NAMES,
  WORLD_TEXT,
} from "./terms";
import { UI } from "./ui";

export * from "./locales";

type Tri = Record<Locale, string>;
const pick = (tri: Tri | undefined, locale: Locale, fallback = ""): string =>
  tri ? tri[locale] ?? tri.en ?? fallback : fallback;

/** Reduce un número raíz a una clave existente en ROOT_TEXT (1-9, 11/22/33). */
function rootKey(n: number): number {
  if (ROOT_TEXT[n]) return n;
  let x = Math.abs(n);
  while (x > 9) x = String(x).split("").reduce((a, d) => a + Number(d), 0);
  return x;
}

export interface DignityTier {
  label: string;
  hint: string;
  color: string;
}

export interface Translator {
  locale: Locale;
  /** Cadena de interfaz por clave. */
  ui: (key: string) => string;
  planet: (p: Planet) => string;
  sign: (s: Sign) => string;
  dignity: (d: Dignity) => string;
  sefiraName: (id: string) => string;
  sefiraRole: (id: string) => string;
  pillar: (p: Pillar) => string;
  pillarFunction: (p: Pillar) => string;
  worldTranslation: (id: string) => string;
  worldDimension: (id: string) => string;
  aspect: (name: string) => string;
  harmony: (key: string) => string;
  rootTitle: (n: number) => string;
  rootWords: (n: number) => string;
  rootMeaning: (n: number) => string;
  isMaster: (n: number) => boolean;
  desc: (planet: Planet, sign: Sign) => string;
  gematriaSource: (fuente: string) => string;
  gematriaGloss: (p: Pillar) => string;
  // Frases compuestas
  decanateLabel: (decanato: 1 | 2 | 3) => string;
  blend: (sign: Sign, tono: Sign | null, pure: number, mix: number) => string;
  dignityTier: (intensidad: number) => DignityTier;
  percentExplain: (planet: Planet, dignity: Dignity, intensidad: number) => string;
  gematriaSubtitle: () => string;
  weaponWound: (a: WeaponInput, h: WeaponInput) => string;
}

export interface WeaponInput {
  id: string;
  planet: Planet;
  sign: Sign;
}

export function makeT(locale: Locale): Translator {
  const ui = (key: string) => pick(UI[key], locale, key);

  const planet = (p: Planet) => pick(PLANET_NAMES[p], locale, p);
  const sign = (s: Sign) => pick(SIGN_NAMES[s], locale, s);
  const dignity = (d: Dignity) => pick(DIGNITY_NAMES[d], locale, d);
  const sefiraName = (id: string) => pick(SEFIRA_TEXT[id]?.name, locale, id);
  const sefiraRole = (id: string) => pick(SEFIRA_TEXT[id]?.role, locale);
  const pillar = (p: Pillar) => pick(PILLAR_NAMES[p], locale, p);
  const pillarFunction = (p: Pillar) => pick(PILLAR_FUNCTION[p], locale);
  const aspect = (name: string) => pick(ASPECT_NAMES[name], locale, name);
  const harmony = (key: string) => pick(HARMONY_NAMES[key], locale, key);
  const desc = (p: Planet, s: Sign) => pick(DESC_TEXT[p]?.[s], locale);
  const rootTitle = (n: number) => pick(ROOT_TEXT[rootKey(n)]?.title, locale);
  const rootWords = (n: number) => pick(ROOT_TEXT[rootKey(n)]?.words, locale);
  const rootMeaning = (n: number) => pick(ROOT_TEXT[rootKey(n)]?.meaning, locale);
  const isMaster = (n: number) => n === 11 || n === 22 || n === 33;
  const gematriaSource = (f: string) => pick(GEMATRIA_SOURCE[f], locale, f);

  const decanateLabel = (d: 1 | 2 | 3) => {
    const ranges = { 1: "0°-9°", 2: "10°-19°", 3: "20°-29°" } as const;
    const ord =
      locale === "es"
        ? { 1: "1.er", 2: "2.º", 3: "3.er" }[d]
        : locale === "he"
          ? { 1: "ראשון", 2: "שני", 3: "שלישי" }[d]
          : { 1: "1st", 2: "2nd", 3: "3rd" }[d];
    const word = locale === "es" ? "Decanato" : locale === "he" ? "דקאנט" : "Decanate";
    return locale === "he"
      ? `${word} ${ord} (${ranges[d]})`
      : `${ord} ${word} (${ranges[d]})`;
  };

  const blend = (s: Sign, tono: Sign | null, pure: number, mix: number) => {
    const sn = sign(s);
    if (pure === 100) {
      return locale === "es"
        ? `100% energía de ${sn}`
        : locale === "he"
          ? `100% אנרגיית ${sn}`
          : `100% ${sn} energy`;
    }
    const tn = tono ? sign(tono) : "";
    return locale === "es"
      ? `${pure}% energía de ${sn} + ${mix}% matizada de ${tn}`
      : locale === "he"
        ? `${pure}% אנרגיית ${sn} + ${mix}% בגוון ${tn}`
        : `${pure}% ${sn} energy + ${mix}% tinted by ${tn}`;
  };

  const dignityTier = (intensidad: number): DignityTier => {
    if (intensidad >= 90)
      return { label: ui("tierMaster"), hint: ui("tierMasterHint"), color: "#5be07a" };
    if (intensidad >= 40)
      return { label: ui("tierLearning"), hint: ui("tierLearningHint"), color: "#cdb86a" };
    return { label: ui("tierWork"), hint: ui("tierWorkHint"), color: "#e0857a" };
  };

  const percentExplain = (p: Planet, d: Dignity, intensidad: number) => {
    const scale = `${dignity("Domicilio")} 100 · ${dignity("Exaltación")} 90 · ${dignity(
      "Peregrino",
    )} 50 · ${dignity("Exilio")} 30 · ${dignity("Caída")} 10`;
    const pn = planet(p);
    const dn = dignity(d);
    if (locale === "es")
      return `¿De dónde sale el ${intensidad}%? Intensidad de la dignidad: ${scale}. ${pn} está en ${dn} → ${intensidad}%.`;
    if (locale === "he")
      return `מאיפה מגיע ה-${intensidad}%? עוצמת הדיגניטי: ${scale}. ${pn} נמצא ב${dn} → ${intensidad}%.`;
    return `Where does the ${intensidad}% come from? Dignity intensity: ${scale}. ${pn} is in ${dn} → ${intensidad}%.`;
  };

  const gematriaSubtitle = () => {
    const name = gematriaSource("Nombre");
    const date = gematriaSource("Fecha");
    const sum = ui("sum");
    return `${name} → ${pillar("Alma")} · ${date} → ${pillar("Cuerpo")} · ${sum} → ${pillar(
      "Psique",
    )}`;
  };

  const firstRole = (id: string) => sefiraRole(id).split("·")[0].trim();
  const stripDot = (s: string) => s.replace(/\.$/, "");
  const lower = (s: string) => (locale === "he" ? s : s.toLowerCase());

  const weaponWound = (a: WeaponInput, h: WeaponInput) => {
    const aName = sefiraName(a.id);
    const hName = sefiraName(h.id);
    const aDesc = stripDot(lower(desc(a.planet, a.sign)));
    const hDesc = stripDot(lower(desc(h.planet, h.sign)));
    const aRole = firstRole(a.id);
    const hRole = firstRole(h.id);
    const aP = planet(a.planet);
    const hP = planet(h.planet);
    const aS = sign(a.sign);
    const hS = sign(h.sign);
    if (locale === "es")
      return (
        `Tu arma es ${aName} (${aP} en ${aS}): ${aDesc} — fluye en ti sin esfuerzo. ` +
        `Tu herida es ${hName} (${hP} en ${hS}): ${hDesc}. ` +
        `Apóyate en tu ${aRole} para iluminar tu ${hRole}: que la fortaleza de ` +
        `${aName} sostenga, con conciencia, el aprendizaje de ${hName}.`
      );
    if (locale === "he")
      return (
        `הנשק שלך הוא ${aName} (${aP} ב${aS}): ${aDesc} — הוא זורם בך ללא מאמץ. ` +
        `הפצע שלך הוא ${hName} (${hP} ב${hS}): ${hDesc}. ` +
        `הישען על ה${aRole} שלך כדי להאיר את ה${hRole} שלך: שעוצמתה של ` +
        `${aName} תתמוך במודעות בלמידה של ${hName}.`
      );
    return (
      `Your weapon is ${aName} (${aP} in ${aS}): ${aDesc} — it flows in you effortlessly. ` +
      `Your wound is ${hName} (${hP} in ${hS}): ${hDesc}. ` +
      `Lean on your ${aRole} to illuminate your ${hRole}: let the strength of ` +
      `${aName} consciously sustain the learning of ${hName}.`
    );
  };

  return {
    locale,
    ui,
    planet,
    sign,
    dignity,
    sefiraName,
    sefiraRole,
    pillar,
    pillarFunction,
    worldTranslation: (id: string) => pick(WORLD_TEXT[id]?.translation, locale, id),
    worldDimension: (id: string) => pick(WORLD_TEXT[id]?.dimension, locale),
    aspect,
    harmony,
    rootTitle,
    rootWords,
    rootMeaning,
    isMaster,
    desc,
    gematriaSource,
    gematriaGloss: (p: Pillar) => pick(GEMATRIA_GLOSS[p], locale),
    decanateLabel,
    blend,
    dignityTier,
    percentExplain,
    gematriaSubtitle,
    weaponWound,
  };
}
