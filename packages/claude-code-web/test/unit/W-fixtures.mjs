// Synthetic fixtures for the track W (ChatGPT option, Worker side) tests.
// Shaped like what Claude Code 2.1.311 sends (report J §7.1: key order,
// system blocks with the billing line and 1h cache_control, role:"system"
// items inside `messages`, adaptive thinking, output_config.effort,
// context_management, metadata.user_id as a JSON string, a
// DeferredToolPlaceholder with defer_loading) but written by hand: no text
// from Anthropic's prompts. Not a test file (no .test.mjs suffix).

import { encodeReasoningSignature } from '../../src/runtime/boot/openai/request.js'

export const SESSION_ID = '0b9e2f6c-63c4-43cf-9ac2-5d1e0f7a8b90'
export const LONG_MCP = 'mcp__a_rather_long_server_name_for_tests__and_an_even_longer_tool_name_here'
export const UPSTREAM_MODEL = 'gpt-5.5'

const cc1h = { type: 'ephemeral', ttl: '1h' }

export const REASONING_SIG = encodeReasoningSignature({ id: 'rs_prev1', encrypted_content: 'ENC-PREVIOUS-REASONING', model: UPSTREAM_MODEL })

/** A two-round-trip "write a file" request, as the harness sends it on the second turn. */
export function claudeCodeRequest (overrides = {}) {
  return {
    model: 'claude-sonnet-5-5',
    messages: [
      { role: 'user', content: [{ type: 'text', text: '<system-reminder>\nSynthetic reminder text.\n</system-reminder>' }, { type: 'text', text: 'write a file' }] },
      { role: 'system', content: '# Environment\nSynthetic environment block.' },
      {
        role: 'assistant',
        content: [
          { type: 'thinking', thinking: 'Planning the write.', signature: REASONING_SIG },
          { type: 'thinking', thinking: 'An Anthropic-signed block.', signature: 'EqQBCkgIBxABGAIiQAnthropicSignatureNotOurs' },
          { type: 'text', text: 'I will write the file.' },
          { type: 'tool_use', id: 'toolu_01SyntheticWrite', name: 'Write', input: { file_path: '/home/user/workspace/hello.txt', content: 'hello\n' } }
        ]
      },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_01SyntheticWrite', content: 'File created successfully at: /home/user/workspace/hello.txt' }] },
      { role: 'system', content: [{ type: 'text', text: '<total_tokens>999 tokens left</total_tokens>', cache_control: cc1h }] }
    ],
    system: [
      { type: 'text', text: 'x-anthropic-billing-header: cc_version=0.0.0.test; cc_entrypoint=sdk-cli;' },
      { type: 'text', text: 'You are a synthetic agent for tests.', cache_control: cc1h },
      { type: 'text', text: '\nSynthetic instructions, several lines long.\nSecond line.', cache_control: cc1h }
    ],
    tools: [
      {
        name: 'Write',
        description: 'Writes a file.',
        input_schema: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'object', properties: { file_path: { type: 'string', description: 'Absolute path' }, content: { type: 'string' } }, required: ['file_path', 'content'], additionalProperties: false }
      },
      {
        name: 'Grep',
        description: 'Searches files.',
        input_schema: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'object', properties: { pattern: { type: 'string' }, '-n': { type: 'boolean' }, output_mode: { type: 'string', enum: ['content', 'files_with_matches', 'count'] }, head_limit: { type: 'number', minimum: 0, exclusiveMinimum: -1 }, label: { type: 'string', pattern: '^\\p{L}+$', maxLength: 20 } }, required: ['pattern'], additionalProperties: false }
      },
      { name: 'mcp__page__get_weather', description: 'Weather for a city.', input_schema: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] } },
      { name: LONG_MCP, description: 'A tool with a name over 64 characters.', input_schema: { type: 'object' } },
      { name: 'DeferredToolPlaceholder', description: 'Reserved placeholder; never call this tool.', input_schema: { type: 'object', properties: {} }, defer_loading: true },
      { type: 'web_search_20250305', name: 'web_search', max_uses: 3 }
    ],
    metadata: { user_id: JSON.stringify({ device_id: 'f'.repeat(64), account_uuid: '', session_id: SESSION_ID }) },
    max_tokens: 128000,
    thinking: { type: 'adaptive', display: 'omitted' },
    context_management: { edits: [{ type: 'clear_thinking_20251015', keep: 'all' }] },
    output_config: { effort: 'medium' },
    stream: true,
    ...overrides
  }
}

/** Responses SSE text from event objects (each carries its own `type`). */
export function sse (events, { crlf = false, comments = false } = {}) {
  const nl = crlf ? '\r\n' : '\n'
  return events.map((e, i) => `${comments && i === 0 ? `: keepalive${nl}` : ''}event: ${e.type}${nl}data: ${JSON.stringify(e)}${nl}${nl}`).join('')
}

const created = (id = 'resp_1') => [
  { type: 'response.created', sequence_number: 0, response: { id, object: 'response', status: 'in_progress', model: UPSTREAM_MODEL, output: [] } },
  { type: 'response.in_progress', sequence_number: 1, response: { id, status: 'in_progress' } }
]
export const usage = (input = 1200, cached = 1000, output = 42, reasoning = 10) => ({ input_tokens: input, input_tokens_details: { cached_tokens: cached }, output_tokens: output, output_tokens_details: { reasoning_tokens: reasoning }, total_tokens: input + output })
const completed = (u = usage(), id = 'resp_1') => ({ type: 'response.completed', sequence_number: 99, response: { id, status: 'completed', usage: u, output: [] } })

