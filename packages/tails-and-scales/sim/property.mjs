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
//    logs exactly. (R8) The match's fingerprint, stateHash (and the string
//    it hashes, shadowState), is read alike twice and changes nothing. The
//    lock itself: a draw while locked throws, and legal() and preview()
//    leave the lock as they found it.
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
//    state line as its presented fold, and (R8) the same stateHash before
//    every entry: the `h` a peer catching up quietly checks is the one an
//    author took from a presented fold. (From R8 every corpus fold here,
//    the refolds of (3) and (7) too, goes through the Folder, every entry
//    an envelope, as parity's does: sim/run.mjs foldJob; (R8b) and each of
//    them must say so, `via: 'folder'`, for code that has a Folder: the
//    presented fold, the quiet one and every refold, the Folder's match
//    the one traced, its start and every entry accepted.)
// 6. The match's own events show the match (§2.4's mirror, for the engine's
//    stream: P-present held only main.js's loop before R6b, and plays the
//    Session since). Every corpus battle and random game folds its events,
//    the engine's flow events and the AI's included, into a mirror
//    (present/mirror.js, sim/run.mjs mirrorTap) from the table before the
//    first one, which must equal project(G) at every `act`, at every
//    decision and at the end.
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
// 9. The Session (R6b: match/session.js over match/store.js's LocalStore,
//    which every mode plays through) folds a log as the core does. Each
//    corpus battle is played again through one, the human logs' entries
//    sent with submit() for their seats as the UI sends them (the Session's
//    legal() must take each, decisionFor() must name the first seat played
//    here that the match waits on), beside a spectator Session (no seat)
//    on the same store: both must write the trace foldJob wrote, end over,
//    refuse nothing, hand the sink every event (after the start and after
//    each entry, exactly the batch the same log folded straight through the
//    core leaves in G.out then: none dropped, added or reordered, the
//    `pending` ones included; one act per act line), and leave G.out empty
//    after each entry. A body the match refuses (and, for
//    the spectator, any body) is refused before anything is appended, and
//    submit() throws on it. The log then replayed: a fresh Session over a
//    store holding the whole log, with a junk entry slipped in before each
//    of three (a body with a stray field, the seat not waited on, a second
//    start), must refuse exactly those, record why, and play the same
//    battle. (R8) The Session writes envelopes through its Folder: the
//    start carries CORE_VERSION and RULES_ID from this device, each entry
//    this device, the seat's head as prev and the match's hash exactly where
//    §0.2 #3 says (on a phase's command and a charge's end, never in the
//    deployment: the spec's kinds, not the code's SIMULTANEOUS), its body
//    the command sent; both Sessions accept
//    the start and every entry, agree on the hash at the end, and the log
//    as exported (its texts) replays to the same battle, refusing nothing;
//    the junk is envelopes with ids of their own (a copied id would only
//    be a duplicate, which the Folder refuses as such), and one text right
//    after the start: a start whose setup holds 1e999 (Infinity once
//    parsed), which decode refuses instead of throwing. (R8b) And three
//    rules of the Folder's at the Session, over replays of the log: an
//    entry answering one seat's decision with no hash freezes the match
//    there (a desync by the hash), never played; after the end, a hashed
//    End on the final head is inert from a spectator's device and freezes
//    the match from the seat's own; a start under an older or a newer
//    CORE_VERSION opens read-only. (Code older than R8, whose Session has
//    no Folder, skips this rule.)
// 10. The end screen after a snap past the end (R7b: present/hud-model.js
//    resultOf, which the table shows when the game.over it never played was
//    dropped by the snap) says what the match's own game.over said. At the
//    end of every corpus battle (the same log folded straight through the
//    core, 9), every random game and both concessions out of band (7, the
//    one in the deployment included), resultOf(G) must be exactly that
//    event's win, why, score and rounds. (Code without present/hud-model.js
//    skips it.)
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
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, select, verdict, pool, CPUS, copyCode, h10 } from './lib.mjs'
import { foldJob, shadowPartsG, mirrorTap, jobSetup, loadMatch, seatDevices } from './run.mjs'
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
    // (F4) the round limit's say, either way (legal only there)
    out.push({ t: 'vote', more: true }, { t: 'vote', more: false })
    // (F10b) pilot masks (bit j: the seat's j-th unit in G.units order):
    // every standing unit, one, a random few; and what P-pilot requires
    // refused: a dead unit named, a bit past the seat's last unit, a mask
    // of nobody able to act (found when there is one), no units, a negative
    // or unsafe number
    {
      const bit = (j) => 2 ** j
      const up = mine.flatMap((u, j) => (q.alive(u) ? [j] : []))
      const mask = (js) => js.reduce((m, j) => m + bit(j), 0)
      if (up.length) out.push({ t: 'pilot', m: mask(up) }, { t: 'pilot', m: bit(up[Math.floor(rand() * up.length)]) }, { t: 'pilot', m: mask(some(up, 1 + Math.floor(rand() * up.length))) })
      const dead = mine.findIndex((u) => !q.alive(u))
      if (dead >= 0) out.push({ t: 'pilot', m: bit(dead) + (up.length ? bit(up[0]) : 0) })
      const idle = up.filter((j) => !q.canAct(G, mine[j]))
      if (idle.length) out.push({ t: 'pilot', m: mask(idle) })
      // (and masks past 32 bits, which only exact division reads right: a
      // bitwise maskUnits drops their high bits and names a unit)
      out.push({ t: 'pilot', m: 2 ** 32 + 1 }, { t: 'pilot', m: 2 ** 40 + 3 }, { t: 'pilot', m: 2 ** 52 + 1 })
      out.push({ t: 'pilot', m: bit(mine.length) + 1 }, { t: 'pilot', m: 0 }, { t: 'pilot', m: -1 }, { t: 'pilot', m: 2 ** 53 }, { t: 'pilot', m: 1.5 }, { t: 'pilot' }, { t: 'pilot', m: 1, u: mine[0].id })
    }
    // what the labels and flags would show
    q.statusOf(G), q.ownersOf(G), q.anyCanAct(G, seat), q.phaseKey(G)
    // junk: no such command, the AI's own hold, a vote that says neither
    // yes nor no (a number, a string, nothing), fractions, strings, missing
    // fields, an Object.prototype name, no body at all; and fields the kind
    // doesn't take (a fraction, a nested object, the seat, a field of another
    // kind), which no body may carry into a log
    const u0 = mine[0].id
    out.push({ t: 'nope' }, { t: 'hold', u: u0 }, { t: 'vote', more: 1 }, { t: 'vote', more: 'yes' }, { t: 'vote' }, { t: 'vote', more: true, u: u0 }, { t: 'move', u: u0 + 0.5, c: 0 }, { t: 'move', u: String(u0), c: 0 },
      { t: 'shoot', u: u0 }, { t: 'toString' }, { t: '__proto__' }, { t: 'place', u: 999, c: 0 }, { t: 'move', u: u0, c: -7 }, { t: 'move', u: u0, c: nav.N },
      { t: 'end', junk: 0.5 }, { t: 'auto', extra: { nested: [1.5] } }, { t: 'deployed', s: seat }, { t: 'concede', u: u0 }, ...JUNK)
    for (const b of out.slice()) if (b.t === 'move' || b.t === 'place') out.push({ ...b, tg: u0 })
    return out
  })
}

// (F10b) the seat's units outside mask m, each as what a pilot must leave
// alone: what it has done this turn (a unit the AI plays moves, shoots or
// charges, and marks its flag; where it stands is no measure: one hit by a
// piloted blast's friendly fire closes ranks, which isn't playing it)
function actorsOutside(core, G, seat, m) {
  const named = new Set(G.units.filter((u) => u.side === seat).filter((u, j) => Math.floor(m / 2 ** j) % 2).map((u) => u.id))
  const f = (u) => ['moved', 'advanced', 'advRoll', 'fellBack', 'shot', 'charged', 'chargeTried', 'chargeTarget', 'fought'].map((k) => `${k}=${u.flags[k] ?? ''}`).join(',')
  return G.units.filter((u) => u.side === seat && !named.has(u.id)).map((u) => `${u.id} ${f(u)}`)
}

// bodies with a field their kind doesn't take, each of them refused
const JUNK = [{ t: 'end', c: 0 }, { t: 'chargeEnd', c: -1, u: 0 }, { t: 'shoot', u: 0, tg: 1, c: 0 }]
const KEYS = { place: ['u', 'c'], deployed: [], advance: ['u'], move: ['u', 'c'], shoot: ['u', 'tg'], charge: ['u', 'tg'], chargeEnd: ['c'], end: [], auto: [], pilot: ['m'], vote: ['more'], concede: [] }

