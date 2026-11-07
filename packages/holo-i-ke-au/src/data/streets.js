// The towns' streets, dated (DATA.md "Streets, dated"), as the settlements
// and the street ribbons use them: one StreetNet per island, decoded from the
// town files of that island once, on the main thread (a town's file is a few
// hundred kilobytes at most).
//
// What it gives:
//
// - the street lines in world units, each with its years, for the ribbons
//   (features/streets.js);
// - the lots along them (lotsIn): both sides of every street, a lot of the
//   grid's size (settlements.js LU along the street, LV deep), its front on
//   the street, laid oldest street first so an older street keeps its corner
//   lots, never on another street's strip nor over another lot, whatever the
//   years; each lot stands only while its street does (`span`), and comes
//   with the same hashes and ranks the grid's lots carry, its rank a golden
//   sequence along its street so a share of the lots fills evenly, scaled by
//   how much closer than the grid's the lots stand there, so a town on its
//   streets holds the houses its density asks for, not more;
// - where the network covers the ground (coverAt): within COVER of a street
//   standing in the year, where the modelled grid gives way to the streets.
//   COVER is a lot's depth and a grid lot's half diagonal beyond the strip,
//   so no grid lot ever stands on a street's lot, or on its strip.
//
// The years a street changes (`breaks`) are breaks for the scatter, so a
// grid lot goes and a street lot comes at the year itself (settlements.js
// years), never fading across each other.

import { ihash } from './district-decode.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// world units (100 m): a street's strip by its class (DATA.md), and how far the network covers
export const STREET_WIDTH = { arterial: 0.14, street: 0.09 }
export const COVER = 0.75
// a lot's front stands this far back from its street's strip: half the grid's
// street, which a building's front may reach into (settlements.js FRONT)
const SETBACK = 0.07
// a lot stands this far from the ends of its street's segment (the crossing streets' strips and corners)
const END_CLEAR = 0.1
const GOLD = 0.6180339887
// the grid's lots per square world unit (settlements.js: eight lots a block)
const GRID_LOTS = 8 / ((4 * 0.36 + 0.14) * (2 * 0.4 + 0.14))
// (and a grid lot's size, settlements.js LU and LV: given, not imported, so the scatter can import this)
const LU = 0.36
const LV = 0.4
const CELL = 1

export class StreetNet {
  /** fcs: the island's town FeatureCollections; proj: the app's projection. */
  constructor(fcs, proj) {
    this.lines = []
    for (const fc of fcs) {
      for (const f of fc.features || []) {
        const p = f.properties || {}
        const c = f.geometry?.coordinates
        if (f.geometry?.type !== 'LineString' || !c || c.length < 2 || !Number.isFinite(p.from)) continue
        const pts = c.map((q) => proj.toWorld(q))
        let len = 0
        for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
        this.lines.push({ id: p.id, town: p.town, pts, len, from: p.from, to: Number.isFinite(p.to) ? p.to : null, cls: p.class === 'arterial' ? 'arterial' : 'street', width: STREET_WIDTH[p.class] ?? STREET_WIDTH.street })
      }
    }
    // the segments, hashed by cell, for the lots and the cover
    this.segs = []
    this.hash = new Map()
    this.lines.forEach((L, li) => {
      for (let i = 1; i < L.pts.length; i++) {
        const s = { a: L.pts[i - 1], b: L.pts[i], li, w: L.width, from: L.from, to: L.to }
        const k = this.segs.length
        this.segs.push(s)
        this.cells(Math.min(s.a[0], s.b[0]) - COVER, Math.min(s.a[1], s.b[1]) - COVER, Math.max(s.a[0], s.b[0]) + COVER, Math.max(s.a[1], s.b[1]) + COVER, (key) => {
          let list = this.hash.get(key)
          if (!list) this.hash.set(key, (list = []))
          list.push(k)
        })
      }
    })
    this.breaks = [...new Set(this.lines.flatMap((L) => (L.to !== null ? [L.from, L.to + 1] : [L.from])))].sort((a, b) => a - b)
    this.lots = this.layLots()
    this.lotHash = new Map()
    this.lots.forEach((l, k) => {
      const key = `${Math.floor(l.x / CELL)},${Math.floor(l.z / CELL)}`
      let list = this.lotHash.get(key)
      if (!list) this.lotHash.set(key, (list = []))
      list.push(k)
    })
  }

