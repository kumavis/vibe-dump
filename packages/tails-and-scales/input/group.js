// Group input (DESIGN §4.2.6, F10a): picking up several units at once and
// acting with them together, beside the local human's one-unit tools
// (input/human.js, which hands a click here first).
//
//   Select     Shift-drag a box (Ctrl or Cmd held too: add to the group),
//              or ▭ Select on touch and drag a finger (two fingers still
//              pan and pinch); Shift-click (Ctrl, Cmd) or a long press adds
//              or drops one; a double click on a unit all of its type on
//              screen, a third the whole table; Q or Ready N all the units
//              still to act; Tab / Shift-Tab the next or last of them;
//              Ctrl-1…9 saves the group, 1…9 calls it back (twice: the
//              camera goes to it); Space the camera to the group; Esc lets go
//   Act        with two or more picked: in the deployment and the movement
//              phase a click on the ground pins a formation there (its
//              ghosts drawn: white rings arrive, amber fall short), an
//              Alt-drag pins it spread along a line, a click on its flag,
//              Enter or ✓ sends it, a double click pins and sends at once,
//              Esc, a right click or ✕ drops the pin; +D6 in the bar makes a
//              Move advance first; in the movement phase a click on an enemy
//              pins an approach; in the shooting phase a click on an enemy
//              fires every member that may at it, and in the charge phase
//              charges it
//
// What a group does is ordinary commands (input/orders.js), so nothing here
// is logged but what they send; the selection is this page's alone.
import { previewGroup } from '../present/orders.js'
import { runGroup } from './orders.js'
import { sfx } from '../view/sfx.js'

const FLAG_R = 1.2 // a click this near the pinned flag sends the formation
const BOX_MIN = 6 // a drag shorter than this (px) is a click
const DOUBLE = 320 // ms between the clicks of a double click
const LONG = 450 // ms a finger held still is a long press
const SPACE = new Set([' ']) // a focused button's own key

export class GroupInput {
  // `human` (input/human.js), `view` (view/index.js), `selection`
  // (input/selection.js), `controls` (the camera's OrbitControls), `bar`
  // (ui/groupbar.js), `tooltip` (ui/tooltip.js)
  constructor({ human, view, selection, controls, bar, tooltip }) {
    Object.assign(this, { human, view, selection, controls, bar, tooltip })
    this.box = null
    this.line = null
    this.lastUnit = null
    this.recalled = null
    this.press = null
    this.selectMode = false
    this.busy = false
    this.hoverPreview = null
    this.lastClick = null
    this.boxEl = document.createElement('div')
    this.boxEl.id = 'selbox'
    this.boxEl.className = 'hidden'
    document.body.appendChild(this.boxEl)
  }

  get G() {
    return this.human.G
  }

  // the seat's own record (its group, pin, note and +D6: each seat of a
  // hotseat keeps its own)
  get rec() {
    return this.selection.of(this.seat())
  }

  // the seat whose units are picked here now: the one deploying here, else
  // the one whose phase it is here; -1 for none
  seat() {
    const h = this.human
    return h.deploySeat() >= 0 ? h.deploySeat() : h.myTurn() ? h.localSeat() : -1
  }

  members() {
    const s = this.seat()
    return s >= 0 && this.G ? this.selection.members(this.G, s) : []
  }

  isGroup() {
    return this.members().length >= 2
  }

  // what a click does with the group now: 'place', 'move', 'shoot', 'charge'
  // or null
  phase() {
    const h = this.human
    if (h.deploySeat() >= 0) return 'place'
    if (!h.myTurn()) return null
    const G = this.G
    return h.ask((G2, q) => q.phaseKey(G2))
  }

  // ▭ Select (touch): one finger drags a box, two still pan and pinch (the
  // camera's one-finger orbit set aside while it is on)
  setSelectMode(on) {
    this.selectMode = on
    this.touches()
  }

