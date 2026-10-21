// The district close-up: a third level under its island, the way the islands
// are a level under the archipelago (render/world.js).
//
// districts/manifest.json is read behind the first frame. When the camera
// comes down within reach of a district (DISTRICT.prefetch), or a tour flight
// is headed into one, its pack is streamed: decoded in a worker
// (data/district.js), its textures handed to the GPU a frame at a time, its
// features built (features/index.js). Then it takes over from its island as
// an island takes over from the archipelago: it switches on at detail weight
// 0, which draws exactly the island's ground (common.glsl.js distWeight), and
// its 6 m eases in as the camera comes closer; on the way out it eases back
// to the island's and switches off. It is never more detailed than its island
// is (its weight is held under the island slot's), and it only comes down
// while the camera is close enough that the far view's overlays have gone
// (DISTRICT.rig), since it draws neither. One district is resident at a time;
// a while after the camera has left one it is let go, GPU and CPU both.
//
// Its mesh is the islands' CDLOD quadtree (pack.js) over its own grid: the
// finest level puts a vertex on every 6 m texel within a few hundred metres
// of the camera and the levels double from there, so a valley in view is a
// few hundred thousand vertices, not four million.
//
// The year is laid on its ground through uniforms every shader that reads
// the ground shares: each patch's weight (1 before its until, easing to 0
// across it), a raise patch's by its index and the lower patches' by the
// groups the patch map sorts their texels into (uDistRaise, uDistLower,
// common.glsl.js distPatched), and uFeatK, each rastered feature's weight (1
// while the year is within its from and to). metresAt() is the CPU copy of
// common.glsl.js distMetres, for the camera, picking and what stands on the
// ground.

import * as THREE from 'three'
import { DISTRICT, DIST_PATCHES, PATCH_EASE } from '../config.js'
import { PackTerrain, heightTexture } from './pack.js'
import { districtVertex, districtFragment, districtShadowFragment } from './shaders/district.glsl.js'
import { DIST_INDEX, DIST_POND_LEVEL } from './shaders/common.glsl.js'
import { loadDistricts, DistrictDecoder, districtPatches, holds, spanOf } from '../data/district.js'
import { fromHalf, loiLevel, patchLevel } from '../data/district-decode.js'
import { DistrictFeatures } from '../features/index.js'

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// half floats to floats, by table (the carve is read for every metresAt)
const HALF = new Float32Array(65536)
for (let h = 0; h < 65536; h++) HALF[h] = fromHalf(h)

export class Districts {
  constructor(app) {
    this.app = app
    this.world = app.world
    this.list = []
    this.loaded = false
    this.cur = null // the resident district: { d, state, data, terrain, features, … }
    this.k = 0
    this.want = 0
    // each patch's weight in the year, by its index in the district's list,
    // and the groups' (the most of their patches') with their depth
    this.patchW = new Float32Array(64).fill(1)
    this.groupK = new Float32Array(DIST_PATCHES)
    this.groupDepth = new Float32Array(DIST_PATCHES)
    this.featK = new Float32Array(64)
    this.featSeen = new Float32Array(64)
    this.u = this.world.uniforms
    this._frustum = new THREE.Frustum()
    this._m = new THREE.Matrix4()
    this._box = new THREE.Box3()
    this.lastSeen = 0
    this.log = []
  }

  /** The patch weights of the resident district, by patch, for the tools. */
  patchWeights() {
    const rec = this.cur
    if (!rec?.lower) return []
    return [...rec.raise, ...rec.lower].map((p, i) => ({ id: p.id, kind: p.kind, depth: p.depth, until: p.until, k: +this.patchW[i].toFixed(3) }))
  }

  /** The manifest and the features, behind the first frame, with the patches patches/manifest.json has for them. */
  async load() {
    const list = await loadDistricts(this.app.data, this.app.warn)
    const extra = (await this.app.patches?.ready) || []
    this.list = list
    this.setPatches(extra)
    this.loaded = true
  }

