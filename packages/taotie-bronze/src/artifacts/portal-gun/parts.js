// portal-gun — L3 sculpture and the cast parts that are not relief panels: the core eyes (almond sockets with a
// turquoise lens and a bronze bar across it = the slit pupil, the cage), the grip creature's head, tongue (the trigger)
// and tail (the guard), the selector dial, the ring fins, the flanges, the power cell's socket, ring handle and
// windows, the cable, and the stand (a base slab, two posts, two confronted beasts whose hollowed backs are the
// cradle). Sculpture is signed-distance solids meshed by kit.meshSDF. All mm; gun-local parts are added to the gun
// group (axis at the origin), stand parts to the root.

import * as THREE from 'three'
import { AXIS, BELL, bellR, bellMeridian, BARREL, EYE, DIAL, SPINE, CELL, SOCKET, GRIP_LINE, GRIP, HEAD, TONGUE, TAIL, STAND, flankZ, bodyTop } from './form.js'

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
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const l2 = bx * bx + by * by + bz * bz
  const t = Math.max(0, Math.min(1, ((px - a[0]) * bx + (py - a[1]) * by + (pz - a[2]) * bz) / l2))
  return len3(px - a[0] - bx * t, py - a[1] - by * t, pz - a[2] - bz * t) - (ra + (rb - ra) * t)
}
function sdTube(px, py, pz, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) d = Math.min(d, sdCone(px, py, pz, knots[i], knots[i + 1], knots[i][3], knots[i + 1][3]))
  return d
}
/** resample tube knots [x, y, z, r] along a centripetal Catmull-Rom spline (smooth bends instead of facets) */
function smoothKnots(knots, per = 4) {
  const curve = new THREE.CatmullRomCurve3(knots.map((k) => new THREE.Vector3(k[0], k[1], k[2])), false, 'centripetal')
  const n = (knots.length - 1) * per, out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, p = curve.getPoint(t), f = t * (knots.length - 1), j = Math.min(knots.length - 2, Math.floor(f))
    out.push([p.x, p.y, p.z, knots[j][3] + (knots[j + 1][3] - knots[j][3]) * (f - j)])
  }
  return out
}
function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)

/** a kit head field placed at `at`, looking along `fwd`, its crown toward `up` */
function placedHead(kit, params, at, fwd, up = [0, 1, 0]) {
  const H = kit.headSDF(params)
  const bc = H.bounds.min.map((v, i) => (v + H.bounds.max[i]) / 2)
  const br = 0.5 * Math.hypot(...H.bounds.max.map((v, i) => v - H.bounds.min[i]))
  const z = new THREE.Vector3(...fwd).normalize()
  const y = new THREE.Vector3(...up).addScaledVector(z, -new THREE.Vector3(...up).dot(z)).normalize()
  const x = new THREE.Vector3().crossVectors(y, z)
  return (px, py, pz) => {
    const dx = px - at[0], dy = py - at[1], dz = pz - at[2]
    const hx = dx * x.x + dy * x.y + dz * x.z, hy = dx * y.x + dy * y.y + dz * y.z, hz = dx * z.x + dy * z.y + dz * z.z
    const far = Math.hypot(hx - bc[0], hy - bc[1], hz - bc[2]) - br
    if (far > 3) return far
    return H.sd(hx, hy, hz)
  }
}

function tag(o, part, name) {
  o.userData.part = part
  if (name) o.name = name
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.userData.part = part } })
  return o
}

function sdfMesh(kit, sd, bounds, voxel, material, part, name) {
  const geo = kit.meshSDF({ bounds, sd }, { voxel })
  return tag(new THREE.Mesh(geo, material), part, name)
}

/** a copy of a geometry reflected through z = 0 (winding reversed, so it still faces out) */
export function mirrorZ(geo) {
  const g = geo.clone()
  const p = g.attributes.position, n = g.attributes.normal
  for (let i = 0; i < p.count; i++) { p.setZ(i, -p.getZ(i)); if (n) n.setZ(i, -n.getZ(i)) }
  const idx = g.index
  if (idx) for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a) }
  p.needsUpdate = true
  if (n) n.needsUpdate = true
  g.computeBoundingBox()
  g.computeBoundingSphere()
  return g
}

// ------------------------------------------------------------------ turquoise inlay

