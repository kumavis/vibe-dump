// Nezu jue 饕餮文爵 (90105) — FORM: the measured outline and the cast parts.
// Read off the project owner's ONE photograph (reference/nezu-jue/photo-02.jpg: three-quarter from behind the
// handle, camera ≈ 130° round from the spout and ≈ 17° above the rim) at an INFERRED scale (dossier § Scale).
// Units mm, Y up, ground y = 0, azimuth θ in degrees: 0 = front (+Z) = the SPOUT, 180 = the tail, +X (θ 90) = the
// handle side. The camera of the photograph stands at θ ≈ 130: it sees the handle on the left of the cup, the
// spout running away to the upper left, the tail coming toward it on the right.
//
//   spout   θ 0, a U channel, tip ρ 106 at y 189         tail   θ 180, pointed, tip ρ 76 at y 212
//   posts   θ ±27 on the rim at the spout root            handle θ 90 (loop, head at its top)
//   legs    θ 90 (under the handle), 210, 330             flanges θ 0 and 180 on the band (the masks' noses)
//
// The cup is NOT a lathe: below the band top it is a body of revolution; above it every meridian runs from the
// band top out to its own point of the rim, whose plan is the union of a circle, the spout's stadium and the tail's
// triangle and whose height rises into spout and tail (rimSweep below). Along the spout the meridians first run
// out along a channel floor and then rise steeply into the rim: the side walls of the U channel fall out of that.

import * as THREE from 'three'

export const DEG = Math.PI / 180
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const smax = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.max(a, b) + h * h * k * 0.25 }

export const AZ = { spout: 0, tail: 180, handle: 90, legs: [90, 210, 330], posts: [50, -50], flanges: [0, 180] }

// lower cup, bottom → band top ([r, y]); a near-hemispherical bottom (photo-02: the bowl hangs ≈ 34 mm below the band,
// fix pass r8: was 23 mm, ≈ 8 mm too shallow against the landmark overlay), a straight band
export const CUP = [
  [0.03, 69.0], [8, 69.7], [15, 72.2], [21, 75.9], [26, 80.6], [29.8, 86.0], [32.4, 91.7], [33.8, 97.2], [34.2, 100.6],
  [34.3, 102.2], [34.4, 121.0], [34.7, 140.0],
]
/** height of the outer bowl surface at radius rho (rho < 34.2), else the band foot */
export function bowlY(rho) {
  for (let i = 1; i < CUP.length; i++) {
    if (CUP[i][0] >= rho) { const f = (rho - CUP[i - 1][0]) / Math.max(1e-6, CUP[i][0] - CUP[i - 1][0]); return lerp(CUP[i - 1][1], CUP[i][1], clamp(f, 0, 1)) }
  }
  return CUP[CUP.length - 1][1]
}
export const REG = { band: [101, 140], upper: [140.5, 163] } // décor registers, y mm
export const Y_C = 140 // where the swept upper wall starts (top of the band's upper fillet)
export const RIM = {
  r0: 44, y0: 161, // side rim (θ ±60…±120): a gently flared lip
  // jue-fix: the spout is a broad open trough that FLARES toward its end (half-width halfRoot at the cup → half at
  // the tip round, wider: outer width ≈ 26 at the root → 38 at the mouth, was 27 → 19: the far wall's top stands
  // ≈ 10 mm higher in photo-02 than a 31 mm mouth puts it), the channel shallower at the
  // mouth (8 mm, was 13) than at the root. Both wall tops climb STEADILY from the side rim at z ≈ z0 to the level end
  // (≈ 0.5 mm per mm of z: the near wall's top back-projected from photo-02 through the refitted side camera; the old
  // fast-rising pow 0.65 sat ≈ 8 mm too high at the posts' feet) — reaching S.y at z = tip − 10, `droop` mm lower
  // at the very end; a thick rolled rim along both walls (buildSpoutLip).
  spout: { half: 21, halfRoot: 18, tip: 97, y: 188, depth: 8, dip: 5, wall: 5, z0: 28, rise: 1, droop: 0.6, roll: 1.9 },
  // jue-fix (photo-02 through the refitted side camera): tip 2.5 mm lower; the far wall of the tail shows ≈ 8 mm beyond
  // the old silhouette below its top edge: a broader base (±18°, was ±13) and a fuller, less hollowed underside (full)
  tail: { tip: 77, y: 190.5, baseAz: 18, pow: 1.15, full: 1 },
  soft: 12, // mm: soft max between circle / spout / tail outlines (rounded inner corners in plan)
  lip: 3.0, // wall thickness at the rim: a flat, slightly thickened edge (no rolled tube: fix pass r8)
}

