// Page-side agent host (design §6.2): sealed CapTP on the scene doc's OWN
// ephemeral channel (other peers see frames they cannot open and drop them),
// plus the same pipe over a BroadcastChannel for same-origin page tools.
// Roles: the editor key -> World; HKDF(key, 'view') -> WorldView. The page hosts
// only when its link carries `key` (§16.8); a view link never hosts.
// Each CapTP session gets its own facet set from the caps, so a session that
// ends (fin, idle, broken, revoked) cancels exactly its own subscriptions.
import { hostCapTP, aesKey, deriveSecret } from './transport.js'
import { bcHandle } from './bc-handle.js'

export function startAgentHost ({ handle, docId = handle?.documentId, key, caps, log = () => {}, broadcastChannel = typeof BroadcastChannel === 'function', idleMs } = {}) {
  if (!key) throw new TypeError('startAgentHost: needs the editor key from the link')
  const id = String(docId).replace(/^automerge:/, '')
  let hosts = []; let bc = null; let stopped = false; let viewKey = null
  const facet = (role) => (sessionId) => {
    const f = caps.session ? caps.session(sessionId) : caps
    return role === 'editor' ? f.world : f.viewer
  }
  const onEnd = (sessionId) => caps.endSession?.(sessionId)

  const ready = (async () => {
    viewKey = await deriveSecret(key, 'view')
    const roles = {
      editor: { key: await aesKey(key, id), bootstrap: facet('editor'), onEnd },
      viewer: { key: await aesKey(viewKey, id), bootstrap: facet('viewer'), onEnd },
    }
    if (stopped) return
    hosts.push(hostCapTP(handle, roles, { log, idleMs }))
    if (broadcastChannel) { bc = bcHandle(id); hosts.push(hostCapTP(bc, roles, { log, idleMs })) }
    log(`[agent] hosting ${hosts.length} channel(s) for ${id}`)
  })()
  ready.catch((e) => log('[agent] host failed to start', e?.message))

  return {
    ready,
    get viewKey () { return viewKey },
    sessions: () => hosts.flatMap((h) => h.list()),
    revoke (role) { return Promise.allSettled(hosts.map((h) => h.revoke(role))) },
    async stop () {
      stopped = true
      await ready.catch(() => {})
      await Promise.allSettled(hosts.map((h) => h.close()))
      hosts = []
      bc?.close(); bc = null
    },
  }
}
