// Track B: the @jspm/core gaps report B §6b hit while booting cli.js in
// Chromium, each pinned by a test, plus streaming (SSE) through
// http.request / https.request over fetch against a local server.
import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { createHash } from 'node:crypto'
import { load } from './B-support.mjs'

test('zlib.constants carries Z_SYNC_FLUSH and the Brotli constants', async () => {
  const zlib = await load('node/zlib.js')
  assert.equal(zlib.constants.Z_SYNC_FLUSH, 2)
  assert.equal(zlib.default.constants.Z_SYNC_FLUSH, 2)
  assert.equal(zlib.constants.BROTLI_OPERATION_FLUSH, 1)
  assert.equal(zlib.constants.BROTLI_OPERATION_EMIT_METADATA, 3)
  assert.equal(zlib.Z_FINISH, 4)
  assert.equal(zlib.default.Z_MIN_CHUNK, 64)
})

test('url.fileURLToPath works (jspm referenced Deno)', async () => {
  const url = await load('node/url.js')
  assert.equal(url.fileURLToPath('file:///home/user/a%20b.txt'), '/home/user/a b.txt')
  assert.equal(url.fileURLToPath(new URL('file:///x/y')), '/x/y')
  assert.equal(url.default.fileURLToPath('file:///z'), '/z')
  assert.throws(() => url.fileURLToPath('https://example.com/x'), { code: 'ERR_INVALID_URL_SCHEME' })
  assert.equal(url.pathToFileURL('/a b#c').href, 'file:///a%20b%23c')
  assert.equal(url.URL, globalThis.URL)
})

test("crypto.createHash('sha256') is synchronous and correct", async () => {
  const crypto = await load('node/crypto.js')
  const want = createHash('sha256').update('hello').digest('hex')
  assert.equal(crypto.createHash('sha256').update('hello').digest('hex'), want)
  assert.equal(crypto.default.createHash('SHA256').update('hel').update('lo').digest('hex'), want)
  assert.equal(typeof crypto.createPrivateKey, 'function')
  assert.throws(() => crypto.createPrivateKey('x'), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
})

test('events.setMaxListeners exists and applies', async () => {
  const events = await load('node/events.js')
  const { EventEmitter, setMaxListeners } = events
  const e = new EventEmitter()
  setMaxListeners(42, e)
  assert.equal(e.getMaxListeners(), 42)
  const ac = new AbortController()
  setMaxListeners(50, ac.signal) // EventTarget form must not throw
  assert.equal(events.getMaxListeners(ac.signal), 50)
  assert.equal(EventEmitter.setMaxListeners, setMaxListeners)
  assert.equal(events.default, EventEmitter)
  const [v] = await Promise.all([events.once(e, 'x'), Promise.resolve().then(() => e.emit('x', 7))])
  assert.deepEqual(v, [7])
})

test('fs/promises.constants, http.createServer, net.BlockList, os.userInfo, util.isDeepStrictEqual', async () => {
  const fsp = await load('node/fs/promises.js')
  assert.equal(fsp.constants.R_OK, 4)
  const httpShim = await load('node/http.js')
  const server = httpShim.createServer(() => {})
  assert.equal(typeof server.listen, 'function')
  const net = await load('node/net.js')
  const bl = new net.BlockList()
  bl.addSubnet('10.0.0.0', 8)
  bl.addAddress('192.168.1.1')
  assert.equal(bl.check('10.1.2.3'), true)
  assert.equal(bl.check('192.168.1.1'), true)
  assert.equal(bl.check('8.8.8.8'), false)
  const os = await load('node/os.js')
  assert.equal(os.userInfo().username.length > 0, true)
  assert.equal(os.platform(), 'linux')
  const util = await load('node/util.js')
  assert.equal(util.isDeepStrictEqual({ a: [1, { b: new Map([[1, 2]]) }] }, { a: [1, { b: new Map([[1, 2]]) }] }), true)
  assert.equal(util.isDeepStrictEqual({ a: 1 }, { a: '1' }), false)
  assert.equal(util.isDeepStrictEqual(new Set([1, 2]), new Set([2, 1])), true)
})

test('async_hooks.AsyncLocalStorage round-trips run/getStore (jspm threw)', async () => {
  const { AsyncLocalStorage } = await load('node/async_hooks.js')
  const als = new AsyncLocalStorage()
  assert.equal(als.getStore(), undefined)
  const r = als.run({ id: 1 }, () => als.run({ id: 2 }, () => als.getStore().id) + als.getStore().id)
  assert.equal(r, 3)
  assert.equal(als.getStore(), undefined)
})

test('Buffer: base64url, isUtf8; timers have unref()', async () => {
  const { Buffer, isUtf8 } = await load('node/buffer.js')
  const b = Buffer.from('hi?>~', 'utf8')
  assert.equal(b.toString('base64url'), globalThis.Buffer.from('hi?>~').toString('base64url'))
  assert.equal(Buffer.from(b.toString('base64url'), 'base64url').toString(), 'hi?>~')
  assert.equal(Buffer.byteLength('aGk_Pg', 'base64url'), 4)
  assert.ok(Buffer.isEncoding('base64url'))
  assert.equal(isUtf8(Buffer.from([0xff])), false)
  const timers = await load('node/timers.js')
  const t = timers.setTimeout(() => {}, 10)
  assert.equal(t.unref(), t)
  assert.equal(typeof +t, 'number')
  timers.clearTimeout(t)
})

async function sseServer() {
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (c) => { body += c })
    req.on('end', () => {
      if (req.url !== '/v1/messages') { res.writeHead(404).end('not found'); return }
      res.writeHead(200, { 'content-type': 'text/event-stream', 'x-request-body': body })
      let i = 0
      const timer = setInterval(() => {
        res.write(`event: tick\ndata: ${i++}\n\n`)
        if (i === 4) { clearInterval(timer); res.end() }
      }, 80)
    })
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  return server
}

