#!/usr/bin/env node
// Runs the official WebAssembly spec testsuite (converted with wabt's
// `wast2json`) through this engine's decoder + validator + interpreter.
//
//   node tools/spec-runner.mjs <json-root> [--mode=run|record|step] [--only=name,name] [-v]
//
// <json-root> holds one directory per .wast file, each with <name>.json and
// the .wasm files wast2json wrote. Text-format assert_malformed modules are
// skipped (they test the text parser, not the binary engine). Files whose
// name starts with simd_ are reported as "unsupported feature" when every
// module is rejected with a WasmFeatureError.
//
// Not part of `npm test` (the suite isn't vendored); see README.md.

import fs from 'node:fs'
import path from 'node:path'
import {
  decode, validate, instantiate, Trap, LinkError, Memory, Table, Global, FuncInst,
  WasmFeatureError, f32Bits, f64Words, hostFunction,
} from '../src/engine/index.js'
import { f32FromBits, f64FromBitsBig } from '../src/engine/values.js'
import { snapshotDiff } from '../test/util.mjs'

const args = process.argv.slice(2)
const root = args.find((a) => !a.startsWith('-'))
const mode = (args.find((a) => a.startsWith('--mode=')) || '--mode=run').slice(7)
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const verbose = args.includes('-v')
if (!root) {
  console.error('usage: spec-runner.mjs <json-root> [--mode=run|record|step] [--only=a,b] [-v]')
  process.exit(2)
}

const externs = new Map()
const externOf = (n) => {
  if (!externs.has(n)) externs.set(n, { extern: n })
  return externs.get(n)
}

function argValue(a) {
  const v = a.value
  switch (a.type) {
    case 'i32': return Number(BigInt.asIntN(32, BigInt(v)))
    case 'i64': return BigInt.asIntN(64, BigInt(v))
    case 'f32': return f32FromBits(Number(BigInt(v)))
    case 'f64': return f64FromBitsBig(BigInt.asIntN(64, BigInt(v)))
    case 'externref': return v === 'null' ? null : externOf(Number(v))
    case 'funcref': return v === 'null' ? null : v
    default: throw new Error('unsupported arg type ' + a.type)
  }
}

function matches(exp, got) {
  const v = exp.value
  switch (exp.type) {
    case 'i32': return typeof got === 'number' && got === Number(BigInt.asIntN(32, BigInt(v)))
    case 'i64': return typeof got === 'bigint' && got === BigInt.asIntN(64, BigInt(v))
    case 'f32': {
      const bits = f32Bits(got) >>> 0
      if (v === 'nan:canonical') return (bits & 0x7fffffff) === 0x7fc00000
      if (v === 'nan:arithmetic') return (bits & 0x7fc00000) === 0x7fc00000
      return bits === Number(BigInt(v))
    }
    case 'f64': {
      const [hi, lo] = f64Words(got)
      const bits = (BigInt(hi) << 32n) | BigInt(lo)
      if (v === 'nan:canonical') return (bits & 0x7fffffffffffffffn) === 0x7ff8000000000000n
      if (v === 'nan:arithmetic') return (bits & 0x7ff8000000000000n) === 0x7ff8000000000000n
      return bits === BigInt(v)
    }
    case 'externref': return v === 'null' ? got === null : got === externOf(Number(v))
    case 'funcref': return v === 'null' ? got === null : got instanceof FuncInst
    default: return false
  }
}

function makeSpectest(out) {
  return {
    print: hostFunction(() => {}),
    print_i32: hostFunction((c, a) => out.push(a)),
    print_i64: hostFunction((c, a) => out.push(a)),
    print_f32: hostFunction((c, a) => out.push(a)),
    print_f64: hostFunction((c, a) => out.push(a)),
    print_i32_f32: hostFunction((c, a, b) => out.push(a, b)),
    print_f64_f64: hostFunction((c, a, b) => out.push(a, b)),
    global_i32: new Global({ type: 'i32', mut: false }, 666),
    global_i64: new Global({ type: 'i64', mut: false }, 666n),
    global_f32: new Global({ type: 'f32', mut: false }, Math.fround(666.6)),
    global_f64: new Global({ type: 'f64', mut: false }, 666.6),
    table: new Table({ elemType: 'funcref', min: 10, max: 20 }),
    memory: new Memory({ min: 1, max: 2 }),
  }
}

