// The interface on the table (ENGINEERING.md §11, DESIGN.md §§5.5–5.6): the
// clock and the chapter tour that walks it, the event pins and their cards,
// the names on the table driven in the same frame as the pins, the front's
// legend, the overlays' switches, a hover card naming what is under the
// pointer (the place, the front's land there on the date, the height or
// depth), an about panel, and the Sources and credits panel.
//
// The hooks the UI raises and never fulfils itself, so the integrator wires
// them to app.battle (they are no-ops against Stage 0's stub Battle):
//
//   ui.onEnter(ev)                 *Enter the battle* on a box event's card
//   ui.onTake(momentId)            *Take the controls* on the briefing (or a moment's stop)
//   ui.onWatch()                   *Watch* on the briefing
//   ui.onWatchOn()                 *Watch on* on the after-card
//   ui.onLeave()                   *Back to the table* on the after-card, and Esc in a box
//   ui.onRetry(momentId, from)     a restart point on the after-card ('start' | 'checkpoint')
//   ui.onPrefetch(ev)              a box event's card opened: its pack may start decoding
//   ui.onStep(dir)                 the tour's keys while a box is open (its own stops)
//
// and the ways in for the box's side: ui.openBriefing(data), ui.openAfter(data)
// (plain objects, briefing.js and after.js say their shape), ui.openCredits().
//
// Input arbitration (ENGINEERING §8): every key is read against app.mode.
// `table`: the tour's keys and Esc; `watch`: Esc closes the card, then
// leaves the box (onLeave), the arrows raise onStep; `flying`: Esc only
// (onLeave, which the integrator reads as an abort); `moment`: none.
//
// Adapted from holo-i-ke-au's ui/ui.js (b480c27): the build, the tools, the
// keys, the free box beside the card and the hover card's pattern are kept;
// the far view's chiefdoms and land legend, the moku inspector and the
// district logic are gone.

import { $, h, esc } from './dom.js'
import { icon } from './icons.js'
import { TimelineBar, dayLabel } from './timeline.js'
import { Pins } from './pins.js'
import { EventCard } from './card.js'
import { Tour } from './tour.js'
import { geometryPoint } from '../geo.js'

const noop = () => {}

