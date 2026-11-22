// WAT assembler: literal forms, syntax coverage, errors with positions, the
// source map and the emitted name section. Outputs are checked against native
// WebAssembly (validation + behaviour).
import test from 'node:test'
import assert from 'node:assert/strict'
import { assemble, WatError } from '../src/engine/wat.js'
import { decode } from '../src/engine/decode.js'
import { instantiate } from '../src/engine/machine.js'
import { f32Bits, f64Words } from '../src/engine/values.js'

const run1 = (body, result) => {
  const { bytes } = assemble(`(module (func (export "f") (result ${result}) ${body}))`)
  assert.ok(WebAssembly.validate(bytes), 'native validates')
  const nat = new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports.f()
  const ours = instantiate(bytes).call('f')[0]
  return { nat, ours }
}

test('integer literals: decimal, hex, underscores, signs, wraparound', () => {
  const cases = [
    ['i32.const 0x7fff_ffff', 2147483647], ['i32.const -0x8000_0000', -2147483648], ['i32.const 0xffffffff', -1],
    ['i32.const 4294967295', -1], ['i32.const +1_000', 1000], ['i32.const -0', 0], ['i32.const 0XaB', 0xab],
  ]
  for (const [src, want] of cases) assert.equal(run1(`(${src})`, 'i32').ours, want, src)
  const cases64 = [
    ['i64.const 0xffff_ffff_ffff_ffff', -1n], ['i64.const -9223372036854775808', -(2n ** 63n)], ['i64.const 18446744073709551615', -1n],
    ['i64.const 0x0123_4567_89ab_cdef', 0x0123456789abcdefn],
  ]
  for (const [src, want] of cases64) assert.equal(run1(`(${src})`, 'i64').ours, want, src)
  for (const bad of ['i32.const 4294967296', 'i32.const -2147483649', 'i32.const 1__0', 'i32.const _1', 'i32.const 0x', 'i64.const 18446744073709551616'])
    assert.throws(() => assemble(`(module (func (${bad}) drop))`), WatError, bad)
})

test('float literals are bit exact (decimal, hex, inf, nan payloads, rounding)', () => {
  const f32 = [
    '0.0', '-0.0', '1.5', '-1.5e-3', '0x1p-149', '0x1.fffffep127', '3.4028235e38', 'inf', '-inf', 'nan', '-nan', 'nan:0x200000', 'nan:0x1',
    '1.000000059604644775390625', '1.00000005960464477539062501', '0x1.000001p0', '0x1.0000010000000000001p0', '1e-46', '7e-46', '0x.8p1', '0x1P+2', '1_000.000_1', '1e+10',
  ]
  for (const lit of f32) {
    const { bytes } = assemble(`(module (func (export "f") (result i32) (i32.reinterpret_f32 (f32.const ${lit}))))`)
    const nat = new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports.f()
    // native decodes the same bytes, so compare with an independent parse where JS can do it exactly
    const ours = instantiate(bytes).call('f')[0]
    assert.equal(ours, nat, lit)
    if (/^[-+]?[0-9.e+-]+$/i.test(lit) && !/_/.test(lit)) {
      // reference: correctly rounded decimal -> f32 via exact f64 is valid only when the f64 is not a tie;
      // these specific literals were chosen to exercise the tie-breaking path:
      if (lit === '1.000000059604644775390625') assert.equal(ours, 0x3f800000) // exact tie -> even
      if (lit === '1.00000005960464477539062501') assert.equal(ours, 0x3f800001) // just above the tie
    }
  }
  assert.equal(run1('(i32.reinterpret_f32 (f32.const nan:0x200000))', 'i32').ours, 0x7fa00000)
  assert.equal(run1('(i32.reinterpret_f32 (f32.const -nan))', 'i32').ours, 0xffc00000 | 0)
  const f64 = ['0x1.fffffffffffffp1023', '0x1p-1074', '2.2250738585072011e-308', 'nan:0xf_ffff_ffff_ffff', '-0x1.8p+3', '4.9406564584124654e-324', '1.7976931348623157e308', '0.1']
  for (const lit of f64) {
    const { bytes } = assemble(`(module (func (export "f") (result i64) (i64.reinterpret_f64 (f64.const ${lit}))))`)
    const nat = new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports.f()
    assert.equal(instantiate(bytes).call('f')[0], nat, lit)
    if (/^[0-9.e+-]+$/.test(lit)) {
      const [hi, lo] = f64Words(Number(lit))
      assert.equal(nat, BigInt.asIntN(64, (BigInt(hi) << 32n) | BigInt(lo)), `${lit} matches JS Number()`)
    }
  }
  assert.equal(f32Bits(Math.fround(0.1)), 0x3dcccccd)
  for (const bad of ['f32.const 1e39', 'f32.const 0x1p128', 'f64.const 1e309', 'f32.const nan:0x800000', 'f32.const nan:0x0', 'f32.const 1.e', 'f32.const .5'])
    assert.throws(() => assemble(`(module (func (${bad}) drop))`), WatError, bad)
})

