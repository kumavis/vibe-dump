// The steppable WebAssembly interpreter.
//
// Designed for visualisation: every piece of state is a plain inspectable
// object, step() returns a rich event describing exactly what one instruction
// did, and a bounded undo log lets stepBack() restore the previous state
// exactly (value stack, frames, labels, locals, globals, memory bytes and
// size, tables, dropped segments). run() is the fast path with no events.
//
// See README.md in this directory for the full API reference.

import { decode, funcName, findInstrAt } from './decode.js'
import { validate } from './validate.js'
import {
  NaNBox, f32Bits, f32FromBits, f64Words, f64FromWords, f64BitsBig, f64FromBitsBig,
  f32Neg, f32Abs, f32Copysign, f64Neg, f64Abs, f64Copysign, nearest, bigToF32,
  defaultValue, toWasm,
} from './values.js'

export const PAGE_SIZE = 65536

// ---------------------------------------------------------------------------
// Errors

/** A WebAssembly trap. `kind` is a stable machine-readable identifier. */
export class Trap extends Error {
  constructor(kind, message) {
    super(message)
    this.name = 'Trap'
    this.kind = kind
  }
}

export const TRAP_MESSAGES = {
  'unreachable': 'unreachable executed',
  'integer-divide-by-zero': 'integer divide by zero',
  'integer-overflow': 'integer overflow',
  'invalid-conversion': 'invalid conversion to integer',
  'out-of-bounds-memory': 'out of bounds memory access',
  'out-of-bounds-table': 'out of bounds table access',
  'undefined-element': 'undefined element',
  'uninitialized-element': 'uninitialized element',
  'indirect-call-type-mismatch': 'indirect call type mismatch',
  'call-stack-exhausted': 'call stack exhausted',
  'host-error': 'host function threw',
  'host-abort': 'program aborted',
}

function trap(kind, detail) {
  return new Trap(kind, detail ? `${TRAP_MESSAGES[kind]}: ${detail}` : TRAP_MESSAGES[kind])
}

/** Import resolution / type mismatch at instantiation time. */
export class LinkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'LinkError'
  }
}

/** Thrown by a host function (e.g. WASI proc_exit) to stop the program. */
export class ProcExit extends Error {
  constructor(code) {
    super(`program exited with code ${code}`)
    this.name = 'ProcExit'
    this.code = code
  }
}

// ---------------------------------------------------------------------------
// Store objects

export class Memory {
  /** @param {{min:number, max?:number|null}} limits  (in 64 KiB pages) */
  constructor({ min = 0, max = null } = {}, maxPagesCap = 16384) {
    this.pages = min
    this.max = max
    this.cap = maxPagesCap
    if (min > maxPagesCap) throw new LinkError(`memory of ${min} pages exceeds this engine's limit of ${maxPagesCap} pages`)
    this.bytes = new Uint8Array(min * PAGE_SIZE)
    this.view = new DataView(this.bytes.buffer)
  }
  get byteLength() {
    return this.bytes.length
  }
  /** Grow by `delta` pages. Returns the old size in pages, or -1. Not undoable on its own. */
  grow(delta) {
    const old = this.pages
    const n = old + delta
    const limit = this.max != null ? Math.min(this.max, 65536) : 65536
    if (n > limit || n > this.cap) return -1
    if (delta === 0) return old
    let next
    try {
      next = new Uint8Array(n * PAGE_SIZE)
    } catch {
      return -1
    }
    next.set(this.bytes)
    this.bytes = next
    this.view = new DataView(next.buffer)
    this.pages = n
    return old
  }
}

export class Table {
  constructor({ elemType = 'funcref', min = 0, max = null } = {}) {
    this.elemType = elemType
    this.max = max
    if (min > 10_000_000) throw new LinkError(`table of ${min} elements exceeds this engine's limit`)
    this.elements = new Array(min).fill(null)
  }
  get length() {
    return this.elements.length
  }
  grow(delta, init = null) {
    const old = this.elements.length
    const n = old + delta
    const limit = this.max != null ? this.max : 0xffffffff
    if (n > limit || n > 10_000_000) return -1
    for (let i = 0; i < delta; i++) this.elements.push(init)
    return old
  }
}

export class Global {
  constructor({ type, mut = false }, value) {
    this.type = type
    this.mut = mut
    this.value = value === undefined ? defaultValue(type) : toWasm(type, value)
  }
}

function typeKey(t) {
  return t.params.join(',') + '>' + t.results.join(',')
}

/**
 * A function instance: either wasm code in an instance, or a host function.
 *   { type:{params,results}, typeKey, inst?, index?, host?, name, module?, field?, unresolved? }
 */
export class FuncInst {
  constructor(type, props) {
    this.type = type
    this.typeKey = typeKey(type)
    this.inst = null
    this.index = -1
    this.host = null
    this.withCaller = false
    this.name = null
    this.bp = null
    Object.assign(this, props)
  }
}

/** Mark a JS function so it is called as fn(caller, ...args) — see README. */
export function hostFunction(fn, props = {}) {
  fn.withCaller = true
  Object.assign(fn, props)
  return fn
}

// ---------------------------------------------------------------------------
// Compiled function bodies (monomorphic arrays for the interpreter loop)

function compileBody(module, func) {
  const body = func.body
  if (body.compiled) return body.compiled
  const code = body.code
  const n = code.length
  const ops = new Uint8Array(n)
  const pops = new Int32Array(n)
  const imm = new Array(n)
  const imm2 = new Array(n)
  for (let i = 0; i < n; i++) {
    const ins = code[i]
    ops[i] = ins.code
    pops[i] = ins.pops
    let a = 0, b = 0
    switch (ins.code) {
      case 0x02: case 0x03: case 0x04: case 0x05: case 0x0b: a = ins.blk; break
      case 0x0c: case 0x0d: a = ins.depth; break
      case 0x0e: a = ins.targets; b = ins.deflt; break
      case 0x10: case 0xd2: a = ins.func; break
      case 0x11: a = ins.type; b = ins.table; break
      case 0x20: case 0x21: case 0x22: a = ins.local; break
      case 0x23: case 0x24: a = ins.global; break
      case 0x41: case 0x42: case 0x43: case 0x44: a = ins.value; break
      case 0xd0: a = ins.refType; break
      case 0x1c: a = ins.types[0]; break
      case 0xe8: case 0xe9: a = ins.data; break
      case 0xec: a = ins.elem; b = ins.table; break
      case 0xed: a = ins.elem; break
      case 0xee: a = ins.table; b = ins.table2; break
      case 0x25: case 0x26: case 0xef: case 0xf0: case 0xf1: a = ins.table; break
      default:
        if (ins.memOffset !== undefined) a = ins.memOffset
    }
    imm[i] = a
    imm2[i] = b
  }
  // result-type of each load, for typing pushes
  body.compiled = { ops, pops, imm, imm2, code }
  return body.compiled
}

// ---------------------------------------------------------------------------
// Instance

/** Evaluate a validated constant expression in an instance. */
function evalConst(inst, expr) {
  const st = []
  for (const ins of expr) {
    switch (ins.op) {
      case 'i32.const': case 'i64.const': case 'f32.const': case 'f64.const': st.push(ins.value); break
      case 'ref.null': st.push(null); break
      case 'ref.func': st.push(inst.funcs[ins.func]); break
      case 'global.get': st.push(inst.globals[ins.global].value); break
      case 'i32.add': { const b = st.pop(); st.push((st.pop() + b) | 0); break }
      case 'i32.sub': { const b = st.pop(); st.push((st.pop() - b) | 0); break }
      case 'i32.mul': { const b = st.pop(); st.push(Math.imul(st.pop(), b)); break }
      case 'i64.add': { const b = st.pop(); st.push(BigInt.asIntN(64, st.pop() + b)); break }
      case 'i64.sub': { const b = st.pop(); st.push(BigInt.asIntN(64, st.pop() - b)); break }
      case 'i64.mul': { const b = st.pop(); st.push(BigInt.asIntN(64, st.pop() * b)); break }
      default: throw new Error('internal: non-constant instruction in constant expression: ' + ins.op)
    }
  }
  return st[0]
}

function describeImport(imp) {
  return `import "${imp.module}" "${imp.name}" (${imp.kind})`
}

function resolveImport(imports, imp, onMissing) {
  const mod = imports && imports[imp.module]
  let v = mod != null ? mod[imp.name] : undefined
  if (v === undefined && onMissing) v = onMissing(imp)
  if (v === undefined) throw new LinkError(`unknown import: ${describeImport(imp)} was not provided`)
  return v
}

/**
 * Build an Instance (pure data: funcs, tables, memories, globals, segments,
 * exports). Applies active segments. Does not run the start function.
 */
