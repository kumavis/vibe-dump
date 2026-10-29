// The page's automerge-repo (design §2), the packages/tails-and-scales recipe:
// slim entries with the wasm fetched as its own file (Vite `?url`) and
// initialised here; the doc kept in IndexedDB (store 'merge-meadow') so a reload
// works offline; tabs of one browser synced over a BroadcastChannel, other
// browsers through a sync server — wss://sync.automerge.org by default, or the
// one a `&sync=` link names ('none' = no websocket, for offline tests).
// Imports are dynamic so this module can be imported (for DEFAULT_SYNC,
// findDoc, whenSynced) by Node code without pulling in browser-only adapters.
import { DEFAULT_SYNC } from './link.js'
export { DEFAULT_SYNC }

const made = new Map() // sync|peerId -> Promise<{ repo, ws, sync }>
const wsInfo = new WeakMap() // ws adapter -> { repo, storageId }

// -> Promise<{ repo, ws, sync }>. One repo per page and server; a failed start
// (wasm or IndexedDB refused) is retried afresh on the next call.
export function openRepo (sync = DEFAULT_SYNC, { peerId, storageName = 'merge-meadow' } = {}) {
  const cacheKey = `${sync}|${peerId ?? ''}`
  if (made.has(cacheKey)) return made.get(cacheKey)
  const making = (async () => {
    const [{ Repo, initializeWasm }, { default: wasmUrl }, { WebSocketClientAdapter }, { BroadcastChannelNetworkAdapter }, { IndexedDBStorageAdapter }] = await Promise.all([
      import('@automerge/automerge-repo/slim'),
      import('@automerge/automerge/automerge.wasm?url'),
      import('@automerge/automerge-repo-network-websocket'),
      import('@automerge/automerge-repo-network-broadcastchannel'),
      import('@automerge/automerge-repo-storage-indexeddb'),
    ])
    await initializeWasm(wasmUrl)
    const ws = sync === 'none' ? null : new WebSocketClientAdapter(sync)
    const repo = new Repo({
      ...(peerId ? { peerId } : {}),
      storage: new IndexedDBStorageAdapter(storageName),
      network: [new BroadcastChannelNetworkAdapter(), ...(ws ? [ws] : [])],
    })
    if (ws) trackServer(ws, repo)
    return { repo, ws, sync }
  })()
  made.set(cacheKey, making)
  making.catch(() => made.delete(cacheKey))
  return making
}

// Remember the sync server's storageId when it introduces itself: the adapter keeps
// only the remote peer id, and synced() needs the storage id to read the server's
// acknowledged heads. Exported for Node callers that build their own repo.
export function trackServer (ws, repo) {
  const info = { repo, storageId: undefined }
  wsInfo.set(ws, info)
  ws.on?.('peer-candidate', ({ peerMetadata }) => { if (peerMetadata?.storageId) info.storageId = peerMetadata.storageId })
  return info
}

export function serverStorageId (ws) {
  if (!ws) return undefined
  const info = wsInfo.get(ws)
  return info?.storageId ?? (ws.remotePeerId ? info?.repo?.getStorageIdOfPeer?.(ws.remotePeerId) : undefined)
}

const isUnavailable = (e) => /unavailable/i.test(String(e?.message ?? e))

// repo.find with retry (design §2.3 share-link race): a link opened before the
// creator's first sync reached the server rejects as 'unavailable' for ~1-6 s.
// Other failures are retried too (a websocket still connecting looks the same
// from here); onWait({ attempt, tries, delayMs, error }) drives "waiting for the world…".
export async function findDoc (repo, docUrl, { tries = 8, backoffMs = 400, onWait, attemptTimeoutMs = 20000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  let last
  for (let attempt = 1; attempt <= tries; attempt++) {
    const ac = typeof AbortController === 'function' ? new AbortController() : null
    let timer
    try {
      const found = repo.find(docUrl, ac ? { signal: ac.signal } : {})
      const timeout = new Promise((_, reject) => { timer = setTimeout(() => { ac?.abort(); reject(new Error(`find timed out after ${attemptTimeoutMs} ms`)) }, attemptTimeoutMs) })
      const handle = await Promise.race([found, timeout])
      clearTimeout(timer)
      return handle
    } catch (error) {
      clearTimeout(timer)
      last = error
      if (attempt === tries) break
      const delayMs = backoffMs * attempt
      try { onWait?.({ attempt, tries, delayMs, error, unavailable: isUnavailable(error) }) } catch {}
      await sleep(delayMs)
    }
  }
  throw last
}

const sameHeads = (a, b) => !!a && !!b && a.length === b.length && [...a].sort().join() === [...b].sort().join()

// Resolves (with the ms waited) once the server identified by storageId has
// acknowledged this handle's current heads, i.e. a local write is durable there.
// With no storageId (no server, or a test repo) it resolves at once with null.
export function whenSynced (handle, storageId, { timeoutMs = 5000 } = {}) {
  const t0 = Date.now()
  if (!storageId) return Promise.resolve(null)
  return new Promise((resolve, reject) => {
    let timer
    const check = () => {
      if (sameHeads(handle.getSyncInfo?.(storageId)?.lastHeads, handle.heads())) {
        clearTimeout(timer); handle.off('remote-heads', check); resolve(Date.now() - t0)
      }
    }
    timer = setTimeout(() => { handle.off('remote-heads', check); reject(new Error(`sync server did not acknowledge within ${timeoutMs} ms`)) }, timeoutMs)
    handle.on('remote-heads', check)
    check()
  })
}
