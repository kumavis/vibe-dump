import { GamepadInput } from './gamepad.js'

// Action-mapped input. Gameplay code asks about *actions* ("fire", "crouch"),
// never about keys. Keyboard/mouse bindings and standard gamepad input share
// actions, with analog sticks preserved for movement and look.
//
// Ctrl is deliberately unbound: Ctrl+W would close the tab mid-sneak.

export const DEFAULT_BINDINGS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  crouch: ['KeyC'],
  interact: ['KeyE'],
  reload: ['KeyR'],
  fire: ['Mouse0'],
  aim: ['Mouse2'],
  throwStone: ['KeyG'],
  throwFlare: ['KeyT'],
  medkit: ['KeyH'],
  flashlight: ['KeyF'],
  map: ['KeyM'],
  journal: ['KeyJ', 'Tab'],
  camera: ['KeyV'],
  slot1: ['Digit1'],
  slot2: ['Digit2'],
  slot3: ['Digit3'],
  slot4: ['Digit4'],
  slot5: ['Digit5'],
  slot6: ['Digit6'],
  slot7: ['Digit7'],
  nextWeapon: ['WheelDown'],
  prevWeapon: ['WheelUp'],
  // helicopter
  ascend: ['Space'],
  descend: ['ShiftLeft', 'ShiftRight'],
}

export class Input {
  constructor(element, bindings = DEFAULT_BINDINGS) {
    this.el = element
    this.bindings = bindings
    this.held = new Set()
    this.downEdge = new Set()
    this.upEdge = new Set()
    this.mouseDX = 0
    this.mouseDY = 0
    this.sensitivity = 0.0022
    this.invertY = false
    this.enabled = true
    this.locked = false
    this.onLockChange = null
    this.gamepad = new GamepadInput()
    this.lastDevice = 'keyboard'
    this.focused = document.hasFocus()
    window.addEventListener('focus', () => { this.focused = true })

    const prevent = new Set(['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
    window.addEventListener('keydown', (e) => {
      if (prevent.has(e.code)) e.preventDefault()
      if (e.repeat) return
      this.lastDevice = 'keyboard'
      this.press(e.code)
    })
    window.addEventListener('keyup', (e) => this.release(e.code))
    window.addEventListener('blur', () => {
      this.focused = false
      this.mouseDX = this.mouseDY = 0
      this.downEdge.clear()
      for (const c of this.held) this.upEdge.add(c)
      this.held.clear()
    })
    element.addEventListener('mousedown', (e) => {
      this.lastDevice = 'keyboard'
      this.press('Mouse' + e.button)
    })
    window.addEventListener('mouseup', (e) => this.release('Mouse' + e.button))
    element.addEventListener('contextmenu', (e) => e.preventDefault())
    window.addEventListener(
      'wheel',
      (e) => {
        if (!this.locked) return
        const code = e.deltaY > 0 ? 'WheelDown' : 'WheelUp'
        this.downEdge.add(code)
        this.upEdge.add(code)
      },
      { passive: true },
    )
    window.addEventListener('mousemove', (e) => {
      if (!this.locked) return
      if (e.movementX || e.movementY) this.lastDevice = 'keyboard'
      this.mouseDX += e.movementX
      this.mouseDY += e.movementY
    })
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.el
      if (this.onLockChange) this.onLockChange(this.locked)
    })
  }

  beginFrame(dt, context) {
    this.gamepad.poll(dt, { ...context, focused: this.focused && !document.hidden })
    if (this.gamepad.active) this.lastDevice = 'gamepad'
  }

  press(code) {
    if (!this.held.has(code)) this.downEdge.add(code)
    this.held.add(code)
  }
  release(code) {
    if (this.held.has(code)) this.upEdge.add(code)
    this.held.delete(code)
  }

  lock() {
    if (this.lastDevice === 'gamepad') return
    try {
      const p = this.el.requestPointerLock()
      if (p && p.catch) p.catch(() => {})
    } catch {
      /* headless browsers refuse; the game still runs */
    }
  }
  unlock() {
    if (document.pointerLockElement) document.exitPointerLock()
  }

  down(action) {
    if (!this.enabled) return false
    if (this.gamepad.actions.has(action)) return true
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.held.has(c)) return true
    return false
  }
  pressed(action) {
    if (!this.enabled) return false
    if (this.gamepad.actionEdges.has(action)) return true
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.downEdge.has(c)) return true
    return false
  }
  released(action) {
    if (this.gamepad.actionReleases.has(action)) return true
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.upEdge.has(c)) return true
    return false
  }
  axis(neg, pos) {
    if (!this.enabled) return 0
    const digital = (this.down(pos) ? 1 : 0) - (this.down(neg) ? 1 : 0)
    return Math.max(-1, Math.min(1, digital + this.gamepad.axis(neg, pos)))
  }
  // Consume this frame's mouse motion, already scaled to radians.
  look() {
    const dx = this.mouseDX * this.sensitivity + this.gamepad.lookDX
    const dy = (this.mouseDY * this.sensitivity + this.gamepad.lookDY) * (this.invertY ? -1 : 1)
    this.mouseDX = 0
    this.mouseDY = 0
    this.gamepad.lookDX = this.gamepad.lookDY = 0
    return this.enabled ? { dx, dy } : { dx: 0, dy: 0 }
  }
  endFrame() {
    this.downEdge.clear()
    this.upEdge.clear()
    this.mouseDX = this.mouseDY = 0
    this.gamepad.lookDX = this.gamepad.lookDY = 0
  }
}
