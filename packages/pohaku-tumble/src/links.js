import { clamp01, inOutCubic } from './ease.js'
import { featureAnchor, linkPath, tileOffsets, SLAB } from './field.js'

// A field line longer than this doesn't cross the island to its place: it
// runs a short way in the right direction and ends in an arrow, an off-page
// connector.
const FIELD_REACH = 12.5
const STUB = 2.6

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
      // Let go of the stone that turned; a field line is drawn back into its
      // place. A line caught half-drawn just reverses the way it came.
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
    const link = { ...d, ...measure(linkPath(d.key, d.a, d.b)) }
    // Where the line comes out from under each word — a small port is drawn
    // there, since the line itself starts hidden beneath the stone. It is the
    // edge of the whole word, not of the one stone: a line from a word's left
    // stone that sets off to the right runs on under its right stone first.
    link.portA = exitAt(link, footprint(d.a), false)
    link.portB = exitAt(link, footprint(d.b), true)
    return link
  }
  // A field line lands on the nearest point of its place's outline: a circle,
  // a rectangle, or a polyline such as the stream or the lava front. `room` is
  // how far it may run before it would reach into the upland; one that would
  // cross the upland to get there is cut down to a connector that stops short.
  const { pair, feature, room } = d
  let [ex, ez] = featureAnchor(feature, pair.x, pair.z)
  let stub = false
  const dist = Math.hypot(ex - pair.x, ez - pair.z)
  if (dist > Math.min(FIELD_REACH, room)) {
    const k = Math.min(STUB, room - 0.3) / dist
    ex = pair.x + (ex - pair.x) * k
    ez = pair.z + (ez - pair.z) * k
    stub = true
  }
  const link = { ...d, stub, ...measure([[pair.x, pair.z], [ex, ez]]) }
  link.portA = exitAt(link, { x: pair.x, z: pair.z, ...HALF }, false)
  return link
}

// Half the footprint of a word on the floor — two slabs and the gap between
// them, 1 deep — with a hair of margin so the port sits just clear of the
// stone's edge.
const HALF = { hx: tileOffsets()[1][0] + SLAB / 2 + 0.05, hz: 0.55 }

// The footprint of the word a stone belongs to.
function footprint(tile) {
  return { x: tile.x - tileOffsets()[tile.index][0], z: tile.z, ...HALF }
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

// Arc length where the polyline leaves the box { x, z, hx, hz }, walking in
// from the far end if `fromEnd`.
function exitAt(link, box, fromEnd) {
  const step = 0.04
  for (let s = 0; s <= link.len; s += step) {
    const [x, z] = pointAt(link, fromEnd ? link.len - s : s)
    if (Math.abs(x - box.x) > box.hx || Math.abs(z - box.z) > box.hz) return fromEnd ? link.len - s : s
  }
  return fromEnd ? 0 : link.len
}
