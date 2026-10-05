// Run the real Jukugo Board (deal + chooseTurn + desiredLinks) against a
// lexicon. Synthesis copy of research/roots/sim/sim.mjs. The scheduler is the
// original's: each tick (one background beat, BEAT = 2.05 s of Director time)
// picks one random pair that hasn't turned in the last COOLDOWN = 3 ticks.
//
// Changes from the original:
//  - Math.random is seeded per board seed, so every number reruns exactly;
//  - board.now = tick × BEAT before each choice (the engine's rest rule is in seconds);
//  - CFG.pick: 'random' (original; with CFG.retry = try up to N other idle pairs
//    on a null) or 'legal' (the Director picks only among idle pairs that can turn);
//  - metrics are sampled on every 10th tick whether or not that tick turned.
//
// Metrics (per seed, then the mean over dealt seeds):
//   stallRate   beats lost: ticks on which nothing turned / ticks
//   stuck       share of pairs that cannot turn under the rules in force even after
//               resting ("frozen": only another pair vacating a word can free them)
//   stuckNow    share of pairs that cannot turn right now (includes pairs that are
//               only waiting out the rest before a return) — = stuck for stock
//   stuckStrict the original harness's test whatever the engine: no free word other
//               than the previous one (a pair living on returns counts as stuck)
//   frozenRun   share of pairs that made no turn at all in the second half of the run
//   linked      mean Board.linkedFraction(); linkedLo/Hi = 10th / 90th percentile
//   repeatRate  turns landing on a word the pair showed in its last 6 / turns (original)
//   bounce      turns landing on the pair's immediately previous word / turns (in repeat)
//   seenFrac    share of the words in play (after pruning) shown at least once (original)
//   seenAll     share of the FULL list shown at least once (pruned words count as unseen)
//   noFresh     share of ticks whose picked pair had no free word outside its last 6
//   holes       pairs the deal left empty; pairs = pairs on the board
//   sd_*        standard deviation across seeds
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board, LINK_MAX } = await import('./.build/board.js')
const { LEXICON, FULL, turns, degree, GIANT, COLLIDE } = await import('./.build/lexicon.sim.js')
const { mulberry32 } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 10
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const BEAT = 2.05
const res = { runs: [] }
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
  if (!board.pairs.length) { res.runs.push({ seed, dealt: false, error: 'EMPTY' }); continue }
  const last = new Map()
  let stalls = 0, repeats = 0, bounces = 0, turnsDone = 0, noFresh = 0
  let stuckSum = 0, nowSum = 0, strictSum = 0, sN = 0
  const linkedSamples = []
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  for (let t = 0; t < TICKS; t++) {
    board.now = t * BEAT
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    let choice = null, p2 = null
    if (pool.length) {
      if (cfg.pick === 'legal') {
        const legal = pool.filter((p) => board.canTurn(p))
        if (legal.length) { p2 = legal[Math.floor(Math.random() * legal.length)]; choice = board.chooseTurn(p2) }
        else p2 = pool[0]
      } else {
        p2 = pool[Math.floor(Math.random() * pool.length)]
        choice = board.chooseTurn(p2)
        for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
          p2 = pool[Math.floor(Math.random() * pool.length)]
          choice = board.chooseTurn(p2)
        }
      }
      if (p2 && ![0, 1].some((i) => turns(p2.entry, i).some((e) => !board.used.has(e.word) && !p2.history.some((h) => h.word === e.word)))) noFresh++
    }
    if (choice) {
      if (p2.history.some((e) => e.word === choice.entry.word)) repeats++
      if (p2.history.at(-1)?.word === choice.entry.word) bounces++
      board.turn(p2, choice)
      turnsDone++
      seen.add(choice.entry.word)
      last.set(p2, t)
    } else stalls++
    if (t % 10 === 0) {
      linkedSamples.push(board.linkedFraction())
      let stuck = 0, now = 0, strict = 0
      for (const p of board.pairs) {
        if (!board.canTurn(p, true)) stuck++
        if (!board.canTurn(p)) now++
        const prev = p.history.at(-1)?.word
        if (![0, 1].some((i) => turns(p.entry, i).some((e) => !board.used.has(e.word) && e.word !== prev))) strict++
      }
      const n = board.pairs.length
      stuckSum += stuck / n; nowSum += now / n; strictSum += strict / n; sN++
    }
  }
  const frozenRun = board.pairs.filter((p) => (last.get(p) ?? -1) < TICKS / 2).length / board.pairs.length
  linkedSamples.sort((a, b) => a - b)
  const q = (f) => linkedSamples[Math.min(linkedSamples.length - 1, Math.floor(f * linkedSamples.length))] ?? 0
  const fullSeen = new Set(FULL.map((e) => e.word))
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, holes: board.holes ?? 0, stallRate: stalls / TICKS,
    stuck: stuckSum / sN, stuckNow: nowSum / sN, stuckStrict: strictSum / sN, frozenRun,
    linked: linkedSamples.reduce((a, b) => a + b, 0) / linkedSamples.length, linkedLo: q(0.1), linkedHi: q(0.9),
    repeatRate: repeats / Math.max(1, turnsDone), bounce: bounces / Math.max(1, turnsDone),
    seenFrac: seen.size / LEXICON.length, seenAll: [...seen].filter((w) => fullSeen.has(w)).length / FULL.length,
    noFresh: noFresh / TICKS })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const r3 = (k) => (ok.length ? +avg(k).toFixed(3) : null)
const sd = (k) => (ok.length > 1 ? +Math.sqrt(ok.reduce((s, r) => s + (r[k] - avg(k)) ** 2, 0) / (ok.length - 1)).toFixed(3) : null)
const out = { name: cfg.name, words: FULL.length, playable: LEXICON.length, giant: GIANT, deg5: LEXICON.filter((e) => degree(e) >= 5).length,
  collide: +COLLIDE.toFixed(4), linkMax: +LINK_MAX.toFixed(2), grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}${cfg.scaleFloor ? 's' : ''}`,
  dealt: `${ok.length}/${res.runs.length}`, pairs: ok.length ? +avg('pairs').toFixed(1) : null, holes: r3('holes') }
for (const k of ['stallRate', 'stuck', 'stuckNow', 'stuckStrict', 'frozenRun', 'linked', 'linkedLo', 'linkedHi', 'repeatRate', 'bounce', 'seenFrac', 'seenAll', 'noFresh']) out[k] = r3(k)
for (const k of ['stallRate', 'stuck', 'repeatRate', 'linked']) out['sd_' + k] = sd(k)
out.errors = [...new Set(res.runs.filter((r) => !r.dealt).map((r) => r.error))].join(',')
console.log(JSON.stringify(out))