  /**
   * Each district's patches, its own and those `extra` lists for it; a
   * district that is down now is let go, and streams again with them.
   */
  setPatches(extra) {
    const warn = this.app.warn
    for (const d of this.list) d.patches = districtPatches(d, extra, warn)
    const islands = new Set(this.world.islandPacks.map((p) => p.id))
    for (const p of extra) if (!islands.has(p.pack) && !this.list.some((d) => d.id === p.pack)) warn(`patch ${p.id}: no pack or district ${p.pack} here; not drawn`)
    this.patchW.fill(1)
    if (this.cur) this.drop()
  }

  /** The district whose rect, grown by `pad` world units, holds (x, z). */
  districtAt(x, z, pad = 0) {
    for (const d of this.list) {
      const r = d.rect
      if (x > r.x0 - pad && x < r.x1 + pad && z > r.z0 - pad && z < r.z1 + pad) return d
    }
    return null
  }

  /** Start streaming the district at (x, z), if there is one: a flight is on its way there. */
  prefetch(x, z) {
    const d = this.districtAt(x, z, 20)
    if (d) {
      // (asked for ahead of the camera: held a while even if the camera is still far off)
      this.prefetchAt = performance.now()
      this.stream(d)
    }
    return d
  }

  /** Whether the district at (x, z) is decoded, on the GPU and built. */
  readyAt(x, z) {
    const d = this.districtAt(x, z)
    return !!d && this.cur?.d === d && this.cur.state === 'ready'
  }

  stream(d) {
    if (this.cur?.d === d) return
    // (its island must be in first: the district is laid over it)
    if (!this.world.terrains.get(d.parent)) {
      this.pending = d
      return
    }
    if (this.cur) this.drop()
    const rec = { d, state: 'loading', t0: performance.now() }
    this.cur = rec
    this.lastSeen = rec.t0
    this.decoder = this.decoder || new DistrictDecoder(this.app.warn)
    this.decoder
      .decode(d)
      .then((out) => {
        if (this.cur !== rec) return
        this.arrive(rec, out)
      })
      .catch((err) => {
        if (this.cur !== rec) return
        this.app.warn(`district ${d.id}: ${err.message}`)
        rec.state = 'failed'
      })
  }

