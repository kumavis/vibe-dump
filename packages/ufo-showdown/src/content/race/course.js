// The Hyperspace Run course, planned a stretch at a time. Single-file ring
// trails (lines, S-curves, zig-zags, staircases, big hoops, ring-and-bomb
// gates) take turns with forks, where the trail splits into two or three
// lanes:
//
//   gold  skinny rings in a tight zig-zag, half of them gold, with bombs
//         waiting for anyone who cuts a corner. Worth the most by far.
//   mid   ordinary rings with a gentle sway and a gold one at the end, and a
//         bomb that drifts in from the side.
//   safe  a few big rings in a straight line and nothing else (now and then
//         a power-up bubble). Easy, but worth the least.
//
// Each lane's entry ring carries a badge with its stars, and glowing arrows
// lead from the end of the trail to each one, so the choice can be made in
// the second or so between seeing the split and reaching it.
//
// Everything is planned in arrival times: `at` is the race-clock second an
// item reaches the ships' line. The course moves at speedAt(t), climbing the
// whole way, so distAt(at) is where along the course an item sits and the
// level turns that into a height on screen. Saucer events are the exception:
// their `at` is when they launch.
//
// Kept free of the canvas and the game API, so the course can be checked (and
// scored) from Node.

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (k) => k * k * (3 - 2 * k)

export const V0 = 300 // how fast the course moves at "go", in units a second
export const V1 = 640 // and at the finish
export const FINISH = 76 // seconds from "go" to the finish gate
export const INTRO = 2.4 // the intro banner: the course is already moving under it
export const SHIP = 440 // a Striker's top speed. Every sideways hop is planned for well under it

// The ellipse a ring is drawn as, as a fraction of its width.
export const SQUASH = 0.32
export const RX = { wide: 96, normal: 78, narrow: 56 }

// Cruising during the intro, a punch up to full speed at "go", then a steady
// climb that steepens towards the end: about twice as fast at the finish.
export function speedAt(t) {
  if (t < 0) return V0 * 0.5
  const jump = t < 0.7 ? 0.5 + 0.5 * smooth(t / 0.7) : 1
  const k = Math.min(1, t / FINISH)
  return (V0 + (V1 - V0) * (0.5 * k + 0.5 * k * k)) * jump
}

// Distance travelled by race-clock t, from a table built once at load.
const STEP = 1 / 120
const T0 = -INTRO - 2
const TABLE = new Float64Array(Math.ceil((FINISH + 40 - T0) / STEP) + 2)
for (let i = 1; i < TABLE.length; i++) TABLE[i] = TABLE[i - 1] + speedAt(T0 + (i - 0.5) * STEP) * STEP

export function distAt(t) {
  const u = clamp((t - T0) / STEP, 0, TABLE.length - 1.001)
  const i = Math.floor(u)
  return TABLE[i] + (TABLE[i + 1] - TABLE[i]) * (u - i)
}

// The race gets meaner as it goes: a gentle start, then drifting bombs and
// swooping saucers, then saucers that park and shoot or drop bombs, then
// saucers that streak straight down the screen.
export const stageAt = (t) => (t < 14 ? 0 : t < 32 ? 1 : t < 52 ? 2 : 3)
const GAP = [0.5, 0.45, 0.41, 0.38] // seconds between trail rings, by stage

// How far sideways a ship can be asked to go between two rings dt apart:
// well under its top speed, plus the slack of flying through off-centre.
const reach = (dt, rxa, rxb) => SHIP * 0.6 * dt + 0.3 * (rxa + rxb)
const needT = (dx, rxa, rxb) => Math.max(0, Math.abs(dx) - 0.3 * (rxa + rxb)) / (SHIP * 0.6)

// Keep a ring's whole hoop on screen.
const edge = (rx) => rx + 18
const fit = (x, rx, W) => clamp(x, Math.min(edge(rx), W / 2), Math.max(W - edge(rx), W / 2))
// How far a pattern can swing either side of the middle.
const room = (rx, W) => Math.max(0, W / 2 - edge(rx))

// The speeds the course paints on itself as it passes them.
const tWhen = (v) => {
  const a = (v - V0) / (V1 - V0)
  const k = (-1 + Math.sqrt(1 + 8 * a)) / 2
  return k * FINISH
}

