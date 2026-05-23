import { sections } from "../data/sections";

type Props = { activeIndex: number };

export function Counter({ activeIndex }: Props) {
  const s = sections[activeIndex] ?? sections[0];
  const num = String(activeIndex + 1).padStart(2, "0");
  const total = String(sections.length).padStart(2, "0");
  return (
    <div className="counter">
      <div className="counter-num">{num}</div>
      <div className="counter-divider">/</div>
      <div className="counter-total">{total}</div>
      <div className="counter-label">{s.counterLabel}</div>
    </div>
  );
}
