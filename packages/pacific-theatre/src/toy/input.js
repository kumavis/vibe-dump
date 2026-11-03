// The toy's controls (TOY.md §3): one stick and two buttons. The mouse (the
// nose follows the pointer, level when it is centred), the arrows or WASD;
// left button or Space fires, right button or Shift drops; on a touch screen
// the box's own stick and buttons (controls/touch.js, labelled fire and drop);
// a gamepad's left stick, A and B. Whatever was touched last steers.

import { TouchControls } from '../battle/controls/touch.js'

const KEYS = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd' }
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const deadZone = (v, d) => (Math.abs(v) < d ? 0 : (v - Math.sign(v) * d) / (1 - d))

export class ToyInput {
  /** el: the toy's root (pointer events land on it); hooks: { pause() }. */
  constructor(el, hooks = {}) {
    this.el = el
    this.hooks = hooks
    this.keys = new Set()
    this.mouse = { x: 0, y: 0, on: false, fire: false }
    this.drops = 0
    this.last = 'keys'
    this.fireKey = false
    this.padDrop = false
    this.padPause = false
    this.touch = null
    this.enabled = true
    this.ac = new AbortController()
    const on = { signal: this.ac.signal }
    const cap = { signal: this.ac.signal, capture: true }
    // the toy's keys first, and nothing of the table's or the box's sees them while it runs
    addEventListener('keydown', (e) => this.key(e, true), cap)
    addEventListener('keyup', (e) => this.key(e, false), cap)
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
      this.mouse.on = true
      this.last = 'mouse'
    }, on)
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') this.mouse.on = false
    }, on)
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || !this.enabled) {
        if (e.pointerType === 'touch') this.ensureTouch()
        return
      }
      if (e.target.closest('button')) return
      this.mouse.on = true
      this.last = 'mouse'
      if (e.button === 0) this.mouse.fire = true
      if (e.button === 2) this.drops++
      e.preventDefault()
    }, on)
    addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) this.mouse.fire = false
    }, on)
    el.addEventListener('contextmenu', (e) => e.preventDefault(), on)
    addEventListener('blur', () => {
      this.keys.clear()
      this.mouse.fire = false
      this.fireKey = false
      hooks.blur?.()
    }, on)
    if (matchMedia?.('(pointer: coarse)')?.matches || new URLSearchParams(location.search).has('touch')) this.ensureTouch()
  }

  key(e, down) {
    if (!this.enabled) return
    const c = e.code
    if (/^F\d+$/.test(c)) return
    e.stopImmediatePropagation()
    if (down && (c === 'Escape' || c === 'KeyP')) {
      e.preventDefault()
      if (!e.repeat) this.hooks.pause?.()
      return
    }
    if (e.target?.closest?.('button') && (c === 'Space' || c === 'Enter')) return
    if (KEYS[c]) {
      e.preventDefault()
      if (down) this.keys.add(KEYS[c])
      else this.keys.delete(KEYS[c])
      this.last = 'keys'
    } else if (c === 'Space') {
      e.preventDefault()
      this.fireKey = down
      if (down && !this.mouse.on) this.last = 'keys'
    } else if (c === 'ShiftLeft' || c === 'ShiftRight' || c === 'KeyB' || c === 'KeyE') {
      e.preventDefault()
      if (down && !e.repeat) this.drops++
    }
  }

  /** The box's touch stick and buttons, with the toy's two (fire, drop) and its pause. */
  ensureTouch() {
    if (this.touch) return
    const self = this
    const inp = { fireHeld: false, bombCount: 0, torpedoCount: 0, throttle: 1 }
    // (TouchControls reads an Input's player and battle: the toy hands it a held aircraft and its own pause)
    const stub = {
      player: { kind: 'aircraft', allStations: true, input: inp, state: { roll: 0, pitch: 0 } },
      battle: {
        get running() {
          return !self.hooks.paused?.()
        },
        pause: () => self.hooks.pause?.(),
        play: () => self.hooks.pause?.(),
      },
      acted: false,
    }
    this.touch = new TouchControls(stub)
    this.touch.el.classList.add('toy-touch')
    this.touchInput = inp
    for (const b of this.touch.el.querySelectorAll('.t-bomb')) b.textContent = 'drop'
    this.touchDrops = 0
  }

  /** The stick, the trigger and the drops counted since the last read: { sx, sy, fire, drop }. */
  read(width, height) {
    let sx = 0
    let sy = 0
    let fire = false
    let drop = 0
    // the gamepad
    const pads = navigator.getGamepads?.() || []
    for (const p of pads) {
      if (!p || !p.connected) continue
      const ax = deadZone(p.axes[0] || 0, 0.15)
      const ay = deadZone(p.axes[1] || 0, 0.15)
      if (ax || ay) this.last = 'pad'
      if (this.last === 'pad') {
        sx = ax
        sy = -ay
      }
      const a = p.buttons[0]?.pressed || p.buttons[7]?.pressed
      if (a) {
        fire = true
        this.last = 'pad'
      }
      const b = !!p.buttons[1]?.pressed
      if (b && !this.padDrop) drop++
      this.padDrop = b
      const st = !!p.buttons[9]?.pressed
      if (st && !this.padPause) this.hooks.pause?.()
      this.padPause = st
      break
    }
    // the touch stick
    const tc = this.touch
    if (tc) {
      if (tc.stick.id != null) {
        this.last = 'touch'
        sx = tc.stick.x
        sy = -tc.stick.y
      }
      if (this.touchInput.fireHeld) fire = true
      if (this.touchInput.bombCount > this.touchDrops) {
        drop += this.touchInput.bombCount - this.touchDrops
        this.touchDrops = this.touchInput.bombCount
      }
    }
    if (this.last === 'keys') {
      sx = (this.keys.has('r') ? 1 : 0) - (this.keys.has('l') ? 1 : 0)
      sy = (this.keys.has('u') ? 1 : 0) - (this.keys.has('d') ? 1 : 0)
    } else if (this.last === 'mouse' && this.mouse.on) {
      // the nose follows the pointer: its offset from the middle, level inside a small dead zone
      const R = 0.36 * Math.min(width, height)
      sx = clamp(deadZone((this.mouse.x - width / 2) / R, 0.06), -1, 1)
      sy = clamp(deadZone(-(this.mouse.y - height * 0.45) / R, 0.06), -1, 1)
    }
    fire = fire || this.fireKey || this.mouse.fire
    drop += this.drops
    this.drops = 0
    return { sx, sy, fire, drop }
  }

  dispose() {
    this.ac.abort()
    this.touch?.dispose()
    this.touch = null
  }
}
