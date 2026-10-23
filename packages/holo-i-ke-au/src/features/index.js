// What stands in the district in the chosen year, from its features.json
// (DATA.md "District packs"), built once when the district arrives
// (render/district.js) and shown as it takes over:
//
// - the loʻi and the fishponds' water are laid into the ground itself
//   (common.glsl.js, district.glsl.js); here, each pond's wall of stacked
//   stone round it;
// - the village at Kou, a cluster of hale on their paepae, the houses
//   scattered in kauhale of two to four (how many is a drawing choice: no
//   source read counts them for 1795, and none is implied), and canoes drawn
//   up across the beach of the year below it, bows to the sea;
// - the streams, routed over the pack's heights (data/district-decode.js),
//   and the trail up the valley and over the pali, as ribbons on the ground;
// - the trees (vegetation.js), the battles as pixel-art soldiers (forces.js, soldiers.js), and the
//   place names (labels.js);
// - and the buildings of every other year and place (settlements.js), from
//   the settlement layer's density for the year, their kind by the era and
//   their value, the streets of the town under them; they yield to the
//   village at Kou while it stands, and toward the district's edge to the
//   island's own (towns.js), which the trees keep clear of too.
//
// Each thing belongs to a feature, and shows while the year is within that
// feature's from and to (the shared uFeatK for the rastered ones, a weight of
// its own here for the rest), so after a feature's last year nothing is
// drawn in its place. The heiau of features.json stand at their ahupuaʻa's
// centroid (their precision), so they are not drawn.

import * as THREE from 'three'
import { Builder, MAT, S, Y, col, objectMaterial } from './kit.js'
import { hale, waa, imu, PALETTE } from './structures.js'
import { Forest, TREE_R } from './vegetation.js'
import { Ribbons } from './ribbons.js'
import { Forces } from './forces.js'
import { Labels } from './labels.js'
import { Settlements } from './settlements.js'
import { holds } from '../data/district.js'
import { patchLevel, fromHalf } from '../data/district-decode.js'

// the village's houses and canoes, a little larger again than the trees
const HALE_S = S * 1.4

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function inside(poly, x, z) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

/** The corners of a paepae: centre, turn (as Builder.at turns), length along x and width along z. */
function corners(x, z, a, L, W) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * L * c - v * W * s) / 2, z + (u * L * s + v * W * c) / 2])
}

/** Whether two convex quads overlap (separating axes). */
function overlaps(A, B) {
  for (const P of [A, B]) {
    for (let i = 0; i < 4; i++) {
      const p = P[i]
      const q = P[(i + 1) % 4]
      const n = [q[1] - p[1], p[0] - q[0]]
      let a0 = Infinity
      let a1 = -Infinity
      let b0 = Infinity
      let b1 = -Infinity
      for (const c of A) {
        const d = c[0] * n[0] + c[1] * n[1]
        a0 = Math.min(a0, d)
        a1 = Math.max(a1, d)
      }
      for (const c of B) {
        const d = c[0] * n[0] + c[1] * n[1]
        b0 = Math.min(b0, d)
        b1 = Math.max(b1, d)
      }
      if (a1 < b0 || b1 < a0) return false
    }
  }
  return true
}

/** A polyline resampled to about `step` world units, so a ribbon follows the ground between its points. */
function resample(pts, step) {
  const out = [pts[0]]
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step))
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n])
  }
  return out
}

