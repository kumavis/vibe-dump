// Track C: installBun and the small members (process info, timing, peek,
// inspect, zstd, inert networking, stubs, Bun.ant stubs).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import zlib from 'node:zlib'
import util from 'node:util'
import { vendor, fakeProcess } from './C-support.mjs'
import { installBun, createBun, BUN_MARK, BUN_VERSION } from '../../src/runtime/bun/install.js'
import { TERMINAL_UNAVAILABLE } from '../../src/runtime/bun/misc.js'
import { servers } from '../../src/runtime/bun/net.js'

test('installBun installs once and is idempotent', () => {
  const target = {}
  const proc = fakeProcess()
  const a = installBun(target, { vendor, process: proc })
  assert.equal(target.Bun, a)
  assert.equal(a[BUN_MARK], true)
  assert.equal(Object.getOwnPropertyDescriptor(target, 'Bun').enumerable, false)
  const b = installBun(target, { vendor, process: fakeProcess({ env: { OTHER: '1' } }) })
  assert.equal(b, a, 'second call returns the installed object')
  assert.equal(target.Bun.env, proc.env, 'and ignores the second deps')
  assert.equal(installBun(target, { vendor, force: true }), a, 'force never replaces one of ours')
})

test('installBun leaves a foreign Bun alone unless forced', () => {
  const real = { version: '1.4.4' }
  const target = { Bun: real }
  assert.equal(installBun(target, { vendor }), real)
  const ours = installBun(target, { vendor, force: true })
  assert.notEqual(ours, real)
  assert.equal(ours[BUN_MARK], true)
})

test('installBun on the real globalThis makes the bare `Bun` binding resolve', () => {
  assert.equal(typeof globalThis.Bun, 'undefined', 'test runner is Node, not Bun')
  try {
    const bun = installBun(globalThis, { vendor })
    // eslint-disable-next-line no-undef
    assert.equal(typeof Bun, 'object')
    // eslint-disable-next-line no-undef
    assert.equal(Bun, bun)
    // eslint-disable-next-line no-undef
    assert.equal(typeof Bun.ant?.CellSegmenter, 'function')
    assert.equal(installBun(globalThis, { vendor }), bun)
  } finally {
    delete globalThis.Bun
  }
})

test('identity and process members', () => {
  const proc = fakeProcess({ env: { HOME: '/home/user' }, argv: ['/node', 'app/cli', '-p'], cwd: '/srv' })
  const Bun = createBun({ vendor, process: proc, path: path.posix })
  assert.equal(Bun.version, BUN_VERSION)
  assert.match(Bun.version, /^\d+\.\d+\.\d+$/)
  assert.equal(typeof Bun.revision, 'string')
  assert.equal(Bun.isStandaloneExecutable, false)
  assert.deepEqual(Bun.embeddedFiles, [])
  assert.equal(Bun.env, proc.env, 'Bun.env is process.env itself')
  Bun.env.NEW = 'x'
  assert.equal(proc.env.NEW, 'x')
  assert.equal(Bun.argv, proc.argv)
  assert.equal(Bun.main, '/srv/app/cli', 'resolved against cwd')
  assert.equal(createBun({ vendor, process: fakeProcess({ argv: ['/node'] }) }).main, undefined)
})

test('sleepSync busy-waits for the requested time without Atomics.wait', () => {
  const Bun = createBun({ vendor })
  const original = Atomics.wait
  let waited = false
  Atomics.wait = (...args) => { waited = true; return original.apply(Atomics, args) }
  try {
    const t0 = performance.now()
    Bun.sleepSync(30)
    const dt = performance.now() - t0
    assert.ok(dt >= 30, `slept ${dt} ms`)
    assert.ok(dt < 1000)
    Bun.sleepSync(0)
    Bun.sleepSync(-5)
    Bun.sleepSync('nope')
  } finally {
    Atomics.wait = original
  }
  assert.equal(waited, false)
})

