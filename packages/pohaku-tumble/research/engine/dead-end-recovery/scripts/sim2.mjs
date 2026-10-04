// Harness-mode driver: the same scheduler as sim.mjs (each tick = one beat:
// pick a random pair that hasn't turned in the last COOLDOWN ticks, call
// chooseTurn, optionally retry up to N other pairs), plus frozen-spell
// tracking and recovery moves for frozen pairs. Math.random is seeded per run,
// so every number is reproducible.
//
// CFG (JSON, env): sim.mjs knobs {name, cols, rows, horizontalOnly, slab, seeds,
//   ticks, dupFar, dealMin, matchMin, retry, linkMax, dealNear} plus
//   recover: ["unblock","back","dup","dt","dtprev","redeal"] in priority order
//   R:       ticks a pair must have been frozen before recovery may fire (0 = at once)
//   rDupFar: min distance to every other copy for the 'dup' recovery (0 = anywhere)
//   recoverOnRetry: also allow recovery on the retried pairs, not just the first pick
//   seek:    probability a beat goes to a pair frozen >= R ticks (only with recover)
//   recentW: chooseTurn weight multiplier for a word in the pair's last 6 (not a recovery)
// LEX: tier JSON path or "jukugo".
import { load, seedRandom, quantile } from './engine.mjs'

const cfg = JSON.parse(process.env.CFG || '{}')
const { RBoard, LEXICON, degree } = await load(cfg)

const SEEDS = cfg.seeds ?? 10
const TICKS = cfg.ticks ?? 1500
const COOLDOWN = 3
const LONG = cfg.long ?? 120 // a frozen spell this many beats old counts toward stuckLong (~2 min of Director play)
const R = cfg.R ?? 0
const RECOVER = cfg.recover ?? []
const KINDS = ['unblock', 'back', 'dup', 'dt', 'dtprev', 'redeal']

