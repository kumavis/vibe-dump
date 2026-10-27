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

import { Harness } from './harness.js'
import { buildEnv, checkCredentials, seedFiles } from './invocation.js'
import { mcpServersFromText } from './custom-tools.js'
import { decodeSnapshot, encodeSnapshot, listEntries } from './snapshot.js'
import { createSnapshotStore } from './persist.js'
import { createSettings } from './settings.js'
import { ensureServiceWorker } from './sw-client.js'
import * as acquire from './acquire.js'
import { CC_VERSION, HOME, WORKSPACE, baseUrl, appUrlFor, workerUrlFor } from './constants.js'

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
   */
  constructor ({ base, fake = false, createWorker, settings, snapshotStore, loadExtractor, serviceWorker, caches, fetch, version = CC_VERSION } = {}) {
    super()
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
    this.extractor = null
    this.harness = null
    this.messages = []
    this.toolCalls = []
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
      store: 'pending'
    }
    this.ready = this.#init()
  }

  async #init () {
    if (!this.snapshotStore) this.snapshotStore = await createSnapshotStore()
    this.state.store = this.snapshotStore.kind
    try {
      const bytes = await this.snapshotStore.load()
      if (bytes) this.#setWorkspace(decodeSnapshot(bytes))
    } catch (err) {
      this.note('warn', `The saved workspace could not be read: ${err.message}`)
    }
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
    await acquire.clearExtraction(this.extractor, { caches: this.caches })
    await this.refreshCache()
  }

  async #extract (run) {
    await this.ready
    if (!this.extractor) throw new Error(this.state.error ?? 'the extractor is not available')
    if (this.state.cache === 'extracting') throw new Error('an extraction is already running')
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
    const s = this.settings.get()
    let mcpServers
    let argvEnv
    try {
      if (!this.fake) checkCredentials(s)
      mcpServers = mcpServersFromText(s.toolsJson, { log: (...a) => this.note('info', a.join(' ')) })
      argvEnv = buildEnv(s)
      if (!this.createWorker) await this.#preflight()
    } catch (err) {
      this.#set({ error: err.message })
      this.note('error', err.message)
      throw err
    }
    const snapshotBytes = await this.snapshotStore.load()
    const harness = this.harness = new Harness({
      workerUrl: this.workerUrl,
      createWorker: this.createWorker ?? undefined,
      env: argvEnv,
      model: s.model,
      mcpServers,
      boot: {
        base: this.base,
        appUrl: this.appUrl,
        version: this.version,
        manifest: this.state.manifest,
        fsSnapshot: snapshotBytes,
        seedFiles: seedFiles({ version: this.version }),
        persistRoots: [HOME]
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
      return res
    } catch (err) {
      this.#set({ harness: 'exited', error: err.message })
      this.note('error', `Claude Code did not start: ${err.message}`)
      throw err
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
      this.messages.push(msg)
      if (msg.type === 'system' && msg.subtype === 'init' && this.timings.firstInitMs === undefined) this.timings.firstInitMs = Date.now() - this.timings.startAt
      if (msg.type === 'result') this.#set({ busy: false })
      if (msg.type !== 'control_request' && msg.type !== 'control_response' && msg.type !== 'keep_alive') this.#emit('entry', { kind: 'message', msg })
    })
    harness.addEventListener('stderr', (e) => { this.#log('stderr', e.detail.line); this.#emit('entry', { kind: 'stderr', line: e.detail.line }) })
    harness.addEventListener('stdout_text', (e) => this.#log('stdout', e.detail.line))
    harness.addEventListener('log', (e) => this.#log(e.detail.level, e.detail.msg))
    harness.addEventListener('status', (e) => { this.state.boot = e.detail; this.#emit('change', this.state) })
    harness.addEventListener('error', (e) => this.note('error', `Worker: ${e.detail.message}`))
    harness.addEventListener('tool_call', (e) => this.toolCalls.push(e.detail))
    harness.addEventListener('fs-sync', (e) => this.#onFsSync(e.detail))
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

  async #onFsSync ({ snapshot }) {
    if (!snapshot) return
    try {
      const snap = decodeSnapshot(snapshot)
      this.#setWorkspace(snap)
      const bytes = snapshot instanceof Uint8Array ? snapshot : ArrayBuffer.isView(snapshot) || snapshot instanceof ArrayBuffer ? new Uint8Array(snapshot) : encodeSnapshot(snap)
      await this.snapshotStore.save(bytes)
    } catch (err) {
      this.note('warn', `Could not save the workspace: ${err.message}`)
    }
  }

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

  async stop () {
    if (!this.harness) return
    await this.harness.stop()
    this.#set({ harness: 'exited', busy: false })
  }

  /** Ask the Worker for a fresh snapshot (the listing updates on fs-sync). */
  refreshWorkspace () { this.harness?.flushFs() }

  async clearWorkspace () {
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
