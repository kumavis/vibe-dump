// The trees of the fields of the year, where the camera comes down (DATA.md
// "Crops, on the era layers"; DESIGN.md §5.4): the pasture's few trees, the
// orchards' rows, a lawn's shade trees (coffee's close rows, shrubs a few
// metres high, are the ground's alone at these distances), read from the
// island's crop map (overlay/crops.js) on the lattices the ground draws them
// on from afar (render/shaders/crops.glsl.js), so the crowns seen from a few
// kilometres are the trees seen close in. Island and district alike: a
// district takes its island's map, so its fields are planted from the same
// tiles, stood on the district's ground while it is down.
//
// Nothing is stored and nothing is hand placed. A tile of 500 m is worked
// out when the camera's target comes within reach of it, every keyframe at
// once: each tree carries the span of years its keyframe is the year's
// nearest (overlay/crops.js boundaries), less the years a loʻi, a fishpond or
// a village of a district over the island stands where it would, and those a
// work's building, runway, field or pier does (data/works.js TREELESS: the
// tiles wait for the island's works to be read), so the
// year can be dragged without working anything out again, and the trees go
// over with the fields, dithered by the eased year (kit.js `grow`). The draw
// buffers are filled again only when the tiles in view change, or the year
// comes within a year and a half of a change of keyframe or of a feature's.
// A tile whose texels hold no tree's class in any keyframe is skipped at a
// glance; tiles behind the camera are let go, and an island's whole lot with
// its crop map.

import * as THREE from 'three'
import { MAT, S, Y, indexed, objectMaterial } from './kit.js'
import { farTree } from './vegetation.js'
import { CROP, CROP_LATTICE, CROP_REGION, CROP_CELL, COFFEE_PICK } from '../render/shaders/crops.glsl.js'
import { cropRegion, cropField, stripOffset, fromRegion, cropHash, cropCover, unpack } from '../overlay/crops.js'
import { spanOf } from '../data/district.js'
import { inside, mulberry32, smooth, clamp } from './settlements.js'
import { TREELESS } from '../data/works.js'

const TILE = 5 // world units (500 m)
// the camera's distance over which the trees come in, as the island's towns'
const RIG = [80, 125]
const MAX_DRAWN = 9000
const BUDGET = [3, 30]
const KEEP = 1.5
// How far from the camera they stand (world units), growing a little with
// its distance: out to where a pasture tree is three or four pixels across,
// about as far as a district's own trees (vegetation.js TREE_R). Beyond, the
// ground's crowns on the same lattices are the trees (crops.glsl.js
// cropCrowns), so instances further out would cost every frame for a pixel.
const reachFor = (d) => clamp(d * 1.5, 24, 36)
// sunk a little, so a trunk on a slope never stands off the ground (metres)
const SINK = 0.6
// open ends of a span, in years
const FAR = 1e5
// how near a tree's trunk a work keeps it off (world units: about its crown)
const CROWN = 0.04

export const KINDS = ['umbrella', 'orchard']
const K = Object.fromEntries(KINDS.map((k, i) => [k, i]))

const rectDist = (r, x, z) => Math.hypot(Math.max(r.x0 - x, 0, x - r.x1), Math.max(r.z0 - z, 0, z - r.z1))

/** The trees' far models, in metres, trunk base at the origin (as vegetation.js draws its own). */
function models(rand) {
  return {
    // monkeypod and kiawe in the pasture, shade trees on a lawn: a wide, flat crown
    umbrella: farTree(rand, {
      stick: [0.2, 3.4, 0],
      r0: 0.45,
      r1: 0.32,
      bark: '#5c5248',
      crowns: [[0.2, 5.4, 0, 6.0, 1.9, '#4F6230', MAT.leaf, 2, 0.7], [-1.8, 4.8, 1.4, 3.4, 1.4, '#596A35', MAT.leaf, 4, 0.7]],
    }),
    // mango, citrus, macadamia: a small round crown on a short trunk
    orchard: farTree(rand, { stick: [0, 1.4, 0], r0: 0.22, r1: 0.17, bark: '#5c5248', crowns: [[0, 3.1, 0, 2.8, 2.2, '#3F5A26', MAT.leaf, 1, 0.75]] }),
  }
}

