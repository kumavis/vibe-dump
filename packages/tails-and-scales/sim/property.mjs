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
//    (F8a) P-mission: the setup whitelist and the missions. (F11a) And the
//    armies: every refusal of DESIGN §4.2.8.4 with its exact message, by
//    fullSetup and by createMatch alike, seat-major (both seats broken:
//    seat 0's first rule) and in the table's order within a seat; no army,
//    a null one, 'classic' and '112111' one match (stateHash, units and
//    trace, at the deployment and through an all-AI battle); checkMission's
//    list rules taken and refused at their edges. (F8b) The three
//    missions (classic, field, grand) named in every refusal that lists
//    them, the larger ones refused the classic set and classic refused
//    `open`, the larger battles' presets refused in a Skirmish by its
//    points; and each race's preset at each mission, the army a seat
//    naming none plays, filled in by name, legal, fielded unit for unit,
//    and the same match whether the seats name it, its counts or nothing.
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
// 11. (F11a) P-army, on code with core/army.js (the block above its tasks
//    below says what each holds): 100,000 fuzzed armies refused with a
//    seat's reason or taken in their one spelling, never a crash;
//    autoList's lists legal over seeds 1-1,000 × races × missions; a classic
//    match's shadowState unchanged, whichever way its army is spelt, and
//    its stateHash data-check's pin; and per mission 50 random legal lists
//    played to the end under strict, 40 AI against AI and 10 with a human
//    seat answered at random as (3)'s games are.
// 12. (F18) P-fight, on code with fightOf: shooting into a fight, on scenes
//    of its own (fightTask below says what each holds): a target locked in
//    combat legal for every ranged weapon of both races; a volley's dice
//    held draw for draw, one draw per miss after the hit roll and before
//    the wound roll, the strays the misses that drew under the friends'
//    share, the target's rows and line before the friend's, the stray hits
//    on the friend with the most models (ties the first in G.units order);
//    a clear shot (no friend in the fight) drawing no stray die; and the
//    AI's shot value net of its friendly fire, the Venom Engine holding its
//    fire rather than shell its own Brute.
// 13. (F19a) P-keg, on code with the powder keg (kegsGoOff): on scenes of
//    its own (kegTask below says what each holds): no keg on classic, open
//    or fortified, one at the keg board's centre; a template sets it off,
//    once, its victims and scenery first, then the keg's line, fuse and
//    blast, every victim's dice held draw for draw in G.units order and
//    the fallen credited to the gun; four kegs going off in the line's
//    order (breadth first, chunk order within a blast), each once; a
//    wrecker's walk setting it off once the walk has ended; and the AI's
//    keg terms (a gun's shot worth the keg, a keg's value by side, a cell
//    in the blast feared). (P-mission's setups task holds the keg mission's
//    refusals, and P-army plays its random lists as every mission's.)
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
// (F11a, P-army) `lists`: { mission, RACES, MISSIONS } for a game whose
// seats field random legal lists at that mission (autoList on budgets from
// 60% of the limit, drawn from a stream of their own, so the game's own
// draws are a plain game's), one seat at least a human's
function randomTask(core, rng, mirror, races, seed, hud, lists = null) {
  const rand = mulberry32(seed * 2654435761)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const ctrl = lists ? MIXES[1 + (seed % 3)] : seed < 4 ? MIXES[seed] : pick(MIXES)
  const aggressive = seed % 2 === 0
  const r = rand()
  const setup = {
    board: 1 + Math.floor(rand() * 1e6), dice: 1 + Math.floor(rand() * 1e9),
    rounds: r < 0.2 ? 1 + Math.floor(rand() * 3) : r < 0.5 ? 6 + Math.floor(rand() * 5) : 5,
    seats: [0, 1].map((s) => ({ race: rand() < 0.7 ? ['squirrel', 'serpent'][s] : pick(races), ctrl: ctrl[s] })),
  }
  // (F4) half the games with a human seat vote at their round limit
  if (ctrl.includes('human') && rand() < 0.5) setup.overtime = 'vote'
  if (lists) {
    const pickList = mulberry32(seed * 40503 + 7), rules = lists.MISSIONS[lists.mission].list
    setup.mission = lists.mission
    for (const x of setup.seats) {
      const budget = rules.points - 5 * Math.floor(pickList() * (rules.points / 12.5))
      x.army = core.army.listText(core.army.autoList(lists.RACES[x.race], { ...rules, points: budget }, Math.floor(pickList() * 2 ** 32)))
    }
  }
  // (F7a) two games in five on the fortified boards, for code whose mission
  // is fought on them (P-height's rules after every command): (F11a) a
  // P-army game with a human seat too, its lists drawn from their own
  // stream above, so the draw here is a plain game's
  const fortified = !!core.q.levelDist && core.missionOf?.(setup).sets.includes('fortified')
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
  if (lists) unitsAre(core, G, lists.RACES, where0)
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
  if (lists) {
    const bad = traceShape(G)
    if (bad) throw new Error(`${where0}: ${bad}`)
    counts.listGames = 1
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
  // ((F11a) a seat's `army` is a field it takes: a stray one is another's)
  "a seat's field no seat takes": [{ seats: [{ ...SETUP.seats[0], colour: 'red' }, SETUP.seats[1]] }, /^seat 0 takes no field "colour"$/],
  'a seat that is no record': [{ seats: [SETUP.seats[0], null] }, /^seat 1 is null, not a record/],
  'a seat that is a list': [{ seats: [['squirrel', 'human'], SETUP.seats[1]] }, /^seat 0 is \["squirrel","human"\], not a record/],
  // ((F8b) the three missions, named in their order)
  'an unknown mission': [{ mission: 'raid' }, /^no mission "raid" \(there are classic, field, grand, keg\)$/],
  'a mission named in capitals': [{ mission: 'Grand' }, /^no mission "Grand" \(there are classic, field, grand, keg\)$/],
  'a mission named like an Object.prototype member': [{ mission: 'toString' }, /^no mission "toString"/],
  'a mission that is no name': [{ mission: 5 }, /^no mission 5 /],
  // ((F7a) the classic mission is fought on fortified too, so a set it isn't
  // fought on is one that doesn't exist)
  'a set the mission is not fought on': [{ terrain: 'moated' }, /^the classic mission is fought on classic or fortified, not "moated"$/],
  // ((F8b) the larger missions are fought on open (and, F7a, fortified),
  // never classic's set, nor open on the classic mission)
  'the grand mission on the classic set': [{ mission: 'grand', terrain: 'classic' }, /^the grand mission is fought on open or fortified, not "classic"$/],
  'the field mission on the classic set': [{ mission: 'field', terrain: 'classic' }, /^the field mission is fought on open or fortified, not "classic"$/],
  'the classic mission on the open set': [{ terrain: 'open' }, /^the classic mission is fought on classic or fortified, not "open"$/],
  // ((F19a) the keg mission is fought on the keg set alone, and no other
  // mission on it; its armies a Skirmish's)
  'the keg mission on the classic set': [{ mission: 'keg', terrain: 'classic' }, /^the keg mission is fought on keg, not "classic"$/],
  'the keg mission on the fortified set': [{ mission: 'keg', terrain: 'fortified' }, /^the keg mission is fought on keg, not "fortified"$/],
  'the classic mission on the keg set': [{ terrain: 'keg' }, /^the classic mission is fought on classic or fortified, not "keg"$/],
  'the grand mission on the keg set': [{ mission: 'grand', terrain: 'keg' }, /^the grand mission is fought on open or fortified, not "keg"$/],
  'a Field preset in the keg mission': [{ mission: 'keg', seats: [{ ...SETUP.seats[0], army: 'field' }, SETUP.seats[1]] }, /^seat 0's army: \d+ points, over the Skirmish limit of 500$/],
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
    // (F11a, F8b) each race's preset for it, the army a seat naming none
    // plays, legal there: the match fields its counts, unit for unit, in
    // roster order, each seat naming it as it filled it in; and the same
    // match when the seats name the preset, or its counts
    if (core.army) {
      const keys = (X) => X.units.map((u) => `${u.side}:${u.key}`).join(' ')
      for (const [s, { race }] of SETUP.seats.entries()) {
        const want = G.units.filter((u) => u.side === s).map((u) => u.key).join(' ')
        if (G.setup.seats[s].army !== m.army) throw new Error(`P-mission: a match of ${name} fills seat ${s}'s army in as ${JSON.stringify(G.setup.seats[s].army)}, not its preset ${m.army}`)
        const text = core.army.listText(core.army.armyOf(G.setup, s).counts)
        if (want !== core.army.armyOf(G.setup, s).keys.join(' ')) throw new Error(`P-mission: a match of ${name} fields ${want} for seat ${s}, not its preset's units`)
        for (const army of [m.army, text]) {
          const H2 = core.createMatch({ ...SETUP, mission: name, seats: SETUP.seats.map((x) => ({ ...x, army })) })
          if (keys(H2) !== keys(G) || core.stateHash(H2) !== core.stateHash(G)) throw new Error(`P-mission: a match of ${name} with every seat naming ${JSON.stringify(army)} differs from one naming no army (${race}'s preset)`)
        }
        n++
      }
    }
    n++
  }
  return n
}

// (F11a) P-mission's armies: every refusal of DESIGN §4.2.8.4, each with
// its own message, seat-major (every check of seat 0's before any of seat
// 1's) and, within a seat, in the table's order: the army a string, a
// preset of the race's, else a list of counts no longer than the roster,
// then checkList's points, units, models, each role in ROLES order (its
// minimum, then its maximum) and the most of one unit. [seat 0's army,
// seat 1's, the message] (undefined: the seat names none); SETUP's seats
// are the Bushtails' and the Coil's. Code without core/army.js takes no
// army and is held to none of them.
const NO = undefined
const ARMY_REFUSALS = {
  'a number': [NO, 7, /^seat 1's army is a preset's name or a list of counts, not 7$/],
  'a list of digits': [['1', '1'], NO, /^seat 0's army is a preset's name or a list of counts, not \["1","1"\]$/],
  'a record of counts': [{ elder: 1 }, NO, /^seat 0's army is a preset's name or a list of counts, not \{"elder":1\}$/],
  'true': [true, NO, /^seat 0's army is a preset's name or a list of counts, not true$/],
  // (the plural is the orchestrator's call while each race has one
  // preset: either agreement passes)
  // ((F8b) every race's three presets, named in their order)
  'a preset the race lacks': [NO, 'grnad', /^the Coil of Ssithra have no army "grnad" \(there are classic, field, grand\)$/],
  "an Object.prototype member's name": [NO, 'constructor', /^the Coil of Ssithra have no army "constructor" \(there are classic, field, grand\)$/],
  // ('toString' has a capital: no preset's name, so not a list either)
  "toString": ['toString', NO, /^seat 0's army "toString" is neither a preset nor a list of counts$/],
  // ((F8b) a larger battle's preset is a preset like any, held to the
  // mission's own limit: a Skirmish can't field the ×2 or ×3 list)
  "the field preset in a Skirmish": ['field', NO, /^seat 0's army: 970 points, over the Skirmish limit of 500$/],
  "the grand preset in a Skirmish": [NO, 'grand', /^seat 1's army: 1485 points, over the Skirmish limit of 500$/],
  'neither a name nor counts': ['11a', NO, /^seat 0's army "11a" is neither a preset nor a list of counts$/],
  'an empty army': ['', NO, /^seat 0's army "" is neither a preset nor a list of counts$/],
  'a list with a trailing zero': [NO, '1121110', /^seat 1's army "1121110" is neither a preset nor a list of counts$/],
  '__proto__': ['__proto__', NO, /^seat 0's army "__proto__" is neither a preset nor a list of counts$/],
  'a capitalised preset': ['Classic', NO, /^seat 0's army "Classic" is neither a preset nor a list of counts$/],
  'fullwidth digits': ['１１２', NO, /^seat 0's army "１１２" is neither a preset nor a list of counts$/],
  'a list longer than the roster': ['1121113', NO, /^seat 0's list "1121113" counts 7 kinds of unit; the Bushtail Clans muster 6 \(elder oakguard nutkin grenadier glider trebuchet\)$/],
  'a leading zero past the roster': [NO, '0112111', /^seat 1's list "0112111" counts 7 kinds of unit; the Coil of Ssithra muster 6 \(hierophant brute scaleguard spitter sidewinder engine\)$/],
  '515 points': [NO, '100034', /^seat 1's army: 515 points, over the Skirmish limit of 500$/],
  '505 points': ['100233', NO, /^seat 0's army: 505 points, over the Skirmish limit of 500$/],
  'points before a role (540 points, no hero)': ['033', NO, /^seat 0's army: 540 points, over the Skirmish limit of 500$/],
  '37 models': [NO, '106', /^seat 1's army: 37 models; a Skirmish army has at most 36$/],
  'models before a role (41 models, no hero)': [NO, '0061', /^seat 1's army: 41 models; a Skirmish army has at most 36$/],
  'no Troops unit': ['11', NO, /^seat 0's army: no Troops unit; a Skirmish army needs at least 1$/],
  '3 Elite units': ['1301', NO, /^seat 0's army: 3 Elite units; at most 2 in a Skirmish$/],
  '3 Fast units': [NO, '10013', /^seat 1's army: 3 Fast units; at most 2 in a Skirmish$/],
  'no Hero unit': ['001', NO, /^seat 0's army: no Hero unit; a Skirmish army needs at least 1$/],
  '2 Hero units': ['201', NO, /^seat 0's army: 2 Hero units; at most 1 in a Skirmish$/],
  '2 Monster units': [NO, '1201', /^seat 1's army: 2 Monster units; at most 1 in a Skirmish$/],
  '2 Artillery units': ['100102', NO, /^seat 0's army: 2 Artillery units; at most 1 in a Skirmish$/],
  // (ROLES: Troops, Elite, Fast, Hero, Monster, Artillery)
  'the roles in ROLES order (no Troops and 2 Monster units)': [NO, '12', /^seat 1's army: no Troops unit; a Skirmish army needs at least 1$/],
  'the roles in ROLES order (no Hero and 2 Artillery units)': ['000102', NO, /^seat 0's army: no Hero unit; a Skirmish army needs at least 1$/],
  '4 Nutkin': ['104', NO, /^seat 0's army: 4 Nutkin; at most 3 of one unit in a Skirmish army$/],
  '4 Spitters': [NO, '1004', /^seat 1's army: 4 Spitters; at most 3 of one unit in a Skirmish army$/],
  'a role before the most of one unit (4 Nutkin, no hero)': ['004', NO, /^seat 0's army: no Hero unit; a Skirmish army needs at least 1$/],
  // seat-major: seat 0's first broken rule, however late a check, before
  // seat 1's, however early
  "both seats broken: seat 0's late rule first": ['11', 7, /^seat 0's army: no Troops unit/],
  "both seats broken: seat 0's list, seat 1's preset": ['1121113', 'grnad', /^seat 0's list "1121113" counts 7 kinds/],
  'both seats broken alike': ['11a', '11a', /^seat 0's army "11a" is neither/],
  'seat 0 legal, seat 1 broken': ['112111', '104', /^seat 1's army: 4 Scaleguard; at most 3 of one unit in a Skirmish army$/],
}
// [what, the Bushtails' counts (for checkList with the points lifted: no
// Skirmish list reaches 11 units under 500 points), the reason]: the units
// before the models
const LIFTED = [
  ['11 units (and 47 models)', [1, 0, 3, 3, 3, 1], /^11 units; a Skirmish army has at most 10$/],
  ['37 models in 7 units', [1, 0, 6], /^37 models; a Skirmish army has at most 36$/],
]
function armyTask(core, { MISSIONS, checkMission }, RACES) {
  let n = 0
  const A = core.army
  const seatsOf = (a0, a1) => SETUP.seats.map((x, i) => {
    const army = i ? a1 : a0
    return army === NO ? { ...x } : { ...x, army }
  })
  for (const [name, [a0, a1, want]] of Object.entries(ARMY_REFUSALS)) {
    const setup = { ...SETUP, seats: seatsOf(a0, a1) }
    const written = JSON.stringify(setup)
    // fullSetup itself, then createMatch, each refusing with the message
    for (const [how, f] of [['fullSetup', core.fullSetup], ['createMatch', core.createMatch]]) {
      let why = null
      try {
        f(setup)
      } catch (e) {
        if (!(e instanceof Error) || e instanceof TypeError || e instanceof RangeError) throw new Error(`P-mission: ${how} crashes on a setup with ${name} instead of refusing it: ${e?.message ?? e}`)
        why = e.message
      }
      if (why === null) throw new Error(`P-mission: ${how} takes a setup with ${name} (${JSON.stringify(setup.seats.map((x) => x.army))})`)
      if (!want.test(why)) throw new Error(`P-mission: a setup with ${name} is refused by ${how} as "${why}", not ${want}`)
    }
    if (JSON.stringify(setup) !== written) throw new Error(`P-mission: refusing a setup with ${name} changed it`)
    n++
  }
  const rules = MISSIONS.classic.list, lifted = { ...rules, points: 9999 }
  for (const [what, counts, want] of LIFTED) {
    const why = A.checkList(RACES.squirrel, lifted, counts)
    if (!want.test(why ?? '')) throw new Error(`P-mission: checkList (points lifted) gives ${JSON.stringify(why)} for ${what}, not ${want}`)
    n++
  }
  // the classic preset named, its counts and no army: one battle, unit for
  // unit and hash for hash; a null army is a field left out. The start's
  // setup as written keeps no army; the filled-in one names the preset
  const spellings = [['no army', NO], ['null', null], ["'classic'", 'classic'], ["'112111'", '112111']]
  const played = spellings.map(([what, army]) => {
    const setup = { ...SETUP, seats: SETUP.seats.map((x) => (army === NO ? { ...x } : { ...x, army })) }
    const G = core.createMatch(setup)
    if (army == null && setup.seats.some((x) => x.army != null)) throw new Error(`P-mission: createMatch wrote an army into the setup as written (${what})`)
    const want = army ?? 'classic'
    if (G.setup.seats.some((x) => x.army !== want)) throw new Error(`P-mission: a setup with ${what} plays seats naming ${JSON.stringify(G.setup.seats.map((x) => x.army))}, not ${JSON.stringify(want)}`)
    return { what, hash: core.stateHash(G), keys: G.units.map((u) => `${u.id}:${u.side}:${u.key}`).join(' '), trace: G.journal.trace.join('\n') }
  })
  for (const p of played.slice(1)) {
    if (p.hash !== played[0].hash || p.keys !== played[0].keys || p.trace !== played[0].trace) throw new Error(`P-mission: a setup with ${p.what} makes another match than one with no army (stateHash ${p.hash} against ${played[0].hash}; units ${p.keys === played[0].keys ? 'alike' : 'apart'})`)
  }
  // ... and an all-AI battle to its end, alike
  const ai = spellings.map(([what, army]) => {
    const G = core.createMatch({ board: 64, dice: 89, seats: SETUP.seats.map((x) => ({ ...x, ctrl: 'ai', ...(army === NO ? {} : { army }) })) })
    return { what, hash: core.stateHash(G), n: G.journal.trace.length }
  })
  for (const p of ai.slice(1)) if (p.hash !== ai[0].hash || p.n !== ai[0].n) throw new Error(`P-mission: board 64, dice 89 with ${p.what} ends ${p.hash} after ${p.n} trace lines, with no army ${ai[0].hash} after ${ai[0].n}`)
  n += spellings.length
  // checkMission's list rules (the slot table F8b and F9a extend): takes a
  // slot maximum of 10 and a [0, 0] slot; refuses a perKind of 10, a slot
  // with min > max or max > units, minimums summing past units
  const edit = (f) => {
    const m = structuredClone(MISSIONS.classic)
    f(m.list)
    try {
      checkMission('test', m)
      return null
    } catch (e) {
      return e.message
    }
  }
  for (const [what, f] of [['a slot maximum of 10', (l) => (l.roles.Troops = [1, 10])], ['a [0, 0] slot', (l) => (l.roles.Monster = [0, 0])]]) {
    const why = edit(f)
    if (why !== null) throw new Error(`P-mission: checkMission refuses ${what}: ${why}`)
    n++
  }
  for (const [what, f, want] of [
    ['a perKind of 10', (l) => (l.perKind = 10), /perKind is 10/],
    ['a slot with min > max', (l) => (l.roles.Fast = [2, 1]), /Fast slot is \[2,1\]/],
    ['a slot with max > units', (l) => (l.roles.Troops = [1, 11]), /Troops slot is \[1,11\]/],
    ['minimums summing past units', (l) => Object.assign(l.roles, { Troops: [6, 6], Elite: [2, 2], Fast: [2, 2], Hero: [1, 1] }), /minimums sum to 11 units, over its 10/],
  ]) {
    const why = edit(f)
    if (!want.test(why ?? '')) throw new Error(`P-mission: checkMission ${why ? `refuses ${what} as "${why}"` : `takes ${what}`}, not ${want}`)
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

// ── (F11a) P-army ───────────────────────────────────────────────────────────
// A seat's `army` is a field any peer may write (a lobby's, a start's), so
// whatever it holds must come back refused for a reason or taken in its one
// spelling, never crash the fold; and every list the builder's tools make
// plays (DESIGN §4.2.9's P-army row):
//   fuzz    `n` fuzzed armies (numbers, bigints, arrays, records, records
//           with no prototype or a throwing toJSON, cycles, a deep nest, a
//           Proxy, symbols, functions, letters, unicode and lone
//           surrogates, digit strings with leading and trailing zeros,
//           over-long ones, Object.prototype's names, presets misspelt,
//           and legal lists among them), in one seat or both, through
//           fullSetup. A refusal is an Error (never a TypeError or a
//           RangeError, nor anything else thrown) whose message starts
//           "seat N's" or "the <race> have no army", N the seat fuzzed;
//           with both seats fuzzed it is seat 0's own refusal if seat 0
//           has one, else seat 1's (seat-major). A taking is a string (or
//           nothing: the preset): a preset's name or a list of counts, and
//           it round-trips (listText(armyOf(…).counts) is the list, or the
//           preset's digits), its units the digit sum, in roster order;
//           the first 60 lists taken made into matches, each seat's units
//           those keys, ids from 1
//   sweep   autoList over seeds 1-1,000 × every race × every mission: legal
//           (checkList), deterministic, its text a list, its units the
//           digit sum in roster order (armyOf's keys, keysOf's)
//   shadow  three corpus battles (an AI pair, a hotseat log, a vs-AI log)
//           folded with no army, 'classic' and '112111' on every seat: the
//           same shadowState before every entry and at the end, and the
//           stateHash data-check pins for them (V1, unchanged through
//           CORE_VERSION 5: F11a moved nothing in the hash)
//   games   random legal lists (autoList on random budgets from 60% to
//           100% of the limit, mirror matches included) played to the end
//           under `strict`: AI against AI (each seat's units its list's,
//           G's invariants at the end, the result the score's or the
//           wipe's, every trace line in the trace's format), and some with
//           a human seat answered at random as (3)'s games are, with
//           P-prop's invariants at every command boundary
// (the stateHash pins of data-check's section 10, V1: the classic corpus
// hashes as under CORE_VERSION 1 through every version since)
const V1_PINS = {
  '64-89': { end: 'chz79qx8m5' },
  'hotseat-late-8': { 0: '24ujeexicjn', 20: 'xxpycs4cb', 60: '192m554xi18', end: '2dcycb5g9uv' },
  'serpent-random-2': { 0: '23nc969d48c', 10: '1hdl5k2u5af', end: '29rym70iz9j' },
}
// (6, F7a's height, as data-check's PINNED: classic boards build none; 7,
// F8b's missions, open set and fight guard, which a classic battle meets as
// before; 8, F17's lobbing from height, which needs height; 9, F18's
// shooting into a fight, the format unchanged, but 64-89 another battle
// under it: its end data-check's V9; 10, F19a's powder keg, which no
// classic board has: the pins as under 9)
const PINNED_UNDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const PINS_UNDER = (v) => (v >= 9 ? { ...V1_PINS, '64-89': { end: '1jmxq628imf' } } : V1_PINS)

// Every trace line in the format core/journal.js writes (DESIGN §4.1: the
// trace is frozen): a battle-log line, or a state line (act, a phase, a
// round, over) listing every unit of the match by id from 1, its position
// to 3 decimals and each model's wounds, then the chunks, the score and the
// dice. Returns the first line that isn't, or null.
const LOG_LINE = /^log -?\d+ [\s\S]*rng:\d+#[0-9a-z]+$/
const STATE_LINE = /^(act|over|round \d+|phase [01]:[a-z]+) ((?:\d+:-?\d+\.\d{3},-?\d+\.\d{3},\d+(?:\/\d+)* ?)+) chunks:\d+ vp:\d+-\d+ rng:\d+#[0-9a-z]+$/
function traceShape(G) {
  for (const [i, l] of G.journal.trace.entries()) {
    if (LOG_LINE.test(l)) continue
    const m = STATE_LINE.exec(l)
    const ids = m ? m[2].trim().split(' ').map((u) => Number(u.split(':')[0])) : null
    if (!ids || ids.length !== G.units.length || ids.some((id, k) => id !== k + 1)) return `trace line ${i + 1} isn't in the trace's format: ${l.slice(0, 100)}`
  }
  return null
}

// each seat's units against its list: G.units seat 0's then seat 1's, each
// in roster order (§4.1 rule 23), ids from 1
function unitsAre(core, G, RACES, where) {
  const want = G.setup.seats.flatMap((x, side) => core.army.keysOf(RACES[x.race], x.army).map((key) => `${side}:${key}`))
  const got = G.units.map((u) => `${u.side}:${u.key}`)
  if (got.join() !== want.join()) throw new Error(`${where}: the match fields ${got.join(' ')}, not its lists' ${want.join(' ')}`)
  if (G.units.some((u, i) => u.id !== i + 1)) throw new Error(`${where}: unit ids ${G.units.map((u) => u.id).join(',')}, not counting from 1`)
}

// A fuzzed army (`list`: a legal list of the seat's race, as text, which
// some of the values are made from).
const NAMES = ['__proto__', 'constructor', 'toString', 'hasOwnProperty', 'valueOf', 'prototype', 'classic', 'Classic', 'classic ', ' classic', 'CLASSIC', 'field', 'grand', 'auto', 'random', 'null', 'undefined', 'NaN', 'Infinity', '', ' ', '\u0000', '-', 'a', 'z9', 'a-', '1e3', '0x1', '+1', '-1', '1.5', ' 1', '1 ', '١١٢', '１２', '1\n', '​1']
function fuzzValue(rand, list) {
  const int = (n) => Math.floor(rand() * n)
  const digits = (n, lo = 0) => Array.from({ length: n }, () => String(lo + int(10 - lo))).join('')
  switch (int(26)) {
    case 0: return int(2e6) - 1e6
    case 1: return (rand() - 0.5) * Math.pow(10, int(15))
    case 2: return [NaN, Infinity, -Infinity, -0, 0, 1, 112111, Number.MAX_VALUE, Number.MIN_VALUE, 2 ** 53, -(2 ** 53)][int(11)]
    case 3: return BigInt(int(1e9)) * 1000n
    case 4: return rand() < 0.5
    case 5: return Array.from({ length: int(8) }, () => (rand() < 0.5 ? int(10) : String(int(10))))
    case 6: return list.split('').map(Number)
    case 7: return { [NAMES[int(NAMES.length)] || 'x']: int(4), elder: int(3) }
    case 8: return Object.assign(Object.create(null), { list, n: int(9) })
    case 9: return { toString: () => list, valueOf: () => Number(list), toJSON: () => list }
    case 10: return { toJSON() {
      throw new Error('no JSON')
    } }
    case 11: {
      const o = { list }
      o.self = o
      return o
    }
    case 12: {
      let v = list
      for (let k = 0; k < 4000; k++) v = [v]
      return v
    }
    case 13: return new Proxy({}, { ownKeys() {
      throw new Error('a trap')
    }, get() {
      throw new Error('a trap')
    } })
    case 14: return rand() < 0.5 ? Symbol(list) : () => list
    case 15: return new String(list)
    case 16: return Array.from({ length: 1 + int(12) }, () => String.fromCharCode(97 + int(26))).join('')
    case 17: return Array.from({ length: 1 + int(8) }, () => String.fromCodePoint(rand() < 0.3 ? 0xd800 + int(0x800) : int(0x110000))).join('')
    case 18: return digits(int(13))
    case 19: return '0'.repeat(1 + int(3)) + list
    case 20: return list + '0'.repeat(1 + int(3))
    case 21: return digits(14 + int(200), 1)
    case 22: return NAMES[int(NAMES.length)]
    case 23: {
      // a legal list nudged: a digit changed, one dropped, one added
      const at = int(list.length), d = String(int(10))
      return [list.slice(0, at) + d + list.slice(at + 1), list.slice(0, -1), list + d, d + list][int(4)]
    }
    case 24: return rand() < 0.5 ? null : undefined
    default: return rand() < 0.3 ? 'classic' : list
  }
}

// The fuzz: `n` cases, `seed`'s stream. Returns its counts.
function fuzzTask(core, RACES, MISSIONS, n, seed) {
  const A = core.army, rand = mulberry32(seed)
  const races = Object.keys(RACES), missions = Object.keys(MISSIONS)
  const int = (k) => Math.floor(rand() * k)
  const counts = { fuzzed: 0, refused: 0, taken: 0, roundTrips: 0, both: 0, made: 0 }
  // a legal list of `race` at `mission`, as text (from 60% of the limit)
  const legal = (race, mission) => {
    const rules = MISSIONS[mission].list
    return A.listText(A.autoList(RACES[race], { ...rules, points: rules.points - 5 * int(rules.points / 12.5) }, int(2 ** 32)))
  }
  // fullSetup's verdict: the setup, or the error thrown
  const verdict = (setup) => {
    try {
      return { s: core.fullSetup(setup) }
    } catch (e) {
      return { e }
    }
  }
  const show = (v) => {
    try {
      return typeof v === 'string' ? JSON.stringify(v).slice(0, 40) : typeof v === 'object' && v !== null ? `a ${Array.isArray(v) ? 'list' : 'record'}` : String(v).slice(0, 40)
    } catch {
      return typeof v
    }
  }
  for (let k = 0; k < n; k++) {
    const mission = missions[int(missions.length)]
    const race = [0, 1].map(() => (rand() < 0.6 ? ['squirrel', 'serpent'][int(2)] : races[int(races.length)]))
    const lists = race.map((r) => legal(r, mission))
    const seat = int(2), both = rand() < 0.2
    const army = [0, 1].map((i) => (i === seat || both ? fuzzValue(rand, lists[i]) : rand() < 0.5 ? lists[i] : undefined))
    const setupOf = (a) => ({ board: 1 + int(1e6), dice: 1 + int(1e9), mission, seats: [0, 1].map((i) => ({ race: race[i], ctrl: 'human', ...(a[i] === undefined && rand() < 0.5 ? {} : { army: a[i] }) })) })
    const setup = setupOf(army)
    const where = `P-army fuzz case ${k} (seat ${both ? '0 and 1' : seat}: ${army.map(show).join(' | ')}, ${race.join(' v ')})`
    const v = verdict(setup)
    counts.fuzzed++
    if (v.e) {
      const e = v.e
      if (!(e instanceof Error) || e instanceof TypeError || e instanceof RangeError) throw new Error(`${where}: fullSetup crashes (${e?.constructor?.name ?? typeof e}: ${e?.message ?? String(e)}) instead of refusing the army`)
      const by = (i) => `seat ${i}'s `, raceSays = (i) => `the ${RACES[race[i]].name} have no army `
      const named = [0, 1].filter((i) => e.message.startsWith(by(i)) || e.message.startsWith(raceSays(i)))
      if (!named.length) throw new Error(`${where}: refused as "${e.message.slice(0, 120)}", which names no seat's army`)
      if (!both && !named.includes(seat)) throw new Error(`${where}: refused as "${e.message.slice(0, 120)}", naming another seat than the one fuzzed`)
      if (both) {
        // seat-major: seat 0's own refusal (seat 1 at its preset) if it has
        // one, else seat 1's (seat 0 at its preset)
        counts.both++
        const alone0 = verdict(setupOf([army[0], undefined])), alone1 = verdict(setupOf([undefined, army[1]]))
        const want = alone0.e ?? alone1.e
        if (!want || want.message !== e.message) throw new Error(`${where}: both seats fuzzed, refused as "${e.message.slice(0, 100)}", not seat-major ("${want?.message.slice(0, 100) ?? 'taken'}")`)
      }
      counts.refused++
      continue
    }
    // taken: each seat's army a string (absent: the preset), in its one spelling
    counts.taken++
    for (const i of [0, 1]) {
      const r = RACES[race[i]], given = army[i], filled = v.s.seats[i].army
      if (given != null && typeof given !== 'string') throw new Error(`${where}: fullSetup takes seat ${i}'s army ${show(given)}, which is no string`)
      if (filled !== (given ?? MISSIONS[mission].army)) throw new Error(`${where}: seat ${i}'s army filled in as ${show(filled)}`)
      const got = A.armyOf(v.s, i)
      const text = A.listText(got.counts)
      const preset = Object.hasOwn(r.armies, filled) ? filled : null
      if (got.preset !== preset || text !== (preset ? r.armies[preset] : filled)) throw new Error(`${where}: seat ${i}'s ${show(filled)} reads back as '${text}' (preset ${got.preset}), not in its one spelling`)
      const sum = [...text].reduce((s, d) => s + Number(d), 0)
      const order = got.keys.map((key) => r.roster.indexOf(key))
      if (got.keys.length !== sum || order.some((x, j) => x < 0 || (j && x < order[j - 1]))) throw new Error(`${where}: seat ${i}'s '${text}' fields ${got.keys.join(' ')}: not ${sum} units in roster order`)
      if (A.checkList(r, MISSIONS[mission].list, got.counts) !== null) throw new Error(`${where}: seat ${i}'s '${text}' is taken, but checkList says ${A.checkList(r, MISSIONS[mission].list, got.counts)}`)
      counts.roundTrips++
    }
    // the first lists taken, made into matches (human seats: each stops at
    // its deployment)
    if (counts.made < 60 && army.some((x) => typeof x === 'string' && x !== 'classic')) {
      const G = core.createMatch(setup)
      unitsAre(core, G, RACES, where)
      counts.made++
    }
  }
  if (!counts.refused || !counts.taken || !counts.both || (n >= 1000 && counts.made < 10)) throw new Error(`P-army: the fuzz never met every outcome (${JSON.stringify(counts)})`)
  return counts
}

// The sweep: autoList over seeds 1-1,000 × every race × every mission.
function sweepTask(core, RACES, MISSIONS) {
  const A = core.army
  let n = 0
  for (const [mission, m] of Object.entries(MISSIONS)) {
    for (const [key, r] of Object.entries(RACES)) {
      for (let seed = 1; seed <= 1000; seed++) {
        const where = `P-army: autoList(${key}, ${mission}, ${seed})`
        const counts = A.autoList(r, m.list, seed)
        const why = A.checkList(r, m.list, counts)
        if (why !== null) throw new Error(`${where} is illegal: ${why}`)
        if (A.autoList(r, m.list, seed).join() !== counts.join()) throw new Error(`${where} draws another list the second time`)
        const text = A.listText(counts)
        if (!A.LIST.test(text) || text.length > r.roster.length) throw new Error(`${where} writes '${text}', which is no list of counts`)
        const sum = counts.reduce((s, x) => s + x, 0)
        const { keys } = A.armyOf({ mission, seats: [{ race: key, ctrl: 'ai', army: text }, { race: key, ctrl: 'ai' }] }, 0)
        const order = keys.map((k) => r.roster.indexOf(k))
        if (keys.length !== sum || order.some((x, j) => x < 0 || (j && x < order[j - 1])) || A.keysOf(r, text).join() !== keys.join()) throw new Error(`${where}: '${text}' fields ${keys.join(' ')}: not its ${sum} units in roster order`)
        n++
      }
    }
  }
  return n
}

// The shadow: corpus battles folded under three spellings of the classic
// army, against each other and data-check's pins.
function shadowTask(core) {
  const { items } = loadCorpus()
  let n = 0
  for (const id of Object.keys(V1_PINS)) {
    const job = items.find((x) => x.id === id).job, entries = job.entries ?? []
    const states = [undefined, 'classic', '112111'].map((army) => {
      const setup = jobSetup(job)
      const G = core.createMatch(army ? { ...setup, seats: setup.seats.map((x) => ({ ...x, army })) } : setup, { out: null })
      const out = []
      for (let k = 0; k <= entries.length; k++) {
        out.push([k, core.shadowState(G), core.stateHash(G)])
        if (k < entries.length) {
          const { s, ...b } = entries[k]
          core.apply(G, s, b)
        }
      }
      return out
    })
    for (const [j, what] of [[1, "'classic'"], [2, "'112111'"]]) {
      const k = states[j].findIndex(([, sh], i) => sh !== states[0][i][1])
      if (k >= 0) throw new Error(`P-army: ${id} with ${what} on every seat prints another shadowState than with no army, before entry ${k}`)
    }
    if (PINNED_UNDER.includes(core.CORE_VERSION)) {
      for (const [at, want] of Object.entries(PINS_UNDER(core.CORE_VERSION)[id])) {
        const k = at === 'end' ? entries.length : Number(at)
        if (states[0][k][2] !== want) throw new Error(`P-army: ${id}'s stateHash ${at === 'end' ? 'at its end' : `before entry ${k}`} is ${states[0][k][2]}, not ${want} as data-check pins it: a classic match's shadowState moved`)
        n++
      }
    }
    n++
  }
  return n
}

// `n` AI-against-AI battles between random legal lists at `mission`, from
// `seed`'s stream.
function armyGamesTask(core, RACES, MISSIONS, mission, n, seed) {
  const A = core.army, rand = mulberry32(seed * 2246822519 + 3)
  const int = (k) => Math.floor(rand() * k)
  const races = Object.keys(RACES), rules = MISSIONS[mission].list
  const ends = { score: 0, wipe: 0 }, budgets = []
  for (let k = 0; k < n; k++) {
    const race = [0, 1].map(() => (rand() < 0.7 ? ['squirrel', 'serpent'][int(2)] : races[int(races.length)]))
    const army = race.map((r) => {
      const budget = rules.points - 5 * int(rules.points / 12.5)
      budgets.push(budget)
      return A.listText(A.autoList(RACES[r], { ...rules, points: budget }, int(2 ** 32)))
    })
    const setup = { board: int(2 ** 32), dice: int(2 ** 32), mission, seats: [0, 1].map((i) => ({ race: race[i], ctrl: 'ai', army: army[i] })) }
    const where = `P-army game ${seed}.${k} (${JSON.stringify(setup)})`
    let G
    try {
      G = core.createMatch(setup, { out: [], strict: true })
    } catch (e) {
      throw new Error(`${where}: ${e.stack}`)
    }
    if (G.turn.stage !== 'over') throw new Error(`${where}: an AI battle stopped at ${G.turn.stage}`)
    unitsAre(core, G, RACES, where)
    invariants(core, G, `${where} at its end`)
    ends[result(G, where, -1)]++
    const bad = traceShape(G)
    if (bad) throw new Error(`${where}: ${bad}`)
  }
  return { listGames: n, ends, budgets: [Math.min(...budgets), Math.max(...budgets)] }
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
//  - (F7a's review, heightTask too) the rules the random games pass by
//    without judging, each on a scene of its own: the keep's objective held
//    from its top and not from its foot (controlOf); a template landing on a
//    deck sparing the models on the ground below it within its horizontal
//    reach (blastLands, in 3D); a wrecker's smash on the ground skipping a
//    piece standing on a deck (smashAround, by `base`); a pile-in onto a
//    ledge's band refused, one onto open deck taken (closeRanks); and a
//    charge onto a deck's top taken beside an enemy on the ground below
//    (chargePlan's other enemies, at their own level only);
//  - P-level: levelDist equals a reference Dijkstra over the gate graph
//    (every gate's two ends, a and b; the straight line between any two on
//    one level, each gate at its cost; the ladders only for a climber; (the
//    review) a point partway up a stair joined to its foot too; no way at
//    all, the straight line), for a climber and a non-climber, on
//    LEVEL_PAIRS random point pairs per fortified board (half of the points
//    on raised cells), to 1e-9: on HEIGHT_BOARDS Skirmish boards, and (the
//    review) on GRAND_LEVEL Grand-sized ones (the grand mission's table,
//    80×56 with its 14" zones and nine objectives, from the code's own
//    data/mission.js, built straight from its Terrain and NavGrid; until the
//    merged build's gate a copy of the Grand fixture's table, the same
//    board), where bastions stand and a deck can be a shortcut between two
//    ground points;
//  - (F17, code with rangeOf) lobbing from height, lobPairs on every
//    fortified board: each unit with a ranged weapon put on random cells,
//    raised and on the ground, against an enemy on others (LOB_PAIRS a
//    unit): rangeOf is the physics' reach bit for bit (a lobbed weapon,
//    blast or indirect and no spell, √(R² + 2hR), h the shooter's floor less
//    the target's; anything else its printed range); shotInfo refuses as
//    out of range exactly the gaps past it; the AI's shotValue is 0 past
//    it; and the scenes only the lob decides: from a deck at the ground past
//    the printed range, a shot taken (and the AI valuing it, an indirect
//    weapon at an enemy in no fight, (F18) none of its own under the
//    template there), and up at a deck within the printed range, refused.
const HEIGHT_BOARDS = 12, LEVEL_PAIRS = 1000, GRAND_LEVEL = 12, LOB_PAIRS = 40
// a charge spot's reach of another enemy: its base and the charger's, and
// ENGAGE (core/actions/charge.js's test)
const R0 = (e, u) => e.r + u.r + 1
// the grand mission's table (its board, zones and objectives as
// core/match.js makes G.objectives of them)
const grandTable = (MISSIONS) => {
  const m = MISSIONS?.grand
  if (!m) throw new Error('P-level needs the grand mission for its Grand-sized boards (code from before F8b has none)')
  return { W: m.board.W, H: m.board.H, deploy: m.deploy, objectives: m.objectives.map((p, i) => ({ i, x: p.x, z: p.z })) }
}

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
// two ends), O(n²), with no shortcut of levelDist's: (the review) every way
// the graph has, a deck crossed as a shortcut between two ground points
// included, and a point partway up a stair (its cell's floor that stair's,
// nav.rampOf, the stair rising to the point's level) joined straight to the
// stair's foot as well
function gateDijkstra(nav, a, b, climb) {
  const nodes = [{ p: a, L: nav.levelAt(a.x, a.z) }, { p: b, L: nav.levelAt(b.x, b.z) }]
  const gates = nav.gates.filter((g) => climb || !g.ladder)
  for (const g of gates) nodes.push({ p: g.lo, L: 0 }, { p: g.hi, L: g.level })
  // (a and b's own stairs: [node, gate's foot node] each)
  const extra = []
  for (const e of [0, 1]) {
    const { p, L } = nodes[e], i = nav.index(p.x, p.z)
    if (!L || i < 0 || !nav.rampOf || nav.rampOf[i] < 0) continue
    const k = gates.findIndex((g) => !g.ladder && g.id === nav.rampOf[i])
    if (k >= 0 && gates[k].level === L) extra.push([e, 2 + 2 * k])
  }
  const n = nodes.length, d = new Array(n).fill(Infinity), done = new Array(n).fill(false)
  const dist = (u, v) => Math.hypot(nodes[u].p.x - nodes[v].p.x, nodes[u].p.z - nodes[v].p.z)
  d[0] = 0
  for (;;) {
    let u = -1
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || d[i] < d[u])) u = i
    if (u < 0 || !isFinite(d[u])) break
    done[u] = true
    for (let v = 0; v < n; v++) if (nodes[v].L === nodes[u].L) d[v] = Math.min(d[v], d[u] + dist(u, v))
    if (u >= 2) {
      const k = (u - 2) >> 1, v = (u - 2) % 2 ? u - 1 : u + 1
      d[v] = Math.min(d[v], d[u] + gates[k].cost)
    }
    for (const [x, y] of extra) {
      if (u === x) d[y] = Math.min(d[y], d[u] + dist(x, y))
      else if (u === y) d[x] = Math.min(d[x], d[u] + dist(x, y))
    }
  }
  return isFinite(d[1]) ? d[1] : Math.hypot(a.x - b.x, a.z - b.z)
}

// P-level over one board's nav: LEVEL_PAIRS random pairs (half the points
// on raised cells), climbing and not, against the reference
function levelPairs(q, G, nav, rand, where, counts) {
  const raised = []
  for (let i = 0; i < nav.N; i++) if (nav.level[i]) raised.push(i)
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

// (F7a's review) Run fn with only the units in `keep` standing (the rest's
// counts set to 0 and back, with every unit's place, whatever fn does)
function only(G, keep, fn) {
  const saved = G.units.map((u) => ({ u, alive: u.alive, x: u.pos.x, z: u.pos.z, r: u.r, models: u.models.map((m) => ({ ...m })) }))
  for (const u of G.units) if (!keep.includes(u)) u.alive = 0
  try {
    return fn()
  } finally {
    for (const { u, alive, x, z, r, models } of saved) {
      u.alive = alive
      u.pos.x = x
      u.pos.z = z
      u.r = r
      models.forEach((m, k) => Object.assign(u.models[k], m))
    }
  }
}

// (F7a's review) The height rules the random games pass by without judging,
// each on a scene of its own on one fortified board (G: a fresh match, its
// scene changed and put back; the blast and the smash on a match of their
// own, `fresh`, as they change the table): what each found goes in counts
function heightScenes(core, mods, G, fresh, where, counts) {
  const q = core.q, nav = G.nav, HIGH = q.HIGH, STEP = mods.nav.STEP
  const put = (u, x, z) => {
    u.pos.x = x
    u.pos.z = z
  }
  const cells = (pred) => {
    const out = []
    for (let i = 0; i < nav.N; i++) if (pred(i)) out.push(i)
    return out
  }
  const climbers = (side) => G.units.filter((u) => u.side === side && !u.t.fly && u.t.climb)
  // the keep's objective held from its top (its foot is out of range: the
  // deck's 3" half-width and the ledge's band keep every model on the ground
  // 0.6" or more past OBJECTIVE_RANGE and its base; a deck beside a ground
  // objective, which the height rule parts, is the Grand-sized boards'
  // scene, controlScene)
  const keep = G.terrain.chunks.find((c) => c.kind === 'deck' && c.look?.recipe === 'keep')
  const o = G.objectives.find((x) => x.x === 0 && x.z === 0)
  if (keep && o) {
    const oy = q.floorAt(G, o.x, o.z), u = climbers(0)[0]
    const near = (i) => u.models.some((m) => m.alive && Math.hypot(nav.x(i) + m.ox - o.x, nav.z(i) + m.oz - o.z) <= 3 + u.t.base)
    const top = cells((i) => Math.abs(nav.floor[i] - oy) <= HIGH && nav.level[i] && nav.standable(i, u.r, 'walk') && near(i))
    if (top.length) {
      only(G, [u], () => {
        put(u, nav.x(top[0]), nav.z(top[0]))
        if (q.controlOf(G, o) !== u.side) throw new Error(`${where}: unit ${u.id} (${u.t.short}) on the keep's top (cell ${top[0]}) doesn't hold its objective: ${q.controlOf(G, o)}`)
        counts.keepTop++
      })
    }
  }
  // a pile-in onto a ledge's band refused, onto open deck taken: a squad on a
  // deck cut to one model, its foe on the same deck (closeRanks piles it in
  // toward the foe, by its gap less ENGAGE − 0.3)
  const sq = climbers(0).filter((u) => u.models.length >= 3).reduce((x, y) => (!x || y.r > x.r ? y : x), null)
  const foe = climbers(1).reduce((x, y) => (!x || y.r < x.r ? y : x), null)
  if (sq && foe) {
    const r1 = sq.t.base, deck = cells((i) => nav.level[i] && nav.floor[i] > STEP)
    let refused = null, taken = null
    for (let k = 0; k < deck.length && !(refused && taken); k += 3) {
      const i = deck[k]
      if (!(nav.cliff[i] >= r1 - 0.06)) continue
      for (const j of deck) {
        if (Math.abs(nav.floor[j] - nav.floor[i]) > HIGH) continue
        const d = Math.hypot(nav.x(i) - nav.x(j), nav.z(i) - nav.z(j))
        if (d - sq.r - foe.r > 1.05 || d - sq.r - foe.r < 0.1 || d - r1 - foe.r <= 1.05) continue
        const step = d - r1 - foe.r - 0.7, x = nav.x(i) + ((nav.x(j) - nav.x(i)) / d) * step, z = nav.z(i) + ((nav.z(j) - nav.z(i)) / d) * step
        const ok = nav.standable(nav.index(x, z), r1, 'walk')
        if (!ok && !refused) refused = [i, j]
        else if (ok && !taken) taken = [i, j]
        if (refused && taken) break
      }
    }
    for (const [pair, want] of [[refused, false], [taken, true]]) {
      if (!pair) continue
      only(G, [sq, foe], () => {
        put(sq, nav.x(pair[0]), nav.z(pair[0]))
        put(foe, nav.x(pair[1]), nav.z(pair[1]))
        if (!q.engagedWith(G, sq).includes(foe)) throw new Error(`${where}: the pile-in scene's two units (cells ${pair[0]} and ${pair[1]}) aren't engaged`)
        for (const m of sq.models.slice(1)) m.alive = false
        sq.alive = 1
        mods.damage.closeRanks(G, sq)
        const moved = sq.pos.x !== nav.x(pair[0]) || sq.pos.z !== nav.z(pair[0])
        if (moved !== want) throw new Error(`${where}: closeRanks ${moved ? 'piled' : "didn't pile"} unit ${sq.id} in from deck cell ${pair[0]} toward cell ${pair[1]}${want ? ', onto standable deck' : ', onto a ledge\'s band'} (it stands at (${sq.pos.x}, ${sq.pos.z}))`)
        counts[want ? 'pileIn' : 'pileRefused']++
      })
    }
  }
  // a charge onto a deck's top beside an enemy on the ground below: the
  // target on a deck's rim, the charger on the same deck; then the other
  // enemy put on the ground below one of the charge's spots, within 1" of
  // it across the ledge: the spot stays one, and no spot lies within 1" of
  // an enemy at its own level
  // (the target and the charger the smallest climbers, so they stand nearest
  // the rim; the enemy below the biggest walker: the ledges' bands keep a
  // small base on the ground more than 1" from any on the deck above, and
  // only a big one's reaches within it, by a few hundredths)
  const small = (us) => us.reduce((x, y) => (!x || y.r < x.r ? y : x), null)
  const other = G.units.filter((e) => e.side === 1 && !e.t.fly).reduce((x, y) => (!x || y.r > x.r ? y : x), null)
  const ch = small(climbers(0)), tg = small(climbers(1).filter((e) => e !== other))
  if (ch && tg && other) {
    const tops = cells((i) => nav.level[i] && nav.floor[i] > HIGH && nav.standable(i, tg.r, 'walk') && nav.cliff[i] < tg.r + 0.5)
    let found = false
    for (let k = 0; k < tops.length && k < 400 && !found; k++) {
      const t = tops[k]
      const near = (c) => Math.hypot(nav.x(c) - nav.x(t), nav.z(c) - nav.z(t))
      const from = cells((c) => nav.level[c] === nav.level[t] && nav.standable(c, ch.r, 'walk') && near(c) > tg.r + ch.r + 2).sort((x, y) => near(x) - near(y))
      if (!from.length) continue
      only(G, [ch, tg, other], () => {
        put(tg, nav.x(t), nav.z(t))
        put(ch, nav.x(from[0]), nav.z(from[0]))
        // (the other enemy far off while the spots are found)
        put(other, -nav.W, -nav.H)
        const first = q.chargePlan(G, ch, tg)
        for (const sp of first?.spots ?? []) {
          const sx = nav.x(sp.i), sz = nav.z(sp.i), R = R0(other, ch) - 0.01
          const j = cells((c) => nav.floor[c] <= STEP && Math.abs(nav.floor[sp.i] - nav.floor[c]) > HIGH && nav.standable(c, other.r, 'walk') && Math.hypot(nav.x(c) - sx, nav.z(c) - sz) < R)[0]
          if (j === undefined) continue
          put(other, nav.x(j), nav.z(j))
          const plan = q.chargePlan(G, ch, tg)
          if (!plan?.spots.some((x) => x.i === sp.i)) throw new Error(`${where}: a charge's spot on deck cell ${sp.i} (floor ${nav.floor[sp.i]}) is refused for an enemy on the ground below at cell ${j} (floor ${nav.floor[j]}), ${Math.hypot(nav.x(j) - sx, nav.z(j) - sz).toFixed(2)}" off`)
          for (const x of plan.spots) if (Math.hypot(nav.x(x.i) - other.pos.x, nav.z(x.i) - other.pos.z) < R0(other, ch) && Math.abs(nav.floor[x.i] - q.groundY(G, other)) <= HIGH) throw new Error(`${where}: a charge may end on cell ${x.i} within 1" of another enemy at its level`)
          found = true
          counts.chargeOver++
          break
        }
      })
    }
  }
  // a template on a deck spares the ground below it within its horizontal
  // reach, and hits the deck (on a match of its own: it rolls and scars)
  {
    const H = fresh(), nh = H.nav
    const gun = H.units.find((u) => u.t.ranged?.blast && u.t.ranged.blast + 0.3 < 2)
    const v = H.units.find((u) => u.side === 1 && !u.t.fly && !u.t.big), w2 = H.units.find((u) => u.side === 1 && u !== v && u.t.climb && !u.t.fly)
    if (gun && v && w2) {
      const w = gun.t.ranged, R = (u) => w.blast + u.t.base * 0.6
      // (the template on a deck's rim cell; a deck unit with a model under
      // it, and a ground unit with a model within its reach horizontally)
      const within = (u, j, at, reach) => u.models.some((m) => m.alive && Math.hypot(nh.x(j) + m.ox - nh.x(at), nh.z(j) + m.oz - nh.z(at)) <= reach)
      let scene = null
      for (let at = 0; at < nh.N && !scene; at++) {
        if (!(nh.floor[at] >= 2) || nh.cliff[at] > 0.3) continue
        let up = -1, down = -1
        for (let j = 0; j < nh.N && (up < 0 || down < 0); j++) {
          if (up < 0 && nh.floor[j] === nh.floor[at] && nh.standable(j, w2.r, 'walk') && within(w2, j, at, R(w2) - 0.05)) up = j
          if (down < 0 && nh.floor[j] === 0 && nh.standable(j, v.r, 'walk') && within(v, j, at, R(v) - 0.05)) down = j
        }
        if (up >= 0 && down >= 0) scene = [up, down, at]
      }
      if (scene) {
        only(H, [gun, v, w2], () => {
          put(w2, nh.x(scene[0]), nh.z(scene[0]))
          put(v, nh.x(scene[1]), nh.z(scene[1]))
          H.out = []
          try {
            mods.shoot.blastLands(H, gun, { x: nh.x(scene[2]), z: nh.z(scene[2]) }, w)
            const hit = (u) => H.out.some((e) => e.t === 'dice' && typeof e.label === 'string' && e.label.replace(/^⚠ /, '').startsWith(`${u.t.short}: `))
            if (hit(v)) throw new Error(`${where}: a template landing on deck cell ${scene[2]} (floor ${nh.floor[scene[2]]}) hit unit ${v.id} (${v.t.short}) on the ground below it at cell ${scene[1]}`)
            if (!hit(w2)) throw new Error(`${where}: a template landing on deck cell ${scene[2]} missed unit ${w2.id} (${w2.t.short}) standing under it at cell ${scene[0]}`)
          } finally {
            H.out = null
          }
          counts.blastSpared++
        })
      }
    }
    // a wrecker's smash on the ground skips a piece standing on a deck, and
    // takes one on the ground (a piece of the scene's own, put beside the
    // sample and taken away again)
    const brute = H.units.find((u) => u.t.wrecker)
    const ground = cells((i) => nh.floor[i] === 0 && nh.standable(i, 1, 'walk'))
    if (brute && ground.length) {
      const at = { x: nh.x(ground[0]), z: nh.z(ground[0]), dir: 0 }
      for (const [base, want] of [[2, false], [0, true]]) {
        const piece = { id: -1, kind: 'scene', alive: true, destructible: true, hp: 999, base, shape: { x: at.x + 0.5, z: at.z, hx: 0.5, hz: 0.5, yaw: 0, y: base + 0.5, hy: 0.5, reach: 0.71 } }
        H.terrain.chunks.push(piece)
        try {
          mods.move.smashAround(H, brute, at, null)
        } finally {
          H.terrain.chunks.pop()
        }
        if ((piece.hp < 999) !== want) throw new Error(`${where}: a wrecker's smash on the ground at (${at.x}, ${at.z}) ${want ? 'spared' : 'hit'} a piece standing at ${base}"`)
        counts[want ? 'smashHit' : 'smashSkipped']++
      }
    }
  }
}
// (F7a's review) controlOf with height on a Grand-sized board (`nav`, its
// objectives): a unit on a deck whose models in an objective's horizontal
// range all stand more than HIGH off its floor doesn't hold it; the same
// unit on the ground in range does. `u` is a unit of a Skirmish match, put
// on this board alone ({ nav, units: [u] }, all controlOf reads)
function controlScene(q, nav, objectives, u, where, counts) {
  const G = { nav, units: [u], objectives }
  const was = { x: u.pos.x, z: u.pos.z }
  const inRange = (i, o) => u.models.filter((m) => m.alive && Math.hypot(nav.x(i) + m.ox - o.x, nav.z(i) + m.oz - o.z) <= 3 + u.t.base)
  try {
    for (const o of objectives) {
      const oy = q.floorAt(G, o.x, o.z)
      let deck = -1, ground = -1
      for (let i = 0; i < nav.N && (deck < 0 || ground < 0); i++) {
        if (!nav.standable(i, u.r, 'walk')) continue
        const ms = inRange(i, o)
        if (!ms.length) continue
        const off = ms.every((m) => Math.abs(q.floorAt(G, nav.x(i) + m.ox, nav.z(i) + m.oz) - oy) > q.HIGH)
        if (off && nav.level[i] && deck < 0) deck = i
        else if (ms.every((m) => Math.abs(q.floorAt(G, nav.x(i) + m.ox, nav.z(i) + m.oz) - oy) <= q.HIGH) && ground < 0) ground = i
      }
      if (deck < 0) continue
      u.pos.x = nav.x(deck)
      u.pos.z = nav.z(deck)
      if (q.controlOf(G, o) !== -1) throw new Error(`${where}: unit ${u.id} (${u.t.short}) on a deck at cell ${deck} (floor ${nav.floor[deck]}) holds the objective at (${o.x}, ${o.z}) (floor ${oy}) from above`)
      counts.controlAbove++
      if (ground >= 0) {
        u.pos.x = nav.x(ground)
        u.pos.z = nav.z(ground)
        if (q.controlOf(G, o) !== u.side) throw new Error(`${where}: unit ${u.id} (${u.t.short}) at cell ${ground}, in range of the objective at (${o.x}, ${o.z}) on its level, doesn't hold it`)
      }
    }
  } finally {
    u.pos.x = was.x
    u.pos.z = was.z
  }
}

// (F17) Lobbing from height on one fortified board (G, its nav): see the
// header's last row. The reference is the physics restated, never the
// code's rangeOf: a lobbed weapon is a blast or an indirect one that isn't
// a spell, and its reach √(R² + 2hR) (level, R; nothing reaching, 0).
function lobPairs(q, mods, G, nav, rand, where, counts) {
  if (!q.rangeOf) return
  const STEP = mods.nav.STEP
  const lobs = (w) => !w.spell && !!(w.blast || w.indirect)
  const ref = (w, h) => {
    if (!lobs(w) || h === 0) return w.range
    const x = w.range * w.range + 2 * h * w.range
    return x > 0 ? Math.sqrt(x) : 0
  }
  const raised = [], ground = []
  for (let i = 0; i < nav.N; i++) {
    if (nav.floor[i] > STEP) raised.push(i)
    else if (nav.floor[i] === 0) ground.push(i)
  }
  if (!raised.length || !ground.length) return
  const any = (xs) => xs[Math.floor(rand() * xs.length)]
  const at = (u, i) => {
    u.pos.x = nav.x(i)
    u.pos.z = nav.z(i)
  }
  const gapAt = (u, e, i, j) => Math.hypot(nav.x(i) - nav.x(j), nav.z(i) - nav.z(j)) - u.r - e.r
  for (const u of G.units.filter((x) => q.alive(x) && x.t.ranged)) {
    const w = u.t.ranged, e = G.units.find((x) => x.side !== u.side && q.alive(x))
    const pu = { ...u.pos }, pe = { ...e.pos }
    try {
      // random pairs, half the shooters raised and half the targets
      for (let k = 0; k < LOB_PAIRS; k++) {
        const i = any(k % 2 ? raised : ground), j = any(k % 4 < 2 ? ground : raised)
        at(u, i)
        at(e, j)
        const h = nav.floor[i] - nav.floor[j], want = ref(w, h), got = q.rangeOf(G, u, e)
        if (!Object.is(got, want)) throw new Error(`${where}: ${w.name} (${w.range}") from cell ${i} (floor ${nav.floor[i]}) at cell ${j} (floor ${nav.floor[j]}) reaches ${got}", not ${want}"`)
        const g = q.gap(u, e), info = q.shotInfo(G, u, e), out = !info.ok && info.why.startsWith('out of range')
        if (out !== g > want) throw new Error(`${where}: ${w.name} at ${g.toFixed(3)}" against a reach of ${want}" (cell ${i} at ${j}) is ${out ? '' : 'not '}refused as out of range${info.ok ? '' : ` (${info.why})`}`)
        if (g > want && mods.score.shotValue(G, u, e, u.pos, false) !== 0) throw new Error(`${where}: the AI values ${w.name} at ${g.toFixed(3)}", past its reach of ${want}" (cell ${i} at ${j})`)
        counts.lobPairs++
      }
      if (!lobs(w)) continue
      // from a deck at the ground, past the printed range but within the
      // reach: taken (not out of range); the AI values it, an indirect
      // weapon at an enemy in no fight ((F18) and none of its own under the
      // template there, whose loss the AI nets)
      for (let tries = 0; tries < 30; tries++) {
        const i = any(raised), R = w.range, far = ref(w, nav.floor[i])
        const j = ground.find((c) => {
          const g = gapAt(u, e, i, c)
          return g > R + 0.05 && g < far - 0.05
        })
        if (j === undefined) continue
        at(u, i)
        at(e, j)
        const info = q.shotInfo(G, u, e)
        if (!info.ok && info.why.startsWith('out of range')) throw new Error(`${where}: ${w.name} (${R}") from cell ${i}, ${nav.floor[i]}" up, refuses a target on the ground ${q.gap(u, e).toFixed(2)}" off, within its reach of ${far.toFixed(2)}": ${info.why}`)
        if (info.ok && info.reach !== far) throw new Error(`${where}: ${w.name}'s shotInfo gives a reach of ${info.reach}", not ${far}"`)
        counts.lobDown++
        if (w.indirect && !q.isEngaged(G, e) && !info.under?.length) {
          if (!(mods.score.shotValue(G, u, e, u.pos, false) > 0)) throw new Error(`${where}: the AI values nothing in ${w.name} from cell ${i}, ${nav.floor[i]}" up, at an enemy ${q.gap(u, e).toFixed(2)}" off on the ground, within its reach of ${far.toFixed(2)}"`)
          counts.lobValued++
        }
        break
      }
      // from the ground up at a deck, within the printed range but past
      // the reach: refused
      for (let tries = 0; tries < 30; tries++) {
        const i = any(raised), R = w.range, near = ref(w, -nav.floor[i])
        const j = ground.find((c) => {
          const g = gapAt(u, e, c, i)
          return g > near + 0.05 && g < R - 0.05
        })
        if (j === undefined) continue
        at(u, j)
        at(e, i)
        const info = q.shotInfo(G, u, e)
        if (info.ok || !info.why.startsWith('out of range')) throw new Error(`${where}: ${w.name} (${R}") from the ground at cell ${j} takes a target ${nav.floor[i]}" up at cell ${i}, ${q.gap(u, e).toFixed(2)}" off, past its reach of ${near.toFixed(2)}" firing up${info.ok ? '' : `: ${info.why}`}`)
        counts.lobUp++
        break
      }
    } finally {
      Object.assign(u.pos, pu)
      Object.assign(e.pos, pe)
    }
  }
}

function heightTask(core, mods) {
  const q = core.q, counts = { boards: 0, pairs: 0, steps: 0, links: 0, cells: 0, plans: 0, ledges: 0, flat: 0, grand: 0, keepTop: 0, controlAbove: 0, pileIn: 0, pileRefused: 0, chargeOver: 0, blastSpared: 0, smashSkipped: 0, smashHit: 0, lobPairs: 0, lobDown: 0, lobUp: 0, lobValued: 0 }
  const nav0 = mods.nav, { STEP } = nav0
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
    // (F7a's review) the scenes
    heightScenes(core, mods, G, () => core.createMatch({ board, dice: 1, terrain: 'fortified', seats: SEATS }), where, counts)
    // P-level
    levelPairs(q, G, nav, rand, where, counts)
    // (F17) lobbing from height
    lobPairs(q, mods, G, nav, rand, where, counts)
  }
  if (!counts.ledges || !counts.flat || !counts.links || !counts.plans) throw new Error(`P-height met no ${!counts.ledges ? 'pair across a ledge' : !counts.flat ? 'pair on one level' : !counts.links ? 'link in a reach' : 'unit at a ladder\'s foot'} on ${HEIGHT_BOARDS} boards`)
  // (F7a's review) every scene met at least once
  const scenes = { keepTop: "a unit on the keep's top", pileIn: 'a pile-in onto open deck', pileRefused: "a pile-in onto a ledge's band", chargeOver: 'a charge spot on a deck within 1" of an enemy below', blastSpared: 'a template on a deck over the ground', smashSkipped: "a wrecker's smash beside a raised piece", smashHit: "a wrecker's smash beside a piece on the ground" }
  for (const [k, what] of Object.entries(scenes)) if (!counts[k]) throw new Error(`P-height met no scene with ${what} on ${HEIGHT_BOARDS} boards`)
  // (F17) and the lob's, on code that lobs
  if (q.rangeOf) {
    const lobScenes = { lobDown: 'a lobbed shot from a deck past its printed range', lobUp: 'a lobbed shot up at a deck within its printed range', lobValued: 'an indirect weapon on a deck valued by the AI past its printed range' }
    for (const [k, what] of Object.entries(lobScenes)) if (!counts[k]) throw new Error(`P-height met no scene with ${what} on ${HEIGHT_BOARDS} boards`)
  }
  // (F7a's review) P-level on Grand-sized fortified boards, where bastions
  // stand (Skirmish never fits one): the code's own Terrain and NavGrid
  // (and controlOf's scene, which needs a deck beside a ground objective:
  // the works' fronts stand 2" from the Grand table's (±24, 0))
  const { W, H, deploy, objectives } = grandTable(mods.MISSIONS)
  const sq = core.createMatch({ board: 1, dice: 1, terrain: 'fortified', seats: SEATS }).units.find((u) => u.side === 0 && !u.t.fly && u.models.length >= 3)
  for (let seed = 1; seed <= GRAND_LEVEL; seed++) {
    const T = new mods.terrain.Terrain(W, H)
    T.generate(seed, objectives, deploy, 'fortified')
    const nav = new nav0.NavGrid(W, H, 0.5)
    nav.rebuild(T.chunks)
    if (!nav.hasHeight) throw new Error(`P-level, Grand-sized board ${seed}: no height layer`)
    controlScene(q, nav, objectives, sq, `P-height, Grand-sized board ${seed}`, counts)
    levelPairs(q, { nav }, nav, mulberry32(seed * 7919), `P-level, Grand-sized board ${seed}`, counts)
    counts.grand++
  }
  if (!counts.controlAbove) throw new Error(`P-height met no deck beside a ground objective on ${GRAND_LEVEL} Grand-sized boards`)
  return counts
}

// (F18) P-fight: shooting into a fight (DESIGN §4.1 rule 27), on scenes of
// its own, since the random games and the corpus pass a fight by without
// judging the dice it draws. On FIGHT_BOARDS classic boards, each race in
// each seat, a hotseat match is played to the movement phase of the seat
// the roll-off gives the first turn; every other unit is taken off the
// table (its count set to 0: the match is thrown away after) and a scene
// set up before End, so the shooting phase opens on it. For each of the
// seat's units with a ranged weapon:
//  - the fight: an enemy with one of the shooter's friends engaged with it
//    (0.4" apart) and the shooter clear of both, in range and in sight
//    (placements tried until shotInfo takes the pair): legal() takes the
//    shot and shootTargets offers the enemy (every ranged weapon, blast,
//    spell and gaze alike: no "locked in combat"); the shot played through
//    apply(), its dice held draw for draw to a copy of the stream: a plain
//    volley's n hit dice, then one draw per miss in the order of the misses
//    (a stray when under F / (F + T): the stray count the misses that drew
//    under the share, and the ⚠ row's), then the target's wound and save
//    dice, then the friend's wound and save dice, and nothing else drawn;
//    the target's rows and log line before the friend's (its ⚠ row and its
//    "Friendly fire!" line), the friend's wounds and deaths its own; a
//    template or a spell strays nothing (no stray row);
//  - the clear shot: the same with the friend 4" off, out of the fight
//    (F = 0): a volley draws its hit, wound and save dice and nothing else;
//  - the tie: the shooter's two units of one type (each army fields two:
//    the Nutkin, the Scaleguard) both engaged with the enemy, a direct
//    weapon of another unit shooting: the strays strike the first of the
//    two in G.units order (fightOf's onto, and the wounds the rows play),
//    and the second once the first has lost a model (the most models);
//  - the AI's value (core/ai/score.js): a volley into the fight is worth
//    less than the same shot with the friend gone, and a template with a
//    friend under it less than without (ownUnder counts it); and the
//    Coil's Venom Engine never shells its own Brute: with the Brute engaged
//    with (and under the template on) the only enemy it can see, its shot's
//    value nets the Brute's loss, and where that leaves it at or under the
//    AI's floor (0.4) the AI's shooting phase fires nothing.
// Every ranged unit type of both races must meet the fight and the clear
// shot, the tie both armies, and a stray must be rolled, or the run says
// what it never met and fails.
const FIGHT_BOARDS = 6
function fightTask(core, mods) {
  const q = core.q
  const counts = { legal: 0, volleys: 0, clear: 0, templates: 0, misses: 0, strays: 0, ties: 0, values: 0, brute: 0, bruteDeclined: 0 }
  const met = { fight: new Set(), clear: new Set(), tie: new Set() }
  const d6 = (r) => 1 + Math.floor(mods.rng.draw(r) * 6)
  const at = (u, x, z) => {
    u.pos.x = x
    u.pos.z = z
  }
  // a hotseat match at the movement phase of the seat with the first turn,
  // every unit but `keep(G, seat)`'s taken off; returns null when the seat
  // can't field the scene
  const fresh = (board, races) => {
    const G = core.createMatch({ board, dice: board, seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: [] })
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') throw new Error(`P-fight, board ${board}: no movement phase after the deployment`)
    return { G, s: G.pending.seats[0] }
  }
  const only_ = (G, keep) => {
    for (const u of G.units) if (!keep.includes(u)) u.alive = 0
  }
  // End the movement phase into the shooting phase on the scene
  const toShoot = (G, s, where) => {
    core.apply(G, s, { t: 'end' })
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'shoot' || G.pending.seats[0] !== s) throw new Error(`${where}: the shooting phase didn't open on the scene (pending ${JSON.stringify(G.pending)})`)
    G.out.length = 0
  }
  // place e at a random open point, `friends` round it at `gapF`, u behind
  // it at a gap within its range; until shotInfo takes the pair
  const place = (G, rand, u, e, friends, gapF) => {
    const { W, H } = G.board, w = u.t.ranged
    for (let tries = 0; tries < 60; tries++) {
      const x = (rand() - 0.5) * (W - 12), z = (rand() - 0.5) * (H - 12), a = rand() * Math.PI * 2
      at(e, x, z)
      friends.forEach((f, k) => {
        const b = a + k * Math.PI * 0.5
        at(f, x + Math.cos(b) * (e.r + f.r + gapF), z + Math.sin(b) * (e.r + f.r + gapF))
      })
      const D = 1.6 + rand() * (Math.min(w.range, 12) - 2.2)
      at(u, x - Math.cos(a + Math.PI * 0.25) * (e.r + u.r + D), z - Math.sin(a + Math.PI * 0.25) * (e.r + u.r + D))
      if (q.isEngaged(G, u) || friends.some((f) => q.gap(u, f) < 0.2)) continue
      // (a scene is tried again only for the terrain's reasons: no line of
      // sight, or a placement past the range; any other refusal is the
      // rule's)
      const info = q.shotInfo(G, u, e)
      if (info.ok) return true
      if (!/^(no line of sight|out of range)/.test(info.why)) throw new Error(`P-fight, board ${G.setup.board}: shotInfo refuses ${u.t.short} (${w.name}) at ${e.t.short}${q.isEngaged(G, e) ? ', locked in combat with ours,' : ''} ${q.gap(u, e).toFixed(2)}" off: ${info.why}`)
    }
    return false
  }
  // the shot through apply(), its dice held to the stream's copy: returns
  // what it found (the rows, the log, the strays)
  const shoot = (G, s, u, e, where) => {
    const info = q.shotInfo(G, u, e), w = u.t.ranged
    const fight = info.fight
    const r = { ...G.rng }
    const why = core.legal(G, s, { t: 'shoot', u: u.id, tg: e.id })
    if (why) throw new Error(`${where}: legal() refuses ${u.t.short} shooting ${e.t.short}${fight ? ', locked in combat,' : ''}: ${why}`)
    if (!q.shootTargets(G, u).includes(e)) throw new Error(`${where}: shootTargets doesn't offer ${e.t.short} to ${u.t.short}`)
    counts.legal++
    core.apply(G, s, { t: 'shoot', u: u.id, tg: e.id })
    const rows = G.out.filter((x) => x.t === 'dice'), logs = G.out.filter((x) => x.t === 'log').map((x) => x.html.replace(/<[^>]+>/g, ''))
    const strayRow = rows.findIndex((x) => /stray hit/.test(x.label))
    if (w.blast || w.spell) {
      if (strayRow >= 0 || logs.some((l) => /stray shot/.test(l))) throw new Error(`${where}: ${w.name}, a ${w.spell ? 'spell' : 'template'}, strays as a volley does`)
      if (w.blast) counts.templates++
      return { rows, logs, stray: 0 }
    }
    // the volley, draw for draw
    const n = rows[0].dice.length, need = info.need
    const hits = Array.from({ length: n }, () => d6(r))
    if (rows[0].label !== `Hit ${need}+` || JSON.stringify(hits) !== JSON.stringify(rows[0].dice)) throw new Error(`${where}: the hit row ${JSON.stringify(rows[0])} isn't the stream's first ${n} dice ${JSON.stringify(hits)}`)
    let stray = 0, misses = 0
    if (fight) {
      const share = fight.F / (fight.F + fight.T)
      for (const d of hits) if (d < need) {
        misses++
        if (mods.rng.draw(r) < share) stray++
      }
    }
    const h = hits.filter((d) => d >= need).length
    let k = 1
    const next = (m, label, what) => {
      const dice = Array.from({ length: m }, () => d6(r))
      if (!label) return dice
      const row = rows[k]
      if (!row || !label.test(row.label) || (!/No save/.test(row.label) && JSON.stringify(row.dice) !== JSON.stringify(dice))) throw new Error(`${where}: ${what}: row ${k} is ${JSON.stringify(row)}, the stream's next ${m} dice ${JSON.stringify(dice)}`)
      k++
      return dice
    }
    const wn = h ? next(h, /^Wound \d\+$/, "the target's wound roll") : []
    const wounds = wn.filter((d) => d >= rows[1]?.need).length
    next(wounds, wounds ? /^(Save \d\+|No save)/ : null, "the target's save roll")
    if (logs[0] === undefined || !logs[0].includes(` shoot ${e.t.short}:`)) throw new Error(`${where}: the first log line is ${JSON.stringify(logs[0])}, not the target's`)
    if (stray) {
      if (strayRow !== k) throw new Error(`${where}: ${stray} strays, but the ⚠ row is row ${strayRow}, not row ${k} after the target's`)
      if (!rows[k].label.startsWith(`⚠ ${fight.onto.t.short}: ${stray} stray hit${stray > 1 ? 's' : ''} · wound `)) throw new Error(`${where}: the ⚠ row says ${JSON.stringify(rows[k].label)} for ${stray} strays onto ${fight.onto.t.short}`)
      const fw = next(stray, /^⚠ /, "the friend's wound roll")
      const fwounds = fw.filter((d) => d >= rows[k - 1].need).length
      next(fwounds, fwounds ? /^(Save \d\+|No save)/ : null, "the friend's save roll")
      if (!logs.some((l, i) => i > 0 && l.startsWith(`Friendly fire! ${stray} stray shot${stray > 1 ? 's' : ''} hit ${fight.onto.t.short}:`))) throw new Error(`${where}: no "Friendly fire!" line after the target's for ${stray} strays: ${JSON.stringify(logs)}`)
      // the friend's wounds and deaths are its own: every unit.wound and
      // unit.slain after the ⚠ row is onto's
      const after = G.out.slice(G.out.indexOf(rows[strayRow])).filter((x) => x.t === 'unit.wound' || x.t === 'unit.slain')
      if (after.some((x) => x.u !== fight.onto.id)) throw new Error(`${where}: a stray's wound landed on unit ${after.find((x) => x.u !== fight.onto.id).u}, not ${fight.onto.id}`)
    } else if (strayRow >= 0 || logs.some((l) => /stray shot/.test(l))) throw new Error(`${where}: no miss strayed by the stream, but the rows or the log say one did`)
    if (r.n !== G.rng.n || r.h !== G.rng.h || r.a !== G.rng.a) throw new Error(`${where}: the shot drew ${G.rng.n - (r.n - 0)} more than its dice (the stream's copy at ${r.n}, the match's at ${G.rng.n})${fight ? '' : ': a stray die with no friend in the fight?'}`)
    counts.volleys++
    counts.misses += misses
    counts.strays += stray
    return { rows, logs, stray }
  }
  for (let board = 1; board <= FIGHT_BOARDS; board++) {
    for (const races of [['squirrel', 'serpent'], ['serpent', 'squirrel']]) {
      const rand = mulberry32(board * 104729 + (races[0] === 'squirrel' ? 0 : 1))
      const probe = fresh(board, races)
      const shooters = probe.G.units.filter((u) => u.side === probe.s && u.t.ranged).map((u) => u.id)
      for (const uid of shooters) {
        for (const kind of ['fight', 'clear']) {
          const { G, s } = fresh(board, races)
          const u = G.units.find((x) => x.id === uid), w = u.t.ranged
          const where = `P-fight, board ${board} (${races.join(' v ')}), ${u.t.short} (${w.name}), ${kind}`
          const e = G.units.find((x) => x.side !== s && x.models.length > 1 && !x.t.fly)
          const f = G.units.find((x) => x.side === s && x !== u && x.models.length > 1)
          only_(G, [u, e, f])
          if (!place(G, rand, u, e, [f], kind === 'fight' ? 0.4 : 4)) continue
          const fight = q.fightOf(G, u, e)
          if (kind === 'fight' && !(fight && fight.F === f.alive && fight.T === e.alive && fight.onto === f && fight.friends.length === 1)) throw new Error(`${where}: fightOf says ${JSON.stringify(fight && { F: fight.F, T: fight.T, onto: fight.onto.id })}, not ${f.alive} of ours against ${e.alive} with ${f.id}`)
          if (kind === 'clear' && fight) throw new Error(`${where}: fightOf finds a fight with the friend 4" off`)
          // the AI's value nets the friendly fire (before the shot: it
          // changes the table)
          if (kind === 'fight' && !w.mesmerize) {
            const v = mods.score.shotValue(G, u, e, u.pos, false)
            const fa = f.alive
            f.alive = 0
            const bare = mods.score.shotValue(G, u, e, u.pos, false)
            f.alive = fa
            const own = w.blast ? mods.score.ownUnder(G, u, e) : 1
            if (own > 0 && !(v < bare)) throw new Error(`${where}: the AI values the shot at ${v} with ${f.t.short} ${w.blast ? 'under the template' : 'in the fight'}, ${bare} without: no friendly fire weighed`)
            counts.values++
          }
          toShoot(G, s, where)
          shoot(G, s, u, e, where)
          met[kind].add(u.t.key)
          if (kind === 'clear') counts.clear++
        }
      }
      // the tie: the seat's two units of one type round the enemy, a direct
      // weapon of another unit shooting
      for (const drop of [false, true]) {
        const { G, s } = fresh(board, races)
        const mine = G.units.filter((x) => x.side === s)
        const twin = mine.find((x) => mine.some((y) => y !== x && y.t === x.t && x.models.length > 1))
        const f1 = twin, f2 = twin && mine.find((y) => y !== twin && y.t === twin.t)
        const u = twin && mine.find((x) => x.t !== twin.t && x.t.ranged && !x.t.ranged.blast && !x.t.ranged.spell)
        const e = G.units.find((x) => x.side !== s && x.models.length > 1 && !x.t.fly)
        if (!u || !f2) continue
        const where = `P-fight, board ${board} (${races.join(' v ')}), the tie${drop ? ' broken' : ''}: ${u.t.short} at ${e.t.short} with two ${f1.t.short}`
        only_(G, [u, e, f1, f2])
        if (!place(G, rand, u, e, [f1, f2], 0.4)) continue
        if (drop) {
          f1.models[0].alive = false
          f1.models[0].w = 0
          f1.alive--
        }
        const fight = q.fightOf(G, u, e), want = drop ? f2 : f1
        if (!fight || fight.friends.length !== 2 || fight.F !== f1.alive + f2.alive || fight.onto !== want) throw new Error(`${where}: fightOf's onto is ${fight?.onto.id}, not ${want.id} (${drop ? 'the most models' : 'the first in G.units order of two alike'})`)
        toShoot(G, s, where)
        shoot(G, s, u, e, where)
        met.tie.add(races[s])
        counts.ties++
      }
      // the Brute: the Coil's Venom Engine, the Brute engaged with the only
      // enemy, under the template there
      {
        const { G, s } = fresh(board, races)
        const u = G.units.find((x) => x.side === s && x.t.ranged?.blast && !x.t.ranged.spell && x.t.ai === 'artillery')
        const brute = G.units.find((x) => x.side === s && x.t.big && !x.t.ranged)
        const e = G.units.find((x) => x.side !== s && x.models.length > 1 && !x.t.fly)
        if (u && brute) {
          const where = `P-fight, board ${board} (${races.join(' v ')}), the ${u.t.short} at ${e.t.short} locked with the ${brute.t.short}`
          only_(G, [u, e, brute])
          if (place(G, rand, u, e, [brute], 0.4)) {
            if (!(mods.score.ownUnder(G, u, e) > 0)) throw new Error(`${where}: the ${brute.t.short}, 0.4" from ${e.t.short}, isn't under the template (ownUnder 0)`)
            const v = mods.score.shotValue(G, u, e, u.pos, false)
            brute.alive = 0
            const bare = mods.score.shotValue(G, u, e, u.pos, false)
            brute.alive = 1
            if (!(v < bare)) throw new Error(`${where}: the AI values shelling its own ${brute.t.short} at ${v}, no less than ${bare} without it`)
            toShoot(G, s, where)
            const cmds = [...mods.policy.aiPhase(G, s, 'shoot')]
            if (v <= 0.4 && cmds.some((c) => c.t === 'shoot' && c.tg === e.id)) throw new Error(`${where}: the AI shells its own ${brute.t.short} (the shot worth ${v} with it, ${bare} without)`)
            counts.brute++
            if (!cmds.length) counts.bruteDeclined++
          }
        }
      }
    }
  }
  // what the scenes must have met
  const RANGED = (race) => Object.values(RACES_F[race].units).filter((t) => t.ranged).map((t) => t.key)
  const never = []
  for (const race of ['squirrel', 'serpent']) {
    for (const key of RANGED(race)) for (const k of ['fight', 'clear']) if (!met[k].has(key)) never.push(`${race} ${key} ${k}`)
  }
  if (met.tie.size < 2) never.push(`the tie in both armies (met ${[...met.tie].join(', ') || 'none'})`)
  if (!counts.strays) never.push('a stray')
  if (!counts.bruteDeclined) never.push('the Venom Engine declining to shell its own Brute')
  if (never.length) throw new Error(`P-fight never met: ${never.join('; ')} (on ${FIGHT_BOARDS} boards)`)
  return counts
}
// (F19a) P-keg: the powder keg (DESIGN §4.1 rule 28), on scenes of its own,
// since the random games and the corpus pass a keg by without judging the
// order its dice come in. KEG_BOARDS keg-mission boards, each race in each
// seat, a hotseat match to the movement phase of the seat with the first
// turn, every unit but the scene's taken off (the match thrown away after):
//  - no keg on classic, open or fortified: every set of every mission but
//    the keg's, on boards 1-KEG_SETS_SEEDS, scatters none; the keg set one,
//    the first chunk, at (0, 0) exactly, with the keg's hit points;
//  - a template sets it off, once: the seat's gun's template lands 2.2" off
//    the keg (shoot.js blastLands, its weapon), an enemy squad under the
//    template and the keg, a friend under the keg alone; the stream's
//    events in their order (the template's landing, its victims' rows in
//    G.units order, the keg broken, the "…scenery" line, the keg's line,
//    `keg.fuse` at (0, 0), its blast's landing there in the keg's look, its
//    victims' rows in G.units order, the friend's marked ⚠ as the gun's
//    own), and its dice held draw for draw to a copy of the stream (each
//    victim: a big one's D6, then its hits' wound dice, then the wounds'
//    save dice, rule 5's even with no save to make; the template's victims
//    all before the keg's, and nothing else drawn); every model the keg's
//    blast slays credited to the gun (unit.slain's `by`); the keg dead, its
//    hit points spent; a second template on the same spot sets nothing off;
//  - the chain: three more kegs added (B and C under the first's blast, in
//    that chunk order, D under B's alone), the first set off: they go off
//    A, B, C, D (C, broken by A's blast, before D, broken by B's: the
//    line's order, not the blasts' nesting), each once, each keg's blast
//    landing before the next keg's fuse;
//  - the wrecker's walk: the Coil's Brute moved (a `move` command through
//    apply) to the cell nearest the keg it may end on: its walk smashes the
//    keg (a terrain.destroy among the walk's smashes), and the keg goes off
//    once the walk has ended (its line, fuse and landing after unit.move),
//    the Brute standing where it stopped and credited with what falls;
//  - the AI: a gun's template on an enemy beside the keg is worth more for
//    the keg (score.js kegGain > 0, shotValue above its value with the keg
//    gone), a keg's going off is worth what it takes of the enemy less
//    its own (kegValue: positive with only enemies under it, negative with
//    only friends), and a unit fears a cell in the keg's blast while an
//    enemy could set it off (score's term: a cell's score with the keg
//    standing below the same with it gone).
// Every scene must be met, or the run says which it never met and fails.
const KEG_BOARDS = 4, KEG_SETS_SEEDS = 40
function kegTask(core, mods) {
  const q = core.q
  const counts = { clean: 0, kegBoards: 0, templates: 0, rows: 0, once: 0, chains: 0, walks: 0, values: 0, fears: 0 }
  const d6 = (r) => 1 + Math.floor(mods.rng.draw(r) * 6)
  const K = mods.hazards.HAZARDS.keg
  // no keg but on the keg set
  for (const [name, m] of Object.entries(mods.MISSIONS)) {
    for (const set of m.sets) {
      for (let seed = 1; seed <= KEG_SETS_SEEDS; seed++) {
        const T = new mods.terrain.Terrain(m.board.W, m.board.H)
        T.generate(seed, m.objectives, m.deploy, set)
        const kegs = T.chunks.filter((c) => c.kind === 'keg')
        if (set !== 'keg' && kegs.length) throw new Error(`P-keg: the ${name} mission's ${set} board ${seed} stands ${kegs.length} powder keg(s): no set but the keg's has one`)
        if (set === 'keg' && !(kegs.length === 1 && kegs[0] === T.chunks[0] && Object.is(kegs[0].shape.x, 0) && Object.is(kegs[0].shape.z, 0) && kegs[0].hp === K.hp)) throw new Error(`P-keg: the keg board ${seed} stands ${kegs.length} kegs, not one at (0, 0), the first chunk, with ${K.hp} hit points`)
        if (set === 'keg') counts.kegBoards++
        else counts.clean++
      }
    }
  }
  const at = (u, x, z) => {
    u.pos.x = x
    u.pos.z = z
  }
  const fresh = (board, races) => {
    const G = core.createMatch({ board, dice: board, mission: 'keg', seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: [] })
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') throw new Error(`P-keg, board ${board}: no movement phase after the deployment`)
    G.out.length = 0
    return { G, s: G.pending.seats[0], keg: G.terrain.chunks.find((c) => c.kind === 'keg') }
  }
  const only_ = (G, keep) => {
    for (const u of G.units) if (!keep.includes(u)) u.alive = 0
  }
  // the stream's copy drawn row by row as the victims' rows say: a big
  // victim's D6 (its hits D3+1), its wound dice, its save dice (drawn even
  // with no row: rule 5); each row's dice the copy's
  const drawRows = (r, rows, G, where) => {
    let k = 0
    while (k < rows.length) {
      const row = rows[k]
      const m = /^(⚠ )?(.+): (\d+) hits? · wound (\d)\+$/.exec(row.label)
      if (!m) throw new Error(`${where}: row ${k} "${row.label}" is no victim's wound row`)
      const v = G.units.find((u) => u.t.short === m[2])
      if (v?.t.big) {
        const d = d6(r)
        if (Math.ceil(d / 2) + 1 !== Number(m[3])) throw new Error(`${where}: ${m[2]}'s D3+1 hits are ${m[3]}, the stream's D6 ${d}`)
      }
      const wd = Array.from({ length: Number(m[3]) }, () => d6(r))
      if (JSON.stringify(wd) !== JSON.stringify(row.dice)) throw new Error(`${where}: ${m[2]}'s wound row ${JSON.stringify(row.dice)} isn't the stream's next dice ${JSON.stringify(wd)}`)
      const wounds = wd.filter((d) => d >= Number(m[4])).length
      const sv = Array.from({ length: wounds }, () => d6(r))
      k++
      if (rows[k] && /^Save \d\+/.test(rows[k].label)) {
        if (JSON.stringify(sv) !== JSON.stringify(rows[k].dice)) throw new Error(`${where}: ${m[2]}'s save row ${JSON.stringify(rows[k].dice)} isn't the stream's next dice ${JSON.stringify(sv)}`)
        k++
      }
      counts.rows++
    }
  }
  const met = { walk: false, chain: false, template: false, friend: false, credit: false }
  for (let board = 1; board <= KEG_BOARDS; board++) {
    for (const races of [['squirrel', 'serpent'], ['serpent', 'squirrel']]) {
      const where0 = `P-keg, board ${board} (${races.join(' v ')})`
      // ── a template sets it off, once ──
      {
        const { G, s, keg } = fresh(board, races)
        const gun = G.units.find((u) => u.side === s && u.t.ranged?.blast && !u.t.ranged.spell && u.t.ai === 'artillery')
        const e = G.units.find((u) => u.side !== s && u.models.length > 1 && !u.t.fly)
        const f = G.units.find((u) => u.side === s && u.models.length > 1 && !u.t.fly && u !== gun)
        only_(G, [gun, e, f])
        at(gun, -14, 0)
        at(e, 1, -1.6)
        at(f, -2.6, 0)
        const where = `${where0}, ${gun.t.short}'s template 2.2" off the keg`
        const w = gun.t.ranged, r = { ...G.rng }
        // (the AI: the gun's template on e is worth the keg)
        const gain = mods.score.kegGain(G, gun, e)
        if (!(gain !== 0)) throw new Error(`${where}: the AI's kegGain is ${gain} for a template on ${e.t.short} beside the keg`)
        const v = mods.score.shotValue(G, gun, e, gun.pos, false)
        keg.alive = false
        const bare = mods.score.shotValue(G, gun, e, gun.pos, false)
        keg.alive = true
        if (v === bare) throw new Error(`${where}: the AI values ${gun.t.short}'s shot at ${e.t.short} at ${v} with the keg beside it and without: no keg weighed`)
        counts.values++
        mods.shoot.blastLands(G, gun, { x: 2.2, z: 0 }, w)
        const ev = G.out
        const fuses = ev.filter((x) => x.t === 'keg.fuse')
        if (fuses.length !== 1 || fuses[0].id !== keg.id || fuses[0].x !== 0 || fuses[0].z !== 0) throw new Error(`${where}: ${fuses.length} keg fuses (${JSON.stringify(fuses)}), not the keg's one at (0, 0)`)
        if (keg.alive || keg.hp > 0) throw new Error(`${where}: the keg stands (${keg.hp} hit points) after it went off`)
        const lands = ev.map((x, i) => [x, i]).filter(([x]) => x.t === 'blast.land')
        if (lands.length !== 2 || lands[0][0].fx !== w.fx || lands[1][0].fx !== 'keg' || lands[1][0].x !== 0 || lands[1][0].z !== 0 || lands[1][0].r !== K.blast) throw new Error(`${where}: the landings ${JSON.stringify(lands.map(([x]) => x))}, not the template's then the keg's at (0, 0), ${K.blast}", in its look`)
        const fi = ev.indexOf(fuses[0]), destroy = ev.findIndex((x) => x.t === 'terrain.destroy' && x.id === keg.id)
        const line = (i) => ev[i]?.t === 'log' ? ev[i].html.replace(/<[^>]+>/g, '') : null
        if (!(lands[0][1] < destroy && destroy < fi && lands[1][1] === fi + 1 && line(fi - 1) === 'The powder keg goes up!' && /^…and \d+ pieces? of scenery/.test(line(fi - 2)))) throw new Error(`${where}: the order is wrong: the template's landing at ${lands[0][1]}, the keg broken at ${destroy}, its line and fuse at ${fi - 1}, ${fi}, its landing at ${lands[1][1]} (the line before the keg's: ${JSON.stringify(line(fi - 2))})`)
        // every row of the template's victims before the fuse, the keg's after
        const rowsBefore = ev.slice(lands[0][1], fi).filter((x) => x.t === 'dice'), rowsAfter = ev.slice(fi).filter((x) => x.t === 'dice')
        drawRows(r, [...rowsBefore, ...rowsAfter], G, where)
        if (r.n !== G.rng.n || r.h !== G.rng.h || r.a !== G.rng.a) throw new Error(`${where}: the template and the keg drew ${G.rng.n - r.n} more than their rows' dice`)
        // the victims in G.units order, each blast's; the friend's ⚠
        for (const rows of [rowsBefore, rowsAfter]) {
          const idx = rows.filter((x) => / hits? · wound/.test(x.label)).map((x) => G.units.findIndex((u) => u.t.short === x.label.replace(/^⚠ /, '').split(':')[0]))
          if (idx.some((v, i) => i && v < idx[i - 1])) throw new Error(`${where}: a blast's victims out of G.units order: ${rows.map((x) => x.label).join(' | ')}`)
        }
        if (q.alive(e) && !rowsAfter.some((x) => x.label.startsWith(`${e.t.short}:`))) throw new Error(`${where}: the keg's blast missed ${e.t.short}, standing on it`)
        if (rowsAfter.some((x) => x.label.startsWith(`⚠ ${f.t.short}:`))) met.friend = true
        if (rowsBefore.some((x) => x.label.includes(`${f.t.short}:`))) throw new Error(`${where}: the template caught ${f.t.short}, set 4.8" off it`)
        // credit: every model the keg's blast slew is the gun's
        const slain = ev.slice(fi).filter((x) => x.t === 'unit.slain')
        if (slain.some((x) => x.by !== gun.id)) throw new Error(`${where}: a model the keg slew is credited to ${slain.find((x) => x.by !== gun.id).by}, not the gun (${gun.id})`)
        if (slain.length) met.credit = true
        counts.templates++
        met.template = true
        // a second template on the same spot sets nothing off
        G.out.length = 0
        const n0 = G.rng.n
        mods.shoot.blastLands(G, gun, { x: 2.2, z: 0 }, w)
        if (G.out.some((x) => x.t === 'keg.fuse' || (x.t === 'terrain.destroy' && x.id === keg.id))) throw new Error(`${where}: the keg went off (or broke) a second time`)
        if (G.rng.n < n0) throw new Error(`${where}: the dice went back`)
        counts.once++
      }
      // ── the chain: A, B, C, D ──
      {
        const { G, s, keg: A } = fresh(board, races)
        const gun = G.units.find((u) => u.side === s && u.t.ranged?.blast && !u.t.ranged.spell && u.t.ai === 'artillery')
        only_(G, [gun])
        at(gun, -14, 0)
        const B = mods.recipes.powderKeg(G.terrain, 2.4, 0, 0, '#8a5a34'), C = mods.recipes.powderKeg(G.terrain, -2.4, 0, 0, '#8a5a34'), D = mods.recipes.powderKeg(G.terrain, 4.8, 0, 0, '#8a5a34')
        mods.match.refreshNav(G)
        const where = `${where0}, the chain`
        // (the first broken as anything breaks it, then set off: kegsGoOff
        // takes the kegs a blast or a walk broke)
        const broke = G.terrain.hurt(A, A.hp, { x: -14, z: 0 }, G.out, [])
        if (broke.length !== 1 || A.alive) throw new Error(`${where}: the keg's ${K.hp} hit points didn't break it`)
        mods.shoot.kegsGoOff(G, gun, mods.terrain.kegsIn(broke))
        const fuses = G.out.filter((x) => x.t === 'keg.fuse').map((x) => x.id), want = [A.id, B.id, C.id, D.id]
        if (JSON.stringify(fuses) !== JSON.stringify(want)) throw new Error(`${where}: the kegs went off ${JSON.stringify(fuses)}, not ${JSON.stringify(want)} (the first's, then the ones its blast broke in chunk order, then the one the second's broke)`)
        for (const k of [A, B, C, D]) if (k.alive) throw new Error(`${where}: keg ${k.id} stands`)
        // each keg's blast before the next keg's fuse
        const order = G.out.filter((x) => x.t === 'keg.fuse' || (x.t === 'blast.land' && x.fx === 'keg')).map((x) => x.t)
        if (order.join() !== 'keg.fuse,blast.land,keg.fuse,blast.land,keg.fuse,blast.land,keg.fuse,blast.land') throw new Error(`${where}: fuses and blasts in the order ${order.join(', ')}`)
        counts.chains++
        met.chain = true
      }
      // ── the wrecker's walk ──
      {
        const { G, s, keg } = fresh(board, races)
        const brute = G.units.find((u) => u.side === s && u.t.wrecker)
        if (brute) {
          const e = G.units.find((u) => u.side !== s && u.models.length > 1 && !u.t.fly)
          only_(G, [brute, e])
          at(brute, -3, 0)
          at(e, 1, 3.5)
          G.terrain.dirty = true
          mods.match.refreshNav(G)
          const where = `${where0}, the ${brute.t.short}'s walk`
          const plan = q.movePlan(G, brute)
          const c = q.nearestValid(G, plan, 0, 0, 1)
          if (c < 0) throw new Error(`${where}: no valid end beside the keg`)
          // (the AI: a walk ending there is worth the keg's going off)
          const from = { x: G.nav.x(c), z: G.nav.z(c) }
          if (mods.score.kegWalk(G, brute, from, mods.score.kegsOf(G)) === 0) throw new Error(`${where}: the AI's kegWalk is 0 for a walk ending ${Math.hypot(from.x, from.z).toFixed(2)}" from the keg`)
          counts.values++
          G.out.length = 0
          const why = core.legal(G, s, { t: 'move', u: brute.id, c })
          if (why) throw new Error(`${where}: legal() refuses the move: ${why}`)
          core.apply(G, s, { t: 'move', u: brute.id, c })
          const ev = G.out
          const mv = ev.findIndex((x) => x.t === 'unit.move' && x.u === brute.id)
          if (mv < 0 || !ev[mv].smashes.some((sm) => sm.ev.some((x) => x.t === 'terrain.destroy' && x.id === keg.id))) throw new Error(`${where}: the walk smashed no keg (${JSON.stringify(ev[mv]?.smashes.map((sm) => sm.ev.map((x) => `${x.t} ${x.id}`)))})`)
          const fuses = ev.map((x, i) => [x, i]).filter(([x]) => x.t === 'keg.fuse')
          if (fuses.length !== 1 || fuses[0][1] < mv) throw new Error(`${where}: ${fuses.length} fuses, ${fuses.length ? `the first at ${fuses[0][1]}, the walk at ${mv}` : 'none'}: the keg goes off once, after the walk`)
          if (ev[fuses[0][1] + 1]?.t !== 'blast.land' || ev[fuses[0][1] + 1].fx !== 'keg') throw new Error(`${where}: no keg blast straight after its fuse`)
          if (!ev.slice(fuses[0][1]).some((x) => x.t === 'dice' && x.label.startsWith(`⚠ ${brute.t.short}:`))) throw new Error(`${where}: the ${brute.t.short}, standing where its walk ended, isn't under the keg's blast (its ⚠ row)`)
          const slain = ev.slice(fuses[0][1]).filter((x) => x.t === 'unit.slain')
          if (slain.some((x) => x.by !== brute.id)) throw new Error(`${where}: a model the keg slew is credited to ${slain.find((x) => x.by !== brute.id).by}, not the ${brute.t.short}`)
          counts.walks++
          met.walk = true
        }
      }
      // ── the AI's fear and the keg's value ──
      {
        const { G, s, keg } = fresh(board, races)
        const u = G.units.find((x) => x.side === s && x.models.length > 1 && !x.t.fly)
        const gun = G.units.find((x) => x.side !== s && x.t.ranged?.blast)
        only_(G, [u, gun])
        at(u, -1.5, 1.5)
        at(gun, 14, 0)
        const where = `${where0}, the AI's keg terms`
        if (!(mods.score.kegValue(G, s, keg) < 0 && mods.score.kegValue(G, 1 - s, keg) > 0)) throw new Error(`${where}: kegValue with only ${u.t.short} under the keg is ${mods.score.kegValue(G, s, keg)} for its side, ${mods.score.kegValue(G, 1 - s, keg)} for the other`)
        if (!mods.score.kegDanger(G, s)) throw new Error(`${where}: an enemy ${gun.t.short} with a template, and no danger to set the keg off`)
        // (score's own reading of the place it stands, in the blast: with
        // the keg standing, under the same with no keg)
        const ctx = (kegs) => ({ enemies: q.enemiesOf(G, u), friends: q.friendsOf(G, u), owners: G.objectives.map((o) => q.controlOf(G, o)), claimed: new Set(), role: u.t.ai, pre: new Map(q.enemiesOf(G, u).map((e) => [e, { cover: false, hit: 0, back: 0, fight: null, own: 0, keg: 0 }])), kegs, kegDanger: kegs.length > 0 && mods.score.kegDanger(G, u.side) })
        const a = mods.score.score(G, u, u.pos.x, u.pos.z, ctx([keg]), false), b = mods.score.score(G, u, u.pos.x, u.pos.z, ctx([]), false)
        if (!(a < b)) throw new Error(`${where}: ${u.t.short} in the keg's blast scores ${a} with the keg, ${b} without: no fear`)
        counts.fears++
      }
    }
  }
  const never = Object.entries(met).filter(([, v]) => !v).map(([k]) => k)
  if (never.length) throw new Error(`P-keg never met: ${never.join(', ')} (on ${KEG_BOARDS} boards)`)
  return counts
}

// (the races, for P-fight's coverage: the child's)
let RACES_F = null

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
  const missionsOf = async () => (await import(pathToFileURL(join(dir, 'data', 'mission.js')).href)).MISSIONS
  // the HUD model's resultOf (R7b on; null for older code)
  const hud = existsSync(join(dir, 'present', 'hud-model.js')) ? await import(pathToFileURL(join(dir, 'present', 'hud-model.js')).href) : null
  let out
  try {
    if (task.kind === 'corpus') {
      const it = loadCorpus().items.find((x) => x.id === task.id)
      out = { ok: true, counts: corpusTask(core, rng, mirror, it, match, hud) }
    } else if (task.kind === 'random') {
      const lists = task.lists ? { mission: task.lists, RACES, MISSIONS: await missionsOf() } : null
      const r = randomTask(core, rng, mirror, Object.keys(RACES), task.seed, hud, lists)
      out = { ok: true, counts: r.counts, game: { setup: r.setup, log: r.log, trace: r.trace } }
    } else if (task.kind === 'interleave') {
      const [A, B] = task.games
      interleave(core, A, B)
      out = { ok: true, counts: { interleaved: 2 } }
    } else if (task.kind === 'offturn') {
      out = { ok: true, counts: { offTurn: 2, results: offTurnTask(core, hud) } }
    } else if (task.kind === 'height') {
      // (F7a: P-height's boards of its own, and P-level)
      const mod = (...p) => import(pathToFileURL(join(dir, 'core', ...p)).href)
      const [nav, damage, shoot, move, terrain, score] = await Promise.all([mod('nav.js'), mod('actions', 'damage.js'), mod('actions', 'shoot.js'), mod('actions', 'move.js'), mod('terrain', 'terrain.js'), mod('ai', 'score.js')])
      out = { ok: true, counts: heightTask(core, { nav, damage, shoot, move, terrain, score, MISSIONS: await missionsOf() }) }
    } else if (task.kind === 'fight') {
      // (F18: P-fight's scenes)
      const mod = (...p) => import(pathToFileURL(join(dir, 'core', ...p)).href)
      const [score, policy] = await Promise.all([mod('ai', 'score.js'), mod('ai', 'policy.js')])
      RACES_F = RACES
      out = { ok: true, counts: fightTask(core, { rng, score, policy }) }
    } else if (task.kind === 'keg') {
      // (F19a: P-keg's scenes)
      const mod = (...p) => import(pathToFileURL(join(dir, ...p)).href)
      const [shoot, recipes, terrain, score, matchMod, hazards] = await Promise.all([mod('core', 'actions', 'shoot.js'), mod('core', 'terrain', 'recipes.js'), mod('core', 'terrain', 'terrain.js'), mod('core', 'ai', 'score.js'), mod('core', 'match.js'), mod('data', 'hazards.js')])
      out = { ok: true, counts: kegTask(core, { rng, shoot, recipes, terrain, score, match: matchMod, hazards, MISSIONS: await missionsOf() }) }
    } else if (task.kind === 'setups') {
      // (F8a: P-mission, on code whose setups name their mission; F11a: and
      // its armies, on code with core/army.js)
      const missions = core.SETUP_KEYS ? await import(pathToFileURL(join(dir, 'data', 'mission.js')).href) : null
      out = { ok: true, counts: { refused: setupTask(core), missions: missions ? missionTask(core, missions.MISSIONS) : 0, armies: core.army ? armyTask(core, missions, RACES) : 0 } }
    } else if (task.kind === 'army') {
      // (F11a) P-army's fuzz, sweep and shadow
      const MISSIONS = await missionsOf()
      out = { ok: true, counts: { fuzz: fuzzTask(core, RACES, MISSIONS, task.fuzz, task.seed), sweep: sweepTask(core, RACES, MISSIONS), shadow: shadowTask(core) } }
    } else if (task.kind === 'armyGames') {
      out = { ok: true, counts: armyGamesTask(core, RACES, await missionsOf(), task.mission, task.n, task.seed) }
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

// (F11a) P-army's workload: fuzzed armies, and per mission the random
// legal lists played AI against AI (in children of 10) and with a human seat
const ARMY = { fuzz: 100000, ai: 40, human: 10 }

async function run(pkg, { games, seed, only, quiet = false, coverage = true, army = ARMY }) {
  const say = quiet ? () => {} : (s) => console.log(s)
  const { items: all } = loadCorpus()
  const items = only === 'none' ? [] : select(all, only)
  const tasks = [...items.map((it) => ({ kind: 'corpus', id: it.id })), ...Array.from({ length: games }, (_, i) => ({ kind: 'random', seed: seed + i }))]
  // (code with core/army.js: P-army)
  const lists = existsSync(join(pkg, 'core', 'army.js'))
  if (lists) {
    const missions = Object.keys((await import(pathToFileURL(join(pkg, 'data', 'mission.js')).href)).MISSIONS)
    tasks.unshift({ kind: 'army', fuzz: army.fuzz, seed })
    for (const [m, mission] of missions.entries()) {
      for (let k = 0; k < army.ai; k += 10) tasks.push({ kind: 'armyGames', mission, n: Math.min(10, army.ai - k), seed: seed * 1000 + m * 100 + k })
      for (let k = 0; k < army.human; k++) tasks.push({ kind: 'random', seed: 900000 + seed * 1000 + m * 100 + k, lists: mission })
    }
  }
  const t0 = Date.now()
  const res = await pool(tasks, CPUS, async (t) => {
    const r = await child(t, pkg)
    const c = r.counts
    const label = t.kind === 'corpus' ? t.id : t.kind === 'army' ? 'P-army fuzz, sweep' : t.kind === 'armyGames' ? `P-army ${t.mission} #${t.seed}` : t.lists ? `list game ${t.seed}` : `game ${t.seed}`
    const what = !r.ok ? '' : t.kind === 'corpus' ? `${c.probes} decisions probed`
      : t.kind === 'army' ? `${c.fuzz.fuzzed} armies fuzzed (${c.fuzz.refused} refused, ${c.fuzz.both} with both seats fuzzed; ${c.fuzz.taken} taken, ${c.fuzz.roundTrips} seats round-tripped, ${c.fuzz.made} made into matches), ${c.sweep} autoLists legal, ${c.shadow} classic shadows held`
        : t.kind === 'armyGames' ? `${c.listGames} AI battles between lists of ${c.budgets[0]}-${c.budgets[1]} points (score ${c.ends.score}, wipe ${c.ends.wipe})`
          : `${c.ended}, ${c.probes} decisions, ${Object.entries(c.commands).map(([k, n]) => `${k} ${n}`).join(', ')}`
    say(`  ${label.padEnd(24)} ${r.ok ? `ok   ${what}` : `FAIL ${r.error}`}`)
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
    say(`  setups and G's shape: ${r.ok ? `ok   ${r.counts.refused} bad setups refused, the edges taken, pending null through an all-AI battle${r.counts.missions ? `; (P-mission) ${r.counts.missions} mission setups and missions held` : ''}${r.counts.armies ? `, ${r.counts.armies} army refusals, spellings and list rules` : ''}` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
    // (code with SETUP_KEYS whitelists its setups: P-mission must have run)
    else if (existsSync(join(pkg, 'data', 'mission.js')) && /SETUP_KEYS/.test(readFileSync(join(pkg, 'core', 'match.js'), 'utf8')) && !r.counts.missions) bad.push({ error: 'the code whitelists its setups, but P-mission held nothing' })
    // (code with core/army.js names its armies: P-mission's must have run)
    else if (lists && !r.counts.armies) bad.push({ error: 'the code has core/army.js, but P-mission held no army refusal' })
  }
  // (F7a) P-height's own boards and P-level, for code with a height layer
  if (/export function levelDist/.test(readFileSync(join(pkg, 'core', 'queries.js'), 'utf8'))) {
    const r = await child({ kind: 'height' }, pkg)
    say(`  P-height and P-level: ${r.ok ? `ok   3 classic boards flat; ${r.counts.boards} fortified boards (and ${r.counts.grand} Grand-sized for P-level): ${r.counts.cells} cells standable only off the ledges' bands, ${r.counts.steps} reach steps within STEP (${r.counts.links} over ladders, at their cost, climbing), ${r.counts.plans} move plans at ladders' feet climbing for exactly the climbers, ${r.counts.ledges} pairs under 1" apart but more than 1.2" apart in height unengaged (no bubble, no charge spot off the level) and ${r.counts.flat} on one level engaged; the scenes: the keep held from its top (${r.counts.keepTop}), ${r.counts.controlAbove} ground objectives not held from a deck beside them, ${r.counts.blastSpared} templates on decks sparing the ground below, ${r.counts.smashSkipped} smashes skipping a raised piece (${r.counts.smashHit} taking a grounded one), ${r.counts.pileRefused} pile-ins onto a ledge's band refused (${r.counts.pileIn} onto open deck taken), ${r.counts.chargeOver} charges onto a deck beside an enemy below; levelDist the gate graph's Dijkstra on ${r.counts.pairs} pairs${r.counts.lobPairs ? `; (F17) rangeOf the physics' reach, shotInfo's and the AI's range tests by it, on ${r.counts.lobPairs} shooter-target pairs, ${r.counts.lobDown} lobs from a deck past the printed range taken (${r.counts.lobValued} valued by the AI), ${r.counts.lobUp} up at a deck within it refused` : ''}` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // (F18) P-fight's scenes, for code that shoots into a fight
  if (/export function fightOf/.test(readFileSync(join(pkg, 'core', 'queries.js'), 'utf8'))) {
    const r = await child({ kind: 'fight' }, pkg)
    say(`  P-fight: ${r.ok ? `ok   ${r.counts.legal} shots at a target locked in combat or clear of it, every ranged weapon of both races legal; ${r.counts.volleys} volleys held die for die (${r.counts.misses} misses into a fight, ${r.counts.strays} strayed by the share), the clear shots drawing no stray die, the target's rows and line before the friend's; ${r.counts.templates} templates straying nothing; ${r.counts.ties} ties and broken ties striking the right friend; ${r.counts.values} AI values net of the friendly fire; the Venom Engine at its own Brute's foe ${r.counts.brute} times, holding its fire ${r.counts.bruteDeclined}` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // (F19a) P-keg's scenes, for code with the powder keg
  if (/export function kegsGoOff/.test(readFileSync(join(pkg, 'core', 'actions', 'shoot.js'), 'utf8'))) {
    const r = await child({ kind: 'keg' }, pkg)
    say(`  P-keg: ${r.ok ? `ok   no keg on ${r.counts.clean} boards of classic, open and fortified, one at (0, 0) on ${r.counts.kegBoards} keg boards; ${r.counts.templates} templates setting the keg off once (${r.counts.once} again on the same spot setting nothing off), the setting-off blast's victims and scenery before the keg's line, fuse and blast, ${r.counts.rows} victims' rows held die for die in G.units order, the fallen the setter-off's; ${r.counts.chains} chains of four kegs going off in the line's order, each once; ${r.counts.walks} wreckers' walks setting it off once the walk ended; ${r.counts.values} AI keg values and ${r.counts.fears} cells in the blast feared` : `FAIL ${r.error}`}`)
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
  const ends = res.filter((r, i) => r.ok && ['corpus', 'random'].includes(tasks[i].kind)).length + (offTurn.ok ? 2 : 0)
  if (existsSync(join(pkg, 'present', 'hud-model.js')) && results !== ends) bad.push({ error: `the code has present/hud-model.js, but resultOf(G) was held to the game.over at ${results} of ${ends} ends` })
  if (coverage && games >= 8) {
    const never = Object.entries(reached).filter(([, n]) => !n).map(([k]) => k)
    if (never.length) bad.push({ error: `the random games never reached: ${never.join(', ')} (more --games?)` })
  }
  // (F11a) P-army: what it held, over the run
  let armySaid = ''
  if (lists) {
    const fz = res.find((r, i) => r.ok && tasks[i].kind === 'army')?.counts
    const ai = res.filter((r, i) => r.ok && tasks[i].kind === 'armyGames').reduce((n, r) => n + r.counts.listGames, 0)
    const human = res.filter((r, i) => r.ok && tasks[i].lists).length
    const want = tasks.filter((t) => t.kind === 'armyGames').reduce((n, t) => n + t.n, 0)
    if (!bad.length && (!fz || ai !== want || human !== tasks.filter((t) => t.lists).length)) bad.push({ error: `P-army ran short: ${fz ? 'the fuzz held' : 'no fuzz'}, ${ai} of ${want} AI list battles, ${human} list games with a human seat` })
    if (fz) armySaid = `; (P-army) ${fz.fuzz.fuzzed} fuzzed armies, ${fz.fuzz.refused} refused with a seat's reason and ${fz.fuzz.taken} taken in their one spelling (${fz.fuzz.made} made into matches), ${fz.sweep} autoLists legal, ${fz.shadow} classic shadows unchanged, ${ai + human} random legal lists' battles played to the end (${human} with a human seat)`
  }
  say(`\n${items.length} corpus battles and ${games} random games (${Object.entries(reached).map(([k, n]) => `${k} ${n}`).join(', ')}), ${probes} decisions probed (${heights} of them on fortified boards, held to P-height), every AI command held to legal(), ${refolded} random games' logs folded by foldJob the same, ${quietly} corpus battles folded quietly as well (${res.reduce((n, r) => n + (r.counts?.hashed ?? 0), 0)} stateHashes before entries the same), the match's events held to the mirror at ${mirrored[0]} acts and ${mirrored[1]} stops, ${sessions[0]} corpus battles played through the Session the same (the sink handed all ${sessions[2]} events the core left, in order; ${sessions[1]} junk entries refused on replay; ${sessions[3]} of the Folder's rules held on replays), resultOf(G) the match's game.over at ${results} ends${armySaid} (${Math.round((Date.now() - t0) / 1000)} s)`)
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
  // climb; (F7a's review) a levelDist with no stair underfoot or no deck as
  // a shortcut (the second seen only on the Grand-sized boards, where
  // bastions stand), an objective held from a deck beside it, a template
  // that hits through a deck, a smash at any level, a pile-in anywhere, and
  // another enemy that bars a charge's spot whatever its level
  'reach-ignores-step': ['core/nav.js', '          if (Math.abs(floor[j] - fi) > STEP) continue\n', ''],
  'standable-ignores-cliff': ['core/nav.js', " >= r - 0.06 && this.cliff[i] >= r - 0.06\n", ' >= r - 0.06\n'],
  'leveldist-misses-a-gate': ['core/queries.js', '    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b\n    for (const k of gg.at.get(L) ?? []) {', '    const L = la || lb, g0 = la ? b : a, g1 = la ? a : b\n    for (const k of (gg.at.get(L) ?? []).slice(1)) {'],
  'leveldist-no-stair': ['core/queries.js', '  if (i < 0 || nav.rampOf[i] < 0) return -1\n', '  return -1\n'],
  'leveldist-no-shortcut': ['core/queries.js', '      short.push([u, v, d])\n', ''],
  'control-ignores-height': ['core/queries.js', ' <= OBJECTIVE_RANGE + u.t.base && Math.abs(floorAt(G, x, z) - y) <= HIGH) oc[u.side] += u.t.OC', ' <= OBJECTIVE_RANGE + u.t.base) oc[u.side] += u.t.OC'],
  'blast-flat': ['core/actions/shoot.js', 'hypot3(mx(v, m) - land.x, floorAt(G, mx(v, m), mz(v, m)) - ly, mz(v, m) - land.z)', 'hypot(mx(v, m) - land.x, mz(v, m) - land.z)'],
  'smash-any-level': ['core/actions/move.js', '    if (G.nav.hasHeight && Math.abs((c.base ?? 0) - y) > HIGH) continue\n', ''],
  'pile-in-anywhere': ['core/actions/damage.js', "    else if (G.nav.standable(G.nav.index(x, z), u.r, moveMode(u) === 'wreck' ? 'wreck' : 'walk')) setUnitPos(u, x, z)", '    else setUnitPos(u, x, z)'],
  'charge-others-flat': ['core/actions/charge.js', ' && Math.abs(nav.floor[i] - oy[k]) <= HIGH)) continue', ')) continue'],
  'engaged-ignores-height': ['core/queries.js', 'gap(u, e) <= ENGAGE + 0.05 && Math.abs(groundY(G, u) - groundY(G, e)) <= HIGH)', 'gap(u, e) <= ENGAGE + 0.05)'],
  'everyone-climbs': ['core/actions/move.js', 'forbid: mode === \'fly\' ? null : forbid, climb: climbs(u) })', 'forbid: mode === \'fly\' ? null : forbid, climb: true })'],
  // (F17) lobbing from height: a reach that ignores the height, direct
  // fire (and spells) lobbing too, and an AI that weighs the printed range
  // while the rules take the lob
  'lob-flat': ['core/actions/shoot.js', '  if (!G.nav.hasHeight || !lobbed(w)) return w.range\n', '  return w.range\n'],
  'lob-direct': ['core/actions/shoot.js', 'export const lobbed = (w) => !!w && !w.spell && !!(w.blast || w.indirect)', 'export const lobbed = (w) => !!w'],
  'lob-ai-flat': ['core/ai/score.js', '  if (g > rangeOf(G, u, e, from)) return 0\n', '  if (g > w.range) return 0\n'],
  // (F18) P-fight: a target in a fight refused again, a stray die drawn
  // with no friend in the fight, a stray per hit rather than per miss, the
  // share the target's, the strays' draws after the target's wound roll,
  // the friend's rows before the target's, a tie struck on the last of two
  // alike, and an AI that weighs neither a volley's strays nor a template's
  // friends under it
  'fight-barred': ['core/actions/shoot.js', "  const s = sight(G, u, target)\n  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }\n", "  if (isEngaged(G, target) && !w.spell) return { ok: false, why: 'locked in combat' }\n  const s = sight(G, u, target)\n  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }\n"],
  'stray-draws-clear': ['core/actions/shoot.js', '  if (fight) {\n    const share = fight.F / (fight.F + fight.T)\n', '  {\n    const share = fight ? fight.F / (fight.F + fight.T) : 0\n'],
  'stray-per-hit': ['core/actions/shoot.js', 'if (d < info.need && draw(G.rng) < share) stray++', 'if (d >= info.need && draw(G.rng) < share) stray++'],
  'stray-share-flipped': ['core/actions/shoot.js', '    const share = fight.F / (fight.F + fight.T)\n', '    const share = fight.T / (fight.F + fight.T)\n'],
  'stray-after-wound': ['core/actions/shoot.js', '  if (fight) {\n    const share = fight.F / (fight.F + fight.T)\n    for (const d of hits) if (d < info.need && draw(G.rng) < share) stray++\n  }\n  const wn = woundNeed(w.S, target.t.T, w.poison)\n  const wd = roll(G, h)\n', '  const wn = woundNeed(w.S, target.t.T, w.poison)\n  const wd = roll(G, h)\n  if (fight) {\n    const share = fight.F / (fight.F + fight.T)\n    for (const d of hits) if (d < info.need && draw(G.rng) < share) stray++\n  }\n'],
  // (F19a) P-keg: a keg that goes off twice, a chain gone off depth first
  // (the keg a keg's blast broke going off before the rest of the line),
  // a walk's keg never set off, a keg on the classic set, and an AI that
  // weighs no keg in a gun's shot
  'keg-twice': ['core/actions/shoot.js', '    for (const next of landing(G, u, at, w, at)) line.push(next)\n', '    for (const next of landing(G, u, at, w, at)) line.push(next, next)\n'],
  'keg-depth-first': ['core/actions/shoot.js', '    for (const next of landing(G, u, at, w, at)) line.push(next)\n', '    line.splice(i + 1, 0, ...landing(G, u, at, w, at))\n'],
  'keg-walk-dud': ['core/commands.js', '    if (kegs.length) kegsGoOff(G, unit, kegs)\n', ''],
  'keg-on-classic': ['core/terrain/sets.js', "    centre: [['tower', 0.55], ['rockbox', 0.8]],\n    kinds: [\n      ['ruin', 3.2, 4],", "    centre: [['keg', 0.1], ['tower', 0.55], ['rockbox', 0.8]],\n    kinds: [\n      ['ruin', 3.2, 4],"],
  'keg-ai-blind': ['core/ai/score.js', '    return keg ? value + pHit * keg : value\n', '    return value\n'],
  'friend-rows-first': ['core/actions/shoot.js', '  const wn = woundNeed(w.S, target.t.T, w.poison)\n  const wd = roll(G, h)\n', '  if (stray) (strayHits(G, u, fight.onto, stray, w), stray = 0)\n  const wn = woundNeed(w.S, target.t.T, w.poison)\n  const wd = roll(G, h)\n'],
  'stray-tie-last': ['core/queries.js', '    if (f.alive > onto.alive) onto = f\n', '    if (f.alive >= onto.alive) onto = f\n'],
  'ai-ignores-strays': ['core/ai/score.js', ' - (fight ? strayCost(n, need, w, fight) : 0)', ''],
  'ai-ignores-own-template': ['core/ai/score.js', ' - (pre ? pre.own : ownUnder(G, u, e)))', ')'],
  // (F8a, P-mission) a setup's stray field copied through, as before F8a
  'whitelist-off': ['core/index.js', "  for (const [k] of fields) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n", ''],
  // (F8a's review) the whitelist read off the copy, as first built: a
  // __proto__ field sets the copy's prototype and slips past it
  'whitelist-after-copy': ['core/index.js', "  for (const [k] of fields) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n  const s = {}\n  for (const [k, v] of fields) s[k] = v\n", "  const s = {}\n  for (const [k, v] of fields) s[k] = v\n  for (const k of Object.keys(s)) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field \"${k}\"`)\n"],
  // a mission MISSIONS lacks taken (the match then has no board)
  'mission-unchecked': ['core/index.js', "  if (typeof s.mission !== 'string' || !(s.mission in MISSIONS)) throw new Error(`no mission ${JSON.stringify(s.mission)} (there ${Object.keys(MISSIONS).length === 1 ? 'is' : 'are'} ${Object.keys(MISSIONS).join(', ')})`)\n", ''],
  // a set the mission isn't fought on taken (as long as it exists)
  'set-unchecked': ['core/index.js', "  if (!mission.sets.includes(s.terrain)) throw new Error(`the ${s.mission} mission is fought on ${mission.sets.join(' or ')}, not ${JSON.stringify(s.terrain)}`)\n", ''],
  // (F11a, P-mission and P-army) fullSetup leaves the armies to newState:
  // createMatch still refuses them, with the same words, but fullSetup (the
  // lobby's and the Muster screen's check) takes any
  'army-unchecked': ['core/index.js', '  for (let i = 0; i < s.seats.length; i++) armyOf(s, i)\n', ''],
  // checkList lets a list over the points limit through
  'points-unchecked': ['core/army.js', '  if (cost > rules.points) return `${cost} points, over the ${S} limit of ${rules.points}`\n', ''],
  // the seats checked seat 1 first: a setup with both seats broken is
  // refused with seat 1's reason, on one peer's build and not another's
  'seat-1-first': ['core/index.js', 'for (let i = 0; i < s.seats.length; i++) armyOf(s, i)', 'for (let i = s.seats.length - 1; i >= 0; i--) armyOf(s, i)'],
  // the roles judged out of ROLES order
  'roles-reversed': ['core/army.js', '  for (const r of ROLES) {\n    const [min, max] = rules.roles[r], got = role[r]', '  for (const r of [...ROLES].reverse()) {\n    const [min, max] = rules.roles[r], got = role[r]'],
  // a list with trailing zeros taken: two spellings of one army
  'list-trailing-zeros': ['data/schema.js', 'export const LIST = Object.freeze(/^[0-9]*[1-9]$/)', 'export const LIST = Object.freeze(/^[0-9]+$/)'],
  // newState builds the race's classic army whatever the seat names: the
  // classic corpus (no army: the classic preset) can't see it, P-army's
  // lists do
  'newstate-race-army': ['core/match.js', 'for (const key of armyOf(G.setup, side).keys)', 'for (const key of raceOf(G, side).army)'],
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
  'quiet-smash': ['core/actions/move.js', 'if (smashAround(G, u, p, ev, broke) && ev)', 'if (ev && smashAround(G, u, p, ev, broke))'],
  // a command's handler leaves the nav grid stale
  'nav-dirty': ['core/actions/move.js', '  // (the nav follows the walk, at today\'s site: DESIGN §4.1 rule 9)\n  refreshNav(G)\n  return kegs\n}', '  G.terrain.dirty = true\n  return kegs\n}'],
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
  // (F11a: P-army's workload cut down, its fuzz a fifth and a few list battles)
  const load = { games: 10, seed: 1, only: 'hotseat-late-8,bushtail-random-6,64-89', quiet: true, coverage: false, army: { fuzz: 20000, ai: 3, human: 1 } }
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
console.log(bad.length ? `\nproperty FAILED: ${bad.length} problem(s)` : '\nproperty passed: asking never rolls or changes the match, the AI never plays an illegal command, random legal play never throws, two matches never touch, a quiet fold plays the same battle, the events show the match, a setup the rules can\'t play is refused, and (F11a) a seat\'s army is refused for its own reason or played as its list says')
process.exit(bad.length ? 1 : 0)