  cells(x0, z0, x1, z1, fn) {
    for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) fn(`${i},${j}`)
  }

  /** The segments near (x, z) (within COVER, give or take a cell). */
  near(x, z) {
    return this.hash.get(`${Math.floor(x / CELL)},${Math.floor(z / CELL)}`) || []
  }

  /**
   * The years in which the network covers (x, z): the spans of the streets
   * within COVER, merged, as [[from, to], …] (to Infinity while they stand),
   * or null where none comes near.
   */
  coverAt(x, z) {
    const spans = []
    for (const k of this.near(x, z)) {
      const s = this.segs[k]
      if (segDist(x, z, s.a, s.b) > COVER) continue
      spans.push([s.from, s.to ?? Infinity])
    }
    if (!spans.length) return null
    spans.sort((a, b) => a[0] - b[0])
    const out = [spans[0].slice()]
    for (const [a, b] of spans.slice(1)) {
      const last = out[out.length - 1]
      if (a <= last[1] + 1) last[1] = Math.max(last[1], b)
      else out.push([a, b])
    }
    return out
  }

  /** Whether the network covers (x, z) in year y. */
  covers(x, z, y) {
    for (const k of this.near(x, z)) {
      const s = this.segs[k]
      if (y < s.from || (s.to !== null && y > s.to + 1)) continue
      if (segDist(x, z, s.a, s.b) <= COVER) return true
    }
    return false
  }

  /** How far (x, z) lies from the middle of the nearest street standing in year y, less its half width (Infinity beyond COVER). */
  distAt(x, z, y) {
    let best = Infinity
    for (const k of this.near(x, z)) {
      const s = this.segs[k]
      if (y < s.from || (s.to !== null && y > s.to + 1)) continue
      best = Math.min(best, segDist(x, z, s.a, s.b) - s.w / 2)
    }
    return best
  }

  /** The street lots whose centres lie in the rectangle, fresh copies (the scatter writes to them). */
  lotsIn(x0, z0, x1, z1) {
    const out = []
    this.cells(x0, z0, x1 - 1e-9, z1 - 1e-9, (key) => {
      for (const k of this.lotHash.get(key) || []) {
        const l = this.lots[k]
        if (l.x >= x0 && l.x < x0 + (x1 - x0) && l.z >= z0 && l.z < z1) out.push({ ...l })
      }
    })
    return out
  }

  /** Every street's lots, oldest street first; see the header. */
  layLots() {
    const order = this.lines.map((_, i) => i).sort((a, b) => this.lines[a].from - this.lines[b].from || (this.lines[a].cls === 'arterial' ? -1 : 0) - (this.lines[b].cls === 'arterial' ? -1 : 0) || this.lines[b].len - this.lines[a].len)
    const lots = []
    const taken = new Map()
    const hx = LU / 2
    const hz = LV / 2
    for (const li of order) {
      const L = this.lines[li]
      const P = L.pts
      const cum = [0]
      for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
      const usable = L.len - 2 * END_CLEAR
      const n = Math.floor(usable / LU)
      if (n < 1) continue
      const s0 = END_CLEAR + (usable - n * LU) / 2
      const seed = ihash(li, 17, 5) * 1e6
      for (let k = 0; k < n; k++) {
        const d = s0 + (k + 0.5) * LU
        let i = 1
        while (i < cum.length - 1 && cum[i] < d) i++
        const t = (d - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
        const dx = P[i][0] - P[i - 1][0]
        const dz = P[i][1] - P[i - 1][1]
        const len = Math.hypot(dx, dz) || 1
        const e = [dx / len, dz / len]
        const cx = P[i - 1][0] + dx * t
        const cz = P[i - 1][1] + dz * t
        for (const side of [1, -1]) {
          // (m: from the street to the back of the lot)
          const m = [-e[1] * side, e[0] * side]
          const off = L.width / 2 + SETBACK + hz
          const x = cx + m[0] * off
          const z = cz + m[1] * off
          const box = { x, z, e, m, hx, hz }
          // (the strips kept clear of the lot and of the reach of a building's front beyond it)
          if (this.onStrip({ ...box, hx: hx + 0.02, hz: hz + SETBACK - 0.012 }) || overlaps(box, taken)) continue
          // (the lot's own hashes, as the grid's lots carry them: settlements.js tileLots)
          const gu = 2 * k + (side > 0 ? 0 : 1)
          const h = (q) => ihash(gu, li, 7 * q + 3)
          const f = [-m[0], -m[1]]
          const l = {
            x, z, e, m, face: Math.atan2(f[0], f[1]),
            rank: (0.5 + k * GOLD + (side > 0 ? 0 : 0.5) + seed) % 1,
            tile: 1000000 + li, bu: k, bv: side, u: d, v: side,
            lag: 25 * h(2), r2: h(3), r3: h(4), r4: h(5), r5: h(6), r6: h(7), r7: h(8), r8: h(9),
            span: [L.from, L.to ?? Infinity], street: L.id,
          }
          lots.push(l)
          const key = `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`
          let list = taken.get(key)
          if (!list) taken.set(key, (list = []))
          list.push(box)
        }
      }
    }
    // how much closer than the grid's the lots stand, about each: its rank
    // scaled by it (within a half and a double), so the fill builds as many
    // houses on an area as the grid would
    const R = 1.2
    const hash = new Map()
    lots.forEach((l, k) => {
      const key = `${Math.floor(l.x / CELL)},${Math.floor(l.z / CELL)}`
      if (!hash.has(key)) hash.set(key, [])
      hash.get(key).push(k)
    })
    for (const l of lots) {
      let n = 0
      for (let j = Math.floor((l.z - R) / CELL); j <= Math.floor((l.z + R) / CELL); j++) {
        for (let i = Math.floor((l.x - R) / CELL); i <= Math.floor((l.x + R) / CELL); i++) {
          for (const k of hash.get(`${i},${j}`) || []) if (Math.hypot(lots[k].x - l.x, lots[k].z - l.z) <= R) n++
        }
      }
      l.rank *= clamp(n / (Math.PI * R * R) / GRID_LOTS, 0.5, 2)
    }
    return lots
  }

  /** Whether a lot's footprint touches any street's strip, in any year. */
  onStrip(b) {
    for (const k of this.near(b.x, b.z)) {
      const s = this.segs[k]
      if (boxSegDist(b, s.a, s.b) < s.w / 2 + 0.006) return true
    }
    return false
  }
}

