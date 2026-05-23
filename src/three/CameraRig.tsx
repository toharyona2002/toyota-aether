import { useMemo, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { flightCurve, flight } from "./flightPath";

type Props = { progressRef: RefObject<number>; reducedMotion: boolean };

const BASE_FOV = 65;

export function CameraRig({ progressRef, reducedMotion }: Props) {
  const { camera } = useThree();

  const v = useMemo(
    () => ({
      target: new THREE.Vector3(),
      look: new THREE.Vector3(),
      lookStraight: new THREE.Vector3(),
      lookTangent: new THREE.Vector3(),
      tan: new THREE.Vector3(),
      tan2: new THREE.Vector3(),
      prev: new THREE.Vector3(0, 0, 0),
      up: new THREE.Vector3(0, 1, 0),
    }),
    [],
  );

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const ahead = Math.min(p + 0.02, 1);

    // position: follow the spline, damped for weight
    flightCurve.getPointAt(p, v.target);
    camera.position.lerp(v.target, 0.09);

    // flight intensity: 0 at the hero (calm, centered) → 1 once we're moving
    const f = THREE.MathUtils.smoothstep(p, 0.0, 0.12);

    // aim: straight ahead at the hero so the ring frames the wordmark dead-center,
    // easing into path-following aim during the flight
    flightCurve.getTangentAt(p, v.tan);
    v.lookStraight.copy(camera.position);
    v.lookStraight.z -= 14;
    v.lookTangent.copy(camera.position).addScaledVector(v.tan, 14);
    v.look.copy(v.lookStraight).lerp(v.lookTangent, f);

    if (reducedMotion) {
      camera.up.set(0, 1, 0);
      camera.lookAt(v.look);
      if (camera instanceof THREE.PerspectiveCamera && camera.fov !== BASE_FOV) {
        camera.fov = BASE_FOV;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const t = state.clock.elapsedTime;

    // bank into turns from the change in tangent direction (none at the hero)
    flightCurve.getTangentAt(ahead, v.tan2);
    const turn = v.tan2.x - v.tan.x;
    const targetRoll = THREE.MathUtils.clamp(-turn * 9, -0.6, 0.6) * f;
    flight.roll = THREE.MathUtils.lerp(flight.roll, targetRoll, 0.05);

    // floaty cockpit shake, ramped in with the flight so the hero stays still
    const shake = (0.1 + Math.min(flight.speed * 0.04, 0.5)) * f;
    v.look.x += Math.sin(t * 2.1) * shake + Math.sin(t * 0.7) * 0.4 * f;
    v.look.y += Math.cos(t * 1.7) * shake + Math.cos(t * 0.5) * 0.3 * f;

    // apply roll via the up vector, then aim
    v.up.set(Math.sin(flight.roll), Math.cos(flight.roll), 0);
    camera.up.copy(v.up);
    camera.lookAt(v.look);

    // measure speed (damped) for the FX layer + FOV punch
    const sp = camera.position.distanceTo(v.prev) / Math.max(delta, 0.0001);
    v.prev.copy(camera.position);
    flight.speed = THREE.MathUtils.lerp(flight.speed, sp, 0.12);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = BASE_FOV + Math.min(flight.speed * 0.5, 16);
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.08);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
