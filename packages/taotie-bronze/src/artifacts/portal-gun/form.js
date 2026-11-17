// portal-gun — the form: every station, profile and surface function of the device and its stand.
// Units mm, Y up, front +Z, the muzzle toward +X: the front view (from +Z) is the full side profile.
// Gun-local frame: x along the barrel axis, y up from the axis, z out of the +Z flank; the gun group
// is lifted to y = AXIS above the plinth.
//
//   emitter  x 106 … 190  a gu's trumpet mouth: outer flare r 29 → 70, round lip, and INSIDE a stepped
//                          funnel — six flat treads (the concentric rings of the portal) down to a domed
//                          throat that carries the fire whorl
//   barrel   x  28 … 112  r 24: a kui register, then three notched ring fins (the cooling fins)
//   body     x −100 … 46  a superellipse section (half width 28, half height 42) that merges into the
//                          barrel at the front and tapers into the power-cell socket at the back; two half
//                          shells meeting on the top and bottom centre lines, the core eye on each flank
//   cell     x −186 … −100 a power cell plugged into a socket collar, axis 6 mm above the barrel's
//   grip     under the body at x ≈ −45, raked back; the tail runs forward under into the trigger guard

export const AXIS = 175 // barrel axis above the plinth

// ------------------------------------------------------------------ the emitter (a revolve about the x axis)

export const BELL = { x0: 106, x1: 189, r0: 29, r1: 70, pow: 1.7, lip: 3.2 }
/** outer flare radius at x */
export const bellR = (x) => {
  const t = Math.min(1, Math.max(0, (x - BELL.x0) / (BELL.x1 - BELL.x0)))
  return BELL.r0 + (BELL.r1 - BELL.r0) * Math.pow(t, BELL.pow)
}

/** the inner stepped funnel: [x, r] points from the lip's inner edge to the axis (each tread a flat annulus facing +X) */
export const TREADS = [ // [x, rOuter, rInner]
  [183, 58, 52], [176, 52, 45], [168, 45, 38], [160, 38, 31], [152, 31, 24], [145, 24, 16],
]
export const DOME = { x: 145, r: 16, top: 151.5 } // the throat boss: rises from the last tread to x = top on the axis

/**
 * The emitter profile as patches, each a polyline [[x, r]…] traversed so that the revolve's normal points out of the
 * metal (outer: back → front; inner: front → back, stepping in). kind: 'outer' | 'lip' | 'cone' | 'tread' | 'riser' | 'dome'.
 */
export function bellPatches() {
  const out = []
  // outer flare, from the root bead to the lip
  const outer = []
  for (let i = 0; i <= 60; i++) { const x = BELL.x0 + ((BELL.x1 - BELL.x0) * i) / 60; outer.push([x, bellR(x)]) }
  out.push({ kind: 'outer', pts: outer })
  // the root bead where the flare leaves the barrel (closes the gap between the flare and the barrel)
  out.push({ kind: 'root', pts: [[99, 23.6], [100.2, 27.4], [102.2, 30.4], [105, 31.6], [107.8, 31.2], [110, 29.9], [111.5, 29.0]] })
  // the lip: a rolled half round over the rim, from the outer flare forward over the rim to the inner side
  const lip = []
  const rOut = BELL.r1, rIn = BELL.r1 - BELL.lip
  const xc = BELL.x1, rc = (rOut + rIn) / 2, R = (rOut - rIn) / 2
  for (let i = 0; i <= 12; i++) {
    const a = (Math.PI * i) / 12 // 0: outer side (r = rOut) → π: inner side (r = rIn), via the front (x = xc + R)
    lip.push([xc + R * Math.sin(a) * 1.25, rc + R * Math.cos(a)])
  }
  out.push({ kind: 'lip', pts: lip })
  // the inner cone from the lip down to the first tread
  const t0 = TREADS[0]
  const cone = []
  for (let i = 0; i <= 8; i++) { const f = i / 8; cone.push([xc + (t0[0] - xc) * f, rIn + (t0[1] - rIn) * f]) }
  out.push({ kind: 'cone', pts: cone })
  for (let k = 0; k < TREADS.length; k++) {
    const [x, ro, ri] = TREADS[k]
    out.push({ kind: 'tread', pts: [[x, ro], [x, ri]], index: k })
    if (k < TREADS.length - 1) out.push({ kind: 'riser', pts: [[x, ri], [TREADS[k + 1][0], ri]], index: k })
  }
  // the dome: from the last tread's inner edge up to the axis
  const dome = []
  for (let i = 0; i <= 10; i++) {
    const a = (Math.PI / 2) * (i / 10)
    dome.push([DOME.x + (DOME.top - DOME.x) * Math.sin(a), DOME.r * Math.cos(a)])
  }
  out.push({ kind: 'dome', pts: dome })
  return out
}

