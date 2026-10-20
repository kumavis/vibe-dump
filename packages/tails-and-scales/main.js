import * as THREE from 'three'
import {
  BOARD, CHARGE_RANGE, OBJECTIVE_RANGE, PHASES,
  passes, woundNeed, saveNeed, attackCount, expected, p2D6,
} from './core/rules.js'
import { RACES } from './data/schema.js'
import { MISSIONS, CLASSIC } from './data/mission.js'
import { EDGES, NAV_CELL, edgeOf, ctrl, refreshNav } from './core/match.js'
import { createMatch, fullSetup, preview, q } from './core/index.js'
import { gridSize } from './core/nav.js'
import { Session } from './match/session.js'
import { LocalStore } from './match/store.js'
import { project } from './present/mirror.js'
import { PACE } from './present/pace.js'
import { battleView } from './present/camera-presets.js'
import { Stage } from './view/stage.js'
import { CameraRig } from './view/camera.js'
import { Table } from './view/table.js'
import { ObjectivesView } from './view/objectives.js'
import { TerrainView } from './view/terrain.js'
import { UnitViews } from './view/units.js'
import { Overlay } from './view/overlay.js'
import { FX } from './view/effects/fx.js'
import { Shots } from './view/effects/shots.js'
import { EventPlayer } from './view/player.js'
import { clock, wait } from './view/clock.js'
import { sfx, unlock, toggleMute, isMuted } from './view/sfx.js'
import { chargePick, nearestSpot, endAt, SHORTEST } from './input/tools/charge-end.js'
import { sidesFor, isMirror } from './ui/theme.js'

// ---------------------------------------------------------------------------
// Tails & Scales — a pocket-sized tabletop wargame.
//
// Two armies, alternating player turns, each turn run through five phases:
// Movement → Shooting → Charge → Fight → Morale. Units are squads of models
// that move as a disc; every attack is rolled hit → wound → save → damage and
// the dice are shown. Blast weapons drop a template that can scatter, hurts
// whoever is underneath (friends included) and breaks the scenery.
//
// This file is the table's input and UI, and where the view is put
// together: the stage, the camera, the table, the objectives, the
// battlefield, the figures, the shooting's effects and the overlay are
// view/'s modules (R7a), which this makes, in order, and wires to the
// match's events (the EventPlayer's handlers); the clicks, the HUD, the
// tray, the log, the card and the screens are still here (R7b moves them to
// input/ and ui/, and this file down to its boot).
// The battle itself is the core's (core/index.js): a pure function of its
// setup and the commands its seats send. Every mode plays one through a
// Session (match/session.js) over a LocalStore (match/store.js): the title
// screen's button makes the setup, the Session creates the match from it,
// the AI plays inside the match (core/engine.js, core/ai/), and a human
// seat's clicks become commands (units by id, places by nav cell) that the
// Session folds into it. The match runs ahead, to the next decision a human
// makes, and reports what happened as events (DESIGN §2.3), which the player
// (view/player.js) plays here at the table's pace, folding each into the
// mirror (present/mirror.js): the match as shown, which the figures, labels,
// flags and score read. Input and the HUD read the match itself (G) only once
// the player has played everything (§2.4), and what a tool shows before a
// seat commits it asks through the Session's preview, with the dice locked.
// ---------------------------------------------------------------------------

// the read-only queries (core/queries.js, through the core's API)
const {
  alive, isEngaged, inCover, phaseKey,
  canAct, movePlan, validEnd, freeSpot, shotInfo, shootTargets, chargeTargets, chargePlan, rngState,
} = q

const { W, H } = BOARD
const $ = (s) => document.querySelector(s)
const params = new URLSearchParams(location.search)

// ?fast: a test mode that skips drawing and lets game time run effectively
// instantly (view/stage.js)
const FAST = params.has('fast')

// ── The view (view/), made in its old order ─────────────────────────────────
// The renderer and scene, the camera and its controls, the lights, the
// effects, the table, the objectives and the battlefield, then (below) the
// figures, the shooting's effects and the overlay: the same three.js
// objects, materials and Math.random draws as before R7, in the same order
// (sim/terrain-shots.mjs and sim/title-shot.mjs hold the title, drawn from a
// seeded Math.random, to the code before, pixel for pixel, but for the
// figures' flocks and idle phases, which the template cache draws from
// another point of the stream: view/models/cache.js).
const stage = new Stage({ lowfi: params.has('lowfi'), fast: FAST })
const { renderer, scene } = stage
const rig = new CameraRig(renderer)
const { camera, controls } = rig
stage.light()
const fx = new FX(scene, camera, stage.overlay)
const table = new Table(scene, renderer, { W, H, deploy: MISSIONS.classic.deploy, edges: EDGES })
// (each flag in its holder's colours: the seats' look, below)
const objectives = new ObjectivesView(scene, MISSIONS.classic.objectives, OBJECTIVE_RANGE, (s) => SIDES[s].color)
// The battlefield's meshes. The battlefield itself is the match's
// (G.terrain): each terrain call reports what it built or broke into G.out,
// among the events of the entry the Session folds, and the player plays
// each report (the terrain.* handlers) when it reaches it in those events,
// in order (a wrecker's smashes as its walk passes them).
const terrainView = new TerrainView(scene, fx)

// ── Game state ──────────────────────────────────────────────────────────────
// The table's and the screen's own state: the board seed and who plays each
// seat as the title screen has them, and input state (the camera's is the
// rig's, view/camera.js). The match's state (the turn, the score, the
// units) is G's.
// (Every seed the page takes is made a whole number from 0 to 2^32 - 1, as
// a setup's must be, with `>>> 0`: what the board's and the dice's
// generators always did with a seed, so ?seed=-5 is still the board -5 drew.)
const S = {
  seed: (Number(params.get('seed')) || ((Math.random() * 1e6) | 0)) >>> 0,
  control: ['human', 'ai'],
  sel: null,
  reach: null,
  hover: null,
}
// The races at the table: the classic Bushtails-versus-Coil matchup
// (data/mission.js), or any pair a ?races=<seat 0>,<seat 1> URL names (e.g.
// ?races=serpent,serpent), until the title screen gets a race picker. A
// value naming no two races gets the classic matchup and a line on the title
// card saying why, not a page that never starts (sim/mirror-check.mjs fails
// a run whose log shows other races than it asked for).
const RACE_PICK = (() => {
  if (!params.has('races')) return CLASSIC
  const pick = params.get('races').split(',').map((r) => r.trim().toLowerCase())
  if (pick.length === 2 && pick.every((r) => RACES[r])) return pick
  const msg = `?races= takes two of ${Object.keys(RACES).join(', ')}, comma-separated, not "${params.get('races')}"`
  console.warn(`${msg}: playing the classic matchup`)
  const note = document.createElement('p')
  note.className = 'small'
  note.textContent = `${msg}, so this is the classic matchup.`
  $('#title .modes').before(note)
  return CLASSIC
})()
// The battle being played: its Session (match/session.js), which folds the
// battle's log (a LocalStore) through the core, and the match itself,
// session.G. Both null on the title screen: no battle exists before a mode
// is chosen, and start() makes a new one from the whole setup, so nothing
// carries over from one battle to the next.
let session = null
let G = null
// The table the title screen shows (showTable): a match on the board seed
// that is never played. Both its seats are human, so it stops at its
// deployment having drawn nothing; it is only drawn (its board, and the
// armies where any battle on this board deploys them), and lends the title
// its nav grid's geometry. A battle on the same board and races starts on
// exactly this table, so its figures and meshes are kept (start()).
let backdrop = null
// false once the backdrop's board has been changed since it was drawn (the
// ?debug block's scenery.blast, for sim/terrain-shots.mjs): it is then no
// battle's table, and start() draws a fresh one
let backdropAsDrawn = true
// the match the table shows: the battle's, or on the title the backdrop
const atTable = () => G ?? backdrop
// Under ?debug every battle reports its trace lines here as it writes them
// (createMatch's onTrace, which the Session passes), and start() says when
// a battle begins; only the ?debug block listens (sim/ reads one trace for
// the page's lifetime, emptied as each battle begins). Without ?debug a
// battle has no onTrace.
let traceListener = null
// (?debug only) what a checkpoint does besides nothing: sim/snap-check.mjs
// compares the table there
let checkHook = null
const DEBUG = params.has('debug')
const onTrace = DEBUG ? (line, g) => traceListener?.line(line, g) : null
// each seat's name, icon and colours, from its race (ui/theme.js)
const seatsOf = (races) => races.map((race, seat) => ({ seat, race }))
let SIDES = sidesFor(seatsOf(RACE_PICK))

