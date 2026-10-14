// Run the real Jukugo Board (deal + chooseTurn + desiredLinks) against a
// lexicon and report whether it deals, how often a chosen pair has nowhere to
// turn, how linked the floor stays, and how much of the lexicon gets seen.
// The scheduler is a simplification of Director: each tick turns one random
// pair that hasn't turned in the last COOLDOWN ticks (≈ the 6 s rule).
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board } = await import('./build/board.js')
const { LEXICON, turns, degree } = await import('./build/lexicon.sim.js')

const SEEDS = cfg.seeds ?? 12
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const res = { lexicon: LEXICON.length, deg5: LEXICON.filter((e) => degree(e) >= 5).length, deg3: LEXICON.filter((e) => degree(e) >= 3).length, runs: [] }
for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    res.runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const last = new Map()
  let stalls = 0, attempts = 0, linkedSum = 0, linkedN = 0, repeats = 0, turnsDone = 0, stuckSum = 0, stuckN = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  for (let t = 0; t < TICKS; t++) {
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    const pair = pool[Math.floor(Math.random() * pool.length)]
    attempts++
    const recent = new Set(pair.history.map((e) => e.word))
    let choice = board.chooseTurn(pair)
    // SIM.retry: like a Director that, finding nowhere to turn, tries up to N other idle pairs this beat
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
      let stuck = 0
      for (const p of board.pairs) {
        const prev = p.history.at(-1)?.word
        const n = [0, 1].reduce((acc, i) => acc + turns(p.entry, i).filter((e) => !board.used.has(e.word) && e.word !== prev).length, 0)
        if (n === 0) stuck++
      }
      stuckSum += stuck / board.pairs.length; stuckN++
    }
  }
  res.runs.push({ seed, dealt: true, pairs: board.pairs.length, stallRate: stalls / attempts, linked: linkedSum / Math.max(1, linkedN),
    stuck: stuckSum / Math.max(1, stuckN), repeatRate: repeats / Math.max(1, turnsDone), seenFrac: seen.size / LEXICON.length })
}
const ok = res.runs.filter((r) => r.dealt)
const avg = (k) => ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)
console.log(JSON.stringify({ name: cfg.name, lexicon: res.lexicon, deg3: res.deg3, deg5: res.deg5, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}`,
  dealt: `${ok.length}/${res.runs.length}`, pairs: Math.round(avg('pairs')), stallRate: +avg('stallRate').toFixed(3), stuck: +avg('stuck').toFixed(3),
  linked: +avg('linked').toFixed(3), repeatRate: +avg('repeatRate').toFixed(3), seenFrac: +avg('seenFrac').toFixed(3) }))
