// Shared props: vector glyphs every segment can use, animated purely by their parameters (pass
// values computed from t). Re-exported through kit/draw.js, so segments reach them as show.draw.*.
// All coordinates are in the context's units (stage units for segments); `scale` 1 ≈ the size
// noted per prop.
import { beam, seg, ring, dot, label, labelWidth, wrapLabel, P, occlude, roundPath, rectPath, box, mix } from './draw.js'
import { rng, clamp, ease, hash01, noise1 } from './ease.js'

const TAU = Math.PI * 2
const path = (fn) => {
  const p = new Path2D()
  fn(p)
  return p
}
/** draw in a local frame: translate, scale (sx may be negative to mirror), rotate */
function local(ctx, x, y, s, fn, rot = 0, sx = 1) {
  ctx.save()
  ctx.translate(x, y)
  if (rot) ctx.rotate(rot)
  ctx.scale(s * sx, s)
  try {
    fn()
  } finally {
    ctx.restore()
  }
}
/** stroke width that stays ~px on screen inside a scaled frame */
const W = (px, s) => px / Math.abs(s)

// ---------------------------------------------------------------- confetti

/**
 * A "built it" burst of vector sparkles from (x, y). age = seconds since the burst (draws nothing
 * before 0 or after ~1.4 s). o: { seed, count, colors, spread }
 */
export function confetti(ctx, x, y, age, o = {}) {
  if (!(age >= 0) || age > 1.5) return
  const r = rng(o.seed ?? 1)
  const n = o.count ?? 22
  const cols = o.colors ?? [P.gold, P.magenta, P.cyan, P.lime, P.sky]
  const spread = o.spread ?? 1
  for (let i = 0; i < n; i++) {
    const a = r.range(-Math.PI, 0) + r.range(-0.4, 0.4)
    const v = r.range(90, 260) * spread
    const px = x + Math.cos(a) * v * age
    const py = y + Math.sin(a) * v * age + 260 * age * age
    const fade = 1 - clamp(age / 1.4)
    const c = r.pick(cols)
    const spin = r.range(4, 12) * age + r.range(0, TAU)
    const len = r.range(3, 7)
    if (i % 3 === 0) {
      // a four-point sparkle
      seg(ctx, px - len, py, px + len, py, c, 1.3, { alpha: fade, hot: true })
      seg(ctx, px, py - len, px, py + len, c, 1.3, { alpha: fade, hot: true })
    } else seg(ctx, px - Math.cos(spin) * len, py - Math.sin(spin) * len, px + Math.cos(spin) * len, py + Math.sin(spin) * len, c, 1.6, { alpha: fade })
  }
}

// ---------------------------------------------------------------- creatures

/**
 * A crow (norvid's motif). scale 1 ≈ 60 units long. o: { scale, flap (0..1 wing phase; animate
 * with t), facing (1 right / -1 left), perched (folded wings, feet down), color, alpha }
 */
export function crow(ctx, x, y, o = {}) {
  const s = o.scale ?? 1, f = o.facing ?? 1
  const c = o.color ?? P.violet
  const al = o.alpha ?? 1
  local(ctx, x, y, s, () => {
    const w = W(1.5, s)
    // body: a teardrop with a wedge tail
    const body = path((p) => {
      p.moveTo(18, -6)
      p.bezierCurveTo(10, -14, -10, -12, -16, -3)
      p.lineTo(-30, 2)
      p.lineTo(-28, 7)
      p.lineTo(-14, 5)
      p.bezierCurveTo(-4, 10, 12, 8, 18, -6)
      p.closePath()
    })
    occlude(ctx, body)
    beam(ctx, body, c, w, { alpha: al })
    // head + beak
    const head = path((p) => {
      p.arc(19, -9, 6.5, 0, TAU)
    })
    occlude(ctx, head)
    beam(ctx, head, c, w, { alpha: al })
    beam(ctx, path((p) => { p.moveTo(25, -11); p.lineTo(35, -7.5); p.lineTo(25, -6.5) }), P.amber, w, { alpha: al, hot: true })
    dot(ctx, 21, -10.5, 1.3, P.white, al)
    if (o.perched) {
      beam(ctx, path((p) => { p.moveTo(-14, -2); p.bezierCurveTo(-4, -8, 8, -6, 12, -2) }), c, w * 0.8, { alpha: 0.7 * al })
      beam(ctx, path((p) => { p.moveTo(0, 7); p.lineTo(-2, 15); p.moveTo(6, 7); p.lineTo(5, 15); p.moveTo(-6, 15); p.lineTo(10, 15) }), P.amber, w, { alpha: al })
    } else {
      // wings: up/down with flap
      const ph = Math.sin((o.flap ?? 0) * TAU)
      for (const side of [1, 0.6]) {
        const tipY = -30 * ph * side - 4
        const wing = path((p) => {
          p.moveTo(6, -6)
          p.bezierCurveTo(0, tipY * 0.6 - 4, -14, tipY, -24, tipY + 2)
          p.lineTo(-18, tipY * 0.4 + 2)
          p.bezierCurveTo(-10, -2, -2, -2, -6, -2)
        })
        beam(ctx, wing, c, w, { alpha: al * (side === 1 ? 1 : 0.5) })
      }
    }
  }, 0, f)
}

