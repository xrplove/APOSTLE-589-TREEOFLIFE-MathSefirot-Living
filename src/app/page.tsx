"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TreeOfLife from "@/components/TreeOfLife";
import type { ChartResult, SefiraResult } from "@/lib/chart";
import type { GeoResult } from "@/lib/astrology/geocode";
import type { Sign } from "@/lib/astrology/dignities";
import { computeAspects } from "@/lib/astrology/aspects";
import { computeTransits } from "@/lib/chart";
import {
  computeGematria,
  type GematriaResult,
  type PillarGematria,
} from "@/lib/gematria/gematria";
import { PILLAR_COLOR, WORLDS } from "@/lib/sefirot/tree";
import { useLocale, useT } from "@/lib/i18n/context";
import { LOCALES, LOCALE_BCP47, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";
import type { Translator } from "@/lib/i18n";

export default function Home() {
  const { locale } = useLocale();
  const t = useT();

  const [name, setName] = useState("");
  const [date, setDate] = useState("1990-05-15");
  const [time, setTime] = useState("10:30");
  const [placeQuery, setPlaceQuery] = useState("");
  const [places, setPlaces] = useState<GeoResult[]>([]);
  const [place, setPlace] = useState<GeoResult | null>(null);

  const [orb, setOrb] = useState(6);
  const [showAspects, setShowAspects] = useState(true);
  const [showTransits, setShowTransits] = useState(false);
  const [transitAt, setTransitAt] = useState<number>(() => Date.now());

  const [result, setResult] = useState<ChartResult | null>(null);
  const [gematria, setGematria] = useState<GematriaResult | null>(null);
  const [selected, setSelected] = useState<SefiraResult | null>(null);
  const [formOpen, setFormOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // Aspectos recalculados en vivo al cambiar el orbe (sin regenerar la carta).
  const aspects = useMemo(() => {
    if (!result) return [];
    return computeAspects(
      result.sefirot.map((s) => ({ planet: s.sefira.planeta, lon: s.lon })),
      orb,
    );
  }, [result, orb]);

  // Globos ordenados por intensidad (mayor → menor).
  const sortedGlobes = useMemo(
    () => (result ? [...result.sefirot].sort((a, b) => b.profile.intensidad - a.profile.intensidad) : []),
    [result],
  );

  // Tránsitos actuales (cliente, instantáneo) y su diferencia con la carta natal.
  const transitView = useMemo(() => {
    if (!result || !showTransits) return null;
    const list = computeTransits(new Date(transitAt));
    const byId = Object.fromEntries(list.map((t) => [t.sefiraId, t]));
    const map: Record<string, { intensidad: number; signo: string; grado: number }> = {};
    for (const t of list) map[t.sefiraId] = { intensidad: t.intensidad, signo: t.signo, grado: t.grado };
    const deltas = result.sefirot
      .map((s) => {
        const tr = byId[s.sefira.id];
        return {
          sefira: s.sefira,
          natal: s.profile.intensidad,
          transit: tr.intensidad,
          delta: tr.intensidad - s.profile.intensidad,
          signo: tr.signo,
          grado: tr.grado,
        };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    return { map, deltas };
  }, [result, showTransits, transitAt]);

  // Diagnóstico Arma / Herida: mayor vs menor intensidad.
  const armaHerida = useMemo(() => {
    if (sortedGlobes.length < 2) return null;
    return { arma: sortedGlobes[0], herida: sortedGlobes[sortedGlobes.length - 1] };
  }, [sortedGlobes]);

  // Los 4 Mundos: intensidad media por mundo.
  const worlds = useMemo(() => {
    if (!result) return [];
    const byId = Object.fromEntries(result.sefirot.map((s) => [s.sefira.id, s.profile.intensidad]));
    const rows = WORLDS.map((w) => {
      const vals = w.sefiraIds.map((id) => byId[id] ?? 0);
      const media = Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
      return { ...w, media };
    });
    const max = Math.max(...rows.map((r) => r.media));
    return rows.map((r) => ({ ...r, dominante: r.media === max }));
  }, [result]);

  // Al seleccionar un globo, centrar su fila en la lista derecha.
  useEffect(() => {
    if (!selected) return;
    rowRefs.current[selected.sefira.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selected]);

  async function searchPlace() {
    if (placeQuery.trim().length < 2) return;
    const res = await fetch(
      `/api/geocode?q=${encodeURIComponent(placeQuery)}&lang=${locale}`,
    );
    const data = await res.json();
    setPlaces(data.results ?? []);
  }

  async function generate() {
    if (!place) {
      setError(t.ui("selectPlace"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          latitude: place.latitude,
          longitude: place.longitude,
          timezone: place.timezone,
          placeName: `${place.name}, ${place.country}`,
          orb,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(t.ui("calcError"));
      setResult(data);
      setGematria(name.trim() ? computeGematria(name, date) : null);
      setSelected(null);
      setFormOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.ui("calcError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#0b0a12] text-zinc-200">
      {/* ====== Columna izquierda: GEMATRÍA + ASPECTOS (fija) ====== */}
      {result && (
        <aside className="flex h-screen w-[340px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/30">
          {gematria && (
            <div className="border-b border-zinc-800 p-4">
              <h2 className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t.ui("gematriaByColumn")}
              </h2>
              <p className="mb-2 text-[10px] text-zinc-500">{t.gematriaSubtitle()}</p>
              <div className="space-y-2">
                <PillarCard p={gematria.pillars.alma} t={t} />
                <PillarCard p={gematria.pillars.cuerpo} t={t} />
                <PillarCard p={gematria.pillars.psique} t={t} />
              </div>
            </div>
          )}

          {/* Los 4 Mundos cabalísticos */}
          <div className="border-b border-zinc-800 p-4">
            <h2 className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.ui("fourWorlds")}
            </h2>
            <p className="mb-2 text-[10px] text-zinc-500">{t.ui("worldsSubtitle")}</p>
            <div className="space-y-1.5">
              {worlds.map((w) => (
                <div key={w.id}>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span style={{ color: w.color }}>
                      {t.worldTranslation(w.id)}
                      {w.dominante && <span className="mx-1 text-[9px]">★</span>}
                      <span className="mx-1 text-zinc-500">· {t.worldDimension(w.id)}</span>
                    </span>
                    <span className="text-zinc-400">{w.media}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w.media}%`, background: w.color, opacity: w.dominante ? 1 : 0.55 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showAspects && aspects.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {t.ui("aspects")}
                </h2>
                <span className="text-[10px] text-zinc-500">
                  {t.ui("orbWord")} {orb}°
                </span>
              </div>
              <div className="mb-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-400">
                <Legend color="#5be07a" label={t.harmony("fluido")} />
                <Legend color="#e0625b" label={t.harmony("tension")} />
                <Legend color="#f5d76e" label={t.harmony("conjuncion")} />
              </div>
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 text-[13px]">
                {aspects.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="truncate">
                      <span style={{ color: a.color }} className="mx-1">{a.glyph}</span>
                      {t.planet(a.aPlanet)} {t.aspect(a.type)} {t.planet(a.bPlanet)}
                    </span>
                    <span className="mx-2 shrink-0 text-[11px] text-zinc-500">{a.orb}°</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      )}

      {/* ====== Centro: el árbol ====== */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden p-3">
        {/* botón abrir formulario */}
        {result && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="absolute start-3 top-3 z-20 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-300 backdrop-blur hover:bg-zinc-800"
          >
            ⚙ {t.ui("birthData")}
          </button>
        )}

        {/* deseleccionar */}
        {result && selected && (
          <button
            onClick={() => setSelected(null)}
            className="absolute start-3 top-14 z-20 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-300 backdrop-blur hover:bg-zinc-800"
          >
            ✕ {t.ui("showAllLit")}
          </button>
        )}

        {/* controles */}
        {result && (
          <div className="absolute end-3 top-3 z-20 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs backdrop-blur">
            <button
              onClick={() => {
                setShowTransits((v) => !v);
                setTransitAt(Date.now());
              }}
              className={`rounded-md px-2 py-1 font-medium ${
                showTransits
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
              title={t.ui("currentSituationTitle")}
            >
              ◎ {t.ui("currentSituation")}
            </button>
            <label className="flex items-center gap-1.5 text-zinc-400">
              <input
                type="checkbox"
                checked={showAspects}
                onChange={(e) => setShowAspects(e.target.checked)}
              />
              {t.ui("aspects")}
            </label>
            <select
              value={orb}
              onChange={(e) => setOrb(Number(e.target.value))}
              disabled={!showAspects}
              className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-100 disabled:opacity-40"
            >
              <option value={3}>{t.ui("orbStrict")}</option>
              <option value={6}>{t.ui("orbClassic")}</option>
              <option value={8}>{t.ui("orbWide")}</option>
            </select>
          </div>
        )}

        {result ? (
          <div className="flex h-full w-full max-w-[640px] items-center justify-center">
            <TreeOfLife
              results={result.sefirot}
              selectedId={selected?.sefira.id ?? null}
              aspects={aspects}
              showAspects={showAspects}
              pillars={result.pillars}
              t={t}
              pillarNumbers={
                gematria
                  ? {
                      Alma: gematria.pillars.alma.root,
                      Cuerpo: gematria.pillars.cuerpo.root,
                      Psique: gematria.pillars.psique.root,
                    }
                  : {}
              }
              transits={transitView?.map ?? {}}
              showTransits={showTransits}
              onSelect={setSelected}
            />
          </div>
        ) : (
          !formOpen && <p className="text-zinc-600">{t.ui("pressGearPrompt")}</p>
        )}

        {/* formulario como panel flotante */}
        {formOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
            <div className="w-[340px] rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                  {t.ui("birthData")}
                </h2>
                {result && (
                  <button
                    onClick={() => setFormOpen(false)}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <label className="block text-xs text-zinc-400">
                  {t.ui("language")}
                  <LanguageSelect className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
                </label>
                <label className="block text-xs text-zinc-400">
                  {t.ui("fullName")}
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.ui("namePlaceholder")}
                    className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  {t.ui("dateLabel")}
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  {t.ui("localTime")}
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  {t.ui("place")}
                  <div className="mt-1 flex gap-2">
                    <input
                      value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchPlace()}
                      placeholder={t.ui("cityPlaceholder")}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                    />
                    <button
                      onClick={searchPlace}
                      className="rounded-md bg-zinc-700 px-3 text-sm hover:bg-zinc-600"
                    >
                      {t.ui("search")}
                    </button>
                  </div>
                </label>

                {places.length > 0 && (
                  <ul className="max-h-40 space-y-1 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-1">
                    {places.map((p, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setPlace(p);
                            setPlaces([]);
                            setPlaceQuery(`${p.name}, ${p.country}`);
                          }}
                          className="w-full rounded px-2 py-1 text-start text-sm hover:bg-zinc-800"
                        >
                          {p.name}
                          {p.admin1 ? `, ${p.admin1}` : ""}, {p.country}
                          <span className="mx-1 text-xs text-zinc-500">({p.timezone})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {place && (
                  <p className="text-xs text-emerald-400">
                    ✓ {place.name}, {place.country} · {place.latitude.toFixed(2)},{" "}
                    {place.longitude.toFixed(2)}
                  </p>
                )}

                <button
                  onClick={generate}
                  disabled={loading}
                  className="w-full rounded-md bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
                >
                  {loading ? t.ui("calculating") : t.ui("generateSefirot")}
                </button>
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            </div>
          </div>
        )}

        {/* selector de idioma siempre accesible */}
        {!formOpen && (
          <LanguageSelect className="absolute bottom-3 end-3 z-20 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-300 backdrop-blur" />
        )}

        {/* panel flotante de tránsitos */}
        {result && showTransits && transitView && (
          <div className="absolute bottom-3 start-3 z-20 w-[300px] rounded-lg border border-cyan-800/50 bg-zinc-900/90 p-3 text-xs backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-cyan-300">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" /> {t.ui("transitsToday")}
              </h3>
              <span className="text-[10px] text-zinc-500">
                {new Date(transitAt).toLocaleDateString(LOCALE_BCP47[locale])}
              </span>
            </div>
            <p className="mb-2 text-[10px] leading-snug text-zinc-500">{t.ui("transitsHelp")}</p>
            <ul className="max-h-48 space-y-1 overflow-y-auto pr-1">
              {transitView.deltas.map((d) => (
                <li key={d.sefira.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    <span className="text-cyan-300">{d.sefira.glifo}</span> {t.sefiraName(d.sefira.id)}{" "}
                    <span className="text-zinc-500">{t.sign(d.signo as Sign)} {d.grado.toFixed(0)}°</span>
                  </span>
                  <span className="shrink-0">
                    <span className="text-zinc-400">{d.transit}%</span>{" "}
                    <span
                      className={
                        d.delta > 0 ? "text-emerald-400" : d.delta < 0 ? "text-rose-400" : "text-zinc-500"
                      }
                    >
                      ({d.delta > 0 ? "+" : ""}
                      {d.delta})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ====== Columna derecha: globos ordenados por % ====== */}
      {result && (
        <aside className="flex h-screen w-[360px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-900/30">
          {/* Síntesis del Árbol: Frecuencia de Operación */}
          <div className="border-b border-zinc-800 p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.ui("operatingFrequency")}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border border-purple-400/50 bg-purple-500/10">
                <span className="text-3xl font-bold leading-none text-purple-300">
                  {result.synthesis.frecuencia}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-purple-200">
                  {t.rootTitle(result.synthesis.frecuencia)}
                </p>
                <p className="text-[11px] leading-snug text-zinc-400">
                  {t.rootMeaning(result.synthesis.frecuencia)}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {result.pillars.map((p) => (
                <div key={p.pillar} className="rounded-md bg-zinc-950/50 p-1.5">
                  <p className="text-[9px] uppercase tracking-wide" style={{ color: p.color }}>
                    {t.pillarFunction(p.pillar)}
                  </p>
                  <p className="text-base font-bold" style={{ color: p.color }}>{p.total}</p>
                  <p className="text-[9px] text-zinc-500">{t.pillar(p.pillar)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnóstico: El Arma y la Herida */}
          {armaHerida && (
            <div className="border-b border-zinc-800 p-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t.ui("weaponAndWound")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-emerald-700/40 bg-emerald-500/5 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-400">
                    ⚔ {t.ui("weapon")} · {armaHerida.arma.profile.intensidad}%
                  </p>
                  <p className="text-[13px] font-semibold text-zinc-100">
                    {t.sefiraName(armaHerida.arma.sefira.id)}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {t.planet(armaHerida.arma.sefira.planeta)} · {t.sign(armaHerida.arma.profile.signo)}
                  </p>
                </div>
                <div className="rounded-md border border-rose-700/40 bg-rose-500/5 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-rose-400">
                    ✶ {t.ui("wound")} · {armaHerida.herida.profile.intensidad}%
                  </p>
                  <p className="text-[13px] font-semibold text-zinc-100">
                    {t.sefiraName(armaHerida.herida.sefira.id)}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {t.planet(armaHerida.herida.sefira.planeta)} · {t.sign(armaHerida.herida.profile.signo)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
                {t.weaponWound(
                  {
                    id: armaHerida.arma.sefira.id,
                    planet: armaHerida.arma.sefira.planeta,
                    sign: armaHerida.arma.profile.signo,
                  },
                  {
                    id: armaHerida.herida.sefira.id,
                    planet: armaHerida.herida.sefira.planeta,
                    sign: armaHerida.herida.profile.signo,
                  },
                )}
              </p>
            </div>
          )}

          <div className="border-b border-zinc-800 px-4 py-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t.ui("globesByHierarchy")}
              </h2>
              <span className="text-[10px] text-zinc-500">
                {t.ui("asc")} {t.sign(result.ascendant.sign)} {result.ascendant.degInSign.toFixed(0)}°
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-zinc-500">
              {t.ui("hierIntroPrefix")}
              <span className="text-emerald-400">{t.ui("hierMasterTools")}</span>
              {t.ui("hierMid")}
              <span className="text-rose-400">{t.ui("hierWorkPoints")}</span>
              {t.ui("hierSuffix")}
            </p>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto p-3">
            {sortedGlobes.map((g) => (
              <GloboRow
                key={g.sefira.id}
                g={g}
                t={t}
                active={selected?.sefira.id === g.sefira.id}
                onClick={() => setSelected(active(selected, g) ? null : g)}
                rowRef={(el) => (rowRefs.current[g.sefira.id] = el)}
              />
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}

function active(selected: SefiraResult | null, g: SefiraResult) {
  return selected?.sefira.id === g.sefira.id;
}

/** Selector de idioma (English por defecto · עברית · Español). */
function LanguageSelect({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Language"
      className={className}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}

function GloboRow({
  g,
  t,
  active,
  onClick,
  rowRef,
}: {
  g: SefiraResult;
  t: Translator;
  active: boolean;
  onClick: () => void;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const color = PILLAR_COLOR[g.sefira.pilar];
  const tier = t.dignityTier(g.profile.intensidad);
  return (
    <li
      ref={rowRef}
      onClick={onClick}
      className={`mb-1.5 cursor-pointer rounded-lg border p-2.5 transition-colors ${
        active ? "bg-zinc-800/70" : "border-transparent hover:bg-zinc-800/40"
      }`}
      style={active ? { borderColor: `${color}80` } : undefined}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-2xl" style={{ color }}>{g.sefira.glifo}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-zinc-100">{t.sefiraName(g.sefira.id)}</span>
            <span className="text-sm font-bold" style={{ color }}>{g.profile.intensidad}%</span>
          </div>
          <p className="truncate text-[11px] text-zinc-400">
            {t.planet(g.sefira.planeta)} · {t.sign(g.profile.signo)} {g.profile.grado}° · {t.dignity(g.profile.dignidad)}
          </p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full" style={{ width: `${g.profile.intensidad}%`, background: color }} />
          </div>
          <span
            className="mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{ background: `${tier.color}22`, color: tier.color }}
          >
            {tier.label}
          </span>
        </div>
      </div>

      {active && (
        <div className="mt-2.5 space-y-1.5 border-t border-zinc-700/60 pt-2.5 text-xs">
          <Row k={t.ui("hierarchy")} v={`${tier.label} — ${tier.hint}`} />
          <Row k={t.ui("role")} v={t.sefiraRole(g.sefira.id)} />
          <Row k={t.ui("character")} v={t.desc(g.sefira.planeta, g.profile.signo)} />
          <Row k={t.ui("decanate")} v={t.decanateLabel(g.profile.decanato)} />
          <Row
            k={t.ui("blend")}
            v={t.blend(g.profile.signo, g.profile.tonoExtra, g.profile.porcentajePuro, g.profile.porcentajeMezcla)}
          />
          <p className="rounded-md bg-zinc-950/60 p-2 text-[11px] leading-relaxed text-zinc-500">
            {t.percentExplain(g.sefira.planeta, g.profile.dignidad, g.profile.intensidad)}
          </p>
        </div>
      )}
    </li>
  );
}

function PillarCard({ p, t }: { p: PillarGematria; t: Translator }) {
  const color = PILLAR_COLOR[p.pillar];
  return (
    <div className="rounded-lg border bg-zinc-950/40 p-2.5" style={{ borderColor: `${color}40` }}>
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full border"
          style={{ borderColor: `${color}66`, background: `${color}1a` }}
        >
          <span className="text-xl font-bold leading-none" style={{ color }}>{p.root}</span>
          {t.isMaster(p.root) && (
            <span className="text-[8px] uppercase" style={{ color }}>{t.ui("master")}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider" style={{ color }}>
            {t.pillar(p.pillar)} · {t.gematriaSource(p.fuente)}
          </p>
          <p className="truncate text-[13px] font-semibold text-zinc-100">{t.rootTitle(p.root)}</p>
          {/* palabras clave destacadas */}
          <div className="mt-0.5 flex flex-wrap gap-1">
            {t.rootWords(p.root).split(" · ").map((w) => (
              <span
                key={w}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                style={{ background: `${color}22`, color }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* descripción: el valor de ese número */}
      <p className="mt-1.5 text-[11px] leading-snug text-zinc-400">{t.rootMeaning(p.root)}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-zinc-500">{k}</dt>
      <dd className="text-zinc-200">{v}</dd>
    </div>
  );
}
