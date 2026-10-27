// Track D: the mock /v1/messages server used by the acceptance test.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { startMockApi, analyze } from '../../mock/mock-api.mjs'

let mock
let logFile
const auth = { authorization: 'Bearer sk-ant-oat01-test', 'anthropic-beta': 'oauth-2025-04-20', 'anthropic-dangerous-direct-browser-access': 'true', 'content-type': 'application/json' }

before(async () => {
  logFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cc-mock-')), 'requests.jsonl')
  mock = await startMockApi({ port: 0, logFile, eventDelayMs: 0 })
})
after(async () => { await mock.close() })

/** Parse an SSE body into [{event, data}] and rebuild the content blocks. */
function parseSse (text) {
  const events = text.trim().split('\n\n').map((chunk) => {
    const lines = chunk.split('\n')
    return { event: lines[0].slice('event: '.length), data: JSON.parse(lines[1].slice('data: '.length)) }
  })
  const blocks = []
  for (const { data } of events) {
    if (data.type === 'content_block_start') blocks[data.index] = { ...data.content_block, _json: '' }
    if (data.type === 'content_block_delta') {
      if (data.delta.type === 'text_delta') blocks[data.index].text += data.delta.text
      else blocks[data.index]._json += data.delta.partial_json
    }
  }
  for (const b of blocks) { if (b.type === 'tool_use') b.input = JSON.parse(b._json); delete b._json }
  const stop = events.find((e) => e.data.type === 'message_delta')?.data.delta.stop_reason
  return { events, blocks, stop }
}

const post = (body, headers = auth) => fetch(`${mock.url}/v1/messages?beta=true`, { method: 'POST', headers, body: JSON.stringify(body) })

test('mock: preflight requires the browser-access header for /v1/*, any origin', async () => {
  const ok = await fetch(`${mock.url}/v1/messages?beta=true`, { method: 'OPTIONS', headers: { origin: 'https://kumavis.github.io', 'access-control-request-method': 'POST', 'access-control-request-headers': 'authorization,anthropic-dangerous-direct-browser-access,x-app' } })
  assert.equal(ok.status, 204)
  assert.equal(ok.headers.get('access-control-allow-origin'), '*')
  assert.equal(ok.headers.get('access-control-allow-headers'), 'authorization,anthropic-dangerous-direct-browser-access,x-app')
  assert.match(ok.headers.get('access-control-allow-methods'), /POST/)
  const bad = await fetch(`${mock.url}/v1/messages`, { method: 'OPTIONS', headers: { origin: 'http://x', 'access-control-request-method': 'POST', 'access-control-request-headers': 'authorization' } })
  assert.equal(bad.status, 400)
  assert.equal(bad.headers.get('access-control-allow-origin'), null)
})

test('mock: "say hi" streams a text reply with CORS headers', async () => {
  mock.reset()
  const res = await post({ model: 'claude-x', stream: true, max_tokens: 10, messages: [{ role: 'user', content: [{ type: 'text', text: '<system-reminder>ctx</system-reminder>' }, { type: 'text', text: 'say hi' }] }] })
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('content-type'), 'text/event-stream; charset=utf-8')
  assert.equal(res.headers.get('access-control-allow-origin'), '*')
  const { events, blocks, stop } = parseSse(await res.text())
  assert.equal(events[0].event, 'message_start')
  assert.equal(events[0].data.message.model, 'claude-x')
  assert.equal(events.at(-1).event, 'message_stop')
  assert.deepEqual(blocks, [{ type: 'text', text: 'hi from the mock API' }])
  assert.equal(stop, 'end_turn')
  assert.equal(mock.requests.length, 1)
  const rec = mock.requests[0]
  assert.equal(rec.scenario, 'hi')
  assert.equal(rec.headers['anthropic-beta'], 'oauth-2025-04-20')
  assert.equal(rec.headers['anthropic-dangerous-direct-browser-access'], 'true')
  assert.match(rec.headers.authorization, /^Bearer sk-ant-oat01-…\(len 24\)$/, "the token is redacted in the log")
})

