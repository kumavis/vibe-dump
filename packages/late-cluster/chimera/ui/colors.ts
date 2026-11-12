/**
 * The vector-display palette (sampled from the NORAD screens in WarGames; see docs/mockups).
 * Blue is the body and structure, amber is sound, and green/red/pink/white are the four control
 * slots: each screen maps its own four controls onto them and draws what they move in the same
 * colour. CSS mirrors these as custom properties in styles.css.
 */
export const V = {
  blue: "#4fb6f2",
  blueMid: "#3487c4",
  blueDim: "#1f5f8c",
  frame: "#133954",
  green: "#5be381",
  red: "#ff5d40",
  pink: "#ff73cf",
  white: "#eef6f8",
  amber: "#ffb340",
};
/** the four control slots, in order */
export const SLOTS = [V.green, V.red, V.pink, V.white] as const;
/** brighter canvas text, kept separate from the vector line palette */
export const TEXT = {
  primary: "#effbff",
  secondary: "#e2f5fc",
} as const;

/** mix two #rrggbb colours */
export function mix(hex: string, to: string, u: number): string {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16);
  const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - u) + ((b >> s) & 255) * u);
  return "#" + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("");
}
/** the whitish core of a bright beam in this colour */
export const core = (hex: string): string => mix(hex, "#ffffff", 0.55);

const HEAT: [number, string][] = [[0, "#3a2408"], [0.35, "#c9822a"], [0.6, "#ffb340"], [0.82, "#ffe39a"], [1, "#fff8ec"]];
/** sound level 0..1 → dim amber → amber → pale yellow → white */
export function heat(level: number): string {
  const v = Math.max(0, Math.min(1, level));
  for (let i = 1; i < HEAT.length; i++) if (v <= HEAT[i][0]) return mix(HEAT[i - 1][1], HEAT[i][1], (v - HEAT[i - 1][0]) / (HEAT[i][0] - HEAT[i - 1][0]));
  return HEAT[HEAT.length - 1][1];
}

/**
 * Older tokens, remapped onto the vector palette so screens not yet redrawn in the new style
 * still sit on black in blue and amber.
 */
export const C = {
  black: "#000000",
  console: "#000000",
  inset: "#000000",
  line: V.frame,
  text: V.blue,
  textDim: V.blueMid,
  caliper: V.amber,
  caliperDim: "rgba(255, 179, 64, 0.45)",
  // MRI-like tissue intensities (T1-ish)
  fat: "#bdbdbd",
  skin: "#a8a8a8",
  muscle: "#5d5d5d",
  tongue: "#6b6b6b",
  brain: "#7c7c7c",
  marrow: "#b2b2b2",
  cortex: "#1c1c1c",
  cartilage: "#3e3e3e",
  mucosa: "#8f8f8f",
  tooth: "#101010",
};

/** fMRI-style "hot" scale for acoustic energy: black → red → orange → yellow → white. */
const HOT: [number, number, number, number][] = [
  [0.0, 0, 0, 0],
  [0.25, 138, 18, 0],
  [0.5, 240, 88, 28],
  [0.75, 255, 209, 92],
  [1.0, 255, 248, 230],
];

export function hot(t: number): [number, number, number] {
  if (!(t > 0)) return [0, 0, 0];
  if (t >= 1) return [255, 248, 230];
  for (let i = 1; i < HOT.length; i++) {
    if (t <= HOT[i][0]) {
      const a = HOT[i - 1], b = HOT[i];
      const u = (t - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
    }
  }
  return [255, 248, 230];
}

export const hotCss = (t: number, alpha = 1): string => {
  const [r, g, b] = hot(t);
  return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
};

/** Map acoustic pressure RMS (dyn/cm²) to 0..1 on a log scale. */
export const pressureLevel = (rms: number): number => {
  if (!(rms > 0)) return 0;
  const lo = Math.log10(40), hi = Math.log10(4000);
  return Math.max(0, Math.min(1, (Math.log10(rms) - lo) / (hi - lo)));
};
