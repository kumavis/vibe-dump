// Event pins on the table: one per event whose dates overlap the WarClock's
// window around the date (time.js windowAt: an eighth of the chapter either
// side, a week to three weeks, the whole prologue in the prologue), standing
// at the event's first place. They are DOM buttons that follow the table's
// projection each frame, so they stay crisp and clickable at every zoom, and
// shrink as the camera pulls back.
//
// A place known only to its locality, island, region or sea (DATA.md §4
// `placePrecision`) never reads as a point: its pin carries a soft halo the
// size of the area it might be anywhere in (25 km for a locality; for an
// island, a region or a sea the place's own polygon's equivalent radius, or a
// default), drawn at the ground's scale. A place off the table (`off`, or a
// point beyond the pack's edge: Washington, Potsdam) stands at the table's
// edge on the line from its middle, with an arrow pointing the way. An event
// with a battle box (`box`) wears a small frame, the box on the table.
//
// Pins that land within a fingertip of one another on the screen gather into
// one marker with a count, redone every frame from where they land, so a
// cluster comes apart as the camera closes in; events at one and the same
// point never do, and the cluster's list is how they are reached. The open
// event, the tour's or one picked by hand, always stands on its own with its
// label.
//
// update() returns the screen rectangles the pins and clusters took, which
// the names on the table (table/labels.js) keep clear of in the same frame.
//
// Adapted from holo-i-ke-au's ui/pins.js (b480c27): the gathering
// (union-find over typed arrays, a pool of markers that only grows), the
// halos and the hover list are kept; the years became the WarClock's window
// in ms, the precisions and kinds are DATA.md's, the distances are the
// table's kilometres, the edge markers and the box frame are new.

