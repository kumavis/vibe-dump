// The eight ladder-scored flanges of the Met gu 1985.214.4 (dossier §b.4).
//
// Each flange is authored as a side silhouette in the meridian plane, in (r, y) mm, and handed to
// kit.flange() as a measured `outline`. The path is a vertical line at a fixed radius R0 inside the
// wall, σ = y − y0, n horizontal radial, so (σ, t) ↔ (r = R0 + t, y) is AFFINE: the face triangles
// (built from outline vertices only) carry the groove map undistorted. The root edge is sampled every
// millimetre at rWall(y) − embed and so follows the concave foot exactly (the kit's generated outline
// has a two-point root, i.e. a straight chord that floated 1–2.5 mm off the bell). Rungs are our own groove polylines: square to the crest, crest → root, fanning round the spur.

import * as THREE from 'three'

const DEG = Math.PI / 180

/** Waist drum: slab flush with the drum ends (95.0–146.4), crest r 28.2, rounded corners. */
const WAIST = { y0: 95.05, y1: 146.35, crest: 28.15, corner: 1.8, thickness: 4.5, embed: 1.6 }

/**
 * Foot: crest silhouette (r, y), from the square top down the concave sweep to the spur tip, then the
 * spur underside back to the apron (side.jpg, 3× crops: a constant ≈ 8 mm band hugging the bell that
 * ends in a short blunt beak pointing out and a little down, ≈ 4 mm outside the ring arris; the
 * underside rises gently from the apron to the tip).
 */
const FOOT_TOP = 78.0
const FOOT_CREST = [
  [29.3, 78.0], [29.4, 75.7], [29.8, 70.0], [30.4, 64.5], [31.7, 59.0], [33.6, 53.3], [35.4, 47.4], [37.3, 41.9],
  [39.4, 38.2], [41.6, 35.0], [43.5, 32.8], [45.4, 30.9], [47.6, 29.3], [49.8, 28.1], [51.3, 27.5],
]
// the blunt tip (rounded, ≈ 2.8 mm tall, its point a little below the crest line) and the underside
const FOOT_TIP = [[52.2, 27.0], [52.65, 26.2], [52.7, 25.3], [52.3, 24.6], [51.4, 24.3]]
const FOOT_UNDER = [[49.0, 24.25], [46.0, 24.1], [43.0, 23.9], [40.6, 23.65]]

// ladder: 3.7 mm pitch, ≈ 1.1 mm grooves ≈ 0.8 mm deep between ≈ 2.6 mm flat lands; the crest only nicked
const PITCH = 3.7
const GROOVE = { width: 1.2, depth: 0.8 }
const NICK = { width: 1.1, depth: 0.42 }

/** Wall-meridian path at azimuth `az`, σ = y − y0, n horizontal radial, following the cast deformation. */
function axisPath(info, az, y0, y1, r0) {
  const th = az * DEG
  const sn = Math.sin(th), cs = Math.cos(th)
  const L = y1 - y0
  const v = new THREE.Vector3()
  return {
    isPath: true, planar: true, kind: 'meridian', theta: az, length: L,
    frame(sig) {
      const y = y0 + Math.min(Math.max(sig, -2), L + 2)
      const p = info.deform(v.set(r0 * sn, y, r0 * cs).clone())
      return { p, n: new THREE.Vector3(sn, 0, cs), d: new THREE.Vector3(0, 1, 0), b: new THREE.Vector3(cs, 0, -sn) }
    },
  }
}

/** Unit inward normal of a CCW-in-(r, y)… polyline at vertex i: toward the body for a crest run downward. */
function inwardNormal(pts, i) {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
  const tr = b[0] - a[0], ty = b[1] - a[1]
  const l = Math.hypot(tr, ty) || 1
  // crest runs top → bottom (y decreasing, r increasing): the body side is (−ty, tr) rotated … pick by sign
  let nr = ty / l, ny = -tr / l
  if (nr > 0) { nr = -nr; ny = -ny }
  return [nr, ny]
}

function inPoly(poly, x, y) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** Arc-length parameter of a polyline. */
function arcLen(pts) {
  const S = [0]
  for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  return S
}