export function newCourse(W) {
  const c = {
    W,
    items: [], // what's been planned, kept a little while for spacing checks
    events: [], // saucer launches, on the race clock
    exits: [{ t: 0.4, x: W / 2, rx: 60 }], // where the last stretch left off
    forkN: 0,
    trailN: 0,
    nextFork: 9.5,
    last: null,
    lastGold: 0,
    pal: 0,
    id: 0,
    told: {},
    sauceT: 0,
    finishAt: FINISH,
    done: false,
  }
  for (const w of [4, 5, 6]) paint(c, tWhen(w * 100), `Warp ${w}!`, '#ffe23d', true)
  paint(c, FINISH - 11, 'Final stretch!', '#ffb02e', true)
  return c
}

// Plan the next stretch of course. Returns the new items, sorted by time.
export function planNext(c) {
  if (c.done) return []
  const n0 = c.items.length
  const t = latest(c)
  if (t > FINISH - 3.4) planFinish(c, t)
  else if (t >= c.nextFork - 0.5 && t + 5 < FINISH - 2.5) planFork(c)
  else planTrail(c)
  const fresh = c.items.slice(n0).sort((a, b) => a.at - b.at)
  // forget what's long gone; the spacing checks only look a second or so back
  c.items = c.items.filter((it) => (it.at1 ?? it.at) > t - 2)
  return fresh
}

export const latest = (c) => Math.max(...c.exits.map((e) => e.t))

// The earliest a ring at x can come and still be reachable from wherever the
// last stretch ended (every lane of a fork).
function startAfter(c, x, rx, breather) {
  let t = 0
  for (const e of c.exits) t = Math.max(t, e.t + Math.max(breather, needT(x - e.x, e.rx, rx) + 0.08))
  return t
}

function paint(c, at, text, color, big = false) {
  c.items.push({ kind: 'paint', at, x: c.W / 2, text, color, big })
}

function event(c, at, mode, o = {}) {
  // never two saucers arriving on top of each other, and none to spoil the
  // run through the finish gate
  at = Math.max(at, c.sauceT)
  if (at > FINISH - 2.2) return
  c.events.push({ at, mode, ...o })
  c.sauceT = at + (mode === 'streak' ? 1.1 : 1.7)
}

// ---------------------------------------------------------------- trails

const MENU = [
  { line: 2, scurve: 3, wide: 2, zigzag: 2 },
  { scurve: 3, zigzag: 3, stair: 2, wide: 2, line: 1, gates: 3 },
  { scurve: 2, zigzag: 3, stair: 2, gates: 3, narrow: 2, wide: 1 },
  { zigzag: 3, stair: 2, gates: 3, narrow: 2, scurve: 2 },
]

function choose(menu, last) {
  const w = { ...menu }
  delete w[last]
  let total = 0
  for (const k in w) total += w[k]
  let r = Math.random() * total
  for (const k in w) {
    r -= w[k]
    if (r <= 0) return k
  }
  return 'scurve'
}

