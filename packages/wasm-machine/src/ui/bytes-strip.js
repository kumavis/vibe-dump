// BYTES strip: the binary of the current function body, with the bytes of
// the next instruction (and the one just executed) highlighted in step with
// the code pane. Virtualised by row.
import { h, rafThrottle, esc } from './dom.js'
import { hex2, hexN } from './format.js'
import { instrText } from '../engine/index.js'

const RH = 20

export class BytesStrip {
  constructor(session, hooks = {}) {
    this.session = session
    this.hooks = hooks
    this.f = null
    this.title = h('span', { class: 'pane-meta bytes-title' })
    this.legend = h('span', { class: 'bytes-legend' },
      h('span', { class: 'lg lg-size' }, 'size'), h('span', { class: 'lg lg-locals' }, 'locals'), h('span', { class: 'lg lg-op' }, 'opcode'), h('span', { class: 'lg lg-imm' }, 'immediate'))
    this.spacer = h('div', { class: 'bytes-spacer' })
    this.rows = h('div', { class: 'bytes-rows mono' })
    this.spacer.appendChild(this.rows)
    this.groups = h('div', { class: 'bgroups mono', hidden: true })
    this.scroll = h('div', { class: 'bytes-scroll', tabindex: '0', role: 'region', 'aria-label': 'Function body bytes' }, this.spacer, this.groups)
    this.tip = h('div', { class: 'bytes-tip mono', 'aria-live': 'polite' })
    this.el = h('section', { class: 'pane bytes-pane', 'data-pane': 'bytes', 'aria-label': 'Function bytes' },
      h('div', { class: 'pane-head' }, h('span', { class: 'pane-label' }, 'Bytes'), this.title, h('span', { class: 'grow' }), this.legend),
      this.scroll, this.tip)
    this.scroll.addEventListener('scroll', rafThrottle(() => this.renderRows()))
    this.rows.addEventListener('mouseover', (e) => {
      const b = e.target.closest('[data-o]')
      this.hoverAt(b ? +b.dataset.o : null)
    })
    this.rows.addEventListener('mouseleave', () => this.hoverAt(null))
    this.groups.addEventListener('mouseover', (e) => {
      const b = e.target.closest('[data-o]')
      this.hoverAt(b ? +b.dataset.o : null)
    })
    this.groups.addEventListener('mouseleave', () => this.hoverAt(null))
    new ResizeObserver(() => this.layout()).observe(this.scroll)
  }

  hoverAt(o) {
    if (o === this.hover) return
    this.hover = o
    this.renderRows()
    this.renderTip()
  }

  setFunc(f) {
    const mod = this.session.module
    if (f === this.f && mod === this.mod) return
    this.f = f
    this.mod = mod
    this.starts = null
    const body = mod && f != null && mod.funcs[f] ? mod.funcs[f].body : null
    this.body = body
    if (body) {
      this.starts = body.code.map((i) => i.offset)
      this.scroll.scrollTop = 0
    }
    // small bodies: one labelled group per instruction; large ones: a virtual hex grid
    this.grouped = !!body && body.code.length <= 800
    this.groups.hidden = !this.grouped
    this.spacer.hidden = this.grouped
    if (this.grouped) this.buildGroups()
    this.layout()
  }

  buildGroups() {
    const body = this.body
    const bytes = this.session.module.bytes
    const span = (o0, o1, cls) => {
      let s = ''
      for (let o = o0; o < o1; o++) s += `<span class="${typeof cls === 'function' ? cls(o) : cls}" data-o="${o}">${hex2(bytes[o])}</span>`
      return s
    }
    let html = `<div class="bgp g-size" title="body size, LEB128"><div class="bgb">${span(body.offset, body.start, 'k-size')}</div><div class="bgl">size ${body.size}</div></div>`
    const nl = body.locals.reduce((a, l) => a + l.count, 0)
    html += `<div class="bgp g-locals" title="local declarations"><div class="bgb">${span(body.localsOffset, body.codeOffset, 'k-locals')}</div><div class="bgl">${nl ? nl + ' local' + (nl === 1 ? '' : 's') : 'no locals'}</div></div>`
    const depthAt = []
    let d = 0
    body.code.forEach((ins, pc) => {
      if (ins.op === 'end' || ins.op === 'else') d = Math.max(0, d - 1)
      depthAt[pc] = d
      if (ins.op === 'block' || ins.op === 'loop' || ins.op === 'if' || ins.op === 'else') d++
    })
    body.code.forEach((ins, pc) => {
      const opLen = ins.code >= 0xe0 ? 2 : 1
      const txt = instrText(ins)
      const short = txt.length > 18 ? txt.slice(0, 17) + '…' : txt
      html += `<div class="bgp${depthAt[pc] ? ' nest' : ''}" data-pc="${pc}" style="--d:${Math.min(depthAt[pc], 6)}"><div class="bgb">${span(ins.offset, ins.offset + ins.len, (o) => (o < ins.offset + opLen ? 'k-op' : 'k-imm'))}</div><div class="bgl">${esc(short)}</div></div>`
    })
    this.groups.innerHTML = html
    this.gEls = Array.from(this.groups.querySelectorAll('[data-pc]'))
  }