// ---- plan outline of the rim: ρ(θ) as a soft union of circle, spout stadium and tail triangle
function rayStadium(az) {
  const S = RIM.spout
  const s = Math.sin(az * DEG), c = Math.cos(az * DEG)
  if (c <= 0) return 0
  const zc = S.tip - S.half // centre of the tip round
  const halfAt = (z) => lerp(S.halfRoot, S.half, clamp(z / zc, 0, 1))
  const inside = (t) => { const x = t * s, z = t * c; return z <= zc ? Math.abs(x) <= halfAt(z) : Math.hypot(x, z - zc) <= S.half }
  if (!inside(0.5)) return 0
  // march out, then bisect the exit
  let a = 0.5, b = 0.5
  while (b < S.tip + 2 && inside(b)) { a = b; b += 1.5 }
  for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (inside(m)) a = m; else b = m }
  return a
}
function rayTail(az) {
  const T = RIM.tail
  // triangle: tip (0, -tip), base corners at the rim circle at ±baseAz from the tail axis
  const bx = RIM.r0 * Math.sin(T.baseAz * DEG), bz = -RIM.r0 * Math.cos(T.baseAz * DEG)
  const s = Math.sin(az * DEG), c = Math.cos(az * DEG)
  if (c >= 0) return 0
  // edge from (sign·bx, bz) to (0, -tip): solve t·(s, c) on that line
  const sx = s >= 0 ? bx : -bx
  const ex = 0 - sx, ez = -T.tip - bz
  const det = s * ez - c * ex
  if (Math.abs(det) < 1e-9) return 0
  const t = (sx * ez - bz * ex) / det
  return Math.max(0, t)
}
export function rimPlan(az) {
  const k = RIM.soft
  return smax(smax(RIM.r0, rayStadium(az), k), rayTail(az), k)
}
export function rimHeight(az, rho) {
  const x = rho * Math.sin(az * DEG), z = rho * Math.cos(az * DEG)
  const S = RIM.spout, T = RIM.tail
  let y = RIM.y0
  // a smooth saddle: lowest at the sides (θ ±90), rising into spout and tail
  if (z > 0) {
    const t = clamp((z - S.z0) / (S.tip - 10 - S.z0), 0, 1)
    y += (S.y - RIM.y0) * Math.pow(t, S.rise) - S.droop * smooth((z - (S.tip - 12)) / 12)
  }
  if (z < 0) y += (T.y - RIM.y0) * Math.pow(clamp((-z - 4) / (T.tip - 4), 0, 1), T.pow)
  return y + 0 * x
}

