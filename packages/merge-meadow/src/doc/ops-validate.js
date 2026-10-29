// validateOps: checks a whole batch against the current doc plus the ops before
// each one, and lists every problem (design §5.1: a bad agent call fails
// without a change). Must not mutate the doc.
import { plain, isObj } from './convert.js'
import { isName, isId } from './schema.js'
import { validateComponent, validateSchema, validateSystemMeta, checkJSON } from './validate.js'
import { componentDefsOf, isHollow } from './presets.js'

export const OP_NAMES = Object.freeze(['spawn', 'despawn', 'set', 'replace', 'remove', 'define', 'setParent', 'setName',
  'addGroup', 'removeGroup', 'push', 'drain', 'hit', 'pin', 'unpin', 'checkpoint', 'transform',
  'definePreset', 'removePreset', 'defineComponent', 'removeComponent', 'defineSystem', 'setSystem', 'removeSystem',
  'setWorld', 'setMeta'])
export const MAX_OPS = 2000
export const MAX_SOURCE = 100_000
export const REF = /^\$(\d+)$/
export const PEER_RE = /^[A-Za-z0-9_:.-]{0,80}$/
const str = (v) => (v == null ? '' : String(plain(v)))
const isVec3 = (v) => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'number' && Number.isFinite(x))

