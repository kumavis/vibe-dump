// VALUE STACK pane: typed cells bottom→top, frame and label base markers,
// and the motion for each step: operands lift into the instruction, results
// drop back, and a branch cuts the stack back to its label's height while the
// carried values slide down to survive.
import { h, esc } from './dom.js'
import { fmt, readings, typeClass, shortType, valuesHTML } from './format.js'
import { prefs } from './prefs.js'

const SLOT = 34
const PAD = 10
const MAX_CELLS = 400
const EASE = 'cubic-bezier(.2,.7,.2,1)'

export class StackPane {
  constructor(session) {
    this.session = session
    this.els = [] // index -> cell element, for [lo, n)
    this.lo = 0
    this.n = 0
    this.ghosts = []
    this.count = h('span', { class: 'pane-meta' })
    this.hexBtn = h('button', { type: 'button', class: 'chip-btn toggle', 'aria-pressed': String(prefs.hex), title: 'Show values in hexadecimal (H)', onclick: () => this.opts && this.opts.toggleHex() }, 'hex')
    this.tx = h('div', { class: 'stack-tx', 'aria-live': 'polite' })
    this.col = h('div', { class: 'stack-col' })
    this.markers = h('div', { class: 'stack-markers', 'aria-hidden': 'true' })
    this.more = h('div', { class: 'stack-more', hidden: true })
    this.col.append(this.markers)
    this.scroll = h('div', { class: 'stack-scroll', role: 'list', 'aria-label': 'Operand stack, top first' }, this.col)
    this.empty = h('div', { class: 'stack-empty' }, 'empty')
    this.el = h('section', { class: 'pane stack-pane', 'data-pane': 'stack', 'aria-label': 'Operand stack' },
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-label' }, 'Operand stack'), h('span', { class: 'grow' }), this.count, this.hexBtn),

      this.tx, this.scroll, this.more)
    new ResizeObserver(() => this.layout()).observe(this.scroll)
  }

  setHexState(on) {
    this.hexBtn.setAttribute('aria-pressed', String(on))
  }

  /** Static type stack mode (validation walk): types only, no values. */
  showTypes(types, note) {
    this.typeMode = true
    for (const el of this.els) el && el.remove()
    this.clearGhosts()
    this.els = []
    this.lo = 0
    this.n = types.length
    types.forEach((t, i) => {
      const el = h('div', { class: `cell tonly ${t ? typeClass(t) : 't-any'}`, role: 'listitem' }, h('span', { class: 'cell-ty' }, t ? shortType(t) : 'any'), h('span', { class: 'cell-v' }, '?'))
      this.els[i] = el
      this.col.appendChild(el)
    })
    this.count.textContent = String(types.length)
    this.count.title = 'static types'
    this.tx.innerHTML = note || '<span class="dim">static types: no values yet</span>'
    this.markers.innerHTML = ''
    this.layout()
  }

  readStack() {
    const m = this.session.machine
    if (!m) return { n: 0, get: () => null }
    // read the engine's arrays directly: machine.stack copies the whole stack
    return { n: m.sp, get: (i) => ({ type: m.vt[i], value: m.vs[i] }) }
  }

  makeCell(v, i) {
    const el = h('div', { class: `cell ${typeClass(v.type)}`, role: 'listitem', title: readings(v.type, v.value) })
    el.innerHTML = `<span class="cell-ty">${shortType(v.type)}</span><span class="cell-v">${esc(fmt(v.type, v.value))}</span>`
    el._v = v
    el._i = i
    return el
  }

  topOf(i) {
    return this.H - PAD - (i - this.lo + 1) * SLOT
  }

  layout() {
    const vh = this.scroll.clientHeight || 300
    const content = (this.n - this.lo) * SLOT + PAD * 2 + (this.ghosts.length ? this.ghosts.length * SLOT : 0)
    this.H = Math.max(vh, content)
    this.col.style.height = this.H + 'px'
    for (let i = this.lo; i < this.n; i++) {
      const el = this.els[i]
      if (el) el.style.top = this.topOf(i) + 'px'
    }
    this.ghosts.forEach((g, k) => (g.style.top = this.topOf(this.n + k) + 'px'))
    this.renderMarkers()
  }

  clearGhosts() {
    for (const g of this.ghosts) g.remove()
    this.ghosts = []
  }

  rebuild() {
    for (const el of this.els) el && el.remove()
    this.clearGhosts()
    const st = this.readStack()
    this.n = st.n
    this.lo = Math.max(0, st.n - MAX_CELLS)
    this.els = []
    const frag = document.createDocumentFragment()
    for (let i = this.lo; i < st.n; i++) {
      const el = this.makeCell(st.get(i), i)
      this.els[i] = el
      frag.appendChild(el)
    }
    this.col.appendChild(frag)
  }

