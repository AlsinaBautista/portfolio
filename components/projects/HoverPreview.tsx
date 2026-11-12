"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, type MotionValue } from "motion/react";
import { useEffect } from "react";
import Video from "@/components/ui/Video";
import type { ProjectItem } from "./types";

const W = 320;

/**
 * Vista previa que sigue al cursor (idea de React Bits / Aceternity). Muestra la media del proyecto
 * sobre el que está el mouse y arranca el video en hover. Solo desktop con mouse; se monta solo
 * para los proyectos que ya se tocaron, así no se descargan todos de entrada.
 */
export default function HoverPreview({
  items,
  hovered,
  x,
  y,
  seen,
}: {
  items: ProjectItem[];
  hovered: string | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
  seen: string[];
}) {
  const sx = useSpring(x, { stiffness: 240, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 240, damping: 26, mass: 0.6 });
  useEffect(() => {
    // al entrar por primera vez no hay que "viajar" desde (0,0)
    sx.jump(x.get());
    sy.jump(y.get());
  }, [hovered === null, sx, sy, x, y]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="frame"
            className="relative -translate-y-1/2 translate-x-6 overflow-hidden border border-pared bg-libre"
            style={{ width: W }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          >
            {items
              .filter((i) => seen.includes(i.slug))
              .map((i) => {
                const active = i.slug === hovered;
                const ratio = i.cover.width / i.cover.height;
                const h = Math.round(W / ratio);
                const inner = (
                  <div
                    key={i.slug}
                    className={active ? "relative" : "absolute inset-0 opacity-0"}
                    style={{ width: W, height: h, maxHeight: 380 }}
                  >
                    {i.cover.type === "video" ? (
                      <Video src={i.cover.src} width={i.cover.width} height={i.cover.height} label={i.coverAlt} mode="hover" playing={active} className="h-full w-full" />
                    ) : (
                      <Image src={i.cover.src} alt="" width={i.cover.width} height={i.cover.height} sizes="320px" className="h-full w-full object-cover" />
                    )}
                  </div>
                );
                return active ? (
                  <ViewTransition key={i.slug} name={`cover-${i.slug}`} share="morph">
                    {inner}
                  </ViewTransition>
                ) : (
                  inner
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
