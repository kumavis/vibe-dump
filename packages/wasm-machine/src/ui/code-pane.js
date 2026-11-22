// CODE pane: the current function as WAT, with the next and last executed
// instructions marked, structured-control brackets in the gutter, branch
// arrows, breakpoints, and the instruction bar (signature + description).
// Only the visible lines are in the DOM.
import { h, s, icon, iconButton, esc, rafThrottle, clear } from './dom.js'
import { instrText } from '../engine/index.js'
import { watModel, disasmModel, enclosing } from './code-model.js'
import { highlightLine } from './wat-highlight.js'
import { describe, signature } from './opinfo.js'
import { sigHTML, valuesHTML, typeClass, shortType, addrHex } from './format.js'
import { TRAP_EXPLAIN, STAGE_TITLE, STAGE_EXPLAIN } from './explain.js'
import { prefs } from './prefs.js'

const LH_DENSE = 22
const LH_ROOMY = 25
const LN_W = 46
const LANE_W = 9

export class CodePane {
  constructor(session, opts = {}) {
    this.session = session
    this.opts = opts
    this.walk = null // { f, pc } validation walk cursor (lesson 3)
    this.showTypes = false
    this.models = new Map()
    this.wat = null
    this.hlCache = new Map()
    this.lastCenter = null
    this.chW = 7.8
    this.lh = LH_DENSE

    this.title = h('div', { class: 'pane-title code-title' })
    this.badge = h('span', { class: 'state-badge' })
    this.followBtn = h('button', { class: 'chip-btn', type: 'button', hidden: true, onclick: () => { const p = session.prog; p.viewFunc = null; p.viewFrame = null; session.emit('update', {}) } }, 'Back to current')
    this.typesBtn = h('button', { class: 'chip-btn toggle', type: 'button', 'aria-pressed': 'false', title: 'Show the validator\'s static type stack before each instruction', onclick: () => this.toggleTypes() }, 'Types')
    this.editBtn = h('button', { class: 'chip-btn', type: 'button', onclick: () => opts.onEdit && opts.onEdit() }, icon('edit', 13), h('span', {}, 'Edit WAT'))
    const header = h('div', { class: 'pane-head' },
      h('span', { class: 'pane-label' }, 'Code'), this.title, h('span', { class: 'grow' }), this.followBtn, this.badge, this.typesBtn, this.editBtn)

    this.banner = h('div', { class: 'code-banner', hidden: true })
    this.sizer = h('div', { class: 'code-sizer' })
    this.rows = h('div', { class: 'code-rows' })
    this.boxes = h('div', { class: 'code-boxes', 'aria-hidden': 'true' })
    this.svg = s('svg', { class: 'code-svg', 'aria-hidden': 'true' })
    this.sizer.append(this.boxes, this.rows, this.svg)
    this.scroll = h('div', { class: 'code-scroll', tabindex: '0', role: 'region', 'aria-label': 'Code listing' }, this.sizer)
    this.scroll.addEventListener('scroll', rafThrottle(() => this.renderWindow()))
    this.rows.addEventListener('click', (e) => {
      const row = e.target.closest('.cl')
      if (!row) return
      const line = +row.dataset.l
      if (e.target.closest('.ln')) this.toggleBpAtLine(line)
    })
    this.bar = h('div', { class: 'instr-bar', 'aria-live': 'polite' })
    this.measure = h('span', { class: 'code-measure', 'aria-hidden': 'true' }, 'M'.repeat(100))
    this.el = h('section', { class: 'pane code-pane', 'data-pane': 'code', 'aria-label': 'Code' }, header, this.banner, this.scroll, this.bar, this.measure)
    new ResizeObserver(() => this.renderWindow()).observe(this.scroll)
  }

  toggleTypes(on = !this.showTypes) {
    this.showTypes = on
    this.typesBtn.setAttribute('aria-pressed', String(on))
    this.renderWindow()
  }

