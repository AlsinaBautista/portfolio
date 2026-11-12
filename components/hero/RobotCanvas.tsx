"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import RobotModel, { type RobotLook } from "./RobotModel";
import LidarSweep from "./LidarSweep";

const BASE_POS = new THREE.Vector3(0.62, 0.46, 0.8);
const TOP_POS = new THREE.Vector3(0, 1.6, 0.0001);
const TARGET = new THREE.Vector3(0, 0.03, 0);

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** Cámara: parallax leve con el mouse y, al bajar del hero, sube a vista cenital. */
function Rig({ children, heroRef, mobile }: { children: React.ReactNode; heroRef: React.RefObject<HTMLElement | null>; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const look = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const hero = heroRef.current;
    const h = hero ? hero.offsetHeight : window.innerHeight;
    const p = smooth(Math.min(1, Math.max(0, window.scrollY / (h * 0.9))));

    state.camera.position.lerpVectors(BASE_POS, TOP_POS, p);
    look.current.copy(TARGET);
    state.camera.lookAt(look.current);

    const g = group.current;
    if (g) {
      const s = 1 - 0.42 * p;
      g.scale.setScalar(s);
      // parallax con el mouse (desactivado en táctil)
      const px = mobile ? 0 : state.pointer.x * 0.16 * (1 - p);
      const py = mobile ? 0 : state.pointer.y * 0.07 * (1 - p);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px, 4, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py, 4, dt);
    }
  });

  return <group ref={group}>{children}</group>;
}

export default function RobotCanvas({
  heroRef,
  visible,
  look = "clay",
  onReady,
  poster = false,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
  look?: RobotLook;
  onReady?: () => void;
  /** Para scripts/capture-poster.mjs: deja el buffer legible y congela un cuadro */
  poster?: boolean;
}) {
  const [sensor, setSensor] = useState<THREE.Vector3 | null>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px), (pointer: coarse)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const onSensor = useCallback((v: THREE.Vector3) => setSensor(v), []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={visible ? "always" : "demand"}
      camera={{ fov: 27, position: BASE_POS.toArray(), near: 0.05, far: 10 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: poster }}
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={["#ffffff", "#c9cbc6", 1.15]} />
      <directionalLight position={[1.4, 2.4, 1.2]} intensity={1.9} />
      <directionalLight position={[-1.6, 0.8, -1.2]} intensity={0.45} />
      <Rig heroRef={heroRef} mobile={mobile}>
        <PresentationControls
          global
          snap
          speed={1.3}
          zoom={1}
          polar={[-0.35, 0.35]}
          azimuth={[-Infinity, Infinity]}
        >
          <Suspense fallback={null}>
            <RobotModel look={look} onSensor={onSensor} />
          </Suspense>
        </PresentationControls>
        {sensor && <LidarSweep sensor={sensor} mobile={mobile} active={visible || poster} />}
        <ContactShadows position={[0, -0.0506, 0]} opacity={0.28} scale={1.6} blur={2.4} far={0.5} color="#141615" resolution={256} frames={1} />
      </Rig>
    </Canvas>
  );
}
