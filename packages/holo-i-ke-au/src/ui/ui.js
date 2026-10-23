// The interface: the year control and the chapter tour that walks it, the
// event pins and their cards, layer toggles, a legend for the far view with
// the switch between its three modes (the chiefdoms, the land, and from 1848
// the Māhele), a hover card naming the moku under the pointer (in the land
// view, what the layers hold there; in the Māhele, the ahupuaʻa, its class
// and its awardee), and an about panel with the data's provenance, citing
// only what was read (card.js readable). Built on the ahupuaʻa app's cards
// and glass panels; words are kept for the cards.
//
// The legend and the hover card belong to the far views: both go as the
// camera closes in and the far view's overlays fade (farStrength), and the
// hover card goes too wherever a district is down. Once gone for the near
// zoom, the hover card stays gone until the camera is back out where the
// legend shows again, so it doesn't flicker at the edge of the rule.

// the far view's strength under which the hover card goes, and over which
// the legend (and the hover card with it) comes back
const NEAR_GONE = 0.05
const FAR_BACK = 0.25

import { $, h, esc } from './dom.js'
import { icon } from './icons.js'
import { landZoom, polityZoom } from '../app.js'
import { TimelineBar } from './timeline.js'
import { Pins } from './pins.js'
import { EventCard, readable } from './card.js'
import { Tour } from './tour.js'
import { CLASSES, MAHELE_YEAR } from '../overlay/mahele.js'

const MAHELE_TITLE = 'The land division of 1848, by ahupuaʻa'
const CLASS = new Map(CLASSES.map((k) => [k.id, k]))

