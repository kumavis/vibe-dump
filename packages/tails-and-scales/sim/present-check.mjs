// P-present (DESIGN §2.4, §4 R5, R6b): what the table shows is the match.
// The match runs ahead (from R6b one `end` computes a whole AI turn, a
// watched battle the whole battle, before the first die is shown) and the
// view plays its events later, reading a mirror folded from those events
// (present/mirror.js) instead of G. Here every corpus battle is played in
// Node, as the parity oracle plays it, while a mirror of its own is folded
// from every event the page's player plays, starting from the mirror the
// player is reset to as the battle starts (the table as shown: from R6b the
// backdrop, the battle's own table before anything happens). At every
// checkpoint the folded mirror must equal the match's projection there
// exactly: every unit's place, radius, models (wounds, standing, slots),
// count standing, mesmerized and in combat; every chunk standing and its
// height; the objectives' owners, the score, the round, the seat and phase,
// the stage. The player's own mirror must equal it too. (R6b's fixer,
// round 2) And the unit card of every unit, as the page shows it then (the
// ?debug block's present.card), must read only what the table has shown:
// its models or wounds, mesmerized, in combat (the mirror's); and (R7b)
// what the unit did this turn and whether it stands in cover as the match
// stood at the last action's end (each `act`) or the last stop (each
// `pending`: where the match waits on a decision after an entry, a
// deployment's placements included) the player has played, or at the
// battle's start before either, a seat's first phase clearing its units'
// deeds as the match's turn start does (DESIGN §2.4: the HUD model's shown
// source, present/hud-model.js). Those facts are taken here from a fold of
// the same battle of its own, through the core alone (quiet, an `act` line
// and an entry at a time), so the page's own record is held to the match;
// code before R7b showed none of them while behind, and is held to that.
// The checkpoints,
// which only ?debug puts in the events (app/boot.js's ?debug block, main.js's
// until R7b: the core can't project, so it takes project(G) as the match
// writes each `act`, `phase` and `over` trace line, and as it stops after
// each entry the Session folds):
//   - each action's end, its `act` event, carrying project(G) as the act
//     line was written;
//   - a `check` event carrying project(G) as the match then stood: where
//     each `act` line was written (after the action's own events, before
//     its end re-reports the flags and labels), where each `phase` line was
//     (after a fight or a morale phase, or a phase's last action), where the
//     `over` line was, and at the end of each entry's events (as the match
//     stops for the next decision: after a deployment's stage, a placement,
//     a charge declared, an advance; or ends). An action's end emits the
//     flags' and labels' events (`objectives`, `status`) straight before its
//     `act`, so at an act those are always fresh; the checks before them
//     are what hold the actions' own (a damage that slew, a flight, the ⚔
//     going as a damage ends, a flag a walk took, a unit mesmerized) to the
//     match.
// So an event the rules forget to emit (a model that fell, a block that
// dropped, a flag a kill turned) is a failing check, not a figure left
// standing on the table. Not covered:
//   - the `status` after a turn's mesmerism wears off (core/engine.js's
//     turn end), which the next action's end repeats before any checkpoint
//     when that comes first (a `phase` line's check comes first only when
//     the next turn's first phase has nothing to do);
//   - the fight phase's closing `status`, which repeats its last fight's
//     damage's (every fight ends in one), so a lost one changes nothing a
//     check sees; and, since a whole fight phase (or a whole shot) has one
//     checkpoint, a damage's flags or labels lost mid-phase (or between two
//     templates' victims) where a later damage in it puts them right;
//   - the flags at the battle's start: a check follows them, but no corpus
//     battle deploys a model within reach of an objective (the deployment
//     zones end at |x| = 12, the flank objectives stand at |x| = 9 with a
//     3" reach plus the base), so they are always nobody's there and a
//     lost one changes nothing the check can see. Covering them needs a
//     human log that deploys onto an objective: a corpus change, the
//     lead's to make.
//
// It also requires one act event per `act` line of the trace, at least one
// check per battle (every turn's morale phase has one), and at the game's
// end the mirror to equal project(G) once more (the round too from R6b,
// whose engine never runs it one past the last as the old battle loop did
// on a battle that ran its course), and each battle's trace, shadows and
// battle log to match the corpus, so the events are tapped from the battle
// parity checks.
//
// And the events the mirror ignores, the roll-off's (R6b's, in the stream
// before the first turn) and the actions' own (core/actions/:
// fight.js's lunge, turn to face, camera, tray and beat after a fight;
// charge.js's turn to face and verdict; move.js's stomp and advance roll;
// shoot.js's turn to face, volley, templates and spells), are held to their
// order as the player plays them (eventOrder, below), since nothing the
// mirror holds would show one lost or moved; and so is the look the view
// reads off a walk or a shot (a walk's flight and pace, a shot's `fx` and
// who throws), which neither the mirror nor the trace holds:
//   - the roll-off: its tray ("Roll-off for the first turn") straight after
//     the battle's `stage` and its flags (`objectives`), then its one-die
//     rows in pairs, seat 0's then seat 1's (each pair's labels the first
//     pair's), every pair but the last a tie, then straight on to the line
//     naming the higher roller of the last ("… win the roll-off and take
//     the first turn.", that seat's);
//   - a fight: `unit.face` for the pair, `focus`, the tray (`tray.open`,
//     "<u> fight <tg> · …"), then `melee`, then straight on to its hit row,
//     a `dice` "Hit …" of `n` dice of which `hits` pass (the view's sparks
//     wait PACE.dice(n) for that row); exactly one `melee` before each
//     fight's battle-log line, for the pair the line names and the hits it
//     counts; and after the line (and the lines it shows that were held
//     back) the 0.3 s `pause`;
//   - a charge: the tray ("<u> charge <tg>"), its `dice` "Charge …", the
//     charger's `unit.face`, then `charge.result`, then straight on to the
//     "Failed." or "Contact!" line, which agrees with its `ok`;
//   - a move: its line ("<u> move|advance|fall back <L>\"."), then, past
//     the held-back lines it shows, its `unit.move`, as long as the line
//     says (none for 0.0": under 0.05" nothing walks), with `stomp` set
//     exactly when a wrecker moves more than 0.1"; a charge's walk never
//     stomps. Every walk has `fly` exactly when its unit flies, and goes at
//     7"/s for a move, 11 for a charge. An advance line comes straight
//     after its tray ("<u> — Advance") and its one-die `Advance D6` row,
//     that die its inches;
//   - a shot: its tray ("<u> → <tg> · <weapon>") straight after the
//     shooter's `unit.face` for the pair; a volley straight after that tray
//     and straight on to its hit row of `n` dice, one before each shooting
//     line, for the pair it names; a template's `blast.aim` straight on to
//     its one-die hit row, on a miss the `Scatter D6+1` row straight on to
//     `blast.scatter` from the aim, `d` the die plus one, then `blast.fire`
//     to where it was aimed (a hit) or scattered to, straight on to
//     `blast.land` there, and no template aimed while one is in the air;
//     each `blast.land` (a template's or an eruption's) straight on to its
//     first victim's wound row, or to the 0.25 s `pause` when it caught
//     nobody; the volley and each template thrown by the shooter (the unit
//     that turned to face before the tray), and the volley, the throw and
//     the landing in its weapon's look (`fx`, the view's projectiles and
//     explosions); a cast row straight on to `spell.cast` (it made it) or
//     `spell.fizzle`, a fizzle line straight after its `spell.fizzle`; a
//     cast straight on to `spell.gaze` or to the eruption's line, which
//     comes (past held-back lines) to its `spell.thorns`, straight on to a
//     `blast.land` under them, and `spell.fade` before the action ends; a
//     gaze straight on to its "Mortal wounds D3" row; the mesmerize line
//     straight after `spell.mesmerized`, itself straight after the gaze's
//     `status`, the labels with its target mesmerized (the damage's own
//     `status`, just before, has the target as it was); and no action ends
//     with a volley, a template, thorns or an eruption still owed.
// Over the whole corpus the run fails if it held none of any of these
// kinds (a line whose text changed would match nothing, and the order it
// should hold would go unchecked; nor may the walks of flying units or the
// templates that caught nobody be missing), so it fails on code older than
// R5c, which emits none of the move's and the shot's (and, for the roll-off,
// on code older than R6b). A run on a selection
// (--only) just notes the kinds it held none of: one battle may well have
// no fizzle, no gaze or no eruption.
//
// (F14) And, before the battles, in this process: the page's own player and
// camera rig (view/player.js, view/camera.js, with the view's camera
// handlers) play a corpus battle's first human move, a lone walk, as the
// other seat's page plays an online opponent's: exactly one camera glide
// (toward the walk's end on the opening view, framed as a batch of its ends
// is with the camera zoomed off), one for a watching page, none on the page
// whose seat made it, in hotseat or with 🎥 off; and the AI's first turn
// played one at a time is cued an action at a time, no focus followed on
// its own (followCheck, below). Code older than F14 fails it. The
// self-test's mutations reach only the battles' children, not this case.
//
// (F16) And the courtesy fog: every battle against the AI (the human
// set's) played again on the page with ?fog, the seat played here under
// it. The battle itself must be the corpus's, and the mirror the match at
// every checkpoint, as above (the fog changes nothing the match holds);
// and as each entry closes (its second `fog` event played) what the page
// shows of the other army is held to a fold of its own through the core
// alone, which asks the core's sight over every pair of units as the
// entry leaves the match: every living enemy none of the seat's units
// sees has no figure drawn, no ring, no label, no hit cylinder (no pick),
// no minimap dot and no chip (the Strategic tier's: each unit given a
// place on screen for the asking, as a drawn page has), and every one
// seen has its label and its pick; the ghosts are the fold's (each enemy
// seen once and not now, kept until a stand-in where it stood is seen,
// or it fell in sight) and stand where it fold says, their figures its
// models then standing, each a grey minimap ring; the roster's other army
// is its worth as last seen; and the scenery: every chunk drawn standing
// exactly when the seat's record of it says so, and none kept as last
// seen (its record not the match's) while the fold's core sees it (a
// stand-in at its top centre, as the fog asks). Every battle-log line the page writes from
// the other seat that starts with an enemy's name names one seen as its
// entry opened or closed (else it is hidden, or unnamed: "Unseen"), and
// so does every dice tray's title; a line the fog hid was never written,
// and every other was. The battle over, the fog is lifted. Over the whole
// set the run fails if no enemy was ever hidden, no ghost ever stood or no
// line was ever hidden (the check would hold nothing). The scenery goes
// out of sight in no battle against the AI, so four hotseat battles in
// which it does are played as well, one seat under the fog (the ?debug
// block's view.fogFor: never offered in hotseat); over them some chunk
// must be kept as last seen. Code older than F16 fails it; the self-test's
// mutations leave it out.
//
//   node sim/present-check.mjs [--only ai,hotseat,4242-99] [--ref <ref> | --dir <packageDir>]
//   node sim/present-check.mjs --self-test     each edit in present-hooks.mjs's
//                                              MUTATIONS must fail it
//                              [--mutations a,b]   only these of them
//                              [--only …]          on these battles only
// The self-test first runs the check unmutated on the same battles, and
// stops (exit 1) if that fails: a mutation is only caught when a battle
// fails on the mirror, the act events or the event order, which the code
// as it stands must pass. With --only, an edit the selected battles never
// reach is missed, not caught.
//
// It reads the page through the ?debug block's present.listen, and reads
// its G (project(G) at the game's end; the per-table G of code older than
// R6b as the page loads too), player.mirror (as the page loads, R6b on: the
// backdrop as shown) and player.idle (the ?debug block's contract comment,
// app/boot.js's; main.js's until R7b), none of which sim/oracle uses. One child process per battle, up to one per CPU. Exit 0
// when every battle's mirror is the match at every checkpoint (the
// self-test: when every mutation is caught), 1 otherwise, 2 on bad
// arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, child: { type: 'string' }, 'self-test': { type: 'boolean' }, mutations: { type: 'string' } } }))
} catch (e) {
  console.error(`present-check: ${e.message}\nusage: node sim/present-check.mjs [--only <kinds, modes or ids>] [--ref <ref> | --dir <packageDir>] | --self-test [--mutations <names>] [--only <kinds, modes or ids>]`)
  process.exit(2)
}

