// Track W (ChatGPT option, Worker side): installOpenAIAdapter end to end over
// a fake upstream (scripted Responses SSE), a fake page (token handoff) and
// the real egress guard in ChatGPT mode.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { installOpenAIAdapter, createTokenBroker, aggregateAnthropicEvents } from '../../src/runtime/boot/openai-adapter.js'
import { installEgressGuard } from '../../src/runtime/boot/egress.js'
import { OPENAI_ADAPTER_ORIGIN, OPENAI_ADAPTER_KEY, FORBIDDEN_FIELDS } from './W-imports.mjs'
import { sse, textScript, reasoningToolScript, failedScript, claudeCodeRequest, parseAnthropicSse, UPSTREAM_MODEL } from './W-fixtures.mjs'

const SELF = 'http://127.0.0.1:4173'
const API = 'http://127.0.0.1:18080/v1'
const PROVIDER = { kind: 'openai-responses', baseUrl: API, model: UPSTREAM_MODEL, effort: 'auto', contextWindow: 272000 }
const MSG_URL = `${OPENAI_ADAPTER_ORIGIN}/v1/messages?beta=true`
const PROMPT_TOO_LONG = /prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i

/** SSE body that can be slowed down and observes cancellation. */
function sseResponse (events, { status = 200, delayMs = 0, onCancel } = {}) {
  const text = sse(events)
  const parts = text.split(/(?<=\n\n)/)
  let i = 0
  const body = new ReadableStream({
    async pull (c) {
      if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
      if (i < parts.length) c.enqueue(new TextEncoder().encode(parts[i++]))
      else c.close()
    },
    cancel (r) { onCancel?.(r) }
  })
  return new Response(body, { status, headers: { 'content-type': 'text/event-stream' } })
}

/** A Worker-like scope: native fetch = fake upstream + recorder; the guard then the adapter on top. */
function setup ({ upstream, getToken, guard = true, pingMs = 0 } = {}) {
  const calls = []
  const scope = {
    fetch (input, init) {
      const url = typeof input === 'string' ? input : input.url
      const headers = new Headers(init?.headers)
      calls.push({ url, method: init?.method ?? 'GET', headers, body: typeof init?.body === 'string' ? init.body : null, signal: init?.signal })
      if (init?.signal?.aborted) return Promise.reject(init.signal.reason)
      return Promise.resolve(upstream ? upstream({ url, headers, body: init?.body ? JSON.parse(init.body) : null, signal: init?.signal, n: calls.length }) : new Response('native'))
    },
    WebSocket: class {}
  }
  const warnings = []
  let refused = []
  if (guard) refused = installEgressGuard(scope, { baseUrl: OPENAI_ADAPTER_ORIGIN, selfOrigin: SELF, provider: PROVIDER, warn: (m) => warnings.push(m) }).refused
  const tokens = getToken ?? (async () => ({ accessToken: 'AT-1', expiresAt: Date.now() + 3600_000 }))
  const logs = []
  const adapter = installOpenAIAdapter(scope, { provider: PROVIDER, getToken: tokens, log: (m) => logs.push(m), warn: (m) => warnings.push(m), pingMs })
  return { scope, calls, warnings, refused, adapter, logs }
}

const post = (scope, body, { headers = {}, signal } = {}) => scope.fetch(MSG_URL, {
  method: 'POST',
  headers: { 'x-api-key': OPENAI_ADAPTER_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'x-claude-code-session-id': 'sess-hdr', ...headers },
  body: JSON.stringify(body),
  signal
})

