import { type RefObject } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { FractalTunnel } from "./FractalTunnel";

type Props = {
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  particleCount: number;
  bloomIntensity: number;
};

export function Scene({ progressRef, reducedMotion, bloomIntensity }: Props) {
  return (
    <>
      <color attach="background" args={["#05030a"]} />

      <FractalTunnel progressRef={progressRef} reducedMotion={reducedMotion} />

      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0014, 0.0018)}
          radialModulation
          modulationOffset={0.3}
        />
        <Vignette eskil={false} offset={0.12} darkness={0.9} />
      </EffectComposer>
    </>
  );
}
