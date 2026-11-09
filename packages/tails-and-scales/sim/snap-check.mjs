// The snap check (DESIGN §2.4, §4 R7): the table the view builds event by
// event is the table a snap of the match builds from the match as it
// stands. The view plays the match's events one at a time (view/player.js),
// moving figures, felling them, breaking and dropping the scenery; a snap
// (the player's snap(G): a new table, a battle's start, a rejoin or a scrub
// later) builds the same table at once from G (TerrainView.sync,
// UnitViews.sync). Whenever the player has drained its queue the two must
// agree, or a rejoin would show another table than the players who watched
// it all.
//
// Each battle is played in Chromium on a fresh build of the code under test
// (?debug&fast, started from its title-screen button), a watched battle
// (an AI pair: the player drains once, at the end) or a human log (it drains
// at every decision the log answers, which a bot plays through the same
// driver as P-browser's). Whenever the player is idle at a point not yet
// checked, the driver waits while the figures settle (a figure walks to its
// slot, a fallen one sinks out of sight, a few frames under ?fast), and then
// the ?debug block's view.snapDiff() compares the table as built with a
// fresh snap's (and with a table kept from the last check and synced again:
// the snap's keeping path): every unit's ring (place, size, colour,
// strength), hit cylinder, standing figures and label; every chunk's mesh,
// shown or not, and where it stands (a dropped block's height, a fallen
// tree's lie); and what the shooting holds outside the mirror (a template's
// marker, an eruption's thorns: none, as a snap holds none). The fresh snap
// is made by the view's own rebuild (view/index.js; main.js's until R7b),
// the one the player's snap calls, into views off the table. And since a
// watched battle drains only at its end, the table is also held at every
// P-present checkpoint on the way (a `check` event, ?debug's: after each
// action, each fight and morale phase, each entry's stop;
// sim/present-check.mjs): the player waits there (the ?debug block's
// view.pauseAtChecks) while the figures settle, and the table as built so
// far must be the snap of the match as it stood there (the checkpoint's
// projection, its chunks those that stood then). The
// battle must also replay the corpus exactly (trace, shadow, battle log),
// so the check ran on the battle it names. And at its end the page's own
// table is snapped where it stands (the player's snap(G), as N2's rejoin
// will snap it): once the figures settle it must be a fresh snap's table,
// and hold none of fx's scorch and acid marks (view state outside the
// mirror, which the battle as built keeps and a snap takes away).
//
// (F8b) And the Grand row (DESIGN §4.2.9's snap-check row): in one page a
// watched battle of the grand mission started from the classic title, then
// a classic one: the table made over for each board as its battle starts
// (classic → Grand → classic, view.board()'s builds), the table built event
// by event a fresh snap's at every checkpoint as the corpus battles' are,
// and its terrain tiles (view/terrain.js: a Grand table's chunks drawn by
// 8" tiles) drawn as their chunks at each of them (view.drawing().tiles,
// the tileCheck: every tiled chunk's drawn shape and colour its own
// mesh's, vertex for vertex); the battle snapped in place at its end; and
// back on the classic table, no tile left. It runs by default and with
// --only grand; the self-test's tile edits run on it.
//
// (F9a) And the cart row (DESIGN §4.2.5's view: riders on deck, the hull's
// pips and label, the wreck and the bail-out): a watched Field battle,
// both seats' lists given (CART_ARMIES: the Bushtails with two War-Carts,
// whose deployment's autoload seats their Troops on the decks), the table
// built event by event a fresh snap's at every checkpoint (every rider's
// figures where its hull's deck seats them, every bail-out's on the table),
// and snapped in place at its end. The row must have seen riders aboard at
// some checkpoint, riders stepping off a deck and a War-Cart wrecked (its
// wreck a chunk of the table), or it proves nothing. (F9a's integration:
// the AI's riders step off by their first turns, so its hulls die empty;
// the bail-out's hop and dice are the vehicle/ corpus's bail-out log's, a
// default row.) It runs by default and with --only cart; the self-test's
// deck edits run on it. (F9c, DESIGN §4.2.5's firing deck: decision Q19)
// Its riders now shoot from their decks: the row must have seen shots from
// a deck (every volley and template thrown by a unit aboard), and at each
// checkpoint every rider's figures on a deck are held to the target it
// last faced (unit.face), turned there relative to its hull until that
// hull moves or the rider steps off (each figure within TURN_TOL of the
// bearing from where it stood as it faced, less its hull's yaw then, once
// it has had TURN_SETTLE frames more to turn; one whose hull has since
// turned to a target of its own is turned with it, unchecked; one that
// faced nothing since, or (F9c's review) rode through a snap, its hull's
// front), with some checkpoint after a
// shot holding a turned figure (the figures a hull's move turns back to
// its front are counted, `resets`: neither watched battle has one, so
// input-check's deck row holds that turn); no rider's glow lit (a watched battle lights no ring); and the
// snaps' figures at their slots as ever (snapDiff).
//
// (F7c) And the collapse row (DESIGN §4.2.4's "Destruction and settle":
// timber platforms shot out from under their defenders, who fall, and the
// view's falls: view/terrain.js's drop, view/units.js's fell). The AI seldom
// mans a platform or aims at one (F7c's smoke), so the battle is the
// human-bot's: candidate COLLAPSE_SEED of corpus-add's `--mode hotseat
// --policy collapse
// --terrain fortified` (the human-bot's `collapse` policy,
// sim/oracle/human-bot.mjs: its template shooters aim at a platform's
// defenders and posts, its climbers make for the decks), played first in
// Node on the code under test (sim/lib.mjs runOracle, as corpus-add plays
// a candidate: on seed 8, two platforms shot out and a unit on each: the
// battle corpus-add recorded as fort/'s hotseat-collapse-platform-8, board
// 95722, dice 20919, which the whole corpus's rows (`--only ai,human`) play
// under ?fast alone; the row plays its own, the bot on the code under test
// rather than the corpus's entries, without ?fast), then
// its log driven in Chromium as a corpus human log is, the page's trace,
// shadow and battle log held to Node's. Unlike every other row it plays
// without ?fast, at clock speed COLLAPSE_SPEED, so a fall plays the way a
// player sees it (the deck sagging and dropping with its ladders, its
// planks held hidden until it lands, the figures dropping with it), the
// animated path that ?fast skips for the end state alone. Its table is
// held as every battle's is: at every drain and every checkpoint, so before
// each fall, at the checkpoint of the action that drops it and after, and
// snapped in place at its end, each chunk shown and drawn as a snap draws
// it (the TerrainView's state(): no mesh of a fallen deck or ladder left
// up, the planks' pile on the table and drawn) and every fallen unit's
// figures, ring, hit cylinder and label at its landing, on the ground. It
// must have seen a deck fall with a unit on it, and a check after each
// fall, or it proves nothing. It runs by default and with --only collapse;
// the self-test's fall edits run on it.
//
// (F9b) And the Howdah row (`howdah`: DESIGN §4.2.5's long hulls, their
// yaw and their decks): a hotseat Field battle whose Coil (seat 0) fields
// two Howdahs, played through the page's own session without ?fast, so a
// walk plays as a player sees it: the table held at the deployment (the
// autoload's riders on their decks), after one Howdah is placed turned on
// its spot, at the movement phase, snapped in place mid-pivot (a Howdah's
// walk of two pivots or more caught with its figure turned off every
// heading, the walk under way: the player's snap(G), as a rejoin's), after
// the other's walk of two pivots or more has played out event by event,
// and snapped in place at the end. At each, snapDiff (every rider's figure
// on its deck slot the snap's, every ring and hit volume) and each long
// hull's figure turned as the mirror's heading has it (f·π/4: a snap's
// yaw). Its moves end on a heading neither the seat's edge's nor the
// hull's own, so a yaw left at either shows. It runs by default and with
// --only howdah; the self-test's yaw edits run on it. (F9c) Then, on a page
// of its own, a watched Field battle of the AI's Howdahs (HOWDAH_WATCH:
// the Coil with two Howdahs, their riders shooting from their decks) held
// as the cart row's battle is, its deck shots and turned figures required
// alike.
//
// (F5a, DESIGN §4.2.12's snap-check row) And the races' row (`races-row`):
// a hotseat Skirmish battle of the Hive (seat 0) against the Aerie (seat
// 1), played through the page's own session without ?fast, as the Howdah
// row's: the table held at the deployment; in seat 0's movement phase a
// burrower's walk (its longest reach) snapped mid-tunnel (its figures sunk
// into the table, the walk under way: the player's snap(G), as a rejoin's)
// and held, then another burrower's walked out to its end and held; in
// seat 1's a flier's flight snapped mid-air and held, another's flown out
// and held; and the battle snapped in place at the end. At each, snapDiff:
// every figure at its end and at its height, a snapped burrower's never
// left sunk nor a flier's left aloft. It runs by default and with --only
// races-row; the self-test's `sink-kept` edit runs on it. (The races/
// corpus set's battles, recorded by F5a's Corpus phase, join the DEFAULT
// selection by RACES_BATTLES once the corpus holds them: until then the
// run says they are not there yet and plays the rest.)
//
// (V3d) And the Powder Field's row (`powder-row`): the same, a watched
// battle of the powder mission in place of the grand one's, its table's
// fires held too: at every Grand checkpoint some chunk burns (the
// farmstead never stops: view.drawing().fires, the vents the table lit),
// and on the classic table after it none does (a new table puts every
// fire out). It runs by default and with --only powder-row.
//
//   node sim/snap-check.mjs [--only <kinds, modes or ids>] [--dist <dir>]
//   node sim/snap-check.mjs --self-test    each edit of MUTATIONS (the view
//                                          broken one way at a time, in a
//                                          copy) must fail it, on a battle
//                                          the unedited code passes
//                     [--mutations <names>]  (V3a) those edits alone
//
// By default a selection: four watched battles (one of them 64886-198528,
// the only corpus battle where a block dropped by a collapse still stands
// when its action ends: in every other the same blast or sweep breaks it
// too), (F19a) a watched keg battle (watch-keg-1: the powder keg drawn,
// and gone from the table once an acid globe sets it off) and four human logs (one per vs-AI seat, one hotseat, and (F4) a
// vs-AI log that votes at the round limit and plays an overtime round), and
// (F9a) the vehicle/ corpus's bail-out log (a War-Cart wrecked with its
// riders aboard: their hop off and the bail-out's dice), the quick run for a
// step that touches the view; --only picks others (`ai`, `human`
// or ids, as parity's): `--only ai,human`, the whole corpus (about an hour),
// is the milestone run, as P-browser's. Exit 0 when every check of every
// battle holds, 1 otherwise, 2 on bad arguments. Set CHROMIUM_PATH to the
// pre-installed Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { loadCorpus, select, verdict, buildApp, copyCode, runOracle, hashLines } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { PKG } from './oracle/pin.mjs'
import { shadowString, shadowParts, shadowOf, instrument } from './oracle/shadow.mjs'
import { humanDriver, jobSetup, pageStart, playedAs, missingHooks, setupFor, mulberry32 } from './oracle/human-bot.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' }, mutations: { type: 'string' } } }))
} catch (e) {
  console.error(`snap-check: ${e.message}\nusage: node sim/snap-check.mjs [--only <kinds, modes or ids>] [--dist <dir>] | --self-test [--mutations <names>]`)
  process.exit(2)
}
// ((F5a) and a races/ battle of the Hive against the Aerie, once the
// Corpus phase has recorded the set: a watched battle whose burrowers
// tunnel and whose fliers fly, played as every corpus battle is; until the
// corpus holds it, the selection goes without it, and says so)
const RACES_BATTLES = ['watch-insect-bird-1']
const CORPUS_IDS = new Set(loadCorpus().items.map((x) => x.id))
const RACES_HELD = RACES_BATTLES.filter((id) => CORPUS_IDS.has(id))
if (!a.only && RACES_HELD.length < RACES_BATTLES.length) console.log(`snap-check: the races/ set's ${RACES_BATTLES.filter((id) => !CORPUS_IDS.has(id)).join(', ')} not in the corpus yet (F5a's Corpus phase records it): the default selection goes without it`)
const DEFAULT = ['64-89,4242-99,1-2,64886-198528,watch-keg-1,bushtail-random-6,serpent-late-1,hotseat-aggressive-103,serpent-random-vote-1,bushtail-random-bail-1', ...RACES_HELD].join(',')
let items
// ((F8b) the Grand row: by default, or named in --only)
const only = (a.only ?? DEFAULT).split(',').map((x) => x.trim())
const GRAND_ROW = !a.only || only.includes('grand')
// ((F9a) the cart row: by default, or named in --only)
const CART_ROW = !a.only || only.includes('cart')
// ((V3d) and the Powder Field's)
const POWDER_ROW = !a.only || only.includes('powder-row')
// ((F7c) and the collapse row's)
const COLLAPSE_ROW = !a.only || only.includes('collapse')
// ((F9b) and the Howdah row's)
const HOWDAH_ROW = !a.only || only.includes('howdah')
// ((F5a) and the races' row's)
const RACES_ROW = !a.only || only.includes('races-row')
const ROWS = new Set(['grand', 'cart', 'powder-row', 'collapse', 'howdah', 'races-row'])
try {
  items = only.filter((x) => !ROWS.has(x)).length ? select(loadCorpus().items, only.filter((x) => !ROWS.has(x)).join(',')) : []
} catch (e) {
  console.error(`snap-check: ${e.message}`)
  process.exit(2)
}

