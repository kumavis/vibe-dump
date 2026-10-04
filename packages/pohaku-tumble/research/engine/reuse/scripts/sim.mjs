// Run the real Jukugo Board (deal + chooseTurn + desiredLinks), patched by
// prepare.mjs, against a lexicon. Derived from research/roots/sim/sim.mjs.
//
// Scheduler (as the original): each tick is one director beat (~2 s). It picks
// one random pair that hasn't turned in the last COOLDOWN ticks (the 6 s rule)
// and asks chooseTurn for it; with cfg.retry = N it tries up to N other idle
// pairs on a null. cfg.viewOnly restricts the pool to pairs inside the
// Director's turning window under Jukugo's default camera drift (see VIEW).
//
// Changes from the original, so every number here is reproducible and honest
// under the reuse rules:
//  - Math.random is seeded per seed (mulberry32), so a rerun gives the same row.
//  - stuck counts pairs whose legal option list (Board.options, the exact list
//    chooseTurn draws from, under the rules in force at that tick) is empty.
//    The original counted words "on the board", which is wrong once dupFar or
//    prevAfter loosen the rules. Under stock rules the two agree.
//  - linked / stuck / duplicate samples are taken on every 10th / 50th tick
//    whether or not that tick's turn stalled (the original skipped stalled ticks).
//
// Metrics (per seed, then averaged over seeds that dealt):
//  stallRate  beats lost: share of ticks on which no turn happened (after retries)
//  stuck      mean share of pairs with zero legal turns (sampled every 50 ticks)
//  frozen     as stuck, but counting a pair as rested (prevAfter satisfied):
//             pairs that cannot move until another pair frees a word. Equals
//             stuck when prevAfter is unset.
//  linked     mean Board.linkedFraction() (sampled every 10 ticks)
//  repeatRate share of turns landing on a word the turning pair showed in its last 6
//  flipRate   share of turns landing on the pair's immediately previous word
//             (A→B→A; a subset of repeats — what prevAfter allows)
//  seenFrac   share of the lexicon shown at least once
//  dupTurn    share of turns whose new word was already on another pair
//  dupBoard   mean number of extra copies on the board (Σ over words of count−1)
//  dupView    share of camera draws (every 10 ticks, 8 draws) in which one 26×17
//             window, centred uniformly in Jukugo's default drift box
//             (x ±3.9, z ±1.8), contains the centres of two pairs showing the
//             same word
//  dupViewPan same, centre uniform over the whole pannable range
//             (BOUNDS inset 6 in x, 4 in z)
//  dupViewHD  as dupView but with the floor footprint of a 1920x1080 window
//             (ppu capped at 60, pitch 55°: 32 x 22 units), same camera centres
//             (no extra random draws, so every other metric is unchanged)
//  dupFits    share of samples (every 10 ticks) in which some two copies could
//             fit in one 26×17 window at all (|dx|≤26 and |dz|≤17) — worst case
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board } = await import('./.build/board.js')
const { LEXICON, degree } = await import('./.build/lexicon.sim.js')
const { mulberry32, floorBounds } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 12
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const VIEW = { w: 26, h: 17 } // world units the camera shows at default zoom (the brief's figure)
const VIEW_HD = { w: 32, h: 22 } // 1920x1080: 1920/60 x (1080/60)/sin(55°)
const TURN_WIN = { w: VIEW.w * 0.8, h: VIEW.h * 0.7 } // Director.inView(0.1): comfortably on screen
const BEAT = 2.05 // seconds per tick (Director: 1.5–2.6 s)
const camAt = (t) => {
  const s = t * BEAT
  return [2.5 * Math.sin((s / 97) * Math.PI * 2) + 1.4 * Math.sin((s / 41) * Math.PI * 2), 1.8 * Math.sin((s / 83) * Math.PI * 2 + 1)]
}