  // (OrbitControls' touches as Select mode wants them now: one finger the
  // box's while a seat played here may pick, else the camera's as ever, so
  // a finger is never dead; model() calls it at every refresh)
  touches() {
    const c = this.controls
    if (!c.touches) return
    this.touches0 ??= { ...c.touches }
    const one = this.selectMode && this.seat() >= 0 ? null : this.touches0.ONE
    if (c.touches.ONE !== one || c.touches.TWO !== this.touches0.TWO) c.touches = { ...this.touches0, ONE: one }
  }

  // ── Picking ───────────────────────────────────────────────────────────────
  // A press with Shift (or in Select mode) starts a box; under the mouse the
  // camera holds still until it is let go. A second finger lets the box go:
  // two fingers are the camera's.
  down(e, multi = false) {
    const finger = e.pointerType === 'touch'
    // (another pointer down: a gesture, so no long press)
    if (multi) this.letGo(null, false, true)
    if ((this.box || this.line) && finger && e.pointerId !== (this.box ?? this.line).id) {
      this.drop()
      return false
    }
    // an Alt-drag on the ground with a group: a line to spread it along
    const verb = e.altKey && e.button === 0 && this.isGroup() ? this.phase() : null
    if (verb === 'place' || verb === 'move') {
      const g = this.human.picker.pick(e).ground
      if (!g) return false
      this.line = { id: e.pointerId, verb, x0: e.clientX, y0: e.clientY, a: { x: g.x, z: g.z }, b: { x: g.x, z: g.z } }
      this.controls.enabled = false
      return true
    }
    if (!(e.shiftKey || this.selectMode) || e.button !== 0 || this.seat() < 0) {
      if (finger && !multi) this.holdFrom(e)
      return false
    }
    this.box = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY, add: e.ctrlKey || e.metaKey }
    if (!(finger && this.selectMode)) this.controls.enabled = false
    // (in Select mode a finger held still is a long press all the same: the
    // box's drag lets it go)
    if (finger && !multi) this.holdFrom(e)
    return true
  }

  // a box or a line let go unfinished: the camera free again, the pinned
  // formation's ghosts (if any) drawn again over the line's
  drop() {
    this.box = this.line = null
    this.boxEl.classList.add('hidden')
    this.controls.enabled = true
    const pin = this.rec.pin
    if (pin) this.draw(pin.preview, pin.target, true)
    else this.view.overlay.formation(null)
  }

  // A finger held still on one of the seat's units: it joins the group, or
  // leaves it (a tick of the vibrator), and the lift is no click.
  holdFrom(e) {
    clearTimeout(this.press?.timer)
    const at = { clientX: e.clientX, clientY: e.clientY, pointerType: 'touch' }
    this.press = { id: e.pointerId, x: e.clientX, y: e.clientY, done: false }
    this.press.timer = setTimeout(() => {
      const seat = this.seat(), { unit } = this.human.picker.pick(at)
      if (!this.press || seat < 0 || !unit || unit.side !== seat) return
      this.press.done = true
      this.selection.toggle(seat, unit.id)
      this.selection.of(seat).note = ''
      this.cancel()
      this.syncLead()
      navigator.vibrate?.(10)
      sfx.click()
    }, LONG)
  }

  // the press let go (or moved off, or `any`: whichever finger; no long
  // press): true when it was a long press, which the lift doesn't click
  letGo(e, moved = false, any = false) {
    const p = this.press
    if (!p || (!any && e && e.pointerId !== p.id)) return false
    if (moved && (p.done || Math.hypot(e.clientX - p.x, e.clientY - p.y) <= BOX_MIN)) return false
    clearTimeout(p.timer)
    this.press = null
    return p.done
  }

  // a pointer cancelled (the browser took it): a box or a line it was
  // drawing let go, the camera free again
  abort(e) {
    this.letGo(e)
    if ((this.box && this.box.id === e.pointerId) || (this.line && this.line.id === e.pointerId)) this.drop()
  }

  move(e) {
    if (this.press) this.letGo(e, true)
    const l = this.line
    if (l) {
      if (e.pointerId !== l.id) return true
      const g = this.human.picker.pick(e).ground
      if (g) l.b = { x: g.x, z: g.z }
      if (Math.hypot(e.clientX - l.x0, e.clientY - l.y0) >= BOX_MIN) {
        const mid = { x: (l.a.x + l.b.x) / 2, z: (l.a.z + l.b.z) / 2 }
        this.draw(this.preview(l.verb, mid, { a: l.a, b: l.b }), mid, false)
      }
      return true
    }
    if (!this.box) return false
    if (e.pointerId !== this.box.id) return true
    this.box.x1 = e.clientX
    this.box.y1 = e.clientY
    const { x0, y0, x1, y1 } = this.box, el = this.boxEl
    el.style.left = `${Math.min(x0, x1)}px`
    el.style.top = `${Math.min(y0, y1)}px`
    el.style.width = `${Math.abs(x1 - x0)}px`
    el.style.height = `${Math.abs(y1 - y0)}px`
    el.classList.toggle('hidden', Math.hypot(x1 - x0, y1 - y0) < BOX_MIN)
    // the enemies under it, counted (a box never picks them)
    const foes = this.inBox(this.box, (u) => u.side !== this.seat())
    el.textContent = foes.length ? `${foes.length} enemy unit${foes.length > 1 ? 's' : ''} · ${foes.reduce((n, u) => n + u.alive, 0)} models` : ''
    return true
  }

  // the standing units `which` takes whose centre on screen lies in box b
  inBox(b, which) {
    const [lx, hx, ly, hy] = [Math.min(b.x0, b.x1), Math.max(b.x0, b.x1), Math.min(b.y0, b.y1), Math.max(b.y0, b.y1)]
    return this.G.units.filter((u) => {
      if (!(u.alive > 0) || !which(u)) return false
      const p = this.view.units.screen.get(u.id)
      return p?.on && p.x >= lx && p.x <= hx && p.y >= ly && p.y <= hy
    })
  }

  // Let go: the seat's own standing units whose centre on screen lies in
  // the box join (or, without Ctrl, make) the group. Returns whether it was
  // a box (a press that barely moved is a click after all).
  up(e) {
    const l = this.line
    if (l && !(e && e.pointerId !== l.id)) {
      // (an Alt-click too short for a line is a click, the pin as it was)
      if (Math.hypot(e.clientX - l.x0, e.clientY - l.y0) < BOX_MIN || Math.hypot(l.b.x - l.a.x, l.b.z - l.a.z) < 0.5) {
        this.drop()
        return false
      }
      this.line = null
      this.controls.enabled = true
      this.pinAt(l.verb, { x: (l.a.x + l.b.x) / 2, z: (l.a.z + l.b.z) / 2 }, { a: l.a, b: l.b })
      return true
    }
    const b = this.box
    if (!b || (e && e.pointerId !== b.id)) return false
    this.box = null
    this.controls.enabled = true
    this.boxEl.classList.add('hidden')
    if (Math.hypot(b.x1 - b.x0, b.y1 - b.y0) < BOX_MIN) return false
    const seat = this.seat()
    const inside = this.inBox(b, (u) => u.side === seat).map((u) => u.id)
    const had = b.add ? this.selection.of(seat).group : []
    this.setGroup([...had, ...inside])
    return true
  }

  // the group made `ids` (the human's one-unit selection follows its lead)
  setGroup(ids) {
    const seat = this.seat()
    if (seat < 0) return
    this.selection.set(seat, ids)
    this.rec.note = ''
    this.cancel()
    this.syncLead()
  }

  // The table has caught up after an action of the seat's: the members
  // still able to act stay picked (a group that fired keeps those that
  // didn't), the lead's card and tools on them.
  settle() {
    const seat = this.seat(), s = this.selection.of(seat)
    const still = this.human.ask((G, q) => this.selection.members(G, seat).filter((u) => q.canAct(G, u)).map((u) => u.id))
    // (a pin made before the action: planned again from the match as it
    // now stands, or dropped if its target fell; a fallen target's note
    // counts the members kept)
    const pin = s.pin, note = s.fell ? `Target down${still.length ? ` · ${still.length} still ready` : ''}` : s.note
    if (still.length !== s.group.length) this.selection.set(seat, still, s.lead)
    s.note = note
    s.fell = false
    this.syncLead()
    const tg = pin?.target.pos ? this.G.units.find((u) => u.id === pin.target.id) : pin?.target
    if (pin && still.length >= 2 && tg && !(tg.pos && !(tg.alive > 0))) this.pinAt(pin.verb, tg, pin.line)
    else if (pin) this.cancel()
  }

  // whether the seat's record holds a group (two or more ids, standing or
  // not: idled settles it even when a member fell)
  wasGroup() {
    return this.seat() >= 0 && this.rec.group.length >= 2
  }

  // A new match: every seat's selection, saved groups and pin let go.
  reset() {
    this.selection.bySeat.clear()
    this.box = this.line = null
    this.boxEl.classList.add('hidden')
    this.controls.enabled = true
    this.view.overlay.formation(null)
    this.human.card.group = ''
  }

  // A seat's deployment over: its group and pin let go (the table's
  // decision is another seat's by now).
  dropSeat(seat) {
    if (seat < 0) return
    this.selection.clear(seat)
    this.selection.of(seat).note = ''
    this.view.overlay.formation(null)
    this.human.card.group = ''
  }

  // the card and the one-unit tools on the group's lead (none for a group:
  // its tools are the formation's)
  syncLead() {
    const seat = this.seat(), s = this.selection.of(seat), G = this.G
    const lead = s.lead !== null ? G.units.find((u) => u.id === s.lead) : null
    // (the card says what the group is above its lead's own lines)
    const ms = this.members()
    this.human.card.group = ms.length >= 2 ? `${ms.length} selected · ${ms.reduce((n, u) => n + u.alive, 0)} models · the lead:` : ''
    this.human.card.groupLead = lead?.id ?? null
    if (s.group.length >= 2) {
      this.human.sel = lead
      this.human.reach = null
      this.view.overlay.clear()
      this.human.card.show(lead)
    } else this.human.select(lead ?? null, true)
    this.human.flow.refreshUI()
  }

  // ── Clicks ────────────────────────────────────────────────────────────────
  // A click on the table, handed here first: true when the group took it.
  click({ unit, ground }, e) {
    const seat = this.seat()
    if (seat < 0) return false
    const own = unit && unit.side === seat
    // Shift-click (Ctrl, Cmd) adds or drops one of the seat's units
    if (own && (e?.shiftKey || e?.ctrlKey || e?.metaKey)) {
      this.selection.toggle(seat, unit.id)
      this.rec.note = ''
      this.cancel()
      this.syncLead()
      sfx.click()
      return true
    }
    if (own) {
      // a double click on one of the seat's units (the same unit twice):
      // every one of its type on screen; a third, every one on the table
      const now = performance.now(), last = this.lastUnit
      const n = last && last.id === unit.id && now - last.at < DOUBLE ? last.n + 1 : 0
      this.lastUnit = { id: unit.id, at: now, n }
      if (n >= 1) {
        const all = n >= 2
        this.setGroup(this.G.units.filter((u) => u.side === seat && u.alive > 0 && u.t === unit.t && (all || this.view.units.screen.get(u.id)?.on)).map((u) => u.id))
        sfx.click()
        return true
      }
      // a plain click: that unit alone
      if (this.isGroup()) this.setGroup([unit.id])
      return false
    }
    if (!this.isGroup()) return false
    const verb = this.phase()
    // (a double click: the second click within DOUBLE ms and a few pixels of
    // the first; a quick click elsewhere only moves the pin)
    const now = performance.now(), last = this.lastClick
    const double = !!e && !!last && now - last.at < DOUBLE && Math.hypot(e.clientX - last.x, e.clientY - last.y) <= BOX_MIN
    this.lastClick = e ? { at: now, x: e.clientX, y: e.clientY } : null
    const pin = this.selection.of(seat).pin
    if ((verb === 'place' || verb === 'move') && ground && !unit) {
      // the flag of a formation pinned there sends it; a double click pins
      // and sends
      if (pin && pin.target.x !== undefined && Math.hypot(ground.x - pin.target.x, ground.z - pin.target.z) < FLAG_R) return this.commit(), true
      this.pinAt(verb, { x: ground.x, z: ground.z })
      if (double) this.commit()
      return true
    }
    if (unit && unit.side !== seat) {
      if (verb === 'move') {
        if (pin?.verb === 'approach' && pin.target === unit) return this.commit(), true
        this.pinAt('approach', unit)
        if (double) this.commit()
        return true
      }
      if (verb === 'shoot') return (this.running = this.run('fire', unit)), true
      if (verb === 'charge') return (this.running = this.run('charge', unit)), true
    }
    if (unit) this.human.card.show(unit)
    return true
  }

  // A formation pinned (`line`: spread along it): its preview drawn,
  // nothing sent.
  pinAt(verb, target, line = null) {
    const seat = this.seat()
    const preview = this.preview(verb, target, line)
    this.selection.of(seat).pin = { verb, target, preview, line }
    this.draw(preview, target, true)
    this.selection.of(seat).note = ''
    this.human.flow.refreshUI()
  }

  preview(verb, target, line = null) {
    const seat = this.seat(), ids = this.members().map((u) => u.id)
    return this.human.ask((G, q) => previewGroup(G, q, seat, verb, this.selection.units(G, ids), target, null, { line, advance: verb === 'move' && this.rec.advance }))
  }

  // +D6 (the bar's toggle): a group Move's members advance first; a pinned
  // Move drawn again
  toggleAdvance() {
    const s = this.rec
    s.advance = !s.advance
    const pin = s.pin
    if (pin?.verb === 'move') this.pinAt('move', pin.target, pin.line)
    else this.human.flow.refreshUI()
  }

  // a right click: drops the pin, if there is one
  rightClick() {
    const seat = this.seat()
    if (seat < 0 || !this.selection.of(seat).pin) return false
    this.cancel()
    this.human.flow.refreshUI()
    return true
  }

  // the formation's ghosts and its flag on the table
  draw(p, target, pinned) {
    const nav = this.G.nav
    const members = p.members.filter((m) => m.cell >= 0).map((m) => ({ x: nav.x(m.cell), z: nav.z(m.cell), r: m.u.r, short: m.how === 'short' }))
    this.view.overlay.formation({ members, anchor: target.pos ? null : target, pinned })
  }

  cancel() {
    const seat = this.seat()
    if (seat >= 0) this.selection.of(seat).pin = null
    this.view.overlay.formation(null)
    this.hoverPreview = null
  }

  // Send the pinned formation (`running`: the run's promise, for ?debug).
  commit() {
    const seat = this.seat(), pin = seat >= 0 ? this.selection.of(seat).pin : null
    if (!pin) return 'nothing pinned to send'
    this.running = this.run(pin.verb, pin.target, pin.line)
    return null
  }

  // (F10b) Auto these: one `pilot` for the group's standing members; the
  // ones the AI leaves (no shot worth taking, a charge too long) stay
  // picked and ready, as a group order's leftovers do (settle()).
  pilot() {
    const seat = this.seat(), ids = this.members().map((u) => u.id)
    if (seat < 0 || this.busy || !ids.length) return 'no group to put on autopilot now'
    this.cancel()
    const why = this.human.pilot(ids)
    const s = this.selection.of(seat)
    s.note = why ?? `Autopilot: the AI plays ${ids.length} units this phase`
    if (!why) sfx.click()
    this.human.flow.refreshUI()
    return why
  }

  // Send the group's commands (input/orders.js); then keep picked the
  // members still able to act.
  async run(verb, target, line = null) {
    if (this.busy) return
    const seat = this.seat(), members = this.members()
    if (seat < 0 || members.length < 1) return
    this.busy = true
    this.cancel()
    const s = this.selection.of(seat)
    try {
      const r = await runGroup({ session: this.human.session, seat, verb: verb === 'shoot' ? 'fire' : verb, members, target, line, advance: verb === 'move' && s.advance })
      s.note = r.note
      s.fell = r.fell
      if (r.sent) sfx.click()
    } catch (err) {
      s.note = err.message
    } finally {
      this.busy = false
    }
    // (the members still able to act stay picked once the table has caught
    // up: settle(), from the human's idled(); a placement plays at once)
    this.human.flow.refreshUI()
  }

  // The pointer over the table with a group picked: its formation's ghosts
  // where a click would pin it (none once pinned: the pin stays drawn).
  hover({ unit, ground }) {
    const seat = this.seat()
    if (!this.isGroup() || this.selection.of(seat).pin || this.busy) return null
    const verb = this.phase()
    let target = null, v = verb
    if ((verb === 'place' || verb === 'move') && ground && !unit) target = { x: ground.x, z: ground.z }
    else if (verb === 'move' && unit && unit.side !== seat) {
      target = unit
      v = 'approach'
    } else if ((verb === 'shoot' || verb === 'charge') && unit && unit.side !== seat) {
      return this.preview(verb === 'shoot' ? 'fire' : 'charge', unit).summary
    }
    if (!target) {
      this.view.overlay.formation(null)
      return null
    }
    const p = this.preview(v, target)
    this.draw(p, target, false)
    return p.summary
  }

  // ── Keys ──────────────────────────────────────────────────────────────────
  key(e) {
    const seat = this.seat()
    if (seat < 0 || document.querySelector('.modal:not(.hidden)')) return false
    // (a field keeps Tab and Space, a focused button its Space)
    const tag = e.target?.tagName ?? ''
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag) || (/^(BUTTON|A)$/.test(tag) && SPACE.has(e.key))) return false
    const s = this.selection.of(seat)
    switch (e.key) {
      case 'Enter':
        if (!s.pin) break
        e.preventDefault()
        this.commit()
        return true
      case 'Escape':
        if (s.pin) {
          this.cancel()
          this.human.flow.refreshUI()
          return true
        }
        if (s.group.length < 2) return false
        this.setGroup([])
        return true
      case 'q':
      case 'Q':
        if (e.ctrlKey || e.metaKey) break
        this.setGroup(this.ready().map((u) => u.id))
        return true
      case 'Tab':
        e.preventDefault()
        this.next(e.shiftKey ? -1 : 1)
        return true
      case ' ':
        if (!s.group.length) break
        e.preventDefault()
        this.toGroup()
        return true
    }
    const d = /^Digit([1-9])$/.exec(e.code)?.[1]
    if (d) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        this.selection.save(seat, d)
        s.note = `Saved as group ${d}`
        this.human.flow.refreshUI()
      } else if (this.selection.recall(this.G, seat, d)) {
        s.note = ''
        this.cancel()
        this.syncLead()
        // the same group called twice running: the camera goes to it
        const now = performance.now(), again = this.recalled?.d === d && now - this.recalled.at < 600
        this.recalled = { d, at: now }
        if (again) this.toGroup()
      }
      return true
    }
    return false
  }

  // the camera to the group's middle
  toGroup() {
    const ms = this.members()
    if (!ms.length) return
    this.view.rig?.glide(ms.reduce((n, u) => n + u.pos.x, 0) / ms.length, ms.reduce((n, u) => n + u.pos.z, 0) / ms.length)
  }

  // the seat's units still able to act, in their order on the table
  ready() {
    const seat = this.seat()
    return this.human.ask((G, q) => G.units.filter((u) => u.side === seat && q.alive(u) && (this.human.deploySeat() >= 0 || q.canAct(G, u))))
  }

  // Tab: the next unit still to act after the lead (Shift: the one before),
  // alone, the camera gliding to it
  next(dir = 1) {
    const list = this.ready()
    if (!list.length) return
    const seat = this.seat(), lead = this.selection.of(seat).lead
    const k = list.findIndex((u) => u.id === lead)
    const u = list[(k + dir + list.length) % list.length]
    this.setGroup([u.id])
    this.view.rig?.glide(u.pos.x, u.pos.z)
  }

  // ── The bar ───────────────────────────────────────────────────────────────
  // the group bar's model (ui/groupbar.js), or { show: false }
  model() {
    this.touches()
    const ms = this.members(), seat = this.seat()
    // Ready N: on a decision of a seat played here, how many of its units
    // are still to act
    const verb = seat >= 0 ? this.phase() : null
    const ready = verb ? this.ready().length : null
    if (ms.length < 2) return { show: false, ready }
    const s = this.selection.of(seat)
    const types = []
    for (const u of ms) {
      let c = types.find((x) => x.t === u.t)
      if (!c) types.push((c = { t: u.t, n: 0, idle: 0 }))
      c.n++
    }
    // (in a phase, a chip greys with how many of its units can't act in it)
    if (verb && verb !== 'place') this.human.ask((G, q) => {
      for (const c of types) c.idle = ms.filter((u) => u.t === c.t && !q.canAct(G, G.units.find((x) => x.id === u.id))).length
    })
    const chips = types.map((c, key) => ({ key, name: c.t.short, n: c.n, why: c.idle ? `${c.idle} can't act now` : '' }))
    this.chipTypes = types.map((c) => c.t)
    const LABEL = { place: 'Place: click the ground', move: 'Move: click the ground · Approach: click an enemy', shoot: 'Fire: click an enemy', charge: 'Charge: click an enemy' }
    const verbs = verb && LABEL[verb] ? [{ k: verb, label: LABEL[verb], on: true }] : [{ k: 'wait', label: 'Orders can be given on your turn', on: false }]
    // (F10b) Auto these: in a phase, while one of the group can still act
    const able = ms.length - types.reduce((n, c) => n + c.idle, 0)
    const pilot = verb && verb !== 'place' ? { n: able, why: able ? '' : 'none of them can act now' } : null
    return { show: true, ready, count: ms.length, models: ms.reduce((n, u) => n + u.alive, 0), chips, verbs, advance: verb === 'move' ? s.advance : null, pilot, pinned: !!s.pin, summary: s.pin?.preview.summary ?? '', note: s.note }
  }

  // the bar's buttons
  wireBar() {
    this.bar.wire({
      only: (k) => this.setGroup(this.members().filter((u) => u.t === this.chipTypes[k]).map((u) => u.id)),
      drop: (k) => this.setGroup(this.members().filter((u) => u.t !== this.chipTypes[k]).map((u) => u.id)),
      next: () => this.next(1),
      commit: () => this.commit(),
      cancel: () => {
        this.cancel()
        this.human.flow.refreshUI()
      },
      clear: () => this.setGroup([]),
      ready: () => this.setGroup(this.ready().map((u) => u.id)),
      advance: () => this.toggleAdvance(),
      pilot: () => this.pilot(),
      save: () => {
        const seat = this.seat(), s = this.selection.of(seat)
        const k = [1, 2, 3, 4, 5, 6, 7, 8, 9].find((d) => !s.saved[d]) ?? 9
        this.selection.save(seat, k)
        s.note = `Saved as group ${k} (press ${k} to call it back)`
        this.human.flow.refreshUI()
      },
    })
  }
}
