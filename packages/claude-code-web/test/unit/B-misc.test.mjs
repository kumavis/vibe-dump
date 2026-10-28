// Track B: the smaller shims — process, path, util, readline, module, vm,
// dns, ws, timers, streams helpers and friends.
import test from 'node:test'
import assert from 'node:assert/strict'
import nodeUtil from 'node:util'
import { load } from './B-support.mjs'

test('process: createProcess/installProcess, stdio capture, exit, chdir, forwarding default', async () => {
  const P = await load('node/process.js')
  const out = []
  const exits = []
  const proc = P.createProcess({
    argv: ['/usr/local/bin/node', '/app/cli', '-p'],
    env: { HOME: '/home/user', FOO: 'bar' },
    cwd: '/home/user/workspace',
    onStdout: (c) => out.push(String(c)),
    onExit: (c) => exits.push(c),
  })
  assert.deepEqual(proc.argv.slice(2), ['-p'])
  assert.equal(proc.cwd(), '/home/user/workspace')
  await load('node/index.js') // registry: chdir now checks the VFS
  const vfs = (await load('node/fs.js')).default
  vfs.mkdirSync('/home/user/x', { recursive: true })
  proc.chdir('../x')
  assert.equal(proc.cwd(), '/home/user/x')
  assert.throws(() => proc.chdir('/no/such/dir'), { code: 'ENOENT' })
  assert.equal(proc.cwd(), '/home/user/x')
  proc.stdout.write('line 1\n')
  proc.stdout.write(new TextEncoder().encode('bytes\n'))
  assert.deepEqual(out, ['line 1\n', 'bytes\n'])
  assert.equal(proc.stdout.isTTY, false)
  assert.equal(proc.platform, 'linux')
  assert.match(proc.version, /^v\d+\.\d+\.\d+$/)
  assert.equal(proc.versions.bun, undefined)
  const t = proc.hrtime()
  assert.ok(Array.isArray(t) && typeof proc.hrtime.bigint() === 'bigint')
  let ticked = false
  proc.nextTick(() => { ticked = true })
  await Promise.resolve()
  assert.equal(ticked, true)

  const lines = []
  proc.stdin.setEncoding('utf8')
  proc.stdin.on('data', (d) => lines.push(d))
  proc.stdin.push('{"type":"user"}\n')
  await new Promise((r) => setTimeout(r, 5))
  assert.deepEqual(lines, ['{"type":"user"}\n'])

  let exitEvent = null
  proc.on('exit', (c) => { exitEvent = c })
  assert.throws(() => proc.exit(3), (e) => e instanceof P.ProcessExit && e.exitCode === 3)
  assert.deepEqual(exits, [3])
  assert.equal(exitEvent, 3)
  assert.equal(proc.exitCode, 3)

  // The module default forwards to whatever globalThis.process is.
  const fake = { cwd: () => '/fake', env: { A: '1' }, argv: ['x'] }
  const saved = globalThis.process
  P.installProcess(fake)
  try {
    assert.equal(P.default.cwd(), '/fake')
    assert.equal(P.cwd(), '/fake')
    assert.equal(P.default.env.A, '1')
    assert.deepEqual(P.argv, ['x'])
  } finally {
    P.installProcess(saved)
  }
  assert.equal(P.default.pid, saved.pid)
})

test('path: posix with live cwd, win32 basics', async () => {
  const path = await load('node/path.js')
  assert.equal(path.resolve('a/b'), `${process.cwd()}/a/b`)
  assert.equal(path.join('/a', '../b', 'c'), '/b/c')
  assert.equal(path.relative('/a/b/c', '/a/d'), '../../d')
  assert.equal(path.posix, path.default)
  assert.equal(path.win32.basename('C:\\dir\\file.txt'), 'file.txt')
  assert.equal(path.win32.isAbsolute('C:\\x'), true)
  assert.equal(path.win32.isAbsolute('x\\y'), false)
  assert.equal(path.win32.join('C:\\a', 'b', '..', 'c'), 'C:\\a\\c')
  assert.equal(path.win32.dirname('C:\\a\\b'), 'C:\\a')
  const w32 = await load('node/path/win32.js')
  assert.equal(w32.sep, '\\')
  assert.equal((await load('node/path/posix.js')).join('a', 'b'), 'a/b')
  assert.equal(path.matchesGlob('src/a/b.ts', 'src/**/*.ts'), true)
})

