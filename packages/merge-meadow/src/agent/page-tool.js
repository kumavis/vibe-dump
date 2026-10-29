// Same-origin page-tool guest (design §6.2), bundled to public/agent.js by
// agent/build-page-tool.mjs so another page on this origin (a claude-code-web
// custom tool handler, a bookmarklet) can import it by URL with no build step:
//   const mm = await import('/vibe-dump/merge-meadow/agent.js')
//   const { world, E } = await mm.connect(location-of-the-world-link)
//   await E(world).spawn({ preset: 'sheep', at: [2, 0, 3] })
// It is a guest only: no lockdown, just the two shims CapTP needs, and the same
// sealed pipe the Node agent uses, over a BroadcastChannel instead of the sync
// server (~1 ms per hop; it reaches tabs of this browser only).
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import { E, Far } from '@endo/far'
import { connectCapTP, aesKey } from './transport.js'
import { bcHandle } from './bc-handle.js'
import { parseLink, docIdOf } from '../net/link.js'

export { E, Far }

// -> { world, E, role, host, close() }. The key decides the role: an editor link
// gets World, a view link WorldView. Rejects when no tab with the world open answers.
export async function connect (link, { timeoutMs = 3000 } = {}) {
  const L = parseLink(link)
  if (!L.docUrl) throw new Error('link needs #doc=automerge:<id>')
  const secret = L.key || L.view
  if (!secret) throw new Error('link has no key or view secret: page tools need one')
  const docId = docIdOf(L.docUrl)
  const channel = bcHandle(docId)
  try {
    const conn = await connectCapTP(channel, await aesKey(secret, docId), { timeoutMs })
    return {
      world: conn.bootstrap, E, role: L.key ? 'editor' : 'viewer', host: conn.host, closed: conn.closed,
      async close () { await conn.close(); channel.close() },
    }
  } catch (e) { channel.close(); throw e }
}
