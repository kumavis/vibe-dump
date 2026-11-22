// The step() event contract the UI relies on, plus run()/stepOver()/stepOut()
// and breakpoints.
import test from 'node:test'
import assert from 'node:assert/strict'
import { assemble } from '../src/engine/wat.js'
import { instantiate } from '../src/engine/machine.js'

const SRC = `
(module
  (memory 1)
  (global $g (mut i32) (i32.const 5))
  (func $sq (param $x i32) (result i32) (i32.mul (local.get $x) (local.get $x)))
  (func (export "main") (param $a i32) (result i32) (local $t i32)
    (local.set $t (call $sq (local.get $a)))
    (i32.store offset=4 (i32.const 8) (local.get $t))
    (global.set $g (i32.load offset=4 (i32.const 8)))
    (block $b (result i32)
      (br_if $b (i32.const 1) (i32.const 0))
      (drop)
      (loop $l (result i32)
        (local.set $t (i32.sub (local.get $t) (i32.const 1)))
        (br_if $l (i32.gt_s (local.get $t) (i32.const 20)))
        (local.get $t)))
    (drop (memory.grow (i32.const 1)))
    (if (result i32) (global.get $g) (then (i32.const 10)) (else (i32.const 20)))
    (i32.add))
)`

const load = (opts) => instantiate(assemble(SRC).bytes, {}, opts)

test('step events describe exactly what happened', () => {
  const m = load()
  m.invoke('main', [5])
  assert.equal(m.status, 'ready')
  assert.equal(m.location.instr.op, 'local.get')
  assert.equal(m.callStack.length, 1)
  assert.deepEqual(m.callStack[0].locals.map((l) => [l.name, l.value, l.isParam]), [['a', 5, true], ['t', 0, false]])
  const evs = []
  let e
  while ((e = m.step())) evs.push(e)
  const last = evs[evs.length - 1]
  assert.equal(last.done, true)
  assert.deepEqual(last.results.map((r) => r.value), [20 + 10])

  const byOp = (op, k = 0) => evs.filter((x) => x.instr.op === op)[k]
  // local.get: read + push
  const lg = evs[0]
  assert.deepEqual(lg.localRead, { index: 0, type: 'i32', value: 5 })
  assert.deepEqual(lg.pushed, [{ type: 'i32', value: 5 }])
  assert.deepEqual(lg.popped, [])
  // call: args popped, control call, callee frame
  const call = byOp('call')
  assert.equal(call.control.kind, 'call')
  assert.equal(call.control.name, 'sq')
  assert.deepEqual(call.control.args, [{ type: 'i32', value: 5 }])
  // i32.mul in callee
  const mul = byOp('i32.mul')
  assert.equal(mul.funcIndex, 0)
  assert.deepEqual(mul.popped.map((v) => v.value), [5, 5])
  assert.deepEqual(mul.pushed.map((v) => v.value), [25])
  // function end returns
  const ret = evs.find((x) => x.control && x.control.kind === 'return' && x.funcIndex === 0)
  assert.equal(ret.control.toFunc, 1)
  assert.deepEqual(ret.control.results.map((v) => v.value), [25])
  // local.set write
  const ls = byOp('local.set')
  assert.deepEqual(ls.localWrite, { index: 1, type: 'i32', old: 0, value: 25 })
  // store: memWrite with before/after bytes
  const st = byOp('i32.store')
  assert.equal(st.memWrite.addr, 12)
  assert.deepEqual([...st.memWrite.before], [0, 0, 0, 0])
  assert.deepEqual([...st.memWrite.after], [25, 0, 0, 0])
  const ld = byOp('i32.load')
  assert.deepEqual({ addr: ld.memRead.addr, len: ld.memRead.len, bytes: [...ld.memRead.bytes] }, { addr: 12, len: 4, bytes: [25, 0, 0, 0] })
  const gs = byOp('global.set')
  assert.deepEqual(gs.globalWrite, { index: 0, type: 'i32', old: 5, value: 25 })
  // block enter / br_if not taken / loop branch taken / exit
  assert.equal(byOp('block').control.kind, 'enter-block')
  assert.equal(byOp('br_if').control.taken, false)
  const loopBr = byOp('br_if', 1)
  assert.equal(loopBr.control.kind, 'branch')
  assert.equal(loopBr.control.taken, true)
  assert.equal(loopBr.control.labelKind, 'loop')
  assert.ok(evs.some((x) => x.control && x.control.kind === 'exit-block' && x.control.blockKind === 'loop'))
  const grow = byOp('memory.grow')
  assert.deepEqual(grow.memGrow, { delta: 1, oldPages: 1, newPages: 2, failed: false })
  const iff = byOp('if')
  assert.equal(iff.control.taken, true)
  // every event carries instruction + byte offset
  for (const x of evs) {
    assert.equal(typeof x.offset, 'number')
    assert.equal(x.offset, x.instr.offset)
  }
  // once done, step() returns null
  assert.equal(m.step(), null)
})

test('a trap during step() is an event, never an exception', () => {
  const m = instantiate(assemble('(module (func (export "f") (result i32) (i32.div_u (i32.const 1) (i32.const 0))))').bytes)
  m.invoke('f')
  m.step()
  m.step()
  const e = m.step()
  assert.equal(e.control.kind, 'trap')
  assert.equal(e.trap.kind, 'integer-divide-by-zero')
  assert.equal(m.status, 'trapped')
  assert.equal(m.trap.pc, 2)
  assert.equal(m.step(), null)
})

