import test from 'node:test'
import assert from 'node:assert/strict'
import { motionSight, SETTLE, LOSE, Perception } from '../src/actors/perception.js'
import { Brain, SEARCH, pullUp } from '../src/actors/brain.js'
import { Stealth, bodyMoving } from '../src/game/stealth.js'
import { SPECIES } from '../src/data/species.js'
import { clamp, stepAngle, wrapAngle, yawTo, yawDirX, yawDirZ, segDist } from '../src/core/mathx.js'

const rex = SPECIES.tyrannosaurus
const R = rex.senses
const radius = rex.radius * rex.scale[1]
const rng = { range: (a, b) => (a + b) / 2, next: () => 0.5, sign: () => 1 }

test('the tyrant is the only motion hunter', () => {
  const hunters = Object.values(SPECIES).filter((sp) => sp.senses.motion > 1).map((sp) => sp.id)
  assert.deepEqual(hunters, ['tyrannosaurus'])
  // everything else sees a still player exactly as a moving one
  for (const sp of Object.values(SPECIES)) if (sp !== rex) for (const still of [0, 5]) assert.equal(motionSight(sp.senses, still, 10), 1, sp.id)
})

test('a frozen player is invisible to her at 25, 10 and 4 m', () => {
  for (const d of [25, 10, 4]) assert.equal(motionSight(R, 2, d - radius), 0, `${d} m`)
  // and right under her head, where a search pulls up
  assert.equal(motionSight(R, 2, SEARCH.pullUp), 0)
})

test('she makes out a still body only when she all but treads on it', () => {
  assert.equal(motionSight(R, 2, 0.2), 1)
  assert.ok(R.still < 1, 'touching, not seeing')
  assert.ok(SEARCH.pullUp > R.still, 'a search stops short of finding someone frozen on the spot')
})

test('movement is plainer to her than to anyone, and a stop takes a beat', () => {
  assert.ok(motionSight(R, 0, 30) > 1.25)
  assert.equal(motionSight(R, SETTLE * 0.5, 30), R.motion) // stopping mid-stride: still moving
  assert.equal(motionSight(R, SETTLE + 0.05, 30), 0)
  // the whole loss — the stop settling, then no fix for LOSE s — is about a second
  assert.ok(SETTLE + LOSE + 0.28 <= 1.2)
})

test('what counts as moving: the body, not the head', () => {
  assert.equal(bodyMoving({ speed: 0 }), false) // standing, turning to look, aiming
  assert.equal(bodyMoving({ speed: 0.1 }), false) // a stick resting off-centre
  for (const speed of [1.9, 1.9 * 0.6, 1.9 * 0.6 * 0.65, 2.3]) assert.equal(bodyMoving({ speed }), true, `${speed} m/s`) // crouch-walk, aimed, wading, swimming
  assert.equal(bodyMoving({ speed: 0, climb: 6.2 }), true) // a jump
  assert.equal(bodyMoving({ speed: 0, stance: -2 }), true) // dropping into a crouch
  assert.equal(bodyMoving({ speed: 0, shift: 8 }), true) // up a ladder, all at once
})

test('her nose: only what the wind carries, unless she stands on you', () => {
  const G = { events: { on() {} }, player: { pos: { x: 0, y: 0, z: 0 } }, wind: { x: 1, z: 0, strength: 0.6 } }
  const S = new Stealth(G)
  const range = 40 * R.smell
  // three metres upwind of the player (the scent blows away from her)
  assert.equal(S.scentAt(-3, 0, range, R.eddy), 0)
  assert.equal(S.scentAt(-3, 0, 40), 0.5) // anyone else smells that close a whiff whatever the wind
  assert.ok(S.scentAt(-1.5, 0, range, R.eddy) > 0) // all but on top of you
  assert.ok(S.scentAt(25, 0, range, R.eddy) > 0) // downwind, from afar
})

test('a search casts to and fro, never across the spot itself', () => {
  // the nearest a leg between two casts comes to the spot: casts at the
  // nearest radius, as far apart either side of the way in as they go
  const r = SEARCH.cast[0]
  const half = SEARCH.spread[1]
  const closest = r * Math.cos(half)
  assert.ok(closest - radius > R.still + 1, `legs pass ${closest.toFixed(2)} m off`)
  // and never round to the far side, where the wind may carry the scent
  assert.ok(SEARCH.spread[1] < Math.PI / 2)
})

