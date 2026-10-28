// Fix round F1: workspace persistence (OPFS store ordering and failures,
// Stop/Start without losing writes, the 'saved' signal), the one-tab Web Lock,
// no re-extraction under a running process, the service worker claim on a
// hard reload, the fs-flush id, and boot.js reporting an uncaught error once.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Session, LOCK_NAME } from '../../src/host/session.js'
import { Harness } from '../../src/host/harness.js'
import { WorkerBridge } from '../../src/host/worker-bridge.js'
import { createSettings } from '../../src/host/settings.js'
import { createMemorySnapshotStore, createSnapshotStore } from '../../src/host/persist.js'
import { decodeSnapshot, encodeSnapshot, readText } from '../../src/host/snapshot.js'
import { ensureServiceWorker } from '../../src/host/sw-client.js'
import { FakeWorker } from '../../src/host/fake-worker.js'
import { reportUncaught } from '../../src/runtime/boot/errors.js'

const BASE = 'http://127.0.0.1:9/app/'
const HELLO = '/home/user/workspace/hello.txt'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const snapBytes = (text) => encodeSnapshot({ version: 1, roots: ['/home/user'], entries: [{ path: HELLO, type: 'file', mode: 0o644, mtimeMs: 1, data: new TextEncoder().encode(text) }] })
const textOf = (bytes) => bytes && readText(decodeSnapshot(bytes), HELLO)

/** OPFS stand-in: one directory, writes land on close() after `delayMs`. */
function fakeOpfs ({ delayMs = 0 } = {}) {
  const files = new Map()
  const ctl = { files, writes: [], failNext: false, persistCalls: 0 }
  const fileHandle = (name) => ({
    async getFile () {
      const b = files.get(name)
      if (!b) throw new Error('NotFoundError')
      return { size: b.length, arrayBuffer: async () => b.slice().buffer }
    },
    async createWritable () {
      let buf = null
      return {
        async write (bytes) {
          if (ctl.failNext) { ctl.failNext = false; throw new Error('QuotaExceededError: the quota has been exceeded') }
          buf = new Uint8Array(bytes)
        },
        async close () { await sleep(delayMs); files.set(name, buf); ctl.writes.push(textOf(buf)) },
        async abort () {}
      }
    }
  })
  const dir = {
    async getFileHandle (name, { create } = {}) { if (!create && !files.has(name)) throw new Error('NotFoundError'); return fileHandle(name) },
    async removeEntry (name) { files.delete(name) }
  }
  const storage = {
    async getDirectory () { return { async getDirectoryHandle () { return dir } } },
    async persist () { ctl.persistCalls++; return true }
  }
  return { storage, ctl }
}

/** navigator.locks stand-in: exclusive locks, ifAvailable, a FIFO queue, signal. */
function fakeLocks () {
  const held = new Set()
  const queues = new Map()
  const grant = (name, cb) => {
    held.add(name)
    return Promise.resolve().then(() => cb({ name, mode: 'exclusive' })).finally(() => {
      held.delete(name)
      const next = queues.get(name)?.shift()
      if (next) next()
    })
  }
  return {
    held,
    request (name, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = {} }
      if (!held.has(name) && !(queues.get(name)?.length)) return grant(name, cb)
      if (opts.ifAvailable) return Promise.resolve().then(() => cb(null))
      return new Promise((resolve, reject) => {
        const q = queues.get(name) ?? queues.set(name, []).get(name)
        const run = () => grant(name, cb).then(resolve, reject)
        q.push(run)
        opts.signal?.addEventListener('abort', () => {
          const i = q.indexOf(run)
          if (i >= 0) { q.splice(i, 1); reject(new DOMException('aborted', 'AbortError')) }
        })
      })
    }
  }
}

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
      cached = { version: opts.version, appUrl: opts.appUrl, moduleCount: 1, files: 1, bytes: 1, rewrites: { ok: true, rewrites: [] }, source: { kind: opts.source }, createdAt: 'now' }
      return cached
    },
    async clearCache () { cached = null; return true }
  }
}

