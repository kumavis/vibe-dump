// nezu-fangyi — form: the measured stack, the bulging belly, flange
// silhouettes, the ridge beams and the miniature-roof knob.
// Every number is dossier.md §b (H = 330 mm assumed), mm, Y up, front = +Z
// (a broad face), the left narrow face is −X.

import * as THREE from 'three'

export const H = 330
/** register levels (y, mm) — dossier §b.3 */
export const LV = {
  base: 11.55, // plinth top (0.035 H)
  foot: 46.2, // foot top = belly bottom (0.140 H)
  footFrieze: 22.5, // plain dark band below, frieze above (≈ 0.07 H frieze)
  belly: 128.7, // belly top (0.390 H)
  neck: 160.6, // neck frieze top = mouth band bottom (photo: the plain mouth band is ≈ 14 mm, not the dossier's 17)
  mouth: 174.6, // mouth band top
  lid: 174.9, // eaves underside (0.530 H)
  fascia: 9, // the plain eaves lip: a vertical band under the slopes (photo; dossier 0.53–0.566 H)
  apex: 261, // roof apex (the ridge beams stand on it to ≈ 0.825 H)
  beam: 12, // ridge beam above the apex: a heavy plank, ≈ 8 mm of it showing above the slopes
  knobBase: 273, // post top of the beams (0.825 H)
  knobEave: 294, // knob eaves: the photo's knob roof is squat (≈ 36 mm tall on a ≈ 20 mm post; dossier 0.865 H was est.)
  top: 330,
}
/** plan half-widths (x = broad, z = narrow) — dossier §b.4 */
export const PLAN = {
  base: [88, 75],
  foot: [82.5, 70.5],
  footBand: [80, 68], // the plain dark band under the foot frieze, set back from it

  neck: [86, 73.5],
  mouth: [84.5, 72],
  eave: [93.2, 79.7], // 1.06 W: the photograph's eaves read wider than the dossier's 1.04
  ridgeHalf: 65.5,
  knobEave: [34, 23.5], // photo: eaves ≈ 2.1× the post and ≈ 0.5 of the ridge length (dossier's 74 mm read 1.3× too wide)
  knobTop: [21, 14.5],
  post: [15, 12], // stout: ≈ 0.4–0.5 of the knob eaves in the photograph (dossier 26 mm, review ≈ 30)
}

// belly bulge, dossier §b.5: s, half-W (x), half-D (z)
// The bulge (offset over the bottom edge) is taken at 0.85 of the dossier's: the belly wall then peaks at 185 mm
// (1.05 W, inside the dossier's ±0.04), and the part box with its relief at ≈ 194 mm.
// round 4: back to the dossier's full bulge (×1.0; round 3 had ×0.85) — the photo's silhouette is ≈ 5 % wider than
// the render's, the shortfall all on the far (right) side, where the belly and its corner flanges set the outline
const BELLY_K = 1.0
const BELLY = [
  [0, 84.2, 71.9], [0.05, 86.3, 73.7], [0.1, 87.5, 74.8], [0.2, 89.5, 76.5], [0.3, 91.1, 77.9], [0.4, 92.5, 79.0],
  [0.5, 93.3, 79.8], [0.6, 93.9, 80.3], [0.7, 94.1, 80.4], [0.8, 94.0, 80.3], [0.87, 93.4, 79.9], [0.93, 92.8, 79.3],
  [0.97, 92.3, 78.8], [1.0, 91.9, 78.5],
].map(([s, x, z]) => [s, 84.2 + (x - 84.2) * BELLY_K, 71.9 + (z - 71.9) * BELLY_K])

/** smooth (Catmull-Rom, non-uniform) interpolation through a table column */
function smoothTable(rows, col) {
  const xs = rows.map((r) => r[0]), ys = rows.map((r) => r[col])
  const n = xs.length
  const m = ys.map((_, i) => {
    if (i === 0) return (ys[1] - ys[0]) / (xs[1] - xs[0])
    if (i === n - 1) return (ys[n - 1] - ys[n - 2]) / (xs[n - 1] - xs[n - 2])
    return (ys[i + 1] - ys[i - 1]) / (xs[i + 1] - xs[i - 1])
  })
  return (x) => {
    x = Math.min(xs[n - 1], Math.max(xs[0], x))
    let i = 0
    while (i < n - 2 && x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h
    const t2 = t * t, t3 = t2 * t
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1]
  }
}
export const bellyX = smoothTable(BELLY, 1)
export const bellyZ = smoothTable(BELLY, 2)

const ramp = (x, w) => {
  if (w <= 0) return 1
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}

// ------------------------------------------------------------------ paths

/**
 * A flange path through world points (bottom → top) with an outward direction per point.
 * Extrapolates linearly past both ends (flange caps and hooks run beyond the register).
 */
