// Integration / fix round F2: the Worker's defence in depth. The policy
// flags are merged in by the Worker as well as the page (one shared module),
// and the egress guard refuses foreign hosts and credentials sent anywhere
// but the API base URL.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { POLICY_ENV, workerEnv } from '../../src/runtime/boot/policy.js'
import { POLICY_ENV as PAGE_POLICY_ENV } from '../../src/host/constants.js'
import { buildEnv } from '../../src/host/invocation.js'
import { installEgressGuard, egressVerdict, egressPolicy, EgressRefusedError } from '../../src/runtime/boot/egress.js'

const SECRET = 'sk-ant-oat01-NEVER-LOGGED'
const MOCK = 'http://127.0.0.1:18080'
const SELF = 'http://127.0.0.1:4173'

test('policy: the page and the Worker share one POLICY_ENV, and the Worker merges it last', () => {
  assert.equal(PAGE_POLICY_ENV, POLICY_ENV, 'host/constants.js re-exports the Worker module')
  assert.deepEqual(Object.keys(POLICY_ENV).sort(), ['CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', 'DISABLE_AUTOUPDATER', 'DISABLE_ERROR_REPORTING', 'DISABLE_TELEMETRY'])
  const sneaky = { HOME: '/home/user', DISABLE_TELEMETRY: '0', CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '' }
  const env = workerEnv(sneaky)
  for (const [k, v] of Object.entries(POLICY_ENV)) assert.equal(env[k], v, k)
  assert.equal(env.HOME, '/home/user')
  assert.deepEqual(workerEnv(undefined), { ...POLICY_ENV })
  for (const [k, v] of Object.entries(POLICY_ENV)) assert.equal(buildEnv({}).HOME && buildEnv({})[k], v)
  // boot.js builds the CLI env through workerEnv and guards fetch before the first Claude Code import
  const boot = readFileSync(new URL('../../src/runtime/boot.js', import.meta.url), 'utf8')
  assert.match(boot, /const env = workerEnv\(boot\.env\)/)
  const guardAt = boot.indexOf('installEgressGuard(globalThis')
  assert.ok(guardAt > 0, 'boot.js installs the egress guard')
  assert.ok(guardAt < boot.indexOf('installNodeGlobals(globalThis'), 'before the Node globals')
  assert.ok(guardAt < boot.indexOf('preImportAll(order'), 'before any Claude Code module is imported')
  assert.ok(guardAt < boot.indexOf('installTrace(index'), 'under the ?trace wrapper, so refusals show in the trace')
})

test('egress: the verdict for hosts and credentials', () => {
  const policy = egressPolicy({ baseUrl: MOCK, selfOrigin: SELF })
  const v = (url, headerNames = []) => egressVerdict({ url, headerNames }, policy)
  assert.equal(v(`${MOCK}/v1/messages?beta=true`, ['authorization', 'anthropic-beta']), null)
  assert.equal(v(`${MOCK}/v1/messages`, ['x-api-key']), null)
  assert.equal(v('https://api.anthropic.com/api/hello'), null, 'api.anthropic.com without a credential')
  assert.match(v('https://api.anthropic.com/api/oauth/profile', ['authorization']), /carries authorization to https:\/\/api\.anthropic\.com/)
  assert.equal(v(`${SELF}/vfs/app/cli`), null, 'the page origin')
  assert.match(v(`${SELF}/x`, ['x-api-key']), /carries x-api-key/)
  assert.match(v('https://statsig.anthropic.com/v1/initialize'), /not the API base URL/)
  assert.match(v('https://example.com/'), /not the API base URL/)
  assert.match(v('http://api.anthropic.com/'), /not the API base URL/, 'http is a different origin')
  assert.equal(v('wss://api.anthropic.com/ws'), null)
  assert.match(v('wss://bridge.example.com/ws'), /not the API base URL/)
  assert.equal(v('data:text/plain,hi'), null)
  assert.equal(v('blob:http://127.0.0.1:4173/abc'), null)
  assert.match(v('file:///etc/passwd'), /protocol file: is not allowed/)
  // default base URL: the real API, credentials allowed there
  const real = egressPolicy({ baseUrl: '', selfOrigin: SELF })
  assert.equal(egressVerdict({ url: 'https://api.anthropic.com/v1/messages', headerNames: ['authorization'] }, real), null)
  assert.match(egressVerdict({ url: `${MOCK}/v1/messages` }, real), /not the API base URL/)
})

