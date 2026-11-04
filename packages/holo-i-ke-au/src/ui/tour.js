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
// included; and the Māhele for a law that rests on the records the land
// division was read from (mahele.json `sources`), which is the division
// itself. An event may name its view outright (`view: "land"`). Once the
// viewer has used the switch themselves, the tour leaves it alone.
//
// Where the data has a geology (DATA.md "Geology"), its chapters come before
// chapter 1 as a prologue: their indices run below zero (-P .. -1, so the
// main chapters keep theirs), Next and Back walk them and cross into chapter
// 1 and back, and while the tour is in them the timeline is the prologue's
// clock in millions of years (ui/timeline.js) and the far view is the
// prologue's own (render/geology.js): the step's stage, carried along the
// drift by its age, its debris fields lit, a slide run. Every view of the
// prologue frames what the plate carried where it stood at the step's age.

import { geometryPoint } from '../geo.js'
import { MIN_DISTANCE } from '../config.js'
import { eventSpan, eventStart } from '../time.js'
import { preferredPitch, CHAIN_REACH } from '../render/camera.js'
import { driftAt } from '../data/geology.js'

// camera distance for DATA.md's zooms; `island` frames the whole island
// instead, where the place has one
export const ZOOM = { far: 2600, island: 520, near: 70 }
const DEPTH = { far: 0, island: 1, near: 2 }
// the ground (world units) a far step shows across the free part of the
// screen's shorter side: what ZOOM.far shows beside the card on a wide screen
const FAR_SPAN = 1500

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// the kinds (DATA.md §4) whose story is the land; every other kind, and an
// era's card, shows the chiefdoms
export const LAND_KINDS = new Set(['law', 'epidemic', 'restoration'])

/**
 * The far view a step asks for: an event's own `view`; else the Māhele for a
 * law citing a source the land division was read from (`division`, their
 * ids, once mahele.json is in); else by its kind. Null is an era's card.
 */
