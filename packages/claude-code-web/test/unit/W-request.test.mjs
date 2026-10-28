// Track W (ChatGPT option, Worker side): the Anthropic -> Responses request
// translator (ARCHITECTURE.md Appendix A, report J §7.3-7.5).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  toResponsesRequest, FORBIDDEN_FIELDS, cleanSchema, shortenName, upstreamCallId, stripBillingLine,
  encodeReasoningSignature, decodeReasoningSignature, reasoningEffort, sessionIdOf, SIGNATURE_PREFIX
} from '../../src/runtime/boot/openai/request.js'
import { claudeCodeRequest, SESSION_ID, LONG_MCP, UPSTREAM_MODEL } from './W-fixtures.mjs'
import { RESEARCH_DIR } from '../research.mjs'

const opts = { model: UPSTREAM_MODEL }

/** Every object in a JSON tree. */
function * walk (v) {
  if (v && typeof v === 'object') {
    yield v
    for (const x of Object.values(v)) yield * walk(x)
  }
}

function assertSiwcSafe (body) {
  for (const f of FORBIDDEN_FIELDS) assert.ok(!(f in body), `no ${f}`)
  assert.equal(body.store, false)
  assert.equal(body.stream, true)
  for (const o of walk(body.input)) {
    assert.notEqual(o.role, 'system', 'no role:"system" items')
    assert.ok(!('cache_control' in o), 'no cache_control')
  }
  for (const o of walk(body.tools ?? [])) {
    assert.ok(!('defer_loading' in o), 'no defer_loading')
    assert.ok(!('$schema' in o), 'no $schema')
  }
  assert.doesNotMatch(JSON.stringify(body), /x-anthropic-billing-header/i)
}

test('request: a 2.1.311-shaped body becomes a Sign-in-with-ChatGPT-safe Responses body', () => {
  const { body, idMap } = toResponsesRequest(claudeCodeRequest(), opts)
  assertSiwcSafe(body)
  assert.deepEqual(Object.keys(body), ['model', 'input', 'tools', 'tool_choice', 'parallel_tool_calls', 'reasoning', 'include', 'store', 'stream', 'prompt_cache_key'])
  assert.equal(body.model, UPSTREAM_MODEL)
  assert.deepEqual(body.reasoning, { effort: 'medium', summary: 'auto' })
  assert.deepEqual(body.include, ['reasoning.encrypted_content'])
  assert.equal(body.prompt_cache_key, SESSION_ID, 'session id from metadata.user_id, device_id not used')
  assert.doesNotMatch(JSON.stringify(body), /ffffffffffff/, 'the device id never leaves')
  assert.equal(body.tool_choice, 'auto')
  assert.equal(body.parallel_tool_calls, true)

  // one leading developer message from the system blocks, billing line gone
  const [lead, ...rest] = body.input
  assert.deepEqual(lead, { type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'You are a synthetic agent for tests.' }, { type: 'input_text', text: '\nSynthetic instructions, several lines long.\nSecond line.' }] })
  // then the conversation, in order
  assert.deepEqual(rest.map((i) => `${i.type}${i.role ? `:${i.role}` : ''}`), [
    'message:user', 'message:developer', 'reasoning', 'message:assistant', 'function_call', 'function_call_output', 'message:developer'
  ])
  assert.deepEqual(rest[0].content, [{ type: 'input_text', text: '<system-reminder>\nSynthetic reminder text.\n</system-reminder>' }, { type: 'input_text', text: 'write a file' }])
  assert.deepEqual(rest[1].content, [{ type: 'input_text', text: '# Environment\nSynthetic environment block.' }])
  assert.deepEqual(rest[2], { type: 'reasoning', id: 'rs_prev1', summary: [{ type: 'summary_text', text: 'Planning the write.' }], encrypted_content: 'ENC-PREVIOUS-REASONING' }, 'our envelope replays; the Anthropic-signed block is dropped')
  assert.deepEqual(rest[3], { type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'I will write the file.' }] })
  assert.deepEqual(rest[4], { type: 'function_call', call_id: 'toolu_01SyntheticWrite', name: 'Write', arguments: JSON.stringify({ file_path: '/home/user/workspace/hello.txt', content: 'hello\n' }) })
  assert.deepEqual(rest[5], { type: 'function_call_output', call_id: 'toolu_01SyntheticWrite', output: 'File created successfully at: /home/user/workspace/hello.txt' })
  assert.deepEqual(rest[6].content, [{ type: 'input_text', text: '<total_tokens>999 tokens left</total_tokens>' }])

  // tools: placeholder and server tool dropped, schemas cleaned, names <= 64 and mapped back
  assert.deepEqual(body.tools.map((t) => t.name).slice(0, 3), ['Write', 'Grep', 'mcp__page__get_weather'])
  assert.equal(body.tools.length, 4)
  for (const t of body.tools) {
    assert.equal(t.type, 'function')
    assert.equal(t.strict, false)
    assert.match(t.name, /^[a-zA-Z0-9_-]{1,64}$/)
    assert.equal(t.parameters.type, 'object')
    assert.equal(typeof t.parameters.properties, 'object')
  }
  const long = body.tools[3]
  assert.ok(long.name.length <= 64 && long.name !== LONG_MCP)
  assert.equal(idMap.toolNames.get(long.name), LONG_MCP)
  assert.equal(idMap.toolNames.get('Write'), 'Write')
  assert.equal(idMap.model, UPSTREAM_MODEL)
  const grep = body.tools[1].parameters
  assert.equal(grep.properties.label.pattern, undefined, '\\p{...} regex dropped')
  assert.equal(grep.properties.label.maxLength, 20, 'other keywords kept')
  assert.equal(grep.additionalProperties, false)
  assert.deepEqual(grep.properties.output_mode.enum, ['content', 'files_with_matches', 'count'])
})