test('run(): breakpoints, maxSteps, until, stepOver, stepOut', () => {
  const m = load()
  const fnMain = 1
  m.invoke('main', [6])
  let r = m.run({ maxSteps: 3 })
  assert.equal(r.reason, 'max-steps')
  assert.equal(r.steps, 3)
  // breakpoint on the i32.store (by function/pc) and on global.set (by byte offset)
  const code = m.module.funcs[fnMain].body.code
  const storePc = code.findIndex((i) => i.op === 'i32.store')
  const gset = code.find((i) => i.op === 'global.set')
  m.setBreakpoints([{ funcIndex: fnMain, pc: storePc }, { offset: gset.offset }])
  r = m.run()
  assert.equal(r.reason, 'breakpoint')
  assert.equal(r.location.pc, storePc)
  r = m.run()
  assert.equal(r.reason, 'breakpoint')
  assert.equal(r.location.instr.op, 'global.set')
  r = m.run({ until: (mm) => mm.location.instr.op === 'memory.grow' })
  assert.equal(r.reason, 'until')
  m.setBreakpoints([])
  r = m.run()
  assert.equal(r.reason, 'done')
  assert.deepEqual(r.results.map((x) => x.value), [20 + 10])

  // stepOver a call runs the whole callee
  m.invoke('main', [4])
  m.step() // local.get
  const so = m.stepOver()
  assert.equal(so.event.control.kind, 'call')
  assert.equal(so.run.reason, 'step-complete')
  assert.equal(m.callStack.length, 1)
  assert.equal(m.location.instr.op, 'local.set')
  assert.deepEqual(m.stack.map((v) => v.value), [16])

  // stepOut from inside the callee
  m.invoke('main', [3])
  m.step()
  m.step() // now inside $sq
  assert.equal(m.callStack.length, 2)
  const out = m.stepOut()
  assert.equal(out.reason, 'step-complete')
  assert.equal(m.callStack.length, 1)
  assert.deepEqual(m.stack.map((v) => v.value), [9])
})

test('labels and frames are inspectable', () => {
  const m = load()
  m.invoke('main', [5])
  m.run({ until: (mm) => mm.location.instr.op === 'local.set' && mm.callStack[0].labels.length === 3 })
  const fr = m.callStack[0]
  assert.deepEqual(fr.labels.map((l) => l.kind), ['func', 'block', 'loop'])
  assert.deepEqual(fr.labels.map((l) => l.depth), [2, 1, 0])
})

test('performance: run mode exceeds 1M instructions/second on fib', () => {
  const m = instantiate(assemble(`(module (func $fib (export "fib") (param i32) (result i32)
    (if (result i32) (i32.lt_u (local.get 0) (i32.const 2)) (then (local.get 0))
      (else (i32.add (call $fib (i32.sub (local.get 0) (i32.const 1))) (call $fib (i32.sub (local.get 0) (i32.const 2))))))))`).bytes, {}, { history: 0 })
  m.invoke('fib', [24])
  const t = performance.now()
  const r = m.run()
  const dt = (performance.now() - t) / 1000
  assert.deepEqual(r.results.map((x) => x.value), [46368])
  assert.ok(r.steps / dt > 1e6, `${(r.steps / dt / 1e6).toFixed(1)}M instr/s`)
})

test('start function modes, reset(), re-entrant calls from host functions', async () => {
  const { hostFunction } = await import('../src/engine/machine.js')
  const src = `(module
    (import "h" "cb" (func $cb (param i32) (result i32)))
    (global $g (export "g") (mut i32) (i32.const 0))
    (func $init (global.set $g (i32.const 41)))
    (start $init)
    (func (export "double") (param i32) (result i32) (i32.mul (local.get 0) (i32.const 2)))
    (func (export "viaHost") (param i32) (result i32) (call $cb (local.get 0)))
    (func (export "bump") (global.set $g (i32.add (global.get $g) (i32.const 1)))))`
  let machineRef = null
  const imports = { h: { cb: hostFunction((caller, x) => caller.machine.callSync('double', [x])[0] + 1) } }
  const m = instantiate(assemble(src).bytes, imports)
  machineRef = m
  assert.equal(m.exports.g.value, 41)
  assert.deepEqual(m.call('viaHost', [10]), [21])
  m.invoke('viaHost', [5])
  const evs = []
  let e
  while ((e = m.step())) evs.push(e)
  assert.deepEqual(m.results.map((r) => r.value), [11])
  assert.equal(evs.find((x) => x.control && x.control.kind === 'host-call').control.results[0].value, 11)
  m.call('bump')
  assert.equal(m.exports.g.value, 42)
  m.reset()
  assert.equal(m.exports.g.value, 41, 'reset re-ran the start function on fresh globals')
  const p = instantiate(assemble(src).bytes, imports, { start: 'pending' })
  assert.equal(p.status, 'ready')
  assert.equal(p.exports.g.value, 0)
  assert.equal(p.location.funcIndex, 1)
  p.run()
  assert.equal(p.exports.g.value, 41)
  const skip = instantiate(assemble(src).bytes, imports, { start: 'skip' })
  assert.equal(skip.exports.g.value, 0)
  assert.equal(skip.exportedFunction('double')(21), 42)
  void machineRef
})