function makeSession (extra = {}) {
  const settings = createSettings({ storage: memoryStorage() })
  settings.set({ authMode: 'oauth', token: 'sk-ant-oat01-x' })
  const workers = []
  const s = new Session({
    base: BASE,
    settings,
    snapshotStore: extra.store ?? createMemorySnapshotStore(),
    loadExtractor: async () => extra.extractor ?? fakeExtractor(),
    createWorker: () => { const w = new FakeWorker({ bootDelayMs: 2, stepDelayMs: 1 }); workers.push(w); return w },
    serviceWorker: false,
    fetch: async () => new Response('', { status: 200 }),
    locks: null,
    ...extra
  })
  return { s, settings, workers }
}

const notes = (s) => {
  const out = []
  s.addEventListener('entry', (e) => { if (e.detail.kind === 'note') out.push(e.detail) })
  return out
}

// --- persist.js --------------------------------------------------------------

test('persist: load() waits for a save still in flight; saves land in order', async () => {
  const { storage, ctl } = fakeOpfs({ delayMs: 30 })
  const store = await createSnapshotStore({ storage })
  assert.equal(store.kind, 'opfs')
  assert.equal(await store.load(), null)
  const a = store.save(snapBytes('A'))
  const b = store.save(snapBytes('B'))
  assert.equal(textOf(await store.load()), 'B', 'load after two pending saves reads the second')
  await Promise.all([a, b])
  assert.deepEqual(ctl.writes, ['A', 'B'])
})

test('persist: a failed save rejects to its caller and the chain keeps going', async () => {
  const { storage, ctl } = fakeOpfs()
  const store = await createSnapshotStore({ storage })
  ctl.failNext = true
  await assert.rejects(store.save(snapBytes('lost')), /Quota/)
  assert.equal(ctl.persistCalls, 0, 'persistent storage is asked for only after a write succeeded')
  await store.save(snapBytes('C'))
  await store.save(snapBytes('D'))
  assert.equal(textOf(await store.load()), 'D')
  await sleep(0)
  assert.equal(ctl.persistCalls, 1, 'navigator.storage.persist() once, after the first write')
  assert.equal(store.persisted, true)
  await store.clear()
  assert.equal(await store.load(), null)
})

// --- Session: saving, Stop then Start -----------------------------------------

test('session: a failed save is reported through note()', async () => {
  const store = createMemorySnapshotStore()
  store.save = async () => { throw new Error('QuotaExceededError') }
  const { s } = makeSession({ store })
  const seen = notes(s)
  await s.ready
  await s.start()
  await s.turn('write a file', { timeoutMs: 3000 })
  await s.refreshWorkspace()
  await s.whenSaved()
  assert.ok(seen.some((n) => n.level === 'warn' && /Could not save the workspace.*QuotaExceededError/.test(n.text)), JSON.stringify(seen))
  await s.stop()
})

test('session: stop() flushes and waits for the save before ending stdin', async () => {
  const saves = []
  const store = createMemorySnapshotStore()
  const save = store.save
  let release
  const gate = new Promise((resolve) => { release = resolve })
  store.save = async (b) => { saves.push(textOf(b)); await gate; return save(b) }
  const { s, workers } = makeSession({ store })
  await s.ready
  await s.start()
  const saved = []
  s.addEventListener('saved', (e) => saved.push(e.detail))
  await s.turn('write a file', { timeoutMs: 3000 })
  let stopped = false
  const stopping = s.stop().then(() => { stopped = true })
  await sleep(30)
  const types = workers[0].received.map((m) => m.type)
  assert.ok(types.includes('fs-flush'), 'stop asked for a snapshot')
  assert.ok(workers[0].received.find((m) => m.type === 'fs-flush').id != null, 'with an id')
  assert.ok(!types.includes('stdin-end'), 'stdin stays open while the save is pending')
  assert.equal(stopped, false)
  release()
  await stopping
  const after = workers[0].received.map((m) => m.type)
  assert.ok(after.indexOf('fs-flush') < after.indexOf('stdin-end'))
  assert.equal(textOf(await store.load()), 'hello from Claude Code Web\n')
  assert.ok(saved.length >= 2, 'the flush and the exit snapshot were both saved')
  assert.equal(s.state.harness, 'exited')
})

test('session: Start right after Stop boots from the in-memory snapshot, not an older file', async () => {
  // a store that never manages to keep anything: only memory has the file
  const store = createMemorySnapshotStore()
  store.save = async () => {}
  const { s, workers } = makeSession({ store })
  await s.ready
  await s.start()
  await s.turn('write a file', { timeoutMs: 3000 })
  await s.stop()
  assert.equal(await store.load(), null)
  await s.start()
  const boot = workers[1].received.find((m) => m.type === 'boot')
  assert.equal(textOf(boot.fsSnapshot), 'hello from Claude Code Web\n')
  await s.stop()
})

