// The chapter tour: history as a walk the viewer takes one Next at a time.
//
// The chapters are the eras of eras.json, in order, and in each chapter that
// era's events in date order (`when.from`). A chapter opens on its era's
// card, with the year set to the era's and the camera on the whole chain, or
// on the one island where the era's events gather when they do. Each Next
// after that sets the year to the next event's date, flies to its first place
// at the deepest zoom it asks for, opens its card and lights its pin; an
// event with stops walks them before moving on (DESIGN.md §5.6, an event is a
// tour). Back is the same walk in reverse. Nothing is written per chapter or
// per event: the sequence is the data's.
//
// The camera is the viewer's between steps: they can zoom and look around,
// and the next step flies from wherever they are. The timeline stays free;
// dragging it leaves the tour, and the next Next picks the tour up at the
// chapter nearest the year it was left on.
//
// Each step also picks what the far view shows, by the event's kind: the
// land for laws, epidemics and restorations (what happened to the land and
// the people on it), the chiefdoms for everything else, an era's own card
// included. An event may name its view outright (`view: "land"`). Once the
// viewer has used the switch themselves, the tour leaves it alone.

import { geometryPoint } from '../geo.js'
import { eventSpan, eventStart } from '../time.js'
import { preferredPitch } from '../render/camera.js'

// camera distance for DATA.md's zooms; `island` frames the whole island
// instead, where the place has one
export const ZOOM = { far: 2600, island: 520, near: 70 }
const DEPTH = { far: 0, island: 1, near: 2 }

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// the kinds (DATA.md §4) whose story is the land; every other kind, and an
// era's card, shows the chiefdoms
export const LAND_KINDS = new Set(['law', 'epidemic', 'restoration'])

/** The far view a step asks for: an event's own `view`, else by its kind; null is an era's card. */
export function viewFor(ev) {
  if (ev?.view === 'land' || ev?.view === 'chiefdoms') return ev.view
  return ev && LAND_KINDS.has(ev.kind) ? 'land' : 'chiefdoms'
}

/** The name a chapter goes by: "in the time of Kahekili and the rise of Kamehameha" → "Kahekili". */
export function chapterName(era) {
  if (era.short) return era.short
  return String(era.label || era.id)
    .replace(/^in the time of\s+/i, '')
    .split(/,| and the /)[0]
    .trim()
}

/** The deepest of an event's zooms (DATA.md §4 lists them shallow to deep). */
export function deepestZoom(zooms) {
  let best = null
  for (const z of zooms || []) if (z in DEPTH && (best === null || DEPTH[z] > DEPTH[best])) best = z
  return best || 'island'
}

export class Tour {
  constructor(app, ui) {
    this.app = app
    this.ui = ui
    this.places = new Map(app.data.places.map((p) => [p.id, p]))
    this.islands = new Map(app.data.packs.filter((p) => p !== app.world.archPack).map((p) => [p.id, p]))
    this.chapters = this.build()
    this.active = false
    this.chapter = 0
    this.step = -1
    this.stop = -1
    this.listeners = []
  }

  /** The chapters, from the eras and the events' own `era`. */
  build() {
    const app = this.app
    const tl = app.timeline
    const index = new Map(tl.eras.map((e, i) => [e.id, i]))
    const chapters = tl.eras.map((era, i) => ({ era, index: i, name: chapterName(era), events: [], island: null }))
    if (!chapters.length) return chapters
    const strays = []
    const rows = chapters.map(() => [])
    app.data.events.forEach((ev, order) => {
      const start = eventStart(ev)
      if (start === null) return // (no date: no pin and no step; pins.js names it)
      let i = index.get(ev.era)
      if (i === undefined) {
        // an era that isn't in eras.json: the chapter its date falls in
        i = Math.round(tl.sAtYear(start))
        strays.push(ev.id)
      }
      rows[i].push({ ev, start, order })
    })
    if (strays.length) app.warn(`events whose era is not in eras.json, placed in a chapter by date: ${strays.join(', ')}`)
    chapters.forEach((ch, i) => {
      ch.events = rows[i].sort((a, b) => a.start - b.start || a.order - b.order).map((r) => r.ev)
      ch.island = this.gathering(ch.events)
    })
    return chapters
  }

