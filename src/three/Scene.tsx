import { type RefObject } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { GradientBackground } from "./GradientBackground";
import { Tunnel } from "./Tunnel";
import { Station } from "./Station";
import { CameraRig } from "./CameraRig";
import { ToyotaLogo } from "./ToyotaLogo";
import { sections } from "../data/sections";

type Props = {
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  particleCount: number;
  bloomIntensity: number;
};

export function Scene({
  progressRef,
  reducedMotion,
  particleCount,
  bloomIntensity,
}: Props) {
  return (
    <>
      <color attach="background" args={["#08080a"]} />
      <fogExp2 attach="fog" args={["#05030f", 0.019]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={120} color="#a78bfa" />
      <pointLight position={[-10, -8, -20]} intensity={120} color="#22d3ee" />

      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <GradientBackground progressRef={progressRef} />
      <Tunnel count={particleCount} reducedMotion={reducedMotion} />

      {sections.map((s) => (
        <Station key={s.id} section={s} reducedMotion={reducedMotion} />
      ))}

      {/* Toyota-logo motif at the hero and contact stations */}
      <ToyotaLogo progressRef={progressRef} stationIndex={0} />
      <ToyotaLogo progressRef={progressRef} stationIndex={sections.length - 1} />

      <EffectComposer>
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
        <Vignette eskil={false} offset={0.15} darkness={0.88} />
      </EffectComposer>
    </>
  );
}
