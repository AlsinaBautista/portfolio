"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ErrorGuard from "./ErrorGuard";

// three.js vive en un chunk aparte: no entra en el JS inicial de la home.
const RobotCanvas = dynamic(() => import("./RobotCanvas"), { ssr: false });

/**
 * Marco del robot. Muestra el póster desde el primer cuadro y monta el canvas 3D recién cuando
 * el navegador está libre. Con prefers-reduced-motion, o si WebGL falla, queda solo el póster.
 */
export default function RobotStage({ alt, hint }: { alt: string; hint: string }) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [failed, setFailed] = useState(false);
  const [opts, setOpts] = useState<{ poster: boolean; look: "clay" | "original" }>({ poster: false, look: "clay" });

  useEffect(() => {
    heroRef.current = document.getElementById("hero");
    const q = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpts({ poster: q.has("poster"), look: q.get("look") === "original" ? "original" : "clay" });
  }, []);

  // Se monta cuando el hilo principal está libre (o a los 1.8 s como tope)
  useEffect(() => {
    if (reduced) return;
    if (opts.poster) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMount(true);
      return;
    }
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (n: number) => void;
    };
    const hasIdle = typeof w.requestIdleCallback === "function";
    let cancelled = false;
    const go = () => {
      if (!cancelled) setMount(true);
    };
    const id = hasIdle ? w.requestIdleCallback!(go, { timeout: 1800 }) : window.setTimeout(go, 900);
    return () => {
      cancelled = true;
      if (hasIdle) w.cancelIdleCallback?.(id);
      else clearTimeout(id);
    };
  }, [reduced, opts.poster]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCanvas = mount && !reduced && !failed;

  return (
    <figure
      ref={frameRef}
      className="relative m-0 aspect-[4/5] w-full max-w-[34rem] justify-self-end border border-desconocido bg-libre/60 sm:aspect-[5/6] lg:max-h-[72vh]"
      style={{ touchAction: "pan-y" }}
    >
      {/* marcas de esquina, como en un recuadro de mapa */}
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={`pointer-events-none absolute z-10 h-3 w-3 border-pared ${c}`} />
      ))}
      <Image
        src="/img/robot-poster.png"
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 34rem, 90vw"
        className={`object-contain transition-opacity duration-500 ${ready && showCanvas ? "opacity-0" : "opacity-100"}`}
      />
      {showCanvas && (
        <ErrorGuard onError={() => setFailed(true)}>
          <div className="absolute inset-0">
            <RobotCanvas heroRef={heroRef} visible={inView} look={opts.look} poster={opts.poster} onReady={() => setReady(true)} />
          </div>
        </ErrorGuard>
      )}
      <figcaption className="label pointer-events-none absolute inset-x-3 bottom-2 z-10 flex justify-between text-[11px] text-tinta-2">
        <span>ROSMASTER X3</span>
        {!reduced && <span>{hint}</span>}
      </figcaption>
    </figure>
  );
}
