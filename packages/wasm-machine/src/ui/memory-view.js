// Linear memory as a virtualised hex + ASCII grid. Only the visible rows
// exist in the DOM; beyond a few million pixels the scrollbar is scaled and
// the wheel moves by rows, so a 1 GiB memory scrolls as smoothly as 1 page.
import { h, rafThrottle, esc } from './dom.js'
import { hex2, hexN, asciiChar, fmtBytes } from './format.js'

const RH = 18
const MAX_PX = 3_000_000

export class MemoryView {
  constructor(session) {
    this.session = session
    this.topRow = 0
    this.bpr = 16
    this.sel = null
    this.hover = null
    this.follow = true
    this.access = [] // [{addr, len, kind}]
    this.jump = h('input', { class: 'mem-jump mono', type: 'text', placeholder: 'go to 0x…', 'aria-label': 'Jump to address', spellcheck: 'false' })
    this.jump.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const a = parseAddr(this.jump.value)
        if (a != null) this.goto(a, true)
        else this.jump.classList.add('bad')
      } else this.jump.classList.remove('bad')
    })
    this.followBox = h('input', { type: 'checkbox', checked: true, onchange: () => (this.follow = this.followBox.checked) })
    this.info = h('span', { class: 'pane-meta mem-size' })
    this.accessChip = h('span', { class: 'mem-access mono' })
    this.toolbar = h('div', { class: 'mem-tools' }, this.jump, h('label', { class: 'mem-follow', title: 'Scroll to each new memory access' }, this.followBox, 'follow'), this.accessChip, h('span', { class: 'grow' }), this.info)
    this.spacer = h('div', { class: 'mem-spacer' })
    this.scroller = h('div', { class: 'mem-scroller' }, this.spacer)
    this.rows = h('div', { class: 'mem-rows mono', role: 'grid', 'aria-label': 'Linear memory bytes' })
    this.grid = h('div', { class: 'mem-grid', tabindex: '0' }, this.rows, this.scroller)
    this.insp = h('div', { class: 'mem-insp', 'aria-live': 'polite' })
    this.empty = h('div', { class: 'empty-note mem-empty', hidden: true })
    this.el = h('div', { class: 'mem' }, this.toolbar, h('div', { class: 'mem-body' }, this.grid, this.insp), this.empty)
    this.scroller.addEventListener('scroll', rafThrottle(() => this.onScroll()))
    this.grid.addEventListener('wheel', (e) => this.onWheel(e), { passive: false })
    this.rows.addEventListener('mouseover', (e) => {
      const c = e.target.closest('[data-a]')
      const a = c ? +c.dataset.a : null
      if (a !== this.hover) {
        this.hover = a
        this.renderInspector()
      }
    })
    this.rows.addEventListener('mouseleave', () => {
      this.hover = null
      this.renderInspector()
    })
    this.rows.addEventListener('click', (e) => {
      const c = e.target.closest('[data-a]')
      if (c) {
        this.sel = +c.dataset.a
        this.render()
        this.renderInspector()
      }
    })
    this.grid.addEventListener('keydown', (e) => this.onKey(e))
    new ResizeObserver(() => this.render()).observe(this.grid)
  }

  get mem() {
    const m = this.session.machine
    return m ? m.memory : null
  }

  geometry() {
    const mem = this.mem
    const len = mem ? mem.bytes.length : 0
    const w = this.grid.clientWidth || 400
    // padding + address + gaps, then per byte 2.5ch of hex + 1ch of ascii, plus the scrollbar strip
    const ch = 7.25
    const aw = len > 0x1000000 ? 8 : 6
    const need = (b) => 10 + aw * ch + 20 + b * 3.5 * ch + Math.floor((b - 1) / 4) * 0.7 * ch + 16
    this.bpr = w >= need(16) ? 16 : w >= need(8) ? 8 : 4
    const totalRows = Math.ceil(len / this.bpr)
    const vh = this.grid.clientHeight || 200
    const visRows = Math.max(1, Math.floor(vh / RH))
    const maxTop = Math.max(0, totalRows - visRows)
    const fullPx = totalRows * RH
    const spacerPx = Math.min(fullPx, MAX_PX)
    return { len, totalRows, visRows, maxTop, scaled: fullPx > MAX_PX, spacerPx, vh }
  }

  onScroll() {
    if (this.ignoreScroll) {
      this.ignoreScroll = false
      return
    }
    const g = this.geometry()
    const scrollable = Math.max(1, g.spacerPx - g.vh)
    this.topRow = g.scaled ? Math.round((this.scroller.scrollTop / scrollable) * g.maxTop) : Math.floor(this.scroller.scrollTop / RH)
    this.render(false)
  }

  onWheel(e) {
    const g = this.geometry()
    e.preventDefault()
    if (!g.scaled) {
      // the scrollbar strip is exact at this size: forward the wheel to it
      this.scroller.scrollTop += e.deltaMode === 1 ? e.deltaY * RH : e.deltaMode === 2 ? e.deltaY * g.vh : e.deltaY
      return
    }
    const dy = e.deltaMode === 1 ? e.deltaY * 3 : e.deltaMode === 2 ? e.deltaY * g.visRows : e.deltaY / RH
    this.setTop(this.topRow + Math.round(dy) || this.topRow + Math.sign(e.deltaY))
  }

  setTop(row) {
    const g = this.geometry()
    this.topRow = Math.max(0, Math.min(g.maxTop, row))
    this.syncScrollbar(g)
    this.render(false)
  }

  syncScrollbar(g) {
    const scrollable = Math.max(1, g.spacerPx - g.vh)
    const want = g.scaled ? (g.maxTop ? (this.topRow / g.maxTop) * scrollable : 0) : this.topRow * RH
    if (Math.abs(this.scroller.scrollTop - want) > 0.5) {
      this.ignoreScroll = true
      this.scroller.scrollTop = want
    }
  }

  goto(addr, select = false) {
    const g = this.geometry()
    if (addr >= g.len) addr = Math.max(0, g.len - 1)
    const row = Math.floor(addr / this.bpr)
    this.setTop(row - Math.floor(g.visRows / 3))
    if (select) {
      this.sel = addr
      this.render(false)
      this.renderInspector()
    }
  }

  onKey(e) {
    if (this.sel == null) return
    const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -this.bpr, ArrowDown: this.bpr }[e.key]
    if (d == null) return
    e.preventDefault()
    e.stopPropagation()
    const g = this.geometry()
    this.sel = Math.max(0, Math.min(g.len - 1, this.sel + d))
    const row = Math.floor(this.sel / this.bpr)
    if (row < this.topRow) this.setTop(row)
    else if (row >= this.topRow + g.visRows) this.setTop(row - g.visRows + 1)
    else this.render(false)
    this.renderInspector()
  }

  /** Called on every machine update. */
  update(detail = {}) {
    const mem = this.mem
    const p = this.session.prog
    if (!mem) {
      this.empty.hidden = false
      const mod = p && p.module
      if (!mod || !this.session.machine) {
        this.empty.textContent = p && p.error ? 'No instance: the module did not load.' : 'No module loaded.'
      } else {
        // a quiet summary of the whole store, so the pane reads as part of the machine
        const n = (k) => mod.imports.filter((i) => i.kind === k).length
        const row = (name, count, note) => `<div class="st-r${count ? '' : ' none'}"><span class="st-k">${name}</span><span class="st-v mono">${count}</span><span class="st-n">${note}</span></div>`
        this.empty.innerHTML = `<div class="st-h">This module declares no linear memory.</div>
          <div class="st">${row('memories', mod.memories.length, 'byte arrays for load / store')}${row('tables', mod.tables.length, 'references for call_indirect')}${row('globals', mod.globals.length, 'module-wide typed values')}${row('host imports', n('func'), 'functions the host provides')}</div>
          <div class="st-f">The store is everything an instance owns besides its stack and frames. Code that touches none of it computes with the operand stack and locals only.</div>`
      }
      this.toolbar.hidden = true
      this.el.querySelector('.mem-body').hidden = true
      return
    }
    this.empty.hidden = true
    this.toolbar.hidden = false
    this.el.querySelector('.mem-body').hidden = false
    const ev = detail.ev
    this.access = []
    this.fresh = !!detail.anim
    if (ev) {
      const ws = ev.memWrites || (ev.memWrite ? [ev.memWrite] : [])
      for (const w of ws) this.access.push({ addr: w.addr, len: w.len, kind: 'w' })
      if (ev.memRead) this.access.push({ addr: ev.memRead.addr, len: ev.memRead.len, kind: 'r' })
    }
    const pages = mem.bytes.length / 65536
    this.info.textContent = `${pages} page${pages === 1 ? '' : 's'} · ${fmtBytes(mem.bytes.length)}`
    const a = this.access[0]
    this.accessChip.innerHTML = a ? `<span class="acc-${a.kind}">${a.kind === 'w' ? 'write' : 'read'}</span> ${esc(ev.instr.op)} @ 0x${hexN(a.addr, 6)}${a.len > 1 ? `..0x${hexN(a.addr + a.len - 1, 6)}` : ''} <span class="dim">(${a.len} B)</span>` : ''
    if (a && this.follow && !detail.noFollow) {
      const g = this.geometry()
      const row = Math.floor(a.addr / this.bpr)
      const rowEnd = Math.floor((a.addr + Math.max(0, a.len - 1)) / this.bpr)
      if (row < this.topRow || rowEnd >= this.topRow + g.visRows) this.setTop(row - Math.floor(g.visRows / 3))
      if (!this.sel || this.selFollow) {
        this.sel = a.addr
        this.selFollow = true
      }
    }
    this.render(true)
    this.renderInspector()
  }

  render(fromUpdate = false) {
    const mem = this.mem
    if (!mem) return
    const g = this.geometry()
    if (this.topRow > g.maxTop) this.topRow = g.maxTop
    this.spacer.style.height = g.spacerPx + 'px'
    this.syncScrollbar(g)
    const bytes = mem.bytes
    const bpr = this.bpr
    const acc = this.access
    const fresh = fromUpdate && this.fresh
    const accAt = (a) => {
      for (const x of acc) if (a >= x.addr && a < x.addr + x.len) return x.kind
      return null
    }
    const selRange = this.selRange()
    let html = ''
    const end = Math.min(g.totalRows, this.topRow + g.visRows + 1)
    const aw = g.len > 0x1000000 ? 8 : 6
    for (let r = this.topRow; r < end; r++) {
      const base = r * bpr
      let hx = ''
      let asc = ''
      for (let k = 0; k < bpr; k++) {
        const a = base + k
        if (a >= g.len) {
          hx += '<span class="b pad">  </span>'
          continue
        }
        const b = bytes[a]
        const ak = accAt(a)
        let cls = b === 0 ? 'b z' : 'b'
        if (ak) cls += ' ' + ak + (fresh ? ' new' : '')
        if (selRange && a >= selRange[0] && a < selRange[1]) cls += a === this.sel ? ' sel' : ' selr'
        if (k && k % 4 === 0) cls += ' q'
        hx += `<span class="${cls}" data-a="${a}">${hex2(b)}</span>`
        asc += `<span class="${ak ? 'c ' + ak : 'c'}${a === this.sel ? ' sel' : ''}" data-a="${a}">${esc(asciiChar(b))}</span>`
      }
      html += `<div class="mr" style="top:${(r - this.topRow) * RH}px"><span class="ma">${hexN(base, aw)}</span><span class="mh">${hx}</span><span class="mc">${asc}</span></div>`
    }
    this.rows.innerHTML = html
  }

  selRange() {
    const a = this.hover ?? this.sel
    if (a == null) return null
    return [a, a + 1]
  }

  /** Screen rect of the cell for an address, if it is on screen. */
  cellRect(addr) {
    const c = this.rows.querySelector(`.b[data-a="${addr}"]`)
    return c ? c.getBoundingClientRect() : null
  }

  renderInspector() {
    const mem = this.mem
    const a = this.hover ?? this.sel
    if (!mem || a == null || a >= mem.bytes.length) {
      this.insp.innerHTML = '<div class="insp-h">Inspector</div><div class="dim insp-hint">Hover or click a byte to decode the bytes from there, little-endian.</div>'
      return
    }
    const bytes = mem.bytes
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const can = (n) => a + n <= bytes.length
    const row = (t, cls, v) => `<div class="insp-r"><span class="ty ${cls}">${t}</span><span class="mono">${v}</span></div>`
    let out = `<div class="insp-h mono">0x${hexN(a, 8)}${this.hover == null ? '' : ' <span class="dim">hover</span>'}</div>`
    out += row('u8 / i8', 't-i32', `${bytes[a]} / ${(bytes[a] << 24) >> 24}`)
    out += row('u16 / i16', 't-i32', can(2) ? `${dv.getUint16(a, true)} / ${dv.getInt16(a, true)}` : '—')
    out += row('i32', 't-i32', can(4) ? `${dv.getInt32(a, true)}` : '—')
    out += row('u32', 't-i32', can(4) ? `${dv.getUint32(a, true)}` : '—')
    out += row('i64', 't-i64', can(8) ? `${dv.getBigInt64(a, true)}` : '—')
    out += row('f32', 't-f32', can(4) ? `${shortNum(dv.getFloat32(a, true), 'f32')}` : '—')
    out += row('f64', 't-f64', can(8) ? `${shortNum(dv.getFloat64(a, true), 'f64')}` : '—')
    let n = 0
    while (n < 40 && a + n < bytes.length && bytes[a + n] !== 0) n++
    let str = ''
    try {
      str = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(a, a + n))
    } catch {
      str = ''
    }
    out += `<div class="insp-r str"><span class="ty t-ref">utf-8</span><span class="mono">${n ? '"' + esc(str.replace(/\n/g, '\\n')) + '"' + (n >= 40 ? '…' : '') : '<span class="dim">(starts with 00)</span>'}</span></div>`
    this.insp.innerHTML = out
  }
}

function shortNum(x, t) {
  if (Number.isNaN(x)) return 'nan'
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf'
  if (t === 'f32') return String(Math.fround(x)).length > 14 ? x.toPrecision(7) : String(Math.fround(x))
  const s = String(x)
  return s.length > 16 ? x.toPrecision(10) : s
}

function parseAddr(s) {
  s = s.trim().replace(/_/g, '')
  if (!s) return null
  const v = /^0x[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : /^[0-9]+$/.test(s) ? parseInt(s, 10) : /^[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : null
  return v == null || Number.isNaN(v) ? null : v
}
