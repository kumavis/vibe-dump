// The three shoulder heads of Met zun 43.25.1 (dossier §b.5, detail-shoulder-head.jpg).
//
// Small, flat and stylised: two C-curl horns lying almost FLUSH on the 41° shoulder
// (≈ 2.5–3 mm proud, ≈ 60 mm across together), each carrying a sunk spiral of two
// turns; a low forehead between them; and a short bovine MUZZLE that tapers from
// ≈ 26 mm at its root to ≈ 16 mm and droops out and down over the carination,
// ending in a rounded tip (no flat end face, no nostril holes — the photograph shows a
// worn rounded snout with a malachite spot). Small round eyes beside the muzzle root.
// kit.animalHead's bovine is a free-standing head with tube horns rising off the
// wall; this one is a relief plaque with a muzzle, so it is its own SDF, meshed
// with kit.meshSDF. Local frame as the kit's heads: +Z out of the wall, +Y up the
// slope, wall at z = 0 (bent to the cone's curvature across the width).

const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z)

function sdEllipsoid(px, py, pz, rx, ry, rz) {
  const k0 = len3(px / rx, py / ry, pz / rz)
  const k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz))
  return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz)
}

/** capsule a → b with radii ra → rb (iq's round cone) */
function sdRoundCone(px, py, pz, a, b, ra, rb) {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2]
  const l2 = bax * bax + bay * bay + baz * baz
  const rr = ra - rb
  const a2 = l2 - rr * rr
  const il2 = 1 / l2
  const pax = px - a[0], pay = py - a[1], paz = pz - a[2]
  const y = pax * bax + pay * bay + paz * baz
  const z = y - l2
  const xx = len3(pax * l2 - bax * y, pay * l2 - bay * y, paz * l2 - baz * y)
  const x2 = xx * xx
  const y2 = y * y * l2
  const z2 = z * z * l2
  const k = Math.sign(rr) * rr * rr * x2
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - ra
}

const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}
const smax = (a, b, k) => -smin(-a, -b, k)

/** 2D distance to a rounded ellipse-ish lobe (centre c, radii a, b, rotation rot) */
function sdLobe2(x, y, c, a, b, rot) {
  const cs = Math.cos(rot), sn = Math.sin(rot)
  const px = (x - c[0]) * cs + (y - c[1]) * sn, py = -(x - c[0]) * sn + (y - c[1]) * cs
  const k = Math.hypot(px / a, py / b)
  return (k - 1) * Math.min(a, b)
}

/**
 * 2D distance to an Archimedean spiral groove of `turns` turns around c, outer radius
 * r1 → inner r0, handedness h (±1): the groove's centre line.
 */
function sdSpiral2(x, y, c, r0, r1, turns, h) {
  const dx = x - c[0], dy = y - c[1]
  const r = Math.hypot(dx, dy)
  const p = (r1 - r0) / turns // radial pitch per turn
  let th = Math.atan2(dy, h * dx)
  if (th < 0) th += 2 * Math.PI
  // spiral: r = r0 + p·(θ/2π + n), n = 0 … turns-1 (+ partial)
  const base = r0 + (p * th) / (2 * Math.PI)
  let n = Math.round((r - base) / p)
  n = Math.max(0, Math.min(Math.ceil(turns) - 1, n))
  let best = Infinity
  for (let m = n - 1; m <= n + 1; m++) {
    if (m < 0) continue
    const rs = base + m * p
    if (rs > r1 + 0.01) continue
    best = Math.min(best, Math.abs(r - rs))
  }
  // the outer free end and the eye at the centre: fall back to point distances
  if (best === Infinity) best = Math.abs(r - r1)
  return best
}

/**
 * The head of Met zun 43.25.1. Local frame: +Z out of the wall, +Y up the slope,
 * wall at z = 0. The muzzle is laid out in the vertical (out, up) plane of the vessel
 * and converted to the local frame with the shoulder slope `slope` (deg from horizontal).
 *
 * detail-shoulder-head.jpg (≈ 5.9 px/mm): a SHIELD-shaped face plaque ≈ 60 mm across,
 * standing ≈ 5 mm proud of the shoulder with crisp edges: two big C-curl horn pads with a
 * deep sunk spiral, a small raised ridge between them, two round bulging eyes at the inner
 * lower corners of the horns, and a SHORT, BROAD, BLUNT muzzle (≈ 26 wide, ≈ 17 deep)
 * pushing out and down over the carination and ending in a flattened oval end face with
 * well-rounded edges (the malachite spot) — a block, not a tapering thumb.
 * @param o.wallR  radius of curvature of the wall across the head (mm)
 * @param o.slope  shoulder slope (deg from horizontal)
 * @param o.embed  how far the plaque reaches into the wall (mm)
 */