test('util: inspect, format, promisify.custom, types, stripVTControlCharacters', async () => {
  const util = await load('node/util.js')
  const sample = { a: 1, s: 'x', n: null, u: undefined, arr: [1, 2, 3], m: new Map([['k', 1]]), set: new Set([1]), nested: { deep: { deeper: { deepest: 1 } } } }
  assert.equal(util.inspect(sample), nodeUtil.inspect(sample))
  assert.equal(util.inspect('str'), "'str'")
  assert.equal(util.inspect([1, 'a']), "[ 1, 'a' ]")
  class Foo { constructor() { this.x = 1 } }
  assert.equal(util.inspect(new Foo()), 'Foo { x: 1 }')
  const circ = { a: 1 }
  circ.self = circ
  assert.match(util.inspect(circ), /Circular/)
  assert.equal(util.format('%s=%d %j %%', 'a', 42, { b: 1 }), nodeUtil.format('%s=%d %j %%', 'a', 42, { b: 1 }))
  assert.equal(util.format('a', 1, { x: 1 }), nodeUtil.format('a', 1, { x: 1 }))
  assert.match(util.inspect(new Error('boom')), /Error: boom/)
  const custom = function (cb) { cb(null, 1) }
  custom[util.promisify.custom] = () => Promise.resolve('custom')
  assert.equal(await util.promisify(custom)(), 'custom')
  assert.equal(await util.promisify((a, cb) => cb(null, a * 2))(21), 42)
  assert.equal(util.promisify.custom, nodeUtil.promisify.custom)
  assert.equal(util.types.isPromise(Promise.resolve()), true)
  assert.equal(util.types.isUint8Array(new Uint8Array()), true)
  assert.equal(util.types.isModuleNamespaceObject(await load('node/os.js')), true)
  assert.equal(util.stripVTControlCharacters('\x1b[31mred\x1b[39m'), 'red')
  assert.equal(util.getSystemErrorName(-2), 'ENOENT')
  assert.equal(util.inspect.custom, Symbol.for('nodejs.util.inspect.custom'))
})

test('readline: lines from a Readable, async iteration, close', async () => {
  const { Readable } = await load('node/stream.js')
  const readline = await load('node/readline.js')
  const input = new Readable({ read() {} })
  const rl = readline.createInterface({ input, crlfDelay: Infinity })
  const got = []
  const done = (async () => { for await (const line of rl) got.push(line) })()
  input.push('{"a":1}\r\n{"b"')
  input.push(':2}\npartial')
  input.push(null)
  await done
  assert.deepEqual(got, ['{"a":1}', '{"b":2}', 'partial'])
  const rl2 = readline.createInterface(new Readable({ read() {} }))
  let closed = false
  rl2.on('close', () => { closed = true })
  rl2.close()
  assert.equal(closed, true)
})

test('module.createRequire: built-ins via the registry, others via __bunRequire', async () => {
  await load('node/index.js') // registers the shim registry with process.js
  const P = await load('node/process.js')
  const mod = await load('node/module.js')
  const saved = globalThis.process
  P.installProcess(P.createProcess())
  globalThis.__bunRequire = (p) => ({ loaded: p })
  try {
    const require = mod.createRequire('file:///app/cli')
    assert.equal(typeof require('fs').readFileSync, 'function')
    assert.equal(typeof require('node:path').join, 'function')
    assert.deepEqual(require('./chunk-x.js'), { loaded: '/app/chunk-x.js' })
    assert.throws(() => require('node:sqlite'), { code: 'MODULE_NOT_FOUND' })
    assert.ok(mod.builtinModules.includes('fs'))
    assert.equal(mod.isBuiltin('node:fs'), true)
  } finally {
    delete globalThis.__bunRequire
    P.installProcess(saved)
  }
})

test('vm: runInThisContext, runInNewContext, Script, isContext', async () => {
  const vm = await load('node/vm.js')
  assert.equal(vm.runInThisContext('1 + 2'), 3)
  const ctx = vm.createContext({ x: 2 })
  assert.equal(vm.isContext(ctx), true)
  assert.equal(vm.runInContext('x * Math.max(3, 4)', ctx), 8)
  assert.equal(vm.runInNewContext('a + b', { a: 'p', b: 'q' }), 'pq')
  assert.equal(new vm.Script('x + 1').runInContext(ctx), 3)
  assert.equal(vm.SourceTextModule, undefined)
})