/** a crown (scale 1 ≈ 40 wide) */
export function crown(ctx, x, y, scale = 1, o = {}) {
  local(ctx, x, y, scale, () => {
    const p = path((p) => {
      p.moveTo(-20, 8)
      p.lineTo(-22, -10)
      p.lineTo(-10, 0)
      p.lineTo(0, -16)
      p.lineTo(10, 0)
      p.lineTo(22, -10)
      p.lineTo(20, 8)
      p.closePath()
    })
    occlude(ctx, p)
    beam(ctx, p, o.color ?? P.gold, W(1.8, scale), { hot: true, alpha: o.alpha })
    for (const [jx, jy] of [[-22, -12], [0, -18], [22, -12]]) dot(ctx, jx, jy, 2.4, P.magenta, o.alpha ?? 1)
    seg(ctx, -18, 3, 18, 3, o.color ?? P.gold, W(1, scale), { alpha: 0.6 * (o.alpha ?? 1) })
  })
}

/**
 * A chicken (Top Chicken). scale 1 ≈ 90 tall. o: { scale, crown (bool), bob (0..1 head bob
 * phase), facing, color }
 */
export function chicken(ctx, x, y, o = {}) {
  const s = o.scale ?? 1, f = o.facing ?? 1
  const c = o.color ?? P.white
  const bob = Math.sin((o.bob ?? 0) * TAU) * 4
  local(ctx, x, y, s, () => {
    const w = W(1.6, s)
    const body = path((p) => {
      p.moveTo(14, -30)
      p.bezierCurveTo(26, -10, 22, 18, 0, 22)
      p.bezierCurveTo(-24, 24, -36, 6, -40, -18)
      p.lineTo(-30, -12)
      p.lineTo(-34, -30)
      p.lineTo(-22, -16)
      p.bezierCurveTo(-12, -14, 0, -18, 14, -30)
      p.closePath()
    })
    occlude(ctx, body)
    beam(ctx, body, c, w)
    beam(ctx, path((p) => { p.moveTo(-14, 0); p.bezierCurveTo(-6, 10, 6, 8, 8, -2) }), c, w * 0.8, { alpha: 0.6 })
    // neck + head (bobbing)
    const hx = 18 + bob, hy = -44
    const head = path((p) => { p.moveTo(10, -26); p.lineTo(hx - 4, hy + 8); p.arc(hx, hy, 9, Math.PI * 0.75, Math.PI * 0.4, false); p.lineTo(20, -22) })
    occlude(ctx, head)
    beam(ctx, head, c, w)
    beam(ctx, path((p) => { p.moveTo(hx + 7, hy - 2); p.lineTo(hx + 17, hy + 1); p.lineTo(hx + 7, hy + 4) }), P.amber, w, { hot: true })
    beam(ctx, path((p) => { p.moveTo(hx - 4, hy - 8); p.bezierCurveTo(hx - 6, hy - 18, hx, hy - 16, hx, hy - 10); p.bezierCurveTo(hx + 2, hy - 18, hx + 8, hy - 16, hx + 5, hy - 7) }), P.red, w, { hot: true })
    beam(ctx, path((p) => { p.moveTo(hx + 7, hy + 4); p.bezierCurveTo(hx + 10, hy + 12, hx + 4, hy + 12, hx + 4, hy + 6) }), P.red, w)
    dot(ctx, hx + 2, hy - 2, 1.6, P.white)
    // legs
    beam(ctx, path((p) => { for (const lx of [-8, 4]) { p.moveTo(lx, 21); p.lineTo(lx, 38); p.moveTo(lx - 6, 40); p.lineTo(lx, 38); p.lineTo(lx + 7, 40) } }), P.amber, w)
    if (o.crown) crown(ctx, hx - 1, hy - 20, 0.5 / 1, { color: P.gold })
  }, 0, f)
}

