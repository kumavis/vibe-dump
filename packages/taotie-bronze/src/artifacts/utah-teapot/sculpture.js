// utah-teapot — L3 sculpture: notched flanges on the ±Z axes (body and lid: edge-on from the
// front, so the canonical silhouette is untouched; none crosses the spout or the handle) and the
// ram's head crowning the handle where it leaves the wall, the strap issuing from under its jaw.

import * as THREE from 'three'
import { BODY, LIDC, ARC, HANDLE } from './shell.js'
import { revSurface, chainPoint } from './form.js'

/** a kit.flange path along a chain meridian at azimuth az between arcs a0 → a1 (root on the wall) */
function meridianPath(table, az, a0, a1, step = 1.0) {
  const surf = revSurface(table, { az0: az - 1, az1: az + 1, a0: 0, a1: table.length })
  const pts = [], nrm = []
  const n = [0, 0, 0]
  for (let a = a0; a <= a1 + 1e-6; a += step) {
    const p = chainPoint(table, az, a)
    surf.normal(0.5, a / table.length, n)
    pts.push(new THREE.Vector3(p[0], p[1], p[2]))
    nrm.push(new THREE.Vector3(n[0], n[1], n[2]))
  }
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true, length: L,
    frame(s) {
      let i = 1
      while (i < pts.length - 1 && cum[i] < s) i++
      const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
      tmp.p.lerpVectors(pts[i - 1], pts[i], f)
      tmp.d.subVectors(pts[i], pts[i - 1]).normalize()
      const o = nrm[i - 1].clone().lerp(nrm[i], f)
      tmp.n.copy(o).addScaledVector(tmp.d, -o.dot(tmp.d)).normalize()
      tmp.b.crossVectors(tmp.d, tmp.n)
      return tmp
    },
  }
}

export function sculpture(kit, { q = 1, seed = 1975, material }) {
  const flanges = []
  // body: one notched flange on each broad face's axis, over the taotie's nose: low band → shoulder
  const a0 = ARC.belly[0] + 1.2, a1 = ARC.shoulder[1] - 6.5
  for (const [i, az] of [[0, 0], [1, 180]]) {
    flanges.push(kit.flange({
      path: meridianPath(BODY, az, a0, a1), height: 5.2, thickness: 4.2, embed: 2.4, taper: 3, bevel: 0.6, waver: 0.35,
      notches: { shape: 'T', pitch: 9.5, depth: 0.42, width: 2.2 }, seed: seed + 20 + i, material, part: 'flanges',
    }))
  }
  // lid: short low flanges on the same axes, between the cicada blades
  for (const [i, az] of [[0, 0], [1, 180]]) {
    flanges.push(kit.flange({
      path: meridianPath(LIDC, az, 8, 37.5, 0.8), height: 2.8, thickness: 3.0, embed: 1.6, taper: 3, bevel: 0.45, waver: 0.3,
      notches: { shape: 'square', pitch: 7, depth: 0.45, width: 1.8 }, seed: seed + 30 + i, material, part: 'flanges',
    }))
  }

  // the ram crowning the handle's upper bend: seated on the handle tube itself (see handleHead)
  const heads = [handleHead(kit, { q, material })]
  return { flanges, heads }
}

// ------------------------------------------------------------------ the handle's ram head
//
// Shang handles (gui, you, zun) carry their beast head ON the handle, crowning the bend where it
// leaves the vessel: the face looks outward and up, the strap issues from under its jaw and runs
// on as the beast's body. Here the head is a purpose-made signed-distance sculpture in a frame
// read off the handle tube (form.js: u round, ½ = the outer back; v along from the upper root):
//   t along the handle centre-line, away from the wall · n the outer normal (up, on the top run) ·
//   b across the strap. Origin: the strap's top meridian at arc HEAD_AT.
// A sleeve hugs the strap 1.8 mm proud and is cut back to the wall (it sinks ≤ 1.8 mm into it),
// so head, strap and wall read as one casting; the jaw rests ON the strap top, so nothing hangs
// into the loop; the horns curl back along the sides toward the wall, outside the rim bead.

/** arc (mm along the handle from its upper root) of the head's origin, and where its jaw ends on the strap */
export const HEAD_AT = 6.0
/** arc where the sleeve under the jaw ends: the strap (and its back band) issue from here */
export const HEAD_SLEEVE_END = HEAD_AT + 12.5

