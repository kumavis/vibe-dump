// The local human (DESIGN §2.5): what a seat played on this device does at
// the table. Each click or button becomes a command body (units by id,
// places by nav cell, picked with the core's own queries: freeSpot,
// nearestValid, the charge-end tool), sent through the Session only if the
// match takes it now (session.legal); the Session folds it at once, the
// match runs on to the next decision a human makes, and the table plays
// what happened. What a tool shows before a seat commits (a move's reach
// and path, a shot's odds, a charge's, its spots) it asks through the
// Session's preview, with the dice locked (§4.1 rule 2).
//
// The input mode is derived, never stored: from the decision the match
// waits on and whether the player has played everything (mode()). A seat
// played here acts in its phase (mode 'phase') or picks its charge's end
// ('chargeEnd') only once the table has caught up with the match; a
// deployment ('deploy') doesn't wait on the player (a placement plays at
// once). Its own state is the selection: the unit picked up (`sel`), its
// move's plan (`reach`), what the pointer is over (`hover`, `hoverPick`,
// `mouse`), which charge's spots are shaded (`pickShown`), and (V3c) the
// spell picked for a caster picked up in its shooting phase (`spell`: {
// u, sp }, the AI's own pick as it is picked up, core/ai/policy.js
// bestSpell; another by the spell bar or the keys 1-9).
//
// The tools (input/tools/): deploy.js, move.js, shoot.js, charge.js and
// charge-end.js turn a pick into a body and say what it would do; this file
// decides which applies, sends, and draws (the overlay, view/overlay.js;
// the tooltip and the card, ui/). (F10a) A group, two or more units picked
// up together (input/group.js), takes a click, a hover and a key first.
//
// (F9a, DESIGN §4.2.5) Transports. With a unit picked up that may board
// (the movement phase, or the deployment), every vehicle of its seat it can
// board now (the match's mayBoard: room, reach) shows ⤒ on its label
// (`boards`); the pointer over one draws the walk to its side and "Board
// War-Cart · 4.2" of 7"" (in the deployment, just "Board War-Cart"), and a
// click there sends { t: 'embark', u, v }; a full or unreachable vehicle is
// picked up as ever. A rider is picked up by its figure on the deck, its
// chip (the hull's label, its card), R (the hull's riders, one at a time,
// then the hull again; with a group, R adds the riders of its hulls) or
// Tab; in the movement phase its landing cells are shaded (`land`: the
// match's landing), the pointer shows where it would step off, and a click
// there sends { t: 'disembark', u, c }; in the deployment a click on the
// ground places it, which takes it off its hull (`place`).
// (F13) A finger aims as the mouse hovers (input/aim.js: a long press, or
// 👆 Aim), and its lift is the click.
import { CHARGE_RANGE } from '../core/rules.js'
import { phaseKey } from '../core/queries.js'
import { sfx, unlock } from '../view/sfx.js'
import { chargePick, nearestSpot, endAt, SHORTEST } from './tools/charge-end.js'
import { spotAt, placeAt } from './tools/deploy.js'
import * as move from './tools/move.js'
import * as shoot from './tools/shoot.js'
import * as charge from './tools/charge.js'
import { Aim } from './aim.js'

export class Human {
  // `flow` (app/flow.js): the battle's Session and match, the player, and
  // the HUD's refresh; `view` (view/index.js): the overlay and the figures;
  // `card` and `tooltip` (ui/); `picker` (input/picking.js)
  constructor({ flow, view, card, tooltip, picker }) {
    this.flow = flow
    this.view = view
    this.card = card
    this.tooltip = tooltip
    this.picker = picker
    this.sel = null
    this.reach = null
    this.hover = null
    this.hoverPick = null
    this.mouse = null
    this.pickShown = null
    // ((V3c) the spell picked for the caster picked up: { u, sp } or null)
    this.spell = null
    this.downAt = null
    // (F9a) the vehicles the unit picked up may board (id → { c, L, max }:
    // the cell its walk ends on, its inches and its move's), and a rider's
    // landing ({ v, cells, ok }), or null
    this.boards = null
    this.land = null
    // (F13) a move previewed and sent as far as it goes that way, beyond
    // the unit's reach: the pointer's own (Alt held on the mouse, a finger
    // aiming)
    this.far = false
    // (F13) touch aim: the long press's drag and 👆 Aim (input/aim.js)
    this.aim = new Aim(this)
    // (F10a) the group input (input/group.js), set by app/boot.js
    this.group = null
    // (F10c) the standing orders (input/standing.js), set by app/boot.js
    this.standing = null
  }