export class UI {
  constructor(app) {
    this.app = app
    app.ui = this
    this.build()
    this.bind()
    app.updaters.push((dt) => this.update(dt))
    // Open on the first chapter's card, unless the address asks for a year
    // or a view of its own; a year alone opens on the whole chain, framed
    // as the home button frames it.
    if (!app.params.has('year') && !app.params.has('cam') && this.tour.chapters.length) {
      this.tour.begin()
      this.timeline.el.classList.add('invite')
    } else if (!app.params.has('cam')) {
      const v = this.tour.chainView()
      app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })
    }
  }

  build() {
    const app = this.app
    const root = h('div', { id: 'ui' })
    document.body.appendChild(root)
    this.root = root
    const archName = app.world.archPack.name
    this.brand = h('div', { class: 'brand' }, `<div class="brand-name">Holo i ke Au</div><div class="brand-sub"><span class="where">${esc(archName)}</span><span class="loading"></span></div>`)
    root.appendChild(this.brand)

    this.tools = h('div', { class: 'tools' })
    const tool = (id, ic, label, on) => h('button', { class: `tool${on ? ' on' : ''}`, 'data-tool': id, title: label, 'aria-label': label, 'aria-pressed': String(!!on) }, icon(ic, 20))
    this.tools.append(
      tool('lines', 'lines', 'Moku and ahupuaʻa boundaries', app.overlay.lines),
      // (the routes follow the story by themselves; this one shows them all)
      tool('routes', 'routes', 'Every voyage, fleet and ship at sea in these years', app.overlay.routes),
      tool('pins', 'pins', 'Events', app.overlay.pins),
      tool('home', 'home', 'The whole chain'),
      tool('help', 'help', 'About'),
      tool('full', 'expand', 'Full screen'),
    )
    root.appendChild(this.tools)

    // the far view's three modes, as a switch heading its legend: pressing
    // the one that is on turns the overlay off, as the old toggle did
    this.legend = h('div', { class: 'legend' })
    this.legend.innerHTML = `
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
        <button type="button" data-view="mahele" aria-pressed="false" title="${MAHELE_TITLE}">Māhele</button>
      </div>
      <div class="lg-body"></div>`
    this.legendBody = $('.lg-body', this.legend)
    this.legend.inert = true // (until the view is far enough out for it)
    root.appendChild(this.legend)
    this.inspector = h('div', { class: 'inspector' })
    root.appendChild(this.inspector)

    this.timeline = new TimelineBar(root, app, this)
    this.pins = new Pins(root, app, { onOpen: (ev) => this.openEvent(ev), onCluster: (evs) => this.openCluster(evs) })
    this.card = new EventCard(root, app, this)
    this.tour = new Tour(app, this)
    app.tour = this.tour
    this.tour.onChange((t) => this.timeline.refreshTour(t))
    // off the tour, what Next will do follows the slider
    app.timeline.onChange(() => this.timeline.refreshTour(this.tour))
    this.timeline.refreshTour(this.tour)

    this.help = h('div', { class: 'help hidden' })
    const credits = this.credits()
    this.help.innerHTML = `
      <div class="help-card">
        <button class="help-close" aria-label="Close">${icon('close', 18)}</button>
        <h2>Holo i ke Au</h2>
        <p><em>Holo i ke au</em>: sail on the current, into the era. <em>Au</em> is both a period of time and a current, and the title rides it.</p>
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists. From ${MAHELE_YEAR} it turns to the <b>Māhele</b> too: each ahupuaʻa in the class the land division gave it, crown, government or konohiki land, or mixed where the records give it more than one.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${credits ? `<h3>Data</h3><ul class="credits">${credits}</ul>` : ''}
        <div class="land-credits"></div>
        <div class="mahele-credits"></div>
      </div>`
    root.appendChild(this.help)
    this.refreshLegend()
  }

  /**
   * Whether a credit may be listed, by the rule the cards keep (card.js
   * readable): as sources.json has it, where it is one of those, else as it
   * stands (a layer a bake fetched).
   */
  creditable(s) {
    if (!this.sourceById) this.sourceById = new Map(this.app.data.sources.map((x) => [x.id, x]))
    return readable(this.sourceById.get(s.id) || s)
  }

  /** Provenance of the terrain and boundary data, from the manifest and the boundary files. */
  credits() {
    const d = this.app.data
    const seen = new Map()
    const add = (s) => {
      if (s && s.id && !seen.has(s.id) && this.creditable(s)) seen.set(s.id, s)
    }
    for (const p of d.packs) for (const s of p.sources || []) add(s)
    for (const s of d.moku?.sources || []) add(s)
    for (const s of d.ahupuaa?.sources || []) add(s)
    return creditList([...seen.values()])
  }

  /** And of the land layers, once their manifest is in: every source its methods cite. */
  landCredits() {
    const el = $('.land-credits', this.help)
    const m = this.app.land.manifest
    if (!el || !m || el.childElementCount) return
    const seen = new Map()
    for (const kf of Object.values(m.methods || {})) {
      for (const layer of Object.values(kf || {})) for (const s of layer?.sources || []) if (s?.id && /^https?:/.test(s.url || '') && !seen.has(s.id) && this.creditable(s)) seen.set(s.id, s)
    }
    if (seen.size) el.innerHTML = `<h3>Land layers</h3><ul class="credits">${creditList([...seen.values()])}</ul>`
  }

  /** And of the Māhele, once its file is in: the sources it was read from, as sources.json has them. */
  maheleCredits() {
    const el = $('.mahele-credits', this.help)
    const ids = this.app.mahele.sources
    if (!el || !ids || el.childElementCount) return
    const by = new Map(this.app.data.sources.map((x) => [x.id, x]))
    const list = [...ids].map((id) => by.get(id)).filter((s) => readable(s))
    if (list.length) el.innerHTML = `<h3>The Māhele</h3><ul class="credits">${creditList(list)}</ul>`
  }

  bind() {
    const app = this.app
    this.tools.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tool]')
      if (!b) return
      const t = b.dataset.tool
      if (t === 'help') this.help.classList.toggle('hidden')
      else if (t === 'full') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else document.documentElement.requestFullscreen?.().catch(() => {})
      } else if (t === 'home') {
        // the whole chain, beside the card if one is open
        const r = app.rig
        r.home = this.tour.chainView()
        r.flyTo({ target: r.home.target, distance: r.home.distance, yaw: r.home.yaw, pitch: r.home.pitch }, 3)
      } else if (t in app.overlay) {
        app.overlay[t] = !app.overlay[t]
        b.classList.toggle('on', app.overlay[t])
        b.setAttribute('aria-pressed', String(app.overlay[t]))
      }
    })
    this.legend.addEventListener('click', (e) => {
      const b = e.target.closest('[data-view]')
      if (!b || b.disabled) return
      const v = b.dataset.view
      // (the one lit is what is drawn: pressing it turns the overlay off)
      app.setView(app.farView === v ? null : v, { user: true })
    })
    app.onView(() => this.refreshLegend())
    app.land.onChange(() => {
      this.refreshLegend()
      this.landCredits()
    })
    app.mahele.onChange(() => {
      this.refreshLegend()
      this.maheleCredits()
      // (the file names the sources that make a step the Māhele's: a step already showing takes it up)
      const tour = this.tour
      if (tour.active && tour.event) tour.applyView(tour.event)
    })
    this.help.addEventListener('click', (e) => {
      if (e.target === this.help || e.target.closest('.help-close')) this.help.classList.add('hidden')
    })
    app.timeline.onChange(() => {
      const e = app.timeline.era
      // (and as the year crosses the Māhele, which falls inside an era)
      if (e !== this.legendEra || app.mahele.availableAt() !== this.legendMahele) this.refreshLegend()
    })
    const canvas = app.canvas
    let lastHover = 0
    canvas.addEventListener('pointermove', (e) => {
      if (e.buttons || e.pointerType === 'touch') return this.hover(null)
      const now = performance.now()
      if (now - lastHover < 70) return
      lastHover = now
      this.hover(e.clientX, e.clientY)
    })
    canvas.addEventListener('pointerleave', () => this.hover(null))
    canvas.addEventListener('pointerdown', () => this.hover(null))
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.help.classList.contains('hidden')) this.help.classList.add('hidden')
        else this.card.close()
        return
      }
      // (the slider takes its own arrows; a focused button takes its own space)
      if (e.target.closest?.('input, textarea, select') || e.altKey || e.ctrlKey || e.metaKey) return
      if (!this.help.classList.contains('hidden')) return
      const tour = this.tour
      if (e.key === 'ArrowRight' || (e.key === ' ' && !e.target.closest?.('button, a'))) {
        e.preventDefault()
        this.timeline.el.classList.remove('invite')
        tour.next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        tour.back()
      } else if (e.key === ',' || e.key === '<') tour.skip(-1)
      else if (e.key === '.' || e.key === '>') tour.skip(1)
    })
  }

  /** A pin: its card, and the tour moves to it, so Next carries on from there. */
  openEvent(ev) {
    this.tour.open(ev, { gentle: true })
  }

  /** A cluster: the list of its events, nothing flown. */
  openCluster(evs) {
    const tour = this.tour
    this.pins.activeEvent = tour.active ? tour.event : null
    this.card.openList(evs)
  }

  onCardClosed() {
    // the tour's own event keeps its pin lit while the tour is on it
    const tour = this.tour
    if (tour.active && tour.event) return
    this.pins.activeEvent = null
    this.pins.setStopPlace(null)
  }

  /** The viewer has taken the timeline (to position s): off the tour, and an era's card that no longer matches goes. */
  onScrub(s = this.app.timeline.s) {
    const tour = this.tour
    tour.leave()
    const tl = this.app.timeline
    if (this.card.mode === 'era' && this.card.chapter?.era !== tl.eraAt(s)) this.card.close()
    if (!this.card.ev) {
      this.pins.activeEvent = null
      this.pins.setStopPlace(null)
    }
  }

  /**
   * The part of the screen the scene can be seen in: below the title, above
   * the timeline, and beside the card (down the right on a wide screen) or
   * above it and below the legend's switch (a narrow one). The tour frames
   * into this. The legend's own place, otherwise, is a corner the whole
   * chain leaves empty, so the box doesn't give way to it.
   */
  freeBox() {
    const W = innerWidth
    const H = innerHeight
    const box = { x0: 16, y0: 72, x1: W - 16, y1: H - 16 }
    const tl = this.timeline.el
    if (!tl.hidden && tl.offsetHeight) box.y1 = Math.min(box.y1, tl.offsetTop - 14)
    const c = this.card.el
    this.syncCarded()
    if (this.card.isOpen && c.offsetWidth) {
      if (c.offsetLeft > W * 0.35) box.x1 = Math.min(box.x1, c.offsetLeft - 16)
      else {
        box.y1 = Math.min(box.y1, c.offsetTop - 12)
        // (and under the legend's switch, which a phone puts at the top while a card is up)
        const lg = this.legend
        if (lg.offsetHeight && lg.offsetTop < H / 3) box.y0 = Math.max(box.y0, lg.offsetTop + lg.offsetHeight + 6)
      }
    }
    if (box.y1 - box.y0 < 120) box.y1 = box.y0 + 120
    return box
  }

  /** Whether a card is up, as a class on the interface: a phone keeps only the legend's switch then (style.css). */
  syncCarded() {
    const on = this.card.isOpen
    if (on !== this.root.classList.contains('carded')) this.root.classList.toggle('carded', on)
  }

  /**
   * How strongly the far view's overlay shows at the camera's distance: the
   * land's in the land view, else the chiefdoms' (with no overlay chosen, the
   * chiefdoms' too: that is when its legend's switch would bring one back).
   */
  farStrength(d = this.app.rig.state.distance) {
    const v = this.app.farView
    return v === 'land' || v === 'mahele' ? landZoom(d) : polityZoom(d)
  }

  /** Whether the hover card may show: far enough out, no district down, and (once gone) back out where the legend is. */
  inspectorAllowed() {
    const app = this.app
    const k = this.farStrength()
    const district = !!(app.districts?.on || app.districts?.k > 0)
    if (district || k < NEAR_GONE) this.nearHeld = true
    else if (k > FAR_BACK) this.nearHeld = false
    return !this.nearHeld
  }

  hideInspector() {
    this.app.shared.uniforms.uHoverMoku.value = 0
    this.inspector.classList.remove('show')
    this.inspectorKey = null
  }

  hover(cx, cy) {
    const app = this.app
    const u = app.shared.uniforms
    if (cx === null || cx === undefined || !this.inspectorAllowed()) return this.hideInspector()
    const p = app.rig.pickGround(cx, cy)
    const m = p && app.world.metresAt(p.x, p.z) > 0 ? app.polity.mokuAt(p.x, p.z) : null
    // (in the land view the moku isn't lit in its polity's colour, which would
    // hide the layers under it; in the Māhele the shader's region map holds
    // classes, not moku, so nothing is lit; and close in, where the polity
    // colours have gone, it isn't lit either: the card names it)
    const fv = app.farView
    const landView = fv === 'land' && app.landK > 0.25
    const maheleView = fv === 'mahele' && app.regionOn === 'mahele' && app.polityK > 0.25
    const close = polityZoom(app.rig.state.distance) < 0.05
    u.uHoverMoku.value = m && !landView && !close && app.regionOn === 'chiefdoms' ? m.index : 0
    if (!m) {
      this.inspector.classList.remove('show')
      return
    }
    const v = landView ? app.land.valuesAt(p.x, p.z) : null
    const a = maheleView ? app.mahele.unitAt(p.x, p.z) : null
    const key = `${m.index}:${app.timeline.era?.id}:${v ? JSON.stringify(v) : ''}:${a ? a.gisId : ''}`
    if (this.inspectorKey !== key) {
      this.inspectorKey = key
      const holder = app.polity.holder(app.timeline.era, m)
      const row = (k, val) => `<div class="in-row"><span class="in-k">${k}</span>${val}</div>`
      this.inspector.innerHTML = a
        ? maheleCard(a, m, row)
        : `
        <div class="in-head"><b>${esc(m.name)}</b><span class="in-island">${esc(m.island || '')}</span></div>
        ${row('moku', holder ? `<span class="in-pol"><i style="background:${esc(holder.colour)}"></i>${esc(holder.name)}</span>` : '<span class="in-none">no polity recorded</span>')}
        ${v ? row('fields', share(v.cultivation)) + row('people', perKm2(v.people)) + row('forest', share(v.forest)) : ''}`
    }
    this.inspector.classList.add('show')
    const x = Math.min(innerWidth - 250, cx + 18)
    const y = Math.max(70, Math.min(innerHeight - 120, cy + 18))
    this.inspector.style.transform = `translate(${x}px, ${y}px)`
  }

  refreshLegend() {
    const app = this.app
    const e = app.timeline.era
    this.legendEra = e
    this.legendMahele = app.mahele.availableAt()
    // (the one lit is what the far view draws: the chiefdoms, before 1848, for a choice of the Māhele)
    const fv = app.farView
    for (const b of this.legend.querySelectorAll('[data-view]')) {
      b.setAttribute('aria-pressed', String(fv === b.dataset.view))
      b.classList.toggle('on', fv === b.dataset.view)
    }
    const landBtn = $('[data-view="land"]', this.legend)
    landBtn.disabled = app.land.available === false
    landBtn.title = landBtn.disabled ? 'No land layers in this data' : 'Cultivation, settlement and forest in the chosen year'
    const maheleBtn = $('[data-view="mahele"]', this.legend)
    maheleBtn.disabled = !this.legendMahele
    maheleBtn.title = app.mahele.available === false ? 'No Māhele in this data' : this.legendMahele ? MAHELE_TITLE : `The land division, from ${MAHELE_YEAR}`
    let body = ''
    if (fv === 'mahele') {
      // the ahupuaʻa of each class: on the island in view, or across them all
      const isl = this.islandInView()
      const n = app.mahele.counts(isl?.pack.id)
      if (n.all) {
        body = `<div class="lg-title">The Māhele of ${MAHELE_YEAR}</div>${CLASSES.map(
          (k) => `<div class="lg lg-mahele"><i style="background:${esc(k.colour)}"></i><b>${esc(k.name)}</b><em>${n.byClass[k.id].toLocaleString('en-US')}</em></div>`,
        ).join('')}<div class="lg-note">${esc(`${n.all.toLocaleString('en-US')} ahupuaʻa ${isl ? `on ${isl.pack.name}` : 'on all the islands'}`)}</div>`
      }
      this.legendIsland = isl?.pack.id ?? null
    } else if (fv === 'chiefdoms') {
      const ps = app.polity.politiesIn(e)
      if (ps.length) body = `<div class="lg-title">${esc(e?.label || '')}</div>${ps.map((p) => `<div class="lg"><i style="background:${esc(p.colour)}"></i><b>${esc(p.name)}</b></div>`).join('')}`
    } else if (fv === 'land') {
      const d = app.land.describe()
      // (and the works drawn with it on the island in view: features/works.js, and under cultivation,
      // what the keyframe nearest the year grows there, where the data says)
      const works = app.works?.legendRows() ?? []
      const grown = app.crops?.grown() ?? []
      this.legendLand = JSON.stringify([d, grown, works])
      if (d) {
        const from = d.years.length > 1 ? `between the ${d.years[0]} and ${d.years[1]} layers` : `the ${d.years[0]} layers`
        const note = !app.land.bound ? 'the layers are on their way' : d.early ? `${from}, thinned for the early centuries` : from
        body = `<div class="lg-title">${esc(e?.label || '')}</div>${d.layers
          .map((l) => `<div class="lg lg-land"><i class="sw-${l.id}"></i><b>${esc(l.name)}</b>${l.note ? `<em>${esc(l.note)}</em>` : ''}</div>${l.id === 'cultivation' && grown.length ? `<div class="lg-crops">${esc(grown.join(' · '))}</div>` : ''}`)
          .join('')}${works.map((w) => `<div class="lg lg-land lg-works"><i class="sw-${w.id}"></i><b>${esc(w.name)}</b></div>`).join('')}<div class="lg-note">${esc(note)}</div>`
      }
    }
    this.legendBody.innerHTML = body
  }

  setLoading(text) {
    $('.loading', this.brand).textContent = text || ''
  }

  update(dt) {
    const app = this.app
    const now = performance.now()
    this.timeline.update(dt)
    this.pins.update(app.overlay.pins)
    // the legend, and the switch on it, while the far view's overlays can
    // show; and the hover card, by the same rule (a card left up as the
    // camera flies in under a resting pointer goes with it)
    const far = this.farStrength() > FAR_BACK
    if (far !== this.legend.classList.contains('show')) {
      this.legend.classList.toggle('show', far)
      this.legend.inert = !far
    }
    if (!this.inspectorAllowed() && (this.inspector.classList.contains('show') || app.shared.uniforms.uHoverMoku.value)) this.hideInspector()
    this.syncCarded()
    // (which keyframes the land is drawn from moves with the year, and the
    // words arrive with the manifest)
    if (app.farView === 'land' && now - (this.landAt || 0) > 250) {
      this.landAt = now
      if (JSON.stringify([app.land.describe(), app.crops?.grown() ?? [], app.works?.legendRows() ?? []]) !== this.legendLand || !app.land.bound !== this.legendWaiting) {
        this.legendWaiting = !app.land.bound
        this.refreshLegend()
      }
    }
    if (now - (this.whereAt || 0) > 300) {
      this.whereAt = now
      // the name of the island under the camera once one fills the view
      const isl = this.islandInView()
      $('.where', this.brand).textContent = isl ? isl.pack.name : app.world.archPack.name
      // (and the Māhele's counts are that island's)
      if (app.farView === 'mahele' && (isl?.pack.id ?? null) !== this.legendIsland) this.refreshLegend()
    }
  }

  /** The island under the camera, once one fills the view; else null. */
  islandInView() {
    const s = this.app.rig.state
    return s.distance < 1400 ? this.app.world.islandAt(s.target.x, s.target.z) : null
  }
}

