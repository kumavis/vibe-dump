// The chapter tour: the war as a walk the viewer takes one Next at a time
// (DESIGN.md §5.5, §5.6).
//
// The chapters are chapters.json's, in order (the WarClock's), and in each
// chapter its events in order of their UTC instant (`when.from`, so a raid
// on Hawaiian time and a landing on Tokyo time sort as they happened). A
// chapter opens on its card, with the date set to the chapter's keyframe (the
// date its front shows) and the camera framing the chapter's events beside
// the card. Each Next after that sets the date to the next event's, flies to
// its first place at the distance its precision asks for, opens its card,
// lights its pin and keeps its routes on (TableScene.setFocus); an event with
// table stops walks them before moving on (an event is a tour). Back is the
// same walk in reverse. Nothing is written per chapter or per event: the
// sequence is the data's.
//
// The camera is the viewer's between steps; the timeline stays free;
// dragging it leaves the tour, and the next Next picks the tour up at the
// chapter holding the date it was left on.
//
// A box event's card offers *Enter the battle*, which raises
// ui.onEnter(ev) (the integrator wires it to app.battle); a box's own stops
// live in its battle.json and are walked inside the box, so the table walks
// only an event's `table` stops. Opening a box event raises ui.onPrefetch(ev)
// too, so the box's pack can start decoding before the click.
//
// Adapted from holo-i-ke-au's ui/tour.js (b480c27): Next, Back, the stops,
// leaving and resuming, the views fitted beside the card and the flight's
// timing are kept; the islands, districts and far-view modes are gone; years
// became dates in ms (R9 §2.7).

import { geometryPoint } from '../geo.js'
import { parseInstant } from '../time.js'
import { preferredPitch } from '../render/camera.js'
import { TABLE } from '../config.js'
import { eventSpan, placeOf } from './pins.js'
import { chapterShort } from './timeline.js'

// camera distance (km) for a place of each precision; a polygon place is fitted instead
export const ZOOM = { ex: 650, loc: 800, isl: 900, reg: 2600, sea: 2400, off: 9000 }
// the closest a chapter's view comes, km of ground across
const CHAPTER_MIN_SPAN = 2600

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/** An event's table stops (a `box` stop is the box's, walked inside it). */
export const tableStops = (ev) => (ev?.stops || []).filter((s) => !s.zoom || s.zoom === 'table')

export class Tour {
  constructor(app, ui) {
    this.app = app
    this.ui = ui
    this.places = new Map(app.data.places.map((p) => [p.id, p]))
    this.chapters = this.build()
    this.active = false
    this.chapter = 0
    this.step = -1
    this.stop = -1
    this.listeners = []
  }

  get rig() {
    return this.app.table.rig
  }

  /** The chapters, from the WarClock's, and the events by their `chapter` or, failing that, their date. */
  build() {
    const app = this.app
    const clock = app.clock
    const C = clock.chapters
    const index = new Map(C.map((c, i) => [c.id, i]))
    const numbered = C.filter((c) => c !== clock.prologue)
    const chapters = C.map((c, i) => ({
      chapter: c,
      index: i,
      number: c === clock.prologue ? 0 : numbered.indexOf(c) + 1,
      prologue: c === clock.prologue,
      name: chapterShort(c),
      events: [],
    }))
    if (!chapters.length) return chapters
    const strays = []
    const rows = chapters.map(() => [])
    app.data.events.forEach((ev, order) => {
      const span = eventSpan(ev)
      if (!span) return // (no date: no pin and no step; pins.js names it)
      let i = index.get(ev.chapter)
      if (i === undefined) {
        i = C.indexOf(clock.chapterAt(span[0]))
        strays.push(ev.id)
      }
      rows[i].push({ ev, start: span[0], order })
    })
    if (strays.length) app.warn(`events whose chapter is not in chapters.json, placed by date: ${strays.join(', ')}`)
    chapters.forEach((ch, i) => {
      ch.events = rows[i].sort((a, b) => a.start - b.start || a.order - b.order).map((r) => r.ev)
    })
    this.numbered = numbered.length
    return chapters
  }

  onChange(f) {
    this.listeners.push(f)
  }

  notify() {
    for (const f of this.listeners) f(this)
  }

  get current() {
    return this.chapters[this.chapter] || null
  }

  /** The event the tour stands at, or null on a chapter's card. */
  get event() {
    return this.step >= 0 ? this.current?.events[this.step] || null : null
  }

  /** Where it stands, for the tools: chapter and step (-1: the chapter's card) and stop (-1: the event's own view). */
  get state() {
    return { active: this.active, chapter: this.chapter, step: this.step, stop: this.stop, event: this.event?.id ?? null }
  }