  get session() {
    return this.flow.session
  }
  get G() {
    return this.flow.G
  }

  // ── The mode, derived ─────────────────────────────────────────────────────
  // the seat played here that the match waits on, or -1
  localSeat() {
    return this.session ? this.session.decisionFor() : -1
  }
  // that seat's decision, null for none
  localDecision() {
    return this.localSeat() >= 0 ? this.G.pending : null
  }
  // what a seat played here may do now (§2.5): the kind of decision it holds
  // once the table has played everything, else 'watch'
  mode() {
    return this.flow.player.idle && this.localSeat() >= 0 ? this.G.pending.k : 'watch'
  }
  // the seat deploying here, or -1 (a placement plays at once: the
  // deployment never waits on the player)
  deploySeat() {
    return this.localDecision()?.k === 'deploy' ? this.localSeat() : -1
  }
  // a seat played here is in a phase of its own turn, and the table has
  // shown everything up to now
  myTurn() {
    return this.mode() === 'phase'
  }
  // a charge's end to pick, here and now (input/tools/charge-end.js)
  picking() {
    return this.mode() === 'chargeEnd' ? chargePick(this.session) : null
  }
  // a question the tools ask the match: with the dice locked (§4.1 rule 2)
  ask(fn) {
    return this.session.preview(fn)
  }
  // what the HUD model reads of the input (present/hud-model.js)
  state() {
    // ((F10c) and the standing orders: those acting now, those an order
    // covers in this phase, how many the seat has; (F13) and touch aim's
    // toggles and drag)
    const st = this.standing
    return { idle: this.flow.player.idle, decision: this.localDecision(), mode: this.mode(), deploy: this.deploySeat(), sel: this.sel, pick: this.picking(), hover: this.hover, group: this.group?.members().length ?? 0, orders: st?.plan() ?? null, ordered: st ? st.living(this.localSeat()).size : 0, counting: !!st?.counting, aim: this.aim.state(), spell: this.spellOf(this.sel) }
  }

  // ── (V3c) A caster's spells ───────────────────────────────────────────────
  // The spell picked for unit `u`: its index in u's spells while u is the
  // caster picked up, else undefined (a unit with no spells, or another
  // unit: its shot names none).
  spellOf(u) {
    return u && u.t.spells && this.spell?.u === u.id ? this.spell.sp : undefined
  }
  // Pick spell `sp` for the caster picked up, in its seat's shooting phase
  // (the spell bar's buttons, the keys 1-9): its range ring and the rings of
  // what it may be cast on follow. Returns why it picked nothing, null once
  // it did.
  pickSpell(sp) {
    const u = this.sel
    if (!u?.t.spells || !this.myTurn() || phaseKey(this.G) !== 'shoot') return 'no caster picked up in its shooting phase'
    if (!(Number.isInteger(sp) && sp >= 0 && sp < u.t.spells.length)) return `${u.t.short} has no spell ${sp}`
    this.spell = { u: u.id, sp, at: `${this.G.turn.round}:${this.G.turn.active}:shoot` }
    this.showRange(u, this.ask((G, q) => q.rangeOf(G, u, null, u.pos, sp)))
    this.pointed()
    this.flow.refreshUI()
    return null
  }

  // ── Commands ──────────────────────────────────────────────────────────────
  // Send `body` for the seat played here, if the match takes it now.
  // Returns null once sent, else why not (and sends nothing).
  send(seat, body) {
    const session = this.session
    const why = session ? session.legal(seat, body) : 'no battle'
    if (why) return why
    session.submit(seat, body)
    // (the buttons go disabled at once, while the table plays it)
    this.flow.refreshUI()
    return null
  }
  moveTo(u, c) {
    this.view.overlay.clear()
    return this.send(this.localSeat(), move.moveTo(u, c))
  }
  advance(u) {
    return this.send(this.localSeat(), move.advance(u))
  }
  shoot(u, tg) {
    return this.send(this.localSeat(), shoot.shootAt(u, tg, this.spellOf(u)))
  }
  charge(u, tg) {
    return this.send(this.localSeat(), charge.chargeAt(u, tg))
  }
  // (F9a) board a vehicle (in a phase, as the unit's move; in the
  // deployment where it stands), or step a rider off onto cell c
  embark(u, v) {
    const seat = this.deploySeat() >= 0 ? this.deploySeat() : this.localSeat()
    this.view.overlay.clear()
    this.view.units.boardable(new Set())
    this.boards = null
    return this.send(seat, { t: 'embark', u: u.id, v: v.id })
  }
  disembark(u, c) {
    this.view.overlay.clear()
    this.land = null
    return this.send(this.localSeat(), { t: 'disembark', u: u.id, c })
  }

