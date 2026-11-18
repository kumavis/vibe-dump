// nezu-fanghe — the form: dimensions, the lobe section law, the upper box, the eave and cap, the spout,
// the handle (one signed-distance sculpture: loop bar, head, two notched horn plates, the lower body and
// its small tail head). Units mm, Y up, feet on y = 0, front (+Z) = the HANDLE face (the face with the
// sculpted animal: photos 14, 15, 25, 45), the spout leans back over −Z. Numbers: reference/nezu-fanghe/dossier.md
// (M = measured off the photographs, I = inferred).

import * as THREE from 'three'

export const D = {
  H: 720, //            spout lip top (I: the lead's 71–73 cm, consistent with the photographs; dossier § Scale)
  A: 105, //            half face width at the lobes and frieze, corner arris to centre (M: 0.49 × eave height)
  legTop: 120, //       leg → lobe transition starts
  faceBottom: 130, //   lobe décor / corner flange bottom (M 0.30 E)
  apex: 212, //         crotch apex: the V between two lobes rises this high (M, flattened faces)
  lobeTop: 255, //      lobes → frieze (M 0.59 E)
  friezeTop: 297, //    frieze → collar (M 0.69 E)
  eave: 430, //         eave slab underside (= E)
  eaveT: 12, //         slab thickness (M)
  eaveA: 166, //        half eave width (M ≈ 1.5 × the lobe width, side photos)
  collarA: 158, //      half collar width where it meets the eave (a cavetto: near-vertical below, flaring hard under the slab; 39, 42)
  // THE TOP (dossier § The top: a face): one swelling cushion over a plain eave border, the face in high relief
  capA: 140, //         half width of the cushion foot on the eave top (M 41/44 rectified: field edge ≈ ±140; 39: 0.84 of the eave)
  capTop: 482, //       cushion shoulder / plateau edge: 40 mm over the eave top = 0.12 of the eave (reviewers; 39 reads 40–50)
  dome: 6, //           plateau crown above its edge (the top reads nearly flat in 15, 39, 42)
  topA: 106, //         half width of the plateau at the shoulder (M 41/44)
  capN: 5, //           superellipse exponent of the cushion plan (soft rounded corners, 41/44)
  crease: { c: 10, r: 40 }, // lobe overlap past the centre plane and front-inner corner radius: crease ≈ 13 mm deep
  bulge: 7, //          lobe face bow (mm, at mid face)
}
D.eaveTop = D.eave + D.eaveT
D.capBase = D.eaveTop

// the spout: root inside the cap ON THE AXIS (x = 0) behind the face's eyes, rising out of the face like a crest;
// axis tilted back 25° from vertical, outer Ø 46, bore Ø 30; 65° from horizontal (39: ≈ 60–64°, 42: 58–62°)
export const SPOUT = { root: [0, 470, -60], angle: 65, r: 23, bore: 15, length: 276 }
{
  const a = (SPOUT.angle * Math.PI) / 180
  SPOUT.axis = new THREE.Vector3(0, Math.sin(a), -Math.cos(a))
  SPOUT.tip = new THREE.Vector3(...SPOUT.root).addScaledVector(SPOUT.axis, SPOUT.length)
}
// The top is ONE face looking up, symmetric about x = 0 (the spout → handle axis; 15, 41 + 44 as mirror halves).
// The filling hole is its MOUTH: an oval on the axis toward the handle end, a little pinched at the back (15, 41, 44),
// with a soft rolled lip; the crenellated ridge (five blocks, 39 / 42) is the nose, running on the axis from the
// spout root to the mouth's back rim. World x, z.
export const HOLE = { c: [0, 84], rx: 35, rz: 23, pinch: 0.16, lip: 5.5 }
export const RIDGE = { x: 0, z0: -46, z1: 55, height: 20, thickness: 18, blocks: 5 }

const smooth01 = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

/** superellipse radius of the cushion plan at (x, z) */
export function capR(x, z) {
  const n = D.capN
  return Math.pow(Math.pow(Math.abs(x), n) + Math.pow(Math.abs(z), n), 1 / n)
}

