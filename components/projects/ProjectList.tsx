"use client";

import { useCallback, useEffect, useState } from "react";
import { useMotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HoverPreview from "./HoverPreview";
import ProjectRow from "./ProjectRow";
import type { ProjectItem } from "./types";

/**
 * Lista editorial de proyectos. En desktop con mouse, una vista previa de la media sigue al cursor;
 * en mobile son tarjetas con la media visible; con reduced motion la media queda fija en la fila.
 */
export default function ProjectList({
  items,
  reportedLabel,
  playLabel,
  pauseLabel,
}: {
  items: ProjectItem[];
  reportedLabel: string;
  playLabel: string;
  pauseLabel: string;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [fine, setFine] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const set = () => setFine(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const preview = fine && !reduced;

  const onHover = useCallback(
    (slug: string) => {
      if (!preview) return;
      setHovered(slug);
      setSeen((s) => (s.includes(slug) ? s : [...s, slug]));
    },
    [preview],
  );
  const onLeave = useCallback(() => setHovered(null), []);

  return (
    <div
      onPointerMove={(e) => {
        if (!preview) return;
        x.set(Math.min(e.clientX, window.innerWidth - 360));
        y.set(Math.min(Math.max(e.clientY, 140), window.innerHeight - 140));
      }}
    >
      <ul className="m-0 list-none p-0">
        {items.map((item, i) => (
          <ProjectRow
            key={item.slug}
            item={item}
            index={i}
            reportedLabel={reportedLabel}
            onHover={onHover}
            onLeave={onLeave}
            fixedMedia={reduced}
            playLabel={playLabel}
            pauseLabel={pauseLabel}
          />
        ))}
      </ul>
      {preview && <HoverPreview items={items} hovered={hovered} x={x} y={y} seen={seen} />}
    </div>
  );
}