test('comments, folded/flat forms, labels, block types and multi-value', () => {
  const src = `
  ;; line comment
  (module (; block (; nested ;) comment ;)
    (type $two (func (param i32) (result i32 i32)))
    (func $dup (export "dup") (type $two) local.get 0 local.get 0)
    (func (export "flat") (param $n i32) (result i32)
      block $out (result i32)
        loop $top
          local.get $n
          i32.eqz
          if
            i32.const 99
            br $out
          else
            local.get $n
            i32.const 1
            i32.sub
            local.set $n
          end
          br $top
        end
        unreachable
      end $out)
    (func (export "folded") (param $n i32) (result i32)
      (block $out (result i32)
        (loop $top
          (if (i32.eqz (local.get $n))
            (then (br $out (i32.const 99)))
            (else (local.set $n (i32.sub (local.get $n) (i32.const 1)))))
          (br $top))
        (unreachable)))
    (func (export "mv") (param i32) (result i32)
      (call $dup (local.get 0))
      (block $b (param i32 i32) (result i32) (i32.add))
      (block (type $two) (param i32) (result i32 i32) (i32.const 2))
      (i32.mul)))`
  const { bytes } = assemble(src)
  assert.ok(WebAssembly.validate(bytes))
  const m = instantiate(bytes)
  const nat = new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports
  assert.deepEqual(m.call('flat', [5]), [99])
  assert.deepEqual(m.call('folded', [5]), [99])
  assert.deepEqual(m.call('mv', [7]), [nat.mv(7)])
  assert.deepEqual(m.call('dup', [3]), nat.dup(3))
  // flat and folded encodings of the same function are byte-identical
  const mod = decode(bytes)
  const enc = (f) => [...bytes.subarray(mod.funcs[f].body.codeOffset, mod.funcs[f].body.end)]
  assert.deepEqual(enc(1), enc(2))
})

