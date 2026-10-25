// A sync server for online play's tests and for self-hosting (DESIGN §2.7,
// N2): what @automerge/automerge-repo-sync-server runs (a repo listening on
// a websocket, holding every document it is sent and handing it to whoever
// asks), made from the pinned packages this game already depends on, so the
// test rig needs no other server. In memory: it keeps documents while it
// runs, and forgets them when it stops.
//
//   node sim/sync-server.mjs [--port 3030]
//   import { startSyncServer } from './sync-server.mjs'   → { url, close() }
//
// A page uses it with `?sync=ws://127.0.0.1:3030` (a battle hosted there)
// or `#m=<id>&sync=ws%3A%2F%2F127.0.0.1%3A3030` (its links).
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { WebSocketServer } from 'ws'
import { Repo } from '@automerge/automerge-repo'
import { NodeWSServerAdapter } from '@automerge/automerge-repo-network-websocket'

export async function startSyncServer({ port = 0, host = '127.0.0.1' } = {}) {
  const wss = new WebSocketServer({ port, host })
  await new Promise((resolve, reject) => {
    wss.once('listening', resolve)
    wss.once('error', reject)
  })
  const adapter = new NodeWSServerAdapter(wss)
  // (as the sync server does: it never offers documents, it answers for them)
  const repo = new Repo({ network: [adapter], peerId: `sync-server-${process.pid}`, sharePolicy: async () => false })
  const url = `ws://${host}:${wss.address().port}`
  return {
    url,
    repo,
    async close() {
      adapter.disconnect()
      await repo.shutdown?.()
      await new Promise((resolve) => wss.close(resolve))
    },
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values: a } = parseArgs({ options: { port: { type: 'string' } } })
  const s = await startSyncServer({ port: Number(a.port ?? 3030) })
  console.log(`sync server on ${s.url} (Ctrl-C to stop)`)
}
