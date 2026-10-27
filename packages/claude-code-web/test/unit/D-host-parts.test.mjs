// Track D: the small host modules: invocation (argv/env), custom tools,
// snapshots, the Worker bridge, settings and the acquisition adapter.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildArgv, buildEnv, checkCredentials, seedFiles } from '../../src/host/invocation.js'
import { parseToolsConfig, compileTools, mcpServersFromText, DEFAULT_TOOLS_JSON, ToolsConfigError } from '../../src/host/custom-tools.js'
import { encodeSnapshot, decodeSnapshot, listEntries, readText, isSnapshotBytes } from '../../src/host/snapshot.js'
import { WorkerBridge, LineSplitter } from '../../src/host/worker-bridge.js'
import { createSettings, DEFAULT_SETTINGS } from '../../src/host/settings.js'
import { createMemorySnapshotStore } from '../../src/host/persist.js'
import { describeManifest, downloadAndExtract, npmUrl } from '../../src/host/acquire.js'
import { baseUrl, appUrlFor, workerUrlFor, randomId } from '../../src/host/constants.js'

test('invocation: argv matches the contract', () => {
  const argv = buildArgv({ model: 'claude-sonnet-5-5', mcpServerNames: ['page'] })
  assert.deepEqual(argv, [
    '-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--verbose',
    '--permission-prompt-tool', 'stdio', '--permission-mode', 'default',
    '--disallowedTools', 'Bash,BashOutput,KillShell,WebFetch,WebSearch',
    '--mcp-config', '{"mcpServers":{"page":{"type":"sdk","name":"page"}}}',
    '--strict-mcp-config', '--no-session-persistence', '--model', 'claude-sonnet-5-5'
  ])
  const bare = buildArgv()
  assert.ok(!bare.includes('--mcp-config'))
  assert.ok(!bare.includes('--model'))
  assert.ok(bare.includes('--strict-mcp-config'))
})

test('invocation: env sets one credential and the policy flags cannot be overridden', () => {
  const oauth = buildEnv({ authMode: 'oauth', token: ' sk-ant-oat01-x ', apiKey: 'sk-ant-api-y', baseUrl: 'http://127.0.0.1:1/', extra: { DISABLE_TELEMETRY: '0', ANTHROPIC_API_KEY: 'sneaky' } })
  assert.equal(oauth.CLAUDE_CODE_OAUTH_TOKEN, 'sk-ant-oat01-x')
  assert.equal(oauth.ANTHROPIC_API_KEY, undefined)
  assert.equal(oauth.ANTHROPIC_BASE_URL, 'http://127.0.0.1:1')
  for (const k of ['CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', 'DISABLE_TELEMETRY', 'DISABLE_ERROR_REPORTING', 'DISABLE_AUTOUPDATER']) assert.equal(oauth[k], '1', k)
  assert.equal(oauth.HOME, '/home/user')
  assert.equal(oauth.CLAUDE_CONFIG_DIR, '/home/user/.claude')
  assert.equal(oauth.TERM, 'dumb')
  assert.equal(oauth.SHELL, '')
  assert.equal(oauth.USE_BUILTIN_RIPGREP, 'false')
  assert.equal(oauth.CLAUDE_CODE_ENTRYPOINT, 'sdk-cli')
  assert.equal(oauth['User-Agent'], undefined)
  const key = buildEnv({ authMode: 'api-key', apiKey: 'sk-ant-api-y', token: 't' })
  assert.equal(key.ANTHROPIC_API_KEY, 'sk-ant-api-y')
  assert.equal(key.CLAUDE_CODE_OAUTH_TOKEN, undefined)
  assert.equal(key.ANTHROPIC_BASE_URL, 'https://api.anthropic.com')
  assert.throws(() => checkCredentials({ authMode: 'oauth', token: ' ' }), /setup-token/)
  assert.throws(() => checkCredentials({ authMode: 'api-key', apiKey: '' }), /API key/)
  assert.doesNotThrow(() => checkCredentials({ authMode: 'api-key', apiKey: 'k' }))
})