export function polyPath(pts, outs) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const last = pts.length - 1
  return {
    isPath: true, length: L,
    frame(s) {
      let i = 1
      while (i < last && cum[i] < s) i++
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
      const p = pts[i - 1].clone().lerp(pts[i], t)
      const d = pts[i].clone().sub(pts[i - 1]).normalize()
      const n = outs[i - 1].clone().lerp(outs[i], Math.min(1, Math.max(0, t)))
      n.addScaledVector(d, -n.dot(d)).normalize()
      return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
    },
  }
}

/**
 * Dossier silhouette ([p, s] normalised, wall → around → wall) → the kit's CCW (σ, t) outline in mm.
 * L = register length along the path, P = projection scale (mm), e = root embed (mm), o = σ offset (mm).
 */
export function segmentOutline(poly, L, P, e, o = 0) {
  let pts = poly.map(([p, s]) => [o + s * L, p * P])
  if (pts[0][0] < pts[pts.length - 1][0]) pts = pts.reverse() // crest must run from high σ to low σ
  const sLo = pts[pts.length - 1][0], sHi = pts[0][0]
  return [[sLo, -e], [sHi, -e], ...pts]
}

/** add vertices so no outline edge is longer than `step` mm (the flange mesh follows a curved path only at its vertices) */
export function densify(pts, step = 1.2) {
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    out.push(a)
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)
    for (let k = 1; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  return out
}

/** dossier §b.6 polylines [p, s] */
export const FLANGE_POLY = {
  // belly: a Γ cap whose arm springs out ≈ 1.4× the blade, standing ≈ 6 mm above the belly top with an upturned tip
  // (the widest point of the silhouette in the photograph), a notch, ONE bold tooth, then the edge curves in to a point
  belly: [[0, 1.07], [1.36, 1.07], [1.42, 1.12], [1.48, 1.11], [1.45, 0.99], [1.02, 0.96], [0.92, 0.94], [0.92, 0.83], [1.24, 0.81], [1.24, 0.67], [0.95, 0.65], [0.90, 0.50], [0.78, 0.30], [0.60, 0.12], [0.45, 0.00], [0.35, -0.05], [0.0, 0.02]],
  // neck: a deep notch at mid height and a top hook springing out and up above the neck top
  neck: [[0, 0], [1, 0], [1, 0.46], [0.62, 0.50], [0.62, 0.62], [1, 0.66], [1, 0.92], [1.38, 0.96], [1.45, 1.08], [1.3, 1.10], [0, 1.07]],
  // foot: top arm hooking out, a mid tooth between deep notches, a lower hook dropping onto the plinth ledge
  foot: [[0, 1], [1.3, 1], [1.3, 0.88], [0.78, 0.84], [0.78, 0.57], [1.12, 0.54], [1.12, 0.40], [0.78, 0.37], [0.78, 0.15], [1.2, 0.06], [1.0, -0.05], [0.0, -0.05]],
}

// ------------------------------------------------------------------ the knob (miniature hipped roof on a post)

const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]]
const KNOB_BOW = 2.2 // mm: the knob roof's slightly concave sides
const ST = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]]
/** point on side k of a rectangle (half extents a (x), b (z)) at s ∈ [0, 1] left → right from outside, height y */
export function rectPoint(k, a, b, s, y) {
  const even = (k & 1) === 0
  const D = even ? b : a, Hh = even ? a : b
  const x = (2 * s - 1) * Hh
  return new THREE.Vector3(SN[k][0] * D + ST[k][0] * x, y, SN[k][2] * D + ST[k][2] * x)
}

/** a trapezoid patch from (a0, b0, y0) to (a1, b1, y1) on side k, panel mapped 1:1 (eave width × slant) */
export function trapezoid(kit, k, r0, r1, { relief = null, material, density = 1, fade = 0.6, part, name, bow = 0 }) {
  const [a0, b0, y0] = r0, [a1, b1, y1] = r1
  const even = (k & 1) === 0
  const h0 = even ? a0 : b0, h1 = even ? a1 : b1
  const d0 = even ? b0 : a0, d1 = even ? b1 : a1
  const slant = Math.hypot(y1 - y0, d1 - d0)
  const W = 2 * h0
  const kap = slant / Math.hypot(slant, h0 - h1)
  const quad = kit.quadSurface(rectPoint(k, a0, b0, 0, y0), rectPoint(k, a0, b0, 1, y0), rectPoint(k, a1, b1, 0, y1), rectPoint(k, a1, b1, 1, y1))
  // bow > 0: the slope sags inward by bow·sin(πv) mm (concave sides flaring to the eaves); a function of position
  // only, so neighbouring faces keep their shared hip exactly
  const surface = !bow ? quad : (u, v, out) => {
    quad(u, v, out)
    bowPoint(out.pos, bow, v, a0 + (a1 - a0) * v, b0 + (b1 - b0) * v)
  }
  const geo = kit.buildSurface({
    surface,
    segments: relief ? { density } : [6, 2],
    relief,
    fade: relief ? { u0: 0, u1: 0, v0: fade, v1: fade } : 0,
    panelMap: relief
      ? (u, v, out) => {
          const half = h0 + (h1 - h0) * v
          const x = (2 * u - 1) * half
          out[0] = 0.5 + x / W
          out[1] = v
          out[2] = ramp((half - Math.abs(x)) * kap, fade)
        }
      : null,
  })
  const m = new THREE.Mesh(geo, relief ? new kit.PatinaMaterial({ relief }) : material)
  m.name = name
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  return m
}

