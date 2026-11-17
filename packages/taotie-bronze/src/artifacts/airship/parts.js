// airship — L3 sculpture: the control car, the four engine cars, the mooring cone and tail knob,
// the keel and side flanges, and the stand (foot + mast, a dragon coiling up it, a cradle whose two
// ends are beast heads). Hung parts are signed-distance solids meshed by kit.meshSDF (smooth unions,
// like clay): the cars are small boat-shaped vessels with a beast head at the prow, the struts are
// snake bodies, the propellers whorl bosses with four blades. All mm, nose +X, front +Z.

import * as THREE from 'three'
import { HULL, YC, rAt, xAtArc, arcAt, meridianPath, GONDOLA, ENGINES, CRADLE, REG } from './form.js'

// ------------------------------------------------------------------ SDF primitives

const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
function sdRoundBox(px, py, pz, bx, by, bz, r) {
  const qx = Math.abs(px) - bx + r, qy = Math.abs(py) - by + r, qz = Math.abs(pz) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
/** capsule a → b with radii ra → rb (linear taper; fine for gentle tapers) */
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const l2 = bx * bx + by * by + bz * bz
  const t = Math.max(0, Math.min(1, ((px - a[0]) * bx + (py - a[1]) * by + (pz - a[2]) * bz) / l2))
  return len3(px - a[0] - bx * t, py - a[1] - by * t, pz - a[2] - bz * t) - (ra + (rb - ra) * t)
}
function sdTube(px, py, pz, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    d = Math.min(d, sdCone(px, py, pz, a, b, a[3], b[3]))
  }
  return d
}
function sdTorusX(px, py, pz, R, r) { // ring in the YZ plane, axis X
  const q = Math.sqrt(py * py + pz * pz) - R
  return Math.sqrt(q * q + px * px) - r
}
function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)

/** a kit head field placed at `at`, looking along `fwd` (unit, in the XZ or any plane), up +Y-ish */
function placedHead(kit, params, at, fwd, up = [0, 1, 0]) {
  const H = kit.headSDF(params)
  // head frame: z = fwd, y = up ⟂ fwd, x = y × z
  const z = new THREE.Vector3(...fwd).normalize()
  const y = new THREE.Vector3(...up).addScaledVector(z, -new THREE.Vector3(...up).dot(z)).normalize()
  const x = new THREE.Vector3().crossVectors(y, z)
  return (px, py, pz) => {
    const dx = px - at[0], dy = py - at[1], dz = pz - at[2]
    return H.sd(dx * x.x + dy * x.y + dz * x.z, dx * y.x + dy * y.y + dz * y.z, dx * z.x + dy * z.y + dz * z.z)
  }
}

function meshOf(kit, sd, bounds, voxel, material, part) {
  const geo = kit.meshSDF({ bounds, sd }, { voxel })
  const m = new THREE.Mesh(geo, material)
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  return m
}

// ------------------------------------------------------------------ the control car (a gong 觥 hung under the bow)

export function gondola(kit, { q = 1, material, seed = 1 }) {
  const G = GONDOLA
  const xc = (G.x0 + G.x1) / 2, hl = (G.x1 - G.x0) / 2
  const yTop = YC - rAt(xc) // hull bottom over the car's middle (local y 0)
  const hw = G.w / 2
  const prow = placedHead(kit, { kind: 'tiger', width: 10.5, projection: 0.42, droop: 18, eyeSize: 1.15, hornSize: 0.9, embed: 3, seed }, [hl + 1.2, -6.4, 0], [1, 0, 0])
  const stern = placedHead(kit, { kind: 'bovine', width: 9, projection: 0.3, droop: 26, hornSize: 0.8, hornCurl: 0.6, embed: 3, seed: seed + 1 }, [-hl - 0.4, -6.0, 0], [-1, 0, 0])
  const pitch = 4.3 // window spacing
  const sd = (x, y, z) => {
    // cabin: a long rounded box, the lower hull an ellipsoid keel, a pointed prow and a rounded stern
    let d = sdRoundBox(x, y + 6.6, z, hl - 3, 5.6, hw, 3.2)
    d = smin(d, sdEllipsoid(x + 0.5, y + 8.4, z, hl, 5.4, hw * 0.92), 2.0)
    d = smin(d, sdCone(x, y, z, [hl - 6, -6.8, 0], [hl + 1.0, -6.4, 0], hw * 0.9, 2.6), 2.4)
    // a belt (bowstring) round the cabin under the windows
    d = smin(d, sdRoundBox(x, y + 9.4, z, hl - 3.4, 0.55, hw + 0.55, 0.5), 0.4)
    // the neck into the hull: a low block running up inside the hull, closed under the bounds
    d = smin(d, sdRoundBox(x, y - 1.6, z, hl - 6, 6.4, hw * 0.62, 2.0), 2.0)
    d = smax(d, y - 9.0, 0.5)
    // windows: a row of square recesses along both sides and round the prow
    if (y > -6.6 && y < -1.2 && x > -hl + 6 && x < hl - 4) {
      const qx = ((x % pitch) + pitch * 1.5) % pitch - pitch / 2
      const w = sdRoundBox(qx, y + 3.9, Math.abs(z) - hw, 1.25, 1.55, 1.3, 0.35)
      d = smax(d, -w, 0.35)
    }
    // the beast heads at prow and stern
    d = smin(d, prow(x, y, z), 1.6)
    d = smin(d, stern(x, y, z), 1.6)
    return d
  }
  const bounds = { min: [-hl - 12, -18, -hw - 6], max: [hl + 14, 10, hw + 6] }
  const voxel = 0.42 / Math.sqrt(q)
  const m = meshOf(kit, sd, bounds, voxel, material, 'gondola')
  m.position.set(xc, yTop, 0)
  m.name = 'gondola'
  return m
}

