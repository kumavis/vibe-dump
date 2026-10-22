// The far view's third mode: Ka Māhele, the land division of 1848, by
// ahupuaʻa (public/data/mahele.json, joined to boundaries/ahupuaa.geojson by
// gisId; DATA.md "The Māhele, by ahupuaʻa"). Every ahupuaʻa takes the colour
// of the class the division gave it: crown, government or konohiki land;
// mixed where the records give it more than one; a neutral grey where the
// class is unknown.
//
// Built as the polity overlay is (overlay/polity.js): the polygons are
// rasterised once into a map over the archipelago, here of classes rather
// than of moku, and a small palette colours them. It is drawn by the
// chiefdoms' own path in the terrain shader (common.glsl.js applyPolity):
// while it shows, its map and palette stand on the shared uniforms in place
// of the moku's (app.js swaps them, faded through nothing), so it lies on
// the ground, lets the relief through and fades with the zoom as the other
// far overlays do. The ahupuaʻa under the pointer, for the hover card, is
// found in the polygons themselves.
//
// The division is from 1848 on (MAHELE_YEAR); before it the far view shows
// the chiefdoms. The file is read behind the first frame, and the map made
// the first time the view is wanted.

import * as THREE from 'three'
import { fill } from './polity.js'

/** The year of the division: the view is there from this year on. */
export const MAHELE_YEAR = 1848

// the classes (DATA.md), their codes in the map, their names and colours (sRGB, as authored)
export const CLASSES = [
  { id: 'crown', name: 'Crown', colour: '#f0b43c' },
  { id: 'government', name: 'Government', colour: '#5e9fd6' },
  { id: 'konohiki', name: 'Konohiki', colour: '#c7364f' },
  { id: 'mixed', name: 'Mixed', colour: '#a77fcf' },
  // (a grey, held back a little, that greys the ground without hiding it)
  { id: 'unknown', name: 'Unknown', colour: '#b5b0a5', alpha: 0.85 },
]
const CODE = new Map(CLASSES.map((c, i) => [c.id, i + 1]))

// an ʻokina typed as a turned comma (Kapa‘akea) is the ʻokina; only place names are touched
const okina = (s) => String(s || '').replace(/[‘’']/g, 'ʻ')

export class MaheleOverlay {
  constructor(app) {
    this.app = app
    this.data = app.data
    this.warn = app.warn
    this.available = null // unknown until the file answers
    this.units = [] // the ahupuaʻa, joined: { gisId, name, island, moku, cls, entry, rings, box }
    this.sources = null // the ids the file was made from (tour.js asks)
    this.built = false
    this.listeners = []
  }

  onChange(f) {
    this.listeners.push(f)
  }

  notify() {
    for (const f of this.listeners) f(this)
  }

  /** mahele.json, joined to the ahupuaʻa polygons. */
  async load() {
    if (this.loading) return this.loading
    this.loading = (async () => {
      const url = this.data.abs('mahele.json')
      let m
      try {
        const feats = this.data.ahupuaa?.features
        if (!feats?.length) throw new Error('no ahupuaʻa boundaries to lay it on')
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        m = await res.json()
        if (!Array.isArray(m?.ahupuaa)) throw new Error('no ahupuaʻa in it')
      } catch (err) {
        this.available = false
        this.warn(`${url}: ${err.message} (no Māhele view)`)
        this.notify()
        return
      }
      this.file = m
      this.sources = new Set(m.sources || [])
      const byGis = new Map(m.ahupuaa.map((a) => [a.gisId, a]))
      const proj = this.data.proj
      let unjoined = 0
      for (const f of this.data.ahupuaa.features) {
        const p = f.properties || {}
        const g = f.geometry
        const polys = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : []
        const entry = byGis.get(p.gisId)
        if (!entry) unjoined++
        const cls = CODE.has(entry?.class) ? entry.class : 'unknown'
        const rings = polys.map((poly) => poly.map((r) => r.map((c) => proj.toWorld(c))))
        const box = [Infinity, Infinity, -Infinity, -Infinity]
        for (const poly of rings) for (const r of poly) for (const [x, z] of r) {
          box[0] = Math.min(box[0], x)
          box[1] = Math.min(box[1], z)
          box[2] = Math.max(box[2], x)
          box[3] = Math.max(box[3], z)
        }
        this.units.push({ gisId: p.gisId, name: okina(entry?.name ?? p.name ?? p.ahupuaa), island: p.island || '', islandId: p.islandId || entry?.islandId || '', moku: p.moku || '', cls, entry: entry || null, rings, box })
      }
      if (unjoined) this.warn(`mahele.json has no entry for ${unjoined} of the ahupuaʻa (drawn as unknown)`)
      this.available = true
      this.notify()
    })()
    return this.loading
  }

  /** The map and its palette, made once, the first time they are wanted. */
  build() {
    if (this.built || !this.available) return this.built
    const rect = this.app.polity.rect
    // (the polity map's own grid: about 150 m a texel over the archipelago)
    const W = this.app.polity.W
    const H = this.app.polity.H
    const grid = new Uint8Array(W * H)
    for (const u of this.units) for (const poly of u.rings) fill(grid, W, H, rect, poly, CODE.get(u.cls))
    const tex = new THREE.DataTexture(grid, W, H, THREE.RedFormat, THREE.UnsignedByteType)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.unpackAlignment = 1
    tex.needsUpdate = true
    // (once on the GPU the bytes aren't needed here: the hover card asks the polygons)
    tex.onUpdate = () => {
      tex.image.data = null
      tex.onUpdate = null
    }
    // the palette, as the polity's: a row for the era before and one after,
    // here the same; alpha is how strongly the class shows
    const pal = new Uint8Array(256 * 2 * 4)
    const c = new THREE.Color()
    CLASSES.forEach((k, i) => {
      c.set(k.colour)
      for (const row of [0, 1]) {
        const o = (row * 256 + i + 1) * 4
        pal[o] = Math.round(c.r * 255)
        pal[o + 1] = Math.round(c.g * 255)
        pal[o + 2] = Math.round(c.b * 255)
        pal[o + 3] = Math.round((k.alpha ?? 1) * 255)
      }
    })
    const palTex = new THREE.DataTexture(pal, 256, 2, THREE.RGBAFormat, THREE.UnsignedByteType)
    palTex.minFilter = THREE.NearestFilter
    palTex.magFilter = THREE.NearestFilter
    palTex.needsUpdate = true
    this.idTex = tex
    this.palTex = palTex
    this.rect = rect
    this.built = true
    return true
  }

  /** Whether the view can be shown in year y: the file is in and the division has happened. */
  availableAt(y = this.app.timeline.year) {
    return this.available !== false && y >= MAHELE_YEAR
  }

  /** The ahupuaʻa under world (x, z), or null. */
  unitAt(x, z) {
    for (const u of this.units) {
      const b = u.box
      if (x < b[0] || z < b[1] || x > b[2] || z > b[3]) continue
      for (const poly of u.rings) if (inside(poly, x, z)) return u
    }
    return null
  }

  /** Ahupuaʻa by class, on one island (its id) or across them all: for the legend. */
  counts(islandId = null) {
    const n = Object.fromEntries(CLASSES.map((k) => [k.id, 0]))
    let all = 0
    for (const u of this.units) {
      if (islandId && u.islandId !== islandId) continue
      n[u.cls]++
      all++
    }
    return { byClass: n, all }
  }
}

/** Even-odd: whether (x, z) is inside a polygon's rings. */
function inside(rings, x, z) {
  let c = false
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, zi] = r[i]
      const [xj, zj] = r[j]
      if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c
    }
  }
  return c
}
