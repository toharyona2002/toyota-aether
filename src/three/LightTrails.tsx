import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FIRST_Z, LAST_Z } from "../data/sections";

type Props = { count: number; reducedMotion: boolean };

// Night-highway light streaks: elongated additive line segments distributed in
// a tube along the flight path. They stream toward the camera for a long-exposure
// speed-trail feel; bloom turns them into glowing ribbons.
export function LightTrails({ count, reducedMotion }: Props) {
  const ref = useRef<THREE.LineSegments>(null);

  const zStart = FIRST_Z + 25;
  const zEnd = LAST_Z - 35;
  const span = zStart - zEnd;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    const red = new THREE.Color("#eb0a1e");
    const warm = new THREE.Color("#ffcaa0");
    const white = new THREE.Color("#ffffff");
    const cool = new THREE.Color("#cfe6ff");

    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 5 + Math.pow(Math.random(), 0.5) * 32;
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      const z = zStart - Math.random() * span;
      const len = 8 + Math.random() * 30;

      const o = i * 6;
      // tail (dim) -> head (bright) gives the comet/streak gradient
      positions[o] = x;
      positions[o + 1] = y;
      positions[o + 2] = z;
      positions[o + 3] = x;
      positions[o + 4] = y;
      positions[o + 5] = z + len;

      const r = Math.random();
      const c = r < 0.34 ? red : r < 0.46 ? warm : r < 0.6 ? cool : white;
      colors[o] = c.r * 0.05;
      colors[o + 1] = c.g * 0.05;
      colors[o + 2] = c.b * 0.05;
      colors[o + 3] = c.r;
      colors[o + 4] = c.g;
      colors[o + 5] = c.b;
    }
    return { positions, colors };
  }, [count, zStart, span]);

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    // continuous forward rush + slow roll, wrapped to stay seamless
    ref.current.position.z = (ref.current.position.z + delta * 30) % span;
    ref.current.rotation.z += delta * 0.012;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
