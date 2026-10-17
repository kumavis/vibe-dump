// P-prop (DESIGN §4's gate; §0.2 #18; §4.1 rules 2, 10, 12 and 13): what
// holds for any play of the pure core (core/index.js), not only the
// corpus's. Folded headless, as sim/run.mjs folds.
//
// 1. Asking never rolls and never changes the match. At every decision a
//    human seat is asked (each entry of every corpus human log, each
//    decision of every random game below), legal() judges a battery of
//    commands, legal and not (every kind, for both seats and seats that
//    don't exist, junk bodies, the AI's own `hold`), and the previews a
//    seat's tools run (the move plan, its valid ends and nearestValid, the
//    shot's odds, the charge's plan and spots, freeSpot, canAct, the labels
//    and flags) run through preview(), the dice locked. None of it may
//    throw, move the dice stream (its word, count and hash), change the
//    match (the full-precision shadow, the turn, the decision pending, the
//    journal), emit an event (the view would play it as if it had happened)
//    or leave the dice locked; and the corpus logs, probed at every
//    entry, must still replay their recorded traces, shadows and battle
//    logs exactly. The lock itself: a draw while locked throws, and legal()
//    and preview() leave the lock as they found it.
// 2. The AI never issues an illegal command. Everything is folded `strict`
//    (createMatch's option: runAI holds each command the AI's generator
//    yields to legal() before it is applied, and throws on one that isn't),
//    so every AI phase and every Auto of every corpus battle and random game
//    is checked, command by command.
// 3. Random legal play never throws. Each random game is a random setup
//    (board and dice seeds; races, mirror matches and swapped seats
//    included; a human or the AI in each seat; now and then a longer or a
//    shorter battle) whose human decisions are answered with a command
//    picked at random among the battery's legal ones (deployment
//    placements, advances, moves, shots, charges, charge ends, Auto, End,
//    and now and then a concession, in a hotseat game often from the seat
//    the match isn't waiting on: §2.2's concession comes out of band, and
//    that seat may send nothing else); in half the games the pick is
//    aggressive (a shot or a charge when there is one, else the move that
//    ends nearest an enemy), which is what wipes an army out. Every apply must
//    succeed, the battle must end within a bound, and between commands:
//    the match waits on someone exactly while it isn't over, only on human
//    seats; the nav grid is never dirty (§4.1 rule 9); every standing unit
//    is on the table; the dice are unlocked; the trace and the dice only
//    go forward; and G holds no closure, promise or generator but its two
//    I/O fields (§0.2 #12). At the end the result agrees with the score,
//    the wipe or the concession (G.turn.result, and the one game.over
//    event, its `rounds` the rounds played, the one under way counted, 0
//    in the deployment), and the game's log, folded as parity --core and
//    the Folder (R8) fold one (sim/run.mjs foldJob: each entry held to the
//    decision it answers, a concession out of band), plays the same battle
//    (its trace's hash). Over the run there must be games that end on the
//    score, in a wipe-out, by a concession and by one out of band, charge
//    ends picked, and Auto pressed, or the run says what it never reached
//    and fails.
// 4. Two matches in one process don't touch each other (§4.1 rule 13): two
//    random games with human seats are played again interleaved, command by
//    command, in one process, and each must write the trace it wrote alone.
// 5. A quiet fold plays the same battle. A catch-up, a scrub and a peer
//    fold with G.out null, keeping no events (§2.4), and the rules skip
//    building what only the view reads then; no corpus run is quiet, so
//    parity can't see that path. Every corpus battle is folded again
//    quietly and must write the same trace and the same shadow at every
//    state line as its presented fold.
// 6. The match's own events show the match (§2.4's mirror, for the engine's
//    stream: P-present holds only main.js's loop until R6b). Every corpus
//    battle and random game folds its events, the engine's flow events and
//    the AI's included, into a mirror (present/mirror.js, sim/run.mjs
//    mirrorTap) from the table before the first one, which must equal
//    project(G) at every `act`, at every decision and at the end.
// 7. A concession out of band, whatever the seed: in a hotseat match the
//    seat the match isn't waiting on (seat 0 in the deployment, having sent
//    `deployed`; the seat whose turn it isn't at the first phase decision)
//    may concede and nothing else, the other seat wins (game.over saying
//    0 rounds played in the deployment, 1 in the battle), and foldJob folds
//    the log to the same trace.
// 8. createMatch refuses a setup the rules can't play (core/index.js
//    fullSetup: seeds outside 0 to 2^32 - 1, rounds outside 1 to 99 or not
//    whole, F4's vote, other dice, seats that aren't two, an unknown race
//    or controller), each with an error of its own rather than a crash, and
//    takes the edges of what they can. And G has §2.1's shape from the
//    start: `pending` null, never missing, at every trace line of an all-AI
//    battle (the engine's runs never set it), and `strict` a boolean.
//
//   node sim/property.mjs [--games N] [--seed S] [--only <kinds, modes or ids>] [--dir <packageDir> | --ref <ref>]
//   node sim/property.mjs --self-test     each broken copy of the core in
//                                         MUTATIONS below must fail it
// The self-test first runs the same small workload (three corpus battles,
// ten games) on an unbroken copy, which must pass; a mutation counts as
// caught only on a property's own failure, never on what the games failed
// to reach (that rule is the full run's).
//
// --games (default 32) random games from --seed (default 1); --only picks
// the corpus battles (default all 40; `none` for none). One child process
// per battle or game, up to one per CPU. Exit 0 when every property holds
// (the self-test: when every mutation is caught), 1 otherwise, 2 on bad
// arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, verdict, pool, CPUS, copyCode, h10 } from './lib.mjs'
import { foldJob, shadowPartsG, mirrorTap } from './run.mjs'
import { shadowString } from './oracle/shadow.mjs'
import { mulberry32 } from './oracle/human-bot.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({
    options: {
      games: { type: 'string' }, seed: { type: 'string' }, only: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' },
      child: { type: 'boolean' }, 'self-test': { type: 'boolean' },
    },
  }))
} catch (e) {
  console.error(`property: ${e.message}\nusage: node sim/property.mjs [--games N] [--seed S] [--only <kinds, modes or ids> | none] [--dir <packageDir> | --ref <ref>] | --self-test`)
  process.exit(2)
}
const whole = (v, d, name) => {
  const n = v === undefined ? d : Number(v)
  if (!Number.isInteger(n) || n < 0) {
    console.error(`property: --${name} takes a whole number, not ${v}`)
    process.exit(2)
  }
  return n
}
const GAMES = whole(a.games, 32, 'games')
const SEED = whole(a.seed, 1, 'seed')
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')