// frames to let the figures settle before a check (?fast: a tween ends
// within a frame, and a fall chains three)
const SETTLE = 8

// --self-test's edits: [file, text, replacement, battle], each a way the
// table built event by event could part from the match. The battle an edit
// runs on (SELF_TEST_ON unless it names one) must reach it, or the edit
// would pass as the unedited code does and read as missed: SELF_TEST_ON
// breaks blocks and places units, and a block left hanging over a broken
// one shows only where a dropped block outlives its action (64886-198528,
// where the blast that drops one also hurts it).
const MUTATIONS = {
  // the labels not redrawn as the match's status changes (a wound, a
  // mesmerism, a melee joined)
  'stale-label': ['view/index.js', '      status: () => units.labelAll(),', '      status: () => {},'],
  // (V3a) the labels not redrawn as an action's end brings the card's
  // record (an advance's 💨, a fall back's ↩ shown an action late: the
  // fresh snap reads the record as it stands). On a watched battle: a
  // human's every action is followed by the decision it waits on, which
  // draws them again, but the AI's turn plays on, its checks between acts
  'deeds-stale': ['app/flow.js', '        if (e.facts) this.facts = e.facts\n        if (e.facts) view.units.labelAll()\n      },\n      // what the match waits on', '        if (e.facts) this.facts = e.facts\n      },\n      // what the match waits on', '4242-99'],
  // (V3a) the labels not redrawn as the battle ends: the last seat's deeds
  // left on them once no seat's turn is under way ((F11b) anchored past the
  // deployment's points banner, which staged() shows or hides between the
  // selection's drop and the labels)
  'over-stale': ['app/flow.js', "    else this.ui.armyBanner?.hide()\n    this.view.units.labelAll()\n", "    else this.ui.armyBanner?.hide()\n", '4242-99'],
  // (V3a) the labels not redrawn as a seat's turn begins: the seat whose
  // turn ended keeps its deeds' icons into the other's
  'turn-stale': ['app/flow.js', '    this.facts = turnBegun(this.facts, e)\n    this.view.units.labelAll()\n', '    this.facts = turnBegun(this.facts, e)\n'],
  // a slain model's figure left standing
  'dead-standing': ['view/units.js', '      .then(() => {\n        this.unfigure(f)\n        f.dying = false\n      })\n  }\n\n  // A model flees', '      .then(() => {\n        f.dying = false\n      })\n  }\n\n  // A model flees'],
  // a placed unit's ring and hit cylinder left where the unit stood
  'place-unmoved': ['view/index.js', "      'unit.place': (e) => units.placed(e),", "      'unit.place': () => {},"],
  // a broken chunk's mesh left up
  'broken-standing': ['view/terrain.js', "      case 'block': {\n        this.group.remove(v.obj)\n", "      case 'block': {\n"],
  // a block over a broken one left hanging where it stood
  'collapse-hangs': ['view/terrain.js', 'const y0 = m.position.y, y1 = rest', 'const y0 = m.position.y, y1 = y0', '64886-198528'],
  // a hurt block's shudder holding it at the height it was hit at, over its
  // fall (R0's: the block 64886-198528's blast drops and then hurts is left
  // a level up). ((F8b's review) The shudder's end now carries the token a
  // snap stops it by, which a fall leaves alone: the edit keeps it and puts
  // the whole place back, the height with x and z)
  'shudder-holds': ['view/terrain.js', '    }).then(() => {\n      if (v.shake !== shake) return\n      v.shake = null\n      m.position.x = p0.x\n      m.position.z = p0.z\n    })\n', '    }).then(() => {\n      if (v.shake !== shake) return\n      v.shake = null\n      m.position.copy(p0)\n    })\n', '64886-198528'],
  // a template's marker left on the table once it is thrown (R7a's fixer:
  // the shooting's view state, which a snap clears, compared too)
  'marker-held': ['view/effects/shots.js', '    if (units.gone(e.u, v, gen)) return\n    this.blastMarker?.userData.remove()\n    this.blastMarker = null\n', '    if (units.gone(e.u, v, gen)) return\n'],
  // (R7a's fixer, round 3) a snap that leaves fx's scorch and acid marks on
  // the table, from a timeline it left (caught by the snap in place)
  'marks-kept': ['view/index.js', '    sh.clear()\n    marks.clearDecals()\n', '    sh.clear()\n'],
  // (F8b, on the Grand row) a chunk promoted out of its tile as a shot
  // hurts it leaves the tile as it was: drawn twice, by its tile and itself
  'tile-stale': ['view/terrain.js', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n    this.mark(t)\n', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n', 'grand'],
  // (F8b, on the Grand row) a classic battle after a Grand one keeps the
  // Grand table's terrain tiles: the classic table drawn otherwise than
  // ever
  'tiles-kept': ['view/index.js', '    this.terrain.tiling(big)\n', '    this.terrain.tiling(big || this.terrain.tiled)\n', 'grand'],
  // (F9a, on the cart row) a rider stepping off left standing on its
  // hull's deck, riding on with it
  'stays-aboard': ['view/units.js', '    this.dismount(e.v, true, e.u)\n    this.disc(e.u)\n', '    this.disc(e.u)\n', 'cart'],
  // (F9a, on the cart row) a rider stepped off left without its ring and
  // hit cylinder, as it rode
  'ringless-off': ['view/units.js', '    this.stands(v, this.shown(e.u).alive > 0)\n    this.layDeck(e.v)\n', '    this.layDeck(e.v)\n', 'cart'],
  // (F7c, on the collapse row) a fallen platform's deck left up once it
  // has dropped (its mesh never taken off the table)
  'deck-stays': ['view/terrain.js', '        v.drop = null\n        this.group.remove(o)\n', '        v.drop = null\n', 'collapse'],
  // (F7c, on the collapse row) its planks' pile left hidden once the deck
  // it waited on has landed
  'pile-held': ['view/terrain.js', '        if (pile && this.items.get(pile.c.id) === pile && pile.obj) pile.obj.visible = true\n', '', 'collapse'],
  // (F7c, on the collapse row) a fallen unit's ring, hit cylinder and
  // label left up on the deck it fell from
  'fall-ringless': ['view/units.js', "    this.disc(e.u)\n    this.label(e.u)\n    if (!hid) {\n      const top = this.top(e.u)\n", "    if (!hid) {\n      const top = this.top(e.u)\n", 'collapse'],
  // (F9b, on the Howdah row) a long hull's view made again from the mirror
  // facing the table's way, as a round unit's, not its heading
  'hull-unturned': ['view/units.js', '      v.facing = v.fp ? yawOf(mu) : -edge * Math.PI / 2\n', '      v.facing = -edge * Math.PI / 2\n', 'howdah'],
  // (F9b, on the Howdah row) a long hull placed turned left facing as it
  // stood
  'place-unturned': ['view/units.js', '    if (v.fp) v.facing = yawOf(this.shown(e.u))\n', '', 'howdah'],
  // (F9b, on the Howdah row) a long hull's figure never turned to its
  // facing: it walks on at the yaw it had
  'yaw-frozen': ['view/units.js', '            m.yaw = v.facing\n            m.moving = v.moving\n', '            m.moving = v.moving\n', 'howdah'],
  // (F9c, on the cart row) a rider that shoots from its deck never turned
  // to its target there
  'riders-unturned': ['view/units.js', '      f.deckLook = wrapAngle(Math.atan2(at.x - tmpV.x, at.z - tmpV.z) - hm.rotation.y)\n', '      f.deckLook = undefined\n', 'cart'],
  // (F9c, on the Howdah row's watched battle) the look yaw the target's
  // bearing in the table's frame, not relative to the hull it rides
  'look-world': ['view/units.js', '      f.deckLook = wrapAngle(Math.atan2(at.x - tmpV.x, at.z - tmpV.z) - hm.rotation.y)\n', '      f.deckLook = wrapAngle(Math.atan2(at.x - tmpV.x, at.z - tmpV.z))\n', 'howdah'],
  // (F5a, on the races' row) a snap mid-tunnel leaves a burrower's figures
  // sunk where the walk had them: the table made again from the mirror
  // keeps the walk's sink (sync's reset without it)
  'sink-kept': ['view/units.js', 'lift: 0, sink: 0, flash: 0, flying: false', 'lift: 0, flash: 0, flying: false', 'races-row'],
}
// (F9a) the cart row's battle: the Field mission, seat 0's Bushtails with
// two War-Carts (950 points), seat 1 its preset
const CART_ARMIES = '1222112,field'
// (F9c) the Howdah row's watched battle: the Field mission, seat 0 the Coil
// with two Howdahs, the AI's riders shooting from their decks; how far a
// rider's figure may stand off the yaw its turn set (rad: its last turn
// eased out), once it has had TURN_SETTLE frames more than a checkpoint's
// settle since a rider faced or a hull moved
const HOWDAH_WATCH = 'races=serpent,squirrel&mission=field&armies=2232222,field'
const TURN_TOL = 0.02, TURN_SETTLE = 40
// (F7c) the collapse row's battle: corpus-add's candidate (its board and
// dice from mulberry32(9000 + k), the bot's policy seed k), and the clock
// speed it plays at without ?fast (a fall's drop and a figure's death end
// within the SETTLE frames a check waits: up to 0.05 s × speed a frame)
const COLLAPSE_SEED = 8
const COLLAPSE_SPEED = 12
// (F9b) the Howdah row's battle: the Field mission, seat 0 the Coil with two
// Howdahs (985 points), seat 1 the Bushtails' preset
const HOWDAH_ARMIES = 'races=serpent,squirrel&armies=2232222,field'
const SELF_TEST_ON = 'hotseat-aggressive-103'
// (F5a) the races' row's battle: a Skirmish, the Hive (seat 0) against the
// Aerie (seat 1), each on its classic list
const RACES_Q = 'races=insect,bird'

