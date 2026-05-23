import { useEffect, useRef, type RefObject } from "react";
import { sections, type Section } from "../data/sections";
import { stationU } from "../three/flightPath";
import {
  HeroView,
  ManifestoView,
  LineupView,
  TechnologyView,
  StatsView,
  HeritageView,
  ContactView,
} from "./SectionViews";

type Props = {
  progressRef: RefObject<number>;
  activeIndex: number;
  inIndex: number | null;
};

const INNER = 0.025;
const OUTER = 0.09;

function renderView(section: Section) {
  switch (section.kind) {
    case "hero":
      return <HeroView />;
    case "manifesto":
      return <ManifestoView />;
    case "lineup":
      return <LineupView />;
    case "technology":
      return <TechnologyView />;
    case "stats":
      return <StatsView />;
    case "heritage":
      return <HeritageView />;
    case "contact":
      return <ContactView />;
  }
}

export function SectionsLayer({ progressRef, activeIndex, inIndex }: Props) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current ?? 0;
      for (let i = 0; i < sections.length; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const center = stationU[i];
        const d = Math.abs(p - center);
        let o = 1 - (d - INNER) / (OUTER - INNER);
        o = Math.max(0, Math.min(1, o));
        el.style.opacity = String(o);
        el.style.visibility = o <= 0.001 ? "hidden" : "visible";
        const dir = p < center ? 1 : -1;
        el.style.transform = `translateY(${(1 - o) * 40 * dir}px) scale(${0.96 + 0.04 * o})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="content-layer">
      {sections.map((s, i) => {
        const cls = [
          "section",
          i === activeIndex ? "is-active" : "",
          i === inIndex ? "in" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <div
            key={s.id}
            className={cls}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            {renderView(s)}
          </div>
        );
      })}
    </div>
  );
}
