// The district's trees, from the ahupuaʻa app's features/vegetation.js and
// FOREST.md: the same species, drawn as that app draws them past a few
// hundred metres, a simple crown on a stick that keeps each one's outline and
// colour (ʻōhiʻa flat-topped and lopsided, koa a wide umbrella broken into
// sprays, kukui a pale dome over a shaded one, ʻōhiʻa ʻai a dark ellipsoid,
// hau a low slab, hala a few tufts), since the close-up is seen from one to
// six kilometres off; niu keeps its fronds. Where each grows was decided once,
// when the district was decoded (data/district-decode.js placeTrees).
//
// The planting is kept in tiles of a few hundred metres, its instance
// matrices made once; each time the view moves enough to matter, the tiles in
// view within reach of the camera are copied into one instanced mesh per
// species, all of the nearest, fewer of each further one (each tile's trees
// are shuffled, so the first of them are a fair thinning), and none past
// TREE_R, where the terrain's own canopy carries the forest. Budgeted to
// MAX_TREES, so a mid-range laptop holds its frame rate at the near zoom.

import * as THREE from 'three'
import { Builder, MAT, S, Y, col, indexed, objectMaterial } from './kit.js'
import { TREE_KINDS, TREE_STRIDE } from '../data/district-decode.js'

const TAU = Math.PI * 2

// an icosahedron stood on a vertex, as vegetation.js's dome: round from every side
const DOME_V = [[0, 1, 0]]
for (let k = 0; k < 10; k++) {
  const a = (k * Math.PI) / 5
  const up = k % 2 ? -1 : 1
  DOME_V.push([Math.cos(a) * 0.8944, up * 0.4472, Math.sin(a) * 0.8944])
}
DOME_V.push([0, -1, 0])
const DOME_F = []
for (let k = 0; k < 5; k++) {
  const u0 = 1 + 2 * k
  const l0 = u0 + 1
  const u1 = 1 + ((2 * k + 2) % 10)
  const l1 = 1 + ((2 * k + 3) % 10)
  DOME_F.push([0, u0, u1], [u0, l0, u1], [u1, l0, l1], [11, l0, l1])
}

