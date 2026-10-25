import test from 'node:test'
import assert from 'node:assert/strict'
import { Island } from '../src/world/island.js'
import { WORLD } from '../src/data/world.js'
import { underwaterLook } from '../src/world/underwater.js'
import { UNDERWATER } from '../src/data/sea.js'

test('the seabed is reshaped only out of reach of every coast, and the sea lab stands in 15-24 m', () => {
  const shaped = new Island(WORLD)
  const plain = new Island({ ...WORLD, seabed: null, pois: WORLD.pois.filter((p) => p.id !== 'sealab') })
  const [shallowest] = WORLD.seabed.below
  let moved = 0
  let top = -Infinity
  for (let i = 0; i < plain.h.length; i++) {
    if (plain.h[i] >= shallowest) moved += shaped.h[i] !== plain.h[i]
    else top = Math.max(top, shaped.h[i])
  }
  assert.equal(moved, 0, 'no ground shallower than below[0] moves')
  assert.ok(top <= shallowest, `a reef crown reached ${top}`)
  for (const k of ['water', 'road', 'riverD']) assert.deepEqual(shaped[k], plain[k])
  const lab = shaped.poi.sealab
  assert.ok(lab.seabed >= 15 && lab.seabed <= 24, `sea lab in ${lab.seabed} m`)
  // the trench is cut well below the shelf, and the reefs carry their corals
  let deepest = 0
  for (const v of shaped.h) deepest = Math.min(deepest, v)
  assert.ok(deepest < -38, `trench floor at ${deepest}`)
  assert.ok(shaped.d.coral.some((v) => v > 0.3) && shaped.d.kelp.some((v) => v > 0.3) && shaped.d.seagrass.some((v) => v > 0.3))
})

test('under water the fog thickens, the light fails and night is darker with depth', () => {
  let prev = underwaterLook(0, 1)
  for (let d = 2; d <= 40; d += 2) {
    const l = underwaterLook(d, 1)
    assert.ok(l.density >= prev.density && l.light <= prev.light && l.deep >= prev.deep)
    prev = l
  }
  assert.equal(underwaterLook(0, 1).density, UNDERWATER.fog.near)
  assert.equal(underwaterLook(UNDERWATER.fog.at, 1).density, UNDERWATER.fog.deep)
  assert.ok(underwaterLook(200, 1).light >= UNDERWATER.light.floor)
  assert.ok(underwaterLook(5, 0.15).bright < underwaterLook(5, 1).bright)
})
