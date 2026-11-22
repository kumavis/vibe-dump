// Typed argument entry for invoking an exported function.
import { h } from './dom.js'
import { typeClass, shortType } from './format.js'

/** Parse one argument; returns { value } or { error }. */
export function parseArg(type, text) {
  const t = text.trim().replace(/_/g, '')
  if (!t) return { error: 'required' }
  if (type === 'i32') {
    if (!/^[+-]?(0x[0-9a-f]+|\d+)$/i.test(t)) return { error: 'an integer' }
    const neg = t.startsWith('-')
    const mag = Number(BigInt(t.replace(/^[+-]/, '')))
    const v = neg ? -mag : mag
    if (v < -2147483648 || v > 4294967295) return { error: 'out of i32 range' }
    return { value: v | 0 }
  }
  if (type === 'i64') {
    if (!/^[+-]?(0x[0-9a-f]+|\d+)$/i.test(t)) return { error: 'an integer' }
    const neg = t.startsWith('-')
    let v = BigInt(t.replace(/^[+-]/, ''))
    if (neg) v = -v
    if (v < -(1n << 63n) || v >= 1n << 64n) return { error: 'out of i64 range' }
    return { value: BigInt.asIntN(64, v) }
  }
  if (type === 'f32' || type === 'f64') {
    const low = t.toLowerCase()
    if (low === 'nan') return { value: NaN }
    if (/^[+]?inf(inity)?$/.test(low)) return { value: Infinity }
    if (/^-inf(inity)?$/.test(low)) return { value: -Infinity }
    const v = Number(t)
    if (Number.isNaN(v)) return { error: 'a number' }
    return { value: type === 'f32' ? Math.fround(v) : v }
  }
  return { error: `${type} arguments can't be entered here` }
}

export function formatArg(type, v) {
  return typeof v === 'bigint' ? v.toString() : String(v)
}

/**
 * Inputs for a parameter list. Returns { el, read() -> {args}|{error}, focus() }.
 * `names` are optional parameter names; `values` initial values.
 */
export function argInputs(params, { names = [], values = [], onEnter } = {}) {
  const inputs = params.map((t, i) => {
    const inp = h('input', { type: 'text', class: `arg mono ${typeClass(t)}`, value: values[i] != null ? formatArg(t, values[i]) : '0', 'aria-label': `${names[i] ? '$' + names[i] + ' ' : 'argument ' + i + ' '}(${t})`, spellcheck: 'false', size: 6 })
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation()
      if (e.key === 'Enter' && onEnter) onEnter()
    })
    inp.addEventListener('input', () => inp.classList.remove('bad'))
    return inp
  })
  const el = h('span', { class: 'args' }, inputs.map((inp, i) => h('label', { class: 'arg-l' }, h('span', { class: `ty ${typeClass(params[i])}` }, names[i] ? '$' + names[i] : shortType(params[i])), inp)))
  return {
    el,
    inputs,
    read() {
      const args = []
      for (let i = 0; i < params.length; i++) {
        const r = parseArg(params[i], inputs[i].value)
        if (r.error) {
          inputs[i].classList.add('bad')
          inputs[i].focus()
          return { error: `argument ${i + 1} (${params[i]}): expected ${r.error}` }
        }
        args.push(r.value)
      }
      return { args }
    },
  }
}
