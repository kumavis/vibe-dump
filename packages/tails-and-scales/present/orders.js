// The group planner (DESIGN §4.2.6, F10a): where each member of a group
// would go for a one-shot group action, worked out from the match without
// changing it (pure, its questions the core's queries; every call runs
// inside the Session's preview, with the dice locked). The executor
// (input/orders.js) sends what it plans, one member at a time, planning
// each again from the match as the last command left it, so what the
// preview drew is where the members go (but an advance's roll or a
// wrecker's smash, which the preview can't know).
//
//   slotsOf(G, members, anchor, line?)
//                                    id → { x, z }: each member's place in
//                                    the formation round `anchor` (its
//                                    offset from the group's centre, the
//                                    whole squeezed to a 12" radius, kept
//                                    0.25" inside the table); with a line
//                                    ({ a, b }: an Alt-drag), spread along
//                                    it in ranks instead
//   goalField(G, q, anchor, mode, r, climb)
//                                    the distance from `anchor` to every
//                                    cell for a walker of base r (a whole
//                                    board's reach; (F7a's review) up the
//                                    ladders too for a climber, q.climbs),
//                                    the last 12 cached per match
//   legFor(G, q, u, slot, field, at) the cell u ends its move on: the valid
//                                    end nearest its slot within 1.5", else
//                                    the reachable valid end the field puts
//                                    nearest the anchor; -1 for none
//   approachFor(G, q, u, tg, at)     a shooter: -2 where it stands has tg in
//                                    range and in sight, else among the 16
//                                    reachable valid ends nearest tg the
//                                    first from which it has; a brawler:
//                                    the reachable valid end nearest tg; -1
//                                    for none
//   placeFor(G, q, u, slot, others)  a placement: the free cell nearest its
//                                    slot in its zone, -1 for none
//   previewGroup(G, q, seat, verb, members, target, slots?, { line, advance }?)
//                                    { members: [{ u, cell, slot, how, why,
//                                    sp ((V3c) a caster's fire: its spell) }],
//                                    slots, summary }: verb 'place' and 'move'
//                                    (a point), 'approach', 'fire' and
//                                    'charge' (an enemy unit); `slots`, the
//                                    formation's (a first preview's), when
//                                    the members are planned again one at a
//                                    time (the executor); `line`, the
//                                    formation's line; `advance`, a Move
//                                    whose members advance first (+D6 each:
//                                    the preview plans the plain move, the
//                                    executor each member after its roll)
//   previewSteps(…the same…)          (F8b) the same preview as a generator:
//                                    it yields after each member planned
//                                    ({ members so far, slots, summary:
//                                    "Planning 8 of 21…", of }) and returns
//                                    previewGroup's result, member for
//                                    member (previewGroup drains it), so a
//                                    larger board's ghosts can be planned a
//                                    few a frame (input/standing.js's
//                                    GhostPlanner); each step must run
//                                    inside the Session's preview, as a
//                                    whole preview does
//
// `at`: the virtual occupancy the executor will meet, a Map of id → { x, z }:
// the members planned before stand where they were sent, the rest where
// they are (G). Members are planned nearest the anchor (or the target)
// first, then by id: the front of a group goes first and clears the way
// (Fire: the AI's shooting order).
// Client code (no rule reads it): tuned freely, no bump.
import { attackCount, expected } from '../core/rules.js'

const SQUEEZE = 12 // a formation's radius at most, in inches
const NEAR = 1.5 // a leg ends on its slot's nearest valid end within this
const fields = new WeakMap()

const centre = (members) => {
  let x = 0, z = 0
  for (const u of members) {
    x += u.pos.x
    z += u.pos.z
  }
  return { x: x / members.length, z: z / members.length }
}

export function slotsOf(G, members, anchor, line = null) {
  if (line) return lineSlots(G, members, line)
  const c = centre(members), { W, H } = G.nav
  let R = 0
  for (const u of members) R = Math.max(R, Math.hypot(u.pos.x - c.x, u.pos.z - c.z) + u.r)
  const k = R > SQUEEZE ? SQUEEZE / R : 1
  const out = new Map()
  for (const u of members) {
    const lim = (v, half) => Math.max(-half + u.r + 0.25, Math.min(half - u.r - 0.25, v))
    out.set(u.id, { x: lim(anchor.x + (u.pos.x - c.x) * k, W / 2), z: lim(anchor.z + (u.pos.z - c.z) * k, H / 2) })
  }
  return out
}

