// Track P: the page side of the ChatGPT option: settings migration, the
// invocation in ChatGPT mode, the token handoff (worker-bridge.js
// serveProviderTokens) and the Session driving the fake worker in ChatGPT mode.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createSettings, DEFAULT_SETTINGS, DEFAULT_CHATGPT, SETTINGS_KEY, SECRETS_KEY, SECRET_FIELDS, chatgptConfig, hasCredentialFor } from '../../src/host/settings.js'
import { buildArgv, buildEnv, checkCredentials, checkChatgptUrls, harnessModel, providerConfig } from '../../src/host/invocation.js'
import { serveProviderTokens, WorkerBridge } from '../../src/host/worker-bridge.js'
import { OPENAI_ADAPTER_ORIGIN, OPENAI_ADAPTER_KEY, CHATGPT_HARNESS_MODEL, POLICY_ENV } from '../../src/host/constants.js'
import { Session } from '../../src/host/session.js'
import { createMemorySnapshotStore } from '../../src/host/persist.js'
import { FakeWorker } from '../../src/host/fake-worker.js'

function memoryStorage () {
  const m = new Map()
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }
}

const TOKENS = { accessToken: 'at-SECRET-1', refreshToken: 'rt-SECRET-1', idToken: 'id-SECRET-1', expiresAt: Date.now() + 3_600_000, earliestRefreshAt: 0 }

// --- settings -----------------------------------------------------------------------

test('settings (chatgpt): defaults, and settings saved by an older build load with them', () => {
  assert.deepEqual(DEFAULT_SETTINGS.chatgpt, { clientId: '', extAgentHostId: '', model: 'gpt-5.5', effort: '', baseUrl: 'https://api.openai.com/v1', issuer: 'https://auth.openai.com' })
  assert.equal(DEFAULT_SETTINGS.chatgptTokens, null)
  assert.deepEqual([...SECRET_FIELDS], ['apiKey', 'token', 'chatgptTokens'])
  const storage = memoryStorage()
  storage.setItem(SETTINGS_KEY, JSON.stringify({ authMode: 'oauth', baseUrl: 'http://127.0.0.1:1', model: 'm', remember: false }))
  const s = createSettings({ storage, sessionStorage: memoryStorage() })
  assert.deepEqual(s.get().chatgpt, { ...DEFAULT_CHATGPT })
  assert.equal(s.get().chatgptTokens, null)
  assert.equal(s.get().authMode, 'oauth')
  // a partial or malformed chatgpt block from storage
  storage.setItem(SETTINGS_KEY, JSON.stringify({ authMode: 'chatgpt', chatgpt: { model: 'gpt-6', effort: 'ludicrous', clientId: 7, bogus: 1 } }))
  const t = createSettings({ storage, sessionStorage: memoryStorage() }).get()
  assert.equal(t.authMode, 'chatgpt')
  assert.deepEqual(t.chatgpt, { ...DEFAULT_CHATGPT, model: 'gpt-6', effort: '' })
  storage.setItem(SETTINGS_KEY, JSON.stringify({ authMode: 'codex' }))
  assert.equal(createSettings({ storage, sessionStorage: memoryStorage() }).get().authMode, 'api-key', 'an unknown mode falls back')
})