/** pull a point on a rectangle (half extents a, b) inward by bow·sin(πv) (both axes, so the hips stay shared) */
export function bowPoint(p, bow, v, a, b) {
  const d = bow * Math.sin(Math.PI * Math.min(1, Math.max(0, v)))
  p.x -= (d * p.x) / a
  p.z -= (d * p.z) / b
  return p
}

/** a plain rectangle loft between two levels (a, b, y) — all four sides */
export function loftBand(kit, r0, r1, { material, part, name }) {
  const out = []
  for (let k = 0; k < 4; k++) out.push(trapezoid(kit, k, r0, r1, { material, part, name: `${name}-${k}` }))
  return out
}

/** a horizontal rectangular ring / cap at height y between inner (ai, bi) and outer (ao, bo), facing up (+1) or down (−1) */
export function capRing(kit, ai, bi, ao, bo, y, { material, part, name, up = 1 }) {
  const out = []
  for (let k = 0; k < 4; k++) {
    // u along the side, v from outer to inner (up) or inner to outer (down) so the normal faces the right way
    const A = up > 0 ? [ao, bo] : [ai, bi], B = up > 0 ? [ai, bi] : [ao, bo]
    const surface = kit.quadSurface(rectPoint(k, A[0], A[1], 0, y), rectPoint(k, A[0], A[1], 1, y), rectPoint(k, B[0], B[1], 0, y), rectPoint(k, B[0], B[1], 1, y))
    const m = new THREE.Mesh(kit.buildSurface({ surface, segments: [4, 1] }), material)
    m.name = `${name}-${k}`
    m.userData.part = part
    m.castShadow = m.receiveShadow = true
    out.push(m)
  }
  return out
}

/**
 * Knob: square post + truncated hipped roof with a thin vertical eave edge and a dished top inside a raised rim.
 * faces: { long: ReliefMap, short: ReliefMap } on the roof slopes. Returns a Group (part 'knob') + anchor data.
 */
export function buildKnob(kit, { material, faces, density }) {
  const g = new THREE.Group()
  g.name = 'knob'
  g.userData.part = 'knob'
  const part = 'knob'
  const [pa, pb] = PLAN.post
  const [ea, eb] = PLAN.knobEave
  const [ta, tb] = PLAN.knobTop
  const yE = LV.knobEave, yF = yE + 2.2, yT = LV.top - 0.6
  // post (from the top of the ridge beams; the lid's socket carries it down into the roof)
  g.add(...loftBand(kit, [pa * 0.97, pb * 0.97, LV.knobBase], [pa, pb, yE + 0.5], { material, part, name: 'knob-post' }))
  // soffit under the eaves (faces down), eave edge, slopes
  g.add(...capRing(kit, pa, pb, ea, eb, yE, { material, part, name: 'knob-soffit', up: -1 }))
  g.add(...loftBand(kit, [ea, eb, yE], [ea, eb, yF], { material, part, name: 'knob-fascia' }))
  for (let k = 0; k < 4; k++) {
    const relief = k % 2 === 0 ? faces?.long : faces?.short
    g.add(trapezoid(kit, k, [ea, eb, yF], [ta, tb, yT], { relief, material, density, part, name: `knob-roof-${k}`, bow: KNOB_BOW }))
  }
  // raised rim and the dished top
  g.add(...loftBand(kit, [ta, tb, yT], [ta, tb, LV.top], { material, part, name: 'knob-rim-out' }))
  const ri = 2.4
  g.add(...capRing(kit, ta - ri, tb - ri, ta, tb, LV.top, { material, part, name: 'knob-rim-top' }))
  g.add(...loftBand(kit, [ta - ri, tb - ri, LV.top], [ta - ri - 0.6, tb - ri - 0.6, LV.top - 0.9], { material, part, name: 'knob-rim-in' }))
  g.add(...capRing(kit, 0.01, 0.01, ta - ri - 0.6, tb - ri - 0.6, LV.top - 0.9, { material, part, name: 'knob-dish' }))
  g.userData.hip = (k) => {
    // the hip (corner) line of the roof between side k and k+1: eave corner → top corner
    const c = rectPoint(k, ea, eb, 1, yF), t = rectPoint(k, ta, tb, 1, yT)
    return { from: c, to: t }
  }
  // the same hip following the concave slopes (12 segments)
  g.userData.hipPts = (k) => {
    const pts = []
    for (let i = 0; i <= 12; i++) {
      const v = i / 12, a = ea + (ta - ea) * v, b = eb + (tb - eb) * v
      pts.push(bowPoint(rectPoint(k, a, b, 1, yF + (yT - yF) * v), KNOB_BOW, v, a, b))
    }
    return pts
  }
  return g
}

