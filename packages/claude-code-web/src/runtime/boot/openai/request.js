// Anthropic Messages request -> OpenAI Responses request, for the "ChatGPT
// subscription" provider (ARCHITECTURE.md Appendix A; mapping per report J
// §7.3-7.5, shaped after what Claude Code 2.1.311 really sends, J §7.1).
// Design informed by CLIProxyAPI's codex_claude_request.go and pi-ai's
// openai-codex provider (both MIT); no code was copied from either.
//
// The Responses body is built from scratch, so nothing that Sign in with
// ChatGPT forbids can leak through: always store:false and stream:true;
// never max_output_tokens, temperature, top_p, metadata, user,
// previous_response_id or a role:"system" item.

import { base64urlDecode, base64urlEncode, shortHash } from './util.js'

/** Fields the request must never carry (SIWC preview limitations, J §3c). */
export const FORBIDDEN_FIELDS = Object.freeze([
  'background', 'conversation', 'max_output_tokens', 'max_tool_calls', 'metadata', 'moderation',
  'multi_agent', 'prompt', 'prompt_cache_retention', 'safety_identifier', 'temperature',
  'top_logprobs', 'top_p', 'truncation', 'user', 'previous_response_id'
])

export const REASONING_EFFORTS = Object.freeze(['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'])

/** Prefix of the opaque thinking-block signature that carries a reasoning item (J §7.5). */
export const SIGNATURE_PREFIX = 'cxr1.'

/** Thinking-block signature for an upstream reasoning item. */
export function encodeReasoningSignature ({ id, encrypted_content: enc, model }) {
  const o = {}
  if (id) o.id = id
  if (enc) o.encrypted_content = enc
  if (model) o.model = model
  return SIGNATURE_PREFIX + base64urlEncode(JSON.stringify(o))
}

/** The reasoning item a signature carries, or null (an Anthropic signature, or garbage). */
export function decodeReasoningSignature (sig) {
  if (typeof sig !== 'string' || !sig.startsWith(SIGNATURE_PREFIX)) return null
  try {
    const o = JSON.parse(base64urlDecode(sig.slice(SIGNATURE_PREFIX.length)))
    return o && typeof o === 'object' && !Array.isArray(o) ? o : null
  } catch {
    return null
  }
}

const NAME_OK = /^[a-zA-Z0-9_-]{1,64}$/
const MAX_NAME = 64

/** A name the Responses API accepts (^[a-zA-Z0-9_-]{1,64}$), deterministic. */
export function shortenName (name) {
  const raw = String(name ?? '')
  if (NAME_OK.test(raw)) return raw
  let s = raw.replace(/[^a-zA-Z0-9_-]/g, '_')
  if (s.length > MAX_NAME) {
    const m = /^mcp__.+?__(.+)$/.exec(s)
    s = m && m[1].length + 5 <= MAX_NAME ? `mcp__${m[1]}` : `${s.slice(0, MAX_NAME - 13)}_${shortHash(raw)}`
  }
  return s || `tool_${shortHash(raw)}`
}

/** A call_id for a tool_use id: identity when valid, else sanitized + hashed. */
export function upstreamCallId (id) {
  const raw = String(id ?? '')
  if (NAME_OK.test(raw)) return raw
  const s = raw.replace(/[^a-zA-Z0-9_-]/g, '_')
  return s ? `${s.slice(0, MAX_NAME - 13)}_${shortHash(raw)}` : `call_${shortHash(raw)}`
}

/**
 * Per-request tool-name map: original -> upstream, unique, deterministic.
 * Collisions after shortening fall back to the hashed form.
 */
function buildNameMap (names) {
  const toUpstream = new Map()
  const taken = new Map() // upstream -> original
  for (const name of names) {
    if (toUpstream.has(name)) continue
    let up = shortenName(name)
    if (taken.has(up) && taken.get(up) !== name) up = `${String(name).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, MAX_NAME - 13)}_${shortHash(name)}`
    toUpstream.set(name, up)
    taken.set(up, name)
  }
  return { toUpstream, toOriginal: taken }
}

const SCHEMA_DROP = new Set(['$schema', '$id', '$comment'])
const SCHEMA_CHILD_MAPS = ['properties', 'patternProperties', '$defs', 'definitions', 'dependentSchemas']
const SCHEMA_CHILD_LISTS = ['anyOf', 'oneOf', 'allOf', 'prefixItems']
const SCHEMA_CHILD_ONE = ['items', 'additionalProperties', 'not', 'if', 'then', 'else', 'contains', 'propertyNames', 'unevaluatedProperties']

