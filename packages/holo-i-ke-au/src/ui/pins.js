// Event pins: one per event whose dates overlap the stretch of years around
// the chosen one (time.js), standing at the event's first place. They are DOM
// buttons that follow the ground's projection each frame, so they stay crisp
// and clickable at every zoom, and shrink as the camera pulls back.
//
// A place known only to its ahupuaʻa, moku or island (DESIGN.md §6) never
// reads as a point: its pin carries a soft halo the size of the area it might
// be anywhere in, drawn on the ground's scale.

import * as THREE from 'three'
import { h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { geometryPoint } from '../geo.js'
import { eventSpan } from '../time.js'

// how far a place of each precision might lie from its point, world units
const SOFT = { exact: 0, ahupuaa: 22, moku: 90, island: 260, sea: 160 }

export class Pins {
  constructor(root, app, onOpen) {
    this.app = app
    this.onOpen = onOpen
    this.layer = h('div', { class: 'pins' })
    root.appendChild(this.layer)
    const places = new Map(app.data.places.map((p) => [p.id, p]))
    this.places = places
    this.items = []
    const unplaced = []
    for (const ev of app.data.events) {
      const where = (ev.where || []).map((w) => places.get(w.place)).find((p) => p && geometryPoint(p.geometry))
      const span = eventSpan(ev)
      if (!where || !span) {
        unplaced.push(ev.id)
        continue
      }
      const [x, z] = app.data.proj.toWorld(geometryPoint(where.geometry))
      const kind = hasIcon(ev.kind) ? ev.kind : 'other'
      const el = h('button', { class: 'pin', title: ev.title, 'aria-label': ev.title }, `<span class="pin-ic">${icon(kind, 16)}</span><span class="pin-label">${esc(ev.title)}</span>`)
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        this.onOpen(ev)
      })
      const soft = SOFT[where.placePrecision] ?? 0
      const halo = h('div', { class: 'halo' })
      this.layer.appendChild(halo)
      this.layer.appendChild(el)
      this.items.push({ ev, place: where, x, z, span, el, halo, soft, pos: new THREE.Vector3(x, 0, z), shown: false })
    }
    if (unplaced.length) app.warn(`events with no placeable \`where\` or no date, so no pin: ${unplaced.join(', ')}`)
    this.activeEvent = null
    this._v = new THREE.Vector3()
    this._w = new THREE.Vector3()
  }

  /** While an event's stops are walked, its pin stands at the current stop's place (null: back home). */
  setStopPlace(place) {
    const p = place && geometryPoint(place.geometry)
    this.stopXZ = p ? this.app.data.proj.toWorld(p) : null
    this.stopSoft = place ? SOFT[place.placePrecision] ?? 0 : 0
  }

  /** Events showing at the timeline's current year. */
  visibleEvents() {
    const [a, b] = this.app.timeline.window
    return this.items.filter((it) => it.span[1] >= a && it.span[0] <= b).map((it) => it.ev)
  }

  update(on) {
    const app = this.app
    const cam = app.camera
    const W = innerWidth
    const H = innerHeight
    const [ya, yb] = app.timeline.window
    const d = app.rig.state.distance
    // pins shrink as the view widens, from full size over an island
    const scale = Math.max(0.62, Math.min(1, 1.18 - Math.log(Math.max(1, d) / 120) * 0.13))
    const v = this._v
    const placed = []
    const order = this.items
      .map((it) => {
        const walk = it.ev === this.activeEvent && this.stopXZ
        it.pos.x = walk ? this.stopXZ[0] : it.x
        it.pos.z = walk ? this.stopXZ[1] : it.z
        it.pos.y = app.world.heightAt(it.pos.x, it.pos.z) + 0.02
        it.r = walk ? this.stopSoft : it.soft
        return { it, dist: cam.position.distanceTo(it.pos) }
      })
      .sort((a, b) => (a.it.ev === this.activeEvent ? -1 : b.it.ev === this.activeEvent ? 1 : a.dist - b.dist))
    for (const { it } of order) {
      const inTime = it.span[1] >= ya && it.span[0] <= yb
      let show = on && (inTime || it.ev === this.activeEvent)
      let sx = 0
      let sy = 0
      if (show) {
        v.copy(it.pos).project(cam)
        sx = ((v.x + 1) / 2) * W
        sy = ((1 - v.y) / 2) * H
        show = v.z < 1 && sx > -60 && sx < W + 60 && sy > 40 && sy < H + 40
      }
      // pins that would sit on one another stack upward, nearest first
      let lift = 0
      if (show) {
        for (const p of placed) if (Math.abs(p[0] - sx) < 34 && Math.abs(p[1] - lift * 30 - sy) < 26) lift++
        if (lift > 3) show = it.ev === this.activeEvent
        placed.push([sx, sy])
      }
      if (show !== it.shown) {
        it.shown = show
        it.el.classList.toggle('show', show)
      }
      it.halo.classList.toggle('show', show && it.r > 0)
      it.el.classList.toggle('active', it.ev === this.activeEvent)
      if (!show) continue
      it.el.style.transform = `translate(${sx.toFixed(1)}px, ${(sy - lift * 30 * scale).toFixed(1)}px) scale(${scale.toFixed(3)})`
      it.el.classList.toggle('near', d < 260 || it.ev === this.activeEvent)
      if (it.r > 0) {
        // the halo's radius, projected at the pin
        this._w.copy(cam.position).sub(it.pos).normalize()
        const side = this._w.cross(cam.up).normalize().multiplyScalar(it.r).add(it.pos)
        side.project(cam)
        const r = Math.min(400, Math.hypot(((side.x + 1) / 2) * W - sx, ((1 - side.y) / 2) * H - sy))
        it.halo.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) scale(${Math.max(6, r).toFixed(1)})`
        // (a wide halo, a whole island's worth, is a faint wash, not a fog)
        it.halo.style.setProperty('--halo', Math.max(0.3, Math.min(1, 70 / Math.max(1, r))).toFixed(2))
      }
    }
  }
}
