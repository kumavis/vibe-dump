// P-macro (DESIGN §4.2.9's row; F10a): the one-shot group actions
// (present/orders.js plans them, input/orders.js sends them) over a real
// Session in Node. Random groups of a seat's units, on states the human
// corpus logs pass through (each probe a Session of its own: the log's
// start and its entries up to the probe, then the group action), with a
// random target: a point (Place in the deployment, Move in the movement
// phase), or an enemy (Approach, Fire, Charge). Each must:
//   - send only commands the match takes (nothing the Folder rejects), and
//     never throw;
//   - land each member that moved on the cell the group's preview drew for
//     it (Place, Move and Approach; a wrecker's smash, which reshapes the
//     board under the members after it, is left out), and move no member
//     the preview left where it stood;
//   - never send a member in combat a move or an advance (a group order
//     never makes it fall back);
//   - Fire: shoot only with the members the preview said would, at the
//     target, every one of them unless it falls first; Charge: charge only
//     with those it said may, each charge that made contact ended (no
//     decision left open);
//   - finish within its budget (1 s here for a classic group).
// (F9a, DESIGN §4.2.5's Groups) And with transports, on Field battles of
// their own (both seats human, two War-Carts a side, at a movement phase):
// a group Move holding a hull, its riders and a unit beside it, sent as the
// group bar sends it (input/group.js GroupInput's preview and run), moves
// the hull to the cell its preview drew, its riders riding along (each
// where the hull now stands, still aboard, sent nothing, and given no cell
// of its own by the preview), the preview saying "riders ride along"; and
// a rider under any standing
// order does nothing of its own in the movement phase, its step reading
// "with the hull", nor is it among the actors End would act for.
// (F9b, DESIGN §4.2.9's P-macro row) And with long hulls, on Field battles
// of their own (both seats human, the Coil's list holding two Howdahs, at
// the Coil's movement phase): a group Move holding both Howdahs and a
// friend lands each member on the cell its preview drew and each long hull
// facing the heading its preview drew (its move's default there; (F9b's
// sweep) the executor sends the planner's f, so each hull's f is held to
// the default rule as its move is sent, too; the board unsmashed, else
// left out, as a wrecker's is above); and a March with a long hull (its
// field its body disc's) counts among the march scenarios and their 80%.
// (F9b's review) And through GroupInput itself (its page parts stood in
// for): a pinned group of both Howdahs, in the deployment and in the
// movement phase, one ghost turned (face(), as ] and the handle turn it)
// to a heading beside which a member planned after it no longer fits
// where its ghost stood: the ghosts planned again round it, the turned
// one showing the heading turned to, and the group sent as the bar sends
// it landing each hull on the cell and heading its ghost then showed; and
// a lone Howdah engaged at its movement phase (both seats' AI playing on
// until one is) is no group of one (loneHull, its
// ground click not the group's), the one-unit move tool's fall back from
// a click inside its red area taken.
// A third of the point orders take a line formation (as an Alt-drag pins
// one), and a third of the moves +D6 (each member advancing first: its
// landing the roll's, so held only to acting once, and only in the group).
//
//   node sim/macro-check.mjs [--probes N] [--seed S] [--self-test]
//
// --self-test plants faults in a copy of the planner and the executor (a
// preview that ignores the members planned before it, one that lets a
// member in combat fall back, an executor that loses the formation's slots
// as it plans each member again, or its line, a Fire that stops after one
// shot; (F9a) a group Move that sends its riders, a preview that never
// says they ride along) and expects each to be caught, after the code as
// it stands passes the same run. (The Session itself
// refuses an illegal command, so an executor that skips its own legality
// check sends nothing illegal: no fault this can show.) Exit 0 when
// everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { jobSetup, seatDevices } from './run.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { probes: { type: 'string' }, seed: { type: 'string' }, 'self-test': { type: 'boolean' } } })

async function load(dir) {
  const at = (f) => import(pathToFileURL(join(dir, f)).href)
  const [session, store, orders, exec, standing, book, sti, group, core, schema, mission, moveTool] = await Promise.all([at('match/session.js'), at('match/store.js'), at('present/orders.js'), at('input/orders.js'), at('present/standing.js').catch(() => null), at('input/book.js').catch(() => null), at('input/standing.js').catch(() => null), at('input/group.js').catch(() => null), at('core/index.js'), at('data/schema.js'), at('data/mission.js'), at('input/tools/move.js')])
  return { Session: session.Session, LocalStore: store.LocalStore, previewGroup: orders.previewGroup, slotsOf: orders.slotsOf, goalField: orders.goalField, othersAt: orders.othersAt, placeFits: orders.placeFits, runGroup: exec.runGroup, runOrders: standing && exec.runOrders, standing, OrderBook: book?.OrderBook, StandingInput: sti?.StandingInput, GroupInput: group?.GroupInput, army: core.army, RACES: schema.RACES, MISSIONS: mission.MISSIONS, moveTool }
}

function stream(seed) {
  let s = seed >>> 0 || 1
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
  return { next, int: (n) => Math.floor(next() * n), pick: (xs) => xs[Math.floor(next() * xs.length)] }
}

// A Session over a fresh LocalStore, the log's start and its first k entries
// folded through it.
function sessionAt(L, it, k) {
  const setup = jobSetup(it.job), humans = setup.seats.flatMap((x, i) => (x.ctrl === 'human' ? [i] : []))
  const ses = new L.Session({ store: new L.LocalStore(), localSeats: humans, dev: 'here' })
  ses.start(seatDevices(setup, 'here'))
  for (const e of it.job.entries.slice(0, k)) {
    const { s, ...body } = e
    ses.submit(s, body)
  }
  return ses
}

