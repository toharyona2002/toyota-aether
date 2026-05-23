import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={done ? "loader done" : "loader"}>
      <div className="loader-mark">
        {["T", "O", "Y", "O", "T", "A"].map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="loader-he">טויוטה · MOBILITY FOR ALL</div>
      <div className="loader-bar" />
    </div>
  );
}
