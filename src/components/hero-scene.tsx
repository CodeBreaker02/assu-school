"use client";

import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./theme";

const COUNT = 190;
const TURNS = 3.25;
/** r = a·e^(bθ) — the same curve a regularly fed, compounding balance draws. */
const A = 0.14;
const B = 0.155;

/** Deterministic pseudo-random layout so every load looks identical. */
const COINS = (() => {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: COUNT }, (_, i) => {
    const t = i / (COUNT - 1);
    const theta = t * Math.PI * 2 * TURNS;
    const r = A * Math.exp(B * theta);
    return {
      theta,
      r,
      size: 0.05 + r * 0.07,
      phase: rand() * Math.PI * 2,
      spin: 0.25 + rand() * 0.9,
      tilt: (rand() - 0.5) * 0.9,
      delay: 0.25 + t * 1.8,
    };
  });
})();

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

function useCoinGeometry() {
  return useMemo(() => {
    // Profile of a minted coin: flat face, raised rim, rounded edge.
    const profile = [
      [0, 0.045],
      [0.74, 0.045],
      [0.8, 0.075],
      [0.97, 0.075],
      [1.0, 0.04],
      [1.0, -0.04],
      [0.97, -0.075],
      [0.8, -0.075],
      [0.74, -0.045],
      [0, -0.045],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(profile, 56);
    geo.rotateX(Math.PI / 2); // face the camera by default
    return geo;
  }, []);
}

function Spiral({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const geometry = useCoinGeometry();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport, pointer } = useThree();


  const wide = viewport.aspect > 1.15;

  useFrame(({ clock }, delta) => {
    const time = reduced ? 4 : clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / window.innerHeight;

    for (let i = 0; i < COUNT; i++) {
      const c = COINS[i];
      const appear = THREE.MathUtils.clamp((time - c.delay) / 0.9, 0, 1);
      const s = c.size * (appear === 0 ? 0 : easeOutBack(appear));
      const bob = Math.sin(time * 0.8 + c.phase) * 0.04;
      dummy.position.set(
        Math.cos(c.theta) * c.r,
        Math.sin(c.theta) * c.r,
        -c.r * 0.22 + bob + (1 - appear) * 2,
      );
      dummy.rotation.set(
        c.tilt + Math.sin(time * 0.5 + c.phase) * 0.25,
        time * c.spin + c.phase,
        c.theta,
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;

    const g = group.current;
    const damp = 1 - Math.pow(0.001, delta);
    g.rotation.z = -time * 0.06 - scroll * 0.9;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -0.35 + pointer.y * 0.22, damp * 0.5);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, (wide ? -0.35 : 0) + pointer.x * 0.3, damp * 0.5);
    const baseY = 0;
    g.position.y = THREE.MathUtils.lerp(g.position.y, baseY + scroll * 1.6, damp);
    const k = (wide ? 1 : 0.8) * (1 + scroll * 0.35);
    g.scale.set(k, k, k);
  });

  return (
    <group ref={group} position={[wide ? viewport.width * 0.27 : 0, 0, 0]}>
      <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} frustumCulled={false}>
        <meshStandardMaterial color="#efbf5a" metalness={1} roughness={0.24} envMapIntensity={1.2} />
      </instancedMesh>
      <pointLight position={[0, 0, 0.6]} intensity={6} distance={4} color="#ffcf7a" />
    </group>
  );
}

export default function HeroScene() {
  const theme = useTheme();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <fog key={theme} attach="fog" args={[theme === "light" ? "#f5efe3" : "#0a0907", 9, 17]} />
      <ambientLight intensity={theme === "light" ? 0.6 : 0.15} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} color="#fff3dc" />
      <Spiral reduced={reduced} />
      <Sparkles count={70} scale={[12, 7, 4]} size={2.2} speed={0.25} opacity={0.5} color="#f6d58e" />
      {/* Studio built from light panels — no HDR download, crisp reflections on the metal. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff1d6" position={[0, 4, 6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffb85c" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#e2603b" position={[6, -2, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[2, 3, 8]} scale={2} />
      </Environment>
    </Canvas>
  );
}