// Judge the battery for `seat` (and some for the other seat and seats that
// don't exist); every verdict must leave the match exactly as it was.
// Returns the bodies legal for `seat`.
function probe(core, G, seat, rand, where) {
  const before = fingerprint(core, G)
  const cands = battery(core, G, seat, rand)
  if (fingerprint(core, G) !== before) throw new Error(`${where}: the previews changed the match`)
  // (R8) the match's fingerprint, which every entry for one seat carries, is
  // read alike twice and changes nothing (nor does the string it hashes)
  if (core.stateHash) {
    const h = core.stateHash(G)
    core.shadowState(G)
    if (core.stateHash(G) !== h || fingerprint(core, G) !== before) throw new Error(`${where}: stateHash() or shadowState() changed the match`)
  }
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
  if (ok.some((b) => b.t === 'hold' || b.t === 'nope')) throw new Error(`${where}: legal() accepted a command no seat may send: ${JSON.stringify(ok.find((b) => ['hold', 'nope'].includes(b.t)))}`)
  // (F4) a vote answers the round limit and nothing else, and at the round
  // limit nothing but a vote (or a concession) is taken
  if (G.pending?.k !== 'roundLimit' && ok.some((b) => b.t === 'vote')) throw new Error(`${where}: legal() accepted a vote with no round-limit vote open (${JSON.stringify(G.pending)})`)
  if (G.pending?.k === 'roundLimit' && ok.some((b) => b.t !== 'vote' && b.t !== 'concede')) throw new Error(`${where}: legal() accepted ${JSON.stringify(ok.find((b) => b.t !== 'vote' && b.t !== 'concede'))} at the round limit`)
  // and a vote says yes or no: a number, a string or nothing is junk
  const vague = ok.find((b) => b.t === 'vote' && typeof b.more !== 'boolean')
  if (vague) throw new Error(`${where}: legal() accepted a vote that says neither yes nor no: ${JSON.stringify(vague)}`)
  // a body carries its kind's fields and nothing else (§4.1 rule 12)
  const extra = ok.find((b) => Object.keys(b).some((k) => k !== 't' && !KEYS[b.t]?.includes(k)))
  if (extra) throw new Error(`${where}: legal() accepted a body with a field its kind doesn't take: ${JSON.stringify(extra)}`)
  // (F10b, P-pilot) a pilot names standing units of the seat's, one at
  // least able to act in this phase, in a phase of its own
  // (the mask decoded here, not by the core's own maskUnits, which a fault
  // there would excuse)
  for (const b of ok.filter((b) => b.t === 'pilot')) {
    const seats = G.units.filter((u) => u.side === seat)
    const units = Number.isSafeInteger(b.m) && b.m >= 1 && b.m < 2 ** seats.length ? seats.filter((u, j) => Math.floor(b.m / 2 ** j) % 2) : null
    if (!units) throw new Error(`${where}: legal() accepted a pilot whose mask names no set of seat ${seat}'s units: ${JSON.stringify(b)}`)
    if (units.some((u) => !core.q.alive(u))) throw new Error(`${where}: legal() accepted a pilot naming a destroyed unit: ${JSON.stringify(b)}`)
    if (!units.some((u) => core.q.canAct(G, u))) throw new Error(`${where}: legal() accepted a pilot none of whose units can act: ${JSON.stringify(b)}`)
    if (G.pending?.k !== 'phase') throw new Error(`${where}: legal() accepted a pilot outside a phase (${JSON.stringify(G.pending)})`)
  }
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
function corpusTask(core, rng, mirror, it, match, hud) {
  const rand = mulberry32(it.id.length * 7919 + 17)
  const counts = { probes: 0, aiStrict: 1 }
  // (R8) the match's hash before each entry, presented and quiet
  const hashes = [[], []]
  const r = foldJob(core, it.job, {
    strict: true,
    mirror,
    match: match?.folding,
    before: (G, e, k) => {
      if (core.stateHash) hashes[0].push(core.stateHash(G))
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
  // 5. the same battle folded quietly (and, R8, the same hash before every
  // entry: a peer catching up quietly checks the `h` an author took from a
  // presented fold)
  const quiet = foldJob(core, it.job, { quiet: true, match: match?.folding, before: (G) => core.stateHash && hashes[1].push(core.stateHash(G)) })
  if (quiet.error) throw new Error(`${it.id}: folded quietly (G.out null) it stops: ${quiet.error.split('\n')[0]}`)
  const first = (x, y) => {
    for (let i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) return i
    return -1
  }
  const line = first(quiet.trace, r.trace), snap = first(quiet.shadow, r.shadow)
  if (line >= 0 || snap >= 0) throw new Error(`${it.id}: folded quietly (G.out null) it plays another battle: trace line ${line + 1}, shadow ${snap + 1} (${(quiet.trace[line] ?? r.trace[line] ?? '').slice(0, 80)})`)
  const hash = first(hashes[1], hashes[0])
  if (hash >= 0) throw new Error(`${it.id}: folded quietly (G.out null) its stateHash before entry ${hash} is ${hashes[1][hash]}, not ${hashes[0][hash]} as presented`)
  // (R8b) both folds through the Folder of code that has one: its match the
  // one traced, the start and every entry accepted ('bypassed' otherwise)
  for (const [x, how] of [[r, 'presented'], [quiet, 'quiet']]) {
    if (match?.folding && x.via !== 'folder') throw new Error(`${it.id}: its ${how} fold went ${x.via === 'core' ? 'straight through the core' : 'past the Folder (it took fewer entries than were played, or another match)'}, not through the Folder`)
  }
  counts.quiet = 1
  counts.hashed = hashes[0].length
  counts.mirrored = r.mirrored
  // 9. through the Session (code from R6b on)
  // (9 needs R8's Session, which writes envelopes through a Folder: older
  // code skips it, and holds resultOf (10) to the log folded straight)
  if (match?.folding) Object.assign(counts, sessionTask(core, match, it, r.trace, hud))
  else if (hud) {
    const { direct, overs } = straight(core, it, it.id)
    counts.results = sameResult(hud, direct, overs[0], it.id)
  }
  return counts
}

// 9. A corpus battle through the Session (match/'s modules, `M`), against
// the trace foldJob wrote for it (`trace`, its lines) and the events the
// same log leaves in G.out folded straight through the core; and (10) the
// HUD model's resultOf against that fold's game.over. (R8) The Session
// writes envelopes and folds them through its Folder: the log's start
// names this device on each human seat, and the replay's junk is
// envelopes too (each with an id of its own, or it would only be a
// duplicate: the Folder refuses a second entry with an id it has seen).
// (§0.2 #3: the decisions an entry answering carries `h` on, by kind)
const HASHED = ['phase', 'chargeEnd']
function sessionTask(core, M, it, trace, hud) {
  const setup = jobSetup(it.job), entries = it.job.entries ?? []
  const humans = setup.seats.flatMap((x, i) => (x.ctrl === 'human' ? [i] : []))
  const where = `${it.id} through the Session`
  const { direct, stream, overs } = straight(core, it, where)
  const results = sameResult(hud, direct, overs[0], where)
  const store = new M.LocalStore()
  const lines = [], seen = { batches: [], acts: 0 }
  const sink = {
    events(events, ses) {
      if (ses.G.out.length) throw new Error(`${where}: the Session handed the sink its events and left ${ses.G.out.length} in G.out`)
      seen.batches.push(events.map((e) => JSON.stringify(e)))
      seen.acts += events.filter((e) => e.t === 'act').length
    },
    reset() {
      throw new Error(`${where}: a log that only grows at its end was folded again (sink.reset)`)
    },
  }
  const dev = 'here'
  const ses = new M.Session({ store, localSeats: humans, dev, sink, onTrace: (l) => lines.push(l) })
  const watcher = new M.Session({ store, localSeats: [], dev: 'there' })
  if (ses.G !== null || ses.status !== 'lobby') throw new Error(`${where}: a Session over an empty store has a match (${ses.status})`)
  ses.start(seatDevices(setup, dev))
  if (ses.status !== 'live' && ses.status !== 'over') throw new Error(`${where}: the start is refused: ${ses.error}`)
  const start = store.entries()[0]
  if (start.t !== 'start' || start.core !== core.CORE_VERSION || start.rules !== core.RULES_ID || start.d !== dev || start.s !== -1) throw new Error(`${where}: the start entry is ${JSON.stringify(start)}`)
  for (const [k, e] of entries.entries()) {
    const at = `${where}, entry ${k} ${JSON.stringify(e)}`
    const { s, ...body } = e
    const want = ses.G.pending?.seats.find((x) => humans.includes(x)) ?? -1
    if (ses.decisionFor() !== want) throw new Error(`${at}: decisionFor() says ${ses.decisionFor()}, not ${want}`)
    if (watcher.decisionFor() !== -1 || watcher.legal(s, body) === null) throw new Error(`${at}: a spectator Session may send it`)
    const n = store.entries().length
    const junk = { t: 'move', u: 999, c: -1 }
    if (ses.legal(s, junk) === null) throw new Error(`${at}: the Session takes ${JSON.stringify(junk)}`)
    let threw = false
    try {
      ses.submit(s, junk)
    } catch {
      threw = true
    }
    if (!threw || store.entries().length !== n) throw new Error(`${at}: submit() of a body the match refuses ${threw ? 'appended it' : "didn't throw"}`)
    const why = ses.legal(s, body)
    if (why !== null) throw new Error(`${at}: the Session refuses the corpus's own entry: ${why}`)
    // the envelope it writes: this device, the seat's head, the hash where
    // one seat is waited on and none on a simultaneous decision
    const head = ses.folder.head(s), one = HASHED.includes(ses.G.pending.k), h = core.stateHash(ses.G)
    ses.submit(s, body)
    const env = store.entries().at(-1)
    if (env.bad || env.d !== dev || env.s !== s || env.p !== head || env.h !== (one ? h : undefined) || core.canonicalJSON(M.bodyOf(env)) !== core.canonicalJSON(body)) {
      throw new Error(`${at}: the Session wrote ${JSON.stringify(env)} (head ${head}, hash ${one ? h : 'none'})`)
    }
  }
  const same = (got, name) => {
    if (got.join('\n') !== trace.join('\n')) {
      const i = got.findIndex((l, j) => l !== trace[j])
      throw new Error(`${where}: ${name} traces another battle from line ${i + 1}: ${(got[i] ?? '(ended)').slice(0, 80)}`)
    }
  }
  same(lines, 'the Session')
  same(watcher.G.journal.trace, 'the spectator Session')
  for (const [x, name] of [[ses, 'the Session'], [watcher, 'the spectator Session']]) {
    if (x.status !== 'over' || x.rejected.length || x.accepted.length !== entries.length + 1) throw new Error(`${where}: ${name} ends ${x.status}, having accepted ${x.accepted.length} and refused ${JSON.stringify(x.rejected)}`)
  }
  if (core.stateHash(watcher.G) !== core.stateHash(ses.G)) throw new Error(`${where}: the spectator Session's match hashes apart from the player's`)
  const actLines = trace.filter((l) => /^act /.test(l)).length
  if (seen.acts !== actLines) throw new Error(`${where}: the sink got ${seen.acts} act events for ${actLines} act lines`)
  // every event, batch by batch, as the core left them
  if (seen.batches.length !== stream.length) throw new Error(`${where}: the sink was handed ${seen.batches.length} batches of events for the start and ${entries.length} entries`)
  for (const [k, batch] of stream.entries()) {
    const got = seen.batches[k], n = Math.max(batch.length, got.length)
    let i = 0
    while (i < n && got[i] === batch[i]) i++
    if (i < n) throw new Error(`${where}: after ${k ? `entry ${k - 1}` : 'the start'} the sink got ${got.length} events where the core left ${batch.length}, apart from event ${i + 1}: ${(got[i] ?? '(none)').slice(0, 60)} for ${(batch[i] ?? '(none)').slice(0, 60)}`)
  }
  // the replay, with junk slipped in before three entries: the first gets
  // a stray field, the middle one (in the battle, where one seat is waited
  // on, in every corpus log) the other seat, the last a second start; each
  // an envelope with an id of its own. And right after the start, a text
  // (a store keeps a text as it is): a start whose setup holds a number
  // past the double range, which parses to Infinity, which decode must
  // refuse, never throw on
  const log = store.entries()
  const bad = [
    (e, k) => ({ ...e, id: `junk.${k}`, stray: 1 }),
    (e, k) => ({ ...e, id: `junk.${k}`, s: 1 - e.s }),
    (e, k) => ({ ...log[0], id: `junk.${k}` }),
  ]
  const spiked = [log[0], `{"core":1,"d":"x","id":"junk.inf","rules":"x","s":-1,"setup":{"board":1e999},"t":"start"}`]
  const slots = new Set([1, Math.floor(log.length / 2), log.length - 1].filter((k) => k > 0))
  let j = 0
  for (const [k, e] of log.entries()) {
    if (!k) continue
    if (slots.has(k)) spiked.push(bad[j++ % bad.length](e, k))
    spiked.push(e)
  }
  const replay = new M.Session({ store: new M.LocalStore(spiked), localSeats: [] })
  same(replay.G?.journal.trace ?? [], 'the replay with junk slipped in')
  const junkIds = spiked.map((e) => (typeof e === 'string' ? JSON.parse(e).id : e.id)).filter((id) => /^junk\./.test(id))
  if (replay.status !== 'over' || replay.rejected.length !== junkIds.length || replay.rejected.some((r, i) => r.id !== junkIds[i])) {
    throw new Error(`${where}: the replay with ${junkIds.length} junk entries ends ${replay.status}, refusing ${JSON.stringify(replay.rejected)}`)
  }
  // and the log as exported (texts), replayed: the same battle, nothing refused
  const exported = new M.Session({ store: new M.LocalStore(JSON.parse(store.export())), localSeats: [] })
  same(exported.G?.journal.trace ?? [], 'the exported log, replayed')
  if (exported.status !== 'over' || exported.rejected.length) throw new Error(`${where}: the exported log replays ${exported.status}, refusing ${JSON.stringify(exported.rejected)}`)
  return { sessions: 1, junk: replay.rejected.length, handed: stream.reduce((n, b) => n + b.length, 0), results, gaps: gaps(core, M, log, dev, where) }
}

// (R8b) Three rules of the Folder's, held at the Session over a replay of
// the corpus log `log` (its envelopes, each human seat played from `dev`):
// an entry answering a single seat's decision with no hash freezes the
// match there (a desync by the hash, theirs null), never played unchecked;
// after the end, a hashed command on the final head with another hash is
// inert from a device the seat isn't played from (a spectator's) and
// freezes the match from the seat's own; and a start made under an older
// or a newer CORE_VERSION opens read-only ('skew', no match). R8's gate
// mutants missing-h-accepted, over-any-device and core-newer-only passed
// every gate but merge-sim's edges. Returns how many it held (an AI pair's
// log, its start alone, holds only the last).
function gaps(core, M, log, dev, where) {
  const replay = (entries) => new M.Session({ store: new M.LocalStore(entries), localSeats: [] })
  // a start under another CORE_VERSION, older and newer
  for (const v of [core.CORE_VERSION - 1, core.CORE_VERSION + 1]) {
    const c = replay([{ ...log[0], core: v }, ...log.slice(1)])
    if (c.status !== 'skew' || c.G !== null || !/another version/.test(c.error ?? '')) throw new Error(`${where}: a log started under CORE_VERSION ${v} (this is ${core.CORE_VERSION}) replays ${c.status}${c.G ? ', with a match' : ''}, not read-only (skew)`)
  }
  const k = log.findIndex((e) => e.h !== undefined)
  if (k < 0) return 1
  const bare = { ...log[k] }
  delete bare.h
  const a = replay([...log.slice(0, k), bare, ...log.slice(k + 1)])
  if (a.status !== 'desync' || a.report?.at !== bare.id || a.report?.by !== 'hash' || a.report?.theirs !== null || a.accepted.includes(bare.id)) throw new Error(`${where}: a replay whose entry ${bare.id} (${bare.t}, answering one seat) carries no hash ends ${a.status} (${JSON.stringify(a.report && { at: a.report.at, by: a.report.by, theirs: a.report.theirs })}), not frozen there by the hash`)
  // the log played to its end, then an End on the head it ended at
  const b = replay(log)
  const seat = log.findLast((e) => e.s >= 0 && e.h !== undefined).s, last = b.folder.head(seat)
  const end = (id, d) => M.encode(M.envelope({ t: 'end' }, { id, s: seat, d, p: last, h: 'apart' }))
  b.store.append(end('gap.spectator', 'there'))
  const spectator = b.status, why = b.rejected.at(-1)
  b.store.append(end('gap.seat', dev))
  if (spectator !== 'over' || why?.id !== 'gap.spectator' || !/^inert/.test(why.why) || b.status !== 'desync' || b.report?.at !== 'gap.seat' || b.report?.by !== 'hash') throw new Error(`${where}: after the end, a hashed End on the final head leaves the match ${spectator} from a spectator's device (${JSON.stringify(why)}) and ${b.status} from the seat's own (${JSON.stringify(b.report && { at: b.report.at, by: b.report.by })}), not over then frozen`)
  return 3
}

// The log folded straight through the core: the match, the batches the
// sink must get (one after the start and one after each entry, each
// written down as it is taken: an event is plain data) and its one
// game.over.
function straight(core, it, where) {
  const direct = core.createMatch(jobSetup(it.job), { out: [] })
  const stream = [direct.out.splice(0).map((e) => JSON.stringify(e))]
  for (const { s, ...body } of it.job.entries ?? []) {
    core.apply(direct, s, body)
    stream.push(direct.out.splice(0).map((e) => JSON.stringify(e)))
  }
  const overs = stream.flat().map((e) => JSON.parse(e)).filter((e) => e.t === 'game.over')
  if (overs.length !== 1) throw new Error(`${where}: the log folded straight through the core makes ${overs.length} game.over events`)
  return { direct, stream, overs }
}

// 10. What the end screen says after a snap past the end (`hud`: the HUD
// model, present/hud-model.js; null for code without it) against the
// match's own game.over event `over`. Returns 1 when checked, else 0.
function sameResult(hud, G, over, where) {
  if (!hud) return 0
  const got = hud.resultOf(G), want = { win: over.win, why: over.why, vp: over.vp, rounds: over.rounds }
  if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`${where}: resultOf(G) says ${JSON.stringify(got)}, the match's game.over ${JSON.stringify(want)}`)
  return 1
}

// A random game: a random setup, its human seats played at random among
// the legal commands. Returns what it reached, and its command log.
const MIXES = [['ai', 'ai'], ['human', 'ai'], ['ai', 'human'], ['human', 'human']]
function randomTask(core, rng, mirror, races, seed, hud) {
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
  // (F4) half the games with a human seat vote at their round limit
  if (ctrl.includes('human') && rand() < 0.5) setup.overtime = 'vote'
  // (F7a) two games in five on the fortified boards, for code whose mission
  // is fought on them (P-height's rules after every command)
  const fortified = !!core.q.levelDist && core.missionOf?.({}).sets.includes('fortified')
  if (fortified && rand() < 0.4) setup.terrain = 'fortified'
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
    if (fortified) heightEvents(G, events, where)
    tap.fold(G, events, where)
  }
  const G = core.createMatch(setup, { out: [], strict: true, onTrace: tap.trace })
  const last = { trace: 0, n: 0 }
  let conceded = -1, piloted = ''
  for (let k = 0; G.turn.stage !== 'over'; k++) {
    const where = `${where0} decision ${k}`
    if (k > 3000) throw new Error(`${where}: the battle never ends`)
    invariants(core, G, where, last)
    if (fortified) counts.heights = (counts.heights ?? 0) + heightRules(core, G, where, rand)
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
      // (F10b) one pilot a phase: a unit the AI chooses to leave (no shot
      // worth taking, a charge too long) can still act, so a pilot naming
      // it stays legal and does nothing again
      const phase = `${G.turn.round}:${G.turn.active}:${G.turn.ph}`
      const acts = ok.filter((b) => !['end', 'auto', 'deployed', 'concede'].includes(b.t) && !(b.t === 'pilot' && piloted === phase))
      if (P.k === 'deploy') body = acts.length && rand() < 0.7 ? pick(acts) : { t: 'deployed' }
      // (F4) another round now and then, at most two past the setup's
      else if (P.k === 'roundLimit') body = { t: 'vote', more: G.turn.round < G.setup.rounds + 2 && rand() < 0.6 }
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
    // (F10b, P-pilot) what each of the seat's units outside a pilot's mask
    // has done, and where it stands, before the pilot plays
    const outside = body.t === 'pilot' ? actorsOutside(core, G, by, body.m) : null
    if (body.t === 'pilot') piloted = `${G.turn.round}:${G.turn.active}:${G.turn.ph}`
    const phaseWas = G.pending?.phase
    try {
      core.apply(G, by, body)
    } catch (e) {
      throw new Error(`${where}: apply(G, ${by}, ${JSON.stringify(body)}) threw: ${e.stack}`)
    }
    if (outside) {
      const now = actorsOutside(core, G, by, body.m)
      const moved = outside.find((x, i) => x !== now[i])
      if (moved) throw new Error(`${where}: pilot ${JSON.stringify(body)} played a unit outside its mask: ${moved} became ${now[outside.indexOf(moved)]}`)
      if (G.turn.stage !== 'over' && (G.pending?.k !== 'phase' || G.pending.phase !== phaseWas || !G.pending.seats.includes(by))) throw new Error(`${where}: pilot ${JSON.stringify(body)} closed seat ${by}'s ${phaseWas} phase (${JSON.stringify(G.pending)})`)
    }
    log.push([by, body])
    counts.commands[body.t] = (counts.commands[body.t] ?? 0) + 1
  }
  invariants(core, G, `${where0} at its end`, last)
  if (fortified) counts.heights = (counts.heights ?? 0) + heightRules(core, G, `${where0} at its end`, rand)
  take(`${where0} at its end`)
  counts.mirrored = tap.counts()
  counts.ended = result(G, where0, conceded)
  // (F4) the overtime rounds a vote bought, held to the rounds the setup
  // asked (a battle without the vote never plays one)
  counts.overtime = G.turn.overtime
  if (G.turn.overtime && setup.overtime !== 'vote') throw new Error(`${where0}: ${G.turn.overtime} overtime rounds, with no vote in the setup`)
  if (G.turn.overtime && G.turn.round !== setup.rounds + G.turn.overtime) throw new Error(`${where0}: ended in round ${G.turn.round} after ${G.turn.overtime} overtime rounds of a ${setup.rounds}-round battle`)
  // one game.over, saying what G.turn.result says, the score, and the
  // rounds played, the one under way counted: as many as were scored, and
  // one more for a battle that began and ended mid-round (a wipe-out ends
  // at a phase's end; a concession comes at a decision, which no round's
  // score is), none in the deployment; (F4) a concession at the round
  // limit's vote comes after its round was scored (the step still
  // `score`), and adds none
  const [over, ...more] = seen.over
  const T = G.turn
  const rounds = seen.scored + (seen.battle && T.result.why !== 'score' && T.step !== 'score' ? 1 : 0)
  if (!over || more.length) throw new Error(`${where0}: ${seen.over.length} game.over events`)
  if (over.win !== T.result.win || over.why !== T.result.why || over.vp.join() !== T.vp.join() || over.rounds !== rounds) {
    throw new Error(`${where0}: game.over ${JSON.stringify(over)} should say ${JSON.stringify({ ...T.result, vp: T.vp, rounds })} (${seen.scored} rounds scored)`)
  }
  counts.results = sameResult(hud, G, over, where0)
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
  const f = foldJob(core, { setup, entries: log.map(([s, b]) => ({ s, ...b })) }, { strict: true, match: FOLDING })
  if (f.error) throw new Error(`${where}: its log, folded by sim/run.mjs foldJob, stops: ${f.error.split('\n')[0]}`)
  // (R8b) through the Folder of code that has one, every entry accepted
  if (FOLDING && f.via !== 'folder') throw new Error(`${where}: its log, folded by sim/run.mjs foldJob, went ${f.via}, not through the Folder (it took fewer entries than were played, or another match)`)
  const t = h10(f.trace.join('\n'))
  if (t !== trace) throw new Error(`${where}: its log, folded by sim/run.mjs foldJob, traces ${t}, not ${trace} as played`)
}

// 7. A concession out of band, in a hotseat match: the seat the match isn't
// waiting on gives up, once in the deployment (seat 0, having sent
// `deployed`, while seat 1 still deploys) and once at the first phase
// decision (the seat whose turn it isn't). Its game.over says 0 rounds
// played in the deployment, 1 in the battle's first round.
function offTurnTask(core, hud) {
  let results = 0
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
    results += sameResult(hud, G, over[0], where)
    refold(core, setup, [...lead, [idle, { t: 'concede' }]], h10(G.journal.trace.join('\n')), where)
  }
  return results
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
  'overtime of no known kind': { overtime: 'sometimes' },
  'dice of its own per seat': { diceMode: 'own' },
  'no seats': { seats: null },
  'three seats': { seats: [...SETUP.seats, { race: 'squirrel', ctrl: 'ai' }] },
  'an unknown race': { seats: [{ race: 'dragon', ctrl: 'ai' }, SETUP.seats[1]] },
  'an unknown controller': { seats: [SETUP.seats[0], { race: 'serpent', ctrl: 'robot' }] },
}
// (F8a) P-mission: a setup's mission and the setup whitelist. Each refused
// with its own message (fullSetup's, in its order: the field, the seat's
// field, the mission, the set); code from before F8a takes none of these
// keys and is held to none of them.
const BAD_MISSION_SETUPS = {
  'a field no setup takes': [{ colour: 'red' }, /^a setup takes no field "colour"$/],
  "a seat's field no seat takes": [{ seats: [{ ...SETUP.seats[0], army: '224222' }, SETUP.seats[1]] }, /^seat 0 takes no field "army"$/],
  'a seat that is no record': [{ seats: [SETUP.seats[0], null] }, /^seat 1 is null, not a record/],
  'a seat that is a list': [{ seats: [['squirrel', 'human'], SETUP.seats[1]] }, /^seat 0 is \["squirrel","human"\], not a record/],
  'an unknown mission': [{ mission: 'raid' }, /^no mission "raid" \(there (is|are) classic/],
  'a mission named like an Object.prototype member': [{ mission: 'toString' }, /^no mission "toString"/],
  'a mission that is no name': [{ mission: 5 }, /^no mission 5 /],
  // ((F7a) the classic mission is fought on fortified too, so a set it isn't
  // fought on is one that doesn't exist)
  'a set the mission is not fought on': [{ terrain: 'moated' }, /^the classic mission is fought on classic or fortified, not "moated"$/],
  'a field no setup takes, before a bad mission': [{ mission: 'raid', zzz: 1 }, /^a setup takes no field "zzz"$/],
  // (F8a's review) a parsed entry's own __proto__ field, refused, not taken
  // for the setup's prototype (its fields would slip past the whitelist)
  'a __proto__ field': [JSON.parse('{"__proto__":{"board":5,"dice":7,"army":"x"}}'), /^a setup takes no field "__proto__"$/],
  "a seat's __proto__ field": [{ seats: [JSON.parse('{"race":"squirrel","ctrl":"human","__proto__":{"army":"x"}}'), SETUP.seats[1]] }, /^seat 0 takes no field "__proto__"$/],
}
function missionTask(core, MISSIONS) {
  let n = 0
  for (const [name, [change, want]] of Object.entries(BAD_MISSION_SETUPS)) {
    let G = null, why = null
    // (a change's own fields over SETUP's, a __proto__ field kept as one)
    const setup = Object.defineProperties({ ...SETUP }, Object.getOwnPropertyDescriptors(change))
    try {
      G = core.createMatch(setup)
    } catch (e) {
      if (e instanceof TypeError || e instanceof RangeError) throw new Error(`P-mission: createMatch crashes on a setup with ${name} instead of refusing it: ${e.message}`)
      why = e.message
    }
    if (G) throw new Error(`P-mission: createMatch takes a setup with ${name}`)
    if (!want.test(why)) throw new Error(`P-mission: a setup with ${name} is refused as "${why}", not ${want}`)
    n++
  }
  // a null field is a field left out; the mission named, or not, plays classic
  for (const change of [{ mission: 'classic' }, { mission: null }, { colour: null }, { seats: SETUP.seats.map((x) => ({ ...x, army: null })) }]) {
    const G = core.createMatch({ ...SETUP, ...change })
    if (G.setup.mission !== 'classic' || G.board.W !== 40 || G.board.H !== 28 || G.board.deploy !== 8) throw new Error(`P-mission: a setup with ${JSON.stringify(change)} plays mission ${G.setup.mission} on ${JSON.stringify(G.board)}`)
  }
  // every mission as shipped: its objectives point-symmetric, 1" inside its
  // board and outside both zones; and a match of it on its board
  for (const [name, m] of Object.entries(MISSIONS)) {
    const { W, H } = m.board
    for (const o of m.objectives) {
      if (!m.objectives.some((p) => p.x === -o.x && p.z === -o.z)) throw new Error(`P-mission: ${name}'s objective at (${o.x}, ${o.z}) has no point mirror`)
      if (Math.abs(o.x) > W / 2 - 1 || Math.abs(o.z) > H / 2 - 1) throw new Error(`P-mission: ${name}'s objective at (${o.x}, ${o.z}) is under 1" inside its ${W}×${H} board`)
      if (!(Math.abs(o.x) < W / 2 - m.deploy)) throw new Error(`P-mission: ${name}'s objective at (${o.x}, ${o.z}) is in a zone ${m.deploy}" deep`)
    }
    const G = core.createMatch({ ...SETUP, mission: name })
    if (G.board.W !== W || G.board.H !== H || G.nav.W !== W || G.nav.H !== H || G.objectives.length !== m.objectives.length || G.setup.rounds !== m.rounds || G.setup.terrain !== m.sets[0]) throw new Error(`P-mission: a match of ${name} is on ${JSON.stringify(G.board)}, ${G.objectives.length} objectives, ${G.setup.rounds} rounds, terrain ${G.setup.terrain}`)
    n++
  }
  return n
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

// ── P-height and P-level (F7a, DESIGN §4.2.9) ───────────────────────────────
// What a board with a height layer must keep (code from F7a on: its queries
// have levelDist; older code is held to none of it):
//  - classic boards build no height array (no nav.floor, hasHeight false),
//    every unit's groundY and every floorAt is 0, and levelDist is the
//    straight line; a fortified board builds one;
//  - (heightRules, after every command of every random game on a fortified
//    board) no unit stands straddling a ledge (its cell's cliff ≥ r − 0.06),
//    no enemy engaged across more than HIGH, and sight from a deck cell, as
//    the AI scores it (sight's `from`), is sight with the unit standing
//    there, and sightInfo's verdict sight's; (heightEvents) no non-climber's
//    walk ever takes a link, and a board's events carry `y` exactly where it
//    has height (classic's don't grow); (no ground vehicle stands above
//    STEP: F9a's vehicles have no unit yet);
//  - (heightTask, on fortified boards of its own) reach's every step: a
//    neighbour's floor within STEP and its cell standable, a link only for
//    a climber and at its cost (a disc of r 0.05, which no ledge's band
//    stops, as well as the units' own: so a reach that steps up a wall is
//    seen even where the cliff would have hidden it); standable never on a
//    ledge's band; movePlan takes a ladder for exactly the climbers; across a
//    ledge (a unit on a deck top, an enemy at its foot within 1"): not
//    engaged, the deck's bubble no ground cell's, no charge spot off the
//    target's level; the same pair on one level engaged;
//  - P-level: levelDist equals a reference Dijkstra over the gate graph
//    (every gate's two ends, a and b; the straight line between any two on
//    one level, each gate at its cost; the ladders only for a climber; no
//    way at all, the straight line), for a climber and a non-climber, on
//    LEVEL_PAIRS random point pairs per fortified board (half of the points
//    on raised cells), to 1e-9.
const HEIGHT_BOARDS = 12, LEVEL_PAIRS = 1000

// a fortified game's state, between two commands
function heightRules(core, G, where, rand) {
  const q = core.q, nav = G.nav
  if (G.setup.terrain !== 'fortified') {
    if (nav.hasHeight || nav.floor !== undefined) throw new Error(`${where}: a ${G.setup.terrain} board built a height layer`)
    for (const u of G.units) if (q.groundY(G, u) !== 0) throw new Error(`${where}: unit ${u.id} stands at ${q.groundY(G, u)} on a ${G.setup.terrain} board`)
    return 0
  }
  if (!nav.hasHeight) throw new Error(`${where}: a fortified board built no height layer`)
  const live = G.units.filter((u) => q.alive(u))
  for (const u of live) {
    const i = nav.index(u.pos.x, u.pos.z)
    if (!(nav.cliff[i] >= u.r - 0.06)) throw new Error(`${where}: unit ${u.id} (${u.t.short}, r ${u.r.toFixed(3)}) straddles a ledge at (${u.pos.x}, ${u.pos.z}): cliff ${nav.cliff[i]}`)
    for (const e of q.engagedWith(G, u)) {
      const dy = Math.abs(q.groundY(G, u) - q.groundY(G, e))
      if (dy > q.HIGH) throw new Error(`${where}: unit ${u.id} is engaged with unit ${e.id} ${dy}" below or above it`)
    }
  }
  // sight from a deck cell is sight standing there (one shooter, one target,
  // one cell, each picked at random)
  const shooters = live.filter((u) => u.t.ranged)
  if (!shooters.length) return 1
  const u = shooters[Math.floor(rand() * shooters.length)]
  const foes = live.filter((e) => e.side !== u.side)
  if (!foes.length) return 1
  const e = foes[Math.floor(rand() * foes.length)]
  const decks = []
  for (let i = 0; i < nav.N; i++) if (nav.level[i] && nav.standable(i, u.r, 'walk')) decks.push(i)
  if (!decks.length) return 1
  const c = decks[Math.floor(rand() * decks.length)], at = { x: nav.x(c), z: nav.z(c) }
  const from = JSON.stringify(q.sight(G, u, e, at)), info = q.sightInfo(G, u, e, at)
  const was = { x: u.pos.x, z: u.pos.z }
  u.pos.x = at.x
  u.pos.z = at.z
  let there
  try {
    there = JSON.stringify(q.sight(G, u, e))
  } finally {
    u.pos.x = was.x
    u.pos.z = was.z
  }
  if (from !== there) throw new Error(`${where}: unit ${u.id}'s sight of unit ${e.id} from deck cell ${c} is ${from}, standing there ${there}`)
  const s = JSON.parse(from)
  if (info.ok !== s.visible || info.cover !== s.cover) throw new Error(`${where}: sightInfo of unit ${e.id} from cell ${c} says ${JSON.stringify(info)}, sight ${from}`)
  return 1
}

// a batch of a game's events, against the board they were played on
function heightEvents(G, events, where) {
  const high = G.nav.hasHeight
  for (const e of events) {
    if (e.t === 'unit.move') {
      const u = G.units.find((x) => x.id === e.u)
      if (e.path.some((p) => p.climb) && !u.t.climb) throw new Error(`${where}: unit ${u.id} (${u.t.short}), no climber, took a ladder: ${JSON.stringify(e.path)}`)
      if (high !== ('y' in e.to) || e.path.some((p) => high !== ('y' in p))) throw new Error(`${where}: a walk ${high ? 'without' : 'with'} heights on a board ${high ? 'with' : 'without'} them: ${JSON.stringify(e).slice(0, 160)}`)
    } else if (e.t === 'unit.place' || e.t === 'unit.formation') {
      const has = e.t === 'unit.place' ? 'y' in e : 'y' in e.pos
      if (high !== has) throw new Error(`${where}: a ${e.t} ${high ? 'without' : 'with'} its floor on a board ${high ? 'with' : 'without'} height: ${JSON.stringify(e).slice(0, 160)}`)
    }
  }
}

// the reference: Dijkstra over the gate graph's nodes (a, b and every gate's
// two ends), O(n²), with no shortcut of levelDist's
function gateDijkstra(nav, a, b, climb) {
  const nodes = [{ p: a, L: nav.levelAt(a.x, a.z) }, { p: b, L: nav.levelAt(b.x, b.z) }]
  const gates = nav.gates.filter((g) => climb || !g.ladder)
  for (const g of gates) nodes.push({ p: g.lo, L: 0 }, { p: g.hi, L: g.level })
  const n = nodes.length, d = new Array(n).fill(Infinity), done = new Array(n).fill(false)
  d[0] = 0
  for (;;) {
    let u = -1
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || d[i] < d[u])) u = i
    if (u < 0 || !isFinite(d[u])) break
    done[u] = true
    for (let v = 0; v < n; v++) if (nodes[v].L === nodes[u].L) d[v] = Math.min(d[v], d[u] + Math.hypot(nodes[u].p.x - nodes[v].p.x, nodes[u].p.z - nodes[v].p.z))
    if (u >= 2) {
      const k = (u - 2) >> 1, v = (u - 2) % 2 ? u - 1 : u + 1
      d[v] = Math.min(d[v], d[u] + gates[k].cost)
    }
  }
  return isFinite(d[1]) ? d[1] : Math.hypot(a.x - b.x, a.z - b.z)
}

function heightTask(core, nav0) {
  const q = core.q, counts = { boards: 0, pairs: 0, steps: 0, links: 0, cells: 0, plans: 0, ledges: 0, flat: 0 }
  const { STEP } = nav0
  const SEATS = [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }]
  // classic: no height anywhere
  for (const board of [1, 2, 3]) {
    const G = core.createMatch({ board, dice: 1, seats: SEATS })
    const where = `P-height, classic board ${board}`
    if (G.nav.hasHeight || G.nav.floor !== undefined || G.nav.cliff !== undefined) throw new Error(`${where}: it built a height layer`)
    for (const u of G.units) if (q.groundY(G, u) !== 0) throw new Error(`${where}: unit ${u.id} stands at ${q.groundY(G, u)}`)
    if (q.floorAt(G, 3, 2) !== 0 || q.levelDist(G, { x: -5, z: 1 }, { x: 4, z: -3 }, true) !== Math.hypot(9, 4)) throw new Error(`${where}: floorAt or levelDist isn't the flat table's`)
  }
  for (let board = 1; board <= HEIGHT_BOARDS; board++) {
    const where = `P-height, fortified board ${board}`
    const G = core.createMatch({ board, dice: 1, terrain: 'fortified', seats: SEATS })
    const nav = G.nav, rand = mulberry32(board * 7907)
    if (!nav.hasHeight) throw new Error(`${where}: no height layer`)
    counts.boards++
    const raised = []
    for (let i = 0; i < nav.N; i++) if (nav.level[i]) raised.push(i)
    // standable never on a ledge's band
    for (const r of [0.42, 0.95, 1.05, 1.22]) {
      for (let i = 0; i < nav.N; i++) if (nav.standable(i, r, 'walk') && !(nav.cliff[i] >= r - 0.06)) throw new Error(`${where}: cell ${i} is standable for r ${r} with cliff ${nav.cliff[i]}`)
    }
    counts.cells += nav.N
    // reach's steps, from the ground and from deck tops
    const starts = []
    for (let k = 0; k < 6; k++) {
      const pool = k % 2 && raised.length ? raised : null
      starts.push(pool ? pool[Math.floor(rand() * pool.length)] : Math.floor(rand() * nav.N))
    }
    for (const s of starts) {
      for (const [r, climb] of [[0.05, true], [0.05, false], [0.42, true], [1.05, false], [1.22, true]]) {
        // (from a cell the disc stands on: one squeezed may wriggle out
        // through its own footprint, ledges' bands and all, as on the flat)
        if (!nav.standable(s, r, 'walk')) continue
        const res = nav.reach(nav.x(s), nav.z(s), { r, max: 30, mode: 'walk', climb })
        for (let j = 0; j < nav.N; j++) {
          const i = res.prev[j]
          if (i < 0) continue
          counts.steps++
          const near = Math.abs((i % nav.nx) - (j % nav.nx)) <= 1 && Math.abs(Math.floor(i / nav.nx) - Math.floor(j / nav.nx)) <= 1
          if (near) {
            if (Math.abs(nav.floor[j] - nav.floor[i]) > STEP) throw new Error(`${where}: reach (r ${r}) steps from cell ${i} (floor ${nav.floor[i]}) to cell ${j} (floor ${nav.floor[j]}), more than STEP`)
            if (r > 0.06 && !(nav.cliff[j] >= r - 0.06)) throw new Error(`${where}: reach (r ${r}) steps onto cell ${j}, on a ledge's band (cliff ${nav.cliff[j]})`)
          } else {
            counts.links++
            const cost = nav.linkCostOf(i, j)
            if (!climb) throw new Error(`${where}: a reach that doesn't climb (r ${r}) went from cell ${i} to cell ${j} over a ladder`)
            if (cost < 0 || res.dist[j] !== res.dist[i] + cost) throw new Error(`${where}: reach (r ${r}) jumped from cell ${i} to cell ${j} (${res.dist[i]} → ${res.dist[j]}), which no link (${cost}) joins at that cost`)
          }
        }
      }
    }
    // movePlan takes a ladder for exactly the climbers: each unit put at a
    // ladder's foot it stands on
    for (const g of nav.gates.filter((x) => x.ladder)) {
      const foot = nav.index(g.lo.x, g.lo.z), top = nav.index(g.hi.x, g.hi.z)
      for (const u of G.units) {
        if (!nav.standable(foot, u.r, 'walk') || !nav.standable(top, u.r, 'walk')) continue
        const was = { x: u.pos.x, z: u.pos.z }
        u.pos.x = nav.x(foot)
        u.pos.z = nav.z(foot)
        try {
          const plan = q.movePlan(G, u, 20)
          const up = plan.res.prev[top] === foot
          // (an enemy's bubble over the top, or the foot, bars the way: the
          // works' decks hold their seat's army)
          if (plan.forbid?.[top] || plan.forbid?.[foot]) continue
          counts.plans++
          if (plan.mode !== 'fly' && up !== !!u.t.climb) throw new Error(`${where}: ${u.t.short}'s move plan from ladder ${g.id}'s foot ${up ? 'climbs it' : "doesn't climb it"}, ${u.t.climb ? 'a climber' : 'no climber'}`)
        } finally {
          u.pos.x = was.x
          u.pos.z = was.z
        }
      }
    }
    // across a ledge or up a stair: a seat 0 unit and a seat 1 unit within
    // 1" (base to base) more than HIGH apart in height; then the same pair
    // on one level. (Each side of an edge, the ledges' bands keep two discs
    // 0.88" apart or more, and at the grid's cells usually more than 1":
    // the pairs the height rule parts are found on the stairs too, where
    // 2.4" of a stair rises 1.2", which two squads' bases span.) The
    // biggest climbers, so their bases span most.
    const big = (side) => G.units.filter((u) => u.side === side && !u.t.fly && u.t.climb).reduce((x, y) => (y.r > x.r ? y : x))
    const a = big(0), e = big(1)
    const put = (u, i) => {
      u.pos.x = nav.x(i)
      u.pos.z = nav.z(i)
    }
    const pa = { ...a.pos }, pe = { ...e.pos }
    let across = null, flat = null
    const R = Math.ceil((a.r + e.r + 1) / nav.cell)
    for (let i = 0; i < nav.N && !(across && flat); i++) {
      if (!nav.floor[i] || !nav.standable(i, a.r, 'walk')) continue
      const ix = i % nav.nx, iz = Math.floor(i / nav.nx)
      for (let dz = -R; dz <= R && !(across && flat); dz++) {
        for (let dx = -R; dx <= R; dx++) {
          const jx = ix + dx, jz = iz + dz
          if (jx < 0 || jz < 0 || jx >= nav.nx || jz >= nav.nz) continue
          const j = jz * nav.nx + jx
          if (i === j || !nav.standable(j, e.r, 'walk')) continue
          const g = Math.hypot(nav.x(i) - nav.x(j), nav.z(i) - nav.z(j)) - a.r - e.r
          if (g < 0.1 || g > 1) continue
          if (!across && Math.abs(nav.floor[i] - nav.floor[j]) > q.HIGH) across = [i, j]
          else if (!flat && nav.level[i] && nav.floor[i] === nav.floor[j]) flat = [i, j]
        }
      }
    }
    try {
      if (across) {
        put(a, across[0])
        put(e, across[1])
        if (q.engagedWith(G, a).includes(e) || q.engagedWith(G, e).includes(a)) throw new Error(`${where}: two enemies under 1" apart, one at floor ${nav.floor[across[0]]} (cell ${across[0]}), one at ${nav.floor[across[1]]} (cell ${across[1]}), are engaged`)
        // (every cell e may not enter lies in the bubble of an enemy of its
        // within HIGH of that enemy's floor)
        const f = q.forbidMask(G, e, 1.05), theirs = q.enemiesOf(G, e)
        for (let i = 0; i < nav.N; i++) {
          if (f[i] && !theirs.some((o) => Math.hypot(nav.x(i) - o.pos.x, nav.z(i) - o.pos.z) < o.r + e.r + 1.05 && Math.abs(nav.floor[i] - q.groundY(G, o)) <= q.HIGH)) throw new Error(`${where}: cell ${i} at floor ${nav.floor[i]} is forbidden, in no enemy's bubble at its level`)
        }
        const plan = q.chargePlan(G, e, a)
        for (const s of plan?.spots ?? []) if (Math.abs(nav.floor[s.i] - q.groundY(G, a)) > q.HIGH) throw new Error(`${where}: a charge on the unit at floor ${q.groundY(G, a)} may end on cell ${s.i} at floor ${nav.floor[s.i]}`)
        counts.ledges++
      }
      if (flat) {
        put(a, flat[0])
        put(e, flat[1])
        if (!q.engagedWith(G, a).includes(e)) throw new Error(`${where}: two enemies on one level (cells ${flat[0]} and ${flat[1]}, floor ${nav.floor[flat[0]]}) under 1" apart aren't engaged`)
        counts.flat++
      }
    } finally {
      Object.assign(a.pos, pa)
      Object.assign(e.pos, pe)
    }
    // P-level
    const point = () => {
      if (raised.length && rand() < 0.5) {
        const i = raised[Math.floor(rand() * raised.length)]
        return { x: nav.x(i) + (rand() - 0.5) * 0.4, z: nav.z(i) + (rand() - 0.5) * 0.4 }
      }
      return { x: (rand() - 0.5) * nav.W, z: (rand() - 0.5) * nav.H }
    }
    for (let k = 0; k < LEVEL_PAIRS; k++) {
      const p = point(), b = point()
      for (const climb of [true, false]) {
        const got = q.levelDist(G, p, b, climb), want = gateDijkstra(nav, p, b, climb)
        if (!(Math.abs(got - want) <= 1e-9)) throw new Error(`${where}: levelDist from (${p.x}, ${p.z}) (level ${nav.levelAt(p.x, p.z)}) to (${b.x}, ${b.z}) (level ${nav.levelAt(b.x, b.z)}), ${climb ? 'climbing' : 'by stairs'}, is ${got}; over the gate graph ${want}`)
        counts.pairs++
      }
    }
  }
  if (!counts.ledges || !counts.flat || !counts.links || !counts.plans) throw new Error(`P-height met no ${!counts.ledges ? 'pair across a ledge' : !counts.flat ? 'pair on one level' : !counts.links ? 'link in a reach' : 'unit at a ladder\'s foot'} on ${HEIGHT_BOARDS} boards`)
  return counts
}

