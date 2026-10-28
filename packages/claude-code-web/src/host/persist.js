// Where the page keeps things across reloads:
//
//   settings   localStorage "cc-web:settings"; the API key / token only when
//              "Remember on this device" is ticked, otherwise sessionStorage
//              "cc-web:secrets" (this tab only). See settings.js: the origin
//              is shared with other apps.
//   VFS        OPFS file "cc-web/home.ccwfs": the latest fs-sync snapshot of
//              /home/user (workspace + ~/.claude), handed back to the Worker
//              in its boot message
//
// Every accessor tolerates a missing or throwing backend (private windows,
// Node tests): settings fall back to defaults and the snapshot to memory.

const OPFS_DIR = 'cc-web'
const OPFS_FILE = 'home.ccwfs'

/** In-memory store with the same interface (tests, or no OPFS). */
export function createMemorySnapshotStore () {
  let bytes = null
  return {
    kind: 'memory',
    async load () { return bytes ? bytes.slice() : null },
    async save (b) { bytes = b ? new Uint8Array(b) : null },
    async clear () { bytes = null }
  }
}

/**
 * OPFS-backed snapshot store, or the memory one where OPFS is unavailable.
 *
 * Writes are serialised on one chain, and load()/clear() wait for it, so a
 * load right after a save (Stop, then Start) never reads the older file.
 * save() returns that write's own promise: it rejects when the write fails
 * (quota, no createWritable), while the chain itself stays usable.
 * After the first successful write the store asks for persistent storage
 * (navigator.storage.persist()), so the browser does not evict the workspace
 * as best-effort data; `store.persisted` records the answer.
 */
export async function createSnapshotStore ({ storage = globalThis.navigator?.storage } = {}) {
  let root
  try {
    if (!storage?.getDirectory) throw new Error('no OPFS')
    const top = await storage.getDirectory()
    root = await top.getDirectoryHandle(OPFS_DIR, { create: true })
  } catch {
    return createMemorySnapshotStore()
  }
  let chain = Promise.resolve()
  let askedPersist = false
  const store = {
    kind: 'opfs',
    persisted: null, // null until asked; then true/false (the browser's answer)
    async load () {
      await chain
      try {
        const fh = await root.getFileHandle(OPFS_FILE)
        const file = await fh.getFile()
        return file.size ? new Uint8Array(await file.arrayBuffer()) : null
      } catch { return null }
    },
    save (bytes) {
      const p = chain.then(async () => {
        const fh = await root.getFileHandle(OPFS_FILE, { create: true })
        const w = await fh.createWritable()
        try {
          await w.write(bytes)
          await w.close()
        } catch (err) {
          try { await w.abort?.() } catch {}
          throw err
        }
        if (!askedPersist) {
          askedPersist = true
          Promise.resolve(storage.persist?.()).then((granted) => { store.persisted = granted ?? null }, () => { store.persisted = false })
        }
      })
      chain = p.catch(() => {})
      return p
    },
    async clear () {
      await chain
      try { await root.removeEntry(OPFS_FILE) } catch {}
    }
  }
  return store
}

/**
 * Small JSON-in-Web-Storage helper (settings). `area` names the global used
 * when no `storage` is passed: 'localStorage' or 'sessionStorage'. Reading
 * either global can throw (blocked site data); every accessor tolerates it.
 */
export function createJsonStore (key, { storage, area = 'localStorage' } = {}) {
  const ls = () => storage ?? globalThis[area]
  return {
    load () {
      try { const s = ls()?.getItem(key); return s ? JSON.parse(s) : null } catch { return null }
    },
    save (value) {
      try { ls()?.setItem(key, JSON.stringify(value)); return true } catch { return false }
    },
    clear () { try { ls()?.removeItem(key) } catch {} }
  }
}
