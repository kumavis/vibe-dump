// The rig inspector (design §17.5, ARCHITECTURE §6.3): rendered inside the
// representation card of a `rig` look. Model dropdown, Fork, the model's three
// layers as JSON boxes (nodes, animations, controller), a preview-state
// selector. Edits of a model-backed look redefine THAT model (every instance
// updates); edits of an inline look `set` the field on the entity. Every edit
// is validated with track A's validateModel first and its problems are shown
// beside the box; nothing invalid reaches the write path. The op shapes live in
// rig-ops.js (tested in Node).
import { h, hasFocusWithin } from './dom.js'
import { resolveModel as defaultResolve, validateModel as defaultValidate, validateInline as defaultValidateInline } from '../doc/models.js'
import { RIG_INLINE } from './kind-switcher.js'
import { PREVIEW_STATES, forkOps, rigFieldOps, setModelOps, uniqueModelName } from './rig-ops.js'

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const pretty = (v) => (v === undefined ? '' : JSON.stringify(v, null, 1))
const problemText = (e) => (Array.isArray(e?.problems) && e.problems.length ? e.problems.map(String).join('\n') : String(e?.message ?? e))
const FIELD_HINT = {
  nodes: 'nodes: [{name, shape, p, r, s, color, anchor, children}] — a named node is a bone',
  animations: 'animations: {clip: {loop, once, tracks: {"node.rx": "sin(phase*tau)*30" | [[t, v], …]}}}',
  controller: 'controller: {states: {idle, walk, run, attack, die, sit: clip | [clips]}, blend}',
}

