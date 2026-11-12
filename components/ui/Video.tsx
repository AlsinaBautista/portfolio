"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Video liviano: sin audio, carga diferida (preload="none") y póster WebP.
 * mode "loop": arranca cuando entra en pantalla y se pausa al salir.
 * mode "hover": arranca con `playing` (lo controla la fila de proyectos).
 * mode "controls": el usuario decide.
 * Con prefers-reduced-motion nunca arranca solo: queda el póster con controles.
 */
export default function Video({
  src,
  width,
  height,
  label,
  mode = "loop",
  playing,
  className = "",
  playLabel = "Reproducir",
  pauseLabel = "Pausar",
}: {
  /** Ruta sin extensión: {src}.mp4, {src}.webm y {src}-poster.webp */
  src: string;
  width: number;
  height: number;
  label: string;
  mode?: "loop" | "hover" | "controls";
  playing?: boolean;
  className?: string;
  playLabel?: string;
  pauseLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [manual, setManual] = useState(false);
  const auto = !reduced && mode === "loop";

  useEffect(() => {
    const v = ref.current;
    if (!v || !auto) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [auto]);

  useEffect(() => {
    const v = ref.current;
    if (!v || mode !== "hover" || reduced) return;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing, mode, reduced]);

  const showControls = mode === "controls" || reduced;

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full bg-desconocido object-cover"
        width={width}
        height={height}
        muted
        loop={mode !== "controls"}
        playsInline
        preload="none"
        poster={`${src}-poster.webp`}
        controls={showControls || manual}
        aria-label={label}
        data-video=""
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
      {mode === "loop" && !reduced && (
        <button
          type="button"
          className="label absolute bottom-2 right-2 border border-pared bg-libre/90 px-2 py-1 text-[11px] text-pared opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            if (v.paused) void v.play();
            else v.pause();
            setManual(false);
          }}
          aria-label={`${playLabel} / ${pauseLabel}`}
        >
          {playLabel} / {pauseLabel}
        </button>
      )}
    </div>
  );
}