/** signed distance (mm, ≈) outside the mouth's outline (negative inside) */
export function holeDist(x, z) {
  const dx = x - HOLE.c[0], dz = z - HOLE.c[1]
  const rz = dz < 0 ? HOLE.rz * (1 - HOLE.pinch * Math.exp(-(dx * dx) / 120)) : HOLE.rz
  const q = Math.hypot(dx / HOLE.rx, dz / rz)
  return (q - 1) * (q < 1 ? Math.min(HOLE.rx, rz) : (HOLE.rx + rz) / 2)
}

/** the mouth's outline (world x, z), CCW seen from above */
export function holeOutline(n = 64) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2
    const dx = HOLE.rx * Math.cos(th)
    let dz = HOLE.rz * Math.sin(th)
    if (dz < 0) dz *= 1 - HOLE.pinch * Math.exp(-(dx * dx) / 120)
    pts.push([HOLE.c[0] + dx, HOLE.c[1] + dz])
  }
  return pts
}

/** the bare cushion (no lip, no relief) at world (x, z): eave top at the foot, steep sides rounding over to a
 *  nearly flat plateau */
export function cushionY(x, z) {
  const r = capR(x, z)
  const base = D.eaveTop
  if (r >= D.capA) return base
  const top = D.capTop
  if (r > D.topA) {
    const t = (D.capA - r) / (D.capA - D.topA)
    return base + (top - base) * (1 - Math.pow(1 - t, 1.7))
  }
  const u = r / D.topA
  return top + D.dome * (1 - u * u) * (1 - u * u)
}

/** cushion + the mouth's soft rolled lip (relief not included) */
export function capTopY(x, z) {
  let y = cushionY(x, z)
  const d = holeDist(x, z)
  if (d < 22) {
    y += HOLE.lip * Math.exp(-(((d - 5.5) / 4.6) ** 2)) // the rolled lip
    if (d < 6) y -= 0.3 * (6 - Math.max(0, d)) ** 2 // rolling over into the opening
  }
  return y
}
export const plateauY = capTopY

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const lerp = (a, b, t) => a + (b - a) * t

/** the +X +Z lobe's section at height y (kit lobeSection spec) */
export function lobeSectionAt(y) {
  const { A, legTop, apex, lobeTop } = D
  const { c, r } = D.crease
  if (y <= legTop) {
    // leg: 28 mm at the sole → 46 at the top, outer faces nearly flush with the corner arris
    // legs stand ≈ 9 mm inside the lobe face, so the décor field ends in a squared ledge (detail-leg, 25, 42);
    // their outer faces splay a little outward toward the sole
    const t = y / legTop
    const x1 = lerp(98, 95.5, t)
    const w = lerp(32, 52, Math.pow(t, 1.2))
    return { x0: x1 - w, x1, z0: x1 - w, z1: x1, r: [3.5, 7, 7, 7], bulge: 0 }
  }
  // transition: the lobe's bottom ledge then the arch up to the apex (x0 → 0), then the overlap (x0 → −c)
  const x1 = lerp(95.5, A, smooth((y - legTop - 1) / 5))
  let x0
  if (y <= apex) {
    const s = (y - legTop) / (apex - legTop)
    x0 = 43.5 * Math.pow(1 - s, 1.35)
  } else x0 = -c * smooth((y - apex) / 10)
  // front-inner radius: a rounded edge to the V between the lobes, holds the crease, flattens out at the top
  const rIn = y <= apex ? lerp(7, r, smooth((y - legTop) / 40)) : lerp(r, 3, smooth((y - 232) / (lobeTop - 232)))
  const bulge = D.bulge * smooth((y - 122) / 30) * (1 - smooth((y - 205) / (lobeTop - 205)))
  return { x0, x1, z0: x0, z1: x1, r: [3, rIn, 10, rIn], bulge }
}

