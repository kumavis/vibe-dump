// Trees and plants.
//
// Two kinds of planting. The cultivated landscape is placed once: niu
// (coconut) and hala along the shore, ʻulu, kukui, maiʻa and kī around every
// kauhale and up the valleys. The native forest is too big for that, so it is
// grown around the camera from a deterministic hash — the same tree always
// stands in the same spot — and handed back to the terrain's canopy texture
// beyond a kilometre or so, where individual crowns stop being readable.
//
// The forest is the heaviest thing on screen, so it is kept in small tiles
// whose instance data is built once, and each frame only the tiles inside the
// view are copied into the draw buffers. Past a few hundred metres a tree is a
// few pixels tall and is drawn as a single rounded crown on a stick; the full
// model dithers into it over a short band, so the switch never pops.

import * as THREE from 'three'
import { HYDRO_RES, WORLD, HALF } from '../config.js'
import { mulberry32, hash2 } from '../gen/noise.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'

// --- geometry (metres, trunk base at the origin) -----------------------------

function palm(rand) {
  const B = new Builder()
  const trunk = col('#8a7a62', 0.1, rand)
  const H = 14
  let prev = [0, 0, 0]
  const lean = 0.06
  for (let k = 1; k <= 6; k++) {
    const y = (k / 6) * H
    const p = [lean * Math.pow(y, 1.5), y, 0]
    B.cyl(prev, p, 0.28 - k * 0.02, 0.26 - k * 0.025, trunk, MAT.wood, 6)
    prev = p
  }
  const top = prev
  const leaf = col('#4c7a2c', 0.12, rand)
  const tip = col('#8f9a43', 0.1, rand)
  for (let f = 0; f < 13; f++) {
    const a = (f / 13) * Math.PI * 2 + rand() * 0.3
    const len = 5.2 + rand() * 1.2
    const lift = 1.4 + rand() * 0.8
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    let p0 = top
    for (let s = 1; s <= 5; s++) {
      const t = s / 5
      const p1 = [top[0] + dx * len * t, top[1] + lift * t - 3.8 * t * t, top[2] + dz * len * t]
      const w = 1.0 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.15
      const nx = -dz * w
      const nz = dx * w
      const c = s > 3 ? tip : leaf
      // a shallow V: two halves angled down off the rib
      B.quad([p0[0], p0[1], p0[2]], [p1[0], p1[1], p1[2]], [p1[0] + nx, p1[1] - 0.35 * w, p1[2] + nz], [p0[0] + nx * 0.7, p0[1] - 0.25 * w, p0[2] + nz * 0.7], c, MAT.leaf)
      B.quad([p0[0] - nx * 0.7, p0[1] - 0.25 * w, p0[2] - nz * 0.7], [p1[0] - nx, p1[1] - 0.35 * w, p1[2] - nz], [p1[0], p1[1], p1[2]], [p0[0], p0[1], p0[2]], c, MAT.leaf)
      p0 = p1
    }
  }
  const nut = col('#5c4a24', 0.1, rand)
  for (let k = 0; k < 4; k++) B.blob(top[0] + Math.cos(k * 1.7) * 0.4, top[1] - 0.6, top[2] + Math.sin(k * 1.7) * 0.4, 0.3, 0.35, 0.3, nut, MAT.plain, k)
  return B.geometry()
}

