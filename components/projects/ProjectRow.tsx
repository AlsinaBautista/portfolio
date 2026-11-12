"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Chip from "@/components/ui/Chip";
import Video from "@/components/ui/Video";
import ReportOnView from "@/components/hud/ReportOnView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ProjectItem } from "./types";

export default function ProjectRow({
  item,
  index,
  reportedLabel,
  onHover,
  onLeave,
  fixedMedia,
  playLabel,
  pauseLabel,
}: {
  item: ProjectItem;
  index: number;
  reportedLabel: string;
  onHover: (slug: string) => void;
  onLeave: () => void;
  /** media fija en la fila (reduced motion o sin mouse) */
  fixedMedia: boolean;
  playLabel: string;
  pauseLabel: string;
}) {
  const reduced = useReducedMotion();
  const num = String(index + 1).padStart(2, "0");
  const shown = item.stack.slice(0, 4);
  const more = item.stack.length - shown.length;

  return (
    <li className="border-t border-desconocido last:border-b">
      <Link
        href={item.href}
        onPointerEnter={(e) => e.pointerType === "mouse" && onHover(item.slug)}
        onPointerLeave={onLeave}
        onFocus={() => onHover(item.slug)}
        onBlur={onLeave}
        className="group block py-6 md:py-7"
        data-project={item.slug}
      >
        <ReportOnView id={item.slug} />
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 md:grid-cols-[3rem_minmax(0,1fr)_auto] lg:grid-cols-[3rem_minmax(0,1.5fr)_minmax(0,1fr)_4.5rem_9rem]">
          <p className="label hidden pt-2 text-tinta-2 md:block">{num}</p>

          {/* media: visible en mobile; en desktop solo si hay reduced motion */}
          <div className={`-order-1 ${fixedMedia ? "md:order-last md:col-span-full md:w-64" : "md:hidden"}`}>
            <ViewTransition name={`cover-${item.slug}`} share="morph">
            <div className="relative overflow-hidden bg-desconocido">
              {item.cover.type === "video" ? (
                <Video
                  src={item.cover.src}
                  width={item.cover.width}
                  height={item.cover.height}
                  label={item.coverAlt}
                  mode="loop"
                  playLabel={playLabel}
                  pauseLabel={pauseLabel}
                />
              ) : (
                <Image
                  src={item.cover.src}
                  alt={item.coverAlt}
                  width={item.cover.width}
                  height={item.cover.height}
                  sizes="(min-width: 768px) 256px, 92vw"
                  className="h-auto w-full max-h-[420px] object-cover"
                />
              )}
            </div>
            </ViewTransition>
          </div>

          <div className="min-w-0">
            <h3 className="text-[clamp(22px,2.4vw,28px)] font-bold leading-tight transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
              {item.title}
            </h3>
            <p className="label mt-2 text-tinta-2">{item.context}</p>
            <p className="mt-3 max-w-[38rem] text-[15px] leading-snug text-tinta-2">{item.summary}</p>
          </div>

          <ul className="hidden flex-wrap content-start gap-1.5 lg:flex" aria-label="stack">
            {shown.map((s) => (
              <li key={s}>
                <Chip className="text-[10px]">{s}</Chip>
              </li>
            ))}
            {more > 0 && (
              <li>
                <Chip className="text-[10px] text-tinta-2">+{more}</Chip>
              </li>
            )}
          </ul>

          <p className="label hidden pt-2 text-tinta-2 lg:block">{item.year}</p>

          <p className="label flex items-center gap-2 pt-1 md:pt-2">
            <motion.span
              aria-hidden
              className="inline-block h-2.5 w-2.5 bg-victima"
              initial={reduced ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
            />
            {reportedLabel}
            <span className="text-tinta-2 lg:hidden">· {item.year}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
