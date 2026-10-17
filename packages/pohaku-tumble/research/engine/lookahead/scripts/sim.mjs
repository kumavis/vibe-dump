// Run the real Jukugo Board (deal + chooseTurn + desiredLinks) against a
// lexicon and report whether it deals, how often a chosen pair has nowhere to
// turn, how linked the floor stays, and how much of the lexicon gets seen.
// The scheduler is a simplification of Director: each tick turns one random
// pair that hasn't turned in the last COOLDOWN ticks (≈ the 6 s rule).
//
// Lookahead-study copy. Changes from research/roots/sim/sim.mjs:
//  - Math.random is seeded per board seed, so every number reruns exactly;
//  - CFG.linkScale: "auto" = sqrt(72 / (cols*rows)), "half" = (72 / (cols*rows))^0.25, scaling LINK_MAX and the deal's
//    nearby radius with the cell size on grids smaller than 9x8;
//  - CFG.la: the lookahead engine (see lookahead.js); unset = Jukugo's chooseTurn;
//  - CFG.pickFresh: optional Director-side retry of other pairs when a turn would be a repeat;
//  - metrics (all means over dealt seeds):
//      stallRate   beats where the picked pair (after CFG.retry retries) made no turn
//      stuck       share of pairs that cannot turn under the ENGINE's rules (Board.canTurn),
//                  sampled every 50 ticks — for the stock engine this is the original metric
//      stuckStrict the original metric whatever the engine: share of pairs with no turn that is
//                  unused and not the previous word (so a fallback/cooldown return isn't hidden)
//      repeatRate  turns landing on a word in the pair's last 6 (unchanged)
//      bounce      turns landing on the pair's immediately previous word (A→B→A)
//      frozen      share of pairs that made no turn at all in the second half of the run
//      linked      mean linked fraction, sampled every 10 ticks; linkedLo/Hi = 10th/90th percentile
//      seenFrac    share of the lexicon shown at least once
//      noFresh     diagnostic: share of picks where the pair had no target that is free and not in
//                  its last 6 — a floor under (repeats + stalls) that no chooseTurn can beat
//      sd_*        standard deviation across seeds
const cfg = JSON.parse(process.env.CFG || '{}')
if (cfg.linkScale === 'auto') cfg.linkScale = Math.sqrt(72 / ((cfg.cols ?? 9) * (cfg.rows ?? 8)))
if (cfg.linkScale === 'half') cfg.linkScale = (72 / ((cfg.cols ?? 9) * (cfg.rows ?? 8))) ** 0.25
globalThis.SIM = cfg
const { Board } = await import('./.build/board.js')
const { LEXICON, turns, degree } = await import('./.build/lexicon.sim.js')
const { mulberry32 } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 12
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const res = { lexicon: LEXICON.length, deg1: LEXICON.filter((e) => degree(e) >= 1).length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, deg3: LEXICON.filter((e) => degree(e) >= 3).length, runs: [] }
for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  Math.random = mulberry32((seed * 2654435761) >>> 0)
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    res.runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const last = new Map()
  let noFresh = 0, stalls = 0, attempts = 0, repeats = 0, bounces = 0, turnsDone = 0
  let stuckSum = 0, strictSum = 0, stuckN = 0
  const linkedSamples = []
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  for (let t = 0; t < TICKS; t++) {
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    const pair = pool[Math.floor(Math.random() * pool.length)]
    attempts++
    // diagnostic: does the picked pair have any target that is free and not in its last 6?
    if (![0, 1].some((i) => turns(pair.entry, i).some((e) => !board.used.has(e.word) && !pair.history.some((h) => h.word === e.word)))) noFresh++
    let choice = board.chooseTurn(pair)
    // CFG.retry: like a Director that, finding nowhere to turn, tries up to N other idle pairs this beat
    let p2 = pair
    for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
      p2 = pool[Math.floor(Math.random() * pool.length)]
      choice = board.chooseTurn(p2)
    }
    if (!choice) { stalls++; continue }
    // CFG.pickFresh (Director-side, optional): the turn would land in the pair's last 6 —
    // look at up to N other idle pairs for one whose turn wouldn't; else keep the repeat
    const inHist = (p, c) => p.history.some((e) => e.word === c.entry.word)
    for (let k = 0; cfg.pickFresh && inHist(p2, choice) && k < cfg.pickFresh; k++) {
      const q = pool[Math.floor(Math.random() * pool.length)]
      const c = board.chooseTurn(q)
      if (c && !inHist(q, c)) { p2 = q; choice = c }
    }
    const recent = new Set(p2.history.map((e) => e.word))
    if (recent.has(choice.entry.word)) repeats++
    if (p2.history.at(-1)?.word === choice.entry.word) bounces++
    board.turn(p2, choice)
    turnsDone++
    seen.add(choice.entry.word)
    last.set(p2, t)
    if (t % 10 === 0) linkedSamples.push(board.linkedFraction())
    if (t % 50 === 0) {
      let stuck = 0, strict = 0
      for (const p of board.pairs) {
        if (!board.canTurn(p)) stuck++
        const prev = p.history.at(-1)?.word
        const n = [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => !board.used.has(e.word) && e.word !== prev).length, 0)
        if (n === 0) strict++
      }
      stuckSum += stuck / board.pairs.length; strictSum += strict / board.pairs.length; stuckN++
    }
  }
  const frozen = board.pairs.filter((p) => (last.get(p) ?? -1) < TICKS / 2).length / board.pairs.length
  linkedSamples.sort((a, b) => a - b)
  const q = (f) => linkedSamples[Math.min(linkedSamples.length - 1, Math.floor(f * linkedSamples.length))] ?? 0
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, stallRate: stalls / attempts,
    linked: linkedSamples.reduce((a, b) => a + b, 0) / Math.max(1, linkedSamples.length), linkedLo: q(0.1), linkedHi: q(0.9),
    stuck: stuckSum / Math.max(1, stuckN), stuckStrict: strictSum / Math.max(1, stuckN), frozen,
    noFresh: noFresh / attempts, repeatRate: repeats / Math.max(1, turnsDone), bounce: bounces / Math.max(1, turnsDone), seenFrac: seen.size / LEXICON.length })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const r3 = (k) => (ok.length ? +avg(k).toFixed(3) : null)
const sd = (k) => (ok.length ? +Math.sqrt(ok.reduce((s, r) => s + (r[k] - avg(k)) ** 2, 0) / Math.max(1, ok.length - 1)).toFixed(3) : null)
console.log(JSON.stringify({ name: cfg.name, lexicon: res.lexicon, deg1: res.deg1, deg3: res.deg3, deg5: res.deg5, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}`,
  dealt: `${ok.length}/${res.runs.length}`, pairs: ok.length ? Math.round(avg('pairs')) : null, stallRate: r3('stallRate'), stuck: r3('stuck'), stuckStrict: r3('stuckStrict'),
  frozen: r3('frozen'), linked: r3('linked'), linkedLo: r3('linkedLo'), linkedHi: r3('linkedHi'), repeatRate: r3('repeatRate'), bounce: r3('bounce'), seenFrac: r3('seenFrac'),
  noFresh: r3('noFresh'), sd_stall: sd('stallRate'), sd_stuck: sd('stuck'), sd_repeat: sd('repeatRate'), sd_linked: sd('linked'),
  errors: [...new Set(res.runs.filter((r) => !r.dealt).map((r) => r.error))].join(',') }))