if (a.child) await page(a.child)
else if (a['self-test']) await selfTest()
else process.exit(await parent())

// The first place two mirrors differ ('' when they are the same): numbers
// by Object.is, objects by their own keys.
function differ(x, y, path = 'M') {
  if (Object.is(x, y)) return ''
  if (!x || !y || typeof x !== 'object' || typeof y !== 'object' || Array.isArray(x) !== Array.isArray(y)) return `${path}: ${JSON.stringify(x)} | ${JSON.stringify(y)}`
  const kx = Object.keys(x).sort(), ky = Object.keys(y).sort()
  if (kx.join() !== ky.join()) return `${path} keys: ${kx.join()} | ${ky.join()}`
  for (const k of kx) {
    const d = differ(x[k], y[k], `${path}.${k}`)
    if (d) return d
  }
  return ''
}

// (R7b) The card's facts as the table shows them, from the battle folded
// again through the core alone (quiet: G.out null, which plays the same
// battle, P-prop's rule): `start`, every unit's at the battle's start (its
// table: the backdrop, both seats human, dice 0, nothing done, cover where
// it stands); `acts`, every unit's as each `act` line is written (what it
// has done this turn, its cover); `stops`, every unit's where the match
// stops for a decision, after the start and after each entry that leaves
// one pending (its `pending` event, the entry's last: { k, facts }); and
// `first`, the phase a turn begins with, whose phase.start clears its
// seat's deeds (turnBegun).
async function factsFold(dir, job, setup) {
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const { PHASES } = await import(pathToFileURL(join(dir, 'core', 'rules.js')).href)
  // ((V3a) and a charge failed, and the models lost this turn)
  const factsOf = (G) => Object.fromEntries(G.units.map((u) => [u.id, {
    side: u.side, moved: !!u.flags.moved, fellBack: !!u.flags.fellBack, advanced: !!u.flags.advanced, advRoll: u.flags.advRoll,
    shot: !!u.flags.shot, charged: !!u.flags.charged, cover: core.q.inCover(G, u), chargeTried: !!u.flags.chargeTried, lost: u.lost,
  }]))
  // ((F8b) on the battle's own mission, each seat its own army: a Field or
  // Grand table is its own, as app/flow.js's showTable makes it)
  const table = core.createMatch({ board: setup.board, dice: 0, ...(setup.mission ? { mission: setup.mission } : {}), terrain: setup.terrain, seats: setup.seats.map((x) => ({ race: x.race, ctrl: 'human', ...(x.army != null ? { army: x.army } : {}) })) }, { out: null })
  const acts = [], stops = []
  const G = core.createMatch(setup, { out: null, onTrace: (line, g) => line.startsWith('act ') && acts.push(factsOf(g)) })
  const stop = () => G.pending && stops.push({ k: G.pending.k, facts: factsOf(G) })
  stop()
  for (const { s, ...body } of job.entries ?? []) {
    core.apply(G, s, body)
    stop()
  }
  return { start: factsOf(table), acts, stops, first: PHASES[0].key }
}
// a seat's turn begins: its units' deeds cleared, their cover kept, and
// ((V3a) as the match's turn start, core/engine.js's resetTurn) every
// unit's losses forgotten (a copy)
function turnBegun(facts, side) {
  return facts && Object.fromEntries(Object.entries(facts).map(([id, f]) => [id, f.side === side ? { ...f, moved: false, fellBack: false, advanced: false, advRoll: undefined, shot: false, charged: false, chargeTried: false, lost: 0 } : { ...f, lost: 0 }]))
}

