export type SectionKind =
  | "hero"
  | "manifesto"
  | "lineup"
  | "technology"
  | "stats"
  | "heritage"
  | "contact";

export type ModelSpec = { k: string; v: string };

export type Model = {
  id: string;
  name: string;
  he: string;
  cat: string;
  catHe: string;
  color: string;
  badge?: "EV" | "H₂" | "GR" | "NEW";
  image: string; // real photo (Wikimedia Commons, CC) — see attribution TODO
  specs: ModelSpec[];
};

// Current Toyota line-up (Israel + global flagships, MY2026).
// Photos: Wikimedia Commons (CC) — verify license/attribution before launch.
// Specs: well-known approximations — verify against toyota.co.il before launch.
export const models: Model[] = [
  { id: "aygox", name: "AYGO X", he: "אייגו X", cat: "CITY", catHe: "עירוני", color: "#22d3ee", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/2022_Toyota_Aygo_X_Edge_1.0_VVT-i_%28Front%29.jpg/330px-2022_Toyota_Aygo_X_Edge_1.0_VVT-i_%28Front%29.jpg", specs: [{ k: "ENGINE", v: "1.0L" }, { k: "SEGMENT", v: "A · City" }] },
  { id: "yaris", name: "YARIS", he: "יאריס", cat: "HYBRID HATCH", catHe: "האצ׳בק היברידי", color: "#38bdf8", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2020_Toyota_Yaris_Design_HEV_CVT_1.5_Front.jpg/330px-2020_Toyota_Yaris_Design_HEV_CVT_1.5_Front.jpg", specs: [{ k: "HYBRID", v: "1.5L" }, { k: "CO₂", v: "~90 g/km" }] },
  { id: "corolla", name: "COROLLA", he: "קורולה", cat: "THE ICON", catHe: "האייקון", color: "#d4d4d8", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/330px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg", specs: [{ k: "SOLD", v: "50M+" }, { k: "HYBRID", v: "1.8L" }] },
  { id: "corollacross", name: "COROLLA CROSS", he: "קורולה קרוס", cat: "CROSSOVER", catHe: "קרוסאובר", color: "#a3a3a3", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg", specs: [{ k: "POWER", v: "197 hp" }, { k: "DRIVE", v: "AWD-i" }] },
  { id: "yariscross", name: "YARIS CROSS", he: "יאריס קרוס", cat: "COMPACT SUV", catHe: "קרוסאובר קומפקטי", color: "#34d399", badge: "NEW", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg/330px-Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg", specs: [{ k: "HYBRID", v: "1.5L" }, { k: "YEAR", v: "2026" }] },
  { id: "chr", name: "C-HR", he: "C-HR", cat: "COUPE CROSSOVER", catHe: "קרוסאובר קופה", color: "#f472b6", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Toyota_C-HR_Hybrid_%28AX20%29_DSC_7239.jpg/330px-Toyota_C-HR_Hybrid_%28AX20%29_DSC_7239.jpg", specs: [{ k: "HYBRID", v: "2.0L" }, { k: "POWER", v: "197 hp" }] },
  { id: "chrplus", name: "C-HR+", he: "C-HR+ חשמלי", cat: "FULLY ELECTRIC", catHe: "חשמלי מלא", color: "#eb0a1e", badge: "EV", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Toyota_C-HR%2B_Teamplayer_%E2%80%93_f_05042026.jpg/330px-Toyota_C-HR%2B_Teamplayer_%E2%80%93_f_05042026.jpg", specs: [{ k: "RANGE", v: "600 km" }, { k: "POWER", v: "338 hp" }, { k: "0–100", v: "~5s" }] },
  { id: "rav4", name: "RAV4", he: "ראב4", cat: "NEW · GEN 8", catHe: "דור 8", color: "#f59e0b", badge: "NEW", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Toyota_RAV4_XLE_%28facelift%29_%28front%29.jpg/330px-Toyota_RAV4_XLE_%28facelift%29_%28front%29.jpg", specs: [{ k: "POWER", v: "302 hp" }, { k: "DRIVE", v: "AWD-i" }, { k: "TYPE", v: "HEV/PHEV" }] },
  { id: "highlander", name: "HIGHLANDER", he: "היילנדר", cat: "3-ROW SUV", catHe: "7 מקומות", color: "#fb923c", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Toyota_Highlander_Hybrid_%28XU70%29_1X7A6356.jpg/330px-Toyota_Highlander_Hybrid_%28XU70%29_1X7A6356.jpg", specs: [{ k: "SEATS", v: "7" }, { k: "HYBRID", v: "2.5L" }] },
  { id: "landcruiser", name: "LAND CRUISER", he: "לנד קרוזר", cat: "THE LEGEND", catHe: "אגדת השטח", color: "#b45309", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg/330px-2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg", specs: [{ k: "SINCE", v: "1951" }, { k: "TORQUE", v: "700 Nm" }, { k: "4×4", v: "Full" }] },
  { id: "bz4x", name: "bZ4X", he: "bZ4X", cat: "ELECTRIC SUV", catHe: "SUV חשמלי", color: "#0ea5e9", badge: "EV", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Toyota_bZ4X_Automesse_Ludwigsburg_2022_1X7A5895.jpg/330px-Toyota_bZ4X_Automesse_Ludwigsburg_2022_1X7A5895.jpg", specs: [{ k: "RANGE", v: "~500 km" }, { k: "DRIVE", v: "AWD" }] },
  { id: "mirai", name: "MIRAI", he: "מיראי", cat: "HYDROGEN", catHe: "מימן", color: "#3b82f6", badge: "H₂", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Toyota_Mirai_%28JPD20%29_IMG_5303.jpg/330px-Toyota_Mirai_%28JPD20%29_IMG_5303.jpg", specs: [{ k: "RANGE", v: "650 km" }, { k: "REFUEL", v: "5 min" }, { k: "EMISSION", v: "H₂O" }] },
  { id: "camry", name: "CAMRY", he: "קאמרי", cat: "HYBRID SEDAN", catHe: "סדאן היברידי", color: "#94a3b8", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg", specs: [{ k: "GEN", v: "9th" }, { k: "HYBRID", v: "2.5L" }] },
  { id: "prius", name: "PRIUS", he: "פריוס", cat: "THE PIONEER", catHe: "החלוץ", color: "#10b981", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/2024_Toyota_Prius_Excel_PHEV_-_1987cc_2.0_%28225PS%29_Plug-in_Hybrid_-_Silver_Metallic_-_10-2024%2C_Front_Quarter.jpg/330px-2024_Toyota_Prius_Excel_PHEV_-_1987cc_2.0_%28225PS%29_Plug-in_Hybrid_-_Silver_Metallic_-_10-2024%2C_Front_Quarter.jpg", specs: [{ k: "SINCE", v: "1997" }, { k: "PHEV", v: "~70 km EV" }] },
  { id: "hilux", name: "HILUX", he: "היילקס", cat: "PICKUP", catHe: "טנדר", color: "#a8a29e", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg", specs: [{ k: "4×4", v: "Legend" }, { k: "TOW", v: "3.5t" }] },
  { id: "gryaris", name: "GR YARIS", he: "GR יאריס", cat: "HOT HATCH", catHe: "האצ׳בק חם", color: "#ef4444", badge: "GR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Toyota_GR_Yaris_%28XP21%29_%E2%80%93_f_03052021.jpg/330px-Toyota_GR_Yaris_%28XP21%29_%E2%80%93_f_03052021.jpg", specs: [{ k: "POWER", v: "280 hp" }, { k: "0–100", v: "~5.2s" }, { k: "DRIVE", v: "GR-4 AWD" }] },
  { id: "grsupra", name: "GR SUPRA", he: "GR סופרה", cat: "FINAL EDITION", catHe: "מהדורה אחרונה", color: "#eb0a1e", badge: "GR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/2025_Toyota_GR_Supra_3.0_front.jpg/330px-2025_Toyota_GR_Supra_3.0_front.jpg", specs: [{ k: "0–100", v: "4.1s" }, { k: "TOP", v: "250 km/h" }, { k: "EDITION", v: "Final" }] },
  { id: "gr86", name: "GR86", he: "GR86", cat: "PURE COUPE", catHe: "קופה טהור", color: "#dc2626", badge: "GR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/2022_Toyota_GR86_Premium_in_Halo%2C_Front_Right%2C_04-10-2022.jpg/330px-2022_Toyota_GR86_Premium_in_Halo%2C_Front_Right%2C_04-10-2022.jpg", specs: [{ k: "LAYOUT", v: "RWD" }, { k: "ENGINE", v: "2.4L" }] },
];

export type Section = {
  id: string;
  index: number;
  kind: SectionKind;
  dotLabel: string;
  counterLabel: string;
  sweepSub: string;
  colorA: string;
  colorB: string;
  x: number;
  y: number;
  z: number;
};

const SPACING = 46;

type Raw = Omit<Section, "index" | "z" | "x" | "y">;

const raw: Raw[] = [
  { id: "hero", kind: "hero", dotLabel: "HERO", counterLabel: "MOBILITY FOR ALL", sweepSub: "HERO", colorA: "#EB0A1E", colorB: "#141414" },
  { id: "manifesto", kind: "manifesto", dotLabel: "MANIFESTO", counterLabel: "MANIFESTO · מניפסט", sweepSub: "MANIFESTO · מניפסט", colorA: "#EB0A1E", colorB: "#1c1c1c" },
  { id: "lineup", kind: "lineup", dotLabel: "TOP", counterLabel: "BEST SELLERS · הנמכרים בישראל", sweepSub: "BEST SELLERS · הנמכרים בישראל", colorA: "#d4d4d8", colorB: "#18181b" },
  { id: "technology", kind: "technology", dotLabel: "TECH", counterLabel: "TECHNOLOGY · טכנולוגיה", sweepSub: "TECHNOLOGY · טכנולוגיה", colorA: "#3b82f6", colorB: "#0f172a" },
  { id: "stats", kind: "stats", dotLabel: "NUMBERS", counterLabel: "BY THE NUMBERS · במספרים", sweepSub: "BY THE NUMBERS · במספרים", colorA: "#38bdf8", colorB: "#0b1220" },
  { id: "heritage", kind: "heritage", dotLabel: "HERITAGE", counterLabel: "HERITAGE · מורשת", sweepSub: "HERITAGE · מורשת", colorA: "#EB0A1E", colorB: "#7f1d1d" },
  { id: "contact", kind: "contact", dotLabel: "CONTACT", counterLabel: "CONTACT · צור קשר", sweepSub: "CONTACT · צור קשר", colorA: "#EB0A1E", colorB: "#141414" },
];

const lastIdx = raw.length - 1;

export const sections: Section[] = raw.map((s, i) => {
  const edge = i === 0 || i === lastIdx;
  return {
    ...s,
    index: i,
    x: edge ? 0 : Math.round(Math.sin(i * 1.7) * 16),
    y: edge ? 0 : Math.round(Math.cos(i * 1.3) * 9),
    z: -i * SPACING,
  };
});

export const STATION_SPACING = SPACING;
export const CAMERA_OFFSET = 13;
export const FIRST_Z = sections[0].z + CAMERA_OFFSET;
export const LAST_Z = sections[sections.length - 1].z + CAMERA_OFFSET;

/* ---------------- content for the fixed sections ---------------- */

export const hero = {
  tag: "EST. 1937 · KIICHIRO TOYODA",
  titleHtml: "MOBILITY<br><em>FOR</em><br>ALL.",
  he: "תנועה לכולם · מעבר לדרך",
  sub: "For nearly nine decades, Toyota has built more than vehicles — we've engineered the future of how the world moves.",
};

export const manifesto = {
  labelHe: "פילוסופיה",
  kaizen: "KAIZEN · 改善",
  textHtml:
    "We don't just build cars. We build <em>trust</em>, kilometer after kilometer. Every line on the board exists for one idea — <em>better tomorrow.</em>",
  sub: "The Toyota Production System redefined how the world manufactures. Continuous improvement — kaizen — isn't a slogan. It's how every bolt, every weld, every line of code in tomorrow's mobility is born.",
};

export type TechIcon = "bolt" | "battery" | "drop";
export type TechCard = {
  num: string;
  icon: TechIcon;
  name: string;
  he: string;
  desc: string;
  statValue: string;
  statLabel: string;
};

export const techCards: TechCard[] = [
  { num: "/ 01", icon: "bolt", name: "HYBRID", he: "היברידי", desc: "The technology that started a revolution. 25M+ Toyota hybrids on roads worldwide.", statValue: "25M+", statLabel: "SINCE 1997" },
  { num: "/ 02", icon: "battery", name: "EV", he: "חשמלי", desc: "Pure-electric on the bZ platform. Solid-state batteries arriving 2027.", statValue: "600km", statLabel: "C-HR+ RANGE" },
  { num: "/ 03", icon: "drop", name: "HYDROGEN", he: "מימן", desc: "Fuel cell electric. Refuel in five minutes. The only emission: pure water.", statValue: "H₂O", statLabel: "ONLY EMISSION" },
];

export const technology = {
  titleHtml: "THREE PATHS<br>ONE FUTURE.",
  introHe: "אנחנו לא בוחרים דרך אחת אל האפס פליטות. אנחנו בונים כמה — כי לכל מקום בעולם יש את ההתחלה שלו.",
};

export type HeritageItem = { year: string; evt: string; desc: string; he: string };

export const heritage = {
  titleHtml: "89 YEARS<br>IN MOTION.",
  introHe: "מ-1937 ועד היום, טויוטה לא הפסיקה לנוע — להמציא מחדש את הדרך ואת המשמעות של אמינות.",
  items: [
    { year: "1937", evt: "FOUNDED", desc: "Kiichiro Toyoda spins off Toyota Motor Co.", he: "הקמת חברת הרכב" },
    { year: "1957", evt: "GOES GLOBAL", desc: "First Japanese car exported to USA.", he: "הקראון מיוצא לארה״ב" },
    { year: "1966", evt: "COROLLA BORN", desc: "The best-selling nameplate begins.", he: "לידת הקורולה" },
    { year: "1997", evt: "PRIUS", desc: "The world's first mass-produced hybrid.", he: "ההיברידי הראשון" },
    { year: "2014", evt: "MIRAI", desc: "First commercial hydrogen fuel-cell.", he: "הרכב הראשון על מימן" },
    { year: "2026", evt: "C-HR+", desc: "Next-gen EV launches in Israel.", he: "החשמלי החדש בישראל" },
  ] as HeritageItem[],
};

export const contact = {
  titleHtml: "YOUR <em>NEXT</em><br>MOVE.",
  he: "קח את הצעד הבא · הזמן נסיעת מבחן",
  primary: "Book Test Drive →",
  secondary: "Explore Lineup",
  footLeft: "© 2026 TOYOTA · ALL RIGHTS RESERVED",
  footRight: "MADE WITH 改善 · KAIZEN",
};

// Toyota's best-selling models in Israel (2025) shown in the LINEUP grid.
export const lineupIds = ["yaris", "yariscross", "rav4", "corolla", "chr", "landcruiser"];
export const lineupModels = lineupIds
  .map((id) => models.find((m) => m.id === id))
  .filter((m): m is Model => Boolean(m));

export const lineup = {
  titleHtml: "BEST<br>SELLERS.",
  he: "הנמכרים ביותר בישראל · 2025",
  count: `${lineupIds.length}`,
};

export type Stat = { value: string; en: string; he: string };

// Toyota by the numbers — approximate, verify before launch.
export const stats = {
  titleHtml: "BY THE<br>NUMBERS.",
  introHe: "כמעט תשעה עשורים של תנועה — בכמה מספרים.",
  items: [
    { value: "1937", en: "FOUNDED", he: "שנת ייסוד" },
    { value: "300M+", en: "VEHICLES BUILT", he: "רכבים יוצרו" },
    { value: "170+", en: "COUNTRIES", he: "מדינות ושווקים" },
    { value: "27M+", en: "HYBRIDS SOLD", he: "היברידים נמכרו" },
    { value: "#1", en: "GLOBAL AUTOMAKER", he: "יצרנית הרכב הגדולה בעולם" },
    { value: "10M+", en: "CARS / YEAR", he: "רכבים בשנה" },
  ] as Stat[],
};
