// The Patina drawer: master "time in the ground" dial, preset chips grouped as
// Vessels / Looks / Blue, the view mode (beauty / clay / height / mask = layer
// coverages in false colour) and named views, then the parameters.
// The parameter list is long, so: the handful of most expressive sliders
// (PATINA_PARAMS entries with `key: true`) sit open under "Main", and every
// group (Alloy · Carbonates & blue · Other corrosion · Surface) is a
// collapsible <details> holding ALL its parameters (the key ones included —
// the two copies stay in sync). Generated from PATINA_PARAMS, so a parameter
// added to the shader shows up here without UI work.

import { PATINA_PARAMS, PATINA_PRESETS, PATINA_PRESET_GROUPS, setPatina, getPatina } from '../kit/index.js'
import { el, slider, colorInput, chips } from './ui.js'

const CSS = `
.patina-sub { margin: 8px 0 2px; }
.patina-sub:first-of-type { margin-top: 0; }
.patina-sub > .cap { display: block; margin-bottom: 4px; color: var(--dim, #8a8172); font-size: 10px; }
.patina-sub > .chips button { padding-left: 7px; padding-right: 7px; }
details.patina-fold { border-top: 1px solid var(--rule, #2a2622); padding: 0; }
details.patina-fold > summary { list-style: none; cursor: pointer; padding: 11px 0 9px; display: flex; justify-content: space-between; align-items: baseline; }
details.patina-fold > summary::-webkit-details-marker { display: none; }
details.patina-fold > summary .cap { color: var(--bronze, #b08a5a); }
details.patina-fold > summary .n { font-family: var(--sans, sans-serif); font-size: 10.5px; color: var(--dim, #8a8172); }
details.patina-fold > summary .n::after { content: ' +'; }
details.patina-fold[open] > summary .n::after { content: ' −'; }
details.patina-fold > .body { padding: 0 0 8px; }
`

export function createPatinaDrawer({ body, stateLabel, onChange, onMode, onView }) {
  if (!document.getElementById('patina-drawer-css')) document.head.append(el('style', { id: 'patina-drawer-css', text: CSS }))
  const controls = {} // key → [ctl, …] (a key slider appears under Main and in its group)
  let presetName = null
  const add = (k, c) => (controls[k] ||= []).push(c)

  // --- master dial
  const age = PATINA_PARAMS.age
  const ageCtl = slider({ label: age.label, min: age.min, max: age.max, step: age.step, value: getPatina().age, cls: 'master-ctl', onInput: (v) => change({ age: v }) })
  add('age', ageCtl)
  const master = el('div', { class: 'group master' }, ageCtl.el, el('div', { class: 'ends' }, el('span', { text: 'out of the mould · 1200 BC' }), el('span', { text: 'out of the ground · 1939' })))

  // --- presets, grouped; any preset not named in a group lands in Looks
  const presetRow = el('div', { class: 'group' }, el('span', { class: 'cap', text: 'Presets' }))
  const grouped = Object.fromEntries(Object.entries(PATINA_PRESET_GROUPS || {}).map(([g, ids]) => [g, ids.filter((id) => PATINA_PRESETS[id])]))
  const named = new Set(Object.values(grouped).flat())
  const rest = Object.keys(PATINA_PRESETS).filter((id) => !named.has(id))
  if (rest.length) grouped.Looks = [...(grouped.Looks || []), ...rest]
  const chipSets = []
  for (const [g, ids] of Object.entries(grouped)) {
    if (!ids.length) continue
    const c = chips(el('div'), ids.map((id) => ({ id, label: id.replace(/-/g, ' ') })), { onPick: (id) => applyPreset(id) })
    chipSets.push(c)
    presetRow.append(el('div', { class: 'patina-sub' }, el('span', { class: 'cap', text: g }), c.el))
  }

  // --- view
  const viewGroup = el('div', { class: 'group' }, el('span', { class: 'cap', text: 'View' }))
  const modeSeg = chips(el('div'), ['beauty', 'clay', 'height', 'mask'].map((id) => ({ id })), { value: 'beauty', seg: true, onPick: (m) => onMode(m) })
  const viewChips = el('div', { class: 'chips', style: 'margin-top:8px' })
  viewGroup.append(modeSeg.el, viewChips)

  // --- parameters
  const makeCtl = (k, d) => {
    const v = getPatina()[k]
    const ctl =
      d.type === 'color'
        ? colorInput({ label: d.label, value: v, onInput: (x) => change({ [k]: x }) })
        : slider({ label: d.label, min: d.min, max: d.max, step: d.step, unit: d.unit, value: v, onInput: (x) => change({ [k]: x }) })
    if (d.hint) ctl.el.title = d.hint
    add(k, ctl)
    return ctl.el
  }
  const main = el('div', { class: 'group' }, el('span', { class: 'cap', text: 'Main' }))
  const folds = {}
  for (const [k, d] of Object.entries(PATINA_PARAMS)) {
    if (d.group === 'master') continue
    if (d.key) main.append(makeCtl(k, d))
    if (!folds[d.group]) {
      const n = el('span', { class: 'n' })
      const b = el('div', { class: 'body' })
      folds[d.group] = { el: el('details', { class: 'patina-fold' }, el('summary', {}, el('span', { class: 'cap', text: d.group }), n), b), n, b, count: 0 }
    }
    const f = folds[d.group]
    f.b.append(makeCtl(k, d))
    f.n.textContent = ++f.count + ''
  }

  body.replaceChildren(master, presetRow, viewGroup, main, ...Object.values(folds).map((f) => f.el))

  function change(values) {
    setPatina(values)
    // moving the master dial keeps the preset's identity; anything else makes it custom
    if (!('age' in values && Object.keys(values).length === 1)) setPresetLabel(null)
    // keep the twin of a key slider in step
    const p = getPatina()
    for (const k of Object.keys(values)) for (const c of controls[k] || []) c.set(p[k])
    onChange?.()
  }

  function refresh() {
    const p = getPatina()
    for (const [k, cs] of Object.entries(controls)) for (const c of cs) c.set(p[k])
  }

  function setPresetLabel(name) {
    presetName = name
    for (const c of chipSets) c.set(name)
    stateLabel.textContent = name ? name.replace(/-/g, ' ') : 'custom'
  }

  function applyPreset(name) {
    const p = PATINA_PRESETS[name]
    if (!p) return
    // presets are complete looks: reset to defaults first so nothing leaks between them
    const defaults = Object.fromEntries(Object.entries(PATINA_PARAMS).map(([k, d]) => [k, d.default]))
    setPatina({ ...defaults, ...p })
    refresh()
    setPresetLabel(name)
    onChange?.()
  }

  return {
    applyPreset,
    refresh,
    get preset() {
      return presetName
    },
    setMode: (m) => modeSeg.set(m),
    /** named views for the current subject: [{ id, label }] */
    setViews(ids, current) {
      viewChips.replaceChildren()
      if (!ids.length) return
      const c = chips(viewChips, ids.map((id) => ({ id: id, label: id.replace(/-/g, ' ') })), { value: current, onPick: (id) => onView(id) })
      this._views = c
    },
    setView(id) {
      this._views?.set(id)
    },
  }
}
