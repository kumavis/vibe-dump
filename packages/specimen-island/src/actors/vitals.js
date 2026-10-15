import { clamp } from '../core/mathx.js'

// Health and sedation for one animal. Darts don't act instantly: dose enters a
// pending pool and is absorbed over a few seconds, so a darted animal can still
// reach you before it drops. Sedative clears at the species' metabolic rate.
//
//   sedative < 0.35 ko         unaffected (but it felt the sting)
//   0.35 ko .. ko              drowsy — slows, stumbles
//   >= ko                      unconscious until it falls back under 0.6 ko
//   >= lethal                  overdose: dead
//
// The record (`rec`) is the persistent part that survives the animal being
// unloaded when the player walks away.

export const STATE = { OK: 'ok', DROWSY: 'drowsy', OUT: 'unconscious', DEAD: 'dead' }

// One step of absorption and clearance on { sedative, pending }. Pending dose
// soaks in at 55%/s (never slower than 5% of the knockout dose per second)
// while the absorbed sedative clears at the species' metabolic rate. The dart
// readout (ui/dose.js) runs this same step forward to predict where a dose
// will peak, so the two can never disagree.
export function absorb(sed, r, dt) {
  if (r.pending > 0) {
    const take = Math.min(r.pending, Math.max(sed.ko * 0.05, r.pending * 0.55) * dt)
    r.pending -= take
    r.sedative += take
  }
  r.sedative = Math.max(0, r.sedative - sed.metab * dt)
}

export class Vitals {
  constructor(species, rec) {
    this.sp = species
    this.rec = rec
    rec.health ??= species.health
    rec.sedative ??= 0
    rec.pending ??= 0
    rec.state ??= STATE.OK
    this.events = []
  }
  get state() {
    return this.rec.state
  }
  get alive() {
    return this.rec.state !== STATE.DEAD
  }
  get conscious() {
    return this.rec.state === STATE.OK || this.rec.state === STATE.DROWSY
  }
  // fraction of the knockout dose, including what is still absorbing
  get sedation() {
    return this.rec.sedative / this.sp.sedation.ko
  }
  get projected() {
    return (this.rec.sedative + this.rec.pending) / this.sp.sedation.ko
  }
  get speedMul() {
    const r = this.rec
    if (r.state === STATE.OUT || r.state === STATE.DEAD) return 0
    const s = this.sedation
    if (s < 0.35) return 1
    return clamp(1 - (s - 0.35) * 0.95, 0.3, 1)
  }

  dose(amount) {
    if (!this.alive) return
    this.rec.pending += amount
  }
  damage(amount) {
    if (!this.alive) return
    this.rec.health -= amount
    if (this.rec.health <= 0) this.die('weapon')
  }
  die(cause) {
    if (this.rec.state === STATE.DEAD) return
    this.rec.state = STATE.DEAD
    this.rec.cause = cause
    this.events.push({ type: 'died', cause })
  }

  // Advance `dt` seconds. Returns nothing; transitions land in this.events.
  update(dt) {
    const r = this.rec
    if (r.state === STATE.DEAD) return
    const sed = this.sp.sedation
    absorb(sed, r, dt)
    if (r.sedative >= sed.lethal) {
      this.die('overdose')
      return
    }
    const s = r.sedative / sed.ko
    if (r.state === STATE.OUT) {
      if (s < 0.6 && r.pending <= 0) {
        r.state = STATE.DROWSY
        this.events.push({ type: 'woke' })
      }
    } else if (s >= 1) {
      r.state = STATE.OUT
      this.events.push({ type: 'ko' })
    } else {
      r.state = s >= 0.35 ? STATE.DROWSY : STATE.OK
    }
  }

  // Fast-forward while unloaded; returns the transitions that happened.
  simulate(seconds) {
    let left = Math.min(seconds, 1200)
    while (left > 0) {
      const step = Math.min(1, left)
      this.update(step)
      left -= step
    }
    return this.events.splice(0)
  }
}
