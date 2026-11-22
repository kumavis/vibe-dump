// TUTORIAL: lesson picker, narration beats bound to machine steps, the
// validation walk (lesson 3) and the binary tour (lesson 10).
import { h, icon, esc, clear } from './dom.js'
import { LESSONS } from './lessons.js'
import { argInputs } from './args.js'

/** `code` and **bold** in narration text. */
export function rich(text) {
  return esc(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

export class Tutorial {
  constructor(app) {
    this.app = app
    this.session = app.session
    this.lesson = null
    this.phase = 'run' // 'walk' | 'run'
    this.walkPos = 0
    this.edited = false
    this.variant = false

    this.picker = h('div', { class: 'lesson-list', role: 'listbox', 'aria-label': 'Lessons', hidden: true })
    this.pickBtn = h('button', { type: 'button', class: 'lesson-pick', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', onclick: () => this.togglePicker() })
    this.prevBtn = h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Previous lesson (P)', title: 'Previous lesson  ·  P', onclick: () => this.go(this.lesson.id - 1) }, icon('prev', 16))
    this.nextBtn = h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Next lesson (N)', title: 'Next lesson  ·  N', onclick: () => this.go(this.lesson.id + 1) }, icon('next', 16))
    this.title = h('h1', { class: 'lesson-title' })
    this.call = h('div', { class: 'lesson-call' })
    this.progress = h('div', { class: 'beat-progress', 'aria-hidden': 'true' })
    this.beats = h('div', { class: 'beats', 'aria-live': 'polite' })
    this.actions = h('div', { class: 'lesson-actions' })
    this.el = h('div', { class: 'tutorial' },
      h('div', { class: 'lesson-nav' }, this.prevBtn, this.pickBtn, this.nextBtn),
      this.picker, this.title, this.call, this.progress, this.beats, this.actions)
    for (const L of LESSONS) {
      this.picker.appendChild(h('button', { type: 'button', role: 'option', class: 'lesson-opt', 'data-id': L.id, onclick: () => { this.togglePicker(false); this.go(L.id) } }, h('span', { class: 'lo-n mono' }, String(L.id).padStart(2, '0')), h('span', {}, L.title)))
    }
  }

  togglePicker(open = this.picker.hidden) {
    this.picker.hidden = !open
    this.pickBtn.setAttribute('aria-expanded', String(open))
    if (open) {
      const cur = this.picker.querySelector(`[data-id="${this.lesson.id}"]`)
      cur && cur.focus()
    }
  }

  go(id) {
    if (id < 1 || id > LESSONS.length) return
    this.app.setHash('lesson-' + id)
    this.load(id)
  }

  load(id, { wat = null } = {}) {
    const L = LESSONS.find((x) => x.id === id) || LESSONS[0]
    this.lesson = L
    this.edited = wat != null && wat !== L.wat
    this.variant = false
    this.curArgs = null
    return this.loadSource(wat ?? L.wat)
  }

  loadSource(wat) {
    const L = this.lesson
    const app = this.app
    app.prepareLoad()
    const err = this.session.loadWat(wat, { name: `lesson-${L.id}.wat`, wat })
    this.phase = 'run'
    this.walkPos = 0
    app.codePane.walk = null
    app.bytes.walkRange = null
    if (!err) {
      if (L.walk && !this.edited && !this.variant) {
        this.phase = 'walk'
        if (L.walk.kind === 'binary') app.setView('binary', { silent: true })
      } else if (L.invoke) this.invoke(L.invoke.args)
    }
    if (!L.walk || L.walk.kind !== 'binary' || this.phase !== 'walk') app.setView('machine', { silent: true })
    this.render()
    this.applyWalk()
    app.renderAll({})
    return err
  }

  invoke(args) {
    const L = this.lesson
    const mod = this.session.module
    if (!mod) return
    const ex = mod.exports.find((e) => e.name === L.invoke.name && e.kind === 'func')
    const name = ex ? L.invoke.name : (mod.exports.find((e) => e.kind === 'func') || {}).name
    if (!name) return
    const params = mod.funcs[mod.exports.find((e) => e.name === name).index].type.params
    const a = args && args.length === params.length ? args : params.map(() => 0)
    this.curArgs = a
    this.session.invoke(name, a)
  }

  // ---- walk (validation / binary tour) ----
  walkBeats() {
    return this.lesson.beats.filter((b) => b.w != null)
  }
  walkState() {
    if (this.phase !== 'walk') return null
    const total = this.walkBeats().length - 1
    return { pos: this.walkPos, total, label: this.lesson.walk.kind === 'validate' ? 'check' : 'part', note: this.lesson.walk.kind === 'validate' ? 'validation: types only, nothing executes' : 'binary tour' }
  }
  /** Transport actions while walking; returns true if handled. */
  walkAction(kind, arg) {
    if (this.phase !== 'walk') return false
    const total = this.walkBeats().length - 1
    if (kind === 'step') {
      if (this.walkPos < total) this.walkPos++
      else return this.finishWalk(), true
    } else if (kind === 'back') this.walkPos = Math.max(0, this.walkPos - 1)
    else if (kind === 'restart') this.walkPos = 0
    else if (kind === 'seek') this.walkPos = Math.max(0, Math.min(total, arg))
    else return kind === 'run' || kind === 'over' || kind === 'out'
    this.applyWalk()
    this.render()
    this.app.renderAll({ walk: true })
    return true
  }
  finishWalk() {
    this.phase = 'run'
    this.app.codePane.walk = null
    this.app.bytes.walkRange = null
    if (this.lesson.walk.kind === 'validate') this.app.codePane.toggleTypes(false)
    this.app.setView('machine', { silent: true })
    this.invoke(this.lesson.invoke.args)
    this.render()
    this.app.renderAll({})
  }
  applyWalk() {
    const app = this.app
    if (this.phase !== 'walk') return
    const L = this.lesson
    if (L.walk.kind === 'validate') {
      const f = L.walk.func
      const code = this.session.module.funcs[f].body.code
      const types = this.session.typeStacks(f)
      const pc = Math.min(this.walkPos, code.length - 1)
      app.codePane.walk = this.walkPos < code.length ? { f, pc } : null
      app.codePane.toggleTypes(true)
      const ins = code[pc]
      app.bytes.walkRange = this.walkPos < code.length ? [ins.offset, ins.offset + ins.len] : null
      const stack = this.walkPos < code.length ? types[this.walkPos].stack : this.session.module.funcs[f].type.results
      app.pendingTypes = { types: stack, note: this.walkPos < code.length ? `<span class="tx-op mono">types</span> <span class="dim">before</span> <span class="mono">${esc(ins.op)}</span>` : '<span class="tx-op mono">valid</span> <span class="dim">= result type</span>' }
    } else {
      const b = this.walkBeats()[this.walkPos]
      app.binary.selectWhere((n) => n.kind === b.find.kind && (!b.find.label || b.find.label.test(n.label)))
    }
  }

  // ---- narration ----
  currentBeat() {
    const L = this.lesson
    if (!L) return null
    if (this.phase === 'walk') return this.walkBeats()[this.walkPos]
    const m = this.session.machine
    const steps = m ? m.steps : 0
    let cur = null
    for (const b of L.beats) if (b.at != null && b.at <= steps) cur = b
    return cur
  }

  render() {
    const L = this.lesson
    if (!L) return
    this.pickBtn.innerHTML = `<span class="mono dim">${String(L.id).padStart(2, '0')}/${LESSONS.length}</span><span>Lessons</span>${icon('chevronDown', 14).outerHTML}`
    this.prevBtn.disabled = L.id === 1
    this.nextBtn.disabled = L.id === LESSONS.length
    for (const o of this.picker.children) o.classList.toggle('cur', +o.dataset.id === L.id)
    this.title.textContent = this.variant ? L.title + ' (ill-typed)' : L.title
    this.renderCall()
    this.renderBeats()
  }

  renderCall() {
    const L = this.lesson
    clear(this.call)
    const mod = this.session.module
    if (!mod || !L.invoke || this.phase === 'walk' || !this.session.machine) {
      if (this.phase === 'walk') this.call.appendChild(h('span', { class: 'dim' }, L.walk.kind === 'validate' ? 'Validating: nothing runs yet.' : 'Reading the bytes: nothing runs yet.'))
      return
    }
    const ex = mod.exports.find((e) => e.name === L.invoke.name && e.kind === 'func')
    if (!ex) return
    const f = mod.funcs[ex.index]
    if (!f.type.params.length) {
      this.call.appendChild(h('span', { class: 'mono call-sig' }, `${L.invoke.name}()`))
      return
    }
    const names = f.type.params.map((_, i) => (mod.names.locals.get(ex.index) || new Map()).get(i))
    const ai = argInputs(f.type.params, { names, values: this.curArgs || L.invoke.args, onEnter: () => go() })
    const err = h('span', { class: 'arg-err' })
    const go = () => {
      const r = ai.read()
      if (r.error) return (err.textContent = r.error)
      err.textContent = ''
      this.invoke(r.args)
      this.render()
      this.app.codePane.scroll.focus({ preventScroll: true })
    }
    this.call.append(h('span', { class: 'mono call-sig' }, L.invoke.name), ai.el, h('button', { type: 'button', class: 'btn small', onclick: go }, 'Invoke'), err)
  }

  renderBeats() {
    const L = this.lesson
    const box = this.beats
    clear(box)
    clear(this.actions)
    clear(this.progress)
    const m = this.session.machine
    const p = this.session.prog
    if (this.variant) {
      box.appendChild(h('div', { class: 'beat cur variant', html: `<p>${rich(L.variant.text)}</p>` }))
      this.actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: () => { this.variant = false; this.loadSource(L.wat) } }, 'Back to the valid module'))
      return
    }
    if (this.edited) {
      box.appendChild(h('div', { class: 'beat cur', html: '<p>You edited this lesson\'s program, so the narration is paused: it describes the original. Step through your version, or reset to follow the lesson again.</p>' }))
      this.actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: () => this.load(L.id) }, 'Reset lesson'))
      return
    }
    const sameArgs = !this.curArgs || !L.invoke || this.curArgs.map(String).join(',') === L.invoke.args.map(String).join(',')
    if (this.phase === 'run' && !sameArgs) {
      const call = (a) => `${L.invoke.name}(${a.map(String).join(', ')})`
      box.appendChild(h('div', { class: 'beat cur', html: `<p>The notes follow <code>${esc(call(L.invoke.args))}</code>. You invoked <code>${esc(call(this.curArgs))}</code>: the machine is live, the notes are paused.</p>` }))
      this.actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: () => { this.invoke(L.invoke.args); this.render() } }, `Back to ${call(L.invoke.args)}`))
      if (this.lastBeat) this.app.spotlight(null)
      this.lastBeat = null
      return
    }
    const cur = this.currentBeat()
    const list = this.phase === 'walk' ? this.walkBeats() : L.beats.filter((b) => b.at != null)
    const idx = list.indexOf(cur)
    // progress ticks
    list.forEach((b, i) => this.progress.appendChild(h('span', { class: 'tick' + (i < idx ? ' done' : i === idx ? ' cur' : '') })))
    // previous beat (dim), current (full)
    if (idx > 0) box.appendChild(h('div', { class: 'beat prev', html: `<p>${rich(list[idx - 1].text)}</p>` }))
    if (cur) {
      const el = h('div', { class: 'beat cur', html: `<p>${rich(cur.text)}</p>` })
      box.appendChild(el)
      if (this.lastBeat !== cur && this.app.motion()) el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' })
    }
    this.lastBeat = cur
    // next hint
    const nextBeat = list[idx + 1]
    if (nextBeat && this.phase !== 'walk' && m && m.status === 'ready') {
      const left = nextBeat.at - m.steps
      box.appendChild(h('div', { class: 'beat-next dim' }, `Next note in ${left} step${left === 1 ? '' : 's'}.`))
    }
    if (cur && cur.action === 'variant' && L.variant) this.actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: () => { this.variant = true; this.loadSource(L.variant.wat) } }, icon('warn', 14), L.variant.label))
    const finished = this.phase === 'run' && m && m.status !== 'ready' && cur === list[list.length - 1]
    if (cur && cur.action === 'debugger') this.actions.appendChild(h('button', { type: 'button', class: 'btn primary', onclick: () => this.app.setMode('debugger') }, icon('bug', 14), 'Open the debugger'))
    else if (finished && L.id < LESSONS.length) this.actions.appendChild(h('button', { type: 'button', class: 'btn primary', onclick: () => this.go(L.id + 1) }, `Lesson ${L.id + 1}: ${LESSONS[L.id].title}`, icon('next', 14)))
    if (p && p.wat != null && this.phase !== 'walk') this.actions.appendChild(h('button', { type: 'button', class: 'btn ghost', onclick: () => this.app.openEditor() }, icon('edit', 14), 'Edit the WAT'))
    if (cur && cur.spot) this.app.spotlight(cur.spot)
    else this.app.spotlight(null)
  }
}