const runs = []
for (let s = 0; s < SEEDS; s++) {
  const seed = 1031 + s * 7919
  seedRandom(seed ^ 0x5bd1e995)
  let board
  try {
    board = new RBoard(seed)
  } catch (e) {
    runs.push({ seed, dealt: false, error: String(e.message) })
    continue
  }
  const P = board.pairs.length
  const last = new Map()
  const frozenSince = new Map()
  const spells = [] // completed frozen spells, in ticks
  const censored = [] // spells still running at the end
  let stalls = 0, attempts = 0, turnsDone = 0, tumbles = 0, repeats = 0
  let linkedSum = 0, linkedN = 0, frozenSum = 0, frozenN = 0
  let frozenPicked = 0, transientDups = 0, handoffsTaken = 0
  let stuckLongSum = 0, stuckEffSum = 0, stuckEffN = 0
  const fires = Object.fromEntries(KINDS.map((k) => [k, 0]))
  const cover = { n: 0, back: 0, unblock: 0, dup: 0, dupfar: 0, dt: 0, dtprev: 0, none: 0, deadEnd: 0, prevOnly: 0, boardOnly: 0 }
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  let handoff = null

  const isFrozen = (p) => board.freeExits(p) === 0
  for (const p of board.pairs) if (isFrozen(p)) frozenSince.set(p, 0)

  const applyTurn = (pair, choice, recent) => {
    if (recent.has(choice.entry.word)) repeats++
    board.turn(pair, choice)
    seen.add(choice.entry.word)
    turnsDone++
  }

  for (let t = 0; t < TICKS; t++) {
    const pool = board.pairs.filter((p) => t - (last.get(p) ?? -99) > COOLDOWN)
    let pair = null
    if (handoff && pool.includes(handoff)) { pair = handoff; handoffsTaken++ }
    else if (cfg.seek && RECOVER.length && Math.random() < cfg.seek) {
      // SIM.seek: with this probability the beat goes to a pair that has been frozen >= R ticks, if any
      const fz = pool.filter((p) => frozenSince.has(p) && t - frozenSince.get(p) >= R)
      pair = fz.length ? fz[Math.floor(Math.random() * fz.length)] : pool[Math.floor(Math.random() * pool.length)]
    } else pair = pool[Math.floor(Math.random() * pool.length)]
    handoff = null
    attempts++

    let done = false
    const tryPair = (p, allowRecover) => {
      const recent = new Set(p.history.map((e) => e.word))
      const choice = board.chooseTurn(p)
      if (choice) {
        applyTurn(p, choice, recent)
        tumbles++
        last.set(p, t)
        return true
      }
      if (!isFrozen(p)) return false // cannot happen: chooseTurn null <=> frozen
      frozenPicked++
      const c = board.coverage(p, { dupFar: cfg.rDupFar || 12 })
      cover.n++
      let any = false
      for (const k of ['back', 'unblock', 'dup', 'dupfar', 'dt', 'dtprev']) if (c[k]) { cover[k]++; any = true }
      for (const k of ['deadEnd', 'prevOnly', 'boardOnly']) if (c[k]) cover[k]++
      if (!any) cover.none++
      if (!allowRecover || !RECOVER.length) return false
      if (t - (frozenSince.get(p) ?? t) < R) return false
      for (const kind of RECOVER) {
        const act = board.recover(p, kind, {
          dupFar: cfg.rDupFar ?? 0,
          redealMin: cfg.dealMin ?? 2,
          eligible: (q) => t - (last.get(q) ?? -99) > COOLDOWN,
        })
        if (!act) continue
        fires[kind]++
        if (act.transientDup) transientDups++
        if (act.kind === 'dt' || act.kind === 'dtprev') {
          // judge the repeat on where the pair lands (W2), against history before the move
          const recent = new Set(p.history.map((e) => e.word))
          board.turn(p, act.steps[0].choice)
          seen.add(act.steps[0].choice.entry.word)
          applyTurn(p, act.steps[1].choice, recent)
          tumbles += 2
          last.set(p, t)
        } else if (act.kind === 'redeal') {
          const recent = new Set(p.history.map((e) => e.word))
          if (recent.has(act.steps[0].choice.entry.word)) repeats++
          board.setWord(p, act.steps[0].choice.entry)
          board.turnCount++
          seen.add(act.steps[0].choice.entry.word)
          turnsDone++
          last.set(p, t)
        } else {
          for (const st of act.steps) {
            const recent = new Set(st.pair.history.map((e) => e.word))
            applyTurn(st.pair, st.choice, recent)
            tumbles++
            last.set(st.pair, t)
          }
          if (act.handoff) handoff = act.handoff
        }
        return true
      }
      return false
    }

    done = tryPair(pair, true)
    for (let k = 0; !done && k < (cfg.retry ?? 0); k++) {
      const p2 = pool[Math.floor(Math.random() * pool.length)]
      done = tryPair(p2, !!cfg.recoverOnRetry)
    }
    if (!done) stalls++

    // frozen bookkeeping after the beat
    let fz = 0, fzLong = 0, fzEff = 0
    for (const p of board.pairs) {
      const f = isFrozen(p)
      if (f) fz++
      if (f && !frozenSince.has(p)) frozenSince.set(p, t + 1)
      else if (!f && frozenSince.has(p)) { spells.push(t + 1 - frozenSince.get(p)); frozenSince.delete(p) }
      if (f && t + 1 - frozenSince.get(p) >= LONG) fzLong++
      if (f && t % 5 === 0) {
        // effectively stuck: no configured recovery could move it either (ignores R and scheduler eligibility)
        const c = board.coverage(p, { dupFar: cfg.rDupFar || 12 })
        const k = { back: c.back, unblock: c.unblock, dup: (cfg.rDupFar ? c.dupfar : c.dup), dt: c.dt, dtprev: c.dtprev, redeal: true }
        if (!RECOVER.some((r) => k[r])) fzEff++
      }
    }
    frozenSum += fz / P; frozenN++
    stuckLongSum += fzLong / P
    if (t % 5 === 0) { stuckEffSum += fzEff / P; stuckEffN++ }
    if (t % 10 === 0) { linkedSum += board.linkedFraction(); linkedN++ }
  }
  for (const [, s0] of frozenSince) censored.push(TICKS - s0)
  const allSpells = [...spells, ...censored]
  const frozenTicks = allSpells.reduce((a, b) => a + b, 0)
  runs.push({
    seed, dealt: true, pairs: P,
    stallRate: stalls / attempts,
    stuck: frozenSum / frozenN,
    stuckLong: stuckLongSum / frozenN,
    stuckEff: stuckEffSum / Math.max(1, stuckEffN),
    linked: linkedSum / Math.max(1, linkedN),
    repeatRate: repeats / Math.max(1, turnsDone),
    seenFrac: seen.size / LEXICON.length,
    spellsPerPair: allSpells.length / P,
    spellMean: allSpells.length ? frozenTicks / allSpells.length : 0,
    spellP50: quantile(allSpells, 0.5),
    spellP90: quantile(allSpells, 0.9),
    spellMax: allSpells.length ? Math.max(...allSpells) : 0,
    // share of all frozen pair-ticks that sit in spells >= 150 ticks (~ 2.5 min of Director time)
    longShare: frozenTicks ? allSpells.filter((x) => x >= 150).reduce((a, b) => a + b, 0) / frozenTicks : 0,
    // pairs frozen for >= 90% of the run
    permaFrac: board.pairs.filter((p) => frozenSince.has(p) && TICKS - frozenSince.get(p) >= 0.9 * TICKS).length / P,
    frozenPickRate: frozenPicked / attempts,
    tumblesPerBeat: tumbles / attempts,
    transientDupsPer1k: (1000 * transientDups) / attempts,
    handoffsPer1k: (1000 * handoffsTaken) / attempts,
    firesPer1k: Object.fromEntries(KINDS.map((k) => [k, (1000 * fires[k]) / attempts])),
    cover: Object.fromEntries(Object.entries(cover).map(([k, v]) => [k, k === 'n' ? v : v / Math.max(1, cover.n)])),
  })
}