/**
 * Turquoise as a stone, not a patina: matte, slightly mottled, a few dark matrix veins. A MeshStandardMaterial that
 * follows the shared patina mode (clay / height: neutral grey like the bronze) so the relief views stay honest.
 */
export function turquoiseMaterial(kit, { seed = 7, color = '#4fb3a6' } = {}) {
  const S = 256
  const cv = kit.createCanvas(S, S)
  const ctx = cv.getContext('2d')
  const rng = new kit.Rng(seed)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, S, S)
  // soft mottle: overlapping translucent blobs, lighter and darker
  for (let i = 0; i < 180; i++) {
    const x = rng.next() * S, y = rng.next() * S, r = 6 + rng.next() * 28
    const v = rng.next()
    ctx.fillStyle = v < 0.5 ? `rgba(255,255,255,${0.12 + 0.2 * rng.next()})` : `rgba(120,150,140,${0.06 + 0.12 * rng.next()})`
    for (const [ox, oy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]) { ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2); ctx.fill() }
  }
  // a fine spider-web matrix: thin dark veins
  ctx.strokeStyle = 'rgba(60,52,40,0.55)'
  ctx.lineCap = 'round'
  for (let i = 0; i < 14; i++) {
    let x = rng.next() * S, y = rng.next() * S, a = rng.next() * Math.PI * 2
    ctx.lineWidth = 0.6 + rng.next() * 1.1
    ctx.beginPath(); ctx.moveTo(x, y)
    for (let k = 0; k < 9; k++) { a += (rng.next() - 0.5) * 1.6; x += Math.cos(a) * 9; y += Math.sin(a) * 9; ctx.lineTo(x, y) }
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), map: tex, roughness: 0.48, metalness: 0, envMapIntensity: 0.55 })
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTqMode = kit.patina.mode
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', 'uniform float uTqMode;\nvoid main() {')
      .replace('#include <map_fragment>', '#include <map_fragment>\n  if (uTqMode > 0.5) diffuseColor.rgb = vec3(uTqMode > 1.5 ? 0.0 : 0.42);')
  }
  mat.customProgramCacheKey = () => 'taotie-turquoise'
  return mat
}

// ------------------------------------------------------------------ the core eyes

/** the almond socket in flank-local coordinates: s along x, t along y, w out of the flank */
function eyeSD() {
  const E = EYE
  const R = (E.w * E.w + E.h * E.h) / (2 * E.h), dv = R - E.h // vesica: two circles crossing at the corners
  const c = (E.rise - 4) / 2, hz = (E.rise + 4) / 2
  const rBar = E.lens + 1.7
  return (s, t, w) => {
    const d2 = Math.max(Math.hypot(s, t + dv) - R, Math.hypot(s, t - dv) - R)
    let d = smax(d2, Math.abs(w - c) - hz, 2.4)
    // the bore the lens sits in (floor at w = 0.6)
    const bore = Math.max(Math.hypot(s, t) - E.bore, 0.6 - w)
    d = smax(d, -bore, 0.7)
    // a rolled lip round the bore
    const q = Math.hypot(s, t) - (E.bore + 1.1)
    d = smin(d, Math.hypot(q, w - E.rise + 0.4) - 1.5, 0.8)
    // the bar across the lens: an arc over it in the t–w plane (the slit pupil; the cage)
    const rr = Math.hypot(t, w - E.lensC) - rBar
    d = smin(d, smax(Math.hypot(rr, s) - 2.7, 0.2 - w, 0.4), 0.9)
    // two rivets where the bar meets the rim
    for (const sg of [1, -1]) d = smin(d, len3(s, t - sg * (E.bore + 1.2), w - E.rise + 0.2) - 2.6, 0.8)
    return d
  }
}

export function coreEyes(kit, { q = 1, material, turquoise }) {
  const sd = eyeSD()
  const z0 = flankZ(EYE.x, EYE.y) - 0.6
  const bounds = { min: [-EYE.w - 3, -EYE.h - 4, -4.5], max: [EYE.w + 3, EYE.h + 4, EYE.lens + EYE.lensC + 4] }
  const geo = kit.meshSDF({ bounds, sd }, { voxel: 0.74 / Math.sqrt(q) })
  const out = []
  const lensGeo = new THREE.SphereGeometry(EYE.lens, Math.round(64 * Math.sqrt(q)), Math.round(22 * Math.sqrt(q)), 0, Math.PI * 2, 0, (69 * Math.PI) / 180)
  for (const side of [1, -1]) {
    const g = side > 0 ? geo : mirrorZ(geo)
    const m = tag(new THREE.Mesh(g, material), 'eyes', side > 0 ? 'eye-starboard' : 'eye-port')
    m.position.set(EYE.x, EYE.y, side * z0)
    out.push(m)
    const lens = tag(new THREE.Mesh(lensGeo, turquoise), 'cores', side > 0 ? 'core-lens-starboard' : 'core-lens-port')
    lens.rotation.x = side * (Math.PI / 2)
    lens.position.set(EYE.x, EYE.y, side * (z0 + EYE.lensC))
    out.push(lens)
  }
  return out
}