// One trail pattern starting near `cx`: its rings (and, for the gates, the
// bombs that come with them) on the pattern's own clock.
export function trailPattern(kind, { W, cx, gap, st }) {
  const rings = []
  const bombs = []
  const gate = (at, x, rx, gold = false) => rings.push({ at, x: fit(x, rx, W), rx, gold })
  const side = Math.random() < 0.5 ? -1 : 1
  const rxN = st === 0 ? 86 : RX.normal

  switch (kind) {
    case 'line': {
      // a straight run that leans a little to one side
      const n = st ? 5 : 4
      const lean = rand(10, 22) * side
      const c = clamp(cx, edge(rxN) + n * 22, W - edge(rxN) - n * 22)
      for (let i = 0; i < n; i++) gate(i * gap * 1.1, c + (i - (n - 1) / 2) * lean, rxN)
      break
    }
    case 'scurve': {
      const n = 8
      const A = Math.min(st ? 150 : 110, room(rxN, W) * 0.9)
      const step = Math.min(0.8, (reach(gap, rxN, rxN) * 0.85) / Math.max(1, A))
      const c = clamp(cx, edge(rxN) + A, W - edge(rxN) - A)
      const ph = side > 0 ? 0 : Math.PI
      for (let i = 0; i < n; i++) gate(i * gap, c + A * Math.sin(i * step + ph), rxN)
      break
    }
    case 'zigzag': {
      const n = 6
      const dt = gap * 1.25
      const Z = Math.min(st ? 100 : 80, room(rxN, W), (reach(dt, rxN, rxN) * 0.85) / 2)
      const c = clamp(cx, edge(rxN) + Z, W - edge(rxN) - Z)
      for (let i = 0; i < n; i++) gate(i * dt, c + (i % 2 ? Z : -Z) * side, rxN)
      break
    }
    case 'stair': {
      // a diagonal sweep across the screen
      const n = 6
      const step = Math.min(58, (room(rxN, W) * 2) / (n - 1), reach(gap, rxN, rxN) * 0.7)
      const dir = cx > W / 2 ? -1 : 1
      const span = step * (n - 1)
      const x0 = clamp(cx - (dir * span) / 2, edge(rxN), W - edge(rxN))
      const start = dir > 0 ? Math.min(x0, W - edge(rxN) - span) : Math.max(x0, edge(rxN) + span)
      for (let i = 0; i < n; i++) gate(i * gap, start + dir * i * step, rxN)
      break
    }
    case 'wide': {
      // big hoops a jump apart: easy to hit, but you have to move
      const n = 4
      const dt = gap * 1.6
      let x = fit(cx, RX.wide, W)
      for (let i = 0; i < n; i++) {
        gate(i * dt, x, RX.wide)
        const jump = Math.min(rand(150, 230), room(RX.wide, W) * 1.4, reach(dt, RX.wide, RX.wide) * 0.85)
        let nx = x + jump * (i % 2 ? side : -side)
        if (nx < edge(RX.wide) || nx > W - edge(RX.wide)) nx = x - (nx - x)
        x = fit(nx, RX.wide, W)
      }
      break
    }
    case 'narrow': {
      // skinny hoops in a gentle wave: line up and hold steady
      const n = 6
      const c = fit(cx, RX.narrow + 50, W)
      for (let i = 0; i < n; i++) gate(i * gap * 1.05, c + 42 * Math.sin(i * 0.9) * side, RX.narrow + 4)
      break
    }
    case 'gates': {
      // a ring on one side, a bomb on the other, swapping each time
      const n = 5
      const Z = clamp(room(rxN, W) * 0.5, 85, 115)
      const dt = Math.max(gap * 1.2, needT(2 * Z, rxN, rxN) / 0.85)
      const c = clamp(cx, edge(rxN) + Z, W - edge(rxN) - Z)
      for (let i = 0; i < n; i++) {
        const s = i % 2 ? side : -side
        gate(i * dt, c + s * Z, rxN)
        bombs.push({ at: i * dt, x: c - s * (Z + 6), role: 'gate' })
      }
      break
    }
  }
  rings.sort((a, b) => a.at - b.at)
  return { kind, rings, bombs }
}

function planTrail(c) {
  const t = latest(c)
  const st = stageAt(t + 1)
  const kind = c.trailN === 0 ? 'line' : choose(MENU[st], c.last)
  const hint = c.exits.length > 1 ? c.W / 2 + rand(-70, 70) : c.exits[0].x + rand(-150, 150)
  const p = trailPattern(kind, { W: c.W, cx: hint, gap: GAP[st], st })
  const first = p.rings[0]
  const t0 = c.trailN === 0 ? 1.4 : startAfter(c, first.x, first.rx, GAP[st] * 1.6)
  // the second trail ends on a gold ring, to show what gold is before the
  // first fork offers a whole lane of them
  if (c.trailN === 1) p.rings[p.rings.length - 1].gold = true
  c.trailN++
  c.last = kind
  const pal = c.pal++ % 2 // trails take turns in teal and violet
  const rings = p.rings.map((r) => ({ kind: 'ring', at: t0 + r.at, x: r.x, rx: r.rx, gold: r.gold, pal }))
  c.items.push(...rings)
  for (const b of p.bombs) c.items.push({ kind: 'bomb', at: t0 + b.at, x: b.x, role: b.role })
  trailHazards(c, rings, kind, st)
  const last = rings[rings.length - 1]
  c.exits = [{ t: last.at, x: last.x, rx: last.rx }]
}