test('adapter: the synthetic origin is answered locally; everything else goes on to the (guarded) fetch', async () => {
  const { scope, calls, refused, adapter } = setup()
  assert.equal(adapter.origin, OPENAI_ADAPTER_ORIGIN)
  assert.equal(adapter.endpoint, `${API}/responses`)
  // count_tokens: ceil(bytes / 4), local
  const body = JSON.stringify({ model: 'claude-sonnet-5-5', messages: [{ role: 'user', content: 'hé' }] })
  const ct = await scope.fetch(`${OPENAI_ADAPTER_ORIGIN}/v1/messages/count_tokens?beta=true`, { method: 'POST', body })
  assert.deepEqual(await ct.json(), { input_tokens: Math.ceil(new TextEncoder().encode(body).length / 4) })
  // anything else: 404
  const nf = await scope.fetch(`${OPENAI_ADAPTER_ORIGIN}/v1/models`)
  assert.equal(nf.status, 404)
  assert.equal((await nf.json()).error.type, 'not_found_error')
  // probes: canned, no upstream call, both shapes
  const probe = await post(scope, { model: 'claude-sonnet-5-5', max_tokens: 1, messages: [{ role: 'user', content: 'quota' }] })
  const pm = await probe.json()
  assert.deepEqual([probe.status, pm.type, pm.content[0].type, pm.stop_reason, pm.usage.output_tokens], [200, 'message', 'text', 'max_tokens', 1])
  const sprobe = await post(scope, { model: 'claude-sonnet-5-5', max_tokens: 1, stream: true, messages: [{ role: 'user', content: 'x' }] })
  assert.deepEqual(parseAnthropicSse(await sprobe.text()).map((e) => e.type), ['message_start', 'content_block_start', 'content_block_delta', 'content_block_stop', 'message_delta', 'message_stop'])
  assert.equal(calls.length, 0, 'nothing reached the network')
  // the page's own files pass the guard; foreign hosts and stray credentials do not
  assert.equal(await (await scope.fetch(`${SELF}/runtime/x.js`)).text(), 'native')
  await assert.rejects(scope.fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': 'k' } }), (e) => e.code === 'EGRESS_REFUSED')
  await assert.rejects(scope.fetch(`${SELF}/x`, { headers: { authorization: 'Bearer AT-1' } }), (e) => e.code === 'EGRESS_REFUSED')
  assert.equal(refused.length, 2)
  assert.equal(adapter.stats.canned, 2)
  assert.equal(adapter.stats.countTokens, 1)
})

test('adapter: stream:true -> one upstream POST of the right shape, Anthropic SSE back', async () => {
  const { scope, calls, adapter, logs } = setup({ upstream: () => sseResponse(textScript()) })
  const res = await post(scope, claudeCodeRequest())
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type'), /^text\/event-stream/)
  assert.match(res.headers.get('request-id'), /^req_adapter_/)
  const evs = parseAnthropicSse(await res.text())
  assert.deepEqual(evs.map((e) => e.type), ['message_start', 'content_block_start', 'content_block_delta', 'content_block_delta', 'content_block_stop', 'message_delta', 'message_stop'])
  assert.equal(evs[0].message.model, 'claude-sonnet-5-5')
  assert.equal(calls.length, 1)
  const up = calls[0]
  assert.equal(up.url, `${API}/responses`)
  assert.equal(up.method, 'POST')
  assert.deepEqual([...up.headers.keys()].sort(), ['accept', 'authorization', 'content-type'], 'nothing that presents as the Codex CLI')
  assert.equal(up.headers.get('authorization'), 'Bearer AT-1')
  assert.equal(up.headers.get('accept'), 'text/event-stream')
  const body = JSON.parse(up.body)
  assert.equal(body.store, false)
  assert.equal(body.stream, true)
  assert.equal(body.model, UPSTREAM_MODEL)
  assert.equal(body.prompt_cache_key, 'sess-hdr', 'the session header wins over metadata')
  for (const f of FORBIDDEN_FIELDS) assert.ok(!(f in body), f)
  assert.ok(!up.body.includes('"role":"system"'))
  assert.equal(adapter.stats.upstream, 1)
  assert.match(logs.join('\n'), /POST http:\/\/127\.0\.0\.1:18080\/v1\/responses \(gpt-5\.5, 8 input items, 4 tools, ~\d+ tokens\) -> 200/)
  assert.ok(!logs.join('\n').includes('AT-1'), 'the token is never logged')
})

test('adapter: a weather-tool round trip through the token handoff (fake page), two turns', async () => {
  const page = []
  let broker
  broker = createTokenBroker({ post: (m) => { page.push(m); queueMicrotask(() => broker.onMessage({ type: 'provider-token', id: m.id, accessToken: `AT-${page.length}`, expiresAt: Date.now() + 3600_000 })) } })
  const seen = []
  const { scope, calls } = setup({
    getToken: ({ failedToken, ambiguous } = {}) => (failedToken ? broker.renew(failedToken, { ambiguous }) : broker.get()),
    upstream: ({ body }) => {
      seen.push(body)
      const out = body.input.find((i) => i.type === 'function_call_output')
      if (!out) return sseResponse(reasoningToolScript())
      return sseResponse(textScript({ text: [`The weather: ${out.output}`] }))
    }
  })
  const tools = [{ name: 'mcp__page__get_weather', description: 'w', input_schema: { type: 'object', properties: { city: { type: 'string' } } } }]
  const first = { model: 'claude-sonnet-5-5', max_tokens: 32000, stream: true, tools, messages: [{ role: 'user', content: 'use the weather tool' }] }
  const r1 = aggregateAnthropicEvents(parseAnthropicSse(await (await post(scope, first)).text())).message
  assert.equal(r1.stop_reason, 'tool_use')
  const call = r1.content.find((b) => b.type === 'tool_use')
  assert.deepEqual([call.name, call.input], ['mcp__page__get_weather', { city: 'Paris' }])
  // Claude Code runs the tool and sends the history back (thinking block with our signature included)
  const second = { ...first, messages: [...first.messages, { role: 'assistant', content: r1.content }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: call.id, content: 'sunny, 21 C' }] }] }
  const r2 = aggregateAnthropicEvents(parseAnthropicSse(await (await post(scope, second)).text())).message
  assert.equal(r2.content[0].text, 'The weather: sunny, 21 C')
  assert.equal(r2.stop_reason, 'end_turn')
  const replay = seen[1].input
  assert.deepEqual(replay.map((i) => i.type), ['message', 'reasoning', 'function_call', 'function_call_output'])
  assert.equal(replay[1].encrypted_content, 'ENC-UPSTREAM-1')
  assert.equal(replay[2].call_id, replay[3].call_id)
  assert.deepEqual(page.map((m) => m.reason), ['start'], 'one token request for both turns')
  assert.ok(calls.every((c) => c.headers.get('authorization') === 'Bearer AT-1'))
})