// ------------------------------------------------------------------ the grip creature: head, tongue (trigger), tail (guard)

export function gripSculpture(kit, { q = 1, material, seed = 1 }) {
  const head = placedHead(kit, { kind: 'tiger', width: HEAD.width, projection: 0.5, droop: 6, eyeSize: 1.2, hornSize: 0.85, embed: 4, seed }, HEAD.at, HEAD.fwd, HEAD.up)
  const g0 = GRIP_LINE[GRIP_LINE.length - 1], g1 = GRIP_LINE[GRIP_LINE.length - 2]
  const neck = [[g1[0], g1[1], 0, 12.5], [g0[0], g0[1], 0, 13.4], [HEAD.at[0] - 2, HEAD.at[1] + 1, 0, 11]]
  const tongue = smoothKnots(TONGUE, 4), tail = smoothKnots(TAIL, 4)
  const sdHead = (x, y, z) => {
    let d = smin(head(x, y, z), sdTube(x, y, z, neck), 3)
    d = smin(d, sdTube(x, y, z, tongue), 1.6)
    return smax(d, y - (-38.5), 0.6) // closed under the body's floor (the bite is buried in the body)
  }
  const hb = { min: [-66, -86, -22], max: [0, -36, 22] }
  const vox = 0.66 / Math.sqrt(q)
  const headMesh = sdfMesh(kit, sdHead, hb, vox, material, 'grip', 'grip-head')
  // the haunch (pommel) and the tail that runs forward under the trigger and curls up into the guard
  const b0 = GRIP_LINE[0]
  const sdTail = (x, y, z) => {
    let d = sdEllipsoid(x - b0[0] + 0.5, y - b0[1] + 1.5, z, 17.5, 12.5, 15.2)
    d = smin(d, sdTube(x, y, z, tail), 3)
    // a ridge of knuckles along the tail's back (cast scutes)
    return d
  }
  const tb = { min: [-80, -146, -18], max: [17, -66, 18] }
  const tailMesh = sdfMesh(kit, sdTail, tb, vox, material, 'grip', 'grip-tail')
  return [headMesh, tailMesh]
}

/** the grip's centre line as a curve and the swept surface of its body (u round the section, v haunch → neck) */
export function gripSurface() {
  const curve = new THREE.CatmullRomCurve3(GRIP_LINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal')
  const Z = new THREE.Vector3(0, 0, 1)
  const T = new THREE.Vector3(), N = new THREE.Vector3(), c = new THREE.Vector3()
  return (u, v, out) => {
    curve.getPointAt(v, c)
    curve.getTangentAt(v, T)
    N.crossVectors(Z, T).normalize() // in-plane, toward the back for an upward tangent
    const k = 1 - (1 - GRIP.neck) * Math.pow(v, 1.6)
    const a = 2 * Math.PI * u
    const ca = Math.cos(a), sa = Math.sin(a)
    out.pos.set(c.x + N.x * GRIP.depth * k * ca, c.y + N.y * GRIP.depth * k * ca, GRIP.width * k * sa)
  }
}

// ------------------------------------------------------------------ the selector dial

export function selectorDial(kit, { q = 1, material, turquoise }) {
  const n = 20, R = DIAL.r, depth = 1.5
  const outline = []
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 0.55)) / n, a2 = (2 * Math.PI * (i + 1)) / n
    for (let k = 0; k <= 3; k++) { const a = a0 + ((a1 - a0) * k) / 3; outline.push([R * Math.cos(a), R * Math.sin(a)]) }
    for (let k = 0; k <= 3; k++) { const a = a1 + ((a2 - a1) * k) / 3; outline.push([(R - depth) * Math.cos(a), (R - depth) * Math.sin(a)]) }
  }
  const dial = kit.plate({ outline, thickness: 6.4, spacing: 2.2, material, part: 'dial' })
  const z = flankZ(DIAL.x, DIAL.y)
  dial.position.set(DIAL.x, DIAL.y, z + 1.6)
  tag(dial, 'dial', 'selector-dial')
  // a raised collar round the inlay and a pointer bar (the setting)
  const ring = tag(new THREE.Mesh(new THREE.TorusGeometry(6.6, 1.25, 10, Math.round(40 * Math.sqrt(q))), material), 'dial', 'dial-collar')
  ring.position.set(DIAL.x, DIAL.y, z + 4.8)
  const ptr = tag(new THREE.Mesh(new THREE.CapsuleGeometry(1.15, 3.6, 4, 8), material), 'dial', 'dial-pointer')
  ptr.position.set(DIAL.x - 1.6, DIAL.y + 9.2, z + 5.0)
  ptr.rotation.z = 0.17
  const stone = tag(new THREE.Mesh(new THREE.SphereGeometry(6.4, 32, 12, 0, Math.PI * 2, 0, (52 * Math.PI) / 180), turquoise), 'cores', 'dial-stone')
  stone.rotation.x = Math.PI / 2
  stone.position.set(DIAL.x, DIAL.y, z + 4.6 - 6.4 * Math.cos((52 * Math.PI) / 180) + 0.2)
  return [dial, ring, ptr, stone]
}

