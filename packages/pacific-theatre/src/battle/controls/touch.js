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
//
// On a phone (700 px wide or less, or a coarse pointer: the page's phone
// layout in style.css, the HUD's in scene/hud.js) the controls keep the
// foot and nothing else stands in their rectangles: the stick (or the helm
// and telegraph, or the bombardier's steering) bottom left; fire, bomb and
// torpedo (or salvo, torpedoes and AA, or the sight's release) bottom right
// with a pause beside them; camera and time stacked at the right edge under
// the HUD's plot; at a gun station the middle of the screen is the aim. The
// height the controls take from the bottom is published as --pt-controls on
// the document, so the HUD's subtitle sits just above them. The round
// release under the clock stands down while the page's own bar is up
// (--pt-touch-release: none, from style.css): Release on the bar gives the
// controls back there, with one tap.

import { HELM_STEPS, TELEGRAPH_LEVELS } from './bindings.js'

// (the page's phone query: style.css and scene/hud.js keep the same one)
const PHONE = '(max-width: 700px), (pointer: coarse)'
const PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>'
const PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>'

const STYLE = `
.pt-touch { position: fixed; inset: 0; pointer-events: none; z-index: 30; font: 12px Inter, system-ui, sans-serif; color: #eee; }
.pt-touch .pad { position: absolute; pointer-events: auto; touch-action: none; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); }
.pt-touch .knob { position: absolute; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%; background: rgba(255,255,255,.35); left: 50%; top: 50%; }
.pt-touch .btn { position: absolute; pointer-events: auto; touch-action: none; min-width: 56px; min-height: 56px; border-radius: 28px; background: rgba(20,24,28,.55); border: 1px solid rgba(255,255,255,.3); display: flex; align-items: center; justify-content: center; user-select: none; }
.pt-touch .btn.on { background: rgba(240,200,120,.45); }
.pt-touch .slider { position: absolute; pointer-events: auto; touch-action: none; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); border-radius: 24px; }
.pt-touch .slider .knob { left: 50%; top: 50%; }
.pt-touch .slider .knob { width: calc(2 * var(--kr, 24px)); height: calc(2 * var(--kr, 24px)); margin: calc(-1 * var(--kr, 24px)) 0 0 calc(-1 * var(--kr, 24px)); }
/* where each control stands, by the kind of controls (data-k: aircraft, ship, gun, bombardier): ENGINEERING §8's layout */
.pt-touch .t-stick { left: 24px; bottom: 24px; width: 150px; height: 150px; }
.pt-touch .t-throttle { left: 190px; bottom: 24px; width: 48px; height: 150px; }
.pt-touch[data-k=aircraft] .t-fire { right: 24px; bottom: 96px; }
.pt-touch[data-k=aircraft] .t-bomb { right: 96px; bottom: 24px; }
.pt-touch[data-k=aircraft] .t-torp { right: 24px; bottom: 24px; }
.pt-touch[data-k=gun] .t-fire { right: 24px; bottom: 24px; min-width: 84px; min-height: 84px; }
.pt-touch .t-steer-l { left: 24px; bottom: 24px; }
.pt-touch .t-steer-r { left: 96px; bottom: 24px; }
.pt-touch .t-drop { right: 24px; bottom: 24px; min-width: 96px; padding: 0 10px; }
.pt-touch .t-helm { left: 24px; bottom: 24px; width: 220px; height: 48px; }
.pt-touch .t-tel { left: 24px; bottom: 90px; width: 48px; height: 200px; }
.pt-touch .t-salvo { right: 24px; bottom: 24px; min-width: 72px; min-height: 72px; }
.pt-touch[data-k=ship] .t-torp { right: 110px; bottom: 24px; }
.pt-touch .t-aa { right: 24px; bottom: 110px; }
.pt-touch .t-cam { right: 24px; top: 210px; }
.pt-touch .t-time { right: 96px; top: 210px; }
.pt-touch .t-release { left: 14px; top: 64px; padding: 0 12px; display: var(--pt-touch-release, flex); }
.pt-touch .t-pause { display: none; }
@media ${PHONE} {
  .pt-touch { --kr: 20px; --gl: max(12px, env(safe-area-inset-left, 0px)); --gr: max(12px, env(safe-area-inset-right, 0px)); --gb: calc(12px + env(safe-area-inset-bottom, 0px)); --edge: max(8px, env(safe-area-inset-right, 0px)); }
  /* bottom left: the stick and its throttle; the helm and the telegraph above it; the bombardier's steering */
  .pt-touch .t-stick { left: var(--gl); bottom: var(--gb); width: 128px; height: 128px; }
  .pt-touch .t-throttle { left: calc(var(--gl) + 138px); bottom: var(--gb); width: 40px; height: 128px; }
  .pt-touch .t-helm { left: var(--gl); bottom: var(--gb); width: 160px; height: 44px; }
  .pt-touch .t-tel { left: var(--gl); bottom: calc(var(--gb) + 54px); width: 44px; height: 128px; }
  .pt-touch .t-steer-l { left: var(--gl); bottom: var(--gb); }
  .pt-touch .t-steer-r { left: calc(var(--gl) + 64px); bottom: var(--gb); }
  /* bottom right: [pause][fire] over [bomb][torp]; salvo, torpedoes and AA; the gun's fire; the sight's release; each with the pause beside it */
  .pt-touch[data-k=aircraft] .t-torp { right: var(--gr); bottom: var(--gb); }
  .pt-touch[data-k=aircraft] .t-fire { right: var(--gr); bottom: calc(var(--gb) + 64px); }
  .pt-touch[data-k=aircraft] .t-bomb { right: calc(var(--gr) + 64px); bottom: var(--gb); }
  .pt-touch[data-k=aircraft] .t-pause { right: calc(var(--gr) + 70px); bottom: calc(var(--gb) + 70px); }
  .pt-touch .t-salvo { right: var(--gr); bottom: var(--gb); min-width: 64px; min-height: 64px; border-radius: 32px; }
  .pt-touch[data-k=ship] .t-torp { right: calc(var(--gr) + 72px); bottom: var(--gb); }
  .pt-touch .t-aa { right: var(--gr); bottom: calc(var(--gb) + 72px); }
  .pt-touch[data-k=ship] .t-pause { right: calc(var(--gr) + 78px); bottom: calc(var(--gb) + 78px); }
  .pt-touch[data-k=gun] .t-fire { right: var(--gr); bottom: var(--gb); min-width: 76px; min-height: 76px; border-radius: 38px; }
  .pt-touch[data-k=gun] .t-pause { right: calc(var(--gr) + 86px); bottom: var(--gb); }
  .pt-touch .t-drop { right: var(--gr); bottom: var(--gb); }
  .pt-touch[data-k=bombardier] .t-pause { right: var(--gr); bottom: calc(var(--gb) + 64px); }
  .pt-touch .t-pause { display: flex; min-width: 44px; min-height: 44px; width: 44px; height: 44px; border-radius: 22px; }
  /* camera and time: stacked at the right edge, under the HUD's plot (scene/hud.js: --pt-plot-top, --pt-plot) */
  .pt-touch .t-time, .pt-touch .t-cam { right: var(--edge); min-width: 44px; min-height: 44px; width: 44px; height: 44px; border-radius: 22px; font-size: 11.5px; }
  .pt-touch .t-time { top: calc(var(--pt-plot-top, 58px) + var(--pt-plot, 96px) + 8px); }
  .pt-touch .t-cam { top: calc(var(--pt-plot-top, 58px) + var(--pt-plot, 96px) + 60px); }
  .pt-touch[data-k=bombardier] .t-cam { top: calc(var(--pt-plot-top, 58px) + var(--pt-plot, 96px) + 8px); }
  /* on its side: the telegraph beside the helm, not over it, so the controls stay low */
  @media (orientation: landscape) {
    .pt-touch .t-tel { left: var(--gl); bottom: var(--gb); height: 116px; }
    .pt-touch .t-helm { left: calc(var(--gl) + 54px); }
  }
}
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
    this.pauseButton()
    // the room the controls take from the bottom, for the HUD's subtitle (and the page's panels) to stand above
    this.measure()
    addEventListener('resize', () => this.measure(), { signal: this.ac.signal })
  }

  /** --pt-controls on the document: the height from the screen's foot to the top of the highest control there. */
  measure() {
    let h = 0
    for (const c of this.el.children) {
      if (c.dataset.dock !== 'foot') continue
      const r = c.getBoundingClientRect()
      if (r.width > 0) h = Math.max(h, innerHeight - r.top)
    }
    document.documentElement.style.setProperty('--pt-controls', `${Math.ceil(h)}px`)
  }

  /** On a phone, a pause beside fire (the bar's own is in its ⋯ sheet there, and stands down while this one shows). */
  pauseButton() {
    const battle = this.input.battle
    this.pause = this.btn('', 't-pause', () => {
      if (battle?.running) battle.pause?.()
      else battle?.play?.(Math.max(0.5, battle.timeScale || 1))
      this.showPause()
    })
    this.showPause()
  }

  showPause() {
    const running = this.input.battle?.running !== false
    if (running === this.pauseShows) return
    this.pauseShows = running
    this.pause.innerHTML = running ? PAUSE : PLAY
    this.pause.setAttribute('aria-label', running ? 'Pause' : 'Play')
    this.pause.title = running ? 'Pause' : 'Play'
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
    this.el.dataset.k = 'gun'
    this.btn('fire', 't-fire', () => inp() && (inp().fireHeld = true), () => inp() && (inp().fireHeld = false))
    this.btn('cam', 't-cam', () => this.input.battle.cycleCamera?.())
    this.btn('time', 't-time', () => this.input.battle.cycleTime?.())
    this.releaseButton()
    this.active = true
  }

  /** The bombardier: steer the run-in left and right, release the stick. */
  buildBombardier() {
    const inp = () => this.input.player?.input
    this.el.dataset.k = 'bombardier'
    this.btn('◀', 't-steer-l', () => inp() && (inp().roll = -1), () => inp() && (inp().roll = 0))
    this.btn('▶', 't-steer-r', () => inp() && (inp().roll = 1), () => inp() && (inp().roll = 0))
    this.btn('release bombs', 't-drop', () => inp() && inp().bombCount++)
    this.btn('cam', 't-cam', () => this.input.battle.cycleCamera?.())
    this.releaseButton()
    this.active = true
  }

  /** A button: its label, its place (a t-* class, placed by STYLE), what a press and a let-go do. Camera, time and release stand at the top; the rest dock at the foot. */
  btn(label, cls, onDown, onUp = null) {
    const b = document.createElement('div')
    b.className = `btn ${cls}`
    b.dataset.dock = /^t-(cam|time|release)$/.test(cls) ? 'top' : 'foot'
    b.textContent = label
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

  slider(cls, vertical, steps, get, set) {
    const s = document.createElement('div')
    s.className = `slider ${cls}`
    s.dataset.dock = 'foot'
    const k = document.createElement('div')
    k.className = 'knob'
    s.appendChild(k)
    this.el.appendChild(s)
    const on = { signal: this.ac.signal }
    const place = () => {
      const v = get()
      const i = steps.reduce((b, x, j) => (Math.abs(x - v) < Math.abs(steps[b] - v) ? j : b), 0)
      const f = steps.length > 1 ? i / (steps.length - 1) : 0.5
      // (the knob's middle travels a radius short of each end, so the knob stays inside the slider and on the screen)
      if (vertical) k.style.top = `calc(var(--kr, 24px) + (100% - 2 * var(--kr, 24px)) * ${(1 - f).toFixed(4)})`
      else k.style.left = `calc(var(--kr, 24px) + (100% - 2 * var(--kr, 24px)) * ${f.toFixed(4)})`
    }
    const pick = (e) => {
      const r = s.getBoundingClientRect()
      const kr = parseFloat(getComputedStyle(k).width) / 2 || 24
      const f = vertical ? 1 - (e.clientY - r.top - kr) / Math.max(1, r.height - 2 * kr) : (e.clientX - r.left - kr) / Math.max(1, r.width - 2 * kr)
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
    this.el.dataset.k = 'aircraft'
    const pad = document.createElement('div')
    pad.className = 'pad t-stick'
    pad.dataset.dock = 'foot'
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
    this.slider('t-throttle', true, [0, 0.25, 0.5, 0.75, 1], () => inp()?.throttle ?? 0.8, (v) => inp() && (inp().throttle = v))
    this.btn('fire', 't-fire', () => inp() && (inp().fireHeld = true), () => inp() && (inp().fireHeld = false))
    this.btn('bomb', 't-bomb', () => inp() && inp().bombCount++)
    this.btn('torp', 't-torp', () => inp() && inp().torpedoCount++)
    this.btn('cam', 't-cam', () => this.input.battle.cycleCamera?.())
    this.btn('time', 't-time', () => this.input.battle.cycleTime?.())
    this.releaseButton()
  }

  /** Top left, under the clock: the touch visitor's Backspace (standing down while the page's bar, with its Release, is up). */
  releaseButton() {
    this.btn('release', 't-release', () => this.input.askRelease('Tap release'))
  }

  buildShip() {
    const inp = () => this.input.player?.input
    this.el.dataset.k = 'ship'
    this.helm = this.slider('t-helm', false, HELM_STEPS, () => inp()?.helm ?? 0, (v) => inp() && (inp().helm = v))
    this.tel = this.slider('t-tel', true, TELEGRAPH_LEVELS, () => inp()?.telegraph ?? 0, (v) => inp() && (inp().telegraph = v))
    this.btn('salvo', 't-salvo', () => inp() && inp().salvoCount++)
    this.btn('torp', 't-torp', () => inp() && inp().torpedoCount++)
    this.btn('AA', 't-aa', () => {
      const i = inp()
      if (!i) return
      i.aa = true
      i.aaTarget = -1
      i.aaDir = null
      setTimeout(() => (i.aa = false), 150)
    })
    this.btn('cam', 't-cam', () => this.input.battle.cycleCamera?.())
    this.btn('time', 't-time', () => this.input.battle.cycleTime?.())
    this.releaseButton()
    this.active = true
  }

  /** The bank-to-turn stick: a bank of up to 60° from the stick's x, a pull from its y; let go and the wings level. */
  update() {
    this.showPause()
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
    document.documentElement.style.removeProperty('--pt-controls')
  }
}
