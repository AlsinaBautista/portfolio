"use client";

import { motion } from "motion/react";
import { useExplainer } from "../useExplainer";

const INK = "#141615";
const UNKNOWN = "#cdcfcb";
const mono = { fontFamily: "var(--font-martian), monospace" } as const;

// Camino de vuelta sobre una grilla (celdas de 20 px), partido en tramos
const LEGS = [
  "M40 170 H100 V130 H140",
  "M140 130 V90 H200 V60",
  "M200 60 H270 V30",
];
const ENDS: [number, number][] = [
  [140, 130],
  [200, 60],
  [270, 30],
];

/**
 * Vuelta por tramos: BFS sobre el costmap y camino partido en tramos de hasta 5 m.
 * Cuadro final: los tres tramos dibujados hasta la base.
 */
export default function LegsExplainer({ labels }: { labels: { leg: string; base: string; max: string; far: string } }) {
  const { ref, end, tr } = useExplainer();
  return (
    <svg ref={ref} viewBox="0 0 320 210" className="h-auto w-full" role="img" aria-label={`${labels.leg}: ${labels.max}`}>
      {/* grilla del costmap */}
      {Array.from({ length: 15 }, (_, c) =>
        Array.from({ length: 9 }, (_, r) => (
          <circle key={`${c}-${r}`} cx={20 + c * 20} cy={30 + r * 20} r={1.1} fill={UNKNOWN} />
        )),
      )}
      {LEGS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: end ? 1 : 0 }}
          transition={tr(0.3 + i * 1.0, 0.9)}
          strokeDasharray={i % 2 === 1 ? "none" : "none"}
        />
      ))}
      {ENDS.map(([x, y], i) => (
        <motion.g key={i} initial={false} animate={{ opacity: end ? 1 : 0 }} transition={tr(1.1 + i * 1.0, 0.2)}>
          <line x1={x} x2={x} y1={y - 8} y2={y + 8} stroke={INK} strokeWidth={1.2} />
          <text x={x + 6} y={y + 22} fontSize={9} fill={INK} style={mono}>
            {labels.leg} {i + 1}
          </text>
        </motion.g>
      ))}
      <circle cx={40} cy={170} r={5} fill={INK} />
      <text x={22} y={196} fontSize={9} fill={INK} style={mono}>
        {labels.base}
      </text>
      <motion.circle cx={270} cy={30} r={5} fill="#f2f3f0" stroke={INK} strokeWidth={1.6} initial={false} animate={{ opacity: 1 }} />
      <text x={204} y={20} fontSize={9} fill="#5e625f" style={mono}>
        {labels.far}
      </text>
      <text x={8} y={16} fontSize={10} fill={INK} style={mono}>
        {labels.max}
      </text>
    </svg>
  );
}
