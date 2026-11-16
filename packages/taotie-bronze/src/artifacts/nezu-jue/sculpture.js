// Nezu jue — cast sculpture: the loop handle with its animal head (SDF → kit.meshSDF) and the posts.
// The handle is built in its own plane: x = ρ (distance from the vessel axis along θ 90), y = height, z = across
// the strap (+z = toward the spout). The caller rotates it to θ 90 (which IS +X, so the rotation is the identity
// apart from z → −z handedness: x = ρ, z_world = −z).

import * as THREE from 'three'
import { HANDLE_PATH, POST, AZ, DEG, rimPlan, rimHeight } from './form.js'

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25 }
const smax = (a, b, k) => -smin(-a, -b, k)
function sdRBox2(x, y, bx, by, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r
  return len2(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
function densify(pts, step) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
    const n = Math.max(1, Math.ceil(len2(bx - ax, by - ay) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n])
  }
  return out
}
function polyQuery(path, cum, x, y) {
  let best = 1e9, ba = 0, bs = 1
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay] = path[i], [bx, by] = path[i + 1]
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / L2))
    const cx = ax + dx * t, cy = ay + dy * t
    const d = len2(x - cx, y - cy)
    if (d < best) {
      best = d
      const L = Math.sqrt(L2)
      ba = cum[i] + L * t
      bs = (x - cx) * (-dy / L) + (y - cy) * (dx / L) >= 0 ? 1 : -1
    }
  }
  return { d: best, a: ba, side: bs }
}

const PATH = densify(HANDLE_PATH, 1.2)
const STRAP = { half: 2.5, halfZ: 5.5, r: 2.2 } // a rounded strap ≈ 11 × 5 mm (fix pass r8: rounder section)

export function handleSDF() {
  const cum = [0]
  for (let i = 1; i < PATH.length; i++) cum.push(cum[i - 1] + len2(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]))
  const sd = (x, y, z) => {
    const q = polyQuery(PATH, cum, x, y)
    // the strap: flat outer face, thickness swelling a little toward the bottom end
    let d = sdRBox2(q.d, z, STRAP.half + (q.side < 0 ? 0 : 0), STRAP.halfZ, STRAP.r)
    // (fix pass r8: no sunk line down the face: the photograph's strap is plain)
    d = smin(d, head(x, y, z), 1.4)
    return d
  }
  return { sd, bounds: { min: [30, 96, -12], max: [70, 154, 12] } }
}

/** the head on the loop's top (fix pass r8, photo-02 crop 'handle'): a small rounded block no wider than the strap's
 *  shoulders, a FLAT plate laid across its top with two stubby horns standing on it, small eye bulges and a short snout
 *  turned down onto the strap — not a face block */
function head(x, y, z) {
  let d = sdRBox3(x - 43.2, y - 141.4, z, 3.8, 3.4, 5.6, 2.6)
  d = smin(d, sdRBox3(x - 46.2, y - 138.6, z, 1.6, 2.0, 3.0, 1.3), 1.2)
  d = smin(d, sdRBox3(x - 43.0, y - 145.2, z, 3.9, 0.8, 4.8, 0.7), 0.7)
  for (const s of [-1, 1]) {
    d = smin(d, sdRBox3(x - 43.2, y - 146.6, z - s * 2.6, 1.5, 1.0, 1.5, 0.9), 0.5)
    d = smin(d, len3(x - 46.6, y - 141.9, z - s * 2.5) - 1.05, 0.4)
  }
  return d
}

export function buildHandle(kit, { q = 1, material }) {
  const geo = kit.meshSDF(handleSDF(), { voxel: Math.max(0.3, 0.4 / Math.sqrt(q)) })
  // handle plane → world at θ 90: x = ρ along +X, z_world = −z (+z was toward the spout, which is +Z… keep it)
  geo.applyMatrix4(new THREE.Matrix4().makeRotationY((AZ.handle - 90) * DEG))
  geo.computeVertexNormals(); geo.computeBoundingBox(); geo.computeBoundingSphere()
  const m = new THREE.Mesh(geo, material)
  m.name = 'handle'; m.userData.part = 'handles'; m.castShadow = m.receiveShadow = true
  return m
}

/** One post at azimuth az: a round stem from inside the rim and an umbrella cap. whorl: ReliefMap for the cap top. */
export function buildPost(kit, { az, q = 1, material, capMaterial, whorl }) {
  const g = new THREE.Group()
  g.name = 'post'; g.userData.part = 'posts'
  // the stem stands on the lip, set a little inside it (its foot swells into the rim)
  const rho = rimPlan(az) - 3.2
  const base = rimHeight(az, rho + 3.2) - 2.6
  const c = new THREE.Vector3(Math.sin(az * DEG) * rho, 0, Math.cos(az * DEG) * rho)
  const seg = Math.max(16, Math.round(32 * Math.sqrt(q)))
  // stem with a slight foot swelling where it grows out of the rim
  const stemPts = [[0, base - 1.5], [POST.stemR + 0.9, base - 1.5], [POST.stemR + 0.7, base + 2.5], [POST.stemR + 0.2, base + 7], [POST.stemR, base + 12], [POST.stemR - 0.2, POST.capY + 1], [0, POST.capY + 1]]
  const stem = new THREE.Mesh(new THREE.LatheGeometry(stemPts.map(([r, y]) => new THREE.Vector2(r, y)), seg), material)
  stem.position.copy(c); stem.userData.part = 'posts'; stem.castShadow = stem.receiveShadow = true
  g.add(stem)
  // cap: revolved profile; its sloping top carries the whorl panel (polar mapping)
  const P = POST.cap.map(([r, y]) => [r, y])
  const capProfile = (t) => {
    // t 0..1 along P by arc length
    const cum = [0]
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
    const s = t * cum[cum.length - 1]
    let j = 0
    while (j < P.length - 2 && cum[j + 1] < s) j++
    const f = Math.min(1, Math.max(0, (s - cum[j]) / (cum[j + 1] - cum[j])))
    return [P[j][0] + (P[j + 1][0] - P[j][0]) * f, P[j][1] + (P[j + 1][1] - P[j][1]) * f]
  }
  const Rmax = 12.8 // half the whorl panel (relief.js WHORL.S / 2)
  const geo = kit.buildSurface({
    surface: (u, v, o) => {
      const th = u * Math.PI * 2
      const [r, y] = capProfile(v)
      o.pos.set(c.x + r * Math.sin(th), POST.capY + y, c.z + r * Math.cos(th))
    },
    segments: [seg * 2, Math.round(60 * Math.sqrt(q))],
    relief: whorl || null,
    panelMap: (u, v, o) => {
      const th = u * Math.PI * 2
      const [r, y] = capProfile(v)
      // plan position over the cap → panel (square, Rmax·2 mm); only the sloping top (y above the rim edge)
      o[0] = 0.5 + (r * Math.sin(th)) / (2 * Rmax)
      o[1] = 0.5 + (r * Math.cos(th)) / (2 * Rmax)
      o[2] = y > 1.1 && r < 11.6 && r > 3.6 ? 1 : 0
    },
    fade: 0,
  })
  geo.computeVertexNormals()
  const cap = new THREE.Mesh(geo, whorl ? capMaterial : material)
  cap.name = 'cap'; cap.userData.part = 'posts'; cap.castShadow = cap.receiveShadow = true
  g.add(cap)
  return g
}
