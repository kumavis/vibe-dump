// The capability surface an agent holds (design §6.1, §16.10). One module for the
// page (hosted over CapTP) and for Node (the local fallback when no page answers):
// every write is applyOps(handle, ops) from track A (validated, one change), every
// read comes from track A's read.js. Page-only powers arrive through `host`
// ({ capture, logs, eval, explain, systems }); without them those verbs reject
// with "needs a live host page" and systems() reports doc systems as 'unknown'.
//
// Hard rule (S3, captp report): everything returned is a FRESH plain copy or a Far
// handle. CapTP's marshal hardens what it sends, so returning a doc proxy, an ECS
// row, a host power's internal array, or a three object freezes it in place — a
// returned Vector3 once froze Vector3.prototype and stopped the render loop.
// Arguments are copied on the way in for the mirror-image reason: they arrive
// hardened from a remote guest, and nothing downstream may be handed frozen input
// it might want to keep.
import { Far, E } from '@endo/far'
import { watch as docWatch } from '../doc/watch.js'
import { withMoves } from '../doc/ops.js'

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
// JSON-shaped deep copy for things that are not doc values (host power results, op results)
const json = (x) => (x === undefined ? null : JSON.parse(JSON.stringify(x)))
const noHost = (what, mode) => () => {
  throw new Error(mode === 'local' ? `${what} needs a live host page (no tab with this link answered)` : `${what} is not offered by this host page`)
}
const ENTITY_TYPES = ['entity-added', 'entity-removed', 'component-changed', 'entity-changed']

// patches -> coarse events, one per entity/component/system/preset per change
export function eventsFromPatches (patches) {
  const seen = new Map()
  const added = new Set()
  for (const p of patches ?? []) {
    const [root, key, sub, comp] = p.path ?? []
    if (root == null) continue
    if (root === 'systems' && key != null) { seen.set(`s/${key}`, { type: 'system-changed', name: String(key) }); continue }
    if (root === 'presets' && key != null) { seen.set(`p/${key}`, { type: 'preset-changed', name: String(key) }); continue }
    if (root === 'components' && key != null) { seen.set(`c/${key}`, { type: 'component-def-changed', name: String(key) }); continue }
    if (root === 'world' || root === 'meta') { seen.set(root, { type: `${root}-changed` }); continue }
    if (root !== 'entities' || key == null) continue
    const id = String(key)
    if (p.path.length === 2) {
      if (p.action === 'del') { seen.delete(`e/${id}`); seen.set(id, { type: 'entity-removed', id }) } else { added.add(id); seen.set(id, { type: 'entity-added', id }) }
    } else if (!added.has(id)) {
      if (sub === 'components' && comp != null) seen.set(`${id}/${comp}`, { type: 'component-changed', id, component: String(comp) })
      else if (sub !== 'components') seen.set(`e/${id}/${sub}`, { type: 'entity-changed', id, field: String(sub) })
    }
  }
  return [...seen.values()]
}

const matches = (f, e) => (!f.types || f.types.includes(e.type)) &&
  (!f.ids || (e.id != null && f.ids.includes(e.id))) &&
  (!f.components || !e.component || f.components.includes(e.component))

