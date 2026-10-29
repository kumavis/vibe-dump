// A BroadcastChannel dressed as the slice of DocHandle the transport uses, so the
// SAME sealed CapTP protocol runs between same-origin tabs and iframes (~1 ms per
// hop instead of a round trip through the sync server). Messages are structured-
// cloned, so the Uint8Array iv/ct of a sealed frame survive as they are.
export function bcHandle (docId, name) {
  const id = String(docId).replace(/^automerge:/, '')
  const bc = new BroadcastChannel(name ?? `mm-captp:${id}`)
  const fns = new Set()
  bc.onmessage = (ev) => { for (const f of [...fns]) { try { f({ message: ev.data, senderId: 'bc' }) } catch (e) { console.error('[bc-handle]', e) } } }
  return {
    documentId: id,
    broadcast: (m) => bc.postMessage(m),
    on: (evt, f) => { if (evt === 'ephemeral-message') fns.add(f) },
    off: (evt, f) => { fns.delete(f) },
    close: () => { fns.clear(); bc.close() },
  }
}
