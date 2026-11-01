// Representation kind switcher (design §8, §16.13). Swapping `kind` is a
// meaning change, so it is ONE `replace` of the representation (new identity:
// a concurrent field edit to the old look must not leak into the new one),
// built from the target kind's defaults plus the fields both kinds declare
// with the same type (color, size, …). Fields no kind declares (the
// representation-wide `tint`) belong to the look as a whole and are carried too.
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const clone = (v) => (v == null || typeof v !== 'object' ? v : JSON.parse(JSON.stringify(v)))

export function defaultsOf (schema) {
  const o = {}
  for (const [k, p] of Object.entries(schema?.properties ?? {})) {
    if (!isObj(p)) continue
    if (p.default !== undefined) o[k] = clone(p.default)
    else if (p.type === 'object' && isObj(p.properties)) o[k] = defaultsOf(p)
  }
  return o
}

const sig = (p) => {
  if (!isObj(p)) return null
  const t = Array.isArray(p.enum) ? `enum:${p.enum.map(String).join('|')}` : String(p.type ?? 'any')
  const items = p.type === 'array' ? `[${p.items?.type ?? '*'}:${p.minItems ?? ''}-${p.maxItems ?? ''}]` : ''
  return `${t}${items}/${p.format ?? ''}/${p['x-json'] ? 'json' : ''}`
}

// would `v` be valid for property schema `p`? (ranges included: a billboard of
// size 9 should not become a critter of length 9 if that is out of range)
function fits (p, v) {
  if (Array.isArray(p.enum)) return p.enum.some((e) => String(e) === String(v))
  switch (p.type) {
    case 'number': return typeof v === 'number' && Number.isFinite(v) && !(p.minimum != null && v < p.minimum) && !(p.maximum != null && v > p.maximum)
    case 'integer': return Number.isInteger(v) && !(p.minimum != null && v < p.minimum) && !(p.maximum != null && v > p.maximum)
    case 'string': return typeof v === 'string'
    case 'boolean': return typeof v === 'boolean'
    case 'array': return Array.isArray(v) && !(p.minItems != null && v.length < p.minItems) && !(p.maxItems != null && v.length > p.maxItems)
    case 'object': return isObj(v)
    default: return v !== undefined
  }
}

// inherited: the representation the entity would have without its own one
// (from its preset). Any field it has that the new look does not get is nulled,
// so the preset's billboard `image` does not linger under a critter (an own
// component overlays the preset's field by field). Without it, every dropped
// field of `current` is nulled, which is right either way, just noisier.
export function switchedData (current, targetKind, kinds, { inherited } = {}) {
  const dst = kinds?.[targetKind]
  if (!dst) throw new TypeError(`unknown representation kind ${JSON.stringify(targetKind)}`)
  const cur = isObj(current) ? current : {}
  const curKind = String(cur.kind ?? '')
  const from = kinds[curKind]?.schema?.properties ?? null
  const to = dst.schema?.properties ?? {}
  const declaredBySome = new Set(Object.values(kinds).flatMap((k) => Object.keys(k?.schema?.properties ?? {})))
  const next = { ...defaultsOf(dst.schema), ...clone(isObj(dst.defaults) ? dst.defaults : {}) }
  for (const [k, p] of Object.entries(to)) {
    if (k === 'kind' || cur[k] === undefined) continue
    const same = from ? sig(from[k]) !== null && sig(from[k]) === sig(p) : true
    if (same && fits(p, cur[k])) next[k] = clone(cur[k])
  }
  for (const [k, v] of Object.entries(cur)) {
    if (k === 'kind' || k in to || declaredBySome.has(k) || (from && k in from)) continue
    next[k] = clone(v)
  }
  next.kind = targetKind
  const shadow = isObj(inherited) ? inherited : cur
  for (const k of Object.keys(shadow)) if (!(k in next)) next[k] = null
  return next
}

// ---- rigs (design §17) --------------------------------------------------------
// A rig either names a model in doc.models or carries its nodes inline (what
// `tree` is an alias for). These are the inline fields a model reference drops.
export const RIG_INLINE = ['nodes', 'animations', 'controller']
// kinds the switcher never offers: `critter` was removed (design §17.5); a doc
// that still names it gets a one-click convert in the inspector instead
export const REMOVED_KINDS = new Set(['critter'])
export const DEFAULT_RIG_MODEL = 'quadruped'

// the model a switch to `rig` points at: the asked one, else 'quadruped', else
// the first model in the doc ('' = none at all: an inline rig)
export function pickModel (models, wanted) {
  const names = [...(models ?? [])].map(String).sort()
  if (wanted && names.includes(String(wanted))) return String(wanted)
  if (names.includes(DEFAULT_RIG_MODEL)) return DEFAULT_RIG_MODEL
  return names[0] ?? ''
}

