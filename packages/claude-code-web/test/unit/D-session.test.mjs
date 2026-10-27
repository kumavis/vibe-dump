// Track D: the page orchestrator (Session) under Node: a fake extractor, the
// in-memory snapshot store and fake-worker.js stand in for the browser parts.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Session } from '../../src/host/session.js'
import { createSettings } from '../../src/host/settings.js'
import { createMemorySnapshotStore } from '../../src/host/persist.js'
import { FakeWorker } from '../../src/host/fake-worker.js'

const BASE = 'http://127.0.0.1:9/app/'

function memoryStorage () {
  const m = new Map()
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }
}

function fakeExtractor () {
  let cached = null
  return {
    calls: 0,
    async loadCurrentManifest (version, { appUrl }) { return cached && cached.appUrl === appUrl ? cached : null },
    async extractFromBinary (input, opts) {
      this.calls++
      opts.onProgress?.({ phase: 'parse' })
      cached = { version: opts.version, appUrl: opts.appUrl, moduleCount: 2848, files: 2846, bytes: 1, rewrites: { ok: true, rewrites: [] }, source: { kind: opts.source }, createdAt: 'now' }
      return cached
    },
    async clearCache () { cached = null; return true }
  }
}

function makeSession (extra = {}) {
  const extractor = extra.extractor ?? fakeExtractor()
  const settings = createSettings({ storage: memoryStorage() })
  const store = extra.store ?? createMemorySnapshotStore()
  const s = new Session({
    base: BASE,
    settings,
    snapshotStore: store,
    loadExtractor: async () => extractor,
    createWorker: () => new FakeWorker({ bootDelayMs: 2, stepDelayMs: 1 }),
    serviceWorker: false,
    fetch: async () => new Response('', { status: 200 }),
    ...extra
  })
  return { s, extractor, settings, store }
}

test('session: init finds no cache; extracting records the manifest', async () => {
  const { s, extractor } = makeSession()
  await s.ready
  assert.equal(s.state.extractor, 'ok')
  assert.equal(s.state.cache, 'absent')
  const progress = []
  s.addEventListener('progress', (e) => progress.push(e.detail.phase))
  const m = await s.extractFile(new Blob(['x']))
  assert.equal(m.source.kind, 'drop')
  assert.equal(m.appUrl, 'http://127.0.0.1:9/app/vfs/app/')
  assert.equal(s.state.cache, 'present')
  assert.equal(s.state.extractions, 1)
  assert.deepEqual(progress, ['parse'])
  assert.equal(extractor.calls, 1)
  // a "reload" with the same extractor finds the cache
  const again = makeSession({ extractor })
  await again.s.ready
  assert.equal(again.s.state.cache, 'present')
  assert.equal(again.s.state.extractions, 0)
})

test('session: a missing extractor leaves the page usable and says why', async () => {
  const { s } = makeSession({ loadExtractor: async () => { throw new Error('boom') } })
  await s.ready
  assert.equal(s.state.extractor, 'error')
  assert.match(s.state.error, /boom/)
  await assert.rejects(s.extractFile(new Blob(['x'])), /boom/)
})

test('session: real-worker preflight refuses without credentials or a cache', async () => {
  const { s, settings } = makeSession({ createWorker: null })
  await s.ready
  await assert.rejects(s.start(), /API key/)
  settings.set({ apiKey: 'sk-ant-api-test' })
  await assert.rejects(s.start(), /Get Claude Code first/)
})

test('session: preflight reports a missing runtime/boot.js', async () => {
  const { s, settings } = makeSession({ createWorker: null, fetch: async (url) => new Response('', { status: String(url).endsWith('boot.js') ? 404 : 200 }) })
  await s.ready
  settings.set({ authMode: 'oauth', token: 'sk-ant-oat01-x' })
  await s.extractFile(new Blob(['x']))
  await assert.rejects(s.start(), /runtime\/boot\.js is not deployed/)
})

