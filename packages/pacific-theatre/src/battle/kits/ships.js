// buildShipGeometry (ENGINEERING.md §6): a ship kit's hull, its parts and its
// turrets, in metres in the model frame (origin at the waterline amidships,
// bow toward −z, starboard +x, y up), flat-shaded and vertex-coloured for the
// one ship material. Deterministic: the same kit and colour date give the
// same geometry (index.js caches by kit id + colour date). Throws on any
// vocabulary it does not know (blocks.js assertVocab), as the check does.
//
// The hull is lofted through stations along the length: the plan from
// blocks.js halfBeam (a fine entry, the parallel body, the stern's own taper),
// sections that run from a V at the ends to a flat bottom with a round bilge
// amidships, the stem raked by the bow's kind, the keel rising at the
// forefoot and the stern, and the deck line of blocks.js deckHeight with any
// raised forecastle on it. Below the waterline it is anti-fouling red with a
// black boot-top, as the record's photographs show both navies (the scene
// discards what is under the sea, so only a listing or sinking ship shows it).
// Above it, the hull and superstructure take the measure's bands at the date
// (palette.js schemeFor), Measure 32's dazzle as angled panels.

import { Builder, MAT, mergeGeometries } from './builder.js'
import { assertVocab, span, mid, zAt, deckHeight, deckTop, halfBeam, defaultDims, blockBase, turretSize, flightDeckTop, clamp } from './blocks.js'
import { paletteFor, schemeFor } from './palette.js'

const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const toMs = (d) => (d == null ? null : typeof d === 'number' ? d : Date.parse(String(d).length <= 7 ? `${d}-01T00:00Z` : String(d).length <= 10 ? `${d}T00:00Z` : d))

/** The kit's colour entry at a date (kit.colours, dated), else its `colour`. */
export function colourAt(kit, colourDate) {
  const ms = toMs(colourDate)
  if (ms != null && Array.isArray(kit.colours)) {
    for (const c of kit.colours) if (ms >= toMs(c.from) && ms < toMs(c.to)) return c
  }
  return kit.colour || { hull: 'ijn-kure-grey', deck: 'wood', measure: null, deckMarking: null }
}

const ANTIFOUL = [0.11, 0.024, 0.016]
const BOOT = [0.012, 0.013, 0.014]

/** The colour function the hull and the superstructure share: by height band, dazzle, deck tops. */
function painter(kit, colour, topRef) {
  const scheme = schemeFor(colour.hull)
  const deckCol = paletteFor(colour.deck === 'wood' || colour.deck === 'linoleum' ? colour.deck : colour.deck)
  const usDeckTop = /^ms-/.test(colour.hull) ? paletteFor(colour.hull === 'ms-1' ? 'deck-grey' : 'deck-blue') : null
  const angle = 0.55 + hash(kit.loa, kit.beam) * 0.6
  const side = (x, y, z) => {
    if (y < -0.25) return ANTIFOUL
    if (y < 0.45) return BOOT
    if (scheme.dazzle) {
      const u = (z * Math.cos(angle) + y * 2.2 * Math.sin(angle)) / (kit.loa * 0.09) + hash(Math.floor(z / (kit.loa * 0.12)), Math.sign(x)) * 1.7
      return scheme.colours[Math.abs(Math.floor(u)) % scheme.colours.length]
    }
    const C = scheme.colours
    if (C.length === 1) return C[0]
    const frac = y / Math.max(1, topRef)
    let i = 0
    while (i < scheme.splits.length && frac > scheme.splits[i]) i++
    return C[Math.min(i, C.length - 1)]
  }
  return {
    side,
    stripe: scheme.stripeColour,
    stripeAt: [topRef * 0.16, topRef * 0.24],
    deck: deckCol,
    top: (x, y, z) => usDeckTop || side(x, y, z).map((c) => c * 1.12),
    fn: (x, y, z, ny) => (ny > 0.8 && y > 1 ? usDeckTop || side(x, y, z).map((c) => c * 1.1) : side(x, y, z)),
  }
}

