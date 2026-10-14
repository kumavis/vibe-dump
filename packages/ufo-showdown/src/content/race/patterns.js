// The Ring Race course, planned a pattern at a time: a straight line, an
// S-curve, a zig-zag, a staircase, big wide rings, skinny ones, two lanes side
// by side, and now and then a big gold ring to finish one off.
//
// A plan is a list of gates, each `{ at, x, rx, gold }`: `at` is seconds after
// the pattern starts, `x` is where its centre is, `rx` is how wide its opening
// is either side of the centre. Buoys are planned alongside the rings, out of
// the racing line, so a ship that follows the rings never has to touch one.
//
// Kept free of the canvas and the game API, so the course can be checked (and
// scored) from Node.

export const RX = { wide: 104, normal: 82, narrow: 58, gold: 106 }

// The ellipse a ring is drawn as, as a fraction of its width.
export const SQUASH = 0.32

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Keep a ring's whole hoop on screen.
const edge = (rx) => rx + 18
const fit = (x, rx, W) => clamp(x, Math.min(edge(rx), W / 2), Math.max(W - edge(rx), W / 2))
// How far a pattern can swing either side of the middle.
const room = (rx, W) => Math.max(0, W / 2 - edge(rx))

// Which patterns turn up, by stage of the race: a gentle first stretch, the
// full menu in the middle, and the quick ones for the last ten seconds. With
// two players the twin lanes come round more often.
const MENU = [
  { line: 2, scurve: 3, wide: 3, zigzag: 2 },
  { line: 1, scurve: 3, zigzag: 3, stair: 2, wide: 2, narrow: 2, twin: 2 },
  { scurve: 3, zigzag: 3, stair: 2, twin: 2, wide: 1 },
]

