// Puts everything people built onto the island, from the generator's sites.

import * as THREE from 'three'
import { HYDRO_RES, WORLD, HALF, Y_PER_M } from '../config.js'
import { mulberry32 } from '../gen/noise.js'
import { planFootings, drawnMetres, PAEPAE_TOP } from '../gen/footing.js'
import { layStreams } from './streams.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'
import { hale, placeHeiau, waa, kaulua, halau, ahu, koa, imu, kii, PALETTE } from './structures.js'
import { Loi } from './loi.js'

export class Features {
  constructor(app) {
    const { terrain, shared } = app
    const meta = app.island.meta
    const sites = meta.sites
    this.app = app
    this.meta = meta
    this.sites = sites
    this.group = new THREE.Group()
    const rand = mulberry32(meta.seed + 77)
    const B = new Builder()
    const ground = (x, z) => Math.max(terrain.heightAt(x, z), 0)

    // Every building stands where the generator settled it, on a platform
    // reaching the ground as it is drawn: after the hero falls cut their
    // headwalls, so one they undercut is found new ground (gen/footing.js).
    const lines = app.wailele?.lines || layStreams(meta, app.island.data)
    const plan = planFootings(app.island, lines).list
    // (every platform's outline, for whatever else must keep off them)
    this.footings = plan

    // --- kauhale (and the pond keepers' and the puʻuhonua's houses) ---------------
    for (const f of plan) if (f.kind === 'house') buildFooting(B, f, rand)
    // an imu by each village
    for (const f of plan) if (f.kind === 'imu') buildFooting(B, f, rand)

    // --- heiau (the puʻuhonua's among them) ----------------------------------------
    for (const f of plan) if (f.kind === 'heiau' || f.kind === 'luakini') buildFooting(B, f, rand)

    // --- canoes on the beach, and their sheds ------------------------------------
    this.beaches = []
    for (const c of sites.canoes) {
      // canoes lie across the beach, bows to the sea
      const dir = c.dir
      const along = dir + Math.PI / 2
      for (let k = 0; k < c.n; k++) {
        const off = (k - (c.n - 1) / 2) * 0.09
        const x = c.x + Math.cos(along) * off
        const z = c.z + Math.sin(along) * off
        B.at(x, ground(x, z) + 0.002, z, dir)
        waa(B, rand, 7 + rand() * 4)
        B.done()
      }
      this.beaches.push(c)
    }
    // the canoe sheds, following the beach up from the water along their length
    for (const f of plan) if (f.kind === 'halau') buildFooting(B, f, rand)
    // a voyaging canoe drawn up at the chief's landing
    if (sites.alii) {
      const c = sites.canoes.find((cc) => cc.village === sites.alii.id)
      if (c) {
        const along = c.dir + Math.PI / 2
        const x = c.x + Math.cos(along) * 0.45
        const z = c.z + Math.sin(along) * 0.45
        B.at(x, ground(x, z) + 0.002, z, c.dir)
        kaulua(B, rand)
        B.done()
      }
    }

    // --- koʻa, and the ahu where the trail crosses each boundary ---------------------
    for (const f of plan) if (f.kind === 'koa' || f.kind === 'ahu') buildFooting(B, f, rand)

    // --- fishponds ------------------------------------------------------------------
    this.ponds = sites.ponds
    this.pondMask(app)
    for (const p of sites.ponds) this.buildPond(B, p, rand)

    // --- the puʻuhonua ----------------------------------------------------------------
    if (sites.puuhonua) this.buildPuuhonua(B, sites.puuhonua, rand)
    // --- the hōlua slide ------------------------------------------------------------------
    if (sites.holua) this.buildHolua(B, sites.holua, rand)
    // --- salt pans ----------------------------------------------------------------------
    for (const f of plan) if (f.kind === 'salt') buildFooting(B, f, rand)

    this.material = objectMaterial(shared, { fade: [70, 110] })
    this.structures = new THREE.Mesh(B.geometry(), this.material)
    this.structures.frustumCulled = false
    this.group.add(this.structures)

    // --- loʻi -------------------------------------------------------------------------
    this.loi = new Loi(sites, terrain, shared)
    this.group.add(this.loi.group)
    this.banks = new THREE.Mesh(this.loi.banksGeometry, this.material)
    this.banks.frustumCulled = false
    this.group.add(this.banks)
  }

