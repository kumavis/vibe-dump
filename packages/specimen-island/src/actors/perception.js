import { wrapAngle, yawTo } from '../core/mathx.js'

// What one animal knows. `awareness` is how sure it is that a person is nearby:
//   < 0.35  oblivious      0.35..1  suspicious (looks, investigates)
//   >= 1    detected — the temperament decides what happens next
// Sight is gated by field of view, line of sight and the player's visibility;
// hearing reads the noise bus; scent works only downwind. Other animals are
// noticed plainly (no stealth between dinosaurs).
//
// A motion hunter (senses.motion > 1) sees only movement: a player who holds
// still is invisible to it unless it all but walks into them, and once it
// has had no fix on them for LOSE s it has lost them (lost()) and the brain
// casts about where it last saw them move.

// Awareness below this: the animal has not noticed anyone (photos and scans
// of an unaware animal earn a bonus).
export const OBLIVIOUS = 0.35

// How long a movement lingers in a motion hunter's eye, so a stop mid-stride
// is a stop a beat later; and how long it goes without a fix (sight, or its
// ears or nose within a lunge) before it has lost the player.
export const SETTLE = 0.3
export const LOSE = 0.6

// How a motion hunter's eye weighs the player: `motion` times over while
// they move (or have just stopped); not at all once they have held still,
// unless they are within `still` m of its flank — so close it is all but
// treading on them. Anything else sees movement and stillness alike.
export function motionSight(S, stillFor, flank) {
  if (!(S.motion > 1)) return 1
  if (stillFor < SETTLE) return S.motion
  return flank < S.still ? 1 : 0
}

const _heard = []
const _vehicleEye = { x: 0, y: 0, z: 0 }
// Where an animal looks for someone in a vehicle: its cab, not its wheels.
function vehicleEye(v) {
  _vehicleEye.x = v.pos.x
  _vehicleEye.y = v.pos.y + 1.4
  _vehicleEye.z = v.pos.z
  return _vehicleEye
}

export class Perception {
  constructor(creature, rng) {
    this.c = creature
    this.awareness = 0
    this.lastKnown = null // {x, y, z}
    this.lastSeen = -99
    this.lastFix = -99 // last time it had the player exactly: in sight, heard or nosed out close by
    this.sees = false
    this.timer = rng.range(0, 0.25)
    this.lastHeard = 0
    this.heardT = -99 // when it last heard anything worth turning to
    this.threat = null // predator creature it is afraid of
    this.prey = null // creature it wants to eat
    this.distractedBy = null
    this.everDetected = false
  }

  update(dt, G) {
    this.timer -= dt
    if (this.timer > 0) return
    const step = 0.22 + Math.random() * 0.06
    const tdt = step - this.timer
    this.timer = step
    this.sense(tdt, G)
  }