  /** Decoded: build the textures, the mesh and the features, and queue the uploads. */
  arrive(rec, out) {
    const { d } = rec
    rec.decodeMs = Math.round(performance.now() - rec.t0)
    rec.data = out
    rec.metres = out.metres
    rec.aux = out.aux
    rec.carve = out.carve
    const pack = { id: d.id, name: d.name, rect: d.rect, W: d.W, H: d.H, rainUrl: d.rainUrl, data: { metres: out.metres, normals: out.normals, land: out.land, lo: out.lo, hi: out.hi } }
    rec.pack = pack
    const parentT = this.world.terrains.get(d.parent)
    // the island's maps under the district, wired as it comes and goes from its slot
    rec.parUniforms = {
      uParN: { value: parentT?.normalTex ?? null },
      uParL: { value: parentT?.landTex ?? null },
      uParS: { value: parentT?.shadow.texture ?? null },
      uParRect: { value: parentT ? parentT.rect : new THREE.Vector4(0, 0, 1, 1) },
      uParSlot: { value: -1 },
      uParRain: { value: parentT?.uniforms.uOwnRain.value ?? 1 },
    }
    const terrain = new PackTerrain(pack, this.world, [this.world.arch, parentT].filter(Boolean), {
      vertexShader: districtVertex,
      fragmentShader: districtFragment,
      shadowFragment: districtShadowFragment,
      shadowSize: 512,
      uniforms: { ...rec.parUniforms, uDistN: { value: null }, uDistL: { value: null }, uDistS: { value: null } },
    })
    for (const g of [terrain.full, terrain.half]) {
      const u = g.material.uniforms
      u.uDistN.value = terrain.normalTex
      u.uDistL.value = terrain.landTex
      u.uDistS.value = terrain.shadow.texture
    }
    terrain.group.visible = false
    terrain.applyRange(this.app.qset?.range ?? 4.6)
    if (this.app.params.get('debug')) for (const g of [terrain.full, terrain.half]) g.material.uniforms.uDebug.value = Number(this.app.params.get('debug'))
    rec.terrain = terrain
    rec.parent = parentT
    this.world.group.add(terrain.group)
    rec.heightTex = terrain.heightTex
    const aux = new THREE.DataTexture(out.aux, d.W, d.H, THREE.RGBAFormat, THREE.UnsignedByteType)
    aux.minFilter = aux.magFilter = THREE.NearestFilter
    aux.needsUpdate = true
    const carve = new THREE.DataTexture(out.carve, d.W, d.H, THREE.RGFormat, THREE.HalfFloatType)
    carve.minFilter = carve.magFilter = THREE.NearestFilter
    carve.needsUpdate = true
    rec.auxTex = aux
    rec.carveTex = carve
    // the patch map, over the box the patches reach (kept here too, for metresAt)
    rec.pmap = out.patchMap
    if (rec.pmap) {
      const pm = rec.pmap
      const t = new THREE.DataTexture(pm.data, pm.w, pm.h, THREE.RGBAFormat, THREE.UnsignedByteType)
      t.minFilter = t.magFilter = THREE.NearestFilter
      t.needsUpdate = true
      rec.patchTex = t
      rec.patchBox = new THREE.Vector4(pm.x0, pm.y0, pm.x0 + pm.w, pm.y0 + pm.h)
    }
    rec.lower = d.patches.filter((p) => p.kind === 'lower')
    rec.raise = d.patches.filter((p) => p.kind === 'raise')
    // onto the GPU a texture a frame, before it is let draw
    rec.uploads = [terrain.heightTex, aux, carve, terrain.normalTex, terrain.landTex, ...(rec.patchTex ? [rec.patchTex] : [])]
    rec.state = 'uploading'
    rec.features = new DistrictFeatures(this.app, this, rec)
    this.app.scene.add(rec.features.group)
    // (what the GPU and the features hold now is let go here: only the
    // heights, the aux map and the carve stay, for metresAt)
    out.normals = out.land = null
    out.trees = { counts: out.trees.counts }
    out.streams = null
    // (it arrives in the year as it stands: nothing eases in from another)
    this.patchW.fill(1)
    this.yearWeights(1)
  }

  /** Let the resident district go: off the GPU, out of memory. */
  drop() {
    const rec = this.cur
    if (!rec) return
    this.off()
    if (rec.terrain) {
      this.world.group.remove(rec.terrain.group)
      rec.terrain.dispose()
    }
    rec.auxTex?.dispose()
    rec.carveTex?.dispose()
    rec.patchTex?.dispose()
    if (rec.features) {
      this.app.scene.remove(rec.features.group)
      rec.features.dispose()
    }
    this.cur = null
    this.k = 0
  }

  /** Switch the district's ground off (the island draws it all again). */
  off() {
    const u = this.u
    u.uDistInfo.value.set(0, 0, DISTRICT.margin, DISTRICT.band)
    u.uDistH.value = this.world.dummy
    u.uDistAux.value = this.world.dummyAux
    u.uDistCarve.value = this.world.dummy
    u.uDistPatch.value = this.world.dummyAux
    u.uDistPatchBox.value.set(0, 0, 0, 0)
    if (this.cur?.terrain) this.cur.terrain.group.visible = false
    this.on = false
  }

