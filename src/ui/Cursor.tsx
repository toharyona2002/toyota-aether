import { useEffect, useRef } from "react";

// custom magnetic cursor: a lagging ring + a crisp dot; ring grows over
// interactive elements. Hidden on touch devices (see CSS).
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
    };
    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      const hot = !!el?.closest?.(
        "a,button,.dot,.model,.tech-card,.stat-cell,.tl-cell,.nav-link",
      );
      ring.current?.classList.toggle("hot", hot);
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    loop();
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
