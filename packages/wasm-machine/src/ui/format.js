// Value and byte formatting shared by every pane.
import { formatValue, valueHex, NaNBox } from '../engine/index.js'
import { prefs } from './prefs.js'

/** CSS class for a value type: one of the four numeric types or a ref. */
export function typeClass(t) {
  if (t === 'i32' || t === 'i64' || t === 'f32' || t === 'f64') return 't-' + t
  return 't-ref'
}

export const shortType = (t) => (t === 'funcref' ? 'func' : t === 'externref' ? 'extern' : t)

/** Value text in the current base (dec/hex). Floats stay decimal in dec mode. */
export function fmt(type, value, hex = prefs.hex) {
  if (value == null && (type === 'funcref' || type === 'externref')) return formatValue(type, value)
  if (hex && (type === 'i32' || type === 'i64' || type === 'f32' || type === 'f64')) return valueHex(type, value)
  return formatValue(type, value)
}

/** The other readings of a value, for hover titles. */
export function readings(type, value) {
  const out = []
  if (type === 'i32') {
    out.push(`signed ${value | 0}`, `unsigned ${value >>> 0}`, `hex ${valueHex(type, value)}`)
  } else if (type === 'i64') {
    out.push(`signed ${BigInt.asIntN(64, value)}`, `unsigned ${BigInt.asUintN(64, value)}`, `hex ${valueHex(type, value)}`)
  } else if (type === 'f32' || type === 'f64') {
    out.push(`${formatValue(type, value)}`, `bits ${valueHex(type, value)}`)
  } else out.push(formatValue(type, value))
  return `${type}: ` + out.join(' · ')
}

export const hex2 = (b) => (b < 16 ? '0' : '') + b.toString(16)
export const hexN = (v, n) => (v >>> 0).toString(16).padStart(n, '0')
export const addrHex = (a) => '0x' + hexN(a, a > 0xffffff ? 8 : 6)

export function isNaNBox(v) {
  return v instanceof NaNBox
}

/** Compact value list "[2 3]" with type classes, as an element-ready HTML string. */
export function valuesHTML(list) {
  if (!list.length) return '<span class="dim">[]</span>'
  return '[' + list.map((v) => `<span class="tv ${typeClass(v.type)}">${escape(fmt(v.type, v.value))}</span>`).join(' ') + ']'
}

function escape(t) {
  return String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
}

/** HTML for a type signature [a b] → [c] with coloured type names. */
export function sigHTML(params, results) {
  const list = (ts) => ts.map((t) => (t === '…' ? '<span class="dim">…</span>' : `<span class="ty ${typeClass(t)}">${shortType(t)}</span>`)).join(' ')
  return `<span class="sig">[${list(params)}] <span class="arrow">→</span> [${list(results)}]</span>`
}

/** Bytes as text: printable ASCII or a middle dot. */
export const asciiChar = (b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '·')

export function fmtBytes(n) {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KiB'
  return (n / 1048576).toFixed(1) + ' MiB'
}