  reset() {
    this.models.clear()
    this.wat = null
    this.hlCache.clear()
    this.lastCenter = null
  }

  /** The function the pane shows and the model for it. */
  view() {
    const sess = this.session
    const p = sess.prog
    if (!p) return null
    const m = p.machine
    let f = null
    let framePc = null
    if (p.viewFunc != null) f = p.viewFunc
    else if (p.viewFrame != null && m) {
      const fr = sess.frames()[p.viewFrame]
      if (fr) { f = fr.funcIndex; framePc = fr.pc - 1 }
    }
    if (f == null && this.walk) f = this.walk.f
    if (f == null && m) {
      const loc = m.location
      if (loc) f = loc.funcIndex
      else if (m.trap && m.trap.funcIndex != null) f = m.trap.funcIndex
      else {
        const ev = p.events.get(m.steps)
        if (ev) f = ev.funcIndex
        else if (m.entry && !m.entry.host) f = m.entry.index
      }
    }
    if (f == null && p.error && p.error.funcIndex != null) f = p.error.funcIndex
    const mod = p.module
    if (f == null && mod) {
      const ex = mod.exports.find((e) => e.kind === 'func' && mod.funcs[e.index].body)
      f = ex ? ex.index : mod.funcs.findIndex((x) => x.body)
      if (f < 0) f = null
    }
    let model = null
    if (p.wat != null && (f == null || !mod || !mod.funcs[f] || !mod.funcs[f].import)) {
      if (!this.wat) this.wat = watModel(p)
      if (f == null || this.wat.funcs.has(f) || !p.sourceMap) model = this.wat
    }
    if (!model && mod && f != null && mod.funcs[f]) {
      if (!mod.funcs[f].body) model = importModel(mod, f, sess.funcLabel(f))
      else {
        if (!this.models.has(f)) this.models.set(f, disasmModel(mod, f))
        model = this.models.get(f)
      }
    }
    return { f, model, framePc }
  }

  toggleBpAtLine(line) {
    const v = this.current
    if (!v || !v.model || !this.session.prog.machine) return
    const t = v.model.lineTarget(line)
    if (t) this.session.toggleBreakpoint(t.f, t.pc)
  }