// ── The checks, run in a child per battle or game ───────────────────────────
// Every failure is thrown as an error naming where; a child reads its task
// on stdin and reports one result: { ok, error, counts, game? }.

// What must not change while the match is asked a question: the legacy
// shadow (every unit, every chunk, the turn as it prints, the dice), the
// whole turn, the decision pending, the dice's word, the journal, the nav
// cache's dirt and the events emitted (G.out, null in a quiet fold).
function fingerprint(core, G) {
  return [
    shadowString(shadowPartsG(core.q, G, 'probe')), JSON.stringify(G.turn), JSON.stringify(G.pending), G.rng.a, G.rng.n, G.rng.h, G.rng.locked,
    G.nextUnitId, G.journal.trace.length, JSON.stringify(G.journal.pendingLog), G.terrain.dirty, G.terrain.chunks.length, G.out?.length ?? -1,
  ].join('\n')
}

// The battery of commands to judge at a decision of `seat`: every kind, for
// the seat's own units and the enemy's, cells the tools would offer and
// cells at random, and junk (fields no kind has among it). Built under preview() (it plans moves and
// charges), so building it is itself held to the lock.
function battery(core, G, seat, rand) {
  return core.preview(G, (G, q) => {
    const { nav } = G
    const out = []
    const some = (arr, n) => {
      const c = arr.slice()
      const got = []
      while (c.length && got.length < n) got.push(c.splice(Math.floor(rand() * c.length), 1)[0])
      return got
    }
    const cell = () => Math.floor(rand() * nav.N)
    const mine = G.units.filter((u) => u.side === seat)
    const theirs = G.units.filter((u) => u.side !== seat)
    const P = G.pending
    // the deployment: where a unit stands, a free spot near a random point of
    // the table, a random cell
    for (const u of some(mine, 4)) {
      out.push({ t: 'place', u: u.id, c: nav.index(u.pos.x, u.pos.z) }, { t: 'place', u: u.id, c: cell() })
      const p = q.freeSpot(G, u, (rand() - 0.5) * nav.W, (rand() - 0.5) * nav.H, seat, G.units.filter((o) => o !== u))
      if (p) out.push({ t: 'place', u: u.id, c: nav.index(p.x, p.z) })
    }
    out.push({ t: 'place', u: theirs[0].id, c: nav.index(theirs[0].pos.x, theirs[0].pos.z) }, { t: 'deployed' })
    // the movement phase: advances, and moves to cells the plan offers (its
    // valid ends, the one nearest a random point) and to random ones
    for (const u of mine.filter((u) => q.alive(u))) {
      out.push({ t: 'advance', u: u.id })
      const plan = q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
      const ok = []
      for (let i = 0; i < nav.N; i++) if (isFinite(plan.res.dist[i]) && q.validEnd(G, plan, i)) ok.push(i)
      for (const c of some(ok, 3)) out.push({ t: 'move', u: u.id, c })
      out.push({ t: 'move', u: u.id, c: q.nearestValid(G, plan, u.pos.x + (rand() - 0.5) * 16, u.pos.z + (rand() - 0.5) * 16) })
      out.push({ t: 'move', u: u.id, c: cell() })
      q.canAct(G, u)
    }
    // shots and charges, every pair (the odds as the tooltip reckons them)
    for (const u of mine) {
      for (const e of theirs) {
        out.push({ t: 'shoot', u: u.id, tg: e.id }, { t: 'charge', u: u.id, tg: e.id })
        if (q.alive(u) && q.alive(e) && u.t.ranged) {
          const info = q.shotInfo(G, u, e)
          if (info.ok) q.isEngaged(G, e), q.inCover(G, e), q.sight(G, u, e)
        }
        if (q.alive(u) && q.alive(e) && q.chargeTargets(G, u).includes(e)) {
          const plan = q.chargePlan(G, u, e)
          if (plan) q.chargeSpots(plan, 2 + Math.floor(rand() * 11))
        }
      }
    }
    // a charge's end: the shortest move, spots the roll reaches, random cells
    if (P?.k === 'chargeEnd') {
      const plan = q.chargePlan(G, G.units.find((u) => u.id === P.u), G.units.find((u) => u.id === P.tg))
      const spots = []
      if (plan) q.chargeSpots(plan, P.rolled).forEach((v, i) => v && spots.push(i))
      for (const c of some(spots, 3)) out.push({ t: 'chargeEnd', c })
    }
    out.push({ t: 'chargeEnd', c: -1 }, { t: 'chargeEnd', c: cell() }, { t: 'end' }, { t: 'auto' }, { t: 'concede' })
    // what the labels and flags would show
    q.statusOf(G), q.ownersOf(G), q.anyCanAct(G, seat), q.phaseKey(G)
    // junk: no such command, the AI's own hold, a vote before F4, fractions,
    // strings, missing fields, an Object.prototype name, no body at all;
    // and fields the kind doesn't take (a fraction, a nested object, the
    // seat, a field of another kind), which no body may carry into a log
    const u0 = mine[0].id
    out.push({ t: 'nope' }, { t: 'hold', u: u0 }, { t: 'vote', more: true }, { t: 'move', u: u0 + 0.5, c: 0 }, { t: 'move', u: String(u0), c: 0 },
      { t: 'shoot', u: u0 }, { t: 'toString' }, { t: '__proto__' }, { t: 'place', u: 999, c: 0 }, { t: 'move', u: u0, c: -7 }, { t: 'move', u: u0, c: nav.N },
      { t: 'end', junk: 0.5 }, { t: 'auto', extra: { nested: [1.5] } }, { t: 'deployed', s: seat }, { t: 'concede', u: u0 }, ...JUNK)
    for (const b of out.slice()) if (b.t === 'move' || b.t === 'place') out.push({ ...b, tg: u0 })
    return out
  })
}

