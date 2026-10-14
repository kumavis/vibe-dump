// Run Jukugo Tumble's real Board against a lexicon. Extends
// research/roots/sim/sim.mjs: the original metrics are computed exactly as
// there (same names, same sampling), and new ones are added. Math.random is
// seeded per run, so a row reproduces exactly.
//
// Config (env CFG, JSON) — on top of the original keys:
//   floor     'fixed'  Jukugo's BOUNDS whatever the grid (default)
//             'scaled' BOUNDS sized so a cell stays Jukugo's 4.67 x 3.625
//                      (cols/9 and rows/8 of the stock floor); LINK_MAX and
//                      the deal radius unchanged, so density and link reach
//                      are Jukugo's
//   linkScale true with floor 'fixed': LINK_MAX and deal radius scaled by
//             sqrt(cell area / Jukugo cell area), so reach in cells is Jukugo's
//   auto      size the grid from the lexicon (see sizing.mjs); implies 'scaled'
//   dealMode, dealMin, matchMin, floorMin, gamma, nearR, matchP, linkMax, prune — see prepare.mjs / lexicon.sim.js
//
// Original metrics (as in research/roots/sim):
//   stallRate  share of ticks where the chosen pair (after retries) had no legal turn
//   stuck      mean share of pairs with zero legal turns, sampled at t%50==0 on ticks that turned
//   linked     mean linkedFraction(), sampled at t%10==0 on ticks that turned
//   repeatRate share of turns landing on a word the pair showed in its last 6
//   seenFrac   share of the (pruned) lexicon shown at least once
// New metrics:
//   stuckAll   as stuck, but sampled every 10 ticks whether or not the tick turned
//   stuckEnd   stuckAll over the last 20% of ticks only
//   stallEnd   stallRate over the last 20% of ticks only
//   stuckStart / stallStart  the same over the first 20% of ticks (what the deal shapes)
//   trappedEnd share of pairs, at the last tick, on a word whose only turn is the word
//              it just left: frozen for good under the no-immediate-return rule
//   linked0    linkedFraction() of the opening deal
//   linkedEnd  linkedFraction() over the last 20% of ticks, every 10 ticks
//   holes      pairs the deal left empty (dropped), mean per seed
//   dealDeg    mean degree of the dealt words
//   seenAll    share of the full (unpruned) lexicon shown at least once
//   tpp        turns per pair over the run
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const lexmod = await import('./.build/lexicon.sim.js')
const { LEXICON, turns, degree, FULL_SIZE } = lexmod

const J = { x0: -21, x1: 21, z0: -14.5, z1: 14.5, cols: 9, rows: 8 }
const JCELL = ((J.x1 - J.x0) / J.cols) * ((J.z1 - J.z0) / J.rows)
if (cfg.auto) {
  const { sizeFor } = await import('./sizing.mjs')
  Object.assign(cfg, sizeFor(LEXICON, degree, cfg.auto))
  cfg.floor = 'scaled'
}
const cols = cfg.cols ?? 9
const rows = cfg.rows ?? 8
if (cfg.floor === 'scaled') {
  cfg.bounds = { x0: (J.x0 * cols) / J.cols, x1: (J.x1 * cols) / J.cols, z0: (J.z0 * rows) / J.rows, z1: (J.z1 * rows) / J.rows }
} else if (cfg.linkScale) {
  const s = Math.sqrt(((J.x1 - J.x0) / cols) * ((J.z1 - J.z0) / rows) / JCELL)
  cfg.linkMax = 11.5 * s
  cfg.nearR = 9 * s
}
const { Board } = await import('./.build/board.js')
const { mulberry32 } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 12
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const END = Math.floor(TICKS * 0.8)
const START = Math.floor(TICKS * 0.2)
const realRandom = Math.random
const res = { lexicon: LEXICON.length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, deg3: LEXICON.filter((e) => degree(e) >= 3).length, runs: [] }

function legal(board, p) {
  const prev = p.history.at(-1)?.word
  return [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => !board.used.has(e.word) && e.word !== prev).length, 0)
}