/**
 * Cut shallow nicks into a crest polyline at arc positions `at` (the rungs' crest ends) and return
 * the nicked crest plus each rung's crest point and inward normal.
 */
function nickCrest(crest, at, { width, depth }) {
  const S = arcLen(crest)
  const out = []
  const rungs = []
  let k = 0
  const lerp = (s) => {
    let i = 1
    while (i < S.length - 1 && S[i] < s) i++
    const f = (s - S[i - 1]) / (S[i] - S[i - 1] || 1)
    const p = [crest[i - 1][0] + (crest[i][0] - crest[i - 1][0]) * f, crest[i - 1][1] + (crest[i][1] - crest[i - 1][1]) * f]
    return { p, n: inwardNormal(crest, f < 0.5 ? i - 1 : i) }
  }
  for (let i = 0; i < crest.length; i++) {
    while (k < at.length && at[k] - width / 2 <= S[i]) {
      const c = at[k]
      const A = lerp(c - width / 2), B = lerp(c + width / 2), M = lerp(c)
      // a rounded nick: in, floor, out
      out.push(A.p)
      out.push([A.p[0] + A.n[0] * depth * 0.75 + (M.p[0] - A.p[0]) * 0.35, A.p[1] + A.n[1] * depth * 0.75 + (M.p[1] - A.p[1]) * 0.35])
      out.push([M.p[0] + M.n[0] * depth, M.p[1] + M.n[1] * depth])
      out.push([B.p[0] + B.n[0] * depth * 0.75 + (M.p[0] - B.p[0]) * 0.35, B.p[1] + B.n[1] * depth * 0.75 + (M.p[1] - B.p[1]) * 0.35])
      out.push(B.p)
      rungs.push({ p: [M.p[0] + M.n[0] * depth, M.p[1] + M.n[1] * depth], n: M.n })
      k++
      while (i < crest.length && S[i] <= c + width / 2) i++
    }
    if (i < crest.length) out.push(crest[i])
  }
  return { crest: out, rungs }
}

/**
 * Build one flange from an (r, y) silhouette: `crest` runs from the top end DOWN to the bottom end
 * (it may continue round a spur and back along an underside to the wall); root from y0 to y1.
 */
function buildFlange(kit, info, az, { y0, y1, rWall, crest, rungs, thickness, embed, seed, bevel }) {
  const L = y1 - y0
  // (r, y) → (σ, t)
  const R0 = 18.5 // inside every root (min wall 21.1 − embed)
  const toST = ([r, y]) => [y - y0, r - R0]
  const pts = []
  // root, bottom → top, every 1 mm
  const n = Math.max(2, Math.ceil(L))
  for (let i = 0; i <= n; i++) pts.push(toST([rWall(y0 + (L * i) / n) - embed, y0 + (L * i) / n]))
  // top end straight up, then the crest top → bottom, then down to the root start
  for (const p of crest) pts.push(toST(p))
  pts.push(toST([rWall(y0) - embed, y0]))
  // dedupe the closing point
  const last = pts[pts.length - 1], first = pts[0]
  if (Math.hypot(last[0] - first[0], last[1] - first[1]) < 1e-4) pts.pop()
  // rungs: from the nick floor along the inward normal until it leaves the flange's own silhouette
  const sil = crest.slice()
  for (let i = 0; i <= n; i++) {
    const y = y0 + (L * i) / n
    sil.push([rWall(y) - embed, y])
  }
  const grooves = []
  for (const { p, n: nn } of rungs) {
    const line = [p]
    let q = p
    for (let s = 0.25; s < 30; s += 0.25) {
      const x = p[0] + nn[0] * s, y = p[1] + nn[1] * s
      if (!inPoly(sil, x, y) || x < rWall(y) + 0.25) break
      q = [x, y]
    }
    if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.6) continue
    // sampled densely so the straight (r, y) rung stays straight through the (σ, t) shear
    const m = Math.max(2, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 0.5))
    for (let i = 1; i <= m; i++) line.push([p[0] + ((q[0] - p[0]) * i) / m, p[1] + ((q[1] - p[1]) * i) / m])
    grooves.push(line.map(toST))
  }
  return kit.flange({
    path: axisPath(info, az, y0, y1, R0), outline: pts, grooves, grooveStyle: GROOVE,
    thickness, embed: 0, taper: 0, waver: 0.3, bevel, seed,
  })
}

