// airship — the form: hull profile, the faceted hull surface (one patch per register and side),
// the meridian paths the flanges ride, and the fin outline. Units mm, Y up, front +Z, the nose
// toward +X, the hull axis horizontal at y = YC.
//
// Hull: a body of revolution laid on its side, 420 mm long, 64 mm across (6.6 : 1) — an ellipse
// for the blunt nose, fullest a third of the way back, then a long convex taper to a fine tail.
// The rigid frame shows as 28 soft longitudinal ridges (a 28-sided section whose bays sag a
// little between girders) — the cue that says "zeppelin", not "balloon".
//
// Patches. The hull is cast in two halves meeting on the top and bottom keels (where the keel
// flanges stand), each half cut into registers along the axis (ring bands, like a gu laid on its
// side). For every half patch u runs keel → keel round the side and v runs aft → fore, so the
// shared relief panel has x = round the hull (the side flange at x = W/2 is the mask's nose
// line) and y = toward the nose (the mask's "up"). The nose cap is one patch round the pole
// with a polar panel seen head-on from +X.

export const HULL = { L: 420, R: 32, nose: 210, tail: -210, girders: 28, facet: 0.011 }
export const YC = 150 // hull axis height above the plinth
const T_MAX = 0.33 // fullest section, fraction of the length from the nose

/** radius fraction at t (0 nose → 1 tail) */
function prof(t) {
  t = Math.min(1, Math.max(0, t))
  let f
  if (t <= T_MAX) {
    const a = 1 - t / T_MAX
    f = Math.sqrt(Math.max(0, 1 - a * a))
  } else {
    const s = (t - T_MAX) / (1 - T_MAX)
    f = 1 - 0.93 * Math.pow(s, 1.9)
  }
  // the tail closes in a small round end over its last 4 mm
  const e = (1 - t) / 0.01
  if (e < 1) f *= Math.sqrt(Math.max(0, e))
  return f
}

/** hull radius (smooth, unfaceted) at x */
export const rAt = (x) => HULL.R * prof((HULL.nose - x) / HULL.L)

// ---- meridian arc table: s = arc length from the nose pole
const STEP = 0.1
const NS = Math.round(HULL.L / STEP)
const ARC = new Float64Array(NS + 1)
{
  let px = HULL.nose, pr = 0
  for (let i = 1; i <= NS; i++) {
    const x = HULL.nose - i * STEP, r = rAt(x)
    ARC[i] = ARC[i - 1] + Math.hypot(x - px, r - pr)
    px = x; pr = r
  }
}
export const ARC_TOTAL = ARC[NS]
/** arc from the nose at x */
export function arcAt(x) {
  const f = (HULL.nose - x) / STEP
  const i = Math.max(0, Math.min(NS - 1, Math.floor(f))), g = Math.max(0, Math.min(1, f - i))
  return ARC[i] + (ARC[i + 1] - ARC[i]) * g
}
/** x at arc s (binary search) */
export function xAtArc(s) {
  if (s <= 0) return HULL.nose
  if (s >= ARC_TOTAL) return HULL.tail
  let lo = 0, hi = NS
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (ARC[m] < s) lo = m
    else hi = m
  }
  const g = (s - ARC[lo]) / Math.max(1e-12, ARC[hi] - ARC[lo])
  return HULL.nose - (lo + g) * STEP
}

/** faceted radius at x, angle psi from the top keel (rad) */
export function rFacet(x, psi) {
  const k = Math.sin((HULL.girders / 2) * psi)
  return rAt(x) * (1 - HULL.facet * k * k)
}

/** a hull point: x, psi from the top keel, side +1 (+Z) / −1 (−Z) */
export function hullPoint(x, psi, side, o = [0, 0, 0]) {
  const r = rFacet(x, psi)
  o[0] = x
  o[1] = YC + r * Math.cos(psi)
  o[2] = side * r * Math.sin(psi)
  return o
}

const _a = [0, 0, 0], _b = [0, 0, 0], _c = [0, 0, 0], _d = [0, 0, 0]
/** outward unit normal at (arc s, psi, side), by central differences (exact axis at the poles) */
export function hullNormal(s, psi, side, o = [0, 0, 0]) {
  const ds = 0.05, dp = 2e-3
  const s0 = Math.max(0, s - ds), s1 = Math.min(ARC_TOTAL, s + ds)
  hullPoint(xAtArc(s0), psi, side, _a); hullPoint(xAtArc(s1), psi, side, _b)
  hullPoint(xAtArc(s), psi - dp, side, _c); hullPoint(xAtArc(s), psi + dp, side, _d)
  const ex = _b[0] - _a[0], ey = _b[1] - _a[1], ez = _b[2] - _a[2] // toward the tail
  const fx = _d[0] - _c[0], fy = _d[1] - _c[1], fz = _d[2] - _c[2] // round
  let nx = ey * fz - ez * fy, ny = ez * fx - ex * fz, nz = ex * fy - ey * fx
  let l = Math.hypot(nx, ny, nz)
  if (l < 1e-9) { // a pole
    o[0] = s < ARC_TOTAL / 2 ? 1 : -1; o[1] = 0; o[2] = 0
    return o
  }
  // outward: away from the axis, or along ±X near the poles
  const ry = Math.cos(psi), rz = side * Math.sin(psi)
  const x = xAtArc(s)
  const out = ny * ry + nz * rz + nx * (x > 0 ? 0.3 : -0.3)
  if (out < 0) { nx = -nx; ny = -ny; nz = -nz }
  o[0] = nx / l; o[1] = ny / l; o[2] = nz / l
  return o
}