// ---- one meridian of the upper wall: N points from (CUP top) to the rim point at az
function resample(pts, N) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1] || 1
  const out = []
  let j = 0
  for (let i = 0; i < N; i++) {
    const s = (i / (N - 1)) * L
    while (j < pts.length - 2 && cum[j + 1] < s) j++
    const f = clamp((s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]), 0, 1)
    out.push([lerp(pts[j][0], pts[j + 1][0], f), lerp(pts[j][1], pts[j + 1][1], f)])
  }
  return out
}
function bez(p0, p1, p2, p3, n) {
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t
    out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]])
  }
  return out
}
export const N_UP = 64
const _merCache = new Map()
export function meridian(az) {
  const key = Math.round(az * 1e4)
  const hit = _merCache.get(key)
  if (hit) return hit
  const rc = CUP[CUP.length - 1][0]
  const re = rimPlan(az), ye = rimHeight(az, re)
  const dx = re - rc, dy = ye - Y_C
  // tail / sides: vertical at the band top, sweeping out (concave) into the rim
  // the tail's meridians are fuller (straighter from the band top to the tip): blend by how far the rim runs out
  const tw = Math.cos(az * DEG) < 0 ? RIM.tail.full * smooth((re - RIM.r0) / 14) : 0
  const F = resample(bez([rc, Y_C], [rc + lerp(0.08, 0.22, tw) * dx, Y_C + lerp(0.45, 0.34, tw) * dy], [rc + lerp(0.4, 0.6, tw) * dx, Y_C + lerp(0.86, 0.76, tw) * dy], [re, ye], 40), N_UP)
  // spout: a U channel. Every spout meridian runs up out of the band, out along the sloping floor (the chin
  // seen from outside) and then climbs its wall into the rim; side walls fall out of meridians whose rim point
  // lies close in, the rounded end out of those that reach the tip.
  const sp = Math.cos(az * DEG) > 0 ? smooth((re - RIM.r0 + 3) / 14) : 0
  let M = F
  if (sp > 0) {
    const S = RIM.spout
    // fix pass r8: a U section, not a flat tray: the floor is lowest on the spout axis (the keel = the chin seen from
    // outside, kept where the silhouette put it) and curls up toward each wall by S.dip (× (lateral / half-width)²)
    const zc = S.tip - S.half, sa = Math.abs(Math.sin(az * DEG)), ca = Math.cos(az * DEG)
    const fl = (r) => {
      const y = Y_C + 3 + (r - rc) * ((S.y - S.depth - Y_C - 3) / (S.tip - S.wall - rc))
      const z = r * ca, half = lerp(S.halfRoot, S.half, clamp(z / zc, 0, 1))
      const u = clamp((r * sa) / half, 0, 1)
      return y + S.dip * smooth((r - rc) / 14) * u * u
    }
    const fEnd = Math.max(rc + 2, re - S.wall)
    const pts = [[rc, Y_C], [rc + 0.4, Y_C + 2.2], [rc + 1.6, fl(rc + 1.6)]]
    for (let r = rc + 4; r < fEnd; r += 3) pts.push([r, fl(r)])
    const yf = Math.min(fl(fEnd), ye - 2)
    pts.push([fEnd, yf], [fEnd + 0.55 * (re - fEnd), yf + 0.3 * (ye - yf)], [re - 0.1 * (re - fEnd), yf + 0.75 * (ye - yf)], [re, ye])
    const T = resample(pts, N_UP)
    M = F.map((p, i) => [lerp(p[0], T[i][0], sp), lerp(p[1], T[i][1], sp)])
  }
  _merCache.set(key, M)
  return M
}

// ---- the body surface: u = θ (seam on the handle, θ = 90 + 360 u), v: bowl | band | upper
const cupProfile = (() => {
  const cum = [0]
  for (let i = 1; i < CUP.length; i++) cum.push(cum[i - 1] + Math.hypot(CUP[i][0] - CUP[i - 1][0], CUP[i][1] - CUP[i - 1][1]))
  return { cum, L: cum[cum.length - 1] }
})()
function cupAt(s) {
  const { cum } = cupProfile
  let j = 0
  while (j < CUP.length - 2 && cum[j + 1] < s) j++
  const f = clamp((s - cum[j]) / (cum[j + 1] - cum[j]), 0, 1)
  return [lerp(CUP[j][0], CUP[j + 1][0], f), lerp(CUP[j][1], CUP[j + 1][1], f)]
}
// arc position of y on the (monotone above the bottom) cup profile
function cupS(y) {
  const { cum } = cupProfile
  for (let i = 1; i < CUP.length; i++) if (CUP[i][1] >= y) return cum[i - 1] + (cum[i] - cum[i - 1]) * (y - CUP[i - 1][1]) / (CUP[i][1] - CUP[i - 1][1])
  return cupProfile.L
}
export const V_SPLIT = 0.62 // v at the band top (Y_C): the cup below, the swept upper wall above
export const azOfU = (u) => 90 + 360 * u
export const uOfAz = (az) => ((((az - 90) % 360) + 360) % 360) / 360

