// The flow (DESIGN §1.1): from the title screen to a battle and back. The
// title's table for a board seed (showTable), a battle started by a mode
// (start: its setup, a LocalStore whose first entry starts it, a Session
// over it), the events the Session hands over played on the table (the
// sink, and the player's handlers: the view's, view/index.js, with the
// UI's and the flow's merged in), and what the table shows as the battle
// moves on: a stage (the deployment, the battle, its end), each phase's
// banner, each round's score, the end screen. The match decides all of it
// (core/engine.js); these are its events played.
//
// The battle itself is the core's (core/index.js): a pure function of its
// setup and the commands its seats send. Every mode plays one through a
// Session (match/session.js) over a LocalStore (match/store.js): the title
// screen's button makes the setup, the Session's start entry creates the
// match from it, the AI plays inside the match (core/engine.js, core/ai/),
// and a human seat's clicks become commands (input/human.js) that the
// Session appends as envelopes and folds into it through the Folder
// (match/fold.js), the same validator an online match has (the seat's
// device, its head, the match's hash, legal()). The match runs ahead, to
// the next decision a human makes, and reports what happened as events
// (DESIGN §2.3), which the player (view/player.js) plays at the table's
// pace, folding each into the mirror (present/mirror.js): the match as
// shown, which the figures, labels, flags and score read. Input and the HUD
// read the match itself (G) only once the player has played everything
// (§2.4).
//
// (N2) An online match is the same Session over an Automerge store
// (app/online.js makes it, from the lobby): follow() hands it to the flow
// already folded to the log's head, quietly, and the table is drawn from
// the match as it stands (a snap, the battle log made again from its
// entries), its events played from there on. Online the table may fall
// behind (a peer's whole turn arriving at once, a reconnect): the elastic
// catch-up plays a backlog of over 8 s twice as fast, over 16 s four times,
// and snaps past one of over 30 s. A refold that undoes moves shown (a
// concurrent insert, §2.6) snaps the table, keeps the battle log (made again)
// and says "History changed".
//
// (N3) The table may show another Session than the battle's own: a replay
// (app/replay.js) of the battle's first moves, a scrub to one of them, or
// a replay from its very start; the battle's own Session (`battle`) goes
// on folding meanwhile, its status still heard (online), and the table
// comes back to it as it then stands.
//
// (F12) In a game played here alone, Undo takes back the last placement,
// move or charge's end of the seat whose decision it is, back to its last
// commit point (app/undo.js): the battle's Session made again over its log
// as it stood before that entry, and swapped in for it.
import { OBJECTIVE_RANGE } from '../core/rules.js'
import { MISSIONS } from '../data/mission.js'
import { RACES } from '../data/schema.js'
import { edgeOf } from '../core/match.js'
import { createMatch, fullSetup, preview } from '../core/index.js'
import { Session } from '../match/session.js'
import { LocalStore } from '../match/store.js'
import { MAX_ENTRIES, Folder } from '../match/fold.js'
import { project } from '../present/mirror.js'
import { PACE } from '../present/pace.js'
import { viewsFor } from '../present/camera-presets.js'
import { hudModel, ringLooks, afterSnap, factsOf, turnBegun, resultOf, undoable, PHASE_NAME } from '../present/hud-model.js'
import { EventPlayer } from '../view/player.js'
import { clock } from '../view/clock.js'
import { sidesFor, seatsOf, paintSeats, seatInk } from '../ui/theme.js'
import { rewind } from './undo.js'

// who plays each seat, by the title screen's mode buttons
export const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }

// (F4) Keep playing is offered until the battle's log is 80% full (the
// Folder's cap, match/fold.js): past it the battle can only end, which
// keeps a long overtime clear of the cap freezing it mid-round
const OFFER_CAP = Math.floor(0.8 * MAX_ENTRIES)

// This device, as a battle's log names it: every human seat of a battle
// played here is played from it (the Folder takes a seat's commands from
// the device its setup names, match/fold.js). One name does for every game
// played alone; online play gives each device its own (N2).
export const DEVICE = 'local'

// (F10c) the key a battle's order book is kept under: its start entry and
// its seeds (a game played here writes the same first id every time)
export function bookKey(session) {
  const st = session.store.entries().find((e) => e?.t === 'start' && session.accepted.includes(e.id))
  const s = session.G?.setup
  return st ? `${st.id}.${s?.board}.${s?.dice}` : null
}

// What of a setup the table shows before its battle: the board seed, (F8a)
// the mission that chose the board, the terrain set, the races at it and
// (F11a) the armies they field, each seat's as fullSetup fills it in (the
// mission's preset where the setup names none, so a setup naming no army
// and one naming 'classic' are on one table). Who plays a seat, the dice
// and the rounds draw nothing on it.
export const tableOf = (setup) => {
  const s = fullSetup(setup)
  return { board: s.board, mission: s.mission, terrain: s.terrain, races: s.seats.map((x) => x.race), armies: s.seats.map((x) => x.army) }
}
const sameTable = (a, b) => JSON.stringify(tableOf(a)) === JSON.stringify(tableOf(b))

// A backdrop as the title shows it: the match as it stands, at the stage
// 'title' (its own, a deployment no one plays, is never shown).
export const onTitle = (g) => ({ ...project(g), stage: 'title' })

