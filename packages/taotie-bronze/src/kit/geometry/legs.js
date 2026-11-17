// Legs — research/03 §1.1 (fangding legs), §3.3 (hollow legs), §3.5 (junction,
// décor on legs), §5 (splay / length variance), §6.1.3–4.
//
// columnLeg: a body of revolution r(y) — slight taper and entasis, a swelling
// foot (optionally stepped), raised bowstring rings, a collar where the mask is
// cast, and a flare into the body underside — with a ReliefMap WRAPPED over a
// sector of its upper part (the taotie mask facing outward). Real geometry for
// silhouette, normal map for the line work, as on every decorated wall.
//
// L3 sculpture: every leg is its own Group with userData.part = 'legs'.

import * as THREE from 'three'
import { buildSurface } from './surface.js'
import { withNormals } from './fang.js'
import { flange } from './flange.js'
import { PatinaMaterial } from '../material/patina.js'
import { Rng } from '../util/rng.js'

const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const rad = (d) => (d * Math.PI) / 180
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

/**
 * Radius law r(y) of a columnar leg (exported so authors can size panels and place flanges).
 * @returns {(y:number)=>number}
 */
export function legRadius({
  height, radius, taper = 0, entasis = 0.04, entasisAt = 0.7, foot = { swell: 0.04, height: 0.06 },
  top = null, collar = null, rings = null, embed = 8,
}) {
  const h = height
  const r0 = radius
  const ft = foot || { swell: 0, height: 0 }
  const fH = (ft.height ?? 0.06) <= 1 ? (ft.height ?? 0.06) * h : ft.height
  const tp = { flare: 0.22, height: r0 * 0.55, ...(top || {}) }
  const ringList = []
  if (rings && rings.count > 0) {
    const w = rings.width ?? r0 * 0.12
    const sp = rings.spacing ?? w * 2.2
    const yc = (rings.at ?? 0.5) <= 1 ? (rings.at ?? 0.5) * h : rings.at
    for (let i = 0; i < rings.count; i++) ringList.push({ y: yc + (i - (rings.count - 1) / 2) * sp, w, hh: rings.height ?? r0 * 0.06, soft: !!rings.soft })
  }
  return (y) => {
    const t = clamp(y / h, 0, 1)
    // shaft: linear taper (top = radius·(1 + taper)) + entasis bulge peaking at entasisAt
    let r = r0 * (1 + taper * t)
    const p = entasisAt > 0 && entasisAt < 1 ? Math.log(0.5) / Math.log(entasisAt) : 1
    r += r0 * entasis * Math.sin(Math.PI * Math.pow(t, p))
    // foot: swelling (smooth) or stepped sleeve
    if (ft.swell) {
      if (ft.step) r += r0 * ft.swell * (1 - smooth((y - fH) / Math.max(1, r0 * 0.06)))
      else r += r0 * ft.swell * (1 - smooth(y / Math.max(1, fH)))
    }
    // collar: the mask zone stands proud (Houmuwu), with short shoulders
    if (collar) {
      const c0 = collar.from <= 1 ? collar.from * h : collar.from
      const c1 = collar.to != null ? (collar.to <= 1 ? collar.to * h : collar.to) : h + embed
      const sh = collar.shoulder ?? r0 * 0.08
      r += (collar.amount ?? r0 * 0.08) * smooth((y - c0) / sh) * (1 - smooth((y - c1) / sh))
    }
    for (const g of ringList) {
      const d = Math.abs(y - g.y) / (g.w / 2)
      if (d < 1) r += g.hh * (g.soft ? 0.5 + 0.5 * Math.cos(Math.PI * d) : Math.sqrt(1 - d * d)) // soft: worn rib, no undercut
    }
    // flare into the body underside (fillet 0.15–0.3 × leg diameter)
    const ft2 = (y - (h - tp.height)) / tp.height
    if (ft2 > 0) r += r0 * tp.flare * Math.pow(clamp(ft2, 0, 1), 2.2)
    return r
  }
}

/** Panel size (mm) for a relief wrapped on a leg: arc × zone. */
export function legPanelSize(o) {
  const R = legRadius(o)
  const [y0, y1] = o.relief?.zone ?? o.zone
  const arc = rad(o.relief?.arc ?? o.arc ?? 180)
  let h = 0
  const n = 24
  for (let i = 1; i <= n; i++) {
    const a = lerp(y0, y1, (i - 1) / n), b = lerp(y0, y1, i / n)
    h += Math.hypot(b - a, R(b) - R(a))
  }
  return { w: arc * R((y0 + y1) / 2), h, rMid: R((y0 + y1) / 2) }
}

