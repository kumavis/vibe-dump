// Differential tests for memory, globals, bulk memory, tables and reference
// types: results, traps and resulting memory contents are compared with native.
import test from 'node:test'
import assert from 'node:assert/strict'
import { both, same } from './util.mjs'

const MEM = `
(module
  (memory (export "mem") 1 4)
  (data (i32.const 0) "\\01\\02\\03\\04\\05\\06\\07\\08\\f0\\ff\\7f\\80")
  (data $p "passive-segment!")
  (global $g (export "g") (mut i32) (i32.const 10))
  (global $gl (mut i64) (i64.const -5))
  (global $gf (mut f64) (f64.const 1.5))
  (global $const i32 (i32.const 77))

  (func (export "load") (param $a i32) (result i32 i32 i32 i32 i32)
    (i32.load (local.get $a))
    (i32.load8_s offset=8 (local.get $a))
    (i32.load8_u offset=8 (local.get $a))
    (i32.load16_s offset=9 (local.get $a))
    (i32.load16_u align=1 offset=9 (local.get $a)))
  (func (export "load64") (param $a i32) (result i64 i64 i64 i64 i64 i64 i64)
    (i64.load (local.get $a))
    (i64.load8_s offset=9 (local.get $a)) (i64.load8_u offset=9 (local.get $a))
    (i64.load16_s offset=10 (local.get $a)) (i64.load16_u offset=10 (local.get $a))
    (i64.load32_s offset=8 (local.get $a)) (i64.load32_u offset=8 (local.get $a)))
  (func (export "loadf") (param $a i32) (result f32 f64)
    (f32.load (local.get $a)) (f64.load (local.get $a)))
  (func (export "store") (param $a i32) (param $v i64)
    (i64.store offset=100 (local.get $a) (local.get $v))
    (i64.store8 offset=110 (local.get $a) (local.get $v))
    (i64.store16 offset=112 (local.get $a) (local.get $v))
    (i64.store32 offset=116 (local.get $a) (local.get $v))
    (i32.store offset=120 (local.get $a) (i32.wrap_i64 (local.get $v)))
    (i32.store8 offset=124 (local.get $a) (i32.wrap_i64 (local.get $v)))
    (i32.store16 offset=126 (local.get $a) (i32.wrap_i64 (local.get $v)))
    (f32.store offset=128 (local.get $a) (f32.convert_i64_s (local.get $v)))
    (f64.store offset=132 (local.get $a) (f64.convert_i64_u (local.get $v))))
  (func (export "readback") (param $a i32) (result i64 i64 i64 i64 i64)
    (i64.load offset=100 (local.get $a)) (i64.load offset=108 (local.get $a))
    (i64.load offset=116 (local.get $a)) (i64.load offset=124 (local.get $a))
    (i64.load offset=132 (local.get $a)))
  (func (export "size") (result i32) (memory.size))
  (func (export "grow") (param i32) (result i32) (memory.grow (local.get 0)))
  (func (export "globals") (param i32) (result i32 i64 f64 i32)
    (global.set $g (i32.add (global.get $g) (local.get 0)))
    (global.set $gl (i64.mul (global.get $gl) (i64.extend_i32_s (local.get 0))))
    (global.set $gf (f64.div (global.get $gf) (f64.convert_i32_s (local.get 0))))
    (global.get $g) (global.get $gl) (global.get $gf) (global.get $const))
  (func (export "fill") (param i32 i32 i32) (memory.fill (local.get 0) (local.get 1) (local.get 2)))
  (func (export "copy") (param i32 i32 i32) (memory.copy (local.get 0) (local.get 1) (local.get 2)))
  (func (export "init") (param i32 i32 i32) (memory.init $p (local.get 0) (local.get 1) (local.get 2)))
  (func (export "drop") (data.drop $p))
  (func (export "sum") (param $a i32) (param $n i32) (result i32) (local $s i32)
    (block $d (loop $l
      (br_if $d (i32.eqz (local.get $n)))
      (local.set $s (i32.add (local.get $s) (i32.load8_u (local.get $a))))
      (local.set $a (i32.add (local.get $a) (i32.const 1)))
      (local.set $n (i32.sub (local.get $n) (i32.const 1)))
      (br $l)))
    (local.get $s))
)`

