// utah-teapot — the form: Newell's patches turned into parametric surfaces the kit can dress.
//
// Pure math (no THREE): every function returns plain arrays, so the node check
// (reference/utah-teapot/check-form.mjs) runs the very surfaces the artifact builds.
//
// Body, lid and knob: Newell's 4 quarter patches per ring are a tensor product of a profile row
// and a k = 0.56 quarter-circle Bézier, so ONE continuous surface per register is
// (azimuth, arc along the meridian) → the exact patch point: the quarter patch and its t are found
// from the azimuth (t inverted through a lookup of the quarter's own angle law), the profile
// segment and its s from the arc length. Décor therefore wraps with no seam at the four patch
// joins; the surface IS the Bézier patch (not a circle through it: those differ by up to 0.4 %).
// Spout and handle: two half-section patches round × two patches along, a tube (u round, v along
// by arc length of the top meridian).

import { newellPoint, GROUP } from './newell.js'

/** spout tip to handle back = 240 mm (chosen, not measured) */
export const NEWELL_WIDTH = 6.434075125
export const S = 240 / NEWELL_WIDTH // ≈ 37.30 mm per Newell unit
export const HEIGHT = 3.15 * S // ≈ 117.5 mm (the knob top)

const DEG = Math.PI / 180
const _q = [0, 0, 0]

/** vessel-space point of patch p at (s, t) */
export function patchPoint(p, s, t, out = [0, 0, 0]) {
  newellPoint(p, s, t, _q)
  out[0] = _q[0] * S; out[1] = _q[2] * S; out[2] = -_q[1] * S
  return out
}

// ------------------------------------------------------------------ azimuth → (quarter, t)

// The quarter's angle law α(t) (fraction of 90°) for k = 0.56, tabulated and inverted.
// Every revolved row in Newell's data uses k = 0.56 (the knob's 0.8 / 0.45 row: 0.5625 —
// t is then off by < 0.1° of azimuth, and the point is still exactly ON the patch).
const LUT_N = 2048
const T_OF_ALPHA = (() => {
  const k = 0.56
  const N = 8192
  const al = new Float64Array(N + 1)
  for (let i = 0; i <= N; i++) {
    const t = i / N, m = 1 - t
    const b0 = m * m * m, b1 = 3 * t * m * m, b2 = 3 * t * t * m, b3 = t * t * t
    const x = b0 + b1 + b2 * k, y = b1 * k + b2 + b3
    al[i] = Math.atan2(y, x) / (Math.PI / 2)
  }
  const out = new Float64Array(LUT_N + 1)
  let j = 0
  for (let i = 0; i <= LUT_N; i++) {
    const a = i / LUT_N
    while (j < N - 1 && al[j + 1] < a) j++
    const f = (a - al[j]) / Math.max(1e-12, al[j + 1] - al[j])
    out[i] = (j + Math.min(1, Math.max(0, f))) / N
  }
  return out
})()
function tOfAlpha(a) {
  const x = Math.min(1, Math.max(0, a)) * LUT_N
  const i = Math.min(LUT_N - 1, Math.floor(x))
  return T_OF_ALPHA[i] + (T_OF_ALPHA[i + 1] - T_OF_ALPHA[i]) * (x - i)
}

const azOf = (p) => Math.atan2(p[0], p[2]) / DEG // 0 = +Z, +90 = +X
/** per revolved group: each patch's azimuth at t = 0 and t = 1 (read off a row with r > 0) */
const QUARTERS = {}
for (const [name, g] of Object.entries(GROUP)) {
  if (name === 'spout' || name === 'handle') continue
  QUARTERS[name] = [0, 1, 2, 3].map((k) => {
    const a0 = azOf(patchPoint(g + k, 1, 0)), a1 = azOf(patchPoint(g + k, 1, 1))
    let d = a1 - a0
    d = ((d + 540) % 360) - 180 // ±90
    return { a0, d }
  })
}

/** (group, azimuth deg) → { p, t } */
function quarterAt(group, az) {
  const Q = QUARTERS[group]
  for (let k = 0; k < 4; k++) {
    const { a0, d } = Q[k]
    let f = (az - a0) / d
    f -= Math.floor(f / 4) * 4 // the four quarters tile 360°: fold into [0, 4)
    if (f <= 1 + 1e-9) return { p: GROUP[group] + k, t: tOfAlpha(f) }
  }
  return { p: GROUP[group], t: 0 }
}

