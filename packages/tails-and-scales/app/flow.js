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
import { OBJECTIVE_RANGE } from '../core/rules.js'
import { MISSIONS } from '../data/mission.js'
import { edgeOf } from '../core/match.js'
import { createMatch, fullSetup, preview } from '../core/index.js'
import { Session } from '../match/session.js'
import { LocalStore } from '../match/store.js'
import { MAX_ENTRIES, Folder } from '../match/fold.js'
import { project } from '../present/mirror.js'
import { PACE } from '../present/pace.js'
import { viewsFor } from '../present/camera-presets.js'
import { hudModel, ringLooks, afterSnap, factsOf, turnBegun, resultOf, PHASE_NAME } from '../present/hud-model.js'
import { EventPlayer } from '../view/player.js'
import { clock } from '../view/clock.js'
import { sidesFor, seatsOf, paintSeats, seatInk } from '../ui/theme.js'

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

// What of a setup the table shows before its battle: the board, the terrain
// set and the races at it (a mission too, once a setup names one). Who plays
// a seat, the dice and the rounds draw nothing on it.
export const tableOf = (setup) => {
  const s = fullSetup(setup)
  return { board: s.board, terrain: s.terrain, races: s.seats.map((x) => x.race) }
}
const sameTable = (a, b) => JSON.stringify(tableOf(a)) === JSON.stringify(tableOf(b))

// A backdrop as the title shows it: the match as it stands, at the stage
// 'title' (its own, a deployment no one plays, is never shown).
export const onTitle = (g) => ({ ...project(g), stage: 'title' })

export class Flow {
  // `view` (view/index.js), `ui` (ui/: { tray, log, card, banner, tooltip,
  // hud, actions, title, result }), `params` (the page's URL parameters:
  // ?dice), `seed` (the title's board seed) and `races` (the races at the
  // table: the classic matchup, or ?races')
  constructor({ view, ui, params, seed, races }) {
    this.view = view
    this.ui = ui
    this.params = params
    this.races = races
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
        if (this.online) this.catchUp(ses)
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
      status: (status, ses) => this.online?.status?.(status, ses),
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
      'phase.start': (e) => this.phaseBegun(e),
      'round.scored': (e) => this.scored(e),
      'game.over': (e) => this.over(e),
      // (?debug) a checkpoint for sim/present-check.mjs (and, should the
      // ?debug block's view.pauseAtChecks ask, a pause there for
      // sim/snap-check.mjs)
      check: (e) => this.checkHook?.(e),
    }
    this.player = new EventPlayer({ handlers, view, onIdle: (how) => this.idled(how) })
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
  // seat shown is played here, or outside the battle). A seat's first phase
  // begins its turn: its units have done nothing yet (the card's record).
  phaseBegun(e) {
    this.facts = turnBegun(this.facts, e)
    this.hud.phaseShown = true
    this.human.select(null)
    this.ui.tray.hide()
    this.refreshUI()
    const M = this.player.mirror
    return this.ui.banner.show(`${this.sides[e.side].icon} ${this.sides[e.side].name}`, PHASE_NAME[e.phase], this.ink(e.side), PACE.phaseStart(this.local(M.active), M.stage))
  }

