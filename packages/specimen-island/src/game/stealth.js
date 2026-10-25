import { clamp, lerp } from '../core/mathx.js'

// The player's side of stealth: how visible they are right now, plus the
// short-lived noise events every creature's hearing reads. Visibility folds in
// stance, movement, the cover grid under the player, daylight and the
// flashlight — the HUD eye shows exactly this number.

// Body movement, as a motion hunter's eye takes it (Perception): walking,
// crouch-walking, wading or swimming, a jump or a fall, dropping into a crouch
// or rising out of one, going up a ladder. Turning the head or the aim is not.
// Speeds in m/s (crouch-walking is 1.9, 1.1 aiming); `stance` is how fast the
// eye height changes; `shift` how far the player went in one frame, which a
// ladder (Player.teleport) does all at once.
export const bodyMoving = ({ speed, climb = 0, stance = 0, shift = 0 }) => speed > 0.3 || Math.abs(climb) > 0.6 || Math.abs(stance) > 0.3 || shift > 1

export class Stealth {
  constructor(G) {
    this.G = G
    this.noises = []
    this.visibility = 1
    this.cover = 0
    this.moving = 0
    // seconds the player has held still (bodyMoving, and no weapon fired)
    this.still = 0
    this.lastHeight = 0
    this.lastPos = { x: 0, y: 0, z: 0 }
    this.fired = -99
    this.lastLoud = -99
    this.playerNoise = 0 // radius of the player's most recent noise, decays
    G.events.on('noise', (n) => {
      this.noises.push({ ...n, t: G.time })
      if (n.source === 'player') {
        this.playerNoise = Math.max(this.playerNoise, n.radius)
        if (n.radius > 60) this.lastLoud = G.time
      }
    })
    // a shot or a jab is a movement too: the arm, the kick, the flash
    G.events.on('weapon:fired', () => (this.fired = G.time))
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
      this.still = 0
      return
    }
    const crouch = p.crouching
    const speed = Math.hypot(p.vel.x, p.vel.z)
    this.moving = speed
    const rise = (p.height - this.lastHeight) / Math.max(dt, 1e-4)
    const L = this.lastPos
    const shift = Math.hypot(p.pos.x - L.x, p.pos.y - L.y, p.pos.z - L.z)
    this.lastHeight = p.height
    L.x = p.pos.x
    L.y = p.pos.y
    L.z = p.pos.z
    const moved = bodyMoving({ speed, climb: p.vel.y, stance: rise, shift }) || now - this.fired < 0.2
    this.still = moved ? 0 : this.still + dt
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

  // Is (x, z) downwind of the player, and how strongly? Within `eddy` m the
  // scent reaches it whatever the wind.
  scentAt(x, z, range, eddy = 6) {
    const G = this.G
    const p = G.player.pos
    const dx = x - p.x
    const dz = z - p.z
    const d = Math.hypot(dx, dz)
    if (d > range || d < 0.01) return d < 4 ? 1 : 0
    const w = G.wind
    const align = (dx * w.x + dz * w.z) / d
    if (align < 0.55) return d < eddy ? 0.5 : 0
    return (align - 0.55) / 0.45 * (1 - d / range) * w.strength
  }
}
