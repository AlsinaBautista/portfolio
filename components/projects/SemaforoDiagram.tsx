"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

const INK = "#141615";
const MUTED = "#5e625f";
const UNKNOWN = "#cdcfcb";
const LIBRE = "#f2f3f0";
const mono = { fontFamily: "var(--font-martian), monospace" } as const;
const W = 190;
const H = 70;

type T = {
  label: string;
  camera: { name: string; role: string };
  yolo: { name: string; role: string };
  agent: { name: string; role: string };
  safety: { name: string; role: string };
  lights: { name: string; role: string };
  bus: string;
  coordinator: { name: string; role: string };
  video: string;
  counts: string;
  request: string;
  phase: string;
  fallback: string;
  onnx: string;
  title: string;
};

/** Parte una etiqueta en dos líneas cerca de la mitad, para que entre entre dos nodos */
function splitLabel(label: string): string[] {
  if (label.length <= 12) return [label];
  const words = label.split(" ");
  const half = label.length / 2;
  let acc = 0;
  let cut = 1;
  const last = words.length - 1;
  for (let i = 0; i < words.length; i++) {
    acc += words[i].length + 1;
    if (acc >= half) {
      cut = Math.min(i + 1, last);
      break;
    }
  }
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")].filter(Boolean);
}

/**
 * Arquitectura del semáforo adaptativo, solo con lo que dice el README del repo: la cámara alimenta
 * YOLOv8 (detección y seguimiento), el agente MAPPO de cada intersección pide una fase y la capa de
 * seguridad en C++ decide la que se acciona. MQTT lleva la telemetría y conecta con el coordinador.
 */
export default function SemaforoDiagram({ t }: { t: T }) {
  const reduced = useReducedMotion();
  const flow = reduced ? "" : "arch-flow";
  const nodes: { x: number; name: string; role: string; mine?: boolean }[] = [
    { x: 20, ...t.camera },
    { x: 290, ...t.yolo },
    { x: 560, ...t.agent },
    { x: 830, ...t.safety, mine: true },
    { x: 1100, ...t.lights },
  ];
  const y = 70;
  const mid = y + H / 2;
  const edges = [
    { x1: 20 + W, x2: 290, label: t.video },
    { x1: 290 + W, x2: 560, label: t.counts },
    { x1: 560 + W, x2: 830, label: t.request },
    { x1: 830 + W, x2: 1100, label: t.phase },
  ];
  return (
    <div className="overflow-x-auto" tabIndex={0} role="group" aria-label={t.label}>
      <svg viewBox="0 0 1320 420" data-diagram="semaforo" className="h-auto w-full min-w-[900px]" role="img" aria-label={t.label}>
        <defs>
          <marker id="sem-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={INK} />
          </marker>
        </defs>
        <rect width={1320} height={420} fill={LIBRE} />
        <text x={20} y={34} fontSize={15} fontWeight={700} fill={INK}>
          {t.title}
        </text>

        {edges.map((e) => (
          <g key={e.label}>
            <path d={`M${e.x1} ${mid} H${e.x2}`} stroke={INK} strokeWidth={1.5} strokeDasharray="5 6" fill="none" className={flow} markerEnd="url(#sem-arrow)" />
            <text x={(e.x1 + e.x2) / 2} y={mid - 12 - (splitLabel(e.label).length - 1) * 13} fontSize={10.5} fill={MUTED} textAnchor="middle" style={mono}>
              {splitLabel(e.label).map((l, k) => (
                <tspan key={k} x={(e.x1 + e.x2) / 2} dy={k === 0 ? 0 : 13}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        {/* bus MQTT */}
        <rect x={290} y={250} width={730} height={26} fill={LIBRE} stroke={INK} strokeWidth={1.3} />
        <text x={655} y={268} fontSize={12} fill={INK} textAnchor="middle" style={mono}>
          {t.bus}
        </text>
        {[385, 655, 925].map((x) => (
          <path key={x} d={`M${x} ${y + H} V250`} stroke={INK} strokeWidth={1.2} strokeDasharray="3 5" fill="none" className={flow} />
        ))}
        {/* coordinador sobre el bus */}
        <path d="M655 276 V330" stroke={INK} strokeWidth={1.2} strokeDasharray="3 5" fill="none" className={flow} />
        <rect x={560} y={330} width={W} height={H} fill={LIBRE} stroke={INK} strokeWidth={1.3} />
        <text x={574} y={358} fontSize={17} fontWeight={700} fill={INK}>
          {t.coordinator.name}
        </text>
        <text x={574} y={380} fontSize={10.5} fill={MUTED} style={mono}>
          {t.coordinator.role}
        </text>

        {nodes.map((n) => (
          <g key={n.name}>
            <rect x={n.x} y={y} width={W} height={H} fill={n.mine ? INK : LIBRE} stroke={INK} strokeWidth={1.3} />
            <text x={n.x + 14} y={y + 30} fontSize={17} fontWeight={700} fill={n.mine ? LIBRE : INK}>
              {n.name}
            </text>
            <text x={n.x + 14} y={y + 52} fontSize={11} fill={n.mine ? UNKNOWN : MUTED} style={mono}>
              {n.role}
            </text>
          </g>
        ))}
        <text x={560} y={y - 12} fontSize={10.5} fill={MUTED} style={mono}>
          {t.onnx}
        </text>
        {/* respaldo: ciclo fijo seguro */}
        <text x={770} y={372} fontSize={11} fill={INK} style={mono}>
          {t.fallback}
        </text>
      </svg>
    </div>
  );
}