test('settings (chatgpt): the public block is patched field by field; the tokens are a secret like the others', () => {
  const storage = memoryStorage()
  const sessionStorage = memoryStorage()
  const s = createSettings({ storage, sessionStorage })
  s.set({ authMode: 'chatgpt', chatgpt: { clientId: 'oaiapp_1', extAgentHostId: 'urn:uuid:x' } })
  s.set({ chatgpt: { model: 'gpt-6.1-sol', effort: 'high' } })
  assert.deepEqual(s.get().chatgpt, { ...DEFAULT_CHATGPT, clientId: 'oaiapp_1', extAgentHostId: 'urn:uuid:x', model: 'gpt-6.1-sol', effort: 'high' })
  s.set({ chatgptTokens: TOKENS })
  const local = () => storage.m.get(SETTINGS_KEY) ?? ''
  assert.ok(!local().includes('SECRET'), 'no ChatGPT token in localStorage without "remember"')
  assert.ok(local().includes('oaiapp_1'), 'the registration is public and remembered')
  assert.ok(sessionStorage.m.get(SECRETS_KEY).includes('rt-SECRET-1'))
  assert.equal(createSettings({ storage, sessionStorage: memoryStorage() }).get().chatgptTokens, null, 'a new tab is signed out')
  assert.equal(createSettings({ storage, sessionStorage }).get().chatgptTokens.refreshToken, 'rt-SECRET-1', 'a reload of this tab is not')
  s.set({ remember: true })
  assert.ok(local().includes('rt-SECRET-1'))
  assert.equal(createSettings({ storage, sessionStorage: memoryStorage() }).get().chatgptTokens.accessToken, 'at-SECRET-1')
  s.set({ remember: false })
  assert.ok(!local().includes('SECRET'), 'unticking removes them')
  const pub = s.getPublic()
  assert.equal('chatgptTokens' in pub, false)
  assert.equal(JSON.stringify(pub).includes('SECRET'), false)
  assert.equal(pub.hasCredential, true)
  assert.equal(pub.chatgptSignedIn, true)
  // an empty token set is "signed out", and the returned copies cannot change the stored value
  s.set({ chatgptTokens: { accessToken: '', refreshToken: '' } })
  assert.equal(s.get().chatgptTokens, null)
  assert.equal(s.getPublic().hasCredential, false)
  const copy = s.get()
  copy.chatgpt.model = 'mutated'
  assert.notEqual(s.get().chatgpt.model, 'mutated')
  // tokens an older build kept in localStorage move to sessionStorage
  const storage2 = memoryStorage()
  const tab2 = memoryStorage()
  storage2.setItem(SETTINGS_KEY, JSON.stringify({ authMode: 'chatgpt', chatgptTokens: TOKENS }))
  const s2 = createSettings({ storage: storage2, sessionStorage: tab2 })
  assert.equal(s2.get().chatgptTokens.refreshToken, 'rt-SECRET-1')
  assert.ok(!storage2.m.get(SETTINGS_KEY).includes('SECRET'))
  assert.ok(tab2.m.get(SECRETS_KEY).includes('SECRET'))
})

test('settings (chatgpt): reload() re-reads storage, and keeps memory when storage is unreadable', () => {
  const storage = memoryStorage()
  const s = createSettings({ storage, sessionStorage: memoryStorage() })
  s.set({ remember: true, chatgptTokens: TOKENS })
  const saved = JSON.parse(storage.m.get(SETTINGS_KEY))
  saved.chatgptTokens.refreshToken = 'rt-rotated-elsewhere'
  storage.m.set(SETTINGS_KEY, JSON.stringify(saved))
  assert.equal(s.reload().chatgptTokens.refreshToken, 'rt-rotated-elsewhere')
  const throwing = { getItem () { throw new Error('denied') }, setItem () { throw new Error('denied') }, removeItem () {} }
  const t = createSettings({ storage: throwing, sessionStorage: throwing })
  t.set({ chatgptTokens: TOKENS })
  assert.equal(t.reload().chatgptTokens.accessToken, 'at-SECRET-1')
})

test('settings: chatgptConfig and hasCredentialFor', () => {
  assert.deepEqual(chatgptConfig({ baseUrl: 'http://127.0.0.1:9/v1/', issuer: '', model: '', effort: 'nope' }), { clientId: '', extAgentHostId: '', model: 'gpt-5.5', effort: '', baseUrl: 'http://127.0.0.1:9/v1', issuer: 'https://auth.openai.com' })
  assert.equal(chatgptConfig(null).baseUrl, 'https://api.openai.com/v1')
  assert.equal(hasCredentialFor({ authMode: 'chatgpt', chatgptTokens: { refreshToken: 'r' } }), true)
  assert.equal(hasCredentialFor({ authMode: 'chatgpt', apiKey: 'k' }), false)
  assert.equal(hasCredentialFor({ authMode: 'api-key', apiKey: 'k' }), true)
})