  // End the charge on cell c, a spot the roll reaches (a click's,
  // nearestSpot's: its -1 for "no spot" is no command, though the wire's
  // Shortest move is -1 too, so that takes its own path, takeShortest).
  placeCharge(c) {
    const pk = this.picking()
    if (!pk) return 'no charge to end'
    if (!(c >= 0 && pk.ok[c])) return `cell ${c} is no spot the roll reaches`
    return this.endCharge(pk, c)
  }
  // End the charge with the shortest move (SHORTEST: the plan's own cell).
  takeShortest() {
    const pk = this.picking()
    if (!pk) return 'no charge to end'
    return this.endCharge(pk, SHORTEST)
  }
  endCharge(pk, c) {
    const overlay = this.view.overlay
    this.pickShown = null
    overlay.clear()
    overlay.ghost.visible = false
    this.tooltip.hide()
    return this.send(pk.seat, endAt(c))
  }

  // ── The buttons' intents (ui/actions.js) ──────────────────────────────────
  // (Each returns why it sent nothing, null once it sent: for the ?debug
  // block's hooks, which press the buttons.)
  // End: in the deployment, the deploying seat is done (the last seat done
  // starts the battle); on a seat's own turn, the phase ends.
  end() {
    if (this.deploySeat() >= 0) {
      const seat = this.deploySeat()
      const why = this.send(seat, { t: 'deployed' })
      if (!why) {
        this.sel = null
        // (F10a) the seat's group, its pin and their ghosts go with its
        // deployment
        this.group?.dropSeat(seat)
        this.card.show(null)
        this.flow.refreshUI()
      }
      return why
    }
    if (!this.myTurn()) return 'no phase of a seat played here to end now'
    this.select(null)
    this.standing?.stopCount()
    this.standing?.disarm()
    // (F10c) the seat's standing orders first, then the End
    if (this.standing?.living(this.localSeat()).size) return this.ordersThen('end')
    return this.send(this.localSeat(), { t: 'end' })
  }
  // (F10c) ▶ Go: the standing orders now, the phase left open
  go() {
    if (!this.myTurn()) return 'no phase of a seat played here now'
    if (!this.standing?.plan().actors.length) return 'no orders to carry out now'
    return this.ordersThen(null)
  }
  // the orders run (they send their commands one at a time, each waiting
  // on the last to be folded online), then `then`
  ordersThen(then) {
    if (this.standing.busy) return 'the orders are under way'
    this.standing.run(then)
    this.flow.refreshUI()
    return null
  }
  // Auto: the AI plays the rest of the phase for the seat, then ends it (one
  // command: the match plays it all at once, the table at its pace).
  auto() {
    if (!this.myTurn()) return 'no phase of a seat played here to play out now'
    this.select(null)
    this.standing?.stopCount()
    this.standing?.disarm()
    // (F10c) the orders first, then the AI plays the units no order holds
    // (input/orders.js: a pilot of those, then the end)
    if (this.standing?.living(this.localSeat()).size) return this.ordersThen('auto')
    return this.send(this.localSeat(), { t: 'auto' })
  }
  // (F10b) Auto these: the AI plays the rest of the phase for the units
  // `ids` (one `pilot`, its mask the match's own door: maskOf), the phase
  // left open for the rest.
  pilot(ids) {
    if (!this.myTurn()) return 'no phase of a seat played here to play now'
    const seat = this.localSeat()
    return this.send(seat, { t: 'pilot', m: this.ask((G, q) => q.maskOf(G, seat, ids)) })
  }
  // (F4) The seats played here still to vote at the round limit.
  voters() {
    const P = this.G?.pending
    return P?.k === 'roundLimit' && this.session ? this.session.localSeats.filter((s) => P.seats.includes(s)) : []
  }
  // (F4) The round limit's vote, from the panel (ui/screens/result.js): the
  // same say for every seat played here still to vote (hotseat's two seats
  // share the screen, and so the say), or for `only` those of them. Once
  // the table has caught up.
  vote(more, only = null) {
    if (this.mode() !== 'roundLimit') return 'no round-limit vote to make now'
    const seats = this.voters().filter((s) => !only || only.includes(s))
    if (!seats.length) return 'no seat played here is still to vote'
    for (const seat of seats) {
      const why = this.send(seat, { t: 'vote', more })
      if (why) return why
    }
    return null
  }
  // Advance: a D6 more inches for the unit picked up (it stays picked up,
  // its move now as far as the roll allows: idled).
  advanceSel() {
    const u = this.sel
    if (!u || !this.myTurn()) return 'no unit of a seat played here to advance now'
    return this.advance(u)
  }

