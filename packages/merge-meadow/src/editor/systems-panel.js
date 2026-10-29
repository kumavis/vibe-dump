// Systems tab (design §7, §10): doc systems with their LOCAL status (ok /
// error / suspended / not running: status is never written to the doc), a
// source editor whose Apply is one defineSystem op (ops.js edits the Text with
// updateText, so two people editing one system merge by characters), Revert,
// order / enabled, errors inline, and "Run systems anyway" in safe mode.
import { h, hasFocusWithin } from './dom.js'

export const TEMPLATE = `// Runs on every peer; writes only what this peer owns.
export default {
  init (world, hot) {
    hot.data.t = hot.prev.t ?? 0 // survives hot-swaps
  },
  update (world, dt) {
    for (const e of world.query('tags', 'transform')) {
      if (!e.owned) continue
      // e.c is frozen doc data; e.live is this peer's runtime state
    }
  },
}
`
const NAME_RE = /^[A-Za-z_][A-Za-z0-9_-]{0,63}$/

export function statusOf (s, { running = true } = {}) {
  if (!s) return { cls: 'unknown', text: 'not compiled yet' }
  if (!running) return { cls: 'off', text: 'systems are off in this tab' }
  if (s.suspended) return { cls: 'error', text: `suspended after ${s.errors} errors` }
  if (s.lastError && !s.ok) return { cls: 'error', text: s.lastError }
  if (!s.enabled) return { cls: 'off', text: 'disabled' }
  if (s.ok) return { cls: 'ok', text: `ok${s.compileMs != null ? ` · compiled in ${s.compileMs} ms` : ''}` }
  return { cls: 'unknown', text: 'not running' }
}