// Her pull-up (pullUp) driven through a stand-in for Creature.locomote:
// heading straight in at the spot from `d0` m at `v0` m/s, turning at her
// rate (quicker braking), braking and getting going as anything over 2000 kg.
function pullingUp(d0, v0) {
  const short = radius + SEARCH.pullUp
  const brake = 3 * 1.6
  const pos = { x: 0, z: d0 } // yaw 0 faces -Z: at the spot
  let yaw = 0
  let speed = v0
  let side = 0
  let swerved = false
  let minD = d0
  const dt = 1 / 60
  for (let i = 0; i < 1200; i++) {
    if (!side && Math.hypot(pos.x, pos.z) <= short + 0.3) break // pulled up (Brain.closeOn)
    const p = pullUp(pos, yaw, speed, brake, { x: 0, z: 0 }, short, side)
    side = p.side && speed > rex.speed.walk ? p.side : 0
    swerved ||= !!p.side
    let want = Math.min(rex.speed.run, p.speed)
    const goal = p.steer ? yawTo(pos.x, pos.z, p.steer.x, p.steer.z) : yaw
    if (Math.abs(wrapAngle(goal - yaw)) > 1.2) want *= 0.35
    yaw = stepAngle(yaw, goal, rex.speed.turn * (want > 0.2 ? 1 : 1.3) * dt)
    speed += clamp(want - speed, -brake * dt, 3 * dt)
    pos.x += yawDirX(yaw) * speed * dt
    pos.z += yawDirZ(yaw) * speed * dt
    minD = Math.min(minD, Math.hypot(pos.x, pos.z))
  }
  return { pos, minD, swerved, d: Math.hypot(pos.x, pos.z) }
}

test('a charge cut off by a freeze pulls up short of you, or thunders past', () => {
  const short = radius + SEARCH.pullUp
  // room to stop: she brakes in time and pulls up a stride short, head over you
  for (const d0 of [20, 14, 12]) {
    const r = pullingUp(d0, rex.speed.run)
    assert.equal(r.swerved, false, `${d0} m`)
    assert.ok(r.minD > short - 0.1 && r.d < short + 0.35, `${d0} m: ${r.d.toFixed(2)}`)
  }
  // walking up there is no question of it
  assert.equal(pullingUp(10, rex.speed.walk).swerved, false)
  // too close to stop: she swerves by, never near enough to make you out or
  // smell you in the eddy, and pulls up beside you — not downwind of you,
  // when it is the wind in your face she came in on
  const G = { events: { on() {} }, player: { pos: { x: 0, y: 0, z: 0 } }, wind: { x: 0, z: -1, strength: 0.6 } }
  const S = new Stealth(G)
  for (const d0 of [10, 8, 6]) {
    const r = pullingUp(d0, rex.speed.run)
    assert.ok(r.swerved, `${d0} m`)
    assert.ok(r.minD > radius + R.still + 0.5 && r.minD > R.eddy + 0.5, `${d0} m: came within ${r.minD.toFixed(2)} m`)
    assert.equal(S.scentAt(r.pos.x, r.pos.z, 40 * R.smell, R.eddy), 0, `${d0} m: smells you from ${r.pos.x.toFixed(1)}, ${r.pos.z.toFixed(1)}`)
  }
})

// A creature stubbed down to what think() reads, with a real Perception.
function hunter(sp) {
  const G = { time: 10, vehicle: null, player: { pos: { x: 0, y: 0, z: 0 }, alive: true }, island: { heightAt: () => 0 }, events: { emit: (e) => (G.emitted = e) } }
  const c = { sp, radius: sp.radius, pos: { x: 12, y: 0, z: 0 }, yaw: 0, speed: 0, brake: 4.8, intent: {}, vitals: { rec: { health: sp.health } }, vocalize: (k) => (c.voiced = k), canGetAt: () => c.reach, reachesTarget: () => c.reach }
  c.goTo = (x, z, speed) => (c.going = { x, z, speed })
  c.halt = () => (c.going = null)
  c.face = () => {}
  c.reach = true
  c.perception = new Perception(c, rng)
  c.brain = new Brain(c, rng)
  c.perception.alertTo(G.player.pos, 1.5)
  c.brain.set('hunt', { target: 'player' })
  return { G, c, P: c.perception, B: c.brain }
}