const sdEll = (x, y, z, rx, ry, rz) => {
  const k0 = Math.hypot(x / rx, y / ry, z / rz), k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
/** round cone a → b, radii ra → rb (iq) */
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const l2 = bx * bx + by * by + bz * bz, rr = ra - rb, a2 = l2 - rr * rr, il2 = 1 / l2
  const ax = px - a[0], ay = py - a[1], az = pz - a[2]
  const y = ax * bx + ay * by + az * bz, z = y - l2
  const xx = Math.hypot(ax * l2 - bx * y, ay * l2 - by * y, az * l2 - bz * y)
  const x2 = xx * xx, y2 = y * y * l2, z2 = z * z * l2, k = Math.sign(rr) * rr * rr * x2
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - ra
}
const sdTube = (x, y, z, K) => { let d = Infinity; for (let i = 0; i < K.length - 1; i++) d = Math.min(d, sdCone(x, y, z, K[i], K[i + 1], K[i][3], K[i + 1][3])); return d }
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25 }
const smax = (a, b, k) => -smin(-a, -b, k)

/** the body's outer radius at height y (mm) up to the rim bead's outer edge; above it the bead's own radius */
const WALL_R = (() => {
  const ys = [], rs = []
  for (let a = ARC.belly[0]; a <= ARC.rim[0] + 1e-6; a += 0.5) { const m = BODY.at(a); ys.push(m.y); rs.push(m.r) }
  return (y) => {
    if (y >= ys[ys.length - 1]) return rs[rs.length - 1]
    if (y <= ys[0]) return rs[0]
    let i = 1
    while (ys[i] < y) i++
    const f = (y - ys[i - 1]) / (ys[i] - ys[i - 1])
    return rs[i - 1] + (rs[i] - rs[i - 1]) * f
  }
})()

/** the frame on the handle at arc `at`: origin on the top meridian, T along, N outer normal, B across */
export function handleFrame(at = HEAD_AT) {
  const v = at / HANDLE.length, h = 0.5 / HANDLE.length
  const O = HANDLE.point(0.5, v, [0, 0, 0])
  const a = HANDLE.point(0.5, v + h, [0, 0, 0]), b = HANDLE.point(0.5, v - h, [0, 0, 0])
  const T = new THREE.Vector3(a[0] - b[0], a[1] - b[1], a[2] - b[2]).normalize()
  const n = HANDLE.surface.normal(0.5, v, [0, 0, 0])
  const N = new THREE.Vector3(...n).addScaledVector(T, -T.dot(new THREE.Vector3(...n))).normalize()
  const B = new THREE.Vector3().crossVectors(T, N).normalize()
  // the strap's half-depth (outer back → inner face) and half-width at the head
  const inn = HANDLE.point(0, v, [0, 0, 0]), side = HANDLE.point(0.25, v, [0, 0, 0])
  const depth = Math.hypot(O[0] - inn[0], O[1] - inn[1], O[2] - inn[2]) / 2
  const mid = [(O[0] + inn[0]) / 2, (O[1] + inn[1]) / 2, (O[2] + inn[2]) / 2]
  const half = Math.hypot(side[0] - mid[0], side[1] - mid[1], side[2] - mid[2])
  return { O: new THREE.Vector3(...O), T, N, B, depth, half }
}