/** the crease on a face: z (or x) of the lobe surface on the centre plane at height y (above the apex) */
export function creaseDepth(y) {
  const s = lobeSectionAt(y)
  const r = s.r[1], c = -s.x0
  if (y <= D.apex) return r
  if (r <= c) return 0
  return r - Math.sqrt(r * r - (r - c) * (r - c))
}

/** collar half width at height y (concave flare to the eave) */
export function collarHalf(y) {
  const t = Math.min(1, Math.max(0, (y - D.friezeTop) / (D.eave - D.friezeTop)))
  // cavetto: near-vertical in its lower half, then a hard flare meeting the eave almost horizontally
  return D.A + (D.collarA - D.A) * (1 - Math.sqrt(Math.max(0, 1 - Math.pow(t, 2.4))))
}

/** fangBody profile(t) for the upper box (t over lobeTop → eave) */
export function upperProfile(t) {
  const y = D.lobeTop + t * (D.eave - D.lobeTop)
  const dx = collarHalf(y) - D.A
  return { dx, dz: dx }
}

/** a polyline path for kit.flange({ path }): pts [Vector3…] root line, out(i) → Vector3 */
export function polyPath(pts, outAt) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true, length: L,
    frame(s) {
      let i = 1
      while (i < pts.length - 1 && cum[i] < s) i++
      const a = pts[i - 1], b = pts[i]
      const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
      tmp.p.lerpVectors(a, b, f)
      tmp.d.subVectors(b, a).normalize()
      const o = outAt(tmp.p)
      tmp.n.copy(o).addScaledVector(tmp.d, -o.dot(tmp.d)).normalize()
      tmp.b.crossVectors(tmp.d, tmp.n)
      return tmp
    },
  }
}

// ------------------------------------------------------------------ the handle as one SDF

const sdBox2 = (px, py, bx, by, r) => {
  const qx = Math.abs(px) - bx + r, qy = Math.abs(py) - by + r
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25 }

/** Catmull-Rom through [y, z] control points (x = 0 plane), sampled every ~2 mm */
function spline2(P, step = 5) {
  const out = []
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step))
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)))
    }
  }
  out.push(P[P.length - 1])
  return out
}

// The handle, traced off photos 39 (profile), 42, 45 (front) and 25 (lower body): a dragon. Its HEAD sits right
// under the eave, attached to the collar, a broad wedge (≈ 66 mm wide) with domed brows carrying incised C-scrolls,
// domed eyes, a snout pointing out and down and an OPEN jaw with a row of teeth, its tip ≈ 30 mm beyond the eave
// edge; two notched rounded-square horn plates (parts.js) stand above it. Its BODY leaves the back of the jaw, bows
// out (outer edge ≈ 200 mm from the axis at mid height), swelling and covered in scales, and comes back to the frieze;
// at the lowest outer bend a small crested head looks out with a hooked tail curling under it. Below the frieze the
// creature's crouching forequarters run down the crease between the two lobes (two forelegs with paws) to a small
// head with a pale stud (photo 25). Centre line [y, z] in the x = 0 plane.
export const HANDLE = {
  bar: spline2([[380, 132], [362, 146], [340, 163], [316, 178], [292, 184], [274, 177], [261, 162], [254, 145], [252, 126], [253, 108]]),
  barHalf: [16, 12], // half width (x), half depth at the ends; the body swells by `swell` mid-way
  swell: [7, 5],
  head: { c: [0, 384, 160] }, // cranium centre; the snout reaches z ≈ 197
  horns: { y: 409, x: 39, z: 148, w: 62, h: 47, half: 4 }, // two notched rounded-square plates (M: 45, ≈ 62 × 47 mm)
  lower: { y0: 226, y1: 254, half: [21, 8] }, // the forequarters down the crease
  tail: { c: [0, 206], r: 12 }, // the small head at its foot, with the pale stud
}

const sdEll = (x, y, z, rx, ry, rz) => {
  // cheap ellipsoid bound (good near the surface for moderate ratios)
  const k0 = Math.hypot(x / rx, y / ry, z / rz)
  const k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}
