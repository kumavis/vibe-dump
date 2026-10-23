// The page's automerge-repo (DESIGN §2.7's lazy recipe, N2): reached only
// from Play online or a `#m=` link, through app/online.js's import(), so
// the single-player page holds no Automerge code and fetches no wasm
// (sim/bundle-check.mjs greps the entry chunk). The slim entries, with the
// wasm fetched as a file of its own (Vite's `?url`) and initialised here;
// the document kept in IndexedDB, so a reload or a rejoin works offline;
// tabs of one browser synced over a BroadcastChannel, and other browsers
// through a sync server: wss://sync.automerge.org by default (stores and
// forwards, so a late join and asynchronous play work; "as-is", for
// prototyping, no privacy: the link is the capability), or the one a
// `#…&sync=<ws url>` names (a self-hosted server; the test rig's,
// sim/sync-server.mjs).
export const DEFAULT_SYNC = 'wss://sync.automerge.org'

// the repo for each sync server, once made (or being made)
const made = new Map()

// The repo for a sync server, made once per page and server: { repo, ws,
// sync } (ws: the websocket adapter, whose state the net badge shows). One
// that failed to start (the wasm or IndexedDB refused) is made afresh next
// time.
export function openRepo(sync = DEFAULT_SYNC) {
  if (made.has(sync)) return made.get(sync)
  const making = (async () => {
    const [{ Repo, initializeWasm }, { default: wasmUrl }, { WebSocketClientAdapter }, { BroadcastChannelNetworkAdapter }, { IndexedDBStorageAdapter }] = await Promise.all([
      import('@automerge/automerge-repo/slim'),
      import('@automerge/automerge/automerge.wasm?url'),
      import('@automerge/automerge-repo-network-websocket'),
      import('@automerge/automerge-repo-network-broadcastchannel'),
      import('@automerge/automerge-repo-storage-indexeddb'),
    ])
    await initializeWasm(wasmUrl)
    const ws = new WebSocketClientAdapter(sync)
    const repo = new Repo({ storage: new IndexedDBStorageAdapter('tails-and-scales'), network: [new BroadcastChannelNetworkAdapter(), ws] })
    return { repo, ws, sync }
  })()
  made.set(sync, making)
  making.catch(() => made.delete(sync))
  return making
}