// ------------------------------------------------------------------ engine cars on snake struts, pusher propellers

const ENGINE_D = 13 // car axis this far outside the hull surface

function engineGeometry(kit, { q, seed }) {
  const r0 = 30 // the hull radius the car is built against (local frame: hull axis at the origin, car below)
  const cy = -(r0 + ENGINE_D)
  const head = placedHead(kit, { kind: 'tiger', width: 6.6, projection: 0.36, droop: 12, eyeSize: 1.2, hornSize: 0.7, embed: 2, seed }, [12.6, cy + 0.4, 0], [1, 0, 0])
  // two snake struts: car top → hull, a gentle S in x, swelling at the hull end
  const strut = (sx) => {
    const k = []
    for (let i = 0; i <= 8; i++) {
      const t = i / 8
      const x = sx * (6.5 - 2.5 * t) + 1.1 * Math.sin(Math.PI * 2 * t) * sx
      const y = cy + 4.0 + (r0 + ENGINE_D - 4.0 - (r0 - 5)) * t
      k.push([x, y, 0, 1.25 + 0.55 * t])
    }
    return k
  }
  const sA = strut(1), sB = strut(-1)
  const px = -15.4 // propeller plane
  const blades = [0, 1, 2, 3].map((i) => ((45 + 90 * i) * Math.PI) / 180)
  const sd = (x, y, z) => {
    const yy = y - cy
    // the pod: a fat fore body tapering aft to the shaft
    let d = sdEllipsoid(x - 1.5, yy, z, 11.5, 5.0, 5.4)
    d = smin(d, sdCone(x, yy, z, [2, 0, 0], [px + 1.5, 0, 0], 4.6, 1.5), 2.0)
    // a ridge along the back and a belt
    d = smin(d, sdRoundBox(x - 1.5, yy - 4.6, z, 7.5, 0.9, 0.9, 0.6), 0.8)
    d = smin(d, sdTorusX(x - 4.0, yy, z, 5.2, 0.6), 0.5)
    d = smin(d, head(x, y, z), 1.2)
    d = smin(d, sdTube(x, y, z, sA), 1.6)
    d = smin(d, sdTube(x, y, z, sB), 1.6)
    // propeller: a whorl boss (spinner) and four blades in the YZ plane
    d = smin(d, sdEllipsoid(x - px + 0.4, yy, z, 2.4, 2.5, 2.5), 0.6)
    let bd = Infinity
    for (const a of blades) {
      const c = Math.cos(a), s = Math.sin(a)
      const rho = yy * c + z * s, tau = -yy * s + z * c
      bd = Math.min(bd, sdEllipsoid(x - px + 0.1 * tau, rho - 5.6, tau, 0.7, 4.6, 1.55))
    }
    d = smin(d, bd, 0.8)
    // close under the bounds: the struts end inside the hull
    d = smax(d, y - (-(r0 - 6)), 0.4)
    return d
  }
  const bounds = { min: [-18, cy - 11, -11], max: [16, -(r0 - 7.5), 11] }
  const voxel = 0.33 / Math.sqrt(q)
  return kit.meshSDF({ bounds, sd }, { voxel })
}

