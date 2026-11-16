// nezu-fanghu — the cast sculpture: the two animal-head handles on the narrow ±X sides of the neck, each holding a
// free-hanging ring (true geometry: a torus threaded through the loop of the curled-down snout), and the pyramidal
// studs where the straps cross (diamonds) and where the vertical straps start under the shoulder band (triangles).
// Signed distance fields in a LOCAL frame (u outward from the side face, y up, w along the face), meshed with
// kit.meshSDF and placed on ±X. Read off photo-08 (both heads in profile at the silhouette) and photo-09 (+X head
// three-quarter, its ring seen at ≈ 45°).

import * as THREE from 'three'
import { bodyW, RHO, halfQ, surfacePoint } from './form.js'

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
/** a tube through [u, y, w, r] knots */
function sdTube(x, y, z, knots) {
  let d = Infinity
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    const px = x - a[0], py = y - a[1], pz = z - a[2]
    const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
    const h = clamp((px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz), 0, 1)
    d = Math.min(d, len3(px - bx * h, py - by * h, pz - bz * h) - (a[3] + (b[3] - a[3]) * h))
  }
  return d
}

/** the +X side wall at height y (x of the flat side face) */
const sideX = (y) => bodyW(clamp(y, 13, 419))

/**
 * The +X handle head, in VESSEL mm (the −X one is its mirror). photo-08: the head stands out ≈ 37 mm from the neck
 * between y ≈ 322 and 362; ears / horns lie back and up toward the wall, a round eye, a long snout that curls down
 * and back to the wall in a closed loop; the ring hangs through that loop (photo-09).
 */
export function handleSDF() {
  // photo-08: the head is larger than first drawn (≈ 40 mm out, ears to y ≈ 368): the design below is scaled by S
  // about its root on the wall (u 0, y 340)
  const S = 1.22
  const sd0 = (u, y, z) => {
    // root block on the wall
    let d = sdRBox3(u - 3, y - 349, z, 7, 11, 10.5, 4)
    // skull: a long rounded wedge leaning out
    d = smin(d, sdEllipsoid(u - 15, y - 350, z, 13, 9.5, 9.5), 4)
    // brow ridge
    d = smin(d, sdTube(u, y, z, [[10, 356, 0, 6.5], [22, 355, 0, 5.5]]), 3)
    // snout: forward, then down and back to the wall: a closed loop (the ring passes through it)
    d = smin(d, sdTube(u, y, z, [[24, 352, 0, 6.6], [32, 347, 0, 6.0], [35.5, 339, 0, 5.2], [33, 330.5, 0, 4.6], [25, 325.5, 0, 4.3], [14, 325.5, 0, 4.2], [4, 328, 0, 4.6]]), 3)
    // nostrils / mouth notch at the snout's turn
    d = smax(d, -(len3(u - 37.5, y - 343, z) - 2.2), 0.8)
    for (const sg of [-1, 1]) {
      // ears / horns: lying back and up toward the wall
      d = smin(d, sdTube(u, y, z, [[13, 357, sg * 6.5, 4.6], [8, 363.5, sg * 8.5, 3.6], [2, 366, sg * 8, 2.4], [-1, 365, sg * 7, 1.6]]), 2.2)
      // eyes: round bosses on the skull's flanks
      d = smin(d, len3(u - 22, y - 350.5, z - sg * 7.6) - 2.6, 1.2)
      d = smax(d, -(len3(u - 22.3, y - 350.5, z - sg * 10.0) - 0.9), 0.3)
    }
    return d
  }
  const sd = (x, y, z) => {
    const u = x - sideX(y)
    const d = S * sd0(u / S, 340 + (y - 340) / S, z / S)
    return smax(d, -(u + 4), 1) // it sits on the wall
  }
  const x0 = 70
  return { sd, bounds: { min: [x0, 310, -20], max: [x0 + 60, 377, 20] } }
}

/** the hanging ring of the +X handle: plane ∥ the side face, threaded through the snout loop, resting on the belly */
export function ringFrame() {
  const R = 37.5, r = 2.8
  const top = new THREE.Vector3(sideX(330) + 25, 333, 0) // over the scaled snout bar (top ≈ 327.5), inside the loop
  // let it hang until its bottom touches the belly: tilt about the hanging point (Z axis)
  let tilt = 0
  for (let i = 0; i < 40; i++) {
    const by = top.y - 2 * R * Math.cos(tilt), bx = top.x + 2 * R * Math.sin(tilt)
    if (bx - r > sideX(by) + 0.6) break
    tilt += 0.005
  }
  return { R, r, top, tilt }
}

export function ringMesh(material, { segments = [96, 18] } = {}) {
  const { R, r, top, tilt } = ringFrame()
  const g = new THREE.TorusGeometry(R, r, segments[1], segments[0])
  g.rotateY(Math.PI / 2) // the ring's plane → the YZ plane (∥ the side face)
  const m = new THREE.Mesh(g, material)
  // centre below the hanging point, rotated by tilt about Z (bottom swings outward)
  m.position.set(top.x + R * Math.sin(tilt), top.y - R * Math.cos(tilt), 0)
  m.rotation.z = tilt
  m.castShadow = m.receiveShadow = true
  return m
}

/**
 * A pyramidal stud on side k: `kind` 'diamond' (4 faces, a lozenge base, at a strap crossing) or 'triangle' (3 faces:
 * a level top facet, two flanks running down to the apex on the wall — the start of a vertical strap).
 * Base points sit 1 mm into the wall; the apex stands `height` out along the wall normal. Returns a BufferGeometry.
 */
export function studGeometry(k, kind, { cy, w, h, height, top = 0 }) {
  const Qf = halfQ(0), Qk = halfQ(k)
  const sx = (y) => Qk(y) / Qf(y)
  const P = (s, y, out = -1) => {
    const { p, n } = surfacePoint(k, s * sx(y), y)
    return p.addScaledVector(n, out)
  }
  const tris = []
  if (kind === 'diamond') {
    const c = surfacePoint(k, 0, cy)
    const apex = c.p.clone().addScaledVector(c.n, height)
    const ring = [P(0, cy + h / 2), P(w / 2, cy), P(0, cy - h / 2), P(-w / 2, cy)]
    // densify each base edge so the base follows the wall
    for (let i = 0; i < 4; i++) {
      const a = ring[i], b = ring[(i + 1) % 4]
      tris.push([apex, b, a])
    }
    tris.push([ring[0], ring[1], ring[2]], [ring[0], ring[2], ring[3]]) // underside (hidden)
  } else {
    // base: top edge at y = top (cy is the apex on the wall), outer apex at the top edge's middle, `height` out
    const A = P(-w / 2, top), B = P(w / 2, top), C = P(0, cy)
    const m = surfacePoint(k, 0, top - 0.8)
    const D = m.p.clone().addScaledVector(m.n, height)
    tris.push([A, B, D], [A, D, C], [B, C, D], [A, C, B])
  }
  // wind every facet outward (away from a point inside the solid)
  const all = tris.flat()
  const inside = all.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / all.length)
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), nn = new THREE.Vector3(), cc = new THREE.Vector3()
  const pos = []
  for (let [a, b, c] of tris) {
    nn.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a))
    cc.copy(a).add(b).add(c).multiplyScalar(1 / 3).sub(inside)
    if (nn.dot(cc) < 0) [b, c] = [c, b]
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

export { RHO }
