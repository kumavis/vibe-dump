// Module -> readable WAT-ish listing, as structured lines a UI can render and
// highlight:  { kind, depth, text, pc, offset, len, funcIndex }
//   kind: 'module' | 'type' | 'import' | 'func' | 'local' | 'instr' | 'end'
//         | 'table' | 'memory' | 'global' | 'export' | 'start' | 'elem' | 'data'
//   pc:   instruction index within the function body (null for non-instructions)
//   offset/len: byte range in the file (null when not applicable)
// Names come from the name section, then exports, else plain indices.

import { formatValue } from './values.js'

const IDCH = /[^0-9A-Za-z!#$%&'*+\-./:<=>?@\\^_`|~]/g
const sanitize = (s) => s.replace(IDCH, '_') || '_'

/** idx -> raw name  =>  idx -> unique, valid "$id" */
function uniqueIds(entries) {
  const out = new Map()
  const used = new Set()
  for (const [i, raw] of entries) {
    let id = '$' + sanitize(raw)
    if (used.has(id)) id = `${id}_${i}`
    while (used.has(id)) id += '_'
    used.add(id)
    out.set(i, id)
  }
  return out
}

function sigText(t, ids) {
  let s = ''
  t.params.forEach((p, i) => {
    const n = ids && ids.get(i)
    s += n != null ? ` (param ${n} ${p})` : ` (param ${p})`
  })
  if (t.results.length) s += ` (result ${t.results.join(' ')})`
  return s
}

/** A WAT string literal for a name (escapes quotes, backslashes, control characters). */
function q(name) {
  let out = '"'
  for (const b of new TextEncoder().encode(name)) {
    if (b === 0x22 || b === 0x5c || b < 0x20 || b === 0x7f) out += '\\' + b.toString(16).padStart(2, '0')
    else out += String.fromCharCode(b)
  }
  return new TextDecoder().decode(Uint8Array.from(out, (c) => c.charCodeAt(0))) + '"'
}

function strLit(bytes, max = 64) {
  let s = ''
  const n = Math.min(bytes.length, max)
  for (let i = 0; i < n; i++) {
    const b = bytes[i]
    if (b >= 0x20 && b < 0x7f && b !== 0x22 && b !== 0x5c) s += String.fromCharCode(b)
    else s += '\\' + b.toString(16).padStart(2, '0')
  }
  return '"' + s + '"' + (bytes.length > max ? ` (; … truncated, ${bytes.length} bytes in total ;)` : '')
}

/**
 * Identifier scheme shared by every line: name section first, then export
 * names (functions), then "module.field" for imported functions; sanitized to
 * valid WAT ids and made unique so the listing re-assembles.
 */
function namer(module) {
  if (module._namer) return module._namer
  const N = module.names
  const fentries = []
  for (const f of module.funcs) {
    const raw = N.funcs.get(f.index) ?? module.exports.find((e) => e.kind === 'func' && e.index === f.index)?.name ?? (f.import ? `${f.import.module}.${f.import.name}` : null)
    if (raw != null) fentries.push([f.index, raw])
  }
  const fids = uniqueIds(fentries)
  const maps = {}
  for (const k of ['globals', 'tables', 'memories', 'types', 'elems', 'datas']) maps[k] = uniqueIds([...N[k].entries()])
  const localCache = new Map()
  const localIds = (f) => {
    if (!localCache.has(f)) localCache.set(f, uniqueIds([...(N.locals.get(f) || new Map()).entries()]))
    return localCache.get(f)
  }
  const pick = (map) => (i) => map.get(i) ?? String(i)
  const decl = (map) => (i) => (map.has(i) ? ' ' + map.get(i) : '')
  const nm = {
    func: pick(fids),
    funcDecl: decl(fids),
    localIds,
    local: (f, i) => localIds(f).get(i) ?? String(i),
    global: pick(maps.globals),
    globalDecl: decl(maps.globals),
    table: pick(maps.tables),
    tableDecl: decl(maps.tables),
    memoryDecl: decl(maps.memories),
    type: pick(maps.types),
    typeDecl: decl(maps.types),
    elem: pick(maps.elems),
    elemDecl: decl(maps.elems),
    data: pick(maps.datas),
    dataDecl: decl(maps.datas),
  }
  Object.defineProperty(module, '_namer', { value: nm, enumerable: false })
  return nm
}

/** Text of one instruction, with names resolved. `labels` = stack of label numbers. */
function instrLine(module, nm, funcIndex, ins, labels) {
  const op = ins.op
  const lbl = (d) => {
    const id = labels[labels.length - 1 - d]
    return id == null ? String(d) : `${d} (;@${id};)`
  }
  const bt = () => {
    const b = ins.bt
    if (!b || b.raw === 'empty') return ''
    if (typeof b.raw === 'string') return ` (result ${b.raw})`
    const t = module.types[b.raw]
    return ` (type ${nm.type(b.raw)})` + (t ? sigText(t) : '')
  }
  switch (ins.code) {
    case 0x02: case 0x03: case 0x04:
      return `${op}${bt()}`
    case 0x0c: case 0x0d:
      return `${op} ${lbl(ins.depth)}`
    case 0x0e:
      return `${op} ${ins.targets.map(lbl).join(' ')} ${lbl(ins.deflt)}`
    case 0x10: case 0xd2:
      return `${op} ${nm.func(ins.func)}`
    case 0x11:
      return `${op}${ins.table ? ' ' + nm.table(ins.table) : ''} (type ${nm.type(ins.type)})`
    case 0x1c:
      return `select (result ${ins.types.join(' ')})`
    case 0x20: case 0x21: case 0x22:
      return `${op} ${nm.local(funcIndex, ins.local)}`
    case 0x23: case 0x24:
      return `${op} ${nm.global(ins.global)}`
    case 0x41: case 0x42: case 0x43: case 0x44:
      return `${op} ${formatValue(op.slice(0, 3), ins.value)}`
    case 0xd0:
      return `${op} ${ins.refType === 'funcref' ? 'func' : 'extern'}`
    case 0xe8:
      return `${op} ${nm.data(ins.data)}`
    case 0xe9:
      return `${op} ${nm.data(ins.data)}`
    case 0xec:
      return `${op}${ins.table ? ' ' + nm.table(ins.table) : ''} ${nm.elem(ins.elem)}`
    case 0xed:
      return `${op} ${nm.elem(ins.elem)}`
    case 0xee:
      return ins.table || ins.table2 ? `${op} ${nm.table(ins.table)} ${nm.table(ins.table2)}` : op
    case 0x25: case 0x26: case 0xef: case 0xf0: case 0xf1:
      return ins.table ? `${op} ${nm.table(ins.table)}` : op
  }
  if (ins.memOffset !== undefined) {
    let s = op
    if (ins.memOffset) s += ` offset=${ins.memOffset}`
    const natural = /8(_[su])?$/.test(op) ? 0 : /16(_[su])?$/.test(op) ? 1 : /32(_[su])?$/.test(op) ? 2 : op.startsWith('i64') || op.startsWith('f64') ? 3 : 2
    if (ins.align !== natural) s += ` align=${2 ** ins.align}`
    return s
  }
  return op
}

/**
 * Listing of one function. Returns an array of lines:
 *   header line (kind 'func'), local lines, one line per instruction (kind
 *   'instr', with pc/offset/len), and the closing ')' for the final `end`
 *   (kind 'end', carrying that instruction's pc). Imported functions give a
 *   single 'import' line.
 */
export function disassembleFunction(module, funcIndex) {
  const f = module.funcs[funcIndex]
  const nm = namer(module)
  const lines = []
  const lids = nm.localIds(funcIndex)
  if (f.import) {
    lines.push({ kind: 'import', depth: 0, text: `(import ${q(f.import.module)} ${q(f.import.name)} (func${nm.funcDecl(funcIndex)} (type ${nm.type(f.typeIndex)})${sigText(f.type, lids)}))`, pc: null, offset: f.import.offset, len: null, funcIndex })
    return lines
  }
  const exp = module.exports.filter((e) => e.kind === 'func' && e.index === funcIndex).map((e) => ` (export ${q(e.name)})`).join('')
  const body = f.body
  lines.push({ kind: 'func', depth: 0, text: `(func${nm.funcDecl(funcIndex)}${exp} (type ${nm.type(f.typeIndex)})${sigText(f.type, lids)}`, pc: null, offset: body.offset, len: body.localsOffset - body.offset, funcIndex })
  let li = f.type.params.length
  for (const g of body.locals) {
    let anyNamed = false
    for (let k = 0; k < g.count; k++) if (lids.has(li + k)) anyNamed = true
    if (anyNamed) {
      for (let k = 0; k < g.count; k++) lines.push({ kind: 'local', depth: 1, text: lids.has(li + k) ? `(local ${lids.get(li + k)} ${g.type})` : `(local ${g.type})`, pc: null, offset: g.offset, len: null, funcIndex })
    } else if (g.count <= 16) {
      lines.push({ kind: 'local', depth: 1, text: `(local${(' ' + g.type).repeat(g.count)})`, pc: null, offset: g.offset, len: null, funcIndex })
    } else {
      // long runs: still valid WAT, just wrapped
      for (let k = 0; k < g.count; k += 16) lines.push({ kind: 'local', depth: 1, text: `(local${(' ' + g.type).repeat(Math.min(16, g.count - k))})`, pc: null, offset: g.offset, len: null, funcIndex })
    }
    li += g.count
  }
  const labels = []
  let next = 0
  let depth = 1
  const code = body.code
  for (let pc = 0; pc < code.length; pc++) {
    const ins = code[pc]
    const c = ins.code
    if (c === 0x0b) {
      if (pc === code.length - 1) {
        lines.push({ kind: 'end', depth: 0, text: ')', pc, offset: ins.offset, len: ins.len, funcIndex })
        break
      }
      depth--
      labels.pop()
      lines.push({ kind: 'instr', depth, text: 'end', pc, offset: ins.offset, len: ins.len, funcIndex })
      continue
    }
    if (c === 0x05) {
      lines.push({ kind: 'instr', depth: depth - 1, text: 'else', pc, offset: ins.offset, len: ins.len, funcIndex })
      continue
    }
    let text = instrLine(module, nm, funcIndex, ins, labels)
    if (c === 0x02 || c === 0x03 || c === 0x04) {
      const id = next++
      text += `  ;; label = @${id}`
      lines.push({ kind: 'instr', depth, text, pc, offset: ins.offset, len: ins.len, funcIndex })
      labels.push(id)
      depth++
      continue
    }
    lines.push({ kind: 'instr', depth, text, pc, offset: ins.offset, len: ins.len, funcIndex })
  }
  return lines
}

const limitsText = (l) => `${l.min}${l.max != null ? ' ' + l.max : ''}`

/**
 * Listing of the whole module (every section), as lines. The text
 * re-assembles to an equivalent module (data longer than opts.maxData bytes,
 * default 64, is truncated with a comment; pass Infinity for full output).
 */
export function disassemble(module, opts = {}) {
  const nm = namer(module)
  const maxData = opts.maxData ?? 64
  const L = []
  const add = (kind, depth, text, extra = {}) => L.push({ kind, depth, text, pc: null, offset: null, len: null, funcIndex: null, ...extra })
  const flat = (expr) => expr.map((i) => instrLine(module, nm, null, i, [])).join(' ')
  add('module', 0, '(module' + (module.names.module ? ' $' + sanitize(module.names.module) : ''))
  module.types.forEach((t, i) => add('type', 1, `(type${nm.typeDecl(i)} (;${i};) (func${sigText(t)}))`, { offset: t.offset }))
  for (const imp of module.imports) {
    if (imp.kind === 'func') {
      for (const line of disassembleFunction(module, imp.index)) L.push({ ...line, depth: 1 })
      continue
    }
    let desc
    if (imp.kind === 'memory') desc = `(memory${nm.memoryDecl(imp.index)} ${limitsText(imp.desc)})`
    else if (imp.kind === 'table') desc = `(table${nm.tableDecl(imp.index)} ${limitsText(imp.desc)} ${imp.desc.elemType})`
    else desc = `(global${nm.globalDecl(imp.index)} ${imp.desc.mut ? `(mut ${imp.desc.type})` : imp.desc.type})`
    add('import', 1, `(import ${q(imp.module)} ${q(imp.name)} ${desc})`, { offset: imp.offset })
  }
  for (const f of module.funcs) {
    if (f.import) continue
    for (const line of disassembleFunction(module, f.index)) L.push({ ...line, depth: line.depth + 1 })
  }
  for (const t of module.tables) if (!t.import) add('table', 1, `(table${nm.tableDecl(t.index)} ${limitsText(t)} ${t.elemType})`, { offset: t.offset })
  for (const m of module.memories) if (!m.import) add('memory', 1, `(memory${nm.memoryDecl(m.index)} ${limitsText(m)})`, { offset: m.offset })
  for (const g of module.globals) {
    if (g.import) continue
    add('global', 1, `(global${nm.globalDecl(g.index)} ${g.mut ? `(mut ${g.type})` : g.type} ${flat(g.init)})`, { offset: g.offset })
  }
  for (const e of module.exports) {
    if (e.kind === 'func' && !module.funcs[e.index].import) continue // shown inline on the func line
    const ref = e.kind === 'func' ? nm.func(e.index) : e.kind === 'global' ? nm.global(e.index) : e.kind === 'table' ? nm.table(e.index) : String(e.index)
    add('export', 1, `(export ${q(e.name)} (${e.kind} ${ref}))`, { offset: e.offset })
  }
  if (module.start != null) add('start', 1, `(start ${nm.func(module.start)})`)
  for (const s of module.elems) {
    const simple = s.elemType === 'funcref' && s.init.every((ex) => ex.length === 1 && ex[0].code === 0xd2)
    const items = simple ? 'func' + s.init.map((ex) => ' ' + nm.func(ex[0].func)).join('') : s.elemType + s.init.map((ex) => ` (item ${flat(ex)})`).join('')
    const head = s.mode === 'active' ? ` (table ${nm.table(s.table)}) (offset ${flat(s.offset)})` : s.mode === 'declarative' ? ' declare' : ''
    add('elem', 1, `(elem${nm.elemDecl(s.index)}${head} ${items})`, { offset: s.fileOffset })
  }
  for (const d of module.datas) {
    const off = d.mode === 'active' ? ` (offset ${flat(d.offset)})` : ''
    add('data', 1, `(data${nm.dataDecl(d.index)}${off} ${strLit(d.bytes, maxData)})`, { offset: d.fileOffset })
  }
  add('module', 0, ')')
  return L
}

/** Render lines to plain text (2 spaces per depth). */
export function linesToText(lines) {
  return lines.map((l) => '  '.repeat(l.depth) + l.text).join('\n')
}
