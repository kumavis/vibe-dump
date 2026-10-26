// Deck slots (F9a, DESIGN §4.2.5 "View, input, UI"): where a hull's riders
// stand on its deck, as the table draws them. Pure: a unit type in, places
// out, no three.js and no DOM, so sim/data-check.mjs runs it in Node
// against every transport's capacity (deckSlots(t, capacity, 0.8) ≥
// capacity) and view/units.js asks the same function for its figures.
//
//   deckSlots(t, n, scale = 0.8)  → [{ x, z }]: up to n rider places in the
//                                   hull's own frame (x across it, z along
//                                   it, +z its front, the deck's centre at
//                                   0, 0), at most as many as the deck holds
//   deckCount(t, scale = 0.8)     how many the deck holds at that scale
//   deckDiscs(t)                  the deck as discs [[dx, dz, r]] in the
//                                 hull's frame
//
// The packing is a hex lattice of a rider's base (SLOT_BASE, 0.32": the
// infantry base DESIGN's slot table is measured for) at `scale`, centred on
// each deck disc, every slot kept `maxBase` (the largest base the hull
// takes) inside the disc's rim, so whichever squad rides it stands clear of
// the cup's wall. At 0.8 a War-Cart's 1.4" deck holds 13 (DESIGN's table:
// 7 at full scale, 19 at 0.7): 12 riders fit, which full scale (7) never
// did, so 0.8 is the scale the table draws riders at (RIDER_SCALE).
//
// Slots are handed out by angle round the deck's centre (the centre slot
// first, then each ring's slots by bearing from the hull's front, nearer
// before farther at one bearing), so the riders laid out in order (a
// squad's models, then the next squad's) stand in wedges, each squad
// together, the first squad from the front round to the right. The order is
// a function of the type alone: the same hull's riders stand alike on every
// table, built by events or snapped (sim/snap-check.mjs compares them).
//
// One disc for a round hull (its deck, at the hull's centre or (F9b's
// long hulls) `deckAt`); F9b gives a long hull's deck its discs (the
// footprint's, under the shell), each packed alike and the slots of all of
// them pooled, without foreclosing anything here: the lattice and the
// order are per disc, then merged by bearing.

// the base a slot is packed for, before scaling (DESIGN's slot table)
export const SLOT_BASE = 0.32
// the scale the table draws riders at on a deck (DESIGN §4.2.5: the one
// that fits every capacity)
export const RIDER_SCALE = 0.8

// The deck as discs in the hull's frame: [[dx, dz, r]], none for a unit
// that carries nobody.
export function deckDiscs(t) {
  const tr = t?.transport
  if (!tr) return []
  const [dx, dz] = tr.deckAt ?? [0, 0]
  return [[dx, dz, tr.deck]]
}

// every slot the deck holds at `scale`, in the order they are handed out
function allSlots(t, scale) {
  const tr = t?.transport
  if (!tr) return []
  const pitch = 2 * SLOT_BASE * scale, margin = tr.maxBase
  const out = []
  for (const [dx, dz, r] of deckDiscs(t)) {
    const reach = r - margin
    if (!(reach >= 0)) continue
    // the hex lattice round the disc's centre: rows `pitch·√3/2` apart, each
    // other row shifted half a pitch
    const rows = Math.ceil(reach / (pitch * Math.sqrt(3) / 2)) + 1
    const cols = Math.ceil(reach / pitch) + 1
    for (let j = -rows; j <= rows; j++) {
      const z = j * pitch * Math.sqrt(3) / 2, shift = (j & 1) ? pitch / 2 : 0
      for (let i = -cols - 1; i <= cols + 1; i++) {
        const x = i * pitch + shift, d = Math.hypot(x, z)
        // (a hair's grace: a slot exactly on the reach is in)
        if (d > reach + 1e-9) continue
        out.push({ x: dx + x, z: dz + z, d, a: bearing(x, z) })
      }
    }
  }
  // the centre first, then by bearing from the front (clockwise seen from
  // above: +z, then +x), nearer before farther at one bearing
  const mid = (p) => (p.d < 1e-9 ? 0 : 1)
  out.sort((p, q) => mid(p) - mid(q) || (Math.abs(p.a - q.a) > 1e-9 ? p.a - q.a : p.d - q.d))
  return out.map(({ x, z }) => ({ x: clean(x), z: clean(z) }))
}
// a slot's bearing from the hull's front (+z), 0 to 2π, clockwise seen from
// above (toward +x first)
function bearing(x, z) {
  const a = Math.atan2(x, z)
  return a < -1e-12 ? a + 2 * Math.PI : Math.max(0, a)
}
// (a lattice's -0 and 1e-17 read as 0: the places print alike everywhere)
const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : v)

// how many riders the deck holds at `scale`
export const deckCount = (t, scale = RIDER_SCALE) => allSlots(t, scale).length

// Up to n rider places on the deck at `scale`, in the order they are handed
// out (above). Fewer than n when the deck holds fewer: data-check's test.
export function deckSlots(t, n, scale = RIDER_SCALE) {
  return allSlots(t, scale).slice(0, Math.max(0, n | 0))
}
