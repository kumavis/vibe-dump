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

export const AZ = { spout: 0, tail: 180, handle: 90, legs: [90, 210, 330], posts: [45, -45], flanges: [0, 180] }

// lower cup, bottom → band top ([r, y]); a round bottom, a straight band, a narrow plain fillet top and bottom
export const CUP = [
  [0, 77.5], [8, 77.9], [15, 79.4], [21, 82.0], [26, 85.6], [29.8, 89.9], [32.4, 94.4], [33.8, 98.4], [34.2, 100.6],
  [34.3, 102.2], [34.4, 121.0], [34.7, 140.0],
]
export const REG = { band: [101, 140], upper: [140.5, 163] } // décor registers, y mm
export const Y_C = 140 // where the swept upper wall starts (top of the band's upper fillet)
export const RIM = {
  r0: 44, y0: 163, // side rim (θ ±60…±120): a gently flared lip
  spout: { half: 16.5, tip: 95, y: 189, depth: 9, wall: 6 },
  tail: { tip: 77, y: 193, baseAz: 34, pow: 1.25 },
  soft: 14, // mm: soft max between circle / spout / tail outlines (rounded inner corners in plan)
  lip: 2.6, // wall thickness at the rim
}

// ---- plan outline of the rim: ρ(θ) as a soft union of circle, spout stadium and tail triangle
function rayStadium(az) {
  const S = RIM.spout
  const s = Math.sin(az * DEG), c = Math.cos(az * DEG)
  if (c <= 0) return 0
  const zc = S.tip - S.half // centre of the tip round
  // ray vs the round end
  const b = zc * c, disc = b * b - (zc * zc - S.half * S.half)
  const tRound = disc >= 0 ? b + Math.sqrt(disc) : 0
  const tSide = Math.abs(s) > 1e-6 ? S.half / Math.abs(s) : Infinity
  return tSide * c <= zc ? tSide : Math.max(tRound, 0)
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
  if (z > 0) y += (S.y - RIM.y0) * Math.pow(clamp((z - 24) / (S.tip - 24), 0, 1), 1.25)
  if (z < 0) y += (T.y - RIM.y0) * Math.pow(clamp((-z - 22) / (T.tip - 22), 0, 1), T.pow)
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
  const F = resample(bez([rc, Y_C], [rc + 0.08 * dx, Y_C + 0.45 * dy], [rc + 0.4 * dx, Y_C + 0.86 * dy], [re, ye], 40), N_UP)
  // spout: a U channel. Every spout meridian runs up out of the band, out along the sloping floor (the chin
  // seen from outside) and then climbs its wall into the rim; side walls fall out of meridians whose rim point
  // lies close in, the rounded end out of those that reach the tip.
  const sp = Math.cos(az * DEG) > 0 ? smooth((re - RIM.r0 + 3) / 14) : 0
  let M = F
  if (sp > 0) {
    const S = RIM.spout
    const fl = (r) => Y_C + 3 + (r - rc) * ((S.y - S.depth - Y_C - 3) / (S.tip - S.wall - rc))
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
export const LEG = { topY: 88, rhoTop: 24, rhoTip: 44, depthTop: 19, depthTip: 3.6, chordTop: 25, chordTip: 4.6, bow: 2.0, embed: 7 }
export function legSection(y) {
  const t = clamp(y / LEG.topY, 0, 1.2)
  const a = lerp(LEG.rhoTip, LEG.rhoTop, t) + LEG.bow * Math.sin(Math.PI * clamp(t, 0, 1))
  const d = lerp(LEG.depthTip, LEG.depthTop, Math.pow(Math.min(1, t), 0.7))
  const c = lerp(LEG.chordTip, LEG.chordTop, Math.pow(Math.min(1, t), 0.75))
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
    const pts = []
    const rr = 0.18
    for (let i = 0; i < 3; i++) {
      const A = C[i], B = C[(i + 1) % 3]
      for (let k = 0; k < 4; k++) {
        const f = rr * 0.5 + (k / 4) * (1 - rr)
        pts.push([lerp(A[0], B[0], f), lerp(A[1], B[1], f)])
      }
    }
    return pts
  }
  const nr = 12
  const geo = kit.buildSurface({
    surface: (u, v, o) => {
      const y = v * yTop
      const s = legSection(y)
      const R = ring(s)
      const t = (1 - u) * nr, i = Math.floor(t) % nr, f = t - Math.floor(t)
      const A = R[i], B = R[(i + 1) % nr]
      P(lerp(A[0], B[0], f), lerp(A[1], B[1], f), y, o.pos)
    },
    segments: [nr * 2, nv],
    normals: 'surface',
  })
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, material)
  m.name = 'leg'; m.userData.part = 'legs'; m.castShadow = m.receiveShadow = true
  g.add(m)
  // tip cap
  const s0 = legSection(0)
  const tip = new THREE.BufferGeometry()
  const c = P((s0.apex + 2 * s0.back) / 3, 0, -0.6, new THREE.Vector3())
  const a1 = P(s0.apex, 0, 0, new THREE.Vector3()), a2 = P(s0.back, s0.half, 0, new THREE.Vector3()), a3 = P(s0.back, -s0.half, 0, new THREE.Vector3())
  tip.setAttribute('position', new THREE.Float32BufferAttribute([c, a1, a2, c, a2, a3, c, a3, a1].flatMap((v) => [v.x, v.y, v.z]), 3))
  tip.computeVertexNormals()
  const tm = new THREE.Mesh(tip, material)
  tm.userData.part = 'legs'
  g.add(tm)
  return g
}

// ----------------------------------------------------------------------------------------------------- POSTS
// Two posts on the rim at the spout root: round stems Ø 9 standing 33 mm, umbrella caps Ø 23 with a little knob
// (photo-02: the near post's cap is a plain cone, the far one shows a whorl on its top — modelled alike, the whorl
// on both).
export const POST = {
  rho: 40.5, stemR: 4.4, base: 159, capY: 194,
  cap: [[0, -0.4], [4.0, -0.4], [6.5, 0.1], [10.2, 0.6], [11.6, 1.0], [11.8, 1.8], [11.0, 2.6], [9.0, 4.2], [6.8, 5.8], [4.4, 7.0], [3.2, 7.4], [3.1, 9.8], [2.5, 10.6], [0, 10.8]],
}
export function postTop() { return POST.capY + 10.4 }

// ----------------------------------------------------------------------------------------------------- HANDLE
// The loop handle at θ 90: a flat strap ≈ 11 mm wide and 4.6 thick leaves the upper band at y ≈ 146, runs out
// and round in a C to the band's foot at y ≈ 110; an animal head sits on its top outer corner: a flat brow plate
// with two stubby horns, round eyes, a snout turned down onto the strap (photo-02 crop "handle").
export const HANDLE_PATH = [
  [32.8, 140.7], [41.0, 141.1], [46.5, 140.5], [53.1, 137.9], [57.1, 132.9], [59.1, 125.9], [59.5, 118.3], [58.5, 111.5],
  [55.5, 106.3], [49.9, 103.1], [45.0, 101.9], [38.0, 101.9], [32.6, 102.5],
]
