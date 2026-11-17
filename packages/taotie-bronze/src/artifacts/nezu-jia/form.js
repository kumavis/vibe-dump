// Nezu jia 饕餮文斝 (90067) — FORM: the measured outline and the cast parts that are not the lathe body.
// Everything here is read off the project owner's photo-21.jpg (near side elevation, camera ≈ 4° above the
// rim, ≈ 0.75 m away) and photo-22.jpg (three-quarter from the handle side, ≈ 15° up), scaled to an INFERRED
// rim diameter of 176 mm (reference/nezu-jia/dossier.md § Scale). Units mm, Y up, ground y = 0, azimuth θ in
// degrees: 0 = front (+Z, the lower-frieze mask that faces the camera in photo 21), positive toward +X.
//
//   handle   θ −60 (the left in photo 21), a leg under it (legs at −60, 60, 180)
//   posts    θ 40 and −160: symmetric about the handle plane, ≈ 100° to either side of it
//   masks    lower frieze: noses at 0, ±120 (between the legs); slab flanges at 60, 180 (and the strap at −60)
//   upper    six notched flanges at 0, ±60, ±120, 180 run waist → rim; twelve rising blades, every other one
//            split by a flange; the band under the blades has six masks centred between the flanges (30 + 60k)

import * as THREE from 'three'

export const DEG = Math.PI / 180
export const AZ = {
  handle: -60,
  legs: [-60, 60, 180],
  posts: [40, -160],
  masks: [0, 120, -120],
  slabs: [60, 180],
  upper: [0, 60, 120, 180, -120, -60],
}

// Outer outline, bottom → top ([r, y, join, label]). Lower section: a short drum bulging ≈ 1.5 mm, its rounded
// bottom nearly flat; a 4 mm ledge at its top steps in to the waist; the upper wall rises almost straight for
// 20 mm, then flares ever faster into a thick lip (photo-22 left silhouette, less the ≈ 4 mm flange there).
// Vertical layout (dossier § Proportions): legs 172, drum 57.6, upper wall 92 mm. The outline below was first
// drawn on a 153.6 / 217.6 / 304 layout; yMap carries it (and the handle) onto the measured one.
export const yMap = (y) => (y <= 217.6 ? 172 + (y - 153.6) * 0.9 : 229.6 + (y - 217.6) * 1.065)
export const yUnmap = (y) => (y <= 229.6 ? 153.6 + (y - 172) / 0.9 : 217.6 + (y - 229.6) / 1.065)
const RAW_LOWER = [
  [0, 153.6], [18, 154.1], [34, 155.4], [45, 157.2], [51.5, 159.4], [55.2, 162.2, null, 'drumBottom'],
  [57.1, 167.0], [58.0, 175.0], [58.35, 187.0], [58.3, 197.0], [57.9, 207.0], [57.3, 213.6, null, 'drumTop'], [56.9, 216.6, 'C', 'ledgeOut'],
  [52.6, 217.6, 'C', 'waist'],
]
// Upper wall in FINAL mm (round r8-fix, photo-21 left silhouette below the handle): a concave trumpet — it stands
// almost vertical at r ≈ 51.5 for the first ≈ 30 mm above the waist, then flares ever faster in the top third
// into a rolled lip band ≈ 6 mm deep (near-vertical outer face just under the rim).
const UPPER = [
  [51.6, 232.4], [51.3, 238.0], [51.3, 246.0], [51.6, 254.0], [52.3, 261.0], [53.6, 267.0], [55.8, 272.6],
  [59.0, 278.2], [63.2, 283.8], [68.3, 289.4], [74.0, 295.0], [79.6, 300.6], [84.0, 306.0], [86.6, 310.6],
  [87.5, 314.0, null, 'lipBottom'], [87.9, 318.0], [88.0, 321.6, 'L', 'rim'],
]
export const PROFILE = [
  ...RAW_LOWER.map(([r, y, ...rest]) => [r, +yMap(y).toFixed(2), ...rest]),
  ...UPPER,
]
export const RIM_Y = 321.6
export const BOTTOM_Y = 172
// décor registers (y, mm) — dossier § Registers
export const REG = {
  frieze: [181.5, 225.4], // the lower-section mask frieze: 3 masks × 120°
  band: [232.8, 270.0], // the waist band under the blades: 6 masks × 60°
  blades: [270.0, 319.6], // twelve rising blades × 30° (round r8-fix: tips ≈ 2 mm under the lip, photo-21)
}