/** Distance from a turned box (centre, axes e and m, half extents hx and hz) to the segment a–b: 0 where they meet. */
function boxSegDist(b, a, c) {
  const loc = (p) => [(p[0] - b.x) * b.e[0] + (p[1] - b.z) * b.e[1], (p[0] - b.x) * b.m[0] + (p[1] - b.z) * b.m[1]]
  const A = loc(a)
  const C = loc(c)
  // (clipped to the box: they meet if any of the segment lies in it)
  let t0 = 0
  let t1 = 1
  const d = [C[0] - A[0], C[1] - A[1]]
  let meets = true
  for (const [p, q] of [[-d[0], A[0] + b.hx], [d[0], b.hx - A[0]], [-d[1], A[1] + b.hz], [d[1], b.hz - A[1]]]) {
    if (Math.abs(p) < 1e-12) {
      if (q < 0) meets = false
      continue
    }
    const r = q / p
    if (p < 0) t0 = Math.max(t0, r)
    else t1 = Math.min(t1, r)
  }
  if (meets && t0 <= t1) return 0
  const toBox = ([u, v]) => Math.hypot(Math.max(Math.abs(u) - b.hx, 0), Math.max(Math.abs(v) - b.hz, 0))
  let best = Math.min(toBox(A), toBox(C))
  for (const [u, v] of [[-b.hx, -b.hz], [b.hx, -b.hz], [b.hx, b.hz], [-b.hx, b.hz]]) best = Math.min(best, segDist(u, v, A, C))
  return best
}

/** Distance from (x, z) to the segment a–b. */
export function segDist(x, z, a, b) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const L2 = dx * dx + dz * dz
  const t = L2 > 0 ? clamp(((x - a[0]) * dx + (z - a[1]) * dz) / L2, 0, 1) : 0
  return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t)
}

/** Whether box b overlaps any already taken (separating axes, a hair in from each edge). */
function overlaps(b, taken) {
  const shrink = 0.004
  for (let j = Math.floor(b.z / CELL) - 1; j <= Math.floor(b.z / CELL) + 1; j++) {
    for (let i = Math.floor(b.x / CELL) - 1; i <= Math.floor(b.x / CELL) + 1; i++) {
      for (const q of taken.get(`${i},${j}`) || []) {
        if (Math.hypot(q.x - b.x, q.z - b.z) > 2 * Math.hypot(b.hx, b.hz)) continue
        let apart = false
        for (const ax of [b.e, b.m, q.e, q.m]) {
          const r = (o) => Math.abs(o.e[0] * ax[0] + o.e[1] * ax[1]) * (o.hx - shrink) + Math.abs(o.m[0] * ax[0] + o.m[1] * ax[1]) * (o.hz - shrink)
          const d = Math.abs((q.x - b.x) * ax[0] + (q.z - b.z) * ax[1])
          if (d >= r(b) + r(q)) {
            apart = true
            break
          }
        }
        if (!apart) return true
      }
    }
  }
  return false
}

/** Whether a lot stands in year y: a street's lot while its street does, a grid lot while the network does not cover it. */
export function lotStands(l, y) {
  if (l.span && (y < l.span[0] || y > l.span[1])) return false
  if (l.gone) for (const [a, b] of l.gone) if (y >= a && y <= b) return false
  return true
}