// ── One battle, in a child ──────────────────────────────────────────────────
async function page(dir) {
  const { register } = await import('node:module')
  register('./oracle/hooks.mjs', import.meta.url)
  register('./present-hooks.mjs', import.meta.url)
  const { takeFrame } = await import('./oracle/fakedom.mjs')
  const { instrument } = await import('./oracle/shadow.mjs')
  const { humanDriver, jobSetup, pageStart, playedAs } = await import('./oracle/human-bot.mjs')
  const { project, applyEvent } = await import(pathToFileURL(join(dir, 'present', 'mirror.js')).href)
  const job = JSON.parse(readFileSync(0, 'utf8'))
  const setup = jobSetup(job)
  const { mode, query } = pageStart(setup)
  // ((F16) the courtesy fog's run: the battle under ?fog, the seat played
  // here the human one)
  const FOG = !!process.env.PRESENT_FOG
  let ts = null, rec = null
  Object.defineProperty(globalThis, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      rec = instrument(v)
    },
  })
  globalThis.location = { search: `?fast&debug&lowfi&${query}${FOG ? '&fog' : ''}`, hash: '' }
  console.log = console.info = console.debug = console.error
  let fatal = null
  process.on('unhandledRejection', (e) => (fatal ??= e))
  const out = { trace: [], shadow: [], written: [], acts: 0, checks: 0, cards: 0, told: 0, events: 0, kinds: {}, ordered: null, mismatch: null, error: null, fog: null }
  // (R7b) what each unit has done this turn and its cover as the match
  // stood at each `act` line and at each stop, and at the battle's start
  // (its table, the backdrop: both seats human, dice 0): from a quiet fold
  // of the battle through the core alone; null for code before R7b, whose
  // card shows none of it while the table is behind
  const shownFacts = existsSync(join(dir, 'present', 'hud-model.js')) ? await factsFold(dir, job, setup) : null
  // ((V3a) the card's words as code from V3a on words them: with their
  // conditions' icons, a charge failed and a squad's losses told)
  const v3a = existsSync(join(dir, 'present', 'conditions.js'))
  try {
    await import(pathToFileURL(join(dir, 'main.js')).href)
    if (!ts?.present?.listen) throw new Error('main.js offers no ?debug present.listen: code older than R5?')
    // the table is up (main.js built it as it loaded): fold from it (R6b on,
    // no match exists before a start, so from the backdrop as shown; each
    // battle then starts with a reset to its table)
    let M = ts.G ? project(ts.G) : structuredClone(ts.player.mirror)
    // (R7b) the card's record as the page should have it (shownFacts), and
    // the next act line's facts and the next stop's
    let facts = null, nextAct = 0, nextStop = 0
    const miss = (why) => (out.mismatch ??= why)
    // ((F7a) what a ladder costs an inch it climbs, and the measure the move
    // line's sum is made with: the code's own)
    // (code older than either has no climb, and so no use for them)
    const { LADDER_MUL = 2 } = await import(pathToFileURL(join(dir, 'core', 'nav.js')).href).catch(() => ({}))
    const { hypot = Math.hypot } = await import(pathToFileURL(join(dir, 'core', 'dmath.js')).href).catch(() => ({}))
    const order = eventOrder((id) => ts.G.units.find((u) => u.id === id), LADDER_MUL, hypot)
    // ((F16) the fog's own checks, as each entry closes: fogWatch, below)
    const fogSeat = process.env.PRESENT_FOG_SEAT ? Number(process.env.PRESENT_FOG_SEAT) : mode === 'serpent' ? 1 : 0
    const fogW = FOG ? await fogWatch(dir, job, setup, fogSeat, mode !== 'hotseat', () => ts, miss) : null
    if (fogW) out.fog = fogW.stats
    ts.present.listen({
      // a new table: the mirror it is shown from (a copy: the player's own
      // is folded in place)
      reset: (shown) => {
        M = structuredClone(shown)
        order.reset()
        // (the battle's start: the record its table begins with)
        if (shownFacts) (facts = shownFacts.start), (nextAct = 0), (nextStop = 0)
      },
      // (R7b) each event updates the card's record as the page's handler
      // will once the observer has looked: an act to the facts of its act
      // line, a stop (`pending`) to the match's as it stopped there, a
      // seat's first phase clearing its units' deeds
      event: (e, shown) => {
        fogW?.event(e)
        if (shownFacts && e.t === 'phase.start' && e.phase === shownFacts.first) facts = turnBegun(facts, e.side)
        try {
          look(e, shown)
        } finally {
          if (shownFacts && e.t === 'act') facts = shownFacts.acts[nextAct++] ?? null
          if (shownFacts && e.t === 'pending') {
            const st = shownFacts.stops[nextStop++]
            if (st?.k !== e.k) miss(`stop ${nextStop} (after act ${out.acts}): a pending ${e.k} where the quiet fold stopped at ${st ? `a pending ${st.k}` : 'no decision'}`)
            facts = st?.facts ?? null
          }
        }
      },
    })
    // the folded mirror, the player's (`shown`) and the cards, at event e
    function look(e, shown) {
      M = applyEvent(M, e)
      // ((F16) under the fog the trays and lines it unnamed read otherwise:
      // the order is the unfogged run's to hold)
      const o = FOG ? '' : order.event(e)
      if (o) miss(`after act ${out.acts} (trace line ${ts.trace.length}): event order: ${o}`)
      out.events++
      out.kinds[e.t] = (out.kinds[e.t] ?? 0) + 1
      // a walk's smashes: terrain events played inside it (counted with
      // the rest of their kind, and as `smashed` for how many came so)
      for (const { ev } of e.t === 'unit.move' ? e.smashes : []) for (const x of ev) {
        out.kinds[x.t] = (out.kinds[x.t] ?? 0) + 1
        out.kinds.smashed = (out.kinds.smashed ?? 0) + 1
      }
      if (e.t !== 'act' && e.t !== 'check') return
      const where = e.t === 'act' ? `act ${++out.acts} (trace line ${ts.trace.length})` : `check ${++out.checks} (after act ${out.acts}, trace line ${ts.trace.length})`
      if (!e.proj) return miss(`${where}: the ${e.t} event carries no projection (not ?debug?)`)
      const d = differ(M, e.proj)
      if (d) return miss(`${where}: the folded mirror differs from the match: ${d}`)
      const p = differ(shown, e.proj)
      if (p) miss(`${where}: the player's mirror differs from the match: ${p}`)
      // the unit card, every unit's, as the player plays (behind the
      // match): what the mirror holds, and what each unit did this turn
      // and its cover as the last action played left them (R7b; before
      // R7b, none: they read the match, §2.4); (V3a) a fall back's and an
      // advance's icons, a charge failed, and a squad's losses this turn
      if (!ts.present.card) return
      for (const u of ts.G.units) {
        const mu = M.units[u.id], t = u.t, f = facts?.[u.id]
        const want = [
          mu.alive > 0 ? (t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`) : 'destroyed',
          ...(f?.moved ? [f.fellBack ? `${v3a ? '↩ ' : ''}fell back` : f.advanced ? `${v3a ? '💨 ' : ''}advanced +${f.advRoll}"` : `${v3a ? '👣 ' : ''}moved`] : []),
          ...(f?.shot ? [`${v3a ? '➹ ' : ''}shot`] : []),
          ...(f?.charged ? [`${v3a ? '⚡ ' : ''}charged`] : v3a && f?.chargeTried ? ['✖ charge failed'] : []),
          ...(mu.mesmerized ? ['🌀 mesmerized'] : []),
          ...(mu.alive > 0 && mu.engaged ? ['⚔ in combat'] : []),
          ...(mu.alive > 0 && f?.cover ? ['🛡 in cover'] : []),
          ...(v3a && mu.alive > 0 && f?.lost > 0 && t.models > 1 ? [`💔 lost ${f.lost}`] : []),
        ].join(' · ')
        const got = ts.present.card(u)
        out.cards++
        // (how many tell of a deed or of cover: the facts are read)
        if (f && mu.alive > 0 && (f.moved || f.shot || f.charged || f.cover)) out.told++
        if (got !== want) return miss(`${where}: the card of ${t.short} (unit ${u.id}) reads "${got}" while the table is behind, not "${want}" (the mirror's${shownFacts ? `, and the facts as ${nextAct} acts and ${nextStop} stops left them` : ''})`)
      }
    }
    const driver = mode === 'watch' ? null : humanDriver(ts, { entries: job.entries })
    // ((F16) a hotseat battle with one seat under the fog: the ?debug door)
    if (FOG && process.env.PRESENT_FOG_SEAT) ts.view.fogFor(fogSeat)
    ts.start(mode)
    let frames = 0
    while (ts.S.stage !== 'over') {
      if (fatal) throw fatal
      const f = takeFrame()
      if (!f) throw new Error('no frame queued')
      f()
      if (driver) driver.tick()
      if (++frames > 200000) throw new Error(`still at stage ${ts.S.stage} after ${frames} frames`)
      await new Promise((r) => setImmediate(r))
    }
    if (fatal) throw fatal
    // ((F16) the last entry's close looked at, and the fog lifted)
    fogW?.end()
    if (driver?.unused) throw new Error(`the battle ended with ${driver.unused} log entries unplayed`)
    // the battle played was the log's, field for field
    const other = playedAs(ts.G?.setup, setup)
    if (other) throw new Error(other)
    // the end: everything played, the mirror is the match (the round too,
    // R6b on: the old loop left it one past the last, which code before R6b
    // is excused)
    if (!ts.player.idle) out.mismatch ??= 'the battle is over and the player is still playing'
    const old = !('session' in ts)
    const end = { ...project(ts.G), round: old ? null : ts.G.turn.round }, folded = { ...M, round: old ? null : M.round }
    const d = differ(folded, end)
    if (d) out.mismatch ??= `at the game's end: ${d}`
    const lines = ts.trace.filter((l) => l.startsWith('act ')).length
    if (lines !== out.acts) out.mismatch ??= `${lines} act lines in the trace, ${out.acts} act events`
    const o = FOG ? '' : order.end()
    if (o) out.mismatch ??= `at the game's end: event order: ${o}`
    out.ordered = order.seen
  } catch (e) {
    out.error = String(e?.stack ?? e)
  }
  out.trace = ts?.trace.slice() ?? []
  out.shadow = rec?.shadow ?? []
  out.written = rec?.written ?? []
  // (no process.exit: it would cut a piped stdout short)
  process.stdout.write(JSON.stringify(out))
}

