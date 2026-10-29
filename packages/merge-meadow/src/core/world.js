// Doc-backed ECS core (design §3.1), adopted from research/ecs/core/world.mjs and
// spike S2's world.js. The doc is the truth for authored data; the world holds a
// presence index, live queries, per-entity `live` state (never synced),
// component lifecycle handlers and the system schedule. It never writes the
// doc: systems queue ops and the app flushes them once per tick (rule §2.1).
import { resolveEntity } from '../doc/presets.js'
import { deepEqualPlain } from '../doc/convert.js'
import { makeEvents } from './events.js'

const isCounter = (o) => typeof o?.increment === 'function'
// Writing to a doc object outside change() silently desyncs the local view
// (research: ecs), so everything ingested is frozen. Counters are left alone.
function freeze (o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o) && !isCounter(o)) {
    Object.freeze(o)
    for (const k of Object.keys(o)) freeze(o[k])
  }
  return o
}
const clonePlain = (v) => (v == null || typeof v !== 'object' ? v : Array.isArray(v) ? v.map(clonePlain) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clonePlain(x)])))
const byKey = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

export function hash32 (str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// ops that address an entity by `id` (dropped at drain time if it is gone)
const ENTITY_OPS = new Set(['despawn', 'set', 'replace', 'remove', 'define', 'setParent', 'setName', 'addGroup', 'removeGroup',
  'push', 'drain', 'hit', 'pin', 'unpin', 'checkpoint', 'transform'])

export class World {
  #handlers = new Map() // name -> [{ order, seq, add, change, remove }]
  #seq = 0
  #byComp = new Map() // name -> Set<id>
  #byPreset = new Map() // preset name (any in chain, existing or not) -> Set<id>
  #queries = new Map()
  #systems = []
  #ops = []
  #owns = () => true
  #owner = null
  #isHost = () => true
  #rand = new Map()
  #errors = new Map()

  constructor ({ peerId = 'local', seed = 0 } = {}) {
    this.peerId = peerId
    this.seed = seed >>> 0
    this.doc = null
    this.entities = new Map()
    this.time = 0
    this.tickCount = 0
    this.dt = 0
    this.events = makeEvents()
    this.defsRev = 0
  }

  // ---- component lifecycle handlers (several per name: sim and renderer both watch transform)
  registerComponent (name, { order = 0, add, change, remove } = {}) {
    const h = { order, seq: this.#seq++, add, change, remove }
    const list = this.#handlers.get(name) ?? []
    list.push(h)
    list.sort((a, b) => a.order - b.order || a.seq - b.seq)
    this.#handlers.set(name, list)
    for (const id of [...(this.#byComp.get(name) ?? [])].sort(byKey)) { const e = this.entities.get(id); this.#call(h.add, e, name, [e, e.c[name], this]) }
    return () => this.#unregister(name, h)
  }

  unregisterComponent (name) { for (const h of [...(this.#handlers.get(name) ?? [])]) this.#unregister(name, h) }

  #unregister (name, h) {
    const list = this.#handlers.get(name); if (!list?.includes(h)) return
    for (const id of [...(this.#byComp.get(name) ?? [])].sort(byKey)) { const e = this.entities.get(id); this.#call(h.remove, e, name, [e, this]) }
    list.splice(list.indexOf(h), 1)
    if (!list.length) this.#handlers.delete(name)
  }

  #call (fn, e, name, args) {
    if (!fn) return
    try { fn(...args) } catch (err) { this.#error(`component:${name}`, err, e?.id) }
  }

  // lifecycle order of a component: its handlers' first order, else the doc def's, else 0
  componentOrder (name) {
    const h = this.#handlers.get(name)
    if (h?.length) return h[0].order
    const o = this.doc?.components?.[name]?.order
    return typeof o === 'number' ? o : 0
  }

  // ---- systems
  addSystem ({ name, order = 0, query, update }) {
    if (typeof update !== 'function') throw new TypeError(`system ${name} needs update()`)
    this.removeSystem(name)
    this.#systems.push({ name, order, query, update })
    this.#systems.sort((a, b) => a.order - b.order || byKey(a.name, b.name))
  }

  removeSystem (name) { this.#systems = this.#systems.filter((s) => s.name !== name) }
  systems () { return this.#systems.map(({ name, order }) => ({ name, order, errors: this.#errors.get(`system:${name}`)?.count ?? 0 })) }

  // ---- queries: query('transform', 'brain', '!dead') -> live Set<entity>
  query (...terms) {
    const key = terms.join('|')
    let q = this.#queries.get(key)
    if (!q) {
      q = { all: terms.filter((t) => t[0] !== '!'), none: terms.filter((t) => t[0] === '!').map((t) => t.slice(1)), set: new Set() }
      for (const id of [...this.entities.keys()].sort(byKey)) { const e = this.entities.get(id); if (this.#match(e, q)) q.set.add(e) }
      this.#queries.set(key, q)
    }
    return q.set
  }

  #match (e, q) { return q.all.every((n) => n in e.c) && !q.none.some((n) => n in e.c) }
  #requery (e) { for (const q of this.#queries.values()) { if (this.#match(e, q)) q.set.add(e); else q.set.delete(e) } }

  // ---- reconcile from the doc
  load (doc) {
    this.doc = doc
    const ids = new Set(Object.keys(doc?.entities ?? {}))
    for (const [id, e] of this.entities) if (!e.local) ids.add(id)
    this.#reconcile(ids)
  }

  // Patch shapes vary (put "" + splice, del + put); only the ids matter: path[1]
  // of entity patches, instances of an edited preset, holders of an edited def.
  applyPatches (doc, patches) {
    this.doc = doc
    const dirty = new Set()
    for (const p of patches ?? []) {
      const [root, key] = p.path ?? []
      if (root === 'entities') { if (key === undefined) return this.load(doc); dirty.add(String(key)) } else if (root === 'presets') {
        if (key === undefined) return this.load(doc)
        for (const id of this.#byPreset.get(String(key)) ?? []) dirty.add(id)
      } else if (root === 'components') {
        this.defsRev++
        if (key === undefined) { for (const id of this.entities.keys()) if (!this.entities.get(id).local) dirty.add(id) } else for (const id of this.#byComp.get(String(key)) ?? []) if (!this.entities.get(id)?.local) dirty.add(id)
      }
    }
    this.#reconcile(dirty)
  }

  #reconcile (ids) {
    for (const id of [...ids].sort(byKey)) {
      const own = this.doc?.entities?.[id]
      const prev = this.entities.get(id)
      if (prev?.local) continue
      const r = own ? resolveEntity(this.doc, own) : null
      if (!r) { if (prev) this.#destroy(prev); continue }
      let e = prev
      if (!e) {
        e = { id, name: '', parent: '', preset: '', owner: '', c: {}, live: {}, groups: new Set(), active: [], chain: [], inbox: null, local: false }
        this.entities.set(id, e)
      }
      for (const n of e.chain) this.#byPreset.get(n)?.delete(id)
      e.chain = r.chain
      for (const n of r.chain) { let s = this.#byPreset.get(n); if (!s) this.#byPreset.set(n, (s = new Set())); s.add(id) }
      e.name = String(own.name ?? ''); e.parent = String(own.parent ?? ''); e.preset = String(own.preset ?? ''); e.owner = String(own.owner ?? '')
      e.groups = new Set(Object.keys(own.groups ?? {}).filter((g) => own.groups[g]).sort())
      e.active = r.active
      e.inbox = own.inbox ? freeze(own.inbox) : null
      this.#ingest(e, r.components)
    }
  }

  // diff an entity's components against `next`, calling handlers in component order
  #ingest (e, next) {
    const ord = (n) => this.componentOrder(n)
    const sorted = (names) => names.sort((a, b) => ord(a) - ord(b) || byKey(a, b))
    let membership = false
    for (const name of sorted(Object.keys(e.c).filter((n) => !(n in next))).reverse()) { this.#removeComp(e, name); membership = true }
    for (const name of sorted(Object.keys(next))) {
      const data = next[name]
      if (!(name in e.c)) { this.#addComp(e, name, data); membership = true; continue }
      const prev = e.c[name]
      if (prev === data) continue
      e.c[name] = freeze(data)
      if (deepEqualPlain(prev, data)) continue // a fresh overlay object with the same content
      for (const h of this.#handlers.get(name) ?? []) this.#call(h.change, e, name, [e, data, prev, this])
    }
    if (membership) this.#requery(e)
  }

  #addComp (e, name, data) {
    e.c[name] = freeze(data)
    let s = this.#byComp.get(name); if (!s) this.#byComp.set(name, (s = new Set())); s.add(e.id)
    for (const h of this.#handlers.get(name) ?? []) this.#call(h.add, e, name, [e, e.c[name], this])
  }

  #removeComp (e, name) {
    for (const h of [...(this.#handlers.get(name) ?? [])].reverse()) this.#call(h.remove, e, name, [e, this])
    delete e.c[name]
    this.#byComp.get(name)?.delete(e.id)
  }

  #destroy (e) {
    for (const name of Object.keys(e.c).sort((a, b) => this.componentOrder(b) - this.componentOrder(a) || byKey(b, a))) this.#removeComp(e, name)
    this.#requery(e)
    for (const q of this.#queries.values()) q.set.delete(e)
    for (const n of e.chain) this.#byPreset.get(n)?.delete(e.id)
    this.entities.delete(e.id)
    this.#rand.delete(e.id)
  }

  // ---- local-only entities (players): same shape, never in the doc. Upserts.
  addLocal (id, { name = id, components = {} } = {}) {
    let e = this.entities.get(id)
    if (e && !e.local) throw new TypeError(`${id} is a doc entity`)
    if (!e) {
      e = { id, name, parent: '', preset: '', owner: '', c: {}, live: {}, groups: new Set(), active: [], chain: [], inbox: null, local: true }
      this.entities.set(id, e)
    }
    e.name = name
    // copied, so the caller's objects never get frozen
    const next = {}
    for (const [k, v] of Object.entries(components)) if (v != null) next[k] = clonePlain(v)
    this.#ingest(e, next)
    return e
  }

  removeLocal (id) { const e = this.entities.get(id); if (e?.local) this.#destroy(e) }

  get (id) { return this.entities.get(id) }
  has (id, component) { const e = this.entities.get(id); return !!e && component in e.c }
  ids () { return [...this.entities.keys()].sort(byKey) }

  // ---- ownership (injected by src/net/ownership.js)
  setOwnership ({ owns, owner, isHost } = {}) {
    if (owns) this.#owns = owns
    if (owner) this.#owner = owner
    if (isHost) this.#isHost = isHost
  }

  owns (id) { return !!this.#owns(id) }
  owner (id) { return this.#owner ? this.#owner(id) : this.peerId }
  isHost () { return !!this.#isHost() }

  // ---- durable effects: queued by systems, flushed by the app in ONE change
  queueOps (ops) {
    if (Array.isArray(ops)) { for (const op of ops) if (op) this.#ops.push(op) } else if (ops) this.#ops.push(ops)
  }

  // Ops for entities that vanished since they were queued (a concurrent despawn)
  // are dropped here rather than failing the whole tick's batch in validateOps.
  drainOps () {
    const ops = this.#ops
    this.#ops = []
    const docEnts = this.doc?.entities ?? {}
    const spawned = new Set()
    const despawned = new Set() // despawned earlier in this batch: later ops on it would fail the batch
    const seen = new Set()
    const out = []
    for (const op of ops) {
      if (op.op === 'spawn' && op.id) { spawned.add(op.id); despawned.delete(op.id) }
      if (ENTITY_OPS.has(op.op)) {
        const id = op.id
        const ref = typeof id === 'string' && id[0] === '$'
        if (!ref && ((!docEnts[id] && !spawned.has(id)) || despawned.has(id))) continue
        if (op.op === 'despawn') { spawned.delete(id); despawned.add(id) }
      }
      // idempotent duplicates (two reactions adding the same group in one tick)
      const k = op.op === 'addGroup' || op.op === 'removeGroup' ? `${op.op}|${op.id}|${op.group}` : op.op === 'hit' ? `hit|${op.id}|${op.hitId}` : null
      if (k) { if (seen.has(k)) continue; seen.add(k) }
      out.push(op)
    }
    return out
  }

  pendingOps () { return this.#ops.length }
  // the ops queued so far this tick (a copy), e.g. for validating a new op in context
  queuedOps () { return [...this.#ops] }

  // ---- the tick
  tick (dt) {
    this.dt = dt
    this.time += dt
    this.tickCount++
    this.events.swap()
    const disabled = this.doc?.world?.disabledSystems ?? {}
    for (const s of this.#systems) {
      if (disabled[s.name]) continue
      try { s.update(this, dt, s.query ? this.query(...s.query) : undefined) } catch (err) { this.#error(`system:${s.name}`, err) }
    }
  }

  // deterministic per entity + tick: xorshift32 seeded from the id hash and tick count
  rand (id = '') {
    let st = this.#rand.get(id)
    if (!st || st.tick !== this.tickCount) {
      let s = (hash32(String(id)) ^ Math.imul(this.tickCount + 1, 0x9E3779B1) ^ this.seed) >>> 0
      if (s === 0) s = 0x6D2B79F5
      st = { tick: this.tickCount, s }
      this.#rand.set(id, st)
    }
    let s = st.s
    s ^= s << 13; s >>>= 0
    s ^= s >>> 17
    s ^= s << 5; s >>>= 0
    st.s = s
    return s / 4294967296
  }

  // a built-in that throws is isolated and reported, not allowed to stop the loop
  #error (where, err, id) {
    const rec = this.#errors.get(where) ?? { count: 0, last: null }
    rec.count++; rec.last = String(err?.stack ?? err)
    this.#errors.set(where, rec)
    if (rec.count === 1 || rec.count % 300 === 0) console.error(`[world] ${where}${id ? ` (${id})` : ''} threw (${rec.count}×):`, err)
  }

  errors () { return [...this.#errors].map(([where, r]) => ({ where, count: r.count, last: r.last })) }
}
