// Wasm Machine: wiring. One Session (engine + transport), one machine view
// shared by the tutorial and the debugger, hash routing, keyboard, theme and
// motion preferences, and the cross-pane motion choreography.
import './styles/base.css'
import './styles/machine.css'
import './styles/side.css'
import helloUrl from '../test/fixtures/hello.wasm?url'

import { h, icon, s } from './ui/dom.js'
import { prefs, setPref, SPEEDS } from './ui/prefs.js'
import { Session } from './ui/session.js'
import { CodePane } from './ui/code-pane.js'
import { StackPane } from './ui/stack-pane.js'
import { FramesPane } from './ui/frames-pane.js'
import { StorePane } from './ui/store-pane.js'
import { BytesStrip } from './ui/bytes-strip.js'
import { BinaryView } from './ui/binary-view.js'
import { Transport } from './ui/transport.js'
import { Tutorial, rich } from './ui/tutorial.js'
import { DebuggerPanel } from './ui/debugger-panel.js'
import { Editor } from './ui/editor.js'
import { Overlay } from './ui/overlay.js'
import { cheatSheet } from './ui/shortcuts.js'
import { EXAMPLES } from './ui/examples.js'
import { LESSONS } from './ui/lessons.js'
import { typeClass } from './ui/format.js'
import { STAGE_TITLE } from './ui/explain.js'

const NEW_WAT = `(module
  (func $add (export "add")
    (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add))`

