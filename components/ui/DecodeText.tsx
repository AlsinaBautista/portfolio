"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·:+";

/**
 * Texto que se "decodifica" carácter por carácter (idea de DecryptedText de React Bits).
 * El servidor entrega el texto final; la animación es solo del cliente y arranca tras `delay`.
 * Con prefers-reduced-motion se ve el texto final directo.
 */
export default function DecodeText({
  text,
  delay = 600,
  duration = 900,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [anim, setAnim] = useState<string | null>(null);
  const shown = reduced ? text : (anim ?? text);

  useEffect(() => {
    if (reduced) return;
    const scramble = (done: number) =>
      Array.from(text, (ch, i) =>
        ch === " " || i < done ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      ).join("");
    let raf = requestAnimationFrame(() => setAnim(scramble(0)));
    let start = 0;
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        start ||= now;
        const p = Math.min(1, (now - start) / duration);
        setAnim(p < 1 ? scramble(Math.floor(p * text.length)) : null);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration, reduced]);

  return (
    <span
      className={`decode-wait ${className ?? ""}`}
      style={{ "--decode-delay": `${delay}ms` } as React.CSSProperties}
    >
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
