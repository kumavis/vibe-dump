// repro driver: sim.mjs extended for the POHAKU engine (cfg.engine = 'pohaku'), written from the spec only.
// Same tick model as sim.mjs: each tick picks one random pair not turned in the last COOLDOWN (3) ticks.
// POHAKU differences, mirroring the spec's Director background beat:
//   - the pool is additionally filtered by board.canTurn(p, now); an empty pool is a lost beat
//   - chooseTurn(pair, now, linked) with linked = board.linkedFraction() (the harness has no "view")
//   - now = t * tickSec (default 2 s, the COOLDOWN ≈ 6 s reading); turn(pair, choice, now)
//   - grid: cfg.cols/rows, or cfg.grid = 'auto' (cols/rows from |playable|)
// Metrics (all averaged over dealt seeds):
//   stallRate  beats with no turn / ticks
//   stuck      share of pairs with zero turns onto a word not on the board and != the previous word
//              (sim.mjs definition = frozen pairs, ignoring the rested return), sampled like sim.mjs:
//              on ticks t % 50 == 0 that produced a turn
//   stuckAll   same definition, sampled every 10th tick whether or not it turned (no stall bias)
//   stuckLegal share of pairs with no legal turn at all under the engine's own rules (canTurn false),
//              sampled every 10th tick
//   stuckFree  share of pairs with no turn onto ANY off-board word (the previous word allowed whatever the rest timer),
//              sampled every 10th tick
//   linked     board.linkedFraction() on ticks t % 10 == 0 that produced a turn (as sim.mjs)
//   linkedAll  board.linkedFraction() every 10th tick whether or not it turned (no stall bias)
//   repeatRate turns landing on a word in the pair's history (last 6) / turns
//   returnRate turns landing on the immediately previous word / turns
//   seenFrac   distinct words ever shown (deal included) / full lexicon; seenPlay = / |playable|
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const engine = cfg.engine ?? 'stock'
let L
if (engine === 'pohaku') {
  L = await import('./.build/pohaku/lexicon.pohaku.js')
  if (cfg.grid === 'auto' || cfg.cols == null) Object.assign(cfg, L.autoGrid())
} else {
  L = await import('./.build/lexicon.sim.js')
}
const { Board } = await import(engine === 'pohaku' ? './.build/pohaku/board.js' : './.build/board.js')
const { LEXICON, turns, degree } = L
const LINK_MAX = (await import(engine === 'pohaku' ? './.build/pohaku/board.js' : './.build/board.js')).LINK_MAX

const SEEDS = cfg.seeds ?? 12
const TICKS = cfg.ticks ?? 1500
const SEED0 = cfg.seed0 ?? 0
const COOLDOWN = 3
const TICK_SEC = cfg.tickSec ?? 2
const P = L.PLAYABLE ? L.PLAYABLE.length : LEXICON.length
const res = { lexicon: LEXICON.length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, deg3: LEXICON.filter((e) => degree(e) >= 3).length, runs: [] }
const playSet = L.PLAYABLE ? new Set(L.PLAYABLE.map((e) => e.word)) : new Set(LEXICON.map((e) => e.word))
for (let s = SEED0; s < SEED0 + SEEDS; s++) {
  const seed = 1031 + s * 7919
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    res.runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const last = new Map()
  let stalls = 0, attempts = 0, linkedSum = 0, linkedN = 0, repeats = 0, returns = 0, turnsDone = 0
  let stuckSum = 0, stuckN = 0, stuckAllSum = 0, stuckAllN = 0, legalSum = 0, linkedAllSum = 0, freeSum = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const frozen = (p) => {
    const prev = p.history.at(-1)?.word
    const n = [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => !board.used.has(e.word) && e.word !== prev).length, 0)
    return n === 0
  }
  for (let t = 0; t < TICKS; t++) {
    const now = t * TICK_SEC
    if (t % 10 === 0) {
      stuckAllSum += board.pairs.filter(frozen).length / board.pairs.length
      linkedAllSum += board.linkedFraction()
      freeSum += board.pairs.filter((p) => [0, 1].every((i) => turns(p.entry, i).every((e) => board.used.has(e.word)))).length / board.pairs.length
      if (engine === 'pohaku') legalSum += board.pairs.filter((p) => !board.canTurn(p, now)).length / board.pairs.length
      stuckAllN++
    }
    let pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    if (engine === 'pohaku') pool = pool.filter((p) => board.canTurn(p, now))
    attempts++
    if (!pool.length) { stalls++; continue }
    const pair = pool[Math.floor(Math.random() * pool.length)]
    const recent = new Set(pair.history.map((e) => e.word))
    let prevWord = pair.history.at(-1)?.word
    const choose = (p) => (engine === 'pohaku' ? board.chooseTurn(p, now) : board.chooseTurn(p))
    let choice = choose(pair)
    let p2 = pair
    for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
      p2 = pool[Math.floor(Math.random() * pool.length)]
      choice = choose(p2)
    }
    if (!choice) { stalls++; continue }
    if (p2 !== pair) { recent.clear(); for (const e of p2.history) recent.add(e.word); prevWord = p2.history.at(-1)?.word }
    if (recent.has(choice.entry.word)) repeats++
    if (choice.entry.word === prevWord) returns++
    if (engine === 'pohaku') board.turn(p2, choice, now)
    else board.turn(p2, choice)
    turnsDone++
    seen.add(choice.entry.word)
    last.set(p2, t)
    if (t % 10 === 0) { linkedSum += board.linkedFraction(); linkedN++ }
    if (t % 50 === 0) { stuckSum += board.pairs.filter(frozen).length / board.pairs.length; stuckN++ }
  }
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, holes: board.holes ?? 0, stallRate: stalls / attempts, linked: linkedSum / Math.max(1, linkedN),
    stuck: stuckSum / Math.max(1, stuckN), stuckAll: stuckAllSum / Math.max(1, stuckAllN), stuckLegal: legalSum / Math.max(1, stuckAllN), linkedAll: linkedAllSum / Math.max(1, stuckAllN), stuckFree: freeSum / Math.max(1, stuckAllN),
    repeatRate: repeats / Math.max(1, turnsDone), returnRate: returns / Math.max(1, turnsDone),
    seenFrac: seen.size / LEXICON.length, seenPlay: [...seen].filter((w) => playSet.has(w)).length / P })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const max = (k) => ok.reduce((m, r) => Math.max(m, r[k]), 0)
const r3 = (v) => +v.toFixed(3)
console.log(JSON.stringify({ name: cfg.name, engine, lexicon: res.lexicon, playable: P, LINK_MAX: r3(LINK_MAX), grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}`, ticks: TICKS,
  dealt: `${ok.length}/${res.runs.length}`, pairs: r3(avg('pairs')), holes: r3(avg('holes')), stallRate: r3(avg('stallRate')), stuck: r3(avg('stuck')), stuckAll: r3(avg('stuckAll')),
  stuckLegal: r3(avg('stuckLegal')), stuckFree: r3(avg('stuckFree')), linked: r3(avg('linked')), linkedAll: r3(avg('linkedAll')), repeatRate: r3(avg('repeatRate')), returnRate: r3(avg('returnRate')),
  seenFrac: r3(avg('seenFrac')), seenPlay: r3(avg('seenPlay')), maxStuckAll: r3(max('stuckAll')), maxRepeat: r3(max('repeatRate')), maxStuckLegal: r3(max('stuckLegal')), maxStall: r3(max('stallRate')) }))
