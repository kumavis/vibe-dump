// Preset palette (design §10): click spawns ahead of the camera; the pin
// button arms "place at cursor", and the next click in the viewport spawns
// where the mouse ray meets the ground.
import { h } from './dom.js'

const KIND_ICON = { tree: '🌳', critter: '🐾', model: '📦' }
const SHAPE_ICON = { box: '📦', sphere: '🪨', cone: '🔺', cylinder: '🛢️', capsule: '💊' }
// light: the preset carries a light (a lamp's look is a tree of nodes, but it is a lamp)
export function presetIcon (representation, { light = false } = {}) {
  const r = representation ?? null
  if (light) return '💡'
  if (!r) return '◻️'
  const image = String(r.image ?? '')
  if (String(r.kind) === 'billboard' && image.startsWith('emoji:')) return image.slice(6) || '❓'
  if (String(r.kind) === 'primitive') return SHAPE_ICON[String(r.shape)] ?? '⬛'
  return KIND_ICON[String(r.kind)] ?? '◻️'
}

// presets worth offering: everything except pure bases (extended by another
// preset and without a look of their own, like `creature`).
// presets: [{ name, extends: [names], look }]
export function paletteEntries (presets) {
  const extendedBy = new Set(presets.flatMap((p) => p.extends ?? []))
  return presets
    .filter((p) => !(extendedBy.has(p.name) && !p.look))
    .map((p) => ({ name: p.name, icon: presetIcon(p.look, { light: p.light }) }))
    .sort((a, b) => (a.name < b.name ? -1 : 1))
}

export function makePalette ({ onSpawn, onArm }) {
  const grid = h('div', { class: 'palette' })
  const arm = h('button', { class: 'small toggle', type: 'button', title: 'Place at cursor: arm, then click in the scene', onclick: () => onArm(!armed) }, '📍 at cursor')
  const el = h('section', { class: 'panel-section palette-section' }, h('div', { class: 'section-head' }, h('h3', null, 'Spawn'), arm), grid)
  let armed = false; let entries = []
  const render = () => grid.replaceChildren(...entries.map((e) => h('button', {
    class: `preset${armed ? ' armed' : ''}`, type: 'button', dataset: { preset: e.name }, title: armed ? `click in the scene to place a ${e.name}` : `spawn a ${e.name} ahead`,
    onclick: () => onSpawn(e.name),
  }, h('span', { class: 'icon' }, e.icon), h('span', null, e.name))))
  return {
    el,
    setPresets (list) { entries = paletteEntries(list); render() },
    setArmed (v, name) { armed = !!v; arm.classList.toggle('on', armed); arm.textContent = armed ? `📍 ${name ? `placing ${name}` : 'pick a preset'} (Esc)` : '📍 at cursor'; render() },
    get armed () { return armed },
  }
}