test('mock: weather scenario is a tool_use, then an echo of the matching tool_result', async () => {
  const tools = [{ name: 'Read' }, { name: 'mcp__page__get_weather' }]
  const first = [{ role: 'user', content: 'please use the weather tool' }]
  const r1 = parseSse(await (await post({ model: 'm', stream: true, tools, messages: first })).text())
  assert.equal(r1.stop, 'tool_use')
  assert.equal(r1.blocks[0].type, 'tool_use')
  assert.equal(r1.blocks[0].name, 'mcp__page__get_weather')
  assert.deepEqual(r1.blocks[0].input, { city: 'Paris' })
  const id = r1.blocks[0].id
  const follow = [...first,
    { role: 'assistant', content: [{ type: 'tool_use', id, name: 'mcp__page__get_weather', input: { city: 'Paris' } }] },
    { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: [{ type: 'text', text: 'Sunny in Paris, 21°C' }] }] }]
  const r2 = parseSse(await (await post({ model: 'm', stream: true, tools, messages: follow })).text())
  assert.deepEqual(r2.blocks, [{ type: 'text', text: 'The weather tool said: Sunny in Paris, 21°C' }])
  // a tool_result for some other id is a 400
  const wrong = [...follow.slice(0, 2), { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'other', content: 'x' }] }]
  const r3 = await post({ model: 'm', stream: true, tools, messages: wrong })
  assert.equal(r3.status, 400)
  assert.equal((await r3.json()).error.type, 'invalid_request_error')
})

test('mock: write scenario uses Write on the workspace, then echoes', async () => {
  const first = [{ role: 'user', content: 'write a file' }]
  const r1 = parseSse(await (await post({ model: 'm', stream: true, tools: [{ name: 'Write' }], messages: first })).text())
  assert.equal(r1.blocks[0].name, 'Write')
  assert.equal(r1.blocks[0].input.file_path, '/home/user/workspace/hello.txt')
  const id = r1.blocks[0].id
  const r2 = parseSse(await (await post({ model: 'm', stream: true, messages: [...first, { role: 'assistant', content: [r1.blocks[0]] }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: 'File created successfully' }] }] })).text())
  assert.match(r2.blocks[0].text, /File created successfully/)
})

test('mock: non-streaming requests get a JSON message', async () => {
  const res = await post({ model: 'm', stream: false, messages: [{ role: 'user', content: 'say hi' }] })
  const j = await res.json()
  assert.equal(j.type, 'message')
  assert.deepEqual(j.content, [{ type: 'text', text: 'hi from the mock API' }])
})

test('mock: unknown prompts and missing credentials are 401 with CORS', async () => {
  const r = await post({ model: 'm', stream: true, messages: [{ role: 'user', content: 'hello there' }] })
  assert.equal(r.status, 401)
  assert.equal(r.headers.get('access-control-allow-origin'), '*')
  assert.equal((await r.json()).error.type, 'authentication_error')
  const r2 = await post({ model: 'm', messages: [{ role: 'user', content: 'say hi' }] }, { 'content-type': 'application/json' })
  assert.equal(r2.status, 401)
})

test('mock: count_tokens, 404s, /__requests, /__reset and the JSONL log', async () => {
  const c = await fetch(`${mock.url}/v1/messages/count_tokens`, { method: 'POST', headers: auth, body: '{"messages":[]}' })
  assert.equal(c.status, 200)
  assert.ok((await c.json()).input_tokens >= 1)
  assert.equal((await fetch(`${mock.url}/api/hello`)).status, 404)
  const listed = await (await fetch(`${mock.url}/__requests`)).json()
  assert.ok(listed.length > 0)
  assert.equal(listed.at(-1).path, '/api/hello')
  const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  assert.ok(lines.length >= listed.length)
  assert.ok(lines.every((l) => typeof l.i === 'number' && l.method && l.path))
  await fetch(`${mock.url}/__reset`, { method: 'POST' })
  assert.deepEqual(await (await fetch(`${mock.url}/__requests`)).json(), [])
})

test('mock: analyze() finds the latest real prompt behind tool results and reminders', () => {
  const a = analyze({
    messages: [
      { role: 'user', content: 'say hi' },
      { role: 'assistant', content: [{ type: 'text', text: 'hi' }] },
      { role: 'user', content: [{ type: 'text', text: 'write a file' }] },
      { role: 'assistant', content: [{ type: 'tool_use', id: 't1', name: 'Write', input: {} }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }, { type: 'text', text: '<system-reminder>x</system-reminder>' }] }
    ]
  })
  assert.equal(a.scenario, 'write')
  assert.equal(a.phase, 'follow-up')
  assert.equal(a.toolUses[0].id, 't1')
})
