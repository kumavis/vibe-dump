// Differential tests (engine vs native WebAssembly) for control flow:
// nested blocks, br/br_if/br_table, loops, multi-value blocks, early return,
// recursion, call_indirect (incl. traps), select, unreachable, stack exhaustion.
// Each program runs both in run() mode and one instruction at a time via step().
import test from 'node:test'
import assert from 'node:assert/strict'
import { both, same } from './util.mjs'

const PROGRAM = `
(module
  (type $ii_i (func (param i32 i32) (result i32)))
  (type $i_i (func (param i32) (result i32)))
  (type $pair (func (param i32) (result i32 i32)))
  (table $t 6 funcref)
  (elem (table $t) (i32.const 0) func $add $sub $mulf $sq)
  (func $add (type $ii_i) (i32.add (local.get 0) (local.get 1)))
  (func $sub (type $ii_i) (i32.sub (local.get 0) (local.get 1)))
  (func $mulf (param f32 f32) (result f32) (f32.mul (local.get 0) (local.get 1)))
  (func $sq (type $i_i) (i32.mul (local.get 0) (local.get 0)))

  (func $fib (export "fib") (param $n i32) (result i32)
    (if (result i32) (i32.lt_u (local.get $n) (i32.const 2))
      (then (local.get $n))
      (else (i32.add (call $fib (i32.sub (local.get $n) (i32.const 1)))
                     (call $fib (i32.sub (local.get $n) (i32.const 2)))))))

  (func (export "fact64") (param $n i64) (result i64)
    (if (result i64) (i64.le_s (local.get $n) (i64.const 1))
      (then (i64.const 1))
      (else (i64.mul (local.get $n) (call 5 (i64.sub (local.get $n) (i64.const 1)))))))

  (func (export "fact_iter") (param $n i32) (result i64) (local $acc i64)
    (local.set $acc (i64.const 1))
    (block $done
      (loop $again
        (br_if $done (i32.le_s (local.get $n) (i32.const 1)))
        (local.set $acc (i64.mul (local.get $acc) (i64.extend_i32_u (local.get $n))))
        (local.set $n (i32.sub (local.get $n) (i32.const 1)))
        (br $again)))
    (local.get $acc))

  (func (export "switch") (param i32) (result i32)
    (block $d (block $c (block $b (block $a
      (br_table $a $b $c $d (local.get 0)))
      (return (i32.const 100)))
      (return (i32.const 101)))
      (return (i32.const 102)))
    (i32.const 103))

  ;; br_table carrying a value through several levels
  (func (export "brtable_value") (param i32) (result i32)
    (block $outer (result i32)
      (block $inner (result i32)
        (i32.const 7)
        (local.get 0)
        (br_table $inner $outer $inner))
      (i32.const 1000)
      (i32.add)))

  ;; nested blocks with values left below the branch operand (unwinding)
  (func (export "unwind") (param i32) (result i32)
    (block $b (result i32)
      i32.const 1 i32.const 2 i32.const 3
      i32.const 42 local.get 0 br_if $b
      drop drop drop drop
      i32.const 9))

  ;; multi-value: block with params and two results, function with two results
  (func $divmod (export "divmod") (param i32 i32) (result i32 i32)
    (i32.div_u (local.get 0) (local.get 1))
    (i32.rem_u (local.get 0) (local.get 1)))
  (func (export "mv_block") (param i32) (result i32)
    (local.get 0)
    (i32.const 10)
    (block (type $ii_i) (param i32 i32) (result i32)
      (i32.mul))
    (block (param i32) (result i32 i32)
      (i32.const 3))
    (i32.sub))
  (func (export "mv_call") (param i32 i32) (result i32)
    (call $divmod (local.get 0) (local.get 1))
    (i32.add))
  (func (export "mv_loop") (param $n i32) (result i32) (local $i i32)
    (i32.const 0)
    (loop $l (param i32) (result i32)
      (local.get $i) (i32.add)
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $l (i32.lt_s (local.get $i) (local.get $n)) (local.tee 1 (local.get $i)) (drop)))
    )

  (func (export "early_return") (param i32) (result i32)
    (block
      (loop
        (if (i32.gt_s (local.get 0) (i32.const 10)) (then (return (i32.const -1))))
        (local.set 0 (i32.add (local.get 0) (i32.const 3)))
        (br_if 1 (i32.eq (local.get 0) (i32.const 9)))
        (br 0)))
    (local.get 0))

  (func (export "if_noelse") (param i32) (result i32) (local i32)
    (if (local.get 0) (then (local.set 1 (i32.const 5))))
    (local.get 1))

  (func (export "if_params") (param i32 i32) (result i32)
    (local.get 0)
    (local.get 1)
    (if (param i32) (result i32) (then (i32.const 1) (i32.add)) (else (i32.const 2) (i32.mul))))

  (func (export "call_indirect") (param $i i32) (param $a i32) (param $b i32) (result i32)
    (call_indirect $t (type $ii_i) (local.get $a) (local.get $b) (local.get $i)))
  (func (export "call_indirect1") (param $i i32) (param $a i32) (result i32)
    (call_indirect $t (type $i_i) (local.get $a) (local.get $i)))

  (func (export "select") (param i32 i64 i64) (result i64)
    (select (local.get 1) (local.get 2) (local.get 0)))
  (func (export "select_t") (param i32) (result f64)
    (select (result f64) (f64.const -0) (f64.const nan) (local.get 0)))

  (func (export "unreachable_in_block") (param i32) (result i32)
    (block (result i32) (br_if 0 (i32.const 7) (local.get 0)) (unreachable)))

  (func $deep (export "deep") (param i32) (result i32)
    (if (result i32) (i32.eqz (local.get 0)) (then (i32.const 0))
      (else (i32.add (i32.const 1) (call $deep (i32.sub (local.get 0) (i32.const 1)))))))
  (func $forever (export "forever") (call $forever))

  (func (export "nested_loops") (param $n i32) (result i32) (local $i i32) (local $j i32) (local $s i32)
    (loop $li
      (local.set $j (i32.const 0))
      (loop $lj
        (local.set $s (i32.add (local.get $s) (i32.mul (local.get $i) (local.get $j))))
        (local.set $j (i32.add (local.get $j) (i32.const 1)))
        (br_if $lj (i32.lt_u (local.get $j) (local.get $n))))
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $li (i32.lt_u (local.get $i) (local.get $n))))
    (local.get $s))
)`

