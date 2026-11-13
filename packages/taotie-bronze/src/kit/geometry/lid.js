// Hipped-roof lids and roof-shaped knobs (fangyi, fanglei) — research/03
// §1.10, §4.3 (lid flanges echo the body's), §6.1.9, §6.3 (lid UVs).
//
// The roof is a loft of nested rectangles: at level v (0 = eave line, 1 =
// ridge) the section is a rectangle of half extents (a(v), b(v)) at height
// y(v), b(1) = 0. Each of the four slopes is one patch over (u along its eave,
// v up), so the hips are shared exactly. Front/back slopes are trapezoids,
// left/right are triangles. Panels map 1:1 in mm ('true'): panel width = the
// slope's eave length, panel height = its slant length up the centre line,
// eave at panel y = 0 — décor on lids is inverted relative to the body (the
// taotie's forehead at the eave), which is the motif author's business.
//
// Lid frame: stands on y = 0 (the bottom of the skirt), centred on the Y axis,
// front = +Z. Place it with lid.position.y = body.userData.rim.y.

import * as THREE from 'three'
import { buildSurface } from './surface.js'
import { withNormals, SIDES } from './fang.js'
import { PatinaMaterial } from '../material/patina.js'

const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]]
const ST = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]]
const lerp = (a, b, t) => a + (b - a) * t
const rad = (d) => (d * Math.PI) / 180
function ramp(x, w) {
  if (w <= 0) return 1
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}
function pick(obj, k) {
  if (!obj) return undefined
  if (obj[SIDES[k]] !== undefined) return obj[SIDES[k]]
  const kind = k % 2 === 0 ? 'long' : 'short'
  return obj[kind] !== undefined ? obj[kind] : obj.all
}

/** point on side k of a rectangle loft: level {a, b, y}, s ∈ [0, 1] left → right from outside */
function rectPoint(k, L, s, p) {
  const even = (k & 1) === 0
  const D = even ? L.b : L.a
  const H = even ? L.a : L.b
  const x = (2 * s - 1) * H
  const n = SN[k], t = ST[k]
  return p.set(n[0] * D + t[0] * x, L.y, n[2] * D + t[2] * x)
}

/** Build the 4 side patches of a rectangle loft. level(v) → {a, b, y}. */
function loft(group, level, { material, part, name, segV = 1, segU = 4, faces = null, map = null, density = 0.6 }) {
  const out = []
  for (let k = 0; k < 4; k++) {
    const L = { a: 0, b: 0, y: 0 }
    const pos = (u, v, p) => {
      const l = level(v)
      L.a = l.a; L.b = l.b; L.y = l.y
      return rectPoint(k, L, u, p)
    }
    const sp = faces ? pick(faces, k) : null
    const spec = sp ? (sp.macro ? { relief: sp } : sp) : null
    const mat = spec ? spec.material || matCache(spec.relief) : material
    const geo = buildSurface({
      surface: withNormals(pos),
      segments: spec ? { density: spec.density ?? density } : [segU, segV],
      relief: spec?.relief ?? null,
      fade: spec ? { u0: 0, u1: 0, v0: spec.fade ?? 1.5, v1: spec.fade ?? 1.5 } : 0,
      panelMap: spec && map ? map(k, spec) : null,
    })
    const m = new THREE.Mesh(geo, mat)
    m.name = `${name}-${SIDES[k]}`
    m.userData.part = part
    m.castShadow = m.receiveShadow = true
    group.add(m)
    out.push(m)
  }
  return out
}
const _mats = new WeakMap()
function matCache(relief) {
  if (!_mats.has(relief)) _mats.set(relief, new PatinaMaterial({ relief }))
  return _mats.get(relief)
}

