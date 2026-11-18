// Motif Atlas: one motif from the registry, its schema turned into controls,
// rendered as a lit bronze plaque (same PatinaMaterial, raking light) or as
// the raw height field. This is the bench the motif specialists work at.

import * as THREE from 'three'
import * as kit from '../kit/index.js'
import { el, slider, selectInput, toggleInput, chips, yieldToBrowser } from './ui.js'

const BORDER = 8 // mm of plain frame around the motif (less on very small plaques)

/** The panel size (mm) a motif preset was matched at; the motif's default plaque otherwise. */
export function plaqueSize(m, preset) {
  return (preset && m.presetPlaques?.[preset]) || m.plaque || { w: 200, h: 120 }
}

export function createAtlas({ stage, quality, progress, dom, onBuilt }) {
  const names = Object.keys(kit.MOTIFS)
  let motif = kit.MOTIFS.taotie ? 'taotie' : names[0]
  let preset = null
  // the preset whose plaque size is in use: a parameter tweak clears `preset` (the
  // params are now custom) but keeps the size the preset was matched at
  let sizePreset = null
  let params = kit.resolveMotifParams(motif)
  let plaque = null // { group, mesh, relief }
  let showHeight = false
  let pending = null
  let building = false
  let lastStats = ''

  const picker = chips(dom.picker, names.map((n) => ({ id: n, label: kit.MOTIFS[n].label || n })), { value: motif, onPick: (n) => setMotif(n) })
  let presetChips = null
  chips(dom.viewToggle, [{ id: 'plaque', label: 'Lit plaque' }, { id: 'height', label: 'Height map' }], {
    value: 'plaque',
    onPick: (v) => {
      showHeight = v === 'height'
      paintHeight()
    },
  })

  function renderControls() {
    const m = kit.MOTIFS[motif]
    presetChips = chips(dom.presets, Object.keys(m.presets || {}).map((id) => ({ id, label: id.replace(/-/g, ' ') })), {
      value: preset,
      onPick: (id) => {
        preset = id
        sizePreset = id
        params = kit.resolveMotifParams(motif, {}, id)
        renderParams()
        schedule()
      },
    })
    renderParams()
  }

  function renderParams() {
    const m = kit.MOTIFS[motif]
    dom.params.replaceChildren(...controlsFor(m.schema, params, () => {
      preset = null
      presetChips?.set(null)
      schedule()
    }))
  }

  function controlsFor(schema, target, changed) {
    const out = []
    for (const [k, s] of Object.entries(schema)) {
      const label = s.label || k
      if (s.type === 'group') {
        out.push(el('div', { class: 'group' }, el('span', { class: 'cap', text: label }), ...controlsFor(s.fields, target[k], changed)))
      } else if (s.type === 'range') {
        out.push(slider({ label, min: s.min, max: s.max, step: s.step ?? 0.01, unit: s.unit, value: target[k], onInput: (v) => ((target[k] = v), changed()) }).el)
      } else if (s.type === 'enum') {
        out.push(selectInput({ label, options: s.options, value: target[k], onInput: (v) => ((target[k] = v), changed()) }).el)
      } else if (s.type === 'bool') {
        out.push(toggleInput({ label, value: target[k], onInput: (v) => ((target[k] = v), changed()) }).el)
      }
    }
    return out
  }

  function schedule() {
    clearTimeout(pending)
    pending = setTimeout(() => rebuild(), 140)
  }

  async function setMotif(name, presetName) {
    motif = kit.MOTIFS[name] ? name : motif
    preset = presetName && kit.MOTIFS[motif].presets?.[presetName] ? presetName : null
    sizePreset = preset
    params = kit.resolveMotifParams(motif, {}, preset)
    picker.set(motif)
    renderControls()
    return rebuild()
  }

  let again = false
  async function rebuild() {
    if (building) {
      again = true
      return
    }
    building = true
    document.documentElement.dataset.ready = '0'
    progress.start('motif')
    try {
      do {
        again = false
        await yieldToBrowser()
        const next = await buildPlaque(motif, params, quality, (f, s) => progress.set(f, s), sizePreset)
        const prev = plaque
        plaque = next
        if (active) show()
        if (prev) disposePlaque(prev)
      } while (again)
    } finally {
      building = false
      progress.done()
    }
    paintHeight()
    onBuilt?.()
  }

  let active = false
  // the camera is framed to the plaque whenever its size changes (a new motif or
  // preset, or coming back from the vessels tab), not on every parameter tweak
  function show() {
    stage.setContent(plaque.group, { rig: 'raking' })
    const key = plaque.size.w + 'x' + plaque.size.h
    if (framedFor !== key) frame()
    framedFor = key
    stage.setAutoRotate(false)
    dom.stats.textContent = plaque.stats
  }
  let framedFor = null
  function frame() {
    stage.setView({ azimuth: 0, elevation: 4, fov: 26, fit: 1.08 })
  }

  function paintHeight() {
    dom.heightmap.hidden = !(active && showHeight)
    if (!plaque || !showHeight) return
    const r = plaque.relief
    const c = dom.heightmap.querySelector('canvas')
    c.width = r.width
    c.height = r.height
    const g = c.getContext('2d')
    const img = g.createImageData(r.width, r.height)
    const k = 255 / (r.max - r.min)
    for (let y = 0; y < r.height; y++) {
      const src = (r.height - 1 - y) * r.width
      for (let x = 0; x < r.width; x++) {
        const v = (r.data[src + x] - r.min) * k
        const o = (y * r.width + x) * 4
        img.data[o] = img.data[o + 1] = img.data[o + 2] = v
        img.data[o + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }

  renderControls()

  return {
    async activate() {
      active = true
      if (!plaque) await rebuild()
      else show()
      paintHeight()
    },
    deactivate() {
      active = false
      framedFor = null
      dom.heightmap.hidden = true
    },
    /** Re-frame the camera on the plaque (after a resize or a layout change). */
    frame() {
      if (active && plaque) frame()
    },
    setQuality(q) {
      quality = q
      if (plaque) return rebuild()
    },
    get preset() {
      return preset
    },
    setMotif,
    get motifs() {
      return names
    },
    get plaque() {
      return plaque
    },
    get stats() {
      return lastStats
    },
  }
}

/** Panel → bake → flat plaque with a back and rims, standing on the plinth. */
export async function buildPlaque(motif, params, quality, onProgress, preset = null) {
  const m = kit.MOTIFS[motif]
  const size = plaqueSize(m, preset)
  const B = Math.max(3, Math.min(BORDER, 0.12 * Math.min(size.w, size.h)))
  const W = size.w + B * 2
  const H = size.h + B * 2
  const t0 = performance.now()
  // resolution follows the plaque: a 30 mm boss gets as many pixels across as a 320 mm frieze
  // would at 6 px/mm (but never fewer than 6 px/mm, never more than 20, both × quality)
  const ppmm = Math.max(6 * quality, Math.min(20 * quality, (1500 * quality) / Math.max(W, H)))
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed: 11 })
  onProgress?.(0.1, 'drawing')
  kit.drawMotif(panel, motif, { x: B, y: B, w: size.w, h: size.h }, params)
  const line = Math.min(1.6, B * 0.2)
  kit.borderLine(panel, { x: B * 0.55, y: B * 0.55, w: W - B * 1.1, h: H - B * 1.1 }, { width: line, height: Math.min(0.8, line * 0.5), sides: 'tblr' })
  const t1 = performance.now()
  onProgress?.(0.6, 'baking')
  await yieldToBrowser()
  const relief = panel.bake()
  relief.channels()
  const t2 = performance.now()
  const geo = kit.buildSurface({
    surface: kit.quadSurface([-W / 2, 0, 0], [W / 2, 0, 0], [-W / 2, H, 0], [W / 2, H, 0]),
    segments: { density: Math.max(1.2, Math.min(8, 240 / Math.max(W, H))) * Math.sqrt(quality) },
    relief,
    back: { thickness: 7 },
    fade: 2,
  })
  const mesh = new THREE.Mesh(geo, new kit.PatinaMaterial({ relief }))
  mesh.castShadow = mesh.receiveShadow = true
  mesh.userData.part = 'plaque'
  const group = new THREE.Group()
  group.add(mesh)
  const t3 = performance.now()
  const stats = `${size.w}×${size.h} mm${preset ? ' (' + preset + ')' : ''} · ${relief.width}×${relief.height} px · ${relief.ppmm.toFixed(1)} px/mm · draw ${Math.round(t1 - t0)} ms · bake ${Math.round(t2 - t1)} ms · mesh ${Math.round(t3 - t2)} ms`
  return { group, mesh, relief, stats, size: { w: size.w, h: size.h }, timings: { draw: t1 - t0, bake: t2 - t1, mesh: t3 - t2 } }
}

function disposePlaque(p) {
  p.mesh.geometry.dispose()
  p.mesh.material.dispose()
  p.relief.dispose()
}