/** a seal balancing (scale 1 ≈ 90 long). o: { scale, facing, ball (draw a ball on its nose), t } */
export function seal(ctx, x, y, o = {}) {
  const s = o.scale ?? 1
  const c = o.color ?? P.sky
  local(ctx, x, y, s, () => {
    const w = W(1.6, s)
    const b = path((p) => {
      p.moveTo(30, -32)
      p.bezierCurveTo(40, -30, 38, -18, 28, -16)
      p.bezierCurveTo(22, 0, 10, 14, -16, 16)
      p.bezierCurveTo(-34, 16, -46, 12, -50, 4)
      p.lineTo(-58, -4)
      p.lineTo(-50, 10)
      p.lineTo(-62, 14)
      p.lineTo(-44, 18)
      p.bezierCurveTo(-20, 22, 10, 22, 20, 12)
      p.lineTo(26, 22)
      p.lineTo(12, 22)
      p.bezierCurveTo(16, 0, 14, -26, 30, -32)
      p.closePath()
    })
    occlude(ctx, b)
    beam(ctx, b, c, w)
    dot(ctx, 30, -26, 1.8, P.white)
    for (const k of [-1, 1]) seg(ctx, 36, -21, 46, -21 + k * 3, c, w * 0.6, { alpha: 0.6 })
    if (o.ball) {
      const by = -44 + Math.sin((o.t ?? 0) * 6) * 2
      ring(ctx, 36, by, 9, P.red, w, { hot: true })
      beam(ctx, path((p) => { p.moveTo(27, by); p.bezierCurveTo(32, by - 6, 40, by - 6, 45, by) }), P.white, w * 0.7, { alpha: 0.7 })
    }
  }, 0, o.facing ?? 1)
}

/** an alligator (scale 1 ≈ 140 long). o: { scale, facing, jaw (0..1 open), color } */
export function gator(ctx, x, y, o = {}) {
  const s = o.scale ?? 1
  const c = o.color ?? P.lime
  const jaw = clamp(o.jaw ?? 0) * 0.45
  local(ctx, x, y, s, () => {
    const w = W(1.6, s)
    const body = path((p) => {
      p.moveTo(30, -8)
      p.bezierCurveTo(10, -18, -30, -16, -60, -6)
      p.lineTo(-90, 0)
      p.lineTo(-60, 6)
      p.bezierCurveTo(-30, 12, 10, 12, 30, 4)
      p.closePath()
    })
    occlude(ctx, body)
    beam(ctx, body, c, w)
    // ridges
    beam(ctx, path((p) => { for (let i = 0; i < 9; i++) { const bx = 20 - i * 10; p.moveTo(bx, -12 + i * 0.6); p.lineTo(bx - 4, -17 + i * 0.6); p.lineTo(bx - 8, -12 + i * 0.6) } }), c, w * 0.8, { alpha: 0.7 })
    // jaws
    local(ctx, 30, -4, 1, () => {
      ctx.rotate(-jaw)
      const up = path((p) => { p.moveTo(0, -4); p.lineTo(46, -2); p.lineTo(48, 2); p.lineTo(0, 2) })
      occlude(ctx, up)
      beam(ctx, up, c, w)
      beam(ctx, path((p) => { for (let i = 0; i < 6; i++) { p.moveTo(8 + i * 7, 2); p.lineTo(11 + i * 7, 5); p.lineTo(14 + i * 7, 2) } }), P.white, w * 0.7)
      dot(ctx, 8, -7, 2, P.amber)
    })
    local(ctx, 30, 2, 1, () => {
      ctx.rotate(jaw * 0.6)
      beam(ctx, path((p) => { p.moveTo(0, 0); p.lineTo(44, 0); p.lineTo(42, 5); p.lineTo(0, 6) }), c, w)
    })
    // legs
    beam(ctx, path((p) => { for (const lx of [16, -40]) { p.moveTo(lx, 8); p.lineTo(lx - 4, 18); p.lineTo(lx + 4, 18) } }), c, w)
  }, 0, o.facing ?? 1)
}

/** an elephant (scale 1 ≈ 110 tall) — e.g. the one in the room. o: { scale, facing, trunk (−1..1 swing) } */
export function elephant(ctx, x, y, o = {}) {
  const s = o.scale ?? 1
  const c = o.color ?? P.blueMid
  const tr = o.trunk ?? 0
  local(ctx, x, y, s, () => {
    const w = W(1.6, s)
    const body = path((p) => {
      p.moveTo(30, -50)
      p.bezierCurveTo(10, -66, -50, -64, -60, -30)
      p.lineTo(-60, 10)
      p.lineTo(-46, 10)
      p.lineTo(-44, -6)
      p.lineTo(-20, -6)
      p.lineTo(-18, 10)
      p.lineTo(-4, 10)
      p.lineTo(0, -10)
      p.lineTo(16, -10)
      p.lineTo(18, 10)
      p.lineTo(32, 10)
      p.lineTo(34, -20)
      p.closePath()
    })
    occlude(ctx, body)
    beam(ctx, body, c, w)
    // head, ear, trunk
    const head = path((p) => { p.arc(38, -42, 20, 0, TAU) })
    occlude(ctx, head)
    beam(ctx, head, c, w)
    beam(ctx, path((p) => { p.moveTo(30, -58); p.bezierCurveTo(6, -66, 4, -24, 30, -28) }), c, w, { alpha: 0.8 })
    beam(ctx, path((p) => { p.moveTo(54, -36); p.bezierCurveTo(66, -20, 60 + tr * 10, 0, 66 + tr * 16, 6) }), c, w)
    dot(ctx, 44, -46, 1.8, P.white)
    beam(ctx, path((p) => { p.moveTo(50, -30); p.lineTo(60, -24) }), P.white, w, { alpha: 0.8 })
    seg(ctx, -60, -26, -70, -10, c, w)
  }, 0, o.facing ?? 1)
}