test('request: hoistSystem moves in-message system items into the leading developer message', () => {
  const { body } = toResponsesRequest(claudeCodeRequest(), { ...opts, hoistSystem: true })
  assertSiwcSafe(body)
  assert.equal(body.input.filter((i) => i.role === 'developer').length, 1)
  assert.deepEqual(body.input[0].content.map((c) => c.text), [
    'You are a synthetic agent for tests.', '\nSynthetic instructions, several lines long.\nSecond line.',
    '# Environment\nSynthetic environment block.', '<total_tokens>999 tokens left</total_tokens>'
  ])
})

test('request: interrupted calls get an "aborted" output, orphan results become text, developer messages wait for outputs', () => {
  const req = {
    model: 'claude-sonnet-5-5',
    system: 'plain string system\nx-anthropic-billing-header: cc_version=1;',
    messages: [
      { role: 'user', content: 'go' },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'toolu_a', name: 'Read', input: { file_path: '/a' } }, { type: 'tool_use', id: 'toolu_b', name: 'Read', input: { file_path: '/b' } }] },
      { role: 'system', content: 'mid-call reminder' },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_b', content: [{ type: 'text', text: 'B' }], is_error: true }, { type: 'text', text: '[Request interrupted by user]' }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_gone', content: 'from a compacted call' }, { type: 'text', text: 'next' }] },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'toolu_last', name: 'Glob', input: {} }] }
    ]
  }
  const { body } = toResponsesRequest(req, opts)
  assertSiwcSafe(body)
  assert.deepEqual(body.input[0], { type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'plain string system' }] })
  const seq = body.input.slice(1).map((i) => (i.type === 'function_call_output' ? `out:${i.call_id}:${i.output}` : i.type === 'function_call' ? `call:${i.call_id}` : `${i.role}:${i.content.map((c) => c.text).join('|')}`))
  assert.deepEqual(seq, [
    'user:go',
    'call:toolu_a', 'call:toolu_b',
    'out:toolu_b:Error: B', 'out:toolu_a:aborted',
    'developer:mid-call reminder',
    'user:[Request interrupted by user]',
    'user:[result of an earlier tool call]\nfrom a compacted call|next',
    'call:toolu_last', 'out:toolu_last:aborted'
  ])
  assert.equal(body.tools, undefined, 'no tools, no tool_choice')
  assert.equal(body.tool_choice, undefined)
})