  /** Mark fishpond water in the sea texture (r channel): calm, green, enclosed. */
  pondMask(app) {
    const N = HYDRO_RES
    const data = app.seaData
    const tex = WORLD / N
    for (const p of this.ponds) {
      const poly = p.wall
      const xs = poly.map((q) => q[0])
      const zs = poly.map((q) => q[1])
      const i0 = Math.max(0, Math.floor((Math.min(...xs) + HALF) / tex))
      const i1 = Math.min(N - 1, Math.ceil((Math.max(...xs) + HALF) / tex))
      const j0 = Math.max(0, Math.floor((Math.min(...zs) + HALF) / tex))
      const j1 = Math.min(N - 1, Math.ceil((Math.max(...zs) + HALF) / tex))
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const x = -HALF + (i + 0.5) * tex
          const z = -HALF + (j + 0.5) * tex
          if (inside(poly, x, z)) data[(j * N + i) * 4] = 255
        }
      }
    }
    app.seaTex.needsUpdate = true
  }

  buildPond(B, p, rand) {
    const stone = col('#8a817a', 0.12, rand)
    const pts = p.wall
    const n = pts.length
    // distance along the wall, so each gate opening is the grate's own width
    // wherever it falls and however long the wall is
    const cum = [0]
    for (let k = 1; k < n; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
    const total = cum[n - 1]
    const along = (t) => {
      const f = t * (n - 1)
      const i = Math.min(n - 2, Math.floor(f))
      return cum[i] + (cum[i + 1] - cum[i]) * (f - i)
    }
    const at = (d) => {
      let i = 0
      while (i < n - 2 && cum[i + 1] < d) i++
      const f = (d - cum[i]) / Math.max(1e-9, cum[i + 1] - cum[i])
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]
    }
    const OPEN = 0.06 // gate opening, world units (a grate ~3.7 m across)
    const gaps = p.gates.map((g) => along(g)).map((d) => [Math.max(0, d - OPEN / 2), Math.min(total, d + OPEN / 2)])
    // the kuapā in runs between the mākāhā: each run stops exactly at an
    // opening's edge, so its capped end is the side of the gate
    let run = []
    const flush = () => {
      if (run.length > 1) B.wall(run, 0.1, 0.024, stone, MAT.stone, 0.72)
      run = []
    }
    const push = (xz) => run.push([xz[0], 0, xz[1]])
    let d = 0
    for (const [g0, g1] of gaps) {
      for (let k = 0; k < n; k++) if (cum[k] > d && cum[k] < g0) push(pts[k])
      push(at(g0))
      flush()
      push(at(g1))
      d = g1
    }
    for (let k = 0; k < n; k++) if (cum[k] > d) push(pts[k])
    flush()
    // a wooden grate filling each opening from side to side, square to the wall
    const w = col(PALETTE.wood, 0.15, rand)
    for (const [g0, g1] of gaps) {
      const a = at(g0)
      const b = at(g1)
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
      const span = Math.hypot(b[0] - a[0], b[1] - a[1]) / S // metres
      B.at((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2, ang)
      const stakes = Math.max(3, Math.round(span / 0.45))
      for (let k = 0; k <= stakes; k++) B.box(-span / 2 + 0.06 + ((span - 0.12) * k) / stakes, -0.4, 0, 0.12, 1.9, 0.12, w, MAT.wood)
      B.box(0, 1.25, 0, span, 0.15, 0.2, w, MAT.wood)
      B.box(0, 0.45, 0, span, 0.1, 0.16, w, MAT.wood)
      B.done()
    }
  }

  buildPuuhonua(B, site, rand) {
    const { terrain } = this.app
    const dir = site.dir
    const dx = Math.cos(dir)
    const dz = Math.sin(dir)
    const px = -dz
    const pz = dx
    const cx = site.x - dx * 1.6
    const cz = site.z - dz * 1.6
    // run the great wall across the neck of the point until it meets the sea
    const reach = (sgn) => {
      for (let t = 0.3; t < 9; t += 0.15) if (terrain.heightAt(cx + px * t * sgn, cz + pz * t * sgn) <= 0.002) return t
      return 4
    }
    const a = reach(-1)
    const b = reach(1)
    const pts = []
    for (let t = -a; t <= b; t += 0.12) {
      const x = cx + px * t
      const z = cz + pz * t
      pts.push([x, Math.max(0, terrain.heightAt(x, z)), z])
    }
    const stone = col(PALETTE.stoneDark, 0.1, rand)
    B.wall(pts, 0.08, 0.06, stone, MAT.stone, 0.8)
    // (a heiau inside and a few houses for the refugees are built with the
    // others) and kiʻi facing the sea
    for (let k = 0; k < 6; k++) {
      const t = (k - 2.5) * 0.12
      const x = site.x + px * t - dx * 0.05
      const z = site.z + pz * t - dz * 0.05
      B.at(x, Math.max(0, drawnHeight(terrain, x, z)), z, dir)
      kii(B, 0, 0, 4, rand)
      B.done()
    }
    this.puuhonuaWall = { a: pts[0], b: pts[pts.length - 1] }
  }

  buildHolua(B, h, rand) {
    const { terrain } = this.app
    const len = Math.hypot(h.x1 - h.x0, h.z1 - h.z0)
    const n = Math.ceil(len / 0.08)
    const ds = len / n
    const ux = (h.x1 - h.x0) / len
    const uz = (h.z1 - h.z0) / len
    const at = (s, o) => [h.x0 + ux * s - uz * o, h.z0 + uz * s + ux * o]
    // The causeway is laid on the ground as it is drawn up close, not on the
    // smooth heightAt: down this steep, gullied slope the terrain mesh's flat
    // triangles stand metres proud of it in places, and swallowed the track.
    // So its top clears the drawn ground across its whole width everywhere,
    // and stands at least as high over the ground as it always did; the
    // profile is eased so a sled rides it without kinks; and its walls reach
    // down to the ground wherever that leaves it built up off the slope, as
    // the real ones were built up across hollows.
    const ground = (x, z) => Math.max(terrain.heightAt(x, z), drawnHeight(terrain, x, z))
    const TOP = 0.014
    const SUB = 4
    const need = []
    for (let q = 0; q <= n * SUB; q++) {
      const s = (q / SUB) * ds
      let m = terrain.heightAt(...at(s, 0)) + 0.018
      for (let o = -0.041; o < 0.042; o += 0.0205) m = Math.max(m, ground(...at(s, o)) + 0.003)
      need.push(m - TOP)
    }
    const y = []
    for (let k = 0; k <= n; k++) y.push(terrain.heightAt(...at(k * ds, 0)) + 0.004)
    // raise it wherever the straight run between two samples dips under that
    const lift = () => {
      for (let it = 0; it < 8; it++) {
        let low = false
        for (let q = 0; q <= n * SUB; q++) {
          const k = Math.min(n - 1, Math.floor(q / SUB))
          const f = q / SUB - k
          const d = need[q] - (y[k] + (y[k + 1] - y[k]) * f)
          if (d > 1e-6) {
            low = true
            y[f < 0.5 ? k : k + 1] += d
          }
        }
        if (!low) break
      }
    }
    lift()
    for (let pass = 0; pass < 2; pass++) {
      const prev = y.slice()
      for (let k = 1; k < n; k++) y[k] = (prev[k - 1] + 2 * prev[k] + prev[k + 1]) / 4
      lift()
    }
    const surface = y.map((v, k) => {
      const [x, z] = at(k * ds, 0)
      return [x, v, z]
    })
    // a raised stone causeway, battered, its top laid with grass and ti
    // leaves; a taller stretch spreads wider at its foot
    const stone = col('#8a817a', 0.1, rand)
    const rings = y.map((v, k) => {
      const s = k * ds
      const r = []
      for (const sg of [-1, 1]) {
        const w = 0.055 + 0.6 * Math.max(0, v - 0.0042 - ground(...at(s, sg * 0.055)))
        let foot = v - 0.0042
        for (const a of [-0.5, 0, 0.5]) {
          const [px, pz] = at(s + a * ds, sg * w)
          foot = Math.min(foot, terrain.heightAt(px, pz) - 0.006, drawnHeight(terrain, px, pz) - 0.006)
        }
        const [fx, fz] = at(s, sg * w)
        r.push([fx, foot, fz])
      }
      const [rx, rz] = at(s, 0.041)
      const [lx, lz] = at(s, -0.041)
      r.push([rx, v + TOP, rz], [lx, v + TOP, lz])
      return r
    })
    for (let k = 0; k < n; k++) {
      const [a0, a1, a2, a3] = rings[k]
      const [b0, b1, b2, b3] = rings[k + 1]
      B.quad(a3, a2, b2, b3, stone, MAT.stone)
      B.quad(a1, b1, b2, a2, stone, MAT.stone)
      B.quad(b0, a0, a3, b3, stone, MAT.stone)
    }
    B.quad(...rings[0], stone, MAT.stone)
    const [e0, e1, e2, e3] = rings[n]
    B.quad(e1, e0, e3, e2, stone, MAT.stone)
    const top = col('#c2b25e', 0.1, rand)
    for (let k = 0; k < surface.length - 1; k++) {
      const a = surface[k]
      const b = surface[k + 1]
      const dx = b[0] - a[0]
      const dz = b[2] - a[2]
      const l = Math.hypot(dx, dz) || 1
      const nx = (-dz / l) * 0.034
      const nz = (dx / l) * 0.034
      const y0 = a[1] + 0.0145
      const y1 = b[1] + 0.0145
      B.quad([a[0] - nx, y0, a[2] - nz], [a[0] + nx, y0, a[2] + nz], [b[0] + nx, y1, b[2] + nz], [b[0] - nx, y1, b[2] - nz], top, MAT.plain)
    }
    this.holuaPath = surface
  }
}