function memEqual(native, machine, label) {
  const a = new Uint8Array(native.mem.buffer)
  const b = machine.memory.bytes
  assert.equal(b.length, a.length, `${label}: memory size`)
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) assert.fail(`${label}: memory differs at ${i}: native ${a[i]} engine ${b[i]}`)
}

test('memory loads/stores/grow/bulk ops match native, including traps and contents', async () => {
  const { native, machine } = await both(MEM)
  const s = (name, args = []) => same(native, machine, name, args)
  for (const a of [0, 1, 3, 65524, 65525, 65536, -1, -12]) {
    s('load', [a])
    s('load64', [a])
    s('loadf', [a])
  }
  for (const [a, v] of [[0, -2n], [7, 0x0102030405060708n], [65400, 1n << 63n], [65401, 5n], [-8, 1n]]) {
    s('store', [a, v])
    s('readback', [a])
  }
  memEqual(native, machine, 'after stores')
  for (const d of [-1, 0, 1]) s('globals', [d === -1 ? 3 : d + 2])
  s('fill', [10, 0xab, 20])
  s('fill', [65530, 1, 7]) // OOB: no partial write
  s('fill', [65536, 1, 0]) // zero length at the end is fine
  s('fill', [65537, 1, 0])
  s('copy', [5, 0, 30]) // overlapping forward
  s('copy', [0, 5, 30]) // overlapping backward
  s('copy', [65530, 0, 7])
  s('copy', [0, 65530, 7])
  s('init', [200, 0, 16])
  s('init', [300, 8, 9])
  s('init', [300, 0, 0])
  s('init', [65535, 0, 2])
  memEqual(native, machine, 'after bulk ops')
  s('drop')
  s('init', [0, 0, 1])
  s('init', [0, 0, 0])
  s('size')
  s('grow', [1])
  s('grow', [0])
  s('grow', [5])
  s('grow', [2])
  s('size')
  s('fill', [65536 * 3, 0x5a, 65536])
  s('sum', [65536 * 3 - 10, 100])
  memEqual(native, machine, 'after grow')
})

const TABLES = `
(module
  (type $v_i (func (result i32)))
  (table $t (export "t") 4 10 funcref)
  (table $e 2 externref)
  (elem (table $t) (i32.const 0) func $one $two)
  (elem $pass func $three $one)
  (elem $exprs funcref (ref.func $two) (ref.null func))
  (elem declare func $three)
  (func $one (type $v_i) (i32.const 1))
  (func $two (type $v_i) (i32.const 2))
  (func $three (type $v_i) (i32.const 3))
  (func (export "call") (param i32) (result i32) (call_indirect $t (type $v_i) (local.get 0)))
  (func (export "size") (result i32) (table.size $t))
  (func (export "grow") (param i32) (result i32) (table.grow $t (ref.func $three) (local.get 0)))
  (func (export "grow_null") (param i32) (result i32) (table.grow $t (ref.null func) (local.get 0)))
  (func (export "is_null") (param i32) (result i32) (ref.is_null (table.get $t (local.get 0))))
  (func (export "set_null") (param i32) (table.set $t (local.get 0) (ref.null func)))
  (func (export "set3") (param i32) (table.set $t (local.get 0) (ref.func $three)))
  (func (export "fill") (param i32 i32) (table.fill $t (local.get 0) (ref.func $two) (local.get 1)))
  (func (export "copy") (param i32 i32 i32) (table.copy $t $t (local.get 0) (local.get 1) (local.get 2)))
  (func (export "init") (param i32 i32 i32) (table.init $t $pass (local.get 0) (local.get 1) (local.get 2)))
  (func (export "init_exprs") (param i32 i32 i32) (table.init $t $exprs (local.get 0) (local.get 1) (local.get 2)))
  (func (export "drop") (elem.drop $pass))
  (func (export "ext_set") (param i32 externref) (table.set $e (local.get 0) (local.get 1)))
  (func (export "ext_get") (param i32) (result externref) (table.get $e (local.get 0)))
  (func (export "ext_null") (param externref) (result i32) (ref.is_null (local.get 0)))
  (func (export "get_func") (param i32) (result funcref) (table.get $t (local.get 0)))
)`

