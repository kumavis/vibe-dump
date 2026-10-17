// Small DOM, canvas, SVG and formatting helpers shared by the panels.

export const $ = (s, r = document) => r.querySelector(s)
export const $$ = (s, r = document) => [...r.querySelectorAll(s)]

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Build an element: el('div', { class: 'x', onclick: f }, child, 'text', …)
export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue
    if (k.startsWith('on')) n.addEventListener(k.slice(2), v)
    else if (k === 'html') n.innerHTML = v
    else if (k === 'text') n.textContent = v
    else n.setAttribute(k, v === true ? '' : v)
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue
    n.append(kid instanceof Node ? kid : document.createTextNode(String(kid)))
  }
  return n
}

const SVGNS = 'http://www.w3.org/2000/svg'
export function svg(tag, attrs = {}, ...kids) {
  const n = document.createElementNS(SVGNS, tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue
    if (k.startsWith('on')) n.addEventListener(k.slice(2), v)
    else if (k === 'text') n.textContent = v
    else n.setAttribute(k, v)
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue
    n.append(kid instanceof Node ? kid : document.createTextNode(String(kid)))
  }
  return n
}

// Thousands separators; a true minus sign for negatives.
export function fmt(x) {
  if (!Number.isFinite(x)) return String(x)
  const s = Math.round(x).toLocaleString('en-US')
  return s.replace('-', '−')
}
export function signed(x) {
  return x < 0 ? `−${Math.abs(x)}` : String(x)
}
// Decimal with a true minus sign.
export function dec(x, digits) {
  const s = x.toFixed(digits)
  return s.startsWith('-') ? `−${s.slice(1)}` : s
}

// Theme colours, read from the CSS custom properties so canvases follow the
// same tokens as everything else.
export function color(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}

const themeListeners = new Set()
export function onTheme(cb) {
  themeListeners.add(cb)
  return () => themeListeners.delete(cb)
}
{
  const fire = () => themeListeners.forEach((cb) => cb())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fire)
  new MutationObserver(fire).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

// Size a canvas to its CSS box at device resolution; returns the context with
// CSS-pixel coordinates.
export function fitCanvas(cv, cssW, cssH) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
  const w = cssW ?? cv.clientWidth
  const h = cssH ?? cv.clientHeight
  cv.width = Math.max(1, Math.round(w * dpr))
  cv.height = Math.max(1, Math.round(h * dpr))
  const ctx = cv.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w, h, dpr }
}

// Re-run `draw` whenever an element changes size (debounced to a frame).
export function onResize(node, draw) {
  let raf = 0
  let last = ''
  const ro = new ResizeObserver(() => {
    const key = `${node.clientWidth}x${node.clientHeight}`
    if (key === last) return
    last = key
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(draw)
  })
  ro.observe(node)
  return ro
}

// Re-run `draw` when an element's width changes (charts set their own height).
export function onWidth(node, draw) {
  let raf = 0
  let last = -1
  const ro = new ResizeObserver(() => {
    const w = node.clientWidth
    if (w === last) return
    last = w
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(draw)
  })
  ro.observe(node)
  return ro
}

// Seeded random numbers, so every visitor sees the same opening examples.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}
export const randInt = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1))

// A tooltip that lives inside a positioned chart container.
export function tooltip(container) {
  const tip = el('div', { class: 'tip', role: 'status' })
  container.append(tip)
  return {
    show(x, y, nodes) {
      tip.replaceChildren(...nodes)
      tip.style.left = `${x}px`
      tip.style.top = `${y}px`
      tip.classList.add('show')
      // keep inside the container horizontally
      const cw = container.clientWidth
      const tw = tip.offsetWidth
      const left = Math.max(tw / 2 + 2, Math.min(cw - tw / 2 - 2, x))
      tip.style.left = `${left}px`
    },
    hide() {
      tip.classList.remove('show')
    },
  }
}

// Math as DOM: italic variable, optionally with a subscript or superscript.
export function v(name, sub, sup) {
  const n = el('var', {}, name)
  const out = [n]
  if (sub != null) out.push(el('sub', {}, sub))
  if (sup != null) out.push(el('sup', {}, sup))
  return out.length === 1 ? n : el('span', { class: 'm' }, ...out)
}
export function m(...kids) {
  return el('span', { class: 'm' }, ...kids)
}

// Powers of ten written out for counts too large to print digit by digit.
export function pow10Html(log10) {
  const whole = Math.floor(log10)
  const mant = 10 ** (log10 - whole)
  if (log10 < 6) return fmt(10 ** log10)
  return `${mant.toFixed(1)} × 10<sup>${fmt(whole)}</sup>`
}
