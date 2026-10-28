// Worker bootstrap: plays the operating system around one `claude` process.
// The page creates `new Worker(BASE + 'runtime/boot.js', {type: 'module'})`
// and speaks the protocol in src/host/worker-protocol.md.
//
// Boot sequence (ARCHITECTURE.md "Worker boot sequence"):
//   1. globals: process (argv/env/cwd, stdio bridged over postMessage, exit),
//      Buffer, global, setImmediate, Node-style timers  (./node/globals.js);
//      the env gets the policy flags merged in last (./boot/policy.js), and
//      fetch/WebSocket are wrapped by the egress guard (./boot/egress.js);
//      with the boot message's `provider` of kind 'openai-responses' (the
//      ChatGPT subscription option, ARCHITECTURE.md Appendix A) the env points
//      the CLI at a synthetic origin and the OpenAI adapter
//      (./boot/openai-adapter.js) answers it, on top of the egress guard
//   2. the virtual filesystem: the extracted tree read back from the Cache
//      API and mounted at BASE/vfs/app/, then HOME restored from the page's
//      snapshot, then the seed files written where absent  (./node/fs.js)
//   3. Bun (./bun/index.js) and globalThis.__bunRequire
//   4. pre-import every chunk that is __bunRequire'd, in dependency order
//      (./boot/module-graph.js, ./boot/pre-import.js), into the registry __bunRequire reads
//      (./boot/require.js), then import BASE/vfs/app/cli.
//
// Static imports are avoided on purpose: the message listener below must be
// attached before anything can fail, and each phase reports its progress.

const post = (msg, transfer) => self.postMessage(msg, transfer || [])
const log = (level, msg, data) => post({ type: 'log', level, msg, data })
const status = (phase, done, total) => post({ type: 'status', phase, done, total })
const now = () => performance.now()

// --- messages from the page ---------------------------------------------------
let booted = false
let stdin = null // process.stdin, once it exists
const stdinQueue = [] // lines (with '\n') or null (EOF) that arrived before it did
let flushFs = null
let proc = null
let tokenBroker = null // ChatGPT mode: the token handoff (./boot/openai/token.js)

self.addEventListener('message', (ev) => {
  const m = ev.data
  if (!m || typeof m !== 'object') return
  switch (m.type) {
    case 'boot':
      if (booted) return
      booted = true
      main(m).catch((err) => fatal(err, 'boot'))
      break
    case 'stdin': toStdin(`${m.line}\n`); break
    case 'stdin-end': toStdin(null); break
    case 'fs-flush':
      // `id` (optional) comes back on the fs-sync it causes; before the VFS
      // is mounted there is nothing to snapshot, and the answer says so.
      if (flushFs) flushFs([], m.id)
      else if (m.id != null) post({ type: 'fs-sync', snapshot: null, paths: [], flush: m.id })
      break
    case 'signal': if (proc && proc.listenerCount(m.signal) > 0) proc.emit(m.signal, m.signal); break
    case 'provider-token': tokenBroker?.onMessage(m); break
  }
})

// The page sends `initialize` right after boot, seconds before the CLI reads
// stdin. A paused Readable buffers what is pushed into it, so queue only until
// process.stdin exists and push from then on.
function toStdin (chunk) {
  if (stdin) stdin.push(chunk)
  else stdinQueue.push(chunk)
}

// --- exit -----------------------------------------------------------------------
let exited = false
function exitOnce (code, error) {
  if (exited) return
  exited = true
  try { flushFs?.([]) } catch (err) { log('warn', `final fs-sync failed: ${err?.message ?? err}`) }
  post({ type: 'exit', code, ...(error ? { error } : {}) })
}

function fatal (err, where) {
  const message = err?.stack || err?.message || String(err)
  post({ type: 'stderr', chunk: `[boot] ${where}: ${message}\n` })
  exitOnce(1, `${where}: ${err?.message ?? err}`)
}

