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
 * @param o.wallR  radius of curvature of the wall across the head (mm)
 * @param o.slope  shoulder slope (deg from horizontal)
 * @param o.embed  how far the plaque reaches into the wall (mm)
 */
export function zunHeadSDF({ wallR = 160, slope = 41, embed = 4 } = {}) {
  const sl = (slope * Math.PI) / 180
  // (out, up) world offset → local (y, z)
  const L = ([dout, dup]) => [-Math.cos(sl) * dout + Math.sin(sl) * dup, Math.sin(sl) * dout + Math.cos(sl) * dup]
  const pt = (o, x = 0) => {
    const [y, z] = L(o)
    return [x, y, z]
  }
  // muzzle centre line (world offsets from the mount point, mm): root on the forehead,
  // out along the slope, then bending down over the carination to a rounded tip
  const R0 = pt([1.5, 2]), M = pt([12, -3]), T = pt([18.5, -8])
  const rR0 = 11.5, rM = 9.6, rT = 8.0
  // horn lobes: centres (x, y) on the slope, radii, tilt — flat pads with a spiral groove
  const lobes = [-1, 1].map((sx) => ({ sx, c: [sx * 17, 5.5], a: 13, b: 10.5, rot: sx * 0.32 }))
  const lobeTop = 3.4
  const browTop = 2.0
  const eyes = [-1, 1].map((sx) => [sx * 11, -1, 7.6])
  return {
    bounds: { min: [-34, -34, -embed - 1], max: [34, 20, 22] },
    sd(x, y, z0) {
      const z = z0 + (x * x) / (2 * wallR)
      let d = Infinity
      // horn lobes: domed flat pads, ≤ 3 mm proud
      for (const lb of lobes) {
        const d2 = sdLobe2(x, y, lb.c, lb.a, lb.b, lb.rot)
        const r2 = ((x - lb.c[0]) / lb.a) ** 2 + ((y - lb.c[1]) / lb.b) ** 2
        const top = lobeTop * (1 - 0.25 * Math.min(1, r2))
        const wx = d2, wy = z - top
        const pad = Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0))
        d = smin(d, pad, 1.2)
      }
      // low forehead between the horns
      {
        const d2 = sdLobe2(x, y, [0, 1], 11, 11, 0)
        const wx = d2, wy = z - browTop
        d = smin(d, Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)), 1.5)
      }
      // sunk two-turn spiral groove on each horn (0.6 mm deep, 1.3 wide)
      for (const lb of lobes) {
        const gs = sdSpiral2(x, y, [lb.c[0] + lb.sx * 0.5, lb.c[1]], 1.2, 8.6, 2, lb.sx)
        const slot = Math.max(gs - 0.8, lobeTop - 1.0 - z)
        d = smax(d, -slot, 0.25)
      }
      // the muzzle: two round cones, root → mid → rounded tip, a little wider than tall
      const xs = x * 0.88
      const m1 = sdRoundCone(xs, y, z, R0, M, rR0, rM)
      const m2 = sdRoundCone(xs, y, z, M, T, rM, rT)
      d = smin(d, smin(m1, m2, 3), 2.2)
      // eyes: small low domes beside the muzzle root, a sunk ring around each
      for (const e of eyes) {
        d = smin(d, sdEllipsoid(x - e[0], y - e[1], z - e[2], 2.8, 2.8, 2.0), 0.8)
      }
      return Math.max(d, -embed - z)
    },
  }
}
