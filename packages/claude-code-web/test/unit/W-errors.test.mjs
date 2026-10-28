// Track W (ChatGPT option, Worker side): upstream errors -> Anthropic errors (report J §7.7).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mapUpstreamError, parseUpstreamError, retryAfterSeconds, anthropicErrorEvent, STATUS_OF_TYPE } from '../../src/runtime/boot/openai/errors.js'

const PROMPT_TOO_LONG = /prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i // as in Claude Code 2.1.311
const err = (code, message, extra = {}) => JSON.stringify({ error: { code, message, type: 'invalid_request_error', param: null, ...extra } })
const map = (status, body, ctx) => {
  const m = mapUpstreamError(status, body, ctx)
  assert.equal(m.body.type, 'error')
  assert.equal(m.headers['content-type'], 'application/json')
  assert.equal(STATUS_OF_TYPE[m.body.error.type] === m.status || m.status >= 500, true, `${m.status} fits ${m.body.error.type}`)
  return { status: m.status, type: m.body.error.type, message: m.body.error.message, retry: m.headers['x-should-retry'], after: m.headers['retry-after'] }
}

test('errors: 401 -> authentication_error, not retried', () => {
  const r = map(401, err('invalid_issuer', 'Your authentication token is not from a valid issuer.'))
  assert.equal(r.status, 401)
  assert.equal(r.type, 'authentication_error')
  assert.equal(r.retry, 'false')
  assert.match(r.message, /Sign in with ChatGPT again/)
  assert.equal(map(401, '').type, 'authentication_error')
  assert.equal(map(400, err('subscription_sharing_invalid_user', 'x')).status, 401)
})

test('errors: 429 classes (usage limit terminal, short rate limit with retry-after, others terminal)', () => {
  const lim = map(429, JSON.stringify({ error: { type: 'usage_limit_reached', plan_type: 'plus', resets_at: 1767225600, message: 'The usage limit has been reached' } }))
  assert.deepEqual([lim.status, lim.type, lim.retry], [429, 'rate_limit_error', 'false'])
  assert.match(lim.message, /usage limit reached on the plus plan; it resets at 2026-01-01T00:00:00\.000Z/)
  const siwc = map(429, err('subscription_sharing_usage_limit_exceeded', 'Weekly cap for this app reached'))
  assert.deepEqual([siwc.status, siwc.type, siwc.retry], [429, 'rate_limit_error', 'false'])
  const short = map(429, err('rate_limit_exceeded', 'Rate limit reached. Please try again in 11.054s.'))
  assert.deepEqual([short.status, short.type, short.retry, short.after], [429, 'rate_limit_error', 'true', '12'])
  const long = map(429, err('rate_limit_exceeded', 'Please try again in 20m0s.'))
  assert.deepEqual([long.retry, long.after], ['false', undefined])
  const bare = map(429, 'Too Many Requests')
  assert.deepEqual([bare.status, bare.type, bare.retry], [429, 'rate_limit_error', 'false'])
  const quota = map(429, err('insufficient_quota', 'You exceeded your current quota'))
  assert.deepEqual([quota.status, quota.type, quota.retry], [403, 'permission_error', 'false'])
  assert.equal(map(403, err('subscription_sharing_user_not_eligible', 'Plus or Pro required')).type, 'permission_error')
  assert.equal(map(403, err('chatpass_v2_blocked', 'x')).type, 'permission_error')
})

