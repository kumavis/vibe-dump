// repro: a Director model — MY OWN construction from jukugo director.js + main.js (camera drift, inView,
// note beat) plus the spec's Director changes. The reference DENGINES.POHAKU was NOT available to me, so
// this is an independent model, not a re-implementation of it. Assumptions are listed in NOTES.md.
//   CFG: {engine:'pohaku'|'stock', cols, rows | grid:'auto', seeds, seconds, W, H, dealMin (stock), ...}
// Metrics:
//   beatsLost  background beats that turned nothing / background beats
//   stuck      share of IN-VIEW pairs with no legal turn (POHAKU: canTurn false; stock: no turn to an
//              off-board word != prev), sampled every 5 s
//   stuckAll   share of IN-VIEW pairs with no turn onto an off-board word != prev (strict frozen), every 5 s
//   stuckBoard / stuckAllBoard: the same two over ALL pairs on the board
//   stuckFreeBoard: ALL pairs with no turn onto ANY off-board word (previous word allowed whatever the rest timer)
//   repeat     turns (background + noted) landing on a word in the pair's last-6 history / turns
//   linked     share of in-view pairs carrying a pair link, every 5 s
//   noteFail   noted turns that found nothing (the note retires) / noted turn attempts
//   seen       distinct words shown / full lexicon
const cfg = JSON.parse(process.env.CFG || '{}')
globalThis.SIM = cfg
const engine = cfg.engine ?? 'pohaku'
let L
if (engine === 'pohaku') {
  L = await import('./.build/pohaku/lexicon.pohaku.js')
  if (cfg.grid === 'auto' || cfg.cols == null) Object.assign(cfg, L.autoGrid())
} else {
  cfg.horizontalOnly = true
  cfg.slab = 1.5
  cfg.scaleFloor = true
  L = await import('./.build/lexicon.sim.js')
}
const boardMod = await import(engine === 'pohaku' ? './.build/pohaku/board.js' : './.build/board.js')
const fieldMod = await import(engine === 'pohaku' ? './.build/pohaku/field.js' : './.build/field.js')
const { Board } = boardMod
const { BOUNDS } = fieldMod
const { LEXICON, turns } = L

const W = cfg.W ?? 1280
const H = cfg.H ?? 800
const SECONDS = cfg.seconds ?? 3000
const DT = 0.05
const ROLL = 0.86
const capacity = W < 520 ? 1 : W < 700 ? 2 : W < 1440 ? 3 : 4

function makeView() {
  const v = { tx: 0, tz: 0, yaw: 0, pitch: 1, ppu: 50, r: null, u: null }
  const clampX = (x) => Math.max(BOUNDS.x0 + 6, Math.min(BOUNDS.x1 - 6, x))
  const clampZ = (z) => Math.max(BOUNDS.z0 + 4, Math.min(BOUNDS.z1 - 4, z))
  v.update = (t) => {
    const base = Math.max(34, Math.min(60, Math.min(W, H) / 17))
    v.ppu = base * (1 + 0.035 * Math.sin((t / 53) * Math.PI * 2))
    v.tx = clampX(2.5 * Math.sin((t / 97) * Math.PI * 2) + 1.4 * Math.sin((t / 41) * Math.PI * 2))
    v.tz = clampZ(1.8 * Math.sin((t / 83) * Math.PI * 2 + 1))
    v.yaw = ((-3 + 5 * Math.sin((t / 120) * Math.PI * 2)) * Math.PI) / 180
    v.pitch = ((55 + 2.5 * Math.sin((t / 71) * Math.PI * 2)) * Math.PI) / 180
    // orthographic camera at (tx + D sin(yaw) cos(pitch), D sin(pitch), tz + D cos(yaw) cos(pitch)) looking at (tx,0,tz)
    const f = [-Math.sin(v.yaw) * Math.cos(v.pitch), -Math.sin(v.pitch), -Math.cos(v.yaw) * Math.cos(v.pitch)]
    // right = f x up(0,1,0) = (-f.z, 0, f.x) normalised
    let r = [-f[2], 0, f[0]]
    const rl = Math.hypot(...r)
    r = r.map((c) => c / rl)
    // u = r x f
    const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
    v.r = r
    v.u = u
  }
  v.project = (x, y, z) => {
    const d = [x - v.tx, y, z - v.tz]
    const sx = d[0] * v.r[0] + d[1] * v.r[1] + d[2] * v.r[2]
    const sy = d[0] * v.u[0] + d[1] * v.u[1] + d[2] * v.u[2]
    return [W / 2 + sx * v.ppu, H / 2 - sy * v.ppu]
  }
  return v
}