/** Foot flange silhouette: crest (top → spur tip → underside), its rung positions, root range. */
function footSilhouette(kit, P) {
  const yBot = FOOT_UNDER[FOOT_UNDER.length - 1][1]
  const sweep = kit.shapes.spline(FOOT_CREST, 0.4)
  const tip = kit.shapes.spline([sweep[sweep.length - 2], ...FOOT_TIP, FOOT_UNDER[0]], 0.3).slice(1)
  const under = FOOT_UNDER.slice(1)
  // rungs: every PITCH along the crest from the top end (first one a land below the square top),
  // continuing round the spur tip (the bronze's rungs fan round it)
  const S = arcLen(sweep.concat(tip.slice(0, 3)))
  const total = S[S.length - 1]
  const at = []
  for (let s = 2.6; s < total - 0.8; s += PITCH) at.push(s)
  const { crest: nicked, rungs } = nickCrest(sweep.concat(tip.slice(0, 3)), at, NICK)
  const crest = [...nicked, ...tip.slice(3), ...under]
  return { crest, rungs, y0: yBot, y1: FOOT_TOP, rWall: (y) => P.rAtY(y) }
}

/** Waist slab silhouette: square-ish rectangle with rounded outer corners and a slight top swelling. */
function waistSilhouette(P) {
  const W = WAIST
  const rW = (y) => P.rAtY(Math.min(Math.max(y, 95.2), 146.2))
  const c = W.corner
  const crestR = (y) => {
    // slight rounded swelling at the top end (dossier §b.4)
    const t = Math.max(0, 1 - Math.abs(W.y1 - 4.5 - y) / 4.5)
    return W.crest + 0.35 * t * t * (3 - 2 * t)
  }
  // straight crest, top → bottom, with the rungs at PITCH centred on the slab
  const Lc = W.y1 - W.y0
  const nR = Math.round(Lc / PITCH)
  const at = []
  for (let k = 0; k < nR; k++) at.push((Lc - (nR - 1) * PITCH) / 2 + k * PITCH)
  const line = []
  for (let y = W.y1 - c; y >= W.y0 + c - 1e-6; y -= 0.5) line.push([crestR(y), y])
  // rung positions are arc lengths along `line` (which starts at y1 − c)
  const { crest: nicked, rungs } = nickCrest(line, at.map((s) => s - c).filter((s) => s > 0.8 && s < Lc - 2 * c - 0.8), NICK)
  const corner = (cy, sgn) => {
    // quarter circle from the end face to the crest; sgn +1 at the top, −1 at the bottom
    const pts = []
    for (let i = 0; i <= 6; i++) {
      const a = (i / 6) * (Math.PI / 2)
      pts.push([crestR(cy) - c + c * Math.sin(a), cy + sgn * c * Math.cos(a)])
    }
    return sgn > 0 ? pts : pts.reverse()
  }
  const crest = [[rW(W.y1) + 0.6, W.y1], ...corner(W.y1 - c, 1).slice(0, -1), ...nicked, ...corner(W.y0 + c, -1).slice(1), [rW(W.y0) + 0.6, W.y0]]
  return { crest, rungs, y0: W.y0, y1: W.y1, rWall: rW }
}

/**
 * All eight flanges (each its own mesh root, part 'flanges').
 * @returns {THREE.Mesh[]}
 */
export function guFlanges(kit, body, P, { seed = 1985 } = {}) {
  const info = body.userData.lathe
  const out = []
  const foot = footSilhouette(kit, P)
  const waist = waistSilhouette(P)
  let n = 0
  for (const az of [0, 90, 180, 270]) {
    out.push(buildFlange(kit, info, az, { ...waist, thickness: WAIST.thickness, embed: WAIST.embed, bevel: 0.7, seed: seed + 17 * n++ }))
    out.push(buildFlange(kit, info, az, { ...foot, thickness: 5.0, embed: 1.4, bevel: 0.6, seed: seed + 17 * n++ }))
  }
  for (const f of out) f.userData.part = 'flanges'
  return out
}
