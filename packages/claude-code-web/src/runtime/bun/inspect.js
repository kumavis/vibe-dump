// Bun.inspect(value, { depth = 2, sorted = false }): a compact formatter in
// the style of console.log / util.inspect. Top-level strings print as-is;
// nested ones are quoted. Honours the nodejs.util.inspect.custom hook.
// installBun prefers deps.util.inspect when integration passes one.

const CUSTOM = Symbol.for('nodejs.util.inspect.custom')
const IDENT = /^[A-Za-z_$][\w$]*$/
const MAX_ITEMS = 100
const BREAK = 72

const quote = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
const keyText = (k) => (typeof k === 'symbol' ? `[${k.toString()}]` : IDENT.test(k) ? k : quote(k))

function ctorName(v) {
  const proto = Object.getPrototypeOf(v)
  if (proto === null) return null
  return proto.constructor?.name ?? ''
}

function wrap(prefix, open, items, close, indent) {
  if (!items.length) return `${prefix}${open}${close}`
  const flat = `${prefix}${open} ${items.join(', ')} ${close}`
  if (flat.length <= BREAK && !flat.includes('\n')) return flat
  const pad = '  '.repeat(indent + 1)
  return `${prefix}${open}\n${pad}${items.join(`,\n${pad}`)}\n${'  '.repeat(indent)}${close}`
}

export function inspect(value, options = {}) {
  const opts = { depth: options.depth === null ? Infinity : options.depth ?? 2, sorted: !!options.sorted }
  const seen = []

  function fmt(v, level, nested) {
    switch (typeof v) {
      case 'string': return nested ? quote(v) : v
      case 'number': return Object.is(v, -0) ? '-0' : String(v)
      case 'bigint': return `${v}n`
      case 'symbol': return v.toString()
      case 'undefined': return 'undefined'
      case 'boolean': return String(v)
      case 'function': {
        const isClass = /^class[\s{]/.test(Function.prototype.toString.call(v))
        return isClass ? `[class ${v.name || '(anonymous)'}]` : `[Function: ${v.name || '(anonymous)'}]`
      }
    }
    if (v === null) return 'null'
    if (typeof v[CUSTOM] === 'function') {
      const r = v[CUSTOM](opts.depth - level, opts, inspect)
      return typeof r === 'string' ? r : fmt(r, level, nested)
    }
    if (seen.includes(v)) return '[Circular]'
    if (v instanceof Date) return Number.isNaN(v.getTime()) ? 'Invalid Date' : v.toISOString()
    if (v instanceof RegExp) return String(v)
    if (v instanceof Error) return v.stack || `${v.name}: ${v.message}`
    if (v instanceof Promise) return 'Promise { <unknown> }'
    if (v instanceof WeakMap || v instanceof WeakSet) return `${ctorName(v)} { <items unknown> }`
    if (v instanceof ArrayBuffer) return `ArrayBuffer { byteLength: ${v.byteLength} }`

    const name = ctorName(v)
    if (level > opts.depth) return Array.isArray(v) ? '[Array]' : `[${name || 'Object'}]`

    seen.push(v)
    try {
      const items = []
      const more = (n) => { if (n > 0) items.push(`... ${n} more item${n > 1 ? 's' : ''}`) }
      if (Array.isArray(v) || ArrayBuffer.isView(v)) {
        const n = Math.min(v.length ?? 0, MAX_ITEMS)
        for (let i = 0; i < n; i++) items.push(fmt(v[i], level + 1, true))
        more((v.length ?? 0) - n)
        const prefix = Array.isArray(v) ? (name === 'Array' ? '' : `${name}(${v.length}) `) : `${name}(${v.length}) `
        return wrap(prefix, '[', items, ']', level)
      }
      if (v instanceof Map) {
        for (const [k, val] of v) items.push(`${fmt(k, level + 1, true)} => ${fmt(val, level + 1, true)}`)
        return wrap(`Map(${v.size}) `, '{', items, '}', level)
      }
      if (v instanceof Set) {
        for (const val of v) items.push(fmt(val, level + 1, true))
        return wrap(`Set(${v.size}) `, '{', items, '}', level)
      }
      const keys = [...Object.keys(v), ...Object.getOwnPropertySymbols(v).filter((s) => Object.prototype.propertyIsEnumerable.call(v, s))]
      if (opts.sorted) keys.sort((a, b) => String(a).localeCompare(String(b)))
      for (const k of keys) items.push(`${keyText(k)}: ${fmt(v[k], level + 1, true)}`)
      const prefix = name === null ? '[Object: null prototype] ' : name && name !== 'Object' ? `${name} ` : ''
      return wrap(prefix, '{', items, '}', level)
    } finally {
      seen.pop()
    }
  }

  return fmt(value, 0, false)
}

inspect.custom = CUSTOM
