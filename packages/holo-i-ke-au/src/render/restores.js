// The restore patches (DATA.md "Patches, on any pack", "Accepted extensions
// (restore)"): the ground a road was cut into and raised on, laid back for
// the years before the road. Beside the raise and lower patches
// (render/patches.js), which lay a mask's texels at one depth, a restore
// patch carries a surface: per texel, the change from today's height to the
// ground as it was, and a weight.
//
// patches/manifest.json is read behind the first frame (main.js), the
// restore entries only. Every pack's patches go into one sparse atlas
// (RG32F, nearest): the pack's grid is cut into TILE × TILE squares, and only
// the squares a patch reaches are kept, each holding per texel the change
// times its weight (r) and the patch's index (g). A small index texture
// (R32F) says, per square of each pack, which square of the atlas holds it
// (0 none). Patches of one pack never share a texel (the bake gives each
// texel to the road nearest it), so one index per texel is enough. What the
// shaders get (common.glsl.js restoreSlot, distRestore) is the two textures,
// each slot's and the district's place in the index, and each patch's weight
// in the year, eased as the patches' are (config.js PATCH_EASE). apply() and
// texel() are the CPU copies, for world.metresAt and the district's.

import * as THREE from 'three'
import { PATCH_EASE, SLOTS, RESTORES, RESTORE_ISLANDS, OFF } from '../config.js'
import { decodeImage } from '../data/image.js'
import { loadRestoreManifest } from '../data/patches.js'

export const RESTORE_TILE = 16
const ROW = 64 // atlas squares a row

