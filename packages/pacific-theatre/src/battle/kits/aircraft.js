// buildAircraftGeometry (ENGINEERING.md §6): an aircraft kit's body (fuselage,
// wings, tail, canopy, nacelles, fixed gear or floats, the national markings
// as decal quads into the one insignia atlas) and its propeller discs, in
// metres in the model frame (origin at the centre of gravity, nose toward −z,
// y up), flat-shaded and vertex-coloured for the one aircraft material.
// Deterministic: the same kit and colour date give the same geometry.
// Throws on a shape word it does not know.
//
// Proportions come from the kit's numbers (span, length, height, wing area)
// and the shape words of DATA.md §8 (wing low, mid, high or parasol; tail
// single or twin; canopy long-frame, short-frame, bubble or cockpit; gear
// retract or fixed; cowl radial or inline; dihedral), plus `floats` (single,
// twin, boat) for the float and flying-boat types, an addition to the
// vocabulary. The Zero's long greenhouse against the Wildcat's stubby canopy,
// the D3A's spatted gear and the P-40's pointed nose fall out of these.

import { Builder, MAT } from './builder.js'
import { paletteFor } from './palette.js'

export const WINGS = ['low', 'mid', 'high', 'parasol']
export const TAILS = ['single', 'twin']
export const CANOPIES = ['long-frame', 'short-frame', 'bubble', 'cockpit']
export const GEARS = ['retract', 'fixed']
export const COWLS = ['radial', 'inline']
export const FLOATS = ['single', 'twin', 'boat']
export const INSIGNIA = ['hinomaru', 'hinomaru-white-surround', 'star-red-centre', 'star-no-red', 'star-bar-red-outline', 'star-bar-blue', 'roundel-raaf', 'roundel-rnzaf']

const toMs = (d) => (d == null ? null : typeof d === 'number' ? d : Date.parse(String(d).length <= 7 ? `${d}-01T00:00Z` : String(d).length <= 10 ? `${d}T00:00Z` : d))

/** The kit's colours at a date (the dated entry holding it, else the nearest). */
export function aircraftColoursAt(kit, colourDate) {
  const C = kit.colours || []
  if (!C.length) return { upper: 'neutral-grey', lower: 'neutral-grey', insignia: kit.side === 'jp' ? 'hinomaru' : 'star-no-red' }
  const ms = toMs(colourDate)
  if (ms == null) return C[0]
  for (const c of C) if (ms >= toMs(c.from) && ms < toMs(c.to)) return c
  return ms < toMs(C[0].from) ? C[0] : C[C.length - 1]
}

function assertShape(kit) {
  const s = kit.shape || {}
  const bad = (k, v, list) => {
    if (!list.includes(v)) throw new Error(`kit ${kit.id}: shape.${k} “${v}” is not one of ${list.join(', ')}`)
  }
  bad('wing', s.wing, WINGS)
  bad('tail', s.tail, TAILS)
  bad('canopy', s.canopy, CANOPIES)
  bad('gear', s.gear, GEARS)
  bad('cowl', s.cowl ?? kit.engine?.kind, COWLS)
  if (s.floats != null) bad('floats', s.floats, FLOATS)
}

