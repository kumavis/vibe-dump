import test from 'node:test'
import assert from 'node:assert/strict'
import { makeOwnership } from '../../src/net/ownership.js'
import { makeFakeWorld } from './b-fakes.mjs'

// presence stand-in: a fixed host and a set of live peers
const fakePresence = (host, live, names = {}) => ({ host: () => host.v, isLive: (p) => live.has(p), info: (p) => (names[p] ? { name: names[p] } : null) })

function setup () {
  const host = { v: 'p_a' }; const live = new Set(['p_a', 'p_b', 'p_c'])
  const w = makeFakeWorld([
    { id: 'sheep' }, { id: 'trex' },
    { id: 'horse' },
    { id: 'rock', owner: 'p_c' },
    { id: 'player:p_b', local: true, c: {} },
  ])
  const presence = fakePresence(host, live, { p_c: 'Cleo' })
  const a = makeOwnership({ presence, world: w, peerId: 'p_a' })
  return { host, live, w, a, presence }
}

test('owner(): host by default, explicit live pin, players own themselves, world.setOwnership installed', () => {
  const { w, a } = setup()
  const { gained, lost } = a.update()
  assert.deepEqual(gained, ['horse', 'sheep', 'trex'])
  assert.deepEqual(lost, [])
  assert.equal(a.owner('rock'), 'p_c')
  assert.equal(a.owner('player:p_b'), 'p_b')
  assert.equal(w.owns('sheep'), true, 'world.owns goes through ownership')
  assert.equal(w.owns('rock'), false)
  assert.deepEqual(a.owned(), ['horse', 'sheep', 'trex'])
})

test('a ridden mount follows its rider; lowest rider id wins a contested seat', () => {
  const { w, a } = setup()
  w.get('player:p_b').c = { rider: { mount: 'horse', seat: 0 } }
  w.add({ id: 'zz-npc', c: { rider: { mount: 'horse' } } }) // owned by host p_a, but loses the seat to 'player:p_b'
  a.update()
  assert.equal(a.owner('horse'), 'p_b')
  assert.equal(a.canGrab('horse'), 'ridden by p_b')
  w.get('player:p_b').c = {}
  const { gained } = a.update()
  assert.ok(gained.includes('horse'), 'the NPC rider (owned by the host) now steers it')
})

test('a pin to a dead peer falls back to the host; gains and losses are reported', () => {
  const { w, a, live, host } = setup()
  a.update()
  live.delete('p_c')
  assert.deepEqual(a.update().gained, ['rock'])
  host.v = 'p_b'
  const { lost } = a.update()
  assert.deepEqual(lost, ['horse', 'rock', 'sheep', 'trex'])
  w.entities.delete('trex')
  a.update()
  assert.equal(a.owned().includes('trex'), false)
})

test('canGrab / pinOps / unpinOps: the conditional pin protocol', () => {
  const { w, a, live } = setup()
  a.update()
  assert.equal(a.canGrab('rock'), 'held by Cleo')
  assert.deepEqual(a.pinOps('rock'), [], 'no pin while another live peer holds it')
  assert.equal(a.canGrab('sheep'), true)
  assert.deepEqual(a.pinOps('sheep'), [{ op: 'pin', id: 'sheep', owner: 'p_a', ifOwner: '' }])
  // a pin to a peer that left can be taken over, compare-and-set on the stale value
  live.delete('p_c')
  assert.deepEqual(a.pinOps('rock'), [{ op: 'pin', id: 'rock', owner: 'p_a', ifOwner: 'p_c' }])
  // release only if the pin is still mine
  assert.deepEqual(a.unpinOps('sheep', { transform: { p: [1, 0, 2] } }), [], 'not pinned to me: write nothing')
  w.get('sheep').owner = 'p_a'
  assert.equal(a.pinnedToMe('sheep'), true)
  assert.deepEqual(a.unpinOps('sheep', { transform: { p: [1, 0, 2], r: [0, 45, 0] } }), [
    { op: 'transform', id: 'sheep', p: [1, 0, 2], r: [0, 45, 0] },
    { op: 'unpin', id: 'sheep', ifOwner: 'p_a' },
  ])
  // someone else's pin landed concurrently: the drag must abort
  w.get('sheep').owner = 'p_b'
  assert.equal(a.pinnedToMe('sheep'), false)
  assert.deepEqual(a.unpinOps('sheep'), [])
  assert.equal(a.canGrab('nope'), 'no such entity')
})

test('a pinned entity is owned by its pinner while they are live', () => {
  const { w, a } = setup()
  w.get('sheep').owner = 'p_b'
  a.update()
  assert.equal(a.owner('sheep'), 'p_b')
  assert.equal(a.owns('sheep'), false)
  // spawned this tick, before update(): decided on the spot by the same rule
  w.add({ id: 'new' })
  assert.equal(a.owns('new'), true)
})

test('isHost is installed on the world (doc systems spawn on the host only)', () => {
  const { w, host } = setup()
  assert.equal(w.isHost(), true, 'p_a is the host')
  host.v = 'p_b'
  assert.equal(w.isHost(), false, 'another peer is host: world.spawn from a doc system must not run here')
})

test('a dismounted rider stored as ImmutableString("") steers nothing', async () => {
  const { ImmutableString } = await import('@automerge/automerge/slim')
  const { w, a } = setup()
  w.get('player:p_b').c = { rider: { mount: new ImmutableString(''), seat: 0 } }
  w.add({ id: '', c: {} }) // the bug mapped such riders under the id ''
  a.update()
  assert.notEqual(a.owner(''), 'p_b')
})
