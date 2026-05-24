import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = { progressRef: RefObject<number>; reducedMotion: boolean };

const SPACING = 7; // distance between streaming markers (wrap period)
const COUNT = 64; // markers per row
const HALF = 3.7; // lane half-width
const LANE_FAR = -SPACING * COUNT;

// First-person night-drive: asphalt to the horizon, centre lane dashes and
// roadside light posts streaming toward the camera. Sky = gradient backdrop.
export function RoadScene({ progressRef, reducedMotion }: Props) {
  const stream = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const zs = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => -i * SPACING),
    [],
  );

  useEffect(() => {
    camera.position.set(0, 1.6, 8);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 72;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(0, 0.5, -30);
  }, [camera]);

  useFrame((state, delta) => {
    void progressRef;
    if (stream.current && !reducedMotion) {
      stream.current.position.z = (stream.current.position.z + delta * 42) % SPACING;
    }
    const t = state.clock.elapsedTime;
    camera.position.x = reducedMotion ? 0 : Math.sin(t * 0.25) * 0.35;
    camera.position.y = 1.6 + (reducedMotion ? 0 : Math.sin(t * 0.5) * 0.07);
    camera.lookAt(0, 0.5, -30);
  });

  return (
    <group>
      {/* asphalt */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, LANE_FAR / 2]}>
        <planeGeometry args={[44, -LANE_FAR + 60]} />
        <meshStandardMaterial color="#0b0b0e" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* continuous edge lines */}
      {[-HALF, HALF].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.01, LANE_FAR / 2]}>
          <planeGeometry args={[0.12, -LANE_FAR + 60]} />
          <meshBasicMaterial color="#dfe3ea" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}

      {/* streaming markers: centre dashes + side posts */}
      <group ref={stream}>
        {zs.map((z, i) => (
          <group key={i}>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, z]}>
              <planeGeometry args={[0.34, 3]} />
              <meshBasicMaterial color="#ffd24a" toneMapped={false} />
            </mesh>
            <mesh position={[-HALF - 1.6, 0.5, z]}>
              <boxGeometry args={[0.18, 1, 0.18]} />
              <meshBasicMaterial color="#eb0a1e" toneMapped={false} />
            </mesh>
            <mesh position={[HALF + 1.6, 0.5, z]}>
              <boxGeometry args={[0.18, 1, 0.18]} />
              <meshBasicMaterial color="#dfe3ea" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
