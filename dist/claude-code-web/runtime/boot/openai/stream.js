// OpenAI Responses SSE -> Anthropic Messages SSE (report J §7.6 state
// machine), plus the aggregator that turns the result into one Anthropic
// Message for non-streaming calls.
//
// Anthropic needs strictly sequential, non-overlapping content blocks.
// Responses output items arrive in output_index order and do not
// interleave in practice; events for another output_index that arrive while
// an item is open are held back until that item's output_item.done
// (CLIProxyAPI's "deferred events" idea).

import { anthropicErrorEvent } from './errors.js'
import { encodeReasoningSignature } from './request.js'
import { createSseParser, parseSseJson, randomId, sseEvent } from './util.js'

const PREAMBLE = new Set(['response.created', 'response.in_progress', 'response.queued', 'response.metadata', 'codex.response.metadata', 'codex.rate_limits', 'keepalive'])
const TERMINAL = new Set(['response.completed', 'response.done', 'response.incomplete', 'response.failed', 'error'])

/** True for upstream events that only set up the response (no output, no outcome). */
export const isPreambleEvent = (ev) => PREAMBLE.has(ev?.type)
/** True for upstream events that fail the response. */
export const isFailureEvent = (ev) => ev?.type === 'error' || ev?.type === 'response.failed'

export class ResponsesToAnthropic {
  /**
   * @param {object} o
   * @param {string} o.model           the model name Claude Code asked for (echoed back)
   * @param {{model?: string, toolNames?: Map<string,string>}} [o.idMap]  from toResponsesRequest
   * @param {number} [o.inputTokens]   the local estimate for message_start
   * @param {number} [o.contextWindow] for the "prompt is too long" message
   * @param {string} [o.messageId]
   */
  constructor ({ model, idMap, inputTokens = 0, contextWindow, messageId } = {}) {
    this.model = model ?? 'unknown'
    this.upstreamModel = idMap?.model
    this.toolNames = idMap?.toolNames ?? new Map()
    this.inputTokens = inputTokens
    this.contextWindow = contextWindow
    this.messageId = messageId ?? randomId('msg_')
    this.index = -1
    this.cur = null // the open output item: {outputIndex, type, itemId, block, sawDelta, summaryIndex, callId}
    this.deferred = []
    this.sawToolCall = false
    this.started = false
    this.finished = false
    this.responseId = undefined
  }