const SEEDS = cfg.seeds ?? 10
const SEED0 = cfg.seed0 ?? 0
const runs = []
for (let s = SEED0; s < SEED0 + SEEDS; s++) {
  const seed = 1031 + s * 7919
  let board
  try {
    board = new Board(seed)
  } catch (e) {
    runs.push({ dealt: false })
    continue
  }
  const view = makeView()
  const busy = new Map()
  const lastTurn = new Map()
  let notes = [] // {pair, nextTurn, turnsLeft}
  let nextBackground = 3.6
  let nextNoteCheck = 1.7
  let beats = 0, lost = 0, turnsDone = 0, repeats = 0, noteTries = 0, noteFails = 0
  let stuckSum = 0, stuckAllSum = 0, linkedSum = 0, samples = 0, inViewSum = 0, stuckBSum = 0, stuckAllBSum = 0, freeBSum = 0
  const seen = new Set(board.pairs.map((p) => p.entry.word))
  for (const p of board.pairs) busy.set(p, 2.0) // opening drop-in

  const inView = (margin = 0.1) =>
    board.pairs.filter((p) => {
      const [x, y] = view.project(p.x, 0.5, p.z)
      return x > W * margin && x < W * (1 - margin) && y > H * (margin + 0.06) && y < H * (1 - margin - 0.04)
    })
  const rolling = (p, now) => now < (busy.get(p) ?? 0)
  const linkedIn = (pairs) => {
    if (!pairs.length) return 0
    const linked = new Set()
    for (const l of board.desiredLinks().values()) if (l.kind === 'pair') linked.add(l.a.pair).add(l.b.pair)
    return pairs.filter((p) => linked.has(p.id)).length / pairs.length
  }
  const frozen = (p) => {
    const prev = p.history.at(-1)?.word
    return [0, 1].every((i) => turns(p.entry, i).every((e) => board.used.has(e.word) || e.word === prev))
  }
  const canTurn = (p, now) => (engine === 'pohaku' ? board.canTurn(p, now) : !frozen(p))
  const canTwo = (p, now) =>
    board.candidates(p, now).some((c) => [0, 1].some((i) => turns(c.entry, i).some((f) => !board.used.has(f.word))))
  const hasTier0 = (p, now) => board.candidates(p, now).some((c) => c.tier === 0)

  const turnPair = (pair, now) => {
    if (rolling(pair, now)) return false
    const recent = new Set(pair.history.map((e) => e.word))
    const choice = engine === 'pohaku' ? board.chooseTurn(pair, now, linkedIn(inView())) : board.chooseTurn(pair)
    if (!choice) return false
    if (recent.has(choice.entry.word)) repeats++
    if (engine === 'pohaku') board.turn(pair, choice, now)
    else board.turn(pair, choice)
    turnsDone++
    seen.add(choice.entry.word)
    busy.set(pair, now + 0.12 + ROLL)
    lastTurn.set(pair, now)
    return true
  }
  const pickForNote = (visible, now) => {
    const inner = new Set(inView(0.2))
    const noted = new Set(notes.map((n) => n.pair))
    const anchors = notes.map((n) => view.project(n.pair.x, 1, n.pair.z))
    let best = null
    let bestScore = -Infinity
    for (const p of visible) {
      if (!inner.has(p) || noted.has(p) || rolling(p, now)) continue
      const [x, y] = view.project(p.x, 1, p.z)
      let far = Infinity
      for (const [ax, ay] of anchors) far = Math.min(far, Math.hypot(ax - x, ay - y))
      let score = Math.min(far, 420) + Math.random() * 160 - (now - (lastTurn.get(p) ?? -99) < 4 ? 300 : 0)
      if (engine === 'pohaku') {
        if (!canTwo(p, now)) score -= 1000
        if (!hasTier0(p, now)) score -= 1000
      }
      if (score > bestScore) {
        best = p
        bestScore = score
      }
    }
    return best
  }

  let nextSample = 5
  for (let now = 0; now < SECONDS; now += DT) {
    view.update(now)
    const visible = inView()
    const roughly = new Set(inView(-0.05))
    // noted words
    const keep = []
    for (const note of notes) {
      if (!roughly.has(note.pair)) continue // closes
      if (now < note.nextTurn) { keep.push(note); continue }
      if (note.turnsLeft > 0) {
        noteTries++
        if (turnPair(note.pair, now)) {
          note.turnsLeft--
          note.nextTurn = now + (note.turnsLeft > 0 ? 4.2 + Math.random() * 1.6 : 3.4)
        } else {
          note.nextTurn = now + 0.6
          if (!rolling(note.pair, now)) { note.turnsLeft = 0; noteFails++ }
        }
        keep.push(note)
      } // else: closes
    }
    notes = keep
    if (now >= nextNoteCheck) {
      nextNoteCheck = now + 0.45
      if (notes.length < capacity) {
        const pair = pickForNote(visible, now)
        if (pair) {
          notes.push({ pair, nextTurn: now + 1.15, turnsLeft: 2 })
          nextNoteCheck = now + 0.9 + Math.random() * 0.8
        }
      }
    }
    if (now >= nextBackground) {
      beats++
      const noted = new Set(notes.map((n) => n.pair))
      let pool = visible.filter((p) => !noted.has(p) && !rolling(p, now) && now - (lastTurn.get(p) ?? -99) > 6)
      if (engine === 'pohaku') pool = pool.filter((p) => board.canTurn(p, now))
      let ok = false
      if (pool.length) ok = turnPair(pool[Math.floor(Math.random() * pool.length)], now)
      if (!ok) lost++
      nextBackground = now + 1.5 + Math.random() * 1.1
    }
    if (now >= nextSample) {
      nextSample += 5
      if (visible.length) {
        stuckSum += visible.filter((p) => !canTurn(p, now)).length / visible.length
        stuckAllSum += visible.filter(frozen).length / visible.length
        stuckBSum += board.pairs.filter((p) => !canTurn(p, now)).length / board.pairs.length
        stuckAllBSum += board.pairs.filter(frozen).length / board.pairs.length
        freeBSum += board.pairs.filter((p) => [0, 1].every((i) => turns(p.entry, i).every((e) => board.used.has(e.word)))).length / board.pairs.length
        linkedSum += linkedIn(visible)
        inViewSum += visible.length
        samples++
      }
    }
  }
  runs.push({ dealt: true, pairs: board.pairs.length, inView: inViewSum / samples, beatsLost: lost / beats, stuck: stuckSum / samples, stuckAll: stuckAllSum / samples, stuckBoard: stuckBSum / samples, stuckAllBoard: stuckAllBSum / samples, stuckFreeBoard: freeBSum / samples,
    repeat: repeats / Math.max(1, turnsDone), linked: linkedSum / samples, noteFail: noteFails / Math.max(1, noteTries), seen: seen.size / LEXICON.length, turnsPerMin: turnsDone / (SECONDS / 60) })
}
const ok = runs.filter((r) => r.dealt)
const avg = (k) => +(ok.reduce((s, r) => s + r[k], 0) / Math.max(1, ok.length)).toFixed(3)
console.log(JSON.stringify({ name: cfg.name, engine, model: 'director', lexicon: LEXICON.length, playable: L.PLAYABLE ? L.PLAYABLE.length : LEXICON.length, grid: `${cfg.cols}x${cfg.rows}`,
  seconds: SECONDS, dealt: `${ok.length}/${runs.length}`, pairs: avg('pairs'), inView: avg('inView'), beatsLost: avg('beatsLost'), stuck: avg('stuck'), stuckAll: avg('stuckAll'), stuckBoard: avg('stuckBoard'), stuckAllBoard: avg('stuckAllBoard'), stuckFreeBoard: avg('stuckFreeBoard'),
  repeat: avg('repeat'), linked: avg('linked'), noteFail: avg('noteFail'), seen: avg('seen'), turnsPerMin: avg('turnsPerMin') }))
