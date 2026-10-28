// The "ChatGPT subscription" provider, Worker side (ARCHITECTURE.md
// Appendix A; design in report J §7). Claude Code runs unmodified with
// ANTHROPIC_BASE_URL set to a synthetic origin; this module wraps the
// Worker's fetch on top of the egress guard and answers every request for
// that origin locally:
//
//   POST /v1/messages, stream: true   -> OpenAI Responses (Sign in with ChatGPT
//                                        bearer, api.openai.com/v1/responses),
//                                        its SSE translated to Anthropic SSE
//   POST /v1/messages, no stream       -> the same upstream stream, aggregated
//                                        into one Anthropic Message
//   max_tokens <= 1 probes             -> a canned reply, no upstream call
//   POST /v1/messages/count_tokens     -> {input_tokens: ceil(bytes / 4)}
//   anything else                      -> 404
//
// Upstream requests go through the fetch this adapter wrapped (the egress
// guard's), with the harness's AbortSignal, and carry only authorization,
// content-type and accept: nothing presents as the Codex CLI (no
// originator, chatgpt-account-id or Codex User-Agent). The access token
// comes from the page through `getToken` (boot.js wires it to the token
// handoff in ./openai/token.js); it is never logged.

import { OPENAI_ADAPTER_ORIGIN } from './policy.js'
import { mapUpstreamError, STATUS_OF_TYPE } from './openai/errors.js'
import { toResponsesRequest } from './openai/request.js'
import { aggregateAnthropicEvents, createResponsesToAnthropicStream, isFailureEvent, isPreambleEvent, translateResponsesSse } from './openai/stream.js'
import { ProviderTokenError } from './openai/token.js'
import { createSseParser, estimateTokens, parseSseJson, randomId, sseEvent } from './openai/util.js'

export { toResponsesRequest, FORBIDDEN_FIELDS, encodeReasoningSignature, decodeReasoningSignature, cleanSchema, shortenName, clampEffort } from './openai/request.js'
export { createResponsesToAnthropicStream, aggregateAnthropicEvents, translateResponsesSse, ResponsesToAnthropic } from './openai/stream.js'
export { mapUpstreamError, anthropicError, parseUpstreamError } from './openai/errors.js'
export { createTokenBroker, ProviderTokenError } from './openai/token.js'

const json = (status, obj, headers = {}) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...headers } })
const errorBody = (type, message) => ({ type: 'error', error: { type, message } })

function abortError (signal) {
  return signal?.reason ?? new DOMException('This operation was aborted', 'AbortError')
}
const isAbort = (err, signal) => signal?.aborted || err?.name === 'AbortError'

/** Settle with `promise`, or reject as soon as `signal` aborts. */
function withAbort (promise, signal) {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(abortError(signal))
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(abortError(signal))
    signal.addEventListener('abort', onAbort, { once: true })
    promise.then((v) => { signal.removeEventListener('abort', onAbort); resolve(v) }, (e) => { signal.removeEventListener('abort', onAbort); reject(e) })
  })
}

/** The request's URL, method, headers, body text and signal, for a string/URL/Request input. */
async function readRequest (input, init) {
  const isReq = input && typeof input === 'object' && !(input instanceof URL) && typeof input.url === 'string'
  const headers = new Headers(init?.headers ?? (isReq ? input.headers : undefined))
  const method = String(init?.method ?? (isReq ? input.method : 'GET')).toUpperCase()
  const signal = init?.signal ?? (isReq ? input.signal : undefined)
  let bytes = null
  let text = ''
  const body = init?.body
  if (body === undefined || body === null) {
    if (isReq && typeof input.arrayBuffer === 'function' && method !== 'GET' && method !== 'HEAD') bytes = new Uint8Array(await input.clone().arrayBuffer())
  } else if (typeof body === 'string') {
    text = body
  } else if (body instanceof ArrayBuffer) {
    bytes = new Uint8Array(body)
  } else if (ArrayBuffer.isView(body)) {
    bytes = new Uint8Array(body.buffer, body.byteOffset, body.byteLength)
  } else {
    bytes = new Uint8Array(await new Response(body).arrayBuffer())
  }
  if (bytes) {
    if (/gzip/i.test(headers.get('content-encoding') || '')) {
      bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())
    }
    text = new TextDecoder().decode(bytes)
  }
  return { headers, method, signal, text }
}

/**
 * Read upstream SSE until the first event that is not preamble
 * (response.created / in_progress / metadata), so a failure that arrives
 * before any output can become a proper HTTP error (Claude Code compacts on
 * a 400 "prompt is too long", and honours x-should-retry on 429s).
 */
async function lookahead (body) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  const parser = createSseParser()
  const chunks = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) {
      for (const e of parser.end()) {
        const obj = parseSseJson(e)
        if (obj && !isPreambleEvent(obj)) return { reader, chunks, first: obj, ended: true }
      }
      return { reader, chunks, first: null, ended: true }
    }
    chunks.push(value)
    for (const e of parser.push(decoder.decode(value, { stream: true }))) {
      const obj = parseSseJson(e)
      if (obj && !isPreambleEvent(obj)) return { reader, chunks, first: obj, ended: false }
    }
  }
}

