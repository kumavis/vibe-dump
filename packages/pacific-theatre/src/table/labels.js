// Names on the table (ENGINEERING.md §10, DATA.md §3): DOM text, like the
// Hawaiian district labels and pins, so it is crisp at any zoom and pixel
// ratio and the kanji come through CSS (`lang="ja"`, the Noto Sans JP subset
// once it is in, FONTS.md).
//
// Each label of labels.json stands at its lon/lat (on the ground where that
// is land, at the sea's surface where it is sea) and is styled by its kind:
// seas in a spaced italic, island groups and regions in small capitals,
// islands upright, straits small italic, bases and cities beside a dot, and
// the `line` labels (the date line, the equator) turned along their line on
// the screen. An island's name stands just above its point, so the front's
// mark of who holds it (front.js) shows beneath. A label with a `ja` name carries it after the English one.
// Today's name is the card's (DATA.md §3), never the table's.
//
// Thinning, once a frame and in the same loop as the pins (ui.js calls
// update() with the screen rectangles the pins took; without a UI the scene
// calls it alone): a label shows only while the camera is close enough for
// its rank (rank 1 always; 2 within 9,000 km; 3 within 3,200 km; 4 within
// 1,000 km, which is "zoomed on it"), then in rank order (labels.json is
// sorted by rank then text, DATA.md §12) each one that would overlap a pin or
// a label already placed stays hidden, and no more than ninety show. Other
// modules add their own labels (the front's declared lines and perimeters)
// with add(), which returns a handle whose `k` (0..1) says how much it is
// wanted now.

import * as THREE from 'three'
import { esc } from '../ui/dom.js'
import { wrapLon } from '../geo.js'

// the camera distance (km) under which each rank shows
const RANK_RANGE = { 1: Infinity, 2: 9000, 3: 3200, 4: 1000 }
const MAX_SHOWN = 90
// room kept round each label, px
const PAD = 3

export class Labels {
  /**
   * table: the TableScene (camera, ground, projection); list: labels.json
   * (normalised); parent: the element the layer goes in (document.body).
   */
  constructor(table, list = [], parent = document.body) {
    this.table = table
    this.proj = table.data.proj
    this.layer = document.createElement('div')
    this.layer.className = 'labels'
    this.layer.setAttribute('aria-hidden', 'true')
    parent.appendChild(this.layer)
    this.items = []
    for (const l of list) {
      if (!Array.isArray(l.lonlat) || !l.text) continue
      this.add({ ...l, along: l.kind === 'line' ? alongOf(l.lonlat, this.proj.lon0) : null })
    }
    this._v = new THREE.Vector3()
    this._w = new THREE.Vector3()
    this.shown = 0
    this.opacity = 1
    this.driven = false
    // (measured once laid out, and again once the web fonts are in)
    document.fonts?.ready?.then(() => this.measure())
  }

  /**
   * A label: { text, ja, kind, rank, lonlat | xz, along: [[lon, lat], [lon, lat]] (turn the
   * text along this direction) }. Returns the item; set its `k` (0..1) to want it less.
   */
  add(l) {
    const el = document.createElement('div')
    el.className = `label k-${l.kind || 'island'} r-${l.rank || 3}`
    el.innerHTML = `<span class="lb-t">${esc(l.text)}</span>${l.ja ? `<span class="lb-ja" lang="ja">${esc(l.ja)}</span>` : ''}`
    this.layer.appendChild(el)
    const xz = l.xz || this.proj.toWorld(l.lonlat)
    const it = {
      l,
      el,
      x: xz[0],
      z: xz[1],
      rank: l.rank || 3,
      kind: l.kind || 'island',
      k: 1,
      w: 0,
      h: 0,
      shown: false,
      tx: NaN,
      ty: NaN,
      ta: NaN,
      along: l.along ? l.along.map((p) => this.proj.toWorld(p)) : null,
    }
    // (a dot beside the name: the text starts to its right; an island's
    // name stands just above its point, where the front marks who holds it)
    it.dot = it.kind === 'base' || it.kind === 'city'
    it.above = it.kind === 'island'
    this.items.push(it)
    // rank order, stable: what comes first is placed first
    this.items.sort((a, b) => a.rank - b.rank)
    it.measured = false
    return it
  }

  remove(it) {
    it.el.remove()
    this.items = this.items.filter((x) => x !== it)
  }