// bodies with a field their kind doesn't take, each of them refused
const JUNK = [{ t: 'end', c: 0 }, { t: 'chargeEnd', c: -1, u: 0 }, { t: 'shoot', u: 0, tg: 1, c: 0 }]
const KEYS = { place: ['u', 'c'], deployed: [], advance: ['u'], move: ['u', 'c'], shoot: ['u', 'tg'], charge: ['u', 'tg'], chargeEnd: ['c'], end: [], auto: [], concede: [] }

// Judge the battery for `seat` (and some for the other seat and seats that
// don't exist); every verdict must leave the match exactly as it was.
// Returns the bodies legal for `seat`.
function probe(core, G, seat, rand, where) {
  const before = fingerprint(core, G)
  const cands = battery(core, G, seat, rand)
  if (fingerprint(core, G) !== before) throw new Error(`${where}: the previews changed the match`)
  const ok = []
  for (const b of cands) {
    let why
    try {
      why = core.legal(G, seat, b)
    } catch (e) {
      throw new Error(`${where}: legal(G, ${seat}, ${JSON.stringify(b)}) threw: ${e.message}`)
    }
    if (why === null) ok.push(b)
    else if (typeof why !== 'string') throw new Error(`${where}: legal(G, ${seat}, ${JSON.stringify(b)}) answered ${JSON.stringify(why)}, neither null nor a reason`)
  }
  for (const b of [...cands.slice(0, 12), null, undefined, 7]) {
    for (const s of [1 - seat, -1, 2, 0.5, '0']) {
      try {
        core.legal(G, s, b)
      } catch (e) {
        throw new Error(`${where}: legal(G, ${JSON.stringify(s)}, ${JSON.stringify(b)}) threw: ${e.message}`)
      }
    }
  }
  if (fingerprint(core, G) !== before) throw new Error(`${where}: asking legal() changed the match (the dice, the units, the turn, the decision or the events)`)
  if (ok.some((b) => b.t === 'hold' || b.t === 'vote' || b.t === 'nope')) throw new Error(`${where}: legal() accepted a command no seat may send: ${JSON.stringify(ok.find((b) => ['hold', 'vote', 'nope'].includes(b.t)))}`)
  // a body carries its kind's fields and nothing else (§4.1 rule 12)
  const extra = ok.find((b) => Object.keys(b).some((k) => k !== 't' && !KEYS[b.t]?.includes(k)))
  if (extra) throw new Error(`${where}: legal() accepted a body with a field its kind doesn't take: ${JSON.stringify(extra)}`)
  // a wipe-out decides the battle (it ends at the phase's end): nobody
  // concedes it after
  if (G.turn.wiped >= 0 && ok.some((b) => b.t === 'concede')) throw new Error(`${where}: legal() lets seat ${seat} concede a battle seat ${G.turn.wiped}'s wipe-out decided`)
  return ok
}

