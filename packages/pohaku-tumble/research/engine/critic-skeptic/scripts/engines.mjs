// Named engine configurations. Each is a function (cols, rows) → CFG keys
// (cols/rows = null → the board is sized from the list: SIM.autoGrid).
// `stock`   = Jukugo's rules, with dealMin 1 so the stock deal can deal at all.
// `REC`     = grammar-clean set: 2-core, fill deal, fresh-first tiers, reach
//             lookahead, symmetric steering, legal pick, LINK_MAX rule.
// `REC+ret` = REC + the rested return (bends Jukugo's no-immediate-return rule).
// Others are ablations / variants.
export const REACH = { depth: 3, cap: 40, dead: 0.1 }
export const STEER = { hi: 0.55, hiJoin: 0, hiBreak: 3 }
export const AUTO = { div: 8, min: 18, max: 65 }
const base = (c, r) => (c == null ? { autoGrid: AUTO } : { cols: c, rows: r, ...(c * r < 72 ? { scaleFloor: true } : {}) })
export const REC_CORE = {
  prune: 2,                                                         // lexicon: play the 2-core
  deal: 'fill', dealMin: 5, floorMin: 2, matchMin: 3, dealComp: 12, // never-hang deal, components of 12+
  pick: 'legal',                                                    // Director: background beat picks a pair that can turn
  linkMax: 'auto', linkC0: 0.010, linkFloor: 5,                     // LINK_MAX from root concentration
}
export const E_REC = { tiers: true, reach: REACH, steer: STEER }
const E_RET = { ...E_REC, ret: 6 }
const unpruned = { prune: 0, floorMin: 1 }
const mk = (core, engine) => (c, r) => ({ ...base(c, r), ...core, ...(engine ? { engine } : {}) })
export const ENGINES = {
  stock: (c, r) => ({ ...base(c, r), dealMin: 1 }),
  'prune only': mk({ prune: 2, deal: 'fill', dealMin: 5, floorMin: 2 }),
  REC: mk(REC_CORE, E_REC),
  'REC+ret': mk(REC_CORE, E_RET),
  // ablations of REC+ret
  'REC+ret -prune': mk({ ...REC_CORE, ...unpruned }, E_RET),
  'REC+ret -prune +dealCore': mk({ ...REC_CORE, ...unpruned, dealCore: true }, E_RET),
  'REC+ret -reach': mk(REC_CORE, { tiers: true, steer: STEER, ret: 6 }),
  'REC+ret -tiers': mk(REC_CORE, { reach: REACH, steer: STEER, ret: 6 }),
  'REC+ret -tiers +hist0.05': mk(REC_CORE, { reach: REACH, steer: STEER, ret: 6, histPen: 0.05 }),
  'REC+ret -comp': mk({ ...REC_CORE, dealComp: 0 }, E_RET),
  'REC+ret -legal': mk({ ...REC_CORE, pick: 'random' }, E_RET),
  'REC+ret -legal +retry6': mk({ ...REC_CORE, pick: 'random', retry: 6 }, E_RET),
  'REC+ret -steer': mk(REC_CORE, { tiers: true, reach: REACH, ret: 6 }),
  'REC+ret L11.5': mk({ ...REC_CORE, linkMax: 11.5 }, E_RET),
  'REC+ret dealMin2': mk({ ...REC_CORE, dealMin: 2 }, E_RET),
  'REC+ret matchMin2': mk({ ...REC_CORE, matchMin: 2 }, E_RET),
  'REC+ret ret0': mk(REC_CORE, { ...E_REC, ret: 0 }),
  'REC+ret ret20': mk(REC_CORE, { ...E_REC, ret: 20 }),
  'REC -prune': mk({ ...REC_CORE, ...unpruned }, E_REC),
}
// Director-model (dsim.mjs) versions: dsim's own Director knobs replace `pick`:
// bgRetry 'legal' (= pick 'legal'), and notes prefer pairs that can turn twice
// and have a fresh turn (noteTwo / noteFresh: preferences, not filters).
export const D_REC = { bgRetry: 'legal', noteTwo: true, noteFresh: true }
const strip = ({ pick, retry, ...rest }) => rest
export const DENGINES = Object.fromEntries(Object.entries(ENGINES).map(([k, f]) => [k, (c, r) => {
  const cfg = f(c, r)
  if (k === 'stock') return cfg
  if (cfg.pick === 'random') return { ...strip(cfg), noteTwo: true, noteFresh: true, ...(cfg.retry ? { bgRetry: cfg.retry } : {}) }
  return { ...strip(cfg), ...D_REC }
}]))
DENGINES['REC+ret -notes'] = (c, r) => ({ ...strip(ENGINES['REC+ret'](c, r)), bgRetry: 'legal' })
DENGINES['REC+ret +release'] = (c, r) => ({ ...DENGINES['REC+ret'](c, r), release: 2 })
DENGINES['REC+ret +steerView'] = (c, r) => ({ ...DENGINES['REC+ret'](c, r), steerView: true })
DENGINES['REC+ret -steer +steerView'] = (c, r) => ({ ...DENGINES['REC+ret -steer'](c, r), steerView: true })

// ── the final recommendation ──
// POHAKU = REC+ret; in the Director model the Director also passes chooseTurn the linked share of the
// pairs in view (steerView). In sim.mjs there is no view, so POHAKU there is exactly REC+ret.
// POHAKU -ret = the same without the rested return (the grammar-clean fallback if the designer refuses it).
ENGINES.POHAKU = ENGINES['REC+ret']
ENGINES['POHAKU -ret'] = ENGINES.REC
DENGINES.POHAKU = (c, r) => ({ ...DENGINES['REC+ret'](c, r), steerView: true })
DENGINES['POHAKU -ret'] = (c, r) => ({ ...DENGINES.REC(c, r), steerView: true })

// ── critic variants ──
const withE = (f, extra) => (c, r) => { const cfg = f(c, r); return { ...cfg, engine: { ...cfg.engine, ...extra } } }
for (const T of [ENGINES, DENGINES]) {
  T['POHAKU noSteer'] = withE(T.POHAKU, { noSteer: true })
  T['POHAKU br90w'] = withE(T.POHAKU, { boardRecent: { mode: 'w', sec: 90, w: 0.15 } })
  T['POHAKU br90tier'] = withE(T.POHAKU, { boardRecent: { mode: 'tier', sec: 90 } })
  T['POHAKU br180tier'] = withE(T.POHAKU, { boardRecent: { mode: 'tier', sec: 180 } })
  T['POHAKU -ret noSteer'] = withE(T['POHAKU -ret'], { noSteer: true })
}
for (const T of [ENGINES, DENGINES]) {
  for (const s of [12, 20, 30, 60]) T['POHAKU ret' + s] = withE(T.POHAKU, { ret: s })
}
for (const T of [ENGINES, DENGINES]) {
  for (const cap of [5, 10]) T['POHAKU reachCap' + cap] = withE(T.POHAKU, { reach: { depth: 3, cap, dead: 0.1 } })
  T['POHAKU reachCap10 ret20'] = withE(T.POHAKU, { reach: { depth: 3, cap: 10, dead: 0.1 }, ret: 20 })
}
ENGINES['POHAKU -prune'] = ENGINES['REC+ret -prune']
DENGINES['POHAKU -prune'] = (c, r) => ({ ...DENGINES['REC+ret -prune'](c, r), steerView: true })
for (const T of [ENGINES, DENGINES]) {
  T['POHAKU -prune ret20'] = withE(T['POHAKU -prune'], { ret: 20 })
  T['POHAKU -prune ret30'] = withE(T['POHAKU -prune'], { ret: 30 })
}
