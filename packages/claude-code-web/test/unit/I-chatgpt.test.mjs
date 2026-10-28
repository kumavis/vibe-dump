// Integration tests for the ChatGPT subscription option (ARCHITECTURE.md
// Appendix A): the Worker's translator (track W) against the mock's stricter
// /v1/responses validation (what OpenAI rejects with a 400, beyond the Sign
// in with ChatGPT field list), multi-turn round trips through the stream
// translator, and the page/Worker constants having one source.
// Synthetic fixtures only (nothing copied from the captured bodies).

import test from 'node:test'
import assert from 'node:assert/strict'

import { toResponsesRequest, encodeReasoningSignature } from '../../src/runtime/boot/openai/request.js'
import { translateResponsesSse, aggregateAnthropicEvents } from '../../src/runtime/boot/openai/stream.js'
import * as policy from '../../src/runtime/boot/policy.js'
import * as hostConstants from '../../src/host/constants.js'
import * as invocation from '../../src/host/invocation.js'
import { checkResponsesRequest, inputStructureProblems } from '../../mock/mock-api.mjs'
import { claudeCodeRequest, sse, reasoningToolScript, textScript, usage, UPSTREAM_MODEL } from './W-fixtures.mjs'

const MODEL = 'claude-sonnet-5-5'
const AUTH = { authorization: 'Bearer test' }
const translate = (req) => toResponsesRequest(req, { model: UPSTREAM_MODEL, sessionId: 'sess-1' })
const problemsOf = (body) => checkResponsesRequest(AUTH, body).problems
const sig = (id, enc = `ENC-${id}`) => encodeReasoningSignature({ id, encrypted_content: enc, model: UPSTREAM_MODEL })

test('integration: the page and the Worker share one copy of the adapter constants', () => {
  assert.equal(hostConstants.OPENAI_ADAPTER_ORIGIN, policy.OPENAI_ADAPTER_ORIGIN)
  assert.equal(hostConstants.OPENAI_ADAPTER_KEY, policy.OPENAI_ADAPTER_KEY)
  assert.equal(invocation.AUTO_COMPACT_WINDOW_RANGE, policy.AUTO_COMPACT_WINDOW_RANGE)
  const env = invocation.buildEnv({ authMode: 'chatgpt', contextWindow: 272000 })
  const worker = policy.applyProviderEnv(policy.workerEnv(env), policy.providerConfig({ kind: 'openai-responses', baseUrl: 'https://api.openai.com/v1', model: 'gpt-5.5', effort: '', contextWindow: 272000 }))
  assert.deepEqual(worker, env, 'the Worker leaves the page-built ChatGPT env as it is')
})

test('mock: the input-structure rules refuse what /v1/responses would', () => {
  const user = { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'hi' }] }
  const call = { type: 'function_call', call_id: 'call_1', name: 'Write', arguments: '{}' }
  const out = { type: 'function_call_output', call_id: 'call_1', output: 'ok' }
  const rs = { type: 'reasoning', id: 'rs_1', summary: [], encrypted_content: 'E' }
  const asst = { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'done' }] }
  assert.deepEqual(inputStructureProblems([user, rs, call, out, rs, asst]), [])
  assert.deepEqual(inputStructureProblems([user, rs, rs, call, out]), [], 'consecutive reasoning items are fine')
  const cases = [
    [[user, out], /no tool call found for function call output with call_id call_1/],
    [[user, call], /no tool output found for function call call_1/],
    [[user, call, out, out], /a second output for call_1/],
    [[user, call, { ...call }, out], /duplicate function_call call_1/],
    [[user, rs], /reasoning' was provided without its required following item/],
    [[user, rs, user], /reasoning' was provided without its required following item/],
    [[user, rs, { ...call, name: 'bad name' }, out], /function name "bad name"/],
    [[user, { ...call, arguments: {} }, out], /arguments must be a string/],
    [[{ ...asst, content: [{ type: 'input_text', text: 'x' }] }], /content type "input_text" in a assistant message/],
    [[{ type: 'message', role: 'developer', content: [{ type: 'output_text', text: 'x' }] }], /content type "output_text" in a developer message/],
    [[{ type: 'message', role: 'system', content: 'x' }], /message role "system" is not accepted/],
    [[{ type: 'web_search_call', id: 'ws_1' }], /item type "web_search_call"/]
  ]
  for (const [input, re] of cases) assert.match(inputStructureProblems(input).join('\n'), re, JSON.stringify(input))
  assert.match(inputStructureProblems([user], [{ type: 'function', name: 'x'.repeat(65), parameters: { type: 'object' } }]).join(), /does not match/)
  assert.match(inputStructureProblems([user], [{ type: 'web_search', name: 'web_search' }]).join(), /only function tools/)
  // and the mock turns them into a 400 problem list
  assert.match(problemsOf({ model: 'gpt-5.5', input: [user, out], store: false, stream: true }).join(), /no tool call found/)
})

