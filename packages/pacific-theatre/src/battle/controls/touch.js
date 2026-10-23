// Touch (ENGINEERING.md §8; R7 §4.12), Pointer Events, targets of at least
// 48 px, two thumbs. An aircraft: a self-levelling bank-to-turn stick on the
// left (sideways sets a bank of up to 60°, up and down the pull; let go and
// the wings level), a throttle slider, and fire, bomb and torpedo buttons on
// the right. A ship: the helm as a slider with five detents and the
// telegraph with seven, a salvo button (never tap-anywhere: a stray tap
// would waste a salvo), an AA button that directs at the nearest attacker,
// and the aim by dragging on the sea. Camera and time buttons for both, and
// a release under the clock that gives the controls back on a second tap,
// as Backspace does (ENGINEERING §8).
//
// Round two (ROUND-2.md §4): at a gun station (the AA director, the gunner)
// a drag anywhere on the box turns the aim and a fire button fires while
// held; the bombardier has two steering buttons and a release. The station
// bar is the HUD's (its buttons take a tap). The stick writes nothing until
// it has been touched, so a take left alone stays on the record.

import { HELM_STEPS, TELEGRAPH_LEVELS } from './bindings.js'

const STYLE = `
.pt-touch { position: fixed; inset: 0; pointer-events: none; z-index: 30; font: 12px Inter, system-ui, sans-serif; color: #eee; }
.pt-touch .pad { position: absolute; pointer-events: auto; touch-action: none; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); }
.pt-touch .knob { position: absolute; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%; background: rgba(255,255,255,.35); left: 50%; top: 50%; }
.pt-touch .btn { position: absolute; pointer-events: auto; touch-action: none; min-width: 56px; min-height: 56px; border-radius: 28px; background: rgba(20,24,28,.55); border: 1px solid rgba(255,255,255,.3); display: flex; align-items: center; justify-content: center; user-select: none; }
.pt-touch .btn.on { background: rgba(240,200,120,.45); }
.pt-touch .slider { position: absolute; pointer-events: auto; touch-action: none; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); border-radius: 24px; }
.pt-touch .slider .knob { left: 50%; top: 50%; }
`

export class TouchControls {
  constructor(input) {
    this.input = input
    this.active = false
    this.stick = { x: 0, y: 0, id: null }
    if (!document.getElementById('pt-touch-style')) {
      const st = document.createElement('style')
      st.id = 'pt-touch-style'
      st.textContent = STYLE
      document.head.appendChild(st)
    }
    const el = document.createElement('div')
    el.className = 'pt-touch'
    document.body.appendChild(el)
    this.el = el
    this.ac = new AbortController()
    const p = input.player
    const st = p && !p.allStations ? p.station : null
    if (st === 'aa' || st === 'gunner') this.buildGun()
    else if (st === 'bombardier') this.buildBombardier()
    else if (p?.kind === 'aircraft') this.buildAircraft()
    else this.buildShip()
  }