// ── (F16) The courtesy fog, held to the core's sight ──────────────────────
// A fold of the battle of its own through the core alone (quiet), an entry
// at a time as the page's Session folds it: as each entry leaves the
// match, the enemy units the seat's living units see (the core's sight,
// every pair), and the ghosts: each enemy seen once and not now, where it
// last stood (as it then stood), gone once it falls in sight (seen as the
// entry opened) or a stand-in where it stood is seen (the unit's type, its
// models in their slots then: the core's sight to it). Then the page,
// played under ?fog, is looked at after each entry's closing `fog` event
// has played (at the next event the player plays, or the end), and its
// battle log and dice tray after each line and tray: event(e) for each
// event, end() at the battle's end. The fold also asks, of each chunk
// changed since the board stood (broken, dropped, added), whether a stand-in
// at its top centre is seen (a fallen log and its tree together), which the
// page's scenery as last seen is held to. `solo`: against the AI (the
// roster lists no unit of the other seat). `ts()` the ?debug block,
// `miss(why)`.
async function fogWatch(dir, job, setup, seat, solo, ts, miss) {
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  const stats = { closes: 0, entries: 0, hidden: 0, ghosts: 0, stale: 0, linesHidden: 0, linesUnseen: 0, linesNamed: 0, trays: 0, looked: 0 }
  const G = core.createMatch(setup, { out: null })
  const sees = (f, b) => core.q.sight(G, f, b, f.pos, false).visible
  const names = new Map()
  for (const u of G.units) for (const n of [u.t.short, u.t.name]) names.set(n, [...(names.get(n) ?? []), u])
  const ref = []
  let seen = new Set(), last = new Map(), board = null
  const point = (x, z, y) => ({ id: -1, side: -1, t: { chest: y - core.q.floorAt(G, x, z), eye: 0, models: 1 }, pos: { x, z }, r: 0, models: [{ alive: true, w: 1, ox: 0, oz: 0 }] })
  const fold = () => {
    const mine = G.units.filter((u) => u.side === seat && u.alive > 0), foes = G.units.filter((u) => u.side !== seat)
    // the chunks changed since the board stood (after the start), and
    // which of them the seat's units see the top of
    board ??= new Map(G.terrain.chunks.map((c) => [c.id, { alive: c.alive, y: c.shape.y }]))
    const byId = new Map(G.terrain.chunks.map((c) => [c.id, c]))
    const changed = G.terrain.chunks.filter((c) => !board.has(c.id) || board.get(c.id).alive !== c.alive || board.get(c.id).y !== c.shape.y)
    const chunks = new Set(changed.filter((c) => mine.some((f) => sees(f, point(c.shape.x, c.shape.z, c.shape.y + c.shape.hy + 0.1)))).map((c) => c.id))
    for (const c of changed) {
      const t = c.look?.piece === 'fallen' ? c.look.tree : undefined
      if (t !== undefined && byId.has(t) && (chunks.has(c.id) || chunks.has(t))) chunks.add(c.id).add(t)
    }
    const now = new Set(foes.filter((e) => e.alive > 0 && mine.some((f) => core.q.sight(G, f, e).visible)).map((e) => e.id))
    for (const e of foes) {
      if (now.has(e.id)) last.set(e.id, { x: e.pos.x, z: e.pos.z, r: e.r, models: e.models.map((m) => ({ ...m })) })
      else if (!(e.alive > 0) && seen.has(e.id)) last.delete(e.id)
      else if (last.has(e.id)) {
        const r = last.get(e.id)
        if (r.models.some((m) => m.alive) && mine.some((f) => sees(f, { id: e.id, side: e.side, t: e.t, pos: { x: r.x, z: r.z }, r: r.r, models: r.models }))) last.delete(e.id)
      }
    }
    ref.push({ seen: now, V: new Set([...seen, ...now]), alive: new Set(foes.filter((e) => e.alive > 0).map((e) => e.id)), ghosts: new Map([...last].filter(([id]) => !now.has(id))), chunks, over: G.turn.stage === 'over' })
    seen = now
  }
  fold()
  for (const { s, ...body } of job.entries ?? []) {
    core.apply(G, s, body)
    fold()
  }
  const foe = (id) => G.units.find((u) => u.id === id)?.side !== seat
  // the name a line or a tray title starts with, and whether it names an
  // enemy seen as entry k opened or closed (true for a name no enemy has)
  const lineName = (html) => /^<b>(.*?)<\/b>/.exec(html ?? '')?.[1] ?? null
  const trayName = (title) => String(title ?? '').split(/ → | fight | charge | — |: /)[0].trim()
  const namedSeen = (name, k) => {
    const of = (names.get(name) ?? []).filter((u) => u.side !== seat)
    return !of.length || of.some((u) => ref[k]?.V.has(u.id))
  }
  let k = -1, due = null, line = null, tray = null
  const look = (at) => {
    const t = ts(), f = t.view.fog(), r = ref[at], rc = r
    stats.looked++
    if (!f) return miss(`(F16) entry ${at}: the page keeps no fog`)
    if (!r) return miss(`(F16) entry ${at}: the page closed more entries than the battle has (${ref.length})`)
    if (r.over) {
      if (f.shown || !f.over) miss(`(F16) entry ${at}: the battle is over and the fog not lifted (${JSON.stringify(f.shown)})`)
      return
    }
    const hide = new Set((f.shown?.hide ?? []).filter((id) => r.alive.has(id)))
    const want = [...r.alive].filter((id) => !r.seen.has(id))
    stats.hidden += want.length
    if ([...hide].sort().join() !== want.sort().join()) return miss(`(F16) entry ${at}: the page hides enemies ${[...hide].sort().join()}, the core's sight leaves unseen ${want.join()}`)
    for (const u of f.units) {
      if (!foe(u.id) || !r.alive.has(u.id)) continue
      const hid = !r.seen.has(u.id)
      if (hid && (u.figures || u.ring || u.label || u.hit || u.picked)) return miss(`(F16) entry ${at}: unit ${u.id}, unseen, is drawn (${JSON.stringify(u)})`)
      if (!hid && (!u.label || !u.picked || !u.figures)) return miss(`(F16) entry ${at}: unit ${u.id}, seen, is not drawn (${JSON.stringify(u)})`)
    }
    const dots = new Map(f.dots.map((d) => [`${d.id}${d.ghost ? 'g' : ''}`, d]))
    for (const id of want) if (dots.has(`${id}`)) return miss(`(F16) entry ${at}: unit ${id}, unseen, has a minimap dot`)
    for (const id of f.chips) if (want.includes(id)) return miss(`(F16) entry ${at}: unit ${id}, unseen, has a chip`)
    // the ghosts
    const ghosts = new Map(f.ghosts.map((g) => [g.id, g]))
    stats.ghosts += r.ghosts.size
    if ([...ghosts.keys()].sort().join() !== [...r.ghosts.keys()].sort().join()) return miss(`(F16) entry ${at}: the page's ghosts are ${[...ghosts.keys()].sort().join()}, the fold's ${[...r.ghosts.keys()].sort().join()}`)
    for (const [id, g] of r.ghosts) {
      const p = ghosts.get(id), standing = g.models.filter((m) => m.alive).length
      if (p.x !== g.x || p.z !== g.z || p.figures !== standing) return miss(`(F16) entry ${at}: unit ${id}'s ghost stands at (${p.x}, ${p.z}) with ${p.figures} figures, not where it was last seen, (${g.x}, ${g.z}) with ${standing}`)
      if (!dots.has(`${id}g`)) return miss(`(F16) entry ${at}: unit ${id}'s ghost has no minimap ring`)
    }
    // the roster: the other army as last seen (against the AI, none of its
    // units listed)
    const other = 1 - seat
    if (!f.roster.fogged?.[other] || (solo && f.roster.rows.some((row) => foe(row.id)))) return miss(`(F16) entry ${at}: the roster doesn't show the other army as last seen (${JSON.stringify(f.roster)})`)
    // the scenery: drawn as the seat's record has it, and none kept as last
    // seen while the core sees it
    if (!f.table) return miss(`(F16) entry ${at}: the page keeps no record of the scenery`)
    const rec = new Map(f.table.map(([id, alive, y]) => [id, { alive, y }])), drawn = new Set(f.drawn), M = t.player.mirror
    for (const key of Object.keys(M.chunks)) {
      const id = Number(key), r = rec.get(id), c = M.chunks[key]
      if (drawn.has(id) !== !!r?.alive) return miss(`(F16) entry ${at}: chunk ${id} is ${drawn.has(id) ? '' : 'not '}drawn standing, its record ${r ? `${r.alive ? 'standing' : 'broken'}` : 'never seen'}`)
      if (r && r.alive === c.alive && r.y === c.y) continue
      stats.stale++
      if (rc.chunks.has(id)) return miss(`(F16) entry ${at}: chunk ${id} is kept as last seen (${r ? JSON.stringify(r) : 'never seen'}; the match's ${JSON.stringify(c)}) though the seat's units see its top`)
    }
  }
  // a line just played: written as the fog marked it, and a name it starts
  // with seen
  const lookLine = ({ e, top, at }) => {
    const list = globalThis.document.querySelector('#logList'), now = list.children[0]
    if (e.veil === 'hide') {
      stats.linesHidden++
      if (now !== top) miss(`(F16) entry ${at}: a line the fog hid was written ("${e.html}")`)
      return
    }
    if (now === top || now?.innerHTML !== e.html) return miss(`(F16) entry ${at}: a line the fog showed wasn't written as marked ("${e.html}" | "${now?.innerHTML}")`)
    if (e.side === seat || e.side < 0) return
    const name = lineName(e.html)
    if (name === 'Unseen') return void stats.linesUnseen++
    if (name && (names.get(name) ?? []).some((u) => u.side !== seat)) {
      stats.linesNamed++
      if (!namedSeen(name, at)) miss(`(F16) entry ${at}: the line "${e.html}" names ${name}, none of whom the seat saw as its entry opened or closed`)
    }
  }
  // (a tray a batch plays opens its own, never the event's: written only
  // when the tray's title changed)
  const lookTray = ({ e, top, at }) => {
    const now = globalThis.document.querySelector('#tray').children[0]
    if (now === top) return
    if (e.veil === 'hide') return miss(`(F16) entry ${at}: a tray the fog hid was opened ("${e.title}")`)
    stats.trays++
    if (now?.textContent !== e.title) return miss(`(F16) entry ${at}: the tray reads "${now?.textContent}", not "${e.title}" as the fog marked it`)
    const name = trayName(e.title)
    if (name !== 'Unseen' && !namedSeen(name, at)) miss(`(F16) entry ${at}: the tray "${e.title}" names ${name}, none of whom the seat saw as its entry opened or closed`)
  }
  const settle = () => {
    if (due !== null) look(due)
    if (line) lookLine(line)
    if (tray) lookTray(tray)
    due = line = tray = null
  }
  return {
    stats,
    event(e) {
      settle()
      if (e.t === 'fog' && e.at === 'open') k++
      if (e.t === 'fog' && e.at === 'close') {
        stats.closes++
        due = k
      }
      if (e.t === 'log') line = { e, top: globalThis.document.querySelector('#logList').children[0], at: k }
      if (e.t === 'tray.open') tray = { e, top: globalThis.document.querySelector('#tray').children[0], at: k }
    },
    end() {
      settle()
      stats.entries = ref.length
      if (stats.closes !== ref.length) miss(`(F16) the page closed ${stats.closes} entries under the fog, the battle has ${ref.length}`)
      const f = ts().view.fog()
      if (f?.shown || !f?.over) miss(`(F16) the battle is over, and the fog not lifted`)
    },
  }
}