async function probe(L, ses, rand, out) {
  const seat = ses.decisionFor(), G = ses.G, P = G?.pending
  if (seat < 0 || !P) return null
  const phase = P.k === 'deploy' ? 'deploy' : P.k === 'phase' ? P.phase : null
  if (!['deploy', 'move', 'shoot', 'charge'].includes(phase)) return null
  const mine = G.units.filter((u) => u.side === seat && u.alive > 0), foes = G.units.filter((u) => u.side !== seat && u.alive > 0)
  if (mine.length < 2 || !foes.length) return null
  const n = 2 + rand.int(Math.min(5, mine.length - 1))
  const members = [...mine].sort(() => rand.next() - 0.5).slice(0, n)
  const { W, H } = G.nav
  let verb, target
  if (phase === 'deploy') {
    verb = 'place'
    const edge = members[0].pos.x < 0 ? -1 : 1
    target = { x: edge * (W / 2 - 3 - rand.next() * 4), z: (rand.next() - 0.5) * (H - 4) }
  } else if (phase === 'move') {
    if (rand.next() < 0.6) {
      verb = 'move'
      target = { x: (rand.next() - 0.5) * (W - 2), z: (rand.next() - 0.5) * (H - 2) }
    } else {
      verb = 'approach'
      target = rand.pick(foes)
    }
  } else {
    verb = phase === 'shoot' ? 'fire' : 'charge'
    target = rand.pick(foes)
  }
  // (a third of the point orders in a line formation; a third of the moves
  // with +D6)
  const line = !target.pos && rand.next() < 0.33 ? { a: { x: target.x, z: target.z - 3 }, b: { x: target.x, z: target.z + 3 } } : null
  const advance = verb === 'move' && rand.next() < 0.33
  if (line) out.lines++
  if (advance) out.advances++
  const opts = { line, advance }
  const pv = ses.preview((G2, q) => L.previewGroup(G2, q, seat, verb, members.map((u) => G2.units.find((x) => x.id === u.id)), target.pos ? G2.units.find((x) => x.id === target.id) : target, null, opts))
  const rejected = ses.folder.rejected.length, count = ses.count, epoch = G.nav.epoch
  // (the members in combat before it: a group order never moves them)
  const engaged = ses.preview((G2, q) => members.filter((u) => q.isEngaged(G2, G2.units.find((x) => x.id === u.id))).map((u) => u.id))
  const t0 = performance.now()
  let r
  try {
    r = await L.runGroup({ session: ses, seat, verb, members, target, line, advance })
  } catch (err) {
    return `${verb} threw: ${err.message}`
  }
  const ms = performance.now() - t0
  out.kinds[verb] = (out.kinds[verb] ?? 0) + 1
  out.sent += r.sent
  if (ses.folder.rejected.length !== rejected) return `${verb}: the Folder rejected ${ses.folder.rejected.length - rejected} of its entries`
  if (ses.count - count !== r.sent) return `${verb}: it says it sent ${r.sent}, the log grew by ${ses.count - count}`
  if (ms > 1000) return `${verb} took ${ms.toFixed(0)} ms`
  const fell = ses.store.entries().slice(count).find((e) => (e.t === 'move' || e.t === 'advance') && engaged.includes(e.u))
  if (fell) return `${verb}: unit ${fell.u}, in combat, was sent ${fell.t === 'move' ? 'a move (a fall back)' : 'an advance'}`
  if (advance) {
    // +D6: every member that advanced then moved (or could not), none
    // moved twice, and a member that didn't advance moved where it would have
    const sent = ses.store.entries().slice(count)
    const adv = sent.filter((e) => e.t === 'advance').map((e) => e.u), moves = sent.filter((e) => e.t === 'move').map((e) => e.u)
    if (new Set(moves).size !== moves.length) return 'move +D6: a member moved twice'
    if (moves.some((id) => !members.some((u) => u.id === id)) || adv.some((id) => !members.some((u) => u.id === id))) return 'move +D6: a unit outside the group acted'
    out.once += pv.members.length
    return null
  }
  const G2 = ses.G
  if (verb === 'place' || verb === 'move' || verb === 'approach') {
    if (G2.nav.epoch !== epoch || members.some((u) => u.t.wrecker)) return null // (a smash reshaped the board)
    for (const m of pv.members) {
      const u = G2.units.find((x) => x.id === m.u.id)
      if (m.cell >= 0) {
        out.landed++
        const c = G2.nav.index(u.pos.x, u.pos.z)
        if (c !== m.cell) return `${verb}: ${u.t.short} ${u.id} was previewed to cell ${m.cell} and went to ${c}${process.env.MACRO_DEBUG ? ` (members ${JSON.stringify(pv.members.map((x) => [x.u.id, x.cell, x.how, G2.nav.index(G2.units.find((y) => y.id === x.u.id).pos.x, G2.units.find((y) => y.id === x.u.id).pos.z)]))}; sent ${JSON.stringify(ses.store.entries().slice(count).map((e) => [e.t, e.u, e.c]))}; blocked ${JSON.stringify(r.blocked.map((b) => [b.u.id, b.why]))})` : ''}`
      } else if (m.why === 'with the hull') {
        // ((F9a) a rider left out of the order rides along: still aboard,
        // where its hull stands now)
        const h = G2.units.find((x) => x.id === u.aboard)
        if (!h || u.pos.x !== h.pos.x || u.pos.z !== h.pos.z) return `${verb}: ${u.t.short} ${u.id}, previewed riding along with its hull, ${h ? `stands at (${u.pos.x}, ${u.pos.z}), not its hull's (${h.pos.x}, ${h.pos.z})` : 'rides no hull now'}`
        out.stayed++
      } else if (u.pos.x !== m.u.pos.x || u.pos.z !== m.u.pos.z) return `${verb}: ${u.t.short} ${u.id} was previewed staying and moved`
      else out.stayed++
    }
  }
  if (verb === 'fire') {
    const may = pv.members.filter((m) => m.how === 'fire').length
    if (r.sent > may) return `fire: ${r.sent} shots sent, the preview had ${may} able`
    const stray = ses.store.entries().slice(count).find((e) => e.t === 'shoot' && !pv.members.some((m) => m.u.id === e.u && m.how === 'fire'))
    if (stray) return `fire: unit ${stray.u} fired, the preview didn't name it`
    // (a member the volley left unable, slain by a friend's scattered blast
    // or its sight blocked by new rubble, rightly holds its fire)
    const tg = G2.units.find((x) => x.id === target.id)
    const fired = new Set(ses.store.entries().slice(count).filter((e) => e.t === 'shoot').map((e) => e.u))
    const idle = tg.alive > 0 ? pv.members.filter((m) => m.how === 'fire' && !fired.has(m.u.id) && ses.preview((G3, q) => {
      const u = G3.units.find((x) => x.id === m.u.id)
      return u.alive > 0 && q.canShoot(G3, u) && q.shootTargets(G3, u).includes(G3.units.find((x) => x.id === target.id))
    })) : []
    if (idle.length) return `fire: the target stands, but ${idle.map((m) => `${m.u.t.short} ${m.u.id}`).join(', ')}, able to fire, didn't`
  }
  if (verb === 'charge') {
    const may = pv.members.filter((m) => m.how === 'charge').length
    const charges = ses.store.entries().slice(count).filter((e) => e.t === 'charge').length
    if (charges > may) return `charge: ${charges} charges sent, the preview had ${may} able`
    if (G2.pending?.k === 'chargeEnd') return 'charge: a charge left its end undecided'
  }
  return null
}

// (F10c) Standing orders on the same states: a random few of the seat's
// standing units each given a random order (March a group to a point, its
// slots the formation's; Attack an enemy; Hold; Autopilot), then carried out
// as End, Go or Auto would (runOrders). Each run must send only commands the
// match takes and never throw, within its budget; under Go no unit without
// an order may act, and none acts for a unit without one.
async function probeOrders(L, ses, rand, out) {
  const seat = ses.decisionFor(), G = ses.G, P = G?.pending
  if (seat < 0 || P?.k !== 'phase') return null
  const mine = G.units.filter((u) => u.side === seat && u.alive > 0), foes = G.units.filter((u) => u.side !== seat && u.alive > 0)
  if (!mine.length || !foes.length) return null
  const orders = new Map()
  const picked = mine.filter(() => rand.next() < 0.6)
  const marchers = picked.filter(() => rand.next() < 0.35)
  if (marchers.length) {
    const { W, H } = G.nav
    const anchor = { x: (rand.next() - 0.5) * (W - 4), z: (rand.next() - 0.5) * (H - 4) }
    const slots = ses.preview((G2) => L.slotsOf(G2, marchers.map((u) => G2.units.find((x) => x.id === u.id)), anchor))
    const a = G.nav.index(anchor.x, anchor.z)
    for (const u of marchers) orders.set(u.id, { k: 'march', anchor: a, slot: G.nav.index(slots.get(u.id).x, slots.get(u.id).z) })
  }
  for (const u of picked) {
    if (orders.has(u.id)) continue
    const k = rand.pick(['attack', 'hold', 'auto'])
    orders.set(u.id, k === 'attack' ? { k, tg: rand.pick(foes).id } : { k })
  }
  if (!orders.size) return null
  const then = rand.pick([null, 'end', 'auto'])
  // ((F9a) a rider by its hull, not its place: carried by an ordered hull it
  // acted for nothing of its own; stepped off, it would read otherwise)
  const look = (G2) => G2.units.filter((u) => u.side === seat && !orders.has(u.id)).map((u) => `${u.id}@${u.aboard ? `a${u.aboard}` : `${u.pos.x},${u.pos.z}`}:${u.flags.moved ? 1 : 0}${u.flags.shot ? 1 : 0}${u.flags.charged ? 1 : 0}`).join(' ')
  const before = look(G)
  // (Auto with orders: the AI plays the units no order holds, so the run
  // writes no plain auto, and in the movement phase no pilot of its names a
  // March or a Hold: a Hold stays put, a March in combat never falls back)
  const n0 = ses.store.entries().length
  const mineInOrder = G.units.filter((u) => u.side === seat).map((u) => u.id)
  const posted = new Set(P.phase === 'move' ? [...orders].filter(([, o]) => o.k === 'hold' || o.k === 'march').map(([id]) => id) : [])
  const actors = ses.preview((G2, q) => L.standing.actorsOf(G2, q, seat, orders, P.phase))
  // (F18's corpus) and who of the seat could act at all as the count was
  // taken (below)
  const could = ses.preview((G2, q) => G2.units.filter((u) => u.side === seat && q.alive(u) && q.canAct(G2, u)).map((u) => u.id))
  const rejected = ses.folder.rejected.length, count = ses.count
  const t0 = performance.now()
  let r
  try {
    r = await L.runOrders({ session: ses, seat, orders, then })
  } catch (err) {
    return `orders (${then ?? 'go'}) threw: ${err.message}`
  }
  const ms = performance.now() - t0
  out.orders.runs++
  out.orders.sent += r.sent
  out.orders.acted += r.acted.length
  out.orders.actors += actors.length
  out.orders[P.phase] = (out.orders[P.phase] ?? 0) + 1
  for (const o of orders.values()) out.orders.kinds[o.k] = (out.orders.kinds[o.k] ?? 0) + 1
  if (ses.folder.rejected.length !== rejected) return `orders: the Folder rejected ${ses.folder.rejected.length - rejected} of their entries`
  if (ses.count - count !== r.sent) return `orders: they say they sent ${r.sent}, the log grew by ${ses.count - count}`
  if (ms > 1000) return `orders took ${ms.toFixed(0)} ms`
  if (then === null && look(ses.G) !== before) return 'orders (Go) moved, shot or charged with a unit that had none'
  if (then === 'auto') {
    const wrote = ses.store.entries().slice(n0).filter((e) => e?.s === seat)
    if (wrote.some((e) => e.t === 'auto')) return 'orders (Auto) wrote a plain auto: the AI played every unit, the ordered ones too'
    const named = (m) => mineInOrder.filter((id, j) => Math.floor(m / 2 ** j) % 2 === 1)
    const strays = wrote.filter((e) => e.t === 'pilot').flatMap((e) => named(e.m)).filter((id) => posted.has(id))
    if (strays.length) return `orders (Auto) piloted units a March or Hold holds in the movement phase (${strays.join(', ')})`
    out.orders.held = (out.orders.held ?? 0) + posted.size
  }
  if (r.acted.some((id) => !orders.has(id))) return 'orders acted for a unit with none'
  // (F18's corpus) An order's action can change what another unit may do:
  // a template that wrecks the scenery between a gun and its target, a shot
  // that fells the foe a unit was locked with (since F18 a fight may be
  // shot into). So a unit the count left out because it could do nothing
  // then may act once the table has changed under it (the count is a
  // preview of the table as it stood); one the count left out that could
  // act, never. (hotseat-pilot-mix-1 as F18 played it again: a Trebuchet's
  // Attack wrecks nine pieces of scenery and opens the sight a held Nutkin
  // lacked.)
  const late = r.acted.filter((id) => !actors.some((a) => a.u.id === id))
  if (late.some((id) => could.includes(id))) return `orders acted for units the count left out, though they could act as it was taken (${late.filter((id) => could.includes(id)).join(', ')})`
  out.orders.freed = (out.orders.freed ?? 0) + late.length
  return null
}

