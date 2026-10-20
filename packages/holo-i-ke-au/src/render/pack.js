// One pack's surface, drawn with CDLOD (Strugar 2010) as in ahupuaʻa.
//
// One small grid mesh is instanced over a quadtree of square nodes, big far
// from the camera and small near it, every node the same vertex count, and the
// vertex shader lifts each vertex from the pack's height texture. Packs are
// not square: the quadtree's root is the square on the pack's longer side,
// anchored at its north-west corner, and nodes that fall wholly outside the
// rect are never drawn. The finest level puts a vertex on every texel.
//
// Heights are metres throughout; node boxes are turned into world Y with the
// exaggeration of the moment, so the selection follows it as the camera zooms.

import * as THREE from 'three'
import { terrainVertex, terrainFragment } from './shaders/terrain.glsl.js'
import { PackShadow } from './shadow.js'

const GRID = 32 // quads per node edge
const MAX_NODES = 1600
// the deep sea floor never shows through the water, which is opaque past a
// few decimetres (ocean.glsl.js), so nodes lying wholly below this are skipped
const SEA_CULL = -0.5

export function heightTexture(metres, W, H) {
  const t = new THREE.DataTexture(metres, W, H, THREE.RedFormat, THREE.FloatType)
  t.minFilter = THREE.NearestFilter
  t.magFilter = THREE.NearestFilter
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.needsUpdate = true
  return t
}

function mapTexture(data, W, H, anisotropy = 1) {
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.UnsignedByteType)
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.magFilter = THREE.LinearFilter
  t.generateMipmaps = true
  t.anisotropy = anisotropy
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.needsUpdate = true
  // once on the GPU the bytes aren't needed again (only the heights are read
  // on the CPU), and nine packs of them are worth a hundred megabytes
  t.onUpdate = () => {
    t.image.data = null
    t.onUpdate = null
  }
  return t
}

