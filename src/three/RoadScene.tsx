import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = { progressRef: RefObject<number>; reducedMotion: boolean };

const SEG = 140; // ribbon samples along the road
const Z_NEAR = 14;
const Z_FAR = -480;
const LEN = Z_NEAR - Z_FAR;
const HALF = 3.7; // lane half-width
const SPACING = 7; // dash / post interval
const COUNT = 70;

// winding centre-line: x offset as a function of world-z and a flowing phase
function centerX(z: number, phase: number): number {
  return Math.sin(z * 0.011 + phase) * 5.2 + Math.sin(z * 0.027 + phase * 1.7) * 2.4;
}

// triangle index shared by every ribbon (SEG pairs of verts)
function buildIndex(): Uint16Array {
  const idx: number[] = [];
  for (let i = 0; i < SEG - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
    idx.push(a, c, b, b, c, d);
  }
  return new Uint16Array(idx);
}

export function RoadScene({ progressRef, reducedMotion }: Props) {
  const { camera } = useThree();
  const roadGeo = useRef<THREE.BufferGeometry>(null);
  const leftGeo = useRef<THREE.BufferGeometry>(null);
  const rightGeo = useRef<THREE.BufferGeometry>(null);
  const stream = useRef<THREE.Group>(null);
  const headlight = useRef<THREE.PointLight>(null);
  const phase = useRef(0);

  const index = useMemo(buildIndex, []);
  const roadPos = useMemo(() => new Float32Array(SEG * 2 * 3), []);
  const roadNor = useMemo(() => {
    const n = new Float32Array(SEG * 2 * 3);
    for (let i = 0; i < SEG * 2; i++) n[i * 3 + 1] = 1;
    return n;
  }, []);
  const leftPos = useMemo(() => new Float32Array(SEG * 2 * 3), []);
  const rightPos = useMemo(() => new Float32Array(SEG * 2 * 3), []);
  const dashZs = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => -i * SPACING),
    [],
  );

  // static UVs for the asphalt (u across, v along — tiled)
  const roadUv = useMemo(() => {
    const uv = new Float32Array(SEG * 2 * 2);
    for (let i = 0; i < SEG; i++) {
      const v = (i / (SEG - 1)) * 80;
      uv[i * 4] = 0;
      uv[i * 4 + 1] = v;
      uv[i * 4 + 2] = 6;
      uv[i * 4 + 3] = v;
    }
    return uv;
  }, []);

  // procedural asphalt grain → bump + roughness variation (wet/dry patches)
  const asphaltTex = useMemo(() => {
    const s = 256;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const v = 110 + Math.random() * 90;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((state, delta) => {
    void progressRef;
    if (!reducedMotion) phase.current += delta * 0.35;
    const ph = phase.current;

    if (stream.current) {
      if (!reducedMotion)
        stream.current.position.z = (stream.current.position.z + delta * 44) % SPACING;
      const sz = stream.current.position.z;
      for (const g of stream.current.children) {
        g.position.x = centerX(g.position.z + sz, ph);
      }
    }

    const rp = roadGeo.current?.attributes.position;
    const lp = leftGeo.current?.attributes.position;
    const wp = rightGeo.current?.attributes.position;
    for (let i = 0; i < SEG; i++) {
      const z = Z_NEAR - (i / (SEG - 1)) * LEN;
      const cx = centerX(z, ph);
      if (rp) {
        rp.setXYZ(i * 2, cx - HALF, 0, z);
        rp.setXYZ(i * 2 + 1, cx + HALF, 0, z);
      }
      if (lp) {
        lp.setXYZ(i * 2, cx - HALF - 0.08, 0.03, z);
        lp.setXYZ(i * 2 + 1, cx - HALF + 0.08, 0.03, z);
      }
      if (wp) {
        wp.setXYZ(i * 2, cx + HALF - 0.08, 0.03, z);
        wp.setXYZ(i * 2 + 1, cx + HALF + 0.08, 0.03, z);
      }
    }
    if (rp) rp.needsUpdate = true;
    if (lp) lp.needsUpdate = true;
    if (wp) wp.needsUpdate = true;

    const t = state.clock.elapsedTime;
    const camX = centerX(4, ph);
    const aheadX = centerX(-26, ph);
    const bank = THREE.MathUtils.clamp((aheadX - camX) * 0.03, -0.12, 0.12);
    camera.position.x = camX * 0.5 + (reducedMotion ? 0 : Math.sin(t * 0.4) * 0.15);
    camera.position.y = 1.6 + (reducedMotion ? 0 : Math.sin(t * 0.6) * 0.05);
    camera.position.z = 8;
    camera.up.set(Math.sin(bank), Math.cos(bank), 0);
    camera.lookAt(aheadX * 0.7, 0.5, -26);

    if (headlight.current) headlight.current.position.set(camX * 0.5, 1.2, 2);
  });

  return (
    <group>
      <pointLight ref={headlight} intensity={170} distance={75} decay={1.4} color="#fff4e8" />

      {/* asphalt */}
      <mesh frustumCulled={false}>
        <bufferGeometry ref={roadGeo}>
          <bufferAttribute attach="attributes-position" args={[roadPos, 3]} />
          <bufferAttribute attach="attributes-normal" args={[roadNor, 3]} />
          <bufferAttribute attach="attributes-uv" args={[roadUv, 2]} />
          <bufferAttribute attach="index" args={[index, 1]} />
        </bufferGeometry>
        <meshStandardMaterial
          color="#0a0a0d"
          roughness={0.42}
          metalness={0.55}
          bumpMap={asphaltTex}
          bumpScale={0.5}
          roughnessMap={asphaltTex}
          envMapIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* glowing edge ribbons */}
      <mesh frustumCulled={false}>
        <bufferGeometry ref={leftGeo}>
          <bufferAttribute attach="attributes-position" args={[leftPos, 3]} />
          <bufferAttribute attach="index" args={[index, 1]} />
        </bufferGeometry>
        <meshBasicMaterial color="#e6eaf0" transparent opacity={0.65} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh frustumCulled={false}>
        <bufferGeometry ref={rightGeo}>
          <bufferAttribute attach="attributes-position" args={[rightPos, 3]} />
          <bufferAttribute attach="index" args={[index, 1]} />
        </bufferGeometry>
        <meshBasicMaterial color="#e6eaf0" transparent opacity={0.65} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* streaming centre dashes + roadside posts (x set per frame) */}
      <group ref={stream}>
        {dashZs.map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]}>
              <planeGeometry args={[0.32, 3]} />
              <meshBasicMaterial color="#ffd24a" toneMapped={false} />
            </mesh>
            <mesh position={[-HALF - 1.5, 0.5, 0]}>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshBasicMaterial color="#eb0a1e" toneMapped={false} />
            </mesh>
            <mesh position={[HALF + 1.5, 0.5, 0]}>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshBasicMaterial color="#e6eaf0" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