// (F10c, play-report's F10c row) A march to a reachable slot: a unit of the
// seat on the move, a slot between one and three moves away by its goal
// field, the march its only order; the seat ends each of its phases through
// its orders, the other seat plays Auto. Arrived within three of the seat's
// turns? (a march that dies on the way counts for nothing)
async function marchScenario(L, it, rand, out) {
  let ses
  for (let tries = 0; tries < 8 && !ses; tries++) {
    const k = rand.int(it.job.entries.length)
    try {
      const s = sessionAt(L, it, k)
      if (s.G?.pending?.k === 'phase' && s.G.pending.phase === 'move' && s.decisionFor() >= 0) ses = s
    } catch {}
  }
  if (!ses) return null
  const seat = ses.decisionFor(), G = ses.G
  const free = G.units.filter((u) => u.side === seat && u.alive > 0 && !u.flags.moved && !u.flags.advanced && !ses.preview((G2, q) => q.isEngaged(G2, u)))
  if (!free.length) return null
  const u0 = rand.pick(free)
  const field = ses.preview((G2, q) => L.goalField(G2, q, u0.pos, q.moveMode(u0), u0.r, q.climbs?.(u0)))
  const cand = []
  for (let i = 0; i < field.length; i++) if (field[i] > u0.t.M + 1 && field[i] <= 3 * u0.t.M) cand.push(i)
  if (!cand.length) return null
  const slot = rand.pick(cand)
  let order = { k: 'march', anchor: slot, slot }
  let turns = 0, arrived = false, blocked = false, engaged = false
  for (let k = 0; k < 400 && ses.G.turn.stage !== 'over' && turns < 3 && !arrived && !blocked; k++) {
    const P = ses.G.pending, who = ses.decisionFor()
    if (!P || who < 0) break
    if (!(ses.G.units.find((x) => x.id === u0.id)?.alive > 0)) return null
    if (P.k === 'deploy') ses.submit(who, { t: 'deployed' })
    else if (P.k === 'roundLimit') ses.submit(who, { t: 'vote', more: false })
    else if (P.k === 'chargeEnd') ses.submit(who, { t: 'chargeEnd', c: -1 })
    else if (who !== seat) ses.submit(who, { t: 'auto' })
    else {
      const wasMove = P.phase === 'move'
      await L.runOrders({ session: ses, seat, orders: new Map([[u0.id, order]]), then: 'end' })
      const u = ses.G.units.find((x) => x.id === u0.id)
      if (!(u?.alive > 0)) return null
      engaged ||= ses.preview((G2, q) => q.isEngaged(G2, u))
      const done = ses.preview((G2, q) => L.standing.doneOf(G2, q, u, order))
      if (done) arrived = done.note === 'Arrived'
      else if (wasMove) {
        turns++
        const p = ses.preview((G2, q) => L.standing.progressOf(G2, q, u, order))
        if (p.blocked) blocked = true
        else order = p.order
      }
    }
  }
  // (counted only once it had its three turns, or arrived or was blocked
  // sooner; a march the enemy caught in combat on the way, or one the
  // battle's end cut short, is no measure of marching)
  if (!(ses.G.units.find((x) => x.id === u0.id)?.alive > 0)) return null
  if (engaged || (!arrived && !blocked && turns < 3)) {
    out.march.cut++
    return null
  }
  out.march.n++
  if (arrived) out.march.arrived++
  if (blocked) out.march.blocked++
  if (!arrived && process.env.MARCH_DEBUG) {
    const u = ses.G.units.find((x) => x.id === u0.id)
    console.error(`miss ${it.id} ${u.t.short} M${u.t.M}: slot ${Math.hypot(u.pos.x - ses.G.nav.x(slot), u.pos.z - ses.G.nav.z(slot)).toFixed(1)}" away after ${turns} turns${blocked ? ' (blocked)' : ''}, engaged ${ses.preview((G2, q) => q.isEngaged(G2, u))}, start ${field[G.nav.index(u0.pos.x, u0.pos.z)]?.toFixed?.(1)} slot field ${field[slot].toFixed(1)}`)
  }
  return null
}

// (F10c) Autopilot first and Auto-End answer only from the Session's
// settled: a hotseat battle on the log's seeds, seat 0's units all on
// autopilot with both settings on (the countdown 0 ms), seat 1 ending each
// of its phases. Every pilot the orders send must be sent from inside the
// sink's settled (never its events), at most one a phase; and Auto-End must
// end seat 0's phases (the table caught up: idled), never twice the same.
async function settledScenario(L, it, out) {
  const setup = jobSetup(it.job)
  const hot = { ...setup, overtime: 'never', seats: setup.seats.map((x) => ({ ...x, ctrl: 'human', dev: 'here' })) }
  let ctx = null, standing = null
  const ses = new L.Session({ store: new L.LocalStore(), localSeats: [0, 1], dev: 'here', sink: {
    events: () => {},
    settled: (s2) => {
      ctx = 'settled'
      try {
        standing?.settled(s2)
      } finally {
        ctx = null
      }
    },
  } })
  const sent = []
  const submit = ses.submit.bind(ses)
  ses.submit = (seat, body) => {
    sent.push({ seat, t: body.t, ctx, at: `${ses.G?.turn.round}:${ses.G?.pending?.phase}` })
    return submit(seat, body)
  }
  const human = {
    get session() {
      return ses
    },
    get G() {
      return ses.G
    },
    sel: null,
    ask: (fn) => ses.preview(fn),
    localSeat: () => ses.decisionFor(),
    localDecision: () => (ses.decisionFor() >= 0 ? ses.G.pending : null),
    myTurn: () => ses.decisionFor() >= 0 && ses.G.pending?.k === 'phase',
    flow: { refreshUI() {}, player: { idle: true } },
    group: { seat: () => ses.decisionFor(), members: () => [] },
    end() {
      ctx = 'auto-end'
      try {
        submit(ses.decisionFor(), { t: 'end' })
        sent.push({ seat: 0, t: 'end', ctx: 'auto-end' })
      } finally {
        ctx = null
      }
    },
  }
  const mem = new Map()
  const book = new L.OrderBook({ getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) })
  standing = new L.StandingInput({ human, book, countdown: 0 })
  standing.autoFirst = standing.autoEnd = true
  ses.start(hot)
  book.open('settled-check', { fresh: true })
  book.set(0, ses.G.units.filter((u) => u.side === 0).map((u) => u.id), { k: 'auto' })
  for (let k = 0; k < 3000 && ses.G.turn.stage !== 'over'; k++) {
    const P = ses.G.pending, who = ses.decisionFor()
    if (!P || who < 0) break
    if (P.k === 'deploy') submit(who, { t: 'deployed' })
    else if (P.k === 'roundLimit') submit(who, { t: 'vote', more: false })
    else if (P.k === 'chargeEnd') submit(who, { t: 'chargeEnd', c: -1 })
    else if (who === 1) submit(who, { t: 'end' })
    else {
      // (the table caught up: Auto-End's countdown, then its End)
      standing.idled()
      await new Promise((r) => setTimeout(r, 1))
      if (ses.decisionFor() === 0 && ses.G.pending === P) {
        out.settled.manual++
        submit(0, { t: 'end' })
      }
    }
  }
  const pilots = sent.filter((x) => x.t === 'pilot')
  out.settled.battles++
  out.settled.pilots += pilots.length
  out.settled.ends += sent.filter((x) => x.ctx === 'auto-end').length
  const stray = pilots.find((x) => x.ctx !== 'settled')
  if (stray) return `${it.id}: an autopilot pilot sent from ${stray.ctx ?? 'outside the sink'}`
  const per = new Map()
  for (const x of pilots) per.set(x.at, (per.get(x.at) ?? 0) + 1)
  const twice = [...per].find(([, n]) => n > 1)
  if (twice) return `${it.id}: ${twice[1]} autopilot pilots in one phase (${twice[0]})`
  return null
}