  // ── The table catches up ──────────────────────────────────────────────────
  // The player has played everything (app/flow.js's idled): the selected
  // unit stays selected while it can still act (a move or a shot spent it;
  // an advance didn't), (F10a) and a group its members that can, and a
  // charge waiting for its end shades the spots its roll reaches.
  idled() {
    const overlay = this.view.overlay
    // (F10a) a group keeps its members still able to act
    if (this.myTurn() && this.group?.wasGroup()) this.group.settle()
    else if (this.sel && this.myTurn()) this.select(this.ask((G, q) => q.canAct(G, this.sel)) ? this.sel : null)
    const pk = this.picking()
    if (pk && this.pickShown !== pk) {
      this.pickShown = pk
      // the 12" declaration ring is spent; leave the orange to the area
      // itself, filled strongly enough to see when it's only a cell or two
      overlay.rangeRing.visible = false
      overlay.mask(pk.ok, [255, 150, 60], this.G.nav, 150)
      overlay.ghostAt(this.G.nav, pk.cell, pk.u.r)
    }
    // (F10c) Auto-End's countdown, if the orders leave the player nothing
    this.standing?.idled()
  }

  // ── The pointer and the keys ──────────────────────────────────────────────
  // on the table's canvas: a click (a press and release that barely moved)
  // picks, the pointer hovers; (F13) a finger aiming (input/aim.js) hovers
  // while it is down, and its lift is the click
  listen(dom) {
    // (F10a) the pointers down now: a second one makes the press a gesture
    // (two fingers on the camera), never a click when one is lifted
    const pressed = new Set()
    let gesture = false
    dom.addEventListener('pointerdown', (e) => {
      unlock()
      pressed.add(e.pointerId)
      gesture ||= pressed.size > 1
      this.downAt = { x: e.clientX, y: e.clientY, b: e.button }
      // (F10a) Shift (or Select mode) drags a box instead of the camera
      const took = this.group?.down(e, pressed.size > 1)
      // (F13) a second finger calls an aim off; with 👆 Aim on, a finger
      // aims from the start
      this.aim.down(e, pressed.size > 1, !!took)
    })
    dom.addEventListener('pointercancel', (e) => {
      pressed.delete(e.pointerId)
      if (!pressed.size) gesture = false
      this.group?.abort(e)
      this.aim.cancel(e)
    })
    dom.addEventListener('pointerup', (e) => {
      pressed.delete(e.pointerId)
      const two = gesture
      if (!pressed.size) gesture = false
      // (F10a) a long press took its unit: the lift is no click; a box or a
      // line this pointer drew ends, whichever button lifts
      const held = this.group?.letGo(e)
      const drew = this.group?.up(e)
      // (V3a) a finger's short, still tap on a label's icon: its tip, pinned
      // (ui/tooltip.js), and nothing else (an aim it began called off)
      if (e.pointerType === 'touch' && this.downAt && !two && !held && !drew && Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y) <= 6 && this.tooltip.tapIcon(e.clientX, e.clientY)) {
        if (this.aim.drag?.id === e.pointerId) this.aim.cancel(e)
        this.downAt = null
        return
      }
      // (F13) an aim's finger lifted: what a click there does, however far
      // it slid (but a long press on one of the seat's own units took it)
      if (this.aim.drag?.id === e.pointerId) {
        this.downAt = null
        return void this.aim.lift(e, !held)
      }
      if (!this.downAt) return
      const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y)
      // (F10a) a right click (no drag: a drag pans) drops a pinned formation
      if (e.button === 2) {
        if (moved <= 6 && !drew) this.group?.rightClick()
        this.downAt = null
        return
      }
      if (e.button !== 0) return
      this.downAt = null
      if (drew || moved > 6 || two || held) return
      this.click(this.picker.pick(e), e)
    })
    dom.addEventListener('pointerleave', () => {
      this.hoverPick = null
      this.hover = null
      this.pointed()
      this.flow.refreshRings()
    })
    dom.addEventListener('pointermove', (e) => {
      this.mouse = { x: e.clientX, y: e.clientY }
      if (this.group?.move(e)) return
      // (F13) a finger aiming: its preview, under it
      if (this.aim.move(e)) return
      // (V3a) the mouse over a label's icon (the labels let it through):
      // the icon's tip, the table's own hover left as it was
      if (e.pointerType !== 'touch' && this.tooltip.hoverIcon(e.clientX, e.clientY)) return
      // ((F13) Alt held: a move beyond the unit's reach as far as it goes)
      this.far = e.altKey
      this.hoverPick = this.picker.pick(e)
      this.pointed()
    })
    // (F13) 👆 Aim, beside ▭ Select (touch)
    document.querySelector('#aimMode')?.addEventListener('click', () => this.aim.toggle())
    // Escape puts down the unit picked up (but a charge's end must be
    // picked); the camera rig keeps the panning keys (view/camera.js);
    // (F10a) a group's keys first (input/group.js)
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return
      // ((V3c) a caster picked up in its shooting phase: 1-9 pick its
      // spell, before the group's keys call a saved group by them)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[1-9]$/.test(e.key) && this.sel?.t.spells && Number(e.key) <= this.sel.t.spells.length && this.myTurn() && phaseKey(this.G) === 'shoot') {
        e.preventDefault()
        this.pickSpell(Number(e.key) - 1)
        return
      }
      if (!this.picking() && this.standing?.key(e)) return
      if (!this.picking() && this.group?.key(e)) return
      // ((F9a) R with a transport or a rider picked up: its riders, so the
      // roster's R (ui/roster.js, listening after this) is not toggled too)
      if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.repeat && !this.picking() && this.ridersKey()) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (e.key === 'Escape' && !this.picking()) this.select(null)
    })
    // (F9a) a rider's chip on its hull's label picks it up
    this.view.units.labels?.addEventListener('click', (e) => {
      const r = e.target?.closest?.('[data-rider]')
      if (!r) return
      e.stopPropagation()
      this.pickRider(Number(r.dataset.rider))
    })
  }

  // ── (F9a) Riders ──────────────────────────────────────────────────────────
  // Pick up unit `id` as a click on it would (a rider's chip, R): on a seat's
  // own turn, if it can act; in the deployment, one of the deploying seat's;
  // else its card.
  pickRider(id) {
    const u = this.flow.unitById(id)
    if (!(u?.alive > 0)) return
    this.tooltip.hide()
    const side = this.deploySeat()
    if (side >= 0) {
      if (u.side === side) return void this.deployPick(u)
      return void this.card.show(u)
    }
    if (this.myTurn() && u.side === this.localSeat() && this.ask((G, q) => q.canAct(G, u))) {
      sfx.click()
      if (this.group?.isGroup()) this.group.setGroup([u.id])
      else this.select(u)
      return
    }
    this.card.show(u)
  }
  // R: with a group, the riders of its hulls join it; with a transport
  // picked up, its first rider (in G.units order); with a rider, the next
  // of its hull's, then the hull again. False when it did nothing (R is
  // then the roster's).
  ridersKey() {
    const seat = this.deploySeat() >= 0 ? this.deploySeat() : this.myTurn() ? this.localSeat() : -1
    if (seat < 0 || !this.G) return false
    const ms = this.group?.members() ?? []
    if (ms.length >= 2) {
      const add = this.G.units.filter((r) => r.alive > 0 && r.aboard && ms.some((h) => h.id === r.aboard) && !ms.includes(r)).map((r) => r.id)
      if (!add.length) return false
      this.group.setGroup([...ms.map((u) => u.id), ...add])
      sfx.click()
      return true
    }
    const u = this.sel
    if (!u || u.side !== seat) return false
    const hull = u.aboard || u.id
    const list = this.G.units.filter((r) => r.alive > 0 && r.aboard === hull).map((r) => r.id)
    if (!list.length) return false
    const k = list.indexOf(u.id)
    this.pickRider(k < 0 ? list[0] : k + 1 < list.length ? list[k + 1] : hull)
    return true
  }
  // The vehicles `u` (picked up) may board now, badged ⤒: in a phase each
  // with where its walk ends and how far (its move's plan, `reach`), in the
  // deployment where it stands. Asked with the dice locked.
  showBoards(u, inPhase) {
    const plan = this.reach
    this.boards = u && !u.aboard && !u.t.vehicle ? this.ask((G, q) => {
      const out = new Map()
      for (const v of G.units) {
        if (v.side !== u.side || !v.t.transport || !q.alive(v) || v.aboard) continue
        if (q.mayBoard(G, u, v, inPhase) !== null) continue
        if (!inPhase || !plan) {
          out.set(v.id, { c: -1, L: 0, max: 0 })
          continue
        }
        const c = q.embarkSpot(G, u, v, plan)
        out.set(v.id, { c, L: plan.res.dist[c], max: plan.max })
      }
      return out
    }) : null
    this.view.units.boardable(new Set(this.boards?.keys() ?? []))
  }
  // A unit under the pointer, or (a rider on a vehicle the unit picked up
  // may board: its deck figures cover most of the hull from above) its hull.
  boardable(unit) {
    return unit?.aboard && this.boards?.has(unit.aboard) ? this.flow.unitById(unit.aboard) ?? unit : unit
  }
  // A rider's landing (the match's: the cells it may step off onto), shaded.
  showLanding(u) {
    this.land = this.ask((G, q) => {
      const v = q.hullOf(G, u), cells = q.landing(G, u, v), ok = new Uint8Array(G.nav.N)
      for (const c of cells) ok[c] = 1
      return { v, cells, ok }
    })
    this.view.overlay.mask(this.land.ok, [120, 215, 255], this.G.nav, 110)
  }
  // A unit picked up in the deployment (a click on it, its chip, R, Tab):
  // its card, and the vehicles it may board badged.
  deployPick(u) {
    sfx.click()
    this.sel = u
    this.group?.selection.set(u.side, [u.id])
    this.card.show(u)
    this.showBoards(u, false)
    this.flow.refreshRings()
  }

  // A click on the table: a unit, or the ground under the pointer (or both).
  // On a seat's own turn it selects, moves, shoots or charges; while a charge
  // waits for its end it picks the spot; in the deployment it places; any
  // other time it shows the unit's card. ((F13) `far`, Alt held or a
  // finger's aim lifted: a move beyond the unit's reach goes as far as it
  // goes that way, input/tools/move.js's aimCell.)
  click({ unit, ground }, e = null, far = !!e?.altKey) {
    this.tooltip.hide()
    // ((F9a) a rider's figure on a hull the unit picked up may board is a
    // click on the hull)
    unit = this.boardable(unit)
    // (F10a) a group's click first: Shift-click picks, and two or more
    // picked act together
    if (!this.picking() && this.standing?.click({ unit, ground })) return
    if (!this.picking() && this.group?.click({ unit, ground }, e)) return
    if (this.deploySeat() >= 0) return this.deployClick(unit, ground)
    const pk = this.picking()
    if (pk) {
      // the board under the cursor counts even when it's under a model; a
      // click outside the orange area (no spot within reach of it) does
      // nothing
      if (ground) {
        const i = nearestSpot(this.G.nav, pk.ok, ground.x, ground.z)
        if (i >= 0) this.placeCharge(i)
      }
      return
    }
    if (!this.myTurn()) {
      if (unit) this.card.show(unit)
      return
    }
    const sel = this.sel, ph = phaseKey(this.G)
    // ((F9a) a vehicle the unit picked up may board: the click boards it)
    if (ph === 'move' && sel && unit && this.boards?.has(unit.id)) return void this.embark(sel, unit)
    // ((V3c) a spell cast on a friend: a click on a friend it takes, the
    // caster itself included, casts it there)
    const sp = this.spellOf(sel)
    if (ph === 'shoot' && sel && unit && unit.side === sel.side && sp !== undefined && this.ask((G, q) => q.allySpell(q.weaponOf(sel, sp)) && q.shotInfo(G, sel, unit, sp).ok)) return void this.shoot(sel, unit)
    if (unit && unit.side === this.localSeat()) {
      if (this.ask((G, q) => q.canAct(G, unit))) {
        sfx.click()
        this.select(unit)
      } else this.card.show(unit)
      return
    }
    // ((F9a) a rider picked up: the landing cell nearest the click)
    if (ph === 'move' && sel && ground && this.land) {
      const c = nearestSpot(this.G.nav, this.land.ok, ground.x, ground.z)
      if (c >= 0) this.disembark(sel, c)
      return
    }
    if (ph === 'move' && sel && ground && this.reach) {
      const i = move.cellAt((fn) => this.ask(fn), this.reach, ground, far)
      if (i >= 0) this.moveTo(sel, i)
      return
    }
    // (the match judges the shot and the charge: in range, in sight, a way
    // there; a click it refuses does nothing)
    if (ph === 'shoot' && sel && unit && unit.side !== sel.side) return void this.shoot(sel, unit)
    if (ph === 'charge' && sel && unit && unit.side !== sel.side) return void this.charge(sel, unit)
    if (unit) this.card.show(unit)
    else if (ground) this.select(null)
  }

  // The deployment: a click on one of the deploying seat's units picks it
  // up, a click inside its zone puts it on the free spot nearest the click
  // (input/tools/deploy.js). Returns why a placement it sent was refused
  // (null for anything else: a click too far from a free spot does
  // nothing).
  deployClick(unit, ground) {
    const side = this.deploySeat()
    if (side < 0) return 'no seat deploying here'
    if (unit && unit.side === side) {
      // ((F9a) a vehicle the unit picked up may board: it boards it, and
      // rides from the start; any other of the seat's units is picked up)
      if (this.sel && this.boards?.has(unit.id)) {
        const u = this.sel
        const why = this.embark(u, unit)
        if (!why) {
          sfx.click()
          this.sel = null
          this.card.show(unit)
          this.view.units.labelAll()
          this.flow.refreshRings()
        }
        return why
      }
      this.deployPick(unit)
      return null
    }
    if (this.sel && ground) {
      const u = this.sel
      const c = spotAt((fn) => this.ask(fn), u, ground, side)
      if (c >= 0) {
        const why = this.send(side, placeAt(u, c))
        if (!why) {
          sfx.click()
          this.view.units.labelAll()
          // ((F9a) placed, a rider is off its hull: the vehicles it may
          // board from where it now stands)
          this.showBoards(u, false)
        }
        return why
      }
    }
    return null
  }

  // Pick up a unit (null: none). On a seat's own turn its move shows where
  // it can go (the move's plan, which the click snaps to), and its shot or
  // charge the range ring.
  // (`fromGroup`: input/group.js's own call, its record already set)
  select(u, fromGroup = false) {
    const G = this.G, overlay = this.view.overlay
    this.sel = u
    this.reach = null
    // ((F9a) no vehicle badged, no landing shaded, until asked again below)
    this.boards = null
    this.land = null
    this.view.units.boardable?.(new Set())
    overlay.clear()
    if (!fromGroup && this.group) {
      const seat = this.localSeat()
      if (seat >= 0) {
        this.group.selection.set(seat, u ? [u.id] : [])
        this.group.selection.of(seat).note = ''
      }
      this.group.cancel()
      this.card.group = ''
    }
    if (u && G) {
      const ph = phaseKey(G)
      // ((F9a) a rider steps off, its landing shaded; a unit that may board
      // a vehicle has each it may badged, after its reach)
      if (G.turn.stage === 'battle' && ph === 'move' && !u.flags.moved && u.aboard) this.showLanding(u)
      else if (G.turn.stage === 'battle' && ph === 'move' && !u.flags.moved) {
        this.reach = move.planOf((fn) => this.ask(fn), u)
        overlay.reach(this.reach, G.nav)
        this.showBoards(u, true)
      } else if (G.turn.stage === 'deploy' && this.deploySeat() === u.side) this.showBoards(u, false)
      // ((V3c) a caster: the AI's pick of its spells to begin with (kept
      // while the same phase lasts, should it be picked up again), its
      // range the ring's)
      const at = `${G.turn.round}:${G.turn.active}:${ph}`
      if (ph === 'shoot' && u.t.spells && (this.spell?.u !== u.id || this.spell.at !== at)) this.spell = { u: u.id, sp: this.ask((G, q) => q.bestSpell(G, u)), at }
      if (ph === 'shoot' && u.t.ranged) this.showRange(u, this.ask((G, q) => q.rangeOf(G, u, null, u.pos, this.spellOf(u))))
      if (ph === 'charge') this.showRange(u, CHARGE_RANGE)
    }
    this.card.show(u)
    this.flow.refreshUI()
  }

  // The range ring of a shot or a charge, around the unit picked up ((V3c)
  // a spell cast on a friend's in green).
  showRange(u, range) {
    const sp = this.spellOf(u), ally = sp !== undefined && !!(u.t.spells[sp].ward || u.t.spells[sp].resolve)
    this.view.overlay.range(u.pos, u.r, range, phaseKey(this.G) === 'charge' ? '#ffb070' : ally ? '#7dff9a' : '#ffffff')
  }

  // What the pointer is over: a unit's line, or on a seat's own turn what
  // its selected unit would do there (the path and inches of a move, a
  // shot's odds, a charge's), or where a charge would end. Asked with the
  // dice locked; while the player is behind, the units are as shown.
  // ((F13) `far` (Alt held, a finger aiming): a move as far as it goes
  // that way, over an enemy too, as the click then takes it.)
  pointed() {
    const overlay = this.view.overlay, G = this.G
    this.tooltip.hide()
    overlay.pathLine.visible = false
    overlay.ghost.visible = false
    const h = this.hoverPick
    const pk = this.picking()
    if (!h) {
      // ((F8b's review) off the table mid-plan: a group's ghosts still
      // coming are let go with what they drew so far; a whole plan stays
      // drawn, as a small group's always has)
      const ghosts = this.group?.ghosts
      if (ghosts?.run) {
        ghosts.cancel()
        overlay.formation(null)
      }
      // off the board mid-pick: show where "Shortest move" would put the
      // unit
      if (pk) overlay.ghostAt(G.nav, pk.cell, pk.u.r)
      return
    }
    // ((F9a) as a click: a rider on a hull it may board is the hull)
    if (h.unit) h.unit = this.boardable(h.unit)
    this.hover = h.unit
    let text = ''
    const sel = this.sel
    // (F10a) a group's formation where a click would pin it
    if (!pk && this.group?.isGroup()) {
      text = this.group.hover(h) ?? ''
      if (!text && h.unit) text = `${h.unit.t.name}`
      if (text && this.mouse) this.tooltip.show(text, this.mouse)
      return
    }
    // a path, drawn with its end's ghost
    const path = (pts, i, r) => {
      overlay.path(pts)
      overlay.ghostAt(G.nav, i, r)
    }
    // ((F9a) a vehicle the unit picked up may board, under the pointer: the
    // walk to its side; a rider's landing cell nearest the pointer)
    const board = !pk && sel && h.unit && this.boards?.get(h.unit.id)
    if (board && (this.myTurn() || this.deploySeat() >= 0)) {
      if (board.c >= 0) path(this.ask((G, q) => G.nav.path(this.reach.res, board.c, sel.r, this.reach.mode === 'fly' ? null : this.reach.forbid)), board.c, sel.r)
      text = board.c >= 0 ? `⤒ Board ${h.unit.t.short} · ${board.L.toFixed(1)}" of ${board.max}"` : `⤒ Board ${h.unit.t.short}`
    } else if (!pk && sel && this.land && this.myTurn() && h.ground && !h.unit) {
      const i = nearestSpot(G.nav, this.land.ok, h.ground.x, h.ground.z)
      if (i >= 0) {
        overlay.ghostAt(G.nav, i, sel.r)
        text = `⤓ Step off the ${this.land.v.t.short} here`
      } else text = `✖ too far from the ${this.land.v.t.short}: pick a cell in the blue area`
    } else if (pk && h.ground) {
      const i = nearestSpot(G.nav, pk.ok, h.ground.x, h.ground.z)
      if (i >= 0) {
        path(this.ask((G) => G.nav.path(pk.plan.res, i, pk.u.r, pk.plan.mode === 'fly' ? null : pk.plan.forbid)), i, pk.u.r)
        text = `End charge here · ${pk.plan.res.dist[i].toFixed(1)}" of ${pk.rolled}"`
      } else text = `✖ out of reach — pick a spot in the orange area`
    } else if (this.myTurn() && sel) {
      text = this.ask((G, q) => {
        const ph = q.phaseKey(G)
        if (ph === 'move' && this.reach && h.ground && (!h.unit || (this.far && h.unit.side !== sel.side))) return move.preview(G, q, this.reach, sel, h.ground, path, this.far)
        // ((V3c) the spell picked: at an enemy, or one cast on a friend at
        // a friend or the caster itself)
        const sp = this.spellOf(sel), ally = sp !== undefined && q.allySpell(q.weaponOf(sel, sp))
        if (ph === 'shoot' && h.unit && (h.unit.side !== sel.side) !== ally) return shoot.preview(G, q, sel, h.unit, sp)
        if (ph === 'charge' && h.unit && h.unit.side !== sel.side) return charge.preview(G, q, sel, h.unit)
        return ''
      })
    }
    // the unit as shown, like its label: (V3a) its line ((F9a) a transport's
    // riders, a rider's hull), and each condition its label shows told
    // (view/units.js's tip, present/conditions.js's unitTip)
    if (!text && h.unit) text = this.view.units.tip(h.unit.id)
    if (text && this.mouse) this.tooltip.show(text, this.mouse)
  }
}
