// Action-mapped input. Gameplay code asks about *actions* ("fire", "crouch"),
// never about keys, so rebinding or adding a gamepad later touches only the
// binding table.
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

    const prevent = new Set(['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
    window.addEventListener('keydown', (e) => {
      if (prevent.has(e.code)) e.preventDefault()
      if (e.repeat) return
      this.press(e.code)
    })
    window.addEventListener('keyup', (e) => this.release(e.code))
    window.addEventListener('blur', () => {
      for (const c of this.held) this.upEdge.add(c)
      this.held.clear()
    })
    element.addEventListener('mousedown', (e) => {
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
      this.mouseDX += e.movementX
      this.mouseDY += e.movementY
    })
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.el
      if (this.onLockChange) this.onLockChange(this.locked)
    })
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
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.held.has(c)) return true
    return false
  }
  pressed(action) {
    if (!this.enabled) return false
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.downEdge.has(c)) return true
    return false
  }
  released(action) {
    const codes = this.bindings[action]
    if (!codes) return false
    for (const c of codes) if (this.upEdge.has(c)) return true
    return false
  }
  axis(neg, pos) {
    return (this.down(pos) ? 1 : 0) - (this.down(neg) ? 1 : 0)
  }
  // Consume this frame's mouse motion, already scaled to radians.
  look() {
    const dx = this.mouseDX * this.sensitivity
    const dy = this.mouseDY * this.sensitivity * (this.invertY ? -1 : 1)
    this.mouseDX = 0
    this.mouseDY = 0
    return this.enabled ? { dx, dy } : { dx: 0, dy: 0 }
  }
  endFrame() {
    this.downEdge.clear()
    this.upEdge.clear()
  }
}
