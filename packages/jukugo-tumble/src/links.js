import { clamp01, inOutCubic } from './ease.js'
import { featureAnchor } from './field.js'

// A field line longer than this doesn't cross the whole floor to its diagram:
// it runs a short way in the right direction and ends in an arrow, an
// off-page connector.
const FIELD_REACH = 12.5
const STUB = 2.6
const CORNER = 0.45

// Lines live on the floor (y = 0) as polylines in world units. Each one draws
// on from one end and retracts toward whichever end is staying put, so a line
// visibly lets go of the block that turned rather than just vanishing.
export class LinkStore {
  constructor() {
    this.links = new Map()
  }

  // Reconcile the drawn lines with `desired`. `origin` is the tile that just
  // turned (lines grow out of it, and let go of it); `holdUntil(link)` is the
  // earliest a new line may start — not before the blocks it joins have landed.
  sync(desired, now, { origin = null, holdUntil = () => now } = {}) {
    let stagger = 0
    for (const [key, d] of desired) {
      const have = this.links.get(key)
      if (have) {
        if (have.to === 0) this.animate(have, now, 1, have.anchor)
        continue
      }
      const link = build(d)
      link.p = 0
      link.from = 0
      link.to = 0
      link.anchor = 'start'
      if (d.kind === 'pair' && origin != null && d.b.id === origin) link.anchor = 'end'
      this.links.set(key, link)
      const start = Math.max(now, holdUntil(d)) + stagger
      stagger += 0.06
      this.animate(link, start, 1, link.anchor)
    }
    for (const [key, link] of this.links) {
      if (desired.has(key) || link.to === 0) continue
      // Let go of the block that turned; a field line is drawn back into its
      // diagram. A line caught half-drawn just reverses the way it came.
      let anchor = link.kind === 'field' ? 'end' : origin === link.a.id ? 'end' : 'start'
      if (link.p < 0.999) anchor = link.anchor
      this.animate(link, now, 0, anchor)
    }
  }

  animate(link, t0, to, anchor) {
    link.from = link.p
    link.to = to
    link.t0 = t0
    link.anchor = anchor
    const span = Math.abs(to - link.from) * link.len
    link.dur = to ? Math.min(1.25, Math.max(0.45, span / 14)) : Math.min(0.7, Math.max(0.28, span / 22))
  }

  update(now) {
    for (const [key, link] of this.links) {
      const t = clamp01((now - link.t0) / link.dur)
      link.p = link.from + (link.to - link.from) * inOutCubic(t)
      link.moving = t < 1 && now >= link.t0
      if (link.to === 1) link.doneAt = link.t0 + link.dur
      if (t >= 1 && link.to === 0) this.links.delete(key)
    }
  }

  count() {
    let n = 0
    for (const l of this.links.values()) if (l.to === 1) n++
    return n
  }
}

function build(d) {
  if (d.kind === 'pair') {
    const lane = (hash(d.key) % 5) - 2
    const style = hash(d.key + '#') % 3
    const pts = route(d.a.x, d.a.z, d.b.x, d.b.z, lane * 0.09, style)
    const link = { ...d, ...measure(pts) }
    // Where the line comes out from under each block — a small port is drawn
    // there, since the line itself starts hidden beneath the cube.
    link.portA = exitAt(link, d.a, false)
    link.portB = exitAt(link, d.b, true)
    return link
  }
  const { pair, feature } = d
  let [ex, ez] = featureAnchor(feature, pair.x, pair.z)
  let stub = false
  const dist = Math.hypot(ex - pair.x, ez - pair.z)
  if (dist > FIELD_REACH) {
    const k = STUB / dist
    ex = pair.x + (ex - pair.x) * k
    ez = pair.z + (ez - pair.z) * k
    stub = true
  }
  const link = { ...d, stub, ...measure([[pair.x, pair.z], [ex, ez]]) }
  link.portA = exitAt(link, pair, false, pair.dir === 'h' ? 1.1 : 0.55, pair.dir === 'h' ? 0.55 : 1.1)
  return link
}

function measure(pts) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  }
  return { pts, cum, len: cum.at(-1) }
}

// Point at arc length s along the polyline.
export function pointAt(link, s) {
  const { pts, cum } = link
  if (s <= 0) return pts[0]
  if (s >= link.len) return pts.at(-1)
  let i = 1
  while (cum[i] < s) i++
  const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]
}

// The visible stretch [s0, s1] of a link, given its progress and anchor.
export function visibleSpan(link) {
  const shown = link.p * link.len
  return link.anchor === 'start' ? [0, shown] : [link.len - shown, link.len]
}

// Arc length where the polyline leaves the footprint around (cx, cz), walking
// in from the far end if `fromEnd`.
function exitAt(link, c, fromEnd, hx = 0.55, hz = 0.55) {
  const step = 0.04
  for (let s = 0; s <= link.len; s += step) {
    const [x, z] = pointAt(link, fromEnd ? link.len - s : s)
    if (Math.abs(x - c.x) > hx || Math.abs(z - c.z) > hz) return fromEnd ? link.len - s : s
  }
  return fromEnd ? 0 : link.len
}

// An octilinear route — horizontals, verticals and 45° diagonals, like a
// transit map — from a to b, with its corners rounded off. Three styles so a
// floor full of them doesn't all bend the same way: straight-diagonal-straight,
// diagonal first, or straight first.
function route(ax, az, bx, bz, offset, style) {
  const dx = bx - ax
  const dz = bz - az
  const adx = Math.abs(dx)
  const adz = Math.abs(dz)
  const sx = Math.sign(dx) || 1
  const sz = Math.sign(dz) || 1
  let pts
  if (adx >= adz) {
    const run = adx - adz
    const [r0, r1] = style === 0 ? [run / 2, run / 2] : style === 1 ? [0, run] : [run, 0]
    pts = [
      [ax, az],
      [ax + sx * r0, az],
      [bx - sx * r1, bz],
      [bx, bz],
    ]
  } else {
    const run = adz - adx
    const [r0, r1] = style === 0 ? [run / 2, run / 2] : style === 1 ? [0, run] : [run, 0]
    pts = [
      [ax, az],
      [ax, az + sz * r0],
      [bx, bz - sz * r1],
      [bx, bz],
    ]
  }
  // Shift the whole route sideways a little so lines sharing a corridor sit
  // in parallel lanes instead of on top of each other.
  if (offset) {
    const len = Math.hypot(dx, dz) || 1
    const nx = -dz / len
    const nz = dx / len
    pts = pts.map(([x, z]) => [x + nx * offset, z + nz * offset])
  }
  pts = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-4)
  return roundCorners(pts, CORNER)
}

function roundCorners(pts, radius) {
  if (pts.length < 3) return pts
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, pz] = pts[i - 1]
    const [cx, cz] = pts[i]
    const [nx, nz] = pts[i + 1]
    const l0 = Math.hypot(cx - px, cz - pz)
    const l1 = Math.hypot(nx - cx, nz - cz)
    const r = Math.min(radius, l0 / 2, l1 / 2)
    const a = [cx + ((px - cx) / l0) * r, cz + ((pz - cz) / l0) * r]
    const b = [cx + ((nx - cx) / l1) * r, cz + ((nz - cz) / l1) * r]
    for (let k = 0; k <= 6; k++) {
      const t = k / 6
      const u = 1 - t
      out.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cz + t * t * b[1]])
    }
  }
  out.push(pts.at(-1))
  return out
}

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