function broadleaf(rand, { trunkH, crownR, color, trunkColor = '#5a4636', blobs = 3, flatten = 1, red = 0 }) {
  const B = new Builder()
  const tc = col(trunkColor, 0.1, rand)
  B.cyl([0, 0, 0], [0.3, trunkH, 0.1], 0.35, 0.22, tc, MAT.wood, 5)
  const crowns = []
  for (let k = 0; k < blobs; k++) {
    const a = (k / blobs) * Math.PI * 2 + rand()
    const r = k === 0 ? 0 : crownR * 0.45
    const c = col(color, 0.18, rand)
    const crown = [0.3 + Math.cos(a) * r, trunkH + crownR * 0.35 * flatten + (k === 0 ? crownR * 0.2 : 0), 0.1 + Math.sin(a) * r, crownR * (k === 0 ? 1 : 0.75), crownR * 0.62 * flatten]
    crowns.push(crown)
    B.blob(crown[0], crown[1], crown[2], crown[3], crown[4], crown[3], c, MAT.leaf, k + rand())
  }
  if (red > 0) {
    // lehua: the ʻōhiʻa's red pompom blossoms, dotted in tufts over the outside
    // of the crown (a few big red balls read as fruit)
    for (let k = 0; k < red; k++) {
      const [cx, cy, cz, rh, rv] = crowns[Math.floor(rand() * crowns.length)]
      const a = rand() * Math.PI * 2
      const up = 0.15 + rand() * 0.75 // upper half of the crown, where the sun reaches
      const ring = Math.sqrt(1 - up * up)
      const rc = col(rand() < 0.8 ? '#b3241c' : '#d8452a', 0.2, rand)
      const s = 0.22 + rand() * 0.14
      B.blob(cx + Math.cos(a) * ring * rh * 0.97, cy + up * rv * 0.97, cz + Math.sin(a) * ring * rh * 0.97, s, s * 0.75, s, rc, MAT.leaf, k, true, 0)
    }
  }
  return B.geometry()
}

// the same tree from a few hundred metres: one rounded crown on a stick
function broadleafFar(rand, { trunkH, crownR, color, trunkColor = '#5a4636', flatten = 1 }) {
  const B = new Builder()
  B.cyl([0, 0, 0], [0.3, trunkH, 0.1], 0.4, 0.25, col(trunkColor, 0.1, rand), MAT.wood, 3)
  B.blob(0.3, trunkH + crownR * 0.42 * flatten, 0.1, crownR * 1.18, crownR * 0.7 * flatten, crownR * 1.18, col(color, 0.12, rand), MAT.leaf, 1, true, 0)
  return B.geometry()
}

function shrubFar(rand, color) {
  const B = new Builder()
  B.blob(0, 0.55, 0, 1.3, 0.8, 1.3, col(color, 0.15, rand), MAT.leaf, 1, true, 0)
  return B.geometry()
}

function hala(rand) {
  const B = new Builder()
  const tc = col('#6b5a45', 0.1, rand)
  const leaf = col('#4f7036', 0.12, rand)
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2
    B.cyl([Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1], [0, 1.4, 0], 0.08, 0.1, tc, MAT.wood, 4)
  }
  B.cyl([0, 1.2, 0], [0, 3.6, 0], 0.22, 0.18, tc, MAT.wood, 5)
  for (let b = 0; b < 3; b++) {
    const a = (b / 3) * Math.PI * 2 + 0.4
    const end = [Math.cos(a) * 1.8, 5.2, Math.sin(a) * 1.8]
    B.cyl([0, 3.5, 0], end, 0.14, 0.1, tc, MAT.wood, 4)
    for (let l = 0; l < 9; l++) {
      const la = (l / 9) * Math.PI * 2
      const dx = Math.cos(la)
      const dz = Math.sin(la)
      const tipP = [end[0] + dx * 1.7, end[1] + 0.5 - Math.abs(Math.sin(la)) * 0.9, end[2] + dz * 1.7]
      B.tri([end[0] - dz * 0.14, end[1], end[2] + dx * 0.14], [end[0] + dz * 0.14, end[1], end[2] - dx * 0.14], tipP, leaf, MAT.leaf)
    }
  }
  return B.geometry()
}