test('sleep, nanoseconds, gc, peek', async () => {
  const Bun = createBun({ vendor })
  const t0 = Bun.nanoseconds()
  await Bun.sleep(5)
  const t1 = Bun.nanoseconds()
  assert.ok(Number.isInteger(t0) && t1 - t0 >= 4e6, `${t1 - t0} ns`)
  assert.equal(Bun.gc(true), undefined)

  assert.equal(Bun.peek(42), 42)
  const p = Promise.resolve('v')
  assert.equal(Bun.peek(p), p, 'unknown until observed')
  await p
  await null
  assert.equal(Bun.peek(p), 'v')
  assert.equal(Bun.peek.status(p), 'fulfilled')
  const err = new Error('r')
  const rej = Promise.reject(err)
  Bun.peek(rej)
  await rej.catch(() => {})
  assert.equal(Bun.peek(rej), err)
  assert.equal(Bun.peek.status(rej), 'rejected')
  assert.equal(Bun.peek.status(new Promise(() => {})), 'pending')
})

test('inspect: console.log-style formatting', () => {
  const Bun = createBun({ vendor })
  assert.equal(Bun.inspect('top level'), 'top level')
  assert.equal(Bun.inspect({ s: 'x', n: -0, b: 1n, u: undefined }), "{ s: 'x', n: -0, b: 1n, u: undefined }")
  assert.equal(Bun.inspect({ f: function named() {}, sym: Symbol('s') }), '{ f: [Function: named], sym: Symbol(s) }')
  assert.equal(Bun.inspect([1, [2, [3, [4, [5]]]]]), '[ 1, [ 2, [ 3, [Array] ] ] ]')
  assert.equal(Bun.inspect(new Map([['k', { a: 1 }]])), "Map(1) { 'k' => { a: 1 } }")
  assert.equal(Bun.inspect(new Set([1])), 'Set(1) { 1 }')
  assert.equal(Bun.inspect(new Uint8Array([1, 2])), 'Uint8Array(2) [ 1, 2 ]')
  assert.equal(Bun.inspect({ 'a-b': 1 }), "{ 'a-b': 1 }")
  assert.equal(Bun.inspect(Object.create(null)), '[Object: null prototype] {}')
  class Foo { constructor() { this.x = 1 } }
  assert.equal(Bun.inspect(new Foo()), 'Foo { x: 1 }')
  assert.equal(Bun.inspect(class Bar {}), '[class Bar]')
  const c = { a: 1 }; c.self = c
  assert.equal(Bun.inspect(c), '{ a: 1, self: [Circular] }')
  assert.equal(Bun.inspect({ [Bun.inspect.custom]: () => 'custom!' }), 'custom!')
  assert.ok(Bun.inspect({ long: 'x'.repeat(80), more: 1 }).includes('\n'), 'long objects break lines')
  assert.equal(Bun.inspect({ a: { b: { c: { d: 1 } } } }, { depth: 0 }), '{ a: [Object] }')
  assert.match(Bun.inspect(new Error('boom')), /^Error: boom/)
  // with node:util given, it is used (top-level strings still bare)
  const withUtil = createBun({ vendor, util })
  assert.equal(withUtil.inspect({ a: [1] }), util.inspect({ a: [1] }))
  assert.equal(withUtil.inspect('s'), 's')
})

test('zstdDecompress[Sync]: via deps.zlib, or the vendored fzstd; returns a Buffer', async (t) => {
  if (typeof zlib.zstdCompressSync !== 'function') return t.skip('node:zlib has no zstd here')
  const text = '# Skill\n\n' + 'Some markdown. '.repeat(500)
  const frame = zlib.zstdCompressSync(Buffer.from(text))
  for (const deps of [{ vendor, zlib }, { vendor }]) {
    const Bun = createBun(deps)
    const out = Bun.zstdDecompressSync(frame)
    assert.ok(Buffer.isBuffer(out))
    assert.equal(out.toString('utf8'), text)
    assert.equal((await Bun.zstdDecompress(new Uint8Array(frame))).toString('utf8'), text)
  }
  assert.throws(() => createBun({ vendor: { ...vendor, fzstd: undefined } }).zstdDecompressSync(frame), /needs deps.zlib/)
})

