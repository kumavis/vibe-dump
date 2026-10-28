// Track P: the mock's OpenAI side (ChatGPT option): the fake issuer, /v1/models,
// and /v1/responses with its request-shape checks and SSE scenarios.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { startMockApi, analyzeResponses, checkResponsesRequest, MOCK_CLIENT_ID } from '../../mock/mock-api.mjs'

let mock
before(async () => { mock = await startMockApi({ port: 0, eventDelayMs: 0 }) })
after(async () => { await mock.close() })

const HOST_ID = 'urn:uuid:12345678-1234-4123-8123-123456789abc'

/** The paste flow from Node: authorize (302), then the code exchange. */
async function signIn ({ clientId = 'dynamic_agent_client' } = {}) {
  const verifier = randomBytes(64).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  const q = new URLSearchParams({
    response_type: 'code', client_id: clientId, redirect_uri: 'http://127.0.0.1:1455/auth/callback',
    scope: 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct', resource: 'https://api.openai.com/v1',
    code_challenge: challenge, code_challenge_method: 'S256', state: 'st-1', nonce: 'no-1', ext_agent_host_id: HOST_ID,
    ...(clientId === 'dynamic_agent_client' ? { agent_name_hint: 'claude-code-web' } : {})
  })
  const auth = await fetch(`${mock.url}/api/accounts/authorize?${q}`, { redirect: 'manual' })
  assert.equal(auth.status, 302, await auth.text())
  const cb = new URL(auth.headers.get('location'))
  assert.equal(cb.origin + cb.pathname, 'http://127.0.0.1:1455/auth/callback')
  assert.equal(cb.searchParams.get('state'), 'st-1')
  assert.equal(cb.searchParams.get('client_id'), MOCK_CLIENT_ID)
  const res = await tokenPost({ grant_type: 'authorization_code', client_id: MOCK_CLIENT_ID, code: cb.searchParams.get('code'), code_verifier: verifier, redirect_uri: 'http://127.0.0.1:1455/auth/callback', resource: 'https://api.openai.com/v1' })
  assert.equal(res.status, 200)
  return res.json()
}