export function engineCars(kit, { q = 1, material, seed = 1 }) {
  const geo = engineGeometry(kit, { q, seed })
  const out = []
  for (const E of ENGINES) {
    for (const side of [1, -1]) {
      const m = new THREE.Mesh(geo, material)
      // rotate the local "below" (−Y) to the station angle on this side, then shift for the hull radius there
      const th = side > 0 ? E.psi - Math.PI : Math.PI - E.psi
      m.rotation.x = th
      const drop = rAt(E.x) - 30
      m.position.set(E.x, YC, 0)
      m.position.y += drop * Math.cos(E.psi)
      m.position.z += drop * side * Math.sin(E.psi)
      m.userData.part = 'engines'
      m.castShadow = m.receiveShadow = true
      m.name = `engine-${E.x}-${side > 0 ? 'starboard' : 'port'}`
      out.push(m)
    }
  }
  return out
}

// ------------------------------------------------------------------ nose cone + mooring ring, tail knob

export function noseAndTail(kit, { q = 1, material }) {
  const nose = (x, y, z) => {
    const yy = y - YC
    let d = sdCone(x, yy, z, [HULL.nose - 6, 0, 0], [HULL.nose + 3.6, 0, 0], 4.4, 2.9)
    d = smin(d, sdEllipsoid(x - HULL.nose - 3.8, yy, z, 1.8, 3.4, 3.4), 0.6)
    d = smin(d, sdTorusX(x - HULL.nose - 6.0, yy, z, 3.0, 1.15), 0.7) // the mooring ring
    d = smin(d, sdTorusX(x - HULL.nose + 0.4, yy, z, 4.6, 0.7), 0.5) // a collar where the cone leaves the hull
    return smax(d, HULL.nose - 7 - x, 0.3)
  }
  const tail = (x, y, z) => {
    const yy = y - YC
    let d = sdCone(x, yy, z, [HULL.tail + 12, 0, 0], [HULL.tail - 2.5, 0, 0], 3.0, 1.7)
    d = smin(d, sdEllipsoid(x - HULL.tail + 3.4, yy, z, 2.6, 2.6, 2.6), 0.8)
    d = smin(d, sdTorusX(x - HULL.tail - 2.0, yy, z, 2.6, 0.7), 0.5)
    return smax(d, x - (HULL.tail + 14), 0.3)
  }
  const vox = 0.3 / Math.sqrt(q)
  const n = meshOf(kit, nose, { min: [HULL.nose - 9, YC - 7, -7], max: [HULL.nose + 10, YC + 7, 7] }, vox, material, 'mooring')
  const t = meshOf(kit, tail, { min: [HULL.tail - 7, YC - 6, -6], max: [HULL.tail + 16, YC + 6, 6] }, vox, material, 'mooring')
  n.name = 'mooring-cone'; t.name = 'tail-knob'
  return [n, t]
}

// ------------------------------------------------------------------ flanges: keels and sides (the mould joins)

export function flanges(kit, { material, seed = 1 }) {
  const out = []
  const spec = (psi, side, x0, x1, i, h = 3.4) => kit.flange({
    path: meridianPath(THREE, psi, side, x0, x1), height: h, thickness: 3.0, embed: 1.8, taper: 3, bevel: 0.5, waver: 0.35,
    notches: { shape: 'T', pitch: 10, depth: 0.45, width: 2.2 }, ends: { start: 'taper', end: { type: 'beak', length: 3.2 } },
    seed: seed + i, material, part: 'flanges',
  })
  const xf = REG.bow[1] - 4 // forward end: behind the nose cap
  const xa = -96 // aft end: the fins take over
  out.push(spec(0, 1, xa, xf, 1)) // top keel
  out.push(spec(Math.PI / 2, 1, xa, xf, 2)) // starboard
  out.push(spec(Math.PI / 2, -1, xa, xf, 3)) // port
  // bottom keel, broken by the cradle and the control car
  out.push(spec(Math.PI, 1, xa, CRADLE.x - 10, 4))
  out.push(spec(Math.PI, 1, CRADLE.x + 10, GONDOLA.x0 - 5, 5))
  return out
}

// ------------------------------------------------------------------ the fins: four notched plates

export function fins(kit, { q = 1, relief, outline, holes, rect, material }) {
  const geo = kit.plate({
    outline, holes, thickness: 4.2,
    front: { relief, rect }, back: { relief: 'front', mirror: false },
    spacing: 7, reliefSpacing: q >= 1 ? 1.7 : 2.6, material, part: 'fins',
  }).geometry
  const out = []
  // plate frame: x = hull x, y = out from the axis. Rotate about X so +y points at each keel / side.
  for (const [name, ang] of [['top', 0], ['starboard', Math.PI / 2], ['bottom', Math.PI], ['port', -Math.PI / 2]]) {
    const m = new THREE.Mesh(geo, material)
    m.rotation.x = ang
    m.position.set(0, YC, 0)
    m.userData.part = 'fins'
    m.name = `fin-${name}`
    m.castShadow = m.receiveShadow = true
    out.push(m)
  }
  return out
}

