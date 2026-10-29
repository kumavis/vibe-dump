// THE write path (rule §2.2, design §5.1). Pure on the doc proxy so the page,
// the Node agent fallback and the tests share it. validateOps (ops-validate.js)
// checks a whole batch and lists every problem; applyOps refuses the batch
// before handle.change if there is one.
import { updateText } from '@automerge/automerge/slim'
import { plain, toDoc, isObj, sameScalar, ImmutableString, Counter } from './convert.js'
import { newId, slug, SCHEMA_VERSION } from './schema.js'
import { validateOps, OP_NAMES, MAX_OPS, REF } from './ops-validate.js'
import { effectiveComponents, withOwnMaps } from './presets.js'

const I = (s) => new ImmutableString(String(s ?? ''))
const str = (v) => (v == null ? '' : String(plain(v)))
const stripNulls = (v) => {
  if (!isObj(v)) return v
  const o = {}
  for (const [k, x] of Object.entries(v)) if (x !== null && x !== undefined) o[k] = stripNulls(x)
  return o
}
const titleCase = (s) => String(s).replace(/(^|[-_ ])(\w)/g, (_, a, b) => (a ? ' ' : '') + b.toUpperCase())

export { validateOps, OP_NAMES, MAX_OPS }

// ---------------------------------------------------------------- merging

// set = FIELD MERGE: objects recurse, equal-length arrays write per index (so
// concurrent per-axis edits both survive), null deletes, unchanged values are not
// rewritten (no history, no conflict).
function mergeInto (target, patch, path, changed) {
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue
    const cur = target[k]
    if (v === null) { if (cur !== undefined) { delete target[k]; changed.push([...path, k]) } continue }
    if (cur instanceof Counter && typeof v === 'number') { const d = v - cur.value; if (d) { cur.increment(d); changed.push([...path, k]) } continue }
    if (isObj(v) && isObj(cur)) { mergeInto(target[k], v, [...path, k], changed); continue }
    if (Array.isArray(v) && Array.isArray(cur) && cur.length === v.length) { arrayInto(target[k], v, [...path, k], changed); continue }
    if (!isObj(v) && !Array.isArray(v) && sameScalar(cur, v)) continue
    target[k] = toDoc(stripNulls(v)); changed.push([...path, k])
  }
}

// array elements are written whole (diffed): an element is a value, not a patch
function arrayInto (target, v, path, changed) {
  v.forEach((x, i) => {
    const cur = target[i]
    if (isObj(x) && isObj(cur)) diffInto(target[i], x, [...path, i], changed)
    else if (Array.isArray(x) && Array.isArray(cur) && cur.length === x.length) arrayInto(target[i], x, [...path, i], changed)
    else if (isObj(x) || Array.isArray(x) || !sameScalar(cur, x)) { target[i] = toDoc(x); changed.push([...path, i]) }
  })
}

// define = DEEP DIFF: make target equal to def with minimal writes; an unchanged
// subtree is never assigned, so a concurrent field edit inside it survives.
function diffInto (target, def, path, changed, keep = () => false) {
  for (const k of Object.keys(target)) if (!(k in def) && !keep([...path, k])) { delete target[k]; changed.push([...path, k]) }
  for (const [k, v] of Object.entries(def)) {
    if (v === undefined) continue
    const cur = target[k]
    // a stored null is meaningful ("remove the inherited value"): define keeps it
    if (v === null) { if (cur !== null) { target[k] = null; changed.push([...path, k]) } continue }
    if (isObj(v) && isObj(cur)) diffInto(target[k], v, [...path, k], changed, keep)
    else if (Array.isArray(v) && Array.isArray(cur) && cur.length === v.length) arrayInto(target[k], v, [...path, k], changed)
    else if (isObj(v) || Array.isArray(v) || !sameScalar(cur, v)) { target[k] = toDoc(v); changed.push([...path, k]) }
  }
}