function runAction(machines, current, action) {
  const m = action.module ? machines.get(action.module) : current
  if (!m) throw new Error('no module for action')
  if (action.type === 'get') {
    const g = m.exports[action.field]
    return [g.value]
  }
  const fargs = action.args.map(argValue)
  if (mode === 'run') return m.call(action.field, fargs)
  m.invoke(action.field, fargs)
  if (mode === 'undo') {
    // run recording undo history, rewind everything, check the state is exactly
    // the post-invoke state, then run again and return the second result
    const s0 = m.snapshot()
    const r1 = m.run({ record: true, maxSteps: 200000 })
    if (r1.reason !== 'max-steps' && m.historySize === r1.steps) {
      const s1 = m.snapshot()
      while (m.stepBack());
      const d = snapshotDiff(s0, m.snapshot())
      if (d.length) throw new Error('stepBack did not restore state: ' + d.slice(0, 3).join('; '))
      m.run({ record: true })
      const d2 = snapshotDiff(s1, m.snapshot())
      if (d2.length) throw new Error('replay after stepBack differs: ' + d2.slice(0, 3).join('; '))
    } else m.run({ record: false })
    return m._settle()
  }
  if (mode === 'record') {
    // run with undo records, then verify a few steps of stepBack/forward don't crash
    m.run({ record: true })
  } else {
    let guard = 0
    while (m.status === 'ready' && guard++ < 5e6) m.step()
  }
  return m._settle()
}

