import { sections } from "../data/sections";

type Props = { activeIndex: number; goTo: (i: number) => void };

export function SideDots({ activeIndex, goTo }: Props) {
  return (
    <div className="side-prog">
      {sections.map((s, i) => (
        <button
          key={s.id}
          className={i === activeIndex ? "dot active" : "dot"}
          data-label={s.dotLabel}
          aria-label={s.dotLabel}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}
