// The browser normalizes USB, Bluetooth and wireless-adapter controllers to
// this layout. Never guess raw mappings from a device name: they vary by OS.
export const PAD_BINDINGS = {
  jump: 0, ascend: 0, crouch: 1, descend: 1, reload: 2, interact: 3,
  prevWeapon: 4, nextWeapon: 5, aim: 6, fire: 7, journal: 8,
  pause: 9, sprint: 10, flashlight: 11, map: 12, medkit: 13,
  throwStone: 14, throwFlare: 15,
}

export function stick(x = 0, y = 0, deadzone = 0.18) {
  const length = Math.hypot(x, y)
  if (length <= deadzone) return { x: 0, y: 0 }
  const scale = Math.min(1, (length - deadzone) / (1 - deadzone)) / length
  return { x: x * scale, y: y * scale }
}

export class GamepadInput {
  constructor() {
    this.pad = null
    this.buttons = new Set()
    this.edges = new Set()
    this.blocked = new Set()
    this.actions = new Set()
    this.actionEdges = new Set()
    this.actionReleases = new Set()
    this.move = { x: 0, y: 0 }
    this.turn = { x: 0, y: 0 }
    this.context = null
    this.status = 'Connect an Xbox controller by USB or pair wirelessly, then press a button.'
    this.lookDX = 0
    this.lookDY = 0
    this.seenPad = false
    this.sensitivity = 1
    this.deadzone = 0.18
  }

  poll(dt, { menu = false, vehicle = false, focused = true } = {}) {
    let pads = []
    try {
      if (!navigator.getGamepads) throw new Error('Unavailable')
      pads = Array.from(navigator.getGamepads())
      this.status = 'Connect an Xbox controller by USB or pair wirelessly, then press a button.'
    } catch {
      this.status = 'Controller access unavailable. Open the game directly in a browser over HTTPS or localhost.'
    }
    const available = pads.filter(p => p?.connected && p.mapping === 'standard')
    const previous = this.pad
    this.pad = available.find(p => p.index === previous?.index && p.id === previous?.id) || available[0] || null
    this.disconnected = !!previous && (!this.pad || this.pad.index !== previous.index || this.pad.id !== previous.id)
    if (this.pad) this.status = 'Xbox layout connected · A select · B back · D-pad navigate · right stick scroll'
    else if (pads.some(p => p?.connected)) this.status = 'Controller detected without a standard layout. Try another browser or connection method.'
    const changed = this.pad?.index !== previous?.index || this.pad?.id !== previous?.id
    const buttons = new Set()
    if (focused && this.pad) this.pad.buttons.forEach((b, i) => {
      if (b.pressed || b.value > 0.5) buttons.add(i)
    })
    this.edges = new Set([...buttons].filter(i => !this.buttons.has(i)))
    // Returning focus or reconnecting with A held is not an explicit Resume.
    if (this.context === 'inactive' || (changed && this.seenPad)) this.edges.clear()
    if (this.pad) this.seenPad = true
    const context = !focused ? 'inactive' : menu ? 'menu' : vehicle ? 'vehicle' : 'foot'
    // A held menu button (or a reconnecting trigger) must not become a jump,
    // interaction or shot when gameplay resumes. Re-arm each on release.
    if (context !== this.context || changed) this.blocked = new Set(buttons)
    for (const i of this.blocked) if (!buttons.has(i)) this.blocked.delete(i)
    this.buttons = buttons
    this.context = context
    const actions = new Set()
    if (focused && !menu) {
      for (const [action, i] of Object.entries(PAD_BINDINGS)) {
        if (vehicle && action === 'prevWeapon') continue
        if (buttons.has(i) && !this.blocked.has(i)) actions.add(action)
      }
      if (vehicle && buttons.has(4) && !this.blocked.has(4)) actions.add('camera')
    }
    this.actionEdges = new Set([...actions].filter(a => !this.actions.has(a)))
    this.actionReleases = new Set([...this.actions].filter(a => !actions.has(a)))
    this.actions = actions
    const axes = focused && this.pad ? this.pad.axes : []
    this.move = stick(axes[0], axes[1], this.deadzone)
    this.turn = stick(axes[2], axes[3], this.deadzone)
    this.lookDX = this.turn.x * 2.5 * this.sensitivity * dt
    this.lookDY = this.turn.y * 2.5 * this.sensitivity * dt
    this.active = focused && (buttons.size > 0 || !!(this.move.x || this.move.y || this.turn.x || this.turn.y))
  }

  axis(neg, pos) {
    const values = { left: -this.move.x, right: this.move.x, forward: -this.move.y, back: this.move.y }
    if (!(neg in values) || !(pos in values)) return 0
    return (Math.max(0, values[pos]) - Math.max(0, values[neg]))
  }
}