export function zunHeadSDF({ wallR = 160, slope = 41, embed = 4 } = {}) {
  const sl = (slope * Math.PI) / 180
  const cs = Math.cos(sl), sn = Math.sin(sl)
  // local (y, z) → world (out, up) offsets from the mount point (the map is its own inverse)
  const W = (y, z) => [-cs * y + sn * z, sn * y + cs * z]
  // muzzle: a rounded, slightly tapering box along axis a (out and ≈ 29° down)
  const R = W(-7, 3.2) // the muzzle starts BELOW the eyes (photo)
  const al = Math.hypot(22, -10), a = [22 / al, -10 / al], n = [10 / al, 22 / al]
  const Lm = 24
  const lobes = [-1, 1].map((sx) => ({ sx, c: [sx * 17.5, 6], a: 12.8, b: 10.6, rot: sx * 0.3 }))
  const lobeTop = 5.0
  const faceTop = 4.0
  const eyes = [-1, 1].map((sx) => [sx * 10.5, 0.5])
  const plate = (d2, top, z) => {
    const wx = d2, wy = z - top
    return Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0))
  }
  return {
    bounds: { min: [-36, -42, -embed - 1], max: [36, 22, 26] },
    sd(x, y, z0) {
      const z = z0 + (x * x) / (2 * wallR)
      let d = Infinity
      // horn pads: flat-topped, crisp-edged, gently domed
      for (const lb of lobes) {
        const d2 = sdLobe2(x, y, lb.c, lb.a, lb.b, lb.rot)
        const r2 = ((x - lb.c[0]) / lb.a) ** 2 + ((y - lb.c[1]) / lb.b) ** 2
        // rounded (≈ 1.4 mm) worn edges, not a cut-out plate
        d = smin(d, plate(d2 + 1.4, lobeTop * (1 - 0.18 * Math.min(1, r2)) - 1.4, z) - 1.4, 0.8)
      }
      // the face between and below the horns: a shield narrowing to the muzzle root
      {
        const hw = 13 + Math.max(0, Math.min(1, (y + 8) / 16)) * 5
        const d2 = Math.max(Math.abs(x) - hw, y - 12, -y - 14)
        d = smin(d, plate(d2 - 0, faceTop, z), 2.0)
      }
      // a small raised lozenge ridge on the brow, between the horns
      {
        const d2 = Math.abs(x) * 2.6 + Math.abs(y - 8) * 0.7 - 4.2
        d = smin(d, plate(d2 / 2.7, faceTop + 1.2, z), 0.8)
      }
      // deep sunk two-turn spiral on each horn (≈ 1.8 wide, 1.4 deep)
      for (const lb of lobes) {
        const gs = sdSpiral2(x, y, [lb.c[0] + lb.sx * 0.5, lb.c[1]], 1.4, 9.2, 2, lb.sx)
        const slot = Math.max(gs - 0.95, lobeTop - 1.6 - z)
        d = smax(d, -slot, 0.3)
      }
      // the muzzle
      {
        const [po, pu] = W(y, z)
        const qo = po - R[0], qu = pu - R[1]
        const u = qo * a[0] + qu * a[1], w = qo * n[0] + qu * n[1]
        const t = Math.max(0, Math.min(1, u / Lm))
        const hw = 13 - 0.6 * t, hh = 8.8 - 0.6 * t, rr = 7.8 // an oval end face (≈ 26 × 17), not a square block
        const qx = Math.abs(x) - (hw - rr), qy = Math.abs(w) - (hh - rr), qz = Math.abs(u - Lm / 2) - (Lm / 2 - rr)
        const box = len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - rr
        // a shallow dish in the end face
        const dish = sdEllipsoid(x, w - 0.5, u - Lm - 1.2, 8.5, 5.5, 2.2)
        d = smin(d, smax(box, -dish, 0.8), 2.4)
      }
      // round bulging eyes with a sunk ring
      for (const [ex, ey] of eyes) {
        const e = sdEllipsoid(x - ex, y - ey, z - faceTop, 3.4, 3.4, 2.4)
        d = smin(d, e, 0.6)
        const ring = Math.abs(Math.hypot(x - ex, y - ey) - 3.9) - 0.45
        d = smax(d, -Math.max(ring, faceTop - 0.8 - z), 0.2)
      }
      return Math.max(d, -embed - z)
    },
  }
}
