// Table-driven differential test of every numeric / conversion opcode against
// Node's native WebAssembly. Floats cross the JS boundary as raw bit patterns
// (i32 / i64) so NaN payloads and -0 are compared exactly.
import test from 'node:test'
import assert from 'node:assert/strict'
import { assemble } from '../src/engine/wat.js'
import { instantiate, Trap } from '../src/engine/machine.js'
import { OPS } from '../src/engine/opcodes.js'

const I32 = [0, 1, -1, 2, 3, 7, 31, 32, 33, 63, 64, 0xff, 0x8000, 0x7fffffff, -0x80000000, -0x7fffffff, 0x12345678, -0x12345678, 0x55555555, -0x55555556]
const I64 = [0n, 1n, -1n, 2n, 31n, 32n, 63n, 64n, 65n, 0xffffffffn, 0x100000000n, -0x100000000n, 0x7fffffffffffffffn, -0x8000000000000000n, -0x7fffffffffffffffn, 0x0123456789abcdefn, -0x0123456789abcdefn, 0x5555555555555555n, 0x8000000000000001n - (1n << 64n)]
const f32b = (x) => {
  const b = new Float32Array([x])
  return new Int32Array(b.buffer)[0]
}
const f64b = (x) => {
  const b = new Float64Array([x])
  return new BigInt64Array(b.buffer)[0]
}
const F32 = [
  0, -0, 1, -1, 0.5, -0.5, 1.5, -1.5, 2.5, -2.5, 3.5, 0.49999997, -0.49999997, 1e10, -1e10, 3.4028234663852886e38,
  1.1754943508222875e-38, 1.401298464324817e-45, -1.401298464324817e-45, Infinity, -Infinity,
  2147483520, 2147483648, -2147483648, -2147483904, 4294967040, 4294967296, -0.9, 0.9, 9223371487098961920, 9223372036854775808,
  -9223372036854775808, 18446742974197923840, 18446744073709551616, 8388609, 16777217, 123.456,
].map(f32b).concat([0x7fc00000, 0x7fa00000, 0xffc00001 | 0, 0x7f800001, 0xff812345 | 0])
const F64 = [
  0, -0, 1, -1, 0.5, -0.5, 1.5, -1.5, 2.5, -2.5, 4.5, 0.49999999999999994, -0.49999999999999994, 1e300, -1e300,
  Number.MAX_VALUE, Number.MIN_VALUE, -Number.MIN_VALUE, 2.2250738585072014e-308, Infinity, -Infinity,
  2147483647, 2147483647.9, 2147483648, -2147483648, -2147483648.9, -2147483649, 4294967295, 4294967295.9, 4294967296, -0.99,
  9223372036854774784, 9223372036854775808, -9223372036854775808, -9223372036854777856, 18446744073709549568, 18446744073709551616,
  Math.PI, 1 / 3, 3.4028235677973366e38, 3.4028234663852886e38, 1.401298464324817e-45, 7.006492321624085e-46, 9007199254740993,
].map(f64b).concat([0x7ff8000000000000n, 0x7ff4000000000000n, -0x7fffffffffffffffn, 0x7ff0000000000001n, BigInt.asIntN(64, 0xfff8000000000123n)])
const EDGE = { i32: I32, i64: I64, f32: F32, f64: F64 }

// deterministic PRNG for extra random operands
let seed = 0x9e3779b9
const rnd32 = () => {
  seed ^= seed << 13
  seed ^= seed >>> 17
  seed ^= seed << 5
  return seed | 0
}
const RANDOM = {
  i32: () => rnd32(),
  i64: () => BigInt.asIntN(64, (BigInt(rnd32() >>> 0) << 32n) | BigInt(rnd32() >>> 0)),
  f32: () => rnd32(),
  f64: () => BigInt.asIntN(64, (BigInt(rnd32() >>> 0) << 32n) | BigInt(rnd32() >>> 0)),
}

const bitsType = (t) => (t === 'f32' ? 'i32' : t === 'f64' ? 'i64' : t)
const ops = OPS.filter((o) => o && o.sig && o.imm === 'none' && o.name !== 'nop')