// The actions' own events in their order (the header's list), from each
// event as the player plays it: event(e) returns why it is out of order (''
// when it is not), end() why the battle ended with a melee whose fight line
// never came; `seen` counts the lines held to their events, by kind.
// `unitOf(id)` is the unit (its short name is how the trays and the battle
// log name it; its type says whether it is a wrecker, whether it flies and
// its weapon's look). (F7a) `ladderMul`: a climb's cost an inch of height
// (core/nav.js's LADDER_MUL): with height a move's line says what the walk
// cost, each climb (a path point marked `climb`) at its link's cost, not
// the ground its segment spans, which is the walk's L (the view's).
function eventOrder(unitOf, ladderMul = 2, hypot = Math.hypot) {
  const nameOf = (id) => unitOf(id)?.t.short
  let p1, p2, p3, melee, melees, pause, moving, vol, tmpl, thorns, casting, shot, roll
  // how many lines (or templates, or walks) of each kind were held to their
  // events: `flights` the walks of units that fly, `beats` the templates
  // that caught nobody
  const seen = { rolloffs: 0, fights: 0, charges: 0, moves: 0, advances: 0, flights: 0, volleys: 0, templates: 0, scatters: 0, beats: 0, eruptions: 0, fizzles: 0, gazes: 0, kegs: 0 }
  const reset = () => {
    p1 = p2 = p3 = melee = moving = vol = tmpl = thorns = casting = shot = roll = null
    melees = 0
    pause = false
  }
  reset()
  const pair = (e) => `${nameOf(e.u)} → ${nameOf(e.tg)}`
  const same = (a, b) => a?.u === b.u && a?.tg === b.tg
  // (core/rules.js passes: a die passes at `need` or more)
  const passes = (dice, need) => dice.filter((d) => d >= need).length
  const text = (html) => html.replace(/<[^>]+>/g, '')
  const at = (a, b) => a?.x === b?.x && a?.z === b?.z
  const event = (e) => {
    let why = ''
    const held = e.t === 'log' && !e.traced
    // ── the roll-off: its tray after the battle's stage and flags, its rows
    // in pairs until one isn't a tie, then the line naming the winner ──
    if (e.t === 'tray.open' && e.title === 'Roll-off for the first turn') {
      if (!(p2?.t === 'stage' && p2.stage === 'battle' && p1?.t === 'objectives')) why ||= `the roll-off's tray not straight after the battle's stage and its flags (${[p2, p1].map((x) => x?.t).join(', ')})`
      roll = { rows: [], won: -1 }
    } else if (roll) {
      const rows = () => roll.rows.map((r) => r.dice.join('')).join(' ')
      if (e.t === 'dice' && roll.won < 0) {
        const k = roll.rows.push(e)
        if (e.dice.length !== 1 || (k > 2 && e.label !== roll.rows[(k - 1) % 2].label)) why ||= `a roll-off row "${e.label}" of ${e.dice.length} dice, not one die for seat ${(k - 1) % 2} as the first pair had it`
        const [a, b] = roll.rows.slice(-2)
        if (k % 2 === 0 && a.dice[0] !== b.dice[0]) roll.won = a.dice[0] > b.dice[0] ? 0 : 1
      } else {
        const line = e.t === 'log' && e.traced && / win the roll-off and take the first turn\.$/.test(text(e.html))
        if (roll.won < 0 || !line || e.side !== roll.won) {
          why ||= `the roll-off (rows ${rows() || 'none'}) not followed straight by the line naming ${roll.won < 0 ? 'a winner (no pair decided it)' : `its winner, seat ${roll.won}`} (${e.t}${e.t === 'log' ? ` "${text(e.html)}" of seat ${e.side}` : e.label ? ` "${e.label}"` : ''})`
        } else seen.rolloffs++
        roll = null
      }
    }
    // ── the shot's: what must come straight after an event ──
    if (p1?.t === 'volley' && !(e.t === 'dice' && /^Hit \d\+$/.test(e.label) && e.dice.length === p1.n)) {
      why ||= `a volley (${pair(p1)}, ${p1.n} shots) not followed straight by its hit row (${e.t}${e.label ? ` "${e.label}"` : ''})`
    }
    if (p1?.t === 'blast.aim' && !(e.t === 'dice' && /^(Template \d+: h|H)it \d\+$/.test(e.label) && e.dice.length === 1)) {
      why ||= `a template aimed and not followed straight by its hit roll (${e.t}${e.label ? ` "${e.label}"` : ''})`
    }
    if (p1?.t === 'dice' && p1.label === 'Scatter D6+1' && !(e.t === 'blast.scatter' && e.d === p1.dice[0] + 1 && at(e.from, tmpl?.aim))) {
      why ||= `a scatter roll (${p1.dice[0]} + 1) not followed straight by the template's scatter from its aim (${e.t}${e.t === 'blast.scatter' ? ` ${e.d}"` : ''})`
    }
    if (p1?.t === 'blast.fire' && !(e.t === 'blast.land' && at(e, p1.to))) why ||= `a template thrown and not landing straight after, where it was thrown (${e.t})`
    if (p1?.t === 'spell.thorns' && !(e.t === 'blast.land' && at(e, p1) && e.r === p1.r)) why ||= `thorns erupting with no template landing straight after, under them (${e.t})`
    // ((F19a) a powder keg set off: straight after its line, and its blast
    // landing straight after it, where it stood, in the keg's look)
    if (p1?.t === 'keg.fuse' && !(e.t === 'blast.land' && at(e, p1) && e.fx === 'keg')) why ||= `a powder keg set off at (${p1.x}, ${p1.z}) with no blast of its own landing straight after, there (${e.t}${e.t === 'blast.land' ? ` at (${e.x}, ${e.z}) in the look ${e.fx}` : ''})`
    if (e.t === 'keg.fuse' && !(p1?.t === 'log' && p1.traced && text(p1.html) === 'The powder keg goes up!')) why ||= `a powder keg set off at (${e.x}, ${e.z}) not straight after its line (${p1?.t}${p1?.t === 'log' ? ` "${text(p1.html)}"` : ''})`
    // a landing: straight on to its first victim's wound row, or the beat
    // when it caught nobody
    if (p1?.t === 'blast.land' && !(e.t === 'dice' && /: \d+ hits? · wound \d\+$/.test(e.label)) && !(e.t === 'pause' && e.s === 0.25)) {
      why ||= `a template landing not followed straight by a victim's wound row or the 0.25 s pause (${e.t}${e.t === 'pause' ? ` ${e.s} s` : e.label ? ` "${e.label}"` : ''})`
    }
    if (p1?.t === 'blast.land' && e.t === 'pause') seen.beats++
    if (p1?.t === 'dice' && /^Cast \d+\+ \(2D6\)$/.test(p1.label) && e.t !== (p1.pass ? 'spell.cast' : 'spell.fizzle')) {
      why ||= `a cast roll that ${p1.pass ? 'made' : 'missed'} it not followed straight by spell.${p1.pass ? 'cast' : 'fizzle'} (${e.t})`
    }
    if (p1?.t === 'spell.cast' && !(e.t === 'spell.gaze' || (e.t === 'log' && e.traced && / casts <b>/.test(e.html)))) why ||= `a spell cast and followed by neither its gaze nor its eruption's line (${e.t})`
    if (p1?.t === 'spell.gaze' && !(e.t === 'dice' && e.label === 'Mortal wounds D3')) why ||= `a gaze not followed straight by its D3 (${e.t})`
    // an eruption's line, then (past the held-back lines it shows) the thorns
    if (casting && !held) {
      if (!(e.t === 'spell.thorns' && nameOf(e.u) === casting)) why ||= `${casting}'s eruption line not followed by its thorns (${e.t})`
      casting = null
    }
    // ── the shot's: what must have come before ──
    if (e.t === 'tray.open' && / → .* · /.test(e.title)) {
      if (!(p1?.t === 'unit.face' && e.title.startsWith(`${nameOf(p1.u)} → ${nameOf(p1.tg)} · `))) why ||= `a shot's tray ("${e.title}") not straight after the shooter's turn to face its target (${p1?.t})`
      // (the shooter, by id: who throws, and whose weapon's look it is)
      shot = p1?.t === 'unit.face' ? p1.u : null
    }
    if ((e.t === 'volley' || e.t === 'blast.fire') && e.u !== shot) why ||= `${e.t} by ${nameOf(e.u)}, not by the shooter (${nameOf(shot)})`
    // ((F19a) but a powder keg's blast, in the keg's own look, whoever set
    // it off)
    if ((e.t === 'volley' || e.t === 'blast.fire' || e.t === 'blast.land') && !(e.t === 'blast.land' && p1?.t === 'keg.fuse')) {
      const look = unitOf(shot)?.t.ranged?.fx
      if (e.fx !== look) why ||= `${e.t} in the look ${e.fx}, not the shooter's weapon's (${look})`
    }
    if (e.t === 'volley') {
      if (vol) why ||= `a volley (${pair(e)}) while another's line has not come (${pair(vol)})`
      if (!(p1?.t === 'tray.open' && p1.title.startsWith(`${nameOf(e.u)} → ${nameOf(e.tg)} · `))) why ||= `a volley (${pair(e)}) not straight after its tray (${p1?.t})`
      vol = e
    }
    if (e.t === 'blast.aim') {
      if (tmpl) why ||= 'a template aimed while the last is still in the air'
      tmpl = { aim: { x: e.x, z: e.z }, r: e.r }
    }
    if (e.t === 'dice' && tmpl && !tmpl.rolled) {
      tmpl.rolled = true
      tmpl.hit = e.dice[0] >= e.need
    }
    if (e.t === 'blast.scatter') {
      if (!tmpl || tmpl.hit !== false || tmpl.land) why ||= `a scatter (${e.d}") with no missed template to scatter`
      else tmpl.land = e.to
    }
    if (e.t === 'blast.fire') {
      const land = tmpl && (tmpl.hit ? tmpl.aim : tmpl.land)
      if (!land) why ||= `a template thrown (by ${nameOf(e.u)}) that was never ${tmpl ? 'scattered' : 'aimed'}`
      else if (!at(e.to, land)) why ||= `a template thrown to (${e.to.x}, ${e.to.z}), not where it ${tmpl.hit ? 'was aimed' : 'scattered to'}`
    }
    if (e.t === 'blast.land') {
      if (p1?.t === 'blast.fire') {
        seen.templates++
        if (tmpl?.land) seen.scatters++
        tmpl = null
      } else if (p1?.t === 'keg.fuse') seen.kegs++
      else if (p1?.t !== 'spell.thorns') why ||= `a template landing that was neither thrown, erupted nor a powder keg's (after ${p1?.t})`
    }
    if (e.t === 'spell.thorns') thorns = e
    if (e.t === 'spell.fade') {
      if (thorns?.u !== e.u) why ||= `${nameOf(e.u)}'s spell fades with no thorns of its standing`
      thorns = null
    }
    // (the gaze's own status, after `mesmerized` was set: the damage's
    // before it, which also ends in a status, has the target as it was)
    if (e.t === 'spell.mesmerized' && !(p1?.t === 'status' && p1.mesmerized.includes(e.tg))) {
      why ||= `${pair(e)}: mesmerized with no status straight before that has ${nameOf(e.tg)} mesmerized (${p1?.t}${p1?.t === 'status' ? ` of [${p1.mesmerized.map(nameOf).join(', ')}]` : ''})`
    }
    if (e.t === 'act' && (vol || tmpl || thorns || casting)) {
      why ||= `an action ended with ${vol ? `a volley's line (${pair(vol)})` : tmpl ? 'a template' : thorns ? "an eruption's thorns to fade" : "an eruption's thorns"} still to come`
      vol = tmpl = thorns = casting = null
    }
    if (e.t === 'act') shot = null
    if (p1?.t === 'melee' && !(e.t === 'dice' && /^Hit /.test(e.label) && e.dice.length === p1.n && passes(e.dice, e.need) === p1.hits)) {
      why = `a melee (${pair(p1)}, ${p1.n} attacks, ${p1.hits} hits) not followed straight by its hit row (${e.t}${e.label ? ` "${e.label}"` : ''})`
    }
    // the beat after a fight: once its line and the held-back lines it shows
    if (pause && !(e.t === 'log' && !e.traced)) {
      if (!(e.t === 'pause' && e.s === 0.3)) why ||= `a fight's line not followed by its 0.3 s pause (${e.t})`
      pause = false
    }
    if (e.t === 'melee') {
      melee = e
      melees++
      if (!(p3?.t === 'unit.face' && same(p3, e) && p2?.t === 'focus' && p1?.t === 'tray.open' && p1.title.startsWith(`${nameOf(e.u)} fight ${nameOf(e.tg)} · `))) {
        why ||= `a melee (${pair(e)}) not straight after its fighter's turn to face, the camera and the tray (${[p3, p2, p1].map((x) => x?.t).join(', ')})`
      }
    }
    if (e.t === 'charge.result' && !(p1?.t === 'unit.face' && same(p1, e) && p2?.t === 'dice' && /^Charge /.test(p2.label) && p3?.t === 'tray.open' && p3.title === `${nameOf(e.u)} charge ${nameOf(e.tg)}`)) {
      why ||= `a charge's result (${pair(e)}) not straight after its tray, its roll and the charger's turn to face (${[p3, p2, p1].map((x) => x?.t).join(', ')})`
    }
    // a walk: a move's straight after its line (past the held-back lines it
    // shows), as long as the line says, stomping off when a wrecker goes
    // more than 0.1"; a charge's never stomps
    if (e.t === 'unit.move') {
      const mv = moving
      // (F7a: with a climb, what the walk cost)
      const cost = e.path.some((p) => p.climb) ? e.path.reduce((L, p, i) => (i ? L + (p.climb ? ladderMul * Math.abs(p.y - e.path[i - 1].y) : hypot(p.x - e.path[i - 1].x, p.z - e.path[i - 1].z)) : 0), 0) : e.L
      if (mv && (nameOf(e.u) !== mv.name || cost.toFixed(1) !== mv.len)) why ||= `the move line "${mv.text}" followed by another walk (${nameOf(e.u)}, ${cost.toFixed(1)}"${cost !== e.L ? `, ${e.L.toFixed(1)}" over the ground` : ''})`
      const stomp = !!mv && !!unitOf(e.u)?.t.wrecker && e.L > 0.1
      if (e.stomp !== stomp) why ||= `${nameOf(e.u)}'s walk of ${e.L.toFixed(2)}" (${mv ? 'a move' : 'not a move'}) has stomp ${e.stomp}, not ${stomp}`
      // flying exactly when its unit flies; a move's pace, or a charge's
      const fly = unitOf(e.u)?.t.move === 'fly'
      if (e.fly !== fly) why ||= `${nameOf(e.u)}'s walk has fly ${e.fly}, not ${fly}`
      if (fly) seen.flights++
      const speed = mv ? 7 : 11
      if (e.speed !== speed) why ||= `${nameOf(e.u)}'s walk (${mv ? 'a move' : 'not a move'}) goes at ${e.speed}"/s, not ${speed}`
      moving = null
    } else if (moving && !(e.t === 'log' && !e.traced)) {
      // (a line of 0.0" walks nowhere: under 0.05" nothing moves)
      if (moving.len !== '0.0') why ||= `the move line "${moving.text}" not followed by its walk (${e.t})`
      moving = null
    }
    if (e.t === 'log' && e.traced) {
      const f = /^<b>([^<]*)<\/b> fight ([^:]*): (\d+) hit/.exec(e.html)
      if (f) {
        if (melees !== 1 || nameOf(melee.u) !== f[1] || nameOf(melee.tg) !== f[2] || melee.hits !== Number(f[3])) {
          why ||= `the fight line "${text(e.html)}" after ${melees} melee event(s) since the last${melee ? ` (the last ${pair(melee)}, ${melee.hits} hits)` : ''}`
        }
        melee = null
        melees = 0
        pause = true
        seen.fights++
      }
      const c = /^<b>([^<]*)<\/b> charge (.*) — roll \d+.*(Failed\.|Contact!)/.exec(e.html)
      if (c && !(p1?.t === 'charge.result' && p1.ok === (c[3] === 'Contact!') && nameOf(p1.u) === c[1] && nameOf(p1.tg) === c[2])) {
        why ||= `the charge line "${text(e.html)}" not straight after its charge.result (${p1?.t}${p1?.t === 'charge.result' ? ` ${pair(p1)}, ok ${p1.ok}` : ''})`
      }
      if (c) seen.charges++
      const m = /^<b>([^<]*)<\/b> (move|advance|fall back) (\d+\.\d)"\.$/.exec(e.html)
      if (m) {
        moving = { name: m[1], len: m[3], text: text(e.html) }
        seen.moves++
      }
      // an advance: its tray, its roll, then straight on to its line
      const adv = /^<b>([^<]*)<\/b> advance: \+(\d)"\.$/.exec(e.html)
      if (adv && !(p1?.t === 'dice' && p1.label === 'Advance D6' && p1.dice.length === 1 && p1.dice[0] === Number(adv[2]) && p2?.t === 'tray.open' && p2.title === `${adv[1]} — Advance`)) {
        why ||= `the advance line "${text(e.html)}" not straight after its tray and its roll (${[p2, p1].map((x) => x?.t).join(', ')})`
      }
      if (adv) seen.advances++
      // the shot's lines, each after what it reports
      const v = /^<b>([^<]*)<\/b> shoot ([^:]*): (\d+) hit/.exec(e.html)
      if (v) {
        if (!vol || nameOf(vol.u) !== v[1] || nameOf(vol.tg) !== v[2]) why ||= `the shooting line "${text(e.html)}" with no volley of its own before it${vol ? ` (the last ${pair(vol)})` : ''}`
        vol = null
        seen.volleys++
      }
      const fz = /^<b>([^<]*)<\/b> tries .* — it fizzles/.exec(e.html)
      if (fz && !(p1?.t === 'spell.fizzle' && nameOf(p1.u) === fz[1])) why ||= `the fizzle line "${text(e.html)}" not straight after its spell.fizzle (${p1?.t})`
      if (fz) seen.fizzles++
      const ca = /^<b>([^<]*)<\/b> casts <b>/.exec(e.html)
      if (ca) {
        if (!(p1?.t === 'spell.cast' && nameOf(p1.u) === ca[1])) why ||= `the eruption line "${text(e.html)}" not straight after its spell.cast (${p1?.t})`
        casting = ca[1]
        seen.eruptions++
      }
      const mz = /^<b>([^<]*)<\/b> mesmerizes ([^:]*):/.exec(e.html)
      if (mz && !(p1?.t === 'spell.mesmerized' && nameOf(p1.u) === mz[1] && nameOf(p1.tg) === mz[2])) why ||= `the mesmerize line "${text(e.html)}" not straight after its spell.mesmerized (${p1?.t})`
      if (mz) seen.gazes++
    }
    p3 = p2
    p2 = p1
    p1 = e
    return why
  }
  const end = () => (melees ? `${melees} melee event(s) with no fight line after them` : roll ? 'a roll-off with no line naming its winner' : '')
  return { event, reset, end, seen }
}

