import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { sampleColors } from "./colors";

type Props = { progressRef: RefObject<number>; reducedMotion: boolean };

// A single morphing liquid-metal centerpiece pinned ahead of the camera.
// It slowly churns + rotates, and shifts color per section. The flight camera
// still moves, but the blob stays centered as the hero object.
export function LiquidBlob({ progressRef, reducedMotion }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const { camera } = useThree();

  const a = useMemo(() => new THREE.Color("#eb0a1e"), []);
  const b = useMemo(() => new THREE.Color(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    sampleColors(p, a, b);
    if (mat.current) {
      mat.current.color.lerp(a, 0.06);
      mat.current.emissive.lerp(b, 0.05);
    }
    if (mesh.current) {
      camera.getWorldDirection(dir);
      mesh.current.position.copy(camera.position).addScaledVector(dir, 7);
      if (!reducedMotion) {
        mesh.current.rotation.y += delta * 0.18;
        mesh.current.rotation.z = p * Math.PI * 0.6;
      }
    }
  });

  return (
    <mesh ref={mesh} scale={2.6}>
      <icosahedronGeometry args={[1, 16]} />
      <MeshDistortMaterial
        ref={mat as never}
        color="#eb0a1e"
        emissive="#240005"
        emissiveIntensity={0.6}
        metalness={0.6}
        roughness={0.16}
        speed={reducedMotion ? 0 : 2.2}
        distort={reducedMotion ? 0.1 : 0.42}
      />
    </mesh>
  );
}