  renderGroups() {
    const body = this.body
    for (const el of this.groups.querySelectorAll('.next, .last, .trap, .hov')) el.classList.remove('next', 'last', 'trap', 'hov')
    const at = (r) => (r ? this.gEls[this.pcAt(r[0])] : null)
    const n = at(this.next)
    if (n) n.classList.add(this.nextCls)
    const l = at(this.last)
    if (l && l !== n) l.classList.add('last')
    if (this.hover != null) {
      const pc = this.pcAt(this.hover)
      const el = this.hover >= body.codeOffset ? this.gEls[pc] : this.groups.querySelector(this.hover < body.start ? '.g-size' : '.g-locals')
      if (el) el.classList.add('hov')
    }
  }

  layout() {
    if (this.grouped) return this.renderGroups()
    const w = this.scroll.clientWidth || 400
    // offset column 7ch + bytes at 3ch each
    const ch = 7.4
    const per = Math.floor((w - 9 * ch - 16) / (3 * ch))
    this.bpr = per >= 32 ? 32 : per >= 24 ? 24 : per >= 16 ? 16 : 8
    if (!this.body) {
      this.spacer.style.height = '0px'
      this.rows.innerHTML = ''
      return
    }
    this.base = this.body.offset
    const n = this.body.end - this.base
    this.nrows = Math.ceil(n / this.bpr)
    this.spacer.style.height = this.nrows * RH + 'px'
    this.renderRows()
  }