  /**
   * The weights of the year: each patch's, and from them each group's and
   * each raise's uniform, and each rastered feature's (eased by `ease`; 1
   * settles them).
   */
  yearWeights(ease) {
    const rec = this.cur
    const year = this.app.timeline.year
    const pw = this.patchW
    if (rec?.lower) {
      const list = [...rec.raise, ...rec.lower]
      list.forEach((p, i) => {
        const want = year < p.until ? 1 : 0
        let v = pw[i] + (want - pw[i]) * ease
        if (Math.abs(v - want) < 0.002) v = want
        pw[i] = v
      })
      const nR = rec.raise.length
      const R = this.u.uDistRaise.value
      let top = -1e9
      for (let i = 0; i < DIST_PATCHES; i++) {
        R[i].set(i < nR ? pw[i] : 0, i < nR ? rec.raise[i].depth : 0, 0, 0)
        if (i < nR && pw[i] > 0) top = Math.max(top, rec.raise[i].depth)
      }
      // (ground above every raise's depth is none of theirs: common.glsl.js distPatched)
      this.u.uDistRaiseTop.value = top
      const L = this.u.uDistLower.value
      const groups = rec.pmap?.groups || [0]
      for (let g = 0; g < DIST_PATCHES; g++) {
        let k = 0
        let depth = -1
        const bits = groups[g] || 0
        rec.lower.forEach((p, i) => {
          if (bits & (1 << i) && pw[nR + i] > k) {
            k = pw[nR + i]
            depth = p.depth
          }
        })
        // (a group whose patches have all gone keeps the depth it had, so it eases out in place)
        if (k === 0 && bits) depth = rec.lower.find((_, i) => bits & (1 << i))?.depth ?? -1
        this.groupK[g] = k
        this.groupDepth[g] = depth
        L[g].set(k, depth, 0, 0)
      }
    }
    const fk = this.u.uFeatK.value
    if (rec) {
      for (const [i, f] of rec.d.byIndex) {
        const want = holds(f.properties, year) ? 1 : 0
        let v = this.featK[i] + (want - this.featK[i]) * ease
        if (Math.abs(v - want) < 0.002) v = want
        this.featK[i] = v
        // (seen: the feature has stood by now, and what it cleared stays clear)
        const seen = year >= spanOf(f.properties)[0] ? 1 : 0
        let s = this.featSeen[i] + (seen - this.featSeen[i]) * ease
        if (Math.abs(s - seen) < 0.002) s = seen
        this.featSeen[i] = s
        fk[i >> 2].setComponent(i & 3, v)
      }
    }
  }

  /** How much detail the camera wants from district d (0..1). */
  wantFor(d, camera, distance) {
    const r = d.rect
    const p = camera.position
    const dx = Math.max(r.x0 - p.x, 0, p.x - r.x1)
    const dz = Math.max(r.z0 - p.z, 0, p.z - r.z1)
    const dc = Math.hypot(dx, dz, Math.max(1, p.y))
    this.dc = dc
    this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this._frustum.setFromProjectionMatrix(this._m)
    this._box.min.set(r.x0, 0, r.z0)
    this._box.max.set(r.x1, Math.max(1, (this.cur?.data?.hi ?? 1000) * this.u.uVert.value), r.z1)
    if (!this._frustum.intersectsBox(this._box)) return 0
    return smooth(DISTRICT.far, DISTRICT.near, dc) * (1 - smooth(DISTRICT.rig[0], DISTRICT.rig[1], distance))
  }

