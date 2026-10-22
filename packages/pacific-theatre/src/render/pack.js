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
// exaggeration of the moment (the uVert of the ground it draws for), so the
// selection follows it as the camera zooms.
//
// Copied from holo-i-ke-au's render/pack.js (b480c27) and made unit-agnostic:
// it draws for one ground (render/shaders/ground.glsl.js) instead of the
// Hawaiian World's slots, with the shaders passed in (the table's relief, a
// box's terrain), the node boxes' margins in the scene's own units, and the
// sea-floor skip switchable: the Hawaiian packs skipped every node wholly
// below -0.5 m because their opaque sea hid it, but on the table the sea
// floor is the picture (`seaCull: -Infinity`). A box's cast shadows
// (shadow.js) are attached by its ground with setShadow(); the table has none
// (its relief is hillshaded, and its exaggeration moves with every zoom).

import * as THREE from 'three'

const GRID = 32 // quads per node edge
const MAX_NODES = 1600

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
  // on the CPU)
  t.onUpdate = () => {
    t.image.data = null
    t.onUpdate = null
  }
  return t
}

/** A 1 × 1 RGBA8 texture of one value, standing in for a map a pack does not have. */
export function constantTexture(r = 255, g = 255, b = 255, a = 255) {
  const t = new THREE.DataTexture(new Uint8Array([r, g, b, a]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType)
  t.needsUpdate = true
  return t
}

export class PackTerrain {
  /**
   * pack: a described pack (data/load.js) with its decoded `data`.
   * renderer: the app's WebGLRenderer (for the anisotropy it allows).
   * uniforms: the bag this ground's materials draw with, shared by reference
   * ({ ...app.light.uniforms, ...ground.uniforms }); its uVert is read each
   * frame for the node boxes.
   * opts: { vertexShader, fragmentShader (both required); uniforms (the
   * material's own, besides these); seaCull (metres: nodes wholly below it
   * are skipped; default -0.5, -Infinity for the table); unit (metres per
   * world unit); margin ([below, above] in world units round each node's
   * heights, for the geomorph and a sunk sea bed; default 30 m and 10 m) }
   */
  constructor(pack, renderer, uniforms, opts = {}) {
    if (!opts.vertexShader || !opts.fragmentShader) throw new Error('PackTerrain needs its shaders')
    this.pack = pack
    this.shared = uniforms
    const d = pack.data
    const { W, H } = pack
    const { x0, z0, x1, z1 } = pack.rect
    this.rect = new THREE.Vector4(x0, z0, x1, z1)
    this.heights = d.metres
    this.W = W
    this.H = H
    this.seaCull = opts.seaCull ?? -0.5
    const unit = opts.unit ?? 1
    this.margin = opts.margin ?? [30 / unit, 10 / unit]
    const aniso = renderer.capabilities.getMaxAnisotropy()
    this.heightTex = heightTexture(d.metres, W, H)
    this.normalTex = mapTexture(d.normals, W, H, Math.min(8, aniso))
    this.landTex = d.land ? mapTexture(d.land, W, H, Math.min(4, aniso)) : constantTexture(0, 0, 0, 0)
    this.shadowTex = constantTexture()
    d.normals = null
    d.land = null

    const texel = Math.max((x1 - x0) / W, (z1 - z0) / H)
    this.texel = texel
    const side = Math.max(x1 - x0, z1 - z0)
    this.levels = Math.max(1, Math.ceil(Math.log2(side / (GRID * texel))) + 1)
    this.leafSize = side / 2 ** (this.levels - 1)
    this.buildMinMax()

    this.full = this.makeGrid(GRID)
    this.half = this.makeGrid(GRID / 2)
    this.morph = []
    for (let l = 0; l < 12; l++) this.morph.push(new THREE.Vector2())
    this.uniforms = {
      ...uniforms,
      uOwnH: { value: this.heightTex },
      uOwnRect: { value: this.rect },
      uOwnN: { value: this.normalTex },
      uOwnL: { value: this.landTex },
      uOwnS: { value: this.shadowTex },
      uMorph: { value: this.morph },
      uCamPos: { value: new THREE.Vector3() },
      uDebug: { value: 0 },
      ...opts.uniforms,
    }
    this.group = new THREE.Group()
    for (const grid of [this.full, this.half]) {
      grid.material = new THREE.ShaderMaterial({
        vertexShader: opts.vertexShader,
        fragmentShader: opts.fragmentShader,
        uniforms: { ...this.uniforms, uGrid: { value: grid.dim } },
      })
      grid.mesh = new THREE.Mesh(grid.geometry, grid.material)
      grid.mesh.frustumCulled = false
      grid.mesh.matrixAutoUpdate = false
      this.group.add(grid.mesh)
    }
    this._frustum = new THREE.Frustum()
    this._m = new THREE.Matrix4()
    this._box = new THREE.Box3()
    this.rangeK = 3.5
    this.applyRange(this.rangeK)
  }

  /** Draw with a cast-shadow map over this pack's rect (a box's PackShadow texture), or none. */
  setShadow(texture) {
    const t = texture || this.shadowTex
    this.uniforms.uOwnS.value = t
    for (const g of [this.full, this.half]) g.material.uniforms.uOwnS.value = t
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
  buildMinMax() {
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

  /** Bilinear metres from this pack alone, matching the shader's rectMetres (the CPU copy of groundMetres inside the rect). */
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
    this.ranges[this.levels - 1] = 1e12
    for (let l = 0; l < this.levels; l++) {
      const r = this.ranges[l]
      const prev = l > 0 ? this.ranges[l - 1] : 0
      this.morph[l].set(prev + (r - prev) * 0.5, r * 0.97)
    }
  }

  setDebug(v) {
    this.uniforms.uDebug.value = v
    for (const g of [this.full, this.half]) g.material.uniforms.uDebug.value = v
  }

  update(camera, visible = true) {
    this.group.visible = visible
    this.full.count = 0
    this.half.count = 0
    if (visible) {
      this._m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      this._frustum.setFromProjectionMatrix(this._m)
      this.cam = camera.position
      this.vert = this.shared.uVert.value
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
    const lo = Math.min(0, level.lo[j * level.n + i]) * v - this.margin[0]
    const hi = Math.max(0, level.hi[j * level.n + i]) * v + this.margin[1]
    this._box.min.set(x0, lo, z0)
    this._box.max.set(x0 + size, hi, z0 + size)
    return this._box
  }

  // CDLOD selection. Returns false when the node is out of its own LOD's range
  // (so the parent must cover it); true when handled (drawn, or culled).
  select(i, j, lod) {
    const level = this.mm[lod]
    const hiM = level.hi[j * level.n + i]
    if (!(hiM >= this.seaCull)) return true // (empty, or all deep sea where that is skipped)
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
        if (!(cl.hi[cj * cl.n + ci] >= this.seaCull)) continue
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

  /** What is drawn, for the tools. */
  stats() {
    return { nodes: this.full.count + this.half.count, levels: this.levels }
  }

  dispose() {
    for (const g of [this.full, this.half]) {
      g.geometry.dispose()
      g.material.dispose()
    }
    this.heightTex.dispose()
    this.normalTex.dispose()
    this.landTex.dispose()
    this.shadowTex.dispose()
  }
}

/**
 * The CDLOD vertex shader's body, shared by the table's relief and a box's
 * terrain: the vertex's grid position, the geomorph toward the coarser
 * level's surface at the edge of its range (as in ahupuaʻa: by the hand-over
 * the two levels are the same surface), and `mt` the metres there. Expects
 * aNode, uMorph, uGrid, uCamPos, uVert and a packMetres(xz) function.
 */
export const cdlodMorph = /* glsl */ `
  vec2 g = floor(position.xz * uGrid + 0.5); // this vertex's grid index in its node
  float cell = aNode.z / uGrid;
  vec2 xz = aNode.xy + g * cell;
  float mt = packMetres(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * uVert, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    // (the two coarser vertices first, and the ground read at them in one
    // place: packMetres is inlined wherever it is called)
    vec2 base = aNode.xy + (g - odd) * cell;
    vec2 pa = base;
    vec2 pb = base + odd * 2.0 * cell;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) {
        pa = base + vec2(2.0, 0.0) * cell;
        pb = base + vec2(0.0, 2.0) * cell;
      } else pb = base + vec2(2.0) * cell;
    }
    float hc = 0.0;
    for (int q = 0; q < 2; q++) hc += packMetres(q == 0 ? pa : pb);
    mt = mix(mt, hc * 0.5, k);
  }
`
