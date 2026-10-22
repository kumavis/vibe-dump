// The silhouette's rules (ENGINEERING.md §6, DATA.md §8): the block and shape
// vocabularies the generator knows (and nothing else), the hull's plan and
// deck line as functions of the fraction of length from the bow, where each
// block stands, and the default size of a block that leaves one out. Pure
// JS, no three.js: the generator, the authoring of kits/ships.json and
// tools/check/kits.mjs all read the same rules.
//
// Frame (ENGINEERING §2): metres, origin at the waterline amidships, bow
// toward −z, so a block `at` a fraction f of the length overall from the bow
// stands at z = (f − 0.5) × loa.

export const BLOCK_KINDS = ['hull-extension', 'flight-deck', 'island', 'bridge', 'pagoda', 'tower', 'cage-mast', 'tripod-mast', 'pole-mast', 'funnel', 'turret', 'casemate', 'hangar', 'deckhouse', 'crane', 'catapult', 'boat-deck', 'director']
export const SHAPES = { funnel: ['round', 'trunked', 'downturned', 'raked'], turret: ['twin', 'triple', 'single'], pagoda: ['tall', 'short'] }
export const BOWS = ['straight', 'clipper', 'raked']
export const STERNS = ['cruiser', 'transom', 'round']
export const SIDES = ['port', 'starboard', 'both', 'centre']

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => a + (b - a) * t

/** Check a kit's vocabulary; throws on the first word the generator does not know. */
export function assertVocab(kit) {
  const h = kit.hull || {}
  if (!BOWS.includes(h.bow)) throw new Error(`kit ${kit.id}: hull.bow “${h.bow}” is not one of ${BOWS.join(', ')}`)
  if (!STERNS.includes(h.stern)) throw new Error(`kit ${kit.id}: hull.stern “${h.stern}” is not one of ${STERNS.join(', ')}`)
  for (const [i, b] of (kit.blocks || []).entries()) {
    if (!BLOCK_KINDS.includes(b.kind)) throw new Error(`kit ${kit.id}: block ${i} kind “${b.kind}” is not in the vocabulary`)
    const shapes = SHAPES[b.kind]
    if (b.shape != null && (!shapes || !shapes.includes(b.shape))) throw new Error(`kit ${kit.id}: block ${i} (${b.kind}) shape “${b.shape}” is not one of ${shapes ? shapes.join(', ') : 'none'}`)
    if (b.side != null && !SIDES.includes(b.side)) throw new Error(`kit ${kit.id}: block ${i} side “${b.side}”`)
    const at = Array.isArray(b.at) ? b.at : [b.at]
    if (!at.every((v) => Number.isFinite(v) && v >= -0.05 && v <= 1.05)) throw new Error(`kit ${kit.id}: block ${i} at ${JSON.stringify(b.at)}`)
  }
}

/** [from, to] of a block's `at` (a single fraction is a point). */
export const span = (b) => (Array.isArray(b.at) ? [Math.min(b.at[0], b.at[1]), Math.max(b.at[0], b.at[1])] : [b.at, b.at])
export const mid = (b) => {
  const [a, c] = span(b)
  return (a + c) / 2
}
/** z in the model frame of a fraction of length from the bow. */
export const zAt = (kit, f) => (f - 0.5) * kit.loa

/** The freeboard pair [fore, aft], metres. */
const fbOf = (kit) => {
  const fb = kit.hull?.freeboard
  if (Array.isArray(fb) && fb.length === 2) return fb
  const d = kit.draught || 5
  return [d * 0.9, d * 0.6]
}

/**
 * The main deck above the waterline at fraction f (metres): from the aft
 * freeboard to the fore, rising toward the bow; `sheer` (0..1) concentrates
 * the rise forward (0 a straight line, 0.6 a strong rise ahead of the first
 * turret).
 */
export function deckHeight(kit, f) {
  const [fore, aft] = fbOf(kit)
  const e = 1 + 3 * clamp(kit.hull?.sheer ?? 0.3, 0, 1)
  const t = 1 - clamp(f, 0, 1)
  return aft + (fore - aft) * Math.pow(t, e)
}

/** The deck at f with any raised forecastle (hull-extension) on it. */
export function deckTop(kit, f) {
  let h = deckHeight(kit, f)
  for (const b of kit.blocks || []) {
    if (b.kind !== 'hull-extension') continue
    const [a, c] = span(b)
    if (f >= a - 1e-6 && f <= c + 1e-6) h = Math.max(h, deckHeight(kit, f) + (b.h ?? 2.4))
  }
  return h
}

/**
 * Half the beam at fraction f of the length (the plan at the deck): a fine
 * entry over the forward fifth, the parallel body, and the stern's own taper
 * (a cruiser stern narrows, a transom stays broad to the end, a round stern
 * closes). A submarine is a cigar.
 */
