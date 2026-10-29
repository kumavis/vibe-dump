// Validation for everything that reaches the doc: component data against a
// JSON-Schema subset (design §7.4), structured filters (§3.3), system metadata.
// Every function returns a list of problems (strings) and never throws, so
// validateOps can report all of them at once.
import { isName } from './schema.js'
import { plain, isObj } from './convert.js'

export const ACTS = Object.freeze(['pursue', 'flee', 'seek', 'wander', 'steer', 'follow', 'idle'])
export const RELATION_NAMES = Object.freeze(['targetsMe', 'myRider', 'myMount', 'isMounted'])
export const FILTER_KEYS = Object.freeze(['tags', 'anyTags', 'notTags', 'has', 'not', 'relation', 'notRelation', 'where', 'any'])
export const WHERE_OPS = Object.freeze(['lt', 'lte', 'gt', 'gte', 'eq', 'ne'])
// pseudo roots a `where` path may start with instead of a component name
export const PSEUDO_ROOTS = Object.freeze(['$hp', '$live', '$id'])

const SCHEMA_TYPES = new Set(['object', 'number', 'integer', 'string', 'boolean', 'array', 'null'])
const SCHEMA_KEYS = new Set(['type', 'properties', 'additionalProperties', 'required', 'items', 'minItems', 'maxItems',
  'minimum', 'maximum', 'multipleOf', 'enum', 'default', 'title', 'description', 'format', 'maxLength', 'step',
  'x-immutable', 'x-json', 'x-filter', 'x-order', 'x-hidden'])
const COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

const at = (path) => (path.length ? path.join('.') : '(root)')

// Plain-JSON check: finite numbers, no functions/undefined, bounded depth.
export function checkJSON (v, path = [], problems = [], depth = 0) {
  if (depth > 24) { problems.push(`${at(path)}: nested too deep`); return problems }
  const p = plain(v)
  if (p === null || typeof p === 'boolean') return problems
  if (typeof p === 'string') { if (p.length > 20000) problems.push(`${at(path)}: string longer than 20000`); return problems }
  if (typeof p === 'number') { if (!Number.isFinite(p)) problems.push(`${at(path)}: non-finite number`); return problems }
  if (Array.isArray(p)) { p.forEach((x, i) => checkJSON(x, [...path, i], problems, depth + 1)); return problems }
  if (typeof p === 'object' && Object.getPrototypeOf(p) === Object.prototype) {
    for (const [k, x] of Object.entries(p)) {
      if (x === undefined) problems.push(`${at([...path, k])}: undefined is not storable`)
      else checkJSON(x, [...path, k], problems, depth + 1)
    }
    return problems
  }
  problems.push(`${at(path)}: not plain JSON (${typeof p})`)
  return problems
}

function typeOk (t, v) {
  switch (t) {
    case 'number': return typeof v === 'number' && Number.isFinite(v)
    case 'integer': return Number.isInteger(v)
    case 'string': return typeof v === 'string'
    case 'boolean': return typeof v === 'boolean'
    case 'array': return Array.isArray(v)
    case 'object': return isObj(v)
    case 'null': return v === null
    default: return true
  }
}