  start () {
    if (this.started) return []
    this.started = true
    return [{
      type: 'message_start',
      message: {
        id: this.messageId,
        type: 'message',
        role: 'assistant',
        model: this.model,
        content: [],
        stop_reason: null,
        stop_sequence: null,
        usage: { input_tokens: this.inputTokens, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
      }
    }]
  }

  /** One parsed Responses event in, Anthropic event objects out. */
  handle (ev) {
    if (this.finished || !ev || typeof ev !== 'object') return []
    const out = this.start()
    if (TERMINAL.has(ev.type)) {
      // flush whatever was held back, then end
      const held = this.deferred.splice(0)
      for (const d of held) out.push(...this.#item(d))
      out.push(...this.#terminal(ev))
      return out
    }
    if (this.cur && ev.output_index !== undefined && ev.output_index !== this.cur.outputIndex) {
      this.deferred.push(ev)
      return out
    }
    out.push(...this.#item(ev))
    // replay held-back events in order, up to the first one for an item
    // other than the (newly) open one
    while (this.deferred.length && !this.finished) {
      const next = this.deferred[0]
      if (this.cur && next.output_index !== undefined && next.output_index !== this.cur.outputIndex) break
      this.deferred.shift()
      out.push(...this.#item(next))
    }
    return out
  }

  /** Upstream EOF. */
  end () {
    if (this.finished) return []
    const out = this.start()
    out.push(...this.#closeOpen())
    out.push({ type: 'error', error: { type: 'overloaded_error', message: 'The ChatGPT stream closed before response.completed' } })
    this.finished = true
    return out
  }

  #startBlock (block) {
    this.index++
    this.cur.block = { index: this.index, kind: block.type }
    return { type: 'content_block_start', index: this.index, content_block: block }
  }

  #closeOpen () {
    const out = []
    if (this.cur?.block) out.push({ type: 'content_block_stop', index: this.cur.block.index })
    this.cur = null
    return out
  }

  #ensureThinking (out) {
    if (!this.cur.block) out.push(this.#startBlock({ type: 'thinking', thinking: '', signature: '' }))
  }

  #ensureText (out) {
    if (!this.cur.block) out.push(this.#startBlock({ type: 'text', text: '' }))
  }

  #open (item, outputIndex) {
    const out = this.#closeOpen()
    this.cur = { outputIndex, type: item?.type, itemId: item?.id, block: null, sawDelta: false, summaryIndex: -1 }
    if (item?.type === 'function_call') {
      this.sawToolCall = true
      const name = this.toolNames.get(item.name) ?? item.name
      out.push(this.#startBlock({ type: 'tool_use', id: anthropicToolId(item.call_id ?? item.id), name, input: {} }))
    }
    return out
  }

  #item (ev) {
    const out = []
    switch (ev.type) {
      case 'response.output_item.added':
        out.push(...this.#open(ev.item, ev.output_index))
        break
      case 'response.reasoning_summary_part.added':
      case 'response.reasoning_summary_text.delta':
      case 'response.reasoning_text.delta': {
        if (!this.cur) this.cur = { outputIndex: ev.output_index, type: 'reasoning', block: null, sawDelta: false, summaryIndex: -1 }
        if (this.cur.type !== 'reasoning') break
        const si = ev.summary_index ?? ev.content_index ?? 0
        if (ev.type === 'response.reasoning_summary_part.added') {
          if (this.cur.block && si !== this.cur.summaryIndex && this.cur.sawDelta) { out.push(thinkingDelta(this.cur.block.index, '\n\n')); this.cur.summaryIndex = si }
          break
        }
        if (!ev.delta) break
        this.#ensureThinking(out)
        if (this.cur.sawDelta && si !== this.cur.summaryIndex) out.push(thinkingDelta(this.cur.block.index, '\n\n'))
        this.cur.summaryIndex = si
        this.cur.sawDelta = true
        out.push(thinkingDelta(this.cur.block.index, ev.delta))
        break
      }
      case 'response.output_text.delta':
      case 'response.refusal.delta': {
        if (!this.cur) this.cur = { outputIndex: ev.output_index, type: 'message', block: null, sawDelta: false }
        if (this.cur.type !== 'message' || !ev.delta) break
        this.#ensureText(out)
        this.cur.sawDelta = true
        out.push({ type: 'content_block_delta', index: this.cur.block.index, delta: { type: 'text_delta', text: ev.delta } })
        break
      }
      case 'response.function_call_arguments.delta': {
        if (this.cur?.type !== 'function_call' || !this.cur.block || !ev.delta) break
        this.cur.sawDelta = true
        out.push({ type: 'content_block_delta', index: this.cur.block.index, delta: { type: 'input_json_delta', partial_json: ev.delta } })
        break
      }
      case 'response.output_item.done':
        out.push(...this.#done(ev.item, ev.output_index))
        break
      default:
        break // content_part.*, *.done text events, web_search_call.*, metadata, ...
    }
    return out
  }

  #done (item, outputIndex) {
    const out = []
    if (!this.cur || this.cur.outputIndex !== outputIndex) out.push(...this.#open(item, outputIndex))
    switch (item?.type) {
      case 'reasoning': {
        const text = Array.isArray(item.summary) ? item.summary.map((s) => s?.text ?? '').filter(Boolean).join('\n\n') : ''
        if (!this.cur.block && !item.encrypted_content && !text) break // nothing worth a block
        this.#ensureThinking(out)
        if (!this.cur.sawDelta && text) out.push(thinkingDelta(this.cur.block.index, text))
        if (item.encrypted_content) {
          const signature = encodeReasoningSignature({ id: item.id ?? this.cur.itemId, encrypted_content: item.encrypted_content, model: this.upstreamModel })
          out.push({ type: 'content_block_delta', index: this.cur.block.index, delta: { type: 'signature_delta', signature } })
        }
        break
      }
      case 'message': {
        if (!this.cur.sawDelta) {
          const text = (Array.isArray(item.content) ? item.content : []).map((c) => (c?.type === 'output_text' ? c.text : c?.type === 'refusal' ? c.refusal : '') ?? '').join('')
          if (text) {
            this.#ensureText(out)
            out.push({ type: 'content_block_delta', index: this.cur.block.index, delta: { type: 'text_delta', text } })
          }
        }
        break
      }
      case 'function_call': {
        if (!this.cur.block) {
          this.sawToolCall = true
          out.push(this.#startBlock({ type: 'tool_use', id: anthropicToolId(item.call_id ?? item.id), name: this.toolNames.get(item.name) ?? item.name, input: {} }))
        }
        if (!this.cur.sawDelta) out.push({ type: 'content_block_delta', index: this.cur.block.index, delta: { type: 'input_json_delta', partial_json: item.arguments || '{}' } })
        break
      }
      default:
        break
    }
    out.push(...this.#closeOpen())
    return out
  }

  #usage (u) {
    const input = Number(u?.input_tokens ?? 0)
    const cached = Number(u?.input_tokens_details?.cached_tokens ?? 0)
    const written = Number(u?.input_tokens_details?.cache_write_tokens ?? 0)
    return {
      input_tokens: u ? Math.max(0, input - cached - written) : this.inputTokens,
      cache_creation_input_tokens: written,
      cache_read_input_tokens: cached,
      output_tokens: Number(u?.output_tokens ?? 0)
    }
  }

  #finish (stopReason, usage) {
    this.finished = true
    return [
      ...this.#closeOpen(),
      { type: 'message_delta', delta: { stop_reason: stopReason, stop_sequence: null }, usage },
      { type: 'message_stop' }
    ]
  }

  #fail (status, body) {
    this.finished = true
    return [...this.#closeOpen(), anthropicErrorEvent(status, body, { model: this.upstreamModel, contextWindow: this.contextWindow, inputTokens: this.inputTokens })]
  }

  #terminal (ev) {
    const r = ev.response
    switch (ev.type) {
      case 'response.completed':
      case 'response.done':
        return this.#finish(this.sawToolCall ? 'tool_use' : 'end_turn', this.#usage(r?.usage))
      case 'response.incomplete': {
        const reason = r?.incomplete_details?.reason
        if (reason === 'max_output_tokens' || reason === 'max_tokens') return this.#finish('max_tokens', this.#usage(r?.usage))
        if (reason === 'content_filter') return this.#finish('refusal', this.#usage(r?.usage))
        if (reason === 'interrupted') return this.#finish(this.sawToolCall ? 'tool_use' : 'end_turn', this.#usage(r?.usage))
        return this.#fail(undefined, { error: { code: reason ?? 'incomplete', message: `the response is incomplete${reason ? ` (${reason})` : ''}` } })
      }
      case 'response.failed':
        return this.#fail(undefined, { error: r?.error ?? { message: 'the response failed' } })
      default: // 'error'
        return this.#fail(undefined, { error: { code: ev.code ?? ev.error?.code, message: ev.message ?? ev.error?.message ?? '', param: ev.param } })
    }
  }
}

const thinkingDelta = (index, thinking) => ({ type: 'content_block_delta', index, delta: { type: 'thinking_delta', thinking } })

/** Anthropic tool_use ids must match ^[a-zA-Z0-9_-]+$; upstream call ids normally do. */
function anthropicToolId (id) {
  const s = String(id ?? '').replace(/[^a-zA-Z0-9_-]/g, '_')
  return s || randomId('call_')
}

/**
 * Responses SSE text (strings or UTF-8 bytes) in, Anthropic SSE text out.
 * @param {object} o  ResponsesToAnthropic options, plus
 * @param {number} [o.pingMs]  emit an Anthropic `ping` after this much upstream silence (0 = never)
 * @returns {TransformStream<string|Uint8Array, string>}
 */
export function createResponsesToAnthropicStream (o = {}) {
  const tr = new ResponsesToAnthropic(o)
  const parser = createSseParser()
  const decoder = new TextDecoder()
  const pingMs = o.pingMs ?? 0
  let timer = null
  let last = Date.now()
  const stopPing = () => { if (timer) clearInterval(timer); timer = null }
  const emit = (c, events) => {
    for (const e of events) c.enqueue(sseEvent(e))
    if (events.length) last = Date.now()
    if (tr.finished) stopPing()
  }
  const feed = (c, events) => {
    for (const e of events) {
      if (tr.finished) break
      const obj = parseSseJson(e)
      if (obj) emit(c, tr.handle(obj))
    }
  }
  return new TransformStream({
    start (c) {
      emit(c, tr.start())
      if (pingMs > 0) {
        timer = setInterval(() => {
          if (Date.now() - last < pingMs) return
          try { c.enqueue(sseEvent({ type: 'ping' })); last = Date.now() } catch { stopPing() }
        }, Math.max(50, Math.floor(pingMs / 2)))
      }
    },
    transform (chunk, c) {
      if (tr.finished) return
      feed(c, parser.push(typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })))
    },
    flush (c) {
      if (!tr.finished) feed(c, parser.push(decoder.decode()))
      if (!tr.finished) feed(c, parser.end())
      emit(c, tr.end())
      stopPing()
    },
    cancel () { stopPing() }
  })
}

/**
 * Anthropic stream events -> one Anthropic Message (the non-streaming
 * answer), or the error the stream ended with.
 * @returns {{message: object} | {error: {type: string, message: string}}}
 */
export function aggregateAnthropicEvents (events) {
  let message = null
  const blocks = []
  const json = new Map()
  for (const e of events) {
    switch (e.type) {
      case 'message_start':
        message = { ...e.message, content: [], usage: { ...e.message.usage } }
        break
      case 'content_block_start':
        blocks[e.index] = { ...e.content_block }
        if (e.content_block.type === 'tool_use') json.set(e.index, '')
        break
      case 'content_block_delta': {
        const b = blocks[e.index]
        const d = e.delta
        if (!b) break
        if (d.type === 'text_delta') b.text = (b.text ?? '') + d.text
        else if (d.type === 'thinking_delta') b.thinking = (b.thinking ?? '') + d.thinking
        else if (d.type === 'signature_delta') b.signature = d.signature
        else if (d.type === 'input_json_delta') json.set(e.index, (json.get(e.index) ?? '') + d.partial_json)
        break
      }
      case 'message_delta':
        if (!message) break
        message.stop_reason = e.delta.stop_reason
        message.stop_sequence = e.delta.stop_sequence ?? null
        for (const [k, v] of Object.entries(e.usage ?? {})) if (v != null && (k === 'output_tokens' || v > 0)) message.usage[k] = v
        break
      case 'error':
        return { error: e.error }
      default:
        break
    }
  }
  if (!message) return { error: { type: 'api_error', message: 'the ChatGPT stream produced no message' } }
  for (const [i, s] of json) {
    try { blocks[i].input = s ? JSON.parse(s) : {} } catch { blocks[i].input = {} }
  }
  message.content = blocks.filter(Boolean)
  return { message }
}

/** Run a whole Responses SSE text through the translator (tests, non-stream path). */
export function translateResponsesSse (text, o = {}) {
  const tr = new ResponsesToAnthropic(o)
  const parser = createSseParser()
  const out = tr.start()
  for (const e of [...parser.push(text), ...parser.end()]) {
    if (tr.finished) break
    const obj = parseSseJson(e)
    if (obj) out.push(...tr.handle(obj))
  }
  out.push(...tr.end())
  return out
}