test('adapter: non-streaming calls are aggregated into one Message', async () => {
  const { scope } = setup({ upstream: () => sseResponse(reasoningToolScript()) })
  const res = await post(scope, { ...claudeCodeRequest(), stream: false })
  assert.equal(res.status, 200)
  const m = await res.json()
  assert.equal(m.type, 'message')
  assert.equal(m.stop_reason, 'tool_use')
  assert.deepEqual(m.content.map((b) => b.type), ['thinking', 'tool_use'])
  assert.deepEqual(m.content[1].input, { city: 'Paris' })
  assert.equal(m.usage.cache_read_input_tokens, 4096)
  // a mid-stream failure in a non-streaming call is an HTTP error
  const { scope: s2 } = setup({ upstream: () => sseResponse([...textScript().slice(0, 5), { type: 'response.failed', response: { error: { code: 'server_is_overloaded', message: 'busy' } } }]) })
  const r2 = await post(s2, { ...claudeCodeRequest(), stream: false })
  assert.deepEqual([r2.status, (await r2.json()).error.type], [529, 'overloaded_error'])
})

test('adapter: 401 -> renew once and retry; a second 401 is an authentication_error', async () => {
  const asked = []
  const getToken = async ({ failedToken } = {}) => { asked.push(failedToken ?? 'get'); return { accessToken: failedToken ? 'AT-NEW' : 'AT-OLD' } }
  const { scope, calls, adapter } = setup({ getToken, upstream: ({ headers }) => (headers.get('authorization') === 'Bearer AT-NEW' ? sseResponse(textScript()) : new Response('{"error":{"code":"token_expired","message":"expired"}}', { status: 401 })) })
  const ok = await post(scope, claudeCodeRequest())
  assert.equal(ok.status, 200)
  assert.equal(parseAnthropicSse(await ok.text()).at(-1).type, 'message_stop')
  assert.deepEqual(asked, ['get', 'AT-OLD'])
  assert.equal(calls.length, 2)
  assert.equal(adapter.stats.retried401, 1)

  const { scope: s2, calls: c2 } = setup({ getToken: async () => ({ accessToken: 'AT-SAME' }), upstream: () => new Response('{"error":{"message":"no"}}', { status: 401 }) })
  const bad = await post(s2, claudeCodeRequest())
  assert.equal(bad.status, 401)
  assert.equal(bad.headers.get('x-should-retry'), 'false')
  assert.equal((await bad.json()).error.type, 'authentication_error')
  assert.equal(c2.length, 1, 'the same token is not retried')

  let n = 0
  const { scope: s3, calls: c3 } = setup({ getToken: async () => ({ accessToken: `AT-${++n}` }), upstream: () => new Response('nope', { status: 401 }) })
  assert.equal((await post(s3, claudeCodeRequest())).status, 401)
  assert.equal(c3.length, 2, 'one retry, then fail')
})