// Whether a bomb at (at, x) keeps `gap` clear of every ring that passes the
// ships at about the same moment, and of the other bombs.
function clear(c, at, x, gap = 52) {
  if (x < 46 || x > c.W - 46) return false
  const v = speedAt(at)
  for (const it of c.items) {
    if (Math.abs(it.at - at) > 1.2) continue
    const dy = Math.abs(it.at - at) * v
    if (it.kind === 'ring' && dy < 80 && Math.abs(it.x - x) < it.rx + gap) return false
    if (it.kind === 'bomb' && dy < 100 && Math.abs(it.x - x) < 110) return false
    if (it.kind === 'bubble' && dy < 100 && Math.abs(it.x - x) < 90) return false
  }
  return true
}

// Where the racing line is at time `at`, between two rings.
const lineAt = (a, b, at) => a.x + (b.x - a.x) * clamp((at - a.at) / Math.max(0.01, b.at - a.at), 0, 1)

function trailHazards(c, rings, kind, st) {
  const t0 = rings[0].at
  const t1 = rings[rings.length - 1].at
  // The first bombs come with a word of warning painted on the course.
  if (!c.told.bombs && t0 > 4) {
    c.told.bombs = true
    paint(c, t0 - 0.5, 'Bombs! Steer around them!', '#ffb36a')
    sideBombs(c, rings, 2)
    return
  }
  if (!c.told.bombs) return
  sideBombs(c, rings, [1, 1 + (Math.random() < 0.5), 2, 2 + (Math.random() < 0.4)][st])
  if (st >= 1 && (kind === 'line' || kind === 'scurve' || kind === 'wide' || kind === 'stair')) {
    if (Math.random() < [0, 0.5, 0.6, 0.75][st]) lineBomb(c, rings)
  }
  if (st >= 1 && Math.random() < [0, 0.45, 0.6, 0.6][st]) drifter(c, rings)
  if (st >= 2 && Math.random() < 0.4) swayBomb(c, rings)

  // saucers
  const span = t1 - t0
  if (st >= 1 && Math.random() < [0, 0.45, 0.45, 0.5][st]) event(c, t0 - 0.6 + rand(0, span * 0.5), 'swoop', { side: pick([-1, 1]) })
  if (st >= 2 && Math.random() < 0.45) event(c, t0 - 1.8 + rand(0, span * 0.4), 'bomber', { dir: pick([-1, 1]) })
  if (st >= 2 && Math.random() < 0.3) {
    const r = pick(rings)
    event(c, r.at - 1.8, 'park', { x: r.x, shots: st >= 3 ? 3 : 2 })
  }
  if (st >= 3) {
    event(c, t0 - 0.4 + rand(0, span * 0.5), 'streak')
    if (Math.random() < 0.45) event(c, t0 + rand(span * 0.4, span), 'streak')
  }
}

// Bombs beside the racing line, between rings: a ship that follows the rings
// never has to touch one, but one that cuts wide will.
function sideBombs(c, rings, count) {
  let placed = 0
  for (let tries = 0; tries < 14 && placed < count; tries++) {
    const i = 1 + Math.floor(Math.random() * (rings.length - 1))
    const a = rings[i - 1]
    const b = rings[i]
    const at = (a.at + b.at) / 2
    const mid = (a.x + b.x) / 2
    const s = pick([-1, 1])
    const off = Math.max(a.rx, b.rx) + Math.abs(a.x - b.x) / 2 + rand(48, 90)
    for (const d of [s, -s]) {
      const x = mid + d * off
      if (clear(c, at, x)) {
        c.items.push({ kind: 'bomb', at, x, role: 'side' })
        placed++
        break
      }
    }
  }
}

// A bomb right on the straight line between two roomy rings: fly through
// them off-centre to go round it.
function lineBomb(c, rings) {
  const ok = []
  for (let i = 0; i + 1 < rings.length; i++) {
    const a = rings[i]
    const b = rings[i + 1]
    if (a.rx >= 70 && b.rx >= 70 && !a.gold && !b.gold && b.at - a.at >= 0.38) ok.push(i)
  }
  if (!ok.length) return
  const i = pick(ok)
  const a = rings[i]
  const b = rings[i + 1]
  const at = (a.at + b.at) / 2
  const x = lineAt(a, b, at) + rand(-12, 12)
  if (c.items.some((it) => it.kind === 'bomb' && Math.abs(it.at - at) < 0.3)) return
  c.items.push({ kind: 'bomb', at, x, role: 'line' })
}

