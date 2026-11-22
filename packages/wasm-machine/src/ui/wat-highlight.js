// Minimal WAT syntax highlighting, line by line (block comments carry state).
import { esc } from './dom.js'

const TYPES = new Set(['i32', 'i64', 'f32', 'f64', 'funcref', 'externref', 'func', 'extern'])
const DECL = new Set(['module', 'func', 'param', 'result', 'local', 'type', 'import', 'export', 'memory', 'data', 'table', 'elem', 'global', 'mut', 'start', 'offset', 'item', 'declare'])
const CONTROL = new Set(['block', 'loop', 'if', 'then', 'else', 'end', 'br', 'br_if', 'br_table', 'return', 'call', 'call_indirect', 'unreachable', 'nop'])

const tyClass = (t) => (t === 'funcref' || t === 'externref' || t === 'func' || t === 'extern' ? 't-ref' : 't-' + t)

/** Highlight one line. `state.inBlock` tracks an open (; ;) comment; returns HTML. */
export function highlightLine(line, state) {
  let out = ''
  let i = 0
  const n = line.length
  while (i < n) {
    if (state.inBlock) {
      const j = line.indexOf(';)', i)
      const stop = j < 0 ? n : j + 2
      out += `<span class="hl-com">${esc(line.slice(i, stop))}</span>`
      if (j >= 0) state.inBlock = false
      i = stop
      continue
    }
    const c = line[i]
    if (c === ';' && line[i + 1] === ';') {
      out += `<span class="hl-com">${esc(line.slice(i))}</span>`
      break
    }
    if (c === '(' && line[i + 1] === ';') {
      state.inBlock = true
      continue
    }
    if (c === '(' || c === ')') {
      out += `<span class="hl-paren">${c}</span>`
      i++
      continue
    }
    if (c === '"') {
      let j = i + 1
      while (j < n && line[j] !== '"') j += line[j] === '\\' ? 2 : 1
      out += `<span class="hl-str">${esc(line.slice(i, j + 1))}</span>`
      i = j + 1
      continue
    }
    if (c === ' ' || c === '\t') {
      let j = i
      while (j < n && (line[j] === ' ' || line[j] === '\t')) j++
      out += line.slice(i, j)
      i = j
      continue
    }
    let j = i
    while (j < n && !' \t()";'.includes(line[j])) j++
    if (j === i) j = i + 1
    const w = line.slice(i, j)
    out += word(w)
    i = j
  }
  return out
}

function word(w) {
  const e = esc(w)
  if (w[0] === '$') return `<span class="hl-id">${e}</span>`
  if (TYPES.has(w)) return `<span class="ty ${tyClass(w)}">${e}</span>`
  if (DECL.has(w)) return `<span class="hl-decl">${e}</span>`
  if (CONTROL.has(w)) return `<span class="hl-ctl">${e}</span>`
  if (/^[+-]?(\d|0x|inf|nan)/.test(w)) return `<span class="hl-num">${e}</span>`
  if (/^(offset|align)=/.test(w)) return `<span class="hl-attr">${e}</span>`
  const dot = w.indexOf('.')
  if (dot > 0) {
    const pre = w.slice(0, dot)
    if (TYPES.has(pre)) return `<span class="hl-op"><span class="ty ${tyClass(pre)}">${esc(pre)}</span>${esc(w.slice(dot))}</span>`
    return `<span class="hl-op">${e}</span>`
  }
  if (/^[a-z_]+$/.test(w)) return `<span class="hl-op">${e}</span>`
  return e
}

/** Highlight a whole text; returns an array of HTML lines. */
export function highlightText(text) {
  const state = { inBlock: false }
  return text.split('\n').map((l) => highlightLine(l, state))
}
