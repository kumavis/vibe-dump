// The far-view polity overlay: every moku tinted by the polity that holds it
// in the eras either side of the chosen year (polities.json, keyed
// `island:moku` with the moku names exactly as moku.geojson spells them).
//
// The moku polygons are rasterised once, here, into an index map over the
// archipelago (about 150 m a texel), and the terrain shader looks each
// texel's moku up in a small palette: one row for the era before, one for the
// era after, crossfaded (common.glsl.js applyPolity). Changing the year only
// rewrites the palette. The same map answers "which moku is under the
// pointer" for the hover card.

import * as THREE from 'three'
import { islandKey } from '../geo.js'

const strip = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯʻʼ'‘’]/g, '').toLowerCase()

/** Even-odd scanline fill of a polygon's rings (world coordinates) into grid `id`. */
function fill(grid, W, H, rect, rings, value) {
  const sx = W / (rect.x1 - rect.x0)
  const sz = H / (rect.z1 - rect.z0)
  const edges = []
  let j0 = Infinity
  let j1 = -Infinity
  for (const r of rings) {
    for (let i = 0; i + 1 < r.length; i++) {
      const ax = (r[i][0] - rect.x0) * sx
      const az = (r[i][1] - rect.z0) * sz
      const bx = (r[i + 1][0] - rect.x0) * sx
      const bz = (r[i + 1][1] - rect.z0) * sz
      if (az === bz) continue
      edges.push(az < bz ? [az, ax, bz, bx] : [bz, bx, az, ax])
      j0 = Math.min(j0, az, bz)
      j1 = Math.max(j1, az, bz)
    }
  }
  if (!edges.length) return
  edges.sort((a, b) => a[0] - b[0])
  const xs = []
  const jStart = Math.max(0, Math.floor(j0))
  const jEnd = Math.min(H - 1, Math.ceil(j1))
  let first = 0
  for (let j = jStart; j <= jEnd; j++) {
    const y = j + 0.5
    xs.length = 0
    while (first < edges.length && edges[first][2] <= y && edges[first][0] <= y) first++
    for (let e = first; e < edges.length; e++) {
      const E = edges[e]
      if (E[0] > y) break
      if (E[2] <= y) continue
      xs.push(E[1] + ((y - E[0]) / (E[2] - E[0])) * (E[3] - E[1]))
    }
    xs.sort((a, b) => a - b)
    const row = j * W
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5))
      const b = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5))
      for (let i = a; i <= b; i++) grid[row + i] = value
    }
  }
}

export class PolityOverlay {
  /** data: from data/load.js; rect: the archipelago's world rect; uniforms: the shared bag. */
  constructor(data, rect, uniforms, warn = console.warn) {
    this.data = data
    this.rect = rect
    this.uniforms = uniforms
    this.polities = new Map((data.polities.polities || []).map((p) => [p.id, p]))
    const feats = (data.moku?.features || []).slice(0, 255)
    if ((data.moku?.features || []).length > 255) warn('more than 255 moku: the overlay shows the first 255')
    const w = rect.x1 - rect.x0
    const h = rect.z1 - rect.z0
    // about 150 m a texel, at most 4096 on the long side
    const long = Math.min(4096, Math.ceil(Math.max(w, h) / 1.5))
    this.W = Math.round(w >= h ? long : (long * w) / h)
    this.H = Math.round(w >= h ? (long * h) / w : long)
    this.grid = new Uint8Array(this.W * this.H)
    this.mokus = [null]
    feats.forEach((f, k) => {
      const p = f.properties || {}
      const name = p.name ?? p.moku ?? ''
      const isl = p.islandId || islandKey(p.island)
      const g = f.geometry
      const polys = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : []
      for (const poly of polys) fill(this.grid, this.W, this.H, rect, poly.map((r) => r.map((c) => data.proj.toWorld(c))), k + 1)
      this.mokus.push({ index: k + 1, name, island: p.island, islandKey: isl, key: p.mokuKey || `${isl}:${name}`, props: p })
    })
    // keys that only match without diacritics, so a typo in one file shows up in the console
    this.loose = new Map(this.mokus.slice(1).map((m) => [`${m.islandKey}:${strip(m.name)}`, m]))
    this.checkKeys(warn)

    const idTex = new THREE.DataTexture(this.grid, this.W, this.H, THREE.RedFormat, THREE.UnsignedByteType)
    idTex.minFilter = THREE.NearestFilter
    idTex.magFilter = THREE.NearestFilter
    idTex.unpackAlignment = 1
    idTex.needsUpdate = true
    this.idTex = idTex
    this.palette = new Uint8Array(256 * 2 * 4)
    const pal = new THREE.DataTexture(this.palette, 256, 2, THREE.RGBAFormat, THREE.UnsignedByteType)
    pal.minFilter = THREE.NearestFilter
    pal.magFilter = THREE.NearestFilter
    pal.needsUpdate = true
    this.palTex = pal
    uniforms.uMokuId.value = idTex
    uniforms.uMokuRect.value.set(rect.x0, rect.z0, rect.x1, rect.z1)
    uniforms.uPalette.value = pal
    this.eraKeys = [null, null]
  }