// In the page, before main.js: catch window.__ts, record (the shadow and
// battle log, as P-browser does), and run the battle frame by frame: the
// driver plays the log's next entry when the page asks, except while a
// check waits for the figures to settle; at every idle point a check.
// ((F7c) `speed`: no ?fast, the clock at that speed (the collapse row);
// and the falls played, counted (each unit.fall, each deck broken), each
// check recording how many had played by then; and the battle stopped at
// the first check that differs, its verdict reached: a page that draws
// every frame plays its battle in an hour or two on a shared machine, so a
// self-test edit caught at a fall ends there)
function pageHarness(job, mode, settle, speed = 0) {
  const sim = (window.__sim = { error: null, rec: null, driver: null, checks: [], done: false, falls: 0, decks: 0 })
  let ts = null
  addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
  addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
  Object.defineProperty(window, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      const missing = missingHooks(v)
      if (missing.length) return void (sim.error = `window.__ts lacks ${missing.join(', ')}`)
      sim.rec = instrument(v)
      if (mode !== 'watch') sim.driver = humanDriver(ts, { entries: job.entries })
      if (speed) {
        ts.clock.speed = speed
        const obs = ts.player.observer
        // ((F7c's review) a unit destroyed on its deck before it fell is no
      // unit fallen: its `dead` fall only takes it to the ground)
      ts.present.listen({ ...obs, event: (ev, M) => ((ev.t === 'unit.fall' && !ev.dead && sim.falls++), (ev.t === 'terrain.destroy' && ev.kind === 'deck' && sim.decks++), obs?.event?.(ev, M)), reset: (M) => obs?.reset?.(M) })
      }
      // at every checkpoint, the player waits while the figures settle and
      // the table is held to the match as it stood there
      ts.view.pauseAtChecks((e) => new Promise((resolve) => {
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          try {
            sim.checks.push({ mark: `check at trace line ${ts.trace.length}`, stage: 'checkpoint', falls: sim.falls, ...ts.view.snapDiff(e.proj) })
            if (speed && sim.checks.at(-1).n) sim.stop = sim.done = true
          } catch (err) {
            sim.error ??= String(err.stack ?? err)
          }
          resolve()
        }
        requestAnimationFrame(f)
      }))
      requestAnimationFrame(loop)
    },
  })
  let last = null, waiting = 0
  function loop() {
    // ((F7c) stopped at a check that differs: no more entries played, so the
    // snap in place that follows finds the player idle)
    if (sim.stop) return
    try {
      // (no battle yet: the title)
      if (ts.G && ts.player.idle) {
        const mark = `${ts.trace.length}/${sim.driver?.played.length ?? 0}/${ts.S.stage}`
        if (mark !== last) {
          if (++waiting < settle) return void requestAnimationFrame(loop)
          waiting = 0
          last = mark
          const r = ts.view.snapDiff()
          sim.checks.push({ mark, stage: ts.S.stage, falls: sim.falls, ...r })
          if (speed && r.n) return void (sim.stop = sim.done = true)
        }
      } else waiting = 0
      if (ts.S.stage === 'over' && ts.player.idle && last === `${ts.trace.length}/${sim.driver?.played.length ?? 0}/over`) {
        sim.done = true
        return
      }
      sim.driver?.tick()
    } catch (e) {
      sim.error ??= String(e.stack ?? e)
      return
    }
    requestAnimationFrame(loop)
  }
}

async function ask(page, fn, arg) {
  let timer
  try {
    return await Promise.race([page.evaluate(fn, arg), new Promise((_, no) => (timer = setTimeout(() => no(new Error('the page stopped answering')), IDLE_MS)))])
  } finally {
    clearTimeout(timer)
  }
}