// Seat the players: the races at the table.
function seatPlayers(seats) {
  SIDES = sidesFor(seats)
  paintSeats()
}
// The HUD, unit labels, battle log and card take each seat's colour from
// --s0/--s1, and the active seat's HUD glow from --s0-glow/--s1-glow
// (style.css holds the classic pair, which the title screen's copy keeps);
// the HUD shows each seat's race, and the zones (view/table.js) are its
// colour.
const seatStyle = document.createElement('style')
document.body.appendChild(seatStyle)
const glow = (hex) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')}, 0.45)`
function paintSeats() {
  seatStyle.textContent = `#hud, #labels, #log, #card { --s0: ${SIDES[0].color}; --s1: ${SIDES[1].color}; ` +
    `--s0-glow: ${glow(SIDES[0].color)}; --s1-glow: ${glow(SIDES[1].color)}; }`
  for (const s of [0, 1]) {
    const hud = s ? '#sideB' : '#sideA'
    $(`${hud} .ic`).textContent = SIDES[s].icon
    $(`${hud} .nm`).textContent = SIDES[s].name
  }
  table.paint(SIDES.map((x) => x.color))
}
paintSeats()
// In a mirror match both seats' names read the same, so text that names a
// seat outside the HUD (the turn banner, the end screen) takes the seat's
// colour; otherwise it keeps its own ('' leaves the stylesheet's).
const seatInk = (s) => (s >= 0 && isMirror(atTable().seats) ? SIDES[s].color : '')

const human = (side) => ctrl(G, side) === 'human'
// a seat played here (the Session's local seats: a human seat may be another
// device's from R8, which this page only watches)
const local = (side) => !!session?.localSeats.includes(side)
// a phase's name by its key ('move' → 'Movement')
const PHASE_NAME = Object.fromEntries(PHASES.map((p) => [p.key, p.name]))

// ── The figures, the shooting, the overlay (view/) ──────────────────────────
// The units' figures (view/units.js: each unit's view by unit id, following
// the unit as shown, `player.mirror`), how the shooting looks
// (view/effects/shots.js) and what a seat's tools draw on the table
// (view/overlay.js: one texel per nav cell, every match's grid having this
// size).
const units = new UnitViews({ scene, labels: stage.overlay, fx, mirror: () => player.mirror, colorOf: (s) => SIDES[s].color, W })
const shots = new Shots({ scene, fx, units })
const overlay = new Overlay(scene, { W, H, grid: gridSize(W, H, NAV_CELL) })
// a unit of the match the table shows, by id (what a click or the pointer
// finds is the figure's unit: its view keeps only the id and the unit's
// look, the same in every match on this table)
const unitById = (id) => atTable().units.find((u) => u.id === id)
// a unit as shown (the mirror's record of it)
const shown = (u) => units.shown(u.id)

// ── Playing the match's events ──────────────────────────────────────────────
// The match runs ahead to the next decision a human makes and reports what
// happened as events (DESIGN §2.3), which the Session hands over entry by
// entry (the sink, below); the player plays them here at the table's pace,
// each kind of event with the old code's visuals (view/'s), after folding it
// into the mirror (present/mirror.js), the match as shown.
const HANDLERS = {
  // the battle log, the dice tray, and the beats between
  log: (e) => write(e.side, e.html, e.cls, e.at),
  'tray.open': (e) => tray.clear(e.title),
  dice: (e) => tray.row(e.label, e.dice, e.need, e),
  pause: (e) => wait(PACE.pause(e.s)),
  // the camera, when it follows the action (the stage and the seat to act
  // as shown: a focus event plays while the match has run ahead, a whole AI
  // turn or more; never during the turn of the one seat played here)
  focus: (e) => rig.focus(e.x, e.z, { stage: player.mirror.stage, active: player.mirror.active, localSeats: session?.localSeats ?? [] }),
  // the figures
  'unit.place': (e) => units.disc(e.u),
  'unit.formation': (e) => {
    units.disc(e.u)
    units.label(e.u)
  },
  'unit.wound': (e) => units.wounded(e),
  'unit.slain': (e, M) => units.slain(e, M),
  'unit.flee': (e) => units.fled(e),
  'unit.destroyed': (e, M) => units.destroyed(e, M),
  'unit.face': (e) => units.face(e),
  // (what a wrecker smashed breaks as the walker passes it)
  'unit.move': (e, M) => units.walk(e, M, (ev) => {
    for (const x of ev) terrainView.apply(x, M)
  }),
  melee: (e) => units.lunge(e),
  'charge.result': (e) => units.shout(e),
  // the shooting
  volley: (e) => shots.volley(e),
  'blast.aim': (e) => shots.aimed(e),
  'blast.scatter': (e) => shots.scattered(e),
  'blast.fire': (e) => shots.fired(e),
  'blast.land': (e) => shots.landed(e),
  'spell.cast': () => shots.cast(),
  'spell.fizzle': (e) => shots.fizzled(e),
  'spell.thorns': (e) => shots.thorns(e),
  'spell.fade': (e) => shots.faded(e),
  'spell.gaze': (e) => shots.gaze(e),
  'spell.mesmerized': (e) => shots.mesmerized(e),
  // what the labels, flags and score show: read off the mirror, which these
  // have just updated (the flags repaint each frame, view/objectives.js)
  status: () => units.labelAll(),
  objectives: () => {},
  act: () => {},
  // the flow: a stage of the battle, a phase begun, a round scored, the end
  stage: (e) => staged(e),
  'phase.start': (e) => phaseBegun(e),
  'round.scored': (e) => scored(e),
  'game.over': (e) => over(e),
  // (what the match waits on: the table asks once it has played everything)
  pending: () => {},
  // (?debug) a checkpoint for sim/present-check.mjs (and, should the ?debug
  // block's view.pauseAtChecks ask, a pause there for sim/snap-check.mjs)
  check: (e) => checkHook?.(e),
  // the battlefield
  'terrain.clear': (e, M) => terrainView.apply(e, M),
  'terrain.add': (e, M) => terrainView.apply(e, M),
  'terrain.hurt': (e, M) => terrainView.apply(e, M),
  'terrain.destroy': (e, M) => terrainView.apply(e, M),
  'terrain.collapse': (e, M) => terrainView.apply(e, M),
  'terrain.rubble': (e, M) => terrainView.apply(e, M),
  // an event this table has no visuals for yet: its text over the unit (or
  // the place) it names, then a beat
  fallback: (e, M) => {
    const at = e.u !== undefined && M.units[e.u] ? M.units[e.u].pos : { x: e.x ?? 0, z: e.z ?? 0 }
    if (e.text) fx.text({ x: at.x, y: 1.6, z: at.z }, e.text, '#ffffff')
    return wait(e.beat ?? PACE.beat)
  },
}
// The table made to show a match as it stands (the player's snap): the
// battlefield from its chunks, the figures from its units, and what the
// view holds outside the mirror taken away: the shooting's (a template's
// marker, an eruption's thorns) and fx's scorch and acid marks (a snap back
// to an earlier point, or onto another match, would keep them from a
// timeline it left). `M` is the player's contract (view/player.js's
// view.rebuild(G, M)); the views read the mirror themselves (their
// mirror(), the player's, which it has set to M by now). Into the page's
// views, unless `to` names others: the ?debug snap check makes its fresh
// snap with this same function, into views off the table (and at a
// checkpoint, `chunks` G's as they stood).
function rebuild(g, M, to = {}) {
  const { chunks = g.terrain.chunks, terrain = terrainView, units: uv = units, shots: sh = shots, effects: marks = fx } = to
  terrain.sync(chunks)
  uv.sync(g.units, (s) => edgeOf(g, s))
  sh.clear()
  marks.clearDecals()
}
// Told when it has played everything: the table catches up (idled, below).
const player = new EventPlayer({ handlers: HANDLERS, view: { rebuild }, onIdle: (how) => idled(how) })

