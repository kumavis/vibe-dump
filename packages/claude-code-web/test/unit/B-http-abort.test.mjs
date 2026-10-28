// Track B / fix round F2: the http shim's abort windows, with a fake fetch.
//
// The CLI's /v1/messages stream does not take this path in 2.1.311 (its
// fetch wrapper calls globalThis.fetch with the SDK's AbortSignal, because
// Bun.FetchSession is only used when Bun.isStandaloneExecutable is true), but
// axios and other node:http users do. An abort must cancel the response body
// whenever it lands: before the request is sent, while fetch is pending,
// between fetch resolving and the reader being set, and mid-stream.
import test from 'node:test'
import assert from 'node:assert/strict'
import { load } from './B-support.mjs'

const tick = () => new Promise((resolve) => setImmediate(resolve))

/** A fetch whose response the test resolves by hand; records the body's cancel. */
function fakeFetch () {
  const calls = []
  const fetch = (url, init) => {
    let resolve, reject
    const p = new Promise((res, rej) => { resolve = res; reject = rej })
    const call = { url, init, cancelled: false, pulls: 0, resolve: null, reject }
    const body = new ReadableStream({
      pull (c) { call.pulls++; c.enqueue(new TextEncoder().encode(`event: ping\ndata: ${call.pulls}\n\n`)); return new Promise((r) => setTimeout(r, 5)) },
      cancel () { call.cancelled = true }
    }, { highWaterMark: 0 })
    call.resolve = () => resolve(new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } }))
    init?.signal?.addEventListener('abort', () => { call.aborted = true; reject(Object.assign(new Error('aborted'), { name: 'AbortError' })) }, { once: true })
    calls.push(call)
    return p
  }
  return { fetch, calls }
}

async function withFetch (fake, fn) {
  const real = globalThis.fetch
  globalThis.fetch = fake.fetch
  try { return await fn() } finally { globalThis.fetch = real }
}

const post = (http, extra = {}) => {
  const req = http.request({ host: 'api.example.test', port: 443, protocol: 'https:', path: '/v1/messages', method: 'POST', ...extra })
  req.on('error', () => {})
  return req
}

test('http abort: destroy() between fetch resolving and the reader being set cancels the body', async () => {
  const http = await load('node/http.js')
  const fake = fakeFetch()
  await withFetch(fake, async () => {
    const req = post(http)
    let responded = false
    req.on('response', () => { responded = true })
    req.end('{}')
    await tick()
    assert.equal(fake.calls.length, 1)
    fake.calls[0].resolve() // the fetch promise settles ...
    req.destroy() // ... and the abort lands before _send's continuation runs
    await tick()
    assert.equal(responded, false, 'no response is emitted for a destroyed request')
    assert.equal(fake.calls[0].cancelled, true, 'the response body was cancelled')
  })
})

test('http abort: opts.signal aborting mid-stream cancels the body and errors the response', async () => {
  const http = await load('node/http.js')
  const fake = fakeFetch()
  await withFetch(fake, async () => {
    const ac = new AbortController()
    const req = post(http, { signal: ac.signal })
    const res = await new Promise((resolve) => { req.on('response', resolve); req.end('{}'); tick().then(() => fake.calls[0].resolve()) })
    await new Promise((resolve) => res.once('data', resolve))
    res.on('error', () => {})
    const closed = new Promise((resolve) => res.on('close', resolve))
    ac.abort()
    await closed
    await tick()
    assert.equal(fake.calls[0].cancelled || fake.calls[0].aborted, true, 'the body was cancelled')
    assert.equal(fake.calls[0].init.signal.aborted, true, 'the fetch signal was aborted')
  })
})

test('http abort: opts.signal aborting while fetch is pending aborts the fetch', async () => {
  const http = await load('node/http.js')
  const fake = fakeFetch()
  await withFetch(fake, async () => {
    const ac = new AbortController()
    const req = post(http, { signal: ac.signal })
    const err = new Promise((resolve) => req.on('error', resolve))
    req.end('{}')
    await tick()
    ac.abort()
    assert.equal((await err).name, 'AbortError')
    assert.equal(fake.calls[0].init.signal.aborted, true)
  })
})

test('http abort: an abort before the request is sent never leaves a live fetch', async () => {
  const http = await load('node/http.js')
  for (const when of ['before end()', 'right after end()']) {
    const fake = fakeFetch()
    await withFetch(fake, async () => {
      const ac = new AbortController()
      const req = post(http, { signal: ac.signal })
      if (when === 'before end()') { ac.abort(); req.end('{}') } else { req.end('{}'); ac.abort() }
      await tick(); await tick()
      for (const c of fake.calls) {
        assert.equal(c.init.signal.aborted, true, `${when}: a fetch was started with a live signal`)
        c.resolve()
      }
      await tick()
      for (const c of fake.calls) assert.ok(c.cancelled || c.aborted, `${when}: the body was not cancelled`)
      assert.equal(req.destroyed, true)
    })
  }
})

test('http abort: an already-aborted signal destroys the request; listeners are dropped once done', async () => {
  const http = await load('node/http.js')
  const fake = fakeFetch()
  await withFetch(fake, async () => {
    const pre = new AbortController()
    pre.abort()
    const req = post(http, { signal: pre.signal })
    req.end('{}')
    await tick(); await tick()
    assert.equal(req.destroyed, true)
    assert.ok(fake.calls.every((c) => c.init.signal.aborted))

    // a long-lived signal shared by many requests must not keep a listener per finished request
    const shared = new AbortController()
    let added = 0
    let removed = 0
    const add = shared.signal.addEventListener.bind(shared.signal)
    const rm = shared.signal.removeEventListener.bind(shared.signal)
    shared.signal.addEventListener = (...a) => { if (a[0] === 'abort') added++; return add(...a) }
    shared.signal.removeEventListener = (...a) => { if (a[0] === 'abort') removed++; return rm(...a) }
    const r2 = post(http, { signal: shared.signal })
    const res = await new Promise((resolve) => { r2.on('response', resolve); r2.end('{}'); tick().then(() => fake.calls.at(-1).resolve()) })
    res.destroy()
    r2.destroy()
    await tick()
    assert.equal(added, 1)
    assert.equal(removed, 1, 'the abort listener is removed when the request is done')
  })
})