function buildModule() {
  let src = '(module\n'
  for (const o of ops) {
    const { params, results } = o.sig
    const ps = params.map((t) => `(param ${bitsType(t)})`).join(' ')
    const rs = results.map((t) => `(result ${bitsType(t)})`).join(' ')
    const args = params.map((t, i) => (t === 'f32' ? `(f32.reinterpret_i32 (local.get ${i}))` : t === 'f64' ? `(f64.reinterpret_i64 (local.get ${i}))` : `(local.get ${i})`)).join(' ')
    let body = `(${o.name} ${args})`
    if (results[0] === 'f32') body = `(i32.reinterpret_f32 ${body})`
    if (results[0] === 'f64') body = `(i64.reinterpret_f64 ${body})`
    src += `  (func (export "${o.name}") ${ps} ${rs} ${body})\n`
  }
  return src + ')'
}

const isNaNBits = (t, b) => (t === 'f32' ? (b & 0x7f800000) === 0x7f800000 && (b & 0x7fffff) !== 0 : (b & 0x7ff0000000000000n) === 0x7ff0000000000000n && (b & 0xfffffffffffffn) !== 0n)
// operations whose float result must be bit-exact even for NaN (sign/bit manipulation)
const BITWISE = /\.(abs|neg|copysign|reinterpret_i32|reinterpret_i64)$/

const v8Kind = (msg) => {
  if (/divide by zero|remainder by zero/.test(msg)) return 'integer-divide-by-zero'
  if (/unrepresentable/.test(msg)) return 'invalid-or-overflow'
  if (/integer overflow|divide result unrepresentable/.test(msg)) return 'integer-overflow'
  return msg
}

test('every numeric opcode matches native WebAssembly on edge and random operands', async () => {
  const { bytes } = assemble(buildModule())
  const native = (await WebAssembly.instantiate(bytes)).instance.exports
  const m = instantiate(bytes, {}, { history: 0 })
  let cases = 0
  for (const o of ops) {
    const { params, results } = o.sig
    const edges = params.map((t) => EDGE[t])
    const combos = []
    if (params.length === 1) for (const a of edges[0]) combos.push([a])
    else for (const a of edges[0]) for (const b of edges[1]) combos.push([a, b])
    for (let k = 0; k < 150; k++) combos.push(params.map((t) => RANDOM[t]()))
    for (const args of combos) {
      cases++
      let nat, natErr = null, ours, ourErr = null
      try {
        nat = native[o.name](...args)
      } catch (e) {
        natErr = e
      }
      try {
        ours = m.call(o.name, args)[0]
      } catch (e) {
        ourErr = e
      }
      const label = `${o.name}(${args.map(String).join(', ')})`
      if (natErr) {
        assert.ok(ourErr instanceof Trap, `${label}: native trapped (${natErr.message}) but engine returned ${ours}`)
        const nk = v8Kind(natErr.message)
        if (nk === 'invalid-or-overflow') assert.ok(ourErr.kind === 'invalid-conversion' || ourErr.kind === 'integer-overflow', label)
        else assert.equal(ourErr.kind, nk, `${label}: trap kind`)
        continue
      }
      assert.equal(ourErr, null, `${label}: engine trapped (${ourErr && ourErr.message}) but native returned ${nat}`)
      const rt = results[0]
      if ((rt === 'f32' || rt === 'f64') && !BITWISE.test(o.name)) {
        const nb = rt === 'f32' ? nat | 0 : nat
        if (isNaNBits(rt, nb)) {
          assert.ok(isNaNBits(rt, ours), `${label}: expected NaN, got bits ${ours}`)
          const quiet = rt === 'f32' ? (ours & 0x00400000) !== 0 : (ours & 0x0008000000000000n) !== 0n
          assert.ok(quiet, `${label}: arithmetic NaN must be quiet`)
          continue
        }
      }
      assert.equal(ours, nat, label)
    }
  }
  assert.ok(cases > 30000, `ran ${cases} cases`)
})