test('invocation: seed files mark onboarding done and the workspace trusted', () => {
  const files = seedFiles({ version: '2.1.311' })
  const cfg = JSON.parse(files['/home/user/.claude/.claude.json'])
  assert.equal(cfg.hasCompletedOnboarding, true)
  assert.equal(cfg.projects['/home/user/workspace'].hasTrustDialogAccepted, true)
  assert.match(files['/home/user/.claude/CLAUDE.md'], /no shell/)
})

test('custom tools: the default parses, compiles and runs', async () => {
  const cfg = parseToolsConfig(DEFAULT_TOOLS_JSON)
  assert.equal(cfg.server, 'page')
  assert.equal(cfg.tools[0].name, 'get_weather')
  const [tool] = compileTools(cfg, { extra: 1 })
  assert.equal(await tool.handler({ city: 'Paris' }, {}), 'Sunny in Paris, 21°C')
  const servers = mcpServersFromText(DEFAULT_TOOLS_JSON)
  assert.deepEqual(Object.keys(servers), ['page'])
  assert.deepEqual(mcpServersFromText(''), {})
  assert.deepEqual(mcpServersFromText('{"tools": []}'), {})
})

test('custom tools: handlers are async bodies with ctx', async () => {
  const [t] = compileTools(parseToolsConfig(JSON.stringify([{ name: 'a', handler: ['await null', 'return ctx.tag + input.x'] }])), { tag: '#' })
  assert.equal(await t.handler({ x: 1 }, { tool: 'a' }), '#1')
})

test('custom tools: every problem is reported', () => {
  assert.throws(() => parseToolsConfig('{'), (e) => e instanceof ToolsConfigError && /not valid JSON/.test(e.message))
  try {
    parseToolsConfig(JSON.stringify({ server: 'bad server', tools: [{ name: 'x y', handler: 'return (' }, { name: 'ok', inputSchema: { type: 'string' }, handler: 'return 1' }, { name: 'ok', handler: 'return 1' }, 5] }))
    assert.fail('should throw')
  } catch (e) {
    assert.ok(e instanceof ToolsConfigError)
    const all = e.problems.join('\n')
    assert.match(all, /"server" must match/)
    assert.match(all, /tools\[0\]\.name must match/)
    assert.match(all, /tools\[0\]\.handler does not compile/)
    assert.match(all, /tools\[1\]\.inputSchema/)
    assert.match(all, /tools\[2\]\.name "ok" is a duplicate/)
    assert.match(all, /tools\[3\] must be an object/)
  }
})

test('snapshot: encode/decode round trip and listing', () => {
  const te = new TextEncoder()
  const snap = {
    version: 1,
    roots: ['/home/user'],
    entries: [
      { path: '/home/user', type: 'dir', mode: 0o755, mtimeMs: 1 },
      { path: '/home/user/.claude/.claude.json', type: 'file', mode: 0o600, mtimeMs: 2, data: te.encode('{}') },
      { path: '/home/user/workspace', type: 'dir', mode: 0o755, mtimeMs: 3 },
      { path: '/home/user/workspace/b.txt', type: 'file', mode: 0o644, mtimeMs: 4, data: te.encode('bee') },
      { path: '/home/user/workspace/a/x.md', type: 'file', mode: 0o644, mtimeMs: 5, data: te.encode('# x') },
      { path: '/home/user/workspace/link', type: 'symlink', mode: 0o777, mtimeMs: 6, target: 'b.txt' }
    ]
  }
  const bytes = encodeSnapshot(snap)
  assert.equal(isSnapshotBytes(bytes), true)
  const back = decodeSnapshot(bytes)
  assert.equal(back.entries.length, 6)
  assert.equal(readText(back, '/home/user/workspace/b.txt'), 'bee')
  assert.equal(back.entries[5].target, 'b.txt')
  assert.deepEqual(listEntries(back).map((e) => [e.rel, e.type, e.size]), [['a/x.md', 'file', 3], ['b.txt', 'file', 3], ['link', 'symlink', 0]])
  assert.equal(decodeSnapshot(back), back, 'objects pass through')
  assert.equal(decodeSnapshot(bytes.buffer).entries.length, 6)
  assert.throws(() => decodeSnapshot(new Uint8Array(20)), /bad magic/)
  assert.equal(decodeSnapshot(null), null)
})

