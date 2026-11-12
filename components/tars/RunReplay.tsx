"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Tipos duplicados a propósito: este archivo es del cliente y lib/runData.ts es solo del servidor
export type ReplayData = {
  resolucion: number;
  origen: [number, number];
  tamano: { ancho: number; alto: number };
  duracion: number;
  mapa: string | null;
  pose: [number, number, number, number][];
  reportes: { t: number; x: number; y: number }[];
  estados: { t: number; de: string; a: string }[];
};

export type ReplayLabels = {
  title: string;
  hint: string;
  report: string;
  start: string;
  arena: string;
  caption: string;
  reports: string;
  summary: string;
};

// Tokens
const INK = "#141615";
const VICTIM = "#e1262d";
const TRACE = "#2a5bd7";
const UNKNOWN = "#cdcfcb";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function fmt(seconds: number) {
  const s = Math.round(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Pose interpolada en el tiempo t (segundos de la corrida) */
function poseAt(pose: ReplayData["pose"], t: number) {
  if (t <= pose[0][0]) return { x: pose[0][1], y: pose[0][2], yaw: pose[0][3], i: 0 };
  const last = pose[pose.length - 1];
  if (t >= last[0]) return { x: last[1], y: last[2], yaw: last[3], i: pose.length - 1 };
  let lo = 0;
  let hi = pose.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (pose[mid][0] <= t) lo = mid;
    else hi = mid;
  }
  const a = pose[lo];
  const b = pose[hi];
  const k = (t - a[0]) / (b[0] - a[0] || 1);
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), yaw: a[3], i: lo };
}

const ANGLES = [-38, 24, 62];

function ReportMark({
  index,
  report,
  t,
  px,
  py,
  label,
  anchor,
}: {
  index: number;
  report: ReplayData["reportes"][number];
  t: MotionValue<number>;
  px: (x: number) => number;
  py: (y: number) => number;
  label: string;
  anchor: "start" | "end";
}) {
  const cx = px(report.x);
  const cy = py(report.y);
  const local = useTransform(t, (v) => clamp((v - report.t) / 9));
  const eased = useTransform(local, easeOut);
  const rx = useTransform(eased, (e) => lerp(0.46, 0.1, e));
  const ry = useTransform(eased, (e) => lerp(0.32, 0.07, e));
  const stroke = useTransform(local, (l) => (l >= 1 ? VICTIM : INK));
  const fillOpacity = useTransform(local, (l) => (l >= 1 ? 0.14 : 0));
  const shown = useTransform(local, (l) => (l > 0 ? 1 : 0));
  const done = useTransform(local, (l) => (l >= 1 ? 1 : 0));
  const dir = anchor === "start" ? 1 : -1;
  return (
    <g>
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        transform={`rotate(${ANGLES[index]} ${cx} ${cy})`}
        fill={VICTIM}
        stroke={stroke}
        strokeWidth={1.4}
        strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: shown, fillOpacity }}
      />
      <motion.rect x={cx - 0.11} y={cy - 0.11} width={0.22} height={0.22} fill={VICTIM} style={{ opacity: shown }} />
      <motion.text
        x={cx + dir * 0.22}
        y={cy - 0.16}
        textAnchor={anchor}
        fontSize={0.13}
        fill={INK}
        style={{ opacity: done, fontFamily: "var(--font-martian), monospace" }}
      >
        {label}
      </motion.text>
    </g>
  );
}

/**
 * Replay de la corrida 2 de clasificación. Mapa de la arena (celdas de 0.02 m), la traza del robot
 * avanza con el scroll y aparecen los 3 reportes en t = 56.7, 119.2 y 146.7 s. En cada reporte una
 * elipse de covarianza se achica hasta σ ≤ 0.10 m y se marca en rojo. SVG + useScroll/useTransform.
 * Con reduced motion se dibuja el estado final.
 */
