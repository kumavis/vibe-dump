// Preset palette (design §10, §18.3): click spawns ahead of the camera; the pin
// button arms "place at cursor", and the next click in the viewport spawns
// where the mouse ray meets the ground. With ~20 presets it is a compact grid
// under a search box: type to filter, Enter spawns the first match (an empty search spawns nothing), arrow keys
// walk the grid, Escape clears the search.
import { h } from './dom.js'
import { libraryPresets } from '../doc/templates.js'

const KIND_ICON = { tree: '🌳', rig: '🐾', model: '📦' }
const SHAPE_ICON = { box: '📦', sphere: '🪨', cone: '🔺', cylinder: '🛢️', capsule: '💊' }
const GENERIC = '◻️'

// the icons the seed library ships (presets.js, presets-zoo.js): used for a
// preset that carries no `icon` of its own and whose look has no specific glyph
// (a rig would otherwise read as a paw print)
export const LIBRARY_ICONS = Object.freeze(Object.fromEntries(Object.entries(libraryPresets())
  .filter(([, p]) => typeof p?.icon === 'string' && p.icon).map(([n, p]) => [n, p.icon])))

const iconString = (v) => {
  const s = v == null ? '' : String(v).trim()
  return s && s.length <= 16 ? s : ''
}

// light: the preset carries a light (a lamp's look is a tree of nodes, but it is a lamp)
// fallback: the glyph to use before the generic per-kind one ('' = none)
export function presetIcon (representation, { light = false, fallback = '' } = {}) {
  const r = representation ?? null
  if (light) return '💡'
  if (!r) return fallback || GENERIC
  const image = String(r.image ?? '')
  if (String(r.kind) === 'billboard' && image.startsWith('emoji:')) return image.slice(6) || '❓'
  if (String(r.kind) === 'primitive') return SHAPE_ICON[String(r.shape)] ?? '⬛'
  return fallback || (KIND_ICON[String(r.kind)] ?? GENERIC)
}

// presets worth offering: everything except pure bases (extended by another
// preset and without a look of their own, like `creature`).
// presets: [{ name, extends: [names], look, light?, icon? }]
// icon: the preset's own `icon` first, then the look (billboard emoji, light,
// primitive shape), then the library's icon for that name, then a kind glyph.
export function paletteEntries (presets, { icons = LIBRARY_ICONS } = {}) {
  const extendedBy = new Set(presets.flatMap((p) => p.extends ?? []))
  return presets
    .filter((p) => !(extendedBy.has(p.name) && !p.look))
    .map((p) => ({ name: p.name, icon: iconString(p.icon) || presetIcon(p.look, { light: p.light, fallback: iconString(Object.prototype.hasOwnProperty.call(icons, p.name) ? icons[p.name] : '') }) }))
    .sort((a, b) => (a.name < b.name ? -1 : 1))
}

// entries whose name contains every word of the query (case-insensitive)
export function filterEntries (entries, query) {
  const words = String(query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return entries
  return entries.filter((e) => { const n = String(e.name).toLowerCase(); return words.every((w) => n.includes(w)) })
}

// arrow-key navigation in a grid of n cells, cols wide -> the next index
export function gridMove (index, key, cols, n) {
  if (n <= 0) return -1
  const c = Math.max(1, cols | 0)
  const i = Math.min(Math.max(0, index | 0), n - 1)
  switch (key) {
    case 'ArrowRight': return Math.min(n - 1, i + 1)
    case 'ArrowLeft': return Math.max(0, i - 1)
    case 'ArrowDown': return i + c < n ? i + c : i
    case 'ArrowUp': return i - c >= 0 ? i - c : -1 // -1: back to the search box
    case 'Home': return 0
    case 'End': return n - 1
    default: return i
  }
}

const NAV_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'])

export function makePalette ({ onSpawn, onArm }) {
  const grid = h('div', { class: 'palette', role: 'group', 'aria-label': 'presets' })
  const count = h('span', { class: 'count muted' })
  const search = h('input', { class: 'palette-search', type: 'search', placeholder: 'Search presets…', 'aria-label': 'search presets', spellcheck: false })
  const arm = h('button', { class: 'small toggle', type: 'button', title: 'Place at cursor: arm, then click in the scene', onclick: () => onArm(!armed) }, '📍 at cursor')
  const el = h('section', { class: 'panel-section palette-section' }, h('div', { class: 'section-head' }, h('h3', null, 'Spawn ', count), arm), search, grid)
  let armed = false; let entries = []; let shown = []
  const buttons = () => [...grid.querySelectorAll('button.preset')]
  const cols = () => {
    try { const t = getComputedStyle(grid).gridTemplateColumns; const n = t && t !== 'none' ? t.split(' ').filter(Boolean).length : 0; return n || 4 } catch { return 4 }
  }
  const render = () => {
    shown = filterEntries(entries, search.value)
    count.textContent = shown.length === entries.length ? `${entries.length}` : `${shown.length} of ${entries.length}`
    grid.replaceChildren(...shown.map((e, i) => h('button', {
      class: `preset${armed ? ' armed' : ''}`, type: 'button', dataset: { preset: e.name, i }, title: armed ? `click in the scene to place a ${e.name}` : `spawn a ${e.name} ahead`,
      tabIndex: i === 0 ? 0 : -1,
      onclick: () => onSpawn(e.name),
    }, h('span', { class: 'icon', 'aria-hidden': 'true' }, e.icon), h('span', { class: 'label' }, e.name))))
    if (!shown.length && entries.length) grid.append(h('p', { class: 'muted palette-none' }, 'No preset matches.'))
  }
  search.addEventListener('input', () => render())
  search.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); if (search.value.trim() && shown[0]) onSpawn(shown[0].name) } else if (ev.key === 'ArrowDown') { ev.preventDefault(); buttons()[0]?.focus() } else if (ev.key === 'Escape' && search.value) { search.value = ''; render() }
  })
  grid.addEventListener('keydown', (ev) => {
    if (!NAV_KEYS.has(ev.key)) return
    const bs = buttons(); const i = bs.indexOf(ev.target)
    if (i < 0) return
    ev.preventDefault()
    const j = gridMove(i, ev.key, cols(), bs.length)
    if (j < 0) { search.focus(); return }
    bs[i].tabIndex = -1; bs[j].tabIndex = 0; bs[j].focus()
  })
  return {
    el,
    setPresets (list) { entries = paletteEntries(list); render() },
    setArmed (v, name) { armed = !!v; arm.classList.toggle('on', armed); arm.textContent = armed ? `📍 ${name ? `placing ${name}` : 'pick a preset'} (Esc)` : '📍 at cursor'; render() },
    focusSearch () { search.focus(); search.select?.() },
    get armed () { return armed },
  }
}