/** (u, v) → point (mm), no normal */
export function bodyPoint(u, v, p) {
  const az = azOfU(u)
  let r, y
  if (v <= V_SPLIT) {
    ;[r, y] = cupAt((v / V_SPLIT) * cupProfile.L)
  } else {
    const M = meridian(az)
    const t = ((v - V_SPLIT) / (1 - V_SPLIT)) * (N_UP - 1)
    const i = Math.min(N_UP - 2, Math.floor(t)), f = t - i
    r = lerp(M[i][0], M[i + 1][0], f); y = lerp(M[i][1], M[i + 1][1], f)
  }
  return p.set(r * Math.sin(az * DEG), y, r * Math.cos(az * DEG))
}
/** v at height y on the cup (below Y_C) */
export const vOfCupY = (y) => (cupS(y) / cupProfile.L) * V_SPLIT

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3()
export function bodySurface(u, v, out) {
  bodyPoint(u, v, out.pos)
  const e = 2e-4
  bodyPoint(u + e, v, _a); bodyPoint(u - e, v, _b)
  bodyPoint(u, Math.min(1, v + e), _c); bodyPoint(u, Math.max(0, v - e), _d)
  _a.sub(_b); _c.sub(_d)
  out.nrm.crossVectors(_a, _c)
  const l = out.nrm.length()
  if (l > 1e-10) out.nrm.multiplyScalar(1 / l)
  else out.nrm.set(0, -1, 0)
}

/** parameter samples: θ denser toward the spout and tail tips; v: bowl, band (fine), upper wall */
export function bodySamples(q = 1) {
  const k = Math.sqrt(q)
  const nu = Math.round(300 * k)
  const us = []
  for (let i = 0; i <= nu; i++) us.push(i / nu)
  // extra columns round the spout tip (θ ±12) and the tail tip (θ 180 ± 8)
  const extra = []
  for (const [c, w] of [[0, 14], [180, 10]]) {
    const n = Math.round(60 * k)
    for (let i = -n; i <= n; i++) extra.push(uOfAz(c + (i / n) * w))
  }
  const U = [...new Set([...us, ...extra].map((x) => Math.round(x * 1e6) / 1e6))].sort((a, b) => a - b)
  const vs = []
  const nB = Math.round(24 * k), nBand = Math.round(70 * k), nUp = Math.round(90 * k)
  const vb0 = vOfCupY(REG.band[0] - 1.5)
  for (let i = 0; i < nB; i++) vs.push((i / nB) * vb0)
  for (let i = 0; i < nBand; i++) vs.push(vb0 + (i / nBand) * (V_SPLIT - vb0))
  for (let i = 0; i <= nUp; i++) vs.push(V_SPLIT + (i / nUp) * (1 - V_SPLIT))
  return { u: U, v: vs }
}

// ----------------------------------------------------------------------------------------------------- LEGS
// Three straight blade legs of triangular section, sharp edge outward, splayed ≈ 17°, tips nearly pointed
// (photo-02: the near leg under the handle and the right leg at θ 210; the third, θ 330, is hidden behind them).
// jue-fix: tapering steadily (near-linear) to a point (photo-02 crop: both visible tips ≈ 3 mm across), was 6 × 4.6 mm
export const LEG = { topY: 88, rhoTop: 24, rhoTip: 44, depthTop: 19, depthTip: 2.4, chordTop: 25, chordTip: 2.8, taper: 0.92, bow: 2.0, embed: 12, seat: 1.4, point: 2.2 }
export function legSection(y) {
  const t = clamp(y / LEG.topY, 0, 1.2)
  const a = lerp(LEG.rhoTip, LEG.rhoTop, t) + LEG.bow * Math.sin(Math.PI * clamp(t, 0, 1))
  const d = lerp(LEG.depthTip, LEG.depthTop, Math.pow(Math.min(1, t), LEG.taper))
  const c = lerp(LEG.chordTip, LEG.chordTop, Math.pow(Math.min(1, t), LEG.taper))
  return { apex: a + d * 0.45, back: a - d * 0.55, half: c / 2 }
}
const dirOut = (az) => new THREE.Vector3(Math.sin(az * DEG), 0, Math.cos(az * DEG))
const dirLat = (az) => new THREE.Vector3(Math.cos(az * DEG), 0, -Math.sin(az * DEG))

