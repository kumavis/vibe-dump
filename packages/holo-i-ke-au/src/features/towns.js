// The settlements of every island, generated where the camera comes down
// (DESIGN.md §5.4), so a place painted as settled in a layer gets its
// villages and towns with nothing else to do: the same lots, dither ranks,
// era kits and values as the district's (settlements.js Scatter), read from
// the island's own settlement masks for the year at the island pack's grid
// (68 m a texel on Oʻahu, 150 m on Hawaiʻi), the stable noise breaking each
// coarse texel into hamlets and gaps.
//
// Nothing is stored and nothing is hand placed: a tile of 500 m is worked
// out from its masks when the camera's target comes within reach of it,
// every year at once (so the year can be dragged without working anything
// out again), seeded by where the tile is, so the same place and year always
// give the same houses; tiles behind the camera are let go, and an island the
// camera has left is let go whole a while after. A tile with no people in
// any keyframe and no zoning that would build is skipped at a glance.
//
// The refusals are the district's, at the island's grain: the water of the
// year (the island's patches laid on its heights by the year: harbours
// before they were dredged, reefs before they were filled), loʻi, fishponds
// and the village where a district's features.json has them and they stand,
// the works of the year (military land from its taking to its return,
// airfields, runways, highways and rail: features/works.js), the streams the
// heights route (drainage over a couple of square kilometres, a texel wide),
// and ground that falls more than the kind may take under its footprint.
//
// Where a district lies over the island (render/district.js), it places its
// own: inside its bounds by PART the island's buildings yield to the
// district's while it is down, dithered out over exactly the pixels the
// district's are dithered in over (kit.js uYield), and the district keeps its
// lots PART_GAP further in, so no building of one ever stands on another's.
// A hand-placed village (Kou) always wins: the island's lots refuse its
// outline while it stands, whether the district is down or not.
//
// The budget: one instanced mesh per kit, drawn from the tiles in view and
// within reach, at most MAX_DRAWN at once, fewer of each tile further out;
// tiles are built a few milliseconds a frame (a quarter of it, within
// BUDGET), nearest first.

import * as THREE from 'three'
import { Y, objectMaterial } from './kit.js'
import { buildKits } from './buildings.js'
import { decodeImage } from '../data/image.js'
import { decodeGrey } from '../data/layers.js'
import { holds, spanOf } from '../data/district.js'
import { distanceTransform, blur, drainageArea } from '../data/decode.js'
import { Scatter, KIND_NAMES, KIND, PADS, GRID_TILE, PART, ZONE_FLOOR, LIFT, clamp, smooth, mulberry32, vnoise, inside, loadZoning, classAt, islandMetres, valuePlaces, placeTerms, reachFor, censusOf } from './settlements.js'

// the camera's distance over which the island's buildings come in (as a
// district's do: config.js DISTRICT.rig)
const RIG = [95, 135]
const MAX_DRAWN = 6000
// how long an island's grids and tiles are kept after its buildings were last
// shown (s), and how far beyond the reach a tile is kept (world units)
const LINGER = 30
const KEEP = 1.5
// milliseconds a frame may spend building tiles: a share of the frame, within these
const BUDGET = [4, 40]
// a stream: this much ground drains through a texel (km²)
const STREAM_KM2 = 2
const smoothstep = smooth

/** The nearest distance from (x, z) to a rect. */
const rectDist = (r, x, z) => Math.hypot(Math.max(r.x0 - x, 0, x - r.x1), Math.max(r.z0 - z, 0, z - r.z1))