// Between two commands (DESIGN §0.2 #12, §4.1 rule 9).
function invariants(core, G, where, last) {
  const T = G.turn
  const human = G.seats.filter((s) => s.ctrl === 'human').map((s) => s.seat)
  if ((T.stage === 'over') !== (G.pending === null)) throw new Error(`${where}: stage ${T.stage} with ${JSON.stringify(G.pending)} pending`)
  if (G.pending && !G.pending.seats.every((s) => human.includes(s))) throw new Error(`${where}: waiting on a seat no human plays: ${JSON.stringify(G.pending)}`)
  if (!['deploy', 'battle', 'over'].includes(T.stage)) throw new Error(`${where}: stage ${T.stage}`)
  if (G.terrain.dirty) throw new Error(`${where}: the nav grid is dirty between commands (§4.1 rule 9)`)
  if (G.rng.locked) throw new Error(`${where}: the dice are left locked`)
  const { W, H } = G.nav
  for (const u of G.units) {
    if (core.q.alive(u) && (Math.abs(u.pos.x) > W / 2 || Math.abs(u.pos.z) > H / 2)) throw new Error(`${where}: unit ${u.id} stands off the table at ${u.pos.x}, ${u.pos.z}`)
  }
  if (last) {
    if (G.journal.trace.length < last.trace || G.rng.n < last.n) throw new Error(`${where}: the trace or the dice went backwards`)
    last.trace = G.journal.trace.length
    last.n = G.rng.n
  }
  // no closure, promise or generator in G but its I/O fields
  const seen = new Set()
  const walk = (v, path) => {
    if (typeof v === 'function') throw new Error(`${where}: a function in G at ${path}`)
    if (!v || typeof v !== 'object' || seen.has(v) || ArrayBuffer.isView(v)) return
    seen.add(v)
    if (v instanceof Promise || typeof v.next === 'function' || typeof v.then === 'function') throw new Error(`${where}: control state in G at ${path}`)
    for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`)
  }
  for (const [k, v] of Object.entries(G)) if (k !== 'out' && k !== 'onTrace') walk(v, `G.${k}`)
}

// The result agrees with how the battle ended (a concession is refused once
// a side is wiped out, so the two never meet).
function result(G, where, conceded) {
  const T = G.turn, r = T.result
  const last = G.journal.trace.at(-1)
  if (!last?.startsWith('over ')) throw new Error(`${where}: the trace doesn't end on its 'over' line`)
  const want = conceded >= 0 ? { win: 1 - conceded, why: 'concede' }
    : T.wiped >= 0 ? { win: 1 - T.wiped, why: 'wipe' }
    : { win: T.vp[0] > T.vp[1] ? 0 : T.vp[1] > T.vp[0] ? 1 : -1, why: 'score' }
  if (r?.win !== want.win || r?.why !== want.why) throw new Error(`${where}: the result ${JSON.stringify(r)} should be ${JSON.stringify(want)}`)
  return r.why
}

// The lock itself: a draw while locked throws; legal() and preview() leave
// the lock as they found it.
function lockCheck(core, rng, G, where) {
  const r = G.rng, was = { ...r }
  rng.lock(r)
  let threw = false
  try {
    rng.draw(r)
  } catch {
    threw = true
  }
  if (!threw || r.n !== was.n || r.a !== was.a) throw new Error(`${where}: a draw while the dice are locked didn't throw, or moved them`)
  core.legal(G, 0, { t: 'end' })
  core.preview(G, () => {})
  if (!r.locked) throw new Error(`${where}: legal() or preview() unlocked dice it found locked`)
  rng.unlock(r)
  core.legal(G, 0, { t: 'end' })
  core.preview(G, () => {})
  if (r.locked) throw new Error(`${where}: legal() or preview() left the dice locked`)
}

// A corpus battle, probed at each entry and folded strict, its events held
// to the mirror, must still replay.
function corpusTask(core, rng, mirror, it) {
  const rand = mulberry32(it.id.length * 7919 + 17)
  const counts = { probes: 0, aiStrict: 1 }
  const r = foldJob(core, it.job, {
    strict: true,
    mirror,
    before: (G, e, k) => {
      const where = `${it.id} entry ${k}`
      if (k === 0) lockCheck(core, rng, G, where)
      invariants(core, G, where)
      const ok = probe(core, G, e.s, rand, where)
      counts.probes++
      // the entry the log plays (its seat, and the body) must be among what
      // legal() accepts
      const { s, ...body } = e
      if (core.legal(G, s, body) !== null) throw new Error(`${where}: legal() refuses the corpus's own entry ${JSON.stringify(e)}: ${core.legal(G, s, body)}`)
      counts.legal = (counts.legal ?? 0) + ok.length
    },
  })
  if (r.error) throw new Error(`${it.id}: ${r.error.split('\n')[0]}`)
  const v = verdict(it, r)
  const at = (k) => (k < 0 ? 'same' : k + 1)
  if (!v.ok) throw new Error(`${it.id}: probed and folded strict, it no longer replays its corpus record (trace line ${at(v.line)}, shadow ${at(v.shadow)}, write ${at(v.written)})`)
  // 5. the same battle folded quietly
  const quiet = foldJob(core, it.job, { quiet: true })
  if (quiet.error) throw new Error(`${it.id}: folded quietly (G.out null) it stops: ${quiet.error.split('\n')[0]}`)
  const first = (x, y) => {
    for (let i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) return i
    return -1
  }
  const line = first(quiet.trace, r.trace), snap = first(quiet.shadow, r.shadow)
  if (line >= 0 || snap >= 0) throw new Error(`${it.id}: folded quietly (G.out null) it plays another battle: trace line ${line + 1}, shadow ${snap + 1} (${(quiet.trace[line] ?? r.trace[line] ?? '').slice(0, 80)})`)
  counts.quiet = 1
  counts.mirrored = r.mirrored
  return counts
}

// A random game: a random setup, its human seats played at random among
// the legal commands. Returns what it reached, and its command log.
const MIXES = [['ai', 'ai'], ['human', 'ai'], ['ai', 'human'], ['human', 'human']]
function randomTask(core, rng, mirror, races, seed) {
  const rand = mulberry32(seed * 2654435761)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const ctrl = seed < 4 ? MIXES[seed] : pick(MIXES)
  const aggressive = seed % 2 === 0
  const r = rand()
  const setup = {
    board: 1 + Math.floor(rand() * 1e6), dice: 1 + Math.floor(rand() * 1e9),
    rounds: r < 0.2 ? 1 + Math.floor(rand() * 3) : r < 0.5 ? 6 + Math.floor(rand() * 5) : 5,
    seats: [0, 1].map((s) => ({ race: rand() < 0.7 ? ['squirrel', 'serpent'][s] : pick(races), ctrl: ctrl[s] })),
  }
  const where0 = `game ${seed} (${JSON.stringify(setup)})`
  const counts = { games: 1, probes: 0, commands: {}, ended: null, aggressive }
  // how far from the nearest enemy a body's move ends (Infinity if it isn't one)
  const reach = (b) => {
    if (b.t !== 'move') return Infinity
    const u = G.units.find((x) => x.id === b.u)
    const x = G.nav.x(b.c), z = G.nav.z(b.c)
    return Math.min(...G.units.filter((e) => e.side !== u.side && core.q.alive(e)).map((e) => Math.hypot(e.pos.x - x, e.pos.z - z)))
  }
  // a third of the human games concede, early, at a random decision
  const concedeAt = ctrl.includes('human') && rand() < 0.33 ? 3 + Math.floor(rand() * 40) : -1
  const humans = setup.seats.flatMap((s, i) => (s.ctrl === 'human' ? [i] : []))
  const log = []
  const tap = mirrorTap(mirror)
  // the events since the last look, held to the mirror; the rounds scored,
  // whether the battle began and the game.over events, kept for the end
  const seen = { scored: 0, battle: false, over: [] }
  const take = (where) => {
    const events = G.out.splice(0)
    for (const e of events) {
      if (e.t === 'round.scored') seen.scored++
      else if (e.t === 'stage' && e.stage === 'battle') seen.battle = true
      else if (e.t === 'game.over') seen.over.push(e)
    }
    tap.fold(G, events, where)
  }
  const G = core.createMatch(setup, { out: [], strict: true, onTrace: tap.trace })
  const last = { trace: 0, n: 0 }
  let conceded = -1
  for (let k = 0; G.turn.stage !== 'over'; k++) {
    const where = `${where0} decision ${k}`
    if (k > 3000) throw new Error(`${where}: the battle never ends`)
    invariants(core, G, where, last)
    if (k === 0) lockCheck(core, rng, G, where)
    take(where)
    const seat = core.pendingSeats(G)[Math.floor(rand() * core.pendingSeats(G).length)]
    const ok = probe(core, G, seat, rand, where)
    counts.probes++
    // who plays (`by`) and what legal() accepts of it: the seat waited on,
    // or, for a concession out of band, now and then a human seat the match
    // isn't waiting on (the other hotseat player; a deploying seat that has
    // sent `deployed`), which may send that and nothing else
    let by = seat, mayDo = ok, body
    if (k === concedeAt) {
      const idle = humans.filter((s) => !core.pendingSeats(G).includes(s))
      if (idle.length && rand() < 0.6) {
        by = pick(idle)
        mayDo = probe(core, G, by, rand, `${where} (seat ${by}, not waited on)`)
        counts.probes++
        const other = mayDo.find((b) => b.t !== 'concede')
        if (other) throw new Error(`${where}: legal() lets seat ${by}, which the match isn't waiting on, send ${JSON.stringify(other)}`)
        if (G.turn.wiped < 0 && !mayDo.length) throw new Error(`${where}: legal() refuses seat ${by}'s concession out of band (the match waits on ${JSON.stringify(G.pending)})`)
      }
      if (mayDo.some((b) => b.t === 'concede')) body = { t: 'concede' }
      else [by, mayDo] = [seat, ok]
    }
    if (!body) {
      const P = G.pending
      const acts = ok.filter((b) => !['end', 'auto', 'deployed', 'concede'].includes(b.t))
      if (P.k === 'deploy') body = acts.length && rand() < 0.7 ? pick(acts) : { t: 'deployed' }
      else if (P.k === 'chargeEnd') body = pick(acts)
      else if (aggressive && acts.length) {
        const hits = acts.filter((b) => b.t === 'shoot' || b.t === 'charge')
        const moves = acts.filter((b) => b.t === 'move').sort((x, y) => reach(x) - reach(y))
        body = hits.length ? pick(hits) : moves.length && rand() < 0.9 ? moves[0] : pick(acts)
      } else body = acts.length && rand() < 0.85 ? pick(acts) : rand() < 0.3 ? { t: 'auto' } : { t: 'end' }
    }
    if (!mayDo.some((b) => JSON.stringify(b) === JSON.stringify(body))) throw new Error(`${where}: picked ${JSON.stringify(body)} for seat ${by}, which legal() didn't accept`)
    if (body.t === 'concede') {
      conceded = by
      if (by !== seat) counts.offTurn = 1
    }
    try {
      core.apply(G, by, body)
    } catch (e) {
      throw new Error(`${where}: apply(G, ${by}, ${JSON.stringify(body)}) threw: ${e.stack}`)
    }
    log.push([by, body])
    counts.commands[body.t] = (counts.commands[body.t] ?? 0) + 1
  }
  invariants(core, G, `${where0} at its end`, last)
  take(`${where0} at its end`)
  counts.mirrored = tap.counts()
  counts.ended = result(G, where0, conceded)
  // one game.over, saying what G.turn.result says, the score, and the
  // rounds played, the one under way counted: as many as were scored, and
  // one more for a battle that began and ended mid-round (a wipe-out ends
  // at a phase's end; a concession comes at a decision, which no round's
  // score is), none in the deployment
  const [over, ...more] = seen.over
  const T = G.turn
  const rounds = seen.scored + (seen.battle && T.result.why !== 'score' ? 1 : 0)
  if (!over || more.length) throw new Error(`${where0}: ${seen.over.length} game.over events`)
  if (over.win !== T.result.win || over.why !== T.result.why || over.vp.join() !== T.vp.join() || over.rounds !== rounds) {
    throw new Error(`${where0}: game.over ${JSON.stringify(over)} should say ${JSON.stringify({ ...T.result, vp: T.vp, rounds })} (${seen.scored} rounds scored)`)
  }
  const trace = h10(G.journal.trace.join('\n'))
  if (log.length) {
    refold(core, setup, log, trace, where0)
    counts.refolded = 1
  }
  return { counts, setup, log, trace }
}

// A log folded as parity --core and the Folder (R8) fold one: sim/run.mjs
// foldJob, each entry held to the decision it answers (a concession out of
// band), strict. It must play to the end and write `trace` (a hash).
function refold(core, setup, log, trace, where) {
  const f = foldJob(core, { setup, entries: log.map(([s, b]) => ({ s, ...b })) }, { strict: true })
  if (f.error) throw new Error(`${where}: its log, folded by sim/run.mjs foldJob, stops: ${f.error.split('\n')[0]}`)
  const t = h10(f.trace.join('\n'))
  if (t !== trace) throw new Error(`${where}: its log, folded by sim/run.mjs foldJob, traces ${t}, not ${trace} as played`)
}

// 7. A concession out of band, in a hotseat match: the seat the match isn't
// waiting on gives up, once in the deployment (seat 0, having sent
// `deployed`, while seat 1 still deploys) and once at the first phase
// decision (the seat whose turn it isn't). Its game.over says 0 rounds
// played in the deployment, 1 in the battle's first round.
function offTurnTask(core) {
  const setup = { board: 4242, dice: 99, seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }] }
  const leads = { 'in the deployment': [[0, { t: 'deployed' }]], 'at the first phase decision': [[0, { t: 'deployed' }], [1, { t: 'deployed' }]] }
  for (const [k, [when, lead]] of Object.entries(leads).entries()) {
    const where = `a hotseat concession out of band ${when}`
    const G = core.createMatch(setup, { out: [], strict: true })
    for (const [s, b] of lead) core.apply(G, s, b)
    const idle = [0, 1].find((s) => !core.pendingSeats(G).includes(s))
    if (idle === undefined) throw new Error(`${where}: the match waits on both seats (${JSON.stringify(G.pending)})`)
    const why = core.legal(G, idle, { t: 'concede' })
    if (why !== null) throw new Error(`${where}: legal() refuses seat ${idle}'s concession: ${why}`)
    if (core.legal(G, idle, { t: 'end' }) === null || core.legal(G, idle, { t: 'deployed' }) === null) throw new Error(`${where}: legal() lets seat ${idle}, which the match isn't waiting on, answer the decision`)
    core.apply(G, idle, { t: 'concede' })
    result(G, where, idle)
    // the rounds played: none in the deployment, the first under way
    const over = G.out.filter((e) => e.t === 'game.over')
    if (over.length !== 1 || over[0].win !== 1 - idle || over[0].why !== 'concede' || over[0].rounds !== k) throw new Error(`${where}: game.over ${JSON.stringify(over)}, not one saying seat ${1 - idle} wins by a concession after ${k} rounds`)
    refold(core, setup, [...lead, [idle, { t: 'concede' }]], h10(G.journal.trace.join('\n')), where)
  }
}

