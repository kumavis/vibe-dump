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
  return { sd, bounds: { min: [30, 96, -14.5], max: [70, 154, 14.5] } } // ≥ 3 mm of air round the head's horns (jue-fix)
}

/** the head on the loop's top (jue-fix, photo-02 crop 'handle' enlarged): a RAM's face looking outward over the loop's
 *  top outer corner — a compact rounded skull ≈ 11.6 mm across (the strap is 11), sitting ≈ 4 mm proud of the strap's
 *  top; ram's horns coiling down each side (≈ 19 mm over the coils); a low flat pad on the poll between their roots
 *  (the flat oval "plate" the photograph shows on top); a forehead, small brows over two domed eyes in sockets and a
 *  long snout running down over the strap's outer corner, ≈ 3 mm proud of it, with nostril pits and a mouth groove. Frame: x = ρ (out), y up, z across the strap. */
// (photo-02 vs the side render: the head's mass sits ≈ 2 mm further in over the top arm and its poll ≈ 1.5 mm higher
// than a first try; the face — brow, eyes, muzzle — stays on the loop's outer corner)
const HEAD = {
  skull: [42.0, 141.3, 0], skullR: [5.6, 5.0, 5.8],
  poll: [40.9, 146.9, 0], pollR: [4.0, 1.3, 4.6],
  // each horn coils round an axis turned 45° forward of the side (so the coil reads from the front and from the
  // photograph's three-quarter station): up over the poll → back → down → forward beside the eye, shrinking
  horn: { c: [43.2, 141.6, 5.2], axis: [0.7, 0, 0.714], r0: 3.7, r1: 1.2, t0: 2.0, t1: 0.75, a1: 300, adv: 1.4, n: 22 },
  // the face: a forehead running down into a long snout that stands proud of the strap's outer corner
  brow: [[48.9, 142.9, 2.2], [48.0, 142.5, 4.9]], browR: 0.85,
  forehead: [47.4, 142.4, 0], foreheadR: [2.6, 3.2, 4.2],
  eye: [48.5, 141.0, 3.6], eyeR: 1.15, socket: [1.6, 0.36],
  snout: [50.7, 137.6, 0], snoutR: [2.4, 4.0, 3.1],
  nose: [51.6, 134.4, 0], noseR: [2.0, 2.0, 2.8],
  nostril: [53.4, 134.6, 1.2], nostrilR: 0.55,
}
// the horns as chains of capsules along a shrinking coil (authored on the +z side, mirrored to −z)
const HORNS = (() => {
  const H = HEAD.horn, ax = H.axis
  const e2 = [-ax[2], 0, ax[0]] // in the coil plane, horizontal: back (−x) and a little out
  const pts = []
  for (let i = 0; i <= H.n; i++) {
    const s = i / H.n, a = H.a1 * s * DEG
    const r = H.r0 + (H.r1 - H.r0) * s, k = H.adv * s
    pts.push([H.c[0] + r * Math.sin(a) * e2[0] + k * ax[0], H.c[1] + r * Math.cos(a), H.c[2] + r * Math.sin(a) * e2[2] + k * ax[2], H.t0 + (H.t1 - H.t0) * s])
  }
  return [pts, pts.map(([x, y, z, t]) => [x, y, -z, t])]
})()
function sdCapsule(px, py, pz, a, b, ra, rb) {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2]
  const pax = px - a[0], pay = py - a[1], paz = pz - a[2]
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)))
  return len3(pax - bax * h, pay - bay * h, paz - baz * h) - (ra + (rb - ra) * h)
}
function sdEllipsoid(x, y, z, r) {
  // the usual bound-corrected ellipsoid distance (iq)
  const k0 = len3(x / r[0], y / r[1], z / r[2]), k1 = len3(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2]))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(r[0], r[1], r[2])
}
function head(x, y, z) {
  const H = HEAD
  // cheap reject: the head lives in x 34…57, y 129…150, |z| < 11.5 (a lower bound of the distance outside it)
  const far = Math.max(34 - x, x - 57, 129 - y, y - 150, Math.abs(z) - 11.5)
  if (far > 2) return far
  let d = sdEllipsoid(x - H.skull[0], y - H.skull[1], z - H.skull[2], H.skullR)
  d = smin(d, sdEllipsoid(x - H.poll[0], y - H.poll[1], z - H.poll[2], H.pollR), 1.2)
  d = smin(d, sdEllipsoid(x - H.forehead[0], y - H.forehead[1], z, H.foreheadR), 1.4)
  d = smin(d, sdEllipsoid(x - H.snout[0], y - H.snout[1], z, H.snoutR), 1.3)
  d = smin(d, sdEllipsoid(x - H.nose[0], y - H.nose[1], z, H.noseR), 0.9)
  for (const P of HORNS) {
    let hd = 1e9
    for (let i = 0; i < P.length - 1; i++) hd = Math.min(hd, sdCapsule(x, y, z, P[i], P[i + 1], P[i][3], P[i + 1][3]))
    d = smin(d, hd, 0.7)
  }
  for (const s of [-1, 1]) {
    // the eye: a sunk ring (socket) round a domed ball; the brow over it added after, so the socket never nicks it
    const ex = x - H.eye[0], ey = y - H.eye[1], ez = z - s * H.eye[2]
    const ring = len2(len2(ey, ez) - H.socket[0], ex) - H.socket[1]
    d = smax(d, -ring, 0.3)
    d = smin(d, len3(ex, ey, ez) - H.eyeR, 0.3)
    const [b0, b1] = H.brow
    d = smin(d, sdCapsule(x, y, z, [b0[0], b0[1], s * b0[2]], [b1[0], b1[1], s * b1[2]], H.browR, H.browR * 0.75), 0.6)
    d = smax(d, -(len3(x - H.nostril[0], y - H.nostril[1], z - s * H.nostril[2]) - H.nostrilR), 0.3)
  }
  // the mouth: a short groove across under the nose
  d = smax(d, -sdCapsule(x, y, z, [53.0, 132.7, -1.8], [53.0, 132.7, 1.8], 0.35, 0.35), 0.25)
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

/** The post (stem + cap) in its own frame: axis on y, x/z = 0, heights absolute; geometry shared by both posts.
 *  whorl: ReliefMap for the cap's dome. */
const _postGeo = new Map()
function postGeometry(kit, { q, whorl, base }) {
  const key = q + '|' + base + '|' + (whorl ? whorl.uuid || 'w' : '-')
  if (_postGeo.has(key)) return _postGeo.get(key)
  const seg = Math.max(16, Math.round(32 * Math.sqrt(q)))
  // stem with a slight foot swelling where it grows out of the rim; it runs up inside the cap
  const stemPts = [[0, base], [POST.stemR + 0.9, base], [POST.stemR + 0.7, base + 2.5], [POST.stemR + 0.2, base + 7], [POST.stemR, base + 12], [POST.stemR, POST.capY - 1.0], [POST.stemR - 0.4, POST.capY + 1], [0, POST.capY + 1]]
  const stem = new THREE.LatheGeometry(stemPts.map(([r, y]) => new THREE.Vector2(r, y)), seg)
  // cap: revolved profile; its dome carries the whorl panel (polar mapping)
  const P = POST.cap
  const cum = [0]
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
  const capProfile = (t) => {
    const s = t * cum[cum.length - 1]
    let j = 0
    while (j < P.length - 2 && cum[j + 1] < s) j++
    const f = Math.min(1, Math.max(0, (s - cum[j]) / (cum[j + 1] - cum[j])))
    return [P[j][0] + (P[j + 1][0] - P[j][0]) * f, P[j][1] + (P[j + 1][1] - P[j][1]) * f]
  }
  const Rmax = 12.8 // half the whorl panel (relief.js WHORL.S / 2)
  // u runs CCW round +Y (th = 2π u, (sin, cos)): left → right seen from outside; v up the profile → normals out
  const cap = kit.buildSurface({
    surface: (u, v, o) => {
      const th = u * Math.PI * 2
      const [r, y] = capProfile(v)
      o.pos.set(r * Math.sin(th), POST.capY + y, r * Math.cos(th))
    },
    segments: [seg * 2, Math.round(60 * Math.sqrt(q))],
    relief: whorl || null,
    panelMap: (u, v, o) => {
      const th = u * Math.PI * 2
      const [r, y] = capProfile(v)
      // plan position over the cap → panel (square, Rmax·2 mm); only the dome (y above the rolled edge)
      o[0] = 0.5 + (r * Math.sin(th)) / (2 * Rmax)
      o[1] = 0.5 + (r * Math.cos(th)) / (2 * Rmax)
      o[2] = y > 1.1 && r < 11.6 && r > 3.6 ? 1 : 0
    },
    fade: 0,
  })
  cap.computeVertexNormals()
  const out = { stem, cap }
  _postGeo.set(key, out)
  return out
}

/** One post at azimuth az: the shared post geometry, stood on the rim and turned to face out along az. */
export function buildPost(kit, { az, q = 1, material, capMaterial, whorl }) {
  const g = new THREE.Group()
  g.name = 'post'; g.userData.part = 'posts'
  // the stem stands ON the lip, its axis 2.4 mm in from the rim's outer edge, its swollen foot sunk 1.2 mm into the lip top (jue-fix: it
  // hung 4 mm below the rim, a cut-off column end visible inside the cup); rimPlan / rimHeight are mirror-symmetric
  // about the spout axis, so both posts get the same base
  const rho = rimPlan(az) - 2.4
  const base = Math.round((rimHeight(az, rho + 2.4) - 1.2) * 1000) / 1000
  const geo = postGeometry(kit, { q, whorl, base })
  for (const [name, gg, mat] of [['stem', geo.stem, material], ['cap', geo.cap, whorl ? capMaterial : material]]) {
    const m = new THREE.Mesh(gg, mat)
    m.name = name; m.userData.part = 'posts'; m.castShadow = m.receiveShadow = true
    g.add(m)
  }
  g.position.set(Math.sin(az * DEG) * rho, 0, Math.cos(az * DEG) * rho)
  g.rotation.y = az * DEG
  return g
}
