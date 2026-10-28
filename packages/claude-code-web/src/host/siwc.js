// "Sign in with ChatGPT" (SIWC) for the ChatGPT subscription option
// (ARCHITECTURE.md Appendix A; protocol in docs/research/claude-code-in-browser/
// J-codex-protocol.md §3c, CORS and terms in K-codex-cors-terms.md).
//
// This is OpenAI's documented route for open-source apps: dynamic client
// registration (`client_id=dynamic_agent_client` the first time, then the
// issued `oaiapp_…` id), scope `chatgpt.tokens.use.direct`, and inference on
// https://api.openai.com/v1/responses with the user's bearer token. Nothing
// here presents as the Codex CLI: no `originator`, no `chatgpt-account-id`, no
// Codex User-Agent, and `agent_name_hint` is this app's own name.
//
// The redirect must be an http loopback URL on 127.0.0.1, which a page cannot
// listen on. So the page opens the authorize URL in a new tab, the browser
// ends on a "can't connect" page at http://127.0.0.1:1455/auth/callback?code=…,
// and the user pastes that URL back (pi-ai's documented fallback does the
// same). auth.openai.com answers any origin (ACAO: *), so the code exchange
// and the refreshes are plain fetches from the page.
//
// Tokens are kept exactly like the other credentials (settings.js:
// sessionStorage unless "Remember on this device"). The page owns them: the
// Worker only ever gets an access token, through `getAccessToken()` and the
// token handoff in worker-bridge.js; the refresh token never leaves the page.
//
// Nothing in this module touches the network except through the injected
// `fetch`; PKCE uses WebCrypto unless `random` / `sha256` are injected.

import { checkChatgptUrls } from './invocation.js'
import { createJsonStore } from './persist.js'
import { DEFAULT_CHATGPT_ISSUER, DEFAULT_CHATGPT_MODEL, chatgptConfig } from './settings.js'

export { chatgptConfig, checkChatgptUrls }

export const DYNAMIC_CLIENT_ID = 'dynamic_agent_client'
export const AGENT_NAME_HINT = 'claude-code-web'
/** The docs: an http loopback on 127.0.0.1 ("Do not substitute with localhost"); only the port may vary. */
export const REDIRECT_URI = 'http://127.0.0.1:1455/auth/callback'
export const SCOPE = 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct'
export const PLAN_SCOPE = 'chatgpt.tokens.use.direct'
/** The token audience: always the public API, also when the base URL points at a mock. */
export const RESOURCE = 'https://api.openai.com/v1'
export const AUTHORIZE_PATH = '/api/accounts/authorize'
export const TOKEN_PATH = '/api/accounts/oauth/token'
export const REVOKE_PATH = '/api/accounts/oauth/revoke'
/** Refresh when the access token has less than this left (Codex uses the same 5 minutes). */
export const REFRESH_WINDOW_MS = 5 * 60_000
export const PENDING_KEY = 'cc-web:siwc-pending'
export const REFRESH_LOCK = 'cc-web:siwc-refresh'
/**
 * How long a token-endpoint POST (code exchange or refresh) may take. A
 * refresh runs under the cross-tab lock REFRESH_LOCK, so an issuer that never
 * answers must not hold it, and every tab's refreshes, forever.
 */
export const TOKEN_TIMEOUT_MS = 30_000
/** Clock skew tolerated when checking an ID token's `exp`. */
export const ID_TOKEN_LEEWAY_S = 120

/**
 * Shown until the live list (`listModels`) arrives, and used when it cannot
 * be fetched. gpt-5.5 is the one catalog model that takes the classic
 * Responses tools shape (report J §5); the live list names the others.
 */
export const FALLBACK_MODELS = Object.freeze([
  Object.freeze({ slug: DEFAULT_CHATGPT_MODEL, displayName: 'GPT-5.5', contextWindow: 272_000 })
])