// 8. Setups the rules can't play, and G's shape.
const SETUP = { board: 4242, dice: 99, seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }] }
const BAD_SETUPS = {
  'no rounds': { rounds: 0 },
  'a hundred rounds': { rounds: 100 },
  'a million rounds': { rounds: 1e6 },
  'half a round': { rounds: 2.5 },
  'rounds as text': { rounds: '5' },
  'a board below 0': { board: -1 },
  'a board past 2^32 - 1': { board: 2 ** 32 },
  'dice that are no whole number': { dice: 1.5 },
  "F4's overtime vote": { overtime: 'vote' },
  'dice of its own per seat': { diceMode: 'own' },
  'no seats': { seats: null },
  'three seats': { seats: [...SETUP.seats, { race: 'squirrel', ctrl: 'ai' }] },
  'an unknown race': { seats: [{ race: 'dragon', ctrl: 'ai' }, SETUP.seats[1]] },
  'an unknown controller': { seats: [SETUP.seats[0], { race: 'serpent', ctrl: 'robot' }] },
}
function setupTask(core) {
  for (const [name, change] of Object.entries(BAD_SETUPS)) {
    const setup = { ...SETUP, ...change }
    let G = null
    try {
      G = core.createMatch(setup)
    } catch (e) {
      if (e instanceof TypeError || e instanceof RangeError) throw new Error(`createMatch crashes on a setup with ${name} instead of refusing it: ${e.message}`)
    }
    if (G) throw new Error(`createMatch takes a setup with ${name}: ${JSON.stringify(setup)}`)
  }
  // the edges (human seats, so each stops at its deployment)
  for (const [change, rounds] of [[{ rounds: 1 }, 1], [{ rounds: 99 }, 99], [{ rounds: null }, 5], [{ board: 0, dice: 2 ** 32 - 1 }, 5]]) {
    const G = core.createMatch({ ...SETUP, ...change })
    if (G.setup.rounds !== rounds || core.pendingSeats(G).join() !== '0,1') throw new Error(`createMatch on ${JSON.stringify(change)}: ${G.setup.rounds} rounds, waiting on ${JSON.stringify(G.pending)}`)
  }
  // G's shape, at every trace line of an all-AI battle
  let lines = 0
  const shape = (line, G) => {
    lines++
    if (!Object.hasOwn(G, 'pending') || G.pending !== null) throw new Error(`an all-AI battle's G has pending ${JSON.stringify(G.pending)} (${Object.hasOwn(G, 'pending') ? 'not null' : 'missing'}) at trace line ${lines}, "${line.slice(0, 40)}"`)
    if (typeof G.strict !== 'boolean') throw new Error(`G.strict is ${G.strict}, not a boolean, at trace line ${lines}`)
  }
  const G = core.createMatch({ ...SETUP, seats: SETUP.seats.map((x) => ({ ...x, ctrl: 'ai' })) }, { onTrace: shape })
  if (G.turn.stage !== 'over' || !lines) throw new Error(`the all-AI battle stopped at stage ${G.turn.stage} after ${lines} trace lines`)
  return Object.keys(BAD_SETUPS).length
}

