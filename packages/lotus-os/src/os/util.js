// util.js — the small shared vocabulary the rest of the OS is written in.

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const inverseLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a))
export const round = (v, p = 0) => {
  const m = 10 ** p
  return Math.round(v * m) / m
}

// Easings. `smoothstep` for anything that reads as physical, `easeOutCubic`
// for UI that should feel like it snapped, `easeInOutQuint` for the long
// camera flights where the middle wants to be fast and the ends soft.
export const smoothstep = (t) => t * t * (3 - 2 * t)
export const easeOutCubic = (t) => 1 - (1 - t) ** 3
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
export const easeInOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2)
export const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2

let seq = 0
export const uid = (prefix = 'id') => `${prefix}-${(seq++).toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`

/**
 * Terse element builder.
 *   el('div.card', { title: 'x' }, [el('span', 'hi')])
 * Tag syntax: `tag.class.class#id`. Props starting with `on` become listeners,
 * `html` sets innerHTML (used for the inline SVG ornament), `data` sets
 * dataset keys, `style` accepts an object.
 */
export function el(spec, props = null, children = null) {
  if (Array.isArray(props) || typeof props === 'string' || props instanceof Node) {
    children = props
    props = null
  }
  const idMatch = spec.match(/#([\w-]+)/)
  const tag = spec.match(/^[\w-]+/)?.[0] || 'div'
  const classes = spec.replace(/#[\w-]+/, '').split('.').slice(1).filter(Boolean)
  const node = document.createElement(tag)
  if (classes.length) node.className = classes.join(' ')
  if (idMatch) node.id = idMatch[1]

  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue
    if (k === 'html') node.innerHTML = v
    else if (k === 'text') node.textContent = v
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v)
    else if (k === 'data') for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v)
    else if (k === 'class') node.className = [node.className, v].filter(Boolean).join(' ')
    else if (v === true) node.setAttribute(k, '')
    else node.setAttribute(k, v)
  }

  appendAll(node, children)
  return node
}

export function appendAll(node, children) {
  if (children === null || children === undefined) return node
  const list = Array.isArray(children) ? children : [children]
  for (const c of list) {
    if (c === null || c === undefined || c === false) continue
    node.append(c instanceof Node ? c : document.createTextNode(String(c)))
  }
  return node
}

export const clear = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild)
  return node
}

export const qs = (sel, scope = document) => scope.querySelector(sel)
export const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)]

/**
 * Pointer drag helper. Captures the pointer so the gesture survives leaving
 * the element, and hands back deltas in the caller's own coordinate space.
 */
export function drag(target, { onStart, onMove, onEnd, button = 0 } = {}) {
  const down = (ev) => {
    if (ev.button !== button || ev.defaultPrevented) return
    const start = { x: ev.clientX, y: ev.clientY }
    const ctx = onStart?.(ev, start)
    if (ctx === false) return
    ev.preventDefault()
    target.setPointerCapture?.(ev.pointerId)

    const move = (e) => onMove?.(e.clientX - start.x, e.clientY - start.y, e, ctx)
    const up = (e) => {
      target.releasePointerCapture?.(e.pointerId)
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', up)
      target.removeEventListener('pointercancel', up)
      onEnd?.(e.clientX - start.x, e.clientY - start.y, e, ctx)
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', up)
    target.addEventListener('pointercancel', up)
  }
  target.addEventListener('pointerdown', down)
  return () => target.removeEventListener('pointerdown', down)
}

/** Wall-clock formatting for the app bar. No seconds — it is not that kind of OS. */
export function formatClock(d = new Date()) {
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const h12 = h % 12 === 0 ? 12 : h % 12
  return { time: `${h12}:${m}`, suffix: h < 12 ? 'AM' : 'PM', day: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) }
}

export const bytes = (n) => (n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`)

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** requestAnimationFrame loop with a clamped delta, so tab-outs do not lurch. */
export function raf(fn) {
  let last = performance.now()
  let alive = true
  let id = 0
  const tick = (now) => {
    if (!alive) return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    fn(dt, now / 1000)
    id = requestAnimationFrame(tick)
  }
  id = requestAnimationFrame(tick)
  return () => {
    alive = false
    cancelAnimationFrame(id)
  }
}

/** Tween a scalar 0..1 over `ms`, calling `onUpdate(eased)`; returns a canceller. */
export function tween({ ms, ease = easeInOutCubic, onUpdate, onDone }) {
  const t0 = performance.now()
  let id = 0
  let cancelled = false
  const step = (now) => {
    if (cancelled) return
    const t = clamp((now - t0) / ms, 0, 1)
    onUpdate(ease(t), t)
    if (t < 1) id = requestAnimationFrame(step)
    else onDone?.()
  }
  id = requestAnimationFrame(step)
  return () => {
    cancelled = true
    cancelAnimationFrame(id)
  }
}
