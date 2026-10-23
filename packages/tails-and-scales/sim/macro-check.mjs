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
// shot) and expects each to be caught. (The Session itself
// refuses an illegal command, so an executor that skips its own legality
// check sends nothing illegal: no fault this can show.) Exit 0 when
// everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus } from './lib.mjs'
import { jobSetup, seatDevices } from './run.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { probes: { type: 'string' }, seed: { type: 'string' }, 'self-test': { type: 'boolean' } } })

async function load(dir) {
  const at = (f) => import(pathToFileURL(join(dir, f)).href)
  const [session, store, orders, exec, standing, book, sti] = await Promise.all([at('match/session.js'), at('match/store.js'), at('present/orders.js'), at('input/orders.js'), at('present/standing.js').catch(() => null), at('input/book.js').catch(() => null), at('input/standing.js').catch(() => null)])
  return { Session: session.Session, LocalStore: store.LocalStore, previewGroup: orders.previewGroup, slotsOf: orders.slotsOf, goalField: orders.goalField, runGroup: exec.runGroup, runOrders: standing && exec.runOrders, standing, OrderBook: book?.OrderBook, StandingInput: sti?.StandingInput }
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
  const look = (G2) => G2.units.filter((u) => u.side === seat && !orders.has(u.id)).map((u) => `${u.id}@${u.pos.x},${u.pos.z}:${u.flags.moved ? 1 : 0}${u.flags.shot ? 1 : 0}${u.flags.charged ? 1 : 0}`).join(' ')
  const before = look(G)
  const actors = ses.preview((G2, q) => L.standing.actorsOf(G2, q, seat, orders, P.phase))
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
  if (r.acted.some((id) => !orders.has(id))) return 'orders acted for a unit with none'
  if (r.acted.some((id) => !actors.some((a) => a.u.id === id))) return `orders acted for units the count left out (${r.acted.filter((id) => !actors.some((a) => a.u.id === id)).join(', ')})`
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
  const field = ses.preview((G2, q) => L.goalField(G2, q, u0.pos, q.moveMode(u0), u0.r))
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
  const kinds = Object.entries(out.kinds).map(([k, n]) => `${k} ${n}`).join(', ')
  const O = out.orders, M = out.march
  const arrive = M.n ? M.arrived / M.n : 0
  if (L.runOrders && M.n >= 10 && arrive < 0.8) out.bad.push(`a march arrived in ${M.arrived} of ${M.n} scenarios (${Math.round(arrive * 100)}%, under 80%)`)
  const ok = !out.bad.length && Object.keys(out.kinds).length >= 5 && out.lines > 0 && out.advances > 0 && (!L.runOrders || (O.runs >= probes / 2 && O.acted > 0 && M.n >= 10))
  say(`  ${ok ? 'ok  ' : 'FAIL'} ${out.probes} group actions (${kinds}; ${out.lines} in a line, ${out.advances} moves +D6): ${out.sent} commands sent, every one taken; ${out.landed} members landed on the cell their preview drew, ${out.stayed} it left in place stayed, ${out.once} in +D6 moves acted at most once, inside the group${L.runOrders ? `; ${O.runs} standing-order runs (${Object.entries(O.kinds).map(([k, n]) => `${k} ${n}`).join(', ')}; move ${O.move ?? 0}, shoot ${O.shoot ?? 0}, charge ${O.charge ?? 0}): ${O.sent} commands, every one taken, ${O.acted} units acted (${O.actors} foreseen); marches arrived ${M.arrived} of ${M.n} (${Math.round(arrive * 100)}%), ${M.blocked} blocked (${M.cut} cut short: caught in combat, or the battle over); Autopilot first and Auto-End in ${out.settled.battles} battles: ${out.settled.pilots} autopilot pilots, each sent from settled, at most one a phase, and ${out.settled.ends} phases ended by Auto-End` : ''}${out.bad.length ? `\n         ${out.bad.join('\n         ')}` : ''}`)
  return ok ? 0 : 1
}

const MUTANTS = [
  ['preview-alone', 'present/orders.js', '      if (leg.cell >= 0) at.set(u.id, { x: G.nav.x(leg.cell), z: G.nav.z(leg.cell) })\n', ''],
  ['slots-lost', 'input/orders.js', 'target, first.slots, opts)', 'target, null, opts)'],
  ['engaged-falls-back', 'present/orders.js', ": q.isEngaged(G, u) ? 'in combat' : ''", ": ''", 2],
  ['line-lost', 'input/orders.js', '  const opts = { line, advance }\n', '  const opts = { line: null, advance }\n'],
  ['fire-one', 'input/orders.js', "      if (verb === 'fire') await send({ t: 'shoot', u: id, tg: tg.id }, u)", "      if (verb === 'fire') {\n        await send({ t: 'shoot', u: id, tg: tg.id }, u)\n        break\n      }"],
  // (F10c) the orders' pilot names every unit of the seat, ordered or not
  ['pilot-everyone', 'input/orders.js', "orderedUnits(G, q, seat, orders, phase).filter((u) => stepOf(G, q, u, orders.get(u.id), phase).how === 'pilot').map((u) => u.id)", "G.units.filter((u) => u.side === seat && u.alive > 0 && q.canAct(G, u)).map((u) => u.id)"],
  // a march planned once, not again on its advance's roll (it moves on a
  // plan made before the roll)
  ['march-stale-roll', 'input/orders.js', '    for (let k = 0; k < 2 && phaseNow() === phase; k++) {', '    for (let k = 0; k < 1 && phaseNow() === phase; k++) {'],
  // a march planned on a field from where the unit stands, not its anchor
  // (away from its slot it finds no way nearer)
  ['march-wrong-field', 'present/standing.js', '    const field = goalField(G, q, anchor, q.moveMode(u), u.r)\n', '    const field = goalField(G, q, u.pos, q.moveMode(u), u.r)\n'],
]

if (a['self-test']) {
  console.log('macro-check self-test: each planted fault caught\n')
  let bad = 0
  for (const [name, file, from, to, times = 1] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `macro-${name}-`))
    try {
      for (const d of ['core', 'data', 'match', 'present', 'input']) cpSync(join(PKG, d), join(dir, d), { recursive: true })
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
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