function child(dir, job, env = process.env) {
  const self = fileURLToPath(import.meta.url)
  return new Promise((done) => {
    const p = spawn(process.execPath, [self, '--child', dir], { stdio: ['pipe', 'pipe', 'pipe'], env })
    let out = '', err = ''
    // decoded as a stream: a character split across two chunks stays whole
    p.stdout.setEncoding('utf8')
    p.stderr.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      try {
        done(JSON.parse(out))
      } catch {
        done({ error: `child exited ${code}: ${err.trim().split('\n').slice(0, 4).join(' | ')}` })
      }
    })
    p.stdin.end(JSON.stringify(job))
  })
}

// ── (F14) The camera follows a human opponent's lone move ──────────────────
// The page's own player (view/player.js) and camera (view/camera.js), made
// here in Node over a stand-in canvas (as sim/camera-check.mjs makes the
// rig), with the view's camera handlers (view/index.js's focus and cue) and
// the flow's frame (app/flow.js's: the rig's frame). A corpus battle's first
// human move on classic (a lone walk: no batch takes it) is played as the
// page of the other seat plays an online opponent's, from the table as it
// stood before it: the camera glides exactly once as it plays (toward its
// end, the battle's opening view taking it in; framed, as a batch of its two
// ends is, with the camera zoomed off elsewhere), and once for a watching
// page; not at all on the page whose seat made it, in hotseat, or with 🎥
// off; and the move is cued once on every page. Then the AI's turn the same
// battle opens with, played one at a time (⇉ off): each action is cued
// once and no focus event is followed on its own (one move of the camera an
// action at most). Returns { ok, lines }.
async function followCheck(dir) {
  const imp = (f) => import(pathToFileURL(join(dir, f)).href)
  const { loadCorpus } = await import('./lib.mjs')
  const lines = []
  let bad = 0
  const check = (ok, what, why = '') => {
    if (!ok) bad++
    lines.push(`  (F14) ${ok ? 'ok  ' : 'FAIL'} ${what}${!ok && why ? `: ${why}` : ''}`)
  }
  const presets = await imp('present/camera-presets.js')
  if (!presets.cueAt) return { ok: false, lines: ['  (F14) FAIL code older than F14: present/camera-presets.js cues no action, so a human opponent\'s lone move moves no camera'] }
  // (a page's globals, enough for the rig and its controls; put back after)
  const keep = Object.fromEntries(['addEventListener', 'removeEventListener', 'document', 'innerWidth', 'innerHeight'].map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]))
  const listen = { addEventListener() {}, removeEventListener() {} }
  Object.assign(globalThis, { addEventListener() {}, removeEventListener() {}, document: listen, innerWidth: 1280, innerHeight: 800 })
  try {
    const canvas = { ...listen, style: {}, ownerDocument: listen, getRootNode: () => listen, clientHeight: 800, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 800 }) }
    const core = await imp('core/index.js')
    const { edgeOf } = await imp('core/match.js')
    const { project } = await imp('present/mirror.js')
    const { CameraRig } = await imp('view/camera.js')
    const { View } = await imp('view/index.js')
    const { EventPlayer } = await imp('view/player.js')
    const { stepTweens, wait } = await imp('view/clock.js')
    const { viewsFor, framePose, circleOf } = presets
    // the battle: a human seat 0 against the AI on classic, with a move
    const job = loadCorpus().items.map((it) => it.job).find((j) => j.setup?.seats?.[0]?.ctrl === 'human' && j.setup.seats[1]?.ctrl === 'ai' && !j.setup.mission && j.entries?.some((e) => e.t === 'move'))
    if (!job) return { ok: false, lines: ['  (F14) FAIL the corpus has no classic battle of a human seat 0 against the AI with a move'] }
    // folded an entry at a time: the table before the AI's first turn (the
    // entry that hands it over) and before the first move, and their events
    const G = core.createMatch(job.setup, { out: [] })
    G.out.length = 0
    let turn = null, move = null
    for (const { s, ...body } of job.entries) {
      const M = project(G)
      core.apply(G, s, body)
      const events = G.out.splice(0)
      if (!turn && events.some((e) => e.t === 'focus')) turn = { M, events }
      if (body.t === 'move' && events.some((e) => e.t === 'unit.move')) {
        move = { M, events, walk: events.find((e) => e.t === 'unit.move') }
        break
      }
    }
    if (!move) return { ok: false, lines: ['  (F14) FAIL the battle has no walk in a move entry'] }
    const mover = G.units.find((u) => u.id === move.walk.u).side
    const ends = [move.M.units[move.walk.u].pos, move.walk.to].map((p) => ({ x: p.x, z: p.z }))
    const settle = (rig) => {
      for (let i = 0; i < 30; i++) stepTweens(0.1)
      for (let i = 0; i < 5; i++) rig.update(0)
    }
    // a page playing `localSeats` (the rig at the battle's opening view, then
    // `ready(rig)`), handed `events` from the table `M`: how many times the
    // follow policy moved its camera, its pose before and after, how many
    // actions were cued and focus events followed on their own
    const play = async ({ localSeats, M, events, ready = () => {}, batched = true }) => {
      const rig = new CameraRig({ domElement: canvas })
      rig.setBoard(G.board)
      rig.setViews(viewsFor({ localSeats, edges: [0, 1].map((s) => edgeOf(G, s)) }))
      settle(rig)
      ready(rig)
      settle(rig)
      const vh = View.prototype.handlers.call({ rig, units: {}, shots: {}, terrain: {} }, { localSeats: () => localSeats })
      let focused = 0
      const handlers = {
        focus: (e, m) => (focused++, vh.focus(e, m)),
        cue: vh.cue,
        frame: (e, m) => rig.frame(e.points, { stage: m.stage, active: m.active, localSeats }),
        'unit.move': (e) => wait((e.L ?? 0) / (e.speed || 6) + 0.15),
        fallback: () => {},
      }
      const player = new EventPlayer({ handlers, mirror: structuredClone(M), sideOf: (u) => G.units.find((x) => x.id === u)?.side })
      player.batched = batched
      const f0 = rig.followed, before = rig.pose(), wasOff = rig.offScreen(ends)
      player.push(events)
      for (let i = 0; i < 5000 && !(player.idle && i > 2); i++) {
        await new Promise((r) => setTimeout(r, 0))
        stepTweens(0.1)
        rig.update(0)
      }
      settle(rig)
      return { glides: rig.followed - f0, before, after: rig.pose(), wasOff, cues: player.cues, focused, idle: player.idle, rig }
    }
    const close = (a, b) => a.every((x, i) => Math.abs(x - b[i]) <= 1e-6)
    const other = 1 - mover
    // the other seat's page, at the battle's opening view: the walk on
    // screen, its end more than 6" from where the camera looks
    {
      const r = await play({ localSeats: [other], ...move })
      const t = r.before.target, to = move.walk.to
      const far = Math.hypot(to.x - t[0], to.z - t[2]) >= 6 && !r.wasOff
      check(far, `the case: seat ${mover}'s move ends ${Math.hypot(to.x - t[0], to.z - t[2]).toFixed(1)}" from where seat ${other}'s opening view looks, on screen`)
      check(r.idle && r.cues === 1 && r.glides === 1, `seat ${other}'s page (an online opponent's): seat ${mover}'s lone move glides its camera once`, `${r.glides} glides, ${r.cues} cues, idle ${r.idle}`)
      const want = [t[0] + (to.x - t[0]) * 0.6, 0, t[2] + (to.z - t[2]) * 0.6]
      check(close(r.after.target, want), '…toward the walk\'s end, as a focus glides (60% of the way)', `${r.after.target.map((x) => x.toFixed(2))} | ${want.map((x) => x.toFixed(2))}`)
    }
    // the same, the camera zoomed off to the other side of the board: framed
    {
      const r = await play({ localSeats: [other], ...move, ready: (rig) => rig.frameOn(-ends[1].x * 1.2, -ends[1].z - 6, 4) })
      const want = framePose(circleOf(ends), r.before, 1280 / 800, { min: r.rig.controls.minDistance * 2, max: r.rig.controls.maxDistance })
      check(r.wasOff, 'the case: zoomed off to the other side of the board, the walk is off screen')
      check(r.cues === 1 && r.glides === 1 && close(r.after.pos, want.pos) && close(r.after.target, want.target), `seat ${other}'s page zoomed off elsewhere: the move is framed once, as a batch of its two ends is (framePose round them)`, `${r.glides} glides, at ${r.after.target.map((x) => x.toFixed(2))} | ${want.target.map((x) => x.toFixed(2))}`)
    }
    for (const [localSeats, want, what] of [
      [[], 1, 'a watching page (no seat played here: a watched battle, a replay)'],
      [[mover], 0, `seat ${mover}'s own page (its own move)`],
      [[0, 1], 0, 'hotseat (its player\'s own move)'],
    ]) {
      const r = await play({ localSeats, ...move })
      check(r.idle && r.cues === 1 && r.glides === want && (want || close(r.after.pos, r.before.pos)), `${what}: ${want ? 'one glide' : 'the camera stays'}`, `${r.glides} glides, ${r.cues} cues`)
    }
    {
      const r = await play({ localSeats: [other], ...move, ready: (rig) => (rig.follow = false) })
      check(r.cues === 1 && r.glides === 0 && close(r.after.pos, r.before.pos), '🎥 off: the camera stays', `${r.glides} glides`)
    }
    // the AI's turn played one at a time on the human seat's page
    if (turn) {
      const focuses = turn.events.filter((e) => e.t === 'focus').length
      const r = await play({ localSeats: [0], ...turn, batched: false })
      check(r.idle && r.cues > 0 && r.focused === 0 && r.glides <= r.cues, `the AI's first turn one at a time (${focuses} focus events): ${r.cues} actions cued, ${r.glides} camera moves, no focus followed on its own`, `${r.focused} focus events followed, idle ${r.idle}`)
    }
  } finally {
    for (const [k, d] of Object.entries(keep)) {
      if (d) Object.defineProperty(globalThis, k, d)
      else delete globalThis[k]
    }
  }
  return { ok: !bad, lines }
}