/**
 * JSON Schema cleanup for non-strict function tools: drop $schema/$id,
 * give every object schema `properties`, drop regexes that use \p{...}
 * (not portable upstream), and turn a boolean sub-schema into {} / {not:{}}.
 */
export function cleanSchema (schema, top = true) {
  if (schema === true) return {}
  if (schema === false) return { not: {} }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return top ? { type: 'object', properties: {} } : {}
  const out = {}
  for (const [k, v] of Object.entries(schema)) {
    if (SCHEMA_DROP.has(k)) continue
    if (k === 'pattern' && typeof v === 'string' && /\\[pP]\{/.test(v)) continue
    if (SCHEMA_CHILD_MAPS.includes(k) && v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, cleanSchema(pv, false)]))
    } else if (SCHEMA_CHILD_LISTS.includes(k) && Array.isArray(v)) {
      out[k] = v.map((s) => cleanSchema(s, false))
    } else if (SCHEMA_CHILD_ONE.includes(k) && v && typeof v === 'object') {
      out[k] = Array.isArray(v) ? v.map((s) => cleanSchema(s, false)) : cleanSchema(v, false)
    } else {
      out[k] = v
    }
  }
  if (top && out.type === undefined) out.type = 'object'
  const isObject = out.type === 'object' || (Array.isArray(out.type) && out.type.includes('object'))
  if (isObject && (!out.properties || typeof out.properties !== 'object')) out.properties = {}
  return out
}

/** Anthropic tool definitions -> Responses function tools. */
function mapTools (tools, nameMap) {
  const out = []
  for (const t of Array.isArray(tools) ? tools : []) {
    if (!t || typeof t !== 'object') continue
    if (t.name === 'DeferredToolPlaceholder') continue
    // Anthropic server tools (web_search_*, code_execution_*, ...) have a
    // versioned `type` and no input_schema: not offered upstream.
    if (t.type && t.type !== 'custom' && !t.input_schema) continue
    if (!t.name) continue
    const fn = { type: 'function', name: nameMap.toUpstream.get(t.name) ?? shortenName(t.name), description: typeof t.description === 'string' ? t.description : '', parameters: cleanSchema(t.input_schema), strict: false }
    out.push(fn)
  }
  return out
}

function mapToolChoice (tc, nameMap) {
  if (!tc || typeof tc !== 'object') return { choice: 'auto', parallel: true }
  const parallel = !tc.disable_parallel_tool_use
  switch (tc.type) {
    case 'any': return { choice: 'required', parallel }
    case 'none': return { choice: 'none', parallel }
    case 'tool': return { choice: { type: 'function', name: nameMap.toUpstream.get(tc.name) ?? shortenName(tc.name) }, parallel }
    default: return { choice: 'auto', parallel }
  }
}

const BILLING_LINE = /^\s*x-anthropic-billing-header:/i

/** Remove the x-anthropic-billing-header line (it means nothing upstream and leaks version info). */
export function stripBillingLine (text) {
  if (!BILLING_LINE.test(text) && !/\nx-anthropic-billing-header:/i.test(text)) return text
  return String(text).split('\n').filter((l) => !BILLING_LINE.test(l)).join('\n')
}

function systemTexts (system) {
  const blocks = typeof system === 'string' ? [system] : Array.isArray(system) ? system.map((b) => (typeof b === 'string' ? b : b?.type === 'text' ? b.text : null)) : []
  return blocks.filter((t) => typeof t === 'string').map(stripBillingLine).filter((t) => t.trim() !== '')
}

const developerMessage = (texts) => ({ type: 'message', role: 'developer', content: texts.map((text) => ({ type: 'input_text', text })) })

/** The session id Claude Code puts in metadata.user_id (a JSON string) — used as the prompt cache key. */
export function sessionIdOf (anthropic, headerValue) {
  if (headerValue) return String(headerValue)
  const uid = anthropic?.metadata?.user_id
  if (typeof uid !== 'string') return undefined
  try {
    const o = JSON.parse(uid)
    return typeof o?.session_id === 'string' && o.session_id ? o.session_id : undefined
  } catch {
    const m = /session_([0-9a-f-]{8,})/i.exec(uid)
    return m ? m[1] : undefined
  }
}