export function buildLeg(kit, { az, material, q = 1 }) {
  const out = dirOut(az), lat = dirLat(az)
  const yTop = LEG.topY + LEG.embed
  const P = (rho, l, y, v) => v.set(out.x * rho + lat.x * l, y, out.z * rho + lat.z * l)
  const g = new THREE.Group()
  g.name = 'leg'; g.userData.part = 'legs'
  const nv = Math.max(16, Math.round(44 * Math.sqrt(q)))
  // one closed triangular section swept up the leg; corners slightly rounded (the faces meet in soft arrises)
  const ring = (s) => {
    // 3 corners: apex (out), back-left, back-right; 4 points per side, the corner pulled in by `round`
    const C = [[s.apex, 0], [s.back, s.half], [s.back, -s.half]]
    // 8 points per side, flat faces, narrow corner fillets: the outward arris catches the light as a crisp line
    const pts = []
    const rr = [0.07, 0.16, 0.16]
    for (let i = 0; i < 3; i++) {
      const A = C[i], B = C[(i + 1) % 3]
      const ra = rr[i], rb = rr[(i + 1) % 3]
      for (let k = 0; k < 8; k++) {
        const f = ra * 0.5 + (k / 7) * (1 - ra * 0.5 - rb * 0.5)
        pts.push([lerp(A[0], B[0], f), lerp(A[1], B[1], f)])
      }
    }
    return pts
  }
  const nr = 24
  // the leg's top is cut by the bowl: each section point stops LEG.seat mm inside the outer bowl surface (so the leg
  // never shows through into the cup, fix pass r8)
  const at = (u, y) => {
    const R = ring(legSection(y))
    // u runs CCW round +Y (apex → +lat → −lat), i.e. left → right seen from outside, so the grid's winding and
    // the normals derived from it point OUT (jue-fix: this was (1 − u): every leg face was wound inward, rendered
    // see-through from outside and lit from inside)
    const t = u * nr, i = Math.floor(t) % nr, f = t - Math.floor(t)
    const A = R[i], B = R[(i + 1) % nr]
    return [lerp(A[0], B[0], f), lerp(A[1], B[1], f)]
  }
  const geo = kit.buildSurface({
    surface: (u, v, o) => {
      let y = LEG.point + v * (yTop - LEG.point) // the blade from the point's foot up; the point (cap) below
      let [rho, l] = at(u, y)
      for (let k = 0; k < 3; k++) {
        const yb = bowlY(Math.hypot(rho, l)) + LEG.seat
        if (y <= yb) break
        y = yb; [rho, l] = at(u, y)
      }
      P(rho, l, y, o.pos)
    },
    segments: [nr * 2, nv],
    normals: 'surface',
  })
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, material)
  m.name = 'leg'; m.userData.part = 'legs'; m.castShadow = m.receiveShadow = true
  g.add(m)
  // the point: a short pyramid fanned from the blade's own bottom ring (y = LEG.point) down to the ground, set toward
  // the arris; ring order is CCW round +Y, so (c, R[k+1], R[k]) faces out and down
  const yp = LEG.point, s0 = legSection(yp), R0 = ring(s0)
  const tip = new THREE.BufferGeometry()
  const c = P((2 * s0.apex + s0.back) / 3 + 0.4, 0, 0, new THREE.Vector3())
  const tv = []
  const pv = (k) => P(R0[k % nr][0], R0[k % nr][1], yp, new THREE.Vector3())
  for (let k = 0; k < nr; k++) tv.push(c, pv(k + 1), pv(k))
  tip.setAttribute('position', new THREE.Float32BufferAttribute(tv.flatMap((v) => [v.x, v.y, v.z]), 3))
  tip.computeVertexNormals()
  const tm = new THREE.Mesh(tip, material)
  tm.userData.part = 'legs'
  g.add(tm)
  return g
}

