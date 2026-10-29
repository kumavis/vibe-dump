// Schema-driven inspector forms (design §7.4, §10), adopted from spike S4's
// schema-form.js and research/runtime-extensibility. Two halves:
//   objectModel(schema, value) — pure: JSON-Schema subset -> field descriptors
//                                with patch paths (tested in Node)
//   renderForm(container, { schema, value, onPatch }) — those descriptors -> DOM
// onPatch(path, value) is a FIELD edit; the inspector turns it into a `set`
// (field merge), never a replace. Vector elements patch by index so two
// people dragging different axes both win. `x-immutable` strings are written
// whole on commit (they are ImmutableStrings, never spliced text); `x-json`
// (and filters, arrays of objects) are a JSON box written whole on valid JSON.
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const clone = (v) => (v == null || typeof v !== 'object' ? v : JSON.parse(JSON.stringify(v)))
const SLIDER_SPAN = 100

export function inferSchema (v) {
  if (typeof v === 'number') return { type: 'number' }
  if (typeof v === 'boolean') return { type: 'boolean' }
  if (typeof v === 'string') return /^#[0-9a-f]{6}$/i.test(v) ? { type: 'string', format: 'color' } : { type: 'string' }
  if (Array.isArray(v)) {
    if (v.length >= 2 && v.length <= 4 && v.every((x) => typeof x === 'number')) return { type: 'array', items: { type: 'number' }, minItems: v.length, maxItems: v.length }
    if (v.every((x) => typeof x === 'number')) return { type: 'array', items: { type: 'number' } }
    if (v.every((x) => typeof x === 'string')) return { type: 'array', items: { type: 'string' } }
    return { 'x-json': true }
  }
  if (isObj(v)) return { type: 'object', properties: Object.fromEntries(Object.keys(v).sort().map((k) => [k, inferSchema(v[k])])) }
  return { 'x-json': true }
}

export function defaultFor (schema) {
  if (!isObj(schema)) return null
  if (schema.default !== undefined) return clone(schema.default)
  if (Array.isArray(schema.enum)) return clone(schema.enum[0] ?? null)
  switch (schema.type) {
    case 'number': case 'integer': return schema.minimum ?? 0
    case 'boolean': return true // the common map-of-true set (tags)
    case 'string': return schema.format === 'color' ? '#ffffff' : ''
    case 'array': return schema.minItems && schema.items?.type === 'number' ? new Array(schema.minItems).fill(0) : []
    case 'object': {
      const o = {}
      for (const [k, p] of Object.entries(schema.properties ?? {})) { const d = defaultFor(p); if (d !== null && (p.default !== undefined || (schema.required ?? []).includes(k))) o[k] = d }
      return o
    }
    default: return null
  }
}

function field (key, p, val, path) {
  const base = { key, path, label: String(p.title ?? key), description: p.description ?? null, value: val === undefined ? clone(p.default) : clone(val), inherited: val === undefined }
  if (p['x-json'] || p['x-filter']) return { ...base, widget: 'json', filter: !!p['x-filter'] }
  if (Array.isArray(p.enum)) return { ...base, widget: 'select', options: p.enum.map(String), value: base.value == null ? null : String(base.value), immutable: !!p['x-immutable'] }
  const type = Array.isArray(p.type) ? null : p.type ?? (val === undefined ? null : inferSchema(val).type)
  switch (type) {
    case 'boolean': return { ...base, widget: 'checkbox', value: !!base.value }
    case 'number': case 'integer': {
      const min = p.minimum ?? null; const max = p.maximum ?? null
      return { ...base, widget: 'number', integer: type === 'integer', min, max, step: p.step ?? p.multipleOf ?? (type === 'integer' ? 1 : 'any'), slider: min != null && max != null && max - min <= SLIDER_SPAN }
    }
    case 'string':
      if (String(p.format ?? '') === 'color') return { ...base, widget: 'color', value: typeof base.value === 'string' ? base.value : '#ffffff' }
      return { ...base, widget: 'text', immutable: !!p['x-immutable'], value: base.value == null ? '' : String(base.value) }
    case 'array': {
      const it = p.items?.type
      if (it === 'number' && p.minItems != null && p.minItems === p.maxItems && p.minItems <= 4) {
        const v = Array.isArray(base.value) ? base.value : new Array(p.minItems).fill(0)
        return { ...base, widget: 'vec', value: v, items: v.map((x, i) => ({ path: [...path, i], value: x })) }
      }
      if (it === 'number' || it === 'string') return { ...base, widget: 'list', itemType: it, value: Array.isArray(base.value) ? base.value : [] }
      return { ...base, widget: 'json' }
    }
    case 'object':
      if (isObj(p.properties) || isObj(p.additionalProperties) || p.additionalProperties === true) return { ...base, widget: 'object', children: objectModel(p, isObj(val) ? val : isObj(p.default) ? p.default : {}, path) }
      return { ...base, widget: 'json' }
    default:
      return { ...base, widget: 'json' }
  }
}