// ctx: { doc(), read, systemHost, write(ops, msg) -> bool, safe: { active(), reason(), runAnyway() }, toast }
export function makeSystemsPanel (ctx) {
  let selected = null; let draft = null; let baseSource = null; let applyError = ''
  const list = h('div', { class: 'sys-list' })
  const off = h('div', { class: 'notice', hidden: true })
  const newName = h('input', { placeholder: 'new system name', spellcheck: false })
  const newRow = h('div', { class: 'row' }, newName, h('button', { class: 'small', type: 'button', onclick: () => create() }, 'new'))
  newName.addEventListener('keydown', (e) => { if (e.key === 'Enter') create() })
  const src = h('textarea', { class: 'code', spellcheck: false, rows: 14 })
  const err = h('pre', { class: 'error-text', hidden: true })
  const stale = h('div', { class: 'notice', hidden: true }, 'Changed elsewhere since you started editing. ', h('button', { class: 'small', type: 'button', onclick: () => revert() }, 'load theirs'))
  const title = h('h4')
  const applyBtn = h('button', { class: 'primary', type: 'button', title: 'Ctrl/Cmd-Enter', onclick: () => apply() }, 'Apply')
  const revertBtn = h('button', { type: 'button', onclick: () => revert() }, 'Revert')
  const delBtn = h('button', { class: 'danger', type: 'button', onclick: () => remove() }, 'Delete')
  const editor = h('div', { class: 'sys-editor', hidden: true }, title, stale, src, err, h('div', { class: 'row btns' }, applyBtn, revertBtn, delBtn))
  const el = h('div', { class: 'systems' }, off, list, newRow, editor)

  src.addEventListener('input', () => { draft = src.value; mark() })
  src.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); apply() }
    else if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const a = src.selectionStart; src.setRangeText('  ', a, src.selectionEnd, 'end'); draft = src.value; mark() }
  })

  const docSystem = (name) => ctx.read.systemData(ctx.doc(), name)
  const mark = () => { const dirty = draft != null && draft !== baseSource; applyBtn.disabled = !dirty && !applyError; title.textContent = `${selected}${dirty ? ' •' : ''}` }

  function create () {
    const name = newName.value.trim()
    if (!NAME_RE.test(name)) { newName.classList.add('invalid'); ctx.toast('System names are letters, digits, - and _', 'warn'); return }
    newName.classList.remove('invalid')
    if (docSystem(name)) { select(name); return }
    if (ctx.write([{ op: 'defineSystem', name, source: TEMPLATE, order: 950, enabled: true }], `new system ${name}`)) { newName.value = ''; select(name) }
  }

  function apply () {
    if (!selected) return
    const cur = docSystem(selected)
    const source = draft ?? cur?.source ?? ''
    const ok = ctx.write([{ op: 'defineSystem', name: selected, source, ...(cur ? { order: cur.order, enabled: cur.enabled } : {}) }], `edit system ${selected}`, { quiet: true, onError: (e) => { applyError = String(e?.message ?? e).replace(/^invalid ops:\s*/, ''); showErr() } })
    if (ok) { applyError = ''; baseSource = source; draft = null; showErr() }
    render()
  }
  function revert () { const cur = docSystem(selected); baseSource = cur?.source ?? ''; draft = null; src.value = baseSource; applyError = ''; showErr(); stale.hidden = true; mark() }
  function remove () { if (selected && ctx.write([{ op: 'removeSystem', name: selected }], `remove system ${selected}`)) select(null) }
  function showErr () { const s = ctx.systemHost?.status().find((x) => x.name === selected); const text = applyError || (s && !s.ok && s.lastError ? s.lastError : ''); err.hidden = !text; err.textContent = text }

  function select (name) {
    selected = name; draft = null; applyError = ''
    const cur = name ? docSystem(name) : null
    editor.hidden = !cur
    baseSource = cur?.source ?? ''
    src.value = baseSource
    stale.hidden = true
    showErr(); mark(); render()
  }

  function render () {
    const summary = ctx.read.docSummary(ctx.doc())
    const status = new Map((ctx.systemHost?.status() ?? []).map((s) => [s.name, s]))
    const running = ctx.systemHost?.enabled !== false
    const disabledInWorld = summary.world?.disabledSystems ?? {}
    off.hidden = running
    if (!running) {
      off.replaceChildren(h('strong', null, 'Doc systems are not running in this tab. '), ctx.safe?.reason?.() ?? '', ' ',
        ctx.safe?.canRun?.() !== false ? h('button', { class: 'small primary', type: 'button', onclick: () => ctx.safe?.runAnyway?.() }, 'Run systems anyway') : null)
    }
    if (hasFocusWithin(list)) return
    list.replaceChildren(...(summary.systems.length ? summary.systems : []).map((s) => {
      const st = statusOf(status.get(s.name), { running })
      const inWorldOff = !!disabledInWorld[s.name]
      return h('div', { class: `sys${s.name === selected ? ' selected' : ''}`, dataset: { name: s.name }, onclick: (e) => { if (!e.target.closest('input')) select(s.name) } },
        h('span', { class: `dot ${inWorldOff ? 'off' : st.cls}`, title: st.text }),
        h('span', { class: 'name' }, s.name),
        h('input', { class: 'order', type: 'number', value: s.order, step: 10, title: 'order (built-ins: 0-1100, doc default 950)', onchange: (e) => { const v = Number(e.target.value); if (Number.isFinite(v)) ctx.write([{ op: 'setSystem', name: s.name, patch: { order: v } }], `order ${s.name}`) } }),
        h('input', { type: 'checkbox', checked: s.enabled, title: 'enabled (for everyone)', onchange: (e) => ctx.write([{ op: 'setSystem', name: s.name, patch: { enabled: e.target.checked } }], `${e.target.checked ? 'enable' : 'disable'} ${s.name}`) }),
        h('div', { class: `meta ${st.cls}` }, inWorldOff ? 'switched off in World settings' : `rev ${s.rev} · ${st.text}`))
    }))
    if (!summary.systems.length) list.append(h('div', { class: 'muted' }, 'No doc systems yet. Name one below; agents can add them too.'))
  }

  // the doc changed: refresh the list; take remote source edits unless mine are pending
  function docChanged () {
    render()
    if (!selected) return
    const cur = docSystem(selected)
    if (!cur) { select(null); return }
    if (cur.source !== baseSource) {
      if (draft == null || draft === baseSource) { if (!hasFocusWithin(src)) { baseSource = cur.source; src.value = cur.source; mark() } else stale.hidden = false } else stale.hidden = false
    }
    showErr()
  }

  return { el, render, docChanged, select, get selected () { return selected }, refresh () { render(); showErr() } }
}