// (F9a) The riders' rows, on four Field boards (`ridesOut`: what they held,
// or why one failed). Returns null when every row holds, else why.
const RIDE_LIST = '1032012' // an Elder, three Nutkin, two Grenadiers, a Trebuchet, two War-Carts
async function ridersScenario(L, board, out) {
  const setup = { board, dice: 7, mission: 'field', terrain: 'open', seats: [0, 1].map(() => ({ race: 'squirrel', ctrl: 'human', army: RIDE_LIST })) }
  const ses = new L.Session({ store: new L.LocalStore(), localSeats: [0, 1], dev: 'here' })
  ses.start(seatDevices(setup, 'here'))
  ses.submit(0, { t: 'deployed' })
  ses.submit(1, { t: 'deployed' })
  const seat = ses.decisionFor(), G = ses.G
  if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') return `board ${board}: the battle begins at ${JSON.stringify(G.pending)}, not a movement phase`
  const hull = G.units.find((u) => u.side === seat && u.t.transport && G.units.some((p) => p.aboard === u.id))
  if (!hull) return `board ${board}: seat ${seat} has no hull carrying riders`
  const riders = G.units.filter((p) => p.aboard === hull.id)
  // the standing orders first, as the match stands: a rider's step "with
  // the hull", under every kind of order, and no rider among End's actors
  if (L.standing) {
    const orders = new Map()
    for (const p of riders) {
      for (const o of [{ k: 'march', anchor: G.nav.index(0, 0), slot: G.nav.index(0, 0) }, { k: 'attack', tg: G.units.find((e) => e.side !== seat).id }, { k: 'hold' }, { k: 'auto' }]) {
        const step = ses.preview((G2, q) => L.standing.stepOf(G2, q, G2.units.find((x) => x.id === p.id), o, 'move'))
        if (step.how !== 'none' || !/with the hull/i.test(step.why ?? '')) return `board ${board}: a rider's (${p.t.short} ${p.id}) ${o.k} order in the movement phase steps ${JSON.stringify(step)}, not nothing "with the hull"`
        out.orders++
      }
      orders.set(p.id, { k: 'auto' })
    }
    const actors = ses.preview((G2, q) => L.standing.actorsOf(G2, q, seat, orders, 'move'))
    if (actors.length) return `board ${board}: End would act for ${actors.map((x) => x.u.id).join(', ')}, riders under Autopilot (they move only with their hull)`
  }
  // the group Move: the hull, its riders and the friend nearest it, toward
  // the enemy 5", through the group bar's own preview and send
  // (input/group.js GroupInput's, over this Session: its page parts, the
  // selection, the pin and the bar, stood in for)
  const friend = G.units.filter((u) => u.side === seat && u.alive > 0 && !u.aboard && u !== hull).sort((a, b) => Math.hypot(a.pos.x - hull.pos.x, a.pos.z - hull.pos.z) - Math.hypot(b.pos.x - hull.pos.x, b.pos.z - hull.pos.z))[0]
  const ids = [hull, ...riders, friend].map((u) => u.id)
  const target = { x: hull.pos.x - G.seats[seat].edge * 5, z: hull.pos.z }
  if (!L.GroupInput) return 'the code has transports but no input/group.js GroupInput'
  const rec = { advance: false, note: '', pin: null }
  const group = Object.create(L.GroupInput.prototype)
  Object.assign(group, {
    human: { get G() { return ses.G }, session: ses, ask: (fn) => ses.preview(fn), deploySeat: () => -1, myTurn: () => true, localSeat: () => seat, flow: { refreshUI() {} } },
    selection: { of: () => rec, members: (G2) => ids.map((id) => G2.units.find((x) => x.id === id)).filter((u) => u && u.alive > 0), units: (G2, xs) => xs.map((id) => G2.units.find((x) => x.id === id)) },
    busy: false,
    cancel() {},
  })
  const pv = group.preview('move', target)
  if (!/riders ride along/i.test(pv.summary ?? '')) return `board ${board}: a group Move holding a hull and its riders previews "${pv.summary}", which doesn't say the riders ride along`
  for (const p of riders) {
    const m = pv.members.find((x) => x.u.id === p.id)
    if (m && m.cell >= 0) return `board ${board}: the preview sends rider ${p.t.short} ${p.id} to cell ${m.cell} of its own, not riding along with its hull`
  }
  // ((F9b's sweep) and the planner's own rule beneath GroupInput's movers,
  // which take the riders out first: present/orders.js's previewGroup
  // asked with the riders among the members keeps each with its hull.
  // Until then only a random probe over the corpus met that rule, and
  // with hull/'s Field battles recorded again (f686198) the probes no
  // longer did: planner-sends-riders went uncaught)
  const pr = ses.preview((G2, q) => L.previewGroup(G2, q, seat, 'move', ids.map((id) => G2.units.find((x) => x.id === id)), target, null, {}))
  for (const p of riders) {
    const m = pr.members.find((x) => x.u.id === p.id)
    if (!m || m.cell >= 0 || m.why !== 'with the hull') return `board ${board}: the planner, asked with rider ${p.t.short} ${p.id} among the members, plans it ${JSON.stringify(m && { cell: m.cell, why: m.why })}, not riding along with its hull`
  }
  const mh = pv.members.find((x) => x.u.id === hull.id)
  if (!mh || mh.cell < 0) return `board ${board}: the preview leaves the hull where it stands (${JSON.stringify(mh && { cell: mh.cell, why: mh.why })})`
  const count = ses.count, rejected = ses.folder.rejected.length
  await group.run('move', target)
  if (ses.folder.rejected.length !== rejected) return `board ${board}: the group Move's entries were rejected (${ses.folder.rejected.length - rejected})`
  const sent = ses.store.entries().slice(count)
  if (!sent.some((e) => e.t === 'move' && e.u === hull.id)) return `board ${board}: the group Move sent the hull nothing (${rec.note || JSON.stringify(sent.map((e) => [e.t, e.u]))})`
  const stray = sent.find((e) => riders.some((p) => p.id === e.u))
  if (stray) return `board ${board}: the group Move sent rider ${stray.u} a ${stray.t} (a rider moves only with its hull)`
  const G2 = ses.G, h2 = G2.units.find((u) => u.id === hull.id)
  if (G2.nav.index(h2.pos.x, h2.pos.z) !== mh.cell) return `board ${board}: the hull was previewed to cell ${mh.cell} and went to ${G2.nav.index(h2.pos.x, h2.pos.z)}`
  for (const p of riders) {
    const p2 = G2.units.find((u) => u.id === p.id)
    if (p2.aboard !== hull.id || p2.pos.x !== h2.pos.x || p2.pos.z !== h2.pos.z) return `board ${board}: rider ${p.t.short} ${p.id} is aboard ${p2.aboard} at (${p2.pos.x}, ${p2.pos.z}) after the group Move, not riding along with its hull at (${h2.pos.x}, ${h2.pos.z})`
  }
  out.groups++
  out.carried += riders.length
  return null
}

