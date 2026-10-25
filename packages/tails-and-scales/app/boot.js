import * as THREE from 'three'
import { OBJECTIVE_RANGE } from '../core/rules.js'
import { RACES } from '../data/schema.js'
import { MISSIONS, CLASSIC } from '../data/mission.js'
import { EDGES, NAV_CELL, refreshNav } from '../core/match.js'
import { preview, q, stateHash } from '../core/index.js'
import { gridSize } from '../core/nav.js'
import { project } from '../present/mirror.js'
import { View } from '../view/index.js'
import { TerrainView } from '../view/terrain.js'
import { UnitViews } from '../view/units.js'
import { clock } from '../view/clock.js'
import { Picker } from '../input/picking.js'
import { Human } from '../input/human.js'
import { Selection } from '../input/selection.js'
import { GroupInput } from '../input/group.js'
import { OrderBook } from '../input/book.js'
import { StandingInput } from '../input/standing.js'
import { seatsOf, sidesFor, isMirror } from '../ui/theme.js'
import { Tray } from '../ui/tray.js'
import { BattleLog } from '../ui/log.js'
import { Card } from '../ui/card.js'
import { Tooltip } from '../ui/tooltip.js'
import { Banner } from '../ui/banner.js'
import { Toast } from '../ui/toast.js'
import { Hud } from '../ui/hud.js'
import { Actions } from '../ui/actions.js'
import { GroupBar } from '../ui/groupbar.js'
import { TitleScreen } from '../ui/screens/title.js'
import { ResultScreen } from '../ui/screens/result.js'
import { wireHelp } from '../ui/screens/help.js'
import { ReplayBar } from '../ui/replaybar.js'
import { SetupScreen } from '../ui/screens/setup.js'
import { Flow, MODES } from './flow.js'
import { Replay, openReplay } from './replay.js'
import { Session } from '../match/session.js'

// ---------------------------------------------------------------------------
// Tails & Scales — a pocket-sized tabletop wargame.
//
// Two armies, alternating player turns, each turn run through five phases:
// Movement → Shooting → Charge → Fight → Morale. Units are squads of models
// that move as a disc; every attack is rolled hit → wound → save → damage and
// the dice are shown. Blast weapons drop a template that can scatter, hurts
// whoever is underneath (friends included) and breaks the scenery.
//
// The page boots here (main.js calls boot(location)): the URL's parameters,
// the view made in its order (view/index.js), the UI (ui/), the local human
// (input/), the flow from the title screen to a battle and back
// (app/flow.js), the title's table, the frame loop, and under ?debug the
// table exposed to the console and to sim/ (window.__ts, below).
//
// The URL: ?seed=N the title's board (else a random one), ?dice=N every
// battle's dice (else fresh ones per battle), ?races=<seat 0>,<seat 1> the
// races at the table, ?watch a watched battle at once, ?lowfi no shadows
// and a pixel ratio of 1, ?fast nothing drawn and game time effectively
// instant (a test mode), ?debug the hooks; (N2) ?sync=<ws url> the sync
// server a battle hosted here uses; (F8a) ?mission=<name> the mission a
// battle started here is fought for; (F7a) ?terrain=<set> the terrain set
// a battle started here is fought on (the battle-setup panel's default; the
// title's table stays the mission's first set's). The fragment
// `#m=<id>` (N2) opens an online match (`&dev=<id>` plays it as that
// device, `&sync=` through that
// server): app/online.js, loaded only then or for Play online.
// ---------------------------------------------------------------------------

// (F8a) The table is made for the classic mission's board, the title's
// (so its 1200 ms frame stays the one sim/title-shot.mjs holds); a battle
// whose mission chooses another rebuilds it as it starts (view/index.js's
// setBoard, from the snap)
const { W, H } = MISSIONS.classic.board
const $ = (s) => document.querySelector(s)

// The races at the table: the classic Bushtails-versus-Coil matchup
// (data/mission.js), or any pair a ?races=<seat 0>,<seat 1> URL names (e.g.
// ?races=serpent,serpent), until the title screen gets a race picker. A
// value naming no two races gets the classic matchup and a line on the title
// card saying why, not a page that never starts (sim/mirror-check.mjs fails
// a run whose log shows other races than it asked for).
// (F8a) The mission a battle started here is fought for: classic, or one a
// ?mission=<name> URL names (data/mission.js; only classic ships until
// F8b, so this is the door sim/'s Chromium runs start another board's
// battles by, from a build of their own). A name no mission has gets the
// classic mission and a line on the title card saying why.
function missionPick(params, title) {
  if (!params.has('mission')) return 'classic'
  const pick = params.get('mission').trim().toLowerCase()
  if (pick in MISSIONS) return pick
  const msg = `?mission= takes one of ${Object.keys(MISSIONS).join(', ')}, not "${params.get('mission')}"`
  console.warn(`${msg}: playing the classic mission`)
  title.note(`${msg}, so this is the classic mission.`)
  return 'classic'
}

// (F7a) The terrain set a battle started here is fought on, the
// battle-setup panel's default: each mission's first, or one a
// ?terrain=<set> URL names, as ?mission= names the
// mission (the door sim/'s Chromium runs start a fortified battle by). A set
// the mission isn't fought on gets its first and a line on the title card.
function terrainPick(params, title, mission) {
  if (!params.has('terrain')) return null
  const pick = params.get('terrain').trim().toLowerCase(), sets = MISSIONS[mission].sets
  if (sets.includes(pick)) return pick
  const msg = `?terrain= takes one of ${sets.join(', ')} (the ${mission} mission's terrain), not "${params.get('terrain')}"`
  console.warn(`${msg}: playing on ${sets[0]}`)
  title.note(`${msg}, so a battle here is fought on ${sets[0]}.`)
  return null
}