  sense(dt, G) {
    const c = this.c
    const sp = c.sp
    const S = sp.senses
    const eye = c.eyePos()
    let stimulus = false
    this.sees = false
    // a motion hunter hunts by ear and nose where its eyes fail: within a
    // lunge of it, a sound or a whiff has the player as surely as sight would
    const lunge = S.motion > 1 ? c.radius + (sp.attack?.range ?? 2) : 0

    // --- the player (or the vehicle they are in)
    const piloting = G.vehicle
    const target = piloting ? vehicleEye(piloting) : G.player.eye
    const dx = target.x - eye.x
    const dy = target.y - eye.y
    const dz = target.z - eye.z
    const d = Math.hypot(dx, dy, dz)
    const range = S.sight * (0.45 + 0.55 * G.sky.light) * ((piloting ? piloting.lights : G.player.flashlight) ? 1.3 : 1)
    if (d < range && G.player.alive) {
      const look = c.yaw + c.anim.s.lookYaw
      const ang = Math.abs(wrapAngle(yawTo(eye.x, eye.z, target.x, target.z) - look))
      const inFov = ang < ((S.fov / 2) * Math.PI) / 180 || d < 2.5
      if (inFov && G.physics.lineOfSight(eye.x, eye.y, eye.z, target.x, target.y - (piloting ? 0 : 0.4), target.z)) {
        let vis = G.stealth.visibility
        // a motion hunter sees a vehicle whatever it does, and a person only moving
        if (!piloting) vis *= motionSight(S, G.stealth.still, Math.hypot(target.x - c.pos.x, target.z - c.pos.z) - c.radius)
        const falloff = Math.pow(1 - d / range, 0.7)
        let rate = vis * falloff * 2.4
        if (d < 4) rate *= 3
        if (rate > 0.05) {
          this.awareness += rate * dt
          stimulus = true
          if (this.awareness > 0.6) {
            this.sees = true
            this.lastSeen = this.lastFix = G.time
            this.lastKnown = { x: target.x, y: target.y, z: target.z }
          } else if (!this.lastKnown || this.awareness > 0.3) {
            this.lastKnown = { x: target.x + (Math.random() - 0.5) * 6, y: target.y, z: target.z + (Math.random() - 0.5) * 6 }
          }
        }
      }
    }

    // --- hearing
    const heard = G.stealth.heardSince(this.lastHeard, c.pos.x, c.pos.z, S.hearing, _heard)
    this.lastHeard = G.time
    for (const h of heard) {
      if (h.n.creature === c) continue
      const fromPlayer = h.n.source === 'player'
      const gain = h.strength * (h.n.radius > 60 ? 1.6 : 0.7)
      if (fromPlayer) this.awareness += gain
      else this.awareness = Math.min(0.85, Math.max(this.awareness, OBLIVIOUS) + gain * 0.8)
      const err = h.d * 0.08
      this.lastKnown = { x: h.n.x + (Math.random() - 0.5) * err, y: h.n.y, z: h.n.z + (Math.random() - 0.5) * err }
      if (!fromPlayer) this.distractedBy = { ...this.lastKnown, t: G.time }
      else if (h.d < lunge) this.lastFix = G.time // a shot or a step right under its head
      this.heardT = G.time
      stimulus = true
    }

    // --- scent (downwind only, but for an eddy right round it)
    if (!piloting && G.player.alive) {
      const p = G.player.pos
      const scent = G.stealth.scentAt(c.pos.x, c.pos.z, 40 * S.smell, S.eddy)
      if (scent > 0) {
        this.awareness += scent * 0.35 * S.smell * dt
        if (this.awareness > 0.4) this.lastKnown = { x: p.x + (Math.random() - 0.5) * 10, y: p.y, z: p.z + (Math.random() - 0.5) * 10 }
        if (this.awareness > 0.6 && Math.hypot(p.x - c.pos.x, p.z - c.pos.z) < lunge) {
          this.lastFix = G.time
          this.lastKnown = { x: p.x, y: p.y, z: p.z }
        }
        stimulus = true
      }
    }

    if (!stimulus) this.awareness -= dt * (this.awareness > 1 ? 0.05 : 0.09)
    this.awareness = Math.max(0, Math.min(2, this.awareness))
    if (this.awareness >= 1 && !this.everDetected) {
      this.everDetected = true
      c.rec.spotted = true
      G.events.emit('creature:detected', { creature: c })
    }

    // --- other animals
    this.threat = null
    this.prey = null
    let bestPrey = Infinity
    for (const o of G.ecology.active) {
      if (o === c || !o.vitals.alive) continue
      const od = Math.hypot(o.pos.x - c.pos.x, o.pos.z - c.pos.z)
      if (od > S.sight) continue
      if (o.sp.prey && o.sp.prey.includes(sp.id) && o.vitals.conscious && od < 45 && (o.brain.state === 'hunt' || o.brain.state === 'attack' || od < 14)) {
        this.threat = o
      }
      if (sp.prey && sp.prey.includes(o.sp.id) && od < bestPrey) {
        bestPrey = od
        this.prey = o
      }
    }
  }

  // Has a motion hunter lost the player: no fix on them for LOSE s, because
  // they froze or got out of its sight? (A vehicle it never loses.)
  lost(G) {
    return this.c.sp.senses.motion > 1 && !G.vehicle && G.time - this.lastFix > LOSE
  }

  alertTo(pos, level = 1) {
    this.awareness = Math.max(this.awareness, level)
    this.lastKnown = { x: pos.x, y: pos.y, z: pos.z }
  }
}
