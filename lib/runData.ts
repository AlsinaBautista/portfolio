import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type RunData = {
  resolucion: number;
  origen: [number, number];
  tamano: { ancho: number; alto: number };
  duracion: number;
  mapa: string | null;
  mapaFuente: string | null;
  pose: [number, number, number, number][];
  reportes: { t: number; x: number; y: number }[];
  estados: { t: number; de: string; a: string }[];
};

/** Reportes de la corrida 2: distancia real al centro de la caja, del juez (resultado.json). */
export const REPORT_DISTANCE_CM = [6, 2, 10] as const;

let cache: RunData | null = null;

/** Lee public/data/run2.json (se genera con scripts/build-run-data.py). Solo en el servidor. */
export function getRunData(): RunData {
  cache ??= JSON.parse(readFileSync(join(process.cwd(), "public/data/run2.json"), "utf8")) as RunData;
  return cache;
}