  get atStart() {
    return this.active && this.chapter === 0 && this.step < 0
  }

  get atEnd() {
    const n = this.chapters.length
    if (!n) return true
    if (!this.active) return false
    const ch = this.current
    const ev = this.event
    const lastStop = ev ? tableStops(ev).length - 1 : -1
    return this.chapter === n - 1 && this.step === ch.events.length - 1 && this.stop >= lastStop
  }

  nearestChapter() {
    const clock = this.app.clock
    return clamp(clock.chapters.indexOf(clock.chapterAt(clock.date)), 0, this.chapters.length - 1)
  }

  /** The first chapter's card, the camera already there: how the app opens. */
  begin() {
    this.goTo(0, -1, { jump: true })
  }

  next() {
    if (!this.chapters.length) return
    if (!this.active) return this.goTo(this.nearestChapter(), -1)
    const ev = this.event
    if (ev && this.stop < tableStops(ev).length - 1) return this.goStop(this.stop + 1)
    if (this.step < this.current.events.length - 1) return this.goTo(this.chapter, this.step + 1)
    if (this.chapter < this.chapters.length - 1) return this.goTo(this.chapter + 1, -1)
  }

  back() {
    if (!this.chapters.length) return
    if (!this.active) return this.goTo(this.nearestChapter(), -1)
    if (this.event && this.stop > 0) return this.goStop(this.stop - 1)
    // from an event's first stop back to the event's own view
    if (this.event && this.stop === 0) return this.goTo(this.chapter, this.step)
    if (this.step > 0) return this.goTo(this.chapter, this.step - 1, { stop: 'last' })
    if (this.step === 0) return this.goTo(this.chapter, -1)
    if (this.chapter > 0) {
      const prev = this.chapters[this.chapter - 1]
      return this.goTo(this.chapter - 1, prev.events.length - 1, { stop: 'last' })
    }
  }

  /** `,` and `.`: a chapter at a time. Back from inside a chapter goes first to its own card. */
  skip(dir) {
    if (!this.chapters.length) return
    const at = this.active ? this.chapter : this.nearestChapter()
    const to = dir < 0 && this.active && this.step >= 0 ? at : at + dir
    if (to >= 0 && to < this.chapters.length) this.goTo(to, -1)
  }

  /** Off the tour: the viewer has taken the timeline. */
  leave() {
    if (!this.active) return
    this.active = false
    this.ui.timeline.zone = null
    this.app.table.setFocus(null)
    this.notify()
  }

  /** Where an event stands in the tour: [chapter, step], or null. */
  locate(ev) {
    for (let c = 0; c < this.chapters.length; c++) {
      const s = this.chapters[c].events.indexOf(ev)
      if (s >= 0) return [c, s]
    }
    return null
  }

  /**
   * An event opened from its pin or a list: the tour moves to it, so Next
   * carries on from there. From a pin it's `gentle`: the camera comes to the
   * place without diving in, and the date stays if the event is already in
   * the window.
   */
  open(ev, { gentle = false } = {}) {
    const at = this.locate(ev)
    if (at) return this.goTo(at[0], at[1], { gentle })
    this.ui.pins.activeEvent = ev
    this.ui.pins.setStopPlace(null)
    this.ui.timeline.zone = ev.when?.zone ?? null
    this.app.table.setFocus(ev)
    this.ui.card.open(ev)
    this.fly(this.gentleView(ev))
  }

  goTo(c, s = -1, { jump = false, gentle = false, stop = -1 } = {}) {
    const ch = this.chapters[c]
    if (!ch) return
    this.active = true
    this.chapter = c
    this.step = clamp(s, -1, ch.events.length - 1)
    this.stop = -1
    if (this.step < 0) this.showChapter(ch, jump)
    else {
      const ev = ch.events[this.step]
      const n = tableStops(ev).length
      if (stop === 'last' && n) return this.goStop(n - 1, { jump })
      this.showEvent(ev, { jump, gentle })
    }
    this.notify()
  }

  showChapter(ch, jump) {
    const ui = this.ui
    ui.timeline.zone = null
    ui.pins.activeEvent = null
    ui.pins.setStopPlace(null)
    this.app.table.setFocus(null)
    ui.card.openChapter(ch)
    const dur = this.fly(this.chapterView(ch), jump)
    this.setDate(this.chapterDate(ch), dur, jump)
  }

