// Track W (ChatGPT option, Worker side): Responses SSE -> Anthropic SSE
// (report J §7.6), scripted round trips through the real TransformStream.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createResponsesToAnthropicStream, aggregateAnthropicEvents, translateResponsesSse, ResponsesToAnthropic } from '../../src/runtime/boot/openai/stream.js'
import { toResponsesRequest, decodeReasoningSignature } from '../../src/runtime/boot/openai/request.js'
import { createSseParser } from '../../src/runtime/boot/openai/util.js'
import { sse, textScript, reasoningToolScript, failedScript, midFailScript, usage, parseAnthropicSse, pipeChunks, claudeCodeRequest, LONG_MCP, UPSTREAM_MODEL } from './W-fixtures.mjs'

const MODEL = 'claude-sonnet-5-5'
const PROMPT_TOO_LONG = /prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i // Claude Code 2.1.311's own pattern

async function run (events, o = {}, chunking = {}) {
  const ts = createResponsesToAnthropicStream({ model: MODEL, inputTokens: 321, ...o })
  return parseAnthropicSse(await pipeChunks(ts, sse(events, chunking.sse), chunking))
}
const types = (evs) => evs.map((e) => e.type + (e.content_block ? `:${e.content_block.type}` : '') + (e.delta?.type ? `:${e.delta.type}` : ''))

test('stream: text round trip (message_start placeholders, text block, end_turn, usage with cached tokens)', async () => {
  for (const chunking of [{}, { bytes: false, sizes: [1] }, { sizes: [5, 2], sse: { crlf: true, comments: true } }]) {
    const evs = await run(textScript(), {}, chunking)
    assert.deepEqual(types(evs), ['message_start', 'content_block_start:text', 'content_block_delta:text_delta', 'content_block_delta:text_delta', 'content_block_stop', 'message_delta', 'message_stop'])
    const start = evs[0].message
    assert.equal(start.model, MODEL, 'the model Claude Code asked for is echoed')
    assert.equal(start.role, 'assistant')
    assert.match(start.id, /^msg_[0-9a-f]{24}$/)
    assert.deepEqual(start.usage, { input_tokens: 321, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 })
    assert.deepEqual(evs.slice(1, 5).map((e) => e.index), [0, 0, 0, 0])
    assert.deepEqual(evs[5], { type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { input_tokens: 200, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000, output_tokens: 42 } })
    const { message } = aggregateAnthropicEvents(evs)
    assert.deepEqual(message.content, [{ type: 'text', text: 'Hi there!' }])
    assert.equal(message.stop_reason, 'end_turn')
    assert.deepEqual(message.usage, { input_tokens: 200, output_tokens: 42, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000 })
  }
})

