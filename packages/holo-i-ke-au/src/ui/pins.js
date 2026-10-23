// Event pins: one per event whose dates overlap the stretch of years around
// the chosen one (time.js), standing at the event's first place. They are DOM
// buttons that follow the ground's projection each frame, so they stay crisp
// and clickable at every zoom, and shrink as the camera pulls back.
//
// A place known only to its ahupuaʻa, moku or island (DESIGN.md §6) never
// reads as a point: its pin carries a soft halo the size of the area it might
// be anywhere in, drawn on the ground's scale.
//
// Many events share a place (ʻIolani Palace carries the overthrow, the 1895
// rising and ʻOnipaʻa; Honolulu and Kealakekua several each), so pins that
// land within a fingertip of one another on the screen gather into one marker
// with a count. The gathering is redone every frame from where the pins land,
// so a cluster comes apart as the camera closes in and its places separate;
// events at one and the same point never do, and the cluster's list is how
// they're reached. A halo gathers by its centre. The open event, the tour's
// or one picked by hand, always stands on its own with its label; except
// that at a stop of the tour, while the stop's own people are drawn
// there (features/forces.js), the scene is the subject and the card names
// the place, so its pin and label stand aside until the people fade (aside).
//
// A few dozen pins: every pair is compared, every frame, in typed arrays and
// a pool of markers that only grows, so a frame allocates nothing.

