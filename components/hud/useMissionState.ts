"use client";

import { useSyncExternalStore } from "react";

/** Los estados reales de mision.py, en orden. */
export const MISSION_STATES = [
  "waiting_for_map",
  "exploring",
  "returning",
  "checking",
  "finished",
] as const;
export type MissionState = (typeof MISSION_STATES)[number];

type Snapshot = { state: MissionState; reported: readonly string[] };

let snapshot: Snapshot = { state: "waiting_for_map", reported: [] };
const listeners = new Set<() => void>();
const SERVER: Snapshot = snapshot;

function emit(next: Snapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}

export function setMissionState(state: MissionState) {
  if (snapshot.state !== state) emit({ ...snapshot, state });
}

/** Suma un reporte (un proyecto que apareció). Idempotente por id. */
export function markReported(id: string) {
  if (!snapshot.reported.includes(id)) emit({ ...snapshot, reported: [...snapshot.reported, id] });
}

export function getMissionState() {
  return snapshot.state;
}

export function useMissionState(): Snapshot {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => SERVER,
  );
}