export class Towns {
  constructor(app) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'towns'
    this.group.visible = false
    app.scene.add(this.group)
    this.islands = new Map()
    this.yearNow = app.timeline.year
    // (bumped whenever tiles near a district come or go, so its trees' clearing is stamped again)
    this.version = 0
    this.hidden = false
    this.show = 0
    this.yieldU = { uYieldRect: { value: new THREE.Vector4(0, 0, -1, -1) }, uYield: { value: 0 } }
    this.manifest = null
    app.updaters.push((dt) => this.update(dt))
  }

  /** layers/manifest.json, once. */
  layers() {
    this.manifest ??= fetch(this.app.data.abs('layers/manifest.json')).then((r) => {
      if (!r.ok) throw new Error(`layers/manifest.json: HTTP ${r.status}`)
      return r.json()
    })
    return this.manifest
  }

  /** The district's inner box and weight, for the island's buildings to yield to. */
  updateYield() {
    const D = this.app.districts
    const rec = D?.cur
    const u = this.yieldU
    if (D?.on && rec?.features?.settlements?.ready) {
      const r = rec.d.rect
      u.uYieldRect.value.set(r.x0 + PART, r.z0 + PART, r.x1 - PART, r.z1 - PART)
      u.uYield.value = D.k
    } else {
      u.uYieldRect.value.set(0, 0, -1, -1)
      u.uYield.value = 0
    }
  }

  update(dt, budget = clamp((this.app.frameAvg ?? 16) * 0.25, BUDGET[0], BUDGET[1])) {
    const app = this.app
    const target = app.timeline.year
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    const D = app.rig.state.distance
    let show = 1 - smoothstep(RIG[0], RIG[1], D)
    if (this.hidden || !app.islandsLoaded) show = 0
    this.show = show
    this.group.visible = show > 0.001
    this.updateYield()
    const now = performance.now()
    if (this.group.visible) {
      const tgt = app.rig.state.target
      const R = reachFor(D)
      this.R = R
      const t0 = performance.now()
      for (const t of app.world.islands) {
        let isl = this.islands.get(t.pack.id)
        const k = t.slot >= 0 ? t.k : 0
        if (k <= 0.02 || rectDist(t.pack.rect, tgt.x, tgt.z) > R) {
          if (isl) isl.hide()
          continue
        }
        if (!isl) {
          isl = new IslandTowns(this, t)
          this.islands.set(t.pack.id, isl)
        }
        isl.lastSeen = now
        isl.update(tgt, R, show * smoothstep(0.6, 0.95, k), Math.max(0.5, budget - (performance.now() - t0)))
      }
    } else for (const isl of this.islands.values()) isl.hide()
    // (the tools' switch hides them without letting them go)
    for (const [id, isl] of this.islands) {
      if (this.hidden) isl.lastSeen = Math.max(isl.lastSeen, now)
      else if (now - isl.lastSeen > LINGER * 1000) {
        isl.dispose()
        this.islands.delete(id)
      }
    }
  }

  /** Straight to what the view wants (tools): every tile in reach built now, for the islands whose grids are in. */
  settle() {
    this.update(0, Infinity)
  }

  /** Whether everything the view wants is built (tools). */
  get idle() {
    if (!this.group.visible) return true
    for (const isl of this.islands.values()) if (isl.active && !isl.idle) return false
    return true
  }

  /** Stamp the island's buildings standing in a year inside `rect` (a district's) where they stand in its place (within PART of its edge), for its trees to keep out of: stamp(x, z, a, rx, rz, v). */
  stampInto(rect, y, stamp) {
    for (const isl of this.islands.values()) isl.stampInto(rect, y, stamp)
  }

  /** What stands in a year within `radius` of (x, z), on every island in: the instances, as the district's alive() gives them. */
  alive(year = this.yearNow, x = null, z = null, radius = Infinity) {
    const out = []
    for (const isl of this.islands.values()) out.push(...isl.alive(year, x, z, radius))
    return out
  }

  census(year = this.yearNow, x = null, z = null, radius = Infinity) {
    return censusOf(this.alive(year, x, z, radius))
  }

  stats() {
    return {
      show: +this.show.toFixed(2),
      year: +this.yearNow.toFixed(1),
      yield: +this.yieldU.uYield.value.toFixed(2),
      islands: [...this.islands.values()].map((i) => i.stats()),
      drawn: [...this.islands.values()].reduce((s, i) => s + i.drawn, 0),
    }
  }
}

// --- one island ------------------------------------------------------------------

class IslandTowns extends Scatter {
  constructor(towns, t) {
    super(towns.app)
    this.towns = towns
    this.t = t
    this.id = t.pack.id
    this.group = new THREE.Group()
    this.group.name = `towns ${this.id}`
    this.group.visible = false
    towns.group.add(this.group)
    this.tiles = new Map()
    this.ready = false
    this.failed = null
    this.active = false
    this.drawn = 0
    this.pending = 0
    this.lastSeen = performance.now()
    this.times = { build: 0, tiles: 0 }
    this.load().catch((err) => {
      this.failed = err.message
      this.app.warn(`towns ${this.id}: ${err.message} (its settlements are not drawn)`)
    })
  }

  // --- the masks and the ground -----------------------------------------------------

