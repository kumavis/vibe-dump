// The district's place names (features.json `label`), small and quiet on the
// ground at the near zoom: DOM text that follows the ground's projection, as
// the pins do (ui/pins.js), under them, fading in as the district comes down
// and out with distance. A name whose place a pin already marks keeps to its
// own spot; the pin is the event's, the name the land's.
//
// The works' names (features/works.js: a base's land, an airfield, a named
// highway) go through the same system at the island zoom, from their own
// list, each while its work stands: every set of names on screen claims its
// room in one list for the frame, the place names first (they are updated
// before the works'), so no name is ever drawn over another; and the works'
// keep out from under the pins as well.

import * as THREE from 'three'
import { geometryPoint } from '../geo.js'
import { holds } from '../data/district.js'

// what the names on screen have claimed this frame: [x, y, w, owner], in the order placed
const CLAIMS = { frame: -1, list: [] }

/** The place names' zoom: whole under 32, gone by 62. */
const nearZoom = (d) => 1 - Math.max(0, Math.min(1, (d - 32) / 30))

export class Labels {
  /**
   * feats: the district's features (its `label`s are the names), or opts.items:
   * { name, x, z, cls?, ... } with opts.alive(item, year) saying whether it stands;
   * opts.zoom(distance) the names' strength at a camera distance, opts.cls the
   * names' class and opts.layer the layer's, opts.avoid a selector for more
   * of the screen to keep out from under.
   */
  constructor(app, feats, { items = null, alive = null, zoom = nearZoom, cls = 'dlabel', layer = 'dlabels', avoid = '', lang = 'haw' } = {}) {
    this.app = app
    this.zoom = zoom
    this.alive = alive || ((it, year) => holds(it.p, year))
    this.avoid = avoid
    const root = document.getElementById('ui') || document.body
    this.layer = document.createElement('div')
    this.layer.className = layer
    // (under the pins and the cards)
    root.insertBefore(this.layer, root.querySelector('.pins') || root.firstChild)
    this.items = []
    const src = items ?? feats.flatMap((f) => {
      const p = f.properties || {}
      if (p.kind !== 'label' || !p.name) return []
      const pt = geometryPoint(f.geometry)
      if (!pt) return []
      const [x, z] = app.data.proj.toWorld(pt)
      return [{ p, name: p.name, x, z }]
    })
    for (const it of src) {
      const el = document.createElement('div')
      el.className = it.cls || cls
      el.textContent = it.name
      if (lang) el.lang = lang
      this.layer.appendChild(el)
      this.items.push({ ...it, el, v: new THREE.Vector3(), shown: -1, tx: NaN, ty: NaN })
    }
    this.panels = []
    this.frame = 0
  }

  /** The panels on screen (the card, the timeline, the legend, the tools), which a name keeps out from under. */
  panelRects() {
    if (this.frame++ % 15 === 0) {
      this.panels = []
      for (const el of document.querySelectorAll(`.card, .timeline, .legend, .tools, .brand, .inspector${this.avoid ? `, ${this.avoid}` : ''}`)) {
        if (el.hidden || !el.offsetParent) continue
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) this.panels.push(r)
      }
    }
    return this.panels
  }

  update(show) {
    const app = this.app
    const cam = app.camera
    const W = innerWidth
    const H = innerHeight
    const d = app.rig.state.distance
    const near = this.zoom(d)
    // (a new frame clears every set's claims; within one, this set's own from an update before)
    if (CLAIMS.frame !== app.frames) {
      CLAIMS.frame = app.frames
      CLAIMS.list.length = 0
    } else CLAIMS.list = CLAIMS.list.filter((c) => c[3] !== this)
    const placed = CLAIMS.list
    const panels = this.panelRects()
    const year = app.timeline.year
    const names = new Set()
    for (const it of this.items) {
      let a = show * near * (this.alive(it, year) ? 1 : 0)
      // (one name once: of a work in several parts, the largest standing)
      if (a > 0.01 && names.has(it.name)) a = 0
      if (a > 0.01) {
        it.v.set(it.x, app.world.heightAt(it.x, it.z) + 0.05, it.z).project(cam)
        if (it.v.z > 1 || it.v.z < -1) a = 0
        const x = ((it.v.x + 1) / 2) * W
        const y = ((1 - it.v.y) / 2) * H
        if (x < -80 || x > W + 80 || y < 60 || y > H + 20) a = 0
        // (a name that would sit on one already placed waits its turn)
        const w = it.el.offsetWidth || 60
        if (a > 0.01 && panels.some((r) => x + w / 2 > r.left - 4 && x - w / 2 < r.right + 4 && y + 10 > r.top - 4 && y - 10 < r.bottom + 4)) a = 0
        if (a > 0.01 && placed.some((p) => Math.abs(p[0] - x) < (p[2] + w) / 2 + 6 && Math.abs(p[1] - y) < 18)) a = 0
        if (a > 0.01) {
          placed.push([x, y, w, this])
          names.add(it.name)
        }
        // (NaN the first time: written then)
        if (a > 0.01 && !(Math.abs(x - it.tx) <= 0.3 && Math.abs(y - it.ty) <= 0.3)) {
          it.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
          it.tx = x
          it.ty = y
        }
      }
      const q = Math.round(a * 20) / 20
      if (q !== it.shown) {
        it.el.style.opacity = String(q)
        it.el.style.visibility = q > 0 ? 'visible' : 'hidden'
        it.shown = q
      }
    }
  }

  /** The names on screen now, for the tools. */
  visible() {
    return this.items.filter((it) => it.shown > 0.5).map((it) => it.name)
  }

  /** Where each name on screen stands (px), for the tools. */
  rects() {
    return this.items.filter((it) => it.shown > 0.5).map((it) => {
      const r = it.el.getBoundingClientRect()
      return { name: it.name, left: r.left, top: r.top, right: r.right, bottom: r.bottom }
    })
  }

  dispose() {
    this.layer.remove()
  }
}
