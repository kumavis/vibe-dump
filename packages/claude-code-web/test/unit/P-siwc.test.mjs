// Track P: Sign in with ChatGPT (src/host/siwc.js): the pure helpers, and
// createSiwc against a fake fetch (exchange, refresh with rotation,
// earliest_refresh_at, single flight, model list, logout) and against the
// mock's fake issuer.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  buildAuthorizeUrl, parseCallbackUrl, pkce, base64url, decodeJwt, parseTime, tokensFromResponse, parseOAuthError,
  isPermanentAuthError, normaliseModels, createSiwc, SiwcError, DYNAMIC_CLIENT_ID, REDIRECT_URI, SCOPE, RESOURCE,
  REFRESH_WINDOW_MS, PENDING_KEY, FALLBACK_MODELS, uuidFrom
} from '../../src/host/siwc.js'
import { createSettings, SETTINGS_KEY, SECRETS_KEY } from '../../src/host/settings.js'
import { startMockApi } from '../../mock/mock-api.mjs'

function memoryStorage () {
  const m = new Map()
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }
}

const jwt = (payload) => `${base64url(new TextEncoder().encode('{"alg":"none"}'))}.${base64url(new TextEncoder().encode(JSON.stringify(payload)))}.sig`
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/** A fake issuer + models endpoint as a fetch function; records every call. */
function fakeOpenAI ({ clock, rotate = true, expiresIn = 3600, earliest, models } = {}) {
  const calls = []
  let n = 0
  const issued = { refresh: new Set(['rt_0']), used: new Set(), access: new Set(['at_0']) }
  const f = async (url, init = {}) => {
    const u = new URL(url)
    const form = init.body ? Object.fromEntries(new URLSearchParams(init.body)) : null
    calls.push({ url: u.pathname, method: init.method ?? 'GET', form, headers: init.headers })
    if (f.fail) { const r = f.fail; f.fail = null; if (r === 'network') throw new TypeError('Failed to fetch'); return json(r.status, r.body) }
    if (u.pathname === '/api/accounts/oauth/token') {
      if (form.grant_type === 'refresh_token') {
        if (issued.used.has(form.refresh_token)) return json(401, { error: { code: 'refresh_token_reused', message: 'already used' } })
        if (!issued.refresh.has(form.refresh_token)) return json(401, { error: { code: 'invalid_refresh_token', message: 'unknown' } })
        if (rotate) issued.used.add(form.refresh_token)
      }
      n++
      const at = `at_${n}`
      issued.access.add(at)
      const body = { access_token: at, id_token: jwt({ email: 'u@example.com', nonce: f.nonce, 'https://api.openai.com/auth': { chatgpt_plan_type: 'pro' } }), token_type: 'Bearer', expires_in: expiresIn, scope: f.scope ?? SCOPE }
      if (rotate || form.grant_type === 'authorization_code') { body.refresh_token = `rt_${n}`; issued.refresh.add(body.refresh_token) }
      if (earliest !== undefined) body.earliest_refresh_at = earliest
      return json(200, body)
    }
    if (u.pathname === '/api/accounts/oauth/revoke') return json(200, {})
    if (u.pathname === '/v1/models') {
      const bearer = String(init.headers?.authorization ?? '').replace(/^Bearer /, '')
      if (f.refuseModelsOnce && !f.refusedOnce) { f.refusedOnce = true; if (f.refuseModelsOnce === 'network') throw new TypeError('Failed to fetch'); return json(401, { error: { code: 'token_invalidated' } }) }
      if (!issued.access.has(bearer)) return json(401, { error: { code: 'invalid_issuer' } })
      return json(200, { models: models ?? [{ slug: 'gpt-5.5', display_name: 'GPT-5.5', visibility: 'list', context_window: 272000 }, { slug: 'hidden', visibility: 'hide' }, { slug: 'gpt-6', visibility: 'list', supported_reasoning_levels: ['low', { effort: 'high' }] }] })
    }
    return json(404, {})
  }
  f.calls = calls
  f.issued = issued
  return f
}

