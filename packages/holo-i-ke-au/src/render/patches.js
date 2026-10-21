// The patches on the island packs (DATA.md "Patches, on any pack";
// data/patches.js reads them): the ground of a year before its harbours were
// dredged and its reefs filled.
//
// patches/manifest.json is read behind the first frame (main.js). Every
// island patch's mask is decoded, cropped to where it marks anything, and
// packed with all the others into one small atlas (R8, linear, a texel of
// nothing round each crop so no crop bleeds into its neighbour); the masks
// themselves are let go. What the shaders get (common.glsl.js patches) is
// that one texture, and for each patch of the packs now in the slots its box
// in the world, its place in the atlas, and its weight, depth and kind, with
// each slot naming its own run of them, raises first. A pack out of its slot
// costs nothing but its crops in the atlas.
//
// Each patch's weight is 1 before its until and 0 after, eased over a couple
// of seconds as the year crosses it (config.js PATCH_EASE). apply() is the
// CPU copy of patchedMetres, for world.metresAt; the district's patches are
// handed on to it (render/district.js), which lays them on its own grid.

import * as THREE from 'three'
import { PATCHES, PATCH_EASE, SLOTS } from '../config.js'
import { loadPatchManifest, decodeMask, cropMask } from '../data/patches.js'

/** The uniforms the shaders read the patches from (world.js puts them in the shared bag). */
export function patchUniforms() {
  const none = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RedFormat, THREE.UnsignedByteType)
  none.needsUpdate = true
  return {
    uPatchMap: { value: none },
    uPatchBox: { value: Array.from({ length: PATCHES }, () => new THREE.Vector4(0, 0, 1, 1)) },
    uPatchUv: { value: Array.from({ length: PATCHES }, () => new THREE.Vector4(0, 0, 1, 1)) },
    uPatchInfo: { value: Array.from({ length: PATCHES }, () => new THREE.Vector4(0, -1, -1, 0)) },
    uSlotPatch: { value: Array.from({ length: SLOTS }, () => new THREE.Vector2(0, 0)) },
    uSlotPatchBox: { value: Array.from({ length: SLOTS }, () => new THREE.Vector4(0, 0, -1, -1)) },
  }
}

/** Shelves, tallest first, from a texel in: each crop's place in an atlas, and the atlas's size. */
function packAtlas(crops) {
  const GAP = 1
  const area = crops.reduce((s, c) => s + (c.w + GAP) * (c.h + GAP), 0)
  const widest = Math.max(...crops.map((c) => c.w)) + 2 * GAP
  const W = Math.min(4096, Math.max(widest, 64, Math.ceil(Math.sqrt(area * 1.25))))
  let x = GAP
  let y = GAP
  let shelf = 0
  for (const c of [...crops].sort((a, b) => b.h - a.h)) {
    if (x + c.w + GAP > W) {
      x = GAP
      y += shelf + GAP
      shelf = 0
    }
    c.ax = x
    c.ay = y
    x += c.w + GAP
    shelf = Math.max(shelf, c.h)
  }
  return { W, H: y + shelf + GAP }
}

export class Patches {
  constructor(app) {
    this.app = app
    this.world = app.world
    this.u = app.world.uniforms
    this.all = [] // every patch the manifest lists, described (data/patches.js)
    this.recs = [] // the island ones that are drawn, with their crops
    this.byPack = new Map() // island pack id → its recs, raises first
    this.loaded = false
    this.atlas = null
    this.warned = false
    this.ready = new Promise((r) => (this.resolveReady = r))
    this.slotKey = ''
  }

  /**
   * patches/manifest.json, from the data's own base, or `base` (?patches=,
   * or a tool's own); then the island masks into their atlas. Called again,
   * it replaces what it had.
   */
  async load(base = this.app.params.get('patches') || this.app.data.base) {
    const warn = this.app.warn
    const list = await loadPatchManifest(base, warn)
    // (the districts take theirs from here: render/district.js)
    const again = this.loaded
    this.all = list
    this.resolveReady(list)
    if (again) this.app.districts?.setPatches(list)
    const islands = new Map(this.world.islandPacks.map((p) => [p.id, p]))
    const recs = []
    for (const p of list) {
      const pack = islands.get(p.pack)
      if (!pack) continue
      try {
        const m = await decodeMask(p.url)
        const [w, h] = p.size || [pack.W, pack.H]
        if (m.W !== w || m.H !== h) warn(`patch ${p.id}: ${p.url} is ${m.W}×${m.H}, the manifest says ${w}×${h}; drawn at its own size`)
        const crop = cropMask(m.grey, m.W, m.H)
        if (!crop) {
          warn(`patch ${p.id}: its mask marks nothing`)
          continue
        }
        const r = pack.rect
        const sx = (r.x1 - r.x0) / m.W
        const sz = (r.z1 - r.z0) / m.H
        recs.push({
          ...p,
          crop,
          box: [r.x0 + crop.i0 * sx, r.z0 + crop.j0 * sz, r.x0 + (crop.i0 + crop.w) * sx, r.z0 + (crop.j0 + crop.h) * sz],
          k: this.want(p),
          depthM: p.depth,
        })
      } catch (err) {
        warn(`patch ${p.id}: ${err.message}`)
      }
    }
    this.setRecs(recs)
    this.loaded = true
    return list
  }

  /** The patches a district's pack carries, from this manifest (render/district.js adds its own). */
  forPack(id) {
    return this.all.filter((p) => p.pack === id)
  }

