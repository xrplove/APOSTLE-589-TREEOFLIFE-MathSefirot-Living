"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { PATHS, PILLAR_COLOR, SEFIROT } from "@/lib/sefirot/tree";
import type { PillarSummary, SefiraResult } from "@/lib/chart";
import type { Aspect } from "@/lib/astrology/aspects";
import type { Translator } from "@/lib/i18n";

interface Props {
  results: SefiraResult[] | null;
  selectedId: string | null;
  /** Traductor del idioma activo (textos dibujados en el SVG). */
  t: Translator;
  /** Sefirot resonantes según la gematría (nombre / fecha): anillo dorado punteado. */
  highlightIds?: string[];
  aspects?: Aspect[];
  showAspects?: boolean;
  pillars?: PillarSummary[];
  /** Número simbólico de gematría por pilar (Alma/Cuerpo/Psique). */
  pillarNumbers?: Partial<Record<string, number>>;
  /** Tránsitos actuales por id de Sefirá (anillo exterior). */
  transits?: Record<string, { intensidad: number; signo: string; grado: number }>;
  showTransits?: boolean;
  onSelect: (r: SefiraResult) => void;
}

// x de cada pilar (coincide con la columna de Sefirot)
const PILLAR_X: Record<string, number> = { Cuerpo: 240, Psique: 500, Alma: 760 };

const W = 1000;
const H = 1300;