async function readStreaming(mod, opts) {
  const t0 = Date.now()
  return new Promise((resolve, reject) => {
    const req = mod.request(opts, (res) => {
      const chunks = []
      res.setEncoding('utf8')
      res.on('data', (d) => chunks.push({ d, t: Date.now() - t0 }))
      res.on('end', () => resolve({ res, chunks }))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.write('{"stream":')
    req.end('true}')
  })
}

function assertStreamed(chunks) {
  const text = chunks.map((c) => c.d).join('')
  assert.equal(text, [0, 1, 2, 3].map((i) => `event: tick\ndata: ${i}\n\n`).join(''))
  // Events must arrive as they are produced, not in one buffered lump.
  assert.ok(chunks.length >= 3, `expected incremental chunks, got ${chunks.length}`)
  assert.ok(chunks.at(-1).t - chunks[0].t >= 150, 'chunks spread over the server timeline')
}

test('http.request streams an SSE response over fetch', async () => {
  const server = await sseServer()
  try {
    const httpShim = await load('node/http.js')
    const { res, chunks } = await readStreaming(httpShim, {
      host: '127.0.0.1', port: server.address().port, path: '/v1/messages', method: 'POST',
      headers: { 'content-type': 'application/json', 'Content-Length': 15, Connection: 'keep-alive' },
    })
    assert.equal(res.statusCode, 200)
    assert.equal(res.headers['content-type'], 'text/event-stream')
    assert.equal(res.headers['x-request-body'], '{"stream":true}')
    assertStreamed(chunks)
  } finally {
    server.close()
  }
})

test('https.request streams an SSE response (https URL routed to a local server)', async () => {
  const server = await sseServer()
  const realFetch = globalThis.fetch
  const seen = []
  // Same transport the browser uses; only the scheme is rewritten so the test
  // needs no TLS certificate.
  globalThis.fetch = (url, init) => {
    seen.push(String(url))
    return realFetch(String(url).replace(/^https:/, 'http:'), init)
  }
  try {
    const https = await load('node/https.js')
    const { res, chunks } = await readStreaming(https, {
      hostname: '127.0.0.1', port: server.address().port, path: '/v1/messages', method: 'POST',
      headers: { 'content-type': 'application/json' },
    })
    assert.equal(seen[0], `https://127.0.0.1:${server.address().port}/v1/messages`)
    assert.equal(res.statusCode, 200)
    assertStreamed(chunks)
  } finally {
    globalThis.fetch = realFetch
    server.close()
  }
})

test('http.request: errors, 404 bodies, abort and timeout', async () => {
  const server = await sseServer()
  try {
    const httpShim = await load('node/http.js')
    const port = server.address().port
    const r404 = await new Promise((resolve) => httpShim.get(`http://127.0.0.1:${port}/nope`, (res) => {
      let b = ''
      res.on('data', (d) => { b += d })
      res.on('end', () => resolve({ status: res.statusCode, b }))
    }))
    assert.deepEqual(r404, { status: 404, b: 'not found' })

    const refused = await new Promise((resolve) => httpShim.get('http://127.0.0.1:1/').on('error', resolve))
    assert.equal(refused.code, 'ECONNREFUSED')

    // destroy mid-stream: the response errors/closes and nothing hangs
    await new Promise((resolve) => {
      const req = httpShim.request({ host: '127.0.0.1', port, path: '/v1/messages', method: 'POST' }, (res) => {
        res.once('data', () => req.destroy())
        res.on('close', resolve)
        res.on('error', () => {})
      })
      req.on('error', () => {})
      req.end()
    })

    const timedOut = await new Promise((resolve) => {
      const req = httpShim.request({ host: '127.0.0.1', port, path: '/v1/messages', method: 'POST', timeout: 20 }, (res) => res.resume())
      req.on('timeout', () => { req.destroy(); resolve(true) })
      req.on('error', () => {})
      req.end()
    })
    assert.equal(timedOut, true)
  } finally {
    server.close()
  }
})