function banana(rand) {
  const B = new Builder()
  const stem = col('#7c9a4a', 0.1, rand)
  const leaf = col('#6aa538', 0.12, rand)
  for (let k = 0; k < 4; k++) {
    const a = rand() * Math.PI * 2
    const r = rand() * 0.6
    const bx = Math.cos(a) * r
    const bz = Math.sin(a) * r
    const h = 2.4 + rand() * 1.4
    B.cyl([bx, 0, bz], [bx, h, bz], 0.16, 0.12, stem, MAT.leaf, 5)
    for (let l = 0; l < 4; l++) {
      const la = rand() * Math.PI * 2
      const dx = Math.cos(la)
      const dz = Math.sin(la)
      const p0 = [bx, h, bz]
      const p1 = [bx + dx * 1.6, h + 0.7, bz + dz * 1.6]
      const p2 = [bx + dx * 2.6, h - 0.2, bz + dz * 2.6]
      const nx = -dz * 0.45
      const nz = dx * 0.45
      B.quad(p0, [p1[0] + nx, p1[1], p1[2] + nz], [p2[0] + nx * 0.6, p2[1], p2[2] + nz * 0.6], p2, leaf, MAT.leaf)
      B.quad(p0, p2, [p2[0] - nx * 0.6, p2[1], p2[2] - nz * 0.6], [p1[0] - nx, p1[1], p1[2] - nz], leaf, MAT.leaf)
    }
  }
  return B.geometry()
}

function ti(rand, red) {
  const B = new Builder()
  const stem = col('#6b5a40', 0.1, rand)
  const leaf = col(red ? '#7d2b2f' : '#3f7d32', 0.15, rand)
  B.cyl([0, 0, 0], [0.05, 1.6, 0], 0.05, 0.04, stem, MAT.wood, 4)
  for (let l = 0; l < 9; l++) {
    const a = (l / 9) * Math.PI * 2
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    const up = 0.3 + (l % 3) * 0.25
    B.quad([0.05 - dz * 0.06, 1.6, dx * 0.06], [0.05 + dz * 0.06, 1.6, -dx * 0.06], [0.05 + dx * 0.9 + dz * 0.12, 1.6 + up, dz * 0.9 - dx * 0.12], [0.05 + dx * 0.9 - dz * 0.12, 1.6 + up, dz * 0.9 + dx * 0.12], leaf, MAT.leaf)
  }
  return B.geometry()
}

function shrub(rand, color) {
  const B = new Builder()
  for (let k = 0; k < 3; k++) B.blob((rand() - 0.5) * 1.2, 0.5, (rand() - 0.5) * 1.2, 0.9, 0.7, 0.9, col(color, 0.2, rand), MAT.leaf, k)
  return B.geometry()
}

// --- placement ----------------------------------------------------------------

export const KINDS = ['niu', 'hala', 'ulu', 'kukui', 'maia', 'ki', 'kiRed', 'ohia', 'koa', 'wiliwili', 'naupaka', 'aalii']
const FOREST_KINDS = ['ohia', 'koa', 'kukui', 'wiliwili', 'aalii']
const FOREST_T = 2 // tile size, world units
const FOREST_R = 13.5 // forest radius around the camera; the canopy texture takes over beyond
const FOREST_LOD = [3.6, 4.6] // full models hand over to simple crowns across this band