for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  Math.random = mulberry32(seed ^ 0x5bd1e995)
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    res.runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  if (!board.pairs.length) {
    res.runs.push({ seed, dealt: false, error: 'EMPTY' })
    continue
  }
  const last = new Map()
  let stalls = 0, attempts = 0, linkedSum = 0, linkedN = 0, repeats = 0, turnsDone = 0, stuckSum = 0, stuckN = 0
  let saSum = 0, saN = 0, seSum = 0, seN = 0, leSum = 0, leN = 0, stallsEnd = 0, attemptsEnd = 0, ssSum = 0, ssN = 0, stallsStart = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const linked0 = board.linkedFraction()
  const dealDeg = board.pairs.reduce((a, p) => a + degree(p.entry), 0) / board.pairs.length
  for (let t = 0; t < TICKS; t++) {
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    const pair = pool[Math.floor(Math.random() * pool.length)]
    attempts++
    if (t >= END) attemptsEnd++
    const recent = new Set(pair.history.map((e) => e.word))
    let choice = board.chooseTurn(pair)
    let p2 = pair
    for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
      p2 = pool[Math.floor(Math.random() * pool.length)]
      choice = board.chooseTurn(p2)
    }
    if (t % 10 === 0) {
      const st = board.pairs.filter((p) => legal(board, p) === 0).length / board.pairs.length
      saSum += st; saN++
      if (t < START) { ssSum += st; ssN++ }
      if (t >= END) {
        seSum += st; seN++
        leSum += board.linkedFraction(); leN++
      }
    }
    if (!choice) {
      stalls++
      if (t >= END) stallsEnd++
      if (t < START) stallsStart++
      continue
    }
    if (p2 !== pair) { recent.clear(); for (const e of p2.history) recent.add(e.word) }
    if (recent.has(choice.entry.word)) repeats++
    board.turn(p2, choice)
    turnsDone++
    seen.add(choice.entry.word)
    last.set(p2, t)
    if (t % 10 === 0) { linkedSum += board.linkedFraction(); linkedN++ }
    if (t % 50 === 0) {
      let stuck = 0
      for (const p of board.pairs) if (legal(board, p) === 0) stuck++
      stuckSum += stuck / board.pairs.length; stuckN++
    }
  }
  const trapped = board.pairs.filter((p) => {
    const prev = p.history.at(-1)?.word
    const all = [...turns(p.entry, 0), ...turns(p.entry, 1)]
    return prev && all.every((e) => e.word === prev)
  }).length
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, stallRate: stalls / attempts, linked: linkedSum / Math.max(1, linkedN),
    stuck: stuckSum / Math.max(1, stuckN), repeatRate: repeats / Math.max(1, turnsDone), seenFrac: seen.size / LEXICON.length,
    stuckAll: saSum / saN, stuckEnd: seSum / Math.max(1, seN), stallEnd: stallsEnd / Math.max(1, attemptsEnd), trappedEnd: trapped / board.pairs.length,
    linked0, linkedEnd: leSum / Math.max(1, leN), stuckStart: ssSum / Math.max(1, ssN), stallStart: stallsStart / Math.max(1, START), holes: board.holes ?? 0, dealDeg, seenAll: seen.size / FULL_SIZE, tpp: turnsDone / board.pairs.length })
}
Math.random = realRandom
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const r3 = (k) => +avg(k).toFixed(3)
const errors = [...new Set(res.runs.filter((r) => !r.dealt).map((r) => r.error))].join(',')
console.log(JSON.stringify({ name: cfg.name, lex: process.env.LEX.split('/').pop().replace('.json', ''), lexicon: res.lexicon, full: FULL_SIZE, deg3: res.deg3, deg5: res.deg5,
  grid: cfg.auto ? `auto${cfg.auto.occ ?? 0.1}` : `${cols}x${rows}`, cells: `${cols}x${rows}`, floor: cfg.floor === 'scaled' ? 'scaled' : cfg.linkScale ? 'fixed+L' : 'fixed', linkMax: +(cfg.linkMax ?? 11.5).toFixed(2),
  dealMode: cfg.dealMode ?? 'stock', dealMin: cfg.dealMin ?? 5, matchMin: cfg.matchMin ?? 3, prune: cfg.prune ?? 0, retry: cfg.retry ?? 0,
  dealt: `${ok.length}/${res.runs.length}`, errors, pairs: Math.round(avg('pairs')), holes: +avg('holes').toFixed(1),
  stallRate: r3('stallRate'), stuck: r3('stuck'), linked: r3('linked'), repeatRate: r3('repeatRate'), seenFrac: r3('seenFrac'),
  stuckAll: r3('stuckAll'), stuckEnd: r3('stuckEnd'), stallEnd: r3('stallEnd'), trappedEnd: r3('trappedEnd'), stuckStart: r3('stuckStart'), stallStart: r3('stallStart'),
  linked0: r3('linked0'), linkedEnd: r3('linkedEnd'), dealDeg: +avg('dealDeg').toFixed(2), seenAll: r3('seenAll'), tpp: +avg('tpp').toFixed(1) }))