export class Flow {
  // `view` (view/index.js), `ui` (ui/: { tray, log, card, banner, tooltip,
  // hud, actions, title, result }), `params` (the page's URL parameters:
  // ?dice), `seed` (the title's board seed) and `races` (the races at the
  // table: the classic matchup, or ?races'), (F8a) `mission` the mission a
  // battle started here is fought for (classic, or ?mission's), (F11a)
  // `armies` the armies its seats field: null, each its mission's preset,
  // or ?armies' [seat 0's | null, seat 1's | null] (app/boot.js has judged
  // each against the races and the mission; null, the preset), (F7a)
  // `terrain` the terrain set the table is drawn on (null: each mission's
  // first set; or ?terrain's)
  constructor({ view, ui, params, seed, races, mission = 'classic', armies = null, terrain = null }) {
    this.view = view
    this.ui = ui
    this.params = params
    this.races = races
    this.mission = mission
    this.armies = armies
    // (F7a) the terrain set a battle started here is fought on, where its
    // mission is fought on it (terrainOf): ?terrain's, then the
    // battle-setup panel's last choice, as the races are; null, each
    // mission's first set. (The title's table is always the first set's:
    // showTable.)
    this.terrain = terrain
    // The table's and the screen's own state: the board seed and who plays
    // each seat as the title screen has them. (Every seed the page takes is
    // made a whole number from 0 to 2^32 - 1, as a setup's must be, with
    // `>>> 0`: app/boot.js.) The input's is input/human.js's, the camera's
    // the rig's (view/camera.js); the match's (the turn, the score, the
    // units) is G's.
    this.S = { seed, control: ['human', 'ai'] }
    // The battle being played: its Session (match/session.js), which folds
    // the battle's log (a LocalStore) through the core, and the match
    // itself, session.G. Both null on the title screen: no battle exists
    // before a mode is chosen, and start() makes a new one from the whole
    // setup, so nothing carries over from one battle to the next.
    this.session = null
    this.G = null
    // (N3) the battle's own Session: the one shown, but while a replay
    // shows another (show, showStart); and the replay (app/replay.js), which
    // app/boot.js hands the flow, told when the table idles and closed when
    // the battle is left
    this.battle = null
    this.replay = null
    // The table the title screen shows (showTable): a match on the board
    // seed that is never played. Both its seats are human, so it stops at
    // its deployment having drawn nothing; it is only drawn (its board, and
    // the armies where any battle on this board deploys them), and lends the
    // title its nav grid's geometry. A battle on the same board and races
    // starts on exactly this table, so its figures and meshes are kept
    // (start()).
    this.backdrop = null
    // false once the backdrop's board has been changed since it was drawn
    // (the ?debug block's scenery.blast, for sim/terrain-shots.mjs): it is
    // then no battle's table, and start() draws a fresh one
    this.backdropAsDrawn = true
    // Under ?debug every battle reports its trace lines to this listener as
    // it writes them, and start() says when a battle begins (app/boot.js's
    // ?debug block: sim/ reads one trace for the page's lifetime, emptied as
    // each battle begins); null without ?debug.
    this.traceListener = null
    // (?debug only) what a checkpoint does besides nothing: sim/snap-check.mjs
    // compares the table there
    this.checkHook = null
    // each seat's name, icon and colours, from its race (ui/theme.js)
    this.sides = sidesFor(seatsOf(races))
    // The HUD's own state (present/hud-model.js): whether the table has shown
    // a phase begin (its phase.start played) since the stage it shows began
    // (until one has, the mirror's turn fields are a table's before the
    // battle, seat 0's movement in round 1, which say nothing about whose
    // turn it is: through the roll-off the HUD shows no seat's phase); and
    // whether End and Auto are up for the seat whose phase the table shows.
    // And the hint line as it reads (the model keeps it while nothing new
    // applies). (View state: the mirror is held to project(G) by P-present,
    // so these stay out of it.)
    this.hud = { phaseShown: false, buttonsUp: false, hint: '' }
    // the HUD model last put on the page (?debug's `hud`, which
    // sim/hud-check.mjs reads end.ready from: nothing shows it before F3)
    this.shownHud = null
    // The unit card's record of what each unit has done this turn and
    // whether it stands in cover, as the match stood at the last point the
    // table has played of these (present/hud-model.js's facts): an action's
    // end, taken as the match writes each `act` line (`acted`, until the sink
    // hands the entry's events over, each `act` event carrying its own); the
    // stop after each entry, where the match waits on a decision (its
    // `pending` event, the entry's last, carrying the match as it stands:
    // the table shows exactly that once it has played it, so a deployment's
    // placements are in the record as the battle begins); and a snap. Read
    // with the dice locked (§4.1 rule 2: the core's preview), though they
    // draw nothing.
    this.facts = {}
    this.acted = []
    // Every battle's trace lines, as the match writes them (createMatch's
    // onTrace, which the Session passes): an action's facts for the card,
    // and under ?debug the trace listener's.
    this.onTrace = (line, g) => {
      if (/^act /.test(line)) this.acted.push(preview(g, factsOf))
      this.traceListener?.line(line, g)
    }
    // What the Session hands over after each entry it accepts: the events
    // that entry made happen, played in order. A battle's first entry, its
    // start, begins with the match's board (its terrain.clear and an add per
    // chunk); start() has snapped the table to the backdrop, the battle's
    // table as it stood before anything happened (the same board, terrain
    // and races), so the board's adds take back the meshes on show
    // (view/terrain.js) and the battle's events play on from there. Under
    // ?debug the checkpoints P-present holds the mirror to go in first (the
    // ?debug block).
    this.sink = {
      // (`ses`, the Session handing them over: a Session over a store that
      // holds entries already folds them as it is made, before start() has
      // it)
      events: (events, ses) => {
        if (this.G !== ses.G) {
          this.G = ses.G
          this.sameUnits(this.G)
        }
        // each action's end carries the match's facts as they stood then,
        // and the stop (the entry's `pending`) the match's as it stands
        const facts = this.acted.splice(0)
        events = events.map((e) => (e.t === 'act' ? { ...e, facts: facts.shift() } : e.t === 'pending' ? { ...e, facts: ses.preview(factsOf) } : e))
        if (this.traceListener) events = this.traceListener.present(events, this.G)
        this.player.push(events)
      },
      // (N2) a change folded whole: the table's catch-up decided on the
      // backlog it left (the fold is synchronous, so nothing played
      // meanwhile; a snap here is to the match the whole change leads to)
      settled: (ses) => {
        if (ses !== this.battle) return
        if (this.online) this.catchUp(ses)
        this.online?.settled?.(ses)
        this.replay?.render()
        // (F10c) Autopilot first and Auto-End answer here, a change folded
        // whole (never from an entry's events)
        this.human?.standing?.settled(ses)
      },
      // The match folded again, some of what was shown undone (a concurrent
      // insert into an online log, §2.6's sync: never in a game played
      // alone, whose log only grows at its end): the table snaps to it as it
      // stands, the battle log (and ?debug's trace) made again from it, and
      // (N2) a toast says how many moves shown are undone, if any (none when
      // only two seats' simultaneous entries changed order).
      reset: (G, ses, { undone = 0 } = {}) => {
        // (a refold onto another start: two tabs of the host's device each
        // wrote one at once, from another lobby; its table drawn afresh)
        if (this.G && !sameTable(this.G.setup, G.setup)) this.redraw()
        this.G = ses.G
        this.sameUnits(this.G)
        this.acted.length = 0
        this.traceListener?.rejoin?.(G)
        this.player.snap(G, project(G))
        this.relog(ses.folder.pushed)
        if (undone > 0) this.ui.toast?.show(`History changed: ${undone} move${undone === 1 ? '' : 's'} undone`)
      },
      // (N2) the match's status changed (frozen, read-only): the online
      // page's to show (app/online.js)
      status: (status, ses) => {
        if (ses === this.battle) this.online?.status?.(status, ses)
      },
    }
    // (N2) the online match followed: { status(status, session), leave() },
    // app/online.js's; null for a game played here alone
    this.online = null
    this.human = null
    this.player = null
  }