// ── (F9b) Long hulls ────────────────────────────────────────────────────────
// A Field battle on `board`, both seats human: the Coil (seat 0) with a
// list holding two Howdahs (autoList on the check's own seeds), the
// Bushtails the riders' list; both deployed, the battle played on by Auto
// until the Coil's first movement phase. null when the Coil fields no
// Howdah (code before F9b).
function hullSession(L, board) {
  const race = L.RACES.serpent, k = race.roster.findIndex((key) => race.units[key].fp)
  if (k < 0) return null
  let army = null
  for (let s = 1; s < 400 && !army; s++) {
    const counts = L.army.autoList(race, L.MISSIONS.field.list, s + board)
    if ((counts[k] ?? 0) >= 2) army = L.army.listText(counts)
  }
  if (!army) throw new Error(`board ${board}: no Field list of the Coil's holds two Howdahs`)
  const setup = { board, dice: 7, mission: 'field', terrain: 'open', seats: [{ race: 'serpent', ctrl: 'human', army }, { race: 'squirrel', ctrl: 'human', army: RIDE_LIST }] }
  const ses = new L.Session({ store: new L.LocalStore(), localSeats: [0, 1], dev: 'here' })
  ses.start(seatDevices(setup, 'here'))
  ses.submit(0, { t: 'deployed' })
  ses.submit(1, { t: 'deployed' })
  for (let n = 0; n < 60; n++) {
    const P = ses.G.pending, who = ses.decisionFor()
    if (!P || who < 0) return null
    if (who === 0 && P.k === 'phase' && P.phase === 'move') return ses
    ses.submit(who, P.k === 'chargeEnd' ? { t: 'chargeEnd', c: -1 } : P.k === 'roundLimit' ? { t: 'vote', more: false } : who === 0 ? { t: 'end' } : { t: 'auto' })
  }
  return null
}
// The group Move with both Howdahs and the friend nearest the first, 6"
// toward the enemy: every member on its previewed cell, each long hull on
// its previewed heading (when no smash changed the board)
async function hullScenario(L, board, out) {
  const ses = hullSession(L, board)
  if (!ses) return null
  const G = ses.G, seat = 0
  const hulls = G.units.filter((u) => u.side === seat && u.alive > 0 && u.t.fp && !u.flags.moved)
  if (!hulls.length) return `board ${board}: the Coil has no Howdah to move`
  const friend = G.units.filter((u) => u.side === seat && u.alive > 0 && !u.aboard && !u.t.fp).sort((a, b) => Math.hypot(a.pos.x - hulls[0].pos.x, a.pos.z - hulls[0].pos.z) - Math.hypot(b.pos.x - hulls[0].pos.x, b.pos.z - hulls[0].pos.z))[0]
  const members = [...hulls, friend].filter(Boolean)
  const target = { x: hulls[0].pos.x - G.seats[seat].edge * 6, z: hulls[0].pos.z }
  const pv = ses.preview((G2, q) => L.previewGroup(G2, q, seat, 'move', members.map((u) => G2.units.find((x) => x.id === u.id)), target, null, {}))
  for (const m of pv.members) if (m.u.t.fp && m.cell >= 0 && !(Number.isInteger(m.f) && m.f >= 0 && m.f < 8)) return `board ${board}: the preview plans long hull ${m.u.id} onto cell ${m.cell} with no heading (${JSON.stringify(m.f)})`
  const rejected = ses.folder.rejected.length, epoch = G.nav.epoch
  // ((F9b's sweep) and each long hull's heading held to the rule's, not
  // only to its preview's: since F9b's view the executor sends the
  // planner's f, so a planner wrong about the default heading lands the
  // hull facing just what its preview drew, the two agreeing (the
  // heading-lowest fault went uncaught). The default (DESIGN §4.2.5): the
  // valid end heading at its cell its plan reaches shortest, ties to the
  // lowest, on the board as its move finds it, the members before it where
  // they went)
  const submit = ses.submit.bind(ses), wrong = []
  ses.submit = (s, body) => {
    const u = body?.t === 'move' ? ses.G.units.find((x) => x.id === body.u) : null
    if (u?.t.fp) {
      const want = ses.preview((G2, q) => {
        const v = G2.units.find((x) => x.id === u.id), plan = q.movePlan(G2, v, v.flags.advanced ? v.flags.advRoll : 0)
        let f = -1
        for (let h = 0; h < 8; h++) if (q.validEnd(G2, plan, body.c, null, h) && (f < 0 || plan.res.dist[body.c * 8 + h] < plan.res.dist[body.c * 8 + f])) f = h
        return f
      })
      if (body.f !== undefined && body.f !== want) wrong.push(`long hull ${u.id} sent onto cell ${body.c} facing ${body.f}, its move's default heading there ${want}`)
    }
    return submit(s, body)
  }
  try {
    await L.runGroup({ session: ses, seat, verb: 'move', members, target, line: null, advance: false })
  } finally {
    ses.submit = submit
  }
  if (wrong.length) return `board ${board}: the group Move's headings aren't the move's default: ${wrong.join('; ')}`
  if (ses.folder.rejected.length !== rejected) return `board ${board}: the group Move's entries were rejected (${ses.folder.rejected.length - rejected})`
  const G2 = ses.G
  if (G2.nav.epoch !== epoch) {
    out.smashed++
    return null
  }
  for (const m of pv.members) {
    if (m.cell < 0) continue
    const u = G2.units.find((x) => x.id === m.u.id), c = G2.nav.index(u.pos.x, u.pos.z)
    if (c !== m.cell) return `board ${board}: ${u.t.short} ${u.id} was previewed to cell ${m.cell} and went to ${c}`
    if (u.t.fp) {
      if (u.facing !== m.f) return `board ${board}: long hull ${u.id} was previewed onto cell ${m.cell} facing ${m.f} and faces ${u.facing}`
      out.headings++
    }
  }
  out.groups++
  return null
}
// (F9b's review) GroupInput over a Session (its page parts, the selection,
// the pin and the bar stood in for, as ridersScenario's): `ids` picked by
// `seat`, `rec` the seat's record
function stubGroup(L, ses, seat, ids, rec) {
  const group = Object.create(L.GroupInput.prototype)
  const deploying = () => ses.G.pending?.k === 'deploy'
  Object.assign(group, {
    human: { get G() { return ses.G }, session: ses, ask: (fn) => ses.preview(fn), deploySeat: () => (deploying() && ses.decisionFor() === seat ? seat : -1), myTurn: () => !deploying() && ses.decisionFor() === seat, localSeat: () => seat, flow: { refreshUI() {} }, mouse: null },
    view: { overlay: { formation() {} } },
    selection: { of: () => rec, members: (G2) => ids.map((id) => G2.units.find((x) => x.id === id)).filter((u) => u && u.alive > 0), units: (G2, xs) => xs.map((id) => G2.units.find((x) => x.id === id)) },
    busy: false,
  })
  return group
}
// A hull session at seat 0's deployment (hullSession's lists)
function hullDeploySession(L, board) {
  const race = L.RACES.serpent, k = race.roster.findIndex((key) => race.units[key].fp)
  let army = null
  for (let s = 1; s < 400 && !army; s++) {
    const counts = L.army.autoList(race, L.MISSIONS.field.list, s + board)
    if ((counts[k] ?? 0) >= 2) army = L.army.listText(counts)
  }
  if (!army) throw new Error(`board ${board}: no Field list of the Coil's holds two Howdahs`)
  const setup = { board, dice: 7, mission: 'field', terrain: 'open', seats: [{ race: 'serpent', ctrl: 'human', army }, { race: 'squirrel', ctrl: 'human', army: RIDE_LIST }] }
  const ses = new L.Session({ store: new L.LocalStore(), localSeats: [0, 1], dev: 'here' })
  ses.start(seatDevices(setup, 'here'))
  for (let n = 0; n < 4; n++) {
    if (ses.G.pending?.k !== 'deploy') return null
    if (ses.decisionFor() === 0) return ses
    ses.submit(ses.decisionFor(), { t: 'deployed' })
  }
  return null
}
// (F9b's review) Both Howdahs pinned round points near the first (`verb`
// 'place' in the deployment, 'move' in the movement phase), until one
// member's ghost may turn (validHeads) to a heading beside which a member
// planned after it no longer fits where its ghost stands (the match's own
// test of it there: placeOk, validEnd, the members before it where they
// show): turned there by face(), every ghost must then show a state the
// match takes and the turned one its heading, and the group sent lands
// each hull on its ghost's cell and heading. One turn a board; a board with
// none is no verdict.
async function hullTurnScenario(L, board, verb, out) {
  const ses = verb === 'place' ? hullDeploySession(L, board) : hullSession(L, board)
  if (!ses) return null
  const seat = 0, hulls = ses.G.units.filter((u) => u.side === seat && u.alive > 0 && u.t.fp && !u.flags.moved)
  if (hulls.length < 2) return null
  const rec = { advance: false, note: '', pin: null, lead: hulls[0].id }
  const group = stubGroup(L, ses, seat, hulls.map((u) => u.id), rec)
  const c0 = { x: hulls[0].pos.x, z: hulls[0].pos.z }, edge = ses.G.seats[seat].edge
  // does member b's ghost still fit with the members before it as `at` has them?
  const fits = (b, at) => ses.preview((G2, q) => {
    const u = G2.units.find((x) => x.id === b.u.id)
    if (verb === 'place') return L.placeFits(G2, q, u, b.cell, b.f, L.othersAt(G2, q, u, at))
    return q.validEnd(G2, q.movePlan(G2, u, u.flags.advanced ? u.flags.advRoll : 0), b.cell, at, b.f)
  })
  const atOf = (m, f = m.f) => ({ x: ses.G.nav.x(m.cell), z: ses.G.nav.z(m.cell), ...(f !== undefined ? { f } : {}) })
  for (let dx = -6; dx <= 6; dx += 2) for (let dz = -8; dz <= 8; dz += 2) {
    const target = { x: c0.x + dx - (verb === 'move' ? edge * 2 : 0), z: c0.z + dz }
    group.pinAt(verb, target)
    const pin = rec.pin, ms = pin?.preview.members ?? []
    if (ms.filter((m) => m.u.t.fp && m.cell >= 0 && m.f !== undefined).length < 2) continue
    for (let i = 0; i < ms.length; i++) {
      const a = ms[i]
      if (!a.u.t.fp || a.cell < 0 || a.f === undefined) continue
      const bits = group.validHeads(pin, a)
      for (let h = 0; h < 8; h++) {
        if (!(bits & (1 << h)) || h === a.f) continue
        // a member after it whose ghost no longer fits beside it turned
        const hit = ms.slice(i + 1).find((b, j) => {
          if (b.cell < 0) return false
          const at = new Map()
          for (const o of ms.slice(0, i + 1 + j)) if (o.cell >= 0) at.set(o.u.id, o === a ? atOf(a, h) : atOf(o))
          return !fits(b, at)
        })
        if (!hit) continue
        group.face(pin, a, h)
        const shown = rec.pin.preview.members
        const a2 = shown.find((m) => m.u.id === a.u.id)
        if (a2.cell !== a.cell || a2.f !== h) return `board ${board}, ${verb}: Howdah ${a.u.id} turned to ${h} on cell ${a.cell} shows ${a2.f} on cell ${a2.cell}`
        for (let k = 0; k < shown.length; k++) {
          const b = shown[k]
          if (b.cell < 0) continue
          const at = new Map()
          for (const o of shown.slice(0, k)) if (o.cell >= 0) at.set(o.u.id, atOf(o))
          if (!fits(b, at)) return `board ${board}, ${verb}: Howdah ${a.u.id} turned to ${h}, ${b.u.t.short} ${b.u.id}'s ghost (cell ${b.cell}, heading ${b.f}) is one the match refuses beside the members before it (a stale ghost)`
        }
        const want = shown.filter((m) => m.cell >= 0).map((m) => ({ id: m.u.id, cell: m.cell, f: m.f }))
        const n0 = ses.count, rejected = ses.folder.rejected.length, epoch = ses.G.nav.epoch
        const why = group.commit()
        if (why) return `board ${board}, ${verb}: the turned pin sent nothing (${why})`
        await group.running
        if (ses.folder.rejected.length !== rejected) return `board ${board}, ${verb}: the turned pin's entries were rejected (${ses.folder.rejected.length - rejected})`
        if (ses.count === n0) return `board ${board}, ${verb}: the turned pin sent nothing`
        if (ses.G.nav.epoch !== epoch) {
          out.smashed++
          return null
        }
        for (const w of want) {
          const u = ses.G.units.find((x) => x.id === w.id), c = ses.G.nav.index(u.pos.x, u.pos.z)
          if (c !== w.cell || (w.f !== undefined && u.facing !== w.f)) return `board ${board}, ${verb}: Howdah ${a.u.id} turned to ${h}, ${u.t.short} ${u.id} stands on cell ${c} facing ${u.facing}, its ghost on cell ${w.cell} facing ${w.f}`
        }
        out.turned[verb]++
        return null
      }
    }
  }
  return null
}
// (F9b's review) A lone Howdah engaged at the Coil's movement phase (both
// seats' AI playing the battle on until one is; the boards are ones where
// that comes, by round 6): no group of one, its ground click left to the
// one-unit tools, whose fall back from a click inside its red area the
// match takes
async function hullEngagedScenario(L, board, out) {
  const ses = hullSession(L, board)
  if (!ses) return null
  const seat = 0
  let u = null
  for (let n = 0; n < 400 && ses.G.turn.stage !== 'over'; n++) {
    const P = ses.G.pending, who = ses.decisionFor()
    if (!P || who < 0) return null
    if (who === seat && P.k === 'phase' && P.phase === 'move') {
      u = ses.preview((G2, q) => G2.units.find((x) => x.side === seat && x.alive > 0 && x.t.fp && !x.flags.moved && q.canAct(G2, x) && q.isEngaged(G2, x)) ?? null)
      if (u) break
    }
    ses.submit(who, P.k === 'chargeEnd' ? { t: 'chargeEnd', c: -1 } : P.k === 'roundLimit' ? { t: 'vote', more: false } : { t: 'auto' })
  }
  if (!u) return null
  const rec = { advance: false, note: '', pin: null, lead: u.id }
  const group = stubGroup(L, ses, seat, [u.id], rec)
  if (group.loneHull()) return `board ${board}: Howdah ${u.id}, engaged at its movement phase, is a group of one (loneHull): its ground click pins a ghost the planner leaves in combat, and nothing falls back`
  const plan = L.moveTool.planOf((fn) => ses.preview(fn), u)
  if (!plan.fallback) return `board ${board}: Howdah ${u.id} is engaged but its move's plan is no fall back`
  const end = ses.preview((G2, q) => {
    for (let i = 0; i < G2.nav.N; i++) if (q.validEnd(G2, plan, i)) return i
    return -1
  })
  if (end < 0) return null
  const ground = { x: ses.G.nav.x(end), y: 0, z: ses.G.nav.z(end) }
  if (group.click({ unit: null, ground }, null)) return `board ${board}: a ground click with engaged Howdah ${u.id} alone was taken by the group's tools`
  const c = L.moveTool.cellAt((fn) => ses.preview(fn), plan, ground)
  if (c < 0) return `board ${board}: no fall-back cell for engaged Howdah ${u.id} at a click on its valid end ${end}`
  const body = L.moveTool.moveTo(u, c), why = ses.legal(seat, body)
  if (why) return `board ${board}: engaged Howdah ${u.id}'s fall back to cell ${c} refused: ${why}`
  ses.submit(seat, body)
  const v = ses.G.units.find((x) => x.id === u.id)
  if (ses.G.nav.index(v.pos.x, v.pos.z) !== c || !v.flags.moved) return `board ${board}: engaged Howdah ${u.id}'s fall back to cell ${c} left it on cell ${ses.G.nav.index(v.pos.x, v.pos.z)}`
  out.engaged++
  return null
}
// A March with a long hull: a Howdah of the Coil's, a slot between one and
// three moves away by its body disc's field, the march its only order, as
// marchScenario's; counted into the same marches
async function hullMarch(L, board, out) {
  const ses = hullSession(L, board)
  if (!ses) return null
  const seat = 0, G = ses.G
  const u0 = G.units.find((u) => u.side === seat && u.alive > 0 && u.t.fp && !u.flags.moved)
  if (!u0) return null
  const field = ses.preview((G2, q) => L.goalField(G2, q, u0.pos, q.moveMode(u0), u0.t.base, q.climbs?.(u0)))
  const cand = []
  for (let i = 0; i < field.length; i++) if (field[i] > u0.t.M + 1 && field[i] <= 3 * u0.t.M) cand.push(i)
  if (!cand.length) return null
  const slot = cand[(board * 7919) % cand.length]
  let order = { k: 'march', anchor: slot, slot }
  let turns = 0, arrived = false, blocked = false, engaged = false
  for (let k = 0; k < 400 && ses.G.turn.stage !== 'over' && turns < 3 && !arrived && !blocked; k++) {
    const P = ses.G.pending, who = ses.decisionFor()
    if (!P || who < 0) break
    if (!(ses.G.units.find((x) => x.id === u0.id)?.alive > 0)) return null
    if (P.k === 'roundLimit') ses.submit(who, { t: 'vote', more: false })
    else if (P.k === 'chargeEnd') ses.submit(who, { t: 'chargeEnd', c: -1 })
    else if (who !== seat) ses.submit(who, { t: 'auto' })
    else {
      const wasMove = P.phase === 'move'
      await L.runOrders({ session: ses, seat, orders: new Map([[u0.id, order]]), then: 'end' })
      const u = ses.G.units.find((x) => x.id === u0.id)
      if (!(u?.alive > 0)) return null
      engaged ||= ses.preview((G2, q) => q.isEngaged(G2, u))
      const done = ses.preview((G2, q) => L.standing.doneOf(G2, q, u, order))
      if (done) arrived = done.note === 'Arrived'
      else if (wasMove) {
        turns++
        const p = ses.preview((G2, q) => L.standing.progressOf(G2, q, u, order))
        if (p.blocked) blocked = true
        else order = p.order
      }
    }
  }
  if (engaged || (!arrived && !blocked && turns < 3)) {
    out.march.cut++
    return null
  }
  out.march.n++
  out.march.hulls = (out.march.hulls ?? 0) + 1
  if (arrived) {
    out.march.arrived++
    out.march.hullsArrived = (out.march.hullsArrived ?? 0) + 1
  }
  if (blocked) out.march.blocked++
  return null
}