const res = { lexicon: LEXICON.length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, deg3: LEXICON.filter((e) => degree(e) >= 3).length, runs: [] }
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
  const B = floorBounds()
  const pan = { x0: B.x0 + 6, x1: B.x1 - 6, z0: B.z0 + 4, z1: B.z1 - 4 }
  const last = new Map()
  const m = { stalls: 0, attempts: 0, linkedSum: 0, linkedN: 0, repeats: 0, flips: 0, turns: 0, stuckSum: 0, stuckN: 0, frozenSum: 0,
    dupTurns: 0, dupBoardSum: 0, dupViewHits: 0, dupViewHDHits: 0, dupViewPanHits: 0, dupDraws: 0, dupFitsHits: 0, dupN: 0 }
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const copies = () => {
    const by = new Map()
    for (const p of board.pairs) {
      let l = by.get(p.entry.word)
      if (!l) by.set(p.entry.word, (l = []))
      l.push(p)
    }
    return [...by.values()].filter((l) => l.length > 1)
  }
  const inWin = (p, cx, cz, w, h) => Math.abs(p.x - cx) <= w / 2 && Math.abs(p.z - cz) <= h / 2
  const coVisible = (groups, cx, cz, V = VIEW) => groups.some((l) => l.filter((p) => inWin(p, cx, cz, V.w, V.h)).length > 1)
  for (let t = 0; t < TICKS; t++) {
    board.clock = t
    let pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    if (cfg.viewOnly) {
      const [cx, cz] = camAt(t)
      pool = pool.filter((p) => inWin(p, cx, cz, TURN_WIN.w, TURN_WIN.h))
    }
    m.attempts++
    let choice = null
    let pair = null
    if (pool.length) {
      pair = pool[Math.floor(Math.random() * pool.length)]
      choice = board.chooseTurn(pair)
      for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
        pair = pool[Math.floor(Math.random() * pool.length)]
        choice = board.chooseTurn(pair)
      }
    }
    if (choice) {
      if (pair.history.some((e) => e.word === choice.entry.word)) m.repeats++
      if (pair.history.at(-1)?.word === choice.entry.word) m.flips++
      if (board.used.has(choice.entry.word)) m.dupTurns++
      board.turn(pair, choice)
      m.turns++
      seen.add(choice.entry.word)
      last.set(pair, t)
    } else m.stalls++
    if (t % 10 === 0) {
      m.linkedSum += board.linkedFraction()
      m.linkedN++
      const groups = copies()
      m.dupN++
      m.dupBoardSum += groups.reduce((a, l) => a + l.length - 1, 0)
      if (groups.some((l) => l.some((p, i) => l.some((q, j) => j > i && Math.abs(p.x - q.x) <= VIEW.w && Math.abs(p.z - q.z) <= VIEW.h)))) m.dupFitsHits++
      for (let k = 0; k < 8; k++) {
        m.dupDraws++
        if (groups.length) {
          // draw only when there is something to see, exactly as before, so the random stream is unchanged
          const cx = (Math.random() * 2 - 1) * 3.9
          const cz = (Math.random() * 2 - 1) * 1.8
          if (coVisible(groups, cx, cz)) m.dupViewHits++
          if (coVisible(groups, cx, cz, VIEW_HD)) m.dupViewHDHits++
        }
        if (groups.length && coVisible(groups, pan.x0 + Math.random() * (pan.x1 - pan.x0), pan.z0 + Math.random() * (pan.z1 - pan.z0))) m.dupViewPanHits++
      }
    }
    if (t % 50 === 0) {
      let stuck = 0
      let frozen = 0
      for (const p of board.pairs) {
        if (board.options(p, 0.5).length === 0) stuck++
        if (board.options(p, 0.5, true).length === 0) frozen++
      }
      m.stuckSum += stuck / board.pairs.length
      m.frozenSum += frozen / board.pairs.length
      m.stuckN++
    }
  }
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, stallRate: m.stalls / m.attempts, linked: m.linkedSum / Math.max(1, m.linkedN),
    stuck: m.stuckSum / Math.max(1, m.stuckN), frozen: m.frozenSum / Math.max(1, m.stuckN), repeatRate: m.repeats / Math.max(1, m.turns), flipRate: m.flips / Math.max(1, m.turns),
    seenFrac: seen.size / LEXICON.length, dupTurn: m.dupTurns / Math.max(1, m.turns), dupBoard: m.dupBoardSum / Math.max(1, m.dupN),
    dupView: m.dupViewHits / Math.max(1, m.dupDraws), dupViewHD: m.dupViewHDHits / Math.max(1, m.dupDraws), dupViewPan: m.dupViewPanHits / Math.max(1, m.dupDraws), dupFits: m.dupFitsHits / Math.max(1, m.dupN) })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const max = (k) => ok.reduce((s, r) => Math.max(s, r[k]), 0)
const r3 = (x) => +x.toFixed(3)
console.log(JSON.stringify({ name: cfg.name, lexicon: res.lexicon, deg3: res.deg3, deg5: res.deg5, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}${cfg.scaleBounds ? 's' : ''}`,
  dealt: `${ok.length}/${res.runs.length}`, pairs: Math.round(avg('pairs')), stallRate: r3(avg('stallRate')), stuck: r3(avg('stuck')), frozen: r3(avg('frozen')),
  linked: r3(avg('linked')), repeatRate: r3(avg('repeatRate')), flipRate: r3(avg('flipRate')), seenFrac: r3(avg('seenFrac')),
  dupTurn: r3(avg('dupTurn')), dupBoard: +avg('dupBoard').toFixed(2), dupView: r3(avg('dupView')), dupViewHD: r3(avg('dupViewHD')), dupViewPan: r3(avg('dupViewPan')), dupFits: r3(avg('dupFits')),
  stallMax: r3(max('stallRate')), stuckMax: r3(max('stuck')), cfg }))