/** Reasoning effort: the settings override, else output_config.effort, else from thinking. */
export function reasoningEffort (anthropic, override) {
  if (override && override !== 'auto' && REASONING_EFFORTS.includes(override)) return override
  const t = anthropic?.thinking
  const e = anthropic?.output_config?.effort
  if (t?.type === 'disabled') return 'low'
  if (typeof e === 'string' && REASONING_EFFORTS.includes(e)) return e
  if (t?.type === 'enabled' && Number.isFinite(t.budget_tokens)) return t.budget_tokens <= 4096 ? 'low' : t.budget_tokens <= 16384 ? 'medium' : 'high'
  return 'medium'
}

/**
 * `effort` limited to what the model supports (the model list's
 * supported_reasoning_levels): kept when supported, else the highest
 * supported level below it, else the lowest supported. Unknown or empty
 * `supported`: unchanged.
 */
export function clampEffort (effort, supported) {
  if (!Array.isArray(supported) || !supported.length || supported.includes(effort)) return effort
  const rank = (e) => REASONING_EFFORTS.indexOf(e)
  const known = supported.filter((e) => rank(e) >= 0).sort((a, b) => rank(a) - rank(b))
  if (!known.length || rank(effort) < 0) return effort
  const below = known.filter((e) => rank(e) <= rank(effort))
  return below.length ? below[below.length - 1] : known[0]
}

// --- content blocks -----------------------------------------------------------------

function imagePart (block) {
  const src = block?.source
  if (src?.type === 'base64' && src.data) return { type: 'input_image', image_url: `data:${src.media_type || 'image/png'};base64,${src.data}`, detail: 'auto' }
  if (src?.type === 'url' && src.url) return { type: 'input_image', image_url: src.url, detail: 'auto' }
  return { type: 'input_text', text: '[image omitted: unsupported source]' }
}

/** Documents degrade per J §7.8: PDF -> input_file, text -> input_text, else a placeholder. */
function documentParts (block) {
  const src = block?.source
  const title = block?.title ? String(block.title) : ''
  const label = title ? ` "${title}"` : ''
  if (src?.type === 'text' && typeof src.data === 'string') return [{ type: 'input_text', text: title ? `${title}\n\n${src.data}` : src.data }]
  if (src?.type === 'content' && Array.isArray(src.content)) {
    const texts = src.content.filter((c) => c?.type === 'text').map((c) => c.text)
    const imgs = src.content.filter((c) => c?.type === 'image').map(imagePart)
    return [{ type: 'input_text', text: [title, ...texts].filter(Boolean).join('\n\n') }, ...imgs]
  }
  if (src?.type === 'base64' && src.media_type === 'application/pdf' && src.data) {
    return [{ type: 'input_file', filename: `${(title || 'document').replace(/[^\w.-]+/g, '_').slice(0, 60)}.pdf`, file_data: `data:application/pdf;base64,${src.data}` }]
  }
  if (src?.type === 'url' && src.url) return [{ type: 'input_text', text: `[document${label} omitted: ${src.url}]` }]
  return [{ type: 'input_text', text: `[document${label} omitted: ${src?.media_type || src?.type || 'unsupported'} source]` }]
}

function searchResultText (block) {
  const texts = Array.isArray(block?.content) ? block.content.filter((c) => c?.type === 'text').map((c) => c.text) : []
  return [`[search result] ${block?.title ?? ''}${block?.source ? ` (${block.source})` : ''}`.trim(), ...texts].join('\n')
}

/** Blocks inside a user message or a tool_result -> Responses input parts. */
function contentParts (blocks) {
  const parts = []
  for (const b of blocks) {
    if (typeof b === 'string') { parts.push({ type: 'input_text', text: b }); continue }
    switch (b?.type) {
      case 'text': if (typeof b.text === 'string' && b.text !== '') parts.push({ type: 'input_text', text: b.text }); break
      case 'image': parts.push(imagePart(b)); break
      case 'document': parts.push(...documentParts(b)); break
      case 'search_result': parts.push({ type: 'input_text', text: searchResultText(b) }); break
      case 'tool_reference': parts.push({ type: 'input_text', text: `[tool reference: ${b.tool_name ?? b.name ?? ''}]` }); break
      default: break // server-tool results, container uploads, ...: nothing upstream can use
    }
  }
  return parts
}