// A line formation: the members in the order they stand along a → b, a
// rank spread from end to end (spaced at least 2 × the largest base +
// 0.5"), the ranks after it stepping back toward where the group stands.
function lineSlots(G, members, { a, b }) {
  const { W, H } = G.nav
  const len = Math.hypot(b.x - a.x, b.z - a.z)
  const dx = len > 0 ? (b.x - a.x) / len : 1, dz = len > 0 ? (b.z - a.z) / len : 0
  const gap = 2 * Math.max(...members.map((u) => u.r)) + 0.5
  const per = Math.max(1, Math.floor(len / gap) + 1)
  const c = centre(members)
  let nx = -dz, nz = dx
  if ((c.x - a.x) * nx + (c.z - a.z) * nz < 0) {
    nx = -nx
    nz = -nz
  }
  const along = (u) => (u.pos.x - a.x) * dx + (u.pos.z - a.z) * dz
  const order = [...members].sort((p, q) => along(p) - along(q) || p.id - q.id)
  const out = new Map()
  order.forEach((u, k) => {
    const rank = Math.floor(k / per), file = k % per
    const n = Math.min(per, order.length - rank * per)
    // a full rank spans the line; a short one is centred on it
    const step = n > 1 ? (n === order.length ? len / (n - 1) : gap) : 0
    const t = (len - (n - 1) * step) / 2 + file * step
    const lim = (v, half) => Math.max(-half + u.r + 0.25, Math.min(half - u.r - 0.25, v))
    out.set(u.id, { x: lim(a.x + dx * t + nx * rank * gap, W / 2), z: lim(a.z + dz * t + nz * rank * gap, H / 2) })
  })
  return out
}

// (a whole board's reach from the anchor, for a walker of the base's class:
// cached in a WeakMap keyed by the match, then by the anchor's cell, the nav
// grid's epoch, the mode, the base and (F7a's review) whether it climbs, so
// a refold's new match never meets an old field; the last FIELDS kept, as a
// hover crosses cell after cell. A climber's field goes up the ladders, as
// its own plans do (q.climbs): a squad sent onto a deck that only a ladder
// reaches finds the way)
const FIELDS = 12
export function goalField(G, q, anchor, mode, r, climb = false) {
  let byG = fields.get(G)
  if (!byG) fields.set(G, (byG = new Map()))
  const cell = G.nav.index(anchor.x, anchor.z)
  const key = `${cell}|${G.nav.epoch}|${mode}|${Math.ceil(r * 10)}|${climb ? 'climb' : 'walk'}`
  let f = byG.get(key)
  if (f) byG.delete(key)
  else {
    const m = mode === 'fly' ? 'fly' : mode === 'wreck' ? 'wreck' : 'walk'
    f = G.nav.reach(G.nav.x(cell), G.nav.z(cell), { r: Math.ceil(r * 10) / 10, max: Infinity, mode: m, climb }).dist
    if (byG.size >= FIELDS) byG.delete(byG.keys().next().value)
  }
  byG.set(key, f)
  return f
}

export function legFor(G, q, u, slot, field, at) {
  const plan = q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
  const nav = G.nav
  const i0 = nav.index(slot.x, slot.z)
  // the valid end nearest the slot, within NEAR
  let best = -1, bd = NEAR
  if (i0 >= 0) {
    const R = Math.ceil(NEAR / nav.cell), cx = i0 % nav.nx, cz = (i0 / nav.nx) | 0
    for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
      const ix = cx + dx, iz = cz + dz
      if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
      const i = iz * nav.nx + ix
      const d = Math.hypot(nav.x(i) - slot.x, nav.z(i) - slot.z)
      if (d < bd && q.validEnd(G, plan, i, at)) {
        bd = d
        best = i
      }
    }
  }
  if (best >= 0) return { cell: best, arrive: true, plan }
  // else the reachable valid end the field puts nearest the anchor (ties:
  // the lowest cell), if any is nearer than where it stands
  const here = nav.index(u.pos.x, u.pos.z)
  let bf = here >= 0 && Number.isFinite(field[here]) ? field[here] : Infinity
  for (let i = 0; i < nav.N; i++) {
    if (!Number.isFinite(plan.res.dist[i]) || !(field[i] < bf)) continue
    if (!q.validEnd(G, plan, i, at)) continue
    bf = field[i]
    best = i
  }
  return { cell: best, arrive: false, plan }
}

