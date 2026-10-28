// Track W (ChatGPT option, Worker side): provider config, env, the egress
// policy in ChatGPT mode, and how boot.js wires them (ARCHITECTURE.md Appendix A).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as policy from '../../src/runtime/boot/policy.js'
import * as hostConstants from '../../src/host/constants.js'
import { egressPolicy, egressVerdict, installEgressGuard } from '../../src/runtime/boot/egress.js'

const { providerConfig, applyProviderEnv, workerEnv, POLICY_ENV, OPENAI_ADAPTER_ORIGIN, OPENAI_ADAPTER_KEY } = policy
const SELF = 'https://kumavis.github.io'
const CHATGPT = { kind: 'openai-responses', baseUrl: 'https://api.openai.com/v1', model: 'gpt-5.5', effort: 'high', contextWindow: 272000 }

test('provider: normalized from the boot message; bad ones refused', () => {
  assert.deepEqual(providerConfig(undefined), { kind: 'anthropic' })
  assert.deepEqual(providerConfig(null), { kind: 'anthropic' })
  assert.deepEqual(providerConfig({ kind: 'anthropic', baseUrl: 'x' }), { kind: 'anthropic' })
  assert.deepEqual(providerConfig(CHATGPT), CHATGPT)
  assert.deepEqual(providerConfig({ kind: 'openai-responses' }), { kind: 'openai-responses', baseUrl: 'https://api.openai.com/v1', model: 'gpt-5.5', effort: 'auto', contextWindow: null })
  assert.equal(providerConfig({ ...CHATGPT, baseUrl: 'http://127.0.0.1:18080/v1/' }).baseUrl, 'http://127.0.0.1:18080/v1')
  assert.equal(providerConfig({ ...CHATGPT, contextWindow: '400000' }).contextWindow, 400000)
  assert.equal(providerConfig({ ...CHATGPT, contextWindow: -1 }).contextWindow, null)
  assert.throws(() => providerConfig({ ...CHATGPT, baseUrl: 'http://api.example.com/v1' }), /https/)
  assert.throws(() => providerConfig({ ...CHATGPT, baseUrl: 'file:///etc' }), /https/)
  assert.throws(() => providerConfig({ kind: 'codex-backend' }), /unknown provider kind/)
})

test('provider: the page and the Worker agree on the synthetic origin and placeholder key', () => {
  assert.equal(OPENAI_ADAPTER_ORIGIN, 'https://openai-adapter.invalid')
  assert.equal(OPENAI_ADAPTER_KEY, 'openai-adapter')
  if ('OPENAI_ADAPTER_ORIGIN' in hostConstants) assert.equal(hostConstants.OPENAI_ADAPTER_ORIGIN, OPENAI_ADAPTER_ORIGIN)
  if ('OPENAI_ADAPTER_KEY' in hostConstants) assert.equal(hostConstants.OPENAI_ADAPTER_KEY, OPENAI_ADAPTER_KEY)
})

test('provider env: ChatGPT mode points the CLI at the adapter, drops Anthropic credentials, sets the compact window', () => {
  const page = { HOME: '/home/user', CLAUDE_CODE_OAUTH_TOKEN: 'sk-ant-oat01-x', ANTHROPIC_AUTH_TOKEN: 'y', ANTHROPIC_BASE_URL: 'https://api.anthropic.com', DISABLE_TELEMETRY: '0' }
  const env = applyProviderEnv(workerEnv(page), providerConfig(CHATGPT))
  assert.equal(env.ANTHROPIC_BASE_URL, OPENAI_ADAPTER_ORIGIN)
  assert.equal(env.ANTHROPIC_API_KEY, OPENAI_ADAPTER_KEY)
  assert.equal(env.CLAUDE_CODE_OAUTH_TOKEN, undefined)
  assert.equal(env.ANTHROPIC_AUTH_TOKEN, undefined)
  assert.equal(env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, '272000')
  assert.equal(env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, undefined, 'only read for unrecognized model ids in 2.1.311')
  for (const [k, v] of Object.entries(POLICY_ENV)) assert.equal(env[k], v, k)
  assert.equal(env.HOME, '/home/user')
  // a page value in range is kept; out of range (the CLI would clamp it) is replaced or dropped
  assert.equal(applyProviderEnv({ CLAUDE_CODE_AUTO_COMPACT_WINDOW: '200000' }, providerConfig(CHATGPT)).CLAUDE_CODE_AUTO_COMPACT_WINDOW, '200000')
  assert.equal(applyProviderEnv({ CLAUDE_CODE_AUTO_COMPACT_WINDOW: '5' }, providerConfig(CHATGPT)).CLAUDE_CODE_AUTO_COMPACT_WINDOW, '272000')
  assert.equal(applyProviderEnv({}, providerConfig({ ...CHATGPT, contextWindow: 50_000 })).CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined)
  assert.equal(applyProviderEnv({}, providerConfig({ ...CHATGPT, contextWindow: null })).CLAUDE_CODE_AUTO_COMPACT_WINDOW, undefined)
  // Anthropic mode: untouched apart from the policy flags
  const a = applyProviderEnv(workerEnv({ CLAUDE_CODE_OAUTH_TOKEN: 't', ANTHROPIC_BASE_URL: 'http://127.0.0.1:18080' }), providerConfig(undefined))
  assert.deepEqual(a, { CLAUDE_CODE_OAUTH_TOKEN: 't', ANTHROPIC_BASE_URL: 'http://127.0.0.1:18080', ...POLICY_ENV })
})

