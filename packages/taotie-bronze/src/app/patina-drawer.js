// The Patina drawer: master "time in the ground" dial, presets, every shared
// patina uniform grouped as a conservator would (Alloy / Corrosion / Surface),
// plus view mode and named views. Generated from PATINA_PARAMS so a new
// parameter added to the shader shows up here without UI work.

import { PATINA_PARAMS, PATINA_PRESETS, setPatina, getPatina } from '../kit/index.js'
import { el, slider, colorInput, chips } from './ui.js'

export function createPatinaDrawer({ body, stateLabel, onChange, onMode, onView }) {
  const controls = {}
  let presetName = null

  // --- master dial
  const age = PATINA_PARAMS.age
  const ageCtl = slider({ label: age.label, min: age.min, max: age.max, step: age.step, value: getPatina().age, cls: 'master-ctl', onInput: (v) => change({ age: v }) })
  controls.age = ageCtl
  const master = el('div', { class: 'group master' }, ageCtl.el, el('div', { class: 'ends' }, el('span', { text: 'out of the mould · 1200 BC' }), el('span', { text: 'out of the ground · 1939' })))

  // --- presets
  const presetRow = el('div', { class: 'group' }, el('span', { class: 'cap', text: 'Presets' }))
  const presetChips = chips(el('div'), Object.keys(PATINA_PRESETS).map((id) => ({ id, label: id.replace(/-/g, ' ') })), {
    onPick: (id) => applyPreset(id),
  })
  presetRow.append(presetChips.el)

  // --- view
  const viewGroup = el('div', { class: 'group' }, el('span', { class: 'cap', text: 'View' }))
  const modeSeg = chips(el('div'), ['beauty', 'clay', 'height'].map((id) => ({ id })), { value: 'beauty', seg: true, onPick: (m) => onMode(m) })
  const viewChips = el('div', { class: 'chips', style: 'margin-top:8px' })
  viewGroup.append(modeSeg.el, viewChips)

  // --- parameter groups
  const groups = {}
  for (const [k, d] of Object.entries(PATINA_PARAMS)) {
    if (d.group === 'master') continue
    if (!groups[d.group]) groups[d.group] = el('div', { class: 'group' }, el('span', { class: 'cap', text: d.group }))
    const v = getPatina()[k]
    const ctl =
      d.type === 'color'
        ? colorInput({ label: d.label, value: v, onInput: (x) => change({ [k]: x }) })
        : slider({ label: d.label, min: d.min, max: d.max, step: d.step, unit: d.unit, value: v, onInput: (x) => change({ [k]: x }) })
    if (d.hint) ctl.el.title = d.hint
    controls[k] = ctl
    groups[d.group].append(ctl.el)
  }

  body.replaceChildren(master, presetRow, viewGroup, ...Object.values(groups))

  function change(values) {
    setPatina(values)
    // moving the master dial keeps the preset's identity; anything else makes it custom
    if (!('age' in values && Object.keys(values).length === 1)) setPresetLabel(null)
    onChange?.()
  }

  function refresh() {
    const p = getPatina()
    for (const [k, c] of Object.entries(controls)) c.set(p[k])
  }

  function setPresetLabel(name) {
    presetName = name
    presetChips.set(name)
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