function setup ({ clock = { t: 1_800_000_000_000 }, fetch, tokens, remember = false, chatgpt } = {}) {
  const storage = memoryStorage()
  const sessionStorage = memoryStorage()
  const settings = createSettings({ storage, sessionStorage })
  settings.set({ authMode: 'chatgpt', remember, chatgpt: { issuer: 'https://auth.example', baseUrl: 'https://api.example/v1', ...chatgpt } })
  if (tokens) settings.set({ chatgpt: { clientId: 'oaiapp_x' }, chatgptTokens: tokens })
  let seq = 0
  const random = (k) => Uint8Array.from({ length: k }, () => (seq++ * 37 + 11) & 255)
  const siwc = createSiwc({ settings, fetch, now: () => clock.t, random, sessionStorage, locks: null })
  return { settings, siwc, storage, sessionStorage, clock }
}

// --- pure helpers --------------------------------------------------------------

test('siwc: buildAuthorizeUrl carries the documented parameters; agent_name_hint only on the first registration', () => {
  const first = new URL(buildAuthorizeUrl({ issuer: 'https://auth.openai.com/', extAgentHostId: 'urn:uuid:00000000-0000-4000-8000-000000000000', codeChallenge: 'C'.repeat(43), state: 'st', nonce: 'no' }))
  assert.equal(first.origin + first.pathname, 'https://auth.openai.com/api/accounts/authorize')
  const q = Object.fromEntries(first.searchParams)
  assert.deepEqual(q, {
    response_type: 'code',
    client_id: DYNAMIC_CLIENT_ID,
    redirect_uri: 'http://127.0.0.1:1455/auth/callback',
    scope: 'openid profile email offline_access resource.invoke chatgpt.tokens.use.direct',
    resource: 'https://api.openai.com/v1',
    code_challenge: 'C'.repeat(43),
    code_challenge_method: 'S256',
    state: 'st',
    nonce: 'no',
    ext_agent_host_id: 'urn:uuid:00000000-0000-4000-8000-000000000000',
    agent_name_hint: 'claude-code-web'
  })
  assert.match(first.href, /scope=openid%20profile/, 'spaces as %20, not +')
  const again = Object.fromEntries(new URL(buildAuthorizeUrl({ clientId: 'oaiapp_abc', extAgentHostId: 'urn:uuid:x', codeChallenge: 'c', state: 's', nonce: 'n' })).searchParams)
  assert.equal(again.client_id, 'oaiapp_abc')
  assert.equal('agent_name_hint' in again, false)
  for (const k of ['originator', 'codex_cli_simplified_flow', 'id_token_add_organizations']) assert.equal(k in q, false, `no Codex parameter ${k}`)
  assert.throws(() => buildAuthorizeUrl({ codeChallenge: 'c', state: 's', nonce: 'n' }), /extAgentHostId is required/)
})

test('siwc: parseCallbackUrl takes the full URL, a bare query or a fragment, and explains what is wrong', () => {
  assert.deepEqual(parseCallbackUrl('  http://127.0.0.1:1455/auth/callback?code=abc&state=xyz&client_id=oaiapp_1 '), { code: 'abc', state: 'xyz', clientId: 'oaiapp_1' })
  assert.deepEqual(parseCallbackUrl('?code=a%2Fb&state=s'), { code: 'a/b', state: 's', clientId: '' })
  assert.deepEqual(parseCallbackUrl('code=a&state=s'), { code: 'a', state: 's', clientId: '' })
  assert.deepEqual(parseCallbackUrl('http://127.0.0.1:1455/auth/callback#code=f&state=g'), { code: 'f', state: 'g', clientId: '' })
  assert.throws(() => parseCallbackUrl(''), (e) => e instanceof SiwcError && e.code === 'bad-callback')
  assert.throws(() => parseCallbackUrl('http://127.0.0.1:1455/auth/callback?error=access_denied&error_description=user+said+no'), /access_denied \(user said no\)/)
  assert.throws(() => parseCallbackUrl('https://auth.openai.com/api/accounts/authorize?client_id=x'), /no code=/)
})

