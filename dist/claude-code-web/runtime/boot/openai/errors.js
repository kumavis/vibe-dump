// Upstream (OpenAI Responses / Sign in with ChatGPT) errors -> Anthropic API
// errors, so Claude Code's own retry, compaction and messaging logic applies
// (ARCHITECTURE.md Appendix A, report J §7.7). Verified in the 2.1.311
// bundle: the SDK honours `x-should-retry`, and Claude Code compacts on an
// error matching /prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i.

export const STATUS_OF_TYPE = Object.freeze({
  invalid_request_error: 400,
  authentication_error: 401,
  permission_error: 403,
  not_found_error: 404,
  request_too_large: 413,
  rate_limit_error: 429,
  api_error: 500,
  overloaded_error: 529
})

const USAGE_LIMIT = new Set(['usage_limit_reached', 'subscription_sharing_usage_limit_exceeded'])
const NOT_ENTITLED = new Set(['usage_not_included', 'insufficient_quota', 'subscription_sharing_user_not_eligible'])
const OVERLOADED = new Set(['server_is_overloaded', 'slow_down', 'policy_capacity_unavailable', 'subscription_sharing_usage_unavailable', 'server_error_overloaded'])
const POLICY = new Set(['cyber_policy', 'bio_policy', 'invalid_prompt', 'misalignment_policy_violation'])
const CONTEXT = /context_length_exceeded|maximum context length|context window|too many tokens|prompt is too long|input is too long/i

/**
 * The error object out of whatever upstream sent: `{error:{...}}`,
 * `{detail:"..."}` / `{detail:{code,message}}`, a Responses event
 * (`response.failed` carries `response.error`, `error` events carry the
 * fields at top level), or plain text.
 * @returns {{code?: string, type?: string, message: string, param?: string, resetsAt?: number, planType?: string, raw: string}}
 */
export function parseUpstreamError (body) {
  let raw = ''
  let o = body
  if (typeof body === 'string') {
    raw = body
    try { o = JSON.parse(body) } catch { o = null }
  } else {
    try { raw = JSON.stringify(body) } catch { raw = String(body) }
  }
  let e = o
  if (o && typeof o === 'object') {
    if (o.type === 'response.failed' || o.type === 'response.incomplete') e = o.response?.error ?? o.response?.incomplete_details ?? {}
    else if (o.error && typeof o.error === 'object') e = o.error
    else if (o.detail !== undefined) e = typeof o.detail === 'object' && o.detail ? o.detail : { message: String(o.detail) }
  } else {
    e = { message: raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) }
  }
  const str = (v) => (typeof v === 'string' && v ? v : undefined)
  return {
    code: str(e?.code),
    type: str(e?.type) === 'error' ? undefined : str(e?.type),
    message: str(e?.message) ?? str(e?.reason) ?? '',
    param: str(e?.param),
    resetsAt: Number.isFinite(e?.resets_at) ? e.resets_at : (Number.isFinite(e?.resets_in_seconds) ? Math.round(Date.now() / 1000) + e.resets_in_seconds : undefined),
    planType: str(e?.plan_type),
    raw
  }
}

/** "Please try again in 11.054s" / "in 2m3s" / "in 450ms" -> whole seconds (rounded up), or undefined. */
export function retryAfterSeconds (message) {
  const m = /try again in\s+(?:(\d+(?:\.\d+)?)m(?!s))?\s*(?:(\d+(?:\.\d+)?)s)?\s*(?:(\d+)ms)?/i.exec(String(message ?? ''))
  if (!m || (!m[1] && !m[2] && !m[3])) return undefined
  const s = (Number(m[1] || 0) * 60) + Number(m[2] || 0) + Number(m[3] || 0) / 1000
  return Math.max(1, Math.ceil(s))
}

/** Token counts out of an upstream overflow message, when it has them. */
function overflowNumbers (message) {
  const s = String(message ?? '')
  const max = /maximum context length is\s*([\d,]+)/i.exec(s) ?? /context window of\s*([\d,]+)/i.exec(s)
  const got = /(?:resulted in|requested|you (?:sent|provided)|input (?:has|of))\s*([\d,]+)\s*tokens/i.exec(s)
  const n = (m) => (m ? Number(m[1].replace(/,/g, '')) : undefined)
  return { max: n(max), got: n(got) }
}

/**
 * The Anthropic error for an upstream failure.
 * @param {number|undefined} status  the upstream HTTP status (undefined for a mid-stream failure)
 * @param {object} err               parseUpstreamError() output
 * @param {object} [ctx]             { model, contextWindow, inputTokens }
 * @returns {{status: number, type: string, message: string, headers: object}}
 */
