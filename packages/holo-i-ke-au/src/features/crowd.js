// The people of a departure or a landing (DESIGN.md §14; DATA.md "Vessels
// and crowds"): the `crowd` polygons of features.json, and the crews of the
// vessels (vessels.js), as billboarded pixel-art figures (people.js), in one
// instanced draw and one for their shadows, with the battles' shader
// (render/shaders/sprite.glsl.js), the battles' one scale and its dither
// crossfade (soldiers.js Scale), so a figure never jumps in size and a
// crowd of thousands costs what the soldiers do.
//
// A crowd is scattered over its polygon by `count` (or `density` times its
// area) from a seed of its id, on the ground: a figure stands only where the
// district's ground is dry, never in the water of the year (the ground drawn
// now, app.world.metresAt, looked up again as the year or the district
// changes) and never on what the town has built in the year (settlements.js,
// its clearing map). Each faces the sea (the nearest water the way the open sea lies, not a pond behind) or the bearing
// it is given, and does, quietly, what its `behaviour` says, the figures
// shared out among several when it names a list:
//
// - gather: knots of three to seven standing together, sharing a foot and
//   set apart by whole sprite pixels as the soldiers' knots are, so a knot
//   stays a knot at every zoom; some talk among themselves, facing in;
// - wave: each now and then raises an arm and waves for a second or two;
// - chant: a few together in a row, the same gesture in unison, a conch
//   raised by whoever carries one;
// - procession: a file walking the polygon's long axis slowly, each one
//   dissolving near its far end to come in again at its start;
// - watch: standing still, a hand shifting now and then.
//
// The crowd thins as the view widens, as the battles do, to as many as the
// polygon holds on the screen; and past the near zoom it is gone.
//
// A crew stands on its vessel's deck, facing forward, or sits in a waʻa
// pulling its paddle while the canoe moves; vessels.js gives each its place
// every frame.

import * as THREE from 'three'
import { buildPeopleSheet, ANIM, FRAMES, W as SW, H as SH } from './people.js'
import { Scale, wantScale, FACE, HOLD } from './soldiers.js'
import { spriteVertex, spriteFragment, shadowVertex, shadowFragment } from '../render/shaders/sprite.glsl.js'
import { NEAR_EXAG } from '../config.js'

export const MAX_DRAWN = 2400
export const MAX_PER_CROWD = 8000
export const CROWD_BEHAVIOURS = ['gather', 'wave', 'chant', 'procession', 'watch']
export const CROWD_DRESS = ['1970s', 'kingdom', 'precontact']
const MODE = { stand: 0, wave: 1, chant: 2, walk: 3, watch: 4, crew: 5, paddle: 6 }
const COLUMN = [0, 0, 1, 2]
const GAIT = 4 // sprite pixels a second, a slow walk
const FADE_S = 0.35

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hashOf = (s) => {
  let h = 2166136261
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}
function inside(ring, x, z) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]
    const b = ring[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}
/** Inside a polygon's outer ring and none of its holes. */
const inPoly = (rings, x, z) => inside(rings[0], x, z) && !rings.slice(1).some((h) => inside(h, x, z))
function areaOf(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1])
  return Math.abs(a) / 2
}
/** The share of each behaviour a crowd names: a word, a list (equal shares) or { word: share }. */
export function behaviourShares(b) {
  if (typeof b === 'string') return { [b]: 1 }
  if (Array.isArray(b) && b.length) return Object.fromEntries(b.map((k) => [k, 1 / b.length]))
  if (b && typeof b === 'object') {
    const s = Object.values(b).reduce((a, v) => a + v, 0) || 1
    return Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v / s]))
  }
  return { watch: 1 }
}