test('serve / listen are inert, connect refuses', async () => {
  const Bun = createBun({ vendor })
  const s = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: (req, server) => new Response(`got ${new URL(req.url).pathname} on ${server.port}`) })
  assert.ok(s.port >= 1024 && s.port < 65536)
  assert.equal(s.hostname, '127.0.0.1')
  assert.equal(s.url.href, `http://127.0.0.1:${s.port}/`)
  assert.equal(servers.get(s.port), s)
  assert.equal(await (await s.fetch(new Request(`http://127.0.0.1:${s.port}/x`))).text(), `got /x on ${s.port}`)
  s.unref()
  await s.stop(true)
  assert.equal(servers.has(s.port), false)
  const s2 = Bun.serve({ port: 0, fetch: () => new Response('') })
  assert.notEqual(s2.port, s.port, 'distinct made-up ports')
  await s2.stop()
  assert.equal(Bun.serve({ hostname: '::1', port: 4321, fetch() {} }).port, 4321)

  const l = Bun.listen({ hostname: '127.0.0.1', port: 0, socket: { data() {} } })
  assert.equal(typeof l.port, 'number')
  l.stop()

  let reported
  await assert.rejects(Bun.connect({ hostname: '127.0.0.1', port: 9, socket: { connectError: (_s, e) => { reported = e } } }), (e) => e.code === 'ECONNREFUSED')
  assert.equal(reported?.code, 'ECONNREFUSED')
})

test('Terminal throws the "unavailable" error the bundle reports', () => {
  const Bun = createBun({ vendor })
  assert.equal(TERMINAL_UNAVAILABLE, 'Bun.Terminal unavailable (running under Node?)')
  assert.throws(() => new Bun.Terminal({ cols: 80, rows: 24, data() {} }), (e) => e.message === TERMINAL_UNAVAILABLE && e.code === 'ERR_BUN_TERMINAL_UNAVAILABLE')
})

test('Transpiler: JS passes through, TS refuses clearly, scanImports finds specifiers', async () => {
  const Bun = createBun({ vendor })
  assert.equal(new Bun.Transpiler({ loader: 'js' }).transformSync('let a = 1'), 'let a = 1')
  assert.throws(() => new Bun.Transpiler({ loader: 'ts', macro: false }).transformSync('let a: number = 1'), /cannot transpile "ts"/)
  await assert.rejects(new Bun.Transpiler({ loader: 'tsx' }).transform('x'), /tsx/)
  const imports = new Bun.Transpiler().scanImports('import a from "a"; import { b } from \'./b.js\'; export * from "c"; await import("d"); require("e")')
  assert.deepEqual(imports.map((i) => i.path), ['a', './b.js', 'c', 'd', 'e'])
  assert.deepEqual(imports.map((i) => i.kind), ['import-statement', 'import-statement', 'import-statement', 'dynamic-import', 'require-call'])
})

test('unsafe, generateHeapSnapshot and the Bun.ant stubs', () => {
  const Bun = createBun({ vendor })
  assert.equal(Bun.unsafe.setJITPolicy?.(1), undefined)
  assert.throws(() => Bun.generateHeapSnapshot('v8', 'arraybuffer'), /unavailable/)
  assert.equal(Bun.ant.memoryPressureLevel(), null)
  assert.equal(Bun.ant.setDumpable(false), true)
  assert.equal(Bun.ant.getPeerPid(3), null)
  assert.equal(Bun.ant.getPeerUid(3), null)
  assert.equal(Bun.ant.CellSegmenter.name, 'CellSegmenter')
  // the guarded fork-only members stay absent, so the bundle's typeof checks take their fallbacks
  for (const k of ['posixFsAt', 'loginTty', 'ttyName', 'windowsProcessList', 'windowsFolderSecurity', 'windowsProcessCreationTime']) assert.equal(Bun.ant[k], undefined, k)
  for (const k of ['Image', 'FetchSession', 'SQL', 'WebView', 'password']) assert.equal(Bun[k], undefined, k)
})

test('a member whose dep is missing fails with a message naming the dep', async () => {
  const Bun = createBun({ vendor })
  assert.throws(() => Bun.spawn(['x']), /deps\.childProcess/)
  await assert.rejects(Bun.file('/x').text(), /deps\.fs/)
  assert.throws(() => createBun({}), /vendor\.stringWidth/)
})