const STATIONS = [0, 0.004, 0.012, 0.025, 0.045, 0.07, 0.1, 0.14, 0.19, 0.25, 0.32, 0.4, 0.5, 0.6, 0.68, 0.75, 0.8, 0.85, 0.89, 0.925, 0.955, 0.978, 0.993, 1]

/** The hull: lofted sides, the deck, a transom where the stern has one, a raised forecastle. */
function buildHull(kit, paint) {
  const b = new Builder()
  const L = kit.loa
  const T0 = kit.draught
  const bow = kit.hull.bow
  const stern = kit.hull.stern
  const rakeK = bow === 'clipper' ? 0.032 : bow === 'raked' ? 0.026 : 0.007
  const sections = []
  const decks = []
  for (const f of STATIONS) {
    const D = deckHeight(kit, f)
    const hb = halfBeam(kit, f)
    const c = smooth(0.02, 0.28, f) * (1 - smooth(0.72, 0.99, f))
    let T = T0
    T *= bow === 'straight' ? 0.55 + 0.45 * smooth(0, 0.04, f) : 0.3 + 0.7 * smooth(0, 0.07, f)
    T *= stern === 'transom' ? 1 - 0.75 * smooth(0.9, 1, f) : stern === 'round' ? 1 - 0.65 * smooth(0.85, 1, f) : 1 - 0.6 * smooth(0.86, 1, f)
    if (kit.type === 'ss-midget' || kit.type === 'ss') T = Math.max(0.1, hb * 1.0)
    const w = 1 - smooth(0, 0.14, f)
    const z0 = zAt(kit, f)
    const zOf = (y) => z0 + rakeK * L * Math.pow(clamp((D - y) / (D + T), 0, 1), bow === 'clipper' ? 1.7 : 1) * w
    const half = [
      [0, -T],
      [hb * (0.12 + 0.62 * c), -T],
      [hb * (0.5 + 0.42 * c), -T * (0.78 - 0.45 * c)],
      [hb * (0.86 + 0.1 * c), -T * 0.28],
      [hb * 0.965, 0],
      [hb, D],
    ]
    // (the ring runs port deck edge → keel → starboard deck edge)
    const ring = []
    for (let k = half.length - 1; k >= 1; k--) ring.push([-half[k][0], half[k][1], zOf(half[k][1])])
    for (let k = 0; k < half.length; k++) ring.push([half[k][0], half[k][1], zOf(half[k][1])])
    sections.push(ring)
    decks.push({ f, D, hb, z: z0 })
  }
  b.loft(sections, paint.side, { closed: false })
  // a hospital ship's green band along the side, as its own strip just proud of the plating
  if (paint.stripe) {
    const [y0, y1] = paint.stripeAt
    for (let i = 0; i + 1 < decks.length; i++) {
      const a = decks[i]
      const c = decks[i + 1]
      if (a.f < 0.04 || c.f > 0.97) continue
      for (const sg of [1, -1]) {
        const ha = (a.hb * 0.985 + 0.05) * sg
        const hc = (c.hb * 0.985 + 0.05) * sg
        b.quad([ha, Math.min(y0, a.D - 0.3), a.z], [hc, Math.min(y0, c.D - 0.3), c.z], [hc, Math.min(y1, c.D - 0.1), c.z], [ha, Math.min(y1, a.D - 0.1), a.z], paint.stripe)
      }
    }
  }
  // the deck
  for (let i = 0; i + 1 < decks.length; i++) {
    const a = decks[i]
    const c = decks[i + 1]
    b.quad([-a.hb, a.D, a.z], [a.hb, a.D, a.z], [c.hb, c.D, c.z], [-c.hb, c.D, c.z], paint.deck, MAT.deck)
  }
  // the stern's end: a transom (or what is left of a cruiser stern) closed flat
  const last = sections[sections.length - 1]
  if (halfBeam(kit, 1) > 0.05) {
    const cz = last.reduce((s, p) => s + p[2], 0) / last.length
    const cy = last.reduce((s, p) => s + p[1], 0) / last.length
    for (let k = 0; k + 1 < last.length; k++) b.tri([0, cy, cz], last[k + 1], last[k], paint.side)
    b.tri([0, cy, cz], last[0], last[last.length - 1], paint.side)
  }
  // a raised forecastle (hull-extension): sides following the plan, its own deck, the break
  for (const blk of kit.blocks) {
    if (blk.kind !== 'hull-extension') continue
    const [f0, f1] = span(blk)
    const h = blk.h ?? 2.4
    const fs = STATIONS.filter((f) => f > f0 + 1e-6 && f < f1 - 1e-6)
    const list = [f0, ...fs, f1]
    const S = list.map((f) => ({ f, D: deckHeight(kit, f), hb: halfBeam(kit, f) * 0.995, z: zAt(kit, f) }))
    for (let i = 0; i + 1 < S.length; i++) {
      const a = S[i]
      const c = S[i + 1]
      for (const sgn of [1, -1]) b.quad([sgn * a.hb, a.D, a.z], [sgn * c.hb, c.D, c.z], [sgn * c.hb, c.D + h, c.z], [sgn * a.hb, a.D + h, a.z], paint.side)
      b.quad([-a.hb, a.D + h, a.z], [a.hb, a.D + h, a.z], [c.hb, c.D + h, c.z], [-c.hb, c.D + h, c.z], paint.deck, MAT.deck)
    }
    const e = S[S.length - 1]
    b.quad([-e.hb, e.D, e.z], [e.hb, e.D, e.z], [e.hb, e.D + h, e.z], [-e.hb, e.D + h, e.z], paint.side)
  }
  return b.geometry()
}

