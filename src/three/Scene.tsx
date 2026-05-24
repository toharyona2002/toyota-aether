import { Suspense, type RefObject } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { Environment } from "@react-three/drei";
import { GradientBackground } from "./GradientBackground";
import { RoadScene } from "./RoadScene";

type Props = {
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  particleCount: number;
  bloomIntensity: number;
};

export function Scene({ progressRef, reducedMotion, bloomIntensity }: Props) {
  return (
    <>
      <color attach="background" args={["#08080a"]} />
      <fogExp2 attach="fog" args={["#05030f", 0.02]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 10, 8]} intensity={160} color="#ffffff" />
      <pointLight position={[-10, -6, 4]} intensity={120} color="#ff3344" />
      <pointLight position={[6, -8, -6]} intensity={90} color="#3b82f6" />

      {/* image-based reflections for the wet asphalt look */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      <GradientBackground progressRef={progressRef} />
      <RoadScene progressRef={progressRef} reducedMotion={reducedMotion} />

      <EffectComposer>
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.04}
          bokehScale={2.6}
          height={480}
        />
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.45}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0012, 0.0016)}
          radialModulation
          modulationOffset={0.3}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  );
}