export function halfBeam(kit, f) {
  const B = kit.beam / 2
  if (kit.type === 'ss-midget' || kit.type === 'ss') {
    const t = clamp(f, 0, 1)
    return B * Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 2))) * 1.05
  }
  const entry = kit.type === 'dd' || kit.type === 'de' ? 0.24 : kit.type === 'bb' ? 0.2 : 0.22
  let k = 1
  if (f < entry) k = Math.pow(Math.sin((Math.PI / 2) * clamp(f / entry, 0, 1)), 0.75)
  const s = kit.hull?.stern || 'cruiser'
  const s0 = 0.78
  if (f > s0) {
    const t = clamp((f - s0) / (1 - s0), 0, 1)
    k *= s === 'transom' ? 1 - 0.28 * t * t : s === 'round' ? 1 - 0.85 * Math.pow(t, 1.6) : 1 - 0.62 * Math.pow(t, 1.8)
  }
  return B * Math.max(0.02, k)
}

/** The flight deck covering fraction f, if any: { top, w, from, to }. */
export function flightDeckAt(kit, f) {
  for (const b of kit.blocks || []) {
    if (b.kind !== 'flight-deck') continue
    const [a, c] = span(b)
    if (f >= a - 0.02 && f <= c + 0.02) return { top: (b.y ?? 0) + (b.h ?? 1.2), w: b.w, from: a, to: c, block: b }
  }
  return null
}

/** The size defaults by kind for a ship of this type (metres). */
function typeScale(kit) {
  const t = kit.type
  if (t === 'bb') return { bridge: 18, tower: 22, tripod: 30, cage: 34, pole: 24, funnel: 16, crane: 9, house: 3 }
  if (t === 'cv' || t === 'cvl' || t === 'cve') return { bridge: 10, tower: 10, tripod: 14, cage: 14, pole: 12, funnel: 7, crane: 7, house: 3 }
  if (t === 'ca' || t === 'cl') return { bridge: 14, tower: 14, tripod: 24, cage: 24, pole: 22, funnel: 12, crane: 8, house: 2.6 }
  if (t === 'dd' || t === 'de') return { bridge: 7, tower: 6, tripod: 14, cage: 14, pole: 14, funnel: 6, crane: 5, house: 2.4 }
  if (t === 'ss-midget' || t === 'ss') return { bridge: 1.2, tower: 1.2, tripod: 3, cage: 3, pole: 3, funnel: 1, crane: 1, house: 0.8 }
  return { bridge: 9, tower: 9, tripod: 18, cage: 18, pole: 18, funnel: 10, crane: 7, house: 3 }
}

/** A turret's housing for a gun of this calibre and barrel count (m). */
export function turretSize(calibreMm, barrels) {
  const k = barrels >= 3 ? 1.35 : barrels === 2 ? 1.05 : 0.75
  const w = 2 + calibreMm * 0.02 * k
  return { w, l: w * 1.25, h: Math.max(1.8, w * 0.3) }
}

/**
 * A block's footprint and height where the kit leaves them out. turretGun:
 * { calibreMm, barrels } of the battery at this position, when there is one.
 */