test('module fields: imports, exports, memory/data, table/elem, globals, start', () => {
  const src = `(module
    (import "env" "log" (func $log (param i32)))
    (import "env" "g" (global $ig i32))
    (func $inl (import "env" "inl") (result i32))
    (memory $m (export "memory") 1 2)
    (data (i32.const 8) "hi" "\\00\\ff\\u{263a}")
    (data $pass "xyz")
    (table $t (export "tab") 3 funcref)
    (table $ti funcref (elem $a $b))
    (elem (table $t) (offset (i32.const 1)) func $a)
    (elem $pe funcref (ref.func $b) (item ref.null func))
    (elem declare func $a)
    (global $cnt (export "cnt") (mut i32) (global.get $ig))
    (global $f f64 (f64.const -0x1.8p0))
    (func $a (result i32) (i32.const 1))
    (func $b (result i32) (i32.const 2))
    (func $init (global.set $cnt (i32.add (global.get $cnt) (call $inl))))
    (start $init)
    (func (export "f") (result i32)
      (call $log (i32.load8_u offset=9 align=1 (i32.const 0)))
      (memory.init $pass (i32.const 0) (i32.const 0) (i32.const 3))
      (table.init $t $pe (i32.const 0) (i32.const 0) (i32.const 1))
      (i32.add (call_indirect $t (result i32) (i32.const 0)) (global.get $cnt))))`
  const { bytes } = assemble(src)
  assert.ok(WebAssembly.validate(bytes))
  const logs = []
  const env = { log: (x) => logs.push(x), g: 40, inl: () => 2 }
  const m = instantiate(bytes, { env })
  assert.equal(m.exports.cnt.value, 42, 'start function ran')
  assert.deepEqual(m.call('f'), [2 + 42])
  assert.deepEqual(logs, [105])
  assert.deepEqual([...m.memory.bytes.slice(8, 15)], [0x68, 0x69, 0, 0xff, 0xe2, 0x98, 0xba])
  const nat = new WebAssembly.Instance(new WebAssembly.Module(bytes), { env: { log: () => {}, g: 40, inl: () => 2 } }).exports
  assert.equal(nat.f(), 44)
  const mod = decode(bytes)
  assert.equal(mod.names.funcs.get(0), 'log')
  assert.equal(mod.names.funcs.get(2), 'a')
  assert.equal(mod.names.globals.get(1), 'cnt')
  assert.equal(mod.names.datas.get(1), 'pass')
  assert.equal(mod.names.tables.get(0), 't')
  assert.equal(mod.names.memories.get(0), 'm')
  assert.equal(mod.elems.length, 4)
})

test('errors carry line and column', () => {
  const cases = [
    ['(module\n  (func (result i32)\n    (i32.const 1)\n    (i32.frob)))', 4, 6, /unknown instruction "i32.frob"/],
    ['(module (func\n (local.get $nope)))', 2, 13, /unknown local \$nope/],
    ['(module (func (br $missing)))', 1, 19, /unknown label/],
    ['(module\n(func (export "a")) (func (export "a")))', 2, 27, /duplicate export/],
    ['(module (func (i32.const 1)', 1, 9, /unclosed/],
    ['(module (data "abc\n"))', 1, 19, /newline in string/],
    ['(module (func v128.const i32x4 0 0 0 0))', 1, 15, /SIMD/],
    ['(module (memory i64 1))', 1, 17, /memory64/],
  ]
  for (const [src, line, col, re] of cases) {
    try {
      assemble(src)
      assert.fail('expected error for ' + src)
    } catch (e) {
      assert.ok(e instanceof WatError, String(e))
      assert.match(e.message, re)
      assert.equal(e.line, line, `${src}: line`)
      assert.equal(e.col, col, `${src}: col (${e.message})`)
    }
  }
})

test('source map points every instruction at its source text', () => {
  const src = `(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  (func (export "g") (result i32)
    (i32.mul (call $add (i32.const 2) (i32.const 3)) (i32.const 4))))`
  const { bytes, sourceMap } = assemble(src)
  const mod = decode(bytes)
  const text = (fi) => sourceMap.funcs[fi].map((r) => src.slice(r.start, r.end))
  assert.deepEqual(text(0), ['local.get $a', 'local.get $b', 'i32.add', ')'])
  assert.deepEqual(text(1), ['(i32.const 2)', '(i32.const 3)', '(call $add (i32.const 2) (i32.const 3))', '(i32.const 4)', '(i32.mul (call $add (i32.const 2) (i32.const 3)) (i32.const 4))', ')'])
  for (const fi of [0, 1]) assert.equal(sourceMap.funcs[fi].length, mod.funcs[fi].body.code.length)
  const r = sourceMap.funcs[0][2]
  assert.deepEqual([r.line, r.col, r.endLine, r.endCol], [5, 5, 5, 12])
  assert.equal(src.slice(sourceMap.funcs[1][2].keyword.start, sourceMap.funcs[1][2].keyword.end), 'call')
  assert.equal(sourceMap.funcs[1][4].op, 'i32.mul')
})

test('(module binary ...) passes bytes through', () => {
  const { bytes } = assemble('(module binary "\\00asm" "\\01\\00\\00\\00")')
  assert.deepEqual([...bytes], [0, 0x61, 0x73, 0x6d, 1, 0, 0, 0])
})