const tokenPost = (form) => fetch(`${mock.url}/api/accounts/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(form).toString() })

const responses = (token, body, headers = {}) => fetch(`${mock.url}/v1/responses`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
  body: JSON.stringify(body)
})

const userMsg = (text) => ({ type: 'message', role: 'user', content: [{ type: 'input_text', text: `<system-reminder>ignore me</system-reminder>${text}` }] })
const baseBody = (input, extra = {}) => ({ model: 'gpt-5.5', input, tools: [{ type: 'function', name: 'mcp__page__get_weather', parameters: { type: 'object', properties: {} }, strict: false }, { type: 'function', name: 'Write', parameters: { type: 'object' }, strict: false }], tool_choice: 'auto', parallel_tool_calls: true, reasoning: { effort: 'medium', summary: 'auto' }, include: ['reasoning.encrypted_content'], store: false, stream: true, ...extra })

function parseSse (text) {
  return text.trim().split('\n\n').map((chunk) => {
    const lines = chunk.split('\n')
    return { event: lines[0].slice('event: '.length), data: JSON.parse(lines[1].slice('data: '.length)) }
  })
}

const lastRequest = async () => (await (await fetch(`${mock.url}/__requests`)).json()).at(-1)

test('mock (openai): the fake issuer checks the Sign in with ChatGPT parameters and PKCE; refresh tokens rotate and reuse is refused', async () => {
  const t = await signIn()
  assert.match(t.access_token, /^mock_at_/)
  assert.match(t.refresh_token, /^mock_rt_/)
  assert.equal(t.expires_in, 3600)
  assert.ok(t.scope.split(' ').includes('chatgpt.tokens.use.direct'))
  const claims = JSON.parse(Buffer.from(t.id_token.split('.')[1], 'base64url').toString())
  assert.equal(claims.nonce, 'no-1')
  assert.equal(claims.email, 'e2e@example.com')
  assert.equal(claims.aud, MOCK_CLIENT_ID)

  const r1 = await tokenPost({ grant_type: 'refresh_token', client_id: MOCK_CLIENT_ID, refresh_token: t.refresh_token, resource: 'https://api.openai.com/v1' })
  assert.equal(r1.status, 200)
  const t1 = await r1.json()
  assert.notEqual(t1.refresh_token, t.refresh_token)
  const reused = await tokenPost({ grant_type: 'refresh_token', client_id: MOCK_CLIENT_ID, refresh_token: t.refresh_token, resource: 'https://api.openai.com/v1' })
  assert.equal(reused.status, 401)
  assert.equal(reused.headers.get('access-control-allow-origin'), '*', 'errors are readable cross-origin, as on auth.openai.com')
  assert.equal((await reused.json()).error.code, 'refresh_token_reused')

  // a second sign-in with the issued client id, no agent_name_hint
  await signIn({ clientId: MOCK_CLIENT_ID })
  // what the issuer refuses
  const bad = await fetch(`${mock.url}/api/accounts/authorize?response_type=code&client_id=app_EMoamEEZ73f0CkXaXp7hrann&redirect_uri=http://localhost:1455/auth/callback&originator=codex_cli_rs`, { redirect: 'manual' })
  assert.equal(bad.status, 400)
  const why = (await bad.json()).error_description
  for (const p of ['unknown client_id', 'redirect_uri must be', 'chatgpt.tokens.use.direct', 'PKCE', 'ext_agent_host_id', 'originator']) assert.ok(why.includes(p), `${p}: ${why}`)
  const wrongVerifier = await (async () => {
    const q = new URLSearchParams({ response_type: 'code', client_id: MOCK_CLIENT_ID, redirect_uri: 'http://127.0.0.1:1455/auth/callback', scope: 'chatgpt.tokens.use.direct', resource: 'https://api.openai.com/v1', code_challenge: 'A'.repeat(43), code_challenge_method: 'S256', state: 's', nonce: 'n', ext_agent_host_id: HOST_ID })
    const loc = new URL((await fetch(`${mock.url}/api/accounts/authorize?${q}`, { redirect: 'manual' })).headers.get('location'))
    return tokenPost({ grant_type: 'authorization_code', client_id: MOCK_CLIENT_ID, code: loc.searchParams.get('code'), code_verifier: 'wrong', redirect_uri: 'http://127.0.0.1:1455/auth/callback', resource: 'https://api.openai.com/v1' })
  })()
  assert.equal(wrongVerifier.status, 400)
  assert.match((await wrongVerifier.json()).error.message, /PKCE/)
  const json = await fetch(`${mock.url}/api/accounts/oauth/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ grant_type: 'refresh_token' }) })
  assert.equal(json.status, 400, 'form-encoded only')
})

test('mock (openai): /v1/models lists for a bearer the issuer gave out; preflights pass for any origin', async () => {
  const t = await signIn()
  const res = await fetch(`${mock.url}/v1/models`, { headers: { authorization: `Bearer ${t.access_token}` } })
  assert.equal(res.status, 200)
  const { models } = await res.json()
  assert.deepEqual(models.map((m) => [m.slug, m.visibility]), [['gpt-5.5', 'list'], ['gpt-6.1-sol', 'list'], ['codex-auto-review', 'hide']])
  assert.equal(models[0].context_window, 272000)
  const forged = await fetch(`${mock.url}/v1/models`, { headers: { authorization: 'Bearer forged' } })
  assert.equal(forged.status, 401)
  assert.equal(forged.headers.get('access-control-allow-origin'), null, 'like OpenAI\'s edge layer: no CORS headers for a bad token')
  const pre = await fetch(`${mock.url}/v1/responses`, { method: 'OPTIONS', headers: { origin: 'https://kumavis.github.io', 'access-control-request-method': 'POST', 'access-control-request-headers': 'authorization,content-type' } })
  assert.equal(pre.status, 204)
  assert.equal(pre.headers.get('access-control-allow-origin'), '*')
  const anth = await fetch(`${mock.url}/v1/messages`, { method: 'OPTIONS', headers: { origin: 'http://x', 'access-control-request-method': 'POST', 'access-control-request-headers': 'authorization' } })
  assert.equal(anth.status, 400, '/v1/messages keeps its strict check')
})

test('mock (openai): "say hi" streams reasoning (summary + encrypted content), then text, then response.completed', async () => {
  const t = await signIn()
  const res = await responses(t.access_token, baseBody([{ type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'You are a Claude agent.' }] }, userMsg('say hi')]))
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type'), /text\/event-stream/)
  assert.equal(res.headers.get('access-control-allow-origin'), '*')
  const ev = parseSse(await res.text())
  const types = ev.map((e) => e.event)
  assert.equal(types[0], 'response.created')
  assert.equal(types.at(-1), 'response.completed')
  assert.ok(ev.every((e, i) => e.data.sequence_number === i && e.data.type === e.event))
  const reasoningDone = ev.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'reasoning').data.item
  assert.match(reasoningDone.encrypted_content, /^enc_mock_rs_mock_/)
  assert.equal(reasoningDone.summary[0].text, 'Looking at the request.')
  assert.ok(types.includes('response.reasoning_summary_text.delta'))
  const text = ev.filter((e) => e.event === 'response.output_text.delta').map((e) => e.data.delta).join('')
  assert.equal(text, 'hi from the mock API')
  const completed = ev.at(-1).data.response
  assert.equal(completed.status, 'completed')
  assert.deepEqual(completed.usage, { input_tokens: 120, input_tokens_details: { cached_tokens: 20 }, output_tokens: 30, output_tokens_details: { reasoning_tokens: 10 }, total_tokens: 150 })
  const rec = await lastRequest()
  assert.equal(rec.scenario, 'hi')
  assert.deepEqual(rec.problems, [])
  assert.deepEqual(rec.checks, { bearer: true, store: true, stream: true, inputArray: true, structure: true, noSystemItems: true, forbiddenFields: [], forbiddenHeaders: [], bearerKnown: true })
  // without summary / include: no summary events, no encrypted content
  const plain = parseSse(await (await responses(t.access_token, baseBody([userMsg('say hi')], { reasoning: { effort: 'low' }, include: [] }))).text())
  const r2 = plain.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'reasoning').data.item
  assert.equal(r2.encrypted_content, undefined)
  assert.deepEqual(r2.summary, [])
  assert.ok(!plain.some((e) => e.event.startsWith('response.reasoning_summary')))
})

test('mock (openai): the weather tool is a function_call; the follow-up must answer its call_id and is echoed; reasoning replay is recorded', async () => {
  const t = await signIn()
  const first = parseSse(await (await responses(t.access_token, baseBody([userMsg('use the weather tool')]))).text())
  const call = first.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'function_call').data.item
  assert.equal(call.name, 'mcp__page__get_weather')
  assert.match(call.call_id, /^call_mock_weather_/)
  assert.deepEqual(JSON.parse(call.arguments), { city: 'Paris' })
  const deltas = first.filter((e) => e.event === 'response.function_call_arguments.delta').map((e) => e.data.delta).join('')
  assert.equal(deltas, call.arguments)
  const reasoning = first.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'reasoning').data.item
  // the follow-up, without the output: 400
  const missing = await responses(t.access_token, baseBody([userMsg('use the weather tool'), call, { type: 'function_call_output', call_id: 'call_other', output: 'x' }]))
  assert.equal(missing.status, 400)
  const followUp = baseBody([userMsg('use the weather tool'), { type: 'reasoning', id: reasoning.id, summary: [], encrypted_content: reasoning.encrypted_content }, { type: 'function_call', call_id: call.call_id, name: call.name, arguments: call.arguments }, { type: 'function_call_output', call_id: call.call_id, output: 'Sunny, 21 °C in Paris' }])
  const second = parseSse(await (await responses(t.access_token, followUp)).text())
  assert.equal(second.filter((e) => e.event === 'response.output_text.delta').map((e) => e.data.delta).join(''), 'The weather tool said: Sunny, 21 °C in Paris')
  const rec = await lastRequest()
  assert.equal(rec.phase, 'follow-up')
  assert.deepEqual(rec.toolResults, [{ tool_use_id: call.call_id, is_error: false, text: 'Sunny, 21 °C in Paris' }])
  assert.deepEqual(rec.reasoningReplayed, [{ id: reasoning.id, encrypted: true, known: true }])
})

test('mock (openai): write a file and the file-tools chain map to function calls', async () => {
  const t = await signIn()
  const w = parseSse(await (await responses(t.access_token, baseBody([userMsg('write a file')]))).text())
  const write = w.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'function_call').data.item
  assert.equal(write.name, 'Write')
  assert.equal(JSON.parse(write.arguments).file_path, '/home/user/workspace/hello.txt')
  const input = [userMsg('run the file tools')]
  const names = []
  for (let i = 0; i < 5; i++) {
    const ev = parseSse(await (await responses(t.access_token, baseBody(input))).text())
    const fc = ev.find((e) => e.event === 'response.output_item.done' && e.data.item.type === 'function_call')?.data.item
    if (!fc) {
      assert.match(ev.filter((e) => e.event === 'response.output_text.delta').map((e) => e.data.delta).join(''), /^File tools done\.\nGlob: g0\nGrep: g1\nRead: g2\nEdit: g3$/)
      break
    }
    names.push(fc.name)
    input.push({ type: 'function_call', call_id: fc.call_id, name: fc.name, arguments: fc.arguments }, { type: 'function_call_output', call_id: fc.call_id, output: [{ type: 'input_text', text: `g${i}` }] })
  }
  assert.deepEqual(names, ['Glob', 'Grep', 'Read', 'Edit'])
})

test('mock (openai): requests the preview would reject are refused and recorded', async () => {
  const t = await signIn()
  const cases = [
    [{ ...baseBody([userMsg('say hi')]), store: true }, {}, /store must be false/],
    [{ ...baseBody([userMsg('say hi')]), stream: false }, {}, /stream must be true/],
    [baseBody([{ type: 'message', role: 'system', content: 'x' }, userMsg('say hi')]), {}, /role:"system"/],
    [{ ...baseBody([userMsg('say hi')]), max_output_tokens: 100, temperature: 1, metadata: {} }, {}, /max_output_tokens.*temperature.*metadata/],
    [baseBody([userMsg('say hi')]), { originator: 'codex_cli_rs' }, /originator header/],
    [baseBody([userMsg('say hi')]), { 'chatgpt-account-id': 'x' }, /chatgpt-account-id header/]
  ]
  for (const [body, headers, re] of cases) {
    const res = await responses(t.access_token, body, headers)
    assert.equal(res.status, 400, String(re))
    assert.match((await res.json()).error.message, re)
    const rec = await lastRequest()
    assert.ok(rec.problems.some((p) => re.test(p) || re.test(rec.problems.join('; '))), `${re}: ${rec.problems}`)
  }
  const capability = await (await responses(t.access_token, { ...baseBody([userMsg('say hi')]), max_output_tokens: 5 })).json()
  assert.deepEqual([capability.error.code, capability.error.param], ['subscription_sharing_unsupported_capability', 'max_output_tokens'])
  const noBearer = await responses(null, baseBody([userMsg('say hi')]))
  assert.equal(noBearer.status, 401)
  assert.equal(noBearer.headers.get('access-control-allow-origin'), '*', 'a missing bearer is the readable app-layer 401')
  const forged = await responses('forged', baseBody([userMsg('say hi')]))
  assert.equal(forged.status, 401)
  assert.equal(forged.headers.get('access-control-allow-origin'), null)
  assert.equal((await lastRequest()).checks.bearerKnown, false)
})

test('mock (openai): /__revoke-access makes issued tokens answer 401 (readable, or CORS-less with cors=0); a refresh recovers', async () => {
  const t = await signIn()
  await (await fetch(`${mock.url}/__revoke-access`, { method: 'POST' })).json()
  const refused = await responses(t.access_token, baseBody([userMsg('say hi')]))
  assert.equal(refused.status, 401)
  assert.equal(refused.headers.get('access-control-allow-origin'), '*')
  const r = await (await tokenPost({ grant_type: 'refresh_token', client_id: MOCK_CLIENT_ID, refresh_token: t.refresh_token, resource: 'https://api.openai.com/v1' })).json()
  assert.equal((await responses(r.access_token, baseBody([userMsg('say hi')]))).status, 200)
  await fetch(`${mock.url}/__revoke-access?cors=0`, { method: 'POST' })
  const edge = await responses(r.access_token, baseBody([userMsg('say hi')]))
  assert.equal(edge.status, 401)
  assert.equal(edge.headers.get('access-control-allow-origin'), null)
})

test('mock (openai): overflow is a 400 context_length_exceeded; "overflow mid-stream" a response.failed; unknown prompts a 400', async () => {
  const t = await signIn()
  const o = await responses(t.access_token, baseBody([userMsg('overflow')]))
  assert.equal(o.status, 400)
  assert.equal((await o.json()).error.code, 'context_length_exceeded')
  const m = await responses(t.access_token, baseBody([userMsg('overflow mid-stream')]))
  assert.equal(m.status, 200)
  const ev = parseSse(await m.text())
  assert.deepEqual(ev.map((e) => e.event), ['response.created', 'response.in_progress', 'response.failed'])
  assert.equal(ev[2].data.response.error.code, 'context_length_exceeded')
  const u = await responses(t.access_token, baseBody([userMsg('what is up')]))
  assert.equal(u.status, 400)
  assert.equal((await u.json()).error.code, 'mock_no_scenario')
  // the Anthropic side maps "overflow" to Claude Code's own phrase
  const a = await fetch(`${mock.url}/v1/messages`, { method: 'POST', headers: { 'x-api-key': 'k', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'm', messages: [{ role: 'user', content: 'overflow' }] }) })
  assert.equal(a.status, 400)
  assert.match((await a.json()).error.message, /^prompt is too long: 300000 tokens > 200000 maximum$/)
})

test('mock (openai): "stream slowly" records an abandoned stream', async () => {
  const slow = await startMockApi({ port: 0, eventDelayMs: 0 })
  try {
    const t = await (async () => { const prev = mock; mock = slow; try { return await signIn() } finally { mock = prev } })()
    const ctl = new AbortController()
    const res = await fetch(`${slow.url}/v1/responses`, { method: 'POST', signal: ctl.signal, headers: { authorization: `Bearer ${t.access_token}`, 'content-type': 'application/json' }, body: JSON.stringify(baseBody([userMsg('stream slowly')])) })
    const reader = res.body.getReader()
    await reader.read()
    ctl.abort()
    await new Promise((resolve) => setTimeout(resolve, 300))
    const rec = slow.requests.find((r) => r.scenario === 'slow')
    assert.equal(rec.aborted, true)
    assert.ok(rec.sent < rec.events)
  } finally {
    await slow.close()
  }
})

test('mock (openai): analyzeResponses and checkResponsesRequest are usable on their own', () => {
  const a = analyzeResponses({ input: [userMsg('say hi'), { type: 'function_call', call_id: 'c1', name: 'X', arguments: '{"a":1}' }, { type: 'function_call_output', call_id: 'c1', output: 'Error: nope' }] })
  assert.equal(a.scenario, 'hi')
  assert.equal(a.prompt, 'say hi')
  assert.deepEqual(a.toolUses, [{ type: 'tool_use', id: 'c1', name: 'X', input: { a: 1 } }])
  assert.deepEqual(a.toolResults, [{ type: 'tool_result', tool_use_id: 'c1', content: 'Error: nope', is_error: true }])
  const { checks, problems } = checkResponsesRequest({ authorization: 'Bearer x' }, { model: 'm', input: [], store: false, stream: true })
  assert.deepEqual(problems, [])
  assert.equal(checks.bearer, true)
})
