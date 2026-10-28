#!/usr/bin/env node
// A local stand-in for api.anthropic.com's /v1/messages, for the acceptance
// test and for trying the page without a credential. Grown from the research
// spike's mock (report E, tools/mock-api.mjs).
//
//   node mock/mock-api.mjs [port]          (default 18080; 0 picks a free port)
//   MOCK_LOG=/path/requests.jsonl          every request appended as one JSON line
//
// Behaviour:
//   - CORS like the real endpoint (report C): any Origin; the preflight for
//     /v1/* succeeds only when the request headers include
//     anthropic-dangerous-direct-browser-access (MOCK_STRICT_CORS=0 relaxes it).
//   - POST /v1/messages streams SSE (or returns JSON for stream:false).
//     The scenario is chosen from the latest user prompt text:
//       "say hi"               -> text
//       "use the weather tool" -> tool_use of mcp__<server>__get_weather {city: "Paris"};
//                                 on the follow-up, the tool_result must answer that
//                                 tool_use id (else 400), and the reply echoes it
//       "write a file"         -> tool_use Write {file_path: <workspace>/hello.txt},
//                                 then text echoing the tool_result
//       "stream slowly"        -> a long text, one SSE event every 200 ms (~20 s in
//                                 all), for interrupting; a request the client
//                                 abandons is marked `aborted: true` in /__requests,
//                                 and `sent`/`events`/`completed` show how far it got
//                                 (long on purpose: a stream an interrupt failed to
//                                 cancel is still running when the test looks)
//       "run the file tools"   -> one tool_use per request, each answering the last:
//                                 Glob, Grep, Read, Edit (on hello.txt), then text
//                                 quoting every tool_result ("<Tool>: <result>" lines)
//       anything else          -> 401 authentication_error
//       "overflow"             -> 400 "prompt is too long: 300000 tokens > 200000 maximum"
//   - POST /v1/messages/count_tokens -> {input_tokens}
//   - GET /__requests -> the logged requests (JSON array); POST /__reset clears them
//   - GET /__health -> {ok: true}
//
// The ChatGPT option (ARCHITECTURE.md Appendix A), on the same server: the
// page's ChatGPT base URL is <mock>/v1 and its sign-in issuer <mock>.
//   - POST /v1/responses: Responses API SSE for the same scenarios ("say hi",
//     "use the weather tool" -> a function_call of mcp__page__get_weather, then
//     on the follow-up the function_call_output must answer its call_id and is
//     echoed, "write a file", "run the file tools", "stream slowly"), plus
//     "overflow" (HTTP 400 context_length_exceeded) and "overflow mid-stream"
//     (response.failed), "hit the usage limit" (HTTP 429
//     subscription_sharing_usage_limit_exceeded), "hit the rate limit" (the first
//     request of each pair fails before any output with response.failed
//     rate_limit_exceeded "try again in 1.2s", the retry gets text), "fail mid-stream"
//     (the first request of each pair streams some text, then response.failed
//     server_is_overloaded; the retry, which 2.1.311 sends as a new "resume"
//     user message after the kept partial text, gets text), and a compaction request (its
//     prompt asks for a "summary": the reply is a summary carrying a marker;
//     "overflow" in a conversation that carries the marker is then answered
//     normally, so Claude Code's reactive compaction can complete). Each reply
//     starts with a reasoning item (summary text
//     when reasoning.summary is set, encrypted_content when include asks for
//     it). Every request is checked as OpenAI's Sign in with ChatGPT preview
//     does, and the outcome recorded in /__requests (`checks`, `problems`):
//     a bearer this mock's issuer handed out, store === false, stream === true,
//     input an array without role "system" items, none of the parameters the
//     preview rejects (max_output_tokens, temperature, metadata, ...), and none
//     of the Codex CLI's identity headers (originator, chatgpt-account-id).
//     A problem answers 400 (401 for the bearer), like the real API.
//     `reasoningReplayed` says whether earlier reasoning items came back.
//   - GET /v1/models -> {models: MOCK_MODELS} (one of them visibility "hide")
//   - the fake issuer:
//       GET  /api/accounts/authorize   checks the Sign in with ChatGPT parameters,
//            then 302 to http://127.0.0.1:1455/auth/callback?code=…&state=<echoed>&client_id=oaiapp_test
//       POST /api/accounts/oauth/token (form) authorization_code (PKCE S256 checked)
//            and refresh_token grants: tokens with a rotating refresh_token,
//            expires_in 3600; a reused refresh token is refused (401
//            refresh_token_reused); an unsigned id_token carries the nonce
//       POST /api/accounts/oauth/revoke
//   - POST /__revoke-access[?cors=0] makes every access token issued so far
//     answer 401 on /v1/* (cors=0: without CORS headers, as OpenAI's edge layer
//     does, so a browser sees a network error)
//   MOCK_ANY_BEARER=1 accepts any bearer on /v1/responses and /v1/models.
//
// Importable: startMockApi({port, logFile}) -> {url, port, requests, reset(), close()}.

import http from 'node:http'
import fs from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { pathToFileURL } from 'node:url'

const PICK_HEADERS = ['anthropic-beta', 'anthropic-version', 'user-agent', 'x-app', 'anthropic-dangerous-direct-browser-access',
  'content-type', 'origin', 'referer', 'x-claude-code-session-id', 'x-stainless-lang', 'x-stainless-runtime',
  'x-stainless-package-version', 'access-control-request-method', 'access-control-request-headers',
  'accept', 'openai-beta', 'originator', 'chatgpt-account-id', 'session-id', 'version']

const WRITE_PATH = process.env.MOCK_WRITE_PATH || '/home/user/workspace/hello.txt'
const WRITE_CONTENT = 'hello from the mock API\n'
const WORKSPACE = WRITE_PATH.slice(0, WRITE_PATH.lastIndexOf('/'))

// "run the file tools": the built-in file tools on the Worker's virtual
// filesystem, one per round trip (the Write scenario creates the file first).
export const FILE_TOOL_STEPS = [
  { name: 'Glob', input: { pattern: '**/*.txt', path: WORKSPACE } },
  { name: 'Grep', input: { pattern: 'hello from', path: WORKSPACE, output_mode: 'content' } },
  { name: 'Read', input: { file_path: WRITE_PATH } },
  { name: 'Edit', input: { file_path: WRITE_PATH, old_string: 'hello from', new_string: 'goodbye from' } }
]