export default function TreeOfLife({
  results,
  selectedId,
  t,
  highlightIds = [],
  aspects = [],
  showAspects = true,
  pillars = [],
  pillarNumbers = {},
  transits = {},
  showTransits = false,
  onSelect,
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const byId = new Map((results ?? []).map((r) => [r.sefira.id, r]));
    const radius = d3.scaleLinear().domain([0, 100]).range([34, 62]);
    const glowOpacity = d3.scaleLinear().domain([0, 100]).range([0.08, 0.7]);
    const arc = d3
      .arc<number>()
      .innerRadius((d) => radius(d) + 6)
      .outerRadius((d) => radius(d) + 11)
      .startAngle(0);

    // ---- defs: filtro de brillo ----
    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "glow").attr("x", "-60%").attr("y", "-60%").attr("width", "220%").attr("height", "220%");
    glow.append("feGaussianBlur").attr("stdDeviation", "10").attr("result", "b");
    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "b");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // ---- cabeceras de pilar (porcentaje sobre cada columna) ----
    const ph = svg.append("g");
    for (const p of pillars) {
      const x = PILLAR_X[p.pillar];
      if (x == null) continue;
      const gem = pillarNumbers[p.pillar];

      ph.append("text")
        .attr("x", x)
        .attr("y", -86)
        .attr("text-anchor", "middle")
        .attr("fill", p.color)
        .attr("font-size", 18)
        .attr("font-weight", 600)
        .attr("letter-spacing", "0.12em")
        .text(t.pillar(p.pillar).toUpperCase());

      if (gem != null) {
        // número simbólico de gematría de la columna
        ph.append("text")
          .attr("x", x)
          .attr("y", -42)
          .attr("text-anchor", "middle")
          .attr("fill", p.color)
          .attr("font-size", 38)
          .attr("font-weight", 800)
          .text(gem);
      }

      // carga planetaria del pilar
      ph.append("text")
        .attr("x", x)
        .attr("y", gem != null ? -18 : -50)
        .attr("text-anchor", "middle")
        .attr("fill", p.color)
        .attr("font-size", gem != null ? 14 : 30)
        .attr("font-weight", gem != null ? 500 : 700)
        .attr("opacity", gem != null ? 0.75 : 1)
        .text(`${p.carga}%`);
    }

    // ---- senderos ----
    const pos = new Map(SEFIROT.map((s) => [s.id, s]));
    svg
      .append("g")
      .attr("stroke", "#3a3550")
      .attr("stroke-width", 2.5)
      .selectAll("line")
      .data(PATHS)
      .join("line")
      .attr("x1", (d) => pos.get(d[0])!.x)
      .attr("y1", (d) => pos.get(d[0])!.y)
      .attr("x2", (d) => pos.get(d[1])!.x)
      .attr("y2", (d) => pos.get(d[1])!.y)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.55);

    // ---- aspectos (líneas entre Sefirot) ----
    if (showAspects && aspects.length) {
      // si hay una Sefirá seleccionada, atenuamos los aspectos ajenos a ella
      svg
        .append("g")
        .selectAll("line.aspect")
        .data(aspects)
        .join("line")
        .attr("class", "aspect")
        .attr("x1", (a) => pos.get(a.aId)!.x)
        .attr("y1", (a) => pos.get(a.aId)!.y)
        .attr("x2", (a) => pos.get(a.bId)!.x)
        .attr("y2", (a) => pos.get(a.bId)!.y)
        .attr("stroke", (a) => a.color)
        .attr("stroke-width", (a) => 1.5 + a.strength * 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", (a) => (a.harmony === "tension" ? "2 7" : null))
        .attr("opacity", (a) => {
          const base = 0.35 + a.strength * 0.5;
          if (!selectedId) return base;
          return a.aId === selectedId || a.bId === selectedId ? base : 0.08;
        });
    }

    // ---- sefirot ----
    const nodes = svg
      .append("g")
      .selectAll("g.sefira")
      .data(SEFIROT)
      .join("g")
      .attr("class", "sefira")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", (d) => (byId.has(d.id) ? "pointer" : "default"))
      .on("click", (_e, d) => {
        const r = byId.get(d.id);
        if (r) onSelect(r);
      });

    nodes.each(function (d) {
      const g = d3.select(this);
      const r = byId.get(d.id);
      const intensity = r?.profile.intensidad ?? 0;
      const color = PILLAR_COLOR[d.pilar];
      const rad = radius(intensity);
      const active = d.id === selectedId;
      const resonant = highlightIds.includes(d.id);

      // anillo de resonancia gemátrica (nombre / fecha)
      if (resonant) {
        g.append("circle")
          .attr("r", rad + 16)
          .attr("fill", "none")
          .attr("stroke", "#f5d76e")
          .attr("stroke-width", 2.5)
          .attr("stroke-dasharray", "6 6")
          .attr("opacity", 0.9);
      }

      // halo
      g.append("circle")
        .attr("r", rad)
        .attr("fill", color)
        .attr("opacity", glowOpacity(intensity))
        .attr("filter", "url(#glow)");

      // disco principal
      g.append("circle")
        .attr("r", rad)
        .attr("fill", "#15121f")
        .attr("stroke", color)
        .attr("stroke-width", active ? 4 : 2)
        .attr("opacity", 0.96);

      // relleno de carga (intensidad)
      g.append("circle")
        .attr("r", rad)
        .attr("fill", color)
        .attr("opacity", 0.12 + (intensity / 100) * 0.4);

      // anillo de intensidad
      if (r) {
        g.append("path")
          .attr("d", arc.endAngle((intensity / 100) * 2 * Math.PI)(intensity))
          .attr("fill", color);
      }

      // anillo exterior de tránsito (situación actual)
      const tr = transits[d.id];
      if (showTransits && tr) {
        g.append("circle")
          .attr("r", rad + 18)
          .attr("fill", "none")
          .attr("stroke", "#6ad7ff")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.25);
        g.append("path")
          .attr(
            "d",
            d3.arc()({
              innerRadius: rad + 14,
              outerRadius: rad + 22,
              startAngle: 0,
              endAngle: (tr.intensidad / 100) * 2 * Math.PI,
            }) as string,
          )
          .attr("fill", "#6ad7ff")
          .attr("opacity", 0.95)
          .attr("filter", "url(#glow)");
      }

      // glifo planetario
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .attr("fill", "#fff")
        .attr("font-size", 32)
        .text(d.glifo);

      // nombre
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.25em")
        .attr("fill", "#ece8f6")
        .attr("font-size", 19)
        .attr("font-weight", 700)
        .text(t.sefiraName(d.id));

      // etiqueta inferior: signo + grado
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", rad + 30)
        .attr("fill", "#bdb6d0")
        .attr("font-size", 19)
        .text(r ? `${t.sign(r.profile.signo)} ${r.profile.grado}°` : "—");

      // etiqueta inferior: intensidad (destacada)
      if (r) {
        g.append("text")
          .attr("text-anchor", "middle")
          .attr("y", rad + 56)
          .attr("fill", color)
          .attr("font-size", 24)
          .attr("font-weight", 700)
          .text(`${intensity}%`);
      }
    });
  }, [results, selectedId, t, highlightIds, aspects, showAspects, pillars, pillarNumbers, transits, showTransits, onSelect]);

  return (
    <svg
      ref={ref}
      viewBox={`0 ${-H * 0.09} ${W} ${H * 1.09}`}
      className="w-full h-auto select-none"
      style={{ maxHeight: "88vh" }}
    />
  );
}