/** the head's field in VESSEL mm (so the mesher's normals and winding are the world's) */
export function handleHeadSDF({ at = HEAD_AT } = {}) {
  const F = handleFrame(at)
  const hd = F.depth, hw = F.half // ≈ 4.2, 8.4
  // local design, mm: t out along the handle, n up off the strap top, b across (symmetric)
  const k = 1.6
  const muzA = [6.2, 5.6, 0], muzB = [13.4, 3.4, 0]
  const eye = [8.5, 7.7, 5.0], eyeR = 2.15
  // ram horns (right side; mirrored): root on the crown, back over the temple, down behind the
  // cheek and forward under the eye, the tip rolling in — a thick coil lying flat on a boss on the
  // side of the head (so it reads as a solid coiled horn, not a loop)
  const horn = [
    [4.0, 10.2, 4.6, 2.7], [1.6, 11.6, 6.6, 2.8], [-1.8, 11.0, 7.9, 2.6], [-3.6, 8.4, 8.5, 2.3], [-3.4, 5.0, 8.7, 2.0],
    [-1.2, 3.2, 8.8, 1.8], [1.6, 3.6, 8.7, 1.6], [2.8, 5.6, 8.5, 1.4], [1.6, 7.4, 8.3, 1.2],
  ]
  const hornBoss = [-0.4, 7.2, 7.9]
  const local = (t, n, b) => {
    const ab = Math.abs(b)
    // sleeve round the strap (strap centre at n = −hd), 1.8 mm proud (over the back band's 1.5 mm),
    // its front end rounded off under the jaw
    let d = sdEll(0, n + hd, ab, 1, hd + 1.8, hw + 1.8) // section ellipse (t ignored: a cylinder)
    d = smax(d, t - (HEAD_SLEEVE_END - HEAD_AT), 2.4)
    // cranium: broad, low, lying on the strap
    d = smin(d, sdEll(t - 2.6, n - 5.4, ab, 7.0, 5.9, 7.6), k * 1.6)
    // forehead plate facing out and up
    d = smin(d, sdEll(t - 6.4, n - 7.4, ab, 3.6, 3.6, 6.2), k)
    // snout out and a little down; muzzle pad resting on the strap top; jaw into the sleeve
    d = smin(d, sdCone(t, n, ab, muzA, muzB, 4.6, 3.3), k)
    d = smin(d, sdEll(t - 14.2, n - 3.0, ab, 3.2, 2.9, 4.3), k * 0.8)
    d = smin(d, sdEll(t - 10.5, n - 1.2, ab, 6.0, 1.8, 5.6), k)
    // mouth: a groove across the muzzle front, just above the strap — the strap issues from it
    d = smax(d, -sdEll(t - 17.2, n - 1.55, ab, 2.6, 0.5, 3.6), 0.5)
    // nostrils
    d = smax(d, -sdEll(t - 17.0, n - 4.0, ab - 1.6, 0.9, 0.75, 0.75), 0.4)
    // brow ridges, one soft arch over each eye, meeting over the nose
    d = smin(d, sdTube(t, n, ab, [[eye[0] - 1.6, eye[1] + 2.0, 6.6, 1.0], [eye[0] + 0.2, eye[1] + 2.5, eye[2], 1.25], [eye[0] + 1.0, eye[1] + 2.0, 1.6, 1.1], [eye[0] + 1.1, eye[1] + 1.8, 0, 1.0]]), 1.4)
    // eyes: bulging, looking out-and-sideways, with a sunk pupil
    {
      const ex = t - eye[0], ey = n - eye[1], ez = ab - eye[2]
      d = smin(d, sdEll(ex, ey, ez, eyeR * 1.15, eyeR * 0.9, eyeR), 0.7)
      d = smax(d, -sdEll(ex - eyeR * 0.75, ey, ez - eyeR * 0.55, eyeR * 0.42, eyeR * 0.4, eyeR * 0.42), 0.3)
    }
    // horns: the coil on its boss
    d = smin(d, sdEll(t - hornBoss[0], n - hornBoss[1], ab - hornBoss[2], 3.4, 3.4, 1.9), 1.2)
    d = smin(d, sdTube(t, n, ab, horn), 1.0)
    return d
  }
  // keep it out of the body: cut 1.8 mm into the wall at most (never through to the inside)
  const p = new THREE.Vector3()
  const sd = (x, y, z) => {
    p.set(x - F.O.x, y - F.O.y, z - F.O.z)
    let d = local(p.dot(F.T), p.dot(F.N), p.dot(F.B))
    const r = Math.hypot(x, z)
    d = Math.max(d, WALL_R(y) - 1.8 - r)
    return d
  }
  // bounds: the local design box (t −8 … 20, n −2hd−3 … 15, b ±13) in vessel space, + margin
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (const t of [-8, 20]) for (const n of [-2 * hd - 3, 15]) for (const b of [-13, 13]) {
    const w = F.O.clone().addScaledVector(F.T, t).addScaledVector(F.N, n).addScaledVector(F.B, b)
    for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], w.getComponent(i) - 1.5); max[i] = Math.max(max[i], w.getComponent(i) + 1.5) }
  }
  return { bounds: { min, max }, sd, frame: F, local }
}

/** the head as a Mesh in vessel coordinates */
export function handleHead(kit, { q = 1, material } = {}) {
  const geo = kit.meshSDF(handleHeadSDF(), { voxel: 0.4 / Math.sqrt(q) })
  const mesh = new THREE.Mesh(geo, material)
  mesh.name = 'handle-head'
  mesh.userData.part = 'heads'
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}