// ── (F16) The courtesy fog: every battle against the AI, under ?fog ───────
// Each played in a child with PRESENT_FOG set (fogWatch, above): the
// battle the corpus's, the mirror the match, the fog the core's sight.
// Returns { ok, lines }.
// (the hotseat battles in which one seat loses sight of scenery it saw
// change, and that seat)
// (a function: the checks run from the module's top, above this line)
function fogHotseat(id) {
  return { 'hotseat-aggressive-125': 1, 'hotseat-aggressive-lists-3': 1, 'hotseat-aggressive-140': 0, 'hotseat-aggressive-field-1': 0 }[id]
}
async function fogCase(dir, items, env) {
  const { verdict, pool, CPUS } = await import('./lib.mjs')
  if (!existsSync(join(dir, 'present', 'fog.js'))) return { ok: false, lines: ['  (F16) FAIL code older than F16: no present/fog.js, so no battle is played under the courtesy fog'] }
  const lines = [], total = { closes: 0, hidden: 0, ghosts: 0, stale: 0, linesHidden: 0, linesUnseen: 0, linesNamed: 0, trays: 0, looked: 0 }
  let bad = 0
  await pool(items, CPUS, async (it) => {
    const seat = fogHotseat(it.id)
    const r = await child(dir, it.job, { ...env, PRESENT_FOG: '1', ...(seat !== undefined ? { PRESENT_FOG_SEAT: String(seat) } : {}) })
    let why = r.error ?? r.mismatch
    if (!why) {
      // (the battle itself the corpus's: its trace and shadows; the battle
      // log the page writes is the fog's, lines hidden or unnamed, each held
      // to the fog's marks by fogWatch)
      const v = verdict(it, r)
      if (v.line >= 0 || v.shadow >= 0) why = `under the fog the battle itself differs from the corpus (trace line ${v.line}, shadow ${v.shadow})`
      else if (!r.fog?.closes) why = 'no entry closed under the fog (?fog not taken?)'
    }
    if (why) bad++
    for (const k of Object.keys(total)) total[k] += r.fog?.[k] ?? 0
    lines.push(`  (F16) ${why ? 'FAIL' : 'ok  '} ${it.id.padEnd(24)} ${why ? why.split('\n')[0].slice(0, 300) : `${seat !== undefined ? `(seat ${seat} under the fog) ` : ''}${r.fog.closes} entries under the fog, ${r.fog.hidden} enemy-entries hidden, ${r.fog.ghosts} ghost-entries, ${r.fog.stale} chunk-entries as last seen, ${r.fog.linesHidden} lines hidden, ${r.fog.linesUnseen} unnamed`}`)
  })
  // (a check that held nothing proves nothing)
  const none = ['hidden', 'ghosts', 'linesHidden', ...(items.some((it) => fogHotseat(it.id) !== undefined) ? ['stale'] : [])].filter((k) => !total[k])
  if (items.length && none.length) {
    bad++
    lines.push(`  (F16) FAIL over ${items.length} battles the fog held no ${none.join(', ')}: the check held nothing there`)
  }
  lines.push(`  (F16) ${items.length} battles under the fog: ${total.closes} entries closed and looked at, ${total.hidden} enemy-entries hidden, ${total.ghosts} ghost-entries, ${total.stale} chunk-entries as last seen, ${total.linesHidden} lines hidden, ${total.linesUnseen} unnamed, ${total.linesNamed} naming a seen enemy, ${total.trays} trays`)
  return { ok: !bad, lines }
}