// --- invocation -------------------------------------------------------------------

test('invocation (chatgpt): synthetic base URL, placeholder key, no token in the env, the tested Claude model', () => {
  const s = { authMode: 'chatgpt', apiKey: 'sk-ant-api-REAL', token: 'sk-ant-oat01-REAL', baseUrl: 'https://api.anthropic.com', model: 'claude-opus-9', chatgptTokens: TOKENS, chatgpt: { model: 'gpt-5.5', effort: 'high', baseUrl: 'http://127.0.0.1:7/v1' } }
  const env = buildEnv({ ...s, contextWindow: 272000, extra: { ANTHROPIC_BASE_URL: 'https://elsewhere.example', DISABLE_TELEMETRY: '0' } })
  assert.equal(env.ANTHROPIC_BASE_URL, OPENAI_ADAPTER_ORIGIN)
  assert.equal(env.ANTHROPIC_BASE_URL, 'https://openai-adapter.invalid')
  assert.equal(env.ANTHROPIC_API_KEY, OPENAI_ADAPTER_KEY)
  assert.equal(env.CLAUDE_CODE_OAUTH_TOKEN, undefined)
  assert.equal(env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, '272000')
  assert.equal(env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, undefined)
  for (const [k, v] of Object.entries(POLICY_ENV)) assert.equal(env[k], v)
  const all = JSON.stringify(env)
  for (const secret of ['REAL', 'SECRET']) assert.ok(!all.includes(secret), `no ${secret} credential in the env`)
  assert.equal(buildEnv({ ...s, contextWindow: 50_000 }).CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined, 'outside 100k..1M the CLI would only warn')
  assert.equal(buildEnv({ ...s }).CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined)
  assert.equal(buildEnv({ ...s, authMode: 'api-key', contextWindow: 272000 }).CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined, 'only in ChatGPT mode')
  assert.equal(buildEnv({ ...s, authMode: 'api-key' }).ANTHROPIC_API_KEY, 'sk-ant-api-REAL', 'API-key mode is unchanged')

  assert.equal(harnessModel(s), CHATGPT_HARNESS_MODEL)
  assert.equal(harnessModel(s), 'claude-sonnet-5-5')
  assert.equal(harnessModel({ ...s, authMode: 'oauth' }), 'claude-opus-9')
  const argv = buildArgv({ model: harnessModel(s), mcpServerNames: ['page'] })
  assert.deepEqual(argv.slice(-2), ['--model', 'claude-sonnet-5-5'])

  assert.deepEqual(providerConfig(s, { contextWindow: 272000 }), { kind: 'openai-responses', baseUrl: 'http://127.0.0.1:7/v1', model: 'gpt-5.5', effort: 'high', contextWindow: 272000 })
  assert.deepEqual(providerConfig({ ...s, chatgpt: {} }), { kind: 'openai-responses', baseUrl: 'https://api.openai.com/v1', model: 'gpt-5.5', effort: '', contextWindow: null })
  assert.deepEqual(providerConfig({ ...s, authMode: 'api-key' }), { kind: 'anthropic' })
  assert.equal(JSON.stringify(providerConfig(s)).includes('SECRET'), false, 'no token in the provider config')
})

test('invocation (chatgpt): credentials and URL checks', () => {
  assert.throws(() => checkCredentials({ authMode: 'chatgpt', chatgptTokens: null, apiKey: 'k' }), /Sign in with ChatGPT first/)
  assert.doesNotThrow(() => checkCredentials({ authMode: 'chatgpt', chatgptTokens: { refreshToken: 'r' } }))
  assert.equal(checkChatgptUrls({}), null)
  assert.equal(checkChatgptUrls({ baseUrl: 'http://127.0.0.1:9/v1', issuer: 'http://127.0.0.1:9' }), null)
  assert.match(checkChatgptUrls({ baseUrl: 'http://api.example.com/v1' }), /^The ChatGPT API base URL must use https/)
  assert.match(checkChatgptUrls({ issuer: 'ftp://x' }), /^The ChatGPT sign-in issuer must be an https:\/\/ URL/)
})