  // The player (view/player.js), playing the view's handlers with the UI's
  // and the flow's merged in; told when it has played everything (idled).
  // `human`: the local human (input/human.js).
  play(human) {
    const { view, ui } = this
    this.human = human
    const handlers = {
      ...view.handlers({ localSeats: () => this.session?.localSeats ?? [] }),
      // the battle log, the dice tray
      log: (e) => ui.log.write(e.side, e.html, e.cls, e.at),
      'tray.open': (e) => ui.tray.clear(e.title),
      dice: (e) => ui.tray.row(e.label, e.dice, e.need, e),
      // an action's end: what the units have done, as the match had it then
      // (the card reads it while the table is behind)
      act: (e) => {
        if (e.facts) this.facts = e.facts
      },
      // what the match waits on (the table asks once it has played
      // everything): the units as the match stands there, for the card
      pending: (e) => {
        if (e.facts) this.facts = e.facts
      },
      // the flow: a stage of the battle, a phase begun, a round scored, the
      // end
      stage: (e) => this.staged(e),
      'phase.start': (e, M, how) => this.phaseBegun(e, how),
      'round.scored': (e) => this.scored(e),
      'game.over': (e) => this.over(e),
      // (?debug) a checkpoint for sim/present-check.mjs (and, should the
      // ?debug block's view.pauseAtChecks ask, a pause there for
      // sim/snap-check.mjs)
      check: (e) => this.checkHook?.(e),
      // (F8b) a batch opens (view/player.js's frame): the camera frames
      // where its members stand and go, as the follow policy says, the
      // stage and the seat to act as the table shows them
      frame: (e, M) => view.rig.frame(e.points, { stage: M.stage, active: M.active, localSeats: this.session?.localSeats ?? [] }),
    }
    this.player = new EventPlayer({ handlers, view, onIdle: (how) => this.idled(how), sideOf: (u) => this.unitById(u)?.side })
    return this.player
  }