export function approachFor(G, q, u, tg, at) {
  const plan = q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
  const nav = G.nav, w = u.t.ranged
  const ends = []
  for (let i = 0; i < nav.N; i++) if (Number.isFinite(plan.res.dist[i])) ends.push(i)
  const dist = (i) => Math.hypot(nav.x(i) - tg.pos.x, nav.z(i) - tg.pos.z)
  ends.sort((a, b) => dist(a) - dist(b) || a - b)
  if (w && u.t.ai !== 'melee') {
    // a shooter: stay if the target is in range and in sight where it
    // stands, else the nearest end from which it is (in range and sight
    // alone, which no other member's move changes, so the preview and the
    // executor agree; whether the shot may then be taken is the shooting
    // phase's)
    const can = (from) => Math.hypot(tg.pos.x - from.x, tg.pos.z - from.z) - u.r - tg.r <= w.range && q.sight(G, u, tg, from).visible
    if (can(u.pos)) return { cell: -2, plan }
    let tried = 0
    for (const i of ends) {
      if (!q.validEnd(G, plan, i, at)) continue
      if (can({ x: nav.x(i), z: nav.z(i) })) return { cell: i, plan }
      if (++tried >= 16) break
    }
    return { cell: -1, plan }
  }
  for (const i of ends) if (q.validEnd(G, plan, i, at)) return { cell: i, plan }
  return { cell: -1, plan }
}

export function placeFor(G, q, u, slot, others) {
  const p = q.freeSpot(G, u, slot.x, slot.z, u.side, others)
  return p ? G.nav.index(p.x, p.z) : -1
}

// The order the members go in: nearest the point first, then by id.
const byNearness = (members, p) => [...members].sort((a, b) => Math.hypot(a.pos.x - p.x, a.pos.z - p.z) - Math.hypot(b.pos.x - p.x, b.pos.z - p.z) || a.id - b.id)

export function previewGroup(G, q, seat, verb, members, target, given = null, opts = {}) {
  const steps = previewSteps(G, q, seat, verb, members, target, given, opts)
  for (;;) {
    const r = steps.next()
    if (r.done) return r.value
  }
}

// (a member planned: the preview so far)
const partial = (out, slots, of) => ({ members: out.slice(), slots, summary: `Planning ${out.length} of ${of}…`, of })

