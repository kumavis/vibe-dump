// Boot: wire URL params and the #fragment route, stage, the lazily loaded
// artifact catalog, the vessels switcher / label / view bar, the Motif Atlas
// (its own chunk, loaded on first use), the patina drawer, the layout of the
// chrome around the vessel (desktop · phone · phone in landscape) and the
// verification hooks together.

import * as kit from '../kit/index.js'
import { Stage } from './stage.js'
import { readParams, readHash, store, QUALITY_KEY } from './params.js'
import { createCatalog } from './catalog.js'
import { createVessels } from './vessels.js'
import { createViewBar } from './views.js'
import { createPatinaDrawer } from './patina-drawer.js'
import { installHooks, measure, meshStats } from './hooks.js'
import { el } from './ui.js'

/** desk · phone (portrait, ≤ 720 px wide) · land (a phone on its side: short and wide) */
export function layoutOf(W = window.innerWidth, H = window.innerHeight) {
  if (H <= 520 && W > H) return 'land'
  // a desk needs room for the label column AND the patina drawer beside the vessel;
  // a tablet in portrait reads better with the phone's bottom dock
  if (W < 960) return 'phone'
  return 'desk'
}
export function applyLayout() {
  const l = layoutOf()
  document.documentElement.dataset.layout = l
  return l
}

const QUALITIES = [
  { q: 0.5, label: 'Light' },
  { q: 1, label: 'Standard' },
  { q: 1.5, label: 'Fine', desk: true },
]

const $ = (id) => document.getElementById(id)

