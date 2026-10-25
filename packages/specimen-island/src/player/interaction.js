// Anything the player can press E on. Structures register lockers, generators
// and ladders here; the science system registers procedures on downed animals.
// The nearest usable thing in front of the camera gets the prompt.
//
// An interactable:
//   { id, x, y, z, radius, label(G) -> string, hold (s), enabled(G) -> true | 'reason',
//     onUse(G), once, dynamic: () => {x, y, z} }

export class Interaction {
  constructor(G) {
    this.G = G
    this.items = new Map()
    this.dynamic = [] // providers: (G) => [interactable...]
    this.current = null
    this.progress = 0
    this.holding = false
  }
  add(it) {
    it.radius ??= 2.2
    it.hold ??= 0
    it.y ??= 0
    this.items.set(it.id, it)
    return it
  }
  remove(id) {
    this.items.delete(id)
  }
  get(id) {
    return this.items.get(id)
  }
  addProvider(fn) {
    this.dynamic.push(fn)
  }

  // Pick what the player is looking at, advance any hold, fire onUse.
  update(dt, eye, look, pressed, held) {
    const G = this.G
    let best = null
    let bestScore = Infinity
    const consider = (it) => {
      const p = it.dynamic ? it.dynamic() : it
      const dx = p.x - eye.x
      const dy = p.y - eye.y
      const dz = p.z - eye.z
      const d = Math.hypot(dx, dy, dz)
      if (d > it.radius + 0.6) return
      const facing = (dx * look.x + dy * look.y + dz * look.z) / (d || 1)
      if (d > 1.2 && facing < 0.55) return
      const score = d * (2 - facing)
      if (score < bestScore) {
        bestScore = score
        best = it
      }
    }
    for (const it of this.items.values()) consider(it)
    for (const fn of this.dynamic) for (const it of fn(G)) consider(it)

    if (best !== this.current) {
      this.current = best
      this.progress = 0
    }
    if (!best) {
      this.holding = false
      return
    }
    const ok = best.enabled ? best.enabled(G) : true
    if (ok !== true) {
      this.holding = false
      this.progress = 0
      return
    }
    if (best.hold > 0) {
      this.holding = held
      if (held) {
        this.progress += dt / best.hold
        if (this.progress >= 1) {
          this.progress = 0
          this.fire(best)
        }
      } else this.progress = Math.max(0, this.progress - dt * 2)
    } else if (pressed) this.fire(best)
  }

  fire(it) {
    it.onUse(this.G)
    if (it.once) this.items.delete(it.id)
    this.current = null
  }

  // What the HUD should say about the current target.
  prompt() {
    const it = this.current
    if (!it) return null
    const ok = it.enabled ? it.enabled(this.G) : true
    const label = typeof it.label === 'function' ? it.label(this.G) : it.label
    return { label, blocked: ok === true ? null : ok, hold: it.hold, progress: this.progress }
  }
}