export class CropTrees {
  constructor(app) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'crop trees'
    this.group.visible = false
    app.scene.add(this.group)
    this.islands = new Map()
    this.yearNow = app.timeline.year
    this.show = 0
    this.hidden = false
    this.geoms = null
    app.updaters.push((dt) => this.update(dt))
  }

  update(dt, budget = clamp((this.app.frameAvg ?? 16) * 0.2, BUDGET[0], BUDGET[1])) {
    const app = this.app
    const C = app.crops
    const target = app.timeline.year
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    const D = app.rig.state.distance
    let show = 1 - smooth(RIG[0], RIG[1], D)
    if (this.hidden || C.hidden || !C.available || !app.islandsLoaded) show = 0
    this.show = show
    this.group.visible = show > 0.001
    if (!this.group.visible) {
      for (const isl of this.islands.values()) isl.hide()
      return
    }
    const tgt = app.rig.state.target
    const R = reachFor(D)
    this.R = R
    const t0 = performance.now()
    for (const t of app.world.islands) {
      const map = C.map(t.pack.id)
      let isl = this.islands.get(t.pack.id)
      if (isl && isl.map !== map) {
        this.drop(t.pack.id)
        isl = null
      }
      const k = t.slot >= 0 ? t.k : 0
      if (!map || k <= 0.02 || rectDist(t.pack.rect, tgt.x, tgt.z) > R) {
        isl?.hide()
        continue
      }
      if (!isl) {
        this.geoms ??= Object.fromEntries(Object.entries(models(mulberry32(1898))).map(([k2, g]) => [k2, indexed(g)]))
        isl = new IslandCrops(this, t, map)
        this.islands.set(t.pack.id, isl)
      }
      isl.update(tgt, R, show * smooth(0.6, 0.95, k), Math.max(0.5, budget - (performance.now() - t0)))
    }
  }

  /** Let an island's trees go (its crop map went). */
  drop(id) {
    const isl = this.islands.get(id)
    if (!isl) return
    isl.dispose()
    this.islands.delete(id)
  }

  /** Straight to what the view wants (tools): every tile in reach worked out now. */
  settle() {
    this.update(0, Infinity)
  }

  get idle() {
    if (!this.group.visible) return true
    for (const isl of this.islands.values()) if (isl.active && isl.pending) return false
    return true
  }

  /** The trees standing in a year (whole), within `radius` of (x, z): { kind, x, z } each, for the tools. */
  alive(year = this.yearNow, x = null, z = null, radius = Infinity) {
    const out = []
    for (const isl of this.islands.values()) out.push(...isl.alive(year, x, z, radius))
    return out
  }

  stats() {
    const isl = [...this.islands.values()].map((i) => i.stats())
    return {
      show: +this.show.toFixed(2),
      year: +this.yearNow.toFixed(1),
      islands: isl,
      drawn: isl.reduce((s, i) => s + i.drawn, 0),
      built: isl.reduce((s, i) => s + i.built, 0),
      refills: isl.reduce((s, i) => s + i.refills, 0),
    }
  }
}

// --- one island ------------------------------------------------------------------