/**
 * The hover card over an ahupuaʻa in the Māhele: its name and island, its
 * moku, its class (a mixed one's classes named), the awardee as the record
 * spells the name, and a class given it later.
 */
function maheleCard(a, m, row) {
  const e = a.entry
  const k = CLASS.get(a.cls)
  const sw = (c) => `<i style="background:${esc(c.colour)}"></i>`
  let cls = `<span class="in-pol">${sw(k)}${esc(k.name)}</span>`
  if (a.cls === 'mixed') {
    const parts = [...new Set((e?.parts || []).map((p) => p.class))].map((c) => CLASS.get(c)).filter(Boolean)
    if (parts.length > 1) cls = `<span class="in-pol">${sw(k)}${esc(k.name)}</span><span class="in-v">${esc(parts.map((c) => c.name.toLowerCase()).join(' and '))}</span>`
  }
  const who = e && (a.cls === 'konohiki' || a.cls === 'mixed') ? [].concat(e.awardee || []).filter(Boolean) : []
  const later = (e?.later || []).map((l) => `${CLASS.get(l.class)?.name.toLowerCase() || l.class}, ${l.year}`)
  return `
    <div class="in-head"><b>${esc(a.name || 'Ahupuaʻa')}</b><span class="in-island">${esc(a.island || m.island || '')}</span></div>
    ${row('moku', `<span class="in-v">${esc(a.moku || m.name)}</span>`)}
    ${row('land', cls)}
    ${who.length ? row('awarded', `<span class="in-v">${esc(who.join(', '))}</span>`) : ''}
    ${later.length ? row('later', `<span class="in-v">${esc(later.join('; '))}</span>`) : ''}`
}

/** A share of the ground, for the hover card: "35%", "under 1%" or "none". */
function share(v) {
  const p = v * 100
  if (p < 0.5) return '<span class="in-none">none</span>'
  if (p < 1) return 'under 1%'
  return `${Math.round(p)}%`
}

/** People per km², to two figures, for the hover card. */
function perKm2(d) {
  if (d < 0.5) return '<span class="in-none">none</span>'
  const r = d < 10 ? Math.round(d) : Number(d.toPrecision(2))
  return `about ${r.toLocaleString('en-US')} a km²`
}

/** Sources as the about panel lists them: title (linked), licence, when fetched. */
function creditList(sources) {
  return sources
    .map((s) => {
      const t = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.id)}</a>` : esc(s.title || s.id)
      return `<li>${t}${s.licence ? ` <em>${esc(s.licence)}</em>` : ''}${s.fetched ? ` <em>fetched ${esc(s.fetched)}</em>` : ''}</li>`
    })
    .join('')
}
