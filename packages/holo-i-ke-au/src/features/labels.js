// The district's place names (features.json `label`), small and quiet on the
// ground at the near zoom: DOM text that follows the ground's projection, as
// the pins do (ui/pins.js), under them, fading in as the district comes down
// and out with distance. A name whose place a pin already marks keeps to its
// own spot; the pin is the event's, the name the land's.

import * as THREE from 'three'
import { geometryPoint } from '../geo.js'
import { holds } from '../data/district.js'

export class Labels {
  constructor(app, feats) {
    this.app = app
    const root = document.getElementById('ui') || document.body
    this.layer = document.createElement('div')
    this.layer.className = 'dlabels'
    // (under the pins and the cards)
    root.insertBefore(this.layer, root.querySelector('.pins') || root.firstChild)
    this.items = []
    for (const f of feats) {
      const p = f.properties || {}
      if (p.kind !== 'label' || !p.name) continue
      const pt = geometryPoint(f.geometry)
      if (!pt) continue
      const [x, z] = app.data.proj.toWorld(pt)
      const el = document.createElement('div')
      el.className = 'dlabel'
      el.textContent = p.name
      el.lang = 'haw'
      this.layer.appendChild(el)
      this.items.push({ p, x, z, el, v: new THREE.Vector3(), shown: -1, tx: NaN, ty: NaN })
    }
    this.panels = []
    this.frame = 0
  }

  /** The panels on screen (the card, the timeline, the legend, the tools), which a name keeps out from under. */
  panelRects() {
    if (this.frame++ % 15 === 0) {
      this.panels = []
      for (const el of document.querySelectorAll('.card, .timeline, .legend, .tools, .brand, .inspector')) {
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
    // names at the near zoom only: whole under 32, gone by 62
    const near = 1 - Math.max(0, Math.min(1, (d - 32) / 30))
    const placed = []
    const panels = this.panelRects()
    const year = app.timeline.year
    for (const it of this.items) {
      let a = show * near * (holds(it.p, year) ? 1 : 0)
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
        if (a > 0.01) placed.push([x, y, w])
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
    return this.items.filter((it) => it.shown > 0.5).map((it) => it.p.name)
  }

  dispose() {
    this.layer.remove()
  }
}
