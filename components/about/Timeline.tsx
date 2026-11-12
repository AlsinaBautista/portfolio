"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Entry = { title: string; place: string; period: string; note?: string };

/** Línea de tiempo que se dibuja con el scroll. Con reduced motion queda dibujada. */
export default function Timeline({ entries, heading }: { entries: (Entry & { kind: string })[]; heading: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref}>
      <h3 className="label text-tinta-2">{heading}</h3>
      <ol className="relative mt-6 space-y-10 pl-8">
        <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-desconocido" />
        <motion.span
          aria-hidden
          className="absolute bottom-1 left-[5px] top-1 w-px origin-top bg-pared"
          style={{ scaleY: reduced ? 1 : scale }}
        />
        {entries.map((e) => (
          <li key={e.kind} className="relative">
            <span aria-hidden className="absolute -left-8 top-[7px] h-[11px] w-[11px] border border-pared bg-libre" />
            <p className="label text-tinta-2">
              {e.kind} · {e.period}
            </p>
            <p className="mt-1 text-[20px] font-bold leading-tight">{e.title}</p>
            <p className="mt-1 text-[16px]">
              {e.place}
              {e.note ? <span className="text-tinta-2"> · {e.note}</span> : null}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