/** Text of a user message, minus <system-reminder> blocks Claude Code injects. */
function userText (m) {
  const parts = typeof m.content === 'string'
    ? [m.content]
    : Array.isArray(m.content) ? m.content.filter((b) => b && b.type === 'text').map((b) => b.text) : []
  return parts.map((t) => String(t).replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')).join('\n').trim()
}

function toolResultText (block) {
  const c = block.content
  if (typeof c === 'string') return c
  if (Array.isArray(c)) return c.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n')
  return ''
}

// ('overflow mid-stream' before 'overflow': at the same position the first listed wins)
/** Put in the mock's compaction summary; an "overflow" prompt after it no longer overflows. */
export const COMPACT_MARKER = 'mock-compacted-conversation'

/** The partial text "fail mid-stream" streams before failing; Claude Code keeps it in the history. */
export const MID_FAIL_PARTIAL = ['Partial answer, then the ', 'connection fails']

/**
 * The scenario, with two follow-up rules: "overflow" after the mock's
 * compaction summary is answered; and a prompt without a scenario in a
 * conversation that holds the mock's partial "fail mid-stream" text is that
 * scenario's retry (2.1.311 answers a failure after output by keeping the
 * partial message and asking the model, in a new user message, to resume).
 */
function scenarioWithCompaction (prompt, body) {
  const s = scenarioOf(prompt)
  const all = JSON.stringify(body ?? null)
  if ((s === 'overflow' || s === 'overflow-stream') && all.includes(COMPACT_MARKER)) return 'compacted'
  if (s === 'unknown' && all.includes(MID_FAIL_PARTIAL.join(''))) return 'mid-fail'
  return s
}

const SCENARIOS = [['use the weather tool', 'weather'], ['write a file', 'write'], ['run the file tools', 'files'], ['stream slowly', 'slow'], ['say hi', 'hi'], ['overflow mid-stream', 'overflow-stream'], ['overflow', 'overflow'], ['hit the usage limit', 'usage-limit'], ['hit the rate limit', 'rate-limit'], ['fail mid-stream', 'mid-fail'], ['summary', 'compact']]

/**
 * The scenario whose phrase comes last in the prompt: after an interrupted
 * turn the CLI folds the old prompt, "[Request interrupted by user]" and the
 * new prompt into one user message.
 */
export function scenarioOf (prompt) {
  const text = String(prompt).toLowerCase()
  let best = 'unknown'
  let at = -1
  for (const [phrase, name] of SCENARIOS) {
    const i = text.lastIndexOf(phrase)
    if (i > at) { at = i; best = name }
  }
  return best
}

/** Which scenario, which phase, and what the conversation holds since the prompt. */
export function analyze (body) {
  const msgs = Array.isArray(body?.messages) ? body.messages : []
  let promptIdx = -1
  let prompt = ''
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]?.role !== 'user') continue
    const t = userText(msgs[i])
    if (t) { promptIdx = i; prompt = t; break }
  }
  const after = msgs.slice(promptIdx + 1)
  const toolUses = after.filter((m) => m.role === 'assistant' && Array.isArray(m.content)).flatMap((m) => m.content.filter((b) => b.type === 'tool_use'))
  const toolResults = after.filter((m) => m.role === 'user' && Array.isArray(m.content)).flatMap((m) => m.content.filter((b) => b.type === 'tool_result'))
  // (a tool_result inside the prompt message itself counts as well: some
  // clients fold the follow-up into the same user turn)
  if (promptIdx >= 0 && Array.isArray(msgs[promptIdx].content)) toolResults.push(...msgs[promptIdx].content.filter((b) => b.type === 'tool_result'))
  const scenario = scenarioWithCompaction(prompt, body)
  const toolNames = Array.isArray(body?.tools) ? body.tools.map((t) => t?.name).filter(Boolean) : []
  return { scenario, prompt, phase: toolResults.length ? 'follow-up' : 'first', toolUses, toolResults, toolNames }
}

/** The assistant reply for a request, as content blocks + stop reason, or an HTTP error. */
export function reply (a) {
  if (a.scenario === 'unknown') {
    return { status: 401, error: { type: 'authentication_error', message: 'Invalid bearer token (mock: no scenario for this prompt; try "say hi", "use the weather tool" or "write a file")' } }
  }
  if (a.scenario === 'overflow' || a.scenario === 'overflow-stream') {
    return { status: 400, error: { type: 'invalid_request_error', message: 'prompt is too long: 300000 tokens > 200000 maximum' } }
  }
  if (a.scenario === 'usage-limit') {
    return { status: 429, error: { type: 'rate_limit_error', message: 'mock: usage limit reached' }, headers: { 'x-should-retry': 'false' } }
  }
  if (a.scenario === 'hi') return { content: [{ type: 'text', text: 'hi from the mock API' }], stop: 'end_turn' }
  if (a.scenario === 'compact') return { content: [{ type: 'text', text: `<summary>The user asked for an overflow and the mock compacted the conversation (${COMPACT_MARKER}).</summary>` }], stop: 'end_turn' }
  if (a.scenario === 'compacted') return { content: [{ type: 'text', text: 'answered after compaction' }], stop: 'end_turn' }
  if (a.scenario === 'rate-limit') return { content: [{ type: 'text', text: 'answered after a rate limit' }], stop: 'end_turn' }
  if (a.scenario === 'mid-fail') return { content: [{ type: 'text', text: 'answered after a mid-stream failure' }], stop: 'end_turn' }
  if (a.scenario === 'files') return fileToolsReply(a)
  if (a.scenario === 'slow') {
    const text = Array.from({ length: 300 }, (_, i) => `word${i + 1}`).join(' ')
    return { content: [{ type: 'text', text }], stop: 'end_turn', delayMs: 200 }
  }
  if (a.phase === 'first') {
    if (a.scenario === 'weather') {
      const name = a.toolNames.find((n) => /^mcp__.+__get_weather$/.test(n)) ?? 'mcp__page__get_weather'
      return { content: [{ type: 'tool_use', id: `toolu_mock_weather_${Date.now().toString(36)}`, name, input: { city: 'Paris' } }], stop: 'tool_use', toolPresent: a.toolNames.includes(name) }
    }
    return { content: [{ type: 'tool_use', id: `toolu_mock_write_${Date.now().toString(36)}`, name: 'Write', input: { file_path: WRITE_PATH, content: WRITE_CONTENT } }], stop: 'tool_use', toolPresent: a.toolNames.includes('Write') }
  }
  // follow-up: the tool_result must answer the tool_use we sent
  const use = a.toolUses[a.toolUses.length - 1]
  const result = use ? a.toolResults.find((r) => r.tool_use_id === use.id) : a.toolResults[a.toolResults.length - 1]
  if (use && !result) {
    return { status: 400, error: { type: 'invalid_request_error', message: `mock: expected a tool_result for ${use.id}` } }
  }
  const text = toolResultText(result)
  if (a.scenario === 'weather') return { content: [{ type: 'text', text: `The weather tool said: ${text}` }], stop: 'end_turn', echoed: text }
  return { content: [{ type: 'text', text: `Wrote the file. The tool said: ${text}` }], stop: 'end_turn', echoed: text }
}