// ---------------------------------------------------------------- objects

/**
 * A key cap ("PRESS E TO LEAVE"). scale 1 ≈ 80 wide. o: { label, scale, pressed (0..1), glow (0..1), color }
 */
export function keycap(ctx, x, y, o = {}) {
  const s = o.scale ?? 1
  const c = o.color ?? P.cyan
  const pr = clamp(o.pressed ?? 0)
  const g = o.glow ?? 0
  local(ctx, x, y, s, () => {
    const w = W(1.6, s)
    const base = roundPath(-40, -30, 80, 66, 10)
    occlude(ctx, base)
    beam(ctx, base, c, w, { alpha: 0.7 })
    const dy = pr * 8
    const top = roundPath(-31, -40 + dy, 62, 56, 8)
    occlude(ctx, top)
    beam(ctx, top, c, w * (1 + g), { hot: g > 0.3 })
    for (const [ax, ay, bx, by] of [[-40, -30, -31, -40 + dy], [40, -30, 31, -40 + dy], [-40, 36, -31, 16 + dy], [40, 36, 31, 16 + dy]]) seg(ctx, ax, ay, bx, by, c, w * 0.8, { alpha: 0.6 })
    label(ctx, o.label ?? 'E', 0, 0 + dy, { size: 34, align: 'center', color: g > 0.2 ? P.white : c, weight: 'm', ls: 0 })
  })
}

/** a book (scale 1 ≈ 70 wide). o: { scale, open (0..1), title, color } */
export function book(ctx, x, y, o = {}) {
  const s = o.scale ?? 1
  const c = o.color ?? P.coral
  const op = clamp(o.open ?? 0)
  local(ctx, x, y, s, () => {
    const w = W(1.5, s)
    if (op < 0.05) {
      const cover = rectPath(-26, -36, 52, 72, 3)
      occlude(ctx, cover)
      beam(ctx, cover, c, w)
      seg(ctx, -20, -36, -20, 36, c, w, { alpha: 0.6 })
      if (o.title) for (const [i, ln] of wrapLabel(ctx, o.title.toUpperCase(), 40, { size: 8 }).entries()) label(ctx, ln, 3, -16 + i * 11, { size: 8, align: 'center', color: P.white, ls: 0.1 })
    } else {
      const sp = 36 * op
      for (const sd of [-1, 1]) {
        const pg = path((p) => { p.moveTo(0, 34); p.bezierCurveTo(sd * sp * 0.4, 30, sd * sp, 32, sd * sp, 30); p.lineTo(sd * sp, -32); p.bezierCurveTo(sd * sp, -30, sd * sp * 0.4, -34, 0, -30); p.closePath() })
        occlude(ctx, pg)
        beam(ctx, pg, c, w)
        for (let k = 0; k < 6; k++) seg(ctx, sd * 6, -20 + k * 8, sd * (sp - 6), -20 + k * 8, P.white, w * 0.6, { alpha: 0.4 * op })
      }
    }
  })
}

/**
 * A rubber-stamp slam ("CLAIM"). age = seconds since it landed (it drops in over 0.15 s before
 * that, so start drawing at age −0.15). o: { rot (rad), color, size }
 */
export function stamp(ctx, x, y, text, o = {}) {
  const age = o.age ?? 1
  if (age < -0.15) return
  const drop = age < 0 ? 1 + (-age / 0.15) * 1.6 : 1 + 0.18 * Math.exp(-age * 18) * Math.cos(age * 40)
  const size = o.size ?? 44
  const c = o.color ?? P.red
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(o.rot ?? -0.12)
  ctx.scale(drop, drop)
  const tw = labelWidth(ctx, text.toUpperCase(), { size, weight: 'm', ls: 0.12 }) + size * 0.9
  const th = size * 1.5
  ctx.globalAlpha = age < 0 ? 0.5 : 1
  beam(ctx, roundPath(-tw / 2, -th / 2, tw, th, 6), c, 3, { hot: age >= 0 && age < 0.3 })
  beam(ctx, roundPath(-tw / 2 + 6, -th / 2 + 6, tw - 12, th - 12, 4), c, 1.2, { alpha: 0.6 })
  label(ctx, text.toUpperCase(), 0, size * 0.36, { size, align: 'center', color: c, weight: 'm', ls: 0.12 })
  ctx.restore()
  // ink spatter on impact
  if (age >= 0 && age < 0.5) {
    const r = rng(text)
    for (let i = 0; i < 10; i++) {
      const a = r.range(0, TAU), d = (tw / 2) * (1 + age * r.range(0.8, 2.2))
      dot(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.5, 1.6, c, 1 - age * 2)
    }
  }
}