// kinds / componentDefs pass through to applyOps, so an agent write is validated
// exactly like the editor's (e.g. representation data against track C's KINDS).
export function makeWorldCaps (handle, { applyOps, read, checkSource, host = {}, mode = 'live', watch = docWatch, peerId, kinds, componentDefs, log = () => {} } = {}) {
  if (typeof applyOps !== 'function') throw new TypeError('makeWorldCaps: applyOps is required')
  if (!read?.plain || !read?.entityData || !read?.listEntities || !read?.docSummary) throw new TypeError('makeWorldCaps: read must provide plain, entityData, listEntities, docSummary')
  const doc = () => handle.doc()
  const copyIn = (x) => read.plain(x)

  // An agent moving a SIMULATED entity (one with a body): its owner ignores doc
  // transform patches (design §4.4), so the move also travels as an inbox `move`
  // the owner drains and teleports to. Track A's withMoves is the one expansion
  // (set/replace/define of transform, transform); the pushes go at the END of the
  // batch, so '$n' spawn references and result indices are unchanged.
  function write (ops, message) {
    const given = copyIn(ops)
    const list = Array.isArray(given) ? withMoves(doc(), given) : given
    const { results } = applyOps(handle, list, { message: message ?? `agent:${list.map((o) => o?.op).join(',')}`, peerId, checkSource, ...(kinds ? { kinds } : {}), ...(componentDefs ? { componentDefs } : {}) })
    return json(Array.isArray(given) ? results.slice(0, given.length) : results)
  }

  // ---- subscriptions: one watch() for all listeners, opened lazily ----
  const listeners = new Map() // listener -> { filter, scope }
  let unwatch = null
  const onDoc = ({ patches }) => {
    if (!listeners.size) return
    const evts = eventsFromPatches(patches)
    if (!evts.length) return
    for (const [l, { filter }] of listeners) {
      const mine = evts.filter((e) => matches(filter, e))
      if (mine.length) E(l).onEvents(json(mine)).catch(() => { listeners.delete(l); maybeUnwatch() })
    }
  }
  const maybeUnwatch = () => { if (!listeners.size && unwatch) { unwatch(); unwatch = null } }
  const subscribe = (scope, listener, filter = {}) => {
    const f = isObj(filter) ? copyIn(filter) : {}
    listeners.set(listener, { filter: f, scope })
    if (!unwatch) unwatch = watch(handle, onDoc, { immediate: false })
    return Far('Subscription', { cancel: () => { listeners.delete(listener); maybeUnwatch(); return true } })
  }
  const cancelScope = (scope) => { for (const [l, v] of [...listeners]) if (v.scope === scope) listeners.delete(l); maybeUnwatch() }

  const hostSystems = host.systems
    ? () => json(host.systems())
    : () => read.docSummary(doc()).systems.map((s) => ({ ...json(s), status: 'unknown', reason: 'no host page: status is computed by the page that runs the systems' }))
  const hostPower = (name) => (host[name] ? async (...args) => json(await host[name](...args.map(copyIn))) : noHost(name, mode))

  // ---- one facet set per scope (the shared default, or one per CapTP session) ----
  function makeFacets (scope) {
    const entityCaps = new Map()
    const idOf = new WeakMap() // Far handle -> id, so handles can be passed back in
    const viewCaps = new Map()

    const exists = (id) => !!doc().entities?.[id]
    const needId = (id) => { const s = String(id); if (!exists(s)) throw new Error(`no entity ${s}`); return s }
    const handleId = (h) => { const id = idOf.get(h); if (!id) throw new TypeError('not an entity handle from this world'); return id }
    const entityRow = (id) => { const d = read.entityData(doc(), id); if (!d) throw new Error(`no entity ${id}`); return d }

    const makeEntity = (id) => {
      if (entityCaps.has(id)) return entityCaps.get(id)
      const ent = Far('Entity', {
        id: () => id,
        exists: () => exists(id),
        // no component: the whole row (own + effective); a name: its effective data
        get: (comp) => { const d = entityRow(id); return comp == null ? d : (d.effective?.[comp] ?? d.components?.[comp] ?? null) },
        set: (comp, patch) => write([{ op: 'set', id, component: comp, patch }])[0],
        replace: (comp, data) => write([{ op: 'replace', id, component: comp, data }])[0],
        remove: (comp) => write([{ op: 'remove', id, component: comp }])[0],
        // a relation stored on this side only (design §3.3): rider -> {mount}, else {target}
        link: (comp, other, extra = {}) => {
          const field = String(comp) === 'rider' ? 'mount' : 'target'
          return write([{ op: 'replace', id, component: comp, data: { ...(isObj(extra) ? copyIn(extra) : {}), [field]: handleId(other) } }])[0]
        },
        parent: (other) => write([{ op: 'setParent', id, parent: other == null ? '' : handleId(other) }])[0],
        groups: () => entityRow(id).groups ?? [],
        addGroup: (g) => write([{ op: 'addGroup', id, group: g }])[0],
        removeGroup: (g) => write([{ op: 'removeGroup', id, group: g }])[0],
        destroy: () => { const r = write([{ op: 'despawn', id }])[0]; entityCaps.delete(id); return r },
      })
      entityCaps.set(id, ent); idOf.set(ent, id)
      return ent
    }

    // batch: handles allowed in place of ids
    const normalize = (list) => {
      if (!Array.isArray(list)) throw new TypeError('batch takes an array of ops')
      return list.map((o) => {
        if (!isObj(o)) return o
        const out = { ...o }
        for (const k of ['id', 'parent']) if (out[k] && typeof out[k] === 'object') out[k] = handleId(out[k])
        return out
      })
    }

    const viewEntity = (id) => {
      if (!viewCaps.has(id)) {
        viewCaps.set(id, Far('EntityView', {
          id: () => id,
          exists: () => exists(id),
          get: (comp) => { const d = entityRow(id); return comp == null ? d : (d.effective?.[comp] ?? d.components?.[comp] ?? null) },
          groups: () => entityRow(id).groups ?? [],
        }))
      }
      return viewCaps.get(id)
    }

    const describe = () => ({ ...json(read.docSummary(doc())), mode, url: handle.url, heads: [...handle.heads()], powers: ['capture', 'logs', 'eval', 'explain', 'systems'].filter((k) => !!host[k]) })
    const list = (q = {}) => read.listEntities(doc(), isObj(q) ? copyIn(q) : {})
    const snapshot = () => read.plain(doc())

    const viewer = Far('WorldView', {
      describe,
      list,
      get: (id) => viewEntity(needId(id)),
      subscribe: (l, f) => subscribe(scope, l, f),
      snapshot,
      url: () => handle.url,
      heads: () => [...handle.heads()],
    })

    const world = Far('World', {
      describe,
      list,
      get: (id) => makeEntity(needId(id)),
      spawn: (def = {}) => makeEntity(write([{ ...(isObj(def) ? def : {}), op: 'spawn' }])[0]),
      batch: (ops) => write(normalize(ops), `agent:batch(${ops?.length ?? 0})`),
      define: (id, entity) => write([{ op: 'define', id, entity }])[0],
      definePreset: (name, preset) => write([{ op: 'definePreset', name, preset }])[0],
      removePreset: (name) => write([{ op: 'removePreset', name }])[0],
      defineComponent: (name, def) => write([{ op: 'defineComponent', name, def }])[0],
      removeComponent: (name) => write([{ op: 'removeComponent', name }])[0],
      defineSystem: (name, { source, order, enabled } = {}) => write([{ op: 'defineSystem', name, source, ...(order != null ? { order } : {}), ...(enabled != null ? { enabled } : {}) }])[0],
      setSystem: (name, patch) => write([{ op: 'setSystem', name, patch }])[0],
      removeSystem: (name) => write([{ op: 'removeSystem', name }])[0],
      setWorld: (patch) => write([{ op: 'setWorld', patch }])[0],
      systems: hostSystems,
      explain: hostPower('explain'),
      subscribe: (l, f) => subscribe(scope, l, f),
      snapshot,
      url: () => handle.url,
      heads: () => [...handle.heads()],
      viewer: () => viewer,
      capture: hostPower('capture'),
      logs: hostPower('logs'),
      eval: hostPower('eval'),
    })
    return { world, viewer }
  }

  const shared = makeFacets('shared')
  const sessions = new Map()
  return {
    world: shared.world,
    viewer: shared.viewer,
    // a fresh facet set per CapTP session, so ending the session cancels exactly its subscriptions
    session (sessionId) {
      if (!sessions.has(sessionId)) sessions.set(sessionId, makeFacets(`s:${sessionId}`))
      return sessions.get(sessionId)
    },
    endSession (sessionId) { sessions.delete(sessionId); cancelScope(`s:${sessionId}`) },
    subscriptions: () => listeners.size,
    close () { listeners.clear(); maybeUnwatch(); sessions.clear() },
  }
}

// Page helper for the `eval` host power (§16.10): an async body run in a fresh
// Compartment endowed with { world, E, Math, log } only, its result JSON-copied.
// makeCompartment(endowments) -> { evaluate(src) } (SES `new Compartment` in the page).
export function makeEvalPower ({ world, makeCompartment, log = () => {} }) {
  return async (src) => {
    const c = makeCompartment({ world, E, Math, log: (...a) => log('[eval]', ...a.map(String)) })
    return json(await c.evaluate(`(async function () {\n${String(src)}\n})()`))
  }
}