// ------------------------------------------------------------------ meridian chains

/** [{ group, s0, s1 }] in order. Outer body: bottom centre → under the bowl → belly → shoulder → over the rim bead → its inner edge. */
export const BODY_CHAIN = [
  { group: 'bottom', s0: 0, s1: 1 },
  { group: 'lower', s0: 1, s1: 0 },
  { group: 'upper', s0: 1, s1: 0 },
  { group: 'rim', s0: 1, s1: 0 },
]
/** Lid: its edge → up the dome → the knob neck → under and over the knob → the knob's top centre. */
export const LID_CHAIN = [
  { group: 'lid', s0: 1, s1: 0 },
  { group: 'knob', s0: 1, s1: 0 },
]

/** arc-length table of a chain along the azimuth 90 (+X) meridian */
export function chainTable(chain, n = 600) {
  const segs = chain.map((c) => {
    const pts = [], cum = [0]
    const q = quarterAt(c.group, 90)
    for (let i = 0; i <= n; i++) {
      const s = c.s0 + ((c.s1 - c.s0) * i) / n
      pts.push(patchPoint(q.p, s, q.t))
      if (i) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]))
    }
    return { ...c, pts, cum, len: cum[n] }
  })
  let a = 0
  for (const s of segs) { s.a0 = a; a += s.len; s.a1 = a }
  const length = a
  /** arc → { seg, s } */
  function locate(arc) {
    arc = Math.min(length, Math.max(0, arc))
    let seg = segs[segs.length - 1]
    for (const s of segs) if (arc <= s.a1 + 1e-9) { seg = s; break }
    const x = arc - seg.a0
    let lo = 0, hi = n
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (seg.cum[m] <= x) lo = m; else hi = m }
    const f = (x - seg.cum[lo]) / Math.max(1e-12, seg.cum[hi] - seg.cum[lo])
    const i = lo + f
    return { seg, s: seg.s0 + ((seg.s1 - seg.s0) * i) / n }
  }
  /** meridian point (r, y) at arc, on the +X meridian */
  function at(arc) {
    const { seg, s } = locate(arc)
    const q = quarterAt(seg.group, 90)
    const p = patchPoint(q.p, s, q.t)
    return { r: Math.hypot(p[0], p[2]), y: p[1] }
  }
  /** first arc (from the start) at which the meridian reaches height y, searching [from, to] */
  function arcAtY(y, from = 0, to = length) {
    let prev = at(from).y
    const step = 0.25
    for (let a = from + step; a <= to + 1e-9; a += step) {
      const cur = at(a).y
      if ((prev - y) * (cur - y) <= 0) {
        let lo = a - step, hi = a
        for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if ((at(lo).y - y) * (at(m).y - y) <= 0) hi = m; else lo = m }
        return (lo + hi) / 2
      }
      prev = cur
    }
    return null
  }
  return { segs, length, locate, at, arcAtY }
}

/** the exact chain point at (azimuth deg, arc) */
export function chainPoint(table, az, arc, out = [0, 0, 0]) {
  const { seg, s } = table.locate(arc)
  const q = quarterAt(seg.group, az)
  return patchPoint(q.p, s, q.t, out)
}

/**
 * A buildSurface `surface` over a chain: u → azimuth az0 … az1 (increasing = left → right from outside),
 * v → arc a0 … a1 (up the chain). Normals = dP/du × dP/dv by central differences (nudged off poles),
 * which by the kit's convention points outward.
 */
export function revSurface(table, { az0, az1, a0, a1 }) {
  const P = (u, v, o) => chainPoint(table, az0 + (az1 - az0) * u, a0 + (a1 - a0) * v, o)
  return withNormals(P)
}

// ------------------------------------------------------------------ tubes (spout, handle)

/**
 * A Newell tube: two half-section patch pairs along. `halves` = [[pA, pB], [pC, pD]] (per along-segment:
 * the patch for u ∈ [0, ½] and for u ∈ [½, 1], each run t 0 → 1 or reversed per `rev`).
 * v is the arc length of the u = ½ meridian (normalised), optionally extended past either end
 * (`extend` [v0, v1] in s units of the end patches) — the handle's ends sink into the wall.
 */