/**
 * A speech bubble. (x, y) = the point of its tail (e.g. show.headOf(id).mouth); the bubble sits
 * above it on side `side` (1 right, −1 left). o: { side, w, size, color, appear (0..1), think }
 */
export function speechBubble(ctx, x, y, text, o = {}) {
  const a = ease.outBack(clamp(o.appear ?? 1))
  if (a <= 0) return
  const size = o.size ?? 20
  const side = o.side ?? 1
  const lines = String(text).split('\n').flatMap((t) => wrapLabel(ctx, t, (o.w ?? 300) - 30, { size }))
  const bw = Math.max(...lines.map((l) => labelWidth(ctx, l, { size }))) + 34
  const bh = lines.length * size * 1.35 + 22
  const bx = x + side * 30 - (side < 0 ? bw : 0), by = y - 40 - bh
  const c = o.color ?? P.white
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(a, a)
  ctx.translate(-x, -y)
  const p = roundPath(bx, by, bw, bh, 14)
  occlude(ctx, p)
  beam(ctx, p, c, 1.6)
  if (o.think) for (let i = 0; i < 3; i++) ring(ctx, x + side * (6 + i * 8), y - 8 - i * 12, 3 + i * 2, c, 1.2)
  else {
    const tail = path((q) => { q.moveTo(x + side * 34, by + bh - 1); q.lineTo(x, y); q.lineTo(x + side * 58, by + bh - 1) })
    occlude(ctx, tail)
    beam(ctx, path((q) => { q.moveTo(x + side * 34, by + bh); q.lineTo(x, y); q.lineTo(x + side * 58, by + bh) }), c, 1.6)
  }
  lines.forEach((l, i) => label(ctx, l, bx + 17, by + 14 + (i + 0.8) * size * 1.35 - size * 0.25, { size, color: c }))
  ctx.restore()
}

/**
 * The winners' podium: three steps (2-1-3). (x, y) = bottom centre; w = total width.
 * o: { labels: ['1','2','3'] or names, color, rise (0..1 the steps grow) }. Returns the top
 * centre of each step [first, second, third] so you can stand things on them.
 */
export function podium3(ctx, x, y, w = 360, o = {}) {
  const c = o.color ?? P.gold
  const rise = ease.outCubic(clamp(o.rise ?? 1))
  const sw = w / 3
  const hs = [w * 0.42, w * 0.3, w * 0.2].map((h) => h * rise)
  const xs = [x - sw / 2, x - sw * 1.5, x + sw / 2]
  const order = [0, 1, 2]
  const tops = []
  for (const i of order) {
    const rx = xs[i], h = hs[i]
    const p = rectPath(rx, y - h, sw, h)
    occlude(ctx, p)
    beam(ctx, p, i === 0 ? c : mix(c, '#888888', 0.4), 1.6, { hot: i === 0 })
    if (h > 30) label(ctx, String(o.labels?.[i] ?? i + 1).toUpperCase(), rx + sw / 2, y - h + Math.min(48, h * 0.6), { size: Math.min(40, sw * 0.32), align: 'center', color: i === 0 ? c : P.white, weight: 'm', ls: 0.05 })
    tops.push([rx + sw / 2, y - h])
  }
  return tops
}

/**
 * A limbo bar between two poles. (x, y) = floor centre; o: { w, height (bar height above floor),
 * wobble (0..1), color }
 */
export function limboBar(ctx, x, y, o = {}) {
  const w = o.w ?? 300, h = o.height ?? 120
  const c = o.color ?? P.lime
  const wob = (o.wobble ?? 0) * 6
  for (const sd of [-1, 1]) {
    seg(ctx, x + sd * w / 2, y, x + sd * w / 2, y - h - 40, P.blueMid, 2)
    seg(ctx, x + sd * w / 2 - 12, y, x + sd * w / 2 + 12, y, P.blueMid, 2)
    seg(ctx, x + sd * w / 2 - 6, y - h, x + sd * w / 2 + 6, y - h, P.white, 1.4)
  }
  const bar = path((p) => { p.moveTo(x - w / 2, y - h); p.quadraticCurveTo(x, y - h + wob, x + w / 2, y - h) })
  beam(ctx, bar, c, 4, { hot: true })
  for (let i = 1; i < 8; i++) {
    const bx = x - w / 2 + (w * i) / 8
    seg(ctx, bx - 4, y - h - 2, bx + 4, y - h + 2, P.white, 1.4, { alpha: 0.7 })
  }
}