const ok = runs.filter((r) => r.dealt)
const avg = (f) => ok.reduce((s, r) => s + f(r), 0) / Math.max(1, ok.length)
const r3 = (x) => +x.toFixed(3)
const out = {
  name: cfg.name, lexicon: LEXICON.length, dealMin: cfg.dealMin,
  deg2: LEXICON.filter((e) => degree(e) >= 2).length,
  deg5: LEXICON.filter((e) => degree(e) >= 5).length,
  grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}`,
  dealt: `${ok.length}/${runs.length}`,
  pairs: Math.round(avg((r) => r.pairs)),
}
for (const k of ['stallRate', 'stuck', 'stuckLong', 'stuckEff', 'linked', 'repeatRate', 'seenFrac', 'spellsPerPair', 'spellMean', 'spellP50', 'spellP90', 'spellMax', 'longShare', 'permaFrac', 'frozenPickRate', 'tumblesPerBeat', 'transientDupsPer1k', 'handoffsPer1k'])
  out[k] = r3(avg((r) => r[k]))
out.firesPer1k = Object.fromEntries(KINDS.map((k) => [k, r3(avg((r) => r.firesPer1k[k]))]).filter(([, v]) => v > 0))
out.cover = Object.fromEntries(Object.keys(ok[0]?.cover ?? {}).map((k) => [k, r3(avg((r) => r.cover[k]))]))
if (runs.some((r) => !r.dealt)) out.dealErrors = [...new Set(runs.filter((r) => !r.dealt).map((r) => r.error))]
console.log(JSON.stringify(out))
