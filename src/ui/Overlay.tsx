import { type RefObject } from "react";
import { Nav } from "./Nav";
import { Counter } from "./Counter";
import { FrameLines } from "./FrameLines";
import { SideDots } from "./SideDots";
import { Sweep } from "./Sweep";
import { SectionsLayer } from "./SectionsLayer";
import { Marquee } from "./Marquee";
import type { SweepState } from "../scroll/useSectionNav";

const MARQUEE = ["TOYOTA", "MOBILITY FOR ALL", "モビリティ", "LET'S GO PLACES", "ハイブリッド"];

type Props = {
  progressRef: RefObject<number>;
  activeIndex: number;
  inIndex: number | null;
  sweep: SweepState;
  goTo: (i: number) => void;
};

export function Overlay({ progressRef, activeIndex, inIndex, sweep, goTo }: Props) {
  return (
    <>
      <Marquee className="top" items={MARQUEE} />
      <Marquee className="bottom" items={MARQUEE} reverse />

      <Nav goTo={goTo} />
      <FrameLines />
      <SideDots activeIndex={activeIndex} goTo={goTo} />
      <Counter activeIndex={activeIndex} />
      <Sweep sweep={sweep} />
      <div className="overlay">
        <SectionsLayer
          progressRef={progressRef}
          activeIndex={activeIndex}
          inIndex={inIndex}
        />
      </div>
    </>
  );
}