/**
 * Split-flap display text: each character flips through letters before landing. age = seconds
 * since it started (each character settles 0.05 s after the previous). o: { size, color, cells }
 */
export function splitFlap(ctx, x, y, text, o = {}) {
  const size = o.size ?? 30
  const age = o.age ?? 10
  const cw = size * 0.82, ch = size * 1.3
  const chars = String(text).toUpperCase().padEnd(o.cells ?? text.length, ' ')
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let i = 0; i < chars.length; i++) {
    const cx = x + i * (cw + 3)
    const p = rectPath(cx, y - ch, cw, ch, 2)
    occlude(ctx, p, '#05080c')
    beam(ctx, p, P.blueDim, 1)
    seg(ctx, cx, y - ch / 2, cx + cw, y - ch / 2, '#000', 1.2)
    const settle = 0.25 + i * 0.05
    let chr = chars[i]
    if (age < settle && chr !== ' ') chr = A[Math.floor((age * 30 + i * 7) % A.length)]
    if (age < 0) chr = ' '
    label(ctx, chr, cx + cw / 2, y - ch * 0.25, { size, align: 'center', color: age < settle ? P.blueMid : o.color ?? P.amber, weight: 'm', ls: 0 })
  }
}

/**
 * A scrolling news crawl across the full width at y (stage units). t = time (s); o: { speed
 * (units/s), color, tag (left-hand label, e.g. 'BREAKING'), size }
 */
export function ticker(ctx, y, text, t, o = {}) {
  const size = o.size ?? 18
  const h = size * 1.9
  occlude(ctx, rectPath(0, y, 1280, h), '#000', 0.92)
  seg(ctx, 0, y, 1280, y, o.color ?? P.amber, 1.4, { hot: true })
  seg(ctx, 0, y + h, 1280, y + h, o.color ?? P.amber, 1)
  const item = `${String(text).toUpperCase()}   ◆   `
  const iw = labelWidth(ctx, item, { size, ls: 0.12 })
  const off = ((t * (o.speed ?? 110)) % iw + iw) % iw
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, y, 1280, h)
  ctx.clip()
  for (let x = -off; x < 1280; x += iw) label(ctx, item, x, y + h * 0.68, { size, color: P.white, ls: 0.12 })
  ctx.restore()
  if (o.tag) {
    const tw = labelWidth(ctx, o.tag.toUpperCase(), { size, weight: 'm', ls: 0.2 }) + 30
    box(ctx, 0, y, tw, h, { color: o.color ?? P.amber, width: 1.4 })
    label(ctx, o.tag.toUpperCase(), 15, y + h * 0.68, { size, color: o.color ?? P.amber, weight: 'm', ls: 0.2 })
  }
}

// ---------------------------------------------------------------- weather

/**
 * A blobby region outline from a seed (a made-up country for the weather map). Returns a
 * Path2D plus its points, centred in rect {x,y,w,h}. Build once (setup), draw every frame.
 */
export function blobRegion(seed, rect, o = {}) {
  const r = rng(seed)
  const n = o.points ?? 40
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2
  const ph = [r.range(0, TAU), r.range(0, TAU), r.range(0, TAU)]
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    const k = 1 + 0.14 * Math.sin(a * 2 + ph[0]) + 0.08 * Math.sin(a * 5 + ph[1]) + 0.05 * Math.sin(a * 9 + ph[2]) + r.range(-0.03, 0.03)
    pts.push([cx + Math.cos(a) * (rect.w / 2) * 0.85 * k, cy + Math.sin(a) * (rect.h / 2) * 0.85 * k])
  }
  const p = new Path2D()
  pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)))
  p.closePath()
  return { path: p, pts }
}

/** draw a region from blobRegion (outline + faint hatch). o: { color, alpha } */
export function region(ctx, reg, o = {}) {
  beam(ctx, reg.path, o.color ?? P.sky, 1.8, { alpha: o.alpha ?? 1 })
}

/**
 * A weather front along pts [[x,y]…]: kind 'cold' (blue triangles), 'warm' (red half-circles),
 * or a function (ctx, x, y, angle) drawing a custom glyph at each mark. o: { progress (0..1 drawn), color, spacing }
 */
export function front(ctx, pts, o = {}) {
  const kind = o.kind ?? 'cold'
  const color = o.color ?? (kind === 'warm' ? P.red : P.sky)
  const prog = clamp(o.progress ?? 1)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1] * prog
  const p = new Path2D()
  p.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length && cum[i - 1] < L; i++) {
    const u = Math.min(1, (L - cum[i - 1]) / (cum[i] - cum[i - 1] || 1))
    p.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u)
  }
  beam(ctx, p, color, 2.2, { hot: true })
  const sp = o.spacing ?? 40
  for (let d = sp / 2; d < L; d += sp) {
    let i = 1
    while (i < cum.length - 1 && cum[i] < d) i++
    const u = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
    const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u
    const ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
    if (typeof kind === 'function') kind(ctx, x, y, ang)
    else {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(ang)
      const m = new Path2D()
      if (kind === 'warm') m.arc(0, 0, 8, Math.PI, 0)
      else {
        m.moveTo(-8, 0)
        m.lineTo(0, -12)
        m.lineTo(8, 0)
      }
      m.closePath()
      beam(ctx, m, color, 1.8, { hot: true })
      ctx.restore()
    }
  }
}

