// DEBUGGER side panel: load a module (file, drop, examples, WAT), pick an
// export and its typed arguments, and browse a searchable, virtualised list
// of every function.
import { h, icon, esc, rafThrottle, clear } from './dom.js'
import { EXAMPLES } from './examples.js'
import { argInputs } from './args.js'
import { sigHTML, fmtBytes } from './format.js'

const RH = 32

export class DebuggerPanel {
  constructor(app) {
    this.app = app
    this.session = app.session
    this.file = h('input', { type: 'file', accept: '.wasm,.wat,.wast,application/wasm', hidden: true, 'aria-label': 'Open a .wasm or .wat file' })
    this.file.addEventListener('change', () => {
      const f = this.file.files[0]
      if (f) app.openFile(f)
      this.file.value = ''
    })
    this.modName = h('div', { class: 'mod-name mono' })
    this.modMeta = h('div', { class: 'mod-meta' })
    this.warn = h('div', { class: 'mod-warn', hidden: true })
    this.exList = h('div', { class: 'ex-list' })
    for (const ex of EXAMPLES) {
      this.exList.appendChild(h('button', { type: 'button', class: 'ex', 'data-ex': ex.id, onclick: () => app.loadExample(ex.id) },
        h('span', { class: 'ex-t' }, ex.title), h('span', { class: 'ex-d' }, ex.desc)))
    }
    this.examples = h('details', { class: 'examples' }, h('summary', {}, 'Examples'), this.exList)
    this.invokeBox = h('div', { class: 'invoke' })
    this.search = h('input', { type: 'search', class: 'fn-search', placeholder: 'Search functions', 'aria-label': 'Search functions', spellcheck: 'false' })
    this.search.addEventListener('input', () => this.filter())
    this.search.addEventListener('keydown', (e) => e.stopPropagation())
    this.fnCount = h('span', { class: 'pane-meta' })
    this.spacer = h('div', { class: 'fn-spacer' })
    this.rows = h('div', { class: 'fn-rows', role: 'listbox', 'aria-label': 'Functions' })
    this.spacer.appendChild(this.rows)
    this.list = h('div', { class: 'fn-list' }, this.spacer)
    this.list.addEventListener('scroll', rafThrottle(() => this.renderRows()))
    this.rows.addEventListener('click', (e) => {
      const r = e.target.closest('[data-f]')
      if (!r) return
      const p = this.session.prog
      p.viewFunc = +r.dataset.f
      p.viewFrame = null
      this.session.emit('update', { reason: 'view' })
    })
    new ResizeObserver(() => this.renderRows()).observe(this.list)
    this.el = h('div', { class: 'dbg' },
      h('div', { class: 'side-sec' },
        h('div', { class: 'side-h' }, h('span', { class: 'pane-label' }, 'Module')),
        this.modName, this.modMeta, this.warn,
        h('div', { class: 'mod-btns' },
          h('button', { type: 'button', class: 'btn', onclick: () => this.file.click() }, icon('upload', 14), 'Open .wasm'),
          h('button', { type: 'button', class: 'btn', onclick: () => app.newWat() }, icon('edit', 14), 'Write WAT')),
        h('div', { class: 'drop-hint dim' }, 'or drop a .wasm / .wat file anywhere'),
        this.examples, this.file),
      h('div', { class: 'side-sec' }, h('div', { class: 'side-h' }, h('span', { class: 'pane-label' }, 'Invoke')), this.invokeBox),
      h('div', { class: 'side-sec grow-sec' }, h('div', { class: 'side-h' }, h('span', { class: 'pane-label' }, 'Functions'), h('span', { class: 'grow' }), this.fnCount), this.search, this.list))
  }

  onLoad() {
    this.pick = null
    const sess = this.session
    const p = sess.prog
    const mod = sess.module
    this.modName.textContent = p ? p.name : '—'
    if (mod) {
      const nf = mod.funcs.length
      this.modMeta.innerHTML = `${fmtBytes(p.bytes.length)} · ${nf.toLocaleString()} function${nf === 1 ? '' : 's'} (${mod.numImportedFuncs} imported) · ${mod.exports.length} export${mod.exports.length === 1 ? '' : 's'}${mod.memories.length ? ` · memory ${mod.memories[0].min} page${mod.memories[0].min === 1 ? '' : 's'}` : ''}`
    } else this.modMeta.textContent = p && p.error ? 'did not load' : ''
    const unresolved = p && p.host ? p.host.unresolved : []
    this.warn.hidden = !unresolved.length
    if (unresolved.length) this.warn.innerHTML = `${icon('warn', 13).outerHTML}<span>${unresolved.length} import${unresolved.length === 1 ? '' : 's'} not provided by this runtime; stubs return zeros: <span class="mono">${unresolved.slice(0, 4).map((u) => esc(u.module + '.' + u.name)).join(', ')}${unresolved.length > 4 ? '…' : ''}</span></span>`
    for (const b of this.exList.children) b.classList.toggle('cur', p && p.opts && p.opts.example === b.dataset.ex)
    this.buildFuncs()
    this.renderInvoke()
  }