test('integration: the translator passes the strict mock for every history shape Claude Code produces', () => {
  const base = claudeCodeRequest()
  const histories = {
    'the J §7.1 shape (system items, Anthropic-signed thinking, deferred and server tools)': base.messages,
    'an interrupted tool call, then a new prompt': [
      { role: 'user', content: 'write it' },
      { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: sig('rs_a') }, { type: 'tool_use', id: 'toolu_a', name: 'Write', input: { file_path: '/x', content: '' } }] },
      { role: 'user', content: [{ type: 'text', text: '[Request interrupted by user for tool use]' }, { type: 'text', text: 'say hi' }] }
    ],
    'a thinking-only assistant turn (interrupted after the reasoning)': [
      { role: 'user', content: 'stream slowly' },
      { role: 'assistant', content: [{ type: 'thinking', thinking: 'half', signature: sig('rs_b') }] },
      { role: 'user', content: [{ type: 'text', text: '[Request interrupted by user]' }, { type: 'text', text: 'say hi' }] }
    ],
    'parallel tool calls answered in one user message, one failing, one with an image': [
      { role: 'user', content: 'read both' },
      {
        role: 'assistant',
        content: [
          { type: 'thinking', thinking: '', signature: sig('rs_c') },
          { type: 'tool_use', id: 'call_r1', name: 'Read', input: { file_path: '/a' } },
          { type: 'tool_use', id: 'call_r2', name: 'Read', input: { file_path: '/b.png' } }
        ]
      },
      {
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: 'call_r1', is_error: true, content: 'ENOENT' },
          { type: 'tool_result', tool_use_id: 'call_r2', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: 'iVBORw0KGgo=' } }] },
          { type: 'text', text: 'and summarise' }
        ]
      }
    ],
    'a system item between the call and its result': [
      { role: 'user', content: 'weather' },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'call_w', name: 'mcp__page__get_weather', input: { city: 'Oslo' } }] },
      { role: 'system', content: 'A reminder that arrived mid-turn.' },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_w', content: 'rain' }] }
    ],
    'an orphan tool_result (its call was compacted away)': [
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_gone', content: 'old output' }, { type: 'text', text: 'continue' }] }
    ],
    'reasoning from another upstream model after a model switch': [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: encodeReasoningSignature({ id: 'rs_o', encrypted_content: 'E', model: 'gpt-6.1-sol' }) }, { type: 'text', text: 'hello' }] },
      { role: 'user', content: 'again' }
    ],
    'a text-free tool turn followed by assistant text only (end_turn)': [
      { role: 'user', content: 'go' },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'call_g', name: 'Glob', input: { pattern: '*' } }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_g', content: [{ type: 'text', text: 'a.txt' }] }] },
      { role: 'assistant', content: [{ type: 'thinking', thinking: '', signature: sig('rs_d') }, { type: 'text', text: 'Found a.txt.' }] },
      { role: 'user', content: 'thanks' }
    ]
  }
  for (const [name, messages] of Object.entries(histories)) {
    const { body } = translate({ ...base, messages })
    assert.deepEqual(problemsOf(body), [], name)
    assert.equal(body.input.filter((i) => i.type === 'message' && i.role === 'system').length, 0, name)
  }
})

