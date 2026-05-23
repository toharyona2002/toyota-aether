import { useCallback, useEffect, useRef, useState } from "react";
import { sections } from "../data/sections";
import { stationU } from "../three/flightPath";

export type SweepState = {
  phase: "idle" | "active" | "retract";
  show: boolean;
  big: string;
  sub: string;
};

const pad = (n: number) => String(n + 1).padStart(2, "0");
const last = sections.length - 1;

type Args = { activeIndex: number };

export function useSectionNav({ activeIndex }: Args) {
  const [sweep, setSweep] = useState<SweepState>({
    phase: "idle",
    show: false,
    big: "",
    sub: "",
  });
  const [inIndex, setInIndex] = useState<number | null>(null);

  const animating = useRef(false);
  const gliding = useRef(false);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;
  const timers = useRef<number[]>([]);

  const scrollMax = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  // smooth, sweep-free glide to a section — used by keyboard so the flight
  // simply travels to the next stop without the cinematic panel/number wipe
  const glideTo = useCallback((idx: number) => {
    if (idx < 0 || idx > last) return;
    if (gliding.current || animating.current) return;
    const start = window.scrollY;
    const end = stationU[idx] * scrollMax();
    if (Math.abs(end - start) < 2) return;
    gliding.current = true;
    const dur = 750;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, start + (end - start) * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else gliding.current = false;
    };
    requestAnimationFrame(step);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (animating.current) return;
    if (idx < 0 || idx > last) return;
    if (idx === activeRef.current) return;
    animating.current = true;

    setSweep({ phase: "active", show: false, big: pad(idx), sub: sections[idx].sweepSub });

    // panels meet (~500ms) -> jump under cover + flash the giant number
    timers.current.push(
      window.setTimeout(() => {
        window.scrollTo(0, stationU[idx] * scrollMax());
        setSweep((s) => ({ ...s, show: true }));
      }, 500),
    );
    // hold, then open panels + play content stagger
    timers.current.push(
      window.setTimeout(() => {
        setSweep((s) => ({ ...s, phase: "retract", show: false }));
        setInIndex(idx);
      }, 1100),
    );
    // done
    timers.current.push(
      window.setTimeout(() => {
        setSweep({ phase: "idle", show: false, big: "", sub: "" });
        animating.current = false;
      }, 1900),
    );
    // clear one-shot stagger flag after it finishes
    timers.current.push(
      window.setTimeout(() => setInIndex(null), 3300),
    );
  }, []);

  // keyboard navigation: smooth glide (no sweep / no big number)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        glideTo(activeRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        glideTo(activeRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        glideTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        glideTo(last);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [glideTo]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  return { sweep, inIndex, goTo };
}