  // the match the table shows: the battle's, or on the title the backdrop
  atTable() {
    return this.G ?? this.backdrop
  }
  // a unit of the match the table shows, by id (what a click or the pointer
  // finds is the figure's unit: its view keeps only the id and the unit's
  // look, the same in every match on this table)
  unitById(id) {
    return this.atTable().units.find((u) => u.id === id)
  }
  // a seat played here (the Session's local seats: a human seat may be
  // another device's from R8, which this page only watches)
  local(side) {
    return !!this.session?.localSeats.includes(side)
  }
  // a seat's ink for text that names it outside the HUD (ui/theme.js)
  ink(s) {
    return seatInk(this.atTable().seats, this.sides, s)
  }

  // Seat the players: the races at the table (their look on the page, and
  // the zones in their colours).
  seatPlayers(seats) {
    this.sides = sidesFor(seats)
    paintSeats(this.sides)
    this.view.table.paint(this.sides.map((x) => x.color))
  }

  // ── The flow's events ───────────────────────────────────────────────────
  // A stage begins: the zones dim for the battle, and nothing stays
  // selected.
  staged(e) {
    this.hud.phaseShown = false
    if (e.stage !== 'deploy') this.human.select(null)
    this.refreshUI()
  }

  // A phase begins: its banner, which the table waits on (longer when the
  // seat shown is played here, or outside the battle; (F8b) PACE.brief when
  // the player has it queued to its end with nothing in it, `how.brief`). A
  // seat's first phase begins its turn: its units have done nothing yet
  // (the card's record). (F8b) A phase of a seat played here takes the
  // camera back to where that seat pressed End (the bookmark), and a turn
  // begun with more than 10 units gives the selection's one-time tip.
  phaseBegun(e, how) {
    this.facts = turnBegun(this.facts, e)
    this.hud.phaseShown = true
    this.human.select(null)
    this.ui.tray.hide()
    this.refreshUI()
    const M = this.player.mirror
    if (this.local(e.side)) {
      this.view.rig.resume(e.side)
      if (e.phase === 'move' && this.atTable().units.filter((u) => u.side === e.side && M.units[u.id]?.alive > 0).length > 10) this.ui.toast?.tip?.('select')
    }
    return this.ui.banner.show(`${this.sides[e.side].icon} ${this.sides[e.side].name}`, PHASE_NAME[e.phase], this.ink(e.side), how?.brief ? PACE.brief : PACE.phaseStart(this.local(M.active), M.stage))
  }

  // A round scored: a ring in the holder's colours on each objective held,
  // then the score's banner.
  scored(e) {
    e.owners.forEach((c, i) => {
      const o = this.atTable().objectives[i]
      if (c >= 0) this.view.effects.ring(o.x, o.z, OBJECTIVE_RANGE, this.sides[c].color, { life: 1.6, fill: 0.15 })
    })
    this.refreshUI()
    const M = this.player.mirror
    return this.ui.banner.show(`End of round ${e.round}`, `VP ${e.vp[0]} – ${e.vp[1]}`, this.ink(-1), PACE.phaseStart(this.local(M.active), M.stage))
  }

  // The end: who won and why (ui/screens/result.js).
  over(r) {
    this.human.select(null)
    this.refreshUI()
    this.ui.result.show(r, this.sides, this.ink(r.win))
  }

  // The table has played everything: the trace catches up (?debug), a card
  // still open catches up with the table (the unit of the match on it now:
  // a battle's start puts its own match on the backdrop's table), the input
  // catches up (input/human.js: the selection, a charge's spots), and the
  // HUD follows. After a snap (`snap`: a new table, a battle's start; N2's
  // rejoin and scrub; `G` the match snapped to) the table is that match as
  // it stands, so what the flow keeps outside the mirror is derived again
  // from it (snapped()), and an open card
  // is left as it was, as before R7, when a new table made its figures after
  // its idle and a start had no idle. (In play no card is open then: the
  // end screen closes it, and the title and the end screen cover the table.
  // Under ?debug a start mid-battle draws a new table first; N2's snaps
  // mid-battle are ui/card.js's to decide: DESIGN's R7a notes.)
  idled({ snap = false, G = null } = {}) {
    const tl = this.traceListener, card = this.ui.card
    clock.boost = 1
    tl?.idle()
    if (snap) this.snapped(G)
    const cu = !snap && card.unit && this.unitById(card.unit.id)
    if (cu && cu.t === card.unit.t && cu.side === card.unit.side && card.open) card.show(cu)
    this.human.idled()
    this.refreshUI()
    tl?.settled()
    this.replay?.idled()
  }

  // A snap has made the table from match G: the HUD's state derived from it
  // (a phase has been shown once the snapped mirror's stage is 'battle':
  // present/hud-model.js), the local human's selection taken again from it
  // (the unit picked up, by id: N2's snaps may be onto another match
  // object; its move's plan and what the pointer is over found afresh, the
  // plan as the input catches up and the pointer as it next moves), no
  // charge's spots shaded (the input shades a charge's again as it catches
  // up, if one waits on its end), the card's record the match as it stands,
  // and a battle snapped past its end shows its end screen.
  snapped(G) {
    const M = this.player.mirror, overlay = this.view.overlay, human = this.human
    Object.assign(this.hud, afterSnap(M))
    human.sel = (human.sel && G.units.find((u) => u.id === human.sel.id)) ?? null
    human.reach = null
    human.hover = human.hoverPick = null
    human.pickShown = null
    overlay.clear()
    overlay.ghost.visible = false
    this.facts = preview(G, factsOf)
    // ((F4) the round limit's vote shares the panel: a snap past the end
    // replaces it with the end)
    if (M.stage === 'over' && (!this.ui.result.up || this.ui.result.voting)) this.over(resultOf(G))
  }