/** resample a polyline by arc length: { at(f) → [x, r, dx, dr], length } */
export function polyTable(pts) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1]
  return {
    length: L,
    at(f) {
      const s = Math.min(1, Math.max(0, f)) * L
      let i = 1
      while (i < pts.length - 1 && cum[i] < s) i++
      const g = Math.max(0, Math.min(1, (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])))
      const a = pts[i - 1], b = pts[i]
      return [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g, b[0] - a[0], b[1] - a[1]]
    },
  }
}

/**
 * A surface of revolution about the gun axis (shifted by yc) for buildSurface: u round (θ = 2πu, 0 = top, then
 * toward +Z — so u runs left → right seen from outside), v along the polyline. Normals are left to the grid.
 */
export function revolveX(pts, { yc = 0 } = {}) {
  const T = polyTable(pts)
  return (u, v, out) => {
    const [x, r] = T.at(v)
    const th = 2 * Math.PI * u
    out.pos.set(x, yc + r * Math.cos(th), r * Math.sin(th))
  }
}

/** polar panel map for a patch seen head-on from +X: panel x = viewer's right (−Z), y = up; D = panel size (mm) */
export function polarMap(pts, D) {
  const T = polyTable(pts)
  return (u, v, pm) => {
    const [, r] = T.at(v)
    const th = 2 * Math.PI * u
    pm[0] = 0.5 - (r * Math.sin(th)) / D
    pm[1] = 0.5 + (r * Math.cos(th)) / D
    pm[2] = 1
  }
}

/** a meridian of the outer flare at angle th (rad, 0 = top, + toward +Z) as a kit.flange path, back → front */
export function bellMeridian(THREE, th, x0, x1, step = 1) {
  const pts = [], nrm = []
  const N = Math.max(2, Math.ceil((x1 - x0) / step))
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N
    const r = bellR(x), h = 0.05
    const dr = (bellR(x + h) - bellR(x - h)) / (2 * h)
    const c = Math.cos(th), s = Math.sin(th)
    pts.push(new THREE.Vector3(x, r * c, r * s))
    nrm.push(new THREE.Vector3(-dr, c, s).normalize())
  }
  return pathOf(THREE, pts, nrm)
}

/** a kit.flange path through 3D points with outward directions */
export function pathOf(THREE, pts, nrm) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true,
    length: L,
    frame(sig) {
      let i = 1
      while (i < pts.length - 1 && cum[i] < sig) i++
      const f = Math.max(0, Math.min(1, (sig - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])))
      tmp.p.lerpVectors(pts[i - 1], pts[i], f)
      tmp.d.subVectors(pts[i], pts[i - 1]).normalize()
      const o = nrm[i - 1].clone().lerp(nrm[i], f)
      tmp.n.copy(o).addScaledVector(tmp.d, -o.dot(tmp.d)).normalize()
      tmp.b.crossVectors(tmp.d, tmp.n)
      return tmp
    },
  }
}

// ------------------------------------------------------------------ the barrel

export const BARREL = { x0: 28, x1: 112, r: 24, reg: [36, 74], fins: [82, 93, 104], finR: 37, finHole: 22.5, finT: 4.6 }

// ------------------------------------------------------------------ the body: a superellipse loft

export const BODY = { x0: -100, x1: 46, a: 28, b: 42, yc: 2, n: 3, main: [-62, 30], front: { a: 23.4, b: 23.4, yc: 0 }, rear: { a: 21, b: 21, yc: 6 } }

const smooth = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t) }

/** section parameters at x: { a, b, yc, n } */
export function bodySection(x) {
  const B = BODY
  let f = 0, end = null
  if (x > B.main[1]) { f = smooth((x - B.main[1]) / (B.x1 - B.main[1])); end = B.front }
  else if (x < B.main[0]) { f = smooth((B.main[0] - x) / (B.main[0] - B.x0)); end = B.rear }
  if (!end) return { a: B.a, b: B.b, yc: B.yc, n: B.n }
  // the rear keeps its height a little longer than its width (the horn's curl has room), then rounds into the socket
  const fb = end === B.rear ? Math.pow(f, 1.35) : f
  return { a: B.a + (end.a - B.a) * f, b: B.b + (end.b - B.b) * fb, yc: B.yc + (end.yc - B.yc) * f, n: B.n + (2 - B.n) * f }
}

/** point on the section at angle phi (0 bottom centre → π top centre), side +1 (+Z) / −1 */
export function sectionPoint(S, phi, side, o = [0, 0]) {
  const c = Math.cos(phi), s = Math.sin(phi), e = 2 / S.n
  o[0] = S.yc - S.b * Math.sign(c) * Math.pow(Math.abs(c), e)
  o[1] = side * S.a * Math.pow(Math.abs(s), e)
  return o
}