// the patch that undoes `patch` applied to `prev` (both plain)
function inversePatch (prev, patch) {
  const out = {}
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue
    if (!prev || !(k in prev)) { if (v !== null) out[k] = null; continue }
    if (isObj(v) && isObj(prev[k])) out[k] = inversePatch(prev[k], v)
    else out[k] = prev[k]
  }
  return out
}

const entityPlain = (id, e) => ({
  op: 'spawn', id, name: str(e.name), preset: str(e.preset), parent: str(e.parent), owner: str(e.owner),
  components: plain(e.components ?? {}), groups: Object.keys(e.groups ?? {}).filter((g) => e.groups[g]),
  ...(e.hollow && Object.keys(e.hollow).length ? { hollow: Object.keys(e.hollow).filter((k) => e.hollow[k]) } : {}),
})

// ---------------------------------------------------------------- applying

// Apply inside a change. Returns { results, inverse } (inverse already reversed,
// ready to apply as one batch). Proxies are re-read after every assignment:
// `(d.a ||= {})[k] = v` writes into the literal, not into the doc.
export function changeDoc (d, ops, ctx = {}) {
  for (const k of ['entities', 'presets', 'components', 'systems', 'assets']) if (!d[k]) d[k] = {}
  if (d.schema == null) d.schema = SCHEMA_VERSION
  const results = []
  const inverse = []
  const ids = []
  const ref = (v) => (typeof v === 'string' && REF.test(v) ? ids[Number(v.slice(1))] : v)
  const entity = (id) => { const e = d.entities[id]; if (!e) throw new TypeError(`no entity ${id}`); return e }
  const comps = (id) => { const e = entity(id); if (!isObj(e.components)) e.components = {}; return d.entities[id].components }

  ops.forEach((op, i) => {
    let result = true
    let inv = null
    const id = op.id != null ? ref(op.id) : undefined
    switch (op.op) {
      case 'spawn': {
        const nid = id ?? newId(slug(op.name ?? (op.preset || 'e')))
        if (d.entities[nid]) throw new TypeError(`entity ${nid} exists`)
        // own maps for inherited object components (and the hit ledger), so first
        // concurrent `set`s and `hit`s merge into them instead of conflicting
        const { components: c, hollow } = withOwnMaps(d, { preset: op.preset ?? '', components: op.components ?? {}, groups: op.groups ?? [] })
        for (const k of op.hollow ?? []) hollow[k] = true // a respawn (undo of despawn) keeps the marks
        const t = isObj(c.transform) ? c.transform : {}
        c.transform = { ...t, p: op.at ?? t.p ?? [0, 0, 0], r: t.r ?? [0, 0, 0], s: t.s ?? [1, 1, 1] }
        const groups = {}
        for (const g of op.groups ?? []) groups[g] = true
        d.entities[nid] = {
          name: I(op.name ?? (op.preset ? titleCase(op.preset) : 'Entity')),
          parent: I(op.parent ? ref(op.parent) : ''),
          preset: I(op.preset ?? ''),
          owner: I(op.owner ?? ''),
          components: toDoc(c), // a null component removes the preset's
          hollow, // the own maps above that are merge targets only (presets.js withOwnMaps)
          groups,
          inbox: {},
        }
        ids[i] = nid; result = nid; inv = { op: 'despawn', id: nid }
        break
      }
      case 'despawn': inv = entityPlain(id, entity(id)); delete d.entities[id]; break
      case 'set': {
        const c = comps(id); const cur = c[op.component]
        const changed = []
        if (cur === undefined) inv = { op: 'remove', id, component: op.component }
        else inv = { op: 'set', id, component: op.component, patch: inversePatch(plain(cur), op.patch) }
        if (isObj(cur)) mergeInto(c[op.component], op.patch, [], changed)
        else c[op.component] = toDoc(stripNulls(op.patch))
        break
      }
      case 'replace': {
        const c = comps(id); const cur = c[op.component]
        inv = cur === undefined ? { op: 'remove', id, component: op.component } : { op: 'replace', id, component: op.component, data: plain(cur) }
        c[op.component] = toDoc(op.data)
        break
      }
      case 'remove': {
        const c = comps(id); const cur = c[op.component]
        if (cur !== undefined) { inv = { op: 'replace', id, component: op.component, data: plain(cur) }; delete c[op.component] }
        break
      }
      case 'define': {
        const e = entity(id); let def = op.entity; const changed = []
        inv = { op: 'define', id, entity: { name: str(e.name), preset: str(e.preset), parent: str(e.parent), components: plain(e.components ?? {}), groups: Object.keys(e.groups ?? {}).filter((g) => e.groups[g]) } }
        for (const f of ['name', 'preset', 'parent', 'owner']) {
          if (def[f] == null) continue
          const v = f === 'parent' ? ref(def[f]) : def[f]
          if (str(e[f]) !== v) { d.entities[id][f] = I(v); changed.push([f]) }
        }
        if (def.components != null) {
          comps(id)
          // a define that does not name health keeps the ledger (and its own map)
          const ownHealth = d.entities[id].components.health
          if (!('health' in def.components) && isObj(ownHealth)) def = { ...def, components: { ...def.components, health: { hits: isObj(ownHealth.hits) ? plain(ownHealth.hits) : {} } } }
          // define never drops the rest pose or the damage ledger unless it names them
          const keep = (p) => (p.length === 1 && p[0] === 'transform' && !('transform' in def.components)) ||
            (p.length === 2 && p[0] === 'health' && p[1] === 'hits' && !('hits' in (def.components.health ?? {})))
          diffInto(d.entities[id].components, def.components, ['components'], changed, (p) => keep(p.slice(1)))
        }
        if (def.groups != null) {
          const want = Array.isArray(def.groups) ? def.groups : Object.keys(def.groups).filter((g) => def.groups[g])
          if (!isObj(e.groups)) d.entities[id].groups = {}
          const g = d.entities[id].groups
          for (const k of Object.keys(g)) if (!want.includes(k)) { delete g[k]; changed.push(['groups', k]) }
          for (const k of want) if (!g[k]) { g[k] = true; changed.push(['groups', k]) }
        }
        result = { changed: changed.map((p) => p.join('.')) }
        break
      }
      case 'setParent': { const e = entity(id); const p = op.parent ? ref(op.parent) : ''; inv = { op: 'setParent', id, parent: str(e.parent) }; if (str(e.parent) !== p) e.parent = I(p); break }
      case 'setName': { const e = entity(id); inv = { op: 'setName', id, name: str(e.name) }; if (str(e.name) !== op.name) e.name = I(op.name); break }
      case 'addGroup': {
        const e = entity(id)
        if (!isObj(e.groups)) d.entities[id].groups = {}
        if (!d.entities[id].groups[op.group]) { d.entities[id].groups[op.group] = true; inv = { op: 'removeGroup', id, group: op.group } }
        break
      }
      case 'removeGroup': {
        const g = entity(id).groups
        if (g && g[op.group] !== undefined) { delete g[op.group]; inv = { op: 'addGroup', id, group: op.group } }
        break
      }
      case 'push': {
        const e = entity(id)
        if (!isObj(e.inbox)) d.entities[id].inbox = {} // older docs held a list
        const { id: evId, ...data } = op.event
        const k = evId ?? newId(slug(ctx.peerId ?? 'ev'))
        d.entities[id].inbox[k] = toDoc(stripNulls(data))
        inv = { op: 'drain', id, eventIds: [k] }
        break
      }
      case 'drain': {
        const box = entity(id).inbox
        const back = []
        if (isObj(box)) for (const k of op.eventIds) if (box[k] !== undefined) { back.push({ op: 'push', id, event: { id: k, ...plain(box[k]) } }); delete box[k] }
        inv = back.length ? back : null
        break
      }
      case 'hit': {
        const c = comps(id)
        if (!isObj(c.health)) c.health = {}
        if (!isObj(c.health.hits)) c.health.hits = {}
        const hits = c.health.hits
        // the ledger is the idempotency: a hit id is written at most once
        if (hits[op.hitId] === undefined) hits[op.hitId] = op.amount
        break
      }
      case 'pin': {
        const e = entity(id)
        if (op.ifOwner !== undefined && str(e.owner) !== op.ifOwner) result = false
        else if (str(e.owner) !== op.owner) e.owner = I(op.owner)
        break
      }
      case 'unpin': {
        const e = entity(id)
        if (str(e.owner) !== op.ifOwner) result = false
        else if (str(e.owner) !== '') e.owner = I('')
        break
      }
      case 'checkpoint': case 'transform': {
        const c = comps(id)
        if (!isObj(c.transform)) c.transform = toDoc({ p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] })
        const t = c.transform
        const prev = plain(t)
        const r = op.r ?? (op.yaw != null ? [prev.r?.[0] ?? 0, op.yaw, prev.r?.[2] ?? 0] : null)
        const want = { p: op.p, r, s: op.op === 'transform' ? op.s : null }
        const back = {}
        for (const f of ['p', 'r', 's']) {
          if (!want[f]) continue
          back[f] = prev[f] ?? (f === 's' ? [1, 1, 1] : [0, 0, 0])
          if (!Array.isArray(t[f]) || t[f].length !== 3) { t[f] = [...want[f]]; continue }
          for (let k = 0; k < 3; k++) if (t[f][k] !== want[f][k]) t[f][k] = want[f][k] // per axis: concurrent axis edits merge
        }
        if (op.op === 'transform') inv = { op: 'transform', id, ...back }
        break
      }
      case 'definePreset': case 'defineComponent': {
        const table = op.op === 'definePreset' ? 'presets' : 'components'
        const val = op.op === 'definePreset' ? op.preset : op.def
        const cur = d[table][op.name]
        inv = cur === undefined ? { op: table === 'presets' ? 'removePreset' : 'removeComponent', name: op.name } : { op: op.op, name: op.name, [table === 'presets' ? 'preset' : 'def']: plain(cur) }
        if (isObj(cur)) diffInto(d[table][op.name], val, [], [])
        else d[table][op.name] = toDoc(val)
        break
      }
      case 'removePreset': case 'removeComponent': {
        const table = op.op === 'removePreset' ? 'presets' : 'components'
        const cur = d[table][op.name]
        if (cur !== undefined) { inv = { op: table === 'presets' ? 'definePreset' : 'defineComponent', name: op.name, [table === 'presets' ? 'preset' : 'def']: plain(cur) }; delete d[table][op.name] }
        break
      }
      case 'defineSystem': {
        const cur = d.systems[op.name]
        if (cur && typeof cur.source === 'string') {
          inv = { op: 'defineSystem', name: op.name, source: cur.source, order: plain(cur.order), enabled: plain(cur.enabled) !== false }
          // Text edited by diff, so two people editing one system merge by characters
          if (cur.source !== op.source) updateText(d, ['systems', op.name, 'source'], op.source)
          const s = d.systems[op.name]
          if (op.order !== undefined && s.order !== op.order) s.order = op.order
          if (op.enabled !== undefined && s.enabled !== op.enabled) s.enabled = op.enabled
          s.rev = Number(plain(s.rev) ?? 0) + 1
        } else {
          inv = { op: 'removeSystem', name: op.name }
          d.systems[op.name] = { source: op.source, order: op.order ?? 950, enabled: op.enabled ?? true, rev: 1 }
        }
        break
      }
      case 'setSystem': {
        const s = d.systems[op.name]
        if (!s) throw new TypeError(`no system ${op.name}`)
        const p = op.patch
        inv = { op: 'setSystem', name: op.name, patch: {} }
        if (p.order !== undefined) { inv.patch.order = plain(s.order); if (s.order !== p.order) s.order = p.order }
        if (p.enabled !== undefined) { inv.patch.enabled = plain(s.enabled); if (s.enabled !== p.enabled) s.enabled = p.enabled }
        if (p.source !== undefined && String(s.source) !== p.source) {
          inv.patch.source = String(s.source)
          updateText(d, ['systems', op.name, 'source'], p.source)
          d.systems[op.name].rev = Number(plain(d.systems[op.name].rev) ?? 0) + 1
        }
        break
      }
      case 'removeSystem': {
        const s = d.systems[op.name]
        if (s) { inv = { op: 'defineSystem', name: op.name, source: String(s.source), order: plain(s.order), enabled: plain(s.enabled) !== false }; delete d.systems[op.name] }
        break
      }
      case 'setWorld': case 'setMeta': {
        const key = op.op === 'setWorld' ? 'world' : 'meta'
        if (!isObj(d[key])) d[key] = {}
        inv = { op: op.op, patch: inversePatch(plain(d[key]), op.patch) }
        mergeInto(d[key], op.patch, [], [])
        break
      }
      default: throw new TypeError(`unknown op ${op.op}`)
    }
    results.push(result)
    if (Array.isArray(inv)) inverse.push(...inv)
    else if (inv) inverse.push(inv)
  })
  return { results, inverse: inverse.reverse() }
}