// --- the token handoff --------------------------------------------------------------

/** A Worker stand-in: the test posts "from the Worker" with emit(); the page's posts land in `posted`. */
function fakePort () {
  const t = new EventTarget()
  t.posted = []
  t.postMessage = (m) => t.posted.push(structuredClone(m))
  t.emit = (data) => t.dispatchEvent(new MessageEvent('message', { data }))
  t.terminate = () => {}
  return t
}
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

test('bridge: serveProviderTokens answers with the access token and its expiry only, forcing a refresh on "unauthorized"', async () => {
  const port = fakePort()
  const asked = []
  const answers = []
  const detach = serveProviderTokens(port, {
    getAccessToken: async (o) => { asked.push(o); return { accessToken: `at-${asked.length}`, expiresAt: 123, refreshToken: 'rt-NEVER', idToken: 'id-NEVER' } },
    onAnswer: (a) => answers.push(a)
  })
  port.emit({ type: 'provider-token-request', id: 'a', reason: 'start' })
  port.emit({ type: 'provider-token-request', id: 'b', reason: 'unauthorized' })
  port.emit({ type: 'provider-token-request', id: 'c', reason: 'expired' })
  port.emit({ type: 'provider-token-request', id: 'd', reason: 'bogus' })
  port.emit({ type: 'stdout', line: '{}' })
  await tick()
  assert.deepEqual(asked, [{ force: false, reason: 'start' }, { force: true, reason: 'unauthorized' }, { force: false, reason: 'expired' }, { force: false, reason: 'start' }])
  assert.deepEqual(port.posted, [
    { type: 'provider-token', id: 'a', accessToken: 'at-1', expiresAt: 123 },
    { type: 'provider-token', id: 'b', accessToken: 'at-2', expiresAt: 123 },
    { type: 'provider-token', id: 'c', accessToken: 'at-3', expiresAt: 123 },
    { type: 'provider-token', id: 'd', accessToken: 'at-4', expiresAt: 123 }
  ])
  assert.ok(!JSON.stringify(port.posted).includes('NEVER'), 'never the refresh or ID token')
  assert.ok(!JSON.stringify(answers).includes('at-'), 'onAnswer is not given the token')
  detach()
  port.emit({ type: 'provider-token-request', id: 'e', reason: 'start' })
  await tick()
  assert.equal(port.posted.length, 4, 'detached')
})

test('bridge: a token failure is answered with an error; the bridge itself only reports the request', async () => {
  const port = fakePort()
  serveProviderTokens(port, { getAccessToken: async () => { throw new Error('Not signed in with ChatGPT.') } })
  const bridge = new WorkerBridge(port)
  const seen = []
  const logs = []
  bridge.addEventListener('provider-token-request', (e) => seen.push(e.detail))
  bridge.addEventListener('log', (e) => logs.push(e.detail))
  port.emit({ type: 'provider-token-request', id: 7, reason: 'start' })
  await tick()
  assert.deepEqual(port.posted, [{ type: 'provider-token', id: 7, error: 'Not signed in with ChatGPT.' }])
  assert.deepEqual(seen, [{ id: 7, reason: 'start' }])
  assert.equal(logs.length, 0, 'not logged as an unknown message type')
  const empty = fakePort()
  serveProviderTokens(empty, { getAccessToken: async () => ({ accessToken: '' }) })
  empty.emit({ type: 'provider-token-request', id: 1, reason: 'start' })
  await tick()
  assert.deepEqual(empty.posted, [{ type: 'provider-token', id: 1, error: 'no access token' }])
  assert.throws(() => serveProviderTokens(port, {}), /getAccessToken is required/)
})

// --- the Session in ChatGPT mode, on the fake worker -------------------------------------

function fakeExtractor () {
  return { async loadCurrentManifest () { return null }, async extractFromBinary () { throw new Error('unused') }, async clearCache () { return true } }
}