export class SiwcError extends Error {
  /**
   * @param {'config'|'no-pending'|'bad-callback'|'state-mismatch'|'nonce'|'id-token'|'scope'|'signed-out'|'reauth'|'not-yet'|'network'|'http'} code
   */
  constructor (code, message, extra = {}) {
    super(message)
    this.name = 'SiwcError'
    this.code = code
    Object.assign(this, extra)
  }
}

// --- pure helpers --------------------------------------------------------------

/** base64url without padding (RFC 7636 §3). */
export function base64url (bytes) {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode (text) {
  const b64 = String(text).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

function webRandom (n) {
  const c = globalThis.crypto
  if (!c?.getRandomValues) throw new SiwcError('config', 'This browser has no crypto.getRandomValues, which signing in needs.')
  const b = new Uint8Array(n)
  c.getRandomValues(b)
  return b
}

async function webSha256 (bytes) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) throw new SiwcError('config', 'This page is not in a secure context (https or localhost), so WebCrypto is unavailable and signing in cannot work.')
  return new Uint8Array(await subtle.digest('SHA-256', bytes))
}

/**
 * A PKCE S256 pair: 64 random bytes as the verifier (86 characters), its
 * SHA-256 as the challenge.
 * @param {{random?: (n: number) => Uint8Array, sha256?: (bytes: Uint8Array) => Promise<Uint8Array>|Uint8Array}} [deps]
 */
export async function pkce ({ random = webRandom, sha256 = webSha256 } = {}) {
  const verifier = base64url(random(64))
  const challenge = base64url(await sha256(new TextEncoder().encode(verifier)))
  return { verifier, challenge, method: 'S256' }
}