  // The HUD (present/hud-model.js, put on the page by ui/hud.js and
  // ui/actions.js), the zones and the rings.
  refreshUI() {
    const { ui, view } = this
    const m = hudModel({ G: this.atTable(), mirror: this.player.mirror, session: this.session, input: this.human.state(), hud: { ...this.hud, sides: this.sides } })
    this.hud.buttonsUp = m.buttonsUp
    this.hud.hint = m.hint
    this.shownHud = m
    ui.hud.render(m)
    ui.actions.render(m)
    // (F10a) the group bar, while two or more units are picked up
    ui.groupbar?.render(this.human.group?.model() ?? { show: false })
    // (F4) the round limit's vote, while a seat played here is still to
    // have its say and the table has caught up; the end screen replaces it
    // (game.over), and play going on takes it down
    const P = this.session?.G?.pending
    if (this.player.idle && P?.k === 'roundLimit' && this.session.decisionFor() >= 0) {
      const G = this.session.G
      const voters = [...Object.keys(P.votes).map(Number), ...P.seats].sort((a, b) => a - b)
      ui.result.showVote({ round: G.turn.round, vp: G.turn.vp, votes: P.votes, voters, canMore: this.session.count < OFFER_CAP }, this.sides)
    } else if (ui.result.voting) ui.result.hide()
    view.table.zones(m.zones)
    view.units.paintRings(m.rings)
    // (F10c) the standing orders on the labels: every seat played here; and
    // the lines of those picked up (O: all of them)
    view.units.badges(new Map([...(this.peerBadges ?? []), ...(this.human.standing?.glyphs() ?? [])]))
    view.overlay.orderLines(this.human.standing?.lines() ?? [])
  }
  // the rings alone (the pointer leaves the table; a unit picked up to
  // deploy)
  refreshRings() {
    this.view.units.paintRings(this.rings())
  }
  rings() {
    return ringLooks({ session: this.session, input: this.human.state(), covered: this.human.standing?.plan().covered })
  }

  // A battle's units are its table's, id for id (start() snaps the table to
  // the backdrop, on the battle's board and terrain with its races and
  // (F11a) its armies: those deploy the same units the same way, newState
  // being a pure function of the setup, and neither who plays a seat nor
  // the dice move a unit before the battle starts), so the figures on show are its figures. A unit the
  // table has no figure for is a bug in that, so it throws. (By type and
  // seat only: G has run on past its start by now, a watched battle's to
  // its end, so where its units stood then is no longer in it.)
  sameUnits(at) {
    const units = this.view.units
    const differs = (u) => !units.get(u.id) || units.unit(u.id).t !== u.t || units.unit(u.id).side !== u.side
    const bad = at.units.find(differs)
    if (bad || at.units.length !== units.views.size) throw new Error(`the battle's units are not the table's (${bad ? `unit ${bad.id}, ${bad.key} of seat ${bad.side}` : `${at.units.length} units, ${units.views.size} figures`}): a battle starts on its own table (start())`)
  }

  // ── Setup ───────────────────────────────────────────────────────────────
  // (F7a) The terrain set a battle of `mission` started here is fought on
  // (the battle-setup panel's and the lobby's default): the page's
  // (?terrain=, or the panel's last choice), where the mission is fought on
  // it, else the mission's first set.
  terrainOf(mission = this.mission) {
    const sets = MISSIONS[mission].sets
    return sets.includes(this.terrain) ? this.terrain : sets[0]
  }

  // The title screen's table for a board seed: its board and both armies
  // where any battle on it deploys them, drawn from a match that is never
  // played (both seats human, so it waits at its deployment having drawn
  // nothing, and its dice, 0, are never rolled). The battle a mode starts is
  // a match of its own (start()), on this table when it is the battle's
  // (tableOf: the title's is the classic mission's, on its terrain set, with
  // the races at the table: the title stays on the classic board, F8a).
  // (F8a) A battle's mission may choose another board: the snap rebuilds
  // the table for it (view/index.js's setBoard), and the title's next snap
  // the classic one again. (F11a) `armies`, each seat's army (null, or a
  // seat's null: the mission's preset): a battle with lists is drawn on a
  // table that fields them; the title's names none, so it shows the
  // presets, as before lists (its 1200 ms frame unchanged).
  // (F7a) Its terrain set the mission's first, whatever ?terrain= or the
  // battle-setup panel chose (those are the battle's: start() draws its
  // table afresh for it), so the title is always the classic table, as at
  // 1200 ms (DESIGN §4.2.3: the title stays on the classic table), Back
  // from a fortified battle included.
  showTable(board, { mission = 'classic', terrain = MISSIONS[mission].sets[0], races = this.races, armies = null } = {}) {
    const { view, ui, human } = this
    // the new table first: if building it throws, the last one stays whole
    // (a quiet match: none of what it did is played, the table being drawn
    // from it as it stands)
    const seats = races.map((race, i) => (armies?.[i] == null ? { race, ctrl: 'human' } : { race, ctrl: 'human', army: armies[i] }))
    const next = createMatch({ board, dice: 0, mission, terrain, seats }, { out: null })
    this.session?.close()
    this.session = null
    this.battle = null
    this.G = null
    this.backdrop = next
    this.backdropAsDrawn = true
    // (the figures take their seat's colours as they are made)
    this.seatPlayers(seatsOf(races))
    // a new table, drawn afresh: every figure and mesh of the last one off
    // it and freed
    view.units.dispose()
    view.terrain.dispose()
    human.sel = null
    human.reach = null
    human.group?.reset()
    view.overlay.clear()
    ui.log.clear()
    ui.tray.hide()
    // its board, then the tufts strewn anew, then (the snap) its figures:
    // the order the table has always been drawn in, so the cosmetic
    // Math.random draws fall as they did (three.js draws some for every
    // object it makes)
    view.terrain.sync(next.terrain.chunks)
    view.table.scatterTufts()
    // the table as shown: the match as it stands (its board, its units where
    // they stand, nobody's flags), at the title's stage; the snap draws it
    // (and takes away the last game's scorch marks, and a template or thorns
    // a replaced table left standing, though only the title and the end
    // screen replace one, with nothing left to play), and the HUD's state
    // and the input's charge spots are derived again from it (snapped())
    this.player.snap(next, onTitle(next))
    // nothing else from the last game carries over: banners, turn state
    view.objectives.reset()
    this.refreshUI()
  }

