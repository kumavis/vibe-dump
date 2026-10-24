import test from 'node:test'
import assert from 'node:assert/strict'
import { reachBand, inReach } from '../src/actors/reach.js'
import { SPECIES } from '../src/data/species.js'

// Heights from the island (metres above the ground an animal stands on).
const STATION_ROOF = 3.42 // structures.js building(): 3.2 walls + 0.22 roof
const LAB_ROOF = 4.02
const TOWER = 8.12 // watchtower platform
const STAND = 1.75 // player height, player.js
const big = (sp) => reachBand(sp, sp.scale[1])
const small = (sp) => reachBand(sp, sp.scale[0])
// a player standing with their feet at `feet`, the animal's feet at 0
const player = (band, feet, ceil) => inReach(band, 0, feet, feet + STAND, ceil)
const armed = Object.values(SPECIES).filter((sp) => sp.attack)

test('nothing reaches a player up a watchtower', () => {
  for (const sp of armed) assert.equal(player(big(sp), TOWER), false, sp.id)
})

test('a raptor cannot bite a player on the station roof; a T. rex can, and on the lab roof', () => {
  const raptor = SPECIES.velociraptor
  const rex = SPECIES.tyrannosaurus
  assert.equal(player(big(raptor), STATION_ROOF), false)
  assert.equal(player(big(SPECIES.dilophosaurus), STATION_ROOF), false)
  assert.equal(player(small(rex), STATION_ROOF), true)
  assert.equal(player(small(rex), LAB_ROOF), true)
  // the only predator that takes someone off the roof is the one tall enough
  const reachRoof = armed.filter((sp) => player(big(sp), STATION_ROOF)).map((sp) => sp.id)
  assert.deepEqual(reachRoof, ['tyrannosaurus'])
})

test('on the ground, a crate or a low rock you are still in reach', () => {
  for (const sp of armed) {
    assert.equal(player(small(sp), 0), true, sp.id + ' on the ground')
    assert.equal(player(small(sp), 0.75), true, sp.id + ' on a crate')
  }
  assert.equal(player(small(SPECIES.velociraptor), 1.5), true)
  assert.equal(player(small(SPECIES.triceratops), 1.5), true)
})

test('a trampler only finds feet: the ground, not a roof', () => {
  const brachio = big(SPECIES.brachiosaurus)
  assert.equal(player(brachio, 0), true)
  assert.equal(player(brachio, STATION_ROOF), false)
  // and it reaches a good deal lower than its head would
  assert.ok(brachio.hi < SPECIES.brachiosaurus.body.hipH)
})

test('a roof over its own head caps the reach', () => {
  // a big dilophosaurus inside the station (floor slab 0.3 m, roof from 3.2 m)
  // would just touch the boots of someone on the roof if nothing were between
  const dilo = big(SPECIES.dilophosaurus)
  assert.equal(inReach(dilo, 0.3, STATION_ROOF, STATION_ROOF + STAND), true)
  assert.equal(inReach(dilo, 0.3, STATION_ROOF, STATION_ROOF + STAND, 3.2), false)
})

test('a hovering helicopter: out of a raptor’s reach, not a T. rex’s at five metres', () => {
  const hull = (h) => [h + 0.3, h + 3.05] // data/vehicles.js HELI.parked span
  assert.equal(inReach(big(SPECIES.velociraptor), 0, ...hull(2.5)), false)
  assert.equal(inReach(small(SPECIES.tyrannosaurus), 0, ...hull(5)), true)
  assert.equal(inReach(big(SPECIES.tyrannosaurus), 0, ...hull(8)), false)
})

test('the band comes from the body, not a per-species number', () => {
  const raptor = SPECIES.velociraptor
  const longNeck = { ...raptor, body: { ...raptor.body, neck: { ...raptor.body.neck, len: raptor.body.neck.len + 1 } } }
  assert.ok(Math.abs(reachBand(longNeck).hi - reachBand(raptor).hi - 1) < 1e-9)
  assert.ok(Math.abs(reachBand(raptor, 1.1).hi - reachBand(raptor).hi * 1.1) < 1e-9)
  // a charger cannot rear: same body, rammed instead of bitten, reaches lower
  const ram = { ...raptor, attack: { ...raptor.attack, kind: 'charge' } }
  assert.ok(reachBand(ram).hi < reachBand(raptor).hi)
  // an animal without an attack reaches nothing
  assert.equal(reachBand(SPECIES.gallimimus), null)
  assert.equal(inReach(reachBand(SPECIES.gallimimus), 0, 0, STAND), false)
})
