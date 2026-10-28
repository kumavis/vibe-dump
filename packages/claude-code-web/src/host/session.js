// The page's orchestrator: owns the settings, the cached extraction, the
// persisted VFS snapshot and the current Harness, and tells the UI what
// changed. No DOM here (the UI in src/ui/ listens to the events), so the
// whole flow is testable under Node with the fake worker.
//
// Events (CustomEvent):
//   'change'     state changed (session.state)
//   'entry'      {kind: 'user'|'message'|'note'|'stderr'|'permission', ...} for the transcript
//   'workspace'  the workspace listing changed (session.workspace)
//   'progress'   extraction/download progress {phase, ...}
//   'saved'      a workspace snapshot reached the store {at, bytes} (whenSaved() waits for the latest)
//
// One tab at a time: the session holds the Web Lock 'cc-web:home' for its
// whole lifetime (state.lock: held | other-tab | unsupported). A second tab
// of the same origin cannot take it, says so and refuses Start (two Workers
// saving one OPFS file would overwrite each other's workspace); it takes the
// lock over, with a fresh read of the saved workspace, once the first tab is
// gone.

import { Harness } from './harness.js'
import { buildEnv, checkBaseUrl, checkChatgptUrls, checkCredentials, harnessModel, providerConfig, seedFiles } from './invocation.js'
import { serveProviderTokens } from './worker-bridge.js'
import { createSiwc } from './siwc.js'
import { chatgptConfig } from './settings.js'
import { mcpServersFromText } from './custom-tools.js'
import { decodeSnapshot, encodeSnapshot, listEntries } from './snapshot.js'
import { createSnapshotStore } from './persist.js'
import { createSettings } from './settings.js'
import { ensureServiceWorker } from './sw-client.js'
import * as acquire from './acquire.js'
import { CC_VERSION, HOME, WORKSPACE, baseUrl, appUrlFor, workerUrlFor } from './constants.js'

export const LOCK_NAME = 'cc-web:home'
const OTHER_TAB = 'Claude Code is open in another tab of this site. Use that tab, or close it first: two tabs would overwrite each other\'s saved workspace.'

export class Session extends EventTarget {
  /**
   * @param {object} [o]
   * @param {string} [o.base]              BASE (default: this page's directory)
   * @param {boolean} [o.fake]             use fake-worker.js instead of runtime/boot.js
   * @param {() => object} [o.createWorker] custom Worker factory (tests)
   * @param {object} [o.settings]          createSettings() result
   * @param {object} [o.snapshotStore]     persist.js store
   * @param {() => Promise<object>} [o.loadExtractor]
   * @param {boolean} [o.serviceWorker]    register sw.js (default true unless fake)
   * @param {CacheStorage} [o.caches]      passed to the extractor (tests)
   * @param {typeof fetch} [o.fetch]
   * @param {{trace?: boolean, cliDebug?: boolean}} [o.diagnostics]  trace: boot.js logs every
   *   spawn, fetch and Worker the CLI starts; cliDebug: the CLI's own --debug-to-stderr.
   *   Both land in the page log (the page's ?trace and ?debug).
   * @param {LockManager|null} [o.locks]   Web Locks (default navigator.locks; null: no single-tab guard)
   * @param {object} [o.siwc]              createSiwc() result (Sign in with ChatGPT; default: over these settings and fetch)
   */
  constructor ({ base, fake = false, createWorker, settings, snapshotStore, loadExtractor, serviceWorker, caches, fetch, version = CC_VERSION, diagnostics = {}, locks, siwc } = {}) {
    super()
    this.diagnostics = { trace: Boolean(diagnostics.trace), cliDebug: Boolean(diagnostics.cliDebug) }
    this.base = base ?? baseUrl()
    this.appUrl = appUrlFor(this.base)
    this.workerUrl = workerUrlFor(this.base)
    this.version = version
    this.fake = fake
    this.createWorker = createWorker ?? (fake ? async () => new (await import('./fake-worker.js')).FakeWorker() : null)
    this.settings = settings ?? createSettings()
    this.snapshotStore = snapshotStore ?? null
    this._loadExtractor = loadExtractor ?? (() => acquire.loadExtractor())
    this.useServiceWorker = serviceWorker ?? !fake
    this.caches = caches
    this.fetch = fetch ?? globalThis.fetch?.bind(globalThis)
    this.siwc = siwc ?? createSiwc({ settings: this.settings, fetch: this.fetch })
    this.extractor = null
    this.harness = null
    this.locks = locks === undefined ? globalThis.navigator?.locks ?? null : locks
    this.log = []
    this.workspace = { snapshot: null, files: [], updatedAt: 0 }
    this.timings = {}
    this.state = {
      extractor: 'loading', // loading | ok | error
      cache: 'unknown', // unknown | absent | present | extracting | error
      manifest: null,
      progress: null,
      sw: { state: this.useServiceWorker ? 'pending' : 'off' },
      harness: 'stopped', // stopped | booting | ready | exited
      busy: false,
      error: null,
      extractions: 0, // extractions run by this page load (0 after a cached reload)
      store: 'pending',
      lock: 'pending', // held | other-tab | unsupported | released
      savedAt: 0
    }
    this.ready = this.#init()
  }

