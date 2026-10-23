// The unit list (ROUND-2.md §1.1, §5): every unit in the box, by side, the
// ships first and then the air groups, in the record's order; a unit that
// cannot be taken is greyed with the reason in a few words ("fate is fixed",
// "hospital ship", "tokkō unit", "on the ground", "not yet airborne"); a
// filter by kind; the keyboard walks it (↑ ↓ Home End, a letter jumps to the
// next name that starts with it, Enter or Space selects, Esc closes). A row
// selects (on.select(row)); selecting never changes the battle. Opened from
// the box's bar (Units) and L (src/link.js).
//
// A plain DOM template fed by plain objects (link.js builds them from
// sim.units() and battle.json), so the UI never imports the sim:
//
//   list.set({
//     title: 'Pearl Harbor', clock: '07:55',
//     sides: [ { code: 'jp', name: 'Japan', ja: '大日本帝国海軍',
//                ships:  [ { key, index, kind: 'ship', name, ja, hull, sub, now, takeable: true | 'reason', alive, count? } ],
//                groups: [ { key, index, kind: 'aircraft', name, ja, sub, now, takeable, count, flying, parked? } ] }, … ],
//     selected: { index, key } | null,
//   })
//
// The structure is built once per box (the rows' keys); each later set()
// only rewrites what changed in place, so focus and scroll survive the
// battle's clock moving under an open list.

import { h, esc } from './dom.js'
import { icon } from './icons.js'

const KINDS = [
  ['all', 'All'],
  ['ship', 'Ships'],
  ['aircraft', 'Aircraft'],
]

export class UnitList {
  /** on: { select(row), close() } */
  constructor(root, on) {
    this.on = on
    this.filter = 'all'
    this.data = null
    this.structure = ''
    this.rows = new Map() // key → { row, el }
    this.el = h('aside', { class: 'unitlist', 'aria-label': 'Units', hidden: '' })
    this.el.innerHTML = `
      <header class="ul-head">
        <div class="ul-titles"><h2>Units</h2><span class="ul-sub"></span></div>
        <button class="ul-close" aria-label="Close the list" title="Close (Esc)">${icon('close', 18)}</button>
      </header>
      <div class="ul-filter" role="radiogroup" aria-label="Kind">${KINDS.map(([k, t]) => `<button role="radio" data-kind="${k}" aria-checked="${k === this.filter}">${t}</button>`).join('')}</div>
      <div class="ul-body" role="listbox" aria-label="Units by side"></div>`
    root.appendChild(this.el)
    this.body = this.el.querySelector('.ul-body')
    this.el.addEventListener('click', (e) => {
      if (e.target.closest('.ul-close')) return this.close()
      const f = e.target.closest('[data-kind]')
      if (f) return this.setFilter(f.dataset.kind)
      const r = e.target.closest('.ul-row')
      if (r) this.pick(r)
    })
    this.el.addEventListener('keydown', (e) => this.key(e))
  }

  get isOpen() {
    return !this.el.hidden
  }

  open({ focus = true } = {}) {
    this.el.hidden = false
    this.el.classList.add('show')
    if (focus) (this.body.querySelector('.ul-row.sel:not([hidden])') || this.body.querySelector('.ul-row:not([hidden])'))?.focus({ preventScroll: false })
  }

  close() {
    if (this.el.hidden) return
    if (this.el.contains(document.activeElement)) document.activeElement.blur()
    this.el.hidden = true
    this.el.classList.remove('show')
    this.on.close?.()
  }

  toggle() {
    if (this.isOpen) this.close()
    else this.open()
  }

  setFilter(kind) {
    this.filter = kind
    for (const b of this.el.querySelectorAll('[data-kind]')) b.setAttribute('aria-checked', String(b.dataset.kind === kind))
    this.el.dataset.filter = kind
    this.applyFilter()
  }

  applyFilter() {
    const f = this.filter
    for (const { row, el } of this.rows.values()) el.hidden = !(f === 'all' || row.kind === f)
    for (const sec of this.body.querySelectorAll('.ul-sec')) sec.hidden = !sec.querySelector('.ul-row:not([hidden])')
    for (const side of this.body.querySelectorAll('.ul-side')) side.hidden = !side.querySelector('.ul-row:not([hidden])')
  }