  /** Rect of the cell at stack index i (before or after an update). */
  cellRect(i) {
    const el = this.els[i]
    return el && el.isConnected ? el.getBoundingClientRect() : null
  }
  cellEl(i) {
    return this.els[i] || null
  }

  update(detail = {}) {
    const sess = this.session
    const m = sess.machine
    if (this.typeMode && !detail.types) this.typeMode = false
    const ev = detail.ev || null
    const dur = detail.anim || 0
    const st = this.readStack()
    this.clearGhosts()
    this.scroll.querySelectorAll('.cell.leaving').forEach((x) => x.remove())
    for (const el of this.els) if (el) el.classList.remove('fresh')
    const canDiff = ev && !detail.back && !detail.full && this.n - ev.popped.length + ev.pushed.length === st.n && st.n <= MAX_CELLS && this.lo === 0
    if (!canDiff) {
      this.rebuild()
      if (ev) this.markGhostsStatic(ev)
    } else this.applyEvent(ev, st, dur)
    this.n = st.n
    // value text may change without the stack shape changing (hex toggle)
    if (detail.refresh) for (let i = this.lo; i < this.n; i++) {
      const el = this.els[i]
      if (el) el.querySelector('.cell-v').textContent = fmt(el._v.type, el._v.value)
    }
    this.layout()
    if (this.ghosts.length || ev) this.scroll.scrollTop = 0
    this.more.hidden = this.lo === 0
    this.more.textContent = `… ${this.lo.toLocaleString()} more below`
    this.count.textContent = m ? String(st.n) : ''
    this.count.title = `${st.n} value${st.n === 1 ? '' : 's'} on the operand stack`
    this.renderTx(ev, detail)
  }

  /** Which popped values a branch/return carried, discarded, and consumed as a condition. */
  cutInfo(ev) {
    const c = ev.control
    if (!c) return null
    const isCut = (c.kind === 'branch' && c.taken) || c.kind === 'return'
    if (!isCut) return null
    const cond = ev.instr.op === 'br_if' || ev.instr.op === 'br_table' ? 1 : 0
    const kept = ev.pushed.length
    const unwound = ev.popped.length - kept - cond
    return { cond, kept, unwound }
  }