import * as THREE from 'three'
import { h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { geometryPoint } from '../geo.js'
import { spanOf, formatWhen } from '../time.js'

// how far a place of each precision might lie from its point, km (a polygon's own radius wins where it has one)
const SOFT = { ex: 0, loc: 25, isl: 30, reg: 300, sea: 250, off: 0 }
// pins nearer than this on the screen, in px, gather
const GATHER = 26

/** A when's [from, to) in ms, or null. */
export function eventSpan(ev) {
  try {
    return ev?.when?.from ? spanOf(ev.when) : null
  } catch {
    return null
  }
}

/** An event's first place that can be put on the table. */
export function placeOf(ev, places) {
  for (const w of ev?.where || []) {
    const p = places.get(w.place)
    if (p && geometryPoint(p.geometry)) return p
  }
  return null
}

/** A short date for lists: "4 Jun 1942", "Jun 1942", "1937", in the event's own zone. */
export function shortWhen(ev) {
  try {
    const full = formatWhen(ev.when, { zone: ev.when.zone })
    return full.replace(/, \d\d:\d\d.*$/, '').replace(/ \(UTC.*\)$/, '').replace(/(January|February|March|April|May|June|July|August|September|October|November|December)/g, (m) => m.slice(0, 3))
  } catch {
    return ''
  }
}

/** The equivalent radius (km) of a polygon place, or null. */
function polygonRadius(place, proj) {
  const g = place.geometry
  const rings = g?.type === 'Polygon' ? [g.coordinates[0]] : g?.type === 'MultiPolygon' ? g.coordinates.map((p) => p[0]) : null
  if (!rings) return null
  let A = 0
  for (const r of rings) {
    const w = r.map((c) => proj.toWorld(c))
    for (let i = 0, j = w.length - 1; i < w.length; j = i++) A += w[j][0] * w[i][1] - w[i][0] * w[j][1]
  }
  return Math.sqrt(Math.abs(A / 2) / Math.PI)
}

export class Pins {
  constructor(root, app, { onOpen, onCluster } = {}) {
    this.app = app
    this.onOpen = onOpen
    this.onCluster = onCluster
    this.layer = h('div', { class: 'pins' })
    root.appendChild(this.layer)
    this.tip = h('div', { class: 'cl-tip', role: 'tooltip' })
    root.appendChild(this.tip)
    const proj = app.data.proj
    const places = new Map(app.data.places.map((p) => [p.id, p]))
    this.places = places
    const b = app.table.ground.bounds
    this.bounds = b
    this.centre = [(b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2]
    this.items = []
    const unplaced = []
    for (const ev of app.data.events) {
      const where = placeOf(ev, places)
      const span = eventSpan(ev)
      if (!where || !span) {
        unplaced.push(ev.id)
        continue
      }
      const [x, z] = proj.toWorld(geometryPoint(where.geometry))
      const off = where.placePrecision === 'off' || x < b.x0 || x > b.x1 || z < b.z0 || z > b.z1
      const kind = hasIcon(ev.kind) ? ev.kind : 'other'
      const boxed = !!ev.box
      const el = h(
        'button',
        { class: `pin${boxed ? ' boxed' : ''}${off ? ' off' : ''}`, title: ev.title, 'aria-label': ev.title, 'data-ev': ev.id },
        `<span class="pin-ic">${icon(kind, 16)}</span><span class="pin-label">${esc(ev.title)}</span>${off ? `<span class="pin-arrow">${icon('arrow', 14)}</span>` : ''}`,
      )
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        this.onOpen?.(ev)
      })
      const soft = off ? 0 : polygonRadius(where, proj) ?? SOFT[where.placePrecision] ?? 0
      const halo = h('div', { class: 'halo' })
      this.layer.appendChild(halo)
      this.layer.appendChild(el)
      const edge = off ? this.toEdge(x, z) : null
      this.items.push({
        ev, place: where, x: edge ? edge[0] : x, z: edge ? edge[1] : z, tx0: x, tz0: z, off, boxed, span, start: span[0], el, halo, soft, r: soft,
        arrow: off ? el.querySelector('.pin-arrow') : null, angle: NaN,
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
    this.rects = []
    this._v = new THREE.Vector3()
    this._w = new THREE.Vector3()
  }

  /** A point beyond the table, brought in to its edge along the line from the middle (a little inside). */
  toEdge(x, z) {
    const b = this.bounds
    const [cx, cz] = this.centre
    const dx = x - cx
    const dz = z - cz
    const inset = 0.97
    const kx = dx ? ((dx > 0 ? b.x1 - cx : b.x0 - cx) * inset) / dx : Infinity
    const kz = dz ? ((dz > 0 ? b.z1 - cz : b.z0 - cz) * inset) / dz : Infinity
    const k = Math.min(1, kx, kz)
    return [cx + dx * k, cz + dz * k]
  }

  /** While an event's stops are walked, its pin stands at the current stop's place (null: back home). */
  setStopPlace(place) {
    const p = place && geometryPoint(place.geometry)
    this.stopXZ = p ? this.app.data.proj.toWorld(p) : null
    this.stopSoft = place ? (polygonRadius(place, this.app.data.proj) ?? SOFT[place.placePrecision] ?? 0) : 0
  }

  /** Events showing in the WarClock's window now. */
  visibleEvents() {
    const [a, b] = this.app.clock.windowAt()
    return this.items.filter((it) => it.span[1] >= a && it.span[0] <= b).map((it) => it.ev)
  }

  /** Cluster marker k, made the first time it's needed. */
  marker(k) {
    let c = this.clusters[k]
    if (c) return c
    const el = h('button', { class: 'cluster' }, '<span class="cl-n"></span>')
    c = { el, label: el.firstChild, start: 0, count: 0, x: 0, y: 0, key: 0, shownCount: -1, tipKey: -1, domKey: -1, shown: false, beside: false, boxed: false, tx: NaN, ty: NaN, ts: NaN }
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

  /** A cluster's events, earliest first (by UTC instant). */
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
      .map((ev) => `<div class="tip-row"><span class="tip-y">${esc(shortWhen(ev))}</span><b>${esc(ev.title)}</b></div>`)
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

  /** Once a frame: which pins show, where, and how they gather. Returns the screen rectangles they took. */
  update(on) {
    const app = this.app
    const table = app.table
    const cam = table.camera
    const W = innerWidth
    const H = innerHeight
    const [wa, wb] = app.clock.windowAt()
    const d = table.rig.state.distance
    // pins shrink as the view widens, from full size over an island group
    const scale = Math.round(Math.max(0.62, Math.min(1, 1.12 - Math.log(Math.max(1, d) / 300) * 0.11)) * 200) / 200
    const items = this.items
    const n = items.length
    const { sx, sy, vis, root, size } = this
    const active = this.activeEvent
    const v = this._v
    const rects = this.rects
    rects.length = 0
    let solo = -1

    // where each pin lands, and whether it shows at all
    for (let i = 0; i < n; i++) {
      const it = items[i]
      const isActive = it.ev === active
      const walk = isActive && this.stopXZ
      it.pos.x = walk ? this.stopXZ[0] : it.x
      it.pos.z = walk ? this.stopXZ[1] : it.z
      it.pos.y = table.ground.heightAt(it.pos.x, it.pos.z) + 0.05
      it.r = walk ? this.stopSoft : it.soft
      let show = on && (isActive || (it.span[1] >= wa && it.span[0] <= wb))
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
    const G2 = GATHER * GATHER * scale * scale
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
      c.hasBox = false
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
      if (items[i].boxed) c.hasBox = true
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
      const near = d < 900 || isActive
      if (near !== it.near) {
        it.near = near
        it.el.classList.toggle('near', near)
      }
      this.put(it, sx[i], sy[i], scale)
      if (it.off) this.pointArrow(it, sx[i], sy[i])
      const wLabel = near ? Math.min(240, 9 * it.ev.title.length) + 30 : 16
      rects.push([sx[i] - 18 * scale, sy[i] - 42 * scale, sx[i] + wLabel * scale, sy[i] + 2])
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
      if (c.hasBox !== c.boxed) {
        c.boxed = c.hasBox
        c.el.classList.toggle('boxed', c.boxed)
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
      rects.push([c.x - 18 * scale, c.y - 42 * scale, c.x + 22 * scale, c.y + 2])
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
      // (a wide halo, a sea's worth, is a faint wash, not a fog)
      const a = Math.round(Math.max(0.3, Math.min(1, 70 / r)) * 100) / 100
      if (a !== it.ha) {
        it.ha = a
        it.halo.style.setProperty('--halo', a.toFixed(2))
      }
    }
    return rects
  }

  /** An edge marker's arrow, turned toward where the place really is. */
  pointArrow(it, x, y) {
    const v = this._w.set(it.tx0, 0, it.tz0).project(this.app.table.camera)
    const W = innerWidth
    const H = innerHeight
    const ax = ((v.x + 1) / 2) * W
    const ay = ((1 - v.y) / 2) * H
    // (behind the camera the projection flips: point away instead)
    const k = v.z < 1 ? 1 : -1
    const a = Math.round((Math.atan2((ay - y) * k, (ax - x) * k) * 180) / Math.PI)
    if (a === it.angle) return
    it.angle = a
    it.arrow.style.transform = `rotate(${a}deg)`
  }
}
