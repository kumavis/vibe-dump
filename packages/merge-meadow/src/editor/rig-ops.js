// Pure op builders behind the rig panel (design §17.5, ARCHITECTURE §6.3), tested
// in Node. The panel (rig-panel.js) owns the DOM; everything that decides WHAT
// to write lives here, so no op shape depends on a browser.
import { RIG_INLINE } from './kind-switcher.js'

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const clone = (v) => (v == null || typeof v !== 'object' ? v : JSON.parse(JSON.stringify(v)))

// the editor's preview-state selector: the sim's semantic states, '' = off
export const PREVIEW_STATES = ['idle', 'walk', 'run', 'attack', 'die', 'sit']
// the model fields a definition carries (never `rev`: the op increments it)
export const MODEL_FIELDS = ['extends', 'stride', 'runSpeed', 'nodes', 'animations', 'controller']

// a definable copy of a model: known fields only, rev and resolver extras dropped
export function modelBody (m, { flatten = false } = {}) {
  const out = {}
  for (const k of MODEL_FIELDS) if (isObj(m) && m[k] !== undefined && m[k] !== null) out[k] = clone(m[k])
  if (flatten) out.extends = ''
  return out
}

// a name not yet in `taken` (doc.models keys), from `base`: horse -> horse-2, horse-3…
export function uniqueModelName (base, taken) {
  const have = new Set([...(taken ?? [])].map(String))
  const stem = String(base || 'model').replace(/[^A-Za-z0-9_-]/g, '-').replace(/^[^A-Za-z_]+/, '').replace(/-\d+$/, '').slice(0, 56) || 'model'
  for (let i = 2; i < 10000; i++) { const n = `${stem}-${i}`; if (!have.has(n)) return n }
  return `${stem}-${Date.now().toString(36)}`
}

// Fork (design §17.5): copy the RESOLVED model (extends flattened: the fork no
// longer moves when its base is edited) into doc.models under `name`, and point
// the entity at it in the same batch. One replace of the representation: the
// look's own fields (color, scale, tint) stay; inline fields go; anything the
// preset's look has that the new one does not is nulled so it cannot show through.
export function forkOps (entityId, rep, name, resolved, { inherited } = {}) {
  if (!name) throw new TypeError('fork needs a model name')
  if (!isObj(resolved)) throw new TypeError('fork needs the resolved model')
  const cur = isObj(rep) ? rep : {}
  const data = { ...clone(cur), kind: 'rig', model: String(name) }
  for (const k of RIG_INLINE) delete data[k]
  const shadow = isObj(inherited) ? inherited : cur
  for (const k of Object.keys(shadow)) if (!(k in data)) data[k] = null
  return [
    { op: 'defineModel', name: String(name), model: modelBody(resolved, { flatten: true }) },
    { op: 'replace', id: entityId, component: 'representation', data },
  ]
}

// the `set` patch that turns `prev` into `next` exactly: set merges objects and
// writes equal-length arrays per index, so a removed key needs an explicit null
// (a dropped clip or track would otherwise survive the edit)
export function exactPatch (prev, next) {
  if (!isObj(prev) || !isObj(next)) return clone(next)
  const out = {}
  for (const k of Object.keys(prev)) if (!(k in next)) out[k] = null
  for (const [k, v] of Object.entries(next)) {
    if (isObj(v) && isObj(prev[k])) out[k] = exactPatch(prev[k], v)
    else out[k] = clone(v)
  }
  return out
}

// One x-json field edit (nodes | animations | controller) of a rig look.
//   target { model: name, own } -> the referenced model redefined with that field
//   target { inline: true, rep } -> a `set` of that field on the representation
// -> { ops, candidate } where candidate is the model to validate first
export function rigFieldOps (entityId, target, field, value) {
  if (!RIG_INLINE.includes(field)) throw new TypeError(`not a rig field: ${field}`)
  if (target?.model) {
    const candidate = { ...modelBody(target.own), [field]: clone(value) }
    return { candidate, ops: [{ op: 'defineModel', name: String(target.model), model: candidate }] }
  }
  const rep = isObj(target?.rep) ? target.rep : {}
  const candidate = modelBody({ ...rep, [field]: value })
  const patch = { [field]: rep[field] === undefined ? clone(value) : exactPatch({ v: rep[field] }, { v: value }).v }
  return { candidate, ops: [{ op: 'set', id: entityId, component: 'representation', patch }] }
}

// point a rig look at another model ('' = inline: keep/seed its own nodes)
export function setModelOps (entityId, rep, model, { resolved } = {}) {
  if (model) return [{ op: 'set', id: entityId, component: 'representation', patch: { model: String(model), ...Object.fromEntries(RIG_INLINE.filter((k) => isObj(rep) && rep[k] != null).map((k) => [k, null])) } }]
  // to inline: copy the resolved model's parts into the look, so it looks the same
  const body = modelBody(resolved ?? {})
  const patch = { model: null }
  for (const k of RIG_INLINE) if (body[k] !== undefined) patch[k] = body[k]
  return [{ op: 'set', id: entityId, component: 'representation', patch }]
}

// what the reconciler's preview gets for a selector value ('' / 'off' = clear)
export const previewArg = (state) => (state && state !== 'off' && PREVIEW_STATES.includes(String(state)) ? { anim: String(state) } : null)
