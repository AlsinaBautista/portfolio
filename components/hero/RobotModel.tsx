"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const MODEL_URL = "/models/rosmaster.glb";

// Tokens (ver app/globals.css)
const CLAY = "#d8d9d4";
const WALL = "#141615";

export type RobotLook = "clay" | "original";

/**
 * El ROSMASTER X3 real (GLB optimizado). Material "arcilla" mate con aristas finas en `pared`;
 * los sensores (LiDAR y cámara) quedan oscuros para que se lean. `look="original"` conserva
 * los materiales del CAD para poder compararlos.
 * Informa la posición del LiDAR para que salga de ahí el barrido.
 */
export default function RobotModel({
  look = "clay",
  onSensor,
}: {
  look?: RobotLook;
  onSensor?: (position: THREE.Vector3) => void;
}) {
  const { scene } = useGLTF(MODEL_URL, false);

  const { root, sensor, materials, edges } = useMemo(() => {
    const root = scene.clone(true);
    const materials: THREE.Material[] = [];
    const edges: THREE.BufferGeometry[] = [];
    const lidarBox = new THREE.Box3();
    const lines: [THREE.Mesh, THREE.LineSegments][] = [];

    const clay = new THREE.MeshStandardMaterial({
      color: CLAY,
      roughness: 0.92,
      metalness: 0,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: WALL,
      roughness: 0.6,
      metalness: 0,
      flatShading: true,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: WALL, transparent: true, opacity: 0.5 });
    materials.push(clay, dark, edgeMat);

    root.updateMatrixWorld(true);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const name = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).name;
      const isSensor = name === "Lidar_Black" || name === "Camera_Astra";
      if (name === "Lidar_Black") lidarBox.expandByObject(mesh);
      if (look === "clay") {
        mesh.material = isSensor ? dark : clay;
        const g = new THREE.EdgesGeometry(mesh.geometry, 38);
        edges.push(g);
        lines.push([mesh, new THREE.LineSegments(g, edgeMat)]);
      } else {
        (mesh.material as THREE.MeshStandardMaterial).flatShading = true;
        (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    });
    for (const [mesh, line] of lines) mesh.add(line);

    const sensor = lidarBox.isEmpty() ? new THREE.Vector3(0, 0.12, 0) : lidarBox.getCenter(new THREE.Vector3());
    return { root, sensor, materials, edges };
  }, [scene, look]);

  useEffect(() => {
    onSensor?.(sensor);
  }, [sensor, onSensor]);

  useEffect(
    () => () => {
      materials.forEach((m) => m.dispose());
      edges.forEach((g) => g.dispose());
    },
    [materials, edges],
  );

  return <primitive object={root} />;
}

useGLTF.preload(MODEL_URL, false);