  update() {
    const sess = this.session
    const p = sess.prog
    const v = this.view()
    this.current = v
    this.badge.textContent = stateText(sess)
    this.badge.dataset.state = sess.running ? 'running' : p && p.machine ? p.machine.status : p && p.error ? 'error' : 'none'
    this.typesBtn.hidden = !p || !p.module || !p.module.validated
    this.editBtn.hidden = !p || p.wat == null || !this.opts.onEdit
    if (!p || !v || !v.model) {
      this.title.textContent = ''
      clear(this.rows)
      clear(this.svg)
      clear(this.boxes)
      this.sizer.style.height = '0px'
      this.renderBanner()
      this.renderBar()
      return
    }
    const mod = p.module
    const m = p.machine
    // title
    if (v.f != null && mod && mod.funcs[v.f]) {
      const t = mod.funcs[v.f].type
      this.title.innerHTML = `<span class="fn-name">${esc(sess.funcLabel(v.f))}</span> ${sigHTML(t.params, t.results)}`
    } else this.title.textContent = p.name
    const browsing = p.viewFunc != null || p.viewFrame != null
    this.followBtn.hidden = !browsing
    this.followBtn.textContent = p.viewFrame != null ? 'Back to the top frame' : 'Back to current'

    // highlight targets
    const ev = m ? p.events.get(m.steps) : null
    const loc = m ? m.location : null
    this.marks = []
    const mark = (f, pc, cls) => {
      if (f !== v.f || pc == null || pc < 0) return
      const r = v.model.locate(f, pc)
      if (r) this.marks.push({ ...r, cls })
    }
    if (v.framePc != null) mark(v.f, v.framePc, 'frame')
    else {
      if (ev && ev.instance === m.instance && !(m.status === 'trapped' && ev.control && ev.control.kind === 'trap')) mark(ev.funcIndex, ev.pc, 'last')
      if (loc && loc.inst === m.instance) mark(loc.funcIndex, loc.pc, 'next')
      if (m && m.status === 'trapped' && m.trap) mark(m.trap.funcIndex, m.trap.pc, 'trap')
    }
    if (this.walk) mark(this.walk.f, this.walk.pc, 'walk')
    if (p.error && p.error.funcIndex != null && p.error.pc != null) mark(p.error.funcIndex, p.error.pc, 'error')
    if (p.error && p.error.line != null && v.model.kind === 'wat') {
      const ln = p.error.line - 1
      const text = v.model.lines[ln] ? v.model.lines[ln].text : ''
      let c1 = p.error.col - 1
      while (c1 < text.length && !/[\s()]/.test(text[c1])) c1++
      this.marks.push({ line: ln, col0: p.error.col - 1, col1: Math.max(c1, p.error.col), cls: 'error' })
    }
    // branch arrow for the step just taken
    this.arrow = null
    if (!browsing && ev && ev.control && ev.funcIndex === v.f && ev.instance === m.instance && mod.validated) this.arrow = this.arrowFor(v, ev)

    if (this.lastModel !== v.model) {
      this.lastModel = v.model
      this.hlCache.clear()
      this.lastCenter = null
    }
    // short programs (lessons) get roomier type; long listings stay dense
    const roomy = v.model.lines.length <= 40 && (!this.opts.roomy || this.opts.roomy())
    this.lh = roomy ? LH_ROOMY : LH_DENSE
    this.el.classList.toggle('roomy', roomy)
    this.sizer.style.setProperty('--lh', this.lh + 'px')
    this.sizer.style.height = v.model.lines.length * this.lh + 8 + 'px'
    // deep nesting: squeeze the lanes rather than push the code off screen
    this.laneW = v.model.lanes > 8 ? Math.max(3, 72 / v.model.lanes) : LANE_W
    const gutterW = LN_W + (v.model.lanes ? v.model.lanes * this.laneW + 8 : 4)
    this.textLeft = gutterW + 10
    this.sizer.style.setProperty('--text-left', this.textLeft + 'px')
    this.sizer.style.setProperty('--gutter-w', gutterW + 'px')
    // keep the focus line in view
    const focus = this.marks.find((x) => x.cls === 'walk') || this.marks.find((x) => x.cls === 'trap') || this.marks.find((x) => x.cls === 'frame') || this.marks.find((x) => x.cls === 'next') || this.marks.find((x) => x.cls === 'error') || this.marks.find((x) => x.cls === 'last')
    this.renderBanner()
    this.renderBar()
    if (focus) this.ensureVisible(focus.line, focus.rangeLine1 ?? focus.line)
    this.renderWindow()
  }

  ensureVisible(line, line1 = line) {
    const sc = this.scroll
    const top = line * this.lh
    const bottom = (line1 + 1) * this.lh
    const vh = sc.clientHeight || 300
    if (top < sc.scrollTop + this.lh || bottom > sc.scrollTop + vh - this.lh) {
      // snap to whole lines so no line is cut at the top edge
      sc.scrollTop = Math.max(0, Math.round((top - vh * 0.35) / this.lh) * this.lh)
    }
  }

