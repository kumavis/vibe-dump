// The session owns one loaded program and its Machine, and implements the
// transport: step / back / over / out / run at a speed / seek. Panes never
// drive the machine directly; they listen for 'update' and read state here.
import {
  assemble, decode, validate, createImports, instantiate, functionTypeStacks, funcName,
  WatError, WasmDecodeError, WasmFeatureError, WasmValidationError, LinkError, Trap, ProcExit,
} from '../engine/index.js'
import { prefs, SPEEDS, motionMs } from './prefs.js'

const HISTORY = 20000
const EVENT_KEEP = 4000

export class Session {
  constructor() {
    this.subs = new Map()
    this.prog = null
    this.running = false
    this.task = null // { kind: 'run'|'over'|'out', stopDepth }
    this._raf = 0
    this._last = 0
    this._carry = 0
    this.lastStop = null
  }

  // ---- pub/sub ----
  on(type, fn) {
    if (!this.subs.has(type)) this.subs.set(type, new Set())
    this.subs.get(type).add(fn)
    return () => this.subs.get(type).delete(fn)
  }
  emit(type, detail = {}) {
    const set = this.subs.get(type)
    if (set) for (const fn of set) fn(detail)
  }

  get machine() {
    return this.prog && this.prog.machine
  }
  get module() {
    return this.prog && this.prog.module
  }

  // ---- loading ----

  /** Assemble and load WAT. Returns null or a load error {stage, message, line, col, ...}. */
  loadWat(text, opts = {}) {
    let asm
    try {
      asm = assemble(text)
    } catch (e) {
      return this._failLoad({ stage: 'assemble', error: e, wat: text, opts })
    }
    return this._load(asm.bytes, { ...opts, wat: text, sourceMap: asm.sourceMap })
  }

