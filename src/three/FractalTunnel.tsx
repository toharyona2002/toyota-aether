import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleColors } from "./colors";
import { pointer } from "../lib/pointer";

type Props = { progressRef: RefObject<number>; reducedMotion: boolean };

const vert = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uMouse;

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    uv += (uMouse - 0.5) * 0.45;   // cursor warps the tunnel
    float a = atan(uv.y, uv.x);
    float r = length(uv);

    // infinite tunnel: depth flows with time + scroll
    float depth = 0.34 / (r + 0.07) + uTime * 0.22 + uProgress * 4.0;
    vec2 t = vec2(a / 3.14159265, depth);

    // kaleidoscopic (Kali) fractal on the tunnel surface
    vec2 c = t * 1.6;
    float m = 1000.0;
    for (int i = 0; i < 7; i++) {
      c = abs(c) / dot(c, c) - vec2(0.92, 0.64 + 0.10 * sin(uTime * 0.2));
      m = min(m, length(c));
    }
    float glow = exp(-m * 3.2);
    float bands = 0.5 + 0.5 * sin(t.y * 6.2831 + m * 7.0);

    vec3 col = mix(uColorA * 0.5, uColorB, bands);
    col += uColorA * glow * 1.6;
    col += uColorB * exp(-r * 4.5) * 0.8;       // bright far end of tunnel
    col *= 1.0 - 0.55 * r;                       // vignette toward edges
    col = max(col, 0.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function FractalTunnel({ progressRef, reducedMotion }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, size, gl } = useThree();

  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#eb0a1e") },
      uColorB: { value: new THREE.Color("#1a1030") },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    sampleColors(p, tmpA, tmpB);
    uniforms.uColorA.value.lerp(tmpA, 0.06);
    uniforms.uColorB.value.lerp(tmpB, 0.06);
    if (!reducedMotion) uniforms.uTime.value += delta;
    uniforms.uProgress.value += (p - uniforms.uProgress.value) * 0.08;
    const dpr = gl.getPixelRatio();
    uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    uniforms.uMouse.value.lerp(
      { x: pointer.x, y: 1 - pointer.y } as THREE.Vector2,
      0.06,
    );

    if (mesh.current) {
      camera.getWorldDirection(dir);
      mesh.current.position.copy(camera.position).addScaledVector(dir, 10);
      mesh.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[80, 80]} />
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