test('siwc: pkce is S256 over a 64-byte verifier (RFC 7636 appendix B vector via injected random)', async () => {
  const rfcOctets = [116, 24, 223, 180, 151, 153, 224, 37, 79, 250, 96, 125, 216, 173, 187, 186, 22, 212, 37, 77, 105, 214, 191, 240, 91, 88, 5, 88, 83, 132, 141, 121]
  const p = await pkce({ random: () => Uint8Array.from(rfcOctets) })
  assert.equal(p.verifier, 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')
  assert.equal(p.challenge, 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  assert.equal(p.method, 'S256')
  const real = await pkce() // WebCrypto (globalThis.crypto in Node 22)
  assert.equal(real.verifier.length, 86)
  assert.equal(real.challenge, createHash('sha256').update(real.verifier).digest('base64url'))
  const viaDeps = await pkce({ random: (n) => new Uint8Array(n).fill(7), sha256: (b) => createHash('sha256').update(b).digest() })
  assert.equal(viaDeps.challenge, createHash('sha256').update(viaDeps.verifier).digest('base64url'), 'a Node sha256 can be injected')
  assert.match(uuidFrom(new Uint8Array(16).fill(255)), /^ffffffff-ffff-4fff-bfff-ffffffffffff$/)
})

test('siwc: token responses, times, errors and the model list', () => {
  const now = 1_800_000_000_000
  const t = tokensFromResponse({ access_token: 'a', refresh_token: 'r', id_token: 'i', expires_in: 3600, earliest_refresh_at: 1_800_000_600 }, { now })
  assert.deepEqual(t, { accessToken: 'a', refreshToken: 'r', idToken: 'i', expiresAt: now + 3_600_000, earliestRefreshAt: 1_800_000_600_000 })
  const kept = tokensFromResponse({ access_token: 'b', expires_in: 60 }, { now, previous: t })
  assert.equal(kept.refreshToken, 'r', 'a refresh without a new refresh_token keeps the old one')
  assert.equal(kept.idToken, 'i')
  const fromJwt = tokensFromResponse({ access_token: jwt({ exp: 1_800_000_100 }) }, { now })
  assert.equal(fromJwt.expiresAt, 1_800_000_100_000, 'no expires_in: the JWT exp')
  assert.equal(parseTime('2027-01-01T00:00:00Z', now), Date.parse('2027-01-01T00:00:00Z'))
  assert.equal(parseTime(300, now), now + 300_000, 'a small number is relative seconds')
  assert.equal(parseTime(1_800_000_000_123, now), 1_800_000_000_123, 'ms stay ms')
  assert.equal(parseTime(null, now), 0)
  assert.deepEqual(decodeJwt(jwt({ a: 1 })), { a: 1 })
  assert.equal(decodeJwt('nope'), null)
  assert.deepEqual(parseOAuthError(400, { error: 'invalid_grant', error_description: 'bad' }), { code: 'invalid_grant', message: 'bad' })
  assert.deepEqual(parseOAuthError(401, { error: { code: 'refresh_token_reused', message: 'used' } }), { code: 'refresh_token_reused', message: 'used' })
  assert.deepEqual(parseOAuthError(403, { detail: { code: 'x', message: 'y' } }), { code: 'x', message: 'y' })
  assert.equal(isPermanentAuthError(400, 'refresh_token_reused'), true)
  assert.equal(isPermanentAuthError(401, ''), true)
  assert.equal(isPermanentAuthError(503, 'server_is_overloaded'), false)
  assert.deepEqual(normaliseModels({ models: [{ slug: 'a', display_name: 'A', visibility: 'list', context_window: 5 }, { slug: 'b', visibility: 'hide' }, { slug: 'c', visibility: 'list', supported_reasoning_levels: [{ effort: 'low' }, 'high'], default_reasoning_level: 'low' }, null] }), [
    { slug: 'a', displayName: 'A', contextWindow: 5 },
    { slug: 'c', displayName: 'c', contextWindow: null, efforts: ['low', 'high'], defaultEffort: 'low' }
  ])
  assert.deepEqual(normaliseModels({ data: [{ id: 'gpt-4o' }] }), [])
})

// --- sign-in --------------------------------------------------------------------

test('siwc: beginLogin mints the host id once, keeps verifier/state in sessionStorage, reuses the issued client', async () => {
  const fetch = fakeOpenAI()
  const { siwc, settings, sessionStorage, storage } = setup({ fetch })
  const { url, state } = await siwc.beginLogin()
  const q = new URL(url).searchParams
  const host = settings.get().chatgpt.extAgentHostId
  assert.match(host, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(q.get('ext_agent_host_id'), host)
  assert.equal(q.get('client_id'), DYNAMIC_CLIENT_ID)
  assert.equal(q.get('agent_name_hint'), 'claude-code-web')
  assert.equal(q.get('state'), state)
  assert.ok(url.startsWith('https://auth.example/api/accounts/authorize?'))
  const pending = JSON.parse(sessionStorage.m.get(PENDING_KEY))
  assert.equal(pending.state, state)
  assert.equal(q.get('code_challenge'), createHash('sha256').update(pending.verifier).digest('base64url'))
  assert.ok(!(storage.m.get(SETTINGS_KEY) ?? '').includes(pending.verifier), 'the verifier is not in localStorage')
  assert.equal(fetch.calls.length, 0, 'beginLogin makes no request')
  assert.equal(siwc.status().pending, true)
  settings.set({ chatgpt: { clientId: 'oaiapp_saved' } })
  const second = new URL((await siwc.beginLogin()).url).searchParams
  assert.equal(settings.get().chatgpt.extAgentHostId, host, 'minted once')
  assert.equal(second.get('client_id'), 'oaiapp_saved')
  assert.equal(second.get('agent_name_hint'), null)
  // an issuer that would get the code in cleartext is refused
  settings.set({ chatgpt: { issuer: 'http://auth.example.com' } })
  await assert.rejects(siwc.beginLogin(), (e) => e.code === 'config' && /ChatGPT sign-in issuer must use https/.test(e.message))
})

test('siwc: completeLogin checks state, exchanges the code (form, PKCE, resource) and stores the tokens like the other credentials', async () => {
  const fetch = fakeOpenAI()
  const { siwc, settings, storage, sessionStorage } = setup({ fetch })
  await assert.rejects(siwc.completeLogin('http://127.0.0.1:1455/auth/callback?code=c&state=s'), (e) => e.code === 'no-pending')
  const { state } = await siwc.beginLogin()
  const pending = JSON.parse(sessionStorage.m.get(PENDING_KEY))
  fetch.nonce = pending.nonce
  await assert.rejects(siwc.completeLogin(`http://127.0.0.1:1455/auth/callback?code=c&state=other&client_id=oaiapp_new`), (e) => e.code === 'state-mismatch')
  await assert.rejects(siwc.completeLogin(`http://127.0.0.1:1455/auth/callback?code=c&state=${state}`), (e) => e.code === 'bad-callback' && /client_id/.test(e.message))
  assert.equal(fetch.calls.length, 0)
  const st = await siwc.completeLogin(`http://127.0.0.1:1455/auth/callback?code=the-code&state=${encodeURIComponent(state)}&client_id=oaiapp_new`)
  assert.equal(fetch.calls.length, 1)
  const call = fetch.calls[0]
  assert.equal(call.url, '/api/accounts/oauth/token')
  assert.equal(call.method, 'POST')
  assert.equal(call.headers['content-type'], 'application/x-www-form-urlencoded')
  assert.deepEqual(call.form, { grant_type: 'authorization_code', client_id: 'oaiapp_new', code: 'the-code', code_verifier: pending.verifier, redirect_uri: REDIRECT_URI, resource: RESOURCE })
  assert.deepEqual({ signedIn: st.signedIn, clientId: st.clientId, email: st.email, plan: st.plan, pending: st.pending }, { signedIn: true, clientId: 'oaiapp_new', email: 'u@example.com', plan: 'pro', pending: false })
  const s = settings.get()
  assert.equal(s.chatgpt.clientId, 'oaiapp_new')
  assert.equal(s.chatgptTokens.accessToken, 'at_1')
  assert.equal(s.chatgptTokens.refreshToken, 'rt_1')
  assert.ok(!storage.m.get(SETTINGS_KEY).includes('rt_1'), 'not in localStorage without "remember"')
  assert.ok(sessionStorage.m.get(SECRETS_KEY).includes('rt_1'), 'this tab keeps it')
  assert.equal(sessionStorage.m.has(PENDING_KEY), false, 'the verifier is dropped after use')
  assert.equal(JSON.stringify(settings.getPublic()).includes('rt_1'), false)
  assert.equal(settings.getPublic().hasCredential, true)
})

test('siwc: a wrong nonce or a grant without chatgpt.tokens.use.direct is refused', async () => {
  const fetch = fakeOpenAI()
  const { siwc, settings } = setup({ fetch })
  const a = await siwc.beginLogin()
  fetch.nonce = 'someone-else'
  await assert.rejects(siwc.completeLogin(`?code=c&state=${a.state}&client_id=oaiapp_1`), (e) => e.code === 'nonce')
  assert.equal(settings.get().chatgptTokens, null)
  const b = await siwc.beginLogin()
  fetch.nonce = undefined
  fetch.scope = 'openid profile email offline_access'
  await assert.rejects(siwc.completeLogin(`?code=c&state=${b.state}&client_id=oaiapp_1`), (e) => e.code === 'scope' && /Plus or Pro/.test(e.message))
  assert.equal(settings.get().chatgptTokens, null)
  // a failed exchange (expired code) drops the pending login; a network failure keeps it
  const c = await siwc.beginLogin()
  fetch.fail = 'network'
  await assert.rejects(siwc.completeLogin(`?code=c&state=${c.state}&client_id=oaiapp_1`), (e) => e.code === 'network')
  assert.equal(siwc.status().pending, true)
  fetch.fail = { status: 401, body: { error: { code: 'token_expired', message: 'Could not validate your token.' } } }
  await assert.rejects(siwc.completeLogin(`?code=c&state=${c.state}&client_id=oaiapp_1`), (e) => e.code === 'reauth' && /token_expired/.test(e.message))
  assert.equal(siwc.status().pending, false)
})

// --- tokens ---------------------------------------------------------------------

test('siwc: getAccessToken serves a fresh token without a request, refreshes inside 5 minutes and persists the rotated refresh token first', async () => {
  const clock = { t: 1_800_000_000_000 }
  const fetch = fakeOpenAI({ clock })
  const { siwc, settings, sessionStorage } = setup({ clock, fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t + 3_600_000 } })
  assert.deepEqual(await siwc.getAccessToken(), { accessToken: 'at_0', expiresAt: clock.t + 3_600_000 })
  assert.equal(fetch.calls.length, 0)
  clock.t += 3_600_000 - REFRESH_WINDOW_MS + 1
  let seenInStorage = null
  const set = settings.set
  settings.set = (patch) => { const r = set(patch); if (patch.chatgptTokens) seenInStorage = sessionStorage.m.get(SECRETS_KEY); return r }
  const t = await siwc.getAccessToken()
  settings.set = set
  assert.equal(t.accessToken, 'at_1')
  assert.equal(t.expiresAt, clock.t + 3_600_000)
  assert.deepEqual(fetch.calls[0].form, { grant_type: 'refresh_token', client_id: 'oaiapp_x', refresh_token: 'rt_0', resource: RESOURCE })
  assert.ok(seenInStorage.includes('rt_1'), 'the rotated refresh token was saved')
  assert.equal(settings.get().chatgptTokens.refreshToken, 'rt_1')
  // the old one is now spent: a refresh must use rt_1
  clock.t += 3_600_000
  assert.equal((await siwc.getAccessToken()).accessToken, 'at_2')
  assert.equal(fetch.calls[1].form.refresh_token, 'rt_1')
})

test('siwc: refreshes are single-flight', async () => {
  const clock = { t: 1_800_000_000_000 }
  const fetch = fakeOpenAI({ clock })
  const { siwc } = setup({ clock, fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t - 1 } })
  const all = await Promise.all([siwc.getAccessToken(), siwc.getAccessToken({ force: true }), siwc.getAccessToken()])
  assert.equal(fetch.calls.length, 1, 'one refresh for three callers')
  assert.deepEqual(new Set(all.map((x) => x.accessToken)), new Set(['at_1']))
  // force refreshes even a fresh token (the API refused it)
  await siwc.getAccessToken({ force: true })
  assert.equal(fetch.calls.length, 2)
})

test('siwc: earliest_refresh_at is respected', async () => {
  const clock = { t: 1_800_000_000_000 }
  const fetch = fakeOpenAI({ clock })
  const earliest = clock.t + 10 * 60_000
  const { siwc, settings } = setup({ clock, fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t + 2 * 60_000, earliestRefreshAt: earliest } })
  // inside the refresh window but before earliest_refresh_at, the still-valid token is used
  assert.equal((await siwc.getAccessToken()).accessToken, 'at_0')
  assert.equal(fetch.calls.length, 0)
  // forced (the API refused it): no refresh is allowed yet, so sign in again
  await assert.rejects(siwc.getAccessToken({ force: true }), (e) => e.code === 'not-yet')
  assert.equal(fetch.calls.length, 0)
  // expired and still before earliest: the same
  clock.t += 3 * 60_000
  await assert.rejects(siwc.getAccessToken(), (e) => e.code === 'not-yet')
  // after earliest: refresh
  clock.t = earliest + 1
  assert.equal((await siwc.getAccessToken()).accessToken, 'at_1')
  assert.equal(settings.get().chatgptTokens.earliestRefreshAt, 0)
})