export function tubeTable({ along, extend = [0, 0], n = 400 }) {
  // along: [{ lo: { p, rev }, hi: { p, rev } }] two segments; u = ½ is lo's t = 1 end
  const sAt = (k, i) => {
    const e0 = k === 0 ? extend[0] : 0, e1 = k === along.length - 1 ? extend[1] : 0
    return -e0 + ((1 + e0 + e1) * i) / n
  }
  const segs = along.map((seg, k) => {
    const cum = [0]
    let prev = null
    for (let i = 0; i <= n; i++) {
      const p = tubeRaw(seg, sAt(k, i), 0.5)
      if (prev) cum.push(cum[cum.length - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]))
      prev = p
    }
    return { seg, cum, len: cum[n], k }
  })
  let a = 0
  for (const s of segs) { s.a0 = a; a += s.len }
  const length = a
  function locate(arc) {
    arc = Math.min(length, Math.max(0, arc))
    let sg = segs[segs.length - 1]
    for (const s of segs) if (arc <= s.a0 + s.len + 1e-9) { sg = s; break }
    const x = arc - sg.a0
    let lo = 0, hi = n
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (sg.cum[m] <= x) lo = m; else hi = m }
    const f = (x - sg.cum[lo]) / Math.max(1e-12, sg.cum[hi] - sg.cum[lo])
    return { seg: sg.seg, s: sAt(sg.k, lo + f) }
  }
  const point = (u, v, o) => {
    const { seg, s } = locate(v * length)
    return tubeRaw(seg, s, u, o)
  }
  return { length, locate, point, surface: withNormals(point), splitV: segs[0].len / length }
}

function tubeRaw(seg, s, u, out = [0, 0, 0]) {
  const half = u <= 0.5 ? seg.lo : seg.hi
  let t = u <= 0.5 ? u * 2 : u * 2 - 1
  if (half.rev) t = 1 - t
  return patchPoint(half.p, s, t, out)
}

const G = GROUP
/** spout: u = 0 at the underside, ½ on the top meridian; −Z side first (so dP/du × dP/dv is outward), v root → mouth */
export const SPOUT_ALONG = [
  { lo: { p: G.spout + 1, rev: false }, hi: { p: G.spout, rev: false } },
  { lo: { p: G.spout + 3, rev: false }, hi: { p: G.spout + 2, rev: false } },
]
/** handle: u = 0 on the inner side (toward the body), ½ on the outer back; v upper root → lower root */
export const HANDLE_ALONG = [
  { lo: { p: G.handle, rev: false }, hi: { p: G.handle + 1, rev: false } },
  { lo: { p: G.handle + 2, rev: false }, hi: { p: G.handle + 3, rev: false } },
]

// ------------------------------------------------------------------ helpers

const _a = [0, 0, 0], _b = [0, 0, 0], _c = [0, 0, 0], _d = [0, 0, 0]
/** wrap a point function (u, v, out[3]) into a buildSurface surface with outward normals (dP/du × dP/dv) */
export function withNormals(P) {
  const nrm = (u, v, out) => {
    const h = 1e-4
    for (let tries = 0; tries < 6; tries++) {
      const vv = Math.min(1, Math.max(0, v))
      const u0 = Math.max(0, u - h), u1 = Math.min(1, u + h)
      const v0 = Math.max(0, vv - h), v1 = Math.min(1, vv + h)
      P(u1, vv, _a); P(u0, vv, _b); P(u, v1, _c); P(u, v0, _d)
      const ux = _a[0] - _b[0], uy = _a[1] - _b[1], uz = _a[2] - _b[2]
      const vx = _c[0] - _d[0], vy = _c[1] - _d[1], vz = _c[2] - _d[2]
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
      const l = Math.hypot(nx, ny, nz)
      if (l > 1e-10 * (Math.hypot(ux, uy, uz) + Math.hypot(vx, vy, vz) + 1e-12) && Math.hypot(ux, uy, uz) > 1e-9) {
        out[0] = nx / l; out[1] = ny / l; out[2] = nz / l
        return out
      }
      v = v > 0.5 ? v - 0.002 * (tries + 1) : v + 0.002 * (tries + 1) // a pole: step off it
    }
    out[0] = 0; out[1] = 1; out[2] = 0
    return out
  }
  const p = [0, 0, 0], n = [0, 0, 0]
  const fn = (u, v, out) => {
    P(u, v, p)
    nrm(u, v, n)
    out.pos.set(p[0], p[1], p[2])
    out.nrm.set(n[0], n[1], n[2])
  }
  fn.point = P
  fn.normal = nrm
  return fn
}
