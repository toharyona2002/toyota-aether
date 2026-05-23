import { useEffect, useMemo, useRef, type RefObject } from "react";
import { models } from "../data/sections";

type Props = { progressRef: RefObject<number> };

const rand = (seed: number) => Math.abs((Math.sin(seed) * 43758.5453) % 1);

export function FloatingCars({ progressRef }: Props) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const layout = useMemo(
    () =>
      models.map((_, i) => {
        const n = models.length;
        const trigger = 0.07 + (i / (n - 1)) * 0.86;
        const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
        const r1 = rand(i * 12.9898);
        const r2 = rand(i * 78.233 + 1);
        return {
          trigger,
          side,
          edgeVw: 3 + r1 * 14, // distance from the screen edge
          topVh: 12 + r2 * 58,
          rot: (r1 - 0.5) * 8,
          scale: 0.9 + r2 * 0.18,
        };
      }),
    [],
  );

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current ?? 0;
      for (let i = 0; i < models.length; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const L = layout[i];
        const d = Math.abs(p - L.trigger);
        let o = 1 - (d - 0.012) / (0.05 - 0.012);
        o = Math.max(0, Math.min(1, o));
        el.style.opacity = String(o);
        el.style.visibility = o <= 0.001 ? "hidden" : "visible";
        const ty = (1 - o) * 34 * (p < L.trigger ? 1 : -1);
        el.style.transform = `translateY(${ty}px) rotate(${L.rot}deg) scale(${L.scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, layout]);

  return (
    <div className="floating-layer" aria-hidden>
      {models.map((m, i) => {
        const L = layout[i];
        const pos =
          L.side === "left"
            ? { left: `${L.edgeVw}vw` }
            : { right: `${L.edgeVw}vw` };
        return (
          <div
            key={m.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="float-card"
            style={{ ...pos, top: `${L.topVh}vh`, ["--accent" as string]: m.color, opacity: 0 }}
          >
            <div className="float-img">
              <img src={m.image} alt={m.name} />
              {m.badge && <span className="float-badge">{m.badge}</span>}
            </div>
            <div className="float-meta">
              <div className="float-name">{m.name}</div>
              <div className="float-he">{m.he}</div>
              <div className="float-specs">
                {m.specs.slice(0, 2).map((s, k) => (
                  <span key={k}>
                    {s.k} <strong>{s.v}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