// ctx: { doc(), read, write(ops, message, opts), toast?, resolveModel?, validateModel?, validateInline? }
// opts: { id, rep (effective representation), inherited (the preset's look), preview: { get() -> state, set(state) } }
export function makeRigPanel (ctx, { id, rep, inherited, preview } = {}) {
  const resolveModel = ctx.resolveModel ?? defaultResolve
  const validateModel = ctx.validateModel ?? defaultValidate
  // an inline look is checked the way the write path checks it (lenient nodes: an old tree stays editable)
  const validateInline = ctx.validateInline ?? defaultValidateInline
  const models = () => ctx.read.plain(ctx.doc()?.models ?? {})
  const all = models()
  const names = Object.keys(all).sort()
  const name = rep?.model ? String(rep.model) : ''
  const own = name && Object.hasOwn(all, name) && isObj(all[name]) ? all[name] : null
  let resolved = null; let resolveError = null
  if (name && own) { try { resolved = resolveModel(all, name) } catch (e) { resolveError = problemText(e) } }
  if (!name) resolved = { nodes: rep?.nodes ?? [], animations: rep?.animations ?? {}, controller: rep?.controller ?? {} }

  const el = h('div', { class: 'rig-panel' })
  const write = (ops, msg, opts) => ctx.write(ops, msg, opts)

  // ---- model dropdown
  const msel = h('select', { class: 'rig-model', title: 'the model this look references (inline: nodes stored on the entity)' })
  msel.add(new Option('(inline)', '', false, !name))
  if (name && !own) { const o = new Option(`${name} (missing)`, name, false, true); o.disabled = true; msel.add(o) }
  for (const n of names) msel.add(new Option(n, n, false, n === name))
  msel.addEventListener('change', () => {
    const next = msel.value
    if (next === name) return
    write(setModelOps(id, rep, next, { resolved }), next ? `rig model → ${next}` : 'rig → inline')
  })

  // ---- fork: copy the resolved model under a new name and point at it
  const forkName = h('input', { class: 'rig-fork-name', spellcheck: false, value: uniqueModelName(name || 'model', names), title: 'name of the copy' })
  const forkBtn = h('button', {
    class: 'small', type: 'button', title: 'copy this model (extends flattened) into the library under the new name and use it here',
    onclick: () => {
      const n = forkName.value.trim()
      if (!/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(n)) { setStatus(`"${n}" is not a valid model name`); return }
      if (names.includes(n)) { setStatus(`a model named ${n} exists`); return }
      if (!resolved) { setStatus('nothing to fork: the model does not resolve'); return }
      const out = write(forkOps(id, rep, n, resolved, { inherited }), `fork model ${name || 'inline'} → ${n}`, { quiet: true, onError: (e) => setStatus(problemText(e)) })
      if (out) ctx.toast?.(`Forked ${name || 'inline rig'} as ${n}`)
    },
  }, 'Fork')
  const status = h('pre', { class: 'error-text rig-status', hidden: true })
  const setStatus = (t) => { status.textContent = t ?? ''; status.hidden = !t }

  const info = h('div', { class: 'muted small rig-info' },
    name && own ? `${own.extends ? `extends ${own.extends} · ` : ''}rev ${Number(own.rev ?? 0)} · ` : '',
    resolved ? `${countNodes(resolved.nodes)} nodes · clips: ${Object.keys(resolved.animations ?? {}).sort().join(', ') || '—'}` : '')
  if (name && !own) setStatus(`no model "${name}" in this world: the look renders a placeholder`)
  else if (resolveError) setStatus(resolveError)

  // ---- the three layers, as JSON boxes over the model's OWN fields (patches when it extends)
  const source = name ? own : rep
  const boxes = RIG_INLINE.map((field) => jsonBox(field, source?.[field]))
  function jsonBox (field, value) {
    const ta = h('textarea', { class: 'json rig-json', rows: field === 'controller' ? 4 : 8, spellcheck: false, dataset: { field } })
    ta.value = pretty(value)
    const err = h('pre', { class: 'error-text', hidden: true })
    const commit = () => {
      const text = ta.value.trim()
      let v
      try { v = text ? JSON.parse(text) : undefined } catch (e) { err.textContent = `not JSON: ${e.message}`; err.hidden = false; return }
      if (JSON.stringify(v) === JSON.stringify(value)) { err.hidden = true; return }
      const target = name ? { model: name, own } : { inline: true, rep }
      const { candidate, ops } = rigFieldOps(id, target, field, v ?? (field === 'nodes' ? [] : {}))
      let problems = []
      try { problems = (name ? validateModel(candidate, models(), { name }) : validateInline(candidate, models())) ?? [] } catch (e) { problems = [problemText(e)] }
      if (problems.length) { err.textContent = problems.map(String).join('\n'); err.hidden = false; return }
      const ok = write(ops, `${name ? `model ${name}` : 'rig'}.${field}`, { quiet: true, onError: (e) => { err.textContent = problemText(e); err.hidden = false } })
      if (ok) err.hidden = true
    }
    ta.addEventListener('change', commit)
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); commit() } })
    const scope = name ? (own?.extends ? `model ${name} (own: patches ${own.extends} by node name)` : `model ${name} — every instance`) : 'this entity'
    return h('div', { class: 'sf-row sf-json' }, h('span', { class: 'sf-label', title: FIELD_HINT[field] }, field), h('div', { class: 'sf-col' }, h('div', { class: 'muted small' }, scope), ta, err))
  }

  const resolvedView = name && resolved && own?.extends
    ? h('details', { class: 'rig-resolved' }, h('summary', { class: 'muted small' }, 'resolved model (read-only)'), h('pre', { class: 'json small' }, pretty(resolved)))
    : null

  // ---- preview state: forces live.anim on the selected entity (the reconciler's preview)
  const psel = h('select', { class: 'rig-preview', title: 'play a state on this entity without the sim' })
  const cur = preview?.get?.() ?? ''
  psel.add(new Option('off (sim)', '', false, !cur))
  for (const s of PREVIEW_STATES) psel.add(new Option(s, s, false, s === cur))
  psel.addEventListener('change', () => preview?.set?.(psel.value))

  el.append(
    h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'model'), msel),
    h('div', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'fork'), h('span', { class: 'row' }, forkName, forkBtn)),
    info, status, ...boxes, resolvedView,
    h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'preview'), psel))
  return { el, busy: () => hasFocusWithin(el) }
}

function countNodes (nodes) {
  let n = 0
  const walk = (list) => { for (const x of Array.isArray(list) ? list : []) { n++; walk(x?.children) } }
  walk(nodes)
  return n
}