export function buildAircraftGeometry(kit, { colourDate = null } = {}) {
  assertShape(kit)
  const s = kit.shape
  const c = aircraftColoursAt(kit, colourDate)
  if (!INSIGNIA.includes(c.insignia)) throw new Error(`kit ${kit.id}: insignia “${c.insignia}”`)
  const up = paletteFor(c.upper)
  const lo = paletteFor(c.lower)
  const glass = paletteFor('canopy')
  const cowlCol = kit.side === 'jp' && s.cowl === 'radial' ? paletteFor('ijn-cowl') : up
  const b = new Builder()
  const L = kit.length
  const span = kit.span
  const S = kit.wingM2 || (span * span) / 6
  const engines = kit.engine?.count || 1
  const multi = engines > 1 || kit.type === 'bomber' || kit.type === 'patrol' && engines > 1
  const boat = s.floats === 'boat'
  const R = L * (multi ? (boat ? 0.075 : 0.052) : s.cowl === 'inline' ? 0.053 : kit.type === 'fighter' ? 0.07 : 0.066)
  const zNose = -0.3 * L
  const zTail = 0.7 * L
  const zAtS = (t) => zNose + (zTail - zNose) * t
  // --- fuselage ------------------------------------------------------------------
  const prof = (t) => {
    if (s.cowl === 'inline' && !multi) {
      if (t < 0.22) return 0.2 + 0.8 * Math.sin((Math.PI / 2) * (t / 0.22))
      return 1 - 0.83 * Math.pow((t - 0.22) / 0.78, 1.3)
    }
    if (multi) {
      if (t < 0.12) return 0.35 + 0.65 * Math.sin((Math.PI / 2) * (t / 0.12))
      if (t < 0.55) return 1
      return 1 - 0.85 * Math.pow((t - 0.55) / 0.45, 1.2)
    }
    if (t < 0.03) return 0.82 + 0.18 * (t / 0.03)
    if (t < 0.36) return 1
    return 1 - 0.84 * Math.pow((t - 0.36) / 0.64, 1.25)
  }
  const tailRise = (t) => (t > 0.55 ? (t - 0.55) * R * 0.9 : 0)
  const RING = 10
  const sections = []
  const ts = [0, 0.015, 0.04, 0.08, 0.13, 0.2, 0.28, 0.36, 0.45, 0.55, 0.65, 0.75, 0.85, 0.93, 1]
  for (const t of ts) {
    const r = R * prof(t)
    const rh = r * (boat ? 1.35 : 1.12)
    const yc = tailRise(t) - (boat ? r * 0.35 : 0)
    const ring = []
    for (let k = 0; k < RING; k++) {
      const a = (k / RING) * Math.PI * 2
      let y = Math.sin(a) * rh
      if (boat && y < 0) y *= 1.25 - 0.25 * Math.abs(Math.cos(a))
      ring.push([Math.cos(a) * r, yc + y, zAtS(t)])
    }
    sections.push(ring)
  }
  const fuseCol = (x, y, z) => {
    const t = (z - zNose) / (zTail - zNose)
    if (t < 0.11 && !multi) return cowlCol
    return y > tailRise(t) - R * 0.15 ? up : lo
  }
  b.loft(sections, fuseCol, { closed: true, capStart: true, capEnd: true })

  // --- wings -------------------------------------------------------------------------
  const lam = multi ? 0.45 : 0.5
  const cr = (2 * S) / (span * (1 + lam))
  const ct = cr * lam
  const rhMax = R * (boat ? 1.35 : 1.12)
  const wingY = s.wing === 'low' ? -0.6 * rhMax : s.wing === 'mid' ? -0.05 * rhMax : s.wing === 'high' ? 0.75 * rhMax : 1.9 * rhMax
  const zLE = -0.32 * cr
  const dih = ((s.dihedral ?? 5) * Math.PI) / 180
  const wingSection = (x, chord, y, zle, th) => [
    [x, y, zle],
    [x, y + th * 0.6, zle + chord * 0.3],
    [x, y + th * 0.15, zle + chord],
    [x, y - th * 0.35, zle + chord * 0.3],
  ]
  const wingCol = (x, y, z, ny) => (ny >= 0 ? up : lo)
  const half = span / 2
  for (const sg of [1, -1]) {
    const x0 = sg * R * 0.6
    const x1 = sg * half
    const yTip = wingY + Math.tan(dih) * (half - Math.abs(x0))
    const sweep = cr * 0.08
    const A = wingSection(x0, cr, wingY, zLE, cr * 0.13)
    const B = wingSection(x1, ct, yTip, zLE + (cr - ct) * 0.3 + sweep, ct * 0.09)
    b.loft([A, B], wingCol, { closed: true, capEnd: true })
  }
  if (s.wing === 'parasol') {
    // the pylon and struts that hold it
    b.box(0, rhMax * 0.6, zLE + cr * 0.45, R * 0.6, wingY - rhMax * 0.6, cr * 0.7, up)
    for (const sg of [1, -1]) b.cyl([sg * R * 0.9, -rhMax * 0.2, zLE + cr * 0.4], [sg * half * 0.45, wingY, zLE + cr * 0.4], 0.07, 0.07, lo, MAT.metal, 4)
  }
  if (kit.id === 'f1m2' || (s.wing === 'high' && s.floats === 'single')) {
    // (the F1M is a biplane: a lower wing and struts)
    for (const sg of [1, -1]) {
      const A = wingSection(sg * R * 0.6, cr * 0.85, -0.7 * rhMax, zLE + cr * 0.1, cr * 0.1)
      const Bw = wingSection(sg * half * 0.85, ct * 0.85, -0.7 * rhMax + Math.tan(dih) * half * 0.85, zLE + cr * 0.25, ct * 0.08)
      b.loft([A, Bw], wingCol, { closed: true, capEnd: true })
      b.cyl([sg * half * 0.6, -0.7 * rhMax + Math.tan(dih) * half * 0.6, zLE + cr * 0.4], [sg * half * 0.6, wingY + Math.tan(dih) * half * 0.6, zLE + cr * 0.4], 0.06, 0.06, lo, MAT.metal, 4)
    }
  }
  // --- tail ----------------------------------------------------------------------------
  const zt = zAtS(0.88)
  const ty = tailRise(0.9)
  const hs = span * (multi ? 0.33 : 0.36) * 0.5
  const hc = cr * 0.42
  for (const sg of [1, -1]) {
    const A = wingSection(sg * R * 0.2, hc, ty, zt - hc * 0.3, hc * 0.1)
    const B = wingSection(sg * hs, hc * 0.6, ty, zt - hc * 0.1, hc * 0.07)
    b.loft([A, B], wingCol, { closed: true, capEnd: true })
  }
  const finH = span * (multi ? 0.16 : 0.13) * (s.tail === 'twin' ? 0.7 : 1)
  const finAt = s.tail === 'twin' ? [hs, -hs] : [0]
  for (const fx of finAt) {
    const fc = hc * 1.1
    const base = [
      [fx, ty, zt - fc * 0.5],
      [fx + 0.08, ty, zt + fc * 0.5],
      [fx - 0.08, ty, zt + fc * 0.5],
    ]
    const top = [
      [fx, ty + finH, zt + fc * 0.05],
      [fx + 0.05, ty + finH, zt + fc * 0.5],
      [fx - 0.05, ty + finH, zt + fc * 0.5],
    ]
    b.loft([base, top], up, { closed: true, capEnd: true })
  }
  // --- canopy ------------------------------------------------------------------------------
  const canopy = (t0, t1, hgt, w = 0.62) => {
    const z0 = zAtS(t0)
    const z1 = zAtS(t1)
    const top = R * prof((t0 + t1) / 2) * 1.05
    const ring = (z, k) => {
      const out = []
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI
        out.push([Math.cos(a) * R * w * k, top * 0.7 + Math.sin(a) * hgt * k, z])
      }
      return out
    }
    b.loft([ring(z0, 0.4), ring(z0 + (z1 - z0) * 0.25, 1), ring(z1 - (z1 - z0) * 0.15, 0.95), ring(z1, 0.5)], glass, { closed: false, mat: MAT.glass })
  }
  if (s.canopy === 'long-frame') canopy(kit.crew >= 3 ? 0.16 : 0.18, kit.crew >= 3 ? 0.52 : 0.46, R * 0.62)
  else if (s.canopy === 'short-frame') canopy(0.24, 0.38, R * 0.58)
  else if (s.canopy === 'bubble') {
    canopy(0.2, 0.36, R * 0.62)
    b.blob(0, R * prof(0.5) * 1.1, zAtS(0.5), R * 0.5, R * 0.5, R * 0.5, glass, MAT.glass, 3)
  } else if (s.canopy === 'cockpit') {
    // a multi-engine flight deck: glazing in the nose and a stepped cockpit behind it
    b.blob(0, 0, zAtS(0.02), R * 0.75, R * 0.75, R * 0.9, glass, MAT.glass, 1)
    canopy(0.1, 0.2, R * 0.45, 0.8)
  }
  // --- engines and propellers ------------------------------------------------------------------
  const pb = new Builder()
  const propR = multi ? Math.min(2.0, span * 0.06) : Math.min(1.7, Math.max(1.3, span * 0.12))
  const propDisc = (x, y, z) => {
    const n = 16
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2
      const a1 = ((k + 1) / n) * Math.PI * 2
      pb.tri([x, y, z], [x + Math.cos(a0) * propR, y + Math.sin(a0) * propR, z], [x + Math.cos(a1) * propR, y + Math.sin(a1) * propR, z], paletteFor('prop'), MAT.prop)
    }
  }
  if (!multi || engines === 1) {
    propDisc(0, 0, zNose - 0.25)
    b.cyl([0, 0, zNose - 0.05], [0, 0, zNose - 0.45], R * 0.25, 0.05, s.cowl === 'inline' ? up : cowlCol, MAT.metal, 6)
  }
  if (engines > 1) {
    const xs = engines === 2 ? [0.2] : [0.17, 0.34]
    for (const fx of xs) {
      for (const sg of [1, -1]) {
        const x = sg * fx * span
        const y = wingY + Math.tan(dih) * (Math.abs(x) - R * 0.6) - (s.wing === 'parasol' ? -0.1 : 0.05)
        const nr = Math.max(0.45, R * 0.42)
        const z0 = zLE - cr * 0.35
        b.cyl([x, y, z0], [x, y, zLE + cr * 0.9], nr, nr * 0.5, up, MAT.plain, 8, true)
        b.cyl([x, y, z0 - 0.05], [x, y, z0 - 0.35], nr * 0.4, 0.05, up, MAT.metal, 6)
        propDisc(x, y, z0 - 0.2)
      }
    }
  }
  // --- gear and floats ---------------------------------------------------------------------------
  if (s.floats === 'twin' || s.floats === 'single') {
    const floatAt = s.floats === 'twin' ? [span * 0.17, -span * 0.17] : [0]
    const fl = L * 0.78
    const fr = s.floats === 'twin' ? R * 0.42 : R * 0.55
    const fy = wingY - (s.floats === 'twin' ? 1.6 : 1.9)
    for (const fx of floatAt) {
      const secs = [0, 0.15, 0.4, 0.75, 1].map((t) => {
        const rr = fr * (t < 0.15 ? 0.4 + 4 * t : t > 0.75 ? 1 - (t - 0.75) * 3 : 1)
        const out = []
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2
          out.push([fx + Math.cos(a) * rr, fy + Math.sin(a) * rr * 0.9, zLE - fl * 0.35 + fl * t])
        }
        return out
      })
      b.loft(secs, lo, { closed: true, capStart: true, capEnd: true })
      b.cyl([fx, fy + fr, zLE], [fx * 0.7, wingY, zLE + cr * 0.2], 0.08, 0.08, lo, MAT.metal, 4)
      b.cyl([fx, fy + fr, zLE + cr * 0.8], [fx * 0.7, wingY, zLE + cr * 0.8], 0.08, 0.08, lo, MAT.metal, 4)
    }
    if (s.floats === 'single') {
      for (const sg of [1, -1]) b.box(sg * half * 0.85, wingY - 1.0, zLE + cr * 0.3, 0.35, 0.5, 1.4, lo)
    }
  } else if (boat) {
    for (const sg of [1, -1]) b.box(sg * half * 0.9, wingY - 1.2, zLE + cr * 0.4, 0.5, 0.6, 1.8, lo)
  } else if (s.gear === 'fixed') {
    for (const sg of [1, -1]) {
      const x = sg * span * 0.12
      const y0 = wingY + Math.tan(dih) * (Math.abs(x) - R * 0.6)
      b.cyl([x, y0, zLE + cr * 0.15], [x * 1.05, y0 - R * 1.6, zLE + cr * 0.1], 0.12, 0.1, lo, MAT.metal, 4)
      b.blob(x * 1.05, y0 - R * 1.7, zLE + cr * 0.1, 0.22, 0.45, 0.6, lo, MAT.plain, 7) // (the spat)
    }
  }
  // --- markings (decals into the one atlas) --------------------------------------------------------------
  const ins = c.insignia
  const wide = ins === 'star-bar-red-outline' || ins === 'star-bar-blue'
  const deco = (x, y, z, size, face) => {
    const w = wide ? size * 2 : size
    const h = size
    if (face === 'up' || face === 'down') {
      const yy = y + (face === 'up' ? 0.03 : -0.03)
      if (face === 'up') b.decal([x - w / 2, yy, z + h / 2], [x + w / 2, yy, z + h / 2], [x + w / 2, yy, z - h / 2], [x - w / 2, yy, z - h / 2])
      else b.decal([x - w / 2, yy, z - h / 2], [x + w / 2, yy, z - h / 2], [x + w / 2, yy, z + h / 2], [x - w / 2, yy, z + h / 2])
    } else {
      const sg = face === 'right' ? 1 : -1
      const xx = x + sg * 0.03
      if (sg > 0) b.decal([xx, y - h / 2, z + w / 2], [xx, y - h / 2, z - w / 2], [xx, y + h / 2, z - w / 2], [xx, y + h / 2, z + w / 2])
      else b.decal([xx, y - h / 2, z - w / 2], [xx, y - h / 2, z + w / 2], [xx, y + h / 2, z + w / 2], [xx, y + h / 2, z - w / 2])
    }
  }
  const sx = half * 0.62
  const chordAt = cr + (ct - cr) * ((sx - R * 0.6) / (half - R * 0.6))
  const wyAt = wingY + Math.tan(dih) * (sx - R * 0.6)
  const wz = zLE + (cr - chordAt) * 0.3 + chordAt * 0.45
  const ws = chordAt * 0.62
  // (the wing's thickness at that station: the decal stands just clear of its crest)
  const thAt = cr * 0.13 + (ct * 0.09 - cr * 0.13) * ((sx - R * 0.6) / (half - R * 0.6))
  for (const sg of [1, -1]) {
    deco(sg * sx, wyAt + thAt * 0.62 + 0.02, wz, ws, 'up')
    deco(sg * sx, wyAt - thAt * 0.37 - 0.02, wz, ws, 'down')
  }
  const fz = zAtS(0.62)
  const fr = R * prof(0.62)
  const fs = fr * 1.25
  deco(fr, tailRise(0.62), fz, fs, 'right')
  deco(-fr, tailRise(0.62), fz, fs, 'left')

  const body = b.geometry()
  const prop = pb.geometry()
  body.computeBoundingBox()
  const bb = body.boundingBox
  body.userData = { span, length: L }
  return {
    body,
    prop,
    bounds: { span, length: L, height: kit.height ?? bb.max.y - bb.min.y, box: { min: bb.min.toArray(), max: bb.max.toArray() } },
    colours: { upper: c.upper, lower: c.lower },
    insignia: ins,
  }
}