// What the Session hands over after each entry it folds: the events that
// entry made happen, played in order. A battle's first entry, its start,
// begins with the match's board (its terrain.clear and an add per chunk);
// start() has snapped the table to the backdrop, the battle's table as it
// stood before anything happened (the same board, terrain and races), so
// the board's adds take back the meshes on show (view/terrain.js) and the
// battle's events play on from there. Under
// ?debug the checkpoints P-present holds the mirror to go in first (the
// ?debug block).
const sink = {
  // (`ses`, the Session handing them over: a Session over a store that holds
  // entries already folds them as it is made, before start() has it)
  events(events, ses) {
    if (G !== ses.G) {
      G = ses.G
      sameUnits(G)
    }
    if (traceListener) events = traceListener.present(events, G)
    player.push(events)
  },
}
// A battle's units are its table's, id for id (start() snaps the table to
// the backdrop, on the battle's board and terrain with its races: those
// deploy the same armies the same way, newState being a pure function of
// the setup, and neither who plays a seat nor the dice move a unit before
// the battle starts), so the figures on show are its figures. A unit the
// table has no figure for is a bug in that, so it throws. (By type and seat
// only: G has run on past its start by now, a watched battle's to its end,
// so where its units stood then is no longer in it.)
function sameUnits(at) {
  const differs = (u) => !units.get(u.id) || units.unit(u.id).t !== u.t || units.unit(u.id).side !== u.side
  const bad = at.units.find(differs)
  if (bad || at.units.length !== units.views.size) throw new Error(`the battle's units are not the table's (${bad ? `unit ${bad.id}, ${bad.key} of seat ${bad.side}` : `${at.units.length} units, ${units.views.size} figures`}): a battle starts on its own table (start())`)
}

// ── The flow ────────────────────────────────────────────────────────────────
// What the table shows as the battle moves on: a stage (the deployment, the
// battle, its end), each phase's banner, each round's score, the end screen.
// The match decides all of it (core/engine.js); these are its events played.

// Whether the table has shown a phase begin (its phase.start played) since
// the stage it shows began. Until one has, the mirror's turn fields are a
// table's before the battle (seat 0's movement in round 1), which say
// nothing about whose turn it is: through the roll-off the HUD shows no
// seat's phase, whoever moves first. (View state: the mirror is held to
// project(G) by P-present, so this stays out of it.)
let phaseShown = false
// Whether End and Auto are up for the seat whose phase the table shows: they
// come up once the player has caught up to that phase (idle), and stay up,
// disabled, while the table plays the seat's own actions (a charge's roll
// and its walk too, though the match waits on its end in between) until an
// End or an Auto moves the decision on. (View state, like phaseShown.)
let buttonsUp = false

// A stage begins: the zones dim for the battle, and nothing stays selected.
function staged(e) {
  phaseShown = false
  if (e.stage !== 'deploy') select(null)
  refreshUI()
}

// A phase begins: its banner, which the table waits on.
function phaseBegun(e) {
  phaseShown = true
  select(null)
  tray.el.classList.remove('show')
  refreshUI()
  return banner(`${SIDES[e.side].icon} ${SIDES[e.side].name}`, PHASE_NAME[e.phase], e.side)
}

// A round scored: a ring in the holder's colours on each objective held,
// then the score's banner.
function scored(e) {
  e.owners.forEach((c, i) => {
    const o = MISSIONS.classic.objectives[i]
    if (c >= 0) fx.ring(o.x, o.z, OBJECTIVE_RANGE, SIDES[c].color, { life: 1.6, fill: 0.15 })
  })
  refreshUI()
  return banner(`End of round ${e.round}`, `VP ${e.vp[0]} – ${e.vp[1]}`)
}

// The end: who won and why, worded from `why` and the rounds played (0 for
// a battle that ended in its deployment).
function over({ win, why, vp, rounds }) {
  select(null)
  refreshUI()
  const t = win < 0 ? 'A bloody draw' : `${SIDES[win].name} win!`
  const when = rounds ? `in round ${rounds}` : 'in the deployment'
  const line = why === 'wipe' ? `${SIDES[1 - win].name} have been wiped from the table ${when}.`
    : why === 'concede' ? `${SIDES[1 - win].name} conceded ${when}.`
    : `Final score ${vp[0]} – ${vp[1]} after ${rounds} round${rounds === 1 ? '' : 's'}.`
  const title = $('#overTitle')
  title.textContent = `${win >= 0 ? SIDES[win].icon + ' ' : ''}${t}`
  title.style.color = seatInk(win)
  $('#overWhy').textContent = line
  $('#over').classList.remove('hidden')
  sfx.fanfare()
}

// ── Commands ────────────────────────────────────────────────────────────────
// What a seat played here sends (DESIGN §2.5): each click or button becomes
// a command body (units by id, places by nav cell, picked with the core's
// own queries: nearestValid, freeSpot, the charge-end tool), sent through
// the Session only if the match takes it now. The Session folds it at once:
// the match runs on to the next decision a human makes, and the table plays
// what happened. Whether a seat may act is derived, never stored: from the
// decision the match waits on and whether the player has played everything.

// the seat played here that the match waits on, or -1
const localSeat = () => (session ? session.decisionFor() : -1)
// that seat's decision, null for none
const localDecision = () => (localSeat() >= 0 ? G.pending : null)
// the seat deploying here, or -1 (a placement plays at once: the deployment
// never waits on the player)
const deploySeat = () => (localDecision()?.k === 'deploy' ? localSeat() : -1)
// a seat played here is in a phase of its own turn, and the table has shown
// everything up to now
const myTurn = () => player.idle && localDecision()?.k === 'phase'
// a charge's end to pick, here and now (input/tools/charge-end.js)
const picking = () => (player.idle && localDecision()?.k === 'chargeEnd' ? chargePick(session) : null)
// a question the tools ask the match: with the dice locked (§4.1 rule 2)
const ask = (fn) => session.preview(fn)

// Send `body` for the seat played here, if the match takes it now. Returns
// null once sent, else why not (and sends nothing).
function send(seat, body) {
  const why = session ? session.legal(seat, body) : 'no battle'
  if (why) return why
  session.submit(seat, body)
  // (the buttons go disabled at once, while the table plays it)
  refreshUI()
  return null
}
const moveTo = (u, c) => {
  overlay.clear()
  return send(localSeat(), { t: 'move', u: u.id, c })
}
const advance = (u) => send(localSeat(), { t: 'advance', u: u.id })
const shoot = (u, tg) => send(localSeat(), { t: 'shoot', u: u.id, tg: tg.id })
const charge = (u, tg) => send(localSeat(), { t: 'charge', u: u.id, tg: tg.id })

// End the charge on cell c, a spot the roll reaches (a click's, nearestSpot's:
// its -1 for "no spot" is no command, though the wire's Shortest move is -1
// too, so that takes its own path, takeShortest).
function placeCharge(c) {
  const pk = picking()
  if (!pk) return 'no charge to end'
  if (!(c >= 0 && pk.ok[c])) return `cell ${c} is no spot the roll reaches`
  return endCharge(pk, c)
}
// End the charge with the shortest move (SHORTEST: the plan's own cell).
function takeShortest() {
  const pk = picking()
  if (!pk) return 'no charge to end'
  return endCharge(pk, SHORTEST)
}
function endCharge(pk, c) {
  pickShown = null
  overlay.clear()
  overlay.ghost.visible = false
  $('#tooltip').style.display = 'none'
  return send(pk.seat, endAt(c))
}

// The table has played everything: the trace catches up (?debug), a card
// still open catches up with the table (the unit of the match on it now: a
// battle's start puts its own match on the backdrop's table), the selected
// unit stays selected
// while it can still act (a move or a shot spent it; an advance didn't), a
// charge waiting for its end shades the spots its roll reaches, and the HUD
// follows. After a snap (`snap`: a new table, a battle's start) an open
// card is left as it was, as before R7, when a new table made its figures
// after its idle and a start had no idle. (In play no card is open then:
// the end screen closes it, and the title and the end screen cover the
// table. Under ?debug a start mid-battle draws a new table first; N2's
// snaps mid-battle are ui/card.js's to decide: DESIGN's R7a notes.)
let pickShown = null
function idled({ snap = false } = {}) {
  traceListener?.idle()
  const cu = !snap && carded && unitById(carded.id)
  if (cu && cu.t === carded.t && cu.side === carded.side && $('#card').classList.contains('show')) showCard(cu)
  if (S.sel && myTurn()) select(ask((G, q) => q.canAct(G, S.sel)) ? S.sel : null)
  const pk = picking()
  if (pk && pickShown !== pk) {
    pickShown = pk
    // the 12" declaration ring is spent; leave the orange to the area itself,
    // filled strongly enough to see when it's only a cell or two
    overlay.rangeRing.visible = false
    overlay.mask(pk.ok, [255, 150, 60], G.nav, 150)
    overlay.ghostAt(G.nav, pk.cell, pk.u.r)
  }
  refreshUI()
  traceListener?.settled()
}