  /** Arrow geometry for a control-transfer event, in model lines. */
  arrowFor(v, ev) {
    const c = ev.control
    const mod = this.session.module
    const model = v.model
    const br = model.brackets.filter((b) => b.f === v.f)
    const fromLoc = model.locate(v.f, ev.pc)
    if (!fromLoc) return null
    const funcEnd = () => {
      const code = mod.funcs[v.f].body.code
      const r = model.locate(v.f, code.length - 1)
      return r ? (r.rangeLine1 ?? r.line) : fromLoc.line
    }
    if (c.kind === 'branch' && c.taken) {
      const enc = enclosing(mod, v.f, ev.pc)
      const tgtStart = enc[enc.length - 1 - c.depth]
      if (tgtStart == null) return { from: fromLoc.line, to: funcEnd(), lane: -1, kind: 'func', dir: 'down' }
      const b = br.find((x) => x.startPc === tgtStart)
      if (!b) return null
      if (c.labelKind === 'loop') return { from: fromLoc.line, to: b.line0, lane: b.lane, bracket: b, kind: 'loop', dir: 'up' }
      return { from: fromLoc.line, to: b.line1, lane: b.lane, bracket: b, kind: b.kind, dir: 'down' }
    }
    if (c.kind === 'branch' && c.implicit) {
      const b = br.find((x) => x.elsePc === ev.pc)
      if (b) return { from: fromLoc.line, to: b.line1, lane: b.lane, bracket: b, kind: 'if', dir: 'down', soft: true }
    }
    if (c.kind === 'enter-block' && c.blockKind === 'if' && !c.taken) {
      const b = br.find((x) => x.startPc === ev.pc)
      if (b) return { from: fromLoc.line, to: b.lineElse >= 0 ? b.lineElse : b.line1, lane: b.lane, bracket: b, kind: 'if', dir: 'down', soft: true }
    }
    if (c.kind === 'return' && (ev.instr.op === 'return' || c.viaBranch)) {
      return { from: fromLoc.line, to: funcEnd(), lane: -1, kind: 'func', dir: 'down' }
    }
    return null
  }

  measureChar() {
    // layout px (offsetWidth), not screen px: stays right under CSS zoom
    const w = this.measure.offsetWidth
    if (w > 0) this.chW = w / 100
  }

  renderWindow() {
    const v = this.current
    if (!v || !v.model) return
    this.measureChar()
    const model = v.model
    const sc = this.scroll
    const n = model.lines.length
    const first = Math.max(0, Math.floor(sc.scrollTop / this.lh) - 6)
    const last = Math.min(n, first + Math.ceil((sc.clientHeight || 400) / this.lh) + 12)
    const p = this.session.prog
    const lineCls = new Map()
    for (const mk of this.marks || []) {
      const prev = lineCls.get(mk.line)
      lineCls.set(mk.line, prev ? prev + ' ' + mk.cls : mk.cls)
    }
    // breakpoint lines
    const bpLines = new Set()
    if (p && p.bps.size) for (const k of p.bps) {
      const [f, pc] = k.split(':').map(Number)
      const r = model.locate(f, pc)
      if (r) bpLines.add(r.line)
    }
    const typeRows = this.showTypes && p.module && p.module.validated ? this.typeAnnotations(v, first, last) : null
    let html = ''
    for (let i = first; i < last; i++) {
      let hl = this.hlCache.get(i)
      if (hl == null) {
        hl = this.highlight(model, i)
        this.hlCache.set(i, hl)
      }
      const cls = (lineCls.get(i) || '') + (bpLines.has(i) ? ' bp' : '') + (model.lineTarget(i) ? ' tgt' : '')
      const ty = typeRows && typeRows.get(i)
      html += `<div class="cl ${cls}" style="top:${i * this.lh}px" data-l="${i}"><span class="ln" title="${model.lineTarget(i) ? 'Toggle breakpoint' : ''}">${i + 1}</span><span class="tx">${hl || ' '}</span>${ty || ''}</div>`
    }
    this.rows.innerHTML = html
    // highlight boxes
    let bx = ''
    const tl = this.textLeft
    for (const mk of this.marks || []) {
      if (mk.line < first || mk.line >= last) continue
      const left = tl + mk.col0 * this.chW - 3
      const width = Math.max(1, mk.col1 - mk.col0) * this.chW + 6
      bx += `<div class="hlbox ${mk.cls}" style="top:${mk.line * this.lh + 2}px;left:${left}px;width:${width}px"></div>`
      if (mk.rangeLine1 != null && mk.rangeLine1 > mk.line && (mk.cls === 'next' || mk.cls === 'last')) {
        bx += `<div class="hlrange ${mk.cls}" style="top:${(mk.line + 1) * this.lh}px;height:${(mk.rangeLine1 - mk.line) * this.lh}px;left:${tl - 6}px"></div>`
      }
    }
    this.boxes.innerHTML = bx
    this.renderSvg(model, first, last)
  }