// A bomb that slides in from the side towards the racing line while it's
// still up the screen, and stops just short of it.
function drifter(c, rings) {
  for (let tries = 0; tries < 6; tries++) {
    const i = 1 + Math.floor(Math.random() * (rings.length - 1))
    const a = rings[i - 1]
    const b = rings[i]
    const at = (a.at + b.at) / 2
    const lx = lineAt(a, b, at)
    const s = pick([-1, 1])
    const x1 = lx + s * (Math.max(a.rx, b.rx) * 0.5 + rand(58, 80))
    const x0 = clamp(x1 + s * rand(150, 230), 40, c.W - 40)
    if (Math.abs(x0 - x1) < 80 || x1 < 46 || x1 > c.W - 46) continue
    if (c.items.some((it) => it.kind === 'bomb' && Math.abs(it.at - at) < 0.3 && Math.abs(it.x - x1) < 140)) continue
    c.items.push({ kind: 'bomb', at, x: x1, x0, drift: true, role: 'drift' })
    return
  }
}

// A bomb off to one side that swings back and forth.
function swayBomb(c, rings) {
  const amp = 46
  for (let tries = 0; tries < 8; tries++) {
    const i = 1 + Math.floor(Math.random() * (rings.length - 1))
    const a = rings[i - 1]
    const b = rings[i]
    const at = (a.at + b.at) / 2
    const s = pick([-1, 1])
    const x = (a.x + b.x) / 2 + s * (Math.max(a.rx, b.rx) + Math.abs(a.x - b.x) / 2 + amp + 50)
    if (clear(c, at, x, amp + 52)) {
      c.items.push({ kind: 'bomb', at, x, sway: amp, role: 'sway' })
      return
    }
  }
}

// ---------------------------------------------------------------- forks

const TIER = { gold: 3, mid: 2, safe: 1 }

function planFork(c) {
  const tEnd0 = latest(c)
  const st = stageAt(tEnd0 + 1)
  const W = c.W
  const cx = W / 2
  const n = c.forkN >= 2 && st >= 2 && W >= 760 && Math.random() < 0.7 ? 3 : 2
  const d = n === 2 ? clamp(W * 0.22, 170, 250) : clamp(W * 0.29, 200, 300)
  const xs = n === 2 ? [cx - d, cx + d] : [cx - d, cx, cx + d]
  // never the gold lane on the same side twice running
  let types = shuffle(n === 2 ? ['gold', 'safe'] : ['gold', 'mid', 'safe'])
  if (Math.sign(xs[types.indexOf('gold')] - cx) === c.lastGold) types = shuffle(types)
  if (Math.sign(xs[types.indexOf('gold')] - cx) === c.lastGold) types.reverse()
  c.lastGold = Math.sign(xs[types.indexOf('gold')] - cx)
  // how far a ring (plus its sway) can reach and stay clear of the bombs
  // marking the lanes off from each other
  const cap = (n === 2 ? d : d / 2) - 42
  const id = ++c.id
  const from = c.exits[0]

  // every lane opens at once, as soon as the farthest is in reach
  const tl = Math.max(...xs.map((x) => startAfter(c, x, 60, 0.9)))
  const lanes = types.map((type, k) => lane(c, type, xs[k], tl, cap, st, id, k))
  const tEnd = Math.max(...lanes.map((L) => L[L.length - 1].at))

  c.items.push({ kind: 'fork', at: tl - 0.5, id, xs: [...xs], types: [...types], counts: lanes.map((L) => L.length) })
  for (let k = 0; k < n; k++) {
    const entry = lanes[k][0]
    c.items.push({ kind: 'sign', at: tl, x: entry.x, rx: entry.rx, type: types[k], tier: TIER[types[k]] })
    c.items.push({ kind: 'arrow', at: from.t + 0.12, at1: tl - 0.14, x0: from.x, x: entry.x, type: types[k] })
  }
  if (!c.told.fork) {
    c.told.fork = true
    paint(c, from.t - 0.55, 'Pick a path!', '#ffd54a', true)
  }

  // the lanes are marked off by a row of bombs, starting with one (or two)
  // right where the trail splits, so there's no flying straight on
  const every = st < 2 ? 0.95 : 0.75
  for (let k = 0; k + 1 < n; k++) {
    const x = (xs[k] + xs[k + 1]) / 2
    c.items.push({ kind: 'divider', at: tl - 0.3, at1: tEnd + 0.1, x })
    for (let at = tl - 0.22; at < tEnd - 0.05; at += every) c.items.push({ kind: 'bomb', at, x, role: 'divider' })
  }

  // saucers that come for the lanes
  const gold = xs[types.indexOf('gold')]
  if (st >= 2 && Math.random() < 0.75) event(c, tl - 1.7, 'park', { x: gold, shots: st >= 3 ? 3 : 2 })
  if (st >= 1 && Math.random() < [0, 0.35, 0.3, 0.4][st]) event(c, tl - 0.9, 'swoop', { side: pick([-1, 1]) })
  if (st >= 3 && Math.random() < 0.5) event(c, tl + rand(0, 1), 'streak')

  c.forkN++
  c.nextFork = tEnd + rand(4, 5.2) - st * 0.25
  c.exits = lanes.map((L) => ({ t: L[L.length - 1].at, x: L[L.length - 1].x, rx: L[L.length - 1].rx }))
}

