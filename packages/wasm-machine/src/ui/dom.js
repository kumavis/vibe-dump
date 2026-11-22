// Tiny DOM helpers and the inline SVG icon set. No framework: panes build
// their DOM once and patch it on update.

const SVG_NS = 'http://www.w3.org/2000/svg'

function applyAttrs(el, attrs) {
  if (!attrs) return
  for (const k in attrs) {
    const v = attrs[k]
    if (v == null || v === false) continue
    if (k === 'class') el.setAttribute('class', v)
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v)
    else if (k === 'dataset') Object.assign(el.dataset, v)
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v)
    else if (k === 'text') el.textContent = v
    else if (k === 'html') el.innerHTML = v
    else if (v === true) el.setAttribute(k, '')
    else el.setAttribute(k, v)
  }
}

function append(el, children) {
  for (const c of children) {
    if (c == null || c === false) continue
    if (Array.isArray(c)) append(el, c)
    else if (c instanceof Node) el.appendChild(c)
    else el.appendChild(document.createTextNode(String(c)))
  }
}

/** h('div', { class: 'x', onclick }, child, 'text', [more]) */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag)
  applyAttrs(el, attrs)
  append(el, children)
  return el
}

/** SVG element factory with the same signature as h(). */
export function s(tag, attrs, ...children) {
  const el = document.createElementNS(SVG_NS, tag)
  if (attrs) for (const k in attrs) {
    const v = attrs[k]
    if (v == null || v === false) continue
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v)
  }
  append(el, children)
  return el
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild)
  return el
}

export const $ = (sel, root = document) => root.querySelector(sel)

// Icons: 16×16 viewBox, stroked with currentColor.
const P = {
  play: '<path d="M5 3.5v9l7.5-4.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="4" y="3.5" width="2.6" height="9" rx=".6" fill="currentColor" stroke="none"/><rect x="9.4" y="3.5" width="2.6" height="9" rx=".6" fill="currentColor" stroke="none"/>',
  step: '<path d="M4 3.5v9l6-4.5z" fill="currentColor" stroke="none"/><path d="M12 3.5v9"/>',
  back: '<path d="M12 3.5v9L6 8z" fill="currentColor" stroke="none"/><path d="M4 3.5v9"/>',
  over: '<path d="M2.5 10.5C3 5.5 9.5 4 12.5 8.5"/><path d="M13 5v4h-4"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
  out: '<path d="M8 13V4"/><path d="M4.5 7.5 8 4l3.5 3.5"/><path d="M3 2.5h10"/>',
  restart: '<path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3"/><path d="M4.5 2v3h3"/>',
  sun: '<circle cx="8" cy="8" r="2.8"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/>',
  moon: '<path d="M13 9.6A5.5 5.5 0 0 1 6.4 3a5.5 5.5 0 1 0 6.6 6.6z"/>',
  keyboard: '<rect x="1.5" y="4" width="13" height="8" rx="1.5"/><path d="M4 6.5h.01M6.5 6.5h.01M9 6.5h.01M11.5 6.5h.01M4.5 9.5h7"/>',
  motion: '<path d="M2 8h3M3 5h4M3 11h4"/><circle cx="11" cy="8" r="3"/>',
  upload: '<path d="M8 10.5V2.5M4.5 6 8 2.5 11.5 6"/><path d="M2.5 10.5v2.5h11v-2.5"/>',
  edit: '<path d="M10.5 2.5l3 3L6 13H3v-3z"/><path d="M9 4l3 3"/>',
  close: '<path d="M4 4l8 8M12 4l-8 8"/>',
  chevron: '<path d="M6 3.5 10.5 8 6 12.5"/>',
  chevronDown: '<path d="M3.5 6 8 10.5 12.5 6"/>',
  search: '<circle cx="7" cy="7" r="4.2"/><path d="M10.2 10.2 13.5 13.5"/>',
  file: '<path d="M4 1.5h5l3 3v10H4z"/><path d="M9 1.5v3h3"/>',
  bytes: '<rect x="2" y="3" width="5" height="4" rx="1"/><rect x="9" y="3" width="5" height="4" rx="1"/><rect x="2" y="9" width="5" height="4" rx="1"/><rect x="9" y="9" width="5" height="4" rx="1"/>',
  machine: '<rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M5 5.5h3M5 8h6M5 10.5h4"/>',
  check: '<path d="M3 8.5 6.5 12 13 4.5"/>',
  warn: '<path d="M8 2 14.5 13.5h-13z"/><path d="M8 6.5v3.2M8 11.6h.01"/>',
  info: '<circle cx="8" cy="8" r="6"/><path d="M8 7.2v4M8 4.9h.01"/>',
  prev: '<path d="M10 3.5 5.5 8 10 12.5"/>',
  next: '<path d="M6 3.5 10.5 8 6 12.5"/>',
  play2: '<path d="M5 3.5v9l7.5-4.5z"/>',
  target: '<circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2"/>',
  lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
  list: '<path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01"/>',
  book: '<path d="M2.5 3h4a1.5 1.5 0 0 1 1.5 1.5V13a1.2 1.2 0 0 0-1.2-1.2H2.5z"/><path d="M13.5 3h-4A1.5 1.5 0 0 0 8 4.5V13a1.2 1.2 0 0 1 1.2-1.2h4.3z"/>',
  bug: '<rect x="5" y="5" width="6" height="8" rx="3"/><path d="M6 3.5 7 5M10 3.5 9 5M2.5 8.5H5M11 8.5h2.5M3 12l2-1M13 12l-2-1M3 5.5 5 6.5M13 5.5l-2 1"/>',
}

export function icon(name, size = 16, cls = '') {
  const el = document.createElementNS(SVG_NS, 'svg')
  el.setAttribute('viewBox', '0 0 16 16')
  el.setAttribute('width', size)
  el.setAttribute('height', size)
  el.setAttribute('fill', 'none')
  el.setAttribute('stroke', 'currentColor')
  el.setAttribute('stroke-width', '1.5')
  el.setAttribute('stroke-linecap', 'round')
  el.setAttribute('stroke-linejoin', 'round')
  el.setAttribute('aria-hidden', 'true')
  el.setAttribute('focusable', 'false')
  el.setAttribute('class', 'icon ' + cls)
  el.innerHTML = P[name] || ''
  return el
}

/** An icon button with an accessible label and tooltip. */
export function iconButton(name, label, onclick, extra = {}) {
  const b = h('button', { type: 'button', class: 'ibtn ' + (extra.class || ''), 'aria-label': label, title: extra.title || label, onclick, ...(extra.attrs || {}) }, icon(name, extra.size || 16))
  if (extra.text) b.appendChild(h('span', { class: 'ibtn-text' }, extra.text))
  return b
}

/** Escape text for innerHTML. */
export function esc(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

/** Debounce to the next animation frame. */
export function rafThrottle(fn) {
  let queued = false
  return (...a) => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      fn(...a)
    })
  }
}
