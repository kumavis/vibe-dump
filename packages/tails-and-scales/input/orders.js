// The group executor (DESIGN §4.2.6, F10a): a one-shot group action sent as
// the ordinary commands it is, one member at a time, each planned again from
// the match as the last command left it (present/orders.js, in the
// Session's preview), so the members go where the preview drew them (Fire
// and Charge: only the members it named). A command the Session refuses
// skips its member ("N blocked"), never retried; `left` lists the members
// that did nothing (which stay picked is input/group.js's settle(): those
// still able to act once the table has caught up). It never waits for the
// table's animation; on an online log it waits for each entry to be folded
// before planning the next, and gives up after 10 s ("Orders paused:
// waiting for the connection"). Client code, run from a UI handler (never a sink's
// events): no rule reads it.
//
//   runGroup({ session, seat, verb, members, target, line?, advance?, slots? })
//            → Promise<{ sent, blocked: [{ u, why }], left: [u], fell: bool,
//            note }>: `line` the formation's (an Alt-drag), `advance` a Move
//            whose members each advance first (the roll, then the member
//            planned again with it), (F10c) `slots` the formation's own (a
//            pin its handle turned: id → { x, z })
//
// (F10c) runOrders({ session, seat, orders, then? }) → Promise<{ sent,
// blocked: [{ id, why }], acted: [ids] }>: the seat's standing orders
// (orders: id → order, input/book.js's) carried out for the phase at hand,
// in §4.2.6's order: March and Attack first, each unit's commands planned
// from the match as the last left it (present/standing.js's stepOf; an
// advance sent alone, the unit then planned again on its roll), in the AI's
// role order (reversed for shots); then one `pilot` for every unit whose
// order calls for the AI and that can still act; then `then` ('end' at End,
// 'auto' at Auto; none at Go, the phase left open). A unit whose command is
// refused is skipped for the phase ("Blocked"), never retried.
import { previewGroup } from '../present/orders.js'
import { stepOf, orderedUnits } from '../present/standing.js'

const WAIT = 10000

// the entry just sent folded (synchronous on a local log; an online one may
// take a round trip)
async function folded(session, n) {
  const t0 = Date.now()
  while (session.count <= n) {
    if (Date.now() - t0 > WAIT) return false
    await new Promise((r) => setTimeout(r, 30))
  }
  return true
}

export async function runGroup({ session, seat, verb, members, target, line = null, advance = false, slots = null }) {
  const blocked = [], left = []
  let sent = 0, fell = false
  const opts = { line, advance }
  // the members, in the order the preview plans them, and their places in
  // the formation (kept as each is planned again)
  const first = session.preview((G, q) => previewGroup(G, q, seat, verb, members.map((u) => G.units.find((x) => x.id === u.id)), target, slots, opts))
  const order = first.members.map((m) => m.u.id)
  // (Fire and Charge: only the members the preview named, so what is sent
  // is what it said; one a shot made able since stays for the next click)
  const named = new Map(first.members.map((m) => [m.u.id, m.how]))
  const send = async (body, u) => {
    const why = session.legal(seat, body)
    if (why) {
      blocked.push({ u, why })
      return false
    }
    const n = session.count
    try {
      session.submit(seat, body)
    } catch (err) {
      blocked.push({ u, why: err.message })
      return false
    }
    sent++
    if (!(await folded(session, n))) throw new Error('Orders paused: waiting for the connection')
    return true
  }
  for (const id of order) {
    const G = session.G
    const u = G.units.find((x) => x.id === id)
    if (!u || !(u.alive > 0)) continue
    if (G.pending?.k === 'chargeEnd') break
    // (+D6: the member advances first, where the match takes it; a member
    // that may not keeps its plain move)
    if (verb === 'move' && advance && !session.legal(seat, { t: 'advance', u: id })) await send({ t: 'advance', u: id }, u)
    // the member planned again, the members before it where they went
    const plan = session.preview((G, q) => previewGroup(G, q, seat, verb, [session.G.units.find((x) => x.id === id)], target, first.slots, opts)).members[0]
    if (verb === 'fire' || verb === 'charge') {
      const tg = G.units.find((x) => x.id === target.id)
      if (!tg || !(tg.alive > 0)) {
        fell = true
        left.push(u)
        continue
      }
      if (plan.how === 'none' || named.get(id) !== plan.how) {
        left.push(u)
        continue
      }
      if (verb === 'fire') await send({ t: 'shoot', u: id, tg: tg.id }, u)
      else if (await send({ t: 'charge', u: id, tg: tg.id }, u)) {
        // a charge that made contact waits on its end: the shortest move
        if (session.G.pending?.k === 'chargeEnd' && session.decisionFor() === seat) await send({ t: 'chargeEnd', c: -1 }, u)
      }
      continue
    }
    if (plan.cell < 0) {
      if (plan.how !== 'stay') left.push(u)
      continue
    }
    await send(verb === 'place' ? { t: 'place', u: id, c: plan.cell } : { t: 'move', u: id, c: plan.cell }, u)
  }
  if ((verb === 'fire' || verb === 'charge') && target) {
    const tg = session.G.units.find((x) => x.id === target.id)
    if (!tg || !(tg.alive > 0)) fell = true
  }
  const note = fell ? `Target down${left.length ? ` · ${left.length} still ready` : ''}` : blocked.length ? `${blocked.length} blocked` : ''
  return { sent, blocked, left, fell, note }
}