test('control flow matches native (run and step modes)', async () => {
  const { native, machine } = await both(PROGRAM, { options: { maxCallDepth: 3000 } })
  for (const stepMode of [false, true]) {
    const o = { stepMode }
    for (const n of [0, 1, 2, 10, 20]) same(native, machine, 'fib', [n], o)
    for (const n of [0n, 1n, 5n, 20n, 25n]) same(native, machine, 'fact64', [n], o)
    for (const n of [0, 1, 5, 20, 21]) same(native, machine, 'fact_iter', [n], o)
    for (const i of [-1, 0, 1, 2, 3, 4, 100]) same(native, machine, 'switch', [i], o)
    for (const i of [0, 1, 2, 3, -5]) same(native, machine, 'brtable_value', [i], o)
    for (const i of [0, 1]) same(native, machine, 'unwind', [i], o)
    for (const [a, b] of [[17, 5], [0, 3], [-1, 7], [5, 0]]) {
      same(native, machine, 'divmod', [a, b], o)
      same(native, machine, 'mv_call', [a, b], o)
    }
    for (const i of [0, 4, -2]) same(native, machine, 'mv_block', [i], o)
    for (const n of [1, 2, 10]) same(native, machine, 'mv_loop', [n], o)
    for (const i of [0, 3, 6, 11, -100]) same(native, machine, 'early_return', [i], o)
    for (const i of [0, 1]) same(native, machine, 'if_noelse', [i], o)
    for (const [c, v] of [[0, 5], [1, 5]]) same(native, machine, 'if_params', [v, c], o)
    for (const i of [0, 1, 2, 3, 4, 5, 6, -1]) same(native, machine, 'call_indirect', [i, 30, 12], o)
    for (const i of [0, 3, 4, 7]) same(native, machine, 'call_indirect1', [i, 9], o)
    for (const c of [0, 1, 2]) same(native, machine, 'select', [c, -5n, 1n << 62n], o)
    for (const c of [0, 1]) same(native, machine, 'select_t', [c], o)
    for (const c of [0, 1]) same(native, machine, 'unreachable_in_block', [c], o)
    same(native, machine, 'deep', [1000], o)
    for (const n of [1, 3, 12]) same(native, machine, 'nested_loops', [n], o)
  }
  // stack exhaustion is a structured trap, not a JS exception
  machine.invoke('forever')
  const r = machine.run()
  assert.equal(r.reason, 'trap')
  assert.equal(r.trap.kind, 'call-stack-exhausted')
  const ev = (machine.invoke('forever'), machine.run({ maxSteps: 2999 * 1 }), machine.step())
  assert.equal(ev.control.kind, 'trap')
  assert.equal(ev.trap.kind, 'call-stack-exhausted')
})

test('call_indirect trap kinds', async () => {
  const { machine } = await both(PROGRAM)
  const kind = (args) => {
    machine.invoke('call_indirect', args)
    machine.run()
    return machine.trap && machine.trap.kind
  }
  assert.equal(kind([2, 1, 2]), 'indirect-call-type-mismatch')
  assert.equal(kind([3, 1, 2]), 'indirect-call-type-mismatch')
  assert.equal(kind([4, 1, 2]), 'uninitialized-element')
  assert.equal(kind([6, 1, 2]), 'undefined-element')
  assert.equal(kind([-1, 1, 2]), 'undefined-element')
  assert.equal(kind([0, 1, 2]), null)
})
