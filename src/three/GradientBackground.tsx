import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gradientVertex, gradientFragment } from "../shaders/gradient";
import { sampleColors } from "./colors";

type Props = { progressRef: RefObject<number> };

export function GradientBackground({ progressRef }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uColorA: { value: new THREE.Color("#7c3aed") },
      uColorB: { value: new THREE.Color("#2563eb") },
      uAccent: { value: new THREE.Color("#22d3ee") },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    sampleColors(p, tmpA, tmpB);
    uniforms.uColorA.value.lerp(tmpA, 0.08);
    uniforms.uColorB.value.lerp(tmpB, 0.08);
    uniforms.uAccent.value.lerp(tmpB, 0.04);
    uniforms.uTime.value = state.clock.elapsedTime;

    if (mesh.current) {
      // pin the backdrop along the actual view direction (not world -z) so it
      // stays centered while the camera banks, drifts and widens its FOV
      camera.getWorldDirection(dir);
      mesh.current.position.copy(camera.position).addScaledVector(dir, 80);
      mesh.current.quaternion.copy(camera.quaternion);
    }

    // drive the fog color from the same palette for a cohesive depth fade
    const fog = state.scene.fog as THREE.FogExp2 | null;
    if (fog) fog.color.copy(uniforms.uColorA.value).multiplyScalar(0.32);
  });

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[900, 560]} />
      <shaderMaterial
        vertexShader={gradientVertex}
        fragmentShader={gradientFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