function racePick(params, title) {
  if (!params.has('races')) return CLASSIC
  const pick = params.get('races').split(',').map((r) => r.trim().toLowerCase())
  if (pick.length === 2 && pick.every((r) => RACES[r])) return pick
  const msg = `?races= takes two of ${Object.keys(RACES).join(', ')}, comma-separated, not "${params.get('races')}"`
  console.warn(`${msg}: playing the classic matchup`)
  title.note(`${msg}, so this is the classic matchup.`)
  return CLASSIC
}

export function boot(location) {
  const params = new URLSearchParams(location.search)
  // ?fast: a test mode that skips drawing and lets game time run
  // effectively instantly (view/stage.js)
  const FAST = params.has('fast')
  // (the flow, made below: what the view's colours read once it is drawn)
  let flow = null
  const colorOf = (s) => flow.sides[s].color

  // ── The view (view/index.js), made in its old order ───────────────────────
  // The renderer and scene, the camera and its controls, the lights, the
  // effects, the table, the objectives and the battlefield; then the title's
  // board seed (a Math.random draw, where it always came); then (below) the
  // figures, the shooting's effects and the overlay: the same three.js
  // objects, materials and Math.random draws as before R7, in the same order.
  const view = new View({ lowfi: params.has('lowfi'), fast: FAST, W, H, deploy: MISSIONS.classic.deploy, edges: EDGES, objectives: MISSIONS.classic.objectives, range: OBJECTIVE_RANGE, colorOf })
  // (Every seed the page takes is made a whole number from 0 to 2^32 - 1, as
  // a setup's must be, with `>>> 0`: what the board's and the dice's
  // generators always did with a seed, so ?seed=-5 is still the board -5
  // drew.)
  const seed = (Number(params.get('seed')) || ((Math.random() * 1e6) | 0)) >>> 0

  // ── The UI (ui/) and the flow (app/flow.js) ──────────────────────────────
  const title = new TitleScreen()
  const races = racePick(params, title)
  const ui = {
    tray: new Tray($('#tray')),
    log: new BattleLog($('#logList'), () => flow.traceListener),
    card: new Card({
      el: $('#card'), sides: () => flow.sides, shown: (u) => view.units.shown(u.id), live: () => flow.player.idle, ask: (fn) => preview(flow.atTable(), fn), facts: () => flow.facts,
      // (F10c) its standing order, on the units of a seat played here; its
      // buttons give the unit on the card one
      orders: (u) => (flow.session?.localSeats.includes(u.side) && u.alive > 0 ? { k: human.standing.book.get(u.side, u.id)?.k ?? null, can: human.standing.seat() === u.side } : null),
      onOrder: (u, k) => {
        if (!human.standing.picked().some((x) => x.id === u.id)) human.select(u)
        human.standing.order(k)
        // (its row shows the order it now holds)
        ui.card.show(u)
      },
    }),
    tooltip: new Tooltip($('#tooltip')),
    banner: new Banner($('#banner')),
    toast: new Toast($('#toast')),
    hud: new Hud(),
    actions: new Actions(),
    groupbar: new GroupBar(),
    title,
    result: new ResultScreen(),
  }
  const mission = missionPick(params, title)
  flow = new Flow({ view, ui, params, seed, races, mission, terrain: terrainPick(params, title, mission) })
  // each seat's look on the page, and the zones in its colour (ui/theme.js)
  flow.seatPlayers(seatsOf(races))
  // ((F6) a mirror match's east army on broader rims: ui/theme.js's mirror)
  view.figures({ mirror: () => flow.player.mirror, colorOf, rimOf: (s) => (s === 1 && flow.sides[1].mirror ? 2.4 : 1), W, H, grid: gridSize(W, H, NAV_CELL) })

  // ── The local human (input/), the player, the buttons ─────────────────────
  const picker = new Picker({ camera: view.camera, units: view.units, board: view.table.board, unitOf: (id) => flow.unitById(id), tops: () => view.terrain.tops() })
  const human = new Human({ flow, view, card: ui.card, tooltip: ui.tooltip, picker })
  const player = flow.play(human)
  // (F10a) units picked up together, and the bar that says what they do
  human.group = new GroupInput({ human, view, selection: new Selection(), controls: view.rig.controls, bar: ui.groupbar, tooltip: ui.tooltip })
  human.group.wireBar()
  // (F10c) the standing orders, each seat's in this device's book
  human.standing = new StandingInput({ human, book: new OrderBook(), toast: ui.toast })
  $('#selectMode').onclick = () => {
    human.group.setSelectMode(!human.group.selectMode)
    $('#selectMode').classList.toggle('on', human.group.selectMode)
  }
  human.listen(view.renderer.domElement)
  ui.actions.wire(human)
  ui.hud.wire({ rig: view.rig, player, standing: human.standing })
  wireHelp()
  // (N2) online play: app/online.js, the net layer and Automerge loaded the
  // first time they are wanted (Play online, a #m= link), never for a game
  // played here
  let online = null
  const goOnline = (how) => {
    // (F6) a #m= link opened over the battle-setup panel puts it away: the
    // lobby or the match takes the page
    if (setup.up) {
      setup.hide()
      title.show()
    }
    const go = async () => {
      if (!online) {
        const { Online, loadNet } = await import('./online.js')
        await loadNet()
        online ??= new Online({ flow, params })
      }
      return how === 'host' ? online.host() : online.route()
    }
    return go().catch((err) => {
      console.error(err)
      ui.toast.show(`Online play failed: ${err.message}`, 8000)
    })
  }
  // (N3) the replay (app/replay.js): the end screen's Watch the replay, and
  // a replay file opened from the title, watched from its start
  const replay = new Replay({ flow, bar: new ReplayBar() })
  flow.replay = replay
  const watchFile = (text) => {
    const { store, why } = openReplay(text)
    const ses = store && new Session({ store, dev: 'replay' })
    if (!ses?.G) {
      ses?.close()
      return ui.toast.show(`That replay can't be watched: ${why ?? ses.error ?? `the battle is ${ses.status}`}`, 8000)
    }
    flow.follow(ses, null)
    replay.open(ses)
    replay.fromStart()
  }
  // (F6) The battle-setup panel: a mode button opens it, each seat's race
  // the table's (?races=, else the classic matchup; then the last chosen),
  // and its Start begins that mode's battle with the races picked.
  const setup = new SetupScreen({ diorama: () => view.diorama })
  const SETUP = { bushtail: 'Against the AI: you hold the west edge', serpent: 'Against the AI: you hold the east edge', hotseat: 'Two players, one screen', watch: 'Watch the AI fight' }
  const whoOf = (mode, s) => (mode === 'hotseat' ? `Player ${s + 1}` : MODES[mode][s] === 'human' ? 'You' : 'The AI')
  let picking = null
  // ((F7a) and the terrain line: the mission's sets, the table's picked)
  const showSetup = () => {
    const { mode, races } = picking, seats = seatsOf(races), sides = sidesFor(seats)
    setup.show({ title: SETUP[mode], seats: races.map((race, s) => ({ who: whoOf(mode, s), race, color: sides[s].color })), mirror: isMirror(seats), terrain: { sets: MISSIONS[flow.mission].sets, pick: picking.terrain } })
  }
  const openSetup = (mode) => {
    picking = { mode, races: [...flow.races], terrain: flow.terrainOf() }
    title.away()
    showSetup()
  }
  setup.wire({
    pick: (s, race) => {
      picking.races[s] = race
      showSetup()
    },
    terrain: (set) => {
      picking.terrain = set
      showSetup()
    },
    start: () => {
      setup.hide()
      try {
        flow.start(picking.mode, picking.races, picking.terrain)
      } catch (err) {
        title.show()
        ui.toast.show(err.message, 8000)
      }
    },
    back: () => {
      setup.hide()
      title.show()
    },
  })
  title.wire({ S: flow.S, showTable: (b) => flow.showTable(b), start: (mode) => openSetup(mode), online: () => goOnline('host'), replay: watchFile })
  ui.result.wire(() => flow.back(), (more) => human.vote(more), () => {
    if (!flow.battle) return
    replay.open(flow.battle)
    replay.fromStart()
  })

  // ── Boot ──────────────────────────────────────────────────────────────────
  // The title's table, then the frame loop (view/stage.js): each frame the
  // effects, the figures and the flags as shown, then the camera.
  flow.showTable(flow.S.seed)
  view.run({ mirror: () => player.mirror, sel: () => human.sel?.id })
  if (params.has('watch')) flow.start('watch')
  addEventListener('hashchange', () => {
    if (online || /[#&]m=/.test(location.hash)) goOnline()
  })
  if (/[#&]m=/.test(location.hash)) goOnline()
  // ?debug exposes the table to the console (and to the test harness)
  if (params.has('debug')) {
    // The input hooks are the calls a click or a button makes, so sim/ can
    // play a human seat headlessly; without ?debug none of this exists.
    // What sim/ reads (oracle/human-bot.mjs, oracle/shadow.mjs, chromium.mjs):
    // S.{stage,deploySide,phase,active,round,first,vp,wiped,busy,auto,reach,
    // control}; trace, whose push it wraps; units[].{id,side,pos,r,alive,lost,
    // mesmerized,flags,models[].{alive,w,ox,oz},t.{M,W,ranged}};
    // scenery.chunks[].{alive,hp,shape.{x,y,z,yaw}}; nav.{x,z,index,N,W,H};
    // validEnd(plan, i) with plan.res.dist; phaseResolve; chargePick.{u,
    // plan.cell,ok}; start and the input hooks below; and every q member with
    // today's arity and results: alive, isEngaged, canAct truthy or not;
    // shootTargets and chargeTargets arrays of the units[] objects themselves;
    // shotInfo(u, tg).ok; chargePlan(u, tg) null when no spot is reachable,
    // else a plan with .need; freeSpot(...) null or {x, z}; movePlan(u, extra)
    // the plan validEnd takes; rngState() as the trace prints it. Replaying a
    // log needs the hooks, alive, isEngaged, canAct, shotInfo().ok,
    // chargeTargets, chargePlan's null and rngState(); the rest feeds only the
    // corpus policies (run on the PIN), so parity won't notice a reshape of
    // those. Outside __ts it wraps #logList's prepend (the battle log) and, in
    // Chromium, presses #title's [data-mode] buttons. When internals move,
    // later steps keep this surface working here, inside this block, never by
    // editing sim/oracle: the PIN and the working tree share a driver. (Until
    // R7b this block was main.js's; app/boot.js holds it now, the page's
    // parts named below as they were there.)
    //
    // Since R6b the surface is derived from the battle's Session (no battle on
    // the title: its members read the backdrop there, and S.stage says
    // 'title'). The hooks are wrappers that build a command body and send it
    // through the Session (the local human's own command functions,
    // input/human.js: moveTo, shoot, …), returning a promise settled once the
    // player has played everything again (doCharge's: once no charge waits
    // for its end either, so it stays pending until the chargeEnd is placed,
    // as the old pick did); a hook's command the match refuses throws, since
    // the driver checked it as the UI does, and so does a button pressed when
    // it can't send (every hook's: deployClick's placement and the buttons'
    // too). deployClick keeps its pick-up-then-place pair, ending in a `place`
    // for freeSpot's cell (a spot too far from the click is still the UI's
    // no-op, which the driver sees for itself); placeCharge takes a cell the
    // roll reaches, never Shortest move's -1 (the driver sends the plan's own
    // cell for that, as a click on it would); endPhase and autoPhase press the
    // buttons. Derived, never stored: phaseResolve is truthy while a seat
    // played here holds a phase decision and the player is idle (the local
    // human's myTurn, its mode 'phase'); chargePick is {u, plan, ok} while one
    // holds a chargeEnd and the player is idle (the charge-end tool's pick:
    // plan.cell the shortest move's, ok a 1 per cell the roll reaches); S.busy
    // and S.auto are !player.idle; S.deploySide is the seat deploying here.
    // S's turn fields read the match (G.turn; wiped undefined until a side is
    // wiped, -1 in G.turn; the phase the key of G.turn.ph), except that
    // S.stage says 'over' only once the page has shown the end (the player
    // idle, every trace line joined), since sim/ stops reading there; until
    // then 'battle'. units, nav and scenery.chunks are the match's, and the
    // queries take it (q.canAct: (u) => canAct(G, u)), asked with the dice
    // locked. S lists and copies as a plain object would ({...S}, JSON), turn
    // fields included, though structuredClone refuses it, as it does any
    // Proxy. (Its own fields are the flow's seed and control and the local
    // human's selection: sel, reach, hover, hoverPick, mouse.)
    //
    // The trace is one array for the page's lifetime, fed by each battle's
    // onTrace (createMatch's, which the Session passes: the flow's, which
    // hands each line to the listener below) as the match writes a line, and
    // emptied when start() begins a battle. The match runs ahead of the view:
    // one `end` computes a whole AI turn, a watched battle the whole battle,
    // before its first die is shown. So the trace keeps pace with the player:
    // a line the match writes while the player is behind it (events not yet
    // played) joins `trace` when the player reaches it: at the log event that
    // shows it (each carries `at`, the trace's length when it was logged, and
    // `trace` is brought up to `at` before the entry is written, which
    // carries it too, as data-at), or when the player goes idle. sim/ then
    // records every write at the trace length it always did. It takes a state
    // line's shadow as the line joins (oracle/shadow.mjs reads S,
    // q.rngState(), units and scenery.chunks then), when the match has long
    // moved on; so each state line carries a snapshot of what that shadow
    // reads, taken as the match writes the line (the turn as the legacy
    // shadow has it, the dice, every unit, every chunk), and while the line
    // is pushed those members serve the snapshot. (The legacy round quirk
    // too: one past the last on the `over` line of a battle that ran its
    // course, as sim/run.mjs's shadowPartsG has it.)
    //
    // Promised since R7, for the pixel gate (sim/terrain-shots.mjs; R3 left
    // them screenshot-only until R7 moved the clock and the camera into
    // view/): clock.speed and clock.time (view/clock.js), camera, renderer,
    // S.titleSpin (the camera rig's, view/camera.js: S keeps it, titleAngle,
    // viewShift and follow as members over the rig), scenery.scene and
    // scenery.blast (a blast played as core/actions/shoot.js's blastLands
    // plays one: its reports played, the nav refreshed; on the title only, on
    // the backdrop, which a start() then draws afresh: with a battle on it
    // throws, the battle's board changing only through its commands); and
    // every figure's root marked with userData.fig (view/models/cache.js),
    // which the gate hides figures by.
    //
    // Not promised: view.snapDiff() and view.pauseAtChecks(fn), for
    // sim/snap-check.mjs (the table built event by event against a fresh snap
    // of the match as it stands, or as it stood at a checkpoint, where fn
    // holds the player: below; sim/hud-check.mjs holds it there a frame, to
    // snap while the table is behind a placement or a charge's roll);
    // view.counts() and renderer.info, for sim/rematch-memory.mjs (and
    // view.counts().marks, fx's, and player.snap, for sim/snap-check.mjs's
    // snap in place, and sim/hud-check.mjs's snaps mid-battle, and player.q,
    // the events still to play, where sim/hud-check.mjs finds the game.over
    // a snap past the end drops; and hud, the HUD model last put on the
    // page, whose end.ready sim/hud-check.mjs holds to the match). Nor G and
    // session, for the console and for
    // sim/rematch-check.mjs (G.out, which it requires empty whenever the
    // player is idle and before each new table: the Session hands every
    // event over as it folds an entry; it also presses #again, #reroll and
    // #seed's onchange, and reads S.seed), nor player, which it reads for
    // that (player.idle). Nor, for sim/present-check.mjs,
    // present.listen(observer), present.card(u) (the unit card's status line
    // as it shows u now: it holds the card to the mirror, and to the facts of
    // the last action or stop played, while the player is behind), G (at the
    // game's end it holds its mirror to project(G)) and player.idle (at the
    // game's end): the observer's reset(M) hears the mirror of each snap (R7: the
    // player's snap(G), a new table's, the backdrop's at the title's stage,
    // and a battle's as it starts, the backdrop's again, the battle's table
    // before anything happened, which it folds its own from) and event(e, M)
    // every event as the player plays it, so it can hold its mirror to each
    // act's `proj` and to each `check {proj}`, which only ?debug carries:
    // P-present's checkpoints, put into each entry's events before the
    // player gets them (present(), below). The core can't project (present/
    // is above it), so onTrace takes project(G) as the match writes each
    // `act`, `phase` and `over` line, where it stands in the events so far: a
    // `check` there (after an action's own events, before its end re-reports
    // the flags and labels; after a fight or morale phase; before the end),
    // the `act` event's `proj` the act line's; and a `check` at the end of
    // each entry's events, as the match stops for a decision or ends. The M
    // it is handed is the player's own, folded in place (present/mirror.js):
    // an observer reads it and never folds into it, or every event would be
    // applied twice.
    const { alive, isEngaged, phaseKey, canAct, movePlan, validEnd, freeSpot, shotInfo, shootTargets, chargeTargets, chargePlan, rngState } = q
    // (the page's parts, by the names this block has always had)
    const { rig, scene, camera, controls, renderer, effects, units, terrain: terrainView, shots } = view
    const atTable = () => flow.atTable()
    const TURN = new Set(['stage', 'round', 'active', 'first', 'phase', 'vp', 'wiped'])
    // (the camera's, which S held until R7)
    const RIG = new Set(['titleSpin', 'titleAngle', 'viewShift', 'follow'])
    // (the local human's, which S held until R7b)
    const INPUT = new Set(['sel', 'reach', 'hover', 'hoverPick', 'mouse'])
    const DERIVED = {
      busy: () => !player.idle,
      auto: () => !player.idle,
      deploySide: () => (human.deploySeat() < 0 ? undefined : human.deploySeat()),
    }
    const trace = [], held = []
    // the state a state line carries, while it is pushed
    let serving = null
    // the page has shown everything: the player idle, every line joined
    const caughtUp = () => player.idle && !held.length
    const turn = (k) => {
      if (serving) return serving.turn[k]
      const g = atTable(), T = g.turn
      if (k === 'stage') return !flow.G ? 'title' : T.stage === 'over' && !caughtUp() ? 'battle' : T.stage
      return k === 'wiped' ? (T.wiped < 0 ? undefined : T.wiped) : k === 'phase' ? phaseKey(g) : T[k]
    }
    const legacyS = new Proxy(flow.S, {
      get: (s, k) => (TURN.has(k) ? turn(k) : Object.hasOwn(DERIVED, k) ? DERIVED[k]() : RIG.has(k) ? rig[k] : INPUT.has(k) ? human[k] : s[k]),
      has: (s, k) => TURN.has(k) || Object.hasOwn(DERIVED, k) || RIG.has(k) || INPUT.has(k) || k in s,
      set: (s, k, v) => {
        if (TURN.has(k)) throw new Error(`__ts.S.${k} is the match's ${k === 'phase' ? 'G.turn.ph (phaseKey)' : `G.turn.${k}`}: it can't be set through S`)
        if (Object.hasOwn(DERIVED, k)) throw new Error(`__ts.S.${k} is derived from the Session and the player: it can't be set`)
        if (RIG.has(k)) rig[k] = v
        else if (INPUT.has(k)) human[k] = v
        else s[k] = v
        return true
      },
      ownKeys: (s) => [...new Set([...Reflect.ownKeys(s), ...INPUT, ...TURN, ...Object.keys(DERIVED), ...RIG])],
      getOwnPropertyDescriptor: (s, k) =>
        TURN.has(k) ? { value: turn(k), enumerable: true, configurable: true, writable: false }
        : Object.hasOwn(DERIVED, k) ? { value: DERIVED[k](), enumerable: true, configurable: true, writable: false }
        : RIG.has(k) ? { value: rig[k], enumerable: true, configurable: true, writable: true }
        : INPUT.has(k) ? { value: human[k], enumerable: true, configurable: true, writable: true }
        : Reflect.getOwnPropertyDescriptor(s, k),
    })
    // the player is behind the match: events emitted and not yet played
    const behind = (g) => !!g.out?.length || !player.idle
    // What sim/oracle's shadow reads of the match as state line `line` is
    // written: the turn as the legacy shadow has it, the dice, every unit,
    // every chunk (copies: the match moves on).
    const snapshot = (g, line) => {
      const T = g.turn
      // (the old loop's `for` left the round one past the last on a battle
      // that ran its course: the engine ends one at its score step)
      const ranOut = /^over /.test(line) && T.step === 'score'
      return {
        turn: { stage: T.stage, round: ranOut ? T.round + 1 : T.round, active: T.active, phase: phaseKey(g), first: T.first, vp: [...T.vp], wiped: T.wiped < 0 ? undefined : T.wiped },
        rng: rngState(g.rng),
        units: g.units.map((u) => ({ ...u, pos: { ...u.pos }, flags: { ...u.flags }, models: u.models.map((m) => ({ ...m })) })),
        chunks: g.terrain.chunks.map((c) => ({ id: c.id, kind: c.kind, alive: c.alive, hp: c.hp, shape: { ...c.shape } })),
      }
    }
    // a line joins the trace, a state line with the state it carries
    const push = (line, snap) => {
      serving = snap
      try {
        trace.push(line)
      } finally {
        serving = null
      }
    }
    // P-present's checkpoints in the events so far: { at, proj, act }
    const marks = []
    // the hooks' promises, settled once the player is idle and `until()` holds
    const waiters = []
    const settle = (until = () => true) => new Promise((resolve) => {
      waiters.push({ until, resolve })
      flow.traceListener.settled()
    })
    flow.traceListener = {
      // (N2) a match followed from as it stands (an online match, a refold):
      // the trace is its trace so far, as written (none of it pushed again)
      rejoin: (g) => {
        trace.splice(0, trace.length, ...g.journal.trace)
        held.length = 0
        marks.length = 0
      },
      begin: () => {
        trace.length = 0
        held.length = 0
        marks.length = 0
        // a hook's promise left waiting by the battle a start() abandons is
        // settled now (its battle is gone), never left to wait on the next
        for (const w of waiters.splice(0)) w.resolve()
      },
      line: (line, g) => {
        const snap = /^log /.test(line) ? null : snapshot(g, line)
        if (/^(act|phase|over) /.test(line)) marks.push({ at: g.out.length, proj: project(g), act: /^act /.test(line) })
        if (held.length || behind(g)) held.push([line, snap])
        else push(line, snap)
      },
      // the log entry about to be written was logged at trace length `at`
      reach: (at) => {
        while (trace.length < at && held.length) push(...held.shift())
      },
      idle: () => {
        while (held.length) push(...held.shift())
      },
      settled: () => {
        if (!player.idle) return
        for (const w of waiters.splice(0)) {
          // (a test that throws settles its promise: this runs as the player
          // goes idle, inside whatever made it, a new table's drawing too)
          let done = true
          try {
            done = w.until()
          } catch {}
          if (done) w.resolve()
          else waiters.push(w)
        }
      },
      // An entry's events, with P-present's checkpoints put in: a `check` at
      // each mark, the act events given their act line's projection, and a
      // `check` with the match as it stops.
      present: (events, g) => {
        const out = [], projs = marks.filter((m) => m.act).map((m) => m.proj)
        let m = 0
        events.forEach((e, i) => {
          while (m < marks.length && marks[m].at <= i) out.push({ t: 'check', proj: marks[m++].proj })
          out.push(e.t === 'act' ? { ...e, proj: projs.shift() } : e)
        })
        while (m < marks.length) out.push({ t: 'check', proj: marks[m++].proj })
        out.push({ t: 'check', proj: project(g) })
        marks.length = 0
        return out
      },
    }
    // a hook's command must be one the match takes: the driver checked it as
    // the UI does, so a refusal is a bug, not a click to ignore
    const must = (why, what) => {
      if (why) throw new Error(`?debug ${what}: ${why}`)
    }
    // a question with the dice locked, of the match shown
    const asked = (fn) => preview(atTable(), fn)
    // The snap check (sim/snap-check.mjs, DESIGN §2.4): the table as the
    // player built it, event by event, against the table a snap of the match
    // as it stands builds (the player's rebuild, view/index.js's, into a
    // scene of its own, from nothing), and against one kept from the last
    // check and synced again (the snap's keeping path): every unit's ring
    // (place, size, colour and strength), hit cylinder, standing figures and
    // label, every chunk's mesh shown or not and where it stands, and what
    // the shooting holds outside the mirror (a template's marker, an
    // eruption's thorns: nothing, once the queue is drained, which a snap's
    // table holds too). Asked once the player is idle and the figures have
    // settled (a figure walks to its slot, a fallen one sinks out of sight,
    // over a few frames).
    const offTable = () => {
      const sc = new THREE.Scene()
      // (draws nothing: a rebuild throws no debris)
      const quiet = new Proxy({}, { get: () => () => {} })
      const at = { M: null }
      const uv = new UnitViews({ scene: sc, labels: document.createElement('div'), fx: quiet, mirror: () => at.M, colorOf: (s) => flow.sides[s].color, W: atTable().board.W })
      // (no shot is ever fired off the table: it holds nothing to clear, and
      // fx's marks are the page's, left alone)
      const sh = { clear() {}, held: () => ({ marker: false, thorns: 0 }) }
      return { at, units: uv, terrain: new TerrainView(sc, quiet), shots: sh, effects: quiet }
    }
    // (`proj`: the match as it stood at a checkpoint, its project(G); its
    // chunks are G's that stood then, standing or not and at the height the
    // projection says)
    const snapped = (t, g, proj) => {
      t.at.M = proj ?? project(g)
      const chunks = !proj ? g.terrain.chunks : g.terrain.chunks.filter((c) => proj.chunks[c.id]).map((c) => ({ ...c, alive: proj.chunks[c.id].alive, shape: { ...c.shape, y: proj.chunks[c.id].y } }))
      view.rebuild(g, t.at.M, { chunks, terrain: t.terrain, units: t.units, shots: t.shots, effects: t.effects })
      t.units.paintRings(flow.rings())
      return t
    }
    const tableState = (uv, tv, sh, g) => ({
      units: g.units.map((u) => {
        const v = uv.get(u.id)
        if (!v) return { id: u.id, view: null }
        const r = v.ring, h = v.hit
        return {
          id: u.id,
          ring: r.visible ? { x: r.position.x, z: r.position.z, s: r.scale.x, op: r.material.opacity, col: r.material.color.getHexString() } : null,
          hit: h.visible && h.parent ? { x: h.position.x, y: h.position.y, z: h.position.z, sx: h.scale.x, sy: h.scale.y } : null,
          figures: v.models.map((f) => (f.mesh?.parent ? { x: f.mesh.position.x, y: f.mesh.position.y, z: f.mesh.position.z } : null)),
          label: { html: v.label.innerHTML, display: v.label.style.display || '' },
        }
      }),
      chunks: g.terrain.chunks.map((c) => ({ id: c.id, ...tv.state(c.id) })),
      shots: sh.held(),
    })
    // where two states differ (numbers to within 1e-6)
    const differ = (a, b, path, out) => {
      if (typeof a === 'number' && typeof b === 'number') {
        if (!(Math.abs(a - b) <= 1e-6)) out.push(`${path}: ${a} | ${b}`)
      } else if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
        for (const k of keys) differ(a[k], b[k], `${path}.${k}`, out)
      } else if (a !== b) out.push(`${path}: ${JSON.stringify(a)} | ${JSON.stringify(b)}`)
      return out
    }
    let kept = null
    // (`proj`: at a checkpoint, the match as it stood there, while the player
    // waits on the check; else the match as it stands, the player idle)
    const snapDiff = (proj = null) => {
      const g = atTable()
      if (!proj && !player.idle) throw new Error('?debug view.snapDiff: the player is still playing')
      const live = tableState(units, terrainView, shots, g)
      const fresh = snapped(offTable(), g, proj)
      kept = snapped(kept ?? offTable(), g, proj)
      const diffs = [...differ(live, tableState(fresh.units, fresh.terrain, fresh.shots, g), 'fresh', []), ...differ(live, tableState(kept.units, kept.terrain, kept.shots, g), 'kept', [])]
      fresh.units.dispose()
      fresh.terrain.dispose()
      return {
        diffs: diffs.slice(0, 12), n: diffs.length,
        units: live.units.length, figures: live.units.reduce((n, u) => n + (u.figures?.filter(Boolean).length ?? 0), 0),
        chunks: live.chunks.length, shown: live.chunks.filter((c) => c.shown).length,
      }
    }
    window.__ts = {
      S: legacyS, clock, camera, controls, renderer, trace,
      get G() {
        return flow.G
      },
      get session() {
        return flow.session
      },
      // (N2, not promised) the online page (app/online.js) once loaded, and
      // the way in: goOnline('host') for Play online, goOnline() for the
      // URL's #m= (sim/lobby-rig.mjs)
      get net() {
        return online
      },
      goOnline,
      // (N3, not promised) the replay (app/replay.js), and a replay file's
      // text watched as the title's 📼 does (sim/lobby-rig.mjs)
      replay,
      watchFile,
      // (N3, not promised) the hash of the match on the table
      hash: () => (flow.session?.G ? stateHash(flow.session.G) : null),
      // (not promised) the HUD model last put on the page
      get hud() {
        return flow.shownHud
      },
      // (F10a, not promised) the units picked up together (their ids), what
      // the group bar says, and a unit's centre on screen as last drawn
      // (sim/input-check.mjs)
      group: {
        ids: () => human.group.members().map((u) => u.id),
        bar: () => human.group.model(),
        pinned: () => !!human.group.selection.of(human.group.seat()).pin,
        busy: () => human.group.busy,
        // the pinned formation: its verb, its line (if any) and each
        // member's cell, as (x, z)
        pin: () => {
          const p = human.group.selection.of(human.group.seat()).pin, nav = flow.G?.nav
          return p && { verb: p.verb, line: p.line, rot: p.rot ?? 0, members: p.preview.members.map((m) => ({ id: m.u.id, at: m.cell >= 0 ? { x: nav.x(m.cell), z: nav.z(m.cell) } : null })) }
        },
        // (F10c) the pin's handles, where they stand on the table
        handles: () => human.group.handles(human.group.selection.of(human.group.seat()).pin),
        screen: (id) => view.units.screen.get(id) ?? null,
        // pick up `ids` together, pin their formation at (x, z) as a ground
        // click does, send it (a promise: the executor's run), and what the
        // picker finds at a page point
        select: (ids) => human.group.setGroup(ids),
        pinAt: (x, z) => human.group.pinAt(human.group.phase() === 'place' ? 'place' : 'move', { x, z }),
        commit: () => {
          const why = human.group.commit()
          return why ? Promise.resolve(why) : human.group.running
        },
        // ((F7a) and the height of the ground found: a deck's top, or 0)
        pick: (x, y, pointerType = 'mouse') => {
          const p = picker.pick({ clientX: x, clientY: y, pointerType })
          return { unit: p.unit?.id ?? null, ground: !!p.ground, y: p.ground ? p.ground.y : null }
        },
      },
      get player() {
        return player
      },
      present: {
        listen(observer) {
          player.observer = observer
        },
        // the unit card's status line as it shows `u` now (it opens the card)
        card(u) {
          ui.card.show(u)
          return /class="card-sub">([^<]*)</.exec($('#card').innerHTML)?.[1] ?? null
        },
      },
      get units() {
        return serving ? serving.units : atTable().units
      },
      get nav() {
        return atTable().nav
      },
      // (F8a) the board the match's mission chose: { W, H, deploy }
      get board() {
        return atTable().board
      },
      scenery: {
        get chunks() {
          return serving ? serving.chunks : atTable().terrain.chunks
        },
        scene,
        // (the title's table only: a battle's board changes only through its
        // commands, the log being the whole truth of it; and a table blasted
        // here is no battle's, so the next start() draws a fresh one)
        blast(x, z, r, dmg, opts) {
          if (flow.G) throw new Error('?debug scenery.blast: only on the title screen (no battle)')
          const out = []
          const broke = flow.backdrop.terrain.blast(x, z, r, dmg, opts, out)
          flow.backdropAsDrawn = false
          player.push(out)
          refreshNav(flow.backdrop)
          return broke
        },
      },
      validEnd: (plan, i) => asked((g) => validEnd(g, plan, i)),
      get phaseResolve() {
        return human.myTurn() || null
      },
      get chargePick() {
        const pk = human.picking()
        return pk && { u: pk.u, plan: pk.plan, ok: pk.ok }
      },
      // (F4) the seats played here still to vote at the round limit, while
      // the player is idle; null otherwise
      get roundLimit() {
        return human.mode() === 'roundLimit' ? human.voters() : null
      },
      start: (mode) => flow.start(mode),
      select: (u) => human.select(u),
      doMove: (u, c) => {
        must(human.moveTo(u, c), 'doMove')
        return settle()
      },
      doAdvance: (u) => {
        must(human.advance(u), 'doAdvance')
        return settle()
      },
      doShoot: (u, tg) => {
        must(human.shoot(u, tg), 'doShoot')
        return settle()
      },
      doCharge: (u, tg) => {
        must(human.charge(u, tg), 'doCharge')
        // (the battle it was sent in: a new table, or another battle, ends
        // the wait)
        const s = flow.session
        return settle(() => s !== flow.session || s.G.pending?.k !== 'chargeEnd')
      },
      placeCharge: (c) => {
        must(human.placeCharge(c), 'placeCharge')
        return settle()
      },
      deployClick: (unit, ground) => must(human.deployClick(unit, ground), 'deployClick'),
      endPhase: () => {
        must($('#endPhase').onclick(), 'endPhase')
        return settle()
      },
      autoPhase: () => {
        must($('#autoPhase').onclick(), 'autoPhase')
        return settle()
      },
      // (F10c) the standing orders: give(ids, order) puts ids of the seat
      // whose turn it is here (or `seat`) under `order` (input/book.js's
      // shape; null: none) as the bar would; book(seat) the seat's, by id;
      // plan() what End would act for now ({ actors, covered }, as arrays);
      // busy() whether a run is under way
      orders: {
        give: (ids, order, seat = human.standing.seat()) => human.standing.give(seat, ids, order),
        // the order lines the table draws now
        lines: () => human.standing.lines().length,
        book: (seat) => Object.fromEntries(human.standing.orders(seat)),
        plan: () => {
          const p = human.standing.plan()
          return { actors: [...p.actors], covered: [...p.covered] }
        },
        busy: () => human.standing.busy,
      },
      // (F10b) Auto these: the AI plays the units mask m names (bit j: the
      // seat's j-th unit in G.units order), sent as the group bar's button
      // sends it; for the seat played here whose phase it is
      pilot: (m) => {
        const seat = human.localSeat(), ids = flow.G.units.filter((u) => u.side === seat).filter((u, j) => Math.floor(m / 2 ** j) % 2).map((u) => u.id)
        must(human.pilot(ids), 'pilot')
        return settle()
      },
      // (F4) the round limit's vote: the panel's Keep playing (more true) or
      // End the battle, pressed, for every seat played here still to have
      // its say; or, given `seat`, that seat's say alone (sim/'s driver
      // replays a log seat by seat)
      vote: (more, seat) => {
        must(seat === undefined ? $(more ? '#keepPlaying' : '#endBattle').onclick() : human.vote(more, [seat]), 'vote')
        return settle()
      },
      // read-only rules queries, for choosing legal input (only what sim/ uses)
      q: {
        alive,
        isEngaged: (u) => asked((g) => isEngaged(g, u)),
        canAct: (u) => asked((g) => canAct(g, u)),
        movePlan: (u, extra) => asked((g) => movePlan(g, u, extra)),
        freeSpot: (u, x, z, side, others) => asked((g) => freeSpot(g, u, x, z, side, others)),
        shootTargets: (u) => asked((g) => shootTargets(g, u)),
        shotInfo: (u, tg) => asked((g) => shotInfo(g, u, tg)),
        chargeTargets: (u) => asked((g) => chargeTargets(g, u)),
        chargePlan: (u, tg) => asked((g) => chargePlan(g, u, tg)),
        rngState: () => (serving ? serving.rng : rngState(atTable().rng)),
      },
      screen(x, y, z) {
        const v = new THREE.Vector3(x, y, z).project(camera)
        return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]
      },
      view: {
        snapDiff,
        // fn(e) at every checkpoint (a `check` event), the player waiting on
        // what it returns (null: no pause)
        pauseAtChecks(fn) {
          flow.checkHook = fn
        },
        // what the table holds (sim/rematch-memory.mjs): the scene's own
        // objects, the battlefield's, the figures and the floating labels;
        // and fx's scorch and acid marks (sim/snap-check.mjs: a snap takes
        // them away)
        counts: () => {
          let figures = 0
          scene.traverse((o) => o.userData.fig && figures++)
          return { scene: scene.children.length, terrain: terrainView.group.children.length, figures, labels: view.stage.overlay.children.length, marks: effects.decals.length }
        },
        // (F8a) the board the table is made for, as the view holds it
        // (sim/board-check.mjs): the mat, the zones' depth, the objectives,
        // the overlay's grid, the figures' run-off edge, the tufts and
        // flowers, the camera's dolly and far plane, the fog and the
        // shadow camera, and how often it was made over (setBoard)
        board: () => {
          const sc = view.stage.sun.shadow.camera, mat = view.table.board.geometry.parameters
          return {
            W: view.table.W, H: view.table.H, deploy: view.table.deploy, mat: [mat.width, mat.height],
            objectives: view.objectives.items.map((o) => [o.g.position.x, o.g.position.z]),
            grid: [view.overlay.tex.image.width, view.overlay.tex.image.height], unitsW: view.units.W,
            tufts: view.table.tufts.count, flowers: view.table.flowers.count,
            dolly: rig.dolly, far: camera.far, fog: [scene.fog.near, scene.fog.far], shadow: [sc.left, sc.right, sc.top, sc.bottom, sc.far], builds: view.boardBuilds,
          }
        },
        // (F8a) the mission a battle started here is fought for from now on
        // (as ?mission= names one at load)
        mission(name) {
          if (!(name in MISSIONS)) throw new Error(`?debug view.mission: no mission "${name}"`)
          flow.mission = name
        },
        // (F7a) the terrain set a battle started here is fought on, the
        // panel's default, from now on (as ?terrain= names one at load; null: each
        // mission's first)
        terrain(set) {
          if (set !== null && !Object.values(MISSIONS).some((m) => m.sets.includes(set))) throw new Error(`?debug view.terrain: no mission is fought on "${set}"`)
          flow.terrain = set
        },
      },
    }
  }
}
