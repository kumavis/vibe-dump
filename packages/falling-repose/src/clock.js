// Time, as this piece keeps it. Wall time always runs; everything else is
// derived from a drift rate that breathes, rushes, and every minute or two
// stops nearly dead and runs a little backwards before it lets go again.
//
//   rate    how fast the world moves past (and the music's clock)
//   blur    how fast it *looks* — streak length. It doesn't follow `rate`
//           exactly: in a suspension the motes stop but keep their streaks.
//   story   integrated rate, floored — the body's drift and the hair freeze
//           when time freezes
//   fall    integrated rate × speed — distance fallen

const smooth = (x) => x * x * (3 - 2 * x)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// envelope: ease up over `a`, hold `h`, ease down over `r`
function envelope(t, start, a, h, r) {
  const x = t - start
  if (x <= 0 || x >= a + h + r) return 0
  if (x < a) return smooth(x / a)
  if (x < a + h) return 1
  return 1 - smooth((x - a - h) / r)
}

export const FALL_SPEED = 1.7

export class Clock {
  constructor(start = 0) {
    this.wall = start
    this.story = start * 0.9
    this.fall = start * FALL_SPEED
    this.rate = 1
    this.blur = 1
    this.hold = 0
    this.holding = false
    this.susp = 0
    this.rush = 0
    this.reach = 0
    this.swell = 0
    // A long deterministic schedule of moments. The first suspension comes
    // early enough that someone who stays a minute will meet one.
    const r = rng(1789)
    this.suspensions = []
    this.rushes = []
    let t = 40
    for (let i = 0; i < 400; i++) {
      this.suspensions.push(t)
      const gap = 80 + r() * 55
      this.rushes.push(t + 22 + r() * (gap - 40))
      t += gap
    }
  }

  // one suspension: 5 s to slow, 10 s held, 7 s to let go
  suspensionAt(t) {
    let v = 0
    for (const s of this.suspensions) {
      if (s > t) break
      v = Math.max(v, envelope(t, s, 5, 10, 7))
    }
    return v
  }

  rushAt(t) {
    let v = 0
    for (const s of this.rushes) {
      if (s > t) break
      v = Math.max(v, envelope(t, s, 3.5, 5, 5))
    }
    return v
  }

  // the gesture lags the stillness: the hand only moves once the world has
  reachAt(t) {
    let v = 0
    for (const s of this.suspensions) {
      if (s > t) break
      v = Math.max(v, envelope(t, s + 4, 6, 6, 8))
    }
    return v
  }

  tick(dt, reducedMotion = false) {
    dt = Math.min(dt, 0.1)
    this.wall += dt
    const T = this.wall
    const tau = Math.PI * 2
    const base =
      0.9 + 0.3 * Math.sin((tau * T) / 67) + 0.18 * Math.sin((tau * T) / 31 + 1.3) + 0.08 * Math.sin((tau * T) / 13 + 0.4)

    this.susp = this.suspensionAt(T)
    this.rush = this.rushAt(T)
    this.reach = this.reachAt(T)

    const k = 1 - Math.exp(-dt / 0.6)
    this.hold += ((this.holding ? 1 : 0) - this.hold) * (1 - Math.exp(-dt / (this.holding ? 0.9 : 1.6)))

    const motion = reducedMotion ? 0.45 : 1
    let target = base * (1 + 0.85 * this.rush)
    target = target * (1 - this.susp) + -0.06 * this.susp
    target *= 1 - 0.97 * this.hold
    this.rate += (target * motion - this.rate) * k

    let blurTarget = base * (1 + 1.3 * this.rush)
    blurTarget = blurTarget * (1 - this.susp) + 1.05 * this.susp
    blurTarget *= 1 - 0.45 * this.hold
    this.blur += (blurTarget * motion - this.blur) * k

    this.story += dt * Math.min(1.6, Math.max(0.025, this.rate))
    this.fall += dt * this.rate * FALL_SPEED

    this.swell = clamp01(this.susp * 1.0 + this.hold * 0.5)
  }
}