/** A version-4 UUID from 16 random bytes. */
export function uuidFrom (bytes) {
  const b = Uint8Array.from(bytes.slice(0, 16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const trimSlash = (u) => String(u ?? '').trim().replace(/\/+$/, '')

/**
 * The authorize URL. `agent_name_hint` goes only with the first (dynamic)
 * registration: the docs call it display metadata for that step.
 */
export function buildAuthorizeUrl ({ issuer = DEFAULT_CHATGPT_ISSUER, clientId = DYNAMIC_CLIENT_ID, extAgentHostId, codeChallenge, state, nonce, redirectUri = REDIRECT_URI, scope = SCOPE, resource = RESOURCE, agentNameHint = AGENT_NAME_HINT }) {
  for (const [k, v] of Object.entries({ extAgentHostId, codeChallenge, state, nonce })) {
    if (!v) throw new TypeError(`buildAuthorizeUrl: ${k} is required`)
  }
  const id = clientId || DYNAMIC_CLIENT_ID
  const params = [
    ['response_type', 'code'],
    ['client_id', id],
    ['redirect_uri', redirectUri],
    ['scope', scope],
    ['resource', resource],
    ['code_challenge', codeChallenge],
    ['code_challenge_method', 'S256'],
    ['state', state],
    ['nonce', nonce],
    ['ext_agent_host_id', extAgentHostId]
  ]
  if (id === DYNAMIC_CLIENT_ID && agentNameHint) params.push(['agent_name_hint', agentNameHint])
  return `${trimSlash(issuer)}${AUTHORIZE_PATH}?${params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`
}

/**
 * The URL the browser ended on after signing in (the failed loopback
 * redirect), as pasted: a full URL, or just its query. Returns
 * {code, state, clientId}; throws a SiwcError the page can show.
 */
export function parseCallbackUrl (pasted) {
  const raw = String(pasted ?? '').trim()
  if (!raw) throw new SiwcError('bad-callback', 'Paste the address of the tab that opened after signing in (it starts with http://127.0.0.1:1455/auth/callback).')
  let params
  try {
    const u = new URL(raw)
    params = new URLSearchParams(u.search)
    // tolerate a fragment response, should a server ever use one
    if (!params.has('code') && !params.has('error') && u.hash.length > 1) params = new URLSearchParams(u.hash.slice(1))
  } catch {
    params = new URLSearchParams(raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : raw.replace(/^#/, ''))
  }
  const error = params.get('error')
  if (error) {
    const why = params.get('error_description')
    throw new SiwcError('bad-callback', `Sign-in was not completed: ${error}${why ? ` (${why})` : ''}.`, { oauthError: error })
  }
  const code = params.get('code')
  if (!code) throw new SiwcError('bad-callback', 'That address has no code= in it. After signing in, copy the address of the tab that could not connect to 127.0.0.1 (not the sign-in page itself).')
  return { code, state: params.get('state') ?? '', clientId: params.get('client_id') ?? '' }
}

/** The payload of a JWT, or null. No signature check: see K §4.8 (the JWKS is not CORS-readable). */
export function decodeJwt (token) {
  if (typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const json = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])))
    return json && typeof json === 'object' ? json : null
  } catch { return null }
}

/**
 * Why an ID token cannot be accepted, as {code, why}, or null when it can.
 * Its signature cannot be checked (the JWKS is not CORS-readable, K §4.8), so
 * these are the claim checks of OIDC Core §3.1.3.7 that need no key: `iss` is
 * the issuer signed in with, `aud` is (or, as a list, includes) the issued
 * client id, `exp` has not passed (give or take `leewayS`), and, when `nonce`
 * is given (a sign-in; a refresh has none to compare), the token carries
 * exactly that nonce.
 */
export function idTokenProblem (claims, { issuer, clientId, nonce, now = Date.now(), leewayS = ID_TOKEN_LEEWAY_S } = {}) {
  const bad = (why) => ({ code: 'id-token', why })
  if (!claims) return bad('it is not a readable JWT')
  if (!issuer || typeof claims.iss !== 'string' || trimSlash(claims.iss) !== trimSlash(issuer)) return bad(`its issuer ${JSON.stringify(claims.iss ?? null)} is not ${trimSlash(issuer)}`)
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  if (!clientId || !aud.includes(clientId)) return bad(`its audience ${JSON.stringify(claims.aud ?? null)} is not this app's client id ${clientId}`)
  const exp = Number(claims.exp)
  if (claims.exp == null || !Number.isFinite(exp) || exp <= 0) return bad('it has no expiry (exp)')
  if ((exp + leewayS) * 1000 < now) return bad(`it expired at ${new Date(exp * 1000).toISOString()}`)
  if (nonce !== undefined) {
    if (claims.nonce == null || claims.nonce === '') return { code: 'nonce', why: 'it carries no nonce' }
    if (claims.nonce !== nonce) return { code: 'nonce', why: 'nonce mismatch' }
  }
  return null
}

/**
 * A time from a token response (`earliest_refresh_at`) as epoch ms: unix
 * seconds or ms, an ISO string, or a small number taken as seconds from now.
 */
export function parseTime (v, now = Date.now()) {
  if (v == null || v === '') return 0
  const n = typeof v === 'number' ? v : /^\s*\d+(\.\d+)?\s*$/.test(String(v)) ? Number(v) : NaN
  if (Number.isFinite(n)) {
    if (n <= 0) return 0
    if (n < 1e9) return now + n * 1000 // relative seconds (no absolute time is that small)
    return n < 1e12 ? n * 1000 : n
  }
  const t = Date.parse(String(v))
  return Number.isFinite(t) ? t : 0
}

/** The stored token set from a token-endpoint response. A refresh that returns no new refresh/id token keeps the old one. */
export function tokensFromResponse (json, { now = Date.now(), previous = null } = {}) {
  const accessToken = typeof json?.access_token === 'string' ? json.access_token : ''
  const expiresIn = Number(json?.expires_in)
  let expiresAt
  if (Number.isFinite(expiresIn) && expiresIn > 0) expiresAt = now + expiresIn * 1000
  else {
    const exp = Number(decodeJwt(accessToken)?.exp)
    expiresAt = Number.isFinite(exp) && exp > 0 ? exp * 1000 : now + 3600_000
  }
  return {
    accessToken,
    refreshToken: (typeof json?.refresh_token === 'string' && json.refresh_token) || previous?.refreshToken || '',
    idToken: (typeof json?.id_token === 'string' && json.id_token) || previous?.idToken || '',
    expiresAt,
    earliestRefreshAt: parseTime(json?.earliest_refresh_at, now)
  }
}

/** {code, message} from an OAuth or OpenAI error body (`{error: 'x'}`, `{error: {code, message}}` or `{detail}`). */
export function parseOAuthError (status, json, text = '') {
  const e = json?.error
  if (e && typeof e === 'object') return { code: String(e.code ?? e.type ?? ''), message: String(e.message ?? '') }
  if (typeof e === 'string') return { code: String(json.code ?? e), message: String(json.error_description ?? json.message ?? e) }
  if (json?.detail) {
    const d = json.detail
    return typeof d === 'object' ? { code: String(d.code ?? ''), message: String(d.message ?? '') } : { code: '', message: String(d) }
  }
  return { code: '', message: String(text || `HTTP ${status}`).slice(0, 300) }
}

const PERMANENT = new Set(['refresh_token_expired', 'refresh_token_reused', 'refresh_token_invalidated', 'invalid_refresh_token', 'invalid_grant', 'token_expired', 'invalid_client', 'subscription_sharing_invalid_user'])

/** A refresh failure only a new sign-in fixes (Codex's rule, J §3a). */
export function isPermanentAuthError (status, code) {
  return status === 401 || PERMANENT.has(code)
}

/** The live model list, shown in the model dropdown: only `visibility: "list"` entries. */
export function normaliseModels (json) {
  const list = Array.isArray(json?.models) ? json.models : []
  return list
    .filter((m) => m && typeof m.slug === 'string' && m.slug && m.visibility === 'list')
    .map((m) => {
      const out = { slug: m.slug, displayName: typeof m.display_name === 'string' && m.display_name ? m.display_name : m.slug, contextWindow: Number(m.context_window) > 0 ? Number(m.context_window) : null }
      const levels = Array.isArray(m.supported_reasoning_levels) ? m.supported_reasoning_levels.map((l) => (typeof l === 'string' ? l : l?.effort)).filter((l) => typeof l === 'string') : null
      if (levels?.length) out.efforts = levels
      if (typeof m.default_reasoning_level === 'string') out.defaultEffort = m.default_reasoning_level
      return out
    })
}

// --- the stateful part -----------------------------------------------------------

/**
 * @param {object} o
 * @param {ReturnType<import('./settings.js').createSettings>} o.settings
 * @param {typeof fetch} [o.fetch]
 * @param {() => number} [o.now]
 * @param {(n: number) => Uint8Array} [o.random]   default crypto.getRandomValues
 * @param {(bytes: Uint8Array) => Promise<Uint8Array>} [o.sha256]  default crypto.subtle
 * @param {Storage} [o.sessionStorage]  where a sign-in in progress keeps its verifier/state (this tab)
 * @param {LockManager|null} [o.locks]  serialises refreshes across tabs (default navigator.locks)
 * @param {number} [o.tokenTimeoutMs]  limit on each token-endpoint POST (default TOKEN_TIMEOUT_MS; 0: none)
 */
export function createSiwc ({ settings, fetch, now = Date.now, random, sha256, sessionStorage, locks, tokenTimeoutMs = TOKEN_TIMEOUT_MS } = {}) {
  if (!settings?.get) throw new TypeError('createSiwc: settings are required')
  const fetchImpl = fetch ?? globalThis.fetch?.bind(globalThis)
  const rnd = random ?? webRandom
  const lockManager = locks === undefined ? globalThis.navigator?.locks ?? null : locks
  const pending = createJsonStore(PENDING_KEY, { storage: sessionStorage, area: 'sessionStorage' })
  const events = new EventTarget()
  let inflight = null
  let models = null

  const cfg = () => chatgptConfig(settings.get().chatgpt)
  const tokens = () => settings.get().chatgptTokens
  const changed = () => events.dispatchEvent(new CustomEvent('change', { detail: status() }))

  function assertUrls () {
    const why = checkChatgptUrls(settings.get().chatgpt)
    if (why) throw new SiwcError('config', why)
  }

  async function post (url, params, what) {
    if (!fetchImpl) throw new SiwcError('network', 'fetch is not available')
    // the limit covers the answer's body as well as its headers
    const signal = tokenTimeoutMs > 0 && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(tokenTimeoutMs) : undefined
    const timedOut = () => new SiwcError('network', `${what}: ${new URL(url).origin} did not answer within ${tokenTimeoutMs >= 1000 ? `${Math.round(tokenTimeoutMs / 1000)} s` : `${tokenTimeoutMs} ms`}.`, { timeout: true })
    let res
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        // a form body and these headers make it a "simple" request: no preflight
        headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
        body: new URLSearchParams(params).toString(),
        credentials: 'omit',
        cache: 'no-store',
        signal
      })
    } catch (err) {
      if (signal?.aborted) throw timedOut()
      throw new SiwcError('network', `${what}: could not reach ${new URL(url).origin} (${err?.message ?? err}).`)
    }
    let text = ''
    try { text = await res.text() } catch { if (signal?.aborted) throw timedOut() }
    let json = null
    try { json = text ? JSON.parse(text) : null } catch {}
    if (!res.ok) {
      const e = parseOAuthError(res.status, json, text)
      const permanent = isPermanentAuthError(res.status, e.code)
      throw new SiwcError(permanent ? 'reauth' : 'http', `${what} failed (HTTP ${res.status}${e.code ? `, ${e.code}` : ''})${e.message ? `: ${e.message}` : ''}${permanent ? ' Sign in with ChatGPT again.' : ''}`, { status: res.status, oauthCode: e.code })
    }
    if (!json || typeof json !== 'object') throw new SiwcError('http', `${what}: the answer was not JSON.`, { status: res.status })
    return json
  }

  function status () {
    const t = tokens()
    const claims = decodeJwt(t?.idToken) ?? {}
    const auth = claims['https://api.openai.com/auth'] ?? {}
    const profile = claims['https://api.openai.com/profile'] ?? {}
    return {
      signedIn: Boolean(t),
      clientId: cfg().clientId,
      email: String(claims.email ?? profile.email ?? ''),
      plan: String(auth.chatgpt_plan_type ?? ''),
      expiresAt: t?.expiresAt ?? 0,
      pending: Boolean(pending.load()?.state)
    }
  }

  async function beginLogin () {
    assertUrls()
    const c = cfg()
    let hostId = c.extAgentHostId
    if (!/^urn:uuid:[0-9a-f-]{36}$/i.test(hostId)) {
      hostId = `urn:uuid:${uuidFrom(rnd(16))}`
      settings.set({ chatgpt: { extAgentHostId: hostId } })
    }
    const { verifier, challenge } = await pkce({ random: rnd, sha256 })
    const state = base64url(rnd(32))
    const nonce = base64url(rnd(32))
    const clientId = c.clientId || DYNAMIC_CLIENT_ID
    pending.save({ verifier, state, nonce, clientId, issuer: c.issuer, at: now() })
    const url = buildAuthorizeUrl({ issuer: c.issuer, clientId, extAgentHostId: hostId, codeChallenge: challenge, state, nonce })
    changed()
    return { url, state }
  }

  async function completeLogin (pastedUrl) {
    const cb = parseCallbackUrl(pastedUrl)
    const p = pending.load()
    if (!p?.state || !p.verifier) throw new SiwcError('no-pending', 'No sign-in is in progress in this tab. Press "Open sign-in" first, then paste the address the sign-in tab ends on.')
    if (cb.state !== p.state) throw new SiwcError('state-mismatch', 'That address belongs to a different sign-in attempt (its state does not match). Paste the address from the newest sign-in tab, or press "Open sign-in" again. (If the Codex CLI or another app is signing in on this computer at the same time, it may have taken the callback.)')
    const clientId = cb.clientId || (p.clientId !== DYNAMIC_CLIENT_ID ? p.clientId : '')
    if (!clientId) throw new SiwcError('bad-callback', 'That address has no client_id=: the first sign-in registers this app and the callback must carry the issued client id. Paste the complete address.')
    // the registration happened: keep the issued id even if the exchange below fails
    if (clientId !== cfg().clientId) settings.set({ chatgpt: { clientId } })
    let json
    try {
      json = await post(`${trimSlash(p.issuer)}${TOKEN_PATH}`, {
        grant_type: 'authorization_code',
        client_id: clientId,
        code: cb.code,
        code_verifier: p.verifier,
        redirect_uri: REDIRECT_URI,
        resource: RESOURCE
      }, 'Signing in')
    } catch (err) {
      if (err.code !== 'network') { pending.clear(); changed() } // the code is single-use
      throw err
    }
    if (typeof json.scope === 'string' && !json.scope.split(/\s+/).includes(PLAN_SCOPE)) {
      pending.clear()
      changed()
      throw new SiwcError('scope', `Signed in, but OpenAI did not grant ChatGPT plan usage (${PLAN_SCOPE}). It needs an eligible ChatGPT Plus or Pro plan.`)
    }
    const next = tokensFromResponse(json, { now: now() })
    if (!next.accessToken) throw new SiwcError('http', 'Signing in: the answer had no access_token.')
    // The ID token only supplies the email and plan shown; with none there is
    // nothing to check. One that is there must be this sign-in's.
    const bad = next.idToken ? idTokenProblem(decodeJwt(next.idToken), { issuer: p.issuer, clientId, nonce: p.nonce ?? '', now: now() }) : null
    if (bad) {
      pending.clear()
      changed()
      throw new SiwcError(bad.code, `The ID token does not belong to this sign-in (${bad.why}). Sign in again.`)
    }
    settings.set({ chatgptTokens: next })
    pending.clear()
    models = null
    changed()
    return status()
  }

  /** Runs `fn` under the cross-tab refresh lock where Web Locks exist. */
  function withLock (fn) {
    if (!lockManager?.request) return fn()
    return lockManager.request(REFRESH_LOCK, fn)
  }

  async function refresh ({ force, seen }) {
    // Another tab of this origin may have rotated the refresh token (possible
    // only with "Remember on this device": sessionStorage is per tab).
    if (settings.get().remember) settings.reload?.()
    const t = tokens()
    if (!t) throw new SiwcError('signed-out', 'Not signed in with ChatGPT. Sign in first (Settings).')
    const n = now()
    const current = { accessToken: t.accessToken, expiresAt: t.expiresAt }
    const fresh = t.accessToken && n < t.expiresAt - REFRESH_WINDOW_MS
    // someone refreshed while we waited for the lock
    if (fresh && (!force || t.accessToken !== seen)) return current
    const stillValid = t.accessToken && n < t.expiresAt
    if (t.earliestRefreshAt && n < t.earliestRefreshAt) {
      if (!force && stillValid) return current
      throw new SiwcError('not-yet', `The ChatGPT access token was refused and OpenAI allows no refresh before ${new Date(t.earliestRefreshAt).toISOString()}. Sign in with ChatGPT again.`)
    }
    if (!t.refreshToken) {
      if (!force && stillValid) return current
      throw new SiwcError('reauth', 'The ChatGPT sign-in has expired. Sign in again.')
    }
    const c = cfg()
    let json
    try {
      json = await post(`${c.issuer}${TOKEN_PATH}`, { grant_type: 'refresh_token', client_id: c.clientId, refresh_token: t.refreshToken, resource: RESOURCE }, 'Refreshing the ChatGPT sign-in')
    } catch (err) {
      if (err.code === 'reauth') { settings.set({ chatgptTokens: null }); changed() }
      throw err
    }
    const next = tokensFromResponse(json, { now: now(), previous: t })
    if (!next.accessToken) throw new SiwcError('http', 'Refreshing the ChatGPT sign-in: the answer had no access_token.')
    // A new ID token that fails the claim checks is not kept (it only feeds
    // the email and plan shown). The refresh itself stands: its refresh token
    // has already rotated, so refusing it here would sign the user out.
    if (json.id_token && idTokenProblem(decodeJwt(next.idToken), { issuer: c.issuer, clientId: c.clientId, now: now() })) next.idToken = t.idToken || ''
    // refresh tokens rotate: the new one is saved before anyone gets the access token
    settings.set({ chatgptTokens: next })
    changed()
    return { accessToken: next.accessToken, expiresAt: next.expiresAt }
  }

  /**
   * A usable access token {accessToken, expiresAt}. Refreshes (single-flight)
   * when less than 5 minutes are left, or with `force` (the API refused the
   * token), unless OpenAI's `earliest_refresh_at` has not passed yet.
   */
  function getAccessToken ({ force = false } = {}) {
    if (inflight) return inflight
    const t = tokens()
    if (!t) return Promise.reject(new SiwcError('signed-out', 'Not signed in with ChatGPT. Sign in first (Settings).'))
    if (!force && t.accessToken && now() < t.expiresAt - REFRESH_WINDOW_MS) return Promise.resolve({ accessToken: t.accessToken, expiresAt: t.expiresAt })
    if (!force && t.accessToken && t.earliestRefreshAt && now() < t.earliestRefreshAt && now() < t.expiresAt) {
      return Promise.resolve({ accessToken: t.accessToken, expiresAt: t.expiresAt })
    }
    const seen = t.accessToken
    inflight = withLock(() => refresh({ force, seen })).finally(() => { inflight = null })
    return inflight
  }

  async function listModels () {
    assertUrls()
    const { baseUrl } = cfg()
    const call = async (accessToken) => {
      try {
        return await fetchImpl(`${baseUrl}/models`, { headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' }, credentials: 'omit', cache: 'no-store' })
      } catch (err) {
        return { networkError: err }
      }
    }
    let res = await call((await getAccessToken()).accessToken)
    // A refused token is a readable 401, or (OpenAI's edge layer sends no
    // CORS headers, K §1c) a TypeError: refresh once and retry once.
    if (res.networkError || res.status === 401) res = await call((await getAccessToken({ force: true })).accessToken)
    if (res.networkError) throw new SiwcError('network', `Could not list the ChatGPT models (${res.networkError?.message ?? res.networkError}).`)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let json = null
      try { json = JSON.parse(text) } catch {}
      const e = parseOAuthError(res.status, json, text)
      throw new SiwcError('http', `Listing the ChatGPT models failed (HTTP ${res.status}${e.code ? `, ${e.code}` : ''})${e.message ? `: ${e.message}` : ''}`, { status: res.status })
    }
    models = normaliseModels(await res.json())
    changed()
    return models
  }

  /** The context window of a model slug: the live list, else the fallback list, else null. */
  function contextWindowFor (slug) {
    const m = (models ?? []).find((x) => x.slug === slug) ?? FALLBACK_MODELS.find((x) => x.slug === slug)
    return m?.contextWindow ?? null
  }

  /**
   * Forget the tokens (the app registration and host id stay, so the next
   * sign-in reuses them). Best effort: revoke the refresh token at the issuer.
   */
  async function logout ({ revoke = true, timeoutMs = 3000 } = {}) {
    const t = tokens()
    const c = cfg()
    settings.set({ chatgptTokens: null })
    pending.clear()
    models = null
    changed()
    if (!revoke || !t?.refreshToken || !fetchImpl || !c.clientId) return { revoked: false }
    try {
      const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined
      const res = await fetchImpl(`${c.issuer}${REVOKE_PATH}`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token: t.refreshToken, token_type_hint: 'refresh_token', client_id: c.clientId }).toString(),
        credentials: 'omit',
        cache: 'no-store',
        signal
      })
      return { revoked: res.ok }
    } catch {
      return { revoked: false }
    }
  }

  /** Drop a sign-in in progress (its verifier and state). */
  function cancelLogin () { pending.clear(); changed() }

  return {
    beginLogin,
    completeLogin,
    cancelLogin,
    getAccessToken,
    listModels,
    logout,
    status,
    contextWindowFor,
    get models () { return models ? [...models] : null },
    config: cfg,
    addEventListener: (...a) => events.addEventListener(...a),
    removeEventListener: (...a) => events.removeEventListener(...a)
  }
}
