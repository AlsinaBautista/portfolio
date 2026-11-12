"use client";

import { motion } from "motion/react";
import { useExplainer } from "../useExplainer";

const INK = "#141615";
const VICTIM = "#e1262d";
const UNKNOWN = "#cdcfcb";
const mono = { fontFamily: "var(--font-martian), monospace" } as const;

/**
 * Política de reportes: un candidato se reporta si tiene >= 5 observaciones, σ peor caso <= 0.10 m
 * y está a >= 0.40 m de cualquier reporte anterior. Cuadro final: las tres condiciones cumplidas y
 * el candidato marcado en rojo.
 */
export default function PolicyExplainer({ labels }: { labels: { obs: string; sigma: string; dist: string; reported: string; prev: string } }) {
  const { ref, end, tr } = useExplainer();
  return (
    <svg ref={ref} viewBox="0 0 320 214" className="h-auto w-full" role="img" aria-label={`${labels.obs}, ${labels.sigma}, ${labels.dist}`}>
      {/* 1. observaciones */}
      <text x={8} y={16} fontSize={10} fill={INK} style={mono}>
        1 · {labels.obs}
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x={8 + i * 22}
          y={26}
          width={16}
          height={16}
          stroke={INK}
          strokeWidth={1}
          fill={INK}
          initial={false}
          animate={{ fillOpacity: end ? 1 : 0 }}
          transition={tr(0.2 + i * 0.28, 0.2)}
        />
      ))}
      <motion.text x={126} y={39} fontSize={10} fill={INK} style={mono} initial={false} animate={{ opacity: end ? 1 : 0 }} transition={tr(1.6, 0.2)}>
        5 / 5
      </motion.text>

      {/* 2. sigma */}
      <text x={8} y={76} fontSize={10} fill={INK} style={mono}>
        2 · {labels.sigma}
      </text>
      <rect x={8} y={86} width={200} height={12} fill="none" stroke={UNKNOWN} />
      <motion.rect
        x={8}
        y={86}
        height={12}
        fill={INK}
        initial={false}
        animate={{ width: end ? 30 : 170 }}
        transition={tr(1.2, 1.1)}
      />
      <line x1={48} x2={48} y1={82} y2={102} stroke={INK} strokeDasharray="2 2" />
      <text x={52} y={110} fontSize={9} fill="#5e625f" style={mono}>
        0.10 m
      </text>

      {/* 3. distancia al reporte anterior */}
      <text x={8} y={134} fontSize={10} fill={INK} style={mono}>
        3 · {labels.dist}
      </text>
      <circle cx={70} cy={168} r={28} fill="none" stroke={INK} strokeDasharray="3 3" />
      <rect x={64} y={162} width={12} height={12} fill={VICTIM} />
      <text x={8} y={210} fontSize={9} fill="#5e625f" style={mono}>
        {labels.prev}
      </text>
      <motion.rect
        width={12}
        height={12}
        stroke={INK}
        initial={false}
        animate={{ x: end ? 156 : 80, y: 162, fill: end ? VICTIM : "#f2f3f0" }}
        transition={tr(2.2, 1.0)}
        strokeWidth={1.2}
      />
      <motion.text x={178} y={172} fontSize={10} fill={INK} style={mono} initial={false} animate={{ opacity: end ? 1 : 0 }} transition={tr(3.1, 0.3)}>
        {labels.reported}
      </motion.text>
    </svg>
  );
}
