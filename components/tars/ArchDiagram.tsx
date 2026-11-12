"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

const INK = "#141615";
const MUTED = "#5e625f";
const UNKNOWN = "#cdcfcb";
const LIBRE = "#f2f3f0";
const mono = { fontFamily: "var(--font-martian), monospace" } as const;

type NodeDef = { id: string; x: number; y: number; name: string; role: string; mine?: boolean };

const W = 224;
const H = 66;

/**
 * Arquitectura de TARS: seis nodos y Nav2, con los topics. Las líneas de puntos fluyen en el sentido
 * del dato (con reduced motion quedan quietas). El nodo de Misión es el que programé.
 */
export default function ArchDiagram({
  nodes,
  topics,
  mine,
  label,
  extra,
}: {
  nodes: { id: string; name: string; role: string }[];
  topics: string;
  mine: string;
  label: string;
  extra: { map: string; sensors: string; camera: string; verdicts: string; cmd: string };
}) {
  const reduced = useReducedMotion();
  const pos: Record<string, [number, number]> = {
    loc: [130, 30],
    nav: [880, 30],
    det: [130, 200],
    fus: [495, 200],
    mis: [880, 200],
    cob: [495, 370],
  };
  const list: NodeDef[] = nodes.map((n) => ({ ...n, x: pos[n.id][0], y: pos[n.id][1], mine: n.id === "mis" }));
  const flow = reduced ? "" : "arch-flow";

  const edges: { d: string; label: string; lx: number; ly: number; anchor?: "start" | "middle" }[] = [
    { d: `M${130 + W / 2} ${30 + H} V200`, label: "TF", lx: 254, ly: 160 },
    { d: `M${130 + W} 63 H880`, label: "TF map → odom", lx: 617, ly: 54, anchor: "middle" },
    { d: `M${130 + W} 233 H495`, label: "/jar/observaciones", lx: 424, ly: 224, anchor: "middle" },
    { d: `M${495 + W} 233 H880`, label: "/jar/candidatas", lx: 800, ly: 224, anchor: "middle" },
    { d: `M${495 + W} 403 H${880 + W / 2} V${200 + H}`, label: "/jar/plan_cobertura", lx: 800, ly: 394, anchor: "middle" },
    { d: `M${880 + W / 2} 200 V${30 + H}`, label: "NavigateToPose", lx: 1002, ly: 156 },
  ];
  const stubs: { d: string; lines: string[]; lx: number; ly: number }[] = [
    { d: "M20 63 H130", lines: [extra.map, extra.sensors], lx: 22, ly: 40 },
    { d: "M20 233 H130", lines: extra.camera.split(" · "), lx: 22, ly: 210 },
    { d: "M375 403 H495", lines: [extra.map], lx: 377, ly: 394 },
    { d: `M${880 + W} 233 H1220`, lines: extra.verdicts.split(" · "), lx: 1110, ly: 210 },
    { d: `M${880 + W} 63 H1220`, lines: [extra.cmd], lx: 1110, ly: 54 },
  ];

  return (
    <div className="overflow-x-auto" tabIndex={0} role="group" aria-label={label}>
      <svg viewBox="0 0 1240 470" className="h-auto min-w-[760px] w-full" role="img" aria-label={label}>
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={INK} />
          </marker>
        </defs>
        {edges.map((e, i) => (
          <g key={`e${i}`}>
            <path d={e.d} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="5 6" className={flow} markerEnd="url(#arch-arrow)" />
            <text x={e.lx} y={e.ly} fontSize={11} fill={MUTED} textAnchor={e.anchor ?? "start"} style={mono}>
              {e.label}
            </text>
          </g>
        ))}
        {stubs.map((e, i) => (
          <g key={`s${i}`}>
            <path d={e.d} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="5 6" className={flow} markerEnd="url(#arch-arrow)" />
            <text x={e.lx} y={e.ly} fontSize={12} fill={MUTED} style={mono}>
              {e.lines.map((l, k) => (
                <tspan key={k} x={e.lx} dy={k === 0 ? 0 : 14}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        ))}
        {list.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={W}
              height={H}
              fill={n.mine ? INK : LIBRE}
              stroke={n.mine ? INK : INK}
              strokeWidth={1.3}
            />
            <text x={n.x + 14} y={n.y + 28} fontSize={17} fontWeight={700} fill={n.mine ? LIBRE : INK}>
              {n.name}
            </text>
            <text x={n.x + 14} y={n.y + 50} fontSize={11} fill={n.mine ? UNKNOWN : MUTED} style={mono}>
              {n.role}
            </text>
            {n.mine && (
              <text x={n.x + W - 10} y={n.y - 8} fontSize={11.5} textAnchor="end" fill={INK} style={mono}>
                {mine}
              </text>
            )}
          </g>
        ))}
        <text x={20} y={455} fontSize={12} fill={MUTED} style={mono}>
          {topics}
        </text>
      </svg>
    </div>
  );
}