test('request: images, documents and rich tool results degrade per J §7.8', () => {
  const png = 'iVBORw0KGgo='
  const req = {
    model: 'claude-sonnet-5-5',
    messages: [
      { role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/png', data: png } },
        { type: 'image', source: { type: 'url', url: 'https://example.com/a.jpg' } },
        { type: 'document', title: 'Spec', source: { type: 'base64', media_type: 'application/pdf', data: 'JVBERi0=' } },
        { type: 'document', source: { type: 'text', media_type: 'text/plain', data: 'plain doc' } },
        { type: 'document', source: { type: 'url', url: 'https://example.com/x.pdf' } },
        { type: 'search_result', title: 'T', source: 'https://s', content: [{ type: 'text', text: 'snippet' }] },
        { type: 'text', text: 'look' }
      ] },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'toolu_img', name: 'Read', input: {} }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_img', content: [{ type: 'text', text: 'an image:' }, { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: 'AAAA' } }, { type: 'tool_reference', tool_name: 'Grep' }] }] }
    ]
  }
  const { body } = toResponsesRequest(req, opts)
  const parts = body.input[0].content
  assert.deepEqual(parts[0], { type: 'input_image', image_url: `data:image/png;base64,${png}`, detail: 'auto' })
  assert.deepEqual(parts[1], { type: 'input_image', image_url: 'https://example.com/a.jpg', detail: 'auto' })
  assert.deepEqual(parts[2], { type: 'input_file', filename: 'Spec.pdf', file_data: 'data:application/pdf;base64,JVBERi0=' })
  assert.deepEqual(parts[3], { type: 'input_text', text: 'plain doc' })
  assert.match(parts[4].text, /^\[document omitted: https:\/\/example\.com\/x\.pdf\]$/)
  assert.match(parts[5].text, /\[search result\] T \(https:\/\/s\)\nsnippet/)
  assert.deepEqual(parts[6], { type: 'input_text', text: 'look' })
  const out = body.input.find((i) => i.type === 'function_call_output')
  assert.deepEqual(out.output, [{ type: 'input_text', text: 'an image:' }, { type: 'input_image', image_url: 'data:image/jpeg;base64,AAAA', detail: 'auto' }, { type: 'input_text', text: '[tool reference: Grep]' }])
})

test('request: tool_choice, effort, small model, structured output', () => {
  const base = { model: 'claude-sonnet-5-5', messages: [{ role: 'user', content: 'x' }], tools: [{ name: 'Read', input_schema: { type: 'object', properties: {} } }] }
  const tc = (tool_choice) => toResponsesRequest({ ...base, tool_choice }, opts).body
  assert.equal(tc({ type: 'any' }).tool_choice, 'required')
  assert.equal(tc({ type: 'none' }).tool_choice, 'none')
  assert.deepEqual(tc({ type: 'tool', name: 'Read' }).tool_choice, { type: 'function', name: 'Read' })
  assert.equal(tc({ type: 'auto', disable_parallel_tool_use: true }).parallel_tool_calls, false)

  assert.equal(reasoningEffort({ output_config: { effort: 'high' } }), 'high')
  assert.equal(reasoningEffort({ output_config: { effort: 'max' } }, 'low'), 'low', 'the settings override wins')
  assert.equal(reasoningEffort({ output_config: { effort: 'xhigh' } }, 'auto'), 'xhigh')
  assert.equal(reasoningEffort({ thinking: { type: 'disabled' }, output_config: { effort: 'high' } }), 'low')
  assert.equal(reasoningEffort({ thinking: { type: 'enabled', budget_tokens: 2000 } }), 'low')
  assert.equal(reasoningEffort({ thinking: { type: 'enabled', budget_tokens: 10000 } }), 'medium')
  assert.equal(reasoningEffort({ thinking: { type: 'enabled', budget_tokens: 32000 } }), 'high')
  assert.equal(reasoningEffort({}), 'medium')
  assert.equal(reasoningEffort({ output_config: { effort: 'bogus' } }, 'nonsense'), 'medium')

  assert.equal(toResponsesRequest({ ...base, model: 'claude-haiku-5-5' }, { ...opts, smallModel: 'gpt-mini' }).body.model, 'gpt-mini')
  assert.equal(toResponsesRequest({ ...base, model: 'claude-haiku-5-5' }, opts).body.model, UPSTREAM_MODEL)
  assert.throws(() => toResponsesRequest(base, {}), /no upstream model/)

  const fmt = toResponsesRequest({ ...base, output_config: { format: { type: 'json_schema', schema: { $schema: 'x', type: 'object', properties: { a: { type: 'string' } } } } } }, opts).body
  assert.deepEqual(fmt.text, { format: { type: 'json_schema', name: 'output', schema: { type: 'object', properties: { a: { type: 'string' } } }, strict: false } })
  const sid = toResponsesRequest(base, { ...opts, sessionId: 'from-header' }).body
  assert.equal(sid.prompt_cache_key, 'from-header')
  assert.equal(sessionIdOf({ metadata: { user_id: 'not json' } }), undefined)
  assert.equal(toResponsesRequest(base, opts).body.prompt_cache_key, undefined)
})

