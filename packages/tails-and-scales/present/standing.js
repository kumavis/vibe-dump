// Standing orders (DESIGN §4.2.6, F10c): what a unit's order does in the
// phase at hand, worked out from the match without changing it (pure, its
// questions the core's queries; every call runs inside the Session's
// preview, with the dice locked). The orders themselves live in a book on
// this device (input/book.js), never in the match; the executor
// (input/orders.js's runOrders) sends what this plans, one unit at a time,
// planning each again from the match as the last command left it.
//
//   order   { k: 'march', anchor: cell, slot: cell, best?, stall? }
//           { k: 'attack', tg: id } | { k: 'hold' } | { k: 'auto' }
//
//   covers(order, phase)          whether the order acts in the phase
//   stepOf(G, q, u, order, phase) what it does for u now: { how: 'macro',
//                                 cmds: [bodies] } (March and Attack's own
//                                 commands: an advance is sent alone, the
//                                 unit then planned again on its roll),
//                                 { how: 'pilot' } (the AI plays it: one
//                                 `pilot` for every such unit), or
//                                 { how: 'none', why }
//   actorsOf(G, q, seat, orders)  the seat's ordered units that would act in
//                                 the phase now (End's ⟳ badge, Go's count):
//                                 [{ u, how }], in the executor's order
//   doneOf(G, q, u, order)        an order fulfilled or failed by the match as
//                                 it stands: { next: order | null, note }
//                                 or null (still going): a march within 1.5" of
//                                 its slot holds ('Arrived'), an attack whose
//                                 target fell goes on autopilot ('Target
//                                 down')
//   progressOf(G, q, u, order)    a march after its movement phase: the order
//                                 with its best distance to the anchor and how
//                                 many turns running it gained under 0.5"
//                                 (2: dropped, 'Blocked')
//
// The rules of thumb (§4.2.6's table) are client code, tuned freely, no
// bump: a march advances first when its slot is more than a move away and
// nothing is in range of its gun; an attack's brawler goes for the valid end
// nearest its target, advancing when the gap is over M + 12" (or M + 6" for
// one that may still charge after advancing), and charges at odds of 25%
// (melee) or 42% (the rest); its shooter approaches into range and sight,
// and fires at the target when the shot is on, else the AI picks. A unit in
// combat never falls back under March or Attack (only the AI may, on
// autopilot).
import { p2D6 } from '../core/rules.js'
import { goalField, legFor, approachFor } from './orders.js'

export const KINDS = ['march', 'attack', 'hold', 'auto']
export const GLYPH = { march: '➜', attack: '🎯', hold: '⚓', auto: '⟳' }
export const NAME = { march: 'March', attack: 'Attack', hold: 'Hold', auto: 'Autopilot' }
const COVERS = { march: ['move', 'shoot'], attack: ['move', 'shoot', 'charge'], hold: ['shoot'], auto: ['move', 'shoot', 'charge'] }
export const covers = (o, phase) => !!o && (COVERS[o.k] ?? []).includes(phase)

// the AI's role order: moves and charges in it, shots reversed (as the AI's
// own phases go)
const ROLES = ['melee', 'raider', 'line', 'shooter', 'hero', 'artillery']
// (a march is there within its leg's own reach of its slot: legFor ends on
// the valid end nearest the slot within 1.5", so a slot crowded by others
// still counts)
const ARRIVED = 1.5
const at = (G, c) => ({ x: G.nav.x(c), z: G.nav.z(c) })
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z)
// an enemy in range of u's gun where it stands (in range, not sight: a
// march's question is whether to keep the gun's shot)
const targetInRange = (G, q, u) => !!u.t.ranged && G.units.some((e) => e.side !== u.side && q.alive(e) && Math.hypot(e.pos.x - u.pos.x, e.pos.z - u.pos.z) - e.r - u.r <= u.t.ranged.range)
const brawler = (u) => !u.t.ranged || u.t.ai === 'melee'