/**
 * Columnar leg (ding, fangding, li-ding).
 * @param {object} o
 * @param {number} o.height  ground → body underside (mm); the leg also rises `embed` mm into the body
 * @param {number} o.radius  shaft radius at the bottom (mm)
 * @param {number} [o.taper] top radius = radius·(1 + taper)       @param {number} [o.entasis] (+3–6 %) @param {number} [o.entasisAt]
 * @param {{swell, height, step?}} [o.foot]   swelling foot (height ≤ 1 = fraction); step: a sleeve edge instead of a swell
 * @param {{flare, height}} [o.top]          flare into the underside
 * @param {{from, to?, amount, shoulder?}} [o.collar]   raised band for the mask zone (y ≤ 1 = fraction of height)
 * @param {{count, at, width, spacing, height, soft?}} [o.rings]   bowstring ridges (Houmuwu: 3 below the mask); soft: cosine rib instead of a half-round
 * @param {{map: ReliefMap, zone: [y0, y1] mm, arc: deg = 180, facing: deg = 0, fade, material, density}} [o.relief]
 *        the panel is wrapped over `arc` degrees centred on `facing` (0 = +Z, 90 = +X); panel x follows the
 *        surface left → right seen from outside, panel y up; size it with legPanelSize()
 * @param {{wall, open:'bottom'|'none'}} [o.hollow]   hollow cast leg (core); open bottom shows the core void
 * @param {object} [o.flange]   kit.flange opts (height, thickness, notches, hook) placed on the facing axis over the
 *        relief zone (`from`/`to` mm override the zone); swap in the richer flange when it lands
 * @param {{angle, toward:[x,z]}} [o.splay]   tilt about the top joint, foot moving toward `toward` (deg)
 * @param {{seed, splay?, length?, twist?}} [o.cast]   seeded variance (±deg, ±fraction, ±deg about the axis)
 * @returns {THREE.Group} part 'legs'; userData { radius(y), axis: { bottom, top, out }, panel: {w,h} }
 */
export function columnLeg(o) {
  const {
    height, radius, material = new PatinaMaterial(), part = 'legs', density = 0.5, embed = 8, relief = null,
    hollow = null, segments = null,
  } = o
  let h = height
  let splayAng = o.splay?.angle ?? 0
  let toward = o.splay?.toward ?? [0, 1]
  let twist = 0
  if (o.cast) {
    const r = new Rng(o.cast.seed ?? 11)
    h *= 1 + r.jitter(o.cast.length ?? 0.004)
    splayAng += r.jitter(o.cast.splay ?? 1.2)
    twist = r.jitter(o.cast.twist ?? 2)
  }
  const R = legRadius({ ...o, height: h, embed })
  const top = h + embed
  const g = new THREE.Group()
  g.name = 'column-leg'
  g.userData.part = part

  // relief sector: θ in [f − arc/2, f + arc/2]; θ = 0 faces +Z, increases toward +X (left → right from outside)
  const fac = rad((relief?.facing ?? 0) + twist)
  const arc = rad(relief?.arc ?? 180)
  const surf = (th0, th1, y0, y1, sign = 1) =>
    withNormals((u, v, p) => {
      const th = lerp(th0, th1, u)
      const y = lerp(y0, y1, v)
      const r = R(y) * sign
      p.set(Math.sin(th) * r, y, Math.cos(th) * r)
    })
  const cir = 2 * Math.PI * radius
  const vSeg = (y0, y1) => {
    // rings and shoulders need ~2 mm steps; plain shaft much less
    const n = segments?.v ?? Math.ceil((y1 - y0) / Math.max(1.5, Math.min(6, radius * 0.05)))
    return Math.max(2, n)
  }
  const uSeg = (frac) => Math.max(8, Math.ceil(((segments?.u ?? Math.max(48, cir * 0.25)) * frac)))
  const add = (geo, mat, name) => {
    const m = new THREE.Mesh(geo, mat)
    m.name = name
    m.userData.part = part
    m.castShadow = m.receiveShadow = true
    g.add(m)
    return m
  }
  const y0 = hollow && hollow.open === 'bottom' ? 0 : 0
  if (relief && relief.map) {
    const [z0, z1] = relief.zone
    const mat = relief.material || new PatinaMaterial({ relief: relief.map })
    const fade = relief.fade ?? 2
    const full = arc >= Math.PI * 2 - 1e-6
    add(buildSurface({
      surface: surf(fac - arc / 2, fac + arc / 2, z0, z1),
      segments: { density: relief.density ?? density },
      relief: relief.map,
      fade: full ? { u0: 0, u1: 0, v0: fade, v1: fade } : fade,
      maxVerts: relief.maxVerts,
    }), mat, 'leg-relief')
    if (!full) add(buildSurface({ surface: surf(fac + arc / 2, fac - arc / 2 + Math.PI * 2, z0, z1), segments: [uSeg(1 - arc / (Math.PI * 2)), vSeg(z0, z1) ] }), material, 'leg-back')
    if (z0 > y0) add(buildSurface({ surface: surf(fac - Math.PI, fac + Math.PI, y0, z0), segments: [uSeg(1), vSeg(y0, z0)] }), material, 'leg-lower')
    if (z1 < top) add(buildSurface({ surface: surf(fac - Math.PI, fac + Math.PI, z1, top), segments: [uSeg(1), vSeg(z1, top)] }), material, 'leg-upper')
  } else {
    add(buildSurface({ surface: surf(fac - Math.PI, fac + Math.PI, y0, top), segments: [uSeg(1), vSeg(y0, top)] }), material, 'leg-shaft')
  }
  // bottom: closed disc, or an annulus with the core void (hollow, open bottom)
  const wall = hollow ? hollow.wall ?? radius * 0.3 : 0
  const ri = hollow && hollow.open === 'bottom' ? Math.max(1, R(0) - wall) : 0
  add(buildSurface({
    surface: (u, v, out) => {
      const th = lerp(Math.PI, -Math.PI, u)
      const r = lerp(R(0), ri, v)
      out.pos.set(Math.sin(th) * r, 0, Math.cos(th) * r)
      out.nrm.set(0, -1, 0)
    },
    segments: [uSeg(1), 1],
  }), material, 'leg-sole')
  if (hollow && hollow.open === 'bottom') {
    const inner = new PatinaMaterial({ interior: 1 })
    const yTop = h - wall * 0.5
    const Ri = (y) => Math.max(1, R(Math.min(y, h * 0.85)) - wall)
    add(buildSurface({
      surface: withNormals((u, v, p) => {
        const th = lerp(Math.PI, -Math.PI, u)
        const y = lerp(0, yTop, v)
        const r = Ri(y)
        p.set(Math.sin(th) * r, y, Math.cos(th) * r)
      }),
      segments: [uSeg(1), 8],
    }), inner, 'leg-core')
    add(buildSurface({
      surface: (u, v, out) => {
        const th = lerp(Math.PI, -Math.PI, u)
        const r = lerp(Ri(yTop), 0, v)
        out.pos.set(Math.sin(th) * r, yTop, Math.cos(th) * r)
        out.nrm.set(0, -1, 0)
      },
      segments: [uSeg(1), 1],
    }), inner, 'leg-core-top')
  }
  // flange on the facing axis
  const outDir = new THREE.Vector3(Math.sin(fac), 0, Math.cos(fac))
  const ax = (y) => outDir.clone().multiplyScalar(R(y)).setY(y)
  const zone = relief?.zone ?? [h * 0.55, h]
  if (o.flange) {
    const f0 = o.flange.from ?? zone[0] + 4
    const f1 = o.flange.to ?? zone[1] - 2
    const fl = flange({ material, notches: { every: 18, depth: 0.42, width: 3 }, ...o.flange, from: ax(f0), to: ax(f1), out: outDir.clone() })
    g.add(fl)
  }
  // splay about the top joint
  if (splayAng) {
    const t = new THREE.Vector3(toward[0], 0, toward[1]).normalize()
    const axis = new THREE.Vector3(0, 1, 0).cross(t).normalize().negate() // rotating by +ang moves the foot toward t
    const m = new THREE.Matrix4().makeTranslation(0, h, 0)
      .multiply(new THREE.Matrix4().makeRotationAxis(axis, rad(splayAng)))
      .multiply(new THREE.Matrix4().makeTranslation(0, -h, 0))
    for (const c of g.children) {
      c.geometry.applyMatrix4(m)
      c.geometry.computeBoundingBox()
      c.geometry.computeBoundingSphere()
    }
  }
  g.userData.radius = R
  g.userData.height = h
  g.userData.axis = { bottom: ax(zone[0]), top: ax(zone[1]), out: outDir }
  if (relief) g.userData.panel = legPanelSize({ ...o, height: h })
  return g
}

