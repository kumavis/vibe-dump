import test from 'node:test'
import assert from 'node:assert/strict'
import { makeCheckpointer } from '../../src/net/checkpoint.js'
import { makeFakeWorld } from './b-fakes.mjs'

const DEG = Math.PI / 180

function setup () {
  const w = makeFakeWorld([
    { id: 'a', c: { transform: { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] } }, live: { p: [0, 0, 0], yaw: 0 } },
    { id: 'b', c: { transform: { p: [5, 0, 5], r: [10, 90, 0] } }, live: { p: [5, 0, 5], yaw: 90 * DEG } },
    { id: 'theirs', c: { transform: { p: [0, 0, 0] } }, live: { p: [9, 9, 9], yaw: 0 } },
    { id: 'player:p_a', local: true, c: { transform: { p: [0, 0, 0] } }, live: { p: [3, 0, 3], yaw: 0 } },
  ])
  const flushed = []
  let now = 0
  const ck = makeCheckpointer({ world: w, owns: (id) => id !== 'theirs', flush: (ops) => flushed.push(ops), now: () => now })
  return { w, ck, flushed, setNow: (t) => { now = t } }
}

test('writes only every 3 s, only what moved > 0.1 m or turned > 5°, rounded, in one flush', () => {
  const { w, ck, flushed } = setup()
  assert.deepEqual(ck.tick(1000), [])
  w.get('a').live.p = [0.05, 0, 0] // under threshold
  w.get('b').live.yaw = 96 * DEG // 6°: over
  assert.deepEqual(ck.tick(3000), [{ op: 'checkpoint', id: 'b', p: [5, 0, 5], r: [10, 96, 0] }])
  w.get('a').live.p = [1.23456, 0.0004, -2.0006]
  w.get('a').live.yaw = 33.333 * DEG
  assert.deepEqual(ck.tick(4000), [], 'not before the period')
  const ops = ck.tick(6000)
  assert.deepEqual(ops, [{ op: 'checkpoint', id: 'a', p: [1.235, 0, -2.001], r: [0, 33.3, 0] }])
  assert.equal(flushed.length, 2)
  assert.ok(!ops.some((o) => o.id === 'theirs' || o.id.startsWith('player:')), 'never non-owned or local entities')
})

test('no rewrite of a pose already written whose patch has not come back yet', () => {
  const { w, ck } = setup()
  w.get('a').live.p = [2, 0, 0]
  assert.equal(ck.tick(3000).length, 1)
  assert.equal(ck.tick(6000).length, 0, 'the doc still says [0,0,0], but I already wrote [2,0,0]')
  w.get('a').live.p = [2.2, 0, 0]
  assert.equal(ck.tick(9000).length, 1)
})

test('flushNow: on loss for named ids regardless of ownership; on pagehide for all owned', () => {
  const { w, ck, flushed } = setup()
  w.get('theirs').live.p = [9, 9, 9]
  assert.deepEqual(ck.flushNow(['theirs']).map((o) => o.id), ['theirs'])
  w.get('a').live.p = [3, 0, 0]; w.get('b').live.p = [6, 0, 6]
  assert.deepEqual(ck.flushNow().map((o) => o.id), ['a', 'b'])
  assert.equal(flushed.length, 2)
  assert.equal(ck.stats().rowsWritten, 3)
  // yaw wraps: 179° vs -179° is 2° apart, not 358°
  w.get('b').c = { transform: { p: [6, 0, 6], r: [0, 179, 0] } }
  w.get('b').live.yaw = -179 * DEG
  assert.deepEqual(ck.flushNow(['b']), [])
})