// ((F7c) `speed`: played without ?fast, at that clock speed: the collapse
// row's)
async function run(browser, url, item, { speed = 0 } = {}) {
  const setup = jobSetup(item.job)
  const { mode, query } = pageStart(setup)
  // ((F7c) the collapse row's page, drawing every frame, small: what the
  // checks compare is the table's objects, not its pixels)
  const ctx = await browser.newContext({ viewport: speed ? { width: 480, height: 300 } : { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const fns = [shadowString, shadowParts, shadowOf, instrument, missingHooks, humanDriver].join('\n')
    await page.addInitScript({ content: `${fns}\n(${pageHarness})(${JSON.stringify(item.job)}, ${JSON.stringify(mode)}, ${SETTLE}, ${speed})` })
    await page.goto(`${url}/?debug${speed ? '' : '&fast'}&${query}`, { timeout: IDLE_MS })
    const boot = await ask(page, () => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts'))
    if (boot) throw new Error(boot)
    // ((F7c) a page drawing every frame, the collapse row's without ?fast,
    // answers a click more slowly on a loaded machine: it waits as long as
    // the page may be idle)
    await page.click(`[data-mode="${mode}"]`, { timeout: speed ? IDLE_MS : 30000 })
    // (F6) the battle-setup panel's Start, its races the URL's
    await page.click('#setupStart', { timeout: speed ? IDLE_MS : 30000 })
    const t0 = Date.now()
    let mark = '', since = Date.now()
    for (;;) {
      const p = await ask(page, () => ({ done: window.__sim.done || !!window.__sim.error, mark: `${window.__ts.trace.length}/${window.__sim.checks.length}` }))
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) throw new Error(`stalled at ${p.mark}`)
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => ({ trace: window.__ts.trace.slice(), shadow: window.__sim.rec.shadow, written: window.__sim.rec.written, checks: window.__sim.checks, error: window.__sim.error, unused: window.__sim.driver?.unused ?? 0, setup: window.__ts.G?.setup, falls: window.__sim.falls, decks: window.__sim.decks, stopped: !!window.__sim.stop }))
    // the battle played is the log's, field for field
    r.error ??= playedAs(r.setup, setup)
    // the page's own table snapped where it stands, once the battle is
    // read: then, the figures settled, a fresh snap's, and no fx mark left
    if (!r.error) {
      r.checks.push(await ask(page, (settle) => new Promise((resolve) => {
        const ts = window.__ts, marks = ts.view.counts().marks
        ts.player.snap(ts.G)
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = ts.view.snapDiff(), left = ts.view.counts().marks
          if (left) (d.diffs = [`marks: ${left} | 0`, ...d.diffs]), d.n++
          resolve({ mark: 'snapped in place', stage: 'in place', marks, ...d })
        }
        requestAnimationFrame(f)
      }), SETTLE))
    }
    if (!r.error && errors.length) r.error = errors.join('\n')
    // ((F7c) but for a battle the collapse row stopped at a check that
    // differs: its entries left are the stop's, and its verdict the check's)
    if (!r.error && r.unused && !r.stopped) r.error = `the battle ended with ${r.unused} log entries unplayed`
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}

// (F8b) The Grand row: a watched grand battle from the classic title, then
// a classic one, in one page (above). Returns { checks, error, ... } as run
// does, judged by judgeGrand.
// ((V3d) `mission`: the larger board's, grand's or the Powder Field's)
async function grandRow(browser, url, mission = 'grand') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(`(${(settle) => {
      const sim = (window.__grand = { checks: [], error: null })
      addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
      addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
      // at every checkpoint the player waits while the figures settle, and
      // the table and its tiles are held to the match as it stood there
      const hook = () => {
        if (!window.__ts) return void requestAnimationFrame(hook)
        window.__ts.view.pauseAtChecks((e) => new Promise((resolve) => {
          let n = settle
          const f = () => {
            if (--n > 0) return void requestAnimationFrame(f)
            try {
              const d = window.__ts.view.snapDiff(e.proj), t = window.__ts.view.drawing().tiles
              sim.checks.push({ mark: `check at trace line ${window.__ts.trace.length}`, board: window.__ts.board.W, n: d.n + t.bad.length, diffs: [...t.bad, ...d.diffs], tiles: t.tiles, tiled: t.tiled, chunks: d.chunks, vents: window.__ts.view.drawing().fires?.vents ?? 0 })
            } catch (err) {
              sim.error ??= String(err.stack ?? err)
            }
            resolve()
          }
          requestAnimationFrame(f)
        }))
      }
      hook()
    }})(${SETTLE})`)
    await page.goto(`${url}/?debug&fast&seed=4242&dice=99`, { timeout: IDLE_MS })
    await page.waitForFunction(() => window.__ts)
    const t0 = Date.now()
    const board = () => page.evaluate(() => ({ ...window.__ts.view.board(), tiles: window.__ts.view.drawing().tiles }))
    const boards = [['the title', await board()]]
    const battle = async (mission) => {
      await page.evaluate((m) => window.__ts.view.mission(m), mission)
      await page.click('[data-mode="watch"]', { timeout: 30000 })
      await page.click('#setupStart', { timeout: 30000 })
      await page.waitForFunction(() => window.__grand.error || (window.__ts.S.stage === 'over' && window.__ts.player.idle), null, { timeout: 900000, polling: 500 })
      // the page's own table snapped in place, then held to a fresh snap
      const end = await page.evaluate((settle) => new Promise((resolve) => {
        const ts = window.__ts
        ts.player.snap(ts.G)
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = ts.view.snapDiff(), t = ts.view.drawing().tiles
          resolve({ mark: 'snapped in place', board: ts.board.W, n: d.n + t.bad.length, diffs: [...t.bad, ...d.diffs], tiles: t.tiles, tiled: t.tiled, chunks: d.chunks, vents: ts.view.drawing().fires?.vents ?? 0 })
        }
        requestAnimationFrame(f)
      }), SETTLE)
      await page.evaluate((c) => window.__grand.checks.push(c), end)
      boards.push([`the ${mission} battle`, await board()])
      await page.click('#again', { timeout: 30000 })
    }
    await battle(mission)
    await battle('classic')
    boards.push(['the title again', await board()])
    const r = await page.evaluate(() => ({ checks: window.__grand.checks, error: window.__grand.error }))
    if (!r.error && errors.length) r.error = errors.join('\n')
    r.boards = boards
    r.mission = mission
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// (F9a) The cart row: a watched Field battle with War-Carts (above).
// Returns { checks, error, ... }, judged by judgeCart. ((F9c) `q` the
// battle's armies (the cart row's, or the Howdah row's watched battle,
// HOWDAH_WATCH), `key` the hull counted. And its riders' shots from the
// deck: every volley and template thrown by a unit aboard counted (`deck`
// at each check), and at each check every rider's figures on a deck
// turned to the target it last faced (unit.face), as the face put its
// look yaw relative to the hull, until that hull moved or the rider
// stepped off: each figure within TURN_TOL of the bearing from where it
// stood as it faced, less its hull's yaw then (taken as the event plays,
// the figure's own `want`; each figure checked counted, `turned`), else
// its hull's front, a checkpoint after a turn or a move waiting
// TURN_SETTLE frames more; and no rider's halo lit (a watched battle has
// no seat played here, so no ring is lit for it).)
async function cartRow(browser, url, q = `mission=field&armies=${CART_ARMIES}`, key = 'warcart') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(`(${(settle, TOL, MORE) => {
      const sim = (window.__cart = { checks: [], error: null })
      addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
      addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
      // at every checkpoint the player waits while the figures settle, and
      // the table is held to the match as it stood there: how many units
      // rode then, and how many wrecks stood (the chunks of kind 'wreck'
      // the checkpoint's projection holds standing)
      const hook = () => {
        if (!window.__ts) return void requestAnimationFrame(hook)
        window.__ts.view.pauseAtChecks((e) => new Promise((resolve) => {
          // ((F9c) longer after a rider's turn or a hull's move: the
          // figures' turns eased out)
          let n = settle + (sim.deck.moved ? MORE : 0)
          sim.deck.moved = false
          const f = () => {
            if (--n > 0) return void requestAnimationFrame(f)
            try {
              const ts = window.__ts, d = ts.view.snapDiff(e.proj)
              const riders = Object.values(e.proj.units).filter((u) => u.aboard && u.alive > 0).length
              const wrecks = ts.G.terrain.chunks.filter((c) => c.kind === 'wreck' && e.proj.chunks[c.id]?.alive).length
              // ((F9c) the riders' figures turned to their targets on the
              // deck, and no halo lit)
              const turn = [], deck = sim.deck
              let turned = 0
              ts.scenery.scene.traverse((o) => {
                const r = o.userData?.rider
                if (r === undefined || !o.parent || o.parent.userData?.deck === undefined) return
                if (o.userData.glow) {
                  if (o.visible) turn.push(`unit ${r}'s halo lit in a watched battle`)
                  return
                }
                const at = deck.looks.get(o), wrap = (x) => Math.abs(((((x % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI))
                // (one whose hull turned to a target of its own since it
                // faced: turned as its hull, unchecked; (F9c's review) one
                // riding through a snap faces its hull's front, as on a
                // fresh table)
                if (at === null) return
                // (none faced since its hull last moved: its hull's front)
                if (at === undefined) {
                  if (!(wrap(o.rotation.y) <= TOL)) turn.push(`unit ${r}'s figure on the deck ${wrap(o.rotation.y).toFixed(3)} rad off its hull's front, no target faced since its hull moved`)
                  return
                }
                const dy = wrap(o.rotation.y - at.want)
                turned++
                if (!(dy <= TOL)) turn.push(`unit ${r}'s figure on the deck ${dy.toFixed(3)} rad off the target it faced`)
              })
              sim.checks.push({ mark: `check at trace line ${ts.trace.length}`, n: d.n + turn.length, diffs: [...turn.slice(0, 4), ...d.diffs], riders, wrecks, figures: d.figures, deck: deck.shots, turned })
            } catch (err) {
              sim.error ??= String(err.stack ?? err)
            }
            resolve()
          }
          requestAnimationFrame(f)
        }))
        // every bail-out played (a forced unit.disembark); ((F9c) every shot
        // from a deck, and each rider's last target faced, where it stood:
        // forgotten as its hull moves or it steps off, as the view forgets it)
        const obs = window.__ts.player.observer
        sim.bails = 0
        // (`looks`: each rider figure's yaw on its deck as its last turn set
        // it, { r, want }, as the view's face() takes it (from where the
        // figure stands as the event plays, less its hull's yaw), or null
        // once its hull has turned to a target of its own; none since its
        // hull moved, or since a snap seated it: its front.)
        // (`resets`: figures turned to a target whose hull then moved, so
        // must face its front again)
        const deck = (sim.deck = { shots: 0, looks: new Map(), moved: false, resets: 0 })
        const figures = (id) => {
          const out = []
          window.__ts.scenery.scene.traverse((o) => o.userData?.rider === id && !o.userData.glow && o.parent?.userData?.deck !== undefined && out.push(o))
          return out
        }
        const forget = (gone) => {
          for (const [o, l] of [...deck.looks]) if (gone(l?.r ?? o.userData.rider)) deck.looks.delete(o)
        }
        const onDeck = (ev, M) => {
          const u = M.units[ev.u]
          if ((ev.t === 'volley' || ev.t === 'blast.fire') && u?.aboard) deck.shots++
          if (ev.t === 'unit.face' && u?.aboard && M.units[ev.tg]) {
            const T = M.units[ev.tg].pos
            for (const o of figures(ev.u)) {
              o.updateWorldMatrix(true, false)
              const w = o.getWorldPosition(o.position.clone())
              deck.looks.set(o, { r: ev.u, want: Math.atan2(T.x - w.x, T.z - w.z) - o.parent.parent.rotation.y })
            }
            deck.moved = true
          }
          // (a hull turning to a target of its own turns its riders with it)
          if (ev.t === 'unit.face' && u && !u.aboard) for (const [o, l] of deck.looks) if (l && M.units[l.r]?.aboard === ev.u) deck.looks.set(o, null)
          // (a hull with riders moving: they face its front again)
          if (ev.t === 'unit.move' && Object.values(M.units).some((x) => x.aboard === ev.u && x.alive > 0)) {
            for (const l of deck.looks.values()) if (l && M.units[l.r]?.aboard === ev.u) deck.resets++
            forget((r) => M.units[r]?.aboard === ev.u)
            deck.moved = true
          }
          if (ev.t === 'unit.disembark' || ev.t === 'unit.embark') {
            forget((r) => r === ev.u)
          }
        }
        window.__ts.present.listen({ ...obs, event: (ev, M) => (ev.t === 'unit.disembark' && (sim[ev.forced ? 'bails' : 'steps'] = (sim[ev.forced ? 'bails' : 'steps'] ?? 0) + 1), onDeck(ev, M), obs?.event?.(ev, M)), reset: (M) => (deck.looks.clear(), (deck.moved = true), obs?.reset?.(M)) })
      }
      hook()
    }})(${SETTLE}, ${TURN_TOL}, ${TURN_SETTLE})`)
    await page.goto(`${url}/?debug&fast&seed=4242&dice=99&${q}`)
    await page.waitForFunction(() => window.__ts)
    const t0 = Date.now()
    await page.click('[data-mode="watch"]', { timeout: 30000 })
    await page.click('#setupStart', { timeout: 30000 })
    await page.waitForFunction(() => window.__cart.error || (window.__ts.S.stage === 'over' && window.__ts.player.idle), null, { timeout: 1800000, polling: 500 })
    const end = await page.evaluate((settle) => new Promise((resolve) => {
      const ts = window.__ts
      ts.player.snap(ts.G)
      let n = settle
      const f = () => {
        if (--n > 0) return void requestAnimationFrame(f)
        const d = ts.view.snapDiff()
        resolve({ mark: 'snapped in place', n: d.n, diffs: d.diffs, riders: 0, wrecks: 0, deck: 0, turned: 0 })
      }
      requestAnimationFrame(f)
    }), SETTLE)
    const r = await page.evaluate((key) => ({ checks: window.__cart.checks, error: window.__cart.error, bails: window.__cart.bails ?? 0, steps: window.__cart.steps ?? 0, carts: window.__ts.G.units.filter((u) => u.key === key).length, mission: window.__ts.G.setup.mission, deck: window.__cart.deck.shots, resets: window.__cart.deck.resets }), key)
    r.checks.push(end)
    if (!r.error && errors.length) r.error = errors.join('\n')
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// (F9b) The Howdah row (above): a hotseat Field battle, the Coil's two
// Howdahs placed, turned and walked through the page's own session, its
// table held at rest, mid-pivot and after. Returns { checks, error, ... },
// judged by judgeHowdah.
// ((F9c) then, on a page of its own once the hotseat's has closed, a
// watched battle of the AI's Howdahs, their riders shooting from their
// decks, held as the cart row's is: `watch`)
async function howdahRow(browser, url) {
  const r = await howdahTable(browser, url)
  try {
    r.watch = await cartRow(browser, url, HOWDAH_WATCH, 'howdah')
  } catch (e) {
    r.watch = { error: e.message, checks: [] }
  }
  return r
}
async function howdahTable(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 400 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.setDefaultTimeout(IDLE_MS)
    await page.addInitScript(`(${() => {
      // the hulls' yaws as drawn against the mirror's headings (each long
      // hull's standing figure, view/units.js's userData.hull): the
      // differences, as snapDiff words its own
      window.__hullYaw = () => {
        const ts = window.__ts, M = ts.player.mirror, out = []
        let n = 0
        ts.scenery.scene.traverse((o) => {
          const id = o.userData?.hull
          if (id === undefined || !o.parent || !(M.units[id]?.alive > 0)) return
          n++
          const want = (M.units[id].f * Math.PI) / 4, d = Math.abs(((((o.rotation.y - want) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI)
          if (!(d <= 1e-6)) out.push(`yaw ${id}: ${o.rotation.y.toFixed(4)} | ${want.toFixed(4)} (f ${M.units[id].f})`)
        })
        return { diffs: out, hulls: n }
      }
    }})()`)
    // ((the page drawn small: what the checks compare is the table's
    // objects, not its pixels, and a walk plays in real time)
    await page.goto(`${url}/?debug&lowfi&seed=4242&dice=1&mission=field&${HOWDAH_ARMIES}`)
    await page.waitForSelector('#title:not(.hidden)')
    const t0 = Date.now()
    await page.click('[data-mode="hotseat"]')
    await page.click('#setupStart')
    await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: IDLE_MS })
    const checks = []
    // the table held (the figures settled), snapDiff's and the yaws
    const hold = async (mark) => {
      checks.push(await page.evaluate(({ settle, mark }) => new Promise((resolve) => {
        let n = settle * 2
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = window.__ts.view.snapDiff(), y = window.__hullYaw()
          const M = window.__ts.player.mirror
          resolve({ mark, n: d.n + y.diffs.length, diffs: [...y.diffs, ...d.diffs], hulls: y.hulls, riders: Object.values(M.units).filter((u) => u.aboard && u.alive > 0).length, at: performance.now() })
        }
        requestAnimationFrame(f)
      }), { settle: SETTLE, mark }))
    }
    const send = (body) => page.evaluate((b) => {
      const ts = window.__ts, seat = ts.session.decisionFor(), why = ts.session.legal(seat, b)
      if (why) return why
      ts.session.submit(seat, b)
      return null
    }, body)
    const idle = () => page.waitForFunction(() => window.__ts.player.idle, null, { timeout: IDLE_MS })
    // (seat 0's deployment: the Coil's)
    for (let k = 0; k < 3 && (await page.evaluate(() => window.__ts.session.decisionFor())) !== 0; k++) await page.evaluate(() => window.__ts.endPhase())
    const hulls = await page.evaluate(() => window.__ts.G.units.filter((u) => u.t.fp && u.side === 0).map((u) => u.id))
    await hold('the deployment')
    // a Howdah placed turned about where it stands: the first heading other
    // than its own the match takes there
    const turnPlace = await page.evaluate((id) => {
      const ts = window.__ts, u = ts.G.units.find((x) => x.id === id), c = ts.nav.index(u.pos.x, u.pos.z), seat = ts.session.decisionFor()
      for (let k = 1; k < 8; k++) {
        const f = (u.facing + k) & 7
        if (ts.session.legal(seat, { t: 'place', u: id, c, f }) === null) return { t: 'place', u: id, c, f }
      }
      return null
    }, hulls[1])
    if (turnPlace) {
      const why = await send(turnPlace)
      if (why) throw new Error(`the turned placement was refused: ${why}`)
      await idle()
      await hold(`Howdah ${hulls[1]} placed facing ${turnPlace.f}`)
    }
    // on to seat 0's movement phase
    for (let k = 0; k < 40; k++) {
      const P = await page.evaluate(() => ({ k: window.__ts.G.pending.k, phase: window.__ts.G.pending.phase, d: window.__ts.session.decisionFor(), idle: window.__ts.player.idle }))
      if (P.k === 'phase' && P.phase === 'move' && P.d === 0 && P.idle) break
      if (P.idle && P.d >= 0) await page.evaluate(() => window.__ts.endPhase()).catch(() => {})
      await new Promise((r) => setTimeout(r, 500))
    }
    await hold('the movement phase, before a move')
    // each Howdah's move: the reached state, of those whose path holds a
    // run and two pivots at least, its plan reaches shortest (ties: the
    // lowest state) that the match takes, at a heading neither its seat's
    // edge's (2) nor its own, so a yaw left at either shows
    const moveOf = (id) => page.evaluate((id) => {
      const ts = window.__ts, u = ts.G.units.find((x) => x.id === id), plan = ts.q.movePlan(u, 0), seat = ts.session.decisionFor(), nav = ts.nav
      const cands = []
      for (let c = 0; c < nav.N; c++) {
        if (!(plan.cells.dist[c] <= plan.max)) continue
        for (let f = 0; f < 8; f++) {
          const d = plan.res.dist[c * 8 + f]
          if (f === 2 || f === u.facing || !(d <= plan.max)) continue
          const pts = nav.hullPath(plan.res, c, f)
          let piv = 0, runs = 0
          for (let i = 1; i < pts.length; i++) (pts[i].x === pts[i - 1].x && pts[i].z === pts[i - 1].z ? piv++ : runs++)
          if (piv >= 2 && runs >= 1) cands.push({ c, f, d, piv, runs })
        }
      }
      cands.sort((p, q) => p.d - q.d || p.c * 8 + p.f - (q.c * 8 + q.f))
      for (const m of cands) if (ts.session.legal(seat, { t: 'move', u: id, c: m.c, f: m.f }) === null) return { body: { t: 'move', u: id, c: m.c, f: m.f }, piv: m.piv, runs: m.runs }
      return null
    }, id)
    const m0 = await moveOf(hulls[0])
    if (!m0) throw new Error(`Howdah ${hulls[0]} has no move with two pivots`)
    let why = await send(m0.body)
    if (why) throw new Error(`the move was refused: ${why}`)
    // mid-pivot: the hull's figure turned off every heading, the walk
    // under way; then the table snapped in place there, as a rejoin snaps it
    const caught = await page.waitForFunction((id) => {
      let mid = false
      window.__ts.scenery.scene.traverse((o) => {
        if (o.userData?.hull !== id) return
        const k = (o.rotation.y / (Math.PI / 4)) % 1, r = ((k % 1) + 1) % 1
        if (r > 0.15 && r < 0.85) mid = true
      })
      return mid && !window.__ts.player.idle
    }, hulls[0], { timeout: 60000, polling: 'raf' }).then(() => true, () => false)
    // (a walk that never turned its figure is a table that differs: its
    // check says so, and the row goes on)
    if (!caught) checks.push({ mark: `Howdah ${hulls[0]}'s walk`, n: 1, diffs: [`yaw ${hulls[0]}: its walk of ${m0.piv} pivots never turned its figure off a heading`], hulls: 2, riders: 1, at: 0 })
    await page.evaluate(() => window.__ts.player.snap(window.__ts.G))
    await hold(`Howdah ${hulls[0]} snapped mid-pivot (${m0.piv} pivots, ${m0.runs} runs, to facing ${m0.body.f})`)
    // the other's walked out to its end, the table built by its events
    const m1 = await moveOf(hulls[1])
    if (!m1) throw new Error(`Howdah ${hulls[1]} has no move with two pivots`)
    why = await send(m1.body)
    if (why) throw new Error(`the move was refused: ${why}`)
    await idle()
    await hold(`Howdah ${hulls[1]} walked (${m1.piv} pivots, ${m1.runs} runs, to facing ${m1.body.f})`)
    // and the page's table snapped in place where it stands
    await page.evaluate(() => window.__ts.player.snap(window.__ts.G))
    await hold('snapped in place')
    const r = { checks, error: errors.length ? errors.join('\n') : null, hulls: hulls.length }
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// (F5a) The races' row (above): a hotseat Skirmish of the Hive against the
// Aerie, a burrower's walk snapped mid-tunnel and a flier's flight mid-air,
// each beside a walk played out. Returns { checks, error, ... }, judged by
// judgeRaces.
async function racesRow(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 400 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.setDefaultTimeout(IDLE_MS)
    await page.goto(`${url}/?debug&lowfi&seed=4242&dice=1&${RACES_Q}`)
    await page.waitForSelector('#title:not(.hidden)')
    const t0 = Date.now()
    await page.click('[data-mode="hotseat"]')
    await page.click('#setupStart')
    await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: IDLE_MS })
    const checks = []
    // the table held (the figures settled): snapDiff's. (Its walks play in
    // real time, and a figure closes on its slot by 1 − e^(−7·dt) a frame
    // once its unit stops: the Howdah row's SETTLE × 2 frames left a
    // burrower's figures 3.4e-6" short of a fresh snap's, over snapDiff's
    // 1e-6, on a loaded box; SETTLE × 6 lets them land. A figure left where
    // it should not be, sunk or aloft, stays there however long it waits.)
    const hold = async (mark) => {
      checks.push(await page.evaluate(({ settle, mark }) => new Promise((resolve) => {
        let n = settle * 6
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = window.__ts.view.snapDiff()
          resolve({ mark, n: d.n, diffs: d.diffs, figures: d.figures, at: performance.now() })
        }
        requestAnimationFrame(f)
      }), { settle: SETTLE, mark }))
    }
    const idle = () => page.waitForFunction(() => window.__ts.player.idle, null, { timeout: IDLE_MS })
    // on to seat s's movement phase
    const toMove = async (s) => {
      for (let k = 0; k < 60; k++) {
        const P = await page.evaluate(() => ({ k: window.__ts.G.pending.k, phase: window.__ts.G.pending.phase, d: window.__ts.session.decisionFor(), idle: window.__ts.player.idle }))
        if (P.k === 'phase' && P.phase === 'move' && P.d === s && P.idle) return true
        if (P.idle && P.d >= 0) await page.evaluate(() => window.__ts.endPhase()).catch(() => {})
        await new Promise((r) => setTimeout(r, 500))
      }
      return false
    }
    // a unit of the seat's moving by `mode` ('burrow' or 'fly'), not yet
    // moved: its move to the farthest end it reaches (straight-line) that
    // the match takes, and its key (its figures' template names it)
    const moveOf = (mode, skip) => page.evaluate(({ mode, skip }) => {
      const ts = window.__ts, seat = ts.session.decisionFor(), nav = ts.nav
      for (const u of ts.G.units.filter((x) => x.side === seat && x.alive > 0 && x.t.move === mode && !skip.includes(x.id))) {
        const plan = ts.q.movePlan(u, 0), cands = []
        for (let c = 0; c < nav.N; c++) {
          const d = plan.res.dist[c]
          if (d <= plan.max && d >= plan.max * 0.6) cands.push({ c, D: Math.hypot(nav.x(c) - u.pos.x, nav.z(c) - u.pos.z) })
        }
        cands.sort((p, q) => q.D - p.D || p.c - q.c)
        for (const m of cands.slice(0, 60)) if (ts.session.legal(seat, { t: 'move', u: u.id, c: m.c }) === null) return { body: { t: 'move', u: u.id, c: m.c }, key: u.key, D: m.D }
      }
      return null
    }, { mode, skip })
    const send = (body) => page.evaluate((b) => {
      const ts = window.__ts, seat = ts.session.decisionFor(), why = ts.session.legal(seat, b)
      if (why) return why
      ts.session.submit(seat, b)
      return null
    }, body)
    await hold('the deployment')
    const moved = []
    for (const [s, mode, kit, what, caught] of [[0, 'burrow', 'insect', 'tunnel', (y) => y < -0.12], [1, 'fly', 'bird', 'flight', (y) => y > 0.5]]) {
      if (!(await toMove(s))) throw new Error(`seat ${s}'s movement phase never came`)
      const m0 = await moveOf(mode, moved)
      if (!m0) throw new Error(`seat ${s} has no ${mode} unit with a move`)
      moved.push(m0.body.u)
      let why = await send(m0.body)
      if (why) throw new Error(`the ${what} was refused: ${why}`)
      // mid-way: one of its figures sunk (a burrower) or aloft (a flier),
      // the walk under way; then the table snapped in place there
      const mid = await page.waitForFunction(({ tag, lo }) => {
        let at = false
        window.__ts.scenery.scene.traverse((o) => {
          const k = o.userData?.lodKey
          if (k && k.includes(tag) && o.parent && (lo ? o.position.y < -0.12 : o.position.y > 0.5)) at = true
        })
        return at && !window.__ts.player.idle
      }, { tag: `/${kit}/${m0.key}|`, lo: mode === 'burrow' }, { timeout: 60000, polling: 'raf' }).then(() => true, () => false)
      if (!mid) checks.push({ mark: `the ${m0.key}'s ${what}`, n: 1, diffs: [`its ${what} of ${m0.D.toFixed(1)}" never ${mode === 'burrow' ? 'sank' : 'lifted'} its figures`], figures: 0, at: 0 })
      await page.evaluate(() => window.__ts.player.snap(window.__ts.G))
      await hold(`the ${m0.key} snapped mid-${what} (${m0.D.toFixed(1)}")`)
      // another's walked out to its end, the table built by its events
      const m1 = await moveOf(mode, moved)
      if (m1) {
        moved.push(m1.body.u)
        why = await send(m1.body)
        if (why) throw new Error(`the second ${what} was refused: ${why}`)
        await idle()
        await hold(`the ${m1.key}'s ${what} played out (${m1.D.toFixed(1)}")`)
      }
    }
    await page.evaluate(() => window.__ts.player.snap(window.__ts.G))
    await hold('snapped in place')
    const r = { checks, error: errors.length ? errors.join('\n') : null }
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// what the races' row says is wrong ('' when nothing is)
function judgeRaces(r) {
  if (r.error) return r.error.split('\n')[0]
  const why = []
  for (const w of ['tunnel', 'flight']) if (!r.checks.some((c) => new RegExp(`snapped mid-${w}`).test(c.mark))) why.push(`board: no snap mid-${w}`)
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.unshift(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  return why.join('; ')
}

// (F7c) The collapse row (above): the battle made in Node on the code in
// `dir`, then played in the page at COLLAPSE_SPEED. Returns { it, r }: the
// battle as an item of the corpus (its hashes Node's), and run's result.
async function collapseRow(browser, url, dir) {
  const k = COLLAPSE_SEED, rnd = mulberry32(9000 + k)
  const setup = { ...setupFor('hotseat', 1 + Math.floor(rnd() * 99999), 1 + Math.floor(rnd() * 999999)), terrain: 'fortified' }
  const node = await runOracle({ setup, bot: { policy: 'collapse', seed: k } }, dir)
  const it = { id: `hotseat-collapse-${k}`, kind: 'human', mode: 'hotseat', n: node.trace.length, trace: hashLines(node.trace), shadow: hashLines(node.shadow), written: hashLines(node.written), job: { setup, entries: node.entries } }
  return { it, r: await run(browser, url, it, { speed: COLLAPSE_SPEED }) }
}
// what the collapse row says is wrong ('' when nothing is): every battle's
// judgement (judge), and that it saw what it is for
function judgeCollapse(it, r) {
  // (a check that differs stopped the battle there: that is the verdict)
  const bad = r.checks.filter((c) => c.n)
  if (!r.error && bad.length) return `${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`
  const why = judge(it, r)
  if (why || r.error) return why
  const after = r.checks.filter((c) => c.falls > 0 && c.stage !== 'in place').length
  if (!(r.decks > 0) || !(r.falls > 0) || !after) return `board: ${r.decks ?? 0} platforms fell and ${r.falls ?? 0} units with them, ${after} checks after a fall (a platform falling with a unit on it, and the table checked after)`
  return ''
}

// what the cart row says is wrong ('' when nothing is)
function judgeCart(r) {
  if (r.error) return r.error.split('\n')[0]
  const why = []
  if (r.mission !== 'field' || r.carts < 1) why.push(`board: the battle was a ${r.mission} one with ${r.carts} War-Carts (a Field battle, two)`)
  if (!r.checks.some((c) => c.riders > 0)) why.push('board: no checkpoint had a unit aboard a War-Cart')
  // ((F9a's integration) riders stepping off, not bailing out: the AI's
  // riders step off to shoot by their first turns, so in its battles a hull
  // dies with nobody aboard; the bail-out is the vehicle/ corpus's log's,
  // a default row)
  if (!r.checks.some((c) => c.wrecks > 0) || !(r.steps + r.bails)) why.push(`board: ${r.checks.some((c) => c.wrecks > 0) ? 'a wreck' : 'no wreck'} and ${r.steps} step-offs and ${r.bails} bail-outs (a wreck, and riders off a deck)`)
  why.push(...deckWhy(r))
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.unshift(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  return why.join('; ')
}
// (F9c) what a watched battle with hulls must have seen of its decks' fire:
// shots from a deck, and a check after one with riders' figures turned
function deckWhy(r, what = 'War-Cart') {
  const out = []
  if (!(r.deck > 0)) out.push(`board: no shot from a ${what}'s deck`)
  else if (!r.checks.some((c) => c.deck > 0 && c.turned > 0)) out.push(`board: ${r.deck} shots from a ${what}'s deck and no check with a rider's figures turned to its target`)
  return out
}

// what the Grand row says is wrong ('' when nothing is)
// (F9b) the Howdah row's verdict: two Howdahs, riders aboard, each hold
// the same, the mid-pivot snap among them
function judgeHowdah(r) {
  if (r.error) return r.error.split('\n')[0]
  const why = []
  if (r.hulls !== 2) why.push(`board: ${r.hulls} Howdahs on seat 0 (two)`)
  if (!r.checks.some((c) => c.riders > 0)) why.push('board: no check had a unit aboard a Howdah')
  if (!r.checks.some((c) => /mid-pivot/.test(c.mark))) why.push('board: no snap mid-pivot')
  if (r.checks.some((c) => c.hulls < 2)) why.push(`board: a check held ${Math.min(...r.checks.map((c) => c.hulls))} Howdah figures`)
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.unshift(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  // ((F9c) its watched battle's decks, held as the cart row's table is)
  const w = r.watch
  if (!w) why.push('board: no watched battle of the Howdahs')
  else if (w.error) why.push(`watched: ${w.error.split('\n')[0]}`)
  else {
    if (w.carts < 1 || !w.checks.some((c) => c.riders > 0)) why.push(`board: the watched battle had ${w.carts} Howdahs, ${w.checks.some((c) => c.riders > 0) ? '' : 'no '}riders aboard`)
    why.push(...deckWhy(w, 'Howdah'))
    const wb = w.checks.filter((c) => c.n)
    if (wb.length) why.unshift(`watched: ${wb.length} of ${w.checks.length} checks differ; first at ${wb[0].mark} (${wb[0].n} differences): ${wb[0].diffs.slice(0, 4).join('; ')}`)
  }
  return why.join('; ')
}

function judgeGrand(r) {
  if (r.error) return r.error.split('\n')[0]
  const [title, grand, classic, again] = r.boards.map(([, b]) => b)
  const why = []
  if (title.W !== 40 || title.builds !== 0) why.push(`the title's table is ${title.W}" wide, made over ${title.builds} times (classic's, never)`)
  if (grand.W !== 80 || grand.H !== 56 || grand.builds !== 1) why.push(`the grand battle's table is ${grand.W}×${grand.H}, made over ${grand.builds} times (80×56, once)`)
  if (classic.W !== 40 || classic.H !== 28 || classic.builds !== 2) why.push(`the classic battle after it is on a ${classic.W}×${classic.H} table, made over ${classic.builds} times (40×28, twice)`)
  if (classic.tiles.tiles || again.tiles.tiles) why.push(`a classic table holds ${classic.tiles.tiles || again.tiles.tiles} terrain tiles (none)`)
  const grandChecks = r.checks.filter((c) => c.board === 80)
  if (!grandChecks.length || !grandChecks.every((c) => c.tiled > 0)) why.push(`${grandChecks.length} checks on the Grand table, ${grandChecks.filter((c) => !c.tiled).length} of them with no chunk in a tile`)
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.push(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} on the ${bad[0].board === 80 ? 'Grand' : 'classic'} table (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  // ((V3d) the fires: some on the Powder Field's table at every check, none
  // on a classic one)
  const lit = r.checks.filter((c) => c.board !== 80 && c.vents)
  if (lit.length) why.push(`board: ${lit.length} checks on the classic table with fires burning (${lit[0].vents} vents at ${lit[0].mark})`)
  if (r.mission === 'powder' && grandChecks.some((c) => !c.vents)) why.push(`board: ${grandChecks.filter((c) => !c.vents).length} checks on the Powder Field with no fire burning`)
  return why.length ? `${why[0].includes('checks differ') ? '' : 'board: '}${why.join('; ')}` : ''
}

// what one battle's run says is wrong ('' when nothing is)
function judge(it, r) {
  const v = r.error ? null : verdict(it, r)
  const bad = r.checks.filter((c) => c.n)
  const played = r.checks.filter((c) => c.stage !== 'in place')
  const held = played.filter((c) => c.stage === 'checkpoint').length, drained = played.length - held
  return r.error ? r.error.split('\n')[0] : !v.ok ? `the battle differs from the corpus (trace line ${v.line}, shadow ${v.shadow}, write ${v.written})` : !held || !drained ? `${held} checkpoints and ${drained} drained queues checked` : played.at(-1).stage !== 'over' ? 'no check at the end' : r.checks.at(-1).stage !== 'in place' ? 'no snap in place' : bad.length ? `${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}` : ''
}

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-snap-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
if (a['self-test']) {
  const corpus = loadCorpus().items
  const on = (name) => MUTATIONS[name][3] ?? SELF_TEST_ON
  // ((V3a) --mutations: those edits alone)
  const names = a.mutations ? a.mutations.split(',').map((x) => x.trim()) : Object.keys(MUTATIONS)
  const unknown = names.filter((x) => !MUTATIONS[x])
  if (unknown.length) {
    console.error(`snap-check: no edit ${unknown.join(', ')} (${Object.keys(MUTATIONS).join(', ')})`)
    process.exit(2)
  }
  // the unedited code first, on every battle an edit runs on
  const battles = [...new Set([SELF_TEST_ON, ...names.map(on)])]
  const runs = [...battles.map((id) => ['unedited', id]), ...names.map((name) => [name, on(name)])]
  let missed = 0
  console.log(`snap-check self-test: ${names.length} edits of the view, each on ${SELF_TEST_ON} unless it names another, after the unedited code on ${battles.join(' and ')}`)
  try {
    for (const [k, [name, id]] of runs.entries()) {
      const it = ROWS.has(id) ? null : corpus.find((x) => x.id === id)
      const dir = copyCode(PKG, join(work, `${k}`))
      if (name !== 'unedited') {
        const [f, from, to] = MUTATIONS[name]
        const src = readFileSync(join(dir, f), 'utf8')
        if (src.split(from).length !== 2) throw new Error(`snap-check self-test: ${name} finds no single "${from.trim().slice(0, 60)}" in ${f}`)
        writeFileSync(join(dir, f), src.replace(from, to))
      }
      const served = await startStaticServer(await buildApp(dir, join(work, `${k}-dist`)))
      let r, fell = null
      try {
        if (id === 'collapse') {
          fell = await collapseRow(browser, served.url, dir)
          r = fell.r
        } else r = it ? await run(browser, served.url, it) : id === 'cart' ? await cartRow(browser, served.url) : id === 'howdah' ? await howdahRow(browser, served.url) : id === 'races-row' ? await racesRow(browser, served.url) : await grandRow(browser, served.url, id === 'powder-row' ? 'powder' : undefined)
      } catch (e) {
        r = { error: e.message, checks: [] }
      } finally {
        served.close()
      }
      const why = fell ? judgeCollapse(fell.it, r) : id === 'collapse' ? (r.error ?? 'no run').split('\n')[0] : it ? judge(it, r) : id === 'cart' ? judgeCart(r) : id === 'howdah' ? judgeHowdah(r) : id === 'races-row' ? judgeRaces(r) : judgeGrand(r)
      const ok = name === 'unedited' ? !why : /checks differ|^board: /.test(why)
      if (!ok) missed++
      console.log(`  ${ok ? (name === 'unedited' ? 'passes' : 'caught') : 'WRONG '} ${name.padEnd(16)} ${id.padEnd(23)} ${(why || `the same at ${r.checks.length} checks`).slice(0, 220)}`)
      if (name === 'unedited' && !ok) break
    }
  } finally {
    await browser.close()
    rmSync(work, { recursive: true, force: true })
  }
  console.log(missed ? `\nsnap-check self-test FAILED: ${missed} wrong verdict(s)` : '\nsnap-check self-test passed: the unedited code passes, and every edit is caught')
  process.exit(missed ? 1 : 0)
}
const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
const { url, close } = await startStaticServer(dist)
console.log(`snap-check: ${items.length} battles in Chromium ${browser.version()}, the table built event by event against a fresh snap of the match (and one kept and synced again) whenever the player has drained its queue, and at every checkpoint on the way`)
let failed = 0, checks = 0, figures = 0, chunks = 0
try {
  for (const it of items) {
    let r
    try {
      r = await run(browser, url, it)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const played = r.checks.filter((c) => c.stage !== 'in place')
    const held = played.filter((c) => c.stage === 'checkpoint').length, drained = played.length - held
    const why = judge(it, r)
    if (why) failed++
    checks += r.checks.length
    const last = played.at(-1), snapped = r.checks.at(-1)
    if (last) (figures += last.figures), (chunks += last.chunks)
    console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${drained} drained queues and ${held} checkpoints, and snapped in place (${snapped.marks} fx marks taken away) (at the end ${last.units} units, ${last.figures} figures standing, ${last.shown} of ${last.chunks} chunks shown; ${r.secs} s)`}`)
  }
  if (GRAND_ROW) {
    let r
    try {
      r = await grandRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [], boards: [] }
    }
    const why = judgeGrand(r)
    if (why) failed++
    checks += r.checks.length
    const g = r.checks.filter((c) => c.board === 80)
    console.log(`  grand ${'classic → Grand → classic'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the table made over for each board (${r.boards.map(([w, b]) => `${w} ${b.W}×${b.H}`).join(', ')}), the same at ${g.length} Grand checkpoints and ${r.checks.length - g.length} classic ones, the tiles drawn as their chunks at each (${g.at(-1)?.tiled} chunks in ${g.at(-1)?.tiles} tiles at the end), and none left on the classic table (${r.secs} s)`}`)
  }
  if (CART_ROW) {
    let r
    try {
      r = await cartRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const why = judgeCart(r)
    if (why) failed++
    checks += r.checks.length
    console.log(`  cart  ${'Field, two War-Carts'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${r.checks.length - 1} checkpoints (riders aboard at ${r.checks.filter((c) => c.riders > 0).length}, up to ${Math.max(...r.checks.map((c) => c.riders))} units; a wreck standing at ${r.checks.filter((c) => c.wrecks > 0).length}), ${r.steps} step-offs and ${r.bails} bail-outs played, (F9c) ${r.deck} shots from a deck, riders' figures turned to their targets at ${r.checks.filter((c) => c.turned > 0).length} checkpoints and ${r.resets} turned back by their hull's move, and snapped in place (${r.secs} s)`}`)
  }
  if (HOWDAH_ROW) {
    let r
    try {
      r = await howdahRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const why = judgeHowdah(r)
    if (why) failed++
    checks += r.checks.length
    console.log(`  hull  ${'Field, two Howdahs'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${r.checks.length} checks (${r.checks.map((c) => c.mark).join('; ')}), riders aboard at ${r.checks.filter((c) => c.riders > 0).length}, each Howdah's figure turned as its heading (${r.secs} s: the checks at ${r.checks.map((c) => Math.round(c.at / 1000)).join(', ')} s); (F9c) its watched battle the same at ${r.watch.checks.length - 1} checkpoints, ${r.watch.deck} shots from a Howdah's deck, riders' figures turned to their targets at ${r.watch.checks.filter((c) => c.turned > 0).length} and ${r.watch.resets} turned back by their hull's move (${r.watch.secs} s)`}`)
  }
  if (COLLAPSE_ROW) {
    let it = null, r
    try {
      ({ it, r } = await collapseRow(browser, url, PKG))
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const why = it ? judgeCollapse(it, r) : (r.error ?? 'no run').split('\n')[0]
    if (why) failed++
    checks += r.checks.length
    const played = r.checks.filter((c) => c.stage !== 'in place'), last = played.at(-1)
    console.log(`  fall  ${(it?.id ?? 'hotseat-collapse').padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${played.length} checks (${played.filter((c) => c.falls > 0).length} after a fall), the page's battle Node's, ${r.decks} platforms fallen and ${r.falls} units with them, played at speed ${COLLAPSE_SPEED} without ?fast, and snapped in place (at the end ${last.figures} figures standing, ${last.shown} of ${last.chunks} chunks shown; ${r.secs} s)`}`)
  }
  if (RACES_ROW) {
    let r
    try {
      r = await racesRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const why = judgeRaces(r)
    if (why) failed++
    checks += r.checks.length
    console.log(`  races ${'the Hive v the Aerie'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${r.checks.length} checks (${r.checks.map((c) => c.mark).join('; ')}) (${r.secs} s)`}`)
  }
  if (POWDER_ROW) {
    let r
    try {
      r = await grandRow(browser, url, 'powder')
    } catch (e) {
      r = { error: e.message, checks: [], boards: [] }
    }
    const why = judgeGrand(r)
    if (why) failed++
    checks += r.checks.length
    const g = r.checks.filter((c) => c.board === 80)
    console.log(`  powder ${'classic → Powder → classic'.padEnd(23)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the table made over for each board (${r.boards.map(([w, b]) => `${w} ${b.W}×${b.H}`).join(', ')}), the same at ${g.length} Powder Field checkpoints and ${r.checks.length - g.length} classic ones, the tiles drawn as their chunks at each (${g.at(-1)?.tiled} chunks in ${g.at(-1)?.tiles} tiles at the end), fires burning at each (${Math.min(...g.map((c) => c.vents))}-${Math.max(...g.map((c) => c.vents))} vents) and none on the classic table (${r.secs} s)`}`)
  }
} finally {
  await browser.close()
  close()
  rmSync(work, { recursive: true, force: true })
}
console.log(failed ? `\nsnap-check FAILED: ${failed} of ${items.length + (GRAND_ROW ? 1 : 0) + (CART_ROW ? 1 : 0) + (HOWDAH_ROW ? 1 : 0) + (COLLAPSE_ROW ? 1 : 0) + (RACES_ROW ? 1 : 0) + (POWDER_ROW ? 1 : 0)} rows` : `\nsnap-check passed: ${checks} checks over ${items.length} battles${GRAND_ROW ? ' and the Grand row' : ''}${CART_ROW ? ' and the cart row' : ''}${HOWDAH_ROW ? ' and the Howdah row' : ''}${COLLAPSE_ROW ? ' and the collapse row' : ''}${RACES_ROW ? ' and the races\' row' : ''}${POWDER_ROW ? ' and the Powder Field\'s row' : ''}, the table as built is the table a snap builds every time the player drains, and at every checkpoint on the way, and each battle's table snapped in place at its end is a fresh snap's, with no fx mark left`)
process.exit(failed ? 1 : 0)