function chatgptSession ({ tokens = TOKENS, siwc, fake = true, createWorker } = {}) {
  const settings = createSettings({ storage: memoryStorage(), sessionStorage: memoryStorage() })
  settings.set({ authMode: 'chatgpt', chatgpt: { model: 'gpt-5.5', effort: 'medium', baseUrl: 'http://127.0.0.1:9/v1', issuer: 'http://127.0.0.1:9' }, chatgptTokens: tokens })
  const calls = []
  let n = 0
  const fakeSiwc = siwc ?? {
    async getAccessToken (o = {}) {
      calls.push(o)
      if (!settings.get().chatgptTokens) throw new Error('Not signed in with ChatGPT. Sign in first (Settings).')
      return { accessToken: `at-handoff-${++n}`, expiresAt: Date.now() + 3_600_000, refreshToken: 'rt-SECRET-LEAK' }
    },
    contextWindowFor: (slug) => (slug === 'gpt-5.5' ? 272000 : null)
  }
  const s = new Session({
    base: 'http://127.0.0.1:9/app/',
    fake,
    settings,
    siwc: fakeSiwc,
    snapshotStore: createMemorySnapshotStore(),
    loadExtractor: async () => fakeExtractor(),
    createWorker: createWorker ?? (() => new FakeWorker({ bootDelayMs: 2, stepDelayMs: 1 })),
    serviceWorker: false,
    fetch: async () => new Response('', { status: 200 }),
    locks: null
  })
  return { s, settings, calls }
}

test('session (chatgpt): the boot message carries the provider, the env no token; the Worker gets access tokens on request only', async () => {
  const { s, calls } = chatgptSession()
  await s.ready
  await s.start()
  const worker = s.harness.bridge.worker
  const boot = worker.received.find((m) => m.type === 'boot')
  assert.deepEqual(boot.provider, { kind: 'openai-responses', baseUrl: 'http://127.0.0.1:9/v1', model: 'gpt-5.5', effort: 'medium', contextWindow: 272000 })
  assert.equal(boot.env.ANTHROPIC_BASE_URL, 'https://openai-adapter.invalid')
  assert.equal(boot.env.ANTHROPIC_API_KEY, 'openai-adapter')
  assert.equal(boot.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, '272000')
  assert.deepEqual(boot.argv.slice(boot.argv.indexOf('--model'), boot.argv.indexOf('--model') + 2), ['--model', 'claude-sonnet-5-5'])
  const { result } = await s.turn('say hi', { timeoutMs: 5000 })
  assert.equal(result.is_error, false)
  assert.deepEqual(worker.tokenRequests.map((r) => r.reason), ['start'])
  assert.equal(worker.providerToken.accessToken, 'at-handoff-1')
  // the API refused the token: the Worker asks again with "unauthorized", which forces a refresh
  const again = await s.turn('say hi (token refused)', { timeoutMs: 5000 })
  assert.equal(again.result.is_error, false)
  assert.deepEqual(worker.tokenRequests.map((r) => r.reason), ['start', 'unauthorized'])
  assert.deepEqual(calls.map((c) => c.force), [false, true])
  assert.equal(worker.providerToken.accessToken, 'at-handoff-2')
  const everything = JSON.stringify(worker.received)
  for (const secret of ['rt-SECRET', 'SECRET-1', 'SECRET-LEAK']) assert.ok(!everything.includes(secret), `the Worker never received ${secret}`)
  assert.ok(s.log.some((l) => /asked for an access token \(unauthorized\)/.test(l.msg)))
  await s.dispose()
})

test('session (chatgpt): a token the page cannot give fails the turn with the reason; a real start refuses when signed out', async () => {
  const { s, settings } = chatgptSession()
  await s.ready
  await s.start()
  settings.set({ chatgptTokens: null })
  const notes = []
  s.addEventListener('entry', (e) => { if (e.detail.kind === 'note') notes.push(e.detail.text) })
  const { result } = await s.turn('say hi (token refused)', { timeoutMs: 5000 })
  assert.equal(result.is_error, true)
  assert.match(result.result, /Not signed in with ChatGPT/)
  assert.ok(notes.some((t) => /ChatGPT sign-in: Not signed in/.test(t)), notes.join('\n'))
  await s.dispose()

  const real = chatgptSession({ tokens: null, fake: false, createWorker: () => new FakeWorker() })
  await real.s.ready
  await assert.rejects(real.s.start(), /Sign in with ChatGPT first/)
  real.settings.set({ chatgptTokens: TOKENS, chatgpt: { baseUrl: 'http://api.example.com/v1' } })
  await assert.rejects(real.s.start(), /ChatGPT API base URL must use https/)
  await real.s.dispose()
})

