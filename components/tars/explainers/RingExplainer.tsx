"use client";

import { motion } from "motion/react";
import { useExplainer } from "../useExplainer";

const INK = "#141615";
const VICTIM = "#e1262d";
const UNKNOWN = "#cdcfcb";
const mono = { fontFamily: "var(--font-martian), monospace" } as const;

const CX = 160;
const CY = 98;
const R = 70;
const pts = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  // redondeado: Math.cos/sin pueden diferir en el último decimal entre servidor y navegador
  return { x: Math.round((CX + Math.cos(a) * R) * 100) / 100, y: Math.round((CY + Math.sin(a) * R) * 100) / 100 };
});

/**
 * Anillo de inspección: 12 puntos a 0.8 m de la caja desde los que el robot la mira.
 * Cuadro final: los 12 puntos usados, con la línea de vista hacia la caja.
 */
export default function RingExplainer({ labels }: { labels: { box: string; points: string; radius: string } }) {
  const { ref, end, tr, reduced } = useExplainer();
  const xs = [...pts, pts[0]].map((p) => p.x);
  const ys = [...pts, pts[0]].map((p) => p.y);
  return (
    <svg ref={ref} viewBox="0 0 320 210" className="h-auto w-full" role="img" aria-label={`${labels.points}, ${labels.radius}`}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={UNKNOWN} strokeDasharray="3 4" />
      {pts.map((p, i) => (
        <g key={i}>
          <motion.line
            x1={p.x}
            y1={p.y}
            x2={CX}
            y2={CY}
            stroke={INK}
            strokeWidth={0.8}
            initial={false}
            animate={{ opacity: end ? 0.35 : 0 }}
            transition={tr(0.3 + i * 0.32, 0.25)}
          />
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            stroke={INK}
            strokeWidth={1}
            initial={false}
            animate={{ fill: end ? INK : "#f2f3f0" }}
            transition={tr(0.3 + i * 0.32, 0.25)}
          />
        </g>
      ))}
      <rect x={CX - 9} y={CY - 9} width={18} height={18} fill={VICTIM} />
      {/* el robot recorre los puntos */}
      {!reduced && end && (
        <motion.circle
          r={5.5}
          fill="#f2f3f0"
          stroke={INK}
          strokeWidth={1.6}
          initial={{ cx: xs[0], cy: ys[0] }}
          animate={{ cx: xs, cy: ys }}
          transition={{ duration: 12 * 0.32 * 1.0, ease: "linear", delay: 0.3, repeat: Infinity, repeatDelay: 1.2 }}
        />
      )}
      <text x={8} y={16} fontSize={10} fill={INK} style={mono}>
        {labels.points}
      </text>
      <text x={8} y={206} fontSize={9} fill="#5e625f" style={mono}>
        {labels.radius}
      </text>
      <text x={CX + 14} y={CY + 4} fontSize={9} fill={INK} style={mono}>
        {labels.box}
      </text>
    </svg>
  );
}