// An object node: declared properties (schema order), then map entries (an
// object-valued additionalProperties, e.g. brain.drives or tags), then keys the
// value has but the schema does not declare, so nothing stored is hidden.
// `add` is set when new keys may be added (and what a new entry looks like).
export function objectModel (schema, value, path = []) {
  const s = isObj(schema) && (schema.properties || schema.additionalProperties !== undefined || schema.type) ? schema : inferSchema(value ?? {})
  const v = isObj(value) ? value : {}
  const props = isObj(s.properties) ? s.properties : {}
  const fields = []
  for (const [k, p] of Object.entries(props)) {
    if (!isObj(p) || p['x-hidden']) continue
    fields.push(field(k, p, v[k], [...path, k]))
  }
  const addl = s.additionalProperties
  for (const k of Object.keys(v).sort()) {
    if (k in props) continue
    if (addl === false) continue
    if (isObj(addl) && addl['x-hidden']) continue
    const p = isObj(addl) ? addl : inferSchema(v[k])
    fields.push({ ...field(k, p, v[k], [...path, k]), removable: true })
  }
  const add = addl === false ? null : { path, itemSchema: isObj(addl) ? addl : null }
  return { fields, add: isObj(addl) && !addl['x-hidden'] ? add : null }
}

export const fieldModel = (schema, value) => objectModel(schema, value, [])

// ---------------------------------------------------------------- DOM

const el = (tag, cls, props) => { const e = document.createElement(tag); if (cls) e.className = cls; if (props) for (const [k, v] of Object.entries(props)) e[k] = v; return e }

// leading + trailing throttle, so a slider drag writes at most every `ms`
function throttle (fn, ms) {
  let last = 0; let timer = null; let pending = null
  const run = (...a) => {
    const t = Date.now()
    pending = a
    if (t - last >= ms) { last = t; pending = null; fn(...a); return }
    if (!timer) timer = setTimeout(() => { timer = null; last = Date.now(); if (pending) { const p = pending; pending = null; fn(...p) } }, ms - (t - last))
  }
  // a commit supersedes a trailing live write of the same field
  run.cancel = () => { pending = null; if (timer) { clearTimeout(timer); timer = null } }
  return run
}

function numberParse (f, raw) {
  let n = f.integer ? parseInt(raw, 10) : parseFloat(raw)
  if (!Number.isFinite(n)) return null
  if (f.min != null) n = Math.max(f.min, n)
  if (f.max != null) n = Math.min(f.max, n)
  return n
}