async function run(dir, { probes = 240, marches = 40, seed = 7, say = console.log } = {}) {
  const L = await load(dir)
  const rand = stream(seed)
  const items = loadCorpus().items.filter((it) => it.kind === 'human')
  const out = { probes: 0, sent: 0, landed: 0, stayed: 0, once: 0, kinds: {}, bad: [], lines: 0, advances: 0, orders: { runs: 0, sent: 0, acted: 0, actors: 0, kinds: {} }, march: { n: 0, arrived: 0, blocked: 0, cut: 0 }, settled: { battles: 0, pilots: 0, ends: 0, manual: 0 } }
  for (let p = 0; out.probes < probes && p < probes * 6; p++) {
    const it = rand.pick(items)
    const k = rand.int(it.job.entries.length)
    let ses
    try {
      ses = sessionAt(L, it, k)
    } catch {
      continue
    }
    const why = await probe(L, ses, rand, out).catch((e) => `threw: ${e.message}`)
    if (why === null && !Object.keys(out.kinds).length) continue
    out.probes++
    if (why && out.bad.length < 8) out.bad.push(`${it.id} at entry ${k}: ${why}`)
  }
  // (F10c) standing orders: as many runs, on states the corpus passes through
  if (L.runOrders) {
    for (let p = 0; out.orders.runs < probes && p < probes * 6; p++) {
      const it = rand.pick(items)
      const k = rand.int(it.job.entries.length)
      let ses
      try {
        ses = sessionAt(L, it, k)
      } catch {
        continue
      }
      const why = await probeOrders(L, ses, rand, out).catch((e) => `threw: ${e.message}`)
      if (why && out.bad.length < 8) out.bad.push(`${it.id} at entry ${k}: ${why}`)
    }
    for (let p = 0; out.march.n < marches && p < marches * 6; p++) await marchScenario(L, rand.pick(items), rand, out).catch((e) => out.bad.length < 8 && out.bad.push(`march threw: ${e.message}`))
  }
  // (F10c) the settings, answered from settled: four battles
  if (L.StandingInput) {
    for (const it of items.slice(0, 4)) {
      const why = await settledScenario(L, it, out).catch((e) => `${it.id}: threw: ${e.message}`)
      if (why && out.bad.length < 8) out.bad.push(why)
    }
    if (!out.settled.pilots || !out.settled.ends) out.bad.push(`the settings did nothing: ${out.settled.pilots} autopilot pilots, ${out.settled.ends} Auto-Ends`)
  }
  // (F9b) the long hulls' rows, on code with the Howdah: the group Moves,
  // and the marches (counted with the others, so before the 80% is judged)
  const longs = L.RACES.serpent.roster.some((k) => L.RACES.serpent.units[k].fp) ? { groups: 0, headings: 0, smashed: 0, turned: { place: 0, move: 0 }, engaged: 0 } : null
  if (longs) {
    for (const board of [4242, 31, 808, 52, 77, 19]) {
      const why = await hullScenario(L, board, longs).catch((e) => `board ${board}: threw: ${e.stack}`)
      if (why && out.bad.length < 8) out.bad.push(`long hulls: ${why}`)
    }
    if (!longs.headings) out.bad.push(`long hulls: no group Move held a long hull's heading to its preview's (${longs.groups} held, ${longs.smashed} left out for a smash)`)
    // ((F9b's review) a turned ghost in a group pin, and an engaged lone hull)
    if (L.GroupInput) {
      for (const verb of ['place', 'move']) for (const board of [4242, 31, 808, 52]) {
        const why = await hullTurnScenario(L, board, verb, longs).catch((e) => `board ${board}, ${verb}: threw: ${e.stack}`)
        if (why && out.bad.length < 8) out.bad.push(`long hulls: ${why}`)
      }
      if (!longs.turned.place || !longs.turned.move) out.bad.push(`long hulls: a turned ghost beside a member planned after it was met ${longs.turned.place} times in the deployment and ${longs.turned.move} in the movement phase (each must be met at least once)`)
      for (const board of [52, 2, 4, 13, 17]) {
        const why = await hullEngagedScenario(L, board, longs).catch((e) => `board ${board}: threw: ${e.stack}`)
        if (why && out.bad.length < 8) out.bad.push(`long hulls: ${why}`)
      }
      if (!longs.engaged) out.bad.push('long hulls: no Howdah was met engaged at its movement phase, so its fall back went unasked')
    }
    if (L.runOrders) {
      for (const board of [4242, 31, 808, 52]) await hullMarch(L, board, out).catch((e) => out.bad.length < 8 && out.bad.push(`a long hull's march threw: ${e.message}`))
      if (!out.march.hulls) out.bad.push('long hulls: no march with a long hull was counted')
    }
  }
  // (F9a) the riders' rows, on code with transports
  const rides = existsSync(join(dir, 'core', 'actions', 'transport.js')) ? { groups: 0, carried: 0, orders: 0 } : null
  if (rides) {
    for (const board of [4242, 31, 808, 52]) {
      const why = await ridersScenario(L, board, rides).catch((e) => `board ${board}: threw: ${e.message}`)
      if (why && out.bad.length < 8) out.bad.push(`riders: ${why}`)
    }
  }
  const kinds = Object.entries(out.kinds).map(([k, n]) => `${k} ${n}`).join(', ')
  const O = out.orders, M = out.march
  const arrive = M.n ? M.arrived / M.n : 0
  if (L.runOrders && M.n >= 10 && arrive < 0.8) out.bad.push(`a march arrived in ${M.arrived} of ${M.n} scenarios (${Math.round(arrive * 100)}%, under 80%)`)
  const ok = !out.bad.length && Object.keys(out.kinds).length >= 5 && out.lines > 0 && out.advances > 0 && (!L.runOrders || (O.runs >= probes / 2 && O.acted > 0 && (O.held ?? 0) > 0 && M.n >= 10))
  say(`  ${ok ? 'ok  ' : 'FAIL'} ${out.probes} group actions (${kinds}; ${out.lines} in a line, ${out.advances} moves +D6): ${out.sent} commands sent, every one taken; ${out.landed} members landed on the cell their preview drew, ${out.stayed} it left in place stayed, ${out.once} in +D6 moves acted at most once, inside the group${L.runOrders ? `; ${O.runs} standing-order runs (${Object.entries(O.kinds).map(([k, n]) => `${k} ${n}`).join(', ')}; move ${O.move ?? 0}, shoot ${O.shoot ?? 0}, charge ${O.charge ?? 0}): ${O.sent} commands, every one taken, ${O.acted} units acted (${O.actors} foreseen${O.freed ? `, ${O.freed} more freed by an earlier order` : ''}), ${O.held ?? 0} held to their posts under Auto; marches arrived ${M.arrived} of ${M.n} (${Math.round(arrive * 100)}%), ${M.blocked} blocked (${M.cut} cut short: caught in combat, or the battle over); Autopilot first and Auto-End in ${out.settled.battles} battles: ${out.settled.pilots} autopilot pilots, each sent from settled, at most one a phase, and ${out.settled.ends} phases ended by Auto-End` : ''}${rides ? `; (F9a) ${rides.groups} group Moves with a hull, ${rides.carried} riders riding along (sent nothing, where their hull went), ${rides.orders} riders' standing orders "with the hull"` : ''}${longs ? `; (F9b) ${longs.groups} group Moves with Howdahs (${longs.smashed} more left out for a smash), ${longs.headings} long hulls on their previewed cell and heading; ${M.hullsArrived ?? 0} of ${M.hulls ?? 0} marches with a long hull arrived (among the marches above); (F9b's review) a turned ghost planned round in ${longs.turned.place} pinned placements and ${longs.turned.move} pinned moves, every hull landing on its ghost; ${longs.engaged} engaged lone Howdahs no group of one, each falling back by the move tool` : ''}${out.bad.length ? `\n         ${out.bad.join('\n         ')}` : ''}`)
  return ok ? 0 : 1
}

