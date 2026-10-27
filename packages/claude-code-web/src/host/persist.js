// Where the page keeps things across reloads:
//
//   settings   localStorage "cc-web:settings" (token / API key included: they
//              stay on this device and are only ever put into the Worker's env)
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

/** OPFS-backed snapshot store, or the memory one where OPFS is unavailable. */
export async function createSnapshotStore ({ storage = globalThis.navigator?.storage } = {}) {
  let root
  try {
    if (!storage?.getDirectory) throw new Error('no OPFS')
    const top = await storage.getDirectory()
    root = await top.getDirectoryHandle(OPFS_DIR, { create: true })
  } catch {
    return createMemorySnapshotStore()
  }
  // Serialise writes: a slow write must never land after a newer one.
  let chain = Promise.resolve()
  return {
    kind: 'opfs',
    async load () {
      try {
        const fh = await root.getFileHandle(OPFS_FILE)
        const file = await fh.getFile()
        return file.size ? new Uint8Array(await file.arrayBuffer()) : null
      } catch { return null }
    },
    save (bytes) {
      chain = chain.then(async () => {
        const fh = await root.getFileHandle(OPFS_FILE, { create: true })
        const w = await fh.createWritable()
        await w.write(bytes)
        await w.close()
      }).catch(() => {})
      return chain
    },
    async clear () {
      await chain
      try { await root.removeEntry(OPFS_FILE) } catch {}
    }
  }
}

/** Small JSON-in-localStorage helper (settings). */
export function createJsonStore (key, { storage } = {}) {
  const ls = () => storage ?? globalThis.localStorage
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