function lane(c, type, lx, tl, cap, st, fork, k) {
  const rings = []
  const ring = (at, x, rx, gold, pal) => {
    const r = { kind: 'ring', at, x: fit(x, rx, c.W), rx, gold, pal, fork, lane: k }
    rings.push(r)
    c.items.push(r)
  }
  if (type === 'gold') {
    // skinny rings in a tight zig-zag, every other one gold, and a bomb on
    // the far side of each plain one: cut a corner to line up the next gold
    // ring and you meet it
    const n = st >= 2 ? 8 : 7
    const gap = 0.4 - st * 0.01
    const rx = clamp(cap - 46, 46, RX.narrow)
    const Z = Math.min(48, cap - rx, (reach(gap, rx, rx) * 0.85) / 2)
    const s = pick([-1, 1])
    for (let i = 0; i < n; i++) ring(tl + i * gap, lx + (i % 2 ? Z : -Z) * s, rx, i % 2 === 1, 3)
    for (let i = 2; i < n; i += 2) {
      if (st === 0 && i !== 4) continue
      const r = rings[i]
      const away = Math.sign(r.x - lx) || 1
      c.items.push({ kind: 'bomb', at: r.at, x: lx - away * (Z + 8), role: 'gold' })
    }
  } else if (type === 'mid') {
    const n = 6
    const gap = 0.47
    const rx = clamp(cap - 24, 52, RX.normal)
    const ph = rand(0, 6)
    for (let i = 0; i < n; i++) ring(tl + i * gap, lx + 24 * Math.sin(i * 0.9 + ph), rx, i === n - 1, 1)
    // a bomb that slides in from the lane's edge and stops beside the line
    if (st >= 1) {
      const i = 2 + Math.floor(Math.random() * 2)
      const at = (rings[i].at + rings[i + 1].at) / 2
      const s = pick([-1, 1])
      const x1 = lx + s * (rx * 0.5 + 40)
      c.items.push({ kind: 'bomb', at, x: x1, x0: lx + s * (cap + 30), drift: true, role: 'mid' })
    }
  } else {
    const n = 4
    const gap = 0.7
    const rx = clamp(cap, 56, RX.wide)
    for (let i = 0; i < n; i++) ring(tl + i * gap, lx, rx, false, 2)
    if (st >= 1 && Math.random() < 0.4) c.items.push({ kind: 'bubble', at: tl + gap * 1.5, x: lx })
  }
  return rings
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------------------------------------------------------------- the end

function planFinish(c, t) {
  const at = Math.max(FINISH, t + 0.9)
  c.items.push({ kind: 'finish', at, x: c.W / 2 })
  c.finishAt = at
  c.done = true
}
