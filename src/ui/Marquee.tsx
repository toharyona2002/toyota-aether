type Props = { items: string[]; reverse?: boolean; className?: string };

// infinite kinetic-typography ticker band (duplicated for a seamless loop)
export function Marquee({ items, reverse, className }: Props) {
  const row = items.join("  ·  ") + "  ·  ";
  return (
    <div className={`marquee ${className ?? ""}`} aria-hidden>
      <div className={reverse ? "marquee-track rev" : "marquee-track"}>
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}
