// Time travel: stepBack() must restore the exact previous state (stack,
// frames, labels, locals, globals, memory bytes and size, tables, dropped
// segments, trap status), and replaying forward must reproduce the result.
import test from 'node:test'
import assert from 'node:assert/strict'
import { assemble } from '../src/engine/wat.js'
import { instantiate, hostFunction } from '../src/engine/machine.js'
import { snapshotDiff } from './util.mjs'

const SRC = `
(module
  (memory 1 3)
  (table 3 funcref)
  (global $g (mut i64) (i64.const 1))
  (data $d "abcdefgh")
  (elem $e func $sq $sq)
  (func $sq (param i32) (result i32) (i32.mul (local.get 0) (local.get 0)))
  (func $work (export "work") (param $n i32) (result i32) (local $i i32) (local $acc i32)
    (table.init 0 (i32.const 0) (i32.const 0) (i32.const 2))
    (elem.drop $e)
    (memory.init $d (i32.const 100) (i32.const 0) (i32.const 8))
    (data.drop $d)
    (drop (memory.grow (i32.const 1)))
    (memory.fill (i32.const 70000) (i32.const 7) (i32.const 300))
    (block $out
      (loop $l
        (br_if $out (i32.ge_u (local.get $i) (local.get $n)))
        (local.set $acc (i32.add (local.get $acc)
          (call_indirect (param i32) (result i32) (local.get $i) (i32.and (local.get $i) (i32.const 1)))))
        (i32.store8 (i32.add (i32.const 200) (local.get $i)) (local.get $acc))
        (global.set $g (i64.mul (global.get $g) (i64.const 3)))
        (table.set (i32.const 2) (table.get (i32.const 0)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $l)))
    (memory.copy (i32.const 300) (i32.const 100) (i32.const 50))
    (i32.add (local.get $acc) (i32.load8_u (i32.const 70001))))
  (func (export "boom") (param i32) (result i32)
    (i32.store (i32.const 0) (i32.const 99))
    (i32.div_s (i32.const 1) (local.get 0)))
)`

test('step N, back N restores the exact post-invoke state; forward again reproduces the result', () => {
  const { bytes } = assemble(SRC)
  const m = instantiate(bytes, {}, { history: 100000 })
  const ref = instantiate(bytes, {}, { history: 0 }).call('work', [9])
  m.invoke('work', [9])
  const s0 = m.snapshot()
  // step forward one at a time, keeping snapshots at a few points
  const marks = new Map()
  let n = 0
  while (m.status === 'ready') {
    if (n % 7 === 0) marks.set(n, m.snapshot())
    m.step()
    n++
  }
  assert.equal(m.status, 'done')
  assert.deepEqual(m.results.map((r) => r.value), ref)
  const sEnd = m.snapshot()
  // walk back, checking every marked snapshot along the way
  for (let k = n; k > 0; k--) {
    assert.ok(m.stepBack(), `stepBack at ${k}`)
    const want = marks.get(k - 1)
    if (want) assert.deepEqual(snapshotDiff(want, m.snapshot()), [], `state after stepping back to step ${k - 1}`)
  }
  assert.equal(m.stepBack(), null, 'history exhausted')
  assert.deepEqual(snapshotDiff(s0, m.snapshot()), [])
  // memory size restored after memory.grow
  assert.equal(m.memory.pages, 1)
  // forward again with run(): same final state
  const r = m.run()
  assert.equal(r.reason, 'done')
  assert.deepEqual(snapshotDiff(sEnd, m.snapshot()), [])
  // and back again from a run() (run records history too)
  for (let k = 0; k < n; k++) m.stepBack()
  assert.deepEqual(snapshotDiff(s0, m.snapshot()), [])
})

test('stepping back over a trap clears it and restores state', () => {
  const m = instantiate(assemble(SRC).bytes)
  m.invoke('boom', [0])
  const before = m.snapshot()
  const r = m.run()
  assert.equal(r.reason, 'trap')
  assert.equal(r.trap.kind, 'integer-divide-by-zero')
  assert.equal(m.location, null)
  const back = m.stepBack()
  assert.equal(m.status, 'ready')
  assert.equal(m.trap, null)
  assert.equal(back.instr.op, 'i32.div_s')
  while (m.stepBack());
  assert.deepEqual(snapshotDiff(before, m.snapshot()), [])
})

test('history is bounded by the configured size', () => {
  const m = instantiate(assemble(SRC).bytes, {}, { history: 25 })
  m.invoke('work', [5])
  m.run()
  assert.equal(m.historySize, 25)
  let k = 0
  while (m.stepBack()) k++
  assert.equal(k, 25)
  const m0 = instantiate(assemble(SRC).bytes, {}, { history: 0 })
  m0.invoke('work', [5])
  m0.step()
  assert.equal(m0.stepBack(), null)
})

test('memory written by a host function through the caller API is undone', () => {
  const src = `(module (import "h" "fill" (func $f (param i32))) (memory (export "m") 1)
    (func (export "go") (call $f (i32.const 16)) (i32.store8 (i32.const 17) (i32.const 1))))`
  const m = instantiate(assemble(src).bytes, { h: { fill: hostFunction((c, p) => c.write(p, new Uint8Array([9, 9, 9, 9]))) } })
  m.invoke('go')
  const s0 = m.snapshot()
  m.run()
  assert.deepEqual([...m.memory.bytes.slice(16, 20)], [9, 1, 9, 9])
  while (m.stepBack());
  assert.deepEqual(snapshotDiff(s0, m.snapshot()), [])
})

test('an unrecorded run() drops older history instead of leaving it inapplicable', () => {
  const m = instantiate(assemble(SRC).bytes)
  m.invoke('work', [3])
  m.step()
  m.step()
  assert.equal(m.historySize, 2)
  m.run({ maxSteps: 10, record: false })
  assert.equal(m.historySize, 0)
  assert.equal(m.stepBack(), null)
})