export function* previewSteps(G, q, seat, verb, members, target, given = null, { line = null, advance = false } = {}) {
  const out = []
  const at = new Map()
  if (verb === 'place') {
    const slots = given ?? slotsOf(G, members, target, line)
    for (const u of byNearness(members, target)) {
      const slot = slots.get(u.id)
      // (the others where they stand, or where they were just planned)
      const others = G.units.filter((o) => o !== u && q.alive(o)).map((o) => (at.has(o.id) ? { ...o, pos: at.get(o.id) } : o))
      const cell = placeFor(G, q, u, slot, others)
      if (cell >= 0) at.set(u.id, { x: G.nav.x(cell), z: G.nav.z(cell) })
      out.push({ u, cell, slot, how: cell >= 0 ? 'arrive' : 'none', why: cell >= 0 ? '' : 'no room in the zone' })
      yield partial(out, slots, members.length)
    }
    const n = out.filter((m) => m.cell >= 0).length
    return { members: out, slots, summary: `Place ${members.length} · ${n} fit${n < members.length ? ` · ${members.length - n} don't` : ''}` }
  }
  if (verb === 'move') {
    const slots = given ?? slotsOf(G, members, target, line)
    for (const u of byNearness(members, target)) {
      // (a unit in combat is left where it is: a group order never makes
      // it fall back; (F9a) a rider rides along with its hull, DESIGN
      // §4.2.5's groups: it is sent nothing)
      const stuck = u.aboard ? 'with the hull' : u.flags.moved || !q.canAct(G, u) ? 'already moved' : q.isEngaged(G, u) ? 'in combat' : ''
      if (stuck) {
        out.push({ u, cell: -1, slot: slots.get(u.id), how: 'none', why: stuck })
        continue
      }
      const slot = slots.get(u.id)
      const field = goalField(G, q, target, q.moveMode(u), u.r, q.climbs(u))
      // ((F8b) a frame for the field, a whole-board walk when it is a new
      // one, and one for the leg)
      yield partial(out, slots, members.length)
      const leg = legFor(G, q, u, slot, field, at)
      if (leg.cell >= 0) at.set(u.id, { x: G.nav.x(leg.cell), z: G.nav.z(leg.cell) })
      out.push({ u, cell: leg.cell, slot, how: leg.cell < 0 ? 'none' : leg.arrive ? 'arrive' : 'short', why: leg.cell < 0 ? 'no way nearer' : '' })
      yield partial(out, slots, members.length)
    }
    const arrive = out.filter((m) => m.how === 'arrive').length, short = out.filter((m) => m.how === 'short').length
    return { members: out, slots, summary: `Move ${members.length}${advance ? ' (+D6 each)' : ''} · ${arrive} arrive${short ? ` · ${short} fall short` : ''}` }
  }
  if (verb === 'approach') {
    for (const u of byNearness(members, target.pos)) {
      const stuck = u.aboard ? 'with the hull' : u.flags.moved || !q.canAct(G, u) ? 'already moved' : q.isEngaged(G, u) ? 'in combat' : ''
      if (stuck) {
        out.push({ u, cell: -1, how: 'none', why: stuck })
        continue
      }
      const ap = approachFor(G, q, u, target, at)
      if (ap.cell >= 0) at.set(u.id, { x: G.nav.x(ap.cell), z: G.nav.z(ap.cell) })
      out.push({ u, cell: ap.cell, how: ap.cell === -2 ? 'stay' : ap.cell >= 0 ? 'arrive' : 'none', why: ap.cell === -1 ? 'no way in range' : '' })
      yield partial(out, undefined, members.length)
    }
    const go = out.filter((m) => m.how === 'arrive').length
    return { members: out, summary: `Approach ${target.t.short} · ${go} move${out.some((m) => m.how === 'stay') ? ` · ${out.filter((m) => m.how === 'stay').length} already in range` : ''}` }
  }
  if (verb === 'fire') {
    for (const u of fireOrder(members)) {
      // ((V3c) a caster casts at it the spell the AI would (spellFor: of
      // those that take an enemy, the one it values most there), carried
      // as the member's `sp`)
      const sp = q.spellFor(G, u, target)
      const can = q.canShoot(G, u) && (sp === undefined ? q.shootTargets(G, u).includes(target) : sp >= 0)
      out.push({ u, cell: -1, how: can ? 'fire' : 'none', why: can ? '' : whyNot(G, q, u, target, 'shoot'), ...(can && sp !== undefined ? { sp } : {}) })
    }
    const firing = out.filter((m) => m.how === 'fire')
    // the models it may slay, on average (volleys: a blast's or a spell's
    // templates and casts left out)
    let slain = 0
    for (const { u, sp } of firing) {
      const w = q.weaponOf(u, sp), info = q.shotInfo(G, u, target, sp)
      if (!w.blast && !w.spell && info.ok) slain += expected(attackCount(u, w, false), info.need, w, target, info.cover).kills
    }
    const cant = out.length - firing.length, why = out.find((m) => m.how === 'none')?.why
    return { members: out, summary: `${firing.length} of ${members.length} fire at ${target.t.short}${slain > 0 ? ` (≈${Math.min(target.alive, slain).toFixed(1)} slain)` : ''}${cant ? ` · ${cant} can't${why ? `: ${why}` : ''}` : ''}` }
  }
  if (verb === 'charge') {
    for (const u of byNearness(members, target.pos)) {
      const can = q.canCharge(G, u) && q.chargeTargets(G, u).includes(target)
      out.push({ u, cell: -1, how: can ? 'charge' : 'none', why: can ? '' : whyNot(G, q, u, target, 'charge') })
    }
    const n = out.filter((m) => m.how === 'charge').length
    return { members: out, summary: `${n} of ${members.length} charge ${target.t.short}` }
  }
  return { members: [], summary: '' }
}

// fire in the AI's shooting order: its roles reversed (artillery first),
// stable
const ROLES = ['melee', 'raider', 'line', 'shooter', 'hero', 'artillery']
const fireOrder = (members) => [...members].sort((a, b) => ROLES.indexOf(b.t.ai) - ROLES.indexOf(a.t.ai))

function whyNot(G, q, u, tg, act) {
  if (act === 'shoot') {
    if (!u.t.ranged) return 'no gun'
    if (!q.canShoot(G, u)) return 'can\'t shoot now'
    return 'out of range or sight'
  }
  if (!q.canCharge(G, u)) return 'can\'t charge now'
  return 'out of reach'
}
