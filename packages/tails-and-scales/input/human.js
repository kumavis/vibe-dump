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
// `mouse`), and which charge's spots are shaded (`pickShown`).
//
// The tools (input/tools/): deploy.js, move.js, shoot.js, charge.js and
// charge-end.js turn a pick into a body and say what it would do; this file
// decides which applies, sends, and draws (the overlay, view/overlay.js;
// the tooltip and the card, ui/).
import { CHARGE_RANGE } from '../core/rules.js'
import { phaseKey } from '../core/queries.js'
import { sfx, unlock } from '../view/sfx.js'
import { chargePick, nearestSpot, endAt, SHORTEST } from './tools/charge-end.js'
import { spotAt, placeAt } from './tools/deploy.js'
import * as move from './tools/move.js'
import * as shoot from './tools/shoot.js'
import * as charge from './tools/charge.js'

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
    this.downAt = null
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
    return { idle: this.flow.player.idle, decision: this.localDecision(), mode: this.mode(), deploy: this.deploySeat(), sel: this.sel, pick: this.picking(), hover: this.hover }
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
    return this.send(this.localSeat(), shoot.shootAt(u, tg))
  }
  charge(u, tg) {
    return this.send(this.localSeat(), charge.chargeAt(u, tg))
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
      const why = this.send(this.deploySeat(), { t: 'deployed' })
      if (!why) {
        this.sel = null
        this.card.show(null)
        this.flow.refreshUI()
      }
      return why
    }
    if (!this.myTurn()) return 'no phase of a seat played here to end now'
    this.select(null)
    return this.send(this.localSeat(), { t: 'end' })
  }
  // Auto: the AI plays the rest of the phase for the seat, then ends it (one
  // command: the match plays it all at once, the table at its pace).
  auto() {
    if (!this.myTurn()) return 'no phase of a seat played here to play out now'
    this.select(null)
    return this.send(this.localSeat(), { t: 'auto' })
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
  // an advance didn't), and a charge waiting for its end shades the spots
  // its roll reaches.
  idled() {
    const overlay = this.view.overlay
    if (this.sel && this.myTurn()) this.select(this.ask((G, q) => q.canAct(G, this.sel)) ? this.sel : null)
    const pk = this.picking()
    if (pk && this.pickShown !== pk) {
      this.pickShown = pk
      // the 12" declaration ring is spent; leave the orange to the area
      // itself, filled strongly enough to see when it's only a cell or two
      overlay.rangeRing.visible = false
      overlay.mask(pk.ok, [255, 150, 60], this.G.nav, 150)
      overlay.ghostAt(this.G.nav, pk.cell, pk.u.r)
    }
  }

  // ── The pointer and the keys ──────────────────────────────────────────────
  // on the table's canvas: a click (a press and release that barely moved)
  // picks, the pointer hovers
  listen(dom) {
    dom.addEventListener('pointerdown', (e) => {
      unlock()
      this.downAt = { x: e.clientX, y: e.clientY, b: e.button }
    })
    dom.addEventListener('pointerup', (e) => {
      if (!this.downAt || e.button !== 0) return
      const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y)
      this.downAt = null
      if (moved > 6) return
      this.click(this.picker.pick(e))
    })
    dom.addEventListener('pointerleave', () => {
      this.hoverPick = null
      this.hover = null
      this.pointed()
      this.flow.refreshRings()
    })
    dom.addEventListener('pointermove', (e) => {
      this.mouse = { x: e.clientX, y: e.clientY }
      this.hoverPick = this.picker.pick(e)
      this.pointed()
    })
    // Escape puts down the unit picked up (but a charge's end must be
    // picked); the camera rig keeps the panning keys (view/camera.js)
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'Escape' && !this.picking()) this.select(null)
    })
  }

  // A click on the table: a unit, or the ground under the pointer (or both).
  // On a seat's own turn it selects, moves, shoots or charges; while a charge
  // waits for its end it picks the spot; in the deployment it places; any
  // other time it shows the unit's card.
  click({ unit, ground }) {
    this.tooltip.hide()
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
    if (unit && unit.side === this.localSeat()) {
      if (this.ask((G, q) => q.canAct(G, unit))) {
        sfx.click()
        this.select(unit)
      } else this.card.show(unit)
      return
    }
    if (ph === 'move' && sel && ground) {
      const i = move.cellAt((fn) => this.ask(fn), this.reach, ground)
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
      sfx.click()
      this.sel = unit
      this.card.show(unit)
      this.flow.refreshRings()
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
        }
        return why
      }
    }
    return null
  }

  // Pick up a unit (null: none). On a seat's own turn its move shows where
  // it can go (the move's plan, which the click snaps to), and its shot or
  // charge the range ring.
  select(u) {
    const G = this.G, overlay = this.view.overlay
    this.sel = u
    this.reach = null
    overlay.clear()
    if (u && G) {
      const ph = phaseKey(G)
      if (G.turn.stage === 'battle' && ph === 'move' && !u.flags.moved) {
        this.reach = move.planOf((fn) => this.ask(fn), u)
        overlay.reach(this.reach, G.nav)
      }
      if (ph === 'shoot' && u.t.ranged) this.showRange(u, u.t.ranged.range)
      if (ph === 'charge') this.showRange(u, CHARGE_RANGE)
    }
    this.card.show(u)
    this.flow.refreshUI()
  }

  // The range ring of a shot or a charge, around the unit picked up.
  showRange(u, range) {
    this.view.overlay.range(u.pos, u.r, range, phaseKey(this.G) === 'charge' ? '#ffb070' : '#ffffff')
  }

  // What the pointer is over: a unit's line, or on a seat's own turn what
  // its selected unit would do there (the path and inches of a move, a
  // shot's odds, a charge's), or where a charge would end. Asked with the
  // dice locked; while the player is behind, the units are as shown.
  pointed() {
    const overlay = this.view.overlay, G = this.G
    this.tooltip.hide()
    overlay.pathLine.visible = false
    overlay.ghost.visible = false
    const h = this.hoverPick
    const pk = this.picking()
    if (!h) {
      // off the board mid-pick: show where "Shortest move" would put the
      // unit
      if (pk) overlay.ghostAt(G.nav, pk.cell, pk.u.r)
      return
    }
    this.hover = h.unit
    let text = ''
    const sel = this.sel
    // a path, drawn with its end's ghost
    const path = (pts, i, r) => {
      overlay.path(pts)
      overlay.ghostAt(G.nav, i, r)
    }
    if (pk && h.ground) {
      const i = nearestSpot(G.nav, pk.ok, h.ground.x, h.ground.z)
      if (i >= 0) {
        path(this.ask((G) => G.nav.path(pk.plan.res, i, pk.u.r, pk.plan.mode === 'fly' ? null : pk.plan.forbid)), i, pk.u.r)
        text = `End charge here · ${pk.plan.res.dist[i].toFixed(1)}" of ${pk.rolled}"`
      } else text = `✖ out of reach — pick a spot in the orange area`
    } else if (this.myTurn() && sel) {
      text = this.ask((G, q) => {
        const ph = q.phaseKey(G)
        if (ph === 'move' && this.reach && h.ground && !h.unit) return move.preview(G, q, this.reach, sel, h.ground, path)
        if (ph === 'shoot' && h.unit && h.unit.side !== sel.side) return shoot.preview(G, q, sel, h.unit)
        if (ph === 'charge' && h.unit && h.unit.side !== sel.side) return charge.preview(G, q, sel, h.unit)
        return ''
      })
    }
    if (!text && h.unit) {
      // the unit as shown, like its label
      const mu = this.view.units.shown(h.unit.id)
      text = `${h.unit.t.name} · ${h.unit.t.models > 1 ? `${mu.alive}/${h.unit.t.models} models` : `${mu.models[0].w}/${h.unit.t.W} wounds`}`
    }
    if (text && this.mouse) this.tooltip.show(text, this.mouse)
  }
}
