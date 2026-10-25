import { clamp, lerp } from '../core/mathx.js'

// The player's side of stealth: how visible they are right now, plus the
// short-lived noise events every creature's hearing reads. Visibility folds in
// stance, movement, the cover grid under the player, daylight and the
// flashlight — the HUD eye shows exactly this number.

export class Stealth {
  constructor(G) {
    this.G = G
    this.noises = []
    this.visibility = 1
    this.cover = 0
    this.moving = 0
    this.lastLoud = -99
    this.playerNoise = 0 // radius of the player's most recent noise, decays
    G.events.on('noise', (n) => {
      this.noises.push({ ...n, t: G.time })
      if (n.source === 'player') {
        this.playerNoise = Math.max(this.playerNoise, n.radius)
        if (n.radius > 60) this.lastLoud = G.time
      }
    })
  }

  update(dt) {
    const G = this.G
    const now = G.time
    while (this.noises.length && now - this.noises[0].t > 1.0) this.noises.shift()
    this.playerNoise = Math.max(0, this.playerNoise - dt * 30)
    const p = G.player
    // in a vehicle you are about as subtle as a brass band
    if (G.vehicle) {
      this.visibility = G.vehicle.visibility
      this.cover = 0
      this.moving = 1
      return
    }
    const crouch = p.crouching
    const speed = Math.hypot(p.vel.x, p.vel.z)
    this.moving = speed
    const stance = crouch ? 0.45 : 1
    const motion = speed < 0.3 ? 0.55 : speed < 2.6 ? 0.8 : speed < 5 ? 1.05 : 1.4
    const groundCover = G.island.coverAt(p.pos.x, p.pos.z)
    const indoors = G.physics.ceilingAt(p.pos.x, p.pos.z, p.pos.y + 1) < p.pos.y + 6 ? 0.35 : 0
    const inWater = p.swimming ? 0.3 : 0
    this.cover = clamp(groundCover * (crouch ? 1 : 0.35) + indoors + inWater, 0, 0.92)
    let light = lerp(0.35, 1, G.sky.light)
    if (p.flashlight) light = Math.max(light, 0.95)
    const flash = now - this.lastLoud < 1.5 ? 0.7 : 0
    this.visibility = clamp(stance * motion * (1 - this.cover) * light + flash, 0.02, 1.8)
  }

  // Noises a listener at (x, z) could have heard since time `since`.
  heardSince(since, x, z, hearing, out) {
    out.length = 0
    for (const n of this.noises) {
      if (n.t <= since) continue
      const d = Math.hypot(n.x - x, n.z - z)
      const R = n.radius * hearing
      if (d < R) out.push({ n, strength: 1 - d / R, d })
    }
    return out
  }

  // Is (x, z) downwind of the player, and how strongly?
  scentAt(x, z, range) {
    const G = this.G
    const p = G.player.pos
    const dx = x - p.x
    const dz = z - p.z
    const d = Math.hypot(dx, dz)
    if (d > range || d < 0.01) return d < 4 ? 1 : 0
    const w = G.wind
    const align = (dx * w.x + dz * w.z) / d
    if (align < 0.55) return d < 6 ? 0.5 : 0
    return (align - 0.55) / 0.45 * (1 - d / range) * w.strength
  }
}
