import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Section } from "../data/sections";

type Props = { section: Section; reducedMotion: boolean };

// Lightweight per-station portal (kept cheap — there are ~23 of them now).
export function Station({ section, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null);
  const shape = useRef<THREE.Mesh>(null);
  const seed = section.index * 1.7;

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime + seed;
    if (group.current) group.current.rotation.z = t * 0.05;
    if (shape.current) {
      shape.current.rotation.x = t * 0.4;
      shape.current.rotation.y = t * 0.3;
      shape.current.position.y = 4 + Math.sin(t) * 0.6;
    }
  });

  return (
    <group ref={group} position={[section.x, section.y, section.z]}>
      <mesh>
        <torusGeometry args={[7, 0.16, 12, 64]} />
        <meshBasicMaterial color={section.colorA} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[8.4, 0.05, 8, 64]} />
        <meshBasicMaterial
          color={section.colorB}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={shape} position={[0, 4, 0]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={section.colorA}
          emissive={section.colorA}
          emissiveIntensity={0.7}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}