export class DistrictFeatures {
  constructor(app, districts, rec) {
    this.app = app
    this.districts = districts
    this.rec = rec
    this.group = new THREE.Group()
    this.group.name = 'district features'
    const shared = app.shared
    const proj = app.data.proj
    const feats = rec.d.features.features || []
    this.own = {
      uShow: { value: 0 },
      uFeatSeen: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uDistS: { value: rec.terrain.shadow.texture },
      // the year as the town eases to it, and what the town has built in it (settlements.js)
      uYearNow: { value: app.timeline.year },
      uTownClear: { value: null },
    }
    const rand = mulberry32(1795)

    // --- what people built ---------------------------------------------------------
    const B = new Builder()
    this.counts = { hale: 0, waa: 0, pondWalls: 0 }
    for (const [index, f] of rec.d.byIndex) {
      const kind = f.properties?.kind
      const ring = f.geometry.coordinates[0].map((c) => proj.toWorld(c))
      if (kind === 'village') this.buildVillage(B, ring, index, rand)
      else if (kind === 'fishpond') this.buildPond(B, ring, index, rand)
    }
    this.structMat = objectMaterial(shared, this.own, { fade: [70, 110] })
    this.structures = new THREE.Mesh(B.geometry(), this.structMat)
    this.structures.frustumCulled = false
    this.group.add(this.structures)

    // --- trees -------------------------------------------------------------------
    this.forest = new Forest(rec.data.trees, rec.d.rect, shared, this.own)
    this.group.add(this.forest.group)

    // --- streams and the trail, and the battles' fronts ------------------------------
    this.ribbons = new Ribbons(shared, app.camera)
    const st = rec.data.streams
    const lines = []
    for (let q = 0; q < st.length; ) {
      const n = st[q++]
      const pts = []
      const width = []
      for (let k = 0; k < n; k++, q += 3) {
        pts.push([st[q], st[q + 1]])
        // (a few metres across at the presentation scale, wider down the trunks)
        width.push(Math.min(7.5, 1.0 + 1.3 * Math.pow(st[q + 2], 0.45)) * S)
      }
      lines.push({ pts, width })
    }
    this.streams = this.ribbons.add(lines, { mode: 'water', alpha: 0, minPx: 0.9, lift: 0.004, order: 5 })
    this.streamCount = lines.length
    this.trails = []
    for (const f of feats) {
      const p = f.properties || {}
      if (p.kind !== 'trail' || f.geometry?.type !== 'LineString') continue
      const pts = resample(f.geometry.coordinates.map((c) => proj.toWorld(c)), 0.12)
      const batch = this.ribbons.add([{ pts, width: 3.2 * S }], { mode: 'earth', colour: new THREE.Color('#9c7f5c').toArray(), alpha: 0, minPx: 1.3, lift: 0.006, order: 5 })
      if (batch) this.trails.push({ p, batch, w: 0 })
    }
    this.forces = new Forces(app, feats, shared, this.ribbons, (x, z) => this.groundAt(x, z, false))
    this.group.add(this.ribbons.group, this.forces.group)

    // --- the town of the year, and the houses of the countryside ------------------------
    this.settlements = new Settlements(app, districts, rec, this.own, this.ribbons)
    this.group.add(this.settlements.group)

    // --- names ----------------------------------------------------------------------
    this.labels = new Labels(app, feats)
    this.show = 0
  }

  /** Ground for building at (x, z): today's heights, or the reef the patch makes of them in its years. */
  groundAt(x, z, patched = true) {
    const h = this.districts.rawAt(x, z)
    if (!patched) return h
    const { d } = this.rec
    const r = d.rect
    const i = Math.max(0, Math.min(d.W - 1, Math.floor(((x - r.x0) / (r.x1 - r.x0)) * d.W)))
    const j = Math.max(0, Math.min(d.H - 1, Math.floor(((z - r.z0) / (r.z1 - r.z0)) * d.H)))
    const c = j * d.W + i
    return patchLevel(h, this.rec.aux[c * 4], 1, fromHalf(this.rec.carve[c * 2]))
  }