export class Vegetation {
  constructor(app) {
    this.app = app
    const rand = mulberry32(app.island.meta.seed + 5150)
    this.geoms = {
      niu: palm(rand),
      hala: hala(rand),
      ulu: broadleaf(rand, { trunkH: 5, crownR: 4.2, color: '#2f5a26', blobs: 3 }),
      kukui: broadleaf(rand, { trunkH: 5, crownR: 5.6, color: '#6f8a5c', trunkColor: '#7b7468', blobs: 5 }),
      maia: banana(rand),
      ki: ti(rand, false),
      kiRed: ti(rand, true),
      ohia: broadleaf(rand, { trunkH: 6, crownR: 5.4, color: '#3a5e2c', trunkColor: '#4d4038', blobs: 5, red: 16 }),
      koa: broadleaf(rand, { trunkH: 10, crownR: 7.5, color: '#5d7449', trunkColor: '#5b4a3a', blobs: 5, flatten: 0.7 }),
      wiliwili: broadleaf(rand, { trunkH: 5, crownR: 3.8, color: '#a3864a', trunkColor: '#8a7255', blobs: 3, flatten: 0.8 }),
      naupaka: shrub(rand, '#5f8a42'),
      aalii: shrub(rand, '#8b7c4a'),
    }
    const TREES = {
      ohia: { trunkH: 6, crownR: 5.4, color: '#3a5e2c', trunkColor: '#4d4038' },
      koa: { trunkH: 10, crownR: 7.5, color: '#5d7449', trunkColor: '#5b4a3a', flatten: 0.7 },
      kukui: { trunkH: 5, crownR: 5.6, color: '#6f8a5c', trunkColor: '#7b7468' },
      wiliwili: { trunkH: 5, crownR: 3.8, color: '#a3864a', trunkColor: '#8a7255', flatten: 0.8 },
    }
    this.farGeoms = {
      ...Object.fromEntries(Object.entries(TREES).map(([k, o]) => [k, broadleafFar(rand, o)])),
      aalii: shrubFar(rand, '#8b7c4a'),
    }
    // palm fronds, hala, maiʻa and kī leaves are single sheets: draw both faces
    this.fixedMat = objectMaterial(app.shared, { fade: [34, 48], close: 0.3, sway: 1, doubleSide: true })
    this.forestMat = objectMaterial(app.shared, { fade: [FOREST_LOD[0], FOREST_LOD[1]], close: 0.3, sway: 1 })
    this.forestFarMat = objectMaterial(app.shared, { fade: [FOREST_R - 3.5, FOREST_R], fadeIn: FOREST_LOD, sway: 1 })
    this.group = new THREE.Group()
    this.land = app.landTex.image.data
    this.cleared = this.clearings()
    this.fixed = this.placeFixed(rand)
    this.meshes = {}
    for (const k of KINDS) {
      const list = this.fixed[k]
      if (!list.length) continue
      const mesh = new THREE.InstancedMesh(this.geoms[k], this.fixedMat, list.length)
      this.writeInstances(mesh, list)
      mesh.frustumCulled = false
      this.group.add(mesh)
      this.meshes[k] = mesh
    }
    // the streamed forest: per species, a near mesh (the full model) and a far
    // one (the simple crown), refilled from whichever tiles are in view
    this.forest = { near: {}, far: {} }
    for (const k of FOREST_KINDS) {
      this.forest.near[k] = this.forestMesh(this.geoms[k], this.forestMat, 2500)
      this.forest.far[k] = this.forestMesh(this.farGeoms[k], this.forestFarMat, 9000)
    }
    this.tiles = new Map()
    this.frustum = new THREE.Frustum()
    this.projView = new THREE.Matrix4()
    this.box = new THREE.Box3()
    this.wanted = []
    this.lastSelection = ''
  }