/** The uniforms the shaders read the restores from (world.js puts them in the shared bag). */
export function restoreUniforms() {
  const none = (format) => {
    const t = new THREE.DataTexture(new Float32Array(format === THREE.RGFormat ? 2 : 1), 1, 1, format, THREE.FloatType)
    t.needsUpdate = true
    return t
  }
  return {
    uRestAtlas: { value: none(THREE.RGFormat) },
    uRestIdx: { value: none(THREE.RedFormat) },
    uRestK: { value: Array.from({ length: RESTORES / 4 }, () => new THREE.Vector4(0, 0, 0, 0)) },
    // per slot: x the first row of its pack's squares in the index, y, z its squares across and down, w 1 while it has any;
    // and its pack's texels across and down, then the box (texels) its patches reach
    uRestSlot: { value: Array.from({ length: SLOTS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uRestSlotGrid: { value: Array.from({ length: SLOTS }, () => new THREE.Vector2(1, 1)) },
    uRestSlotBox: { value: Array.from({ length: SLOTS }, () => new THREE.Vector4(0, 0, -1, -1)) },
    // the district's, the same (its grid is its height texture's)
    uRestDist: { value: new THREE.Vector4(0, 0, 0, 0) },
    uRestDistBox: { value: new THREE.Vector4(0, 0, -1, -1) },
  }
}

export class Restores {
  constructor(app) {
    this.app = app
    this.world = app.world
    this.u = app.world.uniforms
    this.all = [] // the restore entries the manifest lists, described
    this.regions = new Map() // pack or district id → { W, H, tw, th, row, box, map: Int32Array square → atlas square + 1 }
    this.k = new Float32Array(RESTORES)
    this.loaded = false
    this.warned = false
    this.atlas = null
    this.index = null
  }

  /** The restore entries of patches/manifest.json under `base`, into their atlas; called again, it replaces what it had. */
  async load(base = this.app.params.get('patches') || this.app.data.base) {
    const warn = this.app.warn
    // (held off for a measure: config.js OFF)
    const list = OFF.has('restores') ? [] : await loadRestoreManifest(base, warn)
    // the grids: the island packs', and the districts' (from their manifest: they stream later)
    const grids = new Map(this.world.islandPacks.map((p) => [p.id, { W: p.W, H: p.H }]))
    try {
      const res = await fetch(new URL('districts/manifest.json', new URL(this.app.data.base, location.href)))
      if (res.ok) for (const d of (await res.json()).districts || []) grids.set(d.id, { W: d.size[0], H: d.size[1] })
    } catch {
      // (no districts: the islands' alone)
    }
    if (list.length > RESTORES) warn(`${list.length} restore patches; the first ${RESTORES} are drawn`)
    const T = RESTORE_TILE
    const regions = new Map()
    const tiles = [] // each square of the atlas: Float32Array(T·T·2)
    const recs = []
    for (const p of list.slice(0, RESTORES)) {
      const g = grids.get(p.pack)
      if (!g) {
        warn(`restore ${p.id}: no pack or district ${p.pack} here; not drawn`)
        continue
      }
      let img
      try {
        img = await decodeImage(p.url)
      } catch (err) {
        warn(`restore ${p.id}: ${err.message}`)
        continue
      }
      const [i0, j0, w, h] = p.box
      if (img.W !== w || img.H !== h) warn(`restore ${p.id}: ${p.url} is ${img.W}×${img.H}, the manifest says ${w}×${h}; read at its own size`)
      if (!regions.has(p.pack)) {
        const tw = Math.ceil(g.W / T)
        const th = Math.ceil(g.H / T)
        regions.set(p.pack, { id: p.pack, W: g.W, H: g.H, tw, th, row: 0, box: [Infinity, Infinity, -Infinity, -Infinity], map: new Int32Array(tw * th) })
      }
      const R = regions.get(p.pack)
      const n = recs.length
      for (let j = 0; j < img.H; j++) {
        for (let i = 0; i < img.W; i++) {
          const q = (j * img.W + i) * 4
          const wt = img.px[q + 2] / 255
          if (!wt) continue
          const gi = i0 + i
          const gj = j0 + j
          if (gi < 0 || gj < 0 || gi >= R.W || gj >= R.H) continue
          const s = Math.floor(gj / T) * R.tw + Math.floor(gi / T)
          if (!R.map[s]) {
            tiles.push(new Float32Array(T * T * 2))
            R.map[s] = tiles.length
          }
          const t = tiles[R.map[s] - 1]
          const c = ((gj % T) * T + (gi % T)) * 2
          t[c] = ((img.px[q] * 256 + img.px[q + 1]) * p.delta.scale + p.delta.offset) * wt
          t[c + 1] = n
          R.box[0] = Math.min(R.box[0], gi)
          R.box[1] = Math.min(R.box[1], gj)
          R.box[2] = Math.max(R.box[2], gi + 1)
          R.box[3] = Math.max(R.box[3], gj + 1)
        }
      }
      recs.push({ ...p, n, k: this.want(p) })
    }
    this.all = recs
    this.regions = regions
    for (const r of recs) this.k[r.n] = r.k
    this.build(tiles)
    this.loaded = true
    this.slotKey = ''
    this.write()
    return recs
  }

  /** The two textures: the atlas of squares, and every region's index one under another. */
  build(tiles) {
    this.atlas?.dispose()
    this.index?.dispose()
    this.atlas = this.index = null
    this.tiles = tiles
    const u = this.u
    const fresh = restoreUniforms()
    if (!tiles.length) {
      u.uRestAtlas.value = fresh.uRestAtlas.value
      u.uRestIdx.value = fresh.uRestIdx.value
      return
    }
    const T = RESTORE_TILE
    const rows = Math.ceil(tiles.length / ROW)
    const AW = Math.min(tiles.length, ROW) * T
    const AH = rows * T
    const a = new Float32Array(AW * AH * 2)
    tiles.forEach((t, k) => {
      const ox = (k % ROW) * T
      const oy = Math.floor(k / ROW) * T
      for (let j = 0; j < T; j++) a.set(t.subarray(j * T * 2, (j + 1) * T * 2), ((oy + j) * AW + ox) * 2)
    })
    const at = new THREE.DataTexture(a, AW, AH, THREE.RGFormat, THREE.FloatType)
    at.minFilter = at.magFilter = THREE.NearestFilter
    at.generateMipmaps = false
    at.needsUpdate = true
    let IW = 1
    let IH = 0
    for (const R of this.regions.values()) {
      R.row = IH
      IH += R.th
      IW = Math.max(IW, R.tw)
    }
    const idx = new Float32Array(IW * IH)
    for (const R of this.regions.values()) for (let j = 0; j < R.th; j++) for (let i = 0; i < R.tw; i++) idx[(R.row + j) * IW + i] = R.map[j * R.tw + i]
    const it = new THREE.DataTexture(idx, IW, IH, THREE.RedFormat, THREE.FloatType)
    it.minFilter = it.magFilter = THREE.NearestFilter
    it.generateMipmaps = false
    it.needsUpdate = true
    this.atlas = at
    this.index = it
    u.uRestAtlas.value = at
    u.uRestIdx.value = it
    this.atlasSize = [AW, AH]
  }

  /** A patch's weight wanted in the year: 1 before its until. */
  want(p, year = this.app.timeline.year) {
    return year < p.until ? 1 : 0
  }

  /** Every frame: each weight eased toward the year's (dt 0 settles them), and the slots' and the district's regions written. */
  update(dt) {
    if (!this.all.length) return
    const year = this.app.timeline.year
    const ease = dt > 0 ? 1 - Math.exp(-dt * PATCH_EASE) : 1
    for (const r of this.all) {
      const w = this.want(r, year)
      r.k += (w - r.k) * ease
      if (Math.abs(w - r.k) < 0.002) r.k = w
      this.k[r.n] = r.k
    }
    this.write()
  }

  settle() {
    this.update(0)
  }

  /** The uniforms: the weights, and where each slot's and the district's squares are. */
  write() {
    const u = this.u
    const K = u.uRestK.value
    for (let i = 0; i < K.length; i++) K[i].set(this.k[i * 4], this.k[i * 4 + 1], this.k[i * 4 + 2], this.k[i * 4 + 3])
    const set = (v, grid, box, R) => {
      if (!R) {
        v.set(0, 0, 0, 0)
        box?.set(0, 0, -1, -1)
        return
      }
      v.set(R.row, R.tw, R.th, 1)
      grid?.set(R.W, R.H)
      box?.set(R.box[0] - 1, R.box[1] - 1, R.box[2] + 1, R.box[3] + 1)
    }
    this.world.slots.forEach((t, s) => set(u.uRestSlot.value[s], u.uRestSlotGrid.value[s], u.uRestSlotBox.value[s], t && this.regions.get(t.pack.id)))
    const D = this.app.districts
    set(u.uRestDist.value, null, u.uRestDistBox.value, D?.cur && this.regions.get(D.cur.d.id))
  }

  /**
   * The change at texel (i, j) of region R, by the weights of the year
   * (restoreAt), or whole in the years before its patch's until when `year`
   * is given (for what is built on the ground of a year, not the one eased
   * to on screen), or whole whatever the year when `year` is true.
   */
  texelOf(R, i, j, year = null) {
    if (i < 0 || j < 0 || i >= R.W || j >= R.H) return 0
    const T = RESTORE_TILE
    const a = R.map[Math.floor(j / T) * R.tw + Math.floor(i / T)]
    if (!a) return 0
    const t = this.tiles[a - 1]
    const c = ((j % T) * T + (i % T)) * 2
    if (year === null) return t[c] * this.k[t[c + 1]]
    return year === true || year < this.all[t[c + 1]].until ? t[c] : 0
  }

  /** District `id`'s change at its texel (i, j): distRestore on the CPU (`year` as texelOf). */
  texel(id, i, j, year = null) {
    const R = this.regions.get(id)
    return R ? this.texelOf(R, i, j, year) : 0
  }

  /**
   * A district's trees (the decoder's lists, `stride` numbers a tree: x, z,
   * ground metres, ...) where a road raised the ground since, set on the
   * ground as it was: each then stands on the lower of today's ground and the
   * ground before the road, so it floats in neither, and is under the ground
   * (unseen) in the years it does not belong to.
   */
  sinkTrees(d, trees, stride) {
    const R = this.regions.get(d.id)
    // (once a list: the features may be built again on the same decode)
    if (!R || !trees?.lists || trees.sunk) return 0
    trees.sunk = true
    const r = d.rect
    let n = 0
    for (const list of trees.lists) {
      for (let b = 0; b + stride <= list.length; b += stride) {
        const i = Math.floor(((list[b] - r.x0) / (r.x1 - r.x0)) * R.W)
        const j = Math.floor(((list[b + 1] - r.z0) / (r.z1 - r.z0)) * R.H)
        const c = this.texelOf(R, i, j, true)
        if (c < 0) (list[b + 2] += c), n++
      }
    }
    return n
  }

  /** Island pack `id`'s heights h at world (x, z) with its restores of the year: restoreSlot on the CPU (`year` as texelOf). */
  apply(id, x, z, h, year = null) {
    const R = this.regions.get(id)
    if (!R) return h
    const t = this.world.terrains.get(id)
    const r = t?.pack.rect
    if (!r) return h
    const fx = Math.max(0, Math.min(R.W - 1.001, ((x - r.x0) / (r.x1 - r.x0)) * R.W - 0.5))
    const fz = Math.max(0, Math.min(R.H - 1.001, ((z - r.z0) / (r.z1 - r.z0)) * R.H - 0.5))
    const i = fx | 0
    const j = fz | 0
    if (i < R.box[0] - 1 || j < R.box[1] - 1 || i > R.box[2] || j > R.box[3]) return h
    const ax = fx - i
    const az = fz - j
    const at = (p, q) => this.texelOf(R, p, q, year)
    const a = at(i, j) + (at(i + 1, j) - at(i, j)) * ax
    const b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * ax
    return h + a + (b - a) * az
  }

  /** What is loaded and how each restore stands, for the tools. */
  /** Whether the islands' restores are laid (config.js RESTORE_ISLANDS); the district's always are. */
  get islandsOn() {
    return RESTORE_ISLANDS
  }

  stats() {
    return {
      loaded: this.loaded,
      listed: this.all.length,
      atlas: this.atlasSize || null,
      squares: this.tiles?.length || 0,
      kB: this.atlasSize ? Math.round((this.atlasSize[0] * this.atlasSize[1] * 8) / 1024) : 0,
      regions: [...this.regions.values()].map((R) => ({ id: R.id, squares: R.map.reduce((s, v) => s + (v ? 1 : 0), 0), box: R.box })),
      restores: this.all.map((r) => ({ id: r.id, pack: r.pack, until: r.until, k: +r.k.toFixed(3) })),
    }
  }
}