test('integration: three model turns streamed, stored as Claude Code stores them, and replayed stay valid', () => {
  const base = claudeCodeRequest()
  const messages = [{ role: 'user', content: 'weather in Paris, then write it down' }]
  const turn = (events) => {
    const { body, idMap } = translate({ ...base, messages })
    assert.deepEqual(problemsOf(body), [])
    const anthropic = translateResponsesSse(sse(events), { model: MODEL, idMap, inputTokens: 100 })
    const { message, error } = aggregateAnthropicEvents(anthropic)
    assert.equal(error, undefined)
    // Anthropic block discipline: indices 0..n-1, each started once and stopped before the next starts
    let open = -1
    let next = 0
    for (const e of anthropic) {
      if (e.type === 'content_block_start') { assert.equal(open, -1); assert.equal(e.index, next++); open = e.index }
      if (e.type === 'content_block_delta') assert.equal(e.index, open)
      if (e.type === 'content_block_stop') { assert.equal(e.index, open); open = -1 }
    }
    assert.equal(open, -1)
    messages.push({ role: 'assistant', content: message.content })
    return { message, body }
  }

  // 1: reasoning + a weather call
  const t1 = turn(reasoningToolScript())
  assert.equal(t1.message.stop_reason, 'tool_use')
  messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_weather1', content: 'Sunny' }] })

  // 2: two parallel calls in one response (Write twice), each with reasoning in between
  const fc = (i, callId, args) => ({ id: `fc_p${i}`, type: 'function_call', status: 'completed', call_id: callId, name: 'Write', arguments: args })
  const created = { type: 'response.created', response: { id: 'resp_2', status: 'in_progress', output: [] } }
  const t2events = [
    created,
    { type: 'response.output_item.added', output_index: 0, item: { id: 'rs_p0', type: 'reasoning', summary: [] } },
    { type: 'response.output_item.done', output_index: 0, item: { id: 'rs_p0', type: 'reasoning', summary: [], encrypted_content: 'ENC-P0' } },
    { type: 'response.output_item.added', output_index: 1, item: { ...fc(1, 'call_p1', ''), status: 'in_progress' } },
    { type: 'response.function_call_arguments.delta', output_index: 1, item_id: 'fc_p1', delta: '{"file_path":"/home/user/workspace/a.txt",', obfuscation: 'xx' },
    { type: 'response.function_call_arguments.delta', output_index: 1, item_id: 'fc_p1', delta: '"content":"Sunny"}' },
    { type: 'response.function_call_arguments.done', output_index: 1, item_id: 'fc_p1', arguments: '{"file_path":"/home/user/workspace/a.txt","content":"Sunny"}' },
    { type: 'response.output_item.done', output_index: 1, item: fc(1, 'call_p1', '{"file_path":"/home/user/workspace/a.txt","content":"Sunny"}') },
    { type: 'response.output_item.added', output_index: 2, item: { ...fc(2, 'call_p2', ''), status: 'in_progress' } },
    { type: 'response.output_item.done', output_index: 2, item: fc(2, 'call_p2', '{"file_path":"/home/user/workspace/b.txt","content":"Paris"}') },
    { type: 'response.completed', response: { id: 'resp_2', status: 'completed', usage: usage(3000, 2048, 80, 20), output: [] } }
  ]
  const t2 = turn(t2events)
  assert.deepEqual(t2.message.content.map((b) => b.type), ['thinking', 'tool_use', 'tool_use'])
  assert.deepEqual(t2.message.content.slice(1).map((b) => [b.id, b.input.file_path]), [['call_p1', '/home/user/workspace/a.txt'], ['call_p2', '/home/user/workspace/b.txt']])
  messages.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_p1', content: 'File created' }, { type: 'tool_result', tool_use_id: 'call_p2', content: 'File created' }] })
  messages.push({ role: 'system', content: [{ type: 'text', text: '<total_tokens>5 left</total_tokens>' }] })

  // 3: text only
  const t3 = turn(textScript({ text: ['Done', '.'] }))
  assert.equal(t3.message.stop_reason, 'end_turn')
  messages.push({ role: 'user', content: 'thanks' })

  // the fourth request replays all three reasoning items, the three calls and their outputs, in order
  const { body } = translate({ ...base, messages })
  assert.deepEqual(problemsOf(body), [])
  const kinds = body.input.slice(1).map((i) => i.type === 'message' ? `${i.role}` : i.type === 'reasoning' ? `reasoning:${i.id}` : `${i.type}:${i.call_id}`)
  assert.deepEqual(kinds, [
    'user',
    'reasoning:rs_up1', 'function_call:call_weather1', 'function_call_output:call_weather1',
    'reasoning:rs_p0', 'function_call:call_p1', 'function_call:call_p2', 'function_call_output:call_p1', 'function_call_output:call_p2',
    'developer',
    'assistant',
    'user'
  ])
  assert.equal(body.input.find((i) => i.id === 'rs_p0').encrypted_content, 'ENC-P0')
})