  // A battle: the whole setup (the board on the title screen, a fresh dice
  // stream, who plays each seat, each human seat played from this device,
  // (F6) the races the battle-setup panel chose, else the table's, (F11a)
  // each seat's army only where ?armies= named one, (F8b) the mission (the
  // battle size) the panel chose, else the table's), a LocalStore whose
  // first entry starts it, and a Session over it for the seats played
  // here. The match runs on at once: to each human seat's deployment, or
  // (watch) to its end, and the table plays it from there.
  // (F7a) Fought on `terrain`, the battle-setup panel's choice of the
  // mission's sets (else the table's), which is the table's from then on;
  // (F8b) of the mission `size`, the panel's battle size.
  start(mode, races = this.races, size = this.mission, terrain = this.terrainOf(size)) {
    const { view, ui, human } = this
    // an unknown mode changes nothing (S included), so the table stays
    // playable
    if (!Object.hasOwn(MODES, mode)) throw new Error(`no mode "${mode}" (there are ${Object.keys(MODES).join(', ')})`)
    if (races.length !== 2 || !races.every((r) => Object.hasOwn(RACES, r))) throw new Error(`a battle takes two races of ${Object.keys(RACES).join(', ')}, not ${races.join(', ')}`)
    if (!Object.hasOwn(MISSIONS, size)) throw new Error(`no mission "${size}" (there are ${Object.keys(MISSIONS).join(', ')})`)
    if (!MISSIONS[size].sets.includes(terrain)) throw new Error(`the ${size} mission is fought on ${MISSIONS[size].sets.join(' or ')}, not ${JSON.stringify(terrain)}`)
    const who = MODES[mode]
    // (F8b) the battle size the panel chose is the flow's from now on (its
    // next default); armies ?armies= named for another mission's limits
    // let go, each seat its new mission's preset
    if (size !== this.mission) {
      this.armies = null
      this.mission = size
    }
    // (F11a) A list's digits mean other units in another race's roster, so
    // a seat whose race the panel changed from the one ?armies= was judged
    // for (the table's races, ?races') lets its army go: it plays its
    // mission's preset from then on, back to the URL's race or not (F11b's
    // army line resets the same way, DESIGN §4.2.8.8)
    if (this.armies) {
      const kept = this.armies.map((a, i) => (races[i] === this.races[i] ? a : null))
      this.armies = kept.some((a) => a !== null) ? kept : null
    }
    // (F7a) and its terrain the table's
    this.terrain = terrain
    // (F6) the races the battle-setup panel chose are the table's from now
    // on (the title's backdrop after it, the panel's next defaults)
    this.races = [...races]
    // (an online match followed is left: a battle here is played alone; a
    // replay shown is closed)
    this.replay?.close()
    if (this.online) this.leaveOnline()
    // (a battle starts on a fresh table: a second start without the end
    // screen's Back would find the last battle's on show; (F8a) the fresh
    // one is the battle's mission's, so its board is made once)
    if (this.session) this.showTable(this.S.seed, { mission: this.mission, terrain, armies: this.armies })
    // a fresh logic-dice stream per battle; ?dice=N replays one exactly
    const dice = (Number(this.params.get('dice')) || ((Math.random() * 1e9) | 0)) >>> 0
    // (F4) a battle with a seat played by a human asks to play on past its
    // rounds ('vote'), unless ?overtime=never says not (sim/'s replays of a
    // log made without the vote); a watched one ends on its rounds
    const overtime = who.includes('human') && this.params.get('overtime') !== 'never' ? 'vote' : 'never'
    // (F8a) the mission chooses the board and its rounds; (F7a) the terrain
    // is one of its sets, the panel's; (F11a) a seat names its `army` only
    // when ?armies= named one, so a setup naming none plays its mission's
    // preset, as every battle before lists did (the classic corpus's setups
    // among them)
    const mission = MISSIONS[this.mission]
    const armyOf = (i) => (this.armies?.[i] == null ? {} : { army: this.armies[i] })
    const setup = {
      board: this.S.seed, dice, mission: this.mission, terrain, rounds: mission.rounds, overtime, diceMode: 'shared',
      seats: this.races.map((race, i) => (who[i] === 'human' ? { race, ctrl: who[i], dev: DEVICE, ...armyOf(i) } : { race, ctrl: who[i], ...armyOf(i) })),
    }
    // The battle starts on the table shown, which must be its own: the
    // backdrop, on the same board and terrain with the same races, (F11a)
    // fielding the same armies (sameTable: a battle with lists is never on
    // the title's table, which fields the presets), and untouched since it
    // was drawn, is that match's table before anything has happened (else
    // it is drawn afresh from the battle's setup first: today the title's
    // always is the battle's, but with ?armies= or (F7a) on a set other
    // than the mission's first, which the title never shows). So the table is snapped to
    // it as it stands (the figures and meshes on show kept, every one being
    // the battle's), and the battle's events play on from there: its
    // board's adds take back the meshes they find untouched
    // (view/terrain.js), so nothing is rebuilt (P-present holds the table to
    // the match at every checkpoint).
    if (!this.backdropAsDrawn || !sameTable(this.backdrop.setup, setup)) this.showTable(setup.board, tableOf(setup))
    this.S.control = [...who]
    human.sel = null
    human.reach = null
    human.group?.reset()
    this.seatPlayers(seatsOf(setup.seats.map((s) => s.race)))
    // the page's trace starts afresh (?debug), before the match's first line
    this.traceListener?.begin()
    this.acted.length = 0
    // (as the title showed it: the battle's own stage events, its
    // deployment's first, take it on from there, P-present holding each)
    this.player.snap(this.backdrop, onTitle(this.backdrop))
    const store = new LocalStore()
    this.session = new Session({ store, localSeats: who.flatMap((c, s) => (c === 'human' ? [s] : [])), dev: DEVICE, sink: this.sink, onTrace: this.onTrace })
    this.battle = this.session
    this.session.start(setup)
    // (F10c) a new battle, a book of its own (any old one under its key let go)
    this.human.standing?.reset()
    this.human.standing?.book.open(bookKey(this.session), { fresh: true })
    if (this.session.status !== 'live' && this.session.status !== 'over') {
      // no battle (a start the core refused leaves the log in its lobby):
      // the title's table again, drawn afresh from the board it showed
      // (built once already, so it builds again), and no refused Session
      // left behind
      const why = this.session.error
      this.session.close()
      this.session = null
      this.showTable(this.backdrop.setup.board, tableOf(this.backdrop.setup))
      throw new Error(`the battle could not start: ${why}`)
    }
    ui.title.hide()
    // the camera swings onto the battle's view (present/camera-presets.js:
    // F1 behind the one seat played here, F2 else broadside), the view
    // button stepping through the rest
    view.rig.setViews(viewsFor({ localSeats: this.session.localSeats, edges: [0, 1].map((s) => edgeOf(this.session.G, s)) }))
    this.refreshUI()
  }