  applyEvent(ev, st, dur) {
    const n0 = this.n
    const nPop = ev.popped.length
    const base = n0 - nPop
    const cut = this.cutInfo(ev)
    const old = this.els.slice()
    this.els.length = base
    const lift = (el, k, delay = 0) => {
      el.classList.add('leaving')
      if (!dur) return el.remove()
      const a = el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${-SLOT * (1.1 + k * 0.15)}px) scale(.92)`, opacity: 0 }], { duration: dur * 0.5, delay, easing: EASE, fill: 'forwards' })
      a.onfinish = () => el.remove()
    }
    if (cut && (cut.unwound > 0 || cut.cond > 0 || cut.kept > 0)) {
      // condition leaves first, discarded values turn to ghosts, carried values slide down
      const condEl = cut.cond ? old[n0 - 1] : null
      if (condEl) lift(condEl, 0)
      const keptOld = old.slice(n0 - cut.cond - cut.kept, n0 - cut.cond)
      const unwOld = old.slice(base, base + cut.unwound)
      // geometry before: remember where the kept cells were
      const before = keptOld.map((el) => (el ? parseFloat(el.style.top) : 0))
      keptOld.forEach((el, k) => {
        this.els[base + k] = el
        el._i = base + k
      })
      // ghosts: the discarded values, shown above the survivors until the next step
      this.ghosts = unwOld.map((el) => {
        el.classList.add('ghost')
        el.title = 'discarded by the branch'
        return el
      })
      this.n = st.n
      this.layout()
      if (dur) {
        keptOld.forEach((el, k) => {
          const dy = before[k] - parseFloat(el.style.top)
          if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: `translateY(${dy}px)`, offset: 0.35 }, { transform: 'translateY(0)' }], { duration: dur * 1.3, easing: EASE })
          el.animate([{ boxShadow: '0 0 0 2px var(--accent)' }, { boxShadow: '0 0 0 0 transparent' }], { duration: dur * 1.6 })
        })
        this.ghosts.forEach((g) => g.animate([{ opacity: 1, filter: 'none' }, { opacity: 0.45 }], { duration: dur, easing: EASE }))
        this.flashCut(dur)
      }
      return
    }
    // generic: popped operands lift out together, results drop back in
    for (let k = 0; k < nPop; k++) {
      const el = old[base + k]
      if (el) lift(el, nPop - 1 - k)
    }
    for (let k = 0; k < ev.pushed.length; k++) {
      const v = ev.pushed[k]
      const el = this.makeCell(v, base + k)
      this.els[base + k] = el
      this.col.appendChild(el)
      el.classList.add('fresh')
      if (dur) el.animate([{ transform: `translateY(${-SLOT * 1.1}px) scale(.92)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: dur * 0.6, delay: nPop ? dur * 0.4 : 0, easing: EASE, fill: 'backwards' })
    }
  }

  /** Without motion: show what a cut discarded as ghost cells. */
  markGhostsStatic(ev) {
    const cut = this.cutInfo(ev)
    if (!cut || cut.unwound <= 0) return
    const unw = ev.popped.slice(0, cut.unwound)
    this.ghosts = unw.map((v) => {
      const el = this.makeCell(v, -1)
      el.classList.add('ghost')
      el.title = 'discarded by the branch'
      this.col.appendChild(el)
      return el
    })
    for (let k = 0; k < ev.pushed.length; k++) {
      const el = this.els[this.n - ev.pushed.length + k]
      if (el) el.classList.add('fresh')
    }
  }

  flashCut(dur) {
    const line = this.markers.querySelector('.mk.cut')
    if (line) line.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur * 0.5, easing: EASE })
  }

  renderMarkers() {
    const sess = this.session
    const m = sess.machine
    if (!m || this.typeMode) {
      this.markers.innerHTML = ''
      return
    }
    const frames = sess.frames()
    const byH = new Map()
    const add = (hgt, tag, cls) => {
      if (hgt < this.lo) return
      if (!byH.has(hgt)) byH.set(hgt, [])
      byH.get(hgt).push({ tag, cls })
    }
    frames.forEach((fr, i) => {
      if (i < frames.length - 6) return
      add(fr.stackBase, esc(sess.funcLabel(fr.funcIndex)), 'frame')
    })
    const top = frames[frames.length - 1]
    if (top) {
      const names = sess.labelNames ? sess.labelNames(top.funcIndex) : null
      for (const L of top.labels) {
        // a label's height is where a branch to it cuts the stack back to
        if (L.kind === 'func') continue
        const nm = names && names.get(L.start)
        add(L.height, `<span class="mk-d" title="label ${L.depth}${nm ? ' ' + esc(nm) : ''}: ${L.kind}">${L.depth}</span>`, 'label')
      }
    }
    // the height a branch just cut the stack back to
    const ev = sess.prog && sess.prog.events.get(m.steps)
    const cut = ev && this.cutInfo(ev)
    const cutH = cut && cut.unwound > 0 ? m.sp - ev.pushed.length : null
    let html = ''
    for (const [hgt, tags] of byH) {
      const y = this.H - PAD - (hgt - this.lo) * SLOT + 1
      const hasFrame = tags.some((t) => t.cls === 'frame')
      const labels = tags.filter((t) => t.cls === 'label').map((t) => t.tag)
      const frameTag = tags.filter((t) => t.cls === 'frame').map((t) => t.tag).pop()
      html += `<div class="mk ${hasFrame ? 'mk-frame' : 'mk-label'}${hgt === cutH ? ' cut' : ''}" style="top:${y}px"><span class="mk-tag">${frameTag ? `<b>${frameTag}</b>` : ''}${labels.length ? `<i>${labels.reverse().join('')}</i>` : ''}</span></div>`
    }
    if (cutH != null && !byH.has(cutH)) {
      const y = this.H - PAD - (cutH - this.lo) * SLOT + 1
      html += `<div class="mk mk-label cut" style="top:${y}px"><span class="mk-tag"><i>cut</i></span></div>`
    }
    this.markers.innerHTML = html
  }

  renderTx(ev, detail) {
    const tx = this.tx
    if (!ev) {
      const m = this.session.machine
      tx.innerHTML = m && m.status === 'ready' && m.steps === 0 ? '<span class="dim">Nothing executed yet.</span>' : '<span class="dim">—</span>'
      return
    }
    const cut = this.cutInfo(ev)
    let body
    if (ev.control && ev.control.kind === 'trap') body = '<span class="tx-trap">trapped: nothing changed</span>'
    else if (cut && cut.unwound > 0) body = `kept ${valuesHTML(ev.pushed)} <span class="tx-cut">cut ${cut.unwound}</span>`
    else if (ev.control && ev.control.kind === 'call') body = `${valuesHTML(ev.popped)} <span class="dim">→ callee's locals</span>`
    else body = `${valuesHTML(ev.popped)} <span class="arrow">→</span> ${valuesHTML(ev.pushed)}`
    tx.innerHTML = `<span class="tx-op mono">${esc(ev.instr.op)}</span> <span class="tx-body mono">${body}</span>`
  }
}