// `data` -> a rig representation that references `model`: the inline fields go
// (nulled where the shadow would show them through, else dropped)
function asModelRef (data, model, shadow) {
  const out = { ...data, kind: 'rig', model }
  for (const k of RIG_INLINE) {
    if (isObj(shadow) && shadow[k] != null) out[k] = null
    else delete out[k]
  }
  return out
}

// switchedData for target 'rig': the usual carry (color, scale, tint), then the
// model reference. A `tree`'s nodes would carry by shape, but a switch to a
// model means "look like that model"; keep the nodes with model '' instead.
export function rigData (current, model, kinds, opts = {}) {
  const base = kinds?.rig ? switchedData(current, 'rig', kinds, opts) : { ...(isObj(current) ? clone(current) : {}), kind: 'rig' }
  if (!model) { delete base.model; return base }
  return asModelRef(base, String(model), isObj(opts.inherited) ? opts.inherited : current)
}

// -> one replace op (the contract's shape); the editor wraps it in a list.
// opts.model: the model a switch to 'rig' references (see pickModel).
export function switchKindOps (entityId, current, targetKind, kinds, opts = {}) {
  const data = targetKind === 'rig' ? rigData(current, opts.model ?? DEFAULT_RIG_MODEL, kinds, opts) : switchedData(current, targetKind, kinds, opts)
  return { op: 'replace', id: entityId, component: 'representation', data }
}

// critter rig -> library model (design §17.5): the body plan picks the base
const CRITTER_MODEL = { quadruped: 'quadruped', biped: 'biped' }
export const critterModel = (rep) => CRITTER_MODEL[String(rep?.rig ?? '')] ?? 'quadruped'

// One replace: a `critter` look becomes { kind: 'rig', model, color } (+ the
// look-wide tint). Every other critter field (rig, length, height, head, tail)
// is nulled where the preset would show it through, else dropped.
export function convertCritterOps (entityId, current, { inherited } = {}) {
  const cur = isObj(current) ? current : {}
  const data = { kind: 'rig', model: critterModel(cur) }
  if (typeof cur.color === 'string') data.color = cur.color
  if (cur.tint != null) data.tint = clone(cur.tint)
  const shadow = isObj(inherited) ? inherited : cur
  for (const k of Object.keys(shadow)) if (!(k in data)) data[k] = null
  return { op: 'replace', id: entityId, component: 'representation', data }
}

// <select> over the open KINDS registry. With opts.models (doc.models names) the
// switcher is a span: the kind select plus, while the look is not a rig yet, the
// model a switch to `rig` will reference (default 'quadruped').
// onSwitch(kind, { model }).
export function renderKindSwitcher (kinds, current, onSwitch, opts = {}) {
  const sel = document.createElement('select')
  sel.className = 'kind-switcher'
  sel.title = 'Swap the look: one replace, behaviour untouched'
  const cur = String(current?.kind ?? '')
  const names = switcherKinds(kinds)
  for (const k of names) sel.add(new Option(k, k, false, k === cur))
  if (cur && !names.includes(cur)) {
    // an unknown or removed kind is shown (it is what the doc says) but not offered
    const o = new Option(`${cur} (${REMOVED_KINDS.has(cur) ? 'removed' : 'unknown'})`, cur, false, true)
    o.disabled = true
    sel.insertBefore(o, sel.firstChild)
  }
  if (!opts.models) {
    sel.addEventListener('change', () => { if (sel.value !== cur) onSwitch(sel.value, {}) })
    return sel
  }
  const wrap = document.createElement('span')
  wrap.className = 'kind-switcher-wrap'
  const msel = document.createElement('select')
  msel.className = 'rig-model-pick'
  msel.title = 'the model a switch to rig uses'
  const model = pickModel(opts.models, opts.model)
  for (const m of [...opts.models].map(String).sort()) msel.add(new Option(`model: ${m}`, m, false, m === model))
  msel.hidden = cur === 'rig' || !names.includes('rig') || !opts.models.length
  sel.addEventListener('change', () => { if (sel.value !== cur) onSwitch(sel.value, { model: msel.value || model }) })
  wrap.append(sel, msel)
  return wrap
}

// the kinds the switcher offers: the registry minus removed kinds, rig included
export function switcherKinds (kinds) {
  return Object.keys(kinds ?? {}).filter((k) => !REMOVED_KINDS.has(k)).sort()
}