export function anthropicError (status, err, ctx = {}) {
  const code = err.code ?? err.type
  const msg = err.message || ''
  const tail = msg ? ` (${code ? `${code}: ` : ''}${msg})` : code ? ` (${code})` : ''
  const noRetry = { 'x-should-retry': 'false' }

  if (code === 'context_length_exceeded' || (CONTEXT.test(msg) && (status === 400 || status === 413 || status === undefined)) || CONTEXT.test(code ?? '')) {
    const nums = overflowNumbers(msg)
    const max = nums.max ?? ctx.contextWindow ?? 272000
    const got = Math.max(nums.got ?? 0, ctx.inputTokens ?? 0, max + 1)
    return { status: 400, type: 'invalid_request_error', message: `prompt is too long: ${got} tokens > ${max} maximum`, headers: noRetry }
  }
  if (status === 401 || code === 'subscription_sharing_invalid_user' || code === 'invalid_api_key' || code === 'token_expired' || code === 'invalid_issuer') {
    return { status: 401, type: 'authentication_error', message: `ChatGPT rejected the sign-in${tail}. Sign in with ChatGPT again in Settings.`, headers: noRetry }
  }
  if (USAGE_LIMIT.has(code)) {
    const plan = err.planType ? ` on the ${err.planType} plan` : ''
    const reset = err.resetsAt ? `; it resets at ${new Date(err.resetsAt * 1000).toISOString()}` : ''
    return { status: 429, type: 'rate_limit_error', message: `ChatGPT usage limit reached${plan}${reset}${tail}`, headers: noRetry }
  }
  if (NOT_ENTITLED.has(code) || (code && code.startsWith('chatpass_'))) {
    return { status: 403, type: 'permission_error', message: `This ChatGPT account cannot use the model through Sign in with ChatGPT (Plus or Pro is required)${tail}`, headers: noRetry }
  }
  if (OVERLOADED.has(code) || status === 503) {
    return { status: 529, type: 'overloaded_error', message: `The ChatGPT model is overloaded${tail}`, headers: {} }
  }
  if (status === 429 || code === 'rate_limit_exceeded') {
    const after = retryAfterSeconds(msg)
    if (code === 'rate_limit_exceeded' && after !== undefined && after <= 60) {
      return { status: 429, type: 'rate_limit_error', message: `ChatGPT rate limit${tail}`, headers: { 'retry-after': String(after), 'x-should-retry': 'true' } }
    }
    return { status: 429, type: 'rate_limit_error', message: `ChatGPT rate limit${tail}`, headers: noRetry }
  }
  if (POLICY.has(code)) {
    return { status: 400, type: 'invalid_request_error', message: `The request was refused upstream${tail}`, headers: noRetry }
  }
  if (code === 'subscription_sharing_unsupported_capability') {
    return { status: 400, type: 'invalid_request_error', message: `Unsupported by Sign in with ChatGPT${err.param ? ` (param ${err.param})` : ''}${tail}`, headers: noRetry }
  }
  if (status === 403 && /cloudflare|just a moment|cf-ray|blocked/i.test(`${msg} ${err.raw}`)) {
    return { status: 403, type: 'permission_error', message: 'The request was blocked by Cloudflare in front of the OpenAI API (region or network?)', headers: noRetry }
  }
  if (status === 403) return { status: 403, type: 'permission_error', message: `Forbidden by the OpenAI API${tail}`, headers: noRetry }
  if (status === 404 || code === 'model_not_found') {
    return { status: 404, type: 'not_found_error', message: `The ChatGPT model${ctx.model ? ` "${ctx.model}"` : ''} was not found or is not available to this account${tail}`, headers: noRetry }
  }
  if (status === 413) return { status: 413, type: 'request_too_large', message: `Request too large${tail}`, headers: noRetry }
  if (status >= 400 && status < 500) return { status: 400, type: 'invalid_request_error', message: `The OpenAI API refused the request (HTTP ${status})${tail}`, headers: noRetry }
  if (status >= 500) return { status, type: 'api_error', message: `OpenAI API error (HTTP ${status})${tail}`, headers: {} }
  // mid-stream failures without a known code
  return { status: 500, type: 'api_error', message: `The ChatGPT response failed${tail}`, headers: {} }
}

/**
 * Upstream HTTP error -> the synthetic response the harness sees.
 * @param {number} status
 * @param {string|object} body   the upstream body (text or parsed)
 * @param {object} [ctx]         { model, contextWindow, inputTokens }
 * @returns {{status: number, body: {type: 'error', error: {type: string, message: string}}, headers: object}}
 */
export function mapUpstreamError (status, body, ctx) {
  const e = anthropicError(status, parseUpstreamError(body), ctx)
  return { status: e.status, body: { type: 'error', error: { type: e.type, message: e.message } }, headers: { 'content-type': 'application/json', ...e.headers } }
}

/** The `error` SSE event object for a mid-stream failure. */
export function anthropicErrorEvent (status, body, ctx) {
  const e = anthropicError(status, parseUpstreamError(body), ctx)
  return { type: 'error', error: { type: e.type, message: e.message } }
}
