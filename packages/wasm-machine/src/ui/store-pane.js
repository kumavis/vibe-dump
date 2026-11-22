// STORE pane: linear memory, globals, tables (with the call_indirect lookup
// and signature check), and the host output console.
import { h, esc } from './dom.js'
import { fmt, readings, typeClass, shortType, sigHTML } from './format.js'
import { MemoryView } from './memory-view.js'

const TABS = [
  ['memory', 'Memory'],
  ['globals', 'Globals'],
  ['tables', 'Tables'],
  ['output', 'Output'],
]

export class StorePane {
  constructor(session) {
    this.session = session
    this.tab = 'memory'
    this.userPicked = false
    this.mem = new MemoryView(session)
    this.globals = h('div', { class: 'globals' })
    this.tables = h('div', { class: 'tables' })
    this.out = h('div', { class: 'console mono', role: 'log', 'aria-label': 'Host output' })
    this.bodies = { memory: this.mem.el, globals: this.globals, tables: this.tables, output: this.out }
    this.tabBtns = {}
    const tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Store' })
    for (const [id, label] of TABS) {
      const b = h('button', { type: 'button', role: 'tab', class: 'tab', 'aria-selected': 'false', 'aria-controls': 'store-' + id, onclick: () => { this.userPicked = true; this.select(id) } }, label, h('span', { class: 'tab-n' }))
      this.tabBtns[id] = b
      tabs.appendChild(b)
    }
    const body = h('div', { class: 'store-body' })
    for (const [id] of TABS) {
      this.bodies[id].id = 'store-' + id
      this.bodies[id].setAttribute('role', 'tabpanel')
      body.appendChild(this.bodies[id])
    }
    this.el = h('section', { class: 'pane store-pane', 'data-pane': 'store', 'aria-label': 'Store' },
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-label' }, 'Store'), tabs), body)
    this.select('memory')
    session.on('output', () => this.renderOutput(true))
  }

  select(id) {
    this.tab = id
    for (const [k] of TABS) {
      this.tabBtns[k].setAttribute('aria-selected', String(k === id))
      this.bodies[k].hidden = k !== id
    }
    if (id === 'output') this.tabBtns.output.classList.remove('unread')
    if (id === 'memory') this.mem.render()
    if (id === 'output') this.out.scrollTop = this.out.scrollHeight
  }

  /** Pick a sensible default tab for a freshly loaded module. */
  onLoad() {
    this.userPicked = false
    this.outSeen = 0
    const m = this.session.machine
    const mod = this.session.module
    let tab = 'memory'
    if (m && !m.memory) tab = mod && mod.globals.length ? 'globals' : mod && mod.tables.length ? 'tables' : mod && mod.imports.some((i) => i.kind === 'func') ? 'output' : 'memory'
    this.select(tab)
  }

  update(detail = {}) {
    const m = this.session.machine
    const mod = this.session.module
    this.tabBtns.globals.querySelector('.tab-n').textContent = mod && mod.globals.length ? mod.globals.length : ''
    this.tabBtns.tables.querySelector('.tab-n').textContent = mod && mod.tables.length ? mod.tables.length : ''
    this.mem.update(this.tab === 'memory' ? detail : { ...detail, noFollow: true })
    this.renderGlobals(detail)
    this.renderTables(detail)
    this.renderOutput(false)
    const ev = detail.ev
    if (ev && !this.userPicked) {
      if ((ev.memRead || ev.memWrite) && this.tab !== 'memory') this.select('memory')
      else if ((ev.globalRead || ev.globalWrite) && this.tab !== 'globals' && this.tab !== 'memory') this.select('globals')
      else if (ev.control && ev.control.kind === 'call' && ev.control.indirect && this.tab !== 'tables') this.select('tables')
    }
    if (m && m.status === 'trapped' && m.trap && /indirect|element|table/.test(m.trap.kind) && !this.userPicked) this.select('tables')
  }

  renderGlobals(detail) {
    const m = this.session.machine
    const mod = this.session.module
    if (!m || !mod) return (this.globals.innerHTML = '')
    const gs = m.globals
    if (!gs.length) return (this.globals.innerHTML = '<div class="empty-note">This module declares no globals.</div>')
    const ev = detail.ev
    let html = ''
    gs.forEach((g, i) => {
      const nm = mod.names.globals.get(i)
      const imp = mod.globals[i] && mod.globals[i].import
      const ex = mod.exports.find((e) => e.kind === 'global' && e.index === i)
      const cls = ev && ev.globalWrite && ev.globalWrite.index === i ? ' write' : ev && ev.globalRead && ev.globalRead.index === i ? ' read' : ''
      const was = ev && ev.globalWrite && ev.globalWrite.index === i ? ` <span class="slot-was">was ${esc(fmt(g.type, ev.globalWrite.old))}</span>` : ''
      html += `<div class="grow-row slot ${typeClass(g.type)}${cls}" data-g="${i}" title="${esc(readings(g.type, g.value))}">
        <span class="slot-i">global ${i}</span><span class="slot-n">${nm ? '$' + esc(nm) : ex ? esc(ex.name) : imp ? esc(imp.module + '.' + imp.name) : ''}</span>
        <span class="slot-t">${g.mut ? 'mut ' : ''}${shortType(g.type)}</span><span class="slot-v">${esc(fmt(g.type, g.value))}</span>${was}</div>`
    })
    this.globals.innerHTML = html
  }

  globalEl(i) {
    return this.tab === 'globals' ? this.globals.querySelector(`[data-g="${i}"]`) : null
  }

  renderTables(detail) {
    const sess = this.session
    const m = sess.machine
    const mod = sess.module
    if (!m || !mod) return (this.tables.innerHTML = '')
    if (!m.tables.length) return (this.tables.innerHTML = '<div class="empty-note">This module declares no tables. Lesson 9 adds one.</div>')
    const ev = detail.ev
    let lookup = null
    // the call_indirect being looked at: just executed, trapped on, or next
    const loc = m.location
    const trapInstr = m.status === 'trapped' && m.trap && m.trap.funcIndex != null ? mod.funcs[m.trap.funcIndex].body.code[m.trap.pc] : null
    if (ev && ev.instr.op === 'call_indirect' && ev.control && ev.control.kind === 'call') {
      const target = sess.machine.instance.funcs[ev.control.funcIndex]
      lookup = { table: ev.instr.table, index: ev.control.elemIndex, want: mod.types[ev.instr.type], got: target ? target.type : null, ok: true, name: sess.funcLabel(ev.control.funcIndex) }
    } else if (trapInstr && trapInstr.op === 'call_indirect') {
      const idx = m.sp ? m.vs[m.sp - 1] : null
      const t = m.tables[trapInstr.table]
      const ref = idx != null && idx >>> 0 < t.length ? t.elements[idx >>> 0] : undefined
      lookup = { table: trapInstr.table, index: idx, want: mod.types[trapInstr.type], got: ref ? ref.type : null, ok: false, name: ref ? ref.name || 'func ' + ref.index : null, missing: ref === undefined, isNull: ref === null }
    } else if (loc && loc.instr.op === 'call_indirect' && loc.inst === m.instance) {
      const idx = m.sp ? m.vs[m.sp - 1] : null
      const t = m.tables[loc.instr.table]
      const ref = idx != null && idx >>> 0 < t.length ? t.elements[idx >>> 0] : undefined
      lookup = { table: loc.instr.table, index: idx, want: mod.types[loc.instr.type], got: ref ? ref.type : null, ok: null, name: ref ? ref.name || 'func ' + ref.index : null, missing: ref === undefined, isNull: ref === null, pending: true }
    }
    let html = ''
    if (lookup) {
      const match = lookup.got && sameType(lookup.got, lookup.want)
      const verdict = lookup.missing ? '<span class="bad">index past the end of the table: traps (undefined element)</span>'
        : lookup.isNull ? '<span class="bad">null entry: traps (uninitialized element)</span>'
          : match ? '<span class="good">types match: the call proceeds</span>' : '<span class="bad">types differ: traps (indirect call type mismatch)</span>'
      html += `<div class="lookup"><div class="lookup-h">${lookup.pending ? 'Next' : 'Last'} <span class="mono">call_indirect</span>: table ${lookup.table}[${lookup.index}]</div>
        <div class="lookup-r"><span class="dim">expects</span> ${sigHTML(lookup.want.params, lookup.want.results)}</div>
        <div class="lookup-r"><span class="dim">found</span> ${lookup.got ? `<span class="fn-name">${esc(lookup.name)}</span> ${sigHTML(lookup.got.params, lookup.got.results)}` : '<span class="dim">nothing</span>'}</div>
        <div class="lookup-r">${verdict}</div></div>`
    }
    m.tables.forEach((t, ti) => {
      html += `<div class="tbl-h">table ${ti} <span class="dim">${t.elemType} · ${t.length} entr${t.length === 1 ? 'y' : 'ies'}</span></div>`
      const n = Math.min(t.length, 512)
      for (let i = 0; i < n; i++) {
        const r = t.elements[i]
        const hit = lookup && lookup.table === ti && lookup.index === i
        const desc = r == null ? '<span class="dim">null</span>' : r.type ? `<span class="fn-name">${esc(r.inst === m.instance ? '$' + sess.funcLabel(r.index) : r.name || 'host')}</span> ${sigHTML(r.type.params, r.type.results)}` : esc(String(r))
        html += `<div class="tbl-e${hit ? ' hit' + (lookup.ok === false ? ' bad' : '') : ''}"><span class="tbl-i mono">${i}</span>${desc}</div>`
      }
      if (t.length > n) html += `<div class="dim tbl-more">… ${t.length - n} more entries</div>`
    })
    this.tables.innerHTML = html
  }

  renderOutput(fromEvent) {
    const p = this.session.prog
    if (!p) return (this.out.innerHTML = '')
    const list = p.output
    if (!list.length) {
      this.out.innerHTML = '<div class="empty-note">Output from WASI stdout/stderr and host imports appears here.</div>'
      this.tabBtns.output.querySelector('.tab-n').textContent = ''
      return
    }
    const start = Math.max(0, list.length - 400)
    let html = start ? `<div class="con-line info">… ${start} earlier lines</div>` : ''
    for (let i = start; i < list.length; i++) {
      const e = list[i]
      const k = e.kind
      const prefix = k === 'host' ? '→ host ' : k === 'unresolved' ? 'unresolved import called: ' : k === 'unresolved-import' ? 'unresolved import, stubbed: ' : k === 'invoke' ? '▸ invoke ' : ''
      html += `<div class="con-line ${k}">${prefix ? `<span class="con-p">${prefix}</span>` : ''}${esc(e.text.replace(/\n$/, ''))}</div>`
    }
    this.out.innerHTML = html
    this.out.scrollTop = this.out.scrollHeight
    const real = list.filter((e) => e.kind === 'stdout' || e.kind === 'stderr' || e.kind === 'host').length
    this.tabBtns.output.querySelector('.tab-n').textContent = real ? real : ''
    if (fromEvent && this.tab !== 'output') {
      const last = list[list.length - 1]
      if (last.kind === 'stdout' || last.kind === 'stderr' || last.kind === 'host') {
        if (!this.userPicked) this.select('output')
        else this.tabBtns.output.classList.add('unread')
      }
    }
  }
}

function sameType(a, b) {
  return a.params.length === b.params.length && a.results.length === b.results.length && a.params.every((t, i) => t === b.params[i]) && a.results.every((t, i) => t === b.results[i])
}
