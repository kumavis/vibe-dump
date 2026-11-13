// The eight ladder-scored flanges of the Met gu 1985.214.4 (dossier §b.4).
//
// The kit's flange() takes any path with frame(σ) → { p, n, d, b }. These paths
// lie in the meridian plane of their azimuth: p runs along the wall (with the
// lathe's cast deformation), n points from the wall to the measured crest, so
// the crest is exactly the dossier's silhouette r(y) and every ladder rung (a
// line of constant σ) runs from crest to root, square to the crest — on the
// foot that keeps the rungs fanning round the spur as they do on the bronze.

import * as THREE from 'three'

const DEG = Math.PI / 180

/** Waist drum: rectangular slab 52 × 6.7 mm, flush with the drum ends, rounded corners. */
const WAIST = { y0: 94.5, y1: 146.5, root: 21.45, proj: 6.7, corner: 2.0, thickness: 4.5 }

/** Foot: crest silhouette (r, y) bottom → top: spur underside → blunt tip → concave sweep → square top at the foot top. */
const FOOT_CREST = [
  [51.5, 24.0], [52.2, 24.9], [52.3, 25.9], [51.7, 26.9], [50.6, 27.6], [49.6, 28.1], [47.6, 29.4], [45.4, 30.9], [43.4, 32.8],
  [41.6, 35.0], [39.3, 38.4], [37.3, 41.9], [35.2, 47.4], [33.6, 53.3], [31.8, 59.0], [30.4, 64.5], [29.7, 70.0], [29.4, 75.7], [29.3, 78.0],
]

// grooves 1.1 mm between ≈ 2.6 mm flat lands; the crest is only nicked (a deep notch read as a staircase of plates)
const SCORE = { shape: 'score', pitch: 3.7, width: 0.9, rungs: 'full', groove: { width: 1.1, depth: 0.4 } }

/**
 * A planar path from samples [{ s, r, y, a }] (σ mm, root radius/height, n tilt above the horizontal in rad)
 * at azimuth `az` (deg), following the body's cast deformation.
 */
function meridianPath(info, az, samples) {
  const th = az * DEG
  const sn = Math.sin(th), cs = Math.cos(th)
  const L = samples[samples.length - 1].s
  const pAt = samples.map(({ r, y }) => info.deform(new THREE.Vector3(r * sn, y, r * cs)))
  const out = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3(cs, 0, -sn) }
  const find = (s) => {
    let lo = 0, hi = samples.length - 1
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (samples[m].s <= s) lo = m
      else hi = m
    }
    return lo
  }
  return {
    isPath: true, planar: true, kind: 'meridian', theta: az, length: L,
    frame(sig) {
      const c = Math.min(Math.max(sig, 0), L)
      const i = Math.min(find(c), samples.length - 2)
      const A = samples[i], B = samples[i + 1]
      const f = B.s > A.s ? (c - A.s) / (B.s - A.s) : 0
      const a = A.a + (B.a - A.a) * f
      out.p.lerpVectors(pAt[i], pAt[i + 1], f)
      const ca = Math.cos(a), sa = Math.sin(a)
      out.n.set(sn * ca, sa, cs * ca)
      out.d.set(-sn * sa, ca, -cs * sa)
      if (sig !== c) out.p.addScaledVector(out.d, sig - c)
      return { p: out.p.clone(), n: out.n.clone(), d: out.d.clone(), b: out.b.clone() }
    },
  }
}

const interp = (xs, ys) => (x) => {
  if (x <= xs[0]) return ys[0]
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1]
  let lo = 0, hi = xs.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (xs[m] <= x) lo = m
    else hi = m
  }
  const f = (x - xs[lo]) / (xs[hi] - xs[lo])
  return ys[lo] + (ys[hi] - ys[lo]) * f
}

/** The foot flange's path samples and height law, from the crest silhouette and the body profile. */
function footGeometry(kit, P) {
  const crest = kit.shapes.spline(FOOT_CREST, 0.5)
  const rWall = (y) => P.rAtY(y)
  const inside = (r, y) => r < rWall(y)
  const S = [0]
  for (let i = 1; i < crest.length; i++) S.push(S[i - 1] + Math.hypot(crest[i][0] - crest[i - 1][0], crest[i][1] - crest[i - 1][1]))
  // 1. a root for each crest point: march from the crest, square to it (tilt clamped), to the wall
  const raw = crest.map((c, i) => {
    const a0 = crest[Math.max(0, i - 2)], a1 = crest[Math.min(crest.length - 1, i + 2)]
    const tr = a1[0] - a0[0], ty = a1[1] - a0[1]
    const tl = Math.hypot(tr, ty) || 1
    let a = Math.atan2(-tr / tl, ty / tl) // outward normal (ty, -tr) → angle above horizontal
    a = Math.max(-5 * DEG, Math.min(46 * DEG, a)) * Math.min(1, S[i] / 3.2)
    const nr = Math.cos(a), ny = Math.sin(a)
    let lo = 0, hi = 40
    for (let k = 0; k < 40; k++) {
      const m = (lo + hi) / 2
      if (inside(c[0] - m * nr, c[1] - m * ny)) hi = m
      else lo = m
    }
    return { y: c[1] - hi * ny }
  })
  // 2. roots climb the wall monotonically; n = root → crest
  let yPrev = -Infinity
  const samples = [], heights = []
  crest.forEach((c, i) => {
    const y = Math.max(raw[i].y, yPrev + 0.05)
    yPrev = y
    const r = rWall(y)
    const dr = c[0] - r, dy = c[1] - y
    samples.push({ s: S[i], r, y, a: Math.atan2(dy, dr) })
    heights.push(Math.hypot(dr, dy))
  })
  const L = S[S.length - 1]
  const hS = interp(S, heights)
  return { samples, height: (f) => hS(f * L), length: L }
}

/**
 * All eight flanges (each its own mesh root, part 'flanges'), added to `parent`.
 * @returns {THREE.Mesh[]}
 */
export function guFlanges(kit, body, P, { seed = 1985 } = {}) {
  const info = body.userData.lathe
  const out = []
  // waist slabs
  const W = WAIST
  const Lw = W.y1 - W.y0
  const wSamples = []
  for (let s = 0; s <= Lw + 1e-6; s += 2) wSamples.push({ s, r: W.root, y: W.y0 + s, a: 0 })
  const rc = W.corner
  const wHeight = (f) => {
    const dEnd = Math.min(f * Lw, (1 - f) * Lw)
    const base = dEnd >= rc ? W.proj : W.proj - rc + Math.sqrt(Math.max(0, rc * rc - (rc - dEnd) ** 2))
    // a slight rounded swelling at the top end (dossier §b.4)
    const t = Math.max(0, 1 - Math.abs((1 - f) * Lw - 4.5) / 4.5)
    return base + 0.35 * t * t * (3 - 2 * t)
  }
  const foot = footGeometry(kit, P)
  let n = 0
  for (const az of [0, 90, 180, 270]) {
    out.push(kit.flange({
      path: meridianPath(info, az, wSamples), height: wHeight, thickness: W.thickness, embed: 1.8, taper: 3, waver: 0.35,
      notches: { ...SCORE, depth: 0.2 / W.proj }, bevel: 0.4, seed: seed + 17 * n++,
    }))
    out.push(kit.flange({
      path: meridianPath(info, az, foot.samples), height: foot.height, thickness: 5.0, embed: 1.4, taper: 3, waver: 0.3,
      notches: { ...SCORE, depth: 0.2 / 13 }, bevel: 0.4, seed: seed + 17 * n++,
    }))
  }
  for (const f of out) f.userData.part = 'flanges'
  return out
}