test('integration: the reasoning effort is clamped to the model\'s supported levels when the page knows them', async () => {
  const { clampEffort } = await import('../../src/runtime/boot/openai/request.js')
  const gpt55 = ['low', 'medium', 'high', 'xhigh']
  assert.equal(clampEffort('medium', gpt55), 'medium')
  assert.equal(clampEffort('max', gpt55), 'xhigh')
  assert.equal(clampEffort('minimal', gpt55), 'low')
  assert.equal(clampEffort('none', ['minimal', 'low']), 'minimal')
  assert.equal(clampEffort('max', undefined), 'max')
  assert.equal(clampEffort('high', ['ultra']), 'high', 'levels this translator does not rank leave the effort alone')
  const req = claudeCodeRequest({ output_config: { effort: 'max' } })
  assert.equal(toResponsesRequest(req, { model: 'gpt-5.5', efforts: gpt55 }).body.reasoning.effort, 'xhigh')
  assert.equal(toResponsesRequest(req, { model: 'gpt-5.5' }).body.reasoning.effort, 'max', 'no list: passed through')
  assert.equal(toResponsesRequest({ ...req, model: 'claude-haiku-4-5' }, { model: 'gpt-5.5', smallModel: 'gpt-mini', efforts: gpt55 }).body.reasoning.effort, 'max', 'the list belongs to the main model only')
  // page -> boot message -> Worker
  const page = invocation.providerConfig({ authMode: 'chatgpt', chatgpt: { model: 'gpt-5.5' } }, { contextWindow: 272000, efforts: gpt55 })
  assert.deepEqual(page.efforts, gpt55)
  assert.deepEqual(policy.providerConfig(page).efforts, gpt55)
  assert.equal('efforts' in invocation.providerConfig({ authMode: 'chatgpt', chatgpt: {} }, {}), false)
  assert.equal('efforts' in policy.providerConfig({ kind: 'openai-responses', efforts: [1, null] }), false)
})

