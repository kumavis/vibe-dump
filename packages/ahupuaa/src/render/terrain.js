// The island surface, drawn with CDLOD (Strugar 2010).
//
// One small grid mesh is instanced over a quadtree of square nodes: big nodes
// far from the camera, small ones near it, every node the same vertex count.
// The vertex shader lifts each vertex from the height texture, and near the
// outer edge of its range it slides odd vertices onto the next-coarser grid, so
// neighbouring levels meet without cracks and nothing pops as you fly in. The
// result is ~17 m triangles under your feet and a few hundred thousand
// triangles for the whole island, from a single draw call.

import * as THREE from 'three'
import { WORLD, HALF, HEIGHT_RES, Y_PER_M } from '../config.js'
import { terrainVertex, terrainFragment } from './shaders/terrain.glsl.js'

const GRID = 32 // quads per node edge
const LEVELS = 7 // 360 / (32 · 360/2048) = 64 = 2^6 → seven levels
const MAX_NODES = 1600

export class Terrain {
  constructor(data, shared) {
    this.heights = data.height
    this.N = HEIGHT_RES
    this.leafSize = WORLD / 2 ** (LEVELS - 1)
    this.range0 = 22
    this.buildMinMax()

    const heightTex = new THREE.DataTexture(data.height, HEIGHT_RES, HEIGHT_RES, THREE.RedFormat, THREE.FloatType)
    heightTex.minFilter = THREE.NearestFilter
    heightTex.magFilter = THREE.NearestFilter
    heightTex.needsUpdate = true
    this.heightTex = heightTex

    const normalTex = new THREE.DataTexture(data.normals, HEIGHT_RES, HEIGHT_RES, THREE.RGBAFormat, THREE.UnsignedByteType)
    normalTex.minFilter = THREE.LinearMipmapLinearFilter
    normalTex.magFilter = THREE.LinearFilter
    normalTex.generateMipmaps = true
    normalTex.anisotropy = 8
    normalTex.needsUpdate = true
    this.normalTex = normalTex

    // Two grids: a full one for whole nodes, and one at half density for the
    // quarter of a parent drawn at the parent's level (where its child is out of
    // the finer range) — same spacing as the parent, so the morph still lines
    // up with the coarser neighbours.
    this.full = this.makeGrid(GRID)
    this.half = this.makeGrid(GRID / 2)

    this.morph = []
    for (let l = 0; l < 8; l++) this.morph.push(new THREE.Vector2())
    const uniforms = {
      ...shared.uniforms,
      uHeight: { value: heightTex },
      uNormal: { value: normalTex },
      uMorph: { value: this.morph },
      uCamPos: { value: new THREE.Vector3() },
      uDebug: { value: 0 },
    }
    this.uniforms = uniforms
    this.group = new THREE.Group()
    for (const grid of [this.full, this.half]) {
      grid.material = new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        uniforms: { ...uniforms, uGrid: { value: grid.dim } },
      })
      grid.mesh = new THREE.Mesh(grid.geometry, grid.material)
      grid.mesh.frustumCulled = false
      grid.mesh.matrixAutoUpdate = false
      this.group.add(grid.mesh)
    }
    this._frustum = new THREE.Frustum()
    this._m = new THREE.Matrix4()
    this._box = new THREE.Box3()
    this.setRange(this.range0)
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

  /** Per-node min/max heights, as a pyramid over leaf-sized squares. */
  buildMinMax() {
    const N = this.N
    const leaves = 2 ** (LEVELS - 1)
    const per = N / leaves
    this.mm = []
    let lo = new Float32Array(leaves * leaves)
    let hi = new Float32Array(leaves * leaves)
    for (let bj = 0; bj < leaves; bj++) {
      for (let bi = 0; bi < leaves; bi++) {
        let a = Infinity
        let b = -Infinity
        for (let j = bj * per; j <= Math.min(N - 1, (bj + 1) * per); j++) {
          for (let i = bi * per; i <= Math.min(N - 1, (bi + 1) * per); i++) {
            const v = this.heights[j * N + i]
            if (v < a) a = v
            if (v > b) b = v
          }
        }
        lo[bj * leaves + bi] = a
        hi[bj * leaves + bi] = b
      }
    }
    this.mm.push({ lo, hi, n: leaves })
    let n = leaves
    while (n > 1) {
      const m = n / 2
      const lo2 = new Float32Array(m * m)
      const hi2 = new Float32Array(m * m)
      for (let j = 0; j < m; j++) {
        for (let i = 0; i < m; i++) {
          const a = (2 * j) * n + 2 * i
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

  /** Detail knob: distance (world units) the finest level reaches. */
  setRange(r0) {
    this.range0 = r0
    this.ranges = []
    for (let l = 0; l < LEVELS; l++) this.ranges.push(r0 * 2 ** l)
    this.ranges[LEVELS - 1] = 1e6
    for (let l = 0; l < LEVELS; l++) {
      const r = this.ranges[l]
      const prev = l > 0 ? this.ranges[l - 1] : 0
      const start = prev + (r - prev) * 0.6
      this.morph[l].set(start, r * 0.97)
    }
  }

  /** World Y of the ground at (x, z), matching the shader's bilinear fetch. */
  heightAt(x, z) {
    return this.metresAt(x, z) * Y_PER_M
  }

  metresAt(x, z) {
    const N = this.N
    let fx = ((x + HALF) / WORLD) * N - 0.5
    let fz = ((z + HALF) / WORLD) * N - 0.5
    if (fx < 0) fx = 0
    if (fz < 0) fz = 0
    if (fx > N - 1.001) fx = N - 1.001
    if (fz > N - 1.001) fz = N - 1.001
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const h = this.heights
    const k = j * N + i
    const a = h[k] + (h[k + 1] - h[k]) * tx
    const b = h[k + N] + (h[k + N + 1] - h[k + N]) * tx
    return a + (b - a) * tz
  }

  normalAt(x, z, out = new THREE.Vector3()) {
    const e = WORLD / this.N
    const hx = this.heightAt(x + e, z) - this.heightAt(x - e, z)
    const hz = this.heightAt(x, z + e) - this.heightAt(x, z - e)
    return out.set(-hx, 2 * e, -hz).normalize()
  }

  update(camera) {
    this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this._frustum.setFromProjectionMatrix(this._m)
    this.cam = camera.position
    this.uniforms.uCamPos.value.copy(camera.position)
    this.full.count = 0
    this.half.count = 0
    this.select(0, 0, LEVELS - 1)
    for (const grid of [this.full, this.half]) {
      grid.geometry.instanceCount = grid.count
      grid.attr.needsUpdate = true
    }
  }

  nodeBox(i, j, lod) {
    const level = this.mm[lod]
    const size = this.leafSize * 2 ** lod
    const x0 = -HALF + i * size
    const z0 = -HALF + j * size
    const lo = level.lo[j * level.n + i] * Y_PER_M
    const hi = level.hi[j * level.n + i] * Y_PER_M
    this._box.min.set(x0, lo, z0)
    this._box.max.set(x0 + size, hi, z0 + size)
    return this._box
  }

  // CDLOD selection. Returns false when the node is out of its own LOD's range
  // (so the parent must cover it); true when handled (drawn, or culled).
  select(i, j, lod) {
    const box = this.nodeBox(i, j, lod)
    const level = this.mm[lod]
    // deep ocean floor never shows through the water
    if (level.hi[j * level.n + i] < -45) return true
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
        if (cl.hi[cj * cl.n + ci] < -45) continue
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
    grid.data[k] = -HALF + i * size
    grid.data[k + 1] = -HALF + j * size
    grid.data[k + 2] = size
    grid.data[k + 3] = lod
    grid.count++
  }
}
