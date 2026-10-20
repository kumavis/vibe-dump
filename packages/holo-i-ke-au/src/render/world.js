// The ground: the archipelago pack, always drawn, and the island packs, which
// take over from it as the camera comes close.
//
// An island pack needs a slot to draw (there are SLOTS of them, config.js).
// In its slot it has a detail weight k that eases toward what the camera's
// distance asks for: 0 far off, 1 once the archipelago's texels would be
// bigger than a couple of pixels. At k = 0 the island shows the archipelago's
// own heights and maps (common.glsl.js), so the moment it takes a slot nothing
// changes on screen; its detail then morphs in, and on the way out it morphs
// back before it gives the slot up. No holes, no pops.
//
// Under an island, a district (render/district.js) can take over in the same
// way, a level further down; its uniforms are made here with the rest, so
// every material made from the shared bag has them from the start.
//
// The exaggeration of the moment (config.js) lives here too, as the shared
// uVert uniform, and metresAt() is the CPU copy of the shaders' groundMetres,
// for the camera, picking, the pins and the lines' bounds.

import * as THREE from 'three'
import { SLOTS, exaggeration } from '../config.js'
import { PackTerrain, heightTexture } from './pack.js'

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export class World {
  constructor(app, data) {
    this.app = app
    this.data = data
    this.packs = data.packs
    this.archPack = this.packs.find((p) => p.kind === 'archipelago') || this.packs[0]
    this.islandPacks = this.packs.filter((p) => p !== this.archPack)
    this.group = new THREE.Group()
    this.terrains = new Map()
    this.slots = new Array(SLOTS).fill(null)
    this.exag = exaggeration(5000)
    // debugging switches (the tools use them to check the hand-over): no
    // island packs at all, or every slotted pack held at one weight
    this.noIslands = false
    this.forceK = null
    const dummy = heightTexture(new Float32Array([-4000]), 1, 1)
    const dummyAux = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType)
    dummyAux.needsUpdate = true
    this.dummyAux = dummyAux
    this.uniforms = {
      uVert: { value: this.exag / 100 },
      uExag: { value: this.exag },
      uArchH: { value: dummy },
      uArchRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uSlotRect: { value: Array.from({ length: SLOTS }, () => new THREE.Vector4(0, 0, 1, 1)) },
      uSlotInfo: { value: Array.from({ length: SLOTS }, () => new THREE.Vector4(0, 0, 1, 0)) },
      // the district (render/district.js), off until one is down
      uDistRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uDistInfo: { value: new THREE.Vector4(0, 0, 1, 0) },
      uDistH: { value: dummy },
      uDistAux: { value: dummyAux },
      uDistCarve: { value: dummy },
      uPatchK: { value: 0 },
      uFeatK: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, 0)) },
    }
    this.district = null
    for (let s = 0; s < SLOTS; s++) this.uniforms[`uSlotH${s}`] = { value: dummy }
    this._frustum = new THREE.Frustum()
    this._m = new THREE.Matrix4()
    this._box = new THREE.Box3()
    this.dummy = dummy
  }

  /** The archipelago, decoded: the base everything else is laid over. */
  setArchipelago(pack) {
    const t = new PackTerrain(pack, this)
    t.setSelf(-1)
    this.arch = t
    this.terrains.set(pack.id, t)
    this.group.add(t.group)
    this.uniforms.uArchH.value = t.heightTex
    this.uniforms.uArchRect.value.copy(t.rect)
    const r = pack.rect
    this.bounds = { x0: r.x0, z0: r.z0, x1: r.x1, z1: r.z1 }
  }

  /** An island pack, decoded. It waits for a slot until the camera wants it. */
  addIsland(pack) {
    const t = new PackTerrain(pack, this, this.arch)
    t.k = 0
    t.want = 0
    t.slot = -1
    const r = pack.rect
    t.margin = Math.min(15, 0.08 * Math.min(r.x1 - r.x0, r.z1 - r.z0))
    t.group.visible = false
    this.terrains.set(pack.id, t)
    this.group.add(t.group)
    return t
  }

  get islands() {
    return [...this.terrains.values()].filter((t) => t !== this.arch)
  }

  /**
   * How much detail the camera wants from island pack t (0..1), and in
   * t.score how badly (unclamped, so the nearest packs win the slots).
   */
  wantFor(t, camera) {
    const r = t.pack.rect
    const p = camera.position
    const dx = Math.max(r.x0 - p.x, 0, p.x - r.x1)
    const dz = Math.max(r.z0 - p.z, 0, p.z - r.z1)
    const dc = Math.hypot(dx, dz, Math.max(1, p.y))
    // the archipelago's texel, in screen pixels, at that distance
    const f = (innerHeight || 800) / (2 * Math.tan((camera.fov * Math.PI) / 360))
    const px = (this.arch.texel * f) / dc
    t.score = px
    // (a pack wholly out of view gives its slot to one in it; it morphs back
    // in, never pops, if the camera turns to it)
    const top = Math.max(1, t.pack.data.hi * this.uniforms.uVert.value)
    this._box.min.set(r.x0, 0, r.z0)
    this._box.max.set(r.x1, top, r.z1)
    if (!this._frustum.intersectsBox(this._box)) return 0
    return smooth(1.0, 2.4, px)
  }

  update(camera, distance, dt) {
    // the exaggeration follows the camera's distance from its target
    this.exag = exaggeration(distance)
    this.uniforms.uExag.value = this.exag
    this.uniforms.uVert.value = this.exag / 100
    const isl = this.islands
    this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this._frustum.setFromProjectionMatrix(this._m)
    for (const t of isl) t.want = this.noIslands ? 0 : this.wantFor(t, camera)
    // the packs that may hold a slot: the SLOTS that want it most
    const ranked = isl.filter((t) => t.want > 0).sort((a, b) => b.score - a.score)
    const keep = new Set(ranked.slice(0, SLOTS))
    const ease = 1 - Math.exp(-dt * 2.5)
    for (const t of isl) {
      const goal = keep.has(t) ? t.want : 0
      if (t.slot >= 0) {
        t.k += (goal - t.k) * ease
        if (Math.abs(goal - t.k) < 0.004) t.k = goal
        if (t.k <= 0 && goal <= 0) this.release(t)
      } else if (goal > 0) {
        const free = this.slots.indexOf(null)
        if (free >= 0) this.assign(t, free)
      }
    }
    if (this.forceK !== null) for (const t of this.slots) if (t) t.k = this.forceK
    if (this.noIslands) for (const t of this.slots) if (t) this.release(t)
    const u = this.uniforms
    for (let s = 0; s < SLOTS; s++) {
      const t = this.slots[s]
      u.uSlotInfo.value[s].set(t ? t.k : 0, t ? 1 : 0, t ? t.margin : 1, 0)
    }
    this.arch.update(camera, true)
    for (const t of isl) t.update(camera, t.slot >= 0)
    // and under its island, the district
    this.district?.update(camera, distance, dt)
    // cast shadows follow the sun, the exaggeration and each island's weight
    const r = this.app.renderer
    const sun = this.app.light.sunDir
    const vert = this.uniforms.uVert.value
    const top = this.maxY + 0.1
    this.arch.shadow.update(r, sun, vert, 0, top)
    for (const t of isl) if (t.slot >= 0) t.shadow.update(r, sun, vert, t.k, top)
    this.district?.updateShadow(r, sun, vert, top)
  }

  /** Skip the easing: every pack straight to the detail the view wants (tools, tests). */
  settle(camera) {
    const isl = this.islands
    this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this._frustum.setFromProjectionMatrix(this._m)
    for (const t of isl) t.want = this.wantFor(t, camera)
    const ranked = isl.filter((t) => t.want > 0).sort((a, b) => b.score - a.score).slice(0, this.slots.length)
    for (const t of isl) if (t.slot >= 0 && !ranked.includes(t)) this.release(t)
    for (const t of ranked) {
      if (t.slot < 0) {
        const free = this.slots.indexOf(null)
        if (free < 0) continue
        this.assign(t, free)
      }
      t.k = t.want
    }
  }

  /** What is being drawn, for the tools. */
  stats() {
    const nodes = {}
    for (const [id, t] of this.terrains) if (t.group.visible) nodes[id] = t.full.count + t.half.count
    const d = this.district?.cur
    if (d?.terrain?.group.visible) nodes[d.d.id] = d.terrain.full.count + d.terrain.half.count
    return { exag: +this.exag.toFixed(2), nodes, slots: this.slots.map((t) => (t ? `${t.pack.id}:${t.k.toFixed(2)}` : null)), district: this.district?.stats() ?? null }
  }

  assign(t, s) {
    this.slots[s] = t
    t.slot = s
    t.k = 0
    t.setSelf(s)
    t.shadow.ever = false // (its map is drawn whole before it first shows)
    t.shadow.strip = -1
    t.shadow.drawn.vert = -1
    this.uniforms.uSlotRect.value[s].copy(t.rect)
    this.uniforms[`uSlotH${s}`].value = t.heightTex
  }

  release(t) {
    const s = t.slot
    if (s < 0) return
    this.slots[s] = null
    t.slot = -1
    t.k = 0
    this.uniforms[`uSlotH${s}`].value = this.dummy
    this.uniforms.uSlotInfo.value[s].set(0, 0, 1, 0)
  }

  /** Ground metres at world (x, z): groundMetres() in common.glsl.js, on the CPU. */
  metresAt(x, z) {
    const a = this.arch
    if (!a) return -4000
    const r = a.pack.rect
    let m = x < r.x0 || z < r.z0 || x > r.x1 || z > r.z1 ? -4000 : a.metresAt(x, z)
    let owner = null
    let best = 0
    for (const t of this.slots) {
      if (!t) continue
      const q = t.pack.rect
      const e = Math.min(x - q.x0, q.x1 - x, z - q.z0, q.z1 - z)
      if (e > best) {
        best = e
        owner = t
      }
    }
    if (owner) {
      const w = owner.k * smooth(0, owner.margin, best)
      if (w > 0) m += (owner.metresAt(x, z) - m) * w
    }
    return this.district?.on ? this.district.blend(x, z, m) : m
  }

  /** World Y of the ground (or the sea, at 0) at (x, z). */
  heightAt(x, z) {
    return Math.max(0, this.metresAt(x, z)) * this.uniforms.uVert.value
  }

  /** The highest the ground reaches anywhere, in world Y at the current exaggeration. */
  get maxY() {
    let hi = 0
    for (const t of this.terrains.values()) hi = Math.max(hi, t.pack.data.hi)
    return hi * this.uniforms.uVert.value
  }

  /** The island pack whose rect holds (x, z) most deeply, if any is loaded. */
  islandAt(x, z) {
    let best = null
    let e0 = 0
    for (const t of this.islands) {
      const q = t.pack.rect
      const e = Math.min(x - q.x0, q.x1 - x, z - q.z0, q.z1 - z)
      if (e > e0) {
        e0 = e
        best = t
      }
    }
    return best
  }

  setRange(k) {
    for (const t of this.terrains.values()) t.applyRange(k)
    this.district?.cur?.terrain?.applyRange(k)
  }

  setDebug(v) {
    for (const t of this.terrains.values()) t.uniforms.uDebug.value = v
    const d = this.district?.cur?.terrain
    if (d) for (const g of [d.full, d.half]) g.material.uniforms.uDebug.value = v
  }
}