// ------------------------------------------------------------------ registers

/** x ranges along the hull, nose → tail. Each is a ring band; 'nose' is the polar cap. */
export const REG = {
  nose: [190, 210], //    the forward-looking face round the mooring cone
  bow: [160, 190], //     rising cicada blades pointing to the nose
  fore: [128, 160], //    kui confronting the side flanges
  mask: [62, 128], //     the main taotie, its nose ridge the side flange
  aft: [30, 62], //       cloud scrolls; the cradle sits on its aft bowstrings
  blades: [-100, 30], //  hanging cicada blades on the long taper
  tail: [-210, -100], //  thunder ground between the fins, bowstrings, the tail knob
}

/** panel sizes (mm) for every hull register: W = half circumference at its widest, H = arc length */
export function hullLayout() {
  const out = {}
  for (const [name, [xa, xb]] of Object.entries(REG)) {
    const s0 = arcAt(xb), s1 = arcAt(xa)
    let rMax = 0
    for (let x = xa; x <= xb; x += 0.5) rMax = Math.max(rMax, rAt(x))
    if (name === 'nose') {
      const rho = s1 // polar disc radius = arc from the pole
      out[name] = { name, xa, xb, s0, s1, w: 2 * rho + 2, h: 2 * rho + 2, rho }
    } else {
      out[name] = {
        name, xa, xb, s0, s1, rMax,
        w: Math.PI * rMax, h: s1 - s0,
        /** panel x of an angle psi (rad from the top keel) on the +Z side */
        xOfPsi: (psi) => (psi / Math.PI) * Math.PI * rMax,
        /** fraction of the panel width the true circumference fills at panel y (0..1) */
        scaleAt: (y) => rAt(xAtArc(s1 - y)) / rMax,
      }
    }
  }
  return out
}

/**
 * surface function for one half of a ring register: u keel → keel round the side, v aft → fore.
 * side +1: u = 0 on the top keel, down the +Z side; side −1: u = 0 on the bottom keel, up the −Z side.
 */
export function halfSurface(lay, side) {
  const { s0, s1 } = lay
  const n = [0, 0, 0], p = [0, 0, 0]
  return (u, v, out) => {
    const s = s1 - (s1 - s0) * v
    const psi = side > 0 ? Math.PI * u : Math.PI * (1 - u)
    hullPoint(xAtArc(s), psi, side, p)
    hullNormal(s, psi, side, n)
    out.pos.set(p[0], p[1], p[2])
    out.nrm.set(n[0], n[1], n[2])
  }
}

/** the nose cap: u = azimuth alpha (0 top, toward +Z first), v rim → pole */
export function noseSurface(lay) {
  const n = [0, 0, 0], p = [0, 0, 0]
  return (u, v, out) => {
    const s = lay.s1 * (1 - v)
    const a = 2 * Math.PI * u
    const side = a <= Math.PI ? 1 : -1
    const psi = a <= Math.PI ? a : 2 * Math.PI - a
    hullPoint(xAtArc(s), psi, side, p)
    hullNormal(s, psi, side, n)
    out.pos.set(p[0], p[1], p[2])
    out.nrm.set(n[0], n[1], n[2])
  }
}

/** the nose cap's polar panel map: seen head-on from +X, panel x = viewer's right (−Z), y = up */
export function nosePanelMap(lay) {
  return (u, v, pm) => {
    const rho = lay.s1 * (1 - v)
    const a = 2 * Math.PI * u
    pm[0] = 0.5 - (rho * Math.sin(a)) / lay.w
    pm[1] = 0.5 + (rho * Math.cos(a)) / lay.h
    pm[2] = 1
  }
}

// ------------------------------------------------------------------ meridian paths (flanges)

/**
 * A kit.flange path along the hull meridian at angle psi (side ±1) from x0 (aft) to x1 (fore):
 * { isPath, length, frame(σ) → { p, n, d, b } } with THREE vectors.
 */