  set(data) {
    this.data = data
    if (!data) {
      this.body.innerHTML = ''
      this.rows.clear()
      this.structure = ''
      return
    }
    this.el.querySelector('.ul-sub').textContent = [data.title, data.clock].filter(Boolean).join(' · ')
    const structure = data.sides.map((s) => `${s.code}:${s.ships.map((r) => r.key).join(',')}|${s.groups.map((r) => r.key).join(',')}`).join(';')
    if (structure !== this.structure) {
      this.structure = structure
      this.build(data)
    }
    for (const s of data.sides) for (const r of [...s.ships, ...s.groups]) this.update(r)
    const sel = data.selected
    for (const { row, el } of this.rows.values()) {
      const on = !!sel && (sel.key === row.key || (sel.index != null && (row.index === sel.index || row.members?.includes(sel.index))))
      el.classList.toggle('sel', on)
      el.setAttribute('aria-selected', String(on))
    }
  }

  build(data) {
    const focusKey = this.el.contains(document.activeElement) ? document.activeElement.dataset.key : null
    this.rows.clear()
    const sec = (label, rows) => (rows.length ? `<div class="ul-sec"><h4>${esc(label)}</h4>${rows.map((r) => `<button class="ul-row" role="option" data-key="${esc(r.key)}" data-kind="${esc(r.kind)}"></button>`).join('')}</div>` : '')
    this.body.innerHTML = data.sides
      .map((s) => `<section class="ul-side" data-side="${esc(s.code)}"><h3>${esc(s.name)}${s.ja ? ` <span lang="ja">${esc(s.ja)}</span>` : ''}</h3>${sec('Ships', s.ships)}${sec('Air groups', s.groups)}</section>`)
      .join('')
    for (const s of data.sides) for (const r of [...s.ships, ...s.groups]) this.rows.set(r.key, { row: r, el: this.body.querySelector(`.ul-row[data-key="${CSS.escape(r.key)}"]`), html: '' })
    this.applyFilter()
    if (focusKey) this.rows.get(focusKey)?.el?.focus({ preventScroll: true })
  }

  update(r) {
    const it = this.rows.get(r.key)
    if (!it) return
    it.row = r
    const grey = r.takeable !== true
    const count = r.kind === 'aircraft' && r.count > 1 ? `<span class="ul-n">×${r.count}</span>` : ''
    const html = `
      <span class="ul-ic ${r.kind}" aria-hidden="true"></span>
      <span class="ul-main">
        <span class="ul-name"><b>${esc(r.name)}</b>${r.hull ? ` <span class="ul-hull">${esc(r.hull)}</span>` : ''}${r.ja ? ` <span class="ul-ja" lang="ja">${esc(r.ja)}</span>` : ''}${count}</span>
        <span class="ul-line">${esc(r.sub || '')}${r.now ? `${r.sub ? ' · ' : ''}${esc(r.now)}` : ''}</span>
      </span>
      ${grey ? `<span class="ul-why">${esc(r.takeable)}</span>` : ''}`
    if (html === it.html) return
    it.html = html
    it.el.innerHTML = html
    it.el.classList.toggle('grey', grey)
    it.el.classList.toggle('gone', r.alive === false)
    it.el.title = grey ? `${r.name}: ${r.takeable}` : r.name
  }

  pick(el) {
    const it = this.rows.get(el.dataset.key)
    if (!it) return
    this.on.select?.(it.row)
  }

  /** ↑ ↓ Home End move; a letter jumps; Enter or Space selects; Esc closes. The keys stay in the list. */
  key(e) {
    const rows = [...this.body.querySelectorAll('.ul-row:not([hidden])')]
    const at = rows.indexOf(document.activeElement)
    const go = (i) => {
      const r = rows[Math.max(0, Math.min(rows.length - 1, i))]
      r?.focus()
      r?.scrollIntoView({ block: 'nearest' })
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      return this.close()
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End' || e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Home') return go(0)
      if (e.key === 'End') return go(rows.length - 1)
      const step = e.key === 'PageDown' ? 8 : e.key === 'PageUp' ? -8 : e.key === 'ArrowDown' ? 1 : -1
      return go(at < 0 ? 0 : at + step)
    }
    // (the arrows across, Space and the letters belong to the list while it has the focus: the box's walk and its L wait)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return e.stopPropagation()
    if ((e.key === 'Enter' || e.key === ' ') && at >= 0) {
      e.preventDefault()
      e.stopPropagation()
      return this.pick(rows[at])
    }
    // (L stays the list's own key: it closes it again)
    if (e.key.length === 1 && /\S/.test(e.key) && e.key.toLowerCase() !== 'l' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.stopPropagation()
      const ch = e.key.toLowerCase()
      const name = (r) => (this.rows.get(r.dataset.key)?.row.name || '').toLowerCase()
      for (let k = 1; k <= rows.length; k++) {
        const r = rows[(Math.max(at, 0) + k) % rows.length]
        if (name(r).startsWith(ch)) return go(rows.indexOf(r))
      }
    }
  }
}