  /**
   * The island a chapter's events gather on, if they do: most of them (seven
   * in ten, and at least two) have their first place there. Otherwise null,
   * and the chapter opens on the whole chain, which is also where the polity
   * colours read best.
   */
  gathering(events) {
    const count = new Map()
    let placed = 0
    for (const ev of events) {
      const p = this.placeOf(ev)
      if (!p) continue
      placed++
      if (p.island && this.islands.has(p.island)) count.set(p.island, (count.get(p.island) || 0) + 1)
    }
    let best = null
    let n = 0
    for (const [id, c] of count) if (c > n) [best, n] = [id, c]
    return best && n >= 2 && n >= placed * 0.7 ? best : null
  }

  /** An event's first place that can be put on the map. */
  placeOf(ev) {
    for (const w of ev.where || []) {
      const p = this.places.get(w.place)
      if (p && geometryPoint(p.geometry)) return p
    }
    return null
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

  /** The event the tour stands at, or null on an era's card. */
  get event() {
    return this.step >= 0 ? this.current?.events[this.step] || null : null
  }

  /** Where it stands, for the tools: chapter and step (-1: the era's card) and stop (-1: the event's own view). */
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
    const lastStop = ev ? (ev.stops?.length || 0) - 1 : -1
    return this.chapter === n - 1 && this.step === ch.events.length - 1 && this.stop >= lastStop
  }

  nearestChapter() {
    return clamp(Math.round(this.app.timeline.s), 0, this.chapters.length - 1)
  }

  /** The first chapter's card, the camera already there: how the app opens. */
  begin() {
    this.goTo(0, -1, { jump: true })
  }