  buildFuncs() {
    const mod = this.session.module
    this.all = mod ? mod.funcs.map((f, i) => ({ i, name: this.session.funcLabel(i), f, exp: mod.exports.some((e) => e.kind === 'func' && e.index === i) })) : []
    this.filter()
  }

  filter() {
    const q = this.search.value.trim().toLowerCase()
    this.shown = q ? this.all.filter((x) => x.name.toLowerCase().includes(q) || String(x.i) === q) : this.all
    this.fnCount.textContent = this.all.length ? (q ? `${this.shown.length} / ${this.all.length}` : `${this.all.length}`) : ''
    this.spacer.style.height = this.shown.length * RH + 'px'
    this.list.scrollTop = 0
    this.renderRows()
  }

  renderRows() {
    if (!this.shown) return
    const first = Math.max(0, Math.floor(this.list.scrollTop / RH) - 2)
    const last = Math.min(this.shown.length, first + Math.ceil((this.list.clientHeight || 300) / RH) + 4)
    const m = this.session.machine
    const loc = m && m.location
    const cur = this.app.codePane.current
    let html = ''
    for (let k = first; k < last; k++) {
      const x = this.shown[k]
      const t = x.f.type
      const size = x.f.body ? x.f.body.end - x.f.body.start : 0
      const cls = (loc && loc.funcIndex === x.i ? ' running' : '') + (cur && cur.f === x.i ? ' sel' : '')
      html += `<div class="fn${cls}" role="option" data-f="${x.i}" style="top:${k * RH}px" title="${esc(x.name)}">
        <span class="fn-i mono">${x.i}</span><span class="fn-n">${x.f.import ? '<span class="fn-imp">import</span> ' : x.exp ? '<span class="fn-exp">export</span> ' : ''}${esc(x.name)}</span>
        <span class="fn-s">${sigHTML(t.params, t.results)}</span><span class="fn-b mono">${x.f.body ? size + 'B' : ''}</span></div>`
    }
    this.rows.innerHTML = html
  }

  renderInvoke() {
    const sess = this.session
    const box = this.invokeBox
    clear(box)
    const mod = sess.module
    if (!mod || !sess.machine) {
      box.appendChild(h('div', { class: 'dim' }, sess.prog && sess.prog.error ? 'Fix the error to invoke anything.' : 'Load a module first.'))
      return
    }
    const fns = sess.exportedFuncs()
    if (!fns.length) {
      box.appendChild(h('div', { class: 'dim' }, 'This module exports no functions.'))
      return
    }
    const p = sess.prog
    const pre = (p.opts && p.opts.invoke) || null
    const sel = h('select', { class: 'inv-sel mono', 'aria-label': 'Exported function' })
    const pick = this.pick && fns.find((f) => f.name === this.pick) ? this.pick : pre && fns.find((f) => f.name === pre.name) ? pre.name : (fns.find((f) => f.name === '_start') || fns.find((f) => !f.type.params.length) || fns[0]).name
    for (const f of fns) sel.appendChild(h('option', { value: f.name, selected: f.name === pick }, f.name))
    const argsBox = h('div', { class: 'inv-args' })
    const err = h('div', { class: 'arg-err' })
    let ai = null
    const build = () => {
      clear(argsBox)
      const f = fns.find((x) => x.name === sel.value)
      this.pick = f.name
      const t = f.type
      const names = t.params.map((_, i) => (mod.names.locals.get(f.index) || new Map()).get(i))
      const vals = pre && pre.name === f.name ? pre.args : this.lastArgs && this.lastArgs.name === f.name ? this.lastArgs.args : []
      ai = argInputs(t.params, { names, values: vals, onEnter: () => go() })
      if (t.params.length) argsBox.appendChild(ai.el)
      argsBox.appendChild(h('div', { class: 'inv-sig' }, h('span', { class: 'dim' }, 'type '), h('span', { html: sigHTML(t.params, t.results) })))
    }
    const go = () => {
      const r = ai.read()
      if (r.error) return (err.textContent = r.error)
      err.textContent = ''
      this.lastArgs = { name: sel.value, args: r.args }
      const e = sess.invoke(sel.value, r.args)
      if (e) err.textContent = e
      // hand the keyboard to the machine: Space should run, not re-invoke
      else this.app.codePane.scroll.focus({ preventScroll: true })
    }
    this.invokeNow = go
    sel.addEventListener('change', build)
    sel.addEventListener('keydown', (e) => e.stopPropagation())
    build()
    box.append(h('div', { class: 'inv-row' }, sel, h('button', { type: 'button', class: 'btn primary small', onclick: go }, icon('play', 12), sel.value === '_start' ? 'Run' : 'Invoke')), argsBox, err)
    sel.addEventListener('change', () => (box.querySelector('.inv-row .btn').lastChild.textContent = sel.value === '_start' ? 'Run' : 'Invoke'))
  }
}