// (the child's match/ modules that fold a log, R8's: refold's)
let FOLDING = null

if (a.child) {
  const task = JSON.parse(readFileSync(0, 'utf8'))
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const rng = await import(pathToFileURL(join(dir, 'core', 'rng.js')).href)
  const { RACES } = await import(pathToFileURL(join(dir, 'data', 'schema.js')).href)
  const mirror = await import(pathToFileURL(join(dir, 'present', 'mirror.js')).href)
  // the Session and the stores (R6b on; null for older code, which has no
  // match/: any other failure to load them fails the run), and (R8) the
  // Folder and the envelopes, which foldJob folds every log through
  const match = existsSync(join(dir, 'match'))
    ? Object.assign({}, ...(await Promise.all(['session', 'store'].map((m) => import(pathToFileURL(join(dir, 'match', `${m}.js`)).href)))))
    : null
  if (match) {
    match.folding = await loadMatch(dir)
    if (match.folding) Object.assign(match, match.folding.envelope, match.folding.fold)
    FOLDING = match.folding
  }
  // the HUD model's resultOf (R7b on; null for older code)
  const hud = existsSync(join(dir, 'present', 'hud-model.js')) ? await import(pathToFileURL(join(dir, 'present', 'hud-model.js')).href) : null
  let out
  try {
    if (task.kind === 'corpus') {
      const it = loadCorpus().items.find((x) => x.id === task.id)
      out = { ok: true, counts: corpusTask(core, rng, mirror, it, match, hud) }
    } else if (task.kind === 'random') {
      const r = randomTask(core, rng, mirror, Object.keys(RACES), task.seed, hud)
      out = { ok: true, counts: r.counts, game: { setup: r.setup, log: r.log, trace: r.trace } }
    } else if (task.kind === 'interleave') {
      const [A, B] = task.games
      interleave(core, A, B)
      out = { ok: true, counts: { interleaved: 2 } }
    } else if (task.kind === 'offturn') {
      out = { ok: true, counts: { offTurn: 2, results: offTurnTask(core, hud) } }
    } else if (task.kind === 'height') {
      // (F7a: P-height's boards of its own, and P-level)
      out = { ok: true, counts: heightTask(core, await import(pathToFileURL(join(dir, 'core', 'nav.js')).href)) }
    } else if (task.kind === 'setups') {
      // (F8a: P-mission, on code whose setups name their mission)
      const missions = core.SETUP_KEYS ? (await import(pathToFileURL(join(dir, 'data', 'mission.js')).href)).MISSIONS : null
      out = { ok: true, counts: { refused: setupTask(core), missions: missions ? missionTask(core, missions) : 0 } }
    }
  } catch (e) {
    out = { ok: false, error: String(e?.message ?? e) }
  }
  process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

// ── The run ─────────────────────────────────────────────────────────────────
const ME = fileURLToPath(import.meta.url)
// (F10b) whether the code under test knows `pilot` (code older than F10b,
// the PIN's before it, is held to everything else)
const pilots = (pkg) => /^\s*pilot: \{ k: 'phase'/m.test(readFileSync(join(pkg, 'core', 'commands.js'), 'utf8'))

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
  const offTurn = await child({ kind: 'offturn' }, pkg)
  say(`  a hotseat concession out of band: ${offTurn.ok ? 'ok   in the deployment and in the battle, folded the same' : `FAIL ${offTurn.error}`}`)
  if (!offTurn.ok) bad.push(offTurn)
  // 8. setups the rules can't play, and G's shape
  {
    const r = await child({ kind: 'setups' }, pkg)
    say(`  setups and G's shape: ${r.ok ? `ok   ${r.counts.refused} bad setups refused, the edges taken, pending null through an all-AI battle${r.counts.missions ? `; (P-mission) ${r.counts.missions} mission setups and missions held` : ''}` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
    // (code with SETUP_KEYS whitelists its setups: P-mission must have run)
    else if (existsSync(join(pkg, 'data', 'mission.js')) && /SETUP_KEYS/.test(readFileSync(join(pkg, 'core', 'match.js'), 'utf8')) && !r.counts.missions) bad.push({ error: 'the code whitelists its setups, but P-mission held nothing' })
  }
  // (F7a) P-height's own boards and P-level, for code with a height layer
  if (/export function levelDist/.test(readFileSync(join(pkg, 'core', 'queries.js'), 'utf8'))) {
    const r = await child({ kind: 'height' }, pkg)
    say(`  P-height and P-level: ${r.ok ? `ok   3 classic boards flat; ${r.counts.boards} fortified boards: ${r.counts.cells} cells standable only off the ledges' bands, ${r.counts.steps} reach steps within STEP (${r.counts.links} over ladders, at their cost, climbing), ${r.counts.plans} move plans at ladders' feet climbing for exactly the climbers, ${r.counts.ledges} pairs under 1" apart but more than 1.2" apart in height unengaged (no bubble, no charge spot off the level) and ${r.counts.flat} on one level engaged; levelDist the gate graph's Dijkstra on ${r.counts.pairs} pairs` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // what the random games reached, over the whole run
  const reached = { score: 0, wipe: 0, concede: 0, offTurn: 0, chargeEnd: 0, auto: 0, place: 0, vote: 0, overtime: 0, ...(pilots(pkg) ? { pilot: 0 } : {}) }
  for (const r of res) {
    if (!r.ok || !r.game) continue
    reached[r.counts.ended]++
    reached.offTurn += r.counts.offTurn ?? 0
    for (const k of ['chargeEnd', 'auto', 'place', 'vote', ...('pilot' in reached ? ['pilot'] : [])]) reached[k] += r.counts.commands[k] ?? 0
    reached.overtime += r.counts.overtime ?? 0
  }
  const probes = res.reduce((s, r) => s + (r.counts?.probes ?? 0), 0)
  // (F7a) the fortified games' decisions P-height held
  const heights = res.reduce((s, r) => s + (r.counts?.heights ?? 0), 0)
  if (coverage && games >= 8 && /export function levelDist/.test(readFileSync(join(pkg, 'core', 'queries.js'), 'utf8')) && !heights) bad.push({ error: 'the random games played no fortified board for P-height (more --games?)' })
  const quietly = res.reduce((s, r) => s + (r.counts?.quiet ?? 0), 0)
  const refolded = res.reduce((s, r) => s + (r.counts?.refolded ?? 0), 0)
  const sessions = res.reduce((s, r) => [s[0] + (r.counts?.sessions ?? 0), s[1] + (r.counts?.junk ?? 0), s[2] + (r.counts?.handed ?? 0), s[3] + (r.counts?.gaps ?? 0)], [0, 0, 0, 0])
  const mirrored = res.reduce((s, r) => [s[0] + (r.counts?.mirrored?.acts ?? 0), s[1] + (r.counts?.mirrored?.stops ?? 0)], [0, 0])
  // (code with match/ plays every corpus battle through the Session too)
  const corpusOk = res.filter((r, i) => r.ok && tasks[i].kind === 'corpus').length
  if (existsSync(join(pkg, 'match', 'fold.js')) && sessions[0] !== corpusOk) bad.push({ error: `the code has a Folder, but ${sessions[0]} of ${corpusOk} corpus battles went through the Session` })
  // 10. (code with present/hud-model.js holds resultOf to every end played)
  const results = [...res, offTurn].reduce((s, r) => s + (r.ok ? r.counts?.results ?? 0 : 0), 0)
  const ends = res.filter((r) => r.ok).length + (offTurn.ok ? 2 : 0)
  if (existsSync(join(pkg, 'present', 'hud-model.js')) && results !== ends) bad.push({ error: `the code has present/hud-model.js, but resultOf(G) was held to the game.over at ${results} of ${ends} ends` })
  if (coverage && games >= 8) {
    const never = Object.entries(reached).filter(([, n]) => !n).map(([k]) => k)
    if (never.length) bad.push({ error: `the random games never reached: ${never.join(', ')} (more --games?)` })
  }
  say(`\n${items.length} corpus battles and ${games} random games (${Object.entries(reached).map(([k, n]) => `${k} ${n}`).join(', ')}), ${probes} decisions probed (${heights} of them on fortified boards, held to P-height), every AI command held to legal(), ${refolded} random games' logs folded by foldJob the same, ${quietly} corpus battles folded quietly as well (${res.reduce((n, r) => n + (r.counts?.hashed ?? 0), 0)} stateHashes before entries the same), the match's events held to the mirror at ${mirrored[0]} acts and ${mirrored[1]} stops, ${sessions[0]} corpus battles played through the Session the same (the sink handed all ${sessions[2]} events the core left, in order; ${sessions[1]} junk entries refused on replay; ${sessions[3]} of the Folder's rules held on replays), resultOf(G) the match's game.over at ${results} ends (${Math.round((Date.now() - t0) / 1000)} s)`)
  return bad
}

// ── The self-test ───────────────────────────────────────────────────────────
// Each a broken copy of the working tree's core; P-prop must fail on each.
// Only a check of P-prop's own can catch most of them: parity sees none of
// `preview-draws`, `concede-crash`, `concede-in-band` (no corpus battle
// reaches them), `score-silent`, `legal-emits`, `over-rounds` (no such
// event is recorded), `result-rounds` (the view's, which nothing in the
// core reads), `extra-field` (no log carries one), `pending-unset`
// (nothing reads the missing key: (8) alone) or `rounds-unbounded` (every
// battle recorded lasts 5 rounds); nor, being the Session's, `session-keeps-out`
// (parity folds through foldJob), `session-folds-junk` (no log holds junk) or
// `session-drops-event` (nor does P-present: the view plays `pending` as nothing);
// nor (R8) `session-no-hash` and `session-global-head` (foldJob writes its
// own envelopes), nor `hash-reads-out` (foldJob takes each `h` from the same
// fold that checks it: only a quiet fold's hash, (5), sees it); nor (R8b)
// `quiet-accepted-short` and `concede-accepted-short` (the battle traced the
// same: only (5)'s `via` sees the first, only the refolds' the second), nor
// `missing-h-accepted`, `over-any-device` and `core-newer-only` (no honest
// log writes those entries: only (9)'s replays do).
const MUTATIONS = {
  // (F7a) P-height and P-level: a reach that steps up a wall (the cliff
  // hides it from a unit's own disc: only heightTask's r 0.05 reach sees
  // it), a standable that ignores the ledges, a levelDist that misses a
  // gate, an engagement across a ledge, and a plan that lets every unit
  // climb
  'reach-ignores-step': ['core/nav.js', '          if (Math.abs(floor[j] - fi) > STEP) continue\n', ''],
  'standable-ignores-cliff': ['core/nav.js', " >= r - 0.06 && this.cliff[i] >= r - 0.06\n", ' >= r - 0.06\n'],
  'leveldist-misses-a-gate': ['core/queries.js', '    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b\n    for (const g of nav.gates) {', '    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b\n    for (const g of nav.gates.slice(1)) {'],
  'engaged-ignores-height': ['core/queries.js', 'gap(u, e) <= ENGAGE + 0.05 && Math.abs(groundY(G, u) - groundY(G, e)) <= HIGH)', 'gap(u, e) <= ENGAGE + 0.05)'],
  'everyone-climbs': ['core/actions/move.js', 'forbid: mode === \'fly\' ? null : forbid, climb: climbs(u) })', 'forbid: mode === \'fly\' ? null : forbid, climb: true })'],
  // (F8a, P-mission) a setup's stray field copied through, as before F8a
  'whitelist-off': ['core/index.js', "  for (const [k] of fields) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n", ''],
  // (F8a's review) the whitelist read off the copy, as first built: a
  // __proto__ field sets the copy's prototype and slips past it
  'whitelist-after-copy': ['core/index.js', "  for (const [k] of fields) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n  const s = {}\n  for (const [k, v] of fields) s[k] = v\n", "  const s = {}\n  for (const [k, v] of fields) s[k] = v\n  for (const k of Object.keys(s)) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n"],
  // a mission MISSIONS lacks taken (the match then has no board)
  'mission-unchecked': ['core/index.js', "  if (typeof s.mission !== 'string' || !(s.mission in MISSIONS)) throw new Error(`no mission ${JSON.stringify(s.mission)} (there ${Object.keys(MISSIONS).length === 1 ? 'is' : 'are'} ${Object.keys(MISSIONS).join(', ')})`)\n", ''],
  // a set the mission isn't fought on taken (as long as it exists)
  'set-unchecked': ['core/index.js', "  if (!mission.sets.includes(s.terrain)) throw new Error(`the ${s.mission} mission is fought on ${mission.sets.join(' or ')}, not ${JSON.stringify(s.terrain)}`)\n", ''],
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
  'extra-field': ['core/commands.js', "  for (const k of Object.keys(body)) if (k !== 't' && !rule.fields.includes(k) && !opt.includes(k) && !bools.includes(k)) return `${body.t} takes no field \"${k}\"`\n", ''],
  // (F4) legal() takes a vote that says neither yes nor no (a number, a
  // string, nothing)
  'vote-not-boolean': ['core/commands.js', "  for (const f of bools) if (typeof body[f] !== 'boolean') return `${body.t} takes ${f} true or false`\n", ''],
  // newState's G leaves `pending` out (§2.1), so an all-AI battle runs with
  // it missing until the end
  'pending-unset': ['core/match.js', '    pending: null,\n', ''],
  // fullSetup takes any number of rounds, so createMatch plays an all-AI
  // battle for as long as a typo asks
  'rounds-unbounded': ['core/index.js', ' || s.rounds > MAX_ROUNDS', ''],
  // the Session (its Folder, R8) hands the sink the events and leaves them
  // in G.out too (a view would play them twice, the next entry's sink again)
  'session-keeps-out': ['match/fold.js', 'const batch = this.G.out.splice(0)', 'const batch = this.G.out.slice()'],
  // the Folder folds an entry legal() refuses (a replay's junk, a peer's)
  'session-folds-junk': ['match/fold.js', "    if (why) return this.reject(e, `illegal: ${why}`)\n    const clock = clockOf(G)", '    const clock = clockOf(G)'],
  // the Session filters what it hands the sink: the `pending` events, which
  // nothing the eye sees plays yet (N2's waiting line will)
  'session-drops-event': ['match/fold.js', '      each(batch, e)\n', "      each(batch.filter((x) => x.t !== 'pending'), e)\n"],
  // (R8) the Session writes an entry for one seat without the match's hash
  // (so the Folder freezes the match at it: a desync of its own making)
  'session-no-hash': ['match/session.js', 'h: oob || SIMULTANEOUS.includes(P.k) ? undefined : stateHash(this.G),', 'h: undefined,'],
  // (R8's fixer, round 2) a charge's end taken for a simultaneous decision:
  // the Session writes it with no hash, and the Folder checks none (§0.2 #3
  // requires one on it)
  'chargeEnd-simultaneous': ['match/fold.js', "export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit'])", "export const SIMULTANEOUS = Object.freeze(['deploy', 'roundLimit', 'chargeEnd'])"],
  // (R8) the Session writes the last entry overall as prev, not the seat's
  // head: in a hotseat deployment seat 1's first entry is then stale
  'session-global-head': ['match/session.js', 'p: oob ? undefined : this.folder.head(seat),', 'p: oob ? undefined : this.folder.last,'],
  // (R8) the hash reads G.out (I/O, never match state), so a quiet fold (a
  // peer catching up, out null) hashes apart from a presented one (out [])
  // and would freeze an online match on its first entry for one seat
  'hash-reads-out': ['core/hash.js', '  return `turn ${turn}', "  return `${G.out ? 'shown' : 'quiet'}\nturn ${turn}"],
  // the end screen after a snap past the end counts the deployment as round
  // 1 played, where the match's own game.over says 0 (the view's, not the
  // core's: no trace or event of the match changes)
  'result-rounds': ['present/hud-model.js', "rounds: T.step === 'rolloff' ? 0 : T.round", 'rounds: T.round'],
  // (R8b) a quiet Folder leaves its Ends out of `accepted`: the battle
  // traced the same, but not every entry taken through the Folder (only the
  // quiet fold's own check, `via`, sees it)
  'quiet-accepted-short': ['match/fold.js', '    this.accepted.push(e.id)\n', "    if (this.opts.out || e.t !== 'end') this.accepted.push(e.id)\n"],
  // the Folder leaves a concession out of `accepted` (only the random
  // games' and the out-of-band concessions' refolds, `via`, see it: no
  // corpus log concedes)
  'concede-accepted-short': ['match/fold.js', '    this.accepted.push(e.id)\n', "    if (e.t !== 'concede') this.accepted.push(e.id)\n"],
  // R8's gate mutants, now held at the Session too (gaps): an entry
  // answering one seat's decision with no hash played unchecked
  'missing-h-accepted': ['match/fold.js', 'if (!SIMULTANEOUS.includes(P.k) && e.h !== stateHash(G)) return this.freeze(e)', 'if (!SIMULTANEOUS.includes(P.k) && e.h !== undefined && e.h !== stateHash(G)) return this.freeze(e)'],
  // after the end, any device's hashed command on the final head freezes
  // the match
  'over-any-device': ['match/fold.js', "seat?.ctrl === 'human' && e.d === seat.dev && e.h !== stateHash(this.G)) return this.freeze(e)", "seat?.ctrl === 'human' && e.h !== stateHash(this.G)) return this.freeze(e)"],
  // only a newer build's start is skew: an older one's is folded
  'core-newer-only': ['match/fold.js', 'if (e.core !== CORE_VERSION || e.rules !== RULES_ID) {', 'if (e.core > CORE_VERSION || e.rules !== RULES_ID) {'],
  // (F10b, P-pilot) the AI under a pilot plays the whole army
  'pilot-ignores-mask': ['core/ai/policy.js', 'const mask = (u) => !only || only.includes(u)', 'const mask = (u) => true'],
  // a pilot naming a destroyed unit is taken
  'pilot-names-dead': ['core/commands.js', '  if (dead) return `unit ${dead.id} is destroyed`\n', ''],
  // a bit past the seat's last unit is ignored, not refused
  'pilot-stray-bits': ['core/queries.js', '      if (j >= mine.length) return null\n      out.push(mine[j])', '      if (j < mine.length) out.push(mine[j])'],
  // a pilot of units none of which can act is taken
  'pilot-idle-ok': ['core/commands.js', 'return units.some((u) => canAct(G, u)) ? null :', 'return units.length ? null :'],
  // a mask read bitwise: its bits past 32 dropped, so a stray high bit names
  // a unit
  'pilot-bitwise': ['core/queries.js', '    const r = m % 2\n', '    m = m >>> 0\n    const r = m & 1\n'],
  // a pilot ends the phase, as Auto does
  'pilot-ends-phase': ['core/commands.js', '    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n', '    runAI(G, seat, G.pending.phase, maskUnits(G, seat, m))\n    G.pending = null\n'],
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