const ARCN = 160
/** arc table of a half section: phi at a fraction of the arc length (bottom → top) */
function sectionTable(S) {
  const cum = new Float64Array(ARCN + 1)
  const p = [0, 0], q = [0, 0]
  sectionPoint(S, 0, 1, p)
  for (let i = 1; i <= ARCN; i++) {
    sectionPoint(S, (Math.PI * i) / ARCN, 1, q)
    cum[i] = cum[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])
    p[0] = q[0]; p[1] = q[1]
  }
  return {
    length: cum[ARCN],
    phiAt(f) {
      const s = Math.min(1, Math.max(0, f)) * cum[ARCN]
      let lo = 0, hi = ARCN
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m }
      const g = (s - cum[lo]) / Math.max(1e-12, cum[hi] - cum[lo])
      return (Math.PI * (lo + g)) / ARCN
    },
  }
}

/** the half perimeter of the main section (mm): the flank panel's height */
export const BODY_H = sectionTable(bodySection(0)).length
export const BODY_W = BODY.x1 - BODY.x0

/**
 * one half shell of the body for buildSurface. side +1: u back → front (x0 → x1), v bottom → top centre line;
 * side −1: u front → back (so dP/du × dP/dv still points out). v is the arc fraction round the half section, so
 * on the main section the panel is laid 1:1 in mm.
 */
export function bodyHalf(side) {
  let lastX = NaN, S = null, tab = null
  const p = [0, 0]
  return (u, v, out) => {
    const x = side > 0 ? BODY.x0 + BODY_W * u : BODY.x1 - BODY_W * u
    if (x !== lastX) { S = bodySection(x); tab = sectionTable(S); lastX = x }
    const phi = tab.phiAt(v)
    sectionPoint(S, phi, side, p)
    out.pos.set(x, p[0], p[1])
  }
}
/** the −Z shell reads the same panel mirrored: panel x always runs back → front */
export const bodyPanelMap = (side) => (u, v, pm) => { pm[0] = side > 0 ? u : 1 - u; pm[1] = v; pm[2] = 1 }

/** the body's outer surface point (gun-local) at x on the +Z flank at height y (for placing parts) */
export function flankZ(x, y) {
  const S = bodySection(x)
  const t = Math.min(1, Math.abs(y - S.yc) / S.b)
  return S.a * Math.pow(Math.max(0, 1 - Math.pow(t, S.n)), 1 / S.n)
}
/** top and bottom of the body at x */
export const bodyTop = (x) => { const S = bodySection(x); return S.yc + S.b }
export const bodyBottom = (x) => { const S = bodySection(x); return S.yc - S.b }

// ------------------------------------------------------------------ features on the body

export const EYE = { x: -8, y: 3, w: 30, h: 19.5, rise: 6.5, bore: 16.6, lens: 18.5, lensC: -6.2 } // the core: an almond socket on each flank
export const DIAL = { x: -62, y: -13, r: 12.5 } // the selector dial on the +Z flank (the mask's ear)
export const SPINE = { x0: -74, x1: 26, h: 9.5 } // the top flange

// ------------------------------------------------------------------ the power cell

export const CELL = { yc: 6, r: 17, x0: -186, x1: -100, band: [-166, -108], window: { x0: -158, x1: -116, half: 0.34 } }
export function cellProfile() {
  return [
    [-186.5, 0], [-186.2, 3.5], [-185, 7.5], [-182.6, 11.6], [-179.2, 14.8], [-175.6, 16.6], [-173.5, 17.6], [-171, 17.6], [-170, 16.6], [-168, 17],
    [-104, 17], [-102, 16.2], [-99, 16],
  ]
}
export const SOCKET = { x0: -108, x1: -94, r: 23.5 }

// ------------------------------------------------------------------ the grip, the trigger, the guard

/** the grip's centre line (gun-local, z = 0), bottom (the creature's haunch) → top (its neck under the head) */
export const GRIP_LINE = [[-60, -122], [-55.5, -100], [-50.5, -78], [-46, -60], [-42.5, -46]]
export const GRIP = { depth: 15.5, width: 13.2, neck: 0.86 } // section half-axes (mm): fore-aft, across
export const HEAD = { at: [-29, -52, 0], fwd: [0.46, 0.89, 0], up: [-0.89, 0.46, 0], width: 29 }
export const TONGUE = [[-17, -40.5, 0, 3.4], [-13.5, -48, 0, 3.4], [-9.5, -57, 0, 3.1], [-9.8, -65.5, 0, 2.8], [-13.5, -70.5, 0, 2.5], [-17.6, -70, 0, 2.3]]
export const TAIL = [
  [-60, -125, 0, 6.2], [-52, -134, 0, 5.4], [-36, -138, 0, 5.0], [-16, -134, 0, 4.6], [0, -123, 0, 4.3], [9, -106, 0, 4.0],
  [11, -90, 0, 3.7], [7, -79, 0, 3.4], [0, -76, 0, 3.1], [-4.5, -81, 0, 2.8], [-2.5, -87, 0, 2.6], [1.5, -86.5, 0, 2.4],
]

// ------------------------------------------------------------------ the stand

export const STAND = {
  base: { w: 300, d: 112, t: 16, r: 24, x: -28 },
  front: { x: 134, part: 'bell', yc: 0 },
  rear: { x: -146, part: 'cell', r: CELL.r, yc: CELL.yc },
}
