import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./three/Scene";
import { Overlay } from "./ui/Overlay";
import { Loader } from "./ui/Loader";
import { Overlays } from "./ui/Overlays";
import { Cursor } from "./ui/Cursor";
import { sections, FIRST_Z } from "./data/sections";
import { useScrollProgress, prefersReducedMotion } from "./scroll/useScrollProgress";
import { useSectionNav } from "./scroll/useSectionNav";

export default function App() {
  const { progressRef, activeIndex } = useScrollProgress();
  const { sweep, inIndex, goTo } = useSectionNav({ activeIndex });

  const { isMobile, reducedMotion } = useMemo(
    () => ({
      isMobile: typeof window !== "undefined" && window.innerWidth < 768,
      reducedMotion: prefersReducedMotion(),
    }),
    [],
  );

  const particleCount = isMobile ? 1200 : 3000;
  const bloomIntensity = isMobile ? 0.7 : 1.1;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 1.75];

  return (
    <>
      <Loader />

      <div className="canvas-wrap">
        <Canvas
          dpr={dpr}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, FIRST_Z], fov: 65, near: 0.1, far: 400 }}
        >
          <Scene
            progressRef={progressRef}
            reducedMotion={reducedMotion}
            particleCount={particleCount}
            bloomIntensity={bloomIntensity}
          />
        </Canvas>
      </div>

      <Overlays />
      <Cursor />

      <Overlay
        progressRef={progressRef}
        activeIndex={activeIndex}
        inIndex={inIndex}
        sweep={sweep}
        goTo={goTo}
      />

      <div
        className="scroll-spacer"
        style={{ height: `${sections.length * 100}vh` }}
      />
    </>
  );
}