test('adapter: an unreadable failure (TypeError, the edge 401 without CORS) renews and retries once', async () => {
  const asked = []
  const getToken = async ({ failedToken, ambiguous } = {}) => { asked.push([failedToken, ambiguous]); return { accessToken: failedToken ? 'AT-2' : 'AT-1' } }
  const { scope, adapter } = setup({ getToken, upstream: ({ headers }) => { if (headers.get('authorization') === 'Bearer AT-1') throw new TypeError('Failed to fetch'); return sseResponse(textScript()) } })
  assert.equal((await post(scope, claudeCodeRequest())).status, 200)
  assert.deepEqual(asked, [[undefined, undefined], ['AT-1', true]])
  assert.equal(adapter.stats.retriedNetwork, 1)
  // no replacement token: the TypeError reaches the SDK (its connection-error retry applies)
  const { scope: s2 } = setup({ getToken: async ({ failedToken } = {}) => (failedToken ? null : { accessToken: 'AT-1' }), upstream: () => { throw new TypeError('Failed to fetch') } })
  await assert.rejects(post(s2, claudeCodeRequest()), TypeError)
})

test('adapter: HTTP errors and pre-stream failures become Anthropic HTTP errors', async () => {
  const limit = setup({ upstream: () => new Response(JSON.stringify({ error: { code: 'subscription_sharing_usage_limit_exceeded', message: 'weekly cap reached' } }), { status: 429 }) })
  const r1 = await post(limit.scope, claudeCodeRequest())
  assert.deepEqual([r1.status, r1.headers.get('x-should-retry'), (await r1.json()).error.type], [429, 'false', 'rate_limit_error'])
  assert.match(limit.warnings.join('\n'), /upstream HTTP 429 -> 429 rate_limit_error/)

  const overflow = setup({ upstream: () => sseResponse(failedScript({ code: 'context_length_exceeded', message: 'Your input exceeds the context window of this model.' })) })
  const r2 = await post(overflow.scope, claudeCodeRequest())
  assert.equal(r2.status, 400)
  const m = PROMPT_TOO_LONG.exec((await r2.json()).error.message)
  assert.ok(m && Number(m[1]) > Number(m[2]) && Number(m[2]) === 272000)

  const empty = setup({ upstream: () => sseResponse([{ type: 'response.created', response: {} }]) })
  const r3 = await post(empty.scope, claudeCodeRequest())
  assert.deepEqual([r3.status, (await r3.json()).error.type], [529, 'overloaded_error'])

  const e500 = setup({ upstream: () => new Response('oops', { status: 500 }) })
  const r4 = await post(e500.scope, claudeCodeRequest())
  assert.deepEqual([r4.status, (await r4.json()).error.type], [500, 'api_error'])

  const notJson = setup()
  const r5 = await notJson.scope.fetch(MSG_URL, { method: 'POST', body: '{nope' })
  assert.equal(r5.status, 400)
})

test('adapter: no ChatGPT token -> 401 telling the user to sign in', async () => {
  const { scope, calls } = setup({ getToken: async () => { const e = new Error('not signed in with ChatGPT'); e.name = 'ProviderTokenError'; throw e } })
  const r = await post(scope, claudeCodeRequest())
  assert.equal(r.status, 401)
  assert.match((await r.json()).error.message, /Not signed in with ChatGPT: not signed in with ChatGPT\. Sign in with ChatGPT in Settings/)
  assert.equal(calls.length, 0)
})