function validateValue (schema, value, path, problems, opts) {
  if (!isObj(schema)) return
  const v = plain(value)
  if (v === null && opts.partial && path.length > 0) return // null deletes a field in a set patch
  if (schema['x-json']) { checkJSON(v, path, problems); return }
  if (schema['x-filter']) { for (const p of validateFilter(v, opts.defs)) problems.push(`${at(path)}: ${p}`); return }
  if (Array.isArray(schema.enum)) {
    if (!schema.enum.some((e) => plain(e) === v)) problems.push(`${at(path)}: must be one of ${schema.enum.map((e) => JSON.stringify(plain(e))).join(', ')}`)
    return
  }
  const types = schema.type == null ? [] : Array.isArray(schema.type) ? schema.type.map(String) : [String(schema.type)]
  if (types.length > 1) {
    // union: valid if any single-type variant validates cleanly
    const ok = types.some((t) => { const sub = []; validateValue({ ...schema, type: t }, v, path, sub, opts); return sub.length === 0 })
    if (!ok) problems.push(`${at(path)}: expected ${types.join(' | ')}`)
    return
  }
  const t = types[0]
  if (t && !typeOk(t, v)) { problems.push(`${at(path)}: expected ${t}, got ${v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v}`); return }
  if (typeof v === 'number') {
    if (schema.minimum != null && v < schema.minimum) problems.push(`${at(path)}: ${v} < minimum ${schema.minimum}`)
    if (schema.maximum != null && v > schema.maximum) problems.push(`${at(path)}: ${v} > maximum ${schema.maximum}`)
  }
  if (typeof v === 'string') {
    if (schema.maxLength != null && v.length > schema.maxLength) problems.push(`${at(path)}: longer than ${schema.maxLength}`)
    if (String(schema.format ?? '') === 'color' && !COLOR_RE.test(v)) problems.push(`${at(path)}: expected a #rrggbb colour`)
  }
  if (Array.isArray(v)) {
    if (schema.minItems != null && v.length < schema.minItems) problems.push(`${at(path)}: fewer than ${schema.minItems} items`)
    if (schema.maxItems != null && v.length > schema.maxItems) problems.push(`${at(path)}: more than ${schema.maxItems} items`)
    // array elements are always validated in full: a set writes an array element whole
    if (isObj(schema.items)) v.forEach((x, i) => validateValue(schema.items, x, [...path, i], problems, { ...opts, partial: false }))
    else checkJSON(v, path, problems)
  }
  if (isObj(v)) {
    const props = isObj(schema.properties) ? schema.properties : {}
    for (const [k, x] of Object.entries(v)) {
      if (props[k]) validateValue(props[k], x, [...path, k], problems, opts)
      else if (schema.additionalProperties === false) problems.push(`${at([...path, k])}: unknown field`)
      else if (isObj(schema.additionalProperties)) validateValue(schema.additionalProperties, x, [...path, k], problems, opts)
      else checkJSON(x, [...path, k], problems)
    }
    if (!opts.partial && Array.isArray(schema.required)) for (const r of schema.required) if (!(String(r) in v)) problems.push(`${at([...path, String(r)])}: required`)
  }
}

// def: a component def { schema, ... } or a bare schema. opts.partial: a `set`
// patch (no required check, null deletes). opts.defs: component defs for filters.
export function validateComponent (def, data, opts = {}) {
  const problems = []
  const schema = isObj(def?.schema) ? def.schema : (isObj(def) && (def.type || def.properties) ? def : null)
  const o = { partial: !!opts.partial, defs: opts.defs }
  if (!schema) { checkJSON(data, [], problems); return problems }
  validateValue(plain(schema), data, [], problems, o)
  return problems
}

// Is this a well-formed schema of the supported subset?
export function validateSchema (schema, path = []) {
  const problems = []
  const s = plain(schema)
  if (!isObj(s)) return [`${at(path)}: schema must be an object`]
  for (const k of Object.keys(s)) if (!SCHEMA_KEYS.has(k)) problems.push(`${at(path)}: unsupported schema keyword "${k}"`)
  const types = s.type == null ? [] : Array.isArray(s.type) ? s.type : [s.type]
  for (const t of types) if (!SCHEMA_TYPES.has(t)) problems.push(`${at(path)}: unsupported type "${t}"`)
  if (s.enum != null && !Array.isArray(s.enum)) problems.push(`${at(path)}: enum must be an array`)
  if (s.properties != null) {
    if (!isObj(s.properties)) problems.push(`${at(path)}: properties must be an object`)
    else for (const [k, p] of Object.entries(s.properties)) problems.push(...validateSchema(p, [...path, k]))
  }
  if (isObj(s.items)) problems.push(...validateSchema(s.items, [...path, '[]']))
  if (isObj(s.additionalProperties)) problems.push(...validateSchema(s.additionalProperties, [...path, '*']))
  for (const k of ['minimum', 'maximum', 'minItems', 'maxItems', 'maxLength', 'multipleOf']) if (s[k] != null && !Number.isFinite(s[k])) problems.push(`${at(path)}: ${k} must be a number`)
  return problems
}

const nameList = (v, key, problems, defs, kind) => {
  const list = typeof v === 'string' ? [v] : v
  if (!Array.isArray(list)) { problems.push(`${key}: expected a name or a list of names`); return }
  for (const n of list) {
    if (!isName(n)) problems.push(`${key}: bad ${kind} name ${JSON.stringify(n)}`)
    else if (kind === 'component' && defs && Object.keys(defs).length && !(n in defs)) problems.push(`${key}: unknown component "${n}" (define it first)`)
  }
}

