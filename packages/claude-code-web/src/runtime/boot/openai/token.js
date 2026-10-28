// The Worker side of the ChatGPT token handoff (ARCHITECTURE.md Appendix A,
// "Token handoff"). The page owns the tokens; the Worker never sees the
// refresh token. It asks:
//
//   Worker -> page  { type: 'provider-token-request', id, reason: 'start' | 'expired' | 'unauthorized' }
//   page -> Worker  { type: 'provider-token', id, accessToken, expiresAt }   (expiresAt: ms since the epoch)
//                   { type: 'provider-token', id, error }
//
// and caches the access token until expiresAt - 60 s. One request is in
// flight at a time (concurrent callers share it). After an upstream 401 the
// adapter calls renew(failedToken): if another caller already replaced that
// token, the new one is returned without asking, else the page is asked
// with reason 'unauthorized'. After an unreadable failure (a TypeError: the
// OpenAI edge answers a rejected token without CORS headers, report K §1c)
// the adapter calls renew(failedToken, {ambiguous: true}), which does not
// ask again for a token obtained less than `minRenewMs` ago, so a network
// outage cannot turn into a refresh storm.

export class ProviderTokenError extends Error {
  constructor (message, { code = 'PROVIDER_TOKEN' } = {}) {
    super(message)
    this.name = 'ProviderTokenError'
    this.code = code
  }
}

/**
 * @param {object} o
 * @param {(msg: object) => void} o.post   postMessage to the page
 * @param {() => number} [o.now]
 * @param {number} [o.skewMs]      renew this long before expiresAt (60 s)
 * @param {number} [o.timeoutMs]   how long the page may take to answer (the page may have to refresh over the network)
 * @param {number} [o.minRenewMs]  a token younger than this is not renewed on a 401
 * @param {number} [o.defaultTtlMs] cache lifetime when the page sends no expiresAt
 */
export function createTokenBroker ({ post, now = () => Date.now(), skewMs = 60_000, timeoutMs = 90_000, minRenewMs = 30_000, defaultTtlMs = 300_000, setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  if (typeof post !== 'function') throw new TypeError('createTokenBroker: post is required')
  let cached = null // { accessToken, expiresAt, obtainedAt }
  let inflight = null // { id, reason, promise, resolve, reject, timer }
  let seq = 0
  const stats = { requests: 0, reasons: [] }

  function ask (reason) {
    if (inflight) return inflight.promise
    const id = `tok-${++seq}`
    let resolve, reject
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    const timer = setTimer(() => settle(id, null, new ProviderTokenError('the page did not answer the ChatGPT token request in time', { code: 'PROVIDER_TOKEN_TIMEOUT' })), timeoutMs)
    inflight = { id, reason, promise, resolve, reject, timer }
    stats.requests++
    stats.reasons.push(reason)
    post({ type: 'provider-token-request', id, reason })
    return promise
  }

  function settle (id, value, err) {
    if (!inflight || inflight.id !== id) return false
    const f = inflight
    inflight = null
    clearTimer(f.timer)
    if (err) f.reject(err)
    else f.resolve(value)
    return true
  }

  /** Feed every message from the page; returns true if it was a token answer. */
  function onMessage (m) {
    if (!m || m.type !== 'provider-token') return false
    if (!inflight || m.id !== inflight.id) return true // stale or unknown: ignore
    if (m.error || typeof m.accessToken !== 'string' || !m.accessToken) {
      settle(m.id, null, new ProviderTokenError(m.error ? String(m.error) : 'the page sent no ChatGPT access token', { code: 'PROVIDER_TOKEN_REFUSED' }))
      return true
    }
    let exp = Number(m.expiresAt)
    if (Number.isFinite(exp) && exp > 0 && exp < 1e12) exp *= 1000 // seconds, defensively
    const t = now()
    cached = { accessToken: m.accessToken, expiresAt: Number.isFinite(exp) && exp > 0 ? exp : t + defaultTtlMs, obtainedAt: t }
    settle(m.id, cached)
    return true
  }

  const fresh = (c) => c && now() < c.expiresAt - skewMs

  /** A usable access token: the cached one, or ask the page ('start' the first time, 'expired' after). */
  async function get () {
    if (fresh(cached)) return cached
    return ask(cached ? 'expired' : 'start')
  }

  /**
   * After an upstream 401 (or, with `ambiguous`, an unreadable failure)
   * with `failedToken`. Resolves to a different token, or null when
   * renewing makes no sense (an ambiguous failure right after a renewal).
   */
  async function renew (failedToken, { ambiguous = false } = {}) {
    if (cached && cached.accessToken !== failedToken && fresh(cached)) return cached
    if (inflight) return inflight.promise
    if (ambiguous && cached && cached.accessToken === failedToken && now() - cached.obtainedAt < minRenewMs) return null
    cached = null
    return ask('unauthorized')
  }

  function clear () { cached = null }

  return { get, renew, onMessage, clear, stats, get cached () { return cached } }
}