  // ── Online (N2) ─────────────────────────────────────────────────────────
  // A Session over an online store, folded to the log's head (as it was
  // made, quietly: its events went nowhere), its match begun: the table
  // drawn afresh for its setup and snapped to the match as it stands, the
  // battle log made again from its entries, and its events played from here
  // on (the flow's sink). `online`: { status(status, session),
  // settled(session) ((N3) a change folded: what the page keeps), leave() }
  // (app/online.js's).
  follow(session, online) {
    const { view, ui, human } = this
    const G = session.G
    this.replay?.close()
    if (this.online) this.leaveOnline()
    this.showTable(G.setup.board, tableOf(G.setup))
    this.session = session
    this.battle = session
    this.G = G
    this.S.control = G.setup.seats.map((s) => s.ctrl)
    this.seatPlayers(seatsOf(G.setup.seats.map((s) => s.race)))
    human.sel = null
    human.reach = null
    human.group?.reset()
    this.traceListener?.begin()
    this.traceListener?.rejoin?.(G)
    this.acted.length = 0
    this.online = online
    session.sink = this.sink
    // (F10c) the battle's book: a rejoin finds its orders again
    this.human.standing?.reset()
    this.human.standing?.book.open(bookKey(session))
    this.player.snap(G, project(G))
    this.relog(session.folder.pushed)
    ui.title.hide()
    view.rig.setViews(viewsFor({ localSeats: session.localSeats, edges: [0, 1].map((s) => edgeOf(G, s)) }))
    this.refreshUI()
  }

  // A fresh table for the Session's match (its setup's), the Session kept.
  redraw() {
    const ses = this.session, battle = this.battle
    this.session = null
    try {
      this.showTable(ses.G.setup.board, tableOf(ses.G.setup))
    } finally {
      this.session = ses
      this.battle = battle
      this.G = ses.G
    }
  }