// --- main ----------------------------------------------------------------------
async function main (boot) {
  const t0 = now()
  const timings = {}
  const mark = (k, t) => { timings[k] = Math.round(now() - t) }
  if (boot.protocol !== 1) throw new Error(`unsupported protocol ${boot.protocol}`)
  // ~1,700 module fetches: keep their timing entries for diagnostics (default buffer: 250)
  performance.setResourceTimingBufferSize?.(10000)
  const base = new URL(boot.base)
  const appUrl = new URL(boot.appUrl ?? new URL('vfs/app/', base))
  const appPath = appUrl.pathname
  const manifest = boot.manifest
  if (!manifest) throw new Error('no manifest: extract Claude Code first')

  // 1. globals -----------------------------------------------------------------
  status('globals')
  let t = now()
  const { installNodeGlobals, ProcessExit } = await import('./node/globals.js')
  const index = await import('./node/index.js')
  const { installSharedMemoryFallback } = await import('./node/internal/shared-memory.js')
  if (installSharedMemoryFallback(globalThis)) log('info', 'not cross-origin isolated: SharedArrayBuffer is an unshared stand-in, Atomics.wait busy-waits')
  // The policy flags last, whatever the page sent (shared with the page's
  // invocation.js through boot/policy.js), then the egress guard on fetch and
  // WebSocket before any Claude Code module can capture them.
  const { workerEnv, providerConfig, applyProviderEnv, PROVIDER_OPENAI_RESPONSES } = await import('./boot/policy.js')
  const provider = providerConfig(boot.provider)
  const env = workerEnv(boot.env)
  applyProviderEnv(env, provider)
  const { installEgressGuard } = await import('./boot/egress.js')
  installEgressGuard(globalThis, { baseUrl: env.ANTHROPIC_BASE_URL, selfOrigin: base.origin, provider, warn: (m) => log('warn', m) })
  if (provider.kind === PROVIDER_OPENAI_RESPONSES) await installProvider(provider, !!boot.trace)
  proc = installNodeGlobals(globalThis, {
    processOptions: {
      argv: ['/usr/local/bin/node', `${appPath}cli`, ...(boot.argv || [])],
      env,
      cwd: boot.cwd || '/home/user/workspace',
      onStdout: (chunk) => post({ type: 'stdout', chunk }),
      onStderr: (chunk) => post({ type: 'stderr', chunk }),
      onExit: (code) => exitOnce(code)
    }
  })
  stdin = proc.stdin
  for (const chunk of stdinQueue.splice(0)) stdin.push(chunk)
  // Uncaught errors the CLI did not handle itself: report once, keep running.
  const { reportUncaught } = await import('./boot/errors.js')
  reportUncaught(self, { post, isExit: (e) => e instanceof ProcessExit })
  if (boot.trace) installTrace(index.namespaces.child_process)
  mark('globals', t)

  // 2. filesystem -----------------------------------------------------------------
  status('vfs')
  t = now()
  const fsMod = await import('./node/fs.js')
  const fs = fsMod.default
  const { preImportOrder, GRAPH_VERSION } = await import('./boot/module-graph.js')
  // The extractor stores the pre-import order in the manifest. With it, the
  // code-split chunks (50 of the 54 MB) stay out of the VFS: they are only
  // ever imported (through sw.js), never read as files. Without it (a cache
  // from an older build), everything is mounted and the order recomputed.
  const graph = manifest.boot?.version === GRAPH_VERSION && manifest.boot.appPath === appPath ? manifest.boot : null
  const isChunk = (rel) => /^chunk-[^/]*\.js$/.test(rel)
  const tree = await loadTree(manifest, graph ? (rel) => !isChunk(rel) : () => true)
  mark('cacheRead', t)
  t = now()
  fsMod.mount(tree)
  mark('mount', t)
  if (boot.fsSnapshot) {
    try {
      fsMod.restore(fsMod.deserializeSnapshot(boot.fsSnapshot))
    } catch (err) {
      log('warn', `the saved workspace could not be restored: ${err?.message ?? err}`)
    }
  }
  const home = env.HOME || '/home/user'
  for (const dir of [home, `${home}/.claude`, boot.cwd || `${home}/workspace`]) fs.mkdirSync(dir, { recursive: true })
  const seeds = { ...(boot.seedFiles || {}) }
  // ~/.claude.json too, for runs without CLAUDE_CONFIG_DIR (the CLI reads
  // <CLAUDE_CONFIG_DIR or HOME>/.claude.json).
  const cfg = seeds[`${home}/.claude/.claude.json`]
  if (cfg && !seeds[`${home}/.claude.json`]) seeds[`${home}/.claude.json`] = cfg
  for (const [p, text] of Object.entries(seeds)) {
    if (fs.existsSync(p)) continue
    fs.mkdirSync(p.slice(0, p.lastIndexOf('/')) || '/', { recursive: true })
    fs.writeFileSync(p, text, { mode: 0o600 })
  }
  const persistRoots = boot.persistRoots || [home]
  flushFs = (paths, flush) => {
    const bytes = fsMod.serializeSnapshot(fsMod.snapshot(persistRoots))
    post({ type: 'fs-sync', snapshot: bytes, paths, ...(flush != null ? { flush } : {}) }, [bytes.buffer])
  }
  // 400 ms after the last write, and at least every 2 s while writes keep coming
  fsMod.onChange(({ paths }) => { if (!exited) flushFs(paths) }, { roots: persistRoots, debounceMs: 400, maxWaitMs: 2000 })

  // 3. Bun and __bunRequire ---------------------------------------------------------
  status('bun')
  const { installBun } = await import('./bun/index.js')
  const ns = index.namespaces
  installBun(globalThis, {
    fs,
    path: ns.path.default,
    crypto: ns.crypto.default,
    zlib: ns.zlib.default,
    childProcess: ns.child_process.default,
    util: ns.util.default,
    process: proc
  })
  // 4. module graph ------------------------------------------------------------------
  t = now()
  const { makeRequire } = await import('./boot/require.js')
  const { order, targets, cyclic, dropped } = graph
    ? { ...graph, targets: new Set(graph.targets) }
    : preImportOrder(tree, appPath)
  mark('graph', t)
  const registry = new Map() // VFS path -> module namespace
  const misses = []
  globalThis.__bunRequire = makeRequire({
    registry,
    known: targets,
    isShimmed: index.isShimmed,
    requireShim: index.requireShim,
    fs,
    onMiss: (p) => {
      misses.push(p)
      const site = (new Error().stack || '').split('\n').slice(2, 6).map((l) => l.trim().replace(appUrl.origin, '')).join(' < ')
      log('debug', `require miss: ${p} from ${site}`)
    }
  })
  t = now()
  const { preImportAll } = await import('./boot/pre-import.js')
  const { failed } = await preImportAll(order, {
    appUrl,
    registry,
    onProgress: (done, total) => status('import', done, total),
    onError: (p, err) => log('warn', p ? `pre-import of ${p} failed: ${err?.message ?? err}` : `the pre-import graph failed (${err?.message ?? err}); importing the rest one by one`)
  })
  mark('preImport', t)
  log(failed.length ? 'warn' : 'info', `boot: ${order.length} modules pre-imported (${failed.length} failed, ${misses.length} require(s) answered with forwarding proxies: ${[...new Set(misses)].map((p) => p.slice(appPath.length)).join(' ') || 'none'}; ${cyclic.length} cyclic top-level pair(s), ${dropped.length} in-function cycle edge(s) dropped); timings ${JSON.stringify(timings)} ms; ${Math.round(now() - t0)} ms total`, { timings, failed, misses })
  status('cli')
  tree.clear()
  await import(manifest.entryUrl || new URL('cli', appUrl).href)
}