// validate, check system sources, then ONE handle.change. A bad batch throws
// before the doc is touched (heads unchanged).
export function applyOps (handle, ops, { message, peerId, checkSource, componentDefs, kinds } = {}) {
  if (!Array.isArray(ops)) throw new TypeError('ops must be an array of {op, ...}')
  if (!ops.length) return { results: [], inverse: [] }
  validateOps(handle.doc(), ops, { componentDefs, kinds })
  if (checkSource) {
    const problems = []
    ops.forEach((op, i) => {
      const src = op.op === 'defineSystem' ? op.source : op.op === 'setSystem' ? op.patch?.source : undefined
      if (src === undefined) return
      try { checkSource(src, op.name) } catch (e) { problems.push(`op ${i} (${op.op} ${op.name}): ${e?.name ?? 'Error'}: ${e?.message ?? e}`) }
    })
    if (problems.length) { const e = new TypeError(`invalid ops:\n  ${problems.join('\n  ')}`); e.problems = problems; throw e }
  }
  let out = { results: [], inverse: [] }
  handle.change((d) => { out = changeDoc(d, ops, { peerId }) }, message ? { message } : {})
  return out
}

// The ops of `ops` that validate, in order, and the ones that do not. Used for a
// batch nobody can retry, such as the app's per-tick flush of every system's
// queued effects: one bad op (a doc system's spawn of an unknown preset, a bad
// group name) must not drop every hit, inbox drain, checkpoint and `dead` group
// of that tick, because the sim's local state has already moved on as if they
// landed. Each op is checked against the doc plus the ops kept before it; '$n'
// references are renumbered, and an op that refers to a dropped spawn is dropped.
export function splitValidOps (doc, ops, opts = {}) {
  if (!Array.isArray(ops)) throw new TypeError('ops must be an array of {op, ...}')
  try { validateOps(doc, ops, opts); return { ok: ops, dropped: [] } } catch (e) { if (!e?.problems) throw e }
  const ok = []; const dropped = []; const at = new Map() // old index -> new index
  const isRef = (v) => typeof v === 'string' && REF.test(v)
  const renum = (v) => (isRef(v) ? (at.has(Number(v.slice(1))) ? `$${at.get(Number(v.slice(1)))}` : null) : v)
  ops.forEach((op, i) => {
    let o = op
    if (isObj(op)) {
      const fix = {}
      let lost = false
      for (const f of ['id', 'parent']) if (isRef(op[f])) { const v = renum(op[f]); if (v == null) lost = true; else fix[f] = v }
      if (isObj(op.entity) && isRef(op.entity.parent)) { const v = renum(op.entity.parent); if (v == null) lost = true; else fix.entity = { ...op.entity, parent: v } }
      if (lost) { dropped.push({ index: i, op, error: 'refers to a spawn that was dropped' }); return }
      if (Object.keys(fix).length) o = { ...op, ...fix }
    }
    try { validateOps(doc, [...ok, o], opts) } catch (e) {
      if (!e?.problems) throw e
      const mine = e.problems.filter((p) => p.startsWith(`op ${ok.length} `))
      dropped.push({ index: i, op, error: (mine.length ? mine : e.problems).join('; ').replace(/^op \d+ /, '') })
      return
    }
    at.set(i, ok.length); ok.push(o)
  })
  return { ok, dropped }
}