/** an isobar: a smooth closed wobble around (x, y) of radius r with a pressure label */
export function isobar(ctx, x, y, r, o = {}) {
  const seed = o.seed ?? 3
  const p = new Path2D()
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * TAU
    const k = 1 + 0.12 * noise1(a * 1.3 + seed, seed)
    i ? p.lineTo(x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.7) : p.moveTo(x + r * k, y)
  }
  beam(ctx, p, o.color ?? P.blueMid, 1.1, { alpha: o.alpha ?? 0.7 })
  if (o.label) label(ctx, o.label, x + r * 0.7, y - r * 0.5, { size: 12, color: o.color ?? P.blueMid })
}

/** weather glyphs: sun (rays turn with t), cloud, rain (drops fall with t), storm, snow */
export function sun(ctx, x, y, r = 20, t = 0, color = P.gold) {
  ring(ctx, x, y, r, color, 2, { hot: true })
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU + t * 0.4
    seg(ctx, x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75, color, 1.6)
  }
}
export function cloud(ctx, x, y, s = 1, color = P.white) {
  local(ctx, x, y, s, () => {
    const p = path((q) => {
      q.moveTo(-30, 10)
      q.arc(-18, 0, 12, Math.PI * 0.6, Math.PI * 1.5)
      q.arc(0, -8, 16, Math.PI * 1.1, Math.PI * 1.9)
      q.arc(20, 0, 12, Math.PI * 1.4, Math.PI * 0.4)
      q.closePath()
    })
    occlude(ctx, p)
    beam(ctx, p, color, W(1.6, s))
  })
}
export function rain(ctx, x, y, s = 1, t = 0, color = P.sky) {
  cloud(ctx, x, y, s, P.white)
  for (let i = 0; i < 5; i++) {
    const ph = ((t * 1.8 + i * 0.37) % 1)
    const dx = (-16 + i * 8) * s, dy = (16 + ph * 26) * s
    seg(ctx, x + dx, y + dy, x + dx - 3 * s, y + dy + 8 * s, color, 1.4, { alpha: 1 - ph })
  }
}
export function storm(ctx, x, y, s = 1, t = 0) {
  cloud(ctx, x, y, s, P.blueMid)
  const on = Math.floor(t * 3) % 4 === 0
  beam(ctx, path((q) => { q.moveTo(x + 2 * s, y + 12 * s); q.lineTo(x - 6 * s, y + 28 * s); q.lineTo(x + 2 * s, y + 28 * s); q.lineTo(x - 6 * s, y + 46 * s) }), P.gold, 2, { hot: on, alpha: on ? 1 : 0.4 })
}
export function snow(ctx, x, y, s = 1, t = 0) {
  cloud(ctx, x, y, s, P.white)
  for (let i = 0; i < 5; i++) {
    const ph = ((t * 0.6 + i * 0.29) % 1)
    const fx = x + (-16 + i * 8 + Math.sin(t * 2 + i) * 3) * s, fy = y + (16 + ph * 30) * s
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI
      seg(ctx, fx - Math.cos(a) * 3 * s, fy - Math.sin(a) * 3 * s, fx + Math.cos(a) * 3 * s, fy + Math.sin(a) * 3 * s, P.white, 1, { alpha: 1 - ph })
    }
  }
}

// ---------------------------------------------------------------- screens

/**
 * A monitor bezel: black screen, a frame with a stand, a label strip, a blinking LIVE bug.
 * o: { label, live, color, t, noStand }. Draw it before what goes inside (it fills the screen black),
 * then call tvFrame.glass(ctx, x, y, w, h, o) afterwards for the reflections and the label.
 */
