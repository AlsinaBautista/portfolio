"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BUDGET = 600;
const mono = { fontFamily: "var(--font-martian), monospace" } as const;

function mmss(s: number) {
  const r = Math.round(s);
  return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`;
}

/**
 * Barra del presupuesto de 10 minutos de la corrida 2: lo que se usó, los tres reportes (rojos,
 * porque son lo reportado), el cambio a returning y dónde terminó la corrida.
 */
export default function BudgetBar({
  duration,
  reports,
  returnAt,
  labels,
}: {
  duration: number;
  reports: { t: number }[];
  returnAt: number;
  labels: { used: string; returning: string; end: string; report: string; unused: string };
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const go = reduced || seen;
  const pct = (s: number) => `${(s / BUDGET) * 100}%`;
  const tr = reduced ? { duration: 0 } : { duration: 1.4, ease: [0.2, 0, 0, 1] as const };

  return (
    <div ref={ref} className="select-none pt-10" role="img" aria-label={`${labels.used}: ${mmss(duration)} / 10:00. ${reports.map((r, i) => `${labels.report} ${i + 1}: ${mmss(r.t)}`).join(", ")}. ${labels.returning}: ${mmss(returnAt)}.`}>
      <div className="relative h-5 border border-pared bg-libre/70">
        <motion.div
          className="absolute inset-y-0 left-0 origin-left bg-pared"
          style={{ width: pct(returnAt) }}
          initial={false}
          animate={{ scaleX: go ? 1 : 0 }}
          transition={tr}
        />
        <motion.div
          className="absolute inset-y-0 origin-left"
          style={{
            left: pct(returnAt),
            width: pct(duration - returnAt),
            backgroundImage: "repeating-linear-gradient(135deg,#141615 0 2px,transparent 2px 5px)",
          }}
          initial={false}
          animate={{ opacity: go ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { delay: 1.3, duration: 0.4 }}
        />
        {reports.map((r) => (
          <motion.span
            key={r.t}
            aria-hidden
            className="absolute -top-8 h-3 w-3 -translate-x-1/2 bg-victima"
            style={{ left: pct(r.t) }}
            initial={false}
            animate={{ opacity: go ? 1 : 0, y: go ? 0 : -6 }}
            transition={reduced ? { duration: 0 } : { delay: 0.3 + (r.t / BUDGET) * 1.4, duration: 0.3 }}
          >
            <span className="label absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[10px] text-pared" style={mono}>
              {mmss(r.t)}
            </span>
          </motion.span>
        ))}
        {/* minutos */}
        {Array.from({ length: 11 }, (_, m) => (
          <span key={m} aria-hidden className="absolute top-full h-1.5 w-px bg-pared" style={{ left: pct(m * 60) }}>
            {m % 2 === 0 && (
              <span className="label absolute left-1/2 top-2 -translate-x-1/2 text-[10px] text-tinta-2">{m}:00</span>
            )}
          </span>
        ))}
      </div>
      <div className="label mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-tinta-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-4 bg-pared" /> exploring · 0:00–{mmss(returnAt)}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-2.5 w-4 border border-pared"
            style={{ backgroundImage: "repeating-linear-gradient(135deg,#141615 0 2px,transparent 2px 5px)" }}
          />
          {labels.returning} · {mmss(returnAt)}–{mmss(duration)}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5 bg-victima" /> {labels.report}
        </span>
        <span>
          {labels.end}: {mmss(duration)} · {labels.unused}: {mmss(BUDGET - duration)}
        </span>
      </div>
    </div>
  );
}