/** A block's x for its side: on the centreline, or out by the deck edge. */
function sideX(kit, blk, w, f) {
  const hb = halfBeam(kit, f)
  if (blk.side === 'starboard') return Math.max(0, hb - w / 2 - 0.4)
  if (blk.side === 'port') return -Math.max(0, hb - w / 2 - 0.4)
  return 0
}

/** The superstructure blocks (everything but the turrets and the forecastle, which the hull has). */
function buildParts(kit, paint, colour, topRef) {
  const b = new Builder()
  const L = kit.loa
  const B = kit.beam
  const metal = paint.fn
  const dark = paletteFor('ijn-cowl')
  for (const blk of kit.blocks) {
    if (blk.kind === 'hull-extension' || blk.kind === 'turret') continue
    const sides = blk.side === 'both' ? ['port', 'starboard'] : [blk.side]
    for (const sd of sides) {
      const one = sd === blk.side ? blk : { ...blk, side: sd }
      const d = defaultDims(kit, one)
      const [f0, f1] = span(one)
      const f = mid(one)
      const y = blockBase(kit, one, d)
      const z = zAt(kit, f)
      const len = Math.max(d.l, (f1 - f0) * L)
      const x = sideX(kit, one, d.w, f)
      switch (one.kind) {
        case 'flight-deck': {
          const top = y + d.h
          b.box(0, y, z, d.w, d.h, len, paint.deck, MAT.deck)
          const line = paletteFor('flight-deck-line')
          b.quad([-0.25, top + 0.02, z - len / 2], [0.25, top + 0.02, z - len / 2], [0.25, top + 0.02, z + len / 2], [-0.25, top + 0.02, z + len / 2], line)
          for (const s of [-1, 1]) {
            const ex = s * (d.w / 2 - 0.6)
            b.quad([ex - 0.15, top + 0.02, z - len / 2], [ex + 0.15, top + 0.02, z - len / 2], [ex + 0.15, top + 0.02, z + len / 2], [ex - 0.15, top + 0.02, z + len / 2], line)
          }
          if (colour.deckMarking === 'hinomaru-forward') {
            const zc = z - len * 0.4
            b.disc(0, top + 0.04, zc, d.w * 0.3, paletteFor('insignia-white'), MAT.plain, 20)
            b.disc(0, top + 0.06, zc, d.w * 0.24, [0.6, 0.02, 0.02], MAT.plain, 20)
          }
          // the open ends' supports under the overhangs
          for (const fz of [f0 + 0.015, f1 - 0.015]) {
            const hz = zAt(kit, fz)
            const dk = deckTop(kit, fz)
            for (const s of [-0.3, 0.3]) b.cyl([s * d.w, dk, hz], [s * d.w, y, hz], 0.35, 0.35, metal, MAT.metal, 4)
          }
          break
        }
        case 'hangar':
          b.box(0, y, z, Math.min(d.w, 2 * halfBeam(kit, f) * 0.95), d.h, len, metal)
          break
        case 'island': {
          b.box(x, y, z, d.w, d.h * 0.6, len, metal)
          b.box(x, y + d.h * 0.6, z - len * 0.15, d.w * 0.8, d.h * 0.4, len * 0.45, metal, MAT.plain, 0, 0.9)
          b.box(x, y + d.h * 0.85, z - len * 0.15, d.w * 0.82, d.h * 0.06, len * 0.47, dark, MAT.glass)
          break
        }
        case 'bridge': {
          const tiers = Math.max(2, Math.min(4, Math.round(d.h / 3.5)))
          let yy = y
          for (let t = 0; t < tiers; t++) {
            const k = 1 - t * 0.14
            const th = d.h / tiers
            b.box(x, yy, z + len * 0.05 * t, d.w * k, th, len * (1 - t * 0.12), metal)
            yy += th
          }
          b.box(x, y + d.h - Math.min(1.4, d.h * 0.12), z - len * 0.02, d.w * (1 - (tiers - 1) * 0.14) * 1.02, Math.min(1.1, d.h * 0.1), len * 0.6, dark, MAT.glass)
          break
        }
        case 'pagoda': {
          const tiers = one.shape === 'tall' ? 8 : 6
          let yy = y
          for (let t = 0; t < tiers; t++) {
            const th = d.h / tiers
            const k = 1 - t * (one.shape === 'tall' ? 0.08 : 0.1)
            const jog = (hash(kit.loa, t) - 0.5) * len * 0.12
            b.box(x, yy, z + jog, d.w * k * (t % 2 ? 0.92 : 1.05), th * 0.92, len * k * (t % 3 === 1 ? 1.15 : 0.9), metal)
            if (t % 2 === 1) b.box(x, yy + th * 0.92, z + jog, d.w * k * 1.18, th * 0.08, len * k * 1.1, metal)
            yy += th
          }
          b.box(x, y + d.h, z, d.w * 0.45, d.h * 0.06, len * 0.5, metal)
          b.cyl([x, y, z + len * 0.25], [x, y + d.h * 0.9, z + len * 0.1], B * 0.03, B * 0.025, metal, MAT.metal, 5)
          break
        }
        case 'tower':
          b.box(x, y, z, d.w, d.h, len, metal, MAT.plain, 0, 0.82)
          b.box(x, y + d.h, z, d.w * 0.9, d.h * 0.06, len * 0.9, metal)
          b.box(x, y + d.h * 0.86, z - len * 0.05, d.w * 0.84, d.h * 0.05, len * 0.86, dark, MAT.glass)
          break
        case 'tripod-mast': {
          const top = [x, y + d.h * 0.78, z]
          const r = Math.max(0.25, B * 0.012)
          b.cyl([x, y, z - d.w * 0.4], top, r, r * 0.8, metal, MAT.metal, 5)
          b.cyl([x - d.w * 0.45, y, z + d.w * 0.35], top, r * 0.8, r * 0.7, metal, MAT.metal, 5)
          b.cyl([x + d.w * 0.45, y, z + d.w * 0.35], top, r * 0.8, r * 0.7, metal, MAT.metal, 5)
          b.box(x, top[1], z, d.w * 0.9, d.h * 0.06, d.w * 0.9, metal)
          if (kit.type === 'bb' || kit.type === 'ca') b.box(x, top[1] + d.h * 0.06, z, d.w * 0.8, d.h * 0.08, d.w * 0.8, metal)
          b.cyl(top, [x, y + d.h, z], r * 0.6, r * 0.3, metal, MAT.metal, 4)
          break
        }
        case 'cage-mast': {
          const n = 8
          const r0 = d.w * 0.5
          const r1 = d.w * 0.28
          for (let k = 0; k < n; k++) {
            const a0 = (k / n) * Math.PI * 2
            const a1 = a0 + Math.PI * 0.45
            b.cyl([x + Math.cos(a0) * r0, y, z + Math.sin(a0) * r0], [x + Math.cos(a1) * r1, y + d.h * 0.85, z + Math.sin(a1) * r1], 0.16, 0.14, metal, MAT.metal, 3)
            b.cyl([x + Math.cos(a1 + 0.8) * r0, y, z + Math.sin(a1 + 0.8) * r0], [x + Math.cos(a0 + 0.8) * r1, y + d.h * 0.85, z + Math.sin(a0 + 0.8) * r1], 0.16, 0.14, metal, MAT.metal, 3)
          }
          b.box(x, y + d.h * 0.85, z, d.w * 1.1, d.h * 0.12, d.w * 1.1, metal)
          b.cyl([x, y + d.h * 0.97, z], [x, y + d.h * 1.08, z], 0.2, 0.1, metal, MAT.metal, 4)
          break
        }
        case 'pole-mast':
          b.cyl([x, y, z], [x, y + d.h, z], Math.max(0.18, d.w * 0.4), Math.max(0.08, d.w * 0.15), metal, MAT.metal, 5)
          b.cyl([x - B * 0.12, y + d.h * 0.75, z], [x + B * 0.12, y + d.h * 0.75, z], 0.08, 0.08, metal, MAT.metal, 3)
          break
        case 'funnel': {
          const cap = paletteFor('dull-black-bk')
          if (one.shape === 'downturned') {
            const s = Math.sign(x || 1)
            const hb = halfBeam(kit, f)
            const r = d.w * 0.5
            const p0 = [s * (hb - r), y + d.h * 0.4, z]
            const p1 = [s * (hb + r * 1.2), y + d.h * 0.55, z]
            const p2 = [s * (hb + r * 2.2), y + d.h * 0.15, z]
            b.cyl(p0, p1, r, r, metal, MAT.plain, 8)
            b.cyl(p1, p2, r, r * 0.95, metal, MAT.plain, 8)
            b.cyl(p2, [p2[0], p2[1] - 0.6, p2[2]], r * 0.95, r * 0.95, cap, MAT.dark, 8)
            if (len > d.w * 2.5) {
              // (a long trunk along the side, as Akagi's and Kaga's)
              b.box(s * (hb + r * 0.2), y + d.h * 0.25, z, r * 1.6, d.h * 0.4, len, metal)
            }
          } else {
            const rake = one.shape === 'raked' ? 0.22 : one.shape === 'trunked' ? 0.12 : 0.04
            const top = [x, y + d.h, z + d.h * rake]
            const rx = d.w / 2
            const rz = Math.max(rx, len / 2)
            // an elliptical stack: a cylinder squashed with a box core where it is long
            if (rz > rx * 1.3) {
              b.box(x, y, z, d.w, d.h, len - d.w, metal)
              b.cyl([x, y, z - (len - d.w) / 2], [top[0], top[1], top[2] - (len - d.w) / 2], rx, rx * 0.95, metal, MAT.plain, 8)
              b.cyl([x, y, z + (len - d.w) / 2], [top[0], top[1], top[2] + (len - d.w) / 2], rx, rx * 0.95, metal, MAT.plain, 8)
              b.box(top[0], top[1] - 0.8, top[2], d.w * 1.02, 0.8, len - d.w, cap, MAT.dark)
            } else {
              b.cyl([x, y, z], top, rx, rx * 0.93, metal, MAT.plain, 10, false)
              b.cyl([top[0], top[1] - 0.9, top[2]], top, rx * 0.95, rx * 0.95, cap, MAT.dark, 10)
            }
          }
          break
        }
        case 'casemate':
          b.box(x + Math.sign(x || 1) * 0.4, y, z, d.w, d.h, len, metal)
          break
        case 'deckhouse':
          b.box(x, y, z, Math.min(d.w, 2 * halfBeam(kit, f) * 0.9), d.h, len, metal)
          break
        case 'crane': {
          b.cyl([x, y, z], [x, y + d.h, z], 0.4, 0.3, metal, MAT.metal, 5)
          b.cyl([x, y + d.h * 0.3, z], [x + Math.sign(x || 1) * d.h * 0.25, y + d.h * 0.95, z + d.h * 0.55], 0.22, 0.12, metal, MAT.metal, 4)
          break
        }
        case 'catapult': {
          const rot = one.side === 'starboard' ? 0.5 : one.side === 'port' ? -0.5 : 0
          b.cyl([x, deckTop(kit, f), z], [x, y, z], 0.9, 0.9, metal, MAT.metal, 6)
          b.box(x, y, z, d.w, d.h, len, metal, MAT.metal, rot)
          break
        }
        case 'boat-deck':
          b.box(0, y, z, Math.min(d.w, 2 * halfBeam(kit, f) * 0.95), d.h, len, paint.deck, MAT.deck)
          break
        case 'director':
          b.box(x, y, z, d.w, d.h, d.l, metal)
          b.box(x, y + d.h * 0.5, z, d.w * 2.4, d.h * 0.25, d.l * 0.3, metal)
          break
        default:
          throw new Error(`kit ${kit.id}: block kind “${one.kind}” has no builder`)
      }
    }
  }
  return b
}