/** Plain box (a block of the lid / flange pegs) as a Mesh group. */
export function block(kit, cx, cz, a, b, y0, y1, { material, part, name }) {
  const g = new THREE.Group()
  g.userData.part = part
  g.name = name
  for (const m of loftBand(kit, [a, b, y0], [a, b, y1], { material, part, name })) g.add(m)
  for (const m of capRing(kit, 0.01, 0.01, a, b, y1, { material, part, name: name + '-top' })) g.add(m)
  g.position.set(cx, 0, cz)
  return g
}

// ------------------------------------------------------------------ incised flange flanks

/** inward offset of a CCW polygon by d (miter, clamped) */
function offsetPoly(pts, d) {
  const n = pts.length
  const en = pts.map((a, k) => {
    const b = pts[(k + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    return [dy / l, -dx / l] // outward normal of a CCW polygon
  })
  return pts.map((p, k) => {
    const a = en[(k - 1 + n) % n], b = en[k]
    let mx = a[0] + b[0], my = a[1] + b[1]
    const ml = Math.hypot(mx, my)
    if (ml < 1e-6) { mx = b[0]; my = b[1] } else { mx /= ml; my /= ml }
    const c = Math.max(0.35, mx * b[0] + my * b[1])
    return [p[0] - (mx * d) / c, p[1] - (my * d) / c]
  })
}

/**
 * Incised décor on a flange's flanks (dossier §b.6: T/L lines and small spirals, 0.6 mm wide, inset
 * 1.5 mm): a contour line following the crest, then alternating squared spirals and T-hooks
 * packed along the flank wherever the flange is deep enough. outline = the CCW (σ, t) polygon.
 */
export function flangeGrooves(kit, outline, { inset = 1.5, every = 8.5, pitch = 1.35, seed = 0, spirals = true } = {}) {
  const pts = densify(outline, 0.6)
  const lines = []
  let cur = []
  for (const [s, t] of offsetPoly(pts, inset)) {
    if (t > inset * 1.3) cur.push([s, t])
    else if (cur.length) { if (cur.length > 1) lines.push(cur); cur = [] }
  }
  if (cur.length > 1) lines.push(cur)
  if (!spirals) return lines
  let s0 = Infinity, s1 = -Infinity
  for (const [s, t] of pts) if (t > 0) { s0 = Math.min(s0, s); s1 = Math.max(s1, s) }
  // the crest height over [σ − h, σ + h]: the lowest outline point above the root there
  const crest = (sg, h) => {
    let m = Infinity
    for (let x = sg - h; x <= sg + h; x += 0.5) {
      let best = 0
      for (const [s, t] of pts) if (Math.abs(s - x) < 0.45 && t > best) best = t
      m = Math.min(m, best)
    }
    return m
  }
  const n = Math.max(1, Math.floor((s1 - s0 - 4) / every))
  const step = (s1 - s0 - 4) / n
  for (let i = 0; i < n; i++) {
    const sg = s0 + 2 + step * (i + 0.5)
    const p = crest(sg, step * 0.42)
    const room = p - 2 * inset - 0.6
    if (room < 3.2) continue
    if ((i + seed) % 2 === 0) {
      const turns = room > 5.5 ? 1.5 : 1.0
      const pitch2 = Math.min(pitch * 1.25, room / (turns > 1 ? 3.2 : 2.2))
      lines.push(kit.shapes.sqSpiral([sg, inset + 0.3 + room / 2], { pitch: pitch2, turns, dir: i % 4 === 0 ? 1 : -1, startHeading: 90, rCorner: 0.25 }))
    } else {
      const tTop = inset + 0.3 + room * 0.9, tBot = inset + 0.3 + room * 0.15, hw = Math.min(step * 0.32, 3)
      lines.push([[sg - hw, tTop - 1.2], [sg - hw, tTop], [sg + hw, tTop], [sg + hw, tTop - 1.2]])
      lines.push([[sg, tTop], [sg, tBot]])
    }
  }
  return lines
}