/** A round crown, darkened toward its underside (`under`), its outline roughened by `jit`. */
function dome(B, x, y, z, rx, ry, rz, colour, mat, seed = 0, jit = 0.1, under = 1) {
  const sm = (a, b, v) => {
    const t = Math.max(0, Math.min(1, (v - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  const P = DOME_V.map((v, i) => {
    const j = i === 0 || i === 11 ? 1 : 1 - jit + 2 * jit * Math.abs((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1)
    return [x + v[0] * rx * j, y + v[1] * ry, z + v[2] * rz * j]
  })
  const N = DOME_V.map((v) => {
    const n = [v[0] / rx, v[1] / ry, v[2] / rz]
    const l = Math.hypot(...n)
    return [n[0] / l, n[1] / l, n[2] / l]
  })
  const C = DOME_V.map((v) => {
    const k = under + (1 - under) * sm(-0.8, 0.3, v[1])
    return [colour[0] * k, colour[1] * k, colour[2] * k]
  })
  for (const f of DOME_F) {
    const [a, b, c] = f.map((i) => P[i])
    const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
    const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const out = nx * (a[0] + b[0] + c[0] - 3 * x) + ny * (a[1] + b[1] + c[1] - 3 * y) + nz * (a[2] + b[2] + c[2] - 3 * z) > 0
    for (const i of out ? f : [f[0], f[2], f[1]]) {
      B.pos.push(P[i][0], P[i][1], P[i][2])
      B.nor.push(N[i][0], N[i][1], N[i][2])
      B.col.push(C[i][0], C[i][1], C[i][2])
      B.mat.push(mat)
      B.feat.push(0)
    }
  }
}

/** A crown (or a few) on a stick: the far tree of vegetation.js. */
export function farTree(rand, { stick, r0 = 0.4, r1 = 0.25, bark = '#6a6058', limbs = [], crowns }) {
  const B = new Builder()
  const barkC = col(bark, 0.1, rand)
  if (stick) B.cyl([0, 0, 0], stick, r0, r1, barkC, MAT.wood, 3)
  for (const [a, b, l0, l1] of limbs) B.cyl(a, b, l0, l1, barkC, MAT.wood, 3)
  for (const [x, y, z, rx, ry, colour, mat = MAT.leaf, seed = 1, under = 1] of crowns) {
    dome(B, x, y, z, rx, ry, rx, typeof colour === 'string' ? col(colour, 0.1, rand) : colour, mat, seed, 0.1, under)
  }
  return B.geometry()
}

/** Niu: a leaning grey trunk under a head of arching fronds (vegetation.js palm, fewer fronds). */
function niu(rand) {
  const B = new Builder()
  const trunk = col('#8a7a62', 0.1, rand)
  const H = 14
  let prev = [0, 0, 0]
  for (let k = 1; k <= 4; k++) {
    const y = (k / 4) * H
    const p = [0.06 * Math.pow(y, 1.5), y, 0]
    B.cyl(prev, p, 0.3 - k * 0.025, 0.28 - k * 0.03, trunk, MAT.wood, 5)
    prev = p
  }
  const top = prev
  const leaf = col('#6E7A3E', 0.12, rand)
  const tip = col('#8f9a43', 0.1, rand)
  for (let f = 0; f < 9; f++) {
    const a = (f / 9) * TAU + rand() * 0.3
    const len = 5.2 + rand() * 1.2
    const lift = 1.4 + rand() * 0.8
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    let p0 = top
    for (let s = 1; s <= 4; s++) {
      const t = s / 4
      const p1 = [top[0] + dx * len * t, top[1] + lift * t - 3.8 * t * t, top[2] + dz * len * t]
      const w = 1.0 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.15
      const nx = -dz * w
      const nz = dx * w
      const c = s > 2 ? tip : leaf
      B.quad(p0, p1, [p1[0] + nx, p1[1] - 0.35 * w, p1[2] + nz], [p0[0] + nx * 0.7, p0[1] - 0.25 * w, p0[2] + nz * 0.7], c, MAT.leaf)
      B.quad([p0[0] - nx * 0.7, p0[1] - 0.25 * w, p0[2] - nz * 0.7], [p1[0] - nx, p1[1] - 0.35 * w, p1[2] - nz], p1, p0, c, MAT.leaf)
      p0 = p1
    }
  }
  return B.geometry()
}

/** The species' far models, in metres, trunk base at the origin (vegetation.js farGeoms). */
function models(rand) {
  // koa's sprays and hala's tufts where vegetation.js's near models put their limbs' tips
  const koaTips = []
  for (let l = 0; l < 4; l++) {
    const a = (l / 4) * TAU + 0.3
    for (const side of [-1, 1]) koaTips.push([Math.cos(a + side * 0.35) * 6.2, 10.2 + (side > 0 ? 0.4 : 0), Math.sin(a + side * 0.35) * 6.2])
  }
  const halaTips = [[2.6, 6.1, 0.9], [2.1, 6.4, -1.6], [-1.9, 6.2, 1.4], [-2.2, 5.9, -1.1]]
  const wiliEnds = [0, 1, 2, 3, 4].map((k) => [Math.cos((k / 5) * TAU) * 3.6, 3.4, Math.sin((k / 5) * TAU) * 3.6])
  const KUKUI_MID = '#56603D'
  const KUKUI_LEAF = '#66704A'
  const KUKUI_PALE = '#77825A'
  const ohiaC = col('#5C603F', 0, rand).map((v) => v * 0.95)
  return {
    // (ʻōhiʻa: the trunk in its crown's shade, the crown lopsided, flat-topped)
    ohia: farTree(rand, { stick: [0.3, 6.5, 0.1], bark: '#5A5354', crowns: [[0.3, 8.6, 0, 4.6, 2.5, ohiaC], [2.2, 7.7, 1.0, 3.0, 1.8, ohiaC, MAT.leaf, 2]] }),
    // (the low, wind-shorn ʻōhiʻa of the ridges and the pali, its crown hiding its stems)
    ohiaKrumm: farTree(rand, { crowns: [[0.6, 2.4, 0.2, 5.0, 1.5, '#596537', MAT.leaf, 1, 0.75]] }),
    koa: farTree(rand, {
      stick: [0.2, 4.0, -0.3],
      r0: 0.6,
      r1: 0.45,
      bark: '#5A504B',
      limbs: [0, 2, 4, 6].map((k) => {
        const [a, b] = [koaTips[k], koaTips[k + 1]]
        return [[0.2, 3.8, -0.3], [((a[0] + b[0]) / 2) * 0.9, (a[1] + b[1]) / 2 - 0.6, ((a[2] + b[2]) / 2) * 0.9], 0.3, 0.14]
      }),
      crowns: [0, 2, 4, 6].map((k, i) => {
        const [a, b] = [koaTips[k], koaTips[k + 1]]
        return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.3, (a[2] + b[2]) / 2, 3.0, 1.55, i === 1 ? '#737B5A' : '#5E6A3C', MAT.leaf, i + 1]
      }),
    }),
    kukui: farTree(rand, {
      stick: [0.3, 4.2, 0.1],
      r0: 0.45,
      r1: 0.35,
      bark: '#5F5B54',
      crowns: [[0.3, 6.5, 0.1, 5.8, 3.2, KUKUI_LEAF, MAT.leaf, 1, 0.62], [0.5, 8.6, 0.3, 3.4, 1.6, KUKUI_PALE, MAT.leaf, 5, 0.8], [-2.9, 5.6, 1.6, 2.8, 1.9, KUKUI_MID, MAT.leaf, 2, 0.7]],
    }),
    ohiaai: farTree(rand, { stick: [0, 2.4, 0], r0: 0.35, r1: 0.3, bark: '#8A7458', crowns: [[0, 6.0, 0, 2.4, 3.6, '#3A5026']] }),
    hau: farTree(rand, { crowns: [[0, 2.2, 0, 5.0, 2.2, '#6E8A3E']] }),
    hala: farTree(rand, {
      stick: [0.3, 3.4, 0],
      r0: 0.22,
      r1: 0.15,
      bark: '#8E8B82',
      limbs: [0, 2].map((k) => {
        const [a, b] = halaTips.slice(k, k + 2)
        return [[0.3, 3.3, 0], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.45, (a[2] + b[2]) / 2], 0.13, 0.09]
      }),
      crowns: halaTips.map((t, k) => [t[0], t[1] - 0.35, t[2], 1.45, 0.75, '#55703D', MAT.leaf, k + 1]),
    }),
    wiliwili: farTree(rand, {
      stick: [0.1, 2.8, 0.2],
      r0: 0.45,
      r1: 0.3,
      bark: '#9C6C44',
      limbs: wiliEnds.map((e) => [[0.05, 2.5, 0.2], e, 0.2, 0.08]),
      crowns: [[0, 3.9, 0.2, 4.8, 1.25, '#788C4A', MAT.leaf, 3, 0.75]],
    }),
    lama: farTree(rand, { stick: [0.2, 3.2, 0.1], r0: 0.25, r1: 0.18, bark: '#3E3A36', crowns: [[0.2, 5.4, 0.1, 2.6, 2.0, '#4C5E2E']] }),
    aalii: farTree(rand, { crowns: [[0, 1.2, 0, 1.5, 1.0, '#6F8A4E']] }),
    niu: niu(rand),
    // (milo and kou by the houses and the shore: a dense dark dome on a short trunk)
    milo: farTree(rand, { stick: [0.2, 2.2, 0], r0: 0.35, r1: 0.28, bark: '#8A8070', crowns: [[0.2, 4.6, 0, 3.6, 2.4, '#4A6426']] }),
  }
}

const TILE = 3 // world units (300 m)
// Trees are drawn out to a reach that grows with the camera's distance from
// what it looks at (so the near stops, 13 to 60 units out, all have their
// trees), all of a tile's within the first part of it and fewer further out.
export const TREE_R = [30, 80]
const reachFor = (distance) => Math.max(TREE_R[0], Math.min(TREE_R[1], distance * 2))
const MAX_TREES = 24000

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Forest {
  /** trees: the decoder's { kinds, lists, counts }; rect: the district's world rect. */
  constructor(trees, rect, shared, own) {
    const rand = mulberry32(5150)
    const geoms = models(rand)
    this.group = new THREE.Group()
    this.rect = rect
    this.nx = Math.ceil((rect.x1 - rect.x0) / TILE)
    this.nz = Math.ceil((rect.z1 - rect.z0) / TILE)
    this.mat = objectMaterial(shared, own, { fade: [TREE_R[0] - 7, TREE_R[0]] })
    this.matDS = objectMaterial(shared, own, { fade: [TREE_R[0] - 7, TREE_R[0]], doubleSide: true })
    this.species = []
    const m4 = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    this.total = 0
    TREE_KINDS.forEach((kind, k) => {
      const list = trees.lists[k]
      const n = list.length / TREE_STRIDE
      // sort into tiles, shuffled within each
      const tileOf = new Int32Array(n)
      const counts = new Int32Array(this.nx * this.nz)
      for (let i = 0; i < n; i++) {
        const tx = Math.min(this.nx - 1, Math.max(0, Math.floor((list[i * TREE_STRIDE] - rect.x0) / TILE)))
        const tz = Math.min(this.nz - 1, Math.max(0, Math.floor((list[i * TREE_STRIDE + 1] - rect.z0) / TILE)))
        tileOf[i] = tz * this.nx + tx
        counts[tileOf[i]]++
      }
      const start = new Int32Array(this.nx * this.nz + 1)
      for (let t = 0; t < counts.length; t++) start[t + 1] = start[t] + counts[t]
      const fill = start.slice()
      const order = new Int32Array(n)
      for (let i = 0; i < n; i++) order[fill[tileOf[i]]++] = i
      for (let t = 0; t < counts.length; t++) {
        for (let a = start[t + 1] - 1; a > start[t]; a--) {
          const b = start[t] + Math.floor(rand() * (a - start[t] + 1))
          const tmp = order[a]
          order[a] = order[b]
          order[b] = tmp
        }
      }
      const mats = new Float32Array(n * 16)
      const cols = new Float32Array(n * 3)
      const clear = new Float32Array(n)
      for (let o = 0; o < n; o++) {
        const i = order[o]
        const b = i * TREE_STRIDE
        q.setFromAxisAngle(up, list[b + 3])
        const s = S * list[b + 4]
        pos.set(list[b], Y(list[b + 2]), list[b + 1])
        scl.set(s, s, s)
        m4.compose(pos, q, scl)
        m4.toArray(mats, o * 16)
        cols[o * 3] = list[b + 5]
        cols[o * 3 + 1] = list[b + 6]
        cols[o * 3 + 2] = list[b + 7]
        clear[o] = list[b + 8]
      }
      const cap = Math.min(n, MAX_TREES)
      const g = indexed(geoms[kind])
      const mesh = new THREE.InstancedMesh(g, kind === 'niu' || kind === 'hala' ? this.matDS : this.mat, Math.max(1, cap))
      mesh.name = kind
      mesh.count = 0
      mesh.frustumCulled = false
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, cap) * 3), 3)
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
      const aClear = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, cap)), 1)
      aClear.setUsage(THREE.DynamicDrawUsage)
      g.setAttribute('aClear', aClear)
      this.group.add(mesh)
      this.species.push({ kind, mesh, aClear, start, mats, cols, clear, cap, n })
      this.total += n
    })
    this.frustum = new THREE.Frustum()
    this.pv = new THREE.Matrix4()
    this.box = new THREE.Box3()
    this.key = ''
    this.drawn = 0
  }

  /** Refill the draw buffers if the view has moved enough to change what is in it. */
  update(camera, show, maxY, distance) {
    this.group.visible = show > 0.001
    if (!this.group.visible) return
    const R = reachFor(distance)
    const FULL_R = R * 0.42
    for (const m of [this.mat, this.matDS]) {
      m.uniforms.uFadeNear.value = R * 0.7
      m.uniforms.uFadeFar.value = R
    }
    const p = camera.position
    this.pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.pv)
    const r = this.rect
    const tiles = []
    const i0 = Math.max(0, Math.floor((p.x - R - r.x0) / TILE))
    const i1 = Math.min(this.nx - 1, Math.floor((p.x + R - r.x0) / TILE))
    const j0 = Math.max(0, Math.floor((p.z - R - r.z0) / TILE))
    const j1 = Math.min(this.nz - 1, Math.floor((p.z + R - r.z0) / TILE))
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const x0 = r.x0 + i * TILE
        const z0 = r.z0 + j * TILE
        this.box.min.set(x0, -0.5, z0)
        this.box.max.set(x0 + TILE, maxY, z0 + TILE)
        const d = this.box.distanceToPoint(p)
        if (d > R || !this.frustum.intersectsBox(this.box)) continue
        // all of a near tile; fewer of each further one
        const f = d < FULL_R ? 1 : Math.pow(FULL_R / d, 1.6)
        tiles.push(j * this.nx + i, Math.round(f * 20))
      }
    }
    const key = tiles.join(',')
    if (key === this.key) return
    this.key = key
    // (over the budget, every tile is thinned alike, so no species and no tile loses out)
    let want = 0
    for (const sp of this.species) for (let t = 0; t < tiles.length; t += 2) want += Math.ceil(((sp.start[tiles[t] + 1] - sp.start[tiles[t]]) * tiles[t + 1]) / 20)
    const thin = Math.min(1, MAX_TREES / Math.max(1, want))
    this.drawn = 0
    for (const sp of this.species) {
      let c = 0
      for (let t = 0; t < tiles.length; t += 2) {
        const tile = tiles[t]
        const a = sp.start[tile]
        const n = sp.start[tile + 1] - a
        const take = Math.min(Math.ceil((n * tiles[t + 1] * thin) / 20), sp.cap - c)
        if (take <= 0) continue
        sp.mesh.instanceMatrix.array.set(sp.mats.subarray(a * 16, (a + take) * 16), c * 16)
        sp.mesh.instanceColor.array.set(sp.cols.subarray(a * 3, (a + take) * 3), c * 3)
        sp.aClear.array.set(sp.clear.subarray(a, a + take), c)
        c += take
      }
      sp.mesh.count = c
      sp.mesh.instanceMatrix.needsUpdate = true
      sp.mesh.instanceColor.needsUpdate = true
      sp.aClear.needsUpdate = true
      sp.mesh.visible = c > 0
      this.drawn += c
    }
  }

  dispose() {
    for (const sp of this.species) sp.mesh.geometry.dispose()
    this.mat.dispose()
    this.matDS.dispose()
  }
}