// applyOps for a batch nobody can retry: applies the ops that validate in one
// change and reports the rest as `dropped: [{ index, op, error }]`.
export function applyValidOps (handle, ops, opts = {}) {
  const { ok, dropped } = splitValidOps(handle.doc(), ops, { componentDefs: opts.componentDefs, kinds: opts.kinds })
  const out = ok.length ? applyOps(handle, ok, opts) : { results: [], inverse: [] }
  return { ...out, dropped }
}

// Moving an entity from the editor or an agent. A simulated entity (one with a
// body) belongs to whichever peer runs it, and that owner ignores doc transforms
// (design §4.4), so the move also travels as an inbox `move` the owner drains;
// the transform write keeps the rest pose right for late joiners.
export function moveOps (doc, id, p, yawDeg) {
  const t = { op: 'transform', id }
  if (p) t.p = [...p]
  if (Number.isFinite(yawDeg)) t.yaw = yawDeg
  return withMoves(doc, [t])
}

const isVec3 = (v) => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'number' && Number.isFinite(x))

// The one place that turns pose writes into inbox moves (design §4.4): for every
// op that sets the position or yaw of an existing simulated entity (one whose
// effective components have a body) — `set` or `replace` of transform, `define`
// with components.transform, and `transform` — append a `push` of
// {type:'move', p?, yaw?}. A yaw-only edit carries no `p` (the owner keeps its
// live position: the doc's is the last checkpoint, up to seconds old). Moves go
// at the END so '$n' references and result indices hold; one move per entity
// (the last write wins); entities that already get a move in the batch, are
// despawned in it, or for which `skip(id)` is true get none.
export function withMoves (doc, ops, { skip } = {}) {
  if (!Array.isArray(ops)) return ops
  const ents = doc?.entities ?? {}
  const has = new Set(); const gone = new Set()
  for (const o of ops) {
    if (!isObj(o)) continue
    if (o.op === 'push' && String(o.event?.type ?? '') === 'move') has.add(o.id)
    if (o.op === 'despawn') gone.add(o.id)
  }
  const moves = new Map()
  for (const o of ops) {
    if (!isObj(o) || typeof o.id !== 'string' || REF.test(o.id) || !ents[o.id] || has.has(o.id) || gone.has(o.id)) continue
    let t = null
    if ((o.op === 'set' || o.op === 'replace') && o.component === 'transform') t = o.op === 'set' ? o.patch : o.data
    else if (o.op === 'define') t = o.entity?.components?.transform
    else if (o.op === 'transform') t = { p: o.p, r: o.r, yaw: o.yaw }
    if (!isObj(t)) continue
    const p = isVec3(t.p) ? [...t.p] : null
    const yaw = Number.isFinite(t.yaw) ? t.yaw : Array.isArray(t.r) && Number.isFinite(t.r[1]) ? t.r[1] : null
    if (!p && yaw == null) continue
    if (skip?.(o.id) || !effectiveComponents(doc, o.id)?.body) continue
    const ev = { ...(moves.get(o.id)?.event ?? { type: 'move' }) }
    if (p) ev.p = p
    if (yaw != null) ev.yaw = yaw
    moves.set(o.id, { op: 'push', id: o.id, event: ev })
  }
  return moves.size ? [...ops, ...moves.values()] : ops
}