// ── Human input ─────────────────────────────────────────────────────────────
const ray = new THREE.Raycaster()
const ptr = new THREE.Vector2()
let downAt = null

function pick(ev) {
  ptr.set((ev.clientX / innerWidth) * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1)
  ray.setFromCamera(ptr, camera)
  // the units the table shows standing (while the player is behind, the
  // match may have slain some of them already)
  const hits = ray.intersectObjects(units.pickables(), false)
  const unit = hits.length ? unitById(hits[0].object.userData.id) : null
  const g = ray.intersectObject(table.board, false)[0]
  return { unit, ground: g ? g.point : null }
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  unlock()
  downAt = { x: e.clientX, y: e.clientY, b: e.button }
})
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt || e.button !== 0) return
  const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
  downAt = null
  if (moved > 6) return
  click(pick(e))
})
renderer.domElement.addEventListener('pointerleave', () => {
  S.hoverPick = null
  S.hover = null
  hover()
  refreshRings()
})
renderer.domElement.addEventListener('pointermove', (e) => {
  S.mouse = { x: e.clientX, y: e.clientY }
  S.hoverPick = pick(e)
  hover()
})

// A click on the table: a unit, or the ground under the pointer (or both).
// On a seat's own turn it selects, moves, shoots or charges; while a charge
// waits for its end it picks the spot; in the deployment it places; any
// other time it shows the unit's card.
function click({ unit, ground }) {
  $('#tooltip').style.display = 'none'
  if (deploySeat() >= 0) return deployClick(unit, ground)
  const pk = picking()
  if (pk) {
    // the board under the cursor counts even when it's under a model; a
    // click outside the orange area (no spot within reach of it) does nothing
    if (ground) {
      const i = nearestSpot(G.nav, pk.ok, ground.x, ground.z)
      if (i >= 0) placeCharge(i)
    }
    return
  }
  if (!myTurn()) {
    if (unit) showCard(unit)
    return
  }
  const sel = S.sel, ph = phaseKey(G)
  if (unit && unit.side === localSeat()) {
    if (ask((G, q) => q.canAct(G, unit))) {
      sfx.click()
      select(unit)
    } else showCard(unit)
    return
  }
  if (ph === 'move' && sel && ground) {
    const i = ask((G, q) => q.nearestValid(G, S.reach, ground.x, ground.z))
    if (i >= 0) moveTo(sel, i)
    return
  }
  // (the match judges the shot and the charge: in range, in sight, a way
  // there; a click it refuses does nothing)
  if (ph === 'shoot' && sel && unit && unit.side !== sel.side) return void shoot(sel, unit)
  if (ph === 'charge' && sel && unit && unit.side !== sel.side) return void charge(sel, unit)
  if (unit) showCard(unit)
  else if (ground) select(null)
}

// The deployment: a click on one of the deploying seat's units picks it up,
// a click inside its zone puts it on the free spot nearest the click (within
// 2.5", the UI's tolerance; the cell is freeSpot's, a cell centre, so the
// command carries its index). Returns why a placement it sent was refused
// (null for anything else: a click too far from a free spot does nothing).
function deployClick(unit, ground) {
  const side = deploySeat()
  if (side < 0) return 'no seat deploying here'
  if (unit && unit.side === side) {
    sfx.click()
    S.sel = unit
    showCard(unit)
    refreshRings()
    return null
  }
  if (S.sel && ground) {
    const u = S.sel
    const p = ask((G, q) => q.freeSpot(G, u, ground.x, ground.z, side, G.units.filter((o) => o !== u)))
    if (p && Math.hypot(p.x - ground.x, p.z - ground.z) < 2.5) {
      const why = send(side, { t: 'place', u: u.id, c: G.nav.index(p.x, p.z) })
      if (!why) {
        sfx.click()
        units.labelAll()
      }
      return why
    }
  }
  return null
}

// Pick up a unit (null: none). On a seat's own turn its move shows where it
// can go (the move's plan, which the click snaps to), and its shot or charge
// the range ring.
function select(u) {
  S.sel = u
  S.reach = null
  overlay.clear()
  if (u && G) {
    const ph = phaseKey(G)
    if (G.turn.stage === 'battle' && ph === 'move' && !u.flags.moved) {
      S.reach = ask((G, q) => q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0))
      overlay.reach(S.reach, G.nav)
    }
    if (ph === 'shoot' && u.t.ranged) showRange(u, u.t.ranged.range)
    if (ph === 'charge') showRange(u, CHARGE_RANGE)
  }
  showCard(u)
  refreshUI()
}

// The range ring of a shot or a charge, around the unit picked up.
function showRange(u, range) {
  overlay.range(u.pos, u.r, range, phaseKey(G) === 'charge' ? '#ffb070' : '#ffffff')
}

// What the pointer is over: a unit's line, or on a seat's own turn what its
// selected unit would do there (the path and inches of a move, a shot's
// odds, a charge's), or where a charge would end. Asked with the dice
// locked; while the player is behind, the units are as shown.
function hover() {
  const tip = $('#tooltip')
  tip.style.display = 'none'
  overlay.pathLine.visible = false
  overlay.ghost.visible = false
  const h = S.hoverPick
  const pk = picking()
  if (!h) {
    // off the board mid-pick: show where "Shortest move" would put the unit
    if (pk) overlay.ghostAt(G.nav, pk.cell, pk.u.r)
    return
  }
  S.hover = h.unit
  let text = ''
  const sel = S.sel
  // a path, drawn with its end's ghost
  const path = (pts, i, r) => {
    overlay.path(pts)
    overlay.ghostAt(G.nav, i, r)
  }
  if (pk && h.ground) {
    const i = nearestSpot(G.nav, pk.ok, h.ground.x, h.ground.z)
    if (i >= 0) {
      path(ask((G) => G.nav.path(pk.plan.res, i, pk.u.r, pk.plan.mode === 'fly' ? null : pk.plan.forbid)), i, pk.u.r)
      text = `End charge here · ${pk.plan.res.dist[i].toFixed(1)}" of ${pk.rolled}"`
    } else text = `✖ out of reach — pick a spot in the orange area`
  } else if (myTurn() && sel) {
    text = ask((G, q) => {
      const ph = q.phaseKey(G), nav = G.nav
      if (ph === 'move' && S.reach && h.ground && !h.unit) {
        const i = q.nearestValid(G, S.reach, h.ground.x, h.ground.z)
        if (i < 0) return ''
        path(nav.path(S.reach.res, i, sel.r, S.reach.mode === 'fly' ? null : S.reach.forbid), i, sel.r)
        return `${S.reach.res.dist[i].toFixed(1)}" of ${S.reach.max}"`
      }
      if (ph === 'shoot' && h.unit && h.unit.side !== sel.side) {
        const info = q.shotInfo(G, sel, h.unit)
        return info.ok ? oddsText(sel, h.unit, info) : `✖ ${info.why}`
      }
      if (ph === 'charge' && h.unit && h.unit.side !== sel.side) {
        if (!q.chargeTargets(G, sel).includes(h.unit)) return `✖ out of charge range (${q.gap(sel, h.unit).toFixed(1)}")`
        const p = q.chargePlan(G, sel, h.unit)
        return p ? `Charge: need ${p.need}" on 2D6 — ${Math.round(p2D6(p.need) * 100)}%` : '✖ no route'
      }
      return ''
    })
  }
  if (!text && h.unit) {
    // the unit as shown, like its label
    const mu = shown(h.unit)
    text = `${h.unit.t.name} · ${h.unit.t.models > 1 ? `${mu.alive}/${h.unit.t.models} models` : `${mu.models[0].w}/${h.unit.t.W} wounds`}`
  }
  if (text && S.mouse) {
    tip.innerHTML = text
    tip.style.display = 'block'
    tip.style.left = S.mouse.x + 16 + 'px'
    tip.style.top = S.mouse.y + 14 + 'px'
  }
}

