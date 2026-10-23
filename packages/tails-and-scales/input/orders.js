// The group executor (DESIGN §4.2.6, F10a): a one-shot group action sent as
// the ordinary commands it is, one member at a time, each planned again from
// the match as the last command left it (present/orders.js, in the
// Session's preview), so the members go where the preview drew them. A
// command the Session refuses skips its member ("Blocked"), never retried;
// the members that did nothing stay selected (`left`), so the next click
// can pick another target. It never waits for the table's animation; on
// an online log it waits for each entry to be folded before planning the
// next, and gives up after 10 s ("Orders paused: waiting for the
// connection"). Client code, run from a UI handler (never a sink's
// events): no rule reads it.
//
//   runGroup({ session, seat, verb, members, target, line?, advance? })
//            → Promise<{ sent, blocked: [{ u, why }], left: [u], fell: bool,
//            note }>: `line` the formation's (an Alt-drag), `advance` a Move
//            whose members each advance first (the roll, then the member
//            planned again with it)
import { previewGroup } from '../present/orders.js'

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

export async function runGroup({ session, seat, verb, members, target, line = null, advance = false }) {
  const blocked = [], left = []
  let sent = 0, fell = false
  const opts = { line, advance }
  // the members, in the order the preview plans them, and their places in
  // the formation (kept as each is planned again)
  const first = session.preview((G, q) => previewGroup(G, q, seat, verb, members.map((u) => G.units.find((x) => x.id === u.id)), target, null, opts))
  const order = first.members.map((m) => m.u.id)
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
      if (plan.how === 'none') {
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