export async function boot() {
  const params = readParams()
  const root = document.documentElement
  root.dataset.ready = '0'
  if (!params.ui) root.classList.add('ui-off')
  let layout = applyLayout()

  // ---- WebGL 2, or a clear, quiet message
  const canvas = $('gl')
  const fail = () => {
    $('fallback').hidden = false
    root.dataset.ready = 'error'
  }
  let probe = null
  try {
    probe = canvas.getContext('webgl2')
  } catch {
    probe = null
  }
  if (!probe) return fail()
  // the canvas was probed with getContext above; three needs a fresh one
  const fresh = canvas.cloneNode()
  canvas.replaceWith(fresh)
  let stage
  try {
    stage = new Stage(fresh, { deterministic: !params.ui, pixelRatio: params.dpr })
  } catch (e) {
    console.warn(e)
    return fail()
  }
  fresh.addEventListener('webglcontextlost', (e) => {
    e.preventDefault()
    $('glmsg').hidden = false
  })
  fresh.addEventListener('webglcontextrestored', () => {
    stage.restoreContext()
    $('glmsg').hidden = true
  })

  // phones: smaller relief textures (never a stack of 4096² maps), less anisotropy
  const maxTex = stage.renderer.capabilities.maxTextureSize || 4096
  kit.ReliefPanel.maxSizeCap = Math.min(maxTex, params.compact ? 2048 : 8192)
  kit.ReliefMap.anisotropy = Math.min(params.compact ? 4 : 8, stage.renderer.capabilities.getMaxAnisotropy())

  const catalog = createCatalog()
  const asked = params.a || (params.route && params.route !== 'atlas' ? params.route : null)
  const wanted = asked && catalog.has(asked) ? asked : null
  let tab = params.tab
  let currentView = null

  // ---- progress: a hairline at the top; the words go on the label card (vessels) or under the bar (atlas)
  const bar = $('progress')
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
  const drawerEl = $('drawer')
  const drawer = createPatinaDrawer({
    body: $('drawer-body'),
    stateLabel: $('drawer-preset'),
    onChange: () => (stage.dirty = true),
    onMode: (m) => setMode(m),
    onView: (v) => selectView(v),
  })
  if (params.patina && kit.PATINA_PRESETS[params.patina]) drawer.applyPreset(params.patina)
  const toggle = $('drawer-toggle')
  const setDrawer = (open) => {
    drawerEl.classList.toggle('open', open)
    root.classList.toggle('drawer-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    if (open) setNav(false)
    relayoutSoon(330)
  }
  // only a desktop starts with the sheet open: on a phone the vessel comes first
  {
    const open = layout === 'desk' && window.innerWidth >= 1200
    drawerEl.classList.toggle('open', open)
    root.classList.toggle('drawer-open', open)
    toggle.setAttribute('aria-expanded', String(open))
  }
  toggle.addEventListener('click', () => setDrawer(!drawerEl.classList.contains('open')))

  const failLater = (e) => {
    console.error(e)
    root.dataset.ready = 'error'
  }

  // ---- modes
  function setMode(m) {
    stage.setMode(m)
    drawer.setMode(m)
  }
  setMode(params.mode)

  // ---- vessels: switcher, label, view bar, compare
  const column = $('column')
  const dock = $('dock')
  const nav = $('vessel-nav')
  const labelEl = $('label')
  const navOpen = $('nav-open')
  function setNav(open) {
    root.classList.toggle('nav-open', open)
    navOpen.setAttribute('aria-expanded', String(open))
    if (open && layout !== 'desk') setDrawer(false)
    if (open) nav.querySelector('[aria-current]')?.focus?.({ preventScroll: true })
  }
  navOpen.addEventListener('click', () => setNav(!root.classList.contains('nav-open')))
  $('nav-close').addEventListener('click', () => setNav(false))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) setNav(false)
  })

  const vessels = createVessels({
    stage,
    catalog,
    quality: params.q,
    // a phone keeps exactly one built vessel: switching frees the previous one
    cacheMax: params.compact ? 1 : 2,
    progress,
    listEl: $('vessel-list'),
    labelEl,
    onPick: (id) => {
      setNav(false)
      const p = tab !== 'vessels' ? setTab('vessels', { user: true, want: id }) : showVessel(id, { user: true })
      p.catch(failLater)
    },
    onShown: (a, v) => {
      currentView = v
      viewBar.setArtifact(a, v)
      drawer.setViews([]) // the views live on the view bar, by the vessel
      if (!params.patina) drawer.applyPreset(a.defaultPatina && kit.PATINA_PRESETS[a.defaultPatina] ? a.defaultPatina : 'excavated-green')
      stage.setAutoRotate(params.ui)
    },
  })
  vessels.onLayout = () => relayoutSoon(0)

  const viewBar = createViewBar({
    chipsEl: $('view-chips'),
    detailEl: $('detail-chips'),
    detailToggle: $('details-toggle'),
    compareToggle: $('compare-toggle'),
    figure: $('compare'),
    onView: (v) => selectView(v),
    onLayout: () => {
      // comparing on a narrow desk: fold the patina drawer away to make room for the photograph
      if (viewBar.comparing && layout === 'desk' && window.innerWidth < 1500 && drawerEl.classList.contains('open')) setDrawer(false)
      relayout({ refit: true })
    },
  })

  function selectView(v) {
    const a = vessels.current?.artifact
    if (!a?.views?.[v]) return
    currentView = v
    vessels.setView(v)
    viewBar.setView(v)
    stage.setAutoRotate(false)
    relayout({ refit: false })
  }

  // ---- quality ("Detail"): overridable on any device, remembered when storage allows
  const qseg = $('quality').querySelector('.qseg')
  function renderQuality() {
    qseg.replaceChildren(
      ...QUALITIES.filter((o) => !o.desk || !params.compact || vessels.quality === o.q).map((o) =>
        el('button', { type: 'button', 'aria-pressed': String(Math.abs(vessels.quality - o.q) < 1e-3), text: o.label, onclick: () => setQuality(o.q) }),
      ),
    )
  }
  async function setQuality(q) {
    if (Math.abs(q - vessels.quality) < 1e-3) return
    store.set(QUALITY_KEY, q)
    vessels.setQuality(q)
    renderQuality()
    if (atlas) atlas.setQuality(q)
    const id = vessels.current?.artifact.id
    if (tab === 'vessels' && id) await showVessel(id, { view: currentView })
  }
  renderQuality()

  // ---- the Motif Atlas, its own chunk
  let atlas = null
  let atlasLoading = null
  function getAtlas() {
    atlasLoading ??= import('./atlas.js').then(({ createAtlas }) => {
      atlas = createAtlas({
        stage,
        quality: vessels.quality,
        progress,
        onBuilt: () => tab === 'atlas' && settle(),
        dom: {
          picker: $('motif-picker'),
          presets: $('motif-presets'),
          viewToggle: $('atlas-view'),
          params: $('motif-params'),
          stats: $('atlas-stats'),
          heightmap: $('heightmap'),
        },
      })
      return atlas
    })
    return atlasLoading
  }

  // ---- ready: '1' once a fully built subject's first frame is on screen
  let hooks = null
  let subject = 0
  async function settle() {
    const my = subject
    await stage.frame()
    if (my === subject && !building) hooks.markReady()
  }
  let building = 0

  async function showVessel(id, { view, user } = {}) {
    if (user) setHash(id)
    const my = ++subject
    building++
    let r
    try {
      r = await vessels.show(id, { view })
    } finally {
      building--
    }
    if (!r || my !== subject) return r
    relayout({ refit: true })
    await settle()
    return r
  }

  async function setTab(t, { user, want } = {}) {
    tab = t
    document.body.dataset.tab = t
    for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t))
    if (user) setHash(t === 'atlas' ? 'atlas' : want || vessels.current?.artifact.id)
    setNav(false)
    relayout({ refit: false })
    root.dataset.ready = '0'
    const my = ++subject
    if (t === 'atlas') {
      const at = await getAtlas()
      if (tab !== 'atlas') return
      building++
      try {
        await at.activate()
      } finally {
        building--
      }
      drawer.setViews([])
      relayout({ refit: false })
      if (my === subject) await settle()
    } else {
      atlas?.deactivate()
      const cur = vessels.current
      if (cur && (!want || want === cur.artifact.id)) {
        stage.setContent(cur.result.object, { rig: 'vitrine' })
        relayout({ refit: true })
        stage.setAutoRotate(params.ui)
        await settle()
      } else await showVessel(want || (await firstVessel()))
    }
  }
  for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => b.dataset.tab !== tab && setTab(b.dataset.tab, { user: true }))

  // ---- #fragment routing: #<artifact-id> and #atlas (a host may strip the query string)
  function setHash(name) {
    if (!params.ui || !name || readHash() === name) return
    try {
      history.replaceState(history.state, '', '#' + name)
    } catch {
      try {
        location.hash = name
      } catch {
        /* a sandbox that forbids both: the route just isn't reflected */
      }
    }
  }
  window.addEventListener('hashchange', () => {
    const r = readHash()
    if (!r) return
    if (r === 'atlas') {
      if (tab !== 'atlas') setTab('atlas').catch(failLater)
    } else if (catalog.has(r)) {
      if (tab !== 'vessels') setTab('vessels', { want: r }).catch(failLater)
      else if (vessels.requested !== r && vessels.current?.artifact.id !== r) showVessel(r).catch(failLater)
    }
  })

  // ---- layout: the vessel is framed in what the chrome leaves free
  let lastFree = null
  function drawerExtent() {
    const open = drawerEl.classList.contains('open')
    if (layout === 'phone') return open ? drawerEl.offsetHeight : toggle.offsetHeight
    return open ? drawerEl.offsetWidth : toggle.offsetWidth || 44
  }
  function relayout({ refit = false } = {}) {
    const W = window.innerWidth
    const H = window.innerHeight
    const fig = $('compare')
    if (!params.ui) {
      stage.setInsets({})
      return
    }
    const r = (e) => e.getBoundingClientRect()
    const mast = r($('masthead'))
    let ins = { left: 0, right: 0, top: 0, bottom: 0 }
    if (tab === 'atlas') {
      const top = r($('atlas-top'))
      const ctl = r($('atlas-controls'))
      if (layout === 'phone') ins = { top: top.bottom + 6, bottom: Math.max(H - ctl.top, drawerExtent()) + 6 }
      else ins = { left: ctl.right + 16, right: drawerExtent() + 8, top: top.bottom + 8, bottom: 16 }
    } else if (layout === 'phone') {
      ins = { top: mast.bottom + 4, bottom: Math.max(H - r(dock).top, drawerExtent()) + 4 }
    } else if (layout === 'land') {
      ins = { left: r(dock).right + 12, right: drawerExtent() + 8, top: 8, bottom: 8 }
    } else {
      ins = { left: r(column).right + 16, right: drawerExtent() + 8, top: mast.bottom + 6, bottom: H - r(dock).top + 6 }
    }
    // compare: the photograph takes half the free area — the left half on a wide
    // screen, the top half on a tall one — and the vessel is framed in the other
    if (tab === 'vessels' && viewBar.comparing) {
      const fw = W - ins.left - ins.right
      const fh = H - ins.top - ins.bottom
      const gap = 10
      let box
      if (fh > fw * 1.05) {
        box = { left: ins.left + 8, top: ins.top, width: fw - 16, height: fh * 0.5 - gap }
        ins.top += fh * 0.5
      } else {
        box = { left: ins.left, top: ins.top, width: fw * 0.5 - gap, height: fh }
        ins.left += fw * 0.5
      }
      Object.assign(fig.style, { left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' })
    }
    stage.setInsets(ins)
    const free = { w: W - ins.left - ins.right, h: H - ins.top - ins.bottom }
    const changed = !lastFree || Math.abs(free.w / lastFree.w - 1) > 0.15 || Math.abs(free.h / lastFree.h - 1) > 0.15
    lastFree = free
    if (refit || changed) refitView()
  }
  function refitView() {
    if (tab === 'atlas') atlas?.frame()
    else if (vessels.current) vessels.setView(currentView)
  }
  let relayoutTimer = null
  function relayoutSoon(ms = 0) {
    clearTimeout(relayoutTimer)
    relayoutTimer = setTimeout(() => requestAnimationFrame(() => relayout()), ms)
  }
  // the label card lives in the left column on a desk, in the dock on a phone
  function placeChrome() {
    if (layout === 'desk') {
      if (labelEl.parentNode !== column) column.append(labelEl)
    } else if (labelEl.parentNode !== dock) dock.append(labelEl)
  }
  placeChrome()
  const onResize = () => {
    const was = layout
    layout = applyLayout()
    if (layout !== was) {
      placeChrome()
      setNav(false)
      if (layout === 'desk' && !drawerEl.classList.contains('open') && was !== 'desk' && window.innerWidth >= 1200) setDrawer(true)
      if (layout !== 'desk' && drawerEl.classList.contains('open')) setDrawer(false)
      renderQuality()
    }
    relayoutSoon(60)
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', () => setTimeout(onResize, 200))
  window.visualViewport?.addEventListener('resize', () => relayoutSoon(120))

  // ---- hooks (the verification surface in KIT.md)
  const currentObject = () =>
    tab === 'atlas' ? atlas?.plaque && { object: atlas.plaque.group, id: 'atlas' } : vessels.current && { object: vessels.current.result.object, id: vessels.current.artifact.id }
  hooks = installHooks({
    artifacts: catalog.ids,
    motifs: Object.keys(kit.MOTIFS),
    motifPresets: (name) => Object.keys(kit.MOTIFS[name]?.presets || {}),
    // artifact modules load lazily: these resolve once the module is in
    views: async (id) => Object.keys((await catalog.load(id))?.views || {}),
    viewRefs: async (id) => Object.fromEntries(Object.entries((await catalog.load(id))?.views || {}).filter(([, v]) => v.ref).map(([k, v]) => [k, v.ref])),
    catalog: () => catalog.loadAll().then((as) => as.map((a) => ({ id: a.id, title: a.title, order: a.order ?? 0 }))),
    metrics: () => {
      const cur = currentObject()
      if (!cur) return null
      return { id: cur.id, ...measure(cur.object), mesh: meshStats(cur.object), buildMs: vessels.timings[cur.id] }
    },
    timings: vessels.timings,
    kit,
    stage,
    frame: () => stage.frame(),
    async show(id, view) {
      if (tab !== 'vessels') await setTab('vessels', { want: id })
      await showVessel(id, { view })
      await stage.frame()
    },
    async setView(name) {
      selectView(name)
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
      const at = await getAtlas()
      building++
      try {
        await at.setMotif(name, preset)
      } finally {
        building--
      }
      await settle()
    },
    atlasStats: () => atlas?.plaque?.stats,
    setCompare: async (on) => {
      viewBar.setCompare(on)
      relayout({ refit: true })
      await stage.frame()
    },
    layout: () => layout,
  })

  // ---- first subject
  async function firstVessel() {
    return wanted || (await catalog.first())?.id
  }
  // the first vessel's module alone gates first paint; the rest of the catalog
  // (code only, nothing is built) arrives meanwhile for the switcher
  if (wanted) catalog.load(wanted).then(() => catalog.loadAll())
  else catalog.loadAll()

  document.body.dataset.tab = tab
  for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === tab))
  relayout()
  if (tab === 'atlas') {
    const at = await getAtlas()
    building++
    try {
      if (params.motif || params.preset) await at.setMotif(params.motif || 'taotie', params.preset)
      await at.activate()
    } finally {
      building--
    }
    relayout({ refit: true })
    await settle()
  } else {
    const r = await showVessel(await firstVessel(), { view: params.view })
    if (!r) throw new Error('no vessel to show')
  }
}