function createInstance(module, imports, opts) {
  const inst = {
    module,
    funcs: [],
    tables: [],
    memories: [],
    globals: [],
    elems: [],
    datas: [],
    exports: Object.create(null),
  }
  const onMissing = opts.onMissingImport
  for (const imp of module.imports) {
    const v = resolveImport(imports, imp, onMissing)
    switch (imp.kind) {
      case 'func': {
        const type = module.types[imp.typeIndex]
        if (v instanceof FuncInst) {
          if (v.typeKey !== typeKey(type))
            throw new LinkError(`incompatible import type: ${describeImport(imp)} expects (${type.params}) -> (${type.results}) but got (${v.type.params}) -> (${v.type.results})`)
          inst.funcs.push(v)
        } else if (typeof v === 'function') {
          inst.funcs.push(new FuncInst(type, {
            host: v,
            withCaller: v.withCaller === true,
            unresolved: v.unresolved === true,
            module: imp.module,
            field: imp.name,
            name: `${imp.module}.${imp.name}`,
          }))
        } else throw new LinkError(`incompatible import type: ${describeImport(imp)} must be a function`)
        break
      }
      case 'memory': {
        let m = v
        if (!(m instanceof Memory)) {
          if (v && typeof v === 'object' && 'min' in v && !(v instanceof Table) && !(v instanceof Global)) m = new Memory({ min: v.min, max: v.max ?? imp.desc.max }, opts.maxMemoryPages)
          else throw new LinkError(`incompatible import type: ${describeImport(imp)} must be a Memory`)
        }
        const d = imp.desc
        if (m.pages < d.min || (d.max != null && (m.max == null || m.max > d.max)))
          throw new LinkError(`incompatible import type: ${describeImport(imp)} limits {min ${d.min}${d.max != null ? ', max ' + d.max : ''}} do not accept memory {min ${m.pages}${m.max != null ? ', max ' + m.max : ''}}`)
        inst.memories.push(m)
        break
      }
      case 'table': {
        if (!(v instanceof Table)) throw new LinkError(`incompatible import type: ${describeImport(imp)} must be a Table`)
        const d = imp.desc
        if (v.elemType !== d.elemType || v.length < d.min || (d.max != null && (v.max == null || v.max > d.max)))
          throw new LinkError(`incompatible import type: ${describeImport(imp)} table type/limits mismatch`)
        inst.tables.push(v)
        break
      }
      case 'global': {
        const d = imp.desc
        let g = v
        if (!(g instanceof Global)) {
          if (d.mut) throw new LinkError(`incompatible import type: ${describeImport(imp)} is mutable and needs a Global object`)
          const numeric = d.type === 'i32' || d.type === 'i64' || d.type === 'f32' || d.type === 'f64'
          const okValue = numeric
            ? typeof v === 'number' || typeof v === 'bigint' || v instanceof NaNBox
            : !(typeof v === 'function' || v instanceof Memory || v instanceof Table || (d.type === 'externref' && v instanceof FuncInst))
          if (!okValue) throw new LinkError(`incompatible import type: ${describeImport(imp)} must be a ${d.type} value`)
          g = new Global({ type: d.type, mut: false }, v)
        }
        if (g.type !== d.type || g.mut !== d.mut)
          throw new LinkError(`incompatible import type: ${describeImport(imp)} expects ${d.mut ? 'mut ' : ''}${d.type} but got ${g.mut ? 'mut ' : ''}${g.type}`)
        inst.globals.push(g)
        break
      }
    }
  }
  for (const f of module.funcs) {
    if (f.import) continue
    inst.funcs.push(new FuncInst(f.type, { inst, index: f.index, name: funcName(module, f.index) }))
  }
  for (const t of module.tables) if (!t.import) inst.tables.push(new Table(t))
  for (const m of module.memories) if (!m.import) inst.memories.push(new Memory(m, opts.maxMemoryPages))
  for (const g of module.globals) {
    if (g.import) continue
    inst.globals.push(new Global(g, evalConst(inst, g.init)))
  }
  for (const seg of module.elems) {
    inst.elems.push({ index: seg.index, elemType: seg.elemType, refs: seg.init.map((e) => evalConst(inst, e)), dropped: false, mode: seg.mode })
  }
  for (const seg of module.datas) inst.datas.push({ index: seg.index, bytes: seg.bytes, dropped: false, mode: seg.mode })
  for (const e of module.exports) {
    const space = { func: inst.funcs, table: inst.tables, memory: inst.memories, global: inst.globals }[e.kind]
    inst.exports[e.name] = space[e.index]
  }
  // active element segments, then data segments (spec order; earlier writes persist on trap)
  for (const seg of module.elems) {
    const s = inst.elems[seg.index]
    if (seg.mode === 'active') {
      const off = evalConst(inst, seg.offset) >>> 0
      const t = inst.tables[seg.table]
      if (off + s.refs.length > t.elements.length) throw trap('out-of-bounds-table', `elem segment ${seg.index} does not fit in table ${seg.table}`)
      for (let i = 0; i < s.refs.length; i++) t.elements[off + i] = s.refs[i]
      s.dropped = true
    } else if (seg.mode === 'declarative') s.dropped = true
  }
  for (const seg of module.datas) {
    const s = inst.datas[seg.index]
    if (seg.mode !== 'active') continue
    const off = evalConst(inst, seg.offset) >>> 0
    const m = inst.memories[0]
    if (off + s.bytes.length > m.bytes.length) throw trap('out-of-bounds-memory', `data segment ${seg.index} does not fit in memory`)
    m.bytes.set(s.bytes, off)
    s.dropped = true
  }
  return inst
}

// ---------------------------------------------------------------------------
// Frames, labels, undo records

class Frame {
  constructor(func, inst, base, labelBase) {
    const mf = inst.module.funcs[func.index]
    this.func = func
    this.inst = inst
    this.funcIndex = func.index
    this.c = compileBody(inst.module, mf)
    this.localTypes = mf.body.localTypes
    this.locals = null
    this.pc = 0
    this.stackBase = base
    this.labelBase = labelBase
    this.arity = func.type.results.length
    this.mem = inst.memories[0] || null
    this.globals = inst.globals
  }
}

class Label {
  constructor(blk, height) {
    this.blk = blk
    this.height = height
  }
}

const EMPTY = []

class Rec {
  constructor(m) {
    this.fr = null
    this.pc = 0
    this.sp = m.sp
    this.low = m.sp
    this.sv = EMPTY
    this.st = EMPTY
    this.fl = this.lowF = m.frames.length
    this.ll = this.lowL = m.labels.length
    this.fs = null
    this.ls = null
    this.fx = null
    this.status = m.status
    this.trap = m.trap
    this.results = m.results
    this.exitCode = m.exitCode
  }
}

// effect kinds in Rec.fx entries: [kind, ...]
const FX_LOCAL = 0, FX_GLOBAL = 1, FX_MEM = 2, FX_GROW = 3, FX_TABLE = 4, FX_TGROW = 5, FX_DROP = 6

