// Toolchain-produced binaries through decoder + validator + interpreter:
//  * test/fixtures/hello.wasm — clang (wasm32, freestanding) WASI hello world
//    (source: test/fixtures/hello.c). Prints via fd_write, exits via proc_exit.
//  * ../late-cluster/chimera/wasm/chimera.wasm — a ~1 MB Rust DSP engine from
//    another app in this repo, used read-only when present: its audio render
//    must leave linear memory bit-identical to native.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { runWasi, load, decode, validate, disassemble, annotate, instantiate } from '../src/engine/index.js'

const hello = fs.readFileSync(new URL('./fixtures/hello.wasm', import.meta.url))

/** Minimal JS WASI for the native reference run. */
function nativeWasi() {
  let memory = null
  let out = ''
  const td = new TextDecoder()
  const wasi = {
    fd_write(fd, iov, n, nw) {
      const dv = new DataView(memory.buffer)
      let total = 0
      for (let i = 0; i < n; i++) {
        const p = dv.getUint32(iov + i * 8, true), len = dv.getUint32(iov + i * 8 + 4, true)
        out += td.decode(new Uint8Array(memory.buffer, p, len))
        total += len
      }
      dv.setUint32(nw, total, true)
      return 0
    },
    proc_exit(code) {
      throw { exit: code }
    },
  }
  return { imports: { wasi_snapshot_preview1: wasi }, setMemory: (m) => (memory = m), output: () => out }
}

test('clang WASI hello world: same stdout and exit code as native', async () => {
  const shim = nativeWasi()
  const { instance } = await WebAssembly.instantiate(hello, shim.imports)
  shim.setMemory(instance.exports.memory)
  let nativeExit = null
  try {
    instance.exports._start()
  } catch (e) {
    nativeExit = e.exit
  }
  const r = runWasi(hello)
  assert.equal(r.exitCode, 3)
  assert.equal(r.exitCode, nativeExit)
  assert.equal(r.stdout, shim.output())
  assert.match(r.stdout, /^Hello, WASI!\nfib\(20\) = 6765\n/)
  assert.deepEqual(r.host.unresolved, [])
  assert.equal(r.machine.status, 'exited')
  // exported helpers match native
  for (const n of [0, 1, 15]) assert.deepEqual(r.machine.call('fib', [n]), [instance.exports.fib(n)])
  for (const n of [0, 1, 999, 5000]) assert.deepEqual(r.machine.call('checksum', [n]), [instance.exports.checksum(n)])
  for (const w of [0, 1]) assert.deepEqual(r.machine.call('sort_demo', [w]), [instance.exports.sort_demo(w)])
})

test('WASI program can be stepped with output arriving through the callback, and stepped back', () => {
  const chunks = []
  const { machine, host } = load(hello, { stdout: (t) => chunks.push(t) })
  machine.invoke('_start')
  let ev, hostCalls = 0, steps = 0, last = null
  while ((ev = machine.step())) {
    steps++
    last = ev
    if (ev.control && ev.control.kind === 'host-call') {
      hostCalls++
      assert.equal(ev.control.module, 'wasi_snapshot_preview1')
      assert.equal(ev.control.unresolved, false)
    }
  }
  assert.equal(machine.status, 'exited')
  assert.equal(machine.exitCode, 3)
  assert.equal(hostCalls, 2) // fd_write, fd_write
  assert.deepEqual(last.control, { kind: 'exit', exitCode: 3 }) // proc_exit ends the program
  assert.equal(chunks.join(''), host.output.stdout)
  // step back over the exit and the last part of the program
  for (let i = 0; i < 500; i++) assert.ok(machine.stepBack())
  assert.equal(machine.status, 'ready')
  assert.ok(steps > 1000)
})

test('unknown imports become recording stubs; missing memory is created', () => {
  const src = (() => {
    // module importing things no resolver knows about
    const { bytes } = require_wat(`(module
      (import "mystery" "fn" (func $f (param i32 f64) (result i64)))
      (import "mystery" "mem" (memory 2))
      (import "mystery" "g" (global i32))
      (import "wasi_snapshot_preview1" "path_open" (func $po (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
      (func (export "go") (result i64 i32 i32)
        (call $f (i32.const 1) (f64.const 2.5))
        (call $po (i32.const 0) (i32.const 0) (i32.const 0) (i32.const 0) (i32.const 0) (i64.const 0) (i64.const 0) (i32.const 0) (i32.const 0))
        (memory.size)))`)
    return bytes
  })()
  const seen = []
  const { machine, host } = load(src, { onUnresolved: (c) => seen.push(c) })
  assert.deepEqual(host.unresolved.map((u) => u.module + '.' + u.name), ['mystery.fn', 'mystery.mem', 'mystery.g', 'wasi_snapshot_preview1.path_open'])
  machine.invoke('go')
  const evs = []
  let ev
  while ((ev = machine.step())) evs.push(ev)
  const hc = evs.filter((e) => e.control && e.control.kind === 'host-call')
  assert.equal(hc.length, 2)
  assert.ok(hc.every((e) => e.control.unresolved))
  assert.deepEqual(hc[0].control.args.map((a) => a.value), [1, 2.5])
  assert.deepEqual(machine.results.map((r) => r.value), [0n, 52, 2]) // zeros, ENOSYS, imported memory created with 2 pages
  assert.deepEqual(seen.map((c) => c.name), ['fn', 'path_open'])
})

import { assemble } from '../src/engine/wat.js'
function require_wat(src) {
  return assemble(src)
}

const chimeraUrl = new URL('../../late-cluster/chimera/wasm/chimera.wasm', import.meta.url)
test('Rust-compiled DSP engine (chimera.wasm): memory bit-identical to native after rendering audio', { skip: !fs.existsSync(chimeraUrl) && 'chimera.wasm not present' }, async () => {
  const bytes = fs.readFileSync(chimeraUrl)
  const mod = validate(decode(bytes))
  assert.ok(mod.funcs.length > 500)
  assert.ok(disassemble(mod).length > 10000)
  assert.ok(annotate(bytes, { annotateBodies: false }).children.length > 5)
  const nat = (await WebAssembly.instantiate(bytes)).instance.exports
  const m = instantiate(mod, {}, { history: 0 })
  const call = (name, ...a) => {
    const want = nat[name](...a)
    const got = m.call(name, a)
    assert.equal(got[0], want, name)
    return want
  }
  call('chimera_layout_version')
  const eng = call('engine_new', 44100)
  call('engine_render', eng, 64)
  const enc = new TextEncoder().encode(JSON.stringify({ fn: 'no_such_fn' }))
  const p = call('chimera_alloc', enc.length)
  new Uint8Array(nat.memory.buffer).set(enc, p)
  m.memory.bytes.set(enc, p)
  call('chimera_call', p, enc.length)
  const a = new Uint8Array(nat.memory.buffer), b = m.memory.bytes
  assert.equal(a.length, b.length)
  let diff = -1
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) {
    diff = i
    break
  }
  assert.equal(diff, -1, 'first differing byte')
  const rp = call('chimera_result_ptr'), rl = call('chimera_result_len')
  assert.match(new TextDecoder().decode(b.subarray(rp, rp + rl)), /unknown fn no_such_fn/)
})
