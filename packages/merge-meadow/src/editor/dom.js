// Tiny DOM helper: h('div', { class, onclick, dataset, …props }, ...children).
// Properties that are DOM properties are assigned, the rest become attributes.
const PROPS = new Set(['value', 'checked', 'disabled', 'textContent', 'title', 'type', 'placeholder', 'readOnly', 'min', 'max',
  'step', 'selected', 'hidden', 'spellcheck', 'rows', 'tabIndex', 'htmlFor', 'open', 'href', 'download', 'accept', 'name'])

export function h (tag, props = null, ...kids) {
  const el = document.createElement(tag)
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue
      if (k === 'class') el.className = v
      else if (k === 'dataset') for (const [d, x] of Object.entries(v)) el.dataset[d] = String(x)
      else if (k === 'style' && typeof v === 'object') for (const [s, x] of Object.entries(v)) el.style.setProperty(s, String(x))
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v)
      else if (PROPS.has(k)) el[k] = v
      else el.setAttribute(k, v === true ? '' : String(v))
    }
  }
  append(el, kids)
  return el
}

export function append (el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue
    el.append(typeof k === 'object' ? k : document.createTextNode(String(k)))
  }
  return el
}

// does this element (or a descendant) have focus? Panels skip re-renders while
// the user is typing in them, and catch up on blur.
// Only typing counts: a select, checkbox or button that keeps focus after a
// click must not hold back the re-render its own edit asked for.
const TYPING = new Set(['text', 'search', 'number', 'email', 'url', ''])
export const hasFocusWithin = (el) => {
  if (!el || typeof document === 'undefined') return false
  const a = document.activeElement
  if (!a || a === document.body || !el.contains(a)) return false
  return a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && TYPING.has(String(a.type).toLowerCase())) || !!a.isContentEditable
}

export const peerColor = (id) => {
  let x = 2166136261
  for (const c of String(id)) x = Math.imul(x ^ c.charCodeAt(0), 16777619)
  return `hsl(${(x >>> 0) % 360} 70% 62%)`
}