  measure() {
    for (const it of this.items) {
      it.w = it.el.offsetWidth
      it.h = it.el.offsetHeight
      it.measured = true
    }
  }

  /**
   * Once a frame. occupied: screen rectangles already taken ([x0, y0, x1,
   * y1], the pins'); opacity: the overlays' strength (the fly-down fades it).
   */
  update(occupied = [], opacity = 1) {
    const table = this.table
    const cam = table.camera
    const d = table.rig.state.distance
    const W = innerWidth
    const H = innerHeight
    if (opacity !== this.opacity) {
      this.opacity = opacity
      this.layer.style.opacity = opacity.toFixed(3)
    }
    const placed = occupied.slice()
    const v = this._v
    let n = 0
    for (const it of this.items) {
      if (!it.measured) {
        it.w = it.el.offsetWidth
        it.h = it.el.offsetHeight
        it.measured = true
      }
      let show = opacity > 0.02 && it.k > 0.02 && d < RANK_RANGE[it.rank] && n < MAX_SHOWN
      let sx = 0
      let sy = 0
      let ang = 0
      if (show) {
        const y = it.kind === 'sea' || it.kind === 'strait' || it.kind === 'line' ? 0 : table.ground.heightAt(it.x, it.z)
        v.set(it.x, y, it.z).project(cam)
        sx = ((v.x + 1) / 2) * W
        sy = ((1 - v.y) / 2) * H
        show = v.z < 1 && sx > -40 && sx < W + 40 && sy > 60 && sy < H + 20
      }
      if (show && it.along) {
        // the line's direction on the screen, kept reading left to right
        const [a, b] = it.along
        const pa = this._w.set(a[0], 0, a[1]).project(cam)
        const ax = pa.x
        const ay = pa.y
        const pb = this._w.set(b[0], 0, b[1]).project(cam)
        ang = Math.atan2(-(pb.y - ay) * H, (pb.x - ax) * W)
        if (ang > Math.PI / 2) ang -= Math.PI
        if (ang < -Math.PI / 2) ang += Math.PI
      }
      let rect = null
      if (show) {
        // the box it takes (a turned label's, roughly: its extent along the turn)
        const c = Math.abs(Math.cos(ang))
        const s = Math.abs(Math.sin(ang))
        const w = it.w * c + it.h * s
        const h = it.w * s + it.h * c
        const cx = it.dot ? sx + it.w / 2 - 4 : sx
        const cy = it.above ? sy - h / 2 - 6 : sy
        rect = [cx - w / 2 - PAD, cy - h / 2 - PAD, cx + w / 2 + PAD, cy + h / 2 + PAD]
        for (const o of placed) {
          if (rect[0] < o[2] && rect[2] > o[0] && rect[1] < o[3] && rect[3] > o[1]) {
            show = false
            break
          }
        }
      }
      if (show !== it.shown) {
        it.shown = show
        it.el.classList.toggle('show', show)
      }
      if (!show) continue
      placed.push(rect)
      n++
      const tx = Math.round(sx)
      const ty = Math.round(sy)
      const ta = Math.round((ang * 180) / Math.PI)
      if (tx !== it.tx || ty !== it.ty || ta !== it.ta) {
        it.tx = tx
        it.ty = ty
        it.ta = ta
        it.el.style.transform = it.dot
          ? `translate(${tx - 4}px, ${ty}px) translateY(-50%)`
          : it.above
            ? `translate(${tx}px, ${ty - 6}px) translate(-50%, -100%)`
            : `translate(${tx}px, ${ty}px)${ta ? ` rotate(${ta}deg)` : ''} translate(-50%, -50%)`
      }
      const o = it.k.toFixed(2)
      if (o !== it.o) {
        it.o = o
        it.el.style.setProperty('--k', o)
      }
    }
    this.shown = n
    return placed
  }

  /** The labels on screen now, for the tools. */
  visible() {
    return this.items.filter((it) => it.shown).map((it) => it.l.text)
  }

  dispose() {
    this.layer.remove()
  }
}

/** A line label's direction: along the parallel through it at the equator, along the meridian at 180°, else none. */
function alongOf([lon, lat], lon0) {
  if (Math.abs(lat) < 0.01) return [
    [lon - 1, 0],
    [lon + 1, 0],
  ]
  if (Math.abs(wrapLon(lon, 180) - 180) < 0.01) return [
    [lon, lat - 1],
    [lon, lat + 1],
  ]
  return null
}
