// Pure op builders behind the inspector (tested in Node). A form edit is a
// path + value; these turn it into the smallest op that says it: a nested
// `set` patch (field merge), a per-index vector write, a `moveOps` teleport for
// a simulated entity's position (its owner ignores doc transforms, design §4.4),
// a `define` with a null override to drop an inherited component.
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const clone = (v) => (v == null || typeof v !== 'object' ? v : JSON.parse(JSON.stringify(v)))

// path ['drives', 'hunt', 'weight'], 3 -> { drives: { hunt: { weight: 3 } } }
// A numeric segment rewrites the whole array from `current` with one element
// changed: set writes equal-length arrays per index, so only that axis lands.
export function patchFor (path, value, current) {
  if (!Array.isArray(path) || !path.length) {
    if (!isObj(value)) throw new TypeError('a whole-component patch must be an object')
    return clone(value)
  }
  if (typeof path[0] === 'number') throw new TypeError('a component patch path starts with a field name')
  const build = (rest, cur) => {
    if (!rest.length) return clone(value)
    const [k, ...more] = rest
    if (typeof k === 'number') {
      const arr = Array.isArray(cur) ? clone(cur) : []
      for (let i = arr.length; i < k; i++) arr[i] = 0
      arr[k] = build(more, arr[k])
      return arr
    }
    return { [k]: build(more, isObj(cur) ? cur[k] : undefined) }
  }
  return build(path, isObj(current) ? current : {})
}

// the value currently at `path` inside `obj`
export function valueAt (obj, path) {
  let v = obj
  for (const k of path) { if (v == null) return undefined; v = v[k] }
  return v
}

// One form edit on component `comp` of entity `row` (an entityData row).
// moveOps: track A's (doc, id, p, yawDeg) -> ops; doc is what it reads.
export function editOps ({ row, comp, path, value, doc, moveOps }) {
  const id = row.id
  const current = row.effective?.[comp]
  if (comp === 'transform' && moveOps && row.effective?.body && (path[0] === 'p' || path[0] === 'r')) {
    // only the edited part travels: the doc's transform is the last checkpoint
    // (seconds old for a running animal), so a position edit keeps the live yaw
    // and a yaw edit keeps the live position (the move carries no `p`)
    const t = current ?? {}
    if (path[0] === 'p') return moveOps(doc, id, patchFor(path, value, t).p, NaN)
    const r = patchFor(path, value, t).r
    const ops = moveOps(doc, id, null, Number(r[1]) || 0)
    // x/z tilt is a pure rest-pose edit; the move only carries yaw
    if (r[0] !== (t.r?.[0] ?? 0) || r[2] !== (t.r?.[2] ?? 0)) ops.push({ op: 'set', id, component: 'transform', patch: { r } })
    return ops
  }
  return [{ op: 'set', id, component: comp, patch: patchFor(path, value, current) }]
}

// Where a component comes from: 'own' (only on the entity), 'inherited' (only
// from the preset chain or a group), 'override' (both).
// An own component holding only empty maps (the ones spawn creates so first
// concurrent edits merge) overrides nothing: it counts as inherited.
const hollow = (v) => isObj(v) && Object.values(v).every(hollow)
export function componentOrigin (row, comp, presetComps = {}) {
  const fromPreset0 = !!presetComps && comp in presetComps
  const own = !!row.components && comp in row.components && row.components[comp] !== null && !(fromPreset0 && hollow(row.components[comp]))
  const fromPreset = !!presetComps && comp in presetComps
  if (own && fromPreset) return 'override'
  if (own) return 'own'
  return 'inherited'
}

// Remove a component as the user means it: gone from the effective entity.
// An own-only component is a `remove`; an inherited one needs a null override,
// which only `define` can store (spawn's null-removes semantics); define
// deep-diffs, so passing the own components back unchanged writes nothing else.
export function removeComponentOps (row, comp, presetComps = {}) {
  const origin = componentOrigin(row, comp, presetComps)
  if (origin === 'own') return [{ op: 'remove', id: row.id, component: comp }]
  const own = clone(row.components ?? {})
  own[comp] = null
  return [{ op: 'define', id: row.id, entity: { components: own } }]
}

// Drop an override so the preset's value shows through again.
export function resetComponentOps (row, comp) {
  return row.components && comp in row.components ? [{ op: 'remove', id: row.id, component: comp }] : []
}

// Add a component with its def's defaults (a set on a missing component creates it)
export function addComponentOps (id, comp, def) {
  const d = isObj(def?.defaults) ? clone(def.defaults) : {}
  return [{ op: 'set', id, component: comp, patch: d }]
}

// Effective components of a preset (its extends chain resolved, base first),
// read through read.presetData. Walks `extends` itself rather than trusting the
// order of presetData().chain (which lists the preset before its bases).
export function presetComponents (read, doc, name, seen = new Set()) {
  if (!name || seen.has(name) || seen.size > 16) return {}
  seen.add(name)
  const p = read.presetData(doc, name)
  if (!p) return {}
  const overlay = (dst, src) => {
    for (const [k, v] of Object.entries(src ?? {})) {
      if (v === null) delete dst[k]
      else if (isObj(v) && isObj(dst[k])) dst[k] = overlay({ ...dst[k] }, v)
      else dst[k] = clone(v)
    }
    return dst
  }
  let out = {}
  const bases = Array.isArray(p.extends) ? p.extends : p.extends ? [p.extends] : []
  for (const b of bases) out = overlay(out, presetComponents(read, doc, String(b), seen))
  return overlay(out, p.components)
}

// heal: clear the damage ledger and leave the dead group. The ledger is cleared
// and re-created as an empty own map in one batch, so later concurrent hits
// merge into one map instead of racing to create it.
export function healOps (row) {
  const ops = [{ op: 'set', id: row.id, component: 'health', patch: { hits: null } }, { op: 'set', id: row.id, component: 'health', patch: { hits: {} } }]
  if ((row.groups ?? []).includes('dead')) ops.push({ op: 'removeGroup', id: row.id, group: 'dead' })
  return ops
}

// a component's representation form schema: the def's (minus kind) + the kind's
export function representationSchema (baseSchema, kinds, kind) {
  const base = isObj(baseSchema?.properties) ? { ...baseSchema.properties } : {}
  delete base.kind
  const k = kinds?.[kind]?.schema?.properties ?? {}
  return { type: 'object', properties: { ...k, ...base } }
}

// the order the inspector lists components in: def order, then name
export function sortComponents (names, defs = {}) {
  const ord = (n) => (Number.isFinite(defs[n]?.order) ? defs[n].order : 0)
  return [...names].sort((a, b) => ord(a) - ord(b) || (a < b ? -1 : a > b ? 1 : 0))
}

// Undo/redo replays transform inverses. For a simulated entity the owner
// ignores doc transforms (design §4.4), so a replayed move also needs an inbox
// `move`. Kept as a thin alias of track A's withMoves (the one expansion, which
// the app's editor write path applies to every batch).
export function expandMoves (doc, ops, withMoves) {
  return withMoves ? withMoves(doc, ops) : ops
}
