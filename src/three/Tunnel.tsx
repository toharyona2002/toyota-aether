import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { flightCurve, flight } from "./flightPath";

function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// build an orthonormal frame perpendicular to a tangent direction
function frame(tan: THREE.Vector3, n1: THREE.Vector3, n2: THREE.Vector3) {
  const up = Math.abs(tan.y) > 0.95 ? UPX : UPY;
  n1.crossVectors(tan, up).normalize();
  n2.crossVectors(tan, n1).normalize();
}
const UPY = new THREE.Vector3(0, 1, 0);
const UPX = new THREE.Vector3(1, 0, 0);

type Props = { count: number; reducedMotion: boolean };

export function Tunnel({ count, reducedMotion }: Props) {
  const stars = useRef<THREE.Points>(null);
  const starMat = useRef<THREE.PointsMaterial>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const nebula = useRef<THREE.Group>(null);
  const dotTexture = useMemo(makeDotTexture, []);

  // stars distributed in a tube that hugs the flight path
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const n1 = new THREE.Vector3();
    const n2 = new THREE.Vector3();
    const tint = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      flightCurve.getPointAt(u, base);
      flightCurve.getTangentAt(u, tan);
      frame(tan, n1, n2);
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.pow(Math.random(), 0.55) * 34;
      const px = base.x + (n1.x * Math.cos(a) + n2.x * Math.sin(a)) * r;
      const py = base.y + (n1.y * Math.cos(a) + n2.y * Math.sin(a)) * r;
      const pz = base.z + (n1.z * Math.cos(a) + n2.z * Math.sin(a)) * r;
      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // brand starfield: mostly cool white/silver with occasional red sparks
      if (Math.random() < 0.16) {
        tint.setHSL(0.0, 0.85, 0.55);
      } else {
        tint.setHSL(0.0, 0.0, 0.62 + Math.random() * 0.38);
      }
      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }
    return { positions, colors };
  }, [count]);

  // portal rings along the path — oriented so we fly straight through them
  const rings = useMemo(() => {
    const out: { pos: [number, number, number]; quat: [number, number, number, number]; tint: string }[] = [];
    const base = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const zAxis = new THREE.Vector3(0, 0, 1);
    const N = 40;
    const palette = ["#eb0a1e", "#3f3f46", "#d4d4d8", "#7f1d1d"];
    for (let i = 1; i < N; i++) {
      const u = i / N;
      flightCurve.getPointAt(u, base);
      flightCurve.getTangentAt(u, tan);
      q.setFromUnitVectors(zAxis, tan);
      out.push({
        pos: [base.x, base.y, base.z],
        quat: [q.x, q.y, q.z, q.w],
        tint: palette[i % palette.length],
      });
    }
    return out;
  }, []);

  // sparse nebula clouds for volumetric depth
  const clouds = useMemo(() => {
    const out: { pos: [number, number, number]; scale: number; tint: string }[] = [];
    const base = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const n1 = new THREE.Vector3();
    const n2 = new THREE.Vector3();
    const palette = ["#eb0a1e", "#1e293b", "#3b82f6", "#7f1d1d", "#52525b"];
    for (let i = 0; i < 9; i++) {
      const u = (i + 0.5) / 9;
      flightCurve.getPointAt(u, base);
      flightCurve.getTangentAt(u, tan);
      frame(tan, n1, n2);
      const a = Math.random() * Math.PI * 2;
      const r = 14 + Math.random() * 16;
      out.push({
        pos: [
          base.x + (n1.x * Math.cos(a) + n2.x * Math.sin(a)) * r,
          base.y + (n1.y * Math.cos(a) + n2.y * Math.sin(a)) * r,
          base.z + (n1.z * Math.cos(a) + n2.z * Math.sin(a)) * r,
        ],
        scale: 22 + Math.random() * 26,
        tint: palette[i % palette.length],
      });
    }
    return out;
  }, []);

  useFrame((state, delta) => {
    // speed-reactive star size → warp feel when scrubbing fast
    if (starMat.current) {
      const target = 0.5 + Math.min(flight.speed * 0.04, 1.8);
      starMat.current.size = THREE.MathUtils.lerp(
        starMat.current.size,
        target,
        0.1,
      );
    }
    if (reducedMotion) return;
    if (stars.current) stars.current.rotation.z += delta * 0.015;
    if (ringGroup.current) {
      const t = state.clock.elapsedTime;
      ringGroup.current.children.forEach((c, i) => {
        c.rotation.z = t * 0.12 + i;
      });
    }
    if (nebula.current) {
      nebula.current.children.forEach((c) => {
        const m = c as THREE.Mesh;
        m.lookAt(state.camera.position);
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.opacity =
          0.12 + Math.sin(state.clock.elapsedTime * 0.4 + m.position.x) * 0.05;
      });
    }
  });

  return (
    <group>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={starMat}
          size={0.55}
          map={dotTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <group ref={ringGroup}>
        {rings.map((r, i) => (
          <mesh key={i} position={r.pos} quaternion={r.quat}>
            <torusGeometry args={[24, 0.07, 8, 90]} />
            <meshBasicMaterial
              color={r.tint}
              transparent
              opacity={0.32}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      <group ref={nebula}>
        {clouds.map((c, i) => (
          <mesh key={i} position={c.pos} scale={c.scale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={dotTexture}
              color={c.tint}
              transparent
              opacity={0.12}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