test('snapshot: byte-compatible with the fs shim serializeSnapshot when it loads', async (t) => {
  // The shim only resolves inside an assembled runtime dir; track B's test
  // helper builds one in a temp dir.
  let fsmod
  try {
    const { load } = await import('./B-support.mjs')
    fsmod = await load('node/fs.js')
  } catch (err) {
    t.skip(`the fs shim could not be loaded (${String(err?.message ?? err).split('\n')[0]})`)
    return
  }
  if (typeof fsmod.serializeSnapshot !== 'function') { t.skip('fs.js has no serializeSnapshot'); return }
  const te = new TextEncoder()
  const snap = { version: 1, roots: ['/r'], entries: [{ path: '/r/f', type: 'file', mode: 0o644, mtimeMs: 1, data: te.encode('hi') }] }
  assert.deepEqual(encodeSnapshot(snap), fsmod.serializeSnapshot(snap))
  assert.equal(readText(decodeSnapshot(fsmod.serializeSnapshot(snap)), '/r/f'), 'hi')
})

test('bridge: line splitting across chunks, \\r\\n, and flush on exit', () => {
  const s = new LineSplitter()
  assert.deepEqual(s.push('{"a":'), [])
  assert.deepEqual(s.push('1}\r\n{"b"'), ['{"a":1}'])
  assert.deepEqual(s.push(':2}\n\n'), ['{"b":2}', ''])
  assert.deepEqual(s.push('tail'), [])
  assert.deepEqual(s.flush(), ['tail'])
})

test('bridge: messages become events; exit happens once and terminates', () => {
  const w = new EventTarget()
  w.posted = []
  w.postMessage = (m) => w.posted.push(m)
  w.terminate = () => { w.terminated = (w.terminated ?? 0) + 1 }
  const b = new WorkerBridge(w)
  const got = []
  for (const t of ['stdout', 'stderr', 'exit', 'log', 'status', 'fs-sync', 'error']) b.addEventListener(t, (e) => got.push([t, e.detail]))
  b.boot({ argv: ['-p'] })
  assert.throws(() => b.boot({}), /already booted/)
  assert.equal(w.posted[0].type, 'boot')
  assert.equal(w.posted[0].protocol, 1)
  b.writeLine('{"x":1}')
  assert.throws(() => b.writeLine('a\nb'), /newline/)
  b.endInput(); b.flushFs(); b.signal()
  assert.deepEqual(w.posted.slice(1).map((m) => m.type), ['stdin', 'stdin-end', 'fs-flush', 'signal'])
  const send = (data) => w.dispatchEvent(new MessageEvent('message', { data }))
  send({ type: 'stdout', line: 'L1' })
  send({ type: 'stdout', chunk: 'L2\nL' })
  send({ type: 'stdout', chunk: new TextEncoder().encode('3\n') })
  send({ type: 'stderr', chunk: 'no newline' })
  send({ type: 'log', level: 'warn', msg: 'm' })
  send({ type: 'status', phase: 'import', done: 1, total: 2 })
  send({ type: 'fs-sync', snapshot: new Uint8Array([1]), paths: ['/p'] })
  send({ type: 'exit', code: 3 })
  send({ type: 'exit', code: 4 })
  assert.deepEqual(got.filter(([t]) => t === 'stdout').map(([, d]) => d.line), ['L1', 'L2', 'L3'])
  assert.deepEqual(got.filter(([t]) => t === 'stderr').map(([, d]) => d.line), ['no newline'], 'flushed on exit')
  assert.deepEqual(got.filter(([t]) => t === 'exit').map(([, d]) => d.code), [3])
  assert.equal(got.find(([t]) => t === 'status')[1].total, 2)
  assert.deepEqual(got.find(([t]) => t === 'fs-sync')[1].paths, ['/p'])
  assert.equal(w.terminated, 1)
})

test('bridge: an ErrorEvent after the worker spoke is not fatal; a load failure is', () => {
  const mk = () => { const w = new EventTarget(); w.postMessage = () => {}; w.terminate = () => {}; return w }
  const w1 = mk()
  const b1 = new WorkerBridge(w1)
  w1.dispatchEvent(new MessageEvent('message', { data: { type: 'log', msg: 'hi' } }))
  w1.dispatchEvent(Object.assign(new Event('error'), { message: 'TypeError: x' }))
  assert.equal(b1.exited, false)
  const w2 = mk()
  const b2 = new WorkerBridge(w2)
  w2.dispatchEvent(new Event('error'))
  assert.equal(b2.exited, true)
  assert.equal(b2.exitInfo.code, 1)
})

