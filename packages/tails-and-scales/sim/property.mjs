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
// 14. (F9a) P-riders, on code with core/actions/transport.js (the block
//    above its tasks below says what each holds): a rider's state after
//    every entry and at every trace line of the AI battles with War-Carts
//    (10: Field and Grand, open and fortified, and the Powder Field, which
//    takes War-Carts since the V3 merge), riders hidden from every
//    spatial rule (each query with and without them), the bail-outs as
//    they are emitted, the autoload, and every embark and disembark legal()
//    takes held to DESIGN §4.2.5's table, over those battles, 6 random
//    games with War-Carts and a human seat (embark and disembark among the
//    battery) and P-army's list battles; the scenes (a bail-out by an
//    enemy's 1" and one with nowhere to stand, a template over a hull, the
//    AI's friendly fire round one, the deployment's re-arranging, a phase's
//    embark and disembark, `rode`; and the V3 merge's rules where a hull
//    meets V3c's spells: a snared unit's boarding refused, a snared hull's
//    move and advance refused while its riders may step off and the AI's
//    phase leaving it where it stands, a rider no target of any spell, a
//    friend's ward included, for the shoot command or shotInfo); every
//    embark legal() takes also of a unit no snare holds (rideWrong);
//    P-pilot's F9a row (a mask naming a rider without its hull in the
//    movement phase refused); and P-army's deployment at the caps with two
//    War-Carts a side (80 boards: Field 40, Grand 20, the Powder Field 20).
//
// 15. (V3c) P-spell, on code whose casters have several spells (bestCast):
//    on scenes of its own (spellTask below says what each holds): every
//    spell of both casters castable at a target it takes, once a phase, its
//    cast die for die, refused at the other side, past its range and at the
//    dead; its mark made (a ward, a resolve, a snare, the gaze) or its
//    template landed (Venom Mist hurting no scenery); each mark worn off when
//    it must (a ward and a resolve as the caster's side's next turn begins,
//    a snare and the gaze as the victim's own turn ends) and holding until
//    then, the snared unit's move, advance and charge refused; a ward's save
//    one better, a resolute squad untested and its failed charge rolled
//    again; the AI's pick a spell on a friend when no enemy is in reach,
//    and its pick the tool's default. And at every decision of the probes
//    (spellRules): no spell legal but a caster's own, once a phase, on a
//    target of the side the spell takes within its range, no snared unit
//    moving or charging, no mesmerized one charging, and (F9a, at the V3
//    merge) no shot or spell by a rider or at one (the battery casts every
//    spell at every rider of either side); and every spell of
//    both casters cast by a random game's human seat over the run.
//
//   node sim/property.mjs [--games N] [--seed S] [--only <kinds, modes or ids>] [--dir <packageDir> | --ref <ref>]
//   node sim/property.mjs --self-test     each broken copy of the core in
//                                         MUTATIONS below must fail it
//                         [--mutations a,b]   only these of them
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
import { foldJob, shadowPartsG, mirrorTap, jobSetup, loadMatch, seatDevices, differ } from './run.mjs'
import { shadowString } from './oracle/shadow.mjs'
import { mulberry32 } from './oracle/human-bot.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