test('dns, net, tls, http2, worker_threads, inspector: fail the way a sandbox would', async () => {
  const dns = await load('node/dns.js')
  const local = await new Promise((r) => dns.lookup('localhost', (e, a, f) => r([e, a, f])))
  assert.deepEqual(local, [null, '127.0.0.1', 4])
  const all = await new Promise((r) => dns.lookup('10.0.0.1', { all: true }, (e, list) => r(list)))
  assert.deepEqual(all, [{ address: '10.0.0.1', family: 4 }])
  const err = await new Promise((r) => dns.lookup('api.anthropic.com', (e) => r(e)))
  assert.equal(err.code, 'ENOTFOUND')
  const dnsp = await load('node/dns/promises.js')
  await assert.rejects(dnsp.lookup('example.com'), { code: 'ENOTFOUND' })
  assert.equal(typeof new dnsp.Resolver().resolve4, 'function')

  const net = await load('node/net.js')
  assert.equal(net.isIP('::1'), 6)
  assert.equal(net.isIP('1.2.3.4'), 4)
  assert.equal(net.isIP('nope'), 0)
  const sockErr = await new Promise((r) => net.connect(443, 'example.com').on('error', r))
  assert.equal(sockErr.code, 'ECONNREFUSED')
  const tls = await load('node/tls.js')
  // one real public root, so code that refuses a runtime with no roots at all starts (internal/root-certificates.js)
  assert.equal(tls.rootCertificates.length, 1)
  assert.match(tls.rootCertificates[0], /^-----BEGIN CERTIFICATE-----\n[\s\S]+\n-----END CERTIFICATE-----$/)
  assert.deepEqual(tls.getCACertificates('system'), [])
  const http2 = await load('node/http2.js')
  const h2err = await new Promise((r) => http2.connect('https://example.com').on('error', r))
  assert.equal(h2err.code, 'ECONNREFUSED')
  const wt = await load('node/worker_threads.js')
  assert.equal(wt.isMainThread, true)
  assert.equal(wt.workerData, null)
  assert.throws(() => new wt.Worker('x.js'), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
  const inspector = await load('node/inspector.js')
  assert.equal(inspector.url(), undefined)
  const httpShim = await load('node/http.js')
  const listenErr = await new Promise((r) => httpShim.createServer().on('error', r).listen(0))
  assert.equal(listenErr.code, 'EADDRNOTAVAIL')
})

test('ws: API shape over the native WebSocket', async () => {
  const { default: WebSocket, WebSocketServer } = await load('node/ws.js')
  assert.equal(WebSocket.OPEN, 1)
  assert.equal(WebSocket.CLOSED, 3)
  assert.equal(WebSocket.WebSocket, WebSocket)
  assert.throws(() => new WebSocketServer({ port: 1 }), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
  const ws = new WebSocket('ws://127.0.0.1:1/', { headers: { 'x-ignored': '1' } })
  assert.equal(ws.readyState, WebSocket.CONNECTING)
  // Browsers fire error then close(1006); Node's WebSocket only fires error.
  const ended = await new Promise((r) => { ws.on('error', (e) => r(e)); ws.on('close', (code) => r(code)) })
  assert.ok(ended instanceof Error || typeof ended === 'number')
  assert.notEqual(ws.readyState, WebSocket.OPEN)
  assert.throws(() => ws.send('x'), /not open/)
  const events = []
  ws.addEventListener('message', (ev) => events.push(ev.data.toString()))
  ws.emit('message', Buffer.from('hi'), false)
  assert.deepEqual(events, ['hi'])
})

test('timers/promises, stream/consumers, string_decoder, querystring, tty, os, misc', async () => {
  const tp = await load('node/timers/promises.js')
  assert.equal(await tp.setTimeout(1, 'v'), 'v')
  const ac = new AbortController()
  const pending = tp.setTimeout(1000, null, { signal: ac.signal })
  ac.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  let n = 0
  for await (const _ of tp.setInterval(1)) { if (++n === 3) break }
  assert.equal(n, 3)

  const { Readable } = await load('node/stream.js')
  const consumers = await load('node/stream/consumers.js')
  assert.equal(await consumers.text(Readable.from(['a', 'b'])), 'ab')
  assert.deepEqual(await consumers.json(Readable.from(['{"x"', ':1}'])), { x: 1 })

  const { StringDecoder } = await load('node/string_decoder.js')
  const d = new StringDecoder('utf8')
  const euro = new TextEncoder().encode('\u20ac')
  assert.equal(d.write(euro.subarray(0, 1)) + d.write(euro.subarray(1)), '\u20ac')

  const qs = await load('node/querystring.js')
  assert.deepEqual({ ...qs.parse('a=1&b=x%20y') }, { a: '1', b: 'x y' })
  const tty = await load('node/tty.js')
  assert.equal(tty.isatty(1), false)
  const os = await load('node/os.js')
  assert.equal(os.homedir(), process.env.HOME || '/home/user')
  assert.equal(os.EOL, '\n')
  const v8 = await load('node/v8.js')
  assert.ok(v8.getHeapStatistics().heap_size_limit > 0)
  const ph = await load('node/perf_hooks.js')
  const h = ph.monitorEventLoopDelay()
  h.enable()
  assert.equal(typeof h.percentile(99), 'number')
  const dc = await load('node/diagnostics_channel.js')
  const seen = []
  dc.subscribe('x', (m) => seen.push(m))
  dc.channel('x').publish(1)
  assert.deepEqual(seen, [1])
  const assertShim = await load('node/assert.js')
  assert.throws(() => assertShim.default(false), assertShim.AssertionError)
  const constants = await load('node/constants.js')
  assert.equal(constants.default.O_WRONLY, 1)
  const undici = await load('node/undici.js')
  undici.setGlobalDispatcher(new undici.EnvHttpProxyAgent())
  assert.ok(undici.getGlobalDispatcher() instanceof undici.EnvHttpProxyAgent)
})
