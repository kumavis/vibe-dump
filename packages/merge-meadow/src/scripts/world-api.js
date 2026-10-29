// The world a doc system sees (design §7.2): reads are frozen plain views,
// `live` is writable only for entities this peer owns, and doc writes are queued
// ops flushed with the tick's one change. Never a doc proxy, a three object or
// a handle. Writes to entities owned elsewhere are refused (they would be
// written once per peer); spawn is for the host only, for the same reason.
import { plain } from '../doc/convert.js'
import { newId, slug, isName } from '../doc/schema.js'
import { validateComponent } from '../doc/validate.js'
import { validateOps } from '../doc/ops-validate.js'

const hardenFn = (o) => (typeof globalThis.harden === 'function' ? globalThis.harden(o) : Object.freeze(o))
const jsonCopy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)))
const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]) } return o }

// one frozen plain copy per doc component object (they keep identity while unchanged)
const compCache = new WeakMap()
function frozenPlain (data) {
  if (data == null || typeof data !== 'object') return data
  let c = compCache.get(data)
  if (!c) { c = deepFreeze(plain(data)); compCache.set(data, c) }
  return c
}

// Lifecycle ops (spawn, despawn, groups) are validated when they are queued,
// against the doc plus the spawns/despawns already queued this tick, and a bad
// one throws into the script, so the system's status shows the error. Queued
// unchecked, one bad op used to fail the app's whole tick batch (every hit,
// drain and checkpoint of that tick). `opsOptions` ({ kinds, componentDefs })
// is what the app validates its flush with.
export function makeScriptWorld (world, { log = () => {}, name = 'script', opsOptions = {} } = {}) {
  const check = (verb, op) => {
    const context = world.queuedOps ? world.queuedOps().filter((o) => o?.op === 'spawn' || o?.op === 'despawn') : []
    try { validateOps(world.doc ?? {}, [...context, op], opsOptions) } catch (e) {
      if (!e?.problems) throw e
      const mine = e.problems.filter((p) => p.startsWith(`op ${context.length} `)).map((p) => p.replace(/^op \d+ \([^)]*\): /, ''))
      if (mine.length) throw new TypeError(`${verb}: ${mine.join('; ')}`)
    }
  }
  const view = (e) => {
    if (!e) return null
    const c = {}
    for (const k of Object.keys(e.c)) c[k] = frozenPlain(e.c[k])
    const owned = world.owns(e.id)
    const groups = Object.freeze([...e.groups])
    return Object.freeze({
      id: e.id,
      name: e.name,
      preset: e.preset,
      local: !!e.local,
      c: Object.freeze(c),
      live: owned ? e.live : Object.freeze(jsonCopy({ p: e.live.p, v: e.live.v, yaw: e.live.yaw, anim: e.live.anim, intent: e.live.intent }) ?? {}),
      groups,
      owned,
      has: (n) => n in e.c,
    })
  }
  const sorted = (set) => [...set].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  const api = {
    query: (...names) => sorted(world.query(...names.map(String))).map(view),
    get: (id) => view(world.get(String(id))),
    owns: (id) => world.owns(String(id)),
    isHost: () => world.isHost(),
    nearby (id, r) {
      const e = world.get(String(id)); const p = e?.live.p
      if (!p) return []
      const r2 = Number(r) ** 2
      const out = []
      for (const o of world.entities.values()) {
        if (o === e || !o.live.p) continue
        const d2 = (o.live.p[0] - p[0]) ** 2 + (o.live.p[2] - p[2]) ** 2
        if (d2 <= r2) out.push([d2, o])
      }
      out.sort((a, b) => a[0] - b[0] || (a[1].id < b[1].id ? -1 : 1))
      return out.map((x) => view(x[1]))
    },
    spawn (def = {}) {
      if (!world.isHost()) return null
      const d = jsonCopy(def) ?? {}
      const id = String(d.id ?? newId(slug(d.name ?? d.preset ?? 'e')))
      const op = { ...d, op: 'spawn', id }
      check('spawn', op)
      world.queueOps(op)
      return id
    },
    despawn (id) {
      if (!world.owns(String(id))) return false
      const op = { op: 'despawn', id: String(id) }
      check('despawn', op)
      world.queueOps(op)
      return true
    },
    set (id, component, patch) {
      if (!world.owns(String(id)) || !isName(component)) return false
      const p = jsonCopy(patch)
      const def = world.doc?.components?.[component]
      if (def) { const problems = validateComponent(plain(def), p, { partial: true }); if (problems.length) throw new TypeError(`${component}: ${problems.join('; ')}`) }
      const op = { op: 'set', id: String(id), component, patch: p }
      if (component === 'on') check('set on', op) // group names in reactions (ops-validate)
      world.queueOps(op)
      return true
    },
    addGroup (id, group) { if (!world.owns(String(id))) return false; const op = { op: 'addGroup', id: String(id), group: String(group) }; check('addGroup', op); world.queueOps(op); return true },
    removeGroup (id, group) { if (!world.owns(String(id))) return false; const op = { op: 'removeGroup', id: String(id), group: String(group) }; check('removeGroup', op); world.queueOps(op); return true },
    emit (event) {
      const ev = jsonCopy(event)
      if (!ev || typeof ev.type !== 'string') throw new TypeError('emit({type, ...})')
      world.events.emit({ ...ev, source: `script:${name}` })
    },
    events: (type) => world.events.events(type == null ? undefined : String(type)),
    rand: () => world.rand(`$script:${name}`),
    get time () { return world.time },
    get dt () { return world.dt },
    get tick () { return world.tickCount },
    log: (...a) => log(name, ...a.map((x) => (typeof x === 'string' ? x : (() => { try { return JSON.stringify(x) } catch { return String(x) } })()))),
  }
  return hardenFn(api)
}