// ── Every battle ────────────────────────────────────────────────────────────
// Returns the exit code; `env` (the self-test's mutation) goes to every child.
async function parent({ env = process.env, quiet = false } = {}) {
  const { loadCorpus, select, verdict, pool, CPUS } = await import('./lib.mjs')
  const { dirFromArgs } = await import('./oracle/pin.mjs')
  const dir = a.dir ? resolve(a.dir) : dirFromArgs({ ref: a.ref ?? 'WORKTREE' })
  // (whole: every battle of the corpus is selected)
  let items, whole
  try {
    const all = loadCorpus().items
    items = select(all, a.only)
    whole = items.length === all.length
  } catch (e) {
    console.error(`present-check: ${e.message}`)
    return 2
  }
  const say = quiet ? () => {} : console.log
  say(`present-check (P-present): ${items.length} battles, the mirror folded from each one's events held to the match at every act and check; on ${a.dir ? dir : a.ref ? `ref ${a.ref}` : 'the working tree'}`)
  const t0 = Date.now()
  const total = { acts: 0, checks: 0, cards: 0, told: 0, events: 0, kinds: {}, ordered: {} }
  let failed = 0
  // ((F14) the camera and a human opponent's lone move, in this process)
  const follow = await followCheck(dir)
  for (const l of follow.lines) say(l)
  await pool(items, CPUS, async (it) => {
    const r = await child(dir, it.job, env)
    let why = r.error ?? r.mismatch
    if (!why) {
      const v = verdict(it, r)
      if (!v.ok) why = `the battle itself differs from the corpus (trace line ${v.line}, shadow ${v.shadow}, write ${v.written})`
      else if (!r.acts) why = 'no act was checked'
      else if (!r.checks) why = 'no action was checked (no check event: a ?debug block that puts no checkpoints in?)'
    }
    if (why) failed++
    total.acts += r.acts ?? 0
    total.checks += r.checks ?? 0
    total.cards += r.cards ?? 0
    total.told += r.told ?? 0
    total.events += r.events ?? 0
    for (const [k, n] of Object.entries(r.ordered ?? {})) total.ordered[k] = (total.ordered[k] ?? 0) + n
    for (const [k, n] of Object.entries(r.kinds ?? {})) total.kinds[k] = (total.kinds[k] ?? 0) + n
    say(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${why ? `FAIL: ${why.split('\n')[0].slice(0, 300)}` : `${String(r.acts).padStart(3)} acts, ${String(r.checks).padStart(3)} checks, ${String(r.events).padStart(5)} events: the mirror is the match`}`)
  })
  const kinds = Object.entries(total.kinds).filter(([k]) => /^(unit|terrain|blast|spell)\.|^(smashed|melee|charge\.result|volley)$/.test(k)).sort().map(([k, n]) => `${k} ${n}`).join(', ')
  const ordered = Object.entries(total.ordered)
  say(`  folded ${total.events} events (${kinds}) and compared ${total.acts} acts and ${total.checks} checks (${total.cards} unit cards read at them, ${total.told} telling what a unit did this turn or of its cover); held to their events' order: ${ordered.map(([k, n]) => `${n} ${k}`).join(', ')}`)
  // (a check that held nothing proves nothing: the corpus has every kind,
  // so over the whole of it a kind that held none is a line whose text
  // changed; a selection may simply have none of it)
  const none = ordered.filter(([, n]) => !n).map(([k]) => k)
  if (!ordered.length || none.length) {
    if (!whole) say(`  (these battles held no ${none.join(', ') || 'line'}: that order went unchecked here)`)
    else if (!failed) {
      failed++
      say(`  FAIL: the event order held no ${none.join(', ') || 'line'} at all (have their texts changed?)`)
    }
  }
  if (!follow.ok) say('  FAIL: (F14) the camera does not follow a human opponent\'s lone move as it should (above)')
  // ((F16) the courtesy fog: the battles against the AI among those
  // selected, under ?fog; not under the self-test's mutations)
  const solo = items.filter((it) => it.mode === 'bushtail' || it.mode === 'serpent' || fogHotseat(it.id) !== undefined)
  const fogged = env.PRESENT_MUTATE ? { ok: true, lines: [] } : await fogCase(dir, solo, env)
  for (const l of fogged.lines) say(l)
  if (!solo.length && !env.PRESENT_MUTATE) say('  (F16) no battle against the AI selected: the fog went unchecked here')
  const ok = !failed && follow.ok && fogged.ok
  say(!ok ? `\npresent-check FAILED: ${failed} of ${items.length}${follow.ok ? '' : ', and the camera\'s (F14) case'}${fogged.ok ? '' : ', and the courtesy fog\'s (F16) case'}` : `\npresent-check passed: at every act and check of all ${items.length} battles the mirror folded from the events is the match, and the actions' own events come in their order; (F14) a human opponent's lone move glides the camera once, and none on its own seat's page; (F16) under the courtesy fog the page shows the other army as the core's sight has it (${Math.round((Date.now() - t0) / 1000)} s)`)
  return ok ? 0 : 1
}

// ── The self-test: each mutation must fail the check ────────────────────────
// On the battles --only selects (all of them by default). A mutation is
// caught when a battle fails on the mirror, the act events or the event
// order; not by the closing line about kinds held none of, which a battle
// never fails on its own.
async function selfTest() {
  const { MUTATIONS } = await import('./present-hooks.mjs')
  const names = a.mutations ? a.mutations.split(',').map((m) => m.trim()) : Object.keys(MUTATIONS)
  const unknown = names.filter((m) => !Object.hasOwn(MUTATIONS, m))
  if (unknown.length) {
    console.error(`present-check: no mutation ${unknown.join(', ')} (there are ${Object.keys(MUTATIONS).join(', ')})`)
    process.exit(2)
  }
  // parent() on `env`, its lines kept rather than printed
  const run = async (env) => {
    const lines = []
    const log = console.log
    console.log = (...x) => lines.push(x.join(' '))
    try {
      return { code: await parent({ env }), lines }
    } finally {
      console.log = log
    }
  }
  // the code as it stands, on the same battles, must pass first: a failure
  // there would be counted as every mutation's catch
  const { PRESENT_MUTATE, ...clean } = process.env
  const base = await run(clean)
  if (base.code !== 0) {
    for (const l of base.lines.filter((l) => /FAIL/.test(l))) console.log(l)
    console.log(`\npresent-check self-test FAILED: the check fails with no mutation (exit ${base.code}), so no mutation can be judged`)
    process.exit(1)
  }
  console.log(`  unmutated: ${base.lines.at(-1).trim().replace(/ \(\d+ s\)$/, '')}`)
  const CATCH = /^\s+(ai|human)\s+\S+\s+FAIL: .*(mirror|act events|event order)/
  let missed = 0
  for (const name of names) {
    const { code, lines } = await run({ ...clean, PRESENT_MUTATE: name })
    const fail = lines.find((l) => CATCH.test(l))
    const caught = code === 1 && !!fail
    if (!caught) missed++
    const why = fail ?? lines.find((l) => /FAIL/.test(l)) ?? `exit ${code}${a.only && !code ? ' (do these battles reach it?)' : ''}`
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${name.padEnd(17)} ${why.trim().slice(0, 200)}`)
  }
  console.log(missed ? `\npresent-check self-test FAILED: ${missed} mutation(s) passed` : '\npresent-check self-test passed: every mutation fails the check on the mirror or the events\' order')
  process.exit(missed ? 1 : 0)
}