  loadBinary(bytes, opts = {}) {
    return this._load(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), opts)
  }

  _failLoad(err) {
    this.pause()
    const e = err.error
    const out = { stage: err.stage, message: e.rawMessage || e.message, full: e.message, name: e.name }
    if (e instanceof WatError) Object.assign(out, { line: e.line, col: e.col, start: e.start, end: e.end })
    if (e instanceof WasmFeatureError) out.feature = e.feature
    if (e instanceof WasmDecodeError) out.offset = e.offset
    if (e instanceof WasmValidationError) Object.assign(out, { funcIndex: e.funcIndex, pc: e.pc, op: e.op, offset: e.offset, funcName: e.funcName })
    if (!(e instanceof WatError || e instanceof WasmDecodeError || e instanceof WasmValidationError || e instanceof LinkError || e instanceof Trap || e instanceof ProcExit)) {
      out.message = String(e && e.message || e)
      console.warn(e)
    }
    // keep what we could build (bytes, source map, decoded module) so panes can point at the problem
    this.prog = { name: err.opts.name || 'module', kind: err.wat != null ? 'wat' : 'binary', wat: err.wat ?? null, sourceMap: err.sourceMap || null, bytes: err.bytes || null, module: err.module || null, machine: null, host: null, error: out, output: [], events: new Map(), bps: new Set(), maxStep: 0, runId: 0, entry: null, typeCache: new Map(), viewFunc: null, viewFrame: null, opts: err.opts }
    this.emit('load', { error: out })
    this.emit('update', {})
    return out
  }

  _load(bytes, opts) {
    this.pause()
    let module
    try {
      module = decode(bytes)
    } catch (e) {
      return this._failLoad({ stage: 'decode', error: e, wat: opts.wat, sourceMap: opts.sourceMap, bytes, opts })
    }
    try {
      validate(module)
    } catch (e) {
      return this._failLoad({ stage: 'validate', error: e, wat: opts.wat, sourceMap: opts.sourceMap, bytes, module, opts })
    }
    const prog = {
      name: opts.name || 'module', kind: opts.wat != null ? 'wat' : 'binary', wat: opts.wat ?? null, sourceMap: opts.sourceMap || null,
      bytes, module, machine: null, host: null, error: null, output: [], events: new Map(), bps: new Set(), maxStep: 0,
      runId: 0, entry: null, typeCache: new Map(), viewFunc: null, viewFrame: null, opts, executing: false,
    }
    this.prog = prog
    const out = (kind) => (text) => this._out(kind, text)
    try {
      prog.host = createImports(module, {
        imports: opts.imports,
        stdout: out('stdout'),
        stderr: out('stderr'),
        args: opts.args || [prog.name.replace(/\.wasm$/, '')],
        onUnresolved: (c) => this._out('unresolved', `${c.module}.${c.name}(${c.args.map(String).join(', ')})`),
      })
      prog.machine = instantiate(module, prog.host.imports, { start: 'pending', history: HISTORY })
    } catch (e) {
      return this._failLoad({ stage: 'instantiate', error: e, wat: opts.wat, sourceMap: opts.sourceMap, bytes, module, opts })
    }
    if (prog.host.unresolved.length) {
      for (const u of prog.host.unresolved) this._out('unresolved-import', `${u.module}.${u.name} (${u.kind})`)
    }
    if (prog.machine.status === 'ready') {
      prog.entry = { name: '(start)', args: [], start: true }
      this._out('info', 'start function pending: step to run it')
    }
    this.emit('load', {})
    this.emit('update', { reason: 'load' })
    return null
  }

  // ---- names & static info ----
  funcLabel(i) {
    const m = this.module
    if (!m) return String(i)
    const n = funcName(m, i)
    return n != null ? n : `func ${i}`
  }
  typeStacks(funcIndex) {
    const p = this.prog
    if (!p.typeCache.has(funcIndex)) p.typeCache.set(funcIndex, functionTypeStacks(p.module, funcIndex))
    return p.typeCache.get(funcIndex)
  }
  exportedFuncs() {
    const m = this.module
    if (!m) return []
    return m.exports.filter((e) => e.kind === 'func').map((e) => ({ name: e.name, index: e.index, type: m.funcs[e.index].type }))
  }

  // ---- output console ----
  _out(kind, text) {
    const p = this.prog
    if (!p) return
    const step = p.executing && p.machine ? p.machine.steps + 1 : p.machine ? p.machine.steps : 0
    const last = p.output[p.output.length - 1]
    if ((kind === 'stdout' || kind === 'stderr') && last && last.kind === kind && last.run === p.runId && last.step === step && !last.text.endsWith('\n')) last.text += text
    else p.output.push({ kind, text, step, run: p.runId })
    if (p.output.length > 5000) p.output.splice(0, p.output.length - 5000)
    this.emit('output', {})
  }
  _trimOutput() {
    const p = this.prog
    const s = p.machine.steps
    const before = p.output.length
    while (p.output.length) {
      const e = p.output[p.output.length - 1]
      if (e.run === p.runId && e.step > s) p.output.pop()
      else break
    }
    if (p.output.length !== before) this.emit('output', {})
  }

  // ---- invocation ----
  invoke(name, args = []) {
    const p = this.prog
    if (!p || !p.machine) return 'nothing loaded'
    this.pause()
    try {
      p.runId++
      p.executing = true
      p.machine.invoke(name, args)
    } catch (e) {
      p.executing = false
      return e.message
    }
    p.executing = false
    p.entry = { name, args }
    p.events.clear()
    p.maxStep = 0
    p.viewFrame = null
    p.viewFunc = null
    this.lastStop = null
    const t = p.machine.exports[name]
    this._out('invoke', `${name}(${args.map(String).join(', ')})`)
    if (t && t.host) this._out('info', 'host function ran immediately')
    this.emit('invoke', {})
    this.emit('update', { reason: 'invoke' })
    return null
  }

  restart() {
    const p = this.prog
    if (!p || !p.machine) return
    this.pause()
    // rewind to the post-invoke state when history reaches back that far; else re-invoke
    const m = p.machine
    if (m.steps > 0 && m.historySize >= m.steps) {
      while (m.steps > 0 && m.stepBack());
      this._trimOutput()
      p.viewFrame = null
      p.viewFunc = null
      this.lastStop = null
      this.emit('update', { reason: 'restart' })
    } else if (p.entry && !p.entry.start) this.invoke(p.entry.name, p.entry.args)
    else this.emit('update', { reason: 'restart' })
  }

  get status() {
    const m = this.machine
    return m ? m.status : 'none'
  }

  // ---- stepping ----
  _step() {
    const p = this.prog
    p.executing = true
    const ev = p.machine.step()
    p.executing = false
    if (ev) {
      p.events.set(ev.step, ev)
      if (p.events.size > EVENT_KEEP) p.events.delete(p.events.keys().next().value)
      if (ev.step > p.maxStep) p.maxStep = ev.step
      if (ev.control && ev.control.kind === 'host-call' && !ev.control.unresolved) {
        this._out('host', `${ev.control.module}.${ev.control.field}(${ev.control.args.map((a) => String(a.value ?? a)).join(', ')})`)
      }
    }
    return ev
  }

  step() {
    const p = this.prog
    if (!p || !p.machine) return null
    if (this.running) this.pause()
    if (p.machine.status !== 'ready') {
      this.emit('blocked', { status: p.machine.status })
      return null
    }
    p.viewFrame = null
    p.viewFunc = null
    this.lastStop = null
    const ev = this._step()
    this.emit('update', { ev, anim: motionMs() })
    return ev
  }

  back() {
    const p = this.prog
    if (!p || !p.machine) return false
    if (this.running) this.pause()
    const m = p.machine
    if (!m.canStepBack) {
      this.emit('blocked', { status: 'start' })
      return false
    }
    m.stepBack()
    this._trimOutput()
    p.viewFrame = null
    p.viewFunc = null
    this.lastStop = null
    this.emit('update', { reason: 'back', ev: p.events.get(m.steps) || null, anim: 0, back: true })
    return true
  }

  /** Jump to an absolute step count (within rewindable history .. last reached step). */
  seek(target) {
    const p = this.prog
    if (!p || !p.machine) return
    if (this.running) this.pause()
    const m = p.machine
    target = Math.max(this.earliestStep(), Math.min(target, Math.max(p.maxStep, m.steps)))
    if (target < m.steps) {
      while (m.steps > target && m.stepBack());
      this._trimOutput()
    } else if (target > m.steps && m.status === 'ready') {
      const n = target - m.steps
      if (n > 1) {
        p.executing = true
        m.run({ maxSteps: n - 1, breakpoints: [] })
        p.executing = false
      }
      if (m.status === 'ready') this._step()
    }
    p.viewFrame = null
    p.viewFunc = null
    this.emit('update', { reason: 'seek', ev: p.events.get(m.steps) || null, anim: 0 })
  }

  earliestStep() {
    const m = this.machine
    return m ? m.steps - m.historySize : 0
  }

  // ---- breakpoints ----
  toggleBreakpoint(funcIndex, pc) {
    const p = this.prog
    if (!p) return
    const k = funcIndex + ':' + pc
    if (p.bps.has(k)) p.bps.delete(k)
    else p.bps.add(k)
    if (p.machine) p.machine.setBreakpoints([...p.bps].map((s) => {
      const [f, c] = s.split(':').map(Number)
      return { funcIndex: f, pc: c }
    }))
    this.emit('breakpoints', {})
  }
  hasBreakpoint(f, pc) {
    return !!this.prog && this.prog.bps.has(f + ':' + pc)
  }
  _atBreakpoint() {
    const loc = this.machine.location
    return loc && this.hasBreakpoint(loc.funcIndex, loc.pc)
  }

  // ---- running ----
  toggleRun() {
    if (this.running) this.pause()
    else this.run()
  }

  run() {
    this._start({ kind: 'run' })
  }

  over() {
    const p = this.prog
    if (!p || !p.machine || p.machine.status !== 'ready') return this.step()
    this.pause()
    const depth = p.machine.frames.length
    const ev = this._step()
    if (p.machine.status === 'ready' && p.machine.frames.length > depth) {
      this.emit('update', { ev, anim: 0 })
      this._start({ kind: 'over', stopDepth: depth + 1, first: false })
    } else this.emit('update', { ev, anim: motionMs() })
  }

  out() {
    const p = this.prog
    if (!p || !p.machine || p.machine.status !== 'ready') return
    this.pause()
    this._start({ kind: 'out', stopDepth: p.machine.frames.length })
  }

  _start(task) {
    const p = this.prog
    if (!p || !p.machine) return
    if (p.machine.status !== 'ready') {
      this.emit('blocked', { status: p.machine.status })
      return
    }
    this.pause()
    this.task = { first: true, ...task }
    this.running = true
    this.lastStop = null
    p.viewFrame = null
    p.viewFunc = null
    this._last = performance.now()
    this._carry = 0
    this.emit('running', { running: true })
    this._raf = requestAnimationFrame(this._tick)
  }

  pause(reason) {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this._raf)
    this.task = null
    this.emit('running', { running: false, reason })
  }

  _stop(reason) {
    this.lastStop = reason
    this.pause(reason)
  }

  _tick = (now) => {
    if (!this.running) return
    const p = this.prog
    const m = p.machine
    const task = this.task
    const rate = task.kind === 'run' ? SPEEDS[prefs.speed] : Infinity
    let ev = null
    let stopped = null
    const dt = Math.min(250, now - this._last)
    this._last = now
    p.viewFunc = null
    if (rate === Infinity) {
      // engine fast path in time-boxed slices so the page never freezes
      const t0 = performance.now()
      let chunk = 20000
      while (performance.now() - t0 < 10) {
        if (!task.first && task.stopDepth == null && this._atBreakpoint()) { stopped = 'breakpoint'; break }
        if (task.stopDepth != null && m.frames.length < task.stopDepth) { stopped = 'step-complete'; break }
        p.executing = true
        const r = m.run({ maxSteps: chunk, _stopDepth: task.stopDepth ?? -1 })
        p.executing = false
        task.first = false
        if (m.steps > p.maxStep) p.maxStep = m.steps
        if (r.reason !== 'max-steps') { stopped = r.reason; break }
        chunk = Math.min(chunk * 2, 400000)
      }
    } else {
      this._carry += (rate * dt) / 1000
      let n = Math.floor(this._carry)
      if (task.first && n < 1) n = 1 // start immediately
      this._carry -= n
      if (this._carry < 0) this._carry = 0
      while (n > 0 && m.status === 'ready') {
        if (!task.first && this._atBreakpoint()) { stopped = 'breakpoint'; break }
        task.first = false
        if (n > 2) {
          p.executing = true
          const r = m.run({ maxSteps: n - 1 })
          p.executing = false
          n = 1
          if (m.steps > p.maxStep) p.maxStep = m.steps
          if (r.reason !== 'max-steps') { stopped = r.reason; break }
          continue
        }
        ev = this._step()
        n--
      }
      if (!stopped && m.status !== 'ready') stopped = m.status
    }
    if (stopped || m.status !== 'ready') {
      this._stop(stopped || m.status)
      if (!ev) ev = p.events.get(m.steps) || null
      this.emit('update', { ev, anim: 0, reason: stopped })
      return
    }
    this.emit('update', { ev, anim: ev ? motionMs(rate) : 0, running: true, rate })
    this._raf = requestAnimationFrame(this._tick)
  }
}
