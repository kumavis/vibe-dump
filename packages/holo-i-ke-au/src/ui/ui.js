// The interface: the year control and the chapter tour that walks it, the
// event pins and their cards, layer toggles, a legend for the polity overlay,
// a hover card naming the moku under the pointer, and an about panel with
// the data's provenance. Built on the ahupuaʻa app's cards and glass panels;
// words are kept for the cards.

import { $, h, esc } from './dom.js'
import { icon } from './icons.js'
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
    // or a view of its own.
    if (!app.params.has('year') && !app.params.has('cam') && this.tour.chapters.length) {
      this.tour.begin()
      this.timeline.el.classList.add('invite')
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
      tool('polity', 'polity', 'Who holds each moku', app.overlay.polity),
      tool('lines', 'lines', 'Moku and ahupuaʻa boundaries', app.overlay.lines),
      tool('pins', 'pins', 'Events', app.overlay.pins),
      tool('home', 'home', 'The whole chain'),
      tool('help', 'help', 'About'),
      tool('full', 'expand', 'Full screen'),
    )
    root.appendChild(this.tools)

    this.legend = h('div', { class: 'legend' })
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
        <p><b>Next</b> walks the story an era at a time: each era opens with its card, then its events in order, the year and the camera moving to each. Look around as you like between steps; the timeline is free too, and Next picks the story up again from the nearest era.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> era by era</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span>
        </div>
        ${credits ? `<h3>Data</h3><ul class="credits">${credits}</ul>` : ''}
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
    return [...seen.values()]
      .map((s) => {
        const t = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.id)}</a>` : esc(s.title || s.id)
        return `<li>${t}${s.licence ? ` <em>${esc(s.licence)}</em>` : ''}${s.fetched ? ` <em>fetched ${esc(s.fetched)}</em>` : ''}</li>`
      })
      .join('')
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
   * above it (along the bottom on a narrow one). The tour frames into this.
   */
  freeBox() {
    const W = innerWidth
    const H = innerHeight
    const box = { x0: 16, y0: 72, x1: W - 16, y1: H - 16 }
    const tl = this.timeline.el
    if (!tl.hidden && tl.offsetHeight) box.y1 = Math.min(box.y1, tl.offsetTop - 14)
    const c = this.card.el
    if (this.card.isOpen && c.offsetWidth) {
      if (c.offsetLeft > W * 0.35) box.x1 = Math.min(box.x1, c.offsetLeft - 16)
      else box.y1 = Math.min(box.y1, c.offsetTop - 12)
    }
    if (box.y1 - box.y0 < 120) box.y1 = box.y0 + 120
    return box
  }

  hover(cx, cy) {
    const app = this.app
    const u = app.shared.uniforms
    if (cx === null || cx === undefined) {
      u.uHoverMoku.value = 0
      this.inspector.classList.remove('show')
      return
    }
    const p = app.rig.pickGround(cx, cy)
    const m = p && app.world.metresAt(p.x, p.z) > 0 ? app.polity.mokuAt(p.x, p.z) : null
    u.uHoverMoku.value = m ? m.index : 0
    if (!m) {
      this.inspector.classList.remove('show')
      return
    }
    if (this.inspectorKey !== `${m.index}:${app.timeline.era?.id}`) {
      this.inspectorKey = `${m.index}:${app.timeline.era?.id}`
      const holder = app.polity.holder(app.timeline.era, m)
      this.inspector.innerHTML = `
        <div class="in-head"><b>${esc(m.name)}</b><span class="in-island">${esc(m.island || '')}</span></div>
        <div class="in-row"><span class="in-k">moku</span>${holder ? `<span class="in-pol"><i style="background:${esc(holder.colour)}"></i>${esc(holder.name)}</span>` : '<span class="in-none">no polity recorded</span>'}</div>`
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
    const ps = app.polity.politiesIn(e)
    this.legend.innerHTML = ps.length
      ? `<div class="lg-title">${esc(e?.label || '')}</div>${ps.map((p) => `<div class="lg"><i style="background:${esc(p.colour)}"></i><b>${esc(p.name)}</b></div>`).join('')}`
      : ''
  }

  setLoading(text) {
    $('.loading', this.brand).textContent = text || ''
  }

  update(dt) {
    const app = this.app
    this.timeline.update(dt)
    this.pins.update(app.overlay.pins)
    this.legend.classList.toggle('show', app.overlay.polity && app.polityK > 0.25 && this.legend.innerHTML !== '')
    const now = performance.now()
    if (now - (this.whereAt || 0) > 300) {
      this.whereAt = now
      // the name of the island under the camera once one fills the view
      const t = app.rig.state.target
      const isl = app.rig.state.distance < 1400 ? app.world.islandAt(t.x, t.z) : null
      $('.where', this.brand).textContent = isl ? isl.pack.name : app.world.archPack.name
    }
  }
}