// ------------------------------------------------------------------ the stand: foot and mast, dragon, cradle

export const STAND = { foot: 64, col: 7.6, colTop: 108 }

/** foot + mast profile, (r, y), bottom centre → mast top */
export function standProfile() {
  const F = STAND.foot, c = STAND.col
  return [
    [0, 0], [F - 3, 0], [F, 1.0], [F + 0.6, 4.0], [F - 0.4, 6.4], [F - 4.5, 8.2], // the base ring
    [F - 10, 10.6], [F - 30, 17.5], [F - 44, 23.0], // the decorated slope
    [18, 25.6], [12.6, 29.5], [c + 1.6, 34], [c + 0.6, 38], [c, 42], // into the mast
    [c, 70], [c - 0.2, STAND.colTop - 4], [c + 1.0, STAND.colTop - 1.5], [c + 1.0, STAND.colTop], [0, STAND.colTop],
  ]
}
export const FOOT_BAND = [3, 8] // profile segment indices of the decorated slope (from point 5 to 8)

/** resample the profile by arc length: { pts: [[r, y, s]], length, at(s) } */
export function profileTable(pts) {
  const out = [[pts[0][0], pts[0][1], 0]]
  for (let i = 1; i < pts.length; i++) out.push([pts[i][0], pts[i][1], out[i - 1][2] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])])
  const length = out[out.length - 1][2]
  return {
    pts: out, length,
    at(s) {
      let i = 1
      while (i < out.length - 1 && out[i][2] < s) i++
      const a = out[i - 1], b = out[i]
      const f = Math.max(0, Math.min(1, (s - a[2]) / Math.max(1e-9, b[2] - a[2])))
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, b[0] - a[0], b[1] - a[1]]
    },
  }
}

/** the dragon's helix round the mast: centre line c(t), t 0 (tail, low) → 1 (neck, high) */
export const DRAGON = { y0: 46, y1: 100, turns: 2.1, rc: STAND.col + 2.4, r0: 1.0, r1: 3.6, a0: 0.9 }
export function dragonCentre(t, o = [0, 0, 0]) {
  const D = DRAGON
  const a = D.a0 + t * D.turns * Math.PI * 2
  o[0] = CRADLE.x + D.rc * Math.sin(a)
  o[1] = D.y0 + (D.y1 - D.y0) * t
  o[2] = D.rc * Math.cos(a)
  return o
}
export const dragonRadius = (t) => (DRAGON.r0 + (DRAGON.r1 - DRAGON.r0) * Math.pow(Math.min(1, t / 0.85), 0.8)) * Math.sqrt(Math.min(1, t / 0.03)) // closes to a point at the tail

export function dragonLength() {
  let L = 0
  const a = [0, 0, 0], b = [0, 0, 0]
  dragonCentre(0, a)
  for (let i = 1; i <= 400; i++) { dragonCentre(i / 400, b); L += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); a[0] = b[0]; a[1] = b[1]; a[2] = b[2] }
  return L
}

/** the dragon body as a swept tube (u round the section, back at u = ½ facing out from the mast) */
export function dragonSurface() {
  const c = [0, 0, 0], c1 = [0, 0, 0], c0 = [0, 0, 0]
  return (u, v, out) => {
    const t = v, e = 1e-3
    dragonCentre(t, c); dragonCentre(Math.min(1, t + e), c1); dragonCentre(Math.max(0, t - e), c0)
    const T = new THREE.Vector3(c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]).normalize()
    // outward from the mast axis, made ⟂ T
    const O = new THREE.Vector3(c[0] - CRADLE.x, 0, c[2]).normalize()
    O.addScaledVector(T, -O.dot(T)).normalize()
    const B = new THREE.Vector3().crossVectors(T, O) // completes the frame
    const r = dragonRadius(t)
    // u = 0.5 on the back (O), u running so that dP/du × dP/dv points out
    const a = (u - 0.5) * Math.PI * 2
    const n = O.clone().multiplyScalar(Math.cos(a)).addScaledVector(B, -Math.sin(a))
    out.pos.set(c[0] + n.x * r, c[1] + n.y * r, c[2] + n.z * r)
    out.nrm.copy(n)
  }
}