function fakeScope () {
  const calls = []
  const sockets = []
  class WebSocket { constructor (url, protocols) { this.url = String(url); this.protocols = protocols; sockets.push(this) } }
  WebSocket.OPEN = 1
  return {
    calls,
    sockets,
    fetch (input, init) { calls.push({ input, init }); return Promise.resolve({ status: 200 }) },
    WebSocket
  }
}

test('egress guard: wraps fetch; refusals reject like a network error and are logged without secrets', async () => {
  const scope = fakeScope()
  const warnings = []
  const { refused } = installEgressGuard(scope, { baseUrl: MOCK, selfOrigin: SELF, warn: (m) => warnings.push(m) })

  await scope.fetch(`${MOCK}/v1/messages?beta=true`, { method: 'POST', headers: { Authorization: `Bearer ${SECRET}` } })
  await scope.fetch('/runtime/boot.js', { method: 'HEAD' }) // relative: the page origin
  await scope.fetch('https://api.anthropic.com/api/hello')
  await scope.fetch(new Request(`${MOCK}/v1/messages`, { method: 'POST', headers: { 'x-api-key': SECRET } }))
  assert.equal(scope.calls.length, 4)

  const refusals = [
    ['https://api.anthropic.com/api/oauth/profile', { headers: new Headers({ authorization: `Bearer ${SECRET}` }) }, /carries authorization/],
    ['https://api.anthropic.com/v1/messages', { headers: [['X-Api-Key', SECRET]] }, /carries x-api-key/],
    [new Request('https://example.com/collect', { method: 'POST', headers: { authorization: SECRET } }), undefined, /not the API base URL/],
    ['https://statsig.anthropic.com/v1/rgstr', { method: 'POST' }, /not the API base URL/]
  ]
  for (const [input, init, why] of refusals) {
    await assert.rejects(scope.fetch(input, init), (err) => {
      assert.ok(err instanceof TypeError && err instanceof EgressRefusedError)
      assert.equal(err.code, 'EGRESS_REFUSED')
      assert.match(err.message, why)
      return true
    })
  }
  assert.equal(scope.calls.length, 4, 'no refused request reached the real fetch')
  assert.equal(refused.length, 4)
  assert.deepEqual(refused[0].credentialHeaders, ['authorization'])
  assert.equal(warnings.length, 4)
  assert.match(warnings[0], /^egress guard: refused fetch GET https:\/\/api\.anthropic\.com\/api\/oauth\/profile: /)
  assert.ok(!warnings.join('\n').includes(SECRET) && !JSON.stringify(refused).includes(SECRET), 'no credential value is logged')
})

test('egress guard: wraps WebSocket (host check; subclass keeps the constants)', () => {
  const scope = fakeScope()
  const warnings = []
  installEgressGuard(scope, { baseUrl: 'https://api.anthropic.com', selfOrigin: SELF, warn: (m) => warnings.push(m) })
  const ok = new scope.WebSocket('wss://api.anthropic.com/v1/ws')
  assert.equal(ok.url, 'wss://api.anthropic.com/v1/ws')
  assert.equal(scope.WebSocket.OPEN, 1)
  assert.throws(() => new scope.WebSocket('wss://bridge.example.com/session'), (err) => err.code === 'EGRESS_REFUSED' && /not the API base URL/.test(err.message))
  assert.equal(scope.sockets.length, 1)
  assert.equal(warnings.length, 1)
})