test('tables, element segments and reference types match native', async () => {
  const { native, machine } = await both(TABLES)
  const s = (name, args = []) => same(native, machine, name, args)
  const calls = () => {
    const n = native.size()
    for (let i = 0; i <= n; i++) s('call', [i])
  }
  calls()
  s('is_null', [0])
  s('is_null', [3])
  s('is_null', [4])
  s('init', [2, 0, 2])
  calls()
  s('init', [3, 1, 2]) // OOB table
  s('init', [0, 1, 2]) // OOB segment
  s('init_exprs', [1, 0, 2])
  calls()
  s('drop')
  s('init', [0, 0, 1])
  s('init', [0, 0, 0])
  s('grow', [2])
  s('grow_null', [1])
  s('size')
  s('grow', [10])
  calls()
  s('fill', [1, 3])
  s('fill', [5, 3])
  calls()
  s('copy', [0, 4, 3])
  s('copy', [2, 0, 5])
  s('copy', [5, 0, 3])
  calls()
  s('set_null', [1])
  s('set3', [6])
  s('set3', [7])
  calls()
  const obj = { extern: 'hello' }
  native.ext_set(1, obj)
  machine.call('ext_set', [1, obj])
  assert.equal(machine.call('ext_get', [1])[0], obj)
  assert.equal(native.ext_get(1), obj)
  s('ext_get', [0])
  s('ext_get', [2])
  s('ext_null', [null])
  s('ext_null', [obj])
  s('get_func', [0])
  s('get_func', [1])
})

test('imports: host functions, imported memory/global and cross-instance calls', async () => {
  const { instantiate, Memory, Global, hostFunction } = await import('../src/engine/machine.js')
  const { assemble } = await import('../src/engine/wat.js')
  const lib = instantiate(assemble(`(module
    (memory (export "m") 1)
    (global (export "base") i32 (i32.const 1000))
    (global (export "counter") (mut i32) (i32.const 0))
    (func (export "triple") (param i32) (result i32) (i32.mul (local.get 0) (i32.const 3))))`).bytes)
  const log = []
  const app = instantiate(assemble(`(module
    (import "lib" "m" (memory 1))
    (import "lib" "base" (global $base i32))
    (import "lib" "counter" (global $c (mut i32)))
    (import "lib" "triple" (func $triple (param i32) (result i32)))
    (import "host" "log" (func $log (param i32 i64 f64)))
    (import "host" "pair" (func $pair (param i32) (result i32 i32)))
    (import "host" "poke" (func $poke (param i32)))
    (func (export "go") (param i32) (result i32)
      (call $log (local.get 0) (i64.const -9) (f64.const 0.25))
      (global.set $c (i32.add (global.get $c) (i32.const 1)))
      (i32.store (global.get $base) (call $triple (local.get 0)))
      (call $poke (i32.const 2000))
      (i32.add (call $pair (local.get 0)))
      (i32.add (i32.load (global.get $base)))
      (i32.add (i32.load (i32.const 2000)))))`).bytes, {
    lib: lib.exports,
    host: {
      log: (a, b, c) => log.push([a, b, c]),
      pair: (x) => [x, x * 10],
      poke: hostFunction((caller, addr) => caller.setU32(addr, 0xabcd)),
    },
  })
  assert.deepEqual(app.call('go', [7]), [7 + 70 + 21 + 0xabcd])
  assert.deepEqual(log, [[7, -9n, 0.25]])
  assert.equal(lib.exports.counter.value, 1)
  assert.equal(new DataView(lib.memory.bytes.buffer).getInt32(1000, true), 21)
  // step through: the call into the other instance is a real frame
  app.invoke('go', [2])
  const kinds = []
  let ev
  while ((ev = app.step())) if (ev.control) kinds.push(ev.control.kind + (ev.control.crossInstance ? '*' : ''))
  assert.deepEqual(kinds, ['host-call', 'call*', 'return', 'host-call', 'host-call', 'return'])
  assert.ok(Memory && Global)
})