  showEvent(ev, { jump, gentle }) {
    const ui = this.ui
    ui.timeline.zone = ev.when?.zone ?? null
    if (ev.box) ui.onPrefetch?.(ev)
    ui.pins.activeEvent = ev
    ui.pins.setStopPlace(null)
    this.app.table.setFocus(ev)
    ui.card.open(ev)
    const dur = this.fly(gentle ? this.gentleView(ev) : this.eventView(ev), jump)
    const [a, b] = this.app.clock.windowAt()
    const span = eventSpan(ev)
    if (gentle && span && span[1] >= a && span[0] <= b) return
    this.setDate(this.stepDate(ev, this.current), dur, jump)
  }

  /** Walk to stop i of the tour's event (-1: back to the event's own card). */
  goStop(i, { jump = false } = {}) {
    const ev = this.event
    const stops = tableStops(ev)
    if (!ev || i < -1 || i >= stops.length) return
    const ui = this.ui
    this.active = true
    this.stop = i
    ui.pins.activeEvent = ev
    this.app.table.setFocus(ev)
    if (ui.card.ev !== ev) ui.card.open(ev)
    ui.card.setStop(i)
    const s = stops[i]
    const place = s ? this.places.get(s.place) : null
    const pt = place && geometryPoint(place.geometry)
    ui.pins.setStopPlace(pt ? place : null)
    if (s) {
      const view = pt ? this.placeView(place) : null
      const dur = this.fly(view, jump)
      if (s.when || s.date) {
        try {
          this.setDate(parseInstant(s.when?.from ?? s.date, { zone: ev.when?.zone }), dur, jump)
        } catch {
          /* (a stop without a usable date keeps the event's) */
        }
      }
    }
    this.notify()
  }

  /** The date a chapter's card shows: its keyframe (the date its front shows) when inside it, else its first day. */
  chapterDate(ch) {
    const c = ch.chapter
    try {
      const k = c.keyframe ? parseInstant(c.keyframe) : null
      if (k !== null && k >= c.fromMs && k < c.toMs) return k
    } catch {
      /* (an unreadable keyframe: the first day) */
    }
    return c.fromMs
  }

  /**
   * The date a step shows: the event's start when it falls in its chapter; a
   * long event that only overlaps the chapter shows the chapter's nearest
   * day; an event dated outside its chapter keeps its own date.
   */
  stepDate(ev, ch) {
    const span = eventSpan(ev)
    if (!span) return this.app.clock.date
    const { fromMs, toMs } = ch.chapter
    if (span[0] >= fromMs && span[0] < toMs) return span[0]
    if (span[1] >= fromMs && span[0] < toMs) return clamp(span[0], fromMs, toMs - 1)
    return span[0]
  }

  setDate(ms, dur, jump) {
    const bar = this.ui.timeline
    if (jump) {
      bar.tween = null
      this.app.clock.setDate(ms)
    } else bar.easeToDate(ms, clamp(dur * 0.8, 0.6, 2.4))
  }

  // --- views ------------------------------------------------------------------

  /** The tilt the viewer has added to the zoom's own, kept from step to step (within reason). */
  tilt() {
    const g = this.rig.goal
    return clamp(g.pitch - preferredPitch(g.distance, TABLE.pitchRange), -0.3, 0.3)
  }

  /** The whole table, beside the card. */
  theatreView() {
    const b = this.app.table.ground.bounds
    return this.rig.fit({ rect: b, yaw: 0, box: this.ui.freeBox(), pad: 1.0 })
  }

  /** A chapter's events framed beside its card (the whole table when they are few or spread across it). */
  chapterView(ch) {
    const pts = []
    for (const ev of ch.events) {
      const p = placeOf(ev, this.places)
      if (!p || p.placePrecision === 'off') continue
      pts.push(this.app.data.proj.toWorld(geometryPoint(p.geometry)))
    }
    const b = this.app.table.ground.bounds
    if (pts.length < 2) return this.theatreView()
    let r = { x0: Infinity, z0: Infinity, x1: -Infinity, z1: -Infinity }
    for (const [x, z] of pts) r = { x0: Math.min(r.x0, x), z0: Math.min(r.z0, z), x1: Math.max(r.x1, x), z1: Math.max(r.z1, z) }
    // never closer than a sea's worth of ground, and never past the table's edge
    const cx = (r.x0 + r.x1) / 2
    const cz = (r.z0 + r.z1) / 2
    const half = Math.max(r.x1 - r.x0, r.z1 - r.z0, CHAPTER_MIN_SPAN) / 2
    r = { x0: Math.max(b.x0, cx - half), x1: Math.min(b.x1, cx + half), z0: Math.max(b.z0, cz - half), z1: Math.min(b.z1, cz + half) }
    return this.rig.fit({ rect: r, yaw: 0, box: this.ui.freeBox(), pad: 1.25 })
  }