class App {
  constructor(root) {
    const session = (this.session = new Session())
    this.mode = 'tutorial'
    this.view = 'machine'
    this.overlay = new Overlay()
    this.codePane = new CodePane(session, { onEdit: () => this.openEditor(), roomy: () => this.mode === 'tutorial' })
    this.stack = new StackPane(session)
    this.stack.opts = { toggleHex: () => this.toggleHex() }
    this.frames = new FramesPane(session, { lineOf: (f, pc) => this.lineOf(f, pc) })
    this.store = new StorePane(session)
    this.bytes = new BytesStrip(session)
    this.binary = new BinaryView(session)
    this.editor = new Editor({
      onRun: (text) => this.runEditor(text),
      onCancel: () => this.closeEditor(),
      onReset: () => this.tutorial && this.editor.set(this.tutorial.lesson.wat, { canReset: true }),
    })
    session.labelNames = (f) => (this.codePane.wat ? this.codePane.wat.labelNames.get(f) : null)

    const actions = {
      step: () => this.act('step'),
      back: () => this.act('back'),
      over: () => this.act('over'),
      out: () => this.act('out'),
      toggleRun: () => this.act('run'),
      restart: () => this.act('restart'),
      seek: (n) => this.act('seek', n),
      walkState: () => (this.mode === 'tutorial' && this.tutorial ? this.tutorial.walkState() : null),
      canAutoInvoke: () => this.mode === 'debugger',
    }
    this.transport = new Transport(session, actions)
    this.tutorial = new Tutorial(this)
    this.dbg = new DebuggerPanel(this)

    // ---- layout ----
    this.modeBtns = {}
    const modeTab = (id, label, ic) => (this.modeBtns[id] = h('button', { type: 'button', role: 'tab', class: 'seg', 'aria-selected': 'false', onclick: () => this.setMode(id) }, icon(ic, 14), h('span', {}, label)))
    this.viewBtns = {}
    const viewTab = (id, label, ic) => (this.viewBtns[id] = h('button', { type: 'button', class: 'seg', 'aria-pressed': 'false', title: `${label} view  ·  M`, onclick: () => this.setView(id) }, icon(ic, 14), h('span', {}, label)))
    this.animBtn = h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(prefs.anim), title: 'Animations  ·  A', onclick: () => this.toggleAnim() }, h('span', { class: 'switch-track' }, h('span', { class: 'switch-knob' })), h('span', { class: 'switch-l' }, 'Motion'))
    this.themeBtn = h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Toggle light / dark theme (T)', title: 'Theme  ·  T', onclick: () => this.toggleTheme() })
    this.keys = cheatSheet()
    const keysBtn = h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Keyboard shortcuts (?)', title: 'Keyboard shortcuts  ·  ?', onclick: () => this.keys.showModal() }, icon('keyboard', 18))
    this.progName = h('span', { class: 'prog-name mono' })
    const top = h('header', { class: 'topbar' },
      h('div', { class: 'brand' }, logo(), h('span', { class: 'brand-t' }, 'Wasm Machine')),
      h('nav', { class: 'segs modes', role: 'tablist', 'aria-label': 'Mode' }, modeTab('tutorial', 'Tutorial', 'book'), modeTab('debugger', 'Debugger', 'bug')),
      h('div', { class: 'segs views', role: 'group', 'aria-label': 'View' }, viewTab('machine', 'Machine', 'machine'), viewTab('binary', 'Binary', 'bytes')),
      h('span', { class: 'grow' }), this.progName, this.animBtn, this.themeBtn, keysBtn)

    this.side = h('aside', { class: 'side', 'data-pane': 'side', 'aria-label': 'Lesson and module' }, this.tutorial.el, this.dbg.el)
    this.codeSlot = h('div', { class: 'code-slot' }, this.codePane.el, this.editor.el)
    this.editor.el.hidden = true
    this.machineEl = h('div', { class: 'machine' }, this.codeSlot, this.stack.el, this.frames.el, this.bytes.el, this.store.el)
    this.binaryEl = h('div', { class: 'binary-wrap', hidden: true }, this.binary.el)
    this.mtabs = h('nav', { class: 'mtabs', role: 'tablist', 'aria-label': 'Panes' })
    this.mtab = 'side'
    for (const [id, label] of [['side', 'Lesson'], ['code', 'Code'], ['stack', 'Stack'], ['frames', 'Frames'], ['store', 'Store'], ['bytes', 'Bytes']]) {
      this.mtabs.appendChild(h('button', { type: 'button', role: 'tab', class: 'mtab', 'data-t': id, 'aria-selected': String(id === this.mtab), onclick: () => this.setMobileTab(id) }, label))
    }
    // phones: the current narration beat stays visible above the machine panes
    this.mbeat = h('button', { type: 'button', class: 'mbeat', 'aria-label': 'Current lesson note: open the lesson', onclick: () => this.setMobileTab('side') })
    this.mainEl = h('main', { class: 'main' }, this.mbeat, this.machineEl, this.binaryEl)
    this.drop = h('div', { class: 'drop-veil', hidden: true }, h('div', {}, icon('upload', 28), h('div', {}, 'Drop a .wasm or .wat file to load it')))
    this.toast = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' })
    this.app = h('div', { class: 'app', 'data-mode': 'tutorial', 'data-view': 'machine', 'data-mtab': 'side' }, top, this.mtabs, this.side, this.mainEl, this.transport.el)
    root.append(this.app, this.overlay.el, this.keys, this.drop, this.toast)

    // ---- events ----
    session.on('update', (d) => this.onUpdate(d))
    session.on('load', () => this.onLoad())
    session.on('running', (d) => {
      this.transport.update()
      if (!d.running) this.renderAll({}) // paused: badge, lists and highlights settle
    })
    session.on('blocked', (d) => this.onBlocked(d))
    session.on('breakpoints', () => this.codePane.renderWindow())
    window.addEventListener('keydown', (e) => this.onKey(e))
    window.addEventListener('hashchange', () => this.route())
    this.setupDrop()
    this.applyTheme()
    this.applyAnim()
  }

  motion() {
    return prefs.anim
  }

  lineOf(f, pc) {
    const v = this.codePane.current
    const model = v && v.model && (v.model.funcs.has(f) ? v.model : null)
    const r = model && model.locate(f, pc)
    return r ? r.line : null
  }

  // ---- routing ----
  setHash(h) {
    try {
      history.replaceState(null, '', '#' + h)
    } catch {
      /* sandboxed */
    }
  }

  route() {
    const hash = location.hash.replace(/^#/, '')
    let m
    if ((m = hash.match(/^lesson-(\d+)$/))) {
      this.setMode('tutorial', { load: false })
      this.tutorial.load(Math.max(1, Math.min(LESSONS.length, +m[1])))
    } else if ((m = hash.match(/^example-([\w-]+)$/)) && EXAMPLES.some((e) => e.id === m[1])) {
      this.setMode('debugger', { load: false })
      this.loadExample(m[1])
    } else if (hash === 'debugger') {
      this.setMode('debugger')
    } else {
      this.setMode('tutorial', { load: false })
      this.tutorial.load(1)
      return 'intro'
    }
    return null
  }

  setMode(mode, { load = true } = {}) {
    this.mode = mode
    this.app.dataset.mode = mode
    for (const k in this.modeBtns) this.modeBtns[k].setAttribute('aria-selected', String(k === mode))
    this.tutorial.el.hidden = mode !== 'tutorial'
    this.dbg.el.hidden = mode !== 'debugger'
    this.mtabs.querySelector('[data-t="side"]').textContent = mode === 'tutorial' ? 'Lesson' : 'Module'
    this.spotlight(null)
    if (!load) return
    if (mode === 'debugger') {
      const p = this.session.prog
      if (!p || !p.opts || !p.opts.example && !p.opts.user) {
        this.dbg.examples.open = true
        this.loadExample('fib')
      } else this.setHash(p.opts.example ? 'example-' + p.opts.example : 'debugger')
    } else {
      this.tutorial.go(this.tutorial.lesson ? this.tutorial.lesson.id : 1)
    }
  }

  setView(view, { silent = false } = {}) {
    this.view = view
    this.app.dataset.view = view
    for (const k in this.viewBtns) this.viewBtns[k].setAttribute('aria-pressed', String(k === view))
    this.machineEl.hidden = view !== 'machine'
    this.binaryEl.hidden = view !== 'binary'
    if (view === 'binary') {
      this.binary.ensure()
      requestAnimationFrame(() => {
        this.binary.renderHex()
        this.binary.renderTree()
      })
    }
    if (!silent) this.renderAll({})
  }

  setMobileTab(id) {
    this.mtab = id
    this.app.dataset.mtab = id
    for (const b of this.mtabs.children) b.setAttribute('aria-selected', String(b.dataset.t === id))
    if (id !== 'side' && this.view === 'binary') this.setView('machine')
    requestAnimationFrame(() => this.renderAll({}))
  }

  // ---- loading ----
  prepareLoad() {
    this.overlay.finishAll()
    this.closeEditor()
    this.spotlight(null)
    this.cancelIntro()
  }

  onLoad() {
    this.codePane.reset()
    this.store.onLoad()
    this.dbg.onLoad()
    this.binary.bytes = null
    if (this.view === 'binary') this.binary.ensure()
    const p = this.session.prog
    this.progName.textContent = p ? p.name : ''
    const mod = this.session.module
    const hasStore = !!mod && !!this.session.machine && (mod.memories.length || mod.tables.length || mod.globals.length || mod.imports.length)
    this.machineEl.classList.toggle('no-store', !hasStore)
    this.mtabs.querySelector('[data-t="store"]').hidden = !hasStore
  }

  async loadExample(id) {
    const ex = EXAMPLES.find((e) => e.id === id)
    if (!ex) return
    this.prepareLoad()
    this.setHash('example-' + id)
    if (this.mode !== 'debugger') this.setMode('debugger', { load: false })
    let err
    if (ex.wat) err = this.session.loadWat(ex.wat, { name: ex.id + '.wat', example: id, invoke: ex.invoke })
    else {
      try {
        const res = await fetch(helloUrl)
        const bytes = new Uint8Array(await res.arrayBuffer())
        err = this.session.loadBinary(bytes, { name: 'hello.wasm', example: id, invoke: ex.invoke })
      } catch (e) {
        this.say('Could not load the bundled binary: ' + e.message)
        return
      }
    }
    if (!err && ex.invoke) this.session.invoke(ex.invoke.name, ex.invoke.args)
    this.dbg.renderInvoke()
  }

  async openFile(file) {
    this.prepareLoad()
    if (this.mode !== 'debugger') this.setMode('debugger', { load: false })
    const buf = new Uint8Array(await file.arrayBuffer())
    const looksText = /\.(wat|wast)$/i.test(file.name) || (buf.length && buf[0] !== 0 && new TextDecoder().decode(buf.subarray(0, 64)).trimStart().startsWith('('))
    const t0 = performance.now()
    this.dbg.examples.open = false
    const err = looksText ? this.session.loadWat(new TextDecoder().decode(buf), { name: file.name, user: true }) : this.session.loadBinary(buf, { name: file.name, user: true })
    this.setHash('debugger')
    const fns = this.session.exportedFuncs()
    if (!err) {
      const start = fns.find((f) => f.name === '_start')
      if (start && this.session.status === 'idle') this.session.invoke('_start', [])
      this.say(`Loaded ${file.name} in ${Math.round(performance.now() - t0)} ms`)
    }
    this.dbg.renderInvoke()
  }

  newWat() {
    if (this.mode !== 'debugger') this.setMode('debugger', { load: false })
    const p = this.session.prog
    this.openEditor(p && p.wat != null && p.opts && p.opts.user ? p.wat : NEW_WAT, true)
  }

  // ---- editor ----
  openEditor(text, fresh = false) {
    const p = this.session.prog
    const src = text ?? (p && p.wat)
    if (src == null) return
    this.session.pause()
    this.editorFresh = fresh
    this.editor.set(src, { canReset: this.mode === 'tutorial' })
    if (p && p.error && p.wat === src) this.editor.showError(this.editorError(p.error))
    this.editor.el.hidden = false
    this.codePane.el.hidden = true
    this.setMobileTab(this.mtab === 'side' && innerWidth < 760 ? 'code' : this.mtab)
    this.editor.focus()
  }
  closeEditor() {
    if (this.editor.el.hidden) return
    this.editor.el.hidden = true
    this.codePane.el.hidden = false
    this.codePane.renderWindow()
  }
  editorError(e) {
    if (!e) return null
    let line = e.line
    let col = e.col
    if (line == null && e.funcIndex != null && e.pc != null) {
      const sm = this.session.prog.sourceMap
      const r = sm && sm.funcs[e.funcIndex] && sm.funcs[e.funcIndex][e.pc]
      if (r) {
        line = (r.keyword || r).line
        col = (r.keyword || r).col
      }
    }
    return { line, col, message: e.message, title: e.feature ? 'Unsupported feature: ' + e.feature : STAGE_TITLE[e.stage] }
  }
  runEditor(text) {
    let err
    if (this.mode === 'tutorial') err = this.tutorial.load(this.tutorial.lesson.id, { wat: text })
    else {
      this.overlay.finishAll()
      err = this.session.loadWat(text, { name: 'module.wat', user: true })
      if (!err) {
        const fns = this.session.exportedFuncs()
        const f = fns.find((x) => !x.type.params.length) || fns[0]
        if (f && !f.type.params.length) this.session.invoke(f.name, [])
        this.dbg.renderInvoke()
      }
      this.setHash('debugger')
    }
    if (err) {
      this.editor.el.hidden = false
      this.codePane.el.hidden = true
      this.editor.showError(this.editorError(err))
    } else {
      this.editor.showError(null)
      this.closeEditor()
    }
  }

  // ---- transport ----
  act(kind, arg) {
    this.cancelIntro()
    this.overlay.finishAll()
    if (this.mode === 'tutorial' && this.tutorial.walkAction(kind, arg)) return
    const s = this.session
    if (!s.machine) return
    if (kind === 'step' && s.status === 'idle' && this.mode === 'debugger' && this.dbg.invokeNow) {
      this.dbg.invokeNow()
      return
    }
    if (kind === 'step') s.step()
    else if (kind === 'back') s.back()
    else if (kind === 'over') s.over()
    else if (kind === 'out') s.out()
    else if (kind === 'run') s.toggleRun()
    else if (kind === 'restart') s.restart()
    else if (kind === 'seek') s.seek(arg)
  }

  onBlocked(d) {
    const msg = { done: 'The call has returned. Step back (←) or restart (R).', trapped: 'The machine trapped. Step back (←) to rewind.', exited: 'The program exited. Restart (R) to run it again.', idle: 'Invoke a function first.', start: 'Already at the first step of the recorded history.' }[d.status]
    if (msg) this.say(msg)
  }

  say(text) {
    this.toast.textContent = text
    this.toast.classList.add('show')
    clearTimeout(this._toastT)
    this._toastT = setTimeout(() => this.toast.classList.remove('show'), 2600)
  }

  // ---- rendering ----
  onUpdate(detail) {
    const ev = detail.ev
    const dur = detail.anim || 0
    const pre = ev && dur && !detail.back ? this.capture(ev) : null
    this.renderAll(detail)
    if (pre) this.choreograph(ev, pre, dur)
  }

  renderAll(detail = {}) {
    const sess = this.session
    if (!('ev' in detail)) {
      // a plain re-render: show the event that produced the current state, without motion
      const m = sess.machine
      detail = { ...detail, ev: m && sess.prog ? sess.prog.events.get(m.steps) || null : null, anim: 0, full: true }
    }
    this.codePane.update()
    const v = this.codePane.current
    if (this.pendingTypes && this.mode === 'tutorial' && this.tutorial.phase === 'walk') {
      this.stack.showTypes(this.pendingTypes.types, this.pendingTypes.note)
      this.frames.update({})
    } else {
      this.pendingTypes = null
      this.stack.update(detail)
      this.frames.update(detail)
    }
    this.store.update(detail)
    this.bytes.update(v ? v.f : null)
    this.transport.update()
    if (this.mode === 'tutorial') {
      this.tutorial.renderBeats()
      const b = this.tutorial.currentBeat()
      this.mbeat.innerHTML = b ? rich(b.text) : ''
      this.mbeat.hidden = !b
    } else {
      this.mbeat.hidden = true
      if (!detail.running || (sess.machine && sess.machine.steps % 8 === 0)) this.dbg.renderRows()
    }
  }

  capture(ev) {
    const n0 = this.stack.n
    const cells = []
    for (let i = n0 - ev.popped.length; i < n0; i++) cells.push(this.stack.cellRect(i))
    return { cells, n0 }
  }

  choreograph(ev, pre, dur) {
    const ov = this.overlay
    const frames = this.session.frames()
    const topF = frames.length - 1
    const cellHTML = (v) => `<span class="cell-ty">${v.type}</span><span class="cell-v">${this.stack.makeCell(v, 0).querySelector('.cell-v').textContent}</span>`
    const ghost = (v) => ({ html: cellHTML(v), cls: 'cell ' + typeClass(v.type) })
    const rect = (el) => (el ? el.getBoundingClientRect() : null)
    const top = this.stack.n - 1
    if (ev.localRead && ev.instr.op === 'local.get') {
      const to = this.stack.cellEl(top)
      ov.fly(rect(this.frames.localEl(topF, ev.localRead.index)), rect(to), { ...ghost(ev.pushed[0]), dur, hide: to })
    }
    if (ev.localWrite) {
      const from = ev.instr.op === 'local.tee' ? rect(this.stack.cellEl(top)) : pre.cells[pre.cells.length - 1]
      const v = { type: ev.localWrite.type, value: ev.localWrite.value }
      ov.fly(from, rect(this.frames.localEl(topF, ev.localWrite.index)), { ...ghost(v), dur })
    }
    if (ev.globalRead && ev.instr.op === 'global.get') {
      const to = this.stack.cellEl(top)
      ov.fly(rect(this.store.globalEl(ev.globalRead.index)), rect(to), { ...ghost(ev.pushed[0]), dur, hide: to })
    }
    if (ev.globalWrite) {
      ov.fly(pre.cells[pre.cells.length - 1], rect(this.store.globalEl(ev.globalWrite.index)), { ...ghost({ type: ev.globalWrite.type, value: ev.globalWrite.value }), dur })
    }
    if (ev.control && ev.control.kind === 'call' && !ev.control.crossInstance) {
      const nArgs = ev.control.args ? ev.control.args.length : ev.popped.length - (ev.control.indirect ? 1 : 0)
      for (let k = 0; k < nArgs; k++) ov.fly(pre.cells[k], rect(this.frames.localEl(topF, k)), { ...ghost(ev.popped[k]), dur: dur * 1.2, delay: k * 40 })
    }
    const acc = ev.memWrite || ev.memRead
    if (acc && pre.cells[0] && this.store.tab === 'memory') {
      ov.ribbon(pre.cells[0], this.store.mem.cellRect(acc.addr), { dur, cls: ev.memWrite ? 'w' : 'r' })
    }
  }

  spotlight(name) {
    for (const el of this.app.querySelectorAll('.spot')) el.classList.remove('spot')
    if (!name) return
    const map = { code: this.codeSlot, bytes: this.bytes.el, stack: this.stack.el, frames: this.frames.el, labels: this.frames.labels, store: this.store.el, memory: this.store.el, tables: this.store.el, output: this.store.el, globals: this.store.el }
    const el = map[name]
    if (!el) return
    el.classList.add('spot')
    if (name === 'labels') this.frames.el.classList.add('spot')
    if (['memory', 'tables', 'output', 'globals'].includes(name) && this.store.tab !== name && !this.store.userPicked) this.store.select(name)
  }

  // ---- preferences ----
  toggleHex() {
    setPref('hex', !prefs.hex)
    this.stack.setHexState(prefs.hex)
    this.stack.update({ refresh: true })
    this.frames.update({})
    this.store.update({})
  }
  toggleAnim() {
    setPref('anim', !prefs.anim)
    this.applyAnim()
    this.say(prefs.anim ? 'Animations on' : 'Animations off: every change is still marked in place')
  }
  applyAnim() {
    document.documentElement.dataset.anim = prefs.anim ? 'on' : 'off'
    this.animBtn.setAttribute('aria-checked', String(prefs.anim))
    if (!prefs.anim) this.overlay.finishAll()
  }
  toggleTheme() {
    setPref('theme', prefs.theme === 'dark' ? 'light' : 'dark')
    this.applyTheme()
  }
  applyTheme() {
    document.documentElement.dataset.theme = prefs.theme
    this.themeBtn.replaceChildren(icon(prefs.theme === 'dark' ? 'sun' : 'moon', 18))
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = prefs.theme === 'dark' ? '#0f1115' : '#f6f6f3'
  }

  // ---- keyboard ----
  onKey(e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
    if (this.keys.open) return
    const k = e.key
    const map = {
      ArrowRight: () => this.act('step'), ArrowLeft: () => this.act('back'),
      o: () => this.act('over'), u: () => this.act('out'), ' ': () => this.act('run'), r: () => this.act('restart'),
      '[': () => this.transport.setSpeedIndex(prefs.speed - 1), ']': () => this.transport.setSpeedIndex(prefs.speed + 1),
      b: () => { const l = this.session.machine && this.session.machine.location; if (l) this.session.toggleBreakpoint(l.funcIndex, l.pc) },
      m: () => this.setView(this.view === 'machine' ? 'binary' : 'machine'),
      h: () => this.toggleHex(), a: () => this.toggleAnim(), t: () => this.toggleTheme(),
      g: () => { this.store.select('memory'); this.store.userPicked = true; this.store.mem.jump.focus() },
      n: () => this.mode === 'tutorial' && this.tutorial.go(this.tutorial.lesson.id + 1),
      p: () => this.mode === 'tutorial' && this.tutorial.go(this.tutorial.lesson.id - 1),
      e: () => this.openEditor(), '?': () => this.keys.showModal(),
    }
    const fn = map[k] || map[k.toLowerCase()]
    if (!fn) return
    if (k === ' ' && t && (t.tagName === 'BUTTON' || t.getAttribute('role') === 'tab')) return // let buttons activate
    e.preventDefault()
    fn()
  }

  setupDrop() {
    let depth = 0
    window.addEventListener('dragenter', (e) => {
      if (!e.dataTransfer || ![...e.dataTransfer.types].includes('Files')) return
      depth++
      this.drop.hidden = false
    })
    window.addEventListener('dragleave', () => {
      depth = Math.max(0, depth - 1)
      if (!depth) this.drop.hidden = true
    })
    window.addEventListener('dragover', (e) => e.preventDefault())
    window.addEventListener('drop', (e) => {
      e.preventDefault()
      depth = 0
      this.drop.hidden = true
      const f = e.dataTransfer && e.dataTransfer.files[0]
      if (f) this.openFile(f)
    })
  }

  // ---- first paint: a short intro on lesson 1 ----
  intro() {
    const s = this.session
    const steps = [380, 760]
    this.introT = steps.map((t) => setTimeout(() => {
      if (s.machine && s.machine.status === 'ready' && this.mode === 'tutorial' && this.tutorial.lesson.id === 1) s.step()
    }, t))
  }
  cancelIntro() {
    if (this.introT) this.introT.forEach(clearTimeout)
    this.introT = null
  }
}

function logo() {
  return s('svg', { class: 'logo', viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': 'true' },
    s('rect', { x: 4, y: 14.5, width: 16, height: 5, rx: 1.4, class: 'lg1' }),
    s('rect', { x: 4, y: 8.5, width: 16, height: 5, rx: 1.4, class: 'lg2' }),
    s('rect', { x: 7, y: 2.5, width: 10, height: 5, rx: 1.4, class: 'lg3' }))
}

const app = new App(document.getElementById('root'))
window.__wasmMachine = app // for the smoke test and the curious
if (app.route() === 'intro') app.intro()