export function withNormals(pos) {
  const e = 1e-3
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3()
  return (u, v, out) => {
    pos(u, v, out.pos)
    pos(Math.min(1, u + e), v, a); pos(Math.max(0, u - e), v, b)
    pos(u, Math.min(1, v + e), c); pos(u, Math.max(0, v - e), d)
    a.sub(b); c.sub(d)
    out.nrm.crossVectors(a, c)
    const l = out.nrm.length()
    if (l > 1e-12) out.nrm.multiplyScalar(1 / l)
    else out.nrm.set(0, 0, 0)
  }
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const dirOut = (az) => new THREE.Vector3(Math.sin(az * DEG), 0, Math.cos(az * DEG))
const dirLat = (az) => new THREE.Vector3(Math.cos(az * DEG), 0, -Math.sin(az * DEG)) // 'right' seen from outside

// ----------------------------------------------------------------------------------------------------- LEGS
// Three long blade legs of triangular section (photo-21, photo-22): the sharp edge OUTWARD carries a notched
// flange (≈ 3.5 mm proud, teeth ≈ 6 mm), the two outer faces carry a column of small masks near that edge, the
// flat back (toward the axis) is cut by a long channel that holds the red-brown core / cuprite (the orange strip
// in both photographs). Top: apex at r 54 under the drum, back at r 30; tip: r ≈ 84, 6 × 5 mm, on the ground.
export const LEG = {
  top: BOTTOM_Y + 2, // leg y where it meets the bottom (it runs on `embed` mm into the body)
  embed: 7,
  apexTop: 54.5, apexTip: 84,
  depthTop: 23, depthTip: 4.0,
  chordTop: 36, chordTip: 4.2,
  bow: 0, // (round r8-fix: replaced by the tusk curve in legSection)
  channel: { width: 0.36, depth: 2.6 }, // × chord, mm
}

/** section at leg height y: apex ρ, back ρ, half chord (all mm, local to the leg's azimuth) */
export function legSection(y) {
  const L = LEG
  const t = clamp(y / L.top, 0, 1.2) // 1 at the bottom of the body, 0 at the tip
  // round r8-fix: a tusk — the apex line drops nearly straight from under the drum and kicks outward toward the
  // tip (photo-21 both front legs, photo-22 right leg), rather than bowing evenly
  const a = L.apexTop + (L.apexTip - L.apexTop) * Math.pow(1 - Math.min(1, t), 1.55) + L.bow * Math.sin(Math.PI * clamp(t, 0, 1)) - (t > 1 ? (t - 1) * 6 : 0)
  const d = lerp(L.depthTip, L.depthTop, Math.pow(Math.min(1, t), 0.7))
  const c = lerp(L.chordTip, L.chordTop, Math.pow(Math.min(1, t), 0.72))
  return { apex: a, back: a - d, half: c / 2, depth: d }
}
/** width of one outer face at y (mm) */
export const legFaceWidth = (y) => { const s = legSection(y); return Math.hypot(s.depth, s.half) }
export const LEG_PANEL = { w: Math.ceil(legFaceWidth(LEG.top) + 1), h: Math.ceil(LEG.top + 2) }

/**
 * One leg at azimuth az. faces.L / faces.R: { relief, material } for the two outer faces (panel LEG_PANEL in TRUE mm:
 * x = distance across the face from its back corner (L) / from the apex (R), y = leg height).
 */
export function buildLeg(kit, { az, faces = {}, material, q = 1, seed = 1 }) {
  const out = dirOut(az), lat = dirLat(az)
  const yTop = LEG.top + LEG.embed
  const P = (rho, l, y, v) => v.set(out.x * rho + lat.x * l, y, out.z * rho + lat.z * l)
  const g = new THREE.Group()
  g.name = 'leg'
  g.userData.part = 'legs'
  const add = (geo, mat, name) => {
    const m = new THREE.Mesh(geo, mat)
    m.name = name; m.userData.part = 'legs'; m.castShadow = m.receiveShadow = true
    g.add(m)
    return m
  }
  const nv = Math.max(24, Math.round(90 * Math.sqrt(q)))
  const W = LEG_PANEL.w, Hh = LEG_PANEL.h
  // outer faces: L runs back-left corner → apex, R apex → back-right corner (u left → right seen from outside)
  for (const side of ['L', 'R']) {
    const surf = withNormals((u, v, p) => {
      const y = v * yTop
      const s = legSection(y)
      if (side === 'L') P(lerp(s.back, s.apex, u), lerp(-s.half, 0, u), y, p)
      else P(lerp(s.apex, s.back, u), lerp(0, s.half, u), y, p)
    })
    const f = faces[side]
    const geo = kit.buildSurface({
      surface: surf,
      segments: f?.relief ? { density: 1.25 * Math.sqrt(q) } : [3, nv],
      relief: f?.relief || null,
      fade: { u0: 0.6, u1: 0.6, v0: 1.5, v1: 3 },
      panelMap: (u, v, o) => {
        const y = v * yTop
        const fw = legFaceWidth(y)
        const x = side === 'L' ? W - (1 - u) * fw : u * fw
        o[0] = clamp(x / W, 0, 1)
        o[1] = clamp(y / Hh, 0, 1)
        o[2] = 1
      },
    })
    add(geo, f?.material || material, 'leg-face-' + side)
  }
  // back: flat, with the long channel (seen from the axis: u runs from the +lat corner to the −lat corner)
  const ch = LEG.channel
  const back = withNormals((u, v, p) => {
    const y = v * yTop
    const s = legSection(y)
    const l = lerp(s.half, -s.half, u)
    const cw = ch.width * s.half // half width of the channel
    const k = smooth((cw - Math.abs(l)) / Math.max(0.6, cw * 0.35) + 0.5)
    const fadeTip = smooth((y - 18) / 30) * (1 - smooth((y - (LEG.top - 6)) / 6))
    P(s.back + ch.depth * k * fadeTip * Math.min(1, s.depth / 10), l, y, p)
  })
  add(kit.buildSurface({ surface: back, segments: [Math.round(18 * Math.sqrt(q)) + 6, nv] }), material, 'leg-back')
  // tip: close the small section at y = 0
  add(kit.buildSurface({
    surface: (u, v, o) => {
      const s = legSection(0)
      const pts = [[s.back, -s.half], [s.apex, 0], [s.back, s.half]]
      const t = u * 3, i = Math.min(2, Math.floor(t)), f = t - i
      const A = pts[i], B = pts[(i + 1) % 3]
      const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3
      P(lerp(cx, lerp(A[0], B[0], f), v), lerp(0, lerp(A[1], B[1], f), v), 0, o.pos)
      o.nrm.set(0, -1, 0)
    },
    segments: [9, 1],
  }), material, 'leg-tip')
  // the notched flange on the sharp outer edge (a path along the apex line)
  const y0 = 22, y1 = LEG.top - 1.5
  const tmp = new THREE.Vector3()
  const path = {
    length: 0,
    frame(sig) {
      const y = clamp(lerp(y0, y1, sig / this.length), 0, yTop)
      const s = legSection(y)
      const p = P(s.apex - 0.4, 0, y, new THREE.Vector3())
      const e = 0.5
      const s2 = legSection(y + e), s1 = legSection(y - e)
      const d = P(s2.apex, 0, y + e, new THREE.Vector3()).sub(P(s1.apex, 0, y - e, tmp)).normalize()
      const b = lat.clone()
      const n = new THREE.Vector3().crossVectors(d, b).normalize() // outward, ⟂ the edge
      if (n.dot(out) < 0) n.negate()
      return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
    },
  }
  // arc length of the apex line
  let Ltot = 0
  for (let i = 0; i < 60; i++) {
    const ya = lerp(y0, y1, i / 60), yb = lerp(y0, y1, (i + 1) / 60)
    Ltot += Math.hypot(yb - ya, legSection(yb).apex - legSection(ya).apex)
  }
  path.length = Ltot
  const fl = kit.flange({
    path, height: (f) => lerp(1.5, 2.4, f), thickness: 3.2, embed: 1.0, taper: 6, bevel: 0.6, waver: 0.3, seed,
    notches: { shape: 'square', pitch: 6.2, depth: 0.32, width: 1.6 }, ends: { start: 'taper', end: 'square' },
    material, part: 'legs',
  })
  g.add(fl)
  g.userData.apex = (y) => P(legSection(y).apex, 0, y, new THREE.Vector3())
  return g
}

// ----------------------------------------------------------------------------------------------------- POSTS
// Two posts on the rim (photo-21 crop, photo-22): a square-section stem ≈ 18 × 15 mm (r8-fix; was 24 × 19) standing ≈ 29 mm clear of the
// rim, under a BELL-shaped cap ≈ 70 mm tall: a flat-bottomed skirt Ø ≈ 48, concave flanks waisting to Ø ≈ 29
// ≈ 46 mm up, a small flared lip (Ø 36) and a low dome on top. Four notched flanges run down the bell at the
// stem's corners; between them each flank carries a mask (dark sunk ground, raised bands).
export const POST = {
  r: 79.5, // stem centre radius: just inside the lip (photo-22)
  stem: { w: 18, d: 15, top: 350.4 }, // ≈ 0.35 × the cap skirt on both photographs // tangential × radial; y where the cap starts
  // round r8-fix, re-measured on photo-22 (left cap, ≈ 16° off) and photo-21 (near cap): an hourglass bell — a flat
  // skirt Ø ≈ 48 with a short rim, flanks pinched in hard to a waist ≈ 0.45 × the skirt at ≈ 55–70 % of the height
  // (the corner flanges add ≈ 2.6 mm to the silhouette there), a flared lip Ø ≈ 37 and a low dome.
  cap: [
    [9, 0], [24.6, 0, 'C', 'skirt'], [24.9, 2.5], [23.0, 4.6, 'C', 'flankBottom'], [20.4, 8.1], [18.6, 12.4], [15.9, 17.8],
    [13.4, 24.2], [11.5, 31.0], [10.7, 37.4], [10.6, 43.3], [11.0, 49.2], [12.1, 54.0], [13.8, 57.6, null, 'flankTop'], [16.0, 60.0], [17.6, 61.6, 'C', 'lip'],
    [15.8, 62.8, 'C'], [14.6, 64.4], [11.8, 66.8], [6.6, 68.8], [0, 69.6],
  ],
  flank: [4.6, 57.6], // cap y range carrying the décor
}

/** revolve a Profile between s0 and s1 over θ ∈ [a0, a1] (deg, local: 0 = the post's +out) */
function capPatch(kit, P, s0, s1, a0, a1, relief, q, mat, frame, name, part) {
  const geo = kit.buildSurface({
    surface: withNormals((u, v, p) => {
      const at = P.at(lerp(s0, s1, v))
      const th = lerp(a0, a1, u) * DEG
      frame(at.r * Math.sin(th), at.y, at.r * Math.cos(th), p)
    }),
    segments: relief ? { density: 2.2 * Math.sqrt(q) } : [Math.max(6, Math.round(Math.abs(a1 - a0) / 6)), Math.max(4, Math.round((s1 - s0) / 1.5))],
    relief,
    fade: 0.8,
  })
  const m = new THREE.Mesh(geo, mat)
  m.name = name; m.userData.part = part; m.castShadow = m.receiveShadow = true
  return m
}

/**
 * One post. az: its azimuth on the rim. relief: { flank: ReliefMap (one cap sector, 90°), stem: ReliefMap (a stem face) }.
 * Returns a Group (part 'posts').
 */
export function buildPost(kit, { az, relief = {}, material, decorMaterials = {}, q = 1, seed = 1 }) {
  const out = dirOut(az), lat = dirLat(az)
  const c = out.clone().multiplyScalar(POST.r)
  // local frame: x = lat, z = out, y up
  const frame = (x, y, z, v) => v.set(c.x + lat.x * x + out.x * z, y, c.z + lat.z * x + out.z * z)
  const g = new THREE.Group()
  g.name = 'post'
  g.userData.part = 'posts'
  const add = (m) => { m.userData.part = 'posts'; g.add(m); return m }
  // stem: four faces, y from inside the lip (309) to inside the cap
  const S = POST.stem, y0 = RIM_Y - 3.5, y1 = S.top + 3
  const hw = S.w / 2, hd = S.d / 2
  const faces = [ // [x0,z0] → [x1,z1] left → right seen from outside, plus which relief
    { a: [-hw, hd], b: [hw, hd], key: 'out' },
    { a: [hw, hd], b: [hw, -hd], key: 'side' },
    { a: [hw, -hd], b: [-hw, -hd], key: 'in' },
    { a: [-hw, -hd], b: [-hw, hd], key: 'side' },
  ]
  for (const f of faces) {
    const rel = f.key === 'side' ? null : relief.stem
    const geo = kit.buildSurface({
      surface: (u, v, o) => {
        frame(lerp(f.a[0], f.b[0], u), lerp(y0, y1, v), lerp(f.a[1], f.b[1], u), o.pos)
        // leave nrm to the grid
      },
      segments: rel ? { density: 2 * Math.sqrt(q) } : [2, 4],
      relief: rel || null,
      reliefRect: { u0: 0, u1: 1, v0: (RIM_Y + 0.5 - y0) / (y1 - y0), v1: (S.top - y0) / (y1 - y0) },
      fade: 0.8,
    })
    const m = new THREE.Mesh(geo, rel ? decorMaterials.stem || material : material)
    m.name = 'stem-' + f.key; m.castShadow = m.receiveShadow = true
    add(m)
  }
  // cap: revolved, four décor sectors (centred on the stem faces) between flank s0..s1
  const P = new kit.Profile(POST.cap)
  const capFrame = (x, y, z, v) => frame(x, y + S.top, z, v)
  const sF0 = P.sAtY(POST.flank[0]), sF1 = P.sAtY(POST.flank[1], { from: 'top' })
  for (let k = 0; k < 4; k++) {
    const a0 = -45 + k * 90, a1 = a0 + 90
    add(capPatch(kit, P, sF0, sF1, a0, a1, relief.flank || null, q, relief.flank ? decorMaterials.flank || material : material, capFrame, 'cap-flank', 'posts'))
  }
  add(capPatch(kit, P, 0, sF0, -180, 180, null, q, material, capFrame, 'cap-skirt', 'posts'))
  add(capPatch(kit, P, sF1, P.length, -180, 180, null, q, material, capFrame, 'cap-top', 'posts'))
  // flanges down the bell at the stem's corners (local 45° + 90k). The kit's flange triangulates its face as one
  // planar polygon and fills the hull of a strongly bent path (the hourglass flank), so each flange is cast in six
  // short runs along the profile, end to end: their crests follow the waist and flare at skirt and lip.
  const s0 = P.sAtY(6.2), s1 = P.sAtY(60.8, { from: 'top' })
  const runs = 6, runL = (s1 - s0) / runs
  const capH = (f) => 2.5 + 1.6 * Math.pow(1 - f, 2.5) + 1.4 * Math.pow(f, 6)
  for (let k = 0; k < 4; k++) {
    const th = (45 + 90 * k) * DEG
    const radial = new THREE.Vector3(lat.x * Math.sin(th) + out.x * Math.cos(th), 0, lat.z * Math.sin(th) + out.z * Math.cos(th))
    for (let j = 0; j < runs; j++) {
      const a0 = s0 + j * runL
      const path = {
        length: runL,
        frame(sig) {
          const at = P.at(a0 + clamp(sig, -1, runL + 1))
          const p = capFrame(at.r * Math.sin(th), at.y, at.r * Math.cos(th), new THREE.Vector3())
          const n = radial.clone().multiplyScalar(at.nr).add(new THREE.Vector3(0, at.ny, 0)).normalize()
          const d = radial.clone().multiplyScalar(at.tr).add(new THREE.Vector3(0, at.ty, 0)).normalize()
          return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
        },
      }
      const fl = kit.flange({
        path, height: (f) => capH((j + f) / runs), thickness: 2.8, embed: 1.0, taper: 6, bevel: 0.4, waver: 0.3, seed: seed + k * 10 + j,
        notches: { shape: 'square', pitch: 4.4, depth: 0.32, width: 1.5 }, ends: { start: 'square', end: 'square' },
        material, part: 'posts',
      })
      add(fl)
    }
  }
  return g
}