// --- Session: one tab at a time ------------------------------------------------

test('session: a second tab sharing the store cannot start until the first is gone', async () => {
  const locks = fakeLocks()
  const store = createMemorySnapshotStore()
  const one = makeSession({ store, locks })
  await one.s.ready
  assert.equal(one.s.state.lock, 'held')
  assert.ok(locks.held.has(LOCK_NAME))
  const two = makeSession({ store, locks })
  await two.s.ready
  assert.equal(two.s.state.lock, 'other-tab')
  await assert.rejects(two.s.start(), /another tab/)
  assert.equal(two.s.harness, null, 'no Worker was booted')
  await assert.rejects(two.s.clearWorkspace(), /another tab/)
  assert.equal(two.workers.length, 0)

  // the first tab writes and goes away; the second takes over with a fresh read
  await one.s.start()
  await one.s.turn('write a file', { timeoutMs: 3000 })
  await one.s.dispose()
  for (let i = 0; i < 50 && two.s.state.lock !== 'held'; i++) await sleep(5)
  assert.equal(two.s.state.lock, 'held')
  for (let i = 0; i < 50 && !two.s.workspace.files.length; i++) await sleep(5)
  assert.deepEqual(two.s.workspace.files.map((f) => f.rel), ['hello.txt'])
  await two.s.start()
  assert.equal(two.s.state.harness, 'ready')
  await two.s.dispose()
  await sleep(1)
  assert.equal(locks.held.size, 0)
})

test('session: without Web Locks the guard is off, not in the way', async () => {
  const { s } = makeSession({ locks: null })
  await s.ready
  assert.equal(s.state.lock, 'unsupported')
  await s.start()
  await s.stop()
})

// --- Session: the cache stays put under a running process ----------------------

test('session: no extraction or cache clearing while Claude Code is booting or running', async () => {
  const { s } = makeSession()
  await s.ready
  await s.extractFile(new Blob(['x']))
  const starting = s.start()
  assert.equal(s.state.harness === 'booting' || s.state.harness === 'stopped', true)
  await starting
  await assert.rejects(s.extractFile(new Blob(['x'])), /Stop Claude Code before you extract again/)
  await assert.rejects(s.clearCache(), /Stop Claude Code before you clear the cache/)
  assert.equal(s.state.cache, 'present')
  await s.stop()
  await s.clearCache()
  assert.equal(s.state.cache, 'absent')
})

// --- flushes ----------------------------------------------------------------------

test('session: pagehide and a hidden page ask the Worker for a snapshot', async () => {
  const { s, workers } = makeSession()
  await s.ready
  const win = new EventTarget()
  win.document = new EventTarget()
  win.document.visibilityState = 'visible'
  const off = s.flushOnHide(win)
  win.dispatchEvent(new Event('pagehide')) // not running yet: nothing to flush
  await s.start()
  const flushes = () => workers[0].received.filter((m) => m.type === 'fs-flush').length
  win.dispatchEvent(new Event('pagehide'))
  win.document.dispatchEvent(new Event('visibilitychange')) // still visible: no flush
  win.document.visibilityState = 'hidden'
  win.document.dispatchEvent(new Event('visibilitychange'))
  await sleep(10)
  assert.equal(flushes(), 2)
  off()
  win.dispatchEvent(new Event('pagehide'))
  await sleep(10)
  assert.equal(flushes(), 2)
  await s.stop()
})

test('harness: flushFs() resolves with the fs-sync that answers it, null on exit or silence', async () => {
  const h = new Harness({ createWorker: () => new FakeWorker({ bootDelayMs: 1 }) })
  await h.start()
  const order = []
  h.addEventListener('fs-sync', () => order.push('event'))
  const sync = await h.flushFs()
  order.push('resolved')
  assert.ok(sync.snapshot instanceof Uint8Array)
  assert.equal(typeof sync.flush, 'number')
  assert.deepEqual(order, ['event', 'resolved'], 'listeners see the fs-sync before flushFs resolves')
  h.bridge.worker.received.length = 0
  const silent = new Harness({ createWorker: () => { const w = new EventTarget(); w.postMessage = () => {}; w.terminate = () => {}; return w } })
  silent.start({ timeoutMs: 50 }).catch(() => {})
  assert.equal(await silent.flushFs({ timeoutMs: 20 }), null)
  await h.stop()
  assert.equal(await h.flushFs(), null)
})