test('request: names and call ids fit ^[a-zA-Z0-9_-]{1,64}$, deterministically, without collisions', () => {
  assert.equal(shortenName('mcp__page__get_weather'), 'mcp__page__get_weather')
  assert.equal(shortenName('has.dots and spaces'), 'has_dots_and_spaces')
  const long = shortenName(LONG_MCP)
  assert.equal(long, 'mcp__and_an_even_longer_tool_name_here')
  const huge = 'x'.repeat(100)
  assert.equal(shortenName(huge).length, 64)
  assert.equal(shortenName(huge), shortenName(huge))
  assert.notEqual(shortenName(huge), shortenName(`${huge}y`))
  // two long MCP tools that shorten to the same name keep distinct, reversible names
  const a = 'mcp__server_one_with_a_long_long_long_name__shared_tool_name_that_is_long'
  const b = 'mcp__server_two_with_a_long_long_long_name__shared_tool_name_that_is_long'
  const req = { model: 'm', messages: [{ role: 'user', content: 'x' }], tools: [a, b].map((name) => ({ name, input_schema: { type: 'object' } })) }
  const { body, idMap } = toResponsesRequest(req, opts)
  const [na, nb] = body.tools.map((t) => t.name)
  assert.notEqual(na, nb)
  assert.equal(idMap.toolNames.get(na), a)
  assert.equal(idMap.toolNames.get(nb), b)
  for (const n of [na, nb]) assert.match(n, /^[a-zA-Z0-9_-]{1,64}$/)
  // call ids
  assert.equal(upstreamCallId('toolu_01ABC'), 'toolu_01ABC')
  const weird = upstreamCallId('toolu:with/odd+chars')
  assert.match(weird, /^[a-zA-Z0-9_-]{1,64}$/)
  assert.equal(weird, upstreamCallId('toolu:with/odd+chars'))
  assert.match(upstreamCallId('t'.repeat(200)), /^[a-zA-Z0-9_-]{1,64}$/)
  assert.match(upstreamCallId(''), /^call_[a-z0-9]+$/)
})

test('request: schema cleanup', () => {
  assert.deepEqual(cleanSchema(undefined), { type: 'object', properties: {} })
  assert.deepEqual(cleanSchema({ type: 'object' }), { type: 'object', properties: {} })
  assert.deepEqual(cleanSchema({ properties: { a: true } }), { properties: { a: {} }, type: 'object' })
  assert.deepEqual(cleanSchema({
    $schema: 's', $id: 'i', type: 'object',
    properties: { o: { type: 'object' }, arr: { type: 'array', items: { $schema: 's', type: 'string', pattern: '\\P{Cc}' } }, u: { anyOf: [{ type: 'string' }, { type: 'object' }] } },
    $defs: { d: { $id: 'x', type: 'object' } }, additionalProperties: false
  }), {
    type: 'object',
    properties: { o: { type: 'object', properties: {} }, arr: { type: 'array', items: { type: 'string' } }, u: { anyOf: [{ type: 'string' }, { type: 'object', properties: {} }] } },
    $defs: { d: { type: 'object', properties: {} } }, additionalProperties: false
  })
})