test('siwc: a reused refresh token signs out; a transient failure keeps the tokens', async () => {
  const clock = { t: 1_800_000_000_000 }
  const fetch = fakeOpenAI({ clock })
  const { siwc, settings } = setup({ clock, fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t - 1 } })
  fetch.fail = { status: 503, body: { error: { code: 'server_is_overloaded', message: 'busy' } } }
  await assert.rejects(siwc.getAccessToken(), (e) => e.code === 'http' && /503/.test(e.message))
  assert.equal(settings.get().chatgptTokens.refreshToken, 'rt_0', 'kept after a 503')
  fetch.issued.used.add('rt_0') // another copy spent it (the rotation conflict, J §0.4)
  const changes = []
  siwc.addEventListener('change', (e) => changes.push(e.detail.signedIn))
  await assert.rejects(siwc.getAccessToken(), (e) => e.code === 'reauth' && /refresh_token_reused/.test(e.message) && /Sign in with ChatGPT again/.test(e.message))
  assert.equal(settings.get().chatgptTokens, null, 'signed out')
  assert.deepEqual(changes, [false])
  await assert.rejects(siwc.getAccessToken(), (e) => e.code === 'signed-out')
})

test('siwc: with "remember", a refresh first re-reads storage (another tab may have rotated the token)', async () => {
  const clock = { t: 1_800_000_000_000 }
  const fetch = fakeOpenAI({ clock })
  const { siwc, settings, storage } = setup({ clock, fetch, remember: true, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t - 1 } })
  // the other tab refreshed: localStorage now holds a fresh token
  const saved = JSON.parse(storage.m.get(SETTINGS_KEY))
  saved.chatgptTokens = { accessToken: 'at_other', refreshToken: 'rt_other', idToken: '', expiresAt: clock.t + 3_600_000, earliestRefreshAt: 0 }
  storage.m.set(SETTINGS_KEY, JSON.stringify(saved))
  assert.equal((await siwc.getAccessToken()).accessToken, 'at_other')
  assert.equal(fetch.calls.length, 0, 'no refresh with the stale refresh token')
  assert.equal(settings.get().chatgptTokens.refreshToken, 'rt_other')
})