test('bridge: fs-flush carries an id and the answering fs-sync carries it back', () => {
  const w = new EventTarget()
  w.posted = []
  w.postMessage = (m) => w.posted.push(m)
  const b = new WorkerBridge(w)
  const got = []
  b.addEventListener('fs-sync', (e) => got.push(e.detail))
  b.flushFs(7)
  b.flushFs()
  assert.deepEqual(w.posted, [{ type: 'fs-flush', id: 7 }, { type: 'fs-flush' }])
  w.dispatchEvent(new MessageEvent('message', { data: { type: 'fs-sync', snapshot: null, paths: [], flush: 7 } }))
  w.dispatchEvent(new MessageEvent('message', { data: { type: 'fs-sync', snapshot: new Uint8Array([1]) } }))
  assert.deepEqual(got[0], { snapshot: null, paths: [], flush: 7 })
  assert.equal('flush' in got[1], false)
})

// --- sw-client: hard reload ------------------------------------------------------

function fakeServiceWorkers ({ controlled = false, active = true, claimWorks = true, registerError = null } = {}) {
  const sw = new EventTarget()
  sw.controller = controlled ? {} : null
  sw.registered = []
  sw.posted = []
  const registration = {
    active: active
      ? {
          postMessage (m) {
            sw.posted.push(m)
            if (m?.type === 'claim' && claimWorks) setTimeout(() => { sw.controller = {}; sw.dispatchEvent(new Event('controllerchange')) }, 1)
          }
        }
      : null
  }
  sw.register = async (url, opts) => { sw.registered.push(opts); if (registerError) throw registerError; return registration }
  sw.ready = Promise.resolve(registration)
  return { serviceWorker: sw }
}

test('sw-client: a hard-reloaded page asks the active service worker to claim it', async () => {
  const nav = fakeServiceWorkers()
  const r = await ensureServiceWorker(BASE, { nav, fetch: null, timeoutMs: 500 })
  assert.deepEqual(r, { state: 'controlled' })
  assert.deepEqual(nav.serviceWorker.posted, [{ type: 'claim' }])
  // already controlled: nothing to ask
  const ok = fakeServiceWorkers({ controlled: true })
  assert.deepEqual(await ensureServiceWorker(BASE, { nav: ok, fetch: null }), { state: 'controlled' })
  assert.deepEqual(ok.serviceWorker.posted, [])
  // a claim that never lands times out into 'registered'
  const stuck = fakeServiceWorkers({ claimWorks: false })
  assert.equal((await ensureServiceWorker(BASE, { nav: stuck, fetch: null, timeoutMs: 20 })).state, 'registered')
})

test('sw-client: a failed module registration reports its own error (no classic fallback)', async () => {
  const nav = fakeServiceWorkers({ registerError: new TypeError('module scripts are not supported here') })
  const r = await ensureServiceWorker(BASE, { nav, fetch: null })
  assert.equal(r.state, 'error')
  assert.match(r.error, /module scripts are not supported/)
  assert.deepEqual(nav.serviceWorker.registered.map((o) => o.type), ['module'], 'registered once, as a module')
})

// --- boot.js: one report per uncaught error ---------------------------------------

test('boot errors: an uncaught error is posted once and kept from reaching the page Worker', () => {
  const self = new EventTarget()
  const posted = []
  class ProcessExit extends Error {}
  reportUncaught(self, { post: (m) => posted.push(m), isExit: (e) => e instanceof ProcessExit })
  const fire = (type, init) => {
    const ev = new Event(type, { cancelable: true })
    Object.assign(ev, init)
    self.dispatchEvent(ev)
    return ev
  }
  const e1 = fire('error', { error: new TypeError('boom'), message: 'Uncaught TypeError: boom' })
  assert.equal(e1.defaultPrevented, true, 'not re-dispatched on the page Worker object')
  const e2 = fire('error', { error: new ProcessExit('exit') })
  assert.equal(e2.defaultPrevented, false)
  const e3 = fire('unhandledrejection', { reason: new Error('nope') })
  assert.equal(e3.defaultPrevented, true)
  assert.deepEqual(posted.map((m) => m.message), ['boom', 'unhandled rejection: nope'])
})