// Two games' logs played interleaved in one process, command by command:
// each must trace exactly as it did alone, in its own process (its trace's
// hash), and as it does alone here, before the interleaving.
function interleave(core, A, B) {
  const solo = (X) => {
    const g = core.createMatch(X.setup, { out: null })
    for (const [s, b] of X.log) core.apply(g, s, b)
    return h10(g.journal.trace.join('\n'))
  }
  const alone = [solo(A), solo(B)]
  const ga = core.createMatch(A.setup, { out: null })
  const gb = core.createMatch(B.setup, { out: null })
  for (let i = 0; i < Math.max(A.log.length, B.log.length); i++) {
    if (i < A.log.length) core.apply(ga, ...A.log[i])
    if (i < B.log.length) core.apply(gb, ...B.log[i])
  }
  for (const [g, X, k, name] of [[ga, A, 0, 'first'], [gb, B, 1, 'second']]) {
    const t = h10(g.journal.trace.join('\n'))
    if (t !== X.trace || alone[k] !== X.trace) throw new Error(`rule 13: the ${name} game traced ${t} interleaved with another and ${alone[k]} alone in the same process, not ${X.trace} as in its own`)
  }
}

if (a.child) {
  const task = JSON.parse(readFileSync(0, 'utf8'))
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const rng = await import(pathToFileURL(join(dir, 'core', 'rng.js')).href)
  const { RACES } = await import(pathToFileURL(join(dir, 'data', 'schema.js')).href)
  const mirror = await import(pathToFileURL(join(dir, 'present', 'mirror.js')).href)
  let out
  try {
    if (task.kind === 'corpus') {
      const it = loadCorpus().items.find((x) => x.id === task.id)
      out = { ok: true, counts: corpusTask(core, rng, mirror, it) }
    } else if (task.kind === 'random') {
      const r = randomTask(core, rng, mirror, Object.keys(RACES), task.seed)
      out = { ok: true, counts: r.counts, game: { setup: r.setup, log: r.log, trace: r.trace } }
    } else if (task.kind === 'interleave') {
      const [A, B] = task.games
      interleave(core, A, B)
      out = { ok: true, counts: { interleaved: 2 } }
    } else if (task.kind === 'offturn') {
      offTurnTask(core)
      out = { ok: true, counts: { offTurn: 2 } }
    } else if (task.kind === 'setups') {
      out = { ok: true, counts: { refused: setupTask(core) } }
    }
  } catch (e) {
    out = { ok: false, error: String(e?.message ?? e) }
  }
  process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

// ── The run ─────────────────────────────────────────────────────────────────
const ME = fileURLToPath(import.meta.url)
function child(task, pkg) {
  return new Promise((done) => {
    const p = spawn(process.execPath, [ME, '--child', '--dir', pkg], { stdio: ['pipe', 'pipe', 'pipe'] })
    let out = '', err = ''
    p.stdout.setEncoding('utf8')
    p.stderr.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => {
      try {
        done(JSON.parse(out))
      } catch {
        done({ ok: false, error: `the child crashed: ${err.trim().split('\n').slice(0, 4).join(' / ') || out.slice(0, 200)}` })
      }
    })
    p.stdin.end(JSON.stringify(task))
  })
}