function resolveRoof(o) {
  const W = o.width, D = o.depth
  const A = W / 2, B = D / 2
  const ridgeHalf = ((o.ridge ?? 0.4) <= 1 ? (o.ridge ?? 0.4) * W : o.ridge) / 2
  const rh = Math.min(ridgeHalf, A - 1e-3)
  const rise = o.rise ?? B * Math.tan(rad(o.slope ?? 38))
  const c = o.concave ?? 0
  const g = (v) => (1 - c) * v + c * v * v
  const sk = { height: 0, overhang: 0, fascia: 0, ...(o.skirt || {}) }
  const y0 = sk.height + (sk.fascia ?? 0)
  const level = (v) => ({ a: lerp(A, rh, v), b: lerp(B, 0, v), y: y0 + rise * g(v) })
  // slant length up each face's centre line
  const N = 48
  const arcF = new Float32Array(N + 1), arcS = new Float32Array(N + 1)
  for (let i = 1; i <= N; i++) {
    const p = level((i - 1) / N), q = level(i / N)
    arcF[i] = arcF[i - 1] + Math.hypot(q.b - p.b, q.y - p.y)
    arcS[i] = arcS[i - 1] + Math.hypot(q.a - p.a, q.y - p.y)
  }
  const arc = (k, v) => {
    const t = (k & 1) === 0 ? arcF : arcS
    const f = v * N, i = Math.min(N - 1, Math.floor(f))
    return lerp(t[i], t[i + 1], f - i)
  }
  return { A, B, rh, rise, level, arc, y0, sk, top: y0 + rise }
}

/** Panel sizes for the four slopes (mm), before building. */
export function hippedLidLayout(o) {
  const R = resolveRoof(o)
  const faces = {}
  for (let k = 0; k < 4; k++) {
    const even = (k & 1) === 0
    const w = 2 * (even ? R.A : R.B)
    const h = R.arc(k, 1)
    const outline = []
    for (let i = 0; i <= 12; i++) {
      const l = R.level(i / 12)
      outline.push([w / 2 - (even ? l.a : l.b), R.arc(k, i / 12)])
    }
    for (let i = 12; i >= 0; i--) {
      const l = R.level(i / 12)
      outline.push([w / 2 + (even ? l.a : l.b), R.arc(k, i / 12)])
    }
    faces[SIDES[k]] = { w, h, outline, shape: even && R.rh > 0 ? 'trapezoid' : 'triangle' }
  }
  return { faces, rise: R.rise, top: R.top, ridge: 2 * R.rh }
}

/**
 * Hipped-roof lid.
 * @param {object} o
 * @param {number} o.width,o.depth   eave line (outer) dims, mm (X, Z)
 * @param {number} [o.rise]          eave → ridge height (mm), or `slope` (deg, long faces; research 30–40°)
 * @param {number} [o.ridge]         ridge length, fraction of width (≤ 1) or mm; 0 = pyramid
 * @param {number} [o.concave]       0 straight slopes … 0.4 bell-cast (flatter at the eaves)
 * @param {{height, overhang?, fascia?}} [o.skirt]   vertical band below the eaves (sits on the body rim);
 *        overhang = eaves project beyond the skirt (mm), fascia = vertical eave edge height (mm)
 * @param {number} [o.thickness]     shell thickness (mm)
 * @param {{depth, clearance?, thickness?}} [o.seat]   inner lip dropping into the body mouth: its outer face sits
 *        `clearance` mm inside the skirt's inner face
 * @param {object} [o.faces]         { front|right|back|left|long|short|all: ReliefMap | { relief, material, fade } }
 * @param {object} [o.knob]          roofKnob() opts, placed on the ridge centre
 * @returns {THREE.Group} part 'lid'; userData { hips: [Vector3[]] ×4 (front-right, right-back, back-left, left-front),
 *          midlines: { front: Vector3[] … }, ridge: [Vector3, Vector3], top, layout, knob }
 */
