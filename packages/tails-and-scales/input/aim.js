// Touch aim (F13, DESIGN §4.2.6): a hover for a finger. The mouse shows what
// a click would do before it clicks (input/human.js's pointed(): a move's
// path and inches with its ghost, a shot's odds, a charge's, a charge's end
// spot, a group's formation); a finger had none of it, since pointermove
// fires only while a finger is down, orbiting the camera, and a lift after a
// drag is never a click.
//
//   Long press  with a unit or a group of the seat's picked up (or a
//               charge's end to pick), a finger held still on the ground or
//               on an enemy for input/group.js's long press (450 ms; on one
//               of the seat's own units it still adds or drops it) ticks the
//               vibrator and becomes an aim drag
//   👆 Aim      while on (index.html's #aimMode, beside ▭ Select), any
//               one-finger press on the board is an aim drag from the start,
//               whenever there is something to aim (else a finger orbits as
//               ever); two fingers still pan and zoom. It and ▭ Select take
//               turns: switching one on switches the other off
//   The drag    holds the camera (OrbitControls' rotate set aside, so a
//               second finger still finds its two-finger gesture), drives the
//               mouse's own preview under the finger with the tooltip lifted
//               clear of it, a move as far as it goes that way when the
//               finger lies beyond the unit's reach (input/tools/move.js's
//               aimCell); the lift does what a click there does
//               (input/human.js's click, `far`): no second tap. A second
//               finger, a cancelled pointer or the finger off the board calls
//               it off, and nothing is sent
//
// Nothing here is logged but what the click sends.
import { sfx } from '../view/sfx.js'

const LIFT = 96 // px the tooltip stands above a finger aiming

export class Aim {
  // `human` (input/human.js), whose picker, preview and click the drag uses
  constructor(human) {
    this.human = human
    this.on = false
    // the drag under way: { id (its pointer), off (called off: the lift
    // sends nothing), rot (OrbitControls' enableRotate before it) }, or null
    this.drag = null
  }

  get controls() {
    return this.human.group?.controls ?? null
  }

  // Something to aim now: a unit or a group of the seat's picked up in its
  // deployment or its phase, or a charge's end to pick.
  ready() {
    const h = this.human
    if (!h.session) return false
    if (h.picking()) return true
    if (h.deploySeat() < 0 && !h.myTurn()) return false
    return !!h.sel || !!h.group?.isGroup()
  }

  // whether 👆 Aim takes a finger's press now (input/group.js's touches():
  // the camera's one-finger orbit set aside while it does)
  holds() {
    return this.on && this.ready()
  }

  // 👆 Aim on or off (▭ Select off as it comes on)
  set(on) {
    this.on = on
    const g = this.human.group
    if (on && g?.selectMode) g.setSelectMode(false)
    g?.touches()
    this.human.flow.refreshUI()
  }
  toggle() {
    sfx.click()
    this.set(!this.on)
  }

  // what the HUD model reads (present/hud-model.js): 👆 Aim and ▭ Select
  // on, and the drag under way ('on', 'off' once called off, or null)
  state() {
    return { on: this.on, select: !!this.human.group?.selectMode, aiming: this.drag ? (this.drag.off ? 'off' : 'on') : null }
  }

  // ── The pointer (input/human.js's listeners hand it here) ─────────────────
  // A pointer down: a second one calls a drag off; with 👆 Aim on, a finger
  // pressed on the board while there is something to aim starts one (unless
  // the group took the press: `took`, a handle of its pin).
  down(e, multi, took) {
    const d = this.drag
    if (d) {
      if (e.pointerId !== d.id) this.end()
      return
    }
    if (!this.on || multi || took || e.pointerType !== 'touch' || e.button !== 0 || !this.ready()) return
    if (this.human.picker.pick(e).ground) this.begin(e.pointerId, e.clientX, e.clientY)
  }

  // input/group.js's long press, held on the ground or an enemy (`pick`,
  // the picker's there): true when it starts a drag
  hold(id, x, y, pick) {
    if (this.drag || !pick.ground || !this.ready()) return false
    this.begin(id, x, y)
    navigator.vibrate?.(10)
    sfx.click()
    return true
  }

  begin(id, x, y) {
    const c = this.controls
    this.drag = { id, off: false, rot: c?.enableRotate ?? true }
    if (c) c.enableRotate = false
    this.human.flow.refreshUI()
    this.at({ clientX: x, clientY: y })
  }

  // the drag's finger moved: true while a drag is under way (the pointer is
  // the aim's, whichever it is)
  move(e) {
    const d = this.drag
    if (!d) return false
    if (e.pointerId === d.id && !d.off) this.at(e)
    return true
  }

  // the preview under the finger at `e`: what a hover there shows, the
  // tooltip above the finger; off the board, the drag called off
  at(e) {
    const h = this.human, pick = h.picker.pick({ clientX: e.clientX, clientY: e.clientY, pointerType: 'touch' })
    if (!pick.ground) {
      this.drag.off = true
      this.clear()
      h.flow.refreshUI()
      return
    }
    h.mouse = { x: e.clientX, y: e.clientY - LIFT }
    h.far = true
    h.hoverPick = pick
    h.pointed()
  }

  // The drag's finger lifted: what a click there does, unless the drag was
  // called off or `commit` is false (a long press on one of the seat's own
  // units took the press).
  lift(e, commit) {
    const d = this.end()
    if (!d || d.off || !commit) return
    const h = this.human
    h.click(h.picker.pick(e), e, true)
  }

  // a pointer cancelled (the browser took it): its drag called off
  cancel(e) {
    if (this.drag?.id === e.pointerId) this.end()
  }

  // The drag over, nothing sent here: the camera free again, the preview
  // gone (a pinned formation drawn again), the HUD's hint its own.
  // → the drag it ended, or null
  end() {
    const d = this.drag
    if (!d) return null
    this.drag = null
    const c = this.controls
    if (c) c.enableRotate = d.rot
    this.clear()
    this.human.flow.refreshUI()
    return d
  }

  clear() {
    const h = this.human
    h.hoverPick = null
    h.hover = null
    h.far = false
    h.pointed()
    h.group?.unhover()
    h.flow.refreshRings()
  }
}
