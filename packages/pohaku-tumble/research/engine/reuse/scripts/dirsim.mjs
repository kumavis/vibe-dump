// A closer copy of Jukugo's Director (director.js) driving the patched Board,
// in simulated seconds, with Jukugo's default camera drift (main.js updateView)
// and a 1280x800 window. Use it to check a configuration found with sim.mjs.
//
// What it copies: background beat every 1.5–2.6 s from pairs comfortably in
// view (Director.inView(0.1)), not noted, not mid-roll (≈1 s), not turned in the
// last 6 s; notes (capacity 3 at 1280 px) opened every 0.45 s check on a well-
// inside pair (inView(0.2)) scored as pickForNote; a noted pair turns 1.15 s
// after opening, again 4.2–5.8 s later, then closes 3.4 s after; a noted pair
// with nowhere to turn retires at once; a note whose pair drifts out of
// inView(-0.05) closes. cfg.retry = N lets a lost background beat try up to N
// other pool pairs (the Director itself does not).
// What it leaves out: user pan/zoom/poke, card layout, animation timing beyond
// the 1 s roll. Window: 26 x 17 world units visible (the brief's figure); the
// Director's screen-margin windows are taken as fractions of that.
//
// Metrics:
//  bgLost     share of background beats with a non-empty pool and no turn (after retries)
//  bgEmpty    share of background beats with an empty pool
//  noteFail   share of note turn attempts (pair not mid-roll) with no legal turn
//  noteShort  share of notes that retired with fewer than 2 turns for lack of a turn
//  cardFlip   share of notes whose 2nd turn returns to the word the card opened on
//  repeat     share of all turns landing on a word in the pair's last 6
//  flip       share of all turns landing on the pair's immediately previous word
//  linked     mean linkedFraction, sampled every 5 s
//  stuckView  mean share of pairs in view (inView(0.1)) with no legal turn, every 10 s
//  dupView    share of 1 s samples in which the camera window holds two copies of a word
//  dupNear    share of 1 s samples with two copies of a word within LINK_MAX of each other
//  tpm        turns per minute
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const { Board, LINK_MAX } = await import('./.build/board.js')
const { LEXICON } = await import('./.build/lexicon.sim.js')
const { mulberry32 } = await import('./.build/field.js')

const SEEDS = cfg.seeds ?? 10
const DURATION = cfg.seconds ?? 3600
const BEAT = 2.05
const VIEW = { w: 26, h: 17 }
const PPU = 47 // px per unit at 1280x800 (main.js: min(800,1280)/17)
const ROLL = 1.0
const CAPACITY = 3
const camAt = (s) => [2.5 * Math.sin((s / 97) * Math.PI * 2) + 1.4 * Math.sin((s / 41) * Math.PI * 2), 1.8 * Math.sin((s / 83) * Math.PI * 2 + 1)]
// Director.inView(margin): x in (w*m, w*(1-m)), y in (h*(m+0.06), h*(1-m-0.04)); y grows with z
function inView(p, s, margin) {
  const [cx, cz] = camAt(s)
  const x0 = cx - VIEW.w / 2
  const z0 = cz - VIEW.h / 2
  return p.x > x0 + VIEW.w * margin && p.x < x0 + VIEW.w * (1 - margin) && p.z > z0 + VIEW.h * (margin + 0.06) && p.z < z0 + VIEW.h * (1 - margin - 0.04)
}

