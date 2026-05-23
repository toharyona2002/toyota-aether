import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sections } from "../data/sections";
import { stationU } from "../three/flightPath";

type Props = { progressRef: RefObject<number>; stationIndex: number };

// Toyota-logo-inspired wireframe tori, reprised as a 3D motif at the
// hero and contact stations. Fades in by scroll proximity to its station.
export function ToyotaLogo({ progressRef, stationIndex }: Props) {
  const group = useRef<THREE.Group>(null);
  const matRed = useRef<THREE.MeshBasicMaterial>(null);
  const matInk = useRef<THREE.MeshBasicMaterial>(null);

  const s = sections[stationIndex];
  const center = stationU[stationIndex];
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    const prox = THREE.MathUtils.clamp(1 - Math.abs(p - center) / 0.1, 0, 1);
    if (matRed.current) matRed.current.opacity = prox * 0.8;
    if (matInk.current) matInk.current.opacity = prox * 0.32;
    if (group.current && !reduced) {
      group.current.rotation.y =
        state.clock.elapsedTime * 0.15 + stationIndex;
      group.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group ref={group} position={[s.x, s.y, s.z]} scale={3.1}>
      {/* outer ellipse (cream) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]}>
        <torusGeometry args={[2.6, 0.5, 16, 100]} />
        <meshBasicMaterial
          ref={matInk}
          color="#f4f1ec"
          wireframe
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      {/* inner ellipse (red) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.4, 1]}>
        <torusGeometry args={[1.1, 0.4, 16, 80]} />
        <meshBasicMaterial
          ref={matRed}
          color="#eb0a1e"
          wireframe
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      {/* horizontal band (cream) */}
      <mesh scale={[1, 0.25, 1]}>
        <torusGeometry args={[2.6, 0.35, 16, 100]} />
        <meshBasicMaterial
          color="#f4f1ec"
          wireframe
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