  async load() {
    const t0 = performance.now()
    const app = this.app
    const m = await this.towns.layers()
    const entry = m.islands?.[this.id]
    if (!entry) throw new Error('no settlement layer')
    this.setLayers(m)
    const files = this.layerFiles(entry)
    if (this.keyframes.length < 2 || files.some((f) => !f.settlement)) throw new Error('the settlement layer lacks a keyframe')
    const grey = (f) => decodeGrey(decodeImage, app.data.abs(`layers/${f}`))
    const [imgs, vals, zoning, patchList, works] = await Promise.all([
      Promise.all(files.map((f) => grey(f.settlement))),
      files.every((f) => f.value) ? Promise.all(files.map((f) => grey(f.value))).catch(() => null) : null,
      loadZoning(app, m, this.id),
      app.patches?.ready ?? [],
      // (the island's works: military land, fields, runways and roads keep the lots off their ground in their years)
      app.works?.exclusion(this.id) ?? null,
    ])
    if (this.disposed) return
    const t = this.t
    const { W, H } = t
    for (const img of [...imgs, ...(vals || [])]) if (img.W !== W || img.H !== H) throw new Error(`a layer is ${img.W}×${img.H}, the pack ${W}×${H}`)
    const r = t.pack.rect
    this.rect = r
    this.islandRect = r
    this.crop = { x0: r.x0, z0: r.z0, sx: (r.x1 - r.x0) / W, sz: (r.z1 - r.z0) / H, w: W, h: H }
    this.bytes = imgs.map((img) => img.px)
    this.values = vals ? vals.map((img) => img.px) : null
    this.zoning = { ...zoning, rect: r }
    this.places = valuePlaces(app, m)
    this.works = works
    this.townTerm(m, this.id, 'district')
    // (the patches of this island must be decoded before its ground is asked of)
    this.needPatches = (patchList || []).some((p) => p.pack === this.id)
    // the features of the districts over this island: loʻi, fishponds, the village
    this.features = []
    for (const d of app.districts?.list || []) {
      if (d.parent !== this.id) continue
      for (const { f } of d.rastered) {
        const ring = (f.geometry?.coordinates?.[0] || []).map((c) => app.data.proj.toWorld(c))
        if (ring.length < 3) continue
        const xs = ring.map((p) => p[0])
        const zs = ring.map((p) => p[1])
        this.features.push({ ring, p: f.properties || {}, box: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)] })
      }
    }
    await new Promise((res) => setTimeout(res, 0))
    if (this.disposed) return
    this.grounds()
    await new Promise((res) => setTimeout(res, 0))
    if (this.disposed) return
    // the years: every date a patch of this island or a feature over it changes the ground
    const breaks = new Set()
    for (const p of app.patches?.byPack?.get(this.id) || []) breaks.add(p.until)
    for (const p of patchList || []) if (p.pack === this.id) breaks.add(p.until)
    for (const f of this.features) {
      const [a, b] = spanOf(f.p)
      if (Number.isFinite(a)) breaks.add(a)
      if (Number.isFinite(b)) breaks.add(b + 1)
    }
    for (const y of this.works?.breaks || []) breaks.add(y)
    this.years(breaks)
    const y0 = app.timeline.yearAt(0)
    this.epochYear = [y0, ...this.edges]
    this.kits = buildKits(mulberry32(1820), PADS)
    this.meshes()
    // (a salt for the tiles' seeds, by the island's place in the manifest: the same every time)
    this.salt = 1 + app.world.islandPacks.findIndex((p) => p.id === this.id)
    this.loadMs = Math.round(performance.now() - t0)
    this.ready = true
  }

  /**
   * Grids over the island, once: the distance to today's sea (the coast's
   * weight and value, and the grid's direction away from it), its broad
   * slope, and the streams (drainage over STREAM_KM2) and the distance to
   * them; and per tile, whether anything could ever stand there.
   */
  grounds() {
    const t = this.t
    const { W, H } = t
    const r = this.rect
    const mx = ((r.x1 - r.x0) * 100) / W
    const mz = ((r.z1 - r.z0) * 100) / H
    this.mx = mx
    this.mz = mz
    const h = t.heights
    const toSea = distanceTransform(W, H, (c) => h[c] <= 0, mx, mz)
    this.sea = toSea
    this.broad = blur(Float32Array.from(toSea, (v) => Math.min(v, 3000)), W, H, Math.max(1, Math.round(290 / mx)), 3)
    const area = drainageArea(h, W, H, mx, mz)
    const on = new Uint8Array(W * H)
    for (let c = 0; c < W * H; c++) on[c] = area[c] >= STREAM_KM2 && h[c] > 0 ? 1 : 0
    this.streamOn = on
    this.toStream = distanceTransform(W, H, (c) => on[c] === 1, mx, mz)
    // per tile, the most any keyframe (or the zoning's floor) holds there
    const tw = Math.ceil((r.x1 - r.x0) / GRID_TILE)
    const th = Math.ceil((r.z1 - r.z0) / GRID_TILE)
    this.tw = tw
    this.th = th
    const most = new Float32Array(tw * th)
    const Z = this.zoning
    for (let j = 0; j < H; j++) {
      const tj = Math.min(th - 1, Math.floor(((j + 0.5) * this.crop.sz) / GRID_TILE))
      for (let i = 0; i < W; i++) {
        const c = j * W + i
        if (h[c] <= 0) continue
        const ti = Math.min(tw - 1, Math.floor(((i + 0.5) * this.crop.sx) / GRID_TILE))
        let v = 0
        for (const b of this.bytes) v = Math.max(v, b[c])
        if (Z.zoning) {
          const x = r.x0 + (i + 0.5) * this.crop.sx
          const z = r.z0 + (j + 0.5) * this.crop.sz
          if (ZONE_FLOOR[classAt(Z.zoning, r, x, z)]) v = 255
        }
        const q = tj * tw + ti
        if (v > most[q]) most[q] = v
      }
    }
    // (a neighbour's people can spill a texel or two into a tile through the noise and the filter)
    const spread = most.slice()
    for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const a = i + di
      const b = j + dj
      if (a >= 0 && b >= 0 && a < tw && b < th) spread[j * tw + i] = Math.max(spread[j * tw + i], most[b * tw + a] - 20)
    }
    this.most = spread
    this.ths = new Map()
  }

  /** A grid of the island's at world (x, z): nearest texel. */
  grid(a, x, z) {
    const c = this.crop
    const i = clamp(Math.floor((x - c.x0) / c.sx), 0, c.w - 1)
    const j = clamp(Math.floor((z - c.z0) / c.sz), 0, c.h - 1)
    return a[j * c.w + i]
  }

  /** The grid's direction over a tile (as Settlements.mauka): away from the sea, to a few degrees. */
  mauka(ti, tj) {
    const key = tj * this.tw + ti
    let th = this.ths.get(key)
    if (th !== undefined) return th
    const x = this.rect.x0 + (ti + 0.5) * GRID_TILE
    const z = this.rect.z0 + (tj + 0.5) * GRID_TILE
    const c = this.crop
    const g = this.broad
    const at = (i, j) => g[clamp(j, 0, c.h - 1) * c.w + clamp(i, 0, c.w - 1)]
    const i = Math.round((x - c.x0) / c.sx - 0.5)
    const j = Math.round((z - c.z0) / c.sz - 0.5)
    const D = Math.max(2, Math.round(240 / this.mx))
    const dx = at(i + D, j) - at(i - D, j)
    const dz = at(i, j + D) - at(i, j - D)
    const step = Math.PI / 60
    th = Math.hypot(dx, dz) < 1e-3 ? Math.PI / 2 : Math.round(Math.atan2(dz, dx) / step) * step
    this.ths.set(key, th)
    return th
  }

  /**
   * Whether this island's pack draws (x, z): where two packs' boxes overlap
   * (Maui's holds the north of Kahoʻolawe, both hold its people of 1778) the
   * point is the one's whose edge is further away, as the shaders' ownerAt
   * has it, so no place is built twice.
   */
  owns(x, z) {
    const e = (r) => Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z)
    const mine = e(this.rect)
    for (const p of this.app.world.islandPacks) if (p.id !== this.id && e(p.rect) > mine) return false
    return mine > 0
  }

  /** The ground's weight at a lot: flat, near the coast or a stream (about 1 on average). */
  weight(x, z) {
    const t = this.t
    const e = this.crop.sx
    const f = this.crop.sz
    const g = Math.hypot((t.metresAt(x + e, z) - t.metresAt(x - e, z)) / (2 * this.mx), (t.metresAt(x, z + f) - t.metresAt(x, z - f)) / (2 * this.mz))
    const near = Math.max(Math.exp(-this.grid(this.sea, x, z) / 700), Math.exp(-this.grid(this.toStream, x, z) / 160))
    return (0.55 + 0.8 * near) * (1 - 0.6 * smooth(0.08, 0.35, g))
  }

  /**
   * Whether a footprint may stand in epoch e, and the highest ground under
   * it (as Settlements.allows, on the island's ground): not on the water of
   * the year, a stream, a loʻi, a fishpond or the village while it stands,
   * nor where it falls more than `relief` metres.
   */
  allows(q, relief, e) {
    const { x, z, ax, az, a } = q
    const year = this.epochYear[e]
    const t = this.t
    const cx = Math.cos(a)
    const sx = -Math.sin(a)
    const ux = [cx, sx]
    const uz = [-sx, cx]
    let lo = Infinity
    let hi = -Infinity
    let top = -Infinity
    this.dep = false
    // the works standing in the year: military land, a field, a runway, a road (data/works.js)
    if (this.works) {
      const w = this.works.test(x, z, ax, az, a, year)
      if (w) this.dep = true
      if (w === 2) return null
    }
    const patched = this.patchBoxes
    // (the boxes round all the features and all the patches: most ground is in neither)
    const fb = this.featBox
    const pb = this.patchBox
    for (let p = 0; p < 13; p++) {
      const fu = p === 0 ? 0 : p < 5 ? [-1, 1, 1, -1][p - 1] : p < 9 ? [0, 1, 0, -1][p - 5] : [-1, 1, 1, -1][p - 9]
      const fv = p === 0 ? 0 : p < 5 ? [-1, -1, 1, 1][p - 1] : p < 9 ? [-1, 0, 1, 0][p - 5] : [-1, -1, 1, 1][p - 9]
      const grow = p >= 9 ? 1.25 : 1
      const px = x + (ux[0] * fu * ax + uz[0] * fv * az) * grow
      const pz = z + (ux[1] * fu * ax + uz[1] * fv * az) * grow
      // a loʻi, a fishpond or the village, while it stands
      if (px >= fb[0] && pz >= fb[1] && px <= fb[2] && pz <= fb[3]) for (const f of this.features) {
        const b = f.box
        if (px < b[0] || pz < b[1] || px > b[2] || pz > b[3]) continue
        if (!inside(f.ring, px, pz)) continue
        this.dep = true
        if (holds(f.p, year)) return null
      }
      if (p >= 9) continue
      if (this.grid(this.streamOn, px, pz)) return null
      const raw = t.metresAt(px, pz)
      let g = raw
      // (only where a patch's mask reaches is the ground of one year not every year's)
      if (px >= pb[0] && pz >= pb[1] && px <= pb[2] && pz <= pb[3]) for (const r of patched) {
        const b = r.box
        if (px < b[0] || pz < b[1] || px > b[2] || pz > b[3]) continue
        if (this.app.patches.maskAt(r.crop, (px - b[0]) / (b[2] - b[0]), (pz - b[1]) / (b[3] - b[1])) <= 0) continue
        this.dep = true
        g = islandMetres(this.app, t, px, pz, year)
        break
      }
      if (g < 0.6) return null
      lo = Math.min(lo, raw)
      hi = Math.max(hi, raw)
      top = Math.max(top, g)
    }
    if (hi - lo > relief) return null
    return top
  }

  // --- the tiles --------------------------------------------------------------------

  /** Work out one tile: its lots through the years, into packed instances. */
  buildTile(ti, tj) {
    const t0 = performance.now()
    const r = this.rect
    const x0 = r.x0 + ti * GRID_TILE
    const z0 = r.z0 + tj * GRID_TILE
    const tile = { ti, tj, n: 0, x0, z0 }
    const key = `${ti},${tj}`
    this.tiles.set(key, tile)
    if (this.most[tj * this.tw + ti] < 1) {
      tile.empty = true
      return tile
    }
    const th = this.mauka(ti, tj)
    const nb = (a, b) => (a < 0 || b < 0 || a >= this.tw || b >= this.th ? NaN : this.mauka(a, b))
    const pads = [nb(ti - 1, tj) !== th, nb(ti + 1, tj) !== th, nb(ti, tj - 1) !== th, nb(ti, tj + 1) !== th]
    const seed = (this.salt * 1000003 + tj * 4099 + ti) | 0
    const kb = new Float32Array(this.keyframes.length)
    const vb = new Float32Array(this.keyframes.length)
    const Z = this.zoning
    const keep = (x, z) => this.owns(x, z) && this.t.metresAt(x, z) > 0.3
    const list = []
    for (const l of this.tileLots(x0, z0, th, seed, pads, keep)) {
      this.bytesAt(l.x, l.z, kb)
      let vmaxB = 0
      for (const v of kb) vmaxB = Math.max(vmaxB, v)
      l.zone = classAt(Z.zoning, Z.rect, l.x, l.z)
      l.lud = classAt(Z.lud, Z.rect, l.x, l.z)
      l.zoned = !!Z.zoning
      const floor = ZONE_FLOOR[l.zone]
      if (floor) vmaxB = Math.max(vmaxB, (255 * Math.log(1 + floor / this.d0)) / this.L + 5)
      const fmax = this.fillMax(this.people(vmaxB))
      if (l.rank >= fmax * 1.5 && !(l.anchor && l.rankY < fmax * 1.5)) continue
      l.w = this.weight(l.x, l.z) * (0.85 + 0.3 * vnoise(l.x / 2.3, l.z / 2.3, 73))
      if (l.rank >= fmax * l.w && !(l.anchor && l.rankY < fmax * l.w)) continue
      l.b = Float32Array.from(kb)
      if (this.values) l.vb = Float32Array.from(this.sample(this.values, l.x, l.z, vb, 0))
      const nearSea = Math.exp(-this.grid(this.sea, l.x, l.z) / 600)
      const pt = placeTerms(this.places, l.x, l.z, nearSea)
      l.coast = nearSea
      l.harbour = pt.harbour
      l.centre = pt.centre
      list.push(l)
    }
    const inst = []
    const allows = (q, relief, e) => this.allows(q, relief, e)
    const cap = () => 1
    const emit = (it) => inst.push(it)
    for (const l of list) this.scatterLot(l, allows, cap, emit)
    // packed, in an order of its own (the first of them a fair thinning)
    const N = inst.length
    tile.n = N
    tile.lots = list.length
    if (N) {
      const rand = mulberry32(seed)
      const order = Int32Array.from({ length: N }, (_, i) => i)
      for (let a = N - 1; a > 0; a--) {
        const b = Math.floor(rand() * (a + 1))
        const tmp = order[a]
        order[a] = order[b]
        order[b] = tmp
      }
      tile.order = order
      tile.pos = new Float32Array(N * 4) // x, y, z, turn
      tile.scale = new Float32Array(N * 3) // across, up, the storeys' stretch
      tile.spans = new Float32Array(N * 4)
      tile.cols = new Float32Array(N * 3)
      tile.vOf = new Uint16Array(N)
      tile.kind = new Uint8Array(N)
      tile.site = new Int32Array(N)
      inst.forEach((it, i) => {
        tile.pos.set([it.x, it.y, it.z, it.a], i * 4)
        tile.scale.set([it.sh, it.sv, it.stretch], i * 3)
        tile.spans.set(it.span, i * 4)
        tile.cols.set(it.colour, i * 3)
        tile.vOf[i] = this.byKey.get(it.kind * 16 + it.variant)
        tile.kind[i] = it.kind
        tile.site[i] = it.site
      })
    }
    // (near a district, its trees' clearing wants stamping again)
    for (const d of this.app.districts?.list || []) if (rectDist(d.rect, x0 + GRID_TILE / 2, z0 + GRID_TILE / 2) < GRID_TILE) this.towns.version++
    this.times.tiles++
    this.times.build += performance.now() - t0
    return tile
  }

  /** Every frame it is wanted: tiles in reach built (nearest first, within the budget), those far behind let go, the draw refreshed. */
  update(target, R, show, budget) {
    this.active = true
    this.show = show
    if (!this.ready) {
      this.pending = 1
      return
    }
    if (this.needPatches && !this.app.patches?.loaded) {
      this.pending = 1
      return
    }
    // the patches on this island (the ground of a year differs only under them)
    if (!this.patchBoxes) {
      this.patchBoxes = this.app.patches?.byPack?.get(this.id) || []
      this.patchBox = this.patchBoxes.reduce((u, r) => [Math.min(u[0], r.box[0]), Math.min(u[1], r.box[1]), Math.max(u[2], r.box[2]), Math.max(u[3], r.box[3])], [Infinity, Infinity, -Infinity, -Infinity])
      this.featBox = this.features.reduce((u, f) => [Math.min(u[0], f.box[0]), Math.min(u[1], f.box[1]), Math.max(u[2], f.box[2]), Math.max(u[3], f.box[3])], [Infinity, Infinity, -Infinity, -Infinity])
    }
    const r = this.rect
    const i0 = clamp(Math.floor((target.x - R - r.x0) / GRID_TILE), 0, this.tw - 1)
    const i1 = clamp(Math.floor((target.x + R - r.x0) / GRID_TILE), 0, this.tw - 1)
    const j0 = clamp(Math.floor((target.z - R - r.z0) / GRID_TILE), 0, this.th - 1)
    const j1 = clamp(Math.floor((target.z + R - r.z0) / GRID_TILE), 0, this.th - 1)
    const want = []
    // (a tile wholly inside a district that is down waits until it is not: the district draws its own there)
    const yu = this.towns.yieldU
    const yr = yu.uYieldRect.value
    const yielded = yu.uYield.value >= 0.999
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (this.tiles.has(`${i},${j}`)) continue
        const cx = r.x0 + (i + 0.5) * GRID_TILE
        const cz = r.z0 + (j + 0.5) * GRID_TILE
        if (yielded && cx - GRID_TILE / 2 > yr.x && cz - GRID_TILE / 2 > yr.y && cx + GRID_TILE / 2 < yr.z && cz + GRID_TILE / 2 < yr.w) continue
        const d = Math.hypot(cx - target.x, cz - target.z)
        if (d > R + GRID_TILE) continue
        want.push([d, i, j])
      }
    }
    want.sort((a, b) => a[0] - b[0])
    const t0 = performance.now()
    let built = 0
    for (const [, i, j] of want) {
      if (built && performance.now() - t0 > budget) break
      this.buildTile(i, j)
      built++
    }
    this.pending = want.length - built
    // let go of what is far behind
    const far = R * KEEP + GRID_TILE
    for (const [k, tile] of this.tiles) {
      const cx = tile.x0 + GRID_TILE / 2
      const cz = tile.z0 + GRID_TILE / 2
      if (Math.hypot(cx - target.x, cz - target.z) <= far) continue
      this.tiles.delete(k)
      if (tile.n) for (const d of this.app.districts?.list || []) if (rectDist(d.rect, cx, cz) < GRID_TILE) this.towns.version++
    }
    this.group.visible = show > 0.001
    if (!this.group.visible) return
    this.material.uniforms.uShow.value = show
    this.material.uniforms.uYearNow.value = this.towns.yearNow
    this.material.uniforms.uFadeNear.value = R * 0.75
    this.material.uniforms.uFadeFar.value = R
    this.refresh(this.app.camera, R, this.t.pack.data.hi * this.app.world.uniforms.uVert.value + 3, built > 0)
  }

  get idle() {
    return !!(this.ready || this.failed) && !this.pending
  }

  hide() {
    this.active = false
    this.group.visible = false
    // (nothing of it drawn now; refilled whole when it is shown again)
    this.drawn = 0
    this.key = ''
  }

  // --- drawing -------------------------------------------------------------------

  meshes() {
    this.own = {
      uShow: { value: 0 },
      uFeatSeen: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uShadeS: { value: this.t.shadow.texture },
      uShadeRect: { value: this.t.rect },
      uYearNow: { value: this.towns.yearNow },
      ...this.towns.yieldU,
    }
    this.material = objectMaterial(this.app.shared, this.own, { fade: [50, 70], grow: true, yield: true })
    this.variants = []
    this.byKey = new Map()
    for (const name of KIND_NAMES) {
      this.kits[name].forEach((kit, v) => {
        this.byKey.set(KIND[name] * 16 + v, this.variants.length)
        this.variants.push({ name, v, kit, cap: 0, mesh: null })
      })
    }
    this.frustum = new THREE.Frustum()
    this.pv = new THREE.Matrix4()
    this.box = new THREE.Box3()
    this.m4 = new THREE.Matrix4()
    this.q = new THREE.Quaternion()
    this.up = new THREE.Vector3(0, 1, 0)
    this.v3 = new THREE.Vector3()
    this.s3 = new THREE.Vector3()
    this.key = ''
    this.yearDrawn = NaN
  }

  /** A variant's mesh, with room for n instances (grown by doubling, up to MAX_DRAWN). */
  room(vr, n) {
    if (vr.cap >= n && vr.mesh) return
    const cap = Math.min(MAX_DRAWN, Math.max(64, vr.cap * 2, n))
    if (vr.mesh) {
      this.group.remove(vr.mesh)
      vr.mesh.dispose()
    }
    const g = vr.kit.geometry
    const mesh = new THREE.InstancedMesh(g, this.material, cap)
    mesh.name = `${vr.name}-${vr.v}`
    mesh.count = 0
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3)
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
    const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4)
    aSpan.setUsage(THREE.DynamicDrawUsage)
    const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1)
    aStretch.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('aSpan', aSpan)
    g.setAttribute('aStretch', aStretch)
    Object.assign(vr, { mesh, cap, aSpan, aStretch })
    this.group.add(mesh)
  }

  /** Whether instance i of a tile stands at all within a year of y. */
  static aliveNear(tile, i, y) {
    const s = tile.spans
    return s[i * 4] < y + 1 && s[i * 4 + 3] > y - 1
  }

  /** Refill the draw buffers: the instances standing near the year in the tiles in view, within reach, thinned with distance. */
  refresh(camera, R, maxY, changed) {
    const y = this.towns.yearNow
    const p = camera.position
    this.pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.pv)
    const FULL = R * 0.7
    const tiles = []
    const yu = this.towns.yieldU
    const yr = yu.uYieldRect.value
    const yielded = yu.uYield.value >= 0.999
    let keyS = ''
    for (const tile of this.tiles.values()) {
      if (!tile.n) continue
      this.box.min.set(tile.x0, -0.5, tile.z0)
      this.box.max.set(tile.x0 + GRID_TILE, maxY, tile.z0 + GRID_TILE)
      const dd = this.box.distanceToPoint(p)
      if (dd > R || !this.frustum.intersectsBox(this.box)) continue
      // (wholly inside a district that is down: its own are drawn there)
      if (yielded && tile.x0 > yr.x && tile.z0 > yr.y && tile.x0 + GRID_TILE < yr.z && tile.z0 + GRID_TILE < yr.w) continue
      const f = dd < FULL ? 1 : FULL / dd
      tiles.push([tile, Math.round(f * 20)])
      keyS += `${tile.ti},${tile.tj}:${tiles[tiles.length - 1][1]};`
    }
    const D = this.app.districts
    const dOn = !!D?.on
    keyS += `${yielded ? 1 : 0}${dOn ? 1 : 0}`
    if (!changed && keyS === this.key && Math.abs(y - this.yearDrawn) < 0.5) return
    this.key = keyS
    this.yearDrawn = y
    let want = 0
    const alive = []
    for (const [tile, f] of tiles) {
      let n = 0
      for (let i = 0; i < tile.n; i++) if (IslandTowns.aliveNear(tile, i, y)) n++
      alive.push(n)
      want += Math.ceil((n * f) / 20)
    }
    const thin = Math.min(1, MAX_DRAWN / Math.max(1, want))
    // room for what each variant will take
    const need = new Int32Array(this.variants.length)
    const picks = []
    tiles.forEach(([tile, f], k) => {
      const take = Math.ceil((alive[k] * f * thin) / 20)
      let got = 0
      for (let o = 0; o < tile.n && got < take; o++) {
        const i = tile.order[o]
        if (!IslandTowns.aliveNear(tile, i, y)) continue
        if (yielded && tile.pos[i * 4] > yr.x && tile.pos[i * 4 + 2] > yr.y && tile.pos[i * 4] < yr.z && tile.pos[i * 4 + 2] < yr.w) continue
        picks.push(tile, i)
        need[tile.vOf[i]]++
        got++
      }
    })
    this.variants.forEach((vr, k) => {
      if (need[k]) this.room(vr, need[k])
      vr.c = 0
    })
    const dRect = dOn ? D.cur.d.rect : null
    const W = this.app.world
    for (let k = 0; k < picks.length; k += 2) {
      const tile = picks[k]
      const i = picks[k + 1]
      const vr = this.variants[tile.vOf[i]]
      if (vr.c >= vr.cap) continue
      const c = vr.c++
      let py = tile.pos[i * 4 + 1]
      const px = tile.pos[i * 4]
      const pz = tile.pos[i * 4 + 2]
      // (inside a district that is down its ground eases into the island's
      // toward its edge: the footing stands on the higher of the two)
      if (dRect && px > dRect.x0 && pz > dRect.z0 && px < dRect.x1 && pz < dRect.z1) {
        const kit = vr.kit
        const s = tile.scale[i * 3]
        let g = -Infinity
        for (const [u, v] of [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]]) g = Math.max(g, W.metresAt(px + u * kit.hx * s, pz + v * kit.hz * s))
        py = Math.max(py, Y(g) + LIFT)
      }
      this.q.setFromAxisAngle(this.up, tile.pos[i * 4 + 3])
      this.v3.set(px, py, pz)
      this.s3.set(tile.scale[i * 3], tile.scale[i * 3 + 1], tile.scale[i * 3])
      this.m4.compose(this.v3, this.q, this.s3)
      this.m4.toArray(vr.mesh.instanceMatrix.array, c * 16)
      vr.mesh.instanceColor.array.set(tile.cols.subarray(i * 3, i * 3 + 3), c * 3)
      vr.aSpan.array.set(tile.spans.subarray(i * 4, i * 4 + 4), c * 4)
      vr.aStretch.array[c] = tile.scale[i * 3 + 2]
    }
    this.drawn = 0
    for (const vr of this.variants) {
      if (!vr.mesh) continue
      vr.mesh.count = vr.c
      vr.mesh.visible = vr.c > 0
      vr.mesh.instanceMatrix.needsUpdate = true
      vr.mesh.instanceColor.needsUpdate = true
      vr.aSpan.needsUpdate = true
      vr.aStretch.needsUpdate = true
      this.drawn += vr.c
    }
  }

  // --- for the district and the tools ---------------------------------------------------

  /** How far instance i of a tile has faded in at a year. */
  static weightAt(tile, i, y) {
    const s = tile.spans
    return smooth(s[i * 4], s[i * 4 + 1], y) * (1 - smooth(s[i * 4 + 2], s[i * 4 + 3], y))
  }

  stampInto(rect, y, stamp) {
    if (!this.ready) return
    for (const tile of this.tiles.values()) {
      if (!tile.n || tile.x0 > rect.x1 || tile.z0 > rect.z1 || tile.x0 + GRID_TILE < rect.x0 || tile.z0 + GRID_TILE < rect.z0) continue
      for (let i = 0; i < tile.n; i++) {
        const px = tile.pos[i * 4]
        const pz = tile.pos[i * 4 + 2]
        // (only those standing where the district's own do not: within PART of its edge)
        if (Math.min(px - rect.x0, rect.x1 - px, pz - rect.z0, rect.z1 - pz) > PART) continue
        const w = IslandTowns.weightAt(tile, i, y)
        if (w < 0.02) continue
        const kit = this.variants[tile.vOf[i]].kit
        const s = tile.scale[i * 3]
        stamp(px, pz, tile.pos[i * 4 + 3], kit.hx * s * 0.95, kit.hz * s * 0.95, Math.round(255 * w))
      }
    }
  }

  alive(year, x = null, z = null, radius = Infinity) {
    const out = []
    if (!this.ready) return out
    for (const tile of this.tiles.values()) {
      if (!tile.n) continue
      if (x !== null && rectDist({ x0: tile.x0, z0: tile.z0, x1: tile.x0 + GRID_TILE, z1: tile.z0 + GRID_TILE }, x, z) > radius) continue
      for (let i = 0; i < tile.n; i++) {
        if (IslandTowns.weightAt(tile, i, year) < 0.999) continue
        const px = tile.pos[i * 4]
        const pz = tile.pos[i * 4 + 2]
        if (x !== null && Math.hypot(px - x, pz - z) > radius) continue
        const vr = this.variants[tile.vOf[i]]
        const s = tile.scale[i * 3]
        out.push({ island: this.id, site: tile.site[i] + tile.ti * 1e5 + tile.tj * 1e9, kind: vr.name, variant: vr.v, x: px, z: pz, a: tile.pos[i * 4 + 3], ax: vr.kit.hx * s, az: vr.kit.hz * s, box: vr.kit.box.map((v) => v * s), y: tile.pos[i * 4 + 1], height: vr.kit.top * tile.scale[i * 3 + 1] })
      }
    }
    return out
  }

  stats() {
    let n = 0
    let lots = 0
    let bytes = 0
    let built = 0
    for (const t of this.tiles.values()) {
      n += t.n
      lots += t.lots || 0
      if (!t.empty) built++
      for (const k of ['order', 'pos', 'scale', 'spans', 'cols', 'vOf', 'kind', 'site']) bytes += t[k]?.byteLength || 0
    }
    if (this.ready) for (const a of [this.sea, this.broad, this.toStream, this.streamOn, this.most, ...this.bytes]) bytes += a.byteLength
    return {
      island: this.id,
      ready: this.ready,
      failed: this.failed,
      tiles: this.tiles.size,
      worked: built,
      pending: this.pending,
      lots,
      instances: n,
      drawn: this.drawn,
      triangles: (this.variants || []).reduce((s, v) => s + (v.mesh ? v.mesh.count * v.kit.tris : 0), 0),
      zoning: this.zoning ? { zoning: this.zoning.zoning ? `${this.zoning.zoning.W}×${this.zoning.zoning.H}` : null, lud: this.zoning.lud ? `${this.zoning.lud.W}×${this.zoning.lud.H}` : null } : null,
      value: this.values ? 'mask' : 'modelled',
      towns: this.townTerms ?? null,
      loadMs: this.loadMs ?? null,
      buildMs: Math.round(this.times.build),
      msPerTile: this.times.tiles ? +(this.times.build / this.times.tiles).toFixed(2) : null,
      cpuMB: +(bytes / 1048576).toFixed(1),
    }
  }

  dispose() {
    this.disposed = true
    this.towns.group.remove(this.group)
    for (const vr of this.variants || []) {
      vr.mesh?.dispose()
      vr.kit.geometry.dispose()
    }
    this.material?.dispose()
    this.tiles.clear()
  }
}

