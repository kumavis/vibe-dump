import test from 'node:test'
import assert from 'node:assert/strict'
import { landfall, wadeable } from '../src/actors/ecology.js'
import { SPECIES } from '../src/data/species.js'
import { WEAPONS } from '../src/data/weapons.js'
import { BLASTS } from '../src/data/blasts.js'
import { TANK } from '../src/data/vehicles.js'

const lure = SPECIES.tyrannosaurus.lure

test('the tank and the big bangs bring the tyrant; the hand-held guns do not', () => {
  for (const [id, w] of Object.entries(WEAPONS)) assert.ok(w.noise < lure.noise, `${id} (${w.noise} m) stays under the lure`)
  assert.ok(TANK.gun.noise >= lure.noise, 'the main gun firing')
  assert.ok(BLASTS[TANK.gun.blast].noise >= lure.noise, 'its shell going off')
})

// a stand-in coast: sea for x > 100, and a lake 20 m across round (0, 300)
const isLand = (x, z) => x <= 100 && Math.hypot(x, z - 300) > 20
const depthAt = (x, z) => (isLand(x, z) ? -1 : 6)

test('a bang over water draws her to the shore on her own side', () => {
  // on land: the noise itself
  assert.deepEqual(landfall(50, 10, -400, 0, isLand), { x: 50, z: 10 })
  // in the sea, herd to the west: the first dry ground back toward her
  const g = landfall(180, 0, -400, 0, isLand)
  assert.ok(isLand(g.x, g.z) && g.x <= 100 && g.x > 95, `goal at ${g.x}`)
  assert.equal(g.z, 0)
  // a shell in the lake, herd to the north: its northern shore
  const l = landfall(0, 300, 0, -200, isLand)
  assert.ok(isLand(l.x, l.z) && l.z < 280 && l.z > 275)
  // nothing dry between: no goal at all
  assert.equal(landfall(300, 0, 200, 0, isLand), null)
})

test('a virtual herd walks round deep water, and out of it', () => {
  // heading straight across the lake's edge: bent aside
  const w = wadeable(0, 274, 0, 1, 8, 2.4, depthAt)
  assert.ok(w && Math.abs(w.x) > 0.5, 'turned off the straight line')
  assert.ok(Math.abs(Math.hypot(w.x, w.z) - 1) < 1e-12)
  // dry ahead: straight on
  assert.deepEqual(wadeable(0, 0, 0, 1, 4, 2.4, depthAt), { x: 0, z: 1 })
  // a wall of sea ahead and to both sides: it waits
  assert.equal(wadeable(99, 0, 1, 0, 30, 2.4, depthAt), null)
  // already out of its depth: any step toward the shore is allowed
  const deep = (x) => Math.max(0, x - 100) * 0.5
  assert.ok(wadeable(120, 0, -1, 0, 4, 2.4, (x) => deep(x)))
})