function fileToolsReply (a) {
  // every tool_use so far must have its tool_result
  for (const use of a.toolUses) {
    if (!a.toolResults.some((r) => r.tool_use_id === use.id)) {
      return { status: 400, error: { type: 'invalid_request_error', message: `mock: expected a tool_result for ${use.id}` } }
    }
  }
  const step = FILE_TOOL_STEPS[a.toolUses.length]
  if (step) {
    return { content: [{ type: 'tool_use', id: `toolu_mock_${step.name.toLowerCase()}_${Date.now().toString(36)}`, name: step.name, input: step.input }], stop: 'tool_use', toolPresent: a.toolNames.includes(step.name) }
  }
  const lines = a.toolUses.map((use) => {
    const r = a.toolResults.find((x) => x.tool_use_id === use.id)
    return `${use.name}${r.is_error ? ' (error)' : ''}: ${toolResultText(r).replace(/\s+/g, ' ').trim()}`
  })
  return { content: [{ type: 'text', text: `File tools done.\n${lines.join('\n')}` }], stop: 'end_turn', echoed: lines.join('\n') }
}

function sseEvents (r, { model, id }) {
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`
  const out = [ev('message_start', { message: { id, type: 'message', role: 'assistant', model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 12, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } })]
  out.push(ev('ping', {}))
  r.content.forEach((block, index) => {
    if (block.type === 'text') {
      out.push(ev('content_block_start', { index, content_block: { type: 'text', text: '' } }))
      // a few deltas, so the client really has to stream
      const words = block.text.match(/\S+\s*/g) ?? [block.text]
      for (let i = 0; i < words.length; i += 3) out.push(ev('content_block_delta', { index, delta: { type: 'text_delta', text: words.slice(i, i + 3).join('') } }))
    } else if (block.type === 'tool_use') {
      out.push(ev('content_block_start', { index, content_block: { type: 'tool_use', id: block.id, name: block.name, input: {} } }))
      const json = JSON.stringify(block.input)
      const cut = Math.floor(json.length / 2)
      out.push(ev('content_block_delta', { index, delta: { type: 'input_json_delta', partial_json: json.slice(0, cut) } }))
      out.push(ev('content_block_delta', { index, delta: { type: 'input_json_delta', partial_json: json.slice(cut) } }))
    }
    out.push(ev('content_block_stop', { index }))
  })
  out.push(ev('message_delta', { delta: { stop_reason: r.stop, stop_sequence: null }, usage: { output_tokens: 7 } }))
  out.push(ev('message_stop', {}))
  return out
}

/** Write SSE events one by one; `rec` records how far it got and whether the client went away. */
function pumpEvents (res, rec, events, delayMs) {
  let k = 0
  rec.events = events.length
  rec.sent = 0
  res.on('close', () => { if (k < events.length) rec.aborted = true })
  const pump = () => {
    if (res.destroyed) return
    if (k >= events.length) { rec.completed = true; return res.end() }
    res.write(events[k++])
    rec.sent = k
    setTimeout(pump, delayMs)
  }
  pump()
}

function corsHeaders (req) {
  return {
    'access-control-allow-origin': '*',
    'access-control-expose-headers': '*',
    vary: 'Origin'
  }
}

// --- the OpenAI side (the ChatGPT option) ------------------------------------------

export const MOCK_CLIENT_ID = 'oaiapp_test'
export const SIWC_REDIRECT_URI = 'http://127.0.0.1:1455/auth/callback'
export const SIWC_RESOURCE = 'https://api.openai.com/v1'
const SIWC_SCOPE = 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct'
export const MOCK_MODELS = [
  { slug: 'gpt-5.5', display_name: 'GPT-5.5', visibility: 'list', context_window: 272000, supported_reasoning_levels: [{ effort: 'low' }, { effort: 'medium' }, { effort: 'high' }, { effort: 'xhigh' }], default_reasoning_level: 'medium' },
  { slug: 'gpt-6.1-sol', display_name: 'GPT-6.1 Sol', visibility: 'list', context_window: 272000 },
  { slug: 'codex-auto-review', display_name: 'Codex auto review', visibility: 'hide', context_window: 272000 }
]
/** What the Sign in with ChatGPT preview rejects on /v1/responses (report J §3c). */
export const SIWC_FORBIDDEN_FIELDS = ['max_output_tokens', 'temperature', 'metadata', 'top_p', 'top_logprobs', 'truncation', 'user',
  'background', 'conversation', 'max_tool_calls', 'moderation', 'multi_agent', 'prompt', 'prompt_cache_retention', 'safety_identifier', 'previous_response_id']
/** The Codex CLI's identity headers: nothing in this app may send them. */
export const FORBIDDEN_HEADERS = ['originator', 'chatgpt-account-id']

const b64url = (buf) => Buffer.from(buf).toString('base64url')
const s256 = (verifier) => createHash('sha256').update(verifier).digest('base64url')

/** Text of a Responses message item (input_text / output_text parts), minus <system-reminder> blocks. */
function responsesText (item) {
  const parts = typeof item?.content === 'string'
    ? [item.content]
    : Array.isArray(item?.content) ? item.content.filter((p) => p && typeof p.text === 'string').map((p) => p.text) : []
  return parts.map((t) => t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')).join('\n').trim()
}

function outputText (output) {
  if (typeof output === 'string') return output
  if (Array.isArray(output)) return output.filter((p) => p && typeof p.text === 'string').map((p) => p.text).join('\n')
  return ''
}

/**
 * A /v1/responses body in analyze()'s terms (function_call -> tool_use,
 * function_call_output -> tool_result), so reply() picks the same scenario
 * and phase as for /v1/messages.
 */
export function analyzeResponses (body) {
  const items = Array.isArray(body?.input) ? body.input : []
  let promptIdx = -1
  let prompt = ''
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]
    if ((it?.type ?? 'message') !== 'message' || it.role !== 'user') continue
    const t = responsesText(it)
    if (t) { promptIdx = i; prompt = t; break }
  }
  const after = items.slice(promptIdx + 1)
  const parse = (s) => { try { return JSON.parse(s) } catch { return {} } }
  const toolUses = after.filter((it) => it?.type === 'function_call').map((it) => ({ type: 'tool_use', id: it.call_id, name: it.name, input: parse(it.arguments) }))
  const toolResults = after.filter((it) => it?.type === 'function_call_output').map((it) => {
    const text = outputText(it.output)
    return { type: 'tool_result', tool_use_id: it.call_id, content: text, is_error: /^Error: /.test(text) }
  })
  const toolNames = Array.isArray(body?.tools) ? body.tools.map((t) => t?.name).filter(Boolean) : []
  const reasoning = items.filter((it) => it?.type === 'reasoning')
  return { scenario: scenarioWithCompaction(prompt, body), prompt, phase: toolResults.length ? 'follow-up' : 'first', toolUses, toolResults, toolNames, reasoning }
}

const TOOL_NAME = /^[a-zA-Z0-9_-]{1,64}$/
const CONTENT_TYPES = {
  user: ['input_text', 'input_image', 'input_file'],
  developer: ['input_text'],
  assistant: ['output_text', 'refusal']
}

/**
 * How the real /v1/responses validates `input` and `tools` beyond the SIWC
 * field list (integration, so the mock refuses what OpenAI would): every
 * function_call_output answers an earlier function_call and every
 * function_call is answered; a reasoning item is followed by the item it
 * produced (a message or function_call), not by input or the end; message
 * content parts fit the role (assistant: output_text/refusal; user and
 * developer: input_*); function names match ^[a-zA-Z0-9_-]{1,64}$ and
 * arguments are strings.
 */
export function inputStructureProblems (input, tools) {
  const problems = []
  const items = Array.isArray(input) ? input : []
  const calls = new Map() // call_id -> index
  const answered = new Set()
  items.forEach((it, i) => {
    const type = it?.type ?? 'message'
    if (type === 'message') {
      const allowed = CONTENT_TYPES[it?.role]
      if (!allowed) { problems.push(`input[${i}]: message role ${JSON.stringify(it?.role)} is not accepted`); return }
      if (typeof it.content !== 'string') {
        if (!Array.isArray(it.content) || !it.content.length) problems.push(`input[${i}]: a ${it.role} message without content`)
        else for (const part of it.content) if (!allowed.includes(part?.type)) problems.push(`input[${i}]: content type ${JSON.stringify(part?.type)} in a ${it.role} message (allowed: ${allowed.join(', ')})`)
      }
    } else if (type === 'function_call') {
      if (!it.call_id) problems.push(`input[${i}]: function_call without call_id`)
      else if (calls.has(it.call_id)) problems.push(`input[${i}]: duplicate function_call ${it.call_id}`)
      else calls.set(it.call_id, i)
      if (!TOOL_NAME.test(String(it.name ?? ''))) problems.push(`input[${i}]: function name ${JSON.stringify(it.name)} does not match ^[a-zA-Z0-9_-]{1,64}$`)
      if (typeof it.arguments !== 'string') problems.push(`input[${i}]: function_call arguments must be a string`)
    } else if (type === 'function_call_output') {
      if (!calls.has(it.call_id)) problems.push(`input[${i}]: no tool call found for function call output with call_id ${it.call_id}`)
      else if (answered.has(it.call_id)) problems.push(`input[${i}]: a second output for ${it.call_id}`)
      answered.add(it.call_id)
      if (typeof it.output !== 'string' && !Array.isArray(it.output)) problems.push(`input[${i}]: function_call_output.output must be a string or an array`)
    } else if (type === 'reasoning') {
      const next = items[i + 1]
      const nextType = next?.type ?? (next ? 'message' : null)
      const follows = nextType === 'function_call' || nextType === 'reasoning' || (nextType === 'message' && next.role === 'assistant')
      if (!follows) problems.push(`input[${i}]: item ${JSON.stringify(it.id)} of type 'reasoning' was provided without its required following item`)
      if (it.encrypted_content !== undefined && typeof it.encrypted_content !== 'string') problems.push(`input[${i}]: reasoning encrypted_content must be a string`)
    } else {
      problems.push(`input[${i}]: item type ${JSON.stringify(type)} is not one this app should send`)
    }
  })
  for (const [id, i] of calls) if (!answered.has(id)) problems.push(`input[${i}]: no tool output found for function call ${id}`)
  for (const t of Array.isArray(tools) ? tools : []) {
    if (t?.type !== 'function') problems.push(`tool ${JSON.stringify(t?.name)}: type ${JSON.stringify(t?.type)} (only function tools)`)
    if (!TOOL_NAME.test(String(t?.name ?? ''))) problems.push(`tool name ${JSON.stringify(t?.name)} does not match ^[a-zA-Z0-9_-]{1,64}$`)
    if (t?.parameters && (typeof t.parameters !== 'object' || t.parameters.type !== 'object')) problems.push(`tool ${t.name}: parameters must be an object schema`)
  }
  return problems
}

/** The request-shape rules of the Sign in with ChatGPT preview (and of this app's policy). */
export function checkResponsesRequest (headers, body) {
  const problems = []
  const checks = {
    bearer: /^Bearer \S+/.test(String(headers.authorization ?? '')),
    store: body?.store === false,
    stream: body?.stream === true,
    inputArray: Array.isArray(body?.input),
    noSystemItems: true,
    forbiddenFields: [],
    forbiddenHeaders: FORBIDDEN_HEADERS.filter((h) => headers[h] !== undefined)
  }
  if (!body || typeof body !== 'object') problems.push('the body is not a JSON object')
  if (!checks.store) problems.push(`store must be false (got ${JSON.stringify(body?.store)})`)
  if (!checks.stream) problems.push(`stream must be true (got ${JSON.stringify(body?.stream)})`)
  if (!checks.inputArray) problems.push('input must be an array')
  if (typeof body?.model !== 'string' || !body.model) problems.push('model is missing')
  for (const it of checks.inputArray ? body.input : []) {
    if ((it?.type ?? 'message') === 'message' && it?.role === 'system') { checks.noSystemItems = false; problems.push('explicit {type:"message", role:"system"} items are rejected; use developer messages'); break }
  }
  if (checks.inputArray) {
    const structure = inputStructureProblems(body.input, body.tools)
    checks.structure = structure.length === 0
    problems.push(...structure)
  }
  if (body && typeof body === 'object') checks.forbiddenFields = SIWC_FORBIDDEN_FIELDS.filter((k) => Object.hasOwn(body, k))
  for (const k of checks.forbiddenFields) problems.push(`${k} is not supported with Sign in with ChatGPT`)
  for (const h of checks.forbiddenHeaders) problems.push(`the ${h} header presents the request as the Codex CLI`)
  return { checks, problems }
}

/** Responses SSE for a reply() result: a reasoning item, then the text / function_call items, then response.completed. */
export function responsesEvents (r, { model, respId, reasoning = {}, include = [], seq = 0 } = {}) {
  let n = seq
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, sequence_number: n++, ...data })}\n\n`
  const out = []
  const shell = { id: respId, object: 'response', created_at: Math.floor(Date.now() / 1000), status: 'in_progress', model, output: [] }
  out.push(ev('response.created', { response: shell }))
  out.push(ev('response.in_progress', { response: shell }))
  const output = []
  let oi = 0
  // reasoning first
  {
    const id = `rs_mock_${respId.slice(-6)}`
    const summaryOn = Boolean(reasoning?.summary)
    const item = { id, type: 'reasoning', summary: [] }
    out.push(ev('response.output_item.added', { output_index: oi, item }))
    const text = 'Looking at the request.'
    if (summaryOn) {
      out.push(ev('response.reasoning_summary_part.added', { item_id: id, output_index: oi, summary_index: 0, part: { type: 'summary_text', text: '' } }))
      out.push(ev('response.reasoning_summary_text.delta', { item_id: id, output_index: oi, summary_index: 0, delta: text }))
      out.push(ev('response.reasoning_summary_text.done', { item_id: id, output_index: oi, summary_index: 0, text }))
      out.push(ev('response.reasoning_summary_part.done', { item_id: id, output_index: oi, summary_index: 0, part: { type: 'summary_text', text } }))
    }
    const done = { id, type: 'reasoning', summary: summaryOn ? [{ type: 'summary_text', text }] : [] }
    if (include.includes('reasoning.encrypted_content')) done.encrypted_content = `enc_mock_${id}`
    out.push(ev('response.output_item.done', { output_index: oi, item: done }))
    output.push(done)
    oi++
  }
  for (const block of r.content) {
    if (block.type === 'text') {
      const id = `msg_mock_${respId.slice(-6)}_${oi}`
      out.push(ev('response.output_item.added', { output_index: oi, item: { id, type: 'message', role: 'assistant', status: 'in_progress', content: [] } }))
      out.push(ev('response.content_part.added', { item_id: id, output_index: oi, content_index: 0, part: { type: 'output_text', text: '', annotations: [] } }))
      const words = block.text.match(/\S+\s*/g) ?? [block.text]
      for (let i = 0; i < words.length; i += 3) out.push(ev('response.output_text.delta', { item_id: id, output_index: oi, content_index: 0, delta: words.slice(i, i + 3).join(''), logprobs: [] }))
      out.push(ev('response.output_text.done', { item_id: id, output_index: oi, content_index: 0, text: block.text, logprobs: [] }))
      const part = { type: 'output_text', text: block.text, annotations: [] }
      out.push(ev('response.content_part.done', { item_id: id, output_index: oi, content_index: 0, part }))
      const done = { id, type: 'message', role: 'assistant', status: 'completed', content: [part] }
      out.push(ev('response.output_item.done', { output_index: oi, item: done }))
      output.push(done)
    } else if (block.type === 'tool_use') {
      const id = `fc_mock_${respId.slice(-6)}_${oi}`
      const callId = block.id.replace(/^toolu_/, 'call_')
      const args = JSON.stringify(block.input)
      out.push(ev('response.output_item.added', { output_index: oi, item: { id, type: 'function_call', status: 'in_progress', call_id: callId, name: block.name, arguments: '' } }))
      const cut = Math.floor(args.length / 2)
      out.push(ev('response.function_call_arguments.delta', { item_id: id, output_index: oi, delta: args.slice(0, cut) }))
      out.push(ev('response.function_call_arguments.delta', { item_id: id, output_index: oi, delta: args.slice(cut) }))
      out.push(ev('response.function_call_arguments.done', { item_id: id, output_index: oi, arguments: args }))
      const done = { id, type: 'function_call', status: 'completed', call_id: callId, name: block.name, arguments: args }
      out.push(ev('response.output_item.done', { output_index: oi, item: done }))
      output.push(done)
    }
    oi++
  }
  const usage = { input_tokens: 120, input_tokens_details: { cached_tokens: 20 }, output_tokens: 30, output_tokens_details: { reasoning_tokens: 10 }, total_tokens: 150 }
  out.push(ev('response.completed', { response: { ...shell, status: 'completed', output, usage } }))
  return out
}