  update(camera, distance, dt) {
    if (!this.loaded || !this.list.length) return
    if (this.pending && this.world.terrains.get(this.pending.parent)) {
      const d = this.pending
      this.pending = null
      this.stream(d)
    }
    // the nearest district to the camera, streamed once the camera is within reach
    const p = camera.position
    let near = null
    let best = Infinity
    for (const d of this.list) {
      const r = d.rect
      const e = Math.hypot(Math.max(r.x0 - p.x, 0, p.x - r.x1), Math.max(r.z0 - p.z, 0, p.z - r.z1), Math.max(1, p.y))
      if (e < best) {
        best = e
        near = d
      }
    }
    if (near && best < DISTRICT.prefetch && this.cur?.d !== near) this.stream(near)
    const rec = this.cur
    const ease = 1 - Math.exp(-dt * 2.5)
    this.yearWeights(dt > 0 ? 1 - Math.exp(-dt * PATCH_EASE) : 1)
    if (!rec) return
    if (rec.state === 'uploading') {
      const tex = rec.uploads.shift()
      if (tex) this.app.renderer.initTexture(tex)
      if (!rec.uploads.length) {
        rec.state = 'ready'
        rec.readyMs = Math.round(performance.now() - rec.t0)
      }
    }
    const parent = rec.parent
    const pk = parent && parent.slot >= 0 ? parent.k : 0
    const want = rec.state === 'ready' ? Math.min(this.wantFor(rec.d, camera, distance), pk) : 0
    this.want = want
    if (this.forceK !== null && this.forceK !== undefined && rec.state === 'ready' && pk > 0) this.k = Math.min(this.forceK, pk)
    else {
      this.k += (want - this.k) * ease
      if (Math.abs(want - this.k) < 0.004) this.k = want
      this.k = Math.min(this.k, pk)
    }
    const on = rec.state === 'ready' && pk > 0 && (this.k > 0 || want > 0)
    if (on) this.switchOn(rec)
    else if (this.on) this.off()
    if (on || this.k > 0) this.lastSeen = performance.now()
    // a while after it has gone and the camera is away, let it go (longer
    // after a tour has asked for it ahead of the camera)
    const since = Math.max(this.lastSeen, (this.prefetchAt ?? -1e9) + DISTRICT.hold * 1000)
    if (!on && best > DISTRICT.prefetch * 1.2 && performance.now() - since > DISTRICT.linger * 1000 && rec.state !== 'loading') this.drop()
    if (this.cur) {
      rec.terrain?.update(camera, this.on)
      rec.features?.update(dt, this.on ? this.k : 0, distance)
    }
  }

  switchOn(rec) {
    const u = this.u
    const parent = rec.parent
    u.uDistRect.value.copy(rec.terrain.rect)
    u.uDistInfo.value.set(this.k, 1, DISTRICT.margin, DISTRICT.band)
    u.uDistH.value = rec.heightTex
    u.uDistAux.value = rec.auxTex
    u.uDistCarve.value = rec.carveTex
    u.uDistPatch.value = rec.patchTex || this.world.dummyAux
    if (rec.patchBox) u.uDistPatchBox.value.copy(rec.patchBox)
    else u.uDistPatchBox.value.set(0, 0, 0, 0)
    const pu = rec.parUniforms
    pu.uParSlot.value = parent.slot
    pu.uParN.value = parent.normalTex
    pu.uParL.value = parent.landTex
    pu.uParS.value = parent.shadow.texture
    this.on = true
  }

  /** Cast shadows, with the islands' (world.js). */
  updateShadow(renderer, sun, vert, top) {
    if (this.on && this.cur?.terrain) this.cur.terrain.shadow.update(renderer, sun, vert, this.k, top)
  }

  /** Straight to what the view wants (tools): the weights of the year, and the detail if it is ready. */
  settle(camera, distance) {
    this.yearWeights(1)
    const rec = this.cur
    if (!rec || rec.state !== 'ready') return
    const parent = rec.parent
    const pk = parent && parent.slot >= 0 ? parent.k : 0
    this.k = Math.min(this.wantFor(rec.d, camera, distance), pk)
    if (this.k > 0) {
      this.switchOn(rec)
      rec.terrain.update(camera, true)
    } else if (this.on) this.off()
    rec.features?.settle(this.k, distance)
  }

  // --- the ground on the CPU ------------------------------------------------------