export function tvFrame(ctx, x, y, w, h, o = {}) {
  const c = o.color ?? P.blueMid
  if (!o.noStand) {
    const st = path((p) => { p.moveTo(x + w / 2 - 14, y + h + 10); p.lineTo(x + w / 2 - 24, y + h + 50); p.lineTo(x + w / 2 + 24, y + h + 50); p.lineTo(x + w / 2 + 14, y + h + 10) })
    occlude(ctx, st)
    beam(ctx, st, c, 1.4)
  }
  const outer = roundPath(x - 12, y - 12, w + 24, h + 24, 14)
  occlude(ctx, outer)
  beam(ctx, outer, c, 1.8)
  beam(ctx, roundPath(x, y, w, h, 6), c, 1, { alpha: 0.7 })
}
tvFrame.glass = function (ctx, x, y, w, h, o = {}) {
  const c = o.color ?? P.blueMid
  // scanlines over the picture
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = '#000'
  for (let yy = y; yy < y + h; yy += 3) ctx.fillRect(x, yy, w, 1.2)
  ctx.restore()
  seg(ctx, x + 14, y + 10, x + w * 0.35, y + 10, P.white, 1, { alpha: 0.18 })
  if (o.label) {
    const tw = labelWidth(ctx, o.label.toUpperCase(), { size: 14, ls: 0.2 }) + 26
    box(ctx, x + 10, y + h - 34, tw, 26, { color: c, cut: 5, width: 1.2, fillAlpha: 0.85 })
    label(ctx, o.label.toUpperCase(), x + 23, y + h - 16, { size: 14, color: P.white, ls: 0.2 })
  }
  if (o.live) {
    const on = Math.floor((o.t ?? 0) * 1.6) % 2 === 0
    box(ctx, x + w - 82, y + 12, 70, 26, { color: P.onair, cut: 5, width: 1.2, fillAlpha: 0.85 })
    dot(ctx, x + w - 68, y + 25, 5, P.onair, on ? 1 : 0.3)
    label(ctx, 'LIVE', x + w - 56, y + 32, { size: 15, color: P.onair, weight: 'm', ls: 0.2 })
  }
}

/**
 * Rolling credits: lines scroll up from the bottom of rect at `speed` units/s from t = 0.
 * lines: strings, or [role, name] pairs, or { head: 'Section' }. o: { rect, speed, lineHeight,
 * split (0..1 where the role/name columns meet) }. Returns true while still rolling.
 */
export function creditsRoll(ctx, lines, t, o = {}) {
  const rect = o.rect ?? { x: 0, y: 0, w: 1280, h: 720 }
  const speed = o.speed ?? 40
  const lh = o.lineHeight ?? 34
  const cx = rect.x + rect.w / 2
  let y = rect.y + rect.h - t * speed
  ctx.save()
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.w, rect.h)
  ctx.clip()
  for (const ln of lines) {
    const fade = clamp(Math.min((y - rect.y) / 60, (rect.y + rect.h - y) / 60))
    if (y > rect.y - lh && y < rect.y + rect.h + lh) {
      if (typeof ln === 'string') label(ctx, ln.toUpperCase(), cx, y, { size: 18, align: 'center', color: P.white, ls: 0.2, alpha: fade })
      else if (Array.isArray(ln)) {
        const split = rect.x + rect.w * (o.split ?? 0.6)
        label(ctx, String(ln[0]).toUpperCase(), split - 16, y, { size: 13, align: 'right', color: P.sky, ls: 0.16, alpha: fade })
        label(ctx, String(ln[1]), split + 16, y, { size: 18, align: 'left', color: P.white, ls: 0.06, alpha: fade })
      } else if (ln?.head) label(ctx, ln.head.toUpperCase(), cx, y, { size: 22, align: 'center', color: P.gold, ls: 0.35, weight: 'm', alpha: fade })
    }
    y += ln?.head ? lh * 1.5 : lh
  }
  ctx.restore()
  return y > rect.y
}

/** a lectern / game-show stand front (world or stage units). (x, y) = top centre; o: { w, h, color, label } */
export function lectern(ctx, x, y, o = {}) {
  const w = o.w ?? 120, h = o.h ?? 170
  const c = o.color ?? P.violet
  const top = path((p) => { p.moveTo(x - w / 2 - 10, y); p.lineTo(x + w / 2 + 10, y); p.lineTo(x + w / 2 + 4, y + 16); p.lineTo(x - w / 2 - 4, y + 16); p.closePath() })
  const body = path((p) => { p.moveTo(x - w / 2, y + 16); p.lineTo(x + w / 2, y + 16); p.lineTo(x + w / 2 - 14, y + h); p.lineTo(x - w / 2 + 14, y + h); p.closePath() })
  occlude(ctx, body)
  beam(ctx, body, c, 1.6)
  occlude(ctx, top)
  beam(ctx, top, c, 1.6, { hot: true })
  if (o.label) label(ctx, o.label.toUpperCase(), x, y + 16 + h * 0.3, { size: Math.min(22, w / (o.label.length * 0.7)), align: 'center', color: o.labelColor ?? c, weight: 'm', ls: 0.12 })
  if (o.lights) for (let i = 0; i < 6; i++) dot(ctx, x - w / 2 + 18 + (i * (w - 36)) / 5, y + h - 18, 2.6, i % 2 ? P.gold : c, 0.4 + 0.6 * (Math.floor((o.t ?? 0) * 4 + i) % 3 === 0 ? 1 : 0.3))
}

export { hash01 }