let a
try {
  ({ values: a } = parseArgs({
    options: {
      games: { type: 'string' }, seed: { type: 'string' }, only: { type: 'string' }, dir: { type: 'string' }, ref: { type: 'string' },
      child: { type: 'boolean' }, 'self-test': { type: 'boolean' }, mutations: { type: 'string' },
    },
  }))
} catch (e) {
  console.error(`property: ${e.message}\nusage: node sim/property.mjs [--games N] [--seed S] [--only <kinds, modes or ids> | none] [--dir <packageDir> | --ref <ref>] | --self-test [--mutations <names>]`)
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
      // ((V3c) a caster's spells: each at every unit it takes and at a few
      // of either side at random (a ward or a resolve at a friend, the
      // caster too, the rest at an enemy, and each the other way round),
      // and (F9a, at the V3 merge) at every rider of either side, which
      // none takes; the AI's own pick (the tool's default) and its pick at
      // an enemy (a group's fire); spells the caster hasn't, and a spell
      // named for a unit with none)
      if (q.weaponOf && u.t.spells) {
        u.t.spells.forEach((w, sp) => {
          for (const x of [...q.shootTargets(G, u, sp), ...some(G.units, 4), ...G.units.filter((r) => r.aboard)]) {
            out.push({ t: 'shoot', u: u.id, tg: x.id, sp })
            if (q.alive(u) && q.alive(x)) q.shotInfo(G, u, x, sp)
          }
        })
        if (q.alive(u)) q.bestSpell(G, u), q.spellFor(G, u, theirs[0]), q.hasTarget(G, u)
        out.push({ t: 'shoot', u: u.id, tg: theirs[0].id, sp: u.t.spells.length }, { t: 'shoot', u: u.id, tg: theirs[0].id, sp: -1 }, { t: 'shoot', u: u.id, tg: u.id, sp: 1.5 })
      } else if (q.weaponOf) out.push({ t: 'shoot', u: u.id, tg: theirs[0].id, sp: 0 })
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
    // (F9a) boarding and stepping off, on code with transports and only
    // where a hull stands on the table (so a battle without one draws no
    // more here): every own unit that is no vehicle onto each own hull, a
    // unit onto the enemy's hull, a hull onto a hull, an enemy onto one;
    // each rider onto cells of its landing, onto its hull's own cell and a
    // random one, and a unit riding nothing; and (P-pilot's F9a row) a mask
    // naming a rider without its hull, and with it
    if (q.isTransport && G.units.some((u) => q.alive(u) && q.isTransport(u))) {
      const hulls = mine.filter((u) => q.alive(u) && q.isTransport(u)), foreign = theirs.filter((u) => q.alive(u) && q.isTransport(u))
      for (const u of mine.filter((u) => q.alive(u) && !u.t.vehicle)) for (const v of hulls) out.push({ t: 'embark', u: u.id, v: v.id })
      for (const v of foreign.slice(0, 1)) for (const u of some(mine.filter((x) => q.alive(x)), 2)) out.push({ t: 'embark', u: u.id, v: v.id })
      if (hulls.length > 1) out.push({ t: 'embark', u: hulls[0].id, v: hulls[1].id })
      const foe = theirs.find((u) => q.alive(u))
      if (hulls.length && foe) out.push({ t: 'embark', u: foe.id, v: hulls[0].id })
      for (const p of mine.filter((u) => u.aboard)) {
        const v = G.units.find((x) => x.id === p.aboard)
        for (const c of some(q.landing(G, p, v), 3)) out.push({ t: 'disembark', u: p.id, c })
        out.push({ t: 'disembark', u: p.id, c: nav.index(v.pos.x, v.pos.z) }, { t: 'disembark', u: p.id, c: cell() })
      }
      for (const u of some(mine.filter((x) => q.alive(x) && !x.aboard), 1)) out.push({ t: 'disembark', u: u.id, c: nav.index(u.pos.x, u.pos.z) })
      for (const p of mine.filter((u) => u.aboard && q.alive(u)).slice(0, 2)) {
        const j = mine.indexOf(p), h = mine.findIndex((x) => x.id === p.aboard)
        out.push({ t: 'pilot', m: 2 ** j }, { t: 'pilot', m: 2 ** j + 2 ** h })
      }
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
const KEYS = { place: ['u', 'c'], deployed: [], advance: ['u'], move: ['u', 'c'], shoot: ['u', 'tg', 'sp'], charge: ['u', 'tg'], chargeEnd: ['c'], end: [], auto: [], pilot: ['m'], vote: ['more'], concede: [], embark: ['u', 'v'], disembark: ['u', 'c'] }

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
  // (F9a) every embark and disembark legal() takes is one DESIGN §4.2.5's
  // table allows, judged here from the match (rideWrong), not by the
  // core's own mayBoard and mayLand; and (P-pilot's F9a row) in the
  // movement phase a mask naming a rider names its hull too
  for (const b of ok.filter((b) => b.t === 'embark' || b.t === 'disembark')) {
    const why = rideWrong(core, G, seat, b)
    if (why) throw new Error(`${where}: legal() accepted ${JSON.stringify(b)}, which ${why}`)
  }
  if (G.pending?.k === 'phase' && G.pending.phase === 'move') {
    for (const b of ok.filter((b) => b.t === 'pilot')) {
      const seats = G.units.filter((u) => u.side === seat), named = seats.filter((u, j) => Math.floor(b.m / 2 ** j) % 2)
      const loose = named.find((u) => u.aboard && !named.some((h) => h.id === u.aboard))
      if (loose) throw new Error(`${where}: legal() accepted a pilot in the movement phase naming unit ${loose.id}, which rides unit ${loose.aboard}, without its hull: ${JSON.stringify(b)}`)
    }
  }
  // a wipe-out decides the battle (it ends at the phase's end): nobody
  // concedes it after
  if (G.turn.wiped >= 0 && ok.some((b) => b.t === 'concede')) throw new Error(`${where}: legal() lets seat ${seat} concede a battle seat ${G.turn.wiped}'s wipe-out decided`)
  spellRules(core, G, seat, ok, where)
  return ok
}

// (V3c, P-spell) What legal() took at a decision, held to the spells' rules
// as written here, not by the core's own shotInfo: a shot names a spell
// only of a caster, one it has; a caster that has shot or cast this phase
// casts nothing more; a ward or a resolve goes on a standing unit of the
// seat's own (the caster too) within the spell's range, every other spell
// and shot on a standing enemy within its range (a spell never lobs); no
// snared unit moves or advances (its fall back included), and no snared or
// mesmerized one charges. (F9a, at the V3 merge) And no shot or spell
// whose shooter or target is aboard a vehicle: a rider neither shoots nor
// casts, and is no one's target, a friend's spell's included (DESIGN
// §4.2.5). Returns how many spells it held.
function spellRules(core, G, seat, ok, where) {
  if (!core.q.weaponOf) return 0
  const unit = (id) => G.units.find((u) => u.id === id)
  let n = 0
  for (const b of ok) {
    const u = unit(b.u)
    if ((b.t === 'move' || b.t === 'advance') && u.snared) throw new Error(`${where}: legal() lets the snared ${u.t.short} ${b.t}: ${JSON.stringify(b)}`)
    if (b.t === 'charge' && (u.snared || u.mesmerized)) throw new Error(`${where}: legal() lets the ${u.snared ? 'snared' : 'mesmerized'} ${u.t.short} charge: ${JSON.stringify(b)}`)
    if (b.t !== 'shoot') continue
    const tg = unit(b.tg)
    if (u.aboard || tg?.aboard) throw new Error(`${where}: legal() lets ${u.t.short}${u.aboard ? `, aboard unit ${u.aboard},` : ''} ${b.sp === undefined ? 'shoot' : `cast spell ${b.sp}`} at ${tg ? tg.t.short : `unit ${b.tg}`}${tg?.aboard ? `, aboard unit ${tg.aboard}` : ''}: a rider neither shoots nor casts, and is no target: ${JSON.stringify(b)}`)
    if (b.sp !== undefined && !u.t.spells) throw new Error(`${where}: legal() takes spell ${b.sp} of ${u.t.short}, which casts none`)
    const w = b.sp === undefined ? u.t.ranged : u.t.spells[b.sp]
    if (!w) throw new Error(`${where}: legal() takes spell ${b.sp} of ${u.t.short}, which has ${u.t.spells.length}`)
    if (u.flags.shot) throw new Error(`${where}: legal() lets ${u.t.short} ${w.spell ? `cast ${w.name}` : 'shoot'} again this phase`)
    const ally = !!(w.ward || w.resolve)
    if (!tg || !core.q.alive(tg) || (tg.side === seat) !== ally) throw new Error(`${where}: legal() takes ${u.t.short}'s ${w.name} at ${tg ? `${tg.t.short}, ${tg.side === seat ? 'a friend' : 'an enemy'}${core.q.alive(tg) ? '' : ', destroyed'}` : `no unit ${b.tg}`}`)
    const gap = tg === u ? 0 : Math.hypot(tg.pos.x - u.pos.x, tg.pos.z - u.pos.z) - u.r - tg.r
    if (w.spell && gap > w.range + 1e-9) throw new Error(`${where}: legal() takes ${u.t.short}'s ${w.name} at ${tg.t.short}, ${gap.toFixed(2)}" off, past its ${w.range}"`)
    if (w.spell) n++
  }
  return n
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
// draws are a plain game's), one seat at least a human's. (F9a, P-riders)
// With `lists.mods` (code with transports) a list game with a hull on the
// table is held to P-riders at every decision (the state, the autoload as
// it deploys, the riders hidden at half of them, the bail-outs as they are
// emitted); `lists.rides` makes it one: the Bushtails in seat 0, against
// Bushtails or the Coil, each Bushtail list holding War-Carts.
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
    if (lists.rides) setup.seats.forEach((x, i) => (x.race = i === 0 || seed % 2 === 0 ? 'squirrel' : 'serpent'))
    for (const x of setup.seats) {
      const budget = rules.points - 5 * Math.floor(pickList() * (rules.points / 12.5))
      const at = { ...rules, points: budget }
      x.army = (lists.rides && cartList(core.army, lists.RACES[x.race], at, pickList)) || core.army.listText(core.army.autoList(lists.RACES[x.race], at, Math.floor(pickList() * 2 ** 32)))
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
      if (rides && e.t === 'unit.disembark' && !e.forced) counts.rides.steps++
      if (e.t === 'round.scored') seen.scored++
      else if (e.t === 'stage' && e.stage === 'battle') seen.battle = true
      else if (e.t === 'game.over') seen.over.push(e)
    }
    if (fortified) heightEvents(G, events, where)
    tap.fold(G, events, where)
  }
  // ((F9a) the match's out watched, for the bail-outs, on code with
  // transports)
  const mods = lists?.mods ?? null
  const out = mods ? new Watched() : [], watch = mods ? bailWatch(core, mods) : null
  if (watch) out.watch = watch.event
  const G = core.createMatch(setup, { out, strict: true, onTrace: watch ? (line, g) => ((watch.G = g), tap.trace(line, g)) : tap.trace })
  if (watch) watch.G = G
  const rides = !!watch && G.units.some((u) => u.t.transport)
  if (lists) unitsAre(core, G, lists.RACES, where0)
  if (lists?.rides && !rides) throw new Error(`${where0}: a P-riders game fields no War-Cart (its lists ${setup.seats.map((x) => x.army).join(', ')})`)
  if (rides) counts.rides = { games: 1, autoloaded: 0, hidden: 0, embarkDeploy: 0, embarkPhase: 0, disembarks: 0, steps: 0, bailed: 0, lost: 0 }
  const last = { trace: 0, n: 0 }
  let conceded = -1, piloted = ''
  for (let k = 0; G.turn.stage !== 'over'; k++) {
    const where = `${where0} decision ${k}`
    if (k > 3000) throw new Error(`${where}: the battle never ends`)
    invariants(core, G, where, last)
    if (fortified) counts.heights = (counts.heights ?? 0) + heightRules(core, G, where, rand)
    if (k === 0) lockCheck(core, rng, G, where)
    take(where)
    // (F9a, P-riders) the state, the autoload as the deployment opens, the
    // bail-outs settled, and the riders hidden at half the decisions
    if (rides) {
      watch.where = where
      watch.settle(where)
      ridersState(core, mods, G, where)
      if (k === 0) counts.rides.autoloaded = autoloadCheck(G, where)
      if (rand() < 0.5) counts.rides.hidden += ridersHidden(core, mods, G, where)
    }
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
    if (rides && body.t === 'embark') counts.rides[G.pending.k === 'deploy' ? 'embarkDeploy' : 'embarkPhase']++
    if (rides && body.t === 'disembark') counts.rides.disembarks++
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
    // ((V3c) the spells a human seat's command cast, by caster and name)
    if (body.t === 'shoot' && body.sp !== undefined) {
      const caster = G.units.find((x) => x.id === body.u), k = `${caster.t.key} ${caster.t.spells[body.sp].name}`
      counts.spells = { ...counts.spells, [k]: (counts.spells?.[k] ?? 0) + 1 }
    }
  }
  invariants(core, G, `${where0} at its end`, last)
  if (fortified) counts.heights = (counts.heights ?? 0) + heightRules(core, G, `${where0} at its end`, rand)
  take(`${where0} at its end`)
  if (rides) {
    watch.settle(`${where0} at its end`)
    ridersState(core, mods, G, `${where0} at its end`)
    Object.assign(counts.rides, { bailed: watch.counts.bailed, lost: watch.counts.lost })
  }
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
  'an unknown mission': [{ mission: 'raid' }, /^no mission "raid" \(there are classic, field, grand, keg, powder\)$/],
  'a mission named in capitals': [{ mission: 'Grand' }, /^no mission "Grand" \(there are classic, field, grand, keg, powder\)$/],
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
  // ((V3d) the Powder Field is fought on its own set alone, and no other
  // mission on it)
  'the powder mission on the open set': [{ mission: 'powder', terrain: 'open' }, /^the powder mission is fought on powder, not "open"$/],
  'the grand mission on the powder set': [{ mission: 'grand', terrain: 'powder' }, /^the grand mission is fought on open or fortified, not "powder"$/],
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
  // (F9a: the Bushtails' roster is seven long, the War-Cart appended)
  'a list longer than the roster': ['11211131', NO, /^seat 0's list "11211131" counts 8 kinds of unit; the Bushtail Clans muster 7 \(elder oakguard nutkin grenadier glider trebuchet warcart\)$/],
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
  "both seats broken: seat 0's list, seat 1's preset": ['11211131', 'grnad', /^seat 0's list "11211131" counts 8 kinds/],
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
// classic board has: the pins as under 9; 11, F9a's `aboard`, printed
// only for a rider, and its wreck, only where a hull falls: DESIGN §4.2.9's
// P-prop row, a classic match's shadowState unchanged across F9a, the pins
// as under 10; 12, the V3 rules landed together: V3c's spells, the format
// unchanged for a unit no spell marks, 64-89 another battle again and
// serpent-random-2 played again by its bot, and V3d's Powder Field, which
// no pinned match is fought on: data-check's V12)
const PINNED_UNDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const PINS_UNDER = (v) => (v >= 12
  ? { ...V1_PINS, '64-89': { end: '25j1j2sx16w' }, 'serpent-random-2': { 0: '23nc969d48c', 10: '1hdl5k2u5af', end: 'nftnqwgpp7' } }
  : v >= 9 ? { ...V1_PINS, '64-89': { end: '1jmxq628imf' } } : V1_PINS)

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
// (F9a) On code with transports (`mods`), a battle whose lists field a hull
// is held to P-riders' state at every trace line and its bail-outs as they
// are emitted (the Field and Grand lists draw War-Carts).
function armyGamesTask(core, RACES, MISSIONS, mission, n, seed, mods = null) {
  const A = core.army, rand = mulberry32(seed * 2246822519 + 3)
  const int = (k) => Math.floor(rand() * k)
  const races = Object.keys(RACES), rules = MISSIONS[mission].list
  const ends = { score: 0, wipe: 0 }, budgets = []
  let hulls = 0, bailed = 0
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
    const out = mods ? new Watched() : [], watch = mods ? bailWatch(core, mods) : null
    if (watch) {
      out.watch = watch.event
      watch.where = where
    }
    const onTrace = watch ? (line, g) => {
      watch.G = g
      if (!line.startsWith('log ')) ridersState(core, mods, g, `${where} at trace line ${g.journal.trace.length}`)
    } : null
    try {
      G = core.createMatch(setup, { out, strict: true, onTrace })
    } catch (e) {
      throw new Error(`${where}: ${e.stack}`)
    }
    if (G.turn.stage !== 'over') throw new Error(`${where}: an AI battle stopped at ${G.turn.stage}`)
    if (watch) {
      watch.settle(`${where} at its end`)
      hulls += G.units.filter((u) => u.t.transport).length
      bailed += watch.counts.bailed
    }
    unitsAre(core, G, RACES, where)
    invariants(core, G, `${where} at its end`)
    ends[result(G, where, -1)]++
    const bad = traceShape(G)
    if (bad) throw new Error(`${where}: ${bad}`)
  }
  return { listGames: n, ends, budgets: [Math.min(...budgets), Math.max(...budgets)], hulls, bailed }
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
// what it never met and fails. ((F9a, at its merge) No classic preset
// fields the War-Cart, so on code with transports each board plays its
// hulls' fight and clear shot again on a Field battle whose Bushtails
// field the P-riders scenes' list, the Coil its Field preset.)
const FIGHT_BOARDS = 6
function fightTask(core, mods) {
  const q = core.q
  const counts = { legal: 0, volleys: 0, clear: 0, templates: 0, misses: 0, strays: 0, ties: 0, values: 0, brute: 0, bruteDeclined: 0 }
  const met = { fight: new Set(), clear: new Set(), tie: new Set() }
  // ((F9a) the code has transports: their guns are met on Field boards)
  const HULLS = Object.values(RACES_F.squirrel.units).some((t) => t.transport)
  const d6 = (r) => 1 + Math.floor(mods.rng.draw(r) * 6)
  const at = (u, x, z) => {
    u.pos.x = x
    u.pos.z = z
  }
  // a hotseat match at the movement phase of the seat with the first turn,
  // every unit but `keep(G, seat)`'s taken off; returns null when the seat
  // can't field the scene
  // ((F9a, at its merge) `carts`: a Field battle, each Bushtail seat
  // fielding the P-riders scenes' list (two War-Carts), the Coil its Field
  // preset: no classic preset fields the War-Cart, a ranged unit like any)
  const fresh = (board, races, carts = false) => {
    const seats = races.map((race) => ({ race, ctrl: 'human', ...(carts ? { army: race === 'squirrel' ? SCENE_LIST : 'field' } : {}) }))
    const G = core.createMatch({ board, dice: board, ...(carts ? { mission: 'field', terrain: 'open' } : {}), seats }, { out: [] })
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
      // ((F9a) and, on code with transports, a Field battle with War-Carts
      // for the hulls' own guns: the cart pass shoots with them alone, and
      // nobody aboard is a shooter, a target or a friend in the fight)
      for (const carts of HULLS ? [false, true] : [false]) {
        const probe = fresh(board, races, carts)
        const shooters = probe.G.units.filter((u) => u.side === probe.s && u.t.ranged && !u.aboard && (!carts || u.t.transport)).map((u) => u.id)
        for (const uid of shooters) {
          for (const kind of ['fight', 'clear']) {
            const { G, s } = fresh(board, races, carts)
            const u = G.units.find((x) => x.id === uid), w = u.t.ranged
            const where = `P-fight, board ${board} (${races.join(' v ')}${carts ? ', Field with War-Carts' : ''}), ${u.t.short} (${w.name}), ${kind}`
            const e = G.units.find((x) => x.side !== s && x.models.length > 1 && !x.t.fly && !x.aboard)
            const f = G.units.find((x) => x.side === s && x !== u && x.models.length > 1 && !x.aboard)
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
  // no keg but on the keg set ((V3d) and the Powder Field's, whose kegs
  // and caches are kegs in every rule: the keg's hit points, soft, no
  // sight or cover)
  for (const [name, m] of Object.entries(mods.MISSIONS)) {
    for (const set of m.sets) {
      for (let seed = 1; seed <= KEG_SETS_SEEDS; seed++) {
        const T = new mods.terrain.Terrain(m.board.W, m.board.H)
        T.generate(seed, m.objectives, m.deploy, set)
        const kegs = T.chunks.filter((c) => c.kind === 'keg')
        if (set === 'powder') {
          if (!kegs.length || kegs.some((k) => k.hp !== K.hp || k.navKind !== 'soft' || k.los || k.cover)) throw new Error(`P-keg: the Powder Field's board ${seed} stands ${kegs.length} kegs, ${kegs.length ? 'not all with the keg\'s hit points, soft, without sight or cover' : 'none'}`)
          counts.powderBoards = (counts.powderBoards ?? 0) + 1
          counts.powderKegs = (counts.powderKegs ?? 0) + kegs.length
          continue
        }
        if (set !== 'keg' && kegs.length) throw new Error(`P-keg: the ${name} mission's ${set} board ${seed} stands ${kegs.length} powder keg(s): no set but the keg's and the Powder Field's has one`)
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

// ── P-spell (V3c, DESIGN §4.1 rule 29) ──────────────────────────────────────
// The casters' spells, on scenes of their own: for each race's caster (the
// Elder, the Hierophant) in either seat, on SPELL_BOARDS boards, a hotseat
// match at its first shooting phase with everyone gone but the caster, a
// friend of its side within 12" (a squad) and an enemy squad in its range
// and sight (where the board's scenery allows: a scene is tried again only
// for the terrain's reasons), and for each spell of the caster:
//  - castable, once a phase: legal() takes it at a target it takes (the
//    friend for a ward or a resolve, the enemy for the rest; and the caster
//    itself for a ward or a resolve), shootTargets offers that target, and
//    refuses it at the other side's unit, at a destroyed one, and past its
//    range; the cast is the stream's next 2D6 (its "Cast N+ (2D6)" row, its
//    verdict the sum against N), a fizzle marks nothing and plays the
//    fizzle; and once cast (made or not) legal() refuses every spell and
//    every shot of the caster for the rest of the phase;
//  - its mark: made, a ward marks the friend warded, a resolve resolute, a
//    snare the enemy snared, the gaze mesmerized (each in the labels'
//    status straight after), an eruption lands its template under the
//    enemy, and Venom Mist (scenery 0) hurts no chunk and sets no keg off;
//  - its end: the phases played on by End, the ward and the resolve hold
//    through the rest of the caster's turn and the other seat's whole turn
//    and are gone at the caster's next turn's first decision; the snare
//    and the mesmerism hold through the victim's own turn, in which
//    legal() refuses the snared unit's move, advance and charge (canAct
//    false in its movement phase) and the mesmerized one's charge, and are
//    gone when it ends;
// and, on scenes of two matches alike but for a mark set by hand:
//  - a ward: a volley at the warded unit plays the same dice as at the
//    same unit unwarded, its save row one better (`Save N+ (ward)` against
//    `Save N+1+` or `No save`, never better than 2+);
//  - a resolve: in the morale phase the resolute squad's line says it
//    stands resolute and no die is rolled for it (the other match's rolls
//    its test); a resolute charger's failed charge roll is rolled again,
//    at once, the stream's next 2D6 (a second "Charge" row), and stands;
//  - the AI: with no enemy in reach of any spell and a friend in danger,
//    the caster's best cast (bestCast; bestSpell, the tool's default, its
//    spell) is a ward or a resolve, on a friend, and the AI's own pilot of
//    the caster casts it; spellFor never names a spell cast on a friend at
//    an enemy; and bestSpell is bestCast's spell in every scene.
// Every spell of both casters must be cast (made) and fizzled, each mark
// must wear off, the ward's save and the resolve's morale and charge must
// be met, and the AI must pick a spell on a friend, or the run says what
// it never met and fails.
const SPELL_BOARDS = 8
function spellTask(core, mods) {
  const q = core.q
  const counts = { legal: 0, refused: 0, made: 0, fizzled: 0, ends: 0, wards: 0, morale: 0, rerolls: 0, ai: 0, defaults: 0 }
  const met = new Map()
  const meet = (k) => met.set(k, (met.get(k) ?? 0) + 1)
  const d6 = (r) => 1 + Math.floor(mods.rng.draw(r) * 6)
  const at = (u, x, z) => {
    u.pos.x = x
    u.pos.z = z
  }
  const fresh = (board, races) => {
    const G = core.createMatch({ board, dice: board * 7 + 3, seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: [] })
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') throw new Error(`P-spell, board ${board}: no movement phase after the deployment`)
    return { G, s: G.pending.seats[0] }
  }
  const keep = (G, units) => {
    for (const u of G.units) if (!units.includes(u)) u.alive = 0
  }
  const mask = (G, s, u) => G.units.filter((x) => x.side === s).reduce((m, x, j) => (x === u ? m + 2 ** j : m), 0)
  // End the seat's phases until the match waits on `until` (a predicate on
  // G.pending), holding `each` at every decision on the way
  const endUntil = (G, until, where, each = () => {}) => {
    for (let k = 0; k < 40 && G.turn.stage !== 'over'; k++) {
      if (until(G.pending)) return
      each()
      const why = core.legal(G, G.pending.seats[0], { t: 'end' })
      if (why) throw new Error(`${where}: End refused at ${JSON.stringify(G.pending)}: ${why}`)
      core.apply(G, G.pending.seats[0], { t: 'end' })
    }
    if (!until(G.pending)) throw new Error(`${where}: never reached the decision looked for (${JSON.stringify(G.pending)})`)
  }
  // the scene: the caster, a friend squad and an enemy squad, placed at
  // random until the enemy is in the caster's range and sight (the first
  // spell's: every enemy spell's range is 18") and the friend within 12";
  // the same draws give the same places in another match of the board
  const scene = (board, races, rand) => {
    const { G, s } = fresh(board, races)
    const c = G.units.find((u) => u.side === s && u.t.spells)
    const f = G.units.find((u) => u.side === s && u !== c && u.models.length > 1 && !u.t.fly)
    const e = G.units.find((u) => u.side !== s && u.models.length > 1 && !u.t.fly)
    // (and an enemy squad in the far corner, which keeps the other seat's
    // turn one with decisions in it, a snared unit beside it)
    const e2 = G.units.find((u) => u.side !== s && u !== e && u.models.length > 1 && !u.t.fly && u.t.ranged)
    if (!c || !f || !e || !e2) return null
    keep(G, [c, f, e, e2])
    const { W, H } = G.board
    for (let tries = 0; tries < 80; tries++) {
      const x = (rand() - 0.5) * (W - 14), z = (rand() - 0.5) * (H - 10), a = rand() * Math.PI * 2, b = rand() * Math.PI * 2
      at(c, x, z)
      const df = c.r + f.r + 1 + rand() * 6, de = c.r + e.r + 4 + rand() * 10
      at(f, x + Math.cos(a) * df, z + Math.sin(a) * df)
      at(e, x + Math.cos(b) * de, z + Math.sin(b) * de)
      if ([f, e].some((u) => Math.abs(u.pos.x) > W / 2 - 1 || Math.abs(u.pos.z) > H / 2 - 1)) continue
      if (q.gap(f, e) < 2 || q.isEngaged(G, c)) continue
      at(e2, x > 0 ? -W / 2 + 2 : W / 2 - 2, z > 0 ? -H / 2 + 2 : H / 2 - 2)
      if ([c, f, e].some((u) => q.gap(u, e2) < 3)) continue
      const info = q.shotInfo(G, c, e, 0)
      if (info.ok) return { G, s, c, f, e }
      if (!/^(no line of sight|out of range)/.test(info.why)) throw new Error(`P-spell, board ${board}: shotInfo refuses ${c.t.short} at ${e.t.short} ${q.gap(c, e).toFixed(2)}" off: ${info.why}`)
    }
    return null
  }
  const toShoot = (G, s, where) => {
    core.apply(G, s, { t: 'end' })
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'shoot' || G.pending.seats[0] !== s) throw new Error(`${where}: the shooting phase didn't open on the scene (pending ${JSON.stringify(G.pending)})`)
    G.out.length = 0
  }
  // End the seat's phases until its `phase` opens; false when its turn
  // passes it by (nothing of its could act there), its events cleared
  const reach = (G, s, phase) => {
    for (let k = 0; k < 6; k++) {
      const P = G.pending
      if (P?.k === 'phase' && P.seats[0] === s && P.phase === phase) {
        G.out.length = 0
        return true
      }
      if (!P || P.seats[0] !== s) return false
      core.apply(G, s, { t: 'end' })
    }
    return false
  }
  const ally = (w) => !!(w.ward || w.resolve)
  const markOf = (w) => (w.ward ? 'warded' : w.resolve ? 'resolute' : w.snare ? 'snared' : w.mesmerize ? 'mesmerized' : null)
  for (let board = 1; board <= SPELL_BOARDS; board++) {
    for (const races of [['squirrel', 'serpent'], ['serpent', 'squirrel']]) {
      const seed = board * 7919 + (races[0] === 'squirrel' ? 0 : 1)
      const first = scene(board, races, mulberry32(seed))
      if (!first) continue
      const spells = first.c.t.spells
      for (let sp = 0; sp < spells.length; sp++) {
        const S = scene(board, races, mulberry32(seed))
        const { G, s, c, f, e } = S, w = spells[sp]
        const where = `P-spell, board ${board} (${races.join(' v ')}), ${c.t.short}'s ${w.name}`
        toShoot(G, s, where)
        // the AI's default is its own pick, in every scene
        const best = mods.policy.bestCast(G, c)
        if (q.bestSpell(G, c) !== (best?.sp ?? 0)) throw new Error(`${where}: bestSpell says ${q.bestSpell(G, c)}, bestCast ${JSON.stringify(best && { sp: best.sp, tg: best.e.id })}`)
        counts.defaults++
        const tg = ally(w) ? f : e, wrong = ally(w) ? e : f
        // castable at its target (and a ward or a resolve at the caster
        // itself), refused at the other side's, past its range, at the dead
        const body = { t: 'shoot', u: c.id, tg: tg.id, sp }
        const why = core.legal(G, s, body)
        if (why) throw new Error(`${where}: legal() refuses it at ${tg.t.short}: ${why}`)
        if (!q.shootTargets(G, c, sp).includes(tg)) throw new Error(`${where}: shootTargets doesn't offer ${tg.t.short}`)
        if (ally(w) && core.legal(G, s, { ...body, tg: c.id })) throw new Error(`${where}: legal() refuses it at the caster itself: ${core.legal(G, s, { ...body, tg: c.id })}`)
        if (!core.legal(G, s, { ...body, tg: wrong.id })) throw new Error(`${where}: legal() takes it at ${wrong.t.short}, ${ally(w) ? 'an enemy' : 'a friend'}`)
        const was = { x: tg.pos.x, z: tg.pos.z }
        const dir = Math.hypot(tg.pos.x - c.pos.x, tg.pos.z - c.pos.z) || 1
        const out = c.r + tg.r + w.range + 0.5
        at(tg, c.pos.x + ((tg.pos.x - c.pos.x) / dir) * out, c.pos.z + ((tg.pos.z - c.pos.z) / dir) * out)
        if (!core.legal(G, s, body)) throw new Error(`${where}: legal() takes it at ${tg.t.short} ${q.gap(c, tg).toFixed(2)}" off, past its ${w.range}"`)
        at(tg, was.x, was.z)
        const alive = tg.alive
        tg.alive = 0
        if (!core.legal(G, s, body)) throw new Error(`${where}: legal() takes it at the destroyed ${tg.t.short}`)
        tg.alive = alive
        counts.legal += 2
        counts.refused += 3
        // the cast: the stream's next 2D6
        const r = { ...G.rng }, dice = [d6(r), d6(r)], made = dice[0] + dice[1] >= w.spell
        const hp = G.terrain.chunks.map((x) => x.hp)
        core.apply(G, s, body)
        const ev = G.out.splice(0), row = ev.find((x) => x.t === 'dice')
        if (!row || row.label !== `Cast ${w.spell}+ (2D6)` || JSON.stringify(row.dice) !== JSON.stringify(dice) || row.pass !== made) throw new Error(`${where}: the cast row is ${JSON.stringify(row)}, not the stream's ${JSON.stringify(dice)} against ${w.spell}+`)
        const mark = markOf(w), marked = mark ? tg[mark] : false
        if (!made) {
          if (!ev.some((x) => x.t === 'spell.fizzle' && x.u === c.id) || marked || ev.some((x) => x.t === 'blast.land')) throw new Error(`${where}: a fizzle (${dice.join('+')}) that ${marked ? `marks ${tg.t.short} ${mark}` : 'plays no fizzle or lands a template'}`)
          counts.fizzled++
          meet(`${c.t.key} ${w.name} fizzled`)
        } else {
          counts.made++
          meet(`${c.t.key} ${w.name} made`)
          if (mark) {
            if (!marked) throw new Error(`${where}: made, and ${tg.t.short} isn't ${mark}`)
            const st = ev.filter((x) => x.t === 'status').at(-1)
            if (!st?.[mark]?.includes(tg.id)) throw new Error(`${where}: made, and no status says ${tg.t.short} is ${mark}`)
          } else {
            const land = ev.find((x) => x.t === 'blast.land')
            if (!land || land.x !== e.pos.x || land.z !== e.pos.z || land.r !== w.blast) throw new Error(`${where}: made, and no template lands under ${e.t.short}`)
            if (w.scenery === 0 && (ev.some((x) => /^terrain\./.test(x.t) || x.t === 'keg.fuse') || G.terrain.chunks.some((x, i) => x.hp !== hp[i]))) throw new Error(`${where}: a template of scenery 0 hurt the scenery`)
          }
        }
        // once a phase: no spell, no shot, at anyone
        for (let k = 0; k < spells.length; k++) for (const x of [c, f, e]) if (!core.legal(G, s, { t: 'shoot', u: c.id, tg: x.id, sp: k })) throw new Error(`${where}: cast, and legal() takes spell ${k} at ${x.t.short} again this phase`)
        if (!core.legal(G, s, { t: 'shoot', u: c.id, tg: e.id })) throw new Error(`${where}: cast, and legal() takes a shot again this phase`)
        if (!made || !mark || !q.alive(tg)) continue
        // the mark's end, decision by decision (End played at each): the
        // turns met from the cast's on, the first the caster's (n 1), the
        // next the other seat's (n 2: a ward's and a resolve's friend's
        // enemy's, a snare's and a gaze's victim's own); the mark holds at
        // every decision of those two (a turn with nothing to do for the
        // seat has none: the engine plays it through) and is gone at the
        // first decision after them
        const turns = []
        let gone = false
        for (let k = 0; k < 60 && G.turn.stage !== 'over'; k++) {
          const key = `${G.turn.round}:${G.turn.active}`
          if (!turns.includes(key)) turns.push(key)
          const P = G.pending
          if (turns.length >= 3) {
            if (tg[mark]) throw new Error(`${where}: ${tg.t.short} still ${mark} at turn ${key}, past the one after the cast's (${JSON.stringify(P)})`)
            gone = true
            break
          }
          if (!tg[mark]) throw new Error(`${where}: ${tg.t.short} no longer ${mark} at turn ${key} (${turns.length === 1 ? "the cast's" : 'the next'}; ${JSON.stringify(P)})`)
          if (turns.length === 2 && !ally(w) && P?.seats[0] === tg.side) {
            if (P.phase === 'move' && w.snare) {
              if (q.canAct(G, tg)) throw new Error(`${where}: canAct says the snared ${tg.t.short} has a move to make`)
              for (const b of [{ t: 'advance', u: tg.id }, { t: 'move', u: tg.id, c: G.nav.index(tg.pos.x, tg.pos.z) }]) if (!core.legal(G, tg.side, b)) throw new Error(`${where}: legal() takes the snared ${tg.t.short}'s ${b.t}`)
              meet('snare held in the move')
            }
            if (P.phase === 'charge' && !core.legal(G, tg.side, { t: 'charge', u: tg.id, tg: c.id })) throw new Error(`${where}: legal() takes the ${mark} ${tg.t.short}'s charge`)
          }
          core.apply(G, P.seats[0], { t: 'end' })
        }
        if (!gone) continue
        counts.ends++
        meet(`${mark} worn off`)
      }
      // a ward: the same volley at a unit warded and not, its save one better
      {
        const pair = [0, 1].map(() => {
          const { G, s } = fresh(board, races)
          const v = G.units.find((u) => u.side === s && u.t.ranged && !u.t.ranged.blast && !u.t.spells && u.models.length > 1)
          const e = G.units.find((u) => u.side !== s && u.models.length > 1 && !u.t.fly)
          keep(G, [v, e])
          at(v, -4, 0)
          at(e, -4 + v.r + e.r + Math.min(6, v.t.ranged.range - 1), 0)
          return { G, s, v, e }
        })
        const where = `P-spell, board ${board} (${races.join(' v ')}), the ward's save`
        pair[1].e.warded = true
        const rows = pair.map(({ G, s, v, e }) => {
          if (!reach(G, s, 'shoot') || !q.shotInfo(G, v, e).ok) return null
          core.apply(G, s, { t: 'shoot', u: v.id, tg: e.id })
          return G.out.filter((x) => x.t === 'dice')
        })
        if (rows[0] && rows[1]) {
          if (rows[0].length !== rows[1].length || rows[0].some((x, i) => !x.save && JSON.stringify(x.dice) !== JSON.stringify(rows[1][i].dice))) throw new Error(`${where}: the volleys at the unit warded and not rolled apart: ${JSON.stringify(rows)}`)
          const [a, b] = rows.map((rs) => rs.find((x) => x.save))
          if (a || b) {
            if (!a || !b || b.need !== Math.max(2, a.need - 1) || !/\(.*ward.*\)$/.test(b.label) || /ward/.test(a.label)) throw new Error(`${where}: the save rows are ${JSON.stringify(a)} unwarded and ${JSON.stringify(b)} warded`)
            counts.wards++
            meet('ward saved better')
          }
        }
      }
      // a resolve: the morale test none, and a failed charge rolled again
      {
        const where = `P-spell, board ${board} (${races.join(' v ')}), the resolve`
        const pair = [0, 1].map(() => {
          const { G, s } = fresh(board, races)
          const f = G.units.find((u) => u.side === s && u.models.length > 1 && !u.t.fly && !u.t.noCharge && u.t.M < 9)
          const e = G.units.find((u) => u.side !== s && u.models.length > 1 && !u.t.fly)
          keep(G, [f, e])
          at(f, -8, 0)
          at(e, -8 + f.r + e.r + 10.6, 0)
          return { G, s, f, e }
        })
        pair[1].f.resolute = true
        const charged = pair.map(({ G, s, f, e }) => {
          if (!reach(G, s, 'charge') || !q.chargeTargets(G, f).includes(e) || !q.chargePlan(G, f, e)) return null
          const r = { ...G.rng }
          G.out.length = 0
          core.apply(G, s, { t: 'charge', u: f.id, tg: e.id })
          return { r, rows: G.out.filter((x) => x.t === 'dice'), G, s, f }
        })
        if (charged[0] && charged[1]) {
          const [a, b] = charged
          const first = [d6(b.r), d6(b.r)]
          if (JSON.stringify(a.rows[0]?.dice) !== JSON.stringify(first) || JSON.stringify(b.rows[0]?.dice) !== JSON.stringify(first)) throw new Error(`${where}: the charge rolls ${JSON.stringify(a.rows[0])} and ${JSON.stringify(b.rows[0])}, not the stream's ${JSON.stringify(first)}`)
          if (a.rows.length !== 1) throw new Error(`${where}: an unresolved charge rolled ${a.rows.length} rows`)
          if (!b.rows[0].pass) {
            const again = [d6(b.r), d6(b.r)]
            if (b.rows.length !== 2 || !/^Charge \d+" rolled again \(2D6\)$/.test(b.rows[1].label) || JSON.stringify(b.rows[1].dice) !== JSON.stringify(again)) throw new Error(`${where}: a resolute charge failed (${first.join('+')}) and rolled ${JSON.stringify(b.rows.slice(1))}, not the stream's ${JSON.stringify(again)} again`)
            counts.rerolls++
            meet('charge rolled again')
          } else if (b.rows.length !== 1) throw new Error(`${where}: a resolute charge that made it rolled again`)
        }
        // the morale: a squad that lost a model this turn, resolute or not
        const mor = [0, 1].map((k) => {
          const { G, s } = fresh(board, races)
          const f = G.units.find((u) => u.side === s && u.models.length > 1)
          keep(G, [f, G.units.find((u) => u.side !== s)])
          at(f, -10, 0)
          f.resolute = k === 1
          f.lost = 1
          endUntil(G, (P) => P?.seats[0] === 1 - s, where)
          const ev = G.out
          return { rows: ev.filter((x) => x.t === 'dice' && x.label.startsWith(`${f.t.short}: D6 + `)), lines: ev.filter((x) => x.t === 'log' && x.html.startsWith(`<b>${f.t.short}</b> stand resolute`)) }
        })
        if (mor[0].rows.length !== 1 || mor[0].lines.length || mor[1].rows.length || mor[1].lines.length !== 1) throw new Error(`${where}: morale rows ${mor.map((m) => m.rows.length).join(' and ')}, resolute lines ${mor.map((m) => m.lines.length).join(' and ')} (unresolved, resolute)`)
        counts.morale++
        meet('resolute morale')
      }
      // the AI: no enemy in any spell's reach, a friend in a brawler's
      {
        const { G, s } = fresh(board, races)
        const c = G.units.find((u) => u.side === s && u.t.spells)
        const f = G.units.find((u) => u.side === s && u !== c && u.models.length > 1 && !u.t.fly)
        const e = G.units.find((u) => u.side !== s && u.t.brawler && !u.t.noCharge)
        const where = `P-spell, board ${board} (${races.join(' v ')}), the AI's pick`
        if (c && f && e) {
          keep(G, [c, f, e])
          at(c, -18, 0)
          at(f, -18 + c.r + f.r + 6, 0)
          at(e, -18 + c.r + e.r + 19, 0)
          toShoot(G, s, where)
          const best = mods.policy.bestCast(G, c)
          if (!best || !ally(c.t.spells[best.sp]) || best.e.side !== s) throw new Error(`${where}: bestCast picks ${JSON.stringify(best && { sp: best.sp, tg: best.e.id, v: best.v })}, not a ward or a resolve on a friend`)
          if (q.bestSpell(G, c) !== best.sp) throw new Error(`${where}: bestSpell ${q.bestSpell(G, c)}, bestCast ${best.sp}`)
          const sf = q.spellFor(G, c, e)
          if (sf !== -1) throw new Error(`${where}: spellFor names spell ${sf} at ${e.t.short}, out of every spell's reach`)
          core.apply(G, s, { t: 'pilot', m: mask(G, s, c) })
          const tray = G.out.find((x) => x.t === 'tray.open')
          if (!tray?.title.endsWith(` · ${c.t.spells[best.sp].name}`)) throw new Error(`${where}: the AI's pilot of ${c.t.short} cast ${tray?.title}, not ${c.t.spells[best.sp].name}`)
          counts.ai++
          meet('the AI on a friend')
        }
        // spellFor at an enemy never names a spell cast on a friend
        const S = scene(board, races, mulberry32(seed))
        if (S) {
          toShoot(S.G, S.s, where)
          const sf = q.spellFor(S.G, S.c, S.e)
          if (sf >= 0 && ally(S.c.t.spells[sf])) throw new Error(`${where}: spellFor names ${S.c.t.spells[sf].name} at the enemy ${S.e.t.short}`)
        }
      }
    }
  }
  const want = [...Object.values(RACES_S).flatMap((r) => Object.values(r.units).filter((t) => t.spells).flatMap((t) => t.spells.map((w) => `${t.key} ${w.name}`)))]
  const never = [...want.map((k) => `${k} made`), ...want.map((k) => `${k} fizzled`), 'warded worn off', 'resolute worn off', 'snared worn off', 'mesmerized worn off', 'snare held in the move', 'ward saved better', 'charge rolled again', 'resolute morale', 'the AI on a friend'].filter((k) => !met.has(k))
  if (never.length) throw new Error(`P-spell never met: ${never.join(', ')} (on ${SPELL_BOARDS} boards)`)
  return counts
}

// (the races, for P-fight's coverage: the child's)
let RACES_F = null

// ((V3c) the races, for P-spell's coverage: the child's)
let RACES_S = null

// (the child's match/ modules that fold a log, R8's: refold's)
// ── (F9a) P-riders (DESIGN §4.2.5's invariants; §4.2.9's P-riders, P-pilot
// and P-army rows) ────────────────────────────────────────────────────────
// What a battle with transports keeps, on code with core/actions/
// transport.js (older code has no rider, and is held to none of it):
//   state     after every entry, and in the AI's battles at every trace
//             line: a unit aboard is standing, rides a standing hull of its
//             own seat that carries riders (a transport) and rides nothing
//             itself, stands exactly where its hull does, and its bases fit
//             the hull (maxBase); no vehicle rides; each hull's riders'
//             models sum to at most its capacity; a destroyed unit rides
//             nothing; and with height no ground vehicle stands on a floor
//             above STEP (P-height's vehicle rule)
//   hidden    a rider is off the table for every spatial rule (§4.1 rule
//             19): engagedWith never names one (and one engages nobody),
//             enemiesOf and friendsOf (the auras, the AI's threat sums and
//             friend terms) never list one, nor do chargeTargets and
//             shootTargets; and controlOf, forbidMask, validEnd (the hull's
//             own plan among them, which its riders at its centre would
//             otherwise pen in), freeSpot (fits: placeOk's), chargePlan's
//             friend spacing and the AI's score of a cell come out the same
//             with the riders taken out of G.units altogether
//   bail-out  a hull destroyed with riders aboard bails them out in
//             G.units order, each watched as its event is emitted (the
//             match then is the one its spot was found in): onto a landing
//             cell (a cell centre, standable, within 3" of the hull's edge)
//             clear of every unit on the table by o.r + u.r + 0.08, outside
//             every enemy's 1" while a landing cell outside them is left
//             (the rule's fallback), the one nearest the hull's centre,
//             ties to the lowest index; then its dice, a D6 a model
//             standing; a rider with no spot is lost, every model slain;
//             none rides the wreck
//   autoload  the deployment leaves each hull, in G.units order, carrying
//             exactly the Troops a reference autoload boards (its seat's,
//             on the table, bases within maxBase, not big, not a wrecker,
//             whole, in G.units order while they fit)
//   commands  every embark legal() takes is one DESIGN §4.2.5's table
//             allows (the seat's own standing unit, no vehicle, not aboard,
//             not moved, not engaged, bases within maxBase, in a phase
//             reaching a valid end within 1" of the hull; onto a standing
//             transport of its seat's, riding nothing, not engaged, with
//             room; in the deployment or the movement phase); every
//             disembark one of a rider of the seat's not yet moved, onto a
//             cell of its landing, in the movement phase; and (P-pilot) no
//             mask naming a rider without its hull in the movement phase
// The games: AI battles with War-Cart lists (Field and Grand, open and
// fortified, Bushtail mirrors and Bushtails against the Coil), held at
// their trace lines; random games with a human seat (randomTask's, lists
// holding carts, embark and disembark among the battery); and the scenes
// below, which reach each rule on a board of their own whatever the games
// do (a bail-out by an enemy's 1", one with nowhere to stand, a template
// over a hull, the AI's friendly fire round a hull, the deployment's
// re-arranging, a phase's embark and disembark, `rode`).
const unitById = (G, id) => G.units.find((u) => u.id === id)
const riding = (G) => G.units.some((u) => u.aboard)

// An event list that hands each event to `watch` as it is pushed (the
// match's out: core/journal.js emitTo pushes), so a check can look at the
// match as the event is emitted. (Its copies, splice's and slice's, watch
// nothing.)
class Watched extends Array {
  push(...xs) {
    for (const x of xs) this.watch?.(x)
    return super.push(...xs)
  }
}

// state, as above
function ridersState(core, mods, G, where) {
  const q = core.q
  for (const u of G.units) {
    if (!u.aboard) continue
    const v = unitById(G, u.aboard), name = `unit ${u.id} (${u.t.short})`
    if (!q.alive(u)) throw new Error(`${where}: ${name} is destroyed, but still rides unit ${u.aboard}`)
    if (!v) throw new Error(`${where}: ${name} rides unit ${u.aboard}, which the match has not`)
    if (!q.alive(v)) throw new Error(`${where}: ${name} rides unit ${v.id} (${v.t.short}), which is destroyed`)
    if (v.side !== u.side) throw new Error(`${where}: ${name} of seat ${u.side} rides seat ${v.side}'s unit ${v.id}`)
    if (!v.t.transport) throw new Error(`${where}: ${name} rides unit ${v.id} (${v.t.short}), which carries nobody (no transport)`)
    if (v.aboard) throw new Error(`${where}: ${name} rides unit ${v.id}, itself aboard unit ${v.aboard}`)
    if (u.t.vehicle) throw new Error(`${where}: ${name}, a vehicle, rides unit ${v.id}`)
    if (u.pos.x !== v.pos.x || u.pos.z !== v.pos.z) throw new Error(`${where}: ${name} rides unit ${v.id} but stands at (${u.pos.x}, ${u.pos.z}), not its hull's (${v.pos.x}, ${v.pos.z})`)
    if (u.t.base > v.t.transport.maxBase) throw new Error(`${where}: ${name}'s ${u.t.base}" bases ride unit ${v.id}, which takes ${v.t.transport.maxBase}" at most`)
  }
  for (const v of G.units) {
    const tr = v.t.transport
    if (!tr) continue
    const load = G.units.filter((p) => p.aboard === v.id).reduce((s, p) => s + p.alive, 0)
    if (load > tr.capacity) throw new Error(`${where}: unit ${v.id} (${v.t.short}) carries ${load} models, over its capacity of ${tr.capacity}`)
  }
  // (P-height, F9a) a ground vehicle keeps to the ground
  if (G.nav.hasHeight) for (const v of G.units) {
    if (!q.alive(v) || !v.t.vehicle || v.t.fly) continue
    const y = G.nav.floor[G.nav.index(v.pos.x, v.pos.z)]
    if (y > mods.nav.STEP) throw new Error(`${where}: unit ${v.id} (${v.t.short}), a ground vehicle, stands on a floor ${y}" up, above STEP (${mods.nav.STEP}")`)
  }
}

// fn() with every rider out of G.units (each put back, in order, after)
function unridden(G, fn) {
  const all = G.units.slice()
  G.units.length = 0
  for (const u of all) if (!u.aboard) G.units.push(u)
  try {
    return fn()
  } finally {
    G.units.length = 0
    for (const u of all) G.units.push(u)
  }
}

// the cells within `R` of (x, z), in index order
function cellsWithin(nav, x, z, R) {
  const out = []
  const x0 = Math.max(0, Math.floor((x - R + nav.W / 2) / nav.cell)), x1 = Math.min(nav.nx - 1, Math.floor((x + R + nav.W / 2) / nav.cell))
  const z0 = Math.max(0, Math.floor((z - R + nav.H / 2) / nav.cell)), z1 = Math.min(nav.nz - 1, Math.floor((z + R + nav.H / 2) / nav.cell))
  for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
    const i = iz * nav.nx + ix
    if (Math.hypot(nav.x(i) - x, nav.z(i) - z) <= R) out.push(i)
  }
  return out
}

// What the AI's score makes of `cells` for `u` (its own role; a hull's as
// a line unit), its context built as core/ai/score.js's scoring builds it:
// the numbers, as text. ((F9a at its merge) the context as F18 and F19a
// left it: no `engaged` any more, a shooter's fight, own and keg terms,
// and the kegs standing, where the code has them)
function scoreText(core, mods, G, u, cells) {
  const q = core.q, S = mods.score
  const enemies = q.enemiesOf(G, u), friends = q.friendsOf(G, u)
  const owners = G.objectives.map((o) => q.controlOf(G, o))
  const role = u.t.ai === 'transport' ? 'line' : u.t.ai
  const w = u.t.ranged, shoots = !!w && role !== 'melee', f18 = typeof q.fightOf === 'function', kegs = S.kegsOf ? S.kegsOf(G) : []
  const pre = new Map(enemies.map((e) => [e, f18
    ? {
        cover: q.inCover(G, e), hit: S.meleeValue(u, e), back: S.meleeValue(e, u),
        fight: shoots && !w.blast && !w.mesmerize ? q.fightOf(G, u, e) : null, own: shoots && w.blast ? S.ownUnder(G, u, e) : 0,
        keg: shoots && w.blast && S.kegGain ? S.kegGain(G, u, e, kegs) : 0,
      }
    : { engaged: q.isEngaged(G, e), cover: q.inCover(G, e), hit: S.meleeValue(u, e), back: S.meleeValue(e, u) }]))
  const ctx = { enemies, friends, owners, claimed: new Set(), role, pre, kegs, kegDanger: kegs.length > 0 && !!S.kegDanger?.(G, u.side) }
  return cells.map((i) => String(S.score(G, u, G.nav.x(i), G.nav.z(i), ctx, true))).join(',')
}

// hidden, as above: returns how many queries it held (0 with nobody aboard,
// or while the nav waits for its own site to follow the terrain: a check
// may not refresh it early, §4.1 rule 9). Asked under preview() (the dice
// locked: none of it draws) and with the plan memo shut, so nothing it
// plans feeds the match's own plans.
function ridersHidden(core, mods, G, where) {
  if (!riding(G) || G.terrain.dirty) return 0
  const memo = G.nav.memo
  G.nav.memo = null
  try {
    return core.preview(G, () => hiddenBattery(core, mods, G, where))
  } finally {
    G.nav.memo = memo
  }
}
function hiddenBattery(core, mods, G, where) {
  const q = core.q, nav = G.nav, ENGAGE = mods.rules.ENGAGE
  const riders = G.units.filter((u) => u.aboard)
  const isRider = (u) => !!u.aboard
  const standing = G.units.filter((u) => q.alive(u) && !u.aboard)
  const ridden = new Set(riders.map((p) => p.side))
  let n = 0
  // never named
  for (const e of standing) {
    const asks = [['engagedWith', () => q.engagedWith(G, e)], ['friendsOf', () => q.friendsOf(G, e)], ['enemiesOf', () => q.enemiesOf(G, e)]]
    // (shots and charges only at a seat with riders to aim at)
    if ([...ridden].some((s) => s !== e.side)) asks.push(['chargeTargets', () => q.chargeTargets(G, e)], ['shootTargets', () => q.shootTargets(G, e)])
    for (const [what, ask] of asks) {
      const p = ask().find(isRider)
      if (p) throw new Error(`${where}: ${what}(unit ${e.id}, ${e.t.short}) names unit ${p.id} (${p.t.short}), which rides unit ${p.aboard}: a rider is off the table (§4.1 rule 19)`)
      n++
    }
  }
  for (const p of riders) {
    const xs = q.engagedWith(G, p)
    if (xs.length) throw new Error(`${where}: engagedWith(unit ${p.id}, ${p.t.short}, aboard unit ${p.aboard}) is [${xs.map((e) => e.id)}], not []: a rider engages nobody`)
    n++
  }
  // the same with the riders on the table and with them off it
  const same = (what, ask) => {
    const a = ask(), b = unridden(G, ask)
    if (a !== b) {
      const k = [...a].findIndex((ch, i) => ch !== b[i])
      throw new Error(`${where}: ${what} is one thing with the riders aboard and another with them taken off the table (from character ${k}: ${a.slice(Math.max(0, k - 20), k + 40)} | ${b.slice(Math.max(0, k - 20), k + 40)}): a rider counts there (§4.1 rule 19)`)
    }
    n++
  }
  same('controlOf over every objective', () => G.objectives.map((o) => q.controlOf(G, o)).join(','))
  const hulls = [...new Set(riders.map((p) => p.aboard))].map((id) => unitById(G, id))
  for (const v of hulls) {
    // the hull itself, and the standing units nearest it (either seat's)
    const near = standing.filter((e) => e !== v).map((e) => [Math.hypot(e.pos.x - v.pos.x, e.pos.z - v.pos.z), e]).sort((x, y) => x[0] - y[0] || x[1].id - y[1].id).slice(0, 2).map(([, e]) => e)
    for (const e of [v, ...near]) {
      const round = cellsWithin(nav, v.pos.x, v.pos.z, v.r + e.r + 1.5)
      same(`forbidMask(unit ${e.id}, ${e.t.short})`, () => {
        const f = q.forbidMask(G, e, ENGAGE + 0.05)
        return `${Array.from(f).join('')}|${JSON.stringify(f.discs)}`
      })
      same(`validEnd round unit ${v.id} for unit ${e.id} (${e.t.short})`, () => {
        const plan = q.movePlan(G, e, 0)
        return round.map((i) => (isFinite(plan.res.dist[i]) && q.validEnd(G, plan, i) ? 1 : 0)).join('')
      })
      same(`freeSpot by unit ${v.id} for unit ${e.id} (${e.t.short})`, () => JSON.stringify(q.freeSpot(G, e, v.pos.x, v.pos.z, e.side, G.units.filter((o) => o !== e))))
      same(`the AI's score round unit ${v.id} for unit ${e.id} (${e.t.short})`, () => scoreText(core, mods, G, e, round.filter((i, k) => k % 5 === 0)))
    }
    // a charge's spots: the hull's own (its riders at its start), and a
    // friend's beside it
    for (const e of [v, ...near.filter((x) => x.side === v.side)]) {
      for (const tg of q.chargeTargets(G, e).slice(0, 2)) {
        same(`chargePlan(unit ${e.id}, unit ${tg.id})'s spots`, () => {
          const plan = q.chargePlan(G, e, tg)
          return plan ? q.chargeSpots(plan, 12).map((x) => (x ? 1 : 0)).join('') : 'none'
        })
      }
    }
  }
  return n
}

// The bail-out, watched as the match emits it (`w.G` the match, once
// known; `w.event` its out's watch). settle(where) closes the hulls seen
// destroyed: each rider either bailed out or was lost, none rides.
function bailWatch(core, mods) {
  const q = core.q
  const w = { G: null, hulls: new Map(), dice: null, counts: { hullsDown: 0, bailed: 0, lost: 0, ones: 0, nearest: 0, fallbacks: 0, dirty: 0 } }
  const fail = (why) => {
    throw new Error(`${w.where ?? 'the bail-out'}: ${why}`)
  }
  w.event = (e) => {
    const G = w.G
    if (!G) return
    if (e.t === 'unit.destroyed') {
      const v = unitById(G, e.u)
      if (!v?.t.transport) return
      const on = G.units.filter((p) => p.aboard === v.id && q.alive(p)).map((p) => p.id)
      if (on.length) {
        w.hulls.set(v.id, { on, next: 0, landed: [] })
        w.counts.hullsDown++
      }
      return
    }
    if (e.t === 'dice' && / bail out, 1s wound$/.test(e.label ?? '')) {
      const d = w.dice
      w.dice = null
      if (!d || !e.label.startsWith(`${d.short}: `)) fail(`a bail-out's dice row "${e.label}" not straight after its rider's forced step off (${JSON.stringify(d)})`)
      if (e.dice.length !== d.alive) fail(`unit ${d.u} bailed out with ${d.alive} models standing but rolled ${e.dice.length} dice (a D6 a model)`)
      if (e.need !== 2) fail(`a bail-out's row needs ${e.need}, not 2 (a 1 wounds)`)
      w.counts.ones += e.dice.filter((x) => x === 1).length
      return
    }
    if (w.dice) fail(`unit ${w.dice.u}'s bail-out rolled no dice (${e.t} came next)`)
    if (e.t !== 'unit.disembark' || !e.forced) return
    const h = w.hulls.get(e.v)
    if (!h) fail(`unit ${e.u} bailed out of unit ${e.v}, which wasn't destroyed with it aboard`)
    const at = h.on.indexOf(e.u)
    if (at < 0) fail(`unit ${e.u} bailed out of unit ${e.v}, which it wasn't riding as it was destroyed (${h.on})`)
    if (at < h.next) fail(`unit ${e.u} bailed out of unit ${e.v} after unit ${h.on[h.next - 1]}: not in G.units order (${h.on})`)
    h.next = at + 1
    h.landed.push(e.u)
    const p = unitById(G, e.u), v = unitById(G, e.v), nav = G.nav
    if (p.aboard || !q.alive(p)) fail(`unit ${p.id} bailed out, but ${p.aboard ? `still rides unit ${p.aboard}` : 'is destroyed'}`)
    if (q.alive(v)) fail(`unit ${p.id} bailed out of unit ${v.id}, which still stands`)
    if (p.pos.x !== e.to.x || p.pos.z !== e.to.z) fail(`unit ${p.id}'s bail-out says (${e.to.x}, ${e.to.z}), but it stands at (${p.pos.x}, ${p.pos.z})`)
    const i = nav.index(p.pos.x, p.pos.z)
    if (nav.x(i) !== p.pos.x || nav.z(i) !== p.pos.z) fail(`unit ${p.id} bailed out to (${p.pos.x}, ${p.pos.z}), no cell's centre`)
    const reach = Math.hypot(p.pos.x - v.pos.x, p.pos.z - v.pos.z) - v.r - p.r
    if (reach > 3 + 1e-9) fail(`unit ${p.id} bailed out ${reach.toFixed(3)}" from its hull's edge, past the 3" of a landing`)
    if (!nav.standable(i, p.r, 'walk')) fail(`unit ${p.id} bailed out onto cell ${i}, where its base can't stand`)
    const crowd = G.units.find((o) => o !== p && q.alive(o) && !o.aboard && Math.hypot(o.pos.x - p.pos.x, o.pos.z - p.pos.z) < o.r + p.r + 0.08)
    if (crowd) fail(`unit ${p.id} bailed out onto cell ${i}, within unit ${crowd.id}'s spacing (${Math.hypot(crowd.pos.x - p.pos.x, crowd.pos.z - p.pos.z).toFixed(3)}" apart, centre to centre)`)
    if (G.terrain.dirty) {
      w.counts.dirty++
    } else {
      // the nearest landing cell outside the enemies' 1" (their bubbles:
      // the mask of the code under test, the bail-out's rule being what is
      // held here), else the nearest without them
      const inBubble = !!q.forbidMask(G, p, mods.rules.ENGAGE + 0.05)[i]
      const free = q.landing(G, p, v)
      const pool = free.length ? free : q.landing(G, p, v, false)
      if (free.length && inBubble) fail(`unit ${p.id} bailed out onto cell ${i}, inside an enemy's 1", while ${free.length} landing cells outside the enemies' 1" were free`)
      let best = -1, bd = Infinity
      for (const c of pool) {
        const d = Math.hypot(nav.x(c) - v.pos.x, nav.z(c) - v.pos.z)
        if (d < bd) [best, bd] = [c, d]
      }
      if (best !== i) fail(`unit ${p.id} bailed out onto cell ${i}, not the landing cell nearest its hull's centre ${free.length ? 'outside the enemies\' 1"' : '(none outside the enemies\' 1" left)'} (cell ${best}, ${bd.toFixed(3)}" off, against ${Math.hypot(p.pos.x - v.pos.x, p.pos.z - v.pos.z).toFixed(3)}")`)
      w.counts[free.length ? 'nearest' : 'fallbacks']++
    }
    w.dice = { u: p.id, alive: p.alive, short: p.t.short }
    w.counts.bailed++
  }
  w.settle = (where) => {
    if (w.dice) throw new Error(`${where}: unit ${w.dice.u}'s bail-out rolled no dice`)
    for (const [vid, h] of w.hulls) {
      for (const id of h.on) {
        const p = unitById(w.G, id)
        if (p.aboard) throw new Error(`${where}: unit ${id} still rides unit ${p.aboard} after unit ${vid}, the hull it rode, was destroyed`)
        if (!h.landed.includes(id)) {
          if (q.alive(p)) throw new Error(`${where}: unit ${id} rode unit ${vid} as it was destroyed, never bailed out, and stands with ${p.alive} models: a rider with nowhere to stand is lost`)
          w.counts.lost++
        }
      }
    }
    w.hulls.clear()
  }
  return w
}

// The units DESIGN §4.2.8.7's autoload boards, by id → hull id: each hull
// in G.units order, its seat's Troops in G.units order, on the table, bases
// within maxBase, neither big nor a wrecker, whole, while they fit (a squad
// that doesn't is passed over)
function autoloadWant(G) {
  const want = new Map()
  for (const v of G.units) {
    const tr = v.t.transport
    if (!tr || v.alive <= 0) continue
    let left = tr.capacity
    for (const u of G.units) {
      if (u.side !== v.side || u.t.role !== 'Troops' || want.has(u.id) || u.alive <= 0) continue
      if (u.t.base > tr.maxBase || u.t.big || u.t.wrecker || u.alive > left) continue
      want.set(u.id, v.id)
      left -= u.alive
    }
  }
  return want
}
function autoloadCheck(G, where) {
  const want = autoloadWant(G)
  for (const u of G.units) {
    const w = want.get(u.id) ?? 0
    if (u.aboard !== w) throw new Error(`${where}: the deployment left unit ${u.id} (${u.t.short}) ${u.aboard ? `aboard unit ${u.aboard}` : 'on the table'}, where the autoload's rule puts it ${w ? `aboard unit ${w}` : 'on the table'} (each hull in G.units order boarding its seat's eligible Troops in G.units order while they fit: DESIGN §4.2.8.7)`)
  }
  return want.size
}

// Why an embark or disembark legal() took for `seat` breaks DESIGN
// §4.2.5's table, judged from the match here (null: it doesn't)
function rideWrong(core, G, seat, b) {
  const q = core.q, P = G.pending
  const u = unitById(G, b.u)
  if (!u || u.side !== seat || !q.alive(u)) return `names no standing unit of seat ${seat}'s`
  if (b.t === 'embark') {
    const v = unitById(G, b.v), tr = v?.t.transport
    const phase = P.k === 'phase' && P.phase === 'move'
    if (P.k !== 'deploy' && !phase) return `answers a ${P.k}${P.phase ? ` (${P.phase})` : ''} decision: a unit boards in the deployment or the movement phase`
    if (u.t.vehicle) return 'boards a vehicle onto a vehicle'
    if (u.aboard) return `boards unit ${u.id}, which rides unit ${u.aboard} already`
    if (u.flags.moved) return `boards unit ${u.id}, which has moved`
    // ((V3c, at the V3 merge) boarding is the unit's move, which Root
    // Snare forbids)
    if (u.snared) return `boards unit ${u.id}, which is snared`
    if (q.isEngaged(G, u)) return `boards unit ${u.id}, which is in combat`
    if (!v || v.side !== seat || !q.alive(v) || !tr) return `boards onto no standing transport of seat ${seat}'s`
    if (v.aboard) return `boards onto unit ${v.id}, which rides unit ${v.aboard}`
    if (q.isEngaged(G, v)) return `boards onto unit ${v.id}, which is in combat`
    if (u.t.base > tr.maxBase) return `boards ${u.t.base}" bases onto a hull taking ${tr.maxBase}" at most`
    const load = G.units.filter((p) => p.aboard === v.id && q.alive(p)).reduce((s, p) => s + p.alive, 0)
    if (load + u.alive > tr.capacity) return `boards ${u.alive} models onto a hull carrying ${load} of ${tr.capacity}`
    if (phase) {
      // (a valid end of its move within 1" of the hull: its own plan's)
      const plan = q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
      // (a hair's grace on the radius: the rule's measure is dmath's)
      const reach = cellsWithin(G.nav, v.pos.x, v.pos.z, v.r + u.r + 1 + 1e-9).some((i) => isFinite(plan.res.dist[i]) && q.validEnd(G, plan, i))
      if (!reach) return `boards unit ${u.id}, whose move reaches no valid end within 1" of unit ${v.id}`
    }
    return null
  }
  if (!(P.k === 'phase' && P.phase === 'move')) return 'steps off outside the movement phase'
  if (!u.aboard) return `steps unit ${u.id} off, which rides nothing`
  if (u.flags.moved) return `steps unit ${u.id} off, which has moved`
  const v = unitById(G, u.aboard)
  if (!q.landing(G, u, v).includes(b.c)) return `steps unit ${u.id} off onto cell ${b.c}, which is none of its landing cells`
  return null
}

// A list holding War-Carts for `race` at `rules` (autoList on the stream's
// seeds until one fields at least `least` of them, at most 64 tries), as
// its text, or null when the race has no transport (the Coil, before F9b)
function cartList(A, race, rules, rand, least = 1) {
  const k = race.roster.findIndex((key) => race.units[key].transport)
  if (k < 0) return null
  for (let n = 0; n < 64; n++) {
    const counts = A.autoList(race, rules, Math.floor(rand() * 2 ** 32))
    if ((counts[k] ?? 0) >= least) return A.listText(counts)
  }
  return null
}

// One AI battle with War-Carts, held to P-riders at its trace lines (the
// state at every state line, the autoload at the first, the riders hidden
// at a sample of act lines), the bail-outs as they are emitted, the
// mirror at every act (P-present: `aboard` among it) and P-prop's
// invariants and result at its end. Returns what it played.
function ridesBattle(core, mods, mirror, setup, where, rand) {
  const q = core.q
  const out = new Watched(), watch = bailWatch(core, mods), tap = mirrorTap(mirror)
  out.watch = watch.event
  watch.where = where
  const seen = { lines: 0, hidden: 0, autoload: -1 }
  const onTrace = (line, G) => {
    watch.G = G
    tap.trace(line, G)
    if (line.startsWith('log ')) return
    const at = `${where} at trace line ${G.journal.trace.length}`
    if (seen.autoload < 0) seen.autoload = autoloadCheck(G, at)
    ridersState(core, mods, G, at)
    seen.lines++
    if (line.startsWith('act ') && rand() < 0.12) seen.hidden += ridersHidden(core, mods, G, at)
  }
  let G
  try {
    G = core.createMatch(setup, { out, strict: true, onTrace })
  } catch (e) {
    throw new Error(`${where}: ${e.stack}`)
  }
  if (G.turn.stage !== 'over') throw new Error(`${where}: an AI battle stopped at ${G.turn.stage}`)
  watch.settle(`${where} at its end`)
  ridersState(core, mods, G, `${where} at its end`)
  invariants(core, G, `${where} at its end`)
  const events = G.out.splice(0)
  if (G.nav.hasHeight) heightEvents(G, events, where)
  tap.fold(G, events, where)
  const ends = result(G, where, -1)
  const bad = traceShape(G)
  if (bad) throw new Error(`${where}: ${bad}`)
  const c = { battles: 1, ends, embarks: 0, steps: 0, stepped: 0, bailed: watch.counts.bailed, lost: watch.counts.lost, hullsDown: watch.counts.hullsDown, wrecks: 0, lines: seen.lines, hidden: seen.hidden, autoloaded: seen.autoload, acts: tap.counts().acts }
  for (const e of events) {
    if (e.t === 'unit.embark') c.embarks++
    else if (e.t === 'unit.disembark' && !e.forced) c.steps++
    else if (e.t === 'terrain.add' && e.def?.kind === 'wreck') c.wrecks++
  }
  c.stepped = c.steps ? 1 : 0
  return c
}

// `n` such battles from `seed`'s stream at `mission`: the Bushtails with
// carts in seat 0 or 1, against Bushtails (with carts) or the Coil
function ridesTask(core, mods, mirror, RACES, MISSIONS, mission, n, seed) {
  const A = core.army, rand = mulberry32(seed * 2654435761 + 11), m = MISSIONS[mission]
  const sum = {}
  for (let k = 0; k < n; k++) {
    const mirrorMatch = (seed + k) % 2 === 0, swap = rand() < 0.5
    const races = mirrorMatch ? ['squirrel', 'squirrel'] : swap ? ['serpent', 'squirrel'] : ['squirrel', 'serpent']
    const seats = races.map((race) => {
      const text = cartList(A, RACES[race], m.list, rand) ?? A.listText(A.autoList(RACES[race], m.list, Math.floor(rand() * 2 ** 32)))
      return { race, ctrl: 'ai', army: text }
    })
    const setup = { board: Math.floor(rand() * 2 ** 32), dice: Math.floor(rand() * 2 ** 32), mission, terrain: m.sets[Math.floor(rand() * m.sets.length)], seats }
    const c = ridesBattle(core, mods, mirror, setup, `P-riders ${mission} battle ${seed}.${k} (${JSON.stringify(setup)})`, rand)
    for (const [key, v] of Object.entries(c)) if (typeof v === 'number') sum[key] = (sum[key] ?? 0) + v
    sum[c.ends] = (sum[c.ends] ?? 0) + 1
  }
  return sum
}

// ── The scenes ──────────────────────────────────────────────────────────────
// A Field battle on its own board, both seats human (the deployment
// pending, the autoload done), each Bushtail seat fielding SCENE_LIST: an
// Elder, three Nutkin, two Grenadiers, a Trebuchet and two War-Carts.
const SCENE_LIST = '1032012'
// look(where): the events since, folded into a mirror of the match (P-
// present: `aboard` and the riders' places among it) that must then be the
// match, the bail-outs settled and P-riders' state held; snap(): the mirror
// taken from the match afresh (after a scene stands units somewhere by
// hand, which no event reports)
// (`battle`: both seats' deployments closed, the battle begun: a scene
// whose blows land there, as they only can)
function sceneMatch(core, mods, mirror, { other = 'squirrel', board = 4242, terrain = 'open', battle = false } = {}) {
  const out = new Watched(), watch = bailWatch(core, mods)
  out.watch = watch.event
  const setup = { board, dice: 99, mission: 'field', terrain, seats: [{ race: 'squirrel', ctrl: 'human', army: SCENE_LIST }, { race: other, ctrl: 'human', ...(other === 'squirrel' ? { army: SCENE_LIST } : {}) }] }
  const G = core.createMatch(setup, { out })
  watch.G = G
  if (battle) for (const s of [0, 1]) core.apply(G, s, { t: 'deployed' })
  let M = null
  const snap = () => {
    G.out.splice(0)
    M = mirror.project(G)
  }
  const look = (where) => {
    watch.where = where
    watch.settle(where)
    ridersState(core, mods, G, where)
    for (const e of G.out.splice(0)) mirror.applyEvent(M, e)
    const d = differ(M, mirror.project(G))
    if (d) throw new Error(`${where}: the mirror of the match's events differs from the match: ${d}`)
  }
  snap()
  return { G, watch, look, snap, setup }
}
const hullsOf = (G, side) => G.units.filter((u) => u.side === side && u.alive > 0 && u.t.transport)
// a point on the table no unit stands within `R` of (the board's centre
// line first), or null
function emptySpot(G, R, skip = []) {
  const { W, H } = G.nav
  for (let r = 0; r < 20; r += 0.5) for (let k = 0; k < 16; k++) {
    const x = r * Math.cos((k * Math.PI) / 8), z = r * Math.sin((k * Math.PI) / 8)
    if (Math.abs(x) > W / 2 - R || Math.abs(z) > H / 2 - R) continue
    const i = G.nav.index(x, z)
    if (!G.nav.standable(i, 1.6, 'walk')) continue
    if (G.units.every((u) => skip.includes(u) || u.aboard || u.alive <= 0 || Math.hypot(u.pos.x - G.nav.x(i), u.pos.z - G.nav.z(i)) > R + u.r)) return { x: G.nav.x(i), z: G.nav.z(i) }
  }
  return null
}

function ridesScenes(core, mods, mirror, RACES, MISSIONS) {
  const q = core.q, A = core.army, c = { scenes: 0 }
  const legalOk = (G, s, b, where) => {
    const why = core.legal(G, s, b)
    if (why !== null) throw new Error(`${where}: legal() refuses ${JSON.stringify(b)} for seat ${s}: ${why}`)
  }
  const refused = (G, s, b, want, where) => {
    const why = core.legal(G, s, b)
    if (why === null || !want.test(why)) throw new Error(`${where}: legal() ${why === null ? 'takes' : `refuses with "${why}"`} ${JSON.stringify(b)} for seat ${s}, not refusing it with ${want}`)
  }
  {
    // (the scenes' fixed list, legal at Field)
    const why = A.checkList(RACES.squirrel, MISSIONS.field.list, [...SCENE_LIST].map(Number))
    if (why) throw new Error(`the scenes' list ${SCENE_LIST} is refused at Field: ${why}`)
  }

  // 1. the deployment: the autoload, the riders hidden, and the
  // re-arranging (a rider placed off its hull, boarded again, its hull
  // placed elsewhere with its riders)
  {
    const where = 'scene: the deployment'
    const { G, look } = sceneMatch(core, mods, mirror)
    c.autoloaded = autoloadCheck(G, where)
    if (!c.autoloaded) throw new Error(`${where}: the autoload boarded nobody`)
    look(where)
    c.hidden = ridersHidden(core, mods, G, where)
    const v = hullsOf(G, 0)[0], p = G.units.find((u) => u.aboard === v.id)
    const spot = q.freeSpot(G, p, v.pos.x, v.pos.z + 6, 0, G.units.filter((o) => o !== p))
    const cell = G.nav.index(spot.x, spot.z)
    legalOk(G, 0, { t: 'place', u: p.id, c: cell }, where)
    core.apply(G, 0, { t: 'place', u: p.id, c: cell })
    if (p.aboard || p.pos.x !== spot.x || p.pos.z !== spot.z) throw new Error(`${where}: a rider placed at (${spot.x}, ${spot.z}) stands at (${p.pos.x}, ${p.pos.z}), aboard ${p.aboard}: a place takes a rider off its hull`)
    look(`${where}, a rider placed off its hull`)
    legalOk(G, 0, { t: 'embark', u: p.id, v: v.id }, where)
    core.apply(G, 0, { t: 'embark', u: p.id, v: v.id })
    if (p.aboard !== v.id) throw new Error(`${where}: the deployment's embark left unit ${p.id} aboard ${p.aboard}, not unit ${v.id}`)
    look(`${where}, the rider boarded again`)
    const to = q.freeSpot(G, v, v.pos.x, v.pos.z - 7, 0, G.units.filter((o) => o !== v))
    const hc = G.nav.index(to.x, to.z)
    legalOk(G, 0, { t: 'place', u: v.id, c: hc }, where)
    core.apply(G, 0, { t: 'place', u: v.id, c: hc })
    look(`${where}, the hull placed elsewhere (its riders with it)`)
    // the refusals: a vehicle boarding, the enemy's hull, a full hull, and
    // a disembark in the deployment
    refused(G, 0, { t: 'embark', u: hullsOf(G, 0)[1].id, v: v.id }, /is a vehicle/, where)
    refused(G, 0, { t: 'embark', u: G.units.find((u) => u.side === 0 && !u.aboard && !u.t.vehicle).id, v: hullsOf(G, 1)[0].id }, /no standing vehicle of its own seat/, where)
    refused(G, 0, { t: 'disembark', u: p.id, c: hc }, /doesn't answer the deploy decision/, where)
    const big = G.units.find((u) => u.side === 0 && u.t.base > v.t.transport.maxBase && !u.t.vehicle)
    if (big) refused(G, 0, { t: 'embark', u: big.id, v: v.id }, /bases are too large/, where)
    c.scenes++
  }

  // 2. an enemy beside a hull, the hull on an objective, a template on it
  {
    const where = 'scene: an enemy beside a hull, the hull on an objective'
    const { G, look } = sceneMatch(core, mods, mirror)
    const v = hullsOf(G, 0)[0]
    const o = [...G.objectives].sort((a, b) => Math.abs(a.x) + Math.abs(a.z) - Math.abs(b.x) - Math.abs(b.z))[0]
    mods.units.moveUnitTo(G, v, o.x, o.z)
    ridersState(core, mods, G, where)
    if (q.controlOf(G, o) !== -1) throw new Error(`${where}: a War-Cart (OC0) on objective ${o.i} with ${q.riders(G, v).length} rider units aboard holds it for seat ${q.controlOf(G, o)}: riders hold nothing`)
    const e = G.units.find((u) => u.side === 1 && u.alive > 0 && !u.aboard && !u.t.transport && u.t.models > 1)
    mods.units.setUnitPos(e, v.pos.x + v.r + e.r + 0.5, v.pos.z)
    if (!q.engagedWith(G, v).includes(e)) throw new Error(`${where}: an enemy 0.5" from the hull doesn't engage it`)
    c.hidden += ridersHidden(core, mods, G, where)
    // and 2" off: the hull may charge it (its own riders at its start in
    // nobody's way)
    mods.units.setUnitPos(e, v.pos.x + v.r + e.r + 2, v.pos.z)
    c.hidden += ridersHidden(core, mods, G, `${where} (the enemy 2" off)`)
    // a template on the hull: the hull hit, its riders untouched
    const shooter = G.units.find((u) => u.side === 1 && u.t.ranged?.blast)
    const was = q.riders(G, v).map((p) => JSON.stringify(p.models.map((m) => [m.w, m.alive])))
    mods.units.setUnitPos(e, v.pos.x + 12, v.pos.z)
    G.out.splice(0)
    mods.shoot.blastLands(G, shooter, { x: v.pos.x, z: v.pos.z }, { ...shooter.t.ranged, S: 3, D: 1 })
    const now = q.riders(G, v).map((p) => JSON.stringify(p.models.map((m) => [m.w, m.alive])))
    if (JSON.stringify(was) !== JSON.stringify(now)) throw new Error(`${where}: a template on the hull wounded its riders (${was} → ${now}): it hits the hull, never the riders`)
    if (!G.out.some((x) => x.t === 'dice' && x.label?.includes(`${v.t.short}: `))) throw new Error(`${where}: a template on the hull rolled no hits on it`)
    G.out.splice(0)
    c.scenes++
  }

  // 3. a bail-out by an enemy's 1": the cell the first rider would bail out
  // onto with no enemy near (found on a twin of the scene, its hull
  // destroyed alike: the wreck where the hull stood, the hull itself off
  // the table) put inside an enemy's 1", so the rider takes the nearest
  // cell outside it. (A friend stands on the hull's centre in both, so
  // that cell is no centre one: an enemy's 1" over the hull's centre
  // would bar the riders' walk off from its first step, and the rule's
  // fallback, with no bubble, rightly takes the nearest cell then)
  {
    const where = "scene: a hull destroyed by an enemy's 1\""
    const twin = sceneMatch(core, mods, mirror, { battle: true }).G
    const tv = hullsOf(twin, 0)[0], tspot = emptySpot(twin, 9, [tv])
    mods.units.moveUnitTo(twin, tv, tspot.x, tspot.z)
    const friendOf = (G) => G.units.find((u) => u.side === 0 && u.alive > 0 && !u.aboard && !u.t.transport && u.t.models > 1)
    mods.units.setUnitPos(friendOf(twin), tspot.x, tspot.z)
    const tp = q.riders(twin, tv)[0]
    twin.out.splice(0)
    mods.damage.damage(twin, tv, 1, 99, twin.units.find((u) => u.side === 1 && u.alive > 0 && !u.aboard))
    const first = twin.out.find((x) => x.t === 'unit.disembark' && x.forced && x.u === tp.id)
    if (!first) throw new Error(`${where}: on the twin, its first rider never bailed out`)
    const { G, look, watch, snap } = sceneMatch(core, mods, mirror, { battle: true })
    const v = hullsOf(G, 0)[0], spot = emptySpot(G, 9, [v])
    mods.units.moveUnitTo(G, v, spot.x, spot.z)
    mods.units.setUnitPos(friendOf(G), spot.x, spot.z)
    const p = q.riders(G, v)[0]
    if (spot.x !== tspot.x || spot.z !== tspot.z || p.id !== tp.id) throw new Error(`${where}: the twin isn't the scene's (${JSON.stringify([spot, tspot, p.id, tp.id])})`)
    // (the enemy a hand beyond that cell, outward from the hull: the cell
    // inside its 1" but clear of its base)
    const e = G.units.find((u) => u.side === 1 && u.alive > 0 && !u.aboard && !u.t.transport && u.t.models > 1)
    // (a cell at the hull's very centre, on the wreck, has no outward: +x)
    const cx = first.to.x, cz = first.to.z, d0 = Math.hypot(cx - v.pos.x, cz - v.pos.z)
    const ux = d0 ? (cx - v.pos.x) / d0 : 1, uz = d0 ? (cz - v.pos.z) / d0 : 0, reach = e.r + p.r + 0.5
    mods.units.setUnitPos(e, cx + ux * reach, cz + uz * reach)
    snap()
    watch.where = where
    mods.damage.damage(G, v, 1, 99, e)
    const bailed = G.out.find((x) => x.t === 'unit.disembark' && x.forced && x.u === p.id)
    if (!bailed || (bailed.to.x === cx && bailed.to.z === cz)) throw new Error(`${where}: the first rider bailed out ${bailed ? `onto (${cx}, ${cz}), inside the enemy's 1"` : 'nowhere'}`)
    look(where)
    const wreck = G.terrain.chunks.find((x) => x.kind === 'wreck')
    if (!wreck || wreck.shape.x !== v.pos.x || wreck.shape.z !== v.pos.z || wreck.hp !== 6 || wreck.look?.piece !== 'wreck') throw new Error(`${where}: no wreck where the hull stood (${JSON.stringify(wreck ?? null)})`)
    if (watch.counts.bailed < 2) throw new Error(`${where}: ${watch.counts.bailed} riders bailed out of a hull carrying two squads in the open`)
    c.bailed = watch.counts.bailed
    c.scenes++
  }

  // 4. a bail-out with nowhere to stand: the field's other units (the
  // Coil's whole army among them) stood one by one on the landing cell
  // nearest the hull, each rider's in turn, the smallest base first, until
  // none is left
  {
    const where = 'scene: a hull destroyed with nowhere to stand'
    const { G, look, watch, snap } = sceneMatch(core, mods, mirror, { battle: true, other: 'serpent' })
    const v = hullsOf(G, 0)[0], spot = emptySpot(G, 9, [v])
    mods.units.moveUnitTo(G, v, spot.x, spot.z)
    const blockers = G.units.filter((u) => u !== v && u.alive > 0 && !u.aboard && !u.t.transport)
    const on = q.riders(G, v).sort((a, b) => a.r - b.r || a.id - b.id)
    let used = 0
    for (const p of on) {
      for (;;) {
        const cells = q.landing(G, p, v, false)
        if (!cells.length || used >= blockers.length) break
        let c0 = cells[0], d0 = Infinity
        for (const i of cells) {
          const d = Math.hypot(G.nav.x(i) - v.pos.x, G.nav.z(i) - v.pos.z)
          if (d < d0) [c0, d0] = [i, d]
        }
        mods.units.setUnitPos(blockers[used++], G.nav.x(c0), G.nav.z(c0))
      }
    }
    snap()
    watch.where = where
    const killer = blockers.find((u) => u.side === 1)
    mods.damage.damage(G, v, 1, 99, killer)
    look(where)
    if (!watch.counts.lost) throw new Error(`${where}: every rider found a spot among ${used} units packed round the hull (the scene reaches no lost rider)`)
    c.lost = watch.counts.lost
    c.scenes++
  }

  // 5. the movement phase: a pilot naming a rider alone refused; a rider
  // stepping off before its hull moved, a unit boarding the hull, the hull
  // moving its riders, a rider stepping off after it (`rode`: no charge)
  {
    const where = 'scene: the movement phase'
    const { G, look } = sceneMatch(core, mods, mirror)
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    look(`${where}, the battle begun`)
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') throw new Error(`${where}: the battle begins at ${JSON.stringify(G.pending)}, not a movement phase`)
    const s = G.pending.seats[0], mine = G.units.filter((u) => u.side === s)
    const v = hullsOf(G, s)[0], [p, p2] = q.riders(G, v)
    const bit = (u) => 2 ** mine.indexOf(u)
    refused(G, s, { t: 'pilot', m: bit(p) }, /rides unit \d+: a rider moves only with its hull/, where)
    legalOk(G, s, { t: 'pilot', m: bit(p) + bit(v) }, where)
    refused(G, s, { t: 'move', u: p.id, c: G.nav.index(p.pos.x + 3, p.pos.z) }, /aboard a vehicle: disembark first/, where)
    refused(G, s, { t: 'advance', u: p.id }, /aboard a vehicle: disembark first/, where)
    const land = q.landing(G, p, v)
    if (!land.length) throw new Error(`${where}: rider unit ${p.id} has no landing cell beside its hull in the deployment's rows`)
    legalOk(G, s, { t: 'disembark', u: p.id, c: land[0] }, where)
    core.apply(G, s, { t: 'disembark', u: p.id, c: land[0] })
    if (p.aboard || !p.flags.moved || p.flags.rode) throw new Error(`${where}: a rider stepping off an unmoved hull is aboard ${p.aboard}, moved ${p.flags.moved}, rode ${p.flags.rode} (want 0, true, unset)`)
    refused(G, s, { t: 'disembark', u: p.id, c: land[0] }, /rides no vehicle/, where)
    look(`${where}, a rider stepped off`)
    // a unit of the seat's boards the hull this move (the first that may)
    let board = null
    for (const u of mine) if (!board && core.legal(G, s, { t: 'embark', u: u.id, v: v.id }) === null) board = u
    if (!board) throw new Error(`${where}: no unit of seat ${s}'s may board unit ${v.id} with ${q.room(G, v)} models' room (the scene reaches no embark in a phase)`)
    core.apply(G, s, { t: 'embark', u: board.id, v: v.id })
    if (board.aboard !== v.id || !board.flags.moved || board.pos.x !== v.pos.x || board.pos.z !== v.pos.z) throw new Error(`${where}: unit ${board.id} boarding in the phase is aboard ${board.aboard}, moved ${board.flags.moved}, at (${board.pos.x}, ${board.pos.z}): want aboard unit ${v.id}, moved, at its hull`)
    refused(G, s, { t: 'disembark', u: board.id, c: q.landing(G, board, v)[0] ?? 0 }, /has moved/, where)
    look(`${where}, a unit boarded`)
    // the hull moves 4" toward the enemy, its riders with it
    const plan = q.movePlan(G, v, 0), sx = G.seats[s].edge
    const to = q.nearestValid(G, plan, v.pos.x - sx * 4, v.pos.z)
    if (to < 0) throw new Error(`${where}: unit ${v.id} has nowhere to move`)
    core.apply(G, s, { t: 'move', u: v.id, c: to })
    look(`${where}, the hull moved`)
    legalOk(G, s, { t: 'disembark', u: p2.id, c: q.landing(G, p2, v)[0] }, where)
    core.apply(G, s, { t: 'disembark', u: p2.id, c: q.landing(G, p2, v)[0] })
    if (!p2.flags.rode || q.canCharge(G, p2)) throw new Error(`${where}: a rider stepping off a hull that had moved has rode ${p2.flags.rode}, and canCharge says ${q.canCharge(G, p2)}: it may not charge this turn`)
    look(`${where}, a rider stepped off a moved hull`)
    c.scenes++
  }

  // 6. the AI's friendly fire round a hull: a Trebuchet choosing between an
  // enemy squad beside its own War-Cart and a weaker one standing alone,
  // the first walked away from the cart a hundredth of an inch at a time.
  // Its choice must be the one it makes with the cart's riders off the
  // table (they are out of a template's reach), at every step; and the
  // sweep must cross where the choice turns, or it shows nothing.
  {
    const where = "scene: the AI's friendly fire round a hull"
    const { G } = sceneMatch(core, mods, mirror)
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    const s = G.pending.seats[0]
    const T = G.units.find((u) => u.side === s && u.t.ai === 'artillery'), v = hullsOf(G, s)[0]
    // (two enemy Nutkin squads, taken off their hulls by hand if they ride)
    const [E, F] = G.units.filter((u) => u.side !== s && u.alive > 0 && u.t.short === 'Nutkin')
    if (!T || !E || !F) throw new Error(`${where}: no Trebuchet, or fewer than two enemy Nutkin squads`)
    E.aboard = F.aboard = 0
    // (set in the movement phase, then End: the shooting phase opens with
    // the targets in range) everything else of the enemy's far off, out of
    // the Trebuchet's range; its own cart forward, the weaker squad apart
    const sx = G.seats[s].edge, W = G.nav.W, H = G.nav.H
    for (const u of G.units) if (u.side !== s && u !== E && u !== F && u.alive > 0 && !u.aboard) mods.units.moveUnitTo(G, u, -sx * (W / 2 - 2), u.pos.z > 0 ? H / 2 - 2 : -(H / 2 - 2))
    const X = { x: T.pos.x - sx * 20, z: -7 }, Y = { x: T.pos.x - sx * 20, z: 7 }
    mods.units.moveUnitTo(G, v, X.x, X.z)
    mods.units.setUnitPos(F, Y.x, Y.z)
    mods.units.setUnitPos(E, X.x - sx * 8, X.z)
    for (const m of F.models.slice(1)) m.alive = false
    F.alive = 1
    mods.units.relayout(F)
    core.apply(G, s, { t: 'end' })
    if (G.pending?.phase !== 'shoot' || G.pending.seats[0] !== s) throw new Error(`${where}: seat ${s}'s End led to ${JSON.stringify(G.pending)}, not its shooting phase`)
    const first = () => {
      const out = G.out
      G.out = null
      try {
        return core.preview(G, () => JSON.stringify(mods.policy.aiPhase(G, s, 'shoot').next().value ?? null))
      } finally {
        G.out = out
      }
    }
    const chosen = new Set()
    for (let k = 0; k <= 650; k++) {
      const D = v.r + E.r - 1 + k * 0.01
      mods.units.setUnitPos(E, X.x - sx * D, X.z)
      const a = first(), b = unridden(G, first)
      if (a !== b) throw new Error(`${where}: with an enemy squad ${D.toFixed(2)}" from the War-Cart the AI shoots ${a}, and ${b} with the cart's riders off the table: its friendly fire counts the riders, whom a template can't reach`)
      chosen.add(a)
    }
    const tgs = [...chosen].map((x) => JSON.parse(x)?.tg)
    if (!tgs.includes(E.id) || !tgs.includes(F.id)) throw new Error(`${where}: the sweep never turned the Trebuchet's choice between unit ${E.id} (beside the cart) and unit ${F.id} (alone): it chose ${[...chosen].join(' and ')}, so it can't tell`)
    c.sweep = 651
    c.scenes++
  }

  // 7. (V3c's Root Snare round a hull, at the V3 merge) the movement
  // phase: a unit that may board the hull refused once it is snared
  // (boarding is its move: mayBoard), and taken again once it isn't; the
  // hull snared, its own move and advance refused while a rider may still
  // step off, and the AI playing the phase (strict: each of its commands
  // judged by legal()) leaving the snared hull where it stands
  {
    const where = 'scene: a snare round a hull'
    const { G, look, snap } = sceneMatch(core, mods, mirror)
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    look(`${where}, the battle begun`)
    if (G.pending?.k !== 'phase' || G.pending.phase !== 'move') throw new Error(`${where}: the battle begins at ${JSON.stringify(G.pending)}, not a movement phase`)
    const s = G.pending.seats[0], mine = G.units.filter((u) => u.side === s)
    const v = hullsOf(G, s)[0], [p, p2] = q.riders(G, v)
    // (a rider off first, for room aboard: the deployment's hull is full)
    core.apply(G, s, { t: 'disembark', u: p.id, c: q.landing(G, p, v)[0] })
    look(`${where}, a rider stepped off`)
    const board = mine.find((u) => core.legal(G, s, { t: 'embark', u: u.id, v: v.id }) === null)
    if (!board) throw new Error(`${where}: no unit of seat ${s}'s may board unit ${v.id} with ${q.room(G, v)} models' room (the scene reaches no snared boarding)`)
    board.snared = true
    refused(G, s, { t: 'embark', u: board.id, v: v.id }, /is snared/, where)
    board.snared = false
    legalOk(G, s, { t: 'embark', u: board.id, v: v.id }, `${where} (the snare lifted)`)
    v.snared = true
    snap()
    const land = q.landing(G, p2, v)
    if (!land.length) throw new Error(`${where}: rider unit ${p2.id} has no landing cell beside its hull`)
    legalOk(G, s, { t: 'disembark', u: p2.id, c: land[0] }, `${where} (a rider of the snared hull)`)
    refused(G, s, { t: 'advance', u: v.id }, /is snared/, where)
    const to = q.nearestValid(G, q.movePlan(G, v, 0), v.pos.x - G.seats[s].edge * 4, v.pos.z)
    if (to >= 0) refused(G, s, { t: 'move', u: v.id, c: to }, /is snared/, where)
    const at = { x: v.pos.x, z: v.pos.z }
    G.strict = true
    try {
      core.apply(G, s, { t: 'auto' })
    } catch (e) {
      throw new Error(`${where}: the AI's movement phase with the hull snared: ${e.message}`)
    } finally {
      G.strict = false
    }
    if (v.pos.x !== at.x || v.pos.z !== at.z || v.flags.moved || v.flags.advanced) throw new Error(`${where}: the AI moved the snared hull from (${at.x}, ${at.z}) to (${v.pos.x}, ${v.pos.z}) (moved ${v.flags.moved}, advanced ${v.flags.advanced}): Root Snare holds it`)
    look(`${where}, the AI's phase played`)
    c.scenes++
  }

  // 8. (F9a's riders and V3c's spells, at the V3 merge) the shooting phase:
  // the Elder beside his own laden War-Cart may ward the hull, but neither
  // the shoot command nor shotInfo (the table's odds and its click) takes a
  // rider aboard it, his own or the enemy's, for any of his spells; and the
  // probes' battery there (every spell at every rider) held to spellRules
  {
    const where = 'scene: a spell at a rider'
    const { G } = sceneMatch(core, mods, mirror)
    core.apply(G, 0, { t: 'deployed' })
    core.apply(G, 1, { t: 'deployed' })
    const s = G.pending.seats[0]
    core.apply(G, s, { t: 'end' })
    if (G.pending?.phase !== 'shoot' || G.pending.seats[0] !== s) throw new Error(`${where}: seat ${s}'s End led to ${JSON.stringify(G.pending)}, not its shooting phase`)
    const elder = G.units.find((u) => u.side === s && u.t.spells && !u.aboard), v = hullsOf(G, s)[0], p = q.riders(G, v)[0]
    const foe = G.units.find((u) => u.side !== s && u.aboard)
    if (!elder || !p || !foe) throw new Error(`${where}: no Elder of seat ${s}'s, no rider aboard its War-Cart, or no enemy rider`)
    const spot = q.freeSpot(G, elder, v.pos.x, v.pos.z + 4, s, G.units.filter((o) => o !== elder && !o.aboard))
    mods.units.setUnitPos(elder, spot.x, spot.z)
    const ward = elder.t.spells.findIndex((w) => w.ward)
    if (ward < 0 || q.gap(elder, p) > elder.t.spells[ward].range) throw new Error(`${where}: the Elder has no ward, or stands ${q.gap(elder, p).toFixed(2)}" from the rider`)
    legalOk(G, s, { t: 'shoot', u: elder.id, tg: v.id, sp: ward }, `${where} (the ward on the hull)`)
    // (each spell at the side it is cast on: a ward at his own rider, the
    // rest at the enemy's, so the rider is the only reason to refuse)
    for (const [tg, whose] of [[p, 'his own'], [foe, "the enemy's"]]) {
      elder.t.spells.forEach((w, sp) => {
        if (q.allySpell(w) !== (tg.side === s)) return
        const info = q.shotInfo(G, elder, tg, sp)
        if (info.ok || !/inside a vehicle/.test(info.why)) throw new Error(`${where}: shotInfo ${info.ok ? 'takes' : `refuses with "${info.why}"`} the Elder's ${w.name} at ${whose} rider (unit ${tg.id}, aboard unit ${tg.aboard}): a rider is inside its vehicle`)
      })
    }
    refused(G, s, { t: 'shoot', u: elder.id, tg: p.id, sp: ward }, /inside a vehicle/, where)
    refused(G, s, { t: 'shoot', u: elder.id, tg: foe.id, sp: elder.t.spells.findIndex((w) => w.snare) }, /inside a vehicle/, where)
    probe(core, G, s, mulberry32(29), `${where}, the probes`)
    c.scenes++
  }
  return c
}
// ── P-army: the deployment at the caps with hulls (F9a) ──────────────────────
// Field and Grand random cap lists (the unit, model, role and per-unit caps
// filled at random from the minimums, points unlimited: DESIGN §4.2.8.7's
// measurement, with two War-Carts on every Bushtail side), Bushtail mirrors
// and Bushtails against the Coil, half on open boards and half fortified:
// the armies made and deployed as newState makes and deploys them
// (core/units.js makeUnit, core/deploy.js deployArmies, the autoload
// among it), on a match whose deployment is pending; then every unit
// placed where `place` would accept it (legal() at its own cell, standing
// on that cell's centre), every rider aboard as the autoload's rule has it
// and boarding as `embark` would take it, and P-riders' state.
function capCounts(race, rules, ROLES, rand, carts) {
  const roster = race.roster, n = roster.length
  const counts = Array(n).fill(0)
  const t = (i) => race.units[roster[i]]
  const cart = roster.findIndex((k) => race.units[k].transport)
  const units = () => counts.reduce((s, x) => s + x, 0), models = () => counts.reduce((s, x, i) => s + x * t(i).models, 0)
  const role = (r) => counts.reduce((s, x, i) => s + (t(i).role === r ? x : 0), 0)
  const fits = (i) => counts[i] < rules.perKind && role(t(i).role) < rules.roles[t(i).role][1] && units() < rules.units && models() + t(i).models <= rules.models
  if (cart >= 0) counts[cart] = carts
  for (const r of ROLES) {
    const of = roster.map((k, i) => i).filter((i) => t(i).role === r && i !== cart)
    while (of.length && role(r) < rules.roles[r][0]) counts[of[Math.floor(rand() * of.length)]]++
  }
  for (;;) {
    const ok = roster.map((k, i) => i).filter((i) => i !== cart && fits(i))
    if (!ok.length) break
    counts[ok[Math.floor(rand() * ok.length)]]++
  }
  return counts
}
function hullDeployTask(core, mods, RACES, MISSIONS, mission, n, seed) {
  const q = core.q, A = core.army, rand = mulberry32(seed * 40503 + 17), m = MISSIONS[mission]
  const lifted = { ...m.list, points: 1e9 }
  const c = { boards: 0, units: 0, riders: 0, hulls: 0, sets: {} }
  for (let k = 0; k < n; k++) {
    const races = k % 2 ? ['squirrel', 'serpent'] : ['squirrel', 'squirrel']
    const lists = races.map((race) => capCounts(RACES[race], m.list, mods.schema.ROLES, rand, 2))
    lists.forEach((x, i) => {
      const why = A.checkList(RACES[races[i]], lifted, x)
      if (why) throw new Error(`P-army hull deployment: the ${races[i]} cap list ${A.listText(x)} at ${mission} breaks a cap: ${why}`)
    })
    const terrain = m.sets[k % m.sets.length]
    const setup = { board: Math.floor(rand() * 2 ** 32), dice: 7, mission, terrain, seats: races.map((race) => ({ race, ctrl: 'human' })) }
    const where = `P-army hull deployment ${mission} board ${seed}.${k} (${JSON.stringify({ ...setup, lists: lists.map((x) => A.listText(x)) })})`
    const G = core.createMatch(setup, { out: null })
    // the cap lists' units in place of the preset's, made and deployed as
    // newState does
    G.units.length = 0
    G.nextUnitId = 1
    races.forEach((race, side) => {
      for (const key of A.keysOf(RACES[race], A.listText(lists[side]))) G.units.push(mods.units.makeUnit(G, key, side))
    })
    mods.deploy.deployArmies(G)
    if (G.pending?.k !== 'deploy') throw new Error(`${where}: the match waits on ${JSON.stringify(G.pending)}, not its deployment`)
    const hulls = G.units.filter((u) => u.t.transport)
    if (hulls.filter((u) => u.side === 0).length !== 2) throw new Error(`${where}: seat 0 fields ${hulls.filter((u) => u.side === 0).length} War-Carts, not two`)
    c.riders += autoloadCheck(G, where)
    ridersState(core, mods, G, where)
    for (const u of G.units) {
      if (u.aboard) {
        // aboard as `embark` would board it: off, then judged
        const v = unitById(G, u.aboard)
        u.aboard = 0
        let why
        try {
          why = core.legal(G, u.side, { t: 'embark', u: u.id, v: v.id })
        } finally {
          u.aboard = v.id
        }
        if (why !== null) throw new Error(`${where}: unit ${u.id} (${u.t.short}) rides unit ${v.id}, but embark would refuse it: ${why}`)
        continue
      }
      const cell = G.nav.index(u.pos.x, u.pos.z)
      const why = core.legal(G, u.side, { t: 'place', u: u.id, c: cell })
      if (why !== null || G.nav.x(cell) !== u.pos.x || G.nav.z(cell) !== u.pos.z) throw new Error(`${where}: unit ${u.id} (${u.t.short}${u.t.transport ? ', a hull' : ''}, seat ${u.side}) was deployed at (${u.pos.x}, ${u.pos.z}), where place would refuse it: ${why ?? 'no cell centre'}`)
      c.units++
    }
    c.hulls += hulls.length
    c.boards++
    c.sets[terrain] = (c.sets[terrain] ?? 0) + 1
  }
  return c
}

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
  // (F9a) what P-riders reaches below the core's door, on code with
  // transports (null for older code): the units' places, damage and a
  // template, the AI's shots and scores, the deployment, the constants
  const ridesMods = async () => {
    if (!existsSync(join(dir, 'core', 'actions', 'transport.js'))) return null
    const at = (...f) => import(pathToFileURL(join(dir, ...f)).href)
    const [units, damage, shoot, policy, score, deploy, rules, nav, schema] = await Promise.all([at('core', 'units.js'), at('core', 'actions', 'damage.js'), at('core', 'actions', 'shoot.js'), at('core', 'ai', 'policy.js'), at('core', 'ai', 'score.js'), at('core', 'deploy.js'), at('core', 'rules.js'), at('core', 'nav.js'), at('data', 'schema.js')])
    return { units, damage, shoot, policy, score, deploy, rules, nav, schema }
  }
  // the HUD model's resultOf (R7b on; null for older code)
  const hud = existsSync(join(dir, 'present', 'hud-model.js')) ? await import(pathToFileURL(join(dir, 'present', 'hud-model.js')).href) : null
  let out
  try {
    if (task.kind === 'corpus') {
      const it = loadCorpus().items.find((x) => x.id === task.id)
      out = { ok: true, counts: corpusTask(core, rng, mirror, it, match, hud) }
    } else if (task.kind === 'random') {
      const lists = task.lists ? { mission: task.lists, RACES, MISSIONS: await missionsOf(), mods: await ridesMods(), rides: !!task.rides } : null
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
    } else if (task.kind === 'spell') {
      // (V3c: P-spell's scenes)
      const policy = await import(pathToFileURL(join(dir, 'core', 'ai', 'policy.js')).href)
      RACES_S = RACES
      out = { ok: true, counts: spellTask(core, { rng, policy }) }
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
      out = { ok: true, counts: armyGamesTask(core, RACES, await missionsOf(), task.mission, task.n, task.seed, await ridesMods()) }
    } else if (task.kind === 'rides') {
      // (F9a) P-riders: AI battles with War-Carts
      out = { ok: true, counts: ridesTask(core, await ridesMods(), mirror, RACES, await missionsOf(), task.mission, task.n, task.seed) }
    } else if (task.kind === 'ridesScene') {
      out = { ok: true, counts: ridesScenes(core, await ridesMods(), mirror, RACES, await missionsOf()) }
    } else if (task.kind === 'hullDeploy') {
      // (F9a) P-army: the deployment at the caps with hulls
      out = { ok: true, counts: hullDeployTask(core, await ridesMods(), RACES, await missionsOf(), task.mission, task.n, task.seed) }
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
// legal lists played AI against AI (in children of 10) and with a human
// seat; (F9a) P-riders': AI battles with War-Carts by mission (in children
// of 2), random games with War-Carts and a human seat, the scenes, and
// P-army's deployments at the caps with hulls by mission ((V3d, at the V3
// merge) the Powder Field among them: it takes War-Carts as Grand does)
const ARMY = { fuzz: 100000, ai: 40, human: 10, ridesAI: { field: 6, grand: 2, powder: 2 }, ridesHuman: 6, hullDeploy: { field: 40, grand: 20, powder: 20 } }

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
  // (F9a, code with transports: P-riders, and P-army's deployment at the
  // caps with hulls)
  const rides = existsSync(join(pkg, 'core', 'actions', 'transport.js'))
  if (rides) {
    tasks.unshift({ kind: 'ridesScene' })
    for (const [k, [mission, n]] of Object.entries(army.ridesAI ?? {}).entries()) for (let j = 0; j < n; j += 2) tasks.push({ kind: 'rides', mission, n: Math.min(2, n - j), seed: seed * 1000 + k * 100 + j })
    for (let j = 0; j < (army.ridesHuman ?? 0); j++) tasks.push({ kind: 'random', seed: 800000 + seed * 1000 + j, lists: j % 3 === 2 ? 'grand' : 'field', rides: true })
    for (const [mission, n] of Object.entries(army.hullDeploy ?? {})) if (n) tasks.push({ kind: 'hullDeploy', mission, n, seed })
  }
  const t0 = Date.now()
  const res = await pool(tasks, CPUS, async (t) => {
    const r = await child(t, pkg)
    const c = r.counts
    const label = t.kind === 'corpus' ? t.id : t.kind === 'army' ? 'P-army fuzz, sweep' : t.kind === 'armyGames' ? `P-army ${t.mission} #${t.seed}` : t.kind === 'rides' ? `P-riders ${t.mission} #${t.seed}` : t.kind === 'ridesScene' ? 'P-riders scenes' : t.kind === 'hullDeploy' ? `hull deploy ${t.mission}` : t.rides ? `rides game ${t.seed}` : t.lists ? `list game ${t.seed}` : `game ${t.seed}`
    const what = !r.ok ? '' : t.kind === 'corpus' ? `${c.probes} decisions probed`
      : t.kind === 'army' ? `${c.fuzz.fuzzed} armies fuzzed (${c.fuzz.refused} refused, ${c.fuzz.both} with both seats fuzzed; ${c.fuzz.taken} taken, ${c.fuzz.roundTrips} seats round-tripped, ${c.fuzz.made} made into matches), ${c.sweep} autoLists legal, ${c.shadow} classic shadows held`
        : t.kind === 'armyGames' ? `${c.listGames} AI battles between lists of ${c.budgets[0]}-${c.budgets[1]} points (score ${c.ends.score}, wipe ${c.ends.wipe})${c.hulls ? `, ${c.hulls} hulls fielded, ${c.bailed} bail-outs held to P-riders` : ''}`
          : t.kind === 'rides' ? `${c.battles} AI battles with War-Carts: ${c.lines} trace lines held to P-riders' state (${c.hidden} hidden-rider queries), ${c.autoloaded} riders autoloaded, riders stepping off ${c.steps} times (in ${c.stepped} battles), ${c.hullsDown} hulls destroyed with riders (${c.bailed} bailed out, ${c.lost} lost), ${c.wrecks} wrecks, the mirror held at ${c.acts} acts`
            : t.kind === 'ridesScene' ? `${c.scenes} scenes: ${c.autoloaded} riders autoloaded, ${c.hidden} hidden-rider queries, ${c.bailed} bailed out by an enemy's 1", ${c.lost} lost with nowhere to stand, the AI's friendly fire swept at ${c.sweep} places`
              : t.kind === 'hullDeploy' ? `${c.boards} deployments at the caps (${Object.entries(c.sets).map(([k, n]) => `${k} ${n}`).join(', ')}): ${c.hulls} hulls, ${c.units} units on the table where place takes them, ${c.riders} riders aboard as the autoload and embark have them`
                : `${c.ended}, ${c.probes} decisions, ${Object.entries(c.commands).map(([k, n]) => `${k} ${n}`).join(', ')}${c.rides ? ` (P-riders: ${c.rides.autoloaded} autoloaded, ${c.rides.hidden} hidden-rider queries, embark ${c.rides.embarkDeploy} in the deployment and ${c.rides.embarkPhase} in a phase, ${c.rides.steps} steps off, ${c.rides.bailed} bailed out, ${c.rides.lost} lost)` : ''}`
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
    say(`  P-keg: ${r.ok ? `ok   no keg on ${r.counts.clean} boards of classic, open and fortified, one at (0, 0) on ${r.counts.kegBoards} keg boards, ${r.counts.powderKegs ?? 0} kegs every one a keg in its rules on ${r.counts.powderBoards ?? 0} Powder Field boards; ${r.counts.templates} templates setting the keg off once (${r.counts.once} again on the same spot setting nothing off), the setting-off blast's victims and scenery before the keg's line, fuse and blast, ${r.counts.rows} victims' rows held die for die in G.units order, the fallen the setter-off's; ${r.counts.chains} chains of four kegs going off in the line's order, each once; ${r.counts.walks} wreckers' walks setting it off once the walk ended; ${r.counts.values} AI keg values and ${r.counts.fears} cells in the blast feared` : `FAIL ${r.error}`}`)
    if (!r.ok) bad.push(r)
  }
  // (V3c) P-spell's scenes, for code whose casters have several spells
  if (/export function bestCast/.test(readFileSync(join(pkg, 'core', 'ai', 'policy.js'), 'utf8'))) {
    const r = await child({ kind: 'spell' }, pkg)
    say(`  P-spell: ${r.ok ? `ok   ${r.counts.legal} casts taken at their targets and ${r.counts.refused} refused (the other side, past the range, the dead), ${r.counts.made} made and ${r.counts.fizzled} fizzled, each die for die and none twice a phase; ${r.counts.ends} marks worn off when they must; ${r.counts.wards} wards saving one better; ${r.counts.rerolls} resolute charges rolled again and ${r.counts.morale} resolute squads untested; the AI's pick on a friend ${r.counts.ai} times, its default its pick in ${r.counts.defaults} scenes` : `FAIL ${r.error}`}`)
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
  // (F9a) P-riders: what it held, over the run, and what the games must
  // have reached (the scenes reach the rest whatever the games do)
  let ridesSaid = ''
  if (rides) {
    const of = (kind) => res.filter((r, i) => r.ok && tasks[i].kind === kind).map((r) => r.counts)
    const ai = of('rides').reduce((s, c) => ({ battles: s.battles + c.battles, stepped: s.stepped + c.stepped, steps: s.steps + c.steps, bailed: s.bailed + c.bailed, lines: s.lines + c.lines }), { battles: 0, stepped: 0, steps: 0, bailed: 0, lines: 0 })
    const human = res.filter((r, i) => r.ok && tasks[i].rides).map((r) => r.counts.rides ?? {})
    const sum = (k) => human.reduce((n, c) => n + (c[k] ?? 0), 0)
    const scenes = of('ridesScene')[0], deploys = of('hullDeploy')
    if (coverage && !bad.length) {
      const wantAI = Object.values(army.ridesAI ?? {}).reduce((a, b) => a + b, 0)
      if (ai.battles !== wantAI) bad.push({ error: `P-riders ran short: ${ai.battles} of ${wantAI} AI battles with War-Carts` })
      else if (wantAI >= 2 && !ai.steps) bad.push({ error: `P-riders: in ${ai.battles} AI battles with War-Carts no rider ever stepped off (the AI's transports never reached)` })
      if ((army.ridesHuman ?? 0) >= 4 && (!sum('embarkDeploy') + !sum('embarkPhase') + !sum('disembarks'))) bad.push({ error: `P-riders: the random games with a human seat never sent ${[!sum('embarkDeploy') && 'an embark in the deployment', !sum('embarkPhase') && 'an embark in a phase', !sum('disembarks') && 'a disembark'].filter(Boolean).join(', ')} (more games?)` })
    }
    ridesSaid = `; (P-riders) ${ai.battles} AI battles with War-Carts (${ai.lines} trace lines held, riders stepping off ${ai.steps} times in ${ai.stepped} of them, ${ai.bailed} bail-outs) and ${human.length} random games with a human seat (embark ${sum('embarkDeploy')} in the deployment and ${sum('embarkPhase')} in a phase, disembark ${sum('disembarks')}, ${sum('hidden')} hidden-rider queries), ${scenes ? `${scenes.scenes} scenes` : 'no scenes'}; (P-army) ${deploys.reduce((n, c) => n + c.boards, 0)} deployments at the caps with hulls placed legally`
  }
  // (V3c) every spell of every caster named by a human seat's command in
  // the random games (P-spell's rules held at each decision: spellRules)
  const cast = {}
  for (const r of res) for (const [k, n] of Object.entries(r.counts?.spells ?? {})) cast[k] = (cast[k] ?? 0) + n
  if (coverage && games >= 8 && /export function bestCast/.test(readFileSync(join(pkg, 'core', 'ai', 'policy.js'), 'utf8'))) {
    const { RACES } = await import(pathToFileURL(join(pkg, 'data', 'schema.js')).href)
    const want = Object.values(RACES).flatMap((r) => Object.values(r.units).filter((t) => t.spells).flatMap((t) => t.spells.map((w) => `${t.key} ${w.name}`)))
    const never = want.filter((k) => !cast[k])
    if (never.length) bad.push({ error: `the random games' human seats never cast: ${never.join(', ')} (more --games?)` })
  }
  // (F11a) P-army: what it held, over the run
  let armySaid = ''
  if (lists) {
    const fz = res.find((r, i) => r.ok && tasks[i].kind === 'army')?.counts
    const ai = res.filter((r, i) => r.ok && tasks[i].kind === 'armyGames').reduce((n, r) => n + r.counts.listGames, 0)
    const human = res.filter((r, i) => r.ok && tasks[i].lists && !tasks[i].rides).length
    const want = tasks.filter((t) => t.kind === 'armyGames').reduce((n, t) => n + t.n, 0)
    if (!bad.length && (!fz || ai !== want || human !== tasks.filter((t) => t.lists && !t.rides).length)) bad.push({ error: `P-army ran short: ${fz ? 'the fuzz held' : 'no fuzz'}, ${ai} of ${want} AI list battles, ${human} list games with a human seat` })
    if (fz) armySaid = `; (P-army) ${fz.fuzz.fuzzed} fuzzed armies, ${fz.fuzz.refused} refused with a seat's reason and ${fz.fuzz.taken} taken in their one spelling (${fz.fuzz.made} made into matches), ${fz.sweep} autoLists legal, ${fz.shadow} classic shadows unchanged, ${ai + human} random legal lists' battles played to the end (${human} with a human seat)`
  }
  say(`\n${items.length} corpus battles and ${games} random games (${Object.entries(reached).map(([k, n]) => `${k} ${n}`).join(', ')}${Object.keys(cast).length ? `; spells cast by a human seat: ${Object.entries(cast).map(([k, n]) => `${k} ${n}`).join(', ')}` : ''}), ${probes} decisions probed (${heights} of them on fortified boards, held to P-height), every AI command held to legal(), ${refolded} random games' logs folded by foldJob the same, ${quietly} corpus battles folded quietly as well (${res.reduce((n, r) => n + (r.counts?.hashed ?? 0), 0)} stateHashes before entries the same), the match's events held to the mirror at ${mirrored[0]} acts and ${mirrored[1]} stops, ${sessions[0]} corpus battles played through the Session the same (the sink handed all ${sessions[2]} events the core left, in order; ${sessions[1]} junk entries refused on replay; ${sessions[3]} of the Folder's rules held on replays), resultOf(G) the match's game.over at ${results} ends${armySaid}${ridesSaid} (${Math.round((Date.now() - t0) / 1000)} s)`)
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
  // ((F9a) the pile-in's test, its ground vehicles kept off raised floors
  // beside it, and its place set by moveUnitTo, which carries a hull's
  // riders)
  'pile-in-anywhere': ['core/actions/damage.js', "      if (G.nav.standable(i, u.r, moveMode(u) === 'wreck' ? 'wreck' : 'walk') && !(groundOnly(u) && G.nav.floor[i] > STEP)) moveUnitTo(G, u, x, z)", '      moveUnitTo(G, u, x, z)'],
  'charge-others-flat': ['core/actions/charge.js', ' && Math.abs(nav.floor[i] - oy[k]) <= HIGH)) continue', ')) continue'],
  'engaged-ignores-height': ['core/queries.js', 'gap(u, e) <= ENGAGE + 0.05 && Math.abs(groundY(G, u) - groundY(G, e)) <= HIGH)', 'gap(u, e) <= ENGAGE + 0.05)'],
  'everyone-climbs': ['core/actions/move.js', 'forbid: mode === \'fly\' ? null : forbid, climb: climbs(u) })', 'forbid: mode === \'fly\' ? null : forbid, climb: true })'],
  // (F17) lobbing from height: a reach that ignores the height, direct
  // fire (and spells) lobbing too, and an AI that weighs the printed range
  // while the rules take the lob
  'lob-flat': ['core/actions/shoot.js', '  if (!G.nav.hasHeight || !lobbed(w)) return w.range\n', '  return w.range\n'],
  'lob-direct': ['core/actions/shoot.js', 'export const lobbed = (w) => !!w && !w.spell && !!(w.blast || w.indirect)', 'export const lobbed = (w) => !!w'],
  'lob-ai-flat': ['core/ai/score.js', '  if (g > (w === u.t.ranged ? rangeOf(G, u, e, from) : w.range)) return 0\n', '  if (g > w.range) return 0\n'],
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
  'ai-ignores-own-template': ['core/ai/score.js', ' - (pre ? pre.own : ownUnder(G, u, e, w)))', ')'],
  // (V3c) P-spell: a ward that never wears off, a snare that outlasts its
  // victim's turn, a cast that leaves the caster free to cast again, a
  // ward cast anywhere on the table, a snared unit that walks, a ward that
  // saves no better, a resolute squad tested all the same, a failed charge
  // never rolled again, an AI that casts no spell on a friend, a default
  // that isn't the AI's pick
  'ward-forever': ['core/engine.js', '      if (u.warded || u.resolute) {\n        u.warded = u.resolute = false\n        worn = true\n      }\n', ''],
  'snare-forever': ['core/engine.js', '    if (u.snared) u.snared = false\n', ''],
  'cast-twice': ['core/actions/shoot.js', "  const info = shotInfo(G, u, target, sp)\n  u.flags.shot = true\n", "  const info = shotInfo(G, u, target, sp)\n  if (!w.spell) u.flags.shot = true\n"],
  'ward-anywhere': ['core/actions/shoot.js', "    if (range > w.range) return { ok: false, why: `out of range (${range.toFixed(1)}\" / ${w.range}\")` }\n    return { ok: true, range, reach: w.range, ally: true }\n", '    return { ok: true, range, reach: w.range, ally: true }\n'],
  'snare-walks': ['core/commands.js', "  if (u.flags.moved) return `${u.t.short} has moved`\n  if (u.snared) return `${u.t.short} is snared`\n  if (!inGrid(G, c)", "  if (u.flags.moved) return `${u.t.short} has moved`\n  if (!inGrid(G, c)"],
  'ward-no-better': ['core/rules.js', 'export const svOf = (u) => (u.warded ? u.t.Sv - 1 : u.t.Sv)', 'export const svOf = (u) => u.t.Sv'],
  'resolute-tested': ['core/actions/morale.js', '    if (u.resolute) {\n', '    if (u.resolute && false) {\n'],
  'resolute-no-reroll': ['core/actions/charge.js', '  const again = !ok && u.resolute\n', '  const again = false\n'],
  'ai-no-wards': ['core/ai/score.js', '  if (w.ward) return e.warded ? 0 : p * worth(e) * exposure(G, e) * wardGain(e)\n  if (w.resolve) return e.resolute ? 0 : p * resolveGain(G, e)\n', '  if (w.ward || w.resolve) return 0\n'],
  'default-first': ['core/ai/policy.js', 'export const bestSpell = (G, u) => (u.t.spells ? bestCast(G, u)?.sp ?? 0 : 0)', 'export const bestSpell = (G, u) => 0'],
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
  // (F9a, P-riders) a hull's move leaves its riders where it stood
  'rider-left-behind': ['core/units.js', '  for (const o of G.units) if (o.aboard === u.id) setUnitPos(o, x, z)\n', ''],
  // a place leaves a rider aboard its hull, wherever it is put
  'place-keeps-aboard': ['core/commands.js', '    unit.aboard = 0\n    moveUnitTo(G, unit, G.nav.x(c), G.nav.z(c))', '    moveUnitTo(G, unit, G.nav.x(c), G.nav.z(c))'],
  // the autoload boards squads past the hull's capacity
  'autoload-overfills': ['core/actions/transport.js', '      if (u.t.base > tr.maxBase || u.t.big || u.t.wrecker || u.alive > left) continue\n', '      if (u.t.base > tr.maxBase || u.t.big || u.t.wrecker) continue\n'],
  // the autoload boards any unit, not only Troops (the Elder among them)
  'autoload-any-role': ['core/actions/transport.js', "      if (u.side !== v.side || u.t.role !== 'Troops' || u.aboard || !alive(u)) continue", '      if (u.side !== v.side || u.aboard || !alive(u) || u.t.vehicle) continue'],
  // embark takes bases too large for the hull (the Trebuchet aboard)
  'board-any-base': ['core/actions/transport.js', "  if (u.t.base > tr.maxBase) return `${u.t.short}'s bases are too large for the ${v.t.short} (${u.t.base}\" over its ${tr.maxBase}\")`\n", ''],
  // a rider is the enemy's to see: in every bubble, fight and target list
  'enemies-see-riders': ['core/queries.js', 'export const enemiesOf = (G, u) => G.units.filter((e) => e.side !== u.side && alive(e) && !e.aboard)', 'export const enemiesOf = (G, u) => G.units.filter((e) => e.side !== u.side && alive(e))'],
  // riders lend auras and count among the AI's friends
  'friends-see-riders': ['core/queries.js', 'export const friendsOf = (G, u) => G.units.filter((e) => e.side === u.side && alive(e) && e !== u && !e.aboard)', 'export const friendsOf = (G, u) => G.units.filter((e) => e.side === u.side && alive(e) && e !== u)'],
  // a rider engages whoever stands by its hull
  'rider-engages': ['core/queries.js', 'export const engagedWith = (G, u) => u.aboard ? [] : G.nav.hasHeight', 'export const engagedWith = (G, u) => G.nav.hasHeight'],
  // riders hold objectives from the deck
  'riders-hold': ['core/queries.js', '    if (!alive(u) || u.aboard) continue\n    for (const m of u.models) if (m.alive && hypot(', '    if (!alive(u)) continue\n    for (const m of u.models) if (m.alive && hypot('],
  // a template over a hull wounds the riders on its deck
  'blast-hits-riders': ['core/actions/shoot.js', '    if (!alive(v) || v.aboard) continue\n', '    if (!alive(v)) continue\n'],
  // a hull's riders at its centre pen in its own move's ends
  'riders-block-ends': ['core/actions/move.js', '    if (o === u || !alive(o) || o.aboard) continue', '    if (o === u || !alive(o)) continue'],
  // and its placement (fits), and its charge's spots (a friend's spacing)
  'riders-block-place': ['core/deploy.js', 'if (others.some((o) => !o.aboard && hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4)) return false', 'if (others.some((o) => hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4)) return false'],
  'riders-block-charge': ['core/actions/charge.js', 'o.side === u.side && !o.aboard && hypot(', 'o.side === u.side && hypot('],
  // the AI's friendly fire counts the riders, whom no template reaches
  'aishoot-fears-riders': ['core/ai/policy.js', '          if (f.side !== u.side || !alive(f) || f.aboard) continue', '          if (f.side !== u.side || !alive(f)) continue'],
  // the bail-out runs backwards through G.units
  'bail-reversed': ['core/actions/transport.js', '  for (const p of G.units.filter((o) => o.aboard === v.id && alive(o))) {', '  for (const p of G.units.filter((o) => o.aboard === v.id && alive(o)).reverse()) {'],
  // the bail-out ignores the enemies' 1"
  'bail-into-bubbles': ['core/actions/transport.js', '  const c = nearestCell(G, landing(G, p, v), v.pos.x, v.pos.z)', '  const c = nearestCell(G, landing(G, p, v, false), v.pos.x, v.pos.z)'],
  // a landing (a step off, a bail-out) crowds onto other units' bases
  'landing-crowds': ['core/actions/transport.js', '    if (others.some((o) => hypot(o.pos.x - x, o.pos.z - z) < o.r + u.r + 0.08)) continue\n', ''],
  // a rider with nowhere to stand survives the wreck
  'lost-rider-lives': ['core/actions/transport.js', '      for (const m of p.models) if (m.alive) killModel(G, p, m, v, m.w)\n', ''],
  // (P-pilot, F9a) a mask naming a rider without its hull is taken
  'pilot-rider-alone': ['core/commands.js', '  if (loose) return `unit ${loose.id} rides unit ${loose.aboard}: a rider moves only with its hull, so m names both`\n', ''],
  // a rider off a hull that had moved may still charge
  'rode-forgotten': ['core/actions/transport.js', '  if (v.flags.moved) u.flags.rode = true\n', ''],
  // boarding in a phase isn't the unit's move: it may step off again
  'embark-unmoved': ['core/actions/transport.js', '  moveUnitTo(G, u, v.pos.x, v.pos.z)\n  u.flags.moved = true\n', '  moveUnitTo(G, u, v.pos.x, v.pos.z)\n'],
  // (the V3 merge's rules, P-riders' scenes 7 and 8 and spellRules) a
  // spell on a friend takes a rider: the shoot command's `friend` and
  // shotInfo's ally branch both let it through (either alone is the other's
  // backstop: legal() asks friend, then mayShoot asks shotInfo)
  'friend-takes-rider': [
    ['core/commands.js', '  return mine(G, seat, id) ?? (u.aboard ? `${u.t.short} is inside a vehicle` : null)\n', '  return mine(G, seat, id)\n'],
    ['core/actions/shoot.js', '    if (target.aboard) return { ok: false, why: `${target.t.short} is inside a vehicle` }\n    const range = target === u', '    const range = target === u'],
  ],
  // a snared unit boards a hull
  'snared-boards': ['core/actions/transport.js', '  if (u.snared) return `${u.t.short} is snared`\n', ''],
  // the AI moves a snared hull
  'snared-hull-moves': ['core/ai/policy.js', '    if (!v.snared) yield* aiMoveOne(G, v, hullRole(G, v), claimed)\n', '    yield* aiMoveOne(G, v, hullRole(G, v), claimed)\n'],
}

if (a['self-test']) {
  const work = join(tmpdir(), `tails-and-scales-prop-${process.pid}`)
  // (F11a: P-army's workload cut down, its fuzz a fifth and a few list
  // battles; F9a: P-riders' too, a battle with War-Carts, a game with a
  // human seat, the scenes and a few deployments at the caps)
  const load = { games: 10, seed: 1, only: 'hotseat-late-8,bushtail-random-6,64-89', quiet: true, coverage: false, army: { fuzz: 20000, ai: 3, human: 1, ridesAI: { field: 1 }, ridesHuman: 1, hullDeploy: { field: 4, grand: 2 } } }
  // (--mutations a,b: only those, by name)
  const names = a.mutations ? a.mutations.split(',').map((x) => x.trim()) : Object.keys(MUTATIONS)
  const unknown = names.filter((x) => !Object.hasOwn(MUTATIONS, x))
  if (unknown.length) {
    console.error(`property: no mutation ${unknown.join(', ')} (there are ${Object.keys(MUTATIONS).join(', ')})`)
    process.exit(2)
  }
  const clean = await run(copyCode(dir, join(work, 'unbroken')), load)
  if (clean.length) {
    console.log(`property self-test: the unbroken copy fails the same workload, so no mutation can be judged: ${clean[0].error}`)
    rmSync(work, { recursive: true, force: true })
    process.exit(1)
  }
  console.log('  unbroken       passes (three corpus battles, ten games)')
  let missed = 0
  for (const [name, spec] of Object.entries(MUTATIONS).filter(([x]) => names.includes(x))) {
    const pkg = copyCode(dir, join(work, name))
    // (a mutant is one edit [file, from, to], or a list of them, each made)
    const edits = Array.isArray(spec[0]) ? spec : [spec]
    const stale = edits.find(([file, from]) => readFileSync(join(pkg, file), 'utf8').split(from).length !== 2)
    if (stale) {
      console.log(`  ${name.padEnd(14)} STALE: "${stale[1].trim().slice(0, 50)}" isn't in ${stale[0]} exactly once`)
      missed++
      continue
    }
    for (const [file, from, to] of edits) {
      const f = join(pkg, file)
      writeFileSync(f, readFileSync(f, 'utf8').replace(from, to))
    }
    const bad = await run(pkg, load)
    console.log(`  ${name.padEnd(14)} ${bad.length ? `caught: ${bad[0].error.slice(0, 150)}` : 'MISSED'}`)
    if (!bad.length) missed++
  }
  rmSync(work, { recursive: true, force: true })
  console.log(missed ? `\nproperty self-test FAILED: ${missed} mutation(s) missed or stale` : `\nproperty self-test passed: all ${names.length} mutations caught${names.length < Object.keys(MUTATIONS).length ? ` (--mutations: ${names.length} of ${Object.keys(MUTATIONS).length})` : ''}`)
  process.exit(missed ? 1 : 0)
}

console.log(`property: the pure core of ${dir === PKG ? 'the working tree' : dir}`)
const bad = await run(dir, { games: GAMES, seed: SEED, only: a.only })
for (const b of bad) if (!b.id) console.log(`  FAIL ${b.error}`)
console.log(bad.length ? `\nproperty FAILED: ${bad.length} problem(s)` : '\nproperty passed: asking never rolls or changes the match, the AI never plays an illegal command, random legal play never throws, two matches never touch, a quiet fold plays the same battle, the events show the match, a setup the rules can\'t play is refused, and (F11a) a seat\'s army is refused for its own reason or played as its list says')
process.exit(bad.length ? 1 : 0)