import * as THREE from 'three'
import { h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { geometryPoint } from '../geo.js'
import { eventSpan, eventStart, eventYear } from '../time.js'

// how far a place of each precision might lie from its point, world units
const SOFT = { exact: 0, ahupuaa: 22, moku: 90, island: 260, sea: 160 }
// pins nearer than this on the screen, in px, gather
const GATHER = 24

export class Pins {
  constructor(root, app, { onOpen, onCluster } = {}) {
    this.app = app
    this.onOpen = onOpen
    this.onCluster = onCluster
    this.layer = h('div', { class: 'pins' })
    root.appendChild(this.layer)
    this.tip = h('div', { class: 'cl-tip', role: 'tooltip' })
    root.appendChild(this.tip)
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
        this.onOpen?.(ev)
      })
      const soft = SOFT[where.placePrecision] ?? 0
      const halo = h('div', { class: 'halo' })
      this.layer.appendChild(halo)
      this.layer.appendChild(el)
      this.items.push({
        ev, place: where, x, z, span, start: eventStart(ev) ?? span[0], el, halo, soft, r: soft,
        pos: new THREE.Vector3(x, 0, z),
        // what was last written to the DOM, so an unmoved pin costs nothing
        shown: false, active: false, near: false, haloShown: false, tx: NaN, ty: NaN, ts: NaN, hx: NaN, hy: NaN, hr: NaN, ha: NaN,
      })
    }
    if (unplaced.length) app.warn(`events with no placeable \`where\` or no date, so no pin: ${unplaced.join(', ')}`)
    const n = this.items.length
    this.sx = new Float32Array(n)
    this.sy = new Float32Array(n)
    this.vis = new Uint8Array(n) // showing this frame, alone or in a cluster
    this.root = new Int16Array(n) // union-find over the gathering pins
    this.size = new Int16Array(n) // members under each root
    this.slot = new Int16Array(n) // root → its cluster marker
    this.members = new Int16Array(n) // cluster members, one cluster's after another's
    this.halos = new Int16Array(n) // halos drawn so far this frame
    this.clusters = [] // the markers: a pool that grows to the most ever needed
    this.nClusters = 0
    this.hovered = null
    this.activeEvent = null
    this.stopXZ = null
    this.asideNow = false
    this._v = new THREE.Vector3()
    this._w = new THREE.Vector3()
  }

  /** While an event's stops are walked, its pin stands at the current stop's place (null: back home). */
  setStopPlace(place) {
    const p = place && geometryPoint(place.geometry)
    this.stopXZ = p ? this.app.data.proj.toWorld(p) : null
    this.stopSoft = place ? SOFT[place.placePrecision] ?? 0 : 0
  }

  /**
   * Whether the open event's pin stands aside: the tour is at one of its stops and the stop's
   * own people are drawn (forces.js stopShown, with a little play so it doesn't flicker at the
   * edge), at whatever zoom. A stop with no people, and an event opened off the tour, keep the pin.
   */
  aside() {
    const app = this.app
    const tour = app.tour
    const st = tour?.active && tour.event === this.activeEvent && tour.stop >= 0 ? tour.event.stops?.[tour.stop] : null
    const k = st ? app.districts?.cur?.features?.forces?.stopShown ?? 0 : 0
    this.asideNow = this.asideNow ? k > 0.2 : k > 0.35
    return this.asideNow
  }

  /** Events showing at the timeline's current year. */
  visibleEvents() {
    const [a, b] = this.app.timeline.window
    return this.items.filter((it) => it.span[1] >= a && it.span[0] <= b).map((it) => it.ev)
  }

  /** Cluster marker k, made the first time it's needed. */
  marker(k) {
    let c = this.clusters[k]
    if (c) return c
    const el = h('button', { class: 'cluster' }, '<span class="cl-n"></span>')
    c = { el, label: el.firstChild, start: 0, count: 0, x: 0, y: 0, key: 0, shownCount: -1, tipKey: -1, domKey: -1, shown: false, beside: false, tx: NaN, ty: NaN, ts: NaN }
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      this.hideTip()
      this.onCluster?.(this.eventsOf(c))
    })
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return
      this.hovered = c
      this.showTip(c)
    })
    el.addEventListener('pointerleave', () => {
      if (this.hovered === c) this.hideTip()
    })
    this.layer.appendChild(el)
    this.clusters[k] = c
    return c
  }

  /** A cluster's events, earliest first. */
  eventsOf(c) {
    const its = []
    for (let k = 0; k < c.count; k++) its.push(this.items[this.members[c.start + k]])
    return its.sort((a, b) => a.start - b.start).map((it) => it.ev)
  }

  /** The clusters on screen now, for the tools. */
  groups() {
    return this.clusters.slice(0, this.nClusters).map((c) => ({ ids: this.eventsOf(c).map((e) => e.id), count: c.count, x: c.x, y: c.y, beside: c.beside }))
  }

  /** The hover list: what's in a cluster, when. */
  showTip(c) {
    c.tipKey = c.key
    const rows = this.eventsOf(c)
      .map((ev) => `<div class="tip-row"><span class="tip-y">${esc(eventYear(ev))}</span><b>${esc(ev.title)}</b></div>`)
      .join('')
    this.tip.innerHTML = `<div class="tip-head">${c.count} events here</div>${rows}<div class="tip-foot">click for the list</div>`
    this.tip.classList.add('show')
    this.tipX = this.tipY = NaN
    this.placeTip(c)
  }

  placeTip(c) {
    const w = this.tip.offsetWidth || 220
    const hgt = this.tip.offsetHeight || 120
    let x = c.x + 22
    if (x + w > innerWidth - 10) x = c.x - 22 - w
    const y = Math.max(64, Math.min(innerHeight - hgt - 10, c.y - 44 - hgt / 2))
    const tx = Math.round(x)
    const ty = Math.round(y)
    if (tx === this.tipX && ty === this.tipY) return
    this.tipX = tx
    this.tipY = ty
    this.tip.style.transform = `translate(${tx}px, ${ty}px)`
  }

  hideTip() {
    this.hovered = null
    this.tip.classList.remove('show')
  }

  find(i) {
    const r = this.root
    while (r[i] !== i) {
      r[i] = r[r[i]]
      i = r[i]
    }
    return i
  }

  /** Move a pin or marker, touching the DOM only when it has moved. */
  put(o, x, y, s) {
    if (Math.abs(x - o.tx) < 0.05 && Math.abs(y - o.ty) < 0.05 && s === o.ts) return
    o.tx = x
    o.ty = y
    o.ts = s
    o.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`
  }

  update(on) {
    const app = this.app
    const cam = app.camera
    const W = innerWidth
    const H = innerHeight
    const tl = app.timeline
    // (the stretch of years tl.window gives, without its array)
    const ya = tl.yearAt(tl.s - 0.5)
    const yb = tl.yearAt(tl.s + 0.5)
    const d = app.rig.state.distance
    // pins shrink as the view widens, from full size over an island
    const scale = Math.round(Math.max(0.62, Math.min(1, 1.18 - Math.log(Math.max(1, d) / 120) * 0.13)) * 200) / 200
    const items = this.items
    const n = items.length
    const { sx, sy, vis, root, size } = this
    const active = this.activeEvent
    const aside = this.aside()
    const v = this._v
    let solo = -1

    // where each pin lands, and whether it shows at all
    for (let i = 0; i < n; i++) {
      const it = items[i]
      const isActive = it.ev === active
      const walk = isActive && this.stopXZ
      it.pos.x = walk ? this.stopXZ[0] : it.x
      it.pos.z = walk ? this.stopXZ[1] : it.z
      it.pos.y = app.world.heightAt(it.pos.x, it.pos.z) + 0.02
      it.r = walk ? this.stopSoft : it.soft
      // (the open event's own pin, standing aside at a near stop, with its halo: nor does it gather)
      let show = on && (isActive ? !aside : it.span[1] >= ya && it.span[0] <= yb)
      if (show) {
        v.copy(it.pos).project(cam)
        sx[i] = ((v.x + 1) / 2) * W
        sy[i] = ((1 - v.y) / 2) * H
        // (a pin stands 38 px above its point: none under the title and the tools)
        show = v.z < 1 && sx[i] > -60 && sx[i] < W + 60 && sy[i] > 84 && sy[i] < H + 40
      }
      vis[i] = show ? 1 : 0
      if (show && isActive) solo = i
      root[i] = i
      size[i] = 0
    }

    // gather: every pair nearer than GATHER, chained (so three in a row are one)
    const G2 = GATHER * GATHER
    for (let i = 0; i < n; i++) {
      if (!vis[i] || i === solo) continue
      for (let j = i + 1; j < n; j++) {
        if (!vis[j] || j === solo) continue
        const dx = sx[i] - sx[j]
        const dy = sy[i] - sy[j]
        if (dx * dx + dy * dy < G2) {
          const a = this.find(i)
          const b = this.find(j)
          if (a !== b) root[Math.max(a, b)] = Math.min(a, b)
        }
      }
    }
    for (let i = 0; i < n; i++) if (vis[i] && i !== solo) size[this.find(i)]++
    // a marker for each group of two or more, its members laid out in turn
    let nc = 0
    let m = 0
    for (let i = 0; i < n; i++) {
      if (!vis[i] || i === solo || root[i] !== i || size[i] < 2) continue
      const c = this.marker(nc)
      this.slot[i] = nc++
      c.start = m
      c.count = 0
      c.x = 0
      c.y = 0
      c.key = 0
      m += size[i]
    }
    for (let i = 0; i < n; i++) {
      if (!vis[i] || i === solo) continue
      const r = this.find(i)
      if (size[r] < 2) continue
      const c = this.clusters[this.slot[r]]
      this.members[c.start + c.count++] = i
      c.x += sx[i]
      c.y += sy[i]
      c.key = (c.key * 61 + i + 1) % 1000003
    }

    // the pins that stand alone
    for (let i = 0; i < n; i++) {
      const it = items[i]
      const show = vis[i] === 1 && (i === solo || size[this.find(i)] < 2)
      if (show !== it.shown) {
        it.shown = show
        it.el.classList.toggle('show', show)
      }
      const isActive = it.ev === active
      if (isActive !== it.active) {
        it.active = isActive
        it.el.classList.toggle('active', isActive)
      }
      if (!show) continue
      const near = d < 260 || isActive
      if (near !== it.near) {
        it.near = near
        it.el.classList.toggle('near', near)
      }
      this.put(it, sx[i], sy[i], scale)
    }

    // the clusters, at the middle of their members; one under the open
    // event's own pin steps aside to its left, clear of the label
    for (let k = 0; k < nc; k++) {
      const c = this.clusters[k]
      c.x /= c.count
      c.y /= c.count
      const beside = solo >= 0 && Math.abs(c.x - sx[solo]) < 30 && Math.abs(c.y - sy[solo]) < 30
      if (beside) {
        c.x = sx[solo] - 36 * scale
        c.y = sy[solo]
      }
      if (beside !== c.beside) {
        c.beside = beside
        c.el.classList.toggle('beside', beside)
      }
      if (c.count !== c.shownCount) {
        c.shownCount = c.count
        c.label.textContent = String(c.count)
        c.el.setAttribute('aria-label', `${c.count} events here`)
      }
      if (c.key !== c.domKey) {
        // (which events, for the tools to find a cluster by: only when it changes)
        c.domKey = c.key
        let ids = ''
        for (let q = 0; q < c.count; q++) ids += `${q ? ' ' : ''}${items[this.members[c.start + q]].ev.id}`
        c.el.dataset.events = ids
      }
      if (!c.shown) {
        c.shown = true
        c.el.classList.add('show')
      }
      this.put(c, c.x, c.y, scale)
      if (this.hovered === c) {
        if (c.key !== c.tipKey) this.showTip(c)
        else this.placeTip(c)
      }
    }
    for (let k = nc; k < this.clusters.length; k++) {
      const c = this.clusters[k]
      if (this.hovered === c) this.hideTip()
      if (c.shown) {
        c.shown = false
        c.count = 0
        c.el.classList.remove('show')
      }
    }
    this.nClusters = nc

    // halos, for every pin that shows, alone or gathered; one per spot and size
    let nh = 0
    for (let i = 0; i < n; i++) {
      const it = items[i]
      let show = vis[i] === 1 && it.r > 0
      for (let k = 0; show && k < nh; k++) {
        const o = items[this.halos[k]]
        if (Math.abs(o.pos.x - it.pos.x) < 0.5 && Math.abs(o.pos.z - it.pos.z) < 0.5 && o.r >= it.r) show = false
      }
      if (show !== it.haloShown) {
        it.haloShown = show
        it.halo.classList.toggle('show', show)
      }
      if (!show) continue
      this.halos[nh++] = i
      // the halo's radius, projected at the pin
      this._w.copy(cam.position).sub(it.pos).normalize()
      const side = this._w.cross(cam.up).normalize().multiplyScalar(it.r).add(it.pos)
      side.project(cam)
      const r = Math.max(6, Math.min(400, Math.hypot(((side.x + 1) / 2) * W - sx[i], ((1 - side.y) / 2) * H - sy[i])))
      if (!(Math.abs(sx[i] - it.hx) < 0.05 && Math.abs(sy[i] - it.hy) < 0.05 && Math.abs(r - it.hr) < 0.05)) {
        it.hx = sx[i]
        it.hy = sy[i]
        it.hr = r
        it.halo.style.transform = `translate(${sx[i].toFixed(1)}px, ${sy[i].toFixed(1)}px) scale(${r.toFixed(1)})`
      }
      // (a wide halo, a whole island's worth, is a faint wash, not a fog)
      const a = Math.round(Math.max(0.3, Math.min(1, 70 / r)) * 100) / 100
      if (a !== it.ha) {
        it.ha = a
        it.halo.style.setProperty('--halo', a.toFixed(2))
      }
    }
  }
}
