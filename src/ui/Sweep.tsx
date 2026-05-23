import type { SweepState } from "../scroll/useSectionNav";

type Props = { sweep: SweepState };

export function Sweep({ sweep }: Props) {
  const cls =
    sweep.phase === "active"
      ? "sweep active"
      : sweep.phase === "retract"
        ? "sweep retract"
        : "sweep";
  return (
    <>
      <div className={cls}>
        <div className="sweep-panel" />
        <div className="sweep-panel" />
      </div>
      <div className={sweep.show ? "sweep-center show" : "sweep-center"}>
        <div className="big">
          {sweep.big}
          <small>{sweep.sub}</small>
        </div>
      </div>
    </>
  );
}