/** The weapon of a gun entry: weapons.json's, or the fixture's inline numbers. */
function gunWeapon(g, weapons) {
  if (g.weapon && weapons?.get?.(g.weapon)) return weapons.get(g.weapon)
  return { calibreMm: g.calibreMm ?? 127, mvMs: g.mvMs ?? 800 }
}

const TURRET_CACHE = new WeakMap()

/** One battery's turret (or open mount, or casemate gun) in its own frame: origin at the training axis on its base, the guns toward −z. */
function turretGeometry(kind, calibreMm, barrels, dims, paint) {
  const b = new Builder()
  const metal = paint.fn
  const cal = calibreMm / 1000
  const glen = cal * (calibreMm >= 300 ? 45 : calibreMm >= 140 ? 50 : 45)
  const gap = barrels === 3 ? dims.w * 0.28 : barrels === 2 ? dims.w * 0.2 : 0
  if (kind === 'turret') {
    b.box(0, 0, 0, dims.w, dims.h, dims.l, metal, MAT.plain, 0, 0.88)
    b.box(0, dims.h, dims.l * 0.18, dims.w * 0.5, dims.h * 0.18, dims.l * 0.3, metal)
  } else if (kind === 'mount') {
    b.cyl([0, 0, 0], [0, cal * 7, 0], cal * 3.2, cal * 2.6, metal, MAT.metal, 6, true)
    b.box(0, cal * 4, -cal * 2, cal * 9, cal * 6, cal * 1.2, metal)
  }
  const y = kind === 'casemate' ? 0 : kind === 'mount' ? cal * 6.5 : dims.h * 0.45
  const z0 = kind === 'turret' ? -dims.l * 0.38 : -cal * 2
  const e = 0.03
  for (let k = 0; k < barrels; k++) {
    const x = (k - (barrels - 1) / 2) * gap
    b.cyl([x, y, z0], [x, y + glen * e, z0 - glen], cal * 0.95, cal * 0.6, metal, MAT.metal, 6)
  }
  return b.geometry()
}