const runs = []
for (let k = 0; k < SEEDS; k++) {
  const seed = 1031 + k * 7919
  Math.random = mulberry32(seed ^ 0x2545f491)
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    runs.push({ dealt: false })
    continue
  }
  const lastTurn = new Map()
  const rollingUntil = new Map()
  const notes = [] // { pair, nextTurn, turnsLeft, opened, done }
  const M = { bgBeats: 0, bgLost: 0, bgEmpty: 0, noteTries: 0, noteFails: 0, notes: 0, noteShort: 0, noteFlip: 0, note2: 0, turns: 0, repeats: 0, flips: 0,
    linkedSum: 0, linkedN: 0, stuckSum: 0, stuckN: 0, dupViewHits: 0, dupNearHits: 0, dupN: 0 }
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  const rolling = (p, now) => (rollingUntil.get(p) ?? -1) > now
  function turnPair(p, now) {
    if (rolling(p, now)) return false
    board.clock = now / BEAT
    const choice = board.chooseTurn(p)
    if (!choice) return null
    if (p.history.some((e) => e.word === choice.entry.word)) M.repeats++
    if (p.history.at(-1)?.word === choice.entry.word) M.flips++
    board.turn(p, choice)
    M.turns++
    seen.add(choice.entry.word)
    lastTurn.set(p, now)
    rollingUntil.set(p, now + ROLL)
    return true
  }
  let nextBackground = 3.6
  let nextNoteCheck = 1.7
  const DT = 0.05
  for (let now = 0; now < DURATION; now += DT) {
    const visible = board.pairs.filter((p) => inView(p, now, 0.1))
    // notes
    for (const n of [...notes]) {
      if (!inView(n.pair, now, -0.05)) {
        notes.splice(notes.indexOf(n), 1)
        continue
      }
      if (now < n.nextTurn) continue
      if (n.turnsLeft > 0) {
        const r = turnPair(n.pair, now)
        if (r !== false) M.noteTries++
        if (r) {
          n.turnsLeft--
          n.done++
          if (n.done === 2) {
            M.note2++
            if (n.pair.entry.word === n.opened) M.noteFlip++
          }
          n.nextTurn = now + (n.turnsLeft > 0 ? 4.2 + Math.random() * 1.6 : 3.4)
        } else {
          n.nextTurn = now + 0.6
          if (r === null) {
            M.noteFails++
            n.turnsLeft = 0
            if (n.done < 2) M.noteShort++
          }
        }
      } else notes.splice(notes.indexOf(n), 1)
    }
    if (now >= nextNoteCheck) {
      nextNoteCheck = now + 0.45
      if (notes.length < CAPACITY) {
        const noted = new Set(notes.map((n) => n.pair))
        let best = null
        let bestScore = -Infinity
        for (const p of visible) {
          if (!inView(p, now, 0.2) || noted.has(p) || rolling(p, now)) continue
          let far = Infinity
          for (const n of notes) far = Math.min(far, Math.hypot((n.pair.x - p.x) * PPU, (n.pair.z - p.z) * PPU * 0.82))
          const score = Math.min(far, 420) + Math.random() * 160 - (now - (lastTurn.get(p) ?? -99) < 4 ? 300 : 0)
          if (score > bestScore) {
            best = p
            bestScore = score
          }
        }
        if (best) {
          notes.push({ pair: best, nextTurn: now + 1.15, turnsLeft: 2, opened: best.entry.word, done: 0 })
          M.notes++
          nextNoteCheck = now + 0.9 + Math.random() * 0.8
        }
      }
    }
    // background
    if (now >= nextBackground) {
      const noted = new Set(notes.map((n) => n.pair))
      const pool = visible.filter((p) => !noted.has(p) && !rolling(p, now) && now - (lastTurn.get(p) ?? -99) > 6)
      M.bgBeats++
      if (!pool.length) M.bgEmpty++
      else {
        let ok = turnPair(pool[Math.floor(Math.random() * pool.length)], now)
        for (let r = 0; !ok && r < (cfg.retry ?? 0); r++) ok = turnPair(pool[Math.floor(Math.random() * pool.length)], now)
        if (!ok) M.bgLost++
      }
      nextBackground = now + 1.5 + Math.random() * 1.1
    }
    // samples
    const tick = Math.round(now / DT)
    if (tick % Math.round(1 / DT) === 0) {
      const by = new Map()
      for (const p of board.pairs) {
        let l = by.get(p.entry.word)
        if (!l) by.set(p.entry.word, (l = []))
        l.push(p)
      }
      const groups = [...by.values()].filter((l) => l.length > 1)
      M.dupN++
      const [cx, cz] = camAt(now)
      if (groups.some((l) => l.filter((p) => Math.abs(p.x - cx) <= VIEW.w / 2 && Math.abs(p.z - cz) <= VIEW.h / 2).length > 1)) M.dupViewHits++
      if (groups.some((l) => l.some((p, i) => l.some((q, j) => j > i && Math.hypot(p.x - q.x, p.z - q.z) <= LINK_MAX)))) M.dupNearHits++
    }
    if (tick % Math.round(5 / DT) === 0) {
      M.linkedSum += board.linkedFraction()
      M.linkedN++
    }
    if (tick % Math.round(10 / DT) === 0 && visible.length) {
      board.clock = now / BEAT
      M.stuckSum += visible.filter((p) => board.options(p, 0.5).length === 0).length / visible.length
      M.stuckN++
    }
  }
  runs.push({ dealt: true, pairs: board.pairs.length, bgLost: M.bgLost / M.bgBeats, bgEmpty: M.bgEmpty / M.bgBeats, noteFail: M.noteFails / Math.max(1, M.noteTries),
    noteShort: M.noteShort / Math.max(1, M.notes), cardFlip: M.noteFlip / Math.max(1, M.note2), repeat: M.repeats / Math.max(1, M.turns), flip: M.flips / Math.max(1, M.turns),
    linked: M.linkedSum / M.linkedN, stuckView: M.stuckSum / Math.max(1, M.stuckN), dupView: M.dupViewHits / M.dupN, dupNear: M.dupNearHits / M.dupN,
    tpm: M.turns / (DURATION / 60), seenFrac: seen.size / LEXICON.length })
}
const ok = runs.filter((r) => r.dealt)
const avg = (key) => +(ok.reduce((s, r) => s + r[key], 0) / Math.max(1, ok.length)).toFixed(3)
const out = { name: cfg.name, lexicon: LEXICON.length, grid: `${cfg.cols ?? 9}x${cfg.rows ?? 8}${cfg.scaleBounds ? 's' : ''}`, dealt: `${ok.length}/${runs.length}` }
for (const key of ['pairs', 'bgLost', 'bgEmpty', 'noteFail', 'noteShort', 'cardFlip', 'repeat', 'flip', 'linked', 'stuckView', 'dupView', 'dupNear', 'tpm', 'seenFrac']) out[key] = avg(key)
out.cfg = cfg
console.log(JSON.stringify(out))
