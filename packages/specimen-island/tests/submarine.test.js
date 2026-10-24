import test from 'node:test'
import assert from 'node:assert/strict'
import { ballastStep, floatKeel, heave, submergedShare } from '../src/vehicles/ballast.js'
import { SUB } from '../src/data/vehicles.js'

// The submersible's vertical model as Submarine.drive runs it: the pilot's
// command (+1 Space, -1 Shift, 0 let go) moves the ballast, which trims back
// to neutral under water and to `float` once she is breaking the surface.
function dive({ y, vy = 0, b = 0, cmd = () => 0, seconds, dt = 1 / 60, surface = 0, track }) {
  const st = { y, vy }
  for (let i = 0, n = Math.round(seconds / dt); i < n; i++) {
    const share = submergedShare(st.y, surface, SUB.float)
    b = ballastStep(b, cmd(i * dt, share), dt, SUB.ballast, share < 0.995 ? SUB.ballast.float : 0)
    heave(st, b, surface, dt, SUB)
    track?.(st, b)
  }
  return { ...st, b, share: submergedShare(st.y, surface, SUB.float) }
}

test('the ballast trims back to rest when let go, and clamps', () => {
  const B = SUB.ballast
  assert.equal(ballastStep(0.5, 0, 1, B), 0)
  assert.ok(Math.abs(ballastStep(-0.3, 0, 0.1, B) - (-0.3 + B.trim * 0.1)) < 1e-12)
  assert.equal(ballastStep(0.9, 1, 1, B), 1)
  assert.equal(ballastStep(-0.9, -1, 1, B), -1)
  assert.equal(ballastStep(0, 0, 5, B, B.float), B.float)
})

test('neutral, she holds her depth', () => {
  const end = dive({ y: -10, seconds: 30 })
  assert.ok(Math.abs(end.y + 10) < 1e-9)
  assert.ok(Math.abs(end.vy) < 1e-9)
})

test('flooding dives and blowing climbs, both at a bounded rate', () => {
  let low = 0
  dive({ y: -5, cmd: () => -1, seconds: 20, track: (s) => (low = Math.min(low, s.vy)) })
  assert.ok(low < -1 && low > -1.7, `dives at ${low}`)
  let high = 0
  dive({ y: -25, cmd: () => 1, seconds: 12, surface: 0, track: (s) => (high = Math.max(high, s.vy)) })
  assert.ok(high > 1 && high < 1.7, `climbs at ${high}`)
})

test('letting go after a dive, she trims neutral and stops', () => {
  const at20 = dive({ y: -5, cmd: (t) => (t < 2 ? -1 : 0), seconds: 20 })
  const at40 = dive({ y: -5, cmd: (t) => (t < 2 ? -1 : 0), seconds: 40 })
  assert.equal(at20.b, 0)
  assert.ok(Math.abs(at20.vy) < 0.01)
  assert.ok(at20.y < -6 && at20.y > -12, `stopped at ${at20.y}`)
  assert.ok(Math.abs(at40.y - at20.y) < 0.01)
})

test('she cannot leave the water: blown from deep or dropped from above, she floats', () => {
  const keel = floatKeel(0, 1, SUB)
  let top = -Infinity
  const up = dive({ y: -20, cmd: () => 1, seconds: 60, track: (s) => (top = Math.max(top, s.y)) })
  assert.ok(Math.abs(up.y - keel) < 0.02, `floats at ${up.y}, expected ${keel}`)
  assert.ok(top < 0 - SUB.float.y0, 'the float body never comes clear of the water')
  const dropped = dive({ y: 3, cmd: () => 1, seconds: 30 })
  assert.ok(Math.abs(dropped.y - keel) < 0.02)
  assert.ok(dropped.share > 0.7 && dropped.share < 0.9)
})

test('let go breaking the surface, the tanks stay blown and she rides high', () => {
  // blow until she breaks the surface, then let go
  let broke = false
  const end = dive({ y: -12, cmd: (t, share) => (broke ||= share < 0.99) ? 0 : 1, seconds: 40 })
  assert.equal(end.b, SUB.ballast.float)
  assert.ok(end.share < 1)
  assert.ok(Math.abs(end.y - floatKeel(0, SUB.ballast.float, SUB)) < 0.02)
  // the pilot's eye in the bubble is clear of the swell
  assert.ok(end.y + SUB.seat[1] > 0.3)
})

test('the depth model does not depend on the frame rate', () => {
  const scenario = (dt) => dive({ y: -5, cmd: (t) => (t < 3 ? -1 : t < 6 ? 0 : t < 9 ? 1 : 0), seconds: 15, dt })
  const a = scenario(1 / 30)
  const b = scenario(1 / 120)
  assert.ok(Math.abs(a.y - b.y) < 0.05, `${a.y} vs ${b.y}`)
})