export function stepOf(G, q, u, o, phase) {
  if (!q.alive(u) || !covers(o, phase)) return { how: 'none', why: '' }
  if (!q.canAct(G, u)) return { how: 'none', why: phase === 'move' ? 'already moved' : 'nothing to do' }
  if (o.k === 'hold' || o.k === 'auto') return { how: 'pilot' }
  if (o.k === 'march') {
    if (phase !== 'move') return { how: 'pilot' }
    if (q.isEngaged(G, u)) return { how: 'none', why: 'in combat' }
    const slot = at(G, o.slot), anchor = at(G, o.anchor)
    if (dist(u.pos, slot) <= ARRIVED) return { how: 'none', why: 'arrived' }
    const field = goalField(G, q, anchor, q.moveMode(u), u.r)
    const here = G.nav.index(u.pos.x, u.pos.z)
    // (further than a move from its slot, nothing for its gun: a D6 more)
    if (!u.flags.advanced && dist(u.pos, slot) > u.t.M && !targetInRange(G, q, u)) return { how: 'macro', cmds: [{ t: 'advance', u: u.id }] }
    const leg = legFor(G, q, u, slot, field, null)
    if (leg.cell < 0 || leg.cell === here) return { how: 'none', why: 'no way nearer' }
    return { how: 'macro', cmds: [{ t: 'move', u: u.id, c: leg.cell }] }
  }
  // an attack
  const tg = G.units.find((x) => x.id === o.tg)
  if (!tg || !q.alive(tg)) return { how: 'none', why: 'target down' }
  if (phase === 'shoot') return q.canShoot(G, u) && q.shotInfo(G, u, tg).ok ? { how: 'macro', cmds: [{ t: 'shoot', u: u.id, tg: tg.id }] } : { how: 'pilot' }
  if (phase === 'charge') {
    if (!q.canCharge(G, u) || !q.chargeTargets(G, u).includes(tg)) return { how: 'none', why: 'out of reach' }
    const plan = q.chargePlan(G, u, tg)
    if (!plan) return { how: 'none', why: 'no way to it' }
    const odds = p2D6(plan.need)
    if (odds < (u.t.ai === 'melee' ? 0.25 : 0.42)) return { how: 'none', why: `${Math.round(odds * 100)}% to reach it` }
    return { how: 'macro', cmds: [{ t: 'charge', u: u.id, tg: tg.id }, { t: 'chargeEnd', c: -1 }] }
  }
  // the movement phase
  if (q.isEngaged(G, u)) return { how: 'none', why: 'in combat' }
  const gap = Math.hypot(tg.pos.x - u.pos.x, tg.pos.z - u.pos.z) - u.r - tg.r
  if (brawler(u)) {
    if (!u.flags.advanced && (gap > u.t.M + 12 || (gap > u.t.M + 6 && u.t.chargeAfterAdvance))) return { how: 'macro', cmds: [{ t: 'advance', u: u.id }] }
  }
  const ap = approachFor(G, q, u, tg, null)
  if (ap.cell === -2) return { how: 'none', why: 'in range' }
  if (ap.cell < 0 || ap.cell === G.nav.index(u.pos.x, u.pos.z)) return { how: 'none', why: 'no way nearer' }
  return { how: 'macro', cmds: [{ t: 'move', u: u.id, c: ap.cell }] }
}

// The seat's ordered units in the executor's order: March and Attack in the
// AI's role order (reversed for shots), stable by G.units; then the rest.
export function orderedUnits(G, q, seat, orders, phase) {
  const mine = G.units.filter((u) => u.side === seat && q.alive(u) && covers(orders.get(u.id), phase))
  const rank = (u) => ROLES.indexOf(u.t.ai)
  return phase === 'shoot' ? mine.sort((a, b) => rank(b) - rank(a)) : mine.sort((a, b) => rank(a) - rank(b))
}

export function actorsOf(G, q, seat, orders, phase) {
  const out = []
  for (const u of orderedUnits(G, q, seat, orders, phase)) {
    const s = stepOf(G, q, u, orders.get(u.id), phase)
    if (s.how !== 'none') out.push({ u, how: s.how })
  }
  return out
}

export function doneOf(G, q, u, o) {
  if (!o) return null
  if (o.k === 'march' && dist(u.pos, at(G, o.slot)) <= ARRIVED) return { next: { k: 'hold' }, note: 'Arrived' }
  if (o.k === 'attack') {
    const tg = G.units.find((x) => x.id === o.tg)
    if (!tg || !q.alive(tg)) return { next: { k: 'auto' }, note: 'Target down' }
  }
  return null
}

// (after the seat's movement phase: how far the march's field puts it from
// its anchor, against the best it has done)
export function progressOf(G, q, u, o) {
  const field = goalField(G, q, at(G, o.anchor), q.moveMode(u), u.r)
  const v = field[G.nav.index(u.pos.x, u.pos.z)]
  const best = o.best ?? Infinity
  if (Number.isFinite(v) && v < best - 0.5) return { order: { ...o, best: v, stall: 0 }, blocked: false }
  const stall = (o.stall ?? 0) + 1
  return stall >= 2 ? { order: null, blocked: true } : { order: { ...o, best: Math.min(best, Number.isFinite(v) ? v : best), stall }, blocked: false }
}