// ------------------------------------------------------------------ the ring fins (notched annular plates)

function notchedRing(R, depth, count, notchFrac = 0.42) {
  const out = []
  for (let i = 0; i < count; i++) {
    const a0 = (2 * Math.PI * i) / count, a1 = (2 * Math.PI * (i + 1 - notchFrac)) / count, a2 = (2 * Math.PI * (i + 1)) / count
    for (let k = 0; k <= 4; k++) { const a = a0 + ((a1 - a0) * k) / 4; out.push([R * Math.cos(a), R * Math.sin(a)]) }
    out.push([(R - depth) * Math.cos(a1 + 0.004), (R - depth) * Math.sin(a1 + 0.004)])
    out.push([(R - depth) * Math.cos(a2 - 0.004), (R - depth) * Math.sin(a2 - 0.004)])
  }
  return out
}
const circle = (r, n = 48) => Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)])

export function fins(kit, { material }) {
  const geo = kit.plate({ outline: notchedRing(BARREL.finR, 5.2, 16), holes: [circle(BARREL.finHole)], thickness: BARREL.finT, spacing: 3.2, material, part: 'fins' }).geometry
  return BARREL.fins.map((x, i) => {
    const m = tag(new THREE.Mesh(geo, material), 'fins', `fin-${i}`)
    m.rotation.y = Math.PI / 2
    m.rotation.z = Math.PI / 16 / 2 * (i % 2) // alternate fins half a notch out of step
    m.position.set(x, 0, 0)
    return m
  })
}

// ------------------------------------------------------------------ flanges: the top spine and four on the emitter

export function flanges(kit, { material, seed = 1 }) {
  const out = []
  const yTop = bodyTop(0)
  out.push(tag(kit.flange({
    from: new THREE.Vector3(SPINE.x0, yTop - 0.6, 0), to: new THREE.Vector3(SPINE.x1, yTop - 0.6, 0), out: new THREE.Vector3(0, 1, 0),
    height: SPINE.h, thickness: 5.2, embed: 2.2, taper: 3, bevel: 0.6, waver: 0.3,
    notches: { shape: 'T', pitch: 12.5, depth: 0.42, width: 3.2 }, ends: { start: { type: 'hook', length: 9, height: 1.3 }, end: 'taper' },
    seed, material, part: 'flanges',
  }), 'flanges', 'spine-flange'))
  // on the blade boundaries at the top and the two sides (the bottom is left to the cradle)
  for (let k = 0; k < 3; k++) {
    const th = [0, Math.PI / 2, -Math.PI / 2][k]
    out.push(tag(kit.flange({
      path: bellMeridian(THREE, th, BELL.x0 + 7, BELL.x1 - 3.5), height: (f) => 4.2 + 2.6 * f, thickness: 3.4, embed: 1.6, taper: 3, bevel: 0.5, waver: 0.3,
      notches: { shape: 'T', pitch: 10, depth: 0.45, width: 2.4 }, ends: { start: 'taper', end: { type: 'beak', length: 6, height: 1.2 } },
      seed: seed + 1 + k, material, part: 'flanges',
    }), 'flanges', `emitter-flange-${k}`))
  }
  return out
}