/**
 * The ship's geometry. opts: { colourDate (ms or ISO: picks the dated colour),
 * weapons (Map id → weapon, for the turrets' calibres) }.
 */
export function buildShipGeometry(kit, { colourDate = null, weapons = null } = {}) {
  assertVocab(kit)
  if (!(kit.loa > 0 && kit.beam > 0 && kit.draught > 0)) throw new Error(`kit ${kit.id}: loa, beam and draught are needed`)
  const colour = colourAt(kit, colourDate)
  // the top of the funnels: what Measure 1's and 12's bands are fractions of
  let topRef = 0
  for (const blk of kit.blocks) {
    if (blk.kind !== 'funnel' && blk.kind !== 'bridge' && blk.kind !== 'island') continue
    const d = defaultDims(kit, blk)
    topRef = Math.max(topRef, blockBase(kit, blk, d) + d.h)
  }
  if (!topRef) topRef = deckHeight(kit, 0.5) * 2.5
  const paint = painter(kit, colour, topRef)
  const hull = buildHull(kit, paint)
  const pb = buildParts(kit, paint, colour, topRef)

  // the turrets, open mounts and casemate guns, by battery
  const turrets = []
  const blocks = kit.blocks
  const turretBlockAt = (f) => blocks.find((b) => b.kind === 'turret' && Math.abs(mid(b) - f) < 0.016)
  const casemateAt = (f, side) => blocks.find((b) => b.kind === 'casemate' && (b.side === side || b.side === 'both') && f >= span(b)[0] - 0.02 && f <= span(b)[1] + 0.02)
  for (const [bi, g] of (kit.guns || []).entries()) {
    const w = gunWeapon(g, weapons)
    const barrels = g.barrels ?? 1
    const sides = g.side === 'both' ? ['port', 'starboard'] : [g.side || 'centre']
    let made = 0
    const total = g.mounts ?? g.turrets ?? g.at.length
    for (const f of g.at) {
      for (const sd of sides) {
        if (made >= total) break
        made++
        const tb = turretBlockAt(f)
        const isTurret = (g.turrets ?? 0) > 0
        const cm = !isTurret && sd !== 'centre' ? casemateAt(f, sd) : null
        const kind = isTurret ? 'turret' : cm ? 'casemate' : 'mount'
        const dims = tb ? defaultDims(kit, tb) : turretSize(w.calibreMm, barrels)
        const key = `${bi}:${kind}:${colour.hull}`
        let geometry = TURRET_CACHE.get(kit)?.[key]
        if (!geometry) {
          geometry = turretGeometry(kind, w.calibreMm, barrels, dims, paint)
          const m = TURRET_CACHE.get(kit) || {}
          m[key] = geometry
          TURRET_CACHE.set(kit, m)
        }
        const hb = halfBeam(kit, f)
        const x = sd === 'starboard' ? hb - Math.max(1, dims.w * 0.7) : sd === 'port' ? -(hb - Math.max(1, dims.w * 0.7)) : 0
        let y = kind === 'casemate' ? deckTop(kit, f) - 1.8 : deckTop(kit, f)
        const fdt = flightDeckTop(kit)
        if (kind === 'mount' && fdt != null && sd !== 'centre') y = Math.max(y, fdt - 2.5)
        if (tb?.sf) {
          const lift = Math.max(2.2, dims.h + 0.8)
          pb.cyl([x, deckTop(kit, f), zAt(kit, f)], [x, deckTop(kit, f) + lift, zAt(kit, f)], dims.w * 0.42, dims.w * 0.42, paint.fn, MAT.plain, 10)
          y += lift
        }
        // (the arc, clockwise from the bow; a port mount's mirrored)
        let arc = g.arcDeg || (sd === 'centre' ? (f < 0.5 ? [210, 150] : [30, 330]) : [20, 160])
        if (sd === 'port') arc = [(360 - arc[1]) % 360, (360 - arc[0]) % 360]
        turrets.push({ geometry, at: [x, y, zAt(kit, f)], calibreMm: w.calibreMm, arc, barrels, kind, battery: bi, weapon: g.weapon ?? null, role: g.role, side: sd, rest: f < 0.5 ? 0 : 180 })
      }
    }
  }
  const parts = pb.geometry()
  hull.computeBoundingBox()
  parts.computeBoundingBox()
  const bb = hull.boundingBox.clone().union(parts.boundingBox)
  return {
    hull,
    turrets,
    parts,
    bounds: { length: kit.loa, beam: kit.beam, height: bb.max.y, draught: kit.draught, box: { min: bb.min.toArray(), max: bb.max.toArray() } },
    colours: { hull: colour.hull, deck: colour.deck, measure: colour.measure ?? null, deckMarking: colour.deckMarking ?? null },
  }
}

/** Hull, parts and turrets (each at its rest bearing) as one geometry: the contact sheet and the far-off silhouette. */
export function shipAsOne(geo) {
  const list = [geo.hull, geo.parts]
  for (const t of geo.turrets) {
    const g = t.geometry.clone()
    if (t.rest) g.rotateY(Math.PI)
    g.translate(t.at[0], t.at[1], t.at[2])
    list.push(g)
  }
  return mergeGeometries(list)
}