export function validateOps (doc, ops, { componentDefs, kinds } = {}) {
  const problems = []
  if (!Array.isArray(ops)) throw new TypeError('ops must be an array of {op, ...}')
  if (ops.length > MAX_OPS) throw new TypeError(`at most ${MAX_OPS} ops per batch`)
  const ents = doc?.entities ?? {}
  const exists = new Set(Object.keys(ents))
  const parents = new Map(Object.keys(ents).map((id) => [id, str(ents[id].parent)]))
  const presets = new Set(Object.keys(doc?.presets ?? {}))
  const systems = new Set(Object.keys(doc?.systems ?? {}))
  const defs = { ...componentDefsOf(doc), ...plain(componentDefs ?? {}) }
  const keys = [] // per-op entity key (explicit id, or '$i' for a generated one)

  ops.forEach((op, i) => {
    const bad = (msg) => problems.push(`op ${i} (${op?.op ?? '?'}): ${msg}`)
    if (!isObj(op) || typeof op.op !== 'string') { bad('expected {op, ...}'); return }
    if (!OP_NAMES.includes(op.op)) { bad(`unknown op (one of ${OP_NAMES.join(', ')})`); return }
    const key = (v, field = 'id') => {
      if (typeof v === 'string' && REF.test(v)) {
        const n = Number(v.slice(1))
        if (!(n < i) || ops[n]?.op !== 'spawn') { bad(`${field} ${v} must refer to an earlier spawn`); return null }
        return keys[n]
      }
      if (!isId(v)) { bad(`bad ${field} ${JSON.stringify(v)}`); return null }
      return v
    }
    const need = (v, field = 'id') => {
      const k = key(v, field)
      if (k != null && !exists.has(k)) { bad(`no entity ${v === k ? k : `${v} (${k})`}`); return null }
      return k
    }
    const component = (name, data, partial) => {
      if (!isName(name)) { bad(`bad component name ${JSON.stringify(name)}`); return }
      if (data === null || data === undefined) return
      for (const p of checkJSON(data, [name])) bad(p)
      // the representation def lists the five built-in kinds; with the renderer's
      // registry at hand, any registered kind is valid (design §8: an open registry)
      let def = defs[name]
      if (name === 'representation' && kinds && def?.schema?.properties?.kind) {
        def = plain(def)
        const k = def.schema.properties.kind
        k.enum = [...new Set([...(Array.isArray(k.enum) ? k.enum : []), ...Object.keys(kinds)])]
      }
      for (const p of validateComponent(def, data, { partial, defs })) bad(`${name}.${p}`)
      // `on` reactions add/remove GROUPS: every entry must be a group name, or the
      // events system's addGroup fails validation every time the event fires
      // (whatever the doc's own `on` schema says)
      if (name === 'on' && isObj(data)) {
        for (const [ev, r] of Object.entries(data)) {
          if (!isObj(r)) continue
          for (const f of ['add', 'remove']) {
            const list = plain(r[f])
            if (list == null) continue
            if (!Array.isArray(list)) bad(`on.${ev}.${f}: must be a list of group names`)
            else for (const g of list) if (!isName(String(g))) bad(`on.${ev}.${f}: bad group name ${JSON.stringify(g)}`)
          }
        }
      }
      if (name === 'representation' && kinds && isObj(data)) {
        const k = kinds[String(plain(data.kind))]
        if (k?.schema) for (const p of validateComponent(k.schema, data, { partial: true, defs })) bad(`representation(${plain(data.kind)}).${p}`)
      }
    }
    const components = (comps, where, partial = true) => {
      if (comps == null) return
      if (!isObj(comps)) { bad(`${where} must be an object`); return }
      for (const [n, d] of Object.entries(comps)) component(n, d, partial)
    }
    keys[i] = null
    switch (op.op) {
      case 'spawn': {
        const k = op.id != null ? key(op.id) : `$${i}`
        if (k && exists.has(k)) bad(`entity ${k} exists`)
        if (op.preset != null && op.preset !== '') {
          if (!isName(op.preset)) bad(`bad preset name ${JSON.stringify(op.preset)}`)
          else if (!presets.has(op.preset)) bad(`no preset ${op.preset}`)
        }
        if (op.name != null && (typeof op.name !== 'string' || op.name.length > 80)) bad('name must be a string of at most 80 characters')
        if (op.at != null && !isVec3(op.at)) bad('at must be [x, y, z]')
        if (op.owner != null && (typeof op.owner !== 'string' || !PEER_RE.test(op.owner))) bad('bad owner')
        if (op.groups != null && !(Array.isArray(op.groups) && op.groups.every(isName))) bad('groups must be a list of names')
        if (op.hollow != null && !(Array.isArray(op.hollow) && op.hollow.every(isName))) bad('hollow must be a list of component names')
        components(op.components, 'components')
        if (op.parent != null && op.parent !== '') need(op.parent, 'parent')
        if (k) { exists.add(k); parents.set(k, op.parent ? key(op.parent, 'parent') ?? '' : '') }
        keys[i] = k
        break
      }
      case 'despawn': { const k = need(op.id); if (k) exists.delete(k); keys[i] = k; break }
      case 'set': {
        keys[i] = need(op.id)
        if (!isObj(op.patch)) bad('patch must be an object (replace swaps identity, remove deletes)')
        else component(op.component, op.patch, true)
        break
      }
      case 'replace': {
        keys[i] = need(op.id)
        if (!isObj(op.data)) bad('data must be an object (use remove to delete)')
        // a whole new identity: required fields (representation.kind) are required,
        // except for an empty own map (an undo restoring the merge target spawn made)
        else component(op.component, op.data, isHollow(op.data))
        break
      }
      case 'remove': keys[i] = need(op.id); if (!isName(op.component)) bad('bad component name'); break
      case 'define': {
        keys[i] = need(op.id)
        const e = op.entity
        if (!isObj(e)) { bad('entity must be {name?, preset?, parent?, components?, groups?}'); break }
        if (e.name != null && typeof e.name !== 'string') bad('entity.name must be a string')
        if (e.preset != null && e.preset !== '' && !presets.has(e.preset)) bad(`no preset ${e.preset}`)
        if (e.parent != null && e.parent !== '') need(e.parent, 'entity.parent')
        if (e.groups != null && !(isObj(e.groups) || (Array.isArray(e.groups) && e.groups.every(isName)))) bad('entity.groups must be a list of names or {name: true}')
        components(e.components, 'entity.components')
        break
      }
      case 'setParent': {
        const k = need(op.id); keys[i] = k
        if (op.parent == null || op.parent === '') { if (k) parents.set(k, ''); break }
        const p = need(op.parent, 'parent')
        if (k && p) {
          for (let a = p, n = 0; a && n < 1000; a = parents.get(a), n++) if (a === k) { bad(`parenting ${k} under ${p} makes a cycle`); break }
          parents.set(k, p)
        }
        break
      }
      case 'setName': keys[i] = need(op.id); if (typeof op.name !== 'string' || !op.name.length || op.name.length > 80) bad('name must be 1-80 characters'); break
      case 'addGroup': case 'removeGroup': keys[i] = need(op.id); if (!isName(op.group)) bad(`bad group name ${JSON.stringify(op.group)}`); break
      case 'push': {
        keys[i] = need(op.id)
        const ev = op.event
        if (!isObj(ev) || !isName(ev.type)) { bad('event must be {type: name, ...}'); break }
        if (ev.id != null && !isId(ev.id)) bad('bad event id')
        for (const p of checkJSON(ev, ['event'])) bad(p)
        break
      }
      case 'drain': keys[i] = need(op.id); if (!Array.isArray(op.eventIds) || !op.eventIds.every((x) => typeof x === 'string')) bad('eventIds must be a list of strings'); break
      case 'hit': {
        keys[i] = need(op.id)
        if (!isId(op.hitId)) bad(`bad hitId ${JSON.stringify(op.hitId)}`)
        if (typeof op.amount !== 'number' || !Number.isFinite(op.amount) || op.amount < 0) bad('amount must be a finite number >= 0')
        break
      }
      case 'pin': case 'unpin': {
        keys[i] = need(op.id)
        if (op.op === 'pin' && (typeof op.owner !== 'string' || !PEER_RE.test(op.owner))) bad('owner must be a peer id (or "")')
        if ((op.op === 'unpin' || op.ifOwner !== undefined) && (typeof op.ifOwner !== 'string' || !PEER_RE.test(op.ifOwner))) bad('ifOwner must be a peer id (or "")')
        break
      }
      case 'checkpoint': case 'transform': {
        keys[i] = need(op.id)
        for (const f of ['p', 'r', 's']) if (op[f] != null && !isVec3(op[f])) bad(`${f} must be [x, y, z]`)
        if (op.op === 'checkpoint' && op.p == null) bad('checkpoint needs p')
        if (op.yaw != null && !Number.isFinite(op.yaw)) bad('yaw must be a number (degrees)')
        break
      }
      case 'definePreset': {
        if (!isName(op.name)) { bad('bad preset name'); break }
        const p = op.preset
        if (!isObj(p)) { bad('preset must be {extends?, components?, groups?}'); break }
        for (const pr of checkJSON(p, ['preset'])) bad(pr)
        const ext = p.extends == null ? [] : Array.isArray(p.extends) ? p.extends : [p.extends]
        for (const b of ext) if (b !== '' && !(presets.has(b) || b === op.name)) bad(`extends unknown preset ${JSON.stringify(b)}`)
        if (ext.includes(op.name)) bad('a preset cannot extend itself')
        components(p.components, 'preset.components')
        if (p.groups != null) {
          if (!isObj(p.groups)) bad('preset.groups must be an object')
          else for (const [g, gd] of Object.entries(p.groups)) {
            if (!isName(g)) bad(`bad group name ${JSON.stringify(g)}`)
            if (!isObj(gd)) { bad(`group ${g} must be {components?, remove?}`); continue }
            if (gd.components != null) components(gd.components, `groups.${g}.components`)
            if (gd.remove != null && !(Array.isArray(gd.remove) && gd.remove.every(isName))) bad(`groups.${g}.remove must be a list of component names`)
          }
        }
        presets.add(op.name)
        break
      }
      case 'removePreset': if (!presets.has(op.name)) bad(`no preset ${op.name}`); else presets.delete(op.name); break
      case 'defineComponent': {
        if (!isName(op.name)) { bad('bad component name'); break }
        const d = op.def
        if (!isObj(d)) { bad('def must be {description?, order?, defaults?, schema?}'); break }
        for (const p of checkJSON(d, ['def'])) bad(p)
        if (d.schema != null) for (const p of validateSchema(d.schema, ['schema'])) bad(p)
        if (d.order != null && !Number.isFinite(d.order)) bad('order must be a number')
        if (d.description != null && typeof d.description !== 'string') bad('description must be a string')
        if (d.defaults != null && d.schema != null && !validateSchema(d.schema).length) for (const p of validateComponent(d, d.defaults, { defs })) bad(`defaults.${p}`)
        defs[op.name] = plain(d)
        break
      }
      case 'removeComponent': if (!(op.name in (doc?.components ?? {})) && !(op.name in defs)) bad(`no component def ${op.name}`); else delete defs[op.name]; break
      case 'defineSystem': {
        if (!isName(op.name)) bad('bad system name')
        if (typeof op.source !== 'string' || op.source.length > MAX_SOURCE) bad(`source must be a string under ${MAX_SOURCE} characters`)
        else if (!/(^|\n)[ \t]*export\s+default\b/.test(op.source)) bad('source must contain `export default { update(world, dt) { … } }`')
        for (const p of validateSystemMeta(op)) bad(p)
        systems.add(op.name)
        break
      }
      case 'setSystem': {
        if (!systems.has(op.name)) { bad(`no system ${op.name}`); break }
        if (!isObj(op.patch)) { bad('patch must be {order?, enabled?, source?}'); break }
        for (const k of Object.keys(op.patch)) if (!['order', 'enabled', 'source'].includes(k)) bad(`unknown system field ${k}`)
        for (const p of validateSystemMeta(op.patch)) bad(p)
        if (op.patch.source !== undefined && (typeof op.patch.source !== 'string' || op.patch.source.length > MAX_SOURCE)) bad('source must be a string')
        break
      }
      case 'removeSystem': if (!systems.has(op.name)) bad(`no system ${op.name}`); else systems.delete(op.name); break
      case 'setWorld': case 'setMeta': {
        if (!isObj(op.patch)) { bad('patch must be an object'); break }
        for (const p of checkJSON(op.patch, ['patch'])) bad(p)
        if (op.op === 'setWorld') {
          const b = op.patch.bounds
          if (b != null && (typeof b !== 'number' || b < 5 || b > 2000)) bad('bounds must be a number in [5, 2000]')
          const ds = op.patch.disabledSystems
          if (ds != null && !(isObj(ds) && Object.entries(ds).every(([k, v]) => isName(k) && (v === true || v === null)))) bad('disabledSystems must be {name: true | null}')
        } else if (op.patch.title != null && (typeof op.patch.title !== 'string' || op.patch.title.length > 120)) bad('title must be a string of at most 120 characters')
        break
      }
    }
  })
  if (problems.length) {
    const e = new TypeError(`invalid ops:\n  ${problems.join('\n  ')}`)
    e.problems = problems
    throw e
  }
  return []
}