export default function RunReplay({ data, labels }: { data: ReplayData; labels: ReplayLabels }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const still = useMotionValue(1);
  const progress = reduced ? still : scrollYProgress;

  const res = data.resolucion;
  const W = data.tamano.ancho * res;
  const H = data.tamano.alto * res;
  const [ox, oy] = data.origen;
  const px = (x: number) => x - ox;
  const py = (y: number) => oy + H - y;

  const t = useTransform(progress, (p) => clamp(p / 0.92) * data.duracion);

  const trail = useTransform(t, (v) => {
    const { i, x, y } = poseAt(data.pose, v);
    let d = "";
    for (let k = 0; k <= i; k++) {
      d += `${k === 0 ? "M" : "L"}${px(data.pose[k][1]).toFixed(3)} ${py(data.pose[k][2]).toFixed(3)}`;
    }
    return `${d}L${px(x).toFixed(3)} ${py(y).toFixed(3)}`;
  });
  const robotX = useTransform(t, (v) => px(poseAt(data.pose, v).x));
  const robotY = useTransform(t, (v) => py(poseAt(data.pose, v).y));
  const headX = useTransform(t, (v) => {
    const p = poseAt(data.pose, v);
    return px(p.x) + Math.cos(p.yaw) * 0.2;
  });
  const headY = useTransform(t, (v) => {
    const p = poseAt(data.pose, v);
    return py(p.y) - Math.sin(p.yaw) * 0.2;
  });

  // Lecturas discretas (estado y reportes) en el DOM, sin re-renderizar por cuadro
  const clockRef = useRef<HTMLSpanElement>(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [stateName, setStateName] = useState("exploring");
  useMotionValueEvent(t, "change", (v) => {
    if (clockRef.current) clockRef.current.textContent = fmt(v);
    const n = data.reportes.filter((r) => v >= r.t).length;
    setReportsCount((c) => (c === n ? c : n));
    let s = "exploring";
    for (const e of data.estados) if (v >= e.t) s = e.a;
    setStateName((c) => (c === s ? c : s));
  });
  useEffect(() => {
    // estado inicial (también para reduced motion: estado final)
    const v = t.get();
    if (clockRef.current) clockRef.current.textContent = fmt(v);
    const n = data.reportes.filter((r) => v >= r.t).length;
    let s = "exploring";
    for (const e of data.estados) if (v >= e.t) s = e.a;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReportsCount(n);
    setStateName(s);
  }, [t, data, reduced]);

  const start = data.pose[0];
  const anchors: ("start" | "end")[] = ["end", "start", "end"];

  return (
    <div ref={wrapRef} className="relative h-[210dvh] lg:h-auto lg:flex-1" data-testid="run-replay">
      <div className="sticky top-16 flex h-[calc(100dvh-5rem)] flex-col gap-3 py-2">
        <div className="label flex items-baseline justify-between gap-3 text-[11px] sm:text-[12px]" aria-hidden>
          <span className="whitespace-nowrap tabular-nums">
            t = <span ref={clockRef} data-testid="replay-clock">00:00</span> / {fmt(data.duracion)}
          </span>
          <span className="whitespace-nowrap">
            {labels.reports} <span data-testid="replay-reports" className="tabular-nums">{reportsCount}/{data.reportes.length}</span>
          </span>
          <span className="whitespace-nowrap text-tinta-2" data-testid="replay-state">{stateName}</span>
        </div>

        <svg
          viewBox={`${-0.1} ${-0.1} ${W + 0.2} ${H + 0.2}`}
          role="img"
          aria-label={labels.summary}
          className="min-h-0 w-full flex-1"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x={0} y={0} width={W} height={H} fill="#f2f3f0" fillOpacity={0.9} stroke={UNKNOWN} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {data.mapa && (
            <image href={`/data/${data.mapa}`} x={0} y={0} width={W} height={H} preserveAspectRatio="none" opacity={0.8} />
          )}
          {/* metros: barra de 1 m */}
          <g aria-hidden>
            <line x1={0.12} y1={H - 0.1} x2={1.12} y2={H - 0.1} stroke={INK} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
            <text x={0.12} y={H - 0.17} fontSize={0.12} fill={INK} style={{ fontFamily: "var(--font-martian), monospace" }}>
              1 m
            </text>
          </g>
          {/* inicio */}
          <circle cx={px(start[1])} cy={py(start[2])} r={0.07} fill={INK} />
          <text
            x={px(start[1]) + 0.13}
            y={py(start[2]) + 0.2}
            fontSize={0.12}
            fill={INK}
            style={{ fontFamily: "var(--font-martian), monospace" }}
          >
            {labels.start}
          </text>
          {/* traza del robot: el único azul del sitio */}
          <motion.path
            d={trail}
            fill="none"
            stroke={TRACE}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {data.reportes.map((r, i) => (
            <ReportMark
              key={r.t}
              index={i}
              report={r}
              t={t}
              px={px}
              py={py}
              anchor={anchors[i] ?? "start"}
              label={`R${i + 1} · ${r.t.toFixed(1)} s`}
            />
          ))}
          <motion.line x1={robotX} y1={robotY} x2={headX} y2={headY} stroke={TRACE} strokeWidth={2.4} vectorEffect="non-scaling-stroke" />
          <motion.circle cx={robotX} cy={robotY} r={0.11} fill="#f2f3f0" stroke={TRACE} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>

        <p className="max-w-[34rem] text-[13px] leading-snug text-tinta-2">{labels.caption}</p>
        {!reduced && (
          <p className="label text-[11px] text-tinta-2" aria-hidden>
            ↓ {labels.hint}
          </p>
        )}
      </div>
    </div>
  );
}