  /** A gun station: a drag on the box turns the aim; a fire button held fires. */
  buildGun() {
    const inp = () => this.input.player?.input
    const canvas = this.input.app.canvas
    const on = { signal: this.ac.signal }
    let last = null
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return
      last = { x: e.clientX, y: e.clientY, id: e.pointerId }
    }, on)
    canvas.addEventListener('pointermove', (e) => {
      if (!last || e.pointerId !== last.id) return
      const g = this.input.gun
      this.input.gunInit()
      g.az = (g.az + (e.clientX - last.x) * 0.18 + 360) % 360
      g.el = Math.max(-10, Math.min(85, g.el - (e.clientY - last.y) * 0.18))
      last = { x: e.clientX, y: e.clientY, id: e.pointerId }
      this.input.acted = true
    }, on)
    canvas.addEventListener('pointerup', () => (last = null), on)
    this.btn('fire', { right: '24px', bottom: '24px', minWidth: '84px', minHeight: '84px' }, () => inp() && (inp().fireHeld = true), () => inp() && (inp().fireHeld = false))
    this.btn('cam', { right: '24px', top: '210px' }, () => this.input.battle.cycleCamera?.())
    this.btn('time', { right: '96px', top: '210px' }, () => this.input.battle.cycleTime?.())
    this.releaseButton()
    this.active = true
  }

  /** The bombardier: steer the run-in left and right, release the stick. */
  buildBombardier() {
    const inp = () => this.input.player?.input
    this.btn('◀', { left: '24px', bottom: '24px' }, () => inp() && (inp().roll = -1), () => inp() && (inp().roll = 0))
    this.btn('▶', { left: '96px', bottom: '24px' }, () => inp() && (inp().roll = 1), () => inp() && (inp().roll = 0))
    this.btn('release bombs', { right: '24px', bottom: '24px', minWidth: '96px', padding: '0 10px' }, () => inp() && inp().bombCount++)
    this.btn('cam', { right: '24px', top: '210px' }, () => this.input.battle.cycleCamera?.())
    this.releaseButton()
    this.active = true
  }

  btn(label, style, onDown, onUp = null) {
    const b = document.createElement('div')
    b.className = 'btn'
    b.textContent = label
    Object.assign(b.style, style)
    const on = { signal: this.ac.signal }
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      try {
        b.setPointerCapture(e.pointerId)
      } catch {
        // (a page under pointer lock refuses the capture; the control still acts)
      }
      b.classList.add('on')
      onDown()
    }, on)
    b.addEventListener('pointerup', () => {
      b.classList.remove('on')
      onUp?.()
    }, on)
    this.el.appendChild(b)
    return b
  }

  slider(style, vertical, steps, get, set) {
    const s = document.createElement('div')
    s.className = 'slider'
    Object.assign(s.style, style)
    const k = document.createElement('div')
    k.className = 'knob'
    s.appendChild(k)
    this.el.appendChild(s)
    const on = { signal: this.ac.signal }
    const place = () => {
      const v = get()
      const i = steps.reduce((b, x, j) => (Math.abs(x - v) < Math.abs(steps[b] - v) ? j : b), 0)
      const f = steps.length > 1 ? i / (steps.length - 1) : 0.5
      if (vertical) k.style.top = `${(1 - f) * 100}%`
      else k.style.left = `${f * 100}%`
    }
    const pick = (e) => {
      const r = s.getBoundingClientRect()
      const f = vertical ? 1 - (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width
      const i = Math.round(Math.max(0, Math.min(1, f)) * (steps.length - 1))
      set(steps[i])
      place()
    }
    s.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      try {
        s.setPointerCapture(e.pointerId)
      } catch {
        // (a page under pointer lock refuses the capture; the control still acts)
      }
      pick(e)
    }, on)
    s.addEventListener('pointermove', (e) => {
      if (e.buttons) pick(e)
    }, on)
    place()
    return { el: s, place }
  }

  buildAircraft() {
    const inp = () => this.input.player?.input
    const pad = document.createElement('div')
    pad.className = 'pad'
    Object.assign(pad.style, { left: '24px', bottom: '24px', width: '150px', height: '150px' })
    const knob = document.createElement('div')
    knob.className = 'knob'
    pad.appendChild(knob)
    this.el.appendChild(pad)
    const on = { signal: this.ac.signal }
    const setStick = (e) => {
      const r = pad.getBoundingClientRect()
      const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      this.stick.x = x
      this.stick.y = y
      knob.style.left = `${50 + x * 50}%`
      knob.style.top = `${50 + y * 50}%`
    }
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      try {
        pad.setPointerCapture(e.pointerId)
      } catch {
        // (a page under pointer lock refuses the capture; the control still acts)
      }
      this.stick.id = e.pointerId
      this.active = true
      this.stick.used = true
      this.input.acted = true
      setStick(e)
    }, on)
    pad.addEventListener('pointermove', (e) => {
      if (this.stick.id === e.pointerId) setStick(e)
    }, on)
    pad.addEventListener('pointerup', () => {
      this.stick.id = null
      this.stick.x = 0
      this.stick.y = 0
      knob.style.left = '50%'
      knob.style.top = '50%'
    }, on)
    this.slider({ left: '190px', bottom: '24px', width: '48px', height: '150px' }, true, [0, 0.25, 0.5, 0.75, 1], () => inp()?.throttle ?? 0.8, (v) => inp() && (inp().throttle = v))
    this.btn('fire', { right: '24px', bottom: '96px' }, () => inp() && (inp().fireHeld = true), () => inp() && (inp().fireHeld = false))
    this.btn('bomb', { right: '96px', bottom: '24px' }, () => inp() && inp().bombCount++)
    this.btn('torp', { right: '24px', bottom: '24px' }, () => inp() && inp().torpedoCount++)
    this.btn('cam', { right: '24px', top: '210px' }, () => this.input.battle.cycleCamera?.())
    this.btn('time', { right: '96px', top: '210px' }, () => this.input.battle.cycleTime?.())
    this.releaseButton()
  }

  /** Top left, under the clock: the touch visitor's Backspace. */
  releaseButton() {
    this.btn('release', { left: '14px', top: '64px', padding: '0 12px' }, () => this.input.askRelease('Tap release'))
  }

  buildShip() {
    const inp = () => this.input.player?.input
    this.helm = this.slider({ left: '24px', bottom: '24px', width: '220px', height: '48px' }, false, HELM_STEPS, () => inp()?.helm ?? 0, (v) => inp() && (inp().helm = v))
    this.tel = this.slider({ left: '24px', bottom: '90px', width: '48px', height: '200px' }, true, TELEGRAPH_LEVELS, () => inp()?.telegraph ?? 0, (v) => inp() && (inp().telegraph = v))
    this.btn('salvo', { right: '24px', bottom: '24px', minWidth: '72px', minHeight: '72px' }, () => inp() && inp().salvoCount++)
    this.btn('torp', { right: '110px', bottom: '24px' }, () => inp() && inp().torpedoCount++)
    this.btn('AA', { right: '24px', bottom: '110px' }, () => {
      const i = inp()
      if (!i) return
      i.aa = true
      i.aaTarget = -1
      i.aaDir = null
      setTimeout(() => (i.aa = false), 150)
    })
    this.btn('cam', { right: '24px', top: '210px' }, () => this.input.battle.cycleCamera?.())
    this.btn('time', { right: '96px', top: '210px' }, () => this.input.battle.cycleTime?.())
    this.releaseButton()
    this.active = true
  }

  /** The bank-to-turn stick: a bank of up to 60° from the stick's x, a pull from its y; let go and the wings level. */
  update() {
    const p = this.input.player
    if (!p || p.kind !== 'aircraft' || !this.stick.used) return
    if (!p.allStations && p.station !== 'pilot') return
    const st = p.state
    const inp = p.input
    const wantBank = this.stick.x * 60
    const err = wantBank - (st.roll ?? 0)
    inp.roll = Math.max(-1, Math.min(1, err / 25))
    // the pull: hold the turn's load and add the stick's
    const bank = Math.abs((st.roll ?? 0) * (Math.PI / 180))
    const hold = 1 / Math.max(0.5, Math.cos(bank)) - 1
    inp.pitch = Math.max(-1, Math.min(1, hold * 0.4 - this.stick.y * 0.8 - (st.pitch ?? 0) * 0.01))
    inp.mode = 'direct'
    inp.aimDir = null
  }

  dispose() {
    this.ac.abort()
    this.el.remove()
  }
}