/** Some text, then response.failed server_is_overloaded (a failure after output: the adapter's error event mid-stream). */
function midStreamFailedEvents ({ model, respId }) {
  let n = 0
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, sequence_number: n++, ...data })}\n\n`
  const shell = { id: respId, object: 'response', status: 'in_progress', model, output: [] }
  const itemId = `msg_mock_${respId.slice(-6)}`
  return [
    ev('response.created', { response: shell }),
    ev('response.in_progress', { response: shell }),
    ev('response.output_item.added', { output_index: 0, item: { id: itemId, type: 'message', role: 'assistant', status: 'in_progress', content: [] } }),
    ev('response.content_part.added', { output_index: 0, item_id: itemId, content_index: 0, part: { type: 'output_text', text: '' } }),
    ...MID_FAIL_PARTIAL.map((delta) => ev('response.output_text.delta', { output_index: 0, item_id: itemId, content_index: 0, delta })),
    ev('response.failed', { response: { ...shell, status: 'failed', error: { code: 'server_is_overloaded', message: 'Our servers are currently overloaded. Please try again later.' } } })
  ]
}

const RATE_LIMITED = { code: 'rate_limit_exceeded', message: 'Rate limit reached for the model on this plan. Please try again in 1.2s.' }

/** A response that fails before any output (response.failed): a context overflow, or `error`. */
function overflowFailedEvents ({ model, respId, error }) {
  let n = 0
  const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, sequence_number: n++, ...data })}\n\n`
  const shell = { id: respId, object: 'response', status: 'in_progress', model, output: [] }
  return [
    ev('response.created', { response: shell }),
    ev('response.in_progress', { response: shell }),
    ev('response.failed', { response: { ...shell, status: 'failed', error: error ?? { code: 'context_length_exceeded', message: 'Your input exceeds the context window of this model. Please adjust your input and try again.' } } })
  ]
}