export class UI {
  constructor(app) {
    this.app = app
    app.ui = this
    // the hooks (ENGINEERING §11): the integrator replaces these
    this.onEnter = noop
    this.onTake = noop
    this.onWatch = noop
    this.onWatchOn = noop
    this.onLeave = noop
    this.onRetry = noop
    this.onPrefetch = noop
    this.onStep = noop
    this.overlay = { front: true, routes: true, pins: true, labels: true }
    this.build()
    this.bind()
    app.table.labels.driven = true
    app.updaters.push((dt) => this.update(dt))
    // Open on the first chapter's card, unless the address asks for a date or
    // a view of its own.
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''))
    if (!hash.has('date') && !hash.has('cam') && !hash.has('battle') && this.tour.chapters.length) {
      this.tour.begin()
      this.timeline.el.classList.add('invite')
    }
  }

  build() {
    const app = this.app
    const root = h('div', { id: 'ui' })
    document.body.appendChild(root)
    this.root = root
    this.brand = h('div', { class: 'brand' }, `<div class="brand-name">Pacific Theatre</div><div class="brand-sub"><span class="where">A sand table of the record</span></div>`)
    root.appendChild(this.brand)

    this.tools = h('div', { class: 'tools' })
    const tool = (id, ic, label, on) => h('button', { class: `tool${on ? ' on' : ''}`, 'data-tool': id, title: label, 'aria-label': label, 'aria-pressed': String(!!on) }, icon(ic, 20))
    this.tools.append(
      tool('front', 'front', 'The front', this.overlay.front),
      tool('routes', 'routes', 'Fleets, strikes and lanes', this.overlay.routes),
      tool('pins', 'pins', 'Events', this.overlay.pins),
      tool('labels', 'labels', 'Names', this.overlay.labels),
      tool('home', 'home', 'The whole theatre'),
      tool('sources', 'sources', 'Sources and credits'),
      tool('help', 'help', 'About'),
      tool('full', 'expand', 'Full screen'),
    )
    root.appendChild(this.tools)

    this.legend = h('div', { class: 'legend', 'aria-live': 'polite' })
    root.appendChild(this.legend)
    this.inspector = h('div', { class: 'inspector' })
    root.appendChild(this.inspector)

    this.timeline = new TimelineBar(root, app, this)
    this.pins = new Pins(root, app, { onOpen: (ev) => this.openEvent(ev), onCluster: (evs) => this.openCluster(evs) })
    this.card = new EventCard(root, app, this)
    this.tour = new Tour(app, this)
    app.tour = this.tour
    this.tour.onChange((t) => this.timeline.refreshTour(t))
    // off the tour, what Next will do follows the slider; a date set from
    // outside the tour and the slider (the URL's #date, the tools) leaves the
    // tour as taking the slider does
    app.clock.onChange(() => {
      if (this.tour.active && !this.tour.setting && !this.timeline.tween && !this.timeline.dragging) this.onScrub()
      this.timeline.refreshTour(this.tour)
    })
    this.timeline.refreshTour(this.tour)

    this.help = h('div', { class: 'help hidden' })
    this.help.innerHTML = `
      <div class="help-card">
        <button class="help-close" aria-label="Close">${icon('close', 18)}</button>
        <h2>Pacific Theatre</h2>
        <p class="help-sub">The Pacific War, 7 December 1941 – 2 September 1945 <span lang="ja">太平洋戦争</span></p>
        <p>The table is the theatre in relief, from Ceylon to Hawaiʻi and from the Aleutians to Australia, the sea floor tinted by its depth. Move the date and the war moves on it: land held is coloured by who held it, hatched where it was contested or where Japan held only the cities and the railways between them; a dashed line rings the island groups Japan held; the declared lines of the war appear on their own dates. Each island carries a mark of who held it that day, and a dashed ring marks a garrison cut off behind the advance.</p>
        <p>Pins are the events of the weeks around the date; a number stands for several in one spot. Open one for its story, its time on its own clock, how sure the record is, where the tellings differ, and its sources. A source marked <span class="flag">verify</span> has not yet been read at the source.</p>
        <p><b>Next</b> walks the war a chapter at a time: each chapter opens with its card, then its events in order, the date and the camera moving to each. Look around as you like between steps; the clock is free too, and Next picks the walk up again from the chapter you are in. A battle with a box offers <b>Enter the battle</b>.</p>
        <div class="help-keys">
          <span><b>→ / Space</b> next</span><span><b>←</b> back</span><span><b>, .</b> chapter by chapter</span><span><b>Drag</b> move</span><span><b>Right-drag / Shift</b> turn and tilt</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly closer</span><span><b>Esc</b> close the card</span>
        </div>
      </div>`
    root.appendChild(this.help)
  }

  bind() {
    const app = this.app
    this.tools.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tool]')
      if (!b) return
      const t = b.dataset.tool
      if (t === 'help') this.help.classList.toggle('hidden')
      else if (t === 'sources') {
        if (this.card.mode === 'credits') this.card.close()
        else this.openCredits()
      } else if (t === 'full') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else document.documentElement.requestFullscreen?.().catch(() => {})
      } else if (t === 'home') {
        const v = this.tour.theatreView()
        app.table.rig.flyTo(v, 2.6)
      } else if (t in this.overlay) {
        this.overlay[t] = !this.overlay[t]
        b.classList.toggle('on', this.overlay[t])
        b.setAttribute('aria-pressed', String(this.overlay[t]))
        if (t === 'front') app.table.front.on = this.overlay.front
        if (t === 'routes') app.table.routes.visible = this.overlay.routes
      }
    })
    this.help.addEventListener('click', (e) => {
      if (e.target === this.help || e.target.closest('.help-close')) this.help.classList.add('hidden')
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
    addEventListener('keydown', (e) => this.key(e))
  }

  key(e) {
    const app = this.app
    const mode = app.mode
    if (mode === 'moment') return
    if (e.key === 'Escape') {
      if (!this.help.classList.contains('hidden')) return this.help.classList.add('hidden')
      if (this.card.isOpen) return this.card.close()
      if (mode === 'watch' || mode === 'flying') this.onLeave()
      return
    }
    if (mode === 'flying') return
    // (the slider takes its own arrows; a focused button takes its own space)
    if (e.target.closest?.('input, textarea, select') || e.altKey || e.ctrlKey || e.metaKey) return
    if (!this.help.classList.contains('hidden')) return
    const fwd = e.key === 'ArrowRight' || (e.key === ' ' && !e.target.closest?.('button, a'))
    if (mode === 'watch') {
      if (fwd || e.key === 'ArrowLeft') {
        e.preventDefault()
        this.onStep(fwd ? 1 : -1)
      }
      return
    }
    const tour = this.tour
    if (fwd) {
      e.preventDefault()
      this.timeline.el.classList.remove('invite')
      tour.next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      tour.back()
    } else if (e.key === ',' || e.key === '<') tour.skip(-1)
    else if (e.key === '.' || e.key === '>') tour.skip(1)
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

  /** The box's briefing (briefing.js says the shape). */
  openBriefing(data) {
    this.card.openBriefing(data)
  }

  /** A sortie's after-card (after.js says the shape). */
  openAfter(data) {
    this.card.openAfter(data)
  }

  openCredits() {
    this.card.openCredits()
  }

  onCardClosed() {
    // the tour's own event keeps its pin lit while the tour is on it
    const tour = this.tour
    if (tour.active && tour.event) return
    this.pins.activeEvent = null
    this.pins.setStopPlace(null)
    this.timeline.zone = null
    this.timeline.refresh()
    this.app.table.setFocus(null)
  }

  /** The viewer has taken the timeline: off the tour, and a chapter's card that no longer matches goes. */
  onScrub() {
    const tour = this.tour
    tour.leave()
    const clock = this.app.clock
    if (this.card.mode === 'chapter' && this.card.chapter?.chapter !== clock.chapterAt(clock.date)) this.card.close()
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
    if (!tl.hidden && tl.offsetHeight) box.y1 = Math.min(box.y1, tl.offsetTop - 30)
    const c = this.card.el
    if (this.card.isOpen && c.offsetWidth) {
      if (c.offsetLeft > W * 0.35) box.x1 = Math.min(box.x1, c.offsetLeft - 16)
      else box.y1 = Math.min(box.y1, c.offsetTop - 12)
    }
    if (box.y1 - box.y0 < 120) box.y1 = box.y0 + 120
    return box
  }

  hideInspector() {
    this.inspector.classList.remove('show')
    this.inspectorKey = null
  }

  /** The hover card: the nearest place to the pointer, the front's land there on the date, the height or depth. */
  hover(cx, cy) {
    const app = this.app
    const table = app.table
    if (cx === null || cx === undefined || app.active !== table || app.mode !== 'table') return this.hideInspector()
    const p = table.rig.pickGround(cx, cy)
    const b = table.ground.bounds
    if (!p || p.x < b.x0 || p.x > b.x1 || p.z < b.z0 || p.z > b.z1) return this.hideInspector()
    const m = table.ground.metresAt(p.x, p.z)
    // the nearest named place within a fingertip
    let best = null
    let bestD = 30 * 30
    const v = this._hv || (this._hv = p.clone())
    for (const pl of app.data.places) {
      const pt = geometryPoint(pl.geometry)
      if (!pt || pl.placePrecision === 'off') continue
      const [x, z] = app.data.proj.toWorld(pt)
      v.set(x, table.ground.heightAt(x, z), z).project(table.camera)
      if (v.z > 1) continue
      const dx = ((v.x + 1) / 2) * innerWidth - cx
      const dy = ((1 - v.y) / 2) * innerHeight - cy
      const d2 = dx * dx + dy * dy
      if (d2 < bestD) [best, bestD] = [pl, d2]
    }
    const front = m > 0 && this.overlay.front ? table.front.at(p.x, p.z) : null
    const isle = best ? table.front.isles?.find((s) => s.place === best) : null
    const [lon, lat] = app.data.proj.toLonLat(p.x, p.z)
    const key = `${best?.id}|${front?.name}|${front?.state}|${isle?.now?.by}|${Math.round(m / 10)}`
    if (this.inspectorKey !== key) {
      this.inspectorKey = key
      const row = (k, val) => `<div class="in-row"><span class="in-k">${k}</span>${val}</div>`
      const depth = m > 0 ? `${Math.round(m).toLocaleString('en-GB')} m` : `${Math.round(-m).toLocaleString('en-GB')} m deep`
      const where = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(((lon + 540) % 360) - 180).toFixed(1)}°${((lon + 540) % 360) - 180 >= 0 ? 'E' : 'W'}`
      const held = isle?.now ? `${isle.now.by === 'jp' ? 'held by Japan' : 'held by the Allies'}${isle.now.c !== null && app.clock.date >= isle.now.c ? ', cut off' : ''}` : null
      this.inspector.innerHTML = `
        ${best ? `<div class="in-head"><b>${esc(best.name)}</b>${best.ja?.kanji ? `<span class="in-ja" lang="ja">${esc(best.ja.kanji)}</span>` : ''}${best.today && best.today !== best.name ? `<span class="in-today">today ${esc(best.today)}</span>` : ''}</div>` : ''}
        ${held ? row('on the date', esc(held)) : ''}
        ${front ? row('the front', `<span class="in-pol"><i style="background:rgb(${front.colour.join(',')})"></i>${esc(front.pointsAndLines ? 'cities and railways held by Japan' : front.label)}</span>`) : ''}
        ${row(m > 0 ? 'height' : 'depth', esc(depth))}
        ${row('at', esc(where))}`
    }
    this.inspector.classList.add('show')
    const x = Math.min(innerWidth - 250, cx + 18)
    const y = Math.max(70, Math.min(innerHeight - 140, cy + 18))
    this.inspector.style.transform = `translate(${x}px, ${y}px)`
  }

  /**
   * Everything that eases in the interface, straight to where it is going
   * (app.settle(), for the tools): the clock's easing, and the names' and the
   * pins' fades, which skip their transitions for the next two frames so a
   * screenshot never catches a name fading out where the camera was.
   */
  settle() {
    this.timeline.finish()
    this.snap = 2
    document.body.classList.add('snap')
  }

  /** The front's legend: the states on the table now, the keyframe's date, the marks. */
  refreshLegend() {
    const lg = this.overlay.front ? this.app.table.front.legend() : null
    const key = JSON.stringify(lg && { k: lg.keyframe, b: lg.between, s: lg.states.map((s) => s.id), d: lg.declared, i: lg.isles })
    if (key === this.legendKey) return
    this.legendKey = key
    this.legend.classList.toggle('show', !!lg)
    if (!lg) {
      this.legend.innerHTML = ''
      return
    }
    const asOf = lg.between ? `between ${esc(dayLabel(Date.parse(lg.between[0])))} and ${esc(dayLabel(Date.parse(lg.between[1])))}` : `as of ${esc(dayLabel(Date.parse(lg.date)))}`
    const states = lg.states.map((s) => `<div class="lg"><i class="${s.hatch ? 'hatch' : ''}" style="--c:rgb(${s.colour.join(',')})"></i><b>${esc(s.label)}</b></div>`).join('')
    const pl = lg.pointsAndLines ? `<div class="lg"><i class="hatch" style="--c:rgb(170,58,46)"></i><b>cities and railways held by Japan</b></div>` : ''
    const per = lg.perimeter ? `<div class="lg"><i class="dash"></i><b>the island area Japan held</b></div>` : ''
    const dec = lg.declared.map((d) => `<div class="lg"><i class="dash long"></i><b>${esc(d.name)}</b>${d.ja ? ` <span lang="ja">${esc(typeof d.ja === 'string' ? d.ja : d.ja.kanji)}</span>` : ''}</div>`).join('')
    const isles = [lg.isles.jp && '<span class="lg-isle jp"></span>held by Japan', lg.isles.allied && '<span class="lg-isle al"></span>held by the Allies', lg.isles.cut && '<span class="lg-isle cut"></span>cut off'].filter(Boolean)
    this.legend.innerHTML = `
      <div class="lg-title">The front <span>${asOf}</span></div>
      ${states}${pl}${per}${dec}
      ${isles.length ? `<div class="lg-isles">${isles.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}`
  }

  update(dt) {
    const app = this.app
    // (the clock's easing on the wall clock under a software renderer, as the table's flights are)
    const now = performance.now()
    if (app.software && this._wall !== undefined) dt = Math.max(dt, Math.min(1, (now - this._wall) / 1000))
    this._wall = now
    const onTable = app.active === app.table
    if (this.snap && --this.snap === 0) document.body.classList.remove('snap')
    // the table's clock, legend and pins are the table's: hidden in a box
    if (this.timeline.el.hidden === onTable) this.timeline.el.hidden = !onTable
    // (the table's own switches stand aside in a box; the sources, the about and full screen stay)
    this.tools.classList.toggle('in-box', !onTable)
    this.brand.classList.toggle('in-box', !onTable)
    this.tools.classList.toggle('in-moment', app.mode === 'moment')
    this.timeline.update(dt)
    const fade = app.table.fade
    const rects = this.pins.update(onTable && this.overlay.pins && fade > 0.3)
    app.table.labels.update(rects, onTable && this.overlay.labels ? fade : 0)
    if (!onTable) this.legend.classList.remove('show')
    else if (performance.now() - (this.legendAt || 0) > 250) {
      this.legendAt = performance.now()
      this.refreshLegend()
      this.legend.style.opacity = fade.toFixed(2)
    }
  }
}
