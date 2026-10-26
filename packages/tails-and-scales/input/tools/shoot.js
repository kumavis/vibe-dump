// The shooting tool (DESIGN §2.5): a unit picked up in its seat's shooting
// phase, the pointer over an enemy shows the shot's odds (or why it can't
// shoot it), and a click on it is { t: 'shoot', u, tg } (the match judges
// it: in range, in sight).
//
// (F7b, DESIGN §4.2.4's line of sight with its reasons) Hovering an enemy
// also draws the rays the shot is judged by, eye to chest (`ray(rays,
// colour)`, the overlay's: green clear, amber obscured or in cover, red
// blocked), and the tooltip says why (losText): what stops it, what it
// passes, what high ground sees over.
import { oddsText, losText, LOS_COLORS } from '../../ui/tooltip.js'

// Inside the caller's preview: what unit `sel` shooting `target` would do.
export function preview(G, q, sel, target, ray = null) {
  const info = q.shotInfo(G, sel, target)
  const los = sightOf(G, q, sel, target)
  ray?.(los.rays, LOS_COLORS[los.verdict])
  const why = losText(los)
  // (refused: why, and below it what the rays meet: what stops them when
  // it is the sight, what they would pass when it is the range)
  return info.ok ? `${oddsText(sel, target, info)}${why}` : `✖ ${info.why}${why}`
}

// What unit `u` sees of `tg` from where it stands, and why (inside a
// preview, the dice locked): the match's own sightInfo ({ ok, block,
// obscure, cover, high, seen, total }), the rays it casts (from the eye,
// its floor and eyeY over its centre, to each standing model's chest, its
// own floor and chestY: core/queries.js's look), the verdict (blocked, a
// shot in cover or past an obscurer, or clear), each chunk the reasons name
// by name, and on high ground what the rays pass over: each chunk that
// stands in the way across the table (a ray's line over the ground crosses
// its footprint) which the rays meet nowhere (not the block, not among the
// obscurers), so height looks over it: a hedge below a deck, or the
// shooter's own deck's parapets, which it fires over. (The chunks the
// shooter or a target stands on are no part of the way.)
export function sightOf(G, q, u, tg) {
  const s = q.sightInfo(G, u, tg)
  const eye = { x: u.pos.x, y: q.floorAt(G, u.pos.x, u.pos.z) + q.eyeY(u), z: u.pos.z }
  const rays = []
  for (const m of tg.models) {
    if (!m.alive) continue
    const x = q.mx(tg, m), z = q.mz(tg, m)
    rays.push({ a: eye, b: { x, y: q.floorAt(G, x, z) + q.chestY(tg), z } })
  }
  const verdict = !s.ok ? 'blocked' : s.cover || s.obscure.length ? 'cover' : 'clear'
  const byId = new Map(G.terrain.chunks.map((c) => [c.id, c]))
  const over = []
  if (s.high) {
    for (const c of G.terrain.chunks) {
      if (!c.alive || !c.los || c.id === s.block || s.obscure.includes(c.id)) continue
      if (inside(c.shape, eye) || rays.some((r) => inside(c.shape, r.b))) continue
      if (rays.some((r) => crosses(c.shape, r.a, r.b))) over.push(c.id)
    }
  }
  const name = (id) => nameOf(byId.get(id))
  return { ...s, rays, verdict, over, name }
}

// what a chunk is called in the reasons
const NAMES = { parapet: 'a parapet', tree: 'the trees', hedge: 'the hedge', rock: 'the rocks', mushroom: 'the mushrooms', rubble: 'the rubble', log: 'the fallen tree', post: 'a post', floor: 'the wood' }
export function nameOf(c) {
  if (!c) return 'something'
  if (c.kind === 'deck') return c.look.recipe === 'platform' ? 'the timber platform' : `the ${c.look.recipe}`
  if (c.kind === 'block') return c.look.piece === 'log' ? 'the log wall' : 'the wall'
  if (c.kind === 'crate') return c.look.piece === 'barrel' ? 'the barrels' : c.look.piece === 'sack' ? 'the sacks' : 'the crates'
  return NAMES[c.kind] ?? `the ${c.kind}`
}

// a chunk's footprint (its shape's box seen from above, turned by its yaw:
// core/terrain/geom.js's frame, as view/terrain.js's topAt reads it) in the
// table's terms: point p inside it, and the segment from a to b across it
const local = (s, p) => {
  const co = Math.cos(s.yaw ?? 0), sn = Math.sin(s.yaw ?? 0), dx = p.x - s.x, dz = p.z - s.z
  return { x: dx * co - dz * sn, z: dx * sn + dz * co }
}
const inside = (s, p) => {
  const l = local(s, p)
  return Math.abs(l.x) <= s.hx && Math.abs(l.z) <= s.hz
}
function crosses(s, a, b) {
  const la = local(s, a), lb = local(s, b)
  let t0 = 0, t1 = 1
  for (const [k, h] of [['x', s.hx], ['z', s.hz]]) {
    const d = lb[k] - la[k]
    if (Math.abs(d) < 1e-9) {
      if (Math.abs(la[k]) > h) return false
      continue
    }
    let u = (-h - la[k]) / d, v = (h - la[k]) / d
    if (u > v) [u, v] = [v, u]
    t0 = Math.max(t0, u)
    t1 = Math.min(t1, v)
    if (t0 > t1) return false
  }
  return true
}

// the command
export const shootAt = (u, tg) => ({ t: 'shoot', u: u.id, tg: tg.id })