export function viewFor(ev, division = null) {
  if (ev?.view === 'land' || ev?.view === 'chiefdoms' || ev?.view === 'mahele') return ev.view
  if (ev?.kind === 'law' && division?.size && (ev.sources || []).some((r) => division.has(typeof r === 'string' ? r : r?.id))) return 'mahele'
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
/** I, II, III … for the prologue's chapters. */
export function roman(n) {
  const R = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, r] of R) while (n >= v) [n, out] = [n - v, out + r]
  return out
}

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
    // the prologue's chapters, before chapter 1 (index -P .. -1), and their steps by id
    this.prologue = this.buildPrologue()
    this.first = -this.prologue.length
    this.steps = new Map(this.prologue.flatMap((ch) => ch.events.map((st) => [st.id, st])))
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
        i = tl.eras.indexOf(tl.eraAt(tl.sAtYear(start)))
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
   * The prologue, from geology/chapters.json: each chapter with its label,
   * note and ages, its steps in the order written (oldest first).
   */
  buildPrologue() {
    const G = this.app.data.geology
    if (!G) return []
    const P = G.chapters.length
    return G.chapters.map((c, k) => {
      const era = { id: c.id, label: c.label || c.id, short: c.short, note: c.note || '', sources: c.sources || [], age: c.age, ageSpan: c.ageSpan }
      const events = (c.steps || []).filter((st) => st?.id && Number.isFinite(st.age)).map((st) => ({ ...st, prologue: true }))
      return { prologue: true, index: k, at: k - P, era, name: chapterName(era), events, island: null }
    })
  }

  /** The chapter at index c: a main chapter from 0, the prologue's below it. */
  chapterAt(c) {
    return c < 0 ? this.prologue[this.prologue.length + c] || null : this.chapters[c] || null
  }

  /**
   * The prologue chapter an age falls in: of those whose span holds it (the
   * spans may overlap), the one with a step nearest it; else the nearest by age.
   */
  prologueAt(A) {
    let best = null
    let d0 = Infinity
    for (const ch of this.prologue) {
      const span = ch.era.ageSpan
      const holds = Array.isArray(span) && A <= Math.max(...span) + 1e-9 && A >= Math.min(...span) - 1e-9
      const ages = [ch.era.age, ...ch.events.map((e) => e.age)].filter(Number.isFinite)
      const d = Math.min(...ages.map((a) => Math.abs(a - A))) - (holds ? 1e6 : 0)
      if (d < d0) [d0, best] = [d, ch]
    }
    return best
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
    return this.chapterAt(this.chapter)
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
    return this.active && this.chapter === this.first && this.step < 0
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
    // (off the tour in the prologue, by the clock)
    if (this.app.prologue && this.prologue.length) return this.prologueAt(this.app.geoClock.age).at
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
    if (this.step < this.current.events.length - 1) return this.goTo(this.chapter, this.step + 1, { forward: true })
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
    if (this.chapter > this.first) {
      const prev = this.chapterAt(this.chapter - 1)
      return this.goTo(this.chapter - 1, prev.events.length - 1, { stop: 'last' })
    }
  }

  /** `,` and `.`: a chapter at a time. Back from inside a chapter goes first to its own card. */
  skip(dir) {
    if (!this.chapters.length) return
    const at = this.active ? this.chapter : this.nearestChapter()
    const to = dir < 0 && this.active && this.step >= 0 ? at : at + dir
    if (to >= this.first && to < this.chapters.length) this.goTo(to, -1)
  }

  /** Off the tour: the viewer has taken the timeline. */
  leave() {
    if (!this.active) return
    this.active = false
    this.notify()
  }

  /** Where an event stands in the tour: [chapter, step], or null. */
  locate(ev) {
    for (let c = this.first; c < this.chapters.length; c++) {
      const s = this.chapterAt(c).events.indexOf(ev)
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
    this.fly(this.gentleView(ev), false, this.placeOf(ev))
  }

  goTo(c, s = -1, { jump = false, gentle = false, stop = -1, forward = false } = {}) {
    const ch = this.chapterAt(c)
    if (!ch) return
    this.closeFloor(null)
    this.active = true
    this.chapter = c
    this.step = clamp(s, -1, ch.events.length - 1)
    this.stop = -1
    this.setPrologue(!!ch.prologue)
    if (ch.prologue) {
      if (this.step < 0) this.showPrologueChapter(ch, jump)
      else {
        const st = ch.events[this.step]
        const n = st.stops?.length || 0
        if (stop === 'last' && n) {
          this.showStep(st, { jump, quiet: true })
          return this.goStop(n - 1, { jump })
        }
        this.showStep(st, { jump, forward: forward || gentle })
      }
      return this.notify()
    }
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
    if (!this.app.viewChosen) this.app.setView(viewFor(ev, this.app.mahele?.sources))
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
    const dur = this.fly(gentle ? this.gentleView(ev) : this.eventView(ev), jump, this.placeOf(ev))
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
    if (ev.prologue) return this.goPrologueStop(ev, i, { jump })
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
    this.closeFloor(s?.camera)
    this.prefetch(ev)
    if (s) {
      // a stop's own camera, if it has one; else its place at its zoom
      const view = pt ? (s.camera ? this.cameraView(place, s.camera) : this.pointView(place, ZOOM[s.zoom] ?? ZOOM.island)) : null
      const dur = this.fly(view, jump, place)
      if (Number.isFinite(s.year)) this.setYear(s.year, dur, jump)
    }
    this.notify()
  }

  /**
   * An event that walks into a district: start its pack streaming as soon as
   * the event is opened (data/district.js decodes it in a worker), so it is
   * down when the walk gets there. Where two districts' boxes overlap, the
   * stop's place decides by its moku (render/district.js).
   */
  prefetch(ev) {
    const D = this.app.districts
    if (!D) return
    for (const s of ev?.stops || []) {
      const p = this.places.get(s.place)
      const pt = p && geometryPoint(p.geometry)
      if (!pt || s.zoom === 'far') continue
      const [x, z] = this.app.data.proj.toWorld(pt)
      if (D.prefetch(x, z, p.moku)) return
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

  // --- the prologue ---------------------------------------------------------------

  /** Into the prologue, or out of it into the main chapters: its view and the clock, or the packs and the years. */
  setPrologue(on) {
    const app = this.app
    if (!app.geology || on === app.prologue) return
    app.setPrologue(on)
    this.ui.timeline.setMode(on ? 'ma' : 'years')
    if (!on) app.geology.light([])
  }

  /** A prologue chapter's card: the clock to its age, its first step's stage, the chain where it then stood. */
  showPrologueChapter(ch, jump) {
    const ui = this.ui
    const G = this.app.geology
    ui.pins.activeEvent = null
    ui.pins.setStopPlace(null)
    ui.card.openEra(ch)
    const age = Number.isFinite(ch.era.age) ? ch.era.age : ch.events[0]?.age ?? 0
    if (ch.events[0]?.stage) G.show(ch.events[0].stage, age, { jump })
    G.light([])
    const dur = this.fly(this.prologueChapterView(ch), jump)
    this.setAge(age, dur, jump)
  }

  /** A step: its stage at its age, its fields lit, its first place where it then stood; a slide run once the camera is there. */
  showStep(st, { jump = false, forward = false, quiet = false } = {}) {
    const ui = this.ui
    const G = this.app.geology
    ui.pins.activeEvent = null
    ui.pins.setStopPlace(null)
    ui.card.open(st)
    if (st.stage) G.show(st.stage, st.age, { jump })
    G.light(st.landslides || [])
    for (const n of this.nextStages(st)) G.load(n)
    const ease = quiet ? 0 : this.setAge(st.age, this.fly(this.stepView(st), jump), jump)
    if (quiet) this.setAge(st.age, 1, jump)
    // (a slide runs once the camera and the clock are there, going forward
    // onto a field the step before did not light; going back, or onto the
    // same field again, it is shown done)
    const prev = this.prevStep(st)
    if (st.kind === 'slide' && forward && G.slideOf(st, prev)?.fresh) G.playSlide(st, { delay: jump ? 0 : ease + 0.6, prev })
  }

  /** The prologue's step before st, in the tour's order. */
  prevStep(st) {
    const all = this.prologue.flatMap((ch) => ch.events)
    return all[all.indexOf(st) - 1] || null
  }

  /** The stages of the steps either side, read ahead. */
  nextStages(st) {
    const all = this.prologue.flatMap((ch) => ch.events)
    const i = all.indexOf(st)
    return [all[i + 1]?.stage, all[i - 1]?.stage].filter(Boolean)
  }

  goPrologueStop(st, i, { jump = false } = {}) {
    const ui = this.ui
    this.active = true
    this.stop = i
    if (ui.card.ev !== st) ui.card.open(st)
    ui.card.setStop(i)
    const s = st.stops[i]
    if (s) {
      const age = Number.isFinite(s.age) ? s.age : st.age
      const dur = this.fly(this.prologueStopView(st, s, age), jump)
      if (Number.isFinite(s.age)) this.setAge(s.age, dur, jump)
    } else this.fly(this.stepView(st), jump)
    this.notify()
  }

  /** Run the step's slide again (the card's control). */
  replaySlide() {
    const st = this.event
    if (st?.prologue && st.kind === 'slide') this.app.geology?.playSlide(st, { delay: 0, prev: this.prevStep(st) })
  }

  /** Ease the clock to age A; how long the easing takes. */
  setAge(A, dur, jump) {
    const bar = this.ui.timeline
    if (jump) {
      bar.tween = null
      this.app.geoClock.set(A)
      return 0
    }
    const d = clamp(dur * 0.8, 0.6, 2.4)
    bar.easeToAge(A, d)
    return d
  }

  /** Where a point the plate carries ([lon, lat] today) stood at age A: world [x, z]. */
  carried(lonlat, A) {
    const [x, z] = this.app.data.proj.toWorld(lonlat)
    const [dx, dz] = driftAt(this.app.data.geology.hotspot, A)
    return [x + dx, z + dz]
  }

  /** A place's point, carried to age A (a seamount and a debris field are on the plate as an island is). */
  carriedPlace(id, A) {
    const p = this.places.get(id)
    const pt = p && geometryPoint(p.geometry)
    return pt ? this.carried(pt, A) : null
  }

  /** The chain as a prologue chapter opens on it: its steps' places where each then stood, and the hotspot, in the chain view's turn. */
  prologueChapterView(ch) {
    const pts = []
    for (const st of ch.events) for (const id of st.places || []) {
      const p = this.carriedPlace(id, st.age)
      if (p) pts.push(p)
    }
    const hs = this.app.data.geology.hotspot.at
    if (hs) pts.push(hs)
    if (pts.length < 2) return this.carriedChainView(ch.era.age ?? 0)
    const box = this.ui.freeBox()
    const yaw = this.homeYaw(box)
    const v = this.app.rig.fit({ points: pts, yaw, box, reach: CHAIN_REACH, pad: 1.4 })
    const min = this.farDistance(box)
    if (v.distance < min) return this.app.rig.fit({ rect: { x0: v.target.x, x1: v.target.x, z0: v.target.z, z1: v.target.z }, distance: min, yaw, box })
    this.app.rig.reach(v.distance)
    return v
  }

  /** The whole chain's view, slid with the drift to age A. */
  carriedChainView(A) {
    const v = this.chainView()
    const [dx, dz] = driftAt(this.app.data.geology.hotspot, A)
    v.target.x += dx
    v.target.z += dz
    return v
  }

  /** A step's view: its first place where it then stood, at the far zoom, in the chain view's turn. */
  stepView(st) {
    const id = (st.places || []).find((p) => this.places.has(p))
    const at = id ? this.carriedPlace(id, st.age) : null
    if (!at) return this.carriedChainView(st.age)
    const box = this.ui.freeBox()
    return this.app.rig.fit({ rect: { x0: at[0], x1: at[0], z0: at[1], z1: at[1] }, distance: this.farDistance(box), yaw: this.homeYaw(box), tilt: this.tilt(), box })
  }

  /**
   * A far stop's view (DATA.md "Geology", a step's `stops`): its camera's
   * target ([lon, lat] today), else its place, carried to the age; at its
   * distance, toward its bearing and at its pitch where it gives them, else
   * the far zoom and the chain view's turn.
   */
  prologueStopView(st, s, age) {
    const cam = s.camera || {}
    const target = Array.isArray(cam.target) && cam.target.length >= 2 && cam.target.every(Number.isFinite) ? this.carried(cam.target, age) : s.place ? this.carriedPlace(s.place, age) : null
    if (!target) return this.stepView(st)
    const box = this.ui.freeBox()
    return this.app.rig.fit({
      rect: { x0: target[0], x1: target[0], z0: target[1], z1: target[1] },
      distance: Number.isFinite(cam.distance) ? cam.distance : this.farDistance(box),
      yaw: Number.isFinite(cam.bearing) ? (-cam.bearing * Math.PI) / 180 : this.homeYaw(box),
      pitch: Number.isFinite(cam.pitch) ? (cam.pitch * Math.PI) / 2 : undefined,
      tilt: this.tilt(),
      box,
    })
  }

  // --- views ------------------------------------------------------------------

  /**
   * The whole chain's turn for the free part of the screen: the way the
   * chain view looks, kept by a chapter that opens on one island and by a
   * far step, so the islands keep their places on the screen from one to
   * the next.
   */
  homeYaw(box = this.ui.freeBox()) {
    return this.chainView(box).yaw
  }

  /** The tilt the viewer has added to the zoom's own, kept from step to step (within reason). */
  tilt() {
    const g = this.app.rig.goal
    return clamp(g.pitch - preferredPitch(g.distance), -0.3, 0.3)
  }

  /**
   * The whole chain, from Niʻihau to Hawaiʻi, beside the card: turned so its
   * long axis runs down the free part of the screen's diagonal, Niʻihau at
   * the top left and Hawaiʻi at the bottom right, and as large as that
   * leaves room for (render/camera.js homeView, fit). The rig may pull back
   * as far as it needs, which on a phone is further than its usual reach.
   */
  chainView(box = this.ui.freeBox()) {
    const rig = this.app.rig
    const c = this.app.world.chainShape()
    const view = rig.fit({ points: c.hull, along: [c.from, c.to], box, reach: CHAIN_REACH })
    rig.reach(view.distance)
    return view
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
    // (a far view keeps the whole chain's turn: it only slides and zooms)
    const box = this.ui.freeBox()
    const yaw = towardChain ? this.homeYaw(box) : this.app.rig.goal.yaw
    return this.app.rig.fit({ rect: { x0: x, x1: x, z0: z, z1: z }, distance, yaw, tilt: this.tilt(), box })
  }

  /**
   * A stop's own camera (DATA.md "District packs"): its place seen from
   * `distance` world units, looking toward `bearing` (compass degrees), at
   * `pitch` a fraction of a right angle (0 along the horizon, 1 straight
   * down), slid so the place stands in the middle of the screen beside the
   * card. The rig's yaw is the camera's bearing from its target turned about,
   * so looking toward north is yaw 0 and toward east is −90°. A camera with
   * a `target` ([lon, lat]) centres that instead, so the stop can stand its
   * place low in the frame and look past it (Kou, below the valley it
   * looks up); the pin stays at the place.
   */
  /**
   * A near stop whose camera stands closer than the rig's own floor (a
   * departure's scene, framed at a few hundred metres: DATA.md "Vessels and
   * crowds") lowers the floor to it while the tour is on that stop; any other
   * step puts it back.
   */
  closeFloor(cam) {
    const rig = this.app.rig
    if (!rig) return
    rig.minDistance = Number.isFinite(cam?.distance) ? Math.min(MIN_DISTANCE, Math.max(1, cam.distance)) : MIN_DISTANCE
  }

  cameraView(place, cam) {
    const at = Array.isArray(cam.target) && cam.target.length >= 2 && cam.target.every(Number.isFinite) ? cam.target : geometryPoint(place.geometry)
    const [x, z] = this.app.data.proj.toWorld(at)
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
    return this.pointView(place, this.farDistance(), { towardChain: 0.35 })
  }

  /**
   * How far out a far step stands: ZOOM.far, or further where the free part
   * of the screen is small (a phone, above its card), so that the step shows
   * as much of the chain around its place as a wide screen does and the lean
   * toward the chain's middle keeps the place in view.
   */
  farDistance(box = this.ui.freeBox()) {
    const tanH = Math.tan((this.app.camera.fov * Math.PI) / 360)
    const side = Math.max(60, Math.min(box.x1 - box.x0, box.y1 - box.y0))
    return Math.max(ZOOM.far, (FAR_SPAN * innerHeight) / (2 * tanH * side))
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
   * `place`, the gazetteer place the view is of: where two districts' boxes
   * overlap, its moku says which one the flight comes down into.
   */
  fly(view, jump = false, place = null) {
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
    const into = D && view.distance < 130 ? D.prefetch(view.target.x, view.target.z, place?.moku) : null
    rig.flyTo(view, dur, into ? { ready: () => D.cur?.d === into && D.cur.state === 'ready' } : {})
    return dur
  }

  /**
   * "Chapter 6 of 13 · Kahekili · 3 of 8", or what Next will do from off the
   * tour; `opening` while the tour stands on a chapter's own card.
   */
  describe() {
    const ch = this.chapters.length || this.prologue.length ? this.chapterAt(this.active ? this.chapter : this.nearestChapter()) : null
    if (!ch) return null
    const step = this.active && this.step >= 0 ? `${this.step + 1} of ${ch.events.length}` : ''
    if (ch.prologue) {
      // "Prologue II of II", or "Prologue" alone for a prologue of one chapter
      const P = this.prologue.length
      const n = roman(ch.index + 1)
      return {
        active: this.active,
        opening: this.active && this.step < 0,
        prologue: true,
        word: 'Prologue',
        number: n,
        of: P,
        ofLabel: roman(P),
        chapter: P > 1 ? `Prologue ${n} of ${roman(P)}` : 'Prologue',
        resume: P > 1 ? `the prologue, ${n} of ${roman(P)}` : 'the prologue',
        name: ch.name,
        step,
      }
    }
    return {
      active: this.active,
      opening: this.active && this.step < 0,
      prologue: false,
      word: 'Chapter',
      number: ch.index + 1,
      of: this.chapters.length,
      ofLabel: String(this.chapters.length),
      chapter: `Chapter ${ch.index + 1} of ${this.chapters.length}`,
      resume: `chapter ${ch.index + 1} of ${this.chapters.length}`,
      name: ch.name,
      step,
    }
  }
}
