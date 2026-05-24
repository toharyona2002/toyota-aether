type Props = { goTo: (i: number) => void };

// section shortcuts (indices match data/sections.ts order)
const SHORTCUTS = [
  { label: "LINEUP", i: 2 },
  { label: "TECH", i: 3 },
  { label: "HERITAGE", i: 5 },
  { label: "CONTACT", i: 6 },
];

export function Nav({ goTo }: Props) {
  return (
    <nav className="nav">
      <button className="nav-logo-pill" onClick={() => goTo(0)} aria-label="Toyota — home">
        {/* placeholder mark — replace with the official Toyota logo asset */}
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2.5">
          <ellipse cx="50" cy="30" rx="48" ry="28" />
          <ellipse cx="50" cy="30" rx="20" ry="28" />
          <ellipse cx="50" cy="30" rx="48" ry="10" />
        </svg>
      </button>

      <div className="nav-pill">
        {SHORTCUTS.map((s) => (
          <button key={s.label} className="nav-link" onClick={() => goTo(s.i)}>
            {s.label}
          </button>
        ))}
        <button className="nav-cta" onClick={() => goTo(6)}>
          Test Drive <span className="cta-arrow">→</span>
        </button>
      </div>
    </nav>
  );
}