  next() {
    if (!this.chapters.length) return
    if (!this.active) return this.goTo(this.nearestChapter(), -1)
    const ev = this.event
    if (ev && this.stop < (ev.stops?.length || 0) - 1) return this.goStop(this.stop + 1)
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
   * place without diving in, and the year stays if the event is already in it.
   */
  open(ev, { gentle = false } = {}) {
    const at = this.locate(ev)
    if (at) return this.goTo(at[0], at[1], { gentle })
    this.ui.pins.activeEvent = ev
    this.ui.pins.setStopPlace(null)
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
    if (this.step < 0) this.showEra(ch, jump)
    else {
      const ev = ch.events[this.step]
      const n = ev.stops?.length || 0
      if (stop === 'last' && n) return this.goStop(n - 1, { jump })
      this.showEvent(ev, { jump, gentle })
    }
    this.notify()
  }

  /** The step's view, unless the viewer has chosen their own. */
  applyView(ev) {
    if (!this.app.viewChosen) this.app.setView(viewFor(ev))
  }

  showEra(ch, jump) {
    const ui = this.ui
    this.applyView(null)
    ui.pins.activeEvent = null
    ui.pins.setStopPlace(null)
    ui.card.openEra(ch)
    const view = ch.island ? this.islandView(ch.island, this.homeYaw()) : this.chainView()
    this.setS(ch.index, this.fly(view, jump), jump)
  }

  showEvent(ev, { jump, gentle }) {
    const ui = this.ui
    this.applyView(ev)
    this.prefetch(ev)
    ui.pins.activeEvent = ev
    ui.pins.setStopPlace(null)
    ui.card.open(ev)
    const dur = this.fly(gentle ? this.gentleView(ev) : this.eventView(ev), jump)
    const tl = this.app.timeline
    const [a, b] = tl.window
    const span = eventSpan(ev)
    if (gentle && span && span[1] >= a && span[0] <= b) return
    this.setYear(this.stepYear(ev, this.current), dur, jump)
  }

  /** Walk to stop i of the tour's event (-1: back to the event's own card). */
  goStop(i, { jump = false } = {}) {
    const ev = this.event
    const stops = ev?.stops || []
    if (!ev || i < -1 || i >= stops.length) return
    const ui = this.ui
    this.active = true
    this.stop = i
    this.applyView(ev)
    ui.pins.activeEvent = ev
    if (ui.card.ev !== ev) ui.card.open(ev)
    ui.card.setStop(i)
    const s = stops[i]
    const place = s ? this.places.get(s.place) : null
    const pt = place && geometryPoint(place.geometry)
    ui.pins.setStopPlace(pt ? place : null)
    this.prefetch(ev)
    if (s) {
      // a stop's own camera, if it has one; else its place at its zoom
      const view = pt ? (s.camera ? this.cameraView(place, s.camera) : this.pointView(place, ZOOM[s.zoom] ?? ZOOM.island)) : null
      const dur = this.fly(view, jump)
      if (Number.isFinite(s.year)) this.setYear(s.year, dur, jump)
    }
    this.notify()
  }

  /**
   * An event that walks into a district: start its pack streaming as soon as
   * the event is opened (data/district.js decodes it in a worker), so it is
   * down when the walk gets there.
   */
  prefetch(ev) {
    const D = this.app.districts
    if (!D) return
    for (const s of ev?.stops || []) {
      const p = this.places.get(s.place)
      const pt = p && geometryPoint(p.geometry)
      if (!pt || s.zoom === 'far') continue
      const [x, z] = this.app.data.proj.toWorld(pt)
      if (D.prefetch(x, z)) return
    }
  }

  /**
   * The year a step shows. An event's own date when it falls in its chapter's
   * stretch of the timeline; a long event that only overlaps it (the
   * sandalwood trade, the depopulation) shows the point of its span nearest
   * the era's year, so the chapter's map stays on screen; an event dated
   * outside its era altogether keeps its own date, and the timeline says so.
   */
  stepYear(ev, ch) {
    const tl = this.app.timeline
    const start = eventStart(ev)
    const span = eventSpan(ev) || [start, start]
    const wa = tl.yearAt(ch.index - 0.5)
    const wb = tl.yearAt(ch.index + 0.5)
    if (start >= wa && start <= wb) return start
    if (span[1] >= wa && span[0] <= wb) return clamp(ch.era.year, Math.max(span[0], wa), Math.min(span[1], wb))
    return start
  }

  setYear(y, dur, jump) {
    this.setS(this.app.timeline.sAtYear(y), dur, jump)
  }

  setS(s, dur, jump) {
    const bar = this.ui.timeline
    if (jump) {
      bar.tween = null
      this.app.timeline.set(s)
    } else bar.easeTo(s, clamp(dur * 0.8, 0.6, 2.4))
  }

  // --- views ------------------------------------------------------------------

  /** North up, or turned down the screen's long side when the free part of it is portrait (as rig.homeView). */
  homeYaw(box = this.ui.freeBox()) {
    return (box.x1 - box.x0) / Math.max(1, box.y1 - box.y0) < 0.85 ? 1.1 : 0
  }

  /** The tilt the viewer has added to the zoom's own, kept from step to step (within reason). */
  tilt() {
    const g = this.app.rig.goal
    return clamp(g.pitch - preferredPitch(g.distance), -0.3, 0.3)
  }

  /** The whole chain, from Niʻihau to Hawaiʻi, beside the card. */
  chainView() {
    const box = this.ui.freeBox()
    let r = null
    for (const p of this.islands.values()) {
      const q = p.rect
      r = r ? { x0: Math.min(r.x0, q.x0), z0: Math.min(r.z0, q.z0), x1: Math.max(r.x1, q.x1), z1: Math.max(r.z1, q.z1) } : { ...q }
    }
    return this.app.rig.fit({ rect: r || this.app.world.bounds, yaw: this.homeYaw(box), box })
  }

  islandView(id, yaw = this.app.rig.goal.yaw, tilt = 0) {
    const pack = this.islands.get(id)
    return this.app.rig.fit({ rect: pack.rect, yaw, tilt, box: this.ui.freeBox() })
  }

  pointView(place, distance, { towardChain = 0 } = {}) {
    let [x, z] = this.app.data.proj.toWorld(geometryPoint(place.geometry))
    if (towardChain) {
      // lean toward the middle of the chain, so a far view shows the place
      // among its neighbours, not at the middle of an empty sea
      const b = this.app.world.bounds
      const dx = (b.x0 + b.x1) / 2 - x
      const dz = (b.z0 + b.z1) / 2 - z
      const k = Math.min(towardChain, 900 / Math.max(1, Math.hypot(dx, dz)))
      x += dx * k
      z += dz * k
    }
    return this.app.rig.fit({ rect: { x0: x, x1: x, z0: z, z1: z }, distance, tilt: this.tilt(), box: this.ui.freeBox() })
  }

  /**
   * A stop's own camera (DATA.md "District packs"): its place seen from
   * `distance` world units, looking toward `bearing` (compass degrees), at
   * `pitch` a fraction of a right angle (0 along the horizon, 1 straight
   * down), slid so the place stands in the middle of the screen beside the
   * card. The rig's yaw is the camera's bearing from its target turned about,
   * so looking toward north is yaw 0 and toward east is −90°.
   */
  cameraView(place, cam) {
    const [x, z] = this.app.data.proj.toWorld(geometryPoint(place.geometry))
    return this.app.rig.fit({
      rect: { x0: x, x1: x, z0: z, z1: z },
      distance: cam.distance,
      yaw: (-cam.bearing * Math.PI) / 180,
      pitch: (cam.pitch * Math.PI) / 2,
      box: this.ui.freeBox(),
    })
  }

  /** An event's step: its first place at the deepest zoom it asks for. */
  eventView(ev) {
    const place = this.placeOf(ev)
    if (!place) return null
    const zoom = deepestZoom(ev.zoom)
    if (zoom === 'near') return this.pointView(place, ZOOM.near)
    if (zoom === 'island' && this.islands.has(place.island)) return this.islandView(place.island, this.app.rig.goal.yaw, this.tilt())
    if (zoom === 'island') return this.pointView(place, ZOOM.island)
    // far: the chain around the place, or the whole of it for a place that is the whole of it
    if (!place.island && place.placePrecision === 'island') return this.chainView()
    return this.pointView(place, ZOOM.far, { towardChain: 0.35 })
  }

  /** From a pin: to the place, closer only as far as the island and never farther out than now. */
  gentleView(ev) {
    const place = this.placeOf(ev)
    if (!place) return null
    const want = ZOOM[deepestZoom(ev.zoom)]
    return this.pointView(place, Math.min(this.app.rig.goal.distance, Math.max(want, ZOOM.island)))
  }

  /**
   * Fly the rig's own flight there and say how long it takes: short hops are
   * quick, a crossing of the chain or a dive from the whole chain to a valley
   * takes longer, and nothing takes much over three seconds. Between distant
   * places the rig rises mid-flight (its `hop`), so the chain reads on the way.
   */
  fly(view, jump = false) {
    if (!view) return 1
    const rig = this.app.rig
    if (jump) {
      rig.jump({ x: view.target.x, z: view.target.z, distance: view.distance, yaw: view.yaw, pitch: view.pitch })
      return 0
    }
    const g = rig.goal
    const travel = Math.hypot(g.target.x - view.target.x, g.target.z - view.target.z)
    const zoom = Math.abs(Math.log(view.distance / Math.max(1, g.distance)))
    const dur = clamp(1.1 + Math.sqrt(travel) * 0.032 + zoom * 0.28, 1.1, 3.4)
    // (into a district: it starts streaming now, and the landing waits for it)
    const D = this.app.districts
    const into = D && view.distance < 130 ? D.prefetch(view.target.x, view.target.z) : null
    rig.flyTo(view, dur, into ? { ready: () => D.readyAt(view.target.x, view.target.z) } : {})
    return dur
  }

  /** "Chapter 6 of 13 · Kahekili · 3 of 8", or what Next will do from off the tour. */
  describe() {
    const ch = this.chapters.length ? this.chapters[this.active ? this.chapter : this.nearestChapter()] : null
    if (!ch) return null
    return {
      active: this.active,
      chapter: `Chapter ${ch.index + 1} of ${this.chapters.length}`,
      name: ch.name,
      step: this.active && this.step >= 0 ? `${this.step + 1} of ${ch.events.length}` : '',
    }
  }
}