test('stream: reasoning -> thinking block with the encrypted-content envelope, then a tool call with streamed arguments', async () => {
  const { idMap } = toResponsesRequest(claudeCodeRequest(), { model: UPSTREAM_MODEL })
  const evs = await run(reasoningToolScript(), { idMap })
  assert.deepEqual(types(evs), [
    'message_start',
    'content_block_start:thinking', 'content_block_delta:thinking_delta', 'content_block_delta:thinking_delta', 'content_block_delta:thinking_delta', 'content_block_delta:thinking_delta', 'content_block_delta:signature_delta', 'content_block_stop',
    'content_block_start:tool_use', 'content_block_delta:input_json_delta', 'content_block_delta:input_json_delta', 'content_block_stop',
    'message_delta', 'message_stop'
  ])
  assert.deepEqual(evs[1].content_block, { type: 'thinking', thinking: '', signature: '' })
  assert.equal(evs.slice(2, 6).map((e) => e.delta.thinking).join(''), 'First thought.\n\nSecond thought.')
  const env = decodeReasoningSignature(evs[6].delta.signature)
  assert.deepEqual(env, { id: 'rs_up1', encrypted_content: 'ENC-UPSTREAM-1', model: UPSTREAM_MODEL })
  assert.deepEqual(evs[8], { type: 'content_block_start', index: 1, content_block: { type: 'tool_use', id: 'call_weather1', name: 'mcp__page__get_weather', input: {} } })
  assert.equal(evs[12].delta.stop_reason, 'tool_use')
  assert.deepEqual(evs[12].usage, { input_tokens: 904, cache_creation_input_tokens: 0, cache_read_input_tokens: 4096, output_tokens: 120 })

  // what Claude Code would store, replayed on the next request: the reasoning item and the call come back intact
  const { message } = aggregateAnthropicEvents(evs)
  assert.deepEqual(message.content[1], { type: 'tool_use', id: 'call_weather1', name: 'mcp__page__get_weather', input: { city: 'Paris' } })
  const next = toResponsesRequest({ model: MODEL, messages: [{ role: 'user', content: 'weather?' }, { role: 'assistant', content: message.content }, { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_weather1', content: 'sunny' }] }] }, { model: UPSTREAM_MODEL }).body
  assert.deepEqual(next.input.slice(1), [
    { type: 'reasoning', id: 'rs_up1', summary: [{ type: 'summary_text', text: 'First thought.\n\nSecond thought.' }], encrypted_content: 'ENC-UPSTREAM-1' },
    { type: 'function_call', call_id: 'call_weather1', name: 'mcp__page__get_weather', arguments: '{"city":"Paris"}' },
    { type: 'function_call_output', call_id: 'call_weather1', output: 'sunny' }
  ])
})

test('stream: a shortened tool name maps back; arguments without deltas arrive whole at output_item.done', async () => {
  const { body, idMap } = toResponsesRequest(claudeCodeRequest(), { model: UPSTREAM_MODEL })
  const short = body.tools.find((t) => idMap.toolNames.get(t.name) === LONG_MCP).name
  const evs = await run(reasoningToolScript({ name: short, args: '{"q":1}', argDeltas: false }), { idMap })
  const start = evs.find((e) => e.content_block?.type === 'tool_use')
  assert.equal(start.content_block.name, LONG_MCP)
  const json = evs.filter((e) => e.delta?.type === 'input_json_delta').map((e) => e.delta.partial_json)
  assert.deepEqual(json, ['{"q":1}'])
  // no arguments at all -> "{}"
  const empty = await run(reasoningToolScript({ args: '', argDeltas: false }))
  assert.deepEqual(empty.filter((e) => e.delta?.type === 'input_json_delta').map((e) => e.delta.partial_json), ['{}'])
})

test('stream: reasoning without a summary still carries its encrypted content; a message without deltas emits its text at done', () => {
  const evs = translateResponsesSse(sse([
    { type: 'response.created', response: { id: 'r' } },
    { type: 'response.output_item.added', output_index: 0, item: { id: 'rs_x', type: 'reasoning', summary: [] } },
    { type: 'response.output_item.done', output_index: 0, item: { id: 'rs_x', type: 'reasoning', summary: [], encrypted_content: 'ENC-X' } },
    { type: 'response.output_item.added', output_index: 1, item: { id: 'msg_x', type: 'message', role: 'assistant', content: [] } },
    { type: 'response.output_item.done', output_index: 1, item: { id: 'msg_x', type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'whole' }] } },
    { type: 'response.output_item.added', output_index: 2, item: { id: 'rs_y', type: 'reasoning', summary: [] } },
    { type: 'response.output_item.done', output_index: 2, item: { id: 'rs_y', type: 'reasoning', summary: [] } },
    { type: 'response.output_item.added', output_index: 3, item: { id: 'ws', type: 'web_search_call' } },
    { type: 'response.output_item.done', output_index: 3, item: { id: 'ws', type: 'web_search_call' } },
    { type: 'response.completed', response: { usage: usage(10, 0, 5) } }
  ]), { model: MODEL, idMap: { model: UPSTREAM_MODEL } })
  assert.deepEqual(types(evs), ['message_start', 'content_block_start:thinking', 'content_block_delta:signature_delta', 'content_block_stop', 'content_block_start:text', 'content_block_delta:text_delta', 'content_block_stop', 'message_delta', 'message_stop'])
  assert.equal(decodeReasoningSignature(evs[2].delta.signature).encrypted_content, 'ENC-X')
  assert.equal(evs[5].delta.text, 'whole')
  assert.equal(evs[4].index, 1)
})

test('stream: incomplete responses map to max_tokens / refusal / end_turn', () => {
  const inc = (reason) => translateResponsesSse(sse([...textScript().slice(0, 5), { type: 'response.incomplete', response: { incomplete_details: { reason }, usage: usage(10, 0, 5) } }]), { model: MODEL })
  assert.equal(inc('max_output_tokens').at(-2).delta.stop_reason, 'max_tokens')
  assert.equal(inc('content_filter').at(-2).delta.stop_reason, 'refusal')
  assert.equal(inc('interrupted').at(-2).delta.stop_reason, 'end_turn')
  const other = inc('max_messages')
  assert.equal(other.at(-1).type, 'error')
  assert.equal(other.at(-2).type, 'content_block_stop', 'the open block is closed first')
})

test('stream: every error class becomes an Anthropic error event', async () => {
  const errOf = async (script, o) => { const evs = await run(script, o); assert.equal(evs.filter((e) => e.type === 'error').length, 1); assert.equal(evs.at(-1).type, 'error'); assert.ok(!evs.some((e) => e.type === 'message_stop')); return evs.at(-1).error }
  const ctx = await errOf(midFailScript({ code: 'context_length_exceeded', message: 'Your input exceeds the context window of this model.' }), { contextWindow: 272000, inputTokens: 300000 })
  assert.equal(ctx.type, 'invalid_request_error')
  const m = PROMPT_TOO_LONG.exec(ctx.message)
  assert.ok(m, ctx.message)
  assert.ok(Number(m[1]) > Number(m[2]))
  assert.equal(Number(m[2]), 272000)
  assert.equal((await errOf(midFailScript({ code: 'rate_limit_exceeded', message: 'Please try again in 11.054s' }))).type, 'rate_limit_error')
  const lim = await errOf(midFailScript({ code: 'subscription_sharing_usage_limit_exceeded', message: 'weekly cap' }))
  assert.equal(lim.type, 'rate_limit_error')
  assert.match(lim.message, /usage limit/)
  assert.equal((await errOf(midFailScript({ code: 'server_is_overloaded', message: 'busy' }))).type, 'overloaded_error')
  assert.equal((await errOf(midFailScript({ code: 'insufficient_quota', message: 'no' }))).type, 'permission_error')
  assert.equal((await errOf(midFailScript({ code: 'cyber_policy', message: 'no' }))).type, 'invalid_request_error')
  assert.equal((await errOf(midFailScript({ code: 'server_error', message: 'oops' }))).type, 'api_error')
  assert.equal((await errOf(midFailScript({ code: 'rate_limit_exceeded', message: 'slow down' }, { asErrorEvent: true }))).type, 'rate_limit_error')
  assert.equal((await errOf(failedScript({ code: 'context_length_exceeded', message: 'too long' }))).type, 'invalid_request_error')
  // EOF without a terminal event
  const eof = await errOf(textScript().slice(0, 4))
  assert.equal(eof.type, 'overloaded_error')
  assert.match(eof.message, /closed before response\.completed/)
})

test('stream: events for another output item are held until the open item is done', () => {
  const evs = translateResponsesSse(sse([
    { type: 'response.output_item.added', output_index: 0, item: { id: 'm0', type: 'message', content: [] } },
    { type: 'response.output_text.delta', output_index: 0, delta: 'a' },
    { type: 'response.output_item.added', output_index: 1, item: { id: 'f1', type: 'function_call', call_id: 'call_1', name: 'Read', arguments: '' } },
    { type: 'response.function_call_arguments.delta', output_index: 1, delta: '{"x":' },
    { type: 'response.output_text.delta', output_index: 0, delta: 'b' },
    { type: 'response.output_item.done', output_index: 0, item: { id: 'm0', type: 'message', content: [{ type: 'output_text', text: 'ab' }] } },
    { type: 'response.function_call_arguments.delta', output_index: 1, delta: '1}' },
    { type: 'response.output_item.done', output_index: 1, item: { id: 'f1', type: 'function_call', call_id: 'call_1', name: 'Read', arguments: '{"x":1}' } },
    { type: 'response.completed', response: { usage: usage(1, 0, 1) } }
  ]), { model: MODEL })
  assert.deepEqual(types(evs), ['message_start', 'content_block_start:text', 'content_block_delta:text_delta', 'content_block_delta:text_delta', 'content_block_stop', 'content_block_start:tool_use', 'content_block_delta:input_json_delta', 'content_block_delta:input_json_delta', 'content_block_stop', 'message_delta', 'message_stop'])
  const { message } = aggregateAnthropicEvents(evs)
  assert.deepEqual(message.content, [{ type: 'text', text: 'ab' }, { type: 'tool_use', id: 'call_1', name: 'Read', input: { x: 1 } }])
  assert.equal(message.stop_reason, 'tool_use')
})

test('stream: pings during upstream silence, none after the end', async () => {
  const ts = createResponsesToAnthropicStream({ model: MODEL, pingMs: 60 })
  const writer = ts.writable.getWriter()
  const reader = ts.readable.getReader()
  const got = []
  const pump = (async () => { for (;;) { const { value, done } = await reader.read(); if (done) break; got.push(...parseAnthropicSse(value)) } })()
  await writer.write(sse(textScript().slice(0, 3)))
  await new Promise((resolve) => setTimeout(resolve, 200))
  await writer.write(sse(textScript().slice(3)))
  await writer.close()
  await pump
  assert.ok(got.filter((e) => e.type === 'ping').length >= 1, 'at least one ping')
  assert.equal(got.at(-1).type, 'message_stop')
  assert.deepEqual(got[0].type, 'message_start')
})

test('stream: the SSE parser handles split lines, CRLF, comments and multi-line data', () => {
  const p = createSseParser()
  const evs = [...p.push('event: a\r'), ...p.push('\ndata: {"x"'), ...p.push(':1}\r\n\r\n: c\n'), ...p.push('data: l1\ndata: l2\n\ndata: tail'), ...p.end()]
  assert.deepEqual(evs, [{ event: 'a', data: '{"x":1}' }, { event: null, data: 'l1\nl2' }, { event: null, data: 'tail' }])
})

test('stream: the translator ignores everything after the terminal event and tolerates junk', () => {
  const tr = new ResponsesToAnthropic({ model: MODEL })
  assert.equal(tr.handle(null).length, 0)
  const out = [...tr.handle({ type: 'response.completed', response: {} }), ...tr.handle({ type: 'response.output_text.delta', delta: 'late' }), ...tr.end()]
  assert.deepEqual(types(out), ['message_start', 'message_delta', 'message_stop'])
  assert.deepEqual(out[1].usage, { input_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0 })
  const junk = translateResponsesSse('data: not json\n\ndata: [DONE]\n\n' + sse(textScript()), { model: MODEL })
  assert.equal(junk.at(-1).type, 'message_stop')
})
