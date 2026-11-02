// breath.js — the one breath clock the whole book keys off.
//
// Period 10 s: 4.5 s in, 1 s held full, 4.5 s out. Each half is a half-cosine,
// so the curve and its velocity are continuous everywhere (no corners).
// Spreads never restart it; it only advances while the render loop runs.

export const PERIOD = 10
const IN = 4.5
const HOLD = 1.0
const OUT = 4.5

export class Breath {
  constructor() {
    this.t = 0 // seconds into the current cycle
    this.breath = 0 // 0 empty … 1 full
    this.phase = 'in' // 'in' while filling and holding, 'out' while emptying
    this.vel = 0 // d(breath)/dt, > 0 while breathing in
    this.cycle = 0 // completed cycles
  }

  update(dt) {
    this.t += dt
    while (this.t >= PERIOD) {
      this.t -= PERIOD
      this.cycle++
    }
    const t = this.t
    if (t < IN) {
      const u = t / IN
      this.breath = 0.5 - 0.5 * Math.cos(Math.PI * u)
      this.vel = ((0.5 * Math.PI) / IN) * Math.sin(Math.PI * u)
      this.phase = 'in'
    } else if (t < IN + HOLD) {
      this.breath = 1
      this.vel = 0
      this.phase = 'in'
    } else {
      const u = (t - IN - HOLD) / OUT
      this.breath = 0.5 + 0.5 * Math.cos(Math.PI * u)
      this.vel = -((0.5 * Math.PI) / OUT) * Math.sin(Math.PI * u)
      this.phase = 'out'
    }
    return this
  }
}