function input (f, emit, emitLive) {
  const at = f.path.join('.')
  switch (f.widget) {
    case 'checkbox': {
      const i = el('input', null, { type: 'checkbox', checked: !!f.value })
      i.addEventListener('change', () => emit(f.path, i.checked))
      i.dataset.path = at; return i
    }
    case 'select': {
      const s = el('select')
      if (f.value == null || !f.options.includes(f.value)) s.add(new Option('—', '', true, true))
      for (const o of f.options) s.add(new Option(o, o, false, o === f.value))
      s.addEventListener('change', () => { if (s.value !== '') emit(f.path, s.value) })
      s.dataset.path = at; return s
    }
    case 'number': {
      const wrap = el('span', 'num')
      const n = el('input', null, { type: 'number', value: f.value ?? '', step: String(f.step) })
      if (f.min != null) n.min = String(f.min)
      if (f.max != null) n.max = String(f.max)
      n.dataset.path = at
      const commit = (raw, live) => { const v = numberParse(f, raw); if (v === null) { n.classList.add('invalid'); return } n.classList.remove('invalid'); (live ? emitLive : emit)(f.path, v) }
      n.addEventListener('change', () => commit(n.value, false))
      if (f.slider) {
        const r = el('input', null, { type: 'range', min: String(f.min), max: String(f.max), step: String(f.step === 'any' ? (f.max - f.min) / 200 : f.step), value: f.value ?? f.min })
        r.addEventListener('input', () => { n.value = r.value; commit(r.value, true) })
        n.addEventListener('input', () => { r.value = n.value })
        wrap.append(r)
      }
      wrap.append(n); return wrap
    }
    case 'color': {
      const c = el('input', null, { type: 'color', value: /^#[0-9a-f]{6}$/i.test(f.value) ? f.value : '#ffffff' })
      c.addEventListener('input', () => emitLive(f.path, c.value))
      c.addEventListener('change', () => emit(f.path, c.value))
      c.dataset.path = at; return c
    }
    case 'vec': {
      const wrap = el('span', 'vec')
      for (const it of f.items) {
        const n = el('input', null, { type: 'number', value: it.value, step: 'any' })
        n.dataset.path = it.path.join('.')
        n.addEventListener('change', () => { const v = parseFloat(n.value); if (Number.isFinite(v)) { n.classList.remove('invalid'); emit(it.path, v) } else n.classList.add('invalid') })
        wrap.append(n)
      }
      return wrap
    }
    case 'list': {
      const i = el('input', null, { value: (f.value ?? []).join(', '), placeholder: 'a, b, c' })
      i.addEventListener('change', () => {
        const parts = i.value.split(',').map((s) => s.trim()).filter(Boolean)
        emit(f.path, f.itemType === 'number' ? parts.map(Number).filter(Number.isFinite) : parts)
      })
      i.dataset.path = at; return i
    }
    case 'text': {
      const i = el('input', null, { value: f.value ?? '', spellcheck: false })
      if (f.immutable) i.title = 'written whole on Enter / blur'
      i.addEventListener('change', () => emit(f.path, i.value))
      i.dataset.path = at; return i
    }
    default: { // json
      // unset shows empty (not "null"); clearing the box deletes the field
      const t = el('textarea', 'json', { value: f.value == null ? '' : JSON.stringify(f.value, null, typeof f.value === 'object' && JSON.stringify(f.value).length > 40 ? 1 : 0), spellcheck: false, rows: 1, placeholder: f.filter ? '{ "tags": ["prey"] }' : 'JSON' })
      t.rows = Math.min(8, Math.max(1, t.value.split('\n').length))
      t.addEventListener('change', () => {
        let v
        try { v = t.value.trim() === '' ? null : JSON.parse(t.value) } catch (e) { t.classList.add('invalid'); t.title = String(e.message); return }
        t.classList.remove('invalid'); t.title = ''
        emit(f.path, v)
      })
      t.dataset.path = at; return t
    }
  }
}

function renderFields (box, model, emit, emitLive) {
  for (const f of model.fields) {
    if (f.widget === 'object') {
      const d = el('details', 'sf-object'); d.open = f.children.fields.length <= 4
      const s = el('summary'); s.textContent = f.label
      if (f.removable) s.append(removeButton(f, emit))
      d.append(s)
      const inner = el('div', 'sf')
      renderFields(inner, f.children, emit, emitLive)
      d.append(inner); box.append(d)
      continue
    }
    const row = el('label', `sf-row${f.inherited ? ' inherited' : ''}`)
    const name = el('span', 'sf-label'); name.textContent = f.label
    if (f.description) name.title = f.description
    row.append(name, input(f, emit, emitLive))
    if (f.removable) row.append(removeButton(f, emit))
    box.append(row)
  }
  if (model.add) box.append(addRow(model.add, emit))
}

function removeButton (f, emit) {
  const b = el('button', 'icon sf-remove', { type: 'button', textContent: '×', title: `remove ${f.key}` })
  b.addEventListener('click', (ev) => { ev.preventDefault(); emit(f.path, null) })
  return b
}

const KEY_RE = /^[A-Za-z_][A-Za-z0-9_-]{0,63}$/
function addRow ({ path, itemSchema }, emit) {
  const row = el('div', 'sf-add')
  const k = el('input', null, { placeholder: 'new key', spellcheck: false })
  const b = el('button', 'small', { type: 'button', textContent: 'add' })
  const go = () => {
    const key = k.value.trim()
    if (!KEY_RE.test(key)) { k.classList.add('invalid'); return }
    k.classList.remove('invalid')
    emit([...path, key], itemSchema ? defaultFor(itemSchema) ?? true : true)
    k.value = ''
  }
  b.addEventListener('click', go)
  k.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go() } })
  row.append(k, b)
  return row
}

// renders into `container` (replacing its content); returns the model it drew
export function renderForm (container, { schema, value, onPatch, liveMs = 100 }) {
  container.replaceChildren()
  container.classList.add('sf')
  const model = objectModel(schema, value, [])
  const live = new Map() // one throttle per path, so two sliders never starve each other
  const emit = (path, v) => { live.get(path.join('.'))?.cancel?.(); onPatch(path, v, { live: false }) }
  const emitLive = (path, v) => {
    const k = path.join('.')
    if (!live.has(k)) live.set(k, throttle((p, x) => onPatch(p, x, { live: true }), liveMs))
    live.get(k)(path, v)
  }
  renderFields(container, model, emit, emitLive)
  return model
}
