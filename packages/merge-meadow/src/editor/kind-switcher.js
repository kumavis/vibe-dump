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

// -> one replace op (the contract's shape); the editor wraps it in a list
export function switchKindOps (entityId, current, targetKind, kinds, opts) {
  return { op: 'replace', id: entityId, component: 'representation', data: switchedData(current, targetKind, kinds, opts) }
}

// <select> over the open KINDS registry
export function renderKindSwitcher (kinds, current, onSwitch) {
  const sel = document.createElement('select')
  sel.className = 'kind-switcher'
  sel.title = 'Swap the look: one replace, behaviour untouched'
  const cur = String(current?.kind ?? '')
  const names = Object.keys(kinds ?? {}).sort()
  if (cur && !names.includes(cur)) names.unshift(cur)
  for (const k of names) sel.add(new Option(k, k, false, k === cur))
  sel.addEventListener('change', () => { if (sel.value !== cur) onSwitch(sel.value) })
  return sel
}