/** tool_result.content -> function_call_output.output (a string unless it has images or files). */
function toolOutput (block) {
  const raw = block?.content
  const parts = typeof raw === 'string' ? (raw === '' ? [] : [{ type: 'input_text', text: raw }]) : contentParts(Array.isArray(raw) ? raw : [])
  const prefix = block?.is_error ? 'Error: ' : ''
  if (parts.every((p) => p.type === 'input_text')) return prefix + parts.map((p) => p.text).join('\n')
  if (prefix) parts.unshift({ type: 'input_text', text: prefix.trim() })
  return parts
}

function blocksOf (content) {
  if (typeof content === 'string') return content === '' ? [] : [{ type: 'text', text: content }]
  return Array.isArray(content) ? content.filter(Boolean) : []
}

/** How many of the newest assistant turns keep their reasoning (context_management clear_thinking). */
function keepThinkingTurns (anthropic) {
  const edits = anthropic?.context_management?.edits
  if (!Array.isArray(edits)) return Infinity
  for (const e of edits) {
    if (typeof e?.type !== 'string' || !e.type.startsWith('clear_thinking_')) continue
    if (e.keep === 'all' || e.keep === undefined) return Infinity
    if (e.keep?.type === 'thinking_turns' && Number.isFinite(e.keep.value)) return Math.max(0, e.keep.value)
  }
  return Infinity
}

/**
 * Translate one Anthropic Messages request body.
 * @param {object} anthropic  the parsed /v1/messages body
 * @param {object} o
 * @param {string} o.model           the upstream model (provider.model)
 * @param {string} [o.smallModel]    used for haiku-class requests (defaults to o.model)
 * @param {string} [o.effort]        settings override ('auto' / '' = from the request)
 * @param {string[]} [o.efforts]     the model's supported efforts (clamped to; unknown: passed through)
 * @param {string} [o.sessionId]     x-claude-code-session-id, else metadata.user_id.session_id
 * @param {boolean} [o.hoistSystem]  also move in-message role:"system" items into the leading
 *                                   developer message (default: keep them in place as developer messages)
 * @returns {{ body: object, idMap: { model: string, toolNames: Map<string,string> } }}
 */