class IslandCrops {
  constructor(mgr, t, map) {
    this.mgr = mgr
    this.app = mgr.app
    this.t = t
    this.map = map
    this.id = t.pack.id
    this.rect = t.pack.rect
    this.group = new THREE.Group()
    this.group.name = `crop trees ${this.id}`
    mgr.group.add(this.group)
    this.tiles = new Map()
    this.active = false
    this.pending = 0
    this.drawn = 0
    this.built = 0
    this.refills = 0
    this.buildMs = 0
    this.key = ''
    const C = this.app.crops
    // each keyframe's span of years, as the timeline's (overlay/crops.js)
    this.spans = C.edges.map(([a, b]) => [Number.isFinite(a) ? a : -FAR, Number.isFinite(b) ? b : FAR])
    this.has = map.has
    // the features of the districts over this island that no tree stands in while they do: loʻi, fishponds, the village
    this.features = []
    for (const d of this.app.districts?.list || []) {
      if (d.parent !== this.id) continue
      for (const { f } of d.rastered) {
        const ring = (f.geometry?.coordinates?.[0] || []).map((c) => this.app.data.proj.toWorld(c))
        if (ring.length < 3) continue
        const xs = ring.map((p) => p[0])
        const zs = ring.map((p) => p[1])
        const [a, b] = spanOf(f.properties)
        this.features.push({ ring, span: [Number.isFinite(a) ? a : -FAR, Number.isFinite(b) ? b + 1 : FAR], box: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)] })
      }
    }
    // the years at which what stands changes: the keyframes' edges, the features'
    const edges = new Set()
    for (const [a, b] of this.spans) for (const v of [a, b]) if (Math.abs(v) < FAR) edges.add(v)
    for (const f of this.features) for (const v of f.span) if (Math.abs(v) < FAR) edges.add(v)
    this.edges = [...edges].sort((a, b) => a - b)
    // the works no tree stands on in their years: until they are read (null where the island has none), no tile is worked out
    this.works = this.app.works ? undefined : null
    this.app.works
      ?.exclusion(this.id)
      .catch(() => null)
      .then((ex) => {
        if (this.disposed) return
        this.works = ex
        if (ex) this.edges = [...new Set([...this.edges, ...[...ex.breaks].map((v) => v - 0.5)])].sort((a, b) => a - b)
        this.tiles.clear()
        this.key = ''
      })
    this.mostTrees()
    this.meshes()
  }

  /** Per tile, whether any keyframe has a tree's class on a texel of it (pasture, orchard, lawn). */
  mostTrees() {
    const { W, H, bytes } = this.map
    const r = this.rect
    const tw = Math.ceil((r.x1 - r.x0) / TILE)
    const th = Math.ceil((r.z1 - r.z0) / TILE)
    this.tw = tw
    this.th = th
    const any = new Uint8Array(tw * th)
    const sx = (r.x1 - r.x0) / W
    const sz = (r.z1 - r.z0) / H
    for (let j = 0; j < H; j++) {
      const tj = Math.min(th - 1, Math.floor(((j + 0.5) * sz) / TILE))
      for (let i = 0; i < W; i++) {
        const c = (j * W + i) * 4
        let hit = false
        for (let k = 0; k < 4 && !hit; k++) {
          const cl = bytes[c + k] >> 4
          hit = cl === CROP.pasture || cl === CROP.orchard || cl === CROP.lawn
        }
        if (hit) any[tj * tw + Math.min(tw - 1, Math.floor(((i + 0.5) * sx) / TILE))] = 1
      }
    }
    // (a field's middle may lie a texel over a tile's edge)
    this.anyTree = any.slice()
    for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) if (any[j * tw + i]) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const a = i + di
      const b = j + dj
      if (a >= 0 && b >= 0 && a < tw && b < th) this.anyTree[b * tw + a] = 1
    }
  }

  /** The class and share at a field's middle in each keyframe: four [class, share]. */
  classesAt(cx, cz) {
    const { W, H, bytes } = this.map
    const r = this.rect
    const i = Math.floor(((cx - r.x0) / (r.x1 - r.x0)) * W)
    const j = Math.floor(((cz - r.z0) / (r.z1 - r.z0)) * H)
    if (i < 0 || j < 0 || i >= W || j >= H) return null
    const c = (j * W + i) * 4
    return [0, 1, 2, 3].map((k) => unpack(bytes[c + k]))
  }

  /** The runs of keyframes in a mask of four bits, as spans of years. */
  runs(mask) {
    const out = []
    let k = 0
    while (k < 4) {
      if (!(mask & (1 << k))) {
        k++
        continue
      }
      let e = k
      while (e + 1 < 4 && mask & (1 << (e + 1))) e++
      if (this.spans[k] && this.spans[e]) out.push([this.spans[k][0], this.spans[e][1]])
      k = e + 1
    }
    return out
  }

  /** Spans less the years of the features standing at (x, z), and of the works keeping it (data/works.js TREELESS). */
  clip(spans, x, z) {
    let out = spans
    const less = (fa, fb) => {
      const next = []
      for (const [a, b2] of out) {
        if (fb <= a || fa >= b2) next.push([a, b2])
        else {
          if (fa > a) next.push([a, fa])
          if (fb < b2) next.push([fb, b2])
        }
      }
      out = next
    }
    for (const f of this.features) {
      const b = f.box
      if (x < b[0] || z < b[1] || x > b[2] || z > b[3] || !inside(f.ring, x, z)) continue
      less(f.span[0], f.span[1])
    }
    // (a work is whole from its start and gone at its end, fading over the year before each: the tree goes and comes back half a year early, so it fades as the work does)
    if (this.works) for (const [a, b] of this.works.standing(x, z, CROWN, TREELESS)) less(a - 0.5, b - 0.5)
    return out
  }

  /** Work out one tile: every tree of every keyframe on it, with the years it stands. */
  buildTile(ti, tj) {
    const t0 = performance.now()
    const r = this.rect
    const x0 = r.x0 + ti * TILE
    const z0 = r.z0 + tj * TILE
    const x1 = x0 + TILE
    const z1 = z0 + TILE
    const tile = { ti, tj, x0, z0, n: 0 }
    this.tiles.set(`${ti},${tj}`, tile)
    this.built++
    if (!this.anyTree[tj * this.tw + ti]) return tile
    const t = this.t
    const has = this.has
    const inst = []
    const plant = (kind, x, z, mask, seed) => {
      if (!mask) return
      const g = t.metresAt(x, z)
      if (g < 0.6) return
      for (const [a, b] of this.clip(this.runs(mask), x, z)) inst.push({ kind, x, z, y: g, a, b, seed })
    }
    const L = CROP_LATTICE
    for (let rz = Math.floor(z0 / CROP_REGION); rz <= Math.floor((z1 - 1e-9) / CROP_REGION); rz++) {
      for (let rx = Math.floor(x0 / CROP_REGION); rx <= Math.floor((x1 - 1e-9) / CROP_REGION); rx++) {
        const R = cropRegion(rx, rz)
        // the tile, clipped to the region, in the region's frame
        const bx0 = Math.max(x0, rx * CROP_REGION)
        const bz0 = Math.max(z0, rz * CROP_REGION)
        const bx1 = Math.min(x1, (rx + 1) * CROP_REGION)
        const bz1 = Math.min(z1, (rz + 1) * CROP_REGION)
        let q0 = [Infinity, Infinity]
        let q1 = [-Infinity, -Infinity]
        for (const [x, z] of [[bx0, bz0], [bx1, bz0], [bx1, bz1], [bx0, bz1]]) {
          const dx = x - R.ox
          const dz = z - R.oz
          const qx = dx * R.ex + dz * R.ez
          const qz = -dx * R.ez + dz * R.ex
          q0 = [Math.min(q0[0], qx), Math.min(q0[1], qz)]
          q1 = [Math.max(q1[0], qx), Math.max(q1[1], qz)]
        }
        const inBox = (x, z) => x >= bx0 && z >= bz0 && x < bx1 && z < bz1
        for (let iz = Math.floor(q0[1] / CROP_CELL[1]); iz <= Math.floor(q1[1] / CROP_CELL[1]); iz++) {
          const off = stripOffset(R, iz)
          for (let ix = Math.floor(q0[0] / CROP_CELL[0] + off); ix <= Math.floor(q1[0] / CROP_CELL[0] + off); ix++) {
            const { cx, cz, idx, idz, pick } = cropField(R, ix, iz)
            const cls = this.classesAt(cx, cz)
            if (!cls) continue
            const coffee = cropHash(idx + 9.4, idz + 9.4) >= COFFEE_PICK
            let mPast = 0
            let mLawn = 0
            let mOrch = 0
            for (let k = 0; k < 4; k++) {
              if (!has[k]) continue
              const [c, s] = cls[k]
              if (c === CROP.pasture) mPast |= 1 << k
              else if (c === CROP.lawn) mLawn |= 1 << k
              else if (c === CROP.orchard && pick < cropCover(c, s)) mOrch |= 1 << k
            }
            if (!(mPast | mLawn | mOrch)) continue
            // the field's own stretch of the region's frame
            const cq0 = [(ix - off) * CROP_CELL[0], iz * CROP_CELL[1]]
            const cq1 = [(ix + 1 - off) * CROP_CELL[0], (iz + 1) * CROP_CELL[1]]
            const lattice = (lat, seed, mask, kind) => {
              if (!mask) return
              const [su, sv, p] = lat
              for (let m = Math.floor(cq0[1] / sv); m <= Math.floor(cq1[1] / sv); m++) {
                for (let n = Math.floor(cq0[0] / su); n <= Math.floor(cq1[0] / su); n++) {
                  const ncx = n + rx * 997
                  const ncz = m + rz * 997
                  if (p < 1 && cropHash(ncx + seed, ncz + seed) >= p) continue
                  const jx = p < 1 ? cropHash(ncx + seed + 3.1, ncz + seed + 3.1) * 0.6 + 0.2 : 0.5
                  const jz = p < 1 ? cropHash(ncx + seed + 5.7, ncz + seed + 5.7) * 0.6 + 0.2 : 0.5
                  const qx = (n + jx) * su
                  const qz = (m + jz) * sv
                  if (qx < cq0[0] || qz < cq0[1] || qx >= cq1[0] || qz >= cq1[1]) continue
                  const [x, z] = fromRegion(R, qx, qz)
                  if (!inBox(x, z)) continue
                  plant(kind, x, z, mask, ncx * 7919 + ncz)
                }
              }
            }
            lattice(L.pasture, 211, mPast, K.umbrella)
            lattice(L.lawn, 307, mLawn, K.umbrella)
            if (!coffee) lattice(L.orchard, 0, mOrch, K.orchard)
          }
        }
      }
    }
    // packed, in an order of its own (the first of them a fair thinning)
    const N = inst.length
    tile.n = N
    if (N) {
      const rand = mulberry32((ti * 4099 + tj * 131 + 17) | 0)
      const order = Int32Array.from({ length: N }, (_, i) => i)
      for (let a = N - 1; a > 0; a--) {
        const b = Math.floor(rand() * (a + 1))
        const tmp = order[a]
        order[a] = order[b]
        order[b] = tmp
      }
      tile.order = order
      tile.pos = new Float32Array(N * 4) // x, metres, z, turn
      tile.spans = new Float32Array(N * 2)
      tile.scale = new Float32Array(N)
      tile.cols = new Float32Array(N * 3)
      tile.kind = new Uint8Array(N)
      inst.forEach((it, i) => {
        const h = (s) => cropHash(it.seed * 0.013 + s, it.seed * 0.0071 + s * 1.7)
        tile.pos.set([it.x, it.y - SINK, it.z, h(1.3) * Math.PI * 2], i * 4)
        tile.spans.set([it.a, it.b], i * 2)
        tile.scale[i] = 0.8 + 0.4 * h(2.9)
        const j = 0.9 + 0.2 * h(4.1)
        tile.cols.set([j, j * (0.97 + 0.06 * h(6.6)), j], i * 3)
        tile.kind[i] = it.kind
      })
    }
    this.buildMs += performance.now() - t0
    return tile
  }

  /** Every frame it is wanted: tiles in reach worked out (nearest first, within the budget), those far behind let go, the draw refreshed. */
  update(target, R, show, budget) {
    this.active = true
    if (this.works === undefined) {
      this.pending = 1
      this.group.visible = false
      return
    }
    const r = this.rect
    const i0 = clamp(Math.floor((target.x - R - r.x0) / TILE), 0, this.tw - 1)
    const i1 = clamp(Math.floor((target.x + R - r.x0) / TILE), 0, this.tw - 1)
    const j0 = clamp(Math.floor((target.z - R - r.z0) / TILE), 0, this.th - 1)
    const j1 = clamp(Math.floor((target.z + R - r.z0) / TILE), 0, this.th - 1)
    const want = []
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (this.tiles.has(`${i},${j}`)) continue
        const d = Math.hypot(r.x0 + (i + 0.5) * TILE - target.x, r.z0 + (j + 0.5) * TILE - target.z)
        if (d > R + TILE) continue
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
    const far = R * KEEP + TILE
    for (const [key, tile] of this.tiles) if (Math.hypot(tile.x0 + TILE / 2 - target.x, tile.z0 + TILE / 2 - target.z) > far) this.tiles.delete(key)
    this.group.visible = show > 0.001
    if (!this.group.visible) return
    const u = this.material.uniforms
    u.uShow.value = show
    u.uYearNow.value = this.mgr.yearNow
    u.uFadeNear.value = R * 0.75
    u.uFadeFar.value = R
    this.refresh(this.app.camera, R, this.t.pack.data.hi * this.app.world.uniforms.uVert.value + 3, built > 0)
  }

  hide() {
    this.active = false
    this.group.visible = false
    this.drawn = 0
    this.key = ''
  }

  // --- drawing -------------------------------------------------------------------

  meshes() {
    this.own = {
      uShow: { value: 0 },
      uShadeS: { value: this.t.shadow.texture },
      uShadeRect: { value: this.t.rect },
      uYearNow: { value: this.mgr.yearNow },
    }
    this.material = objectMaterial(this.app.shared, this.own, { fade: [50, 70], grow: true })
    this.kinds = KINDS.map((name) => ({ name, geometry: this.mgr.geoms[name].clone(), cap: 0, mesh: null, c: 0 }))
    this.frustum = new THREE.Frustum()
    this.pv = new THREE.Matrix4()
    this.box = new THREE.Box3()
    this.m4 = new THREE.Matrix4()
    this.q = new THREE.Quaternion()
    this.up = new THREE.Vector3(0, 1, 0)
    this.v3 = new THREE.Vector3()
    this.s3 = new THREE.Vector3()
  }

  /** A kind's mesh, with room for n instances (grown by doubling, up to MAX_DRAWN). */
  room(kd, n) {
    if (kd.cap >= n && kd.mesh) return
    const cap = Math.min(MAX_DRAWN, Math.max(256, kd.cap * 2, n))
    if (kd.mesh) {
      this.group.remove(kd.mesh)
      kd.mesh.dispose()
    }
    const g = kd.geometry
    const mesh = new THREE.InstancedMesh(g, this.material, cap)
    mesh.name = kd.name
    mesh.count = 0
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3)
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
    const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4)
    aSpan.setUsage(THREE.DynamicDrawUsage)
    const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(cap).fill(1), 1)
    g.setAttribute('aSpan', aSpan)
    g.setAttribute('aStretch', aStretch)
    Object.assign(kd, { mesh, cap, aSpan })
    this.group.add(mesh)
  }

  /** Where the year stands among the changes: what is alive within a year of it changes only when this does. */
  epoch(y) {
    let lo = 0
    let hi = 0
    for (const e of this.edges) {
      if (e < y - 1.5) lo++
      if (e < y + 1.5) hi++
    }
    return `${lo}/${hi}`
  }

  /** Refill the draw buffers: the trees standing near the year in the tiles in view, within reach, thinned with distance. */
  refresh(camera, R, maxY, changed) {
    const y = this.mgr.yearNow
    const p = camera.position
    this.pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.pv)
    const FULL = R * 0.6
    const tiles = []
    let key = ''
    for (const tile of this.tiles.values()) {
      if (!tile.n) continue
      this.box.min.set(tile.x0, -0.5, tile.z0)
      this.box.max.set(tile.x0 + TILE, maxY, tile.z0 + TILE)
      const dd = this.box.distanceToPoint(p)
      if (dd > R || !this.frustum.intersectsBox(this.box)) continue
      const f = Math.round((dd < FULL ? 1 : Math.pow(FULL / dd, 1.5)) * 20)
      tiles.push([tile, f])
      key += `${tile.ti},${tile.tj}:${f};`
    }
    const D = this.app.districts
    const dOn = !!D?.on && D.cur?.parent === this.t
    key += `|${this.epoch(y)}|${dOn ? Math.round(D.k * 8) : -1}`
    if (!changed && key === this.key) return
    this.key = key
    this.refills++
    const alive = (tile, i) => tile.spans[i * 2] < y + 1 && tile.spans[i * 2 + 1] > y - 1
    let want = 0
    const counts = tiles.map(([tile, f]) => {
      let n = 0
      for (let i = 0; i < tile.n; i++) if (alive(tile, i)) n++
      want += Math.ceil((n * f) / 20)
      return n
    })
    const thin = Math.min(1, MAX_DRAWN / Math.max(1, want))
    const picks = []
    const need = new Int32Array(KINDS.length)
    tiles.forEach(([tile, f], k) => {
      const take = Math.ceil((counts[k] * f * thin) / 20)
      let got = 0
      for (let o = 0; o < tile.n && got < take; o++) {
        const i = tile.order[o]
        if (!alive(tile, i)) continue
        picks.push(tile, i)
        need[tile.kind[i]]++
        got++
      }
    })
    this.kinds.forEach((kd, k) => {
      if (need[k]) this.room(kd, need[k])
      kd.c = 0
    })
    const dRect = dOn ? D.cur.d.rect : null
    const W = this.app.world
    for (let k = 0; k < picks.length; k += 2) {
      const tile = picks[k]
      const i = picks[k + 1]
      const kd = this.kinds[tile.kind[i]]
      if (kd.c >= kd.cap) continue
      const c = kd.c++
      const px = tile.pos[i * 4]
      const pz = tile.pos[i * 4 + 2]
      let m = tile.pos[i * 4 + 1]
      // (on a district that is down, its own ground)
      if (dRect && px > dRect.x0 && pz > dRect.z0 && px < dRect.x1 && pz < dRect.z1) m = W.metresAt(px, pz) - SINK
      this.q.setFromAxisAngle(this.up, tile.pos[i * 4 + 3])
      this.v3.set(px, Y(m), pz)
      const s = tile.scale[i] * S
      this.s3.set(s, s, s)
      this.m4.compose(this.v3, this.q, this.s3)
      this.m4.toArray(kd.mesh.instanceMatrix.array, c * 16)
      kd.mesh.instanceColor.array.set(tile.cols.subarray(i * 3, i * 3 + 3), c * 3)
      const a = tile.spans[i * 2]
      const b = tile.spans[i * 2 + 1]
      kd.aSpan.array.set([a - 0.5, a + 0.5, b - 0.5, b + 0.5], c * 4)
    }
    this.drawn = 0
    for (const kd of this.kinds) {
      if (!kd.mesh) continue
      kd.mesh.count = kd.c
      kd.mesh.visible = kd.c > 0
      kd.mesh.instanceMatrix.needsUpdate = true
      kd.mesh.instanceColor.needsUpdate = true
      kd.aSpan.needsUpdate = true
      this.drawn += kd.c
    }
  }

  alive(year, x = null, z = null, radius = Infinity) {
    const out = []
    for (const tile of this.tiles.values()) {
      for (let i = 0; i < tile.n; i++) {
        if (!(tile.spans[i * 2] + 0.5 <= year && tile.spans[i * 2 + 1] - 0.5 > year)) continue
        const px = tile.pos[i * 4]
        const pz = tile.pos[i * 4 + 2]
        if (x !== null && Math.hypot(px - x, pz - z) > radius) continue
        out.push({ island: this.id, kind: KINDS[tile.kind[i]], x: px, z: pz })
      }
    }
    return out
  }

  stats() {
    let n = 0
    let worked = 0
    let bytes = 0
    for (const t of this.tiles.values()) {
      n += t.n
      if (t.n) worked++
      for (const k of ['order', 'pos', 'spans', 'scale', 'cols', 'kind']) bytes += t[k]?.byteLength || 0
    }
    return {
      island: this.id,
      tiles: this.tiles.size,
      worked,
      pending: this.pending,
      instances: n,
      drawn: this.drawn,
      byKind: Object.fromEntries(this.kinds.map((kd) => [kd.name, kd.mesh ? kd.mesh.count : 0])),
      built: this.built,
      refills: this.refills,
      msPerTile: this.built ? +(this.buildMs / this.built).toFixed(2) : null,
      cpuMB: +(bytes / 1048576).toFixed(2),
    }
  }

  dispose() {
    this.disposed = true
    this.mgr.group.remove(this.group)
    for (const kd of this.kinds) {
      kd.mesh?.dispose()
      kd.geometry.dispose()
    }
    this.material.dispose()
    this.tiles.clear()
  }
}