test('siwc: listModels filters to visibility "list", retries once after a refused token (401 or a CORS-less TypeError)', async () => {
  const clock = { t: 1_800_000_000_000 }
  for (const refuse of [401, 'network']) {
    const fetch = fakeOpenAI({ clock })
    fetch.refuseModelsOnce = refuse
    const { siwc } = setup({ clock, fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: clock.t + 3_600_000 } })
    const models = await siwc.listModels()
    assert.deepEqual(models.map((m) => m.slug), ['gpt-5.5', 'gpt-6'])
    assert.deepEqual(models[1].efforts, ['low', 'high'])
    assert.deepEqual(fetch.calls.map((c) => c.url), ['/v1/models', '/api/accounts/oauth/token', '/v1/models'], String(refuse))
    assert.equal(fetch.calls[2].headers.authorization, 'Bearer at_1')
    assert.equal(fetch.calls[0].headers.originator, undefined)
    assert.equal(siwc.contextWindowFor('gpt-5.5'), 272000)
    assert.equal(siwc.contextWindowFor('gpt-6'), null)
    assert.deepEqual(siwc.models.map((m) => m.slug), ['gpt-5.5', 'gpt-6'])
  }
  const { siwc } = setup({ fetch: fakeOpenAI() })
  assert.equal(siwc.contextWindowFor(FALLBACK_MODELS[0].slug), 272000, 'before any list: the fallback')
  await assert.rejects(siwc.listModels(), (e) => e.code === 'signed-out')
})

