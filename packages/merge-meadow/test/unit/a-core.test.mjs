import test from 'node:test'
import assert from 'node:assert/strict'
import { compileFilter, RELATIONS, readPath } from '../../src/core/filters.js'
import { makeTicker } from '../../src/core/tick.js'
import { makeEvents } from '../../src/core/events.js'

const ent = (id, c, live = {}) => ({ id, c, live })

test('compileFilter: tags, anyTags, notTags, has, not', () => {
  const self = ent('me', { tags: { predator: true } })
  const sheep = ent('s', { tags: { prey: true, woolly: true }, health: { max: 30 } })
  const ghost = ent('g', { tags: { prey: true, dead: true } })
  const f = (x) => compileFilter(x)
  assert.equal(f({ tags: ['prey'], notTags: ['dead'] })({ self, other: sheep }), true)
  assert.equal(f({ tags: ['prey'], notTags: ['dead'] })({ self, other: ghost }), false)
  assert.equal(f({ anyTags: ['dead', 'woolly'] })({ self, other: ghost }), true)
  assert.equal(f({ anyTags: ['x'] })({ self, other: sheep }), false)
  assert.equal(f({ has: 'health' })({ self, other: sheep }), true)
  assert.equal(f({ has: ['health'] })({ self, other: ghost }), false)
  assert.equal(f({ not: ['health'] })({ self, other: ghost }), true)
  assert.equal(f(null)({ self, other: sheep }), true)
  assert.equal(f({})({ self, other: ghost }), true)
  const x = { tags: ['prey'] }
  assert.equal(compileFilter(x), compileFilter(x), 'compiled once per filter object')
})

test('compileFilter: relations, where with $hp/$live and self-relative values, any', () => {
  const rex = ent('rex', { body: { speed: 6 } }, { intent: { target: 'ann' } })
  const ann = ent('ann', { rider: { mount: 'horse' }, body: { speed: 4 }, health: { max: 50, armor: 0, hits: { a: 20 } } }, { hunger: 7 })
  const horse = ent('horse', { body: { speed: 9 } })
  assert.equal(RELATIONS.targetsMe(ann, rex), true)
  assert.equal(RELATIONS.myRider(horse, ann), true)
  assert.equal(RELATIONS.myMount(ann, horse), true)
  assert.equal(RELATIONS.isMounted(rex, ann), true)
  assert.equal(RELATIONS.isMounted(rex, horse), false)
  assert.equal(compileFilter({ relation: 'targetsMe' })({ self: ann, other: rex }), true)
  assert.equal(compileFilter({ notRelation: 'targetsMe' })({ self: horse, other: rex }), true)
  assert.equal(compileFilter({ where: [{ path: ['$hp'], lt: 40 }] })({ self: rex, other: ann }), true)
  assert.equal(compileFilter({ where: [{ path: ['$live', 'hunger'], gte: 7 }] })({ self: rex, other: ann }), true)
  // other is slower than half my speed? 4 < 6 * 0.5 is false; 4 < 6 * 0.8 is true
  assert.equal(compileFilter({ where: [{ path: ['body', 'speed'], lt: { path: ['body', 'speed'], of: 'self', mul: 0.5 } }] })({ self: rex, other: ann }), false)
  assert.equal(compileFilter({ where: [{ path: ['body', 'speed'], lt: { path: ['body', 'speed'], of: 'self', mul: 0.8 } }] })({ self: rex, other: ann }), true)
  assert.equal(compileFilter({ where: [{ path: ['nope', 'x'], eq: 1 }] })({ self: rex, other: ann }), false, 'a missing path never matches')
  assert.equal(compileFilter({ any: [{ tags: ['predator'] }, { relation: 'targetsMe' }] })({ self: ann, other: rex }), true)
  assert.equal(readPath(ann, ['$id']), 'ann')
  assert.throws(() => compileFilter({ relation: 'likes' }), /unknown relation/)
})

test('makeTicker: fixed steps, alpha, catch-up cap', () => {
  const steps = []
  const t = makeTicker({ hz: 30, maxSteps: 4, step: (dt) => steps.push(dt) })
  assert.equal(t.dt, 1 / 30)
  assert.equal(t.advance(1000), 0)
  const a = t.advance(1000 + 50) // 1.5 steps
  assert.equal(steps.length, 1)
  assert.ok(Math.abs(a - 0.5) < 1e-9)
  t.advance(1000 + 50 + 10000) // a 10 s stall
  assert.equal(steps.length, 5, 'at most maxSteps per frame')
  const before = steps.length
  t.advance(1000 + 50 + 10000 + 1)
  assert.equal(steps.length, before, 'the backlog was dropped, not replayed')
  assert.throws(() => makeTicker({}), /step/)
})

test('makeEvents: double-buffered, frozen copies', () => {
  const ev = makeEvents()
  const p = [1, 2, 3]
  ev.emit({ type: 'died', id: 'a', p })
  assert.deepEqual(ev.events(), [], 'not visible until the next tick')
  ev.swap()
  assert.equal(ev.events().length, 1)
  assert.equal(ev.events('died')[0].id, 'a')
  assert.deepEqual(ev.events('hurt'), [])
  assert.ok(Object.isFrozen(ev.events()[0]) && Object.isFrozen(ev.events()[0].p) && Object.isFrozen(ev.events()))
  assert.ok(!Object.isFrozen(p), 'the emitter\'s array is not frozen')
  ev.swap()
  assert.deepEqual(ev.events(), [])
  assert.throws(() => ev.emit({}), /type/)
})