function oddsText(u, target, info) {
  const w = u.t.ranged
  if (w.mesmerize) return `Mesmerize: cast ${w.spell}+ on 2D6 (${Math.round(p2D6(w.spell) * 100)}%) · D3 mortal wounds`
  const lines = []
  if (w.spell) lines.push(`Cast ${w.spell}+ (${Math.round(p2D6(w.spell) * 100)}%)`)
  const n = attackCount(u, w, false)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  lines.push(`${n} ${w.blast ? `template${n > 1 ? 's' : ''} (${w.blast}")` : 'shots'} · hit ${w.spell ? 'auto' : info.need + '+'} · wound ${wn}+ · save ${sn > 6 ? '—' : sn + '+'}`)
  const flags = []
  flags.push(`${info.range.toFixed(1)}"`)
  if (info.cover) flags.push('cover')
  if (!info.visible) flags.push('unseen (indirect −1)')
  else if (info.seen < info.total) flags.push(`${info.seen}/${info.total} visible`)
  if (w.heavy && u.flags.moved) flags.push('moved (heavy −1)')
  if (!w.blast) {
    const e = expected(n, info.need, w, target, info.cover)
    flags.push(`≈${e.kills.toFixed(1)} slain`)
  }
  lines.push(flags.join(' · '))
  return lines.join('<br>')
}

// ── UI: dice tray, log, card, HUD ───────────────────────────────────────────
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }
function dieEl(v, cls) {
  const d = document.createElement('div')
  d.className = `die ${cls}`
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('i')
    if (PIPS[v].includes(i)) p.className = 'on'
    d.appendChild(p)
  }
  return d
}

const tray = {
  el: $('#tray'),
  clear(title) {
    this.el.innerHTML = ''
    const t = document.createElement('div')
    t.className = 'tray-title'
    t.textContent = title
    this.el.appendChild(t)
    this.el.classList.add('show')
  },
  // `need` 0 means "just show the dice"; save rows colour passes as blocked.
  async row(label, dice, need, { sum = false, pass, note = '', save = false } = {}) {
    sfx.dice(dice.length)
    const row = document.createElement('div')
    row.className = 'tray-row'
    const l = document.createElement('span')
    l.className = 'lbl'
    l.textContent = label
    row.appendChild(l)
    const box = document.createElement('span')
    box.className = 'dice'
    row.appendChild(box)
    const shown = dice.slice(0, 30)
    shown.forEach((v, i) => {
      const cls = need ? (v >= need ? (save ? 'saved' : 'ok') : 'fail') : pass === false ? 'fail' : pass ? 'ok' : 'plain'
      const d = dieEl(v, cls)
      d.style.animationDelay = `${(i * 0.025) / clock.speed}s`
      box.appendChild(d)
    })
    const res = document.createElement('span')
    res.className = 'res'
    if (need) {
      const k = passes(dice, need)
      res.textContent = save ? `${k} saved` : `${k} ✓`
      if (dice.length > 30) res.textContent += ` (of ${dice.length})`
    } else if (sum) {
      res.textContent = note || `= ${dice.reduce((a, b) => a + b, 0)}`
      if (pass === true) res.classList.add('good')
      if (pass === false) res.classList.add('bad')
    }
    row.appendChild(res)
    this.el.appendChild(row)
    while (this.el.children.length > 7) this.el.children[1].remove()
    await wait(PACE.dice(dice.length))
  },
}

// The battle log. Every line is traced as it is logged (core/journal.js:
// the trace is the match's replayable fingerprint), then shown: its `log`
// event, played here by write, the destroyed-unit lines held back until an
// attack ends following it.
// A line into the battle log. `at` is the trace's length when it was logged
// (or flushed); under ?debug the entry carries it (data-at), and the page's
// trace has reached it before the entry lands (the ?debug block's listener).
function write(side, html, cls, at) {
  const list = $('#logList')
  const e = document.createElement('div')
  e.className = `entry s${side} ${cls}`
  e.innerHTML = html
  if (traceListener) {
    traceListener.reach(at)
    e.dataset.at = at
  }
  list.prepend(e)
  while (list.children.length > 80) list.lastChild.remove()
}