const MUTANTS = [
  ['preview-alone', 'present/orders.js', '      if (leg.cell >= 0) at.set(u.id, atOf(G, leg.cell, leg.f))\n', ''],
  ['slots-lost', 'input/orders.js', 'target, first.slots, opts)', 'target, null, opts)'],
  ['engaged-falls-back', 'present/orders.js', ": q.isEngaged(G, u) ? 'in combat' : ''", ": ''", 2],
  ['line-lost', 'input/orders.js', '  const opts = { line, advance, heads: facings }\n', '  const opts = { line: null, advance, heads: facings }\n'],
  // a group's Fire stops after its first member's shot (the anchor follows
  // the send as V3c's spell bar left it, a4bac3e, naming the spell the
  // member's plan picked: the edit is what it was, a break after that send)
  ['fire-one', 'input/orders.js', "      if (verb === 'fire') await send(plan.sp === undefined ? { t: 'shoot', u: id, tg: tg.id } : { t: 'shoot', u: id, tg: tg.id, sp: plan.sp }, u)", "      if (verb === 'fire') {\n        await send(plan.sp === undefined ? { t: 'shoot', u: id, tg: tg.id } : { t: 'shoot', u: id, tg: tg.id, sp: plan.sp }, u)\n        break\n      }"],
  // (F10c) the orders' pilot names every unit of the seat, ordered or not
  ['pilot-everyone', 'input/orders.js', "orderedUnits(G, q, seat, orders, phase).filter((u) => !skip.has(u.id) && stepOf(G, q, u, orders.get(u.id), phase).how === 'pilot').map((u) => u.id)", "G.units.filter((u) => u.side === seat && u.alive > 0 && q.canAct(G, u)).map((u) => u.id)"],
  // a march planned once, not again on its advance's roll (it moves on a
  // plan made before the roll)
  ['march-stale-roll', 'input/orders.js', '    for (let k = 0; k < 2 && phaseNow() === phase; k++) {', '    for (let k = 0; k < 1 && phaseNow() === phase; k++) {'],
  // a march planned on a field from where the unit stands, not its anchor
  // (away from its slot it finds no way nearer)
  ['march-wrong-field', 'present/standing.js', '    const field = goalField(G, q, anchor, q.moveMode(u), u.t.fp ? u.t.base : u.r, q.climbs(u))\n', '    const field = goalField(G, q, u.pos, q.moveMode(u), u.t.fp ? u.t.base : u.r, q.climbs(u))\n'],
  // (F9b) the preview's heading for a long hull the lowest valid one, not
  // the move's default (the shortest): the hull ends facing another
  ['heading-lowest', 'present/orders.js', '    if (d < bd && q.validEnd(G, plan, cell, at, h)) {', '    if (f < 0 && q.validEnd(G, plan, cell, at, h)) {'],
  // (F10c's review) Auto with orders sends a plain auto: the AI plays every
  // unit, a Hold walked off its post, a March in combat fallen back
  ['auto-plays-ordered', 'input/orders.js', "  if (then === 'auto' && phaseNow() === phase) {", '  if (false) {'],
  // (F9a) a group Move or Approach plans its riders too (each previewed a
  // cell of its own, then refused: it moves only with its hull; the
  // planner's rule, under GroupInput's movers)
  ['planner-sends-riders', 'present/orders.js', "const stuck = u.aboard ? 'with the hull' : ", 'const stuck = ', 2],
  // the preview never says the riders ride along
  ['riders-unsaid', 'input/group.js', "? ' · riders ride along' : ''", "? '' : ''"],
  // (F9b's review) a turned ghost not planned again: the members after it
  // keep their ghosts, which the executor then moves elsewhere
  ['turn-stale', 'input/group.js', '    pin.preview = this.preview(pin.verb, pin.target, pin.line, pin.rot, heads)\n', '    m.f = h\n'],
  // (F9b's review) an engaged lone hull a group of one: its pin plans
  // nothing ("in combat"), so no click falls it back
  ['engaged-pins', 'input/group.js', 'q.canAct(G, u) && !q.isEngaged(G, u)', 'q.canAct(G, u)'],
]