function validatePath (path, key, problems, defs) {
  if (!Array.isArray(path) || !path.length || !path.every((p) => typeof p === 'string' || Number.isInteger(p))) { problems.push(`${key}.path: expected a non-empty list of keys`); return }
  const root = path[0]
  if (typeof root === 'string' && root.startsWith('$')) { if (!PSEUDO_ROOTS.includes(root)) problems.push(`${key}.path: unknown root "${root}" (one of ${PSEUDO_ROOTS.join(', ')})`); return }
  if (!isName(root)) problems.push(`${key}.path: bad component name ${JSON.stringify(root)}`)
  else if (defs && Object.keys(defs).length && !(root in defs)) problems.push(`${key}.path: unknown component "${root}"`)
}

// Structured filter (design §3.3). No string path language: paths are key lists.
export function validateFilter (filter, componentDefs, depth = 0) {
  const problems = []
  const f = plain(filter)
  if (f == null) return problems
  if (!isObj(f)) return ['filter must be an object']
  if (depth > 6) return ['filter nested too deep']
  const defs = componentDefs ? plain(componentDefs) : null
  for (const k of Object.keys(f)) if (!FILTER_KEYS.includes(k)) problems.push(`unknown filter key "${k}" (one of ${FILTER_KEYS.join(', ')})`)
  for (const k of ['tags', 'anyTags', 'notTags']) if (f[k] != null) nameList(f[k], k, problems, defs, 'tag')
  for (const k of ['has', 'not']) if (f[k] != null) nameList(f[k], k, problems, defs, 'component')
  for (const k of ['relation', 'notRelation']) {
    if (f[k] == null) continue
    const list = Array.isArray(f[k]) ? f[k] : [f[k]]
    for (const r of list) if (!RELATION_NAMES.includes(r)) problems.push(`${k}: unknown relation ${JSON.stringify(r)} (one of ${RELATION_NAMES.join(', ')})`)
  }
  if (f.where != null) {
    if (!Array.isArray(f.where)) problems.push('where: expected a list of clauses')
    else f.where.forEach((w, i) => {
      const key = `where[${i}]`
      if (!isObj(w)) { problems.push(`${key}: expected {path, lt|lte|gt|gte|eq|ne}`); return }
      validatePath(w.path, key, problems, defs)
      if (w.of != null && w.of !== 'self' && w.of !== 'other') problems.push(`${key}.of: 'self' or 'other'`)
      const ops = WHERE_OPS.filter((o) => o in w)
      if (ops.length !== 1) problems.push(`${key}: exactly one of ${WHERE_OPS.join(', ')}`)
      for (const k of Object.keys(w)) if (!['path', 'of', ...WHERE_OPS].includes(k)) problems.push(`${key}: unknown key "${k}"`)
      for (const o of ops) {
        const v = w[o]
        if (isObj(v)) {
          validatePath(v.path, `${key}.${o}`, problems, defs)
          if (v.of != null && v.of !== 'self' && v.of !== 'other') problems.push(`${key}.${o}.of: 'self' or 'other'`)
          if (v.mul != null && !Number.isFinite(v.mul)) problems.push(`${key}.${o}.mul: number`)
        } else if (!['number', 'string', 'boolean'].includes(typeof v) || (typeof v === 'number' && !Number.isFinite(v))) problems.push(`${key}.${o}: a number, string, boolean or {path, of?, mul?}`)
      }
    })
  }
  if (f.any != null) {
    if (!Array.isArray(f.any) || !f.any.length) problems.push('any: expected a non-empty list of filters')
    else f.any.forEach((g, i) => { for (const p of validateFilter(g, componentDefs, depth + 1)) problems.push(`any[${i}].${p}`) })
  }
  return problems
}

export function validateSystemMeta ({ order, enabled } = {}) {
  const problems = []
  if (order !== undefined && (typeof order !== 'number' || !Number.isFinite(order) || Math.abs(order) > 1e6)) problems.push('order: a finite number within ±1e6')
  if (enabled !== undefined && typeof enabled !== 'boolean') problems.push('enabled: a boolean')
  return problems
}
