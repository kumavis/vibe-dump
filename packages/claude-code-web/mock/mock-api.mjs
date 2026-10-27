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
//       anything else          -> 401 authentication_error
//   - POST /v1/messages/count_tokens -> {input_tokens}
//   - GET /__requests -> the logged requests (JSON array); POST /__reset clears them
//   - GET /__health -> {ok: true}
//
// Importable: startMockApi({port, logFile}) -> {url, port, requests, reset(), close()}.

import http from 'node:http'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

const PICK_HEADERS = ['anthropic-beta', 'anthropic-version', 'user-agent', 'x-app', 'anthropic-dangerous-direct-browser-access',
  'content-type', 'origin', 'referer', 'x-claude-code-session-id', 'x-stainless-lang', 'x-stainless-runtime',
  'x-stainless-package-version', 'access-control-request-method', 'access-control-request-headers']

const WRITE_PATH = process.env.MOCK_WRITE_PATH || '/home/user/workspace/hello.txt'
const WRITE_CONTENT = 'hello from the mock API\n'

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
  const scenario = /use the weather tool/i.test(prompt) ? 'weather' : /write a file/i.test(prompt) ? 'write' : /say hi/i.test(prompt) ? 'hi' : 'unknown'
  const toolNames = Array.isArray(body?.tools) ? body.tools.map((t) => t?.name).filter(Boolean) : []
  return { scenario, prompt, phase: toolResults.length ? 'follow-up' : 'first', toolUses, toolResults, toolNames }
}

/** The assistant reply for a request, as content blocks + stop reason, or an HTTP error. */
export function reply (a) {
  if (a.scenario === 'unknown') {
    return { status: 401, error: { type: 'authentication_error', message: 'Invalid bearer token (mock: no scenario for this prompt; try "say hi", "use the weather tool" or "write a file")' } }
  }
  if (a.scenario === 'hi') return { content: [{ type: 'text', text: 'hi from the mock API' }], stop: 'end_turn' }
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

function corsHeaders (req) {
  return {
    'access-control-allow-origin': '*',
    'access-control-expose-headers': '*',
    vary: 'Origin'
  }
}

export function startMockApi ({ port = 0, host = '127.0.0.1', logFile = process.env.MOCK_LOG, strictCors = process.env.MOCK_STRICT_CORS !== '0', eventDelayMs = 3 } = {}) {
  const requests = []
  let n = 0
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
      if (url.pathname === '/__reset') { n--; requests.length = 0; return send(200, { ok: true }) }

      // --- CORS preflight ---
      if (req.method === 'OPTIONS') {
        const asked = String(req.headers['access-control-request-headers'] ?? '').toLowerCase()
        const ok = !strictCors || !url.pathname.startsWith('/v1/') || asked.split(',').map((s) => s.trim()).includes('anthropic-dangerous-direct-browser-access')
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
        const events = sseEvents(r, { model: body?.model, id })
        let k = 0
        const pump = () => {
          if (k >= events.length) return res.end()
          res.write(events[k++])
          setTimeout(pump, eventDelayMs)
        }
        return pump()
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
}