const statKeys = ['M', 'WS', 'BS', 'S', 'T', 'W', 'A', 'Ld', 'Sv', 'OC']
// the unit the open card shows (idled() redraws it as the table catches up)
let carded = null
function showCard(u) {
  const card = $('#card')
  carded = u
  if (!u) {
    card.classList.remove('show')
    return
  }
  const t = u.t
  const fmt = (k) => (k === 'M' ? `${t.M}"` : ['WS', 'BS', 'Sv'].includes(k) ? `${t[k]}+` : t[k])
  const wpn = (w, icon) => {
    if (!w) return ''
    if (w.mesmerize) return `<div class="wpn"><span>${icon} ${w.name}</span><em>spell ${w.spell}+ · ${w.range}" · D3 mortal + mesmerize</em></div>`
    const bits = []
    if (w.range) bits.push(`${w.range}"`)
    if (w.spell) bits.push(`spell ${w.spell}+`)
    if (w.blast) bits.push(`blast ${w.blast}" ×${w.shots}`)
    else if (w.shots) bits.push(`A${w.shots}`)
    bits.push(`S${w.S}`, `AP-${w.AP}`, `D${w.D}`)
    if (w.poison) bits.push(`poison ${w.poison}+`)
    if (w.indirect) bits.push('indirect')
    if (w.heavy) bits.push('heavy')
    if (w.assault) bits.push('assault')
    return `<div class="wpn"><span>${icon} ${w.name}</span><em>${bits.join(' · ')}</em></div>`
  }
  // what stands, what wounds are left, mesmerized and in combat: as shown,
  // like the label. What it has done this turn and whether it stands in
  // cover have no shown source yet (the mirror holds neither: R7's HUD
  // model), so they read the match, and only once the table has caught up
  // with it: while the player is behind (the AI's turn, a watched battle)
  // they are left off, or the card would tell of moves and dice the table
  // hasn't played (§2.4). (The title's backdrop is never behind.)
  const mu = shown(u), live = player.idle
  const status = []
  if (live && u.flags.moved) status.push(u.flags.fellBack ? 'fell back' : u.flags.advanced ? `advanced +${u.flags.advRoll}"` : 'moved')
  if (live && u.flags.shot) status.push('shot')
  if (live && u.flags.charged) status.push('charged')
  if (mu.mesmerized) status.push('🌀 mesmerized')
  if (mu.alive > 0 && mu.engaged) status.push('⚔ in combat')
  if (live && mu.alive > 0 && inCover(atTable(), u)) status.push('🛡 in cover')
  const models = t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`
  card.innerHTML = `
    <div class="card-head s${u.side}"><b>${t.name}</b><span>${SIDES[u.side].short} · ${t.role}</span></div>
    <div class="card-sub">${mu.alive > 0 ? models : 'destroyed'}${status.length ? ' · ' + status.join(' · ') : ''}</div>
    <table class="stats"><tr>${statKeys.map((k) => `<th>${k}</th>`).join('')}</tr><tr>${statKeys.map((k) => `<td>${fmt(k)}</td>`).join('')}</tr></table>
    ${wpn(t.ranged, t.ranged?.spell ? '✦' : '➹')}${wpn({ ...t.melee, range: 0 }, '⚔')}
    <ul class="abil">${(t.abilities || []).map((a) => `<li>${a}</li>`).join('')}</ul>`
  card.classList.add('show')
}

// The HUD: the score, round, phase and seat as shown (the mirror), and what
// a seat played here can do now. Its buttons show while a local seat's
// decision is the one on the table, and go disabled (not just deaf) while
// the table plays: a seat's own action, or anything else. While the player
// is behind they keep what they showed, so they never read the match before
// the table has caught up with it; they hide once the decision has moved on
// (an End or an Auto hands the phase over).
function refreshUI() {
  const M = player.mirror, at = atTable()
  const rounds = at.setup.rounds
  // the score and the round as shown
  $('#vp0').textContent = M.vp[0]
  $('#vp1').textContent = M.vp[1]
  $('#round').textContent = M.stage === 'deploy' ? 'Deployment' : `Round ${Math.min(M.round, rounds)} / ${rounds}`
  document.querySelectorAll('#phases .ph').forEach((el) => {
    el.classList.toggle('on', M.stage === 'battle' && el.dataset.k === M.phase)
  })
  $('#sideA').classList.toggle('active', M.stage === 'battle' && M.active === 0)
  $('#sideB').classList.toggle('active', M.stage === 'battle' && M.active === 1)
  const idle = player.idle, P = localDecision(), sel = S.sel
  const deploying = P?.k === 'deploy'
  // the seat's own phase, which the table has reached (its banner played:
  // the mirror's turn fields are the last phase.start's)
  const mine = phaseShown && P?.k === 'phase' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === P.phase && M.round === G.turn.round
  // (the same seat's charge, waiting on its end: still its own phase)
  const charging = phaseShown && P?.k === 'chargeEnd' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === 'charge' && M.round === G.turn.round
  const pk = picking()
  const end = $('#endPhase'), auto = $('#autoPhase'), adv = $('#advance')
  if (!mine && !charging) buttonsUp = false
  else if (idle) buttonsUp = true
  // (the pick hides them: Shortest move stands in their place)
  const up = buttonsUp && !pk
  end.style.display = deploying || up ? '' : 'none'
  auto.style.display = up ? '' : 'none'
  $('#closestSpot').style.display = pk ? '' : 'none'
  if (deploying) end.textContent = 'Begin battle ▸'
  else if (mine) end.textContent = `End ${PHASE_NAME[P.phase]} ▸`
  end.disabled = auto.disabled = adv.disabled = !idle
  if (!mine) adv.style.display = 'none'
  else if (idle) adv.style.display = P.phase === 'move' && sel && !sel.flags.moved && !sel.flags.advanced && !ask((G, q) => q.isEngaged(G, sel)) ? '' : 'none'
  if (sel) {
    adv.textContent = `Advance (+D6") — no ${sel.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`
    if (sel.t.chargeAfterAdvance) adv.textContent = 'Advance (+D6") — can still charge'
  }
  // the deploying seat's zone is lit; in battle both dim
  const dep = deploySeat()
  table.zones([0, 1].map((s) => (M.stage === 'battle' || M.stage === 'over' ? 0.05 : s === dep ? 0.2 : 0.07)))
  // hint line (a picked-up unit's kept as it was while the table plays its
  // action: the match has moved on already)
  let hint = $('#hint').textContent
  if (pk) hint = `Charge! Rolled ${pk.rolled}" — click the orange area to place ${pk.u.t.short}, or take the shortest move.`
  else if (deploying) hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (G && phaseShown && M.stage === 'battle' && !human(M.active)) hint = `${SIDES[M.active].name} (AI) are taking their turn…`
  else if (mine && (idle || !sel)) {
    hint = {
      move: sel ? (ask((G, q) => q.isEngaged(G, sel)) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.',
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[P.phase] || ''
  } else if (!mine) hint = ''
  $('#hint').textContent = hint
  $('#hint').style.display = hint ? '' : 'none'
  refreshRings()
}

// Each unit's ring: the one picked up, the deploying seat's, a charge's
// target, and on a seat's own turn who can act and what the picked-up unit
// can shoot or charge (asked of the match, so only once the table has
// caught up); the one under the pointer. ringLooks() is each ring's
// [colour, opacity] by its view (the ?debug snap check paints a fresh
// table's rings with it too).
function ringLooks() {
  const mine = myTurn(), dep = deploySeat(), pk = picking(), sel = S.sel
  // (unit id → [colour, opacity]) for what the match says, on a seat's turn
  const lit = !mine ? new Map() : ask((G, q) => {
    const ph = q.phaseKey(G), out = new Map()
    for (const u of G.units) {
      if (!q.alive(u) || u === sel) continue
      if (q.canAct(G, u)) out.set(u.id, ['#ffffff', 0.75])
      else if (sel && ph === 'shoot' && u.side !== sel.side && q.shotInfo(G, sel, u).ok) out.set(u.id, ['#ff5a4a', 0.95])
      else if (sel && ph === 'charge' && u.side !== sel.side && q.chargeTargets(G, sel).includes(u)) out.set(u.id, ['#ffa040', 0.95])
    }
    return out
  })
  return (v) => {
    if (v.id === sel?.id) return ['#ffe680', 1]
    if (dep >= 0 && v.u.side === dep) return ['#ffffff', 0.5]
    if (pk && v.id === pk.tg.id) return ['#ffa040', 0.95]
    if (lit.has(v.id)) return lit.get(v.id)
    if (v.id === S.hover?.id) return ['#ffffff', 0.35]
    return ['#ffffff', 0]
  }
}
function refreshRings() {
  units.paintRings(ringLooks())
}

async function banner(a, b, side = -1) {
  const el = $('#banner')
  el.innerHTML = `<div class="b1">${a}</div><div class="b2">${b}</div>`
  el.querySelector('.b1').style.color = seatInk(side)
  el.classList.remove('show')
  void el.offsetWidth
  el.classList.add('show')
  // (longer when the seat shown is played here, or outside the battle)
  const M = player.mirror
  await wait(PACE.phaseStart(local(M.active), M.stage))
}

// ── Buttons ─────────────────────────────────────────────────────────────────
// End: in the deployment, the deploying seat is done (the last seat done
// starts the battle); on a seat's own turn, the phase ends.
// (Each button's handler returns why it sent nothing, null once it sent:
// for the ?debug block's hooks, which press them.)
$('#endPhase').onclick = () => {
  unlock()
  sfx.click()
  if (deploySeat() >= 0) {
    const why = send(deploySeat(), { t: 'deployed' })
    if (!why) {
      S.sel = null
      showCard(null)
      refreshUI()
    }
    return why
  }
  if (!myTurn()) return 'no phase of a seat played here to end now'
  select(null)
  return send(localSeat(), { t: 'end' })
}
// Shortest move: the charge ends where the AI's would.
$('#closestSpot').onclick = () => {
  sfx.click()
  return takeShortest()
}
// Auto: the AI plays the rest of the phase for the seat, then ends it (one
// command: the match plays it all at once, the table at its pace).
$('#autoPhase').onclick = () => {
  if (!myTurn()) return 'no phase of a seat played here to play out now'
  select(null)
  return send(localSeat(), { t: 'auto' })
}
// Advance: a D6 more inches for the unit picked up (it stays picked up, its
// move now as far as the roll allows: idled).
$('#advance').onclick = () => {
  const u = S.sel
  if (!u || !myTurn()) return 'no unit of a seat played here to advance now'
  return advance(u)
}
const SPEEDS = [1, 2, 4]
$('#speed').onclick = () => {
  clock.speed = SPEEDS[(SPEEDS.indexOf(clock.speed) + 1) % SPEEDS.length]
  $('#speed').textContent = `⏩ ${clock.speed}×`
}
$('#follow').onclick = () => {
  rig.follow = !rig.follow
  $('#follow').classList.toggle('off', !rig.follow)
}
$('#mute').textContent = isMuted() ? '🔇' : '🔊'
$('#mute').onclick = () => {
  unlock()
  $('#mute').textContent = toggleMute() ? '🔇' : '🔊'
}
$('#helpBtn').onclick = () => $('#help').classList.remove('hidden')
$('#helpClose').onclick = () => $('#help').classList.add('hidden')
$('#logToggle').onclick = () => $('#log').classList.toggle('collapsed')
$('#seed').value = S.seed
$('#reroll').onclick = () => {
  S.seed = (Math.random() * 1e6) | 0
  $('#seed').value = S.seed
  showTable(S.seed)
}
$('#seed').onchange = () => {
  // (the table first: should it throw, S.seed still names the one on show)
  const seed = (Number($('#seed').value) || 1) >>> 0
  showTable(seed)
  S.seed = seed
  $('#seed').value = seed
}
document.querySelectorAll('[data-mode]').forEach((b) => {
  b.onclick = () => {
    unlock()
    sfx.click()
    start(b.dataset.mode)
  }
})
$('#again').onclick = () => {
  $('#over').classList.add('hidden')
  $('#title').classList.remove('hidden')
  document.body.classList.remove('playing')
  rig.toTitle()
  showTable(S.seed)
}

// Escape puts down the unit picked up (but a charge's end must be picked);
// the camera rig keeps the panning keys (view/camera.js)
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  if (e.key === 'Escape' && !picking()) select(null)
})

