import test from 'node:test'
import assert from 'node:assert/strict'
import { flyMissile, track, seekerSignal, closestApproach, bodyHeat } from '../src/game/guidance.js'
import { MISSILES, SEEKER, HEAT } from '../src/data/missiles.js'

const M = MISSILES.heatseeker
const unit = (x, y, z) => {
  const l = Math.hypot(x, y, z)
  return { x: x / l, y: y / l, z: z / l }
}

// Fly one missile from `from` (launched along `dir`, inheriting `vel`) at a
// point target moving at constant `tVel`; return the closest it came, when,
// and how long the fuse took to trip (null if it never did).
function engage({ from, vel = { x: 0, y: 0, z: 0 }, dir, target, tVel, radius = 1.5, dt = 1 / 60 }) {
  const m = { pos: { ...from }, vel: { ...vel }, dir: { ...dir }, speed: 0, age: 0, lit: false }
  m.vel.y -= M.eject
  const t = { ...target }
  let best = Infinity
  let fused = null
  while (m.age < M.life && fused === null) {
    const r0 = { x: m.pos.x - t.x, y: m.pos.y - t.y, z: m.pos.z - t.z }
    flyMissile(m, M, dt, { pos: t, vel: tVel })
    t.x += tVel.x * dt
    t.y += tVel.y * dt
    t.z += tVel.z * dt
    const r1 = { x: m.pos.x - t.x, y: m.pos.y - t.y, z: m.pos.z - t.z }
    const { d } = closestApproach(r0, r1)
    best = Math.min(best, d)
    if (m.age > M.arm && d < M.fuse + radius) fused = m.age
  }
  return { best, fused }
}

test('a locked missile runs down a target moving at constant velocity within its flight time', () => {
  const cases = [
    // a herd animal running across the line of fire, 400 m out and below a hovering gunship
    { from: { x: 0, y: 90, z: 0 }, target: { x: -40, y: 2, z: -400 }, tVel: { x: 14, y: 0, z: 0 } },
    // the same, launched from a gunship doing 50 m/s at it
    { from: { x: 0, y: 60, z: 0 }, vel: { x: 0, y: 0, z: -50 }, target: { x: 30, y: 2, z: -600 }, tVel: { x: -12, y: 0, z: 4 } },
    // a jeep fleeing flat out, nearly tail-on
    { from: { x: 0, y: 40, z: 0 }, target: { x: 10, y: 1, z: -250 }, tVel: { x: 3, y: 0, z: -20 } },
    // and a crossing target off to the side of the boresight
    { from: { x: 0, y: 120, z: 0 }, target: { x: 150, y: 0, z: -320 }, tVel: { x: -18, y: 0, z: 0 } },
  ]
  for (const c of cases) {
    const dir = unit(c.target.x - c.from.x, c.target.y - c.from.y, c.target.z - c.from.z)
    const r = engage({ ...c, dir })
    assert.ok(r.fused !== null, `fuse never tripped (closest ${r.best.toFixed(1)} m)`)
    assert.ok(r.fused < M.life, `hit at ${r.fused}s, life ${M.life}s`)
  }
})

test('an unguided missile flies straight off the rail and misses a crossing target', () => {
  const from = { x: 0, y: 90, z: 0 }
  const target = { x: -40, y: 2, z: -400 }
  const tVel = { x: 14, y: 0, z: 0 }
  const m = { pos: { ...from }, vel: { x: 0, y: -M.eject, z: 0 }, dir: unit(target.x, target.y - 90, target.z), speed: 0, age: 0, lit: false }
  const start = { ...m.dir }
  let t = 0
  while (m.age + 1 / 60 < M.drop + M.motor.burn) {
    flyMissile(m, M, 1 / 60, null)
    t += 1 / 60
  }
  // no guidance: the nose has not moved off the launch line while the motor burns
  assert.ok(Math.abs(m.dir.x - start.x) + Math.abs(m.dir.y - start.y) + Math.abs(m.dir.z - start.z) < 1e-9)
  assert.ok(m.speed > 200, 'the motor brings it up to speed')
  // nor does it chase: the target has moved on by the time it gets there
  assert.ok(Math.abs(m.pos.x - (target.x + tVel.x * t)) > 5 || m.pos.z > target.z)
})