export function defaultDims(kit, b, turretGun = null) {
  const s = typeScale(kit)
  const B = kit.beam
  const L = kit.loa
  const [a, c] = span(b)
  const len = Math.max(0, c - a) * L
  const out = { w: b.w, l: b.l, h: b.h }
  const set = (w, l, h) => {
    if (out.w == null) out.w = w
    if (out.l == null) out.l = l
    if (out.h == null) out.h = h
  }
  switch (b.kind) {
    case 'turret': {
      const g = turretGun || { calibreMm: kit.type === 'bb' ? 356 : kit.type === 'dd' ? 127 : 152, barrels: b.shape === 'triple' ? 3 : b.shape === 'single' ? 1 : 2 }
      const t = turretSize(g.calibreMm, g.barrels)
      set(t.w, t.l, t.h)
      break
    }
    case 'bridge':
      set(B * 0.6, len || L * 0.05, s.bridge)
      break
    case 'pagoda':
      set(B * 0.36, len || L * 0.05, b.shape === 'tall' ? s.tower * 1.9 : s.tower * 1.5)
      break
    case 'tower':
      set(B * 0.3, len || L * 0.05, s.tower)
      break
    case 'tripod-mast':
      set(B * 0.18, len || B * 0.18, s.tripod)
      break
    case 'cage-mast':
      set(B * 0.24, len || B * 0.24, s.cage)
      break
    case 'pole-mast':
      set(0.6, 0.6, s.pole)
      break
    case 'funnel':
      if (flightDeckTop(kit) != null && b.side && b.side !== 'centre' && b.shape !== 'downturned' && !(kit.blocks || []).some((o) => o.kind === 'island' && o.side === b.side && Math.abs(mid(o) - mid(b)) < 0.08)) set(B * 0.12, B * 0.12, Math.max(4, flightDeckTop(kit) - deckTop(kit, mid(b)) + 1.5))
      if (b.shape === 'downturned') set(B * 0.14, len || L * 0.03, s.funnel)
      else set(B * (b.shape === 'trunked' ? 0.27 : 0.22), len || B * (b.shape === 'trunked' ? 0.34 : 0.26), s.funnel)
      break
    case 'island':
      set(Math.max(4, B * 0.2), len || L * 0.06, 10)
      break
    case 'flight-deck':
      set(B, len || L * 0.95, 1.2)
      break
    case 'hangar':
      set(B * 0.85, len || L * 0.8, 6)
      break
    case 'casemate':
      set(1.6, len || L * 0.3, 2.6)
      break
    case 'deckhouse':
      set(B * 0.45, len || L * 0.05, s.house)
      break
    case 'crane':
      set(1.2, 1.2, s.crane)
      break
    case 'catapult':
      set(1.4, len || 19, 1.2)
      break
    case 'boat-deck':
      set(B * 0.7, len || L * 0.1, 1.2)
      break
    case 'director':
      set(kit.type === 'bb' ? 4 : 2.6, kit.type === 'bb' ? 4 : 2.6, kit.type === 'bb' ? 3 : 2.2)
      break
    case 'hull-extension':
      set(B, len || L * 0.3, 2.4)
      break
    default:
      throw new Error(`kit ${kit.id}: block kind “${b.kind}” has no default size`)
  }
  return out
}

const TALL = new Set(['bridge', 'pagoda', 'tower', 'island', 'tripod-mast', 'cage-mast', 'deckhouse', 'hangar'])

/**
 * Where a block stands (metres above the waterline): on the main deck (or a
 * raised forecastle), on the flight deck for a carrier's island, masts and
 * director over it, on top of the tallest structure for a director, raised
 * a turret's height for a superfiring turret, low on the side for a
 * casemate, half up the hull's side for a carrier's downturned funnel.
 */
export function blockBase(kit, b, dims = null) {
  const f = mid(b)
  const deck = deckTop(kit, f)
  if (b.y != null) return b.y
  const fd = flightDeckAt(kit, f)
  const fdt = fd ? flightDeckTop(kit) : null
  switch (b.kind) {
    case 'flight-deck':
      return deck + 6 - (b.h ?? 1.2)
    case 'island':
    case 'tower':
    case 'tripod-mast':
    case 'pole-mast':
    case 'cage-mast':
    case 'crane':
      return fdt ?? deck
    case 'funnel': {
      if (b.shape === 'downturned') return deck + 0.5
      if (fdt == null) return deck
      // a carrier's funnel: on the flight deck where it is part of the island (Yorktown's), else up the hull's side to the deck's edge (the escort carriers')
      const island = (kit.blocks || []).find((o) => o.kind === 'island' && (o.side === b.side || !b.side) && Math.abs(mid(o) - f) < 0.08)
      return island ? fdt : deck
    }
    case 'casemate':
      return deck - (dims?.h ?? b.h ?? 2.6) - 0.6
    case 'turret':
      if (b.sf) return deck + Math.max(2.2, (dims?.h ?? b.h ?? 3) + 0.8)
      return deck
    case 'director': {
      let top = deck
      for (const o of kit.blocks || []) {
        if (o === b || !TALL.has(o.kind)) continue
        const [a, c] = span(o)
        if (f < a - 0.025 || f > c + 0.025) continue
        if (o.kind === 'tripod-mast' || o.kind === 'cage-mast') continue
        const od = defaultDims(kit, o)
        top = Math.max(top, blockBase(kit, o, od) + od.h)
      }
      return top
    }
    case 'catapult':
      return deck + 1.5
    default:
      return deck
  }
}

/** The kit's flight deck top above the waterline, from its flight-deck block (y + h), or null. */
export function flightDeckTop(kit) {
  const fdb = (kit.blocks || []).find((b) => b.kind === 'flight-deck')
  if (!fdb) return null
  if (fdb.y != null) return fdb.y + (fdb.h ?? 1.2)
  return null
}

/** The top of the ship (m above the waterline), for bounds and the camera. */
export function shipHeight(kit) {
  let top = Math.max(...[0.02, 0.5, 0.98].map((f) => deckTop(kit, f)))
  for (const b of kit.blocks || []) {
    const d = defaultDims(kit, b)
    top = Math.max(top, blockBase(kit, b, d) + d.h)
  }
  return top
}

export { clamp, lerp }