// ── Setup ───────────────────────────────────────────────────────────────────
// The title screen's table for a board seed: its board and both armies where
// any battle on it deploys them, drawn from a match that is never played
// (both seats human, so it waits at its deployment having drawn nothing, and
// its dice, 0, are never rolled). The battle a mode starts is a match of its
// own (start()), on this table when it is the battle's (tableOf: the title's
// is the classic terrain set and the races at the table, RACE_PICK).
function showTable(board, { terrain = 'classic', races = RACE_PICK } = {}) {
  // the new table first: if building it throws, the last one stays whole
  // (a quiet match: none of what it did is played, the table being drawn
  // from it as it stands)
  const next = createMatch({ board, dice: 0, terrain, seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: null })
  session?.close()
  session = null
  G = null
  backdrop = next
  backdropAsDrawn = true
  // (the figures take their seat's colours as they are made)
  seatPlayers(seatsOf(races))
  // a new table, drawn afresh: every figure and mesh of the last one off it
  // and freed
  units.dispose()
  terrainView.dispose()
  S.sel = null
  S.reach = null
  pickShown = null
  phaseShown = false
  buttonsUp = false
  overlay.clear()
  $('#logList').innerHTML = ''
  $('#tray').classList.remove('show')
  // its board, then the tufts strewn anew, then (the snap) its figures: the
  // order the table has always been drawn in, so the cosmetic Math.random
  // draws fall as they did (three.js draws some for every object it makes)
  terrainView.sync(next.terrain.chunks)
  table.scatterTufts()
  // the table as shown: the match as it stands (its board, its units where
  // they stand, nobody's flags), at the title's stage; the snap draws it
  // (and takes away the last game's scorch marks, and a template or thorns
  // a replaced table left standing, though only the title and the end
  // screen replace one, with nothing left to play)
  player.snap(next, onTitle(next))
  // nothing else from the last game carries over: banners, turn state
  objectives.reset()
  refreshUI()
}

// A backdrop as the title shows it: the match as it stands, at the stage
// 'title' (its own, a deployment no one plays, is never shown).
const onTitle = (g) => ({ ...project(g), stage: 'title' })

// who plays each seat, by the title screen's mode buttons
const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }

// What of a setup the table shows before its battle: the board, the terrain
// set and the races at it (a mission too, once a setup names one). Who plays
// a seat, the dice and the rounds draw nothing on it.
const tableOf = (setup) => {
  const s = fullSetup(setup)
  return { board: s.board, terrain: s.terrain, races: s.seats.map((x) => x.race) }
}
const sameTable = (a, b) => JSON.stringify(tableOf(a)) === JSON.stringify(tableOf(b))

// A battle: the whole setup (the board on the title screen, a fresh dice
// stream, who plays each seat), a LocalStore whose first entry starts it,
// and a Session over it for the seats played here. The match runs on at
// once: to each human seat's deployment, or (watch) to its end, and the
// table plays it from there.
function start(mode) {
  // an unknown mode changes nothing (S included), so the table stays playable
  if (!Object.hasOwn(MODES, mode)) throw new Error(`no mode "${mode}" (there are ${Object.keys(MODES).join(', ')})`)
  const who = MODES[mode]
  // (a battle starts on a fresh table: a second start without the end
  // screen's Back would find the last battle's on show)
  if (session) showTable(S.seed)
  // a fresh logic-dice stream per battle; ?dice=N replays one exactly
  const dice = (Number(params.get('dice')) || ((Math.random() * 1e9) | 0)) >>> 0
  const setup = {
    board: S.seed, dice, terrain: 'classic', rounds: MISSIONS.classic.rounds, diceMode: 'shared',
    seats: RACE_PICK.map((race, i) => ({ race, ctrl: who[i] })),
  }
  // The battle starts on the table shown, which must be its own: the
  // backdrop, on the same board and terrain with the same races and untouched
  // since it was drawn, is that match's table before anything has happened
  // (else it is drawn afresh from the battle's setup first: today the title's
  // always is the battle's). So the table is snapped to it as it stands (the
  // figures and meshes on show kept, every one being the battle's), and the
  // battle's events play on from there: its board's adds take back the
  // meshes they find untouched (view/terrain.js), so nothing is rebuilt
  // (P-present holds the table to the match at every checkpoint).
  if (!backdropAsDrawn || !sameTable(backdrop.setup, setup)) showTable(setup.board, tableOf(setup))
  S.control = [...who]
  S.sel = null
  S.reach = null
  seatPlayers(seatsOf(setup.seats.map((s) => s.race)))
  // the page's trace starts afresh (?debug), before the match's first line
  traceListener?.begin()
  // (as the title showed it: the battle's own stage events, its deployment's
  // first, take it on from there, P-present holding each)
  player.snap(backdrop, onTitle(backdrop))
  const store = new LocalStore()
  session = new Session({ store, localSeats: who.flatMap((c, s) => (c === 'human' ? [s] : [])), sink, onTrace })
  store.append({ s: -1, t: 'start', setup })
  if (session.status === 'refused') {
    // no battle: the title's table again, drawn afresh from the board it
    // showed (built once already, so it builds again), and no refused
    // Session left behind
    const why = session.error
    session.close()
    session = null
    showTable(backdrop.setup.board, tableOf(backdrop.setup))
    throw new Error(`the battle could not start: ${why}`)
  }
  $('#title').classList.add('hidden')
  document.body.classList.add('playing')
  if (innerWidth < 700) $('#log').classList.add('collapsed')
  // the camera swings onto the battle's view (present/camera-presets.js:
  // today's, by the screen's shape)
  rig.goTo(battleView({ localSeats: session.localSeats, edges: [0, 1].map((s) => edgeOf(session.G, s)), aspect: innerWidth / innerHeight }))
  refreshUI()
}