test('integration: the Worker adapter against the mock\'s failure scenarios (usage limit, rate limit, mid-stream failure and resume, overflow and compaction)', async () => {
  const { startMockApi, MID_FAIL_PARTIAL, COMPACT_MARKER } = await import('../../mock/mock-api.mjs')
  const { installOpenAIAdapter } = await import('../../src/runtime/boot/openai-adapter.js')
  const { parseAnthropicSse } = await import('./W-fixtures.mjs')
  const mock = await startMockApi({ port: 0, eventDelayMs: 0, anyBearer: true, logFile: null })
  try {
    const scope = { fetch: globalThis.fetch.bind(globalThis) }
    installOpenAIAdapter(scope, {
      provider: policy.providerConfig({ kind: 'openai-responses', baseUrl: `${mock.url}/v1`, model: 'gpt-5.5', contextWindow: 272000 }),
      getToken: async () => ({ accessToken: 'test-token', expiresAt: Date.now() + 3_600_000 })
    })
    const send = (messages) => scope.fetch(`${policy.OPENAI_ADAPTER_ORIGIN}/v1/messages?beta=true`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': policy.OPENAI_ADAPTER_KEY },
      body: JSON.stringify({ ...claudeCodeRequest(), messages })
    })
    const user = (text) => ({ role: 'user', content: [{ type: 'text', text }] })
    const textOf = async (r) => parseAnthropicSse(await r.text()).filter((e) => e.delta?.type === 'text_delta').map((e) => e.delta.text).join('')

    // the plan's usage limit: 429, not to be retried
    let res = await send([user('hit the usage limit')])
    assert.equal(res.status, 429)
    assert.equal(res.headers.get('x-should-retry'), 'false')
    assert.match((await res.json()).error.message, /usage limit reached on the plus plan; it resets at/)

    // a short rate limit before any output: 429 with retry-after, retryable; the retry is answered
    res = await send([user('hit the rate limit')])
    assert.equal(res.status, 429)
    assert.equal(res.headers.get('retry-after'), '2')
    assert.equal(res.headers.get('x-should-retry'), 'true')
    await res.text()
    res = await send([user('hit the rate limit')])
    assert.equal(res.status, 200)
    assert.equal(await textOf(res), 'answered after a rate limit')

    // a failure after output: 200 SSE, text deltas, then an Anthropic error event (no message_stop)
    res = await send([user('fail mid-stream')])
    assert.equal(res.status, 200)
    const evs = parseAnthropicSse(await res.text())
    assert.equal(evs.filter((e) => e.delta?.type === 'text_delta').map((e) => e.delta.text).join(''), MID_FAIL_PARTIAL.join(''))
    assert.deepEqual(evs.at(-1), { type: 'error', error: { type: 'overloaded_error', message: evs.at(-1).error.message } })
    assert.equal(evs.some((e) => e.type === 'message_stop'), false)
    // Claude Code's resume request (the partial text kept, then a new user message) is answered
    res = await send([user('fail mid-stream'), { role: 'assistant', content: [{ type: 'text', text: MID_FAIL_PARTIAL.join('') }] }, user('Please continue.')])
    assert.equal(res.status, 200)
    assert.equal(await textOf(res), 'answered after a mid-stream failure')

    // a context overflow: Claude Code's own "prompt is too long" wording, so it compacts
    res = await send([user('overflow')])
    assert.equal(res.status, 400)
    const over = await res.json()
    assert.equal(over.error.type, 'invalid_request_error')
    assert.match(over.error.message, /prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i)
    // the compaction request is answered with a marked summary; after it, the same prompt is answered
    res = await send([user('overflow'), user('Write a summary of the conversation so far.')])
    assert.match(await textOf(res), new RegExp(COMPACT_MARKER))
    res = await send([user(`<summary>${COMPACT_MARKER}</summary>`), user('overflow')])
    assert.equal(await textOf(res), 'answered after compaction')

    // every one of those requests passed the strict shape and structure checks
    const posts = mock.requests.filter((r) => r.path?.startsWith('/v1/responses') && r.method === 'POST')
    assert.equal(posts.length, 8)
    for (const r of posts) assert.deepEqual(r.problems, [], `#${r.i} ${r.scenario}`)
  } finally {
    await mock.close()
  }
})
