// The interface: the year control and the chapter tour that walks it, the
// event pins and their cards, layer toggles, a legend for the far view with
// the switch between its two modes (the chiefdoms, the land), a hover card
// naming the moku under the pointer (and in the land view, what the layers
// hold there), and an about panel with the data's provenance. Built on the
// ahupuaʻa app's cards and glass panels; words are kept for the cards.
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
import { EventCard } from './card.js'
import { Tour } from './tour.js'

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

    // the far view's two modes, as a switch heading its legend: pressing the
    // one that is on turns the overlay off, as the old toggle did
    this.legend = h('div', { class: 'legend' })
    this.legend.innerHTML = `
      <div class="lg-switch" role="group" aria-label="What the far view shows">
        <button type="button" data-view="chiefdoms" aria-pressed="false" title="Who held each moku">Chiefdoms</button>
        <button type="button" data-view="land" aria-pressed="false" title="Cultivation, settlement and forest in the chosen year">Land</button>
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
        <p>The Hawaiian Islands from real terrain, across the eras from the first canoes to 1898. Far out, each moku takes the colour of the chiefdom or kingdom that held it; close in, the boundaries of moku and ahupuaʻa lie on the land. Pins are events of the chosen era: open one for its story, how sure the record is, and its sources. A number stands for several events in one spot; open it for the list. A source marked <span class="flag">verify</span> has not yet been read at the source.</p>
        <p>The switch on the legend turns the far view from the <b>Chiefdoms</b> to the <b>Land</b>: where it was cultivated, where people lived and how many, and the native forest, in the chosen year, blended between layers made for 1778, 1853, 1896 and now. A layer marked <em>modelled</em> was drawn by a written rule where no map of its time exists.</p>
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${credits ? `<h3>Data</h3><ul class="credits">${credits}</ul>` : ''}
        <div class="land-credits"></div>
      </div>`
    root.appendChild(this.help)
    this.refreshLegend()
  }

  /** Provenance of the terrain and boundary data, from the manifest and the boundary files. */
  credits() {
    const d = this.app.data
    const seen = new Map()
    const add = (s) => {
      if (s && s.id && !seen.has(s.id)) seen.set(s.id, s)
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
      for (const layer of Object.values(kf || {})) for (const s of layer?.sources || []) if (s?.id && /^https?:/.test(s.url || '') && !seen.has(s.id)) seen.set(s.id, s)
    }
    if (seen.size) el.innerHTML = `<h3>Land layers</h3><ul class="credits">${creditList([...seen.values()])}</ul>`
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
      app.setView(app.view === v ? null : v, { user: true })
    })
    app.onView(() => this.refreshLegend())
    app.land.onChange(() => {
      this.refreshLegend()
      this.landCredits()
    })
    this.help.addEventListener('click', (e) => {
      if (e.target === this.help || e.target.closest('.help-close')) this.help.classList.add('hidden')
    })
    app.timeline.onChange(() => {
      const e = app.timeline.era
      if (e !== this.legendEra) this.refreshLegend()
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
    if (this.card.mode === 'era' && this.card.chapter?.era !== tl.eras[Math.round(Math.max(0, Math.min(tl.max, s)))]) this.card.close()
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
    return this.app.view === 'land' ? landZoom(d) : polityZoom(d)
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
    // hide the layers under it; and close in, where the polity colours have
    // gone, it isn't lit either: the card names it)
    const landView = app.view === 'land' && app.landK > 0.25
    const close = polityZoom(app.rig.state.distance) < 0.05
    u.uHoverMoku.value = m && !landView && !close ? m.index : 0
    if (!m) {
      this.inspector.classList.remove('show')
      return
    }
    const v = landView ? app.land.valuesAt(p.x, p.z) : null
    const key = `${m.index}:${app.timeline.era?.id}:${v ? JSON.stringify(v) : ''}`
    if (this.inspectorKey !== key) {
      this.inspectorKey = key
      const holder = app.polity.holder(app.timeline.era, m)
      const row = (k, val) => `<div class="in-row"><span class="in-k">${k}</span>${val}</div>`
      this.inspector.innerHTML = `
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
    for (const b of this.legend.querySelectorAll('[data-view]')) {
      b.setAttribute('aria-pressed', String(app.view === b.dataset.view))
      b.classList.toggle('on', app.view === b.dataset.view)
    }
    const landBtn = $('[data-view="land"]', this.legend)
    landBtn.disabled = app.land.available === false
    landBtn.title = landBtn.disabled ? 'No land layers in this data' : 'Cultivation, settlement and forest in the chosen year'
    let body = ''
    if (app.view === 'chiefdoms') {
      const ps = app.polity.politiesIn(e)
      if (ps.length) body = `<div class="lg-title">${esc(e?.label || '')}</div>${ps.map((p) => `<div class="lg"><i style="background:${esc(p.colour)}"></i><b>${esc(p.name)}</b></div>`).join('')}`
    } else if (app.view === 'land') {
      const d = app.land.describe()
      this.legendLand = JSON.stringify(d)
      if (d) {
        const from = d.years.length > 1 ? `between the ${d.years[0]} and ${d.years[1]} layers` : `the ${d.years[0]} layers`
        const note = !app.land.bound ? 'the layers are on their way' : d.early ? `${from}, thinned for the early centuries` : from
        body = `<div class="lg-title">${esc(e?.label || '')}</div>${d.layers
          .map((l) => `<div class="lg lg-land"><i class="sw-${l.id}"></i><b>${esc(l.name)}</b>${l.note ? `<em>${esc(l.note)}</em>` : ''}</div>`)
          .join('')}<div class="lg-note">${esc(note)}</div>`
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
    if (app.view === 'land' && now - (this.landAt || 0) > 250) {
      this.landAt = now
      if (JSON.stringify(app.land.describe()) !== this.legendLand || !app.land.bound !== this.legendWaiting) {
        this.legendWaiting = !app.land.bound
        this.refreshLegend()
      }
    }
    if (now - (this.whereAt || 0) > 300) {
      this.whereAt = now
      // the name of the island under the camera once one fills the view
      const t = app.rig.state.target
      const isl = app.rig.state.distance < 1400 ? app.world.islandAt(t.x, t.z) : null
      $('.where', this.brand).textContent = isl ? isl.pack.name : app.world.archPack.name
    }
  }
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