// ── Boot ────────────────────────────────────────────────────────────────────
// The title's table, then the frame loop (view/stage.js): each frame the
// effects, the figures and the flags as shown, then the camera.
showTable(S.seed)
stage.run({
  parts: (dt, time) => {
    fx.update(dt)
    units.animate(dt, time, { fast: FAST, camera, sel: S.sel?.id })
    objectives.animate(dt, time, player.mirror.owners)
  },
  rig,
  shake: () => fx.shake,
})
if (params.has('watch')) start('watch')
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
  // editing sim/oracle: the PIN and the working tree share a driver.
  //
  // Since R6b the surface is derived from the battle's Session (no battle on
  // the title: its members read the backdrop there, and S.stage says
  // 'title'). The hooks are wrappers that build a command body and send it
  // through the Session (main.js's own command functions: moveTo, shoot, …),
  // returning a promise settled once the player has played everything again
  // (doCharge's: once no charge waits for its end either, so it stays
  // pending until the chargeEnd is placed, as the old pick did); a hook's
  // command the match refuses throws, since the driver checked it as the UI
  // does, and so does a button pressed when it can't send (every hook's:
  // deployClick's placement and the buttons' too). deployClick keeps its
  // pick-up-then-place pair, ending in a `place` for freeSpot's cell (a spot
  // too far from the click is still the UI's no-op, which the driver sees
  // for itself); placeCharge takes a cell the roll reaches, never Shortest
  // move's -1 (the driver sends the plan's own cell for that, as a click
  // on it would); endPhase and autoPhase press the buttons. Derived,
  // never stored: phaseResolve is truthy while a seat played here holds a
  // phase decision and the player is idle (main.js's myTurn); chargePick is
  // {u, plan, ok} while one holds a chargeEnd and the player is idle (the
  // charge-end tool's pick: plan.cell the shortest move's, ok a 1 per cell
  // the roll reaches); S.busy and S.auto are !player.idle; S.deploySide is
  // the seat deploying here. S's turn fields read the match (G.turn; wiped
  // undefined until a side is wiped, -1 in G.turn; the phase the key of
  // G.turn.ph), except that S.stage says 'over' only once the page has
  // shown the end (the player idle, every trace line joined), since sim/
  // stops reading there; until then 'battle'. units, nav and scenery.chunks
  // are the match's, and the queries take it (q.canAct: (u) => canAct(G,
  // u)), asked with the dice locked. S lists and copies as a plain object
  // would ({...S}, JSON), turn fields included, though structuredClone
  // refuses it, as it does any Proxy.
  //
  // The trace is one array for the page's lifetime, fed by each battle's
  // onTrace (createMatch's, which the Session passes) as the match writes
  // a line, and emptied when start() begins a battle. The match runs ahead
  // of the view: one `end` computes a whole AI turn, a watched battle the
  // whole battle, before its first die is shown. So the trace keeps pace
  // with the player: a line the match writes while the player is behind it
  // (events not yet played) joins `trace` when the player reaches it: at the
  // log event that shows it (each carries `at`, the trace's length when it
  // was logged, and `trace` is brought up to `at` before the entry is
  // written, which carries it too, as data-at), or when the player goes
  // idle. sim/ then records every write at the trace length it always did.
  // It takes a state line's shadow as the line joins (oracle/shadow.mjs
  // reads S, q.rngState(), units and scenery.chunks then), when the match
  // has long moved on; so each state line carries a snapshot of what that
  // shadow reads, taken as the match writes the line (the turn as the
  // legacy shadow has it, the dice, every unit, every chunk), and while the
  // line is pushed those members serve the snapshot. (The legacy round
  // quirk too: one past the last on the `over` line of a battle that ran its
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
  // holds the player: below); view.counts() and renderer.info, for
  // sim/rematch-memory.mjs (and view.counts().marks, fx's, and player.snap,
  // for sim/snap-check.mjs's snap in place). Nor G and session, for
  // the console and for sim/rematch-check.mjs (G.out, which it requires
  // empty whenever the player is idle and before each new table: the
  // Session hands every event over as it folds an entry; it also presses
  // #again, #reroll and #seed's onchange, and reads S.seed), nor player,
  // which it reads for that (player.idle). Nor, for sim/present-check.mjs,
  // present.listen(observer), present.card(u) (the unit card's status line
  // as it shows u now: it holds the card to the mirror while the player is
  // behind), G (at the game's end it holds its mirror to project(G)) and
  // player.idle (at the game's end): the observer's
  // reset(M) hears the mirror of each snap (R7: the player's snap(G), a new
  // table's, the backdrop's at the title's stage, and a battle's as it
  // starts, the backdrop's again, the battle's table before anything
  // happened, which it folds its own from) and event(e, M) every event
  // as the player plays it, so it can hold its mirror to each act's `proj`
  // and to each `check {proj}`, which only ?debug carries: P-present's
  // checkpoints, put into each entry's events before the player gets them
  // (present(), below). The core can't project (present/ is above it), so
  // onTrace takes project(G) as the match writes each `act`, `phase` and
  // `over` line, where it stands in the events so far: a `check` there
  // (after an action's own events, before its end re-reports the flags and
  // labels; after a fight or morale phase; before the end), the `act`
  // event's `proj` the act line's; and a `check` at the end of each entry's
  // events, as the match stops for a decision or ends. The M it is handed is
  // the player's own, folded in place (present/mirror.js): an observer
  // reads it and never folds into it, or every event would be applied
  // twice.
  const TURN = new Set(['stage', 'round', 'active', 'first', 'phase', 'vp', 'wiped'])
  // (the camera's, which S held until R7)
  const RIG = new Set(['titleSpin', 'titleAngle', 'viewShift', 'follow'])
  const DERIVED = {
    busy: () => !player.idle,
    auto: () => !player.idle,
    deploySide: () => (deploySeat() < 0 ? undefined : deploySeat()),
  }
  const trace = [], held = []
  // the state a state line carries, while it is pushed
  let serving = null
  // the page has shown everything: the player idle, every line joined
  const caughtUp = () => player.idle && !held.length
  const turn = (k) => {
    if (serving) return serving.turn[k]
    const g = atTable(), T = g.turn
    if (k === 'stage') return !G ? 'title' : T.stage === 'over' && !caughtUp() ? 'battle' : T.stage
    return k === 'wiped' ? (T.wiped < 0 ? undefined : T.wiped) : k === 'phase' ? phaseKey(g) : T[k]
  }
  const legacyS = new Proxy(S, {
    get: (s, k) => (TURN.has(k) ? turn(k) : Object.hasOwn(DERIVED, k) ? DERIVED[k]() : RIG.has(k) ? rig[k] : s[k]),
    has: (s, k) => TURN.has(k) || Object.hasOwn(DERIVED, k) || RIG.has(k) || k in s,
    set: (s, k, v) => {
      if (TURN.has(k)) throw new Error(`__ts.S.${k} is the match's ${k === 'phase' ? 'G.turn.ph (phaseKey)' : `G.turn.${k}`}: it can't be set through S`)
      if (Object.hasOwn(DERIVED, k)) throw new Error(`__ts.S.${k} is derived from the Session and the player: it can't be set`)
      if (RIG.has(k)) rig[k] = v
      else s[k] = v
      return true
    },
    ownKeys: (s) => [...new Set([...Reflect.ownKeys(s), ...TURN, ...Object.keys(DERIVED), ...RIG])],
    getOwnPropertyDescriptor: (s, k) =>
      TURN.has(k) ? { value: turn(k), enumerable: true, configurable: true, writable: false }
      : Object.hasOwn(DERIVED, k) ? { value: DERIVED[k](), enumerable: true, configurable: true, writable: false }
      : RIG.has(k) ? { value: rig[k], enumerable: true, configurable: true, writable: true }
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
    traceListener.settled()
  })
  traceListener = {
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
  // as it stands builds (the player's rebuild, into a scene of its own,
  // from nothing), and against one kept from the last check and synced again
  // (the snap's keeping path): every unit's ring (place, size, colour and
  // strength), hit cylinder, standing figures and label, every chunk's mesh
  // shown or not and where it stands, and what the shooting holds outside
  // the mirror (a template's marker, an eruption's thorns: nothing, once
  // the queue is drained, which a snap's table holds too). Asked once the
  // player is idle and the figures have settled (a figure walks to its
  // slot, a fallen one sinks out of sight, over a few frames).
  const offTable = () => {
    const sc = new THREE.Scene()
    // (draws nothing: a rebuild throws no debris)
    const quiet = new Proxy({}, { get: () => () => {} })
    const at = { M: null }
    const uv = new UnitViews({ scene: sc, labels: document.createElement('div'), fx: quiet, mirror: () => at.M, colorOf: (s) => SIDES[s].color, W })
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
    rebuild(g, t.at.M, { chunks, terrain: t.terrain, units: t.units, shots: t.shots, effects: t.effects })
    t.units.paintRings(ringLooks())
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
      return G
    },
    get session() {
      return session
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
        showCard(u)
        return /class="card-sub">([^<]*)</.exec($('#card').innerHTML)?.[1] ?? null
      },
    },
    get units() {
      return serving ? serving.units : atTable().units
    },
    get nav() {
      return atTable().nav
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
        if (G) throw new Error('?debug scenery.blast: only on the title screen (no battle)')
        const out = []
        const broke = backdrop.terrain.blast(x, z, r, dmg, opts, out)
        backdropAsDrawn = false
        player.push(out)
        refreshNav(backdrop)
        return broke
      },
    },
    validEnd: (plan, i) => asked((g) => validEnd(g, plan, i)),
    get phaseResolve() {
      return myTurn() || null
    },
    get chargePick() {
      const pk = picking()
      return pk && { u: pk.u, plan: pk.plan, ok: pk.ok }
    },
    start,
    select,
    doMove: (u, c) => {
      must(moveTo(u, c), 'doMove')
      return settle()
    },
    doAdvance: (u) => {
      must(advance(u), 'doAdvance')
      return settle()
    },
    doShoot: (u, tg) => {
      must(shoot(u, tg), 'doShoot')
      return settle()
    },
    doCharge: (u, tg) => {
      must(charge(u, tg), 'doCharge')
      // (the battle it was sent in: a new table, or another battle, ends the
      // wait)
      const s = session
      return settle(() => s !== session || s.G.pending?.k !== 'chargeEnd')
    },
    placeCharge: (c) => {
      must(placeCharge(c), 'placeCharge')
      return settle()
    },
    deployClick: (unit, ground) => must(deployClick(unit, ground), 'deployClick'),
    endPhase: () => {
      must($('#endPhase').onclick(), 'endPhase')
      return settle()
    },
    autoPhase: () => {
      must($('#autoPhase').onclick(), 'autoPhase')
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
        checkHook = fn
      },
      // what the table holds (sim/rematch-memory.mjs): the scene's own
      // objects, the battlefield's, the figures and the floating labels;
      // and fx's scorch and acid marks (sim/snap-check.mjs: a snap takes
      // them away)
      counts: () => {
        let figures = 0
        scene.traverse((o) => o.userData.fig && figures++)
        return { scene: scene.children.length, terrain: terrainView.group.children.length, figures, labels: stage.overlay.children.length, marks: fx.decals.length }
      },
    },
  }
}