// ----------------------------------------------------------------------------------------------------- POSTS
// Two IDENTICAL posts on the rim at the spout root (jue-fix: one geometry placed twice, each turned to its azimuth):
// a round stem, a domed mushroom cap that overhangs it with an undercut and a thin rolled edge, a flat-topped button
// finial, a whorl on the dome. Measured on photo-02 (posts crop, both caps, through the side camera): cap Ø ≈ 22.6
// (far 22.0 / near 23.4 mm: the model's 24.8 read 6–10 % too big on both), dome ≈ 0.27 Ø from the edge's underside to
// the finial's foot, finial Ø ≈ 0.27 Ø and ≈ 0.15 Ø tall. Stem Ø 10 (the far stem reads ≈ 11.8 against the wall, the
// near one ≈ 7.5 against the spout's inside of the same colour: the mean, as the type and the owner say they match).
export const POST = {
  rho: 40.5, stemR: 5.0, base: 159, capY: 195.8,
  // [r, y] from the axis under the cap (inside the stem) out along the undercut, round the edge, up the dome, the finial
  cap: [[0, -2.0], [4.6, -2.0], [5.4, -1.85], [6.8, -1.2], [8.6, -0.75], [10.1, -0.6], [10.9, -0.75], [11.3, -0.25], [11.3, 0.55],
    [10.9, 1.35], [10.0, 2.1], [8.6, 3.05], [7.0, 3.95], [5.4, 4.75], [3.9, 5.25], [3.1, 5.4], [3.0, 5.9], [3.0, 8.3], [2.75, 8.65], [2.2, 8.8], [0.03, 8.8]],
}
export function postTop() { return POST.capY + 8.8 }

// ----------------------------------------------------------------------------------------------------- HANDLE
// The loop handle at θ 90: a flat strap ≈ 11 mm wide and 4.6 thick leaves the upper band at y ≈ 146, runs out
// and round in a C to the band's foot at y ≈ 110; an animal head sits on its top outer corner: a flat brow plate
// with two stubby horns, round eyes, a snout turned down onto the strap (photo-02 crop "handle").
// fix pass r8: a bowed D loop (no straight arms, no square corners), reaching ρ ≈ 52.4 at mid height (the strap's
// outer face at ≈ 54.9: the landmark overlay put the old loop ≈ 5 mm too far out)
export const HANDLE_PATH = (() => {
  const c = [32.8, 121.6], rx = 19.6, ry = 19.4, ex = 2.5, out = []
  for (let i = 0; i <= 40; i++) {
    const a = Math.PI / 2 - (i / 40) * Math.PI
    const ca = Math.cos(a), sa = Math.sin(a)
    out.push([c[0] + rx * Math.sign(ca) * Math.pow(Math.abs(ca), 2 / ex), c[1] + ry * Math.sign(sa) * Math.pow(Math.abs(sa), 2 / ex)])
  }
  return out
})()

