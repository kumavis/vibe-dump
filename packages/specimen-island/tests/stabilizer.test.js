import test from 'node:test'
import assert from 'node:assert/strict'
import { stabilizedLean } from '../src/vehicles/stabilizer.js'
import { MOTORBIKE } from '../src/data/vehicles.js'
const tune = MOTORBIKE.stabilizer
const simulate = (lean, speed, yaw, seconds, dt) => {
  for (let i = 0; i < Math.round(seconds / dt); i++) lean = stabilizedLean(lean, speed, yaw, dt, tune)
  return lean
}

test('stabilizer balances at rest and levels out after a turn', () => {
  assert.equal(stabilizedLean(0, 0, 5, 1 / 60, tune), 0)
  assert.ok(Math.abs(simulate(0.38, 0, 0, 2, 1 / 60)) < 0.00001)
  assert.ok(Math.abs(simulate(-0.38, 15, 0, 2, 1 / 60)) < 0.00001)
})
test('banks into both directions and caps aggressive high-speed turns', () => {
  const left = simulate(0, 10, 0.6, 1, 1 / 60)
  const right = simulate(0, 10, -0.6, 1, 1 / 60)
  assert.ok(left > 0 && right < 0)
  assert.ok(Math.abs(left + right) < 1e-12)
  assert.ok(Math.abs(simulate(0, 100, 100, 10, 1 / 30)) <= tune.maxLean)
})
test('balance response is frame-rate independent and recovers a disturbance', () => {
  const a = simulate(0.2, 8, -0.2, 1, 1 / 30)
  const b = simulate(0.2, 8, -0.2, 1, 1 / 120)
  assert.ok(Math.abs(a - b) < 1e-12)
  assert.ok(Math.abs(simulate(1.3, 0, 0, 2, 1 / 60)) < 0.00001)
})