test('request: reasoning envelope round trip, clear_thinking, other-model and trailing reasoning', () => {
  const sig = encodeReasoningSignature({ id: 'rs_1', encrypted_content: 'gAAAA+/=ünïcode', model: 'gpt-5.5' })
  assert.ok(sig.startsWith(SIGNATURE_PREFIX))
  assert.match(sig, /^cxr1\.[A-Za-z0-9_-]+$/)
  assert.deepEqual(decodeReasoningSignature(sig), { id: 'rs_1', encrypted_content: 'gAAAA+/=ünïcode', model: 'gpt-5.5' })
  assert.equal(decodeReasoningSignature('EqQBCkgI...anthropic'), null)
  assert.equal(decodeReasoningSignature('cxr1.!!!not-base64'), null)
  assert.equal(decodeReasoningSignature(undefined), null)

  const turn = (n, model = 'gpt-5.5') => [
    { role: 'assistant', content: [{ type: 'thinking', thinking: `t${n}`, signature: encodeReasoningSignature({ id: `rs_${n}`, encrypted_content: `E${n}`, model }) }, { type: 'text', text: `a${n}` }] },
    { role: 'user', content: `u${n}` }
  ]
  const msgs = [{ role: 'user', content: 'start' }, ...turn(1), ...turn(2), ...turn(3, 'gpt-other')]
  const ids = (edits) => toResponsesRequest({ model: 'm', messages: msgs, context_management: edits && { edits } }, opts).body.input.filter((i) => i.type === 'reasoning').map((i) => i.id)
  assert.deepEqual(ids(undefined), ['rs_1', 'rs_2'], 'reasoning from another upstream model is dropped')
  assert.deepEqual(ids([{ type: 'clear_thinking_20251015', keep: 'all' }]), ['rs_1', 'rs_2'])
  assert.deepEqual(ids([{ type: 'clear_thinking_20251015', keep: { type: 'thinking_turns', value: 2 } }]), ['rs_2'])
  assert.deepEqual(ids([{ type: 'clear_thinking_20251015', keep: { type: 'thinking_turns', value: 0 } }]), [])

  // a turn that ends on its reasoning (interrupted) does not send a dangling reasoning item
  const dangling = toResponsesRequest({ model: 'm', messages: [{ role: 'user', content: 'x' }, { role: 'assistant', content: [{ type: 'text', text: 'partial' }, { type: 'thinking', thinking: '', signature: encodeReasoningSignature({ id: 'rs_z', encrypted_content: 'Z', model: 'gpt-5.5' }) }] }, { role: 'user', content: 'again' }] }, opts).body
  assert.deepEqual(dangling.input.map((i) => i.type), ['message', 'message', 'message'])
  // redacted_thinking carrying our envelope replays too
  const red = toResponsesRequest({ model: 'm', messages: [{ role: 'user', content: 'x' }, { role: 'assistant', content: [{ type: 'redacted_thinking', data: encodeReasoningSignature({ id: 'rs_r', encrypted_content: 'R', model: 'gpt-5.5' }) }, { type: 'text', text: 'y' }] }] }, opts).body
  assert.deepEqual(red.input[1], { type: 'reasoning', id: 'rs_r', summary: [], encrypted_content: 'R' })
})

test('request: the billing line is stripped wherever it sits, other text untouched', () => {
  assert.equal(stripBillingLine('x-anthropic-billing-header: cc_version=1;'), '')
  assert.equal(stripBillingLine('a\nx-anthropic-billing-header: v\nb'), 'a\nb')
  assert.equal(stripBillingLine('mentions x-anthropic-billing-header: inline'), 'mentions x-anthropic-billing-header: inline')
})

// The real 2.1.311 request bodies captured by report J (research data, read
// here and never copied into the repo): every invariant must hold on them too.
test('request: the captured 2.1.311 bodies translate to safe Responses bodies', { skip: !existsSync(join(RESEARCH_DIR, 'J-capture', 'bodies.jsonl')) && 'no J-capture in the research dir' }, () => {
  const lines = readFileSync(join(RESEARCH_DIR, 'J-capture', 'bodies.jsonl'), 'utf8').split('\n').filter(Boolean)
  assert.ok(lines.length >= 1)
  for (const line of lines) {
    const { body: anthropic, headers } = JSON.parse(line)
    const { body, idMap } = toResponsesRequest(anthropic, { ...opts, sessionId: headers?.['x-claude-code-session-id'] })
    assertSiwcSafe(body)
    assert.equal(body.input[0].role, 'developer')
    assert.ok(!body.tools.some((t) => t.name === 'DeferredToolPlaceholder'))
    assert.equal(body.tools.length, anthropic.tools.length - 1)
    for (const t of body.tools) assert.equal(idMap.toolNames.get(t.name), t.name)
    const calls = body.input.filter((i) => i.type === 'function_call').map((i) => i.call_id)
    const outs = body.input.filter((i) => i.type === 'function_call_output').map((i) => i.call_id)
    assert.deepEqual(outs, calls, 'every call has its output')
    assert.equal(body.input.filter((i) => i.role === 'developer').length, 1 + anthropic.messages.filter((m) => m.role === 'system').length)
  }
})
