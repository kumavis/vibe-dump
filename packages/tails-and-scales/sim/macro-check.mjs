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
// preview that ignores the members planned before it, an executor that
// loses the formation's slots as it plans each member again, or its line,
// a Fire that stops after one shot) and expects each to be caught. (The Session itself
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
  const [session, store, orders, exec] = await Promise.all([at('match/session.js'), at('match/store.js'), at('present/orders.js'), at('input/orders.js')])
  return { Session: session.Session, LocalStore: store.LocalStore, previewGroup: orders.previewGroup, runGroup: exec.runGroup }
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
  if (advance) {
    // +D6: every member that advanced then moved (or could not), none
    // moved twice, and a member that didn't advance moved where it would have
    const sent = ses.store.entries().slice(count)
    const adv = sent.filter((e) => e.t === 'advance').map((e) => e.u), moves = sent.filter((e) => e.t === 'move').map((e) => e.u)
    if (new Set(moves).size !== moves.length) return 'move +D6: a member moved twice'
    if (moves.some((id) => !members.some((u) => u.id === id)) || adv.some((id) => !members.some((u) => u.id === id))) return 'move +D6: a unit outside the group acted'
    out.checked += pv.members.length
    return null
  }
  if (ms > 1000) return `${verb} took ${ms.toFixed(0)} ms`
  const G2 = ses.G
  if (verb === 'place' || verb === 'move' || verb === 'approach') {
    if (G2.nav.epoch !== epoch || members.some((u) => u.t.wrecker)) return null // (a smash reshaped the board)
    for (const m of pv.members) {
      const u = G2.units.find((x) => x.id === m.u.id)
      if (m.cell >= 0) {
        const c = G2.nav.index(u.pos.x, u.pos.z)
        if (c !== m.cell) return `${verb}: ${u.t.short} ${u.id} was previewed to cell ${m.cell} and went to ${c}${process.env.MACRO_DEBUG ? ` (members ${JSON.stringify(pv.members.map((x) => [x.u.id, x.cell, x.how, G2.nav.index(G2.units.find((y) => y.id === x.u.id).pos.x, G2.units.find((y) => y.id === x.u.id).pos.z)]))}; sent ${JSON.stringify(ses.store.entries().slice(count).map((e) => [e.t, e.u, e.c]))}; blocked ${JSON.stringify(r.blocked.map((b) => [b.u.id, b.why]))})` : ''}`
      } else if (u.pos.x !== m.u.pos.x || u.pos.z !== m.u.pos.z) return `${verb}: ${u.t.short} ${u.id} was previewed staying and moved`
    }
    out.checked += pv.members.length
  }
  if (verb === 'fire') {
    const may = pv.members.filter((m) => m.how === 'fire').length
    if (r.sent > may) return `fire: ${r.sent} shots sent, the preview had ${may} able`
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

async function run(dir, { probes = 240, seed = 7, say = console.log } = {}) {
  const L = await load(dir)
  const rand = stream(seed)
  const items = loadCorpus().items.filter((it) => it.kind === 'human')
  const out = { probes: 0, sent: 0, checked: 0, kinds: {}, bad: [], lines: 0, advances: 0 }
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
  const kinds = Object.entries(out.kinds).map(([k, n]) => `${k} ${n}`).join(', ')
  const ok = !out.bad.length && Object.keys(out.kinds).length >= 5 && out.lines > 0 && out.advances > 0
  say(`  ${ok ? 'ok  ' : 'FAIL'} ${out.probes} group actions (${kinds}; ${out.lines} in a line, ${out.advances} moves +D6): ${out.sent} commands sent, every one taken; ${out.checked} members where their preview drew them${out.bad.length ? `\n         ${out.bad.join('\n         ')}` : ''}`)
  return ok ? 0 : 1
}

const MUTANTS = [
  ['preview-alone', 'present/orders.js', '      if (leg.cell >= 0) at.set(u.id, { x: G.nav.x(leg.cell), z: G.nav.z(leg.cell) })\n', ''],
  ['slots-lost', 'input/orders.js', 'target, first.slots, opts)', 'target, null, opts)'],
  ['line-lost', 'input/orders.js', '  const opts = { line, advance }\n', '  const opts = { line: null, advance }\n'],
  ['fire-one', 'input/orders.js', "      if (verb === 'fire') await send({ t: 'shoot', u: id, tg: tg.id }, u)", "      if (verb === 'fire') {\n        await send({ t: 'shoot', u: id, tg: tg.id }, u)\n        break\n      }"],
]

if (a['self-test']) {
  console.log('macro-check self-test: each planted fault caught\n')
  let bad = 0
  for (const [name, file, from, to] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `macro-${name}-`))
    try {
      for (const d of ['core', 'data', 'match', 'present', 'input']) cpSync(join(PKG, d), join(dir, d), { recursive: true })
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
      const p = join(dir, file), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== 2) {
        console.log(`  FAIL ${name}: its anchor is not in ${file} exactly once (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.replace(from, () => to))
      const lines = []
      const failed = await run(dir, { probes: 160, say: (l) => lines.push(l) })
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