  highlight(model, i) {
    if (model.kind === 'wat') {
      // block comments can span lines: compute state from the top once
      if (!this.watStates || this.watStates.model !== model) {
        const st = { inBlock: false }
        const states = []
        for (const l of model.lines) {
          states.push(st.inBlock)
          highlightLine(l.text, st)
        }
        this.watStates = { model, states }
      }
      return highlightLine(model.lines[i].text, { inBlock: this.watStates.states[i] })
    }
    return highlightLine(model.lines[i].text, { inBlock: false })
  }

  typeAnnotations(v, first, last) {
    const out = new Map()
    const model = v.model
    for (let i = first; i < last; i++) {
      const t = model.lineTarget(i)
      if (!t) continue
      const ts = this.session.typeStacks(t.f)[t.pc]
      if (!ts) continue
      const chips = ts.unreachable ? '<span class="tchip dead">unreachable</span>' : ts.stack.length ? ts.stack.slice(-6).map((x) => `<span class="tchip ${x ? typeClass(x) : 't-any'}">${x ? shortType(x) : 'any'}</span>`).join('') : '<span class="tchip empty">empty</span>'
      out.set(i, `<span class="types-ann" title="static type stack before this instruction">${ts.stack.length > 6 ? '<span class="dim">…</span>' : ''}${chips}</span>`)
    }
    return out
  }

  renderSvg(model, first, last) {
    const svg = this.svg
    clear(svg)
    const H = model.lines.length * this.lh + 8
    svg.setAttribute('width', this.textLeft)
    svg.setAttribute('height', H)
    const x0 = LN_W + 4
    const lx = (lane) => x0 + lane * this.laneW
    const y = (line) => line * this.lh + this.lh / 2
    const a = this.arrow
    const f = this.current.f
    for (const b of model.brackets) {
      if (b.f !== f && model.kind === 'wat' && model.funcs.size > 1) {
        // all functions of a WAT module are listed; draw every bracket
      }
      if (b.line1 < first || b.line0 > last) continue
      const x = lx(b.lane)
      const active = a && a.bracket === b
      const cls = `brk brk-${b.kind}${active ? ' active' : ''}`
      const d = `M${x + 6} ${y(b.line0)} H${x} V${y(b.line1)} H${x + 6}`
      svg.appendChild(s('path', { d, class: cls }))
      if (b.kind === 'loop') svg.appendChild(s('path', { d: `M${x - 2.5} ${y(b.line0) + 5} L${x} ${y(b.line0) + 1} L${x + 2.5} ${y(b.line0) + 5}`, class: cls + ' brk-cap' }))
      if (b.lineElse >= 0) svg.appendChild(s('path', { d: `M${x} ${y(b.lineElse)} H${x + 5}`, class: cls }))
    }
    if (a) {
      const x = a.lane >= 0 ? lx(a.lane) - 0 : x0 - 3
      const tx = this.textLeft - 4
      const yf = y(a.from)
      const yt = y(a.to)
      const d = `M${tx} ${yf} H${x} V${yt} H${tx}`
      const path = s('path', { d, class: 'jump' + (a.soft ? ' soft' : '') + (a.dir === 'up' ? ' up' : '') })
      svg.appendChild(path)
      svg.appendChild(s('path', { d: `M${tx - 5} ${yt - 4} L${tx} ${yt} L${tx - 5} ${yt + 4}`, class: 'jump-head' + (a.soft ? ' soft' : '') }))
      svg.appendChild(s('circle', { cx: tx, cy: yf, r: 2.2, class: 'jump-dot' }))
      if (prefs.anim && this.arrowAnimKey !== a) {
        this.arrowAnimKey = a
        const len = Math.abs(tx - x) * 2 + Math.abs(yt - yf)
        path.style.strokeDasharray = len
        path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' })
      }
    }
  }

