// Puts everything people built onto the island, from the generator's sites.

import * as THREE from 'three'
import { HYDRO_RES, WORLD, HALF } from '../config.js'
import { mulberry32 } from '../gen/noise.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'
import { hale, placeHeiau, waa, kaulua, halau, ahu, koa, imu, kii, PALETTE } from './structures.js'
import { Loi } from './loi.js'

const HOUSE = {
  noa: [7, 4.6, 5.2],
  mua: [8, 5, 5.6],
  aina: [6, 4.2, 4.6],
  kuku: [5, 3.6, 4.0],
  alii: [12, 7, 7.5],
}

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

    // --- kauhale -----------------------------------------------------------
    for (const h of sites.houses) {
      const [L, W, H] = HOUSE[h.kind] || HOUSE.noa
      const sc = h.scale || 1
      B.at(h.x, ground(h.x, h.z), h.z, h.rot)
      hale(B, rand, L * sc, W * sc, H * sc)
      B.done()
    }
    // an imu by each village
    for (const v of sites.villages) {
      const a = rand() * Math.PI * 2
      const x = v.x + Math.cos(a) * 0.35
      const z = v.z + Math.sin(a) * 0.35
      B.at(x, ground(x, z), z, 0)
      imu(B, rand)
      B.done()
    }

    // --- heiau ---------------------------------------------------------------
    for (const h of sites.heiau) {
      placeHeiau(B, h.x, ground(h.x, h.z), h.z, h.rot, rand, h.kind === 'luakini', S)
    }

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
      if (c.house) {
        const x = c.x - Math.cos(dir) * 0.32
        const z = c.z - Math.sin(dir) * 0.32
        B.at(x, ground(x, z), z, dir)
        halau(B, rand)
        B.done()
      }
      this.beaches.push(c)
    }
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

    // --- koʻa ------------------------------------------------------------------
    for (const k of sites.koa) {
      B.at(k.x, ground(k.x, k.z), k.z, rand() * 6)
      koa(B, rand)
      B.done()
    }

    // --- ahu where the trail crosses each boundary --------------------------------
    for (const a of meta.ahu) {
      B.at(a.x, ground(a.x, a.z), a.z, rand() * 6)
      ahu(B, rand, true)
      B.done()
    }

    // --- fishponds ------------------------------------------------------------------
    this.ponds = sites.ponds
    this.pondMask(app)
    for (const p of sites.ponds) this.buildPond(B, p, rand)

    // --- the puʻuhonua ----------------------------------------------------------------
    if (sites.puuhonua) this.buildPuuhonua(B, sites.puuhonua, rand)
    // --- the hōlua slide ------------------------------------------------------------------
    if (sites.holua) this.buildHolua(B, sites.holua, rand)
    // --- salt pans ----------------------------------------------------------------------
    for (const sp of sites.saltpans) this.buildSalt(B, sp, rand)

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
    // the kuapā, broken by the mākāhā gates
    let run = []
    const flush = () => {
      if (run.length > 1) B.wall(run, 0.1, 0.024, stone, MAT.stone, 0.72)
      run = []
    }
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1)
      const gate = p.gates.some((g) => Math.abs(g - t) < 0.022)
      if (gate) {
        flush()
        continue
      }
      run.push([pts[k][0], 0, pts[k][1]])
    }
    flush()
    // a wooden grate in each gate, and the pond keeper's hut at the first
    const w = col(PALETTE.wood, 0.15, rand)
    for (const g of p.gates) {
      const k = Math.round(g * (n - 1))
      const a = pts[Math.max(0, k - 1)]
      const b = pts[Math.min(n - 1, k + 1)]
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
      const x = pts[k][0]
      const z = pts[k][1]
      B.at(x, 0, z, ang)
      for (let s = -3; s <= 3; s++) B.box(s * 0.55, -0.4, 0, 0.12, 1.9, 0.12, w, MAT.wood)
      B.box(0, 1.25, 0, 4.2, 0.15, 0.2, w, MAT.wood)
      B.done()
    }
    const g0 = Math.round(p.gates[0] * (n - 1))
    const hx = pts[g0][0] - p.ax * 0.12
    const hz = pts[g0][1] - p.az * 0.12
    B.at(hx, 0.004, hz, rand() * 3)
    hale(B, rand, 4, 3, 3.4)
    B.done()
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
    // a heiau inside, kiʻi facing the sea, a few houses for the refugees
    const hx = site.x - dx * 0.5
    const hz = site.z - dz * 0.5
    placeHeiau(B, hx, Math.max(0, terrain.heightAt(hx, hz)), hz, dir, rand, false, S)
    for (let k = 0; k < 6; k++) {
      const t = (k - 2.5) * 0.12
      const x = site.x + px * t - dx * 0.05
      const z = site.z + pz * t - dz * 0.05
      B.at(x, Math.max(0, terrain.heightAt(x, z)), z, dir)
      kii(B, 0, 0, 4, rand)
      B.done()
    }
    for (let k = 0; k < 3; k++) {
      const x = cx + dx * 0.5 + px * (k - 1) * 0.6
      const z = cz + dz * 0.5 + pz * (k - 1) * 0.6
      B.at(x, Math.max(0, terrain.heightAt(x, z)), z, dir + Math.PI / 2)
      hale(B, rand, 6, 4, 4.2)
      B.done()
    }
    this.puuhonuaWall = { a: pts[0], b: pts[pts.length - 1] }
  }

  buildHolua(B, h, rand) {
    const { terrain } = this.app
    const n = Math.ceil(Math.hypot(h.x1 - h.x0, h.z1 - h.z0) / 0.08)
    const surface = []
    for (let k = 0; k <= n; k++) {
      const t = k / n
      const x = h.x0 + (h.x1 - h.x0) * t
      const z = h.z0 + (h.z1 - h.z0) * t
      surface.push([x, terrain.heightAt(x, z) + 0.004, z])
    }
    // a raised stone causeway, its top laid with grass and ti leaves
    B.wall(surface, 0.11, 0.014, col('#8a817a', 0.1, rand), MAT.stone, 0.75)
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

  buildSalt(B, sp, rand) {
    const { terrain } = this.app
    const ang = sp.dir + Math.PI / 2
    const salt = col(PALETTE.salt, 0.06, rand)
    const clay = col('#7d5b44', 0.12, rand)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const lx = (i - 1.5) * 0.11
        const lz = (j - 1) * 0.09
        const x = sp.x + Math.cos(ang) * lx - Math.sin(ang) * lz
        const z = sp.z + Math.sin(ang) * lx + Math.cos(ang) * lz
        const y = Math.max(terrain.heightAt(x, z), 0.004)
        B.at(x, y, z, ang)
        B.box(0, -0.3, 0, 6.6, 0.5, 5.4, clay, MAT.plain)
        B.box(0, 0.05, 0, 5.8, 0.18, 4.6, rand() < 0.7 ? salt : col('#d9c2b4', 0.05, rand), MAT.kapa)
        B.done()
      }
    }
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

