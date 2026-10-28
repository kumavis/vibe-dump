// The Worker's egress guard (defence in depth; the policy flags already keep
// the CLI from calling anything but the API). Installed by boot.js before
// any Claude Code module loads, it wraps the Worker's fetch and WebSocket:
//
//   - a request to a host outside {the ANTHROPIC_BASE_URL origin,
//     https://api.anthropic.com, this page's own origin} is refused;
//   - a request that carries a credential header (authorization, x-api-key)
//     to any origin but the ANTHROPIC_BASE_URL one is refused.
//
// A refusal rejects like a network failure (TypeError) and is logged with
// the method, URL and the names (never the values) of the credential
// headers. data: and blob: URLs never leave the browser and pass.
//
// ChatGPT mode (provider kind 'openai-responses', ARCHITECTURE.md Appendix
// A): the allowed origins are {the provider's API origin, this page}, and
// credential headers may go only to the provider's origin. The CLI's own
// ANTHROPIC_BASE_URL is then the synthetic adapter origin, which the OpenAI
// adapter (installed on top of this guard) answers locally; should a request
// for it ever get past the adapter, it is refused here like any other host.

export const ANTHROPIC_API_ORIGIN = 'https://api.anthropic.com'
const CREDENTIAL_HEADERS = ['authorization', 'x-api-key']

export class EgressRefusedError extends TypeError {
  constructor (message) {
    super(message)
    this.name = 'TypeError' // what a failed fetch rejects with
    this.code = 'EGRESS_REFUSED'
  }
}

/**
 * The decision, as a pure function (unit-tested).
 * @param {object} o
 * @param {string} o.url          absolute URL
 * @param {string[]} [o.headerNames]  lower-case header names
 * @param {{base: string, allowed: Set<string>}} policy  origins
 * @returns {string|null}  why the request is refused, or null
 */
export function egressVerdict ({ url, headerNames = [] }, policy) {
  let u
  try { u = new URL(url) } catch { return `not a valid URL: ${url}` }
  if (u.protocol === 'data:' || u.protocol === 'blob:') return null
  const origin = httpOrigin(u)
  if (!origin) return `protocol ${u.protocol} is not allowed`
  if (!policy.allowed.has(origin)) return policy.provider ? `${origin} is not the ChatGPT API (${policy.base}) or this page` : `${origin} is not the API base URL, ${ANTHROPIC_API_ORIGIN} or this page`
  const creds = headerNames.filter((h) => CREDENTIAL_HEADERS.includes(h))
  if (creds.length && origin !== policy.base) return `it carries ${creds.join(' and ')} to ${origin}, which is not the ${policy.provider ? 'ChatGPT API' : 'API base URL'} (${policy.base})`
  return null
}

/** ws: and wss: count as their http(s) origins. */
function httpOrigin (u) {
  const proto = { 'http:': 'http:', 'https:': 'https:', 'ws:': 'http:', 'wss:': 'https:' }[u.protocol]
  return proto ? `${proto}//${u.host}` : null
}

/**
 * @param {object} o
 * @param {string} [o.baseUrl]     ANTHROPIC_BASE_URL
 * @param {string} [o.selfOrigin]  the page's origin
 * @param {object} [o.provider]    the boot message's provider; kind 'openai-responses' switches to ChatGPT mode
 */
export function egressPolicy ({ baseUrl, selfOrigin, provider }) {
  if (provider?.kind === 'openai-responses') {
    let base
    try { base = new URL(provider.baseUrl).origin } catch { base = null }
    // An unusable provider URL allows nothing but the page itself.
    const allowed = new Set(base && base !== 'null' ? [base] : [])
    if (selfOrigin) allowed.add(selfOrigin)
    return { base: base || 'none', allowed, provider: 'openai-responses' }
  }
  let base
  try { base = new URL(baseUrl || ANTHROPIC_API_ORIGIN).origin } catch { base = ANTHROPIC_API_ORIGIN }
  const allowed = new Set([base, ANTHROPIC_API_ORIGIN])
  if (selfOrigin) allowed.add(selfOrigin)
  return { base, allowed }
}

function headerNamesOf (input, init) {
  const names = new Set()
  const add = (h) => {
    if (!h) return
    if (typeof h.forEach === 'function' && !Array.isArray(h)) h.forEach((_, k) => names.add(String(k).toLowerCase()))
    else for (const [k] of Array.isArray(h) ? h : Object.entries(h)) names.add(String(k).toLowerCase())
  }
  if (input && typeof input === 'object' && 'headers' in input) add(input.headers)
  add(init?.headers)
  return [...names]
}

/**
 * Wrap scope.fetch and scope.WebSocket.
 * @param {object} scope   the Worker global (or a stand-in in tests)
 * @param {object} o
 * @param {string} o.baseUrl     ANTHROPIC_BASE_URL
 * @param {string} o.selfOrigin  the page's origin (the Worker's own requests)
 * @param {object} [o.provider]   ChatGPT mode when its kind is 'openai-responses' (see egressPolicy)
 * @param {(msg: string) => void} [o.warn]
 * @returns {{policy: object, refused: object[]}}
 */
export function installEgressGuard (scope, { baseUrl, selfOrigin, provider, warn = () => {} }) {
  const policy = egressPolicy({ baseUrl, selfOrigin, provider })
  const refused = []
  const refuse = (kind, method, url, why, headerNames) => {
    const creds = headerNames.filter((h) => CREDENTIAL_HEADERS.includes(h))
    refused.push({ kind, method, url, why, credentialHeaders: creds })
    warn(`egress guard: refused ${kind} ${method} ${url}: ${why}`)
    return new EgressRefusedError(`egress guard: ${method} ${url} refused: ${why}`)
  }
  const resolve = (url) => new URL(String(url), selfOrigin ? `${selfOrigin}/` : undefined).href

  const realFetch = scope.fetch
  if (typeof realFetch === 'function') {
    scope.fetch = function fetch (input, init) {
      let url
      try {
        url = resolve(typeof input === 'string' || input instanceof URL ? input : input?.url)
      } catch (err) {
        return realFetch.call(this, input, init) // let fetch report its own TypeError
      }
      const method = String(init?.method ?? input?.method ?? 'GET').toUpperCase()
      const headerNames = headerNamesOf(input, init)
      const why = egressVerdict({ url, headerNames }, policy)
      if (why) return Promise.reject(refuse('fetch', method, url, why, headerNames))
      return realFetch.call(this, input, init)
    }
  }

  const RealWebSocket = scope.WebSocket
  if (typeof RealWebSocket === 'function') {
    const Guarded = class WebSocket extends RealWebSocket {
      constructor (url, protocols) {
        let abs
        try { abs = resolve(url) } catch { abs = String(url) }
        const why = egressVerdict({ url: abs }, policy)
        if (why) throw refuse('WebSocket', 'GET', abs, why, [])
        super(url, protocols)
      }
    }
    scope.WebSocket = Guarded
  }
  return { policy, refused }
}