  renderBanner() {
    const sess = this.session
    const p = sess.prog
    const b = this.banner
    clear(b)
    b.hidden = true
    b.className = 'code-banner'
    if (!p) return
    const m = p.machine
    if (p.error) {
      const e = p.error
      b.classList.add('err')
      const where = []
      if (e.line != null) where.push(`line ${e.line}, col ${e.col}`)
      if (e.funcIndex != null) where.push(`in ${sess.funcLabel(e.funcIndex)}${e.pc != null ? `, instruction ${e.pc}${e.op ? ' (' + e.op + ')' : ''}` : ''}`)
      if (e.offset != null) where.push(`byte ${addrHex(e.offset)}`)
      b.append(
        h('div', { class: 'ban-title' }, icon('warn', 15), e.feature ? `Unsupported feature: ${e.feature}` : STAGE_TITLE[e.stage] || 'Error'),
        h('div', { class: 'ban-msg mono' }, e.message),
        where.length ? h('div', { class: 'ban-where' }, where.join(' · ')) : null,
        h('div', { class: 'ban-explain' }, e.feature ? `This engine implements WebAssembly 2.0 (MVP, multi-value, bulk memory, reference types, sign extension, saturating conversions). ${e.feature} is a later proposal it does not interpret.` : STAGE_EXPLAIN[e.stage] || ''),
      )
      b.hidden = false
      return
    }
    if (!m) return
    if (m.status === 'trapped' && m.trap) {
      const t = m.trap
      b.classList.add('trap')
      const instr = t.funcIndex != null && p.module.funcs[t.funcIndex].body ? p.module.funcs[t.funcIndex].body.code[t.pc] : null
      const colon = t.message.indexOf(': ')
      b.append(
        h('div', { class: 'ban-title' }, icon('warn', 15), 'Trapped: ', h('span', {}, colon > 0 ? t.message.slice(0, colon) : t.message)),
        colon > 0 ? h('div', { class: 'ban-msg mono' }, t.message.slice(colon + 2)) : null,
        h('div', { class: 'ban-where' }, `${sess.funcLabel(t.funcIndex)} · instruction ${t.pc}${instr ? ' (' + instr.op + ')' : ''} · byte ${t.offset != null ? addrHex(t.offset) : '?'} · step ${m.steps}`),
        h('div', { class: 'ban-explain' }, (TRAP_EXPLAIN[t.kind] || '') + ' A trap aborts the whole call: no results are returned. The machine shows the state just before the faulting instruction; step back to rewind further.'),
      )
      b.hidden = false
    } else if (m.status === 'done' && !this.opts.hideDone) {
      b.classList.add('done')
      b.append(h('div', { class: 'ban-title' }, icon('check', 15), 'Returned ', h('span', { class: 'mono vals', html: valuesHTML(m.results) }), h('span', { class: 'dim' }, ` after ${m.steps} step${m.steps === 1 ? '' : 's'}`)))
      b.hidden = false
    } else if (m.status === 'exited') {
      b.classList.add('done')
      b.append(h('div', { class: 'ban-title' }, icon('check', 15), `Exited with code ${m.exitCode}`, h('span', { class: 'dim' }, ` (proc_exit) after ${m.steps} steps`)))
      b.hidden = false
    }
  }

