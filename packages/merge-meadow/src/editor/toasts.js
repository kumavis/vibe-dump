// Toasts: system errors, ownership changes, refused grabs, merge oddities.
// The same message inside `dedupeMs` bumps a counter instead of stacking.
import { h } from './dom.js'

export function makeToasts ({ max = 5, dedupeMs = 4000 } = {}) {
  const el = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' })
  const live = new Map() // text -> { node, n, timer }
  function toast (msg, level = 'info', { timeoutMs = level === 'error' ? 8000 : 4000 } = {}) {
    const text = String(msg)
    const cur = live.get(text)
    if (cur && Date.now() - cur.at < dedupeMs) {
      cur.n++; cur.at = Date.now(); cur.count.textContent = `×${cur.n}`
      clearTimeout(cur.timer); cur.timer = setTimeout(() => drop(text), timeoutMs)
      return
    }
    if (cur) drop(text)
    const count = h('span', { class: 'count' })
    const node = h('div', { class: `toast ${level}`, onclick: () => drop(text) }, h('span', null, text), count)
    el.append(node)
    live.set(text, { node, count, n: 1, at: Date.now(), timer: setTimeout(() => drop(text), timeoutMs) })
    while (el.children.length > max) { const first = [...live].find(([, v]) => v.node === el.firstElementChild); if (first) drop(first[0]); else el.firstElementChild.remove() }
  }
  function drop (text) { const t = live.get(text); if (!t) return; clearTimeout(t.timer); t.node.remove(); live.delete(text) }
  return { el, toast }
}