test('session (chatgpt): a refresh that fails before boot stops Start with its reason', async () => {
  const siwc = { async getAccessToken () { throw new Error('Refreshing the ChatGPT sign-in failed (HTTP 401, refresh_token_reused). Sign in with ChatGPT again.') }, contextWindowFor: () => null }
  const { s } = chatgptSession({ siwc, fake: false, createWorker: () => new FakeWorker() })
  await s.ready
  // a non-fake session with a custom worker factory skips the cache preflight but not the token check
  await assert.rejects(s.start(), /refresh_token_reused/)
  assert.equal(s.harness, null, 'no Worker was booted')
  await s.dispose()
})

test('session (chatgpt): a model the page knows no context window for is looked up in the live list before boot', async () => {
  let listed = 0
  const known = new Map()
  const siwc = {
    async getAccessToken () { return { accessToken: 'at', expiresAt: Date.now() + 3_600_000 } },
    async listModels () { listed++; known.set('gpt-6.1-sol', 400000); return [] },
    contextWindowFor: (slug) => known.get(slug) ?? null
  }
  const { s, settings } = chatgptSession({ siwc, fake: false, createWorker: () => new FakeWorker({ bootDelayMs: 2, stepDelayMs: 1 }) })
  settings.set({ chatgpt: { model: 'gpt-6.1-sol' } })
  await s.ready
  await s.start()
  const boot = s.harness.bridge.worker.received.find((m) => m.type === 'boot')
  assert.equal(listed, 1)
  assert.equal(boot.provider.contextWindow, 400000)
  assert.equal(boot.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, '400000')
  await s.stop()
  // a failing list is not fatal: the window stays unknown
  known.clear()
  siwc.listModels = async () => { listed++; throw new Error('HTTP 503') }
  await s.start()
  const boot2 = s.harness.bridge.worker.received.find((m) => m.type === 'boot')
  assert.equal(boot2.provider.contextWindow, null)
  assert.equal(boot2.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined)
  assert.ok(s.log.some((l) => /no model list \(HTTP 503\)/.test(l.msg)))
  await s.dispose()
})

test('session (anthropic): the boot provider is {kind: "anthropic"} and no token handler is attached', async () => {
  const settings = createSettings({ storage: memoryStorage(), sessionStorage: memoryStorage() })
  settings.set({ authMode: 'oauth', token: 'sk-ant-oat01-x' })
  let siwcUsed = false
  const s = new Session({
    base: 'http://127.0.0.1:9/app/', fake: true, settings, siwc: { getAccessToken: async () => { siwcUsed = true }, contextWindowFor: () => null },
    snapshotStore: createMemorySnapshotStore(), loadExtractor: async () => fakeExtractor(), createWorker: () => new FakeWorker({ bootDelayMs: 2, stepDelayMs: 1 }),
    serviceWorker: false, fetch: async () => new Response('', { status: 200 }), locks: null
  })
  await s.ready
  await s.start()
  const boot = s.harness.bridge.worker.received.find((m) => m.type === 'boot')
  assert.deepEqual(boot.provider, { kind: 'anthropic' })
  assert.equal(boot.env.CLAUDE_CODE_OAUTH_TOKEN, 'sk-ant-oat01-x')
  assert.equal(boot.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined)
  assert.equal((await s.turn('say hi', { timeoutMs: 5000 })).result.is_error, false)
  assert.deepEqual(s.harness.bridge.worker.tokenRequests, [])
  assert.equal(siwcUsed, false)
  await s.dispose()
})
