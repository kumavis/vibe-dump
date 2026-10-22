// The battles in the district (DESIGN.md §8, the tone rule): features.json's
// `force` lines and `line` fronts, shown as people. The owner's decision after
// the first render: billboarded pixel-art soldiers, small and crisp, walking
// their lines and meeting at the fronts, the two sides told apart by palette
// and dress (sprites.js draws them, soldiers.js places and moves them). And
// after the first figures: the battle as the sources tell it, each feature
// doing what its `behaviour` says and carrying what its `arms` say, the last
// stand, the surround and the leap at the pali's edge where the data puts
// them. No dead are drawn: a figure whose part is done walks on out of it, and
// one who goes over the edge falls out of sight. Each front also lays a faint
// band of its side's colour on the ground under it.
//
// Which forces show: at a stop of an event's walk, those of that stop. A
// feature that names its stop (`stop`: an index into the event's stops, from
// 0, or a stop's place, or a list of either) shows at the stops it names.
// One that doesn't is placed by inference (stepsAt: the data numbers the
// steps within the event, not by stop, so the stop a step belongs to is found
// from the fronts, each of which stands at the place its stop names). Off the
// tour, in the battle's own year, every one at once, quietly: a fifth of the
// people, walking and standing at half pace, nobody fighting.

import * as THREE from 'three'
import { geometryPoint } from '../geo.js'
import { Soldiers } from './soldiers.js'

// (none of them blue, which on this ground reads as water)
export const ROLE_COLOURS = { hawaii: '#f0ae3c', oahu: '#a88fe6', maui: '#d9703f' }

export class Forces {
  /** feats: features.json's features; shared: the app's uniforms; ribbons: features/ribbons.js. */
  constructor(app, feats, shared, ribbons) {
    this.app = app
    this.forces = []
    this.lines = []
    for (const f of feats) {
      const p = f.properties || {}
      if ((p.kind !== 'force' && p.kind !== 'line') || f.geometry?.type !== 'LineString') continue
      const pts = f.geometry.coordinates.map((c) => app.data.proj.toWorld(c))
      const cum = [0]
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
      const total = cum.at(-1)
      const rec = { p, pts, cum, total, event: p.event, step: Number.isFinite(p.step) ? p.step : 0, w: 0, goal: 0, stop: p.stop ?? null, line: p.kind === 'line' }
      if (rec.line) {
        rec.side = p.side || (p.role === 'advance' ? 'hawaii' : 'oahu')
        rec.batch = ribbons.add([{ pts, width: 0.75 }], { mode: 'band', colour: new THREE.Color(ROLE_COLOURS[rec.side] || '#ffffff').toArray(), alpha: 0, minPx: 6, lift: 0.01, order: 6, endFade: 1.2 })
        rec.mid = geometryPoint(f.geometry)
        // (a front's people stand; the tools tell them from the forces by this)
        rec.stand = true
        this.lines.push(rec)
      } else rec.side = p.role || 'oahu'
      this.forces.push(rec)
    }
    // the events they belong to, and the years each holds
    this.events = new Map()
    for (const r of this.forces) {
      if (!r.event) continue
      let e = this.events.get(r.event)
      if (!e) this.events.set(r.event, (e = { id: r.event, from: Infinity, to: -Infinity, recs: [] }))
      e.recs.push(r)
      if (Number.isFinite(r.p.from)) e.from = Math.min(e.from, r.p.from)
      if (Number.isFinite(r.p.to)) e.to = Math.max(e.to, r.p.to)
    }
    // their people, every one placed now (each rec is given o and n: its first and how many)
    this.soldiers = new Soldiers(app, this.forces, shared)
    this.count = this.soldiers.count
    // (for the tools: each figure's x, z, how much of it shows, and its scale)
    this.marks = this.soldiers.marks
    this.group = this.soldiers.group
    this.time = 0
    this.showing = { event: null, steps: [], quiet: false }
  }