/**
 * One building on its footing (gen/footing.js), as it is drawn: its platform
 * reaching the ground and what stands on it. (tools/audit-sites.mjs builds
 * them through this too, to measure what is drawn rather than what was meant.)
 */
export function buildFooting(B, f, rand) {
  switch (f.kind) {
    case 'house': {
      const [L, W, H] = f.dims
      const y = f.top - PAEPAE_TOP * S
      B.at(f.x, y, f.z, f.rot)
      hale(B, rand, L, W, H, true, (y - f.base) / S)
      B.done()
      break
    }
    case 'imu':
      B.at(f.x, f.top - 0.5 * S, f.z, 0)
      imu(B, rand)
      B.done()
      break
    case 'heiau':
    case 'luakini':
      placeHeiau(B, f, rand, S)
      break
    case 'halau':
      B.at(f.x, f.top - 0.3 * S, f.z, f.rot)
      lean(B, f.lean)
      halau(B, rand)
      B.done()
      break
    case 'koa':
      B.at(f.x, f.top - 0.5 * S, f.z, f.rot)
      koa(B, rand, (f.top - 0.5 * S - f.base) / S)
      B.done()
      break
    case 'ahu': {
      // (a smaller cairn where the ground is steep: f.size)
      const k = S * (f.size || 1)
      B.at(f.x, f.top, f.z, f.rot, k)
      ahu(B, rand, true, (f.top - f.base) / k)
      B.done()
      break
    }
    case 'salt': {
      // clay basins on the dry shore, each level, set on its own patch of ground
      const salt = col(PALETTE.salt, 0.06, rand)
      const clay = col('#7d5b44', 0.12, rand)
      for (const p of f.pans) {
        const y = p.top - 0.2 * S
        B.at(p.x, y, p.z, f.rot)
        B.box(0, (p.base - y) / S, 0, 6.6, (p.top - p.base) / S, 5.4, clay, MAT.plain)
        B.box(0, 0.05, 0, 5.8, 0.18, 4.6, rand() < 0.7 ? salt : col('#d9c2b4', 0.05, rand), MAT.kapa)
        B.done()
      }
      break
    }
  }
}

/** Lean the frame just placed with B.at: it rises `k` world units per unit along its own x. */
function lean(B, k) {
  if (!k) return
  const xf = B.xf
  B.xf = (p) => {
    const q = xf(p)
    q[1] += k * p[0] * S
    return q
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

/**
 * The ground as the terrain draws it up close: the finest CDLOD mesh, flat
 * triangles between vertices fetched bilinearly at the corners of its cells,
 * the diagonals alternating (render/terrain.js). Where the land is steep and
 * folded it stands well off the bilinear heightAt in places, so whatever has
 * to sit on the ground that is seen there reads this.
 */
export function drawnHeight(terrain, x, z) {
  return drawnMetres(terrain.heights, terrain.N, x, z) * Y_PER_M
}