test('siwc: logout forgets the tokens, keeps the registration, and revokes the refresh token best effort', async () => {
  const fetch = fakeOpenAI()
  const { siwc, settings, sessionStorage } = setup({ fetch, tokens: { accessToken: 'at_0', refreshToken: 'rt_0', expiresAt: Date.now() + 3_600_000 } })
  settings.set({ chatgpt: { extAgentHostId: 'urn:uuid:11111111-1111-4111-8111-111111111111' } })
  const r = await siwc.logout()
  assert.deepEqual(r, { revoked: true })
  assert.deepEqual(fetch.calls.at(-1).form, { token: 'rt_0', token_type_hint: 'refresh_token', client_id: 'oaiapp_x' })
  const s = settings.get()
  assert.equal(s.chatgptTokens, null)
  assert.equal(s.chatgpt.clientId, 'oaiapp_x')
  assert.equal(s.chatgpt.extAgentHostId, 'urn:uuid:11111111-1111-4111-8111-111111111111')
  assert.equal(sessionStorage.m.has(SECRETS_KEY), false, 'no credential left in this tab')
  fetch.fail = 'network'
  settings.set({ chatgptTokens: { accessToken: 'a', refreshToken: 'r' } })
  assert.deepEqual(await siwc.logout(), { revoked: false }, 'a failed revoke still logs out')
  assert.equal(settings.get().chatgptTokens, null)
})