export async function runOrders({ session, seat, orders, then = null, skip = new Set() }) {
  const blocked = [], acted = new Set(), piloted = []
  let sent = 0
  const phaseNow = () => {
    const P = session.G?.pending
    return P?.k === 'phase' && P.seats.includes(seat) ? P.phase : null
  }
  const send = async (body, id) => {
    const why = session.legal(seat, body)
    if (why) {
      blocked.push({ id, why })
      return false
    }
    const n = session.count
    try {
      session.submit(seat, body)
    } catch (err) {
      blocked.push({ id, why: err.message })
      return false
    }
    sent++
    if (!(await folded(session, n))) throw new Error('Orders paused: waiting for the connection')
    return true
  }
  const phase = phaseNow()
  if (!phase) return { sent, blocked, acted: [], piloted }
  const unit = (G, id) => G.units.find((x) => x.id === id)
  // 1. March and Attack: their own commands
  const ids = session.preview((G, q) => orderedUnits(G, q, seat, orders, phase).map((u) => u.id))
  for (const id of ids) {
    const o = orders.get(id)
    if (o.k !== 'march' && o.k !== 'attack') continue
    // (an advance, then the unit planned again on its roll)
    for (let k = 0; k < 2 && phaseNow() === phase; k++) {
      const step = session.preview((G, q) => (unit(G, id) ? stepOf(G, q, unit(G, id), o, phase) : { how: 'none' }))
      if (step.how !== 'macro') break
      let ok = true
      for (const body of step.cmds) {
        // (a charge that missed opens no end to pick)
        if (body.t === 'chargeEnd' && !(session.G.pending?.k === 'chargeEnd' && session.decisionFor() === seat)) continue
        if (!(ok = await send(body, id))) break
      }
      if (ok) acted.add(id)
      if (!ok || step.cmds[0].t !== 'advance') break
    }
  }
  // 2. one pilot: every unit whose order calls for the AI now (but those
  // `skip` names: a pilot already left them as they were this phase)
  if (phaseNow() === phase) {
    const pilots = session.preview((G, q) => orderedUnits(G, q, seat, orders, phase).filter((u) => !skip.has(u.id) && stepOf(G, q, u, orders.get(u.id), phase).how === 'pilot').map((u) => u.id))
    if (pilots.length && (await send({ t: 'pilot', m: session.preview((G, q) => q.maskOf(G, seat, pilots)) }, -1))) {
      for (const id of pilots) acted.add(id)
      piloted.push(...pilots)
    }
  }
  // 3. End; or Auto: the AI plays the units no order holds (a pilot of
  // those, then the end: P-auto's pilot and end being Auto), so a unit
  // under March, Attack or Hold is left as its order left it (never fallen
  // back from combat, never walked off its post)
  if (then === 'auto' && phaseNow() === phase) {
    const rest = session.preview((G, q) => G.units.filter((u) => u.side === seat && !orders.has(u.id) && q.alive(u) && q.canAct(G, u)).map((u) => u.id))
    if (rest.length) await send({ t: 'pilot', m: session.preview((G, q) => q.maskOf(G, seat, rest)) }, -1)
    then = 'end'
  }
  if (then && phaseNow() === phase) await send({ t: then }, -1)
  return { sent, blocked, acted: [...acted], piloted }
}