/** "say hi": one message item, text in two deltas. */
export function textScript ({ text = ['Hi', ' there!'], u = usage() } = {}) {
  const msg = { id: 'msg_up1', type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: text.join(''), annotations: [] }] }
  return [
    ...created(),
    { type: 'response.output_item.added', output_index: 0, item: { ...msg, status: 'in_progress', content: [] } },
    { type: 'response.content_part.added', output_index: 0, item_id: 'msg_up1', content_index: 0, part: { type: 'output_text', text: '' } },
    ...text.map((delta) => ({ type: 'response.output_text.delta', output_index: 0, item_id: 'msg_up1', content_index: 0, delta })),
    { type: 'response.output_text.done', output_index: 0, item_id: 'msg_up1', content_index: 0, text: text.join('') },
    { type: 'response.content_part.done', output_index: 0, item_id: 'msg_up1', content_index: 0, part: msg.content[0] },
    { type: 'response.output_item.done', output_index: 0, item: msg },
    completed(u)
  ]
}

/** Reasoning (two summary parts, encrypted content), then a function call with streamed arguments. */
export function reasoningToolScript ({ name = 'mcp__page__get_weather', args = '{"city":"Paris"}', callId = 'call_weather1', argDeltas = true } = {}) {
  const rs = { id: 'rs_up1', type: 'reasoning', summary: [{ type: 'summary_text', text: 'First thought.' }, { type: 'summary_text', text: 'Second thought.' }], encrypted_content: 'ENC-UPSTREAM-1' }
  const fc = { id: 'fc_up1', type: 'function_call', status: 'completed', call_id: callId, name, arguments: args }
  const half = Math.ceil(args.length / 2)
  return [
    ...created(),
    { type: 'response.output_item.added', output_index: 0, item: { id: 'rs_up1', type: 'reasoning', summary: [] } },
    { type: 'response.reasoning_summary_part.added', output_index: 0, item_id: 'rs_up1', summary_index: 0, part: { type: 'summary_text', text: '' } },
    { type: 'response.reasoning_summary_text.delta', output_index: 0, item_id: 'rs_up1', summary_index: 0, delta: 'First ' },
    { type: 'response.reasoning_summary_text.delta', output_index: 0, item_id: 'rs_up1', summary_index: 0, delta: 'thought.' },
    { type: 'response.reasoning_summary_text.done', output_index: 0, item_id: 'rs_up1', summary_index: 0, text: 'First thought.' },
    { type: 'response.reasoning_summary_part.added', output_index: 0, item_id: 'rs_up1', summary_index: 1, part: { type: 'summary_text', text: '' } },
    { type: 'response.reasoning_summary_text.delta', output_index: 0, item_id: 'rs_up1', summary_index: 1, delta: 'Second thought.' },
    { type: 'response.output_item.done', output_index: 0, item: rs },
    { type: 'response.output_item.added', output_index: 1, item: { ...fc, status: 'in_progress', arguments: '' } },
    ...(argDeltas
      ? [
          { type: 'response.function_call_arguments.delta', output_index: 1, item_id: 'fc_up1', delta: args.slice(0, half) },
          { type: 'response.function_call_arguments.delta', output_index: 1, item_id: 'fc_up1', delta: args.slice(half) },
          { type: 'response.function_call_arguments.done', output_index: 1, item_id: 'fc_up1', arguments: args }
        ]
      : []),
    { type: 'response.output_item.done', output_index: 1, item: fc },
    completed(usage(5000, 4096, 120, 64))
  ]
}

/** A failure before any output (response.failed). */
export function failedScript (error) {
  return [...created(), { type: 'response.failed', sequence_number: 2, response: { id: 'resp_1', status: 'failed', error } }]
}

/** Text that starts streaming, then a failure mid-stream. */
export function midFailScript (error, { asErrorEvent = false } = {}) {
  const head = textScript({ text: ['Partial'] }).slice(0, 5) // created, in_progress, added, part.added, one delta
  return [...head, asErrorEvent ? { type: 'error', sequence_number: 6, ...error } : { type: 'response.failed', sequence_number: 6, response: { id: 'resp_1', status: 'failed', error } }]
}

/** Parse Anthropic SSE text into event objects (asserting the `event:` name matches data.type). */
export function parseAnthropicSse (text) {
  const out = []
  for (const block of text.split('\n\n')) {
    if (!block.trim()) continue
    const ev = /^event: (.*)$/m.exec(block)?.[1]
    const data = /^data: (.*)$/m.exec(block)?.[1]
    const obj = JSON.parse(data)
    if (ev !== obj.type) throw new Error(`event name ${ev} != data.type ${obj.type}`)
    out.push(obj)
  }
  return out
}

/** Pipe `text` through a TransformStream in chunks of the given sizes (cycled), as UTF-8 bytes or strings. */
export async function pipeChunks (ts, text, { sizes = [7, 1, 64, 3], bytes = true } = {}) {
  const data = bytes ? new TextEncoder().encode(text) : text
  const chunks = []
  for (let i = 0, k = 0; i < data.length; k++) {
    const n = sizes[k % sizes.length]
    chunks.push(data.slice(i, i + n))
    i += n
  }
  const src = new ReadableStream({ start (c) { for (const ch of chunks) c.enqueue(ch); c.close() } })
  let out = ''
  const reader = src.pipeThrough(ts).getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    out += value
  }
  return out
}