// --- against the mock's fake issuer -----------------------------------------------

test('siwc: the whole paste flow against the mock issuer, then models and a refresh with rotation', async () => {
  const mock = await startMockApi({ port: 0, eventDelayMs: 0 })
  try {
    const storage = memoryStorage()
    const sessionStorage = memoryStorage()
    const settings = createSettings({ storage, sessionStorage })
    settings.set({ authMode: 'chatgpt', chatgpt: { issuer: mock.url, baseUrl: `${mock.url}/v1` } })
    const clock = { t: Date.now() }
    const siwc = createSiwc({ settings, fetch: globalThis.fetch, now: () => clock.t, sessionStorage, locks: null })
    const login = async () => {
      const { url } = await siwc.beginLogin()
      const res = await fetch(url, { redirect: 'manual' })
      assert.equal(res.status, 302, await res.clone().text())
      const location = res.headers.get('location')
      assert.match(location, /^http:\/\/127\.0\.0\.1:1455\/auth\/callback\?code=/)
      return siwc.completeLogin(location)
    }
    const st = await login()
    assert.equal(st.signedIn, true)
    assert.equal(st.clientId, 'oaiapp_test')
    assert.equal(st.email, 'e2e@example.com')
    const models = await siwc.listModels()
    assert.deepEqual(models.map((m) => m.slug), ['gpt-5.5', 'gpt-6.1-sol'])
    const before = settings.get().chatgptTokens
    clock.t += 3_600_000
    const t = await siwc.getAccessToken()
    assert.notEqual(t.accessToken, before.accessToken)
    assert.notEqual(settings.get().chatgptTokens.refreshToken, before.refreshToken, 'rotated')
    // a second sign-in reuses the issued client, without agent_name_hint
    await siwc.logout()
    await login()
    const reqs = mock.requests
    const auths = reqs.filter((r) => r.authorize)
    assert.deepEqual(auths.map((r) => [r.authorize.clientId, r.authorize.agentNameHint, r.authorize.problems.length]), [['dynamic_agent_client', 'claude-code-web', 0], ['oaiapp_test', undefined, 0]])
    assert.deepEqual(reqs.filter((r) => r.token).map((r) => [r.token.grant_type, r.status]), [['authorization_code', 200], ['refresh_token', 200], ['authorization_code', 200]])
    assert.ok(reqs.filter((r) => r.token?.grant_type === 'authorization_code').every((r) => r.token.pkce), 'PKCE verified by the mock')
    assert.equal(reqs.filter((r) => r.revoke?.known).length, 1)
  } finally {
    await mock.close()
  }
})