export function toResponsesRequest (anthropic, { model, smallModel, effort, efforts, sessionId, hoistSystem = false } = {}) {
  if (!anthropic || typeof anthropic !== 'object') throw new TypeError('toResponsesRequest: the request body must be an object')
  const requested = String(anthropic.model ?? '')
  const upstreamModel = (/haiku/i.test(requested) && smallModel) || model
  if (!upstreamModel) throw new TypeError('toResponsesRequest: no upstream model')
  const messages = Array.isArray(anthropic.messages) ? anthropic.messages : []

  // Every tool name the request mentions, in a stable order, for one name map.
  const names = []
  for (const t of Array.isArray(anthropic.tools) ? anthropic.tools : []) if (t?.name) names.push(t.name)
  for (const m of messages) for (const b of blocksOf(m?.content)) if (b.type === 'tool_use' && b.name) names.push(b.name)
  const nameMap = buildNameMap(names)

  const leading = systemTexts(anthropic.system)
  const items = []
  const keepTurns = keepThinkingTurns(anthropic)
  const assistantTotal = messages.filter((m) => m?.role === 'assistant').length
  let assistantSeen = 0
  const seenCalls = new Set() // call_ids of emitted function_calls
  let pending = [] // call_ids of the latest assistant turn not yet answered
  let deferred = [] // developer and user messages that arrived between a call and its output

  // Every call of a turn must be answered before anything else follows it.
  // A call still unanswered when the next assistant message (or the end of
  // the input) comes was interrupted: it gets an "aborted" output there, and
  // the messages held back meanwhile follow. Not at the end of a user
  // message: one turn's parallel results may be split across consecutive
  // user messages, and an "aborted" output before the real one would be a
  // second output for that call, which /v1/responses rejects.
  const flushPending = () => {
    for (const id of pending) items.push({ type: 'function_call_output', call_id: id, output: 'aborted' })
    pending = []
    items.push(...deferred)
    deferred = []
  }

  for (const m of messages) {
    const role = m?.role
    const blocks = blocksOf(m?.content)
    if (role === 'system') {
      const texts = systemTexts(blocks)
      if (!texts.length) continue
      if (hoistSystem) leading.push(...texts)
      else (pending.length ? deferred : items).push(developerMessage(texts))
      continue
    }
    if (role === 'assistant') {
      flushPending()
      const turnStart = items.length
      assistantSeen++
      const keepReasoning = assistantTotal - assistantSeen < keepTurns
      let text = null
      const flushText = () => { if (text) items.push({ type: 'message', role: 'assistant', content: text }); text = null }
      for (const b of blocks) {
        if (b.type === 'text') {
          if (typeof b.text === 'string' && b.text !== '') (text ||= []).push({ type: 'output_text', text: b.text })
          continue
        }
        if (b.type === 'thinking' || b.type === 'redacted_thinking') {
          const env = decodeReasoningSignature(b.type === 'thinking' ? b.signature : b.data)
          // Anthropic-signed thinking means nothing upstream; reasoning from
          // another upstream model is dropped too (as pi-ai does).
          if (!keepReasoning || !env?.encrypted_content || (env.model && env.model !== upstreamModel)) continue
          flushText()
          const summary = b.type === 'thinking' && typeof b.thinking === 'string' && b.thinking !== '' ? [{ type: 'summary_text', text: b.thinking }] : []
          items.push({ type: 'reasoning', ...(env.id ? { id: env.id } : {}), summary, encrypted_content: env.encrypted_content })
          continue
        }
        if (b.type === 'tool_use') {
          flushText()
          const callId = upstreamCallId(b.id)
          items.push({ type: 'function_call', call_id: callId, name: nameMap.toUpstream.get(b.name) ?? shortenName(b.name), arguments: JSON.stringify(b.input ?? {}) })
          seenCalls.add(callId)
          pending.push(callId)
          continue
        }
        // server_tool_use, web_search_tool_result, ...: not representable upstream
      }
      flushText()
      // A reasoning item must be followed by the item it led to; an
      // interrupted turn can end on one, which upstream would reject.
      while (items.length > turnStart && items[items.length - 1].type === 'reasoning') items.pop()
      continue
    }
    // user (and anything else, treated as user): tool results first, in order
    const rest = []
    const orphanTexts = []
    for (const b of blocks) {
      if (b.type !== 'tool_result') { rest.push(b); continue }
      const callId = upstreamCallId(b.tool_use_id)
      const output = toolOutput(b)
      if (seenCalls.has(callId)) {
        items.push({ type: 'function_call_output', call_id: callId, output })
        pending = pending.filter((id) => id !== callId)
      } else {
        // its call is gone (compacted history): keep the content as text
        const text = typeof output === 'string' ? output : output.filter((p) => p.type === 'input_text').map((p) => p.text).join('\n')
        orphanTexts.push({ type: 'input_text', text: `[result of an earlier tool call]\n${text}` })
      }
    }
    // all of the turn's calls answered: release what was held back
    if (!pending.length) flushPending()
    const parts = [...orphanTexts, ...contentParts(rest)]
    if (parts.length) (pending.length ? deferred : items).push({ type: 'message', role: 'user', content: parts })
  }
  flushPending()

  const input = leading.length ? [developerMessage(leading), ...items] : items
  const tools = mapTools(anthropic.tools, nameMap)
  const body = { model: upstreamModel, input }
  if (tools.length) {
    const { choice, parallel } = mapToolChoice(anthropic.tool_choice, nameMap)
    body.tools = tools
    body.tool_choice = choice
    body.parallel_tool_calls = parallel
  }
  body.reasoning = { effort: clampEffort(reasoningEffort(anthropic, effort), upstreamModel === model ? efforts : undefined), summary: 'auto' }
  body.include = ['reasoning.encrypted_content']
  body.store = false
  body.stream = true
  const cacheKey = sessionIdOf(anthropic, sessionId)
  if (cacheKey) body.prompt_cache_key = cacheKey
  const fmt = anthropic.output_config?.format
  if (fmt?.type === 'json_schema' && fmt.schema) body.text = { format: { type: 'json_schema', name: fmt.name || 'output', schema: cleanSchema(fmt.schema), strict: false } }
  return { body, idMap: { model: upstreamModel, toolNames: nameMap.toOriginal } }
}
