// Nezu hu — the two sculpted handles (photo-11: both seen exactly in profile on the silhouette, ±90°).
// A signed distance field meshed with kit.meshSDF, built in the HANDLE PLANE: x = distance from the vessel axis
// along the handle's azimuth (mm), y = height (mm), z = across the handle. The caller turns it to θ = ±90°.
//
// Read off photo-11 on a grid in handle-plane mm (.work/r8-hu/hgrid.py; crops detail-handle / -left): a feline
// dragon climbing the shoulder. A thick ring (the neck rolling over) round a round opening, its left side against the
// vessel's neck; the head on its right, flat-faced, looking out, the snout down, a pair of bottle horns side by side
// on the crown; the body from under the head down and out to a round haunch, the hind leg dropping to the hock and
// the foot lying along the shoulder (hu-fix; it was read before as a squared tail loop with a hole), the tail rolled
// tight at the rump. Thickness across (z) is NOT visible (both are seen edge-on): 12 mm assumed, the head 16 mm.
// Incised décor on the sides is reduced to a groove round the opening, ladder rings behind the head, ribs across body
// and foreleg, spirals on the chest volute and the hip, a contour line and a curled toe on the foot.

const len2 = (x, y) => Math.sqrt(x * x + y * y)
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)
function sdRBox2(x, y, bx, by, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r
  return len2(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
function sdRBox3(x, y, z, bx, by, bz, r) {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
function sdCone(px, py, pz, a, b, ra, rb) {
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const qx = px - a[0], qy = py - a[1], qz = pz - a[2]
  const h = Math.min(1, Math.max(0, (qx * bx + qy * by + qz * bz) / (bx * bx + by * by + bz * bz)))
  return len3(qx - bx * h, qy - by * h, qz - bz * h) - (ra + (rb - ra) * h)
}
function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
function densify(pts, step = 1.5) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i]
    const n = Math.max(1, Math.ceil(len2(bx - ax, by - ay) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n])
  }
  return out
}
/** chaikin-smoothed polyline (a few passes), ends kept */
function smooth(pts, passes = 3) {
  let p = pts
  for (let k = 0; k < passes; k++) {
    const o = [p[0]]
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx, by] = p[i + 1]
      o.push([0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by], [0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by])
    }
    o.push(p[p.length - 1])
    p = o
  }
  return densify(p, 1.2)
}
/** nearest point on a polyline: d, arc a, t (0..1 along), and the local half-width interpolated from `hw` */
function query(path, x, y) {
  let best = 1e9, bi = 0, bt = 0
  for (let i = 0; i < path.pts.length - 1; i++) {
    const [ax, ay] = path.pts[i], [bx, by] = path.pts[i + 1]
    const dx = bx - ax, dy = by - ay
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
    const d = len2(x - ax - dx * t, y - ay - dy * t)
    if (d < best) { best = d; bi = i; bt = t }
  }
  const a = path.cum[bi] + (path.cum[bi + 1] - path.cum[bi]) * bt
  return { d: best, f: a / path.total, a }
}
function makePath(ctrl, hw) {
  const pts = smooth(ctrl)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + len2(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
  return { pts, cum, total: cum[cum.length - 1], hw, box }
}
const FAR = { d: 1e9, f: -1, a: 0 }
/** a limb along a path: rounded-rect section, half-width in the plane hw(f) (mm), half-thickness across hz */
function limb(path, x, y, z, hz, r = 3.5) {
  // far from the path's box: a cheap lower bound (keeps the sign; the mesher's coarse pass skips these cells)
  const bx = Math.max(path.box[0] - x, 0, x - path.box[2]), by = Math.max(path.box[1] - y, 0, y - path.box[3])
  const db = len2(bx, by)
  if (db > 14) return { d: Math.max(db - 12, Math.abs(z) - hz), q: FAR, hw: 0 }
  const q = query(path, x, y)
  const hw = typeof path.hw === 'function' ? path.hw(q.f) : path.hw
  return { d: sdRBox2(q.d, z, hw, hz, Math.min(r, hw * 0.9, hz * 0.9)), q, hw }
}

// Re-read (r8 fix pass) off photo-11 on a 5 mm grid in handle-plane mm (.work/r8-hu-fix/hgrid.py: right handle,
// x = (px − axis)/3.56, y = (1680.8 − py)/3.525; the left one mirrors it). A feline dragon in an S: its NECK is a
// thick arch (≈ 14–17 mm) rising off the vessel's neck (x ≈ 91, y 290–325) over a big open loop (x 109–125,
// y 304–323; Ø ≈ 16 × 19, its lower right running out to a point under the chin) to the HEAD on the right
// (x 125–139, y 305–337: flat face looking out, snout down, round eyes, ribbed brow behind, a PAIR of bottle horns
// side by side on the crown to y ≈ 343, hu-fix); under the chin a short neck drops to a C-VOLUTE at the shoulder (124, 293); from there a
// FORELEG strap (≈ 8 mm, ribbed across) runs down-left to a squared paw on the vessel's shoulder (112, 273) and the
// BODY strap (≈ 9 mm, ribbed across) runs down-right. [hu-fix: the r8 "tail volute + squared tail loop with a hole"
// below it is superseded — it is the haunch, hind leg and foot, see LOWER BODY below.] Thickness across (z) is NOT visible (both handles are seen edge-on):
// assumed ≈ 13 mm for the arch, 16 mm for the head, 10–11 mm for the straps, all with rounded sections.
const ARCH = { c: [110, 314.5], rx: 20.5, ry: 24.5, hole: [116.6, 312.6], hrx: 8.0, hry: 9.9 }
// the arch as a fat TUBE round the loop (photo: shaded round across its whole width, not a flat slab):
// centre line from the shoulder volute round the loop's left and top into the back of the head
const ARCHP = makePath([[121.5, 296.2], [110, 296.4], [101.4, 300.5], [99.4, 312], [101.6, 323], [108, 329.8], [116, 331.2], [123, 329], [127.2, 324]],
  (f) => (f < 0.3 ? 6.6 + (9.2 - 6.6) * (f / 0.3) : f < 0.6 ? 9.2 : 9.2 - (9.2 - 7.0) * ((f - 0.6) / 0.4)))
const NECK = makePath([[129, 306], [126.8, 299.5], [125, 293.5]], 4.6)
// LOWER BODY, third reading (hu-fix: photo-11 at 3–4× round both handles, .work/hu-fix/crops/gridR.png, gridL.png).
// The "square with a hole" of the r8 model was the beast's HIND FOOT: the lower body is one animal, not a strap and
// a block. From the chest volute (124.6, 292.8) the FORELEG (ribbed across) runs down-in to a paw pressed on the
// shoulder (≈ 109, 280); the BODY runs down the outer side (transverse ribs on its back, ≈ 12 mm broad) into a round
// HAUNCH (≈ 141, 261) whose flank carries an incised spiral (the hip; the tail is rolled tight against it at the
// rump's outer lower corner); from the haunch the shank drops to the HOCK at the bottom outer corner (≈ 137, 248)
// and the FOOT lies flat along the shoulder, heel to toes, up-inward to the toes at ≈ (118, 265), its sole on the
// wall, a contour line round its side and a curled toe (the "hole" was the incised curl). Open ground only between
// foreleg and body (x 113–122, y 268–277). The photograph shows the foot's outer edge ≈ 5 mm farther out than the
// model's shoulder at z = 0 (the silhouette there is the shoulder's far side); the sole is put ON the model's wall.
const LEG = makePath([[123, 291], [118, 286.6], [113.6, 283], [110.4, 280.8]], (f) => 4.6 - 0.6 * f)
const BODY = makePath([[125.5, 290.5], [128, 284.5], [131.6, 277.4], [135.6, 270.6], [139.4, 265.4], [141, 261]],
  (f) => 6.4 - 0.6 * f)
// the shoulder under the foot: the lathe profile's straight run (121.7, 249.6) → (114.7, 264.0)
const SH = { p: [121.7, 249.6], d: [-0.4375, 0.8992], n: [0.8992, 0.4375] }
const shoulderPt = (t, off) => [SH.p[0] + SH.d[0] * t + SH.n[0] * off, SH.p[1] + SH.d[1] * t + SH.n[1] * off]
// shank haunch → hock, then the foot hock → toes (tapering, its sole sinking onto the wall)
const SHANK = makePath([[141, 260.5], [139.6, 254.6], [137, 249.6]], (f) => 6.2 - 0.9 * f)
const FOOT = makePath([[137, 249.6], [131, 249.4], shoulderPt(5, 5.0), shoulderPt(11, 4.1), shoulderPt(15.6, 3.4)], (f) => 4.9 - 1.6 * f)
// the thigh: the belly side of the hind quarter, a broad dark strap from under the chest straight down onto the foot
// (photo: it closes the angle between body and foot; open ground only left of it, under the foreleg)
const THIGH = makePath([[126.6, 284.5], [125.4, 276], [124.6, 268.5], [125.6, 262.5]], (f) => 4.4 + 0.6 * f)
// the tail: out of the rump, rolled down and in, tight against the haunch
const TAILP = makePath([[145.6, 264.8], [149.2, 261.6], [150, 257], [148.2, 253.4], [145.2, 253.4], [144.4, 256.2]], (f) => 2.5 - 0.9 * f)
export const HANDLE = {
  bounds: { min: [82, 236, -14], max: [158, 350, 14] },
  hz: 6.5, // half thickness of the arch across the handle (mm, assumed)
}

export function handleSDF() {
  const hz = HANDLE.hz
  const sd = (x, y, z) => {
    const A = limb(ARCHP, x, y, z, hz, 6.2)
    let d = A.d
    // the limbs (rounded sections, thinner)
    const N = limb(NECK, x, y, z, hz - 0.5, 3.6)
    const L = limb(LEG, x, y, z, 4.8, 3.6)
    const B = limb(BODY, x, y, z, 5.6, 3.8)
    const S = limb(SHANK, x, y, z, 5.6, 3.8)
    const F = limb(FOOT, x, y, z, 5.0, 3.2)
    const T = limb(TAILP, x, y, z, 2.6, 1.6)
    const TH = limb(THIGH, x, y, z, 5.4, 3.8)
    d = smin(d, N.d, 2.2)
    d = smin(d, L.d, 1.2)
    d = smin(d, B.d, 1.4)
    // C-volute at the chest (the foreleg's shoulder joint)
    d = smin(d, sdRBox3(x - 124.6, y - 292.8, z, 5.6, 5.6, hz - 0.2, 4.4), 1.6)
    // the paw: a flattened pad pressed on the shoulder, toes forward (up the wall)
    d = smin(d, sdEllipsoid(x - 108.0, y - 281.8, z, 3.4, 3.8, 4.6), 1.6)
    // the haunch: a round thigh, fuller across than the body
    d = smin(d, sdEllipsoid(x - 140.8, y - 260.8, z, 8.4, 8.6, 6.8), 2.6)
    d = smin(d, S.d, 2.0)
    d = smin(d, F.d, 2.2)
    d = smin(d, TH.d, 2.0)
    // the flesh between thigh, shank and haunch (no daylight there on the bronze: a dark crease, not a hole)
    d = smin(d, sdEllipsoid(x - 131.8, y - 259.6, z, 4.6, 6.6, 4.8), 2.0)
    // the sole: a flat pad along the wall under the foot (sunk 0.8 mm into it), blended into the foot
    const [sx, sy] = [x - SH.p[0], y - SH.p[1]]
    const st = sx * SH.d[0] + sy * SH.d[1], sn = sx * SH.n[0] + sy * SH.n[1]
    d = smin(d, sdRBox3(st - 6.4, sn - 1.9, z, 10.8, 2.7, 4.4, 2.2), 2.4)
    d = smin(d, T.d, 1.0)
    // the loop through the arch: an ellipse, its lower right drawn out to a point under the chin
    let hole = sdEllipsoid(x - ARCH.hole[0], y - ARCH.hole[1], 0, ARCH.hrx, ARCH.hry, 1)
    hole = smin(hole, sdCone(x, y, 0, [119.5, 309, 0], [125.4, 304.6, 0], 3.6, 0.9), 2.0)
    // incised line work on the side faces
    if (d > -2.5 && d < 1.5) {
      let g = 1e9
      // a contour line round the loop and inside the arch's outer edge
      if (x < 124) g = Math.min(g, Math.abs(hole - 2.6) - 0.34)
      if (A.q.f > 0.2 && A.q.f < 0.85) g = Math.min(g, Math.abs(A.q.d - A.hw + 2.4) - 0.34)
      // ribbing across the body's back and the foreleg (photo: transverse ridges)
      if (B.q.f > 0.05 && B.q.f < 0.72) g = Math.min(g, Math.abs((B.q.a % 3.2) - 1.6) - 0.36 + Math.max(0, B.q.d - 5.2))
      if (L.q.f > 0.1 && L.q.f < 0.85) g = Math.min(g, Math.abs((L.q.a % 3.0) - 1.5) - 0.34 + Math.max(0, L.q.d - 4.2))
      // spiral grooves: the chest volute, the hip
      g = Math.min(g, spiralGroove(x - 124.6, y - 292.8, 1.4, 1.5))
      g = Math.min(g, spiralGroove(x - 141.2, y - 261.4, 1.35, -1.9))
      // the foot: a contour line inside its edge and the curled toe
      if (F.q.f > 0.12 && F.q.f < 0.86) g = Math.min(g, Math.abs(F.q.d - F.hw + 1.5) - 0.32)
      g = Math.min(g, Math.abs(len2(x - 118.4, y - 264.0) - 1.7) - 0.34)
      // ribbed brow behind the head (horizontal ridges where the arch meets the head)
      if (x > 119 && x < 127 && y > 324 && y < 336) g = Math.min(g, Math.abs((y % 2.6) - 1.3) - 0.38)
      d = smax(d, -Math.max(g, -d - 0.6), 0.3)
    }
    d = smin(d, head(x, y, z), 2.2)
    d = smax(d, -hole, 1.2)
    return d
  }
  return { sd, bounds: HANDLE.bounds }
}

/** an incised Archimedean spiral groove (pitch mm, `turns` signed = hand) centred at the origin, ≈ 2 turns */
function spiralGroove(x, y, pitch, turns) {
  const r = len2(x, y)
  if (r > pitch * Math.abs(turns) * 2.2 + 0.6) return 1e9
  const a = Math.atan2(y, x) * Math.sign(turns)
  const u = r / pitch - a / (2 * Math.PI)
  const f = u - Math.floor(u)
  return Math.abs(f - 0.5) * pitch - 0.34
}

/** the head: a flat face looking out (+x), the snout down and out; round eyes; a pair of bottle horns side by side */
function head(x, y, z) {
  // far from the head's box (x 118–145, y 300–347, |z| ≤ 10): a cheap lower bound
  const bx = Math.max(118 - x, 0, x - 145), by = Math.max(300 - y, 0, y - 347), bz = Math.max(Math.abs(z) - 10, 0)
  const db = len3(bx, by, bz)
  if (db > 4) return db
  // skull and cheeks
  let d = sdEllipsoid(x - 131.0, y - 321.5, z, 7.6, 12.5, 8.0)
  // flat face with a heavy brow
  d = smin(d, sdRBox3(x - 135.2, y - 322, z, 3.6, 7.6, 7.0, 2.6), 2)
  d = smin(d, sdRBox3(x - 136.6, y - 328.6, z, 2.0, 1.6, 7.0, 1.0), 1.0)
  // snout: down and out, a broad muzzle; mouth slit
  d = smin(d, sdCone(x, y, z, [134.5, 315, 0], [137.6, 308.6, 0], 5.4, 4.0), 2.2)
  d = smax(d, -sdRBox3(x - 139.2, y - 309.6, z, 1.8, 0.55, 4.4, 0.3), 0.4)
  // jaw under the chin
  d = smin(d, sdEllipsoid(x - 131.5, y - 307.6, z, 4.6, 3.0, 5.6), 1.6)
  // eyes: round, bulging, on the sides of the face
  for (const s of [-1, 1]) {
    d = smin(d, sdEllipsoid(x - 136.4, y - 323.4, z - s * 4.4, 2.2, 2.2, 2.0), 0.7)
    d = smax(d, -(len3(x - 137.6, y - 323.6, z - s * 5.6) - 0.9), 0.3)
  }
  // ears on the back of the skull
  for (const s of [-1, 1]) d = smin(d, sdEllipsoid(x - 126.6, y - 329.5, z - s * 5.6, 2.6, 3.6, 1.6), 1.2)
  // HORNS (hu-fix): a PAIR set side by side across the crown, left and right of the mid-line — short stout BOTTLE horns
  // (瓶形角: a stalk swelling to a rounded knob, photo-11: the left handle shows one knob ≈ 5 mm across in profile, the
  // right handle the pair's two tips), ≈ 6 mm tall over the brow (tips at y ≈ 338), leaning a little back and splaying apart
  for (const s of [-1, 1]) {
    const a = [130.4, 330.2, s * 2.9], b = [129.5, 336.2, s * 4.6], c = [129.2, 337.4, s * 5.0]
    let hd = sdCone(x, y, z, a, b, 2.1, 1.6)
    hd = smin(hd, sdEllipsoid(x - c[0], y - c[1], z - c[2], 2.0, 2.5, 2.0), 1.4) // the bottle's knob
    // two rings round the stalk
    const v = (y - a[1]) - 1.6
    if (v > -1.2 && v < 2.6) hd = smax(hd, -Math.max(Math.abs((((v % 2.4) + 2.4) % 2.4) - 1.2) - 0.3, -hd - 0.4), 0.25)
    d = smin(d, hd, 1.3)
  }
  return d
}

/**
 * Make the winding of a meshSDF geometry consistent (hu-fix). meshSDF's surface-nets quads are oriented by the sign
 * change, then every triangle is re-oriented by the field gradient — which, at the incised grooves (sharp smax
 * features a voxel wide), flips a few hundred triangles against their neighbours. Here the winding is propagated
 * TOPOLOGICALLY instead (breadth first across edges shared by exactly two triangles), and each connected piece is
 * turned outward by the sign of its enclosed volume. In place; returns the number of triangles flipped.
 */
export function orientConsistently(geo) {
  const I = geo.index.array, P = geo.attributes.position.array, nt = I.length / 3
  const edges = new Map()
  const key = (a, b) => (a < b ? a * 4194304 + b : b * 4194304 + a)
  for (let t = 0; t < nt; t++) for (let e = 0; e < 3; e++) {
    const k = key(I[3 * t + e], I[3 * t + ((e + 1) % 3)])
    const l = edges.get(k)
    if (l) l.push(t); else edges.set(k, [t])
  }
  const has = (t, a, b) => { for (let e = 0; e < 3; e++) if (I[3 * t + e] === a && I[3 * t + ((e + 1) % 3)] === b) return true; return false }
  const flip = (t) => { const s = I[3 * t + 1]; I[3 * t + 1] = I[3 * t + 2]; I[3 * t + 2] = s }
  const seen = new Uint8Array(nt)
  let flipped = 0
  for (let s0 = 0; s0 < nt; s0++) {
    if (seen[s0]) continue
    const comp = [s0], q = [s0]
    seen[s0] = 1
    while (q.length) {
      const t = q.pop()
      for (let e = 0; e < 3; e++) {
        const a = I[3 * t + e], b = I[3 * t + ((e + 1) % 3)]
        const l = edges.get(key(a, b))
        if (l.length !== 2) continue
        const u = l[0] === t ? l[1] : l[0]
        if (seen[u]) continue
        if (has(u, a, b)) { flip(u); flipped++ }   // a consistent neighbour runs the shared edge b → a
        seen[u] = 1; comp.push(u); q.push(u)
      }
    }
    let vol = 0
    for (const t of comp) {
      const a = 3 * I[3 * t], b = 3 * I[3 * t + 1], c = 3 * I[3 * t + 2]
      vol += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1]) - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c]) + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c])
    }
    if (vol < 0) for (const t of comp) { flip(t); flipped++ }
  }
  geo.index.needsUpdate = true
  return flipped
}