function popcnt32(x) {
  x = x - ((x >>> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  x = (x + (x >>> 4)) & 0x0f0f0f0f
  return Math.imul(x, 0x01010101) >>> 24
}
function ctz32(x) {
  return x === 0 ? 32 : 31 - Math.clz32(x & -x)
}

const LOAD_INFO_OBJ = {
  0x28: [4, 'i32'], 0x29: [8, 'i64'], 0x2a: [4, 'f32'], 0x2b: [8, 'f64'],
  0x2c: [1, 'i32'], 0x2d: [1, 'i32'], 0x2e: [2, 'i32'], 0x2f: [2, 'i32'],
  0x30: [1, 'i64'], 0x31: [1, 'i64'], 0x32: [2, 'i64'], 0x33: [2, 'i64'], 0x34: [4, 'i64'], 0x35: [4, 'i64'],
  0x36: [4], 0x37: [8], 0x38: [4], 0x39: [8], 0x3a: [1], 0x3b: [2], 0x3c: [1], 0x3d: [2], 0x3e: [4],
}

const LOAD_W = new Uint8Array(256)
const LOAD_T = new Array(256).fill(null)
for (const k of Object.keys(LOAD_INFO_OBJ)) {
  LOAD_W[k] = LOAD_INFO_OBJ[k][0]
  LOAD_T[k] = LOAD_INFO_OBJ[k][1] || null
}

const TWO63 = 9223372036854775808
const TWO64 = 18446744073709551616

// ---------------------------------------------------------------------------
// Machine

const DEFAULTS = {
  history: 10000,
  maxCallDepth: 10000,
  maxValueStack: 1 << 20,
  maxMemoryPages: 16384,
  start: 'run',
}

export class Machine {
  /**
   * Usually created through instantiate(). `instance` may be shared between
   * machines (each machine is an independent executor over the same store).
   */
  constructor(instance, options = {}) {
    this.options = { ...DEFAULTS, ...options }
    this.instance = instance
    this.module = instance.module
    this.exports = instance.exports
    this.historyLimit = this.options.history
    this.maxCallDepth = this.options.maxCallDepth
    this.maxValueStack = this.options.maxValueStack
    this._clear()
    this._breakpoints = []
    this._caller = makeCaller(this)
    this._running = false
  }

  _clear() {
    this.vs = []
    this.vt = []
    this.sp = 0
    this.frames = []
    this.labels = []
    this.status = 'idle'
    this.trap = null
    this.results = null
    this.exitCode = null
    this.steps = 0
    this.entry = null
    this._hist = new Array(Math.max(0, this.historyLimit))
    this._histHead = 0
    this._histCount = 0
    this._rec = null
  }

  // ---- public state accessors --------------------------------------------

  get memory() {
    return this.instance.memories[0] || null
  }
  get globals() {
    return this.instance.globals
  }
  get tables() {
    return this.instance.tables
  }
  get stack() {
    const out = new Array(this.sp)
    for (let i = 0; i < this.sp; i++) out[i] = { type: this.vt[i], value: this.vs[i] }
    return out
  }
  get stackHeight() {
    return this.sp
  }
  get historySize() {
    return this._histCount
  }
  get canStepBack() {
    return this._histCount > 0
  }
  /** The next instruction to execute: {funcIndex, pc, instr, offset} or null. */
  get location() {
    const fr = this.frames[this.frames.length - 1]
    if (!fr || this.status !== 'ready') return null
    const ins = fr.c.code[fr.pc]
    return { funcIndex: fr.funcIndex, pc: fr.pc, instr: ins, offset: ins.offset, inst: fr.inst }
  }
  /** Frames bottom -> top, as plain descriptive objects. */
  get callStack() {
    const out = []
    for (let i = 0; i < this.frames.length; i++) {
      const fr = this.frames[i]
      const top = i === this.frames.length - 1
      const nextBase = top ? this.sp : this.frames[i + 1].stackBase
      const mod = fr.inst.module
      const lnames = mod.names.locals.get(fr.funcIndex)
      const lb = fr.labelBase
      const le = top ? this.labels.length : this.frames[i + 1].labelBase
      const labels = []
      for (let j = lb; j < le; j++) {
        const L = this.labels[j]
        labels.push({
          kind: L.blk.kind, height: L.height, start: L.blk.start, else: L.blk.else, end: L.blk.end,
          arity: L.blk.kind === 'loop' ? L.blk.params : L.blk.results, depth: le - 1 - j,
        })
      }
      out.push({
        funcIndex: fr.funcIndex,
        name: fr.func.name,
        sameInstance: fr.inst === this.instance,
        pc: fr.pc,
        instr: fr.c.code[fr.pc],
        offset: fr.c.code[fr.pc] ? fr.c.code[fr.pc].offset : null,
        locals: fr.locals.map((v, k) => ({ index: k, type: fr.localTypes[k], value: v, name: lnames ? lnames.get(k) ?? null : null, isParam: k < fr.func.type.params.length })),
        stackBase: fr.stackBase,
        stackHeight: nextBase - fr.stackBase,
        labels,
        resultTypes: fr.func.type.results,
      })
    }
    return out
  }

  /** Deep copy of all mutable state (for tests / time-travel UIs). */
  snapshot() {
    const inst = this.instance
    return {
      status: this.status,
      stack: this.stack.map((x) => ({ type: x.type, value: x.value })),
      frames: this.frames.map((f) => ({ funcIndex: f.funcIndex, pc: f.pc, locals: f.locals.slice(), stackBase: f.stackBase, labelBase: f.labelBase })),
      labels: this.labels.map((l) => ({ kind: l.blk.kind, start: l.blk.start, height: l.height })),
      globals: inst.globals.map((g) => g.value),
      memories: inst.memories.map((m) => ({ pages: m.pages, bytes: m.bytes.slice() })),
      tables: inst.tables.map((t) => t.elements.slice()),
      elemsDropped: inst.elems.map((e) => e.dropped),
      datasDropped: inst.datas.map((d) => d.dropped),
      trap: this.trap ? { ...this.trap } : null,
      results: this.results ? this.results.map((r) => ({ ...r })) : null,
      steps: this.steps,
    }
  }

  // ---- setting up calls ---------------------------------------------------

  _resolveFunc(target) {
    if (target instanceof FuncInst) return target
    if (typeof target === 'number') {
      const f = this.instance.funcs[target]
      if (!f) throw new RangeError(`no function with index ${target}`)
      return f
    }
    const e = this.instance.exports[target]
    if (!(e instanceof FuncInst)) throw new RangeError(`no exported function named "${target}"`)
    return e
  }

  /**
   * Set up a call without executing anything. Afterwards status is 'ready',
   * the callee frame is on the call stack with its parameters in its locals,
   * and the next step() executes the callee's first instruction.
   * (Invoking a host function runs it immediately; status becomes 'done'.)
   */
  invoke(target, args = []) {
    if (this._running) throw new Error('machine is running; use callSync() for re-entrant calls')
    const fi = this._resolveFunc(target)
    const params = fi.type.params
    if (args.length !== params.length) throw new TypeError(`function expects ${params.length} argument(s), got ${args.length}`)
    this._clear()
    this.entry = fi
    for (let i = 0; i < params.length; i++) {
      this.vs[i] = toWasm(params[i], args[i])
      this.vt[i] = params[i]
    }
    this.sp = params.length
    this.status = 'ready'
    if (fi.host) {
      try {
        this._callHost(fi, null)
        this._finish()
      } catch (e) {
        this._fail(e, null)
      }
      return this
    }
    this._enter(fi)
    return this
  }

  /**
   * Run a function to completion on this machine and return its results as an
   * array of JS values (throws Trap / ProcExit). If the machine is busy (e.g.
   * called from inside a host function), runs on a temporary child machine.
   */
  call(target, args = [], opts = {}) {
    if (this._running) return this.callSync(target, args, opts)
    this.invoke(target, args)
    this.run({ maxSteps: opts.maxSteps, record: opts.record ?? false, breakpoints: [] })
    return this._settle()
  }

  /** Like call() but always on a fresh child machine sharing the instance. */
  callSync(target, args = [], opts = {}) {
    const fi = this._resolveFunc(target)
    const inst = fi.inst || this.instance
    const child = new Machine(inst, { ...this.options, history: 0 })
    child.invoke(fi, args)
    child.run({ maxSteps: opts.maxSteps, record: false })
    return child._settle()
  }

  _settle() {
    if (this.status === 'done') return this.results.map((r) => r.value)
    if (this.status === 'trapped') throw this.trap.error
    if (this.status === 'exited') throw new ProcExit(this.exitCode)
    throw new Error(`function did not finish (status ${this.status}, ${this.steps} steps)`)
  }

  /** A JS function wrapping an exported wasm function (runs on a child machine). */
  exportedFunction(name) {
    const fi = this._resolveFunc(name)
    return (...args) => {
      const r = this.callSync(fi, args)
      return r.length === 0 ? undefined : r.length === 1 ? r[0] : r
    }
  }

  /**
   * Reset to the freshly-instantiated state: rebuild memories, tables, globals
   * and segments from the module, clear stacks and history. Imported objects
   * are not reset. If the module has a start function it is set up/run again
   * according to options.start.
   */
  reset() {
    const inst = createInstance(this.module, this._imports, this.options)
    this.instance = inst
    this.exports = inst.exports
    this._clear()
    this._applyBreakpoints()
    if (this.module.start != null) this._start()
    return this
  }

  _start() {
    const mode = this.options.start
    if (mode === 'skip') return
    this.invoke(this.module.start, [])
    this.entry = this.instance.funcs[this.module.start]
    if (mode === 'run') {
      this.run({ record: false })
      if (this.status === 'trapped') throw this.trap.error
      if (this.status === 'exited') throw new ProcExit(this.exitCode)
      if (this.status !== 'done') throw new Error('start function did not finish')
      this._clear()
    }
  }

  // ---- breakpoints --------------------------------------------------------

  /**
   * Set persistent breakpoints: array of {funcIndex, pc} or {offset} (byte
   * offset of any byte inside an instruction). run() stops *before* executing
   * a breakpointed instruction (except on its very first step).
   */
  setBreakpoints(list) {
    this._breakpoints = list.slice()
    this._applyBreakpoints()
  }
  get breakpoints() {
    return this._breakpoints.slice()
  }
  _applyBreakpoints(list = this._breakpoints) {
    for (const f of this.instance.funcs) if (f.inst === this.instance) f.bp = null
    for (const b of list) {
      let fi = b.funcIndex, pc = b.pc
      if (b.offset != null) {
        const loc = findInstrAt(this.module, b.offset)
        if (!loc) continue
        fi = loc.funcIndex
        pc = loc.pc
      }
      const f = this.instance.funcs[fi]
      if (!f || f.inst !== this.instance) continue
      const n = this.module.funcs[fi].body.code.length
      if (!f.bp) f.bp = new Uint8Array(n)
      if (pc >= 0 && pc < n) f.bp[pc] = 1
    }
  }

  // ---- execution ------------------------------------------------------------

  /**
   * Execute exactly one instruction and return an event describing it (see
   * README "Step events"). Never throws for wasm traps or host errors: those
   * produce an event with control.kind === 'trap'. Returns null if there is
   * nothing to execute (status is not 'ready').
   */
  step() {
    if (this.status !== 'ready') return null
    const fr = this.frames[this.frames.length - 1]
    const pc = fr.pc
    const ins = fr.c.code[pc]
    const rec = new Rec(this)
    let err = null
    this._running = true
    try {
      this._exec(rec)
    } catch (e) {
      err = e
    } finally {
      this._running = false
    }
    this.steps++
    if (err) {
      this._fail(err, rec)
      this._push(rec)
      return this._trapEvent(ins, fr, pc)
    }
    this._push(rec)
    return this._event(ins, fr, pc, rec)
  }

  /**
   * Fast execution without events.
   * opts: { maxSteps=Infinity, breakpoints (array, overrides persistent ones for
   *         this run; [] disables), until(machine) -> bool checked before each
   *         instruction, record (default: history > 0) — whether to keep undo
   *         records so stepBack() works afterwards }
   * Returns { reason: 'done'|'trap'|'exit'|'breakpoint'|'until'|'max-steps'|'idle',
   *           steps, location, results?, trap? }.
   */
  run(opts = {}) {
    const maxSteps = opts.maxSteps ?? Infinity
    const record = (opts.record ?? true) && this.historyLimit > 0
    // unrecorded steps would make older undo records inapplicable: drop them
    if (!record && this._histCount > 0) this._dropHistory()
    const until = opts.until || null
    const stopDepth = opts._stopDepth ?? -1
    let restoreBp = false
    if (opts.breakpoints) {
      this._applyBreakpoints(opts.breakpoints)
      restoreBp = true
    }
    let n = 0
    let reason = null
    const frames = this.frames
    this._running = true
    try {
      while (this.status === 'ready') {
        if (n >= maxSteps) {
          reason = 'max-steps'
          break
        }
        const fr = frames[frames.length - 1]
        if (n > 0) {
          const bp = fr.func.bp
          if (bp !== null && bp[fr.pc] === 1) {
            reason = 'breakpoint'
            break
          }
          if (stopDepth >= 0 && frames.length < stopDepth) {
            reason = 'step-complete'
            break
          }
        }
        if (until !== null && until(this)) {
          reason = 'until'
          break
        }
        let rec = null
        if (record) rec = new Rec(this)
        try {
          this._exec(rec)
        } catch (e) {
          this.steps++
          n++
          this._fail(e, rec)
          if (rec) this._push(rec)
          break
        }
        this.steps++
        n++
        if (rec) this._push(rec)
      }
    } finally {
      this._running = false
      if (restoreBp) this._applyBreakpoints()
    }
    if (reason === null && stopDepth >= 0 && this.status === 'ready' && frames.length < stopDepth) reason = 'step-complete'
    if (reason === null) {
      reason = this.status === 'done' ? 'done' : this.status === 'trapped' ? 'trap' : this.status === 'exited' ? 'exit' : this.status === 'ready' ? 'max-steps' : 'idle'
    }
    const out = { reason, steps: n, location: this.location }
    if (this.status === 'done') out.results = this.results
    if (this.status === 'trapped') out.trap = this.trap
    if (this.status === 'exited') out.exitCode = this.exitCode
    return out
  }

  /**
   * Step over: like step(), but if the instruction is a call into wasm, run
   * until that call returns (stopping early at breakpoints if
   * opts.breakpoints !== false). Returns { event, run } where `event` is the
   * event of the call instruction itself and `run` the run() result or null.
   */
  stepOver(opts = {}) {
    if (this.status !== 'ready') return null
    const depth = this.frames.length
    const event = this.step()
    if (!event || this.status !== 'ready' || this.frames.length <= depth) return { event, run: null }
    const run = this.run({ ...opts, _stopDepth: depth + 1, breakpoints: opts.breakpoints === false ? [] : opts.breakpoints })
    return { event, run }
  }

  /** Run until the current function returns to its caller (or finishes). */
  stepOut(opts = {}) {
    if (this.status !== 'ready') return null
    const depth = this.frames.length
    return this.run({ ...opts, _stopDepth: depth, breakpoints: opts.breakpoints === false ? [] : opts.breakpoints })
  }

  /**
   * Undo the most recent step. Returns { funcIndex, pc, instr } of the
   * instruction that is now next again, or null when history is empty.
   * Host side effects other than memory writes made through the caller API
   * (e.g. text already written to stdout) are not undone.
   */
  stepBack() {
    if (this._histCount === 0) return null
    const L = this.historyLimit
    this._histHead = (this._histHead - 1 + L) % L
    const rec = this._hist[this._histHead]
    this._hist[this._histHead] = undefined
    this._histCount--
    this._undo(rec)
    const loc = this.location
    return loc ? { funcIndex: loc.funcIndex, pc: loc.pc, instr: loc.instr, offset: loc.offset } : { funcIndex: null, pc: null, instr: null }
  }

  _dropHistory() {
    this._hist = new Array(Math.max(0, this.historyLimit))
    this._histHead = 0
    this._histCount = 0
  }

  _push(rec) {
    const L = this.historyLimit
    if (L <= 0) return
    this._hist[this._histHead] = rec
    this._histHead = (this._histHead + 1) % L
    if (this._histCount < L) this._histCount++
  }

  _undo(rec) {
    const fx = rec.fx
    if (fx !== null) for (let i = fx.length - 1; i >= 0; i--) this._undoFx(fx[i])
    const frames = this.frames
    frames.length = rec.lowF
    if (rec.fs !== null) for (const f of rec.fs) frames.push(f)
    const labels = this.labels
    labels.length = rec.lowL
    if (rec.ls !== null) for (const l of rec.ls) labels.push(l)
    const sv = rec.sv, st = rec.st, low = rec.low
    for (let i = 0; i < sv.length; i++) {
      this.vs[low + i] = sv[i]
      this.vt[low + i] = st[i]
    }
    this.sp = rec.sp
    if (rec.fr !== null) rec.fr.pc = rec.pc
    this.status = rec.status
    this.trap = rec.trap
    this.results = rec.results
    this.exitCode = rec.exitCode
    this.steps--
  }

  _undoFx(e) {
    switch (e[0]) {
      case FX_LOCAL: e[1].locals[e[2]] = e[3]; break
      case FX_GLOBAL: e[1].value = e[2]; break
      case FX_MEM: e[1].bytes.set(e[3], e[2]); break
      case FX_GROW: {
        const m = e[1]
        m.bytes = e[2]
        m.view = new DataView(m.bytes.buffer)
        m.pages = e[3]
        break
      }
      case FX_TABLE: {
        const els = e[1].elements
        const old = e[3]
        for (let i = 0; i < old.length; i++) els[e[2] + i] = old[i]
        break
      }
      case FX_TGROW: e[1].elements.length = e[2]; break
      case FX_DROP: e[1].dropped = false; break
    }
  }

  _fx(rec, entry) {
    if (rec.fx === null) rec.fx = [entry]
    else rec.fx.push(entry)
  }

  _fail(e, rec) {
    if (rec && rec.fx !== null) {
      // roll back partial effects (only host functions can leave any)
      for (let i = rec.fx.length - 1; i >= 0; i--) this._undoFx(rec.fx[i])
      rec.fx = null
    }
    if (e instanceof ProcExit) {
      this.status = 'exited'
      this.exitCode = e.code
      return
    }
    let t = e
    if (!(e instanceof Trap)) {
      if (e instanceof RangeError && /call stack/i.test(e.message)) t = trap('call-stack-exhausted', 'host recursion')
      else {
        t = trap('host-error', e && e.message ? e.message : String(e))
        t.cause = e
      }
    }
    const fr = this.frames[this.frames.length - 1]
    const ins = fr ? fr.c.code[fr.pc] : null
    this.status = 'trapped'
    this.trap = {
      kind: t.kind,
      message: t.message,
      funcIndex: fr ? fr.funcIndex : null,
      pc: fr ? fr.pc : null,
      offset: ins ? ins.offset : null,
      error: t,
    }
  }

  _finish() {
    const n = this.sp
    const res = new Array(n)
    for (let i = 0; i < n; i++) res[i] = { type: this.vt[i], value: this.vs[i] }
    this.results = res
    this.status = 'done'
  }

  _enter(fi) {
    const frames = this.frames
    if (frames.length >= this.maxCallDepth) throw trap('call-stack-exhausted', `more than ${this.maxCallDepth} nested calls`)
    if (this.sp > this.maxValueStack) throw trap('call-stack-exhausted', 'value stack overflow')
    const np = fi.type.params.length
    const base = this.sp - np
    const fr = new Frame(fi, fi.inst, base, this.labels.length)
    const lt = fr.localTypes
    const locals = new Array(lt.length)
    const vs = this.vs
    for (let i = 0; i < np; i++) locals[i] = vs[base + i]
    for (let i = np; i < lt.length; i++) locals[i] = defaultValue(lt[i])
    fr.locals = locals
    this.sp = base
    frames.push(fr)
    this.labels.push(new Label(fi.inst.module.funcs[fi.index].body.blk, base))
  }

  _callHost(fi, rec) {
    const t = fi.type
    const np = t.params.length
    const base = this.sp - np
    const args = this.vs.slice(base, this.sp)
    let ret
    const prevRec = this._rec
    this._rec = rec
    try {
      ret = fi.withCaller ? fi.host(this._caller, ...args) : fi.host(...args)
    } finally {
      this._rec = prevRec
    }
    const rs = t.results
    let sp = base
    if (rs.length === 1) {
      this.vs[sp] = toWasm(rs[0], ret)
      this.vt[sp] = rs[0]
      sp++
    } else if (rs.length > 1) {
      const arr = ret == null ? [] : Array.from(ret)
      if (arr.length !== rs.length) throw new TypeError(`host function ${fi.name} must return ${rs.length} values`)
      for (let i = 0; i < rs.length; i++) {
        this.vs[sp] = toWasm(rs[i], arr[i])
        this.vt[sp] = rs[i]
        sp++
      }
    }
    this.sp = sp
  }

  _call(fi, rec) {
    if (fi.host !== null) this._callHost(fi, rec)
    else this._enter(fi)
  }

  _save(rec, low) {
    rec.low = low
    rec.sv = this.vs.slice(low, this.sp)
    rec.st = this.vt.slice(low, this.sp)
  }

  /**
   * Return from the top frame. The results are the `arity` values just below
   * the top `pop` operands (a br_if condition / br_table index).
   */
  _return(fr, rec, pop = 0) {
    const base = fr.stackBase
    const arity = fr.arity
    const frames = this.frames
    if (rec !== null) {
      this._save(rec, base)
      rec.lowL = fr.labelBase
      rec.ls = this.labels.slice(fr.labelBase)
      rec.lowF = frames.length - 1
      rec.fs = [fr]
    }
    const vs = this.vs, vt = this.vt
    const from = this.sp - pop - arity
    if (from !== base) {
      for (let i = 0; i < arity; i++) {
        vs[base + i] = vs[from + i]
        vt[base + i] = vt[from + i]
      }
    }
    this.sp = base + arity
    this.labels.length = fr.labelBase
    frames.pop()
    if (frames.length === 0) this._finish()
  }

  /**
   * Branch to the label at index li of the label stack. this.sp still
   * includes `pop` operands (condition / index) that are discarded first.
   */
  _branch(fr, li, rec, pop = 0) {
    const L = this.labels[li]
    const blk = L.blk
    if (blk.kind === 'func') return this._return(fr, rec, pop)
    const loop = blk.kind === 'loop'
    const arity = loop ? blk.params : blk.results
    const h = L.height
    const keep = loop ? li + 1 : li
    if (rec !== null) {
      this._save(rec, h)
      rec.lowL = keep
      rec.ls = this.labels.slice(keep)
    }
    const vs = this.vs, vt = this.vt
    const from = this.sp - pop - arity
    if (from !== h) {
      for (let i = 0; i < arity; i++) {
        vs[h + i] = vs[from + i]
        vt[h + i] = vt[from + i]
      }
    }
    this.sp = h + arity
    this.labels.length = keep
    fr.pc = loop ? blk.start + 1 : blk.end + 1
  }

  _memTrap(ea, len, mem) {
    return trap('out-of-bounds-memory', `access of ${len} byte(s) at address ${ea} (memory is ${mem ? mem.bytes.length : 0} bytes)`)
  }

  /** Execute one instruction of the top frame. Throws Trap/ProcExit. */
  _exec(rec) {
    const frames = this.frames
    const fr = frames[frames.length - 1]
    const pc = fr.pc
    const c = fr.c
    const op = c.ops[pc]
    const vs = this.vs, vt = this.vt
    let sp = this.sp
    if (rec !== null) {
      rec.fr = fr
      rec.pc = pc
      const p = c.pops[pc]
      if (p > 0) {
        rec.low = sp - p
        rec.sv = vs.slice(sp - p, sp)
        rec.st = vt.slice(sp - p, sp)
      }
    }
    let a, b, x, mem, ea
    switch (op) {
      // ---- control ----------------------------------------------------
      case 0x00:
        throw trap('unreachable')
      case 0x01:
        break
      case 0x02: // block
      case 0x03: { // loop
        const blk = c.imm[pc]
        this.labels.push(new Label(blk, sp - blk.params))
        break
      }
      case 0x04: { // if
        const blk = c.imm[pc]
        const cond = vs[--sp]
        this.labels.push(new Label(blk, sp - blk.params))
        this.sp = sp
        if (cond !== 0) fr.pc = pc + 1
        else fr.pc = blk.else >= 0 ? blk.else + 1 : blk.end
        return
      }
      case 0x05: // else: end of the then-arm, jump to the matching end
        fr.pc = c.imm[pc].end
        return
      case 0x0b: { // end
        const blk = c.imm[pc]
        if (blk.kind === 'func') {
          this._return(fr, rec)
          return
        }
        if (rec !== null) {
          rec.lowL = this.labels.length - 1
          rec.ls = [this.labels[rec.lowL]]
        }
        this.labels.pop()
        break
      }
      case 0x0c: // br
        this._branch(fr, this.labels.length - 1 - c.imm[pc], rec)
        return
      case 0x0d: { // br_if
        if (vs[sp - 1] === 0) {
          if (rec !== null) {
            rec.low = sp - 1
            rec.sv = [0]
            rec.st = ['i32']
          }
          sp--
          break
        }
        this._branch(fr, this.labels.length - 1 - c.imm[pc], rec, 1)
        return
      }
      case 0x0e: { // br_table
        const i = vs[sp - 1] >>> 0
        const targets = c.imm[pc]
        const depth = i < targets.length ? targets[i] : c.imm2[pc]
        this._branch(fr, this.labels.length - 1 - depth, rec, 1)
        return
      }
      case 0x0f: // return
        this._return(fr, rec)
        return
      case 0x10: { // call
        const fi = fr.inst.funcs[c.imm[pc]]
        fr.pc = pc + 1
        this.sp = sp
        try {
          this._call(fi, rec)
        } catch (e) {
          fr.pc = pc
          this.sp = sp
          throw e
        }
        return
      }
      case 0x11: { // call_indirect
        const tab = fr.inst.tables[c.imm2[pc]]
        const i = vs[sp - 1] >>> 0
        if (i >= tab.elements.length) throw trap('undefined-element', `index ${i} is outside table of ${tab.elements.length}`)
        const fi = tab.elements[i]
        if (fi === null) throw new Trap('uninitialized-element', `uninitialized element ${i} (table slot is null)`)
        const want = fr.inst.module.types[c.imm[pc]]
        const key = want.key || (want.key = typeKey(want))
        if (fi.typeKey !== key) throw trap('indirect-call-type-mismatch', `expected (${want.params})->(${want.results}) but element ${i} is (${fi.type.params})->(${fi.type.results})`)
        fr.pc = pc + 1
        this.sp = sp - 1
        try {
          this._call(fi, rec)
        } catch (e) {
          fr.pc = pc
          this.sp = sp
          throw e
        }
        return
      }
      case 0x1a: // drop
        sp--
        break
      case 0x1b: // select
      case 0x1c: {
        const cond = vs[--sp]
        sp--
        if (cond === 0) {
          vs[sp - 1] = vs[sp]
        }
        break
      }

      // ---- variables ----------------------------------------------------
      case 0x20: {
        const i = c.imm[pc]
        vs[sp] = fr.locals[i]
        vt[sp] = fr.localTypes[i]
        sp++
        break
      }
      case 0x21: {
        const i = c.imm[pc]
        if (rec !== null) this._fx(rec, [FX_LOCAL, fr, i, fr.locals[i]])
        fr.locals[i] = vs[--sp]
        break
      }
      case 0x22: {
        const i = c.imm[pc]
        if (rec !== null) this._fx(rec, [FX_LOCAL, fr, i, fr.locals[i]])
        fr.locals[i] = vs[sp - 1]
        break
      }
      case 0x23: {
        const g = fr.globals[c.imm[pc]]
        vs[sp] = g.value
        vt[sp] = g.type
        sp++
        break
      }
      case 0x24: {
        const g = fr.globals[c.imm[pc]]
        if (rec !== null) this._fx(rec, [FX_GLOBAL, g, g.value])
        g.value = vs[--sp]
        break
      }
      case 0x25: { // table.get
        const tab = fr.inst.tables[c.imm[pc]]
        const i = vs[sp - 1] >>> 0
        if (i >= tab.elements.length) throw trap('out-of-bounds-table', `table.get index ${i} (table size ${tab.elements.length})`)
        vs[sp - 1] = tab.elements[i]
        vt[sp - 1] = tab.elemType
        break
      }
      case 0x26: { // table.set
        const tab = fr.inst.tables[c.imm[pc]]
        const v = vs[sp - 1]
        const i = vs[sp - 2] >>> 0
        if (i >= tab.elements.length) throw trap('out-of-bounds-table', `table.set index ${i} (table size ${tab.elements.length})`)
        if (rec !== null) this._fx(rec, [FX_TABLE, tab, i, [tab.elements[i]]])
        tab.elements[i] = v
        sp -= 2
        break
      }

      // ---- memory -------------------------------------------------------
      case 0x28: case 0x29: case 0x2a: case 0x2b: case 0x2c: case 0x2d: case 0x2e:
      case 0x2f: case 0x30: case 0x31: case 0x32: case 0x33: case 0x34: case 0x35: {
        mem = fr.mem
        ea = (vs[sp - 1] >>> 0) + c.imm[pc]
        const w = LOAD_W[op]
        if (ea + w > mem.bytes.length) throw this._memTrap(ea, w, mem)
        const dv = mem.view
        switch (op) {
          case 0x28: x = dv.getInt32(ea, true); break
          case 0x29: x = dv.getBigInt64(ea, true); break
          case 0x2a: x = f32FromBits(dv.getUint32(ea, true)); break
          case 0x2b: x = f64FromWords(dv.getUint32(ea + 4, true), dv.getUint32(ea, true)); break
          case 0x2c: x = dv.getInt8(ea); break
          case 0x2d: x = dv.getUint8(ea); break
          case 0x2e: x = dv.getInt16(ea, true); break
          case 0x2f: x = dv.getUint16(ea, true); break
          case 0x30: x = BigInt(dv.getInt8(ea)); break
          case 0x31: x = BigInt(dv.getUint8(ea)); break
          case 0x32: x = BigInt(dv.getInt16(ea, true)); break
          case 0x33: x = BigInt(dv.getUint16(ea, true)); break
          case 0x34: x = BigInt(dv.getInt32(ea, true)); break
          case 0x35: x = BigInt(dv.getUint32(ea, true)); break
        }
        vs[sp - 1] = x
        vt[sp - 1] = LOAD_T[op]
        break
      }
      case 0x36: case 0x37: case 0x38: case 0x39: case 0x3a: case 0x3b: case 0x3c: case 0x3d: case 0x3e: {
        mem = fr.mem
        x = vs[sp - 1]
        ea = (vs[sp - 2] >>> 0) + c.imm[pc]
        const w = LOAD_W[op]
        if (ea + w > mem.bytes.length) throw this._memTrap(ea, w, mem)
        if (rec !== null) this._fx(rec, [FX_MEM, mem, ea, mem.bytes.slice(ea, ea + w)])
        const dv = mem.view
        switch (op) {
          case 0x36: dv.setInt32(ea, x, true); break
          case 0x37: dv.setBigInt64(ea, x, true); break
          case 0x38: dv.setUint32(ea, f32Bits(x), true); break
          case 0x39: {
            const wd = f64Words(x)
            dv.setUint32(ea, wd[1], true)
            dv.setUint32(ea + 4, wd[0], true)
            break
          }
          case 0x3a: dv.setInt8(ea, x); break
          case 0x3b: dv.setInt16(ea, x, true); break
          case 0x3c: dv.setUint8(ea, Number(x & 0xffn)); break
          case 0x3d: dv.setUint16(ea, Number(x & 0xffffn), true); break
          case 0x3e: dv.setUint32(ea, Number(x & 0xffffffffn), true); break
        }
        sp -= 2
        break
      }
      case 0x3f: // memory.size
        vs[sp] = fr.mem.pages
        vt[sp] = 'i32'
        sp++
        break
      case 0x40: { // memory.grow
        mem = fr.mem
        const oldBytes = mem.bytes, oldPages = mem.pages
        const r = mem.grow(vs[sp - 1] >>> 0)
        if (rec !== null && r !== -1 && mem.bytes !== oldBytes) this._fx(rec, [FX_GROW, mem, oldBytes, oldPages])
        vs[sp - 1] = r
        break
      }
      case 0xe8: { // memory.init
        mem = fr.mem
        const n = vs[sp - 1] >>> 0, s = vs[sp - 2] >>> 0, d = vs[sp - 3] >>> 0
        const seg = fr.inst.datas[c.imm[pc]]
        const segLen = seg.dropped ? 0 : seg.bytes.length
        if (s + n > segLen) throw trap('out-of-bounds-memory', `memory.init reads ${n} byte(s) at ${s} from data segment of ${segLen}`)
        if (d + n > mem.bytes.length) throw this._memTrap(d, n, mem)
        if (rec !== null && n > 0) this._fx(rec, [FX_MEM, mem, d, mem.bytes.slice(d, d + n)])
        mem.bytes.set(seg.bytes.subarray(s, s + n), d)
        sp -= 3
        break
      }
      case 0xe9: { // data.drop
        const seg = fr.inst.datas[c.imm[pc]]
        if (!seg.dropped) {
          if (rec !== null) this._fx(rec, [FX_DROP, seg])
          seg.dropped = true
        }
        break
      }
      case 0xea: { // memory.copy
        mem = fr.mem
        const n = vs[sp - 1] >>> 0, s = vs[sp - 2] >>> 0, d = vs[sp - 3] >>> 0
        const len = mem.bytes.length
        if (s + n > len) throw this._memTrap(s, n, mem)
        if (d + n > len) throw this._memTrap(d, n, mem)
        if (rec !== null && n > 0) this._fx(rec, [FX_MEM, mem, d, mem.bytes.slice(d, d + n)])
        mem.bytes.copyWithin(d, s, s + n)
        sp -= 3
        break
      }
      case 0xeb: { // memory.fill
        mem = fr.mem
        const n = vs[sp - 1] >>> 0, v = vs[sp - 2] & 0xff, d = vs[sp - 3] >>> 0
        if (d + n > mem.bytes.length) throw this._memTrap(d, n, mem)
        if (rec !== null && n > 0) this._fx(rec, [FX_MEM, mem, d, mem.bytes.slice(d, d + n)])
        mem.bytes.fill(v, d, d + n)
        sp -= 3
        break
      }

      // ---- tables (bulk) --------------------------------------------------
      case 0xec: { // table.init
        const tab = fr.inst.tables[c.imm2[pc]]
        const seg = fr.inst.elems[c.imm[pc]]
        const n = vs[sp - 1] >>> 0, s = vs[sp - 2] >>> 0, d = vs[sp - 3] >>> 0
        const segLen = seg.dropped ? 0 : seg.refs.length
        if (s + n > segLen || d + n > tab.elements.length) throw trap('out-of-bounds-table', `table.init of ${n} element(s)`)
        if (rec !== null && n > 0) this._fx(rec, [FX_TABLE, tab, d, tab.elements.slice(d, d + n)])
        for (let i = 0; i < n; i++) tab.elements[d + i] = seg.refs[s + i]
        sp -= 3
        break
      }
      case 0xed: { // elem.drop
        const seg = fr.inst.elems[c.imm[pc]]
        if (!seg.dropped) {
          if (rec !== null) this._fx(rec, [FX_DROP, seg])
          seg.dropped = true
        }
        break
      }
      case 0xee: { // table.copy
        const dt = fr.inst.tables[c.imm[pc]], st2 = fr.inst.tables[c.imm2[pc]]
        const n = vs[sp - 1] >>> 0, s = vs[sp - 2] >>> 0, d = vs[sp - 3] >>> 0
        if (s + n > st2.elements.length || d + n > dt.elements.length) throw trap('out-of-bounds-table', `table.copy of ${n} element(s)`)
        if (rec !== null && n > 0) this._fx(rec, [FX_TABLE, dt, d, dt.elements.slice(d, d + n)])
        const tmp = st2.elements.slice(s, s + n)
        for (let i = 0; i < n; i++) dt.elements[d + i] = tmp[i]
        sp -= 3
        break
      }
      case 0xef: { // table.grow
        const tab = fr.inst.tables[c.imm[pc]]
        const n = vs[sp - 1] >>> 0
        const init = vs[sp - 2]
        const oldLen = tab.elements.length
        const r = tab.grow(n, init)
        if (rec !== null && r !== -1 && n > 0) this._fx(rec, [FX_TGROW, tab, oldLen])
        sp--
        vs[sp - 1] = r
        vt[sp - 1] = 'i32'
        break
      }
      case 0xf0: { // table.size
        vs[sp] = fr.inst.tables[c.imm[pc]].elements.length
        vt[sp] = 'i32'
        sp++
        break
      }
      case 0xf1: { // table.fill
        const tab = fr.inst.tables[c.imm[pc]]
        const n = vs[sp - 1] >>> 0, v = vs[sp - 2], i0 = vs[sp - 3] >>> 0
        if (i0 + n > tab.elements.length) throw trap('out-of-bounds-table', `table.fill of ${n} element(s) at ${i0}`)
        if (rec !== null && n > 0) this._fx(rec, [FX_TABLE, tab, i0, tab.elements.slice(i0, i0 + n)])
        for (let i = 0; i < n; i++) tab.elements[i0 + i] = v
        sp -= 3
        break
      }

      // ---- references -----------------------------------------------------
      case 0xd0:
        vs[sp] = null
        vt[sp] = c.imm[pc]
        sp++
        break
      case 0xd1:
        vs[sp - 1] = vs[sp - 1] === null ? 1 : 0
        vt[sp - 1] = 'i32'
        break
      case 0xd2:
        vs[sp] = fr.inst.funcs[c.imm[pc]]
        vt[sp] = 'funcref'
        sp++
        break

      // ---- constants ------------------------------------------------------
      case 0x41: vs[sp] = c.imm[pc]; vt[sp] = 'i32'; sp++; break
      case 0x42: vs[sp] = c.imm[pc]; vt[sp] = 'i64'; sp++; break
      case 0x43: vs[sp] = c.imm[pc]; vt[sp] = 'f32'; sp++; break
      case 0x44: vs[sp] = c.imm[pc]; vt[sp] = 'f64'; sp++; break

      // ---- i32 comparisons --------------------------------------------------
      case 0x45: vs[sp - 1] = vs[sp - 1] === 0 ? 1 : 0; break
      case 0x46: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] === b ? 1 : 0; break
      case 0x47: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] !== b ? 1 : 0; break
      case 0x48: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] < b ? 1 : 0; break
      case 0x49: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] >>> 0) < (b >>> 0) ? 1 : 0; break
      case 0x4a: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] > b ? 1 : 0; break
      case 0x4b: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] >>> 0) > (b >>> 0) ? 1 : 0; break
      case 0x4c: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] <= b ? 1 : 0; break
      case 0x4d: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] >>> 0) <= (b >>> 0) ? 1 : 0; break
      case 0x4e: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] >= b ? 1 : 0; break
      case 0x4f: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] >>> 0) >= (b >>> 0) ? 1 : 0; break

      // ---- i64 comparisons (result i32) -------------------------------------
      case 0x50: vs[sp - 1] = vs[sp - 1] === 0n ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x51: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] === b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x52: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] !== b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x53: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] < b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x54: b = vs[--sp]; vs[sp - 1] = BigInt.asUintN(64, vs[sp - 1]) < BigInt.asUintN(64, b) ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x55: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] > b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x56: b = vs[--sp]; vs[sp - 1] = BigInt.asUintN(64, vs[sp - 1]) > BigInt.asUintN(64, b) ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x57: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] <= b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x58: b = vs[--sp]; vs[sp - 1] = BigInt.asUintN(64, vs[sp - 1]) <= BigInt.asUintN(64, b) ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x59: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] >= b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x5a: b = vs[--sp]; vs[sp - 1] = BigInt.asUintN(64, vs[sp - 1]) >= BigInt.asUintN(64, b) ? 1 : 0; vt[sp - 1] = 'i32'; break

      // ---- float comparisons (NaN-aware via unary +) -----------------------
      case 0x5b: case 0x61: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] === b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x5c: case 0x62: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] !== b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x5d: case 0x63: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] < b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x5e: case 0x64: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] > b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x5f: case 0x65: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] <= b ? 1 : 0; vt[sp - 1] = 'i32'; break
      case 0x60: case 0x66: b = +vs[--sp]; vs[sp - 1] = +vs[sp - 1] >= b ? 1 : 0; vt[sp - 1] = 'i32'; break

      // ---- i32 arithmetic ---------------------------------------------------
      case 0x67: vs[sp - 1] = Math.clz32(vs[sp - 1]); break
      case 0x68: vs[sp - 1] = ctz32(vs[sp - 1]); break
      case 0x69: vs[sp - 1] = popcnt32(vs[sp - 1]); break
      case 0x6a: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] + b) | 0; break
      case 0x6b: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] - b) | 0; break
      case 0x6c: b = vs[--sp]; vs[sp - 1] = Math.imul(vs[sp - 1], b); break
      case 0x6d:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0) throw trap('integer-divide-by-zero')
        if (a === -2147483648 && b === -1) throw trap('integer-overflow', '-2147483648 / -1')
        vs[--sp - 1] = (a / b) | 0
        break
      case 0x6e:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = ((a >>> 0) / (b >>> 0)) | 0
        break
      case 0x6f:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = (a % b) | 0
        break
      case 0x70:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = ((a >>> 0) % (b >>> 0)) | 0
        break
      case 0x71: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] & b; break
      case 0x72: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] | b; break
      case 0x73: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] ^ b; break
      case 0x74: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] << b; break
      case 0x75: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] >> b; break
      case 0x76: b = vs[--sp]; vs[sp - 1] = (vs[sp - 1] >>> b) | 0; break
      case 0x77: b = vs[--sp] & 31; a = vs[sp - 1]; vs[sp - 1] = (a << b) | (a >>> (32 - b)); break
      case 0x78: b = vs[--sp] & 31; a = vs[sp - 1]; vs[sp - 1] = (a >>> b) | (a << (32 - b)); break

      // ---- i64 arithmetic ---------------------------------------------------
      case 0x79: {
        a = vs[sp - 1]
        const hi = Number((a >> 32n) & 0xffffffffn), lo = Number(a & 0xffffffffn)
        vs[sp - 1] = BigInt(hi !== 0 ? Math.clz32(hi) : 32 + Math.clz32(lo))
        break
      }
      case 0x7a: {
        a = vs[sp - 1]
        const hi = Number((a >> 32n) & 0xffffffffn), lo = Number(a & 0xffffffffn)
        vs[sp - 1] = BigInt(lo !== 0 ? ctz32(lo) : 32 + ctz32(hi))
        break
      }
      case 0x7b: {
        a = vs[sp - 1]
        const hi = Number((a >> 32n) & 0xffffffffn), lo = Number(a & 0xffffffffn)
        vs[sp - 1] = BigInt(popcnt32(hi) + popcnt32(lo))
        break
      }
      case 0x7c: b = vs[--sp]; vs[sp - 1] = BigInt.asIntN(64, vs[sp - 1] + b); break
      case 0x7d: b = vs[--sp]; vs[sp - 1] = BigInt.asIntN(64, vs[sp - 1] - b); break
      case 0x7e: b = vs[--sp]; vs[sp - 1] = BigInt.asIntN(64, vs[sp - 1] * b); break
      case 0x7f:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0n) throw trap('integer-divide-by-zero')
        if (a === -9223372036854775808n && b === -1n) throw trap('integer-overflow', '-9223372036854775808 / -1')
        vs[--sp - 1] = a / b
        break
      case 0x80:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0n) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = BigInt.asIntN(64, BigInt.asUintN(64, a) / BigInt.asUintN(64, b))
        break
      case 0x81:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0n) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = a % b
        break
      case 0x82:
        b = vs[sp - 1]; a = vs[sp - 2]
        if (b === 0n) throw trap('integer-divide-by-zero')
        vs[--sp - 1] = BigInt.asIntN(64, BigInt.asUintN(64, a) % BigInt.asUintN(64, b))
        break
      case 0x83: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] & b; break
      case 0x84: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] | b; break
      case 0x85: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] ^ b; break
      case 0x86: b = vs[--sp]; vs[sp - 1] = BigInt.asIntN(64, vs[sp - 1] << (b & 63n)); break
      case 0x87: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] >> (b & 63n); break
      case 0x88: b = vs[--sp]; vs[sp - 1] = BigInt.asIntN(64, BigInt.asUintN(64, vs[sp - 1]) >> (b & 63n)); break
      case 0x89: case 0x8a: {
        b = vs[--sp] & 63n
        if (b !== 0n) {
          const u = BigInt.asUintN(64, vs[sp - 1])
          if (op === 0x8a) b = 64n - b
          vs[sp - 1] = BigInt.asIntN(64, (u << b) | (u >> (64n - b)))
        }
        break
      }

      // ---- f32 arithmetic ---------------------------------------------------
      case 0x8b: vs[sp - 1] = f32Abs(vs[sp - 1]); break
      case 0x8c: vs[sp - 1] = f32Neg(vs[sp - 1]); break
      case 0x8d: vs[sp - 1] = Math.fround(Math.ceil(vs[sp - 1])); break
      case 0x8e: vs[sp - 1] = Math.fround(Math.floor(vs[sp - 1])); break
      case 0x8f: vs[sp - 1] = Math.fround(Math.trunc(vs[sp - 1])); break
      case 0x90: vs[sp - 1] = Math.fround(nearest(vs[sp - 1])); break
      case 0x91: vs[sp - 1] = Math.fround(Math.sqrt(vs[sp - 1])); break
      case 0x92: b = vs[--sp]; vs[sp - 1] = Math.fround(vs[sp - 1] + b); break
      case 0x93: b = vs[--sp]; vs[sp - 1] = Math.fround(vs[sp - 1] - b); break
      case 0x94: b = vs[--sp]; vs[sp - 1] = Math.fround(vs[sp - 1] * b); break
      case 0x95: b = vs[--sp]; vs[sp - 1] = Math.fround(vs[sp - 1] / b); break
      case 0x96: b = vs[--sp]; vs[sp - 1] = Math.min(vs[sp - 1], b); break
      case 0x97: b = vs[--sp]; vs[sp - 1] = Math.max(vs[sp - 1], b); break
      case 0x98: b = vs[--sp]; vs[sp - 1] = f32Copysign(vs[sp - 1], b); break

      // ---- f64 arithmetic ---------------------------------------------------
      case 0x99: vs[sp - 1] = f64Abs(vs[sp - 1]); break
      case 0x9a: vs[sp - 1] = f64Neg(vs[sp - 1]); break
      case 0x9b: vs[sp - 1] = Math.ceil(vs[sp - 1]); break
      case 0x9c: vs[sp - 1] = Math.floor(vs[sp - 1]); break
      case 0x9d: vs[sp - 1] = Math.trunc(vs[sp - 1]); break
      case 0x9e: vs[sp - 1] = nearest(vs[sp - 1]); break
      case 0x9f: vs[sp - 1] = Math.sqrt(vs[sp - 1]); break
      case 0xa0: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] + b; break
      case 0xa1: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] - b; break
      case 0xa2: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] * b; break
      case 0xa3: b = vs[--sp]; vs[sp - 1] = vs[sp - 1] / b; break
      case 0xa4: b = vs[--sp]; vs[sp - 1] = Math.min(vs[sp - 1], b); break
      case 0xa5: b = vs[--sp]; vs[sp - 1] = Math.max(vs[sp - 1], b); break
      case 0xa6: b = vs[--sp]; vs[sp - 1] = f64Copysign(vs[sp - 1], b); break

      // ---- conversions ------------------------------------------------------
      case 0xa7: vs[sp - 1] = Number(BigInt.asIntN(32, vs[sp - 1])); vt[sp - 1] = 'i32'; break
      case 0xa8: case 0xaa: { // i32.trunc_f32_s / f64_s
        x = +vs[sp - 1]
        if (x !== x) throw trap('invalid-conversion', 'NaN')
        x = Math.trunc(x)
        if (x < -2147483648 || x > 2147483647) throw trap('integer-overflow', `${vs[sp - 1]} does not fit in i32`)
        vs[sp - 1] = x | 0
        vt[sp - 1] = 'i32'
        break
      }
      case 0xa9: case 0xab: { // i32.trunc_*_u
        x = +vs[sp - 1]
        if (x !== x) throw trap('invalid-conversion', 'NaN')
        x = Math.trunc(x)
        if (x < 0 || x > 4294967295) throw trap('integer-overflow', `${vs[sp - 1]} does not fit in u32`)
        vs[sp - 1] = x | 0
        vt[sp - 1] = 'i32'
        break
      }
      case 0xac: vs[sp - 1] = BigInt(vs[sp - 1]); vt[sp - 1] = 'i64'; break
      case 0xad: vs[sp - 1] = BigInt(vs[sp - 1] >>> 0); vt[sp - 1] = 'i64'; break
      case 0xae: case 0xb0: { // i64.trunc_*_s
        x = +vs[sp - 1]
        if (x !== x) throw trap('invalid-conversion', 'NaN')
        x = Math.trunc(x)
        if (x < -TWO63 || x >= TWO63) throw trap('integer-overflow', `${vs[sp - 1]} does not fit in i64`)
        vs[sp - 1] = BigInt(x)
        vt[sp - 1] = 'i64'
        break
      }
      case 0xaf: case 0xb1: { // i64.trunc_*_u
        x = +vs[sp - 1]
        if (x !== x) throw trap('invalid-conversion', 'NaN')
        x = Math.trunc(x)
        if (x < 0 || x >= TWO64) throw trap('integer-overflow', `${vs[sp - 1]} does not fit in u64`)
        vs[sp - 1] = BigInt.asIntN(64, BigInt(x))
        vt[sp - 1] = 'i64'
        break
      }
      case 0xb2: vs[sp - 1] = Math.fround(vs[sp - 1]); vt[sp - 1] = 'f32'; break
      case 0xb3: vs[sp - 1] = Math.fround(vs[sp - 1] >>> 0); vt[sp - 1] = 'f32'; break
      case 0xb4: vs[sp - 1] = bigToF32(vs[sp - 1]); vt[sp - 1] = 'f32'; break
      case 0xb5: vs[sp - 1] = bigToF32(BigInt.asUintN(64, vs[sp - 1])); vt[sp - 1] = 'f32'; break
      case 0xb6: vs[sp - 1] = Math.fround(vs[sp - 1]); vt[sp - 1] = 'f32'; break
      case 0xb7: vt[sp - 1] = 'f64'; break
      case 0xb8: vs[sp - 1] = vs[sp - 1] >>> 0; vt[sp - 1] = 'f64'; break
      case 0xb9: vs[sp - 1] = Number(vs[sp - 1]); vt[sp - 1] = 'f64'; break
      case 0xba: vs[sp - 1] = Number(BigInt.asUintN(64, vs[sp - 1])); vt[sp - 1] = 'f64'; break
      case 0xbb: x = vs[sp - 1]; vs[sp - 1] = typeof x === 'number' ? x : NaN; vt[sp - 1] = 'f64'; break
      case 0xbc: vs[sp - 1] = f32Bits(vs[sp - 1]) | 0; vt[sp - 1] = 'i32'; break
      case 0xbd: vs[sp - 1] = f64BitsBig(vs[sp - 1]); vt[sp - 1] = 'i64'; break
      case 0xbe: vs[sp - 1] = f32FromBits(vs[sp - 1]); vt[sp - 1] = 'f32'; break
      case 0xbf: vs[sp - 1] = f64FromBitsBig(vs[sp - 1]); vt[sp - 1] = 'f64'; break
      case 0xc0: vs[sp - 1] = (vs[sp - 1] << 24) >> 24; break
      case 0xc1: vs[sp - 1] = (vs[sp - 1] << 16) >> 16; break
      case 0xc2: vs[sp - 1] = BigInt.asIntN(8, vs[sp - 1]); break
      case 0xc3: vs[sp - 1] = BigInt.asIntN(16, vs[sp - 1]); break
      case 0xc4: vs[sp - 1] = BigInt.asIntN(32, vs[sp - 1]); break

      // ---- saturating truncation (0xFC 0..7) ----------------------------------
      case 0xe0: case 0xe2: {
        x = +vs[sp - 1]
        vs[sp - 1] = x !== x ? 0 : x <= -2147483648 ? -2147483648 : x >= 2147483647 ? 2147483647 : Math.trunc(x) | 0
        vt[sp - 1] = 'i32'
        break
      }
      case 0xe1: case 0xe3: {
        x = +vs[sp - 1]
        vs[sp - 1] = x !== x || x <= 0 ? 0 : x >= 4294967295 ? -1 : Math.trunc(x) | 0
        vt[sp - 1] = 'i32'
        break
      }
      case 0xe4: case 0xe6: {
        x = +vs[sp - 1]
        vs[sp - 1] = x !== x ? 0n : x <= -TWO63 ? -9223372036854775808n : x >= TWO63 ? 9223372036854775807n : BigInt(Math.trunc(x))
        vt[sp - 1] = 'i64'
        break
      }
      case 0xe5: case 0xe7: {
        x = +vs[sp - 1]
        vs[sp - 1] = x !== x || x <= 0 ? 0n : x >= TWO64 ? -1n : BigInt.asIntN(64, BigInt(Math.trunc(x)))
        vt[sp - 1] = 'i64'
        break
      }
      default:
        throw new Error(`internal: opcode 0x${op.toString(16)} not implemented`)
    }
    fr.pc = pc + 1
    this.sp = sp
  }

  // ---- events -------------------------------------------------------------

  _trapEvent(ins, fr, pc) {
    if (this.status === 'exited') {
      return {
        step: this.steps, instr: ins, funcIndex: fr.funcIndex, pc, offset: ins.offset, popped: [], pushed: [],
        control: { kind: 'exit', exitCode: this.exitCode }, trap: null, status: 'exited', done: false, results: null,
        exitCode: this.exitCode,
      }
    }
    const t = this.trap
    return {
      step: this.steps,
      instr: ins,
      funcIndex: fr.funcIndex,
      pc,
      offset: ins.offset,
      popped: [],
      pushed: [],
      control: { kind: 'trap', trap: { kind: t.kind, message: t.message } },
      trap: { kind: t.kind, message: t.message },
      status: this.status,
      done: false,
      results: null,
      exitCode: this.status === 'exited' ? this.exitCode : null,
    }
  }

  _event(ins, fr, pc, rec) {
    const popped = new Array(rec.sv.length)
    for (let i = 0; i < rec.sv.length; i++) popped[i] = { type: rec.st[i], value: rec.sv[i] }
    const pushed = []
    for (let i = rec.low; i < this.sp; i++) pushed.push({ type: this.vt[i], value: this.vs[i] })
    const ev = {
      step: this.steps,
      instr: ins,
      funcIndex: fr.funcIndex,
      pc,
      offset: ins.offset,
      popped,
      pushed,
      control: null,
      status: this.status,
      done: this.status === 'done',
      results: this.status === 'done' ? this.results : null,
      nextPc: this.frames.length ? this.frames[this.frames.length - 1].pc : null,
      instance: fr.inst,
    }
    const fx = rec.fx || EMPTY
    const code = ins.code
    const inst = fr.inst
    switch (code) {
      case 0x20:
        ev.localRead = { index: ins.local, type: fr.localTypes[ins.local], value: fr.locals[ins.local] }
        break
      case 0x21: case 0x22: {
        const e = fx.find((x) => x[0] === FX_LOCAL)
        ev.localWrite = { index: ins.local, type: fr.localTypes[ins.local], old: e ? e[3] : undefined, value: fr.locals[ins.local] }
        break
      }
      case 0x23: {
        const g = inst.globals[ins.global]
        ev.globalRead = { index: ins.global, type: g.type, value: g.value }
        break
      }
      case 0x24: {
        const g = inst.globals[ins.global]
        const e = fx.find((x) => x[0] === FX_GLOBAL)
        ev.globalWrite = { index: ins.global, type: g.type, old: e ? e[2] : undefined, value: g.value }
        break
      }
      case 0x40: {
        const m = inst.memories[0]
        const delta = popped[0].value >>> 0
        const r = pushed[0].value
        ev.memGrow = { delta, oldPages: r === -1 ? m.pages : r, newPages: m.pages, failed: r === -1 }
        break
      }
      case 0x25:
        ev.tableRead = { table: ins.table, index: popped[0].value >>> 0, value: pushed[0].value }
        break
      case 0x26: case 0xec: case 0xee: case 0xf1: {
        const e = fx.find((x) => x[0] === FX_TABLE)
        if (e) ev.tableWrite = { table: e[1] === inst.tables[ins.table] ? ins.table : null, index: e[2], len: e[3].length, before: e[3], after: e[1].elements.slice(e[2], e[2] + e[3].length) }
        break
      }
      case 0xef: {
        const r = pushed[0].value
        ev.tableGrow = { table: ins.table, delta: popped[1].value >>> 0, oldSize: r === -1 ? inst.tables[ins.table].length : r, newSize: inst.tables[ins.table].length, failed: r === -1 }
        break
      }
      case 0xe9: case 0xed:
        ev.dropped = { kind: code === 0xe9 ? 'data' : 'elem', index: code === 0xe9 ? ins.data : ins.elem }
        break
    }
    if (code >= 0x28 && code <= 0x35) {
      const m = inst.memories[0]
      const addr = (popped[0].value >>> 0) + ins.memOffset
      const len = LOAD_W[code]
      ev.memRead = { addr, len, bytes: m.bytes.slice(addr, addr + len) }
    }
    if (code === 0xea) {
      // source range of memory.copy (its bytes are now at the destination: see memWrite.after)
      ev.memRead = { addr: popped[1].value >>> 0, len: popped[2].value >>> 0, bytes: null }
    }
    for (const e of fx) {
      if (e[0] === FX_MEM) {
        const m = e[1]
        const w = { addr: e[2], len: e[3].length, before: e[3], after: m.bytes.slice(e[2], e[2] + e[3].length) }
        if (!ev.memWrite) ev.memWrite = w
        else (ev.memWrites || (ev.memWrites = [ev.memWrite])).push(w)
      }
    }
    if ((code === 0xe8 || code === 0xea || code === 0xeb) && !ev.memWrite) {
      const d = popped[0].value >>> 0
      ev.memWrite = { addr: d, len: 0, before: new Uint8Array(0), after: new Uint8Array(0) }
    }

    // control flow
    const nf = this.frames.length
    const callee = nf > rec.fl ? this.frames[nf - 1] : null
    switch (code) {
      case 0x02: case 0x03:
        ev.control = { kind: 'enter-block', blockKind: ins.blk.kind, start: ins.blk.start, end: ins.blk.end, depth: this.labels.length - fr.labelBase - 1 }
        break
      case 0x04: {
        const taken = popped[popped.length - 1].value !== 0
        ev.control = { kind: 'enter-block', blockKind: 'if', taken, start: ins.blk.start, else: ins.blk.else, end: ins.blk.end, to: fr.pc, depth: this.labels.length - fr.labelBase - 1 }
        break
      }
      case 0x05:
        ev.control = { kind: 'branch', implicit: true, reason: 'end of then-arm', from: pc, to: fr.pc }
        break
      case 0x0b:
        if (ins.blk.kind === 'func') ev.control = this._returnControl(fr, nf, ev)
        else ev.control = { kind: 'exit-block', blockKind: ins.blk.kind, start: ins.blk.start, end: pc }
        break
      case 0x0c: case 0x0d: case 0x0e: {
        let depth
        if (code === 0x0c) depth = ins.depth
        else if (code === 0x0d) depth = ins.depth
        else {
          const i = popped.length ? popped[popped.length - 1].value >>> 0 : 0
          depth = i < ins.targets.length ? ins.targets[i] : ins.deflt
        }
        const taken = code !== 0x0d || popped[popped.length - 1].value !== 0
        if (!taken) {
          ev.control = { kind: 'branch', taken: false, depth, from: pc, to: pc + 1 }
          break
        }
        if (nf < rec.fl || this.status === 'done') {
          ev.control = this._returnControl(fr, nf, ev)
          ev.control.viaBranch = depth
          break
        }
        const first = rec.ls && rec.ls.length ? rec.ls[0] : null
        const target = first && first.blk.kind !== 'loop' && fr.pc === first.blk.end + 1 ? first : this.labels[this.labels.length - 1]
        ev.control = {
          kind: 'branch', taken: true, depth, from: pc, to: fr.pc,
          labelKind: target ? target.blk.kind : null,
          kept: pushed.length, unwound: popped.length - (code === 0x0c ? 0 : 1) - pushed.length,
        }
        break
      }
      case 0x0f:
        ev.control = this._returnControl(fr, nf, ev)
        break
      case 0x10: case 0x11: {
        let fi
        if (code === 0x10) fi = inst.funcs[ins.func]
        else fi = callee ? callee.func : inst.tables[ins.table].elements[popped[popped.length - 1].value >>> 0]
        const args = code === 0x11 ? popped.slice(0, -1) : popped
        if (fi && fi.host) {
          ev.control = { kind: 'host-call', funcIndex: code === 0x10 ? ins.func : null, name: fi.name, module: fi.module, field: fi.field, args, results: pushed, unresolved: !!fi.unresolved, indirect: code === 0x11 }
        } else {
          ev.control = { kind: 'call', funcIndex: fi ? fi.index : null, name: fi ? fi.name : null, args, indirect: code === 0x11, crossInstance: fi ? fi.inst !== inst : false }
          if (code === 0x11) ev.control.elemIndex = popped[popped.length - 1].value >>> 0
        }
        break
      }
    }
    return ev
  }

  _returnControl(fr, nf, ev) {
    const caller = nf > 0 ? this.frames[nf - 1] : null
    return {
      kind: 'return',
      fromFunc: fr.funcIndex,
      toFunc: caller ? caller.funcIndex : null,
      to: caller ? caller.pc : null,
      results: ev.pushed,
    }
  }
}

