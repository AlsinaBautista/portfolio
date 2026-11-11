"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Tokens
const VICTIMA = new THREE.Color("#e1262d");
const WALL = "#141615";

type Seg = [number, number, number, number]; // x1 z1 x2 z2

/** Un pedacito de laberinto bajo alrededor del robot (en metros, plano XZ). */
const MAZE: Seg[] = [
  // fondo y costados; el lado de la cámara queda abierto
  [-0.56, -0.56, 0.56, -0.56],
  [0.56, -0.56, 0.56, 0.22],
  [-0.56, 0.22, -0.56, -0.56],
  [-0.56, -0.18, -0.26, -0.18],
  [-0.26, -0.18, -0.26, 0.1],
  [0.26, -0.56, 0.26, -0.3],
  [0.26, -0.3, 0.44, -0.3],
  [0.56, 0.0, 0.36, 0.0],
  [0.36, 0.0, 0.36, 0.22],
  [-0.56, 0.22, -0.4, 0.22],
];

const FLOOR_Y = -0.0505;
const WALL_H = 0.045;

function raycast(ox: number, oz: number, dx: number, dz: number, max: number): number {
  let best = max;
  for (const [x1, z1, x2, z2] of MAZE) {
    const sx = x2 - x1;
    const sz = z2 - z1;
    const den = dx * sz - dz * sx;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - ox) * sz - (z1 - oz) * sx) / den;
    const u = ((x1 - ox) * dz - (z1 - oz) * dx) / den;
    if (t > 0.02 && t < best && u >= 0 && u <= 1) best = t;
  }
  return best;
}

const vert = /* glsl */ `
  attribute float aLife;
  varying float vLife;
  uniform float uSize;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(uSize / -mv.z, 2.0, 7.0) * step(0.001, aLife);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  uniform vec3 uColor;
  varying float vLife;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    if (dot(d, d) > 0.25) discard;
    gl_FragColor = vec4(uColor, vLife * 0.7);
  }
`;

/**
 * Barrido de LiDAR: un abanico de rayos sale del sensor, golpea las paredes bajas del laberinto y
 * deja puntos rojos tenues que se acumulan y se desvanecen, como si estuviera mapeando.
 */
export default function LidarSweep({
  sensor,
  mobile = false,
  active = true,
}: {
  sensor: THREE.Vector3;
  mobile?: boolean;
  active?: boolean;
}) {
  const MAX = mobile ? 420 : 1100;
  const FAN = mobile ? 14 : 26;
  const LIFE = 3.4;
  const state = useRef({ angle: 0, head: 0, acc: 0 });

  const points = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX * 3), 3));
    g.setAttribute("aLife", new THREE.BufferAttribute(new Float32Array(MAX), 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: VICTIMA }, uSize: { value: 9.0 } },
    });
    const p = new THREE.Points(g, m);
    p.frustumCulled = false;
    return p;
  }, [MAX]);

  const fan = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FAN * 2 * 3), 3));
    const m = new THREE.LineBasicMaterial({ color: VICTIMA, transparent: true, opacity: 0.16, depthWrite: false });
    const l = new THREE.LineSegments(g, m);
    l.frustumCulled = false;
    return l;
  }, [FAN]);

  const walls = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, WALL_H, 0.012);
    const mat = new THREE.MeshBasicMaterial({ color: WALL, transparent: true, opacity: 0.14 });
    const mesh = new THREE.InstancedMesh(geo, mat, MAZE.length);
    const o = new THREE.Object3D();
    MAZE.forEach(([x1, z1, x2, z2], i) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      o.position.set((x1 + x2) / 2, FLOOR_Y + WALL_H / 2, (z1 + z2) / 2);
      o.rotation.set(0, -Math.atan2(z2 - z1, x2 - x1), 0);
      o.scale.set(len, 1, 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, []);

  useEffect(
    () => () => {
      for (const o of [points, fan, walls]) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    },
    [points, fan, walls],
  );

  useFrame((_, dt) => {
    if (!active) return;
    const s = state.current;
    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const life = points.geometry.getAttribute("aLife") as THREE.BufferAttribute;
    const step = Math.min(dt, 0.05);

    for (let i = 0; i < MAX; i++) {
      const l = life.getX(i);
      if (l > 0) life.setX(i, Math.max(0, l - step / LIFE));
    }

    // El abanico gira; en cada cuadro se tiran varios rayos dentro de la cuña actual
    s.angle += step * 1.5;
    const wedge = 0.62;
    const rays = mobile ? 4 : 8;
    const ox = sensor.x;
    const oz = sensor.z;
    for (let k = 0; k < rays; k++) {
      const a = s.angle - Math.random() * wedge;
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      const t = raycast(ox, oz, dx, dz, 1.1);
      if (t < 1.1) {
        const i = s.head;
        s.head = (s.head + 1) % MAX;
        pos.setXYZ(i, ox + dx * t, FLOOR_Y + 0.004 + Math.random() * WALL_H, oz + dz * t);
        life.setX(i, 1);
      }
    }
    pos.needsUpdate = true;
    life.needsUpdate = true;

    const fp = fan.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let k = 0; k < FAN; k++) {
      const a = s.angle - (k / (FAN - 1)) * wedge;
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      const t = raycast(ox, oz, dx, dz, 1.1);
      fp.setXYZ(k * 2, ox, sensor.y, oz);
      fp.setXYZ(k * 2 + 1, ox + dx * t, FLOOR_Y + 0.02, oz + dz * t);
    }
    fp.needsUpdate = true;
  });

  return (
    <group>
      <primitive object={walls} />
      <primitive object={fan} />
      <primitive object={points} />
    </group>
  );
}
