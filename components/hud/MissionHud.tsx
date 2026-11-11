"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MissionController from "./MissionController";
import { MISSION_STATES, useMissionState } from "./useMissionState";

const BUDGET_S = 600; // presupuesto real de la competencia: 10:00

function fmt(seconds: number) {
  const s = Math.max(0, Math.min(BUDGET_S, Math.round(seconds)));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

type Labels = { label: string; time: string; reports: string; waiting: string };

/** HUD fijo con el estado de misión, el reloj atado al scroll y el contador de reportes. */
export default function MissionHud({ labels, total }: { labels: Labels; total: number }) {
  const { state, reported } = useMissionState();
  const reduced = useReducedMotion();
  const clockRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (clockRef.current) clockRef.current.textContent = fmt(p * BUDGET_S);
  });

  const index = MISSION_STATES.indexOf(state);
  const transition = reduced ? { duration: 0 } : { duration: 0.22, ease: [0.2, 0, 0, 1] as const };

  return (
    <>
      <MissionController />
      <aside
        aria-label={labels.label}
        data-testid="hud"
        data-state={state}
        className="label pointer-events-none fixed bottom-3 left-3 z-40 w-max min-w-[16rem] max-w-[calc(100vw-1.5rem)] border border-desconocido bg-libre/90 px-3 py-2.5 text-[11px] text-pared backdrop-blur-sm sm:bottom-5 sm:left-5 sm:text-[12px]"
      >
        <span
          className="relative block h-[1.3em] overflow-hidden"
          aria-live="polite"
          data-testid="hud-state"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state}
              className="block font-medium"
              initial={{ y: reduced ? 0 : "70%", opacity: reduced ? 1 : 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduced ? 0 : "-70%", opacity: reduced ? 1 : 0 }}
              transition={transition}
            >
              {state}
              {state === "waiting_for_map" ? "…" : ""}
            </motion.span>
          </AnimatePresence>
        </span>
        <ol className="mt-1.5 flex gap-1" aria-hidden>
          {MISSION_STATES.map((s, i) => (
            <li
              key={s}
              className={`h-[3px] flex-1 transition-colors ${i <= index ? "bg-pared" : "bg-desconocido"}`}
            />
          ))}
        </ol>
        <div className="mt-2 flex items-baseline justify-between gap-3 text-tinta-2">
          <span className="whitespace-nowrap tabular-nums" aria-hidden>
            {labels.time} = <span ref={clockRef}>00:00</span> / 10:00
          </span>
          <span>
            {labels.reports}{" "}
            <span className="tabular-nums text-pared" data-testid="hud-reports">
              {reported.length}/{total}
            </span>
          </span>
        </div>
      </aside>
    </>
  );
}