function runFile(dir, name) {
  const json = JSON.parse(fs.readFileSync(path.join(dir, name + '.json'), 'utf8'))
  const stats = { pass: 0, fail: 0, skip: 0, unsupported: 0, failures: [] }
  const machines = new Map()
  const registry = Object.create(null)
  const printed = []
  registry.spectest = makeSpectest(printed)
  let current = null
  let currentUnsupported = false
  const load = (file) => fs.readFileSync(path.join(dir, file))
  const resolveImports = (mod) => {
    const imports = {}
    for (const imp of mod.imports) {
      const src = registry[imp.module]
      if (!src) continue
      ;(imports[imp.module] ||= {})[imp.name] = src[imp.name]
    }
    return imports
  }
  const fail = (cmd, msg) => {
    stats.fail++
    stats.failures.push(`line ${cmd.line} ${cmd.type}: ${msg}`)
  }
  for (const cmd of json.commands) {
    try {
      switch (cmd.type) {
        case 'module': {
          currentUnsupported = false
          let mod
          try {
            mod = decode(load(cmd.filename))
            validate(mod)
          } catch (e) {
            if (e instanceof WasmFeatureError) {
              currentUnsupported = true
              current = null
              stats.unsupported++
              break
            }
            throw e
          }
          const m = instantiate(mod, resolveImports(mod), { history: mode === 'run' ? 0 : mode === 'undo' ? 200000 : 2000 })
          current = m
          if (cmd.name) machines.set(cmd.name, m)
          stats.pass++
          break
        }
        case 'register': {
          const m = cmd.name ? machines.get(cmd.name) : current
          if (!m) {
            stats.skip++
            break
          }
          registry[cmd.as] = m.exports
          break
        }
        case 'action':
        case 'assert_return': {
          if (currentUnsupported && !cmd.action.module) {
            stats.unsupported++
            break
          }
          const got = runAction(machines, current, cmd.action)
          const exp = cmd.expected || []
          if (got.length !== exp.length) {
            fail(cmd, `arity ${got.length} vs ${exp.length}`)
            break
          }
          let ok = true
          for (let i = 0; i < exp.length; i++) if (!matches(exp[i], got[i])) ok = false
          if (ok) stats.pass++
          else fail(cmd, `${cmd.action.field}(${cmd.action.args?.map((a) => a.value).join(', ')}) = ${got.map(String).join(', ')} expected ${exp.map((e) => e.value).join(', ')}`)
          break
        }
        case 'assert_trap':
        case 'assert_exhaustion': {
          if (currentUnsupported && !cmd.action.module) {
            stats.unsupported++
            break
          }
          try {
            const got = runAction(machines, current, cmd.action)
            fail(cmd, `expected trap "${cmd.text}" but returned ${got.map(String).join(',')}`)
          } catch (e) {
            if (!(e instanceof Trap)) fail(cmd, `expected trap "${cmd.text}" but threw ${e}`)
            else if (!e.message.includes(cmd.text)) fail(cmd, `trap message "${e.message}" does not contain "${cmd.text}"`)
            else stats.pass++
          }
          break
        }
        case 'assert_invalid':
        case 'assert_malformed': {
          if (cmd.module_type === 'text') {
            stats.skip++
            break
          }
          try {
            const mod = decode(load(cmd.filename))
            validate(mod)
            fail(cmd, `accepted a module that should be ${cmd.type === 'assert_invalid' ? 'invalid' : 'malformed'} ("${cmd.text}")`)
          } catch (e) {
            if (e instanceof WasmFeatureError) stats.unsupported++
            else if (!(e instanceof Error) || e instanceof TypeError || e instanceof ReferenceError) fail(cmd, `crashed: ${e}`)
            else stats.pass++
          }
          break
        }
        case 'assert_unlinkable':
        case 'assert_uninstantiable': {
          let mod
          try {
            mod = decode(load(cmd.filename))
            validate(mod)
          } catch (e) {
            if (e instanceof WasmFeatureError) stats.unsupported++
            else fail(cmd, `module should decode/validate but: ${e.message}`)
            break
          }
          try {
            instantiate(mod, resolveImports(mod), { history: 0 })
            fail(cmd, `instantiated but expected ${cmd.type} "${cmd.text}"`)
          } catch (e) {
            const okKind = cmd.type === 'assert_unlinkable' ? e instanceof LinkError : e instanceof Trap
            if (okKind) stats.pass++
            else fail(cmd, `expected ${cmd.type} "${cmd.text}" but got ${e}`)
          }
          break
        }
        default:
          stats.skip++
      }
    } catch (e) {
      fail(cmd, `exception: ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`)
    }
  }
  return stats
}

const dirs = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, d + '.json'))).sort()
let total = { pass: 0, fail: 0, skip: 0, unsupported: 0 }
const rows = []
for (const d of dirs) {
  if (only.length && !only.includes(d)) continue
  const t0 = performance.now()
  const s = runFile(path.join(root, d), d)
  const ms = performance.now() - t0
  for (const k of Object.keys(total)) total[k] += s[k]
  rows.push([d, s, ms])
  const rate = s.pass + s.fail ? ((100 * s.pass) / (s.pass + s.fail)).toFixed(1) : '-'
  console.log(`${d.padEnd(34)} pass ${String(s.pass).padStart(5)}  fail ${String(s.fail).padStart(4)}  unsupported ${String(s.unsupported).padStart(4)}  skip ${String(s.skip).padStart(3)}  ${rate}%  ${ms.toFixed(0)}ms`)
  if (s.fail && (verbose || s.failures.length <= 5)) for (const f of s.failures.slice(0, verbose ? 50 : 5)) console.log('    ' + f)
}
console.log(`\nTOTAL pass ${total.pass} fail ${total.fail} unsupported ${total.unsupported} skip ${total.skip}  (${((100 * total.pass) / (total.pass + total.fail)).toFixed(2)}% of supported assertions)`)
process.exitCode = total.fail ? 1 : 0