  // A round scored: a ring in the holder's colours on each objective held,
  // then the score's banner.
  scored(e) {
    e.owners.forEach((c, i) => {
      const o = MISSIONS.classic.objectives[i]
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
  }
  // the rings alone (the pointer leaves the table; a unit picked up to
  // deploy)
  refreshRings() {
    this.view.units.paintRings(this.rings())
  }
  rings() {
    return ringLooks({ session: this.session, input: this.human.state() })
  }

  // A battle's units are its table's, id for id (start() snaps the table to
  // the backdrop, on the battle's board and terrain with its races: those
  // deploy the same armies the same way, newState being a pure function of
  // the setup, and neither who plays a seat nor the dice move a unit before
  // the battle starts), so the figures on show are its figures. A unit the
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
  // The title screen's table for a board seed: its board and both armies
  // where any battle on it deploys them, drawn from a match that is never
  // played (both seats human, so it waits at its deployment having drawn
  // nothing, and its dice, 0, are never rolled). The battle a mode starts is
  // a match of its own (start()), on this table when it is the battle's
  // (tableOf: the title's is the classic terrain set and the races at the
  // table).
  showTable(board, { terrain = 'classic', races = this.races } = {}) {
    const { view, ui, human } = this
    // the new table first: if building it throws, the last one stays whole
    // (a quiet match: none of what it did is played, the table being drawn
    // from it as it stands)
    const next = createMatch({ board, dice: 0, terrain, seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: null })
    this.session?.close()
    this.session = null
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
  // stream, who plays each seat, each human seat played from this device),
  // a LocalStore whose first entry starts it, and a Session over it for the
  // seats played here. The match runs on at once: to each human seat's
  // deployment, or (watch) to its end, and the table plays it from there.
  start(mode) {
    const { view, ui, human } = this
    // an unknown mode changes nothing (S included), so the table stays
    // playable
    if (!Object.hasOwn(MODES, mode)) throw new Error(`no mode "${mode}" (there are ${Object.keys(MODES).join(', ')})`)
    const who = MODES[mode]
    // (an online match followed is left: a battle here is played alone)
    if (this.online) this.leaveOnline()
    // (a battle starts on a fresh table: a second start without the end
    // screen's Back would find the last battle's on show)
    if (this.session) this.showTable(this.S.seed)
    // a fresh logic-dice stream per battle; ?dice=N replays one exactly
    const dice = (Number(this.params.get('dice')) || ((Math.random() * 1e9) | 0)) >>> 0
    // (F4) a battle with a seat played by a human asks to play on past its
    // rounds ('vote'), unless ?overtime=never says not (sim/'s replays of a
    // log made without the vote); a watched one ends on its rounds
    const overtime = who.includes('human') && this.params.get('overtime') !== 'never' ? 'vote' : 'never'
    const setup = {
      board: this.S.seed, dice, terrain: 'classic', rounds: MISSIONS.classic.rounds, overtime, diceMode: 'shared',
      seats: this.races.map((race, i) => (who[i] === 'human' ? { race, ctrl: who[i], dev: DEVICE } : { race, ctrl: who[i] })),
    }
    // The battle starts on the table shown, which must be its own: the
    // backdrop, on the same board and terrain with the same races and
    // untouched since it was drawn, is that match's table before anything
    // has happened (else it is drawn afresh from the battle's setup first:
    // today the title's always is the battle's). So the table is snapped to
    // it as it stands (the figures and meshes on show kept, every one being
    // the battle's), and the battle's events play on from there: its
    // board's adds take back the meshes they find untouched
    // (view/terrain.js), so nothing is rebuilt (P-present holds the table to
    // the match at every checkpoint).
    if (!this.backdropAsDrawn || !sameTable(this.backdrop.setup, setup)) this.showTable(setup.board, tableOf(setup))
    this.S.control = [...who]
    human.sel = null
    human.reach = null
    this.seatPlayers(seatsOf(setup.seats.map((s) => s.race)))
    // the page's trace starts afresh (?debug), before the match's first line
    this.traceListener?.begin()
    this.acted.length = 0
    // (as the title showed it: the battle's own stage events, its
    // deployment's first, take it on from there, P-present holding each)
    this.player.snap(this.backdrop, onTitle(this.backdrop))
    const store = new LocalStore()
    this.session = new Session({ store, localSeats: who.flatMap((c, s) => (c === 'human' ? [s] : [])), dev: DEVICE, sink: this.sink, onTrace: this.onTrace })
    this.session.start(setup)
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
  // on (the flow's sink). `online`: { status(status, session), leave() }
  // (app/online.js's).
  follow(session, online) {
    const { view, ui, human } = this
    const G = session.G
    if (this.online) this.leaveOnline()
    this.showTable(G.setup.board, tableOf(G.setup))
    this.session = session
    this.G = G
    this.S.control = G.setup.seats.map((s) => s.ctrl)
    this.seatPlayers(seatsOf(G.setup.seats.map((s) => s.race)))
    human.sel = null
    human.reach = null
    this.traceListener?.begin()
    this.traceListener?.rejoin?.(G)
    this.acted.length = 0
    this.online = online
    session.sink = this.sink
    this.player.snap(G, project(G))
    this.relog(session.folder.pushed)
    ui.title.hide()
    view.rig.setViews(viewsFor({ localSeats: session.localSeats, edges: [0, 1].map((s) => edgeOf(G, s)) }))
    this.refreshUI()
  }

  // A fresh table for the Session's match (its setup's), the Session kept.
  redraw() {
    const ses = this.session
    this.session = null
    try {
      this.showTable(ses.G.setup.board, tableOf(ses.G.setup))
    } finally {
      this.session = ses
      this.G = ses.G
    }
  }

  // The online match left: app/online.js lets go of its document.
  leaveOnline() {
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
    if (this.online) this.leaveOnline()
    this.ui.result.hide()
    this.ui.title.show()
    this.view.rig.toTitle()
    this.showTable(this.S.seed)
  }
}