export function choosePattern(stage, last, two) {
  const w = { ...MENU[stage] }
  if (two && w.twin) w.twin += 2
  if (two && stage === 0) w.twin = 2
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

// Plan one pattern starting near `cx`. `stage` 0–2, `pace` shrinks the time
// between rings (1 normally, smaller in the last ten seconds).
export function planPattern(kind, { W, cx, stage = 1, pace = 1 }) {
  const rings = []
  const gate = (at, x, rx, gold = false) => rings.push({ at: at * pace, x: fit(x, rx, W), rx, gold })
  const easy = stage === 0
  const normal = easy ? 90 : RX.normal
  const side = Math.random() < 0.5 ? -1 : 1

  switch (kind) {
    case 'line': {
      // a straight run that leans a little to one side
      const n = easy ? 4 : 5
      const lean = rand(14, 26) * side
      const c = clamp(cx, edge(normal) + n * 26, W - edge(normal) - n * 26)
      for (let i = 0; i < n; i++) gate(i * 0.55, c + (i - (n - 1) / 2) * lean, normal)
      break
    }
    case 'scurve': {
      const n = 8
      const A = Math.min(easy ? 105 : 150, room(normal, W) * 0.9)
      const c = clamp(cx, edge(normal) + A, W - edge(normal) - A)
      const ph = side > 0 ? 0 : Math.PI
      for (let i = 0; i < n; i++) gate(i * (easy ? 0.48 : 0.42), c + A * Math.sin(i * 0.78 + ph), normal)
      break
    }
    case 'zigzag': {
      const n = 6
      const Z = Math.min(easy ? 80 : 105, room(normal, W))
      const c = clamp(cx, edge(normal) + Z, W - edge(normal) - Z)
      for (let i = 0; i < n; i++) gate(i * (easy ? 0.7 : 0.62), c + (i % 2 ? Z : -Z) * side, normal)
      break
    }
    case 'stair': {
      // a diagonal sweep across the screen
      const n = 6
      const step = Math.min(50, (room(normal, W) * 2) / (n - 1))
      const dir = cx > W / 2 ? -1 : 1
      const span = step * (n - 1)
      const x0 = clamp(cx - (dir * span) / 2, edge(normal), W - edge(normal))
      const start = dir > 0 ? Math.min(x0, W - edge(normal) - span) : Math.max(x0, edge(normal) + span)
      for (let i = 0; i < n; i++) gate(i * 0.45, start + dir * i * step, normal)
      break
    }
    case 'wide': {
      // big hoops a jump apart: easy to hit, but you have to move
      const n = 4
      let x = fit(cx, RX.wide, W)
      for (let i = 0; i < n; i++) {
        gate(i * 0.8, x, RX.wide)
        const jump = Math.min(rand(140, 210), room(RX.wide, W) * 1.4)
        let nx = x + jump * (i % 2 ? side : -side)
        if (nx < edge(RX.wide) || nx > W - edge(RX.wide)) nx = x - (nx - x)
        x = fit(nx, RX.wide, W)
      }
      break
    }
    case 'narrow': {
      // skinny hoops in a gentle wave: line up and hold steady
      const n = 5
      const c = fit(cx, RX.narrow + 50, W)
      for (let i = 0; i < n; i++) gate(i * 0.5, c + 45 * Math.sin(i * 0.9) * side, RX.narrow)
      break
    }
    case 'twin': {
      // two lanes, mirrored: pick one, or one each with two players
      const n = 5
      const D = Math.min(175, room(normal, W) - 30)
      const c = W / 2
      for (let i = 0; i < n; i++) {
        const sway = 30 * Math.sin(i * 0.7)
        gate(i * 0.55, c - D + sway, normal)
        gate(i * 0.55, c + D - sway, normal)
      }
      break
    }
  }

  rings.sort((a, b) => a.at - b.at)
  const lastRing = rings[rings.length - 1]
  const dur = lastRing.at
  const exitX = kind === 'twin' ? W / 2 : lastRing.x
  const entryX = kind === 'twin' ? W / 2 : rings[0].x
  return { kind, rings, dur, entryX, exitX }
}

// A big gold ring to finish a pattern, a short hop from where it ended.
export function planGold({ W, cx }) {
  const x = fit(cx + rand(-110, 110), RX.gold, W)
  return { kind: 'gold', rings: [{ at: 0, x, rx: RX.gold, gold: true }], dur: 0, entryX: x, exitX: x }
}

// Buoys for a pattern, placed beside the racing line. `v` is how fast the
// course is falling, so times turn into distances. Returns `{ at, x }`s on the
// pattern's clock. A spot is only used if it keeps clear of every ring in the
// pattern, with room for a ship to pass.
export function planBuoys(plan, { W, v, count }) {
  const out = []
  const { rings } = plan
  if (rings.length < 2 || count <= 0) return out
  const clearOf = (at, x) =>
    x > 40 &&
    x < W - 40 &&
    rings.every((r) => Math.abs(r.at - at) * v > 70 || Math.abs(r.x - x) > r.rx + 70) &&
    out.every((b) => Math.abs(b.at - at) * v > 90 || Math.abs(b.x - x) > 120)

  if (plan.kind === 'twin') {
    // one in the middle, between the lanes: change lanes before or after it
    const at = rings[Math.floor(rings.length / 2)].at
    if (clearOf(at, W / 2)) out.push({ at, x: W / 2 })
    return out
  }
  for (let tries = 0; tries < 12 && out.length < count; tries++) {
    const i = 1 + Math.floor(Math.random() * (rings.length - 1))
    const a = rings[i - 1]
    const b = rings[i]
    const at = (a.at + b.at) / 2
    const mid = (a.x + b.x) / 2
    const s = pick([-1, 1])
    const off = Math.max(a.rx, b.rx) + Math.abs(a.x - b.x) / 2 + rand(70, 110)
    for (const d of [s, -s]) {
      const x = mid + d * off
      if (clearOf(at, x)) {
        out.push({ at, x })
        break
      }
    }
  }
  return out
}
