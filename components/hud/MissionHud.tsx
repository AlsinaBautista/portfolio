"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MissionController from "./MissionController";
import { MISSION_STATES, markReported, useMissionState } from "./useMissionState";

const BUDGET_S = 600; // presupuesto real de la competencia: 10:00

function fmt(seconds: number) {
  const s = Math.max(0, Math.min(BUDGET_S, Math.round(seconds)));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

type Labels = { label: string; time: string; reports: string; waiting: string };

/**
 * HUD fijo y compacto: estado de misión, reloj atado al scroll y contador de reportes.
 * Se desvanece mientras el replay de la corrida 2 está en pantalla (tiene su propio reloj).
 */
export default function MissionHud({ labels, ids }: { labels: Labels; ids: string[] }) {
  const total = ids.length;
  const { state, reported } = useMissionState();
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const clockRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (clockRef.current) clockRef.current.textContent = fmt(p * BUDGET_S);
  });

  // al terminar la misión todo lo encontrado quedó reportado
  useEffect(() => {
    if (state === "finished") ids.forEach(markReported);
  }, [state, ids]);

  // se oculta mientras hay una figura con reloj propio en pantalla
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-hud-hide]"));
    if (!els.length) {
      const id = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(id);
    }
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setHidden(visible.size > 0);
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const index = MISSION_STATES.indexOf(state);
  const transition = reduced ? { duration: 0 } : { duration: 0.22, ease: [0.2, 0, 0, 1] as const };

  return (
    <>
      <MissionController />
      <aside
        aria-label={labels.label}
        aria-hidden={hidden || undefined}
        data-testid="hud"
        data-state={state}
        data-hidden={hidden}
        className={`label pointer-events-none fixed bottom-2 left-2 z-40 flex max-w-[calc(100vw-1rem)] items-center gap-2.5 border border-desconocido bg-libre/90 px-2.5 py-1.5 text-[11px] text-pared backdrop-blur-sm sm:bottom-4 sm:left-4 sm:gap-3 sm:text-[12px] ${
          reduced ? "" : "transition-opacity duration-300"
        } ${hidden ? "opacity-0" : "opacity-100"}`}
      >
        <span className="relative block h-[1.3em] overflow-hidden" aria-live="polite" data-testid="hud-state">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state}
              className="block whitespace-nowrap font-medium"
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
        <ol className="hidden gap-0.5 sm:flex" aria-hidden>
          {MISSION_STATES.map((s, i) => (
            <li key={s} className={`h-[3px] w-3 transition-colors ${i <= index ? "bg-pared" : "bg-desconocido"}`} />
          ))}
        </ol>
        <span className="whitespace-nowrap tabular-nums text-tinta-2" aria-hidden>
          <span className="hidden sm:inline">{labels.time} </span>
          <span ref={clockRef}>00:00</span>
          <span className="hidden sm:inline"> / 10:00</span>
        </span>
        <span className="whitespace-nowrap tabular-nums" data-testid="hud-reports">
          <span className="hidden text-tinta-2 sm:inline">{labels.reports} </span>
          {reported.length}/{total}
        </span>
      </aside>
    </>
  );
}