export function hippedLid(o) {
  const { material = new PatinaMaterial(), part = 'lid', thickness = 4, density = 0.6 } = o
  const interiorMaterial = o.interiorMaterial || new PatinaMaterial({ interior: 1 })
  const R = resolveRoof(o)
  const { A, B, rh, level, sk } = R
  const ov = sk.overhang ?? 0
  const as = A - ov, bs = B - ov
  const g = new THREE.Group()
  g.name = 'hipped-lid'
  g.userData.part = part
  const t = thickness
  const hs = sk.height
  const fy = R.y0
  const roofSegV = Math.max(12, Math.ceil(R.arc(0, 1) / 6))
  const segU = (k) => Math.max(4, Math.ceil(2 * ((k & 1) === 0 ? A : B) / 20))
  const lev = (a, b, y) => ({ a, b, y })

  // outer roof with relief (1:1 'true' mapping)
  const map = (k, spec) => {
    const even = (k & 1) === 0
    const W = 2 * (even ? A : B)
    const total = R.arc(k, 1)
    // hip slant in panel: horizontal run (A − rh or B) over the face slant
    const kap = total / Math.hypot(total, even ? A - rh : B)
    const fade = spec.fade ?? 1.5
    return (u, v, out) => {
      const l = level(v)
      const half = even ? l.a : l.b
      const x = (2 * u - 1) * half
      out[0] = 0.5 + x / W
      out[1] = R.arc(k, v) / total
      out[2] = ramp((half - Math.abs(x)) * kap, fade)
    }
  }
  loft(g, level, { material, part, name: 'lid-roof', segV: roofSegV, faces: o.faces, map, density })
  // fascia, soffit, skirt
  if ((sk.fascia ?? 0) > 0) loft(g, (v) => lev(A, B, lerp(hs, fy, v)), { material, part, name: 'lid-fascia', segV: 1 })
  if (ov > 0) loft(g, (v) => lev(lerp(as, A, v), lerp(bs, B, v), hs), { material, part, name: 'lid-soffit', segV: 1 })
  if (hs > 0) loft(g, (v) => lev(as, bs, lerp(0, hs, v)), { material, part, name: 'lid-skirt', segV: 2 })
  // bottom ring of the skirt (inner → outer, faces down)
  loft(g, (v) => lev(lerp(as - t, as, v), lerp(bs - t, bs, v), 0), { material, part, name: 'lid-bottom', segV: 1 })
  // inside: skirt inner face (down) and the roof underside (apex → eaves, down)
  const ai = as - t, bi = bs - t
  const yi = Math.max(t, fy - t * 0.3)
  if (yi > 0) loft(g, (v) => lev(ai, bi, lerp(yi, 0, v)), { material: interiorMaterial, part, name: 'lid-inner-skirt', segV: 1 })
  const topI = R.top - t * 1.6
  const rhi = Math.max(0, rh - t)
  loft(g, (v) => {
    const w = 1 - v
    const c = o.concave ?? 0
    return lev(lerp(ai, rhi, w), lerp(bi, 0, w), yi + (topI - yi) * ((1 - c) * w + c * w * w))
  }, { material: interiorMaterial, part, name: 'lid-underside', segV: 8 })
  // seat lip
  if (o.seat) {
    const sd = o.seat.depth ?? 8
    const cl = o.seat.clearance ?? 0.8
    const st = o.seat.thickness ?? t
    const sa = (o.seat.width ?? 2 * (ai - cl)) / 2, sb = (o.seat.depth2 ?? 2 * (bi - cl)) / 2
    loft(g, (v) => lev(sa, sb, lerp(-sd, 0.5, v)), { material: interiorMaterial, part, name: 'lid-seat-out', segV: 1 })
    loft(g, (v) => lev(lerp(sa - st, sa, v), lerp(sb - st, sb, v), -sd), { material: interiorMaterial, part, name: 'lid-seat-bottom', segV: 1 })
    loft(g, (v) => lev(sa - st, sb - st, lerp(0.5, -sd, v)), { material: interiorMaterial, part, name: 'lid-seat-in', segV: 1 })
  }
  void segU

  // anchors for flanges (hips, slope midlines, ridge) — polylines on the outer roof
  const P = (k, s, v) => rectPoint(k, level(v), s, new THREE.Vector3())
  const hips = []
  const midlines = {}
  for (let k = 0; k < 4; k++) {
    const pts = []
    for (let i = 0; i <= 12; i++) pts.push(P(k, 1, i / 12))
    hips.push(pts)
    const mid = []
    for (let i = 0; i <= 12; i++) mid.push(P(k, 0.5, i / 12))
    midlines[SIDES[k]] = mid
  }
  g.userData.hips = hips
  g.userData.midlines = midlines
  g.userData.ridge = [new THREE.Vector3(-rh, R.top, 0), new THREE.Vector3(rh, R.top, 0)]
  g.userData.top = R.top
  g.userData.layout = hippedLidLayout(o)
  if (o.knob) {
    const kn = roofKnob({ material, part, ...o.knob })
    kn.position.y = R.top
    g.add(kn)
    g.userData.knob = kn
  }
  return g
}

