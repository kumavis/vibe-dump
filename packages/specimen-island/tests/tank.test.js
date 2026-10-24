import test from 'node:test'
import assert from 'node:assert/strict'
import { skidSteer, trackSpeeds, hullMotion, approach } from '../src/vehicles/tracks.js'
import { launchAngle, arcHeight, flightTime, layGun } from '../src/vehicles/gunnery.js'
import { TANK } from '../src/data/vehicles.js'
import { wrapAngle } from '../src/core/mathx.js'

const gun = TANK.gun
const half = TANK.track.x

test('skid steering turns on the spot and drives straight with equal tracks', () => {
  const pivot = skidSteer(0, 1, TANK.top.road, TANK)
  assert.equal(pivot.forward, 0)
  assert.ok(pivot.yawRate > 0, 'steer left turns left')
  const { left, right } = trackSpeeds(pivot.forward, pivot.yawRate, half)
  assert.ok(left < 0 && right > 0 && Math.abs(left + right) < 1e-12, 'the tracks run against each other')
  const ahead = skidSteer(1, 0, TANK.top.road, TANK)
  const t = trackSpeeds(ahead.forward, ahead.yawRate, half)
  assert.equal(t.left, t.right)
  assert.equal(t.left, TANK.top.road)
})

test('the turn is gentler at speed, mirrored, and keeps its sense in reverse', () => {
  const still = skidSteer(0, 1, TANK.top.road, TANK).yawRate
  const fast = skidSteer(1, 1, TANK.top.road, TANK).yawRate
  assert.ok(fast < still && fast > 0)
  assert.ok(Math.abs(fast - still * (1 - TANK.turn.speedLoss)) < 1e-12)
  assert.equal(skidSteer(0.6, -0.5, 9, TANK).yawRate, -skidSteer(0.6, 0.5, 9, TANK).yawRate)
  const back = skidSteer(-1, 1, TANK.top.road, TANK)
  assert.equal(back.forward, -TANK.top.reverse)
  assert.ok(back.yawRate > 0)
})

test('belt speeds and hull motion round-trip', () => {
  for (const [f, w] of [[3, 0.4], [-2, -0.3], [0, 0.62], [11, 0]]) {
    const { left, right } = trackSpeeds(f, w, half)
    const m = hullMotion(left, right, half)
    assert.ok(Math.abs(m.forward - f) < 1e-12 && Math.abs(m.yawRate - w) < 1e-12)
  }
  assert.equal(approach(0, 5, 2), 2)
  assert.equal(approach(4, 5, 2), 5)
  assert.equal(approach(0, -5, 2), -2)
})

test('the fire-control elevation lands the shell on the point', () => {
  for (const [d, dh] of [[50, 0], [300, 12], [600, -20], [120, 30]]) {
    const a = launchAngle(d, dh, gun.muzzle, gun.gravity)
    assert.ok(a !== null)
    assert.ok(Math.abs(arcHeight(d, a, gun.muzzle, gun.gravity) - dh) < 1e-6, `lands on (${d}, ${dh})`)
    // the flatter solution: never the lob
    assert.ok(a < Math.PI / 4)
  }
  // a step-through simulation agrees with the closed form
  const d = 400
  const a = launchAngle(d, 0, gun.muzzle, gun.gravity)
  let x = 0, y = 0, vx = gun.muzzle * Math.cos(a), vy = gun.muzzle * Math.sin(a)
  const dt = 1 / 240
  while (x < d) {
    vy -= gun.gravity * dt
    x += vx * dt
    y += vy * dt
  }
  assert.ok(Math.abs(y) < 0.1, `simulated drop at ${d} m: ${y.toFixed(3)}`)
  assert.ok(Math.abs(flightTime(d, a, gun.muzzle) - x / vx) < 0.01)
  assert.equal(launchAngle(1e5, 0, gun.muzzle, gun.gravity), null, 'out of reach')
})

test('the turret slews the short way at its traverse rate and the gun stays in its limits', () => {
  const dt = 0.1
  const r = layGun(3.0, 0, -3.0, 0, dt, gun)
  // from +3.0 to -3.0 rad the short way is up through +PI, one step's worth
  assert.ok(r.yaw > 3.0 || r.yaw < -3.0)
  assert.ok(Math.abs(wrapAngle(r.yaw - 3.0) - gun.traverse * dt) < 1e-9)
  let e = 0
  for (let i = 0; i < 100; i++) e = layGun(0, e, 0, 2, dt, gun).elev
  assert.equal(e, gun.raise)
  for (let i = 0; i < 100; i++) e = layGun(0, e, 0, -2, dt, gun).elev
  assert.equal(e, gun.depress)
  const near = layGun(0.2, 0.1, 0.21, 0.105, dt, gun)
  assert.ok(Math.abs(near.yaw - 0.21) < 1e-12)
  assert.ok(Math.abs(near.elev - 0.105) < 1e-12)
})