  pcAt(o) {
    const st = this.starts
    if (!st || o < this.body.codeOffset) return -1
    let lo = 0
    let hi = st.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (st[mid] <= o) lo = mid
      else hi = mid - 1
    }
    return lo
  }

  update(f) {
    this.setFunc(f)
    const sess = this.session
    const m = sess.machine
    const p = sess.prog
    const body = this.body
    if (!body) {
      this.title.textContent = ''
      this.tip.textContent = sess.module && f != null && sess.module.funcs[f] ? 'Imported function: its body lives in the host, not in this binary.' : sess.prog && sess.prog.error ? 'No bytes: the module did not load.' : ''
      return
    }
    const ev = m ? p.events.get(m.steps) : null
    const loc = m && m.location
    this.next = loc && loc.funcIndex === f && loc.inst === m.instance ? [loc.instr.offset, loc.instr.offset + loc.instr.len] : null
    if (m && m.status === 'trapped' && m.trap && m.trap.funcIndex === f) {
      const ins = body.code[m.trap.pc]
      this.next = [ins.offset, ins.offset + ins.len]
      this.nextCls = 'trap'
    } else this.nextCls = 'next'
    if (p.viewFrame != null) {
      const fr = sess.frames()[p.viewFrame]
      if (fr && fr.funcIndex === f) {
        const ins = body.code[fr.pc - 1]
        if (ins) this.next = [ins.offset, ins.offset + ins.len]
      }
    }
    this.last = ev && ev.funcIndex === f && ev.instance === m.instance && !(ev.control && ev.control.kind === 'trap') ? [ev.offset, ev.offset + ev.instr.len] : null
    if (this.walkRange) this.next = this.walkRange
    const size = body.end - body.offset
    this.title.innerHTML = `<span class="mono">0x${hexN(body.offset, 5)}–0x${hexN(body.end - 1, 5)}</span> · ${size.toLocaleString()} B · ${body.code.length.toLocaleString()} instructions`
    // keep the highlighted bytes in view
    const focus = this.next || this.last
    if (focus && this.grouped) {
      const el = this.gEls[this.pcAt(focus[0])]
      if (el) {
        const top = el.offsetTop - this.groups.offsetTop
        const vh = this.scroll.clientHeight || 80
        if (top < this.scroll.scrollTop || top + el.offsetHeight > this.scroll.scrollTop + vh) this.scroll.scrollTop = Math.max(0, top - vh / 3)
      }
    } else if (focus) {
      const r0 = Math.floor((focus[0] - this.base) / this.bpr)
      const vh = this.scroll.clientHeight || 80
      if (r0 * RH < this.scroll.scrollTop || (r0 + 1) * RH > this.scroll.scrollTop + vh) this.scroll.scrollTop = Math.max(0, r0 * RH - vh / 3)
    }
    this.renderRows()
    this.renderTip()
  }

  renderRows() {
    const body = this.body
    if (!body) return
    if (this.grouped) return this.renderGroups()
    const first = Math.max(0, Math.floor(this.scroll.scrollTop / RH) - 2)
    const last = Math.min(this.nrows, first + Math.ceil((this.scroll.clientHeight || 100) / RH) + 4)
    const bytes = this.session.module.bytes
    const bpr = this.bpr
    const inR = (o, r) => r && o >= r[0] && o < r[1]
    const hp = this.hover != null ? this.pcAt(this.hover) : -1
    const hr = hp >= 0 ? [body.code[hp].offset, body.code[hp].offset + body.code[hp].len] : this.hover != null ? [this.hover, this.hover + 1] : null
    let html = ''
    for (let r = first; r < last; r++) {
      const o0 = this.base + r * bpr
      let cells = ''
      for (let k = 0; k < bpr; k++) {
        const o = o0 + k
        if (o >= body.end) break
        let cls
        if (o < body.start) cls = 'k-size'
        else if (o < body.codeOffset) cls = 'k-locals'
        else {
          const pc = this.pcAt(o)
          const ins = body.code[pc]
          const opLen = ins.code >= 0xe0 ? 2 : 1 // 0xFC-prefixed ops: prefix + sub-opcode
          cls = o < ins.offset + opLen ? 'k-op' : 'k-imm'
          if (o === ins.offset) cls += ' k-start'
        }
        if (inR(o, this.next)) cls += ' ' + this.nextCls
        else if (inR(o, this.last)) cls += ' last'
        if (inR(o, hr)) cls += ' hov'
        cells += `<span class="${cls}" data-o="${o}">${hex2(bytes[o])}</span>`
      }
      html += `<div class="br" style="top:${r * RH}px"><span class="bo">${hexN(o0, 5)}</span>${cells}</div>`
    }
    this.rows.innerHTML = html
  }

  renderTip() {
    const body = this.body
    if (!body) return
    const o = this.hover
    const tip = this.tip
    const bytes = this.session.module.bytes
    const show = (o0, o1, label) => `<span class="dim">0x${hexN(o0, 5)}</span> <span class="tip-bytes">${Array.from(bytes.subarray(o0, o1), hex2).join(' ')}</span> <span class="tip-l">${label}</span>`
    if (o != null) {
      if (o < body.start) tip.innerHTML = show(body.offset, body.start, `body size = ${body.size} (LEB128)`)
      else if (o < body.codeOffset) tip.innerHTML = show(body.localsOffset, body.codeOffset, `local declarations: ${body.locals.map((l) => l.count + ' × ' + l.type).join(', ') || 'none'}`)
      else {
        const pc = this.pcAt(o)
        const ins = body.code[pc]
        tip.innerHTML = show(ins.offset, ins.offset + ins.len, `${esc(instrText(ins))} <span class="dim">(pc ${pc})</span>`)
      }
      return
    }
    const r = this.next || this.last
    if (r) {
      const pc = this.pcAt(r[0])
      const ins = body.code[pc]
      tip.innerHTML = `<span class="tip-k">${this.next ? (this.nextCls === 'trap' ? 'trapped' : this.walkRange ? 'checking' : 'next') : 'last'}</span> ` + show(ins.offset, ins.offset + ins.len, `${esc(instrText(ins))}${ins.len > 1 ? ' <span class="dim">· ' + immNote(ins) + '</span>' : ''}`)
    } else tip.innerHTML = '<span class="dim">Hover a byte to see which instruction it encodes.</span>'
  }

  /** Rect of the first highlighted (next) byte, for overlays. */
  nextRect() {
    const el = this.rows.querySelector('.next, .trap')
    return el ? el.getBoundingClientRect() : null
  }
}

function immNote(ins) {
  if (ins.op.endsWith('.const')) return ins.op.startsWith('i') ? 'opcode, then the value as signed LEB128' : 'opcode, then the IEEE 754 bits, little-endian'
  if (ins.memOffset != null) return 'opcode, then align and offset (LEB128)'
  if (ins.local != null) return 'opcode, then the local index (LEB128)'
  if (ins.op === 'call') return 'opcode, then the function index (LEB128)'
  if (ins.depth != null) return 'opcode, then the label depth (LEB128)'
  if (ins.bt) return 'opcode, then the block type'
  return 'opcode, then immediates'
}