const sdRBox = (x, y, z, bx, by, bz, r) => {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r
}
const sdCapsule = (x, y, z, a, b, r) => {
  const px = x - a[0], py = y - a[1], pz = z - a[2]
  const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2]
  const h = Math.max(0, Math.min(1, (px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz)))
  return Math.hypot(px - bx * h, py - by * h, pz - bz * h) - r
}
// a ring groove (incised C-scroll) of radius R round centre c in the plane normal to n (unit), channel radius w
const sdRing = (x, y, z, c, n, R, w) => {
  const px = x - c[0], py = y - c[1], pz = z - c[2]
  const h = px * n[0] + py * n[1] + pz * n[2]
  const qx = px - h * n[0], qy = py - h * n[1], qz = pz - h * n[2]
  return Math.hypot(Math.hypot(qx, qy, qz) - R, h) - w
}
const rotYZ = (y, z, cy, cz, deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  const py = y - cy, pz = z - cz
  return [py * c + pz * s, -py * s + pz * c] // + deg tips the local +z axis down
}

/** SDF of the handle sculpture (world mm); bounds for meshSDF */
export function handleSDF() {
  const bar = HANDLE.bar
  const segs = []
  let cum = 0
  for (let i = 0; i < bar.length - 1; i++) {
    const [y0, z0] = bar[i], [y1, z1] = bar[i + 1]
    const dy = y1 - y0, dz = z1 - z0, l = Math.hypot(dy, dz)
    segs.push({ y0, z0, ty: dy / l, tz: dz / l, l, s0: cum })
    cum += l
  }
  const Ltot = cum
  const Lo = HANDLE.lower
  const creaseZ = (y) => D.A - creaseDepth(Math.max(D.apex + 1, y))
  let bY0 = Infinity, bY1 = -Infinity, bZ0 = Infinity, bZ1 = -Infinity
  for (const [y, z] of bar) { bY0 = Math.min(bY0, y); bY1 = Math.max(bY1, y); bZ0 = Math.min(bZ0, z); bZ1 = Math.max(bZ1, z) }
  const pad = Math.max(...HANDLE.barHalf) + Math.max(...HANDLE.swell) + 2
  const sd = (x, y, z) => {
    // ---- body: swelling rounded-box section along the centre line, scale bumps on it
    let best = Infinity, bs = 0, bn = 0, bhx = 0, bhz = 0
    const ox = Math.max(0, Math.abs(x) - pad), oy = Math.max(0, bY0 - pad - y, y - bY1 - pad), oz = Math.max(0, bZ0 - pad - z, z - bZ1 - pad)
    const far = Math.hypot(ox, oy, oz)
    if (far > 3) best = far
    else for (const s of segs) {
      const qy = y - s.y0, qz = z - s.z0
      let t = qy * s.ty + qz * s.tz
      t = t < 0 ? 0 : t > s.l ? s.l : t
      const ny = qy - s.ty * t, nz = qz - s.tz * t
      const pn = ny * -s.tz + nz * s.ty
      const along = (qy * s.ty + qz * s.tz) - t
      const f = (s.s0 + t) / Ltot
      const sw = Math.sin(Math.PI * Math.min(1, f * 1.15))
      const hx = HANDLE.barHalf[0] + HANDLE.swell[0] * sw, hz = HANDLE.barHalf[1] + HANDLE.swell[1] * sw
      const d2 = sdBox2(x, pn, hx, hz, Math.min(hx, hz) * 0.75)
      const d = along !== 0 ? Math.hypot(Math.max(d2, 0), along) + Math.min(d2, 0) : d2
      if (d < best) { best = d; bs = s.s0 + t; bn = pn; bhx = hx; bhz = hz }
    }
    let d = best
    if (best < 3) {
      // scales: staggered domed bumps along the body (≈ 9 mm), on its outer face and flanks
      const row = Math.floor(bs / 7)
      const u = bs / 7 - row - 0.5
      const v = x / 7 + (row % 2 ? 0.5 : 0)
      const w = v - Math.round(v)
      d -= 0.7 * Math.max(0, 1 - 4 * (u * u + w * w)) * (bn > -4 ? 1 : 0.3)
      // incised C-scrolls on both flanks (photos 39, 40: the body is covered in scroll décor)
      if (Math.abs(x) > bhx - 3) {
        const k = Math.round(bs / 15), ds = bs - k * 15
        const ring = Math.hypot(Math.hypot(ds, bn - (k % 2 ? 3 : -3)) - 4.6, Math.abs(x) - bhx) - 1.25
        const open = ds > 0 && Math.abs(bn - (k % 2 ? 3 : -3)) < 2.5 // a gap: C, not O
        if (!open) d = Math.max(d, -ring)
      }
    }
    // ---- head: cranium, snout (tipped down), brows, eyes, open lower jaw, teeth (bounded: y ≥ 335)
    if (y > 335 && d > -6) {
      const [cy, cz] = HANDLE.head.c.slice(1)
      // cranium, tight under the eave, its back grown into the collar
      let dh = sdRBox(x, y - cy, z - (cz - 12), 35, 13, 30, 13)
      // snout: out and down
      {
        const [ly, lz] = rotYZ(y, z, cy - 6, cz + 22, 14)
        dh = smin(dh, sdRBox(x, ly, lz, 30, 10, 16, 9), 9)
        for (const s of [-1, 1]) dh = smin(dh, sdEll(x - s * 26, y - (cy - 5), z - (cz + 10), 10, 10, 13), 6) // cheeks
      }
      // brows: two domes over the eyes, and the eyes themselves
      for (const s of [-1, 1]) {
        dh = smin(dh, sdEll(x - s * 15, y - (cy + 10), z - (cz + 6), 13, 7, 12), 4)
        dh = smin(dh, Math.hypot(x - s * 20, y - (cy + 3), z - (cz + 18)) - 6.5, 2.5)
        // incised C-scrolls on brow and snout (photo 45)
        dh = Math.max(dh, -sdRing(x, y, z, [s * 15, cy + 14, cz + 6], [0, 0.94, 0.34], 8, 1.8))
        dh = Math.max(dh, -sdRing(x, y, z, [s * 12, cy + 1, cz + 30], [0, 0.85, 0.53], 6, 1.6))
      }
      // open mouth: carve the gap under the snout, then the lower jaw below it
      {
        const [ly, lz] = rotYZ(y, z, cy - 18, cz + 26, 8)
        const gap = sdRBox(x, ly, lz - 6, 22, 3.6, 18, 2)
        dh = Math.max(dh, -gap)
        const jaw = sdRBox(x, ly + 9, lz + 4, 21, 5, 16, 4)
        dh = smin(dh, jaw, 5)
        // teeth: a row hanging from the snout and a row standing on the jaw
        for (let k = -2; k <= 2; k++) {
          const tx = k * 8
          dh = Math.min(dh, sdRBox(x - tx, ly - 2.2, lz - 13, 2.2, 2.6, 2, 0.8))
          dh = Math.min(dh, sdRBox(x - tx - 4, ly + 4, lz - 10, 2, 2.4, 2, 0.8))
        }
      }
      d = smin(d, dh, 7)
    }
    // ---- small crested head at the lowest outer bend, hooked tail under it (bounded)
    if (y < 312 && y > 228 && z > 160 && Math.abs(x) < 34) {
      const hy = 275, hz = 194
      let dl = sdEll(x, y - hy, z - hz, 14, 11, 11)
      dl = smin(dl, sdRBox(x, y - (hy + 13), z - (hz + 5), 3.2, 9, 6, 2), 3) // crest
      dl = smin(dl, sdCapsule(x, y, z, [0, hy + 20, hz + 6], [0, hy + 25, hz + 9], 3.5), 2)
      for (const s of [-1, 1]) dl = smin(dl, Math.hypot(x - s * 9, y - (hy + 2), z - (hz + 9)) - 4, 1.5)
      dl = smin(dl, sdCapsule(x, y, z, [0, 264, 186], [0, 252, 190], 5), 3)
      dl = smin(dl, sdCapsule(x, y, z, [0, 252, 190], [0, 242, 183], 4.5), 2)
      dl = smin(dl, sdCapsule(x, y, z, [0, 242, 183], [0, 244, 174], 4), 2)
      d = smin(d, dl, 5)
    }
    // ---- forequarters down the crease: chest, two forelegs with paws, the small studded head (bounded)
    if (y < 266) {
      const zc = creaseZ(Math.min(Math.max(y, Lo.y0), Lo.y1))
      const t = Math.min(1, Math.max(0, (Lo.y1 - y) / (Lo.y1 - Lo.y0)))
      const hx = Lo.half[0] - 6 * t
      const qy = y < Lo.y0 ? Lo.y0 - y : y > Lo.y1 ? y - Lo.y1 : 0
      const d2 = sdBox2(x, z - (zc + Lo.half[1] - 2), hx, Lo.half[1], 6)
      let dl = Math.hypot(Math.max(d2, 0), qy) + Math.min(d2, 0)
      // chest scales
      if (dl < 2) { const u = (y / 8) % 1 - 0.5, w = x / 8 - Math.round(x / 8); dl -= 0.8 * Math.max(0, 1 - 4 * (u * u + w * w)) }
      for (const s of [-1, 1]) {
        const za = creaseZ(240) + 7, zb = creaseZ(218) + 9
        dl = smin(dl, sdCapsule(x, y, z, [s * 17, 244, za], [s * 22, 219, zb], 6.5), 4)
        dl = smin(dl, sdEll(x - s * 23, y - 215, z - (zb + 2), 9, 5, 8), 3) // paw
        for (const k of [-1, 0, 1]) dl = Math.min(dl, Math.hypot(x - s * 23 - k * 5, y - 213, z - (zb + 9)) - 2.6) // claws
      }
      d = smin(d, dl, 6)
      const T = HANDLE.tail
      const zt = creaseZ(T.c[1] + 4) + 6
      let dt = sdEll(x, y - T.c[1], z - zt, 15, 12, 11)
      for (const s of [-1, 1]) dt = smin(dt, Math.hypot(x - s * 7, y - (T.c[1] + 3), z - (zt + 9)) - 3.6, 1.5)
      dt = Math.min(dt, Math.hypot(x, y - (T.c[1] - 3), z - (zt + 11)) - 4.6) // the pale stud
      d = smin(d, dt, 5)
    }
    return d
  }
  return { sd, bounds: { min: [-72, 192, 84], max: [72, 428, 232] } }
}