if (a['self-test']) {
  console.log('macro-check self-test: each planted fault caught\n')
  let bad = 0
  // (F9a: view/ too, which input/group.js's sound reads; and the code as
  // it stands first, which must pass, or every fault would count caught)
  const copy = (dir) => {
    for (const d of ['core', 'data', 'match', 'present', 'input', 'view']) cpSync(join(PKG, d), join(dir, d), { recursive: true })
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
  }
  {
    const dir = mkdtempSync(join(tmpdir(), 'macro-unbroken-'))
    try {
      copy(dir)
      const lines = []
      const failed = await run(dir, { probes: 240, say: (l) => lines.push(l) })
      if (failed) {
        // (what failed: the run's own reasons, each line under its FAIL)
        const why = lines.join('\n').split('\n').filter((l) => /^ {9}\S/.test(l)).map((l) => l.trim())
        console.log(`  FAIL the unbroken copy fails the same run, so no fault can be judged: ${why.length ? why.join('; ') : lines.join(' ').slice(0, 400)}`)
        process.exit(1)
      }
      console.log('  ok   unbroken       passes')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  for (const [name, file, from, to, times = 1] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `macro-${name}-`))
    try {
      copy(dir)
      const p = join(dir, file), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== times + 1) {
        console.log(`  FAIL ${name}: its anchor is not in ${file} ${times === 1 ? 'exactly once' : `${times} times`} (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.split(from).join(to))
      const lines = []
      const failed = await run(dir, { probes: 240, say: (l) => lines.push(l) })
      console.log(`  ${failed ? 'ok  ' : 'FAIL'} ${name.padEnd(14)} ${failed ? `caught: ${lines.join(' ').split('\n')[1]?.trim().slice(0, 100) ?? ''}` : 'not caught'}`)
      if (!failed) bad++
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(bad ? `\nmacro-check self-test FAILED: ${bad} problem(s)` : `\nmacro-check self-test passed: ${MUTANTS.length} faults, each caught`)
  process.exit(bad ? 1 : 0)
}
console.log('macro-check (P-macro): one-shot group actions over a Session, on states the human corpus passes through\n')
const failed = await run(PKG, { probes: Number(a.probes) || 240, seed: Number(a.seed) || 7 })
console.log(failed ? '\nmacro-check FAILED' : '\nmacro-check passed: every group action sends only what the match takes, and goes where its preview drew it')
process.exit(failed)
