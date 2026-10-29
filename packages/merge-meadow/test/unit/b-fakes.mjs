// Test helpers for track B (not a test file): a fake clock with timers, and an
// ephemeral bus that delivers broadcasts between fake handles with latency.
export function makeClock (start = 0) {
  let now = start
  const timers = new Set()
  const api = {
    now: () => now,
    timers: {
      setInterval: (fn, ms) => { const t = { fn, ms, next: now + ms, every: true }; timers.add(t); return t },
      clearInterval: (t) => { timers.delete(t) },
      setTimeout: (fn, ms) => { const t = { fn, ms, next: now + ms, every: false }; timers.add(t); return t },
      clearTimeout: (t) => { timers.delete(t) },
    },
    // advance to `to`, firing timers in time order
    advance (to) {
      for (;;) {
        let first = null
        for (const t of timers) if (t.next <= to && (!first || t.next < first.next)) first = t
        if (!first) break
        now = first.next
        if (first.every) first.next += first.ms; else timers.delete(first)
        first.fn()
      }
      now = to
    },
    get t () { return now },
  }
  return api
}

export function makeBus (clock, { latency = 50 } = {}) {
  const handles = new Map() // peerId -> handle
  const queue = [] // [at, to, from, msg]
  const bus = {
    handle (peerId) {
      const fns = new Set()
      const h = {
        documentId: 'testdoc',
        peerId,
        dropOut: false, // a crashed / partitioned peer
        broadcast (msg) { if (h.dropOut) return; for (const [id] of handles) if (id !== peerId) queue.push([clock.now() + (typeof latency === 'function' ? latency(peerId, id) : latency), id, peerId, msg]) },
        on (evt, f) { if (evt === 'ephemeral-message') fns.add(f) },
        off (evt, f) { fns.delete(f) },
        deliver (from, msg) { if (!h.dropOut) for (const f of [...fns]) f({ message: msg, senderId: from }) },
      }
      handles.set(peerId, h)
      return h
    },
    remove (peerId) { handles.delete(peerId) },
    // deliver everything due by now
    pump () {
      queue.sort((a, b) => a[0] - b[0])
      while (queue.length && queue[0][0] <= clock.now()) { const [, to, from, msg] = queue.shift(); handles.get(to)?.deliver(from, msg) }
    },
    queue,
  }
  return bus
}

// a minimal world with the surface net/ uses: entities Map, get, owner/owns injection
export function makeFakeWorld (entities = []) {
  const w = {
    entities: new Map(),
    get: (id) => w.entities.get(id),
    _owns: () => true,
    _owner: () => null,
    _isHost: () => true,
    setOwnership ({ owns, owner, isHost }) { w._owns = owns; w._owner = owner; if (isHost) w._isHost = isHost },
    isHost: () => !!w._isHost(),
    owns: (id) => w._owns(id),
    owner: (id) => w._owner(id),
    add (e) { const ent = { c: {}, live: {}, groups: new Set(), preset: '', owner: '', local: false, ...e }; w.entities.set(ent.id, ent); return ent },
  }
  for (const e of entities) w.add(e)
  return w
}
