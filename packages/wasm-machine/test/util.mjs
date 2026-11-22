// Shared helpers for the engine tests and tools (not a test file itself).
import { NaNBox } from '../src/engine/values.js'

/** Bit-exact value identity (NaN payloads, -0) for snapshot comparison. */
export function sameVal(a, b) {
  if (a instanceof NaNBox || b instanceof NaNBox) return a instanceof NaNBox && b instanceof NaNBox && a.type === b.type && a.hi === b.hi && a.lo === b.lo
  if (typeof a === 'number' && typeof b === 'number') return Object.is(a, b)
  return a === b
}

function cmpArr(path, a, b, cmp, out) {
  if (a.length !== b.length) {
    out.push(`${path}: length ${a.length} vs ${b.length}`)
    return
  }
  for (let i = 0; i < a.length; i++) cmp(`${path}[${i}]`, a[i], b[i])
}

/** Differences between two Machine.snapshot() results ([] when identical). */
export function snapshotDiff(a, b) {
  const out = []
  const v = (p, x, y) => {
    if (!sameVal(x, y)) out.push(`${p}: ${String(x)} vs ${String(y)}`)
  }
  if (a.status !== b.status) out.push(`status: ${a.status} vs ${b.status}`)
  if (a.steps !== b.steps) out.push(`steps: ${a.steps} vs ${b.steps}`)
  cmpArr('stack', a.stack, b.stack, (p, x, y) => {
    if (x.type !== y.type) out.push(`${p}.type: ${x.type} vs ${y.type}`)
    v(p, x.value, y.value)
  }, out)
  cmpArr('frames', a.frames, b.frames, (p, x, y) => {
    for (const k of ['funcIndex', 'pc', 'stackBase', 'labelBase']) if (x[k] !== y[k]) out.push(`${p}.${k}: ${x[k]} vs ${y[k]}`)
    cmpArr(p + '.locals', x.locals, y.locals, v, out)
  }, out)
  cmpArr('labels', a.labels, b.labels, (p, x, y) => {
    for (const k of ['kind', 'start', 'height']) if (x[k] !== y[k]) out.push(`${p}.${k}: ${x[k]} vs ${y[k]}`)
  }, out)
  cmpArr('globals', a.globals, b.globals, v, out)
  cmpArr('memories', a.memories, b.memories, (p, x, y) => {
    if (x.pages !== y.pages) out.push(`${p}.pages: ${x.pages} vs ${y.pages}`)
    if (x.bytes.length !== y.bytes.length) out.push(`${p}.bytes.length: ${x.bytes.length} vs ${y.bytes.length}`)
    else for (let i = 0; i < x.bytes.length; i++) if (x.bytes[i] !== y.bytes[i]) {
      out.push(`${p}.bytes[${i}]: ${x.bytes[i]} vs ${y.bytes[i]}`)
      break
    }
  }, out)
  cmpArr('tables', a.tables, b.tables, (p, x, y) => cmpArr(p, x, y, v, out), out)
  cmpArr('elemsDropped', a.elemsDropped, b.elemsDropped, v, out)
  cmpArr('datasDropped', a.datasDropped, b.datasDropped, v, out)
  if ((a.trap && a.trap.kind) !== (b.trap && b.trap.kind)) out.push(`trap: ${a.trap && a.trap.kind} vs ${b.trap && b.trap.kind}`)
  if (!!a.results !== !!b.results) out.push(`results: ${!!a.results} vs ${!!b.results}`)
  else if (a.results) cmpArr('results', a.results, b.results, (p, x, y) => v(p, x.value, y.value), out)
  return out
}

import assert from 'node:assert/strict'
import { assemble } from '../src/engine/wat.js'
import { instantiate, Trap } from '../src/engine/machine.js'

/** Assemble WAT with our assembler, instantiate natively and in the engine. */
export async function both(src, { imports = {}, engineImports = imports, options = {} } = {}) {
  const { bytes, sourceMap } = assemble(src)
  const native = (await WebAssembly.instantiate(bytes, imports)).instance.exports
  const machine = instantiate(bytes, engineImports, options)
  return { bytes, sourceMap, native, machine }
}

const V8_TRAP = [
  [/unreachable/, 'unreachable'],
  [/divide by zero|remainder by zero/, 'integer-divide-by-zero'],
  [/integer overflow|divide result unrepresentable/, 'integer-overflow'],
  [/float unrepresentable/, null],
  [/memory access out of bounds|data segment out of bounds|out of bounds memory/, 'out-of-bounds-memory'],
  [/table index is out of bounds|table access out of bounds|element segment out of bounds|out of bounds table/, null],
  [/null function or function signature mismatch|function signature mismatch|null function/, null],
  [/Maximum call stack size exceeded/, 'call-stack-exhausted'],
]

/** Call `name` on both and assert identical results or matching traps. Returns our results. */
export function same(native, machine, name, args = [], { stepMode = false } = {}) {
  let nat, natErr = null
  try {
    nat = native[name](...args)
  } catch (e) {
    natErr = e
  }
  let ours, ourErr = null
  try {
    if (stepMode) {
      machine.invoke(name, args)
      while (machine.step());
      ours = machine._settle()
    } else ours = machine.call(name, args)
  } catch (e) {
    ourErr = e
  }
  const label = `${name}(${args.map(String).join(', ')})`
  if (natErr) {
    assert.ok(ourErr instanceof Trap, `${label}: native threw "${natErr.message}" but engine returned ${ours}`)
    for (const [re, kind] of V8_TRAP) if (re.test(natErr.message)) {
      if (kind) assert.equal(ourErr.kind, kind, `${label}: trap kind (native: ${natErr.message})`)
      break
    }
    return ourErr
  }
  if (ourErr) assert.fail(`${label}: engine threw ${ourErr.message} but native returned ${nat}`)
  const natArr = nat === undefined ? [] : Array.isArray(nat) ? nat : [nat]
  assert.equal(ours.length, natArr.length, `${label}: result arity`)
  for (let i = 0; i < ours.length; i++) {
    const a = ours[i], b = natArr[i]
    if (typeof b === 'bigint') assert.equal(a, b, `${label}[${i}]`)
    else if (typeof b === 'number') {
      const x = +a
      assert.ok(Object.is(x, b) || (Number.isNaN(x) && Number.isNaN(b)), `${label}[${i}]: engine ${a} vs native ${b}`)
    } else if (b === null) assert.equal(a, null, `${label}[${i}]`)
    else assert.notEqual(a, null, `${label}[${i}]: expected non-null reference`)
  }
  return ours
}
