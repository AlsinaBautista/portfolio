"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Tokens: desconocido #CDCFCB, pared #141615
const UNKNOWN = "205,207,203";
const WALL = "20,22,21";
const BOOT_MS = 600;
const GROW_MS = 1800;

/** Hash determinista y barato en [0,1) */
function hash(a: number, b: number, c = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Pared de la grilla: postes cada 4 celdas y tramos entre ellos, como un laberinto de mapa. */
function isWall(c: number, r: number) {
  const mc = ((c % 4) + 4) % 4;
  const mr = ((r % 4) + 4) % 4;
  const bc = Math.floor(c / 4);
  const br = Math.floor(r / 4);
  if (mc === 0 && mr === 0) return hash(bc, br, 7) < 0.55;
  if (mr === 0) return hash(bc, br, 1) < 0.3;
  if (mc === 0) return hash(bc, br, 2) < 0.3;
  return false;
}

/**
 * Fondo: grilla de ocupación como la de un mapa de ROS. Las celdas arrancan desconocidas y se
 * vuelven libres en un radio alrededor del centro del viewport mientras scrolleás, como si un
 * LiDAR barriera la página. Canvas 2D fijo. Con reduced motion queda revelada y estática.
 */
export default function OccupancyBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let vw = 0;
    let vh = 0;
    let cell = 28;
    let cols = 0;
    let rows = 0;
    let level = new Uint8Array(0);
    let raf = 0;
    let bootAt = 0;
    let alive = true;

    const alloc = () => {
      const docH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const newRows = Math.ceil(docH / cell) + 2;
      if (newRows === rows && level.length === cols * rows) return;
      const next = new Uint8Array(cols * newRows);
      next.set(level.subarray(0, Math.min(level.length, next.length)));
      level = next;
      rows = newRows;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const newCell = vw < 640 ? 22 : 28;
      const newCols = Math.ceil(vw / newCell) + 1;
      if (newCell !== cell || newCols !== cols) {
        cell = newCell;
        cols = newCols;
        rows = 0;
        level = new Uint8Array(0);
      }
      alloc();
      request();
    };

    const request = () => {
      if (!raf && alive) raf = requestAnimationFrame(frame);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;
      if (!bootAt) bootAt = now;
      const scrollY = reduced ? 0 : window.scrollY;
      const r0 = Math.max(0, Math.floor(scrollY / cell));
      const r1 = Math.min(rows - 1, Math.ceil((scrollY + vh) / cell));
      const grow = reduced
        ? 1
        : Math.max(0, Math.min(1, (now - bootAt - BOOT_MS) / GROW_MS));
      const eased = 1 - Math.pow(1 - grow, 3);
      const cx = vw / 2;
      const cy = vh / 2;
      const rx = vw * 0.8 * eased + 1;
      const ry = vh * 0.55 * eased + 1;
      let changing = grow < 1;

      ctx.clearRect(0, 0, vw, vh);
      const off = -(scrollY - r0 * cell);
      for (let r = r0; r <= r1; r++) {
        const y = (r - r0) * cell + off;
        for (let c = 0; c < cols; c++) {
          const x = c * cell;
          const i = r * cols + c;
          let l = level[i];
          if (l < 255) {
            if (reduced) l = level[i] = 255;
            else if (grow > 0) {
              const dx = (x + cell / 2 - cx) / rx;
              const dy = (y + cell / 2 - cy) / ry;
              const edge = 1 - hash(c, r, 3) * 0.3;
              if (dx * dx + dy * dy < edge) {
                l = level[i] = Math.min(255, l + 36);
                changing = true;
              }
            }
          }
          if (l < 255) {
            ctx.fillStyle = `rgba(${UNKNOWN},${(0.62 * (1 - l / 255)).toFixed(3)})`;
            ctx.fillRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
          }
          if (l > 0) {
            const a = l / 255;
            if (isWall(c, r)) {
              ctx.fillStyle = `rgba(${WALL},${(0.13 * a).toFixed(3)})`;
              ctx.fillRect(x + 3, y + 3, cell - 6, cell - 6);
            } else {
              ctx.fillStyle = `rgba(${WALL},${(0.1 * a).toFixed(3)})`;
              ctx.fillRect(x + cell / 2 - 0.75, y + cell / 2 - 0.75, 1.5, 1.5);
            }
          }
        }
      }
      if (changing && !reduced) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      if (!reduced) request();
    };
    const ro = new ResizeObserver(() => {
      if (!alive) return;
      alloc();
      request();
    });
    ro.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    // El primer cuadro dibuja la grilla desconocida; la revelación arranca tras BOOT_MS
    const kick = reduced ? 0 : window.setTimeout(request, BOOT_MS + 20);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(kick);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" data-testid="backdrop" />;
}
