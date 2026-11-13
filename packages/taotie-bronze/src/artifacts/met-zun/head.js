// The three shoulder heads of Met zun 43.25.1 (dossier §b.5, detail-shoulder-head.jpg).
//
// Small, flat and stylised: two broad C-curl horns lying FLAT on the 41° shoulder
// (a heart-shaped plaque ≈ 60 mm across, an incised line following each curl),
// a low forehead between them, and a short blunt bovine muzzle that runs out and
// down over the carination. Small round eyes at the root of the muzzle, no ears.
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

/** a tube along [x, y, z, r] knots, with its z squashed by `flat` (a band lying on the wall) */
function sdFlatTube(px, py, pz, knots, flat) {
  let d = Infinity
  const qz = pz / flat
  for (let i = 0; i < knots.length - 1; i++) {
    const a = knots[i], b = knots[i + 1]
    d = Math.min(d, sdRoundCone(px, py, qz, [a[0], a[1], a[2] / flat], [b[0], b[1], b[2] / flat], a[3], b[3]))
  }
  return d * flat
}

/** Catmull-Rom densify [x, y, r] control points → [x, y, z, r] knots */
function knots(ctrl, z, n = 5) {
  const out = []
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)]
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t
      const c = (k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
      out.push([c(0), c(1), z, c(2)])
    }
  }
  const l = ctrl[ctrl.length - 1]
  out.push([l[0], l[1], z, l[2]])
  return out
}

/**
 * @param o.wallR   radius of curvature of the wall across the head (mm): the plaque bends to it
 * @param o.droop   deg: muzzle axis pitched from the wall normal toward down-slope
 * @param o.scale   overall size factor (1 = ≈ 60 mm across the horns)
 */
export function zunHeadSDF({ wallR = 160, droop = 78, muzzle = 24, scale = 1, embed = 4 } = {}) {
  const s = scale
  // right horn: a flat coiled disc lying on the shoulder (the photo shows no open loop,
  // just a low boss with an incised spiral), joined to the brow by a thick root
  const hc = [19.5 * s, 8.5 * s], hR = [13.5 * s, 13 * s], hz = 3.8 * s
  const root = knots([[4, 14, 4.2], [10, 16, 4.6], [15, 15.5, 4.4]].map(([x, y, r]) => [x * s, y * s, r * s]), 1.0 * s)
  const rootL = root.map(([x, y, z, r]) => [-x, y, z, r])
  // incised spiral on the coil: 1.6 turns, outside → in, following the dome
  const spiral = []
  for (let i = 0; i <= 48; i++) {
    const f = i / 48
    const a = (100 - f * 1.6 * 360) * (Math.PI / 180)
    const rr = 1 - 0.78 * f
    const px = Math.cos(a) * rr * hR[0] * 0.82, py = Math.sin(a) * rr * hR[1] * 0.82
    const zt = 0.4 * s + hz * Math.sqrt(Math.max(0, 1 - (rr * 0.82) ** 2))
    spiral.push([hc[0] + px, hc[1] + py, zt + 0.25 * s, 0.75 * s])
  }
  const spiralL = spiral.map(([x, y, z, r]) => [-x, y, z, r])
  const dr = (droop * Math.PI) / 180
  const A = [0, -1 * s, 6.5 * s]
  const L = muzzle * s
  const B = [0, A[1] - L * Math.sin(dr), A[2] + L * Math.cos(dr)]
  const eyes = [-1, 1].map((sx) => [sx * 10.5 * s, -2.5 * s, 8.6 * s])
  const k = 2.6 * s
  return {
    bounds: { min: [-36 * s, -32 * s, -embed - 1], max: [36 * s, 27 * s, 26 * s] },
    sd(x, y, z0) {
      // bend: the wall curves away from the tangent plane across the width
      const z = z0 + (x * x) / (2 * wallR)
      // base cushion, sunk into the wall
      let d = sdEllipsoid(x, y - 7 * s, z + 1.5 * s, 21 * s, 15 * s, 4.2 * s)
      // horns: flat coiled discs + roots into the brow
      for (const sx of [-1, 1]) d = smin(d, sdEllipsoid(x - sx * hc[0], y - hc[1], z - 0.4 * s, hR[0], hR[1], hz), k)
      d = smin(d, sdFlatTube(x, y, z, root, 0.7), k)
      d = smin(d, sdFlatTube(x, y, z, rootL, 0.7), k)
      // forehead between the horn roots
      d = smin(d, sdEllipsoid(x, y - 6 * s, z - 1.5 * s, 9 * s, 12 * s, 5.2 * s), k)
      // muzzle: a short tapering block, out and down over the carination
      d = smin(d, sdRoundCone(x, y, z, A, B, 10 * s, 8.6 * s), k * 1.2)
      d = smin(d, sdEllipsoid(x, y - B[1], z - B[2], 10.5 * s, 7 * s, 6.5 * s), k * 0.6)
      // small round eyes at the muzzle root, pupils sunk
      for (const e of eyes) {
        d = smin(d, sdEllipsoid(x - e[0], y - e[1], z - e[2], 2.6 * s, 2.4 * s, 2.2 * s), 0.9 * s)
        d = smax(d, -sdEllipsoid(x - e[0] * 1.04, y - e[1], z - e[2] - 2.1 * s, 0.9 * s, 0.9 * s, 0.8 * s), 0.3)
      }
      // nostrils and the incised spiral on each horn
      for (const sx of [-1, 1]) d = smax(d, -sdEllipsoid(x - sx * 2.6 * s, y - B[1] + 0.6 * s, z - B[2] - 6.2 * s, 1.5 * s, 1.6 * s, 1.6 * s), 0.4)
      d = smax(d, -sdFlatTube(x, y, z, spiral, 1), 0.3)
      d = smax(d, -sdFlatTube(x, y, z, spiralL, 1), 0.3)
      // never below the embed depth
      return Math.max(d, -embed - z)
    },
  }
}