export function dragonHead(kit, { q = 1, material, seed = 1 }) {
  const c = dragonCentre(1), c0 = dragonCentre(0.98, [0, 0, 0])
  const T = new THREE.Vector3(c[0] - c0[0], c[1] - c0[1], c[2] - c0[2]).normalize()
  const O = new THREE.Vector3(c[0] - CRADLE.x, 0, c[2]).normalize()
  // the head looks out from the mast and a little up, along the body's run
  const fwd = O.clone().multiplyScalar(0.75).addScaledVector(T, 0.55).add(new THREE.Vector3(0, 0.25, 0)).normalize()
  const at = [c[0] + fwd.x * 1.5, c[1] + fwd.y * 1.5, c[2] + fwd.z * 1.5]
  const head = placedHead(kit, { kind: 'buffalo', width: 11, projection: 0.6, droop: 8, hornSize: 0.62, hornCurl: 0.85, eyeSize: 1.2, embed: 2.5, seed }, at, [fwd.x, fwd.y, fwd.z])
  const neck = [[...c0, dragonRadius(0.98)], [at[0], at[1], at[2], 3.4]]
  const sd = (x, y, z) => smin(head(x, y, z), sdTube(x, y, z, neck), 1.6)
  const R = 14
  const bounds = { min: [at[0] - R, at[1] - R, at[2] - R], max: [at[0] + R, at[1] + R, at[2] + R] }
  const m = meshOf(kit, sd, bounds, 0.36 / Math.sqrt(q), material, 'stand')
  m.name = 'dragon-head'
  return m
}

/** the cradle: a saddle under the hull at CRADLE.x, its two ends beast heads looking out; the mast's capital under it */
export function cradle(kit, { q = 1, material, seed = 1 }) {
  const x0 = CRADLE.x, rh = rAt(x0), B = CRADLE.half
  const rIn = rh - 0.6, rOut = rh + 4.6, hx = 6.2
  const ends = [1, -1].map((s) => {
    const b = s * (B + 0.06)
    const dir = [0, -Math.cos(b), Math.sin(b)] // radial at the end
    const tan = [0, Math.sin(b) * s, Math.cos(b) * s] // up round the hull, away from the bottom
    const at = [x0, YC + dir[1] * (rOut + 0.6) + tan[1] * 2.0, dir[2] * (rOut + 0.6) + tan[2] * 2.0]
    const fwd = [0, dir[1] * 0.55 + tan[1] * 0.75, dir[2] * 0.55 + tan[2] * 0.75]
    return placedHead(kit, { kind: 'ram', width: 10.5, projection: 0.42, droop: 24, hornSize: 0.8, hornCurl: 0.7, eyeSize: 1.15, embed: 3, seed: seed + (s > 0 ? 0 : 1) }, at, fwd)
  })
  const sd = (x, y, z) => {
    const lx = x - x0, yy = y - YC
    const rho = Math.hypot(yy, z)
    const beta = Math.atan2(Math.abs(z), -yy) // angle from straight down
    // the saddle band: an annulus sector with rounded section
    const dr = Math.abs(rho - (rIn + rOut) / 2) - (rOut - rIn) / 2
    const da = (beta - B) * rho
    let d = sdRoundBoxish(lx, dr, da, hx)
    // a raised rib along the saddle's middle
    d = smin(d, smax(Math.hypot(lx, rho - rOut) - 1.5, da, 0.5), 0.8)
    for (const e of ends) d = smin(d, e(x, y, z), 1.8)
    // the capital: a flared cup from the mast top up into the saddle
    const yc0 = STAND.colTop - 3
    d = smin(d, sdCone(x - x0, y, z, [0, yc0, 0], [0, YC - rOut + 1.5, 0], STAND.col + 0.8, 10.5), 2.4)
    return smax(d, yc0 - 1 - y, 0.3)
  }
  const ext = (rOut + 12)
  const bounds = { min: [x0 - 14, STAND.colTop - 6, -ext], max: [x0 + 14, YC - rh * Math.cos(B) + 16, ext] }
  const m = meshOf(kit, sd, bounds, 0.42 / Math.sqrt(q), material, 'stand')
  m.name = 'cradle'
  return m
}

/** a rounded slab: |x| ≤ hx, radial depth dr ≤ 0, angular overrun da ≤ 0 (all mm), rounded 1.6 */
function sdRoundBoxish(x, dr, da, hx) {
  const r = 1.6
  const qx = Math.abs(x) - hx + r, qy = dr + r, qz = da + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}

export { xAtArc, arcAt }