test('session: full flow on the fake worker: start, three scenarios, workspace persisted', async () => {
  const store = createMemorySnapshotStore()
  const { s, settings } = makeSession({ store })
  await s.ready
  settings.set({ authMode: 'oauth', token: 'sk-ant-oat01-x' })
  const entries = []
  s.addEventListener('entry', (e) => entries.push(e.detail))
  await s.start()
  assert.equal(s.state.harness, 'ready')
  const boot = s.harness.bridge.worker.received.find((m) => m.type === 'boot')
  assert.equal(boot.env.CLAUDE_CODE_OAUTH_TOKEN, 'sk-ant-oat01-x')
  assert.equal(boot.appUrl, 'http://127.0.0.1:9/app/vfs/app/')
  assert.ok(boot.seedFiles['/home/user/.claude/.claude.json'])
  assert.deepEqual(boot.persistRoots, ['/home/user'])

  const hi = await s.turn('say hi', { timeoutMs: 3000 })
  assert.equal(hi.result.is_error, false)
  assert.ok(s.timings.firstInitMs >= 0)
  assert.equal(entries[entries.length - 1].kind, 'message')
  assert.ok(entries.some((e) => e.kind === 'user' && e.text === 'say hi'))

  const weather = await s.turn('use the weather tool', { timeoutMs: 3000 })
  assert.match(weather.result.result, /Sunny in Paris, 21°C/)
  assert.equal(s.toolCalls.filter((c) => c.tool === 'get_weather').length, 1)

  const workspaceEvents = []
  s.addEventListener('workspace', (e) => workspaceEvents.push(e.detail))
  await s.turn('write a file', { timeoutMs: 3000 })
  await new Promise((resolve) => setTimeout(resolve, 20))
  assert.deepEqual(s.workspace.files.map((f) => f.rel), ['hello.txt'])
  assert.ok(workspaceEvents.length >= 1)
  await s.stop()
  assert.equal(s.state.harness, 'exited')

  // "reload": a new session over the same store lists the file before booting
  const next = makeSession({ store })
  await next.s.ready
  assert.deepEqual(next.s.workspace.files.map((f) => f.rel), ['hello.txt'])
  // and the next boot hands the snapshot to the worker
  next.settings.set({ authMode: 'oauth', token: 't' })
  await next.s.start()
  const boot2 = next.s.harness.bridge.worker.received.find((m) => m.type === 'boot')
  assert.ok(boot2.fsSnapshot instanceof Uint8Array && boot2.fsSnapshot.length > 0)
  await next.s.stop()
})

test('session: concurrent start() calls share one attempt', async () => {
  let workers = 0
  const { s, settings } = makeSession({ createWorker: () => { workers++; return new FakeWorker({ bootDelayMs: 2 }) } })
  await s.ready
  settings.set({ authMode: 'oauth', token: 't' })
  const [a, b] = [s.start(), s.start()]
  assert.equal(a, b)
  await a
  assert.equal(workers, 1)
  await assert.rejects(s.start(), /already running/)
  await s.stop()
})

test('session: ask mode routes permission prompts to the UI', async () => {
  const { s, settings } = makeSession()
  await s.ready
  settings.set({ authMode: 'oauth', token: 't', askPermission: true })
  const prompts = []
  s.addEventListener('entry', (e) => { if (e.detail.kind === 'permission') prompts.push(e.detail.detail) })
  await s.start()
  const done = s.turn('write a file', { timeoutMs: 3000 })
  for (let i = 0; i < 100 && !prompts.length; i++) await new Promise((resolve) => setTimeout(resolve, 5))
  assert.equal(prompts.length, 1)
  assert.equal(prompts[0].toolName, 'Write')
  prompts[0].deny('not now')
  const { result } = await done
  assert.equal(result.result, 'The Write tool was denied.')
  await s.stop()
})

test('session: bad custom tools JSON stops start() with the problems listed', async () => {
  const { s, settings } = makeSession()
  await s.ready
  settings.set({ authMode: 'oauth', token: 't', toolsJson: '{"tools": [{"name": "x"}]}' })
  await assert.rejects(s.start(), /tools\[0\]\.handler/)
  assert.equal(s.harness, null)
})