  renderBar() {
    const sess = this.session
    const p = sess.prog
    const bar = this.bar
    const v = this.current
    if (!p || !p.module || !p.module.validated || !v || v.f == null || !p.module.funcs[v.f] || !p.module.funcs[v.f].body) {
      bar.innerHTML = '<span class="ib-k">—</span><span class="ib-desc dim">No instruction selected.</span>'
      return
    }
    const m = p.machine
    let pc = null
    let label = 'Next'
    if (this.walk) { pc = this.walk.pc; label = 'Checking' }
    else if (v.framePc != null) { pc = v.framePc; label = 'Caller at' }
    else if (m && m.status === 'trapped' && m.trap && m.trap.funcIndex === v.f) { pc = m.trap.pc; label = 'Trapped at' }
    else if (m && m.location && m.location.funcIndex === v.f) pc = m.location.pc
    else {
      const ev = m && p.events.get(m.steps)
      if (ev && ev.funcIndex === v.f) { pc = ev.pc; label = 'Last' }
    }
    if (pc == null) {
      bar.innerHTML = `<span class="ib-k">${m && m.status === 'idle' ? 'Idle' : 'Done'}</span><span class="ib-desc dim">${m && m.status === 'idle' ? 'Invoke an exported function to start executing.' : 'The call has finished. Step back or restart to replay it.'}</span>`
      return
    }
    const instr = p.module.funcs[v.f].body.code[pc]
    const sig = signature(p.module, v.f, pc, (f) => sess.typeStacks(f))
    const ctx = {
      module: p.module,
      funcLabel: (i) => '$' + sess.funcLabel(i),
      isFuncEnd: pc === p.module.funcs[v.f].body.code.length - 1,
      localName: (i) => {
        const n = p.module.names.locals.get(v.f)
        return n && n.get(i) ? `$${n.get(i)} (${i})` : String(i)
      },
      labelText: (d) => {
        const enc = enclosing(p.module, v.f, pc)
        const st = enc[enc.length - 1 - d]
        if (st == null) return 'the function body'
        const k = p.module.funcs[v.f].body.code[st].op
        const nm = this.wat && this.wat.labelNames.get(v.f) && this.wat.labelNames.get(v.f).get(st)
        return `${k}${nm ? ' ' + nm : ''}, ${k === 'loop' ? 'back to its start' : 'forward past its end'}`
      },
    }
    bar.innerHTML = `<span class="ib-k ${label === 'Trapped at' ? 'trap' : ''}">${label}</span><span class="ib-op mono">${esc(instrText(instr))}</span>${sigHTML(sig.params, sig.results)}<span class="ib-desc">${esc(describe(instr, ctx))}</span>`
  }

  /** Bounding rect of the line for a pc (for overlays), or null. */
  lineRect(f, pc) {
    const v = this.current
    if (!v || !v.model) return null
    const r = v.model.locate(f, pc)
    if (!r) return null
    const row = this.rows.querySelector(`.cl[data-l="${r.line}"]`)
    return row ? row.getBoundingClientRect() : null
  }
}

function importModel(mod, f, name) {
  const fn = mod.funcs[f]
  const t = fn.type
  const text = [`(import "${fn.import.module}" "${fn.import.name}"`, `  (func $${name} (param ${t.params.join(' ')}) (result ${t.results.join(' ')})))`, '', ';; A host function: implemented outside wasm,', ';; so it has no instructions to show.']
  return { kind: 'import', lines: text.map((x) => ({ text: x })), locate: () => null, lineTarget: () => null, brackets: [], lanes: 0, funcs: new Set([f]), labelNames: new Map() }
}

export function stateText(sess) {
  const p = sess.prog
  if (!p) return ''
  if (p.error) return 'Error'
  const m = p.machine
  if (!m) return ''
  if (sess.running) return sess.task && sess.task.kind !== 'run' ? 'Stepping…' : 'Running'
  switch (m.status) {
    case 'idle': return 'Not invoked'
    case 'ready': return sess.lastStop === 'breakpoint' ? 'Breakpoint' : m.steps ? 'Paused' : 'Ready'
    case 'done': return 'Returned'
    case 'trapped': return 'Trapped'
    case 'exited': return 'Exited'
  }
  return m.status
}