test('adapter: the harness AbortSignal cancels the upstream stream, and a pending token wait', async () => {
  let sawCancel = false
  let sawAbort = false
  const { scope, calls } = setup({ upstream: ({ signal }) => {
    const res = sseResponse(textScript({ text: Array.from({ length: 50 }, (_, i) => `w${i} `) }), { delayMs: 20, onCancel: () => { sawCancel = true } })
    signal?.addEventListener('abort', () => { sawAbort = true })
    return res
  } })
  const ac = new AbortController()
  const res = await post(scope, claudeCodeRequest(), { signal: ac.signal })
  const reader = res.body.getReader()
  await reader.read()
  ac.abort()
  await reader.cancel()
  await new Promise((resolve) => setTimeout(resolve, 50))
  assert.ok(sawAbort, 'the upstream fetch saw the abort (a real fetch then errors its body)')
  assert.ok(sawCancel, 'cancelling the synthetic body cancels the upstream body')
  assert.equal(calls[0].signal, ac.signal, 'the same signal object went upstream')

  // like a real fetch: the abort errors the upstream body, and the synthetic body with it
  const { scope: s1 } = setup({ upstream: ({ signal }) => {
    const text = sse(textScript({ text: Array.from({ length: 50 }, (_, i) => `w${i} `) }))
    let ctrl
    const body = new ReadableStream({ start (c) { ctrl = c; c.enqueue(new TextEncoder().encode(text.slice(0, 600))) } })
    signal.addEventListener('abort', () => ctrl.error(signal.reason))
    return new Response(body, { status: 200 })
  } })
  const ac1 = new AbortController()
  const r1 = await post(s1, claudeCodeRequest(), { signal: ac1.signal })
  const rd = r1.body.getReader()
  await rd.read()
  ac1.abort()
  await assert.rejects((async () => { for (;;) { const { done } = await rd.read(); if (done) return } })(), (e) => e.name === 'AbortError')

  // aborted while the page has not answered the token request yet
  const ac2 = new AbortController()
  const { scope: s2, calls: c2 } = setup({ getToken: () => new Promise(() => {}) })
  const p = post(s2, claudeCodeRequest(), { signal: ac2.signal })
  ac2.abort()
  await assert.rejects(p, (e) => e.name === 'AbortError')
  assert.equal(c2.length, 0)
  // already aborted
  const ac3 = new AbortController()
  ac3.abort()
  await assert.rejects(post(s2, claudeCodeRequest(), { signal: ac3.signal }), (e) => e.name === 'AbortError')
})

test('adapter: Request objects and gzip bodies; pings during a silent upstream', async () => {
  const { scope, calls } = setup({ upstream: () => sseResponse(textScript()) })
  const req = new Request(MSG_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(claudeCodeRequest()) })
  assert.equal((await scope.fetch(req)).status, 200)
  const gz = new Uint8Array(await new Response(new Blob([JSON.stringify(claudeCodeRequest())]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer())
  const r2 = await scope.fetch(MSG_URL, { method: 'POST', headers: { 'content-encoding': 'gzip' }, body: gz })
  assert.equal(r2.status, 200)
  assert.equal(calls.length, 2)
  assert.equal(JSON.parse(calls[1].body).model, UPSTREAM_MODEL)

  const slow = setup({ upstream: () => sseResponse(textScript(), { delayMs: 40 }), pingMs: 60 })
  const evs = parseAnthropicSse(await (await post(slow.scope, claudeCodeRequest())).text())
  assert.ok(evs.some((e) => e.type === 'ping'))
  assert.equal(evs.at(-1).type, 'message_stop')
})

test('adapter: refuses to install without a ChatGPT provider or a token source', () => {
  assert.throws(() => installOpenAIAdapter({ fetch () {} }, { provider: { kind: 'anthropic' }, getToken () {} }), /openai-responses/)
  assert.throws(() => installOpenAIAdapter({ fetch () {} }, { provider: PROVIDER }), /getToken/)
})