// ---------------------------------------------------------------------------
// Caller API passed to host functions created with hostFunction()

function makeCaller(machine) {
  const caller = {
    machine,
    get memory() {
      const fr = machine.frames[machine.frames.length - 1]
      return fr ? fr.mem : machine.instance.memories[0] || null
    },
    /** Copy `len` bytes out of linear memory (traps when out of bounds). */
    read(addr, len) {
      const m = caller.memory
      addr >>>= 0
      if (!m || addr + len > m.bytes.length) throw trap('out-of-bounds-memory', `host read of ${len} byte(s) at ${addr}`)
      return m.bytes.slice(addr, addr + len)
    },
    /** Write bytes into linear memory; recorded so stepBack() can undo it. */
    write(addr, bytes) {
      const m = caller.memory
      addr >>>= 0
      if (!m || addr + bytes.length > m.bytes.length) throw trap('out-of-bounds-memory', `host write of ${bytes.length} byte(s) at ${addr}`)
      const rec = machine._rec
      if (rec) machine._fx(rec, [FX_MEM, m, addr, m.bytes.slice(addr, addr + bytes.length)])
      m.bytes.set(bytes, addr)
    },
    u32(addr) {
      const b = caller.read(addr, 4)
      return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0
    },
    setU32(addr, v) {
      caller.write(addr, new Uint8Array([v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]))
    },
    setU64(addr, v) {
      const b = new Uint8Array(8)
      new DataView(b.buffer).setBigUint64(0, BigInt.asUintN(64, BigInt(v)), true)
      caller.write(addr, b)
    },
    string(addr, len) {
      return new TextDecoder().decode(caller.read(addr, len))
    },
    cstring(addr, max = 1 << 20) {
      const m = caller.memory
      let end = addr >>> 0
      while (end < m.bytes.length && m.bytes[end] !== 0 && end - addr < max) end++
      return new TextDecoder().decode(m.bytes.slice(addr, end))
    },
  }
  return caller
}

// ---------------------------------------------------------------------------
// Entry point

/**
 * Decode (if given bytes), validate, link and instantiate a module.
 * @param {object|Uint8Array|ArrayBuffer} moduleOrBytes
 * @param {object} imports  { moduleName: { fieldName: fn | FuncInst | Memory | Table | Global | number } }
 * @param {object} options  { history, maxCallDepth, maxValueStack, maxMemoryPages,
 *                            start:'run'|'pending'|'skip', onMissingImport(imp) }
 * @returns {Machine}
 */
export function instantiate(moduleOrBytes, imports = {}, options = {}) {
  let module = moduleOrBytes
  if (moduleOrBytes instanceof Uint8Array || moduleOrBytes instanceof ArrayBuffer) module = decode(moduleOrBytes)
  if (!module.validated) validate(module)
  const opts = { ...DEFAULTS, ...options }
  const inst = createInstance(module, imports, opts)
  const m = new Machine(inst, opts)
  m._imports = imports
  if (module.start != null) m._start()
  return m
}

export { createInstance }