  /** How much of the district's own ground shows at (x, z): distWeight. */
  weightAt(x, z) {
    if (!this.on) return 0
    const r = this.cur.d.rect
    const e = Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z)
    return this.k * smooth(DISTRICT.band, DISTRICT.margin, e)
  }

  /** The patch map's four bytes at texel (i, j), or null outside its box: distPatchAt. */
  patchAt(i, j) {
    const pm = this.cur.pmap
    if (!pm || i < pm.x0 || j < pm.y0 || i >= pm.x0 + pm.w || j >= pm.y0 + pm.h) return null
    const k = ((j - pm.y0) * pm.w + (i - pm.x0)) * 4
    return pm.data.subarray(k, k + 4)
  }

  /** One texel as the year has it: distTexel (distPatched, then the features). */
  texel(i, j) {
    const rec = this.cur
    const W = rec.d.W
    const c = j * W + i
    let h = rec.metres[c]
    const a = rec.aux
    const q = this.patchAt(i, j)
    if (q && q[1] + q[3] > 0) {
      const R = this.u.uDistRaise.value
      const ra = R[q[2] & 15]
      const rb = R[q[2] >> 4]
      h += (Math.max(h, ra.y) - h) * (q[1] / 255) * ra.x
      h += (Math.max(h, rb.y) - h) * (q[3] / 255) * rb.x
    }
    const r = a[c * 4]
    if (r) {
      const g = q ? q[0] : 0
      h = patchLevel(h, r, this.groupK[g], HALF[rec.carve[c * 2]], this.groupDepth[g])
    }
    const f = a[c * 4 + 3]
    if (f > 0) {
      const k = this.featK[f]
      if (f < DIST_INDEX.pond) h += (loiLevel(h, HALF[rec.carve[c * 2]], a[c * 4 + 2]) - h) * (a[c * 4 + 1] / 255) * k
      else if (f < DIST_INDEX.other) h += (DIST_POND_LEVEL - h) * (a[c * 4 + 1] / 255) * k
    }
    return h
  }

  /** The district's ground at (x, z), bilinear, as the year has it: distMetres. */
  metresAt(x, z) {
    const { d } = this.cur
    const r = d.rect
    let fx = ((x - r.x0) / (r.x1 - r.x0)) * d.W - 0.5
    let fz = ((z - r.z0) / (r.z1 - r.z0)) * d.H - 0.5
    fx = Math.max(0, Math.min(d.W - 1.001, fx))
    fz = Math.max(0, Math.min(d.H - 1.001, fz))
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const a = this.texel(i, j) + (this.texel(i + 1, j) - this.texel(i, j)) * tx
    const b = this.texel(i, j + 1) + (this.texel(i + 1, j + 1) - this.texel(i, j + 1)) * tx
    return a + (b - a) * tz
  }

  /** The ground at (x, z) with the district over `island` (the islands' metres there). */
  blend(x, z, island) {
    const w = this.weightAt(x, z)
    return w > 0 ? island + (this.metresAt(x, z) - island) * w : island
  }

  /** Today's raw heights, for what is built on the ground of the year by hand (features). */
  rawAt(x, z) {
    const { d } = this.cur
    const r = d.rect
    const fx = Math.max(0, Math.min(d.W - 1, Math.floor(((x - r.x0) / (r.x1 - r.x0)) * d.W)))
    const fz = Math.max(0, Math.min(d.H - 1, Math.floor(((z - r.z0) / (r.z1 - r.z0)) * d.H)))
    return this.cur.metres[fz * d.W + fx]
  }

  /** What is loaded, for the tools. */
  stats() {
    const rec = this.cur
    if (!rec) return { district: null, loaded: this.loaded, count: this.list.length }
    const N = rec.d.W * rec.d.H
    // GPU: heights R32F, aux RGBA8, carve RG16F, and normals and land RGBA8 with mipmaps; the shadow map; the patch map
    const gpu = N * 4 + N * 4 + N * 4 + 2 * ((N * 4 * 4) / 3) + 512 * 512 + (rec.pmap ? rec.pmap.w * rec.pmap.h * 4 : 0)
    const cpu = rec.metres ? N * 4 + N * 4 + N * 4 : 0
    return {
      district: rec.d.id,
      state: rec.state,
      k: +this.k.toFixed(3),
      want: +this.want.toFixed(3),
      on: !!this.on,
      patches: this.patchWeights(),
      patchMap: rec.pmap ? { box: [rec.pmap.x0, rec.pmap.y0, rec.pmap.w, rec.pmap.h], groups: rec.pmap.groups.length - 1 } : null,
      decodeMs: rec.decodeMs ?? null,
      readyMs: rec.readyMs ?? null,
      workerMs: rec.data?.ms ?? null,
      gpuMB: +(gpu / 1048576).toFixed(1),
      cpuMB: +(cpu / 1048576).toFixed(1),
      nodes: rec.terrain ? rec.terrain.full.count + rec.terrain.half.count : 0,
      features: rec.features?.stats() ?? null,
    }
  }
}
