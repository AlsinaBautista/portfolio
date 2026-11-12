"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Estado común de las explicaciones animadas: arrancan al entrar en pantalla.
 * Con reduced motion se muestra directo el cuadro final (todo en `end`, sin transición).
 */
export function useExplainer<T extends Element = SVGSVGElement>() {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const end = reduced || seen;
  return {
    ref,
    reduced,
    end,
    /** transición con retardo; instantánea si hay reduced motion */
    tr: (delay = 0, duration = 0.5) => (reduced ? { duration: 0 } : { delay, duration, ease: [0.2, 0, 0, 1] as const }),
  };
}