  checkKeys(warn) {
    const exact = new Set(this.mokus.slice(1).map((m) => m.key))
    const missing = new Set()
    for (const [era, map] of Object.entries(this.data.polities.byEra || {})) {
      for (const key of Object.keys(map)) {
        if (exact.has(key)) continue
        const [isl, ...rest] = key.split(':')
        const m = this.loose.get(`${islandKey(isl)}:${strip(rest.join(':'))}`)
        missing.add(m ? `${key} (${era}; the boundary file spells it "${m.name}")` : `${key} (${era})`)
      }
    }
    if (missing.size) warn(`polities.json names moku the boundary file doesn't have: ${[...missing].slice(0, 12).join(', ')}${missing.size > 12 ? ', …' : ''}`)
  }

  /** The polity holding moku m in era e, or null. */
  holder(e, m) {
    const map = e ? this.data.polities.byEra?.[e.id] : null
    if (!map) return null
    let id = map[m.key]
    if (id === undefined) {
      // (forgive a missing ʻokina or kahakō in the key, as checkKeys reported)
      for (const [k, v] of Object.entries(map)) {
        const [isl, ...rest] = k.split(':')
        if (islandKey(isl) === m.islandKey && strip(rest.join(':')) === strip(m.name)) {
          id = v
          break
        }
      }
    }
    return id ? this.polities.get(id) || { id, name: id, colour: '#cccccc' } : null
  }

  /** Fill the palette for the eras either side of the year, and the crossfade between them. */
  setEras(a, b, t) {
    const ka = a?.id ?? null
    const kb = b?.id ?? null
    if (ka !== this.eraKeys[0] || kb !== this.eraKeys[1]) {
      this.eraKeys = [ka, kb]
      const c = new THREE.Color()
      this.palette.fill(0)
      for (const [row, e] of [[0, a], [1, b]]) {
        for (const m of this.mokus.slice(1)) {
          const p = this.holder(e, m)
          if (!p) continue
          c.set(p.colour || '#cccccc')
          const k = (row * 256 + m.index) * 4
          // (sRGB bytes as authored; the shader linearises them)
          this.palette[k] = Math.round(c.r * 255)
          this.palette[k + 1] = Math.round(c.g * 255)
          this.palette[k + 2] = Math.round(c.b * 255)
          this.palette[k + 3] = 255
        }
      }
      this.palTex.needsUpdate = true
    }
    // the nearer era holds most of the interval; the change happens in its middle
    const s = Math.max(0, Math.min(1, (t - 0.35) / 0.3))
    this.uniforms.uEraMix.value = a === b ? 0 : s * s * (3 - 2 * s)
  }

  /** The moku under world (x, z), or null. */
  mokuAt(x, z) {
    const r = this.rect
    const i = Math.floor(((x - r.x0) / (r.x1 - r.x0)) * this.W)
    const j = Math.floor(((z - r.z0) / (r.z1 - r.z0)) * this.H)
    if (i < 0 || j < 0 || i >= this.W || j >= this.H) return null
    return this.mokus[this.grid[j * this.W + i]] || null
  }

  /** The polities that hold any moku in era e, for the legend. */
  politiesIn(e) {
    const seen = new Map()
    for (const m of this.mokus.slice(1)) {
      const p = this.holder(e, m)
      if (p) seen.set(p.id, p)
    }
    return [...seen.values()]
  }
}
