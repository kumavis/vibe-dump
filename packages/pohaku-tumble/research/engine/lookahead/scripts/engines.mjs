// Named engine configurations used by the final matrix and the ablation.
// Each is [la (chooseTurn engine, null = Jukugo's), extra CFG keys (deal / Director knobs)].
const LIVE = { live: { alpha: 1, cap: 8, dead: 0.05 } }
const FRESH = { fresh: { gamma: 1, cap: 6, dead: 0.2 } }
const REACH = { reach: { depth: 3, gamma: 1, cap: 40, dead: 0.1 } }
const SYM = { steer: { hi: 0.55, hiJoin: 0, hiBreak: 3 } }
const HIST = { softK: 6, softPen: 0.03, strict: true }
export const LA = { ...LIVE, ...HIST, fallback: true, ...FRESH, ...REACH, ...SYM }
export const LA_COOL = { ...LIVE, ...HIST, cool: 5, coolCredit: 0.5, ...FRESH, ...REACH, ...SYM }
// LA-min: what the ablation says carries the weight — history tiers, a return when stuck, the reach lookahead
export const LA_MIN = { ...HIST, fallback: true, ...REACH, ...SYM }
export const LA_MIN_COOL = { ...HIST, cool: 5, ...REACH, ...SYM }
export const DEAL = { dealComp: 12 }
export const ENGINES = {
  stock: [null, {}],                         // Jukugo's chooseTurn and deal, dealMin 1 so it deals
  'stock+deal': [null, DEAL],                // + component-aware deal only
  'LA-turn': [LA, {}],                       // lookahead chooseTurn only, Jukugo's deal (dealMin 1)
  LA: [LA, DEAL],                            // lookahead chooseTurn + component-aware deal
  'LA-cool5': [LA_COOL, DEAL],               // same, but a return to the previous word needs 5 turns' rest
  'stock+retry6': [null, { retry: 6 }],      // Director retries up to 6 other pairs on a null
  'LA+retry6': [LA, { ...DEAL, retry: 6 }],
}
const drop = (o, ...keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)))
export const ABLATION = {
  stock: [null, {}],
  'stock+deal': [null, DEAL],
  LA: [LA, DEAL],
  'LA -deal': [LA, {}],
  'LA -live': [drop(LA, 'live'), DEAL],
  'LA -fresh': [drop(LA, 'fresh'), DEAL],
  'LA -reach': [drop(LA, 'reach'), DEAL],
  'LA -fresh -reach': [drop(LA, 'fresh', 'reach'), DEAL],
  'LA -strict': [drop(LA, 'strict'), DEAL],
  'LA -soft (prev-only history)': [drop(LA, 'strict', 'softK', 'softPen'), DEAL],
  'LA -fallback': [drop(LA, 'fallback'), DEAL],
  'LA -steer': [drop(LA, 'steer'), DEAL],
  'LA cool5 (no fallback)': [LA_COOL, DEAL],
  'LA hardK2 (last 2 banned)': [{ ...LA, hardK: 2 }, DEAL],
  'LA +look2': [{ ...LA, look2: { beta: 0.5, cap: 8, dead: 0.2 } }, DEAL],
  'LA +courtesy': [{ ...LA, court: 0.5 }, DEAL],
  'live only': [{ ...LIVE }, {}],
  'live+fallback': [{ ...LIVE, fallback: true }, {}],
}
export function job(engine, [la, extra], lex, cols, rows, linkScale = 'half') {
  const cfg = { cols, rows, dealMin: 1, ...(cols * rows < 72 ? { linkScale } : {}), ...extra }
  if (la) cfg.la = la
  return { engine, lex, cfg }
}