  /** A place at the distance its precision asks for, or its polygon framed. */
  placeView(place, { distance } = {}) {
    const proj = this.app.data.proj
    const g = place.geometry
    const box = this.ui.freeBox()
    if (place.placePrecision === 'off') return this.theatreView()
    if (!distance && (g?.type === 'Polygon' || g?.type === 'MultiPolygon')) {
      const rings = g.type === 'Polygon' ? [g.coordinates[0]] : g.coordinates.map((p) => p[0])
      let r = { x0: Infinity, z0: Infinity, x1: -Infinity, z1: -Infinity }
      for (const ring of rings) for (const c of ring) {
        const [x, z] = proj.toWorld(c)
        r = { x0: Math.min(r.x0, x), z0: Math.min(r.z0, z), x1: Math.max(r.x1, x), z1: Math.max(r.z1, z) }
      }
      return this.rig.fit({ rect: r, yaw: this.rig.goal.yaw, tilt: this.tilt(), box, pad: 1.6 })
    }
    const [x, z] = proj.toWorld(geometryPoint(g))
    const d = distance ?? ZOOM[place.placePrecision] ?? ZOOM.loc
    return this.rig.fit({ rect: { x0: x, x1: x, z0: z, z1: z }, distance: d, tilt: this.tilt(), box })
  }

  /** An event's step: a box event framed round its box, else its first place. */
  eventView(ev) {
    const table = this.app.table
    if (ev.box && this.app.data.boxById.has(ev.box)) {
      const box = this.app.data.boxById.get(ev.box)
      const r = box.pack.rect
      const pts = [
        [r.x0, r.z0],
        [r.x1, r.z0],
        [r.x1, r.z1],
        [r.x0, r.z1],
      ].map((p) => box.placement.toTable(p))
      const rect = { x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])), z0: Math.min(...pts.map((p) => p[1])), z1: Math.max(...pts.map((p) => p[1])) }
      // the box and its approaches: a few times its own size
      const cx = (rect.x0 + rect.x1) / 2
      const cz = (rect.z0 + rect.z1) / 2
      const half = Math.max(rect.x1 - rect.x0, rect.z1 - rect.z0) * 2.2
      return this.rig.fit({ rect: { x0: cx - half, x1: cx + half, z0: cz - half, z1: cz + half }, yaw: table.rig.goal.yaw, tilt: this.tilt(), box: this.ui.freeBox() })
    }
    const place = placeOf(ev, this.places)
    return place ? this.placeView(place) : null
  }

  /** From a pin: to the place, closer only as far as its precision asks and never farther out than now. */
  gentleView(ev) {
    const place = placeOf(ev, this.places)
    if (!place || place.placePrecision === 'off') return null
    const want = ZOOM[place.placePrecision] ?? ZOOM.loc
    return this.placeView(place, { distance: Math.min(this.rig.goal.distance, Math.max(want, 600)) })
  }

  /**
   * Fly the rig's own flight there and say how long it takes: short hops are
   * quick, a crossing of the theatre or a dive from the whole of it to an
   * island group takes longer, and nothing takes much over three and a half
   * seconds. Between distant places the rig rises mid-flight (its `hop`).
   */
  fly(view, jump = false) {
    if (!view) return 1
    const rig = this.rig
    if (jump) {
      rig.jump({ x: view.target.x, z: view.target.z, distance: view.distance, yaw: view.yaw, pitch: view.pitch })
      return 0
    }
    const g = rig.goal
    const travel = Math.hypot(g.target.x - view.target.x, g.target.z - view.target.z)
    const zoom = Math.abs(Math.log(view.distance / Math.max(1, g.distance)))
    const dur = clamp(1.1 + Math.sqrt(travel) * 0.02 + zoom * 0.28, 1.1, 3.5)
    rig.flyTo(view, dur)
    return dur
  }

  /**
   * "Chapter 3 of 7 · The turn · 2 of 9" (or "Prologue · …"), or what Next
   * will do from off the tour; `opening` while the tour stands on a chapter's
   * own card.
   */
  describe() {
    const ch = this.chapters.length ? this.chapters[this.active ? this.chapter : this.nearestChapter()] : null
    if (!ch) return null
    return {
      active: this.active,
      opening: this.active && this.step < 0,
      numbered: !ch.prologue,
      number: ch.number,
      of: this.numbered,
      chapter: ch.prologue ? 'Prologue' : `Chapter ${ch.number} of ${this.numbered}`,
      name: ch.name,
      step: this.active && this.step >= 0 ? `${this.step + 1} of ${ch.events.length}` : '',
    }
  }
}
