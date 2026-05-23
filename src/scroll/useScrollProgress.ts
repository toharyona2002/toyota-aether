import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nearestStation } from "../three/flightPath";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export type ScrollState = {
  progressRef: RefObject<number>;
  activeIndex: number;
};

export function useScrollProgress(): ScrollState {
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        const idx = nearestStation(p);
        if (idx !== lastIndex.current) {
          lastIndex.current = idx;
          setActiveIndex(idx);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return { progressRef, activeIndex };
}