// ChatGPT mode: the OpenAI adapter on top of the egress guard (its upstream
// requests go through the guard too), fed access tokens by the page over
// provider-token-request / provider-token (worker-protocol.md).
async function installProvider (provider, trace) {
  const { installOpenAIAdapter, createTokenBroker } = await import('./boot/openai-adapter.js')
  tokenBroker = createTokenBroker({ post })
  const { origin, endpoint } = installOpenAIAdapter(globalThis, {
    provider,
    getToken: ({ failedToken, ambiguous } = {}) => (failedToken ? tokenBroker.renew(failedToken, { ambiguous }) : tokenBroker.get()),
    log: trace ? (m) => log('debug', `[trace] ${m}`) : () => {},
    warn: (m) => log('warn', m)
  })
  // Ask for the first token now, while the CLI boots (reason 'start').
  tokenBroker.get().catch((err) => log('warn', `ChatGPT token: ${err?.message ?? err}`))
  log('info', `ChatGPT mode: model ${provider.model}, effort ${provider.effort}, context window ${provider.contextWindow ?? 'unknown'}; Claude Code's API calls to ${origin} are answered in the Worker from ${endpoint}`)
}

// Diagnostics (boot message `trace: true`, the page's `?trace`): log every
// spawn, fetch and Worker the CLI starts, and how each ends.
function installTrace (childProcess) {
  const t = (msg) => log('debug', `[trace] ${msg}`)
  childProcess.setSpawnTrace(({ kind, command, args, found }) => t(`${kind} ${command} ${args.join(' ').slice(0, 200)}${found ? '' : '  -> not found'}`))
  const realFetch = globalThis.fetch
  let n = 0
  globalThis.fetch = async function fetch (input, init) {
    const id = ++n
    const url = typeof input === 'string' ? input : input?.url ?? String(input)
    // Which path a request took and whether an abort can reach it: the http
    // shim's ClientRequest passes credentials 'omit'; the CLI's own API
    // client calls fetch directly with the SDK's AbortSignal.
    const signal = init?.signal ?? input?.signal
    const via = init?.credentials === 'omit' ? 'http-shim' : 'direct'
    const t0 = performance.now()
    let resAt = 0
    t(`fetch#${id} ${init?.method ?? input?.method ?? 'GET'} ${url} (${via}, ${signal ? (signal.aborted ? 'signal already aborted' : 'signal') : 'no signal'})`)
    signal?.addEventListener?.('abort', () => {
      const ms = Math.round(performance.now() - t0)
      t(`fetch#${id} signal aborted ${ms} ms after dispatch (${resAt ? `response received ${Math.round(resAt - t0)} ms after dispatch` : 'response pending'}): ${signal.reason?.name ?? ''} ${signal.reason?.message ?? signal.reason ?? ''}`)
    }, { once: true })
    try {
      const res = await realFetch.call(this, input, init)
      resAt = performance.now()
      t(`fetch#${id} -> ${res.status}`)
      return res
    } catch (err) {
      t(`fetch#${id} failed: ${err?.message ?? err}`)
      throw err
    }
  }
  const RealWorker = globalThis.Worker
  if (RealWorker) {
    globalThis.Worker = class Worker extends RealWorker {
      constructor (url, opts) { t(`new Worker ${String(url).slice(0, 120)}`); super(url, opts) }
    }
  }
}

// The cached tree as Map<VFS path, Uint8Array> (paths are manifest.appPath + rel,
// so a rewritten "/$bunfs/root/x" string works as an fs path and as an import URL).
async function loadTree (manifest, include) {
  const cache = await caches.open(manifest.cacheName)
  const out = new Map()
  const missing = []
  const paths = manifest.paths.filter(include)
  let next = 0
  let done = 0
  const total = paths.length
  const worker = async () => {
    while (next < total) {
      const rel = paths[next++]
      const res = await cache.match(new URL(rel, manifest.appUrl).href)
      if (!res) { missing.push(rel); continue }
      out.set(manifest.appPath + rel, new Uint8Array(await res.arrayBuffer()))
      if (++done % 200 === 0) status('vfs', done, total)
    }
  }
  await Promise.all(Array.from({ length: 32 }, worker))
  if (missing.length) throw new Error(`${missing.length} cached files are missing (first: ${missing[0]}); clear the cache and extract again`)
  return out
}
