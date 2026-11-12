"use client";

import { useEffect, useRef } from "react";

/** En pantallas angostas achica la hoja A4 (794 px) para que entre sin scroll horizontal. En impresión no actúa. */
export default function ScaleToFit({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const w = el.parentElement?.clientWidth ?? window.innerWidth;
      el.style.setProperty("--cv-zoom", String(Math.min(1, (w - 24) / 794)));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="cv-fit">
      {children}
    </div>
  );
}
