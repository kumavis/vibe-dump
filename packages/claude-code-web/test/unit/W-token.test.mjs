// Track W (ChatGPT option, Worker side): the token handoff state machine
// (ARCHITECTURE.md Appendix A "Token handoff"), against a fake page.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createTokenBroker, ProviderTokenError } from '../../src/runtime/boot/openai/token.js'

/** A fake page that answers provider-token-request like src/host/worker-bridge.js, with scripted tokens. */
function fakePage ({ auto = true, tokens = ['at-1', 'at-2', 'at-3', 'at-4'], ttlMs = 3600_000, now } = {}) {
  const requests = []
  let broker = null
  let n = 0
  const page = {
    requests,
    attach (b) { broker = b },
    answer (req, reply) { broker.onMessage({ type: 'provider-token', id: req.id, ...reply }) },
    post (msg) {
      requests.push(msg)
      if (auto) queueMicrotask(() => page.answer(msg, { accessToken: tokens[n++], expiresAt: now() + ttlMs }))
    }
  }
  return page
}

function setup (o = {}) {
  let t = 1_700_000_000_000
  const clock = { now: () => t, advance (ms) { t += ms } }
  const page = fakePage({ now: clock.now, ...o })
  const timers = []
  const broker = createTokenBroker({
    post: (m) => page.post(m),
    now: clock.now,
    setTimer: (fn, ms) => { const h = { fn, ms }; timers.push(h); return h },
    clearTimer: (h) => { h.cleared = true },
    ...o.broker
  })
  page.attach(broker)
  return { broker, page, clock, timers }
}

test('token: asks with reason "start", caches until expiresAt - 60 s, then "expired"', async () => {
  const { broker, page, clock } = setup()
  const a = await broker.get()
  assert.equal(a.accessToken, 'at-1')
  assert.deepEqual(page.requests, [{ type: 'provider-token-request', id: 'tok-1', reason: 'start' }])
  assert.equal((await broker.get()).accessToken, 'at-1', 'cached')
  clock.advance(3600_000 - 61_000)
  assert.equal((await broker.get()).accessToken, 'at-1', 'still outside the 60 s window')
  clock.advance(2_000)
  assert.equal((await broker.get()).accessToken, 'at-2')
  assert.deepEqual(page.requests.map((r) => r.reason), ['start', 'expired'])
  assert.ok(!JSON.stringify(page.requests).includes('refresh'), 'the Worker never mentions or holds a refresh token')
})

test('token: concurrent callers share one request', async () => {
  const { broker, page } = setup()
  const [a, b, c] = await Promise.all([broker.get(), broker.get(), broker.get()])
  assert.equal(page.requests.length, 1)
  assert.deepEqual([a.accessToken, b.accessToken, c.accessToken], ['at-1', 'at-1', 'at-1'])
})

test('token: after a 401, renew asks once with "unauthorized"; a token already replaced is reused', async () => {
  const { broker, page } = setup()
  const first = await broker.get()
  const [r1, r2] = await Promise.all([broker.renew(first.accessToken), broker.renew(first.accessToken)])
  assert.equal(r1.accessToken, 'at-2')
  assert.equal(r2.accessToken, 'at-2')
  assert.deepEqual(page.requests.map((r) => r.reason), ['start', 'unauthorized'])
  // a request that failed with the old token after the renewal gets the new one without asking
  assert.equal((await broker.renew(first.accessToken)).accessToken, 'at-2')
  assert.equal(page.requests.length, 2)
  // an explicit 401 on a brand-new token still asks (the page may need to refresh a revoked token)
  assert.equal((await broker.renew('at-2')).accessToken, 'at-3')
  assert.deepEqual(page.requests.map((r) => r.reason), ['start', 'unauthorized', 'unauthorized'])
})

test('token: an ambiguous failure (TypeError) right after obtaining a token does not ask again', async () => {
  const { broker, page, clock } = setup()
  const t = await broker.get()
  assert.equal(await broker.renew(t.accessToken, { ambiguous: true }), null)
  assert.equal(page.requests.length, 1)
  clock.advance(31_000)
  assert.equal((await broker.renew(t.accessToken, { ambiguous: true })).accessToken, 'at-2')
  assert.deepEqual(page.requests.map((r) => r.reason), ['start', 'unauthorized'])
})

test('token: the page refusing, timing out, stale answers, odd expiresAt', async () => {
  // refusal
  const s1 = setup({ auto: false })
  const p = s1.broker.get()
  s1.page.answer(s1.page.requests[0], { error: 'not signed in with ChatGPT' })
  await assert.rejects(p, (e) => e instanceof ProviderTokenError && e.code === 'PROVIDER_TOKEN_REFUSED' && /not signed in/.test(e.message))
  // the next get asks again
  const p2 = s1.broker.get()
  assert.equal(s1.page.requests.length, 2)
  // a stale answer (old id) is ignored; the right one resolves
  s1.broker.onMessage({ type: 'provider-token', id: 'tok-1', accessToken: 'stale', expiresAt: 0 })
  s1.page.answer(s1.page.requests[1], { accessToken: 'good', expiresAt: 0 })
  assert.equal((await p2).accessToken, 'good')
  assert.ok(s1.timers.every((h) => h.cleared), 'timeouts cleared')
  // expiresAt 0 -> default TTL (5 min) ; seconds -> ms
  assert.equal(s1.broker.cached.expiresAt - s1.broker.cached.obtainedAt, 300_000)
  s1.clock.advance(300_000)
  const p3 = s1.broker.get()
  s1.page.answer(s1.page.requests[2], { accessToken: 'secs', expiresAt: Math.floor(s1.clock.now() / 1000) + 3600 })
  assert.equal((await p3).expiresAt, (Math.floor(s1.clock.now() / 1000) + 3600) * 1000)
  assert.equal(s1.broker.onMessage({ type: 'something-else' }), false)
  // empty token is a refusal
  const s2 = setup({ auto: false })
  const p4 = s2.broker.get()
  s2.page.answer(s2.page.requests[0], { accessToken: '' })
  await assert.rejects(p4, ProviderTokenError)
  // timeout
  const s3 = setup({ auto: false })
  const p5 = s3.broker.get()
  assert.equal(s3.timers[0].ms, 90_000)
  s3.timers[0].fn()
  await assert.rejects(p5, (e) => e.code === 'PROVIDER_TOKEN_TIMEOUT')
  assert.throws(() => createTokenBroker({}), /post is required/)
})