export function meridianPath(THREE, psi, side, x0, x1, step = 1) {
  const s0 = arcAt(x1), s1 = arcAt(x0)
  const pts = [], nrm = []
  const p = [0, 0, 0], n = [0, 0, 0]
  const N = Math.max(2, Math.ceil((s1 - s0) / step))
  for (let i = 0; i <= N; i++) {
    const s = s1 - ((s1 - s0) * i) / N // aft → fore
    hullPoint(xAtArc(s), psi, side, p)
    hullNormal(s, psi, side, n)
    pts.push(new THREE.Vector3(p[0], p[1], p[2]))
    nrm.push(new THREE.Vector3(n[0], n[1], n[2]))
  }
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true, length: L,
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

// ------------------------------------------------------------------ fins

/** fin stations (x) */
export const FIN = { lead: -98, hinge: -183, back: -209, outer: 50, rudderOuter: 47.5, embed: 3.2, thick: 4.2 }

/**
 * One fin's outline in its own plate frame: x = hull x, y = distance from the hull axis. The root
 * follows the hull (sunk FIN.embed into it); the leading edge sweeps back to a hooked beak; the outer
 * edge is notched like a fangyi flange; the rudder behind the hinge ends in a hook curling aft.
 */
export function finOutline() {
  const e = FIN.embed
  const pts = []
  // root, aft → fore (the plate interior is above it)
  for (let x = FIN.back + 2; x <= FIN.lead; x += 2) pts.push([x, Math.max(0.8, rAt(x) - e)])
  // leading edge: up and back, a gentle concave sweep
  const L0 = [FIN.lead, rAt(FIN.lead) - e]
  const L1 = [-133.5, FIN.outer - 6.5]
  for (let i = 1; i <= 10; i++) {
    const t = i / 10
    const sag = Math.sin(Math.PI * t) * 3.0
    pts.push([L0[0] + (L1[0] - L0[0]) * t - sag * 0.6, L0[1] + (L1[1] - L0[1]) * t + sag * 0.5])
  }
  // the beak at the leading outer corner: forward over the leading edge, its tip turned down, back over the top
  const o = FIN.outer
  pts.push([-131.0, o - 4.4], [-128.2, o - 2.6], [-127.4, o - 4.6], [-125.6, o - 3.2], [-125.8, o + 0.2], [-128.0, o + 2.6], [-131.6, o + 3.6], [-135.6, o + 2.9], [-139.2, o + 0.6])
  // the notched outer edge, fore → aft, to the hinge
  const notchP = 9.5, notchW = 2.6, notchD = 2.6
  let x = -143.5
  pts.push([-141.5, o])
  while (x - notchP > FIN.hinge + 4) {
    const xn = x - notchP
    pts.push([xn + notchW, FIN.outer], [xn + notchW, FIN.outer - notchD], [xn, FIN.outer - notchD], [xn, FIN.outer])
    x = xn
  }
  pts.push([FIN.hinge + 0.6, FIN.outer])
  // step down to the rudder's outer edge (the rudder is a separate leaf behind the hinge)
  pts.push([FIN.hinge - 0.6, FIN.rudderOuter])
  // rudder outer edge aft, its trailing corner hooking back and down
  pts.push([FIN.back + 6, FIN.rudderOuter], [FIN.back + 1.5, FIN.rudderOuter + 2.2], [FIN.back - 3.2, FIN.rudderOuter + 1.2], [FIN.back - 4.4, FIN.rudderOuter - 2.6], [FIN.back - 2.2, FIN.rudderOuter - 2.0], [FIN.back - 0.6, FIN.rudderOuter - 4.5])
  // trailing edge down to the root
  for (let y = FIN.rudderOuter - 7; y > 6; y -= 5) pts.push([FIN.back + (FIN.rudderOuter - y) * 0.04, y])
  pts.push([FIN.back + 0.6, 2.0])
  return pts
}

/** the hinge: three slots between the fin and its rudder (true openwork), bridges between them */
export function finHoles() {
  const x = FIN.hinge, w = 1.5
  const y0 = rAt(x) + 2.6, y1 = FIN.rudderOuter - 3.2
  const n = 3, gap = 3.2
  const len = (y1 - y0 - gap * (n - 1)) / n
  const holes = []
  for (let i = 0; i < n; i++) {
    const a = y0 + i * (len + gap), b = a + len
    const hole = []
    for (let k = 0; k <= 6; k++) { const t = Math.PI + (Math.PI * k) / 6; hole.push([x + (w / 2) * Math.cos(t), a + (w / 2) * Math.sin(t) + w / 2]) }
    for (let k = 0; k <= 6; k++) { const t = (Math.PI * k) / 6; hole.push([x + (w / 2) * Math.cos(t), b + (w / 2) * Math.sin(t) - w / 2]) }
    holes.push(hole)
  }
  return holes
}

/** the panel rectangle laid over the fin (plate mm) */
export const FIN_RECT = { x: -216, y: 0, w: 124, h: 58 }

// ------------------------------------------------------------------ hung parts: stations

export const GONDOLA = { x0: 106, x1: 160, w: 15.5, h: 12 } // control car under the bow
export const ENGINES = [{ x: 4, psi: (135 * Math.PI) / 180 }, { x: -58, psi: (135 * Math.PI) / 180 }]
export const CRADLE = { x: 30, half: 0.85 } // the stand's cradle at x, ±half rad round the bottom keel