  async #init () {
    if (!this.snapshotStore) this.snapshotStore = await createSnapshotStore()
    this.state.store = this.snapshotStore.kind
    if (!(await this.#tryLock())) this.#waitForLock()
    await this.#loadWorkspace()
    if (this.useServiceWorker) {
      this.swReady = ensureServiceWorker(this.base, { fetch: this.fetch }).then((sw) => { this.#set({ sw }); return sw })
    }
    try {
      this.extractor = await this._loadExtractor()
      this.#set({ extractor: 'ok' })
      await this.refreshCache()
    } catch (err) {
      this.#set({ extractor: 'error', cache: 'error', error: err.message })
    }
    this.#emit('change', this.state)
  }

  async #loadWorkspace () {
    try {
      const bytes = await this.snapshotStore.load()
      if (bytes) this.#setWorkspace(decodeSnapshot(bytes))
    } catch (err) {
      this.note('warn', `The saved workspace could not be read: ${err.message}`)
    }
  }

  // --- the single-writer lock --------------------------------------------
  #releaseLock = null
  #lockWait = null

  #holdLock (lock) {
    if (!lock) return undefined
    this.#lockWait?.abort()
    this.#lockWait = null
    this.#set({ lock: 'held' })
    return new Promise((resolve) => { this.#releaseLock = resolve })
  }

  /** Take the lock if no other tab holds it. */
  async #tryLock () {
    if (this.state.lock === 'held' || this.state.lock === 'unsupported') return true
    if (!this.locks?.request) { this.#set({ lock: 'unsupported' }); return true }
    let got = false
    try {
      await new Promise((resolve, reject) => {
        this.locks.request(LOCK_NAME, { ifAvailable: true }, (lock) => {
          got = Boolean(lock)
          resolve()
          return this.#holdLock(lock)
        }).catch(reject)
      })
    } catch (err) {
      this.note('warn', `Web Locks failed (${err?.message ?? err}); not guarding against a second tab`)
      this.#set({ lock: 'unsupported' })
      return true
    }
    if (!got) this.#set({ lock: 'other-tab' })
    return got
  }

  /** Queue for the lock: granted once the other tab is gone (or, right after a reload, has let go). */
  #waitForLock () {
    if (this.#lockWait || !this.locks?.request) return
    const ctl = this.#lockWait = new AbortController()
    this.locks.request(LOCK_NAME, { signal: ctl.signal }, async (lock) => {
      if (!lock || ctl.signal.aborted) return
      const held = this.#holdLock(lock)
      // the other tab may have saved since this page read the store
      await this.#loadWorkspace()
      return held
    }).catch(() => {})
  }

  /** Release the lock and stop (tests; a closing page releases it by itself). */
  async dispose () {
    await this.stop().catch(() => {})
    this.#lockWait?.abort()
    this.#lockWait = null
    this.#releaseLock?.()
    this.#releaseLock = null
    if (this.state.lock === 'held') this.#set({ lock: 'released' })
  }

  async refreshCache () {
    if (!this.extractor) return null
    try {
      const manifest = await acquire.cachedManifest(this.extractor, { version: this.version, appUrl: this.appUrl, caches: this.caches })
      this.#set({ manifest, cache: manifest ? 'present' : 'absent' })
      return manifest
    } catch (err) {
      this.#set({ cache: 'error', error: `cache check failed: ${err.message}` })
      return null
    }
  }

  /** Extract from a dropped File/Blob (the user's own binary or tarball). */
  extractFile (file) {
    return this.#extract((onProgress) => acquire.extractFile(this.extractor, file, { version: this.version, appUrl: this.appUrl, onProgress, caches: this.caches }))
  }

  /** Download the pinned platform package from npm and extract it. */
  download () {
    return this.#extract((onProgress) => acquire.downloadAndExtract(this.extractor, { version: this.version, appUrl: this.appUrl, onProgress, caches: this.caches, fetch: this.fetch }))
  }

  async clearCache () {
    if (!this.extractor) return
    this.#refuseWhileRunning('clear the cache')
    await acquire.clearExtraction(this.extractor, { caches: this.caches })
    await this.refreshCache()
  }

  async #extract (run) {
    await this.ready
    if (!this.extractor) throw new Error(this.state.error ?? 'the extractor is not available')
    if (this.state.cache === 'extracting') throw new Error('an extraction is already running')
    this.#refuseWhileRunning('extract again')
    this.#set({ cache: 'extracting', progress: { phase: 'start' }, error: null })
    const t0 = Date.now()
    try {
      const manifest = await run((p) => { this.state.progress = p; this.#emit('progress', p) })
      this.state.extractions++
      this.timings.extractMs = Date.now() - t0
      this.#set({ manifest, cache: 'present', progress: { phase: 'done' } })
      this.note('info', `Extracted in ${((Date.now() - t0) / 1000).toFixed(1)} s: ${acquire.describeManifest(manifest)}`)
      return manifest
    } catch (err) {
      const detail = err?.drift?.length ? `\n${err.drift.map((d) => `${d.id}: expected ${JSON.stringify(d.expected)}, got ${d.actual?.matches}`).join('\n')}` : ''
      this.#set({ cache: this.state.manifest ? 'present' : 'absent', progress: null, error: `${err.message}${detail}` })
      this.note('error', `Extraction failed: ${err.message}${detail}`)
      throw err
    }
  }

  /** The running Worker imports from the cached tree: replacing it underneath would break its later imports. */
  #refuseWhileRunning (what) {
    const h = this.state.harness
    if (h === 'booting' || h === 'ready') throw new Error(`Stop Claude Code before you ${what}: the running process loads code from the cache.`)
  }

  /**
   * Boot Claude Code with the current settings. Resolves with the initialize
   * response. `session.starting` holds the latest attempt (tests await it).
   */
  start () {
    // One attempt at a time (a double click must not boot two Workers).
    if (this.starting && this.startInFlight) return this.starting
    this.startInFlight = true
    this.starting = this.#start().finally(() => { this.startInFlight = false })
    this.starting.catch(() => {})
    return this.starting
  }

  async #start () {
    await this.ready
    if (this.harness && this.harness.state !== 'exited') throw new Error('Claude Code is already running')
    if (this.state.lock === 'other-tab') {
      if (!(await this.#tryLock())) {
        this.#set({ error: OTHER_TAB })
        this.note('error', OTHER_TAB)
        throw new Error(OTHER_TAB)
      }
      await this.#loadWorkspace() // just taken over: the other tab may have saved since
    }
    const s = this.settings.get()
    const chatgpt = s.authMode === 'chatgpt'
    let mcpServers
    let argvEnv
    let provider
    try {
      if (!this.fake) checkCredentials(s)
      const badBase = chatgpt ? checkChatgptUrls(s.chatgpt) : checkBaseUrl(s.baseUrl)
      if (badBase) throw new Error(badBase)
      mcpServers = mcpServersFromText(s.toolsJson, { log: (...a) => this.note('info', a.join(' ')) })
      if (!this.createWorker) await this.#preflight()
      let contextWindow = null
      let efforts = null
      if (chatgpt) {
        const model = chatgptConfig(s.chatgpt).model
        if (!this.fake) {
          // signed out, or a refresh that cannot work: say so before a boot
          await this.siwc.getAccessToken()
          // after a reload the model list is gone: fetch it once for the context window (best effort)
          if (this.siwc.contextWindowFor(model) == null) await this.siwc.listModels().catch((err) => this.#log('warn', `ChatGPT: no model list (${err.message}); the context window of ${model} is unknown`))
        }
        contextWindow = this.siwc.contextWindowFor(model)
        efforts = this.siwc.models?.find((m) => m.slug === model)?.efforts ?? null
      }
      argvEnv = buildEnv({ ...s, contextWindow })
      provider = providerConfig(s, { contextWindow, efforts })
    } catch (err) {
      this.#set({ error: err.message })
      this.note('error', err.message)
      throw err
    }
    // The in-memory snapshot is the newest state (every fs-sync lands here
    // before it is saved), so a Start right after a Stop never boots from an
    // older file whose save is still in flight.
    const snap = this.workspace.snapshot
    const snapshotBytes = snap?.entries?.length ? encodeSnapshot(snap) : null
    const harness = this.harness = new Harness({
      workerUrl: this.workerUrl,
      createWorker: chatgpt ? this.#tokenServingWorker() : this.createWorker ?? undefined,
      env: argvEnv,
      model: harnessModel(s),
      mcpServers,
      extraArgs: this.diagnostics.cliDebug ? ['--debug-to-stderr'] : [],
      boot: {
        trace: this.diagnostics.trace,
        base: this.base,
        appUrl: this.appUrl,
        version: this.version,
        manifest: this.state.manifest,
        fsSnapshot: snapshotBytes,
        seedFiles: seedFiles({ version: this.version }),
        persistRoots: [HOME],
        provider
      },
      transfer: snapshotBytes ? [snapshotBytes.buffer] : [],
      permissionPolicy: 'allow'
    })
    this.#wire(harness)
    this.timings.startAt = Date.now()
    this.timings.readyMs = this.timings.firstInitMs = undefined
    this.#set({ harness: 'booting', error: null, busy: false })
    this.note('info', this.fake ? 'Starting the fake worker…' : 'Starting Claude Code…')
    try {
      const res = await harness.start()
      this.timings.readyMs = Date.now() - this.timings.startAt
      this.#set({ harness: 'ready' })
      this.note('info', `Claude Code is up (${(this.timings.readyMs / 1000).toFixed(1)} s). Send a message.`)
      if (chatgpt) this.note('info', `ChatGPT mode: Claude Code reports ${harnessModel(s)}, but every request goes to ${provider.model} on your ChatGPT plan. Its cost line is in Claude prices and does not describe your ChatGPT usage.`)
      return res
    } catch (err) {
      this.#set({ harness: 'exited', error: err.message })
      this.note('error', `Claude Code did not start: ${err.message}`)
      throw err
    }
  }

  /**
   * The Worker factory for ChatGPT mode: the Worker asks the page for access
   * tokens (provider-token-request); the answer comes from Sign in with
   * ChatGPT, and the refresh token never leaves the page. The listener is on
   * before the Harness posts the boot message.
   */
  #tokenServingWorker () {
    const make = this.createWorker ?? (() => new Worker(this.workerUrl, { type: 'module', name: 'claude-code' }))
    return async () => {
      const worker = await make()
      serveProviderTokens(worker, {
        getAccessToken: (o) => this.siwc.getAccessToken(o),
        onRequest: ({ reason }) => this.#log('info', `ChatGPT: the Worker asked for an access token (${reason})`),
        onAnswer: ({ reason, ok, error }) => {
          if (!ok) this.note('error', `ChatGPT sign-in: ${error}`)
          else if (reason === 'unauthorized') this.#log('warn', 'ChatGPT: OpenAI refused the access token; the sign-in was refreshed')
        }
      })
      return worker
    }
  }

  /** Why a real boot cannot work yet, before spending seconds on it. */
  async #preflight () {
    if (!this.state.manifest) throw new Error('Get Claude Code first: drop your `claude` binary or download it from npm.')
    if (this.swReady) {
      const sw = await this.swReady
      if (sw.state !== 'controlled') throw new Error(`The service worker that serves the extracted code is not ready (${sw.state}${sw.error ? `: ${sw.error}` : ''}).`)
    }
    if (this.fetch) {
      const res = await this.fetch(this.workerUrl, { method: 'HEAD', cache: 'no-store' }).catch(() => null)
      if (res && res.status === 404) throw new Error(`${this.workerUrl} is not deployed (the runtime has not been built into this page).`)
    }
  }

  #wire (harness) {
    harness.addEventListener('message', (e) => {
      const msg = e.detail
      if (msg.type === 'system' && msg.subtype === 'init' && this.timings.firstInitMs === undefined) this.timings.firstInitMs = Date.now() - this.timings.startAt
      if (msg.type === 'result') this.#set({ busy: false })
      if (msg.type !== 'control_request' && msg.type !== 'control_response' && msg.type !== 'keep_alive') this.#emit('entry', { kind: 'message', msg })
    })
    harness.addEventListener('stderr', (e) => { this.#log('stderr', e.detail.line); this.#emit('entry', { kind: 'stderr', line: e.detail.line }) })
    harness.addEventListener('stdout_text', (e) => this.#log('stdout', e.detail.line))
    harness.addEventListener('log', (e) => this.#log(e.detail.level, e.detail.msg))
    harness.addEventListener('status', (e) => { this.state.boot = e.detail; this.#emit('change', this.state) })
    harness.addEventListener('error', (e) => this.note('error', `Worker: ${e.detail.message}`))
    harness.addEventListener('fs-sync', (e) => this.#onFsSync(e.detail))
    harness.addEventListener('denied', (e) => this.note('warn', `Denied ${e.detail.toolName}: it is not on this page's tool allowlist.`))
    harness.addEventListener('permission', (e) => {
      if (!this.settings.get().askPermission) return // unhandled: the harness allows
      e.preventDefault()
      this.#emit('entry', { kind: 'permission', detail: e.detail })
    })
    harness.addEventListener('exit', (e) => {
      if (this.harness !== harness) return
      const { code, signal, error } = e.detail
      this.#set({ harness: 'exited', busy: false })
      this.note(code === 0 ? 'info' : 'error', `Claude Code exited (${signal ?? `code ${code}`})${error ? `: ${error}` : ''}`)
    })
  }

  // The latest save (never rejects: a failure is reported through note()).
  #saving = Promise.resolve()

  #onFsSync ({ snapshot }) {
    if (!snapshot) return
    let bytes
    try {
      const snap = decodeSnapshot(snapshot)
      this.#setWorkspace(snap)
      bytes = snapshot instanceof Uint8Array ? snapshot : ArrayBuffer.isView(snapshot) || snapshot instanceof ArrayBuffer ? new Uint8Array(snapshot) : encodeSnapshot(snap)
    } catch (err) {
      this.note('warn', `The Worker sent a workspace snapshot that could not be read: ${err.message}`)
      return
    }
    const saved = Promise.resolve()
      .then(() => this.snapshotStore.save(bytes))
      .then(() => {
        this.state.savedAt = Date.now()
        this.#emit('saved', { at: this.state.savedAt, bytes: bytes.byteLength })
      }, (err) => this.note('warn', `Could not save the workspace (it is only in this tab until the next successful save): ${err?.message ?? err}`))
    const before = this.#saving
    this.#saving = Promise.all([before, saved]).then(() => {})
  }

  /** Resolves once every workspace snapshot received so far has been saved (or has failed, with a note). */
  whenSaved () { return this.#saving }

  /** Every stream-json message / page tool call of the current (or last) process. */
  get messages () { return this.harness?.messages ?? [] }
  get toolCalls () { return this.harness?.toolCalls ?? [] }

  #setWorkspace (snap) {
    this.workspace = { snapshot: snap, files: listEntries(snap, WORKSPACE), updatedAt: Date.now() }
    this.#emit('workspace', this.workspace)
  }

  /** Send a prompt; the transcript shows it at once. */
  send (text) {
    if (!this.harness || this.harness.state !== 'ready') throw new Error('Start Claude Code first.')
    this.#emit('entry', { kind: 'user', text })
    this.#set({ busy: true })
    return this.harness.send(text)
  }

  /** Send and wait for the result. */
  async turn (text, opts) {
    if (!this.harness || this.harness.state !== 'ready') throw new Error('Start Claude Code first.')
    this.#emit('entry', { kind: 'user', text })
    this.#set({ busy: true })
    return this.harness.turn(text, opts)
  }

  interrupt () { return this.harness?.interrupt() }

  /**
   * Stop Claude Code without losing the workspace: ask the Worker for a
   * snapshot and wait until it is saved, then end stdin (the CLI exits, and
   * boot.js sends one last fs-sync, which is saved too).
   */
  async stop () {
    const harness = this.harness
    if (!harness) return
    if (harness.state === 'ready') await harness.flushFs({ timeoutMs: 2000 })
    await this.#saving
    await harness.stop()
    await this.#saving
    this.#set({ harness: 'exited', busy: false })
  }

  /**
   * Flush when the page goes away or out of sight (pagehide, visibilitychange
   * to hidden): best effort for a reload or a closed tab inside the Worker's
   * debounce window. Returns a function that removes the listeners.
   */
  flushOnHide (win = globalThis) {
    if (!win?.addEventListener) return () => {}
    const doc = win.document
    const onHide = () => { if (this.harness?.state === 'ready') this.refreshWorkspace() }
    const onVisibility = () => { if (doc?.visibilityState === 'hidden') onHide() }
    win.addEventListener('pagehide', onHide)
    doc?.addEventListener?.('visibilitychange', onVisibility)
    return () => {
      win.removeEventListener('pagehide', onHide)
      doc?.removeEventListener?.('visibilitychange', onVisibility)
    }
  }

  /** Ask the Worker for a fresh snapshot (the listing updates on fs-sync). Resolves with it, or null. */
  refreshWorkspace () { return this.harness?.flushFs() ?? Promise.resolve(null) }

  async clearWorkspace () {
    if (this.state.lock === 'other-tab') throw new Error(OTHER_TAB)
    await this.#saving
    await this.snapshotStore.clear()
    this.#setWorkspace({ version: 1, roots: [HOME], entries: [] })
  }

  note (level, text) {
    this.#log(level, text)
    this.#emit('entry', { kind: 'note', level, text })
  }

  #log (level, msg) {
    this.log.push({ t: Date.now(), level, msg })
    if (this.log.length > 2000) this.log.splice(0, this.log.length - 2000)
  }

  #set (patch) {
    Object.assign(this.state, patch)
    this.#emit('change', this.state)
  }

  #emit (type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })) }
}