test('the seeker only acquires sources inside its cone, in range and in sight', () => {
  const origin = { x: 0, y: 50, z: 0 }
  const axis = unit(0, -0.2, -1)
  const ahead = { ref: 'ahead', x: 0, y: 50 - 0.2 * 200, z: -200, heat: 3 }
  const wide = { ref: 'wide', x: 200 * Math.sin(SEEKER.cone * 1.3), y: 10, z: -200, heat: 30 }
  const far = { ref: 'far', x: 0, y: 50 - 0.2 * 2000, z: -2000, heat: 30 }
  assert.ok(seekerSignal(ahead, origin, axis, SEEKER.cone, SEEKER) > SEEKER.minSignal)
  assert.equal(seekerSignal(wide, origin, axis, SEEKER.cone, SEEKER), 0)
  assert.equal(seekerSignal(far, origin, axis, SEEKER.cone, SEEKER), 0)
  // a hot source just outside the cone is never taken up
  const lock = { ref: null, signal: 0, lostT: 0, acquire: true }
  assert.equal(track(lock, [wide, far], origin, axis, SEEKER.cone, SEEKER, 0.1), 'none')
  assert.equal(lock.ref, null)
  // one inside it is, unless something stands in the way
  assert.equal(track(lock, [wide, ahead], origin, axis, SEEKER.cone, SEEKER, 0.1, (s) => s.ref !== 'ahead'), 'none')
  assert.equal(track(lock, [wide, ahead], origin, axis, SEEKER.cone, SEEKER, 0.1), 'acquire')
  assert.equal(lock.ref, 'ahead')
  // a missile's seeker never takes up a new target on its own
  const blind = { ref: null, signal: 0, lostT: 0, acquire: false }
  assert.equal(track(blind, [ahead], origin, axis, SEEKER.cone, SEEKER, 0.1), 'none')
})

test('a hotter flare in the cone takes the lock; one outside it, or a cooler one, does not', () => {
  const origin = { x: 0, y: 60, z: 0 }
  const trike = { ref: 'trike', x: 0, y: 2, z: -300, heat: bodyHeat(6000, HEAT.creature) }
  const axis = unit(trike.x, trike.y - origin.y, trike.z)
  const lock = { ref: 'trike', signal: 0, lostT: 0, acquire: false }
  assert.equal(track(lock, [trike], origin, axis, M.gimbal, SEEKER, 0.08), 'hold')
  // a herd-mate of the same size beside it does not pull the missile off
  const mate = { ref: 'mate', x: 6, y: 2, z: -296, heat: trike.heat * 1.1 }
  assert.equal(track(lock, [trike, mate], origin, axis, M.gimbal, SEEKER, 0.08), 'hold')
  // a flare burning outside the missile's view changes nothing
  const behind = { ref: 'flare', x: 0, y: 60, z: 300, heat: HEAT.flare }
  assert.equal(track(lock, [trike, behind], origin, axis, M.gimbal, SEEKER, 0.08), 'hold')
  // nor does a bigger animal elsewhere in its view, outside the window round the target
  const brachio = { ref: 'brachio', x: 120, y: 4, z: -320, heat: bodyHeat(30000, HEAT.creature) }
  assert.ok(seekerSignal(brachio, origin, axis, M.gimbal, SEEKER) > trike.heat * SEEKER.decoy * 0.2)
  assert.equal(track(lock, [trike, brachio], origin, axis, M.gimbal, SEEKER, 0.08), 'hold')
  // a flare inside it, hotter than the trike, steals the lock
  const flare = { ref: 'flare', x: 25, y: 1, z: -290, heat: HEAT.flare }
  assert.ok(flare.heat > trike.heat * SEEKER.decoy)
  assert.equal(track(lock, [trike, flare], origin, axis, M.gimbal, SEEKER, 0.08), 'switch')
  assert.equal(lock.ref, 'flare')
})

test('a lock survives a moment behind cover, then is lost for good', () => {
  const origin = { x: 0, y: 60, z: 0 }
  const src = { ref: 'a', x: 0, y: 0, z: -200, heat: 3 }
  const axis = unit(0, -60, -200)
  const lock = { ref: 'a', signal: 1, lostT: 0, acquire: false }
  const hidden = () => false
  let r
  let t = 0
  do {
    r = track(lock, [src], origin, axis, M.gimbal, SEEKER, 0.08, hidden)
    t += 0.08
  } while (r === 'blind')
  assert.equal(r, 'lost')
  assert.ok(t > SEEKER.grace && t < SEEKER.grace + 0.2)
  assert.equal(lock.ref, null)
})

test('the proximity fuse catches a pass between two steps', () => {
  // flew from 10 m short to 10 m past, 2 m to one side
  const r = closestApproach({ x: 2, y: 0, z: 10 }, { x: 2, y: 0, z: -10 })
  assert.ok(Math.abs(r.d - 2) < 1e-9)
  assert.ok(Math.abs(r.t - 0.5) < 1e-9)
  assert.equal(closestApproach({ x: 0, y: 0, z: 30 }, { x: 0, y: 0, z: 20 }).d, 20)
})

test('bigger animals run hotter; a flare outshines all of them', () => {
  const compy = bodyHeat(3, HEAT.creature)
  const trike = bodyHeat(6000, HEAT.creature)
  const brachio = bodyHeat(30000, HEAT.creature)
  assert.ok(compy < trike && trike < brachio && brachio < HEAT.flare)
  // a compy is too cold to lock even right under the nose
  assert.ok(compy < SEEKER.minSignal)
})
