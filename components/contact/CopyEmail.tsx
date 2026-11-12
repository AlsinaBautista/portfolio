"use client";

import { useEffect, useRef, useState } from "react";

/** Botón grande de contacto (rojo, como las cajas reportadas): copia el mail y cambia el texto. */
export default function CopyEmail({ email, label, doneLabel }: { email: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // sin permiso de portapapeles: se selecciona el texto del enlace de mail como alternativa
      window.location.href = `mailto:${email}`;
      return;
    }
    setDone(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setDone(false), 2400);
  }

  return (
    <div>
      <button
        type="button"
        onClick={copy}
        className="label inline-flex min-h-16 items-center gap-4 bg-victima px-8 py-4 text-[14px] font-medium text-libre outline-offset-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-pared active:translate-y-0 sm:text-[15px]"
      >
        <span aria-hidden className="inline-block h-3 w-3 bg-libre" />
        <span aria-live="polite">{done ? doneLabel : label}</span>
      </button>
      <p className="label mt-3 text-tinta-2">{email}</p>
    </div>
  );
}
