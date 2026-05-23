type Props = { goTo: (i: number) => void };

export function Nav({ goTo }: Props) {
  return (
    <nav className="nav">
      <div className="nav-logo" aria-label="Toyota">
        {/* placeholder logo — swap for the official Toyota asset */}
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="50" cy="30" rx="48" ry="28" />
          <ellipse cx="50" cy="30" rx="20" ry="28" />
          <ellipse cx="50" cy="30" rx="48" ry="10" />
        </svg>
        <span>TOYOTA</span>
      </div>
      <button className="nav-cta" onClick={() => goTo(5)}>
        Test Drive →
      </button>
    </nav>
  );
}