// ----------------------------------------------------------------------------------------------------- LIP
// jue-fix: the spout's thick ROLLED rim (photo-02: a rounded edge ≈ 4 mm across along both spout walls and round the
// end; the rest of the rim is the wall's own flat 3 mm edge, fix pass r8). A tube swept along the wall's top over the
// spout azimuths, centred on the wall's mid-thickness, swelling in from nothing where the spout leaves the side rim
// (θ ±SPOUT_LIP.az) so its ends close to points buried in the lip.
export const SPOUT_LIP = { az: 36, ramp: 14 }
export function buildSpoutLip(kit, { q = 1, material }) {
  const S = RIM.spout, L = SPOUT_LIP
  const o = { pos: new THREE.Vector3(), nrm: new THREE.Vector3() }
  const P = new THREE.Vector3(), d = new THREE.Vector3(), a1 = new THREE.Vector3(), a2 = new THREE.Vector3()
  const t = new THREE.Vector3(), b = new THREE.Vector3()
  const nu = Math.round(260 * Math.sqrt(q)), nv = 12
  // u: θ from −az to +az (CCW round +Y, left → right seen from outside); v round the tube, from out over the top
  const geo = kit.buildSurface({
    surface: (u, v, out) => {
      const az = -L.az + 2 * L.az * u, bu = uOfAz(az)
      bodySurface(bu, 1, o)
      bodyPoint(bu, 1, a1); bodyPoint(bu, 0.995, a2)
      d.copy(a1).sub(a2).normalize() // up the wall
      const w = smooth((L.az - Math.abs(az)) / L.ramp) // 0 at the ends → 1
      const r = S.roll * Math.sqrt(w)
      P.copy(o.pos).addScaledVector(o.nrm, -RIM.lip / 2).addScaledVector(d, -r * 0.35)
      const th = v * Math.PI * 2
      t.copy(o.nrm).multiplyScalar(Math.cos(th) * r * 1.05)
      b.copy(d).multiplyScalar(Math.sin(th) * r)
      out.pos.copy(P).add(t).add(b)
    },
    segments: [nu, nv],
    normals: 'displaced',
  })
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, material)
  m.name = 'spout-lip'; m.userData.part = 'body'; m.castShadow = m.receiveShadow = true
  return m
}

// ----------------------------------------------------------------------------------------------------- TAIL RIBS
// fix pass r8 (photo-02 crop 'tail'): a round raised rib runs along each side of the tail from its tip, down its
// underside and onto the upper wall, reaching the band top at θ ≈ 163 (and 197, mirrored: INFERRED) — the tail's
// strengthening rib and the "diagonal ridge under the tail" of face-upper are the same feature.
export const TAIL_RIB = { az0: 160, az1: 179.4, t0: 0.0, t1: 0.94, w: 1.15, h: 1.25, bend: 1.2 }
export function buildTailRibs(kit, { material, q = 1 }) {
  const R = TAIL_RIB
  const o = { pos: new THREE.Vector3(), nrm: new THREE.Vector3() }
  const P = new THREE.Vector3(), T = new THREE.Vector3(), B = new THREE.Vector3(), P2 = new THREE.Vector3()
  const meshes = []
  for (const side of [1, -1]) {
    const azAt = (s) => { const a = R.az0 + (R.az1 - R.az0) * (1 - Math.pow(1 - s, R.bend)); return side > 0 ? a : 360 - a }
    // the rib hugs the tail's top edge from the tip for half its run, then drops down the wall to the band
    const vAt = (s) => V_SPLIT + 0.004 + (R.t0 + (R.t1 - R.t0) * (1 - Math.pow(1 - s, 2.2))) * (1 - V_SPLIT - 0.004)
    const geo = kit.buildSurface({
      surface: (u, v, out) => {
        const sU = side > 0 ? u : 1 - u
        bodySurface(uOfAz(azAt(sU)), vAt(sU), o)
        P.copy(o.pos)
        bodyPoint(uOfAz(azAt(Math.min(1, sU + 0.01))), vAt(Math.min(1, sU + 0.01)), P2)
        T.copy(P2).sub(bodyPoint(uOfAz(azAt(Math.max(0, sU - 0.01))), vAt(Math.max(0, sU - 0.01)), B)).normalize()
        B.crossVectors(T, o.nrm).normalize()
        const taper = 1 - 0.45 * sU, a = Math.PI * v
        out.pos.copy(P).addScaledVector(B, Math.cos(a) * R.w * taper).addScaledVector(o.nrm, Math.sin(a) * R.h * taper - 0.35)
      },
      segments: [Math.round(140 * Math.sqrt(q)), 10],
      normals: 'displaced',
    })
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, material)
    m.name = 'tail-rib'; m.userData.part = 'body'; m.castShadow = m.receiveShadow = true
    meshes.push(m)
  }
  return meshes
}