// ------------------------------------------------------------------ the power cell's fittings

export function cellFittings(kit, { q = 1, material, turquoise }) {
  const out = []
  // the socket's notched collar ring (a bayonet ring) and the cap's knob + ring handle (a bi disc's ring)
  const ring = kit.plate({ outline: notchedRing(SOCKET.r + 3.2, 3.4, 10, 0.3), holes: [circle(19.5)], thickness: 5.4, spacing: 3, material, part: 'cell' })
  ring.rotation.y = Math.PI / 2
  ring.position.set(SOCKET.x0 + 7.5, CELL.yc, 0)
  out.push(tag(ring, 'cell', 'socket-ring'))
  const knob = tag(new THREE.Mesh(new THREE.SphereGeometry(4.6, 24, 16), material), 'cell', 'cap-knob')
  knob.position.set(CELL.x0 - 1.5, CELL.yc, 0)
  out.push(knob)
  const handle = tag(new THREE.Mesh(new THREE.TorusGeometry(8.6, 2.7, 14, Math.round(48 * Math.sqrt(q))), material), 'cell', 'cap-ring')
  handle.position.set(CELL.x0 - 1.5 - 4.2 - 8.6 + 1.2, CELL.yc, 0)
  out.push(handle)
  // the windows: turquoise sheets in the sunk seats on both sides
  const W = CELL.window, r = CELL.r - 1.05
  for (const side of [1, -1]) {
    const th0 = side > 0 ? Math.PI / 2 : (3 * Math.PI) / 2
    const geo = kit.buildSurface({
      surface: (u, v, o) => { const th = th0 + (u - 0.5) * 2 * (W.half + 0.05); const x = W.x0 - 1 + (W.x1 - W.x0 + 2) * v; o.pos.set(x, CELL.yc + r * Math.cos(th), r * Math.sin(th)) },
      segments: [10, 24],
    })
    out.push(tag(new THREE.Mesh(geo, turquoise), 'cores', side > 0 ? 'cell-window-starboard' : 'cell-window-port'))
  }
  return out
}

/** the cable: a snake of bronze from the cell's cap round the +Z side to the grip's back */
export function cable(kit, { q = 1, material }) {
  const pts = [[-176, CELL.yc - 9, 7], [-181, -16, 14], [-179, -38, 20], [-163, -64, 23], [-132, -84, 22], [-98, -95, 14], [-76, -97, 6], [-64, -96, 0]]
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'centripetal')
  const geo = new THREE.TubeGeometry(curve, Math.round(120 * Math.sqrt(q)), 3.4, Math.round(14 * Math.sqrt(q)) + 2, false)
  const m = tag(new THREE.Mesh(geo, material), 'cable', 'cable')
  // a collar where it leaves the cap
  const col = tag(new THREE.Mesh(new THREE.TorusGeometry(4.4, 1.5, 10, 24), material), 'cable', 'cable-collar')
  const p0 = curve.getPointAt(0.02), t0 = curve.getTangentAt(0.02)
  col.position.copy(p0)
  col.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), t0)
  return [m, col]
}

// ------------------------------------------------------------------ the stand

/** the supported surface's radius at gun x (a part that lies in the saddle) */
const supportR = (S, x) => (S.part === 'bell' ? bellR(x) : S.r)

/**
 * One beast of the stand in GUN-LOCAL coordinates: a crouching tiger on a low plinth whose hollowed back cradles the
 * gun at x = S.x; `face` +1 looks toward +X. Its head is held low, toward its partner (the pair is confronted).
 */
