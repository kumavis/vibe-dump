// simx.mjs — sim.mjs (from research/roots/sim) with three additions, nothing else changed:
//  1. Math.random is replaced per seed by a seeded mulberry32, so every row reruns to the same
//     numbers (chooseTurn and the scheduler both draw from Math.random).
//  2. stuck is split in two:
//       stuckPerm  = share of pairs whose word has no legal turn even on an EMPTY board, i.e. every
//                    turn of the lexicon goes back to the word the pair just left (the prev rule):
//                    a lexicon dead end (degree 1 after arriving from its only neighbour, or degree 0).
//                    Under Jukugo's rules this pair never turns again.
//       stuckBoard = stuck - stuckPerm: blocked only because every exit is on the board right now.
//  3. extra output fields: occ (pairs / lexicon size), turnsPerPair, cfg echo.
// Metric definitions otherwise exactly as sim.mjs:
//   stallRate  = beats with no turn / beats (after cfg.retry extra pairs were tried)
//   stuck      = mean over samples every 50 ticks of (pairs with zero legal turns / pairs)
//   linked     = mean over samples every 10 ticks of board.linkedFraction()
//   repeatRate = turns landing on a word in the turning pair's last-6 history / turns
//   seenFrac   = distinct words shown during the run / lexicon size
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board } = await import(`./${process.env.BUILD ?? '.build'}/board.js`)
const { LEXICON, turns, degree } = await import(`./${process.env.BUILD ?? '.build'}/lexicon.sim.js`)
const { mulberry32 } = await import(`./${process.env.BUILD ?? '.build'}/field.js`)

const SEEDS = cfg.seeds ?? 10
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
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
  const last = new Map()
  let stalls = 0, attempts = 0, linkedSum = 0, linkedN = 0, repeats = 0, turnsDone = 0, stuckSum = 0, permSum = 0, stuckN = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  for (let t = 0; t < TICKS; t++) {
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    const pair = pool[Math.floor(Math.random() * pool.length)]
    attempts++
    const recent = new Set(pair.history.map((e) => e.word))
    let choice = board.chooseTurn(pair)
    let p2 = pair
    for (let k = 0; !choice && k < (cfg.retry ?? 0); k++) {
      p2 = pool[Math.floor(Math.random() * pool.length)]
      choice = board.chooseTurn(p2)
    }
    if (!choice) { stalls++; continue }
    if (p2 !== pair) { recent.clear(); for (const e of p2.history) recent.add(e.word) }
    if (recent.has(choice.entry.word)) repeats++
    board.turn(p2, choice)
    turnsDone++
    seen.add(choice.entry.word)
    last.set(p2, t)
    if (t % 10 === 0) { linkedSum += board.linkedFraction(); linkedN++ }
    if (t % 50 === 0) {
      let stuck = 0, perm = 0
      for (const p of board.pairs) {
        const prev = p.history.at(-1)?.word
        const n = [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => !board.used.has(e.word) && e.word !== prev).length, 0)
        if (n === 0) stuck++
        const nEmpty = [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => e.word !== prev).length, 0)
        if (nEmpty === 0) perm++
      }
      stuckSum += stuck / board.pairs.length; permSum += perm / board.pairs.length; stuckN++
    }
  }
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, stallRate: stalls / attempts, linked: linkedSum / Math.max(1, linkedN),
    stuck: stuckSum / Math.max(1, stuckN), stuckPerm: permSum / Math.max(1, stuckN), repeatRate: repeats / Math.max(1, turnsDone),
    seenFrac: seen.size / LEXICON.length, turnsPerPair: turnsDone / board.pairs.length })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
const r3 = (x) => +x.toFixed(3)
const pairs = avg('pairs')
console.log(JSON.stringify({ name: cfg.name, lexName: process.env.LEXNAME ?? process.env.LEX, lexicon: res.lexicon, deg3: res.deg3, deg5: res.deg5,
  grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}${cfg.keepSpacing ? 's' : ''}`,
  dealt: `${ok.length}/${res.runs.length}`, pairs: Math.round(pairs), occ: r3(pairs / res.lexicon), stallRate: r3(avg('stallRate')), stuck: r3(avg('stuck')),
  stuckPerm: r3(avg('stuckPerm')), stuckBoard: r3(avg('stuck') - avg('stuckPerm')),
  linked: r3(avg('linked')), repeatRate: r3(avg('repeatRate')), seenFrac: r3(avg('seenFrac')), turnsPerPair: +avg('turnsPerPair').toFixed(1),
  cfg: { linkMax: cfg.linkMax, dealMin: cfg.dealMin, matchMin: cfg.matchMin, retry: cfg.retry, dupFar: cfg.dupFar, seeds: SEEDS, ticks: TICKS } }))