test('frozen, she loses you and searches where she last had you; move and she is on you', () => {
  const { G, c, P, B } = hunter(rex)
  P.lastFix = G.time - LOSE * 0.5
  B.think(G)
  assert.equal(B.state, 'hunt') // still on the fix she had a moment ago
  G.time += LOSE
  B.think(G)
  assert.equal(B.state, 'investigate')
  assert.ok(B.data.search)
  assert.equal(G.emitted, 'creature:lost')
  assert.deepEqual(B.data.at, { x: 0, z: 0 })
  // in a vehicle she never loses you
  G.vehicle = { pos: { x: 0, y: 0, z: 0 } }
  assert.equal(P.lost(G), false)
  G.vehicle = null
  // you move: a sighting is a fix, and the hunt is on again, with a roar
  P.lastFix = G.time
  B.think(G)
  assert.equal(B.state, 'hunt')
  assert.equal(c.voiced, 'roar')
})

test('one she lost up out of her reach she besieges, as any hunter would', () => {
  const { G, c, P, B } = hunter(rex)
  c.reach = false // up the watchtower, behind its railings
  G.time += 10
  assert.equal(P.lost(G), true)
  B.think(G)
  assert.equal(B.state, 'hunt')
  c.reach = true // and back down the ladder, frozen at its foot
  B.think(G)
  assert.equal(B.state, 'investigate')
  assert.ok(B.data.search)
})

test('a raptor that has not seen you for a while still hunts as it always did', () => {
  const { G, P, B } = hunter(SPECIES.velociraptor)
  G.time += 30
  assert.equal(P.lost(G), false)
  B.think(G)
  assert.equal(B.state, 'hunt')
})

test('the first look that misses you, she doubts: she eases off and strikes at nothing', () => {
  const { G, c, P, B } = hunter(rex)
  c.pos.x = 5 // within a lunge
  B.cool = -1
  P.lastFix = G.time // she had you a moment ago, but not on this look
  assert.equal(P.doubts(G), true)
  assert.equal(P.lost(G), false)
  B.hunt(1 / 60, G)
  assert.equal(B.state, 'hunt')
  assert.ok(c.going.speed < rex.speed.run, 'braking to pull up short')
  // the next look finds you moving: she lunges
  P.fixed = true
  B.hunt(1 / 60, G)
  assert.equal(B.state, 'attack')
  // anything else strikes at what it saw last as ever
  const raptor = hunter(SPECIES.velociraptor)
  assert.equal(raptor.P.doubts(raptor.G), false)
})

test('a bang from afar sends her searching, but she never had sight of you to lose', () => {
  const { G, P, B } = hunter(rex)
  G.time = 120 // no fix on you, ever: she only heard a shot
  B.think(G)
  assert.ok(B.data.search)
  assert.equal(G.emitted, undefined)
  // whereas one she had a moment ago she has lost
  const h = hunter(rex)
  h.P.lastFix = h.G.time - LOSE - 0.3
  h.B.think(h.G)
  assert.equal(h.G.emitted, 'creature:lost')
})

test('swerved past you, she searches back on the side she came in on, clear of you', () => {
  const { G, c, B } = hunter(rex)
  const at = { x: 0, z: 0 }
  // she came in from +z and swerved by on the -x side
  c.pos = { x: -(radius + SEARCH.pullUp), y: 0, z: 0 }
  B.set('investigate', { at, search: true, from: Math.PI / 2 })
  B.search(1 / 60, G, at) // pulled up: a sniff where she stands
  B.t += 5
  B.search(1 / 60, G, at) // and on to her first cast
  const k = B.data.cast
  assert.ok(k.x < 0 && k.z > 0, `first cast at ${k.x.toFixed(1)}, ${k.z.toFixed(1)}`)
  assert.ok(Math.abs(Math.atan2(k.z, k.x) - Math.PI / 2) <= SEARCH.spread[1] + 1e-9, 'within a cast of the way in')
  assert.ok(segDist(at.x, at.z, c.pos.x, c.pos.z, k.x, k.z).d > radius + R.still + 0.5)
})