function beastSD(kit, S, face, seed) {
  const R = supportR(S, S.x)
  const yb = S.yc - R // the saddle's lowest line
  const head = placedHead(kit, { kind: 'ram', width: 30, projection: 0.5, droop: 20, eyeSize: 1.2, hornSize: 1.15, hornCurl: 0.85, ears: true, embed: 4, seed },
    [S.x + face * 28, yb - 22, 0], [face * 0.94, 0.34, 0], [-face * 0.34, 0.94, 0])
  const tail = [[S.x - face * 20, yb - 10, 0, 4.2], [S.x - face * 30, yb - 12, 0, 3.8], [S.x - face * 35, yb - 19, 0, 3.3], [S.x - face * 32, yb - 26, 0, 2.9], [S.x - face * 26, yb - 24, 0, 2.6]]
  const legs = []
  for (const lx of [-15, 14]) for (const lz of [-1, 1]) legs.push([[S.x + lx, yb - 14, lz * 10, 6.2], [S.x + lx * 1.05, yb - 30, lz * 11.5, 5.4]])
  const yp = yb - 33.5
  return (x, y, z) => {
    // the body: a long rounded block whose top rises on both sides of the cradle
    let d = sdRoundBox(x - S.x, y - (yb - 6), z, 19, 12, R * 0.62 + 5, 7)
    d = smin(d, sdEllipsoid(x - S.x - face * 3, y - (yb - 12), z, 26, 11.5, 16), 5)
    d = smin(d, sdEllipsoid(x - S.x + face * 15, y - (yb - 10), z, 11, 12, 17), 4) // the haunches
    d = smin(d, sdTube(x, y, z, [[S.x + face * 10, yb - 10, 0, 9], [S.x + face * 22, yb - 19, 0, 8]]), 4) // the neck
    // the cradle: the supported surface (a cylinder, or the emitter's flare) cut out of the back, 0.4 mm clear
    const cut = Math.hypot(y - S.yc, z) - supportR(S, x) - 0.4
    d = smax(d, -cut, 1.2)
    d = smin(d, head(x, y, z), 3.2)
    d = smin(d, sdTube(x, y, z, tail), 2.2)
    for (const L of legs) d = smin(d, sdCone(x, y, z, L[0], L[1], L[0][3], L[1][3]), 2.4)
    // the plinth the beast crouches on (it caps the post)
    d = smin(d, sdRoundBox(x - S.x, y - yp, z, 25, 3.2, 17, 2), 2)
    return d
  }
}

export function stand(kit, { q = 1, material, baseRelief, seed = 1 }) {
  const out = []
  const B = STAND.base
  const outline = []
  const rr = B.r, hw = B.w / 2 - rr, hd = B.d / 2 - rr
  for (const [cx, cy, a0] of [[hw, hd, 0], [-hw, hd, 90], [-hw, -hd, 180], [hw, -hd, 270]]) for (let k = 0; k <= 8; k++) { const a = ((a0 + (90 * k) / 8) * Math.PI) / 180; outline.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]) }
  const base = kit.plate({
    outline, thickness: B.t, spacing: 14 / Math.sqrt(q), reliefSpacing: 2.6 / Math.sqrt(q),
    front: baseRelief ? { relief: baseRelief, rect: { x: -B.w / 2, y: -B.d / 2, w: B.w, h: B.d } } : null,
    material: baseRelief ? new kit.PatinaMaterial({ relief: baseRelief }) : material, part: 'stand',
  })
  base.rotation.x = -Math.PI / 2
  base.position.set(B.x, B.t / 2, 0)
  out.push(tag(base, 'stand', 'base'))
  for (const [S, face, k] of [[{ ...STAND.front }, -1, 0], [{ ...STAND.rear }, 1, 1]]) {
    const R = supportR(S, S.x)
    const yb = S.yc - R
    const sd = beastSD(kit, S, face, seed + k)
    const bounds = { min: [S.x - 52, yb - 40, -R - 13], max: [S.x + 52, yb + R * 0.9, R + 13] }
    const m = sdfMesh(kit, sd, bounds, 1.0 / Math.sqrt(q), material, 'stand', k ? 'rear-beast' : 'front-beast')
    m.position.y = AXIS
    out.push(m)
    // the post: from the base up into the beast's plinth
    const top = AXIS + yb - 33.5 - 1.5
    const h = top - B.t
    const post = kit.columnLeg({ height: h, radius: 8.6, taper: -0.12, entasis: 0.02, foot: { swell: 0.55, height: 9 }, top: { flare: 0.6, height: 7 },
      rings: { count: 2, at: 0.62, width: 1.6, spacing: 3.6, height: 0.9 }, embed: 3, material, density: 0.6 * Math.sqrt(q) })
    post.position.set(S.x, B.t, 0)
    out.push(tag(post, 'stand', k ? 'rear-post' : 'front-post'))
  }
  return out
}

