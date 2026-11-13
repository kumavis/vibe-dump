// Boot: wire URL params, stage, tabs, the two tab controllers, the patina
// drawer and the verification hooks together.

import * as kit from '../kit/index.js'
import * as REGISTRY from '../artifacts/index.js'
import { Stage } from './stage.js'
import { readParams } from './params.js'
import { createVessels } from './vessels.js'
import { createAtlas } from './atlas.js'
import { createPatinaDrawer } from './patina-drawer.js'
import { installHooks, measure } from './hooks.js'

export async function boot() {
  const params = readParams()
  const root = document.documentElement
  root.dataset.ready = '0'
  if (!params.ui) root.classList.add('ui-off')

  const canvas = document.getElementById('gl')
  if (!canvas.getContext('webgl2')) {
    document.getElementById('fallback').hidden = false
    return
  }
  // the canvas was probed with getContext above; three needs a fresh one
  const fresh = canvas.cloneNode()
  canvas.replaceWith(fresh)

  const stage = new Stage(fresh, { deterministic: !params.ui })
  kit.ReliefMap.anisotropy = Math.min(8, stage.renderer.capabilities.getMaxAnisotropy())

  const artifacts = Object.values(REGISTRY).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))
  const first = artifacts.find((a) => a.id === params.a) || artifacts[0]

  // ---- progress line
  const bar = document.getElementById('progress')
  const progress = {
    start(what) {
      bar.classList.add('on')
      bar.querySelector('i').style.width = '2%'
      bar.querySelector('span').textContent = 'casting ' + what
    },
    set(f, what) {
      bar.querySelector('i').style.width = Math.round(Math.max(2, f * 100)) + '%'
      if (what) bar.querySelector('span').textContent = what
    },
    done() {
      bar.querySelector('i').style.width = '100%'
      bar.querySelector('span').textContent = ''
      setTimeout(() => bar.classList.remove('on'), 250)
    },
  }

  // ---- patina drawer
  const drawerEl = document.getElementById('drawer')
  let tab = params.tab
  const drawer = createPatinaDrawer({
    body: document.getElementById('drawer-body'),
    stateLabel: document.getElementById('drawer-preset'),
    onChange: () => (stage.dirty = true),
    onMode: (m) => setMode(m),
    onView: (v) => {
      vessels.setView(v)
      currentView = v
    },
  })
  drawer.applyPreset(params.patina && kit.PATINA_PRESETS[params.patina] ? params.patina : first.defaultPatina || 'excavated-green')

  const toggle = document.getElementById('drawer-toggle')
  const wide = () => window.innerWidth > 720
  // on a phone the sheet starts closed so the vessel is visible
  if (!wide()) drawerEl.classList.remove('open')
  toggle.addEventListener('click', () => {
    drawerEl.classList.toggle('open')
    toggle.setAttribute('aria-expanded', drawerEl.classList.contains('open'))
    updateInsets()
  })
  function updateInsets() {
    if (!params.ui) return stage.setInsets({})
    if (!wide()) return stage.setInsets(tab === 'atlas' ? { top: 170, bottom: 300 } : { top: 100, bottom: 250 })
    const right = drawerEl.classList.contains('open') ? drawerEl.offsetWidth : 44
    stage.setInsets(tab === 'atlas' ? { right, left: 290, top: 110 } : { right, left: 190, top: 60, bottom: 40 })
  }
  window.addEventListener('resize', updateInsets)

  // ---- modes
  function setMode(m) {
    stage.setMode(m)
    drawer.setMode(m)
  }
  setMode(params.mode)

  // ---- tabs
  let currentView = null
  const vessels = createVessels({
    stage,
    artifacts,
    quality: params.q,
    progress,
    listEl: document.getElementById('vessel-list'),
    labelEl: document.getElementById('label'),
    onShown: (a, v) => {
      currentView = v
      drawer.setViews(Object.keys(a.views || {}), v)
      if (a.defaultPatina && !params.patina && shownVessels++ > 0) drawer.applyPreset(a.defaultPatina)
    },
  })
  let shownVessels = 0
  const atlas = createAtlas({
    stage,
    quality: params.q,
    progress,
    dom: {
      picker: document.getElementById('motif-picker'),
      presets: document.getElementById('motif-presets'),
      viewToggle: document.getElementById('atlas-view'),
      params: document.getElementById('motif-params'),
      stats: document.getElementById('atlas-stats'),
      heightmap: document.getElementById('heightmap'),
    },
  })

  for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => setTab(b.dataset.tab))
  async function setTab(t) {
    tab = t
    document.body.dataset.tab = t
    for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t))
    updateInsets()
    if (t === 'atlas') {
      await atlas.activate()
      drawer.setViews([])
    } else {
      atlas.deactivate()
      const cur = vessels.current
      if (cur) {
        stage.setContent(cur.result.object, { rig: 'vitrine' })
        stage.setView(cur.artifact.views?.[currentView] || {})
        drawer.setViews(Object.keys(cur.artifact.views || {}), currentView)
        stage.setAutoRotate(true)
      } else await vessels.show(first.id)
    }
  }

  // ---- hooks
  const hooks = installHooks({
    artifacts: artifacts.map((a) => a.id),
    motifs: Object.keys(kit.MOTIFS),
    motifPresets: (name) => Object.keys(kit.MOTIFS[name]?.presets || {}),
    views: (id) => Object.keys(artifacts.find((a) => a.id === id)?.views || {}),
    viewRefs: (id) => Object.fromEntries(Object.entries(artifacts.find((a) => a.id === id)?.views || {}).filter(([, v]) => v.ref).map(([k, v]) => [k, v.ref])),
    metrics: () => {
      const cur = tab === 'atlas' ? atlas.plaque && { object: atlas.plaque.group, id: 'atlas' } : vessels.current && { object: vessels.current.result.object, id: vessels.current.artifact.id }
      if (!cur) return null
      return { id: cur.id, ...measure(cur.object), buildMs: vessels.timings[cur.id] }
    },
    timings: vessels.timings,
    kit,
    stage,
    frame: () => stage.frame(),
    async show(id, view) {
      if (tab !== 'vessels') await setTab('vessels')
      await vessels.show(id, { view })
      await stage.frame()
    },
    async setView(name) {
      vessels.setView(name)
      currentView = name
      await stage.frame()
    },
    async setMode(m) {
      setMode(m)
      await stage.frame()
    },
    async setPatina(p) {
      if (typeof p === 'string') drawer.applyPreset(p)
      else kit.setPatina(p)
      stage.dirty = true
      await stage.frame()
    },
    async showMotif(name, preset) {
      if (tab !== 'atlas') await setTab('atlas')
      await atlas.setMotif(name, preset)
      await stage.frame()
    },
    atlasStats: () => atlas.plaque?.stats,
  })

  // ---- first subject
  document.body.dataset.tab = tab
  updateInsets()
  if (tab === 'atlas') {
    for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === 'atlas'))
    if (params.motif || params.preset) await atlas.setMotif(params.motif || 'taotie', params.preset)
    await atlas.activate()
  } else {
    await vessels.show(first.id, { view: params.view })
    stage.setAutoRotate(params.ui)
  }
  await stage.frame()
  hooks.markReady()
}