test('errors: context overflow -> 400 "prompt is too long: N tokens > M" so Claude Code compacts', () => {
  const a = map(400, err('context_length_exceeded', 'Your input exceeds the context window of this model. Please adjust your input and try again.'), { contextWindow: 272000, inputTokens: 280500 })
  assert.deepEqual([a.status, a.type, a.retry], [400, 'invalid_request_error', 'false'])
  const m = PROMPT_TOO_LONG.exec(a.message)
  assert.deepEqual([Number(m[1]), Number(m[2])], [280500, 272000])
  // numbers in the upstream message win; N is always > M
  const b = map(400, err(null, "This model's maximum context length is 128,000 tokens. However, your messages resulted in 131,072 tokens."), { contextWindow: 272000, inputTokens: 1000 })
  assert.deepEqual(PROMPT_TOO_LONG.exec(b.message).slice(1).map(Number), [131072, 128000])
  const c = map(400, err('context_length_exceeded', 'too long'), { inputTokens: 10 })
  const [n, max] = PROMPT_TOO_LONG.exec(c.message).slice(1).map(Number)
  assert.ok(n > max)
  // and mid-stream (no status)
  const ev = anthropicErrorEvent(undefined, { type: 'response.failed', response: { error: { code: 'context_length_exceeded', message: 'x' } } }, { contextWindow: 200000, inputTokens: 5 })
  assert.equal(ev.error.type, 'invalid_request_error')
  assert.deepEqual(PROMPT_TOO_LONG.exec(ev.error.message).slice(1).map(Number), [200001, 200000])
})

test('errors: 5xx -> overloaded (529) or api_error (retryable); policy and capability 400s are terminal', () => {
  const ov = map(503, err('server_is_overloaded', 'busy'))
  assert.deepEqual([ov.status, ov.type, ov.retry], [529, 'overloaded_error', undefined])
  assert.equal(map(503, 'Service Unavailable').type, 'overloaded_error')
  assert.equal(map(429, err('slow_down', 'x')).type, 'overloaded_error')
  const e500 = map(500, err('server_error', 'boom'))
  assert.deepEqual([e500.status, e500.type, e500.retry], [500, 'api_error', undefined])
  const e502 = map(502, '<html>Bad gateway</html>')
  assert.deepEqual([e502.status, e502.type], [502, 'api_error'])
  assert.match(e502.message, /Bad gateway/)
  const pol = map(400, err('cyber_policy', 'flagged'))
  assert.deepEqual([pol.status, pol.type, pol.retry], [400, 'invalid_request_error', 'false'])
  const cap = map(400, err('subscription_sharing_unsupported_capability', 'not supported', { param: 'tools[3].type' }))
  assert.match(cap.message, /param tools\[3\]\.type/)
  const other = map(422, err('invalid_value', 'bad field'))
  assert.deepEqual([other.status, other.type, other.retry], [400, 'invalid_request_error', 'false'])
  assert.match(other.message, /HTTP 422.*invalid_value: bad field/)
})

test('errors: Cloudflare 403, unknown model 404, {detail} bodies, plain text', () => {
  const cf = map(403, '<!DOCTYPE html><title>Just a moment...</title> cloudflare challenge')
  assert.equal(cf.type, 'permission_error')
  assert.match(cf.message, /Cloudflare/)
  const nf = map(404, err('model_not_found', 'The model `gpt-9` does not exist'), { model: 'gpt-9' })
  assert.deepEqual([nf.status, nf.type], [404, 'not_found_error'])
  assert.match(nf.message, /"gpt-9"/)
  assert.deepEqual(parseUpstreamError('{"detail":"Unsupported model"}').message, 'Unsupported model')
  assert.deepEqual(parseUpstreamError({ detail: { code: 'missing_end_user_auth', message: 'no login' } }).code, 'missing_end_user_auth')
  assert.equal(parseUpstreamError({ type: 'error', code: 'rate_limit_exceeded', message: 'm' }).code, 'rate_limit_exceeded')
  assert.equal(parseUpstreamError({ type: 'error', code: 'x' }).type, undefined)
  assert.equal(parseUpstreamError('plain <b>text</b>').message, 'plain text')
  assert.equal(retryAfterSeconds('try again in 450ms'), 1)
  assert.equal(retryAfterSeconds('try again in 1m30s'), 90)
  assert.equal(retryAfterSeconds('no hint'), undefined)
})