/**
 * Blade leg (jue, jia): a triangular-section blade tapering to the tip, sharp outer edge.
 * Stands on y = 0 (tip) and rises to `height` (+embed); the sharp edge faces +Z.
 * @param {{height, chord, thickness, tipChord?, splay?: deg, outCurve?: mm, material, part}} o
 */
export function bladeLeg({ height, chord, thickness, tipChord = 0.25, splay = 0, outCurve = 0, embed = 6, material = new PatinaMaterial(), part = 'legs' }) {
  const h = height + embed
  const sec = (y) => {
    const t = clamp(y / height, 0, 1)
    const c = chord * lerp(tipChord, 1, Math.pow(t, 0.8))
    const w = thickness * lerp(0.35, 1, t)
    const bow = outCurve * Math.sin(Math.PI * t)
    // triangle: sharp edge at +Z, flat back at −Z
    return [[0, bow + c * 0.55], [w / 2, bow - c * 0.45], [-w / 2, bow - c * 0.45]]
  }
  const g = new THREE.Group()
  g.userData.part = part
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3
    const geo = buildSurface({
      surface: withNormals((u, v, p) => {
        const y = v * h
        const s = sec(y)
        const a = s[i], b = s[j]
        p.set(lerp(a[0], b[0], u), y, lerp(a[1], b[1], u))
      }),
      segments: [2, 24],
    })
    // the loop a→b runs clockwise seen from above for i order above; flip if needed by buildSurface winding
    const m = new THREE.Mesh(geo, material)
    m.userData.part = part
    m.castShadow = m.receiveShadow = true
    g.add(m)
  }
  if (splay) g.rotation.x = rad(splay)
  return g
}