/** Sign in with ChatGPT's plan limit (report J §6: HTTP 429, error.code subscription_sharing_usage_limit_exceeded). */
const usageLimitError = () => ({ error: { message: 'You have reached the ChatGPT usage limit for this app.', type: 'usage_limit_reached', code: 'subscription_sharing_usage_limit_exceeded', plan_type: 'plus', resets_at: Math.floor(Date.now() / 1000) + 3600 } })
const CONTEXT_OVERFLOW = { error: { message: 'Your input exceeds the context window of this model. Please adjust your input and try again.', type: 'invalid_request_error', param: 'input', code: 'context_length_exceeded' } }

/** An unsigned (alg none) JWT: the page decodes it without a signature check. */
function fakeJwt (payload) {
  return `${b64url(JSON.stringify({ alg: 'none', typ: 'JWT' }))}.${b64url(JSON.stringify(payload))}.mock`
}

const short = (t) => (typeof t === 'string' ? `${t.slice(0, 12)}…(len ${t.length})` : t)

export function startMockApi ({ port = 0, host = '127.0.0.1', logFile = process.env.MOCK_LOG, strictCors = process.env.MOCK_STRICT_CORS !== '0', eventDelayMs = 3, anyBearer = process.env.MOCK_ANY_BEARER === '1', accessTtlS = 3600, earliestRefreshAt } = {}) {
  const requests = []
  let n = 0
  // the fake issuer's state
  const codes = new Map() // code -> {challenge, clientId, nonce, redirectUri, used}
  const accessTokens = new Map() // token -> {expiresAt, revoked, cors}
  const refreshTokens = new Map() // token -> {clientId, used, revoked}
  const encrypted = new Set() // reasoning encrypted_content this mock handed out
  let rateLimitHits = 0 // "hit the rate limit": odd requests fail, even ones are answered
  let midFailHits = 0 // "fail mid-stream": the same, failing after some output
  let tokenSeq = 0
  const log = (rec) => {
    requests.push(rec)
    if (logFile) {
      try { fs.appendFileSync(logFile, JSON.stringify(rec) + '\n') } catch (err) { console.error(`mock-api: cannot write ${logFile}: ${err.message}`) }
    }
  }

  const server = http.createServer((req, res) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks)
      const url = new URL(req.url, 'http://mock')
      const headers = {}
      for (const k of PICK_HEADERS) if (req.headers[k] !== undefined) headers[k] = req.headers[k]
      if (req.headers.authorization) headers.authorization = req.headers.authorization.slice(0, 20) + `…(len ${req.headers.authorization.length})`
      if (req.headers['x-api-key']) headers['x-api-key'] = req.headers['x-api-key'].slice(0, 12) + '…'
      const rec = { i: ++n, t: new Date().toISOString(), method: req.method, path: req.url, headers, headerNames: Object.keys(req.headers).sort() }
      const send = (status, body, extra = {}) => {
        res.writeHead(status, { 'content-type': 'application/json', 'request-id': `req_mock_${rec.i}`, ...corsHeaders(req), ...extra })
        res.end(typeof body === 'string' ? body : JSON.stringify(body))
      }

      // --- test endpoints (not logged) ---
      if (url.pathname === '/__requests') { n--; return send(200, requests) }
      if (url.pathname === '/__health') { n--; return send(200, { ok: true }) }
      if (url.pathname === '/__reset') { n--; requests.length = 0; rateLimitHits = 0; midFailHits = 0; return send(200, { ok: true }) }

      // --- CORS preflight ---
      if (req.method === 'OPTIONS') {
        const asked = String(req.headers['access-control-request-headers'] ?? '').toLowerCase()
        // strict like api.anthropic.com for the Messages API only; api.openai.com and auth.openai.com answer any origin
        const ok = !strictCors || !url.pathname.startsWith('/v1/messages') || asked.split(',').map((s) => s.trim()).includes('anthropic-dangerous-direct-browser-access')
        rec.preflight = { ok }
        log(rec)
        if (!ok) { res.writeHead(400, { 'content-type': 'text/plain' }); return res.end('Disallowed CORS request (mock: anthropic-dangerous-direct-browser-access was not requested)') }
        const h = {
          ...corsHeaders(req),
          'access-control-allow-methods': 'GET, POST, OPTIONS',
          'access-control-allow-headers': req.headers['access-control-request-headers'] ?? '*',
          'access-control-max-age': '600'
        }
        if (req.headers['access-control-request-private-network']) h['access-control-allow-private-network'] = 'true'
        res.writeHead(204, h)
        return res.end()
      }

      let body = null
      try { body = raw.length ? JSON.parse(raw.toString('utf8')) : null } catch { body = null }

      if (req.method === 'POST' && url.pathname === '/v1/messages/count_tokens') {
        rec.body = { bytes: raw.length }
        log(rec)
        return send(200, { input_tokens: Math.max(1, Math.round(raw.length / 4)) })
      }

      if (req.method === 'POST' && url.pathname === '/v1/messages') {
        if (!req.headers.authorization && !req.headers['x-api-key']) {
          rec.status = 401
          log(rec)
          return send(401, { type: 'error', error: { type: 'authentication_error', message: 'mock: no credentials (x-api-key or Authorization)' } })
        }
        const a = analyze(body)
        const r = reply(a)
        rec.body = { model: body?.model, stream: body?.stream, max_tokens: body?.max_tokens, nMessages: body?.messages?.length, nTools: body?.tools?.length, prompt: a.prompt.slice(0, 200) }
        rec.scenario = a.scenario
        rec.phase = a.phase
        rec.toolResults = a.toolResults.map((t) => ({ tool_use_id: t.tool_use_id, is_error: Boolean(t.is_error), text: toolResultText(t).slice(0, 400) }))
        if (r.status) {
          rec.status = r.status
          log(rec)
          return send(r.status, { type: 'error', error: r.error })
        }
        rec.status = 200
        rec.reply = { content: r.content, stop: r.stop, toolPresent: r.toolPresent, echoed: r.echoed }
        log(rec)
        const id = `msg_mock_${rec.i}`
        if (body?.stream === false) {
          return send(200, { id, type: 'message', role: 'assistant', model: body.model, content: r.content, stop_reason: r.stop, stop_sequence: null, usage: { input_tokens: 12, output_tokens: 7 } })
        }
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', 'request-id': `req_mock_${rec.i}`, ...corsHeaders(req) })
        return pumpEvents(res, rec, sseEvents(r, { model: body?.model, id }), r.delayMs ?? eventDelayMs)
      }

      if (url.pathname === '/__revoke-access' && req.method === 'POST') {
        n--
        const cors = url.searchParams.get('cors') !== '0'
        let k = 0
        for (const t of accessTokens.values()) if (!t.revoked) { t.revoked = true; t.cors = cors; k++ }
        return send(200, { ok: true, revoked: k, cors })
      }

      // --- the fake issuer -------------------------------------------------------
      if (req.method === 'GET' && url.pathname === '/api/accounts/authorize') {
        const q = Object.fromEntries(url.searchParams)
        const problems = []
        if (q.response_type !== 'code') problems.push('response_type must be code')
        const dynamic = q.client_id === 'dynamic_agent_client'
        if (!dynamic && q.client_id !== MOCK_CLIENT_ID) problems.push(`unknown client_id ${q.client_id}`)
        if (q.redirect_uri !== SIWC_REDIRECT_URI) problems.push(`redirect_uri must be ${SIWC_REDIRECT_URI}`)
        if (!String(q.scope ?? '').split(' ').includes('chatgpt.tokens.use.direct')) problems.push('scope lacks chatgpt.tokens.use.direct')
        if (q.resource !== SIWC_RESOURCE) problems.push(`resource must be ${SIWC_RESOURCE}`)
        if (q.code_challenge_method !== 'S256' || !/^[A-Za-z0-9_-]{43}$/.test(q.code_challenge ?? '')) problems.push('PKCE S256 code_challenge required')
        if (!q.state) problems.push('state required')
        if (!q.nonce) problems.push('nonce required')
        if (!/^urn:uuid:[0-9a-f-]{36}$/i.test(q.ext_agent_host_id ?? '')) problems.push('ext_agent_host_id must be a urn:uuid')
        if (dynamic && q.agent_name_hint !== 'claude-code-web') problems.push(`agent_name_hint must be claude-code-web on the first registration (got ${q.agent_name_hint})`)
        if (!dynamic && q.agent_name_hint !== undefined) problems.push('agent_name_hint is for the first registration only')
        for (const k of ['originator', 'codex_cli_simplified_flow']) if (q[k] !== undefined) problems.push(`${k} presents the sign-in as the Codex CLI`)
        rec.authorize = { clientId: q.client_id, agentNameHint: q.agent_name_hint, extAgentHostId: q.ext_agent_host_id, scope: q.scope, problems }
        if (problems.length) { rec.status = 400; log(rec); return send(400, { error: 'invalid_request', error_description: problems.join('; ') }) }
        const code = `mock_code_${++tokenSeq}_${b64url(randomBytes(6))}`
        codes.set(code, { challenge: q.code_challenge, clientId: MOCK_CLIENT_ID, nonce: q.nonce, redirectUri: q.redirect_uri, used: false })
        const location = `${q.redirect_uri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(q.state)}&client_id=${MOCK_CLIENT_ID}`
        rec.status = 302
        log(rec)
        res.writeHead(302, { location, ...corsHeaders(req) })
        return res.end()
      }

      if (req.method === 'POST' && url.pathname === '/api/accounts/oauth/token') {
        const f = Object.fromEntries(new URLSearchParams(raw.toString('utf8')))
        const fail = (status, code, message) => {
          rec.status = status
          rec.token.problem = code
          log(rec)
          return send(status, { error: { message, type: 'invalid_request_error', param: null, code } })
        }
        rec.token = { grant_type: f.grant_type, client_id: f.client_id, resource: f.resource, form: String(req.headers['content-type'] ?? '').startsWith('application/x-www-form-urlencoded') }
        if (!rec.token.form) return fail(400, 'invalid_request', 'the token endpoint takes a form-encoded body')
        if (f.client_id !== MOCK_CLIENT_ID) return fail(401, 'invalid_client', 'Invalid client specified.')
        if (f.resource !== SIWC_RESOURCE) return fail(400, 'invalid_target', `resource must be ${SIWC_RESOURCE}`)
        let nonce
        if (f.grant_type === 'authorization_code') {
          const c = codes.get(f.code)
          if (!c || c.used) return fail(401, 'token_expired', 'Could not validate your token. Please try signing in again.')
          c.used = true
          if (f.redirect_uri !== c.redirectUri) return fail(400, 'invalid_grant', 'redirect_uri does not match')
          if (!f.code_verifier || s256(f.code_verifier) !== c.challenge) return fail(400, 'invalid_grant', 'PKCE verification failed')
          rec.token.pkce = true
          nonce = c.nonce
        } else if (f.grant_type === 'refresh_token') {
          const r = refreshTokens.get(f.refresh_token)
          if (!r || r.revoked) return fail(401, 'invalid_refresh_token', 'Could not validate your refresh token. Please try signing in again.')
          if (r.used) return fail(401, 'refresh_token_reused', 'Your refresh token has already been used to generate a new access token. Please try signing in again.')
          r.used = true
          rec.token.refreshed = short(f.refresh_token)
        } else {
          return fail(400, 'unsupported_grant_type', `grant_type ${f.grant_type} is not supported`)
        }
        const at = `mock_at_${++tokenSeq}_${b64url(randomBytes(9))}`
        const rt = `mock_rt_${tokenSeq}_${b64url(randomBytes(9))}`
        accessTokens.set(at, { expiresAt: Date.now() + accessTtlS * 1000, revoked: false })
        refreshTokens.set(rt, { clientId: MOCK_CLIENT_ID, used: false, revoked: false })
        const now = Math.floor(Date.now() / 1000)
        const iss = `http://${req.headers.host}`
        const body = {
          access_token: at,
          refresh_token: rt,
          id_token: fakeJwt({ iss, aud: MOCK_CLIENT_ID, sub: 'user-mock', email: 'e2e@example.com', iat: now, exp: now + accessTtlS, ...(nonce ? { nonce } : {}), 'https://api.openai.com/auth': { chatgpt_plan_type: 'plus' } }),
          token_type: 'Bearer',
          expires_in: accessTtlS,
          scope: SIWC_SCOPE
        }
        if (earliestRefreshAt !== undefined) body.earliest_refresh_at = earliestRefreshAt
        rec.status = 200
        rec.token.issued = { access: short(at), refresh: short(rt) }
        log(rec)
        return send(200, body)
      }

      if (req.method === 'POST' && url.pathname === '/api/accounts/oauth/revoke') {
        const f = Object.fromEntries(new URLSearchParams(raw.toString('utf8')))
        const r = refreshTokens.get(f.token)
        if (r) r.revoked = true
        rec.revoke = { client_id: f.client_id, known: Boolean(r), token_type_hint: f.token_type_hint }
        rec.status = 200
        log(rec)
        return send(200, {})
      }

      // --- the Responses API and the model list ------------------------------------
      const bearerState = () => {
        const m = /^Bearer (\S+)$/.exec(String(req.headers.authorization ?? ''))
        if (!m) return { ok: false, status: 401, cors: true, body: { error: { message: 'Missing bearer or basic authentication in header', type: 'invalid_request_error', param: null, code: null } } }
        const t = accessTokens.get(m[1])
        if (!t) {
          if (anyBearer) return { ok: true, known: false }
          return { ok: false, status: 401, cors: false, body: { error: { message: 'Your authentication token is not from a valid issuer.', type: 'invalid_request_error', param: null, code: 'invalid_issuer' }, status: 401 } }
        }
        if (t.revoked) return { ok: false, status: 401, cors: t.cors !== false, body: { error: { message: 'Your authentication token has been invalidated. Please try signing in again.', type: 'invalid_request_error', param: null, code: 'token_invalidated' } } }
        if (t.expiresAt < Date.now()) return { ok: false, status: 401, cors: false, body: { error: { message: 'Your authentication token has expired. Please try signing in again.', type: 'invalid_request_error', param: null, code: 'token_expired' } } }
        return { ok: true, known: true }
      }
      const refuse = (b) => {
        rec.status = b.status
        log(rec)
        // OpenAI's edge layer answers a bad token without CORS headers (K §1c)
        res.writeHead(b.status, { 'content-type': b.cors ? 'application/json' : 'text/plain', ...(b.cors ? corsHeaders(req) : {}) })
        return res.end(JSON.stringify(b.body))
      }

      if (req.method === 'GET' && url.pathname === '/v1/models') {
        const b = bearerState()
        rec.bearerKnown = Boolean(b.known)
        if (!b.ok) return refuse(b)
        rec.status = 200
        log(rec)
        return send(200, { models: MOCK_MODELS })
      }

      if (req.method === 'POST' && url.pathname === '/v1/responses') {
        const b = bearerState()
        const { checks, problems } = checkResponsesRequest(req.headers, body)
        checks.bearerKnown = Boolean(b.known)
        rec.checks = checks
        rec.problems = problems
        const a = analyzeResponses(body)
        rec.body = { model: body?.model, stream: body?.stream, store: body?.store, nInput: body?.input?.length, nTools: body?.tools?.length, include: body?.include, reasoning: body?.reasoning, tool_choice: body?.tool_choice, prompt: a.prompt.slice(0, 200) }
        rec.scenario = a.scenario
        rec.phase = a.phase
        rec.toolResults = a.toolResults.map((t) => ({ tool_use_id: t.tool_use_id, is_error: Boolean(t.is_error), text: toolResultText(t).slice(0, 400) }))
        rec.reasoningReplayed = a.reasoning.map((r) => ({ id: r.id, encrypted: typeof r.encrypted_content === 'string', known: encrypted.has(r.encrypted_content) }))
        if (!b.ok) return refuse(b)
        if (problems.length) {
          rec.status = 400
          log(rec)
          const param = checks.forbiddenFields[0] ?? null
          return send(400, { error: { message: `mock: ${problems.join('; ')}`, type: 'invalid_request_error', param, code: param ? 'subscription_sharing_unsupported_capability' : 'invalid_request' } })
        }
        const respId = `resp_mock_${rec.i}_${b64url(randomBytes(4))}`
        if (a.scenario === 'overflow') { rec.status = 400; log(rec); return send(400, CONTEXT_OVERFLOW) }
        if (a.scenario === 'usage-limit') { rec.status = 429; log(rec); return send(429, usageLimitError()) }
        if (a.scenario === 'unknown') {
          rec.status = 400
          log(rec)
          return send(400, { error: { message: 'mock: no scenario for this prompt; try "say hi", "use the weather tool" or "write a file"', type: 'invalid_request_error', param: 'input', code: 'mock_no_scenario' } })
        }
        let events
        let r = null
        if (a.scenario === 'overflow-stream') { events = overflowFailedEvents({ model: body.model, respId }); rec.failed = 'context_length_exceeded' }
        else if (a.scenario === 'rate-limit' && ++rateLimitHits % 2 === 1) { events = overflowFailedEvents({ model: body.model, respId, error: RATE_LIMITED }); rec.failed = RATE_LIMITED.code }
        else if (a.scenario === 'mid-fail' && ++midFailHits % 2 === 1) { events = midStreamFailedEvents({ model: body.model, respId }); rec.failed = 'server_is_overloaded' }
        else {
          r = reply(a)
          if (r.status) {
            rec.status = 400
            log(rec)
            return send(400, { error: { message: r.error.message, type: 'invalid_request_error', param: 'input', code: 'mock_bad_follow_up' } })
          }
          events = responsesEvents(r, { model: body.model, respId, reasoning: body.reasoning, include: Array.isArray(body.include) ? body.include : [] })
          for (const e of events) { const m = /"encrypted_content":"([^"]+)"/.exec(e); if (m) encrypted.add(m[1]) }
          rec.reply = { content: r.content.map((c) => (c.type === 'tool_use' ? { ...c, id: c.id.replace(/^toolu_/, 'call_') } : c)), stop: r.stop, toolPresent: r.toolPresent, echoed: r.echoed }
        }
        rec.status = 200
        log(rec)
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', 'x-request-id': `req_mock_${rec.i}`, ...corsHeaders(req) })
        return pumpEvents(res, rec, events, r?.delayMs ?? eventDelayMs)
      }

      rec.status = 404
      log(rec)
      return send(404, { type: 'error', error: { type: 'not_found_error', message: `mock: no route for ${req.method} ${url.pathname}` } })
    })
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => {
      const actual = server.address().port
      resolve({
        server,
        port: actual,
        url: `http://${host}:${actual}`,
        requests,
        reset () { requests.length = 0 },
        close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()) })
      })
    })
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] ?? process.env.MOCK_PORT ?? 18080)
  const mock = await startMockApi({ port })
  console.log(`mock API on ${mock.url}${process.env.MOCK_LOG ? ` (log: ${process.env.MOCK_LOG})` : ''}`)
  console.log('Set the page\'s base URL to it. Prompts: "say hi", "use the weather tool", "write a file".')
  console.log(`ChatGPT mode: Settings -> ChatGPT subscription -> Advanced: API base URL ${mock.url}/v1, issuer ${mock.url}.`)
}
