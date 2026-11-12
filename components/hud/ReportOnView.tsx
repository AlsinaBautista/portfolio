"use client";

import { useEffect, useRef } from "react";
import { markReported } from "./useMissionState";

/** Suma un reporte al HUD la primera vez que el elemento entra en pantalla. */
export default function ReportOnView({ id, className }: { id: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          markReported(id);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return <span ref={ref} aria-hidden className={className} />;
}