/**
 * Roof-shaped knob on a short (waisted) post: a miniature hipped roof.
 * Origin at the post's foot (place it on the ridge); the post sinks `embed` mm into the roof.
 * @param {{width, depth, rise?|slope?, ridge?, concave?, skirt?: {height, overhang?}, post: {height, width, depth?, waist?},
 *          faces?, embed?, material, part}} o
 * @returns {THREE.Group} part (default 'lid' so it measures with the lid); userData.hips/midlines/top
 */
export function roofKnob(o) {
  const { material = new PatinaMaterial(), part = 'lid' } = o
  const g = new THREE.Group()
  g.name = 'roof-knob'
  g.userData.part = part
  const post = { height: o.depth * 0.6, width: o.depth * 0.45, waist: 0.12, ...(o.post || {}) }
  const pd = post.depth ?? post.width
  const embed = o.embed ?? Math.max(4, post.height * 0.4)
  const ph = post.height
  loft(g, (v) => {
    const y = lerp(-embed, ph + 1, v)
    const tt = Math.max(0, Math.min(1, y / ph))
    const k = 1 - (post.waist ?? 0) * Math.sin(Math.PI * tt)
    return { a: (post.width / 2) * k, b: (pd / 2) * k, y }
  }, { material, part, name: 'knob-post', segV: 10 })
  const R = resolveRoof(o)
  const yb = ph
  const sk = R.sk
  const lv = (v) => {
    const l = R.level(v)
    return { a: l.a, b: l.b, y: l.y + yb }
  }
  loft(g, lv, { material, part, name: 'knob-roof', segV: 10, faces: o.faces })
  if (sk.height > 0) {
    const ov = sk.overhang ?? 0
    loft(g, (v) => ({ a: R.A - ov, b: R.B - ov, y: yb + v * sk.height }), { material, part, name: 'knob-skirt', segV: 1 })
    if (ov > 0) loft(g, (v) => ({ a: lerp(R.A - ov, R.A, v), b: lerp(R.B - ov, R.B, v), y: yb + sk.height }), { material, part, name: 'knob-soffit', segV: 1 })
    if ((sk.fascia ?? 0) > 0) loft(g, (v) => ({ a: R.A, b: R.B, y: yb + lerp(sk.height, R.y0, v) }), { material, part, name: 'knob-fascia', segV: 1 })
  }
  // closed underside
  const ov = sk.overhang ?? 0
  loft(g, (v) => ({ a: lerp(0.0, R.A - ov, v) + (R.A - R.B) * (1 - v) * 0, b: lerp(0, R.B - ov, v), y: yb }), {
    material, part, name: 'knob-base', segV: 1,
  })
  const hips = []
  for (let k = 0; k < 4; k++) {
    const pts = []
    for (let i = 0; i <= 8; i++) pts.push(rectPoint(k, lv(i / 8), 1, new THREE.Vector3()))
    hips.push(pts)
  }
  g.userData.hips = hips
  g.userData.top = yb + R.top
  return g
}
