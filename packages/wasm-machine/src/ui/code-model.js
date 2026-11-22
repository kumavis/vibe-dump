// Line models for the code pane. Two sources, one interface:
//   * WAT: the user's own text, located through the assembler's source map
//   * binary: the disassembler's per-function listing (one line per pc)
// Model: { kind, funcs:Set|null, lines:[{text, depth?}], locate(f,pc), lineTarget(line),
//          brackets:[{f, kind, startPc, endPc, elsePc, line0, line1, lineElse, lane, name}], lanes }
import { disassembleFunction } from '../engine/index.js'

/** Enclosing-structure brackets for one function body. */
function bracketsFor(module, f, lineOfPc) {
  const code = module.funcs[f].body.code
  const out = []
  const open = []
  for (let pc = 0; pc < code.length; pc++) {
    const ins = code[pc]
    if (ins.op === 'block' || ins.op === 'loop' || ins.op === 'if') {
      const b = { f, kind: ins.op, startPc: pc, endPc: ins.blk.end, elsePc: ins.blk.else, lane: open.length }
      open.push(b)
      out.push(b)
    } else if (ins.op === 'end' && open.length && open[open.length - 1].endPc === pc) open.pop()
  }
  for (const b of out) {
    b.line0 = lineOfPc(b.startPc)
    b.line1 = lineOfPc(b.endPc, true)
    b.lineElse = b.elsePc >= 0 ? lineOfPc(b.elsePc) : -1
  }
  return out
}

/** Label names ($name) from WAT source headers like `block $exit (result i32)`. */
function labelNameAt(text, range) {
  if (!range) return null
  const snippet = text.slice(range.keyword ? range.keyword.end : range.start, Math.min(range.end, (range.keyword ? range.keyword.end : range.start) + 80))
  const m = snippet.match(/^\s*(\$[^\s()]+)/)
  return m ? m[1] : null
}

export function watModel(prog) {
  const text = prog.wat
  const lines = text.split('\n').map((t) => ({ text: t }))
  const sm = prog.sourceMap
  const module = prog.module
  const lineStart = [0]
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) lineStart.push(i + 1)
  const locate = (f, pc) => {
    const r = sm && sm.funcs[f] && sm.funcs[f][pc]
    if (!r) return null
    const k = r.keyword || r
    return {
      line: k.line - 1,
      col0: k.col - 1,
      col1: k.line === k.endLine ? k.endCol - 1 : lines[k.line - 1].text.length,
      rangeLine0: r.line - 1,
      rangeLine1: r.endLine - 1,
    }
  }
  // line -> first instruction whose keyword starts on it (for breakpoints / clicks)
  const target = new Map()
  const brackets = []
  const funcs = new Set()
  const labelNames = new Map()
  if (sm && module) {
    sm.funcs.forEach((list, f) => {
      if (!list) return
      funcs.add(f)
      list.forEach((r, pc) => {
        const k = r.keyword || r
        const ln = k.line - 1
        const cur = target.get(ln)
        // prefer the instruction executed first on the line
        if (!cur || (cur.f === f && pc < cur.pc)) target.set(ln, { f, pc })
      })
      const b = bracketsFor(module, f, (pc, isEnd) => {
        const r = list[pc]
        if (!r) return 0
        return isEnd ? r.endLine - 1 : (r.keyword || r).line - 1
      })
      for (const x of b) x.name = labelNameAt(text, list[x.startPc])
      brackets.push(...b)
      labelNames.set(f, new Map(b.map((x) => [x.startPc, x.name])))
    })
  }
  const lanes = brackets.reduce((m, b) => Math.max(m, b.lane + 1), 0)
  return { kind: 'wat', lines, locate, lineTarget: (ln) => target.get(ln) || null, brackets, lanes, funcs, labelNames, lineStart }
}

export function disasmModel(module, f) {
  const raw = disassembleFunction(module, f)
  // deep nesting (compiled code) would push the text off screen: indent 2 per level up to 6, then 1
  const ind = (d) => (d <= 6 ? 2 * d : 12 + (d - 6))
  const lines = raw.map((l) => ({ text: ' '.repeat(ind(l.depth)) + l.text, depth: l.depth, pc: l.pc, kind: l.kind, offset: l.offset }))
  const pcLine = new Map()
  raw.forEach((l, i) => {
    if (l.pc != null && !pcLine.has(l.pc)) pcLine.set(l.pc, i)
  })
  // the final `)` line repeats the last pc; keep the instr line
  const locate = (fi, pc) => {
    if (fi !== f) return null
    const i = pcLine.get(pc)
    if (i == null) return null
    const col0 = ind(raw[i].depth)
    const t = raw[i].text
    const sp = t.indexOf(' ')
    const end = col0 + (sp < 0 ? t.length : sp)
    return { line: i, col0, col1: end, rangeLine0: i, rangeLine1: i }
  }
  const brackets = module.funcs[f].body ? bracketsFor(module, f, (pc) => pcLine.get(pc) ?? 0) : []
  const lanes = brackets.reduce((m, b) => Math.max(m, b.lane + 1), 0)
  return {
    kind: 'disasm', func: f, lines, locate,
    lineTarget: (ln) => (raw[ln] && raw[ln].pc != null && raw[ln].kind === 'instr' ? { f, pc: raw[ln].pc } : null),
    brackets, lanes, funcs: new Set([f]), labelNames: new Map(),
  }
}

/** Static nesting of a function: for each pc, the list of enclosing bracket starts (innermost last). */
export function enclosing(module, f, pc) {
  const code = module.funcs[f].body.code
  const out = []
  for (let i = 0; i < pc; i++) {
    const ins = code[i]
    if ((ins.op === 'block' || ins.op === 'loop' || ins.op === 'if') && ins.blk.end >= pc) out.push(i)
  }
  return out
}