test('egress (ChatGPT mode): only the provider origin and the page; credentials only to the provider', () => {
  const p = egressPolicy({ baseUrl: OPENAI_ADAPTER_ORIGIN, selfOrigin: SELF, provider: CHATGPT })
  assert.deepEqual([...p.allowed].sort(), ['https://api.openai.com', SELF])
  const v = (url, headerNames = []) => egressVerdict({ url, headerNames }, p)
  assert.equal(v('https://api.openai.com/v1/responses', ['authorization', 'content-type']), null)
  assert.equal(v(`${SELF}/vibe-dump/claude-code-web/runtime/boot.js`), null)
  assert.match(v(`${OPENAI_ADAPTER_ORIGIN}/v1/messages`, ['x-api-key']), /not the ChatGPT API \(https:\/\/api\.openai\.com\) or this page/)
  assert.match(v('https://api.anthropic.com/v1/messages'), /not the ChatGPT API/)
  assert.match(v('https://chatgpt.com/backend-api/codex/responses', ['authorization']), /not the ChatGPT API/)
  assert.match(v('https://auth.openai.com/api/accounts/oauth/token'), /not the ChatGPT API/, 'refreshing is the page\'s job, never the Worker\'s')
  assert.match(v(`${SELF}/x`, ['authorization']), /carries authorization to https:\/\/kumavis\.github\.io, which is not the ChatGPT API/)
  // a loopback mock provider
  const mock = egressPolicy({ baseUrl: OPENAI_ADAPTER_ORIGIN, selfOrigin: 'http://127.0.0.1:4173', provider: { ...CHATGPT, baseUrl: 'http://127.0.0.1:18080/v1' } })
  assert.equal(egressVerdict({ url: 'http://127.0.0.1:18080/v1/responses', headerNames: ['authorization'] }, mock), null)
  // a broken provider URL allows only the page
  assert.deepEqual([...egressPolicy({ selfOrigin: SELF, provider: { kind: 'openai-responses', baseUrl: 'nope' } }).allowed], [SELF])
  // Anthropic mode unchanged
  assert.deepEqual([...egressPolicy({ baseUrl: 'http://127.0.0.1:18080', selfOrigin: SELF }).allowed].sort(), ['http://127.0.0.1:18080', 'https://api.anthropic.com', SELF].sort())
  // the guard takes the provider
  const scope = { fetch: async () => new Response('ok') }
  const { policy: gp } = installEgressGuard(scope, { baseUrl: OPENAI_ADAPTER_ORIGIN, selfOrigin: SELF, provider: CHATGPT })
  assert.equal(gp.provider, 'openai-responses')
})

test('boot.js: ChatGPT mode wiring (provider env, guard with provider, adapter on top, token answers routed)', () => {
  const boot = readFileSync(new URL('../../src/runtime/boot.js', import.meta.url), 'utf8')
  const at = (s) => { const i = boot.indexOf(s); assert.ok(i >= 0, `boot.js has ${s}`); return i }
  assert.ok(at('const provider = providerConfig(boot.provider)') < at('const env = workerEnv(boot.env)'))
  assert.ok(at('applyProviderEnv(env, provider)') > at('const env = workerEnv(boot.env)'))
  assert.ok(at('applyProviderEnv(env, provider)') < at('installEgressGuard(globalThis'), 'the guard sees the final ANTHROPIC_BASE_URL')
  assert.match(boot, /installEgressGuard\(globalThis, \{ baseUrl: env\.ANTHROPIC_BASE_URL, selfOrigin: base\.origin, provider,/)
  const adapterAt = at('await installProvider(provider')
  assert.ok(adapterAt > at('installEgressGuard(globalThis'), 'the adapter wraps the guarded fetch')
  assert.ok(adapterAt < at('installNodeGlobals(globalThis'), 'before the Node globals')
  assert.ok(adapterAt < at('preImportAll(order'), 'before any Claude Code module is imported')
  assert.ok(adapterAt < at('installTrace(index'), 'under the ?trace wrapper')
  assert.match(boot, /case 'provider-token': tokenBroker\?\.onMessage\(m\); break/)
  assert.match(boot, /tokenBroker = createTokenBroker\(\{ post \}\)/)
  assert.match(boot, /failedToken \? tokenBroker\.renew\(failedToken, \{ ambiguous \}\) : tokenBroker\.get\(\)/)
  assert.doesNotMatch(boot, /originator|chatgpt-account-id|codex_cli_rs/i, 'nothing presents as the Codex CLI')
  const adapter = readFileSync(new URL('../../src/runtime/boot/openai-adapter.js', import.meta.url), 'utf8')
  assert.doesNotMatch(adapter.replace(/^\/\/.*$/gm, ''), /originator|chatgpt-account-id|codex_cli_rs|user-agent/i, 'no Codex identity headers in code')
})