  /**
   * The steps of an event shown at its stop `i`: the steps whose number,
   * moved by the offset the fronts give (a front stands at the place of its
   * stop), is the stop's; the last stop also takes any steps after it.
   */
  stepsAt(ev, i) {
    const e = this.events.get(ev.id)
    const stops = ev.stops || []
    if (!e || i < 0 || i >= stops.length) return []
    const places = this.app.tour?.places
    const proj = this.app.data.proj
    const offsets = []
    for (const r of e.recs) {
      if (r.p.kind !== 'line' || !r.mid) continue
      const [lx, lz] = proj.toWorld(r.mid)
      let best = -1
      let bd = 6 // world units: the front within 600 m of the stop's place
      stops.forEach((s, k) => {
        const pl = places?.get(s.place)
        const pt = pl && geometryPoint(pl.geometry)
        if (!pt) return
        const [x, z] = proj.toWorld(pt)
        const d = Math.hypot(x - lx, z - lz)
        if (d < bd) {
          bd = d
          best = k
        }
      })
      if (best >= 0) offsets.push(best - r.step)
    }
    offsets.sort((a, b) => a - b)
    const off = offsets.length ? offsets[Math.floor(offsets.length / 2)] : 0
    const steps = new Set()
    for (const r of e.recs) {
      const at = r.step + off
      if (at === i || (i === stops.length - 1 && at > i)) steps.add(r.step)
    }
    return [...steps].sort((a, b) => a - b)
  }

  /** The stops of `ev` a feature names (`stop`), or null when it names none. */
  namedStops(r, ev) {
    if (r.stop === null || r.stop === undefined) return null
    const out = []
    for (const v of Array.isArray(r.stop) ? r.stop : [r.stop]) {
      if (Number.isInteger(v)) out.push(v)
      else if (typeof v === 'string') (ev.stops || []).forEach((s, k) => s.place === v && out.push(k))
    }
    return out
  }

  /**
   * What shows of `ev` at its stop i: each feature that names its stops, at
   * those; the rest by the steps stepsAt infers.
   */
  shownAt(ev, i) {
    const e = this.events.get(ev.id)
    const out = new Set()
    if (!e) return out
    let steps = null
    for (const r of e.recs) {
      const named = this.namedStops(r, ev)
      if (named) {
        if (named.includes(i)) out.add(r)
        continue
      }
      steps ||= this.stepsAt(ev, i)
      if (steps.includes(r.step)) out.add(r)
    }
    return out
  }

  /** What shows now: the tour's stop, or the battle's year off the tour. */
  choose() {
    const tour = this.app.tour
    const ev = tour?.active ? tour.event : null
    if (ev && this.events.has(ev.id) && tour.stop >= 0) {
      // (worked out again only when the stop changes)
      if (this._at?.ev !== ev || this._at.stop !== tour.stop) {
        const recs = this.shownAt(ev, tour.stop)
        this._at = { ev, stop: tour.stop, now: { event: ev.id, recs, steps: [...new Set([...recs].map((r) => r.step))].sort((a, b) => a - b), quiet: false } }
      }
      return this._at.now
    }
    this._at = null
    const y = this.app.timeline.year
    for (const e of this.events.values()) if (y >= e.from && y < e.to + 1) return (this._quiet ||= new Map()).get(e.id) || this._quiet.set(e.id, { event: e.id, recs: null, steps: null, quiet: true }).get(e.id)
    return (this._none ||= { event: null, recs: new Set(), steps: [], quiet: false })
  }

  update(dt, show, distance = 0) {
    // (the people belong to the near zoom: gone as the view widens past the valley)
    show *= 1 - smooth(75, 140, distance)
    this.time += dt
    const now = this.choose()
    this.showing = now
    const ease = dt > 0 ? 1 - Math.exp(-dt * 2) : 1
    for (const r of this.forces) {
      const on = r.event === now.event && (now.recs === null || now.recs.has(r))
      r.goal = on ? (now.quiet ? 0.2 : 1) : 0
      r.w += (r.goal - r.w) * ease
      if (Math.abs(r.goal - r.w) < 0.003) r.w = r.goal
    }
    for (const r of this.lines) r.batch && (r.batch.uniforms.uAlpha.value = 0.26 * r.w * show)
    this.soldiers.update(dt, show, now.quiet)
    this.marksShown = this.soldiers.drawn
  }

  /** For the tools: which forces show, by name (as the tour and the year stand now, not as last drawn), and their people. */
  stats() {
    const now = this.choose()
    const on = (r) => r.event === now.event && (now.recs === null || now.recs.has(r))
    return {
      event: now.event,
      steps: now.steps,
      quiet: now.quiet,
      // (how the stop's forces were found: named by the data, inferred, or both)
      by: now.recs ? [...new Set([...now.recs].map((r) => (r.stop === null || r.stop === undefined ? 'inferred' : 'named')))].join('+') || 'none' : 'year',
      forces: this.forces.filter((r) => on(r) && !r.stand).map((r) => r.p.name),
      lines: this.lines.filter(on).map((r) => r.p.name),
      marks: this.count,
      marksShown: this.marksShown ?? 0,
      ...this.soldiers.stats(),
    }
  }

  dispose() {
    this.soldiers.dispose()
  }
}

function smooth(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