  // ── Another Session on the table (N3) ───────────────────────────────────
  // The Session shown hands over to `session` (a replay's, or the battle's
  // own again: app/replay.js). The one it was, if it is the battle's own,
  // goes on folding with no table: its status and what the page keeps
  // still heard (online: the online page's hooks), and the replay's bar
  // told as it moves on; any other is let go of.
  hand(session) {
    const was = this.session
    if (!was || was === session) return
    if (was !== this.battle) was.close()
    else {
      was.sink = {
        status: (st, ses) => this.online?.status?.(st, ses),
        settled: (ses) => {
          this.online?.settled?.(ses)
          this.replay?.render()
        },
      }
    }
  }

  // A Session's match on the table, on the battle's own table (the same
  // setup: no new one is drawn): snapped to it as it stands, its battle log
  // made again, its events played from there on. The end screen, up for
  // the match shown before, goes (a snap past the end puts it up again).
  show(session) {
    this.hand(session)
    this.session = session
    this.G = session.G
    session.sink = this.sink
    this.acted.length = 0
    this.ui.result.hide()
    this.ui.banner.hide()
    this.ui.tray.hide()
    this.traceListener?.rejoin?.(session.G)
    this.player.snap(session.G, project(session.G))
    this.relog(session.folder.pushed)
    this.refreshUI()
  }

  // A replay from the very start of `setup`'s battle: its table as it stood
  // before anything happened (drawn afresh, as start() draws one), and
  // `session`, whose store holds no start yet, shown on it: the start's
  // events, once it is written there, play on from there, as a battle's do.
  showStart(session, setup) {
    this.hand(session)
    // (the table drawn afresh lets go of the Session shown: none is now)
    this.session = null
    const battle = this.battle
    this.showTable(setup.board, tableOf(setup))
    this.battle = battle
    this.ui.result.hide()
    this.ui.banner.hide()
    this.seatPlayers(seatsOf(setup.seats.map((x) => x.race)))
    this.traceListener?.begin()
    this.acted.length = 0
    this.player.snap(this.backdrop, onTitle(this.backdrop))
    this.session = session
    session.sink = this.sink
    this.refreshUI()
  }

  // ── Undo (F12) ──────────────────────────────────────────────────────────
  // ↶ Undo or Ctrl-Z: the last placement, move or charge's end of the seat
  // played here whose decision it is, taken back to its last commit point
  // (present/hud-model.js's undoable: one entry a press). Only in a game
  // played here alone, on the battle's own Session (never while a replay
  // or a scrub is up), once the table has caught up and no group or order
  // is still sending. The battle's Session is made again over its log as it
  // stood before that entry (app/undo.js) and becomes the battle, shown on
  // its table as a scrub's is (a snap: the table, the log, the HUD and the
  // card made again from it), the old Session closed; the unit taken back
  // is put down first. Returns why nothing was taken back, else null.
  undo() {
    const battle = this.battle, human = this.human
    if (!battle || this.online) return 'no battle played on this device alone'
    if (this.session !== battle || this.replay?.battle) return 'a replay is on the table'
    if (!this.player.idle || human.group?.busy || human.standing?.busy) return 'the table is still playing'
    const k = undoable(battle)
    if (k < 0) return 'nothing to take back since the last End or dice roll'
    human.select(null)
    // (its trace lines heard once it is made: the card's facts and ?debug's
    // trace of what it folds as it is made are the snap's to make again)
    let made = false
    const ses = rewind(battle, k, { onTrace: (line, g) => made && this.onTrace(line, g) })
    made = true
    // (the battle's no more: show() closes it as it hands over)
    this.battle = ses
    this.show(ses)
    return null
  }

  // The online match left: app/online.js lets go of its document.
  leaveOnline() {
    this.peerBadges = null
    const online = this.online
    this.online = null
    clock.boost = 1
    online?.leave()
  }

  // The battle log made again from the entries the Session's Folder has
  // pushed (the match as it stands, which a snap shows): a quiet fold of
  // them with their events kept,
  // the `log` events written (the last 80, as many as the log keeps). After
  // a snap onto a match this page didn't play up to (an online match
  // followed, a refold), what the log shows is that match's history.
  relog(entries) {
    const f = new Folder({ out: [] }), lines = []
    for (const e of entries) {
      f.push(e)
      for (const x of f.G?.out?.splice(0) ?? []) if (x.t === 'log') lines.push(x)
    }
    this.ui.log.clear()
    for (const x of lines.slice(-80)) this.ui.log.write(x.side, x.html, x.cls, x.at)
  }

  // The elastic catch-up (above), once a change is folded: the table's
  // backlog (view/player.js's estimate, in game seconds), in the wall
  // seconds it would take to play at the page's speed and frame rate.
  catchUp(ses) {
    const behind = this.player.backlog() / (clock.speed * Math.max(clock.rate, 0.05))
    if (behind > 30) {
      this.acted.length = 0
      this.player.snap(ses.G, project(ses.G))
      this.relog(ses.folder.pushed)
    } else clock.boost = behind > 16 ? 4 : behind > 8 ? 2 : 1
  }

  // Back to the war room (the end screen's button): the title, its orbit,
  // and its table drawn afresh (an online match left).
  back() {
    this.replay?.close()
    if (this.online) this.leaveOnline()
    this.ui.result.hide()
    this.ui.title.show()
    this.view.rig.toTitle()
    this.showTable(this.S.seed)
  }
}