  forestMesh(geom, mat, capacity) {
    const mesh = new THREE.InstancedMesh(geom, mat, capacity)
    mesh.count = 0
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3)
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
    this.group.add(mesh)
    return mesh
  }

  /** Ground people have cleared: paddies, kauhale, heiau courts. */
  clearings() {
    const N = HYDRO_RES
    const m = new Uint8Array(N * N)
    const cell = WORLD / N
    const stamp = (x, z, r) => {
      const i0 = Math.max(0, Math.floor((x - r + HALF) / cell))
      const i1 = Math.min(N - 1, Math.floor((x + r + HALF) / cell))
      const j0 = Math.max(0, Math.floor((z - r + HALF) / cell))
      const j1 = Math.min(N - 1, Math.floor((z + r + HALF) / cell))
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) m[j * N + i] = 1
    }
    const sites = this.app.island.meta.sites
    for (const c of sites.loi) for (const p of c.paddies) for (const q of p.quad) stamp(q[0], q[1], 0.05)
    for (const h of sites.houses) stamp(h.x, h.z, 0.12)
    for (const h of sites.heiau) stamp(h.x, h.z, 0.5)
    for (const v of sites.villages) stamp(v.x, v.z, 0.3)
    for (const a of this.app.island.meta.ahu) stamp(a.x, a.z, 0.3)
    for (const k of sites.koa) stamp(k.x, k.z, 0.15)
    return m
  }

  isCleared(x, z) {
    const N = HYDRO_RES
    const i = Math.floor(((x + HALF) / WORLD) * N)
    const j = Math.floor(((z + HALF) / WORLD) * N)
    return i >= 0 && j >= 0 && i < N && j < N && this.cleared[j * N + i] === 1
  }

  landAt(x, z) {
    const N = HYDRO_RES
    const i = Math.floor(((x + HALF) / WORLD) * N)
    const j = Math.floor(((z + HALF) / WORLD) * N)
    if (i < 0 || j < 0 || i >= N || j >= N) return null
    const k = (j * N + i) * 4
    const d = this.land
    return { rain: d[k] / 255, sand: d[k + 1] / 255, rip: d[k + 2] / 255, field: d[k + 3] / 255 }
  }

  writeInstances(mesh, list) {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const c = new THREE.Color()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < list.length; i++) {
      const t = list[i]
      p.set(t.x, t.y, t.z)
      q.setFromAxisAngle(up, t.rot)
      s.setScalar(t.s)
      m.compose(p, q, s)
      mesh.setMatrixAt(i, m)
      c.setRGB(t.c, t.c * (0.96 + 0.08 * (((t.x * 997 + t.z * 131) % 1) + 1) % 1), t.c)
      mesh.setColorAt(i, c)
    }
    mesh.count = list.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  placeFixed(rand) {
    const { terrain } = this.app
    const sites = this.app.island.meta.sites
    const out = Object.fromEntries(KINDS.map((k) => [k, []]))
    const houses = sites.houses
    const clearOf = (x, z, r) => !houses.some((h) => Math.abs(h.x - x) < r && Math.abs(h.z - z) < r && Math.hypot(h.x - x, h.z - z) < r)
    const add = (kind, x, z, scale = 1) => {
      const y = terrain.heightAt(x, z)
      if (y <= 0.003) return false
      out[kind].push({ x, y, z, rot: rand() * Math.PI * 2, s: S * scale * (0.8 + rand() * 0.45), c: 0.85 + rand() * 0.3 })
      return true
    }
    // around each kauhale
    for (const v of sites.villages) {
      const n = v.alii ? 26 : v.model ? 20 : 12
      for (let k = 0; k < n; k++) {
        const a = rand() * Math.PI * 2
        const r = 0.12 + rand() * 0.7
        const x = v.x + Math.cos(a) * r
        const z = v.z + Math.sin(a) * r
        if (!clearOf(x, z, 0.09)) continue
        const L = this.landAt(x, z)
        const kind = L && L.sand > 0.3 ? 'niu' : rand() < 0.3 ? 'niu' : rand() < 0.4 ? 'ulu' : rand() < 0.5 ? 'kukui' : 'maia'
        add(kind, x, z)
      }
      for (let k = 0; k < (v.model ? 24 : 10); k++) {
        const h = houses[Math.floor(rand() * houses.length)]
        if (h.village !== v.id) continue
        const a = rand() * Math.PI * 2
        add(rand() < 0.75 ? 'ki' : 'kiRed', h.x + Math.cos(a) * 0.08, h.z + Math.sin(a) * 0.08, 0.9)
      }
    }
    // along the shore: coconut and hala, naupaka on the sand
    const trail = this.app.island.meta.trail
    for (let k = 0; k < trail.length; k++) {
      const p = trail[k]
      for (let r = 0; r < 3; r++) {
        const x = p[0] + (rand() - 0.5) * 2.6
        const z = p[1] + (rand() - 0.5) * 2.6
        const L = this.landAt(x, z)
        if (!L) continue
        const y = terrain.heightAt(x, z)
        if (y <= 0.003 || y > 0.4) continue
        if (L.sand > 0.4 && rand() < 0.5) add('naupaka', x, z, 0.8)
        else if (L.rain > 0.42 && rand() < 0.5) add('hala', x, z)
        else if (rand() < 0.45) add('niu', x, z)
        else if (L.rain < 0.3 && rand() < 0.5) add('aalii', x, z, 0.8)
      }
    }
    // up the valleys beside the loʻi: kukui and maiʻa on the banks, kī by the paths
    for (const complex of sites.loi) {
      for (let k = 0; k < complex.paddies.length; k += 2) {
        const pq = complex.paddies[k].quad
        const x = (pq[2][0] + pq[3][0]) / 2
        const z = (pq[2][1] + pq[3][1]) / 2
        const dx = pq[3][0] - pq[0][0]
        const dz = pq[3][1] - pq[0][1]
        const l = Math.hypot(dx, dz) || 1
        const ox = x + (dx / l) * 0.06
        const oz = z + (dz / l) * 0.06
        const r = rand()
        if (r < 0.3) add('maia', ox, oz)
        else if (r < 0.5) add('kukui', ox + (dx / l) * 0.1, oz + (dz / l) * 0.1)
        else if (r < 0.75) add(rand() < 0.8 ? 'ki' : 'kiRed', ox, oz, 0.9)
      }
    }
    return out
  }

  // A forest tile's trees: deterministic per tile, ~one candidate every 17 m,
  // packed straight into instance matrices and colours for each species.
  buildTile(ti, tj) {
    const { terrain } = this.app
    const n = Math.round(FOREST_T / 0.17)
    const step = FOREST_T / n
    const trees = Object.fromEntries(FOREST_KINDS.map((k) => [k, []]))
    let y0 = Infinity
    let y1 = -Infinity
    for (let a = 0; a < n; a++) {
      for (let b = 0; b < n; b++) {
        const gi = ti * n + a
        const gj = tj * n + b
        const h1 = hash2(gi, gj, 11)
        const h2 = hash2(gi, gj, 12)
        const x = (gi + h1) * step
        const z = (gj + h2) * step
        const L = this.landAt(x, z)
        if (!L || L.sand > 0.2 || L.field > 0.3 || this.isCleared(x, z)) continue
        const m = terrain.metresAt(x, z)
        if (m < 3) continue
        const r = L.rain + (hash2(gi, gj, 3) - 0.5) * 0.12
        const forest = Math.min(1, Math.max(0, (r - 0.3) / 0.22))
        const h3 = hash2(gi, gj, 13)
        let kind = null
        if (h3 < forest * 0.85) {
          if (L.rip > 0.4 && m < 450 && h3 < 0.5) kind = 'kukui'
          else if (m > 600 && r > 0.45) kind = hash2(gi, gj, 7) < 0.7 ? 'ohia' : 'koa'
          else if (m > 350) kind = hash2(gi, gj, 8) < 0.55 ? 'koa' : 'ohia'
          else kind = r > 0.5 ? 'ohia' : 'kukui'
        } else if (r < 0.3 && h3 < 0.08) kind = m < 500 && hash2(gi, gj, 9) < 0.5 ? 'wiliwili' : 'aalii'
        if (!kind) continue
        // keep off the steepest pali
        if (terrain.normalAt(x, z).y < 0.35 && hash2(gi, gj, 5) < 0.7) continue
        const y = terrain.heightAt(x, z)
        trees[kind].push(x, y, z, h1 * 6.28, S * (0.75 + h2 * 0.6) * (kind === 'aalii' ? 0.8 : 1), 0.82 + h3 * 0.35, hash2(gi, gj, 14))
        y0 = Math.min(y0, y)
        y1 = Math.max(y1, y)
      }
    }
    const data = {}
    let total = 0
    for (const k of FOREST_KINDS) {
      const t = trees[k]
      const cnt = t.length / 7
      const mat = new Float32Array(cnt * 16)
      const colr = new Float32Array(cnt * 3)
      for (let i = 0; i < cnt; i++) {
        const [x, y, z, rot, sc, c, v] = t.slice(i * 7, i * 7 + 7)
        const cs = Math.cos(rot) * sc
        const sn = Math.sin(rot) * sc
        // rotation about y, uniform scale, translation (column-major)
        mat.set([cs, 0, -sn, 0, 0, sc, 0, 0, sn, 0, cs, 0, x, y, z, 1], i * 16)
        colr.set([c, c * (0.96 + 0.08 * v), c], i * 3)
      }
      data[k] = { mat, col: colr, n: cnt }
      total += cnt
    }
    const x0 = ti * FOREST_T
    const z0 = tj * FOREST_T
    // crowns reach ~0.2 units up and out from the trunk, and sway a little
    const box = total ? new THREE.Box3(new THREE.Vector3(x0 - 0.2, y0, z0 - 0.2), new THREE.Vector3(x0 + FOREST_T + 0.2, y1 + 0.3, z0 + FOREST_T + 0.2)) : null
    return { data, box, total }
  }

  update(camera) {
    // the forest only matters within ~13 units of the camera
    const p = camera.position
    const ground = Math.max(0, this.app.terrain.heightAt(p.x, p.z))
    const alt = p.y - ground
    const show = alt < 14
    for (const k in this.meshes) this.meshes[k].visible = alt < 60
    this.group.visible = alt < 60
    for (const k of FOREST_KINDS) {
      this.forest.near[k].visible = show
      this.forest.far[k].visible = show
    }
    if (!show) return

    camera.updateMatrixWorld()
    this.projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.projView)
    // which tiles are in view, and at which level of detail
    const R = FOREST_R
    const i0 = Math.floor((p.x - R) / FOREST_T)
    const i1 = Math.floor((p.x + R) / FOREST_T)
    const j0 = Math.floor((p.z - R) / FOREST_T)
    const j1 = Math.floor((p.z + R) / FOREST_T)
    const near = []
    const far = []
    const missing = []
    let sel = ''
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const x0 = i * FOREST_T
        const z0 = j * FOREST_T
        const dx = Math.max(x0 - p.x, 0, p.x - x0 - FOREST_T)
        const dz = Math.max(z0 - p.z, 0, p.z - z0 - FOREST_T)
        const dNear = Math.hypot(dx, dz)
        if (dNear > R) continue
        const key = i * 8192 + j
        const t = this.tiles.get(key)
        if (!t) {
          missing.push([dNear, i, j])
          continue
        }
        if (!t.box || !this.frustum.intersectsBox(t.box)) continue
        const dFar = Math.hypot(Math.max(Math.abs(x0 - p.x), Math.abs(x0 + FOREST_T - p.x)), Math.max(Math.abs(z0 - p.z), Math.abs(z0 + FOREST_T - p.z)))
        const n = dNear < FOREST_LOD[1] + 0.3
        const f = dFar > FOREST_LOD[0] - 0.3
        if (n) near.push(t)
        if (f) far.push(t)
        sel += `${key}${n ? 'n' : ''}${f ? 'f' : ''},`
      }
    }
    // grow a few missing tiles a frame, nearest first, so arriving somewhere
    // never stalls a frame
    missing.sort((a, b) => a[0] - b[0])
    for (let k = 0; k < Math.min(missing.length, 10); k++) {
      const [, i, j] = missing[k]
      this.tiles.set(i * 8192 + j, this.buildTile(i, j))
    }
    if (this.tiles.size > 3000) {
      // forget tiles far behind us
      for (const [key, t] of this.tiles) {
        const i = Math.floor(key / 8192 + 0.5)
        const j = key - i * 8192
        if (Math.hypot((i + 0.5) * FOREST_T - p.x, (j + 0.5) * FOREST_T - p.z) > R * 3) this.tiles.delete(key)
      }
    }
    if (sel === this.lastSelection) return
    this.lastSelection = sel
    this.fill(this.forest.near, near)
    this.fill(this.forest.far, far)
  }

  /** Copy the chosen tiles' prebuilt instances into each species' buffers. */
  fill(meshes, tiles) {
    for (const k of FOREST_KINDS) {
      const mesh = meshes[k]
      const cap = mesh.instanceMatrix.count
      const M = mesh.instanceMatrix
      const C = mesh.instanceColor
      let n = 0
      for (const t of tiles) {
        const d = t.data[k]
        if (!d.n) continue
        const take = Math.min(d.n, cap - n)
        if (take <= 0) break
        M.array.set(take === d.n ? d.mat : d.mat.subarray(0, take * 16), n * 16)
        C.array.set(take === d.n ? d.col : d.col.subarray(0, take * 3), n * 3)
        n += take
      }
      mesh.count = n
      if (!n) continue
      M.clearUpdateRanges()
      M.addUpdateRange(0, n * 16)
      M.needsUpdate = true
      C.clearUpdateRanges()
      C.addUpdateRange(0, n * 3)
      C.needsUpdate = true
    }
  }
}
