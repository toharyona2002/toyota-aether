import {
  hero,
  manifesto,
  lineup,
  lineupModels,
  technology,
  techCards,
  stats,
  heritage,
  contact,
  type TechIcon as TechIconKind,
} from "../data/sections";

function TechIcon({ icon }: { icon: TechIconKind }) {
  if (icon === "bolt")
    return (
      <svg viewBox="0 0 24 24">
        <path d="M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z" />
      </svg>
    );
  if (icon === "battery")
    return (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="8" width="14" height="10" rx="1" />
        <path d="M17 11 L21 11 L21 15 L17 15" />
        <line x1="6" y1="11" x2="6" y2="15" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2 C12 2 6 10 6 14 A6 6 0 0 0 18 14 C18 10 12 2 12 2 Z" />
    </svg>
  );
}

export function LineupView() {
  return (
    <>
      <div className="sec-mark stag d1">BEST SELLERS · הנמכרים בישראל</div>
      <div className="sec-inner">
        <div className="models-head stag d2">
          <div>
            <h2
              className="models-title"
              dangerouslySetInnerHTML={{ __html: lineup.titleHtml }}
            />
            <div className="models-title-he">{lineup.he}</div>
          </div>
          <div className="models-count">
            TOP <strong>{lineup.count}</strong> · ISRAEL 2025
          </div>
        </div>
        <div className="model-grid stag d3">
          {lineupModels.map((m) => (
            <div className="model" key={m.id}>
              <div className="model-top">
                <div className="model-year">{m.cat}</div>
                {m.badge && <span className="model-tag new">{m.badge}</span>}
              </div>
              <div>
                <div className="model-name">{m.name}</div>
                <div className="model-he">{m.he}</div>
                <div className="model-variants">
                  {(m.variants ?? []).map((v, i) => (
                    <div className="model-variant" key={i}>
                      <span className="mv-eng">{v.engine}</span>
                      <span className="mv-stats">
                        <b>{v.hp}</b> HP&nbsp;&nbsp;·&nbsp;&nbsp;<b>{v.zeroTo100}</b> 0–100
                      </span>
                      {v.label && <span className="mv-label">{v.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function StatsView() {
  return (
    <>
      <div className="sec-mark stag d1">BY THE NUMBERS · במספרים</div>
      <div className="sec-inner">
        <div className="tech-head stag d2">
          <h2
            className="tech-title"
            dangerouslySetInnerHTML={{ __html: stats.titleHtml }}
          />
          <p className="tech-sub-he">{stats.introHe}</p>
        </div>
        <div className="stats-grid stag d3">
          {stats.items.map((s, i) => (
            <div className="stat-cell" key={i}>
              <div className="stat-big">{s.value}</div>
              <div className="stat-en">{s.en}</div>
              <div className="stat-he">{s.he}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function HeroView() {
  return (
    <>
      <div className="sec-inner" style={{ textAlign: "center" }}>
        <div className="hero-tag stag d1">{hero.tag}</div>
        <h1
          className="hero-title stag d2"
          dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
        />
        <div className="hero-he stag d3">{hero.he}</div>
        <p className="hero-sub stag d4">{hero.sub}</p>
      </div>
      <div className="hero-scroll stag d5">SCROLL · גלול</div>
    </>
  );
}

export function ManifestoView() {
  return (
    <>
      <div className="sec-mark stag d1">MANIFESTO · מניפסט</div>
      <div className="sec-inner">
        <div className="mani-grid">
          <div className="mani-label stag d2">
            {manifesto.labelHe}
            <br />
            <span className="mani-kaizen">{manifesto.kaizen}</span>
          </div>
          <div>
            <h2
              className="mani-text stag d3"
              dangerouslySetInnerHTML={{ __html: manifesto.textHtml }}
            />
            <p className="mani-sub stag d4">{manifesto.sub}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function TechnologyView() {
  return (
    <>
      <div className="sec-mark stag d1">TECHNOLOGY · טכנולוגיה</div>
      <div className="sec-inner">
        <div className="tech-head stag d2">
          <h2
            className="tech-title"
            dangerouslySetInnerHTML={{ __html: technology.titleHtml }}
          />
          <p className="tech-sub-he">{technology.introHe}</p>
        </div>
        <div className="tech-grid stag d3">
          {techCards.map((c) => (
            <div className="tech-card" key={c.name}>
              <div className="tech-num">{c.num}</div>
              <div className="tech-icon">
                <TechIcon icon={c.icon} />
              </div>
              <div className="tech-name">{c.name}</div>
              <div className="tech-he">{c.he}</div>
              <p className="tech-desc">{c.desc}</p>
              <div className="tech-stat">
                <strong>{c.statValue}</strong>
                <span>{c.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function HeritageView() {
  return (
    <>
      <div className="sec-mark stag d1">HERITAGE · מורשת</div>
      <div className="sec-inner">
        <div className="her-head stag d2">
          <h2
            className="her-title"
            dangerouslySetInnerHTML={{ __html: heritage.titleHtml }}
          />
          <p className="her-intro">{heritage.introHe}</p>
        </div>
        <div className="timeline stag d3">
          {heritage.items.map((it) => (
            <div className="tl-cell" key={it.year}>
              <div>
                <div className="tl-year">{it.year}</div>
                <div className="tl-evt">{it.evt}</div>
              </div>
              <div>
                <div className="tl-desc">{it.desc}</div>
                <div className="tl-he">{it.he}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ContactView() {
  return (
    <>
      <div className="sec-mark stag d1">CONTACT · יצירת קשר</div>
      <div
        className="sec-inner"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
      >
        <div className="cta-block">
          <h2
            className="cta-title stag d2"
            dangerouslySetInnerHTML={{ __html: contact.titleHtml }}
          />
          <p className="cta-he stag d3">{contact.he}</p>
          <div className="cta-buttons stag d4">
            <a className="btn" href="#">
              {contact.primary} <span className="cta-arrow">→</span>
            </a>
            <a className="btn outline" href="#">
              {contact.secondary}
            </a>
          </div>
        </div>
        <div className="cta-foot stag d5">
          <div>{contact.footLeft}</div>
          <div>{contact.footRight}</div>
        </div>
      </div>
    </>
  );
}
