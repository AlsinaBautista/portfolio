"use client";

import { motion } from "motion/react";
import { MISSION_STATES, useMissionState } from "@/components/hud/useMissionState";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Labels = { returning: string; checking: string; done: string; trailLabel: string };

/**
 * Vuelta a la base: una traza punteada vuelve al punto de inicio mientras el HUD pasa por
 * returning, checking y finished, y se "publica" /done. Con reduced motion queda el estado final.
 */
export default function ReturnToBase({ labels }: { labels: Labels }) {
  const { state } = useMissionState();
  const reduced = useReducedMotion();
  const idx = MISSION_STATES.indexOf(state);
  const back = reduced || idx >= MISSION_STATES.indexOf("returning");
  const checked = reduced || idx >= MISSION_STATES.indexOf("checking");
  const finished = reduced || state === "finished";
  const tr = reduced ? { duration: 0 } : { duration: 1.6, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div className="mt-14" data-testid="return-to-base" data-finished={finished}>
      <svg viewBox="0 0 800 90" className="h-auto w-full" role="img" aria-label={labels.trailLabel}>
        <path d="M20 45 H780" stroke="#cdcfcb" strokeWidth={1} />
        {/* traza de ida, ya recorrida */}
        <path d="M780 45 C 700 12, 640 78, 560 45 S 420 14, 360 45" fill="none" stroke="#141615" strokeWidth={1.4} />
        {/* traza de vuelta punteada: se revela con una máscara para conservar los puntos */}
        <defs>
          <mask id="rtb-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="90">
            <motion.path
              d="M360 45 C 300 76, 240 20, 170 45 S 90 60, 40 45"
              fill="none"
              stroke="#fff"
              strokeWidth={14}
              initial={false}
              animate={{ pathLength: back ? 1 : 0 }}
              transition={tr}
            />
          </mask>
        </defs>
        <path
          d="M360 45 C 300 76, 240 20, 170 45 S 90 60, 40 45"
          fill="none"
          stroke="#141615"
          strokeWidth={2.2}
          strokeDasharray="2 7"
          strokeLinecap="round"
          mask="url(#rtb-mask)"
        />
        <circle cx={780} cy={45} r={4} fill="#141615" />
        <motion.rect
          x={30}
          y={35}
          width={20}
          height={20}
          fill="#f2f3f0"
          stroke="#141615"
          strokeWidth={2}
          initial={false}
          animate={{ fill: finished ? "#141615" : "#f2f3f0" }}
          transition={reduced ? { duration: 0 } : { duration: 0.3 }}
        />
      </svg>
      <p className="label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[12px]" aria-live="polite">
        <span className={back ? "text-pared" : "text-desconocido"}>{back ? "✓" : "·"} returning · {labels.returning}</span>
        <span className={checked ? "text-pared" : "text-desconocido"}>{checked ? "✓" : "·"} checking · {labels.checking}</span>
        <span className={finished ? "text-pared" : "text-desconocido"}>{finished ? "✓" : "·"} finished · {labels.done}</span>
      </p>
    </div>
  );
}