export class PackTerrain {
  /**
   * pack: a described pack (data/load.js) with its decoded `data`.
   * world: the World (render/world.js), whose shared uniforms this draws with.
   * base: for an island pack, the archipelago's PackTerrain (its heights are
   * folded into the node bounds, since an island at low weight shows them).
   */
  constructor(pack, world, base = null) {
    this.pack = pack
    this.world = world
    const d = pack.data
    const { W, H } = pack
    const { x0, z0, x1, z1 } = pack.rect
    this.rect = new THREE.Vector4(x0, z0, x1, z1)
    this.heights = d.metres
    this.W = W
    this.H = H
    const aniso = world.app.renderer.capabilities.getMaxAnisotropy()
    this.heightTex = heightTexture(d.metres, W, H)
    this.normalTex = mapTexture(d.normals, W, H, Math.min(8, aniso))
    this.landTex = mapTexture(d.land, W, H, Math.min(4, aniso))
    d.normals = null
    d.land = null

    const texel = Math.max((x1 - x0) / W, (z1 - z0) / H)
    this.texel = texel
    const side = Math.max(x1 - x0, z1 - z0)
    this.levels = Math.max(1, Math.ceil(Math.log2(side / (GRID * texel))) + 1)
    this.leafSize = side / 2 ** (this.levels - 1)
    this.buildMinMax(base)

    this.full = this.makeGrid(GRID)
    this.half = this.makeGrid(GRID / 2)
    this.morph = []
    for (let l = 0; l < 12; l++) this.morph.push(new THREE.Vector2())
    const shared = world.uniforms
    const arch = base || this
    this.uniforms = {
      ...shared,
      uOwnH: { value: this.heightTex },
      uOwnRect: { value: this.rect },
      uOwnN: { value: this.normalTex },
      uOwnL: { value: this.landTex },
      uArchN: { value: arch.normalTex },
      uArchL: { value: arch.landTex },
      uOwnS: { value: null },
      uSelf: { value: -1 },
      // (an island without its own rain image takes the archipelago's)
      uOwnRain: { value: base && !pack.rainUrl ? 0 : 1 },
      uMorph: { value: this.morph },
      uCamPos: { value: new THREE.Vector3() },
      uKau: { value: 0.5 },
      uDebug: { value: 0 },
    }
    this.group = new THREE.Group()
    for (const grid of [this.full, this.half]) {
      grid.material = new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        uniforms: { ...this.uniforms, uGrid: { value: grid.dim } },
      })
      grid.mesh = new THREE.Mesh(grid.geometry, grid.material)
      grid.mesh.frustumCulled = false
      grid.mesh.matrixAutoUpdate = false
      this.group.add(grid.mesh)
    }
    this.shadow = new PackShadow(this)
    this.uniforms.uOwnS.value = this.shadow.texture
    this._frustum = new THREE.Frustum()
    this._m = new THREE.Matrix4()
    this._box = new THREE.Box3()
    this.rangeK = 3.5
    this.applyRange(this.rangeK)
  }

  makeGrid(dim) {
    const g = new THREE.InstancedBufferGeometry()
    const verts = new Float32Array((dim + 1) * (dim + 1) * 3)
    for (let j = 0; j <= dim; j++) {
      for (let i = 0; i <= dim; i++) {
        const k = (j * (dim + 1) + i) * 3
        verts[k] = i / dim
        verts[k + 2] = j / dim
      }
    }
    const idx = []
    for (let j = 0; j < dim; j++) {
      for (let i = 0; i < dim; i++) {
        const a = j * (dim + 1) + i
        const b = a + 1
        const c = a + dim + 1
        const d = c + 1
        // alternate the diagonal so the mesh has no directional bias
        if ((i + j) & 1) idx.push(a, c, b, b, c, d)
        else idx.push(a, c, d, a, d, b)
      }
    }
    g.setIndex(idx)
    g.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    const data = new Float32Array(MAX_NODES * 4)
    const attr = new THREE.InstancedBufferAttribute(data, 4)
    attr.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('aNode', attr)
    g.instanceCount = 0
    return { dim, geometry: g, data, attr, count: 0 }
  }

  /** Per-node min/max heights (metres), as a pyramid over leaf squares; leaves off the rect are empty. */
  buildMinMax(base) {
    const { W, H, heights } = this
    const r = this.pack.rect
    const leaves = 2 ** (this.levels - 1)
    const L = this.leafSize
    const sx = W / (r.x1 - r.x0)
    const sz = H / (r.z1 - r.z0)
    let lo = new Float32Array(leaves * leaves).fill(Infinity)
    let hi = new Float32Array(leaves * leaves).fill(-Infinity)
    for (let bj = 0; bj < leaves; bj++) {
      const za = bj * L
      if (za >= r.z1 - r.z0) continue
      const j0 = Math.max(0, Math.floor(za * sz) - 1)
      const j1 = Math.min(H - 1, Math.ceil((za + L) * sz) + 1)
      for (let bi = 0; bi < leaves; bi++) {
        const xa = bi * L
        if (xa >= r.x1 - r.x0) continue
        const i0 = Math.max(0, Math.floor(xa * sx) - 1)
        const i1 = Math.min(W - 1, Math.ceil((xa + L) * sx) + 1)
        let a = Infinity
        let b = -Infinity
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const v = heights[j * W + i]
            if (v < a) a = v
            if (v > b) b = v
          }
        }
        if (base) {
          // what the archipelago has here too, since a fading island shows it
          for (let j = j0; j <= j1; j += 2) {
            for (let i = i0; i <= i1; i += 2) {
              const v = base.metresAt(r.x0 + (i + 0.5) / sx, r.z0 + (j + 0.5) / sz)
              if (v < a) a = v
              if (v > b) b = v
            }
          }
          a -= 40
          b += 40
        }
        lo[bj * leaves + bi] = a
        hi[bj * leaves + bi] = b
      }
    }
    this.mm = [{ lo, hi, n: leaves }]
    let n = leaves
    while (n > 1) {
      const m = n / 2
      const lo2 = new Float32Array(m * m)
      const hi2 = new Float32Array(m * m)
      for (let j = 0; j < m; j++) {
        for (let i = 0; i < m; i++) {
          const a = 2 * j * n + 2 * i
          lo2[j * m + i] = Math.min(lo[a], lo[a + 1], lo[a + n], lo[a + n + 1])
          hi2[j * m + i] = Math.max(hi[a], hi[a + 1], hi[a + n], hi[a + n + 1])
        }
      }
      lo = lo2
      hi = hi2
      n = m
      this.mm.push({ lo, hi, n })
    }
  }

  /** Bilinear metres from this pack alone, matching the shader's rectMetres. */
  metresAt(x, z) {
    const r = this.pack.rect
    const { W, H, heights } = this
    let fx = ((x - r.x0) / (r.x1 - r.x0)) * W - 0.5
    let fz = ((z - r.z0) / (r.z1 - r.z0)) * H - 0.5
    if (fx < 0) fx = 0
    else if (fx > W - 1.001) fx = W - 1.001
    if (fz < 0) fz = 0
    else if (fz > H - 1.001) fz = H - 1.001
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const k = j * W + i
    const a = heights[k] + (heights[k + 1] - heights[k]) * tx
    const b = heights[k + W] + (heights[k + W + 1] - heights[k + W]) * tx
    return a + (b - a) * tz
  }

  /** Detail knob: how many leaf sizes the finest level reaches (the quality governor moves it). */
  applyRange(k) {
    this.rangeK = k
    const r0 = k * this.leafSize
    this.ranges = []
    for (let l = 0; l < this.levels; l++) this.ranges.push(r0 * 2 ** l)
    this.ranges[this.levels - 1] = 1e9
    for (let l = 0; l < this.levels; l++) {
      const r = this.ranges[l]
      const prev = l > 0 ? this.ranges[l - 1] : 0
      this.morph[l].set(prev + (r - prev) * 0.5, r * 0.97)
    }
  }

  setSelf(slot) {
    this.uniforms.uSelf.value = slot
    for (const g of [this.full, this.half]) g.material.uniforms.uSelf.value = slot
  }

  update(camera, visible) {
    this.group.visible = visible
    this.full.count = 0
    this.half.count = 0
    if (visible) {
      this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      this._frustum.setFromProjectionMatrix(this._m)
      this.cam = camera.position
      this.vert = this.world.uniforms.uVert.value
      this.uniforms.uCamPos.value.copy(camera.position)
      this.select(0, 0, this.levels - 1)
    }
    for (const grid of [this.full, this.half]) {
      grid.geometry.instanceCount = grid.count
      grid.attr.needsUpdate = true
    }
  }

  nodeBox(i, j, lod) {
    const level = this.mm[lod]
    const size = this.leafSize * 2 ** lod
    const x0 = this.pack.rect.x0 + i * size
    const z0 = this.pack.rect.z0 + j * size
    const v = this.vert
    const lo = Math.min(0, level.lo[j * level.n + i]) * v - 0.3
    const hi = Math.max(0, level.hi[j * level.n + i]) * v + 0.1
    this._box.min.set(x0, lo, z0)
    this._box.max.set(x0 + size, hi, z0 + size)
    return this._box
  }

  // CDLOD selection. Returns false when the node is out of its own LOD's range
  // (so the parent must cover it); true when handled (drawn, or culled).
  select(i, j, lod) {
    const level = this.mm[lod]
    const hiM = level.hi[j * level.n + i]
    if (!(hiM >= SEA_CULL)) return true // (empty, or all deep sea)
    const box = this.nodeBox(i, j, lod)
    if (box.distanceToPoint(this.cam) > this.ranges[lod]) return false
    if (!this._frustum.intersectsBox(box)) return true
    const size = this.leafSize * 2 ** lod
    if (lod === 0) {
      this.emit(this.full, i, j, size, 0)
      return true
    }
    if (this.nodeBox(i, j, lod).distanceToPoint(this.cam) > this.ranges[lod - 1]) {
      this.emit(this.full, i, j, size, lod)
      return true
    }
    for (let q = 0; q < 4; q++) {
      const ci = i * 2 + (q & 1)
      const cj = j * 2 + (q >> 1)
      if (!this.select(ci, cj, lod - 1)) {
        // the child is beyond the finer range: draw that quarter at this level
        const cl = this.mm[lod - 1]
        if (!(cl.hi[cj * cl.n + ci] >= SEA_CULL)) continue
        const cb = this.nodeBox(ci, cj, lod - 1)
        if (!this._frustum.intersectsBox(cb)) continue
        this.emit(this.half, ci, cj, size / 2, lod)
      }
    }
    return true
  }

  emit(grid, i, j, size, lod) {
    if (grid.count >= MAX_NODES) return
    const k = grid.count * 4
    grid.data[k] = this.pack.rect.x0 + i * size
    grid.data[k + 1] = this.pack.rect.z0 + j * size
    grid.data[k + 2] = size
    grid.data[k + 3] = lod
    grid.count++
  }

  dispose() {
    for (const g of [this.full, this.half]) {
      g.geometry.dispose()
      g.material.dispose()
    }
    this.shadow.dispose()
    this.heightTex.dispose()
    this.normalTex.dispose()
    this.landTex.dispose()
  }
}