export class People {
  /**
   * crowds: [{ p, rings (world [x, z]), w }] from vessels.js; crews: [{ vessel, local [x, y, z]
   * metres, body, dress }]; ground: the district's metres at (x, z), today's; settlements: for what
   * the town has built in the year.
   */
  constructor(app, shared, crowds, crews, ground, settlements = null) {
    this.app = app
    this.crowds = crowds
    this.crews = crews
    this.ground = ground
    this.settlements = settlements
    this.sheet = buildPeopleSheet()
    const specs = []
    crowds.forEach((c, ci) => this.planCrowd(c, ci, specs))
    this.crewFrom = specs.length
    crews.forEach((c, k) => specs.push({ src: 1, rec: k, mode: c.body === 'paddler' ? MODE.paddle : MODE.crew, row: this.rowFor(c.body, c.dress, k), x: 0, z: 0, hx: 1, hz: 0, dx: 0, dy: 0 }))
    const N = specs.length
    this.count = N
    const n1 = Math.max(1, N)
    const F = () => new Float32Array(n1)
    const U = () => new Uint8Array(n1)
    const I = () => new Int8Array(n1)
    this.f = { src: U(), rec: new Uint16Array(n1), mode: U(), row: F(), x: F(), z: F(), hx: F(), hz: F(), dx: I(), dy: I(), face0: new Int8Array(n1).fill(-1), thr: F(), ph: F(), tm: F(), st: U(), tt: F(), s: F(), lat: F(), spd: F(), grp: new Int32Array(n1), vis: F(), face: U(), fr: U(), k: F(), gm: F(), gx: F(), gz: F(), wet: U(), built: U(), tint: F(), mir: I(), mx: F(), mz: F() }
    const f = this.f
    const rand = mulberry32(1976)
    specs.forEach((sp, i) => {
      f.src[i] = sp.src
      f.rec[i] = sp.rec
      f.mode[i] = sp.mode
      f.row[i] = sp.row.y
      f.x[i] = sp.x
      f.z[i] = sp.z
      f.hx[i] = sp.hx
      f.hz[i] = sp.hz
      f.dx[i] = sp.dx
      f.dy[i] = sp.dy
      f.face0[i] = sp.face0 ?? -1
      f.thr[i] = sp.thr ?? rand()
      f.ph[i] = sp.ph ?? rand()
      f.tm[i] = 1 + rand() * 8
      f.s[i] = sp.s ?? 0
      f.lat[i] = sp.lat ?? 0
      f.spd[i] = sp.spd ?? 1
      f.grp[i] = sp.grp ?? -1
      f.tint[i] = 0.9 + rand() * 0.18
      f.gx[i] = 1e9
      f.mir[i] = rand() < 0.5 ? 1 : -1
    })
    // (the tools' view: per figure x, z, how much shows, its scale)
    this.marks = new Float32Array(n1 * 4)

    const tex = new THREE.DataTexture(this.sheet.data, this.sheet.width, this.sheet.height, THREE.RGBAFormat, THREE.UnsignedByteType)
    tex.minFilter = tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    this.texture = tex
    this.cap = Math.max(1, Math.min(N, MAX_DRAWN))
    const capI = this.cap * 2
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]), 3))
    g.setIndex([0, 1, 2, 0, 2, 3])
    const attr = (name) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(capI * 4), 4)
      a.setUsage(THREE.DynamicDrawUsage)
      g.setAttribute(name, a)
      return a
    }
    this.aFoot = attr('aFoot')
    this.aCell = attr('aCell')
    this.aDraw = attr('aDraw')
    this.aMix = attr('aMix')
    this.attrs = [this.aFoot, this.aCell, this.aDraw, this.aMix]
    g.instanceCount = 0
    this.geometry = g
    this.range = { start: 0, count: 0 }
    this.own = { uSheet: { value: tex }, uViewport: { value: new THREE.Vector2(1, 1) }, uPxW: { value: 0.001 }, uFigS: { value: null }, uHasS: { value: 0 } }
    const uniforms = { ...shared.uniforms, ...this.own }
    this.material = new THREE.ShaderMaterial({ vertexShader: spriteVertex, fragmentShader: spriteFragment, uniforms, transparent: true, blending: THREE.NoBlending, depthWrite: true })
    this.shadowMaterial = new THREE.ShaderMaterial({ vertexShader: shadowVertex, fragmentShader: shadowFragment, uniforms, transparent: true, depthWrite: false, blending: THREE.MultiplyBlending })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 8
    this.shadows = new THREE.Mesh(g, this.shadowMaterial)
    this.shadows.frustumCulled = false
    this.shadows.renderOrder = 7
    this.group = new THREE.Group()
    this.group.name = 'people'
    this.group.add(this.shadows, this.mesh)
    this.scale = new Scale()
    this.view = { rx: 1, rz: 0, ax: 0, az: -1, sinP: 0.5 }
    this.time = 0
    this.frame = 0
    this.thin = 1
    this.drawn = 0
    this.unit = 0.03
    this._size = new THREE.Vector2()
    this._v4 = new THREE.Vector4()
  }

  /** A row of the sheet for a body in a dress, the k-th of its colourings. */
  rowFor(body, dress, k) {
    const list = this.sheet.of(body, dress)
    return list[k % list.length]
  }

  /** Which way the open sea lies from (x, z): the way most of the water within 3 km lies, else null. */
  openSea(x, z) {
    let sx = 0
    let sz = 0
    for (let a = 0; a < 48; a++) {
      const dx = Math.cos((a / 48) * Math.PI * 2)
      const dz = Math.sin((a / 48) * Math.PI * 2)
      let n = 0
      for (let r = 0.1; r <= 30; r += 0.1) if (this.ground(x + dx * r, z + dz * r) <= 0) n++
      sx += dx * n
      sz += dz * n
    }
    const l = Math.hypot(sx, sz)
    return l > 1e-6 ? [sx / l, sz / l] : null
  }

  /**
   * Which way the sea lies from (x, z): toward the nearest water within 800 m
   * that lies the way of the open sea (`toward`, within a right angle of it:
   * not a pond or a lagoon behind), else null.
   */
  seaFrom(x, z, toward = null) {
    let best = null
    let bd = Infinity
    for (let a = 0; a < 24; a++) {
      const dx = Math.cos((a / 24) * Math.PI * 2)
      const dz = Math.sin((a / 24) * Math.PI * 2)
      if (toward && dx * toward[0] + dz * toward[1] < 0.3) continue
      for (let r = 0.04; r < Math.min(bd, 8); r += 0.04) {
        if (this.ground(x + dx * r, z + dz * r) <= 0) {
          if (r < bd) {
            bd = r
            best = [dx, dz]
          }
          break
        }
      }
    }
    return best
  }

  /** Lay out a crowd's people over its polygon. */
  planCrowd(c, ci, specs) {
    const p = c.p
    const rand = mulberry32(hashOf(c.id))
    const rings = c.rings
    const ring = rings[0]
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
    c.area = Math.max(1e-6, areaOf(ring) - rings.slice(1).reduce((a, h) => a + areaOf(h), 0))
    // (world units are 100 m: the area in m² is 10⁴ times it)
    const want = Number.isFinite(p.count) ? p.count : Number.isFinite(p.density) ? p.density * c.area * 1e4 : 200
    const n = Math.max(1, Math.min(MAX_PER_CROWD, Math.round(want)))
    c.wanted = Math.round(want)
    const facing = p.facing
    const bearing = Number.isFinite(facing) ? [Math.sin((facing * Math.PI) / 180), -Math.cos((facing * Math.PI) / 180)] : null
    const seaCache = new Map()
    const headingAt = (x, z) => {
      if (bearing) return bearing
      const key = `${Math.round(x * 20)},${Math.round(z * 20)}`
      if (!seaCache.has(key)) seaCache.set(key, this.seaFrom(x, z, c.sea) || c.sea || [0, 1])
      return seaCache.get(key)
    }
    const cx = ring.reduce((s, q) => s + q[0], 0) / ring.length
    const cz = ring.reduce((s, q) => s + q[1], 0) / ring.length
    c.sea = this.openSea(cx, cz)
    // a spot on dry, not too steep ground inside the polygon
    const spot = () => {
      for (let t = 0; t < 40; t++) {
        const x = x0 + rand() * (x1 - x0)
        const z = z0 + rand() * (z1 - z0)
        if (!inPoly(rings, x, z)) continue
        const g = this.ground(x, z)
        if (g < 0.4) continue
        const sl = Math.abs(this.ground(x + 0.03, z) - this.ground(x - 0.03, z)) + Math.abs(this.ground(x, z + 0.03) - this.ground(x, z - 0.03))
        if (sl > 12) continue
        return [x, z]
      }
      return null
    }
    const dress = CROWD_DRESS.includes(p.dress) ? p.dress : '1970s'
    // who: mostly men and women, a share of children; a conch here and there
    const body = (mode) => {
      if (mode === MODE.chant && rand() < 0.35) return 'conch'
      const u = rand()
      return u < 0.4 ? 'man' : u < 0.8 ? 'woman' : u < 0.9 ? 'boy' : 'girl'
    }
    const row = (b) => this.rowFor(b, dress, Math.floor(rand() * 97))
    const shares = behaviourShares(p.behaviour)
    const keys = Object.keys(shares).filter((k) => CROWD_BEHAVIOURS.includes(k))
    if (!keys.length) keys.push('watch')
    // (largest remainder, so the counts match the shares within one)
    const raw = keys.map((k) => (shares[k] || 0) * n)
    const cnt = raw.map(Math.floor)
    let left = n - cnt.reduce((a, b) => a + b, 0)
    raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => left-- > 0 && cnt[i]++)
    c.o = specs.length
    c.by = {}
    let grp = ci * 100000
    // the procession's line: the polygon's long axis through its middle
    let axis = null
    keys.forEach((k, ki) => {
      let m = cnt[ki]
      c.by[k] = 0
      if (k === 'gather' || k === 'chant') {
        while (m > 0) {
          const at = spot()
          if (!at) break
          const size = Math.min(m, k === 'chant' ? 4 + Math.floor(rand() * 4) : 3 + Math.floor(rand() * 5))
          const h = headingAt(...at)
          const talk = k === 'gather' && rand() < 0.45
          const thr = rand()
          const ph = rand()
          grp++
          for (let q = 0; q < size; q++) {
            // set apart across the screen by whole sprite pixels, a row behind for a big knot
            const back = k === 'gather' && q >= 4 ? 1 : 0
            const slot = back ? q - 4 : q
            const span = (back ? size - 4 : Math.min(size, 4)) - 1
            const dx = Math.round((slot - span / 2) * (k === 'chant' ? 7 : 6) + (rand() - 0.5) * 2)
            const mode = k === 'chant' ? MODE.chant : MODE.stand
            specs.push({ src: 0, rec: ci, mode, row: row(body(mode)), x: at[0], z: at[1], hx: h[0], hz: h[1], dx, dy: back * 2, grp, thr, ph: k === 'chant' ? ph : rand(), face0: talk ? (dx < 0 ? FACE.right : dx > 0 ? FACE.left : -1) : -1 })
            c.by[k]++
          }
          m -= size
        }
      } else if (k === 'procession') {
        if (!axis) {
          let sxx = 0
          let szz = 0
          let sxz = 0
          for (const [x, z] of ring) {
            sxx += (x - cx) ** 2
            szz += (z - cz) ** 2
            sxz += (x - cx) * (z - cz)
          }
          const a = 0.5 * Math.atan2(2 * sxz, sxx - szz)
          const ux = Math.cos(a)
          const uz = Math.sin(a)
          let lo = Infinity
          let hi = -Infinity
          for (const [x, z] of ring) {
            const s = (x - cx) * ux + (z - cz) * uz
            lo = Math.min(lo, s)
            hi = Math.max(hi, s)
          }
          let wide = 0
          for (const [x, z] of ring) wide = Math.max(wide, Math.abs(-(x - cx) * uz + (z - cz) * ux))
          axis = { cx, cz, ux, uz, lo: lo * 0.85, hi: hi * 0.85, wide: wide * 0.4 }
          c.axis = axis
        }
        for (let q = 0; q < m; q++) {
          specs.push({ src: 0, rec: ci, mode: MODE.walk, row: row(body(MODE.walk)), s: rand(), lat: (rand() - 0.5) * 2 * axis.wide, spd: 0.8 + rand() * 0.4, hx: axis.ux, hz: axis.uz, dx: 0, dy: 0 })
          c.by[k]++
        }
      } else {
        for (let q = 0; q < m; q++) {
          const at = spot()
          if (!at) break
          const h = headingAt(...at)
          const mode = k === 'wave' ? MODE.wave : MODE.watch
          specs.push({ src: 0, rec: ci, mode, row: row(body(mode)), x: at[0], z: at[1], hx: h[0], hz: h[1], dx: 0, dy: 0 })
          c.by[k]++
        }
      }
    })
    c.n = specs.length - c.o
  }

  /**
   * Every frame: show is the near zoom's weight; each crowd's c.w its own (vessels.js); `crewAt(k,
   * out)` gives crew k's world x, z, foot metres, heading, how much shows and how fast its vessel
   * goes (m/s).
   */
  update(dt, show, crewAt) {
    const app = this.app
    const cam = app.camera
    const f = this.f
    if (this.hold) dt = 0
    this.time += dt
    this.frame++
    const T = this.time
    cam.updateMatrixWorld()
    const e = cam.matrixWorld.elements
    const V = this.view
    let l = Math.hypot(e[0], e[2]) || 1
    V.rx = e[0] / l
    V.rz = e[2] / l
    l = Math.hypot(e[8], e[10]) || 1
    V.ax = -e[8] / l
    V.az = -e[10] / l
    V.sinP = Math.max(0.05, Math.min(1, e[9]))
    const fx = -e[8]
    const fy = -e[9]
    const fz = -e[10]
    const cx = cam.position.x
    const cy = cam.position.y
    const cz = cam.position.z
    const size = app.pipeline?.size || app.renderer.getDrawingBufferSize(this._size)
    const dpr = size.y / Math.max(1, innerHeight)
    this.dpr = dpr
    const tanH = Math.tan((cam.fov * Math.PI) / 360)
    this.own.uViewport.value.set(size.x, size.y)
    this.own.uPxW.value = (2 * tanH) / Math.max(1, size.y)
    const shadowTex = app.districts?.on ? app.districts.cur?.terrain?.shadow?.texture : null
    this.own.uFigS.value = shadowTex || null
    this.own.uHasS.value = shadowTex ? 1 : 0
    const vert = app.world.uniforms.uVert.value
    const D = app.districts
    const g0 = D?.on ? 1 + D.k : 0
    const g2 = app.timeline?.year ?? 0
    const stale = g0 !== this._g0 || g2 !== this._g2
    this._g0 = g0
    this._g2 = g2
    // what the town has built in the year (its clearing map over the district)
    const S = this.settlements
    const clear = S?.clearData
    const cr = clear ? S.rec.d.rect : null
    const clearV = clear ? `${S.yearCleared}/${S.townsCleared}` : ''
    const restamp = clearV !== this._clearV
    this._clearV = clearV
    const d0 = app.rig?.state?.distance ?? 16
    const sc = this.hold ? this.scale : this.scale.step(wantScale(d0, dpr), dt, 2, Math.max(2, Math.round(4 * dpr)))
    const unit = ((sc.L / dpr) * d0 * 2 * tanH) / Math.max(1, innerHeight)
    this.unit = unit
    const fade = dt > 0 ? dt / FADE_S : 1
    const kA = sc.k
    const tB = sc.t
    const drawA = tB <= 15.5 / 16
    const drawB = tB > 0.5 / 16
    const foot = this.aFoot.array
    const cell = this.aCell.array
    const draw = this.aDraw.array
    const mix = this.aMix.array
    const M = this.marks
    const cap = this.cap
    // how many of a crowd the polygon holds on the screen: about a figure to every 4 by 3 sprite pixels of it
    // (about a figure to every 6 by 5 sprite pixels of the screen, the ground foreshortened by the pitch)
    for (const c of this.crowds) c.fit = Math.min(1, c.area / Math.max(1e-9, c.n * 6 * unit * ((5 * unit) / V.sinP)))
    let j = 0
    let figures = 0
    let wanted = 0
    const tmp = this._crew || (this._crew = new Float32Array(6))
    for (let i = 0; i < this.count; i++) {
      const mode = f.mode[i]
      const crew = f.src[i] === 1
      let w
      let x = f.x[i]
      let z = f.z[i]
      let hx = f.hx[i]
      let hz = f.hz[i]
      let metres = 0
      let anim = 'idle'
      let fi = 0
      let speed = 0
      if (crew) {
        crewAt(f.rec[i], tmp)
        x = tmp[0]
        z = tmp[1]
        metres = tmp[2]
        hx = Math.cos(tmp[3])
        hz = Math.sin(tmp[3])
        w = tmp[4] * show
        speed = tmp[5]
      } else {
        const c = this.crowds[f.rec[i]]
        w = c.w * show * c.fit * this.thin
        if (w <= 0.002 && f.vis[i] <= 0) continue
      }
      let on = crew ? w > 0.01 : w > f.thr[i]
      if (mode === MODE.walk) {
        const c = this.crowds[f.rec[i]]
        const A = c.axis
        const L = A.hi - A.lo
        let s = f.s[i] + (GAIT * unit * f.spd[i] * dt) / Math.max(1e-6, L)
        if (s > 1) s -= 1
        f.s[i] = s
        const along = A.lo + s * L
        x = A.cx + A.ux * along - A.uz * f.lat[i]
        z = A.cz + A.uz * along + A.ux * f.lat[i]
        anim = 'walk'
        f.ph[i] = (f.ph[i] + 0.8 * f.spd[i] * dt) % 1
        fi = Math.floor(f.ph[i] * 4) % 4
        // (dissolving over the last stretch, to come in again at the start)
        if (s > 0.92 || s < 0.03) on = false
      } else if (mode === MODE.wave) {
        f.tm[i] -= dt
        if (f.st[i] === 1) {
          anim = 'wave'
          fi = Math.floor((T + f.ph[i]) * 3.2) & 1
          if (f.tm[i] <= 0) {
            f.st[i] = 0
            f.tm[i] = 2 + Math.random() * 7
          }
        } else {
          fi = Math.floor(T / (1.6 + f.tint[i]) + f.ph[i] * 2) & 1
          if (f.tm[i] <= 0) {
            f.st[i] = 1
            f.tm[i] = 1.2 + Math.random() * 2
          }
        }
      } else if (mode === MODE.chant) {
        // (the knot in unison: its phase is the knot's)
        const u = (T * 0.45 + f.ph[i]) % 1
        anim = 'chant'
        fi = u < 0.5 ? 0 : 1
      } else if (mode === MODE.paddle) {
        anim = speed > 0.2 ? 'paddle' : 'idle'
        fi = speed > 0.2 ? Math.floor((T * (0.9 + 0.25 * speed) + f.ph[i]) * 2) & 1 : 0
      } else {
        fi = Math.floor(T / (mode === MODE.watch ? 2.6 : 1.9) + f.tint[i] * 3 + f.ph[i] * 2) & 1
      }
      if (!crew) {
        // (looked up again as it moves, as the ground changes, now and then, and before it comes in)
        if (stale || f.vis[i] <= 0 || mode === MODE.walk || Math.abs(x - f.gx[i]) + Math.abs(z - f.gz[i]) > 0.01 || (this.frame + i) % 30 === 0) {
          f.gm[i] = app.world.metresAt(x, z)
          f.gx[i] = x
          f.gz[i] = z
          f.wet[i] = f.gm[i] < 0.15 ? 1 : 0
          if (clear) f.built[i] = builtAt(clear, S.clearN, cr, x, z) ? 1 : 0
          if (mode === MODE.walk) {
            // (one walking looks as far ahead as it goes while it dissolves, so it is gone before it
            // reaches the water or a building, and back once past)
            const c = this.crowds[f.rec[i]]
            const r = GAIT * unit * f.spd[i] * FADE_S * 1.5
            const ax = x + c.axis.ux * r
            const az = z + c.axis.uz * r
            if (app.world.metresAt(ax, az) < 0.15 || (clear && builtAt(clear, S.clearN, cr, ax, az))) f.wet[i] = 2
          }
        } else if (restamp && clear) f.built[i] = builtAt(clear, S.clearN, cr, x, z) ? 1 : 0
        if (!clear) f.built[i] = 0
        metres = f.gm[i]
        if (f.wet[i] || f.built[i]) on = false
      }
      const gy = Math.max(metres, 0) * vert
      const depth = (x - cx) * fx + (gy - cy) * fy + (z - cz) * fz
      if (depth < 0.05) on = false
      if (on && !crew) wanted++
      let vis = f.vis[i]
      vis = on ? Math.min(1, vis + fade) : Math.max(0, vis - fade)
      if (w <= 0.002) vis = 0
      f.vis[i] = vis
      f.x[i] = crew ? x : f.x[i]
      f.z[i] = crew ? z : f.z[i]
      if (mode === MODE.walk) {
        f.mx[i] = x
        f.mz[i] = z
      }
      let facing = f.face0[i] >= 0 ? f.face0[i] : this.faceOf(hx, hz, f.face[i])
      f.face[i] = facing
      const mirror = facing === FACE.left ? -1 : facing === FACE.right ? 1 : f.mir[i]
      const [first] = ANIM[anim]
      f.fr[i] = first + fi
      const k = tB < 0.5 ? kA : kA + 1
      f.k[i] = vis > 0 ? k : 0
      const m4 = i * 4
      M[m4] = x
      M[m4 + 1] = z
      M[m4 + 2] = vis
      M[m4 + 3] = f.k[i]
      f.gm[i] = crew ? metres : f.gm[i]
      if (vis <= 0 || figures >= cap) continue
      figures++
      const cellX = (COLUMN[facing] * FRAMES + first + fi) * SW
      for (let cc = 0; cc < 2; cc++) {
        if (cc === 0 ? !drawA : !drawB) continue
        const o = j * 4
        foot[o] = x
        foot[o + 1] = metres
        foot[o + 2] = z
        foot[o + 3] = crew ? 0.02 : 0
        cell[o] = cellX
        cell[o + 1] = f.row[i]
        cell[o + 2] = SW
        cell[o + 3] = SH
        draw[o] = cc === 0 ? kA : kA + 1
        draw[o + 1] = mirror * f.tint[i]
        draw[o + 2] = vis
        draw[o + 3] = f.dx[i]
        mix[o] = cc === 0 ? tB : 0
        mix[o + 1] = cc === 0 ? 1 : tB
        mix[o + 2] = f.dy[i]
        mix[o + 3] = crew ? 0 : SW
        j++
      }
    }
    if (wanted > cap) this.thin = Math.max(0.1, this.thin * 0.92)
    else if (wanted < cap * 0.85 && this.thin < 1) this.thin = Math.min(1, this.thin * 1.04)
    this.drawn = figures
    this.instances = j
    this.geometry.instanceCount = j
    this.group.visible = j > 0
    if (j > 0) {
      this.range.count = j * 4
      for (const a of this.attrs) {
        a.clearUpdateRanges()
        a.updateRanges.push(this.range)
        a.needsUpdate = true
      }
    }
  }

  /** As soldiers.js: the facing a heading on the ground takes as the camera sees it, held until another wins by HOLD. */
  faceOf(hx, hz, cur) {
    const V = this.view
    const a = hx * V.rx + hz * V.rz
    const b = hx * V.ax + hz * V.az
    if (a * a + b * b < 1e-12) return cur
    const end = cur >= FACE.front
    if (end ? Math.abs(a) <= HOLD * Math.abs(b) : Math.abs(b) > HOLD * Math.abs(a)) return b > 0 ? FACE.back : FACE.front
    return a > 0 ? FACE.right : FACE.left
  }

  /** For the tools: the figures shown, with where each stands, what it does, and its frame. */
  shown(src = null) {
    const f = this.f
    const out = []
    const modes = Object.keys(MODE)
    for (let i = 0; i < this.count; i++) {
      if (f.vis[i] <= 0 || (src !== null && f.src[i] !== src)) continue
      const walk = f.mode[i] === MODE.walk
      out.push({ i, crowd: f.src[i] === 0 ? this.crowds[f.rec[i]].id : null, vessel: f.src[i] === 1 ? this.crews[f.rec[i]].vessel : null, mode: modes[f.mode[i]], x: walk ? f.mx[i] : f.x[i], z: walk ? f.mz[i] : f.z[i], hx: f.hx[i], hz: f.hz[i], gm: f.gm[i], fr: f.fr[i], face: f.face[i], k: f.k[i] })
    }
    return out
  }

  /** For the tools: where figure i stands on the screen, as the shader puts it (target pixels from the top left). */
  screenRect(i) {
    const f = this.f
    if (f.vis[i] <= 0 || !f.k[i]) return null
    const cam = this.app.camera
    const walk = f.mode[i] === MODE.walk
    const v = this._v4.set(walk ? f.mx[i] : f.x[i], Math.max(f.gm[i], 0) * this.app.world.uniforms.uVert.value, walk ? f.mz[i] : f.z[i], 1)
    v.applyMatrix4(cam.matrixWorldInverse).applyMatrix4(cam.projectionMatrix)
    if (v.w <= 0) return null
    const Wd = this.own.uViewport.value.x
    const Ht = this.own.uViewport.value.y
    const k = f.k[i]
    const px = Math.floor(((v.x / v.w) * 0.5 + 0.5) * Wd + 0.5) + f.dx[i] * k
    const py = Math.floor(((v.y / v.w) * 0.5 + 0.5) * Ht + 0.5) + f.dy[i] * k
    return { x: px - (SW * k) / 2, y: Ht - py - SH * k, w: SW * k, h: SH * k, k }
  }

  stats() {
    const f = this.f
    const out = { planned: this.count, crew: this.count - this.crewFrom, drawn: this.drawn, instances: this.instances, k: this.scale.k, t: +this.scale.t.toFixed(3), by: {}, crowds: this.crowds.map((c) => ({ id: c.id, planned: c.n, wanted: c.wanted, by: c.by, w: +c.w.toFixed(2) })) }
    const modes = Object.keys(MODE)
    for (let i = 0; i < this.count; i++) if (f.vis[i] > 0) out.by[modes[f.mode[i]]] = (out.by[modes[f.mode[i]]] || 0) + 1
    return out
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.shadowMaterial.dispose()
    this.texture.dispose()
    this.disposed = true
  }

  static MODE = MODE
}

/** Whether the town has built over (x, z) in the year: its clearing map there past half. */
function builtAt(D, N, r, x, z) {
  const i = Math.floor(((x - r.x0) / (r.x1 - r.x0)) * N)
  const j = Math.floor(((z - r.z0) / (r.z1 - r.z0)) * N)
  if (i < 0 || j < 0 || i >= N || j >= N) return false
  return D[j * N + i] > 128
}

/** Metres of foot height for a point y metres up a model built at scale s (kit.js Y: built at the valley's exaggeration). */
export const footMetres = (y, s) => (y * s * 100) / NEAR_EXAG
