// A tiny element builder: h('div', {class: 'x', onclick}, child, 'text', ...).
// Attributes starting with "on" become listeners; null/false children are skipped.

export function h (tag, attrs, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null) continue
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v)
    else if (k === 'class') el.className = v
    else if (k === 'dataset') Object.assign(el.dataset, v)
    // properties: booleans/numbers (hidden, checked, spellcheck, rows) and
    // `value` (a textarea's content is not its value attribute)
    else if (k in el && (typeof v !== 'string' || k === 'value')) el[k] = v
    else if (v !== false) el.setAttribute(k, v === true ? '' : String(v))
  }
  append(el, children)
  return el
}

export function append (el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue
    el.append(c instanceof Node ? c : String(c))
  }
  return el
}

export function clear (el) {
  while (el.firstChild) el.firstChild.remove()
  return el
}

export const $ = (sel, root = document) => root.querySelector(sel)
