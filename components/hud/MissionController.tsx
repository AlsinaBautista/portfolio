"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getMissionState, setMissionState } from "./useMissionState";

const BOOT_MS = 600;
const CHECKING_AFTER = 1000;
const FINISHED_AFTER = 2000;

/**
 * Lleva el estado de la misión según la sección visible:
 *  hero: waiting_for_map (600 ms) -> exploring · tars, proyectos, sobre mí: exploring
 *  contacto: returning -> checking -> finished
 */
export default function MissionController() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    let booted = false;
    let section: string | null = null;

    const clearSequence = () => {
      while (timers.length) clearTimeout(timers.pop());
    };

    const apply = () => {
      if (!booted) return;
      clearSequence();
      if (section === "contacto") {
        if (reduced) {
          setMissionState("finished");
          return;
        }
        setMissionState("returning");
        later(() => setMissionState("checking"), CHECKING_AFTER);
        later(() => setMissionState("finished"), FINISHED_AFTER);
      } else {
        setMissionState("exploring");
      }
    };

    const boot = () => {
      booted = true;
      apply();
    };
    if (reduced) boot();
    else {
      setMissionState("waiting_for_map");
      later(boot, BOOT_MS);
    }

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    let io: IntersectionObserver | undefined;
    if (els.length) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const id = (e.target as HTMLElement).dataset.section ?? null;
              if (id !== section) {
                section = id;
                apply();
              }
            }
          }
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );
      els.forEach((el) => io!.observe(el));
    } else if (getMissionState() !== "exploring") {
      // páginas de detalle: la misión sigue explorando
      section = null;
    }

    // Al llegar al final de la página siempre estamos en el contacto
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && els.length && section !== "contacto") {
        section = "contacto";
        apply();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearSequence();
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, pathname]);

  return null;
}