  /**
   * The village: kauhale of two to four hale on the level ground inside its
   * outline, drawn a little larger again than the trees (HALE_S), so the
   * houses read as houses from the harbour stop.
   */
  buildVillage(B, ring, index, rand) {
    B.feature(index)
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const [x, z] of ring) {
      x0 = Math.min(x0, x)
      x1 = Math.max(x1, x)
      z0 = Math.min(z0, z)
      z1 = Math.max(z1, z)
    }
    const step = 0.85 // world units between kauhale, about
    const homes = []
    // (every paepae laid so far, a little grown: no two meet, since two
    // platforms of one height overlapping fight over every pixel they share)
    const laid = []
    for (let z = z0 + step / 2; z < z1; z += step) {
      for (let x = x0 + step / 2; x < x1; x += step) {
        const cx = x + (rand() - 0.5) * step * 0.7
        const cz = z + (rand() - 0.5) * step * 0.7
        if (!inside(ring, cx, cz) || rand() < 0.25) continue
        homes.push([cx, cz])
      }
    }
    for (const [cx, cz] of homes) {
      const rot = rand() * Math.PI * 2
      const n = 2 + Math.floor(rand() * 3)
      const here = []
      for (let h = 0; h < n; h++) {
        const a = rot + (h / n) * Math.PI * 2 + (rand() - 0.5) * 0.6
        const r = h === 0 ? 0 : 0.3 + rand() * 0.12
        const x = cx + Math.cos(a) * r
        const z = cz + Math.sin(a) * r
        // (a house clear of the others in its kauhale)
        if (!inside(ring, x, z) || here.some(([hx, hz]) => Math.hypot(hx - x, hz - z) < 0.3)) continue
        here.push([x, z])
        const L = 6 + rand() * 3
        const Wd = 4 + rand() * 1.4
        // on level, dry ground; the paepae reaches down to the lowest under it
        let lo = Infinity
        let hi = -Infinity
        for (const [dx, dz] of [[0, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const g = this.groundAt(x + dx * L * 0.5 * HALE_S, z + dz * Wd * 0.5 * HALE_S, false)
          lo = Math.min(lo, g)
          hi = Math.max(hi, g)
        }
        if (lo < 0.6 || hi - lo > 2.5) continue
        const turn = rot + (h % 2) * Math.PI * 0.5
        const pad = corners(x, z, turn, (L + 2.4) * HALE_S, (Wd + 2.4) * HALE_S)
        if (laid.some((q) => overlaps(q, pad))) continue
        laid.push(pad)
        const y = Y(hi)
        B.at(x, y, z, turn, HALE_S)
        hale(B, rand, L, Wd, 4.6 + rand() * 1.2, true, 0.9 + Y(hi - lo) / HALE_S)
        B.done()
        this.counts.hale++
      }
      if (rand() < 0.4) {
        const x = cx + 0.08
        const z = cz - 0.06
        B.at(x, Y(this.groundAt(x, z, false)), z, 0, HALE_S)
        imu(B, rand)
        B.done()
      }
    }
    // the canoes, drawn up across the beach of the year below the village, bows to the sea
    this.buildCanoes(B, ring, index, rand)
    B.feature(0)
  }

  buildCanoes(B, ring, index, rand) {
    let cx = 0
    let cz = 0
    for (const [x, z] of ring) {
      cx += x / ring.length
      cz += z / ring.length
    }
    const found = []
    const reach = 9 // world units round the village
    const step = 0.06
    const dirs = Array.from({ length: 16 }, (_, k) => [Math.cos((k / 16) * Math.PI * 2), Math.sin((k / 16) * Math.PI * 2)])
    for (let z = cz - reach; z < cz + reach; z += step) {
      for (let x = cx - reach; x < cx + reach; x += step) {
        const g = this.groundAt(x, z)
        if (g < 0.3 || g > 2.2) continue
        // within a few tens of metres of the water of the year: which way is it?
        let sea = null
        for (const [dx, dz] of dirs) {
          if (this.groundAt(x + dx * 0.3, z + dz * 0.3) <= 0) {
            sea = sea ? [sea[0] + dx, sea[1] + dz] : [dx, dz]
          }
        }
        if (!sea) continue
        found.push([x, z, g, Math.atan2(sea[1], sea[0]), Math.hypot(x - cx, z - cz)])
      }
    }
    // the stretch of beach nearest the village, canoes a little apart
    found.sort((a, b) => a[4] - b[4])
    const placed = []
    for (const c of found) {
      if (placed.length >= 14) break
      if (placed.some((p) => Math.hypot(p[0] - c[0], p[1] - c[1]) < 0.22)) continue
      placed.push(c)
    }
    for (const [x, z, g, dir] of placed) {
      B.at(x, Y(g) + 0.002, z, dir, HALE_S)
      waa(B, rand, 7 + rand() * 4)
      B.done()
      this.counts.waa++
    }
  }

  /** A fishpond's wall of stacked stone along its outline, standing on the ground there. */
  buildPond(B, ring, index, rand) {
    B.feature(index)
    const stone = col(PALETTE.pondStone, 0.12, rand)
    const pts = resample(ring, 0.05).map(([x, z]) => [x, Y(Math.max(this.groundAt(x, z), -0.8)) - 0.004, z])
    B.wall(pts, 3.0 * S, 1.6 * S, stone, MAT.stone, 0.72)
    this.counts.pondWalls++
    B.feature(0)
  }

  update(dt, k, distance) {
    const show = k
    this.show = show
    this.own.uShow.value = show
    const seen = this.districts.featSeen
    const fs = this.own.uFeatSeen.value
    for (let i = 0; i < 64; i++) fs[i >> 2].setComponent(i & 3, seen[i])
    this.group.visible = show > 0.001
    const year = this.app.timeline.year
    const ease = dt > 0 ? 1 - Math.exp(-dt * 1.6) : 1
    if (this.streams) this.streams.uniforms.uAlpha.value = 0.8 * show
    for (const t of this.trails) {
      const want = holds(t.p, year) ? 1 : 0
      t.w += (want - t.w) * ease
      if (Math.abs(want - t.w) < 0.003) t.w = want
      t.batch.uniforms.uAlpha.value = 0.75 * t.w * show
    }
    this.forest.update(this.app.camera, show, this.rec.data.hi * this.app.world.uniforms.uVert.value + 1, distance)
    this.forces.update(dt, show, distance)
    this.settlements.update(dt, show, distance)
    this.ribbons.update(this.app.renderer)
    this.labels.update(show)
  }

  settle(k, distance) {
    this.update(0, k, distance)
  }

  stats() {
    return {
      ...this.counts,
      trees: this.forest.total,
      treesDrawn: this.forest.drawn,
      treeRadius: TREE_R,
      streams: this.streamCount,
      trails: this.trails.filter((t) => t.w > 0.5).length,
      forces: this.forces.stats(),
      labels: this.labels.visible(),
      settlements: this.settlements.stats(),
    }
  }

  dispose() {
    this.structures.geometry.dispose()
    this.structMat.dispose()
    this.forest.dispose()
    this.ribbons.dispose()
    this.forces.dispose()
    this.settlements.dispose()
    this.labels.dispose()
  }
}