  setRecs(recs) {
    this.atlas?.dispose()
    this.atlas = null
    this.recs = recs
    this.byPack = new Map()
    for (const r of recs) {
      if (!this.byPack.has(r.pack)) this.byPack.set(r.pack, [])
      this.byPack.get(r.pack).push(r)
    }
    // raises first (DATA.md), each kind in the manifest's order
    for (const list of this.byPack.values()) list.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'raise' ? -1 : 1))
    if (recs.length) {
      const { W, H } = packAtlas(recs.map((r) => r.crop))
      const data = new Uint8Array(W * H)
      for (const { crop: c } of recs) for (let j = 0; j < c.h; j++) data.set(c.data.subarray(j * c.w, (j + 1) * c.w), (c.ay + j) * W + c.ax)
      const t = new THREE.DataTexture(data, W, H, THREE.RedFormat, THREE.UnsignedByteType)
      t.minFilter = t.magFilter = THREE.LinearFilter
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      t.generateMipmaps = false
      t.unpackAlignment = 1
      t.needsUpdate = true
      this.atlas = t
      this.atlasSize = [W, H]
      for (const r of recs) {
        const c = r.crop
        r.uv = [c.ax / W, c.ay / H, (c.ax + c.w) / W, (c.ay + c.h) / H]
      }
    }
    this.u.uPatchMap.value = this.atlas || patchUniforms().uPatchMap.value
    this.slotKey = ''
    this.write()
  }

  /** A patch's weight wanted in the year: 1 before its until. */
  want(p, year = this.app.timeline.year) {
    return year < p.until ? 1 : 0
  }

  /** Every frame: each weight eased toward the year's (dt 0 settles them), and the slots' runs written. */
  update(dt) {
    if (!this.recs.length) return
    const year = this.app.timeline.year
    const ease = dt > 0 ? 1 - Math.exp(-dt * PATCH_EASE) : 1
    for (const r of this.recs) {
      const w = this.want(r, year)
      r.k += (w - r.k) * ease
      if (Math.abs(w - r.k) < 0.002) r.k = w
    }
    this.write()
  }

  settle() {
    this.update(0)
  }

  /** The uniforms: the patches of the packs in the slots, in a run per slot. */
  write() {
    const u = this.u
    const box = u.uPatchBox.value
    const uv = u.uPatchUv.value
    const info = u.uPatchInfo.value
    const runs = u.uSlotPatch.value
    const boxes = u.uSlotPatchBox.value
    let n = 0
    let dropped = 0
    this.world.slots.forEach((t, s) => {
      const list = (t && this.byPack.get(t.pack.id)) || []
      const first = n
      let x0 = Infinity
      let z0 = Infinity
      let x1 = -Infinity
      let z1 = -Infinity
      for (const r of list) {
        // (a patch with no weight in the year is left out: nothing of it is drawn)
        if (r.k <= 0) continue
        if (n >= PATCHES) {
          dropped++
          continue
        }
        box[n].set(...r.box)
        uv[n].set(...r.uv)
        info[n].set(r.k, r.depthM, r.kind === 'raise' ? 1 : -1, 0)
        n++
        x0 = Math.min(x0, r.box[0])
        z0 = Math.min(z0, r.box[1])
        x1 = Math.max(x1, r.box[2])
        z1 = Math.max(z1, r.box[3])
      }
      runs[s].set(first, n - first)
      if (x1 >= x0) boxes[s].set(x0, z0, x1, z1)
      else boxes[s].set(0, 0, -1, -1)
    })
    if (dropped && !this.warned) {
      this.warned = true
      this.app.warn(`more than ${PATCHES} patches on the islands in view; ${dropped} of them are not drawn`)
    }
  }

  /** Pack `id`'s heights h at world (x, z), as the year has them: patchedMetres on the CPU. */
  apply(id, x, z, h) {
    const list = this.byPack.get(id)
    if (!list) return h
    for (const r of list) {
      if (r.k <= 0) continue
      const b = r.box
      const tx = (x - b[0]) / (b[2] - b[0])
      const tz = (z - b[1]) / (b[3] - b[1])
      if (tx < 0 || tz < 0 || tx > 1 || tz > 1) continue
      const w = this.maskAt(r.crop, tx, tz) * r.k
      if (w > 0) h += ((r.kind === 'raise' ? Math.max(h, r.depthM) : Math.min(h, r.depthM)) - h) * w
    }
    return h
  }

  /** A crop's mask (0..1) at (tx, tz) across it, bilinear as the GPU filters it, nothing beyond its edge. */
  maskAt(c, tx, tz) {
    const fx = tx * c.w - 0.5
    const fz = tz * c.h - 0.5
    const i = Math.floor(fx)
    const j = Math.floor(fz)
    const ax = fx - i
    const az = fz - j
    const at = (a, b) => (a < 0 || b < 0 || a >= c.w || b >= c.h ? 0 : c.data[b * c.w + a])
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * ax
    const bot = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * ax
    return (top + (bot - top) * az) / 255
  }

  /** What is loaded and how each patch stands, for the tools. */
  stats() {
    return {
      loaded: this.loaded,
      listed: this.all.length,
      atlas: this.atlasSize || null,
      kB: this.atlasSize ? Math.round((this.atlasSize[0] * this.atlasSize[1]) / 1024) : 0,
      islands: this.recs.map((r) => ({ id: r.id, pack: r.pack, kind: r.kind, depth: r.depthM, until: r.until, k: +r.k.toFixed(3), box: r.box.map((v) => +v.toFixed(3)), texels: r.crop.w * r.crop.h })),
      inSlots: this.u.uSlotPatch.value.map((v) => v.y),
    }
  }
}