/** The chunks already read, then the rest of the reader; cancel goes upstream. */
function replay (chunks, reader, ended) {
  return new ReadableStream({
    start (c) {
      for (const ch of chunks) c.enqueue(ch)
      if (ended) c.close()
    },
    async pull (c) {
      const { value, done } = await reader.read()
      if (done) c.close()
      else c.enqueue(value)
    },
    cancel (reason) { return reader.cancel(reason) }
  })
}

/** The canned answer to a max_tokens <= 1 probe (api_key_verify, quota_check): no upstream call. */
function cannedProbe (req, inputTokens, headers) {
  const message = {
    id: randomId('msg_'),
    type: 'message',
    role: 'assistant',
    model: req.model ?? 'unknown',
    content: [{ type: 'text', text: 'ok' }],
    stop_reason: 'max_tokens',
    stop_sequence: null,
    usage: { input_tokens: inputTokens, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
  }
  if (!req.stream) return json(200, message, headers)
  const events = [
    { type: 'message_start', message: { ...message, content: [], stop_reason: null, usage: { ...message.usage, output_tokens: 0 } } },
    { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
    { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } },
    { type: 'content_block_stop', index: 0 },
    { type: 'message_delta', delta: { stop_reason: 'max_tokens', stop_sequence: null }, usage: { output_tokens: 1 } },
    { type: 'message_stop' }
  ]
  return new Response(events.map(sseEvent).join(''), { status: 200, headers: { 'content-type': 'text/event-stream; charset=utf-8', ...headers } })
}

/**
 * Wrap scope.fetch (already wrapped by the egress guard) so the synthetic
 * origin is answered locally.
 * @param {object} scope   the Worker global (or a stand-in in tests)
 * @param {object} o
 * @param {{kind: 'openai-responses', baseUrl: string, model: string, effort?: string, efforts?: string[], contextWindow?: number|null, smallModel?: string}} o.provider
 * @param {(o?: {failedToken?: string, ambiguous?: boolean}) => Promise<{accessToken: string, expiresAt?: number}|null>} o.getToken
 *        no argument: a usable token; with `failedToken`: a replacement after upstream rejected it (null: none)
 * @param {Function} [o.nativeFetch]     the fetch upstream requests use (default: scope.fetch as it is now, i.e. the guarded one)
 * @param {string} [o.syntheticOrigin]   default OPENAI_ADAPTER_ORIGIN
 * @param {(msg: string) => void} [o.log]   per-request diagnostics (no secrets, no bodies)
 * @param {(msg: string) => void} [o.warn]  upstream failures
 * @param {number} [o.pingMs]           Anthropic `ping` after this much upstream silence (default 15 s)
 * @returns {{origin: string, endpoint: string, stats: object}}
 */
export function installOpenAIAdapter (scope, { provider, getToken, nativeFetch, syntheticOrigin = OPENAI_ADAPTER_ORIGIN, log = () => {}, warn = () => {}, pingMs = 15_000 } = {}) {
  if (!provider || provider.kind !== 'openai-responses') throw new TypeError('installOpenAIAdapter: provider.kind must be "openai-responses"')
  if (typeof getToken !== 'function') throw new TypeError('installOpenAIAdapter: getToken is required')
  const next = scope.fetch
  const upstreamFetch = nativeFetch ?? next
  if (typeof upstreamFetch !== 'function') throw new TypeError('installOpenAIAdapter: no fetch to wrap')
  const origin = new URL(syntheticOrigin).origin
  const endpoint = `${String(provider.baseUrl).replace(/\/+$/, '')}/responses`
  const stats = { messages: 0, upstream: 0, canned: 0, countTokens: 0, notFound: 0, retried401: 0, retriedNetwork: 0 }

  async function callUpstream (bodyText, signal) {
    let tok = await withAbort(getToken(), signal)
    if (!tok?.accessToken) throw new ProviderTokenError('no ChatGPT access token')
    for (let attempt = 0; ; attempt++) {
      let res
      stats.upstream++
      try {
        res = await upstreamFetch.call(scope, endpoint, {
          method: 'POST',
          headers: { authorization: `Bearer ${tok.accessToken}`, 'content-type': 'application/json', accept: 'text/event-stream' },
          body: bodyText,
          signal
        })
      } catch (err) {
        // A rejected token at OpenAI's edge comes back without CORS headers,
        // i.e. as a TypeError (report K §1c): renew once, retry once.
        if (isAbort(err, signal) || err?.code === 'EGRESS_REFUSED' || attempt > 0) throw err
        const fresh = await withAbort(getToken({ failedToken: tok.accessToken, ambiguous: true }), signal)
        if (!fresh?.accessToken || fresh.accessToken === tok.accessToken) throw err
        stats.retriedNetwork++
        tok = fresh
        continue
      }
      if (res.status !== 401 || attempt > 0) return res
      const text = await res.text().catch(() => '')
      const fresh = await withAbort(getToken({ failedToken: tok.accessToken }), signal).catch((err) => {
        if (isAbort(err, signal)) throw err
        return null
      })
      if (!fresh?.accessToken || fresh.accessToken === tok.accessToken) return new Response(text, { status: 401 })
      stats.retried401++
      tok = fresh
    }
  }

  async function messages (req, text, headers, signal) {
    stats.messages++
    const rid = { 'request-id': randomId('req_adapter_') }
    const estimate = estimateTokens(text)
    if (Number(req.max_tokens) <= 1) {
      stats.canned++
      return cannedProbe(req, estimate, rid)
    }
    let translated
    try {
      translated = toResponsesRequest(req, { model: provider.model, smallModel: provider.smallModel, effort: provider.effort, efforts: provider.efforts, sessionId: headers.get('x-claude-code-session-id') || undefined })
    } catch (err) {
      return json(400, errorBody('invalid_request_error', `the ChatGPT adapter could not translate the request: ${err?.message ?? err}`), { 'x-should-retry': 'false', ...rid })
    }
    const upstreamBody = JSON.stringify(translated.body)
    const inputTokens = estimateTokens(upstreamBody)
    const ctx = { model: provider.model, contextWindow: provider.contextWindow ?? undefined, inputTokens }
    const t0 = Date.now()
    let res
    try {
      res = await callUpstream(upstreamBody, signal)
    } catch (err) {
      if (err instanceof ProviderTokenError || err?.name === 'ProviderTokenError') {
        warn(`openai-adapter: no ChatGPT token: ${err.message}`)
        return json(401, errorBody('authentication_error', `Not signed in with ChatGPT: ${err.message}. Sign in with ChatGPT in Settings.`), { 'x-should-retry': 'false', ...rid })
      }
      if (!isAbort(err, signal)) warn(`openai-adapter: POST ${endpoint} failed: ${err?.message ?? err}`)
      throw err // AbortError for an interrupt; TypeError: the SDK's connection-error retry applies
    }
    log(`openai-adapter: POST ${endpoint} (${translated.body.model}, ${translated.body.input.length} input items, ${translated.body.tools?.length ?? 0} tools, ~${inputTokens} tokens) -> ${res.status} in ${Date.now() - t0} ms`)
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      const m = mapUpstreamError(res.status, body, ctx)
      warn(`openai-adapter: upstream HTTP ${res.status} -> ${m.status} ${m.body.error.type}: ${m.body.error.message}`)
      return json(m.status, m.body, { ...m.headers, ...rid })
    }
    if (!res.body) return json(529, errorBody('overloaded_error', 'the ChatGPT response had no body'), rid)
    const { reader, chunks, first, ended } = await lookahead(res.body)
    if (!first) {
      reader.cancel().catch(() => {})
      return json(529, errorBody('overloaded_error', 'The ChatGPT stream closed before any output'), rid)
    }
    if (isFailureEvent(first)) {
      reader.cancel().catch(() => {})
      const m = mapUpstreamError(undefined, first, ctx)
      warn(`openai-adapter: upstream ${first.type} -> ${m.status} ${m.body.error.type}: ${m.body.error.message}`)
      return json(m.status, m.body, { ...m.headers, ...rid })
    }
    const opts = { model: req.model, idMap: translated.idMap, inputTokens, contextWindow: provider.contextWindow ?? undefined }
    if (req.stream) {
      const body = replay(chunks, reader, ended)
        .pipeThrough(createResponsesToAnthropicStream({ ...opts, pingMs }))
        .pipeThrough(new TextEncoderStream())
      return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', ...rid } })
    }
    const all = await new Response(replay(chunks, reader, ended)).text()
    const result = aggregateAnthropicEvents(translateResponsesSse(all, opts))
    if (result.error) return json(STATUS_OF_TYPE[result.error.type] ?? 500, errorBody(result.error.type, result.error.message), rid)
    return json(200, result.message, rid)
  }

  async function handle (url, input, init) {
    const { headers, method, signal, text } = await readRequest(input, init)
    if (signal?.aborted) throw abortError(signal)
    const path = url.pathname.replace(/\/+$/, '')
    if (method === 'POST' && path === '/v1/messages/count_tokens') {
      stats.countTokens++
      return json(200, { input_tokens: estimateTokens(text) })
    }
    if (method === 'POST' && path === '/v1/messages') {
      let req
      try { req = JSON.parse(text) } catch { return json(400, errorBody('invalid_request_error', 'the request body is not JSON'), { 'x-should-retry': 'false' }) }
      if (!req || typeof req !== 'object') return json(400, errorBody('invalid_request_error', 'the request body is not an object'), { 'x-should-retry': 'false' })
      return messages(req, text, headers, signal)
    }
    stats.notFound++
    log(`openai-adapter: ${method} ${url.pathname} -> 404`)
    return json(404, errorBody('not_found_error', `${method} ${url.pathname} is not served in ChatGPT mode`))
  }

  scope.fetch = function fetch (input, init) {
    let url = null
    try {
      const raw = typeof input === 'string' || input instanceof URL ? String(input) : input?.url
      url = new URL(raw)
    } catch { /* relative or invalid: not ours */ }
    if (!url || url.origin !== origin) return next.call(this, input, init)
    return handle(url, input, init)
  }
  return { origin, endpoint, stats }
}