async function run(pkg, { games, seed, only, quiet = false, coverage = true }) {
  const say = quiet ? () => {} : (s) => console.log(s)
  const { items: all } = loadCorpus()
  const items = only === 'none' ? [] : select(all, only)
  const tasks = [...items.map((it) => ({ kind: 'corpus', id: it.id })), ...Array.from({ length: games }, (_, i) => ({ kind: 'random', seed: seed + i }))]
  const t0 = Date.now()
  const res = await pool(tasks, CPUS, async (t) => {
    const r = await child(t, pkg)
    say(`  ${t.kind === 'corpus' ? `${t.id.padEnd(24)}` : `game ${String(t.seed).padEnd(19)}`} ${r.ok ? `ok   ${t.kind === 'corpus' ? `${r.counts.probes} decisions probed` : `${r.counts.ended}, ${r.counts.probes} decisions, ${Object.entries(r.counts.commands).map(([k, n]) => `${k} ${n}`).join(', ')}`}` : `FAIL ${r.error}`}`)
    return r
  })
  const bad = res.filter((r) => !r.ok)
  // rule 13: two random games with human seats, interleaved
  const humanGames = res.filter((r, i) => r.ok && tasks[i].kind === 'random' && r.game.log.length)
  if (humanGames.length >= 2) {
    const r = await child({ kind: 'interleave', games: [humanGames[0].game, humanGames[1].game] }, pkg)
    say(`  two games interleaved in one process: ${r.ok ? 'ok   each traced as alone' : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  } else if (games >= 2) bad.push({ error: 'rule 13 unchecked: fewer than two random games with a human seat' })
  // 7. a concession out of band, whatever the seed
  {
    const r = await child({ kind: 'offturn' }, pkg)
    say(`  a hotseat concession out of band: ${r.ok ? 'ok   in the deployment and in the battle, folded the same' : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // 8. setups the rules can't play, and G's shape
  {
    const r = await child({ kind: 'setups' }, pkg)
    say(`  setups and G's shape: ${r.ok ? `ok   ${r.counts.refused} bad setups refused, the edges taken, pending null through an all-AI battle` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // what the random games reached, over the whole run
  const reached = { score: 0, wipe: 0, concede: 0, offTurn: 0, chargeEnd: 0, auto: 0, place: 0 }
  for (const r of res) {
    if (!r.ok || !r.game) continue
    reached[r.counts.ended]++
    reached.offTurn += r.counts.offTurn ?? 0
    for (const k of ['chargeEnd', 'auto', 'place']) reached[k] += r.counts.commands[k] ?? 0
  }
  const probes = res.reduce((s, r) => s + (r.counts?.probes ?? 0), 0)
  const quietly = res.reduce((s, r) => s + (r.counts?.quiet ?? 0), 0)
  const refolded = res.reduce((s, r) => s + (r.counts?.refolded ?? 0), 0)
  const mirrored = res.reduce((s, r) => [s[0] + (r.counts?.mirrored?.acts ?? 0), s[1] + (r.counts?.mirrored?.stops ?? 0)], [0, 0])
  if (coverage && games >= 8) {
    const never = Object.entries(reached).filter(([, n]) => !n).map(([k]) => k)
    if (never.length) bad.push({ error: `the random games never reached: ${never.join(', ')} (more --games?)` })
  }
  say(`\n${items.length} corpus battles and ${games} random games (${Object.entries(reached).map(([k, n]) => `${k} ${n}`).join(', ')}), ${probes} decisions probed, every AI command held to legal(), ${refolded} random games' logs folded by foldJob the same, ${quietly} corpus battles folded quietly as well, the match's events held to the mirror at ${mirrored[0]} acts and ${mirrored[1]} stops (${Math.round((Date.now() - t0) / 1000)} s)`)
  return bad
}

// ── The self-test ───────────────────────────────────────────────────────────
// Each a broken copy of the working tree's core; P-prop must fail on each.
// Only a check of P-prop's own can catch most of them: parity sees none of
// `preview-draws`, `concede-crash`, `concede-in-band` (no corpus battle
// reaches them), `score-silent`, `legal-emits`, `over-rounds` (no such
// event is recorded), `extra-field` (no log carries one), `pending-unset`
// (nothing reads the missing key: (8) alone) or `rounds-unbounded` (every
// battle recorded lasts 5 rounds).
const MUTATIONS = {
  // a preview the fold never runs draws a die (a tool's nearest valid end)
  'preview-draws': ['core/actions/move.js', 'export function nearestValid(G, plan, x, z, within = 2.4) {\n', 'export function nearestValid(G, plan, x, z, within = 2.4) {\n  roll(G, 1)\n'],
  // asking leaves a mark on the match
  'legal-mutates': ['core/commands.js', 'function mayAdvance(G, u) {\n', 'function mayAdvance(G, u) {\n  u.flags.asked = true\n'],
  // asking emits an event, which the view would play as if it had happened
  'legal-emits': ['core/commands.js', 'function mayAdvance(G, u) {\n', "function mayAdvance(G, u) {\n  emit(G, 'focus', { x: u.pos.x, z: u.pos.z })\n"],
  // the AI advances a unit its player already advanced (the double advance
  // fixed in 33946a4)
  'ai-illegal': ['core/ai/policy.js', 'if (advance && !u.flags.advanced) {', 'if (advance) {'],
  // only the seat the match waits on may concede (§2.2: out of band)
  'concede-in-band': ['core/commands.js', '  return rule.ok(G, seat, body)\n}', '  return P?.seats.includes(seat) ? rule.ok(G, seat, body) : `seat ${seat} has no decision to make now`\n}'],
  // a concession crashes the engine
  'concede-crash': ['core/engine.js', "const win = conceded >= 0 ? 1 - conceded :", 'const win = conceded >= 0 ? 1 - conceded.seat.x :'],
  // a quiet fold (G.out null) walks a wrecker without smashing anything: the
  // smash is skipped with the events nobody keeps
  'quiet-smash': ['core/actions/move.js', 'if (smashAround(G, u, p, ev) && ev)', 'if (ev && smashAround(G, u, p, ev))'],
  // a command's handler leaves the nav grid stale
  'nav-dirty': ['core/actions/move.js', '  // (the nav follows the walk, at today\'s site: DESIGN §4.1 rule 9)\n  refreshNav(G)\n}', '  G.terrain.dirty = true\n}'],
  // the engine scores a round without telling the view (nothing parity
  // records: the score's events are the view's alone)
  'score-silent': ['core/engine.js', "  emit(G, 'round.scored', { round: T.round, held: [...held], vp: [...T.vp], owners })\n", ''],
  // game.over counts the deployment as round 1 played (the turn's round
  // says 1 from the start)
  'over-rounds': ['core/engine.js', "const rounds = T.stage === 'deploy' ? 0 : T.round\n", 'const rounds = T.round\n'],
  // legal() lets a body carry a field its kind doesn't take
  'extra-field': ['core/commands.js', "  for (const k of Object.keys(body)) if (k !== 't' && !rule.fields.includes(k)) return `${body.t} takes no field \"${k}\"`\n", ''],
  // newState's G leaves `pending` out (§2.1), so an all-AI battle runs with
  // it missing until the end
  'pending-unset': ['core/match.js', '    pending: null,\n', ''],
  // fullSetup takes any number of rounds, so createMatch plays an all-AI
  // battle for as long as a typo asks
  'rounds-unbounded': ['core/index.js', ' || s.rounds > MAX_ROUNDS', ''],
}

if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-prop-${process.pid}`)
  const load = { games: 10, seed: 1, only: 'hotseat-late-8,bushtail-random-6,64-89', quiet: true, coverage: false }
  const clean = await run(copyCode(dir, join(work, 'unbroken')), load)
  if (clean.length) {
    console.log(`property self-test: the unbroken copy fails the same workload, so no mutation can be judged: ${clean[0].error}`)
    rmSync(work, { recursive: true, force: true })
    process.exit(1)
  }
  console.log('  unbroken       passes (three corpus battles, ten games)')
  let missed = 0
  for (const [name, [file, from, to]] of Object.entries(MUTATIONS)) {
    const pkg = copyCode(dir, join(work, name))
    const f = join(pkg, file)
    const src = readFileSync(f, 'utf8')
    if (src.split(from).length !== 2) {
      console.log(`  ${name.padEnd(14)} STALE: "${from.trim().slice(0, 50)}" isn't in ${file} exactly once`)
      missed++
      continue
    }
    writeFileSync(f, src.replace(from, to))
    const bad = await run(pkg, load)
    console.log(`  ${name.padEnd(14)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
  }
  rmSync(work, { recursive: true, force: true })
  console.log(missed ? `\nproperty self-test FAILED: ${missed} mutation(s) missed or stale` : `\nproperty self-test passed: all ${Object.keys(MUTATIONS).length} mutations caught`)
  process.exit(missed ? 1 : 0)
}

console.log(`property: the pure core of ${dir === PKG ? 'the working tree' : dir}`)
const bad = await run(dir, { games: GAMES, seed: SEED, only: a.only })
for (const b of bad) if (!b.id) console.log(`  FAIL ${b.error}`)
console.log(bad.length ? `\nproperty FAILED: ${bad.length} problem(s)` : '\nproperty passed: asking never rolls or changes the match, the AI never plays an illegal command, random legal play never throws, two matches never touch, a quiet fold plays the same battle, the events show the match, and a setup the rules can\'t play is refused')
process.exit(bad.length ? 1 : 0)