/** SDF of one small frieze-centre head, local frame: x right, y up, z out of the wall (z = 0 on it). A frontal
 *  mask (photos 39, 42): round face, domed eyes under brows, flat muzzle with an open toothed mouth, small ears. */
export function friezeHeadSDF() {
  const sd = (x, y, z) => {
    let d = sdEll(x, y, z - 3, 20, 16, 11)
    d = smin(d, sdRBox(x, y + 6, z - 10, 12, 7.5, 6, 4), 4) // muzzle
    for (const s of [-1, 1]) {
      d = smin(d, sdEll(x - s * 8.5, y - 6, z - 9, 6.5, 4, 4), 2) // brow
      d = smin(d, Math.hypot(x - s * 8.5, y - 2.5, z - 11.5) - 4, 1.2) // eye
      d = smin(d, sdEll(x - s * 18, y - 9, z - 3, 5, 7, 4), 2) // ear
    }
    d = Math.max(d, -sdRBox(x, y + 7.5, z - 16, 9, 1.8, 5, 0.8)) // open mouth
    for (let k = -1.5; k <= 1.5; k++) d = Math.min(d, sdRBox(x - k * 5, y + 6.4, z - 14.8, 1.5, 1.6, 1.4, 0.5))
    return d
  }
  return { sd, bounds: { min: [-26, -20, -4], max: [26, 20, 20] } }
}