function memoryStorage () {
  const m = new Map()
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }
}

test('settings: defaults, persistence, sanitising', () => {
  const storage = memoryStorage()
  const s = createSettings({ storage })
  assert.deepEqual(s.get(), { ...DEFAULT_SETTINGS })
  assert.equal(s.get().authMode, 'api-key', 'API key is the default auth mode')
  s.set({ authMode: 'oauth', token: 'tok', askPermission: 1, bogus: 'x', model: 5 })
  const again = createSettings({ storage }).get()
  assert.equal(again.authMode, 'oauth')
  assert.equal(again.token, 'tok')
  assert.equal(again.askPermission, true)
  assert.equal(again.bogus, undefined)
  assert.equal(again.model, '')
  storage.setItem('cc-web:settings', '{not json')
  assert.deepEqual(createSettings({ storage }).get(), { ...DEFAULT_SETTINGS })
  const throwing = { getItem () { throw new Error('denied') }, setItem () { throw new Error('denied') }, removeItem () {} }
  const t = createSettings({ storage: throwing })
  assert.equal(t.set({ model: 'm' }).model, 'm', 'works in memory when storage throws')
})

test('persist: memory snapshot store copies bytes', async () => {
  const st = createMemorySnapshotStore()
  assert.equal(await st.load(), null)
  const b = new Uint8Array([1, 2])
  await st.save(b)
  b[0] = 9
  assert.deepEqual(await st.load(), new Uint8Array([1, 2]))
  await st.clear()
  assert.equal(await st.load(), null)
})

test('acquire: download streams progress into extractFromBinary', async () => {
  const body = new Uint8Array(3 << 20)
  const seen = []
  const mod = {
    npmTarballUrl: (p, v) => `https://registry.example/${p}/${v}.tgz`,
    DEFAULT_PLATFORM: 'linux-x64',
    async extractFromBinary (input, opts) {
      let n = 0
      for await (const c of input) n += c.byteLength
      opts.onProgress({ phase: 'read', loaded: n })
      opts.onProgress({ phase: 'rewrite' })
      return { version: opts.version, source: { kind: opts.source }, bytes: n }
    }
  }
  const fetch = async (url) => new Response(body, { headers: { 'content-length': String(body.length) } })
  const m = await downloadAndExtract(mod, { version: '2.1.311', fetch, onProgress: (p) => seen.push(p) })
  assert.equal(m.bytes, body.length)
  assert.equal(m.source.kind, 'npm')
  assert.equal(seen[0].url, 'https://registry.example/linux-x64/2.1.311.tgz')
  assert.ok(seen.some((p) => p.phase === 'download' && p.loaded === body.length && p.total === body.length))
  assert.ok(!seen.some((p) => p.phase === 'read'), "the extractor's read phase is folded into download")
  assert.ok(seen.some((p) => p.phase === 'rewrite'))
  await assert.rejects(downloadAndExtract(mod, { fetch: async () => new Response('x', { status: 404 }) }), /HTTP 404/)
  assert.match(npmUrl({}), /claude-code-linux-x64-2\.1\.311\.tgz$/)
})

test('acquire: describeManifest', () => {
  assert.equal(describeManifest(null), 'not cached')
  const d = describeManifest({ version: '2.1.311', moduleCount: 2848, files: 2846, bytes: 54_000_000, rewrites: { ok: true, rewrites: new Array(7) }, source: { kind: 'drop' } })
  assert.equal(d, 'Claude Code 2.1.311: 2,848 modules (2,846 cached, 54.0 MB), 7 rewrites at expected counts, from dropped file')
})

test('constants: URL layout relative to BASE', () => {
  const base = baseUrl({ href: 'https://kumavis.github.io/vibe-dump/claude-code-web/index.html?x#y' })
  assert.equal(base, 'https://kumavis.github.io/vibe-dump/claude-code-web/')
  assert.equal(appUrlFor(base), 'https://kumavis.github.io/vibe-dump/claude-code-web/vfs/app/')
  assert.equal(workerUrlFor(base), 'https://kumavis.github.io/vibe-dump/claude-code-web/runtime/boot.js')
  assert.match(randomId(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
})
